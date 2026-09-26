// Courses on the SharePoint "Courses" page (SitePages/Courses.aspx) whose
// content lives in the NigeriaStudentCenter/AI-Academy repo rather than on
// SharePoint. Each entry mirrors a card (or a group of cards) on that page.
// Role pathways are taught through Microsoft AI Skills Navigator playlists:
// the app shows each module's outline and opens the playlist to learn it.

const { parseLessonPage, parsePathwayPage, parseSectionPage } = require("./githubPageParser");

const REPO = process.env.HUSTLE_REPO || "NigeriaStudentCenter/AI-Academy";
const BRANCH = process.env.HUSTLE_BRANCH || "main";
const PAGES = "https://nigeriastudentcenter.github.io/AI-Academy/";
const PRO = ["professional"];
const PLAYLIST = "https://aiskillsnavigator.microsoft.com/playlists/";

// "Lesson 1 — Connectors & Context: …" → "Connectors & Context: …"
const dropLessonNumber = (t) => t.replace(/^(Advanced\s+)?Lesson\s+\d+\s*[—–-]\s*/i, "");

const LESSON_COURSES = [
  {
    courseId: "ai-skills-for-work",
    title: "AI Skills for Work",
    description:
      "Five hands-on lessons that turn you from an AI spectator into the person your team relies on — each ends with a Prove-It task that becomes real evidence for your CV.",
    level: "Beginner",
    files: [
      "AIskillsselection.html",
      "advancedprompting.html",
      "workautomation.html",
      "hallucinationanddatasafety.html",
      "Aiportfolio.html",
    ],
  },
  {
    courseId: "ai-cv-beat-the-ats",
    title: "Use AI to Tailor Your CV to Beat the ATS",
    description:
      "Upload your CV and a job advert into any AI tool, find the gaps, and produce an ATS-friendly CV matched to the role.",
    level: "Beginner",
    files: ["BeatATS.html"],
  },
  {
    courseId: "ai-interview-prep",
    title: "Interview Prep with an AI Coach",
    description: "Practise real interview questions with an AI coach and sharpen your answers with the STAR method.",
    level: "Beginner",
    files: ["InterviewPrep.html"],
  },
  {
    courseId: "research-a-company",
    title: "Research a Company Before an Interview",
    description: "Walk into any interview with an AI-built brief on the company, its current news and the questions to ask.",
    level: "Beginner",
    files: ["researchacompany.html"],
  },
  {
    courseId: "advanced-ai-systems-agents",
    title: "Advanced: AI Systems & Agents",
    description:
      "From AI user to AI architect: connectors and context, APIs, agent skills, Cowork & Canvas, and agentic workflows — each with a no-code and a code track.",
    level: "Advanced",
    files: [
      "Adavancedlesson1.html",
      "APILesson.html",
      "agentskillslesson.html",
      "Coworkandcanvas.html",
      "Agentlesson.html",
    ],
  },
  {
    courseId: "ai-ready-resources",
    title: "AI-Ready Resources: Build It Yourself",
    description:
      "A guide, a roadmap, an interactive checker and a worked example that show how AI-ready systems work — and how to build your own with AI.",
    level: "Intermediate",
    files: [
      "Apireadinessguide.html",
      "The90DayAIReadinessPlaybook.html",
      // Interactive scoring tool: read here, use it on the web.
      { file: "aireadyselfcheck.html", resourceLabel: "Open the interactive self-check" },
      "examplereport.html",
    ],
  },
];

const PATHWAYS = [
  { courseId: "ai-for-admins", file: "AIForAdmins.html", playlist: "4b50f2d3-8ca2-404b-a84d-44683fc4211f", title: "AI for Administrators" },
  { courseId: "ai-in-healthcare", file: "AIHealthcare.html", playlist: "912cab4d-e557-4dca-bed4-915d0cdd3ebf" },
  { courseId: "ai-for-it-developers", file: "AIForITDevelopers.html", playlist: "35265c90-fabb-4d3e-aa8c-a6e38b04eb7d" },
  { courseId: "ai-product-management", file: "AIForProductManagers.html", playlist: "efa2076c-20f2-4b95-ad65-4833eb593832" },
  { courseId: "legal-ai-accelerator", file: "LegalAIAccelerator.html", playlist: "b0ed8729-a859-4a7d-a68a-4fb7a8ba7aa2" },
  { courseId: "legal-ai-fast-track", file: "LegalAIFastTrack.html", playlist: "fbd5f54b-8445-41cc-9bff-22042d126a1e" },
  { courseId: "ai-business-analysis", file: "AIForBusinessAnalysts.html", playlist: "ff555b74-d129-4a54-ba82-da79f1960189" },
  { courseId: "ai-data-analysts", file: "AIForDataAnalysts.html", playlist: "e40246ee-2f6b-45c2-bcde-06c9654437d5" },
  {
    courseId: "ai-business-marketing-sales",
    file: "AIForBusinessMarketingSales.html",
    playlistUrl: `${PLAYLIST}join?invite=NGJhYjg3OWEtNDlmMS00MzRjLTgwMzctZTg0Mzc4MDg4NzUx`,
  },
  {
    // "AI Engineer Course" (SitePages/AI-Engineer.aspx): one playlist per stage.
    courseId: "azure-ai-engineer",
    file: "AzureAIEngineer.html",
    playlist: "e39f577a-9f39-4cb9-b7e1-b227f2e45b50", // Introduction
    stagePlaylists: [
      "5393b5aa-e8a5-4280-bfc0-8103d9281154", // Beginner Foundation
      "dd339f47-5f40-45f0-b842-6c7d457171a4", // Intermediate–Advanced
      "caad8782-9075-4d2e-8ecb-58ade50e758c", // Certification and Exam Prep
      "69d49485-f4cb-422d-a6a4-96948e810d9a", // Extra Labs
    ],
    extraPlaylists: [{ id: "5f57bfb1-b096-418b-9700-ee7f34c19dff", label: "More labs" }],
  },
];

async function fetchPage(file) {
  const res = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${file}`, {
    headers: { "User-Agent": "ai-academy-sync" },
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} for ${file}`);
  return res.text();
}

function course(fields) {
  return {
    level: "",
    estimatedDuration: `${fields.lessons.length} ${fields.lessons.length === 1 ? "lesson" : "lessons"}`,
    certificateEligible: true,
    audiences: PRO,
    category: "Courses",
    ...fields,
    lessonCount: fields.lessons.length,
  };
}

async function buildLessonCourse(def) {
  const lessons = [];
  for (const entry of def.files) {
    const { file, resourceLabel } = typeof entry === "string" ? { file: entry } : entry;
    const lesson = parseLessonPage(await fetchPage(file), {
      lessonId: `lesson-${lessons.length + 1}`,
      lessonOrder: lessons.length + 1,
      titleFix: dropLessonNumber,
    });
    if (!lesson) continue;
    delete lesson.level;
    if (resourceLabel) Object.assign(lesson, { resourceUrl: PAGES + file, resourceLabel });
    lessons.push(lesson);
  }
  return course({
    courseId: def.courseId,
    title: def.title,
    description: def.description,
    level: def.level,
    source: { type: "github", files: def.files.map((f) => f.file || f), webUrl: PAGES + (def.files[0].file || def.files[0]) },
    lessons,
  });
}

async function buildPathway(def) {
  const playlistUrl = def.playlistUrl || PLAYLIST + def.playlist;
  const parsed = parsePathwayPage(await fetchPage(def.file), { playlistUrl });
  (def.stagePlaylists || []).forEach((id, i) => {
    const lesson = parsed.lessons[i + 1];
    if (lesson) lesson.resourceUrl = PLAYLIST + id;
  });
  if (def.extraPlaylists?.length) {
    const last = parsed.lessons[parsed.lessons.length - 1];
    last.contentBody += `\n<h3>Extra practice</h3><ul>${def.extraPlaylists
      .map((p) => `<li><a href="${PLAYLIST}${p.id}">${p.label} (Microsoft AI Skills Navigator)</a></li>`)
      .join("")}</ul>`;
  }
  return course({
    courseId: def.courseId,
    title: def.title || parsed.title,
    description: parsed.description,
    level: "Beginner → Advanced",
    estimatedDuration: `${parsed.lessons.length - 1} modules`,
    source: { type: "github", file: def.file, webUrl: PAGES + def.file, playlistUrl },
    lessons: parsed.lessons,
  });
}

/** The "200 AI Business Ideas Training" page: intro video + How We Rank. */
async function buildBusinessIdeas() {
  const parsed = parseSectionPage(await fetchPage("HowWeRank200Hustles.html"), {
    skip: /payment|frequently asked/i,
  });
  const lessons = parsed.lessons.filter((l) => l.contentBody.length > 200);
  lessons.unshift({
    lessonId: "intro-video",
    title: "Introduction to the 200 AI Business Ideas",
    lessonOrder: 0,
    duration: "",
    objective: "Understand what the 200 AI Hustles programme is and how to use it.",
    contentBody:
      "<p>Start with the introduction video, then learn the method we use to rank every one of the 200 AI hustle businesses.</p>" +
      "<p>Once you know how to judge an opportunity, open the <strong>Hustle</strong> courses in My Courses to build one step by step.</p>",
    completionType: "button",
    videoAssetId: "",
    imageAssetId: "",
    workbookAssetId: "",
    reflectionQuestion: "",
    published: true,
    resourceUrl: "https://www.youtube.com/watch?v=wfHO6ycByf4",
    resourceLabel: "Watch the introduction video",
  });
  lessons.forEach((l, i) => {
    l.lessonId = i === 0 ? l.lessonId : `part-${i}`;
    l.lessonOrder = i + 1;
  });
  return course({
    courseId: "200-ai-business-ideas",
    title: "200 AI Business Ideas Training",
    description: parsed.description,
    level: "Beginner",
    category: "200 AI Hustles",
    source: { type: "github", file: "HowWeRank200Hustles.html", webUrl: PAGES + "HowWeRank200Hustles.html" },
    lessons,
  });
}

/** Every course above; one failure skips that course, not the rest. */
async function fetchLibraryCourses(log = () => {}) {
  const builders = [
    ...LESSON_COURSES.map((d) => [d.courseId, () => buildLessonCourse(d)]),
    ...PATHWAYS.map((d) => [d.courseId, () => buildPathway(d)]),
    ["200-ai-business-ideas", buildBusinessIdeas],
  ];
  const courses = [];
  for (const [id, build] of builders) {
    try {
      const c = await build();
      if (!c.lessons.length) {
        log(`Skipped ${id}: no lessons found`);
        continue;
      }
      courses.push(c);
      log(`Imported "${c.title}" (${c.lessons.length} lessons)`);
    } catch (err) {
      log(`Skipped ${id}: ${err.message}`);
    }
  }
  return courses;
}

module.exports = { fetchLibraryCourses, LESSON_COURSES, PATHWAYS };
