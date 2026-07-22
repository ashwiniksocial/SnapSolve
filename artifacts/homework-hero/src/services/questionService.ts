/**
 * Question Service — query layer over the static question bank.
 *
 * All public functions are pure and return new arrays (no mutation).
 * Designed to be swappable with Firebase Firestore calls:
 *   - Replace `ALL_QUESTIONS` reads with `getDocs(query(...))`.
 *   - Function signatures stay identical.
 */

import type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType, EffectiveQuestionType } from "@/data/questions";

export type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType, EffectiveQuestionType };

// ── Module-level question bank cache ────────────────────────────────────────
// Start empty; populated by preloadQBank().  Synchronous query functions below
// return empty results until preloadQBank() resolves.  Pages other than
// Practice will show empty lists if visited before Practice — acceptable beta
// degradation given the normal navigation flow (Home → Practice → Solution).
let ALL_CHAPTERS: ChapterMeta[] = [];
let ALL_QUESTIONS: Question[] = [];

type _BundleKey = "class9" | "class678";
const _loaded = new Set<_BundleKey>();

/** Lazily load the question bank for the given class into the module cache.
 *  Safe to call multiple times — deduplicates by bundle key so each bundle
 *  is fetched at most once per session.
 */
export async function preloadQBank(classNum: number): Promise<void> {
  if (classNum === 9) {
    if (_loaded.has("class9")) return;
    const { CHAPTERS, QUESTIONS } = await import("@/data/questions/class9-bundle");
    ALL_CHAPTERS  = [...ALL_CHAPTERS,  ...CHAPTERS];
    ALL_QUESTIONS = [...ALL_QUESTIONS, ...QUESTIONS];
    _loaded.add("class9");
  } else {
    // Classes 6, 7, 8 share a single bundle
    if (_loaded.has("class678")) return;
    const { CHAPTERS, QUESTIONS } = await import("@/data/questions/class678-bundle");
    ALL_CHAPTERS  = [...ALL_CHAPTERS,  ...CHAPTERS];
    ALL_QUESTIONS = [...ALL_QUESTIONS, ...QUESTIONS];
    _loaded.add("class678");
  }
}

// ─── Chapter / topic navigation ───────────────────────────────────────────────

/** Internal domain labels that make up the student-facing "Science" subject. */
const SCIENCE_DOMAINS = ["Physics", "Chemistry", "Biology", "Earth Science"];

/**
 * Official Class 9 Science student-facing chapter display sequence.
 * Follows the official NCERT Exploration textbook order: iesc101 → iesc113.
 * Key: internal chapterId — Value: 1-based continuous display number (Ch.1–13).
 */
export const SCIENCE_DISPLAY_ORDER_CLASS9: Readonly<Record<string, number>> = {
  "chem-ch01":  1,  // iesc101 — Matter in Our Surroundings
  "bio-ch01":   2,  // iesc102 — Cell — The Fundamental Unit of Life
  "bio-ch02":   3,  // iesc103 — Tissues
  "phy-ch1":    4,  // iesc104 — Motion
  "chem-ch02":  5,  // iesc105 — Exploring Mixtures and Their Separation
  "phy-ch2":    6,  // iesc106 — Force and Laws of Motion
  "phy-ch4":    7,  // iesc107 — Work, Energy and Simple Machines
  "chem-ch04":  8,  // iesc108 — Structure of an Atom
  "chem-ch03":  9,  // iesc109 — Atoms and Molecules
  "phy-ch5":   10,  // iesc110 — Sound
  "bio-ch05":  11,  // iesc111 — Reproduction in Plants and Animals
  "bio-ch03":  12,  // iesc112 — Diversity in Living Organisms
  "esc-ch01":  13,  // iesc113 — Earth as a System: Energy, Matter and Life
};

/**
 * Official Class 9 Mathematics student-facing chapter display sequence.
 * Follows the official NCERT Ganita Manjari Part I order: iemh101 → iemh108.
 * Key: internal chapterId — Value: 1-based display number (Ch.1–8).
 */
export const MATHS_DISPLAY_ORDER_CLASS9: Readonly<Record<string, number>> = {
  "ch3":  1,  // iemh101 — Orienting Yourself: The Use of Coordinates
  "ch2":  2,  // iemh102 — Introduction to Linear Polynomials
  "ch1":  3,  // iemh103 — The World of Numbers
  "ch16": 4,  // iemh104 — Exploring Algebraic Identities
  "ch4":  5,  // iemh105 — I'm Up and Down, and Round and Round
  "ch18": 6,  // iemh106 — Measuring Space: Perimeter and Area
  "ch15": 7,  // iemh107 — The Mathematics of Maybe: Introduction to Probability
  "ch17": 8,  // iemh108 — Predicting What Comes Next: Exploring Sequences and Progressions
};

/**
 * All chapters for a given class + subject, in official textbook order.
 * "Science" resolves to the union of all Science domain chapters sorted by
 * the official NCERT Exploration textbook sequence (iesc101–iesc113).
 * Class 9 Mathematics is sorted by the official Ganita Manjari Part I sequence (iemh101–iemh108).
 */
export function getChapters(classNum: number, subject: string): ChapterMeta[] {
  if (subject === "Science") {
    const scienceChapters = ALL_CHAPTERS.filter(
      (c) => c.classNum === classNum && SCIENCE_DOMAINS.includes(c.subject) && !c.cbseDeleted
    );
    return scienceChapters.sort(
      (a, b) => (SCIENCE_DISPLAY_ORDER_CLASS9[a.id] ?? 999) - (SCIENCE_DISPLAY_ORDER_CLASS9[b.id] ?? 999)
    );
  }
  if (subject === "Mathematics" && classNum === 9) {
    const mathChapters = ALL_CHAPTERS.filter(
      (c) => c.classNum === classNum && c.subject === subject && !c.cbseDeleted
    );
    return mathChapters.sort(
      (a, b) => (MATHS_DISPLAY_ORDER_CLASS9[a.id] ?? 999) - (MATHS_DISPLAY_ORDER_CLASS9[b.id] ?? 999)
    );
  }
  return ALL_CHAPTERS.filter(
    (c) => c.classNum === classNum && c.subject === subject && !c.cbseDeleted
  );
}

/** All topics for a specific chapter. */
export function getTopics(chapterId: string): TopicMeta[] {
  return ALL_CHAPTERS.find((c) => c.id === chapterId)?.topics ?? [];
}

// ─── Question querying ────────────────────────────────────────────────────────

export interface QuestionFilter {
  classNum?: number;
  subject?: string;
  chapterId?: string;
  topicId?: string;
  topicName?: string;
  difficulty?: Difficulty | "All";
  /** Accepts stored QuestionType values or the virtual "Unclassified" sentinel. */
  questionType?: EffectiveQuestionType | "All";
}

/**
 * Returns questions matching ALL supplied filters.
 * Omitting a filter field means "any value is accepted".
 *
 * Questions without a questionType field (legacy V1 chapters) are treated as
 * "Unclassified" at the filter boundary — they are always included in "All"
 * and are matched by the explicit "Unclassified" filter value.
 * They are never silently assigned a false type such as MCQ or ShortAnswer.
 */
export function getQuestions(filter: QuestionFilter = {}): Question[] {
  const isScience = filter.subject === "Science";
  const results = ALL_QUESTIONS.filter((q) => {
    if (filter.classNum  !== undefined && q.classNum  !== filter.classNum)  return false;
    if (filter.subject   !== undefined) {
      if (isScience) {
        if (!SCIENCE_DOMAINS.includes(q.subject)) return false;
      } else if (q.subject !== filter.subject) {
        return false;
      }
    }
    if (filter.chapterId !== undefined && q.chapterId !== filter.chapterId) return false;
    if (filter.topicId   !== undefined && q.topicId   !== filter.topicId)   return false;
    if (filter.topicName !== undefined && q.topicName !== filter.topicName) return false;
    if (filter.difficulty && filter.difficulty !== "All" && q.difficulty !== filter.difficulty) return false;
    if (filter.questionType && filter.questionType !== "All") {
      // Map missing metadata → "Unclassified" so the filter works correctly.
      // Never infer a specific type from question text alone.
      const effectiveType: EffectiveQuestionType = q.questionType ?? "Unclassified";
      if (effectiveType !== filter.questionType) return false;
    }
    return true;
  });
  return results;
}

/** Get a single question by id. */
export function getQuestionById(id: string): Question | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}

/** Get n random questions matching a filter (for quiz / challenge modes). */
export function getRandomQuestions(filter: QuestionFilter, n: number): Question[] {
  const pool = getQuestions(filter);
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(n, shuffled.length));
}

// ─── Difficulty distribution ──────────────────────────────────────────────────

export interface DifficultyCount {
  Easy: number;
  Medium: number;
  Hard: number;
  total: number;
}

export function getDifficultyBreakdown(filter: QuestionFilter): DifficultyCount {
  const qs = getQuestions(filter);
  return {
    Easy:   qs.filter((q) => q.difficulty === "Easy").length,
    Medium: qs.filter((q) => q.difficulty === "Medium").length,
    Hard:   qs.filter((q) => q.difficulty === "Hard").length,
    total:  qs.length,
  };
}

// ─── Chapter stats ────────────────────────────────────────────────────────────

export interface ChapterStats {
  chapterId: string;
  chapterName: string;
  /** Raw chapter number extracted from the chapter ID (unreliable for Science — use displayChapterNumber instead). */
  chapterNumber: number;
  /**
   * Student-facing continuous display number for Science chapters, following the
   * official NCERT textbook interleaved order.  Always defined for active Science chapters.
   * For Mathematics / Economics this is undefined — use chapterNumber instead.
   */
  displayChapterNumber?: number;
  totalQuestions: number;
  byDifficulty: DifficultyCount;
  byType: Record<QuestionType, number>;
}

/** Get stats for all chapters of a given class + subject. */
export function getAllChapterStats(classNum: number, subject: string): ChapterStats[] {
  const chapters = getChapters(classNum, subject);
  return chapters.map((ch) => {
    // Use ch.subject (the chapter's native domain) so "Science" sessions correctly
    // fetch Physics / Chemistry / Biology questions for each chapter.
    const chSubject = ch.subject;
    const qs = getQuestions({ classNum, subject: chSubject, chapterId: ch.id });
    const byType: Record<QuestionType, number> = {
      MCQ: 0, ShortAnswer: 0, LongAnswer: 0, HOTS: 0, PYQ: 0,
    };
    for (const q of qs) {
      if (q.questionType) byType[q.questionType]++;
    }
    return {
      chapterId: ch.id,
      chapterName: ch.name,
      chapterNumber: parseInt(ch.id.replace("ch", ""), 10),
      displayChapterNumber: subject === "Science"
        ? SCIENCE_DISPLAY_ORDER_CLASS9[ch.id]
        : subject === "Mathematics" && ch.classNum === 9
        ? MATHS_DISPLAY_ORDER_CLASS9[ch.id]
        : undefined,
      totalQuestions: qs.length,
      byDifficulty: getDifficultyBreakdown({ classNum, subject: chSubject, chapterId: ch.id }),
      byType,
    };
  });
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

/** Unique topic names for a chapter (preserving the order they appear in the data). */
export function getTopicNames(chapterId: string): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of ALL_QUESTIONS) {
    if (q.chapterId === chapterId && !seen.has(q.topicName)) {
      seen.add(q.topicName);
      result.push(q.topicName);
    }
  }
  return result;
}

/** Total question count for a topic across all difficulties. */
export function getTopicQuestionCount(chapterId: string, topicId: string): number {
  return ALL_QUESTIONS.filter(
    (q) => q.chapterId === chapterId && q.topicId === topicId
  ).length;
}
