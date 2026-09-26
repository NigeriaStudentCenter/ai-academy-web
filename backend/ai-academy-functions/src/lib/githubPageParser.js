// Parsers for the non-Hustle course pages in the NigeriaStudentCenter/AI-Academy
// repo that the SharePoint "Courses" page links to:
//  • lesson pages   — one lesson each (BeatATS.html, AIskillsselection.html…):
//                     header h1 + chips, callouts, numbered h2 sections, prompts,
//                     quiz and a Prove-It task
//  • pathway pages  — role courses (AIForAdmins.html…) whose modules list
//                     Microsoft AI Skills Navigator items; the learning itself
//                     happens in the linked Microsoft playlist
//  • section pages  — long single pages (HowWeRank200Hustles.html) where each
//                     <section> with an h2 becomes a lesson

const { parse } = require("node-html-parser");

function clean(text) {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Keep only content markup the app renders; drop page chrome and styling. */
function tidy(el) {
  el.querySelectorAll("script, style, button, input, label, footer, nav, .copy, .topbar").forEach((n) =>
    n.remove()
  );
  // Placeholder assessment links ("your-form-link") go nowhere.
  el.querySelectorAll(".assess").forEach((n) => {
    const a = n.querySelector("a");
    if (!a || /your-form-link/.test(a.getAttribute("href") || "")) n.remove();
  });
  // Prompt boxes → blockquotes (copyable prompt cards in the app).
  el.querySelectorAll(".prompt").forEach((n) => n.replaceWith(`<blockquote><p>${n.innerHTML.trim()}</p></blockquote>`));
  // Quiz / glossary <details> → question (bold) + answer.
  el.querySelectorAll("details").forEach((d) => {
    const summary = d.querySelector("summary");
    const q = summary ? summary.innerHTML.trim() : "";
    summary?.remove();
    d.replaceWith(`<p><strong>${q}</strong></p>${d.innerHTML}`);
  });
  // "Open" buttons under a tool card → "Open ChatGPT".
  el.querySelectorAll("a.btn").forEach((a) => {
    const tool = clean(a.parentNode?.querySelector("h3")?.text);
    const label = clean(a.text);
    if (!a.getAttribute("href") || a.getAttribute("href").startsWith("#")) return a.remove();
    a.set_content(tool && /^(open|create|sign)/i.test(label) ? `${label} · ${tool}` : label);
  });
  // "<span class=n>1</span>Title" → "1 · Title"
  el.querySelectorAll("h2 .n, h3 .n").forEach((n) => {
    const t = clean(n.text);
    n.replaceWith(t && t !== "P" ? `${t} · ` : "");
  });
  // Callouts and tips read as paragraphs.
  el.querySelectorAll(".callout, .tip, .frame, .cv, .note, .lab").forEach((n) =>
    n.replaceWith(`<p>${n.innerHTML.trim()}</p>`)
  );
  // Remove in-page anchors ("#lessons") that go nowhere in the app.
  el.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (!/^https?:/.test(href)) a.replaceWith(a.innerHTML);
  });
  return el.innerHTML
    .replace(/\s(style|class|id|target|rel|data-[a-z-]+)="[^"]*"/g, "")
    .replace(/<\/?(div|span|section|header|main|article)>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/<p>\s*<\/p>/g, "")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

/** A single lesson page (header + main). */
function parseLessonPage(html, opts = {}) {
  const root = parse(html);
  const title = clean(root.querySelector("h1")?.text) || clean(root.querySelector("title")?.text);
  const chips = root.querySelectorAll("header .chip, .meta .chip").map((c) => clean(c.text));
  const duration = (chips.find((c) => /min|hour|hr/i.test(c)) || "").replace(/^~/, "");
  const level = chips.find((c) => /beginner|intermediate|advanced/i.test(c)) || "";
  const outcome = root.querySelector(".callout.out");
  // "What you'll be able to do: upload your CV…" → "Upload your CV…"
  const objective = clean(outcome?.text)
    .replace(/^What you['’]ll be able to do:\s*/i, "")
    .replace(/^[a-z]/, (c) => c.toUpperCase());
  const main = (root.querySelector("main") || root.querySelector("body"))?.clone();
  if (!main) return null;
  main.querySelectorAll("h1, header, .callout.out").forEach((n) => n.remove());
  return {
    lessonId: opts.lessonId,
    title: (opts.titleFix || ((t) => t))(title),
    lessonOrder: opts.lessonOrder,
    duration,
    level,
    objective,
    contentBody: tidy(main),
    completionType: "button",
    videoAssetId: "",
    imageAssetId: "",
    workbookAssetId: "",
    reflectionQuestion: "",
    published: true,
  };
}

/** A course hub/landing page: title and the one-line promise. */
function parseHub(html) {
  const root = parse(html);
  const kicker = clean(root.querySelector(".lbl")?.text).replace(/^AI Academy\s*·\s*/, "");
  const lead = root.querySelector("header p, .hero p, main p");
  return { title: kicker || clean(root.querySelector("title")?.text), description: clean(lead?.text) };
}

/** Role pathway page: each module (details.stage-track) becomes a lesson. */
function parsePathwayPage(html, opts) {
  const root = parse(html);
  const title = clean(root.querySelector("title")?.text)
    .replace(/\s+—\s+BSOE AI Academy$/, "")
    .replace(/\s+Course$/, "");
  const description = clean(root.querySelector(".hero-copy")?.text || root.querySelector(".hero p")?.text);
  const resource = {
    resourceUrl: opts.playlistUrl,
    resourceLabel: "Open this module in Microsoft AI Skills Navigator",
  };

  // Lesson 1: why it matters and who it's for, from the page's own sections.
  const intro = [];
  root.querySelectorAll("section.section").forEach((s) => {
    if (s.getAttribute("id") === "curriculum" || s.getAttribute("id") === "faq") return;
    const h2 = clean(s.querySelector("h2")?.text);
    if (!h2) return;
    intro.push(`<h3>${h2}</h3>`);
    const p = s.querySelector(".section-head p");
    if (p) intro.push(`<p>${clean(p.text)}</p>`);
    const cards = s.querySelectorAll(".why-card, .who-card, .flow-step");
    if (cards.length) {
      intro.push(
        "<ul>" +
          cards
            .map((c) => {
              const head = clean((c.querySelector("strong") || c.querySelector("b"))?.text);
              const body = clean((c.querySelector("p") || c.querySelector("span"))?.text);
              return `<li><strong>${head}</strong>${body ? ` — ${body}` : ""}</li>`;
            })
            .join("") +
          "</ul>"
      );
    }
  });

  const lessons = [
    {
      lessonId: "overview",
      title: "Course overview",
      lessonOrder: 1,
      objective: description,
      contentBody: intro.join("\n"),
      ...resource,
      resourceLabel: "Open the full playlist in Microsoft AI Skills Navigator",
    },
  ];

  root.querySelectorAll("details.stage-track").forEach((d) => {
    const heading = clean(d.querySelector(".stage-title b")?.text || d.querySelector("summary")?.text);
    const summary = clean(d.querySelector(".stage-title span")?.text);
    const rows = d.querySelectorAll(".lesson-row").map((r) => {
      const name = clean(r.querySelector(".lesson-title")?.text);
      const meta = r
        .querySelectorAll(".lesson-meta > span")
        .map((m) => clean(m.text))
        .filter(Boolean)
        .join(" · ");
      return `<li><strong>${name}</strong>${meta ? ` <em>(${meta})</em>` : ""}</li>`;
    });
    // Free text in the module body (e.g. Azure exam tips) besides the rows.
    const body = d.querySelector(".stage-body")?.clone();
    body?.querySelectorAll(".lesson-row").forEach((n) => n.remove());
    const extra = body ? tidy(body) : "";
    lessons.push({
      lessonId: `module-${lessons.length}`,
      title: heading.replace(/^(\d+)\s*·\s*/, "Module $1 · "),
      lessonOrder: lessons.length + 1,
      objective: summary,
      contentBody:
        (rows.length
          ? `<p>This module is made up of these Microsoft Learn items. Work through them in the playlist, then mark the module complete here.</p><ul>${rows.join("")}</ul>`
          : "") + (extra ? `\n${extra}` : ""),
      ...resource,
    });
  });

  return { title, description, lessons: lessons.map(withDefaults) };
}

/** Long single page: each <section> with an h2 becomes a lesson. */
function parseSectionPage(html, opts = {}) {
  const root = parse(html);
  const title = clean(root.querySelector("h1")?.text);
  const description = clean(root.querySelector("header p, .hero p")?.text);
  const skip = opts.skip || /^$/;
  const lessons = [];
  root.querySelectorAll("section").forEach((s) => {
    const h2 = clean(s.querySelector("h2")?.text);
    if (!h2 || skip.test(h2)) return;
    const el = s.clone();
    el.querySelector("h2")?.remove();
    const body = tidy(el);
    if (clean(parse(body).text).length < 80) return;
    const eyebrow = clean(s.querySelector(".eyebrow, .kicker, .section-head .lbl")?.text);
    lessons.push(
      withDefaults({
        lessonId: `part-${lessons.length + 1}`,
        title: (opts.titles || {})[h2] || eyebrow || h2,
        lessonOrder: lessons.length + 1,
        objective: eyebrow ? h2 : "",
        contentBody: body.replace(/<(p|div)>\s*$/, ""),
      })
    );
  });
  return { title, description, lessons };
}

function withDefaults(l) {
  return {
    duration: "",
    objective: "",
    completionType: "button",
    videoAssetId: "",
    imageAssetId: "",
    workbookAssetId: "",
    reflectionQuestion: "",
    published: true,
    ...l,
  };
}

module.exports = { parseLessonPage, parseHub, parsePathwayPage, parseSectionPage, tidy, clean };
