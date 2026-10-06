// Next Generation Science Standards (NGSS) performance expectations.
// K–5: the NGSS topic arrangement, grade by grade.
// Middle school (6–8) and high school (9–12): NGSS lists these as grade
// bands, arranged here by disciplinary core idea. Which year a middle-school
// expectation is taught is a state/district decision — the overlay says so.
const { range } = require("./frameworks");

const pe = (prefix, nums) => nums.map((n) => `NGSS ${prefix}-${n}`);

// [topic, [performance expectation codes]]
const K5 = {
  K: [
    ["Forces and Interactions: Pushes and Pulls", ["K-PS2-1", "K-PS2-2"]],
    ["Interdependent Relationships in Ecosystems: Animals, Plants, and Their Environment", ["K-LS1-1", "K-ESS2-2", "K-ESS3-1", "K-ESS3-3"]],
    ["Weather and Climate", ["K-PS3-1", "K-PS3-2", "K-ESS2-1", "K-ESS3-2"]],
  ],
  1: [
    ["Waves: Light and Sound", ["1-PS4-1", "1-PS4-2", "1-PS4-3", "1-PS4-4"]],
    ["Structure, Function, and Information Processing", ["1-LS1-1", "1-LS1-2", "1-LS3-1"]],
    ["Space Systems: Patterns and Cycles", ["1-ESS1-1", "1-ESS1-2"]],
  ],
  2: [
    ["Structure and Properties of Matter", ["2-PS1-1", "2-PS1-2", "2-PS1-3", "2-PS1-4"]],
    ["Interdependent Relationships in Ecosystems", ["2-LS2-1", "2-LS2-2", "2-LS4-1"]],
    ["Earth's Systems: Processes that Shape the Earth", ["2-ESS1-1", "2-ESS2-1", "2-ESS2-2", "2-ESS2-3"]],
  ],
  3: [
    ["Forces and Interactions", ["3-PS2-1", "3-PS2-2", "3-PS2-3", "3-PS2-4"]],
    ["Interdependent Relationships in Ecosystems", ["3-LS2-1", "3-LS4-1", "3-LS4-3", "3-LS4-4"]],
    ["Inheritance and Variation of Traits: Life Cycles and Traits", ["3-LS1-1", "3-LS3-1", "3-LS3-2", "3-LS4-2"]],
    ["Weather and Climate", ["3-ESS2-1", "3-ESS2-2", "3-ESS3-1"]],
  ],
  4: [
    ["Energy", ["4-PS3-1", "4-PS3-2", "4-PS3-3", "4-PS3-4", "4-ESS3-1"]],
    ["Waves: Waves and Information", ["4-PS4-1", "4-PS4-3"]],
    ["Structure, Function, and Information Processing", ["4-PS4-2", "4-LS1-1", "4-LS1-2"]],
    ["Earth's Systems: Processes that Shape the Earth", ["4-ESS1-1", "4-ESS2-1", "4-ESS2-2", "4-ESS3-2"]],
  ],
  5: [
    ["Structure and Properties of Matter", ["5-PS1-1", "5-PS1-2", "5-PS1-3", "5-PS1-4"]],
    ["Matter and Energy in Organisms and Ecosystems", ["5-PS3-1", "5-LS1-1", "5-LS2-1"]],
    ["Earth's Systems", ["5-ESS2-1", "5-ESS2-2", "5-ESS3-1"]],
    ["Space Systems: Stars and the Solar System", ["5-PS2-1", "5-ESS1-1", "5-ESS1-2"]],
  ],
};

// Engineering design is a K–2 / 3–5 band in NGSS.
const ETS_BAND = { K: "K-2", 1: "K-2", 2: "K-2", 3: "3-5", 4: "3-5", 5: "3-5" };

// Disciplinary core ideas: key → [name, middle-school count, high-school count]
const DCI = {
  PS1: ["Matter and Its Interactions", 6, 8],
  PS2: ["Motion and Stability: Forces and Interactions", 5, 6],
  PS3: ["Energy", 5, 5],
  PS4: ["Waves and Their Applications in Technologies for Information Transfer", 3, 5],
  LS1: ["From Molecules to Organisms: Structures and Processes", 8, 7],
  LS2: ["Ecosystems: Interactions, Energy, and Dynamics", 5, 8],
  LS3: ["Heredity: Inheritance and Variation of Traits", 2, 3],
  LS4: ["Biological Evolution: Unity and Diversity", 6, 6],
  ESS1: ["Earth's Place in the Universe", 4, 6],
  ESS2: ["Earth's Systems", 6, 7],
  ESS3: ["Earth and Human Activity", 5, 6],
  ETS1: ["Engineering Design", 4, 4],
};

const DISCIPLINES = [
  { key: "PS", name: "Physical Science", dcis: ["PS1", "PS2", "PS3", "PS4"] },
  { key: "LS", name: "Life Science", dcis: ["LS1", "LS2", "LS3", "LS4"] },
  { key: "ESS", name: "Earth and Space Science", dcis: ["ESS1", "ESS2", "ESS3"] },
  { key: "ETS", name: "Engineering, Technology, and Applications of Science", dcis: ["ETS1"] },
];

const MS_NOTE =
  "NGSS lists middle-school expectations for grades 6–8 together; your state or school decides which year each one is taught.";

function tree(grade) {
  if (K5[grade]) {
    const band = ETS_BAND[grade];
    const topics = K5[grade].map(([name, codes], i) => ({
      id: `science|${grade}|T${i + 1}`,
      code: codes.join(", "),
      name,
      standards: codes.map((c) => `NGSS ${c}`),
    }));
    topics.push({
      id: `science|${grade}|ETS`,
      code: `${band}-ETS1`,
      name: "Engineering Design",
      standards: pe(`${band}-ETS1`, range(1, 3)),
    });
    return [
      {
        id: `science|${grade}`,
        key: "topics",
        code: `NGSS Grade ${grade}`,
        name: grade === "K" ? "Kindergarten science topics" : `Grade ${grade} science topics`,
        short: "Science topics",
        skills: topics,
      },
    ];
  }
  const ms = ["6", "7", "8"].includes(grade);
  const band = ms ? "MS" : "HS";
  return DISCIPLINES.map((d) => ({
    id: `science|${band}|${d.key}`,
    key: d.key,
    code: `${band}-${d.key}`,
    name: d.name,
    short: d.name,
    note: ms ? MS_NOTE : undefined,
    skills: d.dcis.map((k) => {
      const [name, msCount, hsCount] = DCI[k];
      return {
        id: `science|${band}|${k}`,
        code: `${band}-${k}`,
        name,
        standards: pe(`${band}-${k}`, range(1, ms ? msCount : hsCount)),
      };
    }),
  }));
}

module.exports = { tree, K5, DCI, DISCIPLINES };
