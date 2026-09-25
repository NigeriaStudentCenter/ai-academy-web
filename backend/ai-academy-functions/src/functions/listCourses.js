const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { listCoursesForUser } = require("../lib/courses");

app.http("listCourses", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => ({
    status: 200,
    jsonBody: {
      learner: {
        name: user.name,
        username: user.username,
        isAdmin: user.isAdmin,
        audiences: user.audiences,
      },
      courses: listCoursesForUser(user),
    },
  })),
});
