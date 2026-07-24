# Dependency Audit — `gold-standard/` Folder
**Date:** 2026-07-24  
**Type:** Read-only audit — nothing modified  
**Purpose:** Determine safe-deletion status of the legacy `gold-standard/` folder

---

## 1. Folder Inventory

`gold-standard/` contains 9 files, 16 lesson benchmark records, across 6 subjects:

| File | Contents |
|---|---|
| `README.md` | Developer usage notes — never executed |
| `types.ts` | Type definitions: `GoldStandardLesson`, `CMFCompliance`, `LessonOutlineSection`, `SupportedSubject`, `SupportedClass`, `SupportedBoard` |
| `index.ts` | Barrel export, `ALL_GOLD_STANDARDS` flat array (16 entries), `getLibrarySummary()` function |
| `mathematics.ts` | 4 benchmark records: fractions, linear equations, Pythagoras, quadratics |
| `physics.ts` | 3 benchmark records: Newton's 2nd Law, pressure in fluids, Ohm's Law |
| `chemistry.ts` | 3 benchmark records: balancing equations, acids/bases, atomic structure |
| `biology.ts` | 2 benchmark records: photosynthesis, cell structure |
| `computerScience.ts` | 2 benchmark records: for loops, functions |
| `economics.ts` | 2 benchmark records: demand/supply/equilibrium, money/barter |

The folder's own `index.ts` header states explicitly:

> *"Developer-only. NEVER imported by any runtime service. Import this file only in developer tools, benchmarking scripts, or test harnesses."*

The `README.md` states:

> *"This library is currently reference only — it is not integrated into generation or the Quality Pipeline."*

---

## 2. External Files Referencing `gold-standard/`

**Search scope:** entire repository — all `.ts`, `.tsx`, `.js`, `.json`, `.md`, `.sh`, `.yaml`, `.toml` files.

### 2a. TypeScript / JavaScript imports

```
grep -rn "from.*gold-standard" --include="*.ts" --include="*.tsx" --include="*.js" .
```

**Result: zero matches outside `gold-standard/` itself.**

No TypeScript or JavaScript file outside `gold-standard/` imports from this folder. The symbols `ALL_GOLD_STANDARDS`, `GoldStandardLesson`, `CMFCompliance`, `LessonOutlineSection`, and `getLibrarySummary()` are defined and referenced exclusively within the folder.

### 2b. Documentation files

Two external Markdown files contain references:

| File | Line(s) | Reference | Nature |
|---|---|---|---|
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | 85 | `gold-standard/biology.ts` — described as containing "one example gold standard lesson used as a pedagogy template, not a question bank" | Documentation only |
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | 160 | Same file, same description in the Science gap analysis section | Documentation only |
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | 245 | `gold-standard/biology.ts` listed in "Repository files cited" inventory | Documentation only |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md` | 40 | `├── gold-standard/  # Gold-standard reference content` in the top-level directory tree | Documentation only |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md` | 375 | `## gold-standard/ — Reference content` section heading with sub-tree listing | Documentation only |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md` | 380 | Sub-tree listing of the folder's files | Documentation only |

### 2c. Build and config files

```
grep -rn "gold-standard" --include="*.json" --include="*.toml" --include="*.yaml" --include="*.sh" .
```

**Result: zero matches.**

No `tsconfig.json`, `package.json`, `pnpm-workspace.yaml`, `artifact.toml`, or shell script references this folder.

### 2d. Tests

```
find . -name "*.test.ts" -o -name "*.spec.ts" | xargs grep -l "gold-standard"
```

**Result: zero matches.** No test file references `gold-standard/`.

### 2e. Scripts (curriculum validation, academic review, generation)

```
grep -rn "gold-standard\|GoldStandard\|ALL_GOLD" scripts/src/
```

**Result: zero matches.**

`curriculumGateway.ts`, `academicReview.ts`, `validateCurriculum.ts`, `questionBankAudit.ts`, and every other script in `scripts/src/` have no dependency on this folder.

---

## 3. Dependency Classification — Per External Reference

| External file | Symbol / path referenced | Runtime | Question generation | Academic review | Curriculum validation | Tests | Build | Documentation only |
|---|---|---|---|---|---|---|---|---|
| `CLASS9_SCIENCE_LAUNCH_READINESS.md:85` | `gold-standard/biology.ts` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |
| `CLASS9_SCIENCE_LAUNCH_READINESS.md:160` | `gold-standard/biology.ts` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |
| `CLASS9_SCIENCE_LAUNCH_READINESS.md:245` | `gold-standard/biology.ts` | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md:40` | `gold-standard/` directory | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md:375` | `gold-standard/` section | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md:380` | `gold-standard/` sub-tree | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✅ |

**All 6 external references are documentation-only. Zero affect runtime, generation, review, validation, tests, or build.**

---

## 4. Safe-Deletion Verdict

**Yes — `gold-standard/` can be deleted safely.**

Grounds:
- Zero TypeScript/JavaScript imports from outside the folder
- Zero references in any build or config file
- Zero references in any test file
- Zero references in any script (curriculum gateway, academic review, question generation)
- Zero runtime exposure — the folder is never bundled, never served, never called
- All 6 external references are in Markdown documentation files only

---

## 5. Exact Cleanup Required Before Deletion

Only documentation files need to be updated. No code changes are required.

### File 1: `CLASS9_SCIENCE_LAUNCH_READINESS.md`

Three references must be removed or reworded:

| Location | Current text | Required action |
|---|---|---|
| Line 85 (table cell) | `Pedagogical/academic notes exist in \`academic-knowledge/subjects/biology/class9.ts\` and \`gold-standard/biology.ts\`, but zero question-bank content` | Remove the `and \`gold-standard/biology.ts\`` clause |
| Line 160 (bullet) | `\`gold-standard/biology.ts\` — one example "gold standard" lesson (\`biology-cell-structure-class9\`) used as a pedagogy template, not a question bank.` | Remove the entire bullet |
| Line 245 (inventory list) | `gold-standard/biology.ts` in the "Repository files cited" list | Remove the entry from the list |

### File 2: `docs/GOVERNANCE/PROJECT_STRUCTURE.md`

The entire `## gold-standard/ — Reference content` section (lines 375–388) and the line `├── gold-standard/ # Gold-standard reference content` (line 40) must be removed.

---

## 6. Approved Question & Answer Acceptance Checklist — Location Confirmed

The approved SnapSolve **Question & Answer Acceptance Checklist** is stored at:

```
artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts
```

It is an 18-point runtime checklist (`CHECKLIST: ChecklistItem[]`) used live by the Teaching Quality Pipeline to evaluate every AI-generated lesson before it reaches the student. It defines 9 scored dimensions:

`vocabulary` · `conceptTeaching` · `reasoning` · `stepExplanation` · `examples` · `memory` · `practice` · `confidenceBuilding` · `weakStudentUnderstanding`

This file has **no relationship whatsoever** to `gold-standard/`:

| Dimension | `gold-standard/` | `qualityChecklist.ts` |
|---|---|---|
| Location | `gold-standard/types.ts` → `CMFCompliance` | `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts` |
| Type | 15-point CMF compliance struct (all-boolean) | 18-point scored checklist with `ChecklistItem[]` |
| Purpose | Developer benchmark — spec of what a good lesson outline contains | Runtime evaluator — scores every generated lesson in the quality pipeline |
| Used at runtime | Never | Yes — called in `teachingQualityService.ts` on every AI response |
| Used in academic review | Never | No (separate system) |

Deleting `gold-standard/` does not touch, affect, or overlap with `qualityChecklist.ts` in any way.

---

## Summary

| Item | Finding |
|---|---|
| Files in `gold-standard/` | 9 files, 16 lesson benchmark records |
| External TS/JS imports | **0** |
| External build/config references | **0** |
| External test references | **0** |
| External script references | **0** |
| External doc references | **6** (in 2 Markdown files — documentation only) |
| Runtime impact of deletion | **None** |
| Question generation impact | **None** |
| Academic review impact | **None** |
| Curriculum validation impact | **None** |
| Build impact | **None** |
| Safe to delete | **Yes** |
| Pre-deletion code changes required | **None** |
| Pre-deletion doc cleanup required | **Yes** — 2 Markdown files, 6 lines (optional; stale links only) |
| Approved Q&A Acceptance Checklist affected | **No** — stored separately at `artifacts/api-server/src/services/teachingQuality/qualityChecklist.ts` |
