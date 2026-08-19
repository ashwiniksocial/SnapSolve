---
name: OCR Trust Gate
description: Deterministic three-state OCR classifier added to Scan.tsx to prevent garbage OCR from reaching the AI solver.
---

## Rule
classifyOcrOutput() in ocrTrustGate.ts returns OCR_FAILED | OCR_NEEDS_REVIEW | OCR_HIGH_CONFIDENCE.
FAILED: solver structurally blocked (no button). NEEDS_REVIEW: explicit checkbox confirmation required before solve. HIGH: existing green banner, immediate solve.

## Key thresholds (as of Prompt #032)
- LOW_CONF_TESSERACT = 0.20 → always FAILED
- LOW_CONF_COMBINED = 0.30 + LOW_CONF_ALPHA_CEIL = 0.65 → FAILED (catches founder failure: rawConf≈0.25, alpha≈0.55)
- MIN_ALPHA_RATIO = 0.42 → FAILED
- MAX_NOISE_RATIO = 0.30 → FAILED (NOISE_CHARS = /[~|\\^`<>{}[\]@#$%*+=_]+/g)
- MIN_WORDS = 3 → NEEDS_REVIEW if below
- HIGH_CONF_TESSERACT = 0.60 → HIGH_CONFIDENCE if above

**Why:** The combined gate (conf + alpha) is the critical fix for the founder failure case. Individual thresholds alone were insufficient: garbage OCR from handwriting had 55% alpha (above 42% floor) and 9% noise (below 30% ceiling) but only 25% Tesseract confidence.

**How to apply:** If thresholds need tuning, adjust constants at the top of ocrTrustGate.ts. Do NOT add AI/LLM calls to the classifier — it must stay pure/synchronous.

## Scope boundary
- Scan OCR path ONLY. Practice, question bank, canonical metadata, pre-generated lessons all untouched.
- Topic detection suppressed for non-HIGH states (no confident topic label shown).
- Type Question tab: entirely unchanged (ocrConfidence set to 1, bypasses gate).
