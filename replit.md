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
- **Practice**: 150-question bank (Class 9 Maths) with chapter/topic/difficulty filters and live accuracy tracking
- **Progress**: per-subject analytics, weak topic detection, and study recommendations
- **Question Workspace**: deep-dive workspace for any question with hints, steps, and revision saving
- **Scan History**: last 10 scans with thumbnails, stored in localStorage, revisitable

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
