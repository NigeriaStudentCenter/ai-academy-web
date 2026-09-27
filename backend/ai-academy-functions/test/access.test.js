const test = require("node:test");
const assert = require("node:assert/strict");
const access = require("../src/lib/access");

const future = new Date(Date.now() + 86400000).toISOString();
const past = new Date(Date.now() - 86400000).toISOString();
const noSub = async () => null;
const learner = { userId: "u1", username: "jane@gmail.com", isAdmin: false };

const course = {
  courseId: "masterclass",
  certificateEligible: true,
  lessons: [
    { lessonId: "l1", title: "One", contentBody: "<p>a</p>", coaches: [{ coachId: "practice" }], practiceCoach: "practice" },
    { lessonId: "l2", title: "Two", objective: "Goal", contentBody: "<p>b</p>", videoUrl: "v", coaches: [{ coachId: "practice" }] },
  ],
};
const pathway = { courseId: "ai-data-analysts", source: { playlistUrl: "https://aiskillsnavigator.microsoft.com/playlists/x" }, lessons: course.lessons };

function withPaywall(fn) {
  return async () => {
    const saved = { ...process.env };
    process.env.PAYWALL_ENABLED = "1";
    delete process.env.ORG_ACCESS_DOMAINS;
    delete process.env.PAYWALL_TEST_ACCOUNTS;
    delete process.env.PAYWALL_PREVIEW;
    delete process.env.FREE_COURSE_IDS;
    try {
      await fn();
    } finally {
      process.env = saved;
    }
  };
}

test("paywall off: everyone has full access", async () => {
  delete process.env.PAYWALL_ENABLED;
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  assert.equal(a.full, true);
  assert.equal(access.applyAccess(course, a), course);
});

test("who gets full access", withPaywall(async () => {
  const full = async (u, sub = noSub) => (await access.accessFor({ ...learner, ...u }, { loadSubscription: sub })).reason;
  assert.equal(await full({}), "none");
  assert.equal(await full({ isAdmin: true }), "admin");
  assert.equal(await full({ username: "t@teenskills.co.uk" }), "organisation");
  assert.equal(await full({ username: "staff@bsoedu.org" }), "organisation");
  assert.equal(await full({ username: "appreview@bsoedu.org" }), "none", "App Review account must be able to buy");
  assert.equal(await full({}, async () => ({ status: "active", expiresAt: future })), "subscription");
  assert.equal(await full({}, async () => ({ status: "active", expiresAt: past })), "none");
  assert.equal(await full({}, async () => ({ status: "revoked", expiresAt: future })), "none");
  process.env.ORG_ACCESS_DOMAINS = "partner.com";
  assert.equal(await full({ username: "a@partner.com" }), "organisation");
  assert.equal(await full({ username: "staff@bsoedu.org" }), "none");
}));

test("default: everything locked to an outline without a subscription", withPaywall(async () => {
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  for (const c of [course, pathway]) {
    const out = access.applyAccess(c, a);
    assert.equal(out.access, "locked");
    assert.equal(out.certificateEligible, false);
    assert.ok(out.lessons.every((l) => l.locked && l.contentBody === "" && !l.coaches && !l.videoUrl));
    assert.equal(out.lessons[1].objective, "Goal", "outline keeps the goal");
    assert.equal(access.lessonUnlocked(c, "l1", a), false);
  }
  assert.equal(access.isFreeCourse(pathway), false, "Microsoft pathways are in the bundle");
}));

test("optional preview: lesson 1 open without AI", withPaywall(async () => {
  process.env.PAYWALL_PREVIEW = "1";
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  const [one, two] = access.applyAccess(course, a).lessons;
  assert.equal(one.contentBody, "<p>a</p>");
  assert.equal(one.coaches, undefined);
  assert.equal(one.aiLocked, true);
  assert.equal(two.locked, true);
}));

test("optional free course list", withPaywall(async () => {
  process.env.FREE_COURSE_IDS = "ai-foundations";
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  const out = access.applyAccess({ ...course, courseId: "ai-foundations" }, a);
  assert.equal(out.access, "free");
  assert.ok(out.lessons.every((l) => !l.locked && !l.coaches));
}));
