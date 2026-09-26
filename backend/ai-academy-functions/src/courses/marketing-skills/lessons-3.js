// Lessons 7–8 and the final: promotion & branding, best practices, and the
// launch pitch panel with the marketing plan assessment.

const { block, q, field, numbered, flow, table, list, ol, QUIZ_BANDS } = require("../kit");

module.exports = [
  // ---------------------------------------------------------------- 7 promotion & branding
  {
    lessonId: "mk-promotion",
    title: "7 · Promotion & Branding",
    lessonOrder: 8,
    duration: "75 minutes",
    objective: "Combine the elements of promotion — offline and digital — and build a brand people trust.",
    contentBody: `
<h2>The promotion mix</h2>
<p>Once you've decided product, price and place, promotion tells your target customers about it and persuades them to act. There are four classic elements:</p>
${table(["Element", "What it is", "Examples"], [
  ["<strong>Advertising</strong>", "Paid messages in media you don't own.", "Social media and search ads, TV, radio, billboards, bus and taxi branding, cinema, print, sponsored podcasts."],
  ["<strong>Public relations (PR)</strong>", "Managing reputation and earning coverage — much of it unpaid (\"earned\") because it's newsworthy.", "Press releases, launch events, media interviews, responding to a crisis, community projects, awards."],
  ["<strong>Personal selling</strong>", "People promoting and selling face to face or online.", "One-to-one (a sales visit), one-to-many (an exhibition demo), many-to-many (a group showcase), many-to-one (a team pitching to a CEO)."],
  ["<strong>Sales promotion</strong>", "Short-term incentives to buy now, or to stock and push the product.", "Bundles, vouchers, buy-one-get-one, loyalty points, free trials, loss leaders, happy hours, pay-later offers; for retailers — display incentives, free stands, staff training, stocking discounts."],
])}

<h2>Digital channels — paid, owned and earned</h2>
${table(["Type", "What it means", "Examples"], [
  ["<strong>Owned</strong>", "Channels you control.", "Website, email list, WhatsApp broadcast list, social media accounts, blog, app."],
  ["<strong>Paid</strong>", "You pay for reach.", "Search ads, social ads, influencer partnerships, sponsored content."],
  ["<strong>Earned</strong>", "Others share you for free.", "Reviews, shares, word of mouth, press coverage, user-generated content."],
])}
<p>Build owned channels you can rely on, use paid media to reach new people, and earn attention by being worth talking about. Measure what works: reach, clicks, leads, cost per sale, repeat purchases.</p>
<p><strong>Stay honest and legal.</strong> Ads must not mislead. Influencer and paid posts must be clearly labelled (e.g. #ad). Never buy or write fake reviews. Only send marketing emails and messages to people who have agreed to receive them. Advertising regulators — such as the ASA in the UK and ARCON in Nigeria — can act against misleading marketing.</p>

<h2>Word of mouth and going viral</h2>
<p>People pass on ideas that are interesting, useful or tell a good story. Seth Godin suggests an idea spreads only if both sides are willing:</p>
${table(["Someone sends an idea when…", "Someone takes it in when…"], [
  ["they want it to spread;", "the first impression makes them want to know more;"],
  ["sharing it makes them look good or helps them or others;", "they already understand the ideas it builds on;"],
  ["sharing it takes less effort than the benefit it brings.", "they trust or respect the sender enough to pay attention."],
])}
<p>So make your message easy to understand, worth sharing, and easy to pass on — and get it into the hands of people others trust.</p>

<h2>Branding</h2>
<p>Your brand is the image customers hold of you — built from your name, logo, colours, tone of voice, and every experience they have with you. Branding isn't mainly about selling; it's about making customers see you as the obvious choice for their need. A strong brand:</p>
${list([
  "<strong>establishes credibility</strong> — people trust it;",
  "<strong>motivates people to buy</strong> — it connects with what they want;",
  "<strong>communicates clearly</strong> — its message, image and vision are easy to grasp;",
  "<strong>reflects its customers</strong> — people feel comfortable being associated with it.",
])}
<p><strong>Example — easyJet.</strong> When it launched in the 1990s, easyJet wanted to make flying as affordable as a pair of jeans and to cut out the travel agent. It painted its booking phone number in huge orange digits on the side of its planes — impossible to miss, with a clear call to action. As it grew, its messaging evolved with the market: calling itself \"the web's favourite airline\" was a cheeky nod to British Airways' \"the world's favourite airline\". Brands should evolve as the business and market change.</p>

<h2>Practice — analyse real ads</h2>
${block("exercise", "mk-ad-analysis")}

<h2>Practice — your promotion mix</h2>
${block("exercise", "mk-promo-mix")}

<h2>AI practical exercise — Ad Critic</h2>
<p>Write a short ad for My Product — a social post, a radio script, a billboard or a WhatsApp message. The Ad Critic scores it and helps you sharpen it.</p>
${block("exercise", "mk-my-ad")}
${block("coach", "mk-ad-critic")}

<h2>Lesson 7 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-ad-analysis",
        title: "Good ad, bad ad",
        fields: [
          field("good", "An excellent ad I've seen recently — what it was, who it targeted, and why it worked:"),
          field("bad", "A poor ad I've seen recently — why it failed:"),
          field("rules", "My list of what makes a good ad (and what to avoid):"),
        ],
      },
      {
        exerciseId: "mk-promo-mix",
        title: "My promotion mix",
        table: {
          columns: ["What we do now", "What works / doesn't — why", "What I'll try"],
          rows: ["Advertising", "Public relations", "Personal selling", "Sales promotion", "Owned digital channels", "Earned — reviews and word of mouth"],
        },
      },
      {
        exerciseId: "mk-my-ad",
        title: "My ad",
        fields: [
          field("format", "Format (e.g. Instagram post, radio script, billboard, WhatsApp broadcast):", "text"),
          field("target", "Target segment:", "text"),
          field("copy", "My ad copy (and a description of any image or video):"),
          field("cta", "The call to action — exactly what I want people to do:"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-ad-critic",
        title: "AI Ad Critic",
        intro: "Scores your ad on attention, relevance to the target, clarity of benefit, call to action and honesty — then offers two sharper versions.",
        usesExercises: ["mk-my-product", "mk-target", "mk-my-ad"],
        promptTemplate:
          "Here is my product, my positioning and my ad:\n\n[PASTE YOUR ANSWERS]\n\nPlease score my ad and suggest two sharper versions.",
        systemPrompt:
          "Exercise: Lesson 7 — Ad Critic. Score the learner's ad 1–5 on: Attention (would the target stop scrolling/look?), Relevance to the target segment and positioning, Benefit clarity (need, not just features), Call to action (specific, easy), and Honesty & compliance (no misleading claims, ad labelling if influencer, no unverifiable superlatives like 'best in Nigeria' without proof). Give a one-line reason for each and a total out of 25. Check it fits the format (e.g. billboard ≤ ~7 words; radio needs repetition of the brand and CTA). Then write two improved versions in their voice and format, keeping only claims they can support. Be encouraging and concise.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("A glowing newspaper article about your launch, which you didn't pay for, is:", ["Advertising", "Earned media / PR", "Sales promotion", "Personal selling"],
        1, "PR earns coverage because it's newsworthy."),
      q("\"Buy one, get one free\" is an example of:", ["Branding", "Sales promotion", "PR", "Distribution"],
        1, "A short-term incentive."),
      q("Which is an owned channel?", ["A billboard you rent", "Your email list and website", "A newspaper review", "A friend's post about you"],
        1, "You control it."),
      q("Influencer posts you pay for must:", ["Be hidden", "Be clearly labelled as ads", "Avoid mentioning the product", "Be written by you"],
        1, "Honest disclosure is required."),
      q("A strong brand mainly helps customers:", ["Find the cheapest option", "See you as the credible, obvious choice for their need", "Ignore competitors' prices", "Buy more than they need"],
        1, "Credibility, motivation and clarity."),
    ],
  },

  // ---------------------------------------------------------------- 8 best practices
  {
    lessonId: "mk-best-practice",
    title: "8 · Marketing Best Practices",
    lessonOrder: 9,
    duration: "30 minutes",
    objective: "Apply five habits that turn interest into sales and loyal customers.",
    contentBody: `
<h2>Five habits of effective marketing</h2>
<h3>1. Educate your customers</h3>
<p>Would you buy from someone you know nothing about, with your questions unanswered? Companies that go out of their way to explain their product — honestly, even comparing it fairly with alternatives — earn trust. Guides, demos, videos, FAQs and workshops all educate.</p>
<h3>2. Tell people exactly what to do</h3>
<p>Customers often know their problem better than the solution. Give them the information, then a clear, specific next step: \"WhatsApp us on 0800 000 0000 before Friday for a free home assessment\" — not \"contact us\". If you want an email, say what should be in it. If you want a visit, say where and when.</p>
<h3>3. Show what you've done for them</h3>
<p>Many organisations do valuable work their customers never hear about: the testing behind a design, the new feature they asked for, the price you held despite rising costs. Tell them. People stay with companies that clearly know what they're doing.</p>
<h3>4. Don't let customers carry the risk</h3>
<p>New or unfamiliar products feel risky. <strong>De-risk</strong> them: guarantees, free trials, demos, money-back promises, case studies, reviews and testimonials. Removing risk can give you a big advantage over competitors — and early adopters who feel safe will spread the word.</p>
<h3>5. Add bonuses</h3>
<p>Keep increasing the value customers get: extended warranties; after-sales and live chat support; free or cheap delivery; easy returns; bundles; loyalty discounts; free accessories; partner perks.</p>
${block("exercise", "mk-habits")}

<h2>Scenario</h2>
${block("scenario", "mk-cta")}

<h2>Lesson 8 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-habits",
        title: "Five habits for My Product",
        table: {
          columns: ["What I'll do"],
          rows: ["1. How I'll educate customers", "2. My exact call to action", "3. What I'll tell customers I've done for them", "4. How I'll de-risk buying", "5. Bonuses I could add"],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "mk-cta",
        title: "The call to action",
        question: "Which call to action is strongest?",
        options: [
          "\"Contact us for more information.\"",
          "\"Book your free 20-minute energy assessment on WhatsApp at 0800 000 0000 — slots this week only.\"",
          "\"We're the best.\"",
          "\"Visit us sometime.\"",
        ],
        answer: 1,
        explanation: "It says exactly what to do, how, and why now — and de-risks it by being free.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why educate customers?", ["To delay the sale", "It builds trust and answers the questions that stop people buying", "It's required by law", "To confuse competitors"],
        1, "Informed customers buy with confidence."),
      q("A good call to action is:", ["Vague and friendly", "Specific: what to do, how and by when", "Hidden at the bottom", "Optional"],
        1, "Tell people exactly what to do."),
      q("Which is a way to de-risk a purchase?", ["Removing the returns policy", "A money-back guarantee or free trial", "Raising the price", "Hiding reviews"],
        1, "Take the risk off the customer."),
      q("\"Show what you've done for them\" means:", ["Boasting about profits", "Telling customers about the work, testing and improvements that benefit them", "Sending more ads", "Discounting"],
        1, "Customers value visible expertise."),
      q("Which is a bonus that adds value?", ["Hidden fees", "Free delivery or an extended warranty", "Shorter support hours", "Stricter returns"],
        1, "Keep increasing value."),
    ],
  },

  // ---------------------------------------------------------------- final
  {
    lessonId: "mk-final",
    title: "Final: Launch Pitch & Your Marketing Plan",
    lessonOrder: 10,
    duration: "90 minutes",
    objective: "Pitch My Product to a panel of target customers, then submit your complete marketing plan.",
    contentBody: `
<h2>Bringing it all together</h2>
${flow(["SITUATION — 5 C's, PEST, SWOT", "CUSTOMERS — how they decide", "STRATEGY — segment, target, position", "MIX — product, price, place, promotion", "EXECUTE — launch, measure, adjust"])}

<h2>AI practical exercise — the Launch Pitch Panel</h2>
<p>You're launching My Product. The AI plays a panel of three people from your target segment. Pitch it to them, answer their questions, and find out whether they'd buy — and what would change their minds. Type <strong>VERDICT</strong> when you've finished pitching.</p>
${block("coach", "mk-panel")}
${block("exercise", "mk-panel-reflection")}

<h2>Your marketing plan — 50-mark assessment</h2>
<p>Your assessment is the marketing plan for My Product that you've built through the course. Review and update each part on its lesson page, then complete the one-page plan below.</p>
${table(["Part (10 marks each)", "Submitted work"], [
  ["A — Situational analysis", "Lesson 1: 5 C's"],
  ["B — Customers &amp; strategy", "Lessons 2–3: buyer decision form, segments, targeting and positioning"],
  ["C — Product &amp; price", "Lessons 4–5: life cycle and pricing"],
  ["D — Place &amp; promotion", "Lessons 6–7: channels, promotion mix and ad"],
  ["E — One-page marketing plan", "Below — including budget, timeline and how you'll measure success"],
])}
${block("exercise", "mk-plan")}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads your whole plan. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "mk-review")}

<h2>Your submission</h2>
${block("portfolio")}

<h2>Remember</h2>
${list([
  "Start with the customer, not the product.",
  "Know your situation: company, collaborators, customers, competitors, climate.",
  "Influence every step of the buyer's decision — and what happens after.",
  "Segment by needs, target what you can win, position clearly.",
  "Price with purpose — legally and honestly.",
  "Be where your customers buy, and make buying easy.",
  "Be remarkable, tell people exactly what to do, and take the risk off them.",
])}
`,
    exercises: [
      {
        exerciseId: "mk-panel-reflection",
        title: "After the pitch",
        fields: [
          field("landed", "What landed well with the panel:"),
          field("objections", "The objections I need to answer better:"),
          field("change", "What I'll change in my product, price, place or promotion:"),
        ],
      },
      {
        exerciseId: "mk-plan",
        title: "My one-page marketing plan",
        fields: [
          field("summary", "Product and opportunity in two sentences:"),
          field("target", "Target segment and positioning statement:"),
          field("product", "Product decisions (and life-cycle stage):"),
          field("price", "Price and pricing objective:"),
          field("place", "Channels:"),
          field("promotion", "Promotion — key messages, channels and call to action:"),
          field("budget", "Marketing budget and timeline (first 90 days):"),
          field("measure", "How I'll measure success (e.g. leads, conversion rate, cost per sale, repeat purchases, reviews):"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-panel",
        title: "AI Launch Pitch Panel",
        intro: "A panel of three people from your target segment hears your pitch, asks questions, and gives a buy / maybe / no verdict. Type VERDICT when you've finished.",
        usesExercises: ["mk-my-product", "mk-target", "mk-pricing"],
        promptTemplate:
          "I'm launching my product and I'd like to pitch it to a panel from my target segment.\n\n[PASTE YOUR ANSWERS]\n\nPlease introduce the three panel members briefly, then invite my pitch. I'll type VERDICT when I've finished.",
        systemPrompt:
          "Exercise: final — Launch Pitch Panel (replaces the classroom group presentation). Create THREE distinct, realistic panel members from the learner's target segment (name, one-line situation, what they care about most — e.g. one price-focused, one sceptical about quality/trust, one enthusiastic early adopter). Introduce them in 3 short lines and invite the pitch. After the learner pitches, each member asks one pointed question in character; continue for up to 3 rounds, reacting realistically (warmer with clear benefits, evidence, fair price, easy buying, de-risking; cooler with vague claims, jargon, or unanswered objections). When the learner types VERDICT, reply in Markdown: ### Panel verdict — each member: Buy / Maybe / No with a one-line reason; **What would turn the Maybes and Nos into Yes:** 3 bullets; **Scores (1–5):** Customer need · Positioning clarity · Value for money · Trust & de-risking · Call to action; **Try this line instead:** one improved pitch line. Keep claims tied to what the learner said.",
      },
      {
        coachId: "mk-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on your whole marketing plan against the marking criteria. Its marks are indicative only.",
        usesExercises: ["mk-5cs", "mk-decision", "mk-segments", "mk-target", "mk-plc-mine", "mk-pricing", "mk-channels", "mk-promo-mix", "mk-plan"],
        promptTemplate:
          "Please review my marketing plan (Parts A–E, 10 marks each).\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing, and one improvement. Do not rewrite my plan for me.",
        systemPrompt:
          "Exercise: Marketing Skills final assessment review (formative). Indicative criteria, 2 marks each:\nA Situational analysis — all 5 C's covered; specific customer insight; competitors named and positioned; relevant PEST factors; a clear gap/opportunity.\nB Customers & strategy — buyer steps addressed with concrete tactics incl. after-purchase; needs-based, distinct segments; justified target choice; appropriate coverage strategy; clear, provable positioning statement.\nC Product & price — life-cycle stage evidenced; mix fits the stage; clear pricing objective consistent with strategy; costs and competitors considered; legal/ethical awareness (no price-fixing, no misleading prices).\nD Place & promotion — channels suit product and target; channel partners motivated; balanced promotion mix incl. digital (owned/paid/earned); clear message and call to action; honest, compliant advertising.\nE One-page plan — coherent and consistent with A–D; realistic budget and 90-day timeline; measurable KPIs; de-risking/value-adds included; clear next steps.\nFor each part give what is strong (quote them), what's missing, one improvement, and an indicative mark out of 10 (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong; 30–39 Developing; 20–29 Foundation; below 20 review the course). State that marks are indicative and the tutor gives the final mark. Do not rewrite their plan.",
      },
    ],
    portfolio: [
      { exerciseId: "mk-5cs", title: "A — Situational analysis: 5 C's (10 marks)", lessonId: "mk-intro" },
      { exerciseId: "mk-decision", title: "B — Buyer decision form (10 marks)", lessonId: "mk-customers" },
      { exerciseId: "mk-segments", title: "B — Segments", lessonId: "mk-stp" },
      { exerciseId: "mk-target", title: "B — Targeting and positioning", lessonId: "mk-stp" },
      { exerciseId: "mk-plc-mine", title: "C — Product life cycle (10 marks)", lessonId: "mk-product" },
      { exerciseId: "mk-pricing", title: "C — Pricing", lessonId: "mk-price" },
      { exerciseId: "mk-channels", title: "D — Channel plan (10 marks)", lessonId: "mk-place" },
      { exerciseId: "mk-promo-mix", title: "D — Promotion mix", lessonId: "mk-promotion" },
      { exerciseId: "mk-my-ad", title: "D — My ad", lessonId: "mk-promotion" },
      { exerciseId: "mk-plan", title: "E — One-page marketing plan (10 marks)", lessonId: "mk-final" },
    ],
  },
];
