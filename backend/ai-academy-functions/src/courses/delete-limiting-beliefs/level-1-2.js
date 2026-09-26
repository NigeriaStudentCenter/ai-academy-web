// Levels 1–2: Awareness (Weeks 1–2) and Deletion (Weeks 3–4).

const { block, q, field, numbered, flow, table, list, QUIZ_BANDS, tracks, scriptBuilder, scriptTable } = require("./kit");
const { studioCoach } = require("./studio");

module.exports = [
  // ---------------------------------------------------------------- week 1
  {
    lessonId: "dlb-week-1",
    title: "Week 1 · Your Inner Operating System",
    lessonOrder: 2,
    duration: "60 minutes + daily practice",
    objective: "Understand what beliefs are, where limiting beliefs come from, and audit your own.",
    contentBody: `
<p><strong>Level 1 — Awareness</strong></p>
<h2>This week's question</h2>
<blockquote><p>Which rules am I living by that I never actually chose?</p></blockquote>

<h2>Beliefs are mental rules</h2>
<p>A belief is a rule your mind uses to predict the world: <em>"If I speak up, people will judge me." "Money changes people." "I'm the clever one." "I'm not a leader."</em> Rules save energy — you don't have to think everything through from scratch. But some rules were written a long time ago, by someone else, for a situation you're no longer in.</p>
<p>A <strong>limiting belief</strong> is a mental rule that restricts your potential: it narrows what you attempt, what you ask for, and what you think you deserve.</p>

<h2>Where limiting beliefs come from</h2>
${table(["Source", "How it shows up"], [
  ["Childhood", "Things you were told, or concluded, when you were young: \"You're the difficult one.\" \"Don't show off.\""],
  ["Culture &amp; community", "Shared rules: \"Don't aim too high.\" \"Don't outshine others.\" \"Wealth makes people hate you.\""],
  ["Painful experiences", "One rejection or failure becomes a rule: \"I'll get hurt again.\""],
  ["Comparison", "Social media, siblings, classmates, peers in your industry: \"Everyone else is ahead of me.\""],
  ["Fear", "Beliefs that protect you from risk: \"Better not to try than to fail.\""],
  ["Success itself", "For high achievers, success can write new rules: \"I must keep outperforming myself.\" \"I can't rest.\""],
])}

<h2>Why the mind holds on to them</h2>
<p>Your mind prefers the familiar — even familiar discomfort — because familiar feels predictable and safe. It also tends to notice evidence that <em>fits</em> what it already believes and overlook evidence that doesn't (psychologists call this <strong>confirmation bias</strong>). So a belief can feel "proven" simply because you've been collecting only one side of the evidence.</p>
<p>The good news: beliefs are learned, so they can be re-examined and relearned. That starts with seeing them clearly.</p>

<h2>Two tracks, same pattern</h2>
${tracks(
  "<strong>Tolu, 17,</strong> believes \"I'm not a maths person.\" Origin: a teacher's comment in Year 7 and one bad test. Since then she avoids hard questions — so she practises less, scores lower, and the belief feels \"proven\".",
  "<strong>Kemi, 44, founder,</strong> believes \"If I stop, everything falls apart.\" Origin: the early years when the business really did depend on her. Now there's a strong team, but she still can't take a holiday — and the team never grows into the space."
)}
<p>Both beliefs were once reasonable responses. Neither is true any more. Both are quietly running the show.</p>

<h2>Exercise 1 — Belief mapping</h2>
<p>List up to 10 beliefs you hold about yourself, relationships, success and life. Write them as they sound in your head — not as you think they "should" sound. Then trace where each one came from.</p>
${block("exercise", "w1-map")}

<h2>Exercise 2 — The Belief Audit</h2>
<p>Choose the belief from your map that costs you the most. Audit it.</p>
${block("exercise", "w1-audit")}

<h2>AI practical exercise — Belief Audit Partner</h2>
<p>Your audit partner reads your map and audit, helps you separate facts from beliefs, and asks the questions that uncover evidence you've been overlooking.</p>
${block("coach", "w1-partner")}

<h2>Delete script practice — your first script</h2>
<p>Don't worry about getting it perfect — you'll master the formula in Week 3. Just try it with the belief you audited.</p>
${block("exercise", "w1-script")}

<h2>Week 1 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w1-map",
        title: "My belief map",
        table: {
          columns: ["The belief (as it sounds in my head)", "Area (self / relationships / success / life)", "Who or what taught me this?", "When did I first believe it?", "Is it still true?"],
          rows: numbered("Belief", 10),
        },
      },
      {
        exerciseId: "w1-audit",
        title: "Belief Audit",
        fields: [
          field("belief", "The belief, exactly as it appears in my mind:"),
          field("origin", "Where did it come from? Who taught it to me?"),
          field("when", "When did I first accept it?"),
          field("for", "Evidence that seems to support it:"),
          field("against", "Evidence that contradicts it (look hard — include small things):"),
          field("impact", "How has it affected my life? What has it cost me?"),
          field("blocked", "What opportunities has it blocked?"),
          field("healthier", "A healthier, more accurate belief could be:"),
        ],
      },
      scriptBuilder("w1-script", "My first delete script"),
    ],
    coaches: [
      {
        coachId: "w1-partner",
        title: "AI Belief Audit Partner",
        intro: "Separates facts from beliefs in your audit and asks questions that uncover the evidence you've been overlooking.",
        usesExercises: ["w1-map", "w1-audit"],
        promptTemplate:
          "I am auditing my limiting beliefs.\n\nHere is my belief map and audit:\n\n[PASTE YOUR ANSWERS]\n\nHelp me:\n\n1. separate facts from beliefs and interpretations;\n2. notice where confirmation bias might be at work;\n3. find evidence against the belief that I may have overlooked;\n4. see what the belief has cost me;\n5. word a healthier, believable alternative.\n\nAsk me one or two questions at a time. Don't tell me what to believe.",
        systemPrompt:
          "Exercise: Week 1 — Belief Audit Partner. Using the learner's belief map and audit, gently separate facts (what happened) from beliefs (what they concluded). Point out where they may only be collecting evidence that fits (confirmation bias), in plain words. Ask 1–2 questions at a time that help them find counter-evidence from their own life (small exceptions count). Reflect back the cost of the belief in their words. Help them word a healthier belief that is accurate and believable, not merely positive. Note patterns across the map (e.g. several beliefs from one source) tentatively. No diagnosis, no judgement of the people who taught them the belief.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is a limiting belief?",
        ["A fact about your abilities", "A mental rule that restricts what you attempt, ask for or think you deserve", "A negative emotion", "A goal you haven't reached yet"],
        1, "Beliefs are mental rules; limiting ones narrow your potential."),
      q("Why can a limiting belief feel \"proven\"?",
        ["Because it is always true", "Because the mind tends to notice evidence that fits what it already believes", "Because other people agree with it", "Because it came from childhood"],
        1, "Confirmation bias: we collect one side of the evidence."),
      q("Which is a common source of limiting beliefs for high achievers?",
        ["Success itself — e.g. \"I must keep outperforming myself\"", "Having no experience", "Being too young", "Lack of education"],
        0, "Success can write new rules, like \"I can't rest\"."),
      q("In Tolu's story, what kept her belief going?",
        ["Her teacher kept repeating it", "Avoiding hard questions meant less practice, lower scores and more \"proof\"", "She was genuinely bad at maths", "Her friends agreed"],
        1, "Beliefs drive behaviour that produces evidence for the belief — a loop."),
      q("What is the first step in changing a belief?",
        ["Repeating positive affirmations", "Seeing it clearly and tracing where it came from", "Ignoring it", "Asking others to change"],
        1, "Awareness comes first — that's Level 1."),
    ],
  },

  // ---------------------------------------------------------------- week 2
  {
    lessonId: "dlb-week-2",
    title: "Week 2 · The Five Categories of Limiting Beliefs",
    lessonOrder: 3,
    duration: "60 minutes + daily practice",
    objective: "Sort your beliefs into five categories and find the pattern that controls your life most.",
    contentBody: `
<p><strong>Level 1 — Awareness</strong></p>
<h2>This week's question</h2>
<blockquote><p>Which kind of belief has the most control over my life?</p></blockquote>

<h2>The five categories</h2>
<p>Almost every limiting belief falls into one of five categories. Knowing your category helps, because beliefs in the same category tend to share a root — and one well-written script can loosen several of them.</p>
${table(["Category", "The core fear", "🌱 Rising example", "💼 High Achiever example"], [
  ["<strong>Identity</strong> — who I am", "\"I am not enough.\"", "\"I'm not talented enough to stand out.\"", "\"I'm an imposter pretending to be great.\""],
  ["<strong>Fear</strong> — what might happen", "\"Something bad will happen.\"", "\"If I fail, everyone will laugh at me.\"", "\"I could lose everything at any moment.\""],
  ["<strong>Worthiness</strong> — what I deserve", "\"I don't deserve good things.\"", "\"I'm not good enough to pursue my dreams.\"", "\"I'm not worthy without my achievements.\""],
  ["<strong>Attachment</strong> — how safe people are", "\"People leave or use me.\"", "\"If they don't reply quickly, they don't care.\"", "\"People only want me for what I have.\""],
  ["<strong>Capability</strong> — what I can do", "\"I can't.\"", "\"I don't have enough experience.\"", "\"I can't handle it if this fails publicly.\""],
])}

<h2>Every belief has an emotional pattern</h2>
<p>Each category tends to come with a familiar feeling and a familiar behaviour:</p>
${list([
  "<strong>Identity</strong> → shame, comparison → hiding, over-performing, dismissing praise.",
  "<strong>Fear</strong> → anxiety → avoiding, over-preparing, not starting.",
  "<strong>Worthiness</strong> → guilt, unworthiness → not asking, not resting, accepting less.",
  "<strong>Attachment</strong> → insecurity, mistrust → people-pleasing, keeping people at a distance.",
  "<strong>Capability</strong> → doubt → waiting to feel \"ready\", giving up early.",
])}
<p>Notice: the <em>same</em> behaviour can come from different categories. A high achiever who never rests might be running a worthiness belief ("I don't deserve rest") or a fear belief ("If I stop, I'll lose everything"). Getting the category right helps you write the right script.</p>

<h2>Exercise 1 — Category sorting</h2>
<p>Take the beliefs from your Week 1 map (and any new ones you've noticed) and sort them.</p>
${block("exercise", "w2-grid")}

<h2>Exercise 2 — Your dominant pattern</h2>
${block("exercise", "w2-dominant")}

<h2>Scenario</h2>
<p>Daniel, a successful lawyer, works 80-hour weeks, never takes holidays and feels guilty when he rests. He says: <em>"I'm just ambitious."</em></p>
${block("scenario", "w2-daniel")}

<h2>Delete script practice — one per category</h2>
<p>Write one short script for each category. Keep them simple; you'll refine them next week.</p>
${block("exercise", "w2-scripts")}

<h2>Week 2 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w2-grid",
        title: "Belief categorisation grid",
        table: {
          columns: ["Beliefs I identified", "How it makes me feel", "How it affects my behaviour"],
          rows: ["Identity", "Fear", "Worthiness", "Attachment", "Capability"],
        },
      },
      {
        exerciseId: "w2-dominant",
        title: "My dominant pattern",
        fields: [
          field("category", "The category that controls my life most:"),
          field("evidence", "How I know (what I do because of it):"),
          field("root", "The shared root my beliefs in this category might have:"),
        ],
      },
      {
        exerciseId: "w2-scripts",
        title: "One script per category",
        table: { columns: ["DELETE", "REPLACE WITH", "INSTALL", "RUN", "LOCK"], rows: ["Identity", "Fear", "Worthiness", "Attachment", "Capability"] },
      },
    ],
    scenarios: [
      {
        scenarioId: "w2-daniel",
        title: "Daniel's ambition",
        question: "What is the most useful next step for Daniel?",
        options: [
          "Accept that it's just ambition — nothing to examine.",
          "Quit his job immediately.",
          "Ask what belief sits underneath the guilt — e.g. worthiness (\"I don't deserve rest\") or fear (\"If I stop, I'll lose everything\") — before writing a script.",
          "Write the affirmation \"I love resting\" and repeat it 100 times.",
        ],
        answer: 2,
        explanation:
          "Ambition is healthy; guilt about rest is a clue. The same behaviour can come from different categories, and the right script depends on the belief underneath.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("\"I don't deserve rest\" belongs to which category?", ["Capability", "Worthiness", "Attachment", "Identity"],
        1, "It's about what you believe you deserve."),
      q("\"People only want me for what I have\" belongs to which category?", ["Attachment", "Capability", "Fear", "Identity"],
        0, "It's about whether people are safe and trustworthy."),
      q("\"I'm not ready yet\" belongs to which category?", ["Worthiness", "Attachment", "Capability", "Identity"],
        2, "It's about what you believe you can do."),
      q("Why does identifying the category help?",
        ["It diagnoses a mental health condition", "Beliefs in one category often share a root, so the right script can loosen several", "It proves the belief is true", "It isn't useful"],
        1, "Same root, one well-aimed script."),
      q("Can the same behaviour come from different categories?",
        ["No — each behaviour has one cause", "Yes — e.g. never resting can come from worthiness or fear", "Only for young people", "Only for high achievers"],
        1, "That's why you examine the belief underneath before scripting."),
    ],
  },

  // ---------------------------------------------------------------- week 3
  {
    lessonId: "dlb-week-3",
    title: "Week 3 · The Delete Script Formula",
    lessonOrder: 4,
    duration: "75 minutes + daily practice",
    objective: "Master the five steps, apply the believability test, and write scripts with your AI Studio.",
    contentBody: `
<p><strong>Level 2 — Deletion</strong></p>
<h2>This week's question</h2>
<blockquote><p>What would I tell myself instead — and could I actually believe it?</p></blockquote>

<h2>The five steps, and why each matters</h2>
${table(["Step", "What it does", "Write it well", "Common mistake"], [
  ["<strong>DELETE</strong>", "Names the old program precisely. You can't delete what you can't see.", "Use the exact words your mind uses, even if they're harsh.", "Softening it (\"I sometimes lack confidence\") so it loses its power to be seen."],
  ["<strong>REPLACE WITH</strong>", "Gives the mind a new rule to use instead.", "Accurate, specific, believable. Often the evidence-based opposite.", "Magical statements you don't believe (\"I am perfect\")."],
  ["<strong>INSTALL</strong>", "Moves the change from a thought to an identity.", "\"I am…\" or \"I am becoming…\"", "Making it about other people (\"People will respect me\")."],
  ["<strong>RUN</strong>", "Creates evidence. Beliefs change most when behaviour changes.", "One small action within 24 hours.", "Something too big to do (\"Start a company\")."],
  ["<strong>LOCK</strong>", "A short commitment that you return to.", "Short enough to remember in a hard moment.", "Long, complicated sentences."],
])}

<h2>The believability test</h2>
<p>Before you use a script, rate your REPLACE WITH line from 1–10: <em>how true does this feel right now?</em></p>
${list([
  "<strong>7–10:</strong> use it as it is.",
  "<strong>4–6:</strong> add a <strong>bridge</strong>: \"I am learning to…\", \"I am becoming someone who…\", \"It is possible that…\"",
  "<strong>1–3:</strong> make it smaller and more factual: \"I have done difficult things before, like…\"",
])}
<p>Why? Repeating something that feels completely untrue can make your mind argue back — and strengthen the old belief. A believable step forward beats an unbelievable leap.</p>

<h2>Worked examples</h2>
${tracks(
  "<strong>DELETE:</strong> \"If I fail, everyone will laugh at me.\"<br><strong>REPLACE WITH:</strong> \"Most people are focused on themselves, and the ones who matter will respect me for trying.\"<br><strong>INSTALL:</strong> \"I am someone who learns in public.\"<br><strong>RUN:</strong> Answer one question in class today, even if I'm not sure.<br><strong>LOCK:</strong> \"Trying is how I grow.\"<br><br><em>Bridge version:</em> \"I am learning that trying matters more than looking perfect.\"",
  "<strong>DELETE:</strong> \"I'm only valuable because of my success.\"<br><strong>REPLACE WITH:</strong> \"My worth was there before my success and will be there after it.\"<br><strong>INSTALL:</strong> \"I am a whole person, not a performance.\"<br><strong>RUN:</strong> Spend one hour today with someone who knew me before the success — and don't talk about work.<br><strong>LOCK:</strong> \"My identity is secure.\"<br><br><em>Bridge version:</em> \"I am learning to value myself for who I am, not just what I produce.\""
)}

<h2>Exercise 1 — Build a script step by step</h2>
<p>Take one belief from your Week 2 grid — ideally from your dominant category — and build it properly, then rate it.</p>
${block("exercise", "w3-build")}
${block("exercise", "w3-rating")}

<h2>AI practical exercise — the Delete Script Studio</h2>
<p>This is your personal script-writing agent. Give it a belief and a little context, and it writes a personalised script with you — laid out as a script card, with a bridge version, evidence that loosens the old belief, and a 21-day practice. You can come back to the Studio any time during the programme.</p>
${block("exercise", "w3-studio-input")}
${block("coach", "w3-studio")}

<h2>Scenario</h2>
<p>Amara writes: <em>DELETE "I'm not smart enough." REPLACE WITH "I am a genius and will be a billionaire by 25."</em> She reads it every morning but feels worse each time.</p>
${block("scenario", "w3-amara")}

<h2>Delete script practice — five scripts</h2>
<p>Rewrite five limiting beliefs using the formula. Read them aloud. This week, write one new script each day.</p>
${block("exercise", "w3-five")}

<h2>Week 3 quiz</h2>
${block("quiz")}
`,
    exercises: [
      scriptBuilder("w3-build", "My delete script, step by step"),
      {
        exerciseId: "w3-rating",
        title: "Believability test",
        fields: [
          field("score", "How true does my REPLACE WITH line feel right now (1–10)?", "text"),
          field("bridge", "If 6 or below — my bridge version (\"I am learning to…\"):"),
          field("evidence", "One piece of evidence from my own life that supports the new belief:"),
        ],
      },
      {
        exerciseId: "w3-studio-input",
        title: "Take a belief to the Studio",
        fields: [
          field("belief", "The belief I want to delete (in my own words):"),
          field("track", "My track — Rising, High Achiever or both:", "text"),
          field("origin", "Where I think it came from:"),
          field("shows-up", "One situation where it shows up:"),
          field("against", "Any evidence against it:"),
        ],
      },
      scriptTable("w3-five", "Five delete scripts", 5),
    ],
    scenarios: [
      {
        scenarioId: "w3-amara",
        title: "Amara's script",
        question: "Why does Amara feel worse, and what should she change?",
        options: [
          "She isn't repeating it enough — read it 100 times a day.",
          "Her REPLACE WITH line fails the believability test; she needs something accurate and believable, like \"I learn and improve with practice\", plus a small RUN action.",
          "Delete scripts don't work, so she should stop.",
          "She should hide the script so no one sees it.",
        ],
        answer: 1,
        explanation: "A statement that feels completely untrue invites the mind to argue back. Believable replacements, plus action, create real change.",
      },
    ],
    coaches: [studioCoach("w3-studio", ["w3-studio-input"])],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What is the correct order of the delete script formula?",
        ["INSTALL, DELETE, RUN, LOCK, REPLACE WITH", "DELETE, REPLACE WITH, INSTALL, RUN, LOCK", "RUN, LOCK, DELETE, INSTALL, REPLACE WITH", "DELETE, RUN, INSTALL, LOCK, REPLACE WITH"],
        1, "Delete → Replace with → Install → Run → Lock."),
      q("Which REPLACE WITH line is strongest for \"I'm not smart enough\"?",
        ["\"I am the smartest person alive.\"", "\"I learn and improve with practice.\"", "\"Smartness doesn't matter.\"", "\"Other people are stupid too.\""],
        1, "Accurate and believable beats magical."),
      q("Why does the RUN step matter so much?",
        ["It makes the script longer", "Action creates evidence that makes the new belief believable", "It replaces the need for a new belief", "It impresses other people"],
        1, "Beliefs change most when behaviour changes."),
      q("Your REPLACE WITH line feels 4/10 true. What should you do?",
        ["Use it anyway and repeat it louder", "Add a bridge statement such as \"I am learning to…\"", "Give up on the belief", "Ask a friend to believe it for you"],
        1, "4–6 means bridge it."),
      q("What makes a good RUN action?",
        ["Something big that changes everything", "One small, specific action within 24 hours", "Something someone else does for you", "A long-term plan with no start date"],
        1, "Small and soon."),
    ],
  },

  // ---------------------------------------------------------------- week 4
  {
    lessonId: "dlb-week-4",
    title: "Week 4 · Identity Rewrites",
    lessonOrder: 5,
    duration: "60 minutes + daily practice",
    objective: "Separate who you are from what you do, and rewrite your self-concept.",
    contentBody: `
<p><strong>Level 2 — Deletion</strong></p>
<h2>This week's question</h2>
<blockquote><p>Who do I believe I am — and who am I choosing to become?</p></blockquote>

<h2>Identity drives behaviour</h2>
<p>People tend to act in line with who they believe they are. Someone who believes "I'm not a sporty person" skips the gym even when they want to be fit. Someone who believes "I'm the one who holds everything together" struggles to delegate even when they're exhausted. You rarely outperform your self-image for long.</p>
<p>That's why the INSTALL step is an <strong>identity</strong> statement — "I am…" — rather than a goal.</p>

<h2>Identity vs behaviour</h2>
${table(["Behaviour (something you did)", "Identity (who you decide you are)"], [
  ["\"I failed that exam.\"", "\"I'm a failure.\""],
  ["\"I lost that deal.\"", "\"I'm losing my touch.\""],
  ["\"I was nervous in that meeting.\"", "\"I'm not a confident person.\""],
])}
<p>Limiting beliefs often turn one behaviour into a whole identity. Healthy self-talk keeps them separate: <em>"I failed that exam. I'm someone who is still learning this subject."</em></p>

<h2>Two tracks</h2>
${tracks(
  "Young people are often still <em>receiving</em> identities from others: \"the quiet one\", \"the troublemaker\", \"not academic\". An identity rewrite asks: <strong>which labels did I choose, and which were given to me?</strong>",
  "For high achievers, identity often fuses with a title, a net worth or a reputation. The question becomes: <strong>who am I without the title?</strong> If the answer is \"nothing\", every setback feels like a threat to your existence."
)}

<h2>Exercise 1 — Old identity → new identity</h2>
${block("exercise", "w4-rewrite")}

<h2>Exercise 2 — Identity anchors and actions</h2>
<p>An <strong>identity anchor</strong> is a short \"I am\" statement you can return to. An <strong>identity action</strong> is a behaviour that someone with that identity would do.</p>
${block("exercise", "w4-anchors")}

<h2>Scenario</h2>
<p>After losing a major contract, Femi, a CEO, tells his board: <em>"I'm clearly not the leader this company needs."</em></p>
${block("scenario", "w4-femi")}

<h2>Delete script practice — three identity scripts</h2>
<p>Rewrite three identity-based beliefs. Use the Week 3 Studio if you'd like help.</p>
${block("exercise", "w4-scripts")}

<h2>Week 4 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "w4-rewrite",
        title: "Identity rewrite",
        fields: [
          field("used", "Who I used to believe I was:"),
          field("given", "Labels that were given to me (not chosen):"),
          field("without", "Who I am without my title, results or labels:"),
          field("becoming", "Who I am becoming:"),
          field("choose", "Who I choose to be now:"),
        ],
      },
      {
        exerciseId: "w4-anchors",
        title: "Identity anchors and actions",
        table: { columns: ["Identity anchor (\"I am…\")", "An action that proves it this week"], rows: numbered("Anchor", 3) },
      },
      scriptTable("w4-scripts", "Three identity scripts", 3),
    ],
    scenarios: [
      {
        scenarioId: "w4-femi",
        title: "Femi's lost contract",
        question: "What is happening, and what would help?",
        options: [
          "He's right — one lost contract proves it.",
          "He has turned one outcome into an identity. A healthier statement: \"We lost this contract. I'm a leader who learns from setbacks — what do we change?\"",
          "He should blame the team.",
          "He should hide the loss from the board.",
        ],
        answer: 1,
        explanation: "Separating behaviour from identity lets him learn from the loss without deciding who he is from it.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why is INSTALL an identity statement?",
        ["Because goals don't matter", "Because people tend to act in line with who they believe they are", "Because it sounds more impressive", "Because other people need to hear it"],
        1, "Identity drives behaviour."),
      q("Which is an identity statement rather than a behaviour?", ["\"I missed the deadline.\"", "\"I'm a disorganised person.\"", "\"I was late today.\"", "\"I forgot to call.\""],
        1, "It turns behaviour into who you are."),
      q("A healthier way to talk about a failed exam is:",
        ["\"I'm stupid.\"", "\"I failed that exam; I'm still learning this subject.\"", "\"Exams are pointless.\"", "\"I'll never pass anything.\""],
        1, "Keep the behaviour and the identity separate."),
      q("A key identity question for high achievers is:", ["\"How can I earn more?\"", "\"Who am I without the title?\"", "\"Who is ahead of me?\"", "\"How do I look online?\""],
        1, "If identity is fused with status, every setback feels like a threat."),
      q("What is an identity action?",
        ["A behaviour someone with your new identity would do", "A new job title", "A social media post", "A promise to change one day"],
        0, "Actions make the identity real."),
    ],
  },
];
