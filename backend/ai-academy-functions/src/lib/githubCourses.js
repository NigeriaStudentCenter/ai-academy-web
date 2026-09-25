// "200 AI Hustles" courses live as HTML pages in the public
// NigeriaStudentCenter/AI-Academy repo (published on GitHub Pages). New files
// named HustleNN_*.html are picked up automatically on the next sync.

const { parseHustlePage } = require("./hustleParser");

const REPO = process.env.HUSTLE_REPO || "NigeriaStudentCenter/AI-Academy";
const BRANCH = process.env.HUSTLE_BRANCH || "main";
const HUSTLE_FILE = /^Hustle(\d+)_.+\.html$/;
// Business/income content: professional learners only (teens: see courses.js).
const AUDIENCES = ["professional"];

async function getJson(url) {
  const res = await fetch(url, {
    headers: { Accept: "application/vnd.github+json", "User-Agent": "ai-academy-sync" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
  return res.json();
}

async function fetchHustleCourses(log = () => {}) {
  const files = (await getJson(`https://api.github.com/repos/${REPO}/contents?ref=${BRANCH}`))
    .filter((f) => f.type === "file" && HUSTLE_FILE.test(f.name))
    .sort((a, b) => Number(a.name.match(HUSTLE_FILE)[1]) - Number(b.name.match(HUSTLE_FILE)[1]));

  const courses = [];
  for (const file of files) {
    const res = await fetch(file.download_url, { headers: { "User-Agent": "ai-academy-sync" } });
    if (!res.ok) {
      log(`Skipped ${file.name}: GitHub ${res.status}`);
      continue;
    }
    const course = parseHustlePage(await res.text(), {
      fileName: file.name,
      audiences: AUDIENCES,
      sourceUrl: `https://nigeriastudentcenter.github.io/AI-Academy/${file.name}`,
    });
    if (course.lessons.length === 0) {
      log(`Skipped ${file.name}: no lessons found`);
      continue;
    }
    courses.push(course);
    log(`Imported "${course.title}" (${course.lessons.length} lessons)`);
  }
  return courses;
}

module.exports = { fetchHustleCourses };
