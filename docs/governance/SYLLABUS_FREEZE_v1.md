# SYLLABUS_FREEZE_v1.md

**Document type:** Implementation map — official academic library to SnapSolve product  
**Version:** 1.0 (draft)  
**Date:** 13 July 2026  
**Status:** DRAFT — NOT YET FROZEN  
**Authority:** This document is derived solely from the five source files listed below. No web research was performed.

**Source files read:**

1. `docs/governance/ACADEMIC_LIBRARY_INDEX.md` — canonical source library (FROZEN v1.0)
2. `docs/governance/PROJECT_BASELINE_2026_27.md` — official chapter lists and source inventory (FROZEN 2026-07-09)
3. `docs/governance/CLASS9_CURRICULUM_BASELINE.md` — Class 9 gap analysis and task queue (FROZEN 2026-07-09)
4. `docs/GOVERNANCE/PROJECT_STATUS.md` — current question bank, gateway, and blocker state
5. `docs/GOVERNANCE/DECISION_LOG.md` — governance decisions DEC-001 through DEC-016

---

## IMPORTANT NOTES FOR READERS

**1. Legacy vs. new textbooks (Classes 6–8 Mathematics and Science):**  
The current SnapSolve question bank for Classes 6–8 Mathematics was built against the legacy NCERT textbooks (pre-NCF-SE 2023). The official 2026-27 sources confirmed in `ACADEMIC_LIBRARY_INDEX.md` are the new NCERT Ganita Prakash (Mathematics) and Curiosity (Science) textbooks. Chapter names, counts, and structure differ. All Classes 6–8 subject rows below reflect this gap.

**2. Class 9 Mathematics structural change:**  
The 2026-27 Class 9 Mathematics syllabus (Ganita Manjari) has been completely restructured under NCF-SE 2023. Chapter names and two new chapter slots differ from the pre-2026-27 structure currently in the repo. See DEC-007 and `CLASS9_CURRICULUM_BASELINE.md §1`.

**3. Class 9 Science is an integrated subject:**  
Physics, Chemistry, Biology, and Earth Science are internal domains; the student-facing subject is "Science". Each domain is given its own implementation row for clarity.

**4. Class 9 Mathematics Part II:**  
Official NCERT Ganita Manjari Part II has not yet been released. No implementation is possible until receipt of official publication.

**Status value definitions:**  
`COMPLETE` — fully implemented and verified  
`PARTIAL` — partially implemented; gaps exist  
`PENDING` — not yet started; no blocker  
`BLOCKED` — cannot proceed without a named prerequisite  
`NOT APPLICABLE` — not relevant for this subject/row

---

## 1. CLASS 6

### 1.1 Class 6 — Mathematics

| Column | Value |
|---|---|
| **Class** | 6 |
| **Subject** | Mathematics |
| **Official Source** | NCERT Ganita Prakash — Textbook of Mathematics for Grade 6; First Edition August 2024; Reprint 2026–27 |
| **Official Chapters/Units** | 10 chapters: (1) Patterns in Mathematics (2) Lines and Angles (3) Number Play (4) Data Handling and Presentation (5) Prime Time (6) Perimeter and Area (7) Fractions (8) Playing with Constructions (9) Symmetry (10) The Other Side of Zero |
| **Current SnapSolve Status** | PARTIAL — question bank exists against legacy 14-chapter NCERT structure, not official Ganita Prakash |
| **Gateway Status** | PARTIAL — registered as `6-Mathematics`; WARN (difficulty distribution); chapter names are legacy |
| **Question Bank Status** | PARTIAL — 1,090 questions exist; authored against old chapter structure |
| **UI Status** | COMPLETE — Class 6 Mathematics is live and accessible to students |
| **Freeze Status** | PENDING |
| **Required Action** | Audit alignment between official Ganita Prakash 10 chapters and current 14-chapter question bank; update gateway EXPECTED map to official 2026-27 chapter names; retire or reclassify legacy chapters not present in Ganita Prakash |

---

### 1.2 Class 6 — Science

| Column | Value |
|---|---|
| **Class** | 6 |
| **Subject** | Science |
| **Official Source** | NCERT Curiosity — Textbook of Science for Grade 6; First Edition July 2024; Reprint 2026–27 |
| **Official Chapters/Units** | 12 chapters: (1) The Wonderful World of Science (2) Diversity in the Living World (3) Mindful Eating: A Path to a Healthy Body (4) Exploring Magnets (5) Measurement of Length and Motion (6) Materials Around Us (7) Temperature and its Measurement (8) A Journey through States of Water (9) Methods of Separation in Everyday Life (10) Living Creatures: Exploring their Characteristics (11) Nature's Treasures (12) Beyond Earth |
| **Current SnapSolve Status** | PENDING — no content authored |
| **Gateway Status** | PENDING — `6-Science` not registered in EXPECTED map |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | PENDING |
| **Required Action** | Register `6-Science` in gateway with official Curiosity chapter names; author questions per chapter |

---

### 1.3 Class 6 — Computational Thinking and Artificial Intelligence

| Column | Value |
|---|---|
| **Class** | 6 |
| **Subject** | Computational Thinking and Artificial Intelligence |
| **Official Source** | CBSE Computational Thinking and Artificial Intelligence Curriculum, Classes 3–8; combined official PDF received |
| **Official Chapters/Units** | PENDING — class-wise scope extraction from official PDF not yet completed |
| **Current SnapSolve Status** | BLOCKED — official chapter/unit list not yet extracted |
| **Gateway Status** | PENDING — not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | BLOCKED |
| **Required Action** | Extract Class 6 scope from official CBSE CT&AI PDF; freeze chapter/unit list; register gateway; author questions |

---

## 2. CLASS 7

### 2.1 Class 7 — Mathematics

| Column | Value |
|---|---|
| **Class** | 7 |
| **Subject** | Mathematics |
| **Official Source** | NCERT Ganita Prakash — Textbook of Mathematics for Grade 7; Reprint 2026–27 (Part I: 8 chapters; Part II: 7 chapters) |
| **Official Chapters/Units** | 15 chapters — Part I: (1) Large Numbers Around Us (2) Arithmetic Expressions (3) A Peek Beyond the Point (4) Expressions Using Letter-Numbers (5) Parallel and Intersecting Lines (6) Number Play (7) A Tale of Three Intersecting Lines (8) Working with Fractions — Part II: (1) Geometric Twins (2) Operations with Integers (3) Finding Common Ground (4) Another Peek Beyond the Point (5) Connecting the Dots (6) Constructions and Tilings (7) Finding the Unknown |
| **Current SnapSolve Status** | PARTIAL — question bank exists against legacy 15-chapter NCERT structure (including Ch10 Practical Geometry `cbseDeleted: true`); not aligned to official Ganita Prakash |
| **Gateway Status** | PARTIAL — registered as `7-Mathematics`; WARN (difficulty distribution); chapter names are legacy; 1 deleted chapter recorded |
| **Question Bank Status** | PARTIAL — 979 questions exist; authored against old chapter structure |
| **UI Status** | COMPLETE — Class 7 Mathematics is live and accessible |
| **Freeze Status** | PENDING |
| **Required Action** | Audit alignment between official Ganita Prakash 15 chapters and legacy 15-chapter question bank; update gateway EXPECTED map; verify deleted chapter handling carries forward correctly |

---

### 2.2 Class 7 — Science

| Column | Value |
|---|---|
| **Class** | 7 |
| **Subject** | Science |
| **Official Source** | NCERT Curiosity — Textbook of Science for Grade 7; Reprint 2026–27 |
| **Official Chapters/Units** | 12 chapters — titles to be extracted and frozen directly from official PDF (source received; extraction pending) |
| **Current SnapSolve Status** | PENDING — no content authored |
| **Gateway Status** | PENDING — `7-Science` not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | BLOCKED |
| **Required Action** | Extract exact chapter titles from official Curiosity Grade 7 PDF; freeze chapter list; register gateway; author questions |

---

### 2.3 Class 7 — Computational Thinking and Artificial Intelligence

| Column | Value |
|---|---|
| **Class** | 7 |
| **Subject** | Computational Thinking and Artificial Intelligence |
| **Official Source** | CBSE Computational Thinking and Artificial Intelligence Curriculum, Classes 3–8; combined official PDF received |
| **Official Chapters/Units** | PENDING — class-wise scope extraction not yet completed |
| **Current SnapSolve Status** | BLOCKED — official chapter/unit list not yet extracted |
| **Gateway Status** | PENDING — not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | BLOCKED |
| **Required Action** | Extract Class 7 scope from official CBSE CT&AI PDF; freeze chapter/unit list; register gateway; author questions |

---

## 3. CLASS 8

### 3.1 Class 8 — Mathematics

| Column | Value |
|---|---|
| **Class** | 8 |
| **Subject** | Mathematics |
| **Official Source** | NCERT Ganita Prakash — Textbook of Mathematics for Grade 8; Reprint 2026–27 (Part I: 7 chapters; Part II: 7 chapters) |
| **Official Chapters/Units** | 14 chapters — exact titles to be extracted and frozen directly from official PDFs (source complete; extraction pending) |
| **Current SnapSolve Status** | PARTIAL — question bank exists against legacy 14-chapter NCERT structure; not aligned to official Ganita Prakash |
| **Gateway Status** | PARTIAL — registered as `8-Mathematics`; WARN (difficulty distribution); chapter names are legacy |
| **Question Bank Status** | PARTIAL — 979 questions exist; authored against old chapter structure |
| **UI Status** | COMPLETE — Class 8 Mathematics is live and accessible |
| **Freeze Status** | PENDING |
| **Required Action** | Extract exact chapter titles from official Ganita Prakash Grade 8 PDFs; audit alignment with current question bank; update gateway EXPECTED map to official 2026-27 chapter names |

---

### 3.2 Class 8 — Science

| Column | Value |
|---|---|
| **Class** | 8 |
| **Subject** | Science |
| **Official Source** | NCERT Curiosity — Textbook of Science for Grade 8; Reprint 2026–27 |
| **Official Chapters/Units** | 13 chapters — titles to be extracted and frozen directly from official PDF (source complete; extraction pending) |
| **Current SnapSolve Status** | PENDING — no content authored |
| **Gateway Status** | PENDING — `8-Science` not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | BLOCKED |
| **Required Action** | Extract exact chapter titles from official Curiosity Grade 8 PDF; freeze chapter list; register gateway; author questions |

---

### 3.3 Class 8 — Computational Thinking and Artificial Intelligence

| Column | Value |
|---|---|
| **Class** | 8 |
| **Subject** | Computational Thinking and Artificial Intelligence |
| **Official Source** | CBSE Computational Thinking and Artificial Intelligence Curriculum, Classes 3–8; combined official PDF received |
| **Official Chapters/Units** | PENDING — class-wise scope extraction not yet completed |
| **Current SnapSolve Status** | BLOCKED — official chapter/unit list not yet extracted |
| **Gateway Status** | PENDING — not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | BLOCKED |
| **Required Action** | Extract Class 8 scope from official CBSE CT&AI PDF; freeze chapter/unit list; register gateway; author questions |

---

## 4. CLASS 9

### 4.1 Class 9 — Mathematics

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Mathematics |
| **Official Source** | NCERT Ganita Manjari — Textbook of Mathematics for Grade 9; Part I First Edition April 2026 (8 chapters confirmed); Part II pending official NCERT release |
| **Official Chapters/Units** | Part I — 8 chapters: (1) Orienting Yourself: The Use of Coordinates (2) Introduction to Linear Polynomials (3) The World of Numbers (4) Exploring Algebraic Identities (5) I'm Up and Down, and Round and Round (6) Measuring Space: Perimeter and Area (7) The Mathematics of Maybe: Introduction to Probability (8) Predicting What Comes Next: Exploring Sequences and Progressions — Part II: chapters not yet published |
| **Current SnapSolve Status** | PARTIAL — 15 chapter files exist with pre-2026-27 chapter names; 2 new chapters (Sequences and Progressions, Exploring Algebraic Identities) have 0 questions; Part II content not possible until release |
| **Gateway Status** | PARTIAL — registered as `9-Mathematics`; WARN; chapter names stale (8 of 15 misaligned to 2026-27 official names); 3 chapters below 20-question floor |
| **Question Bank Status** | PARTIAL — ~499–584 questions (gateway output is authoritative); old chapter structure; 2 new chapters at 0 questions |
| **UI Status** | COMPLETE — Class 9 Mathematics is live and accessible; chapter names shown are pre-2026-27 |
| **Freeze Status** | PENDING |
| **Required Action** | Update `9-Mathematics` gateway EXPECTED map with official Ganita Manjari Part I chapter names; rename stale repo chapter names; consolidate old ch9+ch12 into "Area and Perimeter"; create and author "Sequences and Progressions" and "Exploring Algebraic Identities" chapter files (≥20q each); top up ch7, ch8, ch15 to ≥20 questions; hold Part II until official NCERT release |

---

### 4.2 Class 9 — Science (Physics domain)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Science — Physics (internal domain; student-facing subject: Science) |
| **Official Source** | NCERT Exploration — Textbook of Science for Grade 9; First Edition April 2026; DEC-007 |
| **Official Chapters/Units** | 4 exam-active chapters: Ch4 Motion · Ch6 Force and Laws of Motion · Ch7 Work, Energy and Simple Machines · Ch10 Sound. Ch3 Gravitation is NOT a chapter in 2026-27 (non-exam; DEC-008). |
| **Current SnapSolve Status** | PARTIAL — 4 exam chapters covered (100 questions); 1 non-exam Gravitation chapter (25 questions) requires product decision on labelling or removal |
| **Gateway Status** | COMPLETE — `9-Physics` registered; PASS (clean); minor name mismatch on ch4 (Work and Energy vs. official Work, Energy and Simple Machines) |
| **Question Bank Status** | PARTIAL — 100 exam-ready questions (4 chapters × 25); ch4 may have Simple Machines sub-topic gap; ch3 Gravitation 25 questions are non-exam |
| **UI Status** | PARTIAL — Physics chapters are accessible to students; Gravitation displayed without non-exam disclaimer (RISK 2) |
| **Freeze Status** | PENDING |
| **Required Action** | Product decision: label Gravitation as enrichment/non-exam or hide (DEC-008 pending); update gateway and repo name for ch4 → "Work, Energy and Simple Machines"; audit ch4 for Simple Machines coverage |

---

### 4.3 Class 9 — Science (Chemistry domain)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Science — Chemistry (internal domain; student-facing subject: Science) |
| **Official Source** | NCERT Exploration — Textbook of Science for Grade 9; First Edition April 2026; DEC-007 |
| **Official Chapters/Units** | 3 exam-active chapters: Ch5 Exploring Mixtures · Ch8 Structure of the Atom · Ch9 Atoms and Molecules. Ch1 Matter in Our Surroundings is NON-EXAM (formative/portfolio only). |
| **Current SnapSolve Status** | PARTIAL — 91 exam-ready questions across 3 exam chapters; quality audit PASS (DEC-014); gateway not yet registered; UI not yet integrated |
| **Gateway Status** | PENDING — `9-Chemistry` not registered in EXPECTED map (BLOCKER 3) |
| **Question Bank Status** | PARTIAL — 91 exam-ready questions: Ch5 Exploring Mixtures 31q · Ch8 Structure of the Atom 30q · Ch9 Atoms and Molecules 30q; Ch1 75 non-exam questions also present |
| **UI Status** | PENDING — Chemistry not yet surfaced to students; requires gateway registration and UI integration |
| **Freeze Status** | PENDING |
| **Required Action** | Register `9-Chemistry` in gateway EXPECTED map (3 exam chapters + Ch1 with `cbseDeleted: true`); integrate Chemistry into student-facing UI |

---

### 4.4 Class 9 — Science (Biology domain)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Science — Biology (internal domain; student-facing subject: Science) |
| **Official Source** | NCERT Exploration — Textbook of Science for Grade 9; First Edition April 2026; DEC-007 |
| **Official Chapters/Units** | 4 exam-active chapters: Ch2 Cell — The Fundamental Unit of Life · Ch3 Tissues · Ch11 Reproduction · Ch12 Diversity in Living Organisms |
| **Current SnapSolve Status** | PARTIAL — Ch2 (The Fundamental Unit of Life) 75 questions authored and verified (DEC-015); Ch3, Ch11, Ch12 have 0 questions; gateway not registered |
| **Gateway Status** | PENDING — `9-Biology` not registered in EXPECTED map (BLOCKER 3) |
| **Question Bank Status** | PARTIAL — 75 questions for Ch2 only; Ch3 Tissues, Ch11 Reproduction, Ch12 Diversity = 0 questions |
| **UI Status** | PARTIAL — Biology is live in `Practice.tsx` but is a dead-end: Ch2 accessible, remaining chapters show 0 questions; no "coming soon" notice (BLOCKER 1) |
| **Freeze Status** | PENDING |
| **Required Action** | IMMEDIATE: Hide unwritten Biology chapters or add "Coming Soon" gate in Practice.tsx (BLOCKER 1); register `9-Biology` in gateway EXPECTED map; author Ch3 Tissues, Ch11 Reproduction, Ch12 Diversity (≥20q each) |

---

### 4.5 Class 9 — Science (Earth Science domain)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Science — Earth Science (internal domain; student-facing subject: Science) |
| **Official Source** | NCERT Exploration — Textbook of Science for Grade 9; First Edition April 2026; DEC-007 |
| **Official Chapters/Units** | 1 exam-active chapter: Ch13 Earth as a System: Energy, Matter and Life. Ch14 Natural Resources is NON-EXAM — do not author questions. |
| **Current SnapSolve Status** | PENDING — no content authored |
| **Gateway Status** | PENDING — no gateway key registered for Earth Science |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | PENDING |
| **Required Action** | Register Ch13 under `9-Science` gateway (or a dedicated `9-EarthScience` key); author ≥20 questions for Ch13; do not author questions for Ch14 (non-exam) |

---

### 4.6 Class 9 — Computer Applications (Code 165)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Computer Applications — Code 165 |
| **Official Source** | CBSE Computer Applications syllabus, Code 165 (official syllabus received; no complete official textbook currently in source library) |
| **Official Chapters/Units** | 3 theory units: Unit 1 Basics of Information Technology · Unit 2 Cyber Safety · Unit 3 Office Tools (Word Processor, Presentation, Spreadsheet). Unit 4 is practical-only; not applicable to theory question bank. |
| **Current SnapSolve Status** | PENDING — not started (P3 priority) |
| **Gateway Status** | PENDING — `9-ComputerApplications` not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | PENDING |
| **Required Action** | After Mathematics and Science launch: register `9-ComputerApplications` in gateway; author Unit 1 ≥15q, Unit 2 ≥10q, Unit 3 ≥30q (covering Word Processor, Presentation, Spreadsheet) |

---

### 4.7 Class 9 — Information Technology (Code 402)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Information Technology — Code 402 |
| **Official Source** | CBSE Information Technology syllabus, Code 402; NCERT Domestic Data Entry Operator — Textbook for Class IX |
| **Official Chapters/Units** | 5 subject-specific units (Part B): B1 Introduction to IT-ITeS Industry · B2 Data Entry and Keyboarding Skills · B3 Digital Documentation · B4 Electronic Spreadsheet · B5 Digital Presentation. B3, B4, B5 carry highest marks (30 of 40 subject-specific marks). |
| **Current SnapSolve Status** | PENDING — not started (P4 priority) |
| **Gateway Status** | PENDING — `9-InformationTechnology` not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | PENDING |
| **Required Action** | After Mathematics and Science launch: register `9-InformationTechnology` in gateway; extract final unit freeze from official documents; author questions prioritising B3, B4, B5 |

---

### 4.8 Class 9 — Artificial Intelligence (Code 417)

| Column | Value |
|---|---|
| **Class** | 9 |
| **Subject** | Artificial Intelligence — Code 417 |
| **Official Source** | CBSE Artificial Intelligence syllabus, Code 417; AI Facilitator Handbook; AI Python Content Manual |
| **Official Chapters/Units** | 5 subject-specific units (Part B): B1 AI Reflection, Project Cycle and Ethics · B2 Data Literacy · B3 Math for AI (Statistics and Probability) · B4 Introduction to Generative AI · B5 Introduction to Python. Unit-by-unit source mapping pending final freeze. |
| **Current SnapSolve Status** | PENDING — not started (P5 priority) |
| **Gateway Status** | PENDING — `9-ArtificialIntelligence` not registered |
| **Question Bank Status** | PENDING — 0 questions |
| **UI Status** | PENDING — not surfaced to students |
| **Freeze Status** | PENDING |
| **Required Action** | After Mathematics and Science launch: register `9-ArtificialIntelligence` in gateway; complete unit-by-unit source mapping from official documents; author questions |

---

## 5. SUMMARY STATUS TABLE

| Class | Subject | Gateway | Q-Bank | UI | Freeze |
|---|---|---|---|---|---|
| 6 | Mathematics | PARTIAL | PARTIAL | COMPLETE | PENDING |
| 6 | Science | PENDING | PENDING | PENDING | PENDING |
| 6 | CT and AI | PENDING | PENDING | PENDING | BLOCKED |
| 7 | Mathematics | PARTIAL | PARTIAL | COMPLETE | PENDING |
| 7 | Science | PENDING | PENDING | PENDING | BLOCKED |
| 7 | CT and AI | PENDING | PENDING | PENDING | BLOCKED |
| 8 | Mathematics | PARTIAL | PARTIAL | COMPLETE | PENDING |
| 8 | Science | PENDING | PENDING | PENDING | BLOCKED |
| 8 | CT and AI | PENDING | PENDING | PENDING | BLOCKED |
| 9 | Mathematics | PARTIAL | PARTIAL | COMPLETE | PENDING |
| 9 | Science — Physics | COMPLETE | PARTIAL | PARTIAL | PENDING |
| 9 | Science — Chemistry | PENDING | PARTIAL | PENDING | PENDING |
| 9 | Science — Biology | PENDING | PARTIAL | PARTIAL | PENDING |
| 9 | Science — Earth Science | PENDING | PENDING | PENDING | PENDING |
| 9 | Computer Applications (165) | PENDING | PENDING | PENDING | PENDING |
| 9 | Information Technology (402) | PENDING | PENDING | PENDING | PENDING |
| 9 | Artificial Intelligence (417) | PENDING | PENDING | PENDING | PENDING |

---

## 6. OUTSTANDING SOURCE EXTRACTIONS REQUIRED BEFORE FREEZE

The following source extractions must be completed from official PDFs already held in the Academic Library before any implementation freeze is possible for the affected subjects.

| # | Subject | Extraction required | Source held |
|---|---|---|---|
| 1 | Class 9 Mathematics Part II | Full chapter list from official NCERT Ganita Manjari Part II | NOT YET RELEASED — awaiting NCERT publication |
| 2 | Class 7 Science | Exact chapter titles from Curiosity Grade 7 PDF | YES |
| 3 | Class 8 Mathematics | Exact chapter titles from Ganita Prakash Grade 8 Part I and Part II PDFs | YES |
| 4 | Class 8 Science | Exact chapter titles from Curiosity Grade 8 PDF | YES |
| 5 | Class 9 Science | Chapter titles from Exploration Grade 9 PDF (to verify DEC-007 list) | YES |
| 6 | Classes 6–8 CT and AI | Class-wise scope from combined CBSE CT&AI PDF | YES |
| 7 | Class 9 AI (417) | Unit-by-unit scope from Code 417 syllabus, Facilitator Handbook, Python Manual | YES |
| 8 | Class 9 IT (402) | Unit-by-unit scope from Code 402 syllabus and NCERT Domestic Data Entry Operator textbook | YES |
| 9 | Class 9 CA (165) | Unit-by-unit scope from Code 165 syllabus | YES (syllabus only; no textbook) |

---

## IMPLEMENTATION FREEZE CHECKLIST

This checklist must be completed for each subject before that subject may be considered ready for freeze. No subject is frozen by this document.

| Subject | Official source verified | Chapter registry verified | Gateway verified | Question bank verified | Adapter verified | Student UI verified | AI lesson verified | Analytics verified | Ready for Freeze |
|---|---|---|---|---|---|---|---|---|---|
| Class 6 Mathematics | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 6 Science | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 6 CT and AI | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 7 Mathematics | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 7 Science | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 7 CT and AI | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 8 Mathematics | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 8 Science | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 8 CT and AI | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Mathematics | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Science — Physics | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Science — Chemistry | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Science — Biology | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Science — Earth Science | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Computer Applications (165) | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Information Technology (402) | □ | □ | □ | □ | □ | □ | □ | □ | □ |
| Class 9 Artificial Intelligence (417) | □ | □ | □ | □ | □ | □ | □ | □ | □ |
