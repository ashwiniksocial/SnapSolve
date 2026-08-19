import assert from "node:assert/strict";
import {
  loadStudentVisibleQuestions,
  type ReviewableQuestion,
} from "./academicReview.ts";
import { recordUniquePractice } from "../../artifacts/homework-hero/src/hooks/useProgress.ts";
import {
  applySelfAssessment,
  type SelfAssessmentInput,
  type RevisionStore,
} from "../../artifacts/homework-hero/src/hooks/useRevisionPlanner.ts";
import {
  derivePracticeReadiness,
  getReadinessDrilldownQuestions,
} from "../../artifacts/homework-hero/src/services/practiceReadiness.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import type { Subject } from "../../artifacts/homework-hero/src/data/subjects.ts";

type ProgressData = Parameters<typeof recordUniquePractice>[0];

function assessmentQuestion(question: Question): SelfAssessmentInput {
  return {
    questionId: question.id,
    question: question.question,
    subject: question.subject as Subject,
    topic: question.topicName,
    chapter: question.chapterName,
    difficulty: question.difficulty,
  };
}

function initialStore(): RevisionStore {
  return { items: {}, selfAssessments: {} };
}

function assertDrilldownParity(questions: Question[], progress: ProgressData, store: RevisionStore) {
  const readiness = derivePracticeReadiness(questions, progress, store.selfAssessments, "Mathematics");
  assert.equal(getReadinessDrilldownQuestions(readiness, "PRACTISED").length, readiness.questionsPractised.length);
  assert.equal(getReadinessDrilldownQuestions(readiness, "CONFIDENT").length, readiness.confidentQuestions.length);
  assert.equal(getReadinessDrilldownQuestions(readiness, "NEEDS_PRACTICE").length, readiness.needsPracticeQuestions.length);
  for (const difficulty of ["Easy", "Medium", "Hard"] as const) {
    assert.equal(
      getReadinessDrilldownQuestions(readiness, difficulty).length,
      readiness.practisedByDifficulty[difficulty].length,
    );
  }
}

async function main() {
  const allQuestions = (await loadStudentVisibleQuestions()).map((question) => ({
    ...question,
    difficulty: question.difficulty as Question["difficulty"],
    questionType: question.questionType as Question["questionType"],
  })) as Question[];
  const mathQuestions = allQuestions.filter(
    (question) => question.classNum === 9 && question.subject === "Mathematics",
  );
  assert.ok(mathQuestions.length >= 19, "Need at least 19 active Mathematics questions for the deterministic scenario.");
  const selected = mathQuestions.slice(0, 19);
  const one = selected[0];

  // Opening a solution has no storage transition and therefore no practice coverage.
  let progress = {} as ProgressData;
  let store = initialStore();
  assert.equal(derivePracticeReadiness(selected, progress, store.selfAssessments, "Mathematics").questionsPractised.length, 0);

  // A repeated explicit practice selection is deduplicated in the actual progress writer.
  progress = recordUniquePractice(progress, one.subject as Subject, one.topicName, one.id);
  progress = recordUniquePractice(progress, one.subject as Subject, one.topicName, one.id);
  assert.equal(derivePracticeReadiness(selected, progress, store.selfAssessments, "Mathematics").questionsPractised.length, 1);

  // Self-assessment transitions are mutually exclusive and persist as one record per ID.
  store = applySelfAssessment(store, assessmentQuestion(one), "CONFIDENT", "2026-08-20", "2026-08-20T00:00:00.000Z");
  assert.equal(store.selfAssessments[one.id]?.status, "CONFIDENT");
  store = applySelfAssessment(store, assessmentQuestion(one), "NEEDS_PRACTICE", "2026-08-20", "2026-08-20T00:01:00.000Z");
  assert.equal(store.selfAssessments[one.id]?.status, "NEEDS_PRACTICE");
  assert.equal(Object.keys(store.selfAssessments).length, 1);
  store = applySelfAssessment(store, assessmentQuestion(one), "NEEDS_PRACTICE", "2026-08-20", "2026-08-20T00:02:00.000Z");
  assert.equal(Object.keys(store.items).length, 1);
  store = applySelfAssessment(store, assessmentQuestion(one), "CONFIDENT", "2026-08-20", "2026-08-20T00:03:00.000Z");
  assert.equal(store.selfAssessments[one.id]?.status, "CONFIDENT");

  // Founder arithmetic: 19 unique practised = 4 confident + 2 needs practice + 13 legacy/unassessed.
  for (const question of selected.slice(1)) {
    progress = recordUniquePractice(progress, question.subject as Subject, question.topicName, question.id);
  }
  for (const question of selected.slice(1, 4)) {
    store = applySelfAssessment(store, assessmentQuestion(question), "CONFIDENT", "2026-08-20", "2026-08-20T00:04:00.000Z");
  }
  for (const question of selected.slice(4, 6)) {
    store = applySelfAssessment(store, assessmentQuestion(question), "NEEDS_PRACTICE", "2026-08-20", "2026-08-20T00:05:00.000Z");
  }
  const readiness = derivePracticeReadiness(selected, progress, store.selfAssessments, "Mathematics");
  assert.equal(readiness.questionsPractised.length, 19);
  assert.equal(readiness.confidentQuestions.length, 4);
  assert.equal(readiness.needsPracticeQuestions.length, 2);
  assert.equal(readiness.legacyUnassessedQuestions.length, 13);
  assert.equal(readiness.topicsPractised, new Set(selected.map((question) => question.topicId)).size);
  assertDrilldownParity(selected, progress, store);

  const scienceQuestions = allQuestions.filter(
    (question) =>
      question.classNum === 9 &&
      ["Physics", "Chemistry", "Biology"].includes(question.subject),
  );
  assert.ok(scienceQuestions.length >= 3, "Need Physics, Chemistry, and Biology questions for Science aggregation.");
  let scienceProgress = {} as ProgressData;
  for (const question of scienceQuestions.slice(0, 3)) {
    scienceProgress = recordUniquePractice(
      scienceProgress,
      question.subject as Subject,
      question.topicName,
      question.id,
    );
  }
  assert.equal(
    derivePracticeReadiness(scienceQuestions, scienceProgress, {}, "Science").questionsPractised.length,
    3,
  );

  console.log(JSON.stringify({
    openingAloneCounts: 0,
    selfAssessmentTransitions: "CONFIDENT → NEEDS_PRACTICE → NEEDS_PRACTICE → CONFIDENT",
    duplicatePracticeSelectionsDeduplicated: true,
    founderArithmetic: { practised: 19, confident: 4, needsPractice: 2, legacyUnassessed: 13 },
    drilldownCountParity: true,
    scienceAggregation: "Physics + Chemistry + Biology",
  }, null, 2));
}

void main();