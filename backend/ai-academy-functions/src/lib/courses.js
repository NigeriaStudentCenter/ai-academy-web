// Course catalogue: built-in courses (src/courses/*.js, each with an
// `audiences` array of "teens" and/or "professional") plus courses synced from
// the SharePoint "AI Academy" site (see sharepointCourses.js).
const { loadCatalog } = require("./sharepointCourses");
const { CATEGORIES, categorize } = require("./catalogConfig");

const BUILT_IN = [require("../courses/ai-foundations"), require("../courses/become-extra-ordinary")];

async function allCourses() {
  let synced = [];
  try {
    synced = (await loadCatalog()).courses || [];
  } catch {
    // Storage unavailable — still serve the built-in courses.
  }
  const ids = new Set(BUILT_IN.map((c) => c.courseId));
  return [...BUILT_IN, ...synced.filter((c) => !ids.has(c.courseId))];
}

function canAccess(user, course) {
  // Draft courses are visible to admins only, for review before release.
  if (course.draft && !user.isAdmin) return false;
  return course.audiences.some((a) => user.audiences.includes(a));
}

/**
 * The course as sent to the app: quiz answers/explanations and the AI
 * coaches' instructions stay on the server.
 */
function publicCourse(course) {
  const { coachRules, ...rest } = course;
  return {
    ...rest,
    lessons: rest.lessons.map((l) => ({
      ...l,
      quiz: l.quiz ? l.quiz.map(({ question, options }) => ({ question, options })) : undefined,
      scenarios: l.scenarios
        ? l.scenarios.map(({ scenarioId, title, question, options }) => ({ scenarioId, title, question, options }))
        : undefined,
      coaches: l.coaches ? l.coaches.map(({ systemPrompt, ...c }) => c) : undefined,
    })),
  };
}

/** The course if it exists and this learner may see it, otherwise null. */
async function getCourseForUser(user, courseId) {
  const course = (await allCourses()).find((c) => c.courseId === courseId);
  return course && canAccess(user, course) ? course : null;
}

/** Summaries (no lesson bodies) of every course this learner may see. */
async function listCoursesForUser(user) {
  return (await allCourses())
    .filter((c) => canAccess(user, c))
    .map((c) => ({
      courseId: c.courseId,
      title: c.title,
      description: c.description,
      level: c.level,
      estimatedDuration: c.estimatedDuration,
      lessonCount: c.lessons.length,
      certificateEligible: c.certificateEligible,
      audiences: c.audiences,
      category: categorize(c),
      draft: !!c.draft,
    }));
}

/** Categories that contain at least one of these courses, in display order. */
function categoriesFor(courses) {
  const used = new Set(courses.map((c) => c.category));
  return CATEGORIES.filter((c) => used.has(c.id));
}

module.exports = { getCourseForUser, listCoursesForUser, categoriesFor, publicCourse };
