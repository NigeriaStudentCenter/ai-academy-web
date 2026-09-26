// Lessons 4–6: product, price, place.

const { block, q, field, numbered, flow, table, list, ol, QUIZ_BANDS } = require("../kit");

module.exports = [
  // ---------------------------------------------------------------- 4 product
  {
    lessonId: "mk-product",
    title: "4 · Product & the Product Life Cycle",
    lessonOrder: 5,
    duration: "45 minutes",
    objective: "Use the product life cycle to plan your marketing, and design products that stand out.",
    contentBody: `
<h2>Product decisions</h2>
<p>The product is the first P. Beyond its core features, customers judge quality, design, packaging, brand, guarantees, after-sales support and, increasingly, its environmental and social impact. Choose features that beat competitors on what your target segment values most — at a cost that still leaves a margin.</p>

<h2>The product life cycle</h2>
<p>Most products pass through recognisable stages. Your marketing mix should change as they do.</p>
${table(["Stage", "What's happening", "Typical marketing mix"], [
  ["<strong>1. Development</strong>", "Needs identified; product designed and tested. No sales yet.", "Research and testing; plan the launch. (Announcing early can alert competitors.)"],
  ["<strong>2. Introduction</strong>", "Launched to early customers; building awareness and first demand.", "Often a high price (skimming) — or a low introductory price to win customers from older alternatives. Selective distribution. Heavy spend on awareness, samples and trials; incentives for retailers to stock it."],
  ["<strong>3. Growth</strong>", "Sales rise fast; competitors copy.", "Add features and improve quality. Keep price high if demand is strong, or cut to win new users. Widen distribution. Build the brand and loyalty."],
  ["<strong>4. Maturity</strong>", "Sales peak and stabilise; many alternatives; usually the most profitable stage.", "Differentiate with modifications; watch costs; avoid damaging price wars; find new channels and new users; defend shelf space; spend less on advertising."],
  ["<strong>5. Decline</strong>", "Sales fall as the product becomes obsolete or unfashionable.", "Trim the range, cut costs, focus on a loyal niche, clear stock — or find new uses. Prepare and promote the successor."],
])}
<p><em>Note:</em> economist Raymond Vernon described a related <strong>international</strong> product life cycle, in which products are first made and sold at home, then exported, and later made more cheaply abroad and imported back. It's useful for labour- and capital-intensive goods.</p>

<h2>Using the life cycle well</h2>
${list([
  "<strong>It's a model, not a law.</strong> Not every product follows it neatly — some are revived, some die at launch.",
  "<strong>Compare</strong> your product's curve with similar products in the past to anticipate what's next.",
  "<strong>Win the early adopters.</strong> New products spread from innovators and early adopters to the early majority, late majority and laggards. If early adopters don't love it, it rarely reaches growth.",
  "<strong>Be remarkable.</strong> Seth Godin's image: a brown cow is boring, but a purple cow would make you stop and tell people. Early adopters talk about products that genuinely stand out — \"fitting in\" is failing.",
  "<strong>Design for the future.</strong> Development takes time. Build for what customers will need in three to five years, not just what they ask for today.",
])}

<h2>Practice</h2>
${block("exercise", "mk-plc-famous")}
${block("exercise", "mk-plc-mine")}

<h2>Scenario</h2>
${block("scenario", "mk-plc-scenario")}

<h2>Lesson 4 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-plc-famous",
        title: "The life cycle of a well-known product",
        fields: [
          field("product", "A well-known product (e.g. a phone model, a streaming service, a drinks brand):", "text"),
          field("stage", "Which stage it's in, and the evidence:"),
          field("next", "What its maker should do next with product, price, place and promotion:"),
        ],
      },
      {
        exerciseId: "mk-plc-mine",
        title: "My Product's life cycle",
        fields: [
          field("stage", "Which stage My Product is in, and the evidence:"),
          field("mix", "How my marketing mix should change for this stage:"),
          field("remarkable", "What would make My Product genuinely remarkable to early adopters?"),
          field("future", "What will my customers need in three to five years?"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "mk-plc-scenario",
        title: "Maturity",
        question: "Sales of a popular soft drink have been flat for three years, with many rival brands. What's the most sensible marketing focus?",
        options: [
          "Spend heavily on awareness advertising, as at launch.",
          "Differentiate (new flavours, pack sizes), control costs, seek new users and channels, and avoid a price war.",
          "Stop all marketing immediately.",
          "Double the price to signal quality.",
        ],
        answer: 1,
        explanation: "That's the maturity playbook: defend and extend while protecting margins.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("At which stage are profits usually highest?", ["Introduction", "Growth", "Maturity", "Decline"],
        2, "Sales peak and costs are under control."),
      q("Why target early adopters at introduction?", ["They pay the most", "If they don't embrace it, the product rarely reaches the majority", "They are easiest to reach", "They never complain"],
        1, "Early adopters spread the word."),
      q("\"Be a purple cow\" means:", ["Use bright packaging", "Make your product genuinely remarkable so people talk about it", "Target farmers", "Copy the market leader"],
        1, "Remarkable products get noticed and shared."),
      q("In decline, a sensible strategy is to:", ["Launch big ad campaigns", "Trim the range, cut costs, serve a loyal niche, and prepare a successor", "Widen distribution", "Add many new features"],
        1, "Harvest and move on."),
      q("Why design for customers' needs in 3–5 years?", ["It's fashionable", "Development takes time, so today's needs may have changed by launch", "Investors require it", "It's cheaper"],
        1, "Skate to where the puck is going."),
    ],
  },

  // ---------------------------------------------------------------- 5 price
  {
    lessonId: "mk-price",
    title: "5 · Price",
    lessonOrder: 6,
    duration: "75 minutes",
    objective: "Set prices with clear objectives, understand demand, design good-better-best tiers — and stay legal and ethical.",
    contentBody: `
<h2>Pricing in six steps</h2>
${ol([
  "<strong>Start from your strategy (STP).</strong> Are you after fast market share or long-term price stability? The mass market or a niche?",
  "<strong>Fit the rest of the mix.</strong> Product, promotion and distribution decisions all affect — and are affected by — price.",
  "<strong>Know your costs.</strong> <em>Variable costs</em> rise with each unit made (materials, packaging, delivery); economies of scale can lower them per unit. <em>Fixed costs</em> (rent, salaries, equipment) stay the same however many you sell, but must be covered.",
  "<strong>Study the environment.</strong> What do competitors charge? Are they discounting? Could you trigger a price war? Is your price so high it invites new competitors?",
  "<strong>Check the law</strong> (see below).",
  "<strong>Set your pricing objective</strong> (see below).",
])}

<h2>Pricing and the law</h2>
${table(["Practice", "What it means"], [
  ["<strong>Price-fixing</strong> — illegal", "Agreeing prices with competitors, or sharing pricing plans with them. It's a serious offence under competition law in the UK, Nigeria and most countries."],
  ["<strong>Predatory pricing / abuse of dominance</strong> — illegal", "A dominant firm pricing below cost to drive rivals out, or exploiting a monopoly position."],
  ["<strong>Misleading prices</strong> — illegal", "Fake \"was\" prices, hidden or \"drip\" fees revealed late, or misleading \"from\" prices."],
  ["<strong>Different prices for different customers</strong> — usually legal", "Student and senior discounts, off-peak fares, bulk rates and dynamic pricing are normal — but never discriminate by protected characteristics, and some sectors (e.g. energy, finance, insurance) have extra rules."],
])}
<p>If in doubt, check your competition and consumer protection regulator — such as the CMA in the UK or the FCCPC in Nigeria — or take legal advice.</p>

<h2>Pricing objectives</h2>
${table(["Objective", "When it fits"], [
  ["<strong>Maximise revenue</strong>", "Chasing market share; accept thinner margins for now."],
  ["<strong>Maximise profit</strong>", "Balance volume and margin — but don't sacrifice long-term share for short-term profit."],
  ["<strong>Maximise volume</strong>", "Scale will cut unit costs."],
  ["<strong>Skimming</strong> (maximise margin)", "Limited capacity, customers not very price-sensitive, a premium niche, or an early launch."],
  ["<strong>Penetration</strong>", "Customers are price-sensitive, costs fall with volume, competitors are coming, and the product can have mass appeal."],
  ["<strong>Loss leader / recover elsewhere</strong>", "Sell the main product near or below cost and earn on consumables or content — printers and ink, games consoles and games."],
  ["<strong>Stable pricing</strong>", "Avoid price wars and keep steady profit — but watch for rivals with cheaper technology."],
  ["<strong>Survival</strong>", "Short-term, in an oversupplied market: price near cost to stay in the game."],
])}

<h2>Demand and supply</h2>
<p><strong>The demand curve:</strong> all else being equal, the higher the price, the fewer people buy. <strong>Supply and demand</strong> meet at an equilibrium price in a competitive market.</p>
${list([
  "<strong>Demand shifts</strong> when tastes and fashions change, incomes change, prices of substitutes or complements change (e.g. fuel prices affect demand for cars — and for solar kits), or people expect prices to rise or fall. More demand → higher prices.",
  "<strong>Supply shifts</strong> when costs change — e.g. new technology cuts unit costs, pushing prices down.",
  "<strong>Price sensitivity (elasticity)</strong> differs by product: essentials with few substitutes are less sensitive than luxuries with many.",
])}

<h2>Good, better, best</h2>
<p>Many businesses offer <strong>three versions</strong> — small/medium/large, basic/standard/premium. Faced with three options, many people choose the middle one (the <em>compromise effect</em>). That creates a powerful pricing opportunity, because the margin on each tier doesn't have to be the same.</p>
<p><strong>Example — a coffee kiosk.</strong> Costs: Small £1.00, Medium £1.50, Large £2.00.</p>
${table(["", "Small", "Medium", "Large"], [
  ["Cost", "£1.00", "£1.50", "£2.00"],
  ["<strong>Linear prices</strong> (20% margin each)", "£1.25", "£1.88", "£2.50"],
  ["<strong>Tiered prices</strong>", "£1.60", "£1.95", "£2.60"],
])}
<p>With tiered prices, Small looks poor value (only 35p less than Medium), so more people trade up to Medium — which now earns 45p instead of the 25p most customers were paying on Small.</p>
<p>Go further by <strong>designing the costs</strong>: make Large cost only 10p more to produce than Medium, then price it 45p higher. \"For 45p more, go large?\" becomes irresistible — and very profitable. This works best where customers have few alternatives, like cinema popcorn.</p>
<p><strong>Keep it honest.</strong> Tiering is legitimate when every option is real, fairly described and good value in its own right. Never mislead customers about what they're getting.</p>

<h2>AI practical exercise — the Popcorn Pricing Simulator</h2>
<p>You run the popcorn stand at a cinema. Popcorn costs you <strong>50p per 100g</strong>, and each bucket costs <strong>20p</strong>. Design three sizes (grams) and set three prices. The AI simulates 100 cinema-goers choosing, then calculates your profit. Try to beat your own score!</p>
${block("exercise", "mk-popcorn")}
${block("coach", "mk-popcorn-sim")}

<h2>Price My Product</h2>
${block("exercise", "mk-pricing")}

<h2>Lesson 5 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-popcorn",
        title: "My popcorn range",
        table: { columns: ["Popcorn (grams)", "Bucket description (shape, look)", "Price (£)"], rows: ["Small", "Medium", "Large"] },
      },
      {
        exerciseId: "mk-pricing",
        title: "Pricing My Product",
        fields: [
          field("objective", "My pricing objective, and why it fits my strategy:"),
          field("costs", "My main variable and fixed costs:"),
          field("competitors", "What competitors charge, and how I compare:"),
          field("tiers", "Could I offer good / better / best? What would each include and cost?"),
          field("legal", "Any legal or ethical pricing points I need to check:"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "mk-popcorn-sim",
        title: "AI Popcorn Pricing Simulator",
        intro: "Simulates 100 cinema-goers choosing between your three popcorn sizes and calculates your profit. Change your sizes or prices and try again.",
        usesExercises: ["mk-popcorn"],
        promptTemplate:
          "Here is my popcorn range:\n\n[PASTE YOUR ANSWERS]\n\nPopcorn costs 50p per 100g and each bucket costs 20p. Please simulate 100 cinema-goers choosing, and calculate my cost, profit per size and total profit. Explain why people chose as they did.",
        systemPrompt:
          "Exercise: Lesson 5 — Popcorn Pricing Simulator. Costs: popcorn £0.50 per 100 g (i.e. £0.005 per gram); bucket £0.20 each regardless of size. For each size compute unit cost = grams × 0.005 + 0.20, unit profit = price − cost, and margin % = profit ÷ price. Then simulate 100 cinema-goers as a single-supplier cinema audience: assume about 15 don't buy at all if all prices look high (adjust 5–30 based on price levels vs typical £3–£7 cinema popcorn), and split buyers between sizes using realistic behaviour — the compromise effect favours the middle option; a small upgrade price with a big size jump pulls people to Large; a Small that's only slightly cheaper than Medium pushes people up; poor value or very high prices reduce purchases. Show a Markdown table: size, grams, price, unit cost, unit profit, margin, buyers, profit; then total revenue, total cost, total profit. Double-check all arithmetic. Explain the choices in 3–4 bullets, suggest one change to try next, and invite them to update their prices and ask again (keep a running 'best profit so far' if they iterate). Remind them this is a simplified simulation, and that every size must be fairly described.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Agreeing prices with a competitor is:", ["Smart teamwork", "Illegal price-fixing", "Allowed if you're small", "A penetration strategy"],
        1, "A serious competition-law offence."),
      q("Offering a student discount is:", ["Always illegal", "Usually legal price differentiation", "Predatory pricing", "Price-fixing"],
        1, "Different prices for different customers are normally legal — just not based on protected characteristics."),
      q("Penetration pricing fits best when:", ["Customers aren't price-sensitive", "Customers are price-sensitive, costs fall with volume and competitors are coming", "You have tiny capacity", "The product is a luxury niche"],
        1, "Low price to win volume fast."),
      q("When fuel prices rise, what is likely to happen to demand for solar kits?", ["It falls", "It rises — solar is a substitute", "No change", "It disappears"],
        1, "Prices of substitutes shift demand."),
      q("Why do many businesses offer three tiers?", ["Law requires it", "Many customers choose the middle option, and tiers can guide them to better-margin choices", "It's cheaper to produce", "It confuses customers"],
        1, "The compromise effect — used honestly."),
    ],
  },

  // ---------------------------------------------------------------- 6 place
  {
    lessonId: "mk-place",
    title: "6 · Place: Distribution & Channels",
    lessonOrder: 7,
    duration: "40 minutes",
    objective: "Choose distribution channels — online and offline — and motivate your channel partners.",
    contentBody: `
<h2>Getting the product to the customer</h2>
<p>Place is about making your product available where and when your target customers want to buy. Each industry has its norms — but some of the best ideas come from borrowing channels other industries use.</p>

<h2>Channel types</h2>
${table(["Channel", "How it works", "Examples"], [
  ["<strong>Distributors / wholesalers</strong>", "Buy in bulk and sell to retailers.", "FMCG distributors supplying shops and supermarkets."],
  ["<strong>Retailers</strong>", "Sell to end customers.", "Supermarkets, pharmacies, electronics stores, market traders."],
  ["<strong>Direct to consumer</strong>", "You sell straight to customers — no middleman.", "Your own website or shop, social commerce (Instagram, TikTok Shop), WhatsApp Business catalogues, sales agents."],
  ["<strong>Marketplaces</strong>", "Platforms that bring buyers and sellers together, for a fee.", "Amazon, Jumia, Konga, Etsy, app stores."],
  ["<strong>Partnerships and bundles</strong>", "Other businesses sell your service alongside theirs.", "Airlines selling hotels and car hire; banks offering insurance; telecoms bundling streaming."],
])}
<p>The internet lets many firms act as their own distributor <em>and</em> retailer — while still using partners to reach customers they couldn't reach alone. Many businesses now go <strong>omnichannel</strong>: customers can discover online, buy in store, or order by WhatsApp and pay on delivery — with consistent prices and service everywhere.</p>

<h2>How widely should you distribute?</h2>
${table(["Intensity", "What it means", "Fits"], [
  ["<strong>Intensive</strong>", "Available almost everywhere.", "Everyday products — soft drinks, batteries, data top-ups. Expect strong price competition between retailers."],
  ["<strong>Selective</strong>", "Carefully chosen retailers and resellers. The most common approach.", "Electronics, fashion, specialist products."],
  ["<strong>Exclusive</strong>", "Only authorised dealers.", "Luxury goods, cars, complex equipment needing trained installers."],
])}

<h2>Motivating channel partners</h2>
<p>Retailers and distributors stock many brands. Give them reasons to push yours: better margins or volume discounts; commission or incentives for their sales staff; free training; point-of-sale displays and stands; co-funded advertising; reliable supply; and fast support when things go wrong.</p>
${block("exercise", "mk-channels")}

<h2>Scenario</h2>
${block("scenario", "mk-place-scenario")}

<h2>Lesson 6 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "mk-channels",
        title: "My channel plan",
        table: {
          columns: ["Use it? Why / why not", "Intensity (intensive / selective / exclusive)", "How I'll motivate this channel"],
          rows: ["Own website or shop", "Social commerce / WhatsApp", "Marketplaces", "Retailers", "Distributors / agents", "Partnerships or bundles", "An idea borrowed from another industry"],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "mk-place-scenario",
        title: "The installer network",
        question: "BrightHome's solar kits must be installed safely by trained technicians. Which distribution intensity fits best?",
        options: [
          "Intensive — sell in every corner shop.",
          "Exclusive or selective — through authorised, trained installer-dealers, plus direct online enquiries.",
          "No distribution — customers collect from the factory.",
          "Marketplaces only, with no installation.",
        ],
        answer: 1,
        explanation: "Complex products that need expert installation and after-sales support suit exclusive or selective channels.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Distributors typically sell to:", ["End customers", "Retailers", "Manufacturers", "Regulators"],
        1, "Retailers sell to end customers."),
      q("Selling through your own website and WhatsApp is:", ["Exclusive distribution", "Direct to consumer", "Wholesale", "Price-fixing"],
        1, "No middleman."),
      q("Batteries and soft drinks usually use:", ["Exclusive distribution", "Intensive distribution", "No distribution", "Selective distribution only"],
        1, "Available almost everywhere."),
      q("Which is a way to motivate retailers?", ["Late deliveries", "Better margins, staff incentives, training and displays", "Ignoring their questions", "Selling cheaper than them direct"],
        1, "Give them reasons to push your brand."),
      q("Omnichannel means:", ["Only selling online", "Customers can discover and buy across channels with a consistent experience", "Using one distributor", "Selling only in markets"],
        1, "Seamless across online and offline."),
    ],
  },
];
