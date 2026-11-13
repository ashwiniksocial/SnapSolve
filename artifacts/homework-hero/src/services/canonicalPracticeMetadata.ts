import type { Subject } from "../data/subjects";
import type {
  Question,
  Difficulty,
  EffectiveQuestionType,
  QuestionType,
} from "../data/questions/types";
import type { AIResponse } from "../data/solutionBank";

const LEGACY_CLASS9_MATH_CHAPTERS = new Set(["ch1", "ch3", "ch16", "ch17"]);

function hasChoiceAnswer(question: Question): boolean {
  const text = question.question;
  const answerStartsWithChoice = /^\s*(?:option\s*)?\(?[a-d]\)?[.)]?\s/i.test(question.answer);
  const hasChoicePrompt =
    /\b(which of the following|choose the correct option|select the correct option)\b/i.test(text);
  const optionLabels = new Set(
    [...text.matchAll(/(?:^|\s)\(([a-d])\)\s*/gi)].map((match) => match[1].toLowerCase()),
  );

  return answerStartsWithChoice && (hasChoicePrompt || optionLabels.size >= 3);
}

function isExplicitTrueFalse(question: Question): boolean {
  return /\btrue or false\??/i.test(question.question) &&
    /^\s*(?:true|false)\b/i.test(question.answer);
}

function isClearlyHots(question: Question): boolean {
  const higherOrderPrompt =
    /\b(?:counterexample|find the error|identify the error|spot the mistake|is the student correct)\b/i.test(question.question) ||
    /\bstudent claims?[\s\S]{0,120}\b(?:correct|right|true|false|justify)\b/i.test(question.question);
  const higherOrderConcept = question.keyConcepts.some((concept) =>
    /\bHOTS\b|counterexample|error (?:analysis|identification)|parity argument/i.test(concept),
  );

  return /\bHOTS\b/i.test(question.question) || higherOrderPrompt || higherOrderConcept;
}

function isLongResponse(question: Question): boolean {
  const promptRequiresExtendedWork =
    /\b(prove|proof|derive|show(?: that)?|show algebraically|construct(?:ion)?|draw|plot)\b/i.test(question.question) ||
    /\b(?:geometrically locate|describe .{0,40}construction)\b/i.test(question.question);
  const labeledSubparts = new Set(
    [...question.question.matchAll(/(?:^|\s)\((?:([a-z])|(ii|iii|iv|v))\)\s*/gi)]
      .map((match) => (match[1] ?? match[2]).toLowerCase()),
  );
  const hasMultipleSubparts = labeledSubparts.size >= 2;

  return promptRequiresExtendedWork ||
    hasMultipleSubparts ||
    question.steps.length >= 4 ||
    (question.steps.length >= 3 && question.answer.length >= 120);
}

/**
 * Resolve the display/filter type without changing the frozen bank record.
 *
 * Only the four active Class 9 Mathematics V1 chapters with missing metadata
 * are inferred. Choice-format and True/False items map to MCQ; explicit
 * higher-order cues map to HOTS; proof/multipart/extended solutions map to
 * LongAnswer; remaining direct-response items map to ShortAnswer.
 *
 * These records have no source/year/board provenance fields, so PYQ is never
 * inferred from similarity to an examination question.
 */
export function getEffectiveQuestionType(question: Question): EffectiveQuestionType {
  if (question.questionType) return question.questionType;

  if (
    question.classNum !== 9 ||
    question.subject !== "Mathematics" ||
    !LEGACY_CLASS9_MATH_CHAPTERS.has(question.chapterId)
  ) {
    return "Unclassified";
  }

  if (isClearlyHots(question)) return "HOTS";
  if (isExplicitTrueFalse(question) || hasChoiceAnswer(question)) return "MCQ";
  if (isLongResponse(question)) return "LongAnswer";
  return "ShortAnswer";
}

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
    questionType: getEffectiveQuestionType(question),
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