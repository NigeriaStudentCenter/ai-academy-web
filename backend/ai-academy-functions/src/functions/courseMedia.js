const { app } = require("@azure/functions");
const { verifyMediaSignature, mediaDownloadUrl } = require("../lib/sharepointCourses");

// Course videos. getCourse hands signed-in learners a signed, expiring URL to
// this endpoint; it redirects to a short-lived SharePoint download URL, so
// videos play in the app without SharePoint access and links can't be shared.
app.http("courseMedia", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const path = request.query.get("path");
    const exp = request.query.get("exp");
    const sig = request.query.get("sig");
    if (!verifyMediaSignature(path, exp, sig)) return { status: 403 };
    try {
      const url = await mediaDownloadUrl(path);
      if (!url) return { status: 404 };
      return { status: 302, headers: { Location: url, "Cache-Control": "no-store" } };
    } catch (err) {
      context.error("courseMedia failed", err);
      return { status: err.status === 404 ? 404 : 502 };
    }
  },
});
