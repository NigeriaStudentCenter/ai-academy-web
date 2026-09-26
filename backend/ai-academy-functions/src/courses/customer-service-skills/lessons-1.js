// Lessons 1–3: principles, getting information, empathy.

const { block, q, field, numbered, table, list, ol, dialogue, QUIZ_BANDS } = require("../kit");

module.exports = [
  // ---------------------------------------------------------------- 1 principles
  {
    lessonId: "cs-principles",
    title: "1 · Customer Service Principles",
    lessonOrder: 2,
    duration: "45 minutes",
    objective: "Apply the essential principles of customer service to anyone who relies on your work.",
    contentBody: `
<h2>You are the face of the organisation</h2>
<p>To a customer, the person in front of them — or on the phone, or replying to the email — <em>is</em> the organisation. Every impression you create is applied to the whole company. That is why customer service matters so much, and why it's a skill everyone in a customer-facing role needs to master.</p>

<h2>Why great service matters — to them and to you</h2>
${table(["For the organisation", "For you"], [
  ["A stronger image and reputation", "Job satisfaction — you know you've done the job well"],
  ["Customers who come back and recommend you", "Less stress — calm, satisfied customers make shorter, easier conversations"],
  ["More business, and more profit", "Recognition — managers notice people who handle difficult customers well"],
])}

<h2>Who is your customer?</h2>
<p>A customer isn't only someone who pays you. There are four types:</p>
${table(["Type", "Example"], [
  ["<strong>External, paying</strong>", "A shopper, a client, a patient paying for treatment."],
  ["<strong>External, non-paying</strong>", "A visitor asking for directions at a tourist office; a parent speaking to a teacher."],
  ["<strong>Internal, non-paying</strong>", "Colleagues who rely on you — e.g. staff an IT technician supports."],
  ["<strong>Internal, paying</strong>", "Another department that pays for your time or service through internal budgets."],
])}
<p>The simplest rule: <strong>treat everyone who relies on your work as a customer.</strong> Everyone is a customer service representative one way or another.</p>
${block("exercise", "cs-my-customers")}

<h2>What customers want</h2>
<p>Customers have needs that must be met before they feel they were treated professionally. Customers want to:</p>
${list([
  "<strong>See effort</strong> — that you're genuinely trying.",
  "<strong>Have options</strong> — not be forced down one path.",
  "<strong>Be understood.</strong>",
  "<strong>Get speedy service</strong> — especially when they're in a hurry.",
  "<strong>Have their confidentiality respected.</strong>",
  "<strong>Feel important.</strong>",
  "<strong>Enjoy positive surprises</strong> — the small extra they didn't expect.",
  "<strong>Have their need satisfied</strong> — the thing they came for.",
  "<strong>Get value for money</strong> — not simply the cheapest option.",
  "<strong>Keep it simple</strong> — they don't want to learn how your systems work.",
  "<strong>Be treated fairly and consistently</strong>, compared with other customers.",
  "<strong>Rely on you</strong>, so they can make good decisions.",
])}

<h2>Is the customer always right?</h2>
<p>No — and the phrase is a myth. Customers make mistakes, misunderstand, or ask for too much. What the phrase really tries to capture is <strong>respect</strong>. A better version:</p>
<blockquote><p>The customer deserves to be treated as important, their needs deserve consideration, and they deserve our maximum effort — even when they are demanding or unreasonable.</p></blockquote>

<h2>Adapting to different personalities</h2>
<p>Imagine a customer in a hurry who just wants the facts — and you slowly walk them through every detail. You'll annoy them. Great CSRs <strong>match their style to the customer's</strong>. A simple model uses two questions: is this person more <em>task</em>-focused or <em>relationship</em>-focused? Do they decide <em>quickly</em> or <em>thoroughly</em>?</p>
${table(["", "Task-focused", "Relationship-focused"], [
  ["<strong>Quick decisions</strong>", "<strong>Q1 — \"Get it done\"</strong><br>Wants the business done; asks sharp questions; decides quickly on facts; no small talk. You may feel \"grilled\".<br><em>Serve them:</em> be brief, factual and efficient.", "<strong>Q2 — \"Quick connector\"</strong><br>Decides quickly based on trust in you; wants the key facts, not all of them.<br><em>Serve them:</em> be warm, give the headline facts, build trust fast."],
  ["<strong>Thorough decisions</strong>", "<strong>Q3 — \"Analyst\"</strong><br>Wants lots of relevant data; analyses before deciding; hates being pushed.<br><em>Serve them:</em> give detail and evidence, then give them time.", "<strong>Q4 — \"Relationship builder\"</strong><br>Enjoys conversation; builds the relationship over time; may consult family and friends; hates being pushed.<br><em>Serve them:</em> be patient and personal; don't rush the decision."],
])}
<p>There's no right or wrong quadrant — it's a tool. Pay most attention when a customer sits <strong>opposite</strong> you on the grid: that's where misunderstandings happen.</p>
${block("exercise", "cs-quadrant")}
${block("scenario", "cs-style")}

<h2>How you communicate: what you say, how you behave, how you look</h2>
<p>You can't control a customer's personality or the environment. But you have full control over <strong>what you say</strong>, <strong>how you behave</strong> and <strong>how you present yourself</strong>.</p>
<p>You may have heard that communication is \"7% words, 38% tone, 55% body language\". That comes from Albert Mehrabian's research — but it applies to one specific situation: when someone's words and their tone or body language <em>disagree</em> about how they feel, we tend to believe the non-verbal signals. So if you say \"I'm happy to help\" with a sigh and folded arms, the customer believes the sigh. On the phone, your <strong>tone of voice</strong> carries even more of the message.</p>
<p>The good news: when your attitude is right — you respect the customer and genuinely want to help — your tone and body language usually follow.</p>

<h2>Sell benefits, not features</h2>
<p>Customers care about <em>what it does for them</em>, not how it's made. Not \"This laptop has 16GB of RAM\" but \"You can keep all your programs open without it slowing down.\" Avoid jargon; talk about the value.</p>

<h2>Quick rapport builders</h2>
${list([
  "Smile; say \"please\" and \"thank you\".",
  "Use the customer's name.",
  "Give reasons when you say no.",
  "Show you care about their needs, and empathise with their feelings.",
  "Offer alternatives so they know their options.",
  "Don't rush — act as if you have all the time they need.",
])}

<h2>Lesson 1 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-my-customers",
        title: "My customers",
        table: { columns: ["Who they are in my work or studies", "What they need from me"], rows: ["External, paying", "External, non-paying", "Internal, non-paying", "Internal, paying"] },
      },
      {
        exerciseId: "cs-quadrant",
        title: "My style and how I'll adapt",
        fields: [
          field("mine", "The quadrant I'm closest to (Q1–Q4), and why:"),
          field("hardest", "The type of customer I find hardest to serve:"),
          field("adapt", "Two things I'll do differently to serve that type of customer:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "cs-style",
        title: "The customer in a hurry",
        question: "A customer says: \"I've got ten minutes. Which of these two phones has the better battery, and how much is it?\" What should you do?",
        options: [
          "Explain the full history of both brands so they can make an informed choice.",
          "Answer directly with the key fact and price, then ask if they'd like anything else.",
          "Chat about their plans for the weekend to build rapport first.",
          "Tell them to come back when they have more time.",
        ],
        answer: 1,
        explanation: "This is a quick, task-focused customer (Q1). Match their style: brief, factual, efficient.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("A teacher speaking to a parent is an example of which type of customer?", ["Internal, paying", "External, non-paying", "Internal, non-paying", "Not a customer"],
        1, "The parent is external and doesn't pay the teacher directly."),
      q("\"The customer is always right\" really means:", ["Always agree with the customer", "Customers deserve respect and maximum effort, even when they're wrong", "Never say no", "The customer knows your job better than you"],
        1, "It's about respect, not agreement."),
      q("A customer who analyses lots of data and hates being pushed is most likely:", ["Q1 — Get it done", "Q2 — Quick connector", "Q3 — Analyst", "Q4 — Relationship builder"],
        2, "Task-focused and thorough."),
      q("Mehrabian's research shows that:",
        ["Words never matter", "When words and tone or body language disagree about feelings, people believe the non-verbal signals", "Body language is exactly 55% of every message", "Tone doesn't matter on the phone"],
        1, "It's often misquoted — it's about conflicting signals."),
      q("Which is a benefit rather than a feature?", ["\"It has a 5,000mAh battery.\"", "\"You'll get through a full day without charging.\"", "\"It's made of aluminium.\"", "\"It has 128GB storage.\""],
        1, "Benefits describe what it does for the customer."),
    ],
  },

  // ---------------------------------------------------------------- 2 getting information
  {
    lessonId: "cs-questions",
    title: "2 · Getting Information: Questioning Techniques",
    lessonOrder: 3,
    duration: "45 minutes",
    objective: "Ask effective questions to understand what a customer really needs.",
    contentBody: `
<h2>Why questions matter</h2>
<p>You can only solve the problem you understand. The right question at the right time gets you more information, avoids misunderstandings, helps you manage the conversation and builds a stronger relationship.</p>

<h2>Closed and open questions</h2>
${table(["", "Closed questions", "Open questions"], [
  ["Answer", "One word or short — \"yes\", \"no\", a number", "Longer, with facts and often feelings"],
  ["Example", "\"Do you want the blue one?\" — \"Yes.\"", "\"How are you planning to use the camera?\" — \"Mostly on holiday, but also for photos of my family…\""],
  ["Useful for", "Confirming details quickly; staying in control", "Discovering needs; getting the customer to think and explain"],
  ["Risk", "You only learn what you already thought to ask", "Can take longer if you don't guide the conversation"],
])}
<p>Most of us ask far more closed questions than we realise. Try it: in your next few conversations, notice how many of your questions could be answered with \"yes\" or \"no\".</p>

<h2>The question funnel</h2>
${ol([
  "<strong>Open</strong> to explore: \"Tell me what's been happening with the account.\"",
  "<strong>Probing</strong> to go deeper: \"What happened when you tried to log in?\" \"What would a good outcome look like for you?\"",
  "<strong>Closed</strong> to confirm: \"So it started on Monday, and it's only on the mobile app — is that right?\"",
  "<strong>Summarise</strong> to check you've understood — and to show the customer you listened.",
])}

<h2>Avoid leading questions</h2>
<p>A leading question assumes the answer and closes the conversation: <em>\"I take it you haven't restarted it?\"</em> <em>\"Don't you think the bigger one would be better?\"</em> They can also sound like a judgement. Replace them with neutral, open questions: <em>\"What have you tried so far?\"</em> <em>\"What size would suit you best?\"</em></p>

<h2>Six honest serving men</h2>
<p>Rudyard Kipling's six question words are a simple checklist for open questions: <strong>What? Why? When? How? Where? Who?</strong></p>

<h2>Practice — open it up</h2>
<p>Rewrite each closed or leading question as an open one.</p>
${block("exercise", "cs-open-up")}

<h2>AI practical exercise — the Mystery Customer</h2>
<p>Your AI customer has come to you with a need — but hasn't told you what it is. Find out by asking questions. It will answer closed questions with just \"yes\" or \"no\", and open questions more fully. See how quickly you can uncover what they really need — then get feedback on your questioning.</p>
${block("exercise", "cs-mystery-setup")}
${block("coach", "cs-mystery")}

<h2>Scenario</h2>
${block("scenario", "cs-funnel")}

<h2>Lesson 2 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-open-up",
        title: "Open it up",
        table: {
          columns: ["My open question"],
          rows: [
            "\"Do you have your receipt?\"",
            "\"Is the problem with the screen?\"",
            "\"I take it you haven't updated the app?\"",
            "\"Did you want the cheaper plan?\"",
            "\"Was the delivery late?\"",
            "\"Don't you think it would be easier to order online?\"",
          ],
        },
      },
      {
        exerciseId: "cs-mystery-setup",
        title: "Mystery Customer setup",
        fields: [
          field("setting", "Where do you work in this role-play? (e.g. phone shop, bank, hotel front desk, IT helpdesk, clothes shop, pharmacy counter)", "text"),
          field("difficulty", "Difficulty — easy, medium or hard:", "text"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "cs-funnel",
        title: "The best first question",
        question: "A customer says: \"I've got a problem with my order.\" What is the best first question?",
        options: [
          "\"Is it late?\"",
          "\"Can you tell me what's happened with the order?\"",
          "\"I take it you didn't read the delivery email?\"",
          "\"What's your order number?\" — and nothing else until they give it.",
        ],
        answer: 1,
        explanation: "Start the funnel with an open question to understand the problem; you can ask for the order number next.",
      },
    ],
    coaches: [
      {
        coachId: "cs-mystery",
        title: "AI Mystery Customer",
        intro: "The AI plays a customer with a hidden need. Ask questions to uncover it; closed questions get only \"yes\" or \"no\". Type FEEDBACK when you think you know.",
        usesExercises: ["cs-mystery-setup"],
        promptTemplate:
          "Let's play Mystery Customer.\n\nSetup:\n\n[PASTE YOUR ANSWERS]\n\nYou are the customer with a hidden need that fits this setting. I'm the customer service representative. Start by saying something vague, like \"Hi, I need some help.\" I'll ask questions to find out what you need. Type FEEDBACK when I think I've found it.",
        systemPrompt:
          "Exercise: Lesson 2 — Mystery Customer questioning game. Secretly choose a realistic customer need that fits the learner's setting (easy: one clear need; medium: a need plus a constraint such as budget or deadline; hard: the real need differs from what the customer first asks for, e.g. asks for a new phone but really needs to recover lost photos). Stay in role as the customer. Rules: answer CLOSED questions (yes/no, either/or, a single fact) with just 'Yes.', 'No.' or a one-word fact; answer OPEN questions naturally in 1–3 sentences, revealing only what was asked; answer leading questions with mild confusion or a flat 'No'. Don't volunteer extra information. Count the learner's questions. When they type FEEDBACK or state what they think the need is, step out of role and reply in Markdown: ### Your feedback — **The hidden need was:** …; **Did you find it?** yes/partly/no; **Your questions:** count of open / closed / leading, quoting one of each; **Best question:** …; **One question that would have got there faster:** …; **Score:** out of 10. Then offer: 'Type RESTART for a new customer.'",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Which is an open question?", ["\"Do you want delivery?\"", "\"How will you be using the laptop?\"", "\"Is it the red one?\"", "\"Did you pay by card?\""],
        1, "It invites a fuller answer."),
      q("When are closed questions most useful?", ["At the start, to explore", "To confirm details quickly", "To show empathy", "Never"],
        1, "Open to explore, closed to confirm."),
      q("\"I take it you haven't restarted it?\" is a:", ["Probing question", "Leading question", "Open question", "Summary"],
        1, "It assumes the answer and can sound like a judgement."),
      q("What is the correct order of the question funnel?", ["Closed → open → summarise", "Open → probing → closed → summarise", "Leading → closed → open", "Summarise → open → closed"],
        1, "Explore, deepen, confirm, check."),
      q("Why summarise at the end?", ["To end the call faster", "To check you've understood and show you listened", "To repeat your company policy", "To upsell"],
        1, "It avoids misunderstandings and builds trust."),
    ],
  },

  // ---------------------------------------------------------------- 3 empathy
  {
    lessonId: "cs-empathy",
    title: "3 · Empathy",
    lessonOrder: 4,
    duration: "45 minutes",
    objective: "Use empathy to make customers feel understood and to maintain rapport.",
    contentBody: `
<h2>What is empathy?</h2>
<p>Empathy is the ability to recognise and understand another person's feelings — to put yourself in their shoes. It does <strong>not</strong> mean you agree with them. It means you accept that their feelings are real and you won't judge them for it. The message is: <em>\"I understand how you feel about this, and I'm interested in helping.\"</em></p>
<blockquote><p>People may forget what you said and what you did, but they remember how you made them feel.</p></blockquote>

<h2>Empathic listening</h2>
${table(["Do", "Don't"], [
  ["Show interest and be attentive.", "Dismiss feelings: \"It's not that bad.\""],
  ["Be patient; let them finish.", "Interrupt."],
  ["Act as a sounding board — non-judgemental.", "Fire lots of questions at them."],
  ["Mirror: reflect back what they said and felt.", "Change the subject."],
  ["Nod, use facial expressions, say \"I see\".", "Lecture or teach."],
  ["Encourage them to tell you more.", "Jump straight to advice before they feel heard."],
])}

<h2>How to show empathy</h2>
<p>Use phrases that show concern — <em>\"I understand…\"</em>, <em>\"I appreciate…\"</em>, <em>\"I'm sorry to hear…\"</em> — and then <strong>mirror</strong> the customer's situation in your own words. Using your own words sounds genuine and proves you listened.</p>
<p><strong>Example.</strong> A customer says: <em>\"My order was meant to arrive today for my daughter's birthday party and it still isn't here.\"</em></p>
${table(["Without empathy", "With empathy"], [
  ["\"What's your order number?\"", "\"I'm sorry to hear that — especially with your daughter's party today. Let me find your order straight away and see what we can do. Could you give me the order number?\""],
])}
<p>The second reply asks the same question — but the customer now feels heard, and the rest of the conversation will be much easier.</p>

<h2>Practice — add the empathy</h2>
<p>Each customer below got a correct but cold reply. Write a more empathic response that still moves things forward.</p>
${ol([
  dialogue([["Customer", "I think I left my bag somewhere in the shop earlier. I really hope nobody's taken it — have you had one handed in?"], ["CSR", "Hold on, I'll check lost property."]]),
  dialogue([["Customer", "I booked two tickets for Saturday, but my son has broken his leg and we can't come. Can we use them for a later date?"], ["CSR", "What kind of tickets are they?"]]),
  dialogue([["Customer", "My phone was stolen last night. I'd like to make an insurance claim."], ["CSR", "What's your policy number?"]]),
  dialogue([["Customer", "I have a meeting with your director at 4pm, but I've cracked a tooth and need an emergency dentist. Can we move it to next week?"], ["CSR", "Not sure she'll be free. She's very busy. What was your name?"]]),
  dialogue([["Customer", "I uploaded the wrong file for my print order an hour ago. Can you stop it so I can upload the right one?"], ["CSR", "No, not if it's gone to the print team."]]),
  dialogue([["Customer", "I've just had heart surgery and I've been told to avoid salt completely. Can the chef make sure there's no salt in my meal?"], ["CSR", "We only serve from the menu. I'll have to check."]]),
])}
${block("exercise", "cs-empathy-rewrites")}

<h2>AI practical exercise — Empathy Coach</h2>
<p>Your Empathy Coach reads your six rewrites, scores each one and shows you how to make it even warmer — without losing the practical next step.</p>
${block("coach", "cs-empathy-coach")}

<h2>Scenario</h2>
${block("scenario", "cs-empathy-scenario")}

<h2>Lesson 3 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-empathy-rewrites",
        title: "Add the empathy",
        table: { columns: ["My empathic response"], rows: ["1. Lost bag", "2. Tickets — son's broken leg", "3. Stolen phone claim", "4. Meeting — emergency dentist", "5. Wrong print file", "6. No salt after surgery"] },
      },
    ],
    scenarios: [
      {
        scenarioId: "cs-empathy-scenario",
        title: "\"It's not that bad\"",
        question: "A customer says their holiday photos were lost when your app crashed. Which response shows empathy?",
        options: [
          "\"It's not that bad — at least you still have the memories.\"",
          "\"I'm really sorry — those photos obviously matter a lot. Let's see what we can recover. When did you last see them in the app?\"",
          "\"You should have backed them up.\"",
          "\"Apps crash all the time.\"",
        ],
        answer: 1,
        explanation: "It acknowledges the feeling, mirrors why it matters, and moves to action with an open question.",
      },
    ],
    coaches: [
      {
        coachId: "cs-empathy-coach",
        title: "AI Empathy Coach",
        intro: "Scores your six empathic rewrites and suggests how to make each one warmer while keeping the practical next step.",
        usesExercises: ["cs-empathy-rewrites"],
        promptTemplate:
          "Here are my empathic rewrites for six customer situations (lost bag; tickets and a son's broken leg; stolen phone claim; moving a meeting for an emergency dentist; wrong print file; no salt after heart surgery):\n\n[PASTE YOUR ANSWERS]\n\nFor each, please score the empathy from 1–5, say what works, and suggest one improvement. Keep it short.",
        systemPrompt:
          "Exercise: Lesson 3 — Empathy Coach. The six situations are: 1) customer fears their bag left in the shop was stolen; 2) tickets for Saturday but son broke his leg, wants a later date; 3) phone stolen, wants to claim on insurance; 4) meeting with the director at 4pm, cracked tooth needs emergency dentist, wants to move to next week; 5) uploaded the wrong file for a print order an hour ago, wants to stop it; 6) just had heart surgery, needs no salt in the meal. For each rewrite: score 1–5; check it (a) acknowledges the feeling or situation, (b) mirrors specifics in the learner's own words rather than a stock phrase, (c) still moves to a practical next step or question, (d) avoids dismissing, blaming or over-promising. Give one short improvement per item and quote their words. If a response is missing, say so kindly. Finish with their strongest habit and one habit to build.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Empathy means:", ["Agreeing with the customer", "Understanding and accepting the customer's feelings without judging", "Giving the customer whatever they want", "Feeling sorry for yourself"],
        1, "You can empathise without agreeing."),
      q("Which is a DON'T in empathic listening?", ["Nodding", "Mirroring what they said", "Saying \"It's not that bad\"", "Encouraging them to say more"],
        2, "It dismisses their feelings."),
      q("Why use your own words when mirroring?", ["It's shorter", "It sounds genuine and proves you listened", "Scripts are banned", "Customers prefer slang"],
        1, "Stock phrases can sound robotic."),
      q("An empathic reply should:", ["Replace the practical next step", "Acknowledge the feeling and still move things forward", "Always include an apology for the company", "Be at least five sentences long"],
        1, "Empathy plus action."),
      q("\"I'm sorry to hear that — especially with the party today\" is an example of:", ["Leading question", "Mirroring with empathy", "A soft no", "A transfer"],
        1, "It reflects the customer's specific situation."),
    ],
  },
];
