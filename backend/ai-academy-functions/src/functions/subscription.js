const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const access = require("../lib/access");
const appStore = require("../lib/appStore");
const googlePlay = require("../lib/googlePlay");
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

// POST /api/verifyPurchase — after a purchase or "Restore purchases":
//   { platform: "apple", transactionId } or { platform: "google", purchaseToken }.
// The server looks the purchase up with the store and grants access only if
// the store says the subscription is live.
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
    const platform = body.platform;
    if (platform !== "apple" && platform !== "google") {
      return { status: 400, jsonBody: { error: "Unsupported store." } };
    }
    const storeName = platform === "apple" ? "the App Store" : "Google Play";
    let sub;
    try {
      sub = platform === "apple"
        ? await appStore.lookupSubscription(body.transactionId)
        : await googlePlay.lookupSubscription(body.purchaseToken);
    } catch (err) {
      context.error(`verifyPurchase: ${storeName} lookup failed`, err);
      return { status: 502, jsonBody: { error: `We couldn't reach ${storeName}. Please try again.` } };
    }
    if (!sub || !PRODUCT_IDS.includes(sub.productId)) {
      return { status: 404, jsonBody: { error: "We couldn't find that subscription." } };
    }
    if (sub.environment === "Sandbox" && !access.sandboxAllowed(user)) {
      return { status: 403, jsonBody: { error: "Test purchases don't unlock AI Academy on this account.", code: "sandbox_not_allowed" } };
    }
    // Google: a purchase made for another account (obfuscatedAccountId) can't be claimed.
    if (platform === "google" && sub.accountId && sub.accountId !== user.userId) {
      return {
        status: 409,
        jsonBody: { error: "This subscription is linked to a different AI Academy account.", code: "owned_by_other_account" },
      };
    }
    const owner = await store.ownerOf(platform, sub.originalTransactionId);
    if (owner && owner !== user.userId) {
      return {
        status: 409,
        jsonBody: { error: "This subscription is linked to a different AI Academy account.", code: "owned_by_other_account" },
      };
    }
    const grants = platform === "apple" ? appStore.grantsAccess(sub) : googlePlay.grantsAccess(sub);
    await store.saveSubscription(user.userId, platform, sub, { grants });
    if (platform === "google") {
      try {
        await googlePlay.acknowledge(sub);
      } catch (err) {
        context.warn("verifyPurchase: Google acknowledge failed (the app acknowledges too)", err);
      }
    }
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

// POST /api/googlePlayNotifications — Google Play Real-time developer
// notifications (Pub/Sub push subscription). Only the purchase token is taken
// from the message; the subscription is then re-read from Google, so a forged
// message can't grant anything. (Renewals are also re-checked lazily in
// access.refreshExpired, so this endpoint is optional.)
app.http("googlePlayNotifications", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      return { status: 400 };
    }
    const token = googlePlay.notificationPurchaseToken(body);
    if (!token) return { status: 200 };
    try {
      const owner = await store.ownerOf("google", googlePlay.tokenId(token));
      if (!owner) return { status: 200 }; // not linked to an account yet
      const sub = await googlePlay.lookupSubscription(token);
      if (sub) await store.saveSubscription(owner, "google", sub, { grants: googlePlay.grantsAccess(sub) });
      return { status: 200 };
    } catch (err) {
      context.error("googlePlayNotifications failed", err);
      return { status: 500 }; // Pub/Sub retries
    }
  },
});
