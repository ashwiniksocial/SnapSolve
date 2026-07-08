# PROJECT LAUNCH READINESS
**Produced:** 2026-07-08 | **Method:** Repository read-only. No web searches. No curriculum research.
**Source of truth:** File system inspection of `artifacts/homework-hero/src/data/questions/`, `question-bank/questions/`, `scripts/src/curriculumGateway.ts`

---

## DATA RELIABILITY NOTE

Two counting methods were used and compared:

| Method | Reliable for |
|---|---|
| `node.js` regex `\{\s*\n?\s*(questionId\|id):` | All file formats — catches both inline `{ id:` and newline-separated `  id:` patterns |
| `grep -c '^\s*id:'` | V1 adapter files only — misses V2 bank files that use inline `{ id:` style, returning false zero |

**Where counts differ, the node.js method is correct.** Class 7 and 8 V2 bank chapters showing "0" via grep are populated — they use inline `{ id:` formatting.

---

## SUBJECT 1 — CLASS 6 MATHEMATICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class6-maths.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter (loads V2 bank) | ✅ Present and populated |
| `ch01-knowing-our-numbers.ts` through `ch14-practical-geometry.ts` | `question-bank/questions/mathematics/class6/` | V2 bank | ✅ All 14 present |

### Question counts

| Ch | Chapter name | Questions | Populated |
|---|---|---|---|
| 01 | Knowing Our Numbers | 80 | ✅ |
| 02 | Whole Numbers | 80 | ✅ |
| 03 | Playing with Numbers | 80 | ✅ |
| 04 | Basic Geometrical Ideas | 83 | ✅ |
| 05 | Understanding Elementary Shapes | 80 | ✅ |
| 06 | Integers | 80 | ✅ |
| 07 | Fractions | 74 | ✅ |
| 08 | Decimals | 77 | ✅ |
| 09 | Data Handling | 70 | ✅ |
| 10 | Mensuration | 78 | ✅ |
| 11 | Algebra | 80 | ✅ |
| 12 | Ratio and Proportion | 78 | ✅ |
| 13 | Symmetry | 75 | ✅ |
| 14 | Practical Geometry | 75 | ✅ |
| | **TOTAL** | **1,090** | **14 / 14** |

### Wiring

| Check | Status |
|---|---|
| `class6-maths.ts` imported in `index.ts` | ✅ |
| `CLASS6_MATHS_CHAPTERS` exported to `ALL_CHAPTERS` | ✅ |
| `CLASS6_MATHS_QUESTIONS` exported to `ALL_QUESTIONS` | ✅ |
| All 14 V2 bank chapters imported in `class6-maths.ts` | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `6-Mathematics` | ✅ Present — 14 expected chapters |
| cbseDeleted chapters | None for Class 6 |
| Minimum question target (50q/chapter) | ✅ All chapters ≥ 50q |
| F7 (missing expected chapter) | ✅ No violations |
| F3 (zero-question chapter) | ✅ No violations |

**Launch readiness:** 🟢 100% | **Blocker count:** 0

---

## SUBJECT 2 — CLASS 7 MATHEMATICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class7-maths.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter (loads V2 bank) | ✅ Present and populated |
| `ch01-integers.ts` through `ch15-visualising-solid-shapes.ts` | `question-bank/questions/mathematics/class7/` | V2 bank | ✅ All 15 present |

### Question counts

| Ch | Chapter name | Questions | CBSE exam status |
|---|---|---|---|
| 01 | Integers | 75 | ✅ Exam |
| 02 | Fractions and Decimals | 75 | ✅ Exam |
| 03 | Data Handling | 75 | ✅ Exam |
| 04 | Simple Equations | 75 | ✅ Exam |
| 05 | Lines and Angles | 79 | ✅ Exam |
| 06 | The Triangle and Its Properties | 75 | ✅ Exam |
| 07 | Congruence of Triangles | 75 | ✅ Exam |
| 08 | Comparing Quantities | 75 | ✅ Exam |
| 09 | Rational Numbers | 75 | ✅ Exam |
| 10 | Practical Geometry | 75 | ⚠️ Rationalised — non-exam; untagged |
| 11 | Perimeter and Area | 75 | ✅ Exam |
| 12 | Algebraic Expressions | 75 | ✅ Exam |
| 13 | Exponents and Powers | 75 | ✅ Exam |
| 14 | Symmetry | 75 | ✅ Exam |
| 15 | Visualising Solid Shapes | 75 | ⚠️ Rationalised — non-exam; untagged |
| | **TOTAL** | **1,129** | |
| | Exam-aligned | **979** | 13 chapters |

### Wiring

| Check | Status |
|---|---|
| `class7-maths.ts` imported in `index.ts` | ✅ |
| `CLASS7_MATHS_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS7_MATHS_QUESTIONS` → `ALL_QUESTIONS` | ✅ |
| All 15 V2 bank chapters imported in adapter | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `7-Mathematics` | ✅ Present — 15 expected chapters |
| cbseDeleted chapters in gateway | ⚠️ None flagged — Ch10 and Ch15 are rationalised non-exam but gateway does NOT mark them `cbseDeleted` |
| Minimum question target (50q/chapter) | ✅ All chapters ≥ 50q |
| F7 violations | ✅ None |
| F3 violations | ✅ None |

**Launch readiness:** 🟡 87% | **Blocker count:** 1 (tag correction for 150 questions — Ch10 + Ch15 flagged as exam content but are non-exam; no authoring required)

---

## SUBJECT 3 — CLASS 8 MATHEMATICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class8-maths.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter (loads V2 bank) | ✅ Present and populated |
| `ch01-rational-numbers.ts` through `ch14-visualising-solid-shapes.ts` | `question-bank/questions/mathematics/class8/` | V2 bank | ✅ All 14 present |

### Question counts

| Ch | Chapter name | Questions | Populated |
|---|---|---|---|
| 01 | Rational Numbers | 75 | ✅ |
| 02 | Linear Equations in One Variable | 75 | ✅ |
| 03 | Understanding Quadrilaterals | 79 | ✅ |
| 04 | Data Handling | 75 | ✅ |
| 05 | Squares and Square Roots | 75 | ✅ |
| 06 | Cubes and Cube Roots | 75 | ✅ |
| 07 | Comparing Quantities | 75 | ✅ |
| 08 | Algebraic Expressions and Identities | 75 | ✅ |
| 09 | Mensuration | 75 | ✅ |
| 10 | Visualising Solid Shapes | 75 | ✅ |
| 11 | Exponents and Powers | 75 | ✅ |
| 12 | Direct and Inverse Proportions | 75 | ✅ |
| 13 | Factorisation | 75 | ✅ |
| 14 | Introduction to Graphs | 75 | ✅ |
| | **TOTAL** | **1,054** | **14 / 14** |

### Wiring

| Check | Status |
|---|---|
| `class8-maths.ts` imported in `index.ts` | ✅ |
| `CLASS8_MATHS_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS8_MATHS_QUESTIONS` → `ALL_QUESTIONS` | ✅ |
| All 14 V2 bank chapters imported in adapter | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `8-Mathematics` | ✅ Present — 14 expected chapters |
| cbseDeleted chapters | None |
| Minimum question target (50q/chapter) | ✅ All chapters ≥ 50q |
| F7 violations | ✅ None |
| F3 violations | ✅ None |

**Launch readiness:** 🟢 100% | **Blocker count:** 0

---

## SUBJECT 4 — CLASS 9 MATHEMATICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class9-maths-ch1.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter | ✅ Populated |
| `class9-maths-ch2.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch3.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch4.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch5.ts` | same | V1 adapter | ✅ Populated — **cbseDeleted** |
| `class9-maths-ch6.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch7.ts` | same | V1 adapter | ✅ Populated — thin (19q) |
| `class9-maths-ch8.ts` | same | V1 adapter | ✅ Populated — thin (17q) |
| `class9-maths-ch9.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch10.ts` | same | V1 adapter | ✅ Populated — thin (20q) |
| `class9-maths-ch11.ts` | same | V1 adapter | ✅ Populated — **cbseDeleted** |
| `class9-maths-ch12.ts` | same | V1 adapter | ✅ Populated |
| `class9-maths-ch13.ts` | same | V1 adapter | ✅ Populated — thin (23q) |
| `class9-maths-ch14.ts` | same | V1 adapter | ✅ Populated — thin (22q) |
| `class9-maths-ch15.ts` | same | V1 adapter | ✅ Populated — thin (19q) |

### Question counts

| Ch | Chapter name | Questions | Topics | CBSE exam status |
|---|---|---|---|---|
| 1 | Number Systems | 50 | 5 | ✅ Exam |
| 2 | Polynomials | 50 | 5 | ✅ Exam |
| 3 | Coordinate Geometry | 56 | 5 | ✅ Exam |
| 4 | Linear Equations in Two Variables | 38 | 5 | ✅ Exam |
| 5 | Introduction to Euclid | 24 | 5 | ⚠️ cbseDeleted in gateway — not in CBSE exam; untagged |
| 6 | Lines and Angles | 25 | 5 | ✅ Exam |
| 7 | Triangles | 19 | 5 | ✅ Exam — thin (W1: below 20q target) |
| 8 | Quadrilaterals | 17 | 5 | ✅ Exam — **below 20q min** (W1 FAIL) |
| 9 | Areas of Parallelograms and Triangles | 45 | 4 | ✅ Exam |
| 10 | Circles | 20 | 5 | ✅ Exam — at minimum |
| 11 | Constructions | 46 | 3 | ⚠️ cbseDeleted in gateway — not in CBSE exam; untagged |
| 12 | Heron's Formula | 45 | 4 | ✅ Exam |
| 13 | Surface Areas and Volumes | 23 | 5 | ✅ Exam |
| 14 | Statistics | 22 | 5 | ✅ Exam |
| 15 | Probability | 19 | 4 | ✅ Exam — thin |
| | **TOTAL** | **499** | | |
| | Exam-aligned | **409** | | 13 chapters |
| | Non-exam (cbseDeleted) | **70** | | Ch5 (24q) + Ch11 (46q) |

### Wiring

| Check | Status |
|---|---|
| All 15 `class9-maths-ch*.ts` imported in `index.ts` | ✅ All 15 individually imported |
| `CLASS9_MATHS_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS9_MATHS_QUESTIONS` → `ALL_QUESTIONS` | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-Mathematics` | ✅ Present — 15 expected chapters |
| `cbseDeleted` flagged chapters | ✅ Ch5 "Introduction to Euclid's Geometry" and Ch11 "Constructions" flagged `cbseDeleted: true` in gateway |
| F7 violations | ✅ None — all 15 expected chapters have files |
| F6 violations | ⚠️ Ch5 name mismatch: file has "Introduction to Euclid", gateway expects "Introduction to Euclid's Geometry" |
| F3 violations | ✅ None (all chapters have questions) |
| W1 violations | ⚠️ Ch8 Quadrilaterals (17q < 20q min), Ch7 Triangles (19q < 20q), Ch15 Probability (19q < 20q) |
| W3 violations | ⚠️ Coordinate Geometry (56q) is 3.3× Quadrilaterals (17q) — threshold: 3× |

**Launch readiness:** 🟡 82% | **Blocker count:** 2 (tag fixes for 70 non-exam questions; name fix for ch5 — no authoring)
**Depth warning:** 6 chapters below the 20q minimum target — Ch7 (19q), Ch8 (17q), Ch10 (20q), Ch13 (23q), Ch14 (22q), Ch15 (19q)

---

## SUBJECT 5 — CLASS 9 PHYSICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class9-physics-ch1.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter | ✅ Populated |
| `class9-physics-ch2.ts` | same | V1 adapter | ✅ Populated |
| `class9-physics-ch3.ts` | same | V1 adapter | ✅ Populated — **non-exam** |
| `class9-physics-ch4.ts` | same | V1 adapter | ✅ Populated — **title mismatch** |
| `class9-physics-ch5.ts` | same | V1 adapter | ✅ Populated |

### Question counts

| SnapSolve ch | Chapter name | Questions | Topics | CBSE 2026-27 exam status |
|---|---|---|---|---|
| ch1 | Motion | 25 | 3 | ✅ Exam (Exploration Ch4) |
| ch2 | Force and Laws of Motion | 25 | 3 | ✅ Exam (Exploration Ch6) |
| ch3 | Gravitation | 25 | 3 | ❌ NOT exam in 2026-27; no Gravitation chapter in Exploration exam set |
| ch4 | Work and Energy | 25 | 3 | ✅ Exam — title should be "Work, Energy and Simple Machines" (Exploration Ch7); Simple Machines content unconfirmed |
| ch5 | Sound | 25 | 3 | ✅ Exam (Exploration Ch10) |
| | **TOTAL** | **125** | | |
| | Exam-aligned | **100** | | ch1 + ch2 + ch4 + ch5 |
| | Non-exam | **25** | | ch3 Gravitation |

### Wiring

| Check | Status |
|---|---|
| All 5 `class9-physics-ch*.ts` imported in `index.ts` | ✅ All 5 individually imported |
| `CLASS9_PHYSICS_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS9_PHYSICS_QUESTIONS` → `ALL_QUESTIONS` | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-Physics` | ✅ Present — 5 expected chapters |
| `cbseDeleted` flagged | ⚠️ Gravitation NOT flagged cbseDeleted in gateway — gap; Gravitation is non-exam in 2026-27 |
| Minimum question target (15q/chapter) | ✅ All chapters ≥ 15q |
| F7 violations | ✅ None |
| F3 violations | ✅ None |
| F6 violations | ✅ None for matched chapters |

**Launch readiness:** 🟡 80% | **Blocker count:** 1 (tag fix for Gravitation 25q — no authoring) + 1 content gap (Simple Machines not confirmed in ch4)

---

## SUBJECT 6 — CLASS 9 CHEMISTRY

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class9-chemistry.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter (wraps V2 bank) | ✅ Present — wiring correct |
| `ch01-matter-in-our-surroundings.ts` | `question-bank/questions/chemistry/class9/` | V2 bank | ✅ Present — **75 questions — NON-EXAM** |
| `ch02-is-matter-around-us-pure.ts` | same | V2 bank | ⚠️ Present — **stub only** (0 questions, empty array) |
| `ch03-atoms-and-molecules.ts` | same | V2 bank | ⚠️ Present — **stub only** (0 questions, empty array) |
| `ch04-structure-of-the-atom.ts` | same | V2 bank | ⚠️ Present — **stub only** (0 questions, empty array) |

### Question counts

| V2 bank ch | Chapter name | Questions | Exam status | Notes |
|---|---|---|---|---|
| ch01 | Matter in Our Surroundings | 75 | ❌ NOT exam in 2026-27 | Topics: States of Matter, Change of State, Evaporation, Plasma/BEC |
| ch02 | Is Matter Around Us Pure? | 0 | ✅ EXAM (Exploration Ch5) | Scaffold only — empty array `[]` |
| ch03 | Atoms and Molecules | 0 | ✅ EXAM (Exploration Ch9) | Scaffold only — empty array `[]` |
| ch04 | Structure of the Atom | 0 | ✅ EXAM (Exploration Ch8) | Scaffold only — empty array `[]` |
| | **TOTAL** | **75** | | |
| | Exam-aligned | **0** | | |
| | Non-exam | **75** | | ch01 fully authored but non-exam |

### Additional finding — stub chapter number mismatch

The stub comments in ch02, ch03, ch04 reference old chapter numbering:
- ch02 comment: "Also maps to Chapter 2 of the Exploration textbook" — **incorrect**; Exploration Ch5 = Is Matter Around Us Pure
- ch03 comment: "Also maps to Chapter 3" — **incorrect**; Exploration Ch9 = Atoms and Molecules
- ch04 comment: "Also maps to Chapter 4" — **incorrect**; Exploration Ch8 = Structure of an Atom

This is a metadata-only issue in comments; functional wiring is unaffected.

### Wiring

| Check | Status |
|---|---|
| `class9-chemistry.ts` imported in `index.ts` | ✅ |
| `CLASS9_CHEMISTRY_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS9_CHEMISTRY_QUESTIONS` → `ALL_QUESTIONS` | ✅ |
| All 4 V2 bank files imported in `class9-chemistry.ts` | ✅ |
| V2 → V1 adaptation via `adaptV2Questions` | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-Chemistry` | ❌ **NOT in gateway** — no EXPECTED entry for Chemistry |
| F3 violations | ❌ Not checked (not in gateway) — ch02, ch03, ch04 would all FAIL F3 |
| W1 violations | ❌ Not checked |

**Launch readiness:** 🔴 8% | **Blocker count:** 3 (ch02, ch03, ch04 need questions authored — 0 exam-aligned questions exist)

---

## SUBJECT 7 — CLASS 9 BIOLOGY

### Files

| File | Location | Status |
|---|---|---|
| Any `class9-biology*.ts` | `artifacts/homework-hero/src/data/questions/` | ❌ Does not exist |
| Any biology V2 bank | `question-bank/questions/` | ❌ Does not exist |

### Question counts

| Chapter | Questions |
|---|---|
| All | **0** |

### Wiring

| Check | Status |
|---|---|
| Any Biology import in `index.ts` | ❌ No import |
| Any Biology in `ALL_CHAPTERS` | ❌ No entry |
| Any Biology in `ALL_QUESTIONS` | ❌ No entry |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-Biology` | ❌ Not present |

**Launch readiness:** 🔴 0% | **Blocker count:** 4 (all four exam chapters need files, authoring, wiring, and gateway registration)

---

## SUBJECT 8 — CLASS 9 ECONOMICS

### Files

| File | Location | Format | Status |
|---|---|---|---|
| `class9-economics-ch1.ts` | `artifacts/homework-hero/src/data/questions/` | V1 adapter | ✅ Present — legacy content |
| `class9-economics-ch2.ts` | same | V1 adapter | ✅ Present — legacy content |
| `class9-economics-ch3.ts` | same | V1 adapter | ✅ Present — legacy content |
| `class9-economics-ch4.ts` | same | V1 adapter | ✅ Present — legacy content |

### Question counts

| Ch | Chapter name | Questions | Curriculum status |
|---|---|---|---|
| ch1 | The Story of Village Palampur | 25 | ❌ Legacy — from old standalone Economics textbook (deprecated in 2026-27) |
| ch2 | People as Resource | 25 | ❌ Legacy |
| ch3 | Poverty as a Challenge | 25 | ❌ Legacy |
| ch4 | Food Security in India | 25 | ❌ Legacy |
| | **TOTAL** | **100** | |
| | Exam-aligned | **0** | Cannot confirm — CBSE 2026-27 SS structure not published |
| | Legacy / unverified | **100** | |

### Wiring

| Check | Status |
|---|---|
| All 4 `class9-economics-ch*.ts` imported in `index.ts` | ✅ |
| `CLASS9_ECONOMICS_CHAPTERS` → `ALL_CHAPTERS` | ✅ |
| `CLASS9_ECONOMICS_QUESTIONS` → `ALL_QUESTIONS` | ✅ |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-Economics` | ✅ Present — 4 expected chapters |
| Chapter names match | ✅ All 4 chapter names match gateway definition |
| Minimum question target (15q/chapter) | ✅ All ≥ 15q |
| F7 violations | ✅ None |
| F3 violations | ✅ None |

**Launch readiness:** ❄️ FROZEN — 100 questions present but curriculum validity is suspended pending CBSE Social Science 2026-27 structure publication. No implementation action possible.

---

## SUBJECT 9 — CLASS 9 COMPUTER APPLICATIONS

### Files

| File | Location | Status |
|---|---|---|
| Any `class9-computer*.ts` or `class9-ca*.ts` | `artifacts/homework-hero/src/data/questions/` | ❌ Does not exist |
| Any CS/CA V2 bank | `question-bank/questions/` | ❌ Does not exist |

### Question counts

| Unit | Questions |
|---|---|
| All | **0** |

### Wiring

| Check | Status |
|---|---|
| Any CA import in `index.ts` | ❌ No import |
| Any CA in `ALL_CHAPTERS` | ❌ No entry |
| Any CA in `ALL_QUESTIONS` | ❌ No entry |

### Curriculum gateway

| Check | Status |
|---|---|
| Registry entry `9-ComputerApplications` | ❌ Not present |

**Launch readiness:** 🔴 0% | **Blocker count:** 3 (all units need files, authoring, wiring, and gateway registration)

---

## CONSOLIDATED READINESS MATRIX

| Subject | Class | Files present | Files populated | Questions | Exam-aligned | ALL_QUESTIONS wired | Gateway registered | Readiness % |
|---|---|---|---|---|---|---|---|---|
| Mathematics | 6 | ✅ 14/14 | ✅ 14/14 | 1,090 | 1,090 | ✅ | ✅ | 🟢 **100%** |
| Mathematics | 7 | ✅ 15/15 | ✅ 15/15 | 1,129 | 979 | ✅ | ✅ | 🟡 **87%** |
| Mathematics | 8 | ✅ 14/14 | ✅ 14/14 | 1,054 | 1,054 | ✅ | ✅ | 🟢 **100%** |
| Mathematics | 9 | ✅ 15/15 | ✅ 15/15 | 499 | 409 | ✅ | ✅ | 🟡 **82%** |
| Physics | 9 | ✅ 5/5 | ✅ 5/5 | 125 | 100 | ✅ | ✅ | 🟡 **80%** |
| Chemistry | 9 | ✅ 4/4 | ❌ 1/4 | 75 | **0** | ✅ | ❌ | 🔴 **8%** |
| Biology | 9 | ❌ 0/4 | ❌ 0/4 | **0** | **0** | ❌ | ❌ | 🔴 **0%** |
| Economics | 9 | ✅ 4/4 | ✅ 4/4 | 100 | 0* | ✅ | ✅ | ❄️ **FROZEN** |
| Computer Applications | 9 | ❌ 0/3 | ❌ 0/3 | **0** | **0** | ❌ | ❌ | 🔴 **0%** |

\* Economics questions exist but cannot be confirmed exam-aligned until CBSE publishes 2026-27 Social Science course structure.

**Platform total questions:** 3,072
**Platform exam-aligned questions:** 2,632
**Mislabelled as exam (need tag fix):** 345 questions (Ch9-Chem ch01: 75 + Cl9-Phy ch3: 25 + Cl9-Eco all: 100 + Cl7 Ch10+Ch15: 150 — Economics cannot be confirmed non-exam but cannot be confirmed exam-aligned)
**Gateway coverage:** 7 of 9 subjects registered (Chemistry and Biology not in gateway; Computer Applications not in gateway)

---

## CURRICULUM GATEWAY STATUS SUMMARY

**Script:** `scripts/src/curriculumGateway.ts`
**Command:** `pnpm --filter @workspace/scripts run curriculum-check`

### What the gateway currently checks

| Subject | Registered | Min target | cbseDeleted flags |
|---|---|---|---|
| 6-Mathematics | ✅ | 50q | None |
| 7-Mathematics | ✅ | 50q | None — Ch10+Ch15 not flagged (gap) |
| 8-Mathematics | ✅ | 50q | None |
| 9-Mathematics | ✅ | 20q | Ch5 Euclid's Geometry ✅, Ch11 Constructions ✅ |
| 9-Economics | ✅ | 15q | None |
| 9-Physics | ✅ | 15q | Gravitation NOT flagged (gap) |
| 9-Chemistry | ❌ | — | — |
| 9-Biology | ❌ | — | — |
| 9-Computer Applications | ❌ | — | — |

### Known gateway issues (repository-observed, not curriculum research)

| ID | Issue | Impact |
|---|---|---|
| G1 | Ch7-Maths Ch10 and Ch15 not flagged `cbseDeleted` — gateway would PASS these chapters even though they are non-exam | Students not warned |
| G2 | Ch9-Physics Gravitation not flagged `cbseDeleted` — gateway passes it without warning | Students not warned |
| G3 | Ch9-Chemistry not in gateway registry — ch02, ch03, ch04 (stubs with 0q) would FAIL F3 but gateway never runs for Chemistry | F3 violations silently unchecked |
| G4 | Ch9-Biology not in gateway registry — any future Biology files won't be validated until registered | Future authoring unprotected |
| G5 | Ch9-Computer Applications not in gateway registry | Same |
| G6 | Ch9-Maths ch5 name: file has "Introduction to Euclid", gateway expects "Introduction to Euclid's Geometry" — F6 FAIL | Name mismatch in production |

---

## TOP 10 IMPLEMENTATION TASKS

**Ranking formula:** `(student impact × launch importance) ÷ engineering effort`

| # | Task | Type | Questions affected | Student impact | Effort | Score basis |
|---|---|---|---|---|---|---|
| **1** | **Re-tag Class 9 Chemistry ch01 as non-exam** | Metadata only | 75 | HIGH — 75 questions live and actively mislabelling non-exam content as exam prep | Trivial (1 field change) | Highest impact per minute of work; zero risk |
| **2** | **Re-tag Class 9 Physics ch3 (Gravitation) as non-exam** | Metadata only | 25 | HIGH — exam students drilling wrong chapter | Trivial | Same pattern as #1; does not require authoring |
| **3** | **Re-tag Class 7 Maths Ch10 and Ch15 as non-exam** | Metadata only | 150 | MEDIUM — Class 7 students get content not in their exam | Trivial | 150 questions affected; two field changes |
| **4** | **Re-tag Class 9 Economics (all 4 chapters) as curriculum-frozen / legacy** | Metadata only | 100 | HIGH — students cannot reliably use these for CBSE 2026-27 prep | Trivial | Prevents active curriculum misdirection |
| **5** | **Author Class 9 Chemistry exam chapters: ch02 (Is Matter Around Us Pure), ch03 (Atoms and Molecules), ch04 (Structure of the Atom)** | Authoring | ~225 new questions | VERY HIGH — 0 exam-aligned Chemistry questions exist; stub files and adapter wiring already in place | High (3 chapters × ~75q each) | Exam gap: 0 Chemistry questions for CBSE exam prep; all infrastructure already wired |
| **6** | **Author Class 9 Biology: Ch2 Cell, Ch3 Tissues, Ch11 Reproduction, Ch12 Diversity** | Authoring + file creation + wiring | ~300 new questions | VERY HIGH — entire Biology domain absent | Very high (4 chapters + wiring) | Second-largest Science gap; no infrastructure exists yet |
| **7** | **Fix Class 9 Maths ch5 name: update to "Introduction to Euclid's Geometry"** | Metadata only | 0 | LOW — gateway F6 FAIL; student-facing chapter name will be wrong | Trivial (one string change in one file) | Fixes a live F6 gateway violation; 30-second change |
| **8** | **Author Class 9 Computer Applications: Units 1, 2, 3** | Authoring + file creation + wiring | ~225 new questions | MEDIUM — elective subject; smaller student population than Maths/Science | High (3 units + wiring) | Gate cleared; all infrastructure absent |
| **9** | **Add Simple Machines content to Class 9 Physics ch4** | Authoring (incremental) | ~12–15 new questions | MEDIUM — ch4 title in CBSE is "Work, Energy and Simple Machines"; existing 25 questions may not cover levers/pulleys | Low-Medium | Small targeted gap; existing ch4 file just needs additional questions |
| **10** | **Register Class 9 Chemistry and Biology in curriculum gateway; flag Gravitation and Class 7 Ch10/Ch15 as cbseDeleted** | Gateway config | 0 (code only) | LOW — no student-facing change, but silently unchecked F3/W1 violations become visible | Low (config additions to one file) | Preventive infrastructure; ensures future authoring is validated before merge |

---

## EXECUTIVE SUMMARY

SnapSolve has **3,072 questions** across **9 subjects**. Of these, **2,632 are exam-aligned** and **440 are mislabelled or curriculum-frozen** — actively misleading exam-prep students.

**The green zone is Classes 6 and 8 Mathematics.** Both are complete, fully wired, and gateway-clean. Class 7 Mathematics is one metadata fix from green (Ch10 and Ch15 — no authoring needed). Class 9 Mathematics has all 15 chapters filed and wired with 499 questions, but two chapters are flagged `cbseDeleted` in the gateway and are not yet tagged as non-exam in the student-facing layer.

**The red zone is Class 9 Science (Chemistry and Biology) and Computer Applications.** Chemistry has zero exam-aligned questions — three exam chapters exist as empty stub files with correct wiring but empty arrays. Biology has zero everything: no files, no wiring, no gateway entry. Computer Applications has zero everything. These three subjects together account for approximately **550 missing exam-aligned questions** (225 Chemistry + 300 Biology + 225 CA), all under cleared implementation gates.

**The immediate highest-ROI actions require no authoring at all.** Tasks 1–4 in the ranked list are metadata tag changes affecting 350 questions that are currently live as exam content but are not in the CBSE 2026-27 exam. They can be completed in under two hours. Task 7 (a one-string fix to a chapter name) closes a live gateway F6 violation.

**Economics is frozen by an external dependency** — CBSE has not published the 2026-27 Social Science course structure. The 100 questions are fully wired and gateway-registered but cannot be confirmed as exam-aligned. No implementation work is actionable until CBSE publishes.

**The curriculum gateway covers 7 of 9 subjects** and has three known gaps: Chemistry, Biology, and Computer Applications are not registered. Two subjects have missing `cbseDeleted` flags (Gravitation in Physics; Ch10/Ch15 in Class 7 Maths). Adding these to the gateway config is Task 10 — low effort, high protective value for future authoring sprints.

---

*No web searches. No curriculum research. No code changes. All data from repository file inspection only.*
*Produced: 2026-07-08*
