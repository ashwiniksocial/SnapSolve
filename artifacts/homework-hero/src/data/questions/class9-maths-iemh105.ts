import type { Question, ChapterMeta } from "./types";

export const CHAPTER_META: ChapterMeta = {
  id: "iemh105",
  name: "I’m Up and Down, and Round and Round",
  classNum: 9,
  subject: "Mathematics",
  canonicalChapterId: "iemh105",
  curriculumStatus: "ACTIVE",
  topics: [
    { id: "t1", name: "Definitions",                             questionCount: 0 },
    { id: "t2", name: "Symmetries of a Circle",                  questionCount: 0 },
    { id: "t3", name: "How Many Circles?",                       questionCount: 0 },
    { id: "t4", name: "Chords and the Angles They Subtend",      questionCount: 0 },
    { id: "t5", name: "Midpoints and Perpendicular Bisectors of Chords", questionCount: 0 },
    { id: "t6", name: "Distance of Chords from the Centre",      questionCount: 0 },
    { id: "t7", name: "Angles Subtended by an Arc",              questionCount: 0 },
    { id: "t8", name: "Concyclicity of Points",                  questionCount: 0 },
  ],
};

// Questions will be authored from iemh105.pdf (Ganita Manjari Part I, Chapter 5).
// Do not fabricate questions; this array must remain empty until authoring is complete.
export const QUESTIONS: Question[] = [];
