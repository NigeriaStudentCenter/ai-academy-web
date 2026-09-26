const test = require("node:test");
const assert = require("node:assert");
const { publicCourse } = require("../src/lib/courses");

const COURSES = [
  [require("../src/courses/delete-limiting-beliefs"), 18],
  [require("../src/courses/customer-service-skills"), 11],
  [require("../src/courses/event-management"), 10],
];

for (const [course, lessonCount] of COURSES) {
const exercises = course.lessons.flatMap((l) => l.exercises || []);

test(`${course.courseId}: every block is defined and every definition is placed`, () => {
  for (const l of course.lessons) {
    const blocks = [...l.contentBody.matchAll(/data-block="(\w+)(?::([\w-]+))?"/g)].map((m) => [m[1], m[2]]);
    const placed = new Set(blocks.map(([, id]) => id).filter(Boolean));
    for (const [kind, id] of blocks) {
      if (kind === "exercise") assert.ok(l.exercises.some((e) => e.exerciseId === id), `${l.lessonId}: exercise ${id}`);
      if (kind === "coach") assert.ok(l.coaches.some((c) => c.coachId === id), `${l.lessonId}: coach ${id}`);
      if (kind === "scenario") assert.ok(l.scenarios.some((s) => s.scenarioId === id), `${l.lessonId}: scenario ${id}`);
      if (kind === "quiz") assert.ok(l.quiz?.length, `${l.lessonId}: quiz`);
      if (kind === "portfolio") assert.ok(l.portfolio?.length, `${l.lessonId}: portfolio`);
    }
    for (const e of l.exercises || []) assert.ok(placed.has(e.exerciseId), `${l.lessonId}: ${e.exerciseId} not placed`);
    for (const c of l.coaches || []) assert.ok(placed.has(c.coachId), `${l.lessonId}: ${c.coachId} not placed`);
    for (const s of l.scenarios || []) assert.ok(placed.has(s.scenarioId), `${l.lessonId}: ${s.scenarioId} not placed`);
  }
});

test(`${course.courseId}: ids unique, exercises well-formed, references valid`, () => {
  const ids = exercises.map((e) => e.exerciseId);
  assert.equal(new Set(ids).size, ids.length, "duplicate exercise ids");
  const orders = course.lessons.map((l) => l.lessonOrder);
  assert.equal(new Set(orders).size, orders.length, "duplicate lesson orders");
  for (const e of exercises) {
    const kinds = [e.fields, e.table, e.scale].filter(Boolean).length;
    assert.equal(kinds, 1, `${e.exerciseId} must be exactly one of fields / table / scale`);
  }
  for (const l of course.lessons) {
    for (const c of l.coaches || []) for (const ex of c.usesExercises || []) assert.ok(ids.includes(ex), `${c.coachId} uses ${ex}`);
    for (const p of l.portfolio || []) {
      const owner = course.lessons.find((o) => o.lessonId === p.lessonId);
      assert.ok(owner?.exercises.some((e) => e.exerciseId === p.exerciseId), `portfolio ${p.exerciseId}`);
    }
    for (const x of [...(l.quiz || []), ...(l.scenarios || [])]) {
      assert.ok(x.answer >= 0 && x.answer < x.options.length, `${l.lessonId}: answer out of range`);
      assert.ok(x.explanation, `${l.lessonId}: missing explanation`);
    }
  }
  assert.equal(course.lessons.length, lessonCount);
});

test(`${course.courseId}: published course hides answers and agent instructions`, () => {
  const text = JSON.stringify(publicCourse(course));
  assert.ok(!text.includes("systemPrompt"));
  assert.ok(!text.includes('"explanation"'));
});
}
