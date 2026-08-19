import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { loadStudentVisibleQuestions } from "./academicReview.ts";
import {
  getPreGeneratedBankLesson,
  isStoredLessonValid,
  type PreGeneratedLessonStore,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";
import { PILOT_QUESTION_IDS, PILOT_QUESTION_COUNT } from "./preGeneratedLessonPilot.ts";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const storePath = resolve(repoRoot, "artifacts/homework-hero/src/data/generatedDetailedLessons.json");

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
  const store = JSON.parse(await readFile(storePath, "utf8")) as PreGeneratedLessonStore;
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
    if (!isStoredLessonValid(store.lessons[id], question)) {
      errors.push(`${id}: missing, stale, incomplete, or frozen-answer-mismatched.`);
    }
  }

  // The static asset is opt-in by exact question ID. These checks ensure a
  // missing future ID and an existing non-pilot bank question retain the
  // existing streamed fallback rather than accidentally matching a lesson.
  const nonPilotQuestion = [...questions.values()].find(
    (question) => !PILOT_QUESTION_IDS.includes(question.id as typeof PILOT_QUESTION_IDS[number]),
  );
  if (!nonPilotQuestion || getPreGeneratedBankLesson(nonPilotQuestion)) {
    errors.push("Non-pregenerated bank fallback lookup is not clean.");
  }
  const pilotQuestion = questions.get(PILOT_QUESTION_IDS[0]);
  if (
    !pilotQuestion ||
    getPreGeneratedBankLesson({ ...pilotQuestion, id: "future-unique-question-id" })
  ) {
    errors.push("Unknown future question IDs must not match a derived lesson.");
  }

  const size = (await stat(storePath)).size;
  if (errors.length > 0) throw new Error(errors.join("\n"));

  console.log(JSON.stringify({
    pilotCount: PILOT_QUESTION_IDS.length,
    validLessons: PILOT_QUESTION_IDS.length,
    nonPregeneratedFallsThrough: true,
    unknownUniqueIdFallsThrough: true,
    staticAssetBytes: size,
    staticAssetPath: "artifacts/homework-hero/src/data/generatedDetailedLessons.json",
  }, null, 2));
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});