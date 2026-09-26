const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { askFoundry } = require("../lib/foundry");
const cc = require("../lib/tutorCommandCenter");

// AI Tutor Command Center (teens). GET → the curricula for the path menus.
// POST {path, turns}          → the tutor's next message
// POST {path, suggest: true}  → up to 6 topic ideas for the subject
app.http("tutorSession", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.audiences.includes("teens")) {
      return { status: 403, jsonBody: { error: "The Command Center is part of AI Academy for Teens." } };
    }
    if (request.method === "GET") return { status: 200, jsonBody: { curricula: cc.CURRICULA } };

    let body;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    const suggest = body?.suggest === true;
    const { path, error } = cc.validatePath({ ...(body?.path || {}), requireTopic: !suggest });
    if (error) return { status: 400, jsonBody: { error } };

    try {
      if (suggest) {
        const raw = await askFoundry([{ role: "user", content: cc.suggestPrompt(path) }]);
        return { status: 200, jsonBody: { topics: cc.parseTopics(raw) } };
      }
      const convo = cc.conversation(path, body?.turns);
      if (convo.error) return { status: 400, jsonBody: { error: convo.error } };
      const text = await askFoundry(convo.input);
      return { status: 200, jsonBody: { text } };
    } catch (err) {
      context.error("tutorSession failed", err);
      return { status: 502, jsonBody: { error: "The tutor is unavailable. Please try again." } };
    }
  }),
});
