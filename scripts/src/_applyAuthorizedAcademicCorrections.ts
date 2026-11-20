import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { gunzipSync, gzipSync } from "node:zlib";
import { loadStudentVisibleQuestions } from "./academicReview.ts";
import {
  hashQuestionContent,
  isStoredLessonValid,
} from "../../artifacts/homework-hero/src/data/preGeneratedLessons.ts";
import type { Question } from "../../artifacts/homework-hero/src/data/questions/types.ts";

const ids = [
  "c9-phy-ch1-t1-q01",
  "bo-bio-9-ch01-con-009",
  "c9-m-ch1-t5-q09",
  "bo-chm-9-ch02-nce-001",
] as const;

const discovered = await loadStudentVisibleQuestions();
const questions = new Map(
  discovered.map((question) => [
    question.id,
    { ...question, questionType: question.questionType as Question["questionType"] } as Question,
  ]),
);
const [physics, biology, mathematics, chemistry] = ids.map((id) => questions.get(id));
if (!physics || !biology || !mathematics || !chemistry) {
  throw new Error("An authorized active question was not found.");
}

type Chunk = {
  version: 1;
  classNum: number;
  subject: string;
  chapterId: string;
  lessons: Record<string, {
    questionId: string;
    sourceHash: string;
    lesson: Record<string, any>;
  }>;
};

const edits = [
  {
    filename: "9--Physics--phy-ch1.ts",
    question: physics,
    edit(chunk: Chunk) {
      const entry = chunk.lessons[physics.id];
      if (!entry) throw new Error("Physics lesson is missing.");
      const lesson = entry.lesson;
      lesson.intuition.story =
        "If you walk around a block to your friend’s house, the route length is distance; the directed straight-line change from your home to your friend is displacement.";
      lesson.intuition.visual =
        "Picture an arrow from your starting point to your destination. Its length is the magnitude of displacement, and the arrow points in the direction from start to finish.";
      lesson.intuition.everyday =
        "A shortcut may reduce the distance you walk. Displacement is the directed change from where you started to where you finished.";
      lesson.questionTranslation.whatWeKnow =
        "We are told that: 1. Distance is the total path length, not displacement. 2. Displacement is the net change in position from initial to final and includes magnitude and direction. 3. Speed multiplied by time is not a general definition of displacement. 4. Rate of change of velocity is acceleration, not displacement.";
      lesson.questionTranslation.wordToMath =
        "displacement → net change in position from initial to final (magnitude and direction)";
      lesson.guidedReasoning[0].why =
        "Distance measures the whole route. Displacement is the directed change from the initial to final position: its magnitude is the straight-line distance, and its direction points from start to finish.";
      lesson.guidedReasoning[2].what =
        "Option (b) states the net change in position from initial to final, including magnitude and direction.";
      lesson.guidedReasoning[2].why =
        "This is the vector definition of displacement. Its magnitude is the shortest straight-line distance between the positions, and its direction is from the initial position to the final position.";
      lesson.finalAnswer.answer = physics.answer;
      lesson.finalAnswer.whyCorrect =
        "Displacement is the net change in position. Its magnitude is the shortest straight-line distance from the initial to final position, and its direction points from initial to final.";
      lesson.keyConcepts = lesson.keyConcepts.map((value: string) =>
        value === "Shortest path" ? "Magnitude and direction" : value
      );
      entry.sourceHash = hashQuestionContent(physics);
    },
  },
  {
    filename: "9--Biology--bio-ch01.ts",
    question: biology,
    edit(chunk: Chunk) {
      const entry = chunk.lessons[biology.id];
      if (!entry) throw new Error("Biology lesson is missing.");
      const lesson = entry.lesson;
      lesson.questionTranslation.whatWeKnow = lesson.questionTranslation.whatWeKnow.replace(
        "The cell wall allows all substances to pass through.",
        "The cell wall is permeable, allowing water and some dissolved minerals to pass through.",
      );
      lesson.guidedReasoning[1].why = lesson.guidedReasoning[1].why.replace(
        "In contrast, the cell wall is fully permeable, allowing all substances to pass freely, which is important for nutrient absorption.",
        "In contrast, the cell wall is permeable, allowing water and some dissolved minerals through. Unlike the plasma membrane, it does not selectively regulate their passage.",
      );
      lesson.guidedReasoning[1].result =
        "Plasma membrane: selectively permeable; cell wall: permeable, allowing water and some dissolved minerals through.";
      lesson.finalAnswer.answer = biology.answer;
      lesson.practiceQuestion.solution = lesson.practiceQuestion.solution.replace(
        "the cell wall is fully permeable, allowing all substances to pass through",
        "the cell wall is permeable, allowing water and some dissolved minerals to pass through",
      );
      lesson.keyConcepts = lesson.keyConcepts.map((value: string) =>
        value === "fully permeable" ? "permeable cell wall" : value
      );
      entry.sourceHash = hashQuestionContent(biology);
    },
  },
  {
    filename: "9--Mathematics--ch1.ts",
    question: mathematics,
    edit(chunk: Chunk) {
      const entry = chunk.lessons[mathematics.id];
      if (!entry) throw new Error("Mathematics lesson is missing.");
      entry.lesson.practiceQuestion.question =
        "If y = 7 + 4√3, find √y + 1/√y.";
      entry.lesson.practiceQuestion.hints = [
        "Look for a perfect-square form: (2 + √3)².",
        "Use the positive square root, then rationalise 1/(2 + √3).",
        "The reciprocal is 2 − √3; add the conjugate pair.",
      ];
      entry.lesson.practiceQuestion.solution =
        "First, write y = 7 + 4√3 = (2 + √3)². Since y is positive, √y = 2 + √3. Next, rationalise the reciprocal: 1/√y = 1/(2 + √3) × (2 − √3)/(2 − √3) = (2 − √3)/(4 − 3) = 2 − √3. Finally, √y + 1/√y = (2 + √3) + (2 − √3) = 4.";
    },
  },
  {
    filename: "9--Chemistry--chem-ch02.ts",
    question: chemistry,
    edit(chunk: Chunk) {
      const entry = chunk.lessons[chemistry.id];
      if (!entry) throw new Error("Chemistry lesson is missing.");
      entry.lesson.practiceQuestion.question =
        "Compare salt dissolved in water with sand mixed in water. Classify each as homogeneous or heterogeneous, and explain what happens to the visible particles.";
      entry.lesson.practiceQuestion.hints = [
        "Check whether each mixture has a uniform composition throughout.",
        "After stirring, what happens to the salt? What happens to the sand?",
        "Use visible particles or settling to distinguish the mixtures.",
      ];
      entry.lesson.practiceQuestion.solution =
        "Salt dissolves in water and forms a uniform solution: its composition is the same throughout and the dissolved salt is not visible. This is a homogeneous mixture. Sand does not dissolve; its particles remain visible and settle. This is a heterogeneous mixture.";
    },
  },
];

for (const { filename, question, edit } of edits) {
  if (process.env.AUTHORIZED_CHUNK && process.env.AUTHORIZED_CHUNK !== filename) continue;
  const path = new URL(
    `../../artifacts/homework-hero/src/data/generatedLessonChunks/${filename}`,
    import.meta.url,
  );
  const baselineChunkPath = filename === "9--Physics--phy-ch1.ts"
    ? "artifacts/homework-hero/src/data/generatedLessonChunks/9--Physics--phy-ch1.ts"
    : filename === "9--Biology--bio-ch01.ts"
      ? "artifacts/homework-hero/src/data/generatedLessonChunks/9--Biology--bio-ch01.ts"
      : undefined;
  const source = baselineChunkPath
    ? execFileSync("git", ["show", `HEAD:${baselineChunkPath}`], { encoding: "utf8" })
    : await readFile(path, "utf8");
  const match = source.match(/^export default "([A-Za-z0-9+/=]+)";\s*$/);
  if (!match) throw new Error(`Invalid existing chunk: ${filename}`);
  const chunk = JSON.parse(
    gunzipSync(Buffer.from(match[1], "base64")).toString("utf8"),
  ) as Chunk;
  edit(chunk);
  const entry = chunk.lessons[question.id];
  if (!isStoredLessonValid(entry, question)) {
    throw new Error(`Existing validity check failed for ${question.id}`);
  }
  const encoded = gzipSync(JSON.stringify(chunk)).toString("base64");
  if (process.env.COMPARE_CURRENT) {
    const currentSource = await readFile(path, "utf8");
    const currentMatch = currentSource.match(/^export default "([A-Za-z0-9+/=]+)";\s*$/);
    const current = currentMatch?.[1] ?? "";
    let firstDifference = 0;
    while (firstDifference < encoded.length && current[firstDifference] === encoded[firstDifference]) {
      firstDifference += 1;
    }
    console.log(JSON.stringify({
      filename,
      expectedLength: encoded.length,
      currentLength: current.length,
      firstDifference,
      expectedContext: encoded.slice(Math.max(0, firstDifference - 16), firstDifference + 24),
      currentContext: current.slice(Math.max(0, firstDifference - 16), firstDifference + 24),
    }, null, 2));
    continue;
  }
  console.log(`--- ${filename} | ${question.id} | ${entry.sourceHash} | ${encoded.length} chars ---`);
  console.log(`export default "${encoded}";`);
}
