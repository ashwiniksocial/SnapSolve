import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPracticeSolutionHref,
  isPracticeTargetValid,
  resolveAssignedPracticeQuestion,
  resolvePracticeTarget,
} from "./Practice";
import type { Question } from "@/services/questionService";

const chapters = [
  {
    id: "science-1",
    topics: [
      { id: "motion", name: "Motion" },
      { id: "force", name: "Force" },
    ],
  },
  {
    id: "science-2",
    topics: [{ id: "energy", name: "Energy" }],
  },
];

test("Practice resolves an assigned topic to its chapter and topic filter", () => {
  assert.deepEqual(resolvePracticeTarget(chapters, null, "Force"), {
    chapterId: "science-1",
    topicId: "force",
  });
});

test("Practice respects an explicit chapter and accepts saved topic IDs", () => {
  assert.deepEqual(resolvePracticeTarget(chapters, "science-2", "energy"), {
    chapterId: "science-2",
    topicId: "energy",
  });
});

test("an invalid target safely falls back to an accessible chapter without a false topic filter", () => {
  const target = resolvePracticeTarget(chapters, "missing", "missing");
  assert.deepEqual(target, {
    chapterId: "science-1",
    topicId: "all",
  });
  assert.equal(isPracticeTargetValid(chapters, "missing", "missing", target), false);
  assert.equal(isPracticeTargetValid(chapters, "science-2", "force", target), false);
  const validTarget = resolvePracticeTarget(chapters, "science-1", "force");
  assert.equal(isPracticeTargetValid(chapters, "science-1", "force", validTarget), true);
});

test("Practice opens the exact assigned active question when present", () => {
  const questions = [{ id: "force-q1" }, { id: "force-q2" }] as Question[];
  assert.equal(resolveAssignedPracticeQuestion(questions, "force-q2")?.id, "force-q2");
});

test("Practice selects the first valid topic question when a task has no question ID", () => {
  const questions = [{ id: "force-q1" }, { id: "force-q2" }] as Question[];
  assert.equal(resolveAssignedPracticeQuestion(questions)?.id, "force-q1");
});

test("an unavailable assigned question falls back only within the already-filtered task topic", () => {
  const questions = [{ id: "force-q1" }, { id: "force-q2" }] as Question[];
  assert.equal(resolveAssignedPracticeQuestion(questions, "missing-q")?.id, "force-q1");
  assert.equal(resolveAssignedPracticeQuestion([], "missing-q"), undefined);
});

test("only Exam-launched lessons carry a direct Return to Exam target", () => {
  const fromExam = new URL(buildPracticeSolutionHref("math-q1", false, "/exam"), "https://snapsolve.test");
  const normal = new URL(buildPracticeSolutionHref("math-q1", false, null), "https://snapsolve.test");

  assert.equal(fromExam.pathname, "/solution");
  assert.equal(fromExam.searchParams.get("practiceMode"), "1");
  assert.equal(fromExam.searchParams.get("questionId"), "math-q1");
  assert.equal(fromExam.searchParams.get("returnTo"), "/exam");
  assert.equal(normal.searchParams.has("returnTo"), false);
});
