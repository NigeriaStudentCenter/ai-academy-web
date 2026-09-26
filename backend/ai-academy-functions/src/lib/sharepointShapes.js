// Course shapes on the AI Academy site that don't use "MODULE n" banners:
//  • video courses   — one page; each Video web part (with the text before it)
//                      is a lesson (AI Essential, Meta Business Agent…)
//  • programmes      — an overview page plus one page per unit (AI Engineering)
//  • multi-page      — an intro page plus one page per topic (Sales)
// Lessons carry `videoPath` (a SharePoint file path, turned into a signed URL
// when served) and `assessmentUrl` (a Microsoft Forms link) where present.

const { plain, textToHtml, sentenceCase, stripTags, webParts, BANNER_TYPE, slug } =
  require("./sharepointParser");

/** A page as a flat list of the blocks the app can use. */
function pageBlocks(page) {
  const blocks = [];
  for (const part of webParts(page)) {
    const props = part.data?.properties || {};
    const title = part.data?.title;
    if (part.innerHtml !== undefined) {
      const lines = stripTags(part.innerHtml).split("\n").map(plain).filter(Boolean);
      if (lines.length) blocks.push({ type: "text", lines });
    } else if (title === "Video" && props.rootFolder) {
      blocks.push({ type: "video", path: props.rootFolder });
    } else if (title === "Microsoft Forms") {
      const link = (part.data?.serverProcessedContent?.links || []).find((l) => l.key === "formURL");
      if (link) blocks.push({ type: "form", url: link.value });
    } else if (part.webPartType === BANNER_TYPE && props.title) {
      blocks.push({ type: "title", title: plain(props.title) });
    }
  }
  return blocks;
}

const textHtml = (lines) => textToHtml(lines.join("<br>"));

/** "What is AI.mp4" → "What is AI" */
function videoTitle(path) {
  return decodeURIComponent(path.split("/").pop() || "")
    .replace(/\.[a-z0-9]+$/i, "")
    .trim();
}

/** Finds "6 hours · Beginner · …" / "24 weeks · 6 months · …" in the first lines. */
function findMeta(lines) {
  for (const line of lines.slice(0, 4)) {
    const m = line.match(/^(\d+)\s*(minutes?|hours?|weeks?)\s*[·•]\s*([^·•]+)/i);
    if (m) {
      return {
        duration: `${m[1]} ${m[2].toLowerCase().replace(/s?$/, "s")}`.replace(/^1 (\w+)s$/, "1 $1"),
        level: /beginner|intermediate|advanced/i.test(m[3]) ? plain(m[3]) : "",
        line,
      };
    }
  }
  return null;
}

/** Text after a heading such as "LESSON OUTCOME". */
function after(lines, heading) {
  const i = lines.findIndex((l) => heading.test(l));
  return i >= 0 ? lines[i + 1] || "" : "";
}

function lesson(fields) {
  return {
    duration: "",
    objective: "",
    contentBody: "",
    completionType: "button",
    videoAssetId: "",
    imageAssetId: "",
    workbookAssetId: "",
    reflectionQuestion: "",
    videoPath: "",
    assessmentUrl: "",
    published: true,
    ...fields,
  };
}

function course(fields) {
  return {
    level: "",
    estimatedDuration: "",
    certificateEligible: true,
    ...fields,
    lessonCount: fields.lessons.length,
  };
}

/** One page, one lesson per video; text before a video introduces it. */
function parseVideoCourse(page, opts) {
  const blocks = pageBlocks(page);
  const title = plain(page.title);
  const lessons = [];
  let pending = [];
  let description = "";

  for (const block of blocks) {
    if (block.type === "text") {
      // The page's own title repeated as text isn't content.
      const lines = block.lines.filter((l) => l !== title);
      if (!lines.length) continue;
      if (!description && !lessons.length) {
        description = lines.join(" ");
        // A long opening block is also the first lesson's introduction.
        if (lines.join(" ").length < 400) continue;
      }
      pending.push(lines);
    } else if (block.type === "video") {
      // The same video placed twice on a page is one lesson, not two.
      const existing = lessons.find((l) => l.videoPath === block.path);
      if (existing) {
        existing.contentBody += "\n" + pending.map(textHtml).join("\n");
        pending = [];
        continue;
      }
      lessons.push(
        lesson({
          lessonId: `video-${lessons.length + 1}`,
          title: videoTitle(block.path),
          lessonOrder: lessons.length + 1,
          contentBody: pending.map(textHtml).join("\n"),
          videoPath: block.path,
        })
      );
      pending = [];
    }
  }
  // Text after the last video (e.g. "On phones / On the web") → final lesson.
  if (pending.length) {
    if (lessons.length && pending.flat().join(" ").length < 600) {
      lessons[lessons.length - 1].contentBody += "\n" + pending.map(textHtml).join("\n");
    } else {
      lessons.push(
        lesson({
          lessonId: `video-${lessons.length + 1}`,
          title: "Putting it into practice",
          lessonOrder: lessons.length + 1,
          contentBody: pending.map(textHtml).join("\n"),
        })
      );
    }
  }

  return course({
    courseId: opts.courseId || slug(page.name || title),
    title,
    description: description.slice(0, 600),
    estimatedDuration: `${lessons.length} videos`,
    audiences: opts.audiences,
    source: { type: "sharepoint", pageId: page.id, webUrl: page.webUrl },
    lessons,
  });
}

/** A unit/topic page as one lesson. */
function pageAsLesson(page, index, opts = {}) {
  const blocks = pageBlocks(page);
  const texts = blocks.filter((b) => b.type === "text").map((b) => b.lines);
  const all = texts.flat();
  const meta = findMeta(all);
  const titleBlock = blocks.find((b) => b.type === "title");
  const video = blocks.find((b) => b.type === "video");
  const form = blocks.find((b) => b.type === "form");
  const pageTitle = plain(titleBlock?.title || page.title);

  const OUTCOME = /^(LESSON|UNIT|TOPIC) OUTCOME$/i;
  const objective = after(all, OUTCOME);

  const body = texts
    .map((lines) =>
      lines.filter(
        (l, i) =>
          l !== pageTitle &&
          l !== meta?.line &&
          !(i === 0 && /^(UNIT|TOPIC)\s+\d+\b/.test(l)) && // "UNIT 01 · PHASE 1 · …" kicker
          // The outcome is shown as the lesson's Goal card, not repeated in the body.
          !OUTCOME.test(l) &&
          !(objective && l === objective && OUTCOME.test(lines[i - 1] || ""))
      )
    )
    .filter((lines) => lines.length)
    .map(textHtml)
    .join("\n");

  return lesson({
    lessonId: opts.lessonId || `unit-${index + 1}`,
    title: pageTitle.replace(/^Unit\s+0?(\d+)\s*[·•]\s*/i, "Unit $1 · "),
    lessonOrder: index + 1,
    duration: meta?.duration || "",
    objective,
    contentBody: body,
    videoPath: video?.path || "",
    assessmentUrl: form?.url || "",
  });
}

/** Overview page + unit pages → one programme course. */
function parseProgramme(overview, unitPages, opts) {
  const lines = pageBlocks(overview)
    .filter((b) => b.type === "text")
    .flatMap((b) => b.lines);
  const meta = findMeta(lines);
  const description =
    lines.find((l) => l.length > 60 && l !== l.toUpperCase() && l !== meta?.line) || "";
  return course({
    courseId: opts.courseId,
    title: plain(overview.title).replace(/\s+Programme$/i, " Programme"),
    description,
    outcome: after(lines, /^PROGRAMME OUTCOME$/i),
    level: "Beginner → Advanced",
    estimatedDuration: meta?.duration || `${unitPages.length} units`,
    audiences: opts.audiences,
    source: { type: "sharepoint", pageId: overview.id, webUrl: overview.webUrl },
    lessons: unitPages.map((p, i) => pageAsLesson(p, i)),
  });
}

/**
 * Intro page + topic pages. The intro's own video (if any) is the first
 * lesson; each topic page is a lesson titled by the page.
 */
function parseMultiPageCourse(intro, topicPages, opts) {
  const blocks = pageBlocks(intro);
  const texts = blocks.filter((b) => b.type === "text").map((b) => b.lines);
  const introVideo = blocks.find((b) => b.type === "video");
  const lessons = [];
  if (introVideo) {
    lessons.push(
      lesson({
        lessonId: "topic-1",
        title: videoTitle(introVideo.path),
        lessonOrder: 1,
        contentBody: texts.map(textHtml).join("\n"),
        videoPath: introVideo.path,
      })
    );
  }
  topicPages.forEach((page) => {
    const l = pageAsLesson(page, lessons.length, { lessonId: `topic-${lessons.length + 1}` });
    l.title = (opts.titleFixes || {})[l.title] || l.title;
    if (!l.contentBody && l.videoPath) {
      l.contentBody = `<p>Watch the ${l.title.toLowerCase()} video, then note two ideas you will use in your next sales conversation.</p>`;
    }
    lessons.push(l);
  });
  return course({
    courseId: opts.courseId,
    title: plain(intro.title),
    description: (texts[0] || []).join(" ").slice(0, 600),
    estimatedDuration: `${lessons.length} topics`,
    audiences: opts.audiences,
    source: { type: "sharepoint", pageId: intro.id, webUrl: intro.webUrl },
    lessons,
  });
}

module.exports = { pageBlocks, parseVideoCourse, parseProgramme, parseMultiPageCourse, videoTitle };
