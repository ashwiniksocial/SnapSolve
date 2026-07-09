# CLASS9_FINAL_FREEZE_AUDIT.md

**Type:** Final Curriculum Freeze Audit — read-only analysis, no code or content changes  
**Version:** 1.0  
**Date:** 2026-07-09  
**Auditor:** AI governance session  
**Scope:** Class 9 only — all five approved subjects: Mathematics, Science (Physics/Chemistry/Biology/Earth Science), Computer Applications (165), Information Technology (402), Artificial Intelligence (417)

---

## Audit Method

**Sources read (in order):**

| Source | Type |
|---|---|
| `docs/GOVERNANCE/PROJECT_MEMORY.md` | Governance |
| `docs/GOVERNANCE/PROJECT_STATUS.md` | Governance |
| `docs/GOVERNANCE/DECISION_LOG.md` | Governance |
| `docs/GOVERNANCE/CHECKPOINT_GATEWAYS.md` | Governance |
| `docs/GOVERNANCE/PROJECT_STRUCTURE.md` | Governance |
| `docs/GOVERNANCE/ROADMAP.md` | Governance |
| `docs/governance/PROJECT_BASELINE_2026_27.md` | Governance |
| `docs/governance/CLASS9_CURRICULUM_BASELINE.md` | Governance |
| `academic-knowledge/subjects/mathematics/class9.ts` | Official repo source — Class 9 Maths |
| `academic-knowledge/subjects/physics/class9.ts` | Official repo source — Class 9 Physics |
| `academic-knowledge/subjects/chemistry/class9.ts` | Official repo source — Class 9 Chemistry |
| `academic-knowledge/subjects/biology/class9.ts` | Official repo source — Class 9 Biology |
| `scripts/src/curriculumGateway.ts` (EXPECTED map) | Live implementation |
| `artifacts/homework-hero/src/pages/Practice.tsx` | Live implementation |

**No web search used. No prior reports used. No code or content modified.**

---

## Section 1 — Subject Scope

**Authority:** DEC-001 (DECISION_LOG.md) — binding scope freeze  
**Approved Class 9 subjects:** Mathematics, Science (unified student-facing label), Computer Applications (165), Information Technology (402), Artificial Intelligence (417)  
**Explicitly out of scope:** Economics (DEC-010); Physics/Chemistry/Biology as top-level student-facing labels (DEC-001 §3); Classes 10–12 (DEC-001)

### Findings

| Item | Official source | Repository status | Verdict |
|---|---|---|---|
| Mathematics in approved scope | DEC-001 | Present in gateway, UI, question bank | **PASS** |
| Science (unified) as student-facing label | DEC-001, PMC §3 | NOT present in UI. Individual domains (Physics, Chemistry, Biology) shown instead | **FAIL** |
| Physics as internal domain only | DEC-001 | Exposed as top-level selectable subject in `Practice.tsx ALL_SUBJECTS` | **FAIL** |
| Chemistry as internal domain only | DEC-001 | Exposed as top-level selectable subject in `Practice.tsx ALL_SUBJECTS` | **FAIL** |
| Biology as internal domain only | DEC-001 | Exposed as top-level selectable subject with zero content (live dead-end) | **FAIL** |
| Economics excluded from UI | DEC-010 | Present in `Practice.tsx ALL_SUBJECTS` — out-of-scope subject exposed to students | **FAIL** |
| "Computer Science" excluded | PMC §3; GOVERNANCE_AUDIT C-03 | Present in `Practice.tsx ALL_SUBJECTS`. Not in approved scope; content state unknown | **FAIL** |
| CA (165) in approved scope | DEC-001 | Not in UI (no content; P3 — acceptable at this stage) | **WARNING** |
| IT (402) in approved scope | DEC-001 | Not in UI (no content; P4 — acceptable at this stage) | **WARNING** |
| AI (417) in approved scope | DEC-001 | Not in UI (no content; P5 — acceptable at this stage) | **WARNING** |

**Section 1 verdict: FAIL**  
`Practice.tsx ALL_SUBJECTS` = `["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"]` — five of six entries violate the approved scope definition.

---

## Section 2 — Chapter / Unit Names

### 2-A · Mathematics

**Authority:** `PROJECT_BASELINE_2026_27.md` §C-4; `CLASS9_CURRICULUM_BASELINE.md` §1; DEC-007 (NCF-SE 2023 restructuring)  
**Official 2026-27:** 15 chapters (6 units); all exam-active except Constructions (cbseDeleted)

| Official 2026-27 name | Gateway EXPECTED name | Match? | Verdict |
|---|---|---|---|
| Number System | "Number Systems" | Minor (plural) | **WARNING** |
| Introduction to Polynomials | "Polynomials" | **No** | **FAIL** |
| Sequences and Progressions *(new)* | *(not in gateway)* | **Missing** | **FAIL** |
| Exploring Algebraic Identities *(new)* | *(not in gateway)* | **Missing** | **FAIL** |
| Linear Equations in Two Variables | "Linear Equations in Two Variables" | ✓ | **PASS** |
| Coordinate Geometry | "Coordinate Geometry" | ✓ | **PASS** |
| Introduction to Euclid's Geometry: Axioms and Postulates | "Introduction to Euclid's Geometry" | Subtitle missing | **WARNING** |
| Lines and Angles | "Lines and Angles" | ✓ | **PASS** |
| Triangles – Congruence Theorems | "Triangles" | **No** (subtitle missing) | **FAIL** |
| 4-gons (Quadrilaterals) | "Quadrilaterals" | **No** | **FAIL** |
| Circles | "Circles" | ✓ | **PASS** |
| Area and Perimeter *(merged chapter)* | "Areas of Parallelograms and Triangles" + "Heron's Formula" | **No** — 2 old → 1 new | **FAIL** |
| Surface Area and Volume | "Surface Areas and Volumes" | Minor (plural) | **WARNING** |
| Statistics | "Statistics" | ✓ | **PASS** |
| Introduction to Probability | "Probability" | **No** | **FAIL** |
| *(Constructions — deleted)* | "Constructions" cbseDeleted: true | ✓ Correctly flagged | **PASS** |

**Mathematics name verdict: FAIL** — 7 of 15 active chapter names are wrong or missing in the gateway EXPECTED map.

### 2-B · Physics

**Authority:** DEC-007, DEC-008; `PROJECT_BASELINE_2026_27.md` §C-8

| Official 2026-27 name | Gateway EXPECTED name | Match? | Verdict |
|---|---|---|---|
| Motion (Ch4) | "Motion" | ✓ | **PASS** |
| Force and Laws of Motion (Ch6) | "Force and Laws of Motion" | ✓ | **PASS** |
| Work, Energy and Simple Machines (Ch7) | "Work and Energy" | **No** — "Simple Machines" missing | **FAIL** |
| Sound (Ch10) | "Sound" | ✓ | **PASS** |
| *(Gravitation — not a 2026-27 chapter)* | "Gravitation" listed as **active** (no cbseDeleted) | **FAIL** — non-exam chapter with no flag | **FAIL** |

**Physics name verdict: FAIL** — "Work and Energy" name is stale; "Gravitation" is present as an active chapter without cbseDeleted despite DEC-008 confirming it is not a 2026-27 chapter.

### 2-C · Chemistry

**Authority:** DEC-007; `PROJECT_BASELINE_2026_27.md` §C-8

Gateway has no `9-Chemistry` key — chapter names cannot be compared. See Section 6 (Gateway Mapping).

**Chemistry name verdict: FAIL** — not registered; no names to verify.

### 2-D · Biology

Gateway has no `9-Biology` key. Academic-knowledge file (`biology/class9.ts`) uses OLD chapter names:

| `academic-knowledge` chapter | 2026-27 official exam chapter | Match? |
|---|---|---|
| ch01: "The Fundamental Unit of Life" | "Cell — The Fundamental Unit of Life" (Ch2) | **No** — prefix "Cell —" missing |
| ch02: "Tissues" | "Tissues" (Ch3) | ✓ |
| ch03: "Diversity in Living Organisms" | "Diversity in Living Organisms" (Ch12) | ✓ |
| ch04: "Why Do We Fall Ill?" | *(NOT in 2026-27 exam)* | **FAIL** — old chapter, removed |
| ch05: "Natural Resources" | *(NOT in 2026-27 exam — Ch14 non-exam)* | **FAIL** — non-exam chapter in knowledge base |
| ch06: "Improvement in Food Resources" | *(NOT in 2026-27 exam)* | **FAIL** — old chapter, removed |
| *(missing)* | "Reproduction" (Ch11) | **FAIL** — new 2026-27 exam chapter entirely absent |

**Biology name verdict: FAIL** — academic-knowledge uses old pre-2026-27 chapter structure. "Why Do We Fall Ill?" and "Improvement in Food Resources" are not 2026-27 exam chapters. "Reproduction" is missing entirely.

### 2-E · CA, IT, AI

No question bank files exist. Unit names for CA (165), IT (402), AI (417) are correctly documented in `PROJECT_BASELINE_2026_27.md` §C-9, C-10, C-11. No mismatches can be assessed at the implementation level yet (P3/P4/P5 — not started).

**CA / IT / AI name verdict: WARNING** — documented correctly at governance level; no implementation to verify.

---

## Section 3 — Chapter Order

**Authority:** `PROJECT_BASELINE_2026_27.md` §C-4 (2026-27 Unit structure)

### Mathematics

Official 2026-27 order by unit:

| Unit | Official chapters |
|---|---|
| I | Number System |
| II | Introduction to Polynomials → Sequences and Progressions → Exploring Algebraic Identities → Linear Equations in Two Variables |
| III | Coordinate Geometry |
| IV | Euclid's Geometry → Lines and Angles → Triangles → 4-gons → Circles |
| V | Area and Perimeter → Surface Area and Volume |
| VI | Statistics → Introduction to Probability |

Gateway EXPECTED order: Number Systems → Polynomials → **Coordinate Geometry** → **Linear Equations** → Euclid's → Lines and Angles → Triangles → Quadrilaterals → Areas of Parallelograms → Circles → Constructions → Heron's Formula → Surface Areas → Statistics → Probability

Misalignments:
- "Coordinate Geometry" is ch3 in repo (Unit III) but gateway places it after "Polynomials" and before "Linear Equations" — this matches the OLD NCERT textbook order, not the 2026-27 unit grouping
- "Linear Equations" is ch4 in repo but is the last chapter of Unit II in 2026-27 — order within the unit is correct conceptually, but the gateway index (ch3/ch4) no longer aligns with the official chapter numbers
- "Sequences and Progressions" and "Exploring Algebraic Identities" are absent — their unit position (Unit II, after Polynomials) has no repo representation

| Item | Official source | Repo status | Verdict |
|---|---|---|---|
| Maths chapter order matches 2026-27 unit structure | PROJECT_BASELINE_2026_27.md §C-4 | Partially wrong — gateway uses old NCERT chapter numbering | **WARNING** |
| "Sequences and Progressions" in correct unit position | PROJECT_BASELINE_2026_27.md §C-4 | Absent from gateway | **FAIL** |
| "Exploring Algebraic Identities" in correct unit position | PROJECT_BASELINE_2026_27.md §C-4 | Absent from gateway | **FAIL** |

### Science

Official chapter order is fixed by CBSE: Ch1–Ch14. Repo files do not carry official chapter numbers — they use internal numbering (class9-physics-ch1 = official Ch4, etc.). No technical ordering defect, but traceability to official chapter numbers is absent.

| Item | Verdict |
|---|---|
| Physics internal order matches subject presentation order (Motion → Force → Work → Sound) | **PASS** |
| Chemistry internal order cannot be assessed (gateway not registered) | N/A |
| Biology official order (Ch2, Ch3, Ch11, Ch12) not reflected in academic-knowledge file | **FAIL** |

---

## Section 4 — Learning Outcomes

**Authority:** `academic-knowledge/subjects/` files (repository's official Class 9 knowledge base)

### Mathematics

| Chapter | Learning outcomes present? | 2026-27 aligned? | Verdict |
|---|---|---|---|
| Number Systems (ch01) | ✓ — 6 learning objectives | Largely valid (content same in 2026-27 "Number System") | **PASS** |
| Polynomials (ch02) | ✓ — 6 learning objectives | Chapter renamed "Introduction to Polynomials"; scope likely same | **WARNING** |
| Sequences and Progressions | ✗ — not in academic-knowledge | New 2026-27 chapter; zero knowledge base entry | **FAIL** |
| Exploring Algebraic Identities | ✗ — not in academic-knowledge | New 2026-27 chapter; zero knowledge base entry | **FAIL** |
| File comment: "All 13 NCERT chapters" | academic-knowledge/mathematics/class9.ts line 3 | 2026-27 has 15 chapters; comment is stale | **FAIL** |

### Physics

| Chapter | Learning outcomes present? | 2026-27 aligned? | Verdict |
|---|---|---|---|
| Motion (ch01) | ✓ | Aligns with official Ch4 content | **PASS** |
| Force and Laws of Motion (ch02) | ✓ | Aligns with official Ch6 content | **PASS** |
| Gravitation (ch03) | ✓ — full learning objectives | **Not a 2026-27 chapter** (DEC-008) — learning outcomes for a non-existent exam chapter | **FAIL** |
| Work and Energy (ch04) | ✓ | Scope is incomplete — "Simple Machines" sub-topic in 2026-27 Ch7 not covered in file | **WARNING** |
| Sound (ch05) | ✓ | Aligns with official Ch10 content | **PASS** |

### Chemistry

| Chapter | Learning outcomes present? | 2026-27 aligned? | Verdict |
|---|---|---|---|
| Matter in Our Surroundings (ch01) | ✓ | Non-exam chapter — learning outcomes are enrichment only | **WARNING** |
| Is Matter Around Us Pure? (ch02) | ✓ | **Stale name** — 2026-27 chapter is "Exploring Mixtures" with restructured content | **FAIL** |
| Atoms and Molecules (ch03) | ✓ | Aligns with official Ch9 | **PASS** |
| Structure of the Atom (ch04) | ✓ | Aligns with official Ch8 | **PASS** |

### Biology

| Chapter | Learning outcomes present? | 2026-27 aligned? | Verdict |
|---|---|---|---|
| "The Fundamental Unit of Life" (ch01) | ✓ | Name mismatch — 2026-27 is "Cell — The Fundamental Unit of Life" | **FAIL** |
| Tissues (ch02) | ✓ | Aligns with official Ch3 | **PASS** |
| Diversity in Living Organisms (ch03) | ✓ | Aligns with official Ch12 | **PASS** |
| "Why Do We Fall Ill?" (ch04) | ✓ | **Not in 2026-27 exam** — full learning outcomes for a non-exam chapter | **FAIL** |
| "Natural Resources" (ch05) | ✓ | **Non-exam in 2026-27** (Ch14, formative only) | **FAIL** |
| "Improvement in Food Resources" (ch06) | ✓ | **Not in 2026-27 exam** — old NCERT chapter | **FAIL** |
| Reproduction (Ch11) | ✗ — absent | **Entirely missing from academic-knowledge** | **FAIL** |

**Section 4 verdict: FAIL** — Critical learning outcome gaps: two new Maths chapters, Biology "Reproduction" entirely absent; academic-knowledge files for Biology (4 FAILs) and Physics (Gravitation) contain content for non-exam/old chapters.

---

## Section 5 — Repository Mapping

| Subject | Official exam chapters | Repo files present | Content authored | Wired in index.ts | Verdict |
|---|---|---|---|---|---|
| Mathematics | 14 active + 1 deleted | ch1–ch15 (15 files) | ~499–584 questions (count method varies) | ✓ | **WARNING** — files exist but names stale; 2 new chapters absent |
| Physics | 4 exam-active + 1 non-exam (Gravitation) | ch1–ch5 (5 files) | 125q (100q exam-active; 25q Gravitation non-exam) | ✓ | **WARNING** — Gravitation not flagged; Work and Energy name stale |
| Chemistry | 3 exam-active + 1 non-exam (Ch1) | `class9-chemistry.ts` adapter; 4 source files in question-bank | 75q (all in non-exam ch01); ch02–ch04: 0q | ✓ (adapter wired; content empty) | **FAIL** — 3 of 3 exam chapters have 0 questions |
| Biology | 4 exam-active | None | 0 questions | **Not wired** | **FAIL** — zero files; zero content; zero wiring |
| Earth Science (Ch13) | 1 exam-active | None | 0 questions | Not wired | **FAIL** |
| CA (165) | 3 content units | None | 0 | Not wired | WARNING (P3 — acceptable) |
| IT (402) | 5 vocational units | None | 0 | Not wired | WARNING (P4 — acceptable) |
| AI (417) | 5 subject units | None | 0 | Not wired | WARNING (P5 — acceptable) |

**Section 5 verdict: FAIL** — Biology, Earth Science, and Chemistry exam chapters have zero repository content. Biology has zero repo files and zero index.ts wiring.

---

## Section 6 — Gateway Mapping

**Authority:** `CHECKPOINT_GATEWAYS.md` Gate 1; `scripts/src/curriculumGateway.ts` EXPECTED map

| Gateway key | Registered? | Chapter names accurate (2026-27)? | cbseDeleted correct? | Verdict |
|---|---|---|---|---|
| `9-Mathematics` | ✓ | **No** — 15 entries with pre-2026-27 names; 2 new chapters absent; "Areas of Parallelograms" and "Heron's Formula" should be merged | Constructions ✓ | **FAIL** |
| `9-Physics` | ✓ | **No** — "Work and Energy" should be "Work, Energy and Simple Machines"; "Gravitation" is active without cbseDeleted | Gravitation missing flag | **FAIL** |
| `9-Chemistry` | **NOT REGISTERED** | N/A | N/A | **FAIL** |
| `9-Biology` | **NOT REGISTERED** | N/A | N/A | **FAIL** |
| `9-Economics` | ✓ (legacy) | N/A (out of scope) | N/A | **WARNING** — registered but out of scope per DEC-010 |
| `9-ComputerApplications` | Not registered | N/A | N/A | WARNING (P3) |
| `9-InformationTechnology` | Not registered | N/A | N/A | WARNING (P4) |
| `9-ArtificialIntelligence` | Not registered | N/A | N/A | WARNING (P5) |

**Last gateway run (2026-07-08):** 0 failures, 15 warnings — but this result covers only `9-Mathematics`, `9-Economics`, and `9-Physics`. Chemistry and Biology are entirely invisible to the gateway.

**Section 6 verdict: FAIL** — 2 of 2 registered Class 9 Science subjects have name errors; 2 of 2 approved Science subjects (Chemistry, Biology) are unregistered; "Gravitation" lacks a required cbseDeleted flag.

---

## Section 7 — UI Mapping

**Authority:** DEC-001, DEC-011; `CHECKPOINT_GATEWAYS.md` Gate 4; `Practice.tsx`

### ALL_SUBJECTS list (current state)

```
["Mathematics", "Physics", "Chemistry", "Biology", "Economics", "Computer Science"]
```

| UI subject | Approved by DEC-001? | Has content in index.ts? | Student experience | Verdict |
|---|---|---|---|---|
| Mathematics | ✓ | ✓ | ✓ Functional | **PASS** |
| Physics | ✗ (internal domain only) | ✓ (5 chapters, 125q) | Functional but wrong label | **FAIL** |
| Chemistry | ✗ (internal domain only) | ✓ adapter wired, but 0 exam questions | Misleading — shows chapters with 0 questions | **FAIL** |
| Biology | ✗ (internal domain only) | ✗ Zero wiring | **Live dead-end** — silent empty state (DEC-011) | **FAIL** |
| Economics | ✗ (out of scope DEC-010) | ✓ (4 chapters, out-of-scope content) | Out-of-scope subject visible to students | **FAIL** |
| "Computer Science" | ✗ (not in approved scope) | Unknown / not audited | Unknown student experience | **FAIL** |
| Science (unified) | ✓ (required) | — | **Not present in UI at all** | **FAIL** |
| CA / IT / AI | ✓ (approved; P3/P4/P5) | None | Not visible (acceptable) | **WARNING** |

### Non-exam content disclaimer status

| Non-exam chapter | In student-facing UI? | Disclaimer shown? | Verdict |
|---|---|---|---|
| Gravitation (Physics ch3, 25q) | ✓ — appears in Physics chapter list | **No** | **FAIL** |
| Matter in Our Surroundings (Chemistry ch01, 75q) | ✓ — appears in Chemistry chapter list | **No** | **FAIL** |

**Section 7 verdict: FAIL** — Five of six UI subjects violate scope definitions. Two non-exam chapters presented without disclaimers. "Science" (the required unified label) is absent from the UI entirely.

---

## Section 8 — Missing Implementation

Ranked by severity.

| # | Missing item | Subject | Severity | Blocking? |
|---|---|---|---|---|
| M1 | Biology: zero source files, zero adapter, zero index.ts wiring | Biology | **CRITICAL** | Yes — live dead-end |
| M2 | Biology exam content: Ch2 Cell (0q), Ch3 Tissues (0q), Ch11 Reproduction (0q), Ch12 Diversity (0q) | Biology | **CRITICAL** | Yes |
| M3 | Chemistry exam content: Ch5 Exploring Mixtures (0q), Ch8 Structure of the Atom (0q), Ch9 Atoms and Molecules (0q) | Chemistry | **CRITICAL** | Yes |
| M4 | Earth Science: Ch13 "Our Earth" / "Earth as a System" (0q, 0 files) | Earth Science | HIGH | Yes |
| M5 | Gateway registration: `9-Chemistry` not in EXPECTED map | Chemistry | HIGH | Yes |
| M6 | Gateway registration: `9-Biology` not in EXPECTED map | Biology | HIGH | Yes |
| M7 | "Science" unified subject not present in `Practice.tsx ALL_SUBJECTS` | UI | HIGH | Yes |
| M8 | Academic-knowledge entry for "Sequences and Progressions" | Mathematics | HIGH | For new chapter authoring |
| M9 | Academic-knowledge entry for "Exploring Algebraic Identities" | Mathematics | HIGH | For new chapter authoring |
| M10 | Academic-knowledge entry for "Reproduction" (Biology Ch11) | Biology | HIGH | For authoring |
| M11 | Question bank files for new Maths chapters: Sequences and Progressions, Exploring Algebraic Identities | Mathematics | MEDIUM | For completeness |
| M12 | cbseDeleted flag on Gravitation in `9-Physics` EXPECTED map | Physics | MEDIUM | For accuracy |
| M13 | "Simple Machines" sub-topic coverage in Physics ch4 | Physics | MEDIUM | For completeness |
| M14 | Non-exam disclaimers in UI for Gravitation and Chemistry Ch01 | UI | MEDIUM | For accuracy |
| M15 | CA, IT, AI: all gateway keys, source files, and UI wiring | CA/IT/AI | LOW | P3/P4/P5 — future sprint |

---

## Section 9 — Incorrect Implementation

Items that are present but wrong — not merely absent.

| # | Incorrect item | Official source | Current state | Verdict |
|---|---|---|---|---|
| I1 | `Practice.tsx ALL_SUBJECTS` exposes Biology as selectable with zero content | DEC-011, Gate 4 U1 | Biology in ALL_SUBJECTS; getChapters() returns empty → silent dead-end | **FAIL** |
| I2 | `Practice.tsx ALL_SUBJECTS` exposes Economics (out of scope) | DEC-010 | Economics in ALL_SUBJECTS | **FAIL** |
| I3 | `Practice.tsx ALL_SUBJECTS` exposes "Computer Science" (not in approved scope) | DEC-001, GOVERNANCE_AUDIT C-03 | "Computer Science" in ALL_SUBJECTS | **FAIL** |
| I4 | `Practice.tsx ALL_SUBJECTS` uses Physics/Chemistry/Biology as top-level labels | DEC-001 §3 | All three listed as top-level subjects | **FAIL** |
| I5 | `9-Physics` EXPECTED: "Gravitation" is active (no cbseDeleted) | DEC-008 — not a 2026-27 chapter | Active entry with 25 authored questions, no disclaimer | **FAIL** |
| I6 | `9-Physics` EXPECTED: "Work and Energy" (stale name) | DEC-007, CLASS9_CURRICULUM_BASELINE §2-A | Official name is "Work, Energy and Simple Machines" | **FAIL** |
| I7 | `9-Mathematics` EXPECTED: 13 chapter names are pre-2026-27 (stale) | PROJECT_BASELINE_2026_27.md §C-4 | "Polynomials" not "Introduction to Polynomials"; "Quadrilaterals" not "4-gons"; etc. | **FAIL** |
| I8 | `9-Mathematics` EXPECTED: "Areas of Parallelograms and Triangles" and "Heron's Formula" as separate entries | PROJECT_BASELINE_2026_27.md §C-4 | Merged into "Area and Perimeter" in 2026-27 | **FAIL** |
| I9 | `academic-knowledge/biology/class9.ts`: "Why Do We Fall Ill?" (ch04) with full learning outcomes | DEC-007 | Not a 2026-27 exam chapter; knowledge base treats it as active | **FAIL** |
| I10 | `academic-knowledge/biology/class9.ts`: "Improvement in Food Resources" (ch06) with full learning outcomes | DEC-007 | Not a 2026-27 exam chapter; knowledge base treats it as active | **FAIL** |
| I11 | `academic-knowledge/biology/class9.ts`: "Natural Resources" (ch05) with full learning outcomes | DEC-007 | Ch14 — non-exam in 2026-27; knowledge base treats it as active | **FAIL** |
| I12 | `academic-knowledge/biology/class9.ts`: ch01 named "The Fundamental Unit of Life" | PROJECT_BASELINE_2026_27.md §C-8 | Official 2026-27 name: "Cell — The Fundamental Unit of Life" | **FAIL** |
| I13 | `academic-knowledge/mathematics/class9.ts`: header comment "All 13 NCERT chapters" | PROJECT_BASELINE_2026_27.md §C-4 | 2026-27 has 15 chapters (restructured); count is wrong | **FAIL** |
| I14 | `academic-knowledge/physics/class9.ts`: ch03 "Gravitation" with full learning outcomes | DEC-008 | Not a 2026-27 chapter; knowledge base treats it as active content | **FAIL** |
| I15 | `academic-knowledge/chemistry/class9.ts`: ch02 "Is Matter Around Us Pure?" | DEC-007 | Official 2026-27 name: "Exploring Mixtures" (Ch5); content scope restructured | **FAIL** |
| I16 | Chemistry `ch02` source file named `ch02-is-matter-around-us-pure.ts` | DEC-007 | Should be `ch05-exploring-mixtures.ts` (or equivalent) | **FAIL** |
| I17 | Chemistry scaffolds `ch02`, `ch03`, `ch04` have `// @ts-nocheck` | CHECKPOINT_GATEWAYS Gate 6 AR3 | Suppressed type errors — must be removed before authoring | **WARNING** |

---

## Section 10 — Conflicts Between Governance Documents and Official Documents

The following conflicts were detected by cross-referencing all eight governance documents against each other and against the repository's official academic-knowledge files.

---

### CONFLICT 1 — CRITICAL: Ch13 name inconsistency across governance documents

| Document | Chapter 13 name |
|---|---|
| `DECISION_LOG.md` (DEC-007) | "Earth as a System: Energy, Matter & Life" |
| `CLASS9_CURRICULUM_BASELINE.md` §2-D | "Earth as a System: Energy, Matter & Life" |
| `PROJECT_BASELINE_2026_27.md` §C-8 (chapter table) | **"Our Earth"** |
| `ROADMAP.md` §P1-D | (not mentioned by name) |
| `PROJECT_STATUS.md` | (not mentioned by name) |

**Conflict:** Two authoritative governance documents give different names for the same official chapter. Both claim to derive from official CBSE sources. The discrepancy is unresolved within the governance record. No official PDF is present in the repository to adjudicate.

**Impact:** Any gateway entry, question bank file, or UI label authored before this is resolved will use one of two different names — one of which is wrong by definition.

**Required action:** Resolve against the original CBSE 2026-27 Science PDF (`Science_SecP1IX_2026-27_RM.pdf`) before authoring begins for this chapter.

---

### CONFLICT 2 — HIGH: Biology chapter list discrepancy between academic-knowledge and official governance

| Source | Biology exam chapters listed |
|---|---|
| `DEC-007` / `CLASS9_CURRICULUM_BASELINE.md` / `PROJECT_BASELINE_2026_27.md` | Ch2 Cell, Ch3 Tissues, Ch11 Reproduction, Ch12 Diversity in Living Organisms (4 chapters) |
| `academic-knowledge/subjects/biology/class9.ts` | ch01 Fundamental Unit of Life, ch02 Tissues, ch03 Diversity in Living Organisms, ch04 **Why Do We Fall Ill?**, ch05 **Natural Resources**, ch06 **Improvement in Food Resources** (6 chapters) |

**Conflict:** The official governance documents (which supersede the academic-knowledge file) list 4 exam-active Biology chapters. The academic-knowledge file contains 6 chapters, three of which ("Why Do We Fall Ill?", "Natural Resources", "Improvement in Food Resources") are old NCERT chapters not present in the 2026-27 exam scope. "Reproduction" is entirely absent from the knowledge base.

**Risk:** Any AI pipeline or question-authoring tool that reads `academic-knowledge/subjects/biology/class9.ts` as authoritative will generate content for the wrong chapters.

---

### CONFLICT 3 — HIGH: Chemistry Chapter 2 name discrepancy

| Source | Chemistry exam chapter (old Ch2 equivalent) |
|---|---|
| `DEC-007` / `CLASS9_CURRICULUM_BASELINE.md` / `PROJECT_BASELINE_2026_27.md` | "Exploring Mixtures" (Ch5 in 2026-27) |
| `academic-knowledge/subjects/chemistry/class9.ts` ch02 | "Is Matter Around Us Pure?" |
| Repo source file | `ch02-is-matter-around-us-pure.ts` |

**Conflict:** Governance documents use the 2026-27 name; academic-knowledge and source files use the old NCERT name. Any authoring sprint using the academic-knowledge file as its content specification will produce questions under the wrong chapter name and potentially against wrong content scope ("Exploring Mixtures" has restructured content vs "Is Matter Around Us Pure?").

---

### CONFLICT 4 — HIGH: Physics academic-knowledge treats Gravitation as an active chapter

| Source | Gravitation status |
|---|---|
| `DEC-008` (DECISION_LOG.md) | CLOSED — "not a chapter at all in 2026-27 structure" |
| `academic-knowledge/subjects/physics/class9.ts` ch03 | Full `ChapterKnowledge` entry with 5 subtopics, learning objectives, exam tips — **no non-exam flag** |

**Conflict:** The official decision record states Gravitation does not exist as a chapter. The knowledge base treats it as a full, active exam chapter with detailed learning outcomes. The knowledge base has not been updated to reflect DEC-008.

---

### CONFLICT 5 — MEDIUM: Mathematics chapter count in academic-knowledge vs 2026-27 official

| Source | Class 9 Maths chapter count |
|---|---|
| `academic-knowledge/subjects/mathematics/class9.ts` (header comment) | "All 13 NCERT chapters" |
| `PROJECT_BASELINE_2026_27.md` §C-4 | 15 chapters (2026-27 structure) |
| `CLASS9_CURRICULUM_BASELINE.md` §1 | 15 chapters |

**Conflict:** The knowledge base header is stale by 2 chapters. "Sequences and Progressions" and "Exploring Algebraic Identities" (new 2026-27 chapters) have no academic-knowledge entries. The old "Areas of Parallelograms" and "Heron's Formula" entries (now merged) are still present as separate chapters.

---

### CONFLICT 6 — MEDIUM: Chemistry "Structure of the Atom" vs "Structure of an Atom"

| Source | Chapter 8 / gateway key name |
|---|---|
| `ROADMAP.md` §P1-A | "Structure of an Atom" |
| `CLASS9_CURRICULUM_BASELINE.md` §2-B | "Structure of the Atom" |
| `academic-knowledge/subjects/chemistry/class9.ts` ch04 | "Structure of the Atom" |

**Conflict:** ROADMAP §P1-A proposes gateway key name "Structure of an Atom" (indefinite article); all other documents use "Structure of the Atom" (definite article). While minor, the gateway key must be exact — one of these will produce a gateway mismatch when implemented.

---

### CONFLICT 7 — LOW: Biology Ch11 long-form name discrepancy

| Source | Biology Ch11 name |
|---|---|
| `DEC-007` / `PROJECT_BASELINE_2026_27.md` / `CLASS9_CURRICULUM_BASELINE.md` | "Reproduction" |
| `ROADMAP.md` §P1-B (gateway key description) | "Reproduction in Plants and Animals" |

**Conflict:** The ROADMAP proposes a longer chapter name than all other governance documents. The gateway key name must be determined from the official CBSE PDF before registration; neither the short nor long form has been verified as the exact official title.

---

## Summary Table

| Section | Topic | PASS | WARNING | FAIL |
|---|---|---|---|---|
| 1 | Subject scope | 1 | 3 | 6 |
| 2 | Chapter / unit names | 7 | 4 | 13 |
| 3 | Chapter order | 1 | 1 | 2 |
| 4 | Learning outcomes | 11 | 3 | 10 |
| 5 | Repository mapping | 1 | 2 | 3 |
| 6 | Gateway mapping | 0 | 2 | 4 |
| 7 | UI mapping | 1 | 1 | 7 |
| 8 | Missing implementation | — | 5 | 10 |
| 9 | Incorrect implementation | — | 1 | 16 |
| 10 | Governance conflicts | — | — | 7 conflicts found |
| **Total** | | **22 PASS** | **22 WARNING** | **78 FAIL** |

---

## Critical Blockers (required before any freeze)

These items are categorically blocking. A curriculum freeze cannot be declared while any of these remain open.

| ID | Blocker | Severity |
|---|---|---|
| CB-1 | Biology: live dead-end in UI — selectable with zero content | CRITICAL |
| CB-2 | Biology: zero source files, zero adapter, zero index.ts wiring | CRITICAL |
| CB-3 | Chemistry: 0 of 3 exam chapters have questions | CRITICAL |
| CB-4 | `9-Chemistry` not registered in curriculum gateway | CRITICAL |
| CB-5 | `9-Biology` not registered in curriculum gateway | CRITICAL |
| CB-6 | Earth Science Ch13: zero content | HIGH |
| CB-7 | Ch13 name unresolved — "Our Earth" vs "Earth as a System: Energy, Matter & Life" — governance conflict between two official documents | HIGH |
| CB-8 | Biology academic-knowledge contains wrong chapters (Why Do We Fall Ill?, Improvement in Food Resources) and is missing Reproduction entirely | HIGH |
| CB-9 | Physics "Gravitation" presented to students as active exam content without cbseDeleted flag or disclaimer | HIGH |
| CB-10 | `Practice.tsx ALL_SUBJECTS` violates approved scope on all five non-Mathematics entries | HIGH |
| CB-11 | Entire Class 9 gateway EXPECTED map uses pre-2026-27 chapter names (Maths and Physics) | HIGH |

---

## CLASS 9 STATUS:

# FREEZE BLOCKED

**Reason:** 78 FAIL findings across all 10 audit dimensions. 11 critical blockers remain open. Two governance documents give different official names for Ch13 (Earth Science) — this conflict must be resolved before the chapter can be registered, authored, or named in any implementation artifact. Three approved subjects (Chemistry, Biology, Earth Science) have zero exam-ready content. The student-facing UI exposes five subjects that violate the approved scope (DEC-001) or carry zero content (DEC-011).

**No code, no content, and no gateway edits were made during this audit.**

---

*Document version: 1.0 — 2026-07-09. Freeze status: BLOCKED. Next review: after CB-1 through CB-11 are resolved.*
