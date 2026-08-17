---
name: Standard Mode Speed Gate
description: Schema and token-budget decisions that brought Standard mode first-answer latency from 8-10 s to 3-5 s.
---

## What changed (Standard mode only)

### Schema slim — sections removed vs original
- `questionTranslation` — removed from schema entirely; `questionNeedsTranslation()` post-processing block also removed
- `practiceQuestion` — removed (~220 tokens / 1.7 s saved)
- `pause` per guidedReasoning step — removed (~40 tokens saved)
- `finalAnswer.whyCorrect` — removed (~15 tokens saved)
- Steps reduced from "EXACTLY 4" → "EXACTLY 3"

### Token budget
- `maxTokens` 1200 → 600 for Standard
- **DO NOT go below 550** — `response_format: json_object` still truncates at max_tokens and the
  resulting partial JSON throws `JSON.parse()`, triggering a 502 fallback (steps=0, answer=NO).

### Result
- Expected completion tokens: 320–500 (was 1,000–1,200)
- Typical total latency: 3.1–4.7 s at normal OpenAI server speed (~100 t/s)
- Occasional slow API calls (60 t/s) can push to 7–8 s — this is server-side variability, not a schema issue

## Frontend guard — TeachingLayout.tsx
- Practice section guard changed from `!isCompact` → `!isCompact && !!lesson.practiceQuestion?.question`
  so Standard mode (which no longer generates practiceQuestion) doesn't render an empty section

## Token throughput reference
- gpt-4o-mini observed range: 60–130 t/s (Replit's OpenAI endpoint)
- At 100 t/s: 400 tokens → 4.0 s generation + ~0.9 s overhead = 4.9 s ✓
- At 60 t/s:  400 tokens → 6.7 s generation + ~0.9 s overhead = 7.6 s ✗ (rare server anomaly)

## Why: Detailed/Compact unchanged
- Ternary: `mode === "basic" ? 2800 : mode === "standard" ? 600 : 800`
- Detailed/Compact fall into the 800 bucket — unchanged from before this work
