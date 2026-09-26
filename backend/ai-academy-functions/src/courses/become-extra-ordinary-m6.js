// Become Extra Ordinary — Module 6: Turn Failure Into Fuel (Days 16–18).
// Same lesson format as Modules 1–5.

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
const SUPPORT = `<p><strong>Looking after yourself:</strong> choose a setback you feel comfortable analysing. Some failures are painful or have serious consequences — if one still feels too big to handle alone, talk to someone you trust or a professional. In an emergency call 999 (UK) or 112 (Nigeria).</p>`;
const marking = (rows) =>
  table(["Criterion", "Marks"], [...rows, ["<strong>Total</strong>", "<strong>10</strong>"]]);
const LADDER = [
  ["ten", "10-year possibility — I could become:"],
  ["one", "1-year objective — Over the next year I want to:"],
  ["ninety", "90-day project — Over the next 90 days I will:"],
  ["thirty", "30-day experiment — Over the next 30 days I will test:"],
  ["seven", "7-day action — This week I will:"],
  ["today", "Today — Today I will:"],
];

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m6-intro",
    title: "Module 6 · Turn Failure Into Fuel",
    lessonOrder: 26,
    duration: "15 minutes",
    objective: "Failure is an event. It does not have to become an identity.",
    contentBody: `
<h2>Module 6 — Turn Failure Into Fuel</h2>
<p><strong>Days 16–18 · Transforming setbacks into learning, experiments and progress</strong></p>
<blockquote><p>What could change if you stopped treating every setback as a verdict about yourself and started treating appropriate setbacks as information for your next move?</p></blockquote>

<h2>Module overview</h2>
<p>Module 5 taught you how to remain steady when circumstances become difficult. Module 6 takes the next step. Instead of simply recovering from setbacks, you will learn how to <strong>extract information from them and use that information to improve your next attempt.</strong></p>
<p>The objective is not to make failure sound positive. Some failures are painful. Some have serious consequences. Some involve mistakes that should be acknowledged. Some situations require stopping, changing direction or asking for help. But when an attempt does not produce the result you wanted, one useful question is:</p>
<blockquote><p>What can this experience teach me that I did not know before?</p></blockquote>

<h2>The BSOE Failure-to-Learning Loop</h2>
${flow(["ATTEMPT — What did I try?", "RESULT — What actually happened?", "EVIDENCE — What information do I now have?", "LEARNING — What does the evidence suggest?", "ADJUSTMENT — What could I change?", "EXPERIMENT — What can I test next?", "NEW EVIDENCE — What happened this time?"])}
<p>This creates a learning cycle rather than a failure identity.</p>

<h2>Module learning outcomes</h2>
<p>By the end of this module, you will be able to:</p>
<ol>
<li>Distinguish a failed outcome from a failed identity.</li>
<li>Analyse setbacks objectively.</li>
<li>Identify assumptions behind unsuccessful attempts.</li>
<li>Separate controllable and uncontrollable factors.</li>
<li>Extract useful evidence from failure.</li>
<li>Reframe failure without denying what happened.</li>
<li>Develop an experiment mindset.</li>
<li>Design smaller, lower-cost tests before making larger commitments.</li>
<li>Use AI as a structured failure-analysis and experimentation partner.</li>
<li>Build a practical <strong>Failure-to-Learning Loop</strong>.</li>
<li>Convert a long-term ambition into progressively smaller actions.</li>
<li>Create a 30-day experiment based on a meaningful goal.</li>
</ol>
${SUPPORT}

<h2>Module 6 diagnostic — My Failure &amp; Experiment Mindset</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m6-diagnostic")}
<p><strong>Important:</strong> this is a learning diagnostic. It is not a psychological assessment and does not predict future success.</p>
`,
    exercises: [
      {
        exerciseId: "m6-diagnostic",
        title: "My Failure & Experiment Mindset Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Learning from setbacks",
              statements: [
                "I can examine a setback without immediately judging myself.",
                "I can identify what I learned from an unsuccessful attempt.",
                "I distinguish the result of an attempt from my identity.",
                "I can identify assumptions that may have contributed to an unsuccessful result.",
                "I can change my approach after receiving evidence.",
              ],
            },
            {
              title: "Experimental thinking",
              statements: [
                "I test ideas before making unnecessarily large commitments.",
                "I am comfortable learning from small experiments.",
                "I can define what I want to learn from an experiment.",
                "I use evidence rather than assumptions to evaluate an idea.",
                "I can change an idea without feeling that I have personally failed.",
              ],
            },
            {
              title: "Action & adaptation",
              statements: [
                "I can turn a large goal into smaller actions.",
                "I take action before I have complete certainty when appropriate.",
                "I review results and adjust my approach.",
                "I can try again using a different approach.",
                "I regularly turn learning into practical action.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "You are beginning to develop an experimental approach to setbacks and uncertainty." },
            { min: 27, max: 38, title: "Developing", text: "You recognise the value of learning from setbacks, but may still revert to avoidance or self-judgement in difficult situations." },
            { min: 39, max: 50, title: "Building", text: "You are developing the ability to extract evidence, adapt and test different approaches." },
            { min: 51, max: 62, title: "Intentional", text: "You demonstrate a strong tendency to use learning, evidence and experimentation when moving forward." },
            { min: 63, max: 75, title: "Designing", text: "You demonstrate a highly developed approach to learning from setbacks and converting ideas into practical experiments." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 16
  {
    lessonId: "m6-day-16",
    title: "Module 6 · Day 16 — Rewrite Your Failure Story",
    lessonOrder: 27,
    duration: "60–75 minutes",
    objective: "The result is not your identity.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What if the sentence "I failed" was only the beginning of the analysis rather than the end of the story?</p></blockquote>
${talk("You are not your last result", `
Think about a time something did not work. Maybe you failed an exam. Lost an opportunity. Received a rejection. Made a mistake. Started something that never developed. Had an idea that people did not respond to. Or simply made a decision that you later realised was not the right one.

What did you say to yourself? Perhaps: "I failed." "I am not good enough." "I am not cut out for this." "I always get things wrong."

Notice what happened. A specific event became a statement about your identity. But these are different things.

"I failed this assessment" describes an outcome. "I am a failure" describes an identity. The first can be investigated. The second can become a limiting conclusion.

A useful failure analysis asks: What was I trying to achieve? What actually happened? What did I expect to happen? Which assumptions were wrong? What was within my control? What was outside my control? What did I learn? What would I change? What could I test next?

This does not mean every failure contains a hidden gift. Sometimes the lesson is simply: "This approach did not work." That is still information.

The objective is to become someone who can look honestly at a result without allowing that result to define the whole person.

You are not required to pretend failure feels good. You are learning to make failure useful.`)}

<h2>Reading — Outcome vs identity</h2>
${table(["Outcome", "Identity"], [
  ["\"I was rejected from the programme.\"", "\"I am not capable.\""],
  ["\"My first business idea did not attract customers.\"", "\"I am not entrepreneurial.\""],
])}
<p>In each case the conclusion is much larger than the evidence. A failed experiment tells you something about the idea, the timing, the market, the execution, the communication, the assumptions, the resources, the circumstances or other factors. <strong>It does not automatically tell you everything about who you are.</strong></p>

<h2>The Failure Analysis Framework</h2>
<p>When an attempt fails, ask:</p>
<ol>
<li>What was I trying to achieve?</li>
<li>What did I expect?</li>
<li>What actually happened?</li>
<li>What evidence do I now have?</li>
<li>Which assumptions were wrong?</li>
<li>What was within my control?</li>
<li>What was outside my control?</li>
<li>What did I learn?</li>
<li>What would I change?</li>
<li>What should I test next?</li>
</ol>

<h2>Interactive example — The job application</h2>
${table(["", ""], [
  ["Goal", "Get an interview."],
  ["Expectation", "My CV demonstrates that I am suitable."],
  ["Result", "No interview."],
  ["Automatic conclusion", "\"My CV is terrible.\""],
  ["Better analysis — possible explanations", "Competition was high; the CV did not clearly communicate relevant skills; the application did not match the role closely enough; the employer had internal candidates; the application was screened using criteria I do not know; another candidate had more directly relevant experience."],
  ["Evidence needed", "Compare CV against job requirements; seek feedback where available; improve wording; test a revised CV; track application results."],
  ["New experiment", "Use two versions of the CV for appropriate applications and compare responses over time."],
])}
<p>The learner has moved from <strong>"I failed"</strong> to <strong>"I have new information."</strong></p>

<h2>Case study — Michael's first online course</h2>
<p>Michael spends four months creating an online course. He believes people will buy it because the subject is important. He launches. Only two people purchase. Michael thinks: <em>"Nobody wants what I know."</em> He nearly abandons the idea. Instead, he performs a failure analysis.</p>
<ul>
<li><strong>The assumption:</strong> "If the subject is useful, people will buy the course."</li>
<li><strong>What the result showed:</strong> the course attracted very little demand.</li>
<li><strong>What it does not prove:</strong> that nobody wants the subject.</li>
<li><strong>What could be wrong:</strong> audience, positioning, price, messaging, format, trust, distribution, timing, problem definition.</li>
<li><strong>New experiment:</strong> Michael interviews ten potential learners. He discovers that people are interested in the topic but want shorter, practical lessons focused on specific workplace problems. He changes the format.</li>
</ul>
<p>The original course did not produce the expected result. But it produced information that improved the next experiment.</p>

<h2>Learner activity — Rewrite your failure story</h2>
<p>Choose one setback.</p>
${block("exercise", "d16-rewrite")}

<h2>AI practical exercise — AI Failure Analysis Partner</h2>
<p>Your analysis partner can bring in your rewritten failure story. It won't pretend the failure was secretly a success — it will challenge conclusions that are larger than the evidence.</p>
${block("coach", "d16-analysis-partner")}

<h2>Scenario-based activity — The exam result</h2>
<p>A learner fails an important examination.</p>
${block("scenario", "d16-exam")}

<h2>Real-world challenge — Find the lesson</h2>
<p>Identify one small recent setback. Do not try to make it sound positive.</p>
${block("exercise", "d16-challenge")}

<h2>Day 16 reflection</h2>
${block("exercise", "d16-reflection")}

<h2>Day 16 quiz</h2>
${block("quiz")}

<h2>Day 16 assignment — Failure Analysis Report</h2>
${block("exercise", "d16-assignment")}
`,
    exercises: [
      {
        exerciseId: "d16-rewrite",
        title: "Rewrite my failure story",
        fields: [
          field("said", "What I originally said:"),
          field("happened", "What actually happened:"),
          field("expected", "What I expected:"),
          field("evidence", "What evidence do I have?"),
          field("assumptions", "What assumptions may have been wrong?"),
          field("within", "What was within my control?"),
          field("outside", "What was outside my control?"),
          field("learned", "What did I learn?"),
          field("change", "What will I change?"),
          field("test", "What will I test next?"),
        ],
      },
      {
        exerciseId: "d16-challenge",
        title: "Find the lesson",
        fields: [
          field("happened", "What happened?"),
          field("learned", "What did I learn?"),
          field("change", "What will I change?"),
          field("test", "What will I test next?"),
        ],
      },
      {
        exerciseId: "d16-reflection",
        title: "Day 16 reflection",
        fields: [
          field("tend", "1. Do I tend to interpret setbacks as information or judgement?"),
          field("identity", "2. What identity statements do I sometimes attach to failure?"),
          field("larger", "3. Which conclusions are larger than the evidence?"),
          field("setback", "4. What is one setback I could analyse more objectively?"),
          field("test", "5. What could I test next?"),
        ],
      },
      {
        exerciseId: "d16-assignment",
        title: "Failure Analysis Report",
        intro: "Analyse one meaningful setback: the original goal; your expectation; the actual result; your initial interpretation; facts versus assumptions; factors within your control; factors outside your control; what you learned; what you would change; and your proposed next experiment.",
        fields: [
          words("report", "My report (500–700 words)", 500, 700),
          field("prove", "\"This experience does not prove…\""),
          field("evidence", "\"It does provide evidence that…\""),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d16-exam",
        title: "The exam result",
        question: "Which statement is most evidence-based?",
        options: [
          "\"I failed, therefore I am not intelligent.\"",
          "\"The result shows I need to understand what went wrong and decide how to improve.\"",
          "\"The exam was meaningless.\"",
          "\"I should immediately give up.\"",
        ],
        answer: 1,
        explanation: "B does not deny the result. It simply avoids turning one result into a total identity judgement.",
      },
    ],
    coaches: [
      {
        coachId: "d16-analysis-partner",
        title: "AI Failure Analysis Partner",
        intro: "Separates outcome, facts, assumptions and control — and names what you should NOT conclude from the evidence.",
        usesExercises: ["d16-rewrite"],
        promptTemplate:
          "I want to analyse a setback objectively.\n\nHere is what happened:\n\n[PASTE YOUR ANSWERS]\n\nHelp me separate:\n\n1. My intended outcome\n2. What I expected\n3. What actually happened\n4. Facts\n5. Assumptions\n6. Factors within my control\n7. Factors outside my control\n8. Evidence I now have\n9. Possible explanations\n10. Lessons I could reasonably draw\n11. What I should NOT conclude from the available evidence\n12. Possible next experiments\n\nDo not tell me that the failure was secretly a success.\n\nDo not diagnose me.\n\nDo not make personal decisions for me.\n\nChallenge conclusions that are larger than the evidence supports.\n\nClearly distinguish evidence, interpretation and hypothesis.",
        systemPrompt:
          "Exercise: Day 16 — failure analysis partner. Organise the learner's setback under: intended outcome, expectation, what happened, facts, assumptions, factors within/outside their control, evidence now available, possible explanations, lessons reasonably drawn, what they should NOT conclude from the evidence, and possible next experiments. Label each point as evidence, interpretation or hypothesis. Gently but clearly challenge identity-level conclusions (\"I am a failure\", \"I'm not entrepreneurial\") that are larger than the evidence. Never claim the failure was secretly a success, never diagnose, never make personal decisions for them. Ask about missing information rather than inventing it. Acknowledge that some failures are painful or have real consequences.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Which statement describes an outcome rather than an identity?", ["\"I am a failure.\"", "\"I failed this assessment.\"", "\"I am not capable.\"", "\"I always get things wrong.\""],
        1, "An outcome can be investigated; an identity statement makes a much larger claim."),
      q("What should failure analysis begin with?",
        ["Blaming yourself.", "Ignoring the result.", "Identifying what you were trying to achieve and what actually happened.", "Finding someone else to blame."],
        2, "The framework starts with the goal, the expectation and the actual result."),
      q("Why distinguish facts from assumptions?", ["To avoid learning.", "To understand what the evidence actually supports.", "To guarantee success.", "To eliminate emotions."],
        1, "It stops conclusions from growing larger than the evidence."),
      q("What can an unsuccessful attempt provide?",
        ["Information.", "A permanent identity.", "A guarantee that the idea will never work.", "Proof that the person cannot succeed."],
        0, "Even \"this approach did not work\" is information."),
      q("What is a useful next step after a setback?",
        ["Automatically abandon the goal.", "Repeat exactly the same approach.", "Analyse the evidence and identify an appropriate adjustment or experiment.", "Pretend nothing happened."],
        2, "Honest analysis plus an appropriate adjustment or experiment."),
    ],
  },

  // ---------------------------------------------------------------- day 17
  {
    lessonId: "m6-day-17",
    title: "Module 6 · Day 17 — The Experiment Mindset",
    lessonOrder: 28,
    duration: "60–75 minutes",
    objective: "Stop trying to get everything right first time.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What could you learn by testing an idea before investing heavily in it?</p></blockquote>
${talk("Think like an experimenter", `
Imagine you have an idea for a business. You could spend six months building it. Or you could first speak to ten potential customers. Those two approaches create very different learning opportunities.

The first approach makes a large commitment before you have much evidence. The second creates a smaller test. This is the experiment mindset.

An experiment does not mean treating your life like a laboratory. It means recognising that some decisions contain uncertainty. When uncertainty is high, you can sometimes reduce it by testing.

The experiment mindset asks: What am I assuming? What would I need to observe to learn something? What is the smallest useful test? How much time and money should I risk? What result would cause me to continue? What result would cause me to change direction?

An experiment is not a guarantee. It is a structured way of learning.

For example, instead of saying "I will become a YouTube creator", you might test: "I will publish five short videos over seven days and examine which topics receive useful engagement."

Instead of "I will start a consultancy", test: "I will speak to ten potential clients about one specific problem."

Instead of "I will learn AI", test: "I will complete one practical AI workflow and use it to solve a real problem."

Think bigger. Test smaller. Learn faster. Then decide what deserves more investment.`)}

<h2>Reading — Assumption → Test → Evidence → Decision</h2>
<p>Every idea contains assumptions. Suppose you believe: <em>"Small businesses will pay for AI automation."</em> That is an assumption. Rather than immediately building a large platform, identify what you need to learn.</p>
${table(["", ""], [
  ["Assumption", "Small businesses have a problem worth solving."],
  ["Test", "Speak to 10 business owners."],
  ["Evidence", "What problems do they describe?"],
  ["Next decision", "Is there enough evidence to design a small solution?"],
])}

<h2>The five-part experiment</h2>
<ol>
<li><strong>Hypothesis</strong> — what do I think might be true?</li>
<li><strong>Test</strong> — what will I do?</li>
<li><strong>Evidence</strong> — what will I observe?</li>
<li><strong>Learning</strong> — what does the evidence suggest?</li>
<li><strong>Next step</strong> — what will I change, continue or investigate?</li>
</ol>

<h2>Interactive example — "I want to sell AI training to local businesses"</h2>
${table(["Weak approach", "Experiment approach"], [
  ["Build a website. Create 20 courses. Buy advertising. Print marketing materials. Spend £2,000. Then discover whether businesses are interested.",
   "<strong>Hypothesis:</strong> local businesses are interested in short practical AI training that saves employees time.<br><strong>Test:</strong> speak to 15 businesses; ask what AI problems they currently have.<br><strong>Evidence:</strong> record repeated problems and willingness to explore training.<br><strong>Learning:</strong> identify which problem appears most frequently.<br><strong>Next step:</strong> create a small workshop addressing that specific problem."],
])}
<p>The experiment does not prove the final business will succeed. It simply produces better information before larger investment.</p>

<h2>Case study — Tunde's content business</h2>
<p>Tunde wants to become an AI content creator. His original plan is to purchase expensive equipment and produce a large video series. Instead, he creates an experiment.</p>
<ul>
<li><strong>Hypothesis:</strong> people are interested in short videos explaining practical AI tools for small businesses.</li>
<li><strong>Test:</strong> publish 10 short videos over two weeks.</li>
<li><strong>Evidence:</strong> views, watch time, comments, questions, shares, enquiries, and topics that generate genuine interest.</li>
<li><strong>Learning:</strong> four videos perform significantly better because they address specific workplace problems.</li>
<li><strong>Adjustment:</strong> Tunde creates more content around those problems.</li>
</ul>
<p>He has not guaranteed success. <strong>He has reduced uncertainty through testing.</strong></p>

<h2>Learner activity — Build your first experiment</h2>
${block("exercise", "d17-experiment")}

<h2>AI practical exercise — AI Experiment Designer</h2>
<p>Your experiment designer can bring in the experiment you've drafted.</p>
${block("coach", "d17-designer")}

<h2>Scenario-based activity</h2>
<p>You want to create an online course.</p>
${block("scenario", "d17-course")}

<h2>Real-world challenge — Run a small experiment</h2>
<p>Before moving to Day 18, conduct one small experiment: a conversation, a prototype, a sample, a short post, a pilot, a survey, a demonstration, a practice presentation, or a small customer test.</p>
${block("exercise", "d17-run")}

<h2>Day 17 reflection</h2>
${block("exercise", "d17-reflection")}

<h2>Day 17 quiz</h2>
${block("quiz")}

<h2>Day 17 assignment — My Experiment Report</h2>
${block("exercise", "d17-assignment")}
`,
    exercises: [
      {
        exerciseId: "d17-experiment",
        title: "My first experiment",
        fields: [
          field("idea", "My idea:"),
          field("hypothesis", "My hypothesis — I believe…"),
          field("why", "Why do I believe this?"),
          field("assuming", "What am I assuming?"),
          field("test", "My smallest useful test:"),
          field("who", "Who or what will I test?"),
          field("evidence", "What evidence will I collect?"),
          field("how-long", "How long will I test?"),
          field("continue", "What result would encourage me to continue?"),
          field("reconsider", "What result would make me reconsider?"),
          field("use", "What will I do with what I learn?"),
        ],
      },
      {
        exerciseId: "d17-run",
        title: "My small experiment",
        fields: [
          field("hypothesis", "Hypothesis:"),
          field("test", "Test:"),
          field("evidence", "Evidence:"),
          field("learning", "Learning:"),
          field("next", "Next step:"),
        ],
      },
      {
        exerciseId: "d17-reflection",
        title: "Day 17 reflection",
        fields: [
          field("fact", "1. What assumption am I currently treating as fact?"),
          field("test", "2. What could I test rather than assume?"),
          field("smallest", "3. What is the smallest useful experiment?"),
          field("change", "4. What evidence would genuinely change my thinking?"),
          field("learn", "5. What could I learn even if the experiment does not work?"),
        ],
      },
      {
        exerciseId: "d17-assignment",
        title: "My Experiment Report",
        intro: "Include your hypothesis; assumptions; experiment; evidence; result; what surprised you; what you learned; what you will change; and what you will test next.",
        fields: [
          words("report", "My report (400–600 words)", 400, 600),
          field("most", "\"The most important thing I learned from testing rather than assuming was…\""),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d17-course",
        title: "The online course",
        question: "Which is the strongest initial experiment?",
        options: [
          "Spend a year creating the complete course before speaking to learners.",
          "Build a small pilot lesson or workshop and gather feedback from potential learners.",
          "Assume people will buy because the subject is important.",
          "Spend heavily on advertising before testing the offer.",
        ],
        answer: 1,
        explanation: "The purpose is to obtain useful evidence before making a larger commitment — the lesson Michael learned on Day 16.",
      },
    ],
    coaches: [
      {
        coachId: "d17-designer",
        title: "AI Experiment Designer",
        intro: "Finds your riskiest assumption and helps you design the smallest realistic test — without assuming the idea will succeed.",
        usesExercises: ["d17-experiment"],
        promptTemplate:
          "Help me design a small practical experiment for an idea I am considering.\n\nMy idea is:\n\n[PASTE YOUR ANSWERS]\n\nHelp me identify:\n\n1. My main hypothesis\n2. The assumptions behind it\n3. The riskiest assumption\n4. The smallest useful test\n5. Who or what should be involved\n6. What evidence I should collect\n7. How long the test should run\n8. What results might support the hypothesis\n9. What results might challenge it\n10. What I could learn either way\n\nKeep the experiment realistic and proportionate.\n\nDo not assume the idea will succeed.\n\nDo not make the final decision for me.",
        systemPrompt:
          "Exercise: Day 17 — experiment designer. Help the learner design a small, proportionate experiment: main hypothesis, underlying assumptions, the riskiest assumption (explain why), smallest useful test, who/what is involved, evidence to collect, duration, results that would support or challenge the hypothesis, and what they'd learn either way. Favour low-cost, low-risk tests (conversations, pilots, samples) before spending money; never suggest borrowing, large spending or anything unsafe or unlawful, and for anything involving money or other people's data suggest checking with a trusted adult or adviser. Don't assume the idea will succeed and don't make the final decision. Ask clarifying questions if the idea is vague.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a hypothesis?", ["A guaranteed outcome.", "An assumption or proposition that can be tested.", "A final decision.", "A personal identity."],
        1, "A hypothesis is what you think might be true — something you can test."),
      q("Why conduct small experiments?",
        ["To guarantee success.", "To eliminate all risk.", "To gather evidence before making larger commitments where appropriate.", "To avoid taking action."],
        2, "Small tests reduce uncertainty before bigger investment."),
      q("What should an experiment define?", ["Only the desired result.", "Hypothesis, test, evidence and learning.", "Only the budget.", "Only the deadline."],
        1, "The five-part experiment: hypothesis, test, evidence, learning and next step."),
      q("What should happen when evidence challenges your hypothesis?",
        ["Ignore the evidence.", "Change the data.", "Review the assumption and adjust your approach.", "Continue regardless."],
        2, "Evidence that challenges you is exactly what an experiment is for."),
      q("What is the purpose of experimentation?", ["To prove you were right.", "To generate useful information.", "To avoid failure completely.", "To guarantee investment returns."],
        1, "Experiments are a structured way of learning."),
    ],
  },

  // ---------------------------------------------------------------- day 18
  {
    lessonId: "m6-day-18",
    title: "Module 6 · Day 18 — Think Bigger, Test Smaller",
    lessonOrder: 29,
    duration: "60–75 minutes",
    objective: "Turn a huge future into one action you can take today.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>How can you connect a big ambition with a small action that creates evidence now?</p></blockquote>
${talk("Big vision, small tests", `
A big ambition can inspire you. But sometimes a big ambition can also overwhelm you.

You might say: "I want to build a successful company." "I want to become a senior leader." "I want to work internationally." "I want to become financially independent." "I want to create something that helps thousands of people."

These are large ambitions. The problem is not that they are too big. The problem comes when you have no bridge between the ambition and today's action.

That is where the BSOE Goal Ladder comes in.

Start with your <strong>10-year possibility</strong>: what could my life become? Then your <strong>1-year objective</strong>: what meaningful progress could I make within a year? Then your <strong>90-day project</strong>: what could I build or achieve in the next three months? Then your <strong>30-day experiment</strong>: what could I test within a month? Then your <strong>7-day action</strong>: what can I begin this week? Then <strong>today</strong>: what can I do now?

This creates a bridge between imagination and action.

You do not need to know exactly how the next ten years will unfold. You need enough clarity to identify the next useful experiment.

Think bigger. Test smaller. Learn. Adjust. Continue.`)}

<h2>Reading — The BSOE Goal Ladder</h2>
${flow([
  "10-YEAR POSSIBILITY — a direction rather than a prediction. \"I could become…\"",
  "1-YEAR OBJECTIVE — a meaningful development target. \"Over the next year, I want to…\"",
  "90-DAY PROJECT — a concrete project. \"During the next 90 days, I will…\"",
  "30-DAY EXPERIMENT — a test. \"During the next 30 days, I will test…\"",
  "7-DAY ACTION — a short commitment. \"This week I will…\"",
  "TODAY — the immediate action. \"Today I will…\"",
])}
<h2>Important distinction</h2>
<p>A long-term vision is not a prediction. You do not need to know exactly what will happen ten years from now. The purpose of the ten-year level is to create direction. <strong>The nearer you move toward today, the more specific your actions should become.</strong></p>

<h2>Interactive example — "I want to build a successful AI business"</h2>
${table(["Level", "Example"], [
  ["10-year possibility", "Become a recognised AI entrepreneur building useful technology and creating employment."],
  ["1-year objective", "Develop a validated AI service and establish an initial customer base."],
  ["90-day project", "Create and test one AI service addressing a clearly identified business problem."],
  ["30-day experiment", "Speak to 20 businesses and test a small service offer."],
  ["7-day action", "Speak to five potential customers."],
  ["Today", "Create five questions for customer interviews."],
])}
<p>Notice the progression. The ambition remains large. The action becomes small.</p>

<h2>Case study — Fatima wants an international career</h2>
<p>Fatima says: <em>"I want an international career."</em> That is a direction, but it is not yet an action plan. She creates her Goal Ladder:</p>
${table(["Level", "Fatima's ladder"], [
  ["10-year possibility", "Work internationally on projects involving technology and social development."],
  ["1-year objective", "Develop relevant digital and project-management skills and gain practical experience."],
  ["90-day project", "Complete a practical project demonstrating digital and project-management capability."],
  ["30-day experiment", "Build one portfolio project and share it with professionals for feedback."],
  ["7-day action", "Research three relevant project examples."],
  ["Today", "Create a portfolio folder and define the first project."],
])}
<p>Her ambition has not become smaller. <strong>Her next action has.</strong></p>

<h2>Learner activity — Create your Goal Ladder</h2>
${block("exercise", "d18-ladder")}

<h2>The Goal Ladder check</h2>
<ul>
<li>Is my 10-year possibility inspiring?</li>
<li>Is my one-year objective meaningful?</li>
<li>Is my 90-day project concrete?</li>
<li>Is my 30-day experiment testable?</li>
<li>Is my seven-day action realistic?</li>
<li>Can I actually identify what I will do today?</li>
</ul>
<p>If the answer to the final question is no, move down another level.</p>

<h2>AI practical exercise — AI Goal Ladder Coach</h2>
<p>Your Goal Ladder coach can bring in the ladder you've drafted.</p>
${block("coach", "d18-ladder-coach")}

<h2>Scenario-based activity — The overwhelming goal</h2>
<p>Daniel says: <em>"I want to become financially independent."</em></p>
${block("scenario", "d18-daniel")}

<h2>Real-world challenge — Start your 7-day experiment</h2>
<p>Take the Goal Ladder you created. Do the <strong>Today action</strong>. Then complete at least one action from the <strong>7-day action</strong>.</p>
${block("exercise", "d18-start")}

<h2>Day 18 reflection</h2>
${block("exercise", "d18-reflection")}

<h2>Day 18 quiz</h2>
${block("quiz")}

<h2>Day 18 assignment — Think Bigger, Test Smaller</h2>
<p>Create a complete Goal Ladder for one meaningful ambition, then explain why the goal matters and how the ladder makes it more actionable.</p>
${block("exercise", "d18-assignment")}
`,
    exercises: [
      {
        exerciseId: "d18-ladder",
        title: "My Goal Ladder",
        fields: LADDER.map(([id, label]) => field(id, label)),
      },
      {
        exerciseId: "d18-start",
        title: "Starting my 7-day experiment",
        fields: [
          field("did", "What I did:"),
          field("happened", "What happened:"),
          field("learned", "What I learned:"),
          field("adjust", "What I will adjust:"),
        ],
      },
      {
        exerciseId: "d18-reflection",
        title: "Day 18 reflection",
        fields: [
          field("biggest", "1. What is my biggest long-term possibility?"),
          field("meaningful", "2. What makes it meaningful?"),
          field("uncertainty", "3. What is the most important uncertainty?"),
          field("thirty", "4. What can I test within 30 days?"),
          field("today", "5. What can I do today?"),
        ],
      },
      {
        exerciseId: "d18-assignment",
        title: "Think Bigger, Test Smaller — Goal Ladder",
        fields: [
          ...LADDER.map(([id, label]) => field(id, label)),
          field("assumptions", "Key assumptions:"),
          field("evidence", "Evidence I need:"),
          field("adjust", "What would make me adjust the plan:"),
          words("why", "Why this goal matters and how the ladder makes it more actionable (500–700 words)", 500, 700),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d18-daniel",
        title: "The overwhelming goal",
        question: "What is the most useful next step?",
        options: [
          "Keep thinking about financial independence without changing anything.",
          "Set an enormous financial target and immediately pursue it.",
          "Define what financial independence means to him, identify a one-year objective and create a smaller 90-day project.",
          "Give up because the goal is too difficult.",
        ],
        answer: 2,
        explanation: "The key is to turn a broad ambition into a sequence of increasingly concrete actions.",
      },
    ],
    coaches: [
      {
        coachId: "d18-ladder-coach",
        title: "AI Goal Ladder Coach",
        intro: "Builds your ambition into a ladder from 10-year direction down to today — naming assumptions at each level and making the 30-day step testable.",
        usesExercises: ["d18-ladder"],
        promptTemplate:
          "Help me translate a long-term ambition into progressively smaller actions.\n\nMy ambition is:\n\n[PASTE YOUR ANSWERS]\n\nBuild a structured ladder:\n\n10-year possibility\n1-year objective\n90-day project\n30-day experiment\n7-day action\ntoday\n\nKeep the 10-year level directional rather than pretending it is a prediction.\n\nAt each stage, identify assumptions and uncertainties.\n\nMake the 30-day level testable and the 7-day level realistic.\n\nDo not tell me what life decision I should make.\n\nHelp me explore options and identify what evidence I could gather.",
        systemPrompt:
          "Exercise: Day 18 — Goal Ladder coach. Using the learner's ambition (and any ladder they've drafted), build or refine the six levels: 10-year possibility (directional, never a prediction), 1-year objective (meaningful), 90-day project (concrete), 30-day experiment (testable — hypothesis and evidence), 7-day action (realistic), today (something doable now). Name assumptions and uncertainties at each level and what evidence could be gathered. Apply the Goal Ladder check; if 'today' isn't clear, move down another level. Keep their words and ambition — don't shrink the ambition, only the next action. Offer options rather than life decisions; for financial goals don't give personalised investment advice.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the purpose of the 10-year level?",
        ["To predict the future precisely.", "To create a broad direction.", "To guarantee success.", "To create a detailed daily schedule."],
        1, "The ten-year level is a direction, not a prediction."),
      q("Which comes directly before the 7-day action?", ["Today.", "30-day experiment.", "10-year possibility.", "1-year objective."],
        1, "10-year → 1-year → 90-day → 30-day → 7-day → today."),
      q("Why break a large ambition into smaller levels?",
        ["To make the ambition less meaningful.", "To create a bridge between long-term direction and immediate action.", "To avoid experimentation.", "To guarantee the outcome."],
        1, "The ambition stays large; the next action becomes small."),
      q("Which is the most concrete?",
        ["\"I want a better future.\"", "\"I want to be successful.\"", "\"I want to build something useful.\"", "\"Today I will speak to two potential users.\""],
        3, "It names a specific action, a number and a time."),
      q("What should you do when a long-term goal feels overwhelming?",
        ["Abandon it immediately.", "Break it into smaller, testable actions.", "Pretend uncertainty does not exist.", "Wait until you feel completely ready."],
        1, "Move down the ladder until you can see what to do today."),
    ],
  },

  // ---------------------------------------------------------------- module 6 assessment
  {
    lessonId: "m6-assessment",
    title: "Module 6 · Turn Failure Into Fuel Assessment",
    lessonOrder: 30,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 16–18 together in your 50-mark assessment and Failure-to-Fuel personal system.",
    contentBody: `
<h2>Module 6 — 50-mark assessment: Turn Failure Into Fuel</h2>
<p>Your daily work from Days 16–18 is a good starting point.</p>

<h2>Part A — Failure story analysis (10 marks)</h2>
<p>Analyse a real setback.</p>
${block("exercise", "m6-part-a")}
${marking([["Clear situation", "2"], ["Outcome identified", "2"], ["Facts separated from assumptions", "2"], ["Learning identified", "2"], ["Next adjustment identified", "2"]])}

<h2>Part B — Evidence &amp; learning analysis (10 marks)</h2>
<p>Identify what evidence your setback produced.</p>
${block("exercise", "m6-part-b")}
${marking([["Evidence identified", "3"], ["Assumptions identified", "2"], ["Control/influence identified", "2"], ["Learning explained", "2"], ["Limitation acknowledged", "1"]])}

<h2>Part C — Experiment design (10 marks)</h2>
<p>Design a small experiment.</p>
${block("exercise", "m6-part-c")}
${marking([["Clear hypothesis", "2"], ["Appropriate test", "2"], ["Evidence defined", "2"], ["Success/challenge indicators", "2"], ["Next-step logic", "2"]])}

<h2>Part D — Think Bigger, Test Smaller (10 marks)</h2>
<p>Create your complete Goal Ladder.</p>
${block("exercise", "m6-part-d")}
${marking([["10-year possibility", "1"], ["1-year objective", "2"], ["90-day project", "2"], ["30-day experiment", "2"], ["7-day action", "1"], ["Today action", "2"]])}

<h2>Part E — Failure-to-Fuel personal system (10 marks)</h2>
<p>Create your own response system. <strong>When something does not work…</strong></p>
${block("exercise", "m6-part-e")}
${marking([["Clear analysis process", "2"], ["Evidence-based thinking", "2"], ["Control/assumption analysis", "2"], ["Experiment strategy", "2"], ["Review and learning process", "2"]])}

<h2>Module 6 performance</h2>
<ul>
<li><strong>40–50 — Strong Application.</strong> You have demonstrated strong practical application of failure analysis, experimentation and adaptive action.</li>
<li><strong>30–39 — Developing Application.</strong> You understand the framework and are beginning to apply it consistently.</li>
<li><strong>20–29 — Foundation Level.</strong> You demonstrate some understanding but need further practice turning setbacks into evidence and action.</li>
<li><strong>Below 20 — Review Days 16–18.</strong> Return to the lessons and practical exercises before resubmitting the assessment.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E against the marking criteria. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m6-assessment-review")}

<h2>Your Module 6 submission</h2>
${block("portfolio")}

<h2>The 7-day Failure-to-Fuel challenge</h2>
<p>For seven days, whenever something does not go according to plan, record it.</p>
${block("exercise", "m6-log")}
<p>At the end of the week, answer:</p>
<blockquote><p>What did I learn when I started treating setbacks as information rather than immediately treating them as judgement?</p></blockquote>
${block("exercise", "m6-log-reflection")}

<h2>Module 6 integration</h2>
<p>Module 5 taught you <strong>Steady</strong> — how do I respond when life becomes difficult? Module 6 asks <strong>Learn</strong> — what can I learn from what happened? — and <strong>Test</strong> — what can I change or experiment with next? The complete progression becomes:</p>
${flow(["EVENT — something happens", "RESPONSE — I pause and respond deliberately", "RESULT — I observe what happened", "EVIDENCE — I collect information", "LEARNING — I identify what the experience teaches me", "ADJUSTMENT — I change the approach where appropriate", "EXPERIMENT — I test the new approach", "EVIDENCE — I learn again"])}
<p>This is how setbacks become part of a learning system.</p>

<h2>The BSOE Failure-to-Fuel Framework</h2>
<ol>
<li><strong>Don't label</strong> — "I failed" is not the same as "I am a failure."</li>
<li><strong>Analyse</strong> — what actually happened?</li>
<li><strong>Identify assumptions</strong> — what did I believe would happen?</li>
<li><strong>Collect evidence</strong> — what do I know now?</li>
<li><strong>Learn</strong> — what has changed in my understanding?</li>
<li><strong>Adjust</strong> — what could I change?</li>
<li><strong>Test</strong> — what is the smallest useful experiment?</li>
<li><strong>Review</strong> — what happened this time?</li>
</ol>

<h2>A critical principle</h2>
<p><strong>Failure is not automatically useful.</strong> It becomes useful when you learn from it.</p>
<p>If you repeat the same action without examining the result, you may simply repeat the same problem. If you treat every failure as proof that you should quit, you may abandon opportunities before learning enough.</p>
<p>The middle path is: <strong>honest analysis + appropriate experimentation + adaptation</strong>.</p>

<h2>Module 6 key message</h2>
<p>You do not need to become someone who never fails. You need to become someone who can ask better questions when things do not work.</p>
${table(["Instead of…", "Ask…"], [
  ["\"What is wrong with me?\"", "<strong>\"What happened?\"</strong>"],
  ["\"Why can't I do this?\"", "<strong>\"What does the evidence tell me?\"</strong>"],
  ["\"Should I give up?\"", "<strong>\"What could I change or test next?\"</strong>"],
])}
<blockquote><p>Think bigger. Test smaller. Learn. Adjust. Continue.</p></blockquote>

<h2>Module 6 outputs</h2>
<ol>
<li>My Failure &amp; Experiment Mindset Diagnostic</li>
<li>My Failure Analysis</li>
<li>My Failure Story Reframe</li>
<li>My Experiment Design</li>
<li>My Experiment Report</li>
<li>My Goal Ladder</li>
<li>My Failure-to-Fuel Personal System</li>
<li>My Seven-Day Failure-to-Fuel Log</li>
<li>50-Mark Turn Failure Into Fuel Assessment</li>
</ol>

<h2>The journey so far</h2>
${flow([
  "Module 1 — Wake Up: What is happening in my life?",
  "Module 2 — Understand: How do I process what happens?",
  "Module 3 — Transform: Who am I becoming?",
  "Module 4 — Design: What kind of life will support that person?",
  "Module 5 — Steady: How will I remain intentional when life challenges my plans?",
  "Module 6 — Learn: What can I learn, change and test when something does not work?",
])}

<h2>Next: Module 7 — Develop Intuition, Creativity &amp; Insight</h2>
<p>The next stage moves from <strong>resilience and experimentation</strong> into the ability to notice patterns, generate possibilities and create new ideas.</p>
<ul>
<li><strong>Day 19 — Pattern Recognition:</strong> what are you noticing that you have previously overlooked? Patterns across behaviour, opportunities, problems, interests, recurring frustrations, successful experiences, failures and questions you repeatedly ask.</li>
<li><strong>Day 20 — The Quiet Mind:</strong> what becomes visible when you stop filling every moment with information?</li>
<li><strong>Day 21 — Inspiration on Demand:</strong> can creativity become a practice rather than something you wait to feel? The 20 Ideas Challenge, using AI as an idea-generation partner while keeping human judgement.</li>
</ul>
<p><strong>Notice → Reflect → Connect → Create.</strong></p>
`,
    exercises: [
      {
        exerciseId: "m6-part-a",
        title: "Part A — Failure story analysis",
        fields: [
          field("situation", "The situation:"),
          field("outcome", "The outcome:"),
          field("facts", "Facts:"),
          field("assumptions", "Assumptions:"),
          field("learning", "What I learned:"),
          field("adjustment", "My next adjustment:"),
        ],
      },
      {
        exerciseId: "m6-part-b",
        title: "Part B — Evidence & learning analysis",
        fields: [
          field("evidence", "Evidence the setback produced:"),
          field("assumptions", "Assumptions it revealed:"),
          field("control", "What was within my control or influence — and what wasn't:"),
          field("learning", "What the evidence taught me, and why:"),
          field("limitation", "A limitation of this evidence (what it doesn't tell me):"),
        ],
      },
      {
        exerciseId: "m6-part-c",
        title: "Part C — Experiment design",
        fields: [
          field("hypothesis", "Hypothesis:"),
          field("test", "Test:"),
          field("evidence", "Evidence I will collect:"),
          field("support", "Results that would support the hypothesis:"),
          field("challenge", "Results that would challenge it:"),
          field("next", "Next step in each case:"),
        ],
      },
      {
        exerciseId: "m6-part-d",
        title: "Part D — My Goal Ladder",
        fields: LADDER.map(([id, label]) => field(id, label)),
      },
      {
        exerciseId: "m6-part-e",
        title: "Part E — My Failure-to-Fuel personal system",
        fields: [
          field("first", "I will first identify:"),
          field("avoid", "I will avoid automatically concluding:"),
          field("evidence", "I will examine the evidence by:"),
          field("assumption", "I will identify the assumption that may have been wrong:"),
          field("within", "I will identify what was within my control:"),
          field("outside", "I will identify what was outside my control:"),
          field("learn", "I will decide what I can learn:"),
          field("change", "I will identify what I could change:"),
          field("experiment", "I will design a small experiment by:"),
          field("review", "I will review the evidence on:"),
        ],
      },
      {
        exerciseId: "m6-log",
        title: "My Failure-to-Fuel Log",
        table: {
          columns: ["What I tried", "Result", "What I learned", "What I will change"],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "m6-log-reflection",
        title: "Setbacks as information",
        fields: [words("reflection", "My reflection (250–500 words)", 250, 500)],
      },
    ],
    coaches: [
      {
        coachId: "m6-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the marking criteria. Its marks are indicative only.",
        usesExercises: ["m6-part-a", "m6-part-b", "m6-part-c", "m6-part-d", "m6-part-e"],
        promptTemplate:
          "Please review my Module 6 assessment, Turn Failure Into Fuel (Parts A–E, 10 marks each), against the marking criteria.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 6 assessment review (formative). Mark against these criteria:\nA Failure story analysis (10): clear situation 2; outcome identified 2; facts separated from assumptions 2; learning identified 2; next adjustment identified 2.\nB Evidence & learning analysis (10): evidence identified 3; assumptions identified 2; control/influence identified 2; learning explained 2; limitation acknowledged 1.\nC Experiment design (10): clear hypothesis 2; appropriate test 2; evidence defined 2; success/challenge indicators 2; next-step logic 2.\nD Goal Ladder (10): 10-year possibility 1; 1-year objective 2; 90-day project 2; 30-day experiment 2 (must be testable); 7-day action 1; today action 2 (must be doable now).\nE Failure-to-Fuel personal system (10): clear analysis process 2; evidence-based thinking 2; control/assumption analysis 2; experiment strategy 2; review and learning process 2.\nFor each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 with the criterion breakdown (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 16–18). State clearly that marks are indicative and the tutor gives the final mark. Assess the quality of analysis and planning, never the learner's setbacks themselves. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "m6-part-a", title: "Part A — Failure story analysis (10 marks)", lessonId: "m6-assessment" },
      { exerciseId: "m6-part-b", title: "Part B — Evidence & learning analysis (10 marks)", lessonId: "m6-assessment" },
      { exerciseId: "m6-part-c", title: "Part C — Experiment design (10 marks)", lessonId: "m6-assessment" },
      { exerciseId: "m6-part-d", title: "Part D — Think Bigger, Test Smaller (10 marks)", lessonId: "m6-assessment" },
      { exerciseId: "m6-part-e", title: "Part E — Failure-to-Fuel personal system (10 marks)", lessonId: "m6-assessment" },
      { exerciseId: "m6-diagnostic", title: "My Failure & Experiment Mindset Diagnostic", lessonId: "m6-intro" },
      { exerciseId: "d16-rewrite", title: "My Failure Story Reframe (Day 16)", lessonId: "m6-day-16" },
      { exerciseId: "d16-assignment", title: "My Failure Analysis Report (Day 16)", lessonId: "m6-day-16" },
      { exerciseId: "d17-experiment", title: "My Experiment Design (Day 17)", lessonId: "m6-day-17" },
      { exerciseId: "d17-assignment", title: "My Experiment Report (Day 17)", lessonId: "m6-day-17" },
      { exerciseId: "d18-assignment", title: "My Goal Ladder (Day 18)", lessonId: "m6-day-18" },
      { exerciseId: "m6-log", title: "My Seven-Day Failure-to-Fuel Log", lessonId: "m6-assessment" },
      { exerciseId: "m6-log-reflection", title: "7-day reflection (250–500 words)", lessonId: "m6-assessment" },
    ],
  },
];
