---
name: Implementation Gate
description: Gate rule blocking all question authoring until an official-source curriculum audit exists for the exact subject and grade.
---

## Rule (adopted 2026-07-08)

No new question authoring may begin for any subject or grade until an official-source curriculum audit exists.

**Required evidence:** ncert.nic.in OR cbseacademic.nic.in (or education.gov.in / cbse.gov.in).

**Gate file:** `.local/governance/IMPLEMENTATION_GATE.md`

## Gate states

- `CLEARED` — audit done; authoring allowed
- `PARTIALLY CLEARED` — audit done for confirmed chapters only; authoring allowed only for those chapters
- `BLOCKED` — no official audit; authoring prohibited
- `FROZEN` — curriculum change confirmed but chapter structure not yet published; prohibited until published

## Re-tagging exception

Metadata-only changes (exam ↔ supplementary tag, chapter name, difficulty) do NOT require an audit. They only need the evidence already in the completed baseline audit.

## Verified question counts (corrected 2026-07-08 — supersede all prior reports)

| Subject | Grade | Questions | Exam-aligned | Notes |
|---|---|---|---|---|
| Mathematics | 6 | 1,090 | 1,090 | V2 bank, 14 chapters |
| Mathematics | 7 | 1,129 | 979 | Ch10+Ch15 (150q) non-exam — tag only |
| Mathematics | 8 | 1,054 | 1,054 | V2 bank, 14 chapters |
| Mathematics | 9 | 499 | 499* | Adapter files (NOT V2 bank); prior "0" report was wrong |
| Physics | 9 | 125 | 100 | ch3 Gravitation (25q) non-exam; prior "250" was wrong |
| Chemistry | 9 | 75 | 0 | ch01 only (75q), all non-exam; ch02–04 = 0q |
| Biology | 9 | 0 | 0 | — |
| Economics | 9 | 100 | 0 | Legacy 4-chapter structure, frozen |
| Computer Applications | 9 | 0 | 0 | — |

*Constructions (ch11, 46q) compliance unverified — may be non-exam per CBSE 2022-23 rationalisation.

**IMPORTANT:** Class 9 Maths questions are in ADAPTER FILES at `artifacts/homework-hero/src/data/questions/class9-maths-ch*.ts`, not in V2 bank at `question-bank/questions/mathematics/`. Always check both locations.

## Current gate status per subject/grade (as of 2026-07-08)

| Subject | Grade | Gate | Evidence |
|---|---|---|---|
| Mathematics | 6 | CLEARED | ncert.nic.in femh1 live July 8 2026 |
| Mathematics | 7 | CLEARED | ncert.nic.in gemh1 live July 8 2026 |
| Mathematics | 8 | CLEARED | ncert.nic.in hemh1 live July 8 2026 |
| Mathematics | 9 | CLEARED | CBSE Maths PDF 2026-27; full 15-topic chapter list with marks |
| Physics | 9 | CLEARED | CBSE Science PDF 2026-27; Ch 4,6,7,10 confirmed via section headers + practicals |
| Chemistry | 9 | CLEARED | CBSE Science PDF 2026-27; Ch 5,8,9 confirmed via section headers + practicals |
| Biology | 9 | CLEARED | CBSE Science PDF 2026-27; Ch 2,3,11,12 confirmed via section headers + practicals |
| Computer Applications (Code 165) | 9 | CLEARED | CBSE CA PDF 2026-27; Units 1-3 confirmed |
| Economics (standalone) | 9 | FROZEN | CBSE SS PDF: "Course Structure coming soon"; no chapter list published |

**Why:** Prevents authoring content that may not align with the actual 2026-27 curriculum, which could mislead students during board exam preparation and require costly rework.

**How to apply:** Before any authoring sprint begins, check this file. If the subject/grade is not CLEARED, raise it as a blocker. Update this file whenever a new official audit is completed.
