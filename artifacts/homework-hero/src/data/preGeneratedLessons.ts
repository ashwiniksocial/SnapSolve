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
 *
 * IMPORTANT (P0-A root cause): `import.meta.glob` is a COMPILE-TIME Vite
 * transform, not a runtime function. A runtime guard like
 * `typeof import.meta.glob === "function"` evaluates to "undefined" in the
 * browser, so a ternary guard silently discards the transformed glob object
 * and every chapter lookup misses — sending valid pre-generated questions to
 * the paid streaming fallback. The call must be evaluated unconditionally.
 * The try/catch exists ONLY for non-Vite module loaders (the Node/tsx
 * deterministic validator imports this module), where the undefined call
 * throws and is caught; under Vite the transformed object is returned as-is.
 */
const chunkLoaders: Record<string, () => Promise<unknown>> = (() => {
  try {
    return import.meta.glob("./generatedLessonChunks/**/*.ts");
  } catch {
    return {}; // Non-Vite environment (Node validator) — browser never hits this.
  }
})();
const loadedChunks = new Map<string, Promise<PreGeneratedLessonChunk | null>>();

/**
 * URL-safe filename token. Percent-encoding must NOT be used here: a literal
 * "%20" in a chunk filename breaks the browser's dynamic import — the dev
 * server percent-decodes the request URL to a path with a real space, the file
 * is not found (404), the import throws, and a valid pre-generated question
 * silently falls through to the paid streaming fallback (P0-A, observed on
 * Information Technology). Keep this in lockstep with the generator script.
 */
function chunkFileToken(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]+/g, "_");
}

function chunkPath(question: Question): string {
  return `./generatedLessonChunks/${question.classNum}--${chunkFileToken(question.subject)}--${chunkFileToken(question.chapterId)}.ts`;
}

async function decodeChunk(encoded: string): Promise<PreGeneratedLessonChunk> {
  const binary = atob(encoded);
  const compressed = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  const decompressed = new Blob([compressed])
    .stream()
    .pipeThrough(new DecompressionStream("gzip"));
  return new Response(decompressed).json() as Promise<PreGeneratedLessonChunk>;
}

/**
 * Opt-in browser diagnostics for the pre-generated lookup. Enabled by setting
 * window.__PREGEN_DEBUG = true or adding ?pregenDebug=1 to the URL. Uses
 * globalThis (not window) so this module stays typecheck-safe when imported by
 * the Node deterministic validator, which has no DOM lib.
 */
function pregenDebugOn(): boolean {
  const g = globalThis as unknown as {
    __PREGEN_DEBUG?: boolean;
    location?: { search?: string };
  };
  if (typeof g.location?.search !== "string") return false;
  return (
    g.__PREGEN_DEBUG === true ||
    new URLSearchParams(g.location.search).get("pregenDebug") === "1"
  );
}

async function loadChunk(question: Question): Promise<PreGeneratedLessonChunk | null> {
  const path = chunkPath(question);
  const existing = loadedChunks.get(path);
  if (existing) return existing;

  const pending = (async () => {
    const loader = chunkLoaders?.[path] as (() => Promise<LessonChunkModule>) | undefined;
    if (!loader) {
      if (pregenDebugOn()) {
        // eslint-disable-next-line no-console
        console.log("[PREGEN:loadChunk] no loader for path", JSON.stringify({
          path,
          availableKeys: Object.keys(chunkLoaders),
        }));
      }
      return null;
    }
    try {
      const chunk = await decodeChunk((await loader()).default);
      if (
        chunk.version !== 1 ||
        chunk.classNum !== question.classNum ||
        chunk.subject !== question.subject ||
        chunk.chapterId !== question.chapterId ||
        !chunk.lessons ||
        typeof chunk.lessons !== "object"
      ) {
        if (pregenDebugOn()) {
          // eslint-disable-next-line no-console
          console.log("[PREGEN:loadChunk] metadata mismatch", JSON.stringify({
            path,
            chunkVersion: chunk.version,
            chunkClassNum: chunk.classNum,
            chunkSubject: chunk.subject,
            chunkChapterId: chunk.chapterId,
            qClassNum: question.classNum,
            qSubject: question.subject,
            qChapterId: question.chapterId,
          }));
        }
        return null;
      }
      return chunk;
    } catch (err) {
      if (pregenDebugOn()) {
        // eslint-disable-next-line no-console
        console.log("[PREGEN:loadChunk] decode threw", JSON.stringify({ path, err: String(err) }));
      }
      // A transient decode/import failure must NOT be cached as a permanent
      // miss — clear the cached rejection so a later attempt can retry.
      loadedChunks.delete(path);
      return null;
    }
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
 * Explicit resolution of a pre-generated lookup. This exists so the caller can
 * never confuse "still loading" with "no lesson" — the streaming fallback is
 * only permitted once resolution is definitively "MISS_OR_INVALID".
 *
 * - "VALID"           → a source-fresh, complete stored lesson is available.
 * - "MISS_OR_INVALID" → the lazy chunk finished loading and there is either no
 *                       entry, a hash mismatch, a stale/malformed lesson, or a
 *                       failed answer check. Fallback may proceed.
 *
 * A PENDING state is deliberately NOT part of this enum: the function only
 * resolves after the lazy import has completed (or definitively failed), so the
 * mere act of awaiting it guarantees the lookup is no longer pending. Callers
 * MUST await this before deciding whether to stream.
 */
export type PreGeneratedResolution =
  | { status: "VALID"; response: AIResponse }
  | { status: "MISS_OR_INVALID" };

function buildResponse(entry: PreGeneratedLessonEntry, question: Question): AIResponse {
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

/**
 * Module-level dedupe of concurrent resolutions for the SAME question. Under
 * route remounts (wouter `key={location}`) and React lazy/Suspense, the same
 * question can trigger two lookups in parallel; both must observe one shared
 * import promise and one shared decision, so neither can race ahead into
 * streaming while the other is still awaiting the chunk.
 */
const inFlightResolutions = new Map<string, Promise<PreGeneratedResolution>>();

/**
 * Definitive resolution of the pre-generated lookup for a question. It awaits
 * the lazy chapter chunk to completion (a "not loaded yet" chunk is NOT treated
 * as a miss — the await resolves the pending import first), then validates the
 * stored lesson against current frozen source content. Only after this resolves
 * to "MISS_OR_INVALID" may the caller initiate any streaming/AI fallback.
 *
 * It never touches localStorage, the API, or a model.
 */
export async function resolvePreGeneratedBankLesson(
  question: Question,
): Promise<PreGeneratedResolution> {
  const existing = inFlightResolutions.get(question.id);
  if (existing) return existing;

  const pending = (async (): Promise<PreGeneratedResolution> => {
    // Awaiting loadChunk() resolves any in-progress lazy import first, so a
    // pending chunk can never be misread as an absent lesson.
    const chunk = await loadChunk(question);
    const entry = chunk?.lessons[question.id];
    const valid = isStoredLessonValid(entry, question);
    if (pregenDebugOn()) {
      // eslint-disable-next-line no-console
      console.log("[PREGEN]", JSON.stringify({
        id: question.id,
        path: chunkPath(question),
        chunkLoaded: !!chunk,
        entryFound: !!entry,
        valid,
      }));
    }
    if (!valid) return { status: "MISS_OR_INVALID" };
    return { status: "VALID", response: buildResponse(entry, question) };
  })();

  inFlightResolutions.set(question.id, pending);
  try {
    return await pending;
  } finally {
    inFlightResolutions.delete(question.id);
  }
}

/**
 * Backwards-compatible convenience wrapper. Returns the AIResponse when a valid
 * pre-generated lesson exists, or null when the lookup definitively resolves to
 * a miss/invalid. Prefer resolvePreGeneratedBankLesson() where the caller needs
 * to gate a paid fallback on the explicit resolution state.
 */
export async function getPreGeneratedBankLesson(question: Question): Promise<AIResponse | null> {
  const resolution = await resolvePreGeneratedBankLesson(question);
  return resolution.status === "VALID" ? resolution.response : null;
}