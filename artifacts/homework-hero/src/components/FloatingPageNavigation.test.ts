import assert from "node:assert/strict";
import test from "node:test";
import {
  canTravelHistory,
  isStudentFlow,
  resolveHistoryTargetIndex,
  shouldShowScrollControls,
  type RouteHistory,
} from "./FloatingPageNavigation";

test("student history controls are scoped to the five core flows and their lesson route", () => {
  for (const route of ["/scan", "/practice", "/revision", "/exam", "/progress", "/solution"]) {
    assert.equal(isStudentFlow(route), true, `${route} should have history controls`);
  }
  assert.equal(isStudentFlow("/profile"), false);
  assert.equal(isStudentFlow("/sign-in"), false);
});

test("scroll controls stay independent and appear only on scrollable Practice and Solution pages", () => {
  assert.equal(shouldShowScrollControls("/practice", true), true);
  assert.equal(shouldShowScrollControls("/practice?subject=Math", true), true);
  assert.equal(shouldShowScrollControls("/solution?questionId=q1", true), true);
  assert.equal(shouldShowScrollControls("/practice", false), false);
  assert.equal(shouldShowScrollControls("/revision", true), false);
  assert.equal(shouldShowScrollControls("/exam", true), false);
  assert.equal(shouldShowScrollControls("/progress", true), false);
});

test("history traversal is disabled at boundaries and follows existing entries without pushing loops", () => {
  const history: RouteHistory = {
    entries: [
      { id: 1, href: "/exam", scrollY: 640 },
      { id: 2, href: "/practice?subject=Science&topic=Force", scrollY: 420 },
      { id: 3, href: "/solution?questionId=phy-q1", scrollY: 0 },
    ],
    index: 1,
    nextId: 4,
  };

  assert.equal(canTravelHistory(history, "back"), true);
  assert.equal(canTravelHistory(history, "forward"), true);
  assert.equal(resolveHistoryTargetIndex(history, 1, "/exam"), 0);
  assert.equal(resolveHistoryTargetIndex(history, 3, "/solution?questionId=phy-q1"), 2);
  assert.equal(resolveHistoryTargetIndex(history, 99, "/outside"), -1);

  const first: RouteHistory = { ...history, index: 0 };
  const last: RouteHistory = { ...history, index: 2 };
  assert.equal(canTravelHistory(first, "back"), false);
  assert.equal(canTravelHistory(last, "forward"), false);
});
