const test = require("node:test");
const assert = require("node:assert");
const { buildTeenCourse, COURSES } = require("../src/lib/teensCourses");

const text = (innerHtml) => ({ innerHtml });
const embed = (src) => ({ data: { title: "Embed", properties: { embedCode: `<iframe src="${src}"></iframe>` } } });
const page = (parts) => ({
  title: "Track 1 — AI Foundations",
  webUrl: "https://example.test",
  canvasLayout: { horizontalSections: [{ columns: [{ webparts: parts }] }] },
});

test("teen track: one lesson per sub-lesson, project, then the assessment; no answer key", () => {
  const track = page([
    { data: { title: "Banner" } },
    text("<h2>Track 1 · AI Foundations</h2><p>Before anyone writes a clever prompt, they need to know what they are talking to and why.</p>"),
    text("<h3>1.1&nbsp;&nbsp;A brilliant assistant</h3><p><strong>Goal.</strong> Explain what a model does.</p><pre>Tell me\nabout Abuja</pre>"),
    embed("https://x.test/prompt-lab.html?p=1"),
    text('<h1>Module 2 · Using AI honestly</h1><div class="imagePlugin"><img src="a.png"></div><h3>2.1 The Academy Code</h3><p>Teach. Four rules.</p>'),
    text("<h2>Track 1 Project · AI Myth-Buster</h2><p>Verify one claim an AI told you with two sources.</p>"),
    embed("https://x.test/assessment.html?track=1&amp;e=1"),
    text("<h2>Track 1 · Answer key</h2><p>1. B 2. C</p>"),
  ]);
  const c = buildTeenCourse(COURSES[1], new Map([["Track-1-AI-Foundations.aspx", track]]));
  assert.deepEqual(c.audiences, ["teens"]);
  assert.deepEqual(c.lessons.map((l) => l.title), [
    "1.1 A brilliant assistant",
    "2.1 The Academy Code",
    "Track 1 Project · AI Myth-Buster",
    "Track assessment",
  ]);
  const [first, second, project, assessment] = c.lessons;
  assert.equal(first.objective, "Explain what a model does.");
  assert.doesNotMatch(first.contentBody, /Goal\./);
  assert.match(first.contentBody, /<blockquote><p>Tell me about Abuja<\/p><\/blockquote>/);
  assert.doesNotMatch(second.contentBody, /Module 2|img/);
  assert.equal(project.assessmentUrl, "");
  assert.equal(assessment.assessmentUrl, "https://x.test/assessment.html?track=1&e=1");
  assert.doesNotMatch(JSON.stringify(c), /1\. B 2\. C|Answer key/);
});
