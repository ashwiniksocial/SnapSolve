import { readFile, readdir, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { loadStudentVisibleQuestions } from "./academicReview.ts";
import {
  isStoredLessonValid,
  type PreGeneratedLessonChunk,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import { PILOT_QUESTION_IDS, PILOT_QUESTION_COUNT } from "./preGeneratedLessonPilot.ts";

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
  const match = source.match(/^export default "([A-Za-z0-9+/=]+";?)\s*$/);
  if (!match) throw new Error(`${file}: invalid compressed chapter chunk source.`);
  const decoded = gunzipSync(Buffer.from(match[1].replace(/;$/, ""), "base64")).toString("utf8");
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

  if (PILOT_QUESTION_IDS.length !== 20 || PILOT_QUESTION_COUNT !== 20) {
    errors.push(`Pilot manifest must contain exactly 20 IDs; found ${PILOT_QUESTION_IDS.length}.`);
  }

  for (const id of PILOT_QUESTION_IDS) {
    const question = questions.get(id);
    if (!question) {
      errors.push(`${id}: not active/student-visible.`);
      continue;
    }
    const entry = chunks.get(chunkKey(question))?.lessons[id];
    if (!isStoredLessonValid(entry, question)) {
      errors.push(`${id}: missing, stale, incomplete, or frozen-answer-mismatched.`);
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

  if (errors.length > 0) throw new Error(errors.join("\n"));

  console.log(JSON.stringify({
    pilotCount: PILOT_QUESTION_IDS.length,
    validLessons: PILOT_QUESTION_IDS.length,
    nonPregeneratedFallsThrough: true,
    unknownUniqueIdFallsThrough: true,
    chapterChunks: chunks.size,
    staticChunkBytes: bytes,
    staticChunkPath: "artifacts/homework-hero/src/data/generatedLessonChunks/",
  }, null, 2));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});