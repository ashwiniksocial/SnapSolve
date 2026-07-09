# Class 9 Structure Alignment — Verification Report

**Date:** 2026-07-09  
**Source spec:** `docs/governance/CLASS9_STRUCTURE_ALIGNMENT.md`  
**Implemented by:** Agent session implementing CRITICAL + HIGH priority changes only  
**Scope restriction:** No new questions authored. No teaching prompts modified. No UI redesign. No architecture changes.

---

## 1. Implementation Summary

### CRITICAL changes (4 of 4 implemented)

| ID | Description | File(s) touched | Result |
|---|---|---|---|
| CHANGE-024 | `ALL_SUBJECTS` in Practice.tsx → `["Mathematics", "Science"]` | `Practice.tsx` | ✅ Done |
| CHANGE-025 | Add `"Science"` to `Subject` union type | `subjects.ts` | ✅ Done |
| CHANGE-026 | Add Science `SubjectConfig` entry to `SUBJECTS` record | `subjects.ts` | ✅ Done |
| CHANGE-027 | Science routing in `getChapters` + `getQuestions` + `getAllChapterStats` | `questionService.ts` | ✅ Done |

**Science routing detail:** `"Science"` fans out to Physics + Chemistry + Biology domain labels at the service layer. `getChapters(n, "Science")` returns the union of all three domains. `getQuestions({ subject: "Science" })` matches any question with `q.subject ∈ {Physics, Chemistry, Biology}`. `getAllChapterStats` now uses `ch.subject` (native domain) for chapter-level queries, so "Science" sessions never produce 0-question chapters.

### HIGH changes (12 of 12 implemented)

| ID | Description | File(s) touched | Result |
|---|---|---|---|
| CHANGE-001 | PROJECT_BASELINE Ch13 name: "Our Earth" → "Earth as a System: Energy, Matter & Life" (3 occurrences) | `PROJECT_BASELINE_2026_27.md` | ✅ Done |
| CHANGE-004 | Ch1 Maths name: "Number Systems" → "Number System" | `class9-maths-ch1.ts` CHAPTER_META + gateway EXPECTED | ✅ Done |
| CHANGE-005 | Ch2 Maths name: "Polynomials" → "Introduction to Polynomials" | `class9-maths-ch2.ts` CHAPTER_META + gateway EXPECTED | ✅ Done |
| CHANGE-006 | Register "Sequences and Progressions" in gateway EXPECTED | `curriculumGateway.ts` | ✅ Done (F7 FAIL expected — no content file) |
| CHANGE-007 | Register "Exploring Algebraic Identities" in gateway EXPECTED | `curriculumGateway.ts` | ✅ Done (F7 FAIL expected — no content file) |
| CHANGE-011 | "Areas of Parallelograms and Triangles" + "Heron's Formula" → `cbseDeleted: true`; add "Area and Perimeter" | `curriculumGateway.ts` | ✅ Done (F7 FAIL for "Area and Perimeter" expected — no content file) |
| CHANGE-014 | Ch4 Physics name: "Work and Energy" → "Work, Energy and Simple Machines" | `class9-physics-ch4.ts` CHAPTER_META + gateway EXPECTED | ✅ Done |
| CHANGE-015 | Ch3 Physics "Gravitation" → `cbseDeleted: true` in gateway | `curriculumGateway.ts` | ✅ Done |
| CHANGE-016 | Register `9-Chemistry` in gateway EXPECTED (4 chapters; `cbseDeleted` on ch01) | `curriculumGateway.ts` | ✅ Done |
| CHANGE-017 | Register `9-Biology` in gateway EXPECTED (4 exam chapters) | `curriculumGateway.ts` | ✅ Done |
| CHANGE-018 | Ch01 Biology name: "The Fundamental Unit of Life" → "Cell — The Fundamental Unit of Life" | `biology/class9.ts` ch01 declaration | ✅ Done |
| CHANGE-019 | Mark ch04 / ch05 / ch06 Biology as ⚠️ NON-EXAM 2026-27 with authoritative JSDoc comment | `biology/class9.ts` (WHY_DO_WE_FALL_ILL, NATURAL_RESOURCES, IMPROVEMENT_IN_FOOD_RESOURCES) | ✅ Done |
| CHANGE-020 | Add full `REPRODUCTION` ChapterKnowledge entry (ch11, Biology, exam-active 2026-27) | `biology/class9.ts` + BIOLOGY_CLASS9 export array | ✅ Done |
| CHANGE-023 | Ch02 Chemistry chapterName: "Is Matter Around Us Pure?" → "Exploring Mixtures" | `chemistry/class9.ts` ch02 declaration + JSDoc comment | ✅ Done |

**Not implemented (MEDIUM / LOW priority — out of scope):**  
CHANGE-002, 003 (CLASS9_STRUCTURE_ALIGNMENT.md self-corrections — MEDIUM),  
CHANGE-008–010, 012–013 (Maths chapter subtitle tweaks — MEDIUM),  
CHANGE-021, 022 (Biology ch02/ch03 name corrections — MEDIUM),  
CHANGE-003 (Gateway F5 formula — LOW), CHANGE-028–030 (LOW housekeeping).

---

## 2. TypeScript Results

```
$ pnpm --filter @workspace/homework-hero run typecheck
→  Exit 0  ✅  (0 errors)

$ pnpm run typecheck:libs
→  Exit 0  ✅  (0 errors)

$ pnpm --filter @workspace/scripts run typecheck
→  Exit 0  ✅  (0 errors)
```

All three packages typecheck cleanly after adding `Science` to every `Record<Subject, …>` literal in:
- `useProgress.ts` (2 objects)
- `ExamMode.tsx` (4 objects)
- `DevTeachingValidator.tsx` (CHAPTER_MAP)
- `services/ai/topicMatcher.ts` (SUBJECT_HINTS)

---

## 3. Curriculum Gateway Results

```
$ pnpm --filter @workspace/scripts run curriculum-check
```

### Scope
| Metric | Value |
|---|---|
| Classes audited | 6, 7, 8, 9 |
| Subjects audited | Mathematics, Economics, Physics (Chemistry and Biology register new F7 gaps; no data to tabulate yet) |
| Chapters audited | 67 |
| Total questions | 3,997 |

### Failures (10) — all documented content gaps

| Code | Message | Classification |
|---|---|---|
| F7 | Missing: "Sequences and Progressions" (9-Mathematics) | **Expected** — CHANGE-006; new 2026-27 chapter, no question file authored yet |
| F7 | Missing: "Exploring Algebraic Identities" (9-Mathematics) | **Expected** — CHANGE-007; new 2026-27 chapter, no question file authored yet |
| F7 | Missing: "Area and Perimeter" (9-Mathematics) | **Expected** — CHANGE-011; replaces deleted chapters, no question file authored yet |
| F7 | Missing: "Exploring Mixtures" (9-Chemistry) | **Expected** — CHANGE-023; QB file still carries old chapter name "Is Matter Around Us Pure?" (different 2026-27 scope — content gap signals authoring need) |
| F7 | Missing: "Structure of the Atom" (9-Chemistry) | **Expected** — QB `ch04-structure-of-the-atom.ts` is a placeholder stub with no `chapterName:` field |
| F7 | Missing: "Atoms and Molecules" (9-Chemistry) | **Expected** — QB `ch03-atoms-and-molecules.ts` is a placeholder stub with no `chapterName:` field |
| F7 | Missing: "Cell — The Fundamental Unit of Life" (9-Biology) | **Expected** — Biology has no question files; blocker B-S9-1 |
| F7 | Missing: "Tissues" (9-Biology) | **Expected** — same as above |
| F7 | Missing: "Reproduction" (9-Biology) | **Expected** — same as above |
| F7 | Missing: "Diversity in Living Organisms" (9-Biology) | **Expected** — same as above |

**0 unexpected failures.**

### Passes confirmed by this run

| Check | Evidence |
|---|---|
| `9-Physics` PASS | "Work, Energy and Simple Machines" found in `class9-physics-ch4.ts` CHAPTER_META — confirms CHANGE-014 rename propagated |
| "Gravitation" cbseDeleted flag active | No F7 for Gravitation; cbseDeleted flag suppresses question-floor warning |
| "Matter in Our Surroundings" cbseDeleted found | ch01 QB file has correct `chapterName:` → found; F7 suppressed (cbseDeleted) |
| "Number System" found | F6 check silent → `class9-maths-ch1.ts` CHAPTER_META matches updated EXPECTED |
| "Introduction to Polynomials" found | F6 check silent → `class9-maths-ch2.ts` CHAPTER_META matches updated EXPECTED |

### Warnings (15 — pre-existing, unchanged)
All 15 warnings (W1 thin chapters in 9-Maths, W2 Hard-skew in 6-8 Maths, W3 size imbalance) were present before this session and are unaffected by CRITICAL/HIGH changes. No new warnings introduced.

---

## 4. Bank Audit Results

```
$ pnpm --filter @workspace/scripts run bank-audit
→  Exit 0  ✅
```

| Scope | Chapters | Questions |
|---|---|---|
| Class 6 Mathematics | 14 | 1,090 |
| Class 7 Mathematics | 15 | 1,129 |
| Class 8 Mathematics | 14 | 1,054 |
| Class 9 Mathematics | 15 | 584 |
| Grand total | 58 | 3,857 |

No regressions. Question counts for existing chapters are identical to pre-session baseline (no questions were added, removed, or modified).

---

## 5. Files Modified

| File | Changes |
|---|---|
| `artifacts/homework-hero/src/data/subjects.ts` | +`"Science"` to Subject union; +Science SubjectConfig entry |
| `artifacts/homework-hero/src/services/questionService.ts` | Science fan-out in `getChapters`, `getQuestions`, `getAllChapterStats` |
| `artifacts/homework-hero/src/pages/Practice.tsx` | `ALL_SUBJECTS` → `["Mathematics", "Science"]` |
| `artifacts/homework-hero/src/hooks/useProgress.ts` | 2× `Record<Subject,…>` literals: +`Science: {}` |
| `artifacts/homework-hero/src/pages/ExamMode.tsx` | 4× `Record<Subject,…>` literals: +`Science` keys |
| `artifacts/homework-hero/src/pages/DevTeachingValidator.tsx` | CHAPTER_MAP: +`Science: { 6:[], 7:[], 8:[], 9:[] }` |
| `artifacts/homework-hero/src/services/ai/topicMatcher.ts` | SUBJECT_HINTS: +Science pattern array |
| `artifacts/homework-hero/src/data/questions/class9-maths-ch1.ts` | CHAPTER_META.name: "Number Systems" → "Number System" |
| `artifacts/homework-hero/src/data/questions/class9-maths-ch2.ts` | CHAPTER_META.name: "Polynomials" → "Introduction to Polynomials" |
| `artifacts/homework-hero/src/data/questions/class9-physics-ch4.ts` | CHAPTER_META.name: "Work and Energy" → "Work, Energy and Simple Machines" |
| `scripts/src/curriculumGateway.ts` | QB_CHEM constant; 9-Math EXPECTED (names + 3 new + cbseDeleted); 9-Physics EXPECTED (cbseDeleted Gravitation, renamed ch4); +9-Chemistry EXPECTED; +9-Biology EXPECTED; MIN_Q +Chemistry/Biology; F7 Chemistry/Biology branch |
| `academic-knowledge/subjects/biology/class9.ts` | ch01 name fix; ⚠️ NON-EXAM comments on ch04/ch05/ch06; +REPRODUCTION full ChapterKnowledge entry; BIOLOGY_CLASS9 export updated |
| `academic-knowledge/subjects/chemistry/class9.ts` | ch02 chapterName: "Is Matter Around Us Pure?" → "Exploring Mixtures"; CHANGE-023 JSDoc comment |
| `docs/governance/PROJECT_BASELINE_2026_27.md` | Ch13 name: "Our Earth" → "Earth as a System: Energy, Matter & Life" (3 locations) |

---

## 6. Verdict

| Dimension | Result |
|---|---|
| CRITICAL changes implemented | 4 / 4 ✅ |
| HIGH changes implemented | 12 / 12 ✅ |
| TypeScript (homework-hero) | ✅ 0 errors |
| TypeScript (libs) | ✅ 0 errors |
| TypeScript (scripts) | ✅ 0 errors |
| Curriculum gateway failures | 10 — all documented content gaps, 0 unexpected |
| Bank audit regressions | None |
| New questions authored | 0 (rule obeyed) |
| Teaching prompts modified | 0 (rule obeyed) |

**CLASS 9 ALIGNMENT VERIFIED — CRITICAL and HIGH priority changes from CLASS9_STRUCTURE_ALIGNMENT.md are fully implemented and type-safe. All 10 curriculum gateway FAILs are documented content gaps (authoring backlog), not implementation errors.**
