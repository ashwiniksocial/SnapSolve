import assert from "node:assert/strict";
import test from "node:test";
import {
  BANK_LESSON_TEACHING_CONTRACT,
  bankLessonGenerationRecoveryEnabled,
  buildIncompleteLessonRetryInstruction,
} from "./bankLessonPrompt";

test("bank lessons use grounded, weak-student teaching without fixed step counts", () => {
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /no preset number of guidedReasoning steps/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /weak Grade 9 student/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /approved bank steps/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /only in finalAnswer/i);
});

test("bank visual instruction satisfies the existing nonempty intuition gate without inventing facts", () => {
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /Overrides .*blank-visual guidance/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /intuition\.visual meaningful and nonempty/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /accurate\s+abstract representation/i);
  assert.match(BANK_LESSON_TEACHING_CONTRACT, /Do not invent story facts/i);
});

test("incomplete recovery names missing sections and preserves the existing safeguards", () => {
  const instruction = buildIncompleteLessonRetryInstruction([
    "guidedReasoning[0].why",
    "simplerExample.solution",
  ]);
  assert.match(instruction, /guidedReasoning\[0\]\.why, simplerExample\.solution/);
  assert.match(instruction, /full Detailed JSON/i);
  assert.match(instruction, /frozen answer/i);
  assert.match(instruction, /answer-last rule/i);
});

test("single-attempt bank requests disable draft recovery but preserve default recovery", () => {
  assert.equal(bankLessonGenerationRecoveryEnabled(1), false);
  assert.equal(bankLessonGenerationRecoveryEnabled(2), true);
  assert.equal(bankLessonGenerationRecoveryEnabled(undefined), true);
});
