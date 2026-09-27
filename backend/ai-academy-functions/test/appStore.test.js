const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const { UnsecuredJWT } = require("jose");
const access = require("../src/lib/access");

// A throwaway EC key so apiToken() can sign in tests.
const { privateKey } = crypto.generateKeyPairSync("ec", { namedCurve: "P-256" });
process.env.APPLE_IAP_PRIVATE_KEY = Buffer.from(privateKey.export({ type: "pkcs8", format: "pem" })).toString("base64");
process.env.APPLE_IAP_KEY_ID = "TESTKEY123";
process.env.APPLE_IAP_ISSUER_ID = "00000000-0000-0000-0000-000000000000";
process.env.APPLE_BUNDLE_ID = "org.bsoedu.aiacademy";
const appStore = require("../src/lib/appStore");

const jws = (claims) => new UnsecuredJWT(claims).encode();
const tx = (productId, expires, extra = {}) =>
  jws({ bundleId: "org.bsoedu.aiacademy", originalTransactionId: "1000", productId, expiresDate: expires, ...extra });
const statusBody = (items) => ({ data: [{ subscriptionGroupIdentifier: "22417579", lastTransactions: items }] });
const response = (status, body) => ({ status, ok: status < 300, json: async () => body });

test("looks up production, then sandbox; picks the latest transaction", async () => {
  const calls = [];
  const now = Date.now();
  const fetchImpl = async (url) => {
    calls.push(url);
    if (url.includes("sandbox")) {
      return response(200, statusBody([
        { status: 2, signedTransactionInfo: tx("org.bsoedu.aiacademy.allaccess.monthly", now - 1000) },
        { status: 1, signedTransactionInfo: tx("org.bsoedu.aiacademy.allaccess.yearly", now + 86400000) },
      ]));
    }
    return response(401, {});
  };
  const sub = await appStore.lookupSubscription("2000000123", { fetchImpl });
  assert.equal(calls.length, 2);
  assert.equal(sub.environment, "Sandbox");
  assert.equal(sub.productId, "org.bsoedu.aiacademy.allaccess.yearly");
  assert.equal(sub.status, "active");
  assert.equal(appStore.grantsAccess(sub), true);
  assert.equal(appStore.grantsAccess({ status: "grace_period" }), true);
  assert.equal(appStore.grantsAccess({ status: "revoked" }), false);
});

test("rejects malformed ids and other apps' transactions; unknown ids give null", async () => {
  assert.equal(await appStore.lookupSubscription("abc; DROP"), null);
  const other = async () => response(200, statusBody([{ status: 1, signedTransactionInfo: tx("x", Date.now() + 1e6, { bundleId: "com.other.app" }) }]));
  assert.equal(await appStore.lookupSubscription("1", { fetchImpl: other }), null);
  assert.equal(await appStore.lookupSubscription("1", { fetchImpl: async () => response(404, {}) }), null);
  await assert.rejects(appStore.lookupSubscription("1", { fetchImpl: async () => response(500, {}) }));
});

test("notification: only the transaction id is read", () => {
  const body = { signedPayload: jws({ notificationType: "DID_RENEW", data: { signedTransactionInfo: tx("p", 1) } }) };
  assert.equal(appStore.notificationTransactionId(body), "1000");
  assert.equal(appStore.notificationTransactionId({ signedPayload: "junk" }), null);
});

test("sandbox purchases only count for test accounts and admins", () => {
  const saved = process.env.APPLE_SANDBOX_OPEN;
  delete process.env.APPLE_SANDBOX_OPEN;
  assert.equal(access.sandboxAllowed({ username: "jane@gmail.com" }), false);
  assert.equal(access.sandboxAllowed({ username: "appreview@bsoedu.org" }), true);
  assert.equal(access.sandboxAllowed({ username: "x@y.z", isAdmin: true }), true);
  process.env.APPLE_SANDBOX_OPEN = "1";
  assert.equal(access.sandboxAllowed({ username: "jane@gmail.com" }), true);
  if (saved === undefined) delete process.env.APPLE_SANDBOX_OPEN;
  else process.env.APPLE_SANDBOX_OPEN = saved;
});
