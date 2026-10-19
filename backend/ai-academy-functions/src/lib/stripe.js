// Stripe: AI Academy All Access bought on the website by international
// learners (GBP). Paystack covers Nigeria (src/lib/paystack.js). The app never
// shows or links to either — App Store / Google Play rules — but a learner
// who subscribes on the website gets full access when they sign in to the app
// with the same (verified) email, because the subscription is saved under the
// email address (access.emailOwner).
//
// We never trust the browser or the webhook body: the webhook signature is
// checked, and the subscription is re-read from the Stripe API before
// anything is granted.
//
// Settings: STRIPE_SECRET_KEY, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_YEARLY,
// STRIPE_WEBHOOK_SECRET (see tools/stripe/setup.mjs) and optional
// STRIPE_RETURN_URL (the website's subscribe-done page).

const crypto = require("crypto");

const API = "https://api.stripe.com/v1";
const PRODUCT = {
  monthly: "org.bsoedu.aiacademy.allaccess.monthly",
  yearly: "org.bsoedu.aiacademy.allaccess.yearly",
};
// After a renewal date Stripe may retry a failed card for a few days; keep access meanwhile.
const RENEWAL_GRACE_MS = 3 * 24 * 3600e3;
const SIGNATURE_TOLERANCE_S = 5 * 60;

const secret = () => process.env.STRIPE_SECRET_KEY || "";
const configured = () => !!(secret() && process.env.STRIPE_PRICE_MONTHLY && process.env.STRIPE_PRICE_YEARLY);

function priceId(plan) {
  return plan === "yearly" ? process.env.STRIPE_PRICE_YEARLY : plan === "monthly" ? process.env.STRIPE_PRICE_MONTHLY : null;
}

function planName(price) {
  if (price && price === process.env.STRIPE_PRICE_MONTHLY) return "monthly";
  if (price && price === process.env.STRIPE_PRICE_YEARLY) return "yearly";
  return null;
}

/** Stripe's form encoding, including nested objects and arrays (a[b][0][c]=…). */
function encode(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") encode(v, key, out);
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.join("&");
}

async function call(method, path, body, { fetchImpl = fetch } = {}) {
  const res = await fetchImpl(`${API}${path}`, {
    method,
    headers: { Authorization: `Bearer ${secret()}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: body ? encode(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`Stripe ${method} ${path} → ${res.status}: ${json.error?.message || ""}`);
    err.status = res.status;
    throw err;
  }
  return json;
}

/** The two prices (minor units) for the subscribe page. */
async function plans(opts) {
  const out = {};
  for (const name of ["monthly", "yearly"]) {
    const p = await call("GET", `/prices/${encodeURIComponent(priceId(name))}`, null, opts);
    out[name] = { amount: p.unit_amount, currency: p.currency, interval: p.recurring?.interval };
  }
  return out;
}

/** Starts a Stripe Checkout session; returns its hosted payment page URL. */
async function startCheckout({ email, owner, plan }, opts) {
  const base = process.env.STRIPE_RETURN_URL || "https://black-sky-0782ebe03.7.azurestaticapps.net/subscribe-done.html";
  const session = await call(
    "POST",
    "/checkout/sessions",
    {
      mode: "subscription",
      line_items: [{ price: priceId(plan), quantity: 1 }],
      customer_email: email,
      client_reference_id: owner,
      allow_promotion_codes: true,
      metadata: { owner, plan, product: "ai-academy-all-access" },
      subscription_data: { metadata: { owner, plan, product: "ai-academy-all-access" } },
      success_url: `${base}?stripe_session={CHECKOUT_SESSION_ID}`,
      cancel_url: base.replace(/subscribe-done\.html.*$/, "subscribe.html"),
    },
    opts
  );
  return { url: session.url, id: session.id };
}

/** A Checkout session (with its subscription) by id. */
function getSession(id, opts) {
  if (!/^cs_(live|test)_[A-Za-z0-9]{10,}$/.test(String(id || ""))) return Promise.resolve(null);
  return call("GET", `/checkout/sessions/${encodeURIComponent(id)}?expand[]=subscription`, null, opts);
}

function getSubscription(id, opts) {
  if (!/^sub_[A-Za-z0-9]{6,}$/.test(String(id || ""))) return Promise.resolve(null);
  return call("GET", `/subscriptions/${encodeURIComponent(id)}`, null, opts);
}

/**
 * Our view of a Stripe subscription, in the shape storeSubscriptions saves:
 * { originalTransactionId, purchaseToken, productId, status, expiresAt, environment, grants, owner }.
 */
function toSubscription(s, now = Date.now()) {
  const item = s?.items?.data?.[0];
  const name = planName(item?.price?.id);
  if (!name) return null;
  // current_period_end moved onto subscription items in newer API versions.
  const endSec = item.current_period_end || s.current_period_end || 0;
  const end = endSec * 1000;
  let status;
  let expires = end;
  if (s.status === "active" || s.status === "trialing") {
    status = s.cancel_at_period_end ? "canceled" : "active";
    if (status === "active") expires = end + RENEWAL_GRACE_MS;
  } else if (s.status === "past_due") {
    status = "grace_period";
    expires = end + RENEWAL_GRACE_MS;
  } else {
    status = "expired"; // canceled, unpaid, incomplete, incomplete_expired, paused
  }
  return {
    originalTransactionId: s.id,
    purchaseToken: s.id,
    productId: PRODUCT[name],
    status,
    expiresAt: new Date(expires || 0).toISOString(),
    environment: s.livemode === false ? "Sandbox" : "Production",
    owner: s.metadata?.owner || "",
    grants: ["active", "canceled", "grace_period"].includes(status) && expires > now,
  };
}

/** Re-reads a subscription from Stripe (used by renewals / the lazy refresh). */
async function lookupSubscription(id, opts) {
  const s = await getSubscription(id, opts);
  return s ? toSubscription(s, opts?.now) : null;
}

/** Verifies a Stripe-Signature header (t=…,v1=…) against the raw body. */
function validSignature(rawBody, header, { now = Date.now(), webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "" } = {}) {
  if (!header || !webhookSecret) return false;
  const parts = Object.fromEntries(
    String(header)
      .split(",")
      .map((p) => p.split("="))
      .filter((p) => p.length === 2)
      .map(([k, v]) => [k.trim(), v.trim()])
  );
  const t = Number(parts.t);
  if (!t || Math.abs(now / 1000 - t) > SIGNATURE_TOLERANCE_S) return false;
  const expected = crypto.createHmac("sha256", webhookSecret).update(`${t}.${rawBody}`).digest("hex");
  const signatures = String(header)
    .split(",")
    .filter((p) => p.trim().startsWith("v1="))
    .map((p) => p.trim().slice(3));
  return signatures.some((sig) => {
    const a = Buffer.from(expected);
    const b = Buffer.from(sig);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}

/** The subscription id an event is about (only used to trigger a re-read). */
function eventSubscriptionId(event) {
  const o = event?.data?.object || {};
  if (o.object === "subscription") return o.id;
  if (o.object === "checkout.session") return typeof o.subscription === "string" ? o.subscription : o.subscription?.id || null;
  if (o.object === "invoice") {
    return (
      (typeof o.subscription === "string" ? o.subscription : o.subscription?.id) ||
      o.parent?.subscription_details?.subscription ||
      null
    );
  }
  return null;
}

module.exports = {
  PRODUCT,
  configured,
  priceId,
  planName,
  encode,
  plans,
  startCheckout,
  getSession,
  getSubscription,
  toSubscription,
  lookupSubscription,
  validSignature,
  eventSubscriptionId,
};
