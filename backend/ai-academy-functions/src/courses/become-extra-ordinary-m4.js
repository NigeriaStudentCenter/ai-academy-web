// Become Extra Ordinary — Module 4: Design Your Extraordinary Future
// (Days 10–12). Same lesson format as Modules 1–3.

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
const LIFE_AREAS = [
  "Health & Wellbeing", "Career & Work", "Money & Financial Capability", "Relationships", "Learning",
  "Creativity", "Personal Growth", "Contribution", "Adventure & Experience", "Meaning & Values",
];

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m4-intro",
    title: "Module 4 · Design Your Extraordinary Future",
    lessonOrder: 16,
    duration: "15 minutes",
    objective: "From Future Self to Future Life — and a starting-point diagnostic.",
    contentBody: `
<h2>Module 4 — Design Your Extraordinary Future</h2>
<p><strong>Days 10–12 · Theme: from Future Self to Future Life</strong></p>
<blockquote><p>If you could intentionally design the next chapter of your life, what would you choose to create?</p></blockquote>

<h2>Module overview</h2>
<p>In Module 3 you explored identity. You asked: <em>Who am I?</em> Then: <em>Who am I becoming?</em></p>
<p>Module 4 moves from identity into <strong>life design</strong>. A future identity needs an environment in which it can grow.</p>
<ul>
<li>Someone who wants to become an entrepreneur may need to design time for experimentation.</li>
<li>Someone who wants to become a better parent may need to redesign priorities.</li>
<li>Someone who wants greater financial independence may need to develop financial capability.</li>
<li>Someone who wants meaningful work may need to acquire new skills and test new opportunities.</li>
</ul>
<p>This module therefore introduces a simple principle:</p>
<blockquote><p>A future is not only something you imagine. It is something you progressively design.</p></blockquote>
<p>The aim is not to create a perfect life plan. The aim is to develop enough clarity to make better decisions today.</p>

<h2>Module learning outcomes</h2>
<p>By the end of Module 4, you will be able to:</p>
<ol>
<li>Describe your preferred future in practical terms.</li>
<li>Distinguish between fantasy, aspiration and actionable vision.</li>
<li>Examine different areas of your life systematically.</li>
<li>Identify areas requiring attention, maintenance or change.</li>
<li>Prioritise what matters most.</li>
<li>Write a detailed future-life narrative.</li>
<li>Use AI to challenge and develop a personal vision.</li>
<li>Translate vision into priorities.</li>
<li>Create a personal future letter.</li>
<li>Begin constructing your <strong>Extraordinary Life Blueprint</strong>.</li>
</ol>

<h2>Module 4 diagnostic — Future Direction &amp; Life Design</h2>
<p>Rate each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>.</p>
${block("exercise", "m4-diagnostic")}
<p><strong>Important:</strong> this is a learning tool, not a psychological assessment or prediction of future success.</p>
`,
    exercises: [
      {
        exerciseId: "m4-diagnostic",
        title: "Future Direction & Life Design Diagnostic",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "Clarity",
              statements: [
                "I have a reasonably clear idea of the life I want to build.",
                "I know what matters most to me.",
                "I can describe what I want beyond simply earning more money.",
                "I understand what kind of work and contribution matter to me.",
                "I can describe what a fulfilling ordinary day would look like.",
              ],
            },
            {
              title: "Priorities",
              statements: [
                "I know which areas of my life need the most attention.",
                "I can distinguish important priorities from distractions.",
                "I deliberately protect time for things that matter.",
                "I can say no to some opportunities when they conflict with my priorities.",
                "My current activities broadly reflect my stated values.",
              ],
            },
            {
              title: "Future Planning",
              statements: [
                "I think about the longer-term consequences of important decisions.",
                "I turn broad ambitions into practical steps.",
                "I regularly review whether I am moving in the direction I want.",
                "I am willing to adjust my plans when circumstances change.",
                "I have at least one meaningful future project I want to pursue.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 30, title: "Direction Needs Exploration", text: "Spend additional time discovering what matters to you before making major plans." },
            { min: 31, max: 45, title: "Developing Direction", text: "You have some clarity but may benefit from stronger priorities." },
            { min: 46, max: 60, title: "Strong Direction", text: "You have a useful understanding of where you want to go." },
            { min: 61, max: 75, title: "Intentional Life Design", text: "You demonstrate strong awareness of priorities and future direction." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 10
  {
    lessonId: "m4-day-10",
    title: "Module 4 · Day 10 — Design Your Extraordinary Life",
    lessonOrder: 17,
    duration: "60–75 minutes",
    objective: "Design an ordinary day in your preferred future — the life you'd be happy to repeat.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What would an extraordinary version of an ordinary Tuesday look like for you?</p></blockquote>
${talk("Your Extraordinary Tuesday", `
When people imagine an extraordinary life, they often imagine extraordinary events. A huge business. A luxury house. Travelling the world. Fame. Financial freedom. A major achievement.

But there is another way to think about your future. Imagine an ordinary Tuesday. Not your birthday. Not a holiday. Not the day you receive an award. Just an ordinary Tuesday.

Where do you wake up? What kind of work do you do? Who do you speak to? How do you spend your time? What are you learning? What are you creating? Who benefits from your work? How much control do you have over your day? What does your evening look like?

The quality of a life is experienced largely through ordinary days.

That means designing your future is not only about choosing spectacular goals. It is about asking: "What kind of ordinary life would I be happy to repeat?"

Your extraordinary life may therefore look very different from somebody else's. For one person, it may mean entrepreneurship. For another, meaningful professional work. For another, family, community and service. For another, creativity, learning and freedom.

The objective is not to copy somebody else's definition. It is to design a future that reflects your own values, strengths and aspirations.

Today, design your extraordinary Tuesday. Then ask: <strong>What would I need to change today to move towards it?</strong>`)}

<h2>Reading — The Ordinary Tuesday Test</h2>
<p>A vision can sound impressive while still being disconnected from everyday life. For example: <em>"I want to become extremely successful."</em> But what does success look like on an ordinary Wednesday?</p>
<p>If the future requires constant stress, no meaningful relationships, no time for health, no opportunity to learn, and work you dislike, then the headline may sound attractive while the underlying lifestyle does not.</p>
<p>Instead of asking only <em>"What do I want to achieve?"</em>, ask: <strong>"What kind of life do I want to experience repeatedly?"</strong></p>

<h2>The five dimensions of an Extraordinary Tuesday</h2>
<ol>
<li><strong>Work</strong> — what are you doing? Where? With whom? Solving what problems?</li>
<li><strong>Learning</strong> — what are you learning or developing?</li>
<li><strong>Relationships</strong> — who matters? How much time do you have for them?</li>
<li><strong>Wellbeing</strong> — how do you look after your physical and emotional wellbeing?</li>
<li><strong>Contribution</strong> — who benefits from what you do?</li>
</ol>

<h2>The Extraordinary Tuesday template</h2>
${block("exercise", "d10-template")}

<h2>Interactive example — Two futures</h2>
${table(["", "Future A", "Future B"], [
  ["Headline", "\"I am very successful.\"", "\"I have meaningful professional work, financial stability and time to contribute to my community.\""],
  ["Ordinary day", "Working constantly, little family time, no exercise, constant financial pressure, no time for learning", "Focused work, learning, relationships, exercise, meaningful contribution, protected personal time"],
])}
<p>Which future is more clearly designed? The answer is not about which lifestyle is universally better. The exercise is about identifying which future is <strong>consistent with your own values</strong>.</p>

<h2>Case study — Daniel's definition of success</h2>
<p>Daniel originally writes: <em>"My extraordinary life means becoming rich."</em> His tutor asks: <em>"What would your ordinary Tuesday look like?"</em></p>
<p>Daniel thinks more carefully. He writes: flexible working; enough income to support his family; meaningful projects; continuous learning; time to exercise; the ability to travel occasionally; helping young people develop digital skills.</p>
<p>He realises that money is important to him, but it is not the whole vision. His definition becomes:</p>
<p><strong>"Financial independence that gives me freedom to do meaningful work, support my family and contribute to others."</strong></p>
<p>That is a more useful design brief.</p>

<h2>Learner activity — Design your Extraordinary Tuesday</h2>
<p>Write a one-page description of your ideal ordinary Tuesday approximately five years from now. Include where you live, what you do, who you work with, what you are learning, who you spend time with, what you contribute, how you look after yourself, what you have time for, and what you deliberately no longer do.</p>
${block("exercise", "d10-design")}

<h2>AI practical exercise — AI Future-Life Interview</h2>
<p>Your life-design thinking partner can see your Extraordinary Tuesday template and description.</p>
${block("coach", "d10-interview")}

<h2>Scenario-based activity</h2>
<p>Chidi says: <em>"My extraordinary life is becoming famous."</em> When asked what he wants fame to give him, he identifies recognition, financial security, influence, opportunities and freedom.</p>
${block("scenario", "d10-chidi")}

<h2>Real-world challenge — Create a mini Extraordinary Tuesday</h2>
<p>Choose <strong>one element</strong> of your future Tuesday that you can experience now. If your future includes <em>"I am someone who learns continuously"</em>, spend 30 minutes learning today. If it includes <em>"I create useful things"</em>, create something today. If it includes <em>"I help other people"</em>, help someone today. The purpose is to bring a small piece of the future into the present.</p>
${block("exercise", "d10-challenge")}

<h2>Day 10 reflection</h2>
${block("exercise", "d10-reflection")}

<h2>Day 10 quiz</h2>
${block("quiz")}

<h2>Day 10 assignment — My Extraordinary Tuesday</h2>
${block("exercise", "d10-assignment")}
<p><strong>Day 10 output:</strong> My Extraordinary Tuesday — the first component of your <strong>Extraordinary Future Design</strong>.</p>
`,
    exercises: [
      {
        exerciseId: "d10-template",
        title: "The Extraordinary Tuesday template",
        fields: [
          field("wake", "Morning — Where do I wake up?"),
          field("first", "Morning — What is the first thing I do?"),
          field("feel", "Morning — How do I feel about the day ahead?"),
          field("working-on", "Work — What am I working on?"),
          field("work-with", "Work — Who do I work with?"),
          field("problem", "Work — What problem am I solving?"),
          field("learning", "Afternoon — What am I learning?"),
          field("helping", "Afternoon — Who am I helping?"),
          field("time-with", "Evening — Who am I spending time with?"),
          field("enjoy", "Evening — What do I enjoy?"),
          field("grateful", "Night — What am I grateful for?"),
          field("meaningful", "Night — What makes the day meaningful?"),
        ],
      },
      {
        exerciseId: "d10-design",
        title: "My Extraordinary Tuesday (one page)",
        fields: [
          field("tuesday", "My ideal ordinary Tuesday, about five years from now:"),
          field("present", "Three things already present in my life:"),
          field("missing", "Three things missing:"),
          field("begin", "One thing I can begin changing now:"),
        ],
      },
      {
        exerciseId: "d10-challenge",
        title: "My mini Extraordinary Tuesday",
        fields: [field("element", "The element I brought into today:"), field("happened", "What I did and how it felt:")],
      },
      {
        exerciseId: "d10-reflection",
        title: "Day 10 reflection",
        fields: [
          field("revealed", "1. What did my ordinary Tuesday reveal about what matters to me?"),
          field("surprised", "2. What surprised me?"),
          field("resembles", "3. Which part of my current life already resembles my future?"),
          field("missing", "4. What is missing?"),
          field("create", "5. What can I begin creating now?"),
        ],
      },
      {
        exerciseId: "d10-assignment",
        title: "My Extraordinary Tuesday",
        intro: "Write 500–700 words describing your ideal ordinary Tuesday approximately five years from now.",
        fields: [
          { id: "tuesday", label: "My Extraordinary Tuesday (500–700 words)", type: "textarea", minWords: 500, maxWords: 700 },
          field("changes", "\"To move towards this Tuesday, the first three changes I need to begin exploring are…\""),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d10-chidi",
        title: "Chidi",
        question: "What should Chidi explore?",
        options: [
          "How to become famous immediately.",
          "Whether fame itself or the outcomes associated with fame are what he actually values.",
          "Why other people are more successful.",
          "Whether he should copy a celebrity.",
        ],
        answer: 1,
        explanation:
          "Sometimes the first goal we name is only a symbol of a deeper need. Good life design asks: \"What am I really trying to create?\" — recognition, security, influence, opportunities and freedom may each have routes other than fame.",
      },
    ],
    coaches: [
      {
        coachId: "d10-interview",
        title: "AI Future-Life Interview",
        intro: "A neutral life-design thinking partner that interviews you one question at a time and points out contradictions in your answers.",
        usesExercises: ["d10-template", "d10-design"],
        promptTemplate:
          "I am designing my future life.\n\nAct as a neutral life-design thinking partner.\n\nInterview me about my ideal ordinary Tuesday approximately five years from now.\n\nAsk one question at a time.\n\nExplore:\n\n- work\n- learning\n- relationships\n- finances\n- health and wellbeing\n- creativity\n- contribution\n- community\n- time freedom\n- environment\n- experiences\n\nDo not tell me what kind of life I should want.\n\nDo not assume that money, status or fame are my priorities.\n\nHelp me identify contradictions in my answers.\n\nFor example, if I say I want freedom but describe a future that requires constant work, ask me to examine the contradiction.\n\nAt the end, organise my answers into:\n\n1. Future Lifestyle\n2. Work\n3. Relationships\n4. Learning\n5. Wellbeing\n6. Contribution\n7. Priorities\n8. Questions I still need to answer\n\nHere is what I have written about my Tuesday so far:\n\n[PASTE YOUR ANSWERS]",
        systemPrompt:
          "Exercise: Day 10 — AI Future-Life Interview. Interview the learner about their ideal ordinary Tuesday about five years from now across work, learning, relationships, finances, health and wellbeing, creativity, contribution, community, time freedom, environment and experiences. Use what they've already written; ask about gaps and vague parts. Ask exactly ONE question per message. Never assume money, status or fame are priorities, and never tell them what life to want. When two answers seem to conflict (e.g. freedom vs constant work), name the possible contradiction neutrally and ask them to examine it. When they've covered the areas or ask for it, organise their answers under: 1 Future Lifestyle, 2 Work, 3 Relationships, 4 Learning, 5 Wellbeing, 6 Contribution, 7 Priorities, 8 Questions I still need to answer — in their words.",
      },
    ],
    quiz: [
      q("Why is the Ordinary Tuesday exercise useful?", ["It predicts the future.", "It makes future goals more concrete.", "It guarantees happiness.", "It eliminates uncertainty."],
        1, "An ordinary day turns a headline goal into a lived picture you can compare with today."),
      q("An extraordinary life should:", ["Look impressive to other people.", "Copy successful people.", "Reflect the learner's own values and priorities.", "Focus entirely on money."],
        2, "There's no universal definition — design around what matters to you."),
      q("What question can uncover a deeper goal?", ["\"What will impress people?\"", "\"What am I really trying to create?\"", "\"Who is better than me?\"", "\"How quickly can I achieve this?\""],
        1, "The first goal we name is sometimes a symbol of a deeper need, as with Chidi and fame."),
      q("Why should an extraordinary future include ordinary days?",
        ["Because everyday life is where the vision is actually experienced.", "Because big goals do not matter.", "Because ambition is unnecessary.", "Because planning should be avoided."],
        0, "The quality of a life is experienced largely through ordinary days."),
      q("What should happen after designing a future vision?",
        ["Do nothing until the future arrives.", "Identify actions that can begin moving toward it.", "Expect the vision to happen automatically.", "Abandon the vision if it changes."],
        1, "A vision becomes useful when it points to actions you can start now."),
    ],
  },

  // ---------------------------------------------------------------- day 11
  {
    lessonId: "m4-day-11",
    title: "Module 4 · Day 11 — The Life Wheel",
    lessonOrder: 18,
    duration: "60 minutes",
    objective: "Map ten areas of your life and choose the two that deserve attention for the next 90 days.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>Are you building one successful part of your life while neglecting the rest?</p></blockquote>
${talk("The Life Wheel", `
Imagine a wheel. For the wheel to move smoothly, different parts need reasonable balance.

Your life can work in a similar way. You may be progressing strongly in your career while neglecting your health. You may be financially successful but disconnected from relationships. You may be learning constantly but never creating. You may have a strong social life but no meaningful direction.

The objective is not perfect balance. Perfect balance is unrealistic. The objective is <strong>awareness</strong>.

Today you will examine different areas of your life and ask: Where am I? Where do I want to be? What deserves attention?

Some areas may need improvement. Some may simply need maintaining. Some may not be priorities right now. That is okay.

The Life Wheel is not a scorecard for your worth. It is a map. And maps help us decide where to travel next.`)}

<h2>The BSOE Life Wheel</h2>
<p>Rate each area from <strong>1 = Requires significant attention</strong> to <strong>10 = Strong and satisfying</strong>.</p>
<ol>
<li><strong>Health &amp; Wellbeing</strong> — how well am I caring for myself?</li>
<li><strong>Career &amp; Work</strong> — is my work meaningful or developing me?</li>
<li><strong>Money &amp; Financial Capability</strong> — do I understand and manage my finances responsibly?</li>
<li><strong>Relationships</strong> — am I investing in important relationships?</li>
<li><strong>Learning</strong> — am I continuing to develop?</li>
<li><strong>Creativity</strong> — do I have space to create and experiment?</li>
<li><strong>Personal Growth</strong> — am I developing as a person?</li>
<li><strong>Contribution</strong> — am I helping others or contributing to something beyond myself?</li>
<li><strong>Adventure &amp; Experience</strong> — am I experiencing life beyond routine?</li>
<li><strong>Meaning &amp; Values</strong> — does my life reflect what matters to me?</li>
</ol>
${block("exercise", "d11-wheel")}

<h2>Important principle</h2>
<p>Do not attempt to improve all ten areas simultaneously. Ask:</p>
<blockquote><p>Which two areas, if improved, could make the biggest positive difference to the rest of my life?</p></blockquote>
<p>Choose two.</p>

<h2>Interactive example — Maria's Life Wheel</h2>
${table(["Area", "Score"], [["Career", "8"], ["Money", "7"], ["Learning", "8"], ["Relationships", "5"], ["Health", "4"], ["Creativity", "3"], ["Contribution", "6"]])}
<p>Maria initially wants to improve everything. Instead, she chooses <strong>Health + Creativity</strong> — because improving her health may increase energy, while creativity may help her reconnect with something meaningful outside work.</p>
<p>Her action plan becomes: a 30-minute walk three times a week, and one hour each weekend creating something without a work-related purpose.</p>
<p>Small changes. Not a complete life reconstruction.</p>

<h2>Case study — The successful professional</h2>
<p>John has excellent qualifications, a successful career, strong income and professional recognition. But he has little time for family, health, creativity or community.</p>
<p>He decides that the answer is not necessarily to abandon his career. Instead, he asks: <em>"What would success look like if my definition included the rest of my life?"</em> He begins redesigning his calendar.</p>
<blockquote><p>Life design is not always about changing your destination. Sometimes it is about changing how you travel.</p></blockquote>

<h2>Learner activity — Your Life Wheel analysis</h2>
${block("exercise", "d11-analysis")}

<h2>AI practical exercise — Neutral planning partner</h2>
<p>Your planning partner can bring in your Life Wheel scores and notes.</p>
${block("coach", "d11-planning")}

<h2>Scenario-based activity</h2>
<p>Sarah scores: Career 9, Money 8, Learning 8, Health 3, Relationships 4, Creativity 2. She says: <em>"I'm going to improve all six areas immediately."</em></p>
${block("scenario", "d11-sarah")}

<h2>Real-world challenge</h2>
<p>Choose one priority area. Create a <strong>15-minute action</strong> you can complete today — send an important message, take a walk, review finances, read, practise a skill, organise a workspace, contact someone or create something. Complete it.</p>
${block("exercise", "d11-challenge")}

<h2>Day 11 reflection</h2>
${block("exercise", "d11-reflection")}

<h2>Day 11 quiz</h2>
${block("quiz")}

<h2>Day 11 assignment — 90-Day Priority Plan</h2>
<p>Choose two Life Wheel areas and complete the plan for each.</p>
${block("exercise", "d11-assignment")}
<p><strong>Day 11 output:</strong> My 90-Day Priority Map.</p>
`,
    exercises: [
      {
        exerciseId: "d11-wheel",
        title: "My Life Wheel",
        table: { columns: ["Current score (1–10)", "Desired direction", "One action"], rows: LIFE_AREAS },
      },
      {
        exerciseId: "d11-analysis",
        title: "My Life Wheel analysis",
        fields: [
          field("strongest", "My strongest area:"),
          field("most-attention", "The area needing most attention:"),
          field("maintain", "An area I should maintain:"),
          field("neglecting", "An area I may be neglecting:"),
          field("priorities", "Two priorities for the next 90 days:"),
          field("why", "Why these two?"),
        ],
      },
      {
        exerciseId: "d11-challenge",
        title: "My 15-minute action",
        fields: [field("action", "The action I took:"), field("changed", "What changed after taking one deliberate action?")],
      },
      {
        exerciseId: "d11-reflection",
        title: "Day 11 reflection",
        fields: [
          field("revealed", "1. What did my Life Wheel reveal?"),
          field("surprised", "2. Which area surprised me?"),
          field("well", "3. What am I already doing well?"),
          field("neglected", "4. What have I neglected?"),
          field("two", "5. What two areas deserve attention now?"),
        ],
      },
      {
        exerciseId: "d11-assignment",
        title: "90-Day Priority Plan",
        table: {
          columns: ["Area", "Why it matters", "Current situation", "Desired direction", "One 90-day outcome", "Weekly behaviour", "Evidence of progress", "Likely obstacle", "Response"],
          rows: ["Priority area 1", "Priority area 2"],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "d11-sarah",
        title: "Sarah's Life Wheel",
        question: "What would be a more sustainable approach?",
        options: ["Create six major goals simultaneously.", "Ignore the weaker areas.", "Identify one or two priority areas and create small actions.", "Stop working completely."],
        answer: 2,
        explanation:
          "Focus makes experimentation and learning manageable. One or two priorities with small actions — like Maria's walks and weekend creativity — are more sustainable than six major goals at once.",
      },
    ],
    coaches: [
      {
        coachId: "d11-planning",
        title: "Life Wheel Planning Partner",
        intro: "A neutral planning partner that helps you see strong areas, areas needing attention, knock-on effects and conflicts — without ranking your life.",
        usesExercises: ["d11-wheel"],
        promptTemplate:
          "I have completed a Life Wheel with ten areas:\n\nHealth, Career, Money, Relationships, Learning, Creativity, Personal Growth, Contribution, Adventure and Meaning.\n\nHere are my scores and explanations:\n\n[PASTE YOUR ANSWERS]\n\nAct as a neutral planning partner.\n\nHelp me identify:\n\n1. Areas that appear strong.\n2. Areas that may need attention.\n3. Areas that may influence other areas.\n4. Potential conflicts between my priorities.\n5. Two areas I could explore over the next 90 days.\n\nDo not rank my life or tell me how I should live.\n\nDo not diagnose me.\n\nAsk questions where information is missing.\n\nFocus on helping me make my own priorities clearer.",
        systemPrompt:
          "Exercise: Day 11 — Life Wheel planning partner. Using only the learner's scores and notes, reflect back: areas that appear strong, areas that may need attention, areas that may influence others (e.g. health affecting energy for everything else), and potential conflicts between priorities. Offer two areas they could explore over 90 days as options with brief reasoning, then ask which two THEY choose and why. Ask about missing scores or explanations rather than guessing. Never rank their life, judge it, diagnose, or tell them how to live.",
      },
    ],
    quiz: [
      q("The purpose of the Life Wheel is:", ["To judge your worth.", "To compare yourself with others.", "To increase awareness of different life areas.", "To create ten major goals."],
        2, "It's a map, not a scorecard — awareness that helps you decide where to go next."),
      q("A score of 4 means:", ["You have failed.", "The area may deserve attention.", "You must immediately change your life.", "Somebody else should decide what to do."],
        1, "A low score is information, not failure."),
      q("Why should learners avoid changing everything at once?", ["Change is impossible.", "Focus makes experimentation and learning more manageable.", "Only one life area matters.", "Goals are unnecessary."],
        1, "Two priorities with small actions are easier to sustain, test and learn from."),
      q("What should a learner do with a strong area?", ["Destroy it.", "Ignore it permanently.", "Consider whether it needs maintenance.", "Compare it with other people."],
        2, "Strong areas usually need maintaining, not ignoring."),
      q("What makes the Life Wheel useful?", ["It provides a perfect answer.", "It creates awareness that can inform priorities.", "It predicts future happiness.", "It guarantees balance."],
        1, "Awareness informs priorities — perfect balance isn't the aim."),
    ],
  },

  // ---------------------------------------------------------------- day 12
  {
    lessonId: "m4-day-12",
    title: "Module 4 · Day 12 — Write Your Future Letter",
    lessonOrder: 19,
    duration: "75–90 minutes",
    objective: "Write from ten years ahead to discover what deserves action today.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What would your future self want your present self to understand?</p></blockquote>
${talk("Your Future Letter", `
Today you are going to write from the future.

Imagine that ten years have passed. You have lived through successes. You have experienced setbacks. You have made decisions. Some plans worked. Others did not. You learned. You changed.

Now imagine receiving a letter from that future version of yourself. What would they say?

Perhaps: "Thank you for starting." "I'm glad you didn't give up on that." "You spent too much time worrying about what other people thought." "You were more capable than you realised." "You should have asked for help earlier." "You were right to keep learning."

This exercise is not about predicting what will happen. It is about perspective. When we imagine looking backwards, some present-day worries may appear differently.

The Future Letter gives you an opportunity to identify what matters enough to deserve action today.

Your future is not guaranteed. But your current decisions influence the possibilities available to your future self.

So write the letter. Then listen carefully to what it reveals about what matters now.`)}

<h2>Reading — The Ten-Year Letter</h2>
<p>Imagine yourself ten years from today. You are not necessarily living the exact future you currently imagine. Life has changed. You have changed. But you have learned from the journey. Now write to your current self. Start by collecting your ideas:</p>
${block("exercise", "d12-prompts")}

<h2>Interactive example — A future letter</h2>
<blockquote><p>Dear Me, I am glad you finally stopped waiting until you felt completely ready. The first project was imperfect, but it taught you more than another year of thinking about it. I'm also glad you continued learning technology even when it felt uncomfortable. Most importantly, I'm glad you made time for the people you love.</p></blockquote>
<p>Notice what the letter reveals. The learner values <strong>action, learning, relationships and courage</strong>. These values can now influence present decisions.</p>

<h2>Case study — The opportunity she almost ignored</h2>
<p>Aisha receives an opportunity to lead a small community project. She thinks: <em>"I'm not ready."</em> She almost declines.</p>
<p>Instead, she asks: <em>"What would my future self wish I had done?"</em> That question does not automatically tell her to accept. She examines the opportunity, the risks, the time commitment, the skills required and the available support.</p>
<p>She decides to accept with appropriate support. The experience becomes an important learning opportunity.</p>
<blockquote><p>Future-self thinking should not replace evidence or judgement. It should help you examine the decision from a longer-term perspective.</p></blockquote>

<h2>Learner activity — Write your Ten-Year Letter</h2>
<p>Write a letter of <strong>700–1,000 words</strong>. Begin <em>"Dear Me, It is 2036…"</em> Describe what you learned, what you built, what you changed, what you stopped doing, what mattered, what you wish you had started, what you wish you had worried about less, and what you want your present self to understand. Finish with: <em>"If I could give you one instruction today, it would be…"</em></p>
${block("exercise", "d12-letter")}

<h2>AI practical exercise — AI Future Perspective Partner</h2>
<p>Your perspective partner reads your letter and separates what you said from what it infers.</p>
${block("coach", "d12-perspective")}

<h2>Scenario-based activity</h2>
<p>Tom is considering learning a new digital skill. He says: <em>"I'm too busy."</em> He asks himself: <em>"Ten years from now, would I be glad I spent a few hours learning this?"</em> This question alone should NOT determine his decision.</p>
${block("scenario", "d12-tom")}

<h2>Real-world challenge — One message from the future</h2>
<p>Read your completed Future Letter. Find one sentence that contains an action you can take this week, and turn it into a real action. For example: <em>"I wish I had started networking earlier."</em> → contact one relevant person. <em>"I wish I had developed stronger digital skills."</em> → complete one practical lesson. <em>"I'm glad you started creating."</em> → publish one useful piece of work.</p>
${block("exercise", "d12-challenge")}

<h2>Day 12 reflection</h2>
${block("exercise", "d12-reflection")}

<h2>Day 12 quiz</h2>
${block("quiz")}

<h2>Day 12 assignment — Life Design Analysis</h2>
<p>Part 1 is your Future Letter above. Part 2 — identify what it reveals:</p>
${block("exercise", "d12-analysis")}
`,
    exercises: [
      {
        exerciseId: "d12-prompts",
        title: "Ideas for my letter",
        fields: [
          field("grateful", "What I am grateful you started:"),
          field("stopped", "What I am glad you stopped doing:"),
          field("risk", "What risk you were right to take:"),
          field("mistake", "What mistake taught you something important:"),
          field("relationship", "What relationship mattered:"),
          field("skill", "What skill became valuable:"),
          field("problem", "What problem you learned to solve:"),
          field("worried", "What you wish you had worried about less:"),
          field("earlier", "What you wish you had started earlier:"),
          field("matters", "What matters most now:"),
        ],
      },
      {
        exerciseId: "d12-letter",
        title: "My Ten-Year Letter",
        fields: [
          { id: "letter", label: "Dear Me, It is 2036… (700–1,000 words)", type: "textarea", minWords: 700, maxWords: 1000 },
          field("instruction", "\"If I could give you one instruction today, it would be…\""),
        ],
      },
      {
        exerciseId: "d12-challenge",
        title: "One message from the future",
        fields: [field("sentence", "The sentence from my letter:"), field("action", "The action I took this week:")],
      },
      {
        exerciseId: "d12-reflection",
        title: "Day 12 reflection",
        fields: [
          field("emphasised", "1. What did my future self emphasise?"),
          field("matters", "2. What matters more to me than I realised?"),
          field("worry", "3. What am I currently worrying about that may not deserve so much attention?"),
          field("begin", "4. What should I begin?"),
          field("postponing", "5. What should I stop postponing?"),
        ],
      },
      {
        exerciseId: "d12-analysis",
        title: "Life Design Analysis",
        fields: [
          field("values", "Five values revealed by the letter:"),
          field("begin", "Three things I want to begin:"),
          field("stop", "Three things I want to stop or reduce:"),
          field("skills", "Three skills I need to develop:"),
          field("relationship", "One relationship I need to invest in:"),
          field("contribution", "One contribution I want to make:"),
          field("action", "One action I will take this week:"),
        ],
      },
    ],
    scenarios: [
      {
        scenarioId: "d12-tom",
        title: "Tom",
        question: "What should Tom do next?",
        options: [
          "Immediately spend all his time learning it.",
          "Ignore the opportunity.",
          "Examine the skill's relevance, cost, time requirement and potential value before deciding.",
          "Ask AI to decide.",
        ],
        answer: 2,
        explanation: "Future perspective improves thinking. It does not replace evidence-based decision-making.",
      },
    ],
    coaches: [
      {
        coachId: "d12-perspective",
        title: "AI Future Perspective Partner",
        intro: "Analyses your letter for values, skills, experiences, concerns and actions — clearly separating what you said, what it infers and questions to explore.",
        usesExercises: ["d12-letter"],
        promptTemplate:
          "I have written a ten-year future letter:\n\n[PASTE YOUR ANSWERS]\n\nAct as a neutral reflection partner.\n\nAnalyse my letter and identify:\n\n1. Values that appear important to me.\n2. Skills I appear to want to develop.\n3. Experiences I appear to value.\n4. Fears or concerns I repeatedly mention.\n5. Actions my future perspective suggests I should explore.\n6. Questions I have not answered.\n\nDo not tell me what decision to make.\n\nDo not assume my future will happen exactly as described.\n\nClearly distinguish between:\n\n- what I explicitly said\n- what you are inferring\n- questions I may want to explore.\n\nThen ask me three reflection questions.",
        systemPrompt:
          "Exercise: Day 12 — AI Future Perspective Partner. Analyse the learner's ten-year letter for: values, skills they want to develop, experiences they value, fears or concerns they repeat, actions their future perspective suggests exploring, and questions left unanswered. Structure the answer in three clearly labelled sections — \"What you said\" (quote or closely paraphrase their words), \"What I'm inferring\" (tentative), and \"Questions you may want to explore\". Never treat the imagined future as a prediction and never tell them what to decide. Finish with exactly three reflection questions.",
      },
    ],
    quiz: [
      q("The Future Letter is primarily designed to:", ["Predict the future.", "Create perspective on present priorities.", "Guarantee future success.", "Eliminate uncertainty."],
        1, "Looking back from the future helps you see what matters enough to act on now."),
      q("Why write from ten years in the future?", ["To create useful psychological distance and perspective.", "To make exact predictions.", "To avoid present responsibilities.", "To create fantasy."],
        0, "Distance can shrink some worries and highlight what really matters."),
      q("A future perspective should:", ["Replace evidence.", "Replace decision-making.", "Complement present-day reasoning.", "Guarantee a particular outcome."],
        2, "As with Aisha and Tom, it adds perspective to evidence and judgement — it doesn't replace them."),
      q("What should you do after writing the letter?", ["Put it away permanently.", "Identify themes and actions that matter now.", "Assume the future is guaranteed.", "Follow every instruction literally."],
        1, "The value is in the themes and actions you draw out of it."),
      q("What makes the exercise useful?", ["It tells you exactly what will happen.", "It can reveal values, priorities and postponed actions.", "It removes all fear.", "It creates instant transformation."],
        1, "The letter surfaces values, priorities and things you've been postponing."),
    ],
  },

  // ---------------------------------------------------------------- module 4 assessment
  {
    lessonId: "m4-assessment",
    title: "Module 4 · Future Design Assessment",
    lessonOrder: 20,
    duration: "90 minutes + 7-day challenge",
    objective: "Connect identity, vision, priorities and action in your 50-mark Future Design.",
    contentBody: `
<h2>Module 4 — 50-mark assessment: Design Your Extraordinary Future</h2>
<p>Your work from Days 10–12 — and your Future Self Profile from Module 3 — is a good starting point.</p>

<h2>Part A — Extraordinary Tuesday (10 marks)</h2>
<p>Describe a realistic ordinary day within your preferred future. Assessed on clarity, alignment with values, practical detail, consistency and reflection.</p>
${block("exercise", "m4-part-a")}

<h2>Part B — Life Wheel (10 marks)</h2>
<p>Analyse your ten life areas and identify two priorities. Assessed on honest reflection, prioritisation, reasoning and practical actions.</p>
${block("exercise", "m4-part-b")}

<h2>Part C — Future Self alignment (10 marks)</h2>
<p>Explain how your future life connects with the Future Self Profile you created in Module 3. Assessed on identity alignment, consistency, development needs and future direction.</p>
${block("exercise", "m4-part-c")}

<h2>Part D — Ten-year perspective (10 marks)</h2>
<p>Extract five meaningful insights from your Future Letter. Assessed on depth of reflection, evidence, clarity and practical relevance.</p>
${block("exercise", "m4-part-d")}

<h2>Part E — 90-day future design (10 marks)</h2>
<p>Create a practical 90-day plan with two priorities, measurable actions, weekly behaviours, obstacles, response strategies and evidence of progress.</p>
${block("exercise", "m4-part-e")}

<h2>Marking rubric</h2>
${table(["Criterion", "Strong application", "Developing", "Foundation"], [
  ["Future vision", "Specific and meaningful", "Some detail", "Vague"],
  ["Life awareness", "Balanced and reflective", "Some analysis", "Limited analysis"],
  ["Priorities", "Clear rationale", "Some rationale", "Random goals"],
  ["Future alignment", "Strong connection to identity", "Partial connection", "Weak connection"],
  ["Action planning", "Practical and measurable", "Partially measurable", "Mainly aspirational"],
])}

<h2>Performance guide</h2>
<ul>
<li><strong>40–50 — Strong Future Design.</strong> You demonstrate a clear ability to connect identity, values, priorities and practical action.</li>
<li><strong>30–39 — Developing Future Design.</strong> You have a useful direction but need greater specificity or consistency.</li>
<li><strong>20–29 — Foundation level.</strong> You understand the concepts but need further practical development.</li>
<li><strong>Below 20</strong> — review Days 10–12 and revise the Future Design activities.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E against the rubric, along with your Module 3 Future Self Profile for Part C. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m4-assessment-review")}

<h2>Your Module 4 submission</h2>
${block("portfolio")}

<h2>Module 4 integration</h2>
<p><strong>Module 3:</strong> Who am I becoming? → <strong>Module 4:</strong> What kind of life supports that person?</p>
<p>The BSOE Future Design Model:</p>
${flow(["IDENTITY", "VISION", "PRIORITIES", "ENVIRONMENT", "BEHAVIOURS", "90-DAY EXPERIMENT", "EVIDENCE", "ADJUSTMENT"])}

<h2>Module 4 seven-day challenge</h2>
<p>For the next seven days, choose one element of your future life and practise it in the present. Each evening, answer:</p>
${block("exercise", "m4-seven-days")}
<p>At the end of seven days, write:</p>
<blockquote><p>What happens when I stop waiting for my future and start practising part of it now?</p></blockquote>
${block("exercise", "m4-practising")}

<h2>Module 4 key takeaways</h2>
<ol>
<li><strong>Your extraordinary life should be designed around what matters to you.</strong> There is no universal definition of an extraordinary life.</li>
<li><strong>Your ordinary days matter.</strong> The future is experienced through everyday life.</li>
<li><strong>Vision without priorities can remain vague.</strong> You need to decide what deserves attention.</li>
<li><strong>You cannot optimise everything simultaneously.</strong> Choose meaningful priorities.</li>
<li><strong>Your future self can provide perspective.</strong> But it should not replace evidence, reasoning or informed decisions.</li>
<li><strong>A future vision should be flexible.</strong> Life changes. Your plan can change too.</li>
<li><strong>You can bring part of your future into the present.</strong> Small experiments create evidence.</li>
</ol>

<h2>Module 4 completion statement</h2>
${block("exercise", "m4-completion")}

<h2>Module 4 core message</h2>
<blockquote><p>Your future does not have to remain a distant picture in your imagination.</p></blockquote>
<p>You can turn it into a design. A design can become priorities. Priorities can become experiments. Experiments can create evidence. Evidence can guide your next decision.</p>
<p><strong>You do not need to know exactly where your entire life will end up. You need enough clarity to choose the next meaningful direction.</strong></p>

<h2>Module 4 outputs</h2>
<ol>
<li><strong>My Extraordinary Tuesday</strong> — a detailed picture of the life you want to experience.</li>
<li><strong>My Life Wheel</strong> — a structured assessment of important life areas.</li>
<li><strong>My 90-Day Priority Map</strong> — two selected areas with practical actions.</li>
<li><strong>My Ten-Year Future Letter</strong> — a long-term perspective exercise.</li>
<li><strong>My Future Design</strong> — a practical connection between Identity → Vision → Priorities → Action.</li>
<li><strong>50-Mark Future Design Assessment.</strong></li>
</ol>

<h2>The journey so far</h2>
<ul>
<li><strong>Module 1 — Wake Up:</strong> Question the Ordinary. <em>What is happening in my life?</em></li>
<li><strong>Module 2 — Understand:</strong> Your Inner Operating System. <em>How do I process what happens?</em></li>
<li><strong>Module 3 — Transform:</strong> Your Identity. <em>Who am I becoming?</em></li>
<li><strong>Module 4 — Design:</strong> Your Extraordinary Future. <em>What kind of life will support that person?</em></li>
</ul>
<h2>Next: Module 5 — The Steady Mind</h2>
<p>The next stage moves from designing the future to developing the emotional resilience required to keep moving towards it when life becomes difficult. The central question becomes:</p>
<blockquote><p>How do I remain intentional when circumstances, emotions, setbacks and uncertainty challenge my plans?</p></blockquote>
`,
    exercises: [
      {
        exerciseId: "m4-part-a",
        title: "Part A — Extraordinary Tuesday",
        fields: [field("day", "A realistic ordinary day within my preferred future:"), field("values", "How it aligns with my values:")],
        marks: 10,
      },
      {
        exerciseId: "m4-part-b",
        title: "Part B — Life Wheel",
        fields: [
          field("analysis", "Analysis of my ten life areas:"),
          field("priorities", "My two priorities:"),
          field("reasoning", "Why these two:"),
          field("actions", "Practical actions for each:"),
        ],
        marks: 10,
      },
      {
        exerciseId: "m4-part-c",
        title: "Part C — Future Self alignment",
        fields: [
          field("connection", "How my future life connects with my Module 3 Future Self Profile:"),
          field("consistency", "Where they are consistent — and where they are not:"),
          field("development", "Development needs this reveals:"),
          field("direction", "My future direction:"),
        ],
        marks: 10,
      },
      {
        exerciseId: "m4-part-d",
        title: "Part D — Ten-year perspective",
        table: { columns: ["Insight", "Evidence from my letter", "What it means for me now"], rows: ["Insight 1", "Insight 2", "Insight 3", "Insight 4", "Insight 5"] },
        marks: 10,
      },
      {
        exerciseId: "m4-part-e",
        title: "Part E — 90-day future design",
        table: {
          columns: ["Priority", "Measurable actions", "Weekly behaviours", "Obstacles", "Response strategies", "Evidence of progress"],
          rows: ["Priority 1", "Priority 2"],
        },
        marks: 10,
      },
      {
        exerciseId: "m4-seven-days",
        title: "Evening check-in",
        table: {
          columns: ["What did I do today that resembles my future life?", "What did I learn?", "What obstacle appeared?", "How did I respond?", "What will I adjust tomorrow?"],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "m4-practising",
        title: "What happens when I stop waiting for my future?",
        fields: [{ id: "reflection", label: "My reflection (250–500 words)", type: "textarea", minWords: 250, maxWords: 500 }],
      },
      {
        exerciseId: "m4-completion",
        title: "Module 4 completion statement",
        fields: [
          field("life", "\"The life I want to build is…\""),
          field("person", "\"The person I am becoming is…\""),
          field("matter", "\"The parts of my life that matter most are…\""),
          field("priorities", "\"My two priorities for the next 90 days are…\""),
          field("evidence", "\"The first evidence I will create is…\""),
        ],
      },
    ],
    coaches: [
      {
        coachId: "m4-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the rubric, including how your future connects with your Module 3 Future Self Profile. Its marks are indicative only.",
        usesExercises: ["m4-part-a", "m4-part-b", "m4-part-c", "m4-part-d", "m4-part-e", "d8-assignment"],
        promptTemplate:
          "Please review my Module 4 assessment, Design Your Extraordinary Future (Parts A–E, 10 marks each), against the rubric. My Module 3 Future Self Profile is included for Part C.\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 4 assessment review (formative). The learner's Module 3 Future Self Profile may be included for reference — use it only to judge Part C's alignment, not as a part to mark.\nA Extraordinary Tuesday (10): clarity, alignment with values, practical detail, consistency, reflection.\nB Life Wheel (10): honest reflection, prioritisation of two areas, reasoning, practical actions.\nC Future Self alignment (10): identity alignment with the Module 3 profile, consistency (and honest inconsistencies), development needs, future direction.\nD Ten-year perspective (10): five meaningful insights from the letter with evidence, depth, clarity, practical relevance.\nE 90-day future design (10): two priorities, measurable actions, weekly behaviours, obstacles, response strategies, evidence of progress.\nRubric levels: Strong application / Developing / Foundation for future vision, life awareness, priorities, future alignment and action planning. For each part give what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10 (empty parts score 0). Then an indicative total out of 50 and band (40–50 Strong Future Design; 30–39 Developing; 20–29 Foundation; below 20 review Days 10–12). State clearly that marks are indicative and the tutor gives the final mark. Judge reflection and planning quality, never the learner's choice of life or values. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "m4-part-a", title: "Part A — Extraordinary Tuesday (10 marks)", lessonId: "m4-assessment" },
      { exerciseId: "m4-part-b", title: "Part B — Life Wheel (10 marks)", lessonId: "m4-assessment" },
      { exerciseId: "m4-part-c", title: "Part C — Future Self alignment (10 marks)", lessonId: "m4-assessment" },
      { exerciseId: "m4-part-d", title: "Part D — Ten-year perspective (10 marks)", lessonId: "m4-assessment" },
      { exerciseId: "m4-part-e", title: "Part E — 90-day future design (10 marks)", lessonId: "m4-assessment" },
      { exerciseId: "d10-assignment", title: "My Extraordinary Tuesday (Day 10)", lessonId: "m4-day-10" },
      { exerciseId: "d11-assignment", title: "My 90-Day Priority Map (Day 11)", lessonId: "m4-day-11" },
      { exerciseId: "d12-letter", title: "My Ten-Year Future Letter (Day 12)", lessonId: "m4-day-12" },
      { exerciseId: "d8-assignment", title: "My Future Self Profile (Module 3, for Part C)", lessonId: "m3-day-8" },
      { exerciseId: "m4-practising", title: "7-day reflection (250–500 words)", lessonId: "m4-assessment" },
    ],
  },
];
