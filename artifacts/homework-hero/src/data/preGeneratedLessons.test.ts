import assert from "node:assert/strict";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import encodedChunk from "./generatedLessonChunks/9--Physics--phy-ch4";
import { QUESTIONS } from "./questions/class9-physics-ch4";
import {
  isCompleteDetailedLesson,
  resolveStoredLessonEntry,
  type PreGeneratedLessonChunk,
} from "./preGeneratedLessons";

const chunk = JSON.parse(
  gunzipSync(Buffer.from(encodedChunk, "base64")).toString("utf8"),
) as PreGeneratedLessonChunk;

test("saved Q1-Q3 lessons resolve from the chapter asset without invoking a model", () => {
  for (const [id, expectedSteps] of [
    ["c9-phy-ch4-t6-q01", 6],
    ["c9-phy-ch4-t6-q02", 3],
    ["c9-phy-ch4-t6-q03", 4],
  ] as const) {
    const question = QUESTIONS.find((item) => item.id === id);
    assert.ok(question, `canonical question ${id} exists`);

    const response = resolveStoredLessonEntry(chunk.lessons[id], question);
    assert.ok(response, `${id} resolves from the saved chunk`);
    assert.equal(response.source, "bank");
    assert.equal(response.lesson.guidedReasoning.length, expectedSteps);
    assert.equal(response.detectedQuestion, question.question);
    assert.equal(response.lesson.topic, question.topicName);
    assert.equal(response.lesson.difficulty, question.difficulty);
    assert.equal(response.lesson.finalAnswer.answer, question.answer);
  }
});

test("saved Q4-Q6 lessons resolve completely from the chapter asset without a model call", () => {
  for (const id of [
    "c9-phy-ch4-t6-q04",
    "c9-phy-ch4-t6-q05",
    "c9-phy-ch4-t6-q06",
  ]) {
    const question = QUESTIONS.find((item) => item.id === id);
    assert.ok(question, `canonical question ${id} exists`);

    const response = resolveStoredLessonEntry(chunk.lessons[id], question);
    assert.ok(response, `${id} resolves from the saved chunk`);
    assert.equal(response.source, "bank");
    assert.equal(response.detectedQuestion, question.question);
    assert.equal(response.lesson.topic, question.topicName);
    assert.equal(response.lesson.difficulty, question.difficulty);
    assert.equal(response.lesson.finalAnswer.answer, question.answer);
    assert.ok(isCompleteDetailedLesson(response.lesson));
    assert.ok(response.lesson.guidedReasoning.length > 0);
  }
});

test("saved Q5 verifies effort, mechanical advantage, direction, and misconceptions", () => {
  const question = QUESTIONS.find((item) => item.id === "c9-phy-ch4-t6-q05");
  assert.ok(question, "canonical Q5 exists");
  const response = resolveStoredLessonEntry(chunk.lessons[question.id], question);
  assert.ok(response, "Q5 resolves from the saved chapter chunk");
  assert.equal(response.source, "bank");
  assert.equal(response.lesson.finalAnswer.answer, question.answer);
  assert.equal(response.lesson.guidedReasoning[0].result, "Effort = 150 N");
  assert.match(response.lesson.guidedReasoning[1].math, /150 N ÷ 150 N/);
  assert.match(response.lesson.guidedReasoning[1].result, /mechanical advantage = 1/i);
  assert.match(response.lesson.guidedReasoning[2].why, /change the direction of the effort/i);
  assert.ok(response.lesson.commonMistakes.some((item) => /effort remains the same/i.test(item.whyItHappens)));
  assert.ok(isCompleteDetailedLesson(response.lesson));
});

test("saved MCQ lesson explains the formula and each distractor", () => {
  const lesson = chunk.lessons["c9-phy-ch4-t6-q01"].lesson;
  assert.match(lesson.guidedReasoning[4].why, /reverses the defined ratio/i);
  assert.match(lesson.guidedReasoning[5].why, /N²/);
  assert.match(lesson.guidedReasoning[5].why, /force difference/i);
  for (const choice of ["(a)", "(b)", "(c)", "(d)"]) {
    assert.ok(lesson.finalAnswer.whyCorrect.includes(choice));
  }
});

test("Q2 teaches the general ratio without a machine-specific analogy", () => {
  const lesson = chunk.lessons["c9-phy-ch4-t6-q02"].lesson;
  const intuition = Object.values(lesson.intuition).join(" ");
  assert.doesNotMatch(intuition, /\b(lever|seesaw|ramp|pulley|wheelbarrow)\b/i);
  assert.match(lesson.guidedReasoning[1].math, /180 N ÷ 45 N = 4/);
  assert.match(lesson.guidedReasoning[2].why, /units cancel/i);
  assert.match(lesson.guidedReasoning[2].why, /(?:similar|another) problem/i);
});

test("Q3 distinguishes ideal work balance from friction losses", () => {
  const lesson = chunk.lessons["c9-phy-ch4-t6-q03"].lesson;
  const teaching = [
    ...Object.values(lesson.intuition),
    ...lesson.guidedReasoning.map((step) => `${step.why} ${step.math} ${step.result}`),
    lesson.finalAnswer.whyCorrect,
  ].join(" ");
  assert.doesNotMatch(teaching, /wheelbarrow/i);
  assert.match(teaching, /ideal machine/i);
  assert.match(teaching, /friction/i);
  assert.equal(lesson.finalAnswer.answer, QUESTIONS.find((item) => item.id === "c9-phy-ch4-t6-q03")?.answer);
});
