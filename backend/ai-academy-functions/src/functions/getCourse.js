const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { getCourseForUser } = require("../lib/courses");

app.http("getCourse", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    const courseId = request.query.get("courseId") || "";
    const course = await getCourseForUser(user, courseId);

    // Same 404 whether the course doesn't exist or isn't for this learner.
    if (!course) {
      return { status: 404, jsonBody: { message: "Course not found.", courseId } };
    }

    return { status: 200, jsonBody: course };
  }),
});
