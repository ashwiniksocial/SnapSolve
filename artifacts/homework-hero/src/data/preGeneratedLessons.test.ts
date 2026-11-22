import assert from "node:assert/strict";
import test from "node:test";
import { gunzipSync } from "node:zlib";
import encodedChunk from "./generatedLessonChunks/9--Physics--phy-ch4";
import { QUESTIONS } from "./questions/class9-physics-ch4";
import {
  getDetailedLessonQualityFlags,
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

test("newly reviewed lesson assets require a passing versioned quality attestation", () => {
  const question = QUESTIONS.find((item) => item.id === "c9-phy-ch4-t6-q05");
  assert.ok(question, "canonical Q5 exists");
  const entry = chunk.lessons[question.id];
  assert.ok(entry, "saved Q5 asset exists");

  assert.equal(resolveStoredLessonEntry({
    ...entry,
    qualityReviewVersion: 1,
    qualityReviewPassed: false,
  }, question), null);
  assert.equal(resolveStoredLessonEntry({
    ...entry,
    qualityReviewPassed: true,
  }, question), null);
  assert.ok(resolveStoredLessonEntry({
    ...entry,
    qualityReviewVersion: 1,
    qualityReviewPassed: true,
  }, question));
});

test("worked-math quality flags apply to quantitative source steps, not factual concepts", () => {
  const quantitativeQuestion = QUESTIONS.find((item) => item.id === "c9-phy-ch4-t6-q05");
  assert.ok(quantitativeQuestion, "canonical quantitative question exists");
  const savedLesson = chunk.lessons[quantitativeQuestion.id].lesson;
  const lessonWithoutWorking = {
    ...savedLesson,
    guidedReasoning: savedLesson.guidedReasoning.map((step) => ({
      ...step,
      math: "",
      result: "",
    })),
  };
  assert.ok(getDetailedLessonQualityFlags(lessonWithoutWorking, quantitativeQuestion).includes("MISSING_WORKED_MATH"));

  const factualQuestion = {
    ...quantitativeQuestion,
    subject: "Chemistry",
    questionType: "MCQ" as const,
    question: "Which description defines a homogeneous mixture?",
    answer: "A mixture that has the same composition throughout.",
    steps: [{
      stepNumber: 1,
      title: "Use the definition",
      explanation: "Compare how the mixture appears in different samples.",
    }],
  };
  assert.ok(!getDetailedLessonQualityFlags(lessonWithoutWorking, factualQuestion).includes("MISSING_WORKED_MATH"));
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
