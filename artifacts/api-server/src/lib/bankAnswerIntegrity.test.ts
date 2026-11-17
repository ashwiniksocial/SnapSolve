import assert from "node:assert/strict";
import test from "node:test";
import {
  compareBankAnswers,
  isBankLessonAnswerSafe,
} from "@workspace/api-zod/bank-answer-integrity";

test("exact and supported equivalent frozen-answer representations match", () => {
  assert.equal(compareBankAnswers("(c) √2", "Option C: \\sqrt{2}").status, "match");
  assert.equal(compareBankAnswers("\\frac{1}{2}", "0.5").status, "match");
  assert.equal(compareBankAnswers("50%", "0.5").status, "match");
  assert.equal(compareBankAnswers("−0.5", "-1/2").status, "match");
  assert.equal(compareBankAnswers("answer is: 42.", "42").status, "match");
});

test("confirmed answer differences are rejected while unsupported algebra is indeterminate", () => {
  assert.deepEqual(compareBankAnswers("(d) √3", "(c) √2"), {
    status: "mismatch",
    method: "choice",
  });
  assert.equal(compareBankAnswers("2/3", "1/2").status, "mismatch");
  assert.equal(compareBankAnswers("x+x", "2x").status, "indeterminate");
  assert.equal(compareBankAnswers("99 °F", "37 °C").status, "indeterminate");
});

test("cached answer safety requires the matching source hash and a verified answer", () => {
  assert.equal(isBankLessonAnswerSafe("42", "42", "source-a", "source-a"), true);
  assert.equal(isBankLessonAnswerSafe("42", "42", "source-old", "source-a"), false);
  assert.equal(isBankLessonAnswerSafe("41", "42", "source-a", "source-a"), false);
  assert.equal(isBankLessonAnswerSafe("x+x", "2x", "source-a", "source-a"), false);
});
