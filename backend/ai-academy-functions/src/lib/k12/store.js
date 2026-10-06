// Storage for the US K–12 tutor (Azure Tables):
//   K12Learners   PK userId, RK learnerId — learner profiles under a parent's
//                 account (nickname, grade, state only; children don't need
//                 their own accounts)
//   K12Skills     PK userId~learnerId, RK skillId — progress per skill
//   K12Activity   PK userId~learnerId, RK newest-first — sessions and quizzes
//   K12MicroSkills PK "v1", RK sha1(skillId) — shared micro-skill cache
const crypto = require("crypto");
const { TableClient, odata } = require("@azure/data-tables");
const { LEARNER_GRADES } = require("./frameworks");
const { STATES } = require("./states");
const { STAGES } = require("./cambridge");
const { allSkills } = require("./tree");
const { oneLine } = require("./tutor");

const MAX_LEARNERS = 6;
const MASTERED = 0.8;
const STRUGGLING = 0.6;
const DAY = 24 * 60 * 60 * 1000;

const clients = {};
function table(name) {
  if (!clients[name]) {
    clients[name] = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, name);
    clients[name].ready = clients[name].createTable().catch(() => {});
  }
  return clients[name].ready.then(() => clients[name]);
}

async function list(name, filter) {
  const t = await table(name);
  const rows = [];
  for await (const e of t.listEntities({ queryOptions: { filter } })) rows.push(e);
  return rows;
}

async function getRow(name, pk, rk) {
  try {
    return await (await table(name)).getEntity(pk, rk);
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

const learnerKey = (userId, learnerId) => `${userId}~${learnerId}`;

// ---- Learners -----------------------------------------------------------

function cleanLearner(body = {}, { isNew = true } = {}) {
  const nickname = oneLine(body.nickname).slice(0, 24);
  if (!nickname) return { error: "Enter a first name or nickname." };
  if (/@|\d{5,}/.test(nickname)) return { error: "Use a first name or nickname only — no email or phone numbers." };
  if (isNew && body.ageConfirmed !== true) return { error: "AI Academy is for learners aged 13 and over." };
  if (body.curriculum === "cambridge") {
    if (!STAGES[body.stage]) return { error: "Choose a Cambridge stage." };
    return { learner: { nickname, curriculum: "cambridge", stage: body.stage, grade: "", state: "" } };
  }
  if (!LEARNER_GRADES.includes(String(body.grade))) return { error: "Choose a grade level (8–12)." };
  if (!STATES[body.state]) return { error: "Choose a state." };
  return { learner: { nickname, curriculum: "us", stage: "", grade: String(body.grade), state: body.state } };
}

const publicLearner = (e) => ({
  learnerId: e.rowKey,
  nickname: e.nickname,
  curriculum: e.curriculum || "us",
  grade: e.grade || "",
  state: e.state || "",
  stage: e.stage || "",
  createdAt: e.createdAt,
});

/** The tree context for a learner and subject. */
const contextFor = (learner, subject) =>
  learner.curriculum === "cambridge"
    ? { curriculum: "cambridge", stage: learner.stage, subject }
    : { curriculum: "us", state: learner.state, grade: learner.grade, subject };

async function listLearners(userId) {
  const rows = await list("K12Learners", odata`PartitionKey eq ${userId}`);
  return rows.map(publicLearner).sort((a, b) => String(a.createdAt).localeCompare(String(b.createdAt)));
}

async function getLearner(userId, learnerId) {
  if (typeof learnerId !== "string" || !/^[a-z0-9]{6,20}$/.test(learnerId)) return null;
  const e = await getRow("K12Learners", userId, learnerId);
  return e ? publicLearner(e) : null;
}

async function saveLearner(userId, body) {
  const { learner, error } = cleanLearner(body, { isNew: !body.learnerId });
  if (error) return { error };
  const t = await table("K12Learners");
  let learnerId = body.learnerId;
  if (learnerId) {
    const existing = await getLearner(userId, learnerId);
    if (!existing) return { error: "Learner not found." };
    await t.upsertEntity({ partitionKey: userId, rowKey: learnerId, ...learner, createdAt: existing.createdAt }, "Merge");
  } else {
    if ((await listLearners(userId)).length >= MAX_LEARNERS) return { error: `You can add up to ${MAX_LEARNERS} learners.` };
    learnerId = crypto.randomBytes(6).toString("hex");
    await t.createEntity({ partitionKey: userId, rowKey: learnerId, ...learner, createdAt: new Date().toISOString() });
  }
  return { learner: await getLearner(userId, learnerId) };
}

async function deleteLearner(userId, learnerId) {
  const learner = await getLearner(userId, learnerId);
  if (!learner) return false;
  const pk = learnerKey(userId, learnerId);
  for (const name of ["K12Skills", "K12Activity"]) {
    const t = await table(name);
    for (const e of await list(name, odata`PartitionKey eq ${pk}`)) await t.deleteEntity(e.partitionKey, e.rowKey);
  }
  await (await table("K12Learners")).deleteEntity(userId, learnerId);
  return true;
}

/** Everything stored for an account — used when the account is deleted. */
async function deleteAllForUser(userId) {
  for (const l of await listLearners(userId)) await deleteLearner(userId, l.learnerId);
}

// ---- Progress -----------------------------------------------------------

function statusFor(row) {
  if (row.lastPct != null && row.lastPct >= MASTERED && row.lastTier !== "support") return "mastered";
  if ((row.lastPct != null && row.lastPct < STRUGGLING) || row.openStruggles > 0) return "struggling";
  return "practising";
}

/**
 * Records one event for a learner.
 * kind: "learn" (a tutoring session started), "quiz" (score/total), "stuck"
 */
async function record(userId, learner, { kind, skill, domain, subject, tier, style, score, total, micro }) {
  const pk = learnerKey(userId, learner.learnerId);
  const now = new Date().toISOString();
  const prev = (await getRow("K12Skills", pk, skill.id)) || {};
  const row = {
    partitionKey: pk,
    rowKey: skill.id,
    subject,
    grade: learner.curriculum === "cambridge" ? learner.stage : learner.grade,
    skillName: skill.name,
    domain: domain.short || domain.name,
    code: skill.code,
    sessions: (prev.sessions || 0) + (kind === "learn" ? 1 : 0),
    quizzes: (prev.quizzes || 0) + (kind === "quiz" ? 1 : 0),
    openStruggles: prev.openStruggles || 0,
    lastPct: prev.lastPct ?? null,
    bestPct: prev.bestPct ?? null,
    lastTier: prev.lastTier || tier,
    lastStudied: now,
  };
  if (kind === "quiz") {
    const pct = total > 0 ? Math.max(0, Math.min(1, score / total)) : 0;
    row.lastPct = pct;
    row.bestPct = Math.max(prev.bestPct ?? 0, pct);
    row.lastTier = tier;
    row.openStruggles = pct >= MASTERED ? 0 : row.openStruggles + (pct < STRUGGLING ? 1 : 0);
  }
  if (kind === "stuck") row.openStruggles += 1;
  row.status = statusFor(row);
  if (row.lastPct == null) delete row.lastPct;
  if (row.bestPct == null) delete row.bestPct;
  await (await table("K12Skills")).upsertEntity(row, "Replace");

  const rk = `${String(9e15 - Date.now()).padStart(16, "0")}-${crypto.randomBytes(3).toString("hex")}`;
  const entry = { partitionKey: pk, rowKey: rk, kind, skillId: skill.id, skillName: skill.name, subject, tier, style: style || "", micro: micro || "", at: now };
  if (kind === "quiz") Object.assign(entry, { score, total });
  await (await table("K12Activity")).createEntity(entry);
  return row.status;
}

const skillView = (r) => ({
  skillId: r.rowKey,
  name: r.skillName,
  domain: r.domain,
  code: r.code,
  subject: r.subject,
  status: r.status,
  sessions: r.sessions || 0,
  quizzes: r.quizzes || 0,
  lastPct: r.lastPct ?? null,
  lastStudied: r.lastStudied,
});

/** Progress per skill for one learner: { skillId → {status, lastPct, …} } */
async function skillProgress(userId, learnerId) {
  const rows = await list("K12Skills", odata`PartitionKey eq ${learnerKey(userId, learnerId)}`);
  return Object.fromEntries(rows.map((r) => [r.rowKey, skillView(r)]));
}

/** The parent dashboard for one learner. */
async function dashboard(userId, learner) {
  const pk = learnerKey(userId, learner.learnerId);
  const skills = (await list("K12Skills", odata`PartitionKey eq ${pk}`)).map(skillView);
  const since = new Date(Date.now() - 7 * DAY).toISOString();
  const activity = (await list("K12Activity", odata`PartitionKey eq ${pk}`)).sort((a, b) => a.rowKey.localeCompare(b.rowKey));
  const week = activity.filter((a) => a.at >= since);
  const weekQuizzes = week.filter((a) => a.kind === "quiz" && a.total > 0);

  const struggling = skills.filter((s) => s.status === "struggling");
  const recommendations = struggling.map((s) => ({
    skillId: s.skillId, subject: s.subject, name: s.name, domain: s.domain,
    reason: "Found this hard — review it on the Catch-up level, then retry the quiz.",
  }));
  for (const s of skills.filter((x) => x.status === "practising" && x.lastPct != null)) {
    recommendations.push({ skillId: s.skillId, subject: s.subject, name: s.name, domain: s.domain, reason: "Nearly there — one more practice quiz to master it." });
  }
  // The next skill in each subject the learner has started.
  for (const subject of [...new Set(skills.map((s) => s.subject))]) {
    const order = allSkills(contextFor(learner, subject));
    const studied = new Set(skills.filter((s) => s.subject === subject).map((s) => s.skillId));
    const lastIdx = Math.max(-1, ...order.map((s, i) => (studied.has(s.id) ? i : -1)));
    const next = order.slice(lastIdx + 1).find((s) => !studied.has(s.id));
    if (next) recommendations.push({ skillId: next.id, subject, name: next.name, domain: next.domain, reason: "Next skill in the skill tree." });
  }

  const subjects = {};
  for (const s of skills) {
    subjects[s.subject] ||= { studied: 0, mastered: 0, struggling: 0 };
    subjects[s.subject].studied += 1;
    if (s.status === "mastered") subjects[s.subject].mastered += 1;
    if (s.status === "struggling") subjects[s.subject].struggling += 1;
  }

  return {
    learner,
    week: {
      sessions: week.filter((a) => a.kind === "learn").length,
      quizzes: weekQuizzes.length,
      averagePct: weekQuizzes.length ? weekQuizzes.reduce((n, a) => n + a.score / a.total, 0) / weekQuizzes.length : null,
      skills: [...new Map(week.map((a) => [a.skillId, { skillId: a.skillId, name: a.skillName, subject: a.subject }])).values()],
    },
    subjects,
    mastered: skills.filter((s) => s.status === "mastered"),
    struggling,
    recommendations: recommendations.slice(0, 6),
    recent: activity.slice(0, 12).map((a) => ({
      kind: a.kind, skillId: a.skillId, name: a.skillName, subject: a.subject, tier: a.tier,
      score: a.score ?? null, total: a.total ?? null, at: a.at,
    })),
  };
}

// ---- Micro-skill cache ---------------------------------------------------

const microKey = (skillId) => crypto.createHash("sha1").update(skillId).digest("hex");

async function cachedMicroSkills(skillId) {
  const e = await getRow("K12MicroSkills", "v1", microKey(skillId));
  try {
    return e ? JSON.parse(e.json) : null;
  } catch {
    return null;
  }
}

async function cacheMicroSkills(skillId, micro) {
  await (await table("K12MicroSkills")).upsertEntity({ partitionKey: "v1", rowKey: microKey(skillId), skillId, json: JSON.stringify(micro) }, "Replace");
}

module.exports = {
  MAX_LEARNERS,
  cleanLearner,
  contextFor,
  statusFor,
  listLearners,
  getLearner,
  saveLearner,
  deleteLearner,
  deleteAllForUser,
  record,
  skillProgress,
  dashboard,
  cachedMicroSkills,
  cacheMicroSkills,
};
