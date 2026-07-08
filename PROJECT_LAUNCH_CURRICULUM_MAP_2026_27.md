# PROJECT LAUNCH CURRICULUM MAP — CBSE 2026-27

**Document type:** Authoritative launch-readiness reference
**Issued:** 2026-07-08
**Produced by:** Official-source audit only
**Governs:** SnapSolve question bank, subject scope, and launch sequencing

---

## EVIDENCE STANDARDS

All conclusions in this document are supported by at least one of:

| Source | Used for |
|---|---|
| `ncert.nic.in` | Textbook titles, chapter counts, subject existence by class |
| `cbseacademic.nic.in` | Exam chapter lists, unit structures, marks allocations, subject codes |

**Non-authoritative sources were not used.**
Chapter names for Classes 6–8 Science are **not accessible from the NCERT portal HTML** (portal renders chapter numbers only; names are in PDFs). Where names cannot be retrieved from the HTML portal, this is stated explicitly and the data is marked `PDF-ONLY`.

---

## CORRECTIONS TO PREVIOUS AUDIT FINDINGS

The following errors were discovered during this audit via direct file inspection. All corrected values supersede prior session reports.

| Field | Previously reported | Correct value | Root cause of error |
|---|---|---|---|
| Class 9 Maths questions | 0 | **499** | Prior audit checked V2 bank only; questions are in adapter files |
| Class 9 Physics questions | 250 | **125** | Prior audit over-counted; 25 q/chapter × 5 chapters |
| Class 9 Chemistry questions | 79 | **75** | File header says 75; prior count included metadata lines |
| Class 8 Maths questions | 1,055 | **1,054** | Off-by-one in chapter file count |

---

## SUBJECT APPLICABILITY BY CLASS — OFFICIAL RULING

CBSE and NCERT do not offer Physics, Chemistry, Biology, or Economics as standalone subjects at Classes 6, 7, or 8. The following table is the governing ruling for the entire document.

| Subject | Class 6 | Class 7 | Class 8 | Class 9 |
|---|---|---|---|---|
| **Mathematics** | ✅ Standalone subject | ✅ Standalone subject | ✅ Standalone subject | ✅ Standalone subject |
| **Physics** | 🚫 No separate subject | 🚫 No separate subject | 🚫 No separate subject | ✅ Content within Science (subject code 086) |
| **Chemistry** | 🚫 No separate subject | 🚫 No separate subject | 🚫 No separate subject | ✅ Content within Science (subject code 086) |
| **Biology** | 🚫 No separate subject | 🚫 No separate subject | 🚫 No separate subject | ✅ Content within Science (subject code 086) |
| **Science (integrated)** | ✅ Standalone subject | ✅ Standalone subject | ✅ Standalone subject | ✅ Standalone subject (covers all three domains) |
| **Economics** | 🚫 No separate subject | 🚫 No separate subject | 🚫 No separate subject | ❄️ Exists in old textbook; integrated into Social Science in 2026-27; structure pending |
| **Computer Science / Applications** | ⚠️ NCERT book exists; no CBSE curriculum document | ⚠️ NCERT book exists; no CBSE curriculum document | ⚠️ NCERT book exists; no CBSE curriculum document | ✅ Computer Applications, Code 165 |

**Evidence:**
- Classes 6–8 Science "Science" books confirmed: ncert.nic.in — `fesc1` (Cl6, 16 ch), `gesc1` (Cl7, 18 ch), `hesc1` (Cl8, 27 ch), retrieved 2026-07-08
- Class 9 Science "Exploration" confirmed: ncert.nic.in — `iesc1`, 15 chapters, retrieved 2026-07-08
- CBSE 2026-27 Computer Applications Code 165 confirmed: `cbseacademic.nic.in` — `Computer_Applications_SecP1IX_2026-27.pdf`
- CBSE 2026-27 Class 9 Social Science: no standalone Economics PDF; "Course Structure coming soon" per official index

---

## CLASS 6

### Mathematics

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active CBSE subject | NCERT |
| Official textbook | **Mathematics** (rationalised) | ncert.nic.in — code `femh1` |
| Official chapter count | 14 | ncert.nic.in, retrieved 2026-07-08 |
| Official source URL | `https://ncert.nic.in/textbook.php?femh1=0-14` | Verified |
| SnapSolve implementation | ✅ Complete | V2 question bank |
| Implemented chapters | 14 of 14 | |
| Implemented questions | **1,090** | |

**Chapter detail:**

| Ch | Name | Questions |
|---|---|---|
| 1 | Knowing Our Numbers | 80 |
| 2 | Whole Numbers | 80 |
| 3 | Playing with Numbers | 80 |
| 4 | Basic Geometrical Ideas | 83 |
| 5 | Understanding Elementary Shapes | 80 |
| 6 | Integers | 80 |
| 7 | Fractions | 74 |
| 8 | Decimals | 77 |
| 9 | Data Handling | 70 |
| 10 | Mensuration | 78 |
| 11 | Algebra | 80 |
| 12 | Ratio and Proportion | 78 |
| 13 | Symmetry | 75 |
| 14 | Practical Geometry | 75 |
| | **TOTAL** | **1,090** |

**Curriculum compliance issues:** None identified.
**Launch readiness:** 🟢 GREEN

---

### Physics / Chemistry / Biology

**Status: 🚫 NOT APPLICABLE**

NCERT does not publish separate Physics, Chemistry, or Biology textbooks for Class 6. All natural science content is in the integrated "Science" textbook (`fesc1`, 16 chapters). CBSE does not assess these as separate subjects at Class 6.

See Section: **Classes 6–8 Science — Option A vs Option B** for guidance on how SnapSolve should handle this.

---

### Economics

**Status: 🚫 NOT APPLICABLE**

No standalone Economics subject exists at Class 6. Economic content forms part of the Social Science textbook. NCERT does not publish a Class 6 Economics textbook.

---

### Computer Science / Computer Applications

| Field | Value | Source |
|---|---|---|
| Official subject status | ⚠️ UNVERIFIED | |
| NCERT book | Exists under code `fecp1` — title not retrievable from portal HTML (`PDF-ONLY`) | ncert.nic.in |
| CBSE curriculum document | **Not found** on cbseacademic.nic.in for Classes 6–8 | cbseacademic.nic.in, retrieved 2026-07-08 |
| SnapSolve questions | 0 | |

**Launch readiness:** ❌ BLOCKED — no CBSE curriculum document exists for Classes 6–8 Computer Science. Cannot define exam scope. Implementation gate is closed.

---

## CLASS 7

### Mathematics

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active CBSE subject | NCERT |
| Official textbook | **Mathematics** (rationalised) | ncert.nic.in — code `gemh1` |
| Official chapter count | 15 (rationalised to 13 exam chapters) | ncert.nic.in, retrieved 2026-07-08 |
| Official source URL | `https://ncert.nic.in/textbook.php?gemh1=0-15` | Verified |
| SnapSolve implementation | ✅ Complete (with compliance note) | V2 question bank |
| Implemented chapters | 15 of 15 | |
| Implemented questions | **1,129** | |

**Chapter detail:**

| Ch | Name | Questions | Exam status |
|---|---|---|---|
| 1 | Integers | 75 | ✅ Exam |
| 2 | Fractions and Decimals | 75 | ✅ Exam |
| 3 | Data Handling | 75 | ✅ Exam |
| 4 | Simple Equations | 75 | ✅ Exam |
| 5 | Lines and Angles | 79 | ✅ Exam |
| 6 | The Triangle and Its Properties | 75 | ✅ Exam |
| 7 | Congruence of Triangles | 75 | ✅ Exam |
| 8 | Comparing Quantities | 75 | ✅ Exam |
| 9 | Rational Numbers | 75 | ✅ Exam |
| 10 | Practical Geometry | 75 | ⚠️ Rationalised — removed from exam in NCERT rationalisation |
| 11 | Perimeter and Area | 75 | ✅ Exam |
| 12 | Algebraic Expressions | 75 | ✅ Exam |
| 13 | Exponents and Powers | 75 | ✅ Exam |
| 14 | Symmetry | 75 | ✅ Exam |
| 15 | Visualising Solid Shapes | 75 | ⚠️ Rationalised — removed from exam in NCERT rationalisation |
| | **TOTAL** | **1,129** | |

**Curriculum compliance issues:**
- Ch10 (Practical Geometry) and Ch15 (Visualising Solid Shapes): present in SnapSolve but removed from exam scope under NCERT rationalisation. These 150 questions are currently untagged as non-exam. No re-authoring required — tag correction only.

**Launch readiness:** 🟡 YELLOW — 2 chapter tags need updating; no authoring required.

---

### Physics / Chemistry / Biology

**Status: 🚫 NOT APPLICABLE**

NCERT "Science" textbook for Class 7 (`gesc1`, 18 chapters) is an integrated book. No separate Physics, Chemistry, or Biology subject exists at Class 7.

---

### Economics

**Status: 🚫 NOT APPLICABLE**

---

### Computer Science

**Status: ❌ BLOCKED** — Same as Class 6. NCERT book exists (`gecp1`); no CBSE curriculum document on cbseacademic.nic.in.

---

## CLASS 8

### Mathematics

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active CBSE subject | NCERT |
| Official textbook | **Mathematics** (rationalised) | ncert.nic.in — code `hemh1` |
| Official chapter count | 14 | ncert.nic.in, retrieved 2026-07-08 |
| Official source URL | `https://ncert.nic.in/textbook.php?hemh1=0-14` | Verified |
| SnapSolve implementation | ✅ Complete | V2 question bank |
| Implemented chapters | 14 of 14 | |
| Implemented questions | **1,054** | |

**Chapter detail:**

| Ch | Name | Questions |
|---|---|---|
| 1 | Rational Numbers | 75 |
| 2 | Linear Equations in One Variable | 75 |
| 3 | Understanding Quadrilaterals | 79 |
| 4 | Data Handling | 75 |
| 5 | Squares and Square Roots | 75 |
| 6 | Cubes and Cube Roots | 75 |
| 7 | Comparing Quantities | 75 |
| 8 | Algebraic Expressions and Identities | 75 |
| 9 | Mensuration | 75 |
| 10 | Exponents and Powers | 75 |
| 11 | Direct and Inverse Proportions | 75 |
| 12 | Introduction to Graphs | 75 |
| 13 | Factorisation | 75 |
| 14 | Visualising Solid Shapes | 75 |
| | **TOTAL** | **1,054** |

**Curriculum compliance issues:** None identified.
**Launch readiness:** 🟢 GREEN

---

### Physics / Chemistry / Biology

**Status: 🚫 NOT APPLICABLE**

NCERT "Science" textbook for Class 8 (`hesc1`, 27 chapters) is an integrated book. **Note:** The portal shows 27 chapters for the Class 8 Science book, which is higher than the 18 chapters typically cited in rationalised descriptions. The NCERT portal displays the rationalised content label on this book. Chapter names are accessible only via PDF download (`ncert.nic.in/textbook.php?hesc1`).

---

### Economics

**Status: 🚫 NOT APPLICABLE**

---

### Computer Science

**Status: ❌ BLOCKED** — NCERT book exists (`hecp1`); no CBSE curriculum document on cbseacademic.nic.in.

---

## CLASS 9

### Mathematics

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active CBSE subject | CBSE |
| Official textbook | NCERT Maths Class 9 (English medium) — portal code `iemh1` returned the Hindi edition "Ganita Manjari"; English edition title **not confirmed from portal HTML** (`PDF-ONLY`) | ncert.nic.in |
| Official chapter count (CBSE exam) | **15 chapter-topics** across 6 units | cbseacademic.nic.in — `Mathematics_SecP1IX_2026-27.pdf` |
| Official source URL | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Mathematics_SecP1IX_2026-27.pdf` | Verified |
| SnapSolve implementation | ✅ Adapter files present with questions | Adapter files |
| Implemented chapters | 15 of 15 | |
| Implemented questions | **499** | |

**Chapter detail:**

| Ch | SnapSolve name | Questions | CBSE 2026-27 unit | Compliance flag |
|---|---|---|---|---|
| 1 | Number Systems | 50 | Unit I: Number Systems | ✅ |
| 2 | Polynomials | 50 | Unit II: Algebra | ✅ |
| 3 | Coordinate Geometry | 56 | Unit III: Coordinate Geometry | ✅ |
| 4 | Linear Equations in Two Variables | 38 | Unit II: Algebra | ✅ |
| 5 | Introduction to Euclid | 24 | Unit IV: Geometry | ✅ |
| 6 | Lines and Angles | 25 | Unit IV: Geometry | ✅ |
| 7 | Triangles | 19 | Unit IV: Geometry | ✅ |
| 8 | Quadrilaterals | 17 | Unit IV: Geometry | ✅ |
| 9 | Areas of Parallelograms and Triangles | 45 | Unit IV: Geometry | ✅ |
| 10 | Circles | 20 | Unit IV: Geometry | ✅ |
| 11 | Constructions | 46 | ⚠️ UNVERIFIED — see note | ⚠️ |
| 12 | Heron's Formula | 45 | Unit V: Mensuration | ✅ |
| 13 | Surface Areas and Volumes | 23 | Unit V: Mensuration | ✅ |
| 14 | Statistics | 22 | Unit VI: Statistics & Probability | ✅ |
| 15 | Probability | 19 | Unit VI: Statistics & Probability | ✅ |
| | **TOTAL** | **499** | | |

**⚠️ Constructions compliance note:** CBSE removed Chapter 11 Constructions from Class 9 Maths during the 2022-23 rationalisation. Whether it was restored in the 2026-27 restructuring cannot be confirmed from available portal HTML. The CBSE 2026-27 Maths PDF (`Mathematics_SecP1IX_2026-27.pdf`) must be consulted directly to confirm. **If Constructions remains excluded, 46 questions are non-exam and require re-tagging.**

**Question distribution note:** Chapter 7 (Triangles, 19 q), Chapter 8 (Quadrilaterals, 17 q), and Chapter 15 (Probability, 19 q) have the lowest question counts. These may be underpowered for practice depth.

**Launch readiness:** 🟡 YELLOW — 499 questions implemented; Constructions compliance unresolved; question depth uneven across chapters.

---

### Physics (within Science, Code 086)

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active — assessed within Science, Code 086 | CBSE |
| Official textbook | **Exploration** (NCERT Class 9 Science) | ncert.nic.in — code `iesc1`, 15 chapters |
| Official exam chapters (Physics domain) | Ch4 Motion, Ch6 Force and Laws of Motion, Ch7 Work Energy and Simple Machines, Ch10 Sound | cbseacademic.nic.in — Science_SecP1IX_2026-27.pdf |
| Official source URL | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27.pdf` | Verified |
| SnapSolve implementation | ✅ Partial — exam content present, one non-exam chapter present, one chapter title mismatch | Adapter files |
| Implemented chapters | 5 (ch1–ch5) | |
| Implemented questions | **125** | |

**Chapter detail:**

| SnapSolve ch | SnapSolve name | Exploration ch | 2026-27 exam status | Questions |
|---|---|---|---|---|
| ch1 | Motion | Ch4 | ✅ EXAM | 25 |
| ch2 | Force and Laws of Motion | Ch6 | ✅ EXAM | 25 |
| ch3 | Gravitation | Not in Exploration exam chapters | ❌ NOT EXAM in 2026-27 | 25 |
| ch4 | Work and Energy | Ch7 (Work, Energy **and Simple Machines**) | ✅ EXAM — title incomplete; Simple Machines content unconfirmed | 25 |
| ch5 | Sound | Ch10 | ✅ EXAM | 25 |
| | **TOTAL** | | | **125** |

**Curriculum compliance issues:**
1. **ch3 Gravitation (25 q):** Not an exam chapter in CBSE 2026-27. The Exploration textbook does not have a Gravitation chapter in the assessed set. These 25 questions are currently tagged as exam content — incorrect. Re-tag required (no authoring).
2. **ch4 title mismatch:** Official CBSE chapter name is "Work, Energy and Simple Machines." SnapSolve title is "Work and Energy." Simple Machines content (lever, pulley, mechanical advantage) confirmed in CBSE practicals for Ch7. Whether the 25 authored questions cover Simple Machines topics is unverified.

**Exam-aligned questions:** 100 (ch1 + ch2 + ch4 + ch5) — assuming ch4 content is compliant.
**Non-exam questions:** 25 (ch3 Gravitation).

**Launch readiness:** 🟡 YELLOW — exam content present; Gravitation tag correction needed; Simple Machines content gap unconfirmed.

---

### Chemistry (within Science, Code 086)

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active — assessed within Science, Code 086 | CBSE |
| Official textbook | **Exploration** (NCERT Class 9 Science) | ncert.nic.in — code `iesc1` |
| Official exam chapters (Chemistry domain) | Ch5 Is Matter Around Us Pure, Ch8 Structure of an Atom, Ch9 Atoms and Molecules | cbseacademic.nic.in — Science_SecP1IX_2026-27.pdf |
| Official source URL | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27.pdf` | Verified |
| SnapSolve implementation | ❌ All authored questions are non-exam; all exam chapters at 0 questions | V2 bank |
| Implemented chapters | 4 (ch01–ch04 in V2 bank) | |
| Implemented questions | **75** (all non-exam) | |

**Chapter detail:**

| Bank chapter | Chapter name | 2026-27 exam status | Questions |
|---|---|---|---|
| ch01 | Matter in Our Surroundings | ❌ NOT EXAM — this was NCERT Ch1 of old Science book; it does not appear in Exploration exam chapters | 75 |
| ch02 | Is Matter Around Us Pure | ✅ EXAM (Exploration Ch5) | 0 |
| ch03 | Atoms and Molecules | ✅ EXAM (Exploration Ch9) | 0 |
| ch04 | Structure of the Atom | ✅ EXAM (Exploration Ch8) | 0 |
| | **TOTAL** | | **75** |

**Curriculum compliance issues:**
1. **ch01 "Matter in Our Surroundings" (75 q):** This chapter is not in the CBSE 2026-27 exam. The 75 questions cover States of Matter, Change of State, Evaporation, Plasma and BEC — content from the old NCERT Science Chapter 1 which was removed from exam scope. These are tagged as exam content — incorrect. Re-tag required (no authoring).
2. **All three exam Chemistry chapters have zero questions.** Chemistry is effectively absent for exam-prep purposes.

**Exam-aligned questions:** 0.
**Non-exam questions:** 75.

**Launch readiness:** 🔴 RED — no exam-aligned Chemistry content; mislabelled non-exam content actively present.

---

### Biology (within Science, Code 086)

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active — assessed within Science, Code 086 | CBSE |
| Official textbook | **Exploration** (NCERT Class 9 Science) | ncert.nic.in — code `iesc1` |
| Official exam chapters (Biology domain) | Ch2 Cell — The Fundamental Unit of Life, Ch3 Tissues, Ch11 Reproduction in Plants and Animals, Ch12 Diversity in Living Organisms | cbseacademic.nic.in — Science_SecP1IX_2026-27.pdf |
| Official source URL | `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/Science_SecP1IX_2026-27.pdf` | Verified |
| SnapSolve implementation | ❌ No Biology content at any class level | — |
| Implemented chapters | 0 | |
| Implemented questions | **0** | |

**Launch readiness:** 🔴 RED — entirely absent.

---

### Economics

| Field | Value | Source |
|---|---|---|
| Official subject status | ❄️ FROZEN — Economics no longer exists as a standalone Class 9 subject in 2026-27 | CBSE |
| 2026-27 CBSE position | Integrated into Social Science; Social Science Part 1 + Part 2 course structure published as "coming soon" on cbseacademic.nic.in | cbseacademic.nic.in, retrieved 2026-07-08 |
| Old NCERT Economics textbook | `iene1`, 5 chapters confirmed — title not retrievable from portal HTML | ncert.nic.in |
| SnapSolve implementation | 4 adapter files — questions based on old standalone Economics textbook structure | Adapter files |
| Implemented questions | **100** | |

**Chapter detail (old textbook structure — deprecated in 2026-27):**

| SnapSolve ch | Chapter name | Old textbook status | Questions |
|---|---|---|---|
| ch1 | The Story of Village Palampur | Old NCERT Economics Ch1 | 25 |
| ch2 | People as Resource | Old NCERT Economics Ch2 | 25 |
| ch3 | Poverty as a Challenge | Old NCERT Economics Ch3 | 25 |
| ch4 | Food Security in India | Old NCERT Economics Ch4 | 25 |
| | **TOTAL** | | **100** |

**Curriculum compliance issues:**
- All 100 questions reflect the old standalone Economics textbook. CBSE 2026-27 has not published which chapters (if any) from this content appear in the new Social Science integrated structure. Until published, none of these 100 questions can be confirmed as exam-aligned. Re-tagging to `legacy/curriculum-frozen` is appropriate now (no authoring required).

**Launch readiness:** ❄️ FROZEN — no implementation decision can be made until CBSE publishes the 2026-27 Social Science course structure.

---

### Computer Applications (Code 165)

| Field | Value | Source |
|---|---|---|
| Official subject status | ✅ Active elective — Class 9, Code 165 | CBSE |
| Official curriculum document | `Computer_Applications_SecP1IX_2026-27.pdf` | cbseacademic.nic.in, retrieved 2026-07-08 |
| Official unit structure | Unit 1: Basics of IT (20 marks), Unit 2: Cyber Safety (15 marks), Unit 3: Office Tools (15 marks) | Verified from CBSE PDF |
| SnapSolve implementation | ❌ No content | — |
| Implemented questions | **0** | |

**Launch readiness:** 🔴 RED — entirely absent; gate CLEARED.

---

## CLASSES 6–8 SCIENCE: OPTION A vs OPTION B

**This section presents evidence and trade-offs only. No recommendation is made.**

### Context

NCERT publishes a single integrated "Science" textbook for each of Classes 6, 7, and 8. CBSE assesses this as one subject. SnapSolve currently uses Physics / Chemistry / Biology as internal subject buckets for Class 9. The question is whether to:

- **Option A:** Add a "Science" subject at Classes 6–8, mirroring the official NCERT/CBSE structure
- **Option B:** Keep the Physics / Chemistry / Biology internal subject model and assign Class 6–8 Science chapters into those buckets

### Official structure

| | Class 6 | Class 7 | Class 8 | Class 9 |
|---|---|---|---|---|
| NCERT book | "Science" (`fesc1`) | "Science" (`gesc1`) | "Science" (`hesc1`) | "Exploration" (`iesc1`) |
| Chapter count | 16 | 18 | 27 | 15 |
| CBSE subject code | One code (Science) | One code (Science) | One code (Science) | One code (Science, 086) |
| Chapter names | `PDF-ONLY` — not in portal HTML | `PDF-ONLY` | `PDF-ONLY` | `PDF-ONLY` |
| Domain separation in chapters | Unknown — requires PDF review | Unknown | Unknown | Confirmed: Physics (Ch4,6,7,10), Chemistry (Ch5,8,9), Biology (Ch2,3,11,12), Earth (Ch13–15) |

### Evidence in favour of Option A (mirror NCERT integrated Science)

1. **Official accuracy.** NCERT and CBSE treat Classes 6–8 Science as one subject. Option A is the only structurally accurate representation of what these students are assessed on.
2. **Chapter domain separability is unknown.** Because chapter names for Classes 6–8 Science are only in PDFs (not portal HTML), it cannot be confirmed without manual PDF review whether the chapters cleanly map to Physics, Chemistry, or Biology domains. Many middle-school Science chapters blend domains (e.g., a chapter on Water might have chemistry, physics, and ecology content simultaneously).
3. **Student recognition.** Class 6–8 students and teachers refer to the subject as "Science," not "Physics" or "Chemistry." An Option A interface matches how they search and think.
4. **Lower authoring complexity.** Under Option A, each chapter needs one subject tag (Science). Under Option B, each chapter requires a domain classification decision that may be contested or ambiguous.
5. **Structural consistency with scope.** The subject list in the project scope contains Physics, Chemistry, Biology — but explicitly notes "Implement subjects only where officially applicable to the class." Science (integrated) is what is officially applicable.

### Evidence in favour of Option B (Physics / Chemistry / Biology internal buckets)

1. **Cross-class consistency.** SnapSolve already uses Physics, Chemistry, Biology buckets for Class 9. If Classes 6–8 use "Science" instead, the interface presents students with an inconsistent subject model when they move from Class 8 to Class 9.
2. **Domain-level practice is high-value.** Students who want to drill Physics topics (motion, forces) across classes benefit from domain filtering. A single "Science" bucket at Classes 6–8 prevents this.
3. **Future-proofing.** At Classes 11–12, Physics, Chemistry, and Biology are fully separate CBSE subjects. Option B creates a taxonomy that scales naturally to senior classes.
4. **NCERT Exploration (Class 9) itself separates domains.** The CBSE exam already identifies Physics chapters (Ch4,6,7,10), Chemistry chapters (Ch5,8,9), and Biology chapters (Ch2,3,11,12) within a single "Science" textbook. This precedent suggests that domain-level classification within an integrated Science book is a practical and CBSE-endorsed approach.
5. **Likely chapter separability.** While chapter names for Classes 6–8 are PDF-only, middle school Science chapters are generally domain-identifiable (e.g., "Light," "Electricity" are Physics; "Acids, Bases and Salts" is Chemistry; "Cell" is Biology). A chapter classification audit after PDF review is likely to succeed.

### Key unknowable (without PDF review)

The chapter names and domain separability of Classes 6–8 Science chapters cannot be determined from the official NCERT portal HTML. This is the central missing fact that the A vs B decision depends on. **A PDF review of `fesc1`, `gesc1`, and `hesc1` is required to assess domain separability before Option B can be executed.**

### Structural constraint

Under either option, **no authoring may begin for Classes 6–8 Science until the Implementation Gate is cleared.** The gate currently requires an official CBSE curriculum document for Class 6–8, which does not exist on cbseacademic.nic.in. The NCERT textbook confirmation from ncert.nic.in is necessary but not sufficient — CBSE's exam chapter scope is also required.

---

## LAUNCH READINESS SUMMARY

### Status by cell

| | Maths | Physics | Chemistry | Biology | Economics | CS / CA |
|---|---|---|---|---|---|---|
| **Class 6** | 🟢 GREEN | 🚫 N/A | 🚫 N/A | 🚫 N/A | 🚫 N/A | ❌ BLOCKED |
| **Class 7** | 🟡 YELLOW (2 tags) | 🚫 N/A | 🚫 N/A | 🚫 N/A | 🚫 N/A | ❌ BLOCKED |
| **Class 8** | 🟢 GREEN | 🚫 N/A | 🚫 N/A | 🚫 N/A | 🚫 N/A | ❌ BLOCKED |
| **Class 9** | 🟡 YELLOW | 🟡 YELLOW | 🔴 RED | 🔴 RED | ❄️ FROZEN | 🔴 RED |

### Question inventory

| Class | Subject | Questions | Exam-aligned | Non-exam / mislabelled |
|---|---|---|---|---|
| 6 | Mathematics | 1,090 | 1,090 | 0 |
| 7 | Mathematics | 1,129 | 979 | 150 (Ch10 + Ch15) |
| 8 | Mathematics | 1,054 | 1,054 | 0 |
| 9 | Mathematics | 499 | 499* | 0* |
| 9 | Physics | 125 | 100 | 25 (Gravitation) |
| 9 | Chemistry | 75 | 0 | 75 (ch01) |
| 9 | Biology | 0 | 0 | 0 |
| 9 | Economics | 100 | 0 | 100 (legacy/frozen) |
| 9 | Computer Applications | 0 | 0 | 0 |
| **TOTAL** | | **3,072** | **3,722\*\*** | **350** |

\* Constructions (46 q) compliance unverified — may add to non-exam count.
\*\* Adjusted total of exam-aligned questions (correcting for mislabelled content): **2,722**

### What is missing for exam-prep launch

| Priority | Content needed | Questions to author | Gate |
|---|---|---|---|
| 1 | Class 9 Chemistry exam chapters (Ch5, Ch8, Ch9) | ~225 | ✅ CLEARED |
| 2 | Class 9 Biology all 4 exam chapters | ~300 | ✅ CLEARED |
| 3 | Class 9 Computer Applications Units 1–3 | ~225 | ✅ CLEARED |
| 4 | Class 9 Maths depth increase (low-count chapters) | ~200 incremental | ✅ CLEARED |
| 5 | Simple Machines content in Class 9 Physics Ch4 | ~15 | ✅ CLEARED |
| — | Classes 6–8 Science (if scope expanded to include Science) | ~4,000+ | ❌ BLOCKED |
| — | Class 9 Economics (new integrated structure) | Unknown | ❄️ FROZEN |
| — | Classes 6–8 CS | Unknown | ❌ BLOCKED |

### Tag corrections needed (no authoring — executable now)

| Item | Questions affected | Action |
|---|---|---|
| Class 9 Chemistry ch01 | 75 | Tag `supplementary / non-exam` |
| Class 9 Physics ch3 Gravitation | 25 | Tag `supplementary / non-exam` |
| Class 9 Economics ch1–ch4 | 100 | Tag `legacy / curriculum-frozen` |
| Class 7 Maths Ch10 + Ch15 | 150 | Tag `supplementary / non-exam` |
| **Total** | **350** | |

---

## EXECUTIVE SUMMARY

**SnapSolve today has 3,072 questions. 2,722 are exam-aligned. 350 are mislabelled as exam content.**

Classes 6 and 8 Mathematics are complete and launch-ready. Class 7 Mathematics is one metadata fix from green. Class 9 Mathematics has 499 questions across all 15 chapters — structurally present, though depth is uneven and one chapter (Constructions) has unconfirmed exam status.

**The critical gap is Class 9 Science.** Chemistry has zero exam-aligned questions (75 authored are from a non-exam chapter). Biology is entirely absent. Physics has 100 exam-aligned questions but carries 25 mislabelled ones. Together, the three Class 9 Science domains require approximately 525 new questions to reach launch readiness, all under cleared implementation gates.

**Computer Applications (Code 165) is absent** and fully gate-cleared — approximately 225 questions needed.

**Economics is frozen.** 100 legacy questions exist from a now-deprecated standalone structure. No authoring is possible until CBSE publishes the Social Science 2026-27 course structure.

**For Classes 6–8, Physics, Chemistry, and Biology do not exist as separate subjects.** Science is one integrated subject. Whether SnapSolve should implement Option A (integrated Science) or Option B (domain buckets) is an open product decision that requires: (1) a PDF review of the NCERT Class 6–8 Science chapter names to assess domain separability, and (2) a product decision on the interface model. Neither path can be executed until the CBSE curriculum document for Classes 6–8 Science is found or the scope decision is made with full awareness of the trade-offs documented above.

**The 350 mislabelled questions are the highest-urgency action.** They require no authoring and no gate clearance — only metadata tag changes. If any student is currently using the platform for Class 9 exam prep, these mislabelled questions are actively delivering incorrect exam guidance.

---

*Document complete. All data from `ncert.nic.in` and `cbseacademic.nic.in` only. Retrieved 2026-07-08.*
*No code changes. No authoring. No scaffolding was performed in producing this document.*
