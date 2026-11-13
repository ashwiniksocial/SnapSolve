// @generated — DO NOT EDIT MANUALLY.
// Source of truth: scripts/src/canonicalCurriculum.ts
// Regenerate    : pnpm --filter @workspace/scripts run generate-canonical-registry
// Checksum      : 3c48eb700aa7b8bf

import type { CurriculumStatus } from "./types";

export interface CanonicalRegistryEntry {
  /** Official NCERT/board book code. null when SOURCE_UNRESOLVED or SOURCE_PENDING. */
  canonicalChapterId: string | null;
  curriculumStatus:   CurriculumStatus;
  internalId:         string;
  subjectId:          string;
  classId:            number;
  boardId:            string;
  academicSession:    string;
  /** Student-facing 1-based ordinal position within the subject group. */
  displayOrder:       number;
}

/**
 * Canonical chapter registry — the single browser-safe source of canonical IDs.
 * Generated from scripts/src/canonicalCurriculum.ts. DO NOT add entries here.
 */
export const CANONICAL_CHAPTER_REGISTRY: Readonly<Record<string, CanonicalRegistryEntry>> = {
  "CBSE|9|Biology|2026-27|bio-ch01": { canonicalChapterId: "iesc102", curriculumStatus: "ACTIVE", internalId: "bio-ch01", subjectId: "Biology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 2 },
  "CBSE|9|Biology|2026-27|bio-ch02": { canonicalChapterId: "iesc103", curriculumStatus: "ACTIVE", internalId: "bio-ch02", subjectId: "Biology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 3 },
  "CBSE|9|Biology|2026-27|bio-ch03": { canonicalChapterId: "iesc112", curriculumStatus: "ACTIVE", internalId: "bio-ch03", subjectId: "Biology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 12 },
  "CBSE|9|Biology|2026-27|bio-ch05": { canonicalChapterId: "iesc111", curriculumStatus: "ACTIVE", internalId: "bio-ch05", subjectId: "Biology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 11 },
  "CBSE|9|Chemistry|2026-27|chem-ch01": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", internalId: "chem-ch01", subjectId: "Chemistry", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 1 },
  "CBSE|9|Chemistry|2026-27|chem-ch02": { canonicalChapterId: "iesc105", curriculumStatus: "ACTIVE", internalId: "chem-ch02", subjectId: "Chemistry", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 5 },
  "CBSE|9|Chemistry|2026-27|chem-ch03": { canonicalChapterId: "iesc109", curriculumStatus: "ACTIVE", internalId: "chem-ch03", subjectId: "Chemistry", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 9 },
  "CBSE|9|Chemistry|2026-27|chem-ch04": { canonicalChapterId: "iesc108", curriculumStatus: "ACTIVE", internalId: "chem-ch04", subjectId: "Chemistry", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 8 },
  "CBSE|9|Earth%20Science|2026-27|esc-ch01": { canonicalChapterId: "iesc113", curriculumStatus: "ACTIVE", internalId: "esc-ch01", subjectId: "Earth Science", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 13 },
  "CBSE|9|Information%20Technology|2026-27|it402-unit1": { canonicalChapterId: "402-IT-IX-unit1", curriculumStatus: "ACTIVE", internalId: "it402-unit1", subjectId: "Information Technology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 1 },
  "CBSE|9|Information%20Technology|2026-27|it402-unit2": { canonicalChapterId: "402-IT-IX-unit2", curriculumStatus: "ACTIVE", internalId: "it402-unit2", subjectId: "Information Technology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 2 },
  "CBSE|9|Information%20Technology|2026-27|it402-unit3": { canonicalChapterId: "402-IT-IX-unit3", curriculumStatus: "ACTIVE", internalId: "it402-unit3", subjectId: "Information Technology", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 3 },
  "CBSE|9|Mathematics|2026-27|ch1": { canonicalChapterId: "iemh103", curriculumStatus: "ACTIVE", internalId: "ch1", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 3 },
  "CBSE|9|Mathematics|2026-27|ch15": { canonicalChapterId: "iemh107", curriculumStatus: "ACTIVE", internalId: "ch15", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 7 },
  "CBSE|9|Mathematics|2026-27|ch16": { canonicalChapterId: "iemh104", curriculumStatus: "ACTIVE", internalId: "ch16", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 4 },
  "CBSE|9|Mathematics|2026-27|ch17": { canonicalChapterId: "iemh108", curriculumStatus: "ACTIVE", internalId: "ch17", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 8 },
  "CBSE|9|Mathematics|2026-27|ch18": { canonicalChapterId: "iemh106", curriculumStatus: "ACTIVE", internalId: "ch18", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 6 },
  "CBSE|9|Mathematics|2026-27|ch3": { canonicalChapterId: "iemh101", curriculumStatus: "ACTIVE", internalId: "ch3", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 1 },
  "CBSE|9|Mathematics|2026-27|ch4": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", internalId: "ch4", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 5 },
  "CBSE|9|Mathematics|2026-27|iemh102": { canonicalChapterId: "iemh102", curriculumStatus: "ACTIVE", internalId: "iemh102", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 2 },
  "CBSE|9|Mathematics|2026-27|iemh105": { canonicalChapterId: "iemh105", curriculumStatus: "ACTIVE", internalId: "iemh105", subjectId: "Mathematics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 5 },
  "CBSE|9|Physics|2026-27|phy-ch1": { canonicalChapterId: "iesc104", curriculumStatus: "ACTIVE", internalId: "phy-ch1", subjectId: "Physics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 4 },
  "CBSE|9|Physics|2026-27|phy-ch2": { canonicalChapterId: "iesc106", curriculumStatus: "ACTIVE", internalId: "phy-ch2", subjectId: "Physics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 6 },
  "CBSE|9|Physics|2026-27|phy-ch4": { canonicalChapterId: "iesc107", curriculumStatus: "ACTIVE", internalId: "phy-ch4", subjectId: "Physics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 7 },
  "CBSE|9|Physics|2026-27|phy-ch5": { canonicalChapterId: "iesc110", curriculumStatus: "ACTIVE", internalId: "phy-ch5", subjectId: "Physics", classId: 9, boardId: "CBSE", academicSession: "2026-27", displayOrder: 10 },
} as const;

/** Look up a chapter only within its exact board/class/subject context. */
export function lookupCanonical(internalId: string, boardId: string, classId: number, subjectId: string, academicSession?: string): CanonicalRegistryEntry | undefined {
  const matches = Object.values(CANONICAL_CHAPTER_REGISTRY).filter((entry) =>
    entry.internalId === internalId && entry.boardId === boardId && entry.classId === classId && entry.subjectId === subjectId &&
    (academicSession === undefined || entry.academicSession === academicSession),
  );
  return matches.length === 1 ? matches[0] : undefined;
}

/**
 * Student-facing display order for all Class 9 chapters.
 * Maps internalId → 1-based ordinal position within its subject group.
 * Generated from scripts/src/canonicalCurriculum.ts. DO NOT edit manually.
 */
export const CLASS9_DISPLAY_ORDER: Readonly<Record<string, number>> = {
  "bio-ch01": 2,
  "bio-ch02": 3,
  "bio-ch05": 11,
  "bio-ch03": 12,
  "chem-ch02": 5,
  "chem-ch04": 8,
  "chem-ch03": 9,
  "esc-ch01": 13,
  "it402-unit1": 1,
  "it402-unit2": 2,
  "it402-unit3": 3,
  "ch3": 1,
  "iemh102": 2,
  "ch1": 3,
  "ch16": 4,
  "iemh105": 5,
  "ch18": 6,
  "ch15": 7,
  "ch17": 8,
  "phy-ch1": 4,
  "phy-ch2": 6,
  "phy-ch4": 7,
  "phy-ch5": 10,
} as const;
