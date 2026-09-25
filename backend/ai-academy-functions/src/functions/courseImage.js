const { app } = require("@azure/functions");
const { fetchCourseImage } = require("../lib/sharepointCourses");

// Public: course illustrations from the SharePoint "… Course Images" folders,
// so lessons can show them without the learner needing SharePoint access.
app.http("courseImage", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const image = await fetchCourseImage(request.query.get("path"));
      if (!image) return { status: 404 };
      return {
        status: 200,
        body: image.body,
        headers: {
          "Content-Type": image.contentType,
          "Cache-Control": "public, max-age=86400",
        },
      };
    } catch (err) {
      context.error("courseImage failed", err);
      return { status: err.status === 404 ? 404 : 502 };
    }
  },
});
