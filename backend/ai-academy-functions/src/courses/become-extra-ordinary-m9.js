// Become Extra Ordinary — Module 9: Discover Your Calling & Contribution
// (Days 25–27). Same lesson format as Modules 1–8.

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
    lessonId: "m9-intro",
    title: "Module 9 · Discover Your Calling & Contribution",
    lessonOrder: 41,
    duration: "15 minutes",
    objective: "From personal potential to meaningful contribution.",
    contentBody: `
<h2>Module 9 — Discover Your Calling &amp; Contribution</h2>
<p><strong>Days 25–27 · From personal potential to meaningful contribution</strong></p>
${flow(["STRENGTHS", "EXPERIENCE", "PROBLEMS", "PURPOSE", "CONTRIBUTION", "MISSION"])}

<h2>Module overview</h2>
<p>The previous modules have focused increasingly on action. You have questioned your assumptions; explored your identity; imagined your future; developed resilience; learned from failure; developed creativity; created a clear goal; and started an Extraordinary Project. Now the question becomes deeper:</p>
<blockquote><p>What is all this growth for?</p></blockquote>
<p>An extraordinary life is not necessarily about becoming famous, wealthy or impressive. <strong>It can also be about becoming useful.</strong> It can mean using what you know, what you have experienced, what you care about and what you are capable of to create value for other people. Module 9 helps you explore this intersection.</p>

<h2>The Module 9 question</h2>
<blockquote><p>What could you contribute if you deliberately connected your strengths, experiences, interests and the problems you care about?</p></blockquote>
<p>This module does <strong>not</strong> tell you what your calling is. Instead, it gives you a process for exploring possible directions. A calling may develop over time. It can change. It can emerge from experience. It can become clearer through action.</p>

<h2>Module learning outcomes</h2>
<p>By the end of this module, you should be able to:</p>
<ol>
<li>Identify personal strengths.</li>
<li>Recognise skills developed through experience.</li>
<li>Identify activities that generate energy and engagement.</li>
<li>Distinguish interests from deeper values.</li>
<li>Identify problems you genuinely care about.</li>
<li>Recognise experiences that have shaped your perspective.</li>
<li>Explore possible areas of contribution.</li>
<li>Connect strengths with real-world needs.</li>
<li>Use AI to identify themes without allowing AI to define your purpose.</li>
<li>Develop a Contribution Map.</li>
<li>Create a personal Mission Statement.</li>
<li>Connect contribution with employability, entrepreneurship, leadership or community impact.</li>
<li>Identify one contribution experiment.</li>
<li>Develop a practical direction for the next stage of your journey.</li>
</ol>

<h2>Module 9 diagnostic — How clearly can you see your contribution?</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m9-diagnostic")}
<p><strong>Important:</strong> this is a learning and development diagnostic, not a psychological assessment, intelligence test, career prediction or diagnosis.</p>
`,
    exercises: [
      {
        exerciseId: "m9-diagnostic",
        title: "Calling & Contribution Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Strengths & self-awareness",
              statements: [
                "I can describe several things I do well.",
                "I can identify skills I have developed through experience.",
                "I recognise strengths that other people have noticed in me.",
                "I can identify activities where I naturally become absorbed.",
                "I can explain how some of my experiences have shaped what I value.",
              ],
            },
            {
              title: "Purpose & contribution",
              statements: [
                "I can identify problems or issues that matter to me.",
                "I care about creating value beyond personal achievement.",
                "I can identify people or communities I would like to help.",
                "I can connect some of my strengths to real-world needs.",
                "I regularly ask how my work could be useful to others.",
              ],
            },
            {
              title: "Direction & action",
              statements: [
                "I have explored different ways I could contribute.",
                "I am willing to test possible directions rather than waiting for certainty.",
                "I can describe the kind of contribution I would like to make.",
                "I seek experiences that help me understand my purpose.",
                "I am taking practical steps towards a meaningful direction.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "Beginning to discover strengths, values and possible contribution." },
            { min: 27, max: 38, title: "Developing", text: "Some awareness, but connections between strengths and contribution need development." },
            { min: 39, max: 50, title: "Building", text: "Increasing clarity about strengths and meaningful directions." },
            { min: 51, max: 62, title: "Intentional", text: "Strong awareness and active exploration of contribution." },
            { min: 63, max: 75, title: "Designing", text: "Highly developed connection between strengths, purpose and action." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 25
  {
    lessonId: "m9-day-25",
    title: "Module 9 · Day 25 — Energy & Strengths",
    lessonOrder: 42,
    duration: "60–75 minutes",
    objective: "What are you naturally good at — and what gives you energy?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What abilities, behaviours and experiences repeatedly show up when you are doing work that matters to you?</p></blockquote>
${talk("Discover the strengths you may be taking for granted", `
You may have strengths you barely notice. Why? Because things that come naturally to you can feel ordinary.

Perhaps people regularly ask you to explain complicated things. Perhaps you are good at organising chaos. Perhaps you notice problems other people overlook. Perhaps you bring people together. Perhaps you create ideas quickly. Perhaps you are patient when others become frustrated. Perhaps you can sell. Perhaps you can teach. Perhaps you can build. Perhaps you listen.

These abilities are clues. But strengths are not simply things you are good at. A useful strength is an ability or quality that can create value.

Your experiences also matter. You may have learned things through your education, employment, family responsibilities, volunteering, difficult situations, hobbies or projects. Some of your most valuable skills may never have appeared on a certificate.

Today you are going to conduct a Strengths and Energy Audit. Look for patterns. Ask: What do people come to me for? What problems do I enjoy solving? What activities make me feel engaged? What have I repeatedly learned to do? What do I find easier than other people seem to?

Your strengths are not your destiny. They are resources.

The question is: <strong>How could you use those resources meaningfully?</strong>`)}

<h2>Reading — Strengths are more than job skills</h2>
<p>A CV might say: <em>"Project management."</em> But the underlying strengths might include organising, prioritising, communication, problem solving, coordination, decision-making and responsibility. A job title may disappear. <strong>The underlying capabilities can transfer.</strong></p>

<h2>The five sources of strength</h2>
${table(["Source", "Question", "Examples"], [
  ["1. Skills", "What can you do?", "Writing; coding; teaching; sales; analysis; design; communication."],
  ["2. Character qualities", "How do you tend to operate?", "Persistence; curiosity; reliability; patience; initiative."],
  ["3. Experience", "What have you learned through doing?", "Managing a project; caring for others; running an event; solving workplace problems; starting a small business."],
  ["4. Knowledge", "What do you understand?", "Finance; education; technology; marketing; healthcare; business."],
  ["5. Perspective", "What do you see because of your particular experiences?", "Perspective becomes valuable when it helps you recognise a problem, opportunity or need that others may not notice."],
])}

<h2>The energy question</h2>
<p>Do not ask only <em>"What am I good at?"</em> Also ask: <strong>"What am I willing to keep getting better at?"</strong> Something can be a strength without being something you want to spend your life doing. That distinction matters.</p>

<h2>Interactive example — From activity to strength</h2>
<p>Aisha regularly helps classmates understand difficult topics. She initially says: <em>"I just explain things."</em> The deeper analysis reveals:</p>
${table(["", ""], [
  ["Activity", "Explaining difficult subjects."],
  ["Skill", "Communication."],
  ["Strength", "Simplifying complexity."],
  ["Enjoyment", "Helping people understand."],
  ["Possible contribution", "Education, training, content creation, mentoring or customer education."],
])}
<p>The exercise is not telling Aisha what career to choose. It is helping her see possibilities that may have been invisible.</p>

<h2>Case study — Daniel's strengths were hidden in his work</h2>
<p>Daniel worked in administration. He described his job as <em>"just paperwork."</em> During his Strengths Audit, he discovered that colleagues regularly asked him to organise complicated information; solve process problems; explain procedures; train new staff; create spreadsheets; and find errors.</p>
<p>His job title had hidden the breadth of his abilities. His transferable strengths included <strong>organisation, problem solving, communication, process improvement, training and attention to detail</strong>. He began exploring how these capabilities could transfer into digital operations and automation.</p>
<p>His breakthrough was not discovering a completely new person. It was recognising capabilities he had already developed.</p>

<h2>Learner activity — The Strengths &amp; Energy Audit</h2>
${block("exercise", "d25-audit")}
<p>Now identify your top five strengths, with evidence for each:</p>
${block("exercise", "d25-top5")}

<h2>AI practical exercise — AI Strengths Pattern Finder</h2>
<p>Complete your own audit first. Your pattern finder brings in your audit, top five strengths and any feedback you've collected — and won't tell you what career to choose.</p>
${block("coach", "d25-pattern")}

<h2>Scenario activity</h2>
<p>Maria says: <em>"I don't have any useful strengths because I don't have a degree in the area I want to enter."</em></p>
${block("scenario", "d25-maria")}

<h2>Real-world challenge — Ask three people</h2>
<p>Ask three people who know you reasonably well: <em>"What is something you think I am particularly good at that I may not recognise?"</em> Do not defend yourself. Do not explain. Simply record their answers. Look for repetition.</p>
${block("exercise", "d25-feedback")}

<h2>Day 25 reflection</h2>
${block("exercise", "d25-reflection")}

<h2>Day 25 quiz</h2>
${block("quiz")}

<h2>Day 25 assignment — My Strengths &amp; Energy Report</h2>
<p>Your ten audit responses, top five strengths with evidence, and three-person feedback above are part of this report. Add:</p>
${block("exercise", "d25-assignment")}
`,
    exercises: [
      {
        exerciseId: "d25-audit",
        title: "Strengths & Energy Audit",
        fields: [
          field("ask", "What do people often ask me for help with?"),
          field("enjoy", "What problems do I enjoy solving?"),
          field("quickly", "What do I learn quickly?"),
          field("repeatedly", "What have I repeatedly done successfully?"),
          field("lose-time", "What activities make me lose track of time?"),
          field("compliment", "What do people compliment me on?"),
          field("outside", "What have I learned outside formal education?"),
          field("difficult", "What difficult experience taught me something valuable?"),
          field("better", "What am I willing to become better at?"),
          field("help", "What strengths could help someone else?"),
        ],
      },
      {
        exerciseId: "d25-top5",
        title: "My top five strengths",
        table: { columns: ["Strength", "Evidence"], rows: numbered("Strength", 5) },
      },
      {
        exerciseId: "d25-feedback",
        title: "Ask three people",
        table: { columns: ["Who I asked", "What they said"], rows: numbered("Person", 3) },
      },
      {
        exerciseId: "d25-reflection",
        title: "Day 25 reflection",
        fields: [
          field("underestimated", "A strength I have previously underestimated is…"),
          field("evidence", "Evidence for this strength is…"),
          field("use", "I could potentially use this strength to…"),
        ],
      },
      {
        exerciseId: "d25-assignment",
        title: "My Strengths & Energy Report",
        intro: "Recommended length: 500–700 words in total, including your audit, strengths and feedback above.",
        fields: [
          field("energy", "Three activities that create energy for me:"),
          field("themes", "Recurring themes across my audit, strengths and feedback:"),
          field("value", "Three possible areas where my strengths could create value:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d25-maria",
        title: "Maria's degree",
        question: "What would be the most useful response?",
        options: [
          "Agree that qualifications are the only evidence of ability.",
          "Tell her that qualifications never matter.",
          "Explore her transferable skills, experiences, knowledge and evidence of what she can actually do.",
          "Ask AI to choose a career for her.",
        ],
        answer: 2,
        explanation: "Qualifications can matter in many contexts, but they are not the only possible source of evidence about capability.",
      },
    ],
    coaches: [
      {
        coachId: "d25-pattern",
        title: "AI Strengths Pattern Finder",
        intro: "Finds recurring themes across your audit, strengths and feedback — separating evidence in your answers from its own suggestions. It won't choose a career for you.",
        usesExercises: ["d25-audit", "d25-top5", "d25-feedback"],
        promptTemplate:
          "Review the following Strengths & Energy Audit.\n\n[PASTE YOUR ANSWERS]\n\nIdentify recurring themes in:\n\n- skills;\n- strengths;\n- interests;\n- experiences;\n- activities that create energy;\n- transferable capabilities.\n\nDo not tell me what career I should choose.\n\nInstead, identify patterns I may want to investigate and give me questions that could help me explore them further.\n\nClearly distinguish between evidence in my responses and your suggestions.",
        systemPrompt:
          "Exercise: Day 25 — strengths pattern finder. From the learner's audit, top-five strengths and three-person feedback, identify recurring themes in skills, strengths, interests, experiences, energising activities and transferable capabilities, using the five sources of strength (skills, character qualities, experience, knowledge, perspective). For each theme show 'Evidence from your answers' (quote them) separately from 'My suggestion'. Note where others' feedback matches or differs from their self-view. Distinguish things they're good at from things that give them energy. Never recommend a career, never label their personality, never flatter beyond the evidence. Finish with 3–5 questions to explore further.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why can people overlook their own strengths?",
        ["Strengths never matter", "Things that come naturally can feel ordinary", "Strengths only come from qualifications", "Other people always understand us better"],
        1, "What comes naturally can feel like nothing special."),
      q("What is a transferable skill?",
        ["A skill that only works in one job", "A skill that can potentially be applied in different contexts", "A qualification", "A personality diagnosis"],
        1, "Job titles change; underlying capabilities can transfer."),
      q("Which is an example of a strength?",
        ["\"I have a job title.\"", "\"I simplify complicated information for other people.\"", "\"I want success.\"", "\"I own a laptop.\""],
        1, "It's an ability that can create value for others."),
      q("Why examine energy as well as ability?",
        ["To guarantee happiness", "To identify activities you may be willing to continue developing", "To avoid learning", "To predict your future"],
        1, "Ask: what am I willing to keep getting better at?"),
      q("What should AI do in the Strengths exercise?",
        ["Decide your career", "Diagnose your personality", "Identify themes and questions for exploration", "Tell you what your life purpose is"],
        2, "AI helps you see patterns; you decide what they mean."),
    ],
  },

  // ---------------------------------------------------------------- day 26
  {
    lessonId: "m9-day-26",
    title: "Module 9 · Day 26 — Your Contribution",
    lessonOrder: 43,
    duration: "60–75 minutes",
    objective: "What problems do you care enough about to help solve?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>Where do your strengths meet a problem, need or opportunity that matters to you?</p></blockquote>
${talk("Purpose begins where strength meets need", `
Purpose is sometimes presented as one magical answer. "What is your purpose?" That question can feel overwhelming.

Instead, try a smaller question: <strong>What could I use my strengths for?</strong> Then another: <strong>Who could benefit?</strong> And another: <strong>What problem could I help address?</strong>

Contribution begins at the intersection between what you can offer and what is needed.

For example: someone who is good at teaching may help people develop skills. Someone who is good at technology may help organisations work more efficiently. Someone who is good at listening and organising may support communities. Someone who understands business may help entrepreneurs solve practical problems. Someone who has experienced a particular challenge may have insights that help others navigate it.

Your contribution does not need to solve the world's biggest problem. It can start with one person. One organisation. One community. One process. One useful product. One piece of knowledge.

Your goal today is not to discover one permanent life purpose. It is to create a <strong>Contribution Map</strong>.

You will connect: What I know → What I can do → What I care about → Who needs it → What I could try.

That is enough to begin.`)}

<h2>Reading — The Contribution Equation</h2>
<p><strong>STRENGTH + EXPERIENCE + INTEREST + NEED = POSSIBLE CONTRIBUTION</strong></p>
<p>Not: <em>Passion = Purpose.</em> Passion can be useful. But contribution usually becomes clearer when personal interest meets a real need.</p>

<h2>Four questions</h2>
<ol>
<li><strong>What do I know?</strong> Knowledge.</li>
<li><strong>What can I do?</strong> Capabilities.</li>
<li><strong>What do I care about?</strong> Values and interests.</li>
<li><strong>Who could benefit?</strong> People, organisations or communities.</li>
</ol>
<p>Then ask: <strong>What could I try?</strong></p>

<h2>Contribution can take many forms</h2>
${table(["Form", "What it means"], [
  ["Employment", "Using your capabilities to create value within an organisation."],
  ["Entrepreneurship", "Creating products or services that solve problems."],
  ["Leadership", "Helping people move towards a meaningful objective."],
  ["Education", "Sharing knowledge and developing other people's capabilities."],
  ["Community", "Contributing time, skills or resources."],
  ["Creative work", "Creating ideas, stories, products or experiences that provide value."],
  ["Technology", "Building tools, systems or automation that improve how people work."],
])}
<p>You do not need to choose one category permanently.</p>

<h2>Interactive example — The four-column contribution exercise</h2>
${table(["I know", "I can do", "I care about", "People who could benefit"], [["Digital tools.", "Explain technology simply.", "Employability.", "Students."]])}
<p><strong>Possible contribution:</strong> create practical digital-skills learning resources that help students demonstrate workplace capability. The next question becomes: <em>what small experiment could test whether this is genuinely useful?</em> That question moves contribution from theory into reality.</p>

<h2>Case study — Chinedu's Contribution Map</h2>
<p>Chinedu had experience in business, technology, mentoring and communication. He cared about young people's employability. He noticed that many students had qualifications but struggled to demonstrate practical workplace skills.</p>
${table(["", ""], [
  ["Strength", "Teaching."],
  ["Knowledge", "Business and technology."],
  ["Experience", "Mentoring students."],
  ["Problem", "Lack of practical evidence of employability."],
  ["Beneficiary", "Students and potential employers."],
  ["Possible contribution", "Practical project-based employability training."],
])}
<p>His next step was not to create a large organisation. He designed a small workshop and tested it with a group of students. The experience gave him evidence. It also helped him discover what he enjoyed and where he could add value.</p>

<h2>Learner activity — Your Contribution Map</h2>
${block("exercise", "d26-map")}

<h2>AI practical exercise — AI Contribution Explorer</h2>
<p>Your contribution explorer reads your map and generates 5–10 possible directions, each with an assumption to test and a small experiment. It won't choose for you.</p>
${block("coach", "d26-explorer")}

<h2>Scenario activity</h2>
<p>James says: <em>"I have found my purpose because AI told me what my purpose is."</em></p>
${block("scenario", "d26-james")}

<h2>Real-world challenge — The contribution conversation</h2>
<p>Speak to someone who works in an area you are interested in, and record what you learn.</p>
${block("exercise", "d26-conversation")}

<h2>Day 26 reflection</h2>
${block("exercise", "d26-reflection")}

<h2>Day 26 quiz</h2>
${block("quiz")}

<h2>Day 26 assignment — My Contribution Map</h2>
<p>Your map above covers strengths, knowledge, experience, interests, problems, beneficiaries and contribution areas. Now add three contribution possibilities and one small experiment. Recommended length: 600–800 words in total.</p>
${block("exercise", "d26-possibilities")}
${block("exercise", "d26-experiment")}
`,
    exercises: [
      {
        exerciseId: "d26-map",
        title: "My Contribution Map",
        fields: [
          field("know", "What do I know?"),
          field("do", "What can I do?"),
          field("shaped", "What experiences have shaped me?"),
          field("problems", "What problems interest me?"),
          field("care", "What do I care about?"),
          field("benefit", "Who could benefit from my strengths?"),
          field("needs", "What needs do I notice?"),
          field("create", "What could I create?"),
          field("improve", "What could I improve?"),
          field("teach", "What could I teach?"),
          field("solve", "What could I solve?"),
          field("test", "What could I test?"),
          field("sentence", "I could potentially use my ______ to help ______ with ______."),
        ],
      },
      {
        exerciseId: "d26-conversation",
        title: "The contribution conversation",
        fields: [
          field("who", "Who I spoke to (role or area — no personal details needed):"),
          field("problems", "1. What problems do people in this area currently face?"),
          field("skills", "2. What skills are useful?"),
          field("misunderstand", "3. What do beginners often misunderstand?"),
          field("improving", "4. What needs improving?"),
          field("useful", "5. What would make a useful contribution?"),
        ],
      },
      {
        exerciseId: "d26-reflection",
        title: "Day 26 reflection",
        fields: [
          field("problem", "A problem I genuinely care about is…"),
          field("affected", "The people affected are…"),
          field("strength", "A strength I could potentially use is…"),
          field("contribution", "One contribution I could explore is…"),
          field("test", "The smallest way I could test it is…"),
        ],
      },
      {
        exerciseId: "d26-possibilities",
        title: "Three contribution possibilities",
        table: {
          columns: ["Contribution possibility", "Problem it addresses", "Who benefits", "Assumption behind it"],
          rows: numbered("Possibility", 3),
        },
      },
      {
        exerciseId: "d26-experiment",
        title: "One small contribution experiment",
        fields: [
          field("which", "Which possibility I will test:"),
          field("action", "The small action I will take:"),
          field("evidence", "What evidence will tell me whether it is useful:"),
          field("when", "When I will do it:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d26-james",
        title: "\"AI told me my purpose\"",
        question: "What is the most appropriate response?",
        options: [
          "Accept the AI answer as authoritative.",
          "Ignore all AI completely.",
          "Treat AI suggestions as prompts for reflection and test possible directions through real experience.",
          "Ask AI to make the final decision.",
        ],
        answer: 2,
        explanation:
          "Purpose is explored through reflection, experience, action and learning. AI can help organise possibilities, but it should not become the authority over someone's life direction.",
      },
    ],
    coaches: [
      {
        coachId: "d26-explorer",
        title: "AI Contribution Explorer",
        intro: "Generates 5–10 contribution directions from your map — each with a problem, beneficiary, capability, assumption and smallest experiment. You choose.",
        usesExercises: ["d26-map", "d25-top5"],
        promptTemplate:
          "Here is my Contribution Map:\n\n[PASTE YOUR ANSWERS]\n\nHelp me identify possible intersections between:\n\n- my strengths;\n- my knowledge;\n- my experiences;\n- my interests;\n- problems I have identified;\n- people who might benefit.\n\nGenerate 5–10 possible contribution directions.\n\nFor each, identify:\n\n- the potential problem;\n- possible beneficiary;\n- capability I could use;\n- assumption that needs testing;\n- smallest useful experiment.\n\nDo not tell me which one to choose.\n\nDo not describe any idea as guaranteed to succeed.",
        systemPrompt:
          "Exercise: Day 26 — contribution explorer. Using the learner's Contribution Map (and top strengths if included), generate 5–10 contribution directions grounded in what they wrote, spread across different forms (employment, entrepreneurship, leadership, education, community, creative work, technology). For each give: potential problem, possible beneficiary, capability they'd use (tie to their words), assumption needing testing, smallest useful experiment. Present them as options in no ranked order; never pick one, never call anything guaranteed or 'your purpose'. Keep experiments safe, low-cost and appropriate (for teens, suggest involving a trusted adult). End by asking which 2–3 resonate and why.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a useful way to explore contribution?",
        ["Strength + experience + interest + need", "Money + fame", "Qualification + job title", "AI recommendation alone"],
        0, "The Contribution Equation."),
      q("Who determines whether a possible contribution is worth pursuing?",
        ["AI", "Social media", "The learner through reflection, evidence and experience", "A random online test"],
        2, "AI can organise possibilities; you decide."),
      q("Why identify beneficiaries?", ["To understand who might receive value", "To guarantee customers", "To predict success", "To avoid testing"],
        0, "Contribution means value for someone."),
      q("What is a contribution experiment?",
        ["A permanent life decision", "A small action used to explore whether a possible direction is useful", "A prediction", "A personality test"],
        1, "Like Chinedu's first small workshop."),
      q("Which statement best represents contribution?",
        ["\"I want people to admire me.\"", "\"I want to use my strengths to create useful value.\"", "\"AI will tell me my purpose.\"", "\"My purpose can never change.\""],
        1, "Contribution is about usefulness, not admiration."),
    ],
  },

  // ---------------------------------------------------------------- day 27
  {
    lessonId: "m9-day-27",
    title: "Module 9 · Day 27 — Your Mission",
    lessonOrder: 44,
    duration: "75–90 minutes",
    objective: "What do you want to be useful for?",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>If your life became increasingly aligned with your strengths, values and contribution, what would you want your work and actions to stand for?</p></blockquote>
${talk("From calling to mission", `
You do not necessarily need one perfect life purpose. You need a direction that is meaningful enough to guide your choices. A mission can provide that direction.

Your mission is not a job title. It is not "I want to be a lawyer", "I want to become an entrepreneur" or "I want to be a manager". Those are roles.

A mission describes the value you want to create. For example: "I want to help people develop practical skills that increase their opportunities."

That mission could be expressed through teaching. It could be expressed through technology. It could be expressed through business. It could change form while keeping its underlying direction.

A useful mission answers three questions: <strong>Who</strong> do I want to help? <strong>What</strong> value do I want to create? <strong>How</strong> might I contribute?

Your mission does not have to be permanent. You are allowed to learn. You are allowed to change. You are allowed to discover new strengths. <strong>Your mission is a compass, not a cage.</strong>

Today you will create a first version of your personal mission statement. Then you will connect it to action.

Because a mission without action is simply a sentence.`)}

<h2>Reading — Mission vs job</h2>
${table(["", "Describes…"], [
  ["Job", "What you are employed to do."],
  ["Career", "The broader professional path you may follow."],
  ["Calling", "A meaningful direction you feel drawn to explore."],
  ["Mission", "The value you want to create."],
])}
<p>These can overlap. But they do not have to be identical.</p>

<h2>The BSOE Mission Framework</h2>
<p><strong>I want to help…</strong> (who?) <strong>by…</strong> (how?) <strong>to…</strong> (what outcome?) <strong>because…</strong> (why does it matter?)</p>
<blockquote><p>I want to help students and early-career professionals develop practical digital skills by creating accessible, project-based learning opportunities so they can demonstrate their capabilities and pursue meaningful opportunities.</p></blockquote>

<h2>A good mission should be</h2>
<ul>
<li><strong>Meaningful</strong> — it matters to you.</li>
<li><strong>Useful</strong> — it creates value for someone.</li>
<li><strong>Flexible</strong> — it does not trap you in one job title.</li>
<li><strong>Actionable</strong> — you can express it through behaviour.</li>
<li><strong>Honest</strong> — it reflects what you genuinely care about.</li>
</ul>

<h2>Interactive example — From job to mission</h2>
${table(["", ""], [
  ["Job goal", "\"I want to become a marketing manager.\""],
  ["Why?", "\"I enjoy helping businesses communicate.\""],
  ["Why does that matter?", "\"I like turning complicated products into understandable messages.\""],
  ["Who could benefit?", "Businesses and customers."],
  ["Possible mission", "<strong>\"I want to help organisations communicate useful ideas clearly so people can understand and act on them.\"</strong>"],
])}
<p>The mission can be expressed through marketing, content, consulting, education or entrepreneurship. The job may change. The underlying value can remain.</p>

<h2>Case study — Sarah's mission</h2>
<p>Sarah initially believed her goal was: <em>"Become a successful business owner."</em> During the course she discovered that she enjoyed teaching; she was good at organising; she cared about young people's opportunities; she enjoyed solving practical problems; and she wanted flexibility. Her mission became:</p>
<blockquote><p>I want to help young people turn knowledge into practical skills and opportunities.</p></blockquote>
<p>That mission opened several possible routes: education, mentoring, entrepreneurship, digital training, employability projects and community programmes. She did not need to decide immediately which route would become permanent. <strong>She needed to start creating evidence.</strong></p>

<h2>Learner activity — The Mission Builder</h2>
${block("exercise", "d27-builder")}
<p>Now create three mission statements and choose the version that feels most useful:</p>
${block("exercise", "d27-missions")}

<h2>AI practical exercise — AI Mission Reflection Partner</h2>
<p>Your mission partner reads your Mission Builder and Contribution Map, drafts three statements based only on what you wrote, and shows what each emphasises and leaves out. <strong>You make the final decision.</strong></p>
${block("coach", "d27-mission")}

<h2>Scenario activity</h2>
<p>A learner says: <em>"My mission is to become a CEO."</em></p>
${block("scenario", "d27-ceo")}

<h2>Real-world challenge — Live your mission for one day</h2>
<p>Choose one small behaviour that expresses your mission: teach someone something useful; solve a problem; mentor someone; create a useful resource; improve a process; help someone make progress; share useful knowledge; test an idea; or create something that provides value.</p>
${block("exercise", "d27-live")}

<h2>Day 27 reflection</h2>
${block("exercise", "d27-reflection")}

<h2>Day 27 quiz</h2>
${block("quiz")}

<h2>Day 27 assignment — My Personal Mission Statement</h2>
<p>Your Mission Builder (what you care about, strengths, experiences, problems, people and value) and your three statements with your chosen working mission are part of this submission. Add the last two parts. Recommended length: 700–1,000 words in total.</p>
${block("exercise", "d27-assignment")}
`,
    exercises: [
      {
        exerciseId: "d27-builder",
        title: "The Mission Builder",
        fields: [
          field("care", "I care about…"),
          field("good-at", "I am good at…"),
          field("learned", "I have learned…"),
          field("notice", "I notice that…"),
          field("help", "I would like to help…"),
          field("value", "I could create value by…"),
          field("matters", "This matters to me because…"),
        ],
      },
      {
        exerciseId: "d27-missions",
        title: "My mission statements",
        fields: [
          field("simple", "Version 1 — Simple: I want to help ______ by ______."),
          field("expanded", "Version 2 — Expanded: I want to help ______ who experience ______ by using my strengths in ______ to ______."),
          field("personal", "Version 3 — Personal: I want my work and contribution to increasingly stand for ______."),
          field("working", "My selected working mission:"),
          field("why", "Why I selected it:"),
        ],
      },
      {
        exerciseId: "d27-live",
        title: "Living my mission for one day",
        fields: [
          field("behaviour", "The behaviour I chose:"),
          field("connected", "Did this action feel connected to the contribution I described?"),
          field("discovered", "What I discovered:"),
        ],
      },
      {
        exerciseId: "d27-reflection",
        title: "Day 27 reflection",
        fields: [
          field("visible", "If my mission became more visible in my daily life, I would…"),
          field("increase", "One behaviour I need to increase is…"),
          field("reduce", "One behaviour I need to reduce is…"),
          field("opportunity", "One opportunity I want to explore is…"),
          field("person", "One person or group I could help is…"),
        ],
      },
      {
        exerciseId: "d27-assignment",
        title: "My Personal Mission Statement — into action",
        fields: [
          field("ways", "Three ways I could express my mission through action:"),
          field("experiment", "One contribution experiment:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d27-ceo",
        title: "\"My mission is to become a CEO\"",
        question: "What is the key issue?",
        options: [
          "Being a CEO is always a bad goal.",
          "Being a CEO automatically defines someone's contribution.",
          "A role does not necessarily explain the value or contribution the person wants to create.",
          "The learner should ask AI to choose another career.",
        ],
        answer: 2,
        explanation: "A role can be part of a person's path, but a mission focuses on the value they want to create.",
      },
    ],
    coaches: [
      {
        coachId: "d27-mission",
        title: "AI Mission Reflection Partner",
        intro: "Finds themes in your answers and drafts three possible mission statements based only on what you wrote — with what each emphasises, leaves out and assumes.",
        usesExercises: ["d27-builder", "d26-map"],
        promptTemplate:
          "Here are my responses:\n\n[PASTE YOUR ANSWERS]\n\nHelp me identify the recurring themes around:\n\n- what I care about;\n- strengths I want to use;\n- people I may want to help;\n- problems I am interested in;\n- value I may want to create.\n\nDraft three possible mission statements based only on the information I provided.\n\nDo not tell me which mission to choose.\n\nFor each statement, identify:\n\n- what it emphasises;\n- what it leaves out;\n- what assumptions it contains;\n- one real-world experiment that could help me explore it.\n\nI will make the final decision.",
        systemPrompt:
          "Exercise: Day 27 — mission reflection partner. From the learner's Mission Builder (and Contribution Map if included), identify recurring themes: what they care about, strengths they want to use, people they may want to help, problems they're interested in, value they may want to create. Draft three mission statements using the BSOE Mission Framework (I want to help… by… to… because…), grounded only in their words — no invented causes, no job titles as missions. For each: what it emphasises, what it leaves out, assumptions, one small real-world experiment. Check each against meaningful, useful, flexible, actionable, honest. Never choose for them or call any statement their 'true purpose'; remind them it's a compass, not a cage.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a mission primarily about?", ["A job title", "The value you want to create", "Your salary", "Your qualifications"],
        1, "Roles are ways of expressing a mission; the mission is the value."),
      q("Why should a mission be flexible?",
        ["Because nothing matters", "Because the form of your contribution may change over time", "Because goals are unnecessary", "Because decisions should be avoided"],
        1, "A compass, not a cage."),
      q("Which is closer to a mission?", ["Become a manager", "Earn £100,000", "Help people develop practical skills and opportunities", "Become famous"],
        2, "It names who is helped and what value is created."),
      q("What makes a mission useful?", ["It sounds impressive", "It guides meaningful action", "It guarantees success", "It never changes"],
        1, "A mission without action is simply a sentence."),
      q("What should happen after creating a mission statement?",
        ["Treat it as a permanent prediction", "Test how it can be expressed through real behaviour", "Stop exploring", "Ask AI to make all future decisions"],
        1, "Live it for a day — then learn from what happens."),
    ],
  },

  // ---------------------------------------------------------------- module 9 assessment
  {
    lessonId: "m9-assessment",
    title: "Module 9 · Calling & Contribution Assessment",
    lessonOrder: 45,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 25–27 together in your 50-mark assessment and 7-day contribution challenge.",
    contentBody: `
<h2>Module 9 — 50-mark assessment: Discover Your Calling &amp; Contribution</h2>
<p>Your daily work from Days 25–27 is a good starting point.</p>

<h2>Section A — Strengths &amp; evidence (10 marks)</h2>
<p>Identify meaningful strengths and support them with evidence.</p>
${block("exercise", "m9-part-a")}

<h2>Section B — Experience &amp; perspective (10 marks)</h2>
<p>Identify experiences and explain how they have shaped your skills, interests or values.</p>
${block("exercise", "m9-part-b")}

<h2>Section C — Contribution Map (10 marks)</h2>
<p>Connect strengths, knowledge, experience and needs to possible areas of contribution. <strong>Your Day 26 Contribution Map and three contribution possibilities are submitted for this section</strong> — review and update them on the Day 26 page.</p>

<h2>Section D — Mission statement (10 marks)</h2>
<p>Create a clear, meaningful and flexible mission statement. <strong>Your Day 27 mission statements and selected working mission are submitted for this section</strong> — review and update them on the Day 27 page.</p>

<h2>Section E — Contribution experiment (10 marks)</h2>
<p>Identify or complete a practical experiment that explores your possible contribution.</p>
${block("exercise", "m9-part-e")}

<h2>Assessment performance</h2>
${table(["Score", "Performance"], [["40–50", "Strong Application"], ["30–39", "Developing Application"], ["20–29", "Foundation Level"], ["Below 20", "Review Days 25–27"]])}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Sections A–E, including your Day 26 map and Day 27 mission. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m9-assessment-review")}

<h2>Your Module 9 submission</h2>
${block("portfolio")}

<h2>The 7-day contribution challenge — find one way to be useful every day</h2>
<p>For seven days, deliberately create value for someone else. It can be small.</p>
${block("exercise", "m9-log")}
<p>At the end of seven days, answer:</p>
${block("exercise", "m9-log-reflection")}

<h2>Module 9 integration</h2>
<p>Your journey is now moving from internal transformation towards external contribution.</p>
${table(["Module", "Flow"], [
  ["Module 8", "Vision → Clarity → Plan → Action → Project → Evidence"],
  ["Module 9", "Strengths → Experience → Need → Contribution → Mission → Action"],
])}
<p>Together: <strong>Discover → Connect → Contribute → Test → Learn → Refine.</strong></p>
<p>You do not need to discover one perfect answer. You need to become increasingly aware of what you can offer; what you care about; what problems matter to you; who could benefit; what you can test; and what you learn from experience.</p>

<h2>AI principle for Module 9</h2>
${table(["AI can help you", "You remain responsible for"], [
  ["Identify patterns · structure reflection · generate possibilities · compare themes · ask questions · explore contribution options", "Values · choices · purpose · commitment · action · real-world testing"],
])}
<blockquote><p>AI can help you explore your direction. It should not become the authority that defines your life.</p></blockquote>

<h2>Module 9 outputs</h2>
<ol>
<li>Module 9 Diagnostic</li>
<li>Strengths &amp; Energy Audit</li>
<li>Five Strengths With Evidence</li>
<li>Three-Person Strength Feedback</li>
<li>Strengths &amp; Energy Report</li>
<li>Contribution Map</li>
<li>Contribution Possibilities</li>
<li>Contribution Experiment</li>
<li>Personal Mission Statement</li>
<li>Seven-Day Contribution Challenge</li>
<li>Contribution Reflection</li>
<li>50-Mark Calling &amp; Contribution Assessment</li>
</ol>

<h2>The Become Extra Ordinary journey</h2>
${flow([
  "Module 1 — Wake Up: What is happening in my life?",
  "Module 2 — Understand: How do I process what happens?",
  "Module 3 — Transform: Who am I becoming?",
  "Module 4 — Design: What kind of life will support that person?",
  "Module 5 — The Steady Mind: How do I remain intentional when circumstances challenge me?",
  "Module 6 — Turn Failure Into Fuel: How do I use setbacks as information?",
  "Module 7 — Develop Intuition, Creativity & Insight: What possibilities am I currently overlooking?",
  "Module 8 — Turn Vision Into Reality: What am I prepared to create, test or change?",
  "Module 9 — Discover Your Calling & Contribution: What can I contribute — and what do I want my contribution to stand for?",
  "Module 10 — Become Extra Ordinary: How will I turn everything I have discovered into the way I live from this point forward?",
])}

<h2>Into Module 10</h2>
<blockquote><p>Your calling does not have to be discovered before you act. Sometimes action is how you discover it.</p></blockquote>
<p>The final module brings together the entire 30-day journey: <strong>Awareness → Identity → Vision → Resilience → Creativity → Action → Contribution → Personal Blueprint.</strong></p>
<p>You move from asking <em>"What could my life become?"</em> to: <strong>"What am I going to do differently from this day forward?"</strong></p>
`,
    exercises: [
      {
        exerciseId: "m9-part-a",
        title: "Section A — Strengths & evidence",
        table: {
          columns: ["Strength", "Source (skill / character / experience / knowledge / perspective)", "Evidence", "Where it could create value"],
          rows: numbered("Strength", 5),
        },
      },
      {
        exerciseId: "m9-part-b",
        title: "Section B — Experience & perspective",
        table: {
          columns: ["Experience", "What it taught me", "How it shaped my skills, interests or values", "What I now notice that others may not"],
          rows: numbered("Experience", 3),
        },
      },
      {
        exerciseId: "m9-part-e",
        title: "Section E — Contribution experiment",
        fields: [
          field("direction", "The contribution direction I am exploring:"),
          field("assumption", "The assumption I am testing:"),
          field("experiment", "The experiment (what, who, when):"),
          field("evidence", "Evidence I collected or will collect:"),
          field("happened", "What happened (if completed):"),
          field("learned", "What I learned, and my next step:"),
        ],
      },
      {
        exerciseId: "m9-log",
        title: "My 7-day contribution log",
        table: {
          columns: ["Who did I help?", "What did I do?", "What value did I create?", "What did I learn?"],
          rows: numbered("Day", 7),
        },
      },
      {
        exerciseId: "m9-log-reflection",
        title: "End-of-week review",
        fields: [
          field("natural", "1. Which contribution felt most natural?"),
          field("effort", "2. Which required the most effort?"),
          field("clearest", "3. Which created the clearest value?"),
          field("positive", "4. What did people respond positively to?"),
          field("myself", "5. What did I learn about myself?"),
          field("strength", "6. What strength did I use?"),
          field("explore", "7. What contribution might I explore further?"),
        ],
      },
    ],
    coaches: [
      {
        coachId: "m9-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Sections A–E, including your Day 26 Contribution Map and Day 27 mission. Its marks are indicative only.",
        usesExercises: ["m9-part-a", "m9-part-b", "d26-map", "d26-possibilities", "d27-missions", "m9-part-e"],
        promptTemplate:
          "Please review my Module 9 assessment, Discover Your Calling & Contribution (Sections A–E, 10 marks each). Section C is my Contribution Map and possibilities; Section D is my mission statements.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each section, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 9 assessment review (formative). Sections, 10 marks each. Use these indicative criteria (2 marks each):\nA Strengths & evidence — meaningful strengths identified; range of sources (skills, character, experience, knowledge, perspective); specific evidence for each; transferability recognised; link to where value could be created.\nB Experience & perspective — relevant experiences identified; what each taught; clear link to skills, interests or values; perspective articulated; reflective depth.\nC Contribution Map (Day 26 map + three possibilities) — strengths/knowledge/experience connected; real needs or problems identified; beneficiaries named; three distinct possibilities; assumptions stated.\nD Mission statement (Day 27) — clear who/how/outcome/why; meaningful and honest; useful to others; flexible (not a job title); actionable, with a reasoned choice of working mission.\nE Contribution experiment — clear direction; assumption being tested; practical, proportionate experiment; evidence defined; learning/next step.\nFor each section give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty sections score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 25–27). State clearly that marks are indicative and the tutor gives the final mark. Assess the quality of reflection and application, never the worth of the learner's values or chosen direction. Do not rewrite their work or propose a different mission.",
      },
    ],
    portfolio: [
      { exerciseId: "m9-part-a", title: "Section A — Strengths & evidence (10 marks)", lessonId: "m9-assessment" },
      { exerciseId: "m9-part-b", title: "Section B — Experience & perspective (10 marks)", lessonId: "m9-assessment" },
      { exerciseId: "d26-map", title: "Section C — Contribution Map (10 marks)", lessonId: "m9-day-26" },
      { exerciseId: "d26-possibilities", title: "Section C — three contribution possibilities", lessonId: "m9-day-26" },
      { exerciseId: "d27-missions", title: "Section D — Mission statement (10 marks)", lessonId: "m9-day-27" },
      { exerciseId: "m9-part-e", title: "Section E — Contribution experiment (10 marks)", lessonId: "m9-assessment" },
      { exerciseId: "m9-diagnostic", title: "Module 9 Diagnostic", lessonId: "m9-intro" },
      { exerciseId: "d25-audit", title: "Strengths & Energy Audit (Day 25)", lessonId: "m9-day-25" },
      { exerciseId: "d25-top5", title: "Five Strengths With Evidence (Day 25)", lessonId: "m9-day-25" },
      { exerciseId: "d25-feedback", title: "Three-Person Strength Feedback (Day 25)", lessonId: "m9-day-25" },
      { exerciseId: "d25-assignment", title: "Strengths & Energy Report (Day 25)", lessonId: "m9-day-25" },
      { exerciseId: "d26-experiment", title: "Contribution Experiment (Day 26)", lessonId: "m9-day-26" },
      { exerciseId: "d27-assignment", title: "Mission into action (Day 27)", lessonId: "m9-day-27" },
      { exerciseId: "m9-log", title: "Seven-Day Contribution Challenge", lessonId: "m9-assessment" },
      { exerciseId: "m9-log-reflection", title: "Contribution Reflection", lessonId: "m9-assessment" },
    ],
  },
];
