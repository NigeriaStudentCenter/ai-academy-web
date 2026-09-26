// Lessons 1–3: introduction to marketing, understanding customers, STP.

const { block, q, field, numbered, flow, table, list, ol, QUIZ_BANDS } = require("../kit");

module.exports = [
  // ---------------------------------------------------------------- 1 introduction
  {
    lessonId: "mk-intro",
    title: "1 · Introduction to Marketing",
    lessonOrder: 2,
    duration: "50 minutes",
    objective: "Understand how modern marketing works, size your market, and run a situational analysis.",
    contentBody: `
<h2>What is marketing?</h2>
<p>Marketing is the work of understanding what customers need — now and in the future — and delivering offers that create value for them (and for society), profitably. It shapes strategy first, and then sales techniques, customer relationships and communication follow from it.</p>

<h2>How the approach has changed</h2>
${table(["Focus", "The idea", "When it works", "The risk"], [
  ["<strong>Production</strong>", "Make lots, cheaply, to benefit from economies of scale.", "Established products where cost wins.", "Customers' tastes change and you're left with lots of the wrong thing."],
  ["<strong>Product</strong>", "Keep improving quality; good products sell themselves.", "Out-engineering competitors.", "Great quality at something customers no longer want."],
  ["<strong>Selling</strong>", "Push what you have with promotion and sales techniques.", "Clearing old stock quickly.", "Ignores what customers actually need."],
  ["<strong>Marketing</strong>", "Research what customers want now and next, then design, price, distribute and promote to meet it.", "Mature, competitive markets — i.e. most markets today.", "Needs continuous research and listening."],
])}
<p>As markets mature, the focus shifts towards marketing. Today you don't start with \"what can we make?\" but with \"what do customers need?\" — and product design and marketing shape each other. Many organisations now add a further layer: long-term <strong>societal and sustainable</strong> value, because customers increasingly judge companies by their impact.</p>

<h2>What is \"the market\"?</h2>
${flow([
  "Potential market — people interested in the product",
  "Available market — interested and able to afford it",
  "Qualified available market — also legally able to buy and use it",
  "Target market — the part you choose to pursue",
  "Penetrated market — those who have already bought",
])}
<p>Market size is never fixed: laws change, populations grow, incomes rise and fall, and your own prices move people between levels.</p>

<h2>The marketing process</h2>
${ol([
  "<strong>Situational analysis</strong> — where are we, where is the market going, where are the gaps?",
  "<strong>Marketing strategy</strong> — segment, target and position (STP).",
  "<strong>Marketing mix</strong> — decide the 4 P's: product, price, place and promotion.",
  "<strong>Execution and monitoring</strong> — launch, measure, and adjust as the market changes.",
])}

<h2>Situational analysis</h2>
<p>Look at the current market (and how it got here), its direction (trends), and the <strong>gaps</strong> between what customers want and what's on offer. Two useful tools:</p>
<h3>The 5 C's</h3>
${table(["C", "What to analyse"], [
  ["<strong>Company</strong>", "Mission and goals; current and desired image; product range; technology and experience; culture."],
  ["<strong>Collaborators</strong>", "Distributors, suppliers, partners and alliances."],
  ["<strong>Customers</strong>", "Market size and growth; segments; the benefits they want (tangible and intangible); motivations; where they buy and get information; how they decide; seasonality; frequency and loyalty; impulse vs careful buying."],
  ["<strong>Competitors</strong>", "Current and potential competitors; their products and positioning; direct and indirect competition; market shares."],
  ["<strong>Climate</strong>", "The wider environment — usually analysed with PEST (below)."],
])}
<h3>PEST</h3>
${table(["Factor", "Examples"], [
  ["<strong>Political</strong> (and legal)", "Government policy, trade rules, tax, competition law, intellectual property, labelling and advertising rules."],
  ["<strong>Economic</strong>", "Inflation, interest and exchange rates, growth, labour costs, infrastructure (power, internet, roads)."],
  ["<strong>Social</strong>", "Demographics, education, culture, attitudes, lifestyle trends."],
  ["<strong>Technological</strong>", "New technologies, digital adoption (e.g. mobile payments), how technology changes your product."],
])}
<p>PEST factors are largely outside your control and often appear as threats — but they also create opportunities. Analyse them for each country you sell in.</p>
${block("exercise", "mk-5cs")}
${block("coach", "mk-situation-coach")}

<h2>Sales vs marketing</h2>
<p><strong>Marketing</strong> prepares the customer: brand, advertising, PR, content, word of mouth — generating interest and leads. <strong>Sales</strong> converts them: conversations, demonstrations, proposals and closing, then keeping customers loyal. Think of a funnel: marketing fills the top, sales works the bottom. Each depends on the other — weak marketing starves sales of leads; poor selling wastes the leads marketing worked hard for.</p>

<h2>Lesson 1 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-5cs",
        title: "5 C's analysis of My Product",
        fields: [
          field("company", "Company — goals, image, range, capabilities, culture:"),
          field("collaborators", "Collaborators — distributors, suppliers, partners:"),
          field("customers", "Customers — who they are, what they value, how and where they buy:"),
          field("competitors", "Competitors — direct and indirect, and how they position themselves:"),
          field("climate", "Climate (PEST) — the political, economic, social and technological factors that matter most:"),
          field("gap", "The biggest gap or opportunity I can see:"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-situation-coach",
        title: "AI Situational Analysis Coach",
        intro: "Reviews your 5 C's, points out gaps and assumptions, and helps you sharpen the market opportunity.",
        usesExercises: ["mk-my-product", "mk-5cs"],
        promptTemplate:
          "Here is my product and my 5 C's analysis:\n\n[PASTE YOUR ANSWERS]\n\nPlease tell me which parts are strong, which are vague or based on assumptions, what I might be missing (especially in PEST), and how I could turn my biggest gap into a clear opportunity statement. Suggest two quick pieces of research I could do.",
        systemPrompt:
          "Exercise: Lesson 1 — situational analysis coach. Review the learner's 5 C's for their product. For each C, note what's specific versus vague, and flag assumptions that need evidence. Add 2–3 relevant PEST factors they may have missed for their country/region (e.g. inflation and FX for imported goods, power/internet reliability, mobile-money adoption, regulation). Help them write a one-sentence opportunity statement ('Customers in [segment] need [need] but currently [gap]; we can [how]'). Suggest two quick, low-cost research actions (e.g. 10 customer conversations, competitor price check, reading reviews). Keep it concise.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Which approach starts by researching what customers need?", ["Production focus", "Selling focus", "Marketing focus", "Product focus"],
        2, "Marketing orientation starts with the customer."),
      q("The \"qualified available market\" is people who are:", ["Interested", "Interested and can afford it", "Interested, can afford it, and can legally buy and use it", "Already customers"],
        2, "Each level narrows the one before."),
      q("In the 5 C's, distributors and suppliers are:", ["Company", "Collaborators", "Competitors", "Climate"],
        1, "Collaborators."),
      q("Exchange rates and inflation belong in which part of PEST?", ["Political", "Economic", "Social", "Technological"],
        1, "Economic factors."),
      q("How do sales and marketing relate?", ["They're the same thing", "Marketing fills the funnel with interest and leads; sales converts and retains", "Sales is more important", "Marketing only means advertising"],
        1, "Each depends on the other."),
    ],
  },

  // ---------------------------------------------------------------- 2 understanding customers
  {
    lessonId: "mk-customers",
    title: "2 · Understanding Customers",
    lessonOrder: 3,
    duration: "60 minutes",
    objective: "Compare yourself with competitors using SWOT, and influence each step of the buyer's decision.",
    contentBody: `
<h2>SWOT — you versus the competition</h2>
<p>SWOT sorts factors by whether they help or harm, and whether they're internal (your organisation) or external (the market):</p>
${table(["", "Helpful", "Harmful"], [
  ["<strong>Internal</strong>", "<strong>Strengths</strong> — how can we <em>use</em> each one?", "<strong>Weaknesses</strong> — how can we <em>stop</em> each one?"],
  ["<strong>External</strong>", "<strong>Opportunities</strong> — how can we <em>exploit</em> each one?", "<strong>Threats</strong> — how can we <em>defend</em> against each one?"],
])}
<p>Asking those four questions turns a SWOT from a list into a strategy. A mind map — SWOT in the middle, four branches, then sub-branches — is a great way to brainstorm it.</p>
<p><strong>Practice scenario.</strong> A Lagos skincare brand has done well locally with shea-butter products made for African skin. Customers abroad are asking for it, and the founders want to expand — starting with Ghana, and later the UK. Use SWOT to assess the risks and opportunities.</p>
${block("exercise", "mk-swot")}

<h2>How buyers decide — five steps</h2>
<h3>Step 1 — Do I want it?</h3>
<p>Interest sits on a spectrum between <strong>need</strong> (shampoo, data bundles) and <strong>desire</strong> (a designer watch). Most products are a mix, and customers aren't always sure which it is. People are far more likely to buy something they feel they <em>need</em>. Strong marketing connects a product to a real need: a solar generator isn't a gadget, it's \"never lose a day's work to a power cut again\".</p>
<h3>Step 2 — What do I know about it?</h3>
<p>Customers search <strong>internally</strong> (past experience, brands they trust — often enough for routine purchases) and <strong>externally</strong> (search engines, reviews, social media, friends and family, salespeople) for bigger decisions. Strong brands and good service win the internal search. For the external search, <strong>be everywhere your customers look</strong>: when someone hears about you from a friend, sees you on social media and reads a good review, it feels as if everyone is talking about you. Earned mentions — reviews, recommendations, press — are often worth more than paid ads.</p>
<h3>Step 3 — Is it value for money?</h3>
<p>Is it worth the price? And does it satisfy my need well enough to justify spending on it — rather than on something else? For price-sensitive customers, use promotions, instalments or smaller pack sizes, and increase perceived value.</p>
<h3>Step 4 — Is it for me?</h3>
<p>Does the brand fit how I see myself? \"Would I be happy to be seen with this?\" Consider both <strong>objective</strong> attributes (specifications, size, features) and <strong>subjective</strong> ones (style, prestige, status, ethics). Image-conscious customers want brands that feel \"cool\"; others deliberately choose unbranded value. Use a different mix for each.</p>
<h3>Step 5 — When and where do I buy?</h3>
<p><strong>Where:</strong> convenience, price, promotions, service, returns policy, loyalty schemes, bundles, reviews and past experience all matter. <strong>When:</strong> everyday items are impulse buys; big purchases wait for the right moment (payday, a sale, a new model). Make buying effortless: stock availability, few checkout steps, and the payment methods your customers use — cards, bank transfer, mobile money, pay-on-delivery, instalments.</p>

<h2>After the purchase</h2>
<p>Customers ask: \"Was it the right decision? Will it last? What do others think?\" Doubt after a big purchase is called <strong>buyer's remorse</strong>. Reduce it with a thank-you, onboarding, support, updates and a satisfaction survey — then turn happy customers into reviewers and referrers.</p>
<p>Keep these customer worries in mind throughout: Will it meet my need? Is it value for money? Is now the right time? Will it do what's advertised? Will it keep working? Will the company support me? Will the company still be around?</p>
${block("exercise", "mk-decision")}

<h2>AI practical exercise — interview your customer</h2>
<p>The AI plays a realistic customer of your product. Interview them about how they decided to buy (or why they didn't). Use open questions — you learned them in Customer Service Skills. Type <strong>SUMMARY</strong> when you're done for insights mapped to the five steps.</p>
${block("coach", "mk-persona")}

<h2>Lesson 2 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-swot",
        title: "SWOT — the skincare brand going international",
        fields: [
          field("s", "Strengths — and how to use them:"),
          field("w", "Weaknesses — and how to stop them:"),
          field("o", "Opportunities — and how to exploit them:"),
          field("t", "Threats — and how to defend against them:"),
          field("verdict", "My recommendation: Ghana first, the UK first, or wait? Why?"),
        ],
      },
      {
        exerciseId: "mk-decision",
        title: "The buyer decision form for My Product",
        table: {
          columns: ["What we do now", "What I'll add or change"],
          rows: ["Step 1 — Do I want it?", "Step 2 — What do I know about it?", "Step 3 — Is it value for money?", "Step 4 — Is it for me?", "Step 5 — When and where to buy?", "After the purchase"],
        },
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-persona",
        title: "AI Customer Persona Interview",
        intro: "The AI plays a realistic customer of your product. Interview them about their buying journey; type SUMMARY for insights mapped to the five steps.",
        usesExercises: ["mk-my-product"],
        promptTemplate:
          "I'd like to interview a typical customer of my product.\n\n[PASTE YOUR ANSWERS]\n\nPlease play a realistic customer (tell me briefly who you are — age, situation, why you were looking). I'll ask questions about how you decided. When I type SUMMARY, step out of role and summarise.",
        systemPrompt:
          "Exercise: Lesson 2 — customer persona interview. Create ONE realistic, specific customer persona for the learner's product and market (name, age range, situation, budget, how they found the product, what nearly stopped them). Introduce yourself in 2 sentences, then answer the learner's questions in character, 1–3 sentences each, with realistic detail, mixed feelings and at least one objection or hesitation. Answer closed questions briefly; reveal richer insight only to open, probing questions. Don't volunteer everything. When the learner types SUMMARY, step out of role and reply in Markdown: ### Interview insights — a short table mapping what you revealed to the five decision steps (Do I want it? What do I know? Value for money? Is it for me? When/where?) and after-purchase; **Biggest barrier to buying:** …; **Three marketing actions this suggests:** …; **Your interviewing:** count of open vs closed questions and one question that would have uncovered more. Remind them one persona is a starting point — real interviews come next.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("In SWOT, the question for a weakness is:", ["How do we use it?", "How do we stop it?", "How do we exploit it?", "How do we defend against it?"],
        1, "Use strengths, stop weaknesses, exploit opportunities, defend against threats."),
      q("Why present a product as meeting a need rather than a desire?", ["It's cheaper", "People are more likely to buy what they feel they need", "Desires are illegal to advertise", "It isn't useful"],
        1, "Connect the product to a real need."),
      q("For customers doing external research, the best strategy is to:", ["Advertise in one place only", "Be present wherever they look — reviews, social, word of mouth, search", "Avoid reviews", "Rely on brand loyalty"],
        1, "Multiple positive signals build confidence."),
      q("\"Would I be happy to be seen with this?\" belongs to which step?", ["Do I want it?", "Is it value for money?", "Is it for me?", "When and where to buy?"],
        2, "Brand fit and self-image."),
      q("Buyer's remorse is best reduced by:", ["Ignoring the customer after the sale", "Thank-you messages, onboarding, support and follow-up", "Raising prices", "More ads"],
        1, "Reassure customers after the purchase."),
    ],
  },

  // ---------------------------------------------------------------- 3 STP
  {
    lessonId: "mk-stp",
    title: "3 · Marketing Strategy: Segment, Target, Position",
    lessonOrder: 4,
    duration: "75 minutes",
    objective: "Segment your market by customer needs, choose the segments to target, and position your offer.",
    contentBody: `
<h2>Why STP?</h2>
<p>You can't be everything to everyone. <strong>Segmentation</strong> groups customers with similar needs; <strong>targeting</strong> chooses which groups to serve; <strong>positioning</strong> decides how you'll stand out to them. It lets you understand behaviour, prioritise, and tailor your marketing mix.</p>
<p><strong>Running example — BrightHome Solar</strong>, a company selling solar home energy kits (panel, battery, inverter) in Nigeria.</p>

<h2>Segment — step 1: define the market</h2>
<p>A <strong>generic market</strong> groups customers with a similar need met by many kinds of products (e.g. \"reliable power at home\": generators, solar, inverters, grid upgrades). A <strong>product market</strong> is customers for one kind of product (e.g. solar home kits). Good marketers define markets by <strong>customer needs</strong>, not by their own product's features — that's how they spot opportunities competitors miss.</p>
${table(["Area", "BrightHome Solar"], [
  ["<strong>What</strong> — product type", "Solar home energy kits and battery back-up."],
  ["<strong>Needs</strong>", "Primary: power during outages; lower fuel costs; quiet, fume-free power. Secondary: charging phones and laptops; running fridges; feeling modern and green."],
  ["<strong>Who</strong>", "Households and small businesses affected by unreliable power — segmented in step 2."],
  ["<strong>Where</strong>", "Nigerian cities first; later rural areas and neighbouring countries."],
])}

<h2>Segment — step 2: cluster customers</h2>
${table(["", "Demographic", "Psychographic", "Behavioural", "Environmental"], [
  ["<strong>Consumers (B2C)</strong>", "Age, gender, income, education, family size, occupation, location", "Lifestyle, values, price sensitivity, brand preference, trend sensitivity, environmental attitude, peer influence", "Purchase history, usage rate, where they shop, internet use, impulsiveness, loyalty", "Payment methods, currency, delivery needs, language, culture"],
  ["<strong>Businesses (B2B)</strong>", "Industry, size, revenue, years trading, locations, markets served", "Attitude to risk, growth orientation, early adopter vs follower, business culture", "Purchasing process, decision-makers, loyalty, use of social media, trade-show participation", "Tech sophistication, regulation, purchasing power"],
])}
<p><strong>Good segments are:</strong> similar inside (homogeneous); different from each other; large enough (or growing) to be worth it; and practical to reach and serve. You can build them top-down (divide the population) or bottom-up (start from real customer profiles). Multi-level segments combine criteria — \"homeowners in Lagos, earning above ₦500,000 a month, working from home\" — and let you fine-tune your mix. Give each segment a name.</p>
${table(["Segment", "Profile", "What they need most"], [
  ["<strong>Remote Professionals</strong>", "Urban, higher income, work from home, very online, value reliability and status.", "Uninterrupted power for work; a clean, premium look; quick installation."],
  ["<strong>Shop Owners</strong>", "Small retailers and salons; price-sensitive; spend heavily on generator fuel.", "Lower running costs; payback in months; pay-as-you-go."],
  ["<strong>Rural Families</strong>", "Limited or no grid; lower incomes; mobile-money users.", "Light and phone charging; very low entry price; durable and simple."],
])}

<h2>Target — is the segment worth it?</h2>
${list([
  "How large is it — and is it growing, stable or shrinking?",
  "How strong is the competition — and how loyal are customers to existing brands?",
  "What margins can you expect, and what market share do you need to break even?",
  "Can you reach it — and do you have the resources?",
  "Does it fit your mission and long-term goals?",
])}
<p><em>BrightHome's view:</em> Shop Owners are large, growing (fuel prices are rising), and the payback story is compelling — a strong first target. Remote Professionals pay well but are contested by premium brands. Rural Families are huge but need distribution and financing BrightHome doesn't yet have.</p>

<h2>Position — how you'll compete</h2>
<p>Two broad stances: <strong>head-to-head</strong> (you have a real advantage and go for a large share) or <strong>differentiation</strong> (you tailor a distinct offer, often for a niche). Then choose a coverage strategy:</p>
${table(["Strategy", "What it means", "BrightHome example"], [
  ["<strong>Single segment</strong> (concentrated)", "One segment, one mix. Ideal for smaller firms.", "A \"Shop Saver\" kit sold only to small businesses."],
  ["<strong>Selective specialisation</strong> (differentiated)", "Several segments, each with its own mix — sometimes the same product with different messages and channels.", "One kit: marketed to shops on fuel savings via trade associations, and to professionals on \"never drop a Zoom call\" via Instagram."],
  ["<strong>Product specialisation</strong>", "One product tailored for several segments.", "A modular battery sold to homes, shops and clinics."],
  ["<strong>Market specialisation</strong>", "One segment, many products.", "Everything a small business needs: kits, energy-efficient fridges, maintenance plans."],
  ["<strong>Full market coverage</strong>", "Everyone — one mass mix, or a mix per segment.", "Needs big resources. Beware: a product for everybody can become a product for nobody."],
])}
<p><strong>Write a positioning statement:</strong> <em>For [target segment] who [need], [brand] is the [category] that [key benefit], because [reason to believe].</em> — \"For small shop owners tired of generator costs, BrightHome is the solar kit that pays for itself within a year, because we size every system to your actual usage and offer pay-as-you-go.\"</p>
<p>Positioning is never finished: resources, markets and customers change, so revisit your STP regularly.</p>
${block("exercise", "mk-segments")}
${block("exercise", "mk-target")}
${block("coach", "mk-stp-coach")}

<h2>Lesson 3 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-segments",
        title: "Segmenting my market",
        table: {
          columns: ["Segment name", "Profile (demographic, psychographic, behavioural, environmental)", "What they need most", "Rough size and growth"],
          rows: numbered("Segment", 3),
        },
      },
      {
        exerciseId: "mk-target",
        title: "Targeting and positioning",
        fields: [
          field("target", "The segment(s) I'll target first, and why (size, growth, competition, margins, reach, fit):"),
          field("stance", "Head-to-head or differentiation? Which coverage strategy?"),
          field("statement", "My positioning statement: For [target] who [need], [brand] is the [category] that [benefit], because [reason to believe]."),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-stp-coach",
        title: "AI STP Reviewer",
        intro: "Checks your segments are needs-based and distinct, challenges your target choice, and sharpens your positioning statement.",
        usesExercises: ["mk-my-product", "mk-segments", "mk-target"],
        promptTemplate:
          "Here is my product, my segments and my targeting and positioning:\n\n[PASTE YOUR ANSWERS]\n\nPlease check my segments against the four guidelines (similar inside, different from each other, large enough, practical), challenge my target choice, and suggest two sharper versions of my positioning statement.",
        systemPrompt:
          "Exercise: Lesson 3 — STP reviewer. Check each segment is defined by customer needs (not product features) and passes: homogeneous within, distinct between, large/growing enough, practical to reach. Flag overlaps. Test the target choice against size/growth, competition and loyalty, margins, reach, resources and fit; ask for evidence where missing. Confirm the coverage strategy matches their resources (warn against full coverage for small firms). Offer two sharper positioning statements in the template 'For [target] who [need], [brand] is the [category] that [benefit], because [reason to believe]', keeping their facts — the reason to believe must be something true they can prove. Concise, with a short table.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What does STP stand for?", ["Sales, targets, profit", "Segment, target, position", "Strategy, tactics, planning", "Supply, trade, price"],
        1, "Segment, target, position."),
      q("Good marketers define markets by:", ["Their product's features", "Customer needs", "Competitors' products", "Price alone"],
        1, "Needs-based markets reveal opportunities."),
      q("Which is NOT a guideline for a good segment?", ["Similar inside", "Different from other segments", "As small as possible", "Practical to reach"],
        2, "Segments must be large enough to be worthwhile."),
      q("One product marketed with different messages and channels to several segments is:", ["Single segment", "Selective specialisation", "Market specialisation", "Full coverage"],
        1, "Differentiated strategy."),
      q("Why is full market coverage risky for most firms?", ["It's illegal", "It needs huge resources, and a product for everybody can become a product for nobody", "It's too cheap", "Customers dislike it"],
        1, "Niches are often more profitable and manageable."),
    ],
  },
];
