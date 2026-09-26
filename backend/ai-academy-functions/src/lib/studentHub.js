// Student Success Hub — the five live-web student tools from the Student
// Tools site (naija-digest/src/students/main.ts), for the professional app.
// The same form/prompt/run machinery serves the Business Marketing Hub
// (businessHub.js): pass its tool list to publicTools / buildRun.
// Forms and prompts live here; the app sends only the learner's answers.
// Runs go through the key-holding proxy student-agents-api (Anthropic with
// web search), authenticated as a trusted caller.

const MAX_TEXT = 200;
const MAX_DRAFT = 12000;
const MAX_BRIEF_BYTES = 5 * 1024 * 1024;
const BRIEF_TYPES = {
  pdf: "application/pdf",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

const TOOLS = [
  {
    id: "research",
    name: "Academic Study Companion",
    summary: "Plan, research, learn, improve",
    icon: "school",
    tier: "smart",
    note: "A study aid to help you learn, plan and improve — it never writes the assignment for you (that is academic misconduct and can fail you). Run each mode for depth, verify every source, and write in your own words.",
    fields: [
      { id: "topic", label: "Topic, question or module", type: "text", required: true, hint: "e.g. Features contributing to the success of contrasting businesses" },
      { id: "level", label: "Level", type: "select", options: ["GCSE", "A-Level / BTEC", "College / Sixth-form", "Undergraduate (BSc/BA)", "Masters", "PhD"] },
      { id: "style", label: "Reference style", type: "select", options: ["Harvard", "APA", "MLA", "Chicago", "IEEE", "Vancouver"] },
      { id: "mode", label: "What do you need?", type: "select", options: ["Detailed plan mapped to the brief", "Research & real sources", "Explain the key concepts", "Model example paragraph (to learn from)", "Review my draft (feedback)", "Full study pack (overview)"] },
      { id: "draft", label: "Paste your own draft (only for \"Review my draft\")", type: "textarea", hint: "Paste what you have written so far..." },
      { id: "brief", label: "Upload assessment brief (optional) — PDF, image or .txt", type: "file" },
    ],
    prompt: (f) =>
      `You are an expert academic study companion and tutor. Help the student LEARN and produce excellent work THEMSELVES - never write a finished, submittable assignment for them. Level: ${f.level}. Topic or module: ${f.topic}. Reference style: ${f.style}. Requested: ${f.mode}. If an assessment brief is attached, read it carefully and map everything to its exact tasks, learning aims and assessment or marking criteria (name each criterion). Adapt depth to the level: GCSE, A-Level and BTEC = clear and criteria-focused; Undergraduate = solid academic rigour; Masters = critical analysis and evaluation; PhD = rigorous, original-contribution framing with a systematic approach to the literature. Then, based on the requested mode: DETAILED PLAN = a thorough brief-mapped plan covering every task or section, what to cover, structure, word-count guidance and the criteria each part meets. RESEARCH AND REAL SOURCES = 6 to 10 real sources found via web search with working links, each with a note on what it gives you, plus key facts and data with citations. EXPLAIN THE KEY CONCEPTS = teach the core ideas with clear explanations and examples so the student can write knowledgeably. MODEL EXAMPLE PARAGRAPH = ONE well-written example paragraph at the right level, clearly labelled EXAMPLE - now write your own in your own words, then 3 tips. REVIEW MY DRAFT = read the student draft below and give specific constructive feedback (strengths, gaps against the brief or criteria, structure, argument, evidence, referencing) and a checklist to raise the grade - do NOT rewrite it for them. FULL STUDY PACK = a condensed version of all of the above together. Always use web search to ground sources and facts in REAL, current material - never invent sources, links, quotes or data. Provide a bibliography in ${f.style} style with working URLs. Student draft if any: ${f.draft || "(none provided)"}. End with a short academic-integrity reminder: this is a study aid; write everything in your own words; submitting AI-written work as your own is academic misconduct.`,
  },
  {
    id: "scholar",
    name: "Scholarship Finder",
    summary: "Live scholarships + links",
    icon: "workspace_premium",
    tier: "fast",
    note: "Deadlines and eligibility change — always confirm on the official site. Never pay a fee to apply; genuine scholarships do not charge one.",
    fields: [
      { id: "where", label: "Country / region / state", type: "text", required: true, hint: "e.g. Ontario, Canada  or  Lagos, Nigeria" },
      { id: "level", label: "Level of study", type: "select", options: ["Undergraduate", "Masters", "PhD", "College / Sixth-form", "Vocational"] },
      { id: "field", label: "Field of study", type: "text", required: true, hint: "e.g. Nursing, Engineering, Law" },
      { id: "who", label: "Your nationality / eligibility (optional)", type: "text", hint: "e.g. Nigerian national, first-generation student" },
      { id: "cover", label: "Coverage", type: "select", options: ["Any", "Full (fully funded)", "Partial"] },
    ],
    prompt: (f) =>
      `You are a scholarships adviser. Use web search to find CURRENT, real scholarships that match: location ${f.where}; level ${f.level}; field ${f.field}; eligibility ${f.who || "any"}; coverage ${f.cover}. Return up to 6 scholarships. For each: name; provider; what it covers (full or partial plus details); key eligibility; deadline; and the OFFICIAL application link (URL). Prefer official government, university and reputable foundation sources. Only list scholarships you actually found via search with a real link — do not invent any. End with a one-line safety note: verify details on the official site and never pay to apply.`,
  },
  {
    id: "jobs",
    name: "Student Jobs Finder",
    summary: "Local jobs, any country",
    icon: "work",
    tier: "fast",
    note: "Listings change fast — apply via official sites and beware scams (never pay for a job or share bank details early). If on a student visa, check your allowed working hours.",
    fields: [
      { id: "loc", label: "Location (country, region/state, city)", type: "text", required: true, hint: "e.g. Manchester, England  or  Austin, Texas, USA" },
      { id: "kind", label: "Type of work", type: "select", options: ["Any", "Odd jobs / gigs", "Weekend", "Vacation / seasonal", "Part-time (term-time)", "Permanent / graduate"] },
      { id: "skills", label: "Type of work or skills (optional)", type: "text", hint: "e.g. tutoring, retail, hospitality, coding" },
    ],
    prompt: (f) =>
      `You are a student jobs assistant. Use web search for CURRENT student-friendly work in: ${f.loc}. Type: ${f.kind}. Skills or interest: ${f.skills || "any"}. Return: (1) a few specific current openings if you find them (title, employer, location, link); (2) the top 3-4 best local or relevant job boards or sources to search for this location, each with a link; (3) 2-3 quick tips for a student applying. Only include real links you found via search. End with a one-line safety note about avoiding job scams.`,
  },
  {
    id: "gigs",
    name: "Social & Gigs Finder",
    summary: "Events near you, with dates",
    icon: "celebration",
    tier: "fast",
    note: "Event details change — always confirm the date, time and venue on the official link. Some events are 18+ or ticketed.",
    fields: [
      { id: "loc", label: "Location (country, region/state, city)", type: "text", required: true, hint: "e.g. Leeds, England  or  Accra, Ghana" },
      { id: "kind", label: "Type of event", type: "select", options: ["Any", "Live music / gigs", "Student socials & club nights", "Meetups & networking", "Festivals", "Free events", "Sports & fitness socials"] },
      { id: "when", label: "When", type: "select", options: ["This weekend", "This week", "This month", "Any upcoming"] },
    ],
    prompt: (f) =>
      `You are a student social-life assistant. Use web search to find CURRENT, upcoming social events and gigs relevant to students in: ${f.loc}. Type: ${f.kind}. Timeframe: ${f.when}. Return up to 6 real events. For EACH give: event name; type; DATE; START TIME; VENUE and area/city; a one-line description; and a link (official page, ticket site or listing). Prefer real listings (Eventbrite, local venues, university student unions, Meetup, ticket sites). Only include real events you actually found via search — never invent events, dates or links. End with a one-line note to confirm details on the official link.`,
  },
  {
    id: "accom",
    name: "Accommodation Finder",
    summary: "Student housing, anywhere",
    icon: "home",
    tier: "fast",
    note: "Prices and availability change — confirm on the official link. Beware rental scams: never pay a deposit before viewing or verifying the landlord or platform.",
    fields: [
      { id: "loc", label: "Where? (country, state/region, town/city)", type: "text", required: true, hint: "e.g. Coventry, England  or  Kumasi, Ghana" },
      { id: "type", label: "Type of accommodation", type: "select", options: ["Any", "University halls", "Private student halls", "Shared house / flat", "Studio", "Room in a family home (homestay)", "Short-term / temporary"] },
      { id: "budget", label: "Budget per month (optional)", type: "text", hint: "e.g. £600, or $500" },
      { id: "when", label: "Move-in / term (optional)", type: "text", hint: "e.g. September 2026" },
    ],
    prompt: (f) =>
      `You are a student accommodation assistant. Use web search to find CURRENT student housing options in: ${f.loc}. Type: ${f.type}. Budget: ${f.budget || "any"}. Move-in: ${f.when || "flexible"}. Return up to 6 real options. For EACH give: name or provider; type; area and rough distance to universities; approximate rent and whether bills are included; a key feature or two; and a link (official provider, university accommodation page or reputable listing site). Prefer reputable sources (university accommodation offices, Unite Students, student.com, local letting agents, established listing sites). Only include real options you found via search — never invent listings, prices or links. End with a one-line safety note about avoiding rental scams (never pay before viewing or verifying).`,
  },
];

// Same instruction the web page adds so every result carries real URLs.
const LINKS_RULE =
  "\n\nLINKS: give every source, scholarship, listing or event a real, working URL written out in full (https://…), either on its own or as [short label](https://…). Never refer to a link without including its address.";

/** Tool definitions for the app's forms (no prompts). */
function publicTools(tools = TOOLS) {
  return tools.map(({ prompt, tier, web, ...t }) => t);
}

const oneLine = (s) => String(s ?? "").replace(/[\r\n]+/g, " ").replace(/\s+/g, " ").trim();

/** An uploaded brief → a message content block, or { error }. */
function briefBlock(brief) {
  if (!brief) return {};
  const ext = String(brief.name || "").toLowerCase().split(".").pop();
  const data = String(brief.data || "");
  if (!/^[A-Za-z0-9+/=]+$/.test(data)) return { error: "The brief could not be read." };
  if ((data.length * 3) / 4 > MAX_BRIEF_BYTES) return { error: "The brief is too large (5 MB max)." };
  if (ext === "txt") {
    const text = Buffer.from(data, "base64").toString("utf8").slice(0, 60000);
    return { block: { type: "text", text: "ASSESSMENT BRIEF (uploaded): " + text } };
  }
  const mediaType = BRIEF_TYPES[ext];
  if (!mediaType) return { error: "Upload a PDF, image or .txt brief." };
  return {
    block: {
      type: ext === "pdf" ? "document" : "image",
      source: { type: "base64", media_type: mediaType, data },
    },
  };
}

/**
 * Validates the learner's answers and builds the proxy request.
 * @returns { request: {tier, web, messages} } or { error }
 */
function buildRun(toolId, answers = {}, brief = null, tools = TOOLS) {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return { error: "Unknown tool." };
  const f = {};
  for (const field of tool.fields) {
    if (field.type === "file") continue;
    const raw = answers[field.id];
    if (field.type === "select") {
      f[field.id] = field.options.includes(raw) ? raw : field.options[0];
    } else if (field.type === "textarea") {
      f[field.id] = String(raw ?? "").slice(0, MAX_DRAFT).trim();
    } else {
      f[field.id] = oneLine(raw).slice(0, MAX_TEXT);
    }
    if (field.required && !f[field.id]) return { error: `Please fill in "${field.label}".` };
  }

  const web = tool.web !== false;
  const prompt = tool.prompt(f) + (web ? LINKS_RULE : "");
  let content = prompt;
  if (tool.fields.some((x) => x.type === "file") && brief) {
    const { block, error } = briefBlock(brief);
    if (error) return { error };
    if (block) content = [block, { type: "text", text: prompt }];
  }
  return { request: { tier: tool.tier, web, messages: [{ role: "user", content }] } };
}

module.exports = { TOOLS, publicTools, buildRun, briefBlock };
