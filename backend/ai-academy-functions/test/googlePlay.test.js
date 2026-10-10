const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const access = require("../src/lib/access");

// A throwaway RSA key standing in for the service account.
const { privateKey } = crypto.generateKeyPairSync("rsa", { modulusLength: 2048 });
process.env.GOOGLE_PLAY_SERVICE_ACCOUNT = Buffer.from(
  JSON.stringify({ client_email: "play@test.iam.gserviceaccount.com", private_key: privateKey.export({ type: "pkcs8", format: "pem" }) })
).toString("base64");
const googlePlay = require("../src/lib/googlePlay");

const TOKEN = "abcdefghijklmnopqrstuvwxyz.AO-J1Oz_test_token";
const response = (status, body) => ({ status, ok: status < 300, json: async () => body });
const subBody = (state, expiry, extra = {}) => ({
  subscriptionState: state,
  acknowledgementState: "ACKNOWLEDGEMENT_STATE_PENDING",
  externalAccountIdentifiers: { obfuscatedExternalAccountId: "user-1" },
  lineItems: [{ productId: "org.bsoedu.aiacademy.allaccess.monthly", expiryTime: expiry }],
  ...extra,
});

/** fetch stub: OAuth token first, then the given API responses in order. */
function fakeFetch(...responses) {
  const calls = [];
  const fn = async (url, init) => {
    calls.push({ url, init });
    if (url.startsWith("https://oauth2.googleapis.com")) return response(200, { access_token: "tok", expires_in: 3600 });
    return responses.shift();
  };
  fn.calls = calls;
  return fn;
}

test("lookupSubscription maps an active subscription", async () => {
  const fetchImpl = fakeFetch(response(200, subBody("SUBSCRIPTION_STATE_ACTIVE", "2030-01-01T00:00:00Z")));
  const sub = await googlePlay.lookupSubscription(TOKEN, { fetchImpl });
  assert.equal(sub.productId, "org.bsoedu.aiacademy.allaccess.monthly");
  assert.equal(sub.status, "active");
  assert.equal(sub.environment, "Production");
  assert.equal(sub.accountId, "user-1");
  assert.equal(sub.purchaseToken, TOKEN);
  assert.equal(sub.originalTransactionId, googlePlay.tokenId(TOKEN));
  assert.equal(sub.acknowledged, false);
  const api = fetchImpl.calls.find((c) => c.url.includes("subscriptionsv2"));
  assert.match(api.url, /applications\/org\.bsoedu\.aiacademy\/purchases\/subscriptionsv2\/tokens\//);
  assert.equal(api.init.headers.Authorization, "Bearer tok");
});

test("lookupSubscription: test purchases are Sandbox, unknown tokens are null, junk is rejected", async () => {
  const sandbox = await googlePlay.lookupSubscription(TOKEN, {
    fetchImpl: fakeFetch(response(200, subBody("SUBSCRIPTION_STATE_ACTIVE", "2030-01-01T00:00:00Z", { testPurchase: {} }))),
  });
  assert.equal(sandbox.environment, "Sandbox");
  assert.equal(await googlePlay.lookupSubscription(TOKEN, { fetchImpl: fakeFetch(response(404, {})) }), null);
  assert.equal(await googlePlay.lookupSubscription("../../etc", { fetchImpl: fakeFetch() }), null);
  await assert.rejects(googlePlay.lookupSubscription(TOKEN, { fetchImpl: fakeFetch(response(500, {})) }));
});

test("grantsAccess: active, grace period, and cancelled-but-paid-up", () => {
  const now = Date.parse("2026-10-10T00:00:00Z");
  const future = "2026-11-10T00:00:00Z";
  const past = "2026-09-10T00:00:00Z";
  assert.equal(googlePlay.grantsAccess({ status: "active", expiresAt: future }, now), true);
  assert.equal(googlePlay.grantsAccess({ status: "grace_period", expiresAt: past }, now), true);
  assert.equal(googlePlay.grantsAccess({ status: "canceled", expiresAt: future }, now), true);
  assert.equal(googlePlay.grantsAccess({ status: "canceled", expiresAt: past }, now), false);
  assert.equal(googlePlay.grantsAccess({ status: "billing_retry", expiresAt: future }, now), false);
  assert.equal(googlePlay.grantsAccess({ status: "expired", expiresAt: past }, now), false);
});

test("acknowledge skips acknowledged purchases and tolerates 'already acknowledged'", async () => {
  const sub = { productId: "org.bsoedu.aiacademy.allaccess.monthly", purchaseToken: TOKEN, acknowledged: false };
  const fetchImpl = fakeFetch(response(400, {}));
  await googlePlay.acknowledge(sub, { fetchImpl });
  assert.match(fetchImpl.calls.at(-1).url, /purchases\/subscriptions\/org\.bsoedu\.aiacademy\.allaccess\.monthly\/tokens\/.+:acknowledge$/);
  const none = fakeFetch();
  await googlePlay.acknowledge({ ...sub, acknowledged: true }, { fetchImpl: none });
  assert.equal(none.calls.length, 0);
});

test("notificationPurchaseToken reads a Pub/Sub push body for our package only", () => {
  const push = (data) => ({ message: { data: Buffer.from(JSON.stringify(data)).toString("base64") } });
  assert.equal(
    googlePlay.notificationPurchaseToken(push({ packageName: "org.bsoedu.aiacademy", subscriptionNotification: { purchaseToken: TOKEN } })),
    TOKEN
  );
  assert.equal(googlePlay.notificationPurchaseToken(push({ packageName: "com.other", subscriptionNotification: { purchaseToken: TOKEN } })), null);
  assert.equal(googlePlay.notificationPurchaseToken({}), null);
});

test("refreshExpired re-reads a lapsed Google subscription (renewal) at most hourly", async () => {
  const now = Date.parse("2026-10-10T12:00:00Z");
  const lapsed = {
    platform: "google", status: "active", purchaseToken: TOKEN,
    expiresAt: "2026-10-09T00:00:00Z", updatedAt: "2026-10-09T00:00:00Z",
  };
  const saved = [];
  const renewed = { productId: "x", status: "active", expiresAt: "2026-11-09T00:00:00Z", purchaseToken: TOKEN, originalTransactionId: "h" };
  const out = await access.refreshExpired("user-1", lapsed, {
    now, lookup: async () => renewed, save: async (...args) => saved.push(args),
  });
  assert.equal(out.status, "active");
  assert.equal(out.expiresAt, "2026-11-09T00:00:00Z");
  assert.equal(access.isActive(out, now), true);
  assert.equal(saved.length, 1);

  // Checked within the last hour: no second call to Google.
  let called = false;
  const recent = { ...lapsed, updatedAt: "2026-10-10T11:30:00Z" };
  await access.refreshExpired("user-1", recent, { now, lookup: async () => { called = true; }, save: async () => {} });
  assert.equal(called, false);

  // Apple subscriptions and active ones are left alone.
  for (const sub of [{ ...lapsed, platform: "apple" }, { ...lapsed, expiresAt: "2026-12-01T00:00:00Z" }]) {
    assert.equal(await access.refreshExpired("user-1", sub, { now, lookup: async () => { called = true; } }), sub);
  }
  assert.equal(called, false);
});
