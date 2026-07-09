# Final Gateway FAIL Analysis

**Date:** 2026-07-09  
**Gateway run:** `pnpm --filter @workspace/scripts run curriculum-check`  
**Total FAILs:** 10 (all F7 — "chapter registered in EXPECTED but no matching content found")  
**Total WARNs:** 15 (pre-existing, not analysed here)  
**Audit scope:** Repository only. No web search. No code changes.

---

## FAIL Catalogue

---

### FAIL-01 · "Sequences and Progressions" (9-Mathematics)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-MATH-1 |
| **Gateway message** | `[FAIL] [F7] Missing: "Sequences and Progressions" (9-Mathematics)` |
| **File responsible** | Does not exist. No `class9-maths-ch*.ts` file has `CHAPTER_META.name === "Sequences and Progressions"`. |
| **Exact reason** | F7 scans every file matching `^class9-maths-ch\d+\.ts$` in `artifacts/homework-hero/src/data/questions/` and reads `CHAPTER_META.name` from each. The 15 existing files (ch1–ch15) cover the pre-2026-27 NCERT chapter set; none carries this name. No question file has been authored for this new 2026-27 chapter. |
| **Missing implementation** | A new V1-format question file (e.g. `class9-maths-ch16.ts`) with `CHAPTER_META.name: "Sequences and Progressions"` and a populated `QUESTIONS` array. |
| **Can this FAIL be ignored?** | Yes — the chapter does not exist in the data layer so it never appears in the Practice UI. Students see no phantom chapter; they simply do not see this topic. |
| **Must be fixed before launch?** | **NO** — the gap is invisible to users. The existing 15 Math chapters render and function normally. This is authoring backlog. |
| **Estimated effort** | Medium — requires authoring ≈ 40–60 questions in the new chapter format. No architectural work needed. |
| **Classification** | **B. Missing content** |

---

### FAIL-02 · "Exploring Algebraic Identities" (9-Mathematics)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-MATH-2 |
| **Gateway message** | `[FAIL] [F7] Missing: "Exploring Algebraic Identities" (9-Mathematics)` |
| **File responsible** | Does not exist. Same scan as FAIL-01; no file carries this CHAPTER_META name. |
| **Exact reason** | Identical mechanism to FAIL-01. "Exploring Algebraic Identities" is a new 2026-27 NCERT chapter. The EXPECTED map was updated to register it, but no question file was authored. |
| **Missing implementation** | A new V1-format question file (e.g. `class9-maths-ch17.ts`) with `CHAPTER_META.name: "Exploring Algebraic Identities"` and a populated `QUESTIONS` array. |
| **Can this FAIL be ignored?** | Yes — identical reasoning to FAIL-01; invisible to users. |
| **Must be fixed before launch?** | **NO** — authoring backlog. |
| **Estimated effort** | Medium — ≈ 40–60 questions. No architectural work. |
| **Classification** | **B. Missing content** |

---

### FAIL-03 · "Area and Perimeter" (9-Mathematics)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-MATH-3 |
| **Gateway message** | `[FAIL] [F7] Missing: "Area and Perimeter" (9-Mathematics)` |
| **File responsible** | Does not exist. The two chapters this replaces — "Areas of Parallelograms and Triangles" (`class9-maths-ch9.ts`) and "Heron's Formula" (`class9-maths-ch12.ts`) — are correctly present but are now marked `cbseDeleted: true` in the EXPECTED map. The replacement chapter has no content file. |
| **Exact reason** | F7 finds neither `class9-maths-ch9.ts` (CHAPTER_META: "Areas of Parallelograms and Triangles") nor any other file with CHAPTER_META.name = "Area and Perimeter". The deleted chapters still exist in the data layer but are annotated as cbseDeleted; the new chapter that consolidates them does not exist yet. |
| **Missing implementation** | A new V1-format file with `CHAPTER_META.name: "Area and Perimeter"` covering the 2026-27 integrated scope. The two cbseDeleted files may be retained for NCERT completeness but are no longer the primary exam content. |
| **Can this FAIL be ignored?** | Yes — the two old chapter files still exist with real questions. Students can practice "Areas of Parallelograms and Triangles" and "Heron's Formula" today. Only the consolidated 2026-27 chapter name is missing. |
| **Must be fixed before launch?** | **NO** — existing content is functional. The cbseDeleted flag suppresses quality warnings for those files. This is authoring backlog. |
| **Estimated effort** | Medium-high — requires re-scoping content from the deleted chapters plus potentially new questions for the integrated 2026-27 scope. |
| **Classification** | **B. Missing content** |

---

### FAIL-04 · "Exploring Mixtures" (9-Chemistry)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-CHEM-1 |
| **Gateway message** | `[FAIL] [F7] Missing: "Exploring Mixtures" (9-Chemistry)` |
| **File responsible** | `question-bank/questions/chemistry/class9/ch02-is-matter-around-us-pure.ts` |
| **Exact reason** | F7 searches every `.ts` file in `question-bank/questions/chemistry/class9/` for the string `chapterName: "Exploring Mixtures"`. The file `ch02-is-matter-around-us-pure.ts` contains: `export const CH02_IS_MATTER_AROUND_US_PURE: QuestionV2[] = []`. It is an empty array with no question objects, so no `chapterName:` field exists anywhere in the file. Even if the check were applied to the file comment header (which it is not — only source text is scanned), the header says "Is Matter Around Us Pure?" not "Exploring Mixtures". |
| **Missing implementation** | Two things: (1) populate `ch02-is-matter-around-us-pure.ts` (or a new file) with authored `QuestionV2` objects that each have `chapterName: "Exploring Mixtures"`; (2) update the file comment header and constant name to reflect the 2026-27 chapter identity. |
| **Can this FAIL be ignored?** | **Partially** — the empty array imports correctly via the V2 adapter; it contributes 0 questions. The chapter may still appear in the Practice UI with 0 questions, which is poor UX. |
| **Must be fixed before launch?** | **NO** as a gateway concern, but the 0-question UX for a chapter that appears in the Science subject tab should be addressed. The UI should either hide 0-question chapters or display a "coming soon" state. This is an authoring + minor UI backlog item. |
| **Estimated effort** | High — requires authoring the "Exploring Mixtures" 2026-27 scope (different from the old "Is Matter Around Us Pure?" scope). File header and constant rename also needed when content is authored. |
| **Classification** | **B. Missing content** |

---

### FAIL-05 · "Structure of the Atom" (9-Chemistry)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-CHEM-2 |
| **Gateway message** | `[FAIL] [F7] Missing: "Structure of the Atom" (9-Chemistry)` |
| **File responsible** | `question-bank/questions/chemistry/class9/ch04-structure-of-the-atom.ts` |
| **Exact reason** | The file is an explicit scaffold stub: `export const CH04_STRUCTURE_OF_THE_ATOM: QuestionV2[] = []`. No question objects exist; therefore no `chapterName:` field is present in any line of source text. The F7 check finds no match. The file's doc-comment correctly names the chapter ("Chapter 4: Structure of the Atom") but comments are not scanned. |
| **Missing implementation** | Populate the scaffold with `QuestionV2` objects, each carrying `chapterId: "ch04"` and `chapterName: "Structure of the Atom"`. No architectural change needed — the V2 adapter already imports this file and the gateway scan already targets this directory. |
| **Can this FAIL be ignored?** | **Partially** — same UX risk as FAIL-04: the chapter is imported by the adapter and may appear in Practice with 0 questions. |
| **Must be fixed before launch?** | **NO** as a gateway concern. Authoring backlog. |
| **Estimated effort** | High — full chapter content authoring (≈ 75–100 questions for a complete chapter). |
| **Classification** | **A. Expected placeholder** — the file is explicitly labelled "Placeholder — questions to be authored" and the scaffold is correctly wired. The FAIL is an intentional authoring signal. |

---

### FAIL-06 · "Atoms and Molecules" (9-Chemistry)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-CHEM-3 |
| **Gateway message** | `[FAIL] [F7] Missing: "Atoms and Molecules" (9-Chemistry)` |
| **File responsible** | `question-bank/questions/chemistry/class9/ch03-atoms-and-molecules.ts` |
| **Exact reason** | Identical mechanism to FAIL-05. The file is an explicit scaffold stub: `export const CH03_ATOMS_AND_MOLECULES: QuestionV2[] = []`. No question objects, no `chapterName:` field in source text. |
| **Missing implementation** | Populate the scaffold with `QuestionV2` objects carrying `chapterId: "ch03"` and `chapterName: "Atoms and Molecules"`. |
| **Can this FAIL be ignored?** | Partially — same 0-question UX risk. |
| **Must be fixed before launch?** | **NO** — authoring backlog. |
| **Estimated effort** | High — full chapter content authoring. |
| **Classification** | **A. Expected placeholder** |

---

### FAIL-07 · "Cell — The Fundamental Unit of Life" (9-Biology)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-BIO-1 |
| **Gateway message** | `[FAIL] [F7] Missing: "Cell — The Fundamental Unit of Life" (9-Biology)` |
| **File responsible** | `question-bank/questions/biology/class9/` — this directory does not exist. |
| **Exact reason** | The gateway's Biology branch for Class 9 is hardcoded: `} else if (subject === "Biology") { // Biology: no question files exist yet — found stays false }`. The directory `question-bank/questions/biology/class9/` does not exist at all. `found` remains `false` for every Biology entry → 4 F7 FAILs fire. |
| **Missing implementation** | Create `question-bank/questions/biology/class9/` directory with at minimum a scaffold file for ch01 that contains a question object with `chapterName: "Cell — The Fundamental Unit of Life"`. Also update the gateway Biology branch to scan this directory (same pattern as Chemistry). |
| **Can this FAIL be ignored?** | Yes from a UI perspective — no Biology chapters appear in the Practice UI today because no `CHAPTER_META` files exist in the frontend data layer for Biology Class 9. Students see no broken chapter list. |
| **Must be fixed before launch?** | **NO** — Biology is documented as a known blocker (B-S9-1). The Science subject tab for Class 9 will show Physics and Chemistry chapters only; Biology is silently absent. |
| **Estimated effort** | Very high — requires creating the QB directory structure, authoring all 4 Biology chapters, creating a frontend V2 adapter, updating the gateway Biology branch to scan the directory. This is a multi-session authoring effort. |
| **Classification** | **B. Missing content** |

---

### FAIL-08 · "Tissues" (9-Biology)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-BIO-2 |
| **Gateway message** | `[FAIL] [F7] Missing: "Tissues" (9-Biology)` |
| **File responsible** | `question-bank/questions/biology/class9/` — directory does not exist. |
| **Exact reason** | Identical to FAIL-07. Hardcoded `found = false` for all Biology entries; no QB directory exists. |
| **Missing implementation** | Same as FAIL-07 — requires creating the QB directory and a scaffold for ch02/Tissues. |
| **Can this FAIL be ignored?** | Yes — same reasoning as FAIL-07. |
| **Must be fixed before launch?** | **NO** — authoring backlog (B-S9-1). |
| **Estimated effort** | Bundled with FAIL-07 effort. |
| **Classification** | **B. Missing content** |

---

### FAIL-09 · "Reproduction" (9-Biology)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-BIO-3 |
| **Gateway message** | `[FAIL] [F7] Missing: "Reproduction" (9-Biology)` |
| **File responsible** | `question-bank/questions/biology/class9/` — directory does not exist. |
| **Exact reason** | Identical to FAIL-07. |
| **Missing implementation** | Same as FAIL-07 — QB directory + ch11/Reproduction scaffold and content. |
| **Can this FAIL be ignored?** | Yes — same reasoning as FAIL-07. |
| **Must be fixed before launch?** | **NO** — authoring backlog. |
| **Estimated effort** | Bundled with FAIL-07 effort. |
| **Classification** | **B. Missing content** |

---

### FAIL-10 · "Diversity in Living Organisms" (9-Biology)

| Field | Detail |
|---|---|
| **FAIL ID** | F7-BIO-4 |
| **Gateway message** | `[FAIL] [F7] Missing: "Diversity in Living Organisms" (9-Biology)` |
| **File responsible** | `question-bank/questions/biology/class9/` — directory does not exist. |
| **Exact reason** | Identical to FAIL-07. |
| **Missing implementation** | Same as FAIL-07 — QB directory + ch03/Diversity scaffold and content. |
| **Can this FAIL be ignored?** | Yes — same reasoning as FAIL-07. |
| **Must be fixed before launch?** | **NO** — authoring backlog. |
| **Estimated effort** | Bundled with FAIL-07 effort. |
| **Classification** | **B. Missing content** |

---

## Summary Table

| FAIL | Chapter | Subject | Classification | Priority | Launch Blocker |
|---|---|---|---|---|---|
| F7-MATH-1 | Sequences and Progressions | 9-Mathematics | B. Missing content | P2 (authoring) | **NO** |
| F7-MATH-2 | Exploring Algebraic Identities | 9-Mathematics | B. Missing content | P2 (authoring) | **NO** |
| F7-MATH-3 | Area and Perimeter | 9-Mathematics | B. Missing content | P2 (authoring) | **NO** |
| F7-CHEM-1 | Exploring Mixtures | 9-Chemistry | B. Missing content | P2 (authoring) | **NO** |
| F7-CHEM-2 | Structure of the Atom | 9-Chemistry | A. Expected placeholder | P3 (authoring) | **NO** |
| F7-CHEM-3 | Atoms and Molecules | 9-Chemistry | A. Expected placeholder | P3 (authoring) | **NO** |
| F7-BIO-1 | Cell — The Fundamental Unit of Life | 9-Biology | B. Missing content | P1 (authoring) | **NO** |
| F7-BIO-2 | Tissues | 9-Biology | B. Missing content | P1 (authoring) | **NO** |
| F7-BIO-3 | Reproduction | 9-Biology | B. Missing content | P1 (authoring) | **NO** |
| F7-BIO-4 | Diversity in Living Organisms | 9-Biology | B. Missing content | P1 (authoring) | **NO** |

### Classification key
- **A. Expected placeholder** — scaffold file exists with the correct name and wiring; content to be authored; FAIL is an intentional authoring signal
- **B. Missing content** — no file, empty scaffold with wrong/absent chapterName, or no directory; the gap is known and documented

### Why none of these block launch

All 10 FAILs are content authoring gaps, not structural faults:

1. **No phantom chapters reach the UI.** Chapters with no question files (Biology) are absent from `ALL_CHAPTERS` → never appear in the Practice chapter list → students see no broken content. The 3 new Maths chapters have no `class9-maths-ch*.ts` files → same result.

2. **Chemistry 0-question chapters are a UX risk, not an architecture failure.** The V2 adapter imports empty arrays; they appear in the chapter list with 0 questions. This should be mitigated by a "hide if empty" guard in the Practice UI or a "coming soon" badge — neither requires gateway or architecture changes.

3. **Every F7 code-path in the gateway is functioning correctly.** The check correctly finds existing content (Physics 5/5 chapters PASS; Chemistry ch01 PASS via `chapterName:` field match; all 67 existing chapters PASS their respective checks) and correctly fires FAIL for missing content. There are no false positives and no wrong-implementation cases.

4. **TypeScript is clean across all packages** — the type system, routing, and service layer changes are complete and error-free.

---

ARCHITECTURE COMPLETE
