// Shared helpers for built-in courses written as HTML lessons with inline
// interactive blocks: <div data-block="exercise:ID|coach:ID|scenario:ID|quiz|portfolio">.

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
const ol = (items) => `<ol>${items.map((i) => `<li>${i}</li>`).join("")}</ol>`;
/** A short conversation: [[speaker, line], …]; stage directions in [brackets] are italicised. */
const dialogue = (lines) =>
  `<p>${lines
    .map(([who, line]) => `<strong>${who}:</strong> ${line.replace(/\[([^\]]+)\]/g, "<em>[$1]</em>")}`)
    .join("<br>")}</p>`;
const QUIZ_BANDS = [
  { min: 5, max: 5, title: "Excellent" },
  { min: 4, max: 4, title: "Strong understanding" },
  { min: 3, max: 3, title: "Developing" },
  { min: 0, max: 2, title: "Review this lesson" },
];

module.exports = { block, q, field, numbered, flow, table, list, ol, dialogue, QUIZ_BANDS };
