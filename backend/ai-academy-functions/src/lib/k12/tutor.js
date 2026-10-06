// Prompts for the US K–12 tutor and checks on what comes back. Standard
// codes always come from the skill tree: the model may only pick from the
// skill's own list, and anything else is dropped or replaced.
const { STYLES, TIERS, DOK, SUBJECTS } = require("./frameworks");

const MAX_TURNS = 30;
const MAX_TURN_CHARS = 2000;
const oneLine = (s) => String(s || "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

const SAFETY = `## Safety (the learner is a child)
- Keep everything age-appropriate for the grade. Stay on the school topic.
- Never ask for or repeat personal details (full name, address, school, phone, photos). If the learner shares them, say kindly that they don't need to and carry on.
- If the learner seems upset, unsafe or mentions harm, stop teaching, respond kindly, and tell them to talk to a parent, carer or teacher right away.
- Be encouraging. Mistakes are part of learning.`;

function context(tree, domain, skill) {
  return `- Learner: ${tree.gradeLabel}, ${tree.state.name}
- Subject: ${tree.subjectLabel}
- National benchmark: ${tree.benchmark}
- ${tree.state.name}'s standards: ${tree.stateFramework}${tree.family === "state" ? " (the state's own framework — teach to its grade-level expectations; if this skill sits in a different grade there, say so briefly)" : ""}
- Skill: ${domain.short || domain.name} › ${skill.name}${domain.note ? `\n- Note: ${domain.note}` : ""}
- Standard codes for this skill (the ONLY codes you may cite): ${skill.standards.join("; ")}`;
}

const CODE_RULES = `## Standard codes
- Cite only the codes listed above, exactly as written. Never invent a code, and never write a state standard code (e.g. a TEKS, SOL or B.E.S.T. number) — the app shows the state's framework by name.`;

// ---- Micro-skills (the leaves of the skill tree) ------------------------

function microSkillsPrompt(tree, domain, skill) {
  return `${context(tree, domain, skill)}

Break this skill into 4 to 6 bite-sized micro-skills a child at this grade learns one at a time, in teaching order (easiest first). Each needs a short, parent-friendly title (max 8 words, e.g. "Adding fractions with like denominators") and the ONE code from the list above that it belongs to.
Reply with ONLY a JSON array: [{"title": "...", "code": "..."}]. No prose.`;
}

function extractJson(raw, open, close) {
  const s = String(raw || "");
  const a = s.indexOf(open);
  const b = s.lastIndexOf(close);
  if (a < 0 || b <= a) return null;
  try {
    return JSON.parse(s.slice(a, b + 1));
  } catch {
    return null;
  }
}

/** Valid micro-skills, codes forced into the skill's list. */
function parseMicroSkills(raw, skill) {
  const list = extractJson(raw, "[", "]");
  if (!Array.isArray(list)) return [];
  return list
    .map((m) => ({
      title: oneLine(m?.title).slice(0, 80),
      code: skill.standards.includes(m?.code) ? m.code : skill.standards[0],
    }))
    .filter((m) => m.title)
    .slice(0, 6);
}

// ---- Tutoring -----------------------------------------------------------

function learnSystemPrompt({ tree, domain, skill, micro, style, tier }) {
  return `You are the AI Academy US K–12 tutor, teaching one skill at a time to a child (a parent may be helping).

## Locked lesson
${context(tree, domain, skill)}${micro ? `\n- Focus for this session: ${micro}` : ""}

## How to explain (the learner chose this)
${STYLES[style].label}: ${STYLES[style].prompt}

## Level (the learner chose this)
${TIERS[tier].label} — ${TIERS[tier].prompt}

## Teaching rules
- Teach exactly this skill at this grade. Do not run ahead into later grades unless the level is Advanced.
- One idea per message, then one short check question for the learner. Wait for their answer — never answer your own question.
- If they are wrong, find the misconception and give one hint. If they are right, ask them to say why, then move on.
- Ask open questions the learner answers in their own words or numbers. Do NOT list answer options (no A/B/C choices) in tutoring messages.
- Use American English, US units and dollars where they fit the grade (metric where the standard uses it).
- Keep messages short: under 150 words, plain Markdown.

## Accuracy (a child is relying on you)
- Before you send a message, work out every number, fact and example yourself and check it. Never state something you have not checked.
- Story and real-world problems must be mathematically and scientifically sound — e.g. fractions you add or compare must be parts of the same whole (two slices of the same pizza, not part of a pizza plus part of a cake); quantities must make sense.
- When you check a learner's answer, solve the problem yourself first, then compare.

${CODE_RULES}
- End EVERY message with one final line exactly like: Standards: <the listed code(s) this message taught, separated by "; ">

${SAFETY}`;
}

function kickoff(micro) {
  return micro
    ? `Start the session on "${micro}". Give a one-sentence welcome, teach the first small step in my chosen style, then ask me one question.`
    : "Start the session. Give a one-sentence welcome, teach the first small step of this skill in my chosen style, then ask me one question.";
}

function learnInput(lesson, turns = []) {
  if (!Array.isArray(turns)) return { error: "Invalid conversation." };
  const clean = turns
    .filter((t) => (t?.role === "user" || t?.role === "assistant") && typeof t.content === "string")
    .slice(-MAX_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_TURN_CHARS) }));
  return {
    input: [
      { role: "developer", content: learnSystemPrompt(lesson) },
      { role: "user", content: kickoff(lesson.micro) },
      ...clean,
    ].map((m) => ({ type: "message", ...m })),
  };
}

/**
 * Splits the trailing "Standards: …" off a reply — on its own line or, when
 * the model runs it on, at the end of the last sentence — and keeps only
 * the skill's own codes.
 */
function splitStandards(text, skill) {
  const lines = String(text || "").trimEnd().split("\n");
  const last = lines[lines.length - 1] || "";
  let tags = [];
  const m = last.match(/^(.*?)\s*\**\s*standards?\s*:\**\s*([^:]*)$/i);
  if (m) {
    lines[lines.length - 1] = m[1];
    tags = m[2]
      .split(/[;,]/)
      .map((c) => c.replace(/[`*]/g, "").trim())
      .filter((c) => skill.standards.includes(c));
  }
  return { text: lines.join("\n").trim(), tags: [...new Set(tags.length ? tags : [skill.standards[0]])] };
}

// ---- Quizzes and worksheets --------------------------------------------

function quizPrompt({ tree, domain, skill, micro, tier, count, worksheet }) {
  const dok = TIERS[tier].dok;
  return `${context(tree, domain, skill)}${micro ? `\n- Focus: ${micro}` : ""}
- Level: ${TIERS[tier].label} — ${TIERS[tier].prompt}

Write a ${worksheet ? "printable practice worksheet" : "5-minute practice quiz"} with exactly ${count} questions on this skill for this grade.
- ${worksheet ? "Mix multiple-choice and short-answer questions (at least 3 short-answer)." : "All multiple choice, 4 options each, exactly one correct."}
- Depth of Knowledge: use DOK levels ${dok.join(", ")} (${dok.map((d) => `${d} = ${DOK[d]}`).join("; ")}), easiest first.
- Plausible wrong options that reveal common misconceptions. Age-appropriate wording; no personal questions.
- Options are plain values — no "A." / "B." letters. No two options may be equal in value (e.g. never offer both 3/6 and 1/2, or 0.5 and 1/2).
- ACCURACY: for each question, first work the problem out fully in "working", THEN write "answer" as the exact text of the correct option (or, for short answer, the model answer). Make sure exactly one option is correct.
- Every question gets ONE code from the list above.
${CODE_RULES}

Reply with ONLY JSON:
{"questions":[{"type":"mc"|"short","question":"...","working":"step-by-step solution","options":["...","...","...","..."],"answer":"exact text of the correct option, or the model answer","explanation":"one sentence for the learner","dok":<1-4>,"code":"..."}]}`;
}

const stripLetter = (o) => String(o).trim().replace(/^\(?[A-Da-d][.)]\s+/, "").slice(0, 200);
const norm = (s) => String(s ?? "").toLowerCase().replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();

function parseQuiz(raw, skill, tier, worksheet) {
  const data = extractJson(raw, "{", "}");
  const list = Array.isArray(data?.questions) ? data.questions : [];
  const allowedDok = TIERS[tier].dok;
  const out = [];
  for (const q of list) {
    const question = String(q?.question || "").trim().slice(0, 600);
    if (!question) continue;
    const base = {
      question,
      explanation: String(q?.explanation || "").trim().slice(0, 400),
      dok: allowedDok.includes(Number(q?.dok)) ? Number(q.dok) : allowedDok[0],
      code: skill.standards.includes(q?.code) ? q.code : skill.standards[0],
    };
    const options = Array.isArray(q?.options) ? q.options.map(stripLetter).filter(Boolean) : [];
    if (q?.type !== "short" && options.length === 4 && new Set(options.map(norm)).size === 4 && !hasEqualValues(options)) {
      // The answer is the option's text; an index is accepted from older replies.
      let answer = options.findIndex((o) => norm(o) === norm(stripLetter(q?.answer)));
      if (answer < 0 && Number.isInteger(q?.answer) && q.answer >= 0 && q.answer < 4) answer = q.answer;
      if (answer >= 0) out.push({ type: "mc", ...base, options, answer });
    } else if (worksheet && (q?.type === "short" || !options.length)) {
      const answer = String(q?.answer ?? "").trim().slice(0, 300);
      if (answer) out.push({ type: "short", ...base, answer });
    }
  }
  return out.map((q) => ({ ...q, dokLabel: DOK[q.dok] }));
}

/**
 * The numeric value of an option like "3/6", "1 1/2", "0.5", "$12", "75 ml",
 * or null when it isn't a number.
 */
function numericValue(option) {
  const s = String(option).trim().replace(/^[$\u2212-]?\s*/, (m) => (m.includes("-") || m.includes("\u2212") ? "-" : "")).replace(/,/g, "");
  const m = s.match(/^(-?)(?:(\d+)\s+)?(\d+(?:\.\d+)?)(?:\s*\/\s*(\d+(?:\.\d+)?))?\s*(%|[a-zA-Z ]{0,12})?$/);
  if (!m) return null;
  const [, sign, whole, num, den] = m;
  if (den !== undefined && Number(den) === 0) return null;
  let v = den !== undefined ? Number(num) / Number(den) : Number(num);
  if (whole !== undefined) {
    if (den === undefined) return null;
    v += Number(whole);
  }
  return sign ? -v : v;
}

/** True when two options of a question are the same number (e.g. 1/2 and 3/6). */
function hasEqualValues(options) {
  const values = options.map(numericValue).filter((v) => v !== null);
  return values.some((v, i) => values.slice(i + 1).some((w) => Math.abs(v - w) < 1e-9));
}

/** An independent check: solve each multiple-choice question without the key. */
function verifyPrompt(questions, tree) {
  const items = questions
    .map((q, i) => (q.type === "mc" ? { n: i + 1, question: q.question, options: q.options } : null))
    .filter(Boolean);
  return `You are checking a ${tree.gradeLabel} ${tree.subjectLabel} quiz before a child sees it. Solve each question yourself, carefully, showing your working. Then pick the ONE correct option, copied exactly. If no option is correct, or more than one is — including options that are equal in value, like 1/2 and 3/6 — answer "INVALID".

${JSON.stringify(items)}

Reply with ONLY JSON: {"answers":[{"n":1,"working":"...","answer":"exact option text or INVALID"}]}`;
}

/**
 * Keeps short-answer questions and the multiple-choice questions whose key
 * the independent check agrees with.
 */
function applyVerification(questions, raw) {
  const data = extractJson(raw, "{", "}");
  const answers = new Map((Array.isArray(data?.answers) ? data.answers : []).map((a) => [Number(a?.n), stripLetter(a?.answer)]));
  return questions.filter((q, i) => q.type !== "mc" || norm(answers.get(i + 1)) === norm(q.options[q.answer]));
}

// ---- Parent insights ---------------------------------------------------

function insightsPrompt(summary) {
  return `You are writing a short note for a parent about their child's learning this week in the AI Academy US K–12 tutor. Use ONLY the data below. 3–5 sentences, warm and specific, plain English, no jargon. Mention what went well, one area to support, and one simple thing the parent can do at home (under 10 minutes). Do not invent results. Do not use the child's name.

${JSON.stringify(summary)}`;
}

module.exports = {
  SUBJECTS,
  microSkillsPrompt,
  parseMicroSkills,
  learnSystemPrompt,
  learnInput,
  splitStandards,
  quizPrompt,
  parseQuiz,
  verifyPrompt,
  applyVerification,
  numericValue,
  hasEqualValues,
  insightsPrompt,
  oneLine,
};
