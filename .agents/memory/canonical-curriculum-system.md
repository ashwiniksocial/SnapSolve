---
name: Canonical Academic System
description: Architecture and governance rules for the canonical curriculum contract that replaced all hardcoded chapter registries.
---

## Rule
`scripts/src/canonicalCurriculum.ts` is the single maintained source of truth for all curriculum identity.

- No other file may maintain its own chapter-title or chapter-ID registry.
- `canonicalChapterRegistry.gen.ts` is GENERATED output from the script — do not edit it.
- After any change to `canonicalCurriculum.ts`, run `generate-canonical-registry` to sync.

## Why
Multiple hardcoded copies (EXPECTED table, MATHS_CONTENT_RECORDS, canonicalIdLookup.ts) created drift and stale titles. Replaced with one contract keyed by official NCERT 2026-27 book codes (iemhXXX, iescXXX).

## ChapterMeta schema (current, required fields)
- `canonicalChapterId: string | null` — null for SOURCE_UNRESOLVED/SOURCE_PENDING; never use status strings as IDs
- `curriculumStatus: CurriculumStatus` — "ACTIVE" | "SOURCE_PENDING" | "SOURCE_UNRESOLVED" | "OFFICIALLY_DELETED"
- Both fields are required (not optional) on ChapterMeta
- CurriculumStatus defined in `types.ts`

## How to apply
- New chapter → add to `INTERNAL_TO_CANONICAL` in `canonicalCurriculum.ts` first, then run `generate-canonical-registry`, then run `curriculum-check`.
- Browser/Vite code needing canonical IDs → import `lookupCanonical` from `canonicalChapterRegistry.gen.ts`.
- Academic review resolution → `getCanonicalChapter(q.chapterId)` by internal ID; no fuzzy matching.
- Relational joins in conceptGraph → use `chapterId` field (not `chapter` display string).

## Key files
- `scripts/src/canonicalCurriculum.ts` — single maintained source; Node.js-only (uses fs)
- `scripts/src/generateCanonicalRegistry.ts` — writes generated browser-safe file + checksum
- `artifacts/homework-hero/src/data/questions/canonicalChapterRegistry.gen.ts` — GENERATED; browser-safe; do not edit
- `curriculum/generated/canonical-registry-checksum.json` — GENERATED; F11 sync guard reads this
- `curriculum/generated/class9-active-freeze.json` — GENERATED derived output; not curriculum authority

## Deleted files (intentional)
- `canonicalIdLookup.ts` — was manually maintained mirror; replaced by generated registry
- `class9-bundle.ts` — was duplicate of index.ts

## Validation commands
- `pnpm --filter @workspace/scripts run generate-canonical-registry` — must run after any canonicalCurriculum.ts change
- `pnpm --filter @workspace/scripts run curriculum-check` — F1-F11 gates; F11 = stale generated registry
- `pnpm --filter @workspace/scripts run validate-curriculum` — display-order invariants

## SOURCE_UNRESOLVED chapters (confirmed 2026-27 mismatches, canonicalChapterId = null)
- `ch4` (Math): questions cover old-NCERT linear equations; iemh105 in 2026-27 is circles
- `chem-ch01` (Chemistry): questions cover states of matter; iesc101 in 2026-27 is intro chapter

## V2 chapterId prefixing
- Chemistry → `chem-${raw}`, Biology → `bio-${raw}`, others unchanged
- Applied in v2adapter.ts `prefixChapterId` AND academicReview.ts `normalizeV2`

## Economics status
- UNREGISTERED — no question files exist; not in canonical contract
- Class 9 Economics was planned but never implemented
- No Economics files in question-bank/ or homework-hero/src/data/questions/
- Do NOT invent canonical IDs for Economics until official source evidence is obtained
