// Shared helpers for "Delete Limiting Beliefs". Same lesson format as
// Become Extra Ordinary: HTML with inline data-block markers.

const block = (kind, id) => `<div data-block="${kind}${id ? `:${id}` : ""}"></div>`;
const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const field = (id, label, type = "textarea") => ({ id, label, type });
const numbered = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);
const flow = (steps) => `<p><strong>${steps.join("</strong><br>↓<br><strong>")}</strong></p>`;
const table = (head, rows) =>
  `<table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</table>`;
const list = (items) => `<ul>${items.map((i) => `<li>${i}</li>`).join("")}</ul>`;
const QUIZ_BANDS = [
  { min: 5, max: 5, title: "Excellent" },
  { min: 4, max: 4, title: "Strong understanding" },
  { min: 3, max: 3, title: "Developing" },
  { min: 0, max: 2, title: "Review this week's lesson" },
];

/** A delete script shown as a card: [belief, replace, install, run, lock]. */
const script = ([belief, replace, install, run, lock]) => `
<h3>"${belief}"</h3>
<p><strong>DELETE:</strong> "${belief}"<br>
<strong>REPLACE WITH:</strong> "${replace}"<br>
<strong>INSTALL:</strong> "${install}"<br>
<strong>RUN:</strong> ${run}<br>
<strong>LOCK:</strong> "${lock}"</p>`;

/** The two tracks, side by side: [[heading, youth], [heading, high achiever]]. */
const tracks = (youth, high) =>
  table(["🌱 Rising track (young people)", "💼 High Achiever track (wealth, success &amp; influence)"], [[youth, high]]);

const DELETE_FIELDS = [
  ["delete", "DELETE — the limiting belief, exactly as it sounds in my head:"],
  ["replace", "REPLACE WITH — a healthier belief I can actually believe:"],
  ["install", "INSTALL — the identity-level truth (\"I am…\" / \"I am becoming…\"):"],
  ["run", "RUN — one small action that proves the new belief:"],
  ["lock", "LOCK — my commitment statement:"],
];
const SCRIPT_COLUMNS = ["DELETE", "REPLACE WITH", "INSTALL", "RUN", "LOCK"];

/** A one-script builder exercise. */
const scriptBuilder = (exerciseId, title, intro) => ({
  exerciseId,
  title,
  ...(intro ? { intro } : {}),
  fields: DELETE_FIELDS.map(([id, label]) => field(id, label)),
});

/** A table of several scripts, one row per belief. */
const scriptTable = (exerciseId, title, n, rowLabel = "Script") => ({
  exerciseId,
  title,
  table: { columns: SCRIPT_COLUMNS, rows: numbered(rowLabel, n) },
});

module.exports = {
  block, q, field, numbered, flow, table, list, QUIZ_BANDS, script, tracks, scriptBuilder, scriptTable, SCRIPT_COLUMNS,
};
