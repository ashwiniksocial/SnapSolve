import assert from "node:assert/strict";
import test from "node:test";
import type { AIResponse, TeachingLesson } from "../data/solutionBank";
import {
  createSimplifiedResponse,
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
    topic: "A changed topic",
    lessonTopic: "A changed lesson topic",
    difficulty: "Hard",
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

  state = simplifyActionReducer(state, { type: "start" });
  assert.equal(state.loading, true);
  assert.equal(simplifyActionReducer(state, { type: "toggle" }), state);

  state = simplifyActionReducer(state, { type: "success", response: simplified });
  assert.equal(state.loading, false);
  assert.equal(state.response, simplified);
  assert.equal(state.showingSimplified, true);

  state = simplifyActionReducer(state, { type: "toggle" });
  assert.equal(state.showingSimplified, false);
  state = simplifyActionReducer(state, { type: "toggle" });
  assert.equal(state.showingSimplified, true);

  const failed = simplifyActionReducer(INITIAL_SIMPLIFY_ACTION_STATE, {
    type: "failure",
    message: "No safe simplified result.",
  });
  assert.equal(failed.loading, false);
  assert.equal(failed.response, null);
  assert.equal(failed.showingSimplified, false);
  assert.equal(failed.error, "No safe simplified result.");
  assert.equal(simplifyActionReducer(state, { type: "reset" }), INITIAL_SIMPLIFY_ACTION_STATE);
  assert.equal(original.finalAnswer, "x = 4");
});
