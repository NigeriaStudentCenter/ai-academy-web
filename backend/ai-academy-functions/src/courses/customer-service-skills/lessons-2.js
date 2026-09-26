// Lessons 4–6: everyday scenarios, difficult customers, positive language.

const { block, q, field, table, list, ol, dialogue, QUIZ_BANDS } = require("../kit");
const { roleplayCoach } = require("./roleplay");

const improve = (exerciseId, title) => ({
  exerciseId,
  title,
  fields: [
    field("wrong", "What went wrong? (which principles were missed)"),
    field("better", "My improved conversation (write both the CSR's and the customer's lines):"),
  ],
});

module.exports = [
  // ---------------------------------------------------------------- 4 everyday scenarios
  {
    lessonId: "cs-scenarios",
    title: "4 · Everyday Customer Service Scenarios",
    lessonOrder: 5,
    duration: "45 minutes",
    objective: "Respond professionally to common awkward situations while keeping rapport.",
    contentBody: `
<h2>Principles in action</h2>
<p>Most customer service moments aren't dramatic — they're small, awkward situations that happen every day. Handle them well and nobody notices; handle them badly and one customer's bad mood spreads to the whole queue. Try each scenario before you read the explanation.</p>

<h2>Scenario A — \"Can I go first?\"</h2>
${block("scenario", "cs-sc-first")}
<h2>Scenario B — The queue-jumper</h2>
${block("scenario", "cs-sc-jump")}
<h2>Scenario C — The interruption</h2>
${block("scenario", "cs-sc-interrupt")}
<h2>Scenario D — \"I'll go to the press!\"</h2>
${block("scenario", "cs-sc-press")}
<h2>Scenario E — \"Your colleague told me…\"</h2>
${block("scenario", "cs-sc-colleague")}

<h2>The long queue — speak first</h2>
<p>When customers have waited a long time, don't wait for them to complain. <strong>Speak first</strong>: <em>\"I'm sorry to keep you waiting so long. I'll get you sorted as quickly as I can — how can I help?\"</em> You take the initiative and disarm the frustration before it builds. With a long queue, go further: tell everyone roughly how long the wait will be. Be the first to acknowledge the problem.</p>

<h2>When you don't have the information</h2>
<p>Nobody knows everything. How you handle not knowing matters far more than the gap itself.</p>
${dialogue([
  ["Customer", "Are any of these phones properly waterproof? I'm going on a boat trip."],
  ["CSR", "Don't know, sorry."],
  ["Customer", "Well, I need to know before I buy one."],
  ["CSR", "Maybe it's on the box somewhere… [shrugs]"],
])}
<p>The customer is not impressed. Before reading the model answer, try it yourself.</p>
${block("exercise", "cs-no-info")}

<h2>Model answer — read after you've tried</h2>
${dialogue([
  ["CSR", "Good question — I'm not completely sure, and I don't want to guess when you're taking it on a boat. Can I check? It'll take two minutes."],
  ["Customer", "Sure."],
  ["CSR", "[returns] I couldn't confirm it from our system, but Amaka on our phones desk knows these models inside out. She's with a customer and will be free in about ten minutes. Would you like to browse, or shall I ask her to find you as soon as she's free?"],
])}
<p><strong>Why it works:</strong> the CSR is honest, shows effort, respects the customer's time, offers options, and introduces the colleague as an expert — so the wait feels worth it.</p>

<h2>Lesson 4 quiz</h2>
${block("quiz")}
`,
    exercises: [improve("cs-no-info", "Improve the conversation: no information")],
    scenarios: [
      {
        scenarioId: "cs-sc-first",
        title: "\"Can I go first?\"",
        question: "A customer in the queue asks to be served ahead of everyone else because they're in a rush. What do you do?",
        options: [
          "Serve them first — the customer is always right.",
          "Refuse flatly: \"No. Back of the queue.\"",
          "Invite them to ask the other customers in the queue if they mind them going first.",
          "Ignore the request.",
        ],
        answer: 2,
        explanation: "It isn't your place to decide for the others. Letting the queue decide is fair, and nobody feels overlooked.",
      },
      {
        scenarioId: "cs-sc-jump",
        title: "The queue-jumper",
        question: "A customer walks straight to the front, ahead of the queue. What should you do?",
        options: [
          "Ignore it to avoid a scene.",
          "Say loudly: \"Excuse me, you've pushed in!\"",
          "Say politely: \"Sorry, you may not have noticed — the queue starts just over there. It can be confusing.\"",
          "Serve them quickly to get them out of the way.",
        ],
        answer: 2,
        explanation: "Don't ignore it (the queue will notice), but don't accuse or embarrass them — they may genuinely have missed it. Give them a way to save face.",
      },
      {
        scenarioId: "cs-sc-interrupt",
        title: "The interruption",
        question: "You're serving someone when a second customer interrupts with a question. What do you do?",
        options: [
          "Turn to answer the new customer — they seem impatient.",
          "Keep your eyes on your first customer and ignore the second.",
          "Briefly raise a hand in a polite \"one moment\" gesture and say: \"I'll be with you in just a moment — or the help desk over there can help you now.\"",
          "Tell the second customer they're being rude.",
        ],
        answer: 2,
        explanation: "Protect the customer you're serving, acknowledge the new one quickly, and give them an option.",
      },
      {
        scenarioId: "cs-sc-press",
        title: "The press threat",
        question: "An unhappy customer says: \"I'm going to post this all over social media and call the newspapers.\" What's the best response?",
        options: [
          "\"Go ahead, see if I care.\"",
          "\"Please don't — I'll get into trouble.\"",
          "\"I understand, and that's absolutely your right. I can also get our manager to speak with you now if that would help — it's entirely up to you.\"",
          "Offer a large refund immediately to stop them.",
        ],
        answer: 2,
        explanation: "Don't take the bait. Acknowledge their right calmly and offer a route that's more likely to actually solve their problem.",
      },
      {
        scenarioId: "cs-sc-colleague",
        title: "\"Your colleague said…\"",
        question: "A customer says: \"Your colleague told me yesterday I'd get this for free.\" You know that isn't the policy. What do you do?",
        options: [
          "Call your colleague a liar.",
          "Give it free to avoid an argument.",
          "Focus on the issue now: explain what you can do and why, and let them know they're welcome to speak to your colleague as well.",
          "Refuse to discuss it.",
        ],
        answer: 2,
        explanation: "Your colleague may have said it — or the customer may be testing you. Don't take the bait; solve it your way and give the customer a choice.",
      },
    ],
    coaches: [],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("When customers have waited a long time, you should:", ["Wait for them to complain", "Speak first and acknowledge the wait", "Avoid eye contact", "Blame the system"],
        1, "Take the initiative and disarm frustration early."),
      q("Why not accuse a queue-jumper?", ["They might be a VIP", "They may have made a genuine mistake — give them a way to save face", "It's not your job", "The queue doesn't care"],
        1, "Correct it politely without embarrassment."),
      q("A customer threatens to go to the press. The best approach is to:", ["Beg them not to", "Acknowledge their right calmly and offer a more helpful route", "Argue", "Ignore them"],
        1, "Don't take the bait."),
      q("If you don't know the answer, you should:", ["Guess", "Be honest, show effort, and find someone or something that knows", "Tell them to look it up", "Change the subject"],
        1, "How you handle not knowing matters most."),
      q("When introducing a colleague who can help, it's best to:", ["Say they're probably busy", "Introduce them as the expert so the wait feels worthwhile", "Not mention their name", "Say you don't know if they'll know either"],
        1, "Build confidence in the next step."),
    ],
  },

  // ---------------------------------------------------------------- 5 difficult customers
  {
    lessonId: "cs-difficult",
    title: "5 · Difficult Customers",
    lessonOrder: 6,
    duration: "75 minutes",
    objective: "Calm angry customers, handle rants, win the trust of mistrustful customers, and stay professional under pressure.",
    contentBody: `
<h2>The golden rules</h2>
${list([
  "<strong>Refuse to be offended.</strong> The customer is angry at the situation, not at you personally. Treat it strictly as business.",
  "<strong>Don't take the bait.</strong> Don't argue, defend or score points.",
  "<strong>Apologise</strong> for their experience — even if it wasn't your fault. To the customer, you are the company.",
  "<strong>Get back to the problem</strong> as quickly as you can.",
  "<strong>Offer choices.</strong> The more options a customer has, the more in control they feel.",
])}

<h2>1. The mistrustful customer</h2>
<p>Mistrust is natural when a customer must rely on your expertise — a mechanic, a repair technician, a lawyer — and you might earn more by finding more problems.</p>
${dialogue([
  ["Technician", "We've checked your phone. The battery's failing and the charging port is damaged. You'll need both replaced."],
  ["Customer", "Really? [doubtful] It's not even a year old."],
  ["Technician", "Yes, it's serious. If you don't fix both now it'll cost you much more later."],
  ["Customer", "Hmm… I'll think about it."],
])}
<p>The technician is pushing, can't be verified, and is using fear. Try improving it before reading the model answer.</p>
${block("exercise", "cs-mistrust")}

<h2>2. The angry customer</h2>
${dialogue([
  ["CSR", "Good morning, BrightNet, how can I help?"],
  ["Customer", "Your phone menu is useless! Fifteen minutes to reach a human. The voice recognition doesn't even work!"],
  ["CSR", "Right. Can I have your account number?"],
  ["Customer", "My router's stopped working."],
  ["CSR", "We don't do routers here. You need to call technical support on 0800 000 000."],
  ["Customer", "You expect me to go through that menu AGAIN?"],
  ["CSR", "That's the only option, I'm afraid."],
])}
${block("exercise", "cs-angry")}

<h2>3. Rants and abusive language — four techniques</h2>
<p>Sometimes a customer keeps ranting, repeating themselves or becomes insulting. Stay calm and use one of these to move to a constructive conversation:</p>
${table(["Technique", "How it works", "Example"], [
  ["<strong>Derail</strong>", "Pick a detail from what they said and ask about it. The unexpected question interrupts the rant; then return to the problem with empathy.", "Customer rants about a doubled bill, mentioning they were away on holiday. CSR: \"Were you away for most of the summer?\""],
  ["<strong>Silence</strong>", "On the phone, say nothing — not even \"mm\". Eventually they'll ask \"Are you there?\"", "\"Yes, I'm here. I can hear how upset you are, and I'm here to help.\""],
  ["<strong>Disengage</strong>", "Pause the conversation so both of you can reset — useful when it's heated or going round in circles.", "\"Mrs Bello, can I take a minute to check your file?\" or \"Let me speak to my colleagues and call you back tomorrow morning.\""],
  ["<strong>Distract</strong> (face to face)", "Break the eye-lock by guiding their attention to something relevant.", "Point to the screen, a leaflet, or move your pen to a note: \"Let me show you what I can see here.\""],
])}
<p><strong>A note on abuse.</strong> You don't have to accept swearing or insults. If a customer continues after you've tried to calm things, give a calm warning — <em>\"I want to help, but I can't continue if the language carries on\"</em> — and if it continues, end the call or step away and follow your workplace procedure. If you ever feel unsafe, involve your manager or security.</p>
<p><strong>Watch your \"I\"s.</strong> Staying calm isn't enough if every sentence is about you (\"I can't…\", \"I've told you…\") or you repeat the same line mechanically. Focus on them: \"You're right, that shouldn't have happened. Let's sort it out.\"</p>

<h2>4. \"I want to speak to your manager\"</h2>
<p>The customer may believe a manager will get better results, want to intimidate you, or — in some cultures — feel they should speak to someone at their own level. Don't take it personally.</p>
${dialogue([
  ["Customer", "I want to speak to your manager."],
  ["CSR", "Why?"],
  ["Customer", "Because your service is appalling."],
  ["CSR", "Well, he's not in."],
  ["Customer", "When will he be back?"],
  ["CSR", "Don't know. He's travelling."],
])}
${block("exercise", "cs-manager")}

<h2>5. Using other customers as an audience</h2>
<p>An angry customer may turn to others in the waiting area for support: <em>\"Isn't that right? I bet you're all fed up too!\"</em> If you threaten security in front of everyone, the audience may take their side. Your priority is to stop the problem spreading and treat the customer with respect.</p>
<p><strong>What works:</strong> acknowledge them, then <strong>move the conversation somewhere private</strong> — \"This isn't a very private place to discuss your details. Would you come with me so I can sort this properly?\" — and give them a moment: \"Let me fetch your file. Can I get you some water or tea?\" Time alone often calms strong emotions, hospitality shows you care, and the audience disappears.</p>

<h2>6. When it's your mistake</h2>
${dialogue([
  ["Customer", "What do you mean you don't have my reservation? Here's the confirmation email!"],
  ["CSR", "Nothing on the system. Not much I can do. Next, please."],
])}
<p>A tired traveller, an indifferent CSR — this customer will remember it for years. And there <em>are</em> rooms available.</p>
${block("exercise", "cs-booking")}

<h2>Practise with the Difficult Customer Simulator</h2>
<p>Now try it live. Choose a customer type and a setting, and the AI will play the customer. It calms down when you use the principles — and gets more frustrated when you don't. Type <strong>FEEDBACK</strong> to get your scores.</p>
${block("exercise", "cs-sim-setup")}
${block("coach", "cs-simulator")}

<h2>Model answers — read after you've tried</h2>
<h3>Mistrustful customer</h3>
${dialogue([
  ["Technician", "We ran a full diagnostic. The charging port has some damage — it still works, so it's not urgent, but keep an eye on it. It's your call."],
  ["Customer", "And the battery?"],
  ["Technician", "The battery health is at 71%, which is why it drains quickly. You have two options: keep it and bring it back when it gets worse, or replace it now and not worry for a couple of years. Personally I'd replace it, because a failing battery can swell and damage the screen. But it's entirely up to you — would you like time to think?"],
])}
<p><strong>Why it works:</strong> evidence rather than fear; pros and cons; options; an honest personal recommendation; the decision left with the customer.</p>
<h3>Angry customer</h3>
${dialogue([
  ["CSR", "I'm sorry you had such a long wait — that's frustrating. I'll help you now. Can I ask a couple of quick questions so I can sort this fast?"],
  ["Customer", "Fine."],
  ["CSR", "What's happening with your service?"],
  ["Customer", "The router's stopped working."],
  ["CSR", "Our technical team are the experts on routers, so they'll fix it fastest. Rather than sending you back through the menu, I'll explain everything to them and put you straight through. Is that OK?"],
])}
<h3>\"I want your manager\"</h3>
${dialogue([
  ["CSR", "Of course — I'm happy to put you in touch with Mr Okafor. Is there anything I can do in the meantime? It may be quicker."],
  ["Customer", "No. I want someone with authority."],
  ["CSR", "That's fine. So he's fully prepared, could you tell me what it's about?"],
  ["Customer", "Your service."],
  ["CSR", "Thank you. He's travelling today, so you have two options: Ms Adeyemi, our service lead, can speak with you now — she deals with exactly this — or Mr Okafor can call you on Thursday when he's back. Whichever you prefer."],
])}
<h3>The missing booking</h3>
${dialogue([
  ["CSR", "I'm so sorry — let me check our other records. [checks] I still can't find it, but I can see you've had a long journey, and we do have rooms tonight, so we'll get you settled either way. It'll take two minutes."],
  ["Customer", "This should never have happened."],
  ["CSR", "You're absolutely right, and I apologise. I'll make sure my manager knows, so it doesn't happen to anyone else."],
])}
<p><strong>And if there were no rooms?</strong> Still offer empathy and alternatives: \"I'll call nearby hotels, arrange transport, and look at how we can make up for the inconvenience.\"</p>

<h2>Lesson 5 quiz</h2>
${block("quiz")}
`,
    exercises: [
      improve("cs-mistrust", "Improve the conversation: mistrustful customer"),
      improve("cs-angry", "Improve the conversation: angry customer"),
      improve("cs-manager", "Improve the conversation: \"I want your manager\""),
      improve("cs-booking", "Improve the conversation: the missing booking"),
      {
        exerciseId: "cs-sim-setup",
        title: "Simulator setup",
        fields: [
          field("type", "Customer type — angry, mistrustful, demanding, ranting, wants the manager, using other customers as an audience, or your own:", "text"),
          field("setting", "Setting — e.g. bank, hotel, phone shop, restaurant, airline, internet provider, hospital reception, government office:", "text"),
          field("problem", "The problem (optional — leave blank for a surprise):"),
          field("difficulty", "Difficulty — easy, medium or hard:", "text"),
        ],
      },
    ],
    scenarios: [],
    coaches: [
      roleplayCoach("cs-simulator", {
        title: "AI Difficult Customer Simulator",
        intro: "Plays a difficult customer in the setting you choose. It calms down when you use the principles and gets more frustrated when you don't. Type FEEDBACK for scores and a better line.",
        usesExercises: ["cs-sim-setup"],
        brief:
          "Play the customer type and setting the learner chose (if the problem is blank, invent a realistic one; if the type is blank, choose angry). Difficulty: easy = calms quickly with basic empathy; medium = needs empathy plus ownership and options; hard = starts very frustrated, tests the CSR (demands the manager, threatens to post online, turns to other customers, or rants) and needs several principles used well. Typical techniques to reward: empathy phrases, apologising for the experience, ownership, not taking the bait, derailing, disengaging, moving to a private space, offering options, explaining next steps.",
      }),
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("How do you win a mistrustful customer's trust?", ["Use fear to show urgency", "Give evidence, pros and cons, options and an honest recommendation — then let them decide", "Insist firmly", "Offer a big discount"],
        1, "Trust comes from transparency and choice."),
      q("The \"derail\" technique means:", ["Hanging up", "Asking an unexpected question about a detail they mentioned to interrupt the rant", "Transferring the call", "Raising your voice"],
        1, "Then return to the problem with empathy."),
      q("An angry customer is turning to others in the waiting area. You should:", ["Call security loudly", "Invite them somewhere private and give them a moment", "Ignore them", "Argue in front of everyone"],
        1, "Isolate the issue and show hospitality."),
      q("Should you apologise if the problem wasn't your fault?", ["No — never admit fault", "Yes — apologise for the customer's experience; to them, you are the company", "Only if the manager agrees", "Only in writing"],
        1, "Apologising for the experience isn't admitting blame."),
      q("A customer keeps swearing after you've tried to calm things down. What is appropriate?",
        ["Swear back", "Accept it — it's part of the job", "Give a calm warning; if it continues, end the call or step away and follow workplace procedure", "Hang up immediately without a word"],
        2, "You don't have to accept abuse."),
    ],
  },

  // ---------------------------------------------------------------- 6 positive language
  {
    lessonId: "cs-positive",
    title: "6 · Positive Language: Sequencing Your Sentences",
    lessonOrder: 7,
    duration: "30 minutes",
    objective: "Sequence your sentences so that even a \"we can't\" sounds helpful and fair.",
    contentBody: `
<h2>Lead with the value</h2>
<p>Sometimes you have to tell a customer you can't do what they want. The same message can sound unhelpful or reasonable depending on the order of your words.</p>
${table(["Negative first", "Value first"], [
  ["\"We can't give out account numbers over the phone. It's company policy.\"", "\"To protect your privacy, we never give out account numbers over the phone.\""],
  ["\"We don't keep stock in the shop. It's all in the warehouse.\"", "\"To keep our prices low, we store everything in our warehouse — so I can order it for you and have it here by Thursday.\""],
])}
<p>The second version gives the <strong>reason</strong> and the <strong>benefit to the customer</strong> first. It sounds positive, fair and customer-focused — even though the answer is the same.</p>

<h2>Swap these phrases</h2>
${table(["Instead of…", "Try…"], [
  ["\"It's company policy.\"", "The reason behind it: \"To keep your account secure…\""],
  ["\"You'll have to…\"", "\"The quickest way is to…\""],
  ["\"I can't…\"", "\"What I can do is…\""],
  ["\"That's not my department.\"", "\"Our team who handle that are the experts — let me connect you.\""],
  ["\"You didn't…\" / \"You should have…\"", "\"Let's…\" / \"Next time, it helps to…\""],
  ["\"One moment.\"", "\"I need two minutes to check your details — may I put you on hold?\""],
])}

<h2>Practice — find the positive value</h2>
<p>For each policy, write a statement that leads with the value to the customer.</p>
${table(["Policy", "The value behind it"], [
  ["1. We don't give price quotes over the phone.", "Customers get an accurate quote they can rely on."],
  ["2. New gym members must attend an induction.", "Members learn to use equipment safely — injuries drop."],
  ["3. We only accept chip &amp; PIN or contactless payments.", "It protects customers from card fraud."],
  ["4. Parcels need a signature on delivery.", "The parcel can't be left somewhere and stolen."],
  ["5. Opened earphones can't be returned.", "Every customer gets a hygienic, unused product."],
  ["6. SIM registration requires photo ID.", "It prevents fraud and protects the customer's number and money."],
])}
${block("exercise", "cs-values")}

<h2>AI practical exercise — Positive Language Coach</h2>
${block("coach", "cs-language-coach")}

<h2>Scenario</h2>
${block("scenario", "cs-positive-scenario")}

<h2>Lesson 6 quiz</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "cs-values",
        title: "Positive value statements",
        table: { columns: ["My value-first statement"], rows: ["1. No phone quotes", "2. Gym induction", "3. Chip & PIN only", "4. Signature on delivery", "5. No returns on opened earphones", "6. Photo ID for SIM registration"] },
      },
    ],
    scenarios: [
      {
        scenarioId: "cs-positive-scenario",
        title: "The collection counter",
        question: "A customer wants to collect a parcel for their neighbour without the neighbour's ID. Which response is best?",
        options: [
          "\"No. Policy says ID only.\"",
          "\"To make sure parcels only ever go to the right person, we need the recipient's ID. If your neighbour signs the back of the card and you bring their ID, I can hand it straight over.\"",
          "\"You should have read the card.\"",
          "\"Fine, take it.\"",
        ],
        answer: 1,
        explanation: "Value first (protecting the parcel), then a clear alternative.",
      },
    ],
    coaches: [
      {
        coachId: "cs-language-coach",
        title: "AI Positive Language Coach",
        intro: "Checks your six value-first statements and suggests smoother, friendlier wording.",
        usesExercises: ["cs-values"],
        promptTemplate:
          "Here are my value-first statements for six policies (no phone quotes; gym induction; chip & PIN only; signature on delivery; no returns on opened earphones; photo ID for SIM registration):\n\n[PASTE YOUR ANSWERS]\n\nFor each, tell me whether it leads with the value to the customer, whether it sounds natural, and give one smoother version if needed.",
        systemPrompt:
          "Exercise: Lesson 6 — positive language. The policies and values: 1) no price quotes by phone → accurate quote they can rely on; 2) new gym members must do an induction → safety, fewer injuries; 3) chip & PIN or contactless only → protects against card fraud; 4) parcels need a signature → can't be left and stolen; 5) opened earphones can't be returned → every customer gets a hygienic unused product; 6) SIM registration needs photo ID → prevents fraud, protects their number and money. For each statement check: leads with the customer benefit; avoids 'policy', 'can't', 'you have to' where possible; sounds natural and warm; ideally offers a next step. Give a tick/nearly/not yet verdict, quote their words, and suggest one smoother version when useful. Keep it concise.",
      },
    ],
    quizBands: QUIZ_BANDS,
    quiz: [
      q("\"Sequencing your sentences\" means:", ["Speaking faster", "Putting the reason and customer benefit before the limitation", "Saying no first to be clear", "Using longer sentences"],
        1, "Value first, then the message."),
      q("Which is value-first?", ["\"We can't do refunds without a receipt.\"", "\"To make sure refunds go to the right person, we just need your receipt.\"", "\"No receipt, no refund.\"", "\"It's policy.\""],
        1, "It explains the benefit."),
      q("A better alternative to \"I can't\" is:", ["\"That's impossible.\"", "\"What I can do is…\"", "\"Not my problem.\"", "\"Maybe.\""],
        1, "Focus on what you can do."),
      q("Why avoid \"It's company policy\" on its own?", ["It's illegal", "It sounds like a wall and gives no reason or benefit", "Customers don't know what policy means", "It's too short"],
        1, "Give the reason behind the policy."),
      q("\"That's not my department\" is better replaced with:", ["\"Call someone else.\"", "\"Our team who handle that are the experts — let me connect you.\"", "\"I don't know.\"", "\"Try the website.\""],
        1, "Introduce the next step positively."),
    ],
  },
];
