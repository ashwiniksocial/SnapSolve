---
name: TeachingLesson Architecture
description: How the TeachingLesson type flows through the entire app, replacing the old steps[] model.
---

## Core principle
The AI now generates a **complete lesson**, not a solution. `TeachingLesson` is the new core object. `steps[]` is legacy, used only by bank/fallback entries.

## Data flow
```
Backend solveQuestion.ts → LessonResponse (JSON schema)
  ↓
openaiSolver.ts toAIResponse() → AIResponse { lesson: TeachingLesson, steps: [] }
  ↓
TeachingLayout.tsx → checks solution.lesson → LessonRenderer (new interactive UI)
                                             → LegacyRenderer (old steps[] for bank/fallback)
```

## AIResponse shape
- `lesson?: TeachingLesson` — present for all `source: "openai"` responses
- `steps: SolutionStep[]` — always present but `[]` for OpenAI responses; populated for bank/fallback
- `finalAnswer`, `commonMistakes`, `examTrap`, `examTip` — flattened from lesson onto AIResponse for analytics/student model backward compat

## TeachingLesson sections (18 total)
1. beforeWeStart (motivator, anxietyReducer, preview)
2. prerequisites + vocabulary (term/meaning pairs, expandable chips)
3. intuition (story, visual, everyday)
4. questionTranslation (plainEnglish, whatWeKnow, whatWeFind, wordToMath)
5. teacherThinking (firstNotice, whyThisMethod, clues)
6. guidedReasoning: LessonStep[] (what, why, math, result, pause) — replaces old steps[]
7. confusionPoints: string[]
8. commonMistakes: { mistake, whyItHappens, howToAvoid }[]
9. examinerThinking (whyAsked, conceptTested, topperInsight, examTip, examTrap)
10. finalAnswer { answer, whyCorrect, verification }
11. simplerExample { problem, solution }
12. practiceQuestion { question, hints[3], solution } — progressive hint reveal UI
13. confidenceCheck MCQ (4 options)
14. retrievalPractice: string[] (4-5 recall questions)
15. rememberThese: string[] (4-5 bullets)
16. confidenceBuilder — celebratory paragraph

## Interactive UI elements
- GuidedStepCard: "Why this step?" collapsible reveal + "Pause & Think" thought bubble
- VocabChip: tap to expand definitions
- PracticeWithHints: reveals hints one-by-one, then full solution
- RetrievalPractice: questions without auto-reveal (pure recall)
- ConfidenceMCQ: interactive multiple choice with explanation

## Backend details
- `max_tokens: 5000` (bumped from 4000 to allow richer lessons)
- `response_format: { type: "json_object" }` — unchanged
- Server cache (7-day TTL), rate limit (20 req/IP/hr) — unchanged
- Client cache key bumped to `studyai-ai-cache-v2` (schema change requires cache bust)

## Why
**Why:** The old `steps[] + finalAnswer` model treated the AI as a calculator. The new model treats it as a tutor. Understanding is more important than the answer — every section exists to build comprehension, not just deliver a result.

**How to apply:** When adding new AI-generated fields, add them to `TeachingLesson` first, then surface them in `TeachingLayout.tsx`'s `LessonRenderer`. Do NOT add top-level fields to `AIResponse` for OpenAI content — put them inside `lesson`.
