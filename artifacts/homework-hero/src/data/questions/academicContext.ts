export type BoardId = "CBSE" | "ICSE" | "WBBSE";
export type BoardApplicability = BoardId | "Both";

export interface AcademicContext {
  boardId: BoardId;
  classNum: number;
  academicSession?: string;
}

export function normalizeBoardId(value: unknown): BoardId | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/\s+/g, " ");
  if (normalized === "CBSE" || normalized === "ICSE" || normalized === "WBBSE") {
    return normalized;
  }
  if (normalized === "WEST BENGAL BOARD" || normalized === "WEST BENGAL BOARD OF SECONDARY EDUCATION") {
    return "WBBSE";
  }
  // In particular, generic legacy values such as "State Board" and "Other"
  // remain unsupported instead of being silently assigned to WBBSE or CBSE.
  return null;
}

export function makeAcademicContext(
  board: unknown,
  classNum: unknown,
  academicSession?: string | null,
): AcademicContext | null {
  const boardId = normalizeBoardId(board);
  if (!boardId || typeof classNum !== "number" || !Number.isInteger(classNum) || classNum < 6 || classNum > 12) {
    return null;
  }
  return {
    boardId,
    classNum,
    ...(academicSession?.trim() ? { academicSession: academicSession.trim() } : {}),
  };
}

export function getStoredAcademicContext(): AcademicContext | null {
  if (typeof localStorage === "undefined") return null;
  const classValue = localStorage.getItem("studyai_class");
  return makeAcademicContext(
    localStorage.getItem("studyai_board"),
    classValue === null ? null : Number(classValue),
  );
}

export function scopedStorageKey(prefix: string, context = getStoredAcademicContext()): string | null {
  if (!context) return null;
  return `${prefix}:${context.boardId}:${context.classNum}`;
}

export function makeChapterContextKey(input: {
  boardId: BoardId;
  classNum: number;
  subject: string;
  canonicalChapterId: string | null;
  chapterId: string;
  academicSession?: string;
}): string {
  const chapterIdentity = input.canonicalChapterId ?? `internal:${input.chapterId}`;
  return [
    input.boardId,
    input.classNum,
    input.subject,
    input.academicSession ?? "session-unresolved",
    chapterIdentity,
  ].map(encodeURIComponent).join("|");
}

export function isBoardApplicable(
  applicability: BoardApplicability | undefined,
  verifiedBoards: BoardId[] | undefined,
  selectedBoard: BoardId,
): boolean {
  if (applicability === selectedBoard) return true;
  if (applicability !== "Both") return false;
  // Existing CBSE content tagged "Both" remains available for the current
  // CBSE experience. Other boards require explicit, verified applicability.
  return selectedBoard === "CBSE" || verifiedBoards?.includes(selectedBoard) === true;
}

export interface AcademicContentMetadata {
  boardApplicability?: BoardApplicability;
  verifiedBoards?: BoardId[];
  classNum: number;
  subject: string;
}

export function matchesAcademicContentContext(
  content: AcademicContentMetadata,
  context: AcademicContext & { subject: string },
  subjectMatches = content.subject === context.subject,
): boolean {
  return content.classNum === context.classNum &&
    subjectMatches &&
    isBoardApplicable(content.boardApplicability, content.verifiedBoards, context.boardId);
}
