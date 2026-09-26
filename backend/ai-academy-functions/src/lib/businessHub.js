// Business Marketing Hub — the professional app's business command center.
// Its six tools are the six services on business.html ("Done-For-You AI
// Marketing"): landing pages, email campaigns, social content, lead
// generation, a 24/7 chatbot and follow-up. Each tool produces the asset for
// the learner's own business; the hub also offers the done-for-you service
// (a free call with john@bsoedu.org). Same form/run machinery as studentHub.js.

const TONES = ["Friendly and warm", "Professional and trustworthy", "Bold and energetic", "Premium and polished", "Plain and direct"];
const BUSINESS_FIELDS = [
  { id: "business", label: "Business name", type: "text", required: true, hint: "e.g. Ada's Kitchen" },
  { id: "offer", label: "What you sell", type: "text", required: true, hint: "e.g. Nigerian catering for weddings and office events" },
  { id: "audience", label: "Who you serve", type: "text", required: true, hint: "e.g. couples and HR teams in London" },
];
const NO_FABRICATION =
  "Never invent testimonials, statistics, awards, prices or guarantees — where one would help, insert a clearly marked placeholder like [ADD A REAL CUSTOMER QUOTE].";

const BUSINESS_TOOLS = [
  {
    id: "landing",
    name: "Landing Page Builder",
    summary: "Pages that turn visitors into enquiries",
    icon: "web",
    tier: "smart",
    web: false,
    note: "Review every claim before you publish — only promise what your business really delivers.",
    fields: [
      ...BUSINESS_FIELDS,
      { id: "goal", label: "What should visitors do?", type: "select", options: ["Book a call", "Request a quote", "Buy now", "Sign up / join a list", "Visit or call us"] },
      { id: "usp", label: "What makes you different? (optional)", type: "text", hint: "e.g. 15 years' experience, same-week delivery" },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    prompt: (f) =>
      `You are a conversion copywriter. Write complete landing-page copy for ${f.business}, which sells ${f.offer} to ${f.audience}. The single goal of the page: ${f.goal}. What makes them different: ${f.usp || "(not given — ask the owner to add it)"}. Tone: ${f.tone}. Give, in order and clearly labelled: 1) three headline options and a subheadline; 2) the hero call-to-action button text; 3) a short problem section in the customer's words; 4) the solution — 3 to 5 benefits (outcomes, not features), each with a one-line explanation; 5) how it works in 3 steps; 6) a social-proof section with placeholders; 7) five FAQs with answers; 8) a closing call-to-action section; 9) an SEO page title (under 60 characters) and meta description (under 155 characters). Use British English and plain, specific language. ${NO_FABRICATION} End with 3 quick tips to make the page convert better.`,
  },
  {
    id: "email",
    name: "Email Campaign Writer",
    summary: "Sequences and promotions, ready to send",
    icon: "mail",
    tier: "smart",
    web: false,
    note: "Only email people who have agreed to hear from you, and include an unsubscribe link (UK GDPR / PECR and similar laws elsewhere).",
    fields: [
      ...BUSINESS_FIELDS,
      { id: "campaign", label: "Campaign type", type: "select", options: ["Welcome sequence (3 emails)", "Promotion / offer (2 emails)", "Monthly newsletter", "Re-engage quiet customers (2 emails)", "Event or launch announcement (2 emails)"] },
      { id: "details", label: "Offer, event or news (optional)", type: "text", hint: "e.g. 10% off December bookings until 30 Nov" },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    prompt: (f) =>
      `You are an email marketer for small businesses. Write a "${f.campaign}" for ${f.business}, which sells ${f.offer} to ${f.audience}. Details: ${f.details || "none given"}. Tone: ${f.tone}. For EACH email give: when to send it (day and time relative to sign-up or launch), 3 subject-line options (under 50 characters), preview text, the full email body with short paragraphs, one clear call-to-action button text, and a P.S. line. Personalise with [First name]. ${NO_FABRICATION} Remind the owner to include an unsubscribe link and to email only people who opted in. End with 2 tips to lift open and click rates.`,
  },
  {
    id: "social",
    name: "Social Content Planner",
    summary: "A month of on-brand posts",
    icon: "campaign",
    tier: "smart",
    web: false,
    note: "Adapt each post to your own photos and voice — posts that show real people and real work perform best.",
    fields: [
      ...BUSINESS_FIELDS,
      { id: "platforms", label: "Main platform", type: "select", options: ["Instagram", "Facebook", "LinkedIn", "TikTok", "X (Twitter)", "WhatsApp Status", "A mix of platforms"] },
      { id: "count", label: "How many posts?", type: "select", options: ["4 posts (1 a week)", "8 posts (2 a week)", "12 posts (3 a week)"] },
      { id: "goal", label: "Main goal this month", type: "select", options: ["Get more enquiries", "Build awareness", "Promote an offer", "Build trust and authority", "Grow followers"] },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    prompt: (f) =>
      `You are a social media manager for small businesses. Plan ${f.count} for ${f.business} on ${f.platforms}. The business sells ${f.offer} to ${f.audience}. Goal this month: ${f.goal}. Tone: ${f.tone}. Mix content types (tips, behind the scenes, customer stories with placeholders, offers, questions that spark comments). Present a calendar: for EACH post give the week and day, the content type, the hook (first line), the full caption written for that platform, a call-to-action, 5 to 10 relevant hashtags (if the platform uses them), and a simple image or video idea the owner can shoot on a phone. ${NO_FABRICATION} End with the best times to post on that platform and one idea for a short video series.`,
  },
  {
    id: "leads",
    name: "Lead Finder",
    summary: "Where your next customers are",
    icon: "person_search",
    tier: "fast",
    web: true,
    note: "Contact businesses through their official, public channels only. Follow data-protection and anti-spam rules — no bulk cold emails to personal addresses.",
    fields: [
      { id: "offer", label: "What you sell", type: "text", required: true, hint: "e.g. bookkeeping for small restaurants" },
      { id: "ideal", label: "Your ideal customer (type of business or person)", type: "text", required: true, hint: "e.g. independent restaurants and cafés" },
      { id: "loc", label: "Location", type: "text", required: true, hint: "e.g. Birmingham, England  or  Abuja, Nigeria" },
      { id: "kind", label: "What would help most?", type: "select", options: ["Specific organisations to approach", "Directories and places to find leads", "Local events and networking", "All of the above"] },
    ],
    prompt: (f) =>
      `You are a B2B and local lead-generation researcher. The business sells ${f.offer}. Ideal customer: ${f.ideal}. Location: ${f.loc}. Focus: ${f.kind}. Use web search to find CURRENT, real, publicly listed information: (1) up to 8 specific organisations that fit the ideal customer, each with name, what they do, why they might need this offer, and their official website or public listing link; (2) the 3 to 5 best directories, associations, marketplaces or groups for finding more of these customers in that location, with links; (3) any upcoming local events or networking groups where they gather, with dates and links. Only list real organisations and links you actually found via search — never invent any, and do not collect personal contact details of private individuals; point to official business contact pages instead. Then give a short outreach plan: a 2-sentence opening message tailored to this ideal customer, and a 3-step follow-up rhythm. End with a one-line reminder to follow data-protection and anti-spam rules.`,
  },
  {
    id: "chatbot",
    name: "Chatbot Builder",
    summary: "A 24/7 assistant for your website",
    icon: "smart_toy",
    tier: "smart",
    web: false,
    note: "Test the chatbot with real questions before going live, and make sure it hands anything sensitive or complicated to a person.",
    fields: [
      ...BUSINESS_FIELDS,
      { id: "services", label: "Services, prices or packages (optional)", type: "textarea", hint: "List what you offer — the bot will only quote what you put here." },
      { id: "hours", label: "Opening hours and contact (optional)", type: "text", hint: "e.g. Mon–Sat 9–6, 020 7946 0000" },
      { id: "action", label: "What should the bot get people to do?", type: "select", options: ["Book a call or appointment", "Request a quote", "Leave their contact details", "Buy online", "Visit or call us"] },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    prompt: (f) =>
      `You are a conversational-AI designer. Build a website chatbot for ${f.business}, which sells ${f.offer} to ${f.audience}. Services/prices supplied by the owner: ${f.services || "(none supplied — the bot must not quote prices)"}. Hours and contact: ${f.hours || "(not supplied)"}. The bot's goal: ${f.action}. Tone: ${f.tone}. Deliver: 1) a complete, ready-to-paste SYSTEM PROMPT for the bot (identity, tone, what it can and cannot do, how to guide visitors to the goal, when to hand over to a human, and a rule to never invent prices, availability or policies beyond the information given); 2) a greeting message and 4 quick-reply buttons; 3) the 10 most likely customer questions with the bot's answers, using only the information given (use [PLACEHOLDER] where the owner must fill something in); 4) a lead-capture script that politely collects name, contact and need, with a consent line; 5) where to deploy it without coding — a custom GPT, Microsoft Copilot Studio, or a website chat widget that accepts a system prompt — in 3 short steps each. ${NO_FABRICATION}`,
  },
  {
    id: "followup",
    name: "Follow-up Writer",
    summary: "Messages that turn interest into sales",
    icon: "handshake",
    tier: "smart",
    web: false,
    note: "Be persistent, not pushy — stop when someone says no, and never pressure or mislead.",
    fields: [
      { id: "business", label: "Your business", type: "text", required: true, hint: "e.g. Ada's Kitchen — event catering" },
      { id: "lead", label: "Who you're following up (no personal details)", type: "text", required: true, hint: "e.g. office manager who asked about a Christmas party quote" },
      { id: "stage", label: "Where are they?", type: "select", options: ["New enquiry — not replied yet", "Went quiet after first contact", "Sent a quote, no answer", "Had a call, no decision", "Said 'not now'", "Past customer to win back"] },
      { id: "channel", label: "Channel", type: "select", options: ["Email", "WhatsApp", "SMS / text", "LinkedIn message", "Phone call script"] },
      { id: "tone", label: "Tone", type: "select", options: TONES },
    ],
    prompt: (f) =>
      `You are a sales coach for small businesses. Write a follow-up sequence for ${f.business}. The lead: ${f.lead}. Stage: ${f.stage}. Channel: ${f.channel}. Tone: ${f.tone}. Give 3 messages (or, for a phone call, a call script with an opener, 3 questions, handling of the 3 most likely objections and a close), each with when to send it, the full message written for that channel (short for WhatsApp/SMS), and the goal of that touch. Add value in each message (a tip, a useful idea, a relevant example) rather than just "checking in". The final message is a polite close-the-loop that makes it easy to say no. Use [First name] and placeholders for specifics. Never pressure, mislead or invent deadlines or discounts. End with 2 tips for this stage.`,
  },
];

// The done-for-you service from business.html.
const DONE_FOR_YOU = {
  title: "Prefer us to do it all?",
  text: "Landing pages, emails, social content, lead capture and a 24/7 chatbot — done for you by the British School of Outdoor Education. Book a free 15-minute call and we'll map out exactly what your business needs.",
  email: "john@bsoedu.org",
  subject: "Free marketing call",
};

module.exports = { BUSINESS_TOOLS, DONE_FOR_YOU };
