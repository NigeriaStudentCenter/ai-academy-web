// Turns a "200 AI Hustles" page (NigeriaStudentCenter/AI-Academy repo,
// e.g. Hustle01_ContentCreation.html) into an AI Academy course:
// each <details class="lesson-block"> becomes a lesson, and the closing
// "Don't Do This", "AI Business Coach" and assessed-project sections become a
// final "Final project" lesson. Interactive bits (copy buttons, checkboxes,
// the scripted quiz) are dropped — the app has its own completion tracking.

const { parse } = require("node-html-parser");

function clean(text) {
  return String(text || "").replace(/\s+/g, " ").trim();
}

function slug(s) {
  return clean(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

/** Keep only content markup the app renders; drop page chrome and styling. */
function contentHtml(node) {
  const el = node.clone();
  el.querySelectorAll("button, input, label, script, style, .lesson-complete").forEach((n) => n.remove());
  // Prompt boxes → quoted, copyable-looking blocks.
  el.querySelectorAll(".prompt-box").forEach((n) => {
    n.replaceWith(`<blockquote><p>${n.innerHTML.trim()}</p></blockquote>`);
  });
  // Tool pills → one readable line.
  el.querySelectorAll(".lesson-part").forEach((part) => {
    const pills = part.querySelectorAll(".tool-pill").map((p) => clean(p.text));
    if (pills.length) {
      part.querySelectorAll(".tool-pill").forEach((p) => p.remove());
      part.insertAdjacentHTML("beforeend", `<p>${pills.join(" · ")}</p>`);
    }
  });
  // Part labels ("Explanation", "Practical Exercise"…) → headings.
  el.querySelectorAll(".part-label").forEach((n) => n.replaceWith(`<h3>${clean(n.text)}</h3>`));
  let html = el.innerHTML;
  html = html
    .replace(/\sstyle="[^"]*"/g, "")
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/\sid="[^"]*"/g, "")
    .replace(/\sdata-[a-z-]+="[^"]*"/g, "")
    .replace(/<\/?(div|span|section)>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\n\s*\n+/g, "\n");
  return html.trim();
}

/**
 * @param html      page source
 * @param opts      { fileName, audiences, sourceUrl }
 */
function parseHustlePage(html, opts) {
  const root = parse(html);
  const hero = root.querySelector("header, .hero, section");
  const h1 = root.querySelector("h1");
  const pageTitle = clean(root.querySelector("title")?.text).replace(/\s+—\s+BSOE AI Academy$/, "");

  // "Hustle 1: AI-Assisted Content Creation" is the course name; the hero h1
  // ("Build an AI-Assisted Content Creation Hustle") reads as the promise.
  const title = pageTitle || clean(h1?.text);
  const heroParas = (h1?.parentNode || hero)?.querySelectorAll("p") || [];
  const description = clean(heroParas[0]?.text);

  const lessons = root.querySelectorAll("details.lesson-block").map((block, i) => {
    const number = Number(block.getAttribute("data-lesson")) || i + 1;
    const lessonTitle = clean(block.querySelector("h3")?.text);
    const tag = clean(block.querySelector("summary .tag")?.text);
    const body = block.querySelector(".lesson-body");
    return {
      lessonId: `lesson-${number}`,
      title: lessonTitle,
      lessonOrder: number,
      duration: "",
      objective: "",
      // The lesson's subtitle ("The Niche Formula") leads the lesson.
      contentBody: (tag ? `<p><em>${tag}</em></p>\n` : "") + (body ? contentHtml(body) : ""),
      completionType: "button",
      videoAssetId: "",
      imageAssetId: "",
      workbookAssetId: "",
      reflectionQuestion: "",
      published: true,
    };
  });

  // Closing sections → one final lesson.
  const closing = ["#dontdo", "#coach", "#project"]
    .map((sel) => root.querySelector(sel))
    .filter(Boolean)
    .map((section) => {
      const heading = clean(section.querySelector("h2")?.text);
      const intro = section.querySelector(".section-head p");
      const inner = section.clone();
      inner.querySelectorAll(".section-head").forEach((n) => n.remove());
      return `<h3>${heading}</h3>${intro ? `<p>${intro.innerHTML}</p>` : ""}${contentHtml(inner)}`;
    });
  if (closing.length) {
    lessons.push({
      lessonId: "final-project",
      title: "Final project",
      lessonOrder: lessons.length + 1,
      duration: "",
      objective: "Bring every lesson together into your own working hustle.",
      contentBody: closing.join("\n"),
      completionType: "button",
      videoAssetId: "",
      imageAssetId: "",
      workbookAssetId: "",
      reflectionQuestion: "",
      published: true,
    });
  }

  const number = (opts.fileName || "").match(/^Hustle0*(\d+)_/);
  return {
    courseId: `hustle-${number ? number[1] : slug(title)}`,
    title,
    description,
    outcome: clean(h1?.text),
    level: "Beginner → Intermediate",
    estimatedDuration: `${lessons.length} lessons`,
    lessonCount: lessons.length,
    certificateEligible: true,
    audiences: opts.audiences,
    category: "200 AI Hustles",
    source: { type: "github", file: opts.fileName, webUrl: opts.sourceUrl },
    lessons,
  };
}

module.exports = { parseHustlePage };
