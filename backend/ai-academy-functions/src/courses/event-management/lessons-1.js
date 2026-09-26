// Lessons 1–3: managing events, objectives & screening, planning & budgeting.

const { block, q, field, numbered, flow, table, list, ol, QUIZ_BANDS } = require("../kit");

const EXAMPLE = `<p><strong>Running example — \"AI for Small Business\" workshop.</strong> A training company wants to run a one-day paid workshop showing small business owners how to use AI tools. It isn't mainly about profit: the company also wants to promote its courses and test whether regular workshops would work. Ideally the workshop covers its costs with a little to spare. Options include the company's own training centre, a city hotel, or a conference centre. We'll follow this example through the course.</p>`;

module.exports = [
  // ---------------------------------------------------------------- 1 managing events
  {
    lessonId: "em-managing",
    title: "1 · Managing Events",
    lessonOrder: 2,
    duration: "40 minutes",
    objective: "Understand the event life cycle and what makes an event — and an event manager — successful.",
    contentBody: `
<h2>What is an event?</h2>
<p>People have always gathered for events — coronations, festivals, religious ceremonies, markets, weddings. Today we add conferences, product launches, exhibitions, awards nights, music tours and global events like the Olympics. Whatever the size, every event is a <strong>project</strong>: a one-off piece of work with a fixed deadline, a budget and an audience whose needs must be met. An event manager is a project manager delivering an experience.</p>
<p>The biggest driver of complexity is <strong>size</strong>. Running an event for 100 people isn't ten times a 10-person event — it needs a more systematic approach. This course focuses on events like:</p>
${list(["Conferences and workshops", "Corporate hospitality and dinners", "Product launches", "Awards, reward and appreciation events", "Exhibitions", "Team-building days", "Fundraisers and community events"])}

<h2>What makes a successful event manager?</h2>
<p>Experienced event managers most often name five qualities: <strong>flexibility, interpersonal skills, organisation, passion and time management</strong>. Close behind: resourcefulness, attention to detail, staying calm, being accessible, creative problem solving, being proactive — and being a bit of a jack-of-all-trades.</p>
${block("exercise", "em-qualities")}

<h2>The event life cycle</h2>
<p>Many people jump straight to the fun parts — the venue, the food, the speakers. The most important steps come first: <strong>what is this event for?</strong></p>
${flow([
  "IDEA",
  "DEFINE OBJECTIVES — outcome, purpose, principles",
  "SCREENING — select the best ideas against clear criteria",
  "RESEARCH — venues, dates, costs and revenues, staffing, competition, past events",
  "DETAILED PLANNING — marketing plan · operational plan · financial plan",
  "RISK ANALYSIS — contingency plans, SWOT, review of final plans",
  "ORGANISING — developing activities, deadlines",
  "IMPLEMENTING — operations, monitoring and control",
  "SHUTDOWN — close-down, handover, feedback, evaluation, reports, legacy",
])}
<p>You won't go through this once. Each decision affects others — the venue shapes the budget, the budget shapes the programme — so you'll <strong>iterate</strong> until the plan settles. Expect activity to build steadily, peak intensely around the event itself (long days of set-up and pack-down), then fall away through shutdown.</p>

<h2>Leading the event team</h2>
<p>You'll manage resources, schedules and staff, and answer to stakeholders — a classic leadership position. Two things matter most:</p>
${list([
  "<strong>Vision.</strong> Know where you're going, so you can work backwards to get there and persuade others to follow.",
  "<strong>Energy.</strong> Enthusiasm is contagious. Respect people, praise their skills, and your team will give you their best.",
])}
<p>No two events are the same. Capture what you learn each time, and you'll get better with every event.</p>

<h2>Scenario</h2>
${block("scenario", "em-first-step")}

<h2>Lesson 1 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-qualities",
        title: "My event manager qualities",
        scale: {
          min: 1,
          max: 5,
          labels: ["Not yet", "A little", "Sometimes", "Usually", "A real strength"],
          groups: [
            {
              title: "The top five",
              statements: [
                "Flexibility — I adapt quickly when plans change.",
                "Interpersonal skills — I work well with suppliers, teams and guests.",
                "Organisation — I keep track of many details at once.",
                "Passion — I genuinely care about the attendee experience.",
                "Time management — I meet deadlines and plan ahead.",
              ],
            },
            {
              title: "Also important",
              statements: [
                "I stay calm under pressure.",
                "I solve problems creatively and resourcefully.",
                "I act before problems happen, not only after.",
              ],
            },
          ],
          bands: [
            { min: 8, max: 18, title: "Building the foundations", text: "The methods in this course will give you structure; practise the qualities you scored lowest." },
            { min: 19, max: 29, title: "Developing event manager", text: "You have useful strengths; target one or two qualities to grow with each event." },
            { min: 30, max: 40, title: "Strong foundations", text: "You have many of the qualities event managers need — the course will sharpen your methods." },
          ],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "em-first-step",
        title: "Where to start",
        question: "Your manager says: \"We need a customer event in the spring — can you organise it?\" What should you do first?",
        options: [
          "Book the most impressive venue before it's taken.",
          "Choose the catering menu.",
          "Clarify what the event is for — the outcome, purpose and any rules or limits — before planning anything else.",
          "Start inviting guests.",
        ],
        answer: 2,
        explanation: "Objectives guide every later decision. Jumping to venues and food is the most common early mistake.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("An event manager is effectively a:", ["Caterer", "Project manager delivering an experience", "Salesperson", "Venue owner"],
        1, "Events are projects with deadlines, budgets and audiences."),
      q("What most increases an event's complexity?", ["The colour scheme", "Its size", "The day of the week", "The dress code"],
        1, "100 people needs a far more systematic approach than 10."),
      q("Which step do people most often skip?", ["Booking the venue", "Defining outcome, purpose and principles", "Choosing food", "Sending invitations"],
        1, "They jump to the fun parts first."),
      q("Why is event planning iterative?", ["Because plans are always wrong", "Because decisions affect each other — venue, budget and programme shape one another", "To create more meetings", "It isn't"],
        1, "You revisit decisions until the plan settles."),
      q("Which is one of the top five qualities of an event manager?", ["Charisma", "Flexibility", "Being a jack-of-all-trades", "Accessibility"],
        1, "The top five: flexibility, interpersonal, organisation, passion, time management."),
    ],
  },

  // ---------------------------------------------------------------- 2 objectives & screening
  {
    lessonId: "em-objectives-lesson",
    title: "2 · Objectives & Screening: What Is the Event For?",
    lessonOrder: 3,
    duration: "50 minutes",
    objective: "Define your event's outcome, purpose and principles, and screen ideas to choose the best options.",
    contentBody: `
<h2>Begin with the end in mind</h2>
<p>Before any planning, know exactly what the event is for. Your objectives become the filter for every later decision — venue, date, programme, budget. Without them, you'll drift.</p>
${EXAMPLE}

<h2>Three questions</h2>
${table(["Step", "Question", "Workshop example"], [
  ["<strong>Outcome</strong>", "What specific result are you committed to? What needs to happen because of this event?", "Attendees leave able to use three AI tools in their business — and impressed by what our courses can do for them."],
  ["<strong>Purpose</strong>", "Why are you holding it?", "To educate small businesses; to promote our courses; to test the market for regular workshops."],
  ["<strong>Principles</strong>", "What policies, rules and limits must you follow?", "It must at least cover its costs. It mustn't pull key staff off urgent projects. Fixed budget. Not in December (office move)."],
])}
<p>Principles are useful: they rule options out fast. \"Must break even\" immediately removes a free-entry gala.</p>

<h2>Screening your ideas</h2>
<p>Next, brainstorm several ways to run the event, then screen them with three filters. At this stage you only need rough information — enough to throw out ideas that clearly won't work.</p>
${table(["Screen", "Questions to ask", "Ultimately…"], [
  ["<strong>Marketing</strong>", "Who is the target market and what do they expect? Their background and experience? What competing events are on at the same time? Can you avoid clashing with bigger, established events?", "Does this idea satisfy your target market?"],
  ["<strong>Operations</strong>", "What resources, staff and expertise do you have? What timescale? What equipment and venues? Do you need permits, licences, transport or security arrangements?", "Do you have the resources, time, logistics and expertise?"],
  ["<strong>Financial</strong>", "What's the budget? How much must the event make? What does a rough cost–benefit look like?", "Can you afford it?"],
])}
<p>For marketing screening, talk to potential attendees, run a quick survey, or ask other organisers. For operations and finance, rough estimates are enough for now.</p>

<h2>Practice — your objectives</h2>
${block("exercise", "em-opp")}

<h2>Practice — screen your ideas</h2>
<p>List up to four different ways you could run your event (e.g. half-day vs full day; in person vs hybrid; hotel vs community hall; free with sponsors vs paid tickets). Mark each Yes/No against the three screens, and note why.</p>
${block("exercise", "em-screening")}

<h2>AI practical exercise — Objectives &amp; Screening Coach</h2>
<p>Your coach reads your event, objectives and screening, checks the objectives are specific enough to guide decisions, and challenges any screening answers that look optimistic.</p>
${block("coach", "em-objectives-coach")}

<h2>Scenario</h2>
${block("scenario", "em-clash")}

<h2>Lesson 2 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-opp",
        title: "My event objectives",
        fields: [
          field("description", "Short description of my event:"),
          field("outcome", "Outcome — the specific result I'm committed to:"),
          field("purpose", "Purpose — why I'm holding it:"),
          field("principles", "Principles — policies, rules and limits I must follow:"),
        ],
      },
      {
        exerciseId: "em-screening",
        title: "Screening my ideas",
        table: {
          columns: ["The idea", "Marketing — satisfies target market? (Y/N)", "Operations — resources, time, expertise? (Y/N)", "Financial — affordable? (Y/N)", "Notes"],
          rows: numbered("Idea", 4),
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "em-clash",
        title: "The clash",
        question: "Your market screening shows the biggest industry conference in your city is the same week as your planned workshop. What does this tell you?",
        options: [
          "Nothing — go ahead as planned.",
          "Your idea may fail the marketing screen: your target market may be drawn away. Consider moving the date, or positioning your event as a complementary side event.",
          "Cancel the event completely.",
          "Double your marketing budget.",
        ],
        answer: 1,
        explanation: "Competing events are a key marketing screening question. Adjust the idea rather than hoping for the best.",
      },
    ],
    coaches: [
      {
        coachId: "em-objectives-coach",
        title: "AI Objectives & Screening Coach",
        intro: "Checks that your outcome, purpose and principles are specific enough to guide decisions, and challenges optimistic screening.",
        usesExercises: ["em-my-event", "em-opp", "em-screening"],
        promptTemplate:
          "Here is my event, my objectives and my screening:\n\n[PASTE YOUR ANSWERS]\n\nPlease check:\n\n1. Is my outcome specific and measurable enough to guide decisions?\n2. Is my purpose clear — and are there hidden or competing purposes?\n3. Are my principles complete (budget, time, staff, rules)?\n4. Which screening answers look optimistic, and what quick research would confirm them?\n5. Which idea looks strongest, and why?",
        systemPrompt:
          "Exercise: Lesson 2 — objectives and screening coach. Review the learner's event, outcome/purpose/principles and screening table. Check the outcome is specific (who, what change, ideally measurable); flag vague outcomes like 'a great event'. Look for multiple or shifting purposes and ask which comes first (a shifting purpose was central to the Millennium Dome's failure — mention only if relevant). Suggest missing principles (budget ceiling, break-even rule, staff limits, dates to avoid, legal or venue rules). For screening, challenge 'Yes' answers without evidence and suggest one quick piece of research for each (a 5-question survey, checking the events calendar, a rough quote). Say which idea currently looks strongest and why, but leave the decision to them. Keep it concise, using a short table if helpful.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("\"Our event must not cost the company anything\" is an example of:", ["Outcome", "Purpose", "Principle", "Screening"],
        2, "Principles are the policies, rules and limits."),
      q("Which screen asks \"Do we have the staff, time and expertise?\"", ["Marketing", "Operations", "Financial", "Promotion"],
        1, "Operations screening."),
      q("How detailed should figures be at the screening stage?", ["Exact supplier quotes", "Rough estimates — enough to rule out ideas that clearly won't work", "None — go with your gut", "Audited accounts"],
        1, "Screening is a quick filter."),
      q("Why define objectives before choosing a venue?", ["Venues are cheap", "Objectives are the filter for every later decision", "It's traditional", "Venues don't matter"],
        1, "Begin with the end in mind."),
      q("\"Attendees leave able to use three AI tools in their business\" is a good:", ["Principle", "Outcome", "Budget", "Risk"],
        1, "A specific result you're committed to."),
    ],
  },

  // ---------------------------------------------------------------- 3 planning & budgeting
  {
    lessonId: "em-budgeting",
    title: "3 · Planning & Budgeting",
    lessonOrder: 4,
    duration: "75 minutes",
    objective: "Break your event into work packages, build a budget, compare options and set a price.",
    contentBody: `
<h2>What is a budget?</h2>
<p>A budget is a financial plan for your event over time. It helps coordinate everyone involved, shows the true scope of the work, and reveals your limits early. But it's a guide, not the only thing that controls your decisions.</p>

<h2>Work Breakdown Structure (WBS)</h2>
<p>To finish a large task, break it into smaller, manageable pieces. In project management this is a <strong>Work Breakdown Structure</strong>: the event divided into <strong>work packages</strong> (tasks or activities). Each work package has a single purpose, a clear start and finish, and defined resources.</p>
<p>Draw it as a tree. For the workshop:</p>
${table(["Workshop", "Branches and work packages"], [
  ["Venue", "Book venue · room layout · AV and Wi-Fi · signage"],
  ["Programme", "Agenda · speakers · demo materials · handouts"],
  ["Marketing", "Website page · email campaign · social media · partner promotion"],
  ["Attendees", "Registration and tickets · joining instructions · welcome desk · feedback survey"],
  ["Catering", "Menu and dietary needs · refreshment breaks · lunch"],
  ["Finance", "Budget · pricing · payments to suppliers"],
])}
<p>For each work package, record: <strong>title · duration · owner</strong> (who is responsible) <strong>· people involved · inputs</strong> (what must be ready first — dependencies) <strong>· tasks and scope</strong> (what's included and what isn't) <strong>· outputs</strong> (what it produces) — and later, the <strong>start date</strong>. At this stage duration matters more than start date; you'll schedule in Lesson 4.</p>
${block("exercise", "em-wbs")}
${block("exercise", "em-wp")}

<h2>Start with your limitations</h2>
<p>Limits are helpful: they shrink your options. If you must use a particular venue, you already know what services it offers. If the budget can't stretch to a grand hotel, stop considering grand hotels.</p>

<h2>Money-making or publicity?</h2>
<p>Most events lean one way. Publicity events (launches, exhibitions) are judged on return on investment — was the spend worth what came out of it? Money-making events must earn more than they cost: the <strong>break-even point</strong> is critical. Conferences often sit in between: attendees pay to meet each other.</p>

<h2>Budgeting in four steps</h2>
${ol([
  "Record the cost of essentials and costs you already know.",
  "Get rough estimates for everything else — don't agonise over suppliers you may not be able to afford.",
  "Add it all up and compare with your budget and break-even point.",
  "Improve accuracy: get real quotes, compare suppliers, update the numbers — ideally in a spreadsheet.",
])}
<p>Typical cost lines: venue hire and deposit; staff and volunteers (including their meals); AV and internet; security; cleaning; decoration and signage; catering; printing, name badges and lanyards; website and ticketing fees; photography; insurance; licences; speakers' fees and travel; prizes and gifts; <strong>tax</strong>.</p>

<h2>Comparing options — the comparative outline budget</h2>
<p>For the workshop, three venues:</p>
${table(["", "Our training centre", "City hotel", "Conference centre"], [
  ["Capacity", "60", "120", "400"],
  ["Venue hire", "£0", "£1,800", "£2,600"],
  ["Food", "£400", "£250", "£350"],
  ["Drinks", "£150", "£100", "£120"],
  ["Printing", "£250", "£250", "£250"],
  ["Welcome drinks", "£150", "£150", "£150"],
  ["AV hire", "£300", "included", "included"],
  ["Staffing", "£250", "£100", "£300"],
  ["Security", "£100", "£150", "included"],
  ["<strong>Total</strong>", "<strong>£1,600</strong>", "<strong>£2,800</strong>", "<strong>£3,770</strong>"],
  ["Cost per attendee (50 attendees)", "£32", "£56", "£75"],
])}
<p>At 50 attendees, the training centre is clearly cheapest. But marketing research suggests a hotel or conference centre would <em>attract more people</em> — say 80 at the hotel and 140 at the conference centre:</p>
${table(["", "Training centre", "City hotel", "Conference centre"], [
  ["Expected attendees", "50", "80", "140"],
  ["Cost per attendee", "£32", "£35", "£27"],
])}
<p>Now the conference centre is cheapest per head <em>and</em> creates a bigger, more prestigious event. That's the power of a comparative budget. But beware: <strong>overestimating demand</strong> is one of the most common budgeting mistakes. Base attendance on evidence — surveys, past events, pre-registrations — not enthusiasm.</p>
<p>(To keep this example simple, food is shown as a fixed amount; in reality catering usually rises with each extra attendee — check how your suppliers charge.)</p>

<h2>Setting the price</h2>
${list([
  "<strong>Cost per attendee</strong> = total cost ÷ expected attendees.",
  "<strong>Add contingency</strong> — around 5% of costs for the unexpected.",
  "<strong>Break-even price</strong> = (total cost + contingency) ÷ attendees.",
  "<strong>Ticket price with a target surplus</strong> = (total cost + contingency + target surplus) ÷ attendees.",
])}
<p><em>Example:</em> conference centre £3,770 + 5% contingency (£189) = £3,959. With a £1,000 target surplus and 140 attendees: £4,959 ÷ 140 ≈ <strong>£36 per ticket</strong>.</p>

<h2>Other income</h2>
<p>Tickets aren't the only income: programmes and guidebooks; branded merchandise; related products and books; corporate hospitality packages; parking; stalls and exhibition stands; catering and refreshments; advertising; photo and video sales; sponsorship; grants and public funding; broadcast rights.</p>
<p>Always ask <strong>\"What's in it for them?\"</strong> Sponsors and advertisers won't pay without a clear benefit — nobody will advertise in a black-and-white newsletter read by 50 people. Selling useful products to attendees may earn more than chasing sponsors.</p>

<h2>Common budgeting mistakes</h2>
${list([
  "Guessing the ticket price before calculating costs.",
  "Overestimating demand — and booking a venue and catering that are too big.",
  "Forgetting subsidiary costs: security, health and safety, insurance, tax, payment fees.",
  "Ignoring the event's purpose — e.g. a lavish fundraiser that makes guests ask, \"If you can afford this, why do you need my money?\"",
  "Not involving everyone — so costs get missed.",
])}

<h2>Practice — budget My Event</h2>
${block("exercise", "em-budget")}
${block("exercise", "em-pricing")}

<h2>AI practical exercise — Budget Checker</h2>
<p>Your Budget Checker re-does your arithmetic, looks for missing cost lines, checks your contingency and pricing, and tests what happens if fewer people come.</p>
${block("coach", "em-budget-checker")}

<h2>Scenario</h2>
${block("scenario", "em-demand")}

<h2>Lesson 3 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-wbs",
        title: "My Work Breakdown Structure",
        table: { columns: ["Branch (e.g. venue, programme, marketing)", "Work packages in this branch"], rows: numbered("Branch", 6) },
      },
      {
        exerciseId: "em-wp",
        title: "One work package in detail",
        fields: [
          field("title", "Title:", "text"),
          field("duration", "Duration:", "text"),
          field("owner", "Owner — who is responsible:", "text"),
          field("people", "People involved:"),
          field("inputs", "Inputs — what must be ready before it can start (dependencies):"),
          field("scope", "Tasks and scope — what's included, and what's left out:"),
          field("outputs", "Outputs — what it produces:"),
        ],
      },
      {
        exerciseId: "em-budget",
        title: "My event budget",
        table: {
          columns: ["Estimated cost", "Source (quote, past event or rough estimate)"],
          rows: ["Venue hire", "Staff & volunteers", "AV & internet", "Security", "Catering & drinks", "Printing, badges & signage", "Marketing & ticketing fees", "Speakers / entertainment", "Insurance & licences", "Other", "TOTAL", "Contingency (≈5%)"],
        },
      },
      {
        exerciseId: "em-pricing",
        title: "Pricing and income",
        fields: [
          field("attendees", "Expected attendees — and the evidence behind this number:"),
          field("per-head", "Cost per attendee (total ÷ attendees):", "text"),
          field("price", "Ticket price, including contingency and any target surplus (show the working):"),
          field("income", "Other income sources I could use — and what's in it for each sponsor/partner:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "em-demand",
        title: "The optimistic forecast",
        question: "A colleague says: \"Let's book the 400-seat hall — I'm sure we'll get 350 people.\" There's no evidence yet. What's the best response?",
        options: [
          "Book it — enthusiasm sells tickets.",
          "Test demand first (survey, early-bird registrations, past attendance), budget for a realistic number, and choose a venue that can flex.",
          "Book the smallest room available to be safe.",
          "Double the ticket price to cover the risk.",
        ],
        answer: 1,
        explanation: "Overestimating demand is a classic budgeting mistake. Base numbers on evidence and keep options flexible.",
      },
    ],
    coaches: [
      {
        coachId: "em-budget-checker",
        title: "AI Budget Checker",
        intro: "Re-checks your arithmetic, looks for missing costs, tests contingency and pricing, and models what happens if fewer people come.",
        usesExercises: ["em-my-event", "em-budget", "em-pricing"],
        promptTemplate:
          "Here is my event, my budget and my pricing:\n\n[PASTE YOUR ANSWERS]\n\nPlease:\n\n1. check my arithmetic;\n2. list any cost lines I may have missed;\n3. check my contingency and ticket price;\n4. show what happens to my break-even if only 70% of my expected attendees come;\n5. suggest one realistic way to improve the numbers.",
        systemPrompt:
          "Exercise: Lesson 3 — budget checker. Recalculate totals, cost per attendee, contingency (~5%) and ticket price from the learner's figures, showing short working; state clearly if their numbers are right or where they differ. Flag missing typical costs for this type of event (e.g. staff meals, payment/ticketing fees, insurance, licences, security, cleaning, tax/VAT, speaker travel, accessibility provisions). Note which figures are guesses vs quotes. Run a 70%-attendance sensitivity check (fixed vs per-head costs if identifiable; otherwise assume costs stay fixed and say so). Suggest one realistic improvement (e.g. early-bird pricing to test demand, a scalable venue, a relevant sponsor with a clear 'what's in it for them'). Use a small Markdown table. General guidance only — no tax or investment advice.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a work package?", ["A gift bag", "A single-purpose task with a start, finish and defined resources", "The whole event", "A supplier contract"],
        1, "The building block of a WBS."),
      q("In a work package, \"inputs\" means:", ["The budget", "What must be ready before it can start — its dependencies", "The attendees", "The outputs"],
        1, "Inputs capture dependencies."),
      q("Total cost £4,000, contingency 5%, 100 attendees. Break-even ticket price?", ["£40", "£42", "£45", "£38"],
        1, "£4,000 + £200 = £4,200 ÷ 100 = £42."),
      q("Which is a common budgeting mistake?", ["Getting several quotes", "Overestimating demand", "Adding contingency", "Involving the team"],
        1, "Base attendance on evidence."),
      q("Before approaching a sponsor, ask:", ["\"How much can we get?\"", "\"What's in it for them?\"", "\"Who else is sponsoring?\"", "\"Can we skip the contract?\""],
        1, "Sponsors need a tangible benefit."),
    ],
  },
];
