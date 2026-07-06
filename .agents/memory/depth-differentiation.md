---
name: Depth Differentiation in Lesson Generation
description: How BASIC/STANDARD/ADVANCED explanation depth differentiation works, what was broken, and the fix architecture.
---

## The Mechanism

`studentContext` is built client-side in `openaiSolver.ts` and sent to the backend. It is a plain text block like:
```
Preferred explanation depth: BASIC
Learning speed: SLOW
Student score: 35/100
```

## The Validated Defect (fixed 2026-07-06)

Before the fix, the depth hint was only in the **user message** as free text. The system prompt had:
- Hard field floors: "Minimum 4 terms", "Never combine two operations into one step"
- No depth-differentiation instructions

Result: all 3 styles produced structurally identical lessons (vocab count 4-5 across all styles, step counts random, word counts within 5% of each other). Confirmed across 5 questions × 3 styles = 15 API calls.

## The Fix (solveQuestion.ts)

1. Added `EXPLANATION DEPTH` section to `JSON_SCHEMA` constant — user-message level framing.
2. Added `MANDATORY` vocab guidance per depth level in the depth section.
3. Modified vocabulary field floor: "Minimum 4 (BASIC/STANDARD) or minimum 2 (ADVANCED)."
4. Added `extractDepth(ctx?)` — regex parses "Preferred explanation depth: BASIC/ADVANCED" from studentContext.
5. Added `DEPTH_SYSTEM_OVERRIDES` — authoritative system-level blocks per depth, appended to `systemContent` in `generateDraft()`. This gives depth instructions equal authority to field instructions.
6. `generateDraft` now extracts depth and appends the override to the system message.

## Post-Fix Metrics (Q1 HCF/LCM, Q4 Rectangle)

| Metric | Before BASIC vs ADV | After BASIC vs ADV |
|--------|---------------------|---------------------|
| Vocab count | 4=4 (IDENTICAL) | 6 vs 4 (CORRECT ✓) |
| Prereq count | 2=2 (IDENTICAL) | 4 vs 3 (CORRECT ✓) |
| StepWHY words | 174 vs 203 (REVERSED) | 179 vs 98 (CORRECT ✓) |
| TotalWC | 1622 vs 1645 (REVERSED) | 1972 vs 1667 (CORRECT ✓) |

## Known Limitation

Step count for inherently multi-step questions (HCF/LCM, rectangle with ratio) does not compress to 3–4 for ADVANCED because the algorithm genuinely requires 6+ operations. This is an LLM floor at temperature=0.3, not addressable via prompts.

## Quality Pipeline Is Depth-Blind

`runQualityPipeline(draft, apiKey, onProgress)` receives NO studentContext. It may expand ADVANCED lessons or compress BASIC ones. Future improvement: pass depth to reviewer/improver so quality is judged relative to depth level.

**Why:** Depth hint in user message loses authority to field-level instructions in system message. Must inject depth override into system message via `DEPTH_SYSTEM_OVERRIDES`.
