import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadStudentVisibleQuestions, type ReviewableQuestion } from "./academicReview.ts";
import {
  hashQuestionContent,
  isStoredLessonValid,
  type PreGeneratedLessonEntry,
  type PreGeneratedLessonStore,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import type { TeachingLesson } from "../../artifacts/homework-hero/src/data/solutionBank.ts";
import { parseLessonResponse } from "../../artifacts/api-server/src/lib/lessonTypes.ts";
import { PILOT_QUESTION_IDS } from "./preGeneratedLessonPilot.ts";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const storePath = resolve(repoRoot, "artifacts/homework-hero/src/data/generatedDetailedLessons.json");

type GenerationEvent = {
  type?: string;
  lesson?: unknown;
  code?: string;
  promptTokens?: number;
  completionTokens?: number;
  totalLatencyMs?: number;
  firstContentMs?: number;
};

type GenerationResult = {
  lesson: TeachingLesson;
  servedFromCache: boolean;
  promptTokens: number;
  completionTokens: number;
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

async function readStore(): Promise<PreGeneratedLessonStore> {
  try {
    const parsed = JSON.parse(await readFile(storePath, "utf8")) as Partial<PreGeneratedLessonStore>;
    if (parsed.version === 1 && parsed.lessons && typeof parsed.lessons === "object") {
      return parsed as PreGeneratedLessonStore;
    }
  } catch {
    // A missing store is the normal first-run state.
  }
  return { version: 1, lessons: {} };
}

async function persistStore(store: PreGeneratedLessonStore): Promise<void> {
  const tempPath = `${storePath}.tmp`;
  await mkdir(dirname(storePath), { recursive: true });
  await writeFile(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  await rename(tempPath, storePath);
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
  const response = await fetch(`${baseUrl}/api/solveQuestion/stream`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      subject: question.subject,
      question: question.question,
      mode: "basic",
      bankContext: {
        questionId: question.id,
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

  try {
    while (!completed) {
      const { done, value } = await reader.read();
      if (done) break;
      lineBuffer += decoder.decode(value, { stream: true });
      const lines = lineBuffer.split("\n");
      lineBuffer = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        let event: GenerationEvent;
        try {
          event = JSON.parse(line.slice(6)) as GenerationEvent;
        } catch {
          continue;
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
          throw new Error(`Generation stream error for ${question.id}: ${event.code ?? "unknown"}`);
        }
        if (event.type === "done") completed = event;
      }
    }
  } finally {
    try { reader.releaseLock(); } catch { /* already released */ }
  }

  if (!completed?.lesson) throw new Error(`Generation stream ended without a complete lesson for ${question.id}.`);

  const parsed = normalizeOptionalSections(parseLessonResponse(completed.lesson) as TeachingLesson);
  // Preserve the frozen bank answer verbatim. Pedagogy is AI-derived; the
  // approved final answer remains authoritative question-bank content.
  parsed.finalAnswer = { ...parsed.finalAnswer, answer: question.answer };

  return {
    lesson: parsed,
    servedFromCache,
    promptTokens: completed.promptTokens ?? 0,
    completionTokens: completed.completionTokens ?? 0,
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
  store: PreGeneratedLessonStore,
): string[] {
  const args = new Set(process.argv.slice(2));
  const explicit = argumentValues("ids");
  const targets = new Set<string>();

  if (args.has("--pilot")) PILOT_QUESTION_IDS.forEach((id) => targets.add(id));
  explicit.forEach((id) => targets.add(id));
  if (args.has("--missing")) {
    for (const question of allQuestions.values()) {
      if (!isStoredLessonValid(store.lessons[question.id], question)) targets.add(question.id);
    }
  }
  if (args.has("--stale")) {
    for (const question of allQuestions.values()) {
      const entry = store.lessons[question.id];
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
  const store = await readStore();
  const ids = requestedIds(questions, store);
  const baseUrl = apiBaseUrl();
  const totals = {
    modelCalls: 0,
    cacheRecoveries: 0,
    promptTokens: 0,
    completionTokens: 0,
    totalLatencyMs: 0,
  };

  console.log(`Targeting ${ids.length} active question(s). Existing valid entries will be skipped.`);

  for (const [index, id] of ids.entries()) {
    const question = questions.get(id)!;
    if (isStoredLessonValid(store.lessons[id], question)) {
      console.log(`[${index + 1}/${ids.length}] SKIP valid ${id}`);
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
        answerMatches: lesson.finalAnswer.answer === question.answer,
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

    store.lessons[id] = entry;
    await persistStore(store);
    if (result.servedFromCache) totals.cacheRecoveries += 1;
    else totals.modelCalls += 1;
    totals.promptTokens += result.promptTokens;
    totals.completionTokens += result.completionTokens;
    totals.totalLatencyMs += result.totalLatencyMs;

    console.log(
      `[${index + 1}/${ids.length}] SAVED ${id} ` +
      `(${result.servedFromCache ? "cache recovery" : "model"}; ` +
      `${result.promptTokens} prompt, ${result.completionTokens} completion, ${result.totalLatencyMs}ms)`,
    );
  }

  const estimatedCost = (totals.promptTokens * 0.00000015) + (totals.completionTokens * 0.0000006);
  console.log(JSON.stringify({ ...totals, estimatedCostUsd: estimatedCost }, null, 2));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});