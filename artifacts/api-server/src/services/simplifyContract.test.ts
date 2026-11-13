import assert from "node:assert/strict";
import test from "node:test";
import {
  hasMaterialSimplifyChange,
  getSimplifyLevelInstruction,
  matchesSimplifyCanonicalFields,
  parseSimplifyContext,
  type SimplifyContext,
} from "./simplifyContract";
import type { LessonResponse } from "../lib/lessonTypes";

const answer = "Therefore, the triangles are congruent by the SSS criterion.";
const sourceLesson = {
  topic: "Triangle congruence",
  difficulty: "Hard",
  finalAnswer: { answer, whyCorrect: "All three corresponding sides match.", verification: "SSS applies." },
  guidedReasoning: [{ what: "Compare all three side pairs.", why: "SSS requires three equal side pairs.", math: "", result: "All three pairs match.", pause: "" }],
};
const contextInput = {
  topic: "Triangle congruence",
  difficulty: "Hard",
  answer,
  lesson: sourceLesson,
  level: "clearer",
} as const;
const context = parseSimplifyContext(contextInput) as SimplifyContext;
const lesson = (
  overrides: Partial<Pick<LessonResponse, "topic" | "difficulty" | "finalAnswer">> = {},
): Pick<LessonResponse, "topic" | "difficulty" | "finalAnswer"> => ({
  topic: context.topic,
  difficulty: context.difficulty,
  finalAnswer: { answer: context.answer, whyCorrect: "", verification: "" },
  ...overrides,
});

test("accepts a source lesson with frozen answer and metadata", () => {
  assert.deepEqual(parseSimplifyContext(contextInput), context);

  const candidate = lesson({
    finalAnswer: { answer, whyCorrect: "Each of the three side pairs is equal, so SSS proves congruence.", verification: "SSS applies." },
  });
  assert.equal(matchesSimplifyCanonicalFields(candidate, context), true);
});

test("rejects source contexts whose answer, topic, or difficulty drifted", () => {
  assert.equal(parseSimplifyContext({ ...context, answer: "The triangles match." }), null);
  assert.equal(parseSimplifyContext({ ...context, topic: "Similarity" }), null);
  assert.equal(parseSimplifyContext({ ...context, difficulty: "Medium" }), null);
  assert.equal(parseSimplifyContext({ ...context, level: "advanced" }), null);
  assert.equal(parseSimplifyContext({
    topic: context.topic,
    difficulty: context.difficulty,
    answer: context.answer,
    lesson: context.lesson,
  }), null);
});

test("each selected level has a distinct instruction while preserving full reasoning", () => {
  const clearer = getSimplifyLevelInstruction("clearer");
  const stepByStep = getSimplifyLevelInstruction("step_by_step");

  assert.notEqual(clearer, stepByStep);
  assert.match(clearer, /Keep the source lesson's structure and depth/);
  assert.match(stepByStep, /smallest useful steps/);
  assert.match(clearer, /proof steps/);
  assert.match(stepByStep, /proof steps/);
});

test("both levels reject unchanged explanations but accept material wording changes", () => {
  for (const level of ["clearer", "step_by_step"] as const) {
    const levelContext = parseSimplifyContext({ ...contextInput, level });
    assert.ok(levelContext);

    const unchanged = structuredClone(levelContext.lesson);
    assert.equal(hasMaterialSimplifyChange(levelContext.lesson, unchanged), false);

    const formattingOnly = structuredClone(levelContext.lesson);
    const step = formattingOnly.guidedReasoning as Array<Record<string, unknown>>;
    step[0].why = "SSS   requires three equal side pairs.\n";
    assert.equal(hasMaterialSimplifyChange(levelContext.lesson, formattingOnly), false);

    const changed = structuredClone(levelContext.lesson);
    const changedSteps = changed.guidedReasoning as Array<Record<string, unknown>>;
    changedSteps[0].why = "SSS proves congruence because all three matching side pairs are known.";
    assert.equal(hasMaterialSimplifyChange(levelContext.lesson, changed), true);
  }
});

test("rejects generated lessons whose answer or metadata drifted", () => {
  assert.equal(matchesSimplifyCanonicalFields(lesson({
    finalAnswer: { answer: "The triangles match.", whyCorrect: "", verification: "" },
  }), context), false);
  assert.equal(matchesSimplifyCanonicalFields(lesson({ topic: "Similarity" }), context), false);
  assert.equal(matchesSimplifyCanonicalFields(lesson({ difficulty: "Medium" }), context), false);
});
