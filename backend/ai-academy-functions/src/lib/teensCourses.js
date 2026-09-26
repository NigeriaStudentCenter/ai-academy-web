// AI Academy for Teens courses, read from the Teens Academy SharePoint site
// (sites/TeenSkills). Pages are rich text plus Embed web parts:
//  • Using AI Safely & Wisely — required first; each h2 part is a lesson
//  • Tracks 1–4               — each "Module n" (h1), the track project (h2)
//                               and the assessment (h1 + embedded form) are lessons
//  • Social-Emotional Learning — the overview page plus one lesson per SEL page
// Prompts are <pre> blocks (→ copyable prompt cards); embedded assessments
// (assessment.html?track=n) become the lesson's assessment link.

const { parse } = require("node-html-parser");
const { webParts } = require("./sharepointParser");

const TEEN_SITE_ID =
  "bsoed.sharepoint.com,d1b73a75-f1d3-4e33-b32e-5d580fa1cd13,990e4e7e-767b-41d5-bdbb-a133504c4f59";
const TEENS = ["teens"];

const COURSES = [
  {
    courseId: "teens-ai-safety",
    title: "Using AI Safely & Wisely",
    pages: ["AI-Safety-Using-AI-Wisely.aspx"],
    split: (tag) => tag === "h2",
    level: "Start here",
  },
  ...[
    ["teens-track-1", "Track-1-AI-Foundations.aspx"],
    ["teens-track-2", "Track-2-Prompt-Engineering.aspx"],
    ["teens-track-3", "Track-3-Build-with-AI.aspx"],
    ["teens-track-4", "Track-4-AI-for-Creativity.aspx"],
  ].map(([courseId, page]) => ({
    courseId,
    pages: [page],
    // Graph's canvasLayout omits some "Module n" headings, but every
    // sub-lesson ("1.1 …", h3) is there — each has its own goal, prompt,
    // activity and quick check, so each is a lesson.
    split: (tag, text) =>
      (tag === "h3" && /^\d+\.\d+\s/.test(text)) ||
      (/^h[12]$/.test(tag) && /project|assessment|answer key/i.test(text)),
    track: true,
    level: "Beginner",
  })),
  {
    courseId: "teens-sel",
    title: "Social-Emotional Learning",
    pages: [
      "SEL-Social-Emotional-Learning.aspx",
      "SEL-1-Self-Awareness.aspx",
      "SEL-2-Self-Management.aspx",
      "SEL-3-Social-Awareness.aspx",
      "SEL-4-Relationship-Skills.aspx",
      "SEL-5-Responsible-Decision-Making.aspx",
      "SEL-6-Stress-Management.aspx",
      "SEL-7-Conflict-Resolution.aspx",
    ],
    split: null, // one lesson per page
    level: "All levels",
    // The overview page is written for parents; learners get their own line.
    description:
      "The skills school leaves out: understanding your feelings, reading other people, working in a team, handling pressure and resolving conflict — seven modules, each with tasks and a badge.",
  },
];

const clean = (s) =>
  String(s || "")
    .replace(/&#160;|&nbsp;|\u00a0/g, " ")
    .replace(/&#58;/g, ":")
    .replace(/\s+/g, " ")
    .trim();

/** The iframe src inside an Embed web part, if any. */
function embedSrc(part) {
  const code = part.data?.properties?.embedCode || "";
  const m = code.match(/src=\\?"([^"\\]+)/);
  return m ? m[1].replace(/&amp;/g, "&") : "";
}

/**
 * The page as one HTML stream in reading order: text parts as they are,
 * embedded assessments as <p data-assessment="…"> markers. The Prompt Lab
 * embeds repeat the links already under each prompt, so they are dropped.
 */
function pageStream(page) {
  return webParts(page)
    .map((part) => {
      if (part.innerHtml !== undefined) return part.innerHtml;
      const src = embedSrc(part);
      if (/assessment\.html/.test(src)) return `<p data-assessment="${src}"></p>`;
      return "";
    })
    .join("\n");
}

/** Content HTML the app renders. */
function tidy(html) {
  const root = parse(html);
  root.querySelectorAll("pre").forEach((n) =>
    n.replaceWith(`<blockquote><p>${n.innerHTML.trim().replace(/\n/g, " ")}</p></blockquote>`)
  );
  // Site navigation line ("Curriculum home | Track 1 | …") isn't lesson content.
  root.querySelectorAll("p").forEach((p) => {
    if (/Curriculum home\s*\|/.test(p.text) || !clean(p.text) && !p.querySelector("img")) p.remove();
  });
  return root
    .toString()
    .replace(/<p data-assessment="[^"]*"><\/p>/g, "")
    .replace(/\s(style|class|id|data-[a-z-]+)="[^"]*"/g, "")
    .replace(/<\/?span>/g, "")
    .replace(/&#58;/g, ":")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** Splits a stream at the headings `split` accepts → [{heading, html}]. */
function chunks(html, split) {
  const root = parse(html);
  const out = [{ heading: "", html: "" }];
  for (const node of root.childNodes) {
    const tag = node.rawTagName?.toLowerCase();
    const text = clean(node.text);
    if (tag && /^h[1-4]$/.test(tag) && split(tag, text)) {
      out.push({ heading: text, html: "" });
    } else {
      out[out.length - 1].html += node.toString();
    }
  }
  return out;
}

const textLength = (html) => clean(parse(html).text).length;

/** Drops "Module n · …" dividers and decorative images between lessons. */
function stripModuleChrome(html) {
  const root = parse(html);
  root.querySelectorAll("h1, h2").forEach((h) => {
    if (/^Module\s+\d/i.test(clean(h.text))) h.remove();
  });
  root.querySelectorAll(".imagePlugin").forEach((n) => n.remove());
  return root.toString();
}

function lesson(fields) {
  return {
    duration: "",
    objective: "",
    completionType: "button",
    videoAssetId: "",
    imageAssetId: "",
    workbookAssetId: "",
    reflectionQuestion: "",
    published: true,
    ...fields,
  };
}

function lessonFromChunk(chunk, order) {
  const assessment = (chunk.html.match(/data-assessment="([^"]+)"/) || [])[1] || "";
  let body = tidy(chunk.html);
  if (textLength(body) < 40 && assessment) {
    body = "<p>Complete the assessment to check your understanding and earn this track's badge.</p>";
  } else if (assessment) {
    body = "<p>Answer these questions in the assessment form to earn this track's badge.</p>\n" + body;
  }
  // "Goal. …" is shown as the lesson's Goal card, so it leaves the body.
  const root = parse(body);
  const first = root.querySelector("p");
  const goal = (first?.text || "").match(/^\s*Goal\.\s*(.+)$/);
  if (goal) {
    first.remove();
    body = root.toString();
  }
  return lesson({
    lessonId: `lesson-${order}`,
    title: chunk.heading,
    lessonOrder: order,
    objective: goal ? clean(goal[1]) : "",
    contentBody: body,
    assessmentUrl: assessment,
  });
}

/** The first real paragraph of the opening text. */
function describe(html) {
  const p = parse(html)
    .querySelectorAll("p")
    .map((n) => clean(n.text))
    .find((t) => t.length > 80 && !/Curriculum home/.test(t));
  return p || "";
}

/**
 * @param pages  Map name → page (with canvasLayout)
 */
function buildTeenCourse(def, pages) {
  const loaded = def.pages.map((n) => pages.get(n)).filter(Boolean);
  if (!loaded.length) return null;
  const first = loaded[0];
  let lessons = [];
  let description = "";

  if (def.split) {
    const [intro, ...rest] = chunks(pageStream(first), def.split)
      // Answer keys are for facilitators, never learners.
      .filter((c) => !/answer key/i.test(c.heading))
      .map((c) => ({ ...c, html: stripModuleChrome(c.html) }));
    description = describe(intro.html);

    if (def.track) {
      // The embedded assessment becomes its own final lesson, together with
      // any printed "Track n Assessment" questions.
      let assessmentUrl = "";
      let assessmentHtml = "";
      const lessonsChunks = [];
      for (const c of rest) {
        const m = c.html.match(/data-assessment="([^"]+)"/);
        if (m) assessmentUrl = m[1];
        if (/assessment/i.test(c.heading)) assessmentHtml += c.html;
        else lessonsChunks.push({ ...c, html: c.html.replace(/<p data-assessment="[^"]*"><\/p>/g, "") });
      }
      lessonsChunks.forEach((c) => lessons.push(lessonFromChunk(c, lessons.length + 1)));
      if (assessmentUrl) {
        const l = lessonFromChunk(
          { heading: "Track assessment", html: assessmentHtml || `<p data-assessment="${assessmentUrl}"></p>` },
          lessons.length + 1
        );
        l.assessmentUrl = assessmentUrl;
        lessons.push(l);
      }
    } else {
      rest.forEach((c) => lessons.push(lessonFromChunk(c, lessons.length + 1)));
      // The first section repeats the course title: it is the "why" lesson.
      if (lessons[0] && clean(lessons[0].title) === clean(def.title || first.title)) {
        lessons[0].title = "Why this comes first";
        description = description || describe(lessons[0].contentBody);
      }
    }
  } else {
    loaded.forEach((page, i) => {
      const stream = pageStream(page);
      const heading = clean(parse(stream).querySelector("h2, h1")?.text) || clean(page.title);
      const html = stream.replace(/<h[12][^>]*>[\s\S]*?<\/h[12]>/, ""); // title shown by the app
      if (i === 0) description = describe(html);
      lessons.push(
        lessonFromChunk({ heading: i === 0 ? "Introduction" : heading, html }, lessons.length + 1)
      );
    });
  }

  lessons = lessons.map((l, i) => ({ ...l, lessonId: `lesson-${i + 1}`, lessonOrder: i + 1 }));
  return {
    courseId: def.courseId,
    title: def.title || clean(first.title),
    description: def.description || description,
    level: def.level,
    estimatedDuration: `${lessons.length} lessons`,
    certificateEligible: true,
    audiences: TEENS,
    category: "AI Academy for Teens",
    source: { type: "sharepoint", site: "TeenSkills", webUrl: first.webUrl },
    lessons,
    lessonCount: lessons.length,
  };
}

async function loadTeenPages(graph) {
  const list = await graph(
    `/sites/${TEEN_SITE_ID}/pages/microsoft.graph.sitePage?$select=id,name,title,webUrl,publishingState&$top=100`
  );
  const wanted = new Set(COURSES.flatMap((c) => c.pages));
  const pages = new Map();
  for (const summary of list.value || []) {
    if (!wanted.has(summary.name)) continue;
    const page = await graph(
      `/sites/${TEEN_SITE_ID}/pages/${summary.id}/microsoft.graph.sitePage?$expand=canvasLayout`
    );
    pages.set(summary.name, page);
  }
  return pages;
}

async function fetchTeenCourses(graph, log = () => {}) {
  const pages = await loadTeenPages(graph);
  const courses = [];
  for (const def of COURSES) {
    const course = buildTeenCourse(def, pages);
    if (!course || !course.lessons.length) {
      log(`Skipped teens course ${def.courseId}: page not found or empty`);
      continue;
    }
    courses.push(course);
    log(`Imported "${course.title}" (${course.lessons.length} lessons, teens)`);
  }
  return courses;
}

module.exports = { fetchTeenCourses, loadTeenPages, buildTeenCourse, pageStream, chunks, tidy, COURSES, TEEN_SITE_ID };
