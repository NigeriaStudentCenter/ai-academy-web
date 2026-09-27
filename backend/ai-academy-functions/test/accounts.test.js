const test = require("node:test");
const assert = require("node:assert/strict");
const accounts = require("../src/lib/accounts");

test("email checks", () => {
  assert.equal(accounts.normaliseEmail("  Jane.Doe@Gmail.com "), "jane.doe@gmail.com");
  assert.equal(accounts.normaliseEmail("not-an-email"), null);
  assert.equal(accounts.normaliseEmail("a@b"), null);
  assert.equal(accounts.normaliseEmail("x<script>@evil.com"), null);
  assert.equal(accounts.isOrganisationEmail("staff@bsoedu.org"), true);
  assert.equal(accounts.isOrganisationEmail("pupil@teenskills.co.uk"), true);
  assert.equal(accounts.isOrganisationEmail("jane@gmail.com"), false);
  assert.equal(accounts.cleanName("Jane <b>\nDoe"), "Jane bDoe");
});
