import assert from "node:assert/strict";
import test from "node:test";
import { applyDailyCompletion } from "./useStreak";

test("a practice completion records the day and extends a consecutive streak once", () => {
  const previous = {
    streak: 4,
    lastCompletedDate: "2026-08-19",
    completedDates: ["2026-08-18", "2026-08-19"],
  };
  const completed = applyDailyCompletion(previous, "2026-08-20", "2026-08-19");

  assert.equal(completed.streak, 5);
  assert.equal(completed.lastCompletedDate, "2026-08-20");
  assert.deepEqual(completed.completedDates, ["2026-08-18", "2026-08-19", "2026-08-20"]);
  assert.equal(applyDailyCompletion(completed, "2026-08-20", "2026-08-19"), completed);
});

test("practice after a missed day restarts the streak without deleting history", () => {
  const previous = {
    streak: 4,
    lastCompletedDate: "2026-08-17",
    completedDates: ["2026-08-16", "2026-08-17"],
  };
  const completed = applyDailyCompletion(previous, "2026-08-20", "2026-08-19");

  assert.equal(completed.streak, 1);
  assert.deepEqual(completed.completedDates, ["2026-08-16", "2026-08-17", "2026-08-20"]);
});
