# Architecture C Fail-Safe Controlled A/B

## Decision

**APPROVED** as a default-off, controlled fail-safe path.

The integration is eligible only for Detailed (`basic` generation mode),
non-intent requests on the regular solver route. Bank and streaming routes are
unchanged. The server flag is `ARCHITECTURE_C_FAST_PATH_ENABLED`; its default is
off.

## Routing contract

- The regular solver makes exactly one primary generation call.
- Architecture C receives the raw JSON and normalized draft from that call.
- Structural and material pass: return the existing primary lesson and skip
  Option-F review/improvement.
- Structural fail, material fail, validator error, validator exception, or
  insufficient validation budget: continue to the existing Option-F path with
  the same normalized primary draft.
- Architecture C may run only when it can preserve 35 seconds of the existing
  70-second request budget for Option F.
- A controller-level hard deadline covers the entire Architecture C operation,
  including retry backoff, so the Option-F reserve cannot be consumed by a
  sleeping validator retry.
- Flag off: no Architecture C validation call; the existing Option-F flow is
  unchanged.

## Deterministic routing controls

The retained routing check passed all required branches without solver calls:

| Control | Result |
|---|---|
| Flag off | `option_f`; validator not called |
| Structural + material pass | `architecture_c_fast_pass`; Option F unreachable |
| Structural fail | `architecture_c_fallback`; same draft goes to Option F |
| Material fail | `architecture_c_fallback`; same draft goes to Option F |
| Validator error | `architecture_c_fallback`; same draft goes to Option F |
| Escaped validator exception | `architecture_c_fallback`; attempted call recorded |
| No validation budget | `architecture_c_fallback`; validator not called |
| Retry backoff crosses deadline | Hard fallback returns at controller deadline |
| Primary generation count | Exactly one call site in the regular route |

## Exact same-primary A/B: M6

Both paths reuse the retained M6 primary lesson. No new primary lesson was
generated. The primary was manually retained as correct, and the frozen
Architecture C validator returned `MATERIAL_PASS`.

| Metric | Architecture C fast pass | Current Option F | Change |
|---|---:|---:|---:|
| End-to-end latency | 19,863 ms | 51,430 ms | **−31,567 ms (−61.4%)** |
| AI calls | 2 | 4 | **−2 (−50.0%)** |
| Total tokens | 5,641 | 18,599 | **−12,958 (−69.7%)** |
| Estimated cost | $0.00170745 | $0.00448005 | **−$0.00277260 (−61.9%)** |
| Reviewer calls | 0 | 2 | −2 |
| Improver calls | 0 | 1 | −1 |

Architecture C validation itself took 2,517 ms including the deterministic
gate (1 ms) and material validator (2,516 ms).

The Option-F comparator's unchanged quality pipeline took 34,084 ms:
reviewer calls took 7,134 ms and 6,236 ms, and the improver took 20,712 ms.
Its final second-cycle result did not pass the broad quality threshold; that
does not invalidate M6's retained material correctness or the narrow
Architecture C pass contract.

## Exact fail-safe measurement: C2

C2 is the known conservative validator false fail. It correctly exercised the
fail-safe route: Architecture C rejected the retained primary, and the same
primary then entered the unchanged Option-F pipeline.

| Metric | Architecture C fallback | Same measured Option F without validator | Added fail-safe overhead |
|---|---:|---:|---:|
| End-to-end latency | 48,672 ms | 45,736 ms | +2,936 ms |
| AI calls | 5 | 4 | +1 |
| Total tokens | 20,603 | 18,190 | +2,413 |
| Estimated cost | $0.00515160 | $0.00470190 | +$0.00044970 |

Option F ran two reviewer calls (5,150 ms and 6,910 ms) and one improver call
(17,010 ms), for 29,070 ms of quality-pipeline time. This is the intended
tradeoff: a conservative Architecture C rejection adds one validator call but
preserves the existing safety pipeline and primary lesson.

## Safety assessment

- **Confirmed false passes:** 0 in the retained controls.
- **Confirmed false fails:** C2 remains a known false fail, but it is safe
  because it routes to Option F rather than to the student unchecked.
- **M6 manual assessment:** materially correct; equivalent fractions and the
  complete reasoning chain remain intact.
- **Fallback safety:** no second primary generation, no repair path, and no
  validator output is used to rewrite the lesson.

## Telemetry

Regular solve telemetry now includes:

- `architecturePath`: `option_f`, `architecture_c_fast_pass`, or
  `architecture_c_fallback`;
- `structuralGate`;
- `materialValidator`;
- validator calls, elapsed time, token usage, and cost in the existing totals;
- existing draft, reviewer, improver, latency, token, and cost fields.

No question, answer, or student content is added to telemetry.

## Evidence and limitations

- Exact routing behavior was proved with deterministic injected controls.
- Exact M6 and C2 measurements reused retained primary outputs.
- Measurement generated zero new primary lessons.
- The sample is intentionally narrow and is not a population-wide quality or
  latency claim.
- The feature remains disabled by default and is not published.

## Files

- `architecture_c_failsafe_measurement.json`
- `architecture_c_option_f_comparator.json`
- `src/benchmark/architectureCFastPathRoutingCheck.ts`
- `src/benchmark/architectureCFailsafeMeasurement.ts`
- `src/benchmark/architectureCOptionFComparator.ts`
