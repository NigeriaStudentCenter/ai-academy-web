// Become Extra Ordinary — Module 10: Become Extra Ordinary (Days 28–30),
// plus the course-complete lesson with the whole-course Transformation
// Portfolio. Same lesson format as Modules 1–9.

const block = (kind, id) => `<div data-block="${kind}${id ? `:${id}` : ""}"></div>`;
const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const flow = (steps) => `<p><strong>${steps.join("</strong><br>↓<br><strong>")}</strong></p>`;
const paras = (text) =>
  text
    .trim()
    .split(/\n\s*\n/)
    .map((p) => `<p>${p.trim().replace(/\n/g, "<br>")}</p>`)
    .join("\n");
const talk = (title, script) => `
<h2>Teaching talk — ${title}</h2>
<p><em>Video coming soon. Until then, read the talk below.</em></p>
${paras(script)}`;
const table = (head, rows) =>
  `<table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</table>`;
const field = (id, label, type = "textarea") => ({ id, label, type });
const QUIZ_BANDS = [
  { min: 5, max: 5, title: "Excellent" },
  { min: 4, max: 4, title: "Strong understanding" },
  { min: 3, max: 3, title: "Developing" },
  { min: 0, max: 2, title: "Review today's lesson" },
];
const numbered = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m10-intro",
    title: "Module 10 · Become Extra Ordinary",
    lessonOrder: 46,
    duration: "15 minutes",
    objective: "From transformation to a way of life.",
    contentBody: `
<h2>Module 10 — Become Extra Ordinary</h2>
<p><strong>Days 28–30 · From transformation to a way of life</strong></p>
${flow(["REFLECT", "INTEGRATE", "COMMIT", "BUILD", "CONTRIBUTE", "BECOME"])}

<h2>You have reached the final three days</h2>
<p>But this is not the end of the programme. It is the point at which the programme becomes a way of living.</p>
<p>Over the last 27 days, you have questioned assumptions; examined your beliefs; explored your identity; imagined your future; developed resilience; learned from setbacks; explored creativity; turned ideas into action; created an Extraordinary Project; explored your strengths; considered your contribution; and developed a personal mission. Now comes the most important question:</p>
<blockquote><p>What will you do with everything you have discovered?</p></blockquote>
<p>Knowledge does not transform a life by itself. Reflection does not transform a life by itself. Goals do not transform a life by themselves. <strong>Transformation happens when understanding becomes behaviour.</strong> Module 10 therefore asks you to bring everything together into a personal system for continuing your development.</p>

<h2>The final module question</h2>
<blockquote><p>Who are you choosing to become, what are you choosing to create, and what will you do consistently to move in that direction?</p></blockquote>

<h2>Module 10 learning outcomes</h2>
<p>By the end of Module 10, you should be able to:</p>
<ol>
<li>Review your transformation journey.</li>
<li>Identify significant changes in your thinking.</li>
<li>Identify behaviours you want to maintain.</li>
<li>Identify behaviours you want to change.</li>
<li>Create a personal Extraordinary Operating System.</li>
<li>Establish practical habits.</li>
<li>Identify priorities for the next 12 months.</li>
<li>Create a personal development blueprint.</li>
<li>Connect identity, goals, contribution and action.</li>
<li>Establish measures of progress.</li>
<li>Create personal review mechanisms.</li>
<li>Use AI as an ongoing reflection and planning partner.</li>
<li>Identify your next major experiment.</li>
<li>Create a personal commitment statement.</li>
<li>Articulate what "Become Extra Ordinary" means to you.</li>
</ol>

<h2>Module 10 diagnostic — How intentionally are you designing your life?</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>. The result is a reflection tool rather than a judgement of you.</p>
${block("exercise", "m10-diagnostic")}
<p><strong>Important:</strong> this is a learning and development diagnostic, not a psychological assessment, diagnosis, intelligence test or prediction of future success.</p>
`,
    exercises: [
      {
        exerciseId: "m10-diagnostic",
        title: "Intentional Life Design Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Integration",
              statements: [
                "I regularly reflect on what I am learning from my experiences.",
                "I can connect my values with my everyday decisions.",
                "I understand how my beliefs influence my actions.",
                "I can recognise when I am operating on autopilot.",
                "I regularly review whether my actions are aligned with the person I want to become.",
              ],
            },
            {
              title: "Intentional action",
              statements: [
                "I turn important intentions into specific actions.",
                "I break large goals into manageable steps.",
                "I experiment rather than waiting for perfect certainty.",
                "I learn from setbacks and adjust my approach.",
                "I create evidence of progress rather than relying only on intentions.",
              ],
            },
            {
              title: "Future & contribution",
              statements: [
                "I have a clear direction for the next stage of my life.",
                "I know some of the strengths I want to develop and use.",
                "I understand the type of contribution I want to explore.",
                "I have practical priorities for the next 12 months.",
                "I have a system for reviewing and adjusting my direction.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "Beginning to integrate learning into intentional action." },
            { min: 27, max: 38, title: "Developing", text: "Some systems are emerging but consistency needs development." },
            { min: 39, max: 50, title: "Building", text: "Growing ability to connect reflection, action and future direction." },
            { min: 51, max: 62, title: "Intentional", text: "Strong integration between values, goals, action and contribution." },
            { min: 63, max: 75, title: "Designing", text: "Highly developed approach to intentional personal development." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 28
  {
    lessonId: "m10-day-28",
    title: "Module 10 · Day 28 — Your Extraordinary Operating System",
    lessonOrder: 47,
    duration: "75 minutes",
    objective: "How will you continue becoming?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What systems, habits and decisions will help you continue becoming the person you have described throughout this course?</p></blockquote>
${talk("Don't finish the course — build the system", `
Imagine completing this programme today. You feel inspired. You have written goals. You have created a vision. You have identified strengths. You have started a project.

Then Monday arrives. Work gets busy. Life becomes complicated. Something goes wrong. Your attention moves elsewhere. And gradually, everything you discovered becomes another forgotten notebook.

That is why the final stage of transformation is not motivation. It is systems.

A system helps you continue acting when motivation changes. You need a way to review, reflect, act, measure, learn, adjust — and repeat.

Your Extraordinary Operating System does not need to be complicated. It could include a weekly reflection, a monthly goal review, a learning habit, a health habit, a relationship habit, a contribution habit, a creative habit, a project review.

The purpose is simple. Instead of asking occasionally, "Am I becoming the person I want to be?", you create a regular process for asking the question.

Extraordinary is not one dramatic moment. <strong>It is a pattern of intentional choices.</strong>

Today you will design your personal operating system.`)}

<h2>Reading — Motivation vs systems</h2>
<p>Motivation can help you begin. <strong>Systems help you continue.</strong></p>
${table(["Motivation", "System"], [
  ["\"I should exercise more.\"", "\"Monday, Wednesday and Saturday at 7am I walk for 30 minutes.\""],
  ["\"I want to learn AI.\"", "\"I spend 30 minutes every Tuesday and Thursday building a practical AI project.\""],
  ["\"I want to improve my career.\"", "\"Every Friday I review one skill, one opportunity and one piece of evidence I can add to my portfolio.\""],
])}
<p>The objective is not to create a perfect routine. It is to create a <strong>repeatable</strong> one.</p>

<h2>The BSOE Extraordinary Operating System</h2>
<ol>
<li><strong>Notice</strong> — what is happening?</li>
<li><strong>Reflect</strong> — what am I learning?</li>
<li><strong>Choose</strong> — what matters now?</li>
<li><strong>Act</strong> — what will I do?</li>
<li><strong>Review</strong> — what happened and what needs changing?</li>
</ol>
${flow(["NOTICE", "REFLECT", "CHOOSE", "ACT", "REVIEW", "REPEAT"])}
<p>This becomes your continuing personal development loop.</p>

<h2>Interactive example — Turning an intention into a system</h2>
<p>Intention: <em>"I want to become more creative."</em></p>
${table(["When", "System"], [
  ["Daily", "Record one observation or idea."],
  ["Weekly", "Spend 30 minutes developing one idea."],
  ["Monthly", "Complete one creative experiment."],
  ["Quarterly", "Review what was learned."],
])}
<p>The learner has converted an aspiration into behaviour.</p>

<h2>Case study — Aisha's Extraordinary Operating System</h2>
<p>Aisha wanted to become more confident professionally. Her original plan — <em>"Be more confident"</em> — was too vague. She created a system:</p>
<ul>
<li><strong>Every week:</strong> speak up at least once in an important meeting; record one achievement; ask for one piece of feedback; learn one new professional skill.</li>
<li><strong>Every month:</strong> update her evidence portfolio; review her goals; identify one challenge to undertake.</li>
<li><strong>Every quarter:</strong> review progress; identify gaps; adjust priorities.</li>
</ul>
<p>Her confidence was no longer dependent entirely on how she felt. She had created repeated opportunities to build evidence.</p>

<h2>Learner activity — Build your Extraordinary Operating System</h2>
${block("exercise", "d28-os")}

<h2>AI practical exercise — AI Personal Review Partner</h2>
<p>Your review partner reads your operating system and helps you make it clearer and more practical. It won't redesign your life.</p>
${block("coach", "d28-review")}

<h2>Scenario activity</h2>
<p>James creates 15 new habits because he wants to completely transform his life. Two weeks later he has abandoned all of them.</p>
${block("scenario", "d28-james")}

<h2>Real-world challenge — Start one system today</h2>
<p>Choose <strong>one behaviour</strong> from your Extraordinary Operating System. Do it today.</p>
${block("exercise", "d28-start")}

<h2>Day 28 reflection</h2>
${block("exercise", "d28-reflection")}

<h2>Day 28 quiz</h2>
${block("quiz")}

<h2>Day 28 assignment — My Extraordinary Operating System</h2>
<p>Create a practical system. Recommended length: 700–1,000 words in total.</p>
${block("exercise", "d28-assignment")}
`,
    exercises: [
      {
        exerciseId: "d28-os",
        title: "My Extraordinary Operating System",
        fields: [
          field("daily", "Daily — one behaviour I want to practise:"),
          field("weekly", "Weekly — one thing I will review:"),
          field("monthly", "Monthly — one result I will measure:"),
          field("quarterly", "Quarterly — one major question I will ask myself:"),
          field("wrong", "When something goes wrong, my first response will be:"),
          field("achieve", "When I achieve something, I will:"),
          field("lost", "When I lose direction, I will:"),
          field("learn", "When I need to learn, I will:"),
        ],
      },
      {
        exerciseId: "d28-start",
        title: "Starting one system today",
        fields: [
          field("did", "What I did:"),
          field("long", "How long it took:"),
          field("happened", "What happened:"),
          field("learned", "What I learned:"),
          field("repeat", "Whether I will repeat it:"),
        ],
      },
      {
        exerciseId: "d28-reflection",
        title: "Day 28 reflection",
        fields: [
          field("difference", "What behaviour would make the greatest difference if I repeated it consistently for one year?"),
          field("stopping", "What is stopping me from starting?"),
          field("easier", "What could make the behaviour easier to repeat?"),
        ],
      },
      {
        exerciseId: "d28-assignment",
        title: "My Extraordinary Operating System (assignment)",
        fields: [
          field("daily", "Daily behaviour:"),
          field("weekly", "Weekly review:"),
          field("monthly", "Monthly review:"),
          field("quarterly", "Quarterly review:"),
          field("setbacks", "Response to setbacks:"),
          field("learning", "Learning:"),
          field("contribution", "Contribution:"),
          field("project", "Project development:"),
          field("wellbeing", "Personal wellbeing:"),
          field("goals", "Goal review:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d28-james",
        title: "Fifteen new habits",
        question: "What is the most useful lesson?",
        options: [
          "Transformation does not work.",
          "He should create 30 more habits.",
          "A smaller number of realistic, repeatable behaviours may be easier to maintain and review.",
          "He should wait until motivation returns.",
        ],
        answer: 2,
        explanation: "The purpose of a personal system is sustainable action, not maximum complexity.",
      },
    ],
    coaches: [
      {
        coachId: "d28-review",
        title: "AI Personal Review Partner",
        intro: "Finds unclear commitments, unrealistic expectations, missing review points and useful measures in your operating system.",
        usesExercises: ["d28-os"],
        promptTemplate:
          "Here is my Extraordinary Operating System:\n\n[PASTE YOUR ANSWERS]\n\nHelp me identify:\n\n- unclear commitments;\n- unrealistic expectations;\n- missing review points;\n- useful measures;\n- possible obstacles;\n- questions I should ask myself regularly.\n\nDo not redesign my life for me.\n\nDo not tell me what I must do.\n\nHelp me make my own system clearer and more practical.",
        systemPrompt:
          "Exercise: Day 28 — personal review partner. Review the learner's operating system against the Notice → Reflect → Choose → Act → Review loop. Identify unclear commitments (quote them and ask what 'done' looks like — when, how long, how often), unrealistic expectations (too many habits at once, as with James's 15), missing review points, useful measures, possible obstacles, and 3–5 questions to ask themselves regularly. Suggest simplifying where it's overloaded. Keep their system theirs — offer options, not instructions. Encourage wellbeing-friendly habits (rest, sleep, relationships) without prescribing health advice.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the purpose of a personal operating system?",
        ["To make life completely predictable", "To create repeatable processes for intentional action and review", "To remove all uncertainty", "To guarantee success"],
        1, "A system helps you keep acting when motivation changes."),
      q("What is usually more practical?",
        ["Twenty new habits simultaneously", "A small number of meaningful repeatable behaviours", "No habits", "A complicated timetable"],
        1, "Sustainable beats maximal."),
      q("What should happen after action?", ["Never review it", "Review what happened and learn", "Assume success", "Start something completely unrelated"],
        1, "Act → Review → Repeat."),
      q("What is the difference between motivation and a system?",
        ["They are identical", "Motivation can initiate action; systems help structure repeated action", "Systems eliminate effort", "Motivation is always bad"],
        1, "Motivation helps you begin; systems help you continue."),
      q("What should happen when a system is not working?",
        ["Treat it as personal failure", "Review and adjust it", "Abandon all goals", "Ignore the evidence"],
        1, "A struggling system is information — adjust it."),
    ],
  },

  // ---------------------------------------------------------------- day 29
  {
    lessonId: "m10-day-29",
    title: "Module 10 · Day 29 — Your Extraordinary Life Blueprint",
    lessonOrder: 48,
    duration: "90 minutes",
    objective: "Where are you going next?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>If you continued developing intentionally for the next 12 months, what would you want to have learned, built, changed and contributed?</p></blockquote>
${talk("Design your next 12 months", `
You have spent 29 days looking inward and outward. You have explored who you are. You have imagined what could be possible. You have created goals. You have tested ideas. You have explored contribution.

Now it is time to create a blueprint.

A blueprint is not a prediction. It is not a guarantee. It is not a rigid contract with the future. It is a direction.

Your next 12 months should not contain 50 priorities. Choose the things that matter most.

Think across several areas: your development, your work, your finances, your relationships, your wellbeing, your learning, your creativity, your contribution, your Extraordinary Project.

Then ask: What would meaningful progress look like? What would I like to learn? What would I like to create? What would I like to change? Who would I like to help? What evidence would show that I have moved forward?

Then work backwards. Twelve months. Ninety days. Thirty days. Seven days. Today.

The future becomes actionable when you connect it to the next step.`)}

<h2>Reading — The 12-month blueprint</h2>
${flow([
  "12 MONTHS — What meaningful direction am I pursuing?",
  "90 DAYS — What major progress should I make first?",
  "30 DAYS — What project or experiment will move me forward?",
  "7 DAYS — What immediate actions will I take?",
  "TODAY — What can I do now?",
])}

<h2>The difference between a goal and a blueprint</h2>
<p>A goal might say: <em>"Become more employable."</em> A blueprint says:</p>
${table(["Level", "Blueprint"], [
  ["12 months", "Move towards a new professional direction."],
  ["90 days", "Develop three practical portfolio projects."],
  ["30 days", "Complete the first project."],
  ["7 days", "Design and begin it."],
  ["Today", "Define the project requirements."],
])}
<p>The blueprint creates a bridge between the future and the present.</p>

<h2>Interactive example — One-year transformation</h2>
<p>Starting point: <em>"I want a better career."</em></p>
${table(["Level", "Plan"], [
  ["12 months", "Develop a portfolio and move towards a digital role."],
  ["90 days", "Complete three practical projects."],
  ["30 days", "Complete project one."],
  ["7 days", "Build the first prototype."],
  ["Today", "Define the problem the prototype will solve."],
])}
<p>The learner can now see the pathway.</p>

<h2>Case study — Michael's 12-month blueprint</h2>
<p>Michael wanted to develop his digital career. Instead of listing 25 goals, he selected four priorities:</p>
<ol>
<li><strong>Skills</strong> — develop practical AI and digital automation skills.</li>
<li><strong>Evidence</strong> — create a portfolio of applied projects.</li>
<li><strong>Network</strong> — build relationships with people in his target field.</li>
<li><strong>Contribution</strong> — help other learners understand digital tools.</li>
</ol>
<p>His 90-day priorities were: complete two practical projects; speak with five professionals; publish four useful pieces of content; support one learner. This gave his year a direction without requiring him to know exactly where he would be 12 months later.</p>

<h2>Learner activity — My Extraordinary Life Blueprint</h2>
${block("exercise", "d29-vision")}
<h3>My 90-day objectives</h3>
${block("exercise", "d29-objectives")}
<h3>My next 30 days, 7 days and 24 hours</h3>
${block("exercise", "d29-next")}

<h2>AI practical exercise — AI Blueprint Review Partner</h2>
<p>Your blueprint partner reads your vision, priorities, objectives and next steps, looking for conflicts, gaps and ways to simplify. It won't choose your priorities or predict success.</p>
${block("coach", "d29-review")}

<h2>Scenario activity</h2>
<p>Sarah creates 25 goals for the next 12 months. She asks: <em>"Which one should I choose?"</em></p>
${block("scenario", "d29-sarah")}

<h2>Real-world challenge — Tell someone your blueprint</h2>
<p>Explain your next 12 months in three minutes. Ask: <em>"What do you understand my priorities to be?"</em> Then ask: <em>"What seems unclear?"</em> Use the feedback to improve your blueprint.</p>
${block("exercise", "d29-tell")}

<h2>Day 29 reflection</h2>
${block("exercise", "d29-reflection")}

<h2>Day 29 quiz</h2>
${block("quiz")}

<h2>Day 29 assignment — My Extraordinary Life Blueprint</h2>
<p>Your 12-month vision, five priorities, 90-day objectives, 30-day project, seven-day plan and next 24-hour action above are part of this submission. Add your evidence measures and review dates. Recommended length: 800–1,200 words in total.</p>
${block("exercise", "d29-assignment")}
`,
    exercises: [
      {
        exerciseId: "d29-vision",
        title: "One-year vision and five priorities",
        fields: [
          field("vision", "One year from now, meaningful progress would look like:"),
          field("p1", "Priority 1:"),
          field("p2", "Priority 2:"),
          field("p3", "Priority 3:"),
          field("p4", "Priority 4:"),
          field("p5", "Priority 5:"),
        ],
      },
      {
        exerciseId: "d29-objectives",
        title: "My 90-day objectives",
        table: { columns: ["90-day objective", "Evidence"], rows: numbered("Priority", 5) },
      },
      {
        exerciseId: "d29-next",
        title: "My next steps",
        fields: [
          field("thirty", "My next 30-day project — I will…"),
          field("seven", "My next 7 days (up to five actions):"),
          field("today", "My next 24 hours — the next meaningful action I will take is:"),
        ],
      },
      {
        exerciseId: "d29-tell",
        title: "Telling someone my blueprint",
        fields: [
          field("understood", "What they understood my priorities to be:"),
          field("unclear", "What seemed unclear:"),
          field("improved", "How I improved my blueprint:"),
        ],
      },
      {
        exerciseId: "d29-reflection",
        title: "Day 29 reflection",
        fields: [
          field("three", "If I made meaningful progress on only three things this year, what would matter most?"),
          field("stop", "What am I willing to stop doing to create space for those priorities?"),
          field("proud", "What evidence would make me proud of the progress I had made?"),
        ],
      },
      {
        exerciseId: "d29-assignment",
        title: "Blueprint — evidence and review",
        fields: [
          field("measures", "My evidence measures:"),
          field("reviews", "My review dates (weekly, 30-day, 90-day, 12-month):"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d29-sarah",
        title: "Twenty-five goals",
        question: "What is the most useful approach?",
        options: [
          "Choose the goal with the highest financial potential.",
          "Ask AI to decide.",
          "Review which priorities matter most, what evidence is needed and what can realistically be pursued together.",
          "Attempt all 25 simultaneously.",
        ],
        answer: 2,
        explanation: "The blueprint is designed to create intentional priorities rather than an overloaded list.",
      },
    ],
    coaches: [
      {
        coachId: "d29-review",
        title: "AI Blueprint Review Partner",
        intro: "Reviews your blueprint for conflicting priorities, unclear objectives, scope, missing evidence, dependencies and review points — you make the final decisions.",
        usesExercises: ["d29-vision", "d29-objectives", "d29-next"],
        promptTemplate:
          "Here is my 12-month Extraordinary Life Blueprint:\n\n[PASTE YOUR ANSWERS]\n\nReview the structure for:\n\n- conflicting priorities;\n- unclear objectives;\n- unrealistic scope;\n- missing evidence;\n- dependencies;\n- foreseeable obstacles;\n- opportunities to simplify;\n- useful review points.\n\nDo not predict whether I will succeed.\n\nDo not choose my priorities.\n\nHelp me identify questions and possible improvements so that I can make the final decisions.",
        systemPrompt:
          "Exercise: Day 29 — blueprint review partner. Review the learner's 12-month → 90-day → 30-day → 7-day → today blueprint for: conflicting priorities, unclear objectives, unrealistic scope (flag if five priorities compete for the same time), missing or vague evidence, dependencies between priorities, foreseeable obstacles, opportunities to simplify, and useful review points. Check that each level connects to the one above it and that 'today' is genuinely doable. Frame suggestions as questions and options; never choose their priorities or predict success. For financial priorities, don't give personalised financial or investment advice.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a blueprint?",
        ["A prediction", "A rigid guarantee", "A structured direction connecting long-term priorities with immediate action", "A list of everything you want"],
        2, "A direction, not a prediction or a contract."),
      q("Why work backwards from 12 months?",
        ["To guarantee the outcome", "To connect a longer-term direction with practical actions", "To eliminate uncertainty", "To avoid experimentation"],
        1, "It builds the bridge from the future to today."),
      q("How many priorities should a learner have?", ["Exactly 20", "As many as possible", "A manageable number of meaningful priorities", "None"],
        2, "Like Michael's four — not Sarah's 25."),
      q("What should evidence do?", ["Guarantee success", "Show whether meaningful progress has occurred", "Replace action", "Predict the future"],
        1, "Evidence tells you whether you've moved forward."),
      q("What is the smallest level in the blueprint?", ["10 years", "5 years", "12 months", "Today"],
        3, "12 months → 90 days → 30 days → 7 days → today."),
    ],
  },

  // ---------------------------------------------------------------- day 30
  {
    lessonId: "m10-day-30",
    title: "Module 10 · Day 30 — From This Day Forward",
    lessonOrder: 49,
    duration: "90–120 minutes",
    objective: "Become Extra Ordinary.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What will you choose to carry forward from these 30 days?</p></blockquote>
${talk("From this day forward", `
Thirty days ago, you began with questions. Perhaps you questioned assumptions. Perhaps you examined beliefs. Perhaps you explored your identity. Perhaps you imagined a different future. Perhaps you faced something you had been avoiding. Perhaps you discovered strengths you had underestimated. Perhaps you created an idea. Perhaps you started something. Perhaps you learned that you still have questions.

That is okay. The purpose of this programme was never to give you a perfect answer. It was to help you become more intentional about the questions you ask, the choices you make and the actions you take.

Being Extra Ordinary does not mean being extraordinary every day. You will still have difficult days. You will make mistakes. You will change your mind. You will experience uncertainty. You will sometimes return to old habits.

The difference is what you do next. You can notice. You can reflect. You can choose. You can act. You can learn. You can adjust. And you can begin again.

Your Extraordinary Project may continue. Your mission may evolve. Your goals may change. Your identity may continue developing. That is not failure. <strong>That is becoming.</strong>

So don't ask: "Have I become extraordinary?" Ask: <strong>"Am I intentionally becoming?"</strong>

The answer will be demonstrated not by one dramatic moment, but by the choices you repeatedly make.

Your 30 days end here. Your journey does not.

From this day forward: question more deeply. Learn continuously. Create courageously. Contribute meaningfully. And keep becoming.

<strong>Become Extra Ordinary.</strong>`)}

<h2>Reading — What does it mean to become Extra Ordinary?</h2>
<p>The phrase does <strong>not</strong> mean becoming famous; being perfect; outperforming everyone; becoming rich; never failing; being admired; or having an easy life.</p>
<p>Instead, throughout this programme, <strong>Extra Ordinary means becoming increasingly intentional about how you live, learn, create and contribute.</strong> It means refusing to let your life be shaped entirely by autopilot. It means asking better questions; examining assumptions; developing yourself; turning possibility into action; learning from experience; creating value; and contributing something meaningful.</p>

<h2>The Extra Ordinary principles</h2>
${table(["Principle", "Meaning"], [
  ["1. Question", "Don't automatically accept every assumption."],
  ["2. Discover", "Pay attention to your strengths, values and experiences."],
  ["3. Imagine", "Allow yourself to consider possibilities."],
  ["4. Act", "Turn meaningful intentions into behaviour."],
  ["5. Experiment", "Test ideas in the real world."],
  ["6. Learn", "Treat experience as information."],
  ["7. Contribute", "Use your capabilities to create value."],
  ["8. Review", "Ask what is working and what needs changing."],
  ["9. Adapt", "Change your approach when evidence requires it."],
  ["10. Become", "Continue developing."],
])}

<h2>The Extra Ordinary loop</h2>
${flow(["QUESTION", "DISCOVER", "IMAGINE", "ACT", "LEARN", "CONTRIBUTE", "REVIEW", "BECOME"])}
<p>Then repeat. This is not a finish line. It is a way of living.</p>

<h2>Interactive example — Before and after</h2>
${table(["Before", "After 30 days"], [
  ["\"I want a better life.\"", "\"I understand more about my beliefs, strengths and priorities. I have identified a direction, created a project, tested an idea and developed a system for continuing my growth.\""],
])}
<p>The second statement is not necessarily a guarantee of a better outcome. It demonstrates something different: <strong>intentionality and evidence of action.</strong></p>

<h2>The 30-day reflection</h2>
<p>Look back at your work from earlier days — it's all saved in this course — and answer:</p>
${block("exercise", "d30-thirty")}

<h2>Case study — James, thirty days later</h2>
<p>On Day 1, James wrote: <em>"Being extraordinary means becoming successful."</em> By Day 30, his definition had changed:</p>
<blockquote><p>Being Extra Ordinary means deliberately developing my capabilities, creating things that matter, learning from what happens and using what I learn to contribute to other people.</p></blockquote>
<p>He had not solved every problem. He had not achieved every goal. But he had challenged assumptions; identified strengths; started a project; tested an idea; developed a routine; identified a possible mission; and created a 12-month blueprint.</p>
<p>His transformation was not measured by claiming that his life had become perfect. It was measured by what he had begun to <strong>think, do, test and change</strong>.</p>

<h2>Learner activity — My Extra Ordinary Declaration</h2>
${block("exercise", "d30-declaration")}

<h2>AI practical exercise — AI 30-Day Reflection Partner</h2>
<p>Your reflection partner brings in selected work from across the course — your Day 1 definition, identity and Future Self work, mission, blueprint and 30-day reflection — and helps you organise the evidence. It won't tell you who you are.</p>
${block("coach", "d30-reflection-partner")}

<h2>Final scenario activity</h2>
<p>A learner completes the course and says: <em>"I've finished. Now I don't need to think about any of this again."</em></p>
${block("scenario", "d30-finished")}

<h2>Real-world final challenge — Make one commitment real</h2>
<p>Choose <strong>one commitment</strong> from your 12-month blueprint. Take one concrete action today. Not tomorrow. Not next week. <strong>Today.</strong> Send the message; register for the opportunity; create the first page; begin the project; speak to the person; publish the first piece; schedule the learning session; build the prototype; make the introduction; start the habit.</p>
${block("exercise", "d30-commit")}

<h2>Final reflection</h2>
<p><strong>Take 10 minutes without AI.</strong> Write freely.</p>
${block("exercise", "d30-final")}

<h2>Day 30 quiz</h2>
${block("quiz")}

<h2>Day 30 final assignment — From This Day Forward</h2>
<p>Create a final personal statement. Recommended length: 1,000–1,500 words in total.</p>
${block("exercise", "d30-assignment")}
`,
    exercises: [
      {
        exerciseId: "d30-thirty",
        title: "My 30-day reflection",
        fields: [
          field("d1", "Day 1 — What did I originally believe \"extraordinary\" meant?"),
          field("d30", "Day 30 — What does it mean to me now?"),
          field("d2", "Day 2 — What invisible rule did I question?"),
          field("d7", "Day 7 — What did I discover about my identity?"),
          field("d10", "Day 10 — What did I imagine for my future?"),
          field("d16", "Day 16 — What did I learn about failure?"),
          field("d19", "Day 19 — What did I notice that I had previously overlooked?"),
          field("d24", "Day 24 — What did I actually create or test?"),
          field("d25", "Day 25 — What strength did I discover?"),
          field("d27", "Day 27 — What contribution do I want to explore?"),
          field("d29", "Day 29 — What are my next priorities?"),
        ],
      },
      {
        exerciseId: "d30-declaration",
        title: "My Extra Ordinary Declaration",
        fields: [
          field("understand", "I now understand that…"),
          field("discovered", "I have discovered that…"),
          field("become", "I want to become…"),
          field("create", "I want to create…"),
          field("contribute", "I want to contribute…"),
          field("learn", "I will continue to learn…"),
          field("fail", "When I fail, I will…"),
          field("uncertain", "When I am uncertain, I will…"),
          field("direction", "When I lose direction, I will…"),
          field("person", "The person I am becoming will…"),
        ],
      },
      {
        exerciseId: "d30-commit",
        title: "Making one commitment real",
        fields: [
          field("decided", "I decided to…"),
          field("did", "I actually did…"),
          field("result", "The result was…"),
          field("learned", "I learned…"),
          field("next", "My next action is…"),
        ],
      },
      {
        exerciseId: "d30-final",
        title: "Final reflection (10 minutes, without AI)",
        fields: [
          field("before", "Before these 30 days, I thought…"),
          field("now", "Now I understand…"),
          field("becoming", "The person I am becoming…"),
          field("contribution", "The contribution I want to explore…"),
          field("autopilot", "The thing I will no longer leave entirely to autopilot…"),
          field("forward", "From this day forward, I will…"),
        ],
      },
      {
        exerciseId: "d30-assignment",
        title: "From This Day Forward",
        fields: [
          field("discovered", "1. What have I discovered?"),
          field("thinking", "2. What has changed in my thinking?"),
          field("identity", "3. What have I learned about my identity?"),
          field("strengths", "4. What strengths will I develop?"),
          field("future", "5. What future am I designing?"),
          field("project", "6. What project will I continue?"),
          field("contribution", "7. What contribution do I want to explore?"),
          field("habits", "8. What habits will support me?"),
          field("priorities", "9. What are my three most important priorities?"),
          field("hours", "10. What will I do in the next 24 hours?"),
          field("weekly", "11. What will I review every week?"),
          field("ninety", "12. What will I revisit every 90 days?"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d30-finished",
        title: "\"I've finished\"",
        question: "What is the most useful lesson from the programme?",
        options: [
          "The course should continue forever.",
          "Personal development is a one-time event.",
          "The course is intended to establish practices of reflection, action, learning and adjustment that can continue beyond the 30 days.",
          "The learner must follow the exact same plan forever.",
        ],
        answer: 2,
        explanation: "The programme is designed to create a continuing process rather than dependence on the course.",
      },
    ],
    coaches: [
      {
        coachId: "d30-reflection-partner",
        title: "AI 30-Day Reflection Partner",
        intro: "Organises the evidence from your own reflections across the course — themes, changes in how you describe yourself, strengths, recurring challenges, actions and next questions.",
        usesExercises: ["d1-assignment", "d7-assignment", "d8-assignment", "d27-missions", "d29-vision", "d30-thirty"],
        promptTemplate:
          "I have completed a 30-day personal development programme.\n\nHere are some of my reflections:\n\n[PASTE YOUR ANSWERS]\n\nHelp me identify:\n\n1. recurring themes;\n2. changes in the way I describe myself;\n3. changes in my priorities;\n4. strengths I repeatedly mention;\n5. challenges that continue to appear;\n6. actions I have taken;\n7. questions I may want to explore next.\n\nDo not diagnose me.\n\nDo not tell me who I am.\n\nDo not tell me what my life purpose is.\n\nDo not predict my future.\n\nHelp me organise the evidence from my own reflections.",
        systemPrompt:
          "Exercise: Day 30 — 30-day reflection partner. The learner's reflections come from across the course (Day 1 definition, Day 7 identity, Day 8 Future Self Profile, Day 27 mission, Day 29 blueprint, Day 30 reflection); some may be empty. Organise the evidence into: recurring themes; changes in how they describe themselves (compare early and late wording, quoting both); changes in priorities; strengths they repeatedly mention; challenges that keep appearing; actions they have taken; questions to explore next. Quote their words as evidence and keep inferences tentative. Do not diagnose, label their identity, name their life purpose or predict the future. Acknowledge the effort of completing the programme warmly but without flattery. End with 3 questions for their first weekly review.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the central idea of Become Extra Ordinary?",
        ["Become perfect", "Become famous", "Become increasingly intentional about how you live, learn, create and contribute", "Avoid failure"],
        2, "Extra Ordinary is about intentionality, not perfection or fame."),
      q("What should happen after the 30-day programme?",
        ["Personal development stops", "The learner continues using reflection, action, learning and review", "The learner follows the course forever", "All goals remain unchanged"],
        1, "The course builds a continuing practice, not dependence on the course."),
      q("What does failure represent in the programme?",
        ["Personal worth", "Permanent defeat", "Potential information for learning and adjustment", "Something that must always be avoided"],
        2, "Module 6: failure is an event, not an identity."),
      q("What does \"Extra Ordinary\" mean in this programme?",
        ["Being better than everyone else", "Being perfect", "Intentionally developing, creating, learning and contributing", "Becoming famous"],
        2, "Learn. Create. Act. Contribute. Become."),
      q("What is the final principle?", ["Stop questioning", "Keep becoming", "Avoid uncertainty", "Never change your plans"],
        1, "Principle 10 — Become: continue developing."),
    ],
  },

  // ---------------------------------------------------------------- module 10 assessment
  {
    lessonId: "m10-assessment",
    title: "Module 10 · Become Extra Ordinary Final Assessment",
    lessonOrder: 50,
    duration: "90 minutes",
    objective: "Your final 50-mark assessment: bring the whole journey together.",
    contentBody: `
<h2>Module 10 — Final 50-mark assessment: Become Extra Ordinary</h2>
<p>Much of this assessment draws on work you have already done on Days 28–30 — review and update it before you submit.</p>

<h2>Section A — 30-day transformation reflection (10 marks)</h2>
<p>Demonstrate meaningful reflection on what you have discovered and learned. <strong>Your Day 30 reflection is submitted for this section</strong> — review and update it on the Day 30 page.</p>

<h2>Section B — Extraordinary Operating System (10 marks)</h2>
<p>Create a practical system for continuing development. <strong>Your Day 28 operating system assignment is submitted for this section.</strong></p>

<h2>Section C — 12-month blueprint (10 marks)</h2>
<p>Create clear priorities, objectives and evidence measures. <strong>Your Day 29 blueprint is submitted for this section.</strong></p>

<h2>Section D — Personal mission &amp; contribution (10 marks)</h2>
<p>Connect your strengths, values, contribution and future direction.</p>
${block("exercise", "m10-part-d")}

<h2>Section E — From This Day Forward commitment (10 marks)</h2>
<p>Identify concrete actions and commitments that can continue beyond the programme.</p>
${block("exercise", "m10-part-e")}

<h2>Final assessment performance</h2>
${table(["Score", "Performance"], [["40–50", "Strong Application"], ["30–39", "Developing Application"], ["20–29", "Foundation Level"], ["Below 20", "Review Days 28–30"]])}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Sections A–E, including your Day 28, 29 and 30 work. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m10-assessment-review")}

<h2>Your Module 10 submission</h2>
${block("portfolio")}

<h2>What's next</h2>
<p>When you've submitted, open the final lesson — <strong>Keep Going</strong> — for your 30-day Extra Ordinary Log, the complete framework and your whole-course Transformation Portfolio.</p>
`,
    exercises: [
      {
        exerciseId: "m10-part-d",
        title: "Section D — Personal mission & contribution",
        fields: [
          field("strengths", "The strengths I will develop and use:"),
          field("values", "The values that guide my choices:"),
          field("mission", "My working mission:"),
          field("contribution", "The contribution I will explore, and who could benefit:"),
          field("direction", "How my strengths, values, mission and contribution connect to my future direction:"),
        ],
      },
      {
        exerciseId: "m10-part-e",
        title: "Section E — From This Day Forward commitment",
        table: {
          columns: ["Action / commitment", "Evidence it happened", "Review date"],
          rows: ["Next 24 hours", "This week", "This month", "Every week (ongoing)", "Every 90 days (ongoing)"],
        },
      },
    ],
    coaches: [
      {
        coachId: "m10-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Sections A–E, including your Day 28 system, Day 29 blueprint and Day 30 reflection. Its marks are indicative only.",
        usesExercises: ["d30-thirty", "d28-assignment", "d29-vision", "d29-objectives", "d29-next", "d29-assignment", "m10-part-d", "m10-part-e"],
        promptTemplate:
          "Please review my Module 10 final assessment, Become Extra Ordinary (Sections A–E, 10 marks each). Section A is my 30-day reflection, B my operating system, C my 12-month blueprint.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each section, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 10 final assessment review (formative). Sections, 10 marks each. Use these indicative criteria (2 marks each):\nA 30-day transformation reflection (Day 30 reflection) — covers the journey across modules; specific discoveries; honest comparison of before and after; evidence of changed thinking; depth of reflection.\nB Extraordinary Operating System (Day 28 assignment) — daily/weekly/monthly/quarterly elements; realistic and repeatable (not overloaded); setback and learning responses; wellbeing and contribution included; review built in.\nC 12-month blueprint (Day 29) — clear 12-month vision; manageable meaningful priorities; 90-day objectives with evidence; 30-day/7-day/24-hour links; evidence measures and review dates.\nD Personal mission & contribution — strengths identified; values articulated; clear working mission (value, not a job title); contribution and beneficiaries named; coherent connection to future direction.\nE From This Day Forward commitment — concrete next-24-hour action; short-term commitments; ongoing weekly and 90-day reviews; evidence for each; realistic and specific.\nFor each section give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty sections score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 28–30). State clearly that marks are indicative and the tutor gives the final mark. Assess application and reflection, never the learner's worth, values or chosen direction. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "d30-thirty", title: "Section A — 30-day transformation reflection (10 marks)", lessonId: "m10-day-30" },
      { exerciseId: "d28-assignment", title: "Section B — Extraordinary Operating System (10 marks)", lessonId: "m10-day-28" },
      { exerciseId: "d29-vision", title: "Section C — 12-month vision and priorities (10 marks)", lessonId: "m10-day-29" },
      { exerciseId: "d29-objectives", title: "Section C — 90-day objectives", lessonId: "m10-day-29" },
      { exerciseId: "d29-next", title: "Section C — 30-day, 7-day and 24-hour steps", lessonId: "m10-day-29" },
      { exerciseId: "d29-assignment", title: "Section C — evidence measures and review dates", lessonId: "m10-day-29" },
      { exerciseId: "m10-part-d", title: "Section D — Personal mission & contribution (10 marks)", lessonId: "m10-assessment" },
      { exerciseId: "m10-part-e", title: "Section E — From This Day Forward commitment (10 marks)", lessonId: "m10-assessment" },
      { exerciseId: "m10-diagnostic", title: "Module 10 Diagnostic", lessonId: "m10-intro" },
      { exerciseId: "d30-declaration", title: "My Extra Ordinary Declaration (Day 30)", lessonId: "m10-day-30" },
      { exerciseId: "d30-assignment", title: "From This Day Forward — final statement (Day 30)", lessonId: "m10-day-30" },
    ],
  },

  // ---------------------------------------------------------------- course complete
  {
    lessonId: "course-complete",
    title: "Keep Going · Your Transformation Portfolio",
    lessonOrder: 51,
    duration: "Ongoing",
    objective: "The 30 days end here. Your journey does not.",
    contentBody: `
<h2>The 30-day Extra Ordinary challenge: keep going</h2>
<p>The final challenge is not another complicated exercise. It is: <strong>keep going.</strong></p>
<p>For the next 30 days after completing the course, maintain an <strong>Extra Ordinary Log</strong>. Every day record one thing you noticed, one thing you learned, one action you took, one person you helped or value you created, and one thing you will do next.</p>
${block("exercise", "be-log")}
<p>At the end of 30 days, review the evidence.</p>
${block("exercise", "be-log-review")}

<h2>The complete Become Extra Ordinary framework</h2>
${table(["Module", "Theme", "Question"], [
  ["1 — Wake Up", "Question the ordinary", "What is happening in my life?"],
  ["2 — Understand", "Your inner operating system", "How do I process what happens?"],
  ["3 — Transform", "Your identity", "Who am I becoming?"],
  ["4 — Design", "Your extraordinary future", "What kind of life will support that person?"],
  ["5 — The Steady Mind", "Emotional resilience", "How do I remain intentional when circumstances challenge me?"],
  ["6 — Turn Failure Into Fuel", "Experiment &amp; learn", "How can setbacks become information?"],
  ["7 — Develop Intuition, Creativity &amp; Insight", "Notice &amp; create", "What possibilities am I currently overlooking?"],
  ["8 — Turn Vision Into Reality", "Act &amp; build", "What am I prepared to create, test or change?"],
  ["9 — Discover Your Calling &amp; Contribution", "Contribute", "What can I offer and what do I want my contribution to stand for?"],
  ["10 — Become Extra Ordinary", "Integrate &amp; continue", "How will I make this way of thinking and acting part of my life?"],
])}

<h2>The complete Extra Ordinary model</h2>
<p>The entire 30-day programme can ultimately be reduced to ten verbs:</p>
${flow(["QUESTION", "UNDERSTAND", "TRANSFORM", "DESIGN", "STRENGTHEN", "LEARN", "CREATE", "ACT", "CONTRIBUTE", "BECOME"])}
<p>And then: <strong>begin again.</strong></p>
<p>Because becoming Extra Ordinary is not a destination. It is a continuing practice of becoming more intentional about <strong>who you are, what you create, how you respond, what you learn and what you contribute.</strong></p>

<h2>Your Transformation Portfolio</h2>
<p>Everything you created across the 30 days, in one place:</p>
${block("portfolio")}

<h2>The final message</h2>
<p>You began this programme by questioning what an extraordinary life might mean. <strong>You have now created your own answer.</strong></p>
<p>It may not look like somebody else's. It does not need to. Your life does not need to become a copy of another person's definition of success.</p>
<p>You have explored your beliefs. You have examined your identity. You have imagined possibilities. You have faced obstacles. You have learned from setbacks. You have created ideas. You have taken action. You have explored contribution. You have created a blueprint.</p>
<p>Now the work becomes yours. Not because everything is figured out, but because you have developed a way to keep figuring things out.</p>
${table(["When…", "…"], [
  ["When you encounter uncertainty", "<strong>Question.</strong>"],
  ["When you encounter difficulty", "<strong>Learn.</strong>"],
  ["When you see a possibility", "<strong>Explore.</strong>"],
  ["When you find an opportunity", "<strong>Act.</strong>"],
  ["When something fails", "<strong>Adjust.</strong>"],
  ["When you develop a strength", "<strong>Use it.</strong>"],
  ["When someone needs help", "<strong>Contribute.</strong>"],
  ["When you discover something new about yourself", "<strong>Grow.</strong>"],
  ["And when the plan changes", "<strong>Begin again.</strong>"],
])}
<h2>Become Extra Ordinary</h2>
<blockquote><p>Learn. Create. Act. Contribute. Become.</p></blockquote>
`,
    exercises: [
      {
        exerciseId: "be-log",
        title: "My Extra Ordinary Log",
        table: {
          columns: ["One thing I noticed", "One thing I learned", "One action I took", "One person I helped or value I created", "One thing I will do next"],
          rows: numbered("Day", 30),
        },
      },
      {
        exerciseId: "be-log-review",
        title: "Reviewing the evidence",
        fields: [
          field("patterns", "What patterns do I see across my 30 days?"),
          field("evidence", "What evidence have I created?"),
          field("next", "What will I carry into the next 30 days?"),
        ],
      },
    ],
    coaches: [],
    portfolio: [
      { exerciseId: "d3-life-audit", title: "1. Life Audit (Module 1)", lessonId: "m1-day-3" },
      { exerciseId: "d2-rules-audit", title: "2. Invisible Rules Audit (Module 1)", lessonId: "m1-day-2" },
      { exerciseId: "d6-os-map", title: "3. Inner Operating System (Module 2)", lessonId: "m2-day-6" },
      { exerciseId: "d7-inventory", title: "4. Identity Inventory (Module 3)", lessonId: "m3-day-7" },
      { exerciseId: "d8-assignment", title: "5. Future Self Profile (Module 3)", lessonId: "m3-day-8" },
      { exerciseId: "d10-assignment", title: "6. Extraordinary Future Design — my Extraordinary Tuesday (Module 4)", lessonId: "m4-day-10" },
      { exerciseId: "m5-part-e", title: "7. Resilience Plan — Steady Mind Response Plan (Module 5)", lessonId: "m5-assessment" },
      { exerciseId: "d17-assignment", title: "8. Failure & Experiment Portfolio — Experiment Report (Module 6)", lessonId: "m6-day-17" },
      { exerciseId: "d21-assignment", title: "9. Pattern & Insight Portfolio (Module 7)", lessonId: "m7-day-21" },
      { exerciseId: "d24-canvas", title: "10. Extraordinary Project Canvas (Module 8)", lessonId: "m8-day-24" },
      { exerciseId: "d25-audit", title: "11. Strengths & Energy Audit (Module 9)", lessonId: "m9-day-25" },
      { exerciseId: "d26-map", title: "12. Contribution Map (Module 9)", lessonId: "m9-day-26" },
      { exerciseId: "d27-missions", title: "13. Personal Mission Statement (Module 9)", lessonId: "m9-day-27" },
      { exerciseId: "d28-assignment", title: "14. Extraordinary Operating System (Module 10)", lessonId: "m10-day-28" },
      { exerciseId: "d29-vision", title: "15. 12-Month Extraordinary Life Blueprint (Module 10)", lessonId: "m10-day-29" },
      { exerciseId: "d30-thirty", title: "16. 30-Day Final Reflection (Module 10)", lessonId: "m10-day-30" },
      { exerciseId: "d30-assignment", title: "17. From This Day Forward Commitment (Module 10)", lessonId: "m10-day-30" },
      { exerciseId: "m10-part-e", title: "18. Final 50-Mark Assessment — commitments (Module 10)", lessonId: "m10-assessment" },
    ],
  },
];
