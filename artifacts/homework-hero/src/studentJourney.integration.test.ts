import assert from "node:assert/strict";
import test from "node:test";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import {
  getSubjectStatsFromProgress,
  recordSolvedPractice,
  recordUniquePractice,
} from "@/hooks/useProgress";
import {
  applyRevisionReview,
  applySelfAssessment,
  buildRevisionSolutionHref,
  loadRevisionStore,
  saveRevisionStore,
  type RevisionStore,
  type SelfAssessmentInput,
} from "@/hooks/useRevisionPlanner";
import {
  loadCompletedTasks,
  mergeCompletedTasks,
  persistCompletedExamTask,
  type ExamTask,
} from "@/hooks/useExamMode";
import { buildContinuePracticeHref, selectNextUnansweredQuestion } from "@/pages/ExamMode";
import { buildPracticeSolutionHref } from "@/pages/Practice";
import type { Question } from "@/services/questionService";
import { CHAPTER_META as MATHS_CHAPTER_3, QUESTIONS as MATHS_CHAPTER_3_QUESTIONS } from "@/data/questions/class9-maths-ch3";
import { getCanonicalPracticeMetadata } from "@/services/canonicalPracticeMetadata";
import { getUpcomingRevisionSchedule } from "@/hooks/useRevisionPlanner";
import { getOrCreateProfile, recordQuestionAnswered } from "@/services/studentModel";
import { derivePracticeReadiness } from "@/services/practiceReadiness";
import { addMessage, createSession, getTutorStats } from "@/services/socratic/dialogueEngine";

const today = "2026-08-20";
const sourceQuestion: SelfAssessmentInput = {
  questionId: "bo-bio-9-ch01-con-009",
  boardId: "CBSE",
  classNum: 9,
  canonicalChapterId: "bio-ch01",
  academicSession: "2026-27",
  question: "How does the cell membrane regulate movement?",
  subject: "Biology",
  topic: "Cell membrane",
  chapter: "The Fundamental Unit of Life",
  difficulty: "Medium",
};

function withLocalStorage<T>(run: () => T): T {
  const original = Object.getOwnPropertyDescriptor(globalThis, "localStorage");
  const values = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => { values.set(key, value); },
      removeItem: (key: string) => { values.delete(key); },
    },
  });
  try {
    return run();
  } finally {
    if (original) Object.defineProperty(globalThis, "localStorage", original);
    else Reflect.deleteProperty(globalThis, "localStorage");
  }
}

test("Practice confidence → Science coverage → Revision → Exam preserves exact IDs and separate records", () => {
  withLocalStorage(() => {
    const context = makeAcademicContext("CBSE", 9);
    const progressKey = scopedStorageKey("studyai-progress-v3", context)!;
    const revisionKey = scopedStorageKey("studyai-revision-v2", context)!;
    const doneKey = "exam:completion:today";
    const completedTasksKey = `${doneKey}:tasks`;

    const practiceHref = new URL(
      buildPracticeSolutionHref(sourceQuestion.questionId, false, null),
      "https://snapsolve.test",
    );
    assert.equal(practiceHref.searchParams.get("questionId"), sourceQuestion.questionId);
    assert.equal(practiceHref.searchParams.get("practiceMode"), "1");

    const progress = recordUniquePractice(
      {} as Parameters<typeof recordUniquePractice>[0],
      sourceQuestion.subject,
      sourceQuestion.topic,
      sourceQuestion.questionId,
    );
    localStorage.setItem(progressKey, JSON.stringify(progress));
    const assessment: RevisionStore = applySelfAssessment(
      { items: {}, selfAssessments: {} },
      sourceQuestion,
      "NEEDS_PRACTICE",
      today,
      `${today}T10:00:00.000Z`,
    );
    saveRevisionStore(revisionKey, assessment);

    const refreshedProgress = JSON.parse(localStorage.getItem(progressKey)!) as typeof progress;
    const scienceReport = getSubjectStatsFromProgress(refreshedProgress, "Science");
    assert.deepEqual(
      scienceReport.topicStats.find((topic) => topic.topic === sourceQuestion.topic)?.attempted,
      [sourceQuestion.questionId],
    );
    assert.equal(scienceReport.totalSolved, 0);
    assert.equal(scienceReport.totalCorrect, 0);

    const refreshedRevision = loadRevisionStore(revisionKey);
    assert.equal(refreshedRevision.items[sourceQuestion.questionId]?.nextReview, "2026-08-21");
    assert.equal(
      buildRevisionSolutionHref(sourceQuestion.questionId),
      `/solution?practiceMode=1&questionId=${sourceQuestion.questionId}&returnTo=%2Frevision`,
    );

    const graded = applyRevisionReview(
      refreshedRevision,
      sourceQuestion.questionId,
      true,
      "2026-08-21",
    );
    saveRevisionStore(revisionKey, graded);
    assert.equal(loadRevisionStore(revisionKey).items[sourceQuestion.questionId]?.interval, 3);
    const reviewedProgress = recordSolvedPractice(
      refreshedProgress,
      sourceQuestion.subject,
      sourceQuestion.topic,
      true,
      sourceQuestion.questionId,
    );
    localStorage.setItem(progressKey, JSON.stringify(reviewedProgress));
    const reviewedScienceReport = getSubjectStatsFromProgress(reviewedProgress, "Science");
    assert.equal(reviewedScienceReport.totalSolved, 1);
    assert.equal(reviewedScienceReport.totalCorrect, 1);
    assert.deepEqual(
      reviewedScienceReport.topicStats.find((topic) => topic.topic === sourceQuestion.topic)?.attempted,
      [sourceQuestion.questionId],
    );

    const firstTask: ExamTask = {
      id: "chap-Science-bio-ch01-Cell membrane",
      type: "chapter",
      subject: "Science",
      topic: sourceQuestion.topic,
      chapter: sourceQuestion.chapter,
      chapterId: "bio-ch01",
      questionId: sourceQuestion.questionId,
      label: sourceQuestion.topic,
      description: "Review this topic.",
      estimatedMin: 10,
      priority: "medium",
      href: "/practice?subject=Science&chapter=bio-ch01&returnTo=%2Fexam",
      completedToday: false,
    };
    const siblingTask: ExamTask = {
      ...firstTask,
      id: "chap-Science-bio-ch02-Cell membrane",
      chapterId: "bio-ch02",
      completedToday: false,
    };
    const progressBeforeDone = localStorage.getItem(progressKey);
    persistCompletedExamTask(doneKey, completedTasksKey, firstTask);
    const completedAfterRefresh = mergeCompletedTasks(
      [firstTask, siblingTask],
      loadCompletedTasks(completedTasksKey),
      new Set(JSON.parse(localStorage.getItem(doneKey)!) as string[]),
    );
    assert.deepEqual(
      completedAfterRefresh.map((task) => [task.id, task.completedToday]),
      [[firstTask.id, true], [siblingTask.id, false]],
    );
    assert.equal(localStorage.getItem(progressKey), progressBeforeDone);

    const nextQuestion = {
      id: "bo-bio-9-ch01-con-010",
      subject: "Biology",
      topicName: sourceQuestion.topic,
      chapterId: "bio-ch01",
      question: "How do cells use the membrane?",
    } as unknown as Question;
    const selection = selectNextUnansweredQuestion(
      ["Science"],
      { Science: [nextQuestion] },
      reviewedProgress,
    );
    assert.equal(selection?.question.id, nextQuestion.id);
    const continueHref = new URL(buildContinuePracticeHref(selection!), "https://snapsolve.test");
    assert.equal(continueHref.searchParams.get("questionId"), nextQuestion.id);
    assert.equal(continueHref.searchParams.get("returnTo"), "/exam");
    assert.deepEqual(
      (JSON.parse(localStorage.getItem(progressKey)!) as typeof progress).Biology["Cell membrane"].attempted,
      [sourceQuestion.questionId],
    );
  });
});

test("Report Card tutor activity counts only explicitly graded tutor answers and stays separate from Practice", () => {
  withLocalStorage(() => {
    const context = makeAcademicContext("CBSE", 9);
    const progressKey = scopedStorageKey("studyai-progress-v3", context)!;
    const before = recordUniquePractice(
      {} as Parameters<typeof recordUniquePractice>[0],
      "Mathematics",
      "Cartesian Plane",
      "c9-m-ch3-t2-q01",
    );
    localStorage.setItem(progressKey, JSON.stringify(before));

    const session = createSession("Cartesian Plane", "Mathematics", 40);
    addMessage(session, "tutor", "question", "How does an ordered pair locate a point?");
    addMessage(session, "student", "response", "The first value is horizontal.");
    addMessage(session, "tutor", "assessment", "This answer could not be checked.", {
      classification: "unverified",
    });

    let tutorStats = getTutorStats();
    assert.equal(tutorStats.totalSessions, 1);
    assert.equal(tutorStats.totalQuestions, 1);
    assert.equal(tutorStats.totalAnswered, 0);
    assert.equal(tutorStats.avgAccuracy, null);

    addMessage(session, "student", "response", "The x-coordinate is horizontal.");
    addMessage(session, "tutor", "praise", "Correct.", {
      classification: "correct",
      isCorrect: true,
      masteryDelta: 5,
    });
    tutorStats = getTutorStats();

    assert.equal(tutorStats.totalAnswered, 1);
    assert.equal(tutorStats.totalCorrect, 1);
    assert.equal(tutorStats.avgAccuracy, 100);
    assert.deepEqual(
      getSubjectStatsFromProgress(JSON.parse(localStorage.getItem(progressKey)!), "Mathematics").topicStats
        .find((topic) => topic.topic === "Cartesian Plane")?.attempted,
      ["c9-m-ch3-t2-q01"],
    );
    assert.equal(
      getSubjectStatsFromProgress(JSON.parse(localStorage.getItem(progressKey)!), "Mathematics").totalSolved,
      0,
    );
  });
});

test("Class 9 Mathematics Chapter 3 Q11 check-in persists the exact bank ID across student records", () => {
  withLocalStorage(() => {
    localStorage.setItem("studyai_board", "CBSE");
    localStorage.setItem("studyai_class", "9");
    const question = MATHS_CHAPTER_3_QUESTIONS[10];
    assert.equal(question.id, "c9-m-ch3-t2-q01");
    assert.equal(question.chapterName, MATHS_CHAPTER_3.name);
    const metadata = getCanonicalPracticeMetadata(question);
    assert.equal(metadata.topicName, "Coordinates of a Point");

    const context = makeAcademicContext("CBSE", 9);
    const progressKey = scopedStorageKey("studyai-progress-v3", context)!;
    const revisionKey = scopedStorageKey("studyai-revision-v2", context)!;
    const practiceHref = new URL(
      buildPracticeSolutionHref(metadata.questionId, false, null),
      "https://snapsolve.test",
    );
    assert.equal(practiceHref.searchParams.get("questionId"), metadata.questionId);

    const attempted = recordUniquePractice(
      {} as Parameters<typeof recordUniquePractice>[0],
      metadata.subject,
      metadata.topicName,
      metadata.questionId,
    );
    localStorage.setItem(progressKey, JSON.stringify(attempted));
    const beforeGradeStats = getSubjectStatsFromProgress(attempted, "Mathematics");
    assert.deepEqual(
      beforeGradeStats.topicStats.find((topic) => topic.topic === metadata.topicName)?.attempted,
      [metadata.questionId],
    );
    assert.equal(beforeGradeStats.totalSolved, 0);
    assert.equal(beforeGradeStats.totalCorrect, 0);
    assert.equal(getOrCreateProfile().totalQuestionsAnswered, 0);

    const assessment = applySelfAssessment(
      { items: {}, selfAssessments: {} },
      {
        questionId: metadata.questionId,
        boardId: "CBSE",
        classNum: 9,
        canonicalChapterId: MATHS_CHAPTER_3.canonicalChapterId,
        academicSession: "2026-27",
        question: metadata.question,
        subject: metadata.subject,
        topic: metadata.topicName,
        chapter: metadata.chapterName,
        difficulty: metadata.difficulty,
      },
      "NEEDS_PRACTICE",
      today,
      `${today}T10:00:00.000Z`,
    );
    saveRevisionStore(revisionKey, assessment);
    // Tutor-profile activity is its own session metric; a confidence check-in
    // does not count as a graded answer or as a tutor session.
    assert.equal(getOrCreateProfile().totalQuestionsAnswered, 0);

    // Route navigation and a fresh page load read the same board/class-scoped ID.
    const revisionAfterRefresh = loadRevisionStore(revisionKey);
    assert.equal(revisionAfterRefresh.selfAssessments[metadata.questionId]?.status, "NEEDS_PRACTICE");
    assert.equal(revisionAfterRefresh.items[metadata.questionId]?.questionId, metadata.questionId);
    assert.equal(revisionAfterRefresh.items[metadata.questionId]?.nextReview, "2026-08-21");
    assert.deepEqual(
      getUpcomingRevisionSchedule(revisionAfterRefresh.items, today)
        .flatMap(({ items }) => items.map((item) => item.questionId)),
      [metadata.questionId],
    );
    const readinessAfterRefresh = derivePracticeReadiness(
      MATHS_CHAPTER_3_QUESTIONS,
      JSON.parse(localStorage.getItem(progressKey)!) as typeof attempted,
      revisionAfterRefresh.selfAssessments,
      "Mathematics",
    );
    assert.deepEqual(
      readinessAfterRefresh.needsPracticeQuestions.map((candidate) => candidate.id),
      [metadata.questionId],
    );
    assert.deepEqual(
      readinessAfterRefresh.questionsPractised.map((candidate) => candidate.id),
      [metadata.questionId],
    );
    assert.equal(
      buildRevisionSolutionHref(metadata.questionId),
      `/solution?practiceMode=1&questionId=${metadata.questionId}&returnTo=%2Frevision`,
    );
    recordQuestionAnswered(5_000, "basic");
    assert.equal(getOrCreateProfile().totalQuestionsAnswered, 1);
    assert.equal(
      getSubjectStatsFromProgress(
        JSON.parse(localStorage.getItem(progressKey)!) as typeof attempted,
        "Mathematics",
      ).totalSolved,
      0,
    );

    const examNext = selectNextUnansweredQuestion(
      ["Mathematics"],
      { Mathematics: [question, MATHS_CHAPTER_3_QUESTIONS[11]] },
      JSON.parse(localStorage.getItem(progressKey)!) as typeof attempted,
    );
    assert.equal(examNext?.question.id, MATHS_CHAPTER_3_QUESTIONS[11].id);
  });
});
