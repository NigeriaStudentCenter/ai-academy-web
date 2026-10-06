// Common Core State Standards for Mathematics.
// K–8: grade → domain → cluster, with every standard code in the cluster.
// High school: typical traditional pathway (Algebra I, Geometry, Algebra II)
// → domain. HS standards are tagged at domain level (e.g.
// CCSS.MATH.CONTENT.HSA.REI) so we never cite a code that doesn't exist.
const { range } = require("./frameworks");

const DOMAINS = {
  CC: { name: "Counting and Cardinality", short: "Counting" },
  OA: { name: "Operations and Algebraic Thinking", short: "Operations & algebraic thinking" },
  NBT: { name: "Number and Operations in Base Ten", short: "Place value" },
  NF: { name: "Number and Operations—Fractions", short: "Fractions" },
  MD: { name: "Measurement and Data", short: "Measurement & data" },
  G: { name: "Geometry", short: "Geometry" },
  RP: { name: "Ratios and Proportional Relationships", short: "Ratios & proportions" },
  NS: { name: "The Number System", short: "Number system" },
  EE: { name: "Expressions and Equations", short: "Expressions & equations" },
  F: { name: "Functions", short: "Functions" },
  SP: { name: "Statistics and Probability", short: "Statistics & probability" },
};

// [domain, cluster letter, heading, first standard, last standard]
const K8 = {
  K: [
    ["CC", "A", "Know number names and the count sequence", 1, 3],
    ["CC", "B", "Count to tell the number of objects", 4, 5],
    ["CC", "C", "Compare numbers", 6, 7],
    ["OA", "A", "Understand addition as putting together and adding to, and subtraction as taking apart and taking from", 1, 5],
    ["NBT", "A", "Work with numbers 11–19 to gain foundations for place value", 1, 1],
    ["MD", "A", "Describe and compare measurable attributes", 1, 2],
    ["MD", "B", "Classify objects and count the number of objects in each category", 3, 3],
    ["G", "A", "Identify and describe shapes", 1, 3],
    ["G", "B", "Analyze, compare, create, and compose shapes", 4, 6],
  ],
  1: [
    ["OA", "A", "Represent and solve problems involving addition and subtraction", 1, 2],
    ["OA", "B", "Understand and apply properties of operations and the relationship between addition and subtraction", 3, 4],
    ["OA", "C", "Add and subtract within 20", 5, 6],
    ["OA", "D", "Work with addition and subtraction equations", 7, 8],
    ["NBT", "A", "Extend the counting sequence", 1, 1],
    ["NBT", "B", "Understand place value", 2, 3],
    ["NBT", "C", "Use place value understanding and properties of operations to add and subtract", 4, 6],
    ["MD", "A", "Measure lengths indirectly and by iterating length units", 1, 2],
    ["MD", "B", "Tell and write time", 3, 3],
    ["MD", "C", "Represent and interpret data", 4, 4],
    ["G", "A", "Reason with shapes and their attributes", 1, 3],
  ],
  2: [
    ["OA", "A", "Represent and solve problems involving addition and subtraction", 1, 1],
    ["OA", "B", "Add and subtract within 20", 2, 2],
    ["OA", "C", "Work with equal groups of objects to gain foundations for multiplication", 3, 4],
    ["NBT", "A", "Understand place value", 1, 4],
    ["NBT", "B", "Use place value understanding and properties of operations to add and subtract", 5, 9],
    ["MD", "A", "Measure and estimate lengths in standard units", 1, 4],
    ["MD", "B", "Relate addition and subtraction to length", 5, 6],
    ["MD", "C", "Work with time and money", 7, 8],
    ["MD", "D", "Represent and interpret data", 9, 10],
    ["G", "A", "Reason with shapes and their attributes", 1, 3],
  ],
  3: [
    ["OA", "A", "Represent and solve problems involving multiplication and division", 1, 4],
    ["OA", "B", "Understand properties of multiplication and the relationship between multiplication and division", 5, 6],
    ["OA", "C", "Multiply and divide within 100", 7, 7],
    ["OA", "D", "Solve problems involving the four operations, and identify and explain patterns in arithmetic", 8, 9],
    ["NBT", "A", "Use place value understanding and properties of operations to perform multi-digit arithmetic", 1, 3],
    ["NF", "A", "Develop understanding of fractions as numbers", 1, 3],
    ["MD", "A", "Solve problems involving measurement and estimation", 1, 2],
    ["MD", "B", "Represent and interpret data", 3, 4],
    ["MD", "C", "Geometric measurement: understand concepts of area and relate area to multiplication and to addition", 5, 7],
    ["MD", "D", "Geometric measurement: recognize perimeter", 8, 8],
    ["G", "A", "Reason with shapes and their attributes", 1, 2],
  ],
  4: [
    ["OA", "A", "Use the four operations with whole numbers to solve problems", 1, 3],
    ["OA", "B", "Gain familiarity with factors and multiples", 4, 4],
    ["OA", "C", "Generate and analyze patterns", 5, 5],
    ["NBT", "A", "Generalize place value understanding for multi-digit whole numbers", 1, 3],
    ["NBT", "B", "Use place value understanding and properties of operations to perform multi-digit arithmetic", 4, 6],
    ["NF", "A", "Extend understanding of fraction equivalence and ordering", 1, 2],
    ["NF", "B", "Build fractions from unit fractions", 3, 4],
    ["NF", "C", "Understand decimal notation for fractions, and compare decimal fractions", 5, 7],
    ["MD", "A", "Solve problems involving measurement and conversion of measurements", 1, 3],
    ["MD", "B", "Represent and interpret data", 4, 4],
    ["MD", "C", "Geometric measurement: understand concepts of angle and measure angles", 5, 7],
    ["G", "A", "Draw and identify lines and angles, and classify shapes by properties of their lines and angles", 1, 3],
  ],
  5: [
    ["OA", "A", "Write and interpret numerical expressions", 1, 2],
    ["OA", "B", "Analyze patterns and relationships", 3, 3],
    ["NBT", "A", "Understand the place value system", 1, 4],
    ["NBT", "B", "Perform operations with multi-digit whole numbers and with decimals to hundredths", 5, 7],
    ["NF", "A", "Use equivalent fractions as a strategy to add and subtract fractions", 1, 2],
    ["NF", "B", "Apply and extend previous understandings of multiplication and division to multiply and divide fractions", 3, 7],
    ["MD", "A", "Convert like measurement units within a given measurement system", 1, 1],
    ["MD", "B", "Represent and interpret data", 2, 2],
    ["MD", "C", "Geometric measurement: understand concepts of volume", 3, 5],
    ["G", "A", "Graph points on the coordinate plane to solve real-world and mathematical problems", 1, 2],
    ["G", "B", "Classify two-dimensional figures into categories based on their properties", 3, 4],
  ],
  6: [
    ["RP", "A", "Understand ratio concepts and use ratio reasoning to solve problems", 1, 3],
    ["NS", "A", "Apply and extend previous understandings of multiplication and division to divide fractions by fractions", 1, 1],
    ["NS", "B", "Compute fluently with multi-digit numbers and find common factors and multiples", 2, 4],
    ["NS", "C", "Apply and extend previous understandings of numbers to the system of rational numbers", 5, 8],
    ["EE", "A", "Apply and extend previous understandings of arithmetic to algebraic expressions", 1, 4],
    ["EE", "B", "Reason about and solve one-variable equations and inequalities", 5, 8],
    ["EE", "C", "Represent and analyze quantitative relationships between dependent and independent variables", 9, 9],
    ["G", "A", "Solve real-world and mathematical problems involving area, surface area, and volume", 1, 4],
    ["SP", "A", "Develop understanding of statistical variability", 1, 3],
    ["SP", "B", "Summarize and describe distributions", 4, 5],
  ],
  7: [
    ["RP", "A", "Analyze proportional relationships and use them to solve real-world and mathematical problems", 1, 3],
    ["NS", "A", "Apply and extend previous understandings of operations with fractions", 1, 3],
    ["EE", "A", "Use properties of operations to generate equivalent expressions", 1, 2],
    ["EE", "B", "Solve real-life and mathematical problems using numerical and algebraic expressions and equations", 3, 4],
    ["G", "A", "Draw, construct, and describe geometrical figures and describe the relationships between them", 1, 3],
    ["G", "B", "Solve real-life and mathematical problems involving angle measure, area, surface area, and volume", 4, 6],
    ["SP", "A", "Use random sampling to draw inferences about a population", 1, 2],
    ["SP", "B", "Draw informal comparative inferences about two populations", 3, 4],
    ["SP", "C", "Investigate chance processes and develop, use, and evaluate probability models", 5, 8],
  ],
  8: [
    ["NS", "A", "Know that there are numbers that are not rational, and approximate them by rational numbers", 1, 2],
    ["EE", "A", "Work with radicals and integer exponents", 1, 4],
    ["EE", "B", "Understand the connections between proportional relationships, lines, and linear equations", 5, 6],
    ["EE", "C", "Analyze and solve linear equations and pairs of simultaneous linear equations", 7, 8],
    ["F", "A", "Define, evaluate, and compare functions", 1, 3],
    ["F", "B", "Use functions to model relationships between quantities", 4, 5],
    ["G", "A", "Understand congruence and similarity using physical models, transparencies, or geometry software", 1, 5],
    ["G", "B", "Understand and apply the Pythagorean Theorem", 6, 8],
    ["G", "C", "Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres", 9, 9],
    ["SP", "A", "Investigate patterns of association in bivariate data", 1, 4],
  ],
};

// High school domains: key → [conceptual category letter, domain code, name]
const HS_DOMAINS = {
  "N-RN": ["N", "RN", "The Real Number System"],
  "N-Q": ["N", "Q", "Quantities"],
  "N-CN": ["N", "CN", "The Complex Number System"],
  "A-SSE": ["A", "SSE", "Seeing Structure in Expressions"],
  "A-APR": ["A", "APR", "Arithmetic with Polynomials and Rational Expressions"],
  "A-CED": ["A", "CED", "Creating Equations"],
  "A-REI": ["A", "REI", "Reasoning with Equations and Inequalities"],
  "F-IF": ["F", "IF", "Interpreting Functions"],
  "F-BF": ["F", "BF", "Building Functions"],
  "F-LE": ["F", "LE", "Linear, Quadratic, and Exponential Models"],
  "F-TF": ["F", "TF", "Trigonometric Functions"],
  "G-CO": ["G", "CO", "Congruence"],
  "G-SRT": ["G", "SRT", "Similarity, Right Triangles, and Trigonometry"],
  "G-C": ["G", "C", "Circles"],
  "G-GPE": ["G", "GPE", "Expressing Geometric Properties with Equations"],
  "G-GMD": ["G", "GMD", "Geometric Measurement and Dimension"],
  "G-MG": ["G", "MG", "Modeling with Geometry"],
  "S-ID": ["S", "ID", "Interpreting Categorical and Quantitative Data"],
  "S-IC": ["S", "IC", "Making Inferences and Justifying Conclusions"],
  "S-CP": ["S", "CP", "Conditional Probability and the Rules of Probability"],
  "S-MD": ["S", "MD", "Using Probability to Make Decisions"],
};

// The traditional pathway (CCSS Appendix A). Schools may use an integrated sequence instead.
const HS_COURSES = [
  { key: "alg1", name: "Algebra I", typicalGrade: "9", domains: ["N-RN", "N-Q", "A-SSE", "A-APR", "A-CED", "A-REI", "F-IF", "F-BF", "F-LE", "S-ID"] },
  { key: "geo", name: "Geometry", typicalGrade: "10", domains: ["G-CO", "G-SRT", "G-C", "G-GPE", "G-GMD", "G-MG", "S-CP", "S-MD"] },
  { key: "alg2", name: "Algebra II", typicalGrade: "11", domains: ["N-CN", "A-SSE", "A-APR", "A-CED", "A-REI", "F-IF", "F-BF", "F-LE", "F-TF", "S-ID", "S-IC", "S-MD"] },
];

const k8Code = (grade, domain, cluster, n) => `CCSS.MATH.CONTENT.${grade}.${domain}.${cluster}.${n}`;
const hsCode = (key) => {
  const [cat, dom] = HS_DOMAINS[key];
  return `CCSS.MATH.CONTENT.HS${cat}.${dom}`;
};

/** The national-benchmark tree for a grade: [{id, code, name, short, skills:[…]}]. */
function tree(grade) {
  if (K8[grade]) {
    const domains = [];
    for (const [d, letter, heading, a, b] of K8[grade]) {
      let dom = domains.find((x) => x.key === d);
      if (!dom) {
        dom = { id: `math|${grade}|${d}`, key: d, code: `${grade}.${d}`, name: DOMAINS[d].name, short: DOMAINS[d].short, skills: [] };
        domains.push(dom);
      }
      dom.skills.push({
        id: `math|${grade}|${d}|${letter}`,
        code: `${grade}.${d}.${letter}`,
        name: heading,
        standards: range(a, b).map((n) => k8Code(grade, d, letter, n)),
      });
    }
    return domains;
  }
  // High school: one node per course, its domains as skills.
  return HS_COURSES.map((c) => ({
    id: `math|hs|${c.key}`,
    key: c.key,
    code: c.name,
    name: `${c.name} (typically grade ${c.typicalGrade})`,
    short: c.name,
    note: "Typical traditional pathway — some schools use an integrated sequence (Math 1, 2, 3).",
    skills: c.domains.map((k) => ({
      id: `math|hs|${c.key}|${k}`,
      code: k,
      name: HS_DOMAINS[k][2],
      standards: [hsCode(k)],
    })),
  }));
}

module.exports = { tree, DOMAINS, K8, HS_DOMAINS, HS_COURSES };
