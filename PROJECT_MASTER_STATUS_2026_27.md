# PROJECT MASTER STATUS — 2026-27
**Type:** Single source-of-truth audit
**Date produced:** 2026-07-08
**Method:** Repository inspection only. No memory, no prior reports, no curriculum research, no external sources.
**Scope:** Classes 6–9 × Mathematics, Physics, Chemistry, Biology, Economics, Computer Science/Applications

---

## COUNTING METHODOLOGY

Two ID schemes exist in the repository and require different grep patterns:

| Format | Location | ID pattern | Count method |
|---|---|---|---|
| V2 bank (inline `{ id:"bo-..."}`) | `question-bank/questions/` | `bo-{subj}-{cls}-ch{N}-{NNN}` | `grep -c 'id:\s*"bo-\|id:"bo-'` |
| V1 adapter (newline `  id: "c9-..."`) | `artifacts/homework-hero/src/data/questions/class9-*.ts` | `c9-{subj}-ch{N}-t{N}-q{NN}` | `grep -c 'id: "c9-'` |

Any earlier counts using `^\s*id:` or `-q` ID filters were unreliable for V2 inline files. All counts in this document were produced fresh using the correct patterns above and verified against file content.

---

## SECTION A — EXACT REPOSITORY STRUCTURE

### A1. `question-bank/questions/` — V2 bank

```
question-bank/
└── questions/
    ├── chemistry/
    │   └── class9/
    │       ├── ch01-matter-in-our-surroundings.ts   ← 75 questions (populated)
    │       ├── ch02-is-matter-around-us-pure.ts      ← 0 questions (empty array [])
    │       ├── ch03-atoms-and-molecules.ts            ← 0 questions (empty array [])
    │       └── ch04-structure-of-the-atom.ts          ← 0 questions (empty array [])
    └── mathematics/
        ├── class6/   ← 14 files (all populated)
        ├── class7/   ← 15 files (all populated)
        └── class8/   ← 14 files (all populated)
```

**Subjects with NO V2 bank directory:** physics, biology, economics, computer-science, computer-applications
**Classes with NO V2 bank mathematics:** class9 (uses V1 adapters instead)

### A2. `artifacts/homework-hero/src/data/questions/` — adapters and V1 files

```
artifacts/homework-hero/src/data/questions/
├── class6-maths.ts           ← barrel adapter → imports all 14 V2 class6 chapters
├── class7-maths.ts           ← barrel adapter → imports all 15 V2 class7 chapters
├── class8-maths.ts           ← barrel adapter → imports all 14 V2 class8 chapters
├── class9-chemistry.ts       ← barrel adapter → imports ch01–ch04 from V2 chemistry/class9/
├── class9-economics-ch1.ts   ← V1 file
├── class9-economics-ch2.ts   ← V1 file
├── class9-economics-ch3.ts   ← V1 file
├── class9-economics-ch4.ts   ← V1 file
├── class9-maths-ch1.ts       ← V1 file
├── class9-maths-ch2.ts       ← V1 file
├── class9-maths-ch3.ts       ← V1 file
├── class9-maths-ch4.ts       ← V1 file
├── class9-maths-ch5.ts       ← V1 file
├── class9-maths-ch6.ts       ← V1 file
├── class9-maths-ch7.ts       ← V1 file
├── class9-maths-ch8.ts       ← V1 file
├── class9-maths-ch9.ts       ← V1 file
├── class9-maths-ch10.ts      ← V1 file
├── class9-maths-ch11.ts      ← V1 file
├── class9-maths-ch12.ts      ← V1 file
├── class9-maths-ch13.ts      ← V1 file
├── class9-maths-ch14.ts      ← V1 file
├── class9-maths-ch15.ts      ← V1 file
├── class9-physics-ch1.ts     ← V1 file
├── class9-physics-ch2.ts     ← V1 file
├── class9-physics-ch3.ts     ← V1 file
├── class9-physics-ch4.ts     ← V1 file
├── class9-physics-ch5.ts     ← V1 file
├── index.ts                  ← ALL_QUESTIONS and ALL_CHAPTERS registry
├── types.ts                  ← shared type definitions
└── v2adapter.ts              ← adaptV2Questions() + buildChapterMeta()
```

**Files with zero counterpart for in-scope subjects:**
No `class9-biology*.ts`, no `class6/7/8-physics.ts`, no `class6/7/8-chemistry.ts`, no `class6/7/8-biology.ts`, no `class6/7/8-economics.ts`, no `class*-computer*.ts`.

### A3. `scripts/src/curriculumGateway.ts` — validation script

```
scripts/src/
├── curriculumGateway.ts   ← main gateway (run: pnpm --filter @workspace/scripts run curriculum-check)
├── latencyAudit.ts
├── questionBankAudit.ts
└── statusReport.ts
```

---

## SECTION B — EXACT QUESTION COUNTS

### B1. Class 6 Mathematics — V2 bank, `question-bank/questions/mathematics/class6/`

| Ch | Filename | Chapter name | Questions |
|---|---|---|---|
| 01 | `ch01-knowing-our-numbers.ts` | Knowing Our Numbers | **80** |
| 02 | `ch02-whole-numbers.ts` | Whole Numbers | **80** |
| 03 | `ch03-playing-with-numbers.ts` | Playing with Numbers | **80** |
| 04 | `ch04-basic-geometrical-ideas.ts` | Basic Geometrical Ideas | **83** |
| 05 | `ch05-understanding-elementary-shapes.ts` | Understanding Elementary Shapes | **80** |
| 06 | `ch06-integers.ts` | Integers | **80** |
| 07 | `ch07-fractions.ts` | Fractions | **74** |
| 08 | `ch08-decimals.ts` | Decimals | **77** |
| 09 | `ch09-data-handling.ts` | Data Handling | **70** |
| 10 | `ch10-mensuration.ts` | Mensuration | **78** |
| 11 | `ch11-algebra.ts` | Algebra | **80** |
| 12 | `ch12-ratio-and-proportion.ts` | Ratio and Proportion | **78** |
| 13 | `ch13-symmetry.ts` | Symmetry | **75** |
| 14 | `ch14-practical-geometry.ts` | Practical Geometry | **75** |
| | | **TOTAL** | **1,090** |

### B2. Class 7 Mathematics — V2 bank, `question-bank/questions/mathematics/class7/`

| Ch | Filename | Chapter name | Questions |
|---|---|---|---|
| 01 | `ch01-integers.ts` | Integers | **75** |
| 02 | `ch02-fractions-and-decimals.ts` | Fractions and Decimals | **75** |
| 03 | `ch03-data-handling.ts` | Data Handling | **75** |
| 04 | `ch04-simple-equations.ts` | Simple Equations | **75** |
| 05 | `ch05-lines-and-angles.ts` | Lines and Angles | **79** |
| 06 | `ch06-triangle-and-its-properties.ts` | The Triangle and Its Properties | **75** |
| 07 | `ch07-congruence-of-triangles.ts` | Congruence of Triangles | **75** |
| 08 | `ch08-comparing-quantities.ts` | Comparing Quantities | **75** |
| 09 | `ch09-rational-numbers.ts` | Rational Numbers | **75** |
| 10 | `ch10-practical-geometry.ts` | Practical Geometry | **75** |
| 11 | `ch11-perimeter-and-area.ts` | Perimeter and Area | **75** |
| 12 | `ch12-algebraic-expressions.ts` | Algebraic Expressions | **75** |
| 13 | `ch13-exponents-and-powers.ts` | Exponents and Powers | **75** |
| 14 | `ch14-symmetry.ts` | Symmetry | **75** |
| 15 | `ch15-visualising-solid-shapes.ts` | Visualising Solid Shapes | **75** |
| | | **TOTAL** | **1,129** |

### B3. Class 8 Mathematics — V2 bank, `question-bank/questions/mathematics/class8/`

| Ch | Filename | Chapter name | Questions |
|---|---|---|---|
| 01 | `ch01-rational-numbers.ts` | Rational Numbers | **75** |
| 02 | `ch02-linear-equations.ts` | Linear Equations in One Variable | **75** |
| 03 | `ch03-understanding-quadrilaterals.ts` | Understanding Quadrilaterals | **79** |
| 04 | `ch04-data-handling.ts` | Data Handling | **75** |
| 05 | `ch05-squares-and-square-roots.ts` | Squares and Square Roots | **75** |
| 06 | `ch06-cubes-and-cube-roots.ts` | Cubes and Cube Roots | **75** |
| 07 | `ch07-comparing-quantities.ts` | Comparing Quantities | **75** |
| 08 | `ch08-algebraic-expressions-and-identities.ts` | Algebraic Expressions and Identities | **75** |
| 09 | `ch09-mensuration.ts` | Mensuration | **75** |
| 10 | `ch10-exponents-and-powers.ts` | Exponents and Powers (Ch10 in file) | **75** |
| 11 | `ch11-direct-and-inverse-proportions.ts` | Direct and Inverse Proportions | **75** |
| 12 | `ch12-introduction-to-graphs.ts` | Introduction to Graphs | **75** |
| 13 | `ch13-factorisation.ts` | Factorisation | **75** |
| 14 | `ch14-visualising-solid-shapes.ts` | Visualising Solid Shapes | **75** |
| | | **TOTAL** | **1,054** |

### B4. Class 9 Mathematics — V1 adapters, `artifacts/homework-hero/src/data/questions/class9-maths-ch*.ts`

| File | Chapter name (from CHAPTER_META) | Questions | Gateway cbseDeleted |
|---|---|---|---|
| `class9-maths-ch1.ts` | Number Systems | **50** | No |
| `class9-maths-ch2.ts` | Polynomials | **50** | No |
| `class9-maths-ch3.ts` | Coordinate Geometry | **56** | No |
| `class9-maths-ch4.ts` | Linear Equations in Two Variables | **38** | No |
| `class9-maths-ch5.ts` | Introduction to Euclid's Geometry | **24** | **Yes** |
| `class9-maths-ch6.ts` | Lines and Angles | **25** | No |
| `class9-maths-ch7.ts` | Triangles | **19** | No |
| `class9-maths-ch8.ts` | Quadrilaterals | **17** | No |
| `class9-maths-ch9.ts` | Areas of Parallelograms and Triangles | **45** | No |
| `class9-maths-ch10.ts` | Circles | **20** | No |
| `class9-maths-ch11.ts` | Constructions | **46** | **Yes** |
| `class9-maths-ch12.ts` | Heron's Formula | **45** | No |
| `class9-maths-ch13.ts` | Surface Areas and Volumes | **23** | No |
| `class9-maths-ch14.ts` | Statistics | **22** | No |
| `class9-maths-ch15.ts` | Probability | **19** | No |
| | **TOTAL** | **499** | 2 chapters flagged |

### B5. Class 9 Physics — V1 adapters, `artifacts/homework-hero/src/data/questions/class9-physics-ch*.ts`

| File | Chapter name (from CHAPTER_META) | Questions | Gateway cbseDeleted |
|---|---|---|---|
| `class9-physics-ch1.ts` | Motion | **25** | No |
| `class9-physics-ch2.ts` | Force and Laws of Motion | **25** | No |
| `class9-physics-ch3.ts` | Gravitation | **25** | No — **not flagged** |
| `class9-physics-ch4.ts` | Work and Energy | **25** | No |
| `class9-physics-ch5.ts` | Sound | **25** | No |
| | **TOTAL** | **125** | 0 chapters flagged |

### B6. Class 9 Chemistry — V2 bank via adapter, `question-bank/questions/chemistry/class9/`

| File | Chapter name (in file header) | Questions | File state |
|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | **75** | Populated |
| `ch02-is-matter-around-us-pure.ts` | Is Matter Around Us Pure? | **0** | Empty `[]` |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules | **0** | Empty `[]` |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom | **0** | Empty `[]` |
| | **TOTAL** | **75** | 3 stubs |

The adapter `class9-chemistry.ts` imports all 4 files and concatenates them. At runtime, only ch01 contributes any questions.

### B7. Class 9 Biology — `question-bank/questions/biology/` does not exist

| | Status |
|---|---|
| V2 bank directory | **NOT FOUND** |
| Any adapter file | **NOT FOUND** |
| Total questions | **0** |

### B8. Class 9 Economics — V1 adapters, `artifacts/homework-hero/src/data/questions/class9-economics-ch*.ts`

| File | Chapter name (from CHAPTER_META) | Questions |
|---|---|---|
| `class9-economics-ch1.ts` | The Story of Village Palampur | **25** |
| `class9-economics-ch2.ts` | People as Resource | **25** |
| `class9-economics-ch3.ts` | Poverty as a Challenge | **25** |
| `class9-economics-ch4.ts` | Food Security in India | **25** |
| | **TOTAL** | **100** |

### B9. Class 9 Computer Applications — no directory found for any variant name

| Search path | Status |
|---|---|
| `question-bank/questions/computer-science/` | NOT FOUND |
| `question-bank/questions/computer-applications/` | NOT FOUND |
| `question-bank/questions/cs/` | NOT FOUND |
| Any `class9-computer*.ts` or `class9-ca*.ts` | NOT FOUND |
| Total questions | **0** |

### B10. Classes 6, 7, 8 — all non-Mathematics subjects

No files exist for Classes 6, 7, or 8 in Physics, Chemistry, Biology, Economics, or Computer Science/Applications anywhere in the repository.

| Subject | Class 6 | Class 7 | Class 8 |
|---|---|---|---|
| Physics | NOT IN REPO | NOT IN REPO | NOT IN REPO |
| Chemistry | NOT IN REPO | NOT IN REPO | NOT IN REPO |
| Biology | NOT IN REPO | NOT IN REPO | NOT IN REPO |
| Economics | NOT IN REPO | NOT IN REPO | NOT IN REPO |
| Computer Sci/App | NOT IN REPO | NOT IN REPO | NOT IN REPO |

---

## MASTER STATUS MATRIX

Legend: **Y** = Yes  **N** = No  **P** = Partial  **—** = Not in repository

| Class | Subject | Files exist? | Adapter exists? | QB exists? | Questions | Chapters | Wired in ALL_Q? | In gateway? | Launch status |
|---|---|---|---|---|---|---|---|---|---|
| **6** | Mathematics | Y | Y (`class6-maths.ts`) | Y (V2, 14 ch) | **1,090** | 14 | Y | Y | **PARTIAL** ¹ |
| **6** | Physics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **6** | Chemistry | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **6** | Biology | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **6** | Economics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **6** | Computer Sci/App | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **7** | Mathematics | Y | Y (`class7-maths.ts`) | Y (V2, 15 ch) | **1,129** | 15 | Y | Y | **PARTIAL** ² |
| **7** | Physics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **7** | Chemistry | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **7** | Biology | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **7** | Economics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **7** | Computer Sci/App | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **8** | Mathematics | Y | Y (`class8-maths.ts`) | Y (V2, 14 ch) | **1,054** | 14 | Y | Y | **PARTIAL** ¹ |
| **8** | Physics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **8** | Chemistry | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **8** | Biology | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **8** | Economics | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **8** | Computer Sci/App | N | N | N | 0 | 0 | N | N | **NOT_APPLICABLE** |
| **9** | Mathematics | Y | N (direct import) | N (V1 only) | **499** | 15 | Y | Y | **PARTIAL** ³ |
| **9** | Physics | Y | N (direct import) | N (V1 only) | **125** | 5 | Y | Y | **PARTIAL** ⁴ |
| **9** | Chemistry | P (4 files, 3 empty) | Y (`class9-chemistry.ts`) | P (4 files, 3 empty) | **75** | 1 live / 3 stub | Y | N | **BLOCKED** |
| **9** | Biology | N | N | N | **0** | 0 | N | N | **BLOCKED** |
| **9** | Economics | Y | N (direct import) | N (V1 only) | **100** | 4 | Y | Y | **FROZEN** |
| **9** | Computer Sci/App | N | N | N | **0** | 0 | N | N | **BLOCKED** |

**Notes:**
¹ All chapters present and wired. Gateway registered. No per-question exam-status tags on any question object.
² All chapters present and wired. Gateway registered but two chapters have no `cbseDeleted` flag in the gateway EXPECTED registry.
³ All 15 chapters present and wired. Gateway registered. Two chapters flagged `cbseDeleted: true` in gateway but no corresponding tag on question objects; both remain in ALL_QUESTIONS unfiltered.
⁴ All 5 chapters present and wired. Gateway registered. Zero `cbseDeleted` flags set in gateway for any Physics chapter.

---

## SECTION C — MISSING ADAPTERS

An "adapter" is defined as a `.ts` file that imports from `question-bank/` and re-exports to the frontend type.

| Subject | Class | Missing adapter | Notes |
|---|---|---|---|
| Physics | 6, 7, 8, 9 | `class{6,7,8,9}-physics.ts` | No V2 bank to import from; adapter AND bank both absent |
| Chemistry | 6, 7, 8 | `class{6,7,8}-chemistry.ts` | No V2 bank to import from |
| Chemistry | 9 | ✅ EXISTS — `class9-chemistry.ts` | Imports ch01–ch04; ch02–ch04 are empty |
| Biology | 6, 7, 8, 9 | `class{6,7,8,9}-biology.ts` | No V2 bank to import from |
| Economics | 6, 7, 8 | `class{6,7,8}-economics.ts` | No V2 bank to import from |
| Computer Sci/App | 6, 7, 8, 9 | `class{6,7,8,9}-computer*.ts` | No V2 bank to import from |

---

## SECTION D — MISSING CHAPTER FILES

### D1. Class 9 Chemistry — V2 bank stubs (files exist, arrays are empty)

| File | Exports | Array contents |
|---|---|---|
| `ch02-is-matter-around-us-pure.ts` | `CH02_IS_MATTER_AROUND_US_PURE: QuestionV2[]` | `[]` — zero questions |
| `ch03-atoms-and-molecules.ts` | `CH03_ATOMS_AND_MOLECULES: QuestionV2[]` | `[]` — zero questions |
| `ch04-structure-of-the-atom.ts` | `CH04_STRUCTURE_OF_THE_ATOM: QuestionV2[]` | `[]` — zero questions |

These files are wired (imported in `class9-chemistry.ts` and spread into RAW), but contribute 0 questions to ALL_QUESTIONS at runtime.

### D2. All subjects — entirely absent

The following have no files of any kind in the repository:

| Missing files needed (if this subject is to be launched) |
|---|
| `question-bank/questions/physics/` (any class) |
| `question-bank/questions/biology/` (any class) |
| `question-bank/questions/economics/` (any class) |
| `question-bank/questions/computer-applications/` or `computer-science/` (any class) |
| `question-bank/questions/mathematics/class9/` (Class 9 Maths uses V1, not V2) |
| `artifacts/homework-hero/src/data/questions/class9-biology*.ts` |
| `artifacts/homework-hero/src/data/questions/class9-computer*.ts` |

---

## SECTION E — MISSING GATEWAY REGISTRATIONS

Gateway file: `scripts/src/curriculumGateway.ts`
Registered subjects in `EXPECTED`:

| Key in EXPECTED | Registered | Chapter count | Min Q target |
|---|---|---|---|
| `6-Mathematics` | **YES** | 14 | 50 |
| `7-Mathematics` | **YES** | 15 | 50 |
| `8-Mathematics` | **YES** | 14 | 50 |
| `9-Mathematics` | **YES** | 15 | 20 |
| `9-Economics` | **YES** | 4 | 15 |
| `9-Physics` | **YES** | 5 | 15 |
| `9-Chemistry` | **NO** | — | — |
| `9-Biology` | **NO** | — | — |
| `9-ComputerApplications` | **NO** | — | — |
| `6/7/8-Physics` | **NO** | — | — |
| `6/7/8-Chemistry` | **NO** | — | — |
| `6/7/8-Biology` | **NO** | — | — |

**Missing `cbseDeleted` flags in existing registrations:**

| Subject | Chapter | Status in gateway |
|---|---|---|
| 9-Mathematics | Introduction to Euclid's Geometry (ch5) | `cbseDeleted: true` ✅ |
| 9-Mathematics | Constructions (ch11) | `cbseDeleted: true` ✅ |
| 9-Physics | Gravitation (ch3) | **NOT flagged** — no `cbseDeleted` |
| 7-Mathematics | Practical Geometry (ch10) | **NOT flagged** — no `cbseDeleted` |
| 7-Mathematics | Visualising Solid Shapes (ch15) | **NOT flagged** — no `cbseDeleted` |

---

## SECTION F — MISLABELLED CONTENT CURRENTLY LIVE IN ALL_QUESTIONS

**Definition used:** A chapter is "mislabelled" if the gateway's `EXPECTED` registry flags it `cbseDeleted: true` but the corresponding questions appear in `ALL_QUESTIONS` with no filtering, no tag, and no exam-status field on the question objects. This is a pure repository fact — the gateway knows a chapter is deleted from board exams; the question objects do not reflect this.

| Subject | Chapter | Questions live in ALL_QUESTIONS | Gateway `cbseDeleted` flag | Per-question `examStatus` field |
|---|---|---|---|---|
| 9-Mathematics | Introduction to Euclid's Geometry (`ch5`) | **24** | `true` | **Absent** |
| 9-Mathematics | Constructions (`ch11`) | **46** | `true` | **Absent** |
| **Subtotal — gateway-flagged, untagged** | | **70** | | |

**Additional: subjects in ALL_QUESTIONS with zero gateway coverage**

These subjects appear in ALL_QUESTIONS but have no gateway entry at all — gateway F3/W1/W2/W3 checks never run for them:

| Subject | Questions in ALL_QUESTIONS | Gateway entry | Consequence |
|---|---|---|---|
| Class 9 Chemistry | 75 (ch01 only) | **None** | Zero validation; 3 empty-array chapters silently pass |
| Class 9 Economics | 100 | Present (4 chapters) | Validated |
| Class 9 Physics | 125 | Present (5 chapters) | Validated — but Gravitation not flagged |

**No `examStatus`, `isExam`, `cbseDeleted`, or equivalent field exists on any question object in the repository** (verified across V1 and V2 formats). The only exam-status signal is the gateway's chapter-level `cbseDeleted` flag, which does not propagate to questions.

---

## SECTION G — RECOMMENDED IMPLEMENTATION ORDER

Ranked by repository gap severity: (questions affected or blocked) × (infrastructure already present) ÷ (files to create from zero).

| Priority | Task | Type | Infrastructure already exists? | Scope |
|---|---|---|---|---|
| 1 | Add `examStatus` or equivalent tag to question type and populate for gateway-flagged chapters | Config/type change | Schema exists; gateway flag exists | 70 questions, 2 chapters |
| 2 | Add Gravitation (`class9-physics-ch3`) as `cbseDeleted` in gateway EXPECTED | Gateway config | Gateway file exists; chapter entry exists | 1 line |
| 3 | Add Ch10 + Ch15 in `7-Mathematics` as `cbseDeleted` in gateway EXPECTED | Gateway config | Gateway file exists; chapter entries exist | 2 lines |
| 4 | Register `9-Chemistry` in gateway EXPECTED with ch01–ch04 | Gateway config | Gateway file exists; adapter and V2 bank files exist | New key in EXPECTED |
| 5 | Author Class 9 Chemistry ch02, ch03, ch04 | Authoring | ✅ Files exist, adapter wired, gateway not yet registered | 3 empty arrays |
| 6 | Create `question-bank/questions/biology/class9/`, author chapters, create adapter, wire in index.ts, register in gateway | Full build | Nothing exists | 0 → all |
| 7 | Create `question-bank/questions/computer-applications/class9/`, author chapters, create adapter, wire in index.ts, register in gateway | Full build | Nothing exists | 0 → all |
| 8 | Increase question depth for thin Class 9 Maths chapters | Authoring | Files and wiring complete; gateway W1 warns | ch7 (19q), ch8 (17q), ch15 (19q) below 20q min |
| 9 | Correct Chapter name in `class9-maths-ch5.ts`: `name` field reads `"Introduction to Euclid's Geometry"` — verify matches gateway EXPECTED exactly | Metadata | File exists | 1 string field |
| 10 | Correct stub chapter comments in ch02/03/04 chemistry files: comments reference old chapter numbering | Metadata | Files exist | Comments only |

---

## TOP 10 LAUNCH BLOCKERS

| # | Blocker | Evidence (file/location) | Estimated effort | Type |
|---|---|---|---|---|
| **1** | **Class 9 Chemistry ch02–ch04 are empty arrays** — 3 chapter files exist and are wired but export `[]`; 0 exam-usable questions in Chemistry | `question-bank/questions/chemistry/class9/ch02.ts`, `ch03.ts`, `ch04.ts` | High — authoring ~225 questions across 3 chapters | Content |
| **2** | **Class 9 Biology does not exist** — no V2 bank directory, no adapter, no index.ts registration, no gateway entry | Entire `question-bank/questions/biology/` directory absent | Very high — create directory, author all chapters, create adapter, wire, register | Content + Infrastructure |
| **3** | **Class 9 Computer Applications does not exist** — same zero-state as Biology | Entire `question-bank/questions/computer-applications/` directory absent | Very high — create directory, author all chapters, create adapter, wire, register | Content + Infrastructure |
| **4** | **Class 9 Chemistry not registered in gateway** — ch02/03/04 zero-question state is invisible to F3 validation; would pass gateway silently | `scripts/src/curriculumGateway.ts` — no `9-Chemistry` key in `EXPECTED` | Low — add one EXPECTED entry with 4 chapters | Config |
| **5** | **70 questions in ALL_QUESTIONS from gateway-flagged `cbseDeleted` chapters have no exam-status tag** — Ch5 (24q) + Ch11 (46q) Class 9 Maths | `class9-maths-ch5.ts`, `class9-maths-ch11.ts`; `EXPECTED["9-Mathematics"]` | Low — depends on schema decision for exam-status field | Metadata |
| **6** | **Class 9 Physics Gravitation (25q) not flagged `cbseDeleted` in gateway** — inconsistent with other deleted chapters | `scripts/src/curriculumGateway.ts` EXPECTED `9-Physics` section — no `cbseDeleted` on Gravitation | Trivial — add `cbseDeleted: true` to one entry | Config |
| **7** | **Class 7 Maths Ch10 Practical Geometry (75q) + Ch15 Visualising Solid Shapes (75q) not flagged `cbseDeleted` in gateway** | `scripts/src/curriculumGateway.ts` EXPECTED `7-Mathematics` section | Trivial — add `cbseDeleted: true` to two entries | Config |
| **8** | **Class 9 Maths ch8 Quadrilaterals has 17 questions — below gateway W1 minimum of 20q** | `class9-maths-ch8.ts`; `MIN_Q["9-Mathematics"] = 20` in gateway | Low — author 3+ more questions | Content (incremental) |
| **9** | **Class 9 Maths ch7 Triangles (19q) and ch15 Probability (19q) both below 20q W1 minimum** | `class9-maths-ch7.ts`, `class9-maths-ch15.ts` | Low — author 1+ more question per chapter | Content (incremental) |
| **10** | **`class9-chemistry.ts` adapter wires 4 chapters but 3 are empty** — ALL_QUESTIONS receives `CLASS9_CHEMISTRY_QUESTIONS` which at runtime contains only ch01 questions; chapter navigation in the UI will show 4 chapters, 3 of which are empty | `class9-chemistry.ts`; `index.ts` spreads `...CLASS9_CHEMISTRY_QUESTIONS` | Resolved by Blocker #1 (authoring ch02–ch04) or by short-term adapter filter | Content / Adapter |

---

## RECOMMENDED NEXT TASK

**Immediate (no authoring, no curriculum research, no content changes):**

Add `cbseDeleted: true` to the gateway EXPECTED registry for:
- `9-Physics` → `Gravitation`
- `7-Mathematics` → `Practical Geometry` (ch10)
- `7-Mathematics` → `Visualising Solid Shapes` (ch15)

And add an `EXPECTED["9-Chemistry"]` entry with 4 chapters.

**File:** `scripts/src/curriculumGateway.ts`
**Lines affected:** ~4 additions to the EXPECTED object + MIN_Q entry for `9-Chemistry`
**Risk:** Zero — read-only validation script; does not affect runtime or ALL_QUESTIONS

This unblocks Blocker #4, #6, and #7 in under 30 minutes with no review gate, no authoring gate, and no curriculum research needed — all four facts are already in the repository.

**After that:** Blocker #1 (Chemistry ch02–ch04 authoring) — the only work that requires content creation before any exam-aligned Chemistry questions exist.

---

## PLATFORM SUMMARY

| Metric | Value | Source |
|---|---|---|
| Total files in `question-bank/` | 33 `.ts` files | Directory listing |
| Total files in `homework-hero/src/data/questions/` | 30 `.ts` files | Directory listing |
| Subjects with V2 bank directories | 2 (mathematics, chemistry) | `question-bank/questions/` |
| Total questions in ALL_QUESTIONS (all subjects, all classes) | **4,072** | Section B totals: 1090+1129+1054+499+125+75+100 |
| Questions from V2 bank | 3,344 | Cl6+Cl7+Cl8 Maths + Cl9 Chemistry ch01 |
| Questions from V1 adapters | 724 | Cl9 Maths+Physics+Economics |
| Subjects with zero questions in repo | 3 | Biology, Computer Sci/App (all classes), Physics/Chemistry/Biology/Economics/CS (Cl6-8) |
| Gateway-registered subjects | 6 | 6-Maths, 7-Maths, 8-Maths, 9-Maths, 9-Economics, 9-Physics |
| Subjects in ALL_QUESTIONS with no gateway entry | 1 | 9-Chemistry |
| Subjects expected in scope with zero repo presence | 2 | 9-Biology, 9-Computer Applications |
| `cbseDeleted` chapters flagged in gateway | 2 | 9-Maths ch5, 9-Maths ch11 |
| Questions in `cbseDeleted` chapters, unfiltered in ALL_QUESTIONS | **70** | ch5 (24q) + ch11 (46q) |

---

*Repository inspection only. No web searches. No curriculum research. No code changes. All data verified directly from file content.*
*Produced: 2026-07-08*
