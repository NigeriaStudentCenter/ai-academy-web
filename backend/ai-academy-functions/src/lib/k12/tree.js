// Builds the skill tree a learner sees: the national-benchmark tree for the
// subject and grade, with the state overlay applied.
const { LEARNER_GRADES, SUBJECTS, gradeLabel, isHighSchool } = require("./frameworks");
const { STATES, OVERRIDES, frameworkFor } = require("./states");
const cambridge = require("./cambridge");

const BUILDERS = {
  math: require("./math").tree,
  ela: require("./ela").tree,
  science: require("./science").tree,
  social: require("./social").tree,
};

/**
 * Validates a learner's context. US: state / grade / subject. Cambridge:
 * stage / syllabus code. Returns { ctx } or { error }.
 */
function validateContext({ curriculum = "us", state, grade, stage, subject } = {}) {
  if (curriculum === "cambridge") {
    if (!cambridge.STAGES[stage]) return { error: "Choose a Cambridge stage." };
    if (!cambridge.syllabus(stage, subject)) return { error: "Choose a subject." };
    return { ctx: { curriculum, stage, subject } };
  }
  if (!STATES[state]) return { error: "Choose a state." };
  if (!LEARNER_GRADES.includes(String(grade))) return { error: "Choose a grade level (8–12)." };
  if (!SUBJECTS[subject]) return { error: "Choose a subject." };
  return { ctx: { curriculum: "us", state, grade: String(grade), subject } };
}

/** The tree for a learner's context — US or Cambridge. */
function buildTree(ctx) {
  if (ctx.curriculum === "cambridge") {
    const domains = cambridge.tree(ctx.stage, ctx.subject).map((d) => ({ ...d, source: "cambridge", skills: d.skills.map((s) => ({ ...s, source: "cambridge" })) }));
    return { ...cambridge.treeMeta(ctx.stage, ctx.subject), domains };
  }
  return buildUsTree(ctx);
}

function buildUsTree({ state, grade, subject }) {
  const domains = BUILDERS[subject](grade).map((d) => ({ ...d, source: "national", skills: d.skills.map((s) => ({ ...s, source: "national" })) }));
  const ov = OVERRIDES[state]?.[subject];
  if (ov?.add && ov.grades.includes(grade)) domains.push(ov.add(grade));
  const content = ov?.content?.[grade];
  if (subject === "social" && content) {
    const node = domains.find((d) => d.key === "content");
    node.note = `${STATES[state]} sets this year's focus.`;
    node.skills = node.skills.map((s) => ({ ...s, name: content, source: "state" }));
  }
  const fw = frameworkFor(state, subject);
  return {
    curriculum: "us",
    state: { code: state, name: STATES[state] },
    grade,
    gradeLabel: gradeLabel(grade),
    highSchool: isHighSchool(grade),
    subject,
    subjectLabel: SUBJECTS[subject].label,
    benchmark: SUBJECTS[subject].framework,
    stateFramework: fw.framework,
    family: fw.family,
    alignmentNote:
      fw.family === "state"
        ? `${STATES[state]} uses its own standards: ${fw.framework}. Skills are organized by the national benchmark (${SUBJECTS[subject].short}), and the codes shown are national benchmark codes for alignment — ${STATES[state]}'s own numbering and grade placement can differ.`
        : `Codes shown are ${SUBJECTS[subject].short} codes, which ${STATES[state]}'s standards follow.`,
    domains,
  };
}

/** Finds one skill in the learner's tree. */
function findSkill(ctx, skillId) {
  const tree = buildTree(ctx);
  for (const d of tree.domains) {
    const skill = d.skills.find((s) => s.id === skillId);
    if (skill) return { tree, domain: d, skill };
  }
  return null;
}

/** All skills in tree order — used for "what next" recommendations. */
function allSkills(ctx) {
  return buildTree(ctx).domains.flatMap((d) => d.skills.map((s) => ({ ...s, domain: d.short || d.name })));
}

module.exports = { validateContext, buildTree, findSkill, allSkills };
