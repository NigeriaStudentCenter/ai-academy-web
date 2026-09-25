const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const progress = require("../lib/progress");

app.http("getProgress", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => ({
    status: 200,
    jsonBody: await progress.listProgress(user.userId),
  })),
});
