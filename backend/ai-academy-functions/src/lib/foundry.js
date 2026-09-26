// Calls the Foundry agent application (Responses API) with the Function
// App's managed identity — no API key in the app or in settings.
const { DefaultAzureCredential } = require("@azure/identity");

const FOUNDRY_OPENAI_BASE = (process.env.FOUNDRY_OPENAI_BASE || "").replace(/\/$/, "");
const FOUNDRY_API_VERSION = process.env.FOUNDRY_API_VERSION || "2025-11-15-preview";

const credential = new DefaultAzureCredential();

/**
 * @param input  a string, or [{role: "developer"|"user"|"assistant", content}]
 * @returns the reply text
 */
async function askFoundry(input) {
  if (!FOUNDRY_OPENAI_BASE) throw new Error("FOUNDRY_OPENAI_BASE is not configured");
  const token = await credential.getToken("https://ai.azure.com/.default");
  const response = await fetch(
    `${FOUNDRY_OPENAI_BASE}/responses?api-version=${encodeURIComponent(FOUNDRY_API_VERSION)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token.token}` },
      body: JSON.stringify({ input }),
    }
  );
  const bodyText = await response.text();
  if (!response.ok) {
    const err = new Error(`Foundry returned ${response.status}: ${bodyText.slice(0, 500)}`);
    err.status = response.status;
    throw err;
  }
  const data = JSON.parse(bodyText);
  // Responses output can hold reasoning items first; take the message text.
  const message = (data.output || []).find((o) => o.type === "message") || data.output?.[0];
  return (
    message?.content?.find((c) => c.type === "output_text")?.text ||
    message?.content?.[0]?.text ||
    data.output_text ||
    ""
  );
}

module.exports = { askFoundry };
