const { app } = require("@azure/functions");
const access = require("../lib/access");
const accounts = require("../lib/accounts"); // email validation only
const stripe = require("../lib/stripe");
const store = require("../lib/storeSubscriptions");

// AI Academy All Access bought on the website with Stripe (international, GBP;
// Paystack covers Nigeria). Flow: subscribe page → POST /api/stripeCheckout →
// Stripe Checkout → back to subscribe-done.html?stripe_session=… → GET
// /api/stripeVerify. Renewals, cancellations and failed payments arrive at
// POST /api/stripeWebhook. Every change is re-read from Stripe before it is
// saved, so neither the browser nor a forged webhook can grant access.

/** Saves a Stripe subscription for the email owner it was bought for. */
async function save(sub, context) {
  if (!sub || !sub.owner.startsWith("email:")) return null;
  const owner = await store.ownerOf("stripe", sub.originalTransactionId);
  if (owner && owner !== sub.owner) {
    context.warn(`stripe: subscription ${sub.originalTransactionId} already belongs to another account`);
    return null;
  }
  await store.saveSubscription(sub.owner, "stripe", sub, { grants: sub.grants });
  return sub;
}

const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

const notReady = { status: 503, jsonBody: { error: "Online payment isn't available yet. Please try again later." } };

// GET /api/stripePlans → { monthly: {amount, currency, interval}, yearly: {...} }
app.http("stripePlans", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!stripe.configured()) return notReady;
    try {
      return { status: 200, jsonBody: await stripe.plans(), headers: { "Cache-Control": "public, max-age=300" } };
    } catch (err) {
      context.error("stripePlans failed", err);
      return { status: 502, jsonBody: { error: "We couldn't load the prices. Please try again." } };
    }
  },
});

// POST /api/stripeCheckout { email, plan: "monthly" | "yearly" } → { url }
app.http("stripeCheckout", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!stripe.configured()) return notReady;
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const email = accounts.normaliseEmail(body.email);
    if (!email) return { status: 400, jsonBody: { error: "Enter a valid email address." } };
    if (!stripe.priceId(body.plan)) return { status: 400, jsonBody: { error: "Choose monthly or yearly." } };
    if (accounts.isOrganisationEmail(email)) {
      return {
        status: 409,
        jsonBody: { error: "Your school or organisation account already includes full access — just sign in to the app.", code: "organisation_account" },
      };
    }
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    if (limited(`ip:${ip}`, 10, 3600e3) || limited(`email:${email}`, 5, 3600e3)) {
      return { status: 429, jsonBody: { error: "Too many attempts. Please try again later." } };
    }
    const owner = access.emailOwner(email);
    if (access.isActive(await access.getSubscription(owner))) {
      return {
        status: 409,
        jsonBody: { error: "This email already has an active AI Academy subscription. Sign in to the app with this email.", code: "already_subscribed" },
      };
    }
    try {
      const checkout = await stripe.startCheckout({ email, owner, plan: body.plan });
      return { status: 200, jsonBody: { url: checkout.url } };
    } catch (err) {
      context.error("stripeCheckout failed", err);
      return { status: 502, jsonBody: { error: "We couldn't reach Stripe. Please try again." } };
    }
  },
});

// GET /api/stripeVerify?session=cs_… — the subscribe-done page calls this when
// Stripe sends the browser back.
app.http("stripeVerify", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!stripe.configured()) return notReady;
    let session;
    try {
      session = await stripe.getSession(request.query.get("session"));
    } catch (err) {
      if (err.status === 404 || err.status === 400) return { status: 404, jsonBody: { error: "We couldn't find that payment." } };
      context.error("stripeVerify failed", err);
      return { status: 502, jsonBody: { error: "We couldn't reach Stripe. Please refresh in a moment." } };
    }
    if (!session) return { status: 404, jsonBody: { error: "We couldn't find that payment." } };
    if (session.status !== "complete") return { status: 200, jsonBody: { paid: false, status: session.status } };
    const sub = session.subscription && typeof session.subscription === "object" ? stripe.toSubscription(session.subscription) : null;
    try {
      const saved = await save(sub, context);
      return {
        status: 200,
        jsonBody: {
          paid: true,
          active: !!saved?.grants,
          plan: session.metadata?.plan || null,
          email: session.customer_details?.email || session.customer_email || null,
          renews: saved?.expiresAt || null,
        },
      };
    } catch (err) {
      context.error("stripeVerify: save failed", err);
      return { status: 200, jsonBody: { paid: true, active: false, pending: true } };
    }
  },
});

// POST /api/stripeWebhook — checkout.session.completed, customer.subscription.*,
// invoice.paid, invoice.payment_failed.
app.http("stripeWebhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const raw = await request.text();
    if (!stripe.validSignature(raw, request.headers.get("stripe-signature"))) return { status: 400 };
    let event;
    try {
      event = JSON.parse(raw);
    } catch {
      return { status: 400 };
    }
    const id = stripe.eventSubscriptionId(event);
    if (!id) return { status: 200 };
    try {
      const sub = await stripe.lookupSubscription(id);
      if (sub && sub.owner) await save(sub, context);
      return { status: 200 };
    } catch (err) {
      context.error("stripeWebhook failed", err);
      return { status: 500 }; // Stripe retries
    }
  },
});
