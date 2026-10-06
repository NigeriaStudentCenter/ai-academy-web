const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { askFoundry } = require("../lib/foundry");
const access = require("../lib/access");
const { LEARNER_GRADES, gradeLabel, SUBJECTS, STYLES, TIERS, DOK } = require("../lib/k12/frameworks");
const cambridge = require("../lib/k12/cambridge");
const { STATES } = require("../lib/k12/states");
const { validateContext, buildTree, findSkill } = require("../lib/k12/tree");
const tutor = require("../lib/k12/tutor");
const store = require("../lib/k12/store");

// K–12 tutor for learners aged 13+: US (CCSS / NGSS / C3 skill trees with a
// state overlay, grades 8–12) and Cambridge International (Lower Secondary
// Stage 9, IGCSE, AS & A Level syllabi). Learner profiles, tutoring, quizzes,
// worksheets, Cambridge exam-style questions with mark schemes, and a parent
// dashboard.
//
// GET  ?op=meta                         grades, subjects, states, styles, tiers
// GET  ?op=learners                     the account's learner profiles
// GET  ?op=tree&learnerId=&subject=     skill tree + the learner's progress
// GET  ?op=dashboard&learnerId=         parent dashboard for one learner
// POST {op:"saveLearner"|"deleteLearner"|"microskills"|"learn"|"quiz"|
//       "quizResult"|"stuck"|"insights"|"exam"|"markAnswer", …}

const bad = (error, status = 400) => ({ status, jsonBody: { error } });
const AI_OPS = ["microskills", "learn", "quiz", "insights", "exam", "markAnswer"];

async function readBody(request) {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

function meta() {
  return {
    grades: LEARNER_GRADES.map((id) => ({ id, label: gradeLabel(id) })),
    subjects: Object.entries(SUBJECTS).map(([id, s]) => ({ id, label: s.label, framework: s.framework, short: s.short })),
    states: Object.entries(STATES).map(([code, name]) => ({ code, name })).sort((a, b) => a.name.localeCompare(b.name)),
    styles: Object.entries(STYLES).map(([id, s]) => ({ id, label: s.label })),
    tiers: Object.entries(TIERS).map(([id, t]) => ({ id, label: t.label, detail: t.detail, dok: t.dok })),
    dok: DOK,
    cambridge: {
      stages: Object.entries(cambridge.STAGES).map(([id, st]) => ({ id, ...st })),
      subjects: Object.fromEntries(Object.keys(cambridge.STAGES).map((id) => [id, cambridge.subjectsFor(id)])),
      styles: Object.entries(cambridge.STYLES).map(([id, st]) => ({ id, label: st.label, sciencesOnly: !!st.sciencesOnly })),
      tiers: Object.entries(cambridge.TIERS).map(([id, t]) => ({ id, label: t.label, detail: t.detail })),
    },
  };
}

/** The learner, the skill and its tree for a request, or an error response. */
async function lessonFor(user, body) {
  const learner = await store.getLearner(user.userId, body.learnerId);
  if (!learner) return { error: bad("Learner not found.", 404) };
  const { ctx, error } = validateContext(store.contextFor(learner, body.subject));
  if (error) return { error: bad(error) };
  const found = findSkill(ctx, body.skillId);
  if (!found) return { error: bad("Skill not found.", 404) };
  const cam = ctx.curriculum === "cambridge";
  const style = (cam ? cambridge.STYLES : STYLES)[body.style] ? body.style : "socratic";
  const tier = cam ? (cambridge.TIERS[body.tier] ? body.tier : "extended") : TIERS[body.tier] ? body.tier : "core";
  const micro = tutor.oneLine(body.micro).slice(0, 80) || "";
  if (cam) {
    // Extended-only content can't be studied at Core tier.
    const tierUsed = found.skill.tiers && !found.skill.tiers.core ? "extended" : tier;
    const text = cambridge.statementsText(await cambridge.loadContent(), ctx.subject, found.skill, tierUsed);
    const skill = text ? { ...found.skill, syllabusStatements: text } : found.skill;
    return { learner, ctx, ...found, skill, style, tier: tierUsed, micro };
  }
  return { learner, ctx, ...found, style, tier, micro };
}

app.http("k12", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (request.method === "GET") {
      const op = request.query.get("op") || "meta";
      if (op === "meta") return { status: 200, jsonBody: meta() };
      if (op === "learners") return { status: 200, jsonBody: { learners: await store.listLearners(user.userId) } };
      const learner = await store.getLearner(user.userId, request.query.get("learnerId"));
      if (!learner) return bad("Learner not found.", 404);
      if (op === "tree") {
        const { ctx, error } = validateContext(store.contextFor(learner, request.query.get("subject")));
        if (error) return bad(error);
        return { status: 200, jsonBody: { tree: buildTree(ctx), progress: await store.skillProgress(user.userId, learner.learnerId) } };
      }
      if (op === "dashboard") return { status: 200, jsonBody: await store.dashboard(user.userId, learner) };
      return bad("Unknown request.");
    }

    const body = await readBody(request);
    const op = body.op;
    if (AI_OPS.includes(op) && !(await access.accessFor(user)).full) return access.SUBSCRIPTION_REQUIRED;

    if (op === "saveLearner") {
      const { learner, error } = await store.saveLearner(user.userId, body);
      return error ? bad(error) : { status: 200, jsonBody: { learner } };
    }
    if (op === "deleteLearner") {
      return (await store.deleteLearner(user.userId, body.learnerId)) ? { status: 200, jsonBody: { deleted: true } } : bad("Learner not found.", 404);
    }

    if (op === "insights") {
      const learner = await store.getLearner(user.userId, body.learnerId);
      if (!learner) return bad("Learner not found.", 404);
      const d = await store.dashboard(user.userId, learner);
      if (!d.recent.length) return { status: 200, jsonBody: { text: "" } };
      const summary = {
        level: learner.curriculum === "cambridge" ? cambridge.STAGES[learner.stage]?.label : `${gradeLabel(learner.grade)}, ${STATES[learner.state]}`,
        week: d.week,
        mastered: d.mastered.map((s) => `${s.subject}: ${s.name}`),
        struggling: d.struggling.map((s) => `${s.subject}: ${s.name}`),
        next: d.recommendations.map((r) => `${r.subject}: ${r.name} — ${r.reason}`),
      };
      try {
        return { status: 200, jsonBody: { text: (await askFoundry([{ role: "user", content: tutor.insightsPrompt(summary) }])).trim() } };
      } catch (err) {
        context.error("k12 insights failed", err);
        return bad("Insights are unavailable right now. Please try again.", 502);
      }
    }

    const lesson = await lessonFor(user, body);
    if (lesson.error) return lesson.error;
    const { learner, tree, domain, skill, style, tier, micro, ctx } = lesson;
    const event = { skill, domain, subject: ctx.subject, tier, style, micro };
    const cam = ctx.curriculum === "cambridge";

    try {
      if (op === "microskills") {
        let micros = await store.cachedMicroSkills(skill.id);
        if (!micros) {
          micros = tutor.parseMicroSkills(await askFoundry([{ role: "user", content: tutor.microSkillsPrompt(tree, domain, skill) }]), skill);
          if (micros.length) await store.cacheMicroSkills(skill.id, micros);
        }
        return { status: 200, jsonBody: { microSkills: micros } };
      }
      if (op === "learn") {
        const convo = tutor.learnInput({ tree, domain, skill, micro, style, tier }, body.turns);
        if (convo.error) return bad(convo.error);
        const reply = tutor.splitStandards(await askFoundry(convo.input), skill);
        if (!Array.isArray(body.turns) || body.turns.length === 0) await store.record(user.userId, learner, { kind: "learn", ...event });
        return { status: 200, jsonBody: reply };
      }
      if (op === "quiz") {
        const worksheet = body.worksheet === true;
        const count = worksheet ? 10 : 5;
        // Generate, have the answer key checked independently, keep what agrees.
        let questions = [];
        for (let attempt = 0; attempt < 2 && questions.length < count; attempt++) {
          const raw = await askFoundry([{ role: "user", content: tutor.quizPrompt({ tree, domain, skill, micro, tier, count, worksheet }) }]);
          const draft = tutor.parseQuiz(raw, skill, tier, worksheet, tree, domain);
          if (!draft.length) continue;
          const checked = tutor.applyVerification(draft, await askFoundry([{ role: "user", content: tutor.verifyPrompt(draft, tree) }]));
          questions = tutor.mergeQuestions(questions, checked, count);
        }
        if (questions.length < Math.min(3, count)) return bad("Could not write the questions. Please try again.", 502);
        return {
          status: 200,
          jsonBody: {
            questions,
            skill: { id: skill.id, name: skill.name, code: skill.code, domain: domain.short || domain.name },
            heading: {
              grade: tree.gradeLabel,
              state: tree.state?.name || "Cambridge International",
              subject: tree.subjectLabel,
              tier: tutor.tierFor(tree, tier, domain).label,
              stateFramework: tree.stateFramework,
            },
          },
        };
      }
      if (op === "exam") {
        if (!cam) return bad("Exam-style questions are part of the Cambridge curriculum.");
        // Write, have an independent examiner check it, try once more if rejected.
        for (let attempt = 0; attempt < 2; attempt++) {
          const exam = tutor.parseExam(await askFoundry([{ role: "user", content: tutor.examPrompt({ tree, domain, skill, micro, tier }) }]), tree);
          if (!exam) continue;
          // Numeric answers: a blind solve must reach the same number. Otherwise: examiner check.
          const agrees = tutor.numericAgreement(await askFoundry([{ role: "user", content: tutor.examSolvePrompt(exam, tree) }]), exam);
          if (agrees === false) continue;
          if (agrees === true || tutor.examVerified(await askFoundry([{ role: "user", content: tutor.examVerifyPrompt(exam, tree) }]))) {
            return { status: 200, jsonBody: { exam, reference: skill.standards[0] } };
          }
        }
        return bad("Could not write a checked question. Please try again.", 502);
      }
      if (op === "markAnswer") {
        if (!cam) return bad("Mark-scheme marking is part of the Cambridge curriculum.");
        const exam = tutor.cleanExam(body.exam, tree);
        const answer = String(body.answer || "").trim().slice(0, 3000);
        if (!exam) return bad("Invalid question.");
        if (answer.length < 2) return bad("Write your answer first.");
        const result = tutor.parseMark(await askFoundry([{ role: "user", content: tutor.markPrompt(tree, exam, answer) }]), exam);
        const status = await store.record(user.userId, learner, { kind: "quiz", ...event, score: result.score, total: result.total });
        return { status: 200, jsonBody: { ...result, status } };
      }
      if (op === "quizResult") {
        const total = Number(body.total);
        const score = Number(body.score);
        if (!Number.isInteger(total) || total < 1 || total > 20 || !Number.isInteger(score) || score < 0 || score > total) return bad("Invalid score.");
        const status = await store.record(user.userId, learner, { kind: "quiz", ...event, score, total });
        return { status: 200, jsonBody: { status } };
      }
      if (op === "stuck") {
        return { status: 200, jsonBody: { status: await store.record(user.userId, learner, { kind: "stuck", ...event }) } };
      }
    } catch (err) {
      context.error(`k12 ${op} failed`, err);
      return bad("The tutor is unavailable. Please try again.", 502);
    }
    return bad("Unknown request.");
  }),
});
