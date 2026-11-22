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

import { execFileSync }               from "child_process";
import { createHash }                 from "crypto";
import { readFileSync, existsSync }   from "fs";
import { basename, resolve, sep }     from "path";

const ROOT              = resolve(import.meta.dirname, "../../");
const MASTER_INDEX_PATH = resolve(ROOT, "curriculum/generated/master-curriculum-index.json");
const MASTER_TOPIC_INDEX_PATH = resolve(ROOT, "curriculum/generated/master-topic-index.json");
const CURRICULUM_LOCK_PATH = resolve(ROOT, "curriculum/generated/curriculum-lock.json");

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

interface MasterTopicEntry {
  board:          string;
  class:          number;
  subject:        string;
  chapter_number: number;
  level:          "section" | "subsection" | string;
  number:         string;
  title:          string;
  filename:       string;
}

export interface QuestionSourceContextRequest {
  topicName?: string;
  question:   string;
  answer:     string;
}

export interface QuestionSourcePassage {
  sectionNumber: string;
  sectionTitle:  string;
  pdfPages:      number[];
  characterCount: number;
  text:          string;
}

export interface QuestionSourceContext {
  sourcePath:    string;
  sourceSha256:  string;
  characterCount: number;
  passages:      QuestionSourcePassage[];
  text:          string;
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
  // iemh105: "I'm Up and Down, and Round and Round" (Circles) — official Ganita Manjari Part I Chapter 5.
  "iemh105": { bookId: "iemh105",          classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Mathematics",    indexSubjectId: "Mathematics", bookSeries: "Ganita Manjari Part I", status: "ACTIVE",            displayOrder: 5  },
  // ch4: questions cover old-NCERT linear equations; Ganita Manjari Part II not yet officially released.
  // Retained as SOURCE_UNRESOLVED; excluded from the active display sequence until resolved.
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
  "esc-ch01":  { bookId: "iesc113",         classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Earth Science",       indexSubjectId: "Science",              bookSeries: "Curiosity Book 1",      status: "ACTIVE",            displayOrder: 13 },

  // ── Class 9 Information Technology: NCERT IT 402 Textbook (Skill Subject, Code 402) ────────────
  // Source: CBSE IT 402 Syllabus 2026-27 + NCERT IT 402 Textbook (PSSCIVE/NCERT, 2018)
  // Job Role: Domestic Data Entry Operator (SSC/Q2212, IT-ITeS sector)
  "it402-unit1": { bookId: "402-IT-IX-unit1", classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Information Technology", indexSubjectId: "Information Technology", bookSeries: "NCERT IT 402 Textbook", status: "ACTIVE", displayOrder: 1 },
  "it402-unit2": { bookId: "402-IT-IX-unit2", classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Information Technology", indexSubjectId: "Information Technology", bookSeries: "NCERT IT 402 Textbook", status: "ACTIVE", displayOrder: 2 },
  "it402-unit3": { bookId: "402-IT-IX-unit3", classId: 9, boardId: "CBSE", academicSession: "2026-27", subjectId: "Information Technology", indexSubjectId: "Information Technology", bookSeries: "NCERT IT 402 Textbook", status: "ACTIVE", displayOrder: 3 },
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
  academicSession:     string;
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
    academicSession: reg.academicSession,
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
    // Only ACTIVE chapters participate in the student-facing display sequence.
    // SOURCE_UNRESOLVED and other statuses are excluded here.
    if (reg.status !== "ACTIVE") continue;
    if (reg.indexSubjectId === "Mathematics") {
      math[internalId] = reg.displayOrder;
    } else if (reg.indexSubjectId === "Science") {
      // Only Curiosity Book 1 Science subjects (Physics, Chemistry, Biology, Earth Science)
      // go into the science display group. Other non-Math subjects (e.g. Information Technology)
      // have their own distinct display sequences and are NOT included here.
      science[internalId] = reg.displayOrder;
    }
    // Information Technology and other non-Science/non-Math subjects are excluded from
    // both groups; they use their own subject-level ordering.
  }
  return { math, science };
}

interface ExtractedSource {
  sha256: string;
  text:   string;
  pages:  string[];
}

const extractedSourceCache = new Map<string, ExtractedSource>();
let _topicIndex: MasterTopicEntry[] | null = null;

const CONTEXT_STOP_WORDS = new Set([
  "about", "above", "after", "again", "against", "along", "also", "among",
  "because", "before", "being", "below", "between", "both", "could", "does",
  "each", "from", "have", "having", "into", "more", "most", "other", "over",
  "same", "some", "such", "than", "that", "their", "them", "then", "there",
  "these", "they", "this", "those", "through", "under", "very", "what", "when",
  "where", "which", "while", "with", "would", "your",
]);

const MAX_SOURCE_PASSAGE_CHARS = 12_000;
const MAX_SOURCE_CONTEXT_CHARS = 24_000;

function getTopicIndex(): MasterTopicEntry[] {
  if (_topicIndex) return _topicIndex;
  if (!existsSync(MASTER_TOPIC_INDEX_PATH)) {
    _topicIndex = [];
    return _topicIndex;
  }
  try {
    const raw = JSON.parse(readFileSync(MASTER_TOPIC_INDEX_PATH, "utf8")) as {
      topics?: MasterTopicEntry[];
    };
    _topicIndex = raw.topics ?? [];
  } catch {
    _topicIndex = [];
  }
  return _topicIndex;
}

function sourceTopicsFor(ch: CanonicalChapter): MasterTopicEntry[] {
  const filename = basename(ch.sourcePath);
  const indexed = getTopicIndex().filter(topic =>
    topic.filename === filename &&
    topic.board === ch.boardId &&
    topic.class === ch.classId &&
    topic.subject === ch.indexSubjectId
  );
  const byNumber = new Map(indexed.map(topic => [topic.number, topic]));

  // The canonical chapter index remains the fallback for official top-level
  // sections if the generated topic index has no row for one of them.
  for (const section of ch.sections) {
    if (!section.number || byNumber.has(section.number)) continue;
    byNumber.set(section.number, {
      board: ch.boardId,
      class: ch.classId,
      subject: ch.indexSubjectId,
      chapter_number: ch.displayOrder,
      level: "section",
      number: section.number,
      title: section.title,
      filename,
    });
  }
  return [...byNumber.values()].sort((a, b) =>
    a.number.localeCompare(b.number, undefined, { numeric: true })
  );
}

function loadOfficialSource(ch: CanonicalChapter): ExtractedSource {
  const relativePath = ch.sourcePath.replace(/\\/g, "/");
  if (!relativePath || relativePath.startsWith("/") || relativePath.split("/").includes("..")) {
    throw new Error("The canonical source path is missing or unsafe.");
  }
  const sourcePath = resolve(ROOT, relativePath);
  const sourceRoot = resolve(ROOT, "curriculum/sources");
  if (!sourcePath.startsWith(sourceRoot + sep)) {
    throw new Error("The canonical source is outside curriculum/sources.");
  }

  const cached = extractedSourceCache.get(sourcePath);
  if (cached) return cached;
  if (!existsSync(sourcePath) || !existsSync(CURRICULUM_LOCK_PATH)) {
    throw new Error("The mapped official source PDF or curriculum lock is missing.");
  }

  const lockKey = relativePath.replace(/^curriculum\//, "");
  const lock = JSON.parse(readFileSync(CURRICULUM_LOCK_PATH, "utf8")) as Record<string, string>;
  const expectedHash = lock[lockKey];
  if (!expectedHash) throw new Error(`No verified checksum exists for ${lockKey}.`);

  const pdfBytes = readFileSync(sourcePath);
  const actualHash = createHash("sha256").update(pdfBytes).digest("hex");
  if (actualHash !== expectedHash) {
    throw new Error(`The PDF checksum does not match curriculum-lock.json for ${lockKey}.`);
  }

  let text: string;
  try {
    // Reuse the existing Poppler text extractor used by the curriculum builder.
    text = execFileSync("pdftotext", ["-layout", sourcePath, "-"], {
      cwd: ROOT,
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
      timeout: 120_000,
    });
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    throw new Error(`Official PDF text extraction failed: ${detail}`);
  }
  if (!text.trim()) throw new Error("The mapped PDF produced no extractable textbook text.");

  const result = { sha256: actualHash, text, pages: text.split("\f") };
  extractedSourceCache.set(sourcePath, result);
  return result;
}

function normalizeTitle(value: string): string {
  return value.toLocaleLowerCase().normalize("NFKC")
    .replace(/[^\p{L}\p{N}]+/gu, " ").trim().replace(/\s+/g, " ");
}

function contextTerms(value: string): Set<string> {
  return new Set(
    (value.toLocaleLowerCase().normalize("NFKC").match(/[\p{L}\p{N}]+/gu) ?? [])
      .filter(term => term.length >= 4 && !CONTEXT_STOP_WORDS.has(term))
  );
}

function choosePrimaryTopic(
  topics: MasterTopicEntry[],
  request: QuestionSourceContextRequest,
): MasterTopicEntry | null {
  const topicName = normalizeTitle(request.topicName ?? "");
  if (topicName) {
    const exact = topics
      .filter(topic => normalizeTitle(topic.title) === topicName)
      .sort((a, b) => Number(b.level === "section") - Number(a.level === "section"));
    if (exact.length) return exact[0];
  }

  const topicTerms = contextTerms(request.topicName ?? "");
  const questionTerms = contextTerms(request.question);
  const normalizedQuestion = normalizeTitle(`${request.question} ${request.answer}`);
  const ranked = topics.map(topic => {
    const titleTerms = contextTerms(topic.title);
    const topicOverlap = [...topicTerms].filter(term => titleTerms.has(term)).length;
    const questionOverlap = [...questionTerms].filter(term => titleTerms.has(term)).length;
    const titleInQuestion = normalizedQuestion.includes(normalizeTitle(topic.title));
    return {
      topic,
      score: topicOverlap * 5 + questionOverlap + (titleInQuestion ? 10 : 0),
      topicOverlap,
    };
  }).sort((a, b) =>
    b.score - a.score ||
    Number(b.topic.level === "section") - Number(a.topic.level === "section") ||
    a.topic.number.localeCompare(b.topic.number, undefined, { numeric: true })
  );

  const best = ranked[0];
  if (!best || best.score < 2 || (topicName && best.topicOverlap === 0)) return null;
  if (ranked[1]?.score === best.score) return null;
  return best.topic;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findTopicHeading(text: string, topic: MasterTopicEntry): number | null {
  const titlePattern = topic.title.trim().split(/\s+/).map(escapeRegExp).join("\\s+");
  const pattern = new RegExp(
    `(?:^|[\\n\\f])\\s*(${escapeRegExp(topic.number)}\\s+${titlePattern})(?=[ \\t]*\\r?$)`,
    "gim"
  );
  let match: RegExpExecArray | null;
  let lastPosition: number | null = null;
  while ((match = pattern.exec(text)) !== null) {
    const heading = match[1];
    lastPosition = match.index + match[0].lastIndexOf(heading);
  }
  return lastPosition;
}

function isPassageBoundary(current: MasterTopicEntry, candidate: MasterTopicEntry): boolean {
  if (current.number === candidate.number) return false;
  const currentParts = current.number.split(".");
  const candidateParts = candidate.number.split(".");

  if (current.level === "section") {
    return candidate.level === "section" ||
      candidate.number.startsWith(`${current.number}.`);
  }
  if (candidateParts.length < currentParts.length) return true;
  return candidateParts.length === currentParts.length &&
    candidateParts.slice(0, -1).join(".") === currentParts.slice(0, -1).join(".");
}

function pagesForRange(pages: string[], start: number, end: number): number[] {
  const result: number[] = [];
  let offset = 0;
  pages.forEach((page, index) => {
    const pageEnd = offset + page.length;
    if (pageEnd >= start && offset <= end && page.trim()) result.push(index + 1);
    offset = pageEnd + 1; // account for the form-feed separator
  });
  return result;
}

function extractTopicPassage(
  source: ExtractedSource,
  topics: MasterTopicEntry[],
  topic: MasterTopicEntry,
): QuestionSourcePassage | null {
  const start = findTopicHeading(source.text, topic);
  if (start === null) return null;

  const boundaries = topics
    .filter(candidate => isPassageBoundary(topic, candidate))
    .map(candidate => ({ topic: candidate, position: findTopicHeading(source.text, candidate) }))
    .filter((candidate): candidate is { topic: MasterTopicEntry; position: number } =>
      candidate.position !== null && candidate.position > start
    )
    .sort((a, b) => a.position - b.position);
  const end = boundaries[0]?.position ?? source.text.length;
  const excerpt = source.text.slice(start, end)
    .replace(/\u0000/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (excerpt.length < 100 || excerpt.length > MAX_SOURCE_PASSAGE_CHARS) return null;

  return {
    sectionNumber: topic.number,
    sectionTitle: topic.title,
    pdfPages: pagesForRange(source.pages, start, end),
    characterCount: excerpt.length,
    text: excerpt,
  };
}

function buildRelevantPassages(
  source: ExtractedSource,
  topics: MasterTopicEntry[],
  primary: MasterTopicEntry,
  request: QuestionSourceContextRequest,
): QuestionSourcePassage[] | null {
  const section = primary.level === "section"
    ? primary
    : topics.find(topic =>
      topic.level === "section" &&
      topic.number === primary.number.split(".").slice(0, -1).join(".")
    );
  const passages: QuestionSourcePassage[] = [];
  if (section) {
    const intro = extractTopicPassage(source, topics, section);
    if (!intro) return null;
    passages.push(intro);
  }

  if (primary.level !== "section") {
    const specific = extractTopicPassage(source, topics, primary);
    if (!specific) return null;
    if (!passages.some(passage => passage.sectionNumber === specific.sectionNumber)) {
      passages.push(specific);
    }
  } else {
    const parentText = passages[0]?.text ?? "";
    const parentTerms = contextTerms(parentText);
    const answerTerms = contextTerms(request.answer);
    const distinctiveAnswerTerms = [...answerTerms].filter(term => !parentTerms.has(term));
    const childTopics = topics.filter(topic =>
      topic.level === "subsection" &&
      topic.number.startsWith(`${primary.number}.`)
    );
    const rankedChildren = childTopics.map(topic => {
      const passage = extractTopicPassage(source, topics, topic);
      if (!passage) return null;
      const passageTerms = contextTerms(passage.text);
      const score = distinctiveAnswerTerms.reduce(
        (total, term) => total + (passageTerms.has(term) ? 1 : 0),
        0
      );
      return { passage, score };
    }).filter((candidate): candidate is { passage: QuestionSourcePassage; score: number } =>
      candidate !== null && candidate.score > 0
    ).sort((a, b) =>
      b.score - a.score ||
      a.passage.sectionNumber.localeCompare(b.passage.sectionNumber, undefined, { numeric: true })
    );
    if (rankedChildren.length) passages.push(rankedChildren[0].passage);
  }

  return passages.length ? passages : null;
}

/**
 * Build bounded, question-relevant text from the chapter's hash-verified
 * official PDF. The canonical and generated topic indexes provide identity and
 * headings; section text is extracted from the mapped PDF via Poppler.
 */
export function buildQuestionSourceContext(
  ch: CanonicalChapter,
  request: QuestionSourceContextRequest,
): QuestionSourceContext {
  if (!ch.sourcePath || ch.status !== "ACTIVE") {
    throw new Error(`Canonical source is not active for ${ch.internalId}.`);
  }
  const topics = sourceTopicsFor(ch);
  if (!topics.length) {
    throw new Error(`No generated section map is available for ${ch.sourcePath}.`);
  }
  const primary = choosePrimaryTopic(topics, request);
  if (!primary) {
    throw new Error(`No unambiguous official section matches topic "${request.topicName ?? ""}".`);
  }
  const source = loadOfficialSource(ch);
  const passages = buildRelevantPassages(source, topics, primary, request);
  if (!passages) {
    throw new Error(`The mapped PDF does not contain the selected section heading ${primary.number} ${primary.title}.`);
  }

  const passageText = passages.map(passage =>
    `Section ${passage.sectionNumber} — ${passage.sectionTitle} ` +
    `(PDF page${passage.pdfPages.length === 1 ? "" : "s"} ${passage.pdfPages.join(", ")}):\n${passage.text}`
  ).join("\n\n");
  const text = [
    `Official source: ${ch.boardId}, Grade ${ch.classId}, ${ch.subjectId}, ${ch.academicSession}; ` +
      `${ch.bookSeries}, ${ch.bookId}; file ${ch.sourcePath}; SHA-256 ${source.sha256}.`,
    `Official chapter: "${ch.chapterTitle}".`,
    "Relevant textbook passages extracted from the verified PDF (layout whitespace normalized):",
    passageText,
  ].join("\n\n");
  if (text.length > MAX_SOURCE_CONTEXT_CHARS) {
    throw new Error(`Selected official source context exceeds the ${MAX_SOURCE_CONTEXT_CHARS}-character limit.`);
  }

  return {
    sourcePath: ch.sourcePath,
    sourceSha256: source.sha256,
    characterCount: text.length,
    passages,
    text,
  };
}

/**
 * Format the official source passages injected into the existing academic
 * reviewer's context. Missing or unextractable source text must fail closed.
 */
export function formatChapterContext(
  ch: CanonicalChapter,
  request: QuestionSourceContextRequest,
): string {
  return buildQuestionSourceContext(ch, request).text;
}
