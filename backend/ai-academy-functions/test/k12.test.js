const test = require("node:test");
const assert = require("node:assert");
const { GRADES, SUBJECTS } = require("../src/lib/k12/frameworks");
const { STATES, frameworkFor } = require("../src/lib/k12/states");
const { buildTree, findSkill, validateContext } = require("../src/lib/k12/tree");
const tutor = require("../src/lib/k12/tutor");
const { cleanLearner, statusFor } = require("../src/lib/k12/store");

const CODE = {
  math: /^(CCSS\.MATH\.CONTENT\.([K1-8])\.(CC|OA|NBT|NF|MD|G|RP|NS|EE|F|SP)\.[A-D]\.\d+|CCSS\.MATH\.CONTENT\.HS[NAFGS]\.[A-Z]+|TEKS Mathematics, Grade [K1-8]: Personal Financial Literacy)$/,
  ela: /^CCSS\.ELA-LITERACY\.(RL|RI|RF|W|SL|L)\.(K|[1-8]|9-10|11-12)\.\d$/,
  science: /^NGSS (K|[1-5]|MS|HS|K-2|3-5)-(PS[1-4]|LS[1-4]|ESS[1-3]|ETS1)-\d$/,
  social: /^C3 (D1|D2|D3|D4|D2\.(Civ|Eco|Geo|His))\.\d+–\d+ \(Grades (K-2|3-5|6-8|9-12)\)$|^C3 D2 \(all disciplines\) \(Grades (K-2|3-5|6-8|9-12)\)$/,
};

test("every state, grade and subject builds a tree with well-formed codes and unique ids", () => {
  for (const state of Object.keys(STATES)) {
    for (const grade of GRADES) {
      for (const subject of Object.keys(SUBJECTS)) {
        const tree = buildTree({ state, grade, subject });
        assert.ok(tree.domains.length, `${state} ${grade} ${subject}`);
        const ids = new Set();
        for (const d of tree.domains) {
          assert.ok(d.skills.length, `${state} ${grade} ${subject} ${d.id} has skills`);
          for (const s of d.skills) {
            assert.ok(!ids.has(s.id), `duplicate ${s.id}`);
            ids.add(s.id);
            assert.ok(s.standards.length);
            for (const c of s.standards) assert.match(c, CODE[subject], `${state} ${grade} ${c}`);
          }
        }
      }
    }
  }
});

test("math places fraction skills in the right grades", () => {
  const g4 = buildTree({ state: "OH", grade: "4", subject: "math" }).domains.find((d) => d.key === "NF");
  assert.deepStrictEqual(g4.skills.map((s) => s.code), ["4.NF.A", "4.NF.B", "4.NF.C"]);
  // Adding fractions with unlike denominators is Grade 5 in the Common Core.
  const nfA5 = findSkill({ state: "OH", grade: "5", subject: "math" }, "math|5|NF|A").skill;
  assert.deepStrictEqual(nfA5.standards, ["CCSS.MATH.CONTENT.5.NF.A.1", "CCSS.MATH.CONTENT.5.NF.A.2"]);
  assert.strictEqual(buildTree({ state: "OH", grade: "K", subject: "math" }).domains[0].key, "CC");
  const hs = buildTree({ state: "OH", grade: "9", subject: "math" }).domains.map((d) => d.key);
  assert.deepStrictEqual(hs, ["alg1", "geo", "alg2"]);
});

test("ELA standards start in the right grade", () => {
  const codes = (grade) => buildTree({ state: "OH", grade, subject: "ela" }).domains.flatMap((d) => d.skills.map((s) => s.code));
  assert.ok(!codes("2").includes("W.2.4") && codes("3").includes("W.3.4"), "W.4 begins in grade 3");
  assert.ok(!codes("3").includes("W.3.9") && codes("4").includes("W.4.9"), "W.9 begins in grade 4");
  assert.ok(!codes("1").includes("L.1.3") && codes("2").includes("L.2.3"), "L.3 begins in grade 2");
  assert.ok(codes("K").includes("RF.K.1") && !codes("2").includes("RF.2.1") && codes("2").includes("RF.2.3"));
  assert.ok(!codes("6").some((c) => c.startsWith("RF.")), "no foundational skills after grade 5");
  assert.ok(!codes("4").includes("RL.4.8"), "RL.8 does not apply to literature");
  assert.ok(codes("10").includes("RI.9-10.8") && codes("12").includes("W.11-12.1"));
});

test("science uses NGSS grade topics, then middle/high school bands", () => {
  const g4 = buildTree({ state: "IL", grade: "4", subject: "science" }).domains[0].skills;
  assert.strictEqual(g4[0].name, "Energy");
  assert.ok(g4.some((s) => s.standards.includes("NGSS 3-5-ETS1-1")));
  const ms = buildTree({ state: "IL", grade: "7", subject: "science" });
  const ps1 = ms.domains.flatMap((d) => d.skills).find((s) => s.code === "MS-PS1");
  assert.strictEqual(ps1.standards.length, 6);
  assert.ok(ps1.standards.includes("NGSS MS-PS1-2"));
  assert.match(ms.domains[0].note, /grades 6–8/);
  const hsLs2 = buildTree({ state: "IL", grade: "10", subject: "science" }).domains.flatMap((d) => d.skills).find((s) => s.code === "HS-LS2");
  assert.strictEqual(hsLs2.standards.length, 8);
});

test("state overlay: frameworks, extra strands and content focus", () => {
  assert.strictEqual(frameworkFor("TX", "math").family, "state");
  assert.match(frameworkFor("VA", "ela").framework, /Standards of Learning/);
  assert.match(frameworkFor("FL", "math").framework, /B\.E\.S\.T\./);
  assert.strictEqual(frameworkFor("MN", "ela").family, "ccss");
  assert.strictEqual(frameworkFor("MN", "math").family, "state");
  assert.strictEqual(frameworkFor("CA", "science").family, "ngss");
  assert.strictEqual(frameworkFor("FL", "science").family, "state");
  assert.strictEqual(frameworkFor("OH", "social").family, "state");

  const tx4 = buildTree({ state: "TX", grade: "4", subject: "math" });
  assert.ok(tx4.domains.some((d) => d.key === "PFL" && d.source === "state"));
  assert.match(tx4.alignmentNote, /own standards/);
  assert.ok(!buildTree({ state: "TX", grade: "9", subject: "math" }).domains.some((d) => d.key === "PFL"));
  assert.ok(!buildTree({ state: "CA", grade: "4", subject: "math" }).domains.some((d) => d.key === "PFL"));

  const content = (state, grade) => buildTree({ state, grade, subject: "social" }).domains[0].skills[0];
  assert.strictEqual(content("TX", "7").name, "Texas history");
  assert.strictEqual(content("TX", "7").source, "state");
  assert.match(content("VA", "4").name, /Virginia Studies/);
  assert.match(content("OH", "4").name, /in many states/);
});

test("context validation", () => {
  assert.ok(validateContext({ state: "TX", grade: "4", subject: "math" }).ctx);
  assert.ok(validateContext({ state: "XX", grade: "4", subject: "math" }).error);
  assert.ok(validateContext({ state: "TX", grade: "13", subject: "math" }).error);
  assert.ok(validateContext({ state: "TX", grade: "4", subject: "art" }).error);
});

const skill = { id: "math|5|NF|A", standards: ["CCSS.MATH.CONTENT.5.NF.A.1", "CCSS.MATH.CONTENT.5.NF.A.2"] };

test("micro-skills keep only the skill's own codes", () => {
  const raw = 'Sure: [{"title":"Adding fractions with unlike denominators","code":"CCSS.MATH.CONTENT.5.NF.A.1"},{"title":"Word problems","code":"CCSS.MATH.CONTENT.9.ZZ.A.1"},{"title":""}]';
  assert.deepStrictEqual(tutor.parseMicroSkills(raw, skill), [
    { title: "Adding fractions with unlike denominators", code: "CCSS.MATH.CONTENT.5.NF.A.1" },
    { title: "Word problems", code: "CCSS.MATH.CONTENT.5.NF.A.1" },
  ]);
  assert.deepStrictEqual(tutor.parseMicroSkills("no json", skill), []);
});

test("the Standards line is stripped and filtered", () => {
  const r = tutor.splitStandards("Let's add 1/2 + 1/3.\n\nWhat is a common denominator?\nStandards: CCSS.MATH.CONTENT.5.NF.A.1; TEKS 5.3H", skill);
  assert.strictEqual(r.text, "Let's add 1/2 + 1/3.\n\nWhat is a common denominator?");
  assert.deepStrictEqual(r.tags, ["CCSS.MATH.CONTENT.5.NF.A.1"]);
  assert.deepStrictEqual(tutor.splitStandards("No line here.", skill).tags, ["CCSS.MATH.CONTENT.5.NF.A.1"]);
  assert.deepStrictEqual(tutor.splitStandards("x\n**Standards:** CCSS.MATH.CONTENT.5.NF.A.2", skill).tags, ["CCSS.MATH.CONTENT.5.NF.A.2"]);
});

test("quiz questions are validated", () => {
  const raw = JSON.stringify({
    questions: [
      { type: "mc", question: "1/2 + 1/4 = ?", options: ["2/6", "3/4", "1/8", "2/4"], answer: 1, explanation: "Make quarters.", dok: 2, code: "CCSS.MATH.CONTENT.5.NF.A.1" },
      { type: "mc", question: "Broken", options: ["a", "b"], answer: 0 },
      { type: "mc", question: "Bad answer", options: ["a", "b", "c", "d"], answer: 7 },
      { type: "short", question: "Explain why 1/3 + 1/3 is not 2/6.", answer: "Thirds stay thirds.", dok: 9, code: "made-up" },
    ],
  });
  const quiz = tutor.parseQuiz(raw, skill, "core", false);
  assert.strictEqual(quiz.length, 1);
  assert.strictEqual(quiz[0].answer, 1);
  assert.strictEqual(quiz[0].dokLabel, "Skills & concepts");
  const sheet = tutor.parseQuiz(raw, skill, "advanced", true);
  assert.strictEqual(sheet.length, 2);
  assert.strictEqual(sheet[1].type, "short");
  assert.strictEqual(sheet[1].dok, 3, "out-of-tier DOK falls back to the tier's first level");
  assert.strictEqual(sheet[1].code, "CCSS.MATH.CONTENT.5.NF.A.1");
});

test("tutor prompt locks the skill, style, tier and code list", () => {
  const found = findSkill({ state: "TX", grade: "5", subject: "math" }, "math|5|NF|A");
  const p = tutor.learnSystemPrompt({ ...found, micro: "Unlike denominators", style: "story", tier: "support" });
  assert.match(p, /Texas Essential Knowledge and Skills/);
  assert.match(p, /own framework/);
  assert.match(p, /Teach me through a story/);
  assert.match(p, /Remedial tier/);
  assert.match(p, /CCSS\.MATH\.CONTENT\.5\.NF\.A\.1; CCSS\.MATH\.CONTENT\.5\.NF\.A\.2/);
  assert.match(p, /Never invent a code/);
  const convo = tutor.learnInput({ ...found, style: "eli8", tier: "core" }, [{ role: "system", content: "x" }, { role: "user", content: "hi" }]);
  assert.deepStrictEqual(convo.input.map((m) => m.role), ["developer", "user", "user"]);
  assert.ok(convo.input.every((m) => m.type === "message"));
});

test("learner profiles hold a nickname, grade and state only", () => {
  assert.deepStrictEqual(cleanLearner({ nickname: "  Ada ", grade: "4", state: "TX", email: "x" }).learner, { nickname: "Ada", grade: "4", state: "TX" });
  assert.ok(cleanLearner({ nickname: "ada@example.com", grade: "4", state: "TX" }).error);
  assert.ok(cleanLearner({ nickname: "Ada 07700900123", grade: "4", state: "TX" }).error);
  assert.ok(cleanLearner({ nickname: "Ada", grade: "14", state: "TX" }).error);
});

test("skill status from quiz results", () => {
  assert.strictEqual(statusFor({ lastPct: 0.8, lastTier: "core" }), "mastered");
  assert.strictEqual(statusFor({ lastPct: 1, lastTier: "support" }), "practising", "catch-up level alone is not mastery");
  assert.strictEqual(statusFor({ lastPct: 0.4 }), "struggling");
  assert.strictEqual(statusFor({ openStruggles: 1 }), "struggling");
  assert.strictEqual(statusFor({}), "practising");
});

test("answers given as option text, letters stripped, and the independent check filters wrong keys", () => {
  const raw = JSON.stringify({
    questions: [
      { type: "mc", question: "1/3 + 1/6 = ?", working: "2/6+1/6=3/6=1/2", options: ["A. 2/6", "B. 1/9", "C. 1/2", "D. 1/6"], answer: "C. 1/2", dok: 2 },
      { type: "mc", question: "1/4 + 1/3 = ?", options: ["2/7", "2/12", "7/12", "5/12"], answer: "5/12", dok: 2 },
      { type: "mc", question: "Duplicate options", options: ["1", "1", "2", "3"], answer: "2" },
    ],
  });
  const quiz = tutor.parseQuiz(raw, skill, "core", false);
  assert.strictEqual(quiz.length, 2);
  assert.deepStrictEqual(quiz[0].options, ["2/6", "1/9", "1/2", "1/6"]);
  assert.strictEqual(quiz[0].answer, 2);
  const tree = findSkill({ state: "OH", grade: "5", subject: "math" }, "math|5|NF|A").tree;
  assert.match(tutor.verifyPrompt(quiz, tree), /Grade 5 Math/);
  const check = JSON.stringify({ answers: [{ n: 1, answer: "1/2" }, { n: 2, answer: "7/12" }] });
  const kept = tutor.applyVerification(quiz, check);
  assert.deepStrictEqual(kept.map((q) => q.question), ["1/3 + 1/6 = ?"], "the wrong 5/12 key is dropped");
});

test("options equal in value are rejected", () => {
  assert.strictEqual(tutor.numericValue("3/6"), 0.5);
  assert.strictEqual(tutor.numericValue("1 1/2"), 1.5);
  assert.strictEqual(tutor.numericValue("$12"), 12);
  assert.strictEqual(tutor.numericValue("75 ml"), 75);
  assert.strictEqual(tutor.numericValue("-4"), -4);
  assert.strictEqual(tutor.numericValue("Shop A is cheaper"), null);
  assert.strictEqual(tutor.numericValue("3/0"), null);
  assert.ok(tutor.hasEqualValues(["2/6", "3/6", "1/2", "1/3"]));
  assert.ok(tutor.hasEqualValues(["0.5", "1/2", "2", "3"]));
  assert.ok(!tutor.hasEqualValues(["2/8", "3/8", "4/8", "5/8"]));
  assert.ok(!tutor.hasEqualValues(["happy - sad", "run - jog", "hot - warm", "jump - leap"]));
  const raw = JSON.stringify({ questions: [{ type: "mc", question: "1/3 + 1/6?", options: ["2/6", "3/6", "1/2", "1/3"], answer: "1/2" }] });
  assert.strictEqual(tutor.parseQuiz(raw, skill, "core", false).length, 0);
});
