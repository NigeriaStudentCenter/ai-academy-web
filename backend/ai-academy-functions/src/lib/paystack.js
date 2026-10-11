// Paystack: AI Academy All Access bought on the website (Nigeria, in naira).
// The app never shows or links to this — App Store / Google Play rules — but a
// learner who subscribes here gets full access when they sign in to the app,
// because access.js reads the same Subscriptions table for every store.
//
// As with Apple and Google we never trust the browser or the webhook body: the
// webhook signature is checked, and the subscription itself is re-read from
// the Paystack API before anything is granted.
//
// Settings: PAYSTACK_SECRET_KEY, PAYSTACK_PLAN_MONTHLY and PAYSTACK_PLAN_YEARLY
// (plan codes, see tools/paystack/create-plans.mjs) and optional
// PAYSTACK_CALLBACK_URL (where Paystack sends the browser after paying).

const crypto = require("crypto");

const API = "https://api.paystack.co";
const PRODUCT = {
  monthly: "org.bsoedu.aiacademy.allaccess.monthly",
  yearly: "org.bsoedu.aiacademy.allaccess.yearly",
};
// After a renewal date Paystack may take a day or two to charge; keep access meanwhile.
const RENEWAL_GRACE_MS = 3 * 24 * 3600e3;

const secret = () => process.env.PAYSTACK_SECRET_KEY || "";
const configured = () => !!(secret() && process.env.PAYSTACK_PLAN_MONTHLY && process.env.PAYSTACK_PLAN_YEARLY);

function planCode(plan) {
  return plan === "yearly" ? process.env.PAYSTACK_PLAN_YEARLY : plan === "monthly" ? process.env.PAYSTACK_PLAN_MONTHLY : null;
}

/** "monthly" | "yearly" | null for one of our plan codes. */
function planName(code) {
  if (code && code === process.env.PAYSTACK_PLAN_MONTHLY) return "monthly";
  if (code && code === process.env.PAYSTACK_PLAN_YEARLY) return "yearly";
  return null;
}

async function call(method, path, body, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.status === false) {
    const err = new Error(`Paystack ${method} ${path} → ${res.status}: ${json.message || ""}`);
    err.status = res.status;
    throw err;
  }
  return json.data;
}

/** The plans' current prices (kobo) for the subscribe page. */
async function plans(opts) {
  const out = {};
  for (const name of ["monthly", "yearly"]) {
    const p = await call("GET", `/plan/${encodeURIComponent(planCode(name))}`, null, opts);
    out[name] = { amountKobo: p.amount, currency: p.currency, interval: p.interval };
  }
  return out;
}

/** Starts a checkout; returns Paystack's hosted payment page URL. */
async function startCheckout({ email, userId, plan }, opts) {
  const data = await call(
    "POST",
    "/transaction/initialize",
    {
      email,
      amount: 100, // required by the API; the plan's own amount is what gets charged
      plan: planCode(plan),
      callback_url: process.env.PAYSTACK_CALLBACK_URL || "https://black-sky-0782ebe03.7.azurestaticapps.net/subscribe-done.html",
      metadata: { userId, plan, product: "ai-academy-all-access" },
      channels: ["card", "bank", "ussd", "bank_transfer"],
    },
    opts
  );
  return { url: data.authorization_url, reference: data.reference };
}

/** A transaction by reference (used after the browser comes back from Paystack). */
function verifyTransaction(reference, opts) {
  if (!/^[A-Za-z0-9._=-]{6,100}$/.test(String(reference || ""))) return Promise.resolve(null);
  return call("GET", `/transaction/verify/${encodeURIComponent(reference)}`, null, opts);
}

/**
 * Our view of a Paystack subscription, in the shape storeSubscriptions saves:
 * { originalTransactionId, purchaseToken (customer code), productId, status, expiresAt, environment }.
 */
function toSubscription(s, customerCode, now = Date.now()) {
  const name = planName(s.plan?.plan_code);
  if (!name) return null;
  const next = s.next_payment_date ? new Date(s.next_payment_date).getTime() : 0;
  // Paystack statuses: active, non-renewing (cancelled, paid up to next_payment_date),
  // attention (last renewal failed), completed, cancelled.
  let status;
  let expires = next;
  if (s.status === "active") {
    status = "active";
    expires = next + RENEWAL_GRACE_MS;
  } else if (s.status === "non-renewing") {
    status = "canceled";
  } else if (s.status === "attention") {
    status = "billing_retry";
  } else {
    status = "expired";
  }
  return {
    originalTransactionId: s.subscription_code,
    purchaseToken: customerCode,
    productId: PRODUCT[name],
    status,
    expiresAt: new Date(expires || 0).toISOString(),
    environment: secret().startsWith("sk_test_") ? "Sandbox" : "Production",
    grants: (status === "active" || status === "canceled") && expires > now,
  };
}

/** The customer's best AI Academy subscription from Paystack (live > latest), or null. */
async function customerSubscription(customerCode, opts = {}) {
  const customer = await call("GET", `/customer/${encodeURIComponent(customerCode)}`, null, opts);
  const now = opts.now ?? Date.now();
  const ours = (customer.subscriptions || [])
    .map((s) => toSubscription(s, customer.customer_code, now))
    .filter(Boolean);
  if (!ours.length) return null;
  ours.sort((a, b) => Number(b.grants) - Number(a.grants) || b.expiresAt.localeCompare(a.expiresAt));
  return ours[0];
}

/** Whether a webhook really came from Paystack (HMAC SHA-512 of the raw body). */
function validSignature(rawBody, signature) {
  if (!signature || !secret()) return false;
  const expected = crypto.createHmac("sha512", secret()).update(rawBody).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = {
  PRODUCT,
  configured,
  planCode,
  planName,
  plans,
  startCheckout,
  verifyTransaction,
  toSubscription,
  customerSubscription,
  validSignature,
};
