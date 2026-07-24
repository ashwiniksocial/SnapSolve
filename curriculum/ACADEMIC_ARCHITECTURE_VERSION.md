# Academic Architecture — Version Marker

**Version:** 1.0  
**Status:** FROZEN  
**Created:** 2026-07-24  

---

## Canonical Contract

| Field | Value |
|---|---|
| Contract file | `scripts/src/canonicalCurriculum.ts` |
| Academic session | 2026-27 |
| Board | CBSE |
| Classes registered | 9 |
| Subjects registered | Mathematics, Physics, Chemistry, Biology, Earth Science |
| Total chapters | 21 |
| Generated registry checksum | `8c8c21cdd01ff40b` |
| Checksum file | `curriculum/generated/canonical-registry-checksum.json` |
| Browser-safe registry | `artifacts/homework-hero/src/data/questions/canonicalChapterRegistry.gen.ts` |
| Freeze file | `curriculum/generated/class9-active-freeze.json` |

## Question Counts (authoritative, at freeze)

| Subject | Chapters | Format | Questions |
|---|---|---|---|
| Mathematics | 8 | V1 | 500 |
| Physics | 4 | V1 | 200 |
| Chemistry | 4 | V2 | 300 |
| Biology | 4 | V2 / Placeholder | 300 |
| Earth Science | 1 | Placeholder | 85 |
| **Total registered** | **21** | | **1,385** |
| Review-eligible (ACTIVE only) | 19 | | **1,260** |
| Blocked (SOURCE_UNRESOLVED) | 2 | | 125 |

Counts verified by `grep -c "difficulty:"` per file — one match per question object exactly.

## Architecture Governance

> **Architecture changes are permitted only for:**
> 1. verified software defects;
> 2. official curriculum changes;
> 3. new board/class support.

Any other modification to the canonical contract, generated outputs, or question-bank registration is prohibited until one of the above conditions is met and documented.

## Key Invariants

- `scripts/src/canonicalCurriculum.ts` is the single maintained source of curriculum identity. No other file may maintain its own chapter-title or chapter-ID registry.
- `canonicalChapterRegistry.gen.ts` is generated output — never edit manually. Regenerate with `pnpm --filter @workspace/scripts run generate-canonical-registry` after any canonical contract change.
- `canonicalChapterId` in `ChapterMeta` is `string | null`. `null` means SOURCE_UNRESOLVED or SOURCE_PENDING. Status strings are never used as ID values.
- `class9-active-freeze.json` is derived output. It documents the frozen state; it does not govern runtime behaviour.
- F11 in `curriculum-check` detects any divergence between the canonical contract and the generated registry. It must pass (0 failures) before any release.

## SOURCE_UNRESOLVED chapters at freeze

| Internal ID | Subject | Reason |
|---|---|---|
| `ch4` | Mathematics | Questions cover "Linear Equations in Two Variables" (old NCERT). The 2026-27 Ganita Manjari chapter at this index position is "Circles". Topic mismatch unresolved. |
| `chem-ch01` | Chemistry | Questions cover "States of Matter". The 2026-27 Curiosity Book 1 chapter at this index is the introductory chapter. Topic mismatch unresolved. |

Both chapters are runtime-active (questions served). Both are blocked from academic review until canonical source is confirmed against ncert.nic.in or cbseacademic.nic.in.

## Validation commands

```bash
# Regenerate generated outputs (after any canonical contract change)
pnpm --filter @workspace/scripts run generate-canonical-registry

# Curriculum gateway — must show 0 FAIL before any release
pnpm --filter @workspace/scripts run curriculum-check

# Display-order invariants
pnpm --filter @workspace/scripts run validate-curriculum

# TypeScript — all three packages must be clean
pnpm --filter @workspace/scripts exec tsc --noEmit
pnpm --filter @workspace/homework-hero exec tsc --noEmit
pnpm --filter @workspace/api-server exec tsc --noEmit
```
