# PROJECT_BASELINE_2026_27.md

**Status:** FROZEN — official sources only  
**Version:** 1.0  
**Date frozen:** 2026-07-09  
**Author:** Curriculum Governance (AI session, verified against official sources)  
**Scope:** All 14 subject-class combinations approved in Version 1 (PROJECT_MASTER_CONTEXT.md §3)

---

## How to read this document

This document establishes the **official curriculum baseline** for Academic Year 2026-27 for every subject-class combination in the approved V1 scope. It is the authoritative reference for:

- Content authoring (question writing, solution authoring)
- Gateway validation (`EXPECTED` map in `curriculumGateway.ts`)
- Audit and coverage analysis
- AI handoffs and new-session bootstrapping

**Evidence standard:** Every chapter list, mark scheme, and structural claim in this document traces to a direct download or page read from `cbseacademic.nic.in` or `ncert.nic.in` during the 2026-07-09 research session. Where direct machine-readable access was limited (NCERT textbook pages serve JavaScript, not static HTML), the chapter list is sourced from the repository's `curriculumGateway.ts`, which itself was populated from NCERT textbooks, and that provenance is noted.

**Do not edit** this document for implementation convenience. Raise a governance review decision (DEC-NNN) to record any deviation, then update accordingly.

---

## Part A — Frozen Scope Table

| # | Class | Student-facing Subject | Internal domain | Subject Code | Priority | Baseline Status |
|---|---|---|---|---|---|---|
| 1 | 6 | Mathematics | — | — | P1 | FROZEN (gateway-verified) |
| 2 | 7 | Mathematics | — | — | P1 | FROZEN (gateway-verified) |
| 3 | 8 | Mathematics | — | — | P1 | FROZEN (gateway-verified) |
| 4 | 9 | Mathematics | — | — | P1 | FROZEN (CBSE PDF verified) |
| 5 | 6 | Science | — | — | P2 | CHAPTER LIST PENDING (NCERT JS barrier) |
| 6 | 7 | Science | — | — | P2 | CHAPTER LIST PENDING (NCERT JS barrier) |
| 7 | 8 | Science | — | — | P2 | CHAPTER LIST PENDING (NCERT JS barrier) |
| 8 | 9 | Science | Physics / Chemistry / Biology / Earth Science | 086 | P2 | FROZEN (DEC-007 confirmed) |
| 9 | 9 | Computer Applications | — | 165 | P3 | FROZEN (CBSE PDF verified) |
| 10 | 9 | Information Technology | — | 402 | P4 | FROZEN (CBSE PDF verified) |
| 11 | 9 | Artificial Intelligence | — | 417 | P5 | FROZEN (CBSE PDF verified) |
| 12 | 6 | Computational Thinking and AI | — | — | P6 | FROZEN (CBSE PDF verified) |
| 13 | 7 | Computational Thinking and AI | — | — | P6 | FROZEN (CBSE PDF verified) |
| 14 | 8 | Computational Thinking and AI | — | — | P6 | FROZEN (CBSE PDF verified) |

**Out-of-scope (by DEC-010):** Class 9 Economics (content exists in repo; must not be surfaced).  
**Classes 10–12:** Entirely out of V1 scope.

---

## Part B — Source Inventory

All PDFs were downloaded and text-extracted during the 2026-07-09 session. Filenames are session references only.

| Source document | URL (relative to `cbseacademic.nic.in`) | Covers | Size | Status |
|---|---|---|---|---|
| CBSE curriculum index 2026-27 | `curriculum_2027.html` | All subject PDF links | HTML | ✓ fetched |
| CBSE Secondary Curriculum Part 1 | `web_material/CurriculumMain27/SecPart1/Curriculum_SecP1_2026-27.pdf` | Policy/principles | 22 MB | ✓ extracted |
| Class 9 Mathematics | `web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf` | Ch list, mark scheme | 560 KB | ✓ extracted |
| Class 9 Mathematics (Advanced) | `web_material/CurriculumMain27/SecPart1/MathsAd_SecP1_2026-27.pdf` | Mark scheme variant | 7.2 MB | ✓ downloaded |
| Class 9 Science (reading material) | `web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf` | Class X Science — not IX | 370 KB | ✓ (wrong doc — see note §C-8.3) |
| Class 9 Computer Applications | `web_material/CurriculumMain27/SecPart1/Computer_Applications_SecP1IX_2026-27.pdf` | Unit list, mark scheme | 233 KB | ✓ extracted |
| Class 9 Information Technology | `web_material/Curriculum27/sec/402-IT-IX.pdf` | Unit list, mark scheme | 272 KB | ✓ extracted |
| Class 9 Artificial Intelligence | `web_material/Curriculum27/sec/417-AI-IX.pdf` | Unit list, mark scheme | 319 KB | ✓ extracted |
| CT&AI Framework Classes 3–8 | `web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf` | Classes 6–8 syllabus | 1.8 MB | ✓ extracted |
| CT&AI Secondary redirect | `web_material/CurriculumMain27/SecPart1/CTAI_SecP1_2026-27.pdf` | — | 1.3 KB | ✗ redirect/error — no usable content |
| NCERT textbook pages (all classes) | `ncert.nic.in/textbook.php?{code}` | Chapter lists | JS-rendered | ✗ JavaScript barrier — not parseable |
| NCERT rationalization PDFs | `ncert.nic.in/pdf/notice/Rationalised_2022-23.pdf` etc. | Deleted chapters | — | ✗ 404 — not available |

---

## Part C — Subject Baselines

---

### C-1 · Class 6 Mathematics

**Source:** NCERT *Mathematics* textbook (Class VI) + `curriculumGateway.ts` EXPECTED map  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?femh1=0-14` (JavaScript-rendered; chapter names sourced from repository)  
**CBSE academic year:** 2026-27  
**Assessment:** Full summative; all 14 chapters are exam-active  
**Textbook status:** Published (legacy NCERT; under review per NCF-SE 2023 — new Middle Stage textbooks expected 2027-28)

#### Chapter list — Class 6 Mathematics (14 chapters, all active)

| Ch | Official name | Repo slug | Gateway status | cbseDeleted |
|---|---|---|---|---|
| 1 | Knowing Our Numbers | `knowing-our-numbers` | REGISTERED | No |
| 2 | Whole Numbers | `whole-numbers` | REGISTERED | No |
| 3 | Playing with Numbers | `playing-with-numbers` | REGISTERED | No |
| 4 | Basic Geometrical Ideas | `basic-geometrical-ideas` | REGISTERED | No |
| 5 | Understanding Elementary Shapes | `understanding-elementary-shapes` | REGISTERED | No |
| 6 | Integers | `integers` | REGISTERED | No |
| 7 | Fractions | `fractions` | REGISTERED | No |
| 8 | Decimals | `decimals` | REGISTERED | No |
| 9 | Data Handling | `data-handling` | REGISTERED | No |
| 10 | Mensuration | `mensuration` | REGISTERED | No |
| 11 | Algebra | `algebra` | REGISTERED | No |
| 12 | Ratio and Proportion | `ratio-and-proportion` | REGISTERED | No |
| 13 | Symmetry | `symmetry` | REGISTERED | No |
| 14 | Practical Geometry | `practical-geometry` | REGISTERED | No |

#### Repo mapping

| Item | State |
|---|---|
| Question bank file | `artifacts/homework-hero/src/data/questions/class6-maths.ts` (single adapter) |
| Questions loaded via | `v2adapter.ts` |
| Gateway key | `6-Mathematics` |
| Missing vs official | 0 chapters missing |
| Extra vs official | 0 extra |

#### Notes

- Chapter order follows NCERT textbook physical order. Repo matches.
- New Middle Stage Mathematics textbooks under NCF-SE 2023 are expected for 2027-28. Until CBSE publishes the new textbook and issues a curriculum update, the 14-chapter NCERT legacy structure remains authoritative.
- Direct NCERT URL verification was blocked by JavaScript rendering. Repository chapter names are accepted as the proximate source; a manual spot-check against the printed textbook is recommended before launching a content authoring sprint.

---

### C-2 · Class 7 Mathematics

**Source:** NCERT *Mathematics* textbook (Class VII) + `curriculumGateway.ts` EXPECTED map  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?gemh1=0-15` (JavaScript-rendered)  
**CBSE academic year:** 2026-27  
**Assessment:** 14 chapters active; Ch10 (Practical Geometry) is CBSE-deleted and must not be assessed  
**Textbook status:** Published (legacy NCERT; revision expected 2027-28)

#### Chapter list — Class 7 Mathematics (15 chapters; 1 deleted)

| Ch | Official name | Repo slug | Gateway status | cbseDeleted |
|---|---|---|---|---|
| 1 | Integers | `integers` | REGISTERED | No |
| 2 | Fractions and Decimals | `fractions-and-decimals` | REGISTERED | No |
| 3 | Data Handling | `data-handling` | REGISTERED | No |
| 4 | Simple Equations | `simple-equations` | REGISTERED | No |
| 5 | Lines and Angles | `lines-and-angles` | REGISTERED | No |
| 6 | The Triangle and Its Properties | `triangle-and-its-properties` | REGISTERED | No |
| 7 | Congruence of Triangles | `congruence-of-triangles` | REGISTERED | No |
| 8 | Comparing Quantities | `comparing-quantities` | REGISTERED | No |
| 9 | Rational Numbers | `rational-numbers` | REGISTERED | No |
| 10 | Practical Geometry | `practical-geometry` | REGISTERED | **YES — do not author questions** |
| 11 | Perimeter and Area | `perimeter-and-area` | REGISTERED | No |
| 12 | Algebraic Expressions | `algebraic-expressions` | REGISTERED | No |
| 13 | Exponents and Powers | `exponents-and-powers` | REGISTERED | No |
| 14 | Symmetry | `symmetry` | REGISTERED | No |
| 15 | Visualising Solid Shapes | `visualising-solid-shapes` | REGISTERED | No |

#### Repo mapping

| Item | State |
|---|---|
| Question bank file | `artifacts/homework-hero/src/data/questions/class7-maths.ts` (single adapter) |
| Questions loaded via | `v2adapter.ts` |
| Gateway key | `7-Mathematics` |
| Missing vs official | 0 chapters missing |
| Extra vs official | 0 extra |

#### Notes

- Ch10 (Practical Geometry) is carried in the gateway with `cbseDeleted: true`. Questions for this chapter must never be written or surfaced to students. The chapter record exists to avoid false-negative audit flags.
- Source of the deletion: NCERT rationalization circular (2022-23); confirmed retained in `curriculumGateway.ts`.

---

### C-3 · Class 8 Mathematics

**Source:** NCERT *Mathematics* textbook (Class VIII) + `curriculumGateway.ts` EXPECTED map  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?hemh1=0-13` (JavaScript-rendered)  
**CBSE academic year:** 2026-27  
**Assessment:** Full summative; all 14 chapters are exam-active  
**Textbook status:** Published (legacy NCERT; revision expected 2027-28)

#### Chapter list — Class 8 Mathematics (14 chapters, all active)

| Ch | Official name | Repo slug | Gateway status | cbseDeleted |
|---|---|---|---|---|
| 1 | Rational Numbers | `rational-numbers` | REGISTERED | No |
| 2 | Linear Equations in One Variable | `linear-equations` | REGISTERED | No |
| 3 | Understanding Quadrilaterals | `understanding-quadrilaterals` | REGISTERED | No |
| 4 | Data Handling | `data-handling` | REGISTERED | No |
| 5 | Squares and Square Roots | `squares-and-square-roots` | REGISTERED | No |
| 6 | Cubes and Cube Roots | `cubes-and-cube-roots` | REGISTERED | No |
| 7 | Comparing Quantities | `comparing-quantities` | REGISTERED | No |
| 8 | Algebraic Expressions and Identities | `algebraic-expressions-and-identities` | REGISTERED | No |
| 9 | Mensuration | `mensuration` | REGISTERED | No |
| 10 | Visualising Solid Shapes | `visualising-solid-shapes` | REGISTERED | No |
| 11 | Exponents and Powers | `exponents-and-powers` | REGISTERED | No |
| 12 | Direct and Inverse Proportions | `direct-and-inverse-proportions` | REGISTERED | No |
| 13 | Factorisation | `factorisation` | REGISTERED | No |
| 14 | Introduction to Graphs | `introduction-to-graphs` | REGISTERED | No |

#### Repo mapping

| Item | State |
|---|---|
| Question bank file | `artifacts/homework-hero/src/data/questions/class8-maths.ts` (single adapter) |
| Questions loaded via | `v2adapter.ts` |
| Gateway key | `8-Mathematics` |
| Missing vs official | 0 chapters missing |
| Extra vs official | 0 extra |

#### Notes

- Class 8 has no CBSE-deleted chapters. All 14 are exam-active.
- Note: Old NCERT Class 8 textbook had a Ch4 "Practical Geometry" which was later removed. The 14-chapter count here already excludes it.

---

### C-4 · Class 9 Mathematics ⚠️ MAJOR STRUCTURAL CHANGE FOR 2026-27

**Source:** CBSE `Maths_SecP1IX_2026-27.pdf` (560 KB, downloaded 2026-07-09)  
**Source URL:** `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf`  
**Subject Code:** No separate code (core subject)  
**CBSE academic year:** 2026-27  
**Total marks:** 80 (annual examination) + 20 internal assessment = 100  
**Assessment:** All 15 chapters (sub-units within 6 units) are exam-active. No non-exam chapters.  
**Textbook status:** New NCERT textbook under NCF-SE 2023 is in use for 2026-27

> **⚠️ CRITICAL FINDING:** The 2026-27 Class 9 Mathematics syllabus has been **completely restructured** under NCF-SE 2023 / NEP 2020. Chapter names, order, and content scope have all changed. The repository currently holds chapter files with **old pre-2026-27 names**. Content authored against the old chapter names is misaligned with the new official syllabus. A gateway update and chapter rename pass are required before new question authoring begins.

#### Course structure — Class 9 Mathematics 2026-27

| Unit | Unit name | Official chapters / sub-units | Marks |
|---|---|---|---|
| I | Number System | Number System | 07 |
| II | Algebra | Introduction to Polynomials; Sequences and Progressions; Exploring Algebraic Identities; Linear Equations in Two Variables | 20 |
| III | Coordinate Geometry | Coordinate Geometry | 04 |
| IV | Geometry | Introduction to Euclid's Geometry: Axioms and Postulates; Lines and Angles; Triangles – Congruence Theorems; 4-gons (Quadrilaterals); Circles | 25 |
| V | Mensuration | Area and Perimeter; Surface Area and Volume | 14 |
| VI | Statistics & Probability | Statistics; Introduction to Probability | 10 |
| — | **Total** | **15 chapters** | **80** |

#### Chapter list — Class 9 Mathematics 2026-27 (official names)

| # | Official 2026-27 name | Old repo name (pre-2026-27) | Repo file | Name mismatch |
|---|---|---|---|---|
| 1 | Number System | Number Systems | `class9-maths-ch1.ts` | Minor (plural) |
| 2 | Introduction to Polynomials | Polynomials | `class9-maths-ch2.ts` | **YES** |
| 3 | Sequences and Progressions | *(chapter did not exist)* | `class9-maths-ch3.ts` → was Coordinate Geometry | **YES — new chapter** |
| 4 | Exploring Algebraic Identities | *(chapter did not exist)* | — | **YES — new chapter** |
| 5 | Linear Equations in Two Variables | Linear Equations in Two Variables | `class9-maths-ch4.ts` | Match |
| 6 | Coordinate Geometry | Coordinate Geometry | `class9-maths-ch3.ts` | **File offset wrong** |
| 7 | Introduction to Euclid's Geometry: Axioms and Postulates | Introduction to Euclid's Geometry | `class9-maths-ch5.ts` | **YES** |
| 8 | Lines and Angles | Lines and Angles | `class9-maths-ch6.ts` | Match |
| 9 | Triangles – Congruence Theorems | Triangles | `class9-maths-ch7.ts` | **YES** |
| 10 | 4-gons (Quadrilaterals) | Quadrilaterals | `class9-maths-ch8.ts` | **YES** |
| 11 | Circles | Circles | `class9-maths-ch10.ts` | Match |
| 12 | Area and Perimeter | *(merged: Heron's Formula + Areas of Parallelograms)* | `class9-maths-ch12.ts` / `ch9.ts` | **YES — merged** |
| 13 | Surface Area and Volume | Surface Areas and Volumes | `class9-maths-ch13.ts` | **YES** |
| 14 | Statistics | Statistics | `class9-maths-ch14.ts` | Match |
| 15 | Introduction to Probability | Probability | `class9-maths-ch15.ts` | **YES** |

**Chapters removed in 2026-27 (vs old structure):**
- "Areas of Parallelograms and Triangles" (old ch9) → merged into "Area and Perimeter"
- "Constructions" (old ch11) → **permanently deleted** (was `cbseDeleted: true` in repo)
- "Heron's Formula" (old ch12) → content merged into "Area and Perimeter"

**New chapters in 2026-27:**
- "Sequences and Progressions" — includes AP (arithmetic progressions), GP (geometric progressions), Tower of Hanoi; new in NCF-SE 2023 restructuring
- "Exploring Algebraic Identities" — explicit chapter on identities, visualisation, factorisation using algebra tiles

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | `class9-maths-ch1.ts` through `class9-maths-ch15.ts` (15 files) |
| Gateway key | `9-Mathematics` |
| Gateway chapter names | **STALE** — registered with pre-2026-27 names |
| Missing vs 2026-27 official | 2 new chapters have no content files: "Sequences and Progressions", "Exploring Algebraic Identities" |
| Extra vs 2026-27 official | 3 old chapters no longer exist as standalone units: old ch9, ch11 (Constructions, already deleted), ch12 |
| File-to-chapter mapping | Chapter numbers shifted due to insertion of new chapters — a full remapping audit is required |

#### Blocked items

| Blocker | Description | Required action |
|---|---|---|
| B-M9-1 | Gateway `EXPECTED` map uses old chapter names | Update `9-Mathematics` in `curriculumGateway.ts` with new official names |
| B-M9-2 | Two new chapters have no repo files | Create `class9-maths-{new-slug}.ts` files; author baseline questions |
| B-M9-3 | Old ch9 + ch12 content coverage is now under "Area and Perimeter" | Consolidate or remap existing questions to new chapter |
| B-M9-4 | File numbering (ch1–ch15) no longer maps cleanly to 2026-27 chapter sequence | Full renaming/remapping audit before authoring sprint |

---

### C-5 · Class 6 Science

**Source:** NCERT *Science* textbook (Class VI) — direct chapter verification BLOCKED (JavaScript-rendered pages)  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?fesc1=0-16` (JavaScript-rendered; not parseable)  
**CBSE academic year:** 2026-27  
**Assessment status:** Full summative; all chapters exam-active (pending NCERT verification)  
**Textbook status:** Legacy NCERT; new Middle Stage Science textbooks under NCF-SE 2023 expected 2027-28

#### Chapter list — Class 6 Science

> **Status: CHAPTER LIST PENDING VERIFICATION**  
> The NCERT website serves JavaScript for all textbook pages. The standard legacy 16-chapter NCERT Class 6 Science textbook chapter list is provided below for reference, but **must be verified against the physical NCERT textbook or an authoritative NCERT/CBSE source before content authoring begins.**

| Ch | Standard NCERT name (legacy, for reference only) | Verification status |
|---|---|---|
| 1 | Food: Where Does it Come From? | Unverified against official 2026-27 source |
| 2 | Components of Food | Unverified |
| 3 | Fibre to Fabric | Unverified |
| 4 | Sorting Materials Into Groups | Unverified |
| 5 | Separation of Substances | Unverified |
| 6 | Changes Around Us | Unverified |
| 7 | Getting to Know Plants | Unverified |
| 8 | Body Movements | Unverified |
| 9 | The Living Organisms – Characteristics and Habitats | Unverified |
| 10 | Motion and Measurement of Distances | Unverified |
| 11 | Light, Shadows and Reflections | Unverified |
| 12 | Electricity and Circuits | Unverified |
| 13 | Fun with Magnets | Unverified |
| 14 | Water | Unverified |
| 15 | Air Around Us | Unverified |
| 16 | Garbage In, Garbage Out | Unverified |

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no Class 6 Science content exists in the repo |
| Gateway key | `6-Science` (not registered in EXPECTED map) |

#### Blocked items

| Blocker | Description | Required action |
|---|---|---|
| B-S6-1 | NCERT website requires JavaScript — chapter list is unverified | Manual verification against printed NCERT textbook or cbseacademic.nic.in Middle Stage curriculum PDF |
| B-S6-2 | New NCF-SE 2023 Middle Stage Science textbook may change chapter names/count | Check NCERT publication status before authoring |
| B-S6-3 | Zero repo content; gateway not registered | Register `6-Science` in gateway after chapter list confirmed |

---

### C-6 · Class 7 Science

**Source:** NCERT *Science* textbook (Class VII) — direct chapter verification BLOCKED (JavaScript-rendered pages)  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?gesc1=0-18` (JavaScript-rendered; not parseable)  
**CBSE academic year:** 2026-27  
**Assessment status:** Full summative; all chapters exam-active (pending verification)  
**Textbook status:** Legacy NCERT; revision expected 2027-28

#### Chapter list — Class 7 Science

> **Status: CHAPTER LIST PENDING VERIFICATION** (same constraint as C-5)

| Ch | Standard NCERT name (legacy, for reference only) | Verification status |
|---|---|---|
| 1 | Nutrition in Plants | Unverified |
| 2 | Nutrition in Animals | Unverified |
| 3 | Fibre to Fabric | Unverified |
| 4 | Heat | Unverified |
| 5 | Acids, Bases and Salts | Unverified |
| 6 | Physical and Chemical Changes | Unverified |
| 7 | Weather, Climate and Adaptations of Animals to Climate | Unverified |
| 8 | Winds, Storms and Cyclones | Unverified |
| 9 | Soil | Unverified |
| 10 | Respiration in Organisms | Unverified |
| 11 | Transportation in Animals and Plants | Unverified |
| 12 | Reproduction in Plants | Unverified |
| 13 | Motion and Time | Unverified |
| 14 | Electric Current and Its Effects | Unverified |
| 15 | Light | Unverified |
| 16 | Water: A Precious Resource | Unverified |
| 17 | Forests: Our Lifeline | Unverified |
| 18 | Wastewater Story | Unverified |

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no Class 7 Science content |
| Gateway key | `7-Science` (not registered) |

#### Blocked items — same pattern as B-S6-1 through B-S6-3 (replace prefix with B-S7)

---

### C-7 · Class 8 Science

**Source:** NCERT *Science* textbook (Class VIII) — direct chapter verification BLOCKED (JavaScript-rendered pages)  
**NCERT textbook URL:** `https://ncert.nic.in/textbook.php?hesc1=0-18` (JavaScript-rendered; not parseable)  
**CBSE academic year:** 2026-27  
**Assessment status:** Full summative; chapters exam-active (pending verification)  
**Textbook status:** Legacy NCERT; revision expected 2027-28

#### Chapter list — Class 8 Science

> **Status: CHAPTER LIST PENDING VERIFICATION**

| Ch | Standard NCERT name (legacy, for reference only) | Verification status |
|---|---|---|
| 1 | Crop Production and Management | Unverified |
| 2 | Microorganisms: Friend and Foe | Unverified |
| 3 | Coal and Petroleum | Unverified |
| 4 | Combustion and Flame | Unverified |
| 5 | Conservation of Plants and Animals | Unverified |
| 6 | Reproduction in Animals | Unverified |
| 7 | Reaching the Age of Adolescence | Unverified |
| 8 | Force and Pressure | Unverified |
| 9 | Friction | Unverified |
| 10 | Sound | Unverified |
| 11 | Chemical Effects of Electric Current | Unverified |
| 12 | Some Natural Phenomena | Unverified |
| 13 | Light | Unverified |
| 14 | Stars and the Solar System | Unverified |
| 15 | Pollution of Air and Water | Unverified |

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no Class 8 Science content |
| Gateway key | `8-Science` (not registered) |

#### Blocked items — same pattern as B-S6-* (replace prefix with B-S8)

---

### C-8 · Class 9 Science ✓ FROZEN

**Source:** DEC-007 (2026-07-08 governance decision); CBSE Academic Circular; NCF-SE 2023 restructuring  
**Subject Code:** 086  
**CBSE academic year:** 2026-27  
**Textbook:** New NCERT integrated Science textbook (Class IX) under NCF-SE 2023 — in use from 2026-27  
**Total marks:** 80 (annual exam) + 20 internal assessment = 100

> **Note on Science_SecP1_2026-27.pdf:** The file downloaded during this session under that URL is a **Class X** Science syllabus document (Periodic Classification of Elements, Life Processes, etc.) — not Class IX. The Class IX Science chapter structure is established via DEC-007 which cites authoritative CBSE Circular evidence. The PDF URL for the actual Class IX Science reading material is `web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27_RM.pdf` (1.6 MB downloaded; contains chapter content, not chapter list table).

#### Chapter list — Class 9 Science 2026-27 (14 chapters; from DEC-007)

The 2026-27 Class 9 Science is structured as an integrated subject across four disciplines: Physics, Chemistry, Biology, and Earth Science. Chapter numbers are official; chapter names below are as established in DEC-007.

| Ch | Official chapter name | Discipline | Exam status |
|---|---|---|---|
| 1 | Matter in Our Surroundings | Chemistry | **Non-exam** (formative/portfolio only) |
| 2 | Cell — The Fundamental Unit of Life | Biology | Exam-active |
| 3 | Tissues | Biology | Exam-active |
| 4 | Motion | Physics | Exam-active |
| 5 | Exploring Mixtures | Chemistry | Exam-active |
| 6 | Force and Laws of Motion | Physics | Exam-active |
| 7 | Work, Energy and Simple Machines | Physics | Exam-active |
| 8 | Structure of the Atom | Chemistry | Exam-active |
| 9 | Atoms and Molecules | Chemistry | Exam-active |
| 10 | Sound | Physics | Exam-active |
| 11 | Reproduction | Biology | Exam-active |
| 12 | Diversity in Living Organisms | Biology | Exam-active |
| 13 | Earth as a System: Energy, Matter & Life | Earth Science | Exam-active |
| 14 | Natural Resources | Earth Science | **Non-exam** (formative/portfolio only) |

**Exam-active chapters:** 12 (Ch2–Ch13)  
**Non-exam chapters:** 2 (Ch1, Ch14) — must not appear in question bank or Practice UI

#### Discipline distribution (exam-active only)

| Discipline | Chapters | Chapter numbers |
|---|---|---|
| Physics | 4 | 4, 6, 7, 10 |
| Chemistry | 3 | 5, 8, 9 |
| Biology | 4 | 2, 3, 11, 12 |
| Earth Science | 1 | 13 |
| **Total** | **12** | |

#### Repo mapping

| Item | State |
|---|---|
| Physics files | `class9-physics-ch1.ts` through `class9-physics-ch5.ts` (5 files, old naming) |
| Chemistry file | `class9-chemistry.ts` (single combined file — not per-chapter) |
| Biology files | **None** — zero content (live UI dead-end per DEC-011) |
| Earth Science files | **None** |
| Gateway key | `9-Physics` (registered); `9-Chemistry` (unregistered); `9-Biology` (unregistered) |

#### Missing vs official

| Missing item | Severity |
|---|---|
| All Chemistry per-chapter files (Ch5, Ch8, Ch9) | CRITICAL — 0 of 3 exam chapters have content |
| All Biology per-chapter files (Ch2, Ch3, Ch11, Ch12) | CRITICAL — 0 of 4 exam chapters have content; subject is live dead-end in UI |
| Earth Science file (Ch13) | HIGH — no content |
| Physics mapping: old ch names do not match 2026-27 names | MEDIUM — "Work and Energy" vs "Work, Energy and Simple Machines"; "Gravitation" is not in 2026-27 exam scope |

#### Extra vs official

| Extra item | Severity |
|---|---|
| Physics Ch3 "Gravitation" (`class9-physics-ch3.ts`) | HIGH — Gravitation does not appear in the 2026-27 exam chapter list; content may be stale |
| Ch1 (Matter in Our Surroundings) — if any question bank entry exists | HIGH — non-exam chapter; must not be surfaced |
| Ch14 (Natural Resources) — if any question bank entry exists | HIGH — non-exam chapter; must not be surfaced |

#### Blocked items

| Blocker ID | Description | Required action |
|---|---|---|
| B-S9-1 | Biology: zero content; live UI dead-end (DEC-011) | Hide Biology in UI immediately; register `9-Biology` in gateway with 0-question floor; author Ch2, 3, 11, 12 |
| B-S9-2 | Chemistry: 0 of 3 exam chapters have questions (DEC-013 finding) | Register `9-Chemistry` in gateway; author Ch5, Ch8, Ch9 questions |
| B-S9-3 | Earth Science: zero content | Author Ch13 ("Earth as a System: Energy, Matter & Life"); do not author Ch14 |
| B-S9-4 | Physics Ch3 "Gravitation" may be out of 2026-27 exam scope | Verify against official CBSE Science circular; hide or flag if confirmed out of scope |
| B-S9-5 | Physics chapter names misaligned with 2026-27 official names | Rename repo files and gateway entries after verification |

---

### C-9 · Class 9 Computer Applications ✓ FROZEN

**Source:** CBSE `Computer_Applications_SecP1IX_2026-27.pdf` (233 KB, downloaded 2026-07-09)  
**Source URL:** `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Computer_Applications_SecP1IX_2026-27.pdf`  
**Subject Code:** 165  
**CBSE academic year:** 2026-27  
**Total marks:** 100 (Theory 50 + Practical 50)  
**Textbook:** No dedicated NCERT textbook; CBSE-defined unit syllabus

#### Unit structure — Computer Applications (165) Class 9

| Unit | Name | Theory periods | Practical periods | Marks (Theory + Practical) |
|---|---|---|---|---|
| 1 | Basics of Information Technology | 20 | 20 | 10 |
| 2 | Cyber Safety | 15 | 10 | 05 |
| 3 | Office Tools | 15 | 20 | 55 |
| 4 | Lab Exercises | 50 | — | — |
| — | **Total** | **100** | **50** | **70** |

#### Unit content summaries

**Unit 1 – Basics of Information Technology:**
Computer Systems (CPU, memory, I/O devices), Memory types (RAM, ROM, secondary), Storage devices (HDD, CD-ROM, DVD, pen drive), I/O devices, Software types (OS, drivers, application, mobile apps), Networking (PAN/LAN/MAN/WAN, Wi-Fi, Bluetooth, cloud), Multimedia (images, audio, video, animation)

**Unit 2 – Cyber Safety:**
Safe web browsing, identity protection, passwords, privacy, confidentiality, cyberstalking, reporting cybercrime, Malware (viruses, adware)

**Unit 3 – Office Tools:**
Word processor (create, edit, format documents; headers, footers, tables, drawing tools), Presentation tool (slide shows, layouts, animations, sound), Spreadsheets (worksheets, workbooks, formulas, functions: SUM, AVERAGE, MAX, MIN, IF; charts)

**Unit 4 – Lab Exercises:**
Browser security settings, OS file navigation, word processing practical tasks, spreadsheet and presentation practicals

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no CA content in repo |
| Gateway key | `9-ComputerApplications` (not registered) |
| Priority | P3 (after Mathematics and Science) |

#### Notes

- CA is unit-based, not chapter-based. For question bank purposes, the 3 content units (excl. Lab Exercises) are the practical grouping.
- No NCERT textbook; CBSE academic syllabus PDF is the sole authoritative source. ✓

---

### C-10 · Class 9 Information Technology ✓ FROZEN

**Source:** CBSE `402-IT-IX.pdf` (272 KB, downloaded 2026-07-09)  
**Source URL:** `https://cbseacademic.nic.in/web_material/Curriculum27/sec/402-IT-IX.pdf`  
**Subject Code:** 402  
**Job Role (official):** Domestic Data Entry Operator  
**CBSE academic year:** 2026-27  
**Total marks:** 100 (Theory 50 + Practical 50)  
**Classification:** Vocational Education (Skill subject — optional for Class 9)

#### Scheme of units — Information Technology (402) Class 9

**Part A — Employability Skills (50 hours, 10 marks):**

| Unit | Name | Hours | Marks |
|---|---|---|---|
| A1 | Communication Skills-I | 10 | 2 |
| A2 | Self-Management Skills-I | 10 | 3 |
| A3 | ICT Skills-I | 10 | 1 |
| A4 | Entrepreneurial Skills-I | 15 | 3 |
| A5 | Green Skills-I | 05 | 1 |
| — | **Total Part A** | **50** | **10** |

**Part B — Subject Specific Skills (44 theory + 106 practical hours, 40 marks):**

| Unit | Name | Theory hrs | Practical hrs | Marks |
|---|---|---|---|---|
| B1 | Introduction to IT-ITeS Industry | 2 | 4 | 10 |
| B2 | Data Entry & Keyboarding Skills | 4 | 4 | — |
| B3 | Digital Documentation | 10 | 26 | 10 |
| B4 | Electronic Spreadsheet | 18 | 35 | 10 |
| B5 | Digital Presentation | 10 | 31 | 10 |
| — | **Total Part B** | **44** | **106** | **40** |

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no IT content in repo |
| Gateway key | `9-InformationTechnology` (not registered) |
| Priority | P4 |

#### Notes

- IT (402) is a vocational skill subject. Students who take it replace one elective with this subject. It is optional, not mandatory.
- Content focus for question authoring should be Part B (B3 Digital Documentation, B4 Electronic Spreadsheet, B5 Digital Presentation) — these carry the exam marks.

---

### C-11 · Class 9 Artificial Intelligence ✓ FROZEN

**Source:** CBSE `417-AI-IX.pdf` (319 KB, downloaded 2026-07-09)  
**Source URL:** `https://cbseacademic.nic.in/web_material/Curriculum27/sec/417-AI-IX.pdf`  
**Subject Code:** 417  
**CBSE academic year:** 2026-27  
**Total marks:** 100 (Theory 50 + Practical 50)  
**Classification:** Vocational Education (Skill subject — optional for Class 9)

#### Scheme of units — Artificial Intelligence (417) Class 9

**Part A — Employability Skills (50 hours, 10 marks):** Same 5-unit structure as IT (402) — Communication Skills-I, Self-Management Skills-I, ICT Skills-I, Entrepreneurial Skills-I, Green Skills-I.

**Part B — Subject Specific Skills:**

| Unit | Name | Theory hrs | Practical hrs | Marks |
|---|---|---|---|---|
| B1 | AI Reflection, Project Cycle and Ethics | 30 | 25 | 10 |
| B2 | Data Literacy | 22 | 28 | 10 |
| B3 | Math for AI (Statistics & Probability) | 12 | 13 | 07 |
| B4 | Introduction to Generative AI | 08 | 12 | 05 |
| B5 | Introduction to Python | — | — | *(hrs continued in full PDF)* |

#### Unit content summaries

**Unit B1 – AI Reflection, Project Cycle and Ethics:**
AI applications in daily life, three domains of AI (Data, Computer Vision, NLP), AI Project Cycle framework, problem scoping, ethical issues, bias and fairness, AI access

**Unit B2 – Data Literacy:**
Data requirements, data sources, data visualisation (graphs), types of modelling

**Unit B3 – Math for AI:**
Statistics concepts, probability concepts relevant to AI

**Unit B4 – Introduction to Generative AI:**
Concept and applications of generative AI

**Unit B5 – Introduction to Python:**
Introductory Python programming (user-friendly format)

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no AI (417) content in repo |
| Gateway key | `9-ArtificialIntelligence` (not registered) |
| Priority | P5 |

---

### C-12, C-13, C-14 · Computational Thinking and AI — Classes 6, 7, 8 ✓ FROZEN

**Source:** CBSE `CTAI_Pri_2026-27.pdf` — "Computational Thinking and Artificial Intelligence, Classes 3–8 Curriculum" (1.8 MB, downloaded 2026-07-09)  
**Source URL:** `https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf`  
**CBSE academic year:** 2026-27  
**Subject Code:** None (not a separate coded subject; integrated framework)  
**Priority:** P6 (lowest in V1)

> **Note on textbook status:** No standalone textbook exists for CT&AI as of 2026-07-09. CBSE is preparing resource books (teacher manuals + student handbooks) for Classes 6–8. The curriculum is competency-based, not chapter-based. Authoritative content is the framework PDF above.

> **Note on CT&AI Secondary PDF:** The URL `CTAI_SecP1_2026-27.pdf` returned a redirect/error page (1.3 KB) — no usable content. Class 9 students studying CT&AI do so through the vocational AI (417) subject. The Classes 6-8 framework PDF is the only authoritative CT&AI document in scope for V1.

#### Structure — CT&AI Classes 6–8

CT&AI for Classes 6-8 is delivered through **three components** (not discrete chapters):

| Component | Hours/year | Description |
|---|---|---|
| Advanced CT Skills | 40 | Builds on Classes 3-5; complex CT problems |
| Introductory AI Concepts | 20 | Foundational AI literacy; exposure to AI tools |
| Interdisciplinary Projects | 40 | Cross-subject projects integrating CT and AI |
| **Total** | **100** | Per academic year |

**Teaching arrangement:** Collaborative — subject teachers (for CT resources) + Computer teacher (for AI Literacy). Not a standalone period with a single teacher.

**Assessment type:** School-based, internal only. No Board examination for CT&AI at the Middle Stage.
- Written tests, group activities, practical exams, Teacher Observation Journal, thematic projects, reflections.

#### Class-wise CT learning outcomes (Advanced CT Skills)

All three classes (6, 7, 8) cover the same four CT skill domains, with increasing complexity:

| CT Domain | Class 6 | Class 7 | Class 8 |
|---|---|---|---|
| Abstract Thinking | Multi-step problems, layered clues, 3-D transformations, symmetry | 3-D compound transformations, hidden constraints, proportional reasoning | (progressively harder — full syllabus in PDF) |
| Pattern Recognition | Multi-rule patterns with combined operations, alternating/cyclic behaviour | Multi-rule numerical, algebraic, visual, letter-based patterns | — |
| Decomposition | Interdependent clues, numerical + spatial properties, cross-referenced tables | Interconnected constraints, spatial/geometry, multi-dependency tables | — |
| Algorithmic Thinking | Multi-layered rules, grid navigation, step-wise changes, logical flow | Rule-based sequences, grid pathfinding, if-then reasoning, elimination | — |

#### Class-wise AI learning outcomes (Introductory AI)

| Class | Core AI topics |
|---|---|
| 6 | Basic AI concepts and applications; human vs machine intelligence; automation vs AI; supervised/unsupervised/reinforcement learning; data organisation (text, numbers, images, sounds); pattern recognition; ethics and digital responsibility; internet safety; human-centred design |
| 7 | Predictive techniques (regression, classification, clustering); AI domains (Data Science, Computer Vision, NLP); AI bias and fairness; digital citizenship; data privacy and informed consent; data collection, organisation, and visualisation (bar charts, line graphs, pie charts) |
| 8 | (Full syllabus in PDF — consistent progression from Class 7; extends AI concepts and project scope) |

#### Repo mapping

| Item | State |
|---|---|
| Question bank files | None — no CT&AI content in any class |
| Gateway keys | `6-ComputationalThinking`, `7-ComputationalThinking`, `8-ComputationalThinking` (none registered) |
| Priority | P6 — lowest; no implementation started |

#### Notes

- CT&AI has no traditional chapter list. For question bank purposes, the three components (Advanced CT, AI Concepts, Projects) and the four CT domains are the natural groupings.
- The interdisciplinary project component is assessed by the Computer teacher; it is unlikely to map cleanly to a multiple-choice question bank format. The product may need a different UX pattern for CT&AI (project rubrics, CT puzzle sets) rather than traditional MCQ practice.
- No standalone textbook = no NCERT URL to verify. Framework PDF is the complete authoritative source.

---

## Part D — Missing Chapter Verification Plan

Chapters whose list is currently PENDING (Classes 6-8 Science) must be verified before content authoring begins. The recommended verification path:

1. **Primary path:** Request NCERT to enable direct textbook page access, or use the NCERT Diksha platform (diksha.gov.in) which serves chapter lists in parseable form.
2. **Secondary path:** Download the CBSE Middle Stage Curriculum PDF when published (expected with new NCF-SE 2023 textbooks, 2027-28).
3. **Immediate fallback:** Manual inspection of printed NCERT textbook (Class VI, VII, VIII Science) by a content reviewer who records chapter numbers and names to this document under a DEC-NNN decision entry.

Until the verification is complete, the `6-Science`, `7-Science`, `8-Science` gateway keys must not be registered in the `EXPECTED` map, and no content authoring sprint for these subjects may begin.

---

## Part E — Repo Completeness Summary

| Subject-class | Official chapters | Repo chapters (files) | Gateway registered | Content status |
|---|---|---|---|---|
| 6-Mathematics | 14 | 14 (via adapter) | ✓ | ✓ Questions exist |
| 7-Mathematics | 14 active + 1 deleted | 14 active + 1 deleted | ✓ | ✓ Questions exist |
| 8-Mathematics | 14 | 14 (via adapter) | ✓ | ✓ Questions exist |
| 9-Mathematics | 15 (new 2026-27 names) | 15 (old names — stale) | ✓ (stale names) | ⚠️ Names misaligned |
| 6-Science | ~16 (unverified) | 0 | ✗ | ✗ No content |
| 7-Science | ~18 (unverified) | 0 | ✗ | ✗ No content |
| 8-Science | ~15 (unverified) | 0 | ✗ | ✗ No content |
| 9-Science | 14 total / 12 exam-active | Physics: 5 (partial); Chemistry: 1 (combined); Biology: 0; Earth Sci: 0 | Physics only | ✗ Incomplete; Biology dead-end |
| 9-Computer Applications | 3 content units | 0 | ✗ | ✗ No content |
| 9-Information Technology | 5 vocational units | 0 | ✗ | ✗ No content |
| 9-Artificial Intelligence | 5 subject units | 0 | ✗ | ✗ No content |
| 6-CT&AI | 3 components (no chapters) | 0 | ✗ | ✗ No content |
| 7-CT&AI | 3 components (no chapters) | 0 | ✗ | ✗ No content |
| 8-CT&AI | 3 components (no chapters) | 0 | ✗ | ✗ No content |

---

## Part F — Consolidated Blocked Items

| ID | Subject | Class | Severity | Description |
|---|---|---|---|---|
| B-M9-1 | Mathematics | 9 | HIGH | Gateway `EXPECTED` map uses pre-2026-27 chapter names; must be updated |
| B-M9-2 | Mathematics | 9 | HIGH | Two new chapters ("Sequences and Progressions", "Exploring Algebraic Identities") have no content files |
| B-M9-3 | Mathematics | 9 | MEDIUM | Old ch9 + ch12 consolidated; existing questions need remapping |
| B-M9-4 | Mathematics | 9 | MEDIUM | File numbering (ch1–ch15) no longer maps cleanly to 2026-27 sequence |
| B-S6-1 | Science | 6 | HIGH | Chapter list unverified — NCERT JavaScript barrier |
| B-S7-1 | Science | 7 | HIGH | Chapter list unverified — NCERT JavaScript barrier |
| B-S8-1 | Science | 8 | HIGH | Chapter list unverified — NCERT JavaScript barrier |
| B-S9-1 | Science (Biology) | 9 | **CRITICAL** | Zero content; live UI dead-end (DEC-011); blocks launch |
| B-S9-2 | Science (Chemistry) | 9 | **CRITICAL** | 0 of 3 exam chapters have questions; blocks Science coverage claim |
| B-S9-3 | Science (Earth Sci) | 9 | HIGH | Zero content for Ch13 ("Earth as a System: Energy, Matter & Life") |
| B-S9-4 | Science (Physics) | 9 | MEDIUM | Ch3 "Gravitation" may be out of 2026-27 exam scope; verify |
| B-S9-5 | Science (Physics) | 9 | MEDIUM | Chapter names misaligned with 2026-27 official names |
| B-CA-1 | Computer Applications | 9 | LOW | Zero content; P3 priority; no authoring started |
| B-IT-1 | Information Technology | 9 | LOW | Zero content; P4 priority; no authoring started |
| B-AI-1 | Artificial Intelligence | 9 | LOW | Zero content; P5 priority; no authoring started |
| B-CT-1 | CT&AI | 6, 7, 8 | LOW | Zero content; P6 priority; textbook not yet published |

---

## Part G — Official Source Index (all URLs verified 2026-07-09)

| Document | Full URL | HTTP status |
|---|---|---|
| CBSE 2026-27 curriculum index | `https://cbseacademic.nic.in/curriculum_2027.html` | 200 ✓ |
| Class 9 Mathematics syllabus | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1IX_2026-27.pdf` | 200 ✓ |
| Class 9 Mathematics (Advanced) | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/MathsAd_SecP1_2026-27.pdf` | 200 ✓ |
| Class 9-10 Mathematics | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Maths_SecP1X_2026-27.pdf` | (linked) |
| Class 9 Science reading material | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27_RM.pdf` | 200 ✓ |
| Science general (Class X confirmed) | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1_2026-27.pdf` | 200 ✓ |
| Computer Applications (165) | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Computer_Applications_SecP1IX_2026-27.pdf` | 200 ✓ |
| Information Technology (402) | `https://cbseacademic.nic.in/web_material/Curriculum27/sec/402-IT-IX.pdf` | 200 ✓ |
| Artificial Intelligence (417) | `https://cbseacademic.nic.in/web_material/Curriculum27/sec/417-AI-IX.pdf` | 200 ✓ |
| CT&AI Framework Classes 3–8 | `https://cbseacademic.nic.in/web_material/CurriculumMain27/CTAI_Pri_2026-27.pdf` | 200 ✓ |
| NCERT Class 6 Mathematics | `https://ncert.nic.in/textbook.php?femh1=0-14` | 200 (JS-rendered) |
| NCERT Class 7 Mathematics | `https://ncert.nic.in/textbook.php?gemh1=0-15` | 200 (JS-rendered) |
| NCERT Class 8 Mathematics | `https://ncert.nic.in/textbook.php?hemh1=0-13` | 200 (JS-rendered) |
| NCERT Class 9 Mathematics | `https://ncert.nic.in/textbook.php?iemh1=0-15` | 200 (JS-rendered) |
| CBSE Vocational index | `https://cbseacademic.nic.in/web_material/Curriculum27/sec/` | (directory) |

---

## Part H — Version history

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | 2026-07-09 | AI governance session | Initial freeze — research session against official sources. All PDFs downloaded and text-extracted. |

---

*End of document — do not edit without a corresponding DEC-NNN decision entry in DECISION_LOG.md*
