const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const access = require("../lib/access");
const accounts = require("../lib/accounts");

// Simple in-memory limits (per instance) so the public sign-up can't be used
// to spam invitations.
const hits = new Map();
function limited(key, max, windowMs) {
  const now = Date.now();
  const recent = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  recent.push(now);
  hits.set(key, recent);
  return false;
}

// POST /api/createAccount { email, name } — no sign-in needed. Sends the
// Microsoft invitation that creates the learner's AI Academy account.
app.http("createAccount", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    let body;
    try {
      body = await request.json();
    } catch {
      body = {};
    }
    const email = accounts.normaliseEmail(body.email);
    if (!email) return { status: 400, jsonBody: { error: "Enter a valid email address." } };
    if (accounts.isOrganisationEmail(email)) {
      return {
        status: 409,
        jsonBody: { error: "You already have an account through your school or organisation. Tap Sign in and use that email.", code: "organisation_account" },
      };
    }
    const ip = (request.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
    if (limited(`ip:${ip}`, 5, 3600e3) || limited(`email:${email}`, 3, 86400e3)) {
      return { status: 429, jsonBody: { error: "Too many requests. Please try again later." } };
    }
    try {
      await accounts.inviteLearner(email, accounts.cleanName(body.name));
    } catch (err) {
      // Addresses on one of our own tenant's domains are members, not guests.
      if (err.status === 400 && /verified domain/i.test(err.message)) {
        return {
          status: 409,
          jsonBody: { error: "You already have an account through your school or organisation. Tap Sign in and use that email.", code: "organisation_account" },
        };
      }
      context.error("createAccount: invitation failed", err);
      return { status: 502, jsonBody: { error: "We couldn't create your account just now. Please try again." } };
    }
    return {
      status: 200,
      jsonBody: { message: `We've emailed an invitation to ${email}. Accept it, then come back and tap Sign in with Microsoft.` },
    };
  },
});

// POST /api/deleteAccount — deletes the signed-in learner's account and data.
app.http("deleteAccount", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    let guest;
    try {
      guest = await accounts.isDeletableGuest(user.userId);
    } catch (err) {
      context.error("deleteAccount: lookup failed", err);
      return { status: 502, jsonBody: { error: "We couldn't delete your account just now. Please try again." } };
    }
    if (!guest) {
      return {
        status: 409,
        jsonBody: {
          error: "Your account is managed by your school or organisation, so it can't be deleted here. Please contact them, or email john@bsoedu.org.",
          code: "organisation_account",
        },
      };
    }
    const learnerAccess = await access.accessFor(user);
    try {
      await accounts.deleteLearnerData(user.userId);
      await accounts.deleteGuest(user.userId);
    } catch (err) {
      context.error("deleteAccount failed", err);
      return { status: 502, jsonBody: { error: "We couldn't delete your account just now. Please try again." } };
    }
    return {
      status: 200,
      jsonBody: {
        deleted: true,
        // Store subscriptions keep renewing until cancelled in the store.
        hadSubscription: learnerAccess.reason === "subscription",
      },
    };
  }),
});
