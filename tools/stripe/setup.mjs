// One-off Stripe setup for AI Academy All Access (website, GBP): creates the
// product, a monthly and a yearly price, and the webhook endpoint. Prints the
// price ids and writes the webhook signing secret to $SECRET_OUT (never stdout).
// Run: STRIPE_SECRET_KEY=sk_live_… SECRET_OUT=/path node tools/stripe/setup.mjs
// Optional: MONTHLY_GBP (default 6.50), YEARLY_GBP (default 60).
import fs from "node:fs";

const key = process.env.STRIPE_SECRET_KEY;
if (!key) throw new Error("Set STRIPE_SECRET_KEY");
const monthly = Math.round(Number(process.env.MONTHLY_GBP || 6.5) * 100);
const yearly = Math.round(Number(process.env.YEARLY_GBP || 60) * 100);
const hook = "https://ai-academy-progress-api-bucjc4gtcsenhuhs.swedencentral-01.azurewebsites.net/api/stripeWebhook";

function encode(obj, prefix, out = []) {
  for (const [k, v] of Object.entries(obj)) {
    const key2 = prefix ? `${prefix}[${k}]` : k;
    if (typeof v === "object") encode(v, key2, out);
    else out.push(`${encodeURIComponent(key2)}=${encodeURIComponent(String(v))}`);
  }
  return out.join("&");
}
async function post(path, body) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: encode(body),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${path}: ${json.error?.message}`);
  return json;
}

const product = await post("/products", {
  name: "AI Academy All Access",
  description: "Every AI Academy course, the AI tutors, Practice with AI, Cambridge and US curriculum practice, progress tracking and certificates.",
  metadata: { app: "ai-academy" },
});
const pm = await post("/prices", { product: product.id, currency: "gbp", unit_amount: monthly, recurring: { interval: "month" }, nickname: "All Access Monthly" });
const py = await post("/prices", { product: product.id, currency: "gbp", unit_amount: yearly, recurring: { interval: "year" }, nickname: "All Access Yearly" });
const wh = await post("/webhook_endpoints", {
  url: hook,
  description: "AI Academy subscriptions",
  enabled_events: ["checkout.session.completed", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted", "invoice.paid", "invoice.payment_failed"],
});
fs.writeFileSync(process.env.SECRET_OUT, wh.secret, { mode: 0o600 });
console.log(`product=${product.id}`);
console.log(`STRIPE_PRICE_MONTHLY=${pm.id}`);
console.log(`STRIPE_PRICE_YEARLY=${py.id}`);
console.log(`webhook=${wh.id}`);
