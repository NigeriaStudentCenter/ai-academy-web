const { app } = require("@azure/functions");
const { DefaultAzureCredential } = require("@azure/identity");

// Hosted replacement for ai-backend/server.js: proxies the Flutter AI Tutor
// to the Foundry agent application using the Function App's managed identity,
// so no API key ever ships in the app.
const FOUNDRY_OPENAI_BASE = (process.env.FOUNDRY_OPENAI_BASE || "").replace(/\/$/, "");
const FOUNDRY_API_VERSION = process.env.FOUNDRY_API_VERSION || "2025-11-15-preview";
const MAX_INPUT_CHARS = 8000;

const credential = new DefaultAzureCredential();

app.http("aiChat", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    if (!FOUNDRY_OPENAI_BASE) {
      context.error("FOUNDRY_OPENAI_BASE is not configured");
      return { status: 500, jsonBody: { error: "AI tutor is not configured." } };
    }

    let payload;
    try {
      payload = await request.json();
    } catch {
      payload = null;
    }

    // Accept {messages:[...]} and convert to {input:"..."}, same as server.js
    if (payload && Array.isArray(payload.messages)) {
      payload = {
        input: payload.messages.map((m) => m?.content).filter(Boolean).join("\n"),
      };
    }

    const input = payload?.input;
    if (!input || typeof input !== "string") {
      return {
        status: 400,
        jsonBody: { error: "Send { input: string } or { messages: [{role, content}] }" },
      };
    }
    if (input.length > MAX_INPUT_CHARS) {
      return { status: 413, jsonBody: { error: "Message is too long." } };
    }

    try {
      const token = await credential.getToken("https://ai.azure.com/.default");
      const response = await fetch(
        `${FOUNDRY_OPENAI_BASE}/responses?api-version=${encodeURIComponent(FOUNDRY_API_VERSION)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.token}`,
          },
          body: JSON.stringify({ input }),
        }
      );

      const bodyText = await response.text();
      if (!response.ok) {
        context.error(`Foundry returned ${response.status}: ${bodyText.slice(0, 500)}`);
        return { status: 502, jsonBody: { error: "AI tutor is unavailable. Please try again." } };
      }

      const data = JSON.parse(bodyText);
      const text =
        data?.output?.[0]?.content?.[0]?.text ||
        data?.output?.[0]?.content?.[0]?.output_text ||
        data?.output_text ||
        "";

      return { status: 200, jsonBody: { text } };
    } catch (err) {
      context.error("aiChat proxy error", err);
      return { status: 500, jsonBody: { error: "AI tutor proxy error." } };
    }
  },
});
