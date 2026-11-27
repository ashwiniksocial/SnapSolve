import assert from "node:assert/strict";
import test from "node:test";
import {
  BANK_CALCULATION_CONTEXT_INSTRUCTION,
  bankLessonGenerationRecoveryEnabled,
  buildIncompleteLessonRetryInstruction,
  prepareBankLessonGrounding,
} from "./bankLessonPrompt";

test("bank calculation guidance requires conceptual WHY and source-context interpretation", () => {
  assert.match(BANK_CALCULATION_CONTEXT_INSTRUCTION, /why the operation preserves meaning/i);
  assert.match(BANK_CALCULATION_CONTEXT_INSTRUCTION, /same nonzero factor/i);
  assert.match(BANK_CALCULATION_CONTEXT_INSTRUCTION, /actual event and total/i);
  assert.match(BANK_CALCULATION_CONTEXT_INSTRUCTION, /do not invent counts or trials/i);
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

test("MCQ grounding withholds option labels while retaining content and approved reasoning", () => {
  const grounding = prepareBankLessonGrounding(
    "Which example is non-uniform? (a) A car at steady speed (b) A stone dropped from rest (c) A train at steady speed (d) A satellite at fixed speed",
    "(b) A stone dropped from rest",
    [{
      title: "Compare the motion",
      explanation: "(a) has constant speed; (b) speeds up as it falls.",
      result: "Answer: (b) A stone dropped from rest",
    }],
    "MCQ",
  );

  assert.equal(grounding.isMultipleChoice, true);
  assert.doesNotMatch(grounding.question, /\([a-d]\)/i);
  assert.doesNotMatch(grounding.answer, /^\([a-d]\)/i);
  assert.doesNotMatch(grounding.stepsText, /\([a-d]\)/i);
  assert.doesNotMatch(grounding.stepsText, /\banswer\s*:/i);
  assert.match(grounding.question, /A stone dropped from rest/);
  assert.match(grounding.answer, /A stone dropped from rest/);
  assert.match(grounding.stepsText, /speeds up as it falls/);
});

test("non-MCQ bank grounding remains unchanged", () => {
  const question = "Add 1/3 and 1/2.";
  const answer = "5/6";
  const steps = [{ title: "Find a common denominator", explanation: "Use sixths." }];
  assert.deepEqual(prepareBankLessonGrounding(question, answer, steps), {
    question,
    answer,
    isMultipleChoice: false,
    stepsText: "Step 1 — Find a common denominator:\nUse sixths.",
  });
});

test("labeled multipart questions are not anonymized when their bank type is not MCQ", () => {
  const question = "Solve each part: (a) find x, (b) find y, and (c) state the ordered pair.";
  const grounding = prepareBankLessonGrounding(
    question,
    "(a) x=2, (b) y=3, (c) (2,3)",
    [{ title: "Solve", explanation: "Keep each part linked to its label." }],
    "HOTS",
  );
  assert.equal(grounding.isMultipleChoice, false);
  assert.equal(grounding.question, question);
  assert.equal(grounding.answer, "(a) x=2, (b) y=3, (c) (2,3)");
});
