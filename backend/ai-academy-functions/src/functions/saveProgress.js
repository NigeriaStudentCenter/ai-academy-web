const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { getCourseForUser } = require("../lib/courses");
const progress = require("../lib/progress");

// POST { courseId, lessonId } — marks one lesson complete. Completion and
// certificates are computed here, never trusted from the client.
app.http("saveProgress", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    let body;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    const courseId = typeof body?.courseId === "string" ? body.courseId : "";
    const lessonId = typeof body?.lessonId === "string" ? body.lessonId : "";

    const course = getCourseForUser(user, courseId);
    if (!course) {
      return { status: 404, jsonBody: { message: "Course not found." } };
    }
    const lessonIds = course.lessons.map((l) => l.lessonId);
    if (!lessonIds.includes(lessonId)) {
      return { status: 400, jsonBody: { message: "Unknown lessonId for this course." } };
    }

    const done = new Set(await progress.getProgress(user.userId, courseId));
    done.add(lessonId);
    const completedLessons = lessonIds.filter((id) => done.has(id));
    const completion = completedLessons.length / lessonIds.length;

    await progress.saveProgress(user.userId, courseId, completedLessons, completion);

    let certificateId = null;
    if (completion >= 1 && course.certificateEligible) {
      certificateId = (await progress.issueCertificate(user, course)).certificateId;
    }

    return {
      status: 200,
      jsonBody: { courseId, completedLessons, completion, certificateId },
    };
  }),
});
