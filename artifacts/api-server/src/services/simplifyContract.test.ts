import assert from "node:assert/strict";
import test from "node:test";
import {
  hasMaterialSimplifyChange,
  getSimplifyLevelInstruction,
  matchesSimplifyLevelStructure,
  matchesSimplifyCanonicalFields,
  parseSimplifyContext,
  type SimplifyContext,
} from "./simplifyContract";
import { parseLessonResponse, type LessonResponse } from "../lib/lessonTypes";

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
  assert.match(clearer, /same number and order of main guidedReasoning steps/);
  assert.match(clearer, /familiar worked example/);
  assert.match(stepByStep, /MORE guidedReasoning items than the source lesson/);
  assert.match(stepByStep, /prerequisites field/);
  assert.match(stepByStep, /question in pause/);
  assert.match(clearer, /proof steps/);
  assert.match(clearer, /Copy finalAnswer.answer exactly, character for character/);
  assert.match(stepByStep, /Copy finalAnswer.answer exactly, character for character/);
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

const irrationalAnswer = "(c) √2";
const irrationalTopic = "Real Numbers and Their Types";

function irrationalLesson(
  guidedReasoning: LessonResponse["guidedReasoning"],
  prerequisites: string[] = [],
  simplerExample = { problem: "", solution: "" },
): LessonResponse {
  return parseLessonResponse({
    topic: irrationalTopic,
    difficulty: "Easy",
    keyConcepts: ["Rational and irrational numbers"],
    prerequisites,
    guidedReasoning,
    simplerExample,
    finalAnswer: {
      answer: irrationalAnswer,
      whyCorrect: "The other choices can be written as ratios of integers; √2 cannot.",
      verification: "√2 is not a terminating or repeating decimal.",
    },
  });
}

test("Class 9 irrational MCQ fixtures keep (c) √2 and enforce different teaching approaches", () => {
  const source = irrationalLesson([
    {
      what: "Test each option.",
      why: "Check which choices can be written as a ratio of integers.",
      math: "1/3, √4, √2, 0.25",
      result: "Only √2 is irrational.",
      pause: "",
    },
    {
      what: "Choose the irrational number.",
      why: "√2 cannot be written as p/q for integers p and q.",
      math: "",
      result: "Answer: (c) √2",
      pause: "",
    },
  ]);
  const clearer = irrationalLesson([
    {
      what: "Check which choices can be written as fractions.",
      why: "1/3 and 0.25 are fractions. √4 = 2, which is also a fraction.",
      math: "√4 = 2; 0.25 = 1/4",
      result: "These three choices are rational.",
      pause: "",
    },
    {
      what: "Select the choice that cannot be a fraction.",
      why: "√2 has a decimal that neither ends nor repeats, so no integer fraction equals it.",
      math: "",
      result: "Answer: (c) √2",
      pause: "",
    },
  ], [], {
    problem: "Is 0.25 rational?",
    solution: "Yes. 0.25 = 1/4, so it is a ratio of integers.",
  });
  const verySimple = irrationalLesson([
    {
      what: "Remember what rational means.",
      why: "A rational number can be written as p/q, where p and q are integers and q is not zero.",
      math: "Rational = p/q",
      result: "We will test which option cannot fit this form.",
      pause: "Can you name one fraction before we test the choices?",
    },
    {
      what: "Check option (a), 1/3.",
      why: "It already has an integer on top and bottom, so it is rational.",
      math: "1/3",
      result: "Option (a) is rational.",
      pause: "Is 1/3 already written as a fraction?",
    },
    {
      what: "Check option (b), √4.",
      why: "The square root of 4 is 2, and 2 is 2/1.",
      math: "√4 = 2 = 2/1",
      result: "Option (b) is rational.",
      pause: "What is √4?",
    },
    {
      what: "Check option (d), 0.25.",
      why: "Move the decimal two places: 0.25 = 25/100 = 1/4.",
      math: "0.25 = 1/4",
      result: "Option (d) is rational.",
      pause: "Can 0.25 be written as a fraction?",
    },
    {
      what: "Choose option (c), √2.",
      why: "Its decimal never ends or repeats, so it cannot equal any integer fraction.",
      math: "√2 ≈ 1.414213…",
      result: "Answer: (c) √2",
      pause: "Which definition shows that √2 is irrational?",
    },
  ], ["A rational number can be written as p/q with integers p and q ≠ 0."]);

  const context = parseSimplifyContext({
    topic: irrationalTopic,
    difficulty: "Easy",
    answer: irrationalAnswer,
    lesson: source,
    level: "clearer",
  });
  assert.ok(context);
  for (const candidate of [clearer, verySimple]) {
    assert.equal(candidate.topic, irrationalTopic);
    assert.equal(candidate.difficulty, "Easy");
    assert.equal(candidate.finalAnswer.answer, "(c) √2");
    assert.equal(matchesSimplifyCanonicalFields(candidate, context), true);
    assert.equal(hasMaterialSimplifyChange(source, candidate), true);
  }

  assert.equal(matchesSimplifyLevelStructure(source, clearer, "clearer"), true);
  assert.equal(matchesSimplifyLevelStructure(source, verySimple, "step_by_step"), true);
  assert.equal(matchesSimplifyLevelStructure(source, clearer, "step_by_step"), false);
  assert.equal(matchesSimplifyLevelStructure(source, verySimple, "clearer"), false);
  assert.equal(matchesSimplifyLevelStructure(source, structuredClone(source), "clearer"), false);
  assert.equal(hasMaterialSimplifyChange(source, structuredClone(source)), false);
});
