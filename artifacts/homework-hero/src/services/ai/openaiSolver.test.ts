import assert from "node:assert/strict";
import test from "node:test";
import type { Subject } from "@/data/subjects";
import type { AIResponse, TeachingLesson } from "@/data/solutionBank";
import { QUESTIONS } from "@/data/questions/class9-maths-iemh102";
import { hashQuestionContent, isStoredLessonValid, type PreGeneratedLessonEntry } from "@/data/preGeneratedLessons";
import {
  awaitFinalBankLesson,
  createFrozenBankFallback,
  getBankAnswerIntegrityNotice,
  getBankCachedLesson,
  isValidFrozenBankSolution,
  resolveFrozenBankFallback,
  solveBankWithStream,
  type BankQuestionContext,
} from "./openaiSolver";
import { compareBankAnswers, isBankLessonAnswerSafe } from "@workspace/api-zod/bank-answer-integrity";

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

function bankContext(): BankQuestionContext {
  return {
    questionId,
    sourceHash: hashQuestionContent(question),
    boardId: "CBSE",
    classNum: 9,
    subject: "Mathematics",
    canonicalChapterId: question.canonicalChapterId ?? null,
    academicSession: question.academicSession,
    answer: question.answer,
    hint: question.hint,
    steps: question.steps,
    keyConcepts: question.keyConcepts,
  };
}

function installLocalStorage(seed: Record<string, unknown>) {
  const key = "studyai-bank-lesson-cache-v1";
  const values = new Map([[key, JSON.stringify(seed)]]);
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const storage = {
    getItem: (name: string) => values.get(name) ?? null,
    setItem: (name: string, value: string) => { values.set(name, value); },
    removeItem: (name: string) => { values.delete(name); },
    clear: () => values.clear(),
    key: (index: number) => [...values.keys()][index] ?? null,
    get length() { return values.size; },
  } as Storage;
  Object.defineProperty(globalThis, "localStorage", { configurable: true, value: storage });
  return {
    storage,
    restore: () => {
      if (original) Object.defineProperty(globalThis, "localStorage", original);
      else Reflect.deleteProperty(globalThis, "localStorage");
    },
  };
}

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
  }, question.answer).then((lesson) => {
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
    }, question.answer),
    /bank_lesson_incomplete/,
  );
});

test("valid lesson completeness does not impose eight reasoning steps", async () => {
  const twoStepLesson = response(streamId, completeLesson(2, question.answer));
  const resolved = await awaitFinalBankLesson(async () => twoStepLesson, question.answer);
  assert.equal(resolved.lesson?.guidedReasoning.length, 2);
});

test("canonical answer comparison accepts exact and supported equivalent forms", () => {
  assert.deepEqual(compareBankAnswers("(c) √2", "Option C: \\sqrt{2}"), {
    status: "match",
    method: "choice",
  });
  assert.equal(compareBankAnswers("\\frac{1}{2}", "0.5").status, "match");
  assert.equal(compareBankAnswers("50%", "0.5").status, "match");
  assert.equal(compareBankAnswers("−0.5", "-1/2").status, "match");
  assert.equal(compareBankAnswers("  final answer: 42.  ", "42").status, "match");
});

test("answer comparison distinguishes confirmed mismatches from indeterminate expressions", () => {
  assert.deepEqual(compareBankAnswers("(d) √3", "(c) √2"), {
    status: "mismatch",
    method: "choice",
  });
  assert.equal(compareBankAnswers("2/3", "1/2").status, "mismatch");
  assert.equal(compareBankAnswers("x + x", "2x").status, "indeterminate");
  assert.equal(compareBankAnswers("99 °F", "37 °C").status, "indeterminate");
});

test("bank cached lessons require matching source hash and verified frozen answer", () => {
  const context = bankContext();
  const entry = {
    lesson: finalLesson,
    timestamp: Date.now(),
    sourceHash: context.sourceHash,
  };
  const validStorage = installLocalStorage({ [questionId]: entry });
  try {
    assert.deepEqual(getBankCachedLesson(questionId, context), finalLesson);
  } finally {
    validStorage.restore();
  }

  const staleStorage = installLocalStorage({
    [questionId]: { ...entry, sourceHash: "fnv1a64:0000000000000000" },
  });
  try {
    assert.equal(getBankCachedLesson(questionId, context), null);
    assert.equal(JSON.parse(staleStorage.storage.getItem("studyai-bank-lesson-cache-v1") ?? "{}")[questionId], undefined);
  } finally {
    staleStorage.restore();
  }

  const wrongAnswer = response(streamId, completeLesson(5, "A different answer"));
  const invalidStorage = installLocalStorage({
    [questionId]: { ...entry, lesson: wrongAnswer },
  });
  try {
    assert.equal(getBankCachedLesson(questionId, context), null);
  } finally {
    invalidStorage.restore();
  }
});

test("pre-generated lessons remain valid only for the current source and a verified answer", () => {
  const entry = {
    questionId,
    sourceHash: hashQuestionContent(question),
    lesson: completeLesson(5, question.answer),
  } as PreGeneratedLessonEntry;
  assert.equal(isStoredLessonValid(entry, question), true);
  assert.equal(isStoredLessonValid({ ...entry, sourceHash: "stale" }, question), false);
  assert.equal(
    isStoredLessonValid({
      ...entry,
      lesson: completeLesson(5, "A different answer"),
    }, question),
    false,
  );
});

test("confirmed and indeterminate generated answers are rejected without a retry", async () => {
  for (const [candidate, canonical, expectedCode] of [
    ["2/3", "1/2", "bank_answer_mismatch"],
    ["x + x", "2x", "bank_answer_unverified"],
  ]) {
    let streamCalls = 0;
    await assert.rejects(
      awaitFinalBankLesson(async () => {
        streamCalls += 1;
        return response(streamId, completeLesson(5, candidate));
      }, canonical),
      new RegExp(expectedCode),
    );
    assert.equal(streamCalls, 1);
  }
});

test("safe fallback preserves the frozen answer, question steps, and no generated lesson", () => {
  const fallbackResponse = createFrozenBankFallback(question);
  assert.equal(fallbackResponse.lesson, undefined);
  assert.equal(fallbackResponse.finalAnswer, question.answer);
  assert.deepEqual(fallbackResponse.steps, question.steps);
  assert.match(getBankAnswerIntegrityNotice("bank_answer_mismatch") ?? "", /original question-bank solution/i);
  assert.match(getBankAnswerIntegrityNotice("bank_answer_unverified") ?? "", /could not be verified/i);
  assert.equal(
    getBankAnswerIntegrityNotice("timeout"),
    "The AI lesson could not finish. The original question-bank solution is shown instead.",
  );
  assert.equal(
    getBankAnswerIntegrityNotice("stream_interrupted"),
    "The AI lesson could not finish. The original question-bank solution is shown instead.",
  );
  assert.equal(getBankAnswerIntegrityNotice("stream_incomplete"), null);
  assert.equal(getBankAnswerIntegrityNotice("openai_error"), null);
});

test("recognized bank failures resolve only to a valid frozen bank solution", () => {
  assert.equal(isValidFrozenBankSolution(question), true);
  assert.equal(isValidFrozenBankSolution(undefined), false);
  assert.equal(isValidFrozenBankSolution({ ...question, answer: "" }), false);
  assert.equal(isValidFrozenBankSolution({ ...question, steps: [] }), false);

  for (const code of [
    "bank_answer_mismatch",
    "bank_answer_unverified",
    "timeout",
    "stream_interrupted",
  ]) {
    const fallbackResult = resolveFrozenBankFallback(question, code);
    assert.ok(fallbackResult);
    assert.equal(fallbackResult.notice, getBankAnswerIntegrityNotice(code));
    assert.equal(fallbackResult.response.finalAnswer, question.answer);
    assert.deepEqual(fallbackResult.response.steps, question.steps);
    assert.equal(fallbackResult.response.lesson, undefined);
  }

  assert.equal(
    resolveFrozenBankFallback({ ...question, answer: "" }, "timeout"),
    null,
  );
  assert.equal(resolveFrozenBankFallback(question, "stream_incomplete"), null);
  assert.equal(resolveFrozenBankFallback(question, "bank_lesson_incomplete"), null);
  assert.equal(resolveFrozenBankFallback(question, "openai_error"), null);
});

test("bank timeout and stream interruption neither retry nor write a cached lesson", async () => {
  const localStorageState = installLocalStorage({});
  const originalFetch = globalThis.fetch;

  try {
    for (const code of ["timeout", "stream_interrupted"] as const) {
      let fetchCalls = 0;
      globalThis.fetch = async () => {
        fetchCalls += 1;
        return new Response(
          `data: ${JSON.stringify({ type: "error", code })}\n\n`,
          { status: 200, headers: { "Content-Type": "text/event-stream" } },
        );
      };

      await assert.rejects(
        solveBankWithStream(
          question.subject as Subject,
          question.question,
          bankContext(),
          () => undefined,
        ),
        new RegExp(code),
      );
      assert.equal(fetchCalls, 1);
      assert.deepEqual(
        JSON.parse(localStorageState.storage.getItem("studyai-bank-lesson-cache-v1") ?? "{}"),
        {},
      );
    }
  } finally {
    globalThis.fetch = originalFetch;
    localStorageState.restore();
  }
});

test("HTTP 504 is normalized to the known bank timeout error", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response(
    JSON.stringify({ error: "timeout" }),
    { status: 504, headers: { "Content-Type": "application/json" } },
  );

  try {
    await assert.rejects(
      solveBankWithStream(
        question.subject as Subject,
        question.question,
        bankContext(),
        () => undefined,
      ),
      /^Error: timeout$/,
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("cache answer validity requires both the source revision and a deterministic answer match", () => {
  const sourceHash = hashQuestionContent(question);
  assert.equal(isBankLessonAnswerSafe(question.answer, question.answer, sourceHash, sourceHash), true);
  assert.equal(isBankLessonAnswerSafe(question.answer, question.answer, "stale", sourceHash), false);
  assert.equal(isBankLessonAnswerSafe("x + x", "2x", sourceHash, sourceHash), false);
});
