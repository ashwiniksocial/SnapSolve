// @generated — DO NOT EDIT MANUALLY.
// Source of truth: scripts/src/canonicalCurriculum.ts
// Regenerate    : pnpm --filter @workspace/scripts run generate-canonical-registry
// Checksum      : 8c8c21cdd01ff40b

import type { CurriculumStatus } from "./types";

export interface CanonicalRegistryEntry {
  /** Official NCERT/board book code. null when SOURCE_UNRESOLVED or SOURCE_PENDING. */
  canonicalChapterId: string | null;
  curriculumStatus:   CurriculumStatus;
  subjectId:          string;
  classId:            number;
  boardId:            string;
}

/**
 * Canonical chapter registry — the single browser-safe source of canonical IDs.
 * Generated from scripts/src/canonicalCurriculum.ts. DO NOT add entries here.
 */
export const CANONICAL_CHAPTER_REGISTRY: Readonly<Record<string, CanonicalRegistryEntry>> = {
  "bio-ch01": { canonicalChapterId: "iesc102", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE" },
  "bio-ch02": { canonicalChapterId: "iesc103", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE" },
  "bio-ch03": { canonicalChapterId: "iesc112", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE" },
  "bio-ch05": { canonicalChapterId: "iesc111", curriculumStatus: "ACTIVE", subjectId: "Biology", classId: 9, boardId: "CBSE" },
  "ch1": { canonicalChapterId: "iemh103", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch15": { canonicalChapterId: "iemh107", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch16": { canonicalChapterId: "iemh104", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch17": { canonicalChapterId: "iemh108", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch18": { canonicalChapterId: "iemh106", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch3": { canonicalChapterId: "iemh101", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "ch4": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "chem-ch01": { canonicalChapterId: null, curriculumStatus: "SOURCE_UNRESOLVED", subjectId: "Chemistry", classId: 9, boardId: "CBSE" },
  "chem-ch02": { canonicalChapterId: "iesc105", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE" },
  "chem-ch03": { canonicalChapterId: "iesc109", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE" },
  "chem-ch04": { canonicalChapterId: "iesc108", curriculumStatus: "ACTIVE", subjectId: "Chemistry", classId: 9, boardId: "CBSE" },
  "esc-ch01": { canonicalChapterId: "iesc113", curriculumStatus: "ACTIVE", subjectId: "Earth Science", classId: 9, boardId: "CBSE" },
  "iemh102": { canonicalChapterId: "iemh102", curriculumStatus: "ACTIVE", subjectId: "Mathematics", classId: 9, boardId: "CBSE" },
  "phy-ch1": { canonicalChapterId: "iesc104", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE" },
  "phy-ch2": { canonicalChapterId: "iesc106", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE" },
  "phy-ch4": { canonicalChapterId: "iesc107", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE" },
  "phy-ch5": { canonicalChapterId: "iesc110", curriculumStatus: "ACTIVE", subjectId: "Physics", classId: 9, boardId: "CBSE" },
} as const;

/** Look up the canonical registry entry for a question-bank internal chapter ID. */
export function lookupCanonical(internalId: string): CanonicalRegistryEntry | undefined {
  return CANONICAL_CHAPTER_REGISTRY[internalId];
}
