# Academic Knowledge Architecture

**Developer-only. No runtime code. No runtime imports.**

---

## Purpose

This folder is the **permanent academic foundation** of SnapSolve. It defines, for every chapter in the launch scope, a complete pedagogical record covering:

1. Learning objectives
2. NEP 2020 competency mapping
3. CBSE learning outcomes
4. ICSE learning outcomes
5. Core concepts
6. Subtopics with detail
7. Concept dependency graph
8. Prerequisites (chapter and concept level)
9. Essential definitions
10. Formula inventory
11. Laws, theorems, principles
12. Common misconceptions
13. Examiner traps
14. Typical student mistakes
15. Bloom's taxonomy mapping
16. Difficulty progression
17. Real-life applications
18. Cross-chapter links
19. Cross-subject links
20. Suggested teaching sequence

---

## Scope

| Dimension | Values |
|---|---|
| Classes | 6, 7, 8, 9 |
| Boards | CBSE + ICSE |
| Subjects | Mathematics, Physics, Chemistry, Biology, Computer Science, Economics |
| Total chapters | ~120 across all subjects and classes |

---

## Folder Structure

```
academic-knowledge/
├── README.md                     ← this file
├── types.ts                      ← complete type system (ChapterKnowledge and sub-types)
├── index.ts                      ← barrel export + getAllChapters(), findChapterKnowledge()
└── subjects/
    ├── mathematics/
    │   ├── class6.ts             ← Class 6 Mathematics chapters (14 ch)
    │   ├── class7.ts             ← Class 7 Mathematics chapters (15 ch)
    │   ├── class8.ts             ← Class 8 Mathematics chapters (15 ch)
    │   └── class9.ts             ← Class 9 Mathematics chapters (13 ch)
    ├── physics/
    │   ├── class6.ts             ← Class 6 Physics chapters (from Science)
    │   ├── class7.ts             ← Class 7 Physics chapters
    │   ├── class8.ts             ← Class 8 Physics chapters
    │   └── class9.ts             ← Class 9 Physics chapters (5 ch)
    ├── chemistry/
    │   ├── class6.ts
    │   ├── class7.ts
    │   ├── class8.ts
    │   └── class9.ts             ← Class 9 Chemistry chapters (4 ch)
    ├── biology/
    │   ├── class7.ts
    │   ├── class8.ts
    │   └── class9.ts             ← Class 9 Biology chapters (6 ch)
    ├── computerScience/
    │   ├── class6.ts
    │   ├── class7.ts
    │   ├── class8.ts
    │   └── class9.ts
    └── economics/
        └── class9.ts             ← Class 9 Economics chapters (4 ch)
```

---

## How This Differs from question-bank/

| `question-bank/` | `academic-knowledge/` |
|---|---|
| What to ASK | What to KNOW |
| Question type quotas | Concept dependency graphs |
| Bloom's targets for questions | Bloom's targets for teaching |
| Authoring guidelines | Teaching sequence guidelines |
| ID scheme for questions | Concept node identifiers |

Both reference the same chapter IDs from `question-bank/chapterRegistry.ts`.

---

## How This Is Used

### By question authors
Consult `essentialDefinitions`, `formulaInventory`, `lawsAndTheorems`, `commonMisconceptions`, and `examinerTraps` before writing any question for a chapter. This ensures every question tests real understanding, not surface recall.

### By lesson generation (AI pipeline)
The AI pipeline uses `coreConcepts`, `conceptGraph`, `difficultyProgression`, `teachingSequence`, and `realLifeApplications` to generate context-rich lessons. The Master Teacher Engine reads chapter knowledge to create TeachingBlueprints.

### By quality evaluation (Teaching Quality Pipeline)
The Lesson Reviewer uses `learningObjectives`, `bloomsMap`, `commonMisconceptions`, and `nepCompetencyMap` to evaluate whether a generated lesson meets standards.

### By future content planning
Cross-chapter and cross-subject links drive the recommendation engine — what to study next, and where a concept appears across subjects.

---

## Design Decisions

### One file per subject per class
Keeps file sizes manageable while grouping related chapters. A full Class 9 Mathematics file is ~1,000 lines — readable in one session.

### icseOutcomes stores only DIFFERENCES
If ICSE outcomes for a chapter are identical to CBSE (common for Mathematics and basic Science), `icseOutcomes` is an empty array. Authors only document where ICSE specifically differs — additional content, different depth, or different emphasis.

### conceptGraph uses concept node IDs
Edges use the same concept node ID format as `question-bank/tagging.ts`:
`{subjectCode}:{classNum}:{chapterId}:{kebab-concept-name}`
This links the knowledge graph to the question tagging system.

### Board field
Most chapters are `"Both"` — CBSE and ICSE share the same core concepts for most of the curriculum. Board-specific variations are documented in `icseOutcomes` and `boardNote` fields within definitions.

---

## Adding a New Chapter

1. Find the chapter's `ChapterRecord` in `question-bank/chapterRegistry.ts`.
2. Add a new `ChapterKnowledge` object in the appropriate subject/class file.
3. Export the object from the file and add it to the subject's chapter array.
4. Run `npx tsc --noEmit` from `academic-knowledge/` to validate.
5. The object is automatically included in `getAllChapters()` from the barrel export.

---

## Maintenance

- **Definitions**: If the CBSE or ICSE board changes an official definition, update `formalDefinition` and add/update `boardNote`.
- **Formulas**: If the syllabus changes, update `applicableWhen` and `doesNotApplyWhen`. Never delete a formula — mark it with `examTip: "Removed from syllabus [year]"`.
- **Misconceptions**: Add new misconceptions as they are observed in student work. Each misconception should have an associated `revealingQuestion` that can be added to the question bank.
- **NEP mapping**: When new NEP rules are added to `educationPolicyStandards.ts`, scan all chapter records and add new `NepCompetencyMap` entries where applicable.
