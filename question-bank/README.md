# SnapSolve Question Bank — Architecture

**Developer and content author reference. No runtime code.**

---

## Purpose

This folder defines the **architecture, metadata schema, tagging taxonomy, and authoring standards** for the SnapSolve question bank. It is the single source of truth for how questions are structured, categorised, and quality-gated.

The actual question files live in:
```
artifacts/homework-hero/src/data/questions/
```

This architecture folder tells question authors **what to write** and **how to write it** — not what questions to write. Questions are authored separately and stored in the runtime folder above.

---

## Scope

| Dimension | Values |
|---|---|
| Classes | 6, 7, 8, 9 |
| Boards | CBSE, ICSE (most content applies to Both) |
| Subjects | Mathematics, Physics, Chemistry, Biology, Computer Science, Economics |
| Scale target | 500–1000 questions per chapter |
| Total (at full scale) | ~30,000–60,000 questions |

---

## Folder Structure

```
question-bank/
├── README.md             ← this file
├── types.ts              ← complete type system (QuestionV2, SubjectBlueprint, ...)
├── tagging.ts            ← ID scheme, type descriptions, Bloom's descriptions, tag vocabulary
├── chapterRegistry.ts    ← canonical list of every chapter across all subjects/classes
├── authoringGuide.md     ← step-by-step guide for question authors
├── index.ts              ← barrel export + BankCoverage summary
└── blueprints/
    ├── mathematics.ts    ← quotas, constraints, authoring notes for Mathematics
    ├── physics.ts        ← same for Physics
    ├── chemistry.ts      ← same for Chemistry
    ├── biology.ts        ← same for Biology
    ├── computerScience.ts← same for Computer Science
    └── economics.ts      ← same for Economics
```

---

## Key Design Decisions

### 1. QuestionV2 is a superset of QuestionV1

The existing 150 Class 9 Mathematics questions use `QuestionV1` (defined in `artifacts/homework-hero/src/data/questions/types.ts`). All new questions use `QuestionV2`. The runtime type will be migrated to V2 when the second subject is added.

Migration path:
- V1 → V2 requires adding: `schemaVersion`, `board`, `questionType` (mapped from old values), `questionFormat`, `bloomsLevel`, `marks`, `estimatedTimeMinutes`, `conceptsCovered`, `prerequisites`, `commonErrors`, `source`.
- The old `questionType` values (`"MCQ"` etc.) become `questionFormat` in V2. The new `questionType` is the pedagogical purpose.

### 2. Blueprint-driven quota management

Every chapter has a `category` (major / standard / minor / brief). Each subject blueprint maps categories to question-type quotas. This means:

- Adding a new chapter = add a `ChapterRecord` to `chapterRegistry.ts` with the right category
- The quota targets are automatically known from the blueprint
- No per-chapter quota file needed

### 3. Concept node graph for deduplication

Every question tags its `conceptsCovered` with specific concept node IDs (e.g. `mth:9:ch01:proof-by-contradiction`). Before adding a new question, authors search by concept node to ensure no duplication at the same Bloom's level.

### 4. Board applicability is explicit

Every question has a `board` field (`"CBSE"`, `"ICSE"`, or `"Both"`). Most concept and NCERT-style questions are `"Both"`. ICSE-style questions are `"ICSE"`. Board-specific previous-year questions carry the specific board.

### 5. No runtime integration yet

This architecture defines the schema and targets. The actual question authoring, validation, and runtime integration are separate workstreams.

---

## The Nine Question Types

| Type | Code | Purpose | Bloom's |
|---|---|---|---|
| `concept` | `con` | Foundational understanding — WHAT and WHY | remember, understand |
| `ncert` | `nce` | NCERT exercise pattern | understand, apply |
| `icse` | `ics` | ICSE-style rigour | apply, analyse |
| `competency` | `cmp` | NEP-aligned — student selects the method | apply, analyse |
| `hots` | `hot` | Higher-order thinking | analyse, evaluate, create |
| `previous-year` | `pyq` | Real exam training | mixed |
| `case-study` | `cst` | Passage-based multi-part | apply, analyse, evaluate |
| `assertion-reason` | `asr` | A + R logical evaluation | understand, analyse, evaluate |
| `olympiad` | `oly` | Enrichment beyond syllabus | analyse, evaluate, create |

---

## Scale Targets by Chapter Category

| Category | Target total | When to use |
|---|---|---|
| major | 75–100 | Core, high-weightage chapters (e.g. Triangles, Motion, Organic Chemistry) |
| standard | 50–75 | Standard chapters tested in every board exam |
| minor | 30–50 | Short or lower-weightage chapters |
| brief | 15–30 | Introductory or supplementary chapters |

See each subject's blueprint file for the exact per-type breakdown within each category.

---

## Chapter Registry

`chapterRegistry.ts` contains every chapter for every subject/class combination, with:
- Canonical chapter ID (`ch01`, `ch02`, ...)
- Board applicability
- Category (major / standard / minor / brief)
- Topics with minimum question counts
- Applicable question types
- Board-specific notes where CBSE and ICSE differ

Total chapters at full scope: ~200 chapters across 6 subjects × 4 classes.

---

## Current State vs. Target

| | Current | Target |
|---|---|---|
| Schema | QuestionV1 (15 fields) | QuestionV2 (30+ fields) |
| Classes | Class 9 only | Classes 6–9 |
| Subjects | Mathematics only | 6 subjects |
| Questions | 150 (10 per chapter) | 500–1000 per chapter |
| Board | CBSE only | CBSE + ICSE |
| Question types | 5 (MCQ/Short/Long/HOTS/PYQ) | 9 types |
| Bloom's tagging | None | All questions tagged |
| Concept nodes | None | Full prerequisite graph |

---

## Adding a New Chapter

1. Add a `ChapterRecord` to `chapterRegistry.ts` with the correct chapter ID, category, and topics.
2. Create a new question file at `artifacts/homework-hero/src/data/questions/{classNum}-{subject}-{chapterId}.ts`.
3. Follow the authoring guide in `authoringGuide.md`.
4. Use the subject blueprint in `blueprints/{subject}.ts` to determine quota targets.
5. Validate with the completeness checklist in `authoringGuide.md` Section 5.
6. Update the chapter's `questionCount` in its `topics` array as questions are added.

## Adding a New Subject

1. Add the subject to `SupportedSubject` in `types.ts` and `SUBJECT_CODES` in `tagging.ts`.
2. Add chapters for all 4 classes to `chapterRegistry.ts`.
3. Create `blueprints/{subject}.ts`.
4. Create question files for each chapter.
5. Migrate the runtime type to QuestionV2 before adding questions to the frontend.
