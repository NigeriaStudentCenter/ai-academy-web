// Cambridge International (the Cambridge Pathway), for learners aged 13+:
//   Lower Secondary Stage 9 → Upper Secondary (IGCSE) → Advanced (AS & A Level).
// Syllabi, topics, sub-topics, AS/A Level splits, papers and each syllabus's
// command words come from Cambridge's published syllabus documents
// (cambridge-syllabi.json, built by tools/cambridge/build.py).
const SYLLABI = require("./cambridge-syllabi.json");

// The learning statements under each sub-topic (Cambridge's syllabus text) are
// kept out of the public repo, in blob storage: course-catalog/k12/cambridge-content.json
// (built by tools/cambridge/statements.py). Loaded once and refreshed every 6 hours.
const CONTENT_BLOB = { container: "course-catalog", name: "k12/cambridge-content.json" };
let contentCache = null;
let contentLoadedAt = 0;

async function loadContent() {
  if (contentCache && Date.now() - contentLoadedAt < 6 * 3600 * 1000) return contentCache;
  try {
    const { BlobServiceClient } = require("@azure/storage-blob");
    const blob = BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage)
      .getContainerClient(CONTENT_BLOB.container)
      .getBlobClient(CONTENT_BLOB.name);
    contentCache = JSON.parse((await blob.downloadToBuffer()).toString("utf8"));
    contentLoadedAt = Date.now();
  } catch {
    contentCache = contentCache || {}; // teach from the headings alone if the file can't be read
  }
  return contentCache;
}

/**
 * The syllabus learning statements for a skill at the learner's tier, as text
 * for the prompt — or "" when none are available.
 */
function statementsText(content, code, skill, tier) {
  const [, , topic, sub] = skill.id.split("|");
  const block = content?.[code]?.[sub === "T" ? `T${topic}` : sub];
  if (!block) return "";
  const cap = (t) => String(t || "").slice(0, 3500);
  if (block.core !== undefined || block.supplement !== undefined || block.extended !== undefined) {
    const core = block.core ? `Core:\n${cap(block.core)}` : "";
    const more = block.supplement ? `Supplement (Extended only):\n${cap(block.supplement)}` : block.extended ? `Extended:\n${cap(block.extended)}` : "";
    if (tier === "core") return core || "";
    return code === "0580" ? more || core : [core, more].filter(Boolean).join("\n");
  }
  return cap(block.text);
}

const STAGES = {
  lower: {
    label: "Cambridge Lower Secondary",
    detail: "Stage 9 · ages 13–14 · Year 9",
    exit: "Cambridge Lower Secondary Checkpoint",
  },
  igcse: {
    label: "Cambridge Upper Secondary (IGCSE)",
    detail: "Ages 14–16 · Years 10–11",
    exit: "Cambridge IGCSE",
  },
  alevel: {
    label: "Cambridge Advanced (AS & A Level)",
    detail: "Ages 16–19 · Years 12–13",
    exit: "Cambridge International AS & A Levels",
  },
};

/** Assessment tiers for tiered IGCSE syllabi. */
const TIERS = {
  core: {
    label: "Core",
    detail: "Core papers · grades C–G",
    prompt: "Core tier: teach the Core subject content only. Questions match Core papers (grades C–G); do not use Supplement (Extended-only) content.",
  },
  extended: {
    label: "Extended",
    detail: "Core + Supplement · grades A*–G",
    prompt: "Extended tier: teach the Core and Supplement content. Questions match Extended papers (grades A*–G), including Supplement-only ideas and harder multi-step questions.",
  },
};

/** Science syllabi with a practical paper (Alternative to Practical / A Level practical skills). */
const SCIENCES = ["0625", "0620", "0610", "9702", "9701", "9700"];

/** How the Cambridge tutor teaches — the learner picks one. */
const STYLES = {
  examprep: {
    label: "Explanation + exam-style question",
    prompt:
      "Teach the idea clearly and concisely, then set ONE exam-style question in the Cambridge format — a command word from the syllabus list, and the marks in square brackets, e.g. [3]. Wait for the learner's answer, then mark it against mark-scheme points (one mark per creditworthy point), saying which points earned marks and which keywords were missing.",
  },
  commandwords: {
    label: "Command word decoder",
    prompt:
      "Teach this content through the syllabus command words. Show how an answer changes with the command word (e.g. State vs Describe vs Explain for this topic) using the exact meaning of each word from the syllabus list. Then give the learner a command word and a question to answer, and check their answer does what that command word asks.",
  },
  markscheme: {
    label: "Mark-scheme answers",
    prompt:
      "Teach the way examiners mark. For each key idea, show the creditworthy points a mark scheme would accept, with the essential keywords in **bold** (e.g. '1 mark: particles gain kinetic energy; 1 mark: collide with the walls more often'). Point out common answers that would NOT get the mark. Then ask the learner to write a mark-worthy answer to one question.",
  },
  practical: {
    label: "Virtual lab (Alternative to Practical)",
    prompt:
      "Run a virtual experiment for this content in the style of the practical paper. Step by step: the aim; the apparatus (describe a labelled diagram in words); the method; the independent, dependent and controlled variables; safety. Then 'run' it: give a realistic results table (sensible units, correct significant figures, one anomalous reading). Ask the learner — one task at a time — to describe the trend, spot the anomaly, do a calculation, or suggest a source of error and an improvement. Data must be physically/chemically/biologically realistic.",
    sciencesOnly: true,
  },
  socratic: {
    label: "Ask me questions",
    prompt:
      "Be Socratic: teach one small step, then ask ONE question and stop. If the learner is stuck give one hint, not the answer. When they are right, ask them to explain why using syllabus terms.",
  },
};

const hasPractical = (s) => SCIENCES.includes(s.code) || !!s.practical;

/** Syllabi for a stage: the most popular first (in popularity order), then A–Z. */
function subjectsFor(stage) {
  return Object.values(SYLLABI)
    .filter((s) => s.stage === stage)
    .sort((a, b) => (a.popular ?? 999) - (b.popular ?? 999) || a.name.localeCompare(b.name))
    .map((s) => ({
      code: s.code,
      name: s.name,
      qualification: s.qualification,
      years: s.years,
      tiered: s.tiered,
      practical: hasPractical(s),
      popular: s.popular !== undefined,
    }));
}

function syllabus(stage, code) {
  const s = SYLLABI[code];
  return s && s.stage === stage ? s : null;
}

const qualificationFor = (s, level) =>
  s.stage === "lower" ? "Cambridge Lower Secondary" : s.stage === "igcse" ? "Cambridge IGCSE" : level === "A2" ? "Cambridge International A Level" : "Cambridge International AS Level";

/** The skill tree for one syllabus: topics → sub-topics (or the topic itself). */
function tree(stage, code) {
  const s = syllabus(stage, code);
  return s.topics.map((t) => {
    const qual = qualificationFor(s, t.level);
    const tag = (ref) => `${qual} ${s.name} (${code}) ${ref}`;
    const skills = t.subtopics.length
      ? t.subtopics.map((u) => ({
          id: `cam|${code}|${t.n}|${u.n}`,
          code: `${code} ${u.n}`,
          name: u.title,
          standards: [tag(u.n)],
          ...(u.core !== undefined ? { tiers: { core: u.core, extended: u.extended } } : {}),
        }))
      : [
          {
            id: `cam|${code}|${t.n}|T`,
            code: s.stage === "lower" ? `${code} Stage 9` : `${code} Topic ${t.n}`,
            name: t.name,
            standards: [s.stage === "lower" ? `${qual} ${s.name} (${code}) Stage 9 · ${t.name}` : tag(`Topic ${t.n}`)],
          },
        ];
    return {
      id: `cam|${code}|${t.n}`,
      key: t.n,
      code: s.stage === "lower" ? t.name : `${code} · ${t.n}`,
      name: t.name,
      short: t.name,
      level: t.level || undefined,
      note: t.level === "A2" ? "A Level (second year) content" : t.level === "AS" ? "AS Level content" : undefined,
      skills,
    };
  });
}

function treeMeta(stage, code) {
  const s = syllabus(stage, code);
  const st = STAGES[stage];
  return {
    curriculum: "cambridge",
    stage,
    stageLabel: st.label,
    gradeLabel: `${st.label} — ${st.detail}`,
    subject: code,
    subjectLabel: `${s.name} (${code})`,
    benchmark: `${s.qualification} ${s.name} (${code})`,
    stateFramework: s.years ? `${s.qualification} ${s.name} ${code} — syllabus for examination in ${s.years}` : `${s.qualification} ${s.name} ${code} curriculum framework`,
    family: "cambridge",
    alignmentNote: s.years
      ? `Topics and numbering follow the Cambridge syllabus ${code} for examination in ${s.years}. ${s.tiered ? "Choose Core or Extended to match your exam entry." : ""}${s.stage === "alevel" ? " Topics are marked AS Level or A Level (second year)." : ""}`.trim()
      : `Strands follow the Cambridge Lower Secondary ${s.name} curriculum framework (${code}) for Stage 9, assessed by ${st.exit}.`,
    syllabus: {
      code,
      name: s.name,
      qualification: s.qualification,
      years: s.years,
      tiered: s.tiered,
      papers: s.papers,
      practical: s.practical,
      hasPractical: hasPractical(s),
      commandWords: s.commandWords,
    },
  };
}

module.exports = { loadContent, statementsText, SYLLABI, STAGES, TIERS, STYLES, SCIENCES, subjectsFor, syllabus, tree, treeMeta };
