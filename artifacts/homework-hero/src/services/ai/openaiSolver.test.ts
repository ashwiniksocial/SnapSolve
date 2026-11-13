import assert from "node:assert/strict";
import test from "node:test";
import type { AIResponse, TeachingLesson } from "@/data/solutionBank";
import { QUESTIONS } from "@/data/questions/class9-maths-iemh102";
import { awaitFinalBankLesson } from "./openaiSolver";

const questionId = "c9-math-iemh102-t5-q09";
const question = QUESTIONS.find((entry) => entry.id === questionId)!;
const streamId = `bank-CBSE-9-${questionId}`;

function completeLesson(stepCount: number, answer: string): TeachingLesson {
  return {
    topic: question.topicName,
    difficulty: question.difficulty,
    keyConcepts: ["constant polynomial", "zeros"],
    aiConfidence: 0.95,
    beforeWeStart: {
      motivator: "Start with the value of the constant.",
      anxietyReducer: "We will check two simple cases.",
      preview: "A constant may be zero or non-zero.",
    },
    prerequisites: [],
    vocabulary: [],
    intuition: {
      story: "A constant polynomial always has the same value.",
      visual: "Imagine a flat horizontal line.",
      everyday: "The value does not change when x changes.",
    },
    questionTranslation: {
      plainEnglish: "Explain the zero cases for a constant polynomial.",
      whatWeKnow: "The polynomial has degree zero.",
      whatWeFind: "Whether it has no zeros or all real numbers as zeros.",
      wordToMath: "p(x) = c",
    },
    teacherThinking: {
      firstNotice: "The constant does not depend on x.",
      whyThisMethod: "Check whether the constant is zero.",
      clues: ["degree zero"],
    },
    guidedReasoning: Array.from({ length: stepCount }, (_, index) => ({
      what: `Reasoning step ${index + 1}`,
      why: "This follows from the constant's value.",
      math: "p(x) = c",
      result: "The value is independent of x.",
      pause: "Which case are we considering?",
    })),
    confusionPoints: ["Do not confuse a non-zero constant with the zero polynomial."],
    commonMistakes: [{
      mistake: "Assuming every constant has a zero.",
      whyItHappens: "The variable is mistaken for an input that can change the value.",
      howToAvoid: "Check whether the constant itself equals zero.",
    }],
    examinerThinking: {
      whyAsked: "To test the definition of a zero.",
      conceptTested: "A polynomial's value at a root.",
      topperInsight: "Separate c = 0 from c ≠ 0.",
      examTip: "State both cases.",
      examTrap: "Do not assign a zero to a non-zero constant.",
    },
    finalAnswer: {
      answer,
      whyCorrect: "A non-zero constant never equals zero; the zero polynomial equals zero for every real input.",
      verification: "The two cases cover all constants.",
    },
    simplerExample: {
      problem: "Compare p(x) = 4 and p(x) = 0.",
      solution: "The first has no zeros; every real number is a zero of the second.",
    },
    practiceQuestion: { question: "", hints: [], solution: "" },
    confidenceCheck: {
      question: "How many zeros does the zero polynomial have?",
      options: ["None", "Every real number"],
      correctAnswer: "Every real number",
      explanation: "It evaluates to zero for every real input.",
    },
    retrievalPractice: [],
    rememberThese: ["A non-zero constant has no zero."],
    confidenceBuilder: "You can now distinguish the two constant cases.",
  } as unknown as TeachingLesson;
}

function response(id: string, lesson?: TeachingLesson): AIResponse {
  return {
    id,
    subject: "Mathematics",
    topic: question.topicName,
    difficulty: question.difficulty,
    detectedQuestion: question.question,
    keyConcepts: question.keyConcepts,
    steps: question.steps,
    finalAnswer: question.answer,
    source: "bank",
    ...(lesson ? { lesson } : {}),
  } as unknown as AIResponse;
}

const fallback = response(`bank-${questionId}`);
const partial = response(streamId, {
  ...completeLesson(1, "See the step-by-step reasoning above."),
  keyConcepts: ["constant polynomial"],
  intuition: { story: "", visual: "", everyday: "" },
  commonMistakes: [],
  finalAnswer: { answer: "See guided reasoning above.", whyCorrect: "", verification: "" },
  simplerExample: { problem: "", solution: "" },
});
const finalLesson = response(streamId, completeLesson(5, question.answer));

test("Q59 remains loading through legacy and partial responses, then accepts the final five-step lesson", async () => {
  assert.equal(QUESTIONS.indexOf(question), 58);
  assert.equal(question.steps.length, 3);
  assert.equal(fallback.lesson, undefined);
  assert.equal(partial.lesson?.guidedReasoning.length, 1);
  assert.equal(finalLesson.lesson?.guidedReasoning.length, 5);

  let displayed: AIResponse | null = null;
  let streamCalls = 0;
  const resolved = await awaitFinalBankLesson(async (onPartial) => {
    streamCalls += 1;
    onPartial(fallback);
    assert.equal(displayed, null);
    onPartial(partial);
    assert.equal(displayed, null);
    return finalLesson;
  }).then((lesson) => {
    displayed = lesson;
    return lesson;
  });

  assert.equal(streamCalls, 1);
  assert.equal(displayed, finalLesson);
  assert.equal(resolved.id, streamId);
  assert.equal(resolved.lesson?.finalAnswer.answer, question.answer);
  assert.equal(resolved.lesson?.guidedReasoning.length, 5);
});

test("a final response missing bank completeness markers is rejected", async () => {
  await assert.rejects(
    awaitFinalBankLesson(async (onPartial) => {
      onPartial(partial);
      return partial;
    }),
    /bank_lesson_incomplete/,
  );
});

test("valid lesson completeness does not impose eight reasoning steps", async () => {
  const twoStepLesson = response(streamId, completeLesson(2, question.answer));
  const resolved = await awaitFinalBankLesson(async () => twoStepLesson);
  assert.equal(resolved.lesson?.guidedReasoning.length, 2);
});
