/**
 * Question Service — query layer over the static question bank.
 *
 * All public functions are pure and return new arrays (no mutation).
 * Designed to be swappable with Firebase Firestore calls:
 *   - Replace `ALL_QUESTIONS` reads with `getDocs(query(...))`.
 *   - Function signatures stay identical.
 */

import type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType, EffectiveQuestionType } from "@/data/questions";
import { CLASS9_DISPLAY_ORDER } from "@/data/questions/canonicalChapterRegistry.gen";
import {
  BETA_SCIENCE_DOMAINS,
  getStudentFacingSubject,
} from "@/data/questions/studentFacingSubject";
import { lookupCanonical } from "@/data/questions/canonicalChapterRegistry.gen";
import {
  isBoardApplicable,
  matchesAcademicContentContext,
  makeChapterContextKey,
  type BoardId,
} from "@/data/questions/academicContext";

export type { Question, ChapterMeta, TopicMeta, Difficulty, QuestionType, EffectiveQuestionType };
export { BETA_SCIENCE_DOMAINS, getStudentFacingSubject };

// ── Module-level question bank cache ────────────────────────────────────────
// Start empty; populated by preloadQBank().  Synchronous query functions below
// return empty results until preloadQBank() resolves.  Pages other than
// Practice will show empty lists if visited before Practice — acceptable beta
// degradation given the normal navigation flow (Home → Practice → Solution).
let ALL_CHAPTERS: ChapterMeta[] = [];
let ALL_QUESTIONS: Question[] = [];

let _loaded = false;

/** Lazily load the Class 9 question bank into the module cache.
 *  Safe to call multiple times — deduplicates so the bundle is fetched at most once per session.
 */
export async function preloadQBank(_classNum?: number): Promise<void> {
  if (_loaded) return;
  const { ALL_CHAPTERS: CHAPTERS, ALL_QUESTIONS: QUESTIONS } = await import("@/data/questions/index");
  ALL_CHAPTERS  = [...ALL_CHAPTERS,  ...CHAPTERS];
  ALL_QUESTIONS = [...ALL_QUESTIONS, ...QUESTIONS];
  _loaded = true;
}

// ─── Chapter / topic navigation ───────────────────────────────────────────────

/**
 * Internal domains that make up the student-facing Beta "Science" subject.
 * Earth Science remains in the question bank, but is deliberately outside the
 * current Beta readiness scope and therefore is not aggregated here.
 */
/**
 * All chapters for a given class + subject, in official textbook order.
 * "Science" resolves to the union of all Science domain chapters sorted by
 * the official NCERT Exploration textbook sequence (iesc101–iesc113).
 * Class 9 Mathematics is sorted by the official NCERT Mathematics (Ganita Manjari Part I) sequence (iemh101–iemh108).
 *
 * Display order is derived from CLASS9_DISPLAY_ORDER (generated from
 * scripts/src/canonicalCurriculum.ts). No manual order map is maintained here.
 */
function matchesSubject(chapterSubject: string, requestedSubject: string): boolean {
  return requestedSubject === "Science"
    ? BETA_SCIENCE_DOMAINS.includes(chapterSubject as typeof BETA_SCIENCE_DOMAINS[number])
    : chapterSubject === requestedSubject;
}

function chapterForBoard(chapter: ChapterMeta, boardId: BoardId): ChapterMeta | null {
  if (!isBoardApplicable(chapter.boardApplicability, chapter.verifiedBoards, boardId)) return null;
  if (boardId === "CBSE") {
    return { ...chapter, boardId };
  }
  const canonical = lookupCanonical(
    chapter.id,
    boardId,
    chapter.classNum,
    chapter.subject,
    chapter.academicSession,
  );
  if (!canonical || canonical.curriculumStatus !== "ACTIVE") return null;
  return {
    ...chapter,
    boardId,
    canonicalChapterId: canonical.canonicalChapterId,
    curriculumStatus: canonical.curriculumStatus,
    academicSession: canonical.academicSession,
  };
}

export function getChapters(classNum: number, subject: string, boardId?: BoardId): ChapterMeta[] {
  if (!boardId) return [];
  const eligible = ALL_CHAPTERS
    .filter((chapter) =>
      chapter.classNum === classNum &&
      matchesSubject(chapter.subject, subject) &&
      !chapter.cbseDeleted &&
      chapter.curriculumStatus === "ACTIVE",
    )
    .map((chapter) => chapterForBoard(chapter, boardId))
    .filter((chapter): chapter is ChapterMeta => chapter !== null)
    .map((chapter) => ({
      ...chapter,
      contextKey: makeChapterContextKey({
        boardId,
        classNum,
        subject: chapter.subject,
        canonicalChapterId: chapter.canonicalChapterId,
        chapterId: chapter.id,
        academicSession: chapter.academicSession,
      }),
    }));

  if (subject === "Science") {
    return eligible.sort((a, b) =>
      (boardId === "CBSE" ? CLASS9_DISPLAY_ORDER[a.id] ?? 999 : 999) -
      (boardId === "CBSE" ? CLASS9_DISPLAY_ORDER[b.id] ?? 999 : 999),
    );
  }
  if (subject === "Mathematics" && classNum === 9) {
    return eligible.sort((a, b) =>
      (boardId === "CBSE" ? CLASS9_DISPLAY_ORDER[a.id] ?? 999 : 999) -
      (boardId === "CBSE" ? CLASS9_DISPLAY_ORDER[b.id] ?? 999 : 999),
    );
  }
  return eligible;
}

/** All topics for a chapter in its full board/class/subject context. */
export function getTopics(chapterId: string, classNum?: number, subject?: string, boardId?: BoardId): TopicMeta[] {
  if (classNum === undefined || !subject || !boardId) return [];
  return getChapters(classNum, subject, boardId)
    .find((chapter) => chapter.id === chapterId)?.topics ?? [];
}

// ─── Question querying ────────────────────────────────────────────────────────

export interface QuestionFilter {
  boardId?: BoardId;
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
  if (!filter.boardId || filter.classNum === undefined) return [];
  const isScience = filter.subject === "Science";
  const results = ALL_QUESTIONS.filter((q) => {
    const subjectMatches = filter.subject === undefined ||
      (isScience
        ? BETA_SCIENCE_DOMAINS.includes(q.subject as typeof BETA_SCIENCE_DOMAINS[number])
        : q.subject === filter.subject);
    if (!matchesAcademicContentContext(
      q,
      { boardId: filter.boardId!, classNum: filter.classNum!, subject: filter.subject ?? q.subject },
      subjectMatches,
    )) return false;
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
    if (filter.boardId !== "CBSE") {
      const chapter = chapterForBoard(
        ALL_CHAPTERS.find((candidate) =>
          candidate.id === q.chapterId &&
          candidate.classNum === q.classNum &&
          candidate.subject === q.subject,
        ) ?? {
          id: q.chapterId, name: q.chapterName, classNum: q.classNum,
          subject: q.subject, canonicalChapterId: q.canonicalChapterId ?? null,
          curriculumStatus: "SOURCE_UNRESOLVED", topics: [],
          boardApplicability: q.boardApplicability, verifiedBoards: q.verifiedBoards,
          academicSession: q.academicSession,
        },
        filter.boardId!,
      );
      if (!chapter) return false;
    }
    return true;
  });
  return results.map((question) => ({
    ...question,
    boardId: filter.boardId,
    canonicalChapterId: question.canonicalChapterId ??
      ALL_CHAPTERS.find((chapter) =>
        chapter.id === question.chapterId &&
        chapter.classNum === question.classNum &&
        chapter.subject === question.subject,
      )?.canonicalChapterId ?? null,
  }));
}

/** Get a single question only within a validated board/class context. */
export function getQuestionById(id: string, boardId?: BoardId, classNum?: number): Question | undefined {
  if (!boardId) return undefined;
  return getQuestions({ boardId, classNum }).find((q) => q.id === id);
}

/**
 * Student-facing chapter serial from the same active, ordered collection used
 * by Practice. Never derive a visible serial by parsing an internal chapter ID.
 */
export function getChapterDisplayNumber(
  classNum: number,
  subject: string,
  chapterId: string,
  boardId?: BoardId,
): number | undefined {
  if (!boardId) return undefined;
  const practiceSubject = getStudentFacingSubject(subject);
  const chapterIndex = getChapters(classNum, practiceSubject, boardId)
    .findIndex((chapter) => chapter.id === chapterId);
  return chapterIndex >= 0 ? chapterIndex + 1 : undefined;
}

/**
 * Student-facing question serial from the authoritative chapter question list.
 * The list preserves the same source order rendered by Practice without
 * inspecting question IDs.
 */
export function getQuestionDisplayNumber(question: Question): number | undefined {
  if (!question.boardId) return undefined;
  const chapterQuestions = getQuestions({
    boardId: question.boardId,
    classNum: question.classNum,
    subject: question.subject,
    chapterId: question.chapterId,
  });
  const questionIndex = chapterQuestions.findIndex((candidate) => candidate.id === question.id);
  return questionIndex >= 0 ? questionIndex + 1 : undefined;
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

/** Get stats for all chapters of a given class + subject + board. */
export function getAllChapterStats(classNum: number, subject: string, boardId?: BoardId): ChapterStats[] {
  if (!boardId) return [];
  const chapters = getChapters(classNum, subject, boardId);
  return chapters.map((ch, idx) => {
    // Use ch.subject (the chapter's native domain) so "Science" sessions correctly
    // fetch Physics / Chemistry / Biology questions for each chapter.
    const chSubject = ch.subject;
    const qs = getQuestions({ boardId, classNum, subject: chSubject, chapterId: ch.id });
    const byType: Record<QuestionType, number> = {
      MCQ: 0, ShortAnswer: 0, LongAnswer: 0, HOTS: 0, PYQ: 0,
    };
    for (const q of qs) {
      if (q.questionType) byType[q.questionType]++;
    }
    const displayChapterNumber = getChapterDisplayNumber(ch.classNum, ch.subject, ch.id, boardId);
    return {
      chapterId: ch.id,
      chapterName: ch.name,
      chapterNumber: parseInt(ch.id.replace("ch", ""), 10),
      displayChapterNumber,
      totalQuestions: qs.length,
      byDifficulty: getDifficultyBreakdown({ boardId, classNum, subject: chSubject, chapterId: ch.id }),
      byType,
    };
  });
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

/** Unique topic names for a chapter (preserving the order they appear in the data). */
export function getTopicNames(chapterId: string, classNum?: number, subject?: string, boardId?: BoardId): string[] {
  if (classNum === undefined || !subject || !boardId) return [];
  const seen = new Set<string>();
  const result: string[] = [];
  for (const q of ALL_QUESTIONS) {
    if (
      q.chapterId === chapterId &&
      q.classNum === classNum &&
      q.subject === subject &&
      isBoardApplicable(q.boardApplicability, q.verifiedBoards, boardId) &&
      !seen.has(q.topicName)
    ) {
      seen.add(q.topicName);
      result.push(q.topicName);
    }
  }
  return result;
}

/** Total question count for a topic across all difficulties. */
export function getTopicQuestionCount(
  chapterId: string,
  topicId: string,
  classNum?: number,
  subject?: string,
  boardId?: BoardId,
): number {
  if (classNum === undefined || !subject || !boardId) return 0;
  return ALL_QUESTIONS.filter(
    (q) => q.chapterId === chapterId && q.topicId === topicId &&
      q.classNum === classNum && q.subject === subject &&
      isBoardApplicable(q.boardApplicability, q.verifiedBoards, boardId)
  ).length;
}
