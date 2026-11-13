import assert from "node:assert/strict";
import test from "node:test";
import type { AIResponse, TeachingLesson } from "../data/solutionBank";
import {
  cacheSimplifiedResponse,
  createSimplifiedResponse,
  getCachedSimplifiedResponse,
  getSimplifyFailureMessage,
  INITIAL_SIMPLIFY_ACTION_STATE,
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
}: {
  id?: string;
  answer?: string;
  topAnswer?: string;
  topic?: string;
  difficulty?: "Easy" | "Medium" | "Hard";
  question?: string;
  visual?: string;
  lessonTopic?: string;
} = {}): AIResponse {
  const lesson = {
    topic: lessonTopic,
    difficulty,
    intuition: { visual },
    finalAnswer: {
      answer,
      whyCorrect: "Substitute the value into the equation.",
      verification: "2 × 4 = 8.",
    },
    guidedReasoning: [],
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

  const simplified = createSimplifiedResponse(original, candidate);

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

  const simplified = createSimplifiedResponse(original, candidate);

  assert.ok(simplified);
  assert.equal(simplified.finalAnswer, answer);
  assert.equal(simplified.lesson?.finalAnswer.answer, answer);
  assert.equal(simplified.topic, "Triangle congruence");
  assert.equal(simplified.difficulty, "Hard");
  assert.match(simplified.lesson?.intuition.visual ?? "", /first side pair/);
});

test("unchanged explanations and formatting-only edits are not accepted or cached", () => {
  const original = response();
  assert.equal(createSimplifiedResponse(original, structuredClone(original)), null);

  const formattingOnly = response({ visual: "  Imagine   two equal groups of four.\n" });
  assert.equal(createSimplifiedResponse(original, formattingOnly), null);

  cacheSimplifiedResponse(original, "clearer", structuredClone(original));
  assert.equal(getCachedSimplifiedResponse(original, "clearer"), null);

  const changed = response({ visual: "Picture two equal groups, each holding four." });
  assert.ok(createSimplifiedResponse(original, changed));
});

test("simplified lesson is rejected when any answer representation changes", () => {
  const original = response();
  assert.equal(createSimplifiedResponse(original, response({ answer: "x = 5", topAnswer: "x = 5" })), null);
  assert.equal(createSimplifiedResponse(original, response({ topAnswer: "x = 5" })), null);
  assert.equal(
    createSimplifiedResponse(response({ topAnswer: "different" }), response()),
    null,
  );
  assert.equal(createSimplifiedResponse(original, response({ question: "" })), null);
});

test("simplified lesson is rejected when canonical topic or difficulty changes", () => {
  const original = response();
  assert.equal(
    createSimplifiedResponse(original, response({ topic: "Quadratics", lessonTopic: "Quadratics" })),
    null,
  );
  assert.equal(
    createSimplifiedResponse(original, response({ difficulty: "Hard" })),
    null,
  );
  assert.equal(
    createSimplifiedResponse(original, response({ lessonTopic: "Quadratics" })),
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
    const candidate = response({ visual: "A saved simpler explanation." });
    const verified = createSimplifiedResponse(original, candidate);
    assert.ok(verified);

    cacheSimplifiedResponse(original, "clearer", verified);
    assert.equal(
      getCachedSimplifiedResponse(original, "clearer")?.lesson?.intuition.visual,
      "A saved simpler explanation.",
    );
    assert.equal(getCachedSimplifiedResponse(original, "step_by_step"), null);

    cacheSimplifiedResponse(original, "step_by_step", structuredClone(original));
    assert.equal(getCachedSimplifiedResponse(original, "step_by_step"), null);

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
    getSimplifyFailureMessage(new Error("backend_503")),
    "A simpler version could not be verified. Your original lesson is unchanged.",
  );
  assert.equal(simplifyActionReducer(state, { type: "reset" }), INITIAL_SIMPLIFY_ACTION_STATE);
  assert.equal(original.finalAnswer, "x = 4");
});
