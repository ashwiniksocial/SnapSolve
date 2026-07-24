/**
 * CANONICAL ACADEMIC CONTRACT — SnapSolve
 *
 * Single source of truth for curriculum identity across all boards, classes,
 * and subjects. Every academic consumer derives chapter identity from this
 * module. No consumer may maintain its own curriculum registry.
 *
 * Canonical chapter IDs ("bookId") = official NCERT book codes derived from
 * PDF filenames in curriculum/sources/ (e.g. iemh101, iesc104). These are
 * stable and independent of display-title wording.
 *
 * Internal question-bank routing IDs (ch1, ch3, phy-ch1, bio-ch01, etc.) are
 * NOT canonical. They map to canonical bookIds via INTERNAL_TO_CANONICAL.
 * Use bookId for all relational joins, grouping, persistence, and review caches.
 *
 * Authority source: curriculum/generated/master-curriculum-index.json
 * (extracted exclusively from official uploaded PDFs; no external knowledge used).
 *
 * Adding a new class/board:
 *  1. Add entries to INTERNAL_TO_CANONICAL below.
 *  2. Ensure the corresponding PDFs are in curriculum/sources/.
 *  3. Run `pnpm --filter @workspace/scripts run curriculum-check` to verify.
 */

import { readFileSync, existsSync } from "fs";
import { resolve }                   from "path";

const ROOT              = resolve(import.meta.dirname, "../../");
const MASTER_INDEX_PATH = resolve(ROOT, "curriculum/generated/master-curriculum-index.json");

// ─── Types ────────────────────────────────────────────────────────────────────

export type CanonicalStatus =
  | "ACTIVE"              // canonical source confirmed; chapter eligible for review/freeze
  | "SOURCE_PENDING"      // official source not yet released; build deferred
  | "SOURCE_UNRESOLVED"   // question bank exists but no matching 2026-27 chapter confirmed
  | "OFFICIALLY_DELETED"; // removed from active curriculum by the board

/**
 * A single resolved curriculum chapter entity.
 *
 * Use bookId for all relational operations (grouping, persistence, cache keys,
 * review resolution, freeze gates). chapterTitle is display-only.
 */
export interface CanonicalChapter {
  // ── Relational identity — use these for ALL joins, grouping, persistence ──

  /** e.g. "CBSE" */
  boardId:          string;
  /** e.g. 9 */
  classId:          number;
  /** e.g. "2026-27" */
  academicSession:  string;
  /**
   * Official NCERT/board book code = CANONICAL chapter ID.
   * Derived from PDF filename (iemh101, iesc104, …).
   * VALUE IS "SOURCE_UNRESOLVED" when no canonical chapter is confirmed.
   * Use this — not internalId, not chapterTitle — for all relational joins.
   */
  bookId:           string;
  /**
   * Internal question-bank routing ID (ch1, phy-ch1, bio-ch01, …).
   * NOT the canonical ID. Used only for question-file lookup and adapter routing.
   */
  internalId:       string;
  /** Canonical domain subject (question-bank convention). */
  subjectId:        string;   // "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Earth Science"
  /** Subject as recorded in master-curriculum-index (index grouping may differ). */
  indexSubjectId:   string;   // "Mathematics" | "Science"
  /** Book/series name. */
  bookSeries:       string;   // "Ganita Manjari Part I" | "Curiosity Book 1"

  status:           CanonicalStatus;

  // ── Display — derived from official source; NOT relational keys ───────────

  /** Student-facing 1-based ordinal position within the subject group. Derived from canonical contract. */
  displayOrder:     number;
  /** Exact official chapter title from master-curriculum-index. */
  chapterTitle:     string;

  // ── Provenance ─────────────────────────────────────────────────────────────

  /** Relative path to the PDF in curriculum/sources/. */
  sourcePath:       string;
  pageCount:        number;

  // ── Structure (used by academic review context builder) ───────────────────

  sections:         { number?: string; title: string }[];
  keyTerms:         string[];
}

// ─── Master index schema (minimal subset we consume) ─────────────────────────

interface MasterIndexEntry {
  filename:      string;
  filepath:      string;
  board:         string;
  class:         number;
  subject:       string;
  series:        string;
  chapter_title: string;
  is_chapter:    boolean | undefined;
  page_count:    number;
  structure?: {
    sections?: { number?: string; title: string }[];
    key_terms?: string[];
  };
}

// ─── Internal ID → Canonical mapping ─────────────────────────────────────────
//
// This is the ONLY place internalId → bookId mapping is defined.
// Every other file reads this mapping; none may define its own.
//
// Entries are keyed by the question-bank routing ID (chapterId).
// bookId = official NCERT PDF filename without extension.
// SOURCE_UNRESOLVED = question bank exists but no 2026-27 chapter confirmed.

interface RegistryEntry {
  bookId:          string;           // "iemh101" | "SOURCE_UNRESOLVED"
  classId:         number;
  boardId:         string;
  academicSession: string;
  subjectId:       string;
  indexSubjectId:  string;
  bookSeries:      string;
  status:          CanonicalStatus;
  /** Student-facing 1-based ordinal position within the subject group for this class. */
  displayOrder:    number;
}

const INTERNAL_TO_CANONICAL: Record<string, RegistryEntry> = {

  // ── Class 9 Mathematics: Ganita Manjari Part I (iemh101–iemh108) ──────────
  "ch3":     { bookId: "iemh101",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 1  },
  "iemh102": { bookId: "iemh102",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 2  },
  "ch1":     { bookId: "iemh103",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 3  },
  "ch16":    { bookId: "iemh104",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 4  },
  // ch4: questions cover old-NCERT linear equations; iemh105 in 2026-27 is circles — mismatch confirmed.
  "ch4":     { bookId: "SOURCE_UNRESOLVED", classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",   indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "SOURCE_UNRESOLVED", displayOrder: 5  },
  "ch18":    { bookId: "iemh106",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 6  },
  "ch15":    { bookId: "iemh107",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 7  },
  "ch17":    { bookId: "iemh108",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 8  },

  // ── Class 9 Science: Curiosity Book 1 — Physics (iesc104, 106, 107, 110) ──
  "phy-ch1":  { bookId: "iesc104",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Physics",        indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 4  },
  "phy-ch2":  { bookId: "iesc106",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Physics",        indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 6  },
  "phy-ch4":  { bookId: "iesc107",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Physics",        indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 7  },
  "phy-ch5":  { bookId: "iesc110",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Physics",        indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 10 },

  // ── Class 9 Science: Curiosity Book 1 — Chemistry (iesc105, 108, 109) ─────
  // chem-ch01: questions cover states of matter; iesc101 in 2026-27 is the
  // intro chapter "Exploration: Entering the World of Secondary Science" — mismatch confirmed.
  "chem-ch01": { bookId: "SOURCE_UNRESOLVED", classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Chemistry",   indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "SOURCE_UNRESOLVED", displayOrder: 1  },
  "chem-ch02": { bookId: "iesc105",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Chemistry",    indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 5  },
  "chem-ch03": { bookId: "iesc109",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Chemistry",    indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 9  },
  "chem-ch04": { bookId: "iesc108",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Chemistry",    indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 8  },

  // ── Class 9 Science: Curiosity Book 1 — Biology (iesc102, 103, 111, 112) ──
  "bio-ch01":  { bookId: "iesc102",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Biology",       indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 2  },
  "bio-ch02":  { bookId: "iesc103",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Biology",       indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 3  },
  "bio-ch03":  { bookId: "iesc112",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Biology",       indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 12 },
  "bio-ch05":  { bookId: "iesc111",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Biology",       indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 11 },

  // ── Class 9 Science: Curiosity Book 1 — Earth Science (iesc113) ──────────
  "esc-ch01":  { bookId: "iesc113",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Earth Science", indexSubjectId: "Science",     bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 13 },
};

// ─── Index loader (cached, lazy) ──────────────────────────────────────────────

let _index: MasterIndexEntry[] | null = null;
let _byBookId: Map<string, MasterIndexEntry> | null = null;

function getIndex(): MasterIndexEntry[] {
  if (_index) return _index;
  if (!existsSync(MASTER_INDEX_PATH)) { _index = []; return []; }
  try {
    const raw = JSON.parse(readFileSync(MASTER_INDEX_PATH, "utf8")) as { entries?: MasterIndexEntry[] };
    _index = (raw.entries ?? []).filter(e => e.is_chapter !== false);
  } catch {
    _index = [];
  }
  return _index;
}

function getIndexByBookId(): Map<string, MasterIndexEntry> {
  if (_byBookId) return _byBookId;
  _byBookId = new Map();
  for (const e of getIndex()) {
    const bookId = e.filename.replace(/\.pdf$/i, "");
    _byBookId.set(bookId, e);
  }
  return _byBookId;
}

// ─── Chapter builder ──────────────────────────────────────────────────────────

function buildChapter(internalId: string, reg: RegistryEntry): CanonicalChapter {
  const byBookId = getIndexByBookId();

  // For SOURCE_UNRESOLVED chapters, no index entry exists — return a synthetic entry.
  if (reg.status === "SOURCE_UNRESOLVED" || reg.bookId === "SOURCE_UNRESOLVED") {
    return {
      boardId:         reg.boardId,
      classId:         reg.classId,
      academicSession: reg.academicSession,
      bookId:          "SOURCE_UNRESOLVED",
      internalId,
      subjectId:       reg.subjectId,
      indexSubjectId:  reg.indexSubjectId,
      bookSeries:      reg.bookSeries,
      status:          "SOURCE_UNRESOLVED",
      displayOrder:    reg.displayOrder,
      chapterTitle:    "(source unresolved — no canonical 2026-27 chapter confirmed)",
      sourcePath:      "",
      pageCount:       0,
      sections:        [],
      keyTerms:        [],
    };
  }

  const entry = byBookId.get(reg.bookId);
  return {
    boardId:         reg.boardId,
    classId:         reg.classId,
    academicSession: reg.academicSession,
    bookId:          reg.bookId,
    internalId,
    subjectId:       reg.subjectId,
    indexSubjectId:  reg.indexSubjectId,
    bookSeries:      reg.bookSeries,
    status:          reg.status,
    displayOrder:    reg.displayOrder,
    chapterTitle:    entry?.chapter_title ?? "(title not found in master index)",
    sourcePath:      entry?.filepath ?? "",
    pageCount:       entry?.page_count ?? 0,
    sections:        entry?.structure?.sections ?? [],
    keyTerms:        entry?.structure?.key_terms ?? [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Look up the canonical chapter for a question-bank internal routing ID.
 * Returns null if the internalId is not registered in the canonical contract.
 *
 * Use bookId from the result for all relational joins. Do not use chapterTitle.
 */
export function getCanonicalChapter(internalId: string): CanonicalChapter | null {
  const reg = INTERNAL_TO_CANONICAL[internalId];
  if (!reg) return null;
  return buildChapter(internalId, reg);
}

/**
 * Look up a canonical chapter by its official book code (e.g. "iemh101").
 * Returns null if the bookId is not known.
 */
export function resolveByBookId(bookId: string): CanonicalChapter | null {
  for (const [internalId, reg] of Object.entries(INTERNAL_TO_CANONICAL)) {
    if (reg.bookId === bookId) return buildChapter(internalId, reg);
  }
  return null;
}

/**
 * Return all canonical chapters, optionally filtered.
 *
 * @param filter.classId   — restrict to a specific class (e.g. 9)
 * @param filter.subjectId — restrict to a canonical subject domain
 * @param filter.boardId   — restrict to a board (default: all)
 * @param filter.status    — restrict to one or more statuses
 */
export function getAllChapters(filter?: {
  classId?:   number;
  subjectId?: string | string[];
  boardId?:   string;
  status?:    CanonicalStatus | CanonicalStatus[];
}): CanonicalChapter[] {
  const chapters = Object.entries(INTERNAL_TO_CANONICAL).map(([id, reg]) =>
    buildChapter(id, reg)
  );
  if (!filter) return chapters;

  const { classId, subjectId, boardId, status } = filter;
  const subjects = Array.isArray(subjectId) ? subjectId : subjectId ? [subjectId] : null;
  const statuses = Array.isArray(status)    ? status     : status    ? [status]    : null;

  return chapters.filter(ch => {
    if (classId   != null && ch.classId   !== classId)                     return false;
    if (boardId   != null && ch.boardId   !== boardId)                     return false;
    if (subjects  != null && !subjects.includes(ch.subjectId))             return false;
    if (statuses  != null && !statuses.includes(ch.status))                return false;
    return true;
  });
}

/** Convenience: all Class 9 CBSE chapters (all statuses). */
export function getClass9Chapters(): CanonicalChapter[] {
  return getAllChapters({ classId: 9, boardId: "CBSE" });
}

/** Convenience: all Class 9 CBSE ACTIVE chapters only. */
export function getClass9ActiveChapters(): CanonicalChapter[] {
  return getAllChapters({ classId: 9, boardId: "CBSE", status: "ACTIVE" });
}

/**
 * All internal IDs registered in the canonical contract.
 * Use this to verify that every question-bank chapterId is known.
 */
export function getKnownInternalIds(): Set<string> {
  return new Set(Object.keys(INTERNAL_TO_CANONICAL));
}

/**
 * Raw registry entries suitable for code generation.
 * Returns the internalId → canonical mapping without Node.js-dependent enrichment.
 * Used by scripts/src/generateCanonicalRegistry.ts to produce the browser-safe
 * canonicalChapterRegistry.gen.ts consumed by the frontend.
 */
export function getRawRegistryEntries(): Array<{
  internalId:          string;
  canonicalChapterId:  string | null;   // null when SOURCE_UNRESOLVED / SOURCE_PENDING
  status:              CanonicalStatus;
  subjectId:           string;
  classId:             number;
  boardId:             string;
  displayOrder:        number;
}> {
  return Object.entries(INTERNAL_TO_CANONICAL).map(([internalId, reg]) => ({
    internalId,
    canonicalChapterId: (reg.bookId === "SOURCE_UNRESOLVED" || reg.status !== "ACTIVE")
      ? null
      : reg.bookId,
    status:       reg.status,
    subjectId:    reg.subjectId,
    classId:      reg.classId,
    boardId:      reg.boardId,
    displayOrder: reg.displayOrder,
  }));
}

/**
 * Student-facing display order for Class 9, derived directly from the canonical contract.
 * Returns two maps: math (8 entries) and science (13 entries).
 * Each maps an internalId to its 1-based ordinal position within its subject group.
 *
 * This is the authoritative source consumed by:
 *   - generateCanonicalRegistry.ts → canonicalChapterRegistry.gen.ts → questionService.ts
 *   - validateCurriculum.ts (validation)
 */
export function getClass9DisplayOrder(): {
  math:    Readonly<Record<string, number>>;
  science: Readonly<Record<string, number>>;
} {
  const math:    Record<string, number> = {};
  const science: Record<string, number> = {};
  for (const [internalId, reg] of Object.entries(INTERNAL_TO_CANONICAL)) {
    if (reg.classId !== 9 || reg.boardId !== "CBSE") continue;
    if (reg.indexSubjectId === "Mathematics") {
      math[internalId] = reg.displayOrder;
    } else {
      science[internalId] = reg.displayOrder;
    }
  }
  return { math, science };
}

/**
 * Format a canonical chapter's index entry as rich text for the academic
 * reviewer's context window (sections, key terms).
 */
export function formatChapterContext(ch: CanonicalChapter): string {
  const sections = ch.sections
    .map(s => `  ${s.number ? s.number + ". " : ""}${s.title}`)
    .join("\n");
  const keyTerms = ch.keyTerms.slice(0, 20).join(", ");
  let text = `Official chapter: "${ch.chapterTitle}" [${ch.bookId}] (${ch.bookSeries}, ${ch.academicSession})`;
  if (sections) text += `\nChapter sections:\n${sections}`;
  if (keyTerms) text += `\nKey terms: ${keyTerms}`;
  return text;
}
