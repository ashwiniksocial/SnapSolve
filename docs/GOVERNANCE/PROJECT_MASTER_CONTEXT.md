# PROJECT_MASTER_CONTEXT.md

**Generated:** 2026-07-08
**Document type:** Permanent project memory — single source of truth for all future audits, planning, implementation, and AI handoffs.
**Instruction:** Read this file first. If new evidence conflicts with anything recorded here, flag the conflict, do not implement automatically, and request a governance review.

---

## 1. Product objective

**SnapSolve** is a CBSE-focused learning application for Class 6–9 students.

**Primary goal:** Provide syllabus-aligned question practice, revision, assessment, progress tracking, and AI-assisted learning — anchored entirely to official CBSE and NCERT curriculum.

**Core features (built):**
- **Scan & Solve** — photograph or type a homework question → Tesseract.js OCR → AI step-by-step solution
- **Practice** — multi-class, multi-subject question bank with chapter/topic/difficulty filters and live accuracy tracking
- **Progress** — per-subject analytics, weak topic detection, and study recommendations
- **Question Workspace** — deep-dive per-question workspace with hints, steps, and revision saving
- **Scan History** — last 10 scans with thumbnails, stored in localStorage, revisitable

---

## 2. Launch target

**Target:** Ship before the **2026 Half-Yearly examinations** (CBSE Class 6–9).

**What this means for sequencing:**
- Mathematics is the highest-priority subject across all classes — it has the most complete question bank and the fewest open blockers.
- Science is second priority — Class 9 Science is currently **BLOCKED** (Chemistry and Biology have no exam-ready content; Biology is a live dead-end in the UI).
- Class 9 Computer Applications, IT, and AI are in scope but have not been started — they follow Science in priority.
- No feature or subject may be rushed into launch in a broken or misleading state. A subject that is selectable but empty is worse than one that is hidden.

**Launch-blocking items as of 2026-07-08:**
1. Biology: selectable in UI, zero content, zero wiring → must be hidden or gated before launch
2. Chemistry: 0 of 3 official exam chapters have any questions → must not be surfaced as "Science" coverage
3. Gateway: Chemistry and Biology are unregistered → no automated quality safety net for either subject
4. Documentation: internal curriculum maps still reference the pre-2026-27 chapter structure

---

## 3. Curriculum scope

**Board:** CBSE only.
**Classes:** 6, 7, 8, 9.

### Approved subjects

| Class | Student-facing subject | Internal notes |
|---|---|---|
| 6 | Mathematics | |
| 6 | Science | |
| 6 | Computational Thinking and AI | |
| 7 | Mathematics | |
| 7 | Science | |
| 7 | Computational Thinking and AI | |
| 8 | Mathematics | |
| 8 | Science | |
| 8 | Computational Thinking and AI | |
| 9 | Mathematics | |
| 9 | Science | Physics, Chemistry, Biology are internal domains — not student-facing subjects |
| 9 | Computer Applications (CA) | Subject Code 165 |
| 9 | Information Technology (IT) | Subject Code 402 |
| 9 | Artificial Intelligence (AI) | Subject Code 417 |

### Subject classification rules

**Class 9 Science — internal domain structure:**
Physics, Chemistry, and Biology are not separate product subjects. They are internal content-organisation labels. The student-facing subject is **Science** in all UI, analytics, and reporting. Internal gateway keys (`9-Physics`, `9-Chemistry`, `9-Biology`) are acceptable for governance and tooling but must never appear to the student as top-level subject names.

**Economics — out of scope:**
Class 9 Economics content exists in the repository and passes the curriculum gateway. It is out of approved scope for the current launch. It must not be marketed to students or counted as a coverage milestone. This constraint stands until a formal governance review explicitly reinstates it.

### Implementation priority order

| Priority | Subject | Classes |
|---|---|---|
| 1 | Mathematics | 6, 7, 8, 9 |
| 2 | Science | 6, 7, 8, 9 |
| 3 | Computer Applications (CA) | 9 |
| 4 | Information Technology (IT) | 9 |
| 5 | Artificial Intelligence (AI) | 9 |
| 6 | Computational Thinking and AI | 6, 7, 8 |

---

## 4. Official source rule

All curriculum claims — chapter lists, chapter names, mark schemes, exam scope, subject classification — must be traced to one of the following authoritative sources:

| Source | Domain | URL |
|---|---|---|
| CBSE Academic | Curriculum, syllabi, mark schemes | `cbseacademic.nic.in` |
| NCERT | Textbooks, learning outcomes | `ncert.nic.in` |
| Ministry of Education | Policy, NEP/NCF documents (if required) | `education.gov.in` |

**Non-authoritative sources — discovery only, never evidence:**
Coaching websites (Vedantu, BYJU'S, Unacademy, Toppr, Embibe, etc.), blogs, educational portals, publishers (S. Chand, third-party NCERT reprints), and any third-party syllabus aggregator may be used to discover that a topic or chapter exists, but may never be cited as evidence in any governance, authoring, gateway, or audit decision.

If a claim can only be sourced from a non-authoritative source, it must be flagged for official verification before any implementation proceeds.

**Governance gate — evidence required before:**
- Content authoring (question writing)
- Curriculum auditing (chapter coverage analysis)
- Gateway validation (`EXPECTED` map updates in `curriculumGateway.ts`)
- Metadata updates (chapter names, slugs, subject labels)
- Curriculum scope changes (adding or removing a subject or class)

---

## 5. Teaching philosophy

SnapSolve teaches — it does not merely answer. Every AI-generated solution must serve a student preparing for a CBSE exam, not just resolve the immediate question.

**Core principles:**

- **Step-by-step explanation is the product.** The AI response is a `TeachingLesson` object (not a raw answer string) — it carries structured steps, each with a concept label, worked reasoning, and a student-facing takeaway.
- **Depth is differentiated.** Three depth modes exist — BASIC, STANDARD, ADVANCED — mapped to student profile and question difficulty. Depth must be injected as a system-level override (`DEPTH_SYSTEM_OVERRIDES`); a hint in the user message alone is overridden by field-level floors.
- **Quality is enforced server-side.** Every AI lesson passes through a teaching quality pipeline before reaching the student: reviewed and improved in up to 2 cycles; graceful degradation (original lesson served) on pipeline failure. Students never see an unreviewed raw response.
- **Speed matters.** Standard mode has a hard 15-second AbortController budget. A fallback lesson is served on timeout — the student always gets something useful, never a spinner that never resolves.
- **Personalization is private.** A `studentContext` object (weak topic history, accuracy, class level) is built client-side from localStorage and sent in the request body. It is injected into the AI user message only — never into server-side cached responses, so cached answers are never personalized to the wrong student.
- **Resolution order is fixed:** question bank keyword match → OpenAI via backend → fallback structured guide. The AI is the second resort, not the first.
- **The `AIResponse.source` field** (`"bank" | "openai" | "fallback"`) drives the "AI Generated Solution" badge in the UI — students can always see where their answer came from.

---

## 6. UI philosophy

SnapSolve is a **mobile-first** product. The primary student experience is on a phone, not a desktop.

**Principles:**

- **Mobile-first layout and interaction targets.** All new UI components must be designed for small screens first. Desktop is an enhancement, not the baseline.
- **Never show an empty state that looks like a broken one.** A subject that is selectable but returns zero chapters and zero questions (e.g., Biology today) is a broken experience. Subjects with no content must be hidden, locked, or explicitly labeled "Coming Soon" — not silently empty.
- **Student-facing labels use CBSE terminology.** Chapter names, subject names, and difficulty labels use official NCERT/CBSE language, not coaching-industry terminology. Students and parents recognize the official names.
- **Accuracy and progress are always visible.** Live accuracy tracking, per-chapter stats, and weak-topic detection are first-class UI elements, not secondary screens.
- **Scan is the entry point.** The Scan & Solve flow (camera → OCR → solution) is the product's signature interaction. Practice and Progress are the retention loops. The navigation hierarchy reflects this.
- **Scan History is a trust signal.** The last 10 scans with thumbnails are stored in localStorage and revisitable — students can see that their work is remembered.
- **No unnecessary UI states.** No loading spinners that never resolve. No modals that block navigation. No empty lists without explanation.

---

## 7. Architecture rules

**Stack:** pnpm workspaces, Node.js 24, TypeScript 5.9, React + Vite (frontend), Express 5 (API), PostgreSQL + Drizzle ORM (database), Zod v4 (validation), esbuild (build).

### Non-negotiable rules

| Rule | Reason |
|---|---|
| `OPENAI_API_KEY` is server-side only — never in the browser or any client bundle | Security — key exposure would allow unrestricted API usage at product cost |
| No `console.log` in server code — use `req.log` in route handlers, singleton `logger` elsewhere | Observability — structured logs only; `console.log` is lost in production |
| `index.ts` is the only runtime source of truth for `ALL_CHAPTERS` and `ALL_QUESTIONS` | A subject not imported here does not exist at runtime, regardless of what appears in `subjects.ts` or `Practice.tsx` |
| Two question formats (V1 and V2) coexist — do not mix within a subject | V2 (Classes 6–8 Maths) is converted to V1 shape by `v2adapter.ts`; mixing schemas within one subject's files breaks the adapter |
| Chemistry uses the adapter pattern (`class9-chemistry.ts` → `question-bank/questions/chemistry/class9/`) — Biology must follow the same pattern | Consistency; do not use the Physics V1 per-chapter pattern for Biology |
| No implementation without a confirmed chapter list from an authoritative source | See Section 4 — speculative authoring creates the same misallocation already found in Chemistry Ch1 |
| Do not run `pnpm dev` at the workspace root | Apps run via Replit workflows with injected `PORT` and `BASE_PATH`; root has no `dev` script |
| Verify artifacts with `pnpm --filter @workspace/<slug> run typecheck`, not `build` | `build` requires workflow-provided env vars and fails from bash even when code is correct |

### Question bank layer order

```
question source files  →  class9-{domain}.ts adapter  →  index.ts (ALL_CHAPTERS / ALL_QUESTIONS)
                                                       ↓
                                              Practice.tsx (UI)
```

A subject is only fully wired when it exists at **every layer**. Presence in `subjects.ts` or `Practice.tsx` alone = selectable but empty = broken.

### AI pipeline

```
Student question  →  bank keyword match  →  (if no match) POST /api/solveQuestion
                                                             ↓
                                             OpenAI (15s budget, rate-limited 20/IP/hr)
                                                             ↓
                                             Teaching quality pipeline (≤2 review cycles)
                                                             ↓
                                             TeachingLesson → client
                                                             ↓
                                             (on timeout/failure) fallback structured guide
```

Two-layer cache: client localStorage (avoids backend round-trips) + server in-memory Map (avoids OpenAI charges for repeated questions, 7-day TTL). Personalised responses are never cached server-side.

---

## 8. CEO / CTO constraints

These constraints are permanent operating rules, not temporary workarounds.

| Constraint | What it means in practice |
|---|---|
| **Cash constrained** | No speculative implementation. Every build decision must have confirmed curriculum scope behind it. Do not author questions for a chapter until its official exam-inclusion status is verified. |
| **Time constrained** | Launch speed over completeness. Ship what is correct and evidenced; defer what is not. A subject with 3 of 4 chapters ready ships; it does not wait for the 4th. |
| **No unnecessary rewrites** | Do not refactor working code to accommodate unconfirmed syllabus changes. If a chapter's status is disputed, leave the code unchanged until governance resolves it. |
| **No duplicate audits** | Each subject/class gets one authoritative audit per syllabus cycle. Prior audit results are binding until superseded by a formal governance review with a new official-source citation. |
| **No speculative implementation** | Do not build for a chapter, subject, or feature unless official evidence for that scope is already recorded in this file or in a downstream governance document. Absence of evidence is a stop signal, not a green light. |

---

## 9. Restart protocol

Use this protocol at the start of every new session — AI handoff, developer onboarding, or resumption after a break.

### Step 1 — Read governance documents in order

1. `docs/GOVERNANCE/PROJECT_MASTER_CONTEXT.md` — **this file** (scope, constraints, rules)
2. `docs/GOVERNANCE/PROJECT_STATUS.md` — current per-subject coverage and blockers
3. `docs/GOVERNANCE/DECISION_LOG.md` — recent decisions and their rationale
4. `docs/GOVERNANCE/CHECKPOINT_GATEWAYS.md` — gateway registration state and last verified run

### Step 2 — Establish what is in scope

Confirm the work requested is within the approved subject list (Section 3). If it is not, flag it before proceeding — do not implement out-of-scope work even if the code to do it appears straightforward.

### Step 3 — Confirm evidence exists

Before any authoring, gateway update, or metadata change, confirm an official-source citation exists for the change (Section 4). If the evidence is in a prior governance document, cite that document. If not, stop and collect evidence first.

### Step 4 — Check for open conflicts

Read `DECISION_LOG.md` for any entry marked **BLOCKED** or **PENDING**. Do not build on top of unresolved decisions. If a conflict is discovered between this file and another document, apply the conflict protocol:
1. Flag the conflict explicitly in your response.
2. Do not implement the conflicting change.
3. Request a governance review.

### Step 5 — Run the gateway before and after any change

Before making any curriculum-adjacent change (question authoring, chapter naming, scope updates):
```
pnpm --filter @workspace/scripts run curriculum-check
```
Record the before-state. Run it again after. If the result degrades (new FAIL or new WARN), do not proceed without understanding and documenting the cause.

### Conflict resolution rule

This file takes precedence over all other internal documents in case of conflict. The exception: a downstream governance document that explicitly records a formal governance review superseding a specific entry in this file — in that case, the downstream document's date and official-source citation determine which is current.

---

## Change log

All changes to approved scope, governance rules, or priority order must be recorded here before taking effect.

---

### [2026-07-08] — Initial scope freeze and governance framework established

- Curriculum scope frozen: CBSE Classes 6–9.
- Approved subjects: Mathematics and Science all classes; CT+AI Classes 6–8; CA, IT, AI Class 9.
- Official-sources-only governance rule adopted (`cbseacademic.nic.in`, `ncert.nic.in`, `education.gov.in`).
- Physics, Chemistry, Biology classified as internal Science domains — not student-facing product subjects.
- Economics classified as out of scope pending official curriculum evidence.
- Implementation priority order established: Mathematics → Science → CA → IT → AI → CT+AI (6–8).
- Nine governance sections established in this file: Product objective, Launch target, Curriculum scope, Official source rule, Teaching philosophy, UI philosophy, Architecture rules, CEO/CTO constraints, Restart protocol.
