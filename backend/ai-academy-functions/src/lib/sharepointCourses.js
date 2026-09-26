// Courses authored as SharePoint pages on the "AI Academy" site.
// The sync reads published "… Masterclass" pages through Microsoft Graph with
// the Function App's managed identity, converts them with sharepointParser and
// stores the catalogue as one JSON blob that listCourses/getCourse read.
// Permission: Graph app role Sites.Read.All (granted 2026-09-25; Sites.Selected
// is also assigned — once a site-level "read" grant for this app exists on the
// AI Academy site, Sites.Read.All can be removed to narrow access).

const crypto = require("node:crypto");
const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { parseCoursePage } = require("./sharepointParser");
const { fetchHustleCourses } = require("./githubCourses");
const { fetchLibraryCourses } = require("./githubLibrary");
const { fetchTeenCourses } = require("./teensCourses");
const { parseVideoCourse, parseProgramme, parseMultiPageCourse } = require("./sharepointShapes");

const SITE_ID =
  process.env.COURSE_SITE_ID || "cf178de6-35c7-4f02-b558-6c6548d49839"; // bsoed.sharepoint.com/sites/AIAcademy
const SITE_PATH = "/sites/AIAcademy/";
const API_BASE =
  process.env.PUBLIC_API_BASE ||
  "https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api";

// Which pages become courses, and for whom. Pages not listed here but titled
// "… Masterclass" are included for both audiences.
const DEFAULT_AUDIENCES = ["teens", "professional"];
const PAGE_OVERRIDES = {
  // Older duplicate of the Runway course (current copy is Runway-ML-Masterclass.aspx).
  "Runway-ML-Masterclass(1).aspx": { skip: true },
};

// Courses on the site that aren't "… Masterclass" pages (see sharepointShapes).
const BOTH = ["teens", "professional"];
const PRO = ["professional"];
const EXTRA_COURSES = [
  { shape: "video", page: "AI-Essential-Building-Foundational-Knowledge.aspx", courseId: "ai-essentials", audiences: BOTH },
  { shape: "video", page: "AI-Agents-&-the-Future-of-Customer-Engagement.aspx", courseId: "ai-agents-customer-engagement", audiences: BOTH },
  { shape: "video", page: "Starting-with-ChatGPT-Coworker.aspx", courseId: "chatgpt-coworker", audiences: BOTH },
  { shape: "video", page: "Meta-Business-Agent-on-WhatsApp.aspx", courseId: "meta-business-agent-whatsapp", audiences: PRO },
  {
    shape: "programme",
    page: "AI-Engineering-&-Agentic-Systems-Mastery-Programme.aspx",
    units: /^Unit-(\d+)-/,
    courseId: "ai-engineering-mastery",
    audiences: PRO,
  },
  {
    shape: "multipage",
    page: "Human-And-AI-Intelligence-in-Sales.aspx",
    topics: ["Sales-Strategies.aspx", "Selling-Formular.aspx", "Customer-Needs.aspx"],
    courseId: "human-ai-sales",
    audiences: PRO,
    titleFixes: { "Selling Formular": "Selling Formula" },
  },
];

const CONTAINER = "course-catalog";
const BLOB = "sharepoint-courses.json";

const credential = new DefaultAzureCredential();

async function graph(path, { raw = false } = {}) {
  const token = await credential.getToken("https://graph.microsoft.com/.default");
  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    headers: { Authorization: `Bearer ${token.token}` },
  });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Graph ${res.status} for ${path}: ${body.slice(0, 300)}`);
    err.status = res.status;
    throw err;
  }
  return raw ? res : res.json();
}

/** Course image URL the app can load without SharePoint access. */
function imageUrl(src) {
  let path = src;
  try {
    path = new URL(src, "https://bsoed.sharepoint.com").pathname;
  } catch {}
  return `${API_BASE}/courseImage?path=${encodeURIComponent(decodeURIComponent(path))}`;
}

async function listAllPages() {
  const pages = [];
  let next =
    `/sites/${SITE_ID}/pages/microsoft.graph.sitePage` +
    `?$select=id,name,title,webUrl,lastModifiedDateTime,publishingState&$top=100`;
  while (next) {
    const data = await graph(next);
    pages.push(...(data.value || []));
    next = data["@odata.nextLink"]
      ? data["@odata.nextLink"].replace("https://graph.microsoft.com/v1.0", "")
      : null;
  }
  return pages;
}

async function listCoursePages() {
  return (await listAllPages()).filter(
    (p) =>
      /masterclass$/i.test((p.title || "").trim()) &&
      p.publishingState?.level === "published" &&
      !PAGE_OVERRIDES[p.name]?.skip
  );
}

/**
 * Admin diagnostics: every page on the site with the structure the importer
 * would see (banner titles, MODULE count, text volume) — used to find
 * courses that don't follow the "… Masterclass" naming.
 */
async function surveyPages() {
  const pages = await listAllPages();
  const out = [];
  for (const summary of pages) {
    let banners = [];
    let textChars = 0;
    const partTypes = {};
    let sample = "";
    try {
      const page = await graph(
        `/sites/${SITE_ID}/pages/${summary.id}/microsoft.graph.sitePage?$expand=canvasLayout`
      );
      for (const section of page.canvasLayout?.horizontalSections || []) {
        for (const column of section.columns || []) {
          for (const part of column.webparts || []) {
            const title = part.data?.properties?.title;
            if (title && part.webPartType === "cbe7b0a9-3504-44dd-a3a3-0e5cacd07788") banners.push(title.normalize("NFKC"));
            if (part.innerHtml) textChars += part.innerHtml.replace(/<[^>]+>/g, "").length;
            const kind = part.innerHtml !== undefined ? "text" : part.data?.title || part.webPartType;
            partTypes[kind] = (partTypes[kind] || 0) + 1;
            if (!sample && part.innerHtml) sample = part.innerHtml.slice(0, 600);
          }
        }
      }
    } catch (err) {
      banners = [`(error: ${err.status || err.message})`];
    }
    out.push({
      name: summary.name,
      title: summary.title,
      published: summary.publishingState?.level === "published",
      modified: summary.lastModifiedDateTime,
      moduleBanners: banners.filter((b) => /^MODULE\s+\d+/i.test(b)).length,
      banners: banners.slice(0, 12),
      textChars,
      partTypes,
      sample,
    });
  }
  return out.sort((a, b) => b.textChars - a.textChars);
}

/** Admin diagnostics: one page's full Graph layout, by file name. */
async function getPageLayout(name) {
  const summary = (await listAllPages()).find((p) => p.name === name);
  if (!summary) return null;
  return graph(`/sites/${SITE_ID}/pages/${summary.id}/microsoft.graph.sitePage?$expand=canvasLayout`);
}

async function loadPage(summary) {
  return graph(`/sites/${SITE_ID}/pages/${summary.id}/microsoft.graph.sitePage?$expand=canvasLayout`);
}

/** Video courses, the programme and multi-page courses. */
async function buildExtraCourses(allPages, log) {
  const byName = new Map(allPages.map((p) => [p.name, p]));
  const published = (name) => {
    const p = byName.get(name);
    return p && p.publishingState?.level === "published" ? p : null;
  };
  const courses = [];
  for (const spec of EXTRA_COURSES) {
    try {
      const main = published(spec.page);
      if (!main) {
        log(`Skipped ${spec.page}: not found or not published`);
        continue;
      }
      const page = await loadPage(main);
      let course;
      if (spec.shape === "video") {
        course = parseVideoCourse(page, spec);
      } else if (spec.shape === "programme") {
        const unitSummaries = allPages
          .filter((p) => spec.units.test(p.name) && p.publishingState?.level === "published")
          .sort((a, b) => Number(a.name.match(spec.units)[1]) - Number(b.name.match(spec.units)[1]));
        const units = [];
        for (const u of unitSummaries) units.push(await loadPage(u));
        course = parseProgramme(page, units, spec);
      } else {
        const topics = [];
        for (const name of spec.topics) {
          const t = published(name);
          if (t) topics.push(await loadPage(t));
        }
        course = parseMultiPageCourse(page, topics, spec);
      }
      if (!course.lessons.length) {
        log(`Skipped "${course.title}": no lessons found`);
        continue;
      }
      courses.push(course);
      log(`Imported "${course.title}" (${course.lessons.length} lessons)`);
    } catch (err) {
      log(`Failed ${spec.page}: ${err.message}`);
    }
  }
  return courses;
}

/** Everything the sync would publish, without saving it. */
async function previewExtraCourses() {
  const log = [];
  const courses = await buildExtraCourses(await listAllPages(), (m) => log.push(m));
  return { log, courses };
}

/** Fetches every course page, converts it, and saves the catalogue. */
async function syncCourses(log = () => {}) {
  const allPages = await listAllPages();
  const pages = allPages.filter(
    (p) =>
      /masterclass$/i.test((p.title || "").trim()) &&
      p.publishingState?.level === "published" &&
      !PAGE_OVERRIDES[p.name]?.skip
  );
  const courses = [];
  for (const summary of pages) {
    const page = await graph(
      `/sites/${SITE_ID}/pages/${summary.id}/microsoft.graph.sitePage?$expand=canvasLayout`
    );
    const override = PAGE_OVERRIDES[summary.name] || {};
    const course = parseCoursePage(page, {
      courseId: override.courseId,
      audiences: override.audiences || DEFAULT_AUDIENCES,
      rewriteImage: imageUrl,
    });
    if (course.lessons.length === 0) {
      log(`Skipped "${course.title}": no MODULE banners found`);
      continue;
    }
    courses.push(course);
    log(`Imported "${course.title}" (${course.lessons.length} lessons)`);
  }

  // Video courses / programme / multi-page: on once verified (app setting).
  if (process.env.IMPORT_EXTRA_COURSES === "1") {
    courses.push(...(await buildExtraCourses(allPages, log)));
  }

  // 200 AI Hustles (GitHub) — a failure here must not drop the SharePoint courses.
  try {
    courses.push(...(await fetchHustleCourses(log)));
  } catch (err) {
    log(`Hustles not synced: ${err.message}`);
  }

  // Other courses on the SharePoint Courses page that live on GitHub.
  courses.push(...(await fetchLibraryCourses(log)));

  // AI Academy for Teens (sites/TeenSkills) — a failure skips only these.
  try {
    courses.push(...(await fetchTeenCourses(graph, log)));
  } catch (err) {
    log(`Teens courses not synced: ${err.message}`);
  }

  const catalog = { syncedAt: new Date().toISOString(), courses };
  const container = blobService().getContainerClient(CONTAINER);
  await container.createIfNotExists();
  const body = JSON.stringify(catalog);
  await container
    .getBlockBlobClient(BLOB)
    .upload(body, Buffer.byteLength(body), {
      blobHTTPHeaders: { blobContentType: "application/json" },
    });
  cached = { at: Date.now(), catalog };
  return catalog;
}

function blobService() {
  return BlobServiceClient.fromConnectionString(process.env.AzureWebJobsStorage);
}

// Per-instance cache so listCourses/getCourse don't hit storage every call.
let cached = null;
const CACHE_MS = 5 * 60 * 1000;

/** The last synced catalogue (empty until the first sync has run). */
async function loadCatalog() {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.catalog;
  try {
    const buf = await blobService()
      .getContainerClient(CONTAINER)
      .getBlockBlobClient(BLOB)
      .downloadToBuffer();
    cached = { at: Date.now(), catalog: JSON.parse(buf.toString("utf8")) };
  } catch (err) {
    if (err.statusCode !== 404) throw err;
    cached = { at: Date.now(), catalog: { syncedAt: null, courses: [] } };
  }
  return cached.catalog;
}

// ---------------------------------------------------------------------------
// Course videos: lessons carry a SharePoint path; learners get a signed,
// expiring /api/courseMedia URL that redirects to a short-lived download URL.
// ---------------------------------------------------------------------------

const MEDIA_TTL_SECONDS = 6 * 60 * 60;

function mediaSignature(path, exp) {
  const secret = process.env.COURSE_MEDIA_SECRET;
  if (!secret) throw new Error("COURSE_MEDIA_SECRET is not configured");
  return crypto.createHmac("sha256", secret).update(`${path}|${exp}`).digest("base64url");
}

/** Signed URL for a course video (valid for MEDIA_TTL_SECONDS). */
function signedMediaUrl(path) {
  const exp = Math.floor(Date.now() / 1000) + MEDIA_TTL_SECONDS;
  const sig = mediaSignature(path, exp);
  return `${API_BASE}/courseMedia?path=${encodeURIComponent(path)}&exp=${exp}&sig=${sig}`;
}

function verifyMediaSignature(path, exp, sig) {
  if (!path || !exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const expected = Buffer.from(mediaSignature(path, exp));
  const given = Buffer.from(String(sig));
  return expected.length === given.length && crypto.timingSafeEqual(expected, given);
}

let drivesCache = null;
async function siteDrives() {
  if (!drivesCache || Date.now() - drivesCache.at > 60 * 60 * 1000) {
    const data = await graph(`/sites/${SITE_ID}/drives?$select=id,name,webUrl`);
    drivesCache = {
      at: Date.now(),
      drives: (data.value || []).map((d) => ({
        id: d.id,
        path: decodeURIComponent(new URL(d.webUrl).pathname) + "/",
      })),
    };
  }
  return drivesCache.drives;
}

/** "/sites/AIAcademy/Workbook Templates/What is AI.mp4" → pre-authenticated download URL */
async function mediaDownloadUrl(path) {
  const clean = decodeURIComponent(String(path));
  if (!clean.startsWith(SITE_PATH) || clean.includes("..") || !/\.(mp4|m4v|mov|webm|mp3|m4a)$/i.test(clean)) {
    return null;
  }
  const drive = (await siteDrives())
    .filter((d) => clean.startsWith(d.path))
    .sort((a, b) => b.path.length - a.path.length)[0];
  if (!drive) return null;
  const rel = clean.slice(drive.path.length).split("/").map(encodeURIComponent).join("/");
  const item = await graph(`/drives/${drive.id}/root:/${rel}`);
  return item["@microsoft.graph.downloadUrl"] || null;
}

/** Adds signed video URLs to a course before it's sent to a learner. */
function withMediaUrls(course) {
  if (!course.lessons.some((l) => l.videoPath)) return course;
  return {
    ...course,
    lessons: course.lessons.map((l) =>
      l.videoPath ? { ...l, videoUrl: signedMediaUrl(l.videoPath) } : l
    ),
  };
}

/** Streams an image from a "… Course Images" folder on the course site. */
async function fetchCourseImage(path) {
  const clean = decodeURIComponent(String(path || ""));
  const allowed =
    clean.startsWith(`${SITE_PATH}Shared Documents/`) &&
    /\/[^/]*Course Images\/[^/]+\.(png|jpe?g|gif|webp|svg)$/i.test(clean) &&
    !clean.includes("..");
  if (!allowed) return null;
  const rel = clean.slice(`${SITE_PATH}Shared Documents/`.length);
  const res = await graph(
    `/sites/${SITE_ID}/drive/root:/${rel.split("/").map(encodeURIComponent).join("/")}:/content`,
    { raw: true }
  );
  return {
    body: Buffer.from(await res.arrayBuffer()),
    contentType: res.headers.get("content-type") || "application/octet-stream",
  };
}

module.exports = {
  syncCourses, loadCatalog, fetchCourseImage, listCoursePages, surveyPages, getPageLayout,
  previewExtraCourses, withMediaUrls, verifyMediaSignature, mediaDownloadUrl, graph, SITE_ID,
};
