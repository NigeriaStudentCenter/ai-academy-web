const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { getCourseForUser, publicCourse } = require("../lib/courses");
const { withMediaUrls } = require("../lib/sharepointCourses");
const access = require("../lib/access");

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

    // Without a subscription, locked lessons arrive as outlines only.
    const visible = access.applyAccess(course, await access.accessFor(user));
    return { status: 200, jsonBody: withMediaUrls(publicCourse(visible)) };
  }),
});
