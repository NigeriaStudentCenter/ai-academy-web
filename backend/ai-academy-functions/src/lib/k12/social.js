// C3 Framework for Social Studies State Standards (NCSS, 2013).
// C3 is an inquiry framework, not a list of content: every state writes its
// own social studies standards and decides what history/geography is taught
// in which grade. So the tree has:
//   - the four Dimension 2 disciplines, by their C3 categories, and
//   - the inquiry arc (Dimensions 1, 3, 4),
// tagged with C3 indicator ranges for the learner's grade band, plus a
// "this year's content" node that the state overlay fills in.
const { gradeBand } = require("./frameworks");

// Discipline → [category, first indicator, last indicator]
const D2 = {
  Civ: {
    name: "Civics",
    categories: [
      ["Civic and political institutions", 1, 6],
      ["Participation and deliberation: applying civic virtues and democratic principles", 7, 10],
      ["Processes, rules, and laws", 11, 14],
    ],
  },
  Eco: {
    name: "Economics",
    categories: [
      ["Economic decision making", 1, 2],
      ["Exchange and markets", 3, 8],
      ["The national economy", 9, 12],
      ["The global economy", 13, 15],
    ],
  },
  Geo: {
    name: "Geography",
    categories: [
      ["Geographic representations: spatial views of the world", 1, 3],
      ["Human-environment interaction: place, regions, and culture", 4, 6],
      ["Human population: spatial patterns and movements", 7, 9],
      ["Global interconnections: changing spatial patterns", 10, 12],
    ],
  },
  His: {
    name: "History",
    categories: [
      ["Change, continuity, and context", 1, 3],
      ["Perspectives", 4, 8],
      ["Historical sources and evidence", 9, 13],
      ["Causation and argumentation", 14, 17],
    ],
  },
};

const INQUIRY = [
  ["D1", "Developing questions and planning inquiries", 1, 5],
  ["D3", "Evaluating sources and using evidence", 1, 4],
  ["D4", "Communicating conclusions and taking informed action", 1, 8],
];

/** Typical content focus by grade. States differ — the overlay replaces this. */
const TYPICAL_CONTENT = {
  K: "Myself, my family and my school; rules and responsibilities",
  1: "Families and communities, past and present",
  2: "Communities near and far; people who supply goods and services",
  3: "Communities, citizenship and local geography",
  4: "Your state's history and geography (in many states)",
  5: "Early United States history (in many states)",
  6: "World history and geography — often ancient civilizations",
  7: "World history, or your state's history (varies by state)",
  8: "United States history (often to Reconstruction)",
  9: "World history or geography (varies by district)",
  10: "World history (varies by district)",
  11: "United States history",
  12: "U.S. government/civics and economics",
};

const tag = (dim, a, b, band) => `C3 ${dim}.${a}–${b} (Grades ${band})`;

function tree(grade) {
  const band = gradeBand(grade);
  const disciplines = Object.entries(D2).map(([key, d]) => ({
    id: `social|${band}|${key}`,
    key,
    code: `D2.${key}`,
    name: d.name,
    short: d.name,
    skills: d.categories.map(([name, a, b]) => ({
      id: `social|${band}|${key}|${a}`,
      code: `D2.${key}.${a}–${b}`,
      name: name[0].toUpperCase() + name.slice(1),
      standards: [tag(`D2.${key}`, a, b, band)],
    })),
  }));
  return [
    {
      id: `social|${grade}|content`,
      key: "content",
      code: `Grade ${grade}`,
      name: "This year's content focus",
      short: "This year",
      note: "Social studies content is set by each state. This is the common pattern — your state's focus is shown when it differs.",
      skills: [
        {
          id: `social|${grade}|content|1`,
          code: `Grade ${grade}`,
          name: TYPICAL_CONTENT[grade],
          standards: [tag("D2", 1, 17, band).replace("D2.1–17", "D2 (all disciplines)")],
        },
      ],
    },
    ...disciplines,
    {
      id: `social|${band}|inquiry`,
      key: "inquiry",
      code: "D1, D3, D4",
      name: "Inquiry skills",
      short: "Inquiry skills",
      skills: INQUIRY.map(([dim, name, a, b]) => ({
        id: `social|${band}|inquiry|${dim}`,
        code: dim,
        name,
        standards: [tag(dim, a, b, band)],
      })),
    },
  ];
}

module.exports = { tree, D2, INQUIRY, TYPICAL_CONTENT };
