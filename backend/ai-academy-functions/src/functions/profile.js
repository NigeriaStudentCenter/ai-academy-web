const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const learnerProfile = require("../lib/learnerProfile");

// GET /api/profile → { provider, track, needsTrack }
// POST /api/profile { track: "teens" | "professional" } — public (Firebase)
// learners choose their sections. Microsoft accounts are routed by domain.
app.http("profile", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (request.method === "POST") {
      if (user.provider !== "firebase") {
        return { status: 409, jsonBody: { error: "Your sections are set by your school or organisation." } };
      }
      let body;
      try {
        body = await request.json();
      } catch {
        body = {};
      }
      if (!learnerProfile.TRACKS.includes(body.track)) {
        return { status: 400, jsonBody: { error: "Choose teens or professional." } };
      }
      await learnerProfile.setTrack(user.userId, body.track);
      return { status: 200, jsonBody: { provider: user.provider, track: body.track, needsTrack: false } };
    }
    const track = user.provider === "firebase" ? user.track : user.audiences.includes("teens") && !user.isAdmin ? "teens" : "professional";
    return {
      status: 200,
      jsonBody: { provider: user.provider, track: track || null, needsTrack: user.provider === "firebase" && !user.track },
    };
  }),
});
