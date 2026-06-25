/**
 * Analogy Selector — Types and rules for choosing teaching analogies.
 *
 * Every abstract concept should be checked: does it benefit from an analogy?
 * Good analogies make abstract ideas feel familiar and non-threatening.
 * Forced analogies confuse more than they help.
 *
 * Pure types + prompt fragment — no AI calls.
 */

export interface AnalogySpec {
  concept:  string;  // the abstract concept
  analogy:  string;  // the real-life analogy, or empty string if none fits
  why:      string;  // why this analogy helps (internal, not shown to student)
}

/**
 * Prompt fragment that governs analogy selection inside the planning call.
 */
export const ANALOGY_RULES_PROMPT = `
ANALOGY SELECTION RULES
━━━━━━━━━━━━━━━━━━━━━━━
Use an analogy when:
  ✓ The concept is abstract (invisible, theoretical, hard to picture)
  ✓ The student has likely seen the real-world version of it
  ✓ The analogy maps cleanly onto the concept (not forced)
  ✓ It would make a confused student say "oh — I've seen that before!"

Do NOT use an analogy when:
  ✗ The concept is already concrete (e.g. "add these two numbers")
  ✗ The analogy requires more explanation than the concept itself
  ✗ The analogy is a stretch that might mislead

Examples of good analogies:
  rational number     → a recipe: tells you exact proportions (3 flour : 2 water)
  irrational number   → a number that never settles: like π = 3.14159... no pattern
  proof by contradiction → wearing a winter coat to prove it's not summer (assumption leads to nonsense)
  algebraic variable  → a box with an unknown number inside
  contradiction       → assuming a round peg fits a square hole, then proving it can't
  squaring both sides → weighing two identical boxes: if one is heavier, it was always heavier

When writing the analogy, use:
  "This is exactly like when you..."
  "Think of it as..."
  "Imagine..."
  Never say "This is analogous to" — that is textbook language.
`.trim();
