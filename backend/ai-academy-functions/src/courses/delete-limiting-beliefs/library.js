// The Delete Script Studio (use any time) and the Script Libraries for
// both tracks, plus the universal belief library and the final assessment.

const { block, field, numbered, table, list, script, scriptTable } = require("./kit");
const { studioCoach } = require("./studio");

const pickExercise = (exerciseId, title) => ({
  exerciseId,
  title,
  fields: [
    field("beliefs", "Up to three beliefs from this library that feel true for me:"),
    field("strongest", "The one that feels strongest, and when it shows up:"),
    field("track", "My track — Rising, High Achiever or both:", "text"),
  ],
});

const BRIDGE_NOTE = `<p><strong>How to use these scripts:</strong> read the ones that fit, then run the believability test. If a REPLACE WITH line feels untrue today, soften it with a bridge — <em>"I am learning to…"</em>. Better still, take the belief to the Studio at the bottom of this page and let your AI agent personalise it for your life.</p>`;

// Rising track — young people (source: BSOE youth library, adapted so every
// script respects family and is safe for 13+).
const RISING = [
  ["Everyone else is ahead of me.", "I am on my own timeline.", "My growth is unique and valuable.", "Take one courageous step today.", "I trust my journey."],
  ["I don't know what I'm doing with my life.", "I am discovering my path step by step.", "Clarity grows through action.", "Try one new thing today.", "I trust the unfolding of my life."],
  ["I'm not talented enough to stand out.", "My gifts are real, and they grow with practice.", "I am uniquely equipped.", "Practise your craft for 20 minutes today.", "I trust my talent."],
  ["I'm too young to be taken seriously.", "My age brings fresh insight.", "My ideas have value.", "Share one idea today.", "I trust my voice."],
  ["I need permission before I can take action.", "I can take initiative within safe and fair limits.", "I lead my own growth.", "Take one self-directed action today.", "I trust my initiative."],
  ["If I fail, everyone will laugh at me.", "Failure is part of growth, and most people are focused on themselves.", "I am safe to learn.", "Try something imperfectly today.", "I embrace learning."],
  ["I must be perfect to succeed.", "Progress matters more than perfection.", "I grow through practice.", "Take one imperfect action today.", "I release perfectionism."],
  ["I'm not as good as people on social media.", "Social media shows highlights, not whole lives.", "My journey is real and meaningful.", "Notice one personal win today — offline.", "I trust my authentic path."],
  ["I don't have enough experience.", "Experience grows through doing.", "I learn by taking action.", "Start where you are today.", "I trust my growth."],
  ["I don't have the right personality to lead.", "Leadership comes in many styles, including quiet ones.", "My style of leadership is valid.", "Lead one small moment today.", "I trust my leadership."],
  ["I'm not allowed to make mistakes.", "Mistakes help me grow.", "I am safe to learn.", "Allow yourself one mistake today — and note what you learned.", "I embrace growth."],
  ["I'm not good enough to pursue my dreams.", "My dreams are valid, and I can work towards them.", "I am capable of growth.", "Take one dream-building step today.", "I trust my potential."],
  ["I'm too different to fit in.", "My uniqueness is a strength.", "I belong as I am.", "Express one unique part of yourself today.", "I embrace my individuality."],
  ["I'm not confident enough.", "Confidence grows through action.", "I can act even when unsure.", "Do one brave thing today.", "I build confidence daily."],
  ["I'm not smart enough.", "I learn and improve with practice.", "My mind is capable and growing.", "Learn one new thing today.", "I trust my learning."],
  ["I'm scared of disappointing my family.", "I can respect my family and still grow into my own path.", "My choices can honour both my family and my future.", "Share one of your hopes with a family member you trust.", "I grow with respect, not fear."],
  ["I'm scared of choosing the wrong path.", "Every path teaches me something, and I can change direction.", "I make the best choice I can with what I know.", "Make one clear choice today.", "I trust my journey."],
  ["I'm scared of being judged.", "Judgement can't stop my purpose.", "I am free to be myself.", "Express yourself once today.", "I choose authenticity."],
  ["I'm scared of trying new things.", "New experiences help me grow.", "I am adaptable and brave.", "Try one new thing today.", "I embrace growth."],
  ["I'm scared of failing publicly.", "Learning in public is still learning.", "I am safe to learn in front of others.", "Share one imperfect piece of work today.", "I trust my courage."],
];

// High Achiever track — wealth, success & influence (source: BSOE rich &
// famous library, plus wealth and legacy scripts).
const HIGH = [
  ["I'm only valuable because of my success.", "My worth was there before my success and will be there after it.", "I am human, whole and enough.", "Connect with someone today without talking about work.", "My identity is secure."],
  ["People only love me for what I can give.", "I can find and keep people who value me, not my status.", "I am worthy of genuine connection.", "Spend time with someone who knew you before the success.", "I trust real relationships."],
  ["I can't trust anyone.", "I trust wisely and with discernment.", "I can choose safe people.", "Share one small truth with someone who has earned it.", "I trust my discernment."],
  ["I must always be perfect.", "Perfection is not required for impact.", "I am allowed to be human.", "Do one thing imperfectly today.", "I embrace authenticity."],
  ["I'm not allowed to fail publicly.", "Learning in public is still learning.", "I am safe to grow in front of others.", "Share one lesson from a mistake today.", "I trust my courage."],
  ["I must maintain an image at all costs.", "My authenticity is more powerful than any image.", "I am free to be myself.", "Show one real part of yourself today.", "I choose authenticity."],
  ["I'm afraid of losing everything.", "I have skills, relationships and resilience that don't disappear.", "I can rebuild step by step if I ever need to.", "Take one grounded action today — list what you'd still have.", "I trust my resilience."],
  ["I'm afraid of being forgotten.", "My impact lives beyond visibility.", "I matter even in silence.", "Do one meaningful thing today that no one will see.", "I trust my legacy."],
  ["I'm afraid of disappointing my fans or followers.", "I am not responsible for everyone's expectations.", "My humanity is enough.", "Honour one personal need today.", "I choose alignment over approval."],
  ["I'm afraid of being judged harshly.", "Judgement can't stop my purpose.", "I am free to be myself.", "Express one honest view today.", "I choose authenticity."],
  ["I'm not allowed to rest.", "Rest is essential and deserved.", "My body and mind need care.", "Rest intentionally today — without guilt.", "I honour my wellbeing."],
  ["I'm not allowed to show weakness.", "Honesty about struggle builds trust.", "I am safe to be real.", "Share one honest feeling with someone you trust.", "I embrace my humanity."],
  ["I'm not allowed to say no.", "No is a complete sentence.", "My boundaries matter.", "Say no once today.", "I protect my peace."],
  ["I'm responsible for everyone's expectations.", "I am responsible for my own alignment.", "My life belongs to me.", "Make one self-honouring choice today.", "I choose alignment."],
  ["I'm trapped by my reputation.", "I am free to evolve.", "I define myself.", "Take one step towards the person you're becoming.", "I embrace evolution."],
  ["I'm not worthy without my achievements.", "My worth is not based on performance.", "I am enough as I am.", "Rest without guilt today.", "I honour my inherent worth."],
  ["I'm not safe to be myself.", "I can be myself with the right people.", "My truth has value.", "Show one real part of yourself to someone safe.", "I trust my authenticity."],
  ["I'm not allowed to change my direction.", "I am free to pivot.", "My path evolves with me.", "Take one step towards a new direction.", "I trust my evolution."],
  ["I'm not allowed to outgrow my old identity.", "Growth is natural.", "I am allowed to expand.", "Release one outdated expectation today.", "I honour my growth."],
  ["I'm not allowed to be human.", "I am allowed to be real.", "My humanity is my strength.", "Allow yourself one moment of softness today.", "I embrace my humanity."],
  ["Wealth will make people hate me.", "Some may envy success; the people who matter will be glad for me.", "I can hold wealth with generosity and wisdom.", "Share one piece of good news with someone who celebrates you.", "I prosper and lift others."],
  ["I must hide my achievements to avoid jealousy.", "I can share my success wisely, with the right people.", "I am allowed to be seen.", "Tell one trusted person about a recent win.", "I shine with wisdom."],
  ["I shouldn't charge high prices; people will think I'm greedy.", "Fair pricing reflects the value I create.", "I am confident in my contribution.", "Research the market rate for one service you offer.", "I value my work fairly."],
  ["My achievements won't matter in the long run.", "Meaningful impact lasts in the people I help.", "I am building a legacy of contribution, not just results.", "Do one thing today that helps someone grow.", "My legacy is lived daily."],
  ["I'm running out of time.", "I have enough time for what matters most.", "I choose my priorities with intention.", "Remove one low-value commitment this week.", "I invest my time wisely."],
];

// Universal belief library — beliefs only; the Studio writes the scripts.
const UNIVERSAL = [
  ["Identity", ["I'm not enough.", "I don't have what it takes.", "I'm an imposter.", "I'm too old / too young.", "I'm too different to fit in.", "I don't trust myself.", "I'm the problem one in my family.", "My background limits what I can become."]],
  ["Fear", ["I might fail.", "People will judge me.", "I could lose everything.", "I'll embarrass myself.", "I'll disappoint others.", "I'll be rejected.", "I'll make the wrong decision.", "I'll lose control.", "I'll get hurt again.", "I won't recover if things go wrong.", "I'm afraid of being seen.", "I'm afraid of change.", "I'm afraid of outgrowing people."]],
  ["Worthiness", ["I don't deserve success.", "I don't deserve love.", "I don't deserve rest.", "I don't deserve abundance.", "I must earn approval.", "I must prove myself to be valued.", "I'm replaceable.", "I'm not worthy of respect.", "I'm not worthy of being heard.", "I'm not worthy of being celebrated."]],
  ["Attachment", ["People always leave.", "I must avoid conflict.", "I must please others to be loved.", "I must hide my emotions.", "I'm too much for people.", "I'm better off alone.", "If I open up, I'll get hurt.", "If I show my needs, I'll be rejected.", "People only stay if I sacrifice myself.", "People will use me if I trust them."]],
  ["Capability", ["I'm not ready.", "I don't know enough.", "I don't have the resources.", "I don't have the time.", "I can't change.", "I can't start over.", "I can't handle pressure.", "I'm not disciplined enough.", "I'm not creative enough.", "I'm not good at learning new things.", "I'm not capable of making good decisions."]],
  ["Cultural &amp; African-context", ["People like me don't succeed globally.", "I must struggle before I can succeed.", "Opportunities are for people with connections, not for me.", "I must not outshine others or they'll resent me.", "If I fail, my whole family will be disappointed.", "I can't compete with people from developed countries.", "I must always be humble, even when I'm excellent.", "I must not challenge elders, even when I'm right.", "My dreams are too big for where I come from.", "I'm not allowed to think differently from my community."]],
];

module.exports = [
  // ---------------------------------------------------------------- studio
  {
    lessonId: "dlb-studio",
    title: "Delete Script Studio (use any time)",
    lessonOrder: 14,
    duration: "10–15 minutes per script",
    objective: "Your personal AI agent for writing, testing and storing delete scripts.",
    contentBody: `
<h2>Your Delete Script Studio</h2>
<p>Come here whenever a limiting belief shows up — before an exam, after a hard meeting, when comparison creeps in. Tell the Studio what you're facing, and your AI agent will write a personalised script with you, laid out as a card:</p>
<p><strong>DELETE</strong> → <strong>REPLACE WITH</strong> → <strong>INSTALL</strong> → <strong>RUN</strong> → <strong>LOCK</strong>, plus a bridge version, evidence that loosens the old belief, and a 21-day practice.</p>
${block("exercise", "studio-input")}
${block("coach", "studio")}

<h2>My script collection</h2>
<p>Keep the final versions of the scripts you're actively using here, so they're always in one place.</p>
${block("exercise", "studio-collection")}
`,
    exercises: [
      {
        exerciseId: "studio-input",
        title: "What I'm facing",
        fields: [
          field("belief", "The belief (in my own words):"),
          field("track", "My track — Rising, High Achiever or both:", "text"),
          field("situation", "What's happening right now, or where it shows up:"),
          field("origin", "Where I think it came from (optional):"),
          field("against", "Any evidence against it (optional):"),
        ],
      },
      scriptTable("studio-collection", "My script collection", 10),
    ],
    coaches: [studioCoach("studio", ["studio-input"])],
  },

  // ---------------------------------------------------------------- rising library
  {
    lessonId: "dlb-library-rising",
    title: "Script Library · Rising Track (Young People)",
    lessonOrder: 15,
    duration: "Browse any time",
    objective: "Twenty ready-made delete scripts for the beliefs young people carry most.",
    contentBody: `
<h2>🌱 Rising track script library</h2>
<p>These beliefs reflect the pressures many young people face: comparison culture, social media, exams and academic expectations, family hopes, and uncertainty about the future.</p>
${BRIDGE_NOTE}
${RISING.map(script).join("\n")}

<h2>Make it yours</h2>
${block("exercise", "rising-pick")}
${block("coach", "rising-studio")}
`,
    exercises: [pickExercise("rising-pick", "Beliefs I recognise from the Rising library")],
    coaches: [
      studioCoach(
        "rising-studio",
        ["rising-pick"],
        "Your Studio agent takes a belief from this library and personalises its script for your life — school, friends, family and goals."
      ),
    ],
  },

  // ---------------------------------------------------------------- high achiever library
  {
    lessonId: "dlb-library-high",
    title: "Script Library · High Achiever Track (Wealth, Success & Influence)",
    lessonOrder: 16,
    duration: "Browse any time",
    objective: "Twenty-five delete scripts for the beliefs that come with wealth, visibility and influence.",
    contentBody: `
<h2>💼 High Achiever track script library</h2>
<p>Success does not delete limiting beliefs — it often changes their shape. These scripts address the identity, trust, rest, image, money and legacy pressures that come with wealth, visibility and influence.</p>
${BRIDGE_NOTE}
<h2>Identity, trust &amp; image</h2>
${HIGH.slice(0, 10).map(script).join("\n")}
<h2>Rest, boundaries &amp; reputation</h2>
${HIGH.slice(10, 20).map(script).join("\n")}
<h2>Wealth &amp; legacy</h2>
${HIGH.slice(20).map(script).join("\n")}

<h2>Make it yours</h2>
${block("exercise", "high-pick")}
${block("coach", "high-studio")}
`,
    exercises: [pickExercise("high-pick", "Beliefs I recognise from the High Achiever library")],
    coaches: [
      studioCoach(
        "high-studio",
        ["high-pick"],
        "Your Studio agent takes a belief from this library and personalises its script for your life — your work, relationships, visibility and legacy."
      ),
    ],
  },

  // ---------------------------------------------------------------- universal library
  {
    lessonId: "dlb-library-universal",
    title: "Script Library · Universal Beliefs by Category",
    lessonOrder: 17,
    duration: "Browse any time",
    objective: "Sixty common limiting beliefs across six categories — and the Studio to script any of them.",
    contentBody: `
<h2>Universal belief library</h2>
<p>These beliefs show up across ages, backgrounds and bank balances. Find the ones that sound familiar, then take them to the Studio below.</p>
${UNIVERSAL.map(([title, beliefs]) => `<h3>${title}</h3>${list(beliefs.map((b) => `"${b}"`))}`).join("\n")}

<h2>Script one now</h2>
${block("exercise", "universal-pick")}
${block("coach", "universal-studio")}
`,
    exercises: [pickExercise("universal-pick", "Beliefs I recognise from the universal library")],
    coaches: [studioCoach("universal-studio", ["universal-pick"])],
  },

  // ---------------------------------------------------------------- assessment
  {
    lessonId: "dlb-assessment",
    title: "Delete Script Mastery Assessment",
    lessonOrder: 18,
    duration: "90 minutes",
    objective: "Show how you find, understand and rewrite limiting beliefs — and how you'll keep going.",
    contentBody: `
<h2>Delete Script Mastery — 50-mark assessment</h2>
<p>Much of this assessment draws on work you've already done. Review and update it before you submit.</p>

<h2>Part A — Belief audit (10 marks)</h2>
<p>Your <strong>Week 1 Belief Audit</strong> is submitted for this part: a belief, its origin, evidence for and against, its cost, and a healthier alternative.</p>

<h2>Part B — Categories &amp; dominant pattern (10 marks)</h2>
<p>Your <strong>Week 2 categorisation grid and dominant pattern</strong> are submitted for this part.</p>

<h2>Part C — Your five best delete scripts (10 marks)</h2>
<p>Choose your five strongest scripts from across the programme and rate each for believability.</p>
${block("exercise", "dlb-part-c")}

<h2>Part D — Evidence of change (10 marks)</h2>
${block("exercise", "dlb-part-d")}

<h2>Part E — Integration plan (10 marks)</h2>
<p>Your <strong>Week 11 integration plan</strong> is submitted for this part.</p>

<h2>Performance</h2>
${table(["Score", "Performance"], [["40–50", "Strong Application"], ["30–39", "Developing Application"], ["20–29", "Foundation Level"], ["Below 20", "Review the programme and resubmit"]])}

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "dlb-review")}

<h2>Your submission</h2>
${block("portfolio")}

<h2>Keep going</h2>
<blockquote><p>You are not your old beliefs. You are the one who gets to rewrite them.</p></blockquote>
<p>Return to the <strong>Studio</strong> whenever a new belief shows up. Run a new 21-day cycle each season. And when you see someone carrying a belief you've already deleted, share the method kindly.</p>
`,
    exercises: [
      {
        exerciseId: "dlb-part-c",
        title: "Part C — My five best delete scripts",
        table: {
          columns: ["DELETE", "REPLACE WITH", "INSTALL", "RUN", "LOCK", "Believability (1–10)"],
          rows: numbered("Script", 5),
        },
      },
      {
        exerciseId: "dlb-part-d",
        title: "Part D — Evidence of change",
        fields: [
          field("belief", "The belief that has changed most over the programme:"),
          field("evidence", "Evidence of change — RUN actions I took and what happened:"),
          field("trigger", "A trigger I now handle differently (from my Week 5 journal):"),
          field("relationship", "One relationship or cultural belief I have kept, adapted or released — and the effect:"),
          field("snapshot", "How my snapshot score changed from the welcome lesson to Week 12:"),
        ],
      },
    ],
    coaches: [
      {
        coachId: "dlb-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the marking criteria. Its marks are indicative only.",
        usesExercises: ["w1-audit", "w2-grid", "w2-dominant", "dlb-part-c", "dlb-part-d", "w11-plan"],
        promptTemplate:
          "Please review my Delete Script Mastery assessment (Parts A–E, 10 marks each). Part A is my Week 1 belief audit, Part B my Week 2 grid and dominant pattern, Part E my Week 11 integration plan.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Delete Script Mastery assessment review (formative). Parts, 10 marks each. Indicative criteria (2 marks each):\nA Belief audit (Week 1) — belief stated precisely; origin traced; evidence for AND against; cost/impact identified; healthier, believable alternative.\nB Categories & dominant pattern (Week 2) — beliefs sorted sensibly into the five categories; emotional impact noted; behavioural impact noted; dominant category identified; reasoning/shared root explained.\nC Five best scripts — all five parts present; REPLACE WITH accurate and believable (not magical); INSTALL is an identity statement; RUN small and specific; believability rated honestly (and bridges used where low).\nD Evidence of change — specific belief; concrete RUN actions and outcomes; trigger handled differently; relationship/cultural keep-adapt-release decision; honest snapshot comparison.\nE Integration plan (Week 11) — active scripts chosen; weekly routine; monthly/quarterly review; accountability identified; realistic and sustainable.\nFor each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong Application; 30–39 Developing Application; 20–29 Foundation Level; below 20 review the programme). State clearly that marks are indicative and the tutor gives the final mark. Assess skill in applying the method, never the learner's beliefs, experiences or worth. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "w1-audit", title: "Part A — Belief audit (10 marks)", lessonId: "dlb-week-1" },
      { exerciseId: "w2-grid", title: "Part B — Categorisation grid (10 marks)", lessonId: "dlb-week-2" },
      { exerciseId: "w2-dominant", title: "Part B — Dominant pattern", lessonId: "dlb-week-2" },
      { exerciseId: "dlb-part-c", title: "Part C — Five best delete scripts (10 marks)", lessonId: "dlb-assessment" },
      { exerciseId: "dlb-part-d", title: "Part D — Evidence of change (10 marks)", lessonId: "dlb-assessment" },
      { exerciseId: "w11-plan", title: "Part E — Integration plan (10 marks)", lessonId: "dlb-week-11" },
      { exerciseId: "w12-scripts", title: "My final ten scripts (Week 12)", lessonId: "dlb-week-12" },
      { exerciseId: "w12-blueprint", title: "Future identity blueprint (Week 12)", lessonId: "dlb-week-12" },
    ],
  },
];
