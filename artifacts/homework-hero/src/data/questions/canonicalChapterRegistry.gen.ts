// @generated — DO NOT EDIT MANUALLY.
// Source of truth: scripts/src/canonicalCurriculum.ts
// Regenerate    : pnpm --filter @workspace/scripts run generate-canonical-registry
// Checksum      : 3ed6c957e4159bd9

import type { CurriculumStatus } from "./types";

export interface CanonicalRegistryEntry {
  /** Official NCERT/board book code. null when SOURCE_UNRESOLVED or SOURCE_PENDING. */
  canonicalChapterId: string | null;
  curriculumStatus:   CurriculumStatus;
  subjectId:          string;
  classId:            number;
  boardId:            string;
  /** Student-facing 1-based ordinal position within the subject group. */
  displayOrder:       number;
}

/**
 * Canonical chapter registry — the single browser-safe source of canonical IDs.
 * Generated from scripts/src/canonicalCurriculum.ts. DO NOT add entries here.
 */
export const CANONICAL_CHAPTER_REGISTRY: Readonly<Record<string, CanonicalRegistryEntry>> = {
  "bio-ch01": { canonicalChapterId: "iesc102", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE", displayOrder: 2 },
  "bio-ch02": { canonicalChapterId: "iesc103", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE", displayOrder: 3 },
  "bio-ch03": { canonicalChapterId: "iesc112", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE", displayOrder: 12 },
  "bio-ch05": { canonicalChapterId: "iesc111", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE", displayOrder: 11 },
  "ch1": { canonicalChapterId: "iemh103", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 3 },
  "ch15": { canonicalChapterId: "iemh107", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 7 },
  "ch16": { canonicalChapterId: "iemh104", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 4 },
  "ch17": { canonicalChapterId: "iemh108", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 8 },
  "ch18": { canonicalChapterId: "iemh106", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 6 },
  "ch3": { canonicalChapterId: "iemh101", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 1 },
  "ch4": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 5 },
  "chem-ch01": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", subjectId: "Chemistry", classId: 9, boardId: "CBSE", displayOrder: 1 },
  "chem-ch02": { canonicalChapterId: "iesc105", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE", displayOrder: 5 },
  "chem-ch03": { canonicalChapterId: "iesc109", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE", displayOrder: 9 },
  "chem-ch04": { canonicalChapterId: "iesc108", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE", displayOrder: 8 },
  "esc-ch01": { canonicalChapterId: "iesc113", curriculumStatus: "ACTIVE", subjectId: "Earth Science", classId: 9, boardId: "CBSE", displayOrder: 13 },
  "iemh102": { canonicalChapterId: "iemh102", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 2 },
  "iemh105": { canonicalChapterId: "iemh105", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE", displayOrder: 5 },
  "it402-unit1": { canonicalChapterId: "402-IT-IX-unit1", curriculumStatus: "ACTIVE", subjectId: "Information Technology", classId: 9, boardId: "CBSE", displayOrder: 1 },
  "it402-unit2": { canonicalChapterId: "402-IT-IX-unit2", curriculumStatus: "ACTIVE", subjectId: "Information Technology", classId: 9, boardId: "CBSE", displayOrder: 2 },
  "phy-ch1": { canonicalChapterId: "iesc104", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE", displayOrder: 4 },
  "phy-ch2": { canonicalChapterId: "iesc106", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE", displayOrder: 6 },
  "phy-ch4": { canonicalChapterId: "iesc107", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE", displayOrder: 7 },
  "phy-ch5": { canonicalChapterId: "iesc110", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE", displayOrder: 10 },
} as const;

/** Look up the canonical registry entry for a question-bank internal chapter ID. */
export function lookupCanonical(internalId: string): CanonicalRegistryEntry | undefined {
  return CANONICAL_CHAPTER_REGISTRY[internalId];
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
