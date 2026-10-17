const { createRemoteJWKSet, jwtVerify, decodeJwt } = require("jose");

// Entra ID (bsoedu.org tenant) + the "AI Academy" app registration.
// Tokens are requested by the app with scope api://<client id>/access_as_user.
const TENANT_ID = process.env.ENTRA_TENANT_ID || "76691188-9b9d-47ee-bb5a-2afec52f4d5e";
const API_CLIENT_ID = process.env.ENTRA_API_CLIENT_ID || "0df81530-47c8-4d89-ad12-e95a9f0b68c4";

const ISSUER = `https://login.microsoftonline.com/${TENANT_ID}/v2.0`;
const JWKS = createRemoteJWKSet(
  new URL(`https://login.microsoftonline.com/${TENANT_ID}/discovery/v2.0/keys`)
);

// Audience rules: which course audiences a learner can see.
const TEENS_DOMAINS = ["teenskills.co.uk"];
const AUDIENCES = ["teens", "professional"];

// Firebase Authentication: public learners sign in with Google, Apple or
// email + password. Organisation (school / TeenSkills) accounts keep using
// Microsoft Entra above.
const FIREBASE_PROJECT_ID = () => process.env.FIREBASE_PROJECT_ID || "";
const FIREBASE_JWKS = createRemoteJWKSet(
  new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com")
);

class AuthError extends Error {}

function isFirebaseToken(token) {
  try {
    return String(decodeJwt(token).iss || "").startsWith("https://securetoken.google.com/");
  } catch {
    return false;
  }
}

/** A public learner signed in with Firebase (Google, Apple or email). */
async function authenticateFirebase(token) {
  const projectId = FIREBASE_PROJECT_ID();
  if (!projectId) throw new AuthError("Firebase sign-in is not configured");
  let payload;
  try {
    ({ payload } = await jwtVerify(token, FIREBASE_JWKS, {
      issuer: `https://securetoken.google.com/${projectId}`,
      audience: projectId,
    }));
  } catch (err) {
    throw new AuthError(`Invalid Firebase token: ${err.code || err.message}`);
  }
  if (!payload.sub) throw new AuthError("Firebase token has no subject");
  const username = String(payload.email || "").toLowerCase();
  const userId = `fb_${payload.sub}`;
  // Teens or Professional, as the learner chose after first sign-in.
  let track = null;
  try {
    track = await require("./learnerProfile").getTrack(userId);
  } catch {
    // Storage hiccup: fall back to Professional for this request.
  }
  return {
    // Prefixed so a Firebase uid can never collide with an Entra object id.
    userId,
    name: payload.name || (username ? username.split("@")[0] : "Learner"),
    username,
    emailVerified: payload.email_verified === true,
    provider: "firebase",
    signInProvider: payload.firebase?.sign_in_provider || "",
    roles: [],
    isAdmin: false,
    isGuest: false,
    track,
    audiences: require("./learnerProfile").audiencesFor(track),
  };
}

/**
 * Validates the Bearer token on the request and returns the learner.
 * Throws AuthError when the request is not from a signed-in tenant user.
 */
async function authenticate(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new AuthError("Missing bearer token");
  if (isFirebaseToken(match[1])) return authenticateFirebase(match[1]);

  let payload;
  try {
    ({ payload } = await jwtVerify(match[1], JWKS, {
      issuer: ISSUER,
      audience: [API_CLIENT_ID, `api://${API_CLIENT_ID}`],
    }));
  } catch (err) {
    throw new AuthError(`Invalid token: ${err.code || err.message}`);
  }

  const scopes = String(payload.scp || "").split(" ");
  if (!scopes.includes("access_as_user")) {
    throw new AuthError("Token is missing the access_as_user scope");
  }

  // Guests (public learners invited by email) have a "…#EXT#@tenant" UPN;
  // their real address is in preferred_username / email.
  const upn = String(payload.upn || "");
  const isGuest = upn.includes("#EXT#") || payload.acct === 1;
  const username = String(
    (isGuest ? payload.preferred_username || payload.email : upn) ||
      payload.preferred_username || payload.email || ""
  ).toLowerCase();
  const domain = username.split("@")[1] || "";
  const roles = Array.isArray(payload.roles) ? payload.roles : [];
  const isAdmin = roles.includes("Admin");

  let audiences;
  if (isAdmin) audiences = AUDIENCES;
  else if (TEENS_DOMAINS.includes(domain)) audiences = ["teens"];
  else audiences = ["professional"]; // bsoedu.org and every other tenant domain

  return {
    userId: payload.oid,
    name: payload.name || username || "Learner",
    username,
    roles,
    isAdmin,
    isGuest,
    provider: "entra",
    emailVerified: true,
    audiences,
  };
}

/**
 * Wraps a handler so it only runs for signed-in learners.
 * The handler receives (request, context, user).
 */
function requireUser(handler) {
  return async (request, context) => {
    let user;
    try {
      user = await authenticate(request);
    } catch (err) {
      if (err instanceof AuthError) {
        context.log(`401: ${err.message}`);
        return { status: 401, jsonBody: { error: "Please sign in again." } };
      }
      throw err;
    }
    return handler(request, context, user);
  };
}

/** A visitor browsing without signing in: sees the catalogue and course outlines only. */
const ANONYMOUS = Object.freeze({
  userId: null,
  anonymous: true,
  name: "Visitor",
  username: "",
  roles: [],
  isAdmin: false,
  isGuest: false,
  provider: "anonymous",
  emailVerified: false,
  audiences: AUDIENCES,
});

/**
 * Like requireUser, but a request without a token runs as an anonymous
 * visitor (browse before signing in). A bad token is still a 401.
 */
function optionalUser(handler) {
  return async (request, context) => {
    if (!request.headers.get("authorization")) return handler(request, context, ANONYMOUS);
    return requireUser(handler)(request, context);
  };
}

module.exports = { authenticate, requireUser, optionalUser, AuthError, ANONYMOUS };
