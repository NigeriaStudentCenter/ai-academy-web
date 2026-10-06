// State-specific overlay. Every state sets its own standards; most build on
// the national frameworks. For each state and subject this records:
//   family — "ccss"  : Common Core, as adopted or revised by the state
//            "ngss"  : adopted the NGSS
//            "state" : the state's own framework (taught to that framework;
//                      national codes are shown only as an alignment reference)
//   framework — what to call the state's standards.
// Only facts we are confident of are encoded; anything else falls back to a
// generic, honest label. State standard CODES are never generated — the
// tutor is told not to invent them.
//
// Reviewed: 2026-10. Have a US curriculum specialist check this table (and
// consider a licensed standards dataset) before marketing state alignment.

const STATES = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado",
  CT: "Connecticut", DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
  LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan", MN: "Minnesota",
  MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire",
  NJ: "New Jersey", NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota",
  OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island",
  SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

// States that did not adopt the Common Core for math and/or ELA, or replaced it.
const OWN_MATH_ELA = {
  TX: { math: "Texas Essential Knowledge and Skills (TEKS)", ela: "Texas Essential Knowledge and Skills (TEKS) for English Language Arts and Reading" },
  VA: { math: "Virginia Standards of Learning (SOL)", ela: "Virginia Standards of Learning (SOL)" },
  FL: { math: "Florida B.E.S.T. Standards (Benchmarks for Excellent Student Thinking)", ela: "Florida B.E.S.T. Standards (Benchmarks for Excellent Student Thinking)" },
  AK: { math: "Alaska Mathematics Standards", ela: "Alaska English/Language Arts Standards" },
  NE: { math: "Nebraska College and Career Ready Standards for Mathematics", ela: "Nebraska College and Career Ready Standards for English Language Arts" },
  IN: { math: "Indiana Academic Standards", ela: "Indiana Academic Standards" },
  OK: { math: "Oklahoma Academic Standards", ela: "Oklahoma Academic Standards" },
  SC: { math: "South Carolina College- and Career-Ready Standards", ela: "South Carolina College- and Career-Ready Standards" },
  MN: { math: "Minnesota K-12 Academic Standards in Mathematics" }, // ELA is Common Core-based
};

// Well-known names for Common Core-based editions.
const CCSS_NAMES = {
  NY: "New York State Next Generation Learning Standards (based on the Common Core)",
  CA: "California Common Core State Standards",
};

// Adopted the NGSS (20 states + DC).
const NGSS_ADOPTED = ["AR", "CA", "CT", "DE", "DC", "HI", "IL", "IA", "KS", "KY", "ME", "MD", "MI", "NV", "NH", "NJ", "NM", "OR", "RI", "VT", "WA"];

// Own science frameworks.
const OWN_SCIENCE = {
  TX: "Texas Essential Knowledge and Skills (TEKS) for Science",
  FL: "Florida Next Generation Sunshine State Standards for Science",
  VA: "Virginia Science Standards of Learning (SOL)",
};

const SOCIAL_NAMES = {
  TX: "Texas Essential Knowledge and Skills (TEKS) for Social Studies",
  VA: "Virginia History and Social Science Standards of Learning (SOL)",
  CA: "California History–Social Science Content Standards",
  FL: "Florida Social Studies Standards",
  NY: "New York State K-12 Social Studies Framework",
};

/**
 * Curated changes to the national-benchmark tree for a state:
 *   add     — extra domains the state teaches that the benchmark lacks
 *   content — replaces the social studies "this year" focus
 * Keep to well-established facts; no state standard codes.
 */
const OVERRIDES = {
  TX: {
    math: {
      grades: ["K", "1", "2", "3", "4", "5", "6", "7", "8"],
      add: (grade) => ({
        id: `math|${grade}|TX-PFL`,
        key: "PFL",
        code: "TEKS PFL",
        name: "Personal Financial Literacy (TEKS strand)",
        short: "Money & personal finance",
        source: "state",
        skills: [
          {
            id: `math|${grade}|TX-PFL|1`,
            code: "TEKS PFL",
            name: "Earning, saving, spending and planning with money at this grade",
            standards: [`TEKS Mathematics, Grade ${grade}: Personal Financial Literacy`],
            source: "state",
          },
        ],
      }),
    },
    social: { content: { 4: "Texas history and geography", 7: "Texas history" } },
  },
  VA: { social: { content: { 4: "Virginia Studies — Virginia's history and geography" } } },
  CA: { social: { content: { 4: "California history and geography" } } },
  FL: { social: { content: { 4: "Florida history" } } },
  NY: { social: { content: { 4: "Local history and local government (New York)", 7: "History of the United States and New York", 8: "History of the United States and New York" } } },
};

/** The standards picture for one state and subject. */
function frameworkFor(state, subject) {
  const name = STATES[state];
  if (subject === "math" || subject === "ela") {
    const own = OWN_MATH_ELA[state]?.[subject];
    if (own) return { family: "state", framework: own };
    return {
      family: "ccss",
      framework: CCSS_NAMES[state] || `${name} standards — the Common Core, as adopted or revised by ${name}`,
    };
  }
  if (subject === "science") {
    if (OWN_SCIENCE[state]) return { family: "state", framework: OWN_SCIENCE[state] };
    if (NGSS_ADOPTED.includes(state)) return { family: "ngss", framework: "Next Generation Science Standards (NGSS), adopted by the state" };
    return { family: "state", framework: `${name} science standards (many states build theirs on the NGSS framework)` };
  }
  // Social studies: every state has its own standards; C3 is the inquiry benchmark.
  return { family: "state", framework: SOCIAL_NAMES[state] || `${name} social studies standards` };
}

module.exports = { STATES, OVERRIDES, frameworkFor, NGSS_ADOPTED, OWN_MATH_ELA };
