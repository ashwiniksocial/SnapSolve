# Architecture C Validator Contract Validation

## 1. Exact structural-gate root cause

The deterministic gate treated the Detailed prompt’s preferred `guidedReasoning` count of 4–8 as a structural contract. That mixed a question-dependent pedagogical quantity preference with true shape validation. The retained Easy lesson had three complete, correctly shaped reasoning steps and was rejected solely for not reaching four.

## 2. Exact semantic-validator root cause

The semantic validator evaluated individual lines more aggressively than the complete ordered reasoning chain. In M6 it recognized `90/200` and `9/20` as equivalent, but still promoted the absence of extra explanation around that trivial adjacent simplification into material correctness and weak-student-sufficiency defects.

## 3. Files changed

- `src/services/architectureCShadow/structuralGate.ts`
- `src/services/architectureCShadow/materialValidator.ts`
- `src/benchmark/architectureCContractValidation.ts`
- `architecture_c_contract_results.json`
- `architecture_c_contract_c2_retest.json`
- `architecture_c_contract_report.md`

## 4. Exact structural-gate correction

`guidedReasoning` now requires at least one non-empty, well-formed step. It no longer imposes any universal pedagogical step count. Zero steps, malformed step objects, missing required fields, empty required content, invalid types, invalid enums, and explicit schema cardinalities remain blocking.

Deterministic-check responsibility audit:

- True structural requirements retained: valid root/object/array/string types; required core sections; non-empty required fields; well-formed array items; valid difficulty and confidence values; valid confidence-check index; non-empty key concepts and reasoning; schema-required mistake, hint, and confidence-option cardinalities.
- Pedagogical preference removed from blocking: 4–8 reasoning steps.
- Semantic sufficiency left to the material validator: whether the number and content of valid reasoning steps adequately teaches the specific question.

## 5. Exact semantic-validator correction

The material-validator contract now requires complete-chain evaluation. Before rejecting an intermediate mathematical expression, it must inspect the preceding, current, and immediately following relevant step. A correct adjacent trivial transformation cannot become a material correctness, reasoning, completeness, or weak-student-sufficiency issue merely because a richer explanation could be added; that belongs in optional polish. Invalid transformations remain blocking.

## 6. Symbolic-math engine

No symbolic mathematics engine, expression normalizer, second solver, or new lesson architecture was created.

## 7. M6 correct lesson result

- Structural: `STRUCTURAL_PASS`
- Semantic: `MATERIAL_PASS`
- Semantic issues: none
- Semantic latency: 2,287 ms
- Tokens: 2,351 input, 84 output, 2,435 total
- Cost: $0.00040305

The valid chain `90/200 → divide numerator and denominator by 10 → 9/20` no longer false-fails.

## 8. M6 negative-control result

- Mutation: only the simplification result changed from `9/20` to `9/10`
- Structural: `STRUCTURAL_PASS`
- Semantic: `MATERIAL_FAIL`
- Semantic latency: 2,504 ms
- Tokens: 2,351 input, 140 output, 2,491 total
- Cost: $0.00035985
- Issue: the validator correctly identified that `90/200` simplifies to `9/20`, not `9/10`

The safety control remains intact.

## 9. Easy structural result

`STRUCTURAL_PASS`. The retained three-step chain is well-formed and no longer fails an arbitrary minimum-step rule.

## 10. Easy semantic result

- Result: `MATERIAL_PASS`
- Issues: none
- Latency: 1,433 ms
- Tokens: 1,954 input, 71 output, 2,025 total
- Cost: $0.0003357

The chain `√9 = 3 → 3 = 3/1 → √9 is rational` was correctly accepted.

## 11. C2 result

The initial C2 call used an incorrect diagnostic question label and is excluded from adjudication, but included in total diagnostic spend. A corrected one-call retest used the exact retained question:

> State three differences between evaporation and boiling. Why does evaporation cause cooling? Give a daily-life example.

Corrected retest:

- Structural: `STRUCTURAL_PASS`
- Semantic: `MATERIAL_FAIL`
- Latency: 3,176 ms
- Tokens: 2,218 input, 195 output, 2,413 total
- Cost: $0.0004497

The cited statement—evaporation occurs at the surface while boiling occurs throughout the liquid—is a standard correct textbook distinction. The validator’s claim that this is misleading because boiling “also occurs at the surface when bubbles form” is not a valid material defect. C2 therefore produced a confirmed semantic false fail.

## 12. Confirmed FALSE PASS count

**0**

## 13. Confirmed FALSE FAIL count

**1**

M6 and Easy are now correctly accepted. C2 is falsely rejected.

## 14. Remaining material-validator defects

The validator can still invent excessive technical objections to concise, standard textbook statements and promote those objections into correctness failures. This is a precision defect, not evidence of unsafe lesson content.

## 15. Semantic-validator latency per retained case

- M6 correct: 2,287 ms
- M6 corrupted control: 2,504 ms
- Easy: 1,433 ms
- C2 corrected retest: 3,176 ms

The invalid-metadata C2 diagnostic call took 2,500 ms.

## 16. Semantic-validator token usage

Final correctly labelled retained cases:

- Input: 8,874 tokens
- Output: 490 tokens
- Total: 9,364 tokens

Including the discarded invalid-metadata diagnostic:

- Input: 11,092 tokens
- Output: 648 tokens
- Total: 11,740 tokens
- Cached input: 1,024 tokens

## 17. Diagnostic AI/API call count

**5 semantic-validator calls**

- Four retained-case calls in the first pass
- One corrected-label C2 retest
- Zero primary-generation calls
- Zero reviewer or improver calls

The first C2 call is counted in spend even though its mismatched diagnostic label makes it invalid evidence.

## 18. Diagnostic USD cost

**$0.0019758** total, including the discarded invalid-metadata call.

## 19. API TypeScript result

Passed.

## 20. API production-build result

Passed.

## 21. Production routing

Unchanged. Architecture C remains diagnostic-only. The development route remains explicitly gated by `ENABLE_ARCHITECTURE_C_SHADOW=true` and disabled by default.

## 22. Repair

Not implemented.

## 23. Streaming

Not implemented.

## 24. Protected systems

Vision, Scan, Camera, OCR trust gate, Practice, question bank, curriculum, canonical metadata, frozen lessons, navigation, Progress, Revision, auth, beta feedback, and deployment were untouched.

## 25. Final classification

**NOT_READY**

M6, the negative control, and Easy now behave correctly, and there are zero confirmed false passes. However, the required C2 retained case produced a confirmed false fail based on an invalid objection to a standard curriculum statement, so all readiness expectations are not met.

ARCHITECTURE C VALIDATOR CONTRACT VALIDATION COMPLETE — AWAITING FOUNDER DECISION