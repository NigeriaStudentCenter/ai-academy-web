// Lessons 6–8 and the final lesson: feasibility & operations, attendee
// experience & shutdown, promotion, and the Event-Day Crisis Simulator with
// the final assessment.

const { block, q, field, numbered, flow, table, list, ol, QUIZ_BANDS } = require("../kit");

const swot = (exerciseId, title) => ({
  exerciseId,
  title,
  table: { columns: ["Points"], rows: ["Option", "Strengths (internal, helpful)", "Weaknesses (internal, harmful)", "Opportunities (external, helpful)", "Threats (external, harmful)", "Verdict"] },
});

const FEEDBACK = `When the learner types FEEDBACK or END, or after the scenario naturally ends, step out of role and reply in Markdown:
### Your feedback
**What worked:** 2–3 specific moments, quoting the learner.
**Missed opportunities:** 2–3 points linked to course methods.`;

module.exports = [
  // ---------------------------------------------------------------- 6 feasibility & operations
  {
    lessonId: "em-operations",
    title: "6 · Feasibility & Operations",
    lessonOrder: 7,
    duration: "60 minutes",
    objective: "Compare operational options with SWOT, and organise your event with manuals and practical tips.",
    contentBody: `
<h2>Feasibility: which option is better?</h2>
<p>Many things can go wrong at an event. You can't eliminate them — but you can compare options and plan for each one's risks. A flexible tool for this is <strong>SWOT</strong>, which sorts factors by whether they help or harm, and whether they come from inside the option or outside it:</p>
${table(["", "Helpful", "Harmful"], [
  ["<strong>Internal</strong> (the option itself)", "<strong>Strengths</strong>", "<strong>Weaknesses</strong>"],
  ["<strong>External</strong> (the environment)", "<strong>Opportunities</strong>", "<strong>Threats</strong>"],
])}

<h2>Example — visit a business, or bring the demo to the workshop?</h2>
<p>For the AI workshop, should attendees visit a local bakery that already uses AI tools, or should the bakery owner bring a live demo to the workshop?</p>
${table(["", "Visit the bakery", "Bring the demo in"], [
  ["Strengths", "Memorable, real-world experience; a change of scene gives staff a breather.", "More time with the tools; fits neatly into the programme."],
  ["Weaknesses", "Transport, timing and safety logistics; costly.", "Live demos need set-up and reliable internet."],
  ["Opportunities", "The bakery gains publicity and might sponsor the trip.", "The bakery could offer attendees a discount — a win-win."],
  ["Threats", "The bakery may not fit 60 visitors; some attendees may see it as a waste of time.", "If the demo fails, there's nothing else to show."],
])}
<p>Neither option is \"right\" — SWOT makes the trade-offs visible so you can decide, and plan for the threats of whichever you choose.</p>
${block("exercise", "em-solutions")}
${block("exercise", "em-swot-a")}
${block("exercise", "em-swot-b")}

<h2>AI practical exercise — SWOT Challenger</h2>
<p>Your challenger checks each point is in the right quadrant, adds what you missed, and asks which option best serves your objectives.</p>
${block("coach", "em-swot-coach")}

<h2>Event manuals</h2>
<p>Keep a systematic record of everything. Manuals guide you on the day, help others step in, and become your organisation's knowledge for future events:</p>
${table(["Manual", "What it contains"], [
  ["<strong>Master event manual</strong>", "How your organisation runs events: request and contracting forms, standards, guidelines, legal review."],
  ["<strong>Operations manual</strong>", "Everything for this event (see below)."],
  ["<strong>Staff manuals</strong>", "Short, focused guides for each team — registration, security, catering — with only what they need."],
  ["<strong>Report manual</strong>", "The history of the event: planning, delivery and results, shared with stakeholders."],
])}
<p><strong>The operations manual</strong> brings your plan together: WBS; budget; production and logistics schedules; risk register and responses; contracts; responsibilities and task lists; communication protocols (who calls whom, radio channels); catering plan; venue move-in schedule; contact list; media and transport information; shutdown plan; floor plans; power and internet plan; health and safety; security; registration lists; VIP handling; programme and session outlines; special requests; and a place for notes and lessons learned.</p>

<h2>Operational tips</h2>
${list([
  "<strong>A creators' corner.</strong> Give bloggers, journalists and content creators desks with power and good Wi-Fi — they'll share your event, and laptops stay out of the main room.",
  "<strong>Parallel sessions.</strong> Beat overcrowding by running tracks, a poster or demo area, vendor workshops or an exhibition alongside the main programme — people choose what interests them most.",
  "<strong>Solve the \"salt pot\" problem.</strong> Anticipate small requests (water, salt, napkins, chargers) so staff aren't pulled away at the busiest moments.",
  "<strong>Capture your tricks.</strong> Every event teaches you shortcuts. Write them in the manual so the next event benefits.",
])}

<h2>Lesson 6 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-solutions",
        title: "My operational options",
        table: { columns: ["The idea", "Rank (1 = most promising)"], rows: ["Option A", "Option B", "Option C", "Option D"] },
      },
      swot("em-swot-a", "SWOT — my first option"),
      swot("em-swot-b", "SWOT — my second option"),
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "em-swot-coach",
        title: "AI SWOT Challenger",
        intro: "Checks each SWOT point is in the right quadrant, adds what you missed, and asks which option best serves your objectives.",
        usesExercises: ["em-opp", "em-swot-a", "em-swot-b"],
        promptTemplate:
          "Here are my event objectives and two SWOT analyses:\n\n[PASTE YOUR ANSWERS]\n\nPlease check each point is in the right quadrant, add important points I missed, and help me decide which option better serves my objectives — and how to handle its threats.",
        systemPrompt:
          "Exercise: Lesson 6 — SWOT challenger. Check each point sits in the correct quadrant (strengths/weaknesses are internal to the option; opportunities/threats come from outside) and move any that are misplaced, explaining briefly. Add 1–2 important missed points per option, specific to their event. Compare the two options against the learner's stated outcome, purpose and principles (quote them). Recommend which looks stronger with reasons, but leave the decision to them, and suggest how to mitigate the chosen option's biggest threat. Use a compact table.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("In SWOT, \"the venue may not fit everyone\" for a site visit is a:", ["Strength", "Weakness or threat depending on whether it's internal or external", "Opportunity", "Nothing"],
        1, "Capacity at someone else's site is external — a threat."),
      q("Which SWOT factors are internal?", ["Opportunities and threats", "Strengths and weaknesses", "All four", "None"],
        1, "Internal: strengths and weaknesses."),
      q("A staff manual should contain:", ["Everything about the event", "Only what that team needs", "The budget", "Marketing plans"],
        1, "Short and focused."),
      q("Parallel sessions help to:", ["Save money", "Reduce overcrowding and let people choose what interests them", "Shorten the event", "Avoid catering"],
        1, "Spread attendees across tracks."),
      q("The \"salt pot\" problem is about:", ["Seasoning", "Small unanticipated requests pulling staff away at busy moments", "Expensive catering", "Food allergies"],
        1, "Think ahead about small needs."),
    ],
  },

  // ---------------------------------------------------------------- 7 attendee experience & shutdown
  {
    lessonId: "em-experience",
    title: "7 · Attendee Experience & Shutdown",
    lessonOrder: 8,
    duration: "60 minutes",
    objective: "Design a welcome pack, storyboard the attendee journey, and plan a professional shutdown.",
    contentBody: `
<h2>The welcome pack</h2>
<p>A welcome pack given on arrival is a cheap, easy way to make a great first impression. Make it look professional.</p>
${table(["Must have", "Recommended"], [
  ["<strong>Programme</strong> — what happens where and when; if sessions run in parallel, show which overlap and how long it takes to move between them.", "<strong>A useful gift</strong> — a quality bag, a reusable bottle, a power bank. Avoid dated freebies nobody wants."],
  ["<strong>Venue map</strong> — food, toilets, fire exits, first aid, prayer or quiet room, all session rooms, help desk, lost property, parking.", "<strong>Your newsletter</strong> — your chance to promote yourself above your sponsors."],
  ["<strong>Wi-Fi and key contacts</strong>, and how to get help.", "<strong>Product or course catalogue</strong> — and an easy way to buy on the day."],
  ["", "<strong>Sponsor material</strong> — as agreed in contracts; well presented, not overwhelming. Happy sponsors come back."],
])}
<p>Many events now go digital — an event app or a web page — but a printed programme and map still help many attendees. Make both accessible (large print, good contrast, alt text).</p>
${block("exercise", "em-welcome-pack")}
${block("coach", "em-pack-critic")}

<h2>Storyboarding the attendee journey</h2>
<p>Big events are simulated in detail before they happen. You can do a simple version: sketch the event, scene by scene, <strong>from a typical attendee's point of view</strong> — from arriving at the door to heading home. It helps your team see the whole experience and spot gaps.</p>
<p>Attending an event feels like an adventure — people want to escape the everyday, learn something new, or both. Borrow the storytelling formula film-makers use:</p>
${ol([
  "<strong>Big start</strong> — an energising opening that makes a strong first impression.",
  "<strong>The backstory</strong> — set the scene: where we started, where we are, what's at stake.",
  "<strong>Spark curiosity</strong> — pose a question or challenge people want answered, so they stay engaged.",
  "<strong>Resolution and a happy ending</strong> — deliver the answer; always end on a high.",
  "<strong>A cliffhanger</strong> (optional) — a teaser for next time, like the next host city's show at an Olympic closing ceremony.",
])}
${block("exercise", "em-storyboard")}

<h2>Shutdown — the ending people remember</h2>
<p>People often remember the end of an experience more than the start. Plan shutdown as carefully as opening, in your WBS and Gantt chart:</p>
${list([
  "<strong>Crowd dispersal</strong> — avoid everyone leaving at once: stagger session endings or offer optional after-activities.",
  "<strong>Transport</strong> — tell transport providers and taxi firms your finish time.",
  "<strong>VIPs</strong> — plan their exits and any security handover.",
  "<strong>Equipment</strong> — plan when and how the stage and large equipment come down.",
  "<strong>Payments and thanks</strong> — pay suppliers, artists and speakers promptly (many can't wait 90 days) and send thank-you notes.",
  "<strong>Handover</strong> — return the venue as contracted; double-check nothing is left behind.",
  "<strong>Sponsors and grants</strong> — report how their money was used, soon, while memories are fresh.",
  "<strong>Debrief</strong> — collect feedback from attendees and staff, and write up lessons learned.",
])}
${block("exercise", "em-shutdown")}

<h2>Lesson 7 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-welcome-pack",
        title: "My welcome pack design",
        fields: [
          field("format", "Format — printed, digital, or both — and why:"),
          field("must", "Must-have contents for my event:"),
          field("extras", "Recommended extras (gift, newsletter, catalogue, sponsor material):"),
          field("look", "The look and feel — how it creates a strong first impression:"),
          field("access", "How I'll make it accessible:"),
        ],
      },
      {
        exerciseId: "em-storyboard",
        title: "My attendee storyboard",
        table: {
          columns: ["What the attendee sees, hears and does", "What must be in place (staff, signage, kit)"],
          rows: ["Arrival & welcome (big start)", "The backstory", "Sparking curiosity", "Break / lunch", "Resolution & happy ending", "Departure / cliffhanger"],
        },
      },
      {
        exerciseId: "em-shutdown",
        title: "My shutdown checklist",
        table: { columns: ["What I'll do", "Owner", "When"], rows: ["Crowd dispersal", "Transport", "VIPs", "Equipment", "Payments & thanks", "Venue handover", "Sponsor / grant report", "Feedback & debrief"] },
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "em-pack-critic",
        title: "AI Welcome Pack Critic",
        intro: "Scores your welcome pack design on first impression, content and style (0–5 each), then suggests improvements.",
        usesExercises: ["em-my-event", "em-welcome-pack"],
        promptTemplate:
          "Here is my event and my welcome pack design:\n\n[PASTE YOUR ANSWERS]\n\nPlease score it 0–5 for first impression, content and style, explain each score, and suggest three improvements.",
        systemPrompt:
          "Exercise: Lesson 7 — welcome pack critic (replaces the classroom group-scoring competition). Score the learner's design 0–5 on First impression, Content and Style, with a one-line reason each and a total out of 15. Check the must-haves: programme (with parallel-session clarity if relevant), venue map (food, toilets, fire exits, first aid, help desk, quiet/prayer room if relevant), Wi-Fi and contacts. Comment on extras (useful vs dated gifts, sponsor material that's proportionate) and accessibility (large print, contrast, digital alternatives). Suggest three concrete improvements tailored to their event and audience. Be encouraging and specific.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Which is a must-have in a welcome pack?", ["A mouse mat", "A venue map with exits, toilets and first aid", "A sponsor's full catalogue", "A newsletter"],
        1, "Programme and map are essential."),
      q("A storyboard is drawn from the point of view of:", ["The caterer", "A typical attendee", "The venue owner", "The sponsor"],
        1, "It shows the attendee's journey scene by scene."),
      q("In the adventure formula, what comes first?", ["A cliffhanger", "A big start", "The resolution", "The backstory"],
        1, "Big start → backstory → curiosity → resolution → cliffhanger."),
      q("Why stagger the end of sessions?", ["To save money", "To avoid everyone leaving at once and overloading exits and transport", "To keep people longer", "It's tradition"],
        1, "Crowd dispersal."),
      q("When should you report to sponsors?", ["Next year", "Soon after the event, while memories are fresh", "Only if they ask", "Before the event"],
        1, "Prompt reporting builds relationships."),
    ],
  },

  // ---------------------------------------------------------------- 8 promotion
  {
    lessonId: "em-promotion",
    title: "8 · Promoting the Event",
    lessonOrder: 9,
    duration: "60 minutes",
    objective: "Choose a competitive strategy and plan publicity before, during and after the event.",
    contentBody: `
<h2>Two questions for every campaign</h2>
<p>All your planning is wasted if nobody comes. Marketing starts with two questions: <strong>How many</strong> people will attend? And <strong>who</strong>? Understand your audience's needs, and design the event around them.</p>

<h2>Competitive advantage</h2>
<p>Michael Porter describes three generic strategies. Choose one deliberately — events that try to be everything end up \"stuck in the middle\" and appeal to no one.</p>
${table(["Strategy", "What it means for an event"], [
  ["<strong>Cost leadership</strong>", "Run a lean event and charge less. Useful discipline — but a race to the bottom that only one competitor can win."],
  ["<strong>Differentiation</strong>", "Offer something unique — speakers, format, experience, brand — and charge a premium."],
  ["<strong>Focus</strong>", "Target a niche: either the most price-sensitive segment (<em>cost focus</em>) or a specialist audience with a tailored event (<em>differentiation focus</em>)."],
])}

<h2>Pre-event publicity</h2>
${list([
  "<strong>An event web page</strong>, with online ticket sales — you avoid agency fees and learn who's coming. Be transparent about how you use their data, and follow data-protection law (e.g. UK GDPR, Nigeria's NDPA).",
  "<strong>Proof from past events</strong> — videos, photos, testimonials.",
  "<strong>Surveys</strong> — ask your target audience what they want.",
  "<strong>Targeted publications and communities</strong> — industry newsletters, professional groups, WhatsApp and LinkedIn communities.",
  "<strong>Press releases and a press kit</strong> — releases, background stories, media alerts, invitations, photos and video, details of past events, a teaser, and contacts.",
  "<strong>Sponsors and partners</strong> who promote you to their audiences — a win-win.",
  "<strong>Well-known speakers or guests</strong> your audience respects (with their permission to promote).",
  "<strong>An exhibition or showcase</strong>, so there's value even beyond the main programme.",
])}

<h2>Make it easy to share</h2>
<p>Author Seth Godin points out that people only pass an idea on when they understand it, want it to spread, believe sharing it makes them look good or helps others, and find it easy to share. So give people a clear message, a reason to share, and ready-made posts, images and links.</p>

<h2>At-event publicity</h2>
<p>Attendees want to feel they chose well; people who stayed away are future customers.</p>
${list([
  "<strong>First impressions</strong> — design exactly what people see, hear and who they meet at the entrance.",
  "<strong>Useful branded gifts</strong> and product samples.",
  "<strong>Photo moments and live social posts</strong> — with an event hashtag, and consent for photographing attendees.",
  "<strong>Signings, meet-the-speaker sessions and one-to-one consultations</strong> with experts.",
  "<strong>Attendee-only offers</strong> — discounts on sponsors' products or your own.",
  "<strong>Side events</strong> — demos, tours, networking.",
])}

<h2>Post-event publicity</h2>
${list([
  "<strong>Make things right</strong> — if some attendees missed out on something, offer a gesture. It's the gesture that counts.",
  "<strong>Share a short report</strong> — how many came, highlights, what people want next time, agreed next steps, and the date of the next event.",
  "<strong>Official content</strong> — photos, videos and recordings, with a discount for attendees.",
  "<strong>Thank everyone publicly</strong> — speakers, sponsors, volunteers.",
])}
${block("exercise", "em-publicity")}

<h2>AI practical exercise — Sponsor Pitch Role-Play</h2>
<p>The AI plays a potential sponsor's marketing manager — busy, polite and sceptical. Win their support by answering the only question that matters to them: <strong>what's in it for us?</strong> Type <strong>FEEDBACK</strong> for scores.</p>
${block("exercise", "em-sponsor-setup")}
${block("coach", "em-sponsor")}

<h2>Lesson 8 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-publicity",
        title: "My publicity strategy",
        fields: [
          field("compete", "How will I make my event competitive — cost, differentiation or focus? Why?"),
          field("niche", "Am I targeting a niche? How does my strategy fit it?"),
          field("pre", "Pre-event publicity — my top techniques and timeline:"),
          field("share", "How I'll make it easy for people to share:"),
          field("at", "At-event publicity:"),
          field("post", "Post-event publicity:"),
        ],
      },
      {
        exerciseId: "em-sponsor-setup",
        title: "Sponsor pitch setup",
        fields: [
          field("sponsor", "The kind of sponsor I'm approaching (e.g. a bank, a tech company, a local business, a drinks brand):", "text"),
          field("ask", "What I'm asking for (money, products, venue, promotion):"),
          field("offer", "What I can offer them in return:"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "em-sponsor",
        title: "AI Sponsor Pitch Role-Play",
        intro: "The AI plays a sceptical sponsor. Win them over by showing what's in it for them; type FEEDBACK for scores.",
        usesExercises: ["em-my-event", "em-sponsor-setup"],
        promptTemplate:
          "Let's role-play a sponsor pitch. You are the potential sponsor's marketing manager; I'm the event manager.\n\nMy event and what I'm asking for:\n\n[PASTE YOUR ANSWERS]\n\nStart by greeting me briefly — you have 10 minutes. I'll type FEEDBACK when I want your feedback.",
        systemPrompt: `Exercise: Lesson 8 — sponsor pitch role-play. YOU play the marketing manager of the kind of sponsor the learner chose; the learner is the event manager. Stay in role: busy, polite, sceptical, 1–3 sentences per reply. Ask the questions real sponsors ask: Who exactly will attend and how many? How do you know? How does this fit our brand and customers? What visibility and access do we get (logo, stand, speaking slot, data — only with consent)? What will it cost and what's the return? How will you report results? What happens if numbers are low? Warm up when the learner gives specific audience evidence, clear benefits matched to your goals, measurable reporting and a sensible ask; cool down at vague claims ('lots of exposure'), overpromising, or pressure. Near the end, give a realistic decision (yes / maybe with conditions / no). Never ask for real personal data.
${FEEDBACK}
**Scores (1–5):** Audience evidence · What's in it for them · Clarity of the ask · Handling objections · Professionalism
**Try this line instead:** one improved version of their weakest answer.`,
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Porter's three generic strategies are:", ["Price, product, place", "Cost leadership, differentiation, focus", "Pre, at and post event", "Strengths, weaknesses, threats"],
        1, "Choose one deliberately."),
      q("Why can cost leadership be risky?", ["It's illegal", "It's a race to the bottom that only one competitor can win", "Customers hate low prices", "It needs sponsors"],
        1, "There can only be one cheapest."),
      q("Selling tickets on your own web page helps because:", ["It's free forever", "You avoid agency fees and learn who's coming — used lawfully and transparently", "You don't need a venue", "Sponsors require it"],
        1, "Respect data-protection law."),
      q("According to Seth Godin, people share an idea when:", ["It's long and detailed", "They understand it, want it to spread, it helps them, and it's easy to share", "They're paid", "It's secret"],
        1, "Make sharing easy and rewarding."),
      q("A good post-event step is:", ["Say nothing", "Share a short report with highlights, next steps and the next date", "Delete the photos", "Ask for more money"],
        1, "Keep the relationship going."),
    ],
  },

  // ---------------------------------------------------------------- final: crisis simulator & assessment
  {
    lessonId: "em-final",
    title: "Final: Event-Day Crisis Simulator & Your Event Plan",
    lessonOrder: 10,
    duration: "90 minutes",
    objective: "Handle live incidents on the day, then submit your complete event plan for assessment.",
    contentBody: `
<h2>Event day</h2>
<p>Everything you've planned meets reality. However good your plan, something will go off-script. What matters is staying calm, protecting people, using your contingency plans and keeping attendees informed.</p>
${flow(["STOP — take a breath", "SAFETY FIRST — is anyone at risk?", "CHECK your contingency plan", "DECIDE and delegate", "COMMUNICATE — team, attendees, suppliers", "LOG it — for the debrief"])}

<h2>AI practical exercise — Event-Day Crisis Simulator</h2>
<p>Your event is live. The AI is your event control desk and will radio through four incidents, one at a time, based on your event and risk register. Tell it exactly what you do. It will tell you what happens next. Type <strong>FEEDBACK</strong> at any time for your debrief.</p>
${block("coach", "em-crisis")}
${block("exercise", "em-crisis-reflection")}

<h2>Your event plan — 50-mark assessment</h2>
<p>Your assessment is your complete plan for My Event, built through the course. Review and update each part on its lesson page, then write your one-page summary below.</p>
${table(["Part (10 marks each)", "Submitted work"], [
  ["A — Objectives &amp; screening", "Lesson 2: objectives and screening"],
  ["B — Work breakdown &amp; budget", "Lesson 3: WBS, budget and pricing"],
  ["C — Schedule &amp; risk", "Lesson 4: schedule, critical path and risk register"],
  ["D — Venue &amp; attendee experience", "Lessons 5 &amp; 7: venue trade-off, welcome pack, storyboard, shutdown"],
  ["E — Promotion &amp; one-page summary", "Lesson 8: publicity strategy, plus the summary below"],
])}
${block("exercise", "em-summary")}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads your whole plan. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "em-review")}

<h2>Your submission</h2>
${block("portfolio")}

<h2>Remember</h2>
${list([
  "Begin with the end in mind: outcome, purpose, principles.",
  "Screen ideas before you commit — marketing, operations, finance.",
  "Break it down, cost it with evidence, add contingency, price it properly.",
  "Know your critical path; plan for your biggest risks.",
  "No venue is perfect — make the trade-offs visible.",
  "Design the attendee's journey from the door to the way home.",
  "End as well as you start — and learn from every event.",
])}
`,
    exercises: [
      {
        exerciseId: "em-crisis-reflection",
        title: "After the simulator",
        fields: [
          field("best", "The incident I handled best, and why:"),
          field("worst", "The incident I found hardest — what I'd do differently:"),
          field("plan", "What I'll add to my risk register or operations manual:"),
        ],
      },
      {
        exerciseId: "em-summary",
        title: "My one-page event plan summary",
        fields: [
          field("event", "The event — what, who, when, where, how many:"),
          field("objectives", "Outcome, purpose and key principles:"),
          field("money", "Budget, ticket price and break-even:"),
          field("timeline", "Key milestones and my critical path:"),
          field("risks", "Top three risks and how I'll handle them:"),
          field("venue", "Venue choice and why:"),
          field("experience", "The attendee experience in three sentences:"),
          field("promotion", "How I'll fill the room:"),
          field("success", "How I'll measure success afterwards:"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "em-crisis",
        title: "AI Event-Day Crisis Simulator",
        intro: "Your event control desk radios through four live incidents based on your event and risk register. Respond to each; type FEEDBACK for your debrief.",
        usesExercises: ["em-my-event", "em-risks"],
        promptTemplate:
          "It's event day. You are my event control desk.\n\nMy event and risk register:\n\n[PASTE YOUR ANSWERS]\n\nRadio through the first incident. I'll tell you what I do. Type FEEDBACK when I want my debrief.",
        systemPrompt: `Exercise: final — Event-Day Crisis Simulator. YOU are the event control desk; the learner is the event manager. Using their event, run FOUR incidents in time order, one at a time, each as a short radio message with a timestamp (e.g. "[09:10] Control to event manager: …"). Make them realistic for their event and vary them: at least one from their own risk register, one they didn't list, one attendee-experience problem (e.g. a long queue, a catering or dietary issue, a VIP arriving early, an angry attendee), and one operational or safety issue (e.g. keynote speaker stuck in traffic, Wi-Fi or power failure, overcrowded room, a lost child, a guest feeling unwell, a supplier no-show, sudden rain at an outdoor area). After each learner response, report realistic consequences in 1–3 sentences (better if they stayed calm, prioritised safety, used a contingency, delegated, and kept attendees informed; worse if not), then move to the next incident. For any medical or safety incident, reward calling trained first aiders / emergency services and following venue procedures; never give medical instructions yourself.
${FEEDBACK}
**Scores (1–5):** Calm & prioritisation · Safety first · Use of contingency plans · Communication · Attendee experience
**Add to your risk register:** 1–3 risks this revealed.`,
      },
      {
        coachId: "em-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on your whole event plan against the marking criteria. Its marks are indicative only.",
        usesExercises: ["em-opp", "em-screening", "em-wbs", "em-budget", "em-pricing", "em-critical", "em-risks", "em-tradeoff", "em-storyboard", "em-shutdown", "em-publicity", "em-summary"],
        promptTemplate:
          "Please review my event plan (Parts A–E, 10 marks each).\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing, and one improvement. Do not rewrite my plan for me.",
        systemPrompt:
          "Exercise: Event Management final assessment review (formative). Indicative criteria, 2 marks each:\nA Objectives & screening — specific outcome; clear purpose; complete principles; ideas screened on marketing, operations and finance; evidence or reasoning behind screening.\nB WBS & budget — logical WBS branches; work packages specific enough to assign; budget covers typical costs with sources noted; contingency ~5%; correct cost-per-head and pricing arithmetic.\nC Schedule & risk — tasks with durations and dependencies; correct critical path; buffers or plan B on critical tasks; risk register scored C × L correctly; concrete contingency plans for top risks.\nD Venue & attendee experience — weighted trade-off completed sensibly; accessibility considered; welcome pack/storyboard covers the attendee journey; catering and layout fit the event; shutdown checklist with owners.\nE Promotion & summary — clear competitive strategy; pre/at/post publicity; data protection considered; summary is coherent and consistent with the other parts; success measures defined.\nFor each part give what is strong (quote them), what's missing, one improvement, and an indicative mark out of 10 (empty parts score 0). Check the arithmetic in the budget and risk register. Then an indicative total out of 50 and band (40–50 Strong; 30–39 Developing; 20–29 Foundation; below 20 review the course). State that marks are indicative and the tutor gives the final mark. Do not rewrite their plan.",
      },
    ],
    portfolio: [
      { exerciseId: "em-opp", title: "A — Objectives (10 marks)", lessonId: "em-objectives-lesson" },
      { exerciseId: "em-screening", title: "A — Screening", lessonId: "em-objectives-lesson" },
      { exerciseId: "em-wbs", title: "B — Work Breakdown Structure (10 marks)", lessonId: "em-budgeting" },
      { exerciseId: "em-budget", title: "B — Budget", lessonId: "em-budgeting" },
      { exerciseId: "em-pricing", title: "B — Pricing and income", lessonId: "em-budgeting" },
      { exerciseId: "em-schedule", title: "C — Schedule (10 marks)", lessonId: "em-timing-risk" },
      { exerciseId: "em-critical", title: "C — Critical path", lessonId: "em-timing-risk" },
      { exerciseId: "em-risks", title: "C — Risk register", lessonId: "em-timing-risk" },
      { exerciseId: "em-tradeoff", title: "D — Venue trade-off (10 marks)", lessonId: "em-venue" },
      { exerciseId: "em-welcome-pack", title: "D — Welcome pack", lessonId: "em-experience" },
      { exerciseId: "em-storyboard", title: "D — Attendee storyboard", lessonId: "em-experience" },
      { exerciseId: "em-shutdown", title: "D — Shutdown checklist", lessonId: "em-experience" },
      { exerciseId: "em-publicity", title: "E — Publicity strategy (10 marks)", lessonId: "em-promotion" },
      { exerciseId: "em-summary", title: "E — One-page event plan summary", lessonId: "em-final" },
    ],
  },
];
