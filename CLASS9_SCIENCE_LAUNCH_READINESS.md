# CLASS9_SCIENCE_LAUNCH_READINESS.md

**Document type:** Audit only — no code, content, or gateway rules were modified.
**Date:** 2026-07-08
**Scope:** Class 9 Science — Physics, Chemistry, Biology
**Sources used (only these three, per instruction):**
1. Repository (this codebase)
2. `cbseacademic.nic.in` — official curriculum PDF: `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf` ("SCIENCE, Subject Code – 086, Classes IX (2026-27)")
3. `ncert.nic.in` — referenced for textbook identity; the CBSE curriculum PDF above is the authoritative chapter/mark-scheme source and was fetched directly

---

## ⚠️ Headline finding

**The Class 9 Science curriculum was completely restructured for 2026-27** under NCF-SE 2023 / NEP 2020. This is described by CBSE's own materials as the biggest Class 9 curriculum change in over two decades. Chapter numbers, chapter names, and even chapter groupings have changed from the older ("rationalized 2022-23") syllabus that most of the repository's content and prior audit documents were written against.

Most importantly: **"Gravitation" no longer exists as a chapter in the official 2026-27 Class 9 Science curriculum.** It does not appear anywhere in the official Course Structure table or in any of the 12 assessed chapters' detailed key-concepts/learning-outcomes sections. The mass–weight relationship is now a competency (C 2.2) folded into other physics chapters, not a standalone examinable chapter. This directly resolves the dispute left open in `GATEWAY_CHANGE_APPROVAL.md` between `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md` (said "not exam") and `GATEWAY_CHANGE_APPROVAL.md` (disputed it as active) — **both were working from outdated assumptions; the correct 2026-27 answer is that Gravitation is not a chapter at all.**

---

## SECTION A — Official 2026-27 chapter inventory

Source: CBSE Science (Code 086) Classes IX (2026-27) Course Structure, Annual Examination, 80 marks theory + 20 marks internal assessment.

| Official Ch. # | Official Chapter Name | Domain | Unit | Marks (unit total) | Periods | Assessed in Annual Exam? |
|---|---|---|---|---|---|---|
| 1 | Matter in Our Surroundings | Chemistry | — | — | — | **NO** (not listed in any assessed unit) |
| 2 | The Fundamental Unit of Life (Cell) | Biology | I — World of Living | 27 (shared) | 12 | **YES** |
| 3 | Tissues | Biology | I — World of Living | 27 (shared) | 13 | **YES** |
| 4 | Motion | Physics | III — Motion, Force, Work and Sound | 23 (shared) | 13 | **YES** |
| 5 | Exploring Mixtures and their Separation (formerly "Is Matter Around Us Pure") | Chemistry | II — Matter: Its Nature and Behaviour | 25 (shared) | — | **YES** |
| 6 | Force and Laws of Motion | Physics | III — Motion, Force, Work and Sound | 23 (shared) | — | **YES** |
| 7 | Work, Energy and Simple Machines | Physics | III — Motion, Force, Work and Sound | 23 (shared) | — | **YES** |
| 8 | Structure of an Atom | Chemistry | II — Matter: Its Nature and Behaviour | 25 (shared) | 14 | **YES** |
| 9 | Atoms and Molecules | Chemistry | II — Matter: Its Nature and Behaviour | 25 (shared) | 14 | **YES** |
| 10 | Sound | Physics | III — Motion, Force, Work and Sound | 23 (shared) | 11 | **YES** |
| 11 | Reproduction (in Plants and Animals) | Biology | I — World of Living | 27 (shared) | 13 | **YES** |
| 12 | Diversity (in Living Organisms) | Biology | I — World of Living | 27 (shared) | 12 | **YES** |
| 13 | Earth as a System: Energy, Matter & Life | Earth Science (cross-cutting) | IV — Earth as a System | 5 | — | **YES** |
| 14 | Natural Resources | Earth Science / general | — | — | — | **NO** (per curriculum notes: not assessed in annual exam; may be used for Portfolio/Internal Assessment only) |

**Total assessed chapters: 12** (Ch2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13)
**Total non-assessed but present in NCERT scope: 2** (Ch1, Ch14)

By subject (assessed only):

- **Physics: 4 chapters** — Motion (Ch4), Force and Laws of Motion (Ch6), Work Energy and Simple Machines (Ch7), Sound (Ch10)
- **Chemistry: 3 chapters** — Exploring Mixtures and their Separation (Ch5), Structure of an Atom (Ch8), Atoms and Molecules (Ch9)
- **Biology: 4 chapters** — Cell (Ch2), Tissues (Ch3), Reproduction (Ch11), Diversity (Ch12)
- **Earth Science: 1 chapter** — Earth as a System (Ch13) — not Physics/Chemistry/Biology; a new cross-cutting domain, called out separately since it doesn't map to any of the three requested subjects

No standalone "Gravitation" chapter exists anywhere in the official 2026-27 structure.

---

## SECTION B — Repository coverage map

### Physics

| Official 2026-27 Chapter | Exists in repo? | Repo chapter name | Slug | Question count | File |
|---|---|---|---|---|---|
| Ch4 Motion | Y | "Motion" | `motion` | 25 | `artifacts/homework-hero/src/data/questions/class9-physics-ch1.ts` |
| Ch6 Force and Laws of Motion | Y | "Force and Laws of Motion" | `force` | 25 | `.../class9-physics-ch2.ts` |
| Ch7 Work, Energy and Simple Machines | Partial | "Work and Energy" (missing "Simple Machines" — pulley/lever/inclined-plane/mechanical-advantage content) | `work` | 25 | `.../class9-physics-ch4.ts` |
| Ch10 Sound | Y | "Sound" | `sound` | 25 | `.../class9-physics-ch5.ts` |
| — (not an official chapter) | Extra | "Gravitation" | `gravitation` | 25 | `.../class9-physics-ch3.ts` |

Repo Physics total: **5 chapters, 125 questions** (25 per chapter, uniform).

### Chemistry

| Official 2026-27 Chapter | Exists in repo? | Repo chapter name | Question count | File |
|---|---|---|---|---|
| Ch5 Exploring Mixtures and their Separation | Partial (old name/content, not rewritten for new syllabus) | "Is Matter Around Us Pure?" | **0** (empty placeholder array) | `question-bank/questions/chemistry/class9/ch02-is-matter-around-us-pure.ts` |
| Ch8 Structure of an Atom | Y (name matches) | "Structure of the Atom" | **0** (empty placeholder array) | `.../ch04-structure-of-the-atom.ts` |
| Ch9 Atoms and Molecules | Y (name matches) | "Atoms and Molecules" | **0** (empty placeholder array) | `.../ch03-atoms-and-molecules.ts` |
| — (not an official 2026-27 chapter) | Extra | "Matter in Our Surroundings" | **75** (fully authored) | `.../ch01-matter-in-our-surroundings.ts` |

Repo Chemistry total: **4 chapters, 75 questions** — all 75 in the one chapter (Ch1) that is **not** an officially assessed 2026-27 chapter.

### Biology

| Official 2026-27 Chapter | Exists in repo? | Question count | Notes |
|---|---|---|---|
| Ch2 Cell — The Fundamental Unit of Life | N (metadata only, no questions) | 0 | Pedagogical/academic notes exist in `academic-knowledge/subjects/biology/class9.ts` and `gold-standard/biology.ts`, but zero question-bank content |
| Ch3 Tissues | N | 0 | No question file exists at all |
| Ch11 Reproduction | N | 0 | No question file exists at all |
| Ch12 Diversity | N | 0 | No question file exists at all |

Repo Biology total: **0 chapters wired with content, 0 questions.**

---

## Physics — mapping detail (as requested)

**Every repository chapter mapped to official 2026-27 scope:**

| Repo Chapter | Maps to Official Ch. | Match Quality |
|---|---|---|
| Motion | Ch4 Motion | Full match |
| Force and Laws of Motion | Ch6 Force and Laws of Motion | Full match |
| Gravitation | **No official chapter** | No match — chapter does not exist in 2026-27 scope |
| Work and Energy | Ch7 Work, Energy and Simple Machines | Partial match — official chapter also requires Simple Machines (levers, pulleys, inclined plane, mechanical advantage) |
| Sound | Ch10 Sound | Full match |

**Missing topics (official topics with zero repo coverage):**
- Simple machines: pulley, inclined plane, lever, mechanical advantage (M.A. = Load/Effort) — required under official Ch7 but absent from repo's "Work and Energy" chapter.
- Elementary idea of uniform circular motion (explicitly listed under official Ch4 Motion key concepts) — not confirmed present in repo Ch1 topic list (repo topics: Distance and Displacement, Speed and Velocity, Acceleration and Equations of Motion only).

**Extra topics (repo content with no home in official 2026-27 scope):**
- The entire "Gravitation" chapter (25 questions) — mass, weight, universal law of gravitation, free fall, etc. — has no corresponding examinable chapter in 2026-27. This content is not necessarily wrong (gravitation concepts are folded into competency C2.2), but as a standalone chapter it does not map to any official chapter and should not be marketed or scored as one of the "official" Class 9 Physics chapters.

---

## Chemistry — detail (as requested)

**All existing chemistry content mapped:**

| Repo File | Chapter Name in Repo | Status | Official 2026-27 Equivalent |
|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | 75 questions, fully authored | **None** — Ch1 is explicitly outside the assessed unit list in the official Course Structure table |
| `ch02-is-matter-around-us-pure.ts` | Is Matter Around Us Pure? | 0 questions — scaffold/placeholder only, marked `// @ts-nocheck` and "Placeholder — questions to be authored" | Ch5 Exploring Mixtures and their Separation (renamed + recomposed: adds concentration calculations mass/mass, mass/volume, volume/volume % — not in repo's planned topic list) |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules | 0 questions — scaffold/placeholder only | Ch9 Atoms and Molecules — name matches |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom | 0 questions — scaffold/placeholder only | Ch8 Structure of an Atom — name matches |

**Status of Ch01 (75 questions):** Fully authored (concept 12, ncert 18, competency 15, hots 10, previous-year 12, assertion-reason 8; difficulty Easy 30/Medium 30/Hard 15), and wired end-to-end into the frontend via `class9-chemistry.ts` → `index.ts` → `Practice.tsx`. **However, "Matter in Our Surroundings" is not an officially assessed 2026-27 chapter.** All 75 questions currently sit in a chapter that will not appear on the CBSE 2026-27 annual exam. This is the same category of problem the just-completed gateway fix (GC-01/GC-04) addressed for Mathematics — content effort concentrated in a non-exam chapter.

**Status of exam chapters (Ch5, Ch8, Ch9 official):** All three are **0% authored**. Files exist as named scaffolds only (`export const CH0X_..._: QuestionV2[] = [];`), each with a topic-coverage comment block outlining planned topics but no actual question content.

**Exact question counts per chapter:**

| Chapter file | Questions |
|---|---|
| ch01-matter-in-our-surroundings.ts | 75 |
| ch02-is-matter-around-us-pure.ts | 0 |
| ch03-atoms-and-molecules.ts | 0 |
| ch04-structure-of-the-atom.ts | 0 |
| **Total** | **75** |

**Gateway registration status:** Chemistry is **not registered at all** in `scripts/src/curriculumGateway.ts`'s `EXPECTED` map (only `9-Mathematics`, `9-Economics`, `9-Physics` exist there). This means the curriculum-quality gateway currently runs **zero validation** on Chemistry — it cannot catch missing chapters, mis-tagged names, or under-populated chapters for this subject at all.

---

## Biology — detail (as requested)

**Missing structure:**
- No `question-bank/questions/biology/` directory exists (confirmed: only `mathematics/` and `chemistry/` subdirectories exist under `question-bank/questions/`).
- No `class9-biology.ts` or equivalent adapter file exists under `artifacts/homework-hero/src/data/questions/` (the pattern used by Physics and Chemistry).
- No `CLASS9_BIOLOGY_CHAPTERS` / `CLASS9_BIOLOGY_QUESTIONS` exports exist anywhere.

**Missing wiring:**
- `index.ts` (the central question bank registry) does not import or reference any Biology chapter files — Biology is completely absent from `ALL_CHAPTERS` and `ALL_QUESTIONS`.
- `scripts/src/curriculumGateway.ts` has no `9-Biology` entry in its `EXPECTED` map — the gateway cannot audit Biology because it has no ground truth to check against.
- The frontend **does** advertise Biology as a selectable subject: `Practice.tsx` defines `ALL_SUBJECTS` including `"Biology"`, and `data/subjects.ts` defines a full `SubjectConfig` for Biology (icon 🧬, color, topic list: Cell Biology, Genetics, Human Physiology, Plant Physiology, Ecology, Evolution, Biotechnology, …). **This means a student can select "Biology" in the Practice UI and it will resolve to zero chapters and zero questions** — a dead-end selectable option, not an absent one. This is a user-facing gap, not merely a data gap.

**Missing content:**
- Zero questions exist for any of the four officially assessed Biology chapters (Cell, Tissues, Reproduction, Diversity).
- Some pedagogical/planning material exists but is not question content and is not wired to any runtime path:
  - `academic-knowledge/subjects/biology/class9.ts` — learning objectives, NEP competency mappings, CBSE/ICSE outcomes for "The Fundamental Unit of Life" (Cell) and other chapters (metadata/authoring reference only, ~789 lines, not consumed by the question bank).
  - `gold-standard/biology.ts` — one example "gold standard" lesson (`biology-cell-structure-class9`) used as a pedagogy template, not a question bank.
  - `question-bank/blueprints/biology.ts` — a target-count blueprint (e.g. "major: targetTotal 80, by type...") describing how Biology questions *should* eventually be distributed, explicitly marked "Developer-only. Never imported by any runtime service."
- No topic-level breakdowns, no difficulty distributions, no actual question text exist for any Biology chapter.

---

## SECTION C — Missing chapters

| Subject | Official Chapter | Status |
|---|---|---|
| Chemistry | Ch5 Exploring Mixtures and their Separation | Present as empty scaffold only — content missing |
| Chemistry | Ch8 Structure of an Atom | Present as empty scaffold only — content missing |
| Chemistry | Ch9 Atoms and Molecules | Present as empty scaffold only — content missing |
| Biology | Ch2 Cell — The Fundamental Unit of Life | Entirely missing — no file, no wiring |
| Biology | Ch3 Tissues | Entirely missing — no file, no wiring |
| Biology | Ch11 Reproduction | Entirely missing — no file, no wiring |
| Biology | Ch12 Diversity | Entirely missing — no file, no wiring |
| Physics | Ch7 Work, Energy and Simple Machines | Partially missing — "Simple Machines" sub-topic absent from existing "Work and Energy" chapter |

No official chapter is missing for Physics Ch4 (Motion), Ch6 (Force and Laws of Motion), or Ch10 (Sound) — all three exist and are fully authored (25 questions each).

---

## SECTION D — Missing questions

| Subject | Chapter | Official? | Current Qs | Target (repo convention: ~25/chapter Physics, ~75/chapter Chemistry Ch1 baseline, blueprint target 80/chapter Biology) | Gap |
|---|---|---|---|---|---|
| Physics | Motion | Yes | 25 | 25 | 0 |
| Physics | Force and Laws of Motion | Yes | 25 | 25 | 0 |
| Physics | Work, Energy and Simple Machines | Yes | 25 (Simple Machines sub-topic not separately counted) | 25+ | Simple Machines topic questions missing (exact count indeterminate — no topic breakdown exists for this gap) |
| Physics | Sound | Yes | 25 | 25 | 0 |
| Physics | Gravitation | **No** (non-exam) | 25 | 0 (chapter shouldn't be exam-scored) | N/A — not a deficit, a scope mismatch |
| Chemistry | Exploring Mixtures and their Separation | Yes | 0 | ~75 (per repo's own Ch1 authoring baseline) | **~75 questions missing** |
| Chemistry | Structure of an Atom | Yes | 0 | ~75 | **~75 questions missing** |
| Chemistry | Atoms and Molecules | Yes | 0 | ~75 | **~75 questions missing** |
| Chemistry | Matter in Our Surroundings | **No** (non-exam) | 75 | 0 (chapter shouldn't be exam-scored) | N/A — not a deficit, a scope mismatch |
| Biology | Cell | Yes | 0 | ~80 (per Biology blueprint `targetTotal: 80`) | **~80 questions missing** |
| Biology | Tissues | Yes | 0 | ~80 (blueprint-implied) | **~80 questions missing** |
| Biology | Reproduction | Yes | 0 | ~80 (blueprint-implied) | **~80 questions missing** |
| Biology | Diversity | Yes | 0 | ~80 (blueprint-implied) | **~80 questions missing** |

**Total estimated question deficit across the three officially assessed exam chapters missing entirely from Chemistry: ~225 questions.**
**Total estimated question deficit across the four officially assessed exam chapters missing entirely from Biology: ~320 questions.**

(Target figures are estimates derived from the repository's own existing authoring conventions and the Biology blueprint file, not an official CBSE minimum — no official minimum-question-count standard exists in the source materials reviewed.)

---

## SECTION E — Launch blockers

| # | Blocker | Severity | Affected |
|---|---|---|---|
| 1 | Biology has zero content, zero wiring, and zero gateway registration, but **is already exposed as a selectable subject in the Practice UI** — students can select it and get an empty/broken experience. | **BLOCKED** | Biology (all 4 chapters) |
| 2 | All three officially assessed Chemistry exam chapters (Ch5, Ch8, Ch9) are empty scaffolds — 0 questions each. | **BLOCKED** | Chemistry exam readiness |
| 3 | 100% of authored Chemistry content (75 questions) sits in "Matter in Our Surroundings," a chapter that is not assessed in the official 2026-27 annual exam. | **BLOCKED** (content misallocation) | Chemistry |
| 4 | Physics carries a fully-authored "Gravitation" chapter (25 questions) that does not correspond to any official 2026-27 chapter — presented to students as if it were exam-relevant. | **PARTIAL** (misleading, not broken) | Physics |
| 5 | Official Ch7 "Work, Energy **and Simple Machines**" is only partially covered — the "Simple Machines" component (levers, pulleys, inclined plane, mechanical advantage) is not represented in repo's "Work and Energy" chapter. | **PARTIAL** | Physics |
| 6 | Neither Chemistry nor Biology is registered in `scripts/src/curriculumGateway.ts`'s `EXPECTED` map, so the automated curriculum-quality gateway provides **no coverage, no warnings, and no failure detection** for either subject today. | **BLOCKED** (no safety net) | Chemistry, Biology |
| 7 | The entire 2026-27 syllabus restructuring (new chapter numbers/names, Ch13 Earth as a System as a new cross-cutting unit, Ch1/Ch14 removed from assessment) is not reflected anywhere in repository documentation reviewed to date; prior internal docs (e.g. `PROJECT_LAUNCH_CURRICULUM_MAP_2026_27.md`) still reference the older chapter framing and left the Gravitation question open/disputed. | **BLOCKED** (documentation/ground-truth drift) | All three subjects |

**Overall Class 9 Science launch status: BLOCKED.**

- **Physics: PARTIAL** — 3 of 4 official chapters fully covered (Motion, Force and Laws of Motion, Sound); 1 partially covered (Work, Energy and Simple Machines — missing Simple Machines); 1 extra non-exam chapter present (Gravitation).
- **Chemistry: BLOCKED** — 0 of 3 official chapters have any question content; all authored effort (75 questions) is in a non-exam chapter.
- **Biology: BLOCKED** — 0 of 4 official chapters exist in any form; subject is exposed in the UI with nothing behind it.

---

## SECTION F — Recommended implementation order

This section identifies sequencing only — it is not authorization to begin content authoring or code changes under this task.

1. **Documentation/ground-truth correction (no code):** Update internal curriculum-map documents to reflect the actual 2026-27 restructuring found in the official CBSE PDF (new chapter numbers 1–14, Ch13 Earth as a System as a new unit, Ch1 and Ch14 excluded from assessment, Gravitation removed as a standalone chapter). This resolves the standing Gravitation dispute in `GATEWAY_CHANGE_APPROVAL.md` definitively.
2. **Gateway registration (governance, not content):** Register `9-Chemistry` and `9-Biology` in `scripts/src/curriculumGateway.ts`'s `EXPECTED` map so both subjects get the same FAIL/WARN coverage Math/Physics/Economics already have. This should happen *before* content authoring begins, so every new chapter is validated as it's added rather than retroactively.
3. **Biology structural scaffolding:** Create the `question-bank/questions/biology/class9/` directory and the four expected chapter scaffold files (Cell, Tissues, Reproduction, Diversity), plus the `class9-biology.ts` frontend adapter and its registration in `index.ts` — mirroring the exact pattern already used for Chemistry. This unblocks the "Biology is selectable but empty" UX gap even before questions exist (chapters would show a legitimate "coming soon" empty state rather than a silent dead end).
4. **Chemistry exam-chapter authoring:** Author questions for Ch5 (Exploring Mixtures and their Separation — updated for new syllabus content: concentration by mass/mass, mass/volume, volume/volume), Ch8 (Structure of an Atom), and Ch9 (Atoms and Molecules), replacing/supplementing the existing scaffolds.
5. **Biology content authoring:** Author questions for the four Biology chapters, using the existing `question-bank/blueprints/biology.ts` target distribution as the authoring template.
6. **Physics gap-filling:** Add "Simple Machines" topic coverage to the existing Work and Energy chapter (or split into two topics) to fully match official Ch7 scope.
7. **Physics/Chemistry non-exam content decision:** Decide (product decision, not audited here) whether to keep "Gravitation" and "Matter in Our Surroundings" as supplementary/enrichment chapters (clearly labeled non-exam) or deprecate them, now that their non-exam status is confirmed directly from the official source rather than disputed internal notes.

---

## Appendix — Source citations

- CBSE Class 9 Science Curriculum 2026-27, Subject Code 086: `https://cbseacademic.nic.in/web_material/CurriculumMain27/SecPart1/ScienceSt_SecP1_2026-27.pdf` (fetched directly; used for Course Structure table, unit/chapter/mark mapping, per-chapter Key Concepts and Learning Outcomes, and Practicals list which cross-references chapter numbers, e.g. "Ch. 5", "Ch. 9", "Ch. 2", "Ch. 11", "Ch. 7", "Ch.10" — confirming the chapter-numbering scheme used throughout this report).
- Repository files cited: `scripts/src/curriculumGateway.ts`, `artifacts/homework-hero/src/data/questions/index.ts`, `artifacts/homework-hero/src/data/questions/class9-physics-ch{1-5}.ts`, `artifacts/homework-hero/src/data/questions/class9-chemistry.ts`, `question-bank/questions/chemistry/class9/ch0{1-4}-*.ts`, `artifacts/homework-hero/src/data/subjects.ts`, `artifacts/homework-hero/src/pages/Practice.tsx`, `academic-knowledge/subjects/biology/class9.ts`, `gold-standard/biology.ts`, `question-bank/blueprints/biology.ts`.
