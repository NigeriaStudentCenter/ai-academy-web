const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { syncCourses, surveyPages, getPageLayout } = require("../lib/sharepointCourses");

// Refresh SharePoint courses every 30 minutes…
app.timer("syncCoursesTimer", {
  schedule: "0 */30 * * * *",
  runOnStartup: false,
  handler: async (timer, context) => {
    const catalog = await syncCourses((m) => context.log(m));
    context.log(`Synced ${catalog.courses.length} SharePoint courses`);
  },
});

// …or immediately after publishing a change: POST /api/syncCourses (Admins only).
// (Routes under /admin are reserved by the Functions host.)
app.http("syncCourses", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.isAdmin) return { status: 403, jsonBody: { error: "Admins only." } };
    const log = [];
    try {
      const catalog = await syncCourses((m) => log.push(m));
      return {
        status: 200,
        jsonBody: {
          syncedAt: catalog.syncedAt,
          courses: catalog.courses.map((c) => ({
            courseId: c.courseId,
            title: c.title,
            lessons: c.lessons.length,
          })),
          log,
        },
      };
    } catch (err) {
      context.error("syncCourses failed", err);
      return { status: 502, jsonBody: { error: err.message, log } };
    }
  }),
});

// Admin diagnostics: GET /api/coursePages lists every page on the course site
// with the structure the importer sees.
app.http("coursePages", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.isAdmin) return { status: 403, jsonBody: { error: "Admins only." } };
    const name = request.query.get("name");
    if (name) {
      const page = await getPageLayout(name);
      return page ? { status: 200, jsonBody: page } : { status: 404 };
    }
    return { status: 200, jsonBody: await surveyPages() };
  }),
});
