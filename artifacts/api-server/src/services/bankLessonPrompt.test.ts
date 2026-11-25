import assert from "node:assert/strict";
import test from "node:test";
import {
  bankLessonGenerationRecoveryEnabled,
  buildIncompleteLessonRetryInstruction,
} from "./bankLessonPrompt";

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
