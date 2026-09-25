const { app } = require("@azure/functions");

app.http("getCourse", {
  methods: ["GET"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    const courseId = request.query.get("courseId") || "ai-foundations";

    if (courseId !== "ai-foundations") {
      return {
        status: 404,
        jsonBody: {
          message: "Course not found.",
          courseId,
        },
      };
    }

    const course = {
      courseId: "ai-foundations",
      title: "AI Foundations for Everyday Learning",
      description:
        "A short introduction to artificial intelligence, everyday use, responsible use, and prompting basics.",
      level: "Beginner",
      estimatedDuration: "15–20 minutes",
      lessonCount: 5,
      certificateEligible: true,
      status: "Published",
      thumbnailLink: "",
      version: "1.0",
      lessons: [
        {
          lessonId: "what-is-ai",
          title: "What is AI?",
          lessonOrder: 1,
          duration: "3 minutes",
          objective: "Help the learner understand AI in simple language.",
          contentBody: `
            <h2>What is AI?</h2>

            <p>Artificial intelligence, or AI, is when machines or computer systems are designed to do tasks that usually need human thinking.</p>

            <p>AI can help with things like:</p>

            <ul>
              <li>understanding speech</li>
              <li>answering questions</li>
              <li>recognising images</li>
              <li>recommending videos or music</li>
              <li>helping people learn faster</li>
            </ul>

            <p>AI is not magic.</p>
            <p>AI is not a human mind.</p>
            <p>AI is a tool that works with data and patterns.</p>

            <p>This means AI can be useful, but it can also make mistakes.</p>

            <p><strong>Key idea:</strong> AI is a helper, not a replacement for human thinking.</p>

            <p>For example:</p>

            <ul>
              <li>A calculator helps with numbers</li>
              <li>A map app helps with directions</li>
              <li>An AI tool can help explain ideas, summarise information, or generate suggestions</li>
            </ul>

            <p>But people still need judgement.</p>

            <p><strong>Reflection question:</strong> What is one task you think AI could help with in everyday learning?</p>
          `,
          completionType: "button",
          videoAssetId: "",
          imageAssetId: "",
          workbookAssetId: "",
          reflectionQuestion:
            "What is one task you think AI could help with in everyday learning?",
          published: true,
        },
        {
          lessonId: "ai-in-everyday-life",
          title: "Where do we see AI in everyday life?",
          lessonOrder: 2,
          duration: "3 minutes",
          objective: "Help the learner recognise how common AI already is.",
          contentBody: `
            <h2>Where do we see AI in everyday life?</h2>

            <p>Many people use AI every day without even noticing it.</p>

            <p>Here are some examples:</p>

            <h3>On your phone</h3>
            <ul>
              <li>voice assistants</li>
              <li>predictive typing</li>
              <li>face recognition</li>
              <li>photo sorting</li>
            </ul>

            <h3>On the internet</h3>
            <ul>
              <li>video recommendations</li>
              <li>music suggestions</li>
              <li>online shopping suggestions</li>
              <li>search results</li>
            </ul>

            <h3>In school or learning</h3>
            <ul>
              <li>translation tools</li>
              <li>spelling and grammar support</li>
              <li>learning assistants</li>
              <li>revision question generators</li>
            </ul>

            <h3>In maps and travel</h3>
            <ul>
              <li>route suggestions</li>
              <li>traffic prediction</li>
              <li>estimated arrival times</li>
            </ul>

            <p>AI works in many of these tools by looking at patterns and making predictions.</p>

            <p>For example:</p>
            <ul>
              <li>if you often search for science videos, AI may recommend more science content</li>
              <li>if many drivers are slowing down on one road, AI may suggest a faster route</li>
            </ul>

            <p><strong>Key idea:</strong> AI is already around us, often quietly helping with recommendations, search, communication, and learning.</p>

            <p><strong>Reflection question:</strong> Which AI example do you use most often in your normal day?</p>
          `,
          completionType: "button",
          videoAssetId: "",
          imageAssetId: "",
          workbookAssetId: "",
          reflectionQuestion:
            "Which AI example do you use most often in your normal day?",
          published: true,
        },
        {
          lessonId: "risks-and-responsible-use",
          title: "Risks and responsible use of AI",
          lessonOrder: 3,
          duration: "4 minutes",
          objective:
            "Help the learner understand that AI should be used carefully and responsibly.",
          contentBody: `
            <h2>Risks and responsible use of AI</h2>

            <p>AI can be useful, but it is not always correct.</p>

            <p>That means responsible use is very important.</p>

            <h3>1. Check facts</h3>
            <p>AI can sound confident even when it is wrong.</p>

            <p>So when the topic matters, always check:</p>
            <ul>
              <li>names</li>
              <li>dates</li>
              <li>definitions</li>
              <li>calculations</li>
              <li>important claims</li>
            </ul>

            <h3>2. Protect personal information</h3>
            <p>Do not share private information carelessly with AI tools.</p>

            <p>Be careful with:</p>
            <ul>
              <li>passwords</li>
              <li>bank details</li>
              <li>personal addresses</li>
              <li>exam papers</li>
              <li>private school records</li>
            </ul>

            <h3>3. Think critically</h3>
            <p>Do not accept every answer immediately.</p>

            <p>Ask:</p>
            <ul>
              <li>Does this make sense?</li>
              <li>Is this complete?</li>
              <li>Is this fair?</li>
              <li>Is this safe?</li>
            </ul>

            <h3>4. Use AI to support learning, not replace it</h3>
            <p>AI should help you:</p>

            <ul>
              <li>understand</li>
              <li>practise</li>
              <li>review</li>
              <li>organise</li>
            </ul>

            <p>It should not replace your own:</p>

            <ul>
              <li>thinking</li>
              <li>reflection</li>
              <li>effort</li>
            </ul>

            <p><strong>Key idea:</strong> AI is helpful, but learners must still think carefully, protect privacy, and verify important information.</p>

            <p><strong>Reflection question:</strong> Why is it risky to trust AI without checking it?</p>
          `,
          completionType: "button",
          videoAssetId: "",
          imageAssetId: "",
          workbookAssetId: "",
          reflectionQuestion:
            "Why is it risky to trust AI without checking it?",
          published: true,
        },
        {
          lessonId: "how-to-prompt-ai",
          title: "How to ask AI better questions",
          lessonOrder: 4,
          duration: "4 minutes",
          objective: "Teach the learner how to write better prompts.",
          contentBody: `
            <h2>How to ask AI better questions</h2>

            <p>A prompt is the instruction or question you give to an AI tool.</p>

            <p>Better prompts usually lead to better answers.</p>

            <p>A weak prompt is often:</p>
            <ul>
              <li>too short</li>
              <li>too vague</li>
              <li>missing context</li>
            </ul>

            <p><strong>Weak prompt:</strong> Tell me about energy</p>

            <p>That is too broad.</p>

            <p><strong>Better prompt:</strong> Explain renewable energy for a 13-year-old in 5 bullet points and give one real-world example.</p>

            <p>Why is that better?</p>

            <p>Because it tells the AI:</p>
            <ul>
              <li>the topic</li>
              <li>the audience</li>
              <li>the format</li>
              <li>the depth</li>
              <li>the kind of example needed</li>
            </ul>

            <h3>Simple prompting formula</h3>

            <ul>
              <li>Say what you want</li>
              <li>Give context</li>
              <li>Ask clearly</li>
              <li>Request format</li>
            </ul>

            <p>Examples:</p>

            <ul>
              <li>Summarise climate change in simple English using 6 short bullet points.</li>
              <li>Create 5 quiz questions about photosynthesis for a beginner science student.</li>
              <li>Explain inflation like I am 14 years old and compare it with rising food prices.</li>
            </ul>

            <p><strong>Key idea:</strong> Good prompts are clear, specific, and structured.</p>

            <p><strong>Reflection question:</strong> What are the 4 parts of a better prompt?</p>
          `,
          completionType: "button",
          videoAssetId: "",
          imageAssetId: "",
          workbookAssetId: "",
          reflectionQuestion: "What are the 4 parts of a better prompt?",
          published: true,
        },
        {
          lessonId: "first-learning-prompt",
          title: "Mini activity: Write your first learning prompt",
          lessonOrder: 5,
          duration: "5 minutes",
          objective:
            "Let the learner practise using AI in a simple, structured way.",
          contentBody: `
            <h2>Mini activity: Write your first learning prompt</h2>

            <p>Now you will create your own learning prompt.</p>

            <p>A good prompt should:</p>

            <ul>
              <li>say the topic</li>
              <li>say the level</li>
              <li>say the format</li>
              <li>ask for something useful</li>
            </ul>

            <p>Here are examples:</p>

            <p><strong>Example prompt 1:</strong><br>
            Explain photosynthesis in simple English for a beginner and give one real-life example.</p>

            <p><strong>Example prompt 2:</strong><br>
            Create 5 revision questions on the water cycle for a 12-year-old learner.</p>

            <p><strong>Example prompt 3:</strong><br>
            Summarise the causes of climate change in 4 short bullet points with simple vocabulary.</p>

            <p>Now think of one prompt you could use for your own learning.</p>

            <p>You can use this structure:</p>

            <ul>
              <li>Explain __________ for a beginner in simple English and give __________.</li>
              <li>Create __________ questions about __________ for __________.</li>
              <li>Summarise __________ in __________ bullet points with __________.</li>
            </ul>

            <p>This activity shows that AI tools become more useful when the learner gives clearer instructions.</p>

            <p><strong>Key idea:</strong> Using AI well is not only about the tool. It is also about the quality of the question.</p>

          `,
          completionType: "button",
          videoAssetId: "",
          imageAssetId: "",
          workbookAssetId: "",
          reflectionQuestion:
            "What is one prompt you could use for your own learning?",
          published: true,
        },
      ],
    };

    return {
      status: 200,
      jsonBody: course,
    };
  },
});
