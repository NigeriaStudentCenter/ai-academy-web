const test = require("node:test");
const assert = require("node:assert/strict");
const { withPractice, practiceCoach, PRACTICE_ID } = require("../src/lib/practice");
const { publicCourse } = require("../src/lib/courses");

const long = "<p>" + "Write a clear prompt with a role, a task and a format. ".repeat(10) + "</p>";
const course = {
  courseId: "demo",
  title: "ChatGPT Masterclass",
  lessons: [
    { lessonId: "module-1", title: "Prompting basics", objective: "Write better prompts", contentBody: long },
    { lessonId: "tiny", title: "Welcome", contentBody: "<p>Hi</p>" },
    { lessonId: "has-coach", title: "Own coach", contentBody: long, coaches: [{ coachId: "x", systemPrompt: "s" }] },
  ],
};

test("adds a practice coach to substantial lessons only", () => {
  const out = withPractice(course);
  const [first, tiny, own] = out.lessons;
  assert.equal(first.practiceCoach, PRACTICE_ID);
  assert.equal(first.coaches[0].coachId, PRACTICE_ID);
  assert.equal(tiny.practiceCoach, undefined);
  assert.equal(own.practiceCoach, undefined);
  assert.equal(own.coaches[0].coachId, "x");
  assert.equal(course.lessons[0].coaches, undefined, "original course untouched");
  // No data-block marker: the lesson keeps its normal (prompt-card) layout.
  assert.ok(!first.contentBody.includes("data-block"));
});

test("the prompt carries the lesson and stays server-side", () => {
  const coach = practiceCoach(course, course.lessons[0]);
  assert.match(coach.systemPrompt, /Lesson: Prompting basics/);
  assert.match(coach.systemPrompt, /Write a clear prompt with a role/);
  assert.match(coach.systemPrompt, /Lesson goal: Write better prompts/);
  assert.ok(!coach.systemPrompt.includes("<p>"));
  const sent = publicCourse(withPractice(course)).lessons[0].coaches[0];
  assert.equal(sent.systemPrompt, undefined);
  assert.match(sent.promptTemplate, /\[your job/);
});

test("long lessons are truncated", () => {
  const huge = { ...course.lessons[0], contentBody: "<p>" + "x ".repeat(20000) + "</p>" };
  assert.ok(practiceCoach(course, huge).systemPrompt.length < 14000);
});
