import assert from "node:assert/strict";
import test from "node:test";
import { buildAssignedPracticeHref, buildRevisionTaskHref } from "./ExamMode";

test("exam plan task links retain the assigned subject, chapter, topic, and return context", () => {
  const href = buildAssignedPracticeHref("Science", "Force", "phy-ch1");
  const url = new URL(href, "https://snapsolve.test");

  assert.equal(url.pathname, "/practice");
  assert.equal(url.searchParams.get("subject"), "Science");
  assert.equal(url.searchParams.get("topic"), "Force");
  assert.equal(url.searchParams.get("chapter"), "phy-ch1");
  assert.equal(url.searchParams.get("returnTo"), "/exam");
  assert.equal(url.searchParams.get("autoScroll"), "1");
});

test("general exam practice still selects its assigned subject without a fake topic", () => {
  const url = new URL(buildAssignedPracticeHref("Mathematics"), "https://snapsolve.test");
  assert.equal(url.searchParams.get("subject"), "Mathematics");
  assert.equal(url.searchParams.has("topic"), false);
});

test("exam revision tasks preserve the exact question ID and return context", () => {
  const url = new URL(buildRevisionTaskHref("bo-bio-9-ch03-con-001"), "https://snapsolve.test");
  assert.equal(url.pathname, "/revision");
  assert.equal(url.searchParams.get("questionId"), "bo-bio-9-ch03-con-001");
  assert.equal(url.searchParams.get("returnTo"), "/exam");
});
