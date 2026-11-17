import assert from "node:assert/strict";
import test from "node:test";
import {
  classifyBankAnswerFormat,
  compareBankAnswers,
  isBankLessonAnswerSafe,
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
