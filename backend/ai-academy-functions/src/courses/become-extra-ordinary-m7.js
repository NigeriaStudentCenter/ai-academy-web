// Become Extra Ordinary — Module 7: Develop Intuition, Creativity & Insight
// (Days 19–21). Same lesson format as Modules 1–6.

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
const marking = (rows) =>
  table(["Criterion", "Marks"], [...rows, ["<strong>Total</strong>", "<strong>10</strong>"]]);
const numbered = (prefix, n) => Array.from({ length: n }, (_, i) => `${prefix} ${i + 1}`);
const REFLECTION_COLUMNS = ["Question", "Observations", "New questions", "Connections", "Assumptions", "Insight", "Possible action"];

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m7-intro",
    title: "Module 7 · Develop Intuition, Creativity & Insight",
    lessonOrder: 31,
    duration: "15 minutes",
    objective: "Learn to notice more, think differently and create possibilities.",
    contentBody: `
<h2>Module 7 — Develop Intuition, Creativity &amp; Insight</h2>
<p><strong>Days 19–21 · Learn to notice more, think differently and create possibilities</strong></p>
<blockquote><p>What might you notice, understand or create if you became more deliberate about how you observe the world around you?</p></blockquote>

<h2>Module theme</h2>
<p><strong>Your next possibility may already be hidden inside something you have noticed, experienced or questioned.</strong></p>
<p>Modules 1–6 have taken you through <strong>awareness → self-understanding → identity → future design → resilience → experimentation</strong>. Module 7 introduces another capability: <strong>Notice → Reflect → Connect → Create.</strong></p>
<p>Creativity is not limited to artists, writers, musicians or designers. It can appear when a student finds a different way to learn; an employee improves a process; an entrepreneur sees an unmet customer need; a teacher develops a new learning activity; a manager finds a better way to communicate; a community identifies a new solution to an old problem; or a professional connects two existing ideas in a new way.</p>
<p>Insight often begins with paying attention. Creativity often begins with asking: <strong>"What else could be possible?"</strong></p>

<h2>The BSOE Insight Model</h2>
${flow(["NOTICE — What am I seeing?", "QUESTION — Why might this be happening?", "CONNECT — What does this remind me of?", "IMAGINE — What else could be possible?", "CREATE — What could I make, change or test?", "TEST — What evidence can I gather?"])}
<p>This connects Module 7 directly to Module 6. <strong>Creativity generates possibilities. Experimentation tests them.</strong></p>

<h2>Module learning outcomes</h2>
<p>By the end of this module, you will be able to:</p>
<ol>
<li>Identify patterns in your experiences and environment.</li>
<li>Distinguish observation from assumption.</li>
<li>Recognise recurring problems and opportunities.</li>
<li>Develop a practical reflection habit.</li>
<li>Create space for deeper thinking.</li>
<li>Generate multiple ideas without immediately judging them.</li>
<li>Combine existing ideas in new ways.</li>
<li>Use questions to stimulate creativity.</li>
<li>Use AI as an idea-generation and reflection partner.</li>
<li>Evaluate ideas using evidence and practical criteria.</li>
<li>Develop a personal source of creative inspiration.</li>
<li>Produce a portfolio of original ideas.</li>
<li>Identify one idea worth exploring further.</li>
</ol>

<h2>Module 7 diagnostic — My Creativity &amp; Insight</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m7-diagnostic")}
<p><strong>Important:</strong> this is a learning diagnostic. It is not a psychological assessment, intelligence test or prediction of creative ability.</p>
`,
    exercises: [
      {
        exerciseId: "m7-diagnostic",
        title: "My Creativity & Insight Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Observation & insight",
              statements: [
                "I notice patterns in situations that repeatedly occur around me.",
                "I pay attention to problems that people repeatedly experience.",
                "I distinguish what I observe from what I assume.",
                "I ask questions when something does not make sense.",
                "I reflect on experiences to identify what I can learn from them.",
              ],
            },
            {
              title: "Creativity & possibility",
              statements: [
                "I can generate several possible solutions to a problem.",
                "I am willing to consider unusual ideas before judging them.",
                "I can combine ideas from different areas.",
                "I deliberately look for alternative ways of doing things.",
                "I can continue generating ideas even when my first idea is not very good.",
              ],
            },
            {
              title: "Reflection & creative action",
              statements: [
                "I regularly create time to think without immediate distraction.",
                "I record useful ideas rather than relying on memory.",
                "I turn interesting observations into questions or possible projects.",
                "I test creative ideas rather than only thinking about them.",
                "I deliberately expose myself to new information, experiences or perspectives.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "You are beginning to develop deliberate habits of observation, reflection and creative thinking." },
            { min: 27, max: 38, title: "Developing", text: "You notice ideas and patterns, but may need more consistent opportunities to reflect and experiment." },
            { min: 39, max: 50, title: "Building", text: "You are developing the ability to connect observations, generate possibilities and turn ideas into action." },
            { min: 51, max: 62, title: "Intentional", text: "You demonstrate strong habits of observation, creative thinking and reflective action." },
            { min: 63, max: 75, title: "Designing", text: "You demonstrate a highly developed approach to noticing patterns, generating possibilities and converting insight into practical exploration." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 19
  {
    lessonId: "m7-day-19",
    title: "Module 7 · Day 19 — Pattern Recognition",
    lessonOrder: 32,
    duration: "60–75 minutes",
    objective: "What are you seeing that you have previously overlooked?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What keeps happening around you that might be telling you something?</p></blockquote>
${talk("The patterns hiding in plain sight", `
Every day, you encounter information. People complain about problems. Customers ask questions. Colleagues find workarounds. Students struggle with certain tasks. Businesses repeat inefficient processes. You experience frustrations. You notice things that could work better.

But most of these observations disappear from memory. That is why pattern recognition matters.

A single event may not mean very much. But when something happens repeatedly, it becomes worth investigating.

Imagine that five different people tell you: "I wish this process was easier." You could dismiss each comment. Or you could ask: "Why are several people experiencing the same problem?"

That question could lead to an insight. Perhaps there is a better process. Perhaps there is a service opportunity. Perhaps there is a learning need. Perhaps the problem is not what you originally thought.

Pattern recognition does not mean assuming you know the answer. It means noticing repetition and becoming curious.

There are four questions you can use: What keeps happening? Who experiences it? Why might it be happening? What could I investigate?

Today, you will start building a Pattern and Opportunity Map. Your job is not to solve everything. Your job is to notice.

Because many useful ideas begin with a simple observation: <strong>"Why does this keep happening?"</strong>`)}

<h2>Reading — Observation vs assumption</h2>
<p>Suppose you hear: <em>"People don't use the new system."</em> That is a broad statement. What have you actually observed? Perhaps fewer people attend training; some employees use the old process; several users ask the same question; some tasks take longer; people have developed workarounds. <strong>These are observations.</strong></p>
<p>Now consider: <em>"People don't use the system because they are resistant to change."</em> <strong>That is an interpretation.</strong> It might be true. It might not.</p>
<p>A useful thinker separates <strong>what I observe</strong> from <strong>what I think it means</strong>. That distinction creates better questions.</p>

<h2>The Pattern Detection Framework</h2>
<ol>
<li><strong>What?</strong> What keeps happening?</li>
<li><strong>Who?</strong> Who experiences it?</li>
<li><strong>When?</strong> When does it happen?</li>
<li><strong>Where?</strong> Where does it happen?</li>
<li><strong>Why?</strong> What possible explanations exist?</li>
<li><strong>What else?</strong> What alternative explanation could exist?</li>
<li><strong>Opportunity?</strong> Could this reveal a problem worth solving?</li>
</ol>

<h2>Interactive example — The coursework problem</h2>
<p>A university student notices that several classmates struggle to organise their coursework. Their first interpretation: <em>"Students are bad at time management."</em></p>
<p>But the student investigates. They discover that assignments are spread across several platforms; deadlines are sometimes communicated differently; students are unsure how to prioritise; and many do not know how to break large assignments into smaller tasks.</p>
<p>The problem may therefore be more complex than the original assumption. <strong>Possible opportunity:</strong> create a simple student planning system. The insight began with: <em>"Why do several people keep experiencing the same problem?"</em></p>

<h2>Case study — The repeated complaint</h2>
<p>Olu works in a small business. Every Monday, staff spend considerable time answering the same customer questions. Initially, Olu thinks: <em>"Customers don't read the website."</em></p>
<p>Instead of assuming this is the complete explanation, Olu records the questions for four weeks. A pattern appears. Most questions concern delivery times, returns, appointment availability, pricing and required documents. Olu suggests creating clearer information and an automated first-response system.</p>
<p>The original complaint became an opportunity to investigate:</p>
${flow(["REPEATED PROBLEM", "OBSERVATION", "PATTERN", "QUESTION", "POSSIBLE SOLUTION"])}

<h2>Learner activity — Your Pattern &amp; Opportunity Map</h2>
<p>Identify at least <strong>10 things you have noticed recently</strong> — from work, education, family life, business, technology, community, transport, customer service, social media or everyday frustrations.</p>
${block("exercise", "d19-map")}
<p>Then choose one:</p>
${block("exercise", "d19-choice")}

<h2>AI practical exercise — AI Pattern Discovery Partner</h2>
<p>Your pattern partner can bring in your map. It will help you investigate rather than jump to conclusions.</p>
${block("coach", "d19-pattern-partner")}

<h2>Scenario-based activity</h2>
<p>A student notices that several classmates repeatedly miss assignment deadlines.</p>
${block("scenario", "d19-deadlines")}

<h2>Real-world challenge — The Repetition Hunt</h2>
<p>For the next 24 hours, look for repeated complaints, questions, delays, mistakes, workarounds, requests and frustrations. Record at least <strong>three</strong>. For each, ask: <strong>"Why might this keep happening?"</strong></p>
${block("exercise", "d19-hunt")}

<h2>Day 19 reflection</h2>
${block("exercise", "d19-reflection")}

<h2>Day 19 quiz</h2>
${block("quiz")}

<h2>Day 19 assignment — Pattern Recognition Report</h2>
${block("exercise", "d19-assignment")}
`,
    exercises: [
      {
        exerciseId: "d19-map",
        title: "My Pattern & Opportunity Map",
        table: {
          columns: ["Observation", "Who experiences it?", "Does it repeat?", "Possible explanation", "Question"],
          rows: numbered("Observation", 10),
        },
      },
      {
        exerciseId: "d19-choice",
        title: "My most interesting pattern",
        fields: [
          field("pattern", "My most interesting pattern:"),
          field("why", "Why does it interest me?"),
          field("understand", "What do I still need to understand?"),
        ],
      },
      {
        exerciseId: "d19-hunt",
        title: "The Repetition Hunt",
        table: { columns: ["What I noticed repeating", "Why might this keep happening?"], rows: numbered("Repetition", 3) },
      },
      {
        exerciseId: "d19-reflection",
        title: "Day 19 reflection",
        fields: [
          field("noticed", "1. What pattern did I notice?"),
          field("overlooked", "2. Why had I previously overlooked it?"),
          field("assumptions", "3. What assumptions did I initially make?"),
          field("alternatives", "4. What alternative explanations exist?"),
          field("investigate", "5. What could I investigate next?"),
        ],
      },
      {
        exerciseId: "d19-assignment",
        title: "Pattern Recognition Report",
        intro: "Identify one recurring pattern. Include what you observed; who experiences it; where and when it occurs; evidence that it repeats; your initial interpretation; at least two alternative explanations; what information is missing; one question you would investigate; and one possible opportunity for improvement or innovation.",
        fields: [words("report", "My report (400–600 words)", 400, 600)],
      },
    ],
    scenarios: [
      {
        scenarioId: "d19-deadlines",
        title: "Missed deadlines",
        question: "Which approach demonstrates useful pattern recognition?",
        options: [
          "\"Students are lazy.\"",
          "\"The university should fix it.\"",
          "Record the situations, identify common factors and investigate why deadlines are being missed.",
          "Ignore it because it is not your problem.",
        ],
        answer: 2,
        explanation: "Pattern recognition begins with observation and investigation rather than immediate judgement.",
      },
    ],
    coaches: [
      {
        coachId: "d19-pattern-partner",
        title: "AI Pattern Discovery Partner",
        intro: "Organises your observations into possible patterns — showing the supporting evidence, what's missing and alternative explanations.",
        usesExercises: ["d19-map", "d19-choice"],
        promptTemplate:
          "I am going to give you a list of observations from my work, studies or everyday life.\n\n[PASTE YOUR ANSWERS]\n\nHelp me organise them into possible patterns.\n\nFor each possible pattern:\n\n1. Identify the observations supporting it.\n2. Identify what evidence is missing.\n3. Suggest alternative explanations.\n4. Identify questions I could investigate.\n5. Identify possible problems or opportunities worth exploring.\n\nDo not treat assumptions as facts.\n\nDo not tell me that a pattern definitely exists unless the evidence supports that conclusion.\n\nHelp me investigate rather than jump to conclusions.",
        systemPrompt:
          "Exercise: Day 19 — pattern discovery partner. Group the learner's observations into possible patterns. For each: list the specific observations supporting it (by their words), what evidence is missing, at least two alternative explanations, questions they could investigate, and possible problems or opportunities. Call patterns 'possible' unless the evidence clearly supports them; flag where an observation is really an interpretation (e.g. 'people are lazy'). Don't invent observations. Keep a curious, investigative tone and finish by asking which pattern they want to investigate first.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is pattern recognition?",
        ["Assuming the first explanation is correct.", "Identifying meaningful repetition and investigating it.", "Predicting the future.", "Ignoring individual events."],
        1, "Notice repetition, then become curious."),
      q("Which is an observation?",
        ["\"Employees are lazy.\"", "\"Employees use the old process for some tasks.\"", "\"Employees hate technology.\"", "\"Employees resist change.\""],
        1, "It describes something you can see; the others are interpretations."),
      q("Why distinguish observation from interpretation?",
        ["To prevent learning.", "To make assumptions harder to identify.", "To investigate situations more accurately.", "To avoid asking questions."],
        2, "The distinction creates better questions."),
      q("What can repeated problems reveal?",
        ["Only negative information.", "Possible opportunities for investigation or improvement.", "Guaranteed business opportunities.", "Nothing useful."],
        1, "Like Olu's Monday questions — possible, not guaranteed."),
      q("What should you do after noticing a pattern?",
        ["Immediately assume you know the cause.", "Investigate the pattern and consider alternative explanations.", "Ignore it.", "Tell everyone your conclusion."],
        1, "Investigate before concluding."),
    ],
  },

  // ---------------------------------------------------------------- day 20
  {
    lessonId: "m7-day-20",
    title: "Module 7 · Day 20 — The Quiet Mind",
    lessonOrder: 33,
    duration: "45–60 minutes + three 10-minute sessions",
    objective: "Create space to think.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What might you notice if you stopped filling every available moment with information?</p></blockquote>
${talk("The value of thinking space", `
Your attention is constantly being requested. Messages. Emails. Notifications. Videos. Meetings. News. Social media. Work. Study. Family responsibilities. Even when nothing requires your attention, something is often available to consume it.

But creativity requires more than information. It also requires space.

Think about a problem you have been trying to solve. Sometimes the answer does not appear while you are forcing yourself to solve it. You step away. You walk. You shower. You sit quietly. You sleep. Then suddenly you see the problem differently.

The purpose of reflection is not to stop thinking. It is to create enough space for deeper thinking.

Today you will practise a simple ten-minute reflection. For ten minutes: no scrolling. No multitasking. No trying to impress anyone. Choose one question. Write down what comes to mind. Do not immediately judge every thought. Look for connections. Look for questions. Look for contradictions. Look for possibilities. Then return to your normal day.

You may not experience a dramatic breakthrough. That is fine. The objective is to practise creating space for your own thinking.

In a world full of information, the ability to think deliberately becomes valuable.`)}

<h2>Reading — Reflection is not overthinking</h2>
<p>Reflection means deliberately examining an experience, question or possibility. Overthinking often involves repeatedly circling the same question without producing useful movement.</p>
<p>A productive reflection session should eventually lead to one of: clearer understanding; a better question; a new perspective; a decision point; a small experiment; or recognition that more information is needed.</p>
<p>The objective is not to think forever. <strong>It is to think better.</strong></p>

<h2>The BSOE 10-minute reflection</h2>
${table(["Minutes", "Question"], [
  ["1–2", "<strong>What am I noticing?</strong> Write without editing."],
  ["3–4", "<strong>What questions does this raise?</strong> List at least three."],
  ["5–6", "<strong>What connections can I see?</strong> Connect the issue to another experience, subject or problem."],
  ["7–8", "<strong>What might I be assuming?</strong> Identify possible assumptions."],
  ["9–10", "<strong>What is one useful next thought or action?</strong> Write one."],
])}

<h2>Interactive example — "I do not know what career direction to take"</h2>
<p>Instead of immediately searching <em>"What career should I choose?"</em>, the learner reflects:</p>
${table(["Question", "Reflection"], [
  ["What interests me?", "Helping people solve problems."],
  ["What do I enjoy?", "Technology and communication."],
  ["What problems do I notice?", "Small businesses struggle with digital processes."],
  ["What skills do I already have?", "Communication and organisation."],
  ["What might I investigate?", "Digital transformation roles."],
  ["Next experiment", "Speak to two people working in digital transformation."],
])}
<p>The reflection did not magically reveal a career. It generated better questions and a useful next step.</p>

<h2>Case study — Grace's constant information</h2>
<p>Grace wants to start a business. She spends hours watching entrepreneurship videos. She follows dozens of business creators. She saves hundreds of posts. She has lots of information. But she still has no business experiment.</p>
<p>She introduces a 20-minute daily information limit and a 10-minute reflection period. During reflection she notices a repeated problem in local businesses. Instead of consuming more content, she investigates the problem. Her shift is:</p>
${flow(["CONSUME", "REFLECT", "OBSERVE", "TEST"])}
<p>Information became useful when combined with thinking and action.</p>

<h2>Learner activity — Your first 10-minute quiet thinking session</h2>
<p>Choose one question, for example: What am I currently trying to understand? What problem keeps appearing in my life? What opportunity am I overlooking? What am I learning about myself? What could I do differently? What idea keeps returning? What am I curious about?</p>
<p>Set aside ten minutes, put your phone away, then complete:</p>
${block("exercise", "d20-session")}

<h2>AI practical exercise — AI Reflection Questioner</h2>
<p><strong>Do your ten-minute exercise before using AI.</strong> AI should expand your thinking rather than become the source of all your thinking. Your reflection questioner can bring in your session notes.</p>
${block("coach", "d20-questioner")}

<h2>Scenario-based activity</h2>
<p>A learner is trying to solve a difficult problem. They immediately ask AI for the answer without first considering the problem themselves.</p>
${block("scenario", "d20-ai-first")}

<h2>Real-world challenge — Protect ten minutes</h2>
<p>For the next three days, create one uninterrupted ten-minute reflection period. No social media, unnecessary notifications, multitasking or entertainment. Use one question. Record what emerges in your Reflection Journal below.</p>

<h2>Day 20 reflection</h2>
${block("exercise", "d20-reflection")}

<h2>Day 20 quiz</h2>
${block("quiz")}

<h2>Day 20 assignment — My Reflection Journal</h2>
<p>Complete <strong>three 10-minute reflection sessions</strong>, then write about what changed.</p>
${block("exercise", "d20-journal")}
${block("exercise", "d20-assignment")}
`,
    exercises: [
      {
        exerciseId: "d20-session",
        title: "My first quiet thinking session",
        fields: [
          field("question", "My question:"),
          field("noticed", "What I noticed:"),
          field("questions", "Questions that emerged (at least three):"),
          field("connections", "Connections I noticed:"),
          field("assumptions", "Assumptions I identified:"),
          field("next", "My useful next thought/action:"),
        ],
      },
      {
        exerciseId: "d20-reflection",
        title: "Day 20 reflection",
        fields: [
          field("comfortable", "1. How comfortable am I with silence or uninterrupted thinking?"),
          field("distracts", "2. What usually distracts me?"),
          field("noticed", "3. What did I notice when I created thinking space?"),
          field("connection", "4. Did any new connection emerge?"),
          field("continue", "5. What question do I want to continue exploring?"),
        ],
      },
      {
        exerciseId: "d20-journal",
        title: "My Reflection Journal",
        table: { columns: REFLECTION_COLUMNS, rows: numbered("Session", 3) },
      },
      {
        exerciseId: "d20-assignment",
        title: "What changed when I created space to think?",
        fields: [words("reflection", "What changed when I deliberately created space for my own thinking? (400–500 words)", 400, 500)],
      },
    ],
    scenarios: [
      {
        scenarioId: "d20-ai-first",
        title: "AI first?",
        question: "What approach better develops their thinking?",
        options: [
          "Always let AI solve the problem.",
          "Never use AI.",
          "First reflect independently, then use AI to challenge, organise and expand their thinking.",
          "Ask AI to make the final decision.",
        ],
        answer: 2,
        explanation: "The objective is augmented thinking, not replaced thinking.",
      },
    ],
    coaches: [
      {
        coachId: "d20-questioner",
        title: "AI Reflection Questioner",
        intro: "After your own ten minutes: finds themes, connections, assumptions and tensions in your notes — without replacing your thinking.",
        usesExercises: ["d20-session", "d20-journal"],
        promptTemplate:
          "I have completed a personal reflection.\n\nHere are my notes:\n\n[PASTE YOUR ANSWERS]\n\nAct as a neutral reflection partner.\n\nHelp me identify:\n\n1. Important themes\n2. Questions I may want to explore\n3. Connections between my observations\n4. Possible assumptions\n5. Contradictions or tensions\n6. Areas where more evidence would be useful\n7. Possible small experiments\n\nDo not tell me what I should do.\n\nDo not replace my own thinking.\n\nDo not turn speculation into fact.",
        systemPrompt:
          "Exercise: Day 20 — reflection questioner. The learner should have reflected on their own first; if they arrive with no notes, encourage them to do the 10-minute session first and offer to wait. From their notes identify: themes, questions to explore, connections, possible assumptions, contradictions or tensions, where more evidence would help, and possible small experiments. Quote or closely paraphrase their words; label your own ideas as speculation. Favour questions over answers so their thinking stays theirs. Don't tell them what to do.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the purpose of deliberate reflection?",
        ["To think endlessly.", "To create space for clearer understanding and new connections.", "To avoid action.", "To remove all uncertainty."],
        1, "Reflection creates space for deeper thinking."),
      q("What is one difference between reflection and overthinking?",
        ["Reflection aims to produce useful insight or movement.", "Reflection never involves questions.", "Overthinking always produces better decisions.", "They are exactly the same."],
        0, "Overthinking circles; reflection moves toward understanding, a better question or an action."),
      q("How long is the BSOE quiet-thinking exercise?", ["30 seconds.", "10 minutes.", "2 hours.", "One week."],
        1, "Five two-minute stages: notice, question, connect, assume, next action."),
      q("When should learners ideally use AI in this exercise?",
        ["Before thinking about the problem themselves.", "Instead of thinking.", "After their own initial reflection.", "Only when they cannot decide."],
        2, "AI should expand your thinking, not replace it."),
      q("What can reflection produce?", ["Better questions and connections.", "Guaranteed answers.", "Perfect certainty.", "Automatic success."],
        0, "Reflection rarely gives certainty, but it does give better questions."),
    ],
  },

  // ---------------------------------------------------------------- day 21
  {
    lessonId: "m7-day-21",
    title: "Module 7 · Day 21 — Inspiration on Demand",
    lessonOrder: 34,
    duration: "75–90 minutes",
    objective: "Train yourself to generate possibilities.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What could you create if you stopped waiting for the perfect idea?</p></blockquote>
${talk("Creativity is a practice", `
Many people say: "I am not creative." But creativity is not simply a personality trait. It is also a process. You can practise generating ideas.

The mistake many people make is judging an idea immediately. They think: "That will never work." "That sounds stupid." "Someone has already done it." "That is impossible."

Those thoughts may eventually be useful. But if they appear too early, they can stop idea generation before it has begun.

Separate two stages. <strong>Stage one: generate possibilities. Stage two: evaluate possibilities.</strong> During generation, quantity can be useful. During evaluation, judgement becomes important.

Today you will complete the BSOE 20 Ideas Challenge. Choose one problem. Generate 20 possible solutions.

The first five may be obvious. The next five may be difficult. The next five may become unusual. The final five may surprise you.

You do not need 20 brilliant ideas. You are training the ability to keep thinking after the obvious ideas have disappeared.

Then you will select one idea to investigate. This connects creativity with experimentation.

You do not have to believe every idea. You simply need to become better at creating possibilities.`)}

<h2>Reading — The creative process</h2>
${flow(["OBSERVE — notice a problem, question or possibility", "EXPAND — generate multiple possibilities", "CONNECT — combine ideas", "SELECT — evaluate the possibilities", "TEST — try something small", "LEARN — use evidence to improve the idea"])}
<p>Notice the connection to Module 6. Creative thinking generates options. Experimental thinking tests them.</p>

<h2>The 20 Ideas Challenge</h2>
<p>Choose one problem — for example, <em>"How could students make better use of one hour of free time?"</em> Now generate 20 ideas. Do not stop after three. Do not evaluate while generating. Aim for variety:</p>
<ul>
<li><strong>Ideas 1–5:</strong> obvious solutions.</li>
<li><strong>Ideas 6–10:</strong> different approaches.</li>
<li><strong>Ideas 11–15:</strong> unusual approaches.</li>
<li><strong>Ideas 16–20:</strong> wild possibilities.</li>
</ul>
<p>Then ask: which ideas could actually be tested?</p>

<h2>Creative connection exercise</h2>
<p>Choose two unrelated areas — for example AI + education, sport + leadership, music + productivity, retail + psychology, nature + technology. Ask: <strong>"What could these two areas teach each other?"</strong> Then generate five ideas.</p>
${block("exercise", "d21-connection")}

<h2>Interactive example — "People find it difficult to remember what they learn"</h2>
<ol>
<li>Daily five-minute revision.</li>
<li>Voice-note summaries.</li>
<li>AI-generated practice questions.</li>
<li>Peer teaching.</li>
<li>Learning through games.</li>
<li>Walking while explaining the subject aloud.</li>
<li>Turn each topic into a real-world problem.</li>
<li>Create a visual learning map.</li>
</ol>
<p>The point is not that every idea will work. The point is <strong>expanding the possibility space</strong>.</p>

<h2>Case study — Chinedu's student opportunity</h2>
<p>Chinedu notices that many students want practical work experience but struggle to find opportunities. His first idea is: <em>"Create a job board."</em></p>
<p>He then forces himself to generate 20 alternatives. Other ideas include short employer projects; student freelance challenges; university-business problem competitions; skills-based volunteering; AI-assisted portfolio building; employer-led micro-projects; student service marketplaces; peer consulting teams; practical digital apprenticeships; and project-based certificates.</p>
<p>One idea stands out: <strong>a platform connecting businesses with students to solve small real-world problems.</strong> Instead of building the entire platform, Chinedu runs a small experiment. He finds three businesses and five students. He tests one project. The idea now has evidence behind it.</p>

<h2>Learner activity — The BSOE 20 Ideas Challenge</h2>
<p>Choose one real problem, then generate 20 ideas without judging them.</p>
${block("exercise", "d21-problem")}
${block("exercise", "d21-ideas")}

<h2>Idea evaluation</h2>
<p>Now switch from <strong>create</strong> mode to <strong>evaluate</strong> mode. Choose your best three, then choose one idea worth investigating further.</p>
${block("exercise", "d21-evaluation")}

<h2>AI practical exercise — AI Idea Expansion Partner</h2>
<p><strong>Complete your own 20 ideas first.</strong> Your expansion partner brings in your problem and ideas, and keeps your original ideas clearly separate from its suggestions.</p>
${block("coach", "d21-expansion")}

<h2>Scenario-based activity</h2>
<p>You generate an idea for a new service. Your first reaction is: <em>"Someone has probably already done this."</em></p>
${block("scenario", "d21-already-done")}

<h2>Real-world challenge — Test one creative idea</h2>
<p>Choose one of your 20 ideas. Do not build the entire solution. Create the smallest useful test: ask five potential users; create a prototype; make a sample; publish a test post; demonstrate the concept; create a mock-up; run a short workshop; or build a simple version.</p>
${block("exercise", "d21-test")}

<h2>Day 21 reflection</h2>
${block("exercise", "d21-reflection")}

<h2>Day 21 quiz</h2>
${block("quiz")}

<h2>Day 21 assignment — My Creative Possibility Portfolio</h2>
<p>Your portfolio brings together: <strong>Part 1</strong> — one important pattern (Day 19); <strong>Part 2</strong> — one insight from your reflection sessions (Day 20); <strong>Part 3</strong> — your complete 20 Ideas Challenge; <strong>Part 4</strong> — your top three; <strong>Part 5</strong> — the idea you want to test and why.</p>
${block("exercise", "d21-assignment")}
`,
    exercises: [
      {
        exerciseId: "d21-connection",
        title: "Creative connection",
        fields: [
          field("areas", "My two unrelated areas:"),
          field("teach", "What could these two areas teach each other?"),
          field("ideas", "Five ideas:"),
        ],
      },
      {
        exerciseId: "d21-problem",
        title: "My problem",
        fields: [field("problem", "The real problem I will generate 20 ideas for:")],
      },
      {
        exerciseId: "d21-ideas",
        title: "My 20 Ideas Challenge",
        intro: "Ideas 1–5: obvious · 6–10: different approaches · 11–15: unusual · 16–20: wild possibilities. Don't judge yet.",
        table: { columns: ["My idea"], rows: numbered("Idea", 20) },
      },
      {
        exerciseId: "d21-evaluation",
        title: "Idea evaluation — my top three",
        table: {
          columns: ["Idea", "Problem solved", "Who benefits?", "Difficulty", "Evidence needed", "Small test"],
          rows: ["Top idea 1", "Top idea 2", "Top idea 3"],
        },
      },
      {
        exerciseId: "d21-test",
        title: "Testing one creative idea",
        fields: [
          field("tested", "What I tested:"),
          field("happened", "What happened:"),
          field("learned", "What I learned:"),
          field("change", "What I would change:"),
        ],
      },
      {
        exerciseId: "d21-reflection",
        title: "Day 21 reflection",
        fields: [
          field("surprised", "1. Which idea surprised me?"),
          field("early-late", "2. Did my best idea come early or late?"),
          field("judging", "3. What happened when I stopped judging ideas immediately?"),
          field("genuine", "4. Which idea could solve a genuine problem?"),
          field("investigate", "5. What would I like to investigate further?"),
        ],
      },
      {
        exerciseId: "d21-assignment",
        title: "My Creative Possibility Portfolio",
        intro: "Explain what you noticed; what you learned; how your ideas developed; which idea interests you most; what problem it addresses; who could benefit; what assumptions exist; what evidence you need; and what your smallest useful test would be.",
        fields: [
          field("pattern", "Part 1 — One important pattern I have noticed:"),
          field("insight", "Part 2 — One important insight from my reflection sessions:"),
          field("top-three", "Part 4 — My three most interesting ideas:"),
          field("experiment", "Part 5 — The idea I want to test, and why:"),
          words("essay", "My portfolio write-up (700–1,000 words)", 700, 1000),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d21-already-done",
        title: "\"Someone has probably already done this\"",
        question: "What should you do?",
        options: [
          "Immediately abandon it.",
          "Assume it will succeed.",
          "Investigate existing alternatives, identify what users need and explore whether your approach could offer something useful.",
          "Copy an existing service.",
        ],
        answer: 2,
        explanation:
          "Existing solutions do not automatically make an idea worthless. They provide information about demand, competition, user expectations, gaps and opportunities for differentiation.",
      },
    ],
    coaches: [
      {
        coachId: "d21-expansion",
        title: "AI Idea Expansion Partner",
        intro: "Expands your 20 ideas — assumptions, variations, small tests and five combinations — clearly marking what's yours and what's AI-suggested.",
        usesExercises: ["d21-problem", "d21-ideas"],
        promptTemplate:
          "I am exploring a problem, and here are 20 ideas I generated myself:\n\n[PASTE YOUR ANSWERS]\n\nHelp me expand the thinking without simply replacing my ideas.\n\nFor each idea:\n\n- identify the problem addressed;\n- identify who might benefit;\n- identify assumptions;\n- suggest one variation;\n- identify one possible small test.\n\nThen suggest five combinations that could emerge by combining two or more of my ideas.\n\nClearly distinguish my original ideas from AI-generated suggestions.\n\nDo not claim that any idea will succeed.\n\nHelp me create options that I can evaluate myself.",
        systemPrompt:
          "Exercise: Day 21 — idea expansion partner. The learner should generate their own ideas first; if they have fewer than about 10, encourage them to keep going before you add anything. For each of their ideas (keep it brief — a compact list or table): problem addressed, who might benefit, key assumption, one variation, one small test. Then propose five combinations of two or more of their ideas. Label everything clearly as either 'Your idea' or 'AI suggestion'. Never claim an idea will succeed or rank ideas for them; end by asking which three they want to evaluate further.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why separate idea generation from evaluation?",
        ["Evaluation is unnecessary.", "Immediate judgement can stop ideas being generated.", "Every idea should be accepted.", "Creativity does not require thinking."],
        1, "Create before you judge — then judge."),
      q("What is the purpose of the 20 Ideas Challenge?",
        ["To guarantee 20 successful ideas.", "To practise generating multiple possibilities.", "To identify one perfect idea immediately.", "To avoid testing ideas."],
        1, "It trains you to keep thinking after the obvious ideas run out."),
      q("When should ideas be evaluated?",
        ["Before generating them.", "During every sentence of idea generation.", "After generating a useful range of possibilities.", "Never."],
        2, "Generation first, evaluation second."),
      q("What should happen after selecting a promising idea?", ["Immediately invest everything.", "Test it appropriately.", "Assume it will work.", "Keep it secret forever."],
        1, "Like Chinedu: three businesses, five students, one project."),
      q("What can combining unrelated ideas produce?", ["Only confusion.", "New possibilities.", "Guaranteed inventions.", "Certain success."],
        1, "Connections between areas often spark new ideas."),
    ],
  },

  // ---------------------------------------------------------------- module 7 assessment
  {
    lessonId: "m7-assessment",
    title: "Module 7 · Creativity & Insight Assessment",
    lessonOrder: 35,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 19–21 together in your 50-mark Creativity & Insight assessment.",
    contentBody: `
<h2>Module 7 — 50-mark assessment: Develop Intuition, Creativity &amp; Insight</h2>
<p>Your daily work from Days 19–21 is a good starting point.</p>

<h2>Part A — Pattern recognition (10 marks)</h2>
<p>Identify and analyse one recurring pattern.</p>
${block("exercise", "m7-part-a")}
${marking([["Clear observation", "2"], ["Evidence of repetition", "2"], ["People/context identified", "2"], ["Alternative explanations", "2"], ["Investigation question", "2"]])}

<h2>Part B — Reflective thinking (10 marks)</h2>
<p>Submit three reflection sessions.</p>
${block("exercise", "m7-part-b")}
${marking([["Three reflection records", "3"], ["Quality of observations", "2"], ["Questions generated", "2"], ["Connections identified", "2"], ["Useful insight/action", "1"]])}

<h2>Part C — Creative idea generation (10 marks)</h2>
<p>Submit the 20 Ideas Challenge. Your Day 21 list is included in your submission; use this part to present it.</p>
${block("exercise", "m7-part-c")}
${marking([["20 ideas generated", "3"], ["Variety of ideas", "2"], ["Problem relevance", "2"], ["Original connections", "2"], ["Clear top-three selection", "1"]])}

<h2>Part D — Idea evaluation (10 marks)</h2>
<p>Evaluate your top three ideas.</p>
${block("exercise", "m7-part-d")}
${marking([["Problem clarity", "2"], ["Beneficiary identified", "2"], ["Assumptions identified", "2"], ["Evidence requirements", "2"], ["Small-test design", "2"]])}

<h2>Part E — Creative experiment (10 marks)</h2>
<p>Design a practical experiment for one idea.</p>
${block("exercise", "m7-part-e")}
${marking([["Idea clearly defined", "2"], ["Hypothesis identified", "2"], ["Test appropriate", "2"], ["Evidence identified", "2"], ["Learning/next step defined", "2"]])}

<h2>Module 7 performance</h2>
<ul>
<li><strong>40–50 — Strong Application.</strong> You have demonstrated strong practical application of observation, reflection, creativity and experimentation.</li>
<li><strong>30–39 — Developing Application.</strong> You understand the frameworks and are beginning to use them consistently.</li>
<li><strong>20–29 — Foundation Level.</strong> You demonstrate some understanding but need further practice generating and testing ideas.</li>
<li><strong>Below 20 — Review Days 19–21.</strong> Return to the lessons and practical activities before resubmitting the assessment.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E (and your Day 21 idea list) against the marking criteria. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m7-assessment-review")}

<h2>Your Module 7 submission</h2>
${block("portfolio")}

<h2>The 7-day Insight Challenge</h2>
<p>For seven days, keep an <strong>Insight Log</strong>.</p>
${block("exercise", "m7-log")}
<p>At the end of seven days, answer:</p>
<blockquote><p>What did I start noticing when I deliberately trained myself to pay attention?</p></blockquote>
${block("exercise", "m7-log-reflection")}

<h2>Module 7 integration</h2>
<p>Module 6 taught you <strong>Failure → Evidence → Learning → Experiment</strong>. Module 7 adds <strong>Observation → Question → Possibility → Creation → Test</strong>. Together they create a powerful cycle:</p>
${flow(["NOTICE — What is happening?", "QUESTION — Why?", "IMAGINE — What else could be possible?", "CREATE — What could I design?", "TEST — What can I try?", "LEARN — What does the evidence tell me?", "ADJUST — What should change?"])}

<h2>The BSOE Creativity Principle — create before you judge</h2>
<p>During idea generation: <strong>be expansive.</strong> During evaluation: <strong>be critical.</strong> During experimentation: <strong>be evidence-based.</strong> These are three different mental modes:</p>
${table(["Mode", "Question"], [
  ["1 — Possibility", "\"What could exist?\""],
  ["2 — Evaluation", "\"What makes sense?\""],
  ["3 — Experimentation", "\"What can I test?\""],
])}
<p>Keeping these modes separate helps prevent premature judgement without abandoning critical thinking.</p>

<h2>AI and human creativity</h2>
<p>AI can generate ideas quickly. That does not mean AI should decide which ideas matter.</p>
${table(["AI can help with", "You remain responsible for"], [
  ["Expanding · Combining · Questioning · Structuring · Challenging", "Identifying meaningful problems · understanding people · checking assumptions · evaluating evidence · considering consequences · choosing what to investigate · deciding what action to take"],
])}
<p>The human remains responsible for <strong>judging, choosing, testing and learning</strong>.</p>

<h2>Module 7 key message</h2>
<p>Creativity does not require waiting for inspiration. You can practise it. You can practise noticing. You can practise questioning. You can practise connecting ideas. You can practise generating possibilities. You can practise testing them.</p>
${flow(["NOTICE", "QUESTION", "CONNECT", "CREATE", "TEST", "LEARN"])}
<p>And sometimes the most valuable idea begins with something very ordinary:</p>
<blockquote><p>I keep noticing this. I wonder why.</p></blockquote>

<h2>Module 7 outputs</h2>
<ol>
<li>My Creativity &amp; Insight Diagnostic</li>
<li>My Pattern &amp; Opportunity Map</li>
<li>My Pattern Recognition Report</li>
<li>My Three-Day Reflection Journal</li>
<li>My 20 Ideas Challenge</li>
<li>My Creative Possibility Portfolio</li>
<li>My Creative Experiment</li>
<li>My Seven-Day Insight Log</li>
<li>My 50-Mark Creativity &amp; Insight Assessment</li>
</ol>

<h2>The journey so far</h2>
${flow([
  "Module 1 — Wake Up: What is happening in my life?",
  "Module 2 — Understand: How do I process what happens?",
  "Module 3 — Transform: Who am I becoming?",
  "Module 4 — Design: What kind of life will support that person?",
  "Module 5 — Steady: How will I remain intentional when life challenges my plans?",
  "Module 6 — Learn: What can I learn, change and test when something does not work?",
  "Module 7 — Create: What can I notice, imagine and create that I could not see before?",
])}

<h2>Next: Module 8 — Turn Vision Into Reality</h2>
<p>The course now moves from <strong>"I can imagine possibilities"</strong> to <strong>"I can turn one possibility into something real."</strong></p>
<ul>
<li><strong>Day 22 — Clarity:</strong> what exactly am I trying to create? Turn a broad ambition into a clear one-sentence goal.</li>
<li><strong>Day 23 — Vision + Planning:</strong> what could stop me, and how will I respond? Practical obstacle planning using <strong>If → Then</strong>.</li>
<li><strong>Day 24 — The Extraordinary Project:</strong> what meaningful thing can I build, improve, test or complete? Create your <strong>Extraordinary Project Canvas</strong>.</li>
</ul>
<p><strong>Vision → Clarity → Plan → Action → Project → Evidence.</strong></p>
`,
    exercises: [
      {
        exerciseId: "m7-part-a",
        title: "Part A — Pattern recognition",
        fields: [
          field("observation", "What I observed:"),
          field("repetition", "Evidence that it repeats:"),
          field("context", "Who experiences it, and where and when:"),
          field("alternatives", "Alternative explanations (at least two):"),
          field("question", "The question I would investigate:"),
        ],
      },
      {
        exerciseId: "m7-part-b",
        title: "Part B — Three reflection sessions",
        table: { columns: REFLECTION_COLUMNS, rows: numbered("Session", 3) },
      },
      {
        exerciseId: "m7-part-c",
        title: "Part C — Creative idea generation",
        fields: [
          field("problem", "The problem I explored:"),
          field("variety", "How my ideas varied (obvious → different → unusual → wild):"),
          field("connections", "Original connections I made between ideas or areas:"),
          field("top-three", "My top three, and why I chose them:"),
        ],
      },
      {
        exerciseId: "m7-part-d",
        title: "Part D — Idea evaluation",
        table: {
          columns: ["Idea", "Problem it solves", "Who benefits", "Assumptions", "Evidence needed", "Small test"],
          rows: ["Top idea 1", "Top idea 2", "Top idea 3"],
        },
      },
      {
        exerciseId: "m7-part-e",
        title: "Part E — Creative experiment",
        fields: [
          field("idea", "The idea:"),
          field("hypothesis", "Hypothesis:"),
          field("test", "The test:"),
          field("evidence", "Evidence I will collect:"),
          field("next", "What I will learn, and my next step:"),
        ],
      },
      {
        exerciseId: "m7-log",
        title: "My Insight Log",
        table: {
          columns: ["What I noticed", "Question", "Connection", "Possible idea", "What I could test"],
          rows: numbered("Day", 7),
        },
      },
      {
        exerciseId: "m7-log-reflection",
        title: "What did I start noticing?",
        fields: [words("reflection", "My reflection (250–500 words)", 250, 500)],
      },
    ],
    coaches: [
      {
        coachId: "m7-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the marking criteria, including your Day 21 idea list for Part C. Its marks are indicative only.",
        usesExercises: ["m7-part-a", "m7-part-b", "d21-problem", "d21-ideas", "m7-part-c", "m7-part-d", "m7-part-e"],
        promptTemplate:
          "Please review my Module 7 assessment, Develop Intuition, Creativity & Insight (Parts A–E, 10 marks each), against the marking criteria. My Day 21 20 Ideas Challenge is included for Part C.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 7 assessment review (formative). The learner's Day 21 '20 Ideas Challenge' list is included as evidence for Part C. Mark against:\nA Pattern recognition (10): clear observation 2; evidence of repetition 2; people/context identified 2; alternative explanations 2; investigation question 2.\nB Reflective thinking (10): three reflection records 3; quality of observations 2; questions generated 2; connections identified 2; useful insight/action 1.\nC Creative idea generation (10): 20 ideas generated 3 (count them from the Day 21 list); variety of ideas 2; problem relevance 2; original connections 2; clear top-three selection 1.\nD Idea evaluation (10): problem clarity 2; beneficiary identified 2; assumptions identified 2; evidence requirements 2; small-test design 2.\nE Creative experiment (10): idea clearly defined 2; hypothesis identified 2; test appropriate 2; evidence identified 2; learning/next step defined 2.\nFor each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 with the criterion breakdown (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 19–21). State clearly that marks are indicative and the tutor gives the final mark. Don't judge ideas as good or bad businesses — assess the thinking process. Do not rewrite their work or add your own ideas.",
      },
    ],
    portfolio: [
      { exerciseId: "m7-part-a", title: "Part A — Pattern recognition (10 marks)", lessonId: "m7-assessment" },
      { exerciseId: "m7-part-b", title: "Part B — Reflective thinking (10 marks)", lessonId: "m7-assessment" },
      { exerciseId: "m7-part-c", title: "Part C — Creative idea generation (10 marks)", lessonId: "m7-assessment" },
      { exerciseId: "d21-ideas", title: "My 20 Ideas Challenge (Day 21, for Part C)", lessonId: "m7-day-21" },
      { exerciseId: "m7-part-d", title: "Part D — Idea evaluation (10 marks)", lessonId: "m7-assessment" },
      { exerciseId: "m7-part-e", title: "Part E — Creative experiment (10 marks)", lessonId: "m7-assessment" },
      { exerciseId: "m7-diagnostic", title: "My Creativity & Insight Diagnostic", lessonId: "m7-intro" },
      { exerciseId: "d19-map", title: "My Pattern & Opportunity Map (Day 19)", lessonId: "m7-day-19" },
      { exerciseId: "d19-assignment", title: "My Pattern Recognition Report (Day 19)", lessonId: "m7-day-19" },
      { exerciseId: "d20-journal", title: "My Three-Day Reflection Journal (Day 20)", lessonId: "m7-day-20" },
      { exerciseId: "d21-assignment", title: "My Creative Possibility Portfolio (Day 21)", lessonId: "m7-day-21" },
      { exerciseId: "m7-log", title: "My Seven-Day Insight Log", lessonId: "m7-assessment" },
      { exerciseId: "m7-log-reflection", title: "7-day reflection (250–500 words)", lessonId: "m7-assessment" },
    ],
  },
];
