const test = require("node:test");
const assert = require("node:assert");
const { publicTools, buildRun } = require("../src/lib/studentHub");

test("student hub: five tools, prompts stay on the server", () => {
  const tools = publicTools();
  assert.deepEqual(tools.map((t) => t.id), ["research", "scholar", "jobs", "gigs", "accom"]);
  assert.ok(tools.every((t) => !("prompt" in t) && !("tier" in t)));
});

test("student hub: answers are validated and built into the proxy request", () => {
  const { request } = buildRun("scholar", {
    where: "Lagos,\nNigeria",
    level: "Hacker level",
    field: "Nursing",
    cover: "Partial",
  });
  assert.equal(request.tier, "fast");
  assert.equal(request.web, true);
  const text = request.messages[0].content;
  assert.match(text, /location Lagos, Nigeria;/);
  assert.match(text, /level Undergraduate;/); // unknown option → first option
  assert.match(text, /coverage Partial\./);
  assert.match(text, /LINKS: give every source/);
  assert.match(buildRun("scholar", { field: "Law" }).error, /Country/);
  assert.match(buildRun("nope", {}).error, /Unknown tool/);
});

test("student hub: briefs attach as document/image/text blocks and are checked", () => {
  const pdf = Buffer.from("%PDF-1.4 test").toString("base64");
  const { request } = buildRun("research", { topic: "Marketing" }, { name: "brief.pdf", data: pdf });
  const [doc, prompt] = request.messages[0].content;
  assert.equal(doc.type, "document");
  assert.equal(doc.source.media_type, "application/pdf");
  assert.equal(prompt.type, "text");
  assert.match(buildRun("research", { topic: "x" }, { name: "a.exe", data: pdf }).error, /PDF, image/);
  assert.match(buildRun("research", { topic: "x" }, { name: "a.pdf", data: "not base64!" }).error, /could not be read/);
  const txt = buildRun("research", { topic: "x" }, { name: "b.txt", data: Buffer.from("Task 1").toString("base64") });
  assert.match(txt.request.messages[0].content[0].text, /ASSESSMENT BRIEF \(uploaded\): Task 1/);
});
