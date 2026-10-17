const { app } = require("@azure/functions");
const { TableClient } = require("@azure/data-tables");
const access = require("../lib/access");
const accounts = require("../lib/accounts"); // email validation only
const paystack = require("../lib/paystack");
const store = require("../lib/storeSubscriptions");

// AI Academy All Access bought on the website with Paystack (web only — the
// app never shows or links to this). Flow: subscribe page → POST
// /api/paystackCheckout (the subscription is keyed to the email address) →
// Paystack's payment page → back to subscribe-done.html → GET
// /api/paystackVerify. Renewals, cancellations and failed payments arrive at
// POST /api/paystackWebhook. Every change is re-read from Paystack before it
// is saved, so neither the browser nor a forged webhook can grant access.

// PaystackCustomers (PK "customer", RK customer_code) → userId: links the
// Paystack customer to the AI Academy account it paid for.
function customers() {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, "PaystackCustomers");
}

async function linkCustomer(customerCode, userId) {
  const table = customers();
  try {
    await table.createTable();
  } catch (err) {
    if (err.statusCode !== 409) throw err;
  }
  await table.upsertEntity({ partitionKey: "customer", rowKey: customerCode, userId });
}

async function userForCustomer(customerCode) {
  try {
    return (await customers().getEntity("customer", customerCode)).userId;
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

/** Re-reads the customer's subscription from Paystack and saves it for the learner. */
async function syncCustomer(customerCode, userId, context) {
  const sub = await paystack.customerSubscription(customerCode);
  if (!sub) return null;
  const owner = await store.ownerOf("paystack", sub.originalTransactionId);
  if (owner && owner !== userId) {
    context.warn(`paystack: subscription ${sub.originalTransactionId} already belongs to another account`);
    return null;
  }
  await store.saveSubscription(userId, "paystack", sub, { grants: sub.grants });
  return sub;
}

// Per-instance limits so the public endpoints can't be used to spam invitations.
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

// GET /api/paystackPlans → { monthly: {amountKobo, currency, interval}, yearly: {...} }
app.http("paystackPlans", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!paystack.configured()) return notReady;
    try {
      return { status: 200, jsonBody: await paystack.plans(), headers: { "Cache-Control": "public, max-age=300" } };
    } catch (err) {
      context.error("paystackPlans failed", err);
      return { status: 502, jsonBody: { error: "We couldn't load the prices. Please try again." } };
    }
  },
});

// POST /api/paystackCheckout { email, name, plan: "monthly" | "yearly" } → { url }
app.http("paystackCheckout", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!paystack.configured()) return notReady;
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const email = accounts.normaliseEmail(body.email);
    if (!email) return { status: 400, jsonBody: { error: "Enter a valid email address." } };
    if (!paystack.planCode(body.plan)) return { status: 400, jsonBody: { error: "Choose monthly or yearly." } };
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
    // Website subscriptions belong to the email address: they unlock when the
    // learner signs in to the app with that (verified) email — Google, Apple,
    // email + password or Microsoft. No account is created here.
    const owner = access.emailOwner(email);
    const current = await access.getSubscription(owner);
    if (access.isActive(current)) {
      return {
        status: 409,
        jsonBody: { error: "This email already has an active AI Academy subscription. Sign in to the app with this email.", code: "already_subscribed" },
      };
    }
    try {
      const checkout = await paystack.startCheckout({ email, userId: owner, plan: body.plan });
      return { status: 200, jsonBody: { url: checkout.url } };
    } catch (err) {
      context.error("paystackCheckout: initialize failed", err);
      return { status: 502, jsonBody: { error: "We couldn't reach Paystack. Please try again." } };
    }
  },
});

// GET /api/paystackVerify?reference=… — the subscribe-done page calls this when
// Paystack sends the browser back. Grants access straight away (the webhook
// does the same, whichever comes first).
app.http("paystackVerify", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!paystack.configured()) return notReady;
    let tx;
    try {
      tx = await paystack.verifyTransaction(request.query.get("reference"));
    } catch (err) {
      if (err.status === 400 || err.status === 404) return { status: 404, jsonBody: { error: "We couldn't find that payment." } };
      context.error("paystackVerify failed", err);
      return { status: 502, jsonBody: { error: "We couldn't reach Paystack. Please refresh in a moment." } };
    }
    if (!tx) return { status: 404, jsonBody: { error: "We couldn't find that payment." } };
    if (tx.status !== "success") return { status: 200, jsonBody: { paid: false, status: tx.status } };
    const userId = tx.metadata?.userId;
    const customerCode = tx.customer?.customer_code;
    if (!userId || !customerCode) return { status: 200, jsonBody: { paid: true, active: false } };
    try {
      await linkCustomer(customerCode, userId);
      const sub = await syncCustomer(customerCode, userId, context);
      return {
        status: 200,
        jsonBody: { paid: true, active: !!sub?.grants, plan: tx.metadata?.plan || null, email: tx.customer?.email || null, renews: sub?.expiresAt || null },
      };
    } catch (err) {
      context.error("paystackVerify: sync failed", err);
      // Paid but not yet saved: the webhook (or the next refresh) will finish it.
      return { status: 200, jsonBody: { paid: true, active: false, pending: true } };
    }
  },
});

// POST /api/paystackWebhook — Paystack events (charge.success, subscription.create,
// subscription.not_renew, subscription.disable, invoice.payment_failed, …).
app.http("paystackWebhook", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const raw = await request.text();
    if (!paystack.validSignature(raw, request.headers.get("x-paystack-signature"))) {
      return { status: 401 };
    }
    let event;
    try {
      event = JSON.parse(raw);
    } catch {
      return { status: 400 };
    }
    const data = event.data || {};
    const customerCode = data.customer?.customer_code;
    if (!customerCode) return { status: 200 };
    try {
      // The first payment carries our metadata; later events find the learner by customer.
      const fromMetadata = data.metadata?.product === "ai-academy-all-access" ? data.metadata.userId : null;
      if (fromMetadata) await linkCustomer(customerCode, fromMetadata);
      const userId = fromMetadata || (await userForCustomer(customerCode));
      if (!userId) return { status: 200 }; // not an AI Academy customer
      await syncCustomer(customerCode, userId, context);
      return { status: 200 };
    } catch (err) {
      context.error("paystackWebhook failed", err);
      return { status: 500 }; // Paystack retries
    }
  },
});
