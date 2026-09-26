// Courses on other SharePoint sites (AI Finance, AI in HR, Financial
// Reporting/Budgeting/Internal Control, Student Business Hub, Personal
// Development, Pharmacy Assistant …). On these sites a course is a *hub page
// section* — a named collapsible section of editorial cards, or a heading
// followed by Quick links — and its lessons are the pages that section links
// to. Pages are read from the Site Pages list's CanvasContent1 (the page's
// full saved HTML); Graph's canvasLayout drops some text parts and the
// section names.

const { parse } = require("node-html-parser");

const HOST = "bsoed.sharepoint.com";
const MEDIA_EXT = /\.(mp4|m4v|mov|webm|mp3|m4a)$/i;
const DOC_EXT = /\.(pdf|docx?|pptx?|xlsx?|csv|txt)$/i;

const clean = (s) =>
  String(s || "")
    .replace(/&nbsp;|&#160;| /g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#58;/g, ":")
    .replace(/\s+/g, " ")
    .trim();

/** "/sites/X/SitePages/Some-Page.aspx?csf=1&web=1" → "Some-Page.aspx" */
function pageName(link) {
  const m = decodeURIComponent(String(link || "")).match(/\/SitePages\/([^?#]+\.aspx)/i);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------- reading

function createSiteReader(graph) {
  const siteIds = new Map();
  const pageCache = new Map();

  async function siteId(site) {
    if (!siteIds.has(site)) {
      const s = await graph(`/sites/${HOST}:/sites/${encodeURIComponent(site)}?$select=id,webUrl`);
      siteIds.set(site, s.id);
    }
    return siteIds.get(site);
  }

  /** Map FileLeafRef → { name, title, canvas, webUrl } for a site's pages. */
  async function pages(site) {
    if (pageCache.has(site)) return pageCache.get(site);
    const id = await siteId(site);
    const lists = await graph(`/sites/${id}/lists?$select=id,displayName,list&$filter=displayName eq 'Site Pages'`);
    const list = (lists.value || [])[0];
    const map = new Map();
    if (list) {
      let next = `/sites/${id}/lists/${list.id}/items?$expand=fields($select=FileLeafRef,Title,CanvasContent1)&$top=200`;
      while (next) {
        const data = await graph(next);
        for (const item of data.value || []) {
          const f = item.fields || {};
          if (!f.FileLeafRef) continue;
          map.set(f.FileLeafRef, {
            name: f.FileLeafRef,
            title: clean(f.Title),
            canvas: f.CanvasContent1 || "",
            webUrl: item.webUrl,
          });
        }
        next = data["@odata.nextLink"] ? data["@odata.nextLink"].replace("https://graph.microsoft.com/v1.0", "") : null;
      }
    }
    pageCache.set(site, map);
    return map;
  }

  return { siteId, pages };
}

// ---------------------------------------------------------------- parsing

/** A page's controls in reading order: { zone, rte, webPart }. */
function controls(canvas) {
  const root = parse(`<div>${canvas}</div>`);
  const out = [];
  for (const el of root.querySelectorAll("[data-sp-controldata]")) {
    let control = {};
    try {
      control = JSON.parse(el.getAttribute("data-sp-controldata").replace(/&quot;/g, '"'));
    } catch {
      /* keep going */
    }
    const wpEl = el.querySelector("[data-sp-webpartdata]");
    let webPart = null;
    if (wpEl) {
      try {
        webPart = JSON.parse(wpEl.getAttribute("data-sp-webpartdata").replace(/&quot;/g, '"'));
      } catch {
        webPart = null;
      }
    }
    const rteEl = el.querySelector("[data-sp-rte]");
    out.push({
      zone: clean(control.zoneGroupMetadata?.displayName),
      zoneIndex: control.position?.zoneIndex,
      rte: rteEl ? rteEl.innerHTML : null,
      webPart,
    });
  }
  return out;
}

/** Links (with a label) to other pages in a web part. */
function webPartPageLinks(wp) {
  const spc = wp?.serverProcessedContent || {};
  const label = clean(
    (spc.htmlStrings?.headline || "").replace(/<[^>]+>/g, " ") ||
      spc.searchablePlainTexts?.title ||
      wp?.properties?.title ||
      ""
  );
  const found = [];
  const walk = (v, key) => {
    if (typeof v === "string") {
      const name = pageName(v);
      if (name) found.push({ page: name, label: key && /title/i.test(key) ? clean(v) : label });
    } else if (v && typeof v === "object") {
      for (const [k, x] of Object.entries(v)) walk(x, k);
    }
  };
  walk(spc.links || {});
  // Quick links keep each item's title next to its link.
  const items = wp?.properties?.items;
  if (Array.isArray(items) && spc.searchablePlainTexts) {
    items.forEach((it, i) => {
      const t = spc.searchablePlainTexts[`items[${i}].title`];
      const l = spc.links?.[`items[${i}].sourceItem.url`];
      const name = pageName(l);
      if (name && t) {
        const f = found.find((x) => x.page === name);
        if (f) f.label = clean(t);
      }
    });
  }
  return found;
}

/**
 * A hub page's sections: [{ name, links: [{page, label}] }]. A section starts
 * at a named (collapsible) zone or at a short text heading; unnamed zones
 * without a heading continue the previous section.
 */
function hubSections(canvas) {
  const sections = [];
  let current = null;
  let lastZone = null;
  const start = (name) => {
    current = { name, links: [] };
    sections.push(current);
  };
  for (const c of controls(canvas)) {
    if (c.zone && c.zone !== lastZone) start(c.zone);
    lastZone = c.zone || lastZone;
    if (c.rte !== null) {
      const text = clean(c.rte.replace(/<[^>]+>/g, " "));
      const heading = parse(c.rte).querySelector("h1,h2,h3,h4");
      if (text && (heading || text.length <= 90) && !c.zone) start(clean(heading?.text) || text);
      continue;
    }
    if (!c.webPart) continue;
    if (!current) start("");
    for (const l of webPartPageLinks(c.webPart)) {
      if (!current.links.some((x) => x.page === l.page)) current.links.push(l);
    }
  }
  return sections.filter((s) => s.links.length);
}

module.exports = { createSiteReader, controls, hubSections, webPartPageLinks, pageName, clean, MEDIA_EXT, DOC_EXT, HOST };

// ---------------------------------------------------------------- lessons

const IMG_EXT = /\.(png|jpe?g|gif|webp)$/i;
const isSitePath = (p) => /^\/sites\/[^/]+\//.test(String(p || ""));
const serverPath = (u) => {
  const s = String(u || "");
  if (isSitePath(s)) return decodeURIComponent(s.split("?")[0]);
  const m = s.match(/^https:\/\/bsoed\.sharepoint\.com(\/sites\/[^?#]+)/i);
  return m ? decodeURIComponent(m[1]) : null;
};

/**
 * SharePoint text-part HTML → app HTML. Images on course sites become
 * <img data-sp-path="…"> and are given signed URLs when a course is served.
 */
function tidyRte(html) {
  const root = parse(`<div>${html}</div>`);
  root.querySelectorAll("script, style").forEach((n) => n.remove());
  root.querySelectorAll("img").forEach((img) => {
    const p = serverPath(img.getAttribute("src"));
    if (p && IMG_EXT.test(p)) img.replaceWith(`<img data-sp-path="${p}">`);
    else img.remove();
  });
  root.querySelectorAll("a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    // SharePoint page/share links need a site login — keep the words only.
    if (!/^https?:/i.test(href) || /sharepoint\.com/i.test(href)) a.replaceWith(a.innerHTML);
  });
  return root.firstChild.innerHTML
    .replace(/\s(class|style|id|data-(?!sp-path)[a-z-]+|aria-[a-z-]+|role|tabindex|target|rel)="[^"]*"/gi, "")
    .replace(/<\/?(span|div|font)[^>]*>/gi, "")
    .replace(/&#58;/g, ":")
    .replace(/<p>(\s|&nbsp;|&#160;|<br\s*\/?>)*<\/p>/gi, "")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

const attachmentLabel = (title, path) =>
  clean(title) || decodeURIComponent(path.split("/").pop()).replace(/\.[a-z0-9]+$/i, "");

/** One lesson page → the parts the app shows. */
function lessonFromPage(page) {
  const body = [];
  const attachments = [];
  const links = [];
  let videoPath = "";
  let assessmentUrl = "";
  let bannerTitle = "";

  const addFile = (path, title) => {
    if (!path) return;
    if (MEDIA_EXT.test(path)) {
      if (!videoPath) videoPath = path;
      else attachments.push({ label: attachmentLabel(title, path), path });
    } else if (DOC_EXT.test(path)) {
      if (!attachments.some((a) => a.path === path)) attachments.push({ label: attachmentLabel(title, path), path });
    } else if (IMG_EXT.test(path)) {
      body.push(`<img data-sp-path="${path}">`);
    }
  };

  for (const c of controls(page.canvas)) {
    if (c.rte !== null) {
      const html = tidyRte(c.rte);
      if (clean(html.replace(/<[^>]+>/g, " "))) body.push(html);
      continue;
    }
    const wp = c.webPart;
    if (!wp) continue;
    const spc = wp.serverProcessedContent || {};
    const title = String(wp.title || "");
    if (/^(banner|hero)$/i.test(title)) {
      bannerTitle = bannerTitle || clean(wp.properties?.title);
    } else if (/file and media|file viewer|document embed/i.test(title)) {
      addFile(serverPath(spc.links?.serverRelativeUrl || wp.properties?.file), spc.searchablePlainTexts?.title);
    } else if (/^image$/i.test(title)) {
      const p = serverPath(spc.imageSources?.imageSource);
      if (p && IMG_EXT.test(p)) {
        const caption = clean(wp.properties?.captionText);
        body.push(`<img data-sp-path="${p}">` + (caption ? `<p><em>${caption}</em></p>` : ""));
      }
    } else if (/microsoft forms/i.test(title)) {
      assessmentUrl = assessmentUrl || spc.links?.formURL || "";
    } else if (/youtube|embed/i.test(title)) {
      const src = (String(wp.properties?.embedCode || "").match(/src="([^"]+)"/) || [])[1] || wp.properties?.url || "";
      const yt = src.match(/youtube(?:-nocookie)?\.com\/embed\/([\w-]+)/) || String(wp.properties?.url || "").match(/(?:v=|youtu\.be\/)([\w-]+)/);
      if (yt) links.push({ label: "Watch on YouTube", url: `https://www.youtube.com/watch?v=${yt[1]}` });
    } else if (/^(button|call to action|link)$/i.test(title)) {
      const url = spc.links?.linkUrl || spc.links?.["button.linkUrl"] || "";
      const label = clean(spc.searchablePlainTexts?.label || spc.searchablePlainTexts?.["button.label"]);
      const p = serverPath(url);
      if (p && (DOC_EXT.test(p) || MEDIA_EXT.test(p))) addFile(p, label);
      else if (/^https?:/i.test(url) && !/sharepoint\.com/i.test(url)) links.push({ label: label || url, url });
    }
  }

  if (links.length) {
    body.push(`<h3>Links</h3><ul>${links.map((l) => `<li><a href="${l.url}">${l.label}</a></li>`).join("")}</ul>`);
  }
  return {
    title: clean(page.title) || bannerTitle,
    contentBody: body.join("\n"),
    videoPath,
    assessmentUrl,
    attachments,
  };
}

// Trainer-only parts of the workshop kits (Personal Development courses):
// facilitation sections, per-topic planning tables and trainer instructions.
const TRAINER_SECTIONS =
  /^((review of )?(the )?parking lot|housekeeping items?|(completion of )?action plans? and evaluations?|ice ?breakers?|evaluations?)$/i;
const TRAINER_TEXT =
  /(suggestions? for the trainer|for the trainer|take a few moments to cover basic housekeeping|basic housekeeping|explain (the concept of )?.* to (the )?participants|ask (the )?participants|do a quick round robin|flip ?chart|\bice ?breakers?\b|washrooms?|review the items on the parking lot)/i;
const PLANNING_TABLE = /(estimated time|topic objective|materials required|planning checklist|delivery tips|recommended activity)/i;

function removeTrainerNotes(html) {
  const root = parse(`<div>${html}</div>`);
  const top = root.firstChild;
  let skipping = false;
  for (const el of [...top.childNodes]) {
    const tag = el.rawTagName?.toLowerCase();
    const text = clean(el.text);
    if (tag && /^h[1-4]$/.test(tag)) {
      skipping = TRAINER_SECTIONS.test(text);
      if (skipping) el.remove();
      continue;
    }
    if (skipping) {
      el.remove();
      continue;
    }
    if (tag === "table" && PLANNING_TABLE.test(text)) el.remove();
    else if (tag === "p" && TRAINER_TEXT.test(text)) el.remove();
    else if (tag === "ul" || tag === "ol") {
      // Drop only the trainer items; drop the list if nothing is left.
      el.querySelectorAll("li").forEach((li) => {
        if (TRAINER_TEXT.test(clean(li.text))) li.remove();
      });
      if (!el.querySelector("li")) el.remove();
    }
  }
  return top.innerHTML
    .replace(/\bthe participants\b/gi, "learners")
    .replace(/\bparticipants\b/gi, "learners")
    .trim();
}

const hasContent = (l) =>
  l.videoPath || l.assessmentUrl || l.attachments.length || clean(l.contentBody.replace(/<(?!img)[^>]+>/g, " ")).length > 40 || /<img/.test(l.contentBody);

function lesson(fields, order) {
  return {
    lessonId: `lesson-${order}`,
    lessonOrder: order,
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

/** Pages linked from a set of links → lessons (a linked sub-hub is expanded). */
function lessonsFromLinks(pages, links, { expandHubs = true } = {}) {
  const out = [];
  const seen = new Set();
  const visit = (name, depth) => {
    if (seen.has(name)) return;
    seen.add(name);
    const page = pages.get(name);
    if (!page) return;
    const parsed = lessonFromPage(page);
    // A page that is mostly links to other pages is a hub — use its lessons.
    const sub = hubSections(page.canvas).flatMap((s) => s.links);
    if (expandHubs && depth === 0 && sub.length >= 3 && !parsed.videoPath && clean(parsed.contentBody.replace(/<[^>]+>/g, " ")).length < 3000) {
      if (hasContent(parsed) && clean(parsed.contentBody.replace(/<[^>]+>/g, " ")).length > 200) {
        out.push(lesson({ ...parsed, title: parsed.title || "Introduction" }, out.length + 1));
      }
      sub.forEach((l) => visit(l.page, depth + 1));
      return;
    }
    if (hasContent(parsed)) out.push(lesson(parsed, out.length + 1));
  };
  links.forEach((l) => visit(l.page, 0));
  return out;
}

function slugify(s) {
  return clean(s).toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function courseFrom({ courseId, title, description, category, audiences, level, site, hub }, lessons, pages) {
  const first = lessons[0];
  const text = first ? clean(first.contentBody.replace(/<[^>]+>/g, " ")) : "";
  return {
    courseId,
    title,
    description: description || text.slice(0, 280) + (text.length > 280 ? "…" : ""),
    level: level || "",
    estimatedDuration: `${lessons.length} lessons`,
    certificateEligible: true,
    audiences: audiences || ["professional"],
    category,
    source: { type: "sharepoint", site, hub },
    lessons,
    lessonCount: lessons.length,
  };
}

/**
 * Builds the courses one config entry describes.
 *  mode "sections"   — every hub section is a course (Student Business Hub)
 *  mode "sections-as-one" — all sections, in order, are one course (AI in HR)
 *  mode "hub-of-hubs" — each page the hub links to is a course hub (Personal Development)
 *  mode "section"    — one named section (or several, by `sections`) is one course
 */
async function buildSiteCourses(reader, def, log = () => {}) {
  const pages = await reader.pages(def.site);
  const hubPage = pages.get(def.hub);
  if (!hubPage) {
    log(`Skipped ${def.site}/${def.hub}: hub page not found`);
    return [];
  }
  const sections = hubSections(hubPage.canvas);
  const base = { category: def.category, audiences: def.audiences, level: def.level, site: def.site, hub: def.hub };
  const courses = [];
  const add = (fields, links) => {
    const drop = (def.dropPages || {})[fields.title] || [];
    links = links.filter((l) => !drop.some((re) => new RegExp(re, "i").test(l.page)));
    const lessons = lessonsFromLinks(pages, links, { expandHubs: def.expandHubs !== false });
    for (const l of lessons) {
      l.title = (def.lessonTitles || {})[l.title] || l.title;
      if (def.trainerKit) l.contentBody = removeTrainerNotes(l.contentBody);
    }
    const override = (def.categories || []).find(([re]) => new RegExp(re, "i").test(fields.title));
    if (override) fields = { ...fields, category: override[1] };
    if (lessons.length >= (def.minLessons || 1)) courses.push(courseFrom({ ...base, ...fields }, lessons, pages));
    else log(`Skipped "${fields.title}": no lessons with content`);
  };

  if (def.mode === "sections") {
    for (const s of sections) {
      const name = s.name;
      if (!name || (def.skip || []).some((re) => new RegExp(re, "i").test(name))) continue;
      const title = (def.titles || []).find(([re]) => new RegExp(re, "i").test(name))?.[1] || name;
      add({ courseId: `${def.idPrefix}-${slugify(title)}`, title }, s.links);
    }
  } else if (def.mode === "hub-of-hubs") {
    const hubLinks = sections.flatMap((s) => s.links);
    for (const extra of def.extraHubs || []) {
      if (!hubLinks.some((l) => l.page === extra)) hubLinks.push({ page: extra, label: "" });
    }
    // Course hubs not linked from the home page: pages linking to 8+ pages.
    if (def.discoverHubs) {
      for (const [name, page] of pages) {
        if (name === def.hub || /sample content/i.test(page.title) || hubLinks.some((l) => l.page === name)) continue;
        if (hubSections(page.canvas).flatMap((x) => x.links).length >= 8) hubLinks.push({ page: name, label: "" });
      }
    }
    for (const l of hubLinks) {
      const page = pages.get(l.page);
      if (!page) continue;
      const links = hubSections(page.canvas).flatMap((s) => s.links);
      const title = clean(page.title) || l.label;
      if ((def.skip || []).some((re) => new RegExp(re, "i").test(title))) continue;
      const intro = lessonFromPage(page);
      // Hub intros are written for trainers ("Your participants will…").
      const description = clean(intro.contentBody.replace(/<[^>]+>/g, " "))
        .replace(/\byour participants will\b/gi, "You will")
        .replace(/\b(your )?participants\b/gi, "you")
        .slice(0, 280);
      add({ courseId: `${def.idPrefix}-${slugify(title)}`, title, description }, links);
    }
  } else if (def.mode === "pages") {
    add(
      { courseId: def.courseId, title: def.title, description: def.description },
      def.pages.map((page) => ({ page, label: "" }))
    );
  } else if (def.mode === "all-pages") {
    // Every page on the site, in the order it was created, except the hub,
    // home and template pages.
    const exclude = [
      "^Home\\.aspx$",
      "^DepartmentHome\\.aspx$",
      "^Templates$",
      "template",
      `^${def.hub.replace(/\./g, "\\.")}$`,
      ...(def.excludePages || []),
    ];
    const links = [...pages.keys()]
      .filter((name) => !exclude.some((re) => new RegExp(re, "i").test(name)))
      .map((page) => ({ page, label: "" }));
    add({ courseId: def.courseId, title: def.title, description: def.description }, links);
  } else {
    const chosen =
      def.mode === "section"
        ? sections.filter((s) => (def.sections || []).some((re) => new RegExp(re, "i").test(s.name)))
        : sections;
    add({ courseId: def.courseId, title: def.title, description: def.description }, chosen.flatMap((s) => s.links));
  }
  return courses;
}

module.exports.lessonFromPage = lessonFromPage;
module.exports.removeTrainerNotes = removeTrainerNotes;
module.exports.tidyRte = tidyRte;
module.exports.buildSiteCourses = buildSiteCourses;
module.exports.lessonsFromLinks = lessonsFromLinks;
module.exports.serverPath = serverPath;
module.exports.IMG_EXT = IMG_EXT;
