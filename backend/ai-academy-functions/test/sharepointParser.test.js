// Run: node --test test/
const test = require("node:test");
const assert = require("node:assert");
const { parseCoursePage } = require("../src/lib/sharepointParser");

const BANNER = "cbe7b0a9-3504-44dd-a3a3-0e5cacd07788";
const MARKDOWN = "1ef5ed11-ce7b-44be-bc5e-4abd55101d16";
const banner = (title) => ({ webPartType: BANNER, data: { properties: { title } } });
const text = (innerHtml) => ({ "@odata.type": "#microsoft.graph.textWebPart", innerHtml });
const markdown = (html) => ({
  webPartType: MARKDOWN,
  data: { serverProcessedContent: { htmlStrings: [{ key: "html", value: html }] } },
});
const section = (...webparts) => ({ columns: [{ webparts }] });

// Trimmed from the live "ChatGPT Masterclass" page (Graph canvasLayout shape).
const page = {
  id: "37ae4cfe-4992-470a-a320-61d1918dae50",
  name: "ChatGPT-Masterclass.aspx",
  title: "ChatGPT Masterclass",
  webUrl: "https://bsoed.sharepoint.com/sites/AIAcademy/SitePages/ChatGPT-Masterclass.aspx",
  lastModifiedDateTime: "2026-09-01T12:27:30Z",
  canvasLayout: {
    horizontalSections: [
      section(banner("ChatGPT Masterclass")),
      section(
        text(
          "<p>𝗙𝗥𝗢𝗠 𝗖𝗢𝗡𝗙𝗜𝗗𝗘𝗡𝗧 𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥 𝗧𝗢 𝗖𝗨𝗦𝗧𝗢𝗠 𝗔𝗜 𝗪𝗢𝗥𝗞𝗙𝗟𝗢𝗪 𝗕𝗨𝗜𝗟𝗗𝗘𝗥<br>&nbsp;<br>𝟭𝟬 𝗛𝗢𝗨𝗥𝗦 &nbsp;• &nbsp;𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥 → 𝗔𝗗𝗩𝗔𝗡𝗖𝗘𝗗 &nbsp;• &nbsp;𝟴 𝗣𝗥𝗔𝗖𝗧𝗜𝗖𝗔𝗟 𝗠𝗢𝗗𝗨𝗟𝗘𝗦<br>&nbsp;<br>Learn to navigate ChatGPT, write reliable prompts and design governed specialised GPTs.<br>COURSE OUTCOME<br>By the end, you will be able to turn a workplace need into a structured ChatGPT workflow.<br>INTERFACE NOTE<br>ChatGPT changes regularly.</p>"
        ),
        markdown(
          '<p></p><div class="ms-Image x"><img alt="ChatGPT Masterclass feature overview" src="/sites/AIAcademy/Shared%20Documents/ChatGPT%20Course%20Images/chatgpt-hero.png" class="fui-Image"></div><p></p><p><em>Course illustration.</em></p>'
        ),
        banner("MODULE 1 · FIND YOUR WAY AROUND CHATGPT"),
        text(
          "<p>𝟲𝟬 𝗠𝗜𝗡𝗨𝗧𝗘𝗦 · 𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥<br>&nbsp;<br>Learning objectives<br>Identify the main ChatGPT interface areas.<br>Interface walkthrough<br>• Sidebar: recent chats, Projects and available workspaces.<br>• Prompt composer: instructions, attachments and tools.<br>Knowledge check<br>When should you start a new chat?</p>"
        )
      ),
      section(
        banner("MODULE 2 · WRITE PROMPTS THAT PRODUCE USEFUL WORK"),
        text(
          "<p>𝟲𝟬 𝗠𝗜𝗡𝗨𝗧𝗘𝗦 · 𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥 → 𝗜𝗡𝗧𝗘𝗥𝗠𝗘𝗗𝗜𝗔𝗧𝗘<br>&nbsp;<br>The CLEAR prompt framework<br>C — Context: explain the situation and audience.<br>Recommended structure<br>1. Define the Project outcome.<br>2. Add concise working instructions.</p>"
        ),
        markdown(
          '<h4 id="projects-feature">Projects feature</h4><div class="ms-Image"><img alt="Projects" src="/sites/AIAcademy/Shared%20Documents/ChatGPT%20Course%20Images/chatgpt-projects.png"></div>'
        )
      ),
    ],
  },
};

const course = parseCoursePage(page, {
  audiences: ["teens", "professional"],
  rewriteImage: (src) => `https://api.example/courseImage?path=${encodeURIComponent(src)}`,
});

test("course metadata comes from the title area and intro", () => {
  assert.equal(course.courseId, "chatgpt-masterclass");
  assert.equal(course.title, "ChatGPT Masterclass");
  assert.equal(course.estimatedDuration, "10 hours");
  assert.equal(course.level, "Beginner → Advanced");
  assert.match(course.description, /^Learn to navigate ChatGPT/);
  assert.match(course.outcome, /^By the end/);
  assert.equal(course.lessonCount, 2);
  assert.match(course.heroHtml, /courseImage\?path=/);
});

test("each MODULE banner becomes a lesson", () => {
  const [m1, m2] = course.lessons;
  assert.equal(m1.lessonId, "module-1");
  assert.equal(m1.title, "Find your way around ChatGPT");
  assert.equal(m1.duration, "60 minutes");
  assert.equal(m1.objective, "Identify the main ChatGPT interface areas.");
  assert.equal(m1.reflectionQuestion, "When should you start a new chat?");
  assert.match(m1.contentBody, /<h3>Interface walkthrough<\/h3>/);
  assert.match(m1.contentBody, /<ul>\s*<li>Sidebar:/);
  assert.equal(m2.lessonOrder, 2);
  assert.match(m2.contentBody, /<p>C — Context: explain/);
  assert.match(m2.contentBody, /<ol>\s*<li>Define the Project outcome\.<\/li>/);
  assert.match(m2.contentBody, /<h3>Projects feature<\/h3>/);
  assert.match(m2.contentBody, /<img alt="Projects" src="https:\/\/api\.example\/courseImage/);
  assert.doesNotMatch(m2.contentBody, /class="/);
});

test("sentence case keeps brand names", () => {
  const { sentenceCase } = require("../src/lib/sharepointParser");
  assert.equal(sentenceCase("BUILD AND GOVERN A SPECIALISED GPT"), "Build and govern a specialised GPT");
  assert.equal(sentenceCase("NOTEBOOKLM FOUNDATIONS AND INTERFACE"), "NotebookLM foundations and interface");
  assert.equal(sentenceCase("SEARCH, RESEARCH AND VERIFY INFORMATION"), "Search, research and verify information");
});

test("objective and checkpoint headings vary between courses", () => {
  const runwayLike = {
    id: "x", name: "Runway-ML-Masterclass.aspx", title: "Runway ML Masterclass",
    canvasLayout: { horizontalSections: [section(
      banner("MODULE 1 · FOUNDATIONS, WORKSPACE AND MODEL DECISIONS"),
      text("<p>𝟰𝟱 𝗠𝗜𝗡𝗨𝗧𝗘𝗦 · 𝗕𝗘𝗚𝗜𝗡𝗡𝗘𝗥<br>LEARNING GOALS<br>Explain the modern Runway production environment.<br>WHAT RUNWAY DOES<br>Runway combines generative image and video creation.<br>CHECPOINT<br>Which Runway path fits a product teaser?</p>")
    )] },
  };
  const c = parseCoursePage(runwayLike, { audiences: ["professional"] });
  const [m1] = c.lessons;
  assert.equal(m1.duration, "45 minutes");
  assert.equal(m1.objective, "Explain the modern Runway production environment.");
  assert.equal(m1.reflectionQuestion, "Which Runway path fits a product teaser?");
  assert.match(m1.contentBody, /<h3>What Runway does<\/h3>/);
  assert.match(m1.contentBody, /<h3>Learning goals<\/h3>/);
});
