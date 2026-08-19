/// <reference types="vite/client" />

import type { AIResponse, TeachingLesson } from "./solutionBank";
import type { Subject } from "./subjects";
import type { Question } from "./questions/types";

/**
 * A pre-generated lesson is a derived performance asset, never an academic
 * source. The authoritative question bank remains responsible for every piece
 * of grounding that participates in the source hash below.
 */
export interface PreGeneratedLessonEntry {
  questionId: string;
  sourceHash: string;
  lesson: TeachingLesson;
}

export interface PreGeneratedLessonStore {
  version: 1;
  lessons: Record<string, PreGeneratedLessonEntry>;
}

export interface PreGeneratedLessonChunk extends PreGeneratedLessonStore {
  classNum: number;
  subject: string;
  chapterId: string;
}

type LessonChunkModule = { default: string };

/**
 * Vite turns each compressed chapter module into an independently requested
 * chunk. The key is
 * calculated from the authoritative question metadata, so no question-ID
 * registry is maintained here.
 */
const chunkLoaders = typeof import.meta.glob === "function"
  ? import.meta.glob("./generatedLessonChunks/**/*.ts")
  : {};
const loadedChunks = new Map<string, Promise<PreGeneratedLessonChunk | null>>();

function chunkPath(question: Question): string {
  return `./generatedLessonChunks/${question.classNum}--${encodeURIComponent(question.subject)}--${encodeURIComponent(question.chapterId)}.ts`;
}

async function decodeChunk(encoded: string): Promise<PreGeneratedLessonChunk> {
  const binary = atob(encoded);
  const compressed = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const decompressed = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Response(decompressed).json() as Promise<PreGeneratedLessonChunk>;
}

async function loadChunk(question: Question): Promise<PreGeneratedLessonChunk | null> {
  const path = chunkPath(question);
  const existing = loadedChunks.get(path);
  if (existing) return existing;

  const pending = (async () => {
    const loader = chunkLoaders?.[path] as (() => Promise<LessonChunkModule>) | undefined;
    if (!loader) return null;
    const chunk = await decodeChunk((await loader()).default);
    if (
      chunk.version !== 1 ||
      chunk.classNum !== question.classNum ||
      chunk.subject !== question.subject ||
      chunk.chapterId !== question.chapterId ||
      !chunk.lessons ||
      typeof chunk.lessons !== "object"
    ) {
      return null;
    }
    return chunk;
  })();
  loadedChunks.set(path, pending);
  return pending;
}

function text(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Deterministic FNV-1a 64-bit content hash. It is deliberately synchronous so
 * the browser can reject stale assets before rendering or starting an AI call.
 */
function fnv1a64(input: string): string {
  let hash = 0xcbf29ce484222325n;
  const prime = 0x100000001b3n;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= BigInt(input.charCodeAt(index));
    hash = BigInt.asUintN(64, hash * prime);
  }
  return hash.toString(16).padStart(16, "0");
}

/**
 * Includes every approved source field that grounds bank generation. Adding a
 * question later needs no registry edit: its unique ID and current content are
 * enough for lookup and staleness detection.
 */
export function hashQuestionContent(question: Question): string {
  const source = {
    questionId: question.id,
    classNum: question.classNum,
    subject: question.subject,
    chapterId: question.chapterId,
    chapterName: question.chapterName,
    topicId: question.topicId,
    topicName: question.topicName,
    difficulty: question.difficulty,
    questionType: question.questionType ?? null,
    question: question.question,
    hint: question.hint,
    answer: question.answer,
    steps: question.steps.map((step) => ({
      stepNumber: step.stepNumber,
      title: step.title,
      explanation: step.explanation,
      formula: step.formula ?? null,
      result: step.result ?? null,
    })),
    keyConcepts: question.keyConcepts,
  };

  return `fnv1a64:${fnv1a64(JSON.stringify(source))}`;
}

/**
 * The Detailed renderer has eight visible sections. A valid derived asset must
 * have enough content for every unconditional section, while question
 * translation remains optional because factual questions intentionally hide it.
 */
export function isCompleteDetailedLesson(lesson: TeachingLesson): boolean {
  const translation = lesson.questionTranslation;
  const translationValues = [
    translation.plainEnglish,
    translation.whatWeKnow,
    translation.whatWeFind,
    translation.wordToMath,
  ];
  const hasNoTranslation = translationValues.every((value) => !text(value));
  const hasFullTranslation = translationValues.every(text);
  const practice = lesson.practiceQuestion;
  // The renderer suppresses the whole practice section unless its question is
  // populated. Therefore an omitted practice item is complete, while a shown
  // item must never contain an empty prompt, hint, or solution.
  const hasNoPractice = !text(practice.question);
  const hasFullPractice =
    text(practice.question) &&
    text(practice.solution) &&
    practice.hints.length > 0 &&
    practice.hints.every(text);

  return (
    lesson.keyConcepts.length > 0 &&
    lesson.keyConcepts.every(text) &&
    text(lesson.intuition.story) &&
    text(lesson.intuition.visual) &&
    text(lesson.intuition.everyday) &&
    (hasNoTranslation || hasFullTranslation) &&
    lesson.guidedReasoning.length > 0 &&
    lesson.guidedReasoning.every((step) => text(step.what) && text(step.why)) &&
    lesson.commonMistakes.length > 0 &&
    lesson.commonMistakes.every((mistake) =>
      text(mistake.mistake) &&
      text(mistake.whyItHappens) &&
      text(mistake.howToAvoid),
    ) &&
    text(lesson.finalAnswer.answer) &&
    text(lesson.finalAnswer.whyCorrect) &&
    text(lesson.simplerExample.problem) &&
    text(lesson.simplerExample.solution) &&
    (hasNoPractice || hasFullPractice)
  );
}

export type DetailedLessonQualityFlag =
  | "THIN_GUIDED_REASONING"
  | "MISSING_WORKED_MATH"
  | "MISSING_QUESTION_TRANSLATION"
  | "THIN_COMMON_MISTAKES";

/**
 * Quality flags are intentionally advisory. They identify detailed assets that
 * deserve human review without forcing a made-up fixed number of steps on every
 * factual or short-answer question.
 */
export function getDetailedLessonQualityFlags(
  lesson: TeachingLesson,
  question: Question,
): DetailedLessonQualityFlag[] {
  const flags: DetailedLessonQualityFlag[] = [];
  const expectedMinimumSteps =
    question.difficulty === "Hard" || question.questionType === "LongAnswer" || question.questionType === "HOTS"
      ? 3
      : 2;
  const translation = lesson.questionTranslation;
  const translationHasContent = [
    translation.plainEnglish,
    translation.whatWeKnow,
    translation.whatWeFind,
    translation.wordToMath,
  ].some(text);

  if (lesson.guidedReasoning.length < expectedMinimumSteps) flags.push("THIN_GUIDED_REASONING");
  if (lesson.guidedReasoning.length > 0 && lesson.guidedReasoning.every((step) => !text(step.math) && !text(step.result))) {
    flags.push("MISSING_WORKED_MATH");
  }
  if (!translationHasContent && question.questionType !== "MCQ") flags.push("MISSING_QUESTION_TRANSLATION");
  if (lesson.commonMistakes.length < 2) flags.push("THIN_COMMON_MISTAKES");

  return flags;
}

export function isStoredLessonValid(
  entry: PreGeneratedLessonEntry | undefined,
  question: Question,
): entry is PreGeneratedLessonEntry {
  return !!entry &&
    entry.questionId === question.id &&
    entry.sourceHash === hashQuestionContent(question) &&
    entry.lesson.finalAnswer.answer === question.answer &&
    isCompleteDetailedLesson(entry.lesson);
}

/**
 * Lazily imports just the owning chapter's derived asset. It never touches
 * localStorage, the API, or a model. The derived asset is checked against
 * current frozen source content every time it is used.
 */
export async function getPreGeneratedBankLesson(question: Question): Promise<AIResponse | null> {
  const chunk = await loadChunk(question);
  const entry = chunk?.lessons[question.id];
  if (!isStoredLessonValid(entry, question)) return null;

  return {
    id: `pregenerated-${question.id}`,
    subject: question.subject as Subject,
    // Frozen bank metadata is authoritative even for a source-fresh derived
    // asset. Older pilot chunks may carry historic display labels; never let
    // those labels alter the Practice/Solution heading or difficulty badge.
    topic: question.topicName,
    difficulty: question.difficulty,
    detectedQuestion: question.question,
    keyConcepts: entry.lesson.keyConcepts,
    similarQuestions: [],
    lesson: entry.lesson,
    steps: [],
    finalAnswer: entry.lesson.finalAnswer.answer,
    source: "bank",
  };
}