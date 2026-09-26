// Become Extra Ordinary — Module 3: Transform Your Identity (Days 7–9).
// Same lesson format as Modules 1–2 (see become-extra-ordinary.js). The
// HeyGen teaching-video scripts are shown as text until the videos exist.

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
const QUIZ_BANDS = [
  { min: 5, max: 5, title: "Excellent" },
  { min: 4, max: 4, title: "Strong understanding" },
  { min: 3, max: 3, title: "Developing" },
  { min: 0, max: 2, title: "Review today's lesson" },
];
const table = (head, rowsHtml) =>
  `<table><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr>${rowsHtml
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</table>`;

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m3-intro",
    title: "Module 3 · Transform Your Identity",
    lessonOrder: 11,
    duration: "15 minutes",
    objective: "From \"who I have been\" to \"who I am becoming\" — and a starting-point diagnostic.",
    contentBody: `
<h2>Remember the BSOE framework</h2>
<p>By now you should be able to recall this without the course:</p>
${flow(["BELIEF", "THOUGHT", "EMOTION", "DECISION", "ACTION", "RESULT", "LEARNING"])}
<p>And when something difficult happens:</p>
<blockquote><p>STOP → NOTICE → NAME → CHECK → CHOOSE → ACT</p></blockquote>
<p>This framework runs through all 30 days.</p>

<h2>Module 3 — Transform Your Identity</h2>
<p><strong>Days 7–9 · Theme: from "Who I Have Been" to "Who I Am Becoming"</strong></p>
<blockquote><p>Who are you becoming — and are your daily actions consistent with that person?</p></blockquote>

<h2>Module overview</h2>
<p>The previous module explored your <strong>Personal Operating System</strong>: Event → Interpretation → Thought → Emotion → Decision → Action → Result → Learning.</p>
<p>Module 3 takes the next step. Before people consistently change their behaviour, they often need to reconsider the story they have about <strong>who they are</strong>.</p>
<p>People commonly describe themselves through their job, their education, their family role, their nationality, their past, their achievements, their failures, their personality, their circumstances — and labels other people have given them.</p>
<p>But identity is not only about what has already happened. It can also involve <strong>the person you are choosing to become.</strong></p>
<p>This module introduces <strong>Identity by Design</strong>. Instead of asking only <em>"What do I want to achieve?"</em>, you begin asking <em>"Who would I need to become to make that possible?"</em></p>

<h2>Module learning outcomes</h2>
<p>By the end of Module 3, you will be able to:</p>
<ol>
<li>Identify the different identities you currently carry.</li>
<li>Distinguish between identity, role, behaviour, skill and label.</li>
<li>Recognise identities that were inherited rather than consciously chosen.</li>
<li>Describe the characteristics of a future version of yourself.</li>
<li>Connect future identity with specific behaviours.</li>
<li>Convert outcome-based goals into identity-based goals.</li>
<li>Use AI as a structured reflection and identity-design partner.</li>
<li>Create a practical <strong>Future Self Profile</strong>.</li>
<li>Develop an <strong>Identity-Based Action Plan</strong>.</li>
</ol>

<h2>Module 3 diagnostic — Identity &amp; Personal Growth</h2>
<p>Before beginning Day 7, rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m3-diagnostic")}
<p><strong>Important:</strong> this is a learning exercise, not a psychological assessment or diagnosis.</p>
`,
    exercises: [
      {
        exerciseId: "m3-diagnostic",
        title: "Identity & Personal Growth Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Identity Awareness",
              statements: [
                "I can describe who I am beyond my job or qualifications.",
                "I understand which roles are important to me.",
                "I can identify strengths I consistently demonstrate.",
                "I recognise labels I have placed on myself.",
                "I can identify labels other people have placed on me.",
              ],
            },
            {
              title: "Identity Flexibility",
              statements: [
                "I believe people can change significantly over time.",
                "I am willing to reconsider an old description of myself.",
                "I can separate my past behaviour from my future potential.",
                "I can recognise that one failure does not define my identity.",
                "I can imagine becoming someone significantly different from who I am today.",
              ],
            },
            {
              title: "Identity in Action",
              statements: [
                "My daily behaviour reflects the person I want to become.",
                "I make decisions based on my longer-term identity.",
                "I practise skills associated with the person I want to become.",
                "I deliberately place myself in situations that help me grow.",
                "I can describe one action I am taking today because of the person I want to become.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 30, title: "Identity Awareness Starting Point", text: "You may benefit from spending more time identifying the assumptions and labels that shape your current identity." },
            { min: 31, max: 45, title: "Developing Identity Awareness", text: "You are beginning to recognise the relationship between identity and behaviour." },
            { min: 46, max: 60, title: "Strong Identity Awareness", text: "You have a developing understanding of how identity influences your choices." },
            { min: 61, max: 75, title: "Identity by Design", text: "You demonstrate strong awareness of the connection between identity, behaviour and future direction." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 7
  {
    lessonId: "m3-day-7",
    title: "Module 3 · Day 7 — Your Current Identity",
    lessonOrder: 12,
    duration: "60–75 minutes",
    objective: "Describe yourself beyond your job, qualifications or past — and see which parts you chose.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>Who are you when nobody is asking for your job title?</p></blockquote>
${talk("Who Are You?", `
Most people can tell you what they do.

"I am a teacher." "I am a student." "I am a parent." "I am an entrepreneur." "I work in finance." "I am looking for a job."

But these descriptions tell only part of the story.

Your job is a role. Your qualification is an achievement. Your circumstances describe your current situation.

None of these necessarily describes the full person you are capable of becoming.

Think about the different identities you carry. You may be a learner, a friend, a problem solver, a leader, a creator, a caregiver, an organiser, a builder or someone who brings people together.

You may also carry labels that you did not choose. Perhaps someone once told you that you were not academic. Perhaps you were told that you were too quiet. Perhaps you failed at something and began thinking of yourself as a failure. Perhaps you have spent years believing: "That is just not who I am."

But consider this. A behaviour can change. A skill can develop. A habit can be replaced. A role can change. A belief can be questioned. And therefore, the description you have of yourself can also evolve.

Today's exercise is not about pretending to be someone you are not. It is about discovering which parts of your identity are genuinely yours — and which parts may simply be old descriptions.

Your challenge today is simple: describe yourself without reducing yourself to your job, your qualifications or your past.

Then ask: <strong>Which parts of my identity have I consciously chosen?</strong> And: <strong>Which parts might be ready to evolve?</strong>

That is where transformation begins.`)}

<h2>Reading — Identity is more than a label</h2>
<p>Imagine meeting someone for the first time. You ask: <em>"Tell me about yourself."</em> They might respond: <em>"I'm an accountant."</em></p>
<p>That answer may be accurate. But it does not tell you everything about the person. They could also be curious, creative, ambitious, compassionate, analytical, resilient, adventurous, entrepreneurial, patient, determined or community-minded.</p>
<p>The danger of defining ourselves too narrowly is that we can begin behaving according to the label.</p>
<ul>
<li><em>"I'm not a creative person."</em> — the person may stop generating ideas.</li>
<li><em>"I'm not good with technology."</em> — they may avoid learning digital tools.</li>
<li><em>"I'm not a leader."</em> — they may avoid opportunities to lead.</li>
</ul>
<p>The statement begins as a description. Eventually, it can become a limitation.</p>

<h2>Identity has layers</h2>
<ol>
<li><strong>Roles</strong> — student, employee, manager, parent, friend, volunteer.</li>
<li><strong>Skills</strong> — communication, writing, analysis, teaching, organisation, problem solving.</li>
<li><strong>Strengths</strong> — persistence, curiosity, empathy, courage, reliability, creativity.</li>
<li><strong>Values</strong> — freedom, family, learning, contribution, integrity, achievement.</li>
<li><strong>Beliefs about yourself</strong> — "I am capable." "I am not good with money." "I learn quickly." "I am not confident." "People like me don't become entrepreneurs."</li>
<li><strong>Aspirational identity</strong> — the person you are becoming: "I am becoming a confident communicator." "I am becoming a technology-enabled professional." "I am becoming an entrepreneur." "I am becoming a community leader."</li>
</ol>

<h2>The Identity Inventory</h2>
${block("exercise", "d7-inventory")}

<h2>The Identity Filter</h2>
<p>For each important identity, ask: Did I choose this? Did someone else give me this label? Is this still accurate? Does this identity help me? Does this identity limit me? What evidence supports it? What evidence challenges it? Would I describe myself differently five years from now?</p>
${block("exercise", "d7-filter")}

<h2>Interactive example — Meet David</h2>
<p>David describes himself as <em>"Just an administrator."</em> He has worked in administration for six years. When asked about his strengths, he initially says: <em>"I don't really have any special skills."</em></p>
<p>After examining his work, he discovers that he organises complex schedules, communicates with customers, manages confidential information, solves problems, creates reports, trains new employees and improves inefficient processes.</p>
<p>His identity changes from <strong>"I'm just an administrator."</strong> to <strong>"I am an organised problem solver with strong communication and process-management skills."</strong></p>
<p>The second statement does not exaggerate his experience. It describes it more accurately. That new identity also opens possibilities: project coordination, operations, customer success, business administration, process improvement and digital transformation.</p>
<blockquote><p>Sometimes transformation does not begin by acquiring a completely new identity. It begins by seeing your existing identity more accurately.</p></blockquote>

<h2>Case study — Sarah's "I'm not a leader" story</h2>
<p>Sarah works in a small organisation. She regularly helps colleagues solve problems. She trains new staff. People ask her for advice. When a project becomes difficult, she often becomes the person who organises the response.</p>
<p>Yet Sarah does not consider herself a leader. Her explanation is: <em>"I'm not a manager."</em></p>
<p>This creates an important distinction: <strong>management and leadership are not identical.</strong> Sarah has already demonstrated several leadership behaviours. The missing step is recognising them.</p>
${table(["Evidence", "What it shows"], [
  ["Trains new employees", "Developing others"],
  ["Organises difficult projects", "Coordination"],
  ["Helps colleagues", "Support"],
  ["Solves problems", "Initiative"],
  ["People seek her advice", "Influence"],
])}
<p>Sarah does not need to pretend she is already an executive. Instead, she can develop an identity such as <strong>"I am becoming a person who leads through initiative, communication and service."</strong> She can then test that identity through behaviour.</p>

<h2>Learner activity — The "I Am" exercise</h2>
<p>Complete <strong>"I am…"</strong> 20 times. Do not overthink your answers (for example: I am a learner. I am a parent. I am a problem solver. I am sometimes cautious. I am curious. I am someone who values family. I am becoming more confident.)</p>
<p>Then classify each: <strong>R</strong> = Role, <strong>S</strong> = Skill, <strong>T</strong> = Trait/strength, <strong>V</strong> = Value, <strong>B</strong> = Belief, <strong>A</strong> = Aspiration.</p>
${block("exercise", "d7-i-am")}
${block("exercise", "d7-i-am-review")}

<h2>AI practical exercise — AI Identity Reflection Partner</h2>
<p>AI should not decide who you are. Instead, use it to help you examine your own evidence. Your partner can bring in your "I am" statements.</p>
${block("coach", "d7-identity-partner")}
${block("exercise", "d7-ai-reflection")}

<h2>Scenario-based activity</h2>
<p>James says: <em>"I'm not entrepreneurial. People like me don't start businesses."</em></p>
<p>However, James regularly identifies problems at work, has created small solutions for colleagues, enjoys finding ways to save time, has sold products informally to friends, and is interested in developing an online service.</p>
${block("scenario", "d7-james")}

<h2>Real-world challenge — Act like the person you are becoming</h2>
<p>Choose one identity you want to strengthen — for example <em>"I am becoming a confident communicator"</em>, <em>"a healthier person"</em>, <em>"an entrepreneur"</em> or <em>"a better leader"</em>. Do this once today.</p>
${block("exercise", "d7-challenge")}

<h2>Day 7 reflection</h2>
${block("exercise", "d7-reflection")}

<h2>Day 7 quiz</h2>
${block("quiz")}

<h2>Day 7 assignment — Identity Inventory Report</h2>
${block("exercise", "d7-assignment")}
<p><strong>Day 7 output:</strong> My Identity Inventory, plus one identity I want to strengthen.</p>
`,
    quizBands: QUIZ_BANDS,
    exercises: [
      {
        exerciseId: "d7-inventory",
        title: "My Identity Inventory",
        fields: [
          "Roles I currently have", "Skills I have developed", "Strengths I demonstrate", "Values important to me",
          "Things I enjoy doing", "Problems I enjoy solving", "Labels I have accepted", "Labels others have given me",
          "Things I believe I cannot do", "Things I would like to become",
        ].map((label, i) => ({ id: `c${i + 1}`, label, type: "textarea" })),
      },
      {
        exerciseId: "d7-filter",
        title: "The Identity Filter",
        intro: "Apply the filter to up to three important identities.",
        table: {
          columns: [
            "Identity", "Did I choose this?", "Did someone else give me this label?", "Is this still accurate?",
            "Does this identity help me?", "Does this identity limit me?", "What evidence supports it?",
            "What evidence challenges it?", "Would I describe myself differently five years from now?",
          ],
          rows: ["Identity 1", "Identity 2", "Identity 3"],
        },
      },
      {
        exerciseId: "d7-i-am",
        title: "I am…",
        table: { columns: ["I am…", "Type (R / S / T / V / B / A)"], rows: Array.from({ length: 20 }, (_, i) => `${i + 1}`) },
      },
      {
        exerciseId: "d7-i-am-review",
        title: "What my \"I am\" statements show",
        fields: [
          { id: "strengthen", label: "Three identities I want to strengthen:", type: "textarea" },
          { id: "question", label: "Three identities I want to question:", type: "textarea" },
          { id: "unexamined", label: "One identity I may have accepted without examining:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d7-ai-reflection",
        title: "AI reflection question",
        fields: [{ id: "overlooked", label: "What did I discover about myself that I had previously overlooked?", type: "textarea" }],
      },
      {
        exerciseId: "d7-challenge",
        title: "Act like the person you are becoming",
        fields: [
          { id: "identity", label: "The identity I want to strengthen:", type: "text" },
          { id: "behaviour", label: "One behaviour this person would demonstrate:", type: "textarea" },
          { id: "when", label: "When I will practise it:", type: "text" },
          { id: "evidence", label: "Evidence that I did it:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d7-reflection",
        title: "Day 7 reflection",
        fields: [
          { id: "defines", label: "1. What identity currently defines me most strongly?", type: "textarea" },
          { id: "proud", label: "2. Which identity am I proud of?", type: "textarea" },
          { id: "limiting", label: "3. Which identity may be limiting me?", type: "textarea" },
          { id: "unquestioned", label: "4. Which identity have I accepted without questioning?", type: "textarea" },
          { id: "develop", label: "5. What identity would I like to develop?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d7-assignment",
        title: "Identity Inventory Report",
        intro:
          "Address: 1. How would you describe your current identity? 2. Which identities are roles? 3. Which are genuine strengths? 4. Which labels may have been inherited from other people? 5. Which identity currently limits you? 6. What evidence challenges that limitation? 7. What identity would you like to develop? Evidence standard: use specific examples — not \"I am confident\" but \"I demonstrated confidence when I…\".",
        fields: [{ id: "report", label: "My Identity Inventory Report (300–500 words)", type: "textarea", minWords: 300, maxWords: 500 }],
      },
    ],
    scenarios: [
      {
        scenarioId: "d7-james",
        title: "James",
        question: "What should James do first?",
        options: [
          "Immediately quit his job.",
          "Tell himself he is already a successful entrepreneur.",
          "Examine the evidence behind his current identity and test entrepreneurial behaviour through a small experiment.",
          "Wait until he feels completely confident.",
        ],
        answer: 2,
        explanation:
          "Identity development does not require pretending. James can test whether entrepreneurial behaviours fit him by taking a small, measurable action — and the evidence from that experiment can inform his understanding of himself.",
      },
    ],
    coaches: [
      {
        coachId: "d7-identity-partner",
        title: "AI Identity Reflection Partner",
        intro: "Examines your \"I am\" statements with you, one question at a time. It won't decide who you are.",
        usesExercises: ["d7-i-am"],
        promptTemplate:
          "Act as a neutral reflective thinking partner.\n\nI am completing an identity exercise.\n\nHere are some statements beginning with \"I am\":\n\n[PASTE YOUR ANSWERS]\n\nFor each statement:\n\n1. Ask me whether it is a role, skill, strength, value, belief, behaviour or aspiration.\n2. Ask me what evidence supports it.\n3. Ask whether it was consciously chosen or inherited from other people's expectations.\n4. Ask whether it currently helps or limits me.\n5. Ask whether there is a more accurate way to describe it.\n\nDo not diagnose me.\n\nDo not tell me who I should become.\n\nDo not make decisions for me.\n\nYour role is to help me examine my own evidence and think more clearly.\n\nAsk one question at a time.",
        systemPrompt:
          "Exercise: Day 7 — AI Identity Reflection Partner. Work through the learner's \"I am\" statements. Ask exactly ONE question per message, following the five steps for each statement (type; evidence; chosen or inherited; helps or limits; a more accurate description). Start with the statement that seems most significant or most limiting, and ask the learner if they'd like to choose a different one. Never diagnose, never tell them who they should become, never decide for them. Offer a more accurate description only as a question (\"Would it be more accurate to say…?\").",
      },
    ],
    quiz: [
      q("Which statement best describes identity?",
        ["Only your job title", "Only your personality", "A combination of roles, skills, values, beliefs, behaviours and aspirations", "Your qualifications only"],
        2, "Identity has layers — roles, skills, strengths, values, beliefs about yourself, and the person you are becoming."),
      q("Which statement demonstrates an identity-based limitation?",
        ["\"I need to improve my presentation skills.\"", "\"I am practising public speaking.\"", "\"I am learning to communicate more confidently.\"", "\"I am not the kind of person who can speak publicly.\""],
        3, "\"I am not the kind of person who…\" turns a current skill level into a fixed identity — a description that becomes a limitation."),
      q("What is the most useful response to a restrictive identity label?",
        ["Ignore all evidence.", "Pretend the opposite is true.", "Examine the evidence and test whether the label is still accurate.", "Let somebody else decide your identity."],
        2, "Neither accepting nor pretending — examine the evidence and test the label through behaviour."),
      q("Which is an aspirational identity?",
        ["\"I work in administration.\"", "\"I am a parent.\"", "\"I am becoming a confident leader.\"", "\"I completed university.\""],
        2, "\"I am becoming…\" describes the person you are developing into, not your current role or past achievement."),
      q("Why is behaviour important when developing identity?",
        ["Because identity should remain theoretical.", "Because repeated behaviour provides evidence about the person we are becoming.", "Because behaviour cannot change.", "Because other people must approve our identity."],
        1, "Behaviour creates evidence. Repeated behaviour is how an aspirational identity becomes real."),
    ],
  },

  // ---------------------------------------------------------------- day 8
  {
    lessonId: "m3-day-8",
    title: "Module 3 · Day 8 — Your Future Self",
    lessonOrder: 13,
    duration: "60–75 minutes",
    objective: "Create a realistic, specific picture of the person you could become in five years.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>If you continued developing intentionally for the next five years, who could you become?</p></blockquote>
${talk("Meet Your Future Self", `
Imagine meeting yourself five years from now.

Not a fantasy version of yourself. Not a perfect person. A realistic version of you who has spent five years learning, experimenting, making decisions and growing.

Where are you? What are you doing? What skills have you developed? Who do you spend time with? What problems can you solve now that you cannot solve today? What have you stopped doing? What are you no longer afraid to attempt?

The purpose of imagining your future self is not to predict the future. It is to create direction.

A destination does not guarantee that you will arrive there. But without a direction, you may simply repeat yesterday.

Your future self can therefore become a useful question: "If this is the person I want to become, what would that person begin doing now?"

Your future is not created in one dramatic moment. It is built through repeated decisions.

So today, meet the person you could become. Then look for the first step that person would take today.`)}

<h2>Reading — Your future self</h2>
<p>Your future self is not a prediction. It is a <strong>working possibility</strong>.</p>
<p>You do not need to know exactly what your life will look like in five years. Instead, identify capabilities, values, behaviours, relationships, contribution, lifestyle, experiences, type of work and the problems you want to solve.</p>
<p>The future becomes more useful when it becomes specific enough to influence today's behaviour.</p>

<h2>The Future Self Profile</h2>
<p>Imagine yourself approximately five years from now.</p>
${block("exercise", "d8-profile")}

<h2>Interactive example — From wish to future identity</h2>
<p>A learner says: <em>"I want to be successful."</em> This is too vague to guide behaviour. We can turn it into questions.</p>
<p><strong>What does success mean?</strong> Perhaps: <em>"I want meaningful work, financial stability, continuous learning and the ability to help others."</em></p>
<p><strong>Future identity:</strong> <em>"I am becoming a financially capable professional who creates useful solutions and helps others develop."</em></p>
<p><strong>Skills that would support it:</strong> communication, financial literacy, digital skills, leadership, problem solving.</p>
<p><strong>Behaviours that would support it:</strong> learning every week, building projects, networking, managing money, seeking feedback.</p>
<p>The future has now become connected to action.</p>

<h2>Case study — Michael's five-year future</h2>
<p>Michael is 24 and currently works in a role he does not find particularly meaningful. Initially he writes: <em>"In five years I want to be rich."</em></p>
<p>After deeper reflection, he identifies what he actually wants: meaningful work, independence, strong digital skills, the ability to work internationally, enough income to support his family, and opportunities to build something of his own.</p>
<p>His future self statement becomes: <strong>"I am a digitally skilled professional and entrepreneur who creates useful solutions, works with people internationally and has financial independence."</strong></p>
<p>This changes his questions. Instead of <em>"How can I get rich?"</em> he starts asking <em>"What skills would make this future possible?"</em> — which leads to learning AI tools, improving communication, building small projects, studying business, developing a portfolio and testing ideas.</p>
<p>The future self has become a filter for today's decisions.</p>

<h2>Learner activity — The Future Tuesday</h2>
<p>Imagine it is an ordinary Tuesday approximately five years from now. Not your birthday. Not a holiday. Not your biggest achievement. Just an ordinary Tuesday. Write the story.</p>
${block("exercise", "d8-tuesday")}

<h2>AI practical exercise — Future Self Interview</h2>
<p>Use AI as an interviewer. It can see what you have written in your Future Self Profile so far.</p>
${block("coach", "d8-interview")}

<h2>Scenario-based activity</h2>
<p>Amaka says: <em>"In five years I want to have a better life."</em></p>
${block("scenario", "d8-amaka")}

<h2>Real-world challenge — Borrow one behaviour from your future self</h2>
<p>Ask: <em>"What would my future self probably do differently today?"</em> Choose one behaviour — spend 30 minutes learning, contact someone, exercise, create something, apply for an opportunity, organise finances, practise a skill or start a project. Do it today.</p>
${block("exercise", "d8-challenge")}

<h2>Day 8 reflection</h2>
${block("exercise", "d8-reflection")}

<h2>Day 8 quiz</h2>
${block("quiz")}

<h2>Day 8 assignment — Future Self Profile</h2>
${block("exercise", "d8-assignment")}
<p><strong>Day 8 output:</strong> My Future Self Profile. This becomes a major component of your <strong>Extraordinary Blueprint</strong> later in the course.</p>
`,
    quizBands: QUIZ_BANDS,
    exercises: [
      {
        exerciseId: "d8-profile",
        title: "My Future Self Profile (five years from now)",
        fields: [
          "Where am I living?", "What type of work am I doing?", "What skills have I developed?", "What am I known for?",
          "What problems can I solve?", "Who benefits from my work?", "What habits have I developed?", "What habits have I abandoned?",
          "What relationships matter most?", "What do I spend my time doing?", "What do I no longer worry about?",
          "What challenge am I proud of overcoming?", "What decision made the biggest difference?",
          "What would my future self thank me for starting today?",
        ].map((label, i) => ({ id: `f${i + 1}`, label, type: "textarea" })),
      },
      {
        exerciseId: "d8-tuesday",
        title: "My Future Tuesday",
        fields: [
          { id: "t0700", label: "7:00 AM — Where am I? What am I doing?", type: "textarea" },
          { id: "t0900", label: "9:00 AM — What does my work look like?", type: "textarea" },
          { id: "t1200", label: "12:00 PM — Who am I interacting with?", type: "textarea" },
          { id: "t1500", label: "3:00 PM — What problem am I solving?", type: "textarea" },
          { id: "t1800", label: "6:00 PM — What does my personal life look like?", type: "textarea" },
          { id: "t2100", label: "9:00 PM — What am I thinking about?", type: "textarea" },
          { id: "difference", label: "What is one thing my future Tuesday contains that my current life does not?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d8-challenge",
        title: "Borrow one behaviour from my future self",
        fields: [
          { id: "behaviour", label: "The behaviour I borrowed:", type: "textarea" },
          { id: "happened", label: "What happened when I did it:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d8-reflection",
        title: "Day 8 reflection",
        fields: [
          { id: "surprised", label: "1. What surprised me about my future self?", type: "textarea" },
          { id: "skills", label: "2. What skills will I need?", type: "textarea" },
          { id: "habits", label: "3. What habits will I need?", type: "textarea" },
          { id: "stop", label: "4. What will I probably need to stop doing?", type: "textarea" },
          { id: "start", label: "5. What can I start doing now?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d8-assignment",
        title: "Future Self Profile",
        intro:
          "Include: who you are becoming; where you are; what you do; skills you possess; habits you practise; people you help; values you demonstrate; challenges you have overcome; what you no longer tolerate; what your future self would thank your current self for beginning.",
        fields: [
          { id: "profile", label: "My Future Self Profile (500–700 words)", type: "textarea", minWords: 500, maxWords: 700 },
          { id: "first-evidence", label: "\"The first evidence that I am becoming this person will be…\"", type: "textarea" },
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d8-amaka",
        title: "Amaka",
        question: "Which question would create the most useful next step?",
        options: [
          "\"Why don't you already have a better life?\"",
          "\"What exactly would be different in your work, skills, relationships, finances and daily life?\"",
          "\"You should completely change your career.\"",
          "\"Just visualise success every day.\"",
        ],
        answer: 1,
        explanation:
          "A useful future vision needs enough detail to influence decisions. It does not need to be perfectly predictable — but \"a better life\" has to become specific before it can guide what Amaka does next.",
      },
    ],
    coaches: [
      {
        coachId: "d8-interview",
        title: "Future Self Interview",
        intro: "A neutral interviewer that asks one question at a time, challenges vague answers and summarises your future self — clearly separating your words from its suggestions.",
        usesExercises: ["d8-profile"],
        promptTemplate:
          "I am designing a realistic Future Self Profile.\n\nAct as a neutral interviewer.\n\nAsk me questions about the person I could become over the next five years.\n\nExplore:\n\n- skills\n- work\n- contribution\n- relationships\n- habits\n- learning\n- financial goals\n- creativity\n- health and wellbeing\n- experiences\n- values\n- problems I want to solve\n\nDo not create my future for me.\n\nAsk one question at a time.\n\nChallenge vague answers by asking for examples.\n\nAt the end, summarise my answers under:\n\n1. Future Identity\n2. Skills\n3. Behaviours\n4. Environment\n5. Contribution\n6. First three actions\n\nClearly separate what I said from any suggestions you make.\n\nHere is what I have written in my Future Self Profile so far:\n\n[PASTE YOUR ANSWERS]",
        systemPrompt:
          "Exercise: Day 8 — Future Self Interview. Interview the learner about the realistic person they could become in five years across skills, work, contribution, relationships, habits, learning, financial goals, creativity, health and wellbeing, experiences, values and problems they want to solve. Use what they've already written; focus questions on the areas that are missing or vague. Ask exactly ONE question per message. When an answer is vague, ask for a concrete example. Never invent their future. When they have covered the areas (or ask for the summary), summarise under: 1 Future Identity, 2 Skills, 3 Behaviours, 4 Environment, 5 Contribution, 6 First three actions — using their words, and put any ideas of your own in a separate, clearly labelled \"Suggestions (mine, not yours)\" section.",
      },
    ],
    quiz: [
      q("The purpose of a Future Self exercise is primarily to:",
        ["Predict exactly what will happen", "Create direction for present decisions", "Guarantee success", "Avoid uncertainty"],
        1, "Your future self is a working possibility — it creates direction for today's decisions, not a prediction."),
      q("Which future statement is most useful?",
        ["\"I want everything to be better.\"", "\"I want to be famous.\"", "\"I want to become a skilled professional who solves meaningful problems.\"", "\"I want life to become easier.\""],
        2, "It is specific enough to suggest skills and behaviours you can start practising."),
      q("Why imagine an ordinary future Tuesday?",
        ["To create unrealistic fantasy", "To make the future concrete enough to influence behaviour", "To avoid planning", "To predict exact events"],
        1, "An ordinary day shows what your life would actually contain — which makes the gap with today visible and actionable."),
      q("What connects a future identity to the present?",
        ["Repeated behaviour", "Luck", "Wishful thinking", "Other people's approval"],
        0, "Your future is built through repeated decisions and behaviour, starting now."),
      q("A useful future vision should be:",
        ["Completely fixed", "Detailed enough to guide action but flexible enough to evolve", "Impossible to change", "Based entirely on other people's expectations"],
        1, "Specific enough to shape today, open enough to update as you learn."),
    ],
  },

  // ---------------------------------------------------------------- day 9
  {
    lessonId: "m3-day-9",
    title: "Module 3 · Day 9 — Identity-Based Goals",
    lessonOrder: 14,
    duration: "60–75 minutes",
    objective: "Turn outcome goals into identity-based goals with behaviours that create evidence.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What would change if your goals were about who you are becoming rather than only what you want to achieve?</p></blockquote>
${talk("Identity-Based Goals", `
Most goals begin with: "I want to…"

I want to lose weight. I want a promotion. I want to start a business. I want to write a book. I want to become financially secure.

These goals can be useful. But there is another question: who would you need to become to make these outcomes more likely?

Instead of "I want to write a book," you might say: "I am becoming a writer."

Instead of "I want to start a business," you might say: "I am becoming an entrepreneur who solves real problems."

Instead of "I want to become a better leader," you might say: "I am becoming someone who communicates clearly, takes responsibility and helps others succeed."

The difference is important. An outcome is something you want to achieve. An identity is something you practise becoming.

When identity and behaviour connect, goals become more than wishes. They become experiments in becoming.

Today you will convert three goals into identity-based commitments. Then you will identify one behaviour that provides evidence for each identity.

Because ultimately: <strong>you do not become someone simply by saying it.</strong> You become through what you repeatedly practise.`)}

<h2>Reading — Outcome goals vs identity goals</h2>
${table(["Outcome goal", "Identity question", "Possible identity"], [
  ["\"I want to get a promotion.\"", "What kind of professional would be ready for greater responsibility?", "\"I am becoming a reliable professional who takes initiative and solves problems.\""],
  ["\"I want to start a business.\"", "What kind of person builds a sustainable business?", "\"I am becoming an entrepreneur who identifies problems, tests solutions and learns from customers.\""],
  ["\"I want to improve my employability.\"", "What kind of professional remains valuable as work changes?", "\"I am becoming a continuously learning, digitally capable professional.\""],
])}

<h2>The Identity → Behaviour → Evidence model</h2>
<blockquote><p>IDENTITY → BEHAVIOUR → EVIDENCE → REINFORCEMENT</p></blockquote>
<ul>
<li><strong>Identity:</strong> I am becoming a confident communicator.</li>
<li><strong>Behaviour:</strong> I practise explaining ideas clearly.</li>
<li><strong>Evidence:</strong> I deliver one short presentation.</li>
<li><strong>Reinforcement:</strong> I now have evidence that I can communicate publicly.</li>
</ul>
<p>This does not mean one action permanently changes identity. It means behaviour gives you evidence about the person you are becoming.</p>

<h2>Interactive example</h2>
<ul>
<li><strong>Goal:</strong> "I want to become a successful entrepreneur."</li>
<li><strong>Identity:</strong> "I am becoming a problem-solving entrepreneur."</li>
<li><strong>Behaviour:</strong> "I speak to potential customers every week."</li>
<li><strong>Evidence:</strong> "I completed five customer conversations."</li>
<li><strong>Learning:</strong> "Customers repeatedly mentioned the same problem."</li>
<li><strong>Next behaviour:</strong> "I will create a simple test solution."</li>
</ul>
<p>The identity has now become practical.</p>

<h2>Case study — Daniel wants to become a leader</h2>
<p>Daniel writes: <em>"Goal: Become a manager."</em> This is an outcome. He then asks: <em>"What identity would support that goal?"</em></p>
<p>He chooses: <strong>"I am becoming someone who takes responsibility, communicates clearly and helps others succeed."</strong></p>
<p>Now he identifies behaviours:</p>
<ol>
<li>Volunteer to coordinate a small project.</li>
<li>Help a colleague develop a skill.</li>
<li>Ask for feedback.</li>
<li>Practise communicating decisions clearly.</li>
<li>Take responsibility when something goes wrong.</li>
</ol>
<p>His promotion is still uncertain. But his development is no longer passive. He is practising the identity required for greater responsibility.</p>

<h2>Learner activity — Convert three goals</h2>
${block("exercise", "d9-convert")}

<h2>AI practical exercise — Identity-Based Goal Coach</h2>
<p>Your coach can bring in your three converted goals.</p>
${block("coach", "d9-goal-coach")}

<h2>Scenario-based activity — Which statement creates more useful action?</h2>
<p>A learner says: <em>"I want to become successful in business."</em></p>
${block("scenario", "d9-business")}

<h2>The 7-Day Identity Experiment</h2>
<p>Choose one identity. Each day, record what you did, when you did it, what happened, what you learned and what you will change.</p>
${block("exercise", "d9-experiment")}
${block("exercise", "d9-experiment-log")}

<h2>Identity Decision Filter</h2>
<p>When facing a decision, ask: <strong>"What would the person I am becoming do next?"</strong></p>
<p>This does not mean blindly doing what an imagined future version would do. It means using your chosen identity as <strong>one decision-making perspective</strong>. Then ask:</p>
<ol>
<li>What are the facts?</li>
<li>What are my options?</li>
<li>What are the risks?</li>
<li>What evidence do I have?</li>
<li>Which action is consistent with the person I want to become?</li>
<li>What can I test rather than assume?</li>
</ol>

<h2>Day 9 reflection</h2>
${block("exercise", "d9-reflection")}

<h2>Day 9 quiz</h2>
${block("quiz")}
`,
    quizBands: QUIZ_BANDS,
    exercises: [
      {
        exerciseId: "d9-convert",
        title: "Convert three goals",
        table: {
          columns: ["What I want", "Who would I need to become?", "One behaviour", "Evidence I can create"],
          rows: ["Goal 1", "Goal 2", "Goal 3"],
        },
      },
      {
        exerciseId: "d9-experiment",
        title: "My 7-Day Identity Experiment",
        fields: [
          { id: "identity", label: "My identity: \"I am becoming someone who…\"", type: "textarea" },
          { id: "behaviour", label: "The behaviour: \"Every day for seven days I will…\"", type: "textarea" },
        ],
      },
      {
        exerciseId: "d9-experiment-log",
        title: "Experiment log",
        table: {
          columns: ["What I did", "When I did it", "What happened", "What I learned", "What I will change"],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "d9-reflection",
        title: "Day 9 reflection",
        fields: [
          { id: "used-to", label: "I used to describe myself as:", type: "textarea" },
          { id: "beginning", label: "I am beginning to describe myself as:", type: "textarea" },
          { id: "strengthen", label: "One identity I want to strengthen is:", type: "textarea" },
          { id: "behaviour", label: "The behaviour that supports it is:", type: "textarea" },
          { id: "evidence", label: "The evidence I will create is:", type: "textarea" },
          { id: "obstacle", label: "The biggest obstacle will probably be:", type: "textarea" },
          { id: "response", label: "My response to that obstacle will be:", type: "textarea" },
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d9-business",
        title: "Successful in business",
        question: "Which is the strongest identity-based transformation?",
        options: [
          "\"I am going to become rich.\"",
          "\"I am becoming a person who identifies customer problems, tests solutions and learns from feedback.\"",
          "\"I am already a successful entrepreneur.\"",
          "\"I hope somebody gives me a business opportunity.\"",
        ],
        answer: 1,
        explanation: "The statement connects identity with behaviours that can actually be practised and observed.",
      },
    ],
    coaches: [
      {
        coachId: "d9-goal-coach",
        title: "Identity-Based Goal Coach",
        intro: "Explores the identity behind each of your goals and helps you turn one behaviour into a practical, measurable seven-day experiment.",
        usesExercises: ["d9-convert"],
        promptTemplate:
          "I have three goals:\n\n[PASTE YOUR ANSWERS]\n\nHelp me explore the identity behind each goal.\n\nFor each goal:\n\n1. Ask what I am trying to achieve.\n2. Ask why it matters.\n3. Ask what kind of person would be more capable of achieving it.\n4. Help me create an identity statement beginning: \"I am becoming someone who…\"\n5. Ask me to identify three behaviours that would provide evidence of this identity.\n6. Help me turn one behaviour into a seven-day experiment.\n\nDo not tell me which goal I should choose.\n\nDo not decide what my future should be.\n\nChallenge vague statements and ask me for evidence.\n\nKeep the final plan practical and measurable.",
        systemPrompt:
          "Exercise: Day 9 — Identity-Based Goal Coach. Take one goal at a time (ask which to start with). For each, ask one or two questions at a time: what they are trying to achieve, why it matters, what kind of person would be more capable of achieving it; then help them phrase \"I am becoming someone who…\" in their own words, ask for three behaviours that would create evidence, and help turn ONE behaviour into a seven-day experiment with a clear daily action, when it happens, how they'll record evidence, a likely obstacle and their response. Challenge vague statements by asking for specifics or evidence. Never choose the goal or decide their future.",
      },
    ],
    quiz: [
      q("What is an identity-based goal?",
        ["A goal based only on money", "A goal focused on becoming a type of person while practising related behaviours", "A goal that cannot be measured", "A goal somebody else gives you"],
        1, "An identity-based goal pairs \"who I am becoming\" with behaviours you can practise and observe."),
      q("Which sequence is most useful?",
        ["Identity → Behaviour → Evidence → Learning", "Wish → Luck → Result", "Goal → Waiting → Success", "Identity → Perfection → Success"],
        0, "Identity guides behaviour, behaviour creates evidence, and evidence teaches you what to adjust."),
      q("Which is the strongest identity statement?",
        ["\"I want to be successful.\"", "\"I hope things improve.\"", "\"I am becoming someone who consistently learns and applies new skills.\"", "\"Everyone should recognise my potential.\""],
        2, "It describes an identity you can practise through specific, repeatable behaviour."),
      q("Why is evidence important?",
        ["It allows you to test whether your behaviour is changing.", "It guarantees the desired outcome.", "It eliminates uncertainty.", "It proves you are better than others."],
        0, "Evidence lets you observe change instead of simply telling yourself you have changed."),
      q("What should you do when an identity-based experiment does not work?",
        ["Decide the identity is impossible.", "Ignore the result.", "Examine what happened, learn and adjust the experiment.", "Blame other people."],
        2, "An experiment that doesn't work is information — learn from it and adjust the next one."),
    ],
  },

  // ---------------------------------------------------------------- module 3 assessment
  {
    lessonId: "m3-assessment",
    title: "Module 3 · Identity Transformation Assessment",
    lessonOrder: 15,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 7–9 together: current identity, future self and your Identity-Based Action Plan (50 marks).",
    contentBody: `
<h2>50-mark Identity Transformation Assessment</h2>
<p>This is the Day 9 assignment and the major assessed activity for Module 3. Your work from Days 7–9 is a good starting point.</p>

<h2>Part A — Current identity analysis (10 marks)</h2>
<p>Describe five important aspects of your current identity. For each, explain what it is, where it came from, whether you consciously chose it, and how it influences your behaviour.</p>
${block("exercise", "m3-part-a")}

<h2>Part B — Identity challenge (10 marks)</h2>
<p>Identify one identity or label that may limit you.</p>
${block("exercise", "m3-part-b")}

<h2>Part C — Future Self Profile (10 marks)</h2>
<p>Describe the person you are becoming.</p>
${block("exercise", "m3-part-c")}

<h2>Part D — Identity-based goals (10 marks)</h2>
<p>Convert three outcome goals into identity-based goals: <strong>Goal → Identity → Behaviour → Evidence</strong>.</p>
${block("exercise", "m3-part-d")}

<h2>Part E — Seven-day identity experiment (10 marks)</h2>
<p>Design a seven-day experiment demonstrating one of your chosen identities.</p>
${block("exercise", "m3-part-e")}

<h2>Marking rubric</h2>
${table(["Area", "Excellent", "Developing", "Limited"], [
  ["Identity awareness", "Clear and evidence-based", "Some reflection", "Mostly descriptive"],
  ["Critical reflection", "Challenges assumptions", "Some questioning", "Accepts labels without examination"],
  ["Future self", "Specific and realistic", "Some detail", "Very vague"],
  ["Identity goals", "Strong connection to behaviour", "Partial connection", "Mainly wishes"],
  ["Experiment", "Measurable and practical", "Some structure", "No clear evidence"],
])}

<h2>Performance guide</h2>
<ul>
<li><strong>40–50 — Strong application.</strong> You demonstrate a clear ability to connect identity, behaviour and future development.</li>
<li><strong>30–39 — Developing application.</strong> You demonstrate understanding but need greater consistency or evidence.</li>
<li><strong>20–29 — Foundation level.</strong> You understand the concepts but require more practical application.</li>
<li><strong>Below 20</strong> — review Days 7–9 and repeat the Identity Experiment.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E against the rubric. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m3-assessment-review")}

<h2>Your Module 3 submission</h2>
${block("portfolio")}

<h2>Module 3 final integration</h2>
<p>You now combine three outputs:</p>
<ol>
<li><strong>My Current Identity</strong> — who I am now</li>
<li><strong>My Future Self</strong> — who I am becoming</li>
<li><strong>My Identity-Based Action Plan</strong> — what I will practise</li>
</ol>
<blockquote><p>CURRENT IDENTITY → FUTURE IDENTITY → BEHAVIOUR → EVIDENCE → LEARNING</p></blockquote>

<h2>7-day follow-up challenge</h2>
<p>For the next seven days, answer these every evening.</p>
${block("exercise", "m3-seven-days")}
<p>At the end of seven days, write:</p>
<blockquote><p>What evidence do I now have that I am becoming different?</p></blockquote>
${block("exercise", "m3-evidence")}

<h2>Module 3 key takeaways</h2>
<ol>
<li><strong>Your job is not your entire identity.</strong> You are more than your current role.</li>
<li><strong>Some identities are inherited.</strong> You can examine whether they remain accurate or useful.</li>
<li><strong>Identity can evolve.</strong> You are not permanently defined by your past.</li>
<li><strong>Your future self provides direction.</strong> It does not predict the future.</li>
<li><strong>Identity becomes powerful when connected to behaviour.</strong> A statement becomes meaningful when you practise it.</li>
<li><strong>Evidence matters.</strong> Do not simply tell yourself you have changed. Create experiences that allow you to observe change.</li>
<li><strong>Becoming is a process.</strong> You do not need to become the finished version of yourself today. You need to take the next deliberate step.</li>
</ol>

<h2>Module 3 completion statement</h2>
<p>Before moving to Module 4, complete:</p>
${block("exercise", "m3-completion")}

<h2>Module 3 core message</h2>
<blockquote><p>You do not have to remain the person your past experiences taught you to be.</p></blockquote>
<p>You can examine the identity you have inherited, decide what remains useful, imagine the person you want to become, and begin creating evidence through your actions.</p>
<p><strong>Identity is not simply something you describe. It is something you continually develop through what you practise.</strong></p>

<h2>Module 3 output</h2>
<p>At completion you should have: 1. Identity Inventory · 2. Identity Challenge Analysis · 3. Future Self Profile · 4. Three Identity-Based Goals · 5. Seven-Day Identity Experiment · 6. 50-Mark Identity Transformation Assessment.</p>
<p>These become part of your eventual <strong>My Extraordinary Blueprint</strong>: <em>Who I Am → Who I Am Becoming → What I Will Do Next.</em></p>
`,
    exercises: [
      {
        exerciseId: "m3-part-a",
        title: "Part A — Current identity analysis",
        table: {
          columns: ["What it is", "Where it came from", "Did I consciously choose it?", "How it influences my behaviour"],
          rows: ["Aspect 1", "Aspect 2", "Aspect 3", "Aspect 4", "Aspect 5"],
        },
        marks: 10,
      },
      {
        exerciseId: "m3-part-b",
        title: "Part B — Identity challenge",
        fields: [
          { id: "label", label: "The identity or label that may limit me:", type: "textarea" },
          { id: "origin", label: "1. Where it came from:", type: "textarea" },
          { id: "supporting", label: "2. Evidence supporting it:", type: "textarea" },
          { id: "challenging", label: "3. Evidence challenging it:", type: "textarea" },
          { id: "behaviour", label: "4. How it influences my behaviour:", type: "textarea" },
          { id: "carry", label: "5. Whether I still want to carry it forward:", type: "textarea" },
        ],
        marks: 10,
      },
      {
        exerciseId: "m3-part-c",
        title: "Part C — Future Self Profile",
        fields: ["Skills", "Work", "Habits", "Relationships", "Contribution", "Values", "Environment", "Challenges overcome"].map((s) => ({
          id: s.toLowerCase().replace(/\s+/g, "-"),
          label: `${s}:`,
          type: "textarea",
        })),
        marks: 10,
      },
      {
        exerciseId: "m3-part-d",
        title: "Part D — Identity-based goals",
        table: { columns: ["Goal", "Identity", "Behaviour", "Evidence"], rows: ["Goal 1", "Goal 2", "Goal 3"] },
        marks: 10,
      },
      {
        exerciseId: "m3-part-e",
        title: "Part E — Seven-day identity experiment",
        fields: ["Identity", "Behaviour", "Frequency", "Evidence", "Expected obstacle", "Response strategy", "Learning method"].map((s) => ({
          id: s.toLowerCase().replace(/\s+/g, "-"),
          label: `${s}:`,
          type: "textarea",
        })),
        marks: 10,
      },
      {
        exerciseId: "m3-seven-days",
        title: "Evening check-in",
        table: {
          columns: [
            "What did I do today that reflects the person I am becoming?",
            "What did I do that reinforces an old identity?",
            "What did I learn?",
            "What will I practise tomorrow?",
          ],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "m3-evidence",
        title: "What evidence do I now have that I am becoming different?",
        fields: [{ id: "evidence", label: "My evidence (250–500 words)", type: "textarea", minWords: 250, maxWords: 500 }],
      },
      {
        exerciseId: "m3-completion",
        title: "Module 3 completion statement",
        fields: [
          { id: "used-to", label: "\"I used to think I was…\"", type: "textarea" },
          { id: "realise", label: "\"I am beginning to realise that…\"", type: "textarea" },
          { id: "becoming", label: "\"The person I am becoming is…\"", type: "textarea" },
          { id: "behaviour", label: "\"The behaviour that will provide evidence is…\"", type: "textarea" },
          { id: "next", label: "\"My next step is…\"", type: "textarea" },
        ],
      },
    ],
    coaches: [
      {
        coachId: "m3-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the rubric: what is strong, what is missing, and questions to strengthen it. Its marks are indicative only.",
        usesExercises: ["m3-part-a", "m3-part-b", "m3-part-c", "m3-part-d", "m3-part-e"],
        promptTemplate:
          "Please review my Module 3 Identity Transformation Assessment (Parts A–E, 10 marks each) against the rubric.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 3 assessment review (formative). Review each part:\nA Current identity analysis (10): five aspects, each with what it is, where it came from, whether consciously chosen, and how it influences behaviour — with specific examples.\nB Identity challenge (10): one limiting identity or label with origin, supporting and challenging evidence, effect on behaviour, and whether they'll carry it forward.\nC Future Self Profile (10): skills, work, habits, relationships, contribution, values, environment and challenges overcome — specific and realistic, not vague.\nD Identity-based goals (10): three goals each converted Goal → Identity → Behaviour → Evidence, with a strong connection to behaviour rather than wishes.\nE Seven-day experiment (10): identity, behaviour, frequency, evidence, expected obstacle, response strategy and learning method — measurable and practical.\nUse the rubric levels Excellent / Developing / Limited for identity awareness, critical reflection, future self, identity goals and experiment. For each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty parts score 0). Then an indicative total out of 50 and the band (40–50 strong application; 30–39 developing; 20–29 foundation; below 20 review Days 7–9 and repeat the experiment). State clearly that marks are indicative and the tutor gives the final mark. Judge the quality of reflection and evidence, never the learner's choice of identity or goals. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "m3-part-a", title: "Part A — Current identity analysis (10 marks)", lessonId: "m3-assessment" },
      { exerciseId: "m3-part-b", title: "Part B — Identity challenge (10 marks)", lessonId: "m3-assessment" },
      { exerciseId: "m3-part-c", title: "Part C — Future Self Profile (10 marks)", lessonId: "m3-assessment" },
      { exerciseId: "m3-part-d", title: "Part D — Identity-based goals (10 marks)", lessonId: "m3-assessment" },
      { exerciseId: "m3-part-e", title: "Part E — Seven-day identity experiment (10 marks)", lessonId: "m3-assessment" },
      { exerciseId: "d7-inventory", title: "Identity Inventory (Day 7)", lessonId: "m3-day-7" },
      { exerciseId: "d8-assignment", title: "Future Self Profile (Day 8)", lessonId: "m3-day-8" },
      { exerciseId: "m3-evidence", title: "7-day evidence reflection (250–500 words)", lessonId: "m3-assessment" },
    ],
  },
];
