// Apple App Store Server API: the source of truth for "AI Academy All Access"
// subscriptions bought in the iOS app. We never trust what the app says it
// bought — the server looks the transaction up with Apple.
//
// Settings: APPLE_IAP_KEY_ID, APPLE_IAP_ISSUER_ID, APPLE_BUNDLE_ID and
// APPLE_IAP_PRIVATE_KEY (the .p8 In-App Purchase key, base64-encoded).

const { SignJWT, importPKCS8, decodeJwt } = require("jose");

const HOSTS = {
  Production: "https://api.storekit.itunes.apple.com",
  Sandbox: "https://api.storekit-sandbox.itunes.apple.com",
};

// Subscription status codes from the App Store Server API.
const STATUS = { 1: "active", 2: "expired", 3: "billing_retry", 4: "grace_period", 5: "revoked" };

let keyPromise;
function signingKey() {
  keyPromise ??= importPKCS8(
    Buffer.from(process.env.APPLE_IAP_PRIVATE_KEY || "", "base64").toString("utf8"),
    "ES256"
  );
  return keyPromise;
}

async function apiToken() {
  return new SignJWT({ bid: process.env.APPLE_BUNDLE_ID })
    .setProtectedHeader({ alg: "ES256", kid: process.env.APPLE_IAP_KEY_ID, typ: "JWT" })
    .setIssuer(process.env.APPLE_IAP_ISSUER_ID)
    .setAudience("appstoreconnect-v1")
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(await signingKey());
}

/**
 * The subscription a transaction belongs to, from Apple:
 * { originalTransactionId, productId, status, expiresAt, environment, appAccountToken }
 * or null if Apple doesn't know the transaction. Tries production first, then
 * the sandbox (TestFlight and App Review purchases).
 */
async function lookupSubscription(transactionId, { fetchImpl = fetch } = {}) {
  if (!/^\d{1,30}$/.test(String(transactionId))) return null;
  const token = await apiToken();
  for (const environment of ["Production", "Sandbox"]) {
    const res = await fetchImpl(`${HOSTS[environment]}/inApps/v1/subscriptions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 404) continue;
    // Production answers 401 until the app is live on the App Store; sandbox
    // (TestFlight, App Review) purchases are then looked up there.
    if (res.status === 401 && environment === "Production") continue;
    if (!res.ok) throw new Error(`App Store Server API ${environment} returned HTTP ${res.status}`);
    return latestSubscription(await res.json(), environment);
  }
  return null;
}

/** Picks our product's latest transaction out of a "get all subscription statuses" response. */
function latestSubscription(body, environment) {
  let best = null;
  for (const group of body.data || []) {
    for (const item of group.lastTransactions || []) {
      // Fetched straight from Apple over TLS, so the payload can be read as is.
      const tx = decodeJwt(item.signedTransactionInfo);
      if (tx.bundleId && tx.bundleId !== process.env.APPLE_BUNDLE_ID) continue;
      const candidate = {
        originalTransactionId: String(tx.originalTransactionId),
        productId: tx.productId,
        status: STATUS[item.status] || "expired",
        expiresAt: new Date(tx.expiresDate || 0).toISOString(),
        environment,
        appAccountToken: tx.appAccountToken || "",
      };
      if (!best || candidate.expiresAt > best.expiresAt) best = candidate;
    }
  }
  return best;
}

/** Access-giving states: paid up, or Apple is still retrying a failed payment in the grace period. */
function grantsAccess(sub) {
  return sub.status === "active" || sub.status === "grace_period";
}

/** originalTransactionId from an App Store Server Notification V2 body (used only to trigger a lookup). */
function notificationTransactionId(body) {
  try {
    const payload = decodeJwt(body.signedPayload);
    const tx = payload.data?.signedTransactionInfo ? decodeJwt(payload.data.signedTransactionInfo) : null;
    return tx ? String(tx.originalTransactionId) : null;
  } catch {
    return null;
  }
}

module.exports = { lookupSubscription, latestSubscription, grantsAccess, notificationTransactionId, apiToken };
