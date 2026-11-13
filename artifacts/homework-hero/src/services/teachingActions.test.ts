import assert from "node:assert/strict";
import test from "node:test";
import type { AIResponse, TeachingLesson } from "../data/solutionBank";
import {
  cacheSimplifiedResponse,
  createSimplifiedResponse,
  getCachedSimplifiedResponse,
  getSimplifyFailureMessage,
  INITIAL_SIMPLIFY_ACTION_STATE,
  SIMPLIFY_BETA_UI_ENABLED,
  simplifyActionReducer,
  supportsSimplify,
  supportsVisualization,
} from "./teachingActions";

function response({
  id = "question-1",
  answer = "x = 4",
  topAnswer = answer,
  topic = "Linear equations",
  difficulty = "Medium",
  question = "Solve 2x = 8.",
  visual = "Imagine two equal groups of four.",
  lessonTopic = topic,
  lessonSteps = [{
    what: "Solve the equation.",
    why: "The same operation keeps both sides equal.",
    math: "2x = 8",
    result: "x = 4",
    pause: "",
  }],
  prerequisites = [],
}: {
  id?: string;
  answer?: string;
  topAnswer?: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  question?: string;
  visual?: string;
  lessonTopic?: string;
  lessonSteps?: TeachingLesson["guidedReasoning"];
  prerequisites?: string[];
} = {}): AIResponse {
  const lesson = {
    topic: lessonTopic,
    difficulty,
    intuition: { visual },
    prerequisites,
    simplerExample: {
      problem: "What is 2 × 3?",
      solution: "2 × 3 means two groups of three, so the answer is 6.",
    },
    finalAnswer: {
      answer,
      whyCorrect: "Substitute the value into the equation.",
      verification: "2 × 4 = 8.",
    },
    guidedReasoning: lessonSteps,
  } as unknown as TeachingLesson;

  return {
    id,
    subject: "Mathematics",
    topic,
    difficulty,
    detectedQuestion: question,
    keyConcepts: [],
    similarQuestions: [],
    steps: [],
    finalAnswer: topAnswer,
    lesson,
    source: "bank",
  };
}

test("simplified lesson keeps canonical identity and answer without mutating either input", () => {
  const original = response();
  const candidate = response({
    id: "new-ai-id",
    visual: "A changed visual",
  });
  const originalBefore = structuredClone(original);
  const candidateBefore = structuredClone(candidate);

  const simplified = createSimplifiedResponse(original, candidate, "clearer");

  assert.ok(simplified);
  assert.equal(simplified.id, original.id);
  assert.equal(simplified.subject, original.subject);
  assert.equal(simplified.detectedQuestion, original.detectedQuestion);
  assert.equal(simplified.topic, original.topic);
  assert.equal(simplified.difficulty, original.difficulty);
  assert.equal(simplified.finalAnswer, original.finalAnswer);
  assert.equal(simplified.lesson?.topic, original.topic);
  assert.equal(simplified.lesson?.difficulty, original.difficulty);
  assert.equal(simplified.lesson?.finalAnswer.answer, original.lesson?.finalAnswer.answer);
  assert.equal(simplified.lesson?.intuition.visual, candidate.lesson?.intuition.visual);
  assert.notEqual(simplified.lesson, original.lesson);
  assert.deepEqual(original, originalBefore);
  assert.deepEqual(candidate, candidateBefore);
});

test("a Hard proof can be simplified while keeping its exact frozen conclusion", () => {
  const answer = "Therefore, the triangles are congruent by the SSS criterion.";
  const original = response({
    answer,
    topAnswer: answer,
    topic: "Triangle congruence",
    lessonTopic: "Triangle congruence",
    difficulty: "Hard",
    visual: "Compare each of the three corresponding side pairs.",
  });
  const candidate = response({
    answer,
    topAnswer: answer,
    topic: "Triangle congruence",
    lessonTopic: "Triangle congruence",
    difficulty: "Hard",
    visual: "Check the first side pair, then the second, then the third. Since all three match, SSS proves the triangles are congruent.",
  });

  const simplified = createSimplifiedResponse(original, candidate, "clearer");

  assert.ok(simplified);
  assert.equal(simplified.finalAnswer, answer);
  assert.equal(simplified.lesson?.finalAnswer.answer, answer);
  assert.equal(simplified.topic, "Triangle congruence");
  assert.equal(simplified.difficulty, "Hard");
  assert.match(simplified.lesson?.intuition.visual ?? "", /first side pair/);
});

test("unchanged explanations and formatting-only edits are not accepted or cached", () => {
  const original = response();
  assert.equal(createSimplifiedResponse(original, structuredClone(original), "clearer"), null);

  const formattingOnly = response({ visual: "  Imagine   two equal groups of four.\n" });
  assert.equal(createSimplifiedResponse(original, formattingOnly, "clearer"), null);

  cacheSimplifiedResponse(original, "clearer", structuredClone(original));
  assert.equal(getCachedSimplifiedResponse(original, "clearer"), null);

  const changed = response({ visual: "Picture two equal groups, each holding four." });
  assert.ok(createSimplifiedResponse(original, changed, "clearer"));
});

test("simplified lesson is rejected when any answer representation changes", () => {
  const original = response();
  assert.equal(createSimplifiedResponse(original, response({ answer: "x = 5", topAnswer: "x = 5" }), "clearer"), null);
  assert.equal(createSimplifiedResponse(original, response({ topAnswer: "x = 5" }), "clearer"), null);
  assert.equal(
    createSimplifiedResponse(response({ topAnswer: "different" }), response(), "clearer"),
    null,
  );
  assert.equal(createSimplifiedResponse(original, response({ question: "" }), "clearer"), null);
});

test("simplified lesson is rejected when canonical topic or difficulty changes", () => {
  const original = response();
  assert.equal(
    createSimplifiedResponse(original, response({ topic: "Quadratics", lessonTopic: "Quadratics" }), "clearer"),
    null,
  );
  assert.equal(
    createSimplifiedResponse(original, response({ difficulty: "Hard" }), "clearer"),
    null,
  );
  assert.equal(
    createSimplifiedResponse(original, response({ lessonTopic: "Quadratics" }), "clearer"),
    null,
  );
});

test("verified simplification is reused only for the same frozen source and level", () => {
  const entries = new Map<string, string>();
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => entries.get(key) ?? null,
      setItem: (key: string, value: string) => entries.set(key, value),
    },
  });

  try {
    const original = response();
    const candidate = response({ visual: "A saved clearer explanation." });
    const verified = createSimplifiedResponse(original, candidate, "clearer");
    assert.ok(verified);

    cacheSimplifiedResponse(original, "clearer", verified);
    assert.equal(
      getCachedSimplifiedResponse(original, "clearer")?.lesson?.intuition.visual,
      "A saved clearer explanation.",
    );
    assert.equal(getCachedSimplifiedResponse(original, "step_by_step"), null);

    const stepCandidate = structuredClone(original);
    stepCandidate.lesson!.intuition.visual = "A checkpoint-led solution.";
    stepCandidate.lesson!.prerequisites = ["Use equal operations on both sides."];
    stepCandidate.lesson!.guidedReasoning = [
      { what: "Start with 2x = 8.", why: "This is the equation in the question.", math: "2x = 8", result: "We need x.", pause: "What is being multiplied by x?" },
      { what: "Divide both sides by 2.", why: "This keeps the two sides equal and leaves x alone.", math: "2x ÷ 2 = 8 ÷ 2", result: "x = 4", pause: "What is 8 divided by 2?" },
      { what: "Check the answer.", why: "Substitution confirms the equation is true.", math: "2 × 4 = 8", result: "The answer checks.", pause: "Does 4 make the original equation true?" },
    ];
    const verifiedStep = createSimplifiedResponse(original, stepCandidate, "step_by_step");
    assert.ok(verifiedStep);
    cacheSimplifiedResponse(original, "step_by_step", verifiedStep);
    assert.equal(getCachedSimplifiedResponse(original, "step_by_step")?.lesson?.intuition.visual, "A checkpoint-led solution.");

    const changedFrozenSource = structuredClone(original);
    changedFrozenSource.lesson!.finalAnswer.whyCorrect = "Updated source rationale.";
    assert.equal(getCachedSimplifiedResponse(changedFrozenSource, "clearer"), null);
    assert.equal(getCachedSimplifiedResponse(original, "clearer"), null);
  } finally {
    if (previousStorage) {
      Object.defineProperty(globalThis, "localStorage", previousStorage);
    } else {
      delete (globalThis as typeof globalThis & { localStorage?: Storage }).localStorage;
    }
  }
});

test("actions are offered only when their lesson content is supported", () => {
  const supported = response();
  assert.equal(supportsSimplify(supported), true);
  assert.equal(supportsSimplify(response({ question: " " })), false);
  assert.equal(supportsSimplify(response({ topAnswer: "different" })), false);
  assert.equal(supportsVisualization(supported.lesson), true);
  assert.equal(supportsVisualization(response({ visual: "   " }).lesson), false);
  assert.equal(supportsVisualization(undefined), false);

  const partial = { ...supported, lesson: {} as TeachingLesson };
  assert.equal(supportsSimplify(partial), false);
  assert.equal(supportsVisualization(partial.lesson), false);
});

test("initial beta hides Simplify while preserving its underlying eligibility logic", () => {
  assert.equal(SIMPLIFY_BETA_UI_ENABLED, false);
  assert.equal(supportsSimplify(response()), true);
});

test("Class 9 irrational MCQ keeps its question and answer while rejecting cross-level fallbacks", () => {
  const question = "Which of the following is an irrational number? (a) 1/3  (b) √4  (c) √2  (d) 0.25";
  const answer = "(c) √2";
  const original = response({
    question,
    answer,
    topAnswer: answer,
    topic: "Real Numbers and Their Types",
    lessonTopic: "Real Numbers and Their Types",
    difficulty: "Easy",
    visual: "Compare which choices can be written as fractions.",
    lessonSteps: [
      {
        what: "Test each option.",
        why: "Check which choices can be written as a fraction.",
        math: "",
        result: "Only √2 is irrational.",
        pause: "",
      },
      {
        what: "Select the irrational number.",
        why: "√2 cannot be written as a ratio of integers.",
        math: "",
        result: "Answer: (c) √2",
        pause: "",
      },
    ],
  });
  const clearer = response({
    question,
    answer,
    topAnswer: answer,
    topic: "Real Numbers and Their Types",
    lessonTopic: "Real Numbers and Their Types",
    difficulty: "Easy",
    visual: "1/3 and 0.25 are fractions; √4 equals 2. Only √2 cannot be a fraction.",
    lessonSteps: [
      {
        what: "Check which choices can be written as fractions.",
        why: "1/3 and 0.25 are fractions. √4 = 2 is also a fraction.",
        math: "√4 = 2; 0.25 = 1/4",
        result: "Those three choices are rational.",
        pause: "",
      },
      {
        what: "Choose the number that cannot be a fraction.",
        why: "√2 has a decimal that never ends or repeats.",
        math: "√2 ≈ 1.414213…",
        result: "Answer: (c) √2",
        pause: "",
      },
    ],
  });
  const verySimple = structuredClone(original);
  verySimple.lesson!.intuition.visual = "We will check one answer choice at a time.";
  verySimple.lesson!.prerequisites = [
    "A rational number can be written as p/q using integers p and q, where q ≠ 0.",
  ];
  verySimple.lesson!.guidedReasoning = [
    { what: "Recall what rational means.", why: "A rational number can be written as an integer fraction.", math: "p/q, q ≠ 0", result: "Now test each choice.", pause: "What must be true of p and q?" },
    { what: "Check (a), 1/3.", why: "It is already a fraction of two integers.", math: "1/3", result: "Option (a) is rational.", pause: "Is 1/3 already a fraction?" },
    { what: "Check (b), √4.", why: "The square root of 4 is 2, and 2 = 2/1.", math: "√4 = 2 = 2/1", result: "Option (b) is rational.", pause: "What number squared gives 4?" },
    { what: "Check (d), 0.25.", why: "Write it as hundredths, then reduce the fraction.", math: "0.25 = 25/100 = 1/4", result: "Option (d) is rational.", pause: "Can 0.25 be written as a fraction?" },
    { what: "Choose (c), √2.", why: "Its decimal does not end or repeat, so it cannot equal an integer fraction.", math: "√2 ≈ 1.414213…", result: "Answer: (c) √2", pause: "Which choice cannot be written as p/q?" },
  ];

  const clearerResult = createSimplifiedResponse(original, clearer, "clearer");
  const simpleResult = createSimplifiedResponse(original, verySimple, "step_by_step");
  assert.ok(clearerResult);
  assert.ok(simpleResult);
  assert.equal(clearerResult.detectedQuestion, question);
  assert.equal(simpleResult.detectedQuestion, question);
  assert.equal(clearerResult.finalAnswer, answer);
  assert.equal(simpleResult.finalAnswer, answer);
  assert.equal(clearerResult.lesson?.finalAnswer.answer, answer);
  assert.equal(simpleResult.lesson?.finalAnswer.answer, answer);
  assert.equal(createSimplifiedResponse(original, clearer, "step_by_step"), null);
  assert.equal(createSimplifiedResponse(original, verySimple, "clearer"), null);
  assert.equal(createSimplifiedResponse(original, structuredClone(original), "clearer"), null);
  assert.equal(createSimplifiedResponse(original, structuredClone(original), "step_by_step"), null);
});

test("simplify action state supports loading, toggling, failure, and reset", () => {
  const original = response();
  const simplified = response({ visual: "An easier picture." });
  let state = INITIAL_SIMPLIFY_ACTION_STATE;

  state = simplifyActionReducer(state, { type: "start", level: "clearer" });
  assert.equal(state.loading, true);
  assert.equal(simplifyActionReducer(state, { type: "showOriginal" }), state);

  state = simplifyActionReducer(state, {
    type: "success",
    response: simplified,
    level: "clearer",
  });
  assert.equal(state.loading, false);
  assert.equal(state.response, simplified);
  assert.equal(state.selectedLevel, "clearer");
  assert.equal(state.showingSimplified, true);

  state = simplifyActionReducer(state, { type: "showOriginal" });
  assert.equal(state.showingSimplified, false);
  state = simplifyActionReducer(state, { type: "show" });
  assert.equal(state.showingSimplified, true);

  state = simplifyActionReducer(state, { type: "start", level: "step_by_step" });
  assert.equal(state.response, null);
  assert.equal(state.selectedLevel, "step_by_step");
  assert.equal(state.showingSimplified, false);

  const failed = simplifyActionReducer(INITIAL_SIMPLIFY_ACTION_STATE, {
    type: "failure",
    message: "No safe simplified result.",
  });
  assert.equal(failed.loading, false);
  assert.equal(failed.response, null);
  assert.equal(failed.selectedLevel, null);
  assert.equal(failed.showingSimplified, false);
  assert.equal(failed.error, "No safe simplified result.");
  assert.equal(
    getSimplifyFailureMessage(new Error("simplify_unchanged")),
    "The explanation did not change enough to count as a simpler version. Your original lesson is unchanged.",
  );
  assert.equal(
    getSimplifyFailureMessage(new Error("simplify_level_mismatch")),
    "The lesson did not meet the selected explanation style. Your original lesson is unchanged.",
  );
  assert.equal(
    getSimplifyFailureMessage(new Error("backend_503")),
    "A simpler version could not be verified. Your original lesson is unchanged.",
  );
  assert.equal(simplifyActionReducer(state, { type: "reset" }), INITIAL_SIMPLIFY_ACTION_STATE);
  assert.equal(original.finalAnswer, "x = 4");
});
