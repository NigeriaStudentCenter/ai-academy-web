// Courses authored as SharePoint pages on the "AI Academy" site.
// The sync reads published "… Masterclass" pages through Microsoft Graph with
// the Function App's managed identity (Graph app permission Sites.Selected,
// read on this one site), converts them with sharepointParser and stores the
// catalogue as one JSON blob that listCourses/getCourse read.

const { DefaultAzureCredential } = require("@azure/identity");
const { BlobServiceClient } = require("@azure/storage-blob");
const { parseCoursePage } = require("./sharepointParser");

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

async function listCoursePages() {
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
  return pages.filter(
    (p) =>
      /masterclass$/i.test((p.title || "").trim()) &&
      p.publishingState?.level === "published" &&
      !PAGE_OVERRIDES[p.name]?.skip
  );
}

/** Fetches every course page, converts it, and saves the catalogue. */
async function syncCourses(log = () => {}) {
  const pages = await listCoursePages();
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

module.exports = { syncCourses, loadCatalog, fetchCourseImage, listCoursePages };
