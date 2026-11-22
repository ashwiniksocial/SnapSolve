import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { loadStudentVisibleQuestions } from "./academicReview.ts";
import {
  hashQuestionContent,
  isCompleteDetailedLesson,
  isStoredLessonValid,
  type PreGeneratedLessonChunk,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import { PILOT_QUESTION_IDS, PILOT_QUESTION_COUNT } from "./preGeneratedLessonPilot.ts";
import {
  assessTeachingLessonAnswerLast,
  compareBankAnswers,
} from "../../lib/api-zod/src/bankAnswerIntegrity.ts";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const chunksDirectory = resolve(repoRoot, "artifacts/homework-hero/src/data/generatedLessonChunks");

function chunkKey(question: Pick<Question, "classNum" | "subject" | "chapterId">): string {
  return JSON.stringify([question.classNum, question.subject, question.chapterId]);
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
  const singleString = source.match(/^export default "([A-Za-z0-9+/=]+)";?\s*$/);
  const joinedStrings = source.match(/^export default \[\s*([\s\S]*?)\s*\]\.join\(""\);\s*$/);
  let encoded = singleString?.[1];
  if (!encoded && joinedStrings) {
    const body = joinedStrings[1];
    const segments = [...body.matchAll(/"([A-Za-z0-9+/=]+)"/g)];
    const remainder = body.replace(/"([A-Za-z0-9+/=]+)"/g, "").replace(/[\s,]/g, "");
    if (segments.length > 0 && remainder.length === 0) {
      encoded = segments.map((segment) => segment[1]).join("");
    }
  }
  if (!encoded) throw new Error(`${file}: invalid compressed chapter chunk source.`);
  const decoded = gunzipSync(Buffer.from(encoded, "base64")).toString("utf8");
  const parsed = JSON.parse(decoded) as unknown;
  if (!isChunk(parsed)) throw new Error(`${file}: invalid chapter chunk data.`);
  return parsed;
}

async function readChunks(): Promise<{
  chunks: Map<string, PreGeneratedLessonChunk>;
  entryIds: Set<string>;
  bytes: number;
}> {
  const files = (await readdir(chunksDirectory))
    .filter((file) => file.endsWith(".ts"))
    .sort();
  const chunks = new Map<string, PreGeneratedLessonChunk>();
  const entryIds = new Set<string>();
  let bytes = 0;

  for (const file of files) {
    const path = resolve(chunksDirectory, file);
    const parsed = decodeChunkSource(await readFile(path, "utf8"), file);
    const key = chunkKey(parsed);
    if (chunks.has(key)) throw new Error(`${file}: duplicate chapter chunk metadata.`);
    for (const id of Object.keys(parsed.lessons)) {
      if (entryIds.has(id)) throw new Error(`${file}: duplicate lesson ID ${id}.`);
      entryIds.add(id);
    }
    chunks.set(key, parsed);
    bytes += (await stat(path)).size;
  }
  return { chunks, entryIds, bytes };
}

async function main(): Promise<void> {
  const discovered = await loadStudentVisibleQuestions();
  const questions = new Map(
    discovered.map((question) => [
      question.id,
      {
        ...question,
        questionType: question.questionType as Question["questionType"],
      } as Question,
    ]),
  );
  const { chunks, entryIds, bytes } = await readChunks();
  const errors: string[] = [];
  const lessonChecks: Array<{
    questionId: string;
    structural: "PASS" | "FAIL";
    answerLast: "CLEAR" | "LEAK" | "REVIEW" | "NOT CHECKED";
    section?: string;
    disclosure?: string;
    reason?: string;
  }> = [];

  if (PILOT_QUESTION_IDS.length !== 26 || PILOT_QUESTION_COUNT !== 26) {
    errors.push(`Pilot manifest must contain exactly 26 IDs; found ${PILOT_QUESTION_IDS.length}.`);
  }

  for (const id of PILOT_QUESTION_IDS) {
    const question = questions.get(id);
    if (!question) {
      errors.push(`${id}: not active/student-visible.`);
      lessonChecks.push({ questionId: id, structural: "FAIL", answerLast: "NOT CHECKED" });
      continue;
    }
    const entry = chunks.get(chunkKey(question))?.lessons[id];
    if (!entry) {
      lessonChecks.push({ questionId: id, structural: "FAIL", answerLast: "NOT CHECKED" });
      errors.push(`${id}: missing derived lesson.`);
      continue;
    }
    const structural = isCompleteDetailedLesson(entry.lesson);
    const answerComparison = compareBankAnswers(entry.lesson.finalAnswer?.answer ?? "", question.answer);
    const intermediateText = [
      ...question.steps.slice(0, -1).flatMap((step) => [
        step.title,
        step.explanation,
        step.formula,
        step.result,
      ]),
    ].filter((value): value is string => typeof value === "string");
    const answerLast = assessTeachingLessonAnswerLast(entry.lesson, question.answer, {
      canonicalQuestion: question.question,
      intermediateText,
    });
    lessonChecks.push({
      questionId: id,
      structural: structural ? "PASS" : "FAIL",
      answerLast: answerLast.status === "clear"
        ? "CLEAR"
        : answerLast.status === "leak" ? "LEAK" : "REVIEW",
      ...("section" in answerLast ? { section: answerLast.section } : {}),
      ...("disclosure" in answerLast ? { disclosure: answerLast.disclosure } : {}),
      ...("reason" in answerLast ? { reason: answerLast.reason } : {}),
    });
    const sourceHashMatches = entry.sourceHash === hashQuestionContent(question);
    if (!isStoredLessonValid(entry, question)) {
      const details = [
        !structural ? "structural invalidity" : "",
        answerComparison.status !== "match" ? `canonical answer ${answerComparison.status}` : "",
        answerLast.status !== "clear"
          ? `answer-last ${answerLast.status} in ${"section" in answerLast ? answerLast.section : "finalAnswer"}`
          : "",
        !sourceHashMatches
          ? "source hash mismatch"
          : "",
      ].filter(Boolean).join(", ");
      errors.push(`${id}: ${details || "stored lesson failed validation"}.`);
    }
  }

  if (entryIds.size !== PILOT_QUESTION_COUNT) {
    errors.push(`Expected exactly ${PILOT_QUESTION_COUNT} derived pilot lessons; found ${entryIds.size}.`);
  }

  // The static asset is opt-in by its authoritative chapter and exact question
  // ID. These checks ensure a missing future ID and an existing non-pilot bank
  // question retain the existing streamed fallback.
  const nonPilotQuestion = [...questions.values()].find(
    (question) => !PILOT_QUESTION_IDS.includes(question.id as typeof PILOT_QUESTION_IDS[number]),
  );
  if (!nonPilotQuestion || chunks.get(chunkKey(nonPilotQuestion))?.lessons[nonPilotQuestion.id]) {
    errors.push("Non-pregenerated bank fallback lookup is not clean.");
  }
  const pilotQuestion = questions.get(PILOT_QUESTION_IDS[0]);
  if (
    !pilotQuestion ||
    chunks.get(chunkKey(pilotQuestion))?.lessons["future-unique-question-id"]
  ) {
    errors.push("Unknown future question IDs must not match a derived lesson.");
  }

  console.log(JSON.stringify({
    pilotCount: PILOT_QUESTION_IDS.length,
    structuralValidLessons: lessonChecks.filter((check) => check.structural === "PASS").length,
    answerLastClearLessons: lessonChecks.filter((check) => check.answerLast === "CLEAR").length,
    answerLastLeaks: lessonChecks.filter((check) => check.answerLast === "LEAK").length,
    answerLastReviews: lessonChecks.filter((check) => check.answerLast === "REVIEW").length,
    validLessons: lessonChecks.filter(
      (check) => check.structural === "PASS" && check.answerLast === "CLEAR",
    ).length,
    lessonChecks,
    nonPregeneratedFallsThrough: true,
    unknownUniqueIdFallsThrough: true,
    chapterChunks: chunks.size,
    staticChunkBytes: bytes,
    staticChunkPath: "artifacts/homework-hero/src/data/generatedLessonChunks/",
  }, null, 2));
  if (errors.length > 0) throw new Error(errors.join("\n"));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});