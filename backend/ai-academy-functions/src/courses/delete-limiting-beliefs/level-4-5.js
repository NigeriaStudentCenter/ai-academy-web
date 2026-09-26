// Levels 4–5: Embodiment (Weeks 8–10) and Integration (Weeks 11–12).

const { block, q, field, numbered, flow, table, list, QUIZ_BANDS, tracks, scriptTable } = require("./kit");
const { SNAPSHOT } = require("./snapshot");

module.exports = [
  // ---------------------------------------------------------------- week 8
  {
    lessonId: "dlb-week-8",
    title: "Week 8 · Capability & Confidence Reset",
    lessonOrder: 9,
    duration: "60 minutes + action ladder",
    objective: "Rewrite beliefs about ability and readiness — and build confidence through small, repeated action.",
    contentBody: `
<p><strong>Level 4 — Embodiment</strong></p>
<h2>This week's question</h2>
<blockquote><p>What do I believe I "can't" do — and is that a fact or a feeling?</p></blockquote>

<h2>Three truths about confidence</h2>
${list([
  "<strong>Confidence comes from repeated action.</strong> People rarely feel confident first and act second. They act, survive it, learn — and confidence follows.",
  "<strong>Readiness grows through doing.</strong> Waiting to feel \"ready\" is often a capability belief in disguise.",
  "<strong>Failure is feedback.</strong> A result tells you what to adjust. It does not tell you who you are.",
])}

<h2>Fact or feeling?</h2>
<p>Many capability beliefs sound like facts but are really feelings. Test each one:</p>
${table(["\"I can't…\"", "Fact or feeling?", "More accurate version"], [
  ["\"I can't speak in public.\"", "Feeling — you can speak; it feels frightening.", "\"I find speaking in public frightening, and I haven't practised much yet.\""],
  ["\"I can't code.\"", "Partly fact — you haven't learned yet.", "\"I can't code <em>yet</em>. I could learn the basics in weeks.\""],
  ["\"I can't delegate.\"", "Feeling — you can; it feels risky.", "\"Delegating feels risky because I'm used to controlling the outcome.\""],
])}
<p>Adding <strong>\"yet\"</strong> is one of the simplest capability scripts there is.</p>

<h2>Two tracks</h2>
${tracks(
  "\"I don't have enough experience\" keeps many young people from applying, volunteering or starting. But experience is built by doing things before you feel experienced. The action ladder turns \"I can't\" into a first step small enough to take this week.",
  "High achievers often carry capability beliefs in new territory: \"I can't lead in a field I don't know.\" \"I can't handle it if this venture fails publicly.\" Past success in one area doesn't cancel doubt in another — but the same method works: small, visible steps."
)}

<h2>Exercise 1 — Capability audit</h2>
<p>List up to 10 things you believe you "can't" do. Test each one.</p>
${block("exercise", "w8-audit")}

<h2>Exercise 2 — The action ladder</h2>
<p>Choose the "can't" that matters most. Break it into five small steps, each one a little harder than the last.</p>
${block("exercise", "w8-ladder")}

<h2>Scenario</h2>
<p>Ife, 19, wants an internship but says: <em>"I'll apply when I've got more experience."</em></p>
${block("scenario", "w8-ife")}

<h2>Delete script practice — five capability scripts</h2>
${block("exercise", "w8-scripts")}

<h2>Week 8 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w8-audit",
        title: "Capability audit",
        table: {
          columns: ["I believe I can't…", "Fact or feeling?", "More accurate version (try adding \"yet\")", "Smallest first step"],
          rows: numbered("Can't", 10),
        },
      },
      {
        exerciseId: "w8-ladder",
        title: "My action ladder",
        table: { columns: ["Step", "By when"], rows: ["Step 1 (easiest)", "Step 2", "Step 3", "Step 4", "Step 5 (the goal)"] },
      },
      scriptTable("w8-scripts", "Five capability scripts", 5),
    ],
    scenarios: [
      {
        scenarioId: "w8-ife",
        title: "Ife's internship",
        question: "What would help Ife most?",
        options: [
          "Wait another year until she feels ready.",
          "Recognise \"I'll apply when I've got more experience\" as a capability belief — apply now, and treat each application as practice.",
          "Only apply for jobs she's overqualified for.",
          "Ask someone to apply on her behalf.",
        ],
        answer: 1,
        explanation: "Internships exist to give experience. Readiness grows through doing.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Where does confidence usually come from?", ["Waiting until you feel ready", "Repeated action", "Being born confident", "Other people's praise only"],
        1, "Act, survive it, learn — confidence follows."),
      q("\"I can't speak in public\" is usually:", ["A fact", "A feeling — it's frightening, not impossible", "A diagnosis", "Unchangeable"],
        1, "Test whether a 'can't' is fact or feeling."),
      q("Why add the word \"yet\"?", ["It sounds nicer", "It turns a fixed statement into one about learning", "It removes the need for action", "It isn't useful"],
        1, "\"I can't code yet\" invites learning."),
      q("What is an action ladder?", ["A list of excuses", "A goal broken into small steps of increasing difficulty", "A career plan", "A ranking of your skills"],
        1, "Each rung is small enough to take."),
      q("\"Failure is feedback\" means:", ["Failure doesn't matter", "A result tells you what to adjust, not who you are", "You should seek failure", "Feedback is always negative"],
        1, "Results inform; they don't define."),
    ],
  },

  // ---------------------------------------------------------------- week 9
  {
    lessonId: "dlb-week-9",
    title: "Week 9 · Leadership & Purpose Reset",
    lessonOrder: 10,
    duration: "60 minutes",
    objective: "Rewrite the story you tell about leadership, and lead from purpose rather than insecurity.",
    contentBody: `
<p><strong>Level 4 — Embodiment</strong></p>
<h2>This week's question</h2>
<blockquote><p>What story do I tell myself about leadership — and is it helping?</p></blockquote>

<h2>Leadership is an identity, not a title</h2>
<p>You lead whenever you influence what happens next: suggesting a plan to friends, speaking up in class, helping a new colleague, setting the tone in a meeting. Titles give authority. <strong>Leadership is influence.</strong></p>

<h2>Influence vs control</h2>
${table(["Leading through control", "Leading through influence"], [
  ["\"It has to be done my way.\"", "\"Here's where we're going — how would you get there?\""],
  ["Fear of looking weak.", "Comfortable saying \"I don't know — let's find out.\""],
  ["Can't delegate.", "Grows other people."],
])}
<p>Control often comes from a limiting belief: <em>"If I'm not in control, it will fall apart" (fear)</em> or <em>"If I'm not the best, I'm not valuable" (worthiness).</em></p>

<h2>Two tracks</h2>
${tracks(
  "Common leadership beliefs: \"I don't have the right personality to lead.\" \"I'm too young to be taken seriously.\" \"Leaders are loud.\" Reset: <em>quiet, thoughtful and young people lead too</em> — often by listening, organising and doing what they said they'd do.",
  "Common leadership beliefs: \"I can't show weakness.\" \"I'm not allowed to say no.\" \"I must always be perfect.\" \"I'm responsible for everyone's expectations.\" Reset: <em>leaders who admit mistakes and set limits are often trusted more, not less.</em>"
)}

<h2>Leading from purpose</h2>
<p>Insecure leadership asks <em>"How do I look?"</em>. Purpose-led leadership asks <em>"What impact do I want to create — and for whom?"</em> When you're anchored to purpose, criticism stings less, because your worth isn't on the line every time.</p>

<h2>Exercise 1 — Leadership story rewrite</h2>
${block("exercise", "w9-story")}

<h2>Exercise 2 — Purpose mapping</h2>
${block("exercise", "w9-purpose")}

<h2>Scenario</h2>
<p>A managing director never admits mistakes because <em>"leaders can't show weakness"</em>. Her team has stopped raising problems.</p>
${block("scenario", "w9-md")}

<h2>Delete script practice — three leadership scripts</h2>
${block("exercise", "w9-scripts")}

<h2>Week 9 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w9-story",
        title: "Leadership reframe sheet",
        fields: [
          field("old", "My old leadership story (what I tell myself about leading):"),
          field("belief", "The limiting belief inside that story:"),
          field("new", "Who I am becoming as a leader:"),
          field("truths", "Three leadership truths I choose:"),
          field("behaviours", "Three leadership behaviours I'll practise:"),
        ],
      },
      {
        exerciseId: "w9-purpose",
        title: "Purpose mapping",
        fields: [
          field("impact", "What impact do I want to create?"),
          field("for", "For whom?"),
          field("small", "One small way I can lead towards it this week:"),
        ],
      },
      scriptTable("w9-scripts", "Three leadership scripts", 3),
    ],
    scenarios: [
      {
        scenarioId: "w9-md",
        title: "The leader who can't be wrong",
        question: "Which delete script would help most?",
        options: [
          "DELETE \"Leaders can't show weakness\" → REPLACE WITH \"Owning mistakes builds trust\" → RUN: admit one mistake to the team this week and ask what she's missing.",
          "DELETE nothing — the team should toughen up.",
          "REPLACE WITH \"I am never wrong.\"",
          "Stop holding team meetings.",
        ],
        answer: 0,
        explanation: "Her belief is creating the silence. Modelling honesty makes it safe for the team to raise problems.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Leadership in this course is best described as:", ["A job title", "Influence over what happens next", "Being the loudest", "Having money"],
        1, "Anyone can lead a small moment."),
      q("Leading through control often comes from:", ["Confidence", "A limiting belief such as \"If I'm not in control, it will fall apart\"", "Good training", "Purpose"],
        1, "Fear and worthiness beliefs often drive control."),
      q("Which is a healthy leadership reframe?", ["\"Leaders can't show weakness.\"", "\"Owning mistakes builds trust.\"", "\"I must always be perfect.\"", "\"I'm too young to lead.\""],
        1, "Honesty builds trust."),
      q("Purpose-led leadership asks:", ["\"How do I look?\"", "\"What impact do I want to create, and for whom?\"", "\"Who is ahead of me?\"", "\"How do I avoid criticism?\""],
        1, "Purpose anchors you when criticism comes."),
      q("Can quiet people be leaders?", ["No", "Yes — often by listening, organising and following through", "Only if they become loud", "Only with a title"],
        1, "Leadership comes in many styles."),
    ],
  },

  // ---------------------------------------------------------------- week 10
  {
    lessonId: "dlb-week-10",
    title: "Week 10 · Embodiment: Turning Beliefs Into Behaviour",
    lessonOrder: 11,
    duration: "60 minutes + daily embodiment plan",
    objective: "Align your daily behaviour with your new identity through small, repeatable habits.",
    contentBody: `
<p><strong>Level 4 — Embodiment</strong></p>
<h2>This week's question</h2>
<blockquote><p>If someone watched my week, would they see my new beliefs — or my old ones?</p></blockquote>

<h2>The embodiment chain</h2>
${flow(["IDENTITY — who I believe I am", "THOUGHTS — what I tell myself", "ACTIONS — what I do", "RESULTS — what happens", "EVIDENCE — which feeds back into identity"])}
<p>Scripts work on the top of the chain. Habits work on the middle. Together they create the evidence that makes a new identity feel true. <strong>Embodiment means consistency</strong> — not perfect days, but repeated small ones.</p>

<h2>Make habits tiny and specific</h2>
${list([
  "<strong>Tiny:</strong> \"Read my scripts aloud\" beats \"Transform my mindset\". Start with a version that takes under two minutes.",
  "<strong>Specific:</strong> link it to something you already do — \"After I brush my teeth, I read my three scripts.\"",
  "<strong>Identity-based:</strong> each habit is a vote for who you're becoming — \"I'm someone who keeps promises to myself.\"",
])}

<h2>Two tracks</h2>
${tracks(
  "<strong>New belief:</strong> \"I am someone who learns in public.\"<br><strong>Habits:</strong> ask one question in class each day; post one piece of work a week; after each mistake, write one thing learned.",
  "<strong>New belief:</strong> \"My worth isn't based on performance.\"<br><strong>Habits:</strong> one work-free evening a week; phone away at family meals; one \"no\" a week to something that doesn't align."
)}

<h2>Exercise 1 — Daily habit builder</h2>
<p>Choose three habits that match your new identity.</p>
${block("exercise", "w10-habits")}

<h2>Exercise 2 — Behaviour alignment audit</h2>
${block("exercise", "w10-audit")}

<h2>Exercise 3 — Daily embodiment plan</h2>
${block("exercise", "w10-plan")}

<h2>Scenario</h2>
<p>Seun writes brilliant scripts every morning but by lunchtime is back to old habits.</p>
${block("scenario", "w10-seun")}

<h2>Delete script practice — three behaviour scripts</h2>
${block("exercise", "w10-scripts")}

<h2>Week 10 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w10-habits",
        title: "Identity-based habits",
        table: {
          columns: ["Habit (tiny version)", "The identity it proves", "When / after what"],
          rows: numbered("Habit", 3),
        },
      },
      {
        exerciseId: "w10-audit",
        title: "Behaviour alignment audit",
        fields: [
          field("contradict", "Behaviours that contradict my new identity:"),
          field("belief", "The old belief each one comes from:"),
          field("replace", "What I'll do instead:"),
        ],
      },
      {
        exerciseId: "w10-plan",
        title: "Daily embodiment plan",
        fields: [
          field("morning", "Morning action (e.g. read my scripts aloud):"),
          field("afternoon", "Afternoon action (e.g. one RUN action):"),
          field("evening", "Evening action (e.g. note one piece of evidence):"),
        ],
      },
      scriptTable("w10-scripts", "Three behaviour scripts", 3),
    ],
    scenarios: [
      {
        scenarioId: "w10-seun",
        title: "Seun's scripts",
        question: "What is missing?",
        options: [
          "Longer scripts.",
          "Embodiment — tiny habits linked to his day (e.g. one RUN action at lunchtime, one piece of evidence each evening) so the new belief shows up in behaviour.",
          "A different notebook.",
          "Nothing — he should just try harder.",
        ],
        answer: 1,
        explanation: "Scripts work on thoughts; habits carry the belief into the rest of the day.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What does embodiment mean in this course?", ["Perfect days", "Consistency — repeated small actions that match your new identity", "Physical exercise", "Memorising scripts"],
        1, "Embodiment = consistency."),
      q("Which habit is most likely to stick?",
        ["\"Transform my mindset every day\"", "\"After I brush my teeth, I read my three scripts\"", "\"Be positive\"", "\"Never doubt myself\""],
        1, "Tiny, specific and linked to an existing routine."),
      q("Why is each habit called a \"vote\" for your identity?",
        ["Because other people vote on it", "Each repetition is evidence for who you're becoming", "Because habits are political", "It isn't"],
        1, "Evidence feeds back into identity."),
      q("A behaviour alignment audit looks for:", ["Behaviours that contradict your new identity", "Other people's bad habits", "Your best days only", "New job opportunities"],
        0, "Find the gaps, then replace them."),
      q("In the embodiment chain, what comes after actions?", ["Identity", "Results, which become evidence", "Thoughts", "Nothing"],
        1, "Identity → thoughts → actions → results → evidence."),
    ],
  },

  // ---------------------------------------------------------------- week 11
  {
    lessonId: "dlb-week-11",
    title: "Week 11 · Integration: The 21-Day Practice Cycle",
    lessonOrder: 12,
    duration: "45 minutes + 21-day cycle",
    objective: "Build a system that keeps your new beliefs alive: a 21-day cycle, reviews and accountability.",
    contentBody: `
<p><strong>Level 5 — Integration</strong></p>
<h2>This week's question</h2>
<blockquote><p>How will I keep this going when the programme ends?</p></blockquote>

<h2>Repetition, accountability, systems</h2>
${list([
  "<strong>Repetition</strong> strengthens new patterns — a belief practised daily becomes more automatic.",
  "<strong>Accountability</strong> helps — telling someone what you're working on makes you more likely to follow through.",
  "<strong>Systems</strong> sustain identity — motivation fades; a simple routine keeps going.",
])}

<h2>The 21-day practice cycle</h2>
<p>There's nothing magic about 21 days — real habits often take longer. It's simply a practical cycle: long enough to collect evidence, short enough to review and adjust.</p>
${table(["When", "What you do"], [
  ["Every day", "Read your 3–5 active scripts aloud, morning and evening. Do at least one RUN action. Note one piece of evidence."],
  ["Day 7", "Re-rate each REPLACE WITH line for believability. Bridge or rewrite any that feel untrue."],
  ["Day 14", "Upgrade bridge statements that now feel true into full statements. Check your triggers journal for new beliefs."],
  ["Day 21", "Review. Keep scripts that still matter, retire ones that have become natural, and choose the next beliefs to work on."],
])}

<h2>Choosing accountability</h2>
${tracks(
  "Choose someone you trust — a parent or carer, teacher, mentor or a friend who's also growing. You don't have to share every belief; share the script you're practising and one RUN action.",
  "Choose someone who will be honest with you, not impressed by you — a coach, a mentor, a peer outside your organisation, or a friend from before your success. Status makes honest feedback rarer; accountability puts it back."
)}

<h2>Exercise 1 — Integration plan</h2>
${block("exercise", "w11-plan")}

<h2>Exercise 2 — Your 21-day tracker</h2>
<p>Use this as you run your first cycle.</p>
${block("exercise", "w11-tracker")}

<h2>Scenario</h2>
<p>After three good weeks, Chidi misses five days of practice and thinks: <em>"I've ruined it. Delete scripts don't work for me."</em></p>
${block("scenario", "w11-chidi")}

<h2>Delete script practice — three long-term scripts</h2>
<p>Write scripts for beliefs that could pull you back when life gets busy (e.g. \"I don't have time for this\", \"I always give up\").</p>
${block("exercise", "w11-scripts")}

<h2>Week 11 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w11-plan",
        title: "Integration plan",
        fields: [
          field("active", "My 3–5 active scripts for the next 21 days:"),
          field("weekly", "What I'll practise and review weekly:"),
          field("monthly", "What I'll review monthly:"),
          field("quarterly", "What I'll review every 3 months:"),
          field("who", "Who supports my growth (role, not name), and what I'll share with them:"),
        ],
      },
      {
        exerciseId: "w11-tracker",
        title: "21-day tracker",
        table: {
          columns: ["Scripts practised (days)", "RUN actions done", "Best piece of evidence", "Believability now (1–10)", "What I'll adjust"],
          rows: ["Days 1–7", "Days 8–14", "Days 15–21"],
        },
      },
      scriptTable("w11-scripts", "Three long-term scripts", 3),
    ],
    scenarios: [
      {
        scenarioId: "w11-chidi",
        title: "Chidi's missed days",
        question: "What's the healthiest response?",
        options: [
          "Agree — it doesn't work, so stop.",
          "Start the whole programme from Week 1.",
          "Notice the all-or-nothing belief, write a quick script for it (\"Missing days is normal; I restart today\"), and pick up the cycle again today.",
          "Wait until he feels motivated again.",
        ],
        answer: 2,
        explanation: "All-or-nothing thinking is itself a limiting belief. Consistency is about restarting quickly, not never missing.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What happens on Day 7 of the cycle?", ["Stop practising", "Re-rate believability and bridge or rewrite scripts that feel untrue", "Delete all scripts", "Start a new programme"],
        1, "Review and adjust."),
      q("Is 21 days a magic number?", ["Yes — beliefs change in exactly 21 days", "No — it's a practical review cycle; real habits often take longer", "Only for young people", "Only for high achievers"],
        1, "It's a cycle, not a guarantee."),
      q("Why is accountability especially important for high achievers?", ["They are less honest", "Status can make honest feedback rarer", "They have more time", "It isn't"],
        1, "Accountability puts honesty back."),
      q("After missing several days, the best response is:", ["Give up", "Restart the whole programme", "Restart the practice today without self-criticism", "Wait for motivation"],
        2, "Consistency is about restarting quickly."),
      q("What sustains a new identity when motivation fades?", ["Willpower alone", "A simple system and routine", "Waiting", "Luck"],
        1, "Systems sustain identity."),
    ],
  },

  // ---------------------------------------------------------------- week 12
  {
    lessonId: "dlb-week-12",
    title: "Week 12 · Vision, Expansion & Future Identity",
    lessonOrder: 13,
    duration: "75 minutes",
    objective: "Design your future identity, write your final ten scripts, and see how far you've come.",
    contentBody: `
<p><strong>Level 5 — Integration</strong></p>
<h2>This week's question</h2>
<blockquote><p>Who am I becoming — and which beliefs will carry me there?</p></blockquote>

<h2>Vision shapes identity; identity shapes direction</h2>
<p>A clear picture of your future self gives your scripts a direction. Not a fantasy — a realistic, meaningful picture of who you are becoming. And you are always becoming: the scripts you write today will be updated by the person you are next year.</p>

<h2>Exercise 1 — Future identity blueprint</h2>
${block("exercise", "w12-blueprint")}

<h2>Exercise 2 — Your final ten scripts</h2>
<p>Write the ten scripts that best support your future identity. Include your dominant category, at least one relationship or cultural belief, and at least one capability belief.</p>
${block("exercise", "w12-scripts")}

<h2>AI practical exercise — Final Script Review</h2>
<p>Your reviewer reads your final ten scripts and future identity, checks each against the formula and the believability test, and suggests how to sequence them into your next two 21-day cycles.</p>
${block("coach", "w12-review")}

<h2>Pay it forward — write a script for someone else</h2>
<p>One of the best ways to deepen a skill is to teach it. Think of someone (no names needed) who carries a belief you recognise — a younger sibling, a friend, a team member. Write a script they might find helpful, and how you could share the method with them kindly.</p>
${block("exercise", "w12-forward")}

<h2>How far have you come?</h2>
<p>Retake the snapshot from the welcome lesson and compare your scores.</p>
${block("exercise", "w12-snapshot")}
${block("exercise", "w12-reflection")}

<h2>Week 12 quiz</h2>
${block("quiz")}
<p>When you're ready, visit the <strong>Script Libraries</strong> and the <strong>Delete Script Studio</strong> any time — then complete your <strong>Delete Script Mastery assessment</strong>.</p>
`,
    exercises: [
      {
        exerciseId: "w12-blueprint",
        title: "Future identity blueprint",
        fields: [
          field("one", "Who I will be in 12 months:"),
          field("five", "Who I will be in 5 years:"),
          field("vision", "My life vision (a few sentences):"),
          field("beliefs", "The beliefs that person holds:"),
        ],
      },
      scriptTable("w12-scripts", "My final ten scripts", 10),
      {
        exerciseId: "w12-forward",
        title: "Pay it forward",
        fields: [
          field("who", "Who I'm thinking of (relationship only, e.g. \"my younger brother\"):"),
          field("belief", "The belief I think they carry:"),
          field("script", "A script they might find helpful (DELETE → REPLACE WITH → INSTALL → RUN → LOCK):"),
          field("share", "How I could share the method kindly, without pushing:"),
        ],
      },
      { exerciseId: "w12-snapshot", title: "Limiting Belief Snapshot — Week 12", scale: SNAPSHOT },
      {
        exerciseId: "w12-reflection",
        title: "What has changed",
        fields: [
          field("changed", "Where my score changed most, and why:"),
          field("deleted", "The belief that has loosened most over 12 weeks:"),
          field("next", "The belief I'll work on next:"),
        ],
      },
    ],
    coaches: [
      {
        coachId: "w12-review",
        title: "AI Final Script Review",
        intro: "Checks your final ten scripts against the formula and believability test, and helps you plan your next two 21-day cycles.",
        usesExercises: ["w12-blueprint", "w12-scripts"],
        promptTemplate:
          "Here is my future identity blueprint and my final ten delete scripts:\n\n[PASTE YOUR ANSWERS]\n\nPlease:\n\n1. check each script against DELETE → REPLACE WITH → INSTALL → RUN → LOCK;\n2. flag any REPLACE WITH line that may fail the believability test and suggest a bridge;\n3. check each RUN action is small and specific;\n4. note how well the scripts support my future identity;\n5. suggest which 3–5 to practise in my next 21-day cycle, and which in the one after.",
        systemPrompt:
          "Exercise: Week 12 — final script review. For each of the learner's scripts (refer to them by number), check all five parts are present and do their job: DELETE precise; REPLACE WITH accurate and believable (flag absolutes and magical claims, offer a bridge); INSTALL an identity statement; RUN small, specific and doable within 24 hours; LOCK short. Keep feedback compact (a short line per script, or a table). Then comment on how well the set supports their future identity and covers different categories. Suggest 3–5 scripts for the next 21-day cycle and the rest for the one after, with reasons. Praise specific strengths honestly; don't rewrite everything for them.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why create a future identity before your final scripts?", ["It's required paperwork", "It gives your scripts a direction", "It predicts the future", "It replaces the scripts"],
        1, "Vision shapes identity; identity shapes direction."),
      q("A strong final set of scripts should:", ["All come from one category", "Cover your dominant category plus other areas like relationships, culture and capability", "Be as long as possible", "Avoid RUN actions"],
        1, "Balance makes the change hold."),
      q("Why write a script for someone else?", ["To fix them", "Teaching a skill deepens your own understanding", "To prove you're better", "It's not useful"],
        1, "Share kindly, without pushing."),
      q("Why retake the snapshot?", ["To get a certificate", "To see evidence of change over 12 weeks", "To compare with others", "To pass the course"],
        1, "Evidence of change strengthens the new identity."),
      q("\"You are always becoming\" means:", ["You'll never improve", "Your scripts will keep evolving as you grow", "Change is impossible", "The programme never ends"],
        1, "Next year's you will update today's scripts."),
    ],
  },
];
