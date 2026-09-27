const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const access = require("../lib/access");
const appStore = require("../lib/appStore");
const store = require("../lib/storeSubscriptions");

const PRODUCT_IDS = ["org.bsoedu.aiacademy.allaccess.monthly", "org.bsoedu.aiacademy.allaccess.yearly"];

// GET /api/subscription → { access: {full, reason, paywall, expiresAt?}, productIds }
app.http("subscription", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    const a = await access.accessFor(user);
    return { status: 200, jsonBody: { access: a, productIds: PRODUCT_IDS } };
  }),
});

// POST /api/verifyPurchase { platform: "apple", transactionId } — after a purchase
// or "Restore purchases". The server looks the transaction up with Apple and
// grants access only if Apple says the subscription is live.
app.http("verifyPurchase", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    if (body.platform !== "apple") {
      return { status: 400, jsonBody: { error: "Unsupported store." } };
    }
    let sub;
    try {
      sub = await appStore.lookupSubscription(body.transactionId);
    } catch (err) {
      context.error("verifyPurchase: App Store lookup failed", err);
      return { status: 502, jsonBody: { error: "We couldn't reach the App Store. Please try again." } };
    }
    if (!sub || !PRODUCT_IDS.includes(sub.productId)) {
      return { status: 404, jsonBody: { error: "We couldn't find that subscription." } };
    }
    if (sub.environment === "Sandbox" && !access.sandboxAllowed(user)) {
      return { status: 403, jsonBody: { error: "Test purchases don't unlock AI Academy on this account.", code: "sandbox_not_allowed" } };
    }
    const owner = await store.ownerOf("apple", sub.originalTransactionId);
    if (owner && owner !== user.userId) {
      return {
        status: 409,
        jsonBody: { error: "This subscription is linked to a different AI Academy account.", code: "owned_by_other_account" },
      };
    }
    await store.saveSubscription(user.userId, "apple", sub, { grants: appStore.grantsAccess(sub) });
    return { status: 200, jsonBody: { access: await access.accessFor(user), subscription: { productId: sub.productId, status: sub.status, expiresAt: sub.expiresAt } } };
  }),
});

// POST /api/appStoreNotifications — App Store Server Notifications V2 (renewals,
// expiries, refunds). Only the transaction id is taken from the notification;
// the subscription itself is then re-read from Apple, so a forged notification
// can't grant anything.
app.http("appStoreNotifications", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400 };
    }
    const id = appStore.notificationTransactionId(body);
    if (!id) return { status: 200 };
    try {
      const owner = await store.ownerOf("apple", id);
      if (!owner) return { status: 200 }; // not linked to an account yet
      const sub = await appStore.lookupSubscription(id);
      if (sub) await store.saveSubscription(owner, "apple", sub, { grants: appStore.grantsAccess(sub) });
      return { status: 200 };
    } catch (err) {
      context.error("appStoreNotifications failed", err);
      return { status: 500 }; // Apple retries
    }
  },
});
