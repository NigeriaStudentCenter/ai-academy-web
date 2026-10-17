const test = require("node:test");
const assert = require("node:assert/strict");
process.env.PAYWALL_ENABLED = "1";
const access = require("../src/lib/access");

const active = { status: "active", expiresAt: "2099-01-01T00:00:00Z", platform: "paystack" };
const store = (rows) => async (key) => rows[key] || null;

test("a Firebase account with an organisation email does NOT get free organisation access", async () => {
  const fb = { userId: "fb_abc", username: "someone@teenskills.co.uk", provider: "firebase", emailVerified: true };
  const r = await access.accessFor(fb, { loadSubscription: store({}) });
  assert.equal(r.full, false);
  const entra = { userId: "oid-1", username: "someone@teenskills.co.uk", provider: "entra", emailVerified: true };
  assert.equal((await access.accessFor(entra, { loadSubscription: store({}) })).reason, "organisation");
});

test("a website (email) subscription unlocks whoever signs in with that verified email", async () => {
  const rows = { "email:ada@gmail.com": active };
  const google = { userId: "fb_1", username: "Ada@Gmail.com", provider: "firebase", emailVerified: true };
  const r = await access.accessFor(google, { loadSubscription: store(rows) });
  assert.equal(r.full, true);
  assert.equal(r.reason, "subscription");
  // Unverified email (e.g. email+password not yet confirmed) does not.
  const unverified = { ...google, emailVerified: false };
  assert.equal((await access.accessFor(unverified, { loadSubscription: store(rows) })).full, false);
});

test("emailOwner normalises the address", () => {
  assert.equal(access.emailOwner("  Ada@Gmail.COM "), "email:ada@gmail.com");
});

test("a visitor (no sign-in) sees outlines only, never full lessons", async () => {
  const r = await access.accessFor({ anonymous: true, userId: null, username: "" }, { loadSubscription: async () => { throw new Error("should not look up"); } });
  assert.equal(r.full, false);
  const course = { courseId: "c1", lessons: [{ lessonId: "l1", title: "One", contentBody: "secret", lessonOrder: 1 }] };
  const shown = access.applyAccess(course, r);
  assert.equal(shown.lessons[0].contentBody, "");
  assert.equal(shown.lessons[0].locked, true);
});
