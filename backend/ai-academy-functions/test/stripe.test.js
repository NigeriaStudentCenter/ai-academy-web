const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

process.env.STRIPE_SECRET_KEY = "sk_test_example";
process.env.STRIPE_PRICE_MONTHLY = "price_month";
process.env.STRIPE_PRICE_YEARLY = "price_year";
const stripe = require("../src/lib/stripe");
const access = require("../src/lib/access");

const NOW = Date.parse("2026-10-19T12:00:00Z");
const sec = (iso) => Math.floor(Date.parse(iso) / 1000);
const sub = (status, price, endIso, extra = {}) => ({
  id: "sub_ABC123",
  object: "subscription",
  status,
  livemode: true,
  metadata: { owner: "email:ada@example.com" },
  items: { data: [{ price: { id: price }, current_period_end: sec(endIso) }] },
  ...extra,
});

test("form encoding handles nested objects and arrays", () => {
  const s = stripe.encode({ mode: "subscription", line_items: [{ price: "p_1", quantity: 1 }], metadata: { owner: "email:a@b.co" } });
  assert.equal(s, "mode=subscription&line_items%5B0%5D%5Bprice%5D=p_1&line_items%5B0%5D%5Bquantity%5D=1&metadata%5Bowner%5D=email%3Aa%40b.co");
});

test("toSubscription maps Stripe statuses", () => {
  const active = stripe.toSubscription(sub("active", "price_month", "2026-11-19T12:00:00Z"), NOW);
  assert.equal(active.status, "active");
  assert.equal(active.productId, "org.bsoedu.aiacademy.allaccess.monthly");
  assert.equal(active.owner, "email:ada@example.com");
  assert.equal(active.grants, true);

  const cancelling = stripe.toSubscription(sub("active", "price_year", "2027-01-01T00:00:00Z", { cancel_at_period_end: true }), NOW);
  assert.equal(cancelling.status, "canceled");
  assert.equal(cancelling.grants, true);

  const pastDue = stripe.toSubscription(sub("past_due", "price_month", "2026-10-18T12:00:00Z"), NOW);
  assert.equal(pastDue.status, "grace_period");
  assert.equal(pastDue.grants, true);

  assert.equal(stripe.toSubscription(sub("canceled", "price_month", "2026-11-01T00:00:00Z"), NOW).grants, false);
  assert.equal(stripe.toSubscription(sub("incomplete", "price_month", "2026-11-01T00:00:00Z"), NOW).grants, false);
  // Someone else's product on the same Stripe account is ignored.
  assert.equal(stripe.toSubscription(sub("active", "price_other", "2026-11-01T00:00:00Z"), NOW), null);
  // Older API versions keep current_period_end on the subscription.
  const old = sub("active", "price_month", "2026-11-19T12:00:00Z");
  old.current_period_end = old.items.data[0].current_period_end;
  delete old.items.data[0].current_period_end;
  assert.equal(stripe.toSubscription(old, NOW).grants, true);
});

test("webhook signature: t + v1 HMAC-SHA256 within 5 minutes", () => {
  const whsec = "whsec_test";
  const raw = JSON.stringify({ type: "invoice.paid" });
  const t = Math.floor(NOW / 1000);
  const v1 = crypto.createHmac("sha256", whsec).update(`${t}.${raw}`).digest("hex");
  const opts = { now: NOW, webhookSecret: whsec };
  assert.equal(stripe.validSignature(raw, `t=${t},v1=${v1}`, opts), true);
  assert.equal(stripe.validSignature(raw + " ", `t=${t},v1=${v1}`, opts), false);
  assert.equal(stripe.validSignature(raw, `t=${t - 3600},v1=${v1}`, opts), false);
  assert.equal(stripe.validSignature(raw, null, opts), false);
});

test("eventSubscriptionId finds the subscription on each event type", () => {
  assert.equal(stripe.eventSubscriptionId({ data: { object: { object: "subscription", id: "sub_1" } } }), "sub_1");
  assert.equal(stripe.eventSubscriptionId({ data: { object: { object: "checkout.session", subscription: "sub_2" } } }), "sub_2");
  assert.equal(stripe.eventSubscriptionId({ data: { object: { object: "invoice", subscription: "sub_3" } } }), "sub_3");
  assert.equal(stripe.eventSubscriptionId({ data: { object: { object: "invoice", parent: { subscription_details: { subscription: "sub_4" } } } } }), "sub_4");
  assert.equal(stripe.eventSubscriptionId({ data: { object: { object: "charge" } } }), null);
});

test("startCheckout creates a subscription session tied to the email owner", async () => {
  let sent;
  const fetchImpl = async (url, init) => {
    sent = { url, body: decodeURIComponent(init.body) };
    return { ok: true, status: 200, json: async () => ({ id: "cs_test_1234567890", url: "https://checkout.stripe.com/c/pay/x" }) };
  };
  const out = await stripe.startCheckout({ email: "ada@example.com", owner: "email:ada@example.com", plan: "yearly" }, { fetchImpl });
  assert.equal(out.url, "https://checkout.stripe.com/c/pay/x");
  assert.equal(sent.url, "https://api.stripe.com/v1/checkout/sessions");
  assert.match(sent.body, /mode=subscription/);
  assert.match(sent.body, /line_items\[0\]\[price\]=price_year/);
  assert.match(sent.body, /subscription_data\[metadata\]\[owner\]=email:ada@example.com/);
  assert.match(sent.body, /success_url=.*subscribe-done\.html\?stripe_session=\{CHECKOUT_SESSION_ID\}/);
});

test("refreshExpired re-reads a lapsed Stripe subscription", async () => {
  const lapsed = { platform: "stripe", status: "active", purchaseToken: "sub_ABC123", expiresAt: "2026-10-01T00:00:00Z", updatedAt: "2026-10-01T00:00:00Z" };
  const renewed = { originalTransactionId: "sub_ABC123", purchaseToken: "sub_ABC123", productId: "x", status: "active", expiresAt: "2026-11-22T00:00:00Z", grants: true };
  const saved = [];
  const out = await access.refreshExpired("email:ada@example.com", lapsed, { now: NOW, lookup: async () => renewed, save: async (...a) => saved.push(a) });
  assert.equal(access.isActive(out, NOW), true);
  assert.equal(saved[0][1], "stripe");
});
