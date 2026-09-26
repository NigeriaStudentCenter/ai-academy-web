const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { syncCourses, surveyPages, getPageLayout, previewExtraCourses, graph, explainMedia } = require("../lib/sharepointCourses");
const { fetchTeenCourses, loadTeenPages } = require("../lib/teensCourses");
const { createSiteReader, hubSections, controls, buildSiteCourses } = require("../lib/siteCourses");
const { SITE_COURSES } = require("../lib/catalogConfig");

// Refresh SharePoint courses every 30 minutes…
app.timer("syncCoursesTimer", {
  schedule: "0 */30 * * * *",
  runOnStartup: false,
  handler: async (timer, context) => {
    const catalog = await syncCourses((m) => context.log(m));
    context.log(`Synced ${catalog.courses.length} SharePoint courses`);
  },
});

// …or immediately after publishing a change: POST /api/syncCourses (Admins only).
// (Routes under /admin are reserved by the Functions host.)
app.http("syncCourses", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.isAdmin) return { status: 403, jsonBody: { error: "Admins only." } };
    const log = [];
    try {
      const catalog = await syncCourses((m) => log.push(m));
      return {
        status: 200,
        jsonBody: {
          syncedAt: catalog.syncedAt,
          courses: catalog.courses.map((c) => ({
            courseId: c.courseId,
            title: c.title,
            lessons: c.lessons.length,
          })),
          log,
        },
      };
    } catch (err) {
      context.error("syncCourses failed", err);
      return { status: 502, jsonBody: { error: err.message, log } };
    }
  }),
});

// Admin diagnostics: GET /api/coursePages lists every page on the course site
// with the structure the importer sees.
app.http("coursePages", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.isAdmin) return { status: 403, jsonBody: { error: "Admins only." } };
    if (request.query.get("mediaTest")) {
      return { status: 200, jsonBody: await explainMedia(request.query.get("mediaTest")) };
    }
    // ?sitePreview=1[&only=SiteName] → dry run of the SharePoint course-site import.
    if (request.query.get("sitePreview")) {
      const only = request.query.get("only");
      const reader = createSiteReader(graph);
      const log = [];
      const courses = [];
      for (const def of SITE_COURSES.filter((d) => !only || d.site === only)) {
        try {
          courses.push(...(await buildSiteCourses(reader, def, (m) => log.push(m))));
        } catch (err) {
          log.push(`${def.site}/${def.hub}: ${err.message}`);
        }
      }
      const full = request.query.get("full");
      return {
        status: 200,
        jsonBody: {
          log,
          courses: courses.map((c) =>
            full
              ? c
              : {
                  courseId: c.courseId,
                  title: c.title,
                  category: c.category,
                  description: c.description.slice(0, 120),
                  lessons: c.lessons.map(
                    (l) =>
                      `${l.title} [${l.contentBody.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length}` +
                      (l.videoPath ? " +video" : "") +
                      (l.attachments.length ? ` +${l.attachments.length} files` : "") +
                      ((l.contentBody.match(/<img/g) || []).length ? ` +${(l.contentBody.match(/<img/g) || []).length} img` : "") +
                      (l.assessmentUrl ? " +form" : "") +
                      "]"
                  ),
                }
          ),
        },
      };
    }
    // ?site=Name → every page with its size; add &hub=Page.aspx → that hub's
    // course sections (the pages each section links to).
    const site = request.query.get("site");
    if (site) {
      const reader = createSiteReader(graph);
      const pages = await reader.pages(site);
      const one = request.query.get("page");
      if (one) {
        const page = pages.get(one);
        if (!page) return { status: 404, jsonBody: { error: `No page ${one}` } };
        if (request.query.get("raw")) return { status: 200, jsonBody: controls(page.canvas) };
        return {
          status: 200,
          jsonBody: controls(page.canvas).map((c) => ({
            zone: c.zone,
            rte: c.rte ? c.rte.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 200) : undefined,
            webPart: c.webPart
              ? {
                  title: c.webPart.title,
                  links: c.webPart.serverProcessedContent?.links,
                  texts: c.webPart.serverProcessedContent?.searchablePlainTexts,
                  embed: c.webPart.properties?.embedCode?.slice(0, 200),
                  file: c.webPart.properties?.file,
                }
              : undefined,
          })),
        };
      }
      const hub = request.query.get("hub");
      if (hub) {
        const page = pages.get(hub);
        return page
          ? { status: 200, jsonBody: { hub, sections: hubSections(page.canvas) } }
          : { status: 404, jsonBody: { error: `No page ${hub}` } };
      }
      return {
        status: 200,
        jsonBody: [...pages.values()].map((p) => ({
          name: p.name,
          title: p.title,
          chars: p.canvas.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").length,
          sections: hubSections(p.canvas).map((s) => `${s.name} (${s.links.length})`),
        })),
      };
    }
    if (request.query.get("teens") === "raw") {
      return { status: 200, jsonBody: Object.fromEntries(await loadTeenPages(graph)) };
    }
    if (request.query.get("teens")) {
      const log = [];
      const courses = await fetchTeenCourses(graph, (m) => log.push(m));
      return { status: 200, jsonBody: { log, courses } };
    }
    if (request.query.get("preview")) {
      return { status: 200, jsonBody: await previewExtraCourses() };
    }
    const name = request.query.get("name");
    if (name) {
      const page = await getPageLayout(name);
      return page ? { status: 200, jsonBody: page } : { status: 404 };
    }
    return { status: 200, jsonBody: await surveyPages() };
  }),
});
