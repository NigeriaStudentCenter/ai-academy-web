// Subscription access ("AI Academy All Access": one subscription unlocks every
// course, Practice with AI, the AI tutors, progress tracking and certificates).
//
// Nothing is locked until the app setting PAYWALL_ENABLED=1 — app builds
// without the subscribe screen must keep working, so the paywall is switched
// on only once a build with in-app purchase is live in the stores.
//
// Without a subscription a learner gets:
//   - free courses in full (Microsoft AI Skills Navigator pathways — we never
//     charge for Microsoft's content — and AI Foundations), and
//   - lesson 1 of every other course as a preview,
// but no AI partners or certificates.
//
// Full access without paying in the app (Apple 3.1.3(c): organisations buy
// seats directly): admins, organisation domains (BSOE staff, Teens Academy,
// partner organisations), except test accounts that must be able to buy
// (the App Review demo account).

const { TableClient } = require("@azure/data-tables");

const SUBSCRIPTIONS_TABLE = "Subscriptions";
const FREE_COURSE_IDS = new Set(["ai-foundations"]);
const DEFAULT_ORG_DOMAINS = ["bsoedu.org", "teenskills.co.uk"];
const DEFAULT_TEST_ACCOUNTS = ["appreview@bsoedu.org"];

function listSetting(name, fallback) {
  const raw = process.env[name];
  const list = raw === undefined ? fallback : raw.split(",");
  return list.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

const paywallEnabled = () => process.env.PAYWALL_ENABLED === "1";

/** Free to everyone: Microsoft pathway courses and the listed free courses. */
function isFreeCourse(course) {
  return FREE_COURSE_IDS.has(course.courseId) || !!course.free || !!course.source?.playlistUrl;
}

function subscriptions() {
  return TableClient.fromConnectionString(process.env.AzureWebJobsStorage, SUBSCRIPTIONS_TABLE);
}

/** The learner's stored store subscription, or null. */
async function getSubscription(userId) {
  try {
    return await subscriptions().getEntity(userId, "current");
  } catch (err) {
    if (err.statusCode === 404) return null;
    throw err;
  }
}

function isActive(sub, now = Date.now()) {
  return !!sub && sub.status === "active" && new Date(sub.expiresAt).getTime() > now;
}

/**
 * What this learner may use: { full, reason, paywall }.
 * reason: "paywall-off" | "admin" | "organisation" | "subscription" | "none"
 */
async function accessFor(user, { loadSubscription = getSubscription } = {}) {
  if (!paywallEnabled()) return { full: true, reason: "paywall-off", paywall: false };
  if (user.isAdmin) return { full: true, reason: "admin", paywall: true };
  const username = (user.username || "").toLowerCase();
  const domain = username.split("@")[1] || "";
  const testAccount = listSetting("PAYWALL_TEST_ACCOUNTS", DEFAULT_TEST_ACCOUNTS).includes(username);
  if (!testAccount && listSetting("ORG_ACCESS_DOMAINS", DEFAULT_ORG_DOMAINS).includes(domain)) {
    return { full: true, reason: "organisation", paywall: true };
  }
  const sub = await loadSubscription(user.userId);
  if (isActive(sub)) return { full: true, reason: "subscription", paywall: true, expiresAt: sub.expiresAt };
  return { full: false, reason: "none", paywall: true };
}

/** How much of a course the learner gets: "full" | "free" | "preview". */
function courseAccess(course, access) {
  if (access.full) return "full";
  return isFreeCourse(course) ? "free" : "preview";
}

/** Whether a lesson's content is available (free courses and lesson 1 always are). */
function lessonUnlocked(course, lessonId, access) {
  if (courseAccess(course, access) !== "preview") return true;
  return course.lessons[0]?.lessonId === lessonId;
}

/**
 * The course as this learner may see it. Locked lessons keep their outline
 * (title, goal, duration) but lose their content; without full access the
 * AI partners are removed and marked `aiLocked` so the app can offer the
 * subscription instead.
 */
function applyAccess(course, access) {
  if (access.full) return course;
  return {
    ...course,
    access: courseAccess(course, access),
    certificateEligible: false,
    lessons: course.lessons.map((lesson) => {
      const hadAi = !!lesson.coaches?.length;
      if (lessonUnlocked(course, lesson.lessonId, access)) {
        const { coaches, practiceCoach, ...rest } = lesson;
        return hadAi ? { ...rest, aiLocked: true } : rest;
      }
      return {
        lessonId: lesson.lessonId,
        title: lesson.title,
        lessonOrder: lesson.lessonOrder,
        duration: lesson.duration,
        objective: lesson.objective,
        contentBody: "",
        locked: true,
      };
    }),
  };
}

/** Response for an action that needs the subscription. */
const SUBSCRIPTION_REQUIRED = {
  status: 403,
  jsonBody: { error: "This needs an AI Academy subscription.", code: "subscription_required" },
};

module.exports = {
  paywallEnabled,
  isFreeCourse,
  isActive,
  accessFor,
  courseAccess,
  lessonUnlocked,
  applyAccess,
  getSubscription,
  subscriptions,
  SUBSCRIPTION_REQUIRED,
};
