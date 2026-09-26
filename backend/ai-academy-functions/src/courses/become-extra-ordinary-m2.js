// Become Extra Ordinary — Module 2: Understand Your Inner Operating System
// (Days 4–6). Same lesson format as Module 1 (see become-extra-ordinary.js).

const block = (kind, id) => `<div data-block="${kind}${id ? `:${id}` : ""}"></div>`;
const q = (question, options, answer, explanation) => ({ question, options, answer, explanation });
const TF = ["True", "False"];
const flow = (steps) => `<p><strong>${steps.join("</strong><br>↓<br><strong>")}</strong></p>`;

module.exports = [
  // ---------------------------------------------------------------- introduction + diagnostic
  {
    lessonId: "m2-intro",
    title: "Module 2 · Understand Your Inner Operating System",
    lessonOrder: 6,
    duration: "15 minutes",
    objective: "Meet the Inner Operating System and take a starting-point diagnostic.",
    contentBody: `
<h2>Module 2 — Understand Your Inner Operating System</h2>
<p><strong>Days 4–6</strong></p>
<p>The central idea is not that people can control everything that happens to them. It is that becoming more aware of the internal processes between an event and a response can create more deliberate choices.</p>

<h2>Module introduction</h2>
<p>Every person has an internal operating system.</p>
<p>A computer has software that determines how it processes information. People also have learned patterns that influence how they interpret experiences, make decisions and respond to situations.</p>
<p>Your internal operating system includes:</p>
${flow(["BELIEFS", "THOUGHTS", "EMOTIONS", "DECISIONS", "ACTIONS", "RESULTS"])}
<p>This doesn't mean that you control every outcome in your life. You don't.</p>
<p>Other people make decisions. Unexpected events happen. Opportunities appear and disappear. Circumstances change.</p>
<p>But between what happens and what you do next, there can be a space for awareness and choice.</p>
<p><strong>This module is about learning to recognise that space.</strong></p>

<h2>Module 2 diagnostic — My Inner Operating System Check</h2>
<p>Before starting Day 4, complete this quick diagnostic. Score each statement from <strong>1 = Almost never</strong> to <strong>5 = Almost always</strong>. Your total and what it suggests appear as you go.</p>
${block("exercise", "m2-diagnostic")}
<p><strong>Important:</strong> this is a <strong>learning diagnostic</strong>, not a psychological diagnosis. Your score is not a measure of your worth, intelligence or potential. It simply provides a starting point for reflection.</p>
`,
    exercises: [
      {
        exerciseId: "m2-diagnostic",
        title: "My Inner Operating System Check",
        scale: {
          min: 1,
          max: 5,
          labels: ["Almost never", "Rarely", "Sometimes", "Often", "Almost always"],
          groups: [
            {
              title: "A. Awareness",
              statements: [
                "I notice when a thought is influencing my behaviour.",
                "I can identify beliefs that influence my decisions.",
                "I notice when my emotional state changes.",
                "I reflect on why I react to certain situations.",
                "I can distinguish between what happened and my interpretation of what happened.",
              ],
            },
            {
              title: "B. Flexibility",
              statements: [
                "I can consider an alternative explanation when something goes wrong.",
                "I can change my mind when new evidence appears.",
                "I can recognise when an old belief is no longer useful.",
                "I can separate a temporary setback from my identity.",
                "I can consider several possible responses to a difficult situation.",
              ],
            },
            {
              title: "C. Action",
              statements: [
                "I pause before reacting when something important happens.",
                "I can choose a constructive response even when I feel uncomfortable.",
                "I turn important intentions into specific actions.",
                "I review the results of my decisions.",
                "I learn from outcomes rather than simply judging myself.",
              ],
            },
          ],
          bands: [
            { min: 15, max: 30, title: "Your first priority is awareness.", text: "You may benefit from slowing down the gap between experience and reaction." },
            { min: 31, max: 45, title: "You have developing awareness.", text: "You already notice some patterns but may benefit from applying the process more consistently." },
            { min: 46, max: 60, title: "You demonstrate strong self-observation.", text: "Your next challenge is turning awareness into deliberate action." },
            { min: 61, max: 75, title: "You demonstrate highly developed self-awareness.", text: "Your opportunity is to use that awareness to create better decisions, habits and outcomes." },
          ],
        },
      },
    ],
    coaches: [],
  },

  // ---------------------------------------------------------------- day 4
  {
    lessonId: "m2-day-4",
    title: "Module 2 · Day 4 — Your Belief System",
    lessonOrder: 7,
    duration: "60 minutes",
    objective: "Investigate the beliefs about yourself that influence what you attempt.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What do you believe about yourself that influences what you attempt?</p></blockquote>

<h2>Lesson</h2>
<p>A belief is an idea that we accept as true or meaningful enough to influence how we think and behave.</p>
<p>Some beliefs are useful. Some are inaccurate. Some are partly true. Some may have been useful at one point in our lives but become restrictive later.</p>
<p>Consider: <em>"I'm not good with technology."</em></p>
<p>If someone believes this strongly, they may avoid learning new technology. Avoiding technology means they get less practice. Less practice can produce poorer performance. Poor performance then appears to confirm the original belief.</p>
<p>The cycle becomes:</p>
${flow(["BELIEF", "BEHAVIOUR", "EXPERIENCE", "CONFIRMATION", "STRONGER BELIEF"])}
<p>This is one reason beliefs deserve examination.</p>

<h2>The belief loop</h2>
<p>Imagine someone believes: <em>"I'm not confident enough to speak publicly."</em></p>
<p>They avoid presentations. Because they avoid presentations, they get little practice. When they eventually have to speak, they feel uncomfortable. They interpret that discomfort as evidence: <em>"See? I'm not good at speaking."</em> The belief becomes stronger.</p>
<p>But an alternative explanation exists: <em>"I haven't had enough deliberate practice yet."</em></p>
<p>The two statements can produce very different behaviour.</p>

<h2>Diagnostic exercise — Complete the sentence</h2>
<p>Finish each sentence quickly. Don't overthink it.</p>
${block("exercise", "d4-sentences")}

<h2>The Belief Investigation</h2>
<p>Choose your three most interesting answers. For each one, complete the investigation.</p>
${block("exercise", "d4-investigation")}

<h2>Case study — Amara's career decision</h2>
<p>Amara has worked in administration for six years. She wants to move into digital project management.</p>
<p>Whenever she considers applying for project-management roles, she thinks: <em>"I don't have the right background."</em></p>
<p>She searches for courses. She saves job advertisements. She watches videos. But she doesn't apply.</p>
<p>A friend tells her that her administrative experience includes:</p>
<ul>
<li>organising projects;</li>
<li>managing deadlines;</li>
<li>coordinating people;</li>
<li>communicating with stakeholders;</li>
<li>maintaining documentation;</li>
<li>solving problems.</li>
</ul>
<p>Amara realises something. Her problem may not be a complete absence of relevant experience. Her interpretation of her experience may have been limiting her.</p>
<p>She still has a skills gap to address. But now she has a different question: <em>"What do I need to learn and demonstrate to become competitive?"</em></p>
<p>That question produces action.</p>

<h2>Scenario activity</h2>
${block("scenario", "d4-amara")}

<h2>AI coach exercise</h2>
<p>Use AI to investigate one belief. Your coach can bring in the first belief from your Belief Investigation.</p>
${block("coach", "d4-belief-coach")}

<h2>Day 4 practical challenge</h2>
<p>Choose one belief. Do something small that allows you to collect <strong>new evidence</strong>.</p>
<p>Example — Belief: <em>"I'm bad at networking."</em> Experiment: have one five-minute professional conversation.</p>
${block("exercise", "d4-challenge")}

<h2>Day 4 reflection</h2>
${block("exercise", "d4-reflection")}

<h2>Day 4 knowledge check</h2>
${block("quiz")}

<h2>Day 4 assignment — Belief Investigation Report</h2>
${block("exercise", "d4-assignment")}
`,
    exercises: [
      {
        exerciseId: "d4-sentences",
        title: "Complete the sentence",
        fields: [
          "Success is…", "Failure is…", "Money is…", "Education is…", "Work is…", "Leadership is…",
          "Risk is…", "People like me…", "I am good at…", "I am not good at…", "When I fail…", "When I succeed…",
        ].map((label, i) => ({ id: `s${i + 1}`, label, type: "text" })),
      },
      {
        exerciseId: "d4-investigation",
        title: "The Belief Investigation",
        intro: "Complete one card for each of your three most interesting answers.",
        table: {
          columns: [
            "Belief",
            "Where did it come from?",
            "What experiences support it?",
            "What experiences challenge it?",
            "Is it a fact, interpretation, value or prediction?",
            "How does this belief affect my actions?",
            "Would I choose this belief today?",
          ],
          rows: ["Belief 1", "Belief 2", "Belief 3"],
        },
      },
      {
        exerciseId: "d4-challenge",
        title: "My belief experiment",
        fields: [
          { id: "belief", label: "The belief I tested:", type: "text" },
          { id: "experiment", label: "My experiment:", type: "text" },
          { id: "expected", label: "What I expected:", type: "textarea" },
          { id: "happened", label: "What happened:", type: "textarea" },
          { id: "learned", label: "What I learned:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d4-reflection",
        title: "Day 4 reflection",
        fields: [
          { id: "surprised", label: "1. Which belief surprised me most?", type: "textarea" },
          { id: "source", label: "2. Where did it come from?", type: "textarea" },
          { id: "influence", label: "3. How has it influenced my behaviour?", type: "textarea" },
          { id: "challenge", label: "4. What evidence challenges it?", type: "textarea" },
          { id: "experiment", label: "5. What experiment could give me better evidence?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d4-assignment",
        title: "Belief Investigation Report",
        intro:
          "Choose one meaningful belief and write about: the belief; its origin; evidence supporting it; evidence challenging it; how it affects your behaviour; whether you still consciously choose it; and one experiment you could conduct.",
        fields: [{ id: "report", label: "My Belief Investigation Report (recommended 400–600 words)", type: "textarea", minWords: 400, maxWords: 600 }],
      },
    ],
    scenarios: [
      {
        scenarioId: "d4-amara",
        title: "You are Amara",
        question: "You are Amara. Which response is most useful?",
        options: [
          "\"I shouldn't apply until I know everything.\"",
          "\"I clearly can't do this.\"",
          "\"I'll identify the skills I already have, identify the gaps and test my readiness through applications or projects.\"",
          "\"I'll ignore the problem.\"",
        ],
        answer: 2,
        explanation:
          "The important distinction is between \"I can't.\" and \"I can't yet, and I need to identify what would help me progress.\" Response C builds on real experience, names the gap and creates evidence.",
      },
    ],
    coaches: [
      {
        coachId: "d4-belief-coach",
        title: "Belief Coach",
        intro: "A neutral reflective coach that helps you examine the evidence for one belief — no flattery, and no automatic challenge.",
        usesExercises: ["d4-investigation"],
        promptTemplate:
          "Act as a neutral reflective coach.\n\nI am examining a belief I hold:\n\n[PASTE YOUR ANSWERS]\n\nHelp me investigate it without telling me what decision to make.\n\nAsk me:\n\n1. Where did this belief come from?\n2. What experiences support it?\n3. What experiences challenge it?\n4. What assumptions are contained within it?\n5. What alternative explanations might exist?\n6. How does this belief affect my behaviour?\n7. What small experiment could help me test the belief?\n\nDo not flatter me.\nDo not automatically challenge the belief.\nHelp me examine the evidence.",
        systemPrompt:
          "Exercise: Day 4 — investigate one belief. If the learner shares several beliefs, ask which ONE they want to examine first. Work through the seven questions one or two at a time, waiting for their answers: origin; supporting experiences; challenging experiences; assumptions within it; alternative explanations; effect on behaviour; a small experiment to test it. Do not flatter them, and do not automatically challenge the belief — treat it as possibly true, partly true or untrue until the evidence says otherwise. Finish by summarising the evidence on both sides in their own words and asking what experiment they will try.",
      },
    ],
    quiz: [
      q("True or false: a belief can influence behaviour by affecting how a person interprets and responds to situations.", TF, 0,
        "True. Beliefs shape interpretation, and interpretation shapes behaviour — which is how the belief loop forms."),
      q("True or false: every belief a person holds is objectively true because it comes from personal experience.", TF, 1,
        "False. Experience is real, but the conclusion drawn from it can be partly true, inaccurate, or no longer useful — which is why beliefs deserve examination."),
      q("Which question is most useful when investigating a belief?",
        ["Who agrees with me?", "What evidence supports and challenges this belief?", "How can I avoid thinking about it?", "How can I make other people accept it?"],
        1, "Looking at evidence on both sides lets you evaluate the belief rather than simply defend or reject it."),
      q("In the Amara case study, what changed?",
        ["Her skills automatically increased.", "She discovered that her interpretation of her existing experience might have been limiting her.", "She received a guaranteed job.", "She stopped needing to learn."],
        1, "Her experience didn't change — her interpretation of it did. She still had a skills gap, but now had a question that produced action."),
      q("What is the purpose of a belief experiment?",
        ["To prove yourself right.", "To collect information that can help you evaluate the belief.", "To eliminate uncertainty completely.", "To avoid taking action."],
        1, "An experiment gathers new evidence. It won't remove all uncertainty, but it gives you better information than the belief alone."),
    ],
  },

  // ---------------------------------------------------------------- day 5
  {
    lessonId: "m2-day-5",
    title: "Module 2 · Day 5 — Your Inner Voice",
    lessonOrder: 8,
    duration: "60 minutes",
    objective: "Recognise the Critic, Protector, Planner and Possibility Thinker — and observe thoughts instead of obeying them.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What does your mind say to you when something important is at stake?</p></blockquote>

<h2>Lesson</h2>
<p>Imagine that you are about to apply for a new opportunity.</p>
<p>One part of your mind says: <em>"Go for it."</em> Another says: <em>"You'll probably fail."</em> Another says: <em>"Wait until you're more prepared."</em> Another says: <em>"What if this works?"</em></p>
<p>These competing internal messages can influence behaviour.</p>
<p>Instead of treating every thought as a command, today's lesson introduces a useful skill:</p>
<blockquote><p>Observe the thought.</p></blockquote>
<p>A thought is something your mind produces. It is not automatically an instruction.</p>
<p>For example, <em>"I'm going to fail."</em> can become <em>"I'm noticing the thought that I might fail."</em></p>
<p>That small change creates psychological distance. You are observing the thought rather than automatically obeying it.</p>

<h2>The four inner voices</h2>
<p>For this course, we'll use four practical labels.</p>
<ol>
<li><strong>The Critic</strong> — <em>"You're not good enough."</em></li>
<li><strong>The Protector</strong> — <em>"Don't take the risk."</em></li>
<li><strong>The Planner</strong> — <em>"Let's work out what could go wrong and prepare."</em></li>
<li><strong>The Possibility Thinker</strong> — <em>"What might become possible if I try?"</em></li>
</ol>
<p>None of these voices needs to be completely eliminated. The objective is to recognise them.</p>
<p>The <strong>Critic</strong> may identify genuine weaknesses. The <strong>Protector</strong> may identify genuine risks. The <strong>Planner</strong> can help prepare. The <strong>Possibility Thinker</strong> can help identify opportunities.</p>
<p>The problem occurs when one voice controls every decision.</p>

<h2>Exercise — Inner Voice Mapping</h2>
<p>Think about a decision you currently face. Write down the thoughts that appear.</p>
${block("exercise", "d5-voice-map")}

<h2>Scenario activity</h2>
<p>You are considering starting a small online service. You hear:</p>
<ul>
<li><strong>Critic:</strong> <em>"Nobody will pay for this."</em></li>
<li><strong>Protector:</strong> <em>"Don't risk your money."</em></li>
<li><strong>Planner:</strong> <em>"Test the idea with a small pilot before spending much."</em></li>
<li><strong>Possibility Thinker:</strong> <em>"What if ten people actually want it?"</em></li>
</ul>
${block("scenario", "d5-online-service")}

<h2>The Thought → Response exercise</h2>
<p>Take one difficult thought. For example, the automatic thought <em>"I can't do this."</em> becomes the observation <em>"I'm having the thought that I can't do this."</em> Then look at the evidence and choose the smallest useful next action.</p>
${block("exercise", "d5-thought-response")}

<h2>AI coach exercise</h2>
<p>Your coach can bring in the decision and thoughts from your Inner Voice Mapping.</p>
${block("coach", "d5-inner-dialogue")}

<h2>Practical challenge — Inner Voice Log</h2>
<p>For one day, keep an <strong>Inner Voice Log</strong>. Whenever you notice a strong reaction, record it. Try to record at least three examples.</p>
${block("exercise", "d5-voice-log")}

<h2>Day 5 reflection</h2>
${block("exercise", "d5-reflection")}

<h2>Day 5 knowledge check</h2>
${block("quiz")}

<h2>Day 5 assignment — Inner Voice Log</h2>
<p>Complete an Inner Voice Log containing at least three real situations.</p>
${block("exercise", "d5-assignment")}
`,
    exercises: [
      {
        exerciseId: "d5-voice-map",
        title: "Inner Voice Mapping",
        fields: [
          { id: "decision", label: "The decision I currently face:", type: "textarea" },
          { id: "critic", label: "Critic:", type: "textarea" },
          { id: "protector", label: "Protector:", type: "textarea" },
          { id: "planner", label: "Planner:", type: "textarea" },
          { id: "possibility", label: "Possibility Thinker:", type: "textarea" },
          { id: "loudest", label: "Which voice is currently loudest?", type: "textarea" },
          { id: "more", label: "Which voice might I need more of?", type: "textarea" },
          { id: "evidence", label: "Which voice might need evidence before I accept its conclusion?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d5-thought-response",
        title: "Thought → Response",
        fields: [
          { id: "automatic", label: "Automatic thought:", type: "text" },
          { id: "observation", label: "Observation (\"I'm having the thought that…\"):", type: "text" },
          { id: "supports", label: "Evidence — what evidence supports the thought?", type: "textarea" },
          { id: "challenges", label: "Evidence — what evidence challenges it?", type: "textarea" },
          { id: "action", label: "Action — what is the smallest useful next action?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d5-voice-log",
        title: "Inner Voice Log",
        table: {
          columns: ["Situation", "Automatic thought", "Emotion", "What I wanted to do", "What I actually did", "What I might choose next time"],
          rows: ["Example 1", "Example 2", "Example 3"],
        },
      },
      {
        exerciseId: "d5-reflection",
        title: "Day 5 reflection",
        fields: [
          { id: "frequent", label: "1. Which internal voice appears most frequently?", type: "textarea" },
          { id: "critic", label: "2. When does the Critic become useful?", type: "textarea" },
          { id: "protector", label: "3. When does the Protector become useful?", type: "textarea" },
          { id: "unhelpful", label: "4. When does either become unhelpful?", type: "textarea" },
          { id: "balanced", label: "5. What would a balanced internal conversation sound like?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d5-assignment",
        title: "My Inner Voice Log (assignment)",
        table: {
          columns: ["Situation", "Automatic thought", "Emotion", "Internal voice", "Evidence", "Alternative interpretation", "Chosen response"],
          rows: ["Situation 1", "Situation 2", "Situation 3"],
        },
      },
    ],
    scenarios: [
      {
        scenarioId: "d5-online-service",
        title: "The online service",
        question: "Which approach combines the most useful elements?",
        options: ["Listen only to the Critic.", "Ignore every concern.", "Combine risk awareness, planning and experimentation.", "Assume success is guaranteed."],
        answer: 2,
        explanation:
          "Each voice brings something: the Protector's risk awareness, the Planner's small pilot and the Possibility Thinker's upside. A cheap experiment tests the Critic's claim with evidence instead of letting any one voice decide.",
      },
    ],
    coaches: [
      {
        coachId: "d5-inner-dialogue",
        title: "Inner Dialogue Coach",
        intro: "Helps you sort your thoughts into the four voices and separate evidence from assumptions. It won't diagnose you or tell you what to do.",
        usesExercises: ["d5-voice-map"],
        promptTemplate:
          "I want you to help me examine my internal dialogue.\n\nHere is a situation and the thoughts I noticed:\n\n[PASTE YOUR ANSWERS]\n\nHelp me classify each thought as primarily:\n\n- criticism;\n- risk protection;\n- planning;\n- possibility thinking;\n- or another category.\n\nDo not diagnose me.\nDo not tell me what I must do.\n\nThen ask me questions that help me distinguish evidence from assumptions and identify a reasonable next action.",
        systemPrompt:
          "Exercise: Day 5 — internal dialogue. Classify each thought the learner shares as primarily criticism (the Critic), risk protection (the Protector), planning (the Planner), possibility thinking (the Possibility Thinker) or another category, with a one-line reason. Never diagnose or label the person. Then ask, one or two at a time, questions that separate evidence from assumptions for the loudest thoughts, and finally ask what reasonable next action they would choose. Do not tell them what they must do.",
      },
    ],
    quiz: [
      q("True or false: a thought should automatically be treated as a factual instruction.", TF, 1,
        "False. A thought is something your mind produces — you can observe it and check the evidence before acting on it."),
      q("Which internal voice is primarily associated with identifying possible risks?", ["Critic", "Protector", "Possibility Thinker", "Explorer"],
        1, "The Protector says \"Don't take the risk.\" It can spot genuine risks — the aim is to hear it without letting it decide everything."),
      q("What does the phrase \"I'm noticing the thought that…\" help create?",
        ["More automatic reaction", "Greater distance between the person and the thought", "Guaranteed confidence", "Elimination of emotion"],
        1, "Naming the thought as a thought creates psychological distance, so you observe it rather than automatically obey it."),
      q("Which combination is most useful when evaluating a new opportunity?",
        ["Criticism only", "Optimism only", "Risk awareness, planning and possibility thinking", "Avoidance only"],
        2, "A balanced inner conversation uses several voices — risks, preparation and possibilities — rather than one."),
      q("The goal of Inner Voice Mapping is to:",
        ["Eliminate all negative thoughts", "Identify and examine different internal messages", "Stop making decisions", "Replace planning with intuition"],
        1, "Mapping helps you recognise which voices are speaking and examine them — not silence them."),
    ],
  },

  // ---------------------------------------------------------------- day 6
  {
    lessonId: "m2-day-6",
    title: "Module 2 · Day 6 — Build Your Personal Operating System",
    lessonOrder: 9,
    duration: "60–75 minutes",
    objective: "Map what happens between an event and your action, and practise STOP → NOTICE → NAME → CHECK → CHOOSE → ACT.",
    contentBody: `
<h2>Today's question</h2>
<blockquote><p>What happens between something happening to you and the action you take?</p></blockquote>

<h2>Lesson</h2>
<p>Imagine receiving an email: <em>"Unfortunately, your application was unsuccessful."</em> Two people receive exactly the same message.</p>
<p><strong>Person A</strong> thinks: <em>"I'm useless. I'll never get anywhere."</em> They feel discouraged. They stop applying.</p>
<p><strong>Person B</strong> thinks: <em>"That opportunity didn't work. I need to find out whether there is anything useful I can learn."</em> They request feedback. They improve their application. They apply again.</p>
<p>The external event was the same. The internal process was different.</p>
<p>This is the reason we are building the BSOE Personal Operating System.</p>

<h2>The BSOE Personal Operating System</h2>
<ol>
<li><strong>Event</strong> — something happens.</li>
<li><strong>Interpretation</strong> — you make sense of it.</li>
<li><strong>Thought</strong> — a thought emerges.</li>
<li><strong>Emotion</strong> — you experience an emotional response.</li>
<li><strong>Decision</strong> — you choose, consciously or automatically, how to respond.</li>
<li><strong>Action</strong> — you do something.</li>
<li><strong>Result</strong> — something happens as a consequence.</li>
<li><strong>Learning</strong> — you interpret the result and update your understanding.</li>
</ol>
<p>Then the cycle begins again.</p>

<h2>The full loop</h2>
${flow(["EVENT", "INTERPRETATION", "THOUGHT", "EMOTION", "DECISION", "ACTION", "RESULT", "LEARNING", "BELIEF UPDATE"])}
<p>This final stage is crucial. Your experiences can influence future beliefs. But you can also deliberately examine what you learned rather than allowing one experience to define you.</p>

<h2>Case study — The failed interview</h2>
<p>Daniel applies for a job he really wants. He reaches the final interview. He is rejected.</p>
<table>
<tr><th></th><th>Pathway A</th><th>Pathway B</th></tr>
<tr><td><strong>Event</strong></td><td>He receives the rejection email.</td><td>Same rejection email.</td></tr>
<tr><td><strong>Interpretation</strong></td><td>"I'm not good enough."</td><td>"I was competitive enough to reach the final stage, but something in the interview or application could be improved."</td></tr>
<tr><td><strong>Emotion</strong></td><td>Disappointment and embarrassment.</td><td>Disappointment mixed with determination.</td></tr>
<tr><td><strong>Decision</strong></td><td>Don't apply again.</td><td>Seek feedback.</td></tr>
<tr><td><strong>Action</strong></td><td>Stops applying for similar positions.</td><td>Practises interviews and improves examples.</td></tr>
<tr><td><strong>Result</strong></td><td>Fewer opportunities.</td><td>Improved preparation.</td></tr>
<tr><td><strong>Learning</strong></td><td>—</td><td>The rejection provides information rather than becoming an identity statement.</td></tr>
</table>

<h2>Scenario activity — Change the operating system</h2>
<p>Read this situation: <em>You launch a small project. Nobody responds during the first week.</em></p>
<p>Complete the two possible operating systems.</p>
${block("exercise", "d6-change-os")}

<h2>The 5-second pause</h2>
<p>When something important happens, practise:</p>
<ul>
<li><strong>STOP</strong> — don't immediately react.</li>
<li><strong>NOTICE</strong> — what am I thinking?</li>
<li><strong>NAME</strong> — what am I feeling?</li>
<li><strong>CHECK</strong> — what evidence do I have?</li>
<li><strong>CHOOSE</strong> — what response is most useful?</li>
<li><strong>ACT</strong> — take the next deliberate step.</li>
</ul>
<p>This becomes the practical BSOE tool:</p>
<blockquote><p>STOP → NOTICE → NAME → CHECK → CHOOSE → ACT</p></blockquote>

<h2>AI practical exercise — Build your AI reflection coach</h2>
<p>Use this after a difficult situation. Describe the event where it says <em>[DESCRIBE EVENT]</em>; your coach will ask one question at a time.</p>
${block("coach", "d6-reflection-coach")}

<h2>Advanced exercise — Rewrite the loop</h2>
<p>Choose a recent situation that did not go as planned.</p>
${block("exercise", "d6-rewrite")}

<h2>The Personal Operating System Map</h2>
<p>Now create your own.</p>
${block("exercise", "d6-os-map")}

<h2>Day 6 real-world challenge</h2>
<p>Use the <strong>STOP → NOTICE → NAME → CHECK → CHOOSE → ACT</strong> method at least once today. Afterwards, record it.</p>
${block("exercise", "d6-challenge")}

<h2>Day 6 reflection</h2>
${block("exercise", "d6-reflection")}

<h2>Day 6 knowledge check</h2>
${block("quiz")}
`,
    exercises: [
      {
        exerciseId: "d6-change-os",
        title: "Change the operating system",
        intro: "Situation: you launch a small project. Nobody responds during the first week.",
        table: {
          columns: ["Event", "Interpretation", "Emotion", "Decision", "Action", "Likely result"],
          rows: ["Operating System A", "Operating System B"],
        },
      },
      {
        exerciseId: "d6-rewrite",
        title: "Rewrite the loop",
        fields: [
          { id: "happened", label: "What happened?", type: "textarea" },
          { id: "meant", label: "What did I think it meant?", type: "textarea" },
          { id: "felt", label: "What did I feel?", type: "textarea" },
          { id: "decided", label: "What did I decide?", type: "textarea" },
          { id: "did", label: "What did I do?", type: "textarea" },
          { id: "resulted", label: "What resulted?", type: "textarea" },
          { id: "learned", label: "What did I learn?", type: "textarea" },
          { id: "again", label: "If I could run the situation again with the information I now have, what would I do differently?", type: "textarea" },
        ],
      },
      {
        exerciseId: "d6-os-map",
        title: "My Personal Operating System Map",
        fields: [
          { id: "when", label: "When this happens:", type: "textarea" },
          { id: "interpretation", label: "My automatic interpretation is:", type: "textarea" },
          { id: "thought", label: "My usual thought is:", type: "textarea" },
          { id: "feel", label: "I tend to feel:", type: "textarea" },
          { id: "decide", label: "I usually decide to:", type: "textarea" },
          { id: "then", label: "I then:", type: "textarea" },
          { id: "result", label: "The result is often:", type: "textarea" },
          { id: "deliberate", label: "A more deliberate response could be:", type: "textarea" },
          { id: "test", label: "The new action I will test is:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d6-challenge",
        title: "STOP → NOTICE → NAME → CHECK → CHOOSE → ACT",
        fields: [
          { id: "situation", label: "Situation:", type: "textarea" },
          { id: "noticed", label: "What I noticed:", type: "textarea" },
          { id: "chose", label: "What I chose:", type: "textarea" },
          { id: "happened", label: "What happened:", type: "textarea" },
          { id: "learned", label: "What I learned:", type: "textarea" },
        ],
      },
      {
        exerciseId: "d6-reflection",
        title: "Day 6 reflection",
        fields: [
          { id: "easiest", label: "1. Which stage of my Personal Operating System is easiest for me to recognise?", type: "textarea" },
          { id: "skip", label: "2. Which stage do I usually skip?", type: "textarea" },
          { id: "triggers", label: "3. What situations trigger automatic responses?", type: "textarea" },
          { id: "change", label: "4. What response pattern would I like to change?", type: "textarea" },
          { id: "practise", label: "5. What will I practise over the next seven days?", type: "textarea" },
        ],
      },
    ],
    coaches: [
      {
        coachId: "d6-reflection-coach",
        title: "AI Reflection Coach",
        intro: "A structured reflection partner that walks you through Event → Learning one question at a time, then summarises what you discovered.",
        usesExercises: [],
        promptTemplate:
          "Act as a structured reflection partner.\n\nHelp me analyse an event using this framework:\n\nEVENT\nINTERPRETATION\nTHOUGHT\nEMOTION\nDECISION\nACTION\nRESULT\nLEARNING\n\nHere is what happened:\n\n[DESCRIBE EVENT]\n\nAsk me one question at a time.\n\nDo not diagnose me.\nDo not tell me what decision to make.\nDo not assume my interpretation is correct.\n\nHelp me distinguish:\n\n- facts;\n- assumptions;\n- interpretations;\n- emotions;\n- decisions;\n- actions;\n- possible lessons.\n\nAt the end, summarise what I discovered and suggest three questions I could consider for my next step.",
        systemPrompt:
          "Exercise: Day 6 — structured reflection with the BSOE Personal Operating System (Event, Interpretation, Thought, Emotion, Decision, Action, Result, Learning). If the learner hasn't described an event yet, ask them to. Then ask exactly ONE question per message, moving through the stages in order, and gently label what they say as fact, assumption, interpretation, emotion, decision, action or possible lesson. Never assume their interpretation is correct, never diagnose, never tell them what to decide. When all stages are covered, summarise what they discovered in their own words and offer three questions they could consider for their next step.",
      },
    ],
    quiz: [
      q("True or false: the BSOE Personal Operating System suggests that an event and a person's response are always identical.", TF, 1,
        "False. The same event can lead to very different responses, because interpretation, thoughts, emotions and decisions sit in between — as Person A and Person B showed."),
      q("Which sequence best represents the model?",
        ["Event → interpretation → thought → emotion → decision → action → result → learning", "Event → result → emotion → success", "Thought → event → result → decision", "Emotion → success → event → learning"],
        0, "Event, interpretation, thought, emotion, decision, action, result, learning — and learning can update your beliefs."),
      q("Why is the learning stage important?",
        ["It allows experience to inform future decisions.", "It guarantees that future outcomes will be successful.", "It eliminates uncertainty.", "It prevents mistakes."],
        0, "Learning turns a result into information you can use next time, instead of letting one experience define you."),
      q("What is the purpose of \"STOP → NOTICE → NAME → CHECK → CHOOSE → ACT\"?",
        ["To suppress emotions.", "To create a deliberate pause before responding.", "To avoid making decisions.", "To guarantee a positive outcome."],
        1, "It creates space between the event and your response so you can choose deliberately — emotions are named, not suppressed."),
      q("Which statement best describes the Personal Operating System?",
        ["It gives people complete control over external events.", "It helps people examine how they process experiences and choose responses.", "It eliminates difficult experiences.", "It guarantees achievement."],
        1, "You can't control every event, but you can become more aware of how you process it and how you respond."),
    ],
  },

  // ---------------------------------------------------------------- module 2 assessment
  {
    lessonId: "m2-assessment",
    title: "Module 2 · Final Assessment — My Personal Operating System",
    lessonOrder: 10,
    duration: "90 minutes + 7-day challenge",
    objective: "Bring Days 4–6 together in your assessed Personal Operating System (50 marks).",
    contentBody: `
<h2>Module 2 final assessment — My Personal Operating System</h2>
<p><strong>50 marks.</strong> This is the major assessed activity for Module 2. Your answers from Days 4–6 are a good starting point.</p>

<h2>Part A — Belief analysis (10 marks)</h2>
<p>Choose one meaningful belief.</p>
${block("exercise", "m2-part-a")}

<h2>Part B — Inner voice analysis (10 marks)</h2>
<p>Describe one situation where competing internal messages influenced you.</p>
${block("exercise", "m2-part-b")}

<h2>Part C — Operating System case study (10 marks)</h2>
<p>Choose a real situation from your life and map it from Event to Learning.</p>
${block("exercise", "m2-part-c")}

<h2>Part D — Response redesign (10 marks)</h2>
<p>Choose one recurring response pattern you want to improve.</p>
${block("exercise", "m2-part-d")}

<h2>Part E — Personal Operating System (10 marks)</h2>
<p>Create your own one-page Personal Operating System.</p>
${block("exercise", "m2-part-e")}

<h2>Assessment rubric</h2>
<table>
<tr><th>Criterion</th><th>Marks</th></tr>
<tr><td>Belief analysis</td><td>10</td></tr>
<tr><td>Inner voice analysis</td><td>10</td></tr>
<tr><td>Operating System case study</td><td>10</td></tr>
<tr><td>Response redesign</td><td>10</td></tr>
<tr><td>Personal Operating System</td><td>10</td></tr>
<tr><th>Total</th><th>50</th></tr>
</table>

<h2>Performance guidance</h2>
<ul>
<li><strong>40–50 — Strong application.</strong> You demonstrate clear awareness of your internal patterns and can translate reflection into practical action.</li>
<li><strong>30–39 — Developing application.</strong> You demonstrate understanding but should continue strengthening the connection between awareness and action.</li>
<li><strong>20–29 — Foundation level.</strong> You have begun identifying important patterns but need more evidence, reflection and practical experimentation.</li>
<li><strong>Below 20</strong> — return to Days 4–6 and complete the exercises again before progressing. This is not a judgement of your potential. It simply means you need more practice with the framework.</li>
</ul>

<h2>Get feedback before you submit</h2>
<p>Your AI Assessment Reviewer reads Parts A–E against the rubric and tells you what is strong and what could be clearer. Its marks are only a guide — your tutor gives the final mark.</p>
${block("coach", "m2-assessment-review")}

<h2>Your Module 2 submission</h2>
${block("portfolio")}

<h2>Module 2 completion challenge</h2>
<p>For the next seven days, practise:</p>
<ul>
<li><strong>STOP</strong> — pause.</li>
<li><strong>NOTICE</strong> — what am I thinking?</li>
<li><strong>NAME</strong> — what am I feeling?</li>
<li><strong>CHECK</strong> — what evidence do I have?</li>
<li><strong>CHOOSE</strong> — what response would be useful?</li>
<li><strong>ACT</strong> — what is my next deliberate action?</li>
</ul>
${block("exercise", "m2-seven-days")}
<p>At the end of seven days, answer:</p>
<blockquote><p>What changed when I became more aware of the space between what happened and how I responded?</p></blockquote>
${block("exercise", "m2-completion")}

<h2>Module 2 takeaway</h2>
<p>You cannot control everything that happens to you. But you can become more aware of how you process what happens.</p>
<p>Your internal operating system is not fixed. It is influenced by <strong>experience, learning, beliefs, habits, environment, reflection and practice</strong>.</p>
<p>And that means one of the most powerful questions you can ask is:</p>
<blockquote><p>Is my current response the only response available to me?</p></blockquote>
<p>Often, it isn't. That discovery is the beginning of deliberate personal transformation.</p>

<h2>Remember this framework</h2>
<p>Aim to remember this without needing the course — it runs through all 30 days:</p>
${flow(["BELIEF", "THOUGHT", "EMOTION", "DECISION", "ACTION", "RESULT", "LEARNING"])}
<p>And when something difficult happens:</p>
<blockquote><p>STOP → NOTICE → NAME → CHECK → CHOOSE → ACT</p></blockquote>

<h2>Next: Module 3 — Transform Your Identity (Days 7–9)</h2>
<ul>
<li><strong>Day 7 — Who Am I Now?</strong> You will examine the labels, roles and stories that make up your current identity.</li>
<li><strong>Day 8 — Meet Your Future Self.</strong> You will create a detailed picture of the person you are becoming.</li>
<li><strong>Day 9 — Identity-Based Goals.</strong> You will stop setting goals only around what you want to achieve and begin asking: <em>"What kind of person would naturally take the actions required to achieve this?"</em></li>
</ul>
<p>Your final outputs will be <strong>My Future Self Profile</strong> and <strong>My Identity-Based Action Plan</strong>.</p>
`,
    exercises: [
      {
        exerciseId: "m2-part-a",
        title: "Part A — Belief analysis",
        fields: [
          { id: "belief", label: "What I believe:", type: "textarea" },
          { id: "origin", label: "Where it came from:", type: "textarea" },
          { id: "supporting", label: "Supporting evidence:", type: "textarea" },
          { id: "challenging", label: "Challenging evidence:", type: "textarea" },
          { id: "behaviour", label: "How it affects my behaviour:", type: "textarea" },
        ],
        marks: 10,
      },
      {
        exerciseId: "m2-part-b",
        title: "Part B — Inner voice analysis",
        fields: [
          { id: "situation", label: "The situation:", type: "textarea" },
          { id: "critic", label: "Critic:", type: "textarea" },
          { id: "protector", label: "Protector:", type: "textarea" },
          { id: "planner", label: "Planner:", type: "textarea" },
          { id: "possibility", label: "Possibility Thinker:", type: "textarea" },
          { id: "dominated", label: "Which voice dominated, and why:", type: "textarea" },
        ],
        marks: 10,
      },
      {
        exerciseId: "m2-part-c",
        title: "Part C — Operating System case study",
        fields: ["Event", "Interpretation", "Thought", "Emotion", "Decision", "Action", "Result", "Learning"].map((s) => ({
          id: s.toLowerCase(),
          label: `${s}:`,
          type: "textarea",
        })),
        marks: 10,
      },
      {
        exerciseId: "m2-part-d",
        title: "Part D — Response redesign",
        fields: [
          { id: "pattern", label: "Current pattern:", type: "textarea" },
          { id: "trigger", label: "Trigger:", type: "textarea" },
          { id: "interpretation", label: "Automatic interpretation:", type: "textarea" },
          { id: "current", label: "Current response:", type: "textarea" },
          { id: "new", label: "New response:", type: "textarea" },
          { id: "experiment", label: "Experiment:", type: "textarea" },
        ],
        marks: 10,
      },
      {
        exerciseId: "m2-part-e",
        title: "Part E — My Personal Operating System",
        fields: [
          { id: "triggers", label: "My triggers:", type: "textarea" },
          { id: "thoughts", label: "My common thought patterns:", type: "textarea" },
          { id: "emotions", label: "My common emotional responses:", type: "textarea" },
          { id: "decisions", label: "My decision patterns:", type: "textarea" },
          { id: "strengths", label: "My strengths:", type: "textarea" },
          { id: "risks", label: "My risk patterns:", type: "textarea" },
          { id: "strategy", label: "My new response strategy:", type: "textarea" },
          { id: "experiment", label: "My next 7-day experiment:", type: "textarea" },
        ],
        marks: 10,
      },
      {
        exerciseId: "m2-seven-days",
        title: "Seven-day practice log",
        table: {
          columns: ["Situation", "What I noticed and named", "What I chose and did"],
          rows: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
        },
      },
      {
        exerciseId: "m2-completion",
        title: "Module 2 completion reflection",
        fields: [
          {
            id: "reflection",
            label: "What changed when I became more aware of the space between what happened and how I responded? (250–500 words)",
            type: "textarea",
            minWords: 250,
            maxWords: 500,
          },
        ],
      },
    ],
    coaches: [
      {
        coachId: "m2-assessment-review",
        title: "AI Assessment Reviewer",
        intro: "Formative feedback on Parts A–E against the rubric: what is strong, what is missing, and questions to strengthen it. Its marks are indicative only.",
        usesExercises: ["m2-part-a", "m2-part-b", "m2-part-c", "m2-part-d", "m2-part-e"],
        promptTemplate:
          "Please review my Module 2 assessment, My Personal Operating System, against the rubric (Belief analysis, Inner voice analysis, Operating System case study, Response redesign, Personal Operating System — 10 marks each).\n\nHere is my work:\n\n[PASTE YOUR ANSWERS]\n\nFor each part, tell me what is strong, what is missing or unclear, and one question that would help me improve it. Do not rewrite my answers for me.",
        systemPrompt:
          "Exercise: Module 2 assessment review (formative). Review each of Parts A–E against its criterion:\nA Belief analysis (10): the belief, its origin, supporting evidence, challenging evidence, effect on behaviour — specific and honest.\nB Inner voice analysis (10): one real situation; Critic, Protector, Planner and Possibility Thinker identified; which dominated and why.\nC Operating System case study (10): a real situation mapped through Event, Interpretation, Thought, Emotion, Decision, Action, Result, Learning, with facts separated from interpretations.\nD Response redesign (10): a recurring pattern with trigger, automatic interpretation, current response, a realistic new response and a concrete experiment.\nE Personal Operating System (10): triggers, thought patterns, emotional responses, decision patterns, strengths, risk patterns, a new response strategy and a specific 7-day experiment.\nFor each part give: what is strong, what is missing or unclear, one improving question, and an indicative mark out of 10. Parts left empty score 0 — say what to add. Then give an indicative total out of 50 and the matching performance band (40–50 strong application; 30–39 developing; 20–29 foundation; below 20 revisit Days 4–6). State clearly that the marks are indicative and that the tutor gives the final mark. Mark on the quality of reflection and application, never on the content of the learner's personal beliefs or choices. Do not rewrite their work.",
      },
    ],
    portfolio: [
      { exerciseId: "m2-part-a", title: "Part A — Belief analysis (10 marks)", lessonId: "m2-assessment" },
      { exerciseId: "m2-part-b", title: "Part B — Inner voice analysis (10 marks)", lessonId: "m2-assessment" },
      { exerciseId: "m2-part-c", title: "Part C — Operating System case study (10 marks)", lessonId: "m2-assessment" },
      { exerciseId: "m2-part-d", title: "Part D — Response redesign (10 marks)", lessonId: "m2-assessment" },
      { exerciseId: "m2-part-e", title: "Part E — Personal Operating System (10 marks)", lessonId: "m2-assessment" },
      { exerciseId: "m2-completion", title: "Completion reflection (250–500 words)", lessonId: "m2-assessment" },
    ],
  },
];
