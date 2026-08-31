# Architecture C Targeted Validation

## 1. Root cause of the M6 false fail

The validator read the correct intermediate fraction `90/200` in isolation instead of treating the following step as its explicit simplification to `9/20`. After the surgical instruction change, it recognized that the calculation was correct, but still promoted the harmless presentation gap into two material issues: “missing simplification” and weak-student insufficiency. The retained lesson does contain a separate next step that performs and explains the simplification.

## 2. Exact files changed

- `src/services/architectureCShadow/materialValidator.ts`
- `src/benchmark/modelBenchmark.ts`
- `src/benchmark/architectureCTargetedValidation.ts`
- `architecture_c_targeted_results.json`
- `architecture_c_targeted_report.md`

## 3. Exact surgical fix

The narrow validator instruction now explicitly requires it to:

- inspect adjacent reasoning steps before judging an intermediate expression;
- accept value-preserving fraction, decimal, percentage, commutative, and algebraic transformations;
- verify the transformation rather than trusting a later answer;
- continue failing genuinely non-equivalent transformations.

No category, result type, routing rule, or production quality behavior changed.

## 4. Symbolic-math subsystem

No symbolic engine, second solver, normalizer, or mathematical subsystem was created. The implementation is a prompt-only clarification in the existing shadow validator.

## 5. M6 before result

- Structural result: `STRUCTURAL_PASS`
- Semantic result: `MATERIAL_FAIL`
- Confirmed false fail: yes
- Incorrectly cited evidence: `P(Tails) = 90 / 200`

## 6. M6 after result

- Structural result: `STRUCTURAL_PASS`
- Structural latency: under 1 ms
- Semantic result: `MATERIAL_FAIL`
- Validator latency: 3,304 ms
- Validator tokens: 2,254 input, 238 output, 2,492 total
- Validator cost: $0.0004809
- Confirmed false fail corrected: **no**

The validator now admitted `90/200` was correct, but still classified the separate simplification step as materially insufficient. The retained lesson explicitly simplifies `90/200` to `9/20` in the next step, so this remains a false fail.

## 7. Negative-control result

Only the simplification result was changed from `9/20` to `9/10`; all other lesson fields were preserved.

- Structural result: `STRUCTURAL_PASS`
- Semantic result: `MATERIAL_FAIL`
- Validator latency: 3,061 ms
- Validator tokens: 2,254 input, 142 output, 2,396 total
- Validator cost: $0.0003465
- Material issue: the validator correctly identified that `90/200` simplifies to `9/20`, not `9/10`
- Negative control passed: **yes**

## 8. Easy question selected

Existing bank question `c9-m-ch1-t2-q02`:

> Is √9 rational or irrational? Justify.

Known answer: `Rational. √9 = 3 = 3/1.`

## 9. Easy primary-generation latency

12,710 ms.

## 10. Easy validator latency

0 ms. The semantic validator was correctly not called because the deterministic gate failed first.

## 11. Easy total shadow latency

12,710 ms including primary generation and the sub-millisecond structural gate.

## 12. Easy token/cost profile

- Primary input: 1,126 tokens
- Primary output: 1,600 tokens
- Primary total: 2,726 tokens
- Primary cost: $0.0011289
- Structural validator: zero tokens, zero cost
- Semantic validator: zero tokens, zero cost because it was not run

## 13. Easy material-safety assessment

Manual assessment: the generated content is factually correct and understandable for a weak student. It calculates `√9 = 3`, expresses `3 = 3/1`, concludes that √9 is rational, and verifies `3 × 3 = 9`.

Architecture C result: `STRUCTURAL_FAIL`, because Detailed `guidedReasoning` contained 3 steps instead of the required 4–8. This is a genuine TeachingLesson contract failure, so the semantic result remains unavailable rather than being inferred from parser defaults.

## 14. Updated false-pass count

**0 confirmed false passes.**

## 15. Updated false-fail count

**1 confirmed semantic false fail:** retained M6 remains falsely rejected.

The Easy case is not counted as a semantic false fail because semantic validation never ran; it is recorded separately as a structural contract failure.

## 16. C2 status

Unchanged: retained C2 remains `MATERIAL_PASS`. It was not rerun and incurred no new cost.

## 17. Deterministic gate status

Intact. It passed retained M6 and the corrupted negative control, then correctly blocked the Easy lesson before semantic spend because the raw output had only three guided-reasoning steps.

## 18. Semantic validator scope

Unchanged and narrow. It still classifies only correctness, reasoning, curriculum fit, weak-student sufficiency, hallucinations, prerequisites, contradictions, and TeachingLesson completeness. Optional polish remains separate.

## 19. API TypeScript result

Passed.

## 20. API production-build result

Passed.

## 21. Diagnostic AI/API calls and cost

Exactly **3 new AI calls**:

1. Retained M6 semantic validation
2. Corrupted M6 negative-control semantic validation
3. One Easy Detailed primary generation

The Easy semantic call was skipped after structural failure.

Totals:

- Input tokens: 5,634
- Output tokens: 1,980
- Total tokens: 7,614
- Estimated cost: $0.0019563

No reviewer, improver, retained M6 generation, or C2 call was rerun.

## 22. Production files or routing changed?

No production request routing or production Option-F behavior changed. The existing development route remains explicitly opt-in through `ENABLE_ARCHITECTURE_C_SHADOW=true` and unavailable in normal production behavior.

## 23. Section repair

Not implemented.

## 24. Streaming

Not implemented.

## 25. Protected systems

Vision, Scan, Camera, OCR trust gate, Practice, question bank content, curriculum, canonical metadata, frozen lessons, navigation, Progress, Revision, auth, beta feedback, and deployment were untouched.

## 26. Final classification

**NOT_READY**

Reasons:

- The confirmed M6 equivalent-math false fail remains.
- The negative control correctly fails, so correctness protection was not weakened.
- The single Easy generation did not satisfy the deterministic Detailed contract, preventing the required Easy semantic classification.
- C2 remains correctly classified and there are zero confirmed false passes, but the full readiness gate is not met.

ARCHITECTURE C TARGETED VALIDATION COMPLETE — AWAITING FOUNDER DECISION