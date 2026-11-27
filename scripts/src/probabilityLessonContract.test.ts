import assert from "node:assert/strict";
import test from "node:test";
import {
  buildAnswerLastContext,
  assessTeachingLessonAnswerLast,
  compareBankAnswers,
  repairTeachingLessonAnswerLeakage,
} from "../../lib/api-zod/src/bankAnswerIntegrity.ts";
import {
  getIncompleteDetailedLessonFields,
  isCompleteDetailedLessonContract,
  normalizeOptionalDetailedLessonSections,
} from "../../lib/api-zod/src/detailedLessonContract.ts";
import {
  hashQuestionContent,
  isCompleteDetailedLesson,
  isStoredLessonValid,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import { QUESTIONS } from "../../artifacts/homework-hero/src/data/questions/class9-maths-ch15.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import type { TeachingLesson } from "../../artifacts/homework-hero/src/data/solutionBank.ts";
import { parseLessonResponse } from "../../artifacts/api-server/src/lib/lessonTypes.ts";

function probabilityQuestion(id: string): Question {
  const question = QUESTIONS.find((item) => item.id === id);
  assert.ok(question, `approved Probability question ${id} exists`);
  return question;
}

function lessonFixture(question: Question, math = ""): TeachingLesson {
  return parseLessonResponse({
    topic: question.topicName,
    difficulty: question.difficulty,
    keyConcepts: ["Probability is favourable outcomes divided by total outcomes."],
    intuition: {
      story: "Imagine selecting one outcome from a complete set.",
      visual: "A list shows all outcomes, with favourable ones marked.",
      everyday: "A survey can provide counts for an experimental probability.",
    },
    questionTranslation: {
      plainEnglish: "Use the counts in the question to find the requested probability.",
      whatWeKnow: "",
      whatWeFind: "",
      wordToMath: "",
    },
    guidedReasoning: [
      {
        what: "Identify the favourable outcomes and the total.",
        why: "Probability compares the wanted outcomes with all possible outcomes.",
        math,
        result: "",
        pause: "",
      },
      {
        what: "Form the probability ratio.",
        why: "Place the favourable count over the total count.",
        math: "",
        result: "",
        pause: "",
      },
    ],
    commonMistakes: [{
      mistake: "Use the total as the favourable count.",
      whyItHappens: "The two counts have different roles.",
      howToAvoid: "Label each count before forming the ratio.",
    }, {
      mistake: "Count outcomes outside the stated group.",
      whyItHappens: "The event definition may be overlooked.",
      howToAvoid: "Mark exactly which outcomes satisfy the event.",
    }],
    finalAnswer: {
      answer: question.answer,
      whyCorrect: "It uses the favourable count over the total and matches the approved answer.",
      verification: "",
    },
    simplerExample: {
      problem: "One of two equally likely outcomes is favourable.",
      solution: "The probability is 1/2.",
    },
    practiceQuestion: { question: "", hints: [], solution: "" },
  }) as TeachingLesson;
}

function storedEntry(question: Question, lesson: TeachingLesson) {
  return {
    questionId: question.id,
    sourceHash: hashQuestionContent(question),
    lesson,
    qualityReviewVersion: 1 as const,
    qualityReviewPassed: true,
    qualityReviewStatus: "PASS" as const,
    qualityReviewFlags: [],
  };
}

test("historical Probability Q1 and Q2 incompleteness normalizes once and passes shared persistence checks", () => {
  // The rejected model drafts were not retained. This deterministic fixture
  // exercises their shared incomplete-stream failure class without claiming
  // these are the original missing fields.
  for (const id of ["c9-m-ch15-t1-q01", "c9-m-ch15-t2-q03"]) {
    const question = probabilityQuestion(id);
    const rawLesson = lessonFixture(question);

    assert.deepEqual(getIncompleteDetailedLessonFields(rawLesson), [
      "questionTranslation.whatWeKnow",
      "questionTranslation.whatWeFind",
      "questionTranslation.wordToMath",
    ]);
    const normalized = normalizeOptionalDetailedLessonSections(rawLesson);

    assert.equal(isCompleteDetailedLessonContract(normalized), true);
    assert.equal(isCompleteDetailedLesson(normalized), true);
    assert.equal(compareBankAnswers(normalized.finalAnswer.answer, question.answer).status, "match");
    assert.equal(isStoredLessonValid(storedEntry(question, normalized), question), true);
  }
});

test("Probability Q4 source-derived fraction reduction is valid for retrieval but wrong arithmetic is not", () => {
  const question = probabilityQuestion("c9-m-ch15-t2-q04");
  const lesson = normalizeOptionalDetailedLessonSections(
    lessonFixture(question, "24 ÷ 12 = 2 and 60 ÷ 12 = 5"),
  );

  assert.equal(
    isStoredLessonValid(storedEntry(question, lesson), question),
    true,
  );
  assert.equal(
    isStoredLessonValid(storedEntry(question, {
      ...lesson,
      finalAnswer: { ...lesson.finalAnswer, answer: "P = 3/5" },
    }), question),
    false,
  );

  const questionContext = buildAnswerLastContext(question.question, question.steps, question.answer);
  assert.equal(
    questionContext.approvedCalculationText?.some((text) => /24\/60=2\/5/i.test(text)),
    true,
  );
});

test("Probability Q5 bank-answer numerator supports grounded working without allowing an early final answer", () => {
  const question = probabilityQuestion("c9-m-ch15-t2-q05");
  const context = buildAnswerLastContext(
    question.question,
    question.steps,
    question.answer,
  );
  const finalAnswer = { answer: question.answer };
  const groundedWorking = {
    guidedReasoning: [{
      what: "Count the families that satisfy the event.",
      why: "Both listed family groups include at least one girl.",
      math: "Favorable outcomes = 480 (1 boy + 1 girl) + 200 (2 girls)",
      result: "Favorable outcomes = 680",
    }, {
      what: "Divide favorable outcomes by all surveyed families.",
      math: "P(at least 1 girl) = Favorable outcomes / Total outcomes",
      result: "Use the favorable count over the total count.",
    }],
    finalAnswer,
  };

  assert.deepEqual(
    assessTeachingLessonAnswerLast(groundedWorking, question.answer, context),
    { status: "clear" },
  );

  const wrongArithmetic = {
    ...groundedWorking,
    guidedReasoning: [{
      ...groundedWorking.guidedReasoning[0],
      math: "Favorable outcomes = 480 (1 boy + 1 girl) + 201 (2 girls)",
      result: "Favorable outcomes = 681",
    }],
  };
  assert.notEqual(
    assessTeachingLessonAnswerLast(wrongArithmetic, question.answer, context).status,
    "clear",
  );

  const prematureCompleteAnswer = {
    guidedReasoning: [{
      result: "(a) 17/25, (b) 8/25",
    }],
    finalAnswer,
  };
  const earlyAnswerAssessment = assessTeachingLessonAnswerLast(
    prematureCompleteAnswer,
    question.answer,
    context,
  );
  assert.equal(earlyAnswerAssessment.status, "leak");
  assert.equal(
    "section" in earlyAnswerAssessment ? earlyAnswerAssessment.section : undefined,
    "guidedReasoning[1].result",
  );

  const equivalentPrematureProbability = {
    guidedReasoning: [{
      math: "P(at least 1 girl) = Favorable outcomes / Total outcomes = 680 / 1000",
    }],
    finalAnswer,
  };
  const equivalentAnswerAssessment = assessTeachingLessonAnswerLast(
    equivalentPrematureProbability,
    question.answer,
    context,
  );
  assert.equal(equivalentAnswerAssessment.status, "leak");
  if (equivalentAnswerAssessment.status === "leak") {
    assert.match(equivalentAnswerAssessment.reason, /equivalent to a labeled final-answer part/i);
  }

  const wrongProbability = {
    guidedReasoning: [{
      math: "P(at least 1 girl) = Favorable outcomes / Total outcomes = 681 / 1000",
    }],
    finalAnswer,
  };
  assert.notEqual(
    assessTeachingLessonAnswerLast(wrongProbability, question.answer, context).status,
    "clear",
  );

  const completeSummary = {
    guidedReasoning: [
      { result: "(a) 17/25, (b) 8/25" },
    ],
    finalAnswer,
  };
  const repaired = repairTeachingLessonAnswerLeakage(
    completeSummary,
    question.answer,
    context,
  );
  const repairedLesson = repaired.lesson as typeof completeSummary;
  assert.equal(repaired.status, "repaired");
  assert.equal(repaired.repairCount, 1);
  assert.equal(repaired.assessment.status, "clear");
  assert.equal(repairedLesson.finalAnswer.answer, question.answer);
  assert.match(repairedLesson.guidedReasoning[0].result, /confirm the requested result/i);
});
