const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { listCoursesForUser, categoriesFor } = require("../lib/courses");
const access = require("../lib/access");

app.http("listCourses", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    const learnerAccess = await access.accessFor(user);
    const courses = (await listCoursesForUser(user)).map((c) => ({
      ...c,
      access: access.courseAccess(c, learnerAccess),
    }));
    return {
      status: 200,
      jsonBody: {
        learner: {
          name: user.name,
          username: user.username,
          isAdmin: user.isAdmin,
          audiences: user.audiences,
          access: { full: learnerAccess.full, reason: learnerAccess.reason, paywall: learnerAccess.paywall },
        },
        courses,
        categories: categoriesFor(courses),
      },
    };
  }),
});
