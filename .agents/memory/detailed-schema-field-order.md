---
name: Detailed schema field order
description: JSON_SCHEMA field order in solveQuestion.ts — guidedReasoning moved early to reduce first-step latency from ~9-11s to ~2.3-3.6s.
---

## Rule
`guidedReasoning` and `finalAnswer` appear immediately after `keyConcepts`/`aiConfidence` in `JSON_SCHEMA` (Detailed / `mode:"basic"` only). This is intentional latency optimisation — do not revert.

**Why:** LLMs generate JSON fields in schema order. Original order put ~600-900 tokens of metadata (beforeWeStart, prerequisites, vocabulary, intuition, questionTranslation, teacherThinking) before guidedReasoning, delaying first step to ~9-11s. Reordering reduces first step to 2.3-3.6s.

**How to apply:** Any edit to `JSON_SCHEMA` in `solveQuestion.ts` must keep this order:
1. topic / difficulty / keyConcepts / aiConfidence
2. guidedReasoning
3. finalAnswer
4. beforeWeStart / prerequisites / vocabulary / intuition / questionTranslation / teacherThinking
5. confusionPoints / commonMistakes / examinerThinking
6. simplerExample / practiceQuestion / confidenceCheck / retrievalPractice / rememberThese / confidenceBuilder

`FIELD INSTRUCTIONS` section in the same schema string must match this order so the model generates in the correct sequence.

`lessonStreamExtractor.ts` scan() order must also match: keyConcepts → steps → finalAnswer → questionTranslation.

Standard (`JSON_SCHEMA_STANDARD`) and Compact (`JSON_SCHEMA_COMPACT`) schemas are NOT affected — they have their own field order optimised for their token budgets.

## Measured result (post-change)
- Maths step_0: 3583ms | finalAnswer: 7035ms | full: 20772ms
- Science step_0: 2269ms | finalAnswer: 8518ms | full: 25099ms
- IT step_0: 2705ms | finalAnswer: 4683ms | full: 18357ms
