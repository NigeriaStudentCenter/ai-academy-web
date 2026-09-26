// Lessons 7–9 and the final assessment: telephone skills, body language,
// complaints & saying no.

const { block, q, field, numbered, table, list, ol, dialogue, QUIZ_BANDS } = require("../kit");
const { roleplayCoach } = require("./roleplay");
const { CONFIDENCE } = require("./confidence");

const CHALLENGES = [
  ["You don't know the answer to the customer's request.", "Say honestly that you don't know, tell them how you'll find out (e.g. ask your supervisor), and when you'll get back to them."],
  ["You have to say no to the customer's request.", "Use the soft no: reason → sympathy → alternative."],
  ["Your computer system is very slow and the customer is getting impatient.", "Tell them the system is slow. Fill the silence: light conversation for a chatty customer, useful facts (e.g. a new service) for a task-focused one."],
  ["The customer is angry for no obvious reason.", "Use a calm, controlled voice. Keep your cool, don't take it personally, and ask an open question to find the cause."],
  ["The customer won't give you information you need.", "Explain why you need it and exactly how it will be used. Understand their concern and accommodate it where you can."],
  ["The customer disagrees with what you're saying.", "Give facts and evidence. Consider they may know something you don't; check with your supervisor or offer to come back with more detail."],
  ["The customer is very demanding.", "Explain clearly what you <em>can</em> do, show the value of what they're getting, and empathise."],
  ["The customer says a competitor is better or cheaper.", "Explain your product's benefits and why it's priced as it is; encourage a like-for-like comparison — without criticising the competitor."],
];

module.exports = [
  // ---------------------------------------------------------------- 7 telephone
  {
    lessonId: "cs-telephone",
    title: "7 · Telephone Skills",
    lessonOrder: 8,
    duration: "60 minutes",
    objective: "Make and take calls professionally, and put customers on hold or transfer them without losing their trust.",
    contentBody: `
<h2>Why phone calls feel harder</h2>
<p>Some people are naturally comfortable on the phone; others find it awkward — often task-focused people who want to get to the point. On the phone the customer can't see you, so your <strong>tone of voice</strong> carries almost everything. Smile as you speak (it can be heard), slow down slightly, and use the customer's name.</p>

<h2>Answering a call</h2>
<p>A simple, warm greeting sets the tone: <em>organisation + your name + offer to help</em>. \"Good morning, Sunrise Bank, this is Tobi speaking. How can I help you today?\"</p>

<h2>Making a call</h2>
${ol([
  "Identify yourself.",
  "State your organisation.",
  "Explain why you're calling.",
  "Check it's a good time to talk.",
  "Exchange the information.",
  "Understand their concerns and offer solutions or options.",
  "Explain what happens next.",
  "Ask if there's anything else you can help with.",
  "Let the customer end the call.",
])}
<p><strong>Golden rules:</strong> call when you promised to call; have everything you need in front of you <em>before</em> you dial; stay calm and respectful throughout.</p>

<h2>Two call-backs — compare them</h2>
<h3>Call A</h3>
<p>Tunde works at a bank. He promised to call a business customer, Mrs Eze, at 2pm about online banking features that weren't working. He forgot. At 4:30pm he finds a note that she called, annoyed.</p>
${dialogue([
  ["Tunde", "Hi, it's Tunde. I think you called me?"],
  ["Mrs Eze", "Tunde…? [trying to place him]"],
  ["Tunde", "From the bank. Anything I can do for you?"],
  ["Mrs Eze", "You were supposed to call me at 2 o'clock about my online banking. Did you forget?"],
  ["Tunde", "I've been really busy. Can you give me your account number again?"],
  ["Mrs Eze", "I'm about to board a flight. I don't have time for this. Can you just look into it?"],
  ["Tunde", "Sure, will do. Bye. [hangs up]"],
])}
<h3>Call B</h3>
<p>Chioma is an accountant. A client, Mr Hassan, asked why his tax figures had changed. Chioma promised to call back at 3pm.</p>
${dialogue([
  ["Chioma", "Hello Mr Hassan, it's Chioma Obi from Prime Accounts, calling about your tax figures as promised. Is now a good time?"],
  ["Mr Hassan", "3 o'clock exactly — impressive! Yes, go ahead."],
  ["Chioma", "Thank you. I have your figures in front of me. The difference is because of a new rule that started last month — some expenses now have to be included in that column. I'm sorry we didn't let you know sooner; that caused the confusion. Does that make sense now?"],
  ["Mr Hassan", "Yes, it does. Thanks for explaining."],
  ["Chioma", "I'll email you a link to the official guidance, and you can call me directly if anything else comes up. Is there anything else I can help with today?"],
  ["Mr Hassan", "No, that's everything. Thank you!"],
])}
${block("exercise", "cs-calls")}

<h2>Putting a customer on hold</h2>
<p>\"One moment please\" is one of the most common phrases in customer service — and one of the least helpful. A \"moment\" could be ten minutes, and the customer has no idea what you're doing. Follow three rules:</p>
${ol(["Tell them <strong>why</strong> you're putting them on hold.", "Tell them <strong>how long</strong> it will be.", "Ask their <strong>permission</strong>."])}
<p><em>\"Mr Adamu, I need about two minutes to bring up your account and check the payment. May I put you on hold?\"</em> If it takes longer than you said, come back, update them and offer an alternative — such as a call back.</p>

<h2>Transferring a call</h2>
${ol([
  "Say <strong>who</strong> you're transferring them to.",
  "Explain <strong>why</strong>.",
  "Explain what the new person <strong>already knows</strong> (so they won't repeat themselves).",
  "Ask <strong>permission</strong>.",
  "Optional: say what to do if they don't get through, and give the direct number.",
])}
${dialogue([
  ["CSR", "Our accounts team will need to process this payment for you. May I transfer you?"],
  ["Customer", "Sure."],
  ["CSR", "I'll explain your situation to them first, so you won't need to repeat anything."],
  ["Customer", "Great, thanks."],
  ["CSR", "If you don't get through, call back and ask for me, Ada, and I'll sort it. Transferring you now."],
])}
<p>The key: the customer always knows what is happening and what will happen next.</p>

<h2>Practice — holds and transfers</h2>
${block("exercise", "cs-hold")}

<h2>AI practical exercise — Phone Call Simulator</h2>
<p>The AI plays a caller. Practise your greeting, questions, a hold and a transfer — then type <strong>FEEDBACK</strong>.</p>
${block("exercise", "cs-phone-setup")}
${block("coach", "cs-phone")}

<h2>Lesson 7 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-calls",
        title: "Comparing the call-backs",
        fields: [
          field("a-worked", "Call A — what (if anything) worked?"),
          field("a-wrong", "Call A — what didn't work?"),
          field("a-improve", "Call A — what should Tunde do differently? Rewrite his opening."),
          field("b-worked", "Call B — what worked, step by step?"),
          field("b-improve", "Call B — anything Chioma could do even better?"),
        ],
      },
      {
        exerciseId: "cs-hold",
        title: "Holds and transfers",
        fields: [
          field("one", "Two better alternatives to \"One moment please\":"),
          field("transfer", "You need to transfer a caller to a colleague in another department. You don't know if she's at her desk, and she knows nothing about this customer. What do you say?"),
          field("manager", "You need to check something the customer said with your manager. It might only take a minute if your manager is free. What do you say?"),
        ],
      },
      {
        exerciseId: "cs-phone-setup",
        title: "Phone simulator setup",
        fields: [
          field("call", "Call type — incoming enquiry, incoming complaint, or you're calling a customer back:", "text"),
          field("setting", "Organisation — e.g. bank, internet provider, GP surgery, airline, online shop:", "text"),
          field("practise", "What I want to practise (e.g. hold, transfer, calming a caller, a call-back):", "text"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      roleplayCoach("cs-phone", {
        title: "AI Phone Call Simulator",
        intro: "Plays a caller (or the customer you're calling back). Practise greetings, questions, holds and transfers; type FEEDBACK for scores.",
        usesExercises: ["cs-phone-setup"],
        opening: "If it's an incoming call, start with a ring — \"[ring ring]\" — and wait for my greeting. If I'm calling you back, wait for me to start.",
        brief:
          "This is a PHONE call — the CSR can't see you. Play the caller for the learner's chosen call type and organisation. Create a realistic reason that requires the CSR to put you on hold or transfer you at least once (unless they chose to practise something else). React to phone etiquette: be pleased by a clear greeting (organisation, name, offer to help), being told why/how long/asking permission before a hold, and a transfer that says who, why and what they already know; be irritated by 'one moment please' with no explanation, silence, being transferred without warning, or having to repeat yourself. If the CSR says they're putting you on hold, reply '[on hold…]' and wait for them to return. In feedback, also score 'Phone etiquette (greeting, hold, transfer)' in place of 'Options offered' if no options were needed.",
      }),
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("What three things should you do before putting someone on hold?", ["Say why, say how long, ask permission", "Apologise three times", "Give your employee number", "Nothing — just press hold"],
        0, "Why, how long, permission."),
      q("When transferring a call, why tell the customer what the new person already knows?", ["To fill time", "So they won't have to repeat themselves", "It's a legal requirement", "To blame the other team"],
        1, "Repeating a story is one of customers' biggest frustrations."),
      q("What was Tunde's biggest mistake?", ["He smiled", "He missed the promised call time, didn't identify himself properly and ended the call without a plan", "He used the customer's name", "He asked if it was a good time"],
        1, "Call B shows the opposite habits."),
      q("Who should end a customer call?", ["The CSR, as soon as possible", "The customer", "The manager", "Whoever speaks last"],
        1, "Let the customer finish the call."),
      q("Why does tone of voice matter even more on the phone?", ["Phones distort words", "The customer can't see your body language, so tone carries the message", "It doesn't", "Calls are recorded"],
        1, "Smile — it can be heard."),
    ],
  },

  // ---------------------------------------------------------------- 8 body language
  {
    lessonId: "cs-body-language",
    title: "8 · Body Language & First Impressions",
    lessonOrder: 9,
    duration: "45 minutes",
    objective: "Make a strong first impression and read body language signals accurately, in context.",
    contentBody: `
<h2>First impressions form fast</h2>
<p>Customers form an impression of you within seconds — before you've said anything useful. Six things shape it:</p>
${table(["Area", "What customers notice"], [
  ["Appearance", "Clothes, grooming, name badge, a tidy workspace."],
  ["Facial expression", "A genuine smile; looking pleased to see them."],
  ["Posture &amp; movement", "Upright and open, turned towards them — not slumped or half-turned away."],
  ["Eye contact", "Enough to show attention, without staring."],
  ["Gestures", "Open palms, calm hands; not pointing or fidgeting."],
  ["Voice", "Warm, clear, unhurried."],
])}

<h2>The golden rule of reading body language</h2>
<p><strong>Read clusters, in context. Never judge on one signal.</strong> Crossed arms might mean defensiveness — or a cold room. Avoiding eye contact might mean discomfort — or respect: in many Nigerian and other African cultures, young people are taught not to hold an elder's gaze. Handshakes, personal space and gestures also vary between cultures. Combine what you see with what you hear, and when in doubt, ask.</p>

<h2>Useful signals</h2>
${list([
  "<strong>Genuine vs polite smiles.</strong> A genuine smile reaches the eyes (small creases at the corners); a polite one stays at the mouth. Smiles are contagious — yours can lift the mood of the interaction.",
  "<strong>The eyebrow flash.</strong> A brief lift of the eyebrows when you greet someone signals \"I'm pleased to see you\".",
  "<strong>Open palms.</strong> Showing your palms tends to signal openness and honesty; hidden or clenched hands can seem guarded.",
  "<strong>Open vs closed posture.</strong> Crossed arms and legs can signal a guarded mood; uncrossed, relaxed posture signals trust. Strangers often start closed and open up as trust grows.",
  "<strong>Orientation.</strong> Where someone's body (and especially feet) points shows where their attention is. Turned towards you = engaged; turned towards the door = ready to leave. Turn your own body fully towards your customer.",
  "<strong>Guiding attention.</strong> People's eyes follow movement. Move your pen or hand to the screen or leaflet you want them to look at.",
  "<strong>Confidence.</strong> An upright, steady posture and calm voice make your information more believable — but only if it's accurate. Overconfidence about things you're unsure of destroys trust.",
])}

<h2>Myth: you can spot a liar</h2>
<p>You may have heard that touching the nose, covering the mouth or avoiding eye contact means someone is lying. Research shows there's no reliable \"lie gesture\" — most people, including professionals, detect lies little better than chance. These gestures usually signal <strong>discomfort or stress</strong>. In customer service, treat them as a cue to check: <em>\"Is there anything about this that you're unsure of?\"</em> — never as an accusation.</p>

<h2>Exercise 1 — My first-impression audit</h2>
${block("exercise", "cs-impression")}

<h2>Exercise 2 — When a first impression was wrong</h2>
${block("exercise", "cs-wrong-impression")}

<h2>AI practical exercise — First Impressions Coach</h2>
${block("coach", "cs-impression-coach")}

<h2>Scenario</h2>
${block("scenario", "cs-arms")}

<h2>Lesson 8 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-impression",
        title: "My first-impression audit",
        fields: [
          field("appearance", "Appearance — how I present myself at work or study:"),
          field("face", "Facial expression — what my face does when I'm busy or stressed:"),
          field("posture", "Posture and movement:"),
          field("eyes", "Eye contact (and any cultural considerations for my customers):"),
          field("gestures", "Gestures and hands:"),
          field("voice", "Voice:"),
          field("feedback", "What a trusted colleague or friend says my first impression is (ask them):"),
          field("change", "Two things I'll change or keep doing:"),
        ],
      },
      {
        exerciseId: "cs-wrong-impression",
        title: "When a first impression was wrong",
        fields: [
          field("impression", "A first impression I formed of someone that turned out to be wrong:"),
          field("signals", "Which signals misled me?"),
          field("lesson", "What that teaches me about how customers might misread me — or I might misread them:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "cs-arms",
        title: "Crossed arms",
        question: "A customer stands at your counter with arms crossed and says very little. What's the best interpretation and response?",
        options: [
          "They're hostile — keep it short and get rid of them.",
          "They're lying about something.",
          "It might be guarded, uncomfortable — or just cold. Look for other signals, stay open and warm, and ask an open question.",
          "Cross your arms too, to mirror them.",
        ],
        answer: 2,
        explanation: "One signal isn't enough. Read clusters in context and invite them to talk.",
      },
    ],
    coaches: [
      {
        coachId: "cs-impression-coach",
        title: "AI First Impressions Coach",
        intro: "Reads your first-impression audit and helps you build a short, practical plan for how you come across.",
        usesExercises: ["cs-impression"],
        promptTemplate:
          "Here is my first-impression audit:\n\n[PASTE YOUR ANSWERS]\n\nHelp me turn it into a short plan: what's already working, the two changes that would make the biggest difference with customers, and anything I should consider about the cultures of the people I serve.",
        systemPrompt:
          "Exercise: Lesson 8 — first impressions coach. From the learner's audit, name what's already working (quote them), pick the two changes likely to make the biggest difference with customers, and make each concrete (e.g. 'turn your whole body towards the customer when they arrive, even if you're mid-task'). Where relevant, mention cultural variation in eye contact, handshakes, greetings and personal space respectfully. Never comment on physical features, weight, skin, hair texture, disability or accent as things to change; keep appearance advice to grooming, neatness and workplace dress codes. Don't claim body language can reveal lies.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("The golden rule for reading body language is:", ["Trust the first signal you see", "Read clusters of signals in context", "Focus only on the eyes", "Assume the worst"],
        1, "Never judge on one signal."),
      q("A customer avoids eye contact. The best interpretation is:", ["They're lying", "It depends on context — it may be discomfort, shyness or cultural respect", "They're rude", "They don't want help"],
        1, "Eye-contact norms vary between cultures."),
      q("Touching the nose while talking most reliably means:", ["Lying", "Nothing reliable on its own — often discomfort or stress", "Anger", "Agreement"],
        1, "There's no reliable 'lie gesture'."),
      q("How can you tell a genuine smile?", ["It's wider", "It reaches the eyes", "It lasts longer", "Teeth show"],
        1, "Genuine smiles involve the muscles around the eyes."),
      q("A customer's feet point towards the door. This suggests:", ["They're fully engaged", "Their attention may be on leaving", "They're lying", "They're happy"],
        1, "Orientation shows where attention is."),
    ],
  },

  // ---------------------------------------------------------------- 9 complaints & saying no
  {
    lessonId: "cs-complaints",
    title: "9 · Handling Complaints & Saying No",
    lessonOrder: 10,
    duration: "60 minutes",
    objective: "Turn complaints into loyalty, deliver a \"soft no\", and respond to common challenges.",
    contentBody: `
<h2>Is a complaint a good thing?</h2>
<p>Surprisingly often, yes. Most unhappy customers never complain — they simply leave and tell others. A customer who complains is giving you a chance to fix the problem and keep them. When a complaint is resolved well, customers often become <em>more</em> loyal than before, and the cost of handling a complaint is small compared with the value of a loyal customer and their recommendations. Good organisations welcome complaints and actively ask for feedback.</p>

<h2>What every complaining customer needs</h2>
<p>A complaining customer must:</p>
${list([
  "be <strong>respected</strong>;",
  "be <strong>taken seriously</strong>;",
  "be <strong>shown their problem will be sorted</strong>;",
  "receive <strong>prompt action</strong>;",
  "be <strong>assured it won't happen again</strong>;",
  "receive <strong>empathy</strong>.",
])}
<p>Stay cool and don't take it personally. Treat it strictly as business.</p>
${block("exercise", "cs-principles-mine")}

<h2>A simple complaint-handling flow</h2>
${ol([
  "<strong>Listen</strong> — let them finish; don't interrupt or defend.",
  "<strong>Empathise and apologise</strong> for their experience.",
  "<strong>Clarify</strong> with open, then closed, questions.",
  "<strong>Resolve</strong> — offer options where you can.",
  "<strong>Confirm</strong> what will happen and when; follow up if you promised to.",
  "<strong>Prevent</strong> — pass the lesson on so it doesn't happen again.",
])}

<h2>The soft no</h2>
<p>Sometimes the answer has to be no. People don't like hearing it — so deliver it in a way that shows you care and leaves them a way forward:</p>
${ol([
  "<strong>Reason</strong> — say no and give the reason up front.",
  "<strong>Sympathy</strong> — show you understand how they feel.",
  "<strong>Alternative</strong> — offer another way forward, so they're not left stuck.",
])}
<p><strong>Example.</strong> A barbershop serves customers in order of arrival, but a customer wants a specific barber.</p>
${table(["Step", "What you say"], [
  ["Reason", "\"I'm afraid we can't book a specific barber for walk-ins, because we serve everyone in the order they arrive.\""],
  ["Sympathy", "\"Sorry about that — we want it to be fair for everyone waiting.\""],
  ["Alternative", "\"If you'd really like to see Kunle, we have booked appointments on Saturday mornings. It's a little more, but you're guaranteed him. Shall I book you in?\""],
])}

<h2>Practice — say no softly</h2>
${ol([
  "A pharmacy customer wants a medicine that can only be sold with a prescription.",
  "A caller says they're a close relative and asks for a hospital patient's test results over the phone.",
  "A business customer wants you to dispatch goods before you've received their purchase order.",
])}
${block("exercise", "cs-soft-no")}

<h2>AI practical exercise — Soft No Role-Play</h2>
<p>The AI plays a customer who wants something you can't give. Practise reason → sympathy → alternative, live.</p>
${block("exercise", "cs-no-setup")}
${block("coach", "cs-no-roleplay")}

<h2>Common challenges</h2>
<p>Prepare your response to each challenge before reading the suggested approaches below.</p>
${block("exercise", "cs-challenges")}
<h3>Suggested approaches — read after you've tried</h3>
${table(["Challenge", "Suggested approach"], CHALLENGES)}

<h2>Lesson 9 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-principles-mine",
        title: "My organisation's complaint principles",
        fields: [field("extra", "Two extra principles specific to my organisation or role (e.g. response times, who to escalate to):")],
      },
      {
        exerciseId: "cs-soft-no",
        title: "Saying no softly",
        table: { columns: ["Reason", "Sympathy", "Alternative"], rows: ["1. Prescription medicine", "2. Patient results by phone", "3. Dispatch before purchase order"] },
      },
      {
        exerciseId: "cs-no-setup",
        title: "Soft No role-play setup",
        fields: [
          field("setting", "Setting — e.g. airline, bank, restaurant, school office, online shop:", "text"),
          field("request", "What the customer wants that you can't give (optional — leave blank for a surprise):"),
        ],
      },
      {
        exerciseId: "cs-challenges",
        title: "My responses to common challenges",
        table: { columns: ["My response"], rows: CHALLENGES.map(([c], i) => `${i + 1}. ${c}`) },
      },
    ],
    scenarios: [],
    coaches: [
      roleplayCoach("cs-no-roleplay", {
        title: "AI Soft No Role-Play",
        intro: "Plays a customer asking for something you can't give. Practise reason → sympathy → alternative; type FEEDBACK for scores.",
        usesExercises: ["cs-no-setup"],
        brief:
          "The customer asks for something the CSR cannot give (use the learner's request, or invent a realistic one for the setting that a real organisation would have to refuse, such as a refund outside the policy window, sharing someone else's information, skipping a safety step, or an unavailable service). Push back once or twice naturally ('Can't you just make an exception?'). Soften if the CSR gives a clear reason, genuine sympathy and a real alternative; get more frustrated at a bare 'no', 'it's policy', or no way forward. In feedback, add a line: 'Soft no: reason ✓/✗ · sympathy ✓/✗ · alternative ✓/✗'.",
      }),
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("Why can a complaint be good news?", ["It isn't", "It's a chance to fix the problem and often build more loyalty", "It means the customer is wrong", "It creates paperwork"],
        1, "Most unhappy customers leave without telling you."),
      q("What is the order of the soft no?", ["Alternative → reason → sympathy", "Reason → sympathy → alternative", "Sympathy → no → goodbye", "Policy → reason → apology"],
        1, "Reason, sympathy, alternative."),
      q("Which is NOT one of the six things a complaining customer needs?", ["Respect", "Prompt action", "Being told they're wrong", "Empathy"],
        2, "The others are all on the list."),
      q("A customer says a competitor is cheaper. You should:", ["Criticise the competitor", "Explain your benefits and encourage a like-for-like comparison", "Match the price immediately", "End the conversation"],
        1, "Compare like for like, without criticising."),
      q("Your system is slow and the customer is getting impatient. You should:", ["Stay silent", "Tell them it's slow and fill the silence appropriately for their style", "Blame IT", "Ask them to come back tomorrow"],
        1, "Keep them informed and engaged."),
    ],
  },

  // ---------------------------------------------------------------- final assessment
  {
    lessonId: "cs-assessment",
    title: "Final Assessment: Customer Service Skills",
    lessonOrder: 11,
    duration: "60–90 minutes",
    objective: "Show you can apply the principles across questioning, empathy, difficult customers, the phone and complaints.",
    contentBody: `
<h2>Customer Service Skills — 50-mark assessment</h2>
<p>Answer each part in your own words, as you would say it to a real customer. Use a real role if you have one, or one you'd like to work in.</p>

<h2>Part A — Principles &amp; questioning (10 marks)</h2>
${block("exercise", "cs-part-a")}

<h2>Part B — Empathy &amp; positive language (10 marks)</h2>
<p>Write what you'd say in each situation, showing empathy and leading with value where relevant.</p>
${ol([
  "A customer's wedding outfit delivery is two days late and the wedding is on Saturday.",
  "A customer wants you to reverse a bank transfer they sent to the wrong account; it can take up to 5 working days to investigate.",
  "A long-standing customer is upset that your subscription price has gone up.",
])}
${block("exercise", "cs-part-b")}

<h2>Part C — The difficult customer (10 marks)</h2>
<p>In a busy restaurant, a customer loudly complains in front of other diners that their food arrived cold and late, calls the staff \"useless\", and demands the whole meal for free.</p>
${block("exercise", "cs-part-c")}

<h2>Part D — Telephone skills (10 marks)</h2>
${block("exercise", "cs-part-d")}

<h2>Part E — Complaints &amp; the soft no (10 marks)</h2>
${ol([
  "A customer wants a refund 60 days after purchase; your returns window is 30 days.",
  "A customer asks you to match a competitor's much lower price, which you can't do.",
  "A customer wants to be seen before others who booked earlier appointments.",
])}
${block("exercise", "cs-part-e")}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "cs-review")}

<h2>Your submission</h2>
${block("portfolio")}

<h2>How far have you come?</h2>
<p>Retake the confidence check from the welcome lesson.</p>
${block("exercise", "cs-confidence-end")}
${block("exercise", "cs-commitments")}

<h2>Remember</h2>
${list([
  "Treat everyone who relies on your work as a customer.",
  "Respect and maximum effort — even when the customer is wrong.",
  "Open questions to explore, closed to confirm.",
  "Empathy first, then action.",
  "Lead with the value; give reasons, sympathy and alternatives.",
  "On the phone: why, how long, permission.",
  "Don't take the bait. Refuse to be offended.",
])}
`,
    exercises: [
      {
        exerciseId: "cs-part-a",
        title: "Part A — Principles & questioning",
        fields: [
          field("role", "The customer-facing role I'm answering for:", "text"),
          field("wants", "Three things my customers want most, and how I'll deliver each:"),
          field("adapt", "How I'd serve a quick, task-focused customer (Q1) differently from a relationship-focused, thorough one (Q4):"),
          field("questions", "Three open questions and one closed confirming question I'd ask to understand a customer's need in my role:"),
        ],
      },
      {
        exerciseId: "cs-part-b",
        title: "Part B — Empathy & positive language",
        table: { columns: ["What I'd say"], rows: ["1. Late wedding outfit", "2. Transfer to the wrong account", "3. Price increase"] },
      },
      {
        exerciseId: "cs-part-c",
        title: "Part C — The difficult customer",
        fields: [
          field("approach", "My approach — which principles and techniques I'd use, and why:"),
          field("conversation", "The conversation as I'd handle it (my lines and the customer's):"),
        ],
      },
      {
        exerciseId: "cs-part-d",
        title: "Part D — Telephone skills",
        fields: [
          field("callback", "Write the opening of a call-back to a customer you promised to call at 11am (it's now 11am):"),
          field("hold", "What I'd say to put a caller on hold while I check their order:"),
          field("transfer", "What I'd say to transfer them to the returns team:"),
        ],
      },
      {
        exerciseId: "cs-part-e",
        title: "Part E — Complaints & the soft no",
        table: { columns: ["Reason", "Sympathy", "Alternative"], rows: ["1. Refund after 60 days", "2. Price match", "3. Seen before others"] },
      },
      { exerciseId: "cs-confidence-end", title: "Customer service confidence check — end of course", scale: CONFIDENCE },
      {
        exerciseId: "cs-commitments",
        title: "My customer service commitments",
        fields: [
          field("keep", "One thing I already do well and will keep doing:"),
          field("start", "Two things I'll start doing from tomorrow:"),
          field("practise", "The difficult situation I'll keep practising (with the simulator or a colleague):"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      {
        coachId: "cs-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the marking criteria. Its marks are indicative only.",
        usesExercises: ["cs-part-a", "cs-part-b", "cs-part-c", "cs-part-d", "cs-part-e"],
        promptTemplate:
          "Please review my Customer Service Skills assessment (Parts A–E, 10 marks each).\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing, and one improvement. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Customer Service Skills final assessment review (formative). Situations: B1 wedding outfit delivery two days late, wedding Saturday; B2 bank transfer to wrong account, up to 5 working days to investigate; B3 long-standing customer upset at a subscription price rise; C loud restaurant complaint in front of diners, cold late food, staff called 'useless', demands free meal; D call-back promised at 11am, hold while checking an order, transfer to returns; E1 refund at 60 days vs 30-day window; E2 price match request that can't be met; E3 wants to be seen before earlier bookings.\nIndicative criteria, 2 marks each:\nA — relevant customer wants linked to delivery; clear Q1 vs Q4 adaptation; genuinely open questions; a proper closed confirming question; answers fit the stated role.\nB — each response acknowledges feelings with specifics; moves to action; leads with value where a limit applies (B2, B3); no dismissive or blaming language; realistic options (overall 10).\nC — acknowledges and empathises without taking the bait; moves the customer away from the audience or lowers the temperature; apologises for the experience; offers realistic options rather than simply giving in or refusing; maintains dignity of staff and customer.\nD — call-back: identifies self and organisation, reason, checks it's a good time; hold: why, how long, permission; transfer: who, why, what they already know, permission; warm tone; next steps clear.\nE — each soft no has a clear reason, genuine sympathy, a real alternative; no 'it's policy' walls; fair to other customers in E3.\nFor each part give what is strong (quote them), what's missing, one improvement, and an indicative mark out of 10 (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong; 30–39 Developing; 20–29 Foundation; below 20 review the course). State that marks are indicative and the tutor gives the final mark. Do not rewrite their answers.",
      },
    ],
    portfolio: [
      { exerciseId: "cs-part-a", title: "Part A — Principles & questioning (10 marks)", lessonId: "cs-assessment" },
      { exerciseId: "cs-part-b", title: "Part B — Empathy & positive language (10 marks)", lessonId: "cs-assessment" },
      { exerciseId: "cs-part-c", title: "Part C — The difficult customer (10 marks)", lessonId: "cs-assessment" },
      { exerciseId: "cs-part-d", title: "Part D — Telephone skills (10 marks)", lessonId: "cs-assessment" },
      { exerciseId: "cs-part-e", title: "Part E — Complaints & the soft no (10 marks)", lessonId: "cs-assessment" },
      { exerciseId: "cs-empathy-rewrites", title: "Empathy rewrites (Lesson 3)", lessonId: "cs-empathy" },
      { exerciseId: "cs-values", title: "Positive value statements (Lesson 6)", lessonId: "cs-positive" },
      { exerciseId: "cs-commitments", title: "My customer service commitments", lessonId: "cs-assessment" },
    ],
  },
];
