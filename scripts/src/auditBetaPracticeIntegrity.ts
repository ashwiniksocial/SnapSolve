import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import {
  loadStudentVisibleQuestions,
} from "./academicReview.ts";
import { getStudentFacingSubject } from "../../artifacts/homework-hero/src/data/questions/studentFacingSubject.ts";
import {
  getDetailedLessonQualityFlags,
  hashQuestionContent,
  isCompleteDetailedLesson,
  type PreGeneratedLessonChunk,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import {
  applyCanonicalBankMetadata,
  getCanonicalPracticeDifficulty,
  getCanonicalPracticeMetadata,
} from "../../artifacts/homework-hero/src/services/canonicalPracticeMetadata.ts";
import type { AIResponse } from "../../artifacts/homework-hero/src/data/solutionBank.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const chunksDirectory = resolve(repoRoot, "artifacts/homework-hero/src/data/generatedLessonChunks");
const BETA_SUBJECTS = new Set(["Mathematics", "Physics", "Chemistry", "Biology", "Information Technology"]);

function chunkKey(question: Pick<Question, "classNum" | "subject" | "chapterId">): string {
  return JSON.stringify([question.classNum, question.subject, question.chapterId]);
}

async function readChunks(): Promise<PreGeneratedLessonChunk[]> {
  const files = (await readdir(chunksDirectory)).filter((file) => file.endsWith(".ts")).sort();
  return Promise.all(files.map(async (file) => {
    const source = await readFile(resolve(chunksDirectory, file), "utf8");
    const match = source.match(/^export default "([A-Za-z0-9+/=]+";?)\s*$/);
    if (!match) throw new Error(`${file}: invalid compressed lesson chunk source.`);
    return JSON.parse(
      gunzipSync(Buffer.from(match[1].replace(/;$/, ""), "base64")).toString("utf8"),
    ) as PreGeneratedLessonChunk;
  }));
}

function increment(bucket: Record<string, number>, key: string): void {
  bucket[key] = (bucket[key] ?? 0) + 1;
}

async function main() {
  const activeQuestions = (await loadStudentVisibleQuestions())
    .filter((question) => question.classNum === 9 && BETA_SUBJECTS.has(question.subject))
    .map((question) => ({
      ...question,
      difficulty: question.difficulty as Question["difficulty"],
      questionType: question.questionType as Question["questionType"],
    })) as Question[];
  const chaptersById = new Map(
    activeQuestions.map((question) => [question.chapterId, {
      id: question.chapterId,
      subject: question.subject,
      name: question.chapterName,
    }]),
  );
  const questionsById = new Map<string, Question>();
  const structuralErrors: string[] = [];
  const metadataMismatches: string[] = [];
  const practicePathMismatches: string[] = [];
  const solutionPathMismatches: string[] = [];
  const readinessPathMismatches: string[] = [];
  const questionNumbers = new Map<string, Set<number>>();
  const counts = {
    subject: {} as Record<string, number>,
    chapter: {} as Record<string, number>,
    difficulty: {} as Record<string, number>,
    type: {} as Record<string, number>,
    topic: {} as Record<string, number>,
    studentFacingSubject: {} as Record<string, number>,
  };

  for (const question of activeQuestions) {
    if (questionsById.has(question.id)) structuralErrors.push(`Duplicate question ID: ${question.id}`);
    questionsById.set(question.id, question);
    // The bank intentionally contains two frozen canonical ID families:
    // c9-math-...-t1-q01 and bo-bio-9-ch01-con-001. Validate a safe,
    // hyphen-delimited identifier without rewriting either family.
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(question.id)) {
      structuralErrors.push(`Invalid canonical question ID: ${question.id}`);
    }
    const chapter = chaptersById.get(question.chapterId);
    if (!chapter) {
      metadataMismatches.push(`${question.id}: chapter ${question.chapterId} is not active.`);
    } else if (chapter.subject !== question.subject || chapter.name !== question.chapterName) {
      metadataMismatches.push(`${question.id}: chapter subject/name differs from chapter metadata.`);
    }
    if (!question.topicId || !question.topicName || !question.question || !question.answer || !question.difficulty) {
      metadataMismatches.push(`${question.id}: missing required Practice metadata.`);
    }

    // Exercise the exact pure resolvers used by the student-facing paths.
    const practiceMetadata = getCanonicalPracticeMetadata(question);
    if (practiceMetadata.difficulty !== question.difficulty) {
      practicePathMismatches.push(`${question.id}: Practice resolver ${practiceMetadata.difficulty} ≠ canonical ${question.difficulty}.`);
    }
    if (getCanonicalPracticeDifficulty(question) !== question.difficulty) {
      readinessPathMismatches.push(`${question.id}: readiness resolver differs from canonical difficulty.`);
    }
    // Deliberately start with non-authoritative lesson metadata. The Solution
    // overlay must replace it with the bank authority for every active ID.
    const solutionMetadata = applyCanonicalBankMetadata({
      id: `audit-${question.id}`,
      subject: "Mathematics",
      topic: "non-canonical topic",
      difficulty: "Medium",
      detectedQuestion: "non-canonical question",
      keyConcepts: [],
      similarQuestions: [],
      steps: [],
      finalAnswer: "",
      lesson: {
        topic: "non-canonical topic",
        difficulty: "Medium",
      },
    } as AIResponse, question);
    if (
      solutionMetadata.difficulty !== question.difficulty ||
      solutionMetadata.topic !== question.topicName ||
      solutionMetadata.subject !== question.subject ||
      solutionMetadata.detectedQuestion !== question.question ||
      solutionMetadata.lesson?.difficulty !== question.difficulty
    ) {
      solutionPathMismatches.push(`${question.id}: Solution overlay differs from canonical metadata.`);
    }
    const numberKey = `${question.subject}::${question.chapterId}`;
    const used = questionNumbers.get(numberKey) ?? new Set<number>();
    const displayNumber = used.size + 1;
    if (used.has(displayNumber)) structuralErrors.push(`${question.id}: duplicate chapter-local display Q${displayNumber}.`);
    used.add(displayNumber);
    questionNumbers.set(numberKey, used);
    increment(counts.subject, question.subject);
    increment(counts.studentFacingSubject, getStudentFacingSubject(question.subject));
    increment(counts.chapter, `${question.subject} · ${question.chapterName}`);
    increment(counts.difficulty, question.difficulty);
    increment(counts.type, question.questionType ?? "Unclassified");
    increment(counts.topic, `${question.subject} · ${question.topicName}`);
  }

  const chunks = await readChunks();
  const chunkKeys = new Set<string>();
  const lessonIds = new Set<string>();
  const lessonMetadataMismatches: string[] = [];
  const lessonQualityFlags: Array<{ questionId: string; flags: string[] }> = [];
  for (const chunk of chunks) {
    const key = JSON.stringify([chunk.classNum, chunk.subject, chunk.chapterId]);
    if (chunkKeys.has(key)) structuralErrors.push(`Duplicate lesson chunk: ${key}`);
    chunkKeys.add(key);
    for (const [questionId, entry] of Object.entries(chunk.lessons)) {
      if (lessonIds.has(questionId)) structuralErrors.push(`Duplicate generated lesson ID: ${questionId}`);
      lessonIds.add(questionId);
      const question = questionsById.get(questionId);
      if (!question) {
        lessonMetadataMismatches.push(`${questionId}: derived lesson has no active canonical question.`);
        continue;
      }
      if (chunkKey(question) !== key) lessonMetadataMismatches.push(`${questionId}: lesson is stored in the wrong chapter chunk.`);
      if (entry.questionId !== questionId) lessonMetadataMismatches.push(`${questionId}: entry ID and object key differ.`);
      if (entry.sourceHash !== hashQuestionContent(question)) lessonMetadataMismatches.push(`${questionId}: source hash is stale.`);
      if (entry.lesson.finalAnswer.answer !== question.answer) lessonMetadataMismatches.push(`${questionId}: final answer differs from frozen answer.`);
      if (entry.lesson.topic !== question.topicName) lessonMetadataMismatches.push(`${questionId}: lesson topic differs from canonical topic.`);
      if (entry.lesson.difficulty !== question.difficulty) lessonMetadataMismatches.push(`${questionId}: lesson difficulty differs from canonical difficulty.`);
      if (!isCompleteDetailedLesson(entry.lesson)) lessonMetadataMismatches.push(`${questionId}: lesson is structurally incomplete.`);
      const flags = getDetailedLessonQualityFlags(entry.lesson, question);
      if (flags.length) lessonQualityFlags.push({ questionId, flags });
    }
  }

  const report = {
    passed: structuralErrors.length === 0 &&
      metadataMismatches.length === 0 &&
      practicePathMismatches.length === 0 &&
      solutionPathMismatches.length === 0 &&
      readinessPathMismatches.length === 0,
    scope: {
      activeClass9Questions: activeQuestions.length,
      activeClass9Chapters: chaptersById.size,
      generatedLessons: lessonIds.size,
      generatedLessonFallbacks: activeQuestions.length - lessonIds.size,
      generatedChunks: chunks.length,
    },
    structuralErrors,
    metadataMismatches,
    effectiveMetadataPaths: {
      practiceMismatchCount: practicePathMismatches.length,
      solutionMismatchCount: solutionPathMismatches.length,
      readinessMismatchCount: readinessPathMismatches.length,
      practiceMismatches: practicePathMismatches,
      solutionMismatches: solutionPathMismatches,
      readinessMismatches: readinessPathMismatches,
    },
    derivedLessonMetadataWarnings: lessonMetadataMismatches,
    lessonQualityFlags,
    counts,
  };
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});