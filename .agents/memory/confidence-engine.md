---
name: Confidence Engine
description: How the answer-confidence score is computed and displayed in StudyAI.
---

## Rule
Bank score is normalized as `min(rawScore / 40, 1.0)` (matching 4 keywords = 100%).
Composite formula is source-adaptive:
- `"bank"`:    `base = 60 + 40 * bankNorm` + topicBonus (max +10) − ocrPenalty
- `"openai"`:  `base = 55 + 40 * aiConf`   + topicBonus − ocrPenalty
- `"fallback"`: `base = 40 + 25 * topicConf + 15 * bankNorm` − ocrPenalty

ocrPenalty = `max(0, (0.65 - ocrConf) * 30)` — only triggers below 65% OCR quality.

**Why:** A flat weighted average would score OpenAI solutions unfairly low (bank = 0 by definition). Source-adaptive bases keep tiers meaningful per resolution path.

## Data flow
1. `Scan.tsx` calls `safeRecognizeWithConfidence` → stores `ocrConfidence` (0–1) in `useSession`.
2. Typed questions set `ocrConfidence: 1`; history revisits also set `1`.
3. `Solution.tsx` passes `session.ocrConfidence ?? 1` as 3rd arg to `aiSolver.solve()`.
4. `aiSolver.ts` calls `detectBestTopic` for topicConf and `computeConfidenceBreakdown` for each path.
5. `ConfidenceBreakdown` is attached to the returned `AIResponse` and rendered by `ConfidenceMeter`.

## Tiers
- ≥ 90: High confidence (green)
- 70–89: Medium confidence (amber)
- < 70: Verify answer (red)

## Display locations
- `SolutionCard.tsx` — shown for every solved question (after AI badge, before topic row)
- `Challenge.tsx` (Question Workspace) — always shows 100% for bank entries (verified content)
