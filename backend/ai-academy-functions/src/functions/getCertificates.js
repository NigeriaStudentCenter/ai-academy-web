const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const progress = require("../lib/progress");

app.http("getCertificates", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => ({
    status: 200,
    jsonBody: (await progress.listCertificates(user.userId)).map((e) => ({
      certificateId: e.certificateId,
      learnerName: e.learnerName,
      courseId: e.courseId,
      courseTitle: e.courseTitle,
      issuedAt: e.issuedAt,
      authorityName: e.authorityName,
      authorityTitle: e.authorityTitle,
    })),
  })),
});
