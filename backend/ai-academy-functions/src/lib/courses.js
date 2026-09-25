// Course catalogue. To add a course, create src/courses/<id>.js with an
// `audiences` array ("teens" and/or "professional") and list it here.
const COURSES = [require("../courses/ai-foundations")];

const byId = new Map(COURSES.map((c) => [c.courseId, c]));

function canAccess(user, course) {
  return course.audiences.some((a) => user.audiences.includes(a));
}

/** The course if it exists and this learner may see it, otherwise null. */
function getCourseForUser(user, courseId) {
  const course = byId.get(courseId);
  return course && canAccess(user, course) ? course : null;
}

/** Summaries (no lesson bodies) of every course this learner may see. */
function listCoursesForUser(user) {
  return COURSES.filter((c) => canAccess(user, c)).map((c) => ({
    courseId: c.courseId,
    title: c.title,
    description: c.description,
    level: c.level,
    estimatedDuration: c.estimatedDuration,
    lessonCount: c.lessons.length,
    certificateEligible: c.certificateEligible,
    audiences: c.audiences,
  }));
}

module.exports = { getCourseForUser, listCoursesForUser };
