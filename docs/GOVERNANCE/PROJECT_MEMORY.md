# PROJECT_MEMORY.md

**Document type:** Persistent project memory — durable facts, architectural decisions, and sharp edges any future session must know without re-reading the full codebase.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-08

---

## How to use this file

Read this before any planning, auditing, or implementation session. It records what the code alone cannot tell you — decisions, rationale, and known sharp edges. For current per-subject status, see `PROJECT_STATUS.md`. For the decision audit trail, see `DECISION_LOG.md`.

---

## Architecture

### Question bank layers

| Layer | Location | Role |
|---|---|---|
| Question source files | `artifacts/homework-hero/src/data/questions/class{N}-{subject}[-ch{N}].ts` | Raw question content, authored |
| Central registry | `artifacts/homework-hero/src/data/questions/index.ts` | `ALL_CHAPTERS` + `ALL_QUESTIONS` exports — the only runtime source of truth |
| V2 adapter | `artifacts/homework-hero/src/data/questions/v2adapter.ts` | Converts Classes 6–8 Maths (V2 format) into the V1-compatible shape used by index.ts |
| Subject config | `artifacts/homework-hero/src/data/subjects.ts` | UI display metadata (icon, color, topic list) per subject — purely presentational |
| Practice page | `artifacts/homework-hero/src/pages/Practice.tsx` | Declares `ALL_SUBJECTS` — the list of subjects visible to students in the UI |

**Critical rule:** A subject is only fully wired when it appears in ALL of: source files, index.ts `ALL_CHAPTERS`/`ALL_QUESTIONS`, and (for Class 9 Science domains) the `class9-{domain}.ts` adapter. Being in `subjects.ts` or `Practice.tsx` alone means it is selectable in the UI but returns empty — which is worse than being hidden.

### Question bank file naming conventions

| Pattern | Used for |
|---|---|
| `class9-physics-ch{N}.ts` | Class 9 Physics (V1 format, 5 files: ch1–ch5) |
| `class9-chemistry.ts` | Class 9 Chemistry (single adapter; pulls from `question-bank/questions/chemistry/class9/`) |
| `class9-{N}-maths.ts` | Does not exist — Classes 6–8 Maths use `class{N}-maths.ts` via V2 adapter |
| `class9-maths-ch{N}.ts` | Class 9 Maths (V1 format, 15 files: ch1–ch15) |
| `class9-economics-ch{N}.ts` | Class 9 Economics (V1 format, 4 files: ch1–ch4) |

### Two-format coexistence

- Classes 6–8 Maths use **V2 format** (question objects with a different schema, stored under `question-bank/questions/mathematics/class{N}/`). The `v2adapter.ts` converts them into the runtime V1 shape.
- Class 9 and all other subjects currently use **V1 format** directly.
- Do not mix formats within a single subject's chapter files.

### Curriculum gateway

- Located at `scripts/src/curriculumGateway.ts`
- The `EXPECTED` map is the governance ground truth for chapter names and exam-inclusion status
- `cbseDeleted: true` on a chapter entry exempts it from minimum-question floors and marks it as non-exam
- Currently registered keys: `6-Mathematics`, `7-Mathematics`, `8-Mathematics`, `9-Mathematics`, `9-Economics`, `9-Physics`
- Currently **not** registered: `9-Chemistry`, `9-Biology`, `9-Science` (unified), any Class 6–8 non-Maths subject
- Command: `pnpm --filter @workspace/scripts run curriculum-check`

### AI solve pipeline

- Frontend: `artifacts/homework-hero/src/services/ai/` — OCR (Tesseract.js), topic matching, backend client
- Backend: `artifacts/api-server/src/routes/solveQuestion.ts` — OpenAI proxy, 20 req/IP/hr rate limit, 7-day server-side cache, 15 s timeout
- Resolution order: question bank keyword match → OpenAI via backend → fallback structured guide
- `AIResponse.source` field (`"bank" | "openai" | "fallback"`) drives the "AI Generated Solution" badge
- `OPENAI_API_KEY` is server-side only — never exposed to the browser

---

## Architectural decisions

### Physics/Chemistry/Biology are internal domains, not student-facing subjects

The student-facing product subject is **Science**. Physics, Chemistry, and Biology exist only as internal labels for organizing content. The gateway keys `9-Physics`, `9-Chemistry`, `9-Biology` are acceptable for internal governance but must never surface to the student as top-level subject names.

**Why:** Product decision (2026-07-08) — simplifies UI, matches how CBSE presents Class 9 Science to students. See `PROJECT_MASTER_CONTEXT.md`.

### Economics is out of scope

Class 9 Economics content exists in the repository (4 chapters, ~4 files, fully authored). It is registered in the curriculum gateway and passes all checks. However, Economics is **not in the approved product scope** as of 2026-07-08 governance freeze. The content may be retained as legacy but must not be marketed, surfaced prominently, or treated as a coverage milestone.

**Why:** Scope freeze decision — cash/time constraints require focus on Maths + Science + Class 9 tech subjects first.

### Chemistry Ch1 ("Matter in Our Surroundings") is fully authored but non-exam

75 questions, fully authored, live-wired end-to-end. However, CBSE 2026-27 Science curriculum explicitly places "Matter in Our Surroundings" (Ch1) outside all assessed units. This is the same content-misallocation pattern found (and corrected) in Mathematics.

**Why it matters:** All 75 authored Chemistry questions are effectively in an enrichment chapter, not an exam chapter. Authoring for exam chapters (Ch5, Ch8, Ch9) has not started.

### Gravitation is not a 2026-27 Science chapter

25 questions authored, fully wired as `class9-physics-ch3.ts`. Confirmed by direct fetch of the CBSE 2026-27 Science PDF — no "Gravitation" chapter exists anywhere in the 14-chapter structure. Mass/weight concepts are folded into competency C 2.2 inside other chapters.

**Current state:** No `cbseDeleted` flag is set on the Physics Gravitation entry in the gateway. The chapter is currently presented to students without any non-exam disclaimer. This is a product decision pending, not an audit gap.

### Biology is a live dead-end in the UI

`Practice.tsx` lists "Biology" in `ALL_SUBJECTS`. `subjects.ts` has a full `SubjectConfig` for Biology. But `index.ts` has zero Biology imports — selecting Biology in the Practice UI returns zero chapters and zero questions. This is worse than hiding the subject.

**Immediate action needed:** Either hide Biology in the UI or show a "Coming Soon" state. This fix does not require any content authoring.

---

## Chapter name mappings (repo vs. official 2026-27)

### Physics (5 repo chapters → 4 official)

| Repo file | Repo chapter name | Official 2026-27 | Status |
|---|---|---|---|
| `class9-physics-ch1.ts` | Motion | Ch4 Motion | Full match |
| `class9-physics-ch2.ts` | Force and Laws of Motion | Ch6 Force and Laws of Motion | Full match |
| `class9-physics-ch3.ts` | Gravitation | — | No official chapter |
| `class9-physics-ch4.ts` | Work and Energy | Ch7 Work, Energy and Simple Machines | Partial — Simple Machines sub-topic missing |
| `class9-physics-ch5.ts` | Sound | Ch10 Sound | Full match |

### Chemistry (4 repo files → 3 official exam chapters)

| Repo file | Repo chapter name | Official 2026-27 exam chapter | Status |
|---|---|---|---|
| `ch01-matter-in-our-surroundings.ts` | Matter in Our Surroundings | — (not assessed) | Non-exam, fully authored |
| `ch02-is-matter-around-us-pure.ts` | Is Matter Around Us Pure? | Ch5 Exploring Mixtures and their Separation | Empty scaffold, name stale |
| `ch03-atoms-and-molecules.ts` | Atoms and Molecules | Ch9 Atoms and Molecules | Empty scaffold |
| `ch04-structure-of-the-atom.ts` | Structure of the Atom | Ch8 Structure of an Atom | Empty scaffold |

### Biology (0 repo files → 4 official exam chapters)

| Official 2026-27 exam chapter | Repo file | Status |
|---|---|---|
| Ch2 Cell — The Fundamental Unit of Life | — | Entirely missing |
| Ch3 Tissues | — | Entirely missing |
| Ch11 Reproduction in Plants and Animals | — | Entirely missing |
| Ch12 Diversity in Living Organisms | — | Entirely missing |

---

## Known sharp edges

1. **Gateway PASS ≠ full Science coverage.** Chemistry and Biology are unregistered — the gateway PASS result covers only Mathematics, Economics, and Physics. Any status report showing "GATEWAY: PASS" is accurate but incomplete.
2. **Two question-count discrepancy between scripts.** `curriculum-check` and `status` report different counts for Class 9 Maths (499 vs. 584). Pre-existing, not introduced by any recent change. Root cause: the two scripts count from different source representations. Do not treat either as canonical without investigation.
3. **Chemistry chapter files have `// @ts-nocheck`.** The three empty Chemistry exam-chapter scaffolds (`ch02`, `ch03`, `ch04`) are suppressed with `// @ts-nocheck`. Any authoring pass must clean these up.
4. **Biology blueprint (`question-bank/blueprints/biology.ts`) is developer-only.** Explicitly marked "Never imported by any runtime service." It describes authoring targets but is not wired to any runtime path.
5. **V2 Chemistry adapter pattern.** Chemistry uses a different wiring pattern from Physics: source files live under `question-bank/questions/chemistry/class9/` and are assembled by `class9-chemistry.ts`. Biology should follow this same pattern, not the Physics (V1 per-chapter) pattern.
6. **`parseV1Meta` regex constraints.** The `curriculumGateway.ts` parser uses `[^{]*` (not `[^}]*`) to stop before topics, and `[^"]+` (not `[^"']+`) for strings with apostrophes. Do not alter these without re-running the curriculum check on all subjects — prior bug introduced non-matches for apostrophe-containing chapter names.
