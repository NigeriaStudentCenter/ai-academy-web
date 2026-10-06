// Common Core State Standards for English Language Arts.
// Grade → strand → standard. Each standard is named from its College and
// Career Readiness anchor (same number in every grade) and carries the real
// grade-specific code, e.g. CCSS.ELA-LITERACY.RL.4.2. High school uses the
// 9-10 and 11-12 bands. Range-of-reading/writing standards (RL/RI.10, W.10)
// are left out: they describe volume, not a teachable skill.
const { isHighSchool } = require("./frameworks");

const STRANDS = {
  RL: { name: "Reading: Literature", short: "Reading stories & poems" },
  RI: { name: "Reading: Informational Text", short: "Reading nonfiction" },
  RF: { name: "Reading: Foundational Skills", short: "Phonics & fluency" },
  W: { name: "Writing", short: "Writing" },
  SL: { name: "Speaking and Listening", short: "Speaking & listening" },
  L: { name: "Language", short: "Grammar & vocabulary" },
};

// Anchor-based names. A [K–5 name, 6–12 name] pair where wording changes.
const NAMES = {
  RL: {
    1: "Read closely: key details and textual evidence",
    2: "Theme and summarizing",
    3: "Characters, settings and events",
    4: "Word and phrase meanings in context",
    5: "Text structure (stories, poems, drama)",
    6: "Point of view",
    7: "Illustrations, film and other media",
    9: "Compare and contrast stories",
  },
  RI: {
    1: "Read closely: key details and textual evidence",
    2: "Main idea and summarizing",
    3: "Connections between people, events and ideas",
    4: "Word and phrase meanings in context",
    5: "Text structure and text features",
    6: "Author's point of view and purpose",
    7: "Information from visuals and other media",
    8: "Reasons, evidence and argument",
    9: "Compare two texts on the same topic",
  },
  RF: {
    1: "Print concepts",
    2: "Phonological awareness",
    3: "Phonics and word recognition",
    4: "Fluency",
  },
  W: {
    1: ["Opinion writing", "Argument writing"],
    2: "Informative and explanatory writing",
    3: "Narrative writing",
    4: "Clear, organized writing for a task and audience",
    5: "Planning, revising and editing",
    6: "Using technology to write and publish",
    7: "Short research projects",
    8: "Gathering information from sources",
    9: "Using evidence from texts in writing",
  },
  SL: {
    1: "Collaborative discussions",
    2: "Understanding information presented orally or in media",
    3: "Evaluating a speaker's points",
    4: "Presenting ideas and findings",
    5: "Using media and visuals in presentations",
    6: "Speaking for the task and audience",
  },
  L: {
    1: "Grammar and usage",
    2: "Capitalization, punctuation and spelling",
    3: "Knowledge of language: style and effect",
    4: "Working out unknown words",
    5: "Word relationships and figurative language",
    6: "Academic and topic vocabulary",
  },
};

/** Which standard numbers exist for a strand at a grade. */
function numbersFor(strand, grade) {
  const g = grade === "K" ? 0 : Number(grade);
  switch (strand) {
    case "RL":
      return [1, 2, 3, 4, 5, 6, 7, 9]; // RL.8 is "not applicable to literature"
    case "RI":
      return [1, 2, 3, 4, 5, 6, 7, 8, 9];
    case "RF":
      if (g > 5) return [];
      return g <= 1 ? [1, 2, 3, 4] : [3, 4];
    case "W":
      // W.4 begins in grade 3; W.9 begins in grade 4.
      return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !(n === 4 && g < 3) && !(n === 9 && g < 4));
    case "SL":
      return [1, 2, 3, 4, 5, 6];
    case "L":
      return [1, 2, 3, 4, 5, 6].filter((n) => !(n === 3 && g < 2)); // L.3 begins in grade 2
    default:
      return [];
  }
}

/** The grade segment of the code: K, 1–8, 9-10 or 11-12. */
function codeGrade(grade) {
  if (!isHighSchool(grade)) return grade;
  return ["9", "10"].includes(grade) ? "9-10" : "11-12";
}

function nameFor(strand, n, grade) {
  const v = NAMES[strand][n];
  if (!Array.isArray(v)) return v;
  const g = grade === "K" ? 0 : Number(grade);
  return g <= 5 ? v[0] : v[1];
}

function tree(grade) {
  const cg = codeGrade(grade);
  return Object.entries(STRANDS)
    .map(([key, s]) => ({
      id: `ela|${cg}|${key}`,
      key,
      code: `${key}.${cg}`,
      name: s.name,
      short: s.short,
      skills: numbersFor(key, grade).map((n) => ({
        id: `ela|${cg}|${key}|${n}`,
        code: `${key}.${cg}.${n}`,
        name: nameFor(key, n, grade),
        standards: [`CCSS.ELA-LITERACY.${key}.${cg}.${n}`],
      })),
    }))
    .filter((d) => d.skills.length);
}

module.exports = { tree, STRANDS, numbersFor, codeGrade };
