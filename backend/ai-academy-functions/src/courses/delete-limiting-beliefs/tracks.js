// Five more tracks for "Delete Limiting Beliefs" — Wealth Mindset,
// Relationships, African Excellence, Reinvention (later life) and Resilience
// (living with a health condition) — plus the AI Daily Reprogramming Coach.
// Source: BSOE library sections 4F, 4G, 4I, 4J and the rich & famous notes,
// rewritten so every line passes the programme's believability test.
//
// Released together: while TRACKS_LIVE is false these lessons are drafts
// (admins only) and the welcome lesson doesn't mention them.

const TRACKS_LIVE = false;

const { block, field, numbered, table, list, script } = require("./kit");
const { studioCoach } = require("./studio");

const BRIDGE_NOTE = `<p><strong>How to use these scripts:</strong> read the ones that fit, then run the believability test. If a REPLACE WITH line feels untrue today, soften it with a bridge — <em>"I am learning to…"</em>. Better still, take the belief to the Studio at the bottom of this page and let your AI agent personalise it for your life.</p>`;

const pick = (exerciseId, title) => ({
  exerciseId,
  title,
  fields: [
    field("beliefs", "Up to three beliefs from this library that feel true for me:"),
    field("strongest", "The one that feels strongest, and when it shows up:"),
    field("context", "Anything about my situation the Studio should know (optional):"),
  ],
});

/** A track library lesson: intro, grouped scripts, then pick + Studio. */
const library = ({ lessonId, title, lessonOrder, objective, intro, groups, pickId, studioId, studioIntro, after = "" }) => ({
  lessonId,
  title,
  lessonOrder,
  duration: "Browse any time",
  objective,
  draft: !TRACKS_LIVE,
  contentBody: `
${intro}
${BRIDGE_NOTE}
${groups.map(([heading, scripts]) => `<h2>${heading}</h2>\n${scripts.map(script).join("\n")}`).join("\n")}
${after}
<h2>Make it yours</h2>
${block("exercise", pickId)}
${block("coach", studioId)}
`,
  exercises: [pick(pickId, "Beliefs I recognise from this library")],
  coaches: [studioCoach(studioId, [pickId], studioIntro)],
});

// ------------------------------------------------------------------ wealth

const MONEY = [
  ["Money is the root of all evil.", "Money is a tool; how I earn and use it is what matters.", "I can build wealth with integrity.", "Write down three good things you could do with more money.", "I build wealth with good values."],
  ["Rich people are greedy or dishonest.", "Some wealthy people are generous and honest, and I can be too.", "I can prosper and stay true to my values.", "Read the story of one wealthy person you admire for their values.", "I prosper with integrity."],
  ["I'm just bad with money.", "Money skills are learned, not something I'm born with.", "I am learning to manage money well.", "Write down every expense for one day.", "I grow my money skills."],
  ["Investing is only for rich people.", "Learning about investing is open to everyone, and I can start by learning.", "I am becoming financially literate.", "Read one beginner guide from an official or regulated source.", "I learn before I leap."],
  ["I'll never earn more than I do now.", "My income can grow as my skills and value grow.", "I am increasing my value.", "List one skill that would raise your value at work or in business.", "I invest in my value."],
  ["Asking for more money is rude.", "Asking respectfully for fair pay is professional.", "I advocate for myself.", "Research the usual pay range for your role or service.", "I ask with confidence."],
  ["There will never be enough.", "I can make careful choices with what I have and build from there.", "I am a good steward of what I have.", "Write down one thing you're grateful you can afford.", "I build from where I am."],
  ["I need to look rich to be respected.", "Real security matters more than appearances.", "I am building quietly and wisely.", "Skip one purchase you'd make only to impress others.", "I choose substance over show."],
  ["Money disappears as soon as I get it.", "A simple plan can help my money last longer.", "I direct my money with intention.", "Decide where your next income will go before it arrives.", "I give my money a job."],
  ["Wanting more money makes me selfish.", "Wanting security, and the means to help others, is healthy.", "My ambition can serve others too.", "Write one way your success could help your family or community.", "My wealth can do good."],
  ["People like me don't become wealthy.", "Many people from modest backgrounds have built wealth step by step.", "I am a wealth-builder in progress.", "Read one story of someone who built wealth from a start like yours.", "I build step by step."],
  ["It's too late for me to start building wealth.", "The best time to start is now, whatever my age.", "I start from today.", "Take one small money-learning step today.", "I begin now."],
  ["If I succeed, everyone will expect me to fund them.", "I can be generous with clear, kind limits.", "I give wisely.", "Decide one giving limit you can keep.", "I give with boundaries."],
  ["One business failure would ruin me forever.", "Many successful people failed before they succeeded, and setbacks can teach me.", "I am resilient and resourceful.", "Write what you would learn if your first attempt didn't work.", "Setbacks teach me."],
  ["I can't afford to learn.", "Many valuable lessons are free or low-cost.", "I invest my time in learning.", "Spend 20 minutes today on a free course or library book.", "Learning is my best investment."],
];

const INNER_WEALTH = [
  ["Enough is never enough.", "I can decide what 'enough' means for me.", "I am secure, not just successful.", "Write down what 'enough' looks like for you — and why.", "I know when I have enough."],
  ["My children will be spoiled by our money.", "Values shape character more than money does, and I can teach them.", "I raise grounded people.", "Have one conversation with your children about work and giving.", "I pass on values, not just wealth."],
  ["Everyone who approaches me wants money.", "Some people want something; many want genuine connection.", "I can tell the difference with care.", "Notice one person who adds to your life without asking for anything.", "I recognise genuine people."],
  ["I'll lose it all if I stop.", "Good systems, good people and rest protect what I've built.", "I lead without burning out.", "Delegate one decision today.", "I build things that last without me."],
  ["Nothing I give will ever justify my wealth.", "Thoughtful giving and fair dealing are meaningful contributions.", "I give with purpose.", "Choose one cause you care about and learn about its impact.", "My giving is intentional."],
  ["Money has made me lonely.", "I can build relationships based on who I am.", "I am worth knowing beyond my wealth.", "Join one activity where your wealth isn't relevant.", "I connect as myself."],
  ["I can't trust a partner's motives.", "Trust is built through time, honesty and shared values.", "I choose love with wisdom.", "Have one honest conversation about values and money.", "I build trust openly."],
  ["My net worth is my scorecard.", "My life is measured by more than numbers.", "I am more than my balance sheet.", "List three things you're proud of that money can't buy.", "I measure what matters."],
];

const BUILDER_THINKING = table(
  ["Scarcity thinking", "Wealth-builder thinking"],
  [
    ['"I can\'t afford it."', '"How could I afford it — and is it worth it?"'],
    ["Spend first, save what's left.", "Decide what to keep first, then spend the rest."],
    ["Earn only by trading hours for money.", "Build skills, assets or products whose value can grow over time."],
    ["Avoid every risk — or gamble on a tip.", "Take small, researched risks and learn from each one."],
    ["Blame the economy, the boss or the family.", "Own what I can control, and plan around what I can't."],
    ["Stop learning once the job is secure.", "Keep investing in skills, because skills raise value."],
    ["Go it alone.", "Learn from mentors and build a network of people who are growing."],
    ["Think in weeks.", "Think in years, and let small habits compound."],
    ["Never ask — it's rude.", "Negotiate respectfully for fair value."],
    ["Spend more as soon as I earn more.", "Live below my means and let the gap grow."],
  ]
);

const wealth = {
  ...library({
    lessonId: "dlb-track-wealth",
    title: "Wealth Mindset Track · How Wealth-Builders Think",
    lessonOrder: 18,
    objective: "Spot the money beliefs that keep people stuck, learn how wealth-builders tend to think, and script your own money mindset.",
    intro: `
<h2>💰 Do wealthy people think differently?</h2>
<p>Often, yes — though not in a magical way. Research on people who <em>build</em> wealth, rather than inherit it, points to a set of habits and beliefs about money, risk, time and value. These are <strong>tendencies, not guarantees</strong>: background, health, opportunity and luck matter too. But beliefs shape the habits you are willing to try, and habits compound.</p>
<h2>Scarcity thinking vs wealth-builder thinking</h2>
${BUILDER_THINKING}
<p>Notice which column you live in most of the time. You don't need to switch overnight — one belief, one habit at a time.</p>
<p><strong>Important:</strong> this track works on beliefs and habits. It is not financial, investment or tax advice. Before you invest, borrow or make a big money decision, learn from your country's official money-guidance services or speak to a regulated adviser.</p>`,
    groups: [
      ["Money beliefs that keep people stuck", MONEY],
      ["The inner life of wealth (for those who already have it)", INNER_WEALTH],
    ],
    pickId: "wealth-pick",
    studioId: "wealth-studio",
    studioIntro: "Your Studio agent takes a money belief and personalises its script for your life — your income, your goals and your family. It works on beliefs and habits, never investment advice.",
    after: `
<h2>Your wealth-habit plan</h2>
<p>Beliefs change faster when habits back them up. Use your AI Wealth Mindset Partner to turn one money belief into a 30-day habit plan.</p>
${block("exercise", "wealth-habits")}
${block("coach", "wealth-partner")}
<p>Wealth from experience is still part of the High Achiever library — see <em>Script Library · High Achiever Track</em> for identity, trust, image and legacy scripts.</p>`,
  }),
};
wealth.exercises.push({
  exerciseId: "wealth-habits",
  title: "My money mindset",
  fields: [
    field("column", "Which column of the table do I live in most — and where does that come from?"),
    field("belief", "The money belief I most want to change:"),
    field("goal", "What I'd like to be true about my money in one year (in my own words):"),
    field("habit", "One small money habit I'm willing to try for 30 days:"),
  ],
});
wealth.coaches.push({
  coachId: "wealth-partner",
  title: "AI Wealth Mindset Partner",
  intro: "Explores one money belief with you and turns it into a realistic 30-day habit plan. Beliefs and habits only — never investment advice.",
  usesExercises: ["wealth-habits"],
  promptTemplate:
    "Please help me change one money belief and build a 30-day habit plan.\n\nHere is what I've written:\n\n[PASTE YOUR ANSWERS]\n\nAsk me one question if you need to, then give me a delete script for the belief and a simple 30-day plan.",
  systemPrompt:
    "Exercise: Wealth Mindset Partner. The learner shares which column (scarcity or wealth-builder thinking) they live in, one money belief, a one-year hope and one habit. 1) Reflect back what you notice in one or two sentences, using only what they wrote. 2) If needed, ask ONE question (e.g. where the belief came from). 3) Write one delete script in the Studio format (DELETE, REPLACE WITH, INSTALL, RUN, LOCK) with a bridge version. 4) Give a 30-day habit plan in 4 weekly steps, each tiny and specific (e.g. week 1: write down spending each evening; week 2: choose one thing to cut and where that money goes; week 3: read one beginner guide from an official money-guidance service; week 4: review and set the next month's habit). 5) End with one question about believability (1–10). Strict limits: you are not a financial adviser. Never recommend specific investments, products, platforms, loans, crypto, trading, schemes or 'get rich' ideas; never predict returns or promise wealth; never suggest borrowing to invest. If they ask for that, say kindly that you can't advise on it and suggest official money-guidance services or a regulated adviser. Watch for signs of serious debt worry or gambling, and if you see them, gently suggest free debt advice or support services. Be warm, practical and realistic; British English.",
});

// ------------------------------------------------------------- relationships

const ROMANTIC = [
  ["I'm hard to love.", "I am worthy of love, and the right people can love me as I am.", "I am lovable.", "Do one kind thing for yourself today that you'd do for someone you love.", "I accept love that is safe and kind."],
  ["I'm not enough for a healthy relationship.", "I bring real value to the people I connect with.", "I am enough as I am.", "Show up honestly in one conversation today.", "I trust my worth."],
  ["I'm too much for people.", "The right people can handle the real me.", "I am safe to be myself.", "Share one authentic part of yourself with someone safe.", "I stop shrinking for others."],
  ["I always attract the wrong partners.", "I can learn to notice warning signs early and choose differently.", "I choose with my eyes open.", "Write down three green flags you want in a partner.", "I trust my growing discernment."],
  ["I don't deserve a good partner.", "I deserve someone who treats me with respect and care.", "I am worthy of healthy love.", "Notice and receive one act of kindness today.", "I welcome respect."],
  ["Love never lasts for me.", "Past endings don't decide future relationships.", "I am learning to build lasting connection.", "Do one small act of consistency in a relationship today.", "I build love one day at a time."],
  ["People always leave.", "Some people left; others stayed, and new people can stay too.", "I am safe in healthy connection.", "Reach out to someone who has stayed.", "I notice who stays."],
  ["I must hide my emotions to be accepted.", "My feelings are valid, and I can share them wisely.", "I express myself honestly.", "Name one feeling to someone you trust today.", "I choose emotional honesty."],
  ["I must earn love by sacrificing myself.", "Healthy love includes care for me too.", "I am worthy without over-giving.", "Do one thing for yourself today without apologising.", "I give from fullness, not fear."],
  ["I'm better off alone.", "Time alone is healthy, and connection can enrich my life too.", "I am safe with the right people.", "Accept or make one invitation this week.", "I make room for connection."],
  ["If I open up, I'll get hurt.", "Opening up step by step, with safe people, builds real connection.", "I can be open and wise.", "Share one honest thought with someone who has earned it.", "I trust safe vulnerability."],
  ["If I show my needs, I'll be rejected.", "My needs are valid, and healthy people respect them.", "I deserve to be cared for.", "Express one small need clearly today.", "I honour my needs."],
  ["I'm destined to repeat my past relationships.", "Awareness lets me choose new patterns.", "I am breaking old cycles.", "Choose one new response in a familiar situation.", "I write a new pattern."],
  ["I must avoid conflict or the relationship will end.", "Respectful disagreement can make relationships stronger.", "I can speak up and stay kind.", "Raise one small issue calmly today.", "I choose honest peace."],
];

const FAMILY = [
  ["I can't say no to family.", "I can love my family and still have limits.", "My boundaries are a form of respect.", "Say a kind, clear no to one request you can't meet.", "I give with love, not obligation."],
  ["My worth is based on how much I provide.", "My value is more than what I give.", "I am valued for who I am.", "Spend time with family today without giving money or favours.", "I am more than a provider."],
  ["If I disappoint my family, I'm a failure.", "I can honour my family and still choose my own path.", "My choices can respect both my family and my future.", "Share one of your hopes with a family member you trust.", "I grow with respect, not fear."],
  ["My family's past defines my future.", "I can keep what's good from my family and change what isn't.", "I am the start of a new chapter.", "Write down one family pattern to keep and one to change.", "I build forward."],
  ["If I'm not married by a certain age, something is wrong with me.", "My worth isn't measured by a deadline.", "I am whole at every stage of life.", "Do one thing today that honours the life you have now.", "My timing is my own."],
  ["I must endure anything to keep the relationship.", "Commitment never requires accepting harm.", "I deserve safety and respect.", "If anything in your relationship feels unsafe, talk to someone you trust today.", "I choose safety and respect."],
  ["Expressing emotions is a sign of weakness.", "Expressing emotion wisely takes strength.", "I am strong and I feel.", "Name one feeling out loud today.", "My emotions are part of my strength."],
  ["My partner's success threatens me.", "Two people can both grow.", "I celebrate success, including theirs.", "Congratulate your partner or a friend on one win.", "We rise together."],
];

const relationships = library({
  lessonId: "dlb-track-relationships",
  title: "Relationships Track · Love, Family & Community",
  lessonOrder: 19,
  objective: "Twenty-two delete scripts for the beliefs we carry into romantic, family and community relationships.",
  intro: `
<h2>🤝 Relationships track script library</h2>
<p>Relationship beliefs are some of the deepest we hold, because they touch identity, attachment, trust and past hurt. Many also come from family and culture — what we were told love, marriage and loyalty must look like. This library builds on <strong>Week 6 · Relationship Mindset Reset</strong>.</p>
<p><strong>Your safety comes first.</strong> These scripts are for healthy relationships that have become stuck. They are never a reason to stay somewhere you are hurt, controlled, threatened or afraid. If that is happening, talk to someone you trust or a support service — and in an emergency call 999 (UK) or 112 (Nigeria).</p>`,
  groups: [
    ["Romantic relationships", ROMANTIC],
    ["Family, marriage &amp; cultural expectations", FAMILY],
  ],
  pickId: "relationships-pick",
  studioId: "relationships-studio",
  studioIntro: "Your Studio agent personalises a relationship script for your life — respecting your family and culture while protecting your wellbeing.",
});

// --------------------------------------------------------- african excellence

const AFRICAN = [
  ["People like me don't succeed globally.", "Many people with backgrounds like mine are succeeding globally, and I can learn from them.", "My heritage is part of my strength.", "Look up one person from your background excelling in your field.", "Excellence is part of my identity."],
  ["I must struggle before I can succeed.", "Effort matters, but suffering isn't the price of success.", "I can work hard and still look after myself.", "Choose the simpler route for one task today.", "I work smart, not just hard."],
  ["I shouldn't aim too high; it's not realistic.", "Big goals become realistic when broken into steps.", "I am allowed to be ambitious.", "Write your big goal and its first small step.", "I trust my ambition."],
  ["Opportunities are for people with connections, not for me.", "Connections help, and I can build them through preparation and courage.", "I am building my network.", "Apply for one opportunity or contact one new person today.", "I open my own doors."],
  ["I must not outshine others or they'll resent me.", "My growth can inspire others rather than diminish them.", "I am safe to shine with kindness.", "Share one achievement with someone who celebrates you.", "I shine and lift others."],
  ["If I fail, my whole family will be disappointed.", "My family's love is bigger than one setback, and mistakes help me grow.", "I am allowed to learn through setbacks.", "Take one courageous step today.", "I honour my path."],
  ["I can't compete with people from developed countries.", "I bring perspectives and strengths others don't have.", "I am globally capable.", "Share one piece of your work beyond your local circle.", "I compete with my own strengths."],
  ["My background limits what I can become.", "My background is where I start, not where I stop.", "I rise from my starting point.", "Take one step towards your future today.", "I shape my direction."],
  ["Success abroad is for the lucky, not the hardworking.", "Luck plays a part, but preparation and persistence create chances.", "I prepare for my opportunities.", "Do one thing today that prepares you for the opportunity you want.", "I make myself ready."],
  ["I shouldn't charge high prices; people will think I'm greedy.", "Fair prices reflect the value I create.", "I value my work fairly.", "Research the market rate for one service you offer.", "I price with confidence."],
  ["I must always be humble, even when I'm excellent.", "Humility and confidence can live together.", "I can acknowledge my excellence.", "Name one thing you do well, out loud.", "I am confidently humble."],
  ["I can't choose my own path; family expectations come first.", "I can honour my family and still take responsibility for my purpose.", "I am allowed to shape my future.", "Have one respectful conversation about your plans.", "I honour family and purpose."],
  ["I must not challenge elders, even when I'm right.", "Respect can include honest, respectful dialogue.", "My voice has value.", "Share one respectful truth today.", "I speak with respect and courage."],
  ["My dreams are too big for where I come from.", "Big dreams can start anywhere.", "I am bigger than my circumstances.", "Take one dream-building action today.", "I trust my vision."],
  ["I'm responsible for everyone's success but my own.", "I can support others without abandoning myself.", "My growth matters too.", "Do one thing for your own growth today.", "I invest in myself too."],
  ["I can't leave a harmful situation because of what people will say.", "My safety and peace matter more than opinions.", "I am allowed to protect myself.", "Talk to one person you trust about what you're facing.", "I choose safety."],
  ["I must hide my achievements to avoid jealousy.", "I can share my success wisely, with the right people.", "I am allowed to be seen.", "Tell one trusted person about a recent win.", "I shine with wisdom."],
  ["I'm not allowed to think differently from my community.", "Fresh perspectives can serve my community.", "I am allowed to grow.", "Share one original idea respectfully.", "I honour my roots and my growth."],
  ["Our people don't build lasting businesses.", "Many African founders are building lasting businesses, and I can learn from them.", "I am a builder.", "Learn one thing today from an African business you admire.", "I build to last."],
  ["Leaving home means abandoning my roots.", "I can carry my roots wherever I go.", "My heritage travels with me.", "Share one part of your culture with someone new.", "I belong at home and in the world."],
];

const african = library({
  lessonId: "dlb-track-african",
  title: "African Excellence Track · Africa & the Diaspora",
  lessonOrder: 20,
  objective: "Twenty delete scripts for the cultural and inherited beliefs many Africans carry, at home and abroad.",
  intro: `
<h2>🌍 African Excellence track script library</h2>
<p>Many of these beliefs grew from real history — economic instability, communal pressure, inherited narratives about who gets to succeed. Some came wrapped in love and respect. This library builds on <strong>Week 7 · Cultural &amp; Generational Beliefs</strong>: keep what serves you, adapt what needs adapting, and release what holds you back — without disrespecting your family, faith or culture.</p>`,
  groups: [["Excellence, opportunity &amp; belonging", AFRICAN]],
  pickId: "african-pick",
  studioId: "african-studio",
  studioIntro: "Your Studio agent personalises a script for your context — at home or in the diaspora — honouring your heritage while you grow.",
});

// --------------------------------------------------------------- reinvention

const REINVENTION = [
  ["My best years are behind me.", "Some of my most meaningful years can still be ahead.", "I am entering a new season.", "Write down one thing you'd like this season to hold.", "My life is still unfolding."],
  ["I'm too old to start something new.", "People start new things at every age.", "I am capable of new beginnings.", "Take one fresh step today, however small.", "I welcome new chapters."],
  ["Young people won't listen to me.", "When I listen too, my experience becomes valuable to younger people.", "I share wisdom with respect.", "Ask a younger person one question, then share one insight.", "I connect across generations."],
  ["I don't have the energy I used to have.", "I can spend my energy on what matters most.", "I honour my body's rhythm.", "Do your most important task at your best time of day.", "I invest my energy wisely."],
  ["I'm no longer useful to society.", "My presence and experience still contribute.", "I contribute in meaningful ways.", "Offer one act of help or advice today.", "I still make a difference."],
  ["Technology has passed me by.", "I can learn technology at my own pace.", "I am a learner at every age.", "Learn one small digital skill today.", "I keep learning."],
  ["It's too late to reinvent myself.", "Reinvention can start at any age, one step at a time.", "I evolve with intention.", "Take one reinvention step today.", "I embrace new chapters."],
  ["I'm not needed any more.", "My presence still matters to people.", "I am valued.", "Call or visit someone today.", "I stay connected."],
  ["I don't have anything valuable left to contribute.", "My experience and perspective are gifts.", "I carry decades of insight.", "Share one piece of wisdom today.", "I honour my contribution."],
  ["I should slow down and stop dreaming.", "Dreams have no age limit.", "My vision still matters.", "Write one new dream today.", "I keep dreaming."],
  ["I shouldn't take risks at my age.", "Thoughtful, well-sized risks can open new doors.", "I make wise decisions.", "Try one small new experience this week.", "I trust my judgement."],
  ["I'm a burden to others.", "Accepting help is part of every life stage, and I still give too.", "My needs matter.", "Ask for one thing you need, and notice one thing you give.", "I accept support with grace."],
  ["I can't learn new skills.", "Learning continues throughout life.", "I am still growing.", "Learn one new thing today.", "I trust my learning."],
  ["I'm too old to find love or companionship again.", "Love and friendship can arrive at any age.", "I am worthy of companionship.", "Join one group or reach out to one person this week.", "I welcome connection."],
  ["I'm too old to change my habits.", "Small changes are possible at any age.", "I grow through intention.", "Change one small habit today.", "I embrace growth."],
  ["I'm too old to be respected.", "Experience earns respect when I share it with confidence.", "I carry dignity and wisdom.", "Share one view clearly in a conversation today.", "I honour my voice."],
  ["Without my job title, I don't know who I am.", "My identity is bigger than my former role.", "I am more than my work.", "Write three things you are that have nothing to do with your job.", "I define myself now."],
  ["My savings decide whether my life is meaningful.", "Meaning comes from purpose, people and contribution, not just money.", "I live a rich life in many ways.", "Do one meaningful thing today that costs nothing.", "I live with purpose."],
  ["It's too late to mend old relationships.", "It's rarely too late to take one step towards repair.", "I am a bridge-builder.", "Send one warm message to someone you've lost touch with.", "I choose connection."],
  ["My life is winding down, not expanding.", "My life can still grow in new directions.", "I am in a meaningful season.", "Take one step towards something new.", "I keep growing."],
];

const reinvention = library({
  lessonId: "dlb-track-reinvention",
  title: "Reinvention Track · Later Life & Retirement",
  lessonOrder: 21,
  objective: "Twenty delete scripts for the beliefs that can come with retirement, ageing and a change of role.",
  intro: `
<h2>🌅 Reinvention track script library</h2>
<p>Retirement and later life bring real changes — in role, routine, energy, income and relationships. They also bring beliefs that can quietly shrink a life: that the best years are over, that you're no longer needed, that it's too late to learn. Many people find later life is a season of reinvention, mentoring and new purpose. These scripts help you write that chapter.</p>`,
  groups: [
    ["Purpose, identity &amp; contribution", REINVENTION.slice(0, 10)],
    ["Learning, connection &amp; new chapters", REINVENTION.slice(10)],
  ],
  pickId: "reinvention-pick",
  studioId: "reinvention-studio",
  studioIntro: "Your Studio agent personalises a script for this season of your life — your experience, your energy and what you still want to do.",
});

// ---------------------------------------------------------------- resilience

const RESILIENCE = [
  ["My condition defines me.", "My condition is part of my life, not all of who I am.", "I am more than my diagnosis.", "Do one thing today that reflects who you are beyond your health.", "I am whole."],
  ["I'm a burden to others.", "People who care about me want to help, and I still give in my own ways.", "I am worthy of care.", "Accept one offer of help today, and thank them.", "I receive care with grace."],
  ["I can't plan for the future because of my health.", "I can make flexible plans at my own pace.", "My future still matters.", "Set one gentle intention for this week.", "I plan with flexibility."],
  ["I'm too weak to pursue my goals.", "I can move towards my goals with the energy I have today.", "My pace is valid.", "Take one small, manageable step today.", "Small steps count."],
  ["I don't deserve joy until I'm fully well.", "Joy is allowed, even on hard days.", "I am allowed to feel good.", "Do one small thing that brings you joy today.", "I welcome joy."],
  ["My body is failing me.", "My body is going through something hard, and it is still working for me.", "I treat my body with kindness.", "Do one kind thing for your body today.", "I care for my body."],
  ["I must push through even when I'm exhausted.", "Rest is part of looking after my health.", "I honour my limits.", "Rest for 10 minutes today without guilt.", "I choose restoration."],
  ["I'm falling behind because of my health.", "I am on my own timeline.", "My pace is enough.", "Notice one thing you managed today.", "I measure progress my way."],
  ["I can't ask for help; it makes me look weak.", "Asking for help takes strength.", "I deserve support.", "Ask for one thing you need today.", "I accept support."],
  ["I'm losing control of my life.", "I can't control everything, but I can influence some things.", "I focus on what I can control.", "List one thing you can control today, and do it.", "I steady what I can."],
  ["I'm not capable of achieving anything meaningful.", "Meaning can come in different forms than before.", "My contribution matters.", "Do one purposeful thing today, however small.", "I create meaning."],
  ["I'm not strong enough to handle this.", "I have already got through hard days, and support can help with this one.", "I am more resilient than I feel today.", "Name one hard day you got through.", "I take it one day at a time."],
  ["I'm alone in this.", "Support is available, even if I have to ask for it.", "I am not alone.", "Reach out to one person or support group today.", "I let people in."],
  ["I'm not valuable because I can't do what I used to.", "My value isn't based on performance.", "I am worthy as I am.", "Write one thing you still offer the people around you.", "I honour my worth."],
  ["My best days are behind me.", "Good days can still come, even if they look different.", "I am open to new meaning.", "Plan one thing to look forward to.", "I stay open to good days."],
  ["Talking about my health makes people uncomfortable.", "The right people can handle honest conversations.", "My experience deserves to be heard.", "Share one honest update with someone you trust.", "I speak my truth safely."],
  ["If I rest, I'll lose everything I've built.", "Recovery protects what I've built.", "I invest in my recovery.", "Hand one task to someone else this week.", "Rest protects my future."],
  ["I should be over this by now.", "Healing doesn't follow a set timetable.", "I am patient with myself.", "Speak to yourself kindly once today, as you would to a friend.", "I heal at my own pace."],
  ["Nothing I do makes a difference to how I feel.", "Some things are out of my hands, and small choices can still help.", "I take part in my own care.", "Write one question to ask your doctor or nurse next time.", "I am an active partner in my care."],
  ["I can't be happy with this condition.", "Many people find happiness alongside health challenges.", "I am open to contentment.", "Notice three good moments today.", "I make room for happiness."],
];

const resilience = library({
  lessonId: "dlb-track-resilience",
  title: "Resilience Track · Living With a Health Condition",
  lessonOrder: 22,
  objective: "Twenty gentle delete scripts for the beliefs that can come with illness, injury or a long-term condition.",
  intro: `
<h2>💚 Resilience track script library</h2>
<p>Illness, injury and long-term conditions don't only affect the body. They can bring beliefs that hurt as much as the symptoms: that you are a burden, that your life has shrunk, that you should be "over it" by now. These scripts are gentle on purpose. Every RUN action is small, and you can always choose a smaller one.</p>
<p><strong>Please read:</strong> delete scripts are self-talk practice. They don't treat or cure any condition, and your condition is not caused by the way you think. Keep following the advice of your doctor or care team, and never change your treatment because of anything in this course. If you feel hopeless or think about harming yourself, please talk to someone now — a doctor, a helpline or someone you trust — and in an emergency call 999 (UK) or 112 (Nigeria).</p>`,
  groups: [
    ["Identity, worth &amp; support", RESILIENCE.slice(0, 10)],
    ["Pace, hope &amp; meaning", RESILIENCE.slice(10)],
  ],
  pickId: "resilience-pick",
  studioId: "resilience-studio",
  studioIntro: "Your Studio agent writes a gentle, personalised script for your situation, at your pace. It is self-talk support only, never medical advice.",
});

// ------------------------------------------------------- daily coach

const dailyCoach = {
  lessonId: "dlb-daily-coach",
  title: "AI Daily Reprogramming Coach (use every day)",
  lessonOrder: 23,
  duration: "5 minutes a day",
  objective: "A short daily check-in: run your script, log your evidence, and let your AI coach adjust the script until it feels true.",
  draft: !TRACKS_LIVE,
  contentBody: `
<h2>Reprogramming happens in the repetitions</h2>
<p>A delete script works through repetition paired with action. Reading a line once changes very little. Reading it every day, doing the RUN action and noticing the evidence is how an old belief starts to loosen. This coach is your five-minute daily partner for that.</p>
<h2>How to use it</h2>
${list([
  "<strong>Morning:</strong> read your script aloud — DELETE, REPLACE WITH, INSTALL, RUN, LOCK.",
  "<strong>During the day:</strong> do your RUN action, even imperfectly.",
  "<strong>Evening:</strong> fill in today's check-in below and talk it through with your coach. It will celebrate the evidence, spot patterns and — if the script still feels untrue — make it more believable.",
  "<strong>Log it:</strong> add a line to your 21-day log so you can see the change over time.",
])}
<h2>Today's check-in</h2>
${block("exercise", "daily-checkin")}
${block("coach", "daily-coach")}
<h2>My 21-day log</h2>
<p>One line a day. Missed days are normal — just start again. The streak matters less than the return.</p>
${block("exercise", "daily-log")}
`,
  exercises: [
    {
      exerciseId: "daily-checkin",
      title: "Today's check-in",
      fields: [
        field("script", "The script I'm running (DELETE and INSTALL lines are enough):"),
        field("day", "Day number in my cycle (1–21):", "text"),
        field("believability", "How believable the REPLACE WITH line felt today (1–10):", "text"),
        field("run", "My RUN action today — did I do it, and what happened?"),
        field("evidence", "One piece of evidence against the old belief today (however small):"),
        field("feeling", "How the old belief showed up today, if it did:"),
      ],
    },
    {
      exerciseId: "daily-log",
      title: "My 21-day log",
      table: { columns: ["Script", "Believability (1–10)", "RUN done?", "Evidence"], rows: numbered("Day", 21) },
    },
  ],
  coaches: [
    {
      coachId: "daily-coach",
      title: "AI Daily Reprogramming Coach",
      intro: "Your five-minute daily partner: it reviews today's check-in, celebrates the evidence, and adjusts your script until it feels true.",
      usesExercises: ["daily-checkin", "daily-log"],
      promptTemplate:
        "Here is today's check-in for my delete script:\n\n[PASTE YOUR ANSWERS]\n\nPlease review my day, help me notice the evidence, and adjust my script if it still doesn't feel believable. Give me tomorrow's RUN action.",
      systemPrompt:
        "Exercise: AI Daily Reprogramming Coach — a short daily check-in during a 21-day delete script cycle. Keep the whole reply under about 180 words. Steps: 1) In one or two sentences, name what went well today, quoting their evidence (never invent evidence). If they didn't do the RUN action, normalise it without judgement and shrink tomorrow's action. 2) If believability is 6 or below, rewrite only the REPLACE WITH line as a more believable bridge ('I am learning to…' / 'It is possible that…'); if it is 7 or above, say so and keep the script. 3) If their 21-day log has entries, point out one pattern (e.g. believability rising, a trigger that repeats, days the RUN action gets skipped). 4) Give tomorrow's RUN action — one small, specific, safe step that builds on today. 5) End with their LOCK line as encouragement. Never claim scripts rewire the brain or guarantee results. Follow the track rules: no financial or investment advice; nothing that keeps someone in an unsafe relationship; for health conditions, gentle actions only and never any change to treatment, diet or medication.",
    },
  ],
};

const TRACK_LESSONS = [wealth, relationships, african, reinvention, resilience, dailyCoach];

/** Welcome-lesson paragraph introducing the extra tracks (only once live). */
const WELCOME_TRACKS = TRACKS_LIVE
  ? `<p>There are also five <strong>specialist tracks</strong>, each with its own script library: <strong>💰 Wealth Mindset</strong> (how wealth-builders think about money), <strong>🤝 Relationships</strong> (love, family and community), <strong>🌍 African Excellence</strong> (Africa and the diaspora), <strong>🌅 Reinvention</strong> (later life and retirement) and <strong>💚 Resilience</strong> (living with a health condition). And your <strong>AI Daily Reprogramming Coach</strong> keeps you on track every day of your 21-day cycles.</p>`
  : "";

module.exports = { TRACK_LESSONS, TRACKS_LIVE, WELCOME_TRACKS };
