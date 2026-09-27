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

test("preview: lesson 1 open without AI, the rest outline only", withPaywall(async () => {
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  const out = access.applyAccess(course, a);
  assert.equal(out.access, "preview");
  assert.equal(out.certificateEligible, false);
  const [one, two] = out.lessons;
  assert.equal(one.contentBody, "<p>a</p>");
  assert.equal(one.coaches, undefined);
  assert.equal(one.practiceCoach, undefined);
  assert.equal(one.aiLocked, true);
  assert.deepEqual(two, { lessonId: "l2", title: "Two", lessonOrder: undefined, duration: undefined, objective: "Goal", contentBody: "", locked: true });
  assert.equal(access.lessonUnlocked(course, "l1", a), true);
  assert.equal(access.lessonUnlocked(course, "l2", a), false);
}));

test("Microsoft pathway courses stay free (no AI without subscription)", withPaywall(async () => {
  const a = await access.accessFor(learner, { loadSubscription: noSub });
  assert.equal(access.isFreeCourse(pathway), true);
  assert.equal(access.isFreeCourse({ courseId: "ai-foundations" }), true);
  const out = access.applyAccess(pathway, a);
  assert.equal(out.access, "free");
  assert.ok(out.lessons.every((l) => !l.locked));
  assert.ok(out.lessons.every((l) => !l.coaches));
  assert.equal(access.lessonUnlocked(pathway, "l2", a), true);
}));
