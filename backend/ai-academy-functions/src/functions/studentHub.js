const { app } = require("@azure/functions");
const { requireUser } = require("../lib/auth");
const { TOOLS, publicTools, buildRun } = require("../lib/studentHub");
const { BUSINESS_TOOLS, DONE_FOR_YOU } = require("../lib/businessHub");

// ?hub=business (GET) / {hub: "business"} (POST) selects the Business
// Marketing Hub; anything else is the Student Success Hub.
const HUBS = { student: TOOLS, business: BUSINESS_TOOLS };
const hubTools = (id) => HUBS[id] || TOOLS;

// Student Success Hub and Business Marketing Hub (professional learners).
// GET ?hub= → the hub's tool forms.
// POST {hub, tool, answers, brief?: {name, data(base64)}} → {text}
const AGENTS_URL = (process.env.STUDENT_AGENTS_URL || "").replace(/\/$/, "");
const AGENTS_KEY = process.env.STUDENT_AGENTS_KEY || "";

// Per-learner limit (per instance) — the proxy trusts this backend and
// skips its own per-IP limit, so fair use is enforced here.
const RUNS_PER_HOUR = Number(process.env.STUDENT_HUB_RUNS_PER_HOUR) || 20;
const runs = new Map();
function allowRun(userId) {
  const now = Date.now();
  const recent = (runs.get(userId) || []).filter((t) => now - t < 3600_000);
  if (recent.length >= RUNS_PER_HOUR) {
    runs.set(userId, recent);
    return false;
  }
  recent.push(now);
  runs.set(userId, recent);
  return true;
}

// With web search the model narrates its steps first ("I'll search for…
// Let me search…"); the learner only needs the answer.
function withoutNarration(text) {
  return String(text || "")
    .trim()
    .replace(/^(?:(?:I'll|I will|Let me|Now let me|Now I'll|I'm going to)\b[^.!?\n]*[.!?:]\s*)+/i, "")
    .trim();
}

app.http("studentHub", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  handler: requireUser(async (request, context, user) => {
    if (!user.audiences.includes("professional")) {
      return { status: 403, jsonBody: { error: "The Student Success Hub is part of the AI Academy." } };
    }
    if (request.method === "GET") {
      const hub = request.query.get("hub");
      return {
        status: 200,
        jsonBody: {
          tools: publicTools(hubTools(hub)),
          ...(hub === "business" ? { doneForYou: DONE_FOR_YOU } : {}),
        },
      };
    }

    if (!AGENTS_URL || !AGENTS_KEY) {
      context.error("studentHub: STUDENT_AGENTS_URL / STUDENT_AGENTS_KEY not configured");
      return { status: 500, jsonBody: { error: "The Student Success Hub is not configured." } };
    }
    let body;
    try {
      body = await request.json();
    } catch {
      body = null;
    }
    const { request: run, error } = buildRun(
      body?.tool,
      body?.answers || {},
      body?.brief || null,
      hubTools(body?.hub)
    );
    if (error) return { status: 400, jsonBody: { error } };
    if (!allowRun(user.userId)) {
      return { status: 429, jsonBody: { error: "You've used the hubs a lot in the last hour — please try again a little later." } };
    }

    try {
      const res = await fetch(`${AGENTS_URL}/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-trusted-caller": AGENTS_KEY },
        body: JSON.stringify(run),
        signal: AbortSignal.timeout(170_000),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        context.warn(`studentHub: proxy ${res.status} ${data.error || ""}`);
        return { status: 502, jsonBody: { error: data.error || "Could not get a result — please try again." } };
      }
      return { status: 200, jsonBody: { text: withoutNarration(data.text) } };
    } catch (err) {
      context.error("studentHub failed", err);
      return { status: 502, jsonBody: { error: "The search took too long — please try again." } };
    }
  }),
});
