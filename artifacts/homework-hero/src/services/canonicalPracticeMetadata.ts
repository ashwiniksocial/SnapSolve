import type { Subject } from "../data/subjects";
import type { Question, Difficulty, EffectiveQuestionType } from "../data/questions/types";
import type { AIResponse } from "../data/solutionBank";

/**
 * Student-facing metadata for a canonical bank question. Lesson content may
 * explain the answer, but it never gets to redefine this identity.
 */
export interface CanonicalPracticeMetadata {
  questionId: string;
  subject: Subject;
  chapterId: string;
  chapterName: string;
  topicId: string;
  topicName: string;
  difficulty: Difficulty;
  questionType: EffectiveQuestionType;
  question: string;
}

export function getCanonicalPracticeMetadata(question: Question): CanonicalPracticeMetadata {
  return {
    questionId: question.id,
    subject: question.subject as Subject,
    chapterId: question.chapterId,
    chapterName: question.chapterName,
    topicId: question.topicId,
    topicName: question.topicName,
    difficulty: question.difficulty,
    questionType: question.questionType ?? "Unclassified",
    question: question.question,
  };
}

/** Practice and readiness must read difficulty from the canonical bank object. */
export function getCanonicalPracticeDifficulty(question: Question): Difficulty {
  return getCanonicalPracticeMetadata(question).difficulty;
}

/**
 * Applies canonical bank identity immediately before student-facing Solution
 * rendering. This intentionally overwrites streamed, cached, or generated
 * metadata while preserving the lesson's explanatory content.
 */
export function applyCanonicalBankMetadata(
  response: AIResponse,
  question: Question,
): AIResponse {
  const metadata = getCanonicalPracticeMetadata(question);
  return {
    ...response,
    subject: metadata.subject,
    topic: metadata.topicName,
    difficulty: metadata.difficulty,
    detectedQuestion: metadata.question,
    lesson: response.lesson
      ? {
          ...response.lesson,
          topic: metadata.topicName,
          difficulty: metadata.difficulty,
        }
      : undefined,
  };
}