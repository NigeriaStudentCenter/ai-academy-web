// Level 3: Installation (Weeks 5–7) — emotions, relationships, culture.

const { block, q, field, numbered, table, list, QUIZ_BANDS, tracks, scriptTable } = require("./kit");

module.exports = [
  // ---------------------------------------------------------------- week 5
  {
    lessonId: "dlb-week-5",
    title: "Week 5 · Emotional Triggers & Self-Regulation",
    lessonOrder: 6,
    duration: "60 minutes + 7-day trigger journal",
    objective: "Use emotional triggers to find hidden beliefs, and calm your body before you rewrite the thought.",
    contentBody: `
<p><strong>Level 3 — Installation</strong></p>
<h2>This week's question</h2>
<blockquote><p>What is this feeling trying to tell me — and what belief is behind it?</p></blockquote>

<h2>Emotions are signals, not commands</h2>
<p>A strong emotion is information: something matters to you. It is not an instruction you must obey. Feeling afraid of speaking doesn't mean you must stay silent. Feeling guilty about resting doesn't mean you've done something wrong.</p>

<h2>Triggers reveal beliefs</h2>
<p>When a small event produces a big reaction, a belief has usually been activated underneath:</p>
${table(["Trigger", "Automatic thought", "Belief underneath"], [
  ["A friend doesn't reply for hours", "\"They're annoyed with me.\"", "\"People leave when I'm not perfect.\" (attachment)"],
  ["Someone younger gets promoted", "\"I'm falling behind.\"", "\"My worth depends on my position.\" (worthiness)"],
  ["A teacher asks you to present", "\"I'll embarrass myself.\"", "\"If I fail, everyone will laugh.\" (fear)"],
  ["A journalist asks about a failure", "\"This will destroy me.\"", "\"I'm not allowed to fail publicly.\" (fear)"],
])}

<h2>Calm the body first</h2>
<p>You can't rewrite a thought well while your body is in alarm mode. Try one of these first:</p>
${list([
  "<strong>Slow breathing:</strong> breathe in for 4, out for 6, for one to two minutes. A longer out-breath helps your body settle.",
  "<strong>Grounding (5-4-3-2-1):</strong> name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
  "<strong>Name it:</strong> \"I'm noticing anxiety.\" Putting a feeling into words often reduces its intensity.",
  "<strong>Reframe:</strong> only once you're calmer — ask \"What else could this mean?\"",
])}

<h2>Two tracks</h2>
${tracks(
  "<strong>Zainab, 16,</strong> sees friends' holiday photos and feels a wave of envy and sadness. Trigger map: comparison → \"Everyone's life is better than mine\" → identity belief \"I'm not as good as people online\". Reframe: \"I'm seeing their highlights, not their whole lives.\"",
  "<strong>Richard, 52, investor,</strong> feels rage when an adviser questions his decision. Trigger map: challenge → \"They think I'm losing it\" → fear belief \"I could lose everything at any moment\". Reframe: \"Being questioned is how good decisions get tested.\""
)}

<h2>Exercise 1 — Trigger mapping</h2>
<p>Choose one recent moment when you reacted more strongly than the situation seemed to need.</p>
${block("exercise", "w5-trigger")}

<h2>AI practical exercise — Trigger Reframe Partner</h2>
<p>Your partner reads your trigger map, helps you find the belief underneath, and offers other ways to interpret the situation.</p>
${block("coach", "w5-reframe")}

<h2>Exercise 2 — 7-day trigger journal</h2>
<p>For the next seven days, record one trigger each day. Look for the pattern.</p>
${block("exercise", "w5-journal")}

<h2>Scenario</h2>
<p>Before a big exam, Kofi's heart is racing and he thinks: <em>"I'm going to fail."</em></p>
${block("scenario", "w5-kofi")}

<h2>Delete script practice — scripts for your triggers</h2>
${block("exercise", "w5-scripts")}

<h2>Week 5 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w5-trigger",
        title: "Trigger mapping sheet",
        fields: [
          field("situation", "Trigger — what situation triggered me?"),
          field("emotion", "What emotion did I feel (and how strong, 1–10)?"),
          field("thought", "Automatic thought — what did I tell myself?"),
          field("belief", "Which belief was activated? Which category?"),
          field("body", "Body response — what did I feel physically?"),
          field("behaviour", "Behaviour — what did I do?"),
          field("reframe", "Reframe — what is a healthier interpretation?"),
          field("script", "A one-line delete script for this trigger:"),
        ],
      },
      {
        exerciseId: "w5-journal",
        title: "7-day trigger journal",
        table: {
          columns: ["Trigger", "Emotion", "Automatic thought", "Belief underneath", "Reframe"],
          rows: numbered("Day", 7),
        },
      },
      scriptTable("w5-scripts", "Scripts for my triggers", 3, "Trigger"),
    ],
    scenarios: [
      {
        scenarioId: "w5-kofi",
        title: "Kofi before the exam",
        question: "What should Kofi do first?",
        options: [
          "Force himself to believe \"I'll get 100%\".",
          "Slow his breathing (in 4, out 6) to settle his body, then reframe: \"I've prepared; nerves mean this matters.\"",
          "Leave the exam.",
          "Ignore the feeling completely.",
        ],
        answer: 1,
        explanation: "Calm the body first, then rewrite the thought. Emotions are signals, not commands.",
      },
    ],
    coaches: [
      {
        coachId: "w5-reframe",
        title: "AI Trigger Reframe Partner",
        intro: "Helps you find the belief underneath a trigger and offers several other ways to see the situation.",
        usesExercises: ["w5-trigger"],
        promptTemplate:
          "Here is a trigger I mapped:\n\n[PASTE YOUR ANSWERS]\n\nHelp me:\n\n1. identify the belief underneath and its category;\n2. separate what happened from what I told myself;\n3. suggest three other ways to interpret the situation;\n4. write a short delete script for this trigger.\n\nDon't dismiss my feelings.",
        systemPrompt:
          "Exercise: Week 5 — trigger reframe partner. Acknowledge the learner's feeling first, without dismissing it. Separate the event from the automatic thought. Suggest the likely belief underneath and its category (identity, fear, worthiness, attachment, capability), tentatively. Offer three alternative interpretations that are realistic, not forced positivity. Suggest one body-calming tool (slow breathing with longer exhale, 5-4-3-2-1 grounding, naming the feeling) if the emotion was intense. Then write a short delete script in the course format. If the trigger involves being harmed, threatened or unsafe, follow the safeguarding rules instead of reframing.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("\"Emotions are signals, not commands\" means:",
        ["You should ignore emotions", "Emotions give information but don't have to decide your actions", "Emotions are always wrong", "You must act on every emotion"],
        1, "Feel it, learn from it, then choose."),
      q("What does a big reaction to a small event often reveal?", ["Nothing", "An activated belief underneath", "That you're overreacting and should stop", "A medical problem"],
        1, "Triggers reveal beliefs."),
      q("Why calm your body before reframing?",
        ["It's hard to think clearly while your body is in alarm mode", "Breathing replaces the need to reframe", "It impresses others", "It isn't necessary"],
        0, "Regulate first, then rewrite."),
      q("Which breathing pattern helps the body settle?", ["Short, fast breaths", "Holding your breath for a minute", "A longer out-breath than in-breath, e.g. in 4, out 6", "Breathing only through your mouth"],
        2, "A longer exhale helps you calm down."),
      q("Why keep a 7-day trigger journal?", ["To prove you're anxious", "To spot patterns that point to your core beliefs", "To show others", "To avoid triggers forever"],
        1, "Patterns across days point to the beliefs worth scripting."),
    ],
  },

  // ---------------------------------------------------------------- week 6
  {
    lessonId: "dlb-week-6",
    title: "Week 6 · Relationship Mindset Reset",
    lessonOrder: 7,
    duration: "60–75 minutes",
    objective: "Rewrite beliefs about love, trust and connection — and learn the difference between boundaries and walls.",
    contentBody: `
<p><strong>Level 3 — Installation</strong></p>
<h2>This week's question</h2>
<blockquote><p>What have I come to believe about how people will treat me?</p></blockquote>

<h2>Relationship beliefs run deep</h2>
<p>Beliefs about relationships touch our need to belong, so they often form early and feel especially "true". They shape who we choose, what we tolerate, what we ask for and how we react when someone pulls away.</p>
${tracks(
  "Often shaped by social media and friendship groups: \"If they don't reply quickly, they don't care.\" \"I must be like others to be liked.\" \"If I set boundaries, I'll lose them.\" \"I'm replaceable.\"",
  "Often shaped by status and visibility: \"Everyone around me has hidden motives.\" \"No one sees me as a human being.\" \"My partner might leave if I lose my status.\" \"I can't show weakness.\""
)}

<h2>Attachment patterns — a lens, not a label</h2>
<p>Psychologists describe common patterns in how people approach closeness. They are a useful lens for noticing your habits — <strong>not a diagnosis</strong>, and most people show a mix depending on the relationship:</p>
${table(["Pattern", "What it can look like", "Belief it often carries"], [
  ["Secure", "Comfortable with closeness and independence; can ask for needs.", "\"I'm worthy of love and others are mostly trustworthy.\""],
  ["Anxious", "Worry about being left; need lots of reassurance.", "\"People leave; I must work hard to keep them.\""],
  ["Avoidant", "Uncomfortable with closeness; value independence highly.", "\"Depending on people is dangerous.\""],
  ["Disorganised", "Want closeness but fear it; mixed signals.", "\"People I need might hurt me.\""],
])}

<h2>Boundaries vs walls</h2>
${table(["A boundary", "A wall"], [
  ["\"I'm happy to help, but not after 10pm.\"", "\"I don't need anyone.\""],
  ["Protects your wellbeing while keeping the connection.", "Protects you by ending the connection."],
  ["Says what <em>you</em> will do.", "Keeps everyone out."],
])}
<p>High achievers often build walls (\"I can't trust anyone\"). Young people often struggle to set boundaries at all (\"If I say no, they'll leave\"). Both lose something: walls cost connection; no boundaries cost self-respect.</p>

<h2>Important — when a belief keeps you unsafe</h2>
<p>Some beliefs — \"I must endure anything to keep the relationship\", \"I can't leave because of what people will say\" — can keep people in relationships that are controlling or harmful. <strong>A delete script is not a substitute for safety.</strong> If you feel afraid of someone, are being hurt, threatened or controlled, talk to someone you trust or a professional now. In an emergency call 999 (UK) or 112 (Nigeria).</p>

<h2>Exercise 1 — Relationship belief audit</h2>
<p>List beliefs you hold about romantic, family and friendship relationships.</p>
${block("exercise", "w6-audit")}

<h2>Exercise 2 — Relationship reset sheet</h2>
${block("exercise", "w6-reset")}

<h2>AI practical exercise — Relationship Reset Partner</h2>
<p>Your partner helps you explore one relationship belief, the pattern behind it and a healthy boundary — and writes a relationship delete script with you.</p>
${block("coach", "w6-partner")}

<h2>Scenario</h2>
<p>A wealthy entrepreneur says: <em>"I don't let anyone close. Everyone wants something from me."</em></p>
${block("scenario", "w6-walls")}

<h2>Delete script practice — five relationship scripts</h2>
${block("exercise", "w6-scripts")}

<h2>Week 6 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w6-audit",
        title: "Relationship belief audit",
        table: {
          columns: ["The belief", "Romantic / family / friends", "Where it came from", "How it affects my relationships"],
          rows: numbered("Belief", 6),
        },
      },
      {
        exerciseId: "w6-reset",
        title: "Relationship reset sheet",
        fields: [
          field("belief", "The relationship belief that affects me most:"),
          field("pattern", "The pattern I notice in myself (secure, anxious, avoidant, disorganised, a mix or unsure) — and why:"),
          field("impact", "How this belief affects my relationships:"),
          field("boundary", "One healthy boundary I could set (a boundary, not a wall):"),
          field("new", "The belief I want instead:"),
        ],
      },
      scriptTable("w6-scripts", "Five relationship scripts", 5),
    ],
    scenarios: [
      {
        scenarioId: "w6-walls",
        title: "\"Everyone wants something from me\"",
        question: "What would be a healthier approach?",
        options: [
          "Trust everyone completely to prove a point.",
          "Keep the wall up — it's safest.",
          "Replace the wall with discernment: \"I trust wisely and step by step\" — and share one small truth with someone who has earned it.",
          "Stop meeting people.",
        ],
        answer: 2,
        explanation: "Walls protect by ending connection. Discernment protects while keeping it — trust can be built in small, tested steps.",
      },
    ],
    coaches: [
      {
        coachId: "w6-partner",
        title: "AI Relationship Reset Partner",
        intro: "Explores one relationship belief, the pattern behind it and a healthy boundary, then writes a relationship delete script with you.",
        usesExercises: ["w6-reset"],
        promptTemplate:
          "Here is a relationship belief I'm working on:\n\n[PASTE YOUR ANSWERS]\n\nHelp me:\n\n1. understand where it might come from;\n2. notice how it shapes what I do in relationships;\n3. find the difference between a boundary and a wall here;\n4. write a relationship delete script.\n\nDon't diagnose me or judge anyone in my life.",
        systemPrompt:
          "Exercise: Week 6 — relationship reset partner. Explore the learner's relationship belief with warmth. Use attachment patterns only as a lens ('it sounds a little like…'), never a diagnosis. Don't judge partners, family or friends they mention. Help them distinguish a boundary (what they will do, keeps connection) from a wall (ends connection), and word one realistic boundary. Then write a relationship delete script in the course format. For teens, keep examples to friendships and family unless they raise dating. SAFETY FIRST: if they describe fear of a partner or family member, control, threats, violence, coercion, or feeling unable to leave, do not write a script — follow the safeguarding rules and encourage them to contact someone they trust or emergency services.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("How should attachment patterns be used in this course?",
        ["As a diagnosis", "As a lens for noticing habits — most people show a mix", "To label other people", "They shouldn't be used"],
        1, "A lens, not a label."),
      q("What is the difference between a boundary and a wall?",
        ["There is no difference", "A boundary protects wellbeing while keeping connection; a wall protects by ending connection", "A wall is healthier", "Boundaries are only for romantic relationships"],
        1, "Boundaries say what you'll do; walls keep everyone out."),
      q("Which is a boundary?", ["\"I don't need anyone.\"", "\"I'm happy to help, but not after 10pm.\"", "\"Never call me again.\"", "\"Everyone is out to use me.\""],
        1, "It protects you and keeps the relationship."),
      q("If a belief is keeping someone in a harmful relationship, what comes first?",
        ["Writing a better delete script", "Safety — talking to someone they trust or a professional, or emergency services if in danger", "Enduring it for longer", "Keeping it secret"],
        1, "A delete script is not a substitute for safety."),
      q("A common relationship belief among high achievers is:", ["\"If they don't reply quickly, they don't care.\"", "\"Everyone around me has hidden motives.\"", "\"I'm too young to be taken seriously.\"", "\"I need permission to act.\""],
        1, "Status can make trust feel dangerous."),
    ],
  },

  // ---------------------------------------------------------------- week 7
  {
    lessonId: "dlb-week-7",
    title: "Week 7 · Cultural & Generational Beliefs",
    lessonOrder: 8,
    duration: "60–75 minutes",
    objective: "Decide which inherited beliefs to keep, adapt or release — with respect for where they came from.",
    contentBody: `
<p><strong>Level 3 — Installation</strong></p>
<h2>This week's question</h2>
<blockquote><p>Which beliefs did I inherit — and which do I choose to carry forward?</p></blockquote>

<h2>Not every inherited belief is limiting</h2>
<p>Culture and family give us beautiful beliefs: respect, loyalty, hard work, community, faith, generosity. The aim this week is <strong>not</strong> to reject your culture. It is to look at each inherited belief and ask: <em>does this still serve me and the people I love?</em> Then choose to <strong>keep</strong>, <strong>adapt</strong> or <strong>release</strong> it.</p>
<p>Many inherited beliefs made sense for the generation that created them — they protected people in harder or more dangerous times. Honouring that is part of the work.</p>

<h2>Humble <em>and</em> excellent</h2>
<p>A belief common in many African families and communities is: <em>"Always be humble — don't outshine others."</em> Humility is a strength. But it can quietly turn into: <em>"Don't charge what you're worth." "Hide your achievements." "Don't put yourself forward."</em> An adapted belief keeps the value and drops the limit:</p>
<blockquote><p>I can be humble in character and confident in my contribution.</p></blockquote>

<h2>Two tracks</h2>
${tracks(
  "<strong>Keep / adapt / release — Rising:</strong><br>\"Respect your elders\" → <strong>keep</strong>.<br>\"You can't choose your own path; family expectations come first\" → <strong>adapt</strong>: \"I can honour my family and still choose my path — and talk with them about it.\"<br>\"Don't aim too high; it's not realistic for people like us\" → <strong>release</strong>: \"My background is part of my strength.\"",
  "<strong>Keep / adapt / release — High Achiever:</strong><br>\"Support your family\" → <strong>keep</strong>.<br>\"I'm responsible for everyone's success but my own\" → <strong>adapt</strong>: \"I can support others generously and sustainably, with limits.\"<br>\"Wealth will make people hate me\" / \"I must hide my achievements to avoid jealousy\" → <strong>release</strong>: \"I can share my success wisely and use it to lift others.\""
)}

<h2>Breaking generational cycles</h2>
<p>A generational pattern is a belief or behaviour passed down: never talking about feelings, money secrecy, \"endure anything\", harsh self-criticism. Breaking a cycle doesn't mean blaming the past. It means one person deciding: <em>this stops with me, and something better starts with me.</em></p>

<h2>Exercise 1 — Generational belief mapping</h2>
${block("exercise", "w7-map")}

<h2>Exercise 2 — Cultural belief audit</h2>
<p>Choose the inherited belief with the biggest impact on you.</p>
${block("exercise", "w7-audit")}

<h2>AI practical exercise — Cultural Belief Partner</h2>
<p>Your partner respects your culture and faith. It helps you decide what to keep, adapt or release, and writes an adapted script that honours where the belief came from.</p>
${block("coach", "w7-partner")}

<h2>Scenario</h2>
<p>Ngozi, a gifted designer in Lagos, charges far less than her peers. She says: <em>"If I charge more, people will think I'm greedy."</em></p>
${block("scenario", "w7-ngozi")}

<h2>Delete script practice — three cultural scripts</h2>
${block("exercise", "w7-scripts")}

<h2>Week 7 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w7-map",
        title: "Generational belief map",
        table: {
          columns: ["Belief I inherited", "Who passed it down", "How it may have helped them", "How it affects me now", "Keep / adapt / release"],
          rows: numbered("Belief", 6),
        },
      },
      {
        exerciseId: "w7-audit",
        title: "Cultural belief audit",
        fields: [
          field("script", "The cultural or family script:"),
          field("origin", "Who passed it down, and why it may have made sense for them:"),
          field("impact", "How it has shaped my life (good and limiting):"),
          field("decision", "Keep, adapt or release — and why:"),
          field("rewrite", "My rewritten belief (keeping what's valuable):"),
        ],
      },
      scriptTable("w7-scripts", "Three cultural scripts", 3),
    ],
    scenarios: [
      {
        scenarioId: "w7-ngozi",
        title: "Ngozi's prices",
        question: "Which approach keeps her values and removes the limit?",
        options: [
          "Keep undercharging — humility means earning less.",
          "Triple her prices overnight and stop caring what anyone thinks.",
          "Adapt the belief: \"Fair pricing reflects the value I create; I can be humble in character and confident in my contribution\" — then research market rates and raise prices step by step.",
          "Stop working with local clients.",
        ],
        answer: 2,
        explanation: "Adapting keeps the value (humility, fairness) and drops the limit (undercharging), with a practical, evidence-based RUN step.",
      },
    ],
    coaches: [
      {
        coachId: "w7-partner",
        title: "AI Cultural Belief Partner",
        intro: "Helps you decide what to keep, adapt or release from your cultural and family beliefs, with respect for where they came from.",
        usesExercises: ["w7-map", "w7-audit"],
        promptTemplate:
          "I'm examining beliefs I inherited from my culture and family:\n\n[PASTE YOUR ANSWERS]\n\nHelp me:\n\n1. see what value the belief may have protected;\n2. decide what to keep, adapt or release;\n3. word an adapted belief that honours where it came from;\n4. write a delete script for the limiting part.\n\nPlease respect my culture, family and faith.",
        systemPrompt:
          "Exercise: Week 7 — cultural belief partner. Treat the learner's culture, family and faith with respect; never portray a culture, religion or community as backward. For each belief, first name the value it may protect (respect, loyalty, humility, safety, community) and why it may have made sense for earlier generations. Help the learner choose keep / adapt / release — the choice is theirs. Favour 'adapt' wordings that keep the value and drop the limit (e.g. 'humble in character, confident in contribution'). Write a delete script for the limiting part only. For teens and family expectations, encourage respectful conversation with family rather than defiance. For money-related beliefs (pricing, family support), give no financial advice beyond suggesting research and a trusted adviser.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the aim of examining cultural beliefs?",
        ["To reject your culture", "To decide which inherited beliefs to keep, adapt or release", "To blame your family", "To copy another culture"],
        1, "Choose consciously, with respect."),
      q("\"I can be humble in character and confident in my contribution\" is an example of:", ["Releasing a value", "Adapting a belief — keeping the value, dropping the limit", "A wall", "A fear belief"],
        1, "Adapt keeps what's valuable."),
      q("Why might an inherited belief have made sense for an earlier generation?",
        ["It never did", "It may have protected people in harder or more dangerous times", "Because they didn't think", "Because it was fashionable"],
        1, "Honouring that helps you change it without blame."),
      q("What does breaking a generational cycle mean?",
        ["Blaming your parents", "Deciding a limiting pattern stops with you and something better starts with you", "Cutting off your family", "Pretending the past didn't happen"],
        1, "It's about choice, not blame."),
      q("\"I'm responsible for everyone's success but my own\" is best:",
        ["Kept as it is", "Adapted — \"I can support others generously and sustainably, with limits\"", "Ignored", "Released by never helping anyone"],
        1, "Keep the generosity; add sustainability."),
    ],
  },
];
