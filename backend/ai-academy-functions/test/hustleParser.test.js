const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const path = require("node:path");
const { parseHustlePage } = require("../src/lib/hustleParser");

const html = fs.readFileSync(path.join(__dirname, "fixtures/Hustle01_ContentCreation.html"), "utf8");
const course = parseHustlePage(html, { fileName: "Hustle01_ContentCreation.html", audiences: ["professional"] });

test("hustle page becomes a 13-lesson course", () => {
  assert.equal(course.courseId, "hustle-1");
  assert.equal(course.title, "Hustle 1: AI-Assisted Content Creation");
  assert.match(course.description, /^From idea to published content/);
  assert.equal(course.lessons.length, 13);
  assert.equal(course.lessons[1].title, "Find Your Content Niche With AI");
  assert.equal(course.lessons[12].lessonId, "final-project");
});

test("lesson keeps its six-part structure without interactive chrome", () => {
  const body = course.lessons[1].contentBody;
  for (const part of ["Explanation", "AI Tools", "Practical Exercise", "Real Deliverable", "Customer", "Monetisation"]) {
    assert.match(body, new RegExp(`<h3>${part}</h3>`));
  }
  assert.match(body, /^<p><em>The Niche Formula<\/em><\/p>/);
  assert.match(body, /<blockquote><p>Act as a content-strategy consultant/);
  assert.match(body, /ChatGPT · Gemini · Copilot · Claude · Perplexity/);
  assert.doesNotMatch(body, /<button|<input|class="|>Copy</);
});

test("final project gathers the closing sections", () => {
  const body = course.lessons[12].contentBody;
  assert.match(body, /<h3>Don't Do This<\/h3>/);
  assert.match(body, /<h3>The AI Business Coach<\/h3>/);
  assert.match(body, /<h3>Build Your First AI Content Hustle<\/h3>/);
});
