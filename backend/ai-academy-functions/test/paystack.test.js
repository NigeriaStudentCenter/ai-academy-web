const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

process.env.PAYSTACK_SECRET_KEY = "sk_test_example";
process.env.PAYSTACK_PLAN_MONTHLY = "PLN_month";
process.env.PAYSTACK_PLAN_YEARLY = "PLN_year";
const paystack = require("../src/lib/paystack");
const access = require("../src/lib/access");

const NOW = Date.parse("2026-10-11T12:00:00Z");
const sub = (status, plan, next, code = "SUB_1") => ({
  status,
  subscription_code: code,
  next_payment_date: next,
  plan: { plan_code: plan },
});
const response = (status, data) => ({ status, ok: status < 300, json: async () => ({ status: status < 300, data }) });

test("plan codes map both ways", () => {
  assert.equal(paystack.planCode("monthly"), "PLN_month");
  assert.equal(paystack.planCode("yearly"), "PLN_year");
  assert.equal(paystack.planCode("weekly"), null);
  assert.equal(paystack.planName("PLN_year"), "yearly");
  assert.equal(paystack.planName("PLN_other"), null);
});

test("toSubscription: active keeps a renewal grace; cancelled is paid up to the date; others lapse", () => {
  const active = paystack.toSubscription(sub("active", "PLN_month", "2026-11-11T00:00:00Z"), "CUS_1", NOW);
  assert.equal(active.productId, "org.bsoedu.aiacademy.allaccess.monthly");
  assert.equal(active.status, "active");
  assert.equal(active.grants, true);
  assert.equal(active.purchaseToken, "CUS_1");
  assert.equal(active.environment, "Sandbox");
  assert.ok(Date.parse(active.expiresAt) > Date.parse("2026-11-11T00:00:00Z"));

  // Renewal due yesterday, Paystack still charging: grace keeps access.
  assert.equal(paystack.toSubscription(sub("active", "PLN_month", "2026-10-10T12:00:00Z"), "CUS_1", NOW).grants, true);

  const cancelled = paystack.toSubscription(sub("non-renewing", "PLN_year", "2027-01-01T00:00:00Z"), "CUS_1", NOW);
  assert.equal(cancelled.status, "canceled");
  assert.equal(cancelled.productId, "org.bsoedu.aiacademy.allaccess.yearly");
  assert.equal(cancelled.grants, true);
  assert.equal(paystack.toSubscription(sub("non-renewing", "PLN_year", "2026-10-01T00:00:00Z"), "CUS_1", NOW).grants, false);

  assert.equal(paystack.toSubscription(sub("attention", "PLN_month", "2026-11-01T00:00:00Z"), "CUS_1", NOW).grants, false);
  assert.equal(paystack.toSubscription(sub("cancelled", "PLN_month", "2026-11-01T00:00:00Z"), "CUS_1", NOW).grants, false);
  // Someone else's plan on the same Paystack account (e.g. another product) is ignored.
  assert.equal(paystack.toSubscription(sub("active", "PLN_estate", "2026-11-01T00:00:00Z"), "CUS_1", NOW), null);
});

test("customerSubscription picks the live AI Academy subscription", async () => {
  const fetchImpl = async (url) => {
    assert.match(url, /\/customer\/CUS_9$/);
    return response(200, {
      customer_code: "CUS_9",
      subscriptions: [
        sub("cancelled", "PLN_month", "2026-09-01T00:00:00Z", "SUB_old"),
        sub("active", "PLN_year", "2027-10-01T00:00:00Z", "SUB_new"),
        sub("active", "PLN_estate", "2027-12-01T00:00:00Z", "SUB_other"),
      ],
    });
  };
  const best = await paystack.customerSubscription("CUS_9", { fetchImpl, now: NOW });
  assert.equal(best.originalTransactionId, "SUB_new");
  assert.equal(best.grants, true);
  assert.equal(await paystack.customerSubscription("CUS_9", { fetchImpl: async () => response(200, { customer_code: "CUS_9", subscriptions: [] }) }), null);
});

test("webhook signature is HMAC SHA-512 of the raw body with the secret key", () => {
  const raw = JSON.stringify({ event: "charge.success", data: {} });
  const good = crypto.createHmac("sha512", "sk_test_example").update(raw).digest("hex");
  assert.equal(paystack.validSignature(raw, good), true);
  assert.equal(paystack.validSignature(raw + " ", good), false);
  assert.equal(paystack.validSignature(raw, "deadbeef"), false);
  assert.equal(paystack.validSignature(raw, null), false);
});

test("startCheckout sends the plan, our metadata and the callback", async () => {
  let sent;
  const fetchImpl = async (url, init) => {
    sent = { url, body: JSON.parse(init.body), auth: init.headers.Authorization };
    return response(200, { authorization_url: "https://checkout.paystack.com/abc", reference: "ref123" });
  };
  const out = await paystack.startCheckout({ email: "ada@example.com", userId: "user-1", plan: "yearly" }, { fetchImpl });
  assert.equal(out.url, "https://checkout.paystack.com/abc");
  assert.equal(sent.url, "https://api.paystack.co/transaction/initialize");
  assert.equal(sent.auth, "Bearer sk_test_example");
  assert.equal(sent.body.plan, "PLN_year");
  assert.deepEqual(sent.body.metadata, { userId: "user-1", plan: "yearly", product: "ai-academy-all-access" });
  assert.match(sent.body.callback_url, /subscribe-done\.html$/);
});

test("verifyTransaction rejects junk references without calling Paystack", async () => {
  let called = false;
  assert.equal(await paystack.verifyTransaction("../x", { fetchImpl: async () => { called = true; } }), null);
  assert.equal(called, false);
});

test("refreshExpired re-reads a lapsed Paystack subscription (renewal)", async () => {
  const lapsed = {
    platform: "paystack", status: "active", purchaseToken: "CUS_1",
    expiresAt: "2026-10-09T00:00:00Z", updatedAt: "2026-10-09T00:00:00Z",
  };
  const saved = [];
  const renewed = { originalTransactionId: "SUB_1", purchaseToken: "CUS_1", productId: "x", status: "active", expiresAt: "2026-11-14T00:00:00Z", grants: true };
  const out = await access.refreshExpired("user-1", lapsed, {
    now: NOW, lookup: async () => renewed, save: async (...args) => saved.push(args),
  });
  assert.equal(access.isActive(out, NOW), true);
  assert.equal(saved[0][1], "paystack");
  assert.equal(saved[0][3].grants, true);
});
