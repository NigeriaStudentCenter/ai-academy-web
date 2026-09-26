// Become Extra Ordinary — Module 8: Turn Vision Into Reality (Days 22–24).
// Same lesson format as Modules 1–7.

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
const words = (id, label, minWords, maxWords) => ({ id, label, type: "textarea", minWords, maxWords });
const QUIZ_BANDS = [
  { min: 5, max: 5, title: "Excellent" },
  { min: 4, max: 4, title: "Strong understanding" },
  { min: 3, max: 3, title: "Developing" },
  { min: 0, max: 2, title: "Review today's lesson" },
];
const numbered = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);
const OBSTACLE_COLUMNS = ["Possible obstacle", "Type (internal / external / knowledge)", "How likely? (low / medium / high)", "IF this happens…", "…THEN I will"];
const CANVAS = [
  ["name", "Project name"],
  ["problem", "The problem / opportunity"],
  ["matters", "Why it matters"],
  ["benefits", "Who benefits?"],
  ["create", "What will I create, improve, test or complete?"],
  ["outcome", "My desired outcome"],
  ["evidence", "What will count as evidence?"],
  ["have", "Resources I already have"],
  ["need", "Resources I need"],
  ["skills", "Skills I need"],
  ["people", "People who could help"],
  ["obstacles", "Possible obstacles"],
  ["if-then", "My IF → THEN responses"],
  ["first", "First action"],
  ["deadline", "First deadline"],
  ["seven", "7-day experiment"],
  ["thirty", "30-day outcome"],
];

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m8-intro",
    title: "Module 8 · Turn Vision Into Reality",
    lessonOrder: 36,
    duration: "15 minutes",
    objective: "From possibility to progress.",
    contentBody: `
<h2>Module 8 — Turn Vision Into Reality</h2>
<p><strong>Days 22–24 · From possibility to progress</strong></p>
${flow(["VISION", "CLARITY", "PLAN", "ACTION", "PROJECT", "EVIDENCE"])}

<h2>Module overview</h2>
<p>The previous modules have helped you question the ordinary; understand your beliefs and thinking patterns; explore who you are becoming; design a more intentional future; develop resilience; turn failure into learning; recognise patterns; and generate ideas and possibilities. Now the question changes:</p>
<blockquote><p>What are you actually going to do with what you have discovered?</p></blockquote>
<p>Many people have ideas. Many people have goals. Many people have plans. But an extraordinary life is not created by ideas alone. It is created when <strong>an idea becomes a decision, a decision becomes a plan, and a plan becomes action</strong>.</p>
<p>Module 8 therefore moves you from <strong>thinking about change</strong> to <strong>creating evidence of change</strong>.</p>

<h2>Module 8 diagnostic — How ready are you to turn vision into action?</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>. The result helps you identify where to focus during the module.</p>
${block("exercise", "m8-diagnostic")}
<p><strong>Important:</strong> this is a learning and development tool, not a psychological assessment, diagnosis or prediction of future performance.</p>
`,
    exercises: [
      {
        exerciseId: "m8-diagnostic",
        title: "Vision-to-Action Readiness Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Clarity",
              statements: [
                "I can clearly describe what I am trying to achieve.",
                "I can explain why a particular goal matters to me.",
                "I can distinguish between a genuine goal and a vague wish.",
                "I know what success would look like in practical terms.",
                "I can identify the most important outcome I should focus on right now.",
              ],
            },
            {
              title: "Planning & problem solving",
              statements: [
                "I think about obstacles before beginning an important project.",
                "I create practical next steps rather than relying on motivation.",
                "I know how I will respond if something goes wrong.",
                "I can break a large objective into smaller actions.",
                "I regularly review and adjust my plans.",
              ],
            },
            {
              title: "Action & execution",
              statements: [
                "I take action even when the complete path is not yet clear.",
                "I regularly turn ideas into experiments or practical activities.",
                "I know what action I should take next when I have a goal.",
                "I create deadlines or milestones for important work.",
                "I can produce evidence that I am making progress.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "Beginning to develop clarity and action habits." },
            { min: 27, max: 38, title: "Developing", text: "Some direction, but planning and execution need strengthening." },
            { min: 39, max: 50, title: "Building", text: "Reasonable clarity with growing ability to act." },
            { min: 51, max: 62, title: "Intentional", text: "Strong ability to translate goals into deliberate action." },
            { min: 63, max: 75, title: "Designing", text: "Highly developed approach to clarity, planning and execution." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 22
  {
    lessonId: "m8-day-22",
    title: "Module 8 · Day 22 — Clarity",
    lessonOrder: 37,
    duration: "60–75 minutes",
    objective: "What exactly are you trying to create?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>If you cannot clearly describe what you are trying to create, how will you know what action to take?</p></blockquote>
${talk("Clarity: turn a vague dream into a clear goal", `
You have probably heard the advice: "Set goals." But there is a problem. Many goals are not actually goals. They are wishes.

"I want to be successful." "I want to make more money." "I want a better career." "I want to start a business." "I want to become healthier."

These statements may be meaningful, but they are difficult to act on because they do not tell you exactly what you are trying to create. Clarity changes that. A clear goal gives your attention somewhere to go.

Instead of saying "I want to start a business," you might say: "I want to test a service that helps small businesses automate one repetitive administrative process."

Now you can ask: Who needs it? What problem does it solve? What would I need to build? Who could test it? What could I do this week? That is the power of clarity.

Clarity does not mean knowing everything. It means knowing enough about your next destination to take the next useful step.

Today you are going to turn one of your ideas into a clear one-sentence goal. Don't try to design your entire future. Choose one meaningful outcome. Make it specific enough to act on. Then ask: <strong>What would evidence of progress look like?</strong>

Your extraordinary future becomes much more achievable when you can clearly describe the next thing you are trying to create.`)}

<h2>Reading — The difference between a dream, a wish and a goal</h2>
<p>A <strong>dream</strong> describes a possibility. A <strong>wish</strong> describes something you would like to happen. A <strong>goal</strong> describes something you are prepared to work towards.</p>
${table(["Wish", "Goal"], [["\"I want to earn more money.\"", "\"I will develop and test a freelance digital service with three potential clients within the next 30 days.\""]])}
<p>The second statement creates something that can be acted upon.</p>

<h2>The BSOE Clarity Framework</h2>
${flow(["WHAT — What exactly are you trying to create, improve, learn, test or complete?", "WHY — Why does it matter?", "WHO — Who benefits?", "EVIDENCE — What would demonstrate that progress has actually happened?", "NEXT STEP — What is the smallest meaningful action you can take?"])}
<p>Instead of <em>"I want to improve my career"</em>, try:</p>
${table(["", ""], [
  ["What", "Build a portfolio demonstrating my AI and digital skills."],
  ["Why", "I want evidence that I can apply my skills professionally."],
  ["Who", "Potential employers or clients."],
  ["Evidence", "Three completed practical projects."],
  ["Next step", "Choose the first project and define what it should demonstrate."],
])}

<h2>Interactive example — From vague to clear</h2>
<p>Starting statement: <em>"I want to become an entrepreneur."</em> The learner progressively answers:</p>
${table(["Question", "Answer"], [
  ["What type of entrepreneur?", "A digital service entrepreneur."],
  ["What problem?", "Helping small businesses reduce repetitive administrative work."],
  ["Who?", "Small service businesses."],
  ["What would I create?", "A simple AI-assisted document-processing workflow."],
  ["What evidence would matter?", "One working prototype and feedback from three businesses."],
])}
<p><strong>Final goal:</strong> "Within 30 days, I will build and test a simple AI-assisted document-processing workflow with three small businesses and use their feedback to improve the service." The learner now has something they can work on.</p>

<h2>Case study — David's career change</h2>
<p>David had been saying: <em>"I need a better career."</em> For months he researched courses, watched videos and spoke to friends. But nothing changed.</p>
<p>He then changed the question. Instead of <em>"What career should I have?"</em> he asked: <em>"What evidence could I create that would help me move towards a new career?"</em></p>
<p>He chose digital project management. His new objective became: <strong>build three practical project examples and use them to apply for entry-level digital project roles within three months.</strong> His first action was not to apply for 100 jobs. It was to design his first project.</p>
<p>The important change was not that David suddenly knew his entire future. It was that he became clear about his <strong>next meaningful outcome</strong>.</p>

<h2>Learner activity — The one-sentence goal</h2>
<p>Choose one possibility from your previous modules.</p>
${block("exercise", "d22-goal")}
<h3>Goal quality check</h3>
<p>Is it clear? Is it meaningful? Can I explain why it matters? Can I identify evidence? Can I take a first step? Can another person understand what I mean?</p>

<h2>AI practical exercise — AI Clarity Partner</h2>
<p>Write your own goal first. <strong>AI can improve clarity. It should not choose your life direction</strong> — you remain responsible for the final goal.</p>
${block("coach", "d22-clarity")}

<h2>Scenario activity</h2>
<p>James says: <em>"My goal is to become successful."</em></p>
${block("scenario", "d22-james")}

<h2>Real-world challenge — The clarity conversation</h2>
<p>Explain your goal to another person in <strong>60 seconds</strong>. Ask them: <em>"What do you think I am actually trying to achieve?"</em> Do not explain immediately. Listen to their interpretation. If they misunderstand you, improve your goal statement.</p>
${block("exercise", "d22-conversation")}

<h2>Day 22 reflection</h2>
<p>Write for five minutes.</p>
${block("exercise", "d22-reflection")}

<h2>Day 22 quiz</h2>
${block("quiz")}

<h2>Day 22 assignment — My One-Sentence Goal</h2>
${block("exercise", "d22-assignment")}
`,
    exercises: [
      {
        exerciseId: "d22-goal",
        title: "The one-sentence goal",
        fields: [
          field("want", "I want to…"),
          field("because", "because…"),
          field("for", "I am doing this for / because of…"),
          field("evidence", "Evidence of progress would be…"),
          field("first", "My first meaningful action is…"),
          field("combined", "My goal is to [WHAT], because [WHY]. I will know I am making progress when [EVIDENCE]. My first action is [ACTION]."),
        ],
      },
      {
        exerciseId: "d22-conversation",
        title: "The clarity conversation",
        fields: [
          field("heard", "What they thought I was trying to achieve:"),
          field("changed", "What I changed:"),
          field("final", "My final one-sentence goal:"),
        ],
      },
      {
        exerciseId: "d22-reflection",
        title: "Day 22 reflection",
        fields: [
          field("clearer", "What became clearer when I forced myself to describe my goal in one sentence?"),
          field("vague", "What am I no longer willing to leave vague?"),
        ],
      },
      {
        exerciseId: "d22-assignment",
        title: "My One-Sentence Goal",
        intro: "Recommended length: 400–600 words in total.",
        fields: [
          field("original", "1. My original goal:"),
          field("matters", "2. Why it matters:"),
          field("benefits", "3. Who benefits:"),
          field("evidence", "4. What evidence would demonstrate progress:"),
          field("final", "5. My final one-sentence goal:"),
          field("first", "6. My first action:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d22-james",
        title: "James wants to be successful",
        question: "What is the most useful next step?",
        options: [
          "Tell James that success means the same thing to everyone.",
          "Ask James to work harder immediately.",
          "Ask James to define what success would mean in practical terms and what evidence would demonstrate progress.",
          "Use AI to choose a definition of success for him.",
        ],
        answer: 2,
        explanation:
          "The purpose of clarity is not to impose someone else's definition of success. It is to make the learner's intended outcome understandable and actionable.",
      },
    ],
    coaches: [
      {
        coachId: "d22-clarity",
        title: "AI Clarity Partner",
        intro: "Spots vague language, assumptions and missing information in your goal, and offers several refinements — you choose the final version.",
        usesExercises: ["d22-goal"],
        promptTemplate:
          "I am working on this goal:\n\n[PASTE YOUR ANSWERS]\n\nAct as a clarity partner.\n\nDo not decide my goal for me.\n\nHelp me identify:\n\n1. vague language;\n2. assumptions;\n3. missing information;\n4. who may benefit;\n5. what evidence would demonstrate progress;\n6. possible ways to make the goal more specific;\n7. questions I should answer before beginning.\n\nGive me several possible refinements, but allow me to choose the final version.",
        systemPrompt:
          "Exercise: Day 22 — clarity partner. Review the learner's goal using the Clarity Framework (What, Why, Who, Evidence, Next step). Point out vague words (quote them), assumptions, missing information, likely beneficiaries, observable evidence of progress, and questions to answer before beginning. Offer 2–3 alternative refinements that keep their intent and direction — never substitute a different goal or impose a definition of success — and ask which they prefer or how they'd combine them. If they haven't written a goal yet, ask them to draft one first.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the main purpose of clarity?",
        ["To predict the future", "To eliminate uncertainty", "To make an intended outcome clear enough to act upon", "To guarantee success"],
        2, "Clarity means knowing enough about your next destination to take the next useful step."),
      q("Which is the clearest goal?",
        ["I want to be successful.", "I want a better life.", "I want to become rich.", "I will test a digital service with three potential clients within 30 days."],
        3, "It says what, with whom, how many and by when."),
      q("What does \"evidence\" mean in goal setting?", ["A positive thought", "Something observable that demonstrates progress", "A prediction", "Motivation"],
        1, "Evidence is something you or others can see."),
      q("What should AI do in the clarity exercise?",
        ["Choose the learner's goal", "Predict the learner's future", "Help identify ambiguity and useful questions", "Decide whether the goal is worthwhile"],
        2, "AI can improve clarity; it should not choose your direction."),
      q("What is a useful first step when a goal is vague?",
        ["Make it more complicated", "Define what you are actually trying to create or achieve", "Abandon it", "Wait until you feel motivated"],
        1, "Start with WHAT."),
    ],
  },

  // ---------------------------------------------------------------- day 23
  {
    lessonId: "m8-day-23",
    title: "Module 8 · Day 23 — Vision + Planning",
    lessonOrder: 38,
    duration: "60–75 minutes",
    objective: "What could stop you — and what will you do about it?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What if the thing that stops you is not lack of ambition, but lack of preparation for predictable obstacles?</p></blockquote>
${talk("Plan for reality, not just possibility", `
You now have a clearer goal. But every meaningful goal eventually meets reality.

You may become busy. You may lose confidence. Someone may say no. You may not have enough money. You may discover that your first idea does not work. You may underestimate how long something takes.

This does not mean the goal was wrong. It means the plan needs to account for reality.

Extraordinary people do not necessarily experience fewer obstacles. They develop better ways of responding to them.

One simple method is <strong>IF → THEN</strong>. If this happens, then I will do this.

For example: If I do not get a response from my first three potential clients, then I will review my offer, ask for feedback and contact three different prospects. If I miss a planned study session, then I will reschedule it within the next 24 hours. If my first prototype does not work, then I will identify the smallest part I can test again.

Planning this way turns obstacles from surprises into scenarios.

You don't need to predict everything. You simply need to think ahead about the obstacles that are reasonably foreseeable.

Today you will create your own obstacle-response plan.`)}

<h2>Reading — Planning is not predicting</h2>
<p>A plan is not a promise that everything will happen exactly as expected. <strong>A plan is a working hypothesis.</strong> You act. You observe. You learn. You adjust. This connects directly with Module 6: <strong>Action → Result → Learning → Adjustment.</strong></p>

<h2>The IF → THEN method</h2>
<p><strong>IF</strong> — identify a realistic obstacle. <strong>THEN</strong> — decide beforehand how you will respond.</p>
<p><em>Example:</em> <strong>IF</strong> I struggle to find customers, <strong>THEN</strong> I will ask five potential customers what problem they currently experience before changing my offer.</p>
<p>This prevents an immediate emotional reaction from determining your next move.</p>

<h2>Three types of obstacles</h2>
${table(["Type", "Examples"], [
  ["1. Internal", "Procrastination; uncertainty; fear of judgement; lack of confidence; distraction."],
  ["2. External", "Lack of resources; rejection; competing priorities; technology problems; limited access to people."],
  ["3. Knowledge gaps", "Not knowing how to market; not knowing how to build something; not understanding the customer; not knowing which tool to use."],
])}
<p>A knowledge gap is not necessarily a permanent barrier. It may simply identify something you need to learn.</p>

<h2>Interactive example — The student project</h2>
<p>A student wants to create an AI-powered study resource. <strong>Goal:</strong> create and test a study resource with 10 students.</p>
${table(["Obstacle", "IF", "THEN"], [
  ["Students do not respond", "Fewer than three students respond.", "Ask students what format would be most useful and approach a different group."],
  ["The tool produces inaccurate information", "The output contains errors.", "Introduce a verification process and test the content against trusted sources."],
  ["The project takes too long", "The project exceeds the planned time.", "Reduce the scope rather than abandoning the entire project."],
])}
<p>The learner has transformed uncertainty into a response plan.</p>

<h2>Case study — Amaka's small business idea</h2>
<p>Amaka wanted to launch a digital service. Her original plan was: <em>create a website, develop a brand, create social media accounts and find customers.</em> The problem was that the plan contained many assumptions.</p>
<p>Her revised goal: <strong>test whether three local businesses would pay for the service.</strong> Possible obstacles: businesses may not understand the offer; they may not have the problem she assumes; the price may be wrong; she may struggle to explain the service; her first outreach messages may receive no response.</p>
<p>Instead of building everything first, she created an experiment:</p>
<ul>
<li><strong>IF</strong> businesses do not understand the offer, <strong>THEN</strong> ask them what they thought the service meant.</li>
<li><strong>IF</strong> they do not have the problem, <strong>THEN</strong> investigate a different customer segment.</li>
<li><strong>IF</strong> nobody responds, <strong>THEN</strong> test a different message and contact another group.</li>
</ul>
<p>She reduced the risk by testing before building too much.</p>

<h2>Learner activity — My Obstacle Map</h2>
<p>Identify five obstacles that could affect your goal, then convert each into <strong>IF … happens, THEN I will …</strong></p>
${block("exercise", "d23-map")}

<h2>AI practical exercise — AI Pre-Mortem Partner</h2>
<p>Imagine that your project has failed. Your pre-mortem partner can bring in your goal and obstacle map. You then decide which risks are actually relevant.</p>
${block("coach", "d23-premortem")}

<h2>Scenario activity</h2>
<p>A learner plans to launch a service but receives no response from the first five people contacted.</p>
${block("scenario", "d23-no-response")}

<h2>Real-world challenge — The Obstacle Walk</h2>
<p>Take a 15-minute walk or quiet thinking period. Ask: <em>"If I seriously pursue this goal, what could realistically get in the way?"</em> Write down everything that comes to mind. Then select your <strong>three most important foreseeable obstacles</strong> and create an IF → THEN response for each.</p>
${block("exercise", "d23-walk")}

<h2>Day 23 reflection</h2>
${block("exercise", "d23-reflection")}

<h2>Day 23 quiz</h2>
${block("quiz")}

<h2>Day 23 assignment — My Obstacle &amp; Response Plan</h2>
${block("exercise", "d23-assignment")}
`,
    exercises: [
      {
        exerciseId: "d23-map",
        title: "My Obstacle Map",
        table: { columns: OBSTACLE_COLUMNS, rows: numbered("Obstacle", 5) },
      },
      {
        exerciseId: "d23-walk",
        title: "The Obstacle Walk",
        fields: [
          field("everything", "Everything that came to mind:"),
          field("top-three", "My three most important foreseeable obstacles, each with IF → THEN:"),
        ],
      },
      {
        exerciseId: "d23-reflection",
        title: "Day 23 reflection",
        fields: [
          field("used", "One obstacle I used to see as a reason to stop is…"),
          field("now", "I now see it as…"),
          field("if", "If this happens, I will…"),
        ],
      },
      {
        exerciseId: "d23-assignment",
        title: "My Obstacle & Response Plan",
        intro: "For each obstacle, include its type, the evidence or reason for identifying it, and your IF → THEN response. Recommended length: 500–700 words in total.",
        fields: [
          field("goal", "My goal:"),
          field("obstacles", "Five foreseeable obstacles — type, evidence/reason, IF → THEN:"),
          field("important", "The three obstacles I consider most important, and why:"),
          field("first", "What I will do first:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d23-no-response",
        title: "No response",
        question: "Which response demonstrates an experiment mindset?",
        options: [
          "\"The idea is a failure.\"",
          "\"Nobody wants this.\"",
          "\"I will investigate why there was no response and test a different message, audience or offer.\"",
          "\"I will keep sending exactly the same message indefinitely.\"",
        ],
        answer: 2,
        explanation: "The result is evidence. It is not automatically a final verdict.",
      },
    ],
    coaches: [
      {
        coachId: "d23-premortem",
        title: "AI Pre-Mortem Partner",
        intro: "Imagines your project didn't work and lists possible reasons — each with a question to investigate and a small action. It never predicts success or failure.",
        usesExercises: ["d22-goal", "d23-map"],
        promptTemplate:
          "My goal is:\n\n[PASTE YOUR ANSWERS]\n\nHelp me conduct a practical pre-mortem.\n\nImagine the project did not achieve its intended result.\n\nIdentify possible reasons involving:\n\n- unclear goals;\n- customers/users;\n- resources;\n- skills;\n- time;\n- communication;\n- technology;\n- assumptions;\n- execution.\n\nFor each possible issue, suggest a question I could investigate and a small action I could take.\n\nDo not predict whether I will succeed or fail.",
        systemPrompt:
          "Exercise: Day 23 — pre-mortem partner. Imagine the learner's project did not achieve its result and list plausible reasons across: unclear goals, customers/users, resources, skills, time, communication, technology, assumptions and execution. For each: classify it as internal, external or knowledge gap; give one question to investigate and one small action, phrased where useful as IF → THEN. Note which risks their obstacle map already covers and which are new. Never predict success or failure; keep a calm, practical tone (this is preparation, not discouragement). End by asking them which three risks they think are most relevant.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is an IF → THEN plan?", ["A prediction", "A response prepared for a possible situation", "A guarantee", "A motivational statement"],
        1, "You decide your response before the obstacle appears."),
      q("Why plan for obstacles?",
        ["To guarantee success", "To eliminate uncertainty", "To prepare useful responses to foreseeable problems", "To avoid taking action"],
        2, "Obstacles become scenarios rather than surprises."),
      q("Which is a knowledge gap?", ["A broken laptop", "Not knowing how to market a service", "A customer rejecting an offer", "Being tired"],
        1, "It's something you can learn — the others are external or internal obstacles."),
      q("What should happen when an experiment produces an unexpected result?",
        ["Automatically abandon the goal", "Ignore the result", "Learn from the evidence and consider an adjustment", "Blame yourself"],
        2, "A plan is a working hypothesis: act, observe, learn, adjust."),
      q("A pre-mortem asks:", ["What made me successful?", "What could realistically cause problems?", "Who is responsible for failure?", "What will definitely happen?"],
        1, "It imagines failure in advance so you can prepare."),
    ],
  },

  // ---------------------------------------------------------------- day 24
  {
    lessonId: "m8-day-24",
    title: "Module 8 · Day 24 — The Extraordinary Project",
    lessonOrder: 39,
    duration: "90 minutes",
    objective: "What meaningful thing will you actually build, improve, test or complete?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What can you create in the real world that provides evidence that you are becoming the person you described earlier in this course?</p></blockquote>
${talk("Stop planning forever — start building something", `
You have spent time questioning your assumptions. You have explored your identity. You have imagined your future. You have developed resilience. You have learned to recognise opportunities. You have generated ideas. You have created a clear goal.

Now it is time to build evidence.

Your extraordinary project does not need to be enormous. It does not need to become a million-pound company. It does not need to change the world immediately. It simply needs to be meaningful enough to matter and practical enough to begin.

You could build something. Improve something. Learn something. Test something. Organise something. Create something. Help someone. Solve a problem. Develop a portfolio. Launch a small service. Complete a project you have been postponing.

The key is that your project should move beyond thinking. It should create something observable.

Your project becomes an experiment in becoming. You will make decisions. You will encounter obstacles. You will learn. You will adapt. And you will create evidence.

That evidence is valuable because it tells you more about yourself than simply imagining who you might become.

Today you are going to create your <strong>Extraordinary Project Canvas</strong>. Choose something meaningful. Start smaller than your ego wants. But make it real enough to teach you something.`)}

<h2>Reading — What is an Extraordinary Project?</h2>
<p>An Extraordinary Project is a practical project that allows you to turn learning, intention and possibility into action. It should meet five conditions:</p>
<ol>
<li><strong>Meaningful</strong> — it matters to you or someone else.</li>
<li><strong>Practical</strong> — you can actually begin.</li>
<li><strong>Testable</strong> — you can determine whether something happened.</li>
<li><strong>Learning-rich</strong> — the project will teach you something.</li>
<li><strong>Evidence-based</strong> — you can demonstrate what you did.</li>
</ol>
${table(["Learner", "Example project"], [
  ["Student", "Create a portfolio containing three practical AI projects."],
  ["Job seeker", "Develop a professional portfolio and test it with five employers or recruiters."],
  ["Professional", "Automate one repetitive workplace process and measure the time saved."],
  ["Entrepreneur", "Create and test a minimum viable service with five potential customers."],
  ["Community member", "Design and run a small community learning event."],
  ["Creator", "Produce and publish ten pieces of useful educational content around one topic."],
  ["Learner", "Complete a practical project demonstrating a newly acquired skill."],
])}
<p>The project is not about impressing people. It is about <strong>creating evidence of action, learning and growth</strong>.</p>

<h2>Interactive example — Turning an idea into a project</h2>
${flow([
  "Idea: \"I want to help students use AI.\" — too broad",
  "Clarification: \"I want to create a practical AI study resource.\" — better",
  "Project: \"Create a five-part AI study toolkit and test it with ten students over seven days.\"",
])}
<p>Now the learner has a defined output, a target group, a test group, a timeframe, evidence, and an opportunity to learn.</p>

<h2>Case study — Daniel's Extraordinary Project</h2>
<p>Daniel wanted to become more employable. He had completed several online courses but struggled to demonstrate what he could actually do. Instead of taking another course immediately, he created an Extraordinary Project: <strong>build a small AI-assisted business workflow demonstrating document processing, data extraction and automated reporting.</strong></p>
<p><strong>Evidence he planned to produce:</strong> a workflow diagram; a working prototype; a demonstration video; an explanation of the business problem; results from testing.</p>
${table(["Day", "Seven-day experiment"], [
  ["1", "Choose problem."], ["2", "Design workflow."], ["3", "Build first version."], ["4", "Test."],
  ["5", "Identify problems."], ["6", "Improve."], ["7", "Demonstrate."],
])}
<p>The project gave Daniel something much more useful than another certificate alone: <strong>evidence of applied capability.</strong></p>

<h2>Learner activity — Choose your Extraordinary Project</h2>
<p>Review your previous work — your Pattern &amp; Opportunity Map, Creative Possibility Portfolio, One-Sentence Goal and Obstacle Map — and choose <strong>one possibility</strong>.</p>
${block("exercise", "d24-choose")}

<h2>The Extraordinary Project Canvas</h2>
${block("exercise", "d24-canvas")}

<h2>AI practical exercise — AI Project Planning Partner</h2>
<p>After completing your own canvas, use your planning partner to challenge and strengthen it. It won't redesign the project for you.</p>
${block("coach", "d24-planning")}

<h2>Scenario activity</h2>
<p>A learner says: <em>"My Extraordinary Project is to change the world."</em></p>
${block("scenario", "d24-change-world")}

<h2>Real-world challenge — Launch your 7-day experiment</h2>
<p>Do not wait for the perfect plan. Take the first practical action on your project: speak to one potential user; create the first prototype; publish the first piece; build the first page; test the first workflow; make the first product; contact the first potential customer; complete the first portfolio piece; or organise the first activity.</p>
${block("exercise", "d24-launch")}

<h2>Day 24 reflection</h2>
${block("exercise", "d24-reflection")}

<h2>Day 24 quiz</h2>
${block("quiz")}

<h2>Day 24 assignment — My Extraordinary Project Canvas</h2>
<p>Submit your completed canvas above (all 17 parts) with a write-up explaining your project.</p>
${block("exercise", "d24-assignment")}
`,
    exercises: [
      {
        exerciseId: "d24-choose",
        title: "My Extraordinary Project",
        fields: [
          field("create", "I will create / improve / test / learn / complete…"),
          field("for", "for…"),
          field("because", "because…"),
          field("within", "within…"),
          field("progress", "I will know I have made progress when…"),
        ],
      },
      {
        exerciseId: "d24-canvas",
        title: "Extraordinary Project Canvas",
        fields: CANVAS.map(([id, label]) => field(id, label)),
      },
      {
        exerciseId: "d24-launch",
        title: "My first action",
        fields: [
          field("did", "What I did:"),
          field("happened", "What happened:"),
          field("learned", "What I learned:"),
          field("change", "What I will change:"),
        ],
      },
      {
        exerciseId: "d24-reflection",
        title: "Day 24 reflection",
        fields: [
          field("before", "Before this module, I thought turning a vision into reality required…"),
          field("now", "I now understand that…"),
          field("next", "My smallest meaningful next step is…"),
          field("evidence", "Evidence that I have started will be…"),
        ],
      },
      {
        exerciseId: "d24-assignment",
        title: "My Extraordinary Project write-up",
        fields: [words("write-up", "My project write-up (700–1,000 words)", 700, 1000)],
      },
    ],
    scenarios: [
      {
        scenarioId: "d24-change-world",
        title: "\"Change the world\"",
        question: "What is the most useful next step?",
        options: [
          "Tell them their ambition is unrealistic.",
          "Ask them to identify one meaningful problem they could practically address.",
          "Tell them to create a 100-page business plan.",
          "Use AI to create the entire project.",
        ],
        answer: 1,
        explanation: "Extraordinary does not mean enormous. A meaningful project can begin with a specific problem and a practical action.",
      },
    ],
    coaches: [
      {
        coachId: "d24-planning",
        title: "AI Project Planning Partner",
        intro: "Reviews your canvas for clarity, scope, assumptions, resources, obstacles and evidence — and checks your 7-day experiment is small enough to finish.",
        usesExercises: ["d24-choose", "d24-canvas"],
        promptTemplate:
          "Here is my Extraordinary Project:\n\n[PASTE YOUR ANSWERS]\n\nAct as a practical project-planning partner.\n\nDo not redesign the project for me.\n\nReview it for:\n\n1. clarity;\n2. scope;\n3. assumptions;\n4. missing resources;\n5. foreseeable obstacles;\n6. evidence of progress;\n7. whether the first action is practical;\n8. whether the seven-day experiment is small enough to complete.\n\nAsk me useful questions and suggest alternatives where appropriate.\n\nClearly distinguish between my original ideas and AI-generated suggestions.",
        systemPrompt:
          "Exercise: Day 24 — project planning partner. Review the learner's Extraordinary Project Canvas against the five conditions (meaningful, practical, testable, learning-rich, evidence-based) and for: clarity, scope, assumptions, missing resources, foreseeable obstacles, evidence of progress, whether the first action is doable now, and whether the 7-day experiment is small enough to complete. Point out empty canvas sections. If the scope is too big, suggest how to shrink the first version. Label any alternatives clearly as 'AI suggestion' and keep their project theirs — don't redesign it. Flag anything unsafe, unlawful, or that involves spending significant money or handling other people's personal data, and suggest checking with a trusted adult or adviser. Ask 2–3 useful questions.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the purpose of an Extraordinary Project?",
        ["To create the biggest possible project", "To turn intention and learning into observable action", "To impress other people", "To guarantee a career outcome"],
        1, "It's about creating evidence of action, learning and growth."),
      q("Which project is most practical?", ["Become successful", "Change the world", "Build and test a portfolio project with three users", "Become famous"],
        2, "It has an output, a test group and a way to see what happened."),
      q("What should a seven-day experiment do?",
        ["Solve every problem permanently", "Produce useful action and learning", "Guarantee success", "Replace planning completely"],
        1, "Like Daniel's week: choose, design, build, test, fix, improve, demonstrate."),
      q("Why is evidence important?",
        ["It proves the learner will succeed", "It provides something observable about what happened", "It eliminates uncertainty", "It guarantees employment"],
        1, "Evidence tells you more than imagining."),
      q("What should happen after an experiment?",
        ["Ignore the results", "Learn from the evidence and adjust where necessary", "Automatically abandon the project", "Assume the original plan was perfect"],
        1, "Test, learn, adjust."),
    ],
  },

  // ---------------------------------------------------------------- module 8 assessment
  {
    lessonId: "m8-assessment",
    title: "Module 8 · Turn Vision Into Reality Assessment",
    lessonOrder: 40,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 22–24 together in your 50-mark assessment and 7-day action challenge.",
    contentBody: `
<h2>Module 8 — 50-mark assessment: Turn Vision Into Reality</h2>
<p>The assessment measures <strong>application of the module's learning</strong>, not intelligence, personality or future success. Your daily work from Days 22–24 is a good starting point.</p>

<h2>Section A — Clarity &amp; goal (10 marks)</h2>
<p>Demonstrate your ability to convert a vague aspiration into a clear, meaningful and actionable goal.</p>
${block("exercise", "m8-part-a")}

<h2>Section B — Obstacle planning (10 marks)</h2>
<p>Identify realistic obstacles and create appropriate IF → THEN responses.</p>
${block("exercise", "m8-part-b")}

<h2>Section C — Action plan (10 marks)</h2>
<p>Break the goal into practical actions, milestones and immediate next steps.</p>
${block("exercise", "m8-part-c")}

<h2>Section D — Extraordinary Project Canvas (10 marks)</h2>
<p>Develop a meaningful, practical and testable project. <strong>Your Day 24 canvas is submitted for this section</strong> — review and update it on the Day 24 page.</p>

<h2>Section E — Project launch / experiment (10 marks)</h2>
<p>Demonstrate evidence of beginning the project and reflect on what happened. <strong>Your 7-day action challenge below is submitted for this section.</strong></p>

<h2>The 7-day action challenge — from plan to evidence</h2>
<p>For the next seven days, record:</p>
${block("exercise", "m8-log")}
<p>At the end of seven days, answer:</p>
${block("exercise", "m8-log-reflection")}

<h2>Assessment performance</h2>
${table(["Score", "Performance"], [["40–50", "Strong Application"], ["30–39", "Developing Application"], ["20–29", "Foundation Level"], ["Below 20", "Review Days 22–24"]])}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Sections A–E, including your Day 24 canvas and your 7-day log. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m8-assessment-review")}

<h2>Your Module 8 submission</h2>
${block("portfolio")}

<h2>Module 8 integration</h2>
<p>Module 7 produced possibilities. Module 8 turns one of those possibilities into action.</p>
${table(["Module", "Flow"], [
  ["Module 7", "Observation → Question → Possibility → Creation → Test"],
  ["Module 8", "Vision → Clarity → Plan → Action → Project → Evidence"],
])}
<p>Together:</p>
${flow(["NOTICE", "QUESTION", "IMAGINE", "CREATE", "CLARIFY", "PLAN", "ACT", "TEST", "LEARN", "ADJUST"])}
<p>This is an important transition in the Become Extra Ordinary journey. You are no longer simply asking <em>"What could I do?"</em> You are beginning to ask:</p>
<blockquote><p>What am I prepared to actually do?</p></blockquote>

<h2>Module 8 outputs</h2>
<ol>
<li>Module 8 Diagnostic</li>
<li>One-Sentence Goal</li>
<li>Goal Clarity Analysis</li>
<li>Obstacle &amp; Response Map</li>
<li>IF → THEN Plan</li>
<li>Action Plan</li>
<li>Extraordinary Project Canvas</li>
<li>Seven-Day Project Experiment</li>
<li>Project Evidence</li>
<li>Project Reflection</li>
<li>50-Mark Turn Vision Into Reality Assessment</li>
</ol>

<h2>The Become Extra Ordinary journey so far</h2>
${flow([
  "Module 1 — Wake Up: What is happening in my life?",
  "Module 2 — Understand: How do I process what happens?",
  "Module 3 — Transform: Who am I becoming?",
  "Module 4 — Design: What kind of life will support that person?",
  "Module 5 — The Steady Mind: How do I remain intentional when circumstances challenge me?",
  "Module 6 — Turn Failure Into Fuel: How do I use setbacks as information?",
  "Module 7 — Develop Intuition, Creativity & Insight: What possibilities am I currently overlooking?",
  "Module 8 — Turn Vision Into Reality: What am I going to create, test or change?",
])}

<h2>Next: Module 9 — Discover Your Calling &amp; Contribution</h2>
<p>The next stage moves beyond personal achievement and asks:</p>
<blockquote><p>What strengths, experiences, interests and problems are calling for your attention — and how could you use them to contribute something meaningful?</p></blockquote>
`,
    exercises: [
      {
        exerciseId: "m8-part-a",
        title: "Section A — Clarity & goal",
        fields: [
          field("vague", "My original, vague aspiration:"),
          field("what", "WHAT — what exactly I am trying to create, improve, learn, test or complete:"),
          field("why", "WHY — why it matters:"),
          field("who", "WHO — who benefits:"),
          field("evidence", "EVIDENCE — what would demonstrate progress:"),
          field("goal", "My final one-sentence goal:"),
          field("first", "NEXT STEP — my first meaningful action:"),
        ],
      },
      {
        exerciseId: "m8-part-b",
        title: "Section B — Obstacle planning",
        table: { columns: OBSTACLE_COLUMNS, rows: numbered("Obstacle", 5) },
      },
      {
        exerciseId: "m8-part-c",
        title: "Section C — Action plan",
        table: {
          columns: ["Action / milestone", "Deadline", "Evidence it's done"],
          rows: ["Today", "This week", "Milestone 1", "Milestone 2", "Milestone 3", "30-day outcome"],
        },
      },
      {
        exerciseId: "m8-log",
        title: "My 7-day action log",
        table: {
          columns: ["Action", "What happened?", "What did I learn?", "Next step"],
          rows: numbered("Day", 7),
        },
      },
      {
        exerciseId: "m8-log-reflection",
        title: "End-of-week review",
        fields: [
          field("did", "1. What did I actually do?"),
          field("surprised", "2. What surprised me?"),
          field("worked", "3. What worked?"),
          field("not", "4. What did not work?"),
          field("evidence", "5. What evidence did I create?"),
          field("change", "6. What should I change?"),
          field("next", "7. What is my next step?"),
        ],
      },
    ],
    coaches: [
      {
        coachId: "m8-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Sections A–E, including your Day 24 canvas and 7-day log. Its marks are indicative only.",
        usesExercises: ["m8-part-a", "m8-part-b", "m8-part-c", "d24-canvas", "m8-log", "m8-log-reflection"],
        promptTemplate:
          "Please review my Module 8 assessment, Turn Vision Into Reality (Sections A–E, 10 marks each). Section D is my Extraordinary Project Canvas and Section E is my 7-day action log and review.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each section, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 8 assessment review (formative). Sections, 10 marks each. Use these indicative criteria (2 marks each):\nA Clarity & goal — vague aspiration converted; clear WHAT; meaningful WHY/WHO; observable evidence; practical first action.\nB Obstacle planning — realistic obstacles; types identified (internal/external/knowledge); likelihood considered; specific IF → THEN responses; responses are practical and proportionate.\nC Action plan — immediate next step (today); this week's action; milestones; deadlines; evidence for each.\nD Extraordinary Project Canvas (the Day 24 canvas) — meaningful; practical; testable with defined evidence; resources/skills/people considered; obstacles and 7-day experiment realistic.\nE Project launch (the 7-day log and end-of-week review) — evidence the project actually started; actions recorded; results observed; learning identified; next step/adjustment defined.\nFor each section give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty sections score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 22–24). State clearly that marks are indicative, that they measure application of the module's learning (not intelligence, personality or future success), and that the tutor gives the final mark. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "m8-part-a", title: "Section A — Clarity & goal (10 marks)", lessonId: "m8-assessment" },
      { exerciseId: "m8-part-b", title: "Section B — Obstacle planning (10 marks)", lessonId: "m8-assessment" },
      { exerciseId: "m8-part-c", title: "Section C — Action plan (10 marks)", lessonId: "m8-assessment" },
      { exerciseId: "d24-canvas", title: "Section D — Extraordinary Project Canvas (10 marks)", lessonId: "m8-day-24" },
      { exerciseId: "m8-log", title: "Section E — 7-day action log (10 marks)", lessonId: "m8-assessment" },
      { exerciseId: "m8-log-reflection", title: "Section E — end-of-week review", lessonId: "m8-assessment" },
      { exerciseId: "m8-diagnostic", title: "Module 8 Diagnostic", lessonId: "m8-intro" },
      { exerciseId: "d22-assignment", title: "My One-Sentence Goal (Day 22)", lessonId: "m8-day-22" },
      { exerciseId: "d23-assignment", title: "My Obstacle & Response Plan (Day 23)", lessonId: "m8-day-23" },
      { exerciseId: "d24-launch", title: "Project launch — first action (Day 24)", lessonId: "m8-day-24" },
      { exerciseId: "d24-assignment", title: "My Extraordinary Project write-up (Day 24)", lessonId: "m8-day-24" },
    ],
  },
];
