import assert from "node:assert/strict";
import test from "node:test";
import {
  assessTeachingLessonAnswerLast,
  classifyBankAnswerFormat,
  compareBankAnswers,
  isBankLessonAnswerSafe,
  repairTeachingLessonAnswerLeakage,
} from "@workspace/api-zod/bank-answer-integrity";

test("exact and supported equivalent frozen-answer representations match", () => {
  assert.equal(compareBankAnswers("(c) √2", "Option C: \\sqrt{2}").status, "match");
  assert.equal(compareBankAnswers("\\frac{1}{2}", "0.5").status, "match");
  assert.equal(compareBankAnswers("50%", "0.5").status, "match");
  assert.equal(compareBankAnswers("−0.5", "-1/2").status, "match");
  assert.equal(compareBankAnswers("answer is: 42.", "42").status, "match");
});

test("confirmed answer differences are rejected while supported polynomial equivalence is exact", () => {
  assert.deepEqual(compareBankAnswers("(d) √3", "(c) √2"), {
    status: "mismatch",
    method: "choice",
  });
  assert.equal(compareBankAnswers("2/3", "1/2").status, "mismatch");
  assert.deepEqual(compareBankAnswers("x+x", "2x"), {
    status: "match",
    method: "polynomial",
  });
  assert.equal(compareBankAnswers("99 °F", "37 °C").status, "indeterminate");
  assert.equal(compareBankAnswers("sqrt(2)", "√2").status, "match");
  assert.equal(compareBankAnswers("root two", "√2").status, "indeterminate");
});

test("Class 9 Q30 multipart answer requires every labeled value to match", () => {
  const canonical = "(i) a² + b² = 8 (ii) ab = 2";
  const cases: Array<[string, "match" | "mismatch" | "indeterminate"]> = [
    ["(i) 8; (ii) 2", "match"],
    ["Answers are: (i) a²+b² equals 8; (ii) ab equals 2", "match"],
    ["(ii) ab = 2; (i) a²+b² = 8", "match"],
    ["(i) 7; (ii) 2", "mismatch"],
    ["(i) 8; (ii) 3", "mismatch"],
    ["(i) 8", "mismatch"],
    ["(i) 2; (ii) 8", "mismatch"],
    ["(i) 8, but a²+b² is actually 7; (ii) 2", "indeterminate"],
  ];
  for (const [candidate, expected] of cases) {
    assert.equal(compareBankAnswers(candidate, canonical).status, expected, candidate);
  }
});

test("Class 9 Q40 accepts exact polynomial identities and rejects wrong or incomplete forms", () => {
  const canonical = "4x² − 9";
  const cases: Array<[string, "match" | "mismatch" | "indeterminate"]> = [
    ["4x² − 9", "match"],
    ["(2x + 3)(2x − 3)", "match"],
    ["-9 + 4x^2", "match"],
    ["4x² + 9", "mismatch"],
    ["3x² - 9", "mismatch"],
    ["4x²", "mismatch"],
    ["4x² - 9, which is equal to 1", "indeterminate"],
    ["(2x + 3)^2", "indeterminate"],
  ];
  for (const [candidate, expected] of cases) {
    assert.equal(compareBankAnswers(candidate, canonical).status, expected, candidate);
  }
});

test("scientific notation is compared exactly and bounded", () => {
  assert.deepEqual(compareBankAnswers("1e3", "1000"), {
    status: "match",
    method: "rational",
  });
  assert.equal(compareBankAnswers("3.2E-2", "0.032").status, "match");
  assert.equal(compareBankAnswers("1e129", "1e129").status, "match");
  assert.equal(compareBankAnswers("1e129", "1000").status, "indeterminate");
});

test("unit labels are exact, and unsupported conversions remain indeterminate", () => {
  assert.equal(compareBankAnswers("100 cm", "100 cm").status, "match");
  assert.equal(compareBankAnswers("100 cm", "1 m").status, "indeterminate");
  assert.equal(compareBankAnswers("99 °F", "37 °C").status, "indeterminate");
});

test("format inventory distinguishes structured support from exact-text-only answers", () => {
  assert.deepEqual(classifyBankAnswerFormat("(i) a²+b²=8 (ii) ab=2"), {
    format: "multipart",
    support: "partial",
    reason: "Every part has a checkable value; some symbolic left sides are verified only by exact text.",
  });
  assert.equal(classifyBankAnswerFormat("(2x+3)(2x-3)").format, "polynomial");
  assert.equal(classifyBankAnswerFormat("A paragraph with a scientific explanation").support, "exact-only");
  assert.equal(classifyBankAnswerFormat(" ").support, "missing");
});

test("cached answer safety requires the matching source hash and a verified answer", () => {
  assert.equal(isBankLessonAnswerSafe("42", "42", "source-a", "source-a"), true);
  assert.equal(isBankLessonAnswerSafe("42", "42", "source-old", "source-a"), false);
  assert.equal(isBankLessonAnswerSafe("41", "42", "source-a", "source-a"), false);
  assert.equal(isBankLessonAnswerSafe("root(2)", "√2", "source-a", "source-a"), false);
});

test("answer-last gate rejects direct and equivalent Math answers in earlier sections", () => {
  const direct = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ what: "The answer is (c) √2.", why: "This follows from the definition." }],
    finalAnswer: { answer: "(c) √2" },
  });
  assert.equal(direct.status, "leak");
  if (direct.status === "leak") assert.equal(direct.section, "guidedReasoning[1].what");

  const answerValueOnly = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ what: "The irrational option is √2." }],
    finalAnswer: { answer: "(c) √2" },
  });
  assert.equal(answerValueOnly.status, "leak");

  const synonym = assessTeachingLessonAnswerLast({
    teacherThinking: { firstNotice: "This is another name for the XY-plane." },
    finalAnswer: { answer: "The Cartesian plane is also called the coordinate plane." },
  });
  assert.equal(synonym.status, "leak");
  if (synonym.status === "leak") assert.equal(synonym.section, "teacherThinking.firstNotice");
});

test("answer-last gate rejects Biology quantities disclosed in whatWeKnow", () => {
  const result = assessTeachingLessonAnswerLast({
    questionTranslation: {
      whatWeKnow: "Scientists estimate 10–14 million species, and roughly 1.8 million have been named.",
    },
    finalAnswer: {
      answer: "There may be 10–14 million species; about 1.8 million have been formally named.",
    },
  });
  assert.equal(result.status, "leak");
  if (result.status === "leak") assert.equal(result.section, "questionTranslation.whatWeKnow");
});

test("answer-last gate blocks a final numerical result before finalAnswer", () => {
  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ what: "Compute the expression.", result: "Therefore, the final result is 42." }],
    finalAnswer: { answer: "42" },
  });
  assert.equal(result.status, "leak");
});

test("answer-last gate reviews an earlier answer summary and does not accept it silently", () => {
  const answer = "The sum of the two values is 42.";
  const result = assessTeachingLessonAnswerLast({
    examinerThinking: { topperInsight: answer },
    finalAnswer: { answer },
  });
  assert.notEqual(result.status, "clear");
  if (result.status !== "clear") assert.equal(result.section, "examinerThinking.topperInsight");
});

test("answer-last gate accepts methods, definitions, and intermediate quantities", () => {
  const result = assessTeachingLessonAnswerLast({
    keyConcepts: ["An irrational number cannot be written as a ratio of integers."],
    guidedReasoning: [{
      what: "Use the definition and simplify the expression.",
      why: "The intermediate calculation is part of the method.",
      math: "6 + 4 = 10",
      result: "The intermediate value is 10 before the final comparison.",
    }],
    finalAnswer: { answer: "(c) √2" },
  });
  assert.deepEqual(result, { status: "clear" });
});

test("answer-last gate permits a complete answer only in finalAnswer", () => {
  const result = assessTeachingLessonAnswerLast({
    beforeWeStart: { preview: "We will identify a point in the coordinate system." },
    guidedReasoning: [{ what: "Compare each option against the definition of a rational number." }],
    finalAnswer: { answer: "The answer is (c) √2, which is irrational." },
  });
  assert.deepEqual(result, { status: "clear" });
});

test("Q1-style answer claims in whatWeKnow are repaired and fully revalidated", () => {
  const lesson = {
    questionTranslation: {
      plainEnglish: "We will apply the operation shown in the question.",
      whatWeKnow: "The answer is 4.",
      whatWeFind: "We need to find the requested value.",
      wordToMath: "",
    },
    guidedReasoning: [{ what: "Combine the values.", why: "Use addition.", math: "2 + 2 = 4", result: "The sum is found." }],
    finalAnswer: { answer: "4" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4", {
    canonicalQuestion: "What is 2 + 2?",
    intermediateText: ["2 + 2 = 4"],
  });

  assert.equal(result.status, "repaired");
  assert.equal(result.assessment.status, "clear");
  assert.equal(result.initialAssessment?.status, "leak");
  if (result.initialAssessment?.status === "leak") {
    assert.equal(result.initialAssessment.section, "questionTranslation.whatWeKnow");
    assert.equal(result.initialAssessment.disclosure, "4");
  }
  assert.equal(result.repairCount, 1);
  assert.match(
    (result.lesson as typeof lesson).questionTranslation.whatWeKnow,
    /establish the result after working through the steps/i,
  );
  assert.equal(lesson.questionTranslation.whatWeKnow, "The answer is 4.");
  assert.equal((result.lesson as typeof lesson).guidedReasoning[0].math, "2 + 2 = 4");
  assert.equal((result.lesson as typeof lesson).finalAnswer.answer, "4");
});

test("Q3-style answer claims in plainEnglish become a neutral target description", () => {
  const lesson = {
    questionTranslation: {
      plainEnglish: "The examiner is asking us to find 4.",
      whatWeKnow: "",
    },
    finalAnswer: { answer: "4" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4", {
    canonicalQuestion: "What is 2 + 2?",
    intermediateText: ["2 + 2 = 4"],
  });

  assert.equal(result.status, "repaired");
  assert.equal(result.assessment.status, "clear");
  assert.equal(
    (result.lesson as typeof lesson).questionTranslation.plainEnglish,
    "The examiner is asking us to find the requested value.",
  );
});

test("a canonical numerical given is preserved and does not trigger answer repair", () => {
  const lesson = {
    questionTranslation: {
      plainEnglish: "We will work with the measurement in the question.",
      whatWeKnow: "We are given 4 m.",
    },
    finalAnswer: { answer: "4 m" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4 m", {
    canonicalQuestion: "A strip measures 4 m. State the given length.",
  });

  assert.equal(result.status, "clear");
  assert.equal(result.lesson, lesson);
  assert.equal(lesson.questionTranslation.whatWeKnow, "We are given 4 m.");
});

test("long canonical questions protect answer numbers that are stated as givens", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const result = assessTeachingLessonAnswerLast({
    questionTranslation: {
      whatWeKnow: "The load is 180 N and the effort is 45 N.",
    },
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
  });

  assert.deepEqual(result, { status: "clear" });
});

test("explicit answer claims remain leaks even when the number was given", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const result = assessTeachingLessonAnswerLast({
    questionTranslation: {
      whatWeKnow: "The final answer is 180 N.",
    },
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
  });

  assert.equal(result.status, "leak");
});

test("an answer claim is not excused by the same option appearing in an MCQ question", () => {
  const lesson = {
    questionTranslation: { plainEnglish: "√2 is the irrational choice." },
    finalAnswer: { answer: "(c) √2" },
  };
  const result = assessTeachingLessonAnswerLast(lesson, "(c) √2", {
    canonicalQuestion: "Which number is irrational? (a) √3 (b) 2 (c) √2 (d) 0.5",
  });
  assert.equal(result.status, "leak");
  if (result.status === "leak") assert.equal(result.section, "questionTranslation.plainEnglish");
});

test("verified intermediate calculations remain untouched", () => {
  const lesson = {
    questionTranslation: { plainEnglish: "Combine the two values." },
    guidedReasoning: [
      { what: "Add the values.", math: "2 + 2 = 4", result: "Intermediate result: 4." },
      { what: "Use the result to answer the question.", math: "", result: "" },
    ],
    finalAnswer: { answer: "4" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4", {
    canonicalQuestion: "What is 2 + 2?",
    intermediateText: ["2 + 2 = 4", "Intermediate result: 4."],
  });

  assert.equal(result.status, "clear");
  assert.equal(result.lesson, lesson);
  assert.equal((result.lesson as typeof lesson).guidedReasoning[0].math, "2 + 2 = 4");
  assert.equal((result.lesson as typeof lesson).guidedReasoning[0].result, "Intermediate result: 4.");
});

test("equivalent numeric formatting can be repaired without inferring unit conversions", () => {
  const equivalent = {
    questionTranslation: { whatWeKnow: "The final answer is 4.0 m." },
    finalAnswer: { answer: "4 m" },
  };
  const repaired = repairTeachingLessonAnswerLeakage(equivalent, "4 m");
  assert.equal(repaired.status, "repaired");
  assert.equal(repaired.assessment.status, "clear");

  assert.equal(compareBankAnswers("4.0 m", "4 m").status, "match");
  assert.equal(compareBankAnswers("400 cm", "4 m").status, "indeterminate");
  const unsupportedUnitConversion = {
    questionTranslation: { whatWeKnow: "The answer is 400 cm." },
    finalAnswer: { answer: "4 m" },
  };
  const rejected = repairTeachingLessonAnswerLeakage(unsupportedUnitConversion, "4 m");
  assert.equal(rejected.status, "clear");
  assert.equal(rejected.lesson, unsupportedUnitConversion);
  assert.equal(unsupportedUnitConversion.questionTranslation.whatWeKnow, "The answer is 400 cm.");
});

test("ambiguous answer disclosures fail closed without deleting numbers or explanations", () => {
  const lesson = {
    questionTranslation: { whatWeKnow: "Therefore, we use 4 in this step, then continue with the explanation." },
    finalAnswer: { answer: "4" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4");

  assert.equal(result.status, "rejected");
  assert.equal(result.assessment.status, "leak");
  assert.equal(result.lesson, lesson);
  assert.equal(
    lesson.questionTranslation.whatWeKnow,
    "Therefore, we use 4 in this step, then continue with the explanation.",
  );
});

test("already-valid lessons are returned by identity with no changes", () => {
  const lesson = {
    questionTranslation: { plainEnglish: "We will compare the given quantities." },
    finalAnswer: { answer: "42" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "42");
  assert.equal(result.status, "clear");
  assert.equal(result.lesson, lesson);
  assert.equal(result.repairCount, 0);
});

test("a lesson with a wrong final answer is rejected and left unchanged", () => {
  const lesson = {
    questionTranslation: { whatWeKnow: "The answer is 4." },
    finalAnswer: { answer: "5" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4");
  assert.equal(result.status, "rejected");
  assert.equal(result.lesson, lesson);
  assert.equal(lesson.finalAnswer.answer, "5");
  assert.match(result.reason ?? "", /does not match the canonical answer/i);
});

test("answer-claim repair does not change unrelated academic steps", () => {
  const lesson = {
    questionTranslation: { plainEnglish: "The answer is 4." },
    guidedReasoning: [{ what: "Check the operation.", math: "2 + 2 = 5", result: "Use the source steps." }],
    finalAnswer: { answer: "4" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "4");
  assert.equal(result.status, "repaired");
  assert.deepEqual((result.lesson as typeof lesson).guidedReasoning, lesson.guidedReasoning);
});

test("short exact answers are corrected only when an explicit answer claim is present", () => {
  const lesson = {
    questionTranslation: { plainEnglish: "The answer is photosynthesis." },
    finalAnswer: { answer: "photosynthesis" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "photosynthesis");
  assert.equal(result.status, "repaired");
  assert.equal(result.assessment.status, "clear");
});

test("single-letter option answers are caught and corrected only with an explicit claim", () => {
  const lesson = {
    questionTranslation: { whatWeKnow: "The answer is B." },
    finalAnswer: { answer: "B" },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, "B");
  assert.equal(result.status, "repaired");
  assert.equal(result.assessment.status, "clear");
  assert.equal(lesson.questionTranslation.whatWeKnow, "The answer is B.");

  const ordinaryUse = {
    questionTranslation: { plainEnglish: "This problem uses B as a variable." },
    finalAnswer: { answer: "B" },
  };
  assert.equal(assessTeachingLessonAnswerLast(ordinaryUse).status, "clear");
});
