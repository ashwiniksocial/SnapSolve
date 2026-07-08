# GATEWAY_FIX_VERIFICATION.md

**Document type:** Post-Implementation Verification Record  
**Date:** 2026-07-08  
**Source authorization:** `GATEWAY_CHANGE_APPROVAL.md` — items GC-01 and GC-04 only  
**Scope:** Two approved gateway corrections. No other code, content, tags, routing, adapters, or question banks touched.

---

## 1. Exact files changed

| File | Lines changed | Status |
|---|---|---|
| `scripts/src/curriculumGateway.ts` | 2 lines modified | Only file touched |

No other file in the repository was modified. Confirmed via `git status --porcelain`:

```
 M scripts/src/curriculumGateway.ts
```

---

## 2. Exact diff

```diff
--- a/scripts/src/curriculumGateway.ts
+++ b/scripts/src/curriculumGateway.ts
@@ -73,7 +73,7 @@ const EXPECTED: Record<string, ExpectedChapter[]> = {
     { name: "Congruence of Triangles",          slug: "congruence-of-triangles" },
     { name: "Comparing Quantities",             slug: "comparing-quantities" },
     { name: "Rational Numbers",                 slug: "rational-numbers" },
-    { name: "Practical Geometry",               slug: "practical-geometry" },
+    { name: "Practical Geometry",               slug: "practical-geometry", cbseDeleted: true },
     { name: "Perimeter and Area",               slug: "perimeter-and-area" },
     { name: "Algebraic Expressions",            slug: "algebraic-expressions" },
     { name: "Exponents and Powers",             slug: "exponents-and-powers" },
@@ -101,7 +101,7 @@ const EXPECTED: Record<string, ExpectedChapter[]> = {
     { name: "Polynomials",                              slug: "polynomials" },
     { name: "Coordinate Geometry",                      slug: "coordinate-geometry" },
     { name: "Linear Equations in Two Variables",        slug: "linear-equations-in-two-variables" },
-    { name: "Introduction to Euclid's Geometry",        slug: "euclids-geometry", cbseDeleted: true },
+    { name: "Introduction to Euclid's Geometry",        slug: "euclids-geometry" },
     { name: "Lines and Angles",                         slug: "lines-and-angles" },
     { name: "Triangles",                                slug: "triangles" },
     { name: "Quadrilaterals",                           slug: "quadrilaterals" },
```

`git diff --stat`: `1 file changed, 2 insertions(+), 2 deletions(-)`

---

## 3. Before / after gateway state

### Change 1 — Class 9 Maths, `9-Mathematics` array, line 104

| | Before | After |
|---|---|---|
| Entry | `{ name: "Introduction to Euclid's Geometry", slug: "euclids-geometry", cbseDeleted: true }` | `{ name: "Introduction to Euclid's Geometry", slug: "euclids-geometry" }` |
| Gateway treatment | Non-exam chapter — exempt from 20-question minimum floor | Full active exam chapter — subject to 20-question minimum floor |
| Basis | GC-01 — CONTRADICTED by official CBSE 2022-23 and 2026-27 Maths syllabi (chapter present in both) | Approved correction applied |

### Change 2 — Class 7 Maths, `7-Mathematics` array, line 76

| | Before | After |
|---|---|---|
| Entry | `{ name: "Practical Geometry", slug: "practical-geometry" }` | `{ name: "Practical Geometry", slug: "practical-geometry", cbseDeleted: true }` |
| Gateway treatment | Full active chapter — subject to 50-question minimum floor | Non-exam chapter — exempt from 50-question minimum floor |
| Basis | GC-04 — VERIFIED by official NCERT rationalization booklet (chapter dropped in full, pages 193–204) | Approved correction applied |

### Untouched, per explicit instruction

| Entry | Location | Status |
|---|---|---|
| Class 9 Physics "Gravitation" | `9-Physics`, line 125 | Unchanged — no `cbseDeleted` flag before or after |
| Class 7 Maths "Visualising Solid Shapes" (Ch15) | `7-Mathematics`, line 81 | Unchanged — no `cbseDeleted` flag before or after |
| Class 9 Maths "Constructions" (Ch11) | `9-Mathematics`, line 110 | Unchanged — `cbseDeleted: true` retained (GC-02: no action needed) |
| Question content, tags, routing, adapters, question banks | — | Not touched |

---

## 4. TypeScript validation result

Command: `pnpm run typecheck` (in `scripts` package)

```
> @workspace/scripts@0.0.0 typecheck
> tsc -p tsconfig.json --noEmit

EXIT: 0
```

**Result: PASS.** No type errors introduced.

---

## 5. Curriculum-check result

Command: `pnpm run curriculum-check` (in `scripts` package)

```
CURRICULUM QUALITY REPORT
Classes audited:  6, 7, 8, 9
Subjects audited: Mathematics, Economics, Physics
Chapters audited: 67
Total questions:  3997

FAILURES (0)
  [PASS] No failures detected.

WARNINGS (15)  — unchanged pre-existing content-quality warnings (difficulty
                 distribution, question-count floors on unrelated chapters):
  6-Mathematics: Mensuration, Algebra, Ratio and Proportion — Hard % above threshold
  7-Mathematics: Congruence of Triangles, Practical Geometry, Perimeter and Area — Hard % above threshold
  8-Mathematics: Cubes and Cube Roots, Mensuration, Exponents and Powers,
                 Direct and Inverse Proportions, Introduction to Graphs — Hard % above threshold
  9-Mathematics: Triangles (19q), Quadrilaterals (17q), Probability (19q) below 20q floor
  9-Mathematics: chapter-size spread warning (Coordinate Geometry 56q vs Quadrilaterals 17q)

SUMMARY
  [WARN] 6-Mathematics   14 chapters · 3 warnings
  [WARN] 7-Mathematics   15 chapters · 3 warnings
  [WARN] 8-Mathematics   14 chapters · 5 warnings
  [PASS] 9-Economics      4 chapters · clean
  [WARN] 9-Mathematics   15 chapters · 4 warnings
  [PASS] 9-Physics        5 chapters · clean

  [PASS] CURRICULUM GATEWAY: PASS — 15 warning(s), 0 failures

EXIT: 0
```

**Result: PASS.** Zero failures, zero new warnings attributable to the two changes.

**Note on Chapter 5 (Euclid's Geometry):** now that it is a full active chapter subject to the 20-question minimum floor, it did **not** trigger a `[W1]` under-count warning — the bank already carries sufficient questions for this chapter. No new warning appeared for Euclid's Geometry.

**Note on Chapter 10 (Practical Geometry, Class 7):** now that it is exempt as `cbseDeleted`, no minimum-floor warning is expected or triggered for it in this run (it was not under the floor before either, so no warning disappeared as a visible side effect).

---

## 6. Status report result

Command: `pnpm run status` (in `scripts` package)

Relevant excerpt — Class 9 Mathematics chapter list (unchanged names/order, confirming no chapter renaming or removal):

```
Class 9 Mathematics
  Chapters:  15
  Questions: 584
    Ch01. Number Systems
    ...
    Ch05. Introduction to Euclid
    ...
    Ch11. Constructions
    ...

Class 7 Mathematics
  Chapters:  15
  Questions: 1129
    ...
    Ch10. Practical Geometry
    ...
    Ch15. Visualising Solid Shapes
```

Curriculum Quality Gateway section embedded in the status report matches the standalone curriculum-check run exactly: **PASS — 15 warnings, 0 failures.**

Git diff summary embedded in the report correctly reflects the change:

```
Uncommitted changes (diff HEAD --stat):
scripts/src/curriculumGateway.ts | 4 ++--
 1 file changed, 2 insertions(+), 2 deletions(-)
```

**Result: PASS.** No structural changes to chapter counts, routes, navigation, or content detected.

---

## 7. Unexpected regressions

**None caused by this change.**

One **pre-existing, unrelated discrepancy** was observed and is called out for transparency (not introduced by this fix):

- `curriculum-check` reports **9-Mathematics: 499 questions**, while `status` reports **9-Mathematics: 584 questions**.
- This is a pre-existing difference between the two scripts' counting methods (they read from different source representations — the gateway's raw count vs. the status report's computed count) and is unrelated to the `cbseDeleted` flag changes made here. It existed before this task and was not created or worsened by either edit.
- No action was taken on this discrepancy per the "no other code changes" instruction. Flagging it here for future investigation only.

No new `[FAIL]` entries, no new `[WARN]` entries tied to Chapter 5 or Chapter 10, no route changes, no navigation changes, and no change to any question bank, tag, or adapter file.

---

## 8. Summary

| Item | Result |
|---|---|
| GC-01 (remove `cbseDeleted` from Cl9 Maths Ch5) | ✅ Implemented exactly as approved |
| GC-04 (add `cbseDeleted` to Cl7 Maths Ch10) | ✅ Implemented exactly as approved |
| Cl9 Physics Gravitation | ✅ Untouched |
| Cl7 Ch15 Visualising Solid Shapes | ✅ Untouched |
| Question content / tags / routing / adapters / banks | ✅ Untouched |
| TypeScript validation | ✅ PASS (exit 0) |
| Curriculum-check | ✅ PASS — 0 failures, 15 pre-existing warnings, none new |
| Status report | ✅ PASS — no structural regressions |
| Files changed | 1 (`scripts/src/curriculumGateway.ts`), 2 lines |

No further action required for GC-01 and GC-04. GC-05 (Class 7 Ch15) remains blocked pending official evidence, per `GATEWAY_CHANGE_APPROVAL.md`.
