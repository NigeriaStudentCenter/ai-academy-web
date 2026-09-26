const test = require("node:test");
const assert = require("node:assert");
const { parseLessonPage, parsePathwayPage } = require("../src/lib/githubPageParser");

const LESSON = `<html><body>
<header><div class="lbl">AI Academy · Employability</div><h1>Tailor Your CV</h1>
<div class="meta"><span class="chip">Beginner</span><span class="chip">~25 min</span></div></header>
<main class="wrap">
<div class="callout out"><b>What you'll be able to do:</b> match your CV to an advert.</div>
<h2><span class="n">1</span>Upload your CV</h2>
<div class="tool"><h3>ChatGPT</h3><a class="btn" href="https://chatgpt.com">Open</a></div>
<div class="prompt"><button class="copy">Copy</button>Compare my CV to this advert.</div>
<div class="quiz"><details><summary>Q1. What does an ATS do?</summary><p>Filters CVs.</p></details></div>
<div class="assess"><a href="https://forms.office.com/your-form-link">Take the assessment</a></div>
<a href="#top">Back to top</a>
<footer>© BSOE</footer>
</main></body></html>`;

test("lesson page: title, chips, outcome and cleaned body", () => {
  const l = parseLessonPage(LESSON, { lessonId: "lesson-1", lessonOrder: 1 });
  assert.equal(l.title, "Tailor Your CV");
  assert.equal(l.duration, "25 min");
  assert.equal(l.objective, "match your CV to an advert.");
  assert.match(l.contentBody, /<h2>1 · Upload your CV<\/h2>/);
  assert.match(l.contentBody, /<a href="https:\/\/chatgpt.com">Open · ChatGPT<\/a>/);
  assert.match(l.contentBody, /<blockquote><p>Compare my CV to this advert.<\/p><\/blockquote>/);
  assert.match(l.contentBody, /<strong>Q1. What does an ATS do\?<\/strong>/);
  assert.doesNotMatch(l.contentBody, /your-form-link|Copy|footer|© BSOE|class=|#top/);
});

test("pathway page: overview plus one lesson per module, each linking the playlist", () => {
  const html = `<html><head><title>AI for Admins Course — BSOE AI Academy</title></head><body>
  <section class="hero"><p class="hero-copy">Use Copilot at work.</p></section>
  <section class="section" id="why"><div class="section-head"><h2>Why it matters</h2><p>It saves time.</p></div>
    <div class="why-card"><b>Already in your apps</b><p>Copilot is built in.</p></div></section>
  <section class="section" id="curriculum"><details class="stage-track"><summary><div class="stage-title"><b>1 · Copilot prompting</b><span>Draft emails.</span></div></summary>
    <div class="stage-body"><div class="lesson-row"><span class="lesson-title">Draft content</span><span class="lesson-meta"><span class="type-tag">Module</span><span class="duration-tag">39 mins</span></span></div></div></details></section>
  </body></html>`;
  const c = parsePathwayPage(html, { playlistUrl: "https://example.test/p" });
  assert.equal(c.title, "AI for Admins");
  assert.equal(c.description, "Use Copilot at work.");
  assert.deepEqual(c.lessons.map((l) => l.title), ["Course overview", "Module 1 · Copilot prompting"]);
  assert.match(c.lessons[0].contentBody, /Already in your apps/);
  assert.match(c.lessons[1].contentBody, /<strong>Draft content<\/strong> <em>\(Module · 39 mins\)<\/em>/);
  assert.equal(c.lessons[1].resourceUrl, "https://example.test/p");
  assert.equal(c.lessons[1].objective, "Draft emails.");
});
