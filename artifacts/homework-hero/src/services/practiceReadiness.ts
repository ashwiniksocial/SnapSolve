import type { Difficulty, Question } from "@/data/questions";
import { getStudentFacingSubject } from "@/data/questions/studentFacingSubject";
import { getCanonicalPracticeDifficulty } from "@/services/canonicalPracticeMetadata";

export interface PracticeProgressTopicRecord {
  attempted?: string[];
}

export type PracticeProgressData = Record<
  string,
  Record<string, PracticeProgressTopicRecord>
>;

export interface PracticeAssessment {
  questionId: string;
  status: "CONFIDENT" | "NEEDS_PRACTICE";
}

export type ReadinessDrilldown =
  | "PRACTISED"
  | "CONFIDENT"
  | "NEEDS_PRACTICE"
  | Difficulty;

export interface PracticeReadiness {
  questionsPractised: Question[];
  confidentQuestions: Question[];
  needsPracticeQuestions: Question[];
  legacyUnassessedQuestions: Question[];
  practisedByDifficulty: Record<Difficulty, Question[]>;
  topicsPractised: number;
  totalTopics: number;
}

function idsToQuestions(activeQuestions: Question[], ids: Set<string>): Question[] {
  return activeQuestions.filter((question) => ids.has(question.id));
}

/**
 * Derives every student-facing Practice readiness number from active canonical
 * questions. A stored ID can count only once and cannot surface after it leaves
 * the active question bank.
 */
export function derivePracticeReadiness(
  activeQuestions: Question[],
  progress: PracticeProgressData,
  selfAssessments: Record<string, PracticeAssessment>,
  studentFacingSubject: string,
): PracticeReadiness {
  const activeIds = new Set(activeQuestions.map((question) => question.id));
  const practisedIds = new Set<string>();

  for (const [nativeSubject, topics] of Object.entries(progress)) {
    if (getStudentFacingSubject(nativeSubject) !== studentFacingSubject) continue;
    for (const record of Object.values(topics)) {
      for (const questionId of record.attempted ?? []) {
        if (activeIds.has(questionId)) practisedIds.add(questionId);
      }
    }
  }

  const questionsPractised = idsToQuestions(activeQuestions, practisedIds);
  const assessmentById = new Map(
    Object.values(selfAssessments)
      .filter((assessment) => activeIds.has(assessment.questionId))
      .map((assessment) => [assessment.questionId, assessment]),
  );
  const confidentQuestions = activeQuestions.filter(
    (question) => assessmentById.get(question.id)?.status === "CONFIDENT",
  );
  const needsPracticeQuestions = activeQuestions.filter(
    (question) => assessmentById.get(question.id)?.status === "NEEDS_PRACTICE",
  );
  const legacyUnassessedQuestions = questionsPractised.filter(
    (question) => !assessmentById.has(question.id),
  );

  const practisedByDifficulty = {
    Easy: questionsPractised.filter((question) => getCanonicalPracticeDifficulty(question) === "Easy"),
    Medium: questionsPractised.filter((question) => getCanonicalPracticeDifficulty(question) === "Medium"),
    Hard: questionsPractised.filter((question) => getCanonicalPracticeDifficulty(question) === "Hard"),
  };
  const topicKeys = new Set(
    activeQuestions.map((question) => `${question.subject}::${question.topicId}`),
  );
  const practisedTopicKeys = new Set(
    questionsPractised.map((question) => `${question.subject}::${question.topicId}`),
  );

  return {
    questionsPractised,
    confidentQuestions,
    needsPracticeQuestions,
    legacyUnassessedQuestions,
    practisedByDifficulty,
    topicsPractised: practisedTopicKeys.size,
    totalTopics: topicKeys.size,
  };
}

export function getReadinessDrilldownQuestions(
  readiness: PracticeReadiness,
  drilldown: ReadinessDrilldown,
): Question[] {
  switch (drilldown) {
    case "PRACTISED":
      return readiness.questionsPractised;
    case "CONFIDENT":
      return readiness.confidentQuestions;
    case "NEEDS_PRACTICE":
      return readiness.needsPracticeQuestions;
    case "Easy":
    case "Medium":
    case "Hard":
      return readiness.practisedByDifficulty[drilldown];
  }
}

export function readinessDrilldownLabel(drilldown: ReadinessDrilldown): string {
  switch (drilldown) {
    case "PRACTISED":
      return "Questions Practised";
    case "CONFIDENT":
      return "I Am Confident";
    case "NEEDS_PRACTICE":
      return "Need More Practice";
    default:
      return `${drilldown} Questions Practised`;
  }
}