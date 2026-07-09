# PROJECT_STRUCTURE.md

**Document type:** Repository structure reference — what exists, where it lives, what it does.
**Governance authority:** `PROJECT_MASTER_CONTEXT.md`
**Last updated:** 2026-07-09
**Note:** This document describes actual repository contents. It is not a plan. If a directory or file is listed here, it exists. If a subject or feature is not listed here, it has not been built yet.

---

## Root layout

```
/
├── artifacts/                  # Deployable applications (frontend, backend, dev tooling)
│   ├── api-server/             # Express 5 API — AI proxy, auth, admin routes
│   ├── homework-hero/          # React + Vite frontend — the student-facing app
│   └── mockup-sandbox/         # Vite dev server for component preview (dev only)
│
├── lib/                        # Shared TypeScript libraries (composite, emit declarations)
│   ├── api-client-react/       # Orval-generated React Query hooks
│   ├── api-spec/               # OpenAPI 3 spec (openapi.yaml) — the API contract
│   ├── api-zod/                # Orval-generated Zod schemas
│   └── db/                     # Drizzle ORM schema + database client
│
├── question-bank/              # Raw question source files (separate from runtime registry)
│   ├── blueprints/             # Authoring target descriptors per subject (developer-only)
│   └── questions/              # Source content for multi-file subjects
│       ├── mathematics/        # V2-format maths questions (class6/, class7/, class8/)
│       └── chemistry/          # Class 9 Chemistry source files (class9/)
│
├── academic-knowledge/         # Subject knowledge base — curriculum facts, not questions
│   └── subjects/               # Per-subject reference files
│       ├── mathematics/        # class6.ts, class7.ts, class8.ts, class9.ts
│       ├── physics/            # class9.ts
│       ├── chemistry/          # (present)
│       ├── biology/            # class9.ts
│       ├── economics/          # (present)
│       └── computerScience/    # (present)
│
├── gold-standard/              # Gold-standard reference content
│   ├── index.ts                # Barrel export
│   ├── types.ts                # Type definitions
│   ├── mathematics.ts          # Gold-standard reference for Mathematics
│   ├── physics.ts              # Gold-standard reference for Physics
│   ├── chemistry.ts            # Gold-standard reference for Chemistry
│   ├── biology.ts              # Gold-standard reference for Biology
│   ├── economics.ts            # Gold-standard reference for Economics
│   ├── computerScience.ts      # Gold-standard reference for Computer Science
│   └── README.md               # Usage notes
│
├── scripts/                    # Utility scripts — run via pnpm filter, not at runtime
│   └── src/
│       ├── curriculumGateway.ts  # EXPECTED chapter map + curriculum quality checker
│       ├── questionBankAudit.ts  # Question bank completeness audit
│       ├── statusReport.ts       # Per-subject status summary
│       ├── latencyAudit.ts       # AI pipeline latency measurement
│       └── hello.ts              # Smoke-test script
│
├── docs/
│   └── GOVERNANCE/             # Governance documents (this folder)
│
├── .agents/memory/             # Agent persistent memory (not user-facing)
│
├── CLASS9_SCIENCE_LAUNCH_READINESS.md  # Full Class 9 Science audit vs 2026-27 CBSE
├── CLASS9_SCIENCE_EXECUTIVE_DECISION.md  # CEO-level decision brief (supersedes GATEWAY_CHANGE_APPROVAL.md)
├── GATEWAY_FIX_VERIFICATION.md  # Post-implementation verification: GC-01, GC-04
├── GOVERNANCE_AUDIT.md         # Cross-document consistency audit (v1.0, FROZEN)
├── pnpm-workspace.yaml         # Workspace package discovery, catalog pins, overrides
├── tsconfig.base.json          # Shared strict TS defaults for all packages
├── tsconfig.json               # Root TS solution file (composite libs only)
└── replit.md                   # Project README + user preferences
```

---

## `artifacts/api-server/` — Express 5 API

**Package:** `@workspace/api-server`
**Port:** 8080 (workflow-injected via `PORT`)
**Entry:** `src/index.ts`

```
src/
├── index.ts                    # Express app bootstrap, middleware registration
├── app.ts                      # App factory
├── routes/
│   ├── solveQuestion.ts        # POST /api/solveQuestion — OpenAI proxy
│   │                           #   Rate limit: 20 req/IP/hr
│   │                           #   Cache: 7-day in-memory Map (non-personalized only)
│   │                           #   Timeout: 15 s AbortController budget
│   ├── health.ts               # GET /api/healthz
│   ├── profile.ts              # Student profile routes
│   ├── admin.ts                # Admin routes
│   ├── teacherReview.ts        # Teacher review routes
│   ├── tutor.ts                # Tutor routes
│   ├── devLesson.ts            # Dev-only lesson fixture loader (?audit=1)
│   └── devEvaluateLesson.ts    # Dev-only lesson evaluation
├── services/
│   ├── teachingQuality/        # 9-file server-side quality pipeline
│   │                           #   Reviews and improves every AI lesson before delivery
│   │                           #   Max 2 review cycles; graceful degradation on failure
│   ├── masterTeacher/          # Lesson generation orchestration
│   ├── subjectExpertBrain/     # Subject-specific knowledge injection
│   ├── lessonEvaluator/        # Lesson scoring and evaluation logic
│   ├── conceptMasteryFramework.ts
│   ├── educationPolicyStandards.ts
│   └── teachingStandards.ts
├── middlewares/
│   └── clerkProxyMiddleware.ts # Clerk auth proxy
└── lib/                        # Server-internal shared utilities
```

**Key rule:** `OPENAI_API_KEY` is read only in `routes/solveQuestion.ts`. It must never appear in any client bundle or frontend file.

---

## `artifacts/homework-hero/` — React + Vite frontend

**Package:** `@workspace/homework-hero`
**Port:** workflow-injected via `PORT`
**Entry:** `src/main.tsx` → `src/App.tsx`

### Pages (`src/pages/`)

| File | Route | Purpose |
|---|---|---|
| `Home.tsx` | `/` | Landing / dashboard |
| `Scan.tsx` | `/scan` | Camera → OCR → AI solve (signature interaction) |
| `Solution.tsx` | `/solution` | AI solution display; `?audit=1` loads dev fixture |
| `Practice.tsx` | `/practice` | Multi-class question bank, subject/chapter/difficulty filters |
| `Progress.tsx` | `/progress` | Per-subject analytics, weak topic detection |
| `History.tsx` | `/history` | Last 10 scans with thumbnails (localStorage) |
| `Analytics.tsx` | `/analytics` | Detailed analytics |
| `Profile.tsx` | `/profile` | Student profile management |
| `Revision.tsx` | `/revision` | Revision planner |
| `Journal.tsx` | `/journal` | Learning journal |
| `ExamMode.tsx` | `/exam` | Timed exam simulation |
| `Challenge.tsx` | `/challenge` | Challenge mode |
| `Improvement.tsx` | `/improvement` | Improvement tracking |
| `Onboarding.tsx` | `/onboarding` | First-run onboarding |
| `SignIn.tsx` | `/sign-in` | Auth |
| `SignUp.tsx` | `/sign-up` | Auth |
| `Admin.tsx` | `/admin` | Admin panel |
| `TeacherDashboard.tsx` | `/teacher` | Teacher view |
| `DevTeachingValidator.tsx` | `/dev/teaching` | Dev-only teaching validator |

### Data layer (`src/data/`)

```
data/
├── questions/
│   ├── index.ts                # ALL_CHAPTERS + ALL_QUESTIONS — the only runtime registry
│   │                           # A subject not imported here does not exist at runtime
│   ├── types.ts                # Question, Chapter, and related type definitions
│   ├── v2adapter.ts            # Converts V2-format (Classes 6–8 Maths) to V1 runtime shape
│   │
│   ├── class6-maths.ts         # Class 6 Mathematics — V2 format via adapter
│   ├── class7-maths.ts         # Class 7 Mathematics — V2 format via adapter
│   ├── class8-maths.ts         # Class 8 Mathematics — V2 format via adapter
│   │
│   ├── class9-maths-ch1.ts     # Class 9 Mathematics chapters (V1, ch1–ch15)
│   ├── class9-maths-ch2.ts     # ...
│   ├── [class9-maths-ch3 through ch15]
│   │
│   ├── class9-physics-ch1.ts   # Class 9 Physics — Motion (V1)
│   ├── class9-physics-ch2.ts   # Force and Laws of Motion (V1)
│   ├── class9-physics-ch3.ts   # Gravitation (V1) — confirmed non-exam 2026-27
│   ├── class9-physics-ch4.ts   # Work and Energy (V1) — Simple Machines sub-topic missing
│   ├── class9-physics-ch5.ts   # Sound (V1)
│   │
│   ├── class9-chemistry.ts     # Class 9 Chemistry adapter — assembles from question-bank/
│   │                           # ch01: 75q (non-exam); ch02–ch04: empty scaffolds (// @ts-nocheck)
│   │
│   ├── class9-economics-ch1.ts # Class 9 Economics (out of scope — not marketed)
│   ├── class9-economics-ch2.ts
│   ├── class9-economics-ch3.ts
│   └── class9-economics-ch4.ts
│
├── subjects.ts                 # Subject type + SubjectConfig (UI display metadata only)
│                               # WARNING: includes Biology, Economics, Computer Science
│                               # as configured subjects — see GOVERNANCE_AUDIT.md C-02, C-03, C-04
├── solutionBank.ts             # AIResponse type + keyword-based solution matcher
├── challenges.ts               # Challenge mode question sets
└── mockSolutions.ts            # Mock/fallback solution data
```

**Question bank layer rule:**
```
question source files  →  class9-{domain}.ts adapter  →  index.ts (ALL_CHAPTERS / ALL_QUESTIONS)
                                                       ↓
                                              Practice.tsx (UI)
```
All four layers must be present for a subject to be fully wired. `subjects.ts` and `Practice.tsx` alone make a subject selectable but empty — which is a broken student experience.

### Services (`src/services/`)

```
services/
├── ai/
│   ├── index.ts                # Public AI service API
│   ├── ocrService.ts           # Tesseract.js OCR pipeline
│   ├── topicMatcher.ts         # Keyword-based question bank matcher
│   ├── openaiSolver.ts         # HTTP client: POST /api/solveQuestion
│   └── solutionEngine.ts       # Resolution order: bank → OpenAI → fallback
│
├── aiSolver.ts                 # Top-level solver (calls solutionEngine, applies confidence)
├── confidenceEngine.ts         # Source-adaptive confidence formula; threads OCR confidence
├── analytics.ts                # Client-side analytics
├── questionService.ts          # Question filtering and retrieval
├── verificationEngine.ts       # Answer verification
├── devFeedback.ts              # Dev-only feedback utilities
│
├── studentModel/               # 7-service localStorage-first student model (Firestore-ready)
│   ├── index.ts
│   ├── studentProfile.ts       # Core profile (classLevel, subjects)
│   ├── studentProfileEngine.ts
│   ├── masteryEngine.ts        # Per-topic mastery tracking
│   ├── topicMastery.ts
│   ├── mistakeEngine.ts        # Mistake pattern analysis
│   ├── behaviorEngine.ts       # Study behavior signals
│   ├── adaptationEngine.ts     # Adaptive learning parameter tuning
│   ├── knowledgeGapEngine.ts
│   ├── learningStyleEngine.ts
│   ├── studyPatterns.ts
│   ├── examPredictionEngine.ts
│   ├── recommendationEngine.ts
│   ├── reflectionEngine.ts
│   ├── tutorEngine.ts
│   └── syncManager.ts          # Sync state between localStorage and future backend
│
├── ai/                         # (see above)
├── knowledgeGraph/             # Subject knowledge graph
├── socratic/                   # Socratic questioning engine
└── tutorIntelligence/          # Tutor intelligence layer
```

### Components (`src/components/`)

```
components/
├── teaching/                   # TeachingLesson renderers
│   ├── TeachingLayout.tsx      # Top-level lesson container
│   ├── TeachingSection.tsx     # Section wrapper
│   ├── StepReasoningCard.tsx   # Per-step worked reasoning
│   ├── ConceptCard.tsx         # Concept explanation card
│   ├── WorkedExampleCard.tsx   # Worked example display
│   ├── VisualCard.tsx          # Visual/diagram card
│   ├── MemoryCard.tsx          # Memory aid card
│   ├── MistakeCard.tsx         # Common mistake card
│   ├── ExamTipCard.tsx         # Exam technique card
│   ├── ReflectionCard.tsx      # Student reflection prompt
│   ├── PracticeQuestionCard.tsx
│   ├── ThinkingCard.tsx
│   ├── UnderstandingCheck.tsx
│   └── LearningSummary.tsx
│
├── socratic/                   # Socratic tutor UI
│   ├── SocraticTutor.tsx
│   ├── TutorDashboard.tsx
│   └── TutorMessage.tsx
│
├── tutor/                      # Tutor insight components
│   ├── MasteryMapView.tsx
│   ├── StudentProfileView.tsx
│   └── TutorInsightBanner.tsx
│
├── ui/                         # shadcn/ui primitives (button, card, dialog, etc.)
├── SolutionCard.tsx            # AI solution display; reads AIResponse.source for badge
├── DailyFocus.tsx
├── DailyMission.tsx
├── LoadingSpinner.tsx
├── RouteErrorBoundary.tsx
├── SimilarQuestions.tsx
├── StudyScoreCard.tsx
├── StarBurst.tsx
├── VerificationBadge.tsx
└── TeacherReviewPanel.tsx
```

### Hooks (`src/hooks/`)

| Hook | Purpose |
|---|---|
| `useAdaptiveLearning.ts` | Reads 3 localStorage keys; no other hooks called within it |
| `useAttemptLog.ts` | Logs question attempts |
| `useCelebration.ts` | Celebration/animation triggers |
| `useChapterStats.ts` | Per-chapter accuracy stats |
| `useCountdown.ts` | Timer/countdown |
| `useDailyMission.ts` | Daily mission state |
| `useExamMode.ts` | Exam mode state management |
| `useImprovementHistory.ts` | Improvement trend tracking |
| `useMasteryScore.ts` | Mastery score calculation |
| `useMistakeJournal.ts` | Mistake journal access |
| `use-mobile.tsx` | Mobile viewport detection |
| `useProfile.ts` | Student profile read/write |
| `useProgress.ts` | Progress data aggregation |
| `useRevisionPlanner.ts` | Revision schedule |
| `useScanHistory.ts` | Last 10 scans (localStorage) |
| `useSession.ts` | Session state |
| `useStreak.ts` | Daily streak tracking |
| `useStudyScore.ts` | Study score calculation |
| `useTeacherReview.ts` | Teacher review state |
| `use-toast.ts` | Toast notification |

---

## `lib/` — Shared libraries

### `lib/api-spec/`
OpenAPI 3 spec (`openapi.yaml`) — the contract between frontend and API. All client hooks and Zod schemas are generated from this file.
- **Codegen command:** `pnpm --filter @workspace/api-spec run codegen`
- **Do not change the `info.title`** — it controls generated filenames.

### `lib/api-client-react/`
Orval-generated React Query hooks for every API endpoint. Import these in the frontend — do not hand-write `fetch` calls against the API.

### `lib/api-zod/`
Orval-generated Zod v4 schemas. Import in both frontend and API server for request/response validation.

### `lib/db/`
Drizzle ORM schema definitions and the database client.
- **Migration command:** `pnpm --filter @workspace/db run migrate`
- Required env: `DATABASE_URL` (Postgres connection string)

---

## `question-bank/` — Raw question source

This directory holds question content files that are **not** directly imported at runtime. They are assembled by adapter files in `artifacts/homework-hero/src/data/questions/`.

```
question-bank/
├── blueprints/                 # Authoring target descriptors — developer-only
│   ├── mathematics.ts          # Mathematics authoring guide
│   ├── physics.ts              # Physics authoring guide
│   ├── chemistry.ts            # Chemistry authoring guide
│   ├── biology.ts              # Biology authoring guide (NOT imported at runtime)
│   ├── economics.ts            # Economics authoring guide
│   └── computerScience.ts      # Computer Science authoring guide
│
└── questions/
    ├── mathematics/            # V2-format Mathematics questions
    │   ├── class6/             # Class 6 chapter files
    │   ├── class7/             # Class 7 chapter files
    │   └── class8/             # Class 8 chapter files
    │                           # Loaded by class{N}-maths.ts via v2adapter.ts
    │
    └── chemistry/
        └── class9/             # Class 9 Chemistry source files
                                # Loaded by class9-chemistry.ts adapter
                                # ch01: 75q authored (non-exam)
                                # ch02, ch03, ch04: empty scaffolds (// @ts-nocheck)
```

**Blueprint note:** `question-bank/blueprints/biology.ts` is explicitly marked "Never imported by any runtime service." It describes authoring targets only.

---

## `academic-knowledge/` — Curriculum reference

Subject-level curriculum knowledge base. These files are reference material for AI and tooling — they are not the question bank.

```
academic-knowledge/subjects/
├── mathematics/    class6.ts  class7.ts  class8.ts  class9.ts
├── physics/        class9.ts
├── chemistry/      (present)
├── biology/        class9.ts
├── economics/      (present)
└── computerScience/ (present)
```

---

## `gold-standard/` — Reference content

Gold-standard reference content per subject. Used by the AI pipeline and quality evaluation.

```
gold-standard/
├── index.ts            # Barrel export
├── types.ts            # GoldStandard type definitions
├── mathematics.ts
├── physics.ts
├── chemistry.ts
├── biology.ts
├── economics.ts
├── computerScience.ts
└── README.md           # Developer usage notes
```

---

## `scripts/` — Curriculum and audit tooling

**Package:** `@workspace/scripts`
**Run via:** `pnpm --filter @workspace/scripts run <script-name>`

| File | npm script | Purpose |
|---|---|---|
| `curriculumGateway.ts` | `curriculum-check` | Validates ALL registered chapters against `EXPECTED` map; enforces question floors |
| `questionBankAudit.ts` | `question-bank-audit` | Completeness audit for the full question bank |
| `statusReport.ts` | `status` | Per-subject question count summary |
| `latencyAudit.ts` | `latency-audit` | AI pipeline latency measurement |
| `hello.ts` | `hello` | Smoke test |

**Gateway critical notes:**
- `EXPECTED` map is the governance ground truth for chapter names and exam-inclusion status
- Currently registered keys: `6-Mathematics`, `7-Mathematics`, `8-Mathematics`, `9-Mathematics`, `9-Economics`, `9-Physics`
- **Not registered:** `9-Chemistry`, `9-Biology` — gateway PASS does not mean full Science coverage
- `cbseDeleted: true` exempts a chapter from minimum-question floors and marks it non-exam
- `parseV1Meta` regex: uses `[^{]*` (not `[^}]*`) and `[^"]+` (not `[^"']+`) — do not alter without re-running check across all subjects

---

## `docs/GOVERNANCE/` — Governance documents

| File | Purpose | Status |
|---|---|---|
| `PROJECT_MASTER_CONTEXT.md` | 9-section permanent reference — scope, constraints, rules | Living |
| `PROJECT_MEMORY.md` | Architecture facts, decisions, sharp edges | Living |
| `PROJECT_STATUS.md` | Current coverage, blockers, next task | Living |
| `DECISION_LOG.md` | Chronological decision record (13 entries, DEC-001–DEC-013) | Living |
| `CHECKPOINT_GATEWAYS.md` | 7 quality gates — definitions, conditions, current state | Living |
| `PROJECT_STRUCTURE.md` | This file — repository map | Living |

**Repo-root governance documents:**

| File | Purpose | Status |
|---|---|---|
| `CLASS9_SCIENCE_LAUNCH_READINESS.md` | Full Class 9 Science audit vs. official CBSE 2026-27 PDF | Authoritative |
| `CLASS9_SCIENCE_EXECUTIVE_DECISION.md` | CEO-level decision brief; supersedes `GATEWAY_CHANGE_APPROVAL.md` | Authoritative |
| `GATEWAY_FIX_VERIFICATION.md` | Post-implementation verification: GC-01 and GC-04 | Authoritative |
| `GOVERNANCE_AUDIT.md` | Cross-document consistency audit | v1.0, FROZEN |

---

## What does not exist yet (approved scope, not started)

| Subject | Classes | Notes |
|---|---|---|
| Science | 6, 7, 8 | Approved; zero content or structure |
| Computational Thinking and AI | 6, 7, 8 | Approved; zero content or structure |
| Computer Applications (CA) | 9 | Approved; Subject Code 165; zero content |
| Information Technology (IT) | 9 | Approved; Subject Code 402; zero content |
| Artificial Intelligence (AI) | 9 | Approved; Subject Code 417; zero content |
| Biology | 9 | Approved; 4 official chapters; zero questions; zero wiring in `index.ts` |
| Chemistry (exam chapters) | 9 | Ch5, Ch8, Ch9: zero questions; only ch01 is authored (non-exam) |

None of the above should be built without confirmed CBSE official-source evidence on file and gateway registration completed first.
