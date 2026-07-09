# CHECKPOINT_GATEWAYS.md

**Document type:** Quality gate registry — defines what must be true for each domain before work is considered ready. Updated after every significant change.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-08
**Run command (curriculum gate):** `pnpm --filter @workspace/scripts run curriculum-check`

A gate is either **OPEN** (all conditions met, work may proceed or is ready), **PARTIAL** (some conditions met, work can proceed with caveats), or **CLOSED** (one or more conditions not met — work in this domain is blocked or must not launch).

---

## Gate 1 — Curriculum gate

**Purpose:** Ensures every chapter in the question bank matches the official 2026-27 CBSE syllabus — correct name, correct exam-inclusion status, minimum question count.

**Conditions:**

| # | Condition | Status |
|---|---|---|
| C1 | All registered chapters match official CBSE/NCERT chapter names exactly | PARTIAL — Chemistry exam chapter names are stale (Ch02 still named "Is Matter Around Us Pure?" not "Exploring Mixtures and their Separation") |
| C2 | All non-exam chapters carry `cbseDeleted: true` in the `EXPECTED` map | PARTIAL — Physics "Gravitation" is confirmed non-exam but has no `cbseDeleted` flag yet |
| C3 | All exam chapters have content above the subject's minimum question floor | PARTIAL — Class 9 Maths: Triangles (19q), Quadrilaterals (17q), Probability (19q) below 20q floor |
| C4 | No chapter in the bank is zero-question and active (non-deleted) | CLOSED — Chemistry Ch02, Ch03, Ch04 are active scaffolds with 0 questions |
| C5 | Chemistry and Biology are registered in the `EXPECTED` map | CLOSED — neither subject is registered |
| C6 | Gateway exits with 0 failures | OPEN — last run: 0 failures (Chemistry/Biology unregistered so not checked) |
| C7 | All authoritative source evidence is on file for every `cbseDeleted` decision | PARTIAL — GC-05 (Class 7 Ch15) blocked pending evidence |

**Overall curriculum gate: CLOSED**
Blocking conditions: C4 (zero-question active chapters), C5 (unregistered subjects).
Note: C6 shows OPEN only because Chemistry and Biology are entirely absent from the gateway — PASS does not mean full coverage.

**Last verified run (2026-07-08):**
```
Subjects audited: Mathematics, Economics, Physics
Chapters audited: 67 | Questions: 3,997
FAILURES: 0 | WARNINGS: 15
CURRICULUM GATEWAY: PASS — 15 warning(s), 0 failures
```

---

## Gate 2 — Question bank gate

**Purpose:** Ensures the question bank has sufficient, correctly-structured content to deliver a meaningful practice session for every subject and class in the approved scope.

**Conditions:**

| # | Condition | Class 6 Maths | Class 7 Maths | Class 8 Maths | Class 9 Maths | Class 9 Physics | Class 9 Chemistry | Class 9 Biology |
|---|---|---|---|---|---|---|---|---|
| Q1 | All official exam chapters have at least one question | OPEN | OPEN | OPEN | OPEN | OPEN | **CLOSED** | **CLOSED** |
| Q2 | No subject is selectable in the UI with zero backing content | OPEN | OPEN | OPEN | OPEN | OPEN | OPEN | **CLOSED** |
| Q3 | Questions are distributed across difficulty levels (Easy/Medium/Hard) | OPEN | OPEN | OPEN | OPEN | OPEN | N/A (no content) | N/A |
| Q4 | At least one question per official topic within each chapter | OPEN | OPEN | OPEN | PARTIAL (some under-count chapters) | PARTIAL (Simple Machines missing) | **CLOSED** | **CLOSED** |
| Q5 | Content is authored against the 2026-27 syllabus (not a prior year's chapter structure) | OPEN | OPEN | OPEN | OPEN | PARTIAL (Gravitation is pre-2026-27) | PARTIAL (Ch01 is non-exam; exam chapters empty) | N/A |

**Overall question bank gate: CLOSED**
Blocking conditions: Chemistry has 0 questions in 3 of 3 official exam chapters. Biology has 0 questions across all 4 chapters and is a live dead-end in the UI.

**Question counts (last verified 2026-07-08):**

| Subject | Official exam chapters | Questions in exam chapters | Total questions |
|---|---|---|---|
| Class 6 Maths | 14 | 1,090 | 1,090 |
| Class 7 Maths | 13 active | 979 | 979 |
| Class 8 Maths | 13 active | 979 | 979 |
| Class 9 Maths | 14 active | ~565 (3 chapters slightly under floor) | 584 |
| Class 9 Physics | 4 official | 100 (Gravitation 25q non-exam excluded) | 125 |
| Class 9 Chemistry | 3 official | **0** | 75 (all non-exam) |
| Class 9 Biology | 4 official | **0** | 0 |

---

## Gate 3 — Teaching quality gate

**Purpose:** Ensures every AI-generated lesson is reviewed, pedagogically sound, and reaches the student in a structured, depth-appropriate format — never a raw LLM string.

**Conditions:**

| # | Condition | Status |
|---|---|---|
| T1 | All AI responses use the `TeachingLesson` object (not raw steps[]) | OPEN — TeachingLesson architecture is complete and deployed |
| T2 | Every lesson passes through the server-side quality pipeline before reaching the student | OPEN — Teaching quality pipeline is live (max 2 review cycles, graceful degradation) |
| T3 | Depth differentiation (BASIC/STD/ADV) is enforced via system-level override | OPEN — `DEPTH_SYSTEM_OVERRIDES` implemented |
| T4 | Standard mode respects the 15-second AbortController budget; fallback lesson served on timeout | OPEN — implemented and tested (9.6–10.8 s across all four test categories) |
| T5 | Personalized responses are never served from server-side cache | OPEN — studentContext injected into user message only; server cache contains only non-personalized responses |
| T6 | Bank and fallback entries still render correctly under the legacy renderer | OPEN — steps[] renderer retained alongside TeachingLesson renderer |
| T7 | `AIResponse.source` field (`"bank" | "openai" | "fallback"`) is present on every response | OPEN — field is set on all resolution paths |

**Overall teaching quality gate: OPEN**
All conditions met. No blocking items. Teaching pipeline is the most complete subsystem in the product.

---

## Gate 4 — UI gate

**Purpose:** Ensures the student-facing interface is accurate, non-misleading, and presents only subjects and chapters that have backing content.

**Conditions:**

| # | Condition | Status |
|---|---|---|
| U1 | No subject is selectable in the Practice UI without backing content in `index.ts` | **CLOSED** — Biology is listed in `ALL_SUBJECTS` (`Practice.tsx`) with zero content in `index.ts` |
| U2 | Non-exam chapters are labeled as enrichment/non-exam in the UI | **CLOSED** — Gravitation and Chemistry Ch01 ("Matter in Our Surroundings") carry no disclaimer |
| U3 | Student-facing subject names use official CBSE terminology, not internal domain labels | OPEN — Physics/Chemistry/Biology are not surfaced as top-level subjects (correct) |
| U4 | Progress and accuracy tracking reflects only officially exam-relevant chapters | PARTIAL — Gravitation is included in Physics progress tracking despite being non-exam |
| U5 | Scan History renders correctly with thumbnails (last 10 scans, localStorage) | OPEN — feature complete |
| U6 | All pages are mobile-first and functional on small screens | OPEN — mobile-first design applied |

**Overall UI gate: CLOSED**
Blocking conditions: U1 (Biology dead-end), U2 (non-exam chapters unlabeled).

---

## Gate 5 — AI gate

**Purpose:** Ensures the AI pipeline is secure, rate-limited, cost-controlled, and reliably delivers useful responses across all question types.

**Conditions:**

| # | Condition | Status |
|---|---|---|
| A1 | `OPENAI_API_KEY` is server-side only — not present in any client bundle or browser environment | OPEN — key lives only in `api-server/src/routes/solveQuestion.ts` |
| A2 | Rate limiting is enforced (20 requests/IP/hour) | OPEN — implemented in API route |
| A3 | Server-side cache prevents duplicate OpenAI charges for repeated questions (7-day TTL) | OPEN — in-memory Map cache implemented |
| A4 | Client-side localStorage cache prevents unnecessary backend round-trips | OPEN — implemented |
| A5 | Resolution order is enforced: bank → OpenAI → fallback | OPEN — order is fixed in solver logic |
| A6 | OCR pipeline (Tesseract.js) produces usable input for the solver | OPEN — Confidence Engine implemented; OCR confidence threads through session into solver |
| A7 | Adaptive engine reads student context correctly (3 localStorage keys) | OPEN — Adaptive Engine is complete; no other hooks called from within it |
| A8 | Student model (7 services) persists and retrieves data correctly from localStorage | OPEN — Firestore-ready data shapes implemented |
| A9 | No student-specific context leaks into cached responses | OPEN — personalization injected into user message only; cache key is question-only |

**Overall AI gate: OPEN**
All conditions met. AI pipeline is secure, rate-limited, and functionally complete.

---

## Gate 6 — Architecture gate

**Purpose:** Ensures the codebase structure, TypeScript safety, and build pipeline are sound — no silent type errors, no broken imports, no format mismatches.

**Conditions:**

| # | Condition | Status |
|---|---|---|
| AR1 | `pnpm run typecheck` exits 0 across all workspace packages | OPEN — last verified after GC-01/GC-04 gateway fixes |
| AR2 | No `console.log` in server code — structured logger used everywhere | OPEN — enforced by convention |
| AR3 | Chemistry scaffold files (`ch02`, `ch03`, `ch04`) have `// @ts-nocheck` suppressing type errors — these must be cleaned before authoring | PARTIAL — `// @ts-nocheck` present; acceptable for empty scaffolds, must be removed before questions are added |
| AR4 | V1 and V2 question formats are not mixed within a single subject's files | OPEN — Classes 6–8 use V2 (via adapter); Class 9 uses V1 directly |
| AR5 | Every new subject wired in all three layers: source files, `class9-{domain}.ts` adapter, `index.ts` | PARTIAL — Chemistry is wired; Biology is missing all three layers |
| AR6 | `parseV1Meta` regex in `curriculumGateway.ts` uses correct patterns (`[^{]*`, `[^"]+`) | OPEN — correct patterns confirmed after prior bug fix |
| AR7 | OpenAPI spec is the contract between frontend and API — Orval-generated hooks used for all API calls | OPEN — codegen pipeline in place |
| AR8 | No artifact imports another artifact directly — shared code goes via `lib/` packages | OPEN — architecture enforced by workspace structure |

**Overall architecture gate: PARTIAL**
No blocking failures. AR3 and AR5 are known partial states that must be resolved before Chemistry or Biology authoring begins.

---

## Gate 7 — Release gate

**Purpose:** The final checklist. All conditions must be OPEN before any subject or class is released to students.

**Conditions:**

| # | Condition | Mathematics | Class 9 Physics | Class 9 Chemistry | Class 9 Biology |
|---|---|---|---|---|---|
| R1 | Curriculum gate: 0 failures, all official chapters registered | OPEN (warnings only) | OPEN | **CLOSED** | **CLOSED** |
| R2 | Question bank gate: all official exam chapters have content | OPEN | OPEN | **CLOSED** | **CLOSED** |
| R3 | Teaching quality gate: all AI responses use TeachingLesson pipeline | OPEN | OPEN | OPEN (pipeline ready) | OPEN (pipeline ready) |
| R4 | UI gate: subject is not selectable without content; non-exam chapters labeled | OPEN | PARTIAL (Gravitation unlabeled) | OPEN (not surfaced yet) | **CLOSED** (selectable, empty) |
| R5 | AI gate: all pipeline conditions met | OPEN | OPEN | OPEN | OPEN |
| R6 | Architecture gate: typecheck passes, no broken wiring | OPEN | OPEN | PARTIAL (// ts-nocheck on scaffolds) | **CLOSED** (not wired at all) |
| R7 | Official source evidence on file for every curriculum decision in scope | OPEN | OPEN | OPEN | OPEN |
| R8 | Gateway registered and passing with 0 failures | OPEN | OPEN | **CLOSED** (not registered) | **CLOSED** (not registered) |

**Release gate summary:**

| Subject / Domain | Release gate | Reason |
|---|---|---|
| Mathematics (Classes 6–9) | **OPEN** | Ready to launch. Warnings are non-blocking. |
| Class 9 Physics | **PARTIAL** | Launchable with caveats: Gravitation needs a non-exam label; Simple Machines gap is not a blocker for initial launch. |
| Class 9 Chemistry | **CLOSED** | 0 questions in all 3 official exam chapters. Not launchable. |
| Class 9 Biology | **CLOSED** | Zero content, zero wiring, live dead-end in UI. Must not launch in current state. |
| Class 9 Science (unified) | **CLOSED** | Chemistry and Biology are both closed. |

---

## Gate status summary

| Gate | Status | Blocking items |
|---|---|---|
| 1. Curriculum gate | **CLOSED** | Chemistry/Biology unregistered; Chemistry exam chapters have 0 questions |
| 2. Question bank gate | **CLOSED** | Chemistry: 0 exam questions; Biology: 0 questions, live UI dead-end |
| 3. Teaching quality gate | **OPEN** | None |
| 4. UI gate | **CLOSED** | Biology selectable with no content; non-exam chapters unlabeled |
| 5. AI gate | **OPEN** | None |
| 6. Architecture gate | **PARTIAL** | Biology not wired; Chemistry scaffolds have ts-nocheck |
| 7. Release gate | **PARTIAL** | Mathematics open; Physics partial; Chemistry and Biology closed |
