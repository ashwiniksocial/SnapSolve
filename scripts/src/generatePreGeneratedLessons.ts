import { mkdir, readdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { gunzipSync, gzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { loadStudentVisibleQuestions, type ReviewableQuestion } from "./academicReview.ts";
import {
  compareBankAnswers,
  hashQuestionContent,
  isStoredLessonValid,
  type PreGeneratedLessonChunk,
  type PreGeneratedLessonEntry,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import type { TeachingLesson } from "../../artifacts/homework-hero/src/data/solutionBank.ts";
import { parseLessonResponse } from "../../artifacts/api-server/src/lib/lessonTypes.ts";
import { PILOT_QUESTION_IDS } from "./preGeneratedLessonPilot.ts";
import { getCanonicalChapter } from "./canonicalCurriculum.js";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const chunksDirectory = resolve(repoRoot, "artifacts/homework-hero/src/data/generatedLessonChunks");
const args = new Set(process.argv.slice(2));

type GenerationEvent = {
  type?: string;
  lesson?: unknown;
  code?: string;
  failureCategory?: string;
  finishReason?: string | null;
  responseStatus?: number | null;
  attemptCount?: number;
  maxOutputTokens?: number;
  promptTokens?: number;
  completionTokens?: number;
  cachedTokens?: number;
  estimatedCostUsd?: number;
  totalLatencyMs?: number;
  firstContentMs?: number;
};

type GenerationResult = {
  lesson: TeachingLesson;
  servedFromCache: boolean;
  attemptCount: number;
  promptTokens: number;
  completionTokens: number;
  cachedTokens: number;
  estimatedCostUsd: number;
  totalLatencyMs: number;
  firstContentMs: number;
};

function asBankQuestion(question: ReviewableQuestion): Question {
  if (
    question.difficulty !== "Easy" &&
    question.difficulty !== "Medium" &&
    question.difficulty !== "Hard"
  ) {
    throw new Error(`Unsupported difficulty for ${question.id}: ${question.difficulty}`);
  }
  const validQuestionTypes = new Set(["MCQ", "ShortAnswer", "LongAnswer", "HOTS", "PYQ"]);
  if (question.questionType && !validQuestionTypes.has(question.questionType)) {
    throw new Error(`Unsupported question type for ${question.id}: ${question.questionType}`);
  }
  return {
    id: question.id,
    classNum: question.classNum,
    subject: question.subject,
    chapterId: question.chapterId,
    chapterName: question.chapterName,
    topicId: question.topicId,
    topicName: question.topicName,
    difficulty: question.difficulty,
    questionType: question.questionType as Question["questionType"],
    question: question.question,
    hint: question.hint,
    answer: question.answer,
    steps: question.steps,
    keyConcepts: question.keyConcepts,
  };
}

async function activeQuestions(): Promise<Map<string, Question>> {
  const discovered = await loadStudentVisibleQuestions();
  return new Map(discovered.map((question) => {
    const bankQuestion = asBankQuestion(question);
    return [bankQuestion.id, bankQuestion];
  }));
}

type ChunkRecord = {
  path: string;
  chunk: PreGeneratedLessonChunk;
};

function chunkKey(question: Pick<Question, "classNum" | "subject" | "chapterId">): string {
  return JSON.stringify([question.classNum, question.subject, question.chapterId]);
}

function canonicalContextFor(question: Question): {
  boardId: string;
  classNum: number;
  subject: string;
  canonicalChapterId: string;
} {
  const chapter = getCanonicalChapter(question.chapterId);
  if (
    !chapter ||
    chapter.status !== "ACTIVE" ||
    chapter.bookId === "SOURCE_UNRESOLVED" ||
    chapter.classId !== question.classNum ||
    chapter.subjectId !== question.subject ||
    !["CBSE", "ICSE", "WBBSE"].includes(chapter.boardId)
  ) {
    throw new Error(`No matching active canonical context for ${question.id}.`);
  }

  return {
    boardId: chapter.boardId,
    classNum: chapter.classId,
    subject: chapter.subjectId,
    canonicalChapterId: chapter.bookId,
  };
}

/**
 * URL-safe filename token — MUST stay in lockstep with chunkFileToken() in
 * artifacts/homework-hero/src/data/preGeneratedLessons.ts. Percent-encoding
 * ("%20") breaks browser dynamic imports: the dev server decodes the request
 * URL to a path with a literal space, 404s, and the runtime lookup silently
 * falls through to the paid streaming fallback.
 */
function chunkFileToken(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]+/g, "_");
}

function chunkPath(question: Pick<Question, "classNum" | "subject" | "chapterId">): string {
  return resolve(
    chunksDirectory,
    `${question.classNum}--${chunkFileToken(question.subject)}--${chunkFileToken(question.chapterId)}.ts`,
  );
}

function isChunk(value: unknown): value is PreGeneratedLessonChunk {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<PreGeneratedLessonChunk>;
  return (
    candidate.version === 1 &&
    typeof candidate.classNum === "number" &&
    typeof candidate.subject === "string" &&
    typeof candidate.chapterId === "string" &&
    !!candidate.lessons &&
    typeof candidate.lessons === "object"
  );
}

function decodeChunkSource(source: string, file: string): PreGeneratedLessonChunk {
  const match = source.match(/^export default "([A-Za-z0-9+/=]+";?)\s*$/);
  if (!match) throw new Error(`Invalid pre-generated lesson chunk source: ${file}`);
  const decoded = gunzipSync(Buffer.from(match[1].replace(/;$/, ""), "base64")).toString("utf8");
  const parsed = JSON.parse(decoded) as unknown;
  if (!isChunk(parsed)) throw new Error(`Invalid pre-generated lesson chunk data: ${file}`);
  return parsed;
}

async function readChunkIndex(): Promise<Map<string, ChunkRecord>> {
  const index = new Map<string, ChunkRecord>();
  let files: string[] = [];
  try {
    files = (await readdir(chunksDirectory))
      .filter((file) => file.endsWith(".ts"))
      .sort();
  } catch {
    return index;
  }

  for (const file of files) {
    const path = resolve(chunksDirectory, file);
    const parsed = decodeChunkSource(await readFile(path, "utf8"), file);
    const key = chunkKey(parsed);
    if (index.has(key)) throw new Error(`Duplicate pre-generated lesson chunk metadata: ${file}`);
    index.set(key, { path, chunk: parsed });
  }
  return index;
}

function entryFor(
  chunks: Map<string, ChunkRecord>,
  question: Question,
): PreGeneratedLessonEntry | undefined {
  return chunks.get(chunkKey(question))?.chunk.lessons[question.id];
}

async function persistChunk(record: ChunkRecord): Promise<void> {
  const tempPath = `${record.path}.tmp`;
  await mkdir(dirname(record.path), { recursive: true });
  const compressed = gzipSync(JSON.stringify(record.chunk));
  await writeFile(tempPath, `export default "${compressed.toString("base64")}";\n`, "utf8");
  await rename(tempPath, record.path);
}

function apiBaseUrl(): string {
  const supplied = process.env.PREGENERATED_LESSON_API_BASE_URL?.trim();
  if (supplied) return supplied.replace(/\/$/, "");

  const domain = process.env.REPLIT_DEV_DOMAIN?.trim();
  if (!domain) {
    throw new Error(
      "Set PREGENERATED_LESSON_API_BASE_URL or run inside the Replit development environment.",
    );
  }
  return `https://${domain.replace(/^https?:\/\//, "").replace(/\/$/, "")}`;
}

/**
 * Optional renderer sections are all-or-nothing. Clearing an incomplete
 * optional object hides that section, rather than persisting a lesson that
 * exposes an empty field to a student.
 */
function normalizeOptionalSections(lesson: TeachingLesson): TeachingLesson {
  const translation = lesson.questionTranslation;
  const translationComplete = [
    translation.plainEnglish,
    translation.whatWeKnow,
    translation.whatWeFind,
    translation.wordToMath,
  ].every((value) => value.trim().length > 0);

  const practice = lesson.practiceQuestion;
  const practiceComplete =
    practice.question.trim().length > 0 &&
    practice.solution.trim().length > 0 &&
    practice.hints.length > 0 &&
    practice.hints.every((hint) => hint.trim().length > 0);

  return {
    ...lesson,
    questionTranslation: translationComplete
      ? translation
      : { plainEnglish: "", whatWeKnow: "", whatWeFind: "", wordToMath: "" },
    practiceQuestion: practiceComplete
      ? practice
      : { question: "", hints: [], solution: "" },
  };
}

async function generateOne(question: Question, baseUrl: string): Promise<GenerationResult> {
  const canonicalContext = canonicalContextFor(question);
  const response = await fetch(`${baseUrl}/api/solveQuestion/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: question.subject,
      question: question.question,
      mode: "basic",
      studentContext: "Preferred explanation depth: BASIC",
      bankContext: {
        questionId: question.id,
        ...canonicalContext,
        sourceHash: hashQuestionContent(question),
        answer: question.answer,
        hint: question.hint,
        steps: question.steps,
        keyConcepts: question.keyConcepts,
      },
    }),
  });

  if (!response.ok || !response.body) {
    const body = await response.text().catch(() => "");
    throw new Error(`Generation request failed (${response.status}): ${body}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let lineBuffer = "";
  let completed: GenerationEvent | undefined;
  let servedFromCache = false;
  let failureEvent: GenerationEvent | undefined;

  const processSseLine = (line: string): void => {
    if (!line.startsWith("data: ")) return;
    let event: GenerationEvent;
    try {
      event = JSON.parse(line.slice(6)) as GenerationEvent;
    } catch {
      return;
    }
    if (event.type === "cached") {
      // A process can stop after the API has generated a lesson but before
      // its atomic store write. Reusing this exact in-memory response is a
      // safe resume and does not make another model call.
      if (!event.lesson) throw new Error(`Cached response for ${question.id} has no lesson payload.`);
      completed = event;
      servedFromCache = true;
    }
    if (event.type === "error") {
      failureEvent = event;
      throw new Error(`Generation stream error for ${question.id}: ${event.code ?? "unknown"}`);
    }
    if (event.type === "done") completed = event;
  };

  try {
    while (!completed) {
      const { done, value } = await reader.read();
      if (done) {
        lineBuffer += decoder.decode();
        if (lineBuffer.trim()) processSseLine(lineBuffer.trimEnd());
        break;
      }
      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const line of lines) processSseLine(line);
    }
  } catch (error) {
    if (failureEvent) {
      throw new Error(JSON.stringify({
        questionId: question.id,
        code: failureEvent.code,
        failureCategory: failureEvent.failureCategory,
        finishReason: failureEvent.finishReason,
        responseStatus: failureEvent.responseStatus,
        attemptCount: failureEvent.attemptCount,
        maxOutputTokens: failureEvent.maxOutputTokens,
        promptTokens: failureEvent.promptTokens,
        completionTokens: failureEvent.completionTokens,
        cachedTokens: failureEvent.cachedTokens,
        estimatedCostUsd: failureEvent.estimatedCostUsd,
        totalLatencyMs: failureEvent.totalLatencyMs,
      }));
    }
    throw error;
  } finally {
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  if (!completed?.lesson) throw new Error(`Generation stream ended without a complete lesson for ${question.id}.`);

  const parsed = normalizeOptionalSections(parseLessonResponse(completed.lesson) as TeachingLesson);
  // Preserve the frozen bank answer verbatim. Pedagogy is AI-derived; the
  // approved final answer remains authoritative question-bank content.
  parsed.finalAnswer = { ...parsed.finalAnswer, answer: question.answer };
  // Keep generated metadata aligned to the canonical bank even if the model
  // chooses a narrower topic label or changes the stated difficulty.
  parsed.topic = question.topicName;
  parsed.difficulty = question.difficulty;

  return {
    lesson: parsed,
    servedFromCache,
    attemptCount: servedFromCache ? 0 : completed.attemptCount ?? 1,
    promptTokens: completed.promptTokens ?? 0,
    completionTokens: completed.completionTokens ?? 0,
    cachedTokens: completed.cachedTokens ?? 0,
    estimatedCostUsd: completed.estimatedCostUsd ?? 0,
    totalLatencyMs: completed.totalLatencyMs ?? 0,
    firstContentMs: completed.firstContentMs ?? -1,
  };
}

function argumentValues(name: string): string[] {
  const prefix = `--${name}=`;
  return process.argv
    .filter((argument) => argument.startsWith(prefix))
    .flatMap((argument) => argument.slice(prefix.length).split(","))
    .map((id) => id.trim())
    .filter(Boolean);
}

function requestedIds(
  allQuestions: Map<string, Question>,
  chunks: Map<string, ChunkRecord>,
): string[] {
  const explicit = argumentValues("ids");
  const targets = new Set<string>();

  if (args.has("--pilot")) PILOT_QUESTION_IDS.forEach((id) => targets.add(id));
  explicit.forEach((id) => targets.add(id));
  if (args.has("--missing")) {
    for (const question of allQuestions.values()) {
      if (!isStoredLessonValid(entryFor(chunks, question), question)) targets.add(question.id);
    }
  }
  if (args.has("--stale")) {
    for (const question of allQuestions.values()) {
      const entry = entryFor(chunks, question);
      if (entry && !isStoredLessonValid(entry, question)) targets.add(question.id);
    }
  }

  if (targets.size === 0) {
    throw new Error("Choose a target: --pilot, --ids=<id[,id]>, --missing, or --stale.");
  }

  for (const id of targets) {
    if (!allQuestions.has(id)) throw new Error(`Unknown or inactive question ID: ${id}`);
  }
  return [...targets];
}

async function main(): Promise<void> {
  const questions = await activeQuestions();
  const chunks = await readChunkIndex();
  const ids = requestedIds(questions, chunks);
  const baseUrl = apiBaseUrl();
  const totals = {
    modelCalls: 0,
    cacheRecoveries: 0,
    promptTokens: 0,
    completionTokens: 0,
    cachedTokens: 0,
    estimatedCostUsd: 0,
    totalLatencyMs: 0,
  };

  console.log(`Targeting ${ids.length} active question(s). Existing valid entries will be skipped.`);

  for (const [index, id] of ids.entries()) {
    const question = questions.get(id)!;
    const existing = entryFor(chunks, question);
    if (isStoredLessonValid(existing, question)) {
      if (existing.lesson.topic !== question.topicName || existing.lesson.difficulty !== question.difficulty) {
        const record = chunks.get(chunkKey(question))!;
        record.chunk.lessons[id] = {
          ...existing,
          lesson: {
            ...existing.lesson,
            topic: question.topicName,
            difficulty: question.difficulty,
          },
        };
        await persistChunk(record);
        console.log(`[${index + 1}/${ids.length}] NORMALIZED canonical metadata ${id}`);
      } else {
        console.log(`[${index + 1}/${ids.length}] SKIP valid ${id}`);
      }
      continue;
    }

    console.log(`[${index + 1}/${ids.length}] GENERATE ${id}`);
    const result = await generateOne(question, baseUrl);
    const entry: PreGeneratedLessonEntry = {
      questionId: id,
      sourceHash: hashQuestionContent(question),
      lesson: result.lesson,
    };
    if (!isStoredLessonValid(entry, question)) {
      const lesson = result.lesson;
      console.error(JSON.stringify({
        id,
        answerMatches: compareBankAnswers(lesson.finalAnswer.answer, question.answer).status === "match",
        keyConcepts: lesson.keyConcepts.length,
        intuition: {
          story: Boolean(lesson.intuition.story),
          visual: Boolean(lesson.intuition.visual),
          everyday: Boolean(lesson.intuition.everyday),
        },
        guidedSteps: lesson.guidedReasoning.length,
        guidedStepsWithWhatAndWhy: lesson.guidedReasoning.filter((step) => step.what && step.why).length,
        commonMistakes: lesson.commonMistakes.length,
        commonMistakesComplete: lesson.commonMistakes.filter(
          (mistake) => mistake.mistake && mistake.whyItHappens && mistake.howToAvoid,
        ).length,
        finalWhyCorrect: Boolean(lesson.finalAnswer.whyCorrect),
        similarExample: {
          problem: Boolean(lesson.simplerExample.problem),
          solution: Boolean(lesson.simplerExample.solution),
        },
        practice: {
          question: Boolean(lesson.practiceQuestion.question),
          hints: lesson.practiceQuestion.hints.length,
          solution: Boolean(lesson.practiceQuestion.solution),
        },
      }, null, 2));
      throw new Error(`Refusing incomplete or answer-mismatched lesson for ${id}.`);
    }

    const key = chunkKey(question);
    const record = chunks.get(key) ?? {
      path: chunkPath(question),
      chunk: {
        version: 1 as const,
        classNum: question.classNum,
        subject: question.subject,
        chapterId: question.chapterId,
        lessons: {},
      },
    };
    record.chunk.lessons[id] = entry;
    await persistChunk(record);
    chunks.set(key, record);
    if (result.servedFromCache) totals.cacheRecoveries += 1;
    else totals.modelCalls += result.attemptCount;
    totals.promptTokens += result.promptTokens;
    totals.completionTokens += result.completionTokens;
    totals.cachedTokens += result.cachedTokens;
    totals.estimatedCostUsd += result.estimatedCostUsd;
    totals.totalLatencyMs += result.totalLatencyMs;

    console.log(
      `[${index + 1}/${ids.length}] SAVED ${id} ` +
      `(${result.servedFromCache ? "cache recovery" : `${result.attemptCount} model attempt(s)`}; ` +
      `${result.promptTokens} prompt, ${result.completionTokens} completion, ${result.totalLatencyMs}ms)`,
    );
  }

  console.log(JSON.stringify(totals, null, 2));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});