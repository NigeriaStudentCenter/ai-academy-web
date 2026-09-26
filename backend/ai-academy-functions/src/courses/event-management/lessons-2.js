// Lessons 4–5: timing & risk management, venue & catering.

const { block, q, field, numbered, table, list, ol, QUIZ_BANDS } = require("../kit");

module.exports = [
  // ---------------------------------------------------------------- 4 timing & risk
  {
    lessonId: "em-timing-risk",
    title: "4 · Timing & Risk Management",
    lessonOrder: 5,
    duration: "75 minutes",
    objective: "Schedule your event with a Gantt chart, find the critical path, and build a risk register.",
    contentBody: `
<h2>From tasks to a schedule</h2>
<p>You have your work packages and a budget. Now put them in order. The most widely used tool is the <strong>Gantt chart</strong>: tasks listed down the left, and a bar for each task across a timeline showing when it starts and how long it takes.</p>

<h2>Dependencies</h2>
<p>Link tasks that depend on each other, so moving one automatically moves the others. There are four types:</p>
${table(["Type", "Meaning", "Event example"], [
  ["<strong>Finish-to-Start</strong> (most common)", "B can't start until A finishes.", "You can't print the programme until speakers are confirmed."],
  ["<strong>Start-to-Start</strong>", "B can't start until A starts.", "Social media promotion starts when ticket sales open."],
  ["<strong>Finish-to-Finish</strong>", "B can't finish until A finishes.", "Final catering numbers can't be confirmed until registration closes."],
  ["<strong>Start-to-Finish</strong> (rare)", "B can't finish until A starts.", "The old ticketing system runs until the new one goes live."],
])}
<p><strong>Milestones</strong> mark key moments — \"venue contract signed\", \"registration closes\", \"event day\". If the event date moves, a well-linked Gantt chart lets you re-plan everything in minutes without breaking any dependency.</p>

<h2>Critical Path Analysis</h2>
<p>Which tasks, if delayed, delay the whole event? Critical Path Analysis finds them. You need: the list of tasks (your WBS), each task's duration, the dependencies, and any fixed milestones. The <strong>critical path</strong> is the <em>longest</em> chain of dependent tasks — it sets the shortest possible time to be ready. Any delay on it delays everything. Tasks off the critical path have <strong>float</strong>: slack you can use.</p>
<p><strong>Workshop example</strong> (all after A: \"Confirm venue\"):</p>
${table(["Task", "Duration", "Depends on"], [
  ["A — Confirm venue", "2 weeks", "—"],
  ["B — Book speakers", "3 weeks", "A"],
  ["C — Print programme", "1 week", "B"],
  ["D — Build event web page", "2 weeks", "A"],
  ["E — Ticket sales campaign", "4 weeks", "D"],
  ["F — Book catering", "1 week", "A"],
])}
<p>Paths to event day: A→B→C = 6 weeks · <strong>A→D→E = 8 weeks</strong> · A→F = 3 weeks. The critical path is <strong>A→D→E</strong>: any delay to the venue, web page or ticket campaign delays readiness. A→B→C has 2 weeks of float; A→F has 5.</p>
<p>Four useful timings for each task: <strong>Earliest Start</strong>, <strong>Earliest Finish</strong>, <strong>Latest Start</strong> and <strong>Latest Finish</strong> without delaying the event. The gap between earliest and latest is the float.</p>

<h2>Contingency planning</h2>
${list([
  "<strong>Timing:</strong> build buffers into the critical path; know each task's latest start.",
  "<strong>Alternatives:</strong> for every critical supplier, ask \"What if they let us down?\" — and have a plan B.",
  "<strong>Insurance:</strong> transfer risk for a fixed, known cost (e.g. event cancellation, public liability). Check what's legally required where you are.",
])}

<h2>The risk register</h2>
<p>For each risk, score <strong>Consequence (C)</strong> and <strong>Likelihood (L)</strong> from 1–5, multiply for the overall risk, and write a contingency plan. Focus your effort on the highest scores. Risk scoring is a judgement, not a prediction — what matters is being prepared.</p>
${table(["Score", "Consequence", "Likelihood"], [
  ["1", "Inconsequential", "Rare"], ["2", "Slight", "Unlikely"], ["3", "Serious", "Moderate"], ["4", "Major", "Likely"], ["5", "Disaster", "Almost certain"],
])}
<p>Common risk areas: finances · health &amp; safety · security · venue · crowd management · arrivals and departures · administration and ticketing · stage and AV · location · transport · weather · printing · competing events · logistics · <strong>power and internet</strong> · <strong>speaker no-shows</strong>.</p>

<h2>Case study — the Millennium Dome's opening night</h2>
<p>London's Millennium Dome cost around £800 million and was meant to be the UK's flagship celebration of the year 2000. Its purpose shifted repeatedly during planning — a celebration, an urban regeneration project, a national exhibition — so neither planners nor the public were clear what it was for.</p>
<p>The opening night on 31 December 1999 went badly wrong. Many guests' tickets hadn't arrived in time, so thousands — including national newspaper editors — were told to collect them at Stratford station and pass through airport-style security there before travelling on to the Dome. The queues lasted hours in the cold; many arrived after the celebrations had begun. Senior organisers were inside the Dome with little visibility of the problems at the station.</p>
<p>The next day's press coverage was scathing. Visitor numbers fell far short of the 12 million forecast, and the Dome closed as an attraction at the end of 2000. The building later found success as The O2 arena.</p>
${block("exercise", "em-dome")}

<h2>Practice — schedule and risks for My Event</h2>
${block("exercise", "em-schedule")}
${block("exercise", "em-critical")}
${block("exercise", "em-risks")}

<h2>AI practical exercise — Risk &amp; Schedule Reviewer</h2>
<p>Your reviewer checks your critical path, looks for missing dependencies, and challenges your risk scores and contingency plans.</p>
${block("coach", "em-risk-reviewer")}

<h2>Lesson 4 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-dome",
        title: "Lessons from the Dome",
        fields: [
          field("purpose", "What went wrong with the purpose and objectives?"),
          field("risk", "Which risks should have been on the register — and what contingency plans would have helped?"),
          field("comms", "What communication and control problems do you see?"),
          field("mine", "Three lessons I'll apply to My Event:"),
        ],
      },
      {
        exerciseId: "em-schedule",
        title: "My schedule",
        table: { columns: ["Task / work package", "Duration", "Depends on", "Planned start (week or date)", "Milestone?"], rows: numbered("Task", 10) },
      },
      {
        exerciseId: "em-critical",
        title: "My critical path",
        fields: [
          field("paths", "The main paths to event day and their total durations:"),
          field("critical", "My critical path:"),
          field("float", "Tasks with the most float:"),
          field("buffer", "Where I'll add buffers or plan B:"),
        ],
      },
      {
        exerciseId: "em-risks",
        title: "My risk register",
        table: { columns: ["Risk", "Consequence (1–5)", "Likelihood (1–5)", "Overall (C × L)", "Contingency plan"], rows: numbered("Risk", 8) },
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "em-risk-reviewer",
        title: "AI Risk & Schedule Reviewer",
        intro: "Checks your critical path and dependencies, and challenges your risk scores and contingency plans.",
        usesExercises: ["em-my-event", "em-schedule", "em-critical", "em-risks"],
        promptTemplate:
          "Here is my event, schedule, critical path and risk register:\n\n[PASTE YOUR ANSWERS]\n\nPlease:\n\n1. check my critical path calculation;\n2. point out missing tasks or dependencies;\n3. challenge any risk scores that look too low or too high;\n4. suggest missing risks for this type of event;\n5. improve my weakest contingency plan.",
        systemPrompt:
          "Exercise: Lesson 4 — risk and schedule reviewer. From the learner's task list, recompute path lengths to event day where durations and dependencies allow; confirm or correct the critical path and float, showing brief working. Flag missing typical tasks (e.g. venue contract, insurance, permits/licences, final numbers to caterer ~2 weeks and ~2 days before, briefings, rehearsal, set-up and pack-down) and missing dependencies. Check each risk's C × L arithmetic; challenge scores that seem unrealistic, and add 3–5 missing risks relevant to their event type (e.g. power/internet failure, speaker no-show, bad weather, overcrowding, medical emergency, ticketing glitch, supplier failure). Rewrite their weakest contingency plan into a concrete one (trigger, owner, action). For safety-critical risks, remind them to follow local regulations and involve the venue and qualified professionals. Use short tables.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("\"You can't print the programme until speakers are confirmed\" is which dependency?", ["Start-to-Start", "Finish-to-Start", "Finish-to-Finish", "Start-to-Finish"],
        1, "B starts only after A finishes."),
      q("The critical path is:", ["The shortest chain of tasks", "The longest chain of dependent tasks, which sets the minimum time to be ready", "The most expensive tasks", "Tasks the manager does personally"],
        1, "Any delay on it delays everything."),
      q("In the workshop example, what is the critical path?", ["A→B→C (6 weeks)", "A→D→E (8 weeks)", "A→F (3 weeks)", "B→C→F"],
        1, "It's the longest path."),
      q("A risk with consequence 4 and likelihood 3 scores:", ["7", "12", "1", "43"],
        1, "C × L = 12."),
      q("A key lesson from the Millennium Dome's opening night is:", ["Always use trains", "Unclear purpose plus weak risk planning and poor communication can damage an event's reputation from day one", "Big venues never work", "Security isn't needed"],
        1, "Purpose, risk and communication all failed."),
    ],
  },

  // ---------------------------------------------------------------- 5 venue & catering
  {
    lessonId: "em-venue",
    title: "5 · Venue, Catering & Layout",
    lessonOrder: 6,
    duration: "75 minutes",
    objective: "Choose your venue with a weighted trade-off, and plan catering, seating and staging.",
    contentBody: `
<h2>There is no perfect venue</h2>
<p>The venue shapes almost everything else — what you can offer, how people feel, and your budget. Every venue has strengths and drawbacks, so you're looking for the <strong>best compromise</strong>. And you can only compromise well if you know exactly what you want — which brings you back to your objectives.</p>

<h2>Choosing a venue</h2>
${ol([
  "<strong>Define requirements</strong> from your objectives: capacity, location, budget, facilities, atmosphere, dates.",
  "<strong>Long-list</strong> venues, then create a fact sheet for each: environment, transport access (foot, road, rail, bus, air), parking, capacity of each space, catering facilities, toilets, exhibition space, entrances for guests and staff.",
  "<strong>Check accessibility</strong>: step-free access, accessible toilets, lifts, hearing loops, seating for wheelchair users, a quiet room, prayer or reflection space if your audience needs one.",
  "<strong>Visit</strong> your shortlist at the same time of day as your event.",
  "<strong>Score them</strong> with a weighted trade-off.",
  "<strong>Negotiate and contract</strong>: what's included, deposit, cancellation terms, access times for set-up and pack-down.",
])}
<p>Once booked, plan the logistics: food and drink ordering, staff uniforms, linen, security, dressing or green rooms, audio-visual equipment, staging and backdrop, and decoration.</p>

<h2>The weighted trade-off</h2>
<p>List your criteria and give each a <strong>weight from 1–5</strong> (how much it matters). Score each venue <strong>0–5</strong> on each criterion. Multiply score × weight, add up, and the highest total wins.</p>
${table(["Criterion", "Weight", "Venue A (score → weighted)", "Venue B (score → weighted)"], [
  ["Location", "5", "4 → 20", "3 → 15"],
  ["Transport access", "4", "3 → 12", "5 → 20"],
  ["Capacity fits", "5", "5 → 25", "4 → 20"],
  ["Catering", "3", "2 → 6", "4 → 12"],
  ["Accessibility", "4", "3 → 12", "5 → 20"],
  ["Cost", "4", "4 → 16", "2 → 8"],
  ["<strong>Total</strong>", "", "<strong>91</strong>", "<strong>95</strong>"],
])}
<p>Venue B wins narrowly — but a close result is a prompt to double-check the weights. If cost matters more than you first thought, the answer could flip. The value is in making the trade-offs visible.</p>
${block("exercise", "em-venue-factors")}
${block("exercise", "em-tradeoff")}

<h2>AI practical exercise — Venue Trade-off Calculator</h2>
<p>Your calculator totals your weighted scores, shows how sensitive the result is to your weights, and asks what you might have missed.</p>
${block("coach", "em-venue-calculator")}

<h2>Catering</h2>
<p>For any event lasting more than a couple of hours, there's food — and people talk about food. Good catering lifts an event; bad catering is what everyone remembers. For corporate events you'll usually use the venue's catering; outside caterers are more common for festivals and outdoor events.</p>
<p><strong>Buffets</strong> come in two types: <em>finger buffets</em> (guests stand) and <em>fork buffets</em> (guests sit). Plan the queue: people expect one — set out tables, drinks and any payment points so the flow is obvious.</p>
<p><strong>Timing rule of thumb:</strong> each diner takes about 20 seconds to fill a plate. At a single buffet line, 100 people take about 33 minutes just to be served — so a 30-minute break is too short. Use two-sided tables or several stations to speed things up.</p>
${table(["Service", "Staff rule of thumb"], [
  ["Buffet", "About 1 member of staff per 30 diners"],
  ["Full table service", "About 1 member of staff per 10–15 diners"],
  ["Drinks service at a dinner", "About 1 member of staff per 30 diners"],
])}
<p>Caterers typically need approximate numbers about two weeks before and final numbers about two days before — put both in your Gantt chart.</p>
<p><strong>Ask about your guests:</strong> numbers, ages, food preferences and <strong>dietary requirements</strong> (halal, kosher, vegetarian, vegan, allergies, medical diets), and plan to label food clearly. Ask about the venue: staff experience, kitchen and storage, utilities, whether outside food is allowed, hot or cold service, preparation space, and cleaning.</p>
${table(["Do", "Don't"], [
  ["Offer food that's easy to eat standing up.", "Serve very messy or hard-to-eat dishes at a standing event."],
  ["Mix familiar and international flavours.", "Rely on strong garlic or onion that fills the room."],
  ["Provide water and soft drinks in small sealed bottles.", "Make every dish very spicy — offer mild options too."],
  ["Provide plenty of napkins and bins.", "Forget a generous vegetarian selection — it also helps many guests with religious dietary needs."],
])}
<p><strong>Avoid the \"salt pot\" problem:</strong> think ahead about small things guests will ask for (water jugs on tables, salt, extra napkins). Each request pulls a staff member away at the busiest moment.</p>

<h2>Seating layouts</h2>
${table(["Layout", "Best for"], [
  ["Theatre", "Presentations and staged performances to large audiences"],
  ["Classroom", "Teaching and note-taking"],
  ["U-shape", "Training and discussion with a facilitator"],
  ["Boardroom", "Formal meetings"],
  ["Parallel rows facing each other", "Debates, or competitions between two groups"],
  ["Banquet (long tables)", "Formal dining"],
  ["Banquet rounds", "Dinners, awards and networking — arrange rounds in an orderly grid, not scattered"],
  ["Square / cabaret", "Workshops and group work"],
  ["Half circle", "Team building and emotionally engaging sessions"],
])}

<h2>Staging tips</h2>
${list([
  "<strong>Wider is better than deeper</strong> — keep the audience close to the stage.",
  "<strong>Connect audience and speaker</strong> — shortest possible distance to the front.",
  "<strong>Create atmosphere</strong> — flat ballrooms with high ceilings make stages hard to see and atmosphere hard to build.",
  "<strong>Check sight-lines</strong> from every seat.",
  "<strong>Plan for the dark</strong> — if you dim the lights, can people still move safely, read or take notes?",
])}

<h2>Scenario</h2>
${block("scenario", "em-buffet")}

<h2>Lesson 5 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "em-venue-factors",
        title: "Venue critical factors",
        fields: [
          field("expect", "What is expected of the venue, given my objectives?"),
          field("params", "My 5–7 most important venue parameters (P1, P2, …):"),
          field("access", "Accessibility and inclusion needs my venue must meet:"),
        ],
      },
      {
        exerciseId: "em-tradeoff",
        title: "My venue trade-off",
        table: {
          columns: ["Weight (1–5)", "Venue 1 score (0–5)", "Venue 2 score (0–5)", "Venue 3 score (0–5)"],
          rows: ["Venue names (write them here)", "Location", "Transport access", "Parking", "Capacity fits", "Catering", "Facilities & AV", "Accessibility", "Cost", "My own criterion"],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "em-buffet",
        title: "The lunch break",
        question: "You have 150 guests and a single buffet line. How long should you allow just to serve lunch?",
        options: [
          "About 10 minutes",
          "About 20 minutes",
          "About 50 minutes — or add more serving points",
          "It doesn't matter",
        ],
        answer: 2,
        explanation: "150 × 20 seconds = 3,000 seconds = 50 minutes at one line. Add stations or two-sided tables to shorten it.",
      },
    ],
    coaches: [
      {
        coachId: "em-venue-calculator",
        title: "AI Venue Trade-off Calculator",
        intro: "Totals your weighted venue scores, tests how sensitive the result is to your weights, and spots criteria you might have missed.",
        usesExercises: ["em-my-event", "em-venue-factors", "em-tradeoff"],
        promptTemplate:
          "Here are my venue factors and trade-off scores:\n\n[PASTE YOUR ANSWERS]\n\nPlease:\n\n1. calculate the weighted total for each venue (score × weight, summed) and show a table;\n2. tell me which venue wins and by how much;\n3. show whether the winner changes if I raise or lower my most uncertain weight by 1;\n4. suggest criteria I might have missed, including accessibility.",
        systemPrompt:
          "Exercise: Lesson 5 — venue trade-off calculator. Parse the learner's table (first row may hold venue names; rows are criteria with weight 1–5 and scores 0–5 per venue). Compute score × weight per cell and totals per venue in a Markdown table; double-check the arithmetic. Report the winner and margin. Do a simple sensitivity check: change the weight of the most influential or most uncertain criterion by ±1 and say whether the winner changes. If data are missing, ask for them rather than guessing. Suggest missing criteria relevant to their event (accessibility, set-up/pack-down access times, cancellation terms, noise curfew, Wi-Fi capacity, power, security, parking, catering flexibility, prayer or quiet space). Remind them the numbers inform — not replace — their judgement and a site visit.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("In a weighted trade-off, a venue's total is:", ["The sum of its scores", "The sum of score × weight for each criterion", "Its cost", "The average weight"],
        1, "Weights reflect how much each criterion matters."),
      q("Roughly how many staff for full table service?", ["1 per 100 diners", "1 per 10–15 diners", "1 per 50 diners", "1 per 2 diners"],
        1, "Buffet is about 1 per 30."),
      q("When do caterers usually need final numbers?", ["On the day", "About two days before", "Two months before", "Never"],
        1, "Approximate numbers ~2 weeks before; final ~2 days before."),
      q("Which layout suits a workshop with group work?", ["Theatre", "Square / cabaret", "Boardroom", "Parallel rows"],
        1, "Groups can work around tables."),
      q("Why is \"wider rather than deeper\" better for staging?", ["It's cheaper", "It keeps the audience closer to the stage", "It fits more tables", "It's traditional"],
        1, "Closer audiences connect with speakers."),
    ],
  },
];
