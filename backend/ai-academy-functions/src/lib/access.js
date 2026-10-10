// Subscription access ("AI Academy All Access": one subscription unlocks every
// course, Practice with AI, the AI tutors, progress tracking and certificates).
//
// Nothing is locked until the app setting PAYWALL_ENABLED=1 — app builds
// without the subscribe screen must keep working, so the paywall is switched
// on only once a build with in-app purchase is live in the stores.
//
// Everything is in the subscription (the owner's decision, 2026-09-27):
// without it a learner sees the catalogue and each course's outline (lesson
// titles and goals) but no lesson content, AI partners or certificates.
// Microsoft AI Skills Navigator pathway courses are included: what the
// subscription pays for is our structure, goals, Practice with AI, progress
// tracking and certificates — Microsoft's material is only linked, never
// copied, and stays free on Microsoft's site.
// Optional, off by default: FREE_COURSE_IDS (comma list) and
// PAYWALL_PREVIEW=1 (lesson 1 of each course open as a preview).
//
// Full access without paying in the app (Apple 3.1.3(c): organisations buy
// seats directly): admins, organisation domains (BSOE staff, Teens Academy,
// partner organisations), except test accounts that must be able to buy
// (the App Review demo account).

const { TableClient } = require("@azure/data-tables");

const SUBSCRIPTIONS_TABLE = "Subscriptions";
const DEFAULT_ORG_DOMAINS = ["bsoedu.org", "teenskills.co.uk"];
const DEFAULT_TEST_ACCOUNTS = ["appreview@bsoedu.org"];

function listSetting(name, fallback) {
  const raw = process.env[name];
  const list = raw === undefined ? fallback : raw.split(",");
  return list.map((s) => s.trim().toLowerCase()).filter(Boolean);
}

const paywallEnabled = () => process.env.PAYWALL_ENABLED === "1";

/** Accounts that must be able to buy (e.g. the App Review demo account). */
function isTestAccount(user) {
  return listSetting("PAYWALL_TEST_ACCOUNTS", DEFAULT_TEST_ACCOUNTS).includes((user.username || "").toLowerCase());
}

/**
 * Sandbox (TestFlight / App Review) purchases are free, so they only unlock
 * access for test accounts and admins — or everyone if APPLE_SANDBOX_OPEN=1.
 */
function sandboxAllowed(user) {
  return process.env.APPLE_SANDBOX_OPEN === "1" || user.isAdmin || isTestAccount(user);
}

/** Free to everyone: only courses listed in FREE_COURSE_IDS (none by default). */
function isFreeCourse(course) {
  return listSetting("FREE_COURSE_IDS", []).includes(String(course.courseId).toLowerCase());
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
  if (!isTestAccount(user) && listSetting("ORG_ACCESS_DOMAINS", DEFAULT_ORG_DOMAINS).includes(domain)) {
    return { full: true, reason: "organisation", paywall: true };
  }
  const sub = await refreshExpired(user.userId, await loadSubscription(user.userId));
  if (isActive(sub)) return { full: true, reason: "subscription", paywall: true, expiresAt: sub.expiresAt };
  return { full: false, reason: "none", paywall: true };
}

/**
 * Google renewals: without a notification the stored expiry passes at each
 * renewal, so an expired Google subscription is re-read from Google (at most
 * hourly). Apple renewals arrive as App Store Server Notifications instead.
 */
async function refreshExpired(userId, sub, { lookup, save, now = Date.now() } = {}) {
  if (!sub || isActive(sub, now) || sub.platform !== "google" || !sub.purchaseToken) return sub;
  if (now - new Date(sub.updatedAt || 0).getTime() < 60 * 60 * 1000) return sub;
  const googlePlay = require("./googlePlay");
  lookup ??= googlePlay.lookupSubscription;
  save ??= require("./storeSubscriptions").saveSubscription;
  try {
    const fresh = await lookup(sub.purchaseToken);
    if (!fresh) return sub;
    const grants = googlePlay.grantsAccess(fresh, now);
    await save(userId, "google", fresh, { grants });
    return { ...sub, status: grants ? "active" : "inactive", expiresAt: fresh.expiresAt };
  } catch {
    return sub; // Google unreachable: keep what we have
  }
}

/** How much of a course the learner gets: "full" | "free" | "preview" | "locked". */
function courseAccess(course, access) {
  if (access.full) return "full";
  if (isFreeCourse(course)) return "free";
  return process.env.PAYWALL_PREVIEW === "1" ? "preview" : "locked";
}

/** Whether a lesson's content is available to this learner. */
function lessonUnlocked(course, lessonId, access) {
  const level = courseAccess(course, access);
  if (level === "full" || level === "free") return true;
  return level === "preview" && course.lessons[0]?.lessonId === lessonId;
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
  refreshExpired,
  isTestAccount,
  sandboxAllowed,
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
