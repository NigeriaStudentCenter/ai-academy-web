// US K–12: shared definitions. The US has no national curriculum, so the
// engine runs on the national benchmark frameworks most states build on —
// CCSS (math, ELA), NGSS (science), C3 (social studies) — and a state
// overlay (states.js) adjusts labels, placement and extra strands.

/** Grade levels, K–12. High school grades share course-based trees. */
const GRADES = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

const GRADE_LABELS = {
  K: "Kindergarten",
  9: "Grade 9 (High School)",
  10: "Grade 10 (High School)",
  11: "Grade 11 (High School)",
  12: "Grade 12 (High School)",
};
const gradeLabel = (g) => GRADE_LABELS[g] || `Grade ${g}`;
const isHighSchool = (g) => ["9", "10", "11", "12"].includes(String(g));

/** The K–2 / 3–5 / 6–8 / 9–12 band a grade sits in. */
function gradeBand(g) {
  if (["K", "1", "2"].includes(g)) return "K-2";
  if (["3", "4", "5"].includes(g)) return "3-5";
  if (["6", "7", "8"].includes(g)) return "6-8";
  return "9-12";
}

const SUBJECTS = {
  math: { label: "Math", framework: "Common Core State Standards for Mathematics (CCSS)", short: "CCSS Math" },
  ela: { label: "English Language Arts", framework: "Common Core State Standards for English Language Arts (CCSS)", short: "CCSS ELA" },
  science: { label: "Science", framework: "Next Generation Science Standards (NGSS)", short: "NGSS" },
  social: { label: "Social Studies", framework: "C3 Framework for Social Studies (College, Career, and Civic Life)", short: "C3" },
};

/** How the tutor explains — the learner picks one. */
const STYLES = {
  eli8: {
    label: "Explain like I'm 8",
    prompt: "Explain as if to a bright 8-year-old: very short sentences, everyday words, one friendly comparison (food, games, sport, pets). No jargon unless you explain it in five words.",
  },
  story: {
    label: "Teach me through a story",
    prompt: "Teach through a short story with a named character who meets the idea as a problem and solves it. The concept must be correct inside the story. End the story by naming the skill plainly.",
  },
  visual: {
    label: "Step-by-step visual breakdown",
    prompt: "Give a numbered step-by-step breakdown. Use simple text visuals that render in Markdown — small tables, number lines like 0 —|—|— 1, or grouped symbols (e.g. ■■■ □□) — so the learner can see each step.",
  },
  realworld: {
    label: "Show me a real-world example",
    prompt: "Anchor everything in one real-life situation a child in the United States would recognise (shopping, sports, cooking, a road trip, a school event), then generalise to the rule.",
  },
  socratic: {
    label: "Ask me questions",
    prompt: "Be Socratic: teach one micro-step, then ask ONE question and stop. If the learner is stuck give one hint, not the answer. When they are right, ask them to explain why.",
  },
};

/** Differentiation tiers, with the Webb's Depth of Knowledge levels each targets. */
const TIERS = {
  support: {
    label: "Catch-up",
    detail: "Below grade level — rebuild the foundations",
    dok: [1, 2],
    prompt: "Remedial tier: start from the prerequisite skill one grade below, use concrete examples and small steps, and check understanding often. Tasks at DOK 1–2 (recall, basic application).",
  },
  core: {
    label: "On grade level",
    detail: "What the standard expects this year",
    dok: [1, 2, 3],
    prompt: "Grade-level tier: teach exactly what the standard expects at this grade. Tasks at DOK 1–3, ending with at least one DOK 3 (strategic thinking: explain, justify, solve a multi-step problem).",
  },
  advanced: {
    label: "Advanced / honors",
    detail: "Stretch beyond grade level",
    dok: [3, 4],
    prompt: "Advanced/honors tier: assume the grade-level skill is secure; push to DOK 3–4 — non-routine problems, justification, connections to the next grade's standards, open-ended investigation.",
  },
};

/** Webb's Depth of Knowledge — shown to parents next to quiz items. */
const DOK = {
  1: "Recall & reproduction",
  2: "Skills & concepts",
  3: "Strategic thinking",
  4: "Extended thinking",
};

/** Inclusive integer range. */
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

module.exports = { GRADES, gradeLabel, isHighSchool, gradeBand, SUBJECTS, STYLES, TIERS, DOK, range };
