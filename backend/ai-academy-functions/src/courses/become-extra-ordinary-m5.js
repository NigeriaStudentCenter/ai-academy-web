// Become Extra Ordinary — Module 5: The Steady Mind (Days 13–15).
// Same lesson format as Modules 1–4.

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
const SUPPORT = `<p><strong>Looking after yourself:</strong> this module asks you to reflect on difficult experiences. Choose situations you feel comfortable exploring. If something brings up distress that feels too big to handle alone, pause and talk to someone you trust or a professional. In an emergency call 999 (UK) or 112 (Nigeria).</p>`;
const marking = (rows) =>
  table(["Criterion", "Marks"], [...rows, ["<strong>Total</strong>", "<strong>10</strong>"]]);

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m5-intro",
    title: "Module 5 · The Steady Mind",
    lessonOrder: 21,
    duration: "15 minutes",
    objective: "Staying intentional when circumstances, emotions, setbacks and uncertainty challenge your plans.",
    contentBody: `
<h2>Module 5 — The Steady Mind</h2>
<p><strong>Days 13–15 · Building resilience, emotional awareness and courage through action</strong></p>
<blockquote><p>When life does not go according to plan, who do you choose to become in response?</p></blockquote>

<h2>Module overview</h2>
<p>Designing an extraordinary future is exciting when everything is going well. The real test comes when something goes wrong; someone rejects you; a plan fails; you receive criticism; money becomes tight; an opportunity disappears; somebody disappoints you; progress is slower than expected; you feel uncertain; you compare yourself with others; or you simply lose motivation.</p>
<p>An extraordinary life does not mean creating a life without difficulty. It means developing the ability to <strong>respond deliberately when difficulty appears</strong>.</p>
<p>You cannot always control the event — what another person says, whether an application succeeds, economic conditions, organisational decisions or unexpected circumstances. But there is often a space between what happens and what you do next. <strong>That space is where this module works.</strong></p>

<h2>The BSOE Steady Mind Model</h2>
${flow(["EVENT — What actually happened?", "INTERPRETATION — What meaning did I immediately give it?", "RESPONSE — What did I think and feel?", "ACTION — What did I do next?", "LEARNING — What can I learn, change or test?"])}
<p>The purpose is not to pretend that difficult situations are easy. It is to become better at separating <strong>what happened</strong> from <strong>what I told myself it meant</strong> and from <strong>what I choose to do next</strong>.</p>

<h2>Module learning outcomes</h2>
<p>By the end of this module, you will be able to:</p>
<ol>
<li>Understand the difference between an event and your interpretation of it.</li>
<li>Recognise emotional responses without automatically allowing them to determine behaviour.</li>
<li>Identify personal evidence of resilience.</li>
<li>Distinguish resilience from simply enduring everything.</li>
<li>Recognise when a response needs to change.</li>
<li>Develop practical strategies for responding to setbacks.</li>
<li>Build confidence through action rather than waiting to feel confident.</li>
<li>Break intimidating challenges into manageable steps.</li>
<li>Use AI as a structured reflection and planning partner.</li>
<li>Create a personal <strong>Steady Mind Response Plan</strong>.</li>
</ol>
${SUPPORT}

<h2>Module 5 diagnostic — My Steady Mind</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m5-diagnostic")}
<p><strong>Important:</strong> this is a learning tool, not a psychological assessment or diagnosis. Your score is not a measure of your worth, personality or future success. It simply provides a starting point for Days 13–15.</p>
`,
    exercises: [
      {
        exerciseId: "m5-diagnostic",
        title: "My Steady Mind Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Emotional awareness",
              statements: [
                "I notice when my emotional state changes.",
                "I can describe what I am feeling rather than simply saying I feel bad.",
                "I recognise when emotion is influencing a decision.",
                "I can pause before reacting when something upsets me.",
                "I can distinguish what happened from what I think it means.",
              ],
            },
            {
              title: "Resilience",
              statements: [
                "I can recover and continue after disappointment.",
                "I can learn something useful from setbacks.",
                "I can adjust a plan without abandoning the overall goal.",
                "I can recognise previous difficulties I successfully handled.",
                "I can ask for appropriate help when facing difficulty.",
              ],
            },
            {
              title: "Courageous action",
              statements: [
                "I take action even when I do not feel completely confident.",
                "I can break intimidating challenges into smaller actions.",
                "I am willing to receive useful feedback.",
                "I experiment rather than waiting for perfect certainty.",
                "I deliberately do things that help me grow beyond my current comfort zone.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 26, title: "Exploring", text: "You are beginning to examine how you respond to emotion, setbacks and uncertainty." },
            { min: 27, max: 38, title: "Developing", text: "You demonstrate some useful resilience and awareness, but your responses may vary considerably depending on circumstances." },
            { min: 39, max: 50, title: "Building", text: "You are developing a practical ability to recognise challenges, adjust and continue moving forward." },
            { min: 51, max: 62, title: "Intentional", text: "You demonstrate strong awareness of your responses and are increasingly deliberate about how you act under pressure." },
            { min: 63, max: 75, title: "Designing", text: "You demonstrate a highly developed approach to emotional awareness, resilience and courageous action." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 13
  {
    lessonId: "m5-day-13",
    title: "Module 5 · Day 13 — Emotional Resilience",
    lessonOrder: 22,
    duration: "60–75 minutes",
    objective: "The space between what happens and what you do.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>When something difficult happens, do you respond to the event — or to the meaning you have given the event?</p></blockquote>
${talk("The Steady Mind: learning to respond rather than automatically react", `
Life does not always cooperate with our plans. You can prepare carefully for an interview and still be rejected. You can build a business idea and discover that customers do not want it. You can work hard and still receive criticism. You can make plans and have circumstances change them.

The question is not whether difficult things will happen. They will. The more useful question is: <strong>What happens inside you after they happen?</strong>

Consider this example. Two people apply for the same opportunity. Both receive a rejection.

The first person thinks: "I failed. This proves I am not good enough." They feel discouraged. They stop applying.

The second person thinks: "I did not get this opportunity. I need to understand why." They feel disappointed too. But they ask for feedback, review their application and try again.

The event was similar. The interpretation was different. And that interpretation influenced what happened next.

This does not mean you can simply think positively and make every problem disappear. It means you can learn to identify the space between <strong>event</strong> and <strong>response</strong>.

That space gives you an opportunity to pause. Ask: What actually happened? What am I assuming? What am I feeling? What evidence do I have? What response would help me move forward?

The goal is not to suppress emotion. Emotion contains information. The goal is to avoid automatically turning an emotional reaction into a decision.

A steady mind is not a mind that never feels fear, disappointment or frustration. It is a mind that can notice those experiences and still make deliberate choices.

Today, you are going to practise creating that space.`)}

<h2>Reading — Event → Interpretation → Response</h2>
<p>Imagine receiving an email saying: <em>"Thank you for your application. Unfortunately, you have not been selected."</em> That is the event. But your mind may say: <em>"They don't think I'm capable." "This always happens to me." "I'll never get another opportunity." "Maybe I'm not good enough."</em></p>
<p>Those statements are interpretations. They may feel completely true in the moment. But feeling certain about something does not automatically make the interpretation a fact. Try separating the layers:</p>
${table(["Layer", "Response 1", "Response 2"], [
  ["Event", "I was not selected.", "I was not selected."],
  ["Interpretation", "They don't think I am capable.", "This opportunity did not work out."],
  ["Emotion", "Disappointed and embarrassed.", "Disappointed."],
  ["Decision", "I should stop applying.", "I will find out what I can learn."],
  ["Action", "I do not apply again.", "Ask for feedback and improve."],
  ["Result", "Fewer opportunities.", "New information and another opportunity to try."],
])}
<p>The second response does not pretend rejection feels good. It simply creates more room for learning.</p>

<h2>The Steady Mind Pause</h2>
<ol>
<li><strong>Pause</strong> — do not immediately act.</li>
<li><strong>Identify</strong> — what actually happened?</li>
<li><strong>Name</strong> — what am I feeling?</li>
<li><strong>Separate</strong> — what is fact and what is interpretation?</li>
<li><strong>Consider</strong> — what are several possible responses?</li>
<li><strong>Choose</strong> — which response is most constructive and appropriate?</li>
<li><strong>Act</strong> — take the next deliberate step.</li>
</ol>

<h2>Interactive example — James's proposals</h2>
<p>James sends a proposal to five potential clients. Nobody responds during the first week.</p>
${table(["", ""], [
  ["Automatic interpretation", "\"Nobody wants what I offer.\""],
  ["Emotional response", "Disappointment."],
  ["Automatic action", "James stops contacting potential clients."],
  ["Alternative interpretation", "\"I have not received responses yet. I do not know why.\""],
  ["Better questions", "Was the message clear? Was I contacting the right people? Was the problem relevant? Did I communicate the value clearly? Did I follow up? Do I need more conversations?"],
  ["New action", "Speak to five potential customers and ask for feedback."],
])}
<p>The goal is not to force the original idea to succeed. The goal is to <strong>learn enough to make the next decision better.</strong></p>

<h2>Case study — Amina's difficult conversation</h2>
<p>Amina manages a small team. One day, a colleague tells her: <em>"Sometimes your instructions are unclear."</em> Amina immediately feels embarrassed. Her first thought is: <em>"I'm obviously a terrible manager."</em> She considers avoiding the colleague. Instead, she pauses.</p>
<ol>
<li><strong>Event:</strong> a colleague said some of my instructions are unclear.</li>
<li><strong>Interpretation:</strong> "I am a terrible manager."</li>
<li><strong>Emotion:</strong> embarrassment and frustration.</li>
<li><strong>Evidence check:</strong> is it true that every instruction I give is unclear? No. Could there still be something useful in the feedback? Yes.</li>
<li><strong>Constructive response:</strong> "Can you give me an example of when my instructions were unclear?"</li>
</ol>
<p>The conversation provides useful information, and Amina changes how she communicates tasks. She has not turned criticism into a judgement about her entire identity. <strong>She has turned it into information.</strong></p>

<h2>Learner activity — The Event–Interpretation–Response Map</h2>
<p>Think of one recent difficult situation.</p>
${block("exercise", "d13-map")}

<h2>AI practical exercise — Steady Mind Reflection Partner</h2>
<p>Your reflection partner can bring in your map. It is a <strong>structured thinking partner</strong>, not a replacement for personal judgement or appropriate human support.</p>
${block("coach", "d13-reflection-partner")}

<h2>Scenario-based activity — What would you do?</h2>
<p>You have spent three months preparing for a professional qualification. You fail the final assessment.</p>
${block("scenario", "d13-qualification")}

<h2>Real-world challenge — The Steady Mind Challenge</h2>
<p>Before the end of today, notice one moment when something does not go according to plan, you become frustrated, you feel disappointed or you experience uncertainty. Use <strong>Pause → Identify → Name → Separate → Consider → Choose → Act</strong>, and record what happened.</p>
${block("exercise", "d13-challenge")}

<h2>Day 13 reflection</h2>
${block("exercise", "d13-reflection")}

<h2>Day 13 quiz</h2>
${block("quiz")}

<h2>Day 13 assignment — Event–Interpretation–Response Analysis</h2>
${block("exercise", "d13-assignment")}
`,
    exercises: [
      {
        exerciseId: "d13-map",
        title: "My Event–Interpretation–Response Map",
        fields: [
          field("happened", "What happened?"),
          field("meant", "What did I immediately think it meant?"),
          field("emotion", "What emotion did I experience?"),
          field("wanted", "What did I want to do?"),
          field("did", "What did I actually do?"),
          field("afterwards", "What happened afterwards?"),
          field("fact", "What was fact?"),
          field("interpretation", "What was interpretation?"),
          field("alternative", "What alternative interpretation could exist?"),
          field("learn", "What could I learn?"),
          field("differently", "What might I do differently next time?"),
        ],
      },
      {
        exerciseId: "d13-challenge",
        title: "My Steady Mind moment",
        fields: [
          field("happened", "What happened:"),
          field("pause", "How I used Pause → Identify → Name → Separate → Consider → Choose → Act:"),
          field("result", "What I chose to do, and what happened:"),
        ],
      },
      {
        exerciseId: "d13-reflection",
        title: "Day 13 reflection",
        fields: [
          field("emotion", "1. What emotion do I find most difficult to manage constructively?"),
          field("triggers", "2. What situations commonly trigger it?"),
          field("react", "3. Do I usually react immediately or pause?"),
          field("interpretation", "4. What interpretation do I commonly make in difficult situations?"),
          field("steadier", "5. What would a steadier response look like?"),
        ],
      },
      {
        exerciseId: "d13-assignment",
        title: "Event–Interpretation–Response Analysis",
        intro: "Analyse one real situation: what happened, your initial interpretation, your emotional response, your decision, your action, the result, fact versus interpretation, an alternative interpretation, what you learned and what you would try differently next time.",
        fields: [words("analysis", "My analysis (400–600 words)", 400, 600)],
      },
    ],
    scenarios: [
      {
        scenarioId: "d13-qualification",
        title: "The failed qualification",
        question: "Which response is most useful?",
        options: [
          "\"I clearly cannot do this, so I should give up.\"",
          "\"The assessment does not matter.\"",
          "\"I am disappointed. I need to understand what went wrong, identify what I can improve and decide what to do next.\"",
          "\"I will immediately register again without changing anything.\"",
        ],
        answer: 2,
        explanation: "C recognises the emotion without allowing the emotion to automatically determine the next action.",
      },
    ],
    coaches: [
      {
        coachId: "d13-reflection-partner",
        title: "Steady Mind Reflection Partner",
        intro: "A neutral thinking partner that helps you separate what happened from what you told yourself it meant — then find a next step you can evaluate yourself.",
        usesExercises: ["d13-map"],
        promptTemplate:
          "Act as a neutral reflection and thinking partner.\n\nI am going to describe a difficult situation I experienced.\n\nHelp me separate:\n\n1. What actually happened\n2. What I interpreted it to mean\n3. What thoughts followed\n4. What emotions I experienced\n5. What decision I made\n6. What action I took\n7. What happened afterwards\n8. What I can learn\n\nThen help me identify at least three possible interpretations of the situation and distinguish facts from assumptions.\n\nDo not diagnose me.\n\nDo not tell me what decision I must make.\n\nAsk questions where important information is missing.\n\nHelp me identify a constructive next step that I can evaluate for myself.\n\nHere is the situation:\n\n[PASTE YOUR ANSWERS]",
        systemPrompt:
          "Exercise: Day 13 — Steady Mind reflection partner. Help the learner separate their situation into: what actually happened, what they interpreted it to mean, thoughts that followed, emotions, decision, action, what happened afterwards, and what they can learn. Clearly label facts versus assumptions. Offer at least three plausible alternative interpretations, presented as possibilities, not corrections. Ask about important missing information rather than guessing. Acknowledge feelings without dismissing them or pushing forced positivity. Never diagnose, never tell them what they must decide; close by helping them identify one constructive next step they can evaluate themselves. If the situation involves harm, abuse, or feeling unsafe, follow the safeguarding rules.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the difference between an event and an interpretation?",
        ["They are exactly the same.", "An event is what happened; an interpretation is the meaning we give it.", "An interpretation is always factual.", "Events are always within our control."],
        1, "Separating the two creates space to choose a response."),
      q("What is the purpose of pausing?", ["To avoid all emotion.", "To make difficult situations disappear.", "To create space before choosing a response.", "To ignore the problem."],
        2, "The pause is the space between event and response."),
      q("Which statement is an interpretation?", ["\"The interview ended at 3pm.\"", "\"I received an email.\"", "\"They must think I am useless.\"", "\"The application was unsuccessful.\""],
        2, "The others are observable facts; \"they must think I am useless\" is a meaning we've added."),
      q("What does emotional resilience involve?",
        ["Never feeling negative emotions.", "Pretending problems do not matter.", "Recognising difficult experiences and responding constructively.", "Always remaining positive."],
        2, "A steady mind still feels emotion — it just doesn't let emotion automatically decide."),
      q("Which sequence best represents the Steady Mind process?",
        ["React → blame → withdraw → forget", "Pause → identify → name → separate → consider → choose → act", "Feel → decide → justify → act", "Avoid → delay → ignore → continue"],
        1, "The Steady Mind Pause: pause, identify, name, separate, consider, choose, act."),
    ],
  },

  // ---------------------------------------------------------------- day 14
  {
    lessonId: "m5-day-14",
    title: "Module 5 · Day 14 — Evidence of Resilience",
    lessonOrder: 23,
    duration: "60–75 minutes",
    objective: "You have already survived things you once thought you could not.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What evidence already exists that you can handle difficulty?</p></blockquote>
${talk("Your resilience has a history", `
You may sometimes think you are not resilient. But consider something. You have already experienced situations that once seemed impossible.

Perhaps you moved to a new environment. Perhaps you learned something difficult. Perhaps you recovered from disappointment. Perhaps you had to start again. Perhaps you dealt with uncertainty you did not expect.

You may not have handled everything perfectly. That is not the point. Resilience does not mean that difficulty has no effect on you. It means that difficulty does not automatically determine the rest of your story.

Today, we are going to look backwards. Not to live in the past. But to collect evidence.

Think of ten difficult situations you have already experienced. For each one, ask: What happened? How did I respond? Who helped me? What did I learn? What capability did I develop? What did I discover about myself?

You may discover that your history contains more evidence of adaptability than you previously noticed.

Then we will take the exercise further. Instead of asking "Can I handle this?" you can begin asking: "What evidence do I have about how I have handled difficult things before?"

That does not guarantee that a future challenge will be easy. But it gives you a more complete picture of yourself.

Your past is not a prison. It can also be evidence.`)}

<h2>Reading — Resilience is not the same as enduring everything</h2>
<p>A common misunderstanding is that a resilient person simply keeps going no matter what. That is incomplete.</p>
<p>Sometimes resilience means continuing. Sometimes it means changing direction. Sometimes it means asking for help. Sometimes it means resting. Sometimes it means setting a boundary. Sometimes it means accepting that a particular approach is not working. Sometimes resilience is knowing when to stop doing something that is causing unnecessary harm.</p>
<p>Instead of asking <em>"How do I force myself through this?"</em>, ask:</p>
<blockquote><p>What response helps me move through this situation constructively?</p></blockquote>

<h2>The five sources of resilience</h2>
<ol>
<li><strong>Experience</strong> — things you have already survived or learned from.</li>
<li><strong>Skills</strong> — capabilities that help you solve problems.</li>
<li><strong>People</strong> — friends, colleagues, mentors, family, teachers and professional support.</li>
<li><strong>Systems</strong> — routines, planning, organisation and practical structures.</li>
<li><strong>Meaning</strong> — understanding why something matters to you.</li>
</ol>
<p>A resilient approach often combines several of these.</p>
${SUPPORT}

<h2>Resilience inventory</h2>
<p>List up to ten difficult experiences. Choose ones you feel comfortable reflecting on.</p>
${block("exercise", "d14-inventory")}

<h2>The "I once thought I couldn't" exercise</h2>
<p>Complete five statements. This is not about pretending you can do anything — it is about identifying <strong>real evidence</strong> from your own experience.</p>
${block("exercise", "d14-once")}

<h2>Case study — David starts again</h2>
<p>David's first attempt at running an online business produced almost no sales. He initially concluded: <em>"I am not entrepreneurial."</em> He stopped.</p>
<p>Several months later, he reviewed what happened. He realised he had not spoken to enough potential customers; he had built the product before understanding the problem; he had relied heavily on assumptions; he had not tested his pricing; and he had received useful feedback but ignored some of it.</p>
<p>His first attempt had failed to produce the result he wanted. But the experience had produced information. His new interpretation became:</p>
<blockquote><p>My first approach did not work. I now understand more about what I need to test.</p></blockquote>
<p>He started again with a smaller experiment. What changed? Not the past. <strong>His use of the past changed.</strong></p>

<h2>Interactive example — From setback to evidence</h2>
${table(["", ""], [
  ["Situation", "\"I was unsuccessful in three job applications.\""],
  ["Unhelpful conclusion", "\"I am unemployable.\""],
  ["Evidence-based analysis", "Three applications were unsuccessful. I do not yet know the complete reasons. I can review my CV. I can ask for feedback where available. I can compare my skills against job requirements. I can improve interview preparation. I can increase the number and quality of applications."],
  ["New question", "\"What information can these experiences give me?\""],
])}

<h2>Learner activity — Build your Resilience Evidence Bank</h2>
<p>Examples of capabilities: adaptability, communication, persistence, organisation, problem solving, patience, independence, collaboration, learning, asking for help. Do not simply copy the examples — use evidence from your own experience.</p>
${block("exercise", "d14-bank")}

<h2>AI practical exercise — AI Resilience Evidence Partner</h2>
<p>Your evidence partner can bring in your inventory and "I once thought I couldn't" statements.</p>
${block("coach", "d14-evidence")}

<h2>Scenario-based activity</h2>
<p>You have been rejected from three opportunities.</p>
${block("scenario", "d14-rejections")}

<h2>Real-world challenge — Ask for useful feedback</h2>
<p>Choose one appropriate situation where feedback could help you improve. Ask a trusted person: <em>"What is one thing I could improve in this area?"</em> Do not immediately defend yourself. Listen. Write down what you heard. Then ask: <em>"What part of this feedback can I use?"</em> You do not have to accept every opinion. You do need to learn how to evaluate feedback.</p>
${block("exercise", "d14-feedback")}

<h2>Day 14 reflection</h2>
${block("exercise", "d14-reflection")}

<h2>Day 14 quiz</h2>
${block("quiz")}

<h2>Day 14 assignment — My Resilience Evidence Report</h2>
${block("exercise", "d14-assignment")}
`,
    exercises: [
      {
        exerciseId: "d14-inventory",
        title: "My resilience inventory",
        table: {
          columns: ["Difficult experience", "What I did", "What helped", "What I learned", "Capability developed"],
          rows: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
        },
      },
      {
        exerciseId: "d14-once",
        title: "\"I once thought I couldn't\"",
        table: {
          columns: ["I once thought I could not…", "I eventually…", "What helped me was…", "What I learned was…", "This tells me that I am capable of…"],
          rows: ["Statement 1", "Statement 2", "Statement 3", "Statement 4", "Statement 5"],
        },
      },
      {
        exerciseId: "d14-bank",
        title: "My Resilience Evidence Bank",
        fields: [
          field("got-through", "10 things I have already got through:"),
          field("once-thought", "5 difficult things I once thought I could not handle:"),
          field("capabilities", "5 capabilities I developed because of difficult experiences (with evidence):"),
        ],
      },
      {
        exerciseId: "d14-feedback",
        title: "Feedback I asked for",
        fields: [
          field("asked", "Who I asked and about what:"),
          field("heard", "What I heard:"),
          field("use", "What part of this feedback can I use?"),
        ],
      },
      {
        exerciseId: "d14-reflection",
        title: "Day 14 reflection",
        fields: [
          field("most", "1. What difficult experience taught me the most?"),
          field("capability", "2. What capability did I develop because of it?"),
          field("underestimated", "3. What did I previously underestimate about myself?"),
          field("helped", "4. Who has helped me through difficult situations?"),
          field("future", "5. What does my resilience evidence tell me about how I can approach future challenges?"),
        ],
      },
      {
        exerciseId: "d14-assignment",
        title: "My Resilience Evidence Report",
        intro: "Include three significant challenges; how you responded; what helped; what you learned; capabilities developed; one mistake or limitation you recognise; one example of adapting; one example of asking for help; and three principles you want to carry into future challenges.",
        fields: [
          words("report", "My report (500–700 words)", 500, 700),
          field("remember", "\"When something goes wrong in the future, I want to remember…\""),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d14-rejections",
        title: "Three rejections",
        question: "Which response demonstrates evidence-based resilience?",
        options: [
          "\"Nobody wants me.\"",
          "\"I will pretend the rejections did not happen.\"",
          "\"I will review what happened, identify what I can learn, improve what I can control and continue testing opportunities.\"",
          "\"I will apply for everything without changing anything.\"",
        ],
        answer: 2,
        explanation: "The objective is not blind persistence. It is informed persistence and adaptation.",
      },
    ],
    coaches: [
      {
        coachId: "d14-evidence",
        title: "AI Resilience Evidence Partner",
        intro: "Organises your difficult experiences into evidence — only patterns your own answers support, no exaggeration and no personality labels.",
        usesExercises: ["d14-inventory", "d14-once"],
        promptTemplate:
          "I want to identify evidence of resilience from my own life.\n\nI will describe several difficult experiences.\n\nFor each experience, help me organise the information under:\n\n1. What happened\n2. What I did\n3. What helped\n4. What I learned\n5. What capability I developed\n6. What evidence this provides about how I respond to difficulty\n\nDo not exaggerate my abilities.\n\nDo not diagnose me.\n\nDo not tell me what my personality is.\n\nOnly identify patterns supported by the information I provide.\n\nWhere evidence is missing, ask me a question rather than inventing an answer.\n\nHere are my experiences:\n\n[PASTE YOUR ANSWERS]",
        systemPrompt:
          "Exercise: Day 14 — resilience evidence partner. For each experience the learner describes, organise it under: what happened, what they did, what helped, what they learned, capability developed, and what evidence it provides about how they respond to difficulty. Only state patterns directly supported by their words; where evidence is missing, ask a question instead of inventing. Do not exaggerate, flatter, diagnose, or label their personality. Where relevant, note which of the five sources of resilience (experience, skills, people, systems, meaning) each example draws on. Be gentle if experiences are painful; don't press for details they haven't offered. If anything suggests current harm or danger, follow the safeguarding rules.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is resilience?",
        ["Never experiencing difficulty.", "Always continuing regardless of circumstances.", "Developing the ability to respond, adapt and learn through difficulty.", "Avoiding all risk."],
        2, "Resilience can mean continuing, changing direction, resting, asking for help or setting a boundary."),
      q("Which is evidence of resilience?", ["\"I am naturally strong.\"", "\"I successfully adapted to a difficult change.\"", "\"Nothing affects me.\"", "\"I never need help.\""],
        1, "Evidence is something you actually did, not a label about yourself."),
      q("Why create a resilience evidence bank?",
        ["To prove you are better than others.", "To collect evidence from your own experience about how you have handled difficulty.", "To avoid future challenges.", "To ignore mistakes."],
        1, "Your past can be evidence, not just a memory."),
      q("Which can be part of resilience?", ["Asking for appropriate help.", "Refusing to change.", "Ignoring feedback.", "Pretending everything is fine."],
        0, "People are one of the five sources of resilience."),
      q("What should you do with feedback?",
        ["Accept every opinion as truth.", "Reject every criticism.", "Evaluate it and identify what may be useful.", "Immediately change everything about yourself."],
        2, "You don't have to accept every opinion, but you do need to evaluate it."),
    ],
  },

  // ---------------------------------------------------------------- day 15
  {
    lessonId: "m5-day-15",
    title: "Module 5 · Day 15 — Courage Through Action",
    lessonOrder: 24,
    duration: "60–75 minutes",
    objective: "Confidence often comes after action.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What would you attempt if you stopped waiting to feel completely ready?</p></blockquote>
${talk("Courage is a behaviour", `
Many people wait for confidence before taking action. They say: "When I feel ready, I'll apply." "When I know enough, I'll start." "When I become more confident, I'll speak." "When I stop being nervous, I'll try."

But confidence does not always come first. Sometimes action comes first. You take a small step. You discover that you can survive the discomfort. You learn something. You improve. Then your confidence changes.

This does not mean ignoring risk. Courage is not the absence of fear. It is taking an appropriate action while recognising that uncertainty exists.

The key word is <strong>appropriate</strong>. You do not need to take reckless risks. You need to identify the next useful challenge.

Perhaps that means asking a question, making a phone call, publishing your first piece of work, applying for an opportunity, asking for feedback, speaking in a meeting, testing a business idea, learning a new skill, or having a difficult but respectful conversation.

Today you will build a Courage Ladder. Instead of asking "What's the biggest thing I could possibly do?", ask: "What is one step beyond my current comfort zone that I can realistically attempt?"

Then take that step. Because every action creates evidence. And evidence can change how you see yourself.`)}

<h2>Reading — The Courage Ladder</h2>
<p>Imagine a challenge that currently feels uncomfortable — for example, <em>"I want to start offering my skills as a service."</em> Do not immediately jump to <em>"Launch a company."</em> Build a ladder:</p>
${table(["Level", "Action"], [
  ["1 — Explore", "Research what customers need."],
  ["2 — Learn", "Develop one relevant skill."],
  ["3 — Practise", "Create a sample service."],
  ["4 — Share", "Show it to someone."],
  ["5 — Ask", "Ask for feedback."],
  ["6 — Test", "Offer it to one potential customer."],
  ["7 — Repeat", "Improve and test again."],
])}
<p>The ladder transforms <strong>big fear</strong> into <strong>smaller actions</strong>.</p>

<h2>The Courage Ladder exercise</h2>
<p>Choose one thing you have been avoiding. You do not necessarily have to complete all seven steps — the objective is to identify the <strong>next appropriate step</strong>.</p>
${block("exercise", "d15-ladder")}

<h2>Case study — Samuel's first presentation</h2>
<p>Samuel wants to become a consultant. He believes he needs to be an excellent public speaker first. So he keeps preparing. He watches videos. He reads books. He writes scripts. But he never presents.</p>
<p>His mentor suggests a smaller challenge:</p>
<ul>
<li><strong>Week 1:</strong> explain his idea to one friend.</li>
<li><strong>Week 2:</strong> explain it to three colleagues.</li>
<li><strong>Week 3:</strong> record a five-minute presentation.</li>
<li><strong>Week 4:</strong> present to a small group.</li>
</ul>
<p>Samuel discovers that he does not need to become fearless. He needs practice. Each action produces evidence. <strong>His confidence develops from experience.</strong></p>

<h2>Interactive example — Waiting for confidence vs building confidence</h2>
<p><em>"I want to apply for a job, but I don't meet every requirement."</em></p>
${table(["", "Waiting approach", "Action approach"], [
  ["Thinking", "\"I will apply when I feel qualified.\"", "\"I meet several requirements. I will examine the gaps, improve what I can and decide whether the opportunity is reasonable to pursue.\""],
  ["Result", "No application. No feedback. No experience.", "Application. Possible feedback. Possible interview. More information. More experience."],
])}
<p>The second approach does not guarantee success. It creates an opportunity to learn.</p>

<h2>Learner activity — Your Courage Challenge</h2>
${block("exercise", "d15-challenge")}

<h2>AI practical exercise — AI Courage Ladder Builder</h2>
<p>Your ladder builder can bring in your Courage Ladder and Courage Challenge.</p>
${block("coach", "d15-ladder-builder")}

<h2>Scenario-based activity — The opportunity</h2>
<p>Grace sees an advertisement for a role she would like. She meets most of the requirements but not all of them.</p>
${block("scenario", "d15-grace")}

<h2>Real-world challenge — One courageous action</h2>
<p>Within the next 48 hours, complete <strong>one appropriate action</strong> that moves you beyond your current comfort zone: ask for feedback; submit an application; contact a potential customer; publish something; make a presentation; ask a useful question; start a learning project; request a meeting; or test an idea.</p>
${block("exercise", "d15-action")}

<h2>Day 15 reflection</h2>
${block("exercise", "d15-reflection")}

<h2>Day 15 quiz</h2>
${block("quiz")}

<h2>Day 15 assignment — My Courage Through Action Plan</h2>
${block("exercise", "d15-assignment")}
`,
    exercises: [
      {
        exerciseId: "d15-ladder",
        title: "My Courage Ladder",
        fields: [
          field("challenge", "My challenge:"),
          field("matters", "Why it matters:"),
          field("uncomfortable", "What makes it uncomfortable:"),
          field("l1", "Level 1 — Explore:"),
          field("l2", "Level 2 — Learn:"),
          field("l3", "Level 3 — Practise:"),
          field("l4", "Level 4 — Share:"),
          field("l5", "Level 5 — Ask:"),
          field("l6", "Level 6 — Test:"),
          field("l7", "Level 7 — Commit:"),
        ],
      },
      {
        exerciseId: "d15-challenge",
        title: "My Courage Challenge",
        fields: [
          field("want", "Something I want to do:"),
          field("matters", "Why it matters:"),
          field("afraid", "What I am afraid might happen:"),
          field("control", "What is within my control:"),
          field("outside", "What is outside my control:"),
          field("smallest", "The smallest meaningful action:"),
          field("when", "When I will do it:"),
          field("evidence", "What evidence will tell me what I learned?"),
        ],
      },
      {
        exerciseId: "d15-action",
        title: "My courageous action",
        fields: [
          field("did", "What I did:"),
          field("before", "How I felt before:"),
          field("happened", "What actually happened:"),
          field("learned", "What I learned:"),
          field("next", "What I might do next:"),
        ],
      },
      {
        exerciseId: "d15-reflection",
        title: "Day 15 reflection",
        fields: [
          field("avoiding", "1. What am I currently avoiding?"),
          field("why", "2. Why am I avoiding it?"),
          field("assumption", "3. What assumption is behind the avoidance?"),
          field("smallest", "4. What is the smallest useful action I could take?"),
          field("learn", "5. What might I learn by taking that action?"),
        ],
      },
      {
        exerciseId: "d15-assignment",
        title: "My Courage Through Action Plan",
        intro: "Include: the challenge; why it matters; what makes it uncomfortable; the assumptions behind your hesitation; what is within your control; your seven-step Courage Ladder; the first action you will take; what evidence you will collect; what you will do if the first attempt does not work; and what you hope to learn.",
        fields: [words("plan", "My plan (400–600 words)", 400, 600)],
      },
    ],
    scenarios: [
      {
        scenarioId: "d15-grace",
        title: "Grace's opportunity",
        question: "What would be the most useful approach?",
        options: [
          "Never apply unless she meets every requirement.",
          "Apply immediately without checking whether the role is appropriate.",
          "Identify her strengths and gaps, assess the opportunity realistically and consider applying while addressing relevant gaps.",
          "Assume the employer will reject her.",
        ],
        answer: 2,
        explanation: "C combines courage with judgement. The lesson is not \"Always take the risk.\" It is: \"Do not allow uncertainty alone to make the decision for you.\"",
      },
    ],
    coaches: [
      {
        coachId: "d15-ladder-builder",
        title: "AI Courage Ladder Builder",
        intro: "Asks about your challenge, then helps you build seven realistic steps from exploring to testing — highlighting assumptions, never pushing unsafe risks or deciding for you.",
        usesExercises: ["d15-ladder", "d15-challenge"],
        promptTemplate:
          "Help me turn a challenge I am avoiding into a realistic Courage Ladder.\n\nMy challenge is:\n\n[PASTE YOUR ANSWERS]\n\nAsk me questions about:\n\n- why it matters;\n- what makes it uncomfortable;\n- what I already know;\n- what I do not yet know;\n- what risks are involved;\n- what is within my control;\n- what support I have.\n\nThen help me create seven progressively challenging actions from exploration to testing.\n\nDo not encourage reckless or unsafe behaviour.\n\nDo not decide for me.\n\nHighlight assumptions I may be making and suggest small experiments where appropriate.",
        systemPrompt:
          "Exercise: Day 15 — Courage Ladder builder. First ask about the learner's challenge one or two questions at a time: why it matters, what makes it uncomfortable, what they already know and don't yet know, risks, what's within their control, and support available. Then help them build seven progressively challenging steps (Explore, Learn, Practise, Share, Ask, Test, Commit), each small and concrete, and help them identify the next appropriate step. Name assumptions behind their hesitation and suggest small experiments. Courage means appropriate action: never encourage reckless, unsafe, illegal or financially risky steps (e.g. quitting a job or borrowing money on impulse); for anything with significant risk, suggest checking with a trusted adult or professional. Don't decide for them.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is courage?",
        ["Never feeling fear.", "Ignoring all risk.", "Taking appropriate action despite uncertainty or discomfort.", "Always taking the biggest possible risk."],
        2, "Courage isn't the absence of fear — and the key word is appropriate."),
      q("Why use a Courage Ladder?",
        ["To eliminate all uncertainty.", "To turn a large challenge into progressive actions.", "To guarantee success.", "To avoid difficult situations."],
        1, "The ladder turns big fear into smaller actions."),
      q("Where can confidence come from?",
        ["Only from natural personality.", "From action, practice, feedback and evidence.", "From avoiding failure.", "From pretending to be confident."],
        1, "Like Samuel, confidence often develops from experience."),
      q("Which is an example of a useful small experiment?",
        ["Launching a major business without testing the idea.", "Never taking action until everything is certain.", "Speaking to potential customers before building a full solution.", "Ignoring feedback."],
        2, "A small, low-risk test that produces evidence."),
      q("What should you consider before taking a courageous action?",
        ["Only whether you are afraid.", "Risks, evidence, what is within your control and the next appropriate step.", "Whether everyone else agrees.", "Whether success is guaranteed."],
        1, "Courage combined with judgement."),
    ],
  },

  // ---------------------------------------------------------------- module 5 assessment
  {
    lessonId: "m5-assessment",
    title: "Module 5 · The Steady Mind Assessment",
    lessonOrder: 25,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 13–15 together in your 50-mark Steady Mind assessment and personal response plan.",
    contentBody: `
<h2>Module 5 — 50-mark assessment: The Steady Mind</h2>
<p>This assessment combines the learning from Days 13–15. Your daily work is a good starting point.</p>

<h2>Part A — Event–Interpretation analysis (10 marks)</h2>
<p>Analyse a difficult situation using Event, Interpretation, Emotion, Decision, Action, Result and Learning.</p>
${block("exercise", "m5-part-a")}
${marking([["Clear description of event", "2"], ["Identification of interpretation", "2"], ["Emotional awareness", "2"], ["Response/action analysis", "2"], ["Learning identified", "2"]])}

<h2>Part B — Resilience evidence (10 marks)</h2>
<p>Provide three examples of previous challenges.</p>
${block("exercise", "m5-part-b")}
${marking([["Three relevant examples", "3"], ["Evidence of response", "2"], ["Learning identified", "2"], ["Capabilities identified", "2"], ["Reflection quality", "1"]])}

<h2>Part C — Setback case analysis (10 marks)</h2>
<p>Choose a setback and analyse it.</p>
${block("exercise", "m5-part-c")}
${marking([["Event identified clearly", "2"], ["Interpretation identified", "2"], ["Alternative perspective", "2"], ["Response options", "2"], ["Reasoned learning approach", "2"]])}

<h2>Part D — Courage Ladder (10 marks)</h2>
<p>Create a seven-step Courage Ladder for a meaningful challenge.</p>
${block("exercise", "m5-part-d")}
${marking([["Challenge clearly defined", "2"], ["Seven progressive steps", "3"], ["Appropriate risk awareness", "2"], ["Evidence/feedback identified", "1"], ["First action clearly defined", "2"]])}

<h2>Part E — Personal Steady Mind Response Plan (10 marks)</h2>
<p>Create your personal response system. <strong>When something difficult happens…</strong></p>
${block("exercise", "m5-part-e")}
${marking([["Clear response process", "2"], ["Emotional awareness", "2"], ["Fact/interpretation distinction", "2"], ["Action strategy", "2"], ["Reflection/learning strategy", "2"]])}

<h2>Module 5 performance</h2>
<ul>
<li><strong>40–50 — Strong Application.</strong> You have demonstrated strong practical application of the module's concepts.</li>
<li><strong>30–39 — Developing Application.</strong> You understand the core ideas and are beginning to apply them consistently.</li>
<li><strong>20–29 — Foundation Level.</strong> You have demonstrated some understanding but need more practice applying the frameworks.</li>
<li><strong>Below 20 — Review Days 13–15.</strong> Return to the lessons, repeat the practical exercises and resubmit the assessment.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E against the marking criteria. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m5-assessment-review")}

<h2>Your Module 5 submission</h2>
${block("portfolio")}

<h2>The 7-day Steady Mind challenge</h2>
<p>For the next seven days, keep a <strong>Steady Mind Log</strong>. Each day record one situation.</p>
${block("exercise", "m5-log")}
<p>At the end of seven days, answer:</p>
<blockquote><p>What changed when I became more aware of how I respond to difficult situations?</p></blockquote>
${block("exercise", "m5-log-reflection")}

<h2>The BSOE Steady Mind Framework</h2>
<p>Leave Module 5 with this simple framework. <strong>When something happens:</strong></p>
<ol>
<li><strong>Pause</strong> — don't automatically react.</li>
<li><strong>Identify</strong> — what actually happened?</li>
<li><strong>Name</strong> — what am I feeling?</li>
<li><strong>Separate</strong> — what is fact? What is interpretation?</li>
<li><strong>Consider</strong> — what are my possible responses?</li>
<li><strong>Choose</strong> — which response is constructive and appropriate?</li>
<li><strong>Act</strong> — what is my next deliberate step?</li>
<li><strong>Learn</strong> — what did this experience teach me?</li>
</ol>

<h2>Module 5 key message</h2>
<blockquote><p>An extraordinary life is not a life where nothing goes wrong.</p></blockquote>
<p>It is a life in which difficulty can become an opportunity for <strong>awareness, learning, adaptation and deliberate action.</strong></p>
<p>You cannot control every event. You cannot control every person's behaviour. You cannot guarantee every outcome. But you can develop the ability to create more space between <strong>what happens</strong> and <strong>what you do next</strong>.</p>
<p>That space can become one of the most valuable parts of your personal operating system.</p>

<h2>Module 5 outputs</h2>
<ol>
<li>My Steady Mind Diagnostic</li>
<li>My Event–Interpretation–Response Map</li>
<li>My Resilience Evidence Bank</li>
<li>My Resilience Evidence Report</li>
<li>My Courage Ladder</li>
<li>My Courage Through Action Plan</li>
<li>My Personal Steady Mind Response Plan</li>
<li>My Seven-Day Steady Mind Log</li>
<li>50-Mark Steady Mind Assessment</li>
</ol>

<h2>The journey so far</h2>
${flow([
  "Module 1 — Wake Up: What is happening in my life?",
  "Module 2 — Understand: How do I process what happens?",
  "Module 3 — Transform: Who am I becoming?",
  "Module 4 — Design: What kind of life will support that person?",
  "Module 5 — Steady: How will I remain intentional when life challenges my plans?",
])}
<p>You have moved from <strong>awareness</strong> to <strong>self-understanding</strong> to <strong>identity</strong> to <strong>future design</strong> to <strong>resilience and action</strong>.</p>

<h2>Next: Module 6 — Turn Failure Into Fuel</h2>
<blockquote><p>What if failure was not the opposite of progress, but information that could improve your next attempt?</p></blockquote>
<ul>
<li><strong>Day 16 — Rewrite Your Failure Story:</strong> move from "I failed" to "What happened, what did I learn, and what will I test next?"</li>
<li><strong>Day 17 — The Experiment Mindset:</strong> treat ideas, goals and approaches as experiments that generate evidence.</li>
<li><strong>Day 18 — Think Bigger, Test Smaller:</strong> 10-year possibility → 1-year objective → 90-day project → 30-day experiment → 7-day action → today.</li>
</ul>
<p>The next stage is not simply learning to survive setbacks. It is learning how to <strong>use them to improve the way you build your future.</strong></p>
`,
    exercises: [
      {
        exerciseId: "m5-part-a",
        title: "Part A — Event–Interpretation analysis",
        fields: [
          field("event", "Event:"),
          field("interpretation", "Interpretation:"),
          field("emotion", "Emotion:"),
          field("decision", "Decision:"),
          field("action", "Action:"),
          field("result", "Result:"),
          field("learning", "Learning:"),
        ],
      },
      {
        exerciseId: "m5-part-b",
        title: "Part B — Resilience evidence",
        table: {
          columns: ["What happened", "What I did", "What helped", "What I learned", "Capability developed"],
          rows: ["Challenge 1", "Challenge 2", "Challenge 3"],
        },
      },
      {
        exerciseId: "m5-part-c",
        title: "Part C — Setback case analysis",
        fields: [
          field("happened", "1. What happened?"),
          field("interpret", "2. What could I interpret it to mean?"),
          field("alternative", "3. What alternative interpretation could exist?"),
          field("responses", "4. What responses were available?"),
          field("best", "5. Which response would provide useful learning, and why?"),
        ],
      },
      {
        exerciseId: "m5-part-d",
        title: "Part D — Courage Ladder",
        fields: [
          field("challenge", "My meaningful challenge:"),
          field("l1", "Level 1 — Explore:"),
          field("l2", "Level 2 — Learn:"),
          field("l3", "Level 3 — Practise:"),
          field("l4", "Level 4 — Share:"),
          field("l5", "Level 5 — Ask:"),
          field("l6", "Level 6 — Test:"),
          field("l7", "Level 7 — Commit:"),
          field("risks", "Risks and how I will keep this appropriate:"),
          field("evidence", "Evidence or feedback I will collect:"),
          field("first", "My first action (what and when):"),
        ],
      },
      {
        exerciseId: "m5-part-e",
        title: "Part E — My Personal Steady Mind Response Plan",
        fields: [
          field("pause", "1. I will pause by:"),
          field("facts", "2. I will identify the facts by:"),
          field("name", "3. I will name what I am feeling:"),
          field("separate", "4. I will separate facts from interpretation by:"),
          field("consider", "5. I will consider at least three possible responses:"),
          field("choose", "6. I will choose a constructive response by considering:"),
          field("act", "7. I will take the next deliberate action:"),
          field("review", "8. I will review what happened afterwards by asking:"),
          field("help", "9. I will ask for help when:"),
          field("remind", "10. I will remind myself:"),
        ],
      },
      {
        exerciseId: "m5-log",
        title: "My Steady Mind Log",
        table: {
          columns: ["What happened?", "What did I think?", "What did I feel?", "What did I do?", "What did I learn?"],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "m5-log-reflection",
        title: "What changed when I became more aware?",
        fields: [words("reflection", "My reflection (250–500 words)", 250, 500)],
      },
    ],
    coaches: [
      {
        coachId: "m5-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the marking criteria. Its marks are indicative only.",
        usesExercises: ["m5-part-a", "m5-part-b", "m5-part-c", "m5-part-d", "m5-part-e"],
        promptTemplate:
          "Please review my Module 5 assessment, The Steady Mind (Parts A–E, 10 marks each), against the marking criteria.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 5 assessment review (formative). Mark against these criteria:\nA Event–Interpretation analysis (10): clear description of event 2; identification of interpretation 2; emotional awareness 2; response/action analysis 2; learning identified 2.\nB Resilience evidence (10): three relevant examples 3; evidence of response 2; learning identified 2; capabilities identified 2; reflection quality 1.\nC Setback case analysis (10): event identified clearly 2; interpretation identified 2; alternative perspective 2; response options 2; reasoned learning approach 2.\nD Courage Ladder (10): challenge clearly defined 2; seven progressive steps 3; appropriate risk awareness 2; evidence/feedback identified 1; first action clearly defined 2.\nE Personal Steady Mind Response Plan (10): clear response process 2; emotional awareness 2; fact/interpretation distinction 2; action strategy 2; reflection/learning strategy 2.\nFor each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 with the criterion breakdown (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review Days 13–15). State clearly that marks are indicative and the tutor gives the final mark. Assess the quality of reflection and application, never the learner's feelings or experiences themselves. Do not rewrite their work. If the content reveals current harm or danger, follow the safeguarding rules before any feedback.",
      },
    ],
    portfolio: [
      { exerciseId: "m5-part-a", title: "Part A — Event–Interpretation analysis (10 marks)", lessonId: "m5-assessment" },
      { exerciseId: "m5-part-b", title: "Part B — Resilience evidence (10 marks)", lessonId: "m5-assessment" },
      { exerciseId: "m5-part-c", title: "Part C — Setback case analysis (10 marks)", lessonId: "m5-assessment" },
      { exerciseId: "m5-part-d", title: "Part D — Courage Ladder (10 marks)", lessonId: "m5-assessment" },
      { exerciseId: "m5-part-e", title: "Part E — Personal Steady Mind Response Plan (10 marks)", lessonId: "m5-assessment" },
      { exerciseId: "m5-diagnostic", title: "My Steady Mind Diagnostic", lessonId: "m5-intro" },
      { exerciseId: "d13-map", title: "My Event–Interpretation–Response Map (Day 13)", lessonId: "m5-day-13" },
      { exerciseId: "d14-bank", title: "My Resilience Evidence Bank (Day 14)", lessonId: "m5-day-14" },
      { exerciseId: "d14-assignment", title: "My Resilience Evidence Report (Day 14)", lessonId: "m5-day-14" },
      { exerciseId: "d15-ladder", title: "My Courage Ladder (Day 15)", lessonId: "m5-day-15" },
      { exerciseId: "d15-assignment", title: "My Courage Through Action Plan (Day 15)", lessonId: "m5-day-15" },
      { exerciseId: "m5-log", title: "My Seven-Day Steady Mind Log", lessonId: "m5-assessment" },
      { exerciseId: "m5-log-reflection", title: "7-day reflection (250–500 words)", lessonId: "m5-assessment" },
    ],
  },
];
