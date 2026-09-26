const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { getCourseForUser } = require("../lib/courses");
const { askFoundry } = require("../lib/foundry");
const act = require("../lib/lessonActivity");

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

// GET  /api/lessonResponses?courseId= → everything this learner saved in the course
// POST /api/lessonResponses {courseId, lessonId, exerciseId, values} → save one exercise
app.http("lessonResponses", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (request.method === "GET") {
      const courseId = request.query.get("courseId") || "";
      if (!(await getCourseForUser(user, courseId))) return { status: 404, jsonBody: { error: "Course not found." } };
      return { status: 200, jsonBody: { responses: await act.courseResponses(user.userId, courseId) } };
    }
    const body = await readBody(request);
    const course = await getCourseForUser(user, body.courseId || "");
    const lesson = course && act.findLesson(course, body.lessonId);
    const exercise = lesson?.exercises?.find((e) => e.exerciseId === body.exerciseId);
    if (!exercise) return { status: 404, jsonBody: { error: "Exercise not found." } };
    const values = await act.saveExercise(user.userId, course.courseId, lesson.lessonId, exercise, body.values);
    return { status: 200, jsonBody: { values } };
  }),
});

// POST /api/submitQuiz {courseId, lessonId, quizId?, answers:[optionIndex…]} → score, answers,
// explanations. No quizId = the lesson's knowledge check; quizId = a scenario question.
app.http("submitQuiz", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    const body = await readBody(request);
    const course = await getCourseForUser(user, body.courseId || "");
    const lesson = course && act.findLesson(course, body.lessonId);
    const quizId = typeof body.quizId === "string" && body.quizId ? body.quizId : undefined;
    const questions = lesson ? act.questionsFor(lesson, quizId) : [];
    if (!questions.length) return { status: 404, jsonBody: { error: "Knowledge check not found." } };
    const answers = Array.isArray(body.answers) ? body.answers.slice(0, questions.length) : [];
    if (answers.length !== questions.length || answers.some((a) => !Number.isInteger(a))) {
      return { status: 400, jsonBody: { error: "Answer every question before submitting." } };
    }
    const marked = act.markQuiz(lesson, answers, quizId);
    await act.saveQuiz(user.userId, course.courseId, lesson.lessonId, marked, quizId);
    return { status: 200, jsonBody: marked };
  }),
});

// POST /api/lessonCoach {courseId, lessonId, coachId, turns:[{role, content}]} → {text}
// GET  /api/lessonCoach?courseId&lessonId&coachId → the learner's saved answers as text,
//      for the coach's opening message.
app.http("lessonCoach", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    const body = request.method === "POST" ? await readBody(request) : {};
    const param = (k) => (request.method === "GET" ? request.query.get(k) : body[k]) || "";
    const course = await getCourseForUser(user, param("courseId"));
    const lesson = course && act.findLesson(course, param("lessonId"));
    const coach = lesson?.coaches?.find((c) => c.coachId === param("coachId"));
    if (!coach) return { status: 404, jsonBody: { error: "Coach not found." } };

    if (request.method === "GET") {
      const saved = await act.courseResponses(user.userId, course.courseId);
      const parts = [];
      for (const exId of coach.usesExercises || []) {
        const owner = course.lessons.find((l) => l.exercises?.some((e) => e.exerciseId === exId));
        const ex = owner?.exercises.find((e) => e.exerciseId === exId);
        const text = ex ? act.exerciseAsText(ex, saved[owner.lessonId]?.exercises?.[exId]) : "";
        if (text) parts.push(`${ex.title}:\n${text}`);
      }
      return { status: 200, jsonBody: { answers: parts.join("\n\n") } };
    }

    const input = act.coachInput(course.coachRules || "", coach, body.turns);
    if (!input) return { status: 400, jsonBody: { error: "Start with your message." } };
    try {
      return { status: 200, jsonBody: { text: await askFoundry(input) } };
    } catch (err) {
      context.error("lessonCoach failed", err);
      return { status: 502, jsonBody: { error: "Your thinking partner is unavailable. Please try again." } };
    }
  }),
});
