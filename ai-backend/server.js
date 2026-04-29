import express from "express";
import fetch from "node-fetch";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { DefaultAzureCredential } from "@azure/identity";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Health check (proves server is running and this file is active)
app.get("/health", (req, res) => {
  res.json({ ok: true, message: "ai-backend alive" });
});

// ✅ Rate limiting (protects your endpoint)
app.use(
  "/ai",
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
  })
);

// ✅ Foundry config from .env
// Base MUST end with: /protocols/openai
const FOUNDRY_OPENAI_BASE = process.env.FOUNDRY_OPENAI_BASE;
const FOUNDRY_API_VERSION =
  process.env.FOUNDRY_API_VERSION || "2025-11-15-preview";

if (!FOUNDRY_OPENAI_BASE) {
  console.error("❌ Missing FOUNDRY_OPENAI_BASE in .env");
  process.exit(1);
}

// ✅ Entra credential (local dev uses az login; prod uses Managed Identity)
const credential = new DefaultAzureCredential();

async function getFoundryToken() {
  // Foundry Agent Applications use the ai.azure.com scope
  const token = await credential.getToken("https://ai.azure.com/.default");
  if (!token?.token) throw new Error("Could not acquire Entra token");
  return token.token;
}

// ✅ Proxy endpoint your Flutter app will call
app.post("/ai/chat", async (req, res) => {
  try {
    let payload = req.body;

    // Accept {messages:[...]} and convert to {input:"..."}
    if (payload && Array.isArray(payload.messages)) {
      const text = payload.messages
        .map((m) => m?.content)
        .filter(Boolean)
        .join("\n");
      payload = { input: text };
    }

    // Validate payload
    if (!payload?.input || typeof payload.input !== "string") {
      return res.status(400).json({
        error: "Send { input: string } or { messages: [{role, content}] }",
      });
    }

    // ✅ Final Foundry Responses URL
    const url = `${FOUNDRY_OPENAI_BASE.replace(
      /\/$/,
      ""
    )}/responses?api-version=${encodeURIComponent(FOUNDRY_API_VERSION)}`;

    console.log("=== HIT /ai/chat ===");
    console.log("Calling Foundry URL:", url);

    const accessToken = await getFoundryToken();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await response.text();

    console.log("Foundry status:", response.status);
    console.log("Foundry body:", bodyText);

    // If Foundry returned an error, pass it through
    if (response.status !== 200) {
      // Try to return JSON if it is JSON, otherwise return raw text
      try {
        return res.status(response.status).json(JSON.parse(bodyText));
      } catch {
        return res.status(response.status).send(bodyText);
      }
    }

    // ✅ Parse Foundry Responses JSON
    let data;
    try {
      data = JSON.parse(bodyText);
    } catch {
      // Unexpected response, return raw
      return res.status(200).send(bodyText);
    }

    // ✅ Extract assistant text from Responses format
    // In your working response, it is here:
    // output[0].content[0].text
    const text =
      data?.output?.[0]?.content?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.output_text ||
      data?.output_text ||
      "";

    // ✅ Return clean payload for Flutter
    return res.status(200).json({
      text,
      raw: data, // keep for debugging, remove later if you want smaller responses
    });
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Foundry agent proxy error" });
  }
});

app.listen(3000, () => {
  console.log("✅ Foundry agent proxy running on http://localhost:3000");
});