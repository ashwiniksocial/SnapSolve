# StudyAI

AI-powered homework and practice platform for Class 6–12 students covering Physics, Chemistry, and Mathematics.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/homework-hero run dev` — run the frontend (port 22801)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- Required env: `DATABASE_URL` — Postgres connection string
- Required env: `OPENAI_API_KEY` — server-side secret for AI solutions (optional; app falls back to question bank if absent)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/homework-hero/src/` — React+Vite frontend (mobile-first)
- `artifacts/api-server/src/routes/solveQuestion.ts` — AI proxy route (OpenAI key lives here only)
- `artifacts/homework-hero/src/services/ai/` — client AI layer (OCR, topic matching, backend client)
- `artifacts/homework-hero/src/data/questions/` — 150-question structured bank (Class 9 Maths)
- `artifacts/homework-hero/src/data/solutionBank.ts` — AIResponse type + keyword matcher

## Architecture decisions

- OpenAI API key is server-side only (`OPENAI_API_KEY` secret) — never exposed to the browser.
- Frontend calls `POST /api/solveQuestion`; backend handles rate limiting (20 req/IP/hr), server-side caching (7-day), and OpenAI timeouts (15 s).
- Two-layer cache: client localStorage (avoids backend round-trips) + server in-memory Map (avoids OpenAI charges for repeated questions).
- Resolution order: question bank keyword match → OpenAI via backend → fallback structured guide.
- `AIResponse.source` field (`"bank" | "openai" | "fallback"`) drives the "AI Generated Solution" badge in `SolutionCard`.

## Product

- **Scan & Solve**: photograph or type a homework question → Tesseract.js OCR → AI step-by-step solution
- **Practice**: multi-class question bank — Class 6 (14 ch, 1090 q), Class 7 (13 ch, 979 q), Class 8 (13 ch, 979 q), Class 9 (21 ch, 1385 q) — with chapter/topic/difficulty filters and live accuracy tracking
- **Progress**: per-subject analytics, weak topic detection, and study recommendations
- **Question Workspace**: deep-dive workspace for any question with hints, steps, and revision saving
- **Scan History**: last 10 scans with thumbnails, stored in localStorage, revisitable

## Class 9 Question-Bank Freeze — completed 2026-07-23

All 21 active Class 9 chapters (1,385 questions) have been audited and frozen.
Each source file carries a `// @frozen` marker. The registry is at
`curriculum/generated/class9-active-freeze.json`.

### Frozen chapters

| Subject | Chapters | Questions |
|---|---|---|
| Mathematics (Ganita Manjari) | ch1, ch3, ch4, ch15, ch16, ch17, ch18, iemh102 | 500 |
| Physics (Exploration) | phy-ch1, phy-ch2, phy-ch4, phy-ch5 | 200 |
| Chemistry (Exploration) | chem-ch01, chem-ch02, chem-ch03, chem-ch04 | 300 |
| Biology (Exploration) | bio-ch01, bio-ch02, bio-ch03, bio-ch05 | 300 |
| Earth Science (Exploration) | esc-ch01 | 85 |
| **Total** | **21 chapters** | **1,385** |

### Defects found and fixed (13 total across 6 chapters)

**ch1 — The World of Numbers (4 defects)**
1. `8^(1/3) × 16^(1/4) / 2^(1/2)` answer was `"4"` → correct: `"2√2"`
2. `x^(a−b) × x^(b−c) × x^(c−a)` answer was `"x^(a²+b²+c²−ab−bc−ca)"` → correct: `"1"` (exponents sum to zero)
3. Ordering of surds answer was `"2.2 < 9/4 < √5"` → correct: `"2.2 < √5 < 9/4"` (√5 ≈ 2.236, 9/4 = 2.250)
4. Rationalisation result was `"a = 0, b = −2"` → correct: `"a = 0, b = 1"`

**ch15 — Probability (1 defect)**
5. Probability question (c): numerator included wrong student group giving `280/400 = 7/10` → correct: `220/400 = 11/20`

**ch17 — Sequences (1 defect)**
6. 8th term of doubling-plus-one sequence was `"191"` → correct: `"383"` (term 7 = 191, term 8 = 383)

**ch18 — Perimeter and Area (1 defect)**
7. Quadrilateral area used an invalid triangle (sides 14, 13, 41 where 14+13 < 41) giving `"264 m²"` → replaced with valid quadrilateral giving correct `"114 m²"`

**iemh102 — Linear Polynomials (2 defects)**
8. MCQ "which is NOT a solution of x + 2y = 6" had a confused non-answer → correct: `"(d) (1, 3)"` since 1 + 2(3) = 7 ≠ 6
9. Asha's pocket money was `"₹60"` → correct: `"₹70"` (x + y = 150, y = 2x − 60 → 3x = 210 → x = 70)

**phy-ch1 — Motion (3 defects)**
10. Average speed for a combined journey was `"7 km/h"` → correct: `"6 km/h"`
11. Acceleration from rest over given distance was `"4 m/s²"` → correct: `"7.2 m/s²"`
12. Average velocity for third scenario was `"3.5 m/s"` → correct: `"7 m/s"`

**phy-ch4 — Work, Energy and Simple Machines (1 defect)**
13. Power calculation: answer was `"1666.7 W ≈ 1.67 kW"` → correct: `"166.7 W ≈ 0.167 kW"` (off by factor of 10; W = 100,000 J, t = 600 s)

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
