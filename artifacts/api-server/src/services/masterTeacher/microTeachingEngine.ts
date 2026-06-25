/**
 * Micro Teaching Engine — Enforces the one-idea-per-paragraph rule.
 *
 * A master teacher never introduces two unfamiliar ideas in one breath.
 * Each paragraph should do exactly ONE of: introduce, explain, demonstrate,
 * connect, or confirm. Never more than one.
 *
 * Pure prompt fragment — no AI calls.
 */

export const MICRO_TEACHING_RULES = `
MICRO TEACHING RULES — One idea per paragraph. Zero exceptions.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Each paragraph must do EXACTLY ONE of the following:
  INTRODUCE  — Name and define one new concept
  EXPLAIN    — Explain why that concept works (the WHY)
  DEMONSTRATE — Show one example using that concept
  CONNECT    — Link the new concept to something the student already knows
  CONFIRM    — Pause and check that the student understood

Rules:
□ If you find yourself about to introduce a second new term in the same paragraph → split.
□ If a paragraph is more than 4 sentences → consider splitting.
□ After every INTRODUCE, the very next paragraph should be EXPLAIN.
□ After a complex EXPLAIN, add a CONNECT (analogy or familiar example).
□ Never chain three consecutive EXPLAINs without a CONNECT or CONFIRM.
□ Every new formula gets its own paragraph: introduce → explain why → show calculation.

Signs that a paragraph needs splitting:
  - It contains two unfamiliar words introduced for the first time
  - It both defines a concept AND shows a calculation using it
  - A student reading it would need to pause twice for different reasons
`.trim();
