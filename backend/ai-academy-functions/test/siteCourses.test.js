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
