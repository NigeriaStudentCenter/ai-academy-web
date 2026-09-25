// Turns a SharePoint modern page (Graph sitePage with canvasLayout) into an
// AI Academy course: the intro becomes the course description and every
// "MODULE n · Title" banner starts a lesson made of the web parts under it.

const BANNER_TYPE = "cbe7b0a9-3504-44dd-a3a3-0e5cacd07788"; // title area / banner
const MARKDOWN_TYPE = "1ef5ed11-ce7b-44be-bc5e-4abd55101d16";
const MODULE_RE = /^MODULE\s+(\d+)\s*[·•:\-–—]\s*(.+)$/i;

/** Mathematical bold letters (𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥) → plain text, and tidy whitespace. */
function plain(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/ /g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function stripTags(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Brand and acronym spellings to restore after sentence-casing ALL-CAPS titles.
const KNOWN_WORDS = [
  "AI", "GPT", "GPTs", "ChatGPT", "Claude", "Anthropic", "Copilot", "Microsoft",
  "Gemini", "Google", "NotebookLM", "Perplexity", "Gamma", "Runway", "ML",
  "ElevenLabs", "Adobe", "Firefly", "UK", "API", "APIs", "SEO", "GEO", "AEO",
  "CLEAR", "TRACE", "Gen-4.5", "Excel", "Word", "PowerPoint", "Teams", "Outlook",
];

/** "FIND YOUR WAY AROUND CHATGPT" → "Find your way around ChatGPT" */
function sentenceCase(upper, extraWords = []) {
  const known = new Map(
    [...KNOWN_WORDS, ...extraWords].map((w) => [w.toLowerCase(), w])
  );
  const words = plain(upper).toLowerCase().split(" ");
  return words
    .map((w, i) => {
      const core = w.replace(/^[^a-z0-9]+|[^a-z0-9.\-]+$/g, "");
      const fixed = known.get(core);
      const word = fixed ? w.replace(core, fixed) : w;
      return i === 0 ? word.replace(/^\w/, (c) => c.toUpperCase()) : word;
    })
    .join(" ");
}

function slug(s) {
  return plain(s)
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\.aspx$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Flatten sections → columns → web parts, in reading order. */
function webParts(page) {
  const out = [];
  for (const section of page.canvasLayout?.horizontalSections || []) {
    for (const column of section.columns || []) {
      for (const part of column.webparts || []) out.push(part);
    }
  }
  return out;
}

/**
 * SharePoint text parts are one <p> with <br> line breaks. Rebuild them as
 * readable HTML: short title-like lines become headings, "•" lines become
 * lists, numbered "1." lines become ordered lists.
 */
function textToHtml(innerHtml) {
  const lines = stripTags(innerHtml)
    .split("\n")
    .map(plain)
    .filter(Boolean);

  const html = [];
  let list = null; // "ul" | "ol"
  const closeList = () => {
    if (list) html.push(`</${list}>`);
    list = null;
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^[•\-□]\s*(.+)$/);
    const numbered = line.match(/^(\d+)\.\s+(.+)$/);
    if (bullet) {
      if (list !== "ul") { closeList(); html.push("<ul>"); list = "ul"; }
      html.push(`<li>${escapeHtml(bullet[1])}</li>`);
      return;
    }
    if (numbered) {
      if (list !== "ol") { closeList(); html.push("<ol>"); list = "ol"; }
      html.push(`<li>${escapeHtml(numbered[2])}</li>`);
      return;
    }
    closeList();
    const next = lines[i + 1];
    const looksLikeHeading =
      line.length <= 48 &&
      !/[.?!:;,"”]$/.test(line) &&
      next !== undefined &&
      !/^[A-Z]\s—/.test(line); // keep "C — Context: …" framework lines as text
    if (looksLikeHeading) html.push(`<h3>${escapeHtml(line)}</h3>`);
    else html.push(`<p>${escapeHtml(line)}</p>`);
  });
  closeList();
  return html.join("\n");
}

/** Markdown web parts carry pre-rendered HTML (mostly course illustrations). */
function markdownHtml(part, rewriteImage) {
  const html =
    part.data?.serverProcessedContent?.htmlStrings?.find((h) => h.key === "html")
      ?.value || "";
  return html
    .replace(/\sclass="[^"]*"/g, "")
    .replace(/<div>\s*(<img[^>]*>)\s*<\/div>/g, "$1")
    .replace(/<p><\/p>/g, "")
    .replace(/<h4\b[^>]*>/g, "<h3>")
    .replace(/<\/h4>/g, "</h3>")
    .replace(/src="([^"]+)"/g, (_, src) => `src="${rewriteImage(src)}"`);
}

/** "60 MINUTES · BEGINNER → INTERMEDIATE" → { duration, level } */
function parseMeta(firstLine) {
  const m = plain(firstLine).match(/^(\d+)\s*(MINUTES?|HOURS?)\s*[·•]\s*(.+)$/i);
  if (!m) return null;
  const unit = m[2].toLowerCase().startsWith("hour") ? "hours" : "minutes";
  const level = m[3]
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return { duration: `${m[1]} ${unit}`, level };
}

/**
 * @param page Graph sitePage with canvasLayout expanded
 * @param opts { courseId?, audiences, rewriteImage(src) → url }
 */
function parseCoursePage(page, opts) {
  const rewriteImage = opts.rewriteImage || ((s) => s);
  const parts = webParts(page);

  let title = plain(page.title);
  const introLines = [];
  const introHtml = [];
  const lessons = [];
  let current = null;

  for (const part of parts) {
    const type = part.webPartType;
    const props = part.data?.properties || {};

    if (type === BANNER_TYPE) {
      const bannerTitle = plain(props.title);
      const mod = bannerTitle.match(MODULE_RE);
      if (mod) {
        current = {
          lessonId: `module-${mod[1]}`,
          title: sentenceCase(mod[2], plain(page.title).split(" ")),
          lessonOrder: Number(mod[1]),
          duration: "",
          level: "",
          objective: "",
          htmlParts: [],
          reflectionQuestion: "",
        };
        lessons.push(current);
      } else if (!lessons.length && bannerTitle) {
        title = bannerTitle; // page title area
      }
      continue;
    }

    if (part.innerHtml !== undefined) {
      // Text web part
      const lines = stripTags(part.innerHtml).split("\n").map(plain).filter(Boolean);
      if (!current) {
        introLines.push(...lines);
        continue;
      }
      if (!current.duration && lines.length) {
        const meta = parseMeta(lines[0]);
        if (meta) {
          current.duration = meta.duration;
          current.level = meta.level;
          lines.shift();
        }
      }
      // Objective: text after a "Learning objectives" heading, else first line.
      if (!current.objective) {
        const idx = lines.findIndex((l) => /^learning objectives?$/i.test(l));
        current.objective = idx >= 0 ? lines[idx + 1] || "" : "";
      }
      // Reflection: the "Knowledge check" questions, if present.
      const kc = lines.findIndex((l) => /^knowledge check$/i.test(l));
      if (kc >= 0 && lines[kc + 1]) current.reflectionQuestion = lines[kc + 1];

      current.htmlParts.push(textToHtml(lines.join("<br>")));
      continue;
    }

    if (type === MARKDOWN_TYPE) {
      const html = markdownHtml(part, rewriteImage);
      if (current) current.htmlParts.push(html);
      else introHtml.push(html);
    }
  }

  // Intro: "FROM … TO …" tagline, "10 HOURS • BEGINNER → ADVANCED • 8 MODULES",
  // then a description paragraph, then COURSE OUTCOME.
  let estimatedDuration = "";
  let level = "";
  const descLines = [];
  for (const line of introLines) {
    const hours = line.match(/^(\d+)\s*HOURS?\s*[·•]\s*([^·•]+)/i);
    if (hours) {
      estimatedDuration = `${hours[1]} hours`;
      level = plain(hours[2]).toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
      continue;
    }
    if (/^(FROM\b.*|COURSE OUTCOME|INTERFACE NOTE)$/i.test(line) || line === line.toUpperCase()) continue;
    descLines.push(line);
  }

  const courseId = opts.courseId || slug(page.name || title);
  return {
    courseId,
    title,
    description: descLines[0] || "",
    outcome: descLines[1] || "",
    level,
    estimatedDuration,
    lessonCount: lessons.length,
    certificateEligible: true,
    audiences: opts.audiences,
    source: { type: "sharepoint", pageId: page.id, webUrl: page.webUrl, lastModified: page.lastModifiedDateTime },
    heroHtml: introHtml.join("\n"),
    lessons: lessons.map((l) => ({
      lessonId: l.lessonId,
      title: l.title,
      lessonOrder: l.lessonOrder,
      duration: l.duration,
      objective: l.objective,
      contentBody: l.htmlParts.join("\n"),
      completionType: "button",
      videoAssetId: "",
      imageAssetId: "",
      workbookAssetId: "",
      reflectionQuestion: l.reflectionQuestion,
      published: true,
    })),
  };
}

module.exports = { parseCoursePage, plain, slug, textToHtml, sentenceCase };
