const { createRemoteJWKSet, jwtVerify } = require("jose");

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

class AuthError extends Error {}

/**
 * Validates the Bearer token on the request and returns the learner.
 * Throws AuthError when the request is not from a signed-in tenant user.
 */
async function authenticate(request) {
  const header = request.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) throw new AuthError("Missing bearer token");

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

  const username = String(
    payload.upn || payload.preferred_username || payload.email || ""
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

module.exports = { authenticate, requireUser, AuthError };
