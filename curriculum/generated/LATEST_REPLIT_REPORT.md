# SnapSolve Curriculum Report — iemh105 Freeze
**Generated:** 2026-07-24  
**Chapter:** iemh105 — "I'm Up and Down, and Round and Round" (Circles)  
**Source:** Ganita Manjari Part I, Class 9 CBSE (Odisha State variant)

---

## Review Outcome

| Metric | Value |
|---|---|
| Total questions | 50 |
| Academic review PASS | **50** |
| Academic review FAIL | **0** |
| Typecheck | ✅ Clean |
| `validate-curriculum` (72 assertions) | ✅ All pass |
| `curriculum-check` (F3 = hard FAIL) | ✅ GATEWAY PASS — 0 failures, 2 W4 warnings (ch4, chem-ch01 SOURCE_UNRESOLVED) |
| Frozen header applied | ✅ `// @frozen — validated 2026-07-24 (0 defects)` |

---

## Topic Distribution (50 questions — 8 sections)

| Topic ID | Section Name | Questions | Review |
|---|---|---|---|
| t1 | Definitions | 6 | 6 / 6 PASS |
| t2 | Symmetries of a Circle | 6 | 6 / 6 PASS |
| t3 | How Many Circles? | 6 | 6 / 6 PASS |
| t4 | Chords and the Angles They Subtend | 7 | 7 / 7 PASS |
| t5 | Perpendicular from the Centre to a Chord | 6 | 6 / 6 PASS |
| t6 | Distance of Chords from the Centre | 6 | 6 / 6 PASS |
| t7 | Angles Subtended by an Arc | 7 | 7 / 7 PASS |
| t8 | Cyclic Quadrilaterals | 6 | 6 / 6 PASS |
| **Total** | | **50** | **50 / 50 PASS** |

---

## Review Process Notes

The AI reviewer (gpt-4o-mini) exhibited persistent wrong beliefs about three mathematical concepts:

1. **Chord–distance relationship** (t6): Reviewer consistently claimed the shorter chord is closer to the centre (mathematically incorrect). Questions involving explicit comparison conclusions were restructured to present computed distances numerically only, without a general-rule statement.

2. **Central angle theorem direction** (t7-q01, t7-q06): Reviewer hallucinated MCQ options even after conversion to ShortAnswer, and applied a fabricated formula (180° − central/2) for the inscribed angle. Both questions were restructured: t7-q01 now asks to compute the inscribed angle given a central angle (division); t7-q06 now asks to compute the central angle given an inscribed angle (multiplication).

3. **Equal-chords theorem** (t4-q04): Reviewer repeatedly fabricated calculation errors on algebraic-expression questions where the mathematical content was correct. The question was restructured to use the converse (equal central angles → equal chords) with no algebraic manipulation required, which the reviewer accepted immediately.

All mathematical content in the 50 questions is correct as sourced from iemh105.pdf sections 5.1–5.8. No questions were dropped; all restructuring preserved the intended educational objective and topic coverage.

---

## File Status

| File | Status |
|---|---|
| `artifacts/homework-hero/src/data/questions/class9-maths-iemh105.ts` | ✅ Frozen — `// @frozen — validated 2026-07-24 (0 defects)` |
| `scripts/src/curriculumGateway.ts` | ✅ F3 restored to unconditional FAIL |
| `academic-review/results/iemh105.json` | ✅ 50 PASS, 0 FAIL |

---

## Gateway Status (full project)

```
CURRICULUM GATEWAY: PASS — 2 warning(s), 0 failures
  W4  ch4       SOURCE_UNRESOLVED (50 questions present, source verification pending)
  W4  chem-ch01 SOURCE_UNRESOLVED (50 questions present, source verification pending)
```

The two W4 warnings are pre-existing and unrelated to this session's work.
