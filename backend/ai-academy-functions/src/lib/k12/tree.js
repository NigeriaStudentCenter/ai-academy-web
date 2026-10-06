// Builds the skill tree a learner sees: the national-benchmark tree for the
// subject and grade, with the state overlay applied.
const { GRADES, SUBJECTS, gradeLabel, isHighSchool } = require("./frameworks");
const { STATES, OVERRIDES, frameworkFor } = require("./states");

const BUILDERS = {
  math: require("./math").tree,
  ela: require("./ela").tree,
  science: require("./science").tree,
  social: require("./social").tree,
};

/** Validates a state / grade / subject choice. Returns { ctx } or { error }. */
function validateContext({ state, grade, subject } = {}) {
  if (!STATES[state]) return { error: "Choose a state." };
  if (!GRADES.includes(String(grade))) return { error: "Choose a grade level." };
  if (!SUBJECTS[subject]) return { error: "Choose a subject." };
  return { ctx: { state, grade: String(grade), subject } };
}

function buildTree({ state, grade, subject }) {
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
