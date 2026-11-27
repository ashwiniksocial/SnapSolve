import assert from "node:assert/strict";
import test from "node:test";
import {
  assessTeachingLessonAnswerLast,
  buildAnswerLastContext,
  classifyBankAnswerFormat,
  compareBankAnswers,
  isBankLessonAnswerSafe,
  repairTeachingLessonAnswerLeakage,
} from "@workspace/api-zod/bank-answer-integrity";

test("exact and supported equivalent frozen-answer representations match", () => {
  assert.equal(compareBankAnswers("(c) √2", "Option C: \\sqrt{2}").status, "match");
  assert.equal(
    compareBankAnswers(
      "Information and Communication Technology",
      "(b) Information and Communication Technology",
    ).status,
    "match",
  );
  assert.equal(compareBankAnswers("\\frac{1}{2}", "0.5").status, "match");
  assert.equal(compareBankAnswers("50%", "0.5").status, "match");
  assert.equal(compareBankAnswers("−0.5", "-1/2").status, "match");
  assert.equal(compareBankAnswers("answer is: 42.", "42").status, "match");
});

test("explicit scalar answers in prose compare safely with equivalent canonical calculation chains", () => {
  const canonical = "P = 24/60 = 2/5";
  assert.deepEqual(
    compareBankAnswers(
      "Therefore, the probability that a randomly chosen student likes Mathematics is P = 2/5.",
      canonical,
    ),
    { status: "match", method: "rational" },
  );
  assert.deepEqual(compareBankAnswers("The probability is P = 2/4.", canonical), {
    status: "mismatch",
    method: "rational",
  });
  assert.deepEqual(
    compareBankAnswers("P = 24/60 = 2/5", "P = 24/60 = 2/5"),
    { status: "match", method: "normalized" },
  );
  assert.equal(
    compareBankAnswers("P = 2/5, but P = 1/2.", canonical).status,
    "indeterminate",
  );
  assert.equal(compareBankAnswers("The probability is 2/5.", canonical).status, "indeterminate");
  assert.equal(compareBankAnswers("x = 2/5", canonical).status, "indeterminate");
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

test("labeled probability parts accept equivalent terminal fractions without skipping any part", () => {
  const canonical =
    "(a) P(at least 1 girl) = (480+200)/1000 = 680/1000 = 17/25. " +
    "(b) P(2 boys) = 320/1000 = 8/25.";
  const cases: Array<[string, "match" | "mismatch" | "indeterminate"]> = [
    ["(a) P(at least one girl) = 17/25; (b) P(exactly 2 boys) = 8/25.", "match"],
    ["(a) At least one girl: 680/1000 = 17/25; (b) exactly 2 boys: 320/1000 = 8/25.", "match"],
    ["(a) 17/25, which is the required probability; (b) 8/25.", "match"],
    ["(a) 18/25; (b) 8/25.", "mismatch"],
    ["(a) 700/1000 = 17/25; (b) 320/1000 = 8/25.", "mismatch"],
    ["(a) 17/25; (b) 17/25.", "mismatch"],
    ["(a) 17/25.", "mismatch"],
    ["At least one girl = 17/25 and exactly 2 boys = 8/25.", "indeterminate"],
    ["(a) 17/25, but the answer is also 1/2; (b) 8/25.", "indeterminate"],
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

test("MCQ answer-last permits examining the keyed option but blocks explicit selection", () => {
  const canonicalQuestion =
    "Which example shows non-uniform motion? (a) A car at constant speed (b) A stone dropped freely from rest";
  const answer = "(b) A stone dropped freely from rest";
  const context = { canonicalQuestion };

  const optionAnalysis = assessTeachingLessonAnswerLast({
    questionTranslation: {
      whatWeKnow: "We are told that option (a) is a car at steady speed and option (b) is a stone dropped freely from rest; options (c) and (d) are also listed.",
    },
    guidedReasoning: [{
      what: "Now examine option (b), a stone dropped freely from rest.",
      why: "Gravity increases the stone's speed as it falls, so its motion changes.",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(optionAnalysis, { status: "clear" });

  const explicitSelection = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      result: "After checking the speed change, choose option (b).",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(explicitSelection.status, "leak");
  if (explicitSelection.status === "leak") {
    assert.equal(explicitSelection.section, "guidedReasoning[1].result");
  }

  const explicitCorrectness = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      why: "Option (b) is the correct answer because the stone accelerates.",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(explicitCorrectness.status, "leak");
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

test("intermediate wording with 'value is' is not mistaken for an answer announcement", () => {
  const intermediate = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ result: "The value is independent of x." }],
    finalAnswer: { answer: "(c) √2" },
  });
  assert.deepEqual(intermediate, { status: "clear" });

  const finalValue = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ result: "The final value is 42." }],
    finalAnswer: { answer: "42" },
  });
  assert.equal(finalValue.status, "leak");
});

test("answer-last permits a source-supported evaluated calculation in guided reasoning", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  };
  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Substitute the given forces and divide.",
      math: "Therefore, mechanical advantage = 180 N / 45 N = 4",
    }],
    finalAnswer: { answer },
  }, answer, context);

  assert.deepEqual(result, { status: "clear" });
});

test("Q5 permits the NCERT-supported fixed-pulley effort as an intermediate result", () => {
  const answer =
    "(i) Effort = 150 N. (ii) Mechanical advantage = 150 N ÷ 150 N = 1. The effort may be applied downward.";
  const context = {
    canonicalQuestion:
      "An ideal fixed pulley raises a load of 150 N. Ignore friction and pulley mass. Find the effort, mechanical advantage, and the pulley’s other main benefit.",
    intermediateText: [
      "An ideal fixed pulley does not reduce effort magnitude.",
      "Effort = load = 150 N",
    ],
    approvedCalculationText: [
      "Effort = load = 150 N",
      "Mechanical advantage = 150 N ÷ 150 N = 1",
    ],
  };
  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Find the effort from the fixed-pulley relationship.",
      why: "For an ideal fixed pulley, effort equals the load.",
      result: "Effort = 150 N",
    }],
    finalAnswer: { answer },
  }, answer, context);

  assert.deepEqual(result, { status: "clear" });
});

test("Q5 rejects an unsupported effort value and a premature explicit answer", () => {
  const answer =
    "(i) Effort = 150 N. (ii) Mechanical advantage = 150 N ÷ 150 N = 1. The effort may be applied downward.";
  const context = {
    canonicalQuestion:
      "An ideal fixed pulley raises a load of 150 N. Ignore friction and pulley mass. Find the effort, mechanical advantage, and the pulley’s other main benefit.",
    intermediateText: ["Effort = load = 150 N"],
    approvedCalculationText: [
      "Effort = load = 150 N",
      "Mechanical advantage = 150 N ÷ 150 N = 1",
    ],
  };
  const assess = (result: string) => assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Find the effort.",
      why: "Use the approved fixed-pulley relationship.",
      result,
    }],
    finalAnswer: { answer },
  }, answer, context);

  const unsupported = assess("Effort = 90 N");
  assert.equal(unsupported.status, "review");
  assert.equal(unsupported.section, "guidedReasoning[1].result");

  const announced = assess("The answer is Effort = 150 N.");
  assert.equal(announced.status, "leak");
  assert.equal(announced.section, "guidedReasoning[1].result");
});

test("answer-last permits source-supported calculations inside guided explanation fields", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  };

  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Substitute the forces in the load-to-effort relationship.",
      why: "The newtons cancel because both values are forces: mechanical advantage = 180 N / 45 N = 4.",
    }],
    finalAnswer: { answer },
  }, answer, context);

  assert.deepEqual(result, { status: "clear" });
});

test("the shared evidence builder supports source explanation equations and given assignments", () => {
  const context = buildAnswerLastContext(
    "A stone is dropped for 4 s; g = 10 m/s².",
    [
      {
        title: "Known values",
        explanation: "u = 0 (dropped from rest), t = 4 s, and g = 10 m/s².",
      },
      {
        title: "Decimal transformation",
        explanation: "100x = 23.232323… = 23 + 0.232323… = 23 + x.",
      },
      {
        title: "Distance",
        explanation: "Distance = 60 km + 80 km = 140 km (sum of all path lengths).",
      },
    ],
  );
  const answer = "Height = 80 m; final velocity = 40 m/s.";

  const givenValues = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Known values: u = 0 (dropped from rest), t = 4 s, and g = 10 m/s².",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(givenValues, { status: "clear" });

  const repeatingDecimal = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "100x = 23 + 0.232323…" }],
    finalAnswer: { answer: "23/99" },
  }, "23/99", context);
  assert.deepEqual(repeatingDecimal, { status: "clear" });

  const wrongGiven = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ what: "Known values: u = 0, t = 4 s, and g = 11 m/s²." }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(wrongGiven.status, "review");
});

test("supported intermediate math never skips an independent answer-disclosure check", () => {
  const context = buildAnswerLastContext("Convert the recurring decimal to a fraction.", [
    {
      title: "Shift the decimal",
      explanation: "100x = 23.232323… = 23 + 0.232323… = 23 + x.",
    },
  ]);
  const answer = "23/99";
  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      math: "100x = 23 + 0.232323…",
      why: "The answer is 23/99.",
    }],
    finalAnswer: { answer },
  }, answer, context);

  assert.equal(result.status, "leak");
  assert.equal(
    "section" in result ? result.section : undefined,
    "guidedReasoning[1].why",
  );
});

test("approved complement equation remains blocked when it answers the original question early", () => {
  const question = "Can P(E) + P(not E) be greater than 1? Explain with reasoning.";
  const approvedSteps = [{
    title: "Complement events",
    explanation:
      "The event and its complement cover the whole sample space, so their probabilities add to one.",
    result: "P(E) + P(Ē) = 1 always",
  }];
  const answer =
    "No. P(E) + P(not E) = 1 always because an event and its complement cover all outcomes.";
  const context = buildAnswerLastContext(question, approvedSteps);
  const candidate = {
    guidedReasoning: [{
      what: "Combine the probability of the event with its complement.",
      why: "Together they cover every possible outcome.",
      math: "P(E) + P(Ē) = 1",
      result: "Thus, we conclude that P(E) + P(Ē) = 1 always.",
    }],
    finalAnswer: { answer },
  };

  const result = repairTeachingLessonAnswerLeakage(candidate, answer, context);
  assert.equal(result.status, "rejected");
  assert.notEqual(result.assessment.status, "clear");
});

test("Probability fraction reduction is source-derived, while wrong arithmetic and early answers remain blocked", () => {
  const question =
    "In a class of 60 students, 24 like Mathematics. A student is chosen at random. Find the probability that the student likes Mathematics.";
  const answer = "P = 24/60 = 2/5";
  const context = buildAnswerLastContext(question, [{
    title: "Probability",
    explanation: "P = 24/60 = 2/5.",
    result: "P = 2/5",
  }]);
  const reduction = {
    guidedReasoning: [{
      what: "Find a common divisor for the numerator and denominator.",
      why: "Dividing both by the same number keeps the ratio unchanged.",
      math: "24 ÷ 12 = 2 and 60 ÷ 12 = 5",
    }],
    finalAnswer: { answer },
  };

  assert.deepEqual(
    assessTeachingLessonAnswerLast(reduction, answer, context),
    { status: "clear" },
  );

  const wrongDivisor = {
    ...reduction,
    guidedReasoning: [{
      ...reduction.guidedReasoning[0],
      math: "24 ÷ 10 = 2.4 and 60 ÷ 10 = 6",
    }],
  };
  assert.equal(
    assessTeachingLessonAnswerLast(wrongDivisor, answer, context).status,
    "review",
  );

  const prematureAnswer = {
    ...reduction,
    guidedReasoning: [{
      ...reduction.guidedReasoning[0],
      why: "Therefore, the answer is 2/5.",
    }],
  };
  assert.equal(
    assessTeachingLessonAnswerLast(prematureAnswer, answer, context).status,
    "leak",
  );
});

test("equation-equivalent transformations pass only when both sides match approved source math", () => {
  const context = buildAnswerLastContext("Convert the recurring decimal to a fraction.", [
    {
      title: "Isolate x",
      explanation: "100x - x = 99x; 99x = 23; x = 23/99.",
    },
  ]);
  const answer = "x = 23/99";

  const equivalent = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "100x - x = 23" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(equivalent, { status: "clear" });

  const incorrect = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "100x + x = 23" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(incorrect.status, "review");
});

test("exact rational arithmetic accepts equivalent grounded steps and rejects wrong or invented values", () => {
  const question = "Find a rational number between 1/3 and 1/2.";
  const answer = "5/12 is one valid answer.";
  const context = buildAnswerLastContext(question, [{
    title: "Apply the average method",
    explanation: "The average is (1/3 + 1/2) / 2. LCM of 3 and 2 is 6; 1/3 = 2/6, 1/2 = 3/6, and the sum is 5/6.",
    formula: "(1/3 + 1/2) / 2",
    result: "5/12",
  }], answer);

  const equivalent = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      math: "1/3 + 1/2 = (2/6 + 3/6) = 5/6",
      why: "The common denominator lets us add the equal fractions without changing their values.",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(equivalent, { status: "clear" });

  const incorrect = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "1/3 + 1/2 = (2/6 + 3/6) = 4/6" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(incorrect.status, "review");

  const equivalentFraction = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "1/3 + 1/2 = 10/12" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(equivalentFraction, { status: "clear" });

  const wrong = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "1/3 + 1/2 = 10/11" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(wrong.status, "review");
});

test("exact integer powers may use source-grounded equivalence but not incorrect powers", () => {
  const answer = "Yes. 3/8 = 0.375. The denominator 8 = 2^3 has only 2 as a prime factor.";
  const context = buildAnswerLastContext(
    "Is 3/8 a terminating decimal? Find its decimal expansion.",
    [{
      title: "Factorise the denominator",
      explanation: "8 = 2 × 2 × 2 = 2^3. The only prime factor is 2.",
      formula: "8 = 2^3",
    }],
    answer,
  );
  const supported = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      why: "The rule uses prime factors other than 2 and 5. Since 8 = 2^3, its only prime factor is 2.",
    }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(supported, { status: "clear" });

  const incorrect = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "8 = 3^2" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(incorrect.status, "review");
});

test("recurring-decimal equivalence is checked exactly and remains source-grounded", () => {
  const question =
    "Which is irrational? (a) 0.101001… (b) 0.333… (c) 0.142857142857…";
  const answer = "(a) 0.101001… — the pattern never repeats with the same block.";
  const context = buildAnswerLastContext(question, [{
    title: "Analyze the options",
    formula: "0.333…",
  }], answer);

  const supported = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "0.333… = 1/3" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.deepEqual(supported, { status: "clear" });

  const incorrect = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "0.333… = 2/3" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(incorrect.status, "review");

  const nonRepeating = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "0.101001… = 1/3" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(nonRepeating.status, "review");
});

test("a supporting definition within a longer answer is not mistaken for a standalone answer", () => {
  const answer =
    "Data and information are related but distinct. Data is raw facts or figures that have not yet been processed. Information is meaningful output after processing data, such as a class average used for decisions.";
  const explanatoryLesson = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      why: "Data refers to raw facts or figures that have not yet been processed. That alone has no useful meaning; processing and comparing the values turns them into information.",
    }],
    finalAnswer: { answer },
  });
  assert.deepEqual(explanatoryLesson, { status: "clear" });

  const standaloneAnswer = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      why: "The answer is: data is raw facts or figures that have not yet been processed.",
    }],
    finalAnswer: { answer },
  });
  assert.equal(standaloneAnswer.status, "leak");
});

test("guided explanation rejects unsupported extra calculations and explicit answer claims", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    approvedCalculationText: ["Mechanical advantage = 180 N ÷ 45 N = 4"],
  };

  for (const why of [
    "Mechanical advantage = 180 N / 45 N = 4, and 180 N / 45 N = 3.",
    "The final answer is mechanical advantage = 180 N / 45 N = 4.",
  ]) {
    const result = assessTeachingLessonAnswerLast({
      guidedReasoning: [{ why }],
      finalAnswer: { answer },
    }, answer, context);
    assert.notEqual(result.status, "clear", why);
  }
});

test("Q2 safe repair changes only a direct requested-answer sentence and revalidates the lesson", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const question =
    "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.";
  const context = {
    canonicalQuestion: question,
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  };
  const lesson = {
    questionTranslation: {
      plainEnglish: "Compare the load with the effort.",
      whatWeKnow: "The load is 180 N and the effort is 45 N.",
    },
    guidedReasoning: [
      {
        what: "Use the load-to-effort relationship.",
        why: "Mechanical advantage compares the load with the effort.",
        math: "Mechanical advantage = load ÷ effort",
      },
      {
        what: "Substitute the two forces.",
        why: "Therefore, the mechanical advantage is 4.",
        math: "Mechanical advantage = 180 N ÷ 45 N = 4",
        result: "Mechanical advantage = 4 (no unit)",
      },
    ],
    finalAnswer: { answer },
  };

  const initial = assessTeachingLessonAnswerLast(lesson, answer, context);
  assert.equal(initial.status, "leak");
  if (initial.status === "leak") {
    assert.equal(initial.section, "guidedReasoning[2].why");
    assert.equal(initial.offendingText, "Therefore, the mechanical advantage is 4.");
  }

  const repaired = repairTeachingLessonAnswerLeakage(lesson, answer, context);
  assert.equal(repaired.status, "repaired");
  assert.deepEqual(repaired.assessment, { status: "clear" });
  assert.equal(
    (repaired.lesson as typeof lesson).guidedReasoning[1].why,
    "This establishes the mechanical advantage requested.",
  );
  assert.equal(
    (repaired.lesson as typeof lesson).guidedReasoning[1].math,
    "Mechanical advantage = 180 N ÷ 45 N = 4",
  );
  assert.equal((repaired.lesson as typeof lesson).finalAnswer.answer, answer);
  assert.equal(lesson.guidedReasoning[1].why, "Therefore, the mechanical advantage is 4.");
});

test("Q2 permits the approved calculation and explanation while keeping given values intact", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  };
  const lesson = {
    questionTranslation: { whatWeKnow: "The load is 180 N and the effort is 45 N." },
    guidedReasoning: [{
      what: "Substitute the given forces.",
      why: "The newtons cancel because both values are forces: mechanical advantage = 180 N / 45 N = 4.",
      math: "Mechanical advantage = 180 N ÷ 45 N = 4",
      result: "Mechanical advantage = 4 (no unit)",
    }],
    finalAnswer: { answer },
  };

  assert.deepEqual(assessTeachingLessonAnswerLast(lesson, answer, context), { status: "clear" });
  const result = repairTeachingLessonAnswerLeakage(lesson, answer, context);
  assert.equal(result.status, "clear");
  assert.deepEqual(result.assessment, { status: "clear" });
  assert.equal(result.lesson, lesson);
});

test("unsupported Q2 calculations and numerical conclusions remain fail-closed", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: ["Mechanical advantage = 180 N ÷ 45 N = 4"],
  };
  const wrongCalculation = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "Mechanical advantage = 180 N / 45 N = 5" }],
    finalAnswer: { answer },
  }, answer, context);
  assert.equal(wrongCalculation.status, "review");

  const unsupportedConclusion = {
    guidedReasoning: [{ why: "The mechanical advantage is 5." }],
    finalAnswer: { answer },
  };
  const unsupported = assessTeachingLessonAnswerLast(unsupportedConclusion, answer, context);
  assert.equal(unsupported.status, "review");
  assert.equal(
    repairTeachingLessonAnswerLeakage(unsupportedConclusion, answer, context).status,
    "rejected",
  );
});

test("ambiguous guided answer wording is rejected without changing the lesson", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const lesson = {
    guidedReasoning: [{
      why: "The mechanical advantage is 4 because the two forces are compared.",
    }],
    finalAnswer: { answer },
  };
  const result = repairTeachingLessonAnswerLeakage(lesson, answer, {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    approvedCalculationText: ["Mechanical advantage = 180 N ÷ 45 N = 4"],
  });
  assert.equal(result.status, "rejected");
  assert.equal(result.lesson, lesson);
  assert.equal(
    lesson.guidedReasoning[0].why,
    "The mechanical advantage is 4 because the two forces are compared.",
  );
});

test("a supported calculation is not whitelisted in introductory sections", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const result = assessTeachingLessonAnswerLast({
    questionTranslation: {
      whatWeKnow: "Mechanical advantage = 180 N / 45 N = 4.",
    },
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: ["Mechanical advantage = 180 N ÷ 45 N = 4"],
  });

  assert.notEqual(result.status, "clear");
});

test("incorrect calculations remain under review even when the wrong result is a given", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const result = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      what: "Substitute and divide.",
      math: "Mechanical advantage = 180 N / 45 N = 45",
    }],
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion:
      "A machine raises a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  });

  assert.notEqual(result.status, "clear");
  if (result.status !== "clear") {
    assert.equal(result.section, "guidedReasoning[1].math");
    assert.equal(result.status, "review");
  }
});

test("answer and option announcements are not accepted as guided calculations", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const announced = assessTeachingLessonAnswerLast({
    guidedReasoning: [{
      math: "The final answer is mechanical advantage = 180 N / 45 N = 4.",
    }],
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion: "Load 180 N; effort 45 N.",
    approvedCalculationText: ["Mechanical advantage = 180 N ÷ 45 N = 4"],
  });
  assert.notEqual(announced.status, "clear");

  const choiceAnnouncement = assessTeachingLessonAnswerLast({
    guidedReasoning: [{ math: "Correct option (b): 2 + 2 = 4." }],
    finalAnswer: { answer: "(b) 2 + 2 = 4" },
  }, "(b) 2 + 2 = 4", {
    approvedCalculationText: ["2 + 2 = 4"],
  });
  assert.notEqual(choiceAnnouncement.status, "clear");
});

test("Q2 wordToMath may restate canonical numerical givens faithfully", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const result = assessTeachingLessonAnswerLast({
    questionTranslation: {
      wordToMath: "Therefore, load = 180 N and effort = 45 N.",
    },
    finalAnswer: { answer },
  }, answer, {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  });

  assert.deepEqual(result, { status: "clear" });
});

test("Q2 mathematical translation still rejects a premature result or answer claim", () => {
  const answer = "Mechanical advantage = 180 N ÷ 45 N = 4.";
  const context = {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
    intermediateText: ["Mechanical advantage = load ÷ effort"],
    approvedCalculationText: [
      "Mechanical advantage = 180 N ÷ 45 N = 4",
      "Mechanical advantage = 4 (no unit)",
    ],
  };
  for (const wordToMath of [
    "The final result is 180 N.",
    "Mechanical advantage = 180 N ÷ 45 N = 4.",
    "Mechanical advantage = 180 N ÷ 45 N = 3.",
  ]) {
    const result = assessTeachingLessonAnswerLast({
      questionTranslation: { wordToMath },
      finalAnswer: { answer },
    }, answer, context);
    assert.notEqual(result.status, "clear", wordToMath);
  }
});

test("answer-last diagnostics retain exact rejected field text only in memory", () => {
  const offendingText = "The final answer is 180 N.";
  const lesson = {
    questionTranslation: { wordToMath: offendingText },
    guidedReasoning: [{ what: "Use the load and effort relationship." }],
    finalAnswer: { answer: "Mechanical advantage = 180 N ÷ 45 N = 4." },
  };
  const context = {
    canonicalQuestion:
      "A machine is used to raise a load of 180 N by applying an effort of 45 N. Calculate its mechanical advantage.",
  };

  const assessment = assessTeachingLessonAnswerLast(
    lesson,
    lesson.finalAnswer.answer,
    context,
  );
  assert.equal(assessment.status, "leak");
  assert.equal(assessment.section, "questionTranslation.wordToMath");
  assert.equal(assessment.offendingText, offendingText);

  const repair = repairTeachingLessonAnswerLeakage(
    lesson,
    lesson.finalAnswer.answer,
    context,
  );
  assert.equal(repair.status, "rejected");
  assert.equal(repair.lesson, lesson);
  assert.equal(lesson.questionTranslation.wordToMath, offendingText);
  assert.equal(
    "offendingText" in repair.assessment ? repair.assessment.offendingText : undefined,
    offendingText,
  );
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
