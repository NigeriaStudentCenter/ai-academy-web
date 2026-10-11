// Creates the two Paystack plans for AI Academy All Access (web, Nigeria) and
// prints their plan codes for the Function App settings
// PAYSTACK_PLAN_MONTHLY / PAYSTACK_PLAN_YEARLY.
//
// Run:  PAYSTACK_SECRET_KEY=sk_live_… node tools/paystack/create-plans.mjs
// Optional: MONTHLY_NAIRA (default 10000), YEARLY_NAIRA (default 99900) —
// the same naira prices as the App Store and Google Play.

const key = process.env.PAYSTACK_SECRET_KEY;
if (!key) {
  console.error("Set PAYSTACK_SECRET_KEY first.");
  process.exit(1);
}
const monthly = Number(process.env.MONTHLY_NAIRA || 10000);
const yearly = Number(process.env.YEARLY_NAIRA || 99900);

async function create(name, interval, naira) {
  const res = await fetch("https://api.paystack.co/plan", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      interval,
      amount: Math.round(naira * 100),
      currency: "NGN",
      description: "AI Academy All Access — every course, AI tutors, curriculum practice and certificates.",
      send_invoices: true,
      send_sms: false,
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) throw new Error(`${name}: ${res.status} ${json.message}`);
  return json.data.plan_code;
}

const m = await create("AI Academy All Access (Monthly)", "monthly", monthly);
const y = await create("AI Academy All Access (Yearly)", "annually", yearly);
console.log(`PAYSTACK_PLAN_MONTHLY=${m}`);
console.log(`PAYSTACK_PLAN_YEARLY=${y}`);
