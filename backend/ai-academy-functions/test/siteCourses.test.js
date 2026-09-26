const test = require("node:test");
const assert = require("node:assert");
const { hubSections, lessonFromPage, tidyRte } = require("../src/lib/siteCourses");

const ctrl = (data, inner = "") =>
  `<div data-sp-controldata="${JSON.stringify(data).replace(/"/g, "&quot;")}">${inner}</div>`;
const wp = (data) => `<div data-sp-webpartdata="${JSON.stringify(data).replace(/"/g, "&quot;")}"></div>`;
const card = (headline, page) =>
  wp({
    title: "Editorial card",
    serverProcessedContent: { htmlStrings: { headline: `<h2>${headline}</h2>` }, links: { "callToAction.linkUrl": `/sites/X/SitePages/${page}?csf=1` } },
  });

test("hub sections: named zones are courses; unnamed zones continue them", () => {
  const canvas = [
    ctrl({ position: { zoneIndex: 1 } }, '<div data-sp-rte=""><p>Discover How to Grow Your Business</p></div>'),
    ctrl({ position: { zoneIndex: 2 }, zoneGroupMetadata: { displayName: "Marketing Unplug" } }, card("Introduction", "Intro.aspx")),
    ctrl({ position: { zoneIndex: 3 } }, card("The Triangle", "Triangle.aspx")),
    ctrl({ position: { zoneIndex: 4 }, zoneGroupMetadata: { displayName: "Selling Unplugged" } }, card("5 Steps", "Steps.aspx")),
    ctrl({ position: { zoneIndex: 4 }, zoneGroupMetadata: { displayName: "Selling Unplugged" } }, card("5 Steps again", "Steps.aspx")),
  ].join("");
  const s = hubSections(canvas);
  assert.deepEqual(s.map((x) => [x.name, x.links.map((l) => l.page)]), [
    ["Marketing Unplug", ["Intro.aspx", "Triangle.aspx"]],
    ["Selling Unplugged", ["Steps.aspx"]],
  ]);
});

test("lesson page: text, video, slide images, files and form", () => {
  const canvas = [
    ctrl({}, '<div data-sp-rte=""><h2 class="x">Budgets</h2><p style="a">Plan <a href="https://bsoed.sharepoint.com/sites/X/SitePages/P.aspx">here</a>.</p><img src="/sites/X/SiteAssets/a.png"></div>'),
    ctrl({}, wp({ title: "File and media", serverProcessedContent: { links: { serverRelativeUrl: "/sites/X/Shared%20Documents/Intro.mp4" } } })),
    ctrl({}, wp({ title: "File and Media", serverProcessedContent: { searchablePlainTexts: { title: "Workbook" }, links: { serverRelativeUrl: "/sites/X/Shared%20Documents/Workbook.pdf" } } })),
    ctrl({}, wp({ title: "Image", serverProcessedContent: { imageSources: { imageSource: "/sites/X/SiteAssets/slide1.png" } }, properties: {} })),
    ctrl({}, wp({ title: "Image", serverProcessedContent: { imageSources: { imageSource: "https://cdn.example.com/stock.jpg" } }, properties: {} })),
    ctrl({}, wp({ title: "Microsoft Forms", serverProcessedContent: { links: { formURL: "https://forms.office.com/r/abc" } } })),
  ].join("");
  const l = lessonFromPage({ title: "Budgets", canvas });
  assert.equal(l.videoPath, "/sites/X/Shared Documents/Intro.mp4");
  assert.deepEqual(l.attachments, [{ label: "Workbook", path: "/sites/X/Shared Documents/Workbook.pdf" }]);
  assert.equal(l.assessmentUrl, "https://forms.office.com/r/abc");
  assert.match(l.contentBody, /<h2>Budgets<\/h2>/);
  assert.match(l.contentBody, /Plan here\./); // SharePoint link reduced to its words
  assert.equal((l.contentBody.match(/data-sp-path/g) || []).length, 2); // inline + slide, not the stock image
  assert.doesNotMatch(l.contentBody, /class=|style=|cdn\.example/);
});

test("tidyRte keeps safe external links", () => {
  assert.match(tidyRte('<p><a href="https://example.org" target="_blank">Read</a></p>'), /<a href="https:\/\/example.org">Read<\/a>/);
});

test("trainer kits: facilitation sections, planning tables and trainer lines are removed", () => {
  const { removeTrainerNotes } = require("../src/lib/siteCourses");
  const html = [
    "<p>Welcome to the Stress Management workshop.</p>",
    "<h2>Housekeeping Items</h2><p>Take a few moments to cover basic housekeeping items.</p><ul><li>Use the Icebreakers folder</li></ul>",
    "<h2>The Parking Lot</h2><p>Explain the concept of The Parking Lot to participants.</p><p>Suggestions for the trainer:</p>",
    "<h2>Workshop Objectives</h2><p>At the end of this workshop, you should be able to:</p><ul><li>Accept a situation</li></ul>",
    "<table><tr><td>Estimated Time</td><td>10 minutes</td></tr><tr><td>Topic Objective</td></tr></table>",
    "<h2>Case Study</h2><p>Richard dreaded public speaking, as many participants do.</p>",
    "<h2>Action Plans and Evaluations</h2><p>Do a quick round robin.</p>",
  ].join("");
  const out = removeTrainerNotes(html);
  assert.match(out, /Welcome to the Stress Management workshop/);
  assert.match(out, /<h2>Workshop Objectives<\/h2>/);
  assert.match(out, /<h2>Case Study<\/h2><p>Richard dreaded public speaking, as many learners do\.<\/p>/);
  assert.doesNotMatch(out, /Housekeeping|Parking Lot|trainer|Estimated Time|round robin|Icebreakers/i);
});

test("trainer kits: end-of-course parking lot and icebreaker items go; stories stay", () => {
  const { removeTrainerNotes } = require("../src/lib/siteCourses");
  const out = removeTrainerNotes(
    "<h2>Review of Parking Lot</h2><p>Review the items on the parking lot.</p>" +
      "<h2>Build Trust</h2><ul><li>Use an icebreaker</li><li>Keep promises</li></ul>" +
      "<p>He went out to the parking lot to check Ginny's car.</p>"
  );
  assert.doesNotMatch(out, /Review of Parking Lot|icebreaker/i);
  assert.match(out, /<li>Keep promises<\/li>/);
  assert.match(out, /He went out to the parking lot/);
});
