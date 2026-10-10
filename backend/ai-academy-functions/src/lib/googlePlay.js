// Google Play Developer API: the source of truth for "AI Academy All Access"
// subscriptions bought in the Android app. As with Apple, we never trust what
// the app says it bought — the server looks the purchase token up with Google.
//
// Settings: GOOGLE_PLAY_PACKAGE (default org.bsoedu.aiacademy) and
// GOOGLE_PLAY_SERVICE_ACCOUNT (the service account's JSON key, base64-encoded;
// the account needs "View financial data" and "Manage orders and
// subscriptions" in Play Console → Users and permissions).

const crypto = require("crypto");
const { SignJWT, importPKCS8 } = require("jose");

const API = "https://androidpublisher.googleapis.com/androidpublisher/v3/applications";
const SCOPE = "https://www.googleapis.com/auth/androidpublisher";

// subscriptionsv2 states → the statuses we store (same words as appStore.js).
const STATE = {
  SUBSCRIPTION_STATE_ACTIVE: "active",
  SUBSCRIPTION_STATE_IN_GRACE_PERIOD: "grace_period",
  SUBSCRIPTION_STATE_CANCELED: "canceled", // auto-renew off; paid up until expiry
  SUBSCRIPTION_STATE_ON_HOLD: "billing_retry",
  SUBSCRIPTION_STATE_PAUSED: "paused",
  SUBSCRIPTION_STATE_EXPIRED: "expired",
  SUBSCRIPTION_STATE_PENDING: "pending",
  SUBSCRIPTION_STATE_PENDING_PURCHASE_CANCELED: "expired",
};

const packageName = () => process.env.GOOGLE_PLAY_PACKAGE || "org.bsoedu.aiacademy";

function serviceAccount() {
  return JSON.parse(Buffer.from(process.env.GOOGLE_PLAY_SERVICE_ACCOUNT || "", "base64").toString("utf8"));
}

let cached = { token: null, expires: 0 };
async function accessToken({ fetchImpl = fetch, now = Date.now() } = {}) {
  if (cached.token && cached.expires - 60_000 > now) return cached.token;
  const sa = serviceAccount();
  const assertion = await new SignJWT({ scope: SCOPE })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(sa.client_email)
    .setAudience("https://oauth2.googleapis.com/token")
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(await importPKCS8(sa.private_key, "RS256"));
  const res = await fetchImpl("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  if (!res.ok) throw new Error(`Google OAuth returned HTTP ${res.status}`);
  const json = await res.json();
  cached = { token: json.access_token, expires: now + (json.expires_in || 3600) * 1000 };
  return cached.token;
}

/** Stable, table-safe id for a purchase token (tokens are long and may change shape). */
function tokenId(purchaseToken) {
  return crypto.createHash("sha256").update(String(purchaseToken)).digest("hex");
}

/**
 * The subscription a purchase token belongs to, from Google:
 * { originalTransactionId, purchaseToken, productId, status, expiresAt, environment,
 *   accountId, acknowledged } or null if Google doesn't know the token.
 */
async function lookupSubscription(purchaseToken, { fetchImpl = fetch } = {}) {
  if (!/^[A-Za-z0-9._:-]{20,2000}$/.test(String(purchaseToken || ""))) return null;
  const token = await accessToken({ fetchImpl });
  const res = await fetchImpl(
    `${API}/${encodeURIComponent(packageName())}/purchases/subscriptionsv2/tokens/${encodeURIComponent(purchaseToken)}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (res.status === 404 || res.status === 410 || res.status === 400) return null;
  if (!res.ok) throw new Error(`Google Play Developer API returned HTTP ${res.status}`);
  return parseSubscription(await res.json(), purchaseToken);
}

/** Maps a subscriptionsv2 response to our shape (the latest-expiring line item wins). */
function parseSubscription(body, purchaseToken) {
  const items = body.lineItems || [];
  if (!items.length) return null;
  const item = items.reduce((a, b) => ((b.expiryTime || "") > (a.expiryTime || "") ? b : a));
  return {
    originalTransactionId: tokenId(purchaseToken),
    purchaseToken: String(purchaseToken),
    productId: item.productId,
    status: STATE[body.subscriptionState] || "expired",
    expiresAt: new Date(item.expiryTime || 0).toISOString(),
    environment: body.testPurchase ? "Sandbox" : "Production",
    accountId: body.externalAccountIdentifiers?.obfuscatedExternalAccountId || "",
    acknowledged: body.acknowledgementState === "ACKNOWLEDGEMENT_STATE_ACKNOWLEDGED",
  };
}

/**
 * Access-giving states: paid up, in Google's grace period, or cancelled but
 * still inside the period already paid for.
 */
function grantsAccess(sub, now = Date.now()) {
  if (sub.status === "active" || sub.status === "grace_period") return true;
  return sub.status === "canceled" && new Date(sub.expiresAt).getTime() > now;
}

/** Google refunds purchases not acknowledged within 3 days; the server acknowledges as well as the app. */
async function acknowledge(sub, { fetchImpl = fetch } = {}) {
  if (sub.acknowledged) return;
  const token = await accessToken({ fetchImpl });
  const res = await fetchImpl(
    `${API}/${encodeURIComponent(packageName())}/purchases/subscriptions/${encodeURIComponent(sub.productId)}/tokens/${encodeURIComponent(sub.purchaseToken)}:acknowledge`,
    { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: "{}" }
  );
  // 400 = already acknowledged (e.g. by the app first) — fine.
  if (!res.ok && res.status !== 400) throw new Error(`Google acknowledge returned HTTP ${res.status}`);
}

/** Purchase token from a Real-time developer notification (Pub/Sub push body), used only to trigger a lookup. */
function notificationPurchaseToken(body) {
  try {
    const data = JSON.parse(Buffer.from(body.message.data, "base64").toString("utf8"));
    if (data.packageName && data.packageName !== packageName()) return null;
    return data.subscriptionNotification?.purchaseToken || null;
  } catch {
    return null;
  }
}

module.exports = { lookupSubscription, parseSubscription, grantsAccess, acknowledge, notificationPurchaseToken, tokenId, accessToken };
