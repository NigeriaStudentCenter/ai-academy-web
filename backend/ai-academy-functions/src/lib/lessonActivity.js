// Learners' work inside lessons: exercise answers, knowledge-check results,
// and the in-lesson AI thinking partner (Become Extra Ordinary and future
// built-in courses). Stored in Table Storage "LearnerResponses":
// PartitionKey = userId, RowKey = `${courseId}|${lessonId}|${itemId}`.

const { TableClient, odata } = require("@azure/data-tables");

const TABLE = "LearnerResponses";
const MAX_VALUE = 6000; // characters per answer
const MAX_FIELDS = 80;

function table() {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, TABLE);
}

const findLesson = (course, lessonId) => course.lessons.find((l) => l.lessonId === lessonId);

/** Field ids an exercise accepts: named fields, or table cells "r{row}c{col}". */
function exerciseFieldIds(exercise) {
  if (exercise.table) {
    const ids = [];
    exercise.table.rows.forEach((_, r) => exercise.table.columns.forEach((__, c) => ids.push(`r${r}c${c}`)));
    return ids;
  }
  return (exercise.fields || []).map((f) => f.id);
}

/** Keeps only this exercise's fields, as trimmed strings. */
function cleanValues(exercise, values = {}) {
  const allowed = new Set(exerciseFieldIds(exercise));
  const out = {};
  for (const [k, v] of Object.entries(values || {}).slice(0, MAX_FIELDS * 2)) {
    if (allowed.has(k) && typeof v === "string") out[k] = v.slice(0, MAX_VALUE);
  }
  return out;
}

async function saveExercise(userId, courseId, lessonId, exercise, values) {
  const t = table();
  await t.createTable().catch(() => {});
  const clean = cleanValues(exercise, values);
  await t.upsertEntity(
    {
      partitionKey: userId,
      rowKey: `${courseId}|${lessonId}|${exercise.exerciseId}`,
      kind: "exercise",
      values: JSON.stringify(clean),
      updatedAt: new Date().toISOString(),
    },
    "Replace"
  );
  return clean;
}

/** Marks a knowledge check; returns per-question results with answers. */
function markQuiz(lesson, answers = []) {
  const results = (lesson.quiz || []).map((q, i) => {
    const chosen = Number.isInteger(answers[i]) ? answers[i] : null;
    return { chosen, correct: chosen === q.answer, answer: q.answer, explanation: q.explanation || "" };
  });
  return { score: results.filter((r) => r.correct).length, total: results.length, results };
}

async function saveQuiz(userId, courseId, lessonId, marked) {
  const t = table();
  await t.createTable().catch(() => {});
  await t.upsertEntity(
    {
      partitionKey: userId,
      rowKey: `${courseId}|${lessonId}|quiz`,
      kind: "quiz",
      values: JSON.stringify(marked),
      updatedAt: new Date().toISOString(),
    },
    "Replace"
  );
}

/** Everything a learner has saved in a course: { lessonId: { exercises, quiz } }. */
async function courseResponses(userId, courseId) {
  const out = {};
  try {
    for await (const e of table().listEntities({
      queryOptions: { filter: odata`PartitionKey eq ${userId} and RowKey ge ${courseId + "|"} and RowKey lt ${courseId + "|~"}` },
    })) {
      const [, lessonId, itemId] = e.rowKey.split("|");
      const lesson = (out[lessonId] ||= { exercises: {}, quiz: null });
      let values = {};
      try {
        values = JSON.parse(e.values || "{}");
      } catch {
        /* ignore */
      }
      if (e.kind === "quiz") lesson.quiz = values;
      else lesson.exercises[itemId] = values;
    }
  } catch (err) {
    if (err.statusCode !== 404) throw err;
  }
  return out;
}

/** An exercise's saved answers as readable text (for the AI coach). */
function exerciseAsText(exercise, values = {}) {
  if (exercise.table) {
    const lines = [];
    exercise.table.rows.forEach((row, r) => {
      const cells = exercise.table.columns.map((col, c) => (values[`r${r}c${c}`] || "").trim());
      if (cells.some(Boolean)) {
        lines.push(`${/^\d+$/.test(row) ? `${row}.` : `${row}:`} ` + exercise.table.columns.map((col, c) => `${col}: ${cells[c] || "—"}`).join(" | "));
      }
    });
    return lines.join("\n");
  }
  return (exercise.fields || [])
    .filter((f) => (values[f.id] || "").trim())
    .map((f) => `${f.label} ${values[f.id].trim()}`)
    .join("\n");
}

const MAX_TURNS = 40;
const MAX_TURN_CHARS = 6000;

/** Model input for a coach: its instructions, then the conversation. */
function coachInput(rules, coach, turns = []) {
  const clean = (Array.isArray(turns) ? turns : [])
    .filter((t) => (t?.role === "user" || t?.role === "assistant") && typeof t.content === "string" && t.content.trim())
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_TURN_CHARS) }));
  if (!clean.length || clean[0].role !== "user") return null;
  return [{ role: "developer", content: `${rules}\n\n${coach.systemPrompt}` }, ...clean].map((m) => ({
    type: "message",
    ...m,
  }));
}

module.exports = {
  findLesson,
  exerciseFieldIds,
  cleanValues,
  saveExercise,
  markQuiz,
  saveQuiz,
  courseResponses,
  exerciseAsText,
  coachInput,
};
