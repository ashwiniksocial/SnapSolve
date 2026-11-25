import assert from "node:assert/strict";
import test from "node:test";
import {
  assignPracticeQuestionToTask,
  buildAssignedPracticeHref,
  buildChapterTaskId,
  buildRevisionTaskHref,
} from "./ExamMode";
import type { ExamTask } from "@/hooks/useExamMode";
import type { Question } from "@/services/questionService";

function practiceTask(overrides: Partial<ExamTask> = {}): ExamTask {
  return {
    id: "chap-Science-phy-ch1-Force",
    type: "chapter",
    subject: "Science",
    topic: "Force",
    chapter: "Motion",
    chapterId: "phy-ch1",
    label: "Force",
    description: "Practice Force.",
    estimatedMin: 15,
    priority: "medium",
    href: "/practice",
    completedToday: false,
    ...overrides,
  };
}

function question(id: string, topicName: string, chapterId: string): Question {
  return { id, topicName, chapterId } as unknown as Question;
}

test("exam plan task links retain the assigned subject, chapter, topic, and return context", () => {
  const href = buildAssignedPracticeHref("Science", "Force", "phy-ch1", "phy-q1");
  const url = new URL(href, "https://snapsolve.test");

  assert.equal(url.pathname, "/practice");
  assert.equal(url.searchParams.get("subject"), "Science");
  assert.equal(url.searchParams.get("topic"), "Force");
  assert.equal(url.searchParams.get("chapter"), "phy-ch1");
  assert.equal(url.searchParams.get("returnTo"), "/exam");
  assert.equal(url.searchParams.get("questionId"), "phy-q1");
  assert.equal(url.searchParams.get("openQuestion"), "1");
  assert.equal(url.searchParams.has("autoScroll"), false);
});

test("general exam practice still selects its assigned subject without a fake topic", () => {
  const url = new URL(buildAssignedPracticeHref("Mathematics"), "https://snapsolve.test");
  assert.equal(url.searchParams.get("subject"), "Mathematics");
  assert.equal(url.searchParams.has("topic"), false);
  assert.equal(url.searchParams.get("openQuestion"), "1");
});

test("chapter task IDs distinguish identical topic names in different chapters", () => {
  assert.notEqual(
    buildChapterTaskId("Science", "phy-ch1", "Force"),
    buildChapterTaskId("Science", "phy-ch2", "Force"),
  );
});

test("a practice task opens its exact assigned active question", () => {
  const task = practiceTask({ questionId: "force-q2" });
  const result = assignPracticeQuestionToTask(task, [
    question("force-q1", "Force", "phy-ch1"),
    question("force-q2", "Work", "phy-ch1"),
  ]);
  const url = new URL(result.href, "https://snapsolve.test");

  assert.equal(result.questionId, "force-q2");
  assert.equal(result.completedToday, false);
  assert.equal(url.searchParams.get("questionId"), "force-q2");
  assert.equal(url.searchParams.get("openQuestion"), "1");
});

test("a practice task without an assigned question chooses one from its exact chapter topic", () => {
  const result = assignPracticeQuestionToTask(practiceTask(), [
    question("force-other-chapter", "Force", "phy-ch2"),
    question("force-q1", "Force", "phy-ch1"),
    question("motion-q1", "Motion", "phy-ch1"),
  ]);

  assert.equal(result.questionId, "force-q1");
  const url = new URL(result.href, "https://snapsolve.test");
  assert.equal(url.searchParams.get("chapter"), "phy-ch1");
  assert.equal(url.searchParams.get("topic"), "Force");
  assert.equal(url.searchParams.get("questionId"), "force-q1");
});

test("general practice without a topic selects a valid subject question", () => {
  const result = assignPracticeQuestionToTask(
    practiceTask({ topic: "General Practice", chapterId: undefined }),
    [question("math-q1", "Number Systems", "math-ch1")],
  );
  assert.equal(result.questionId, "math-q1");
  assert.match(result.href, /questionId=math-q1/);
});

test("exam revision tasks preserve the exact question ID and return context", () => {
  const url = new URL(buildRevisionTaskHref("bo-bio-9-ch03-con-001"), "https://snapsolve.test");
  assert.equal(url.pathname, "/revision");
  assert.equal(url.searchParams.get("questionId"), "bo-bio-9-ch03-con-001");
  assert.equal(url.searchParams.get("returnTo"), "/exam");
});
