/**
 * Student Checkpoint Engine — Micro-questions after every major concept.
 *
 * Checkpoints are NOT tests. They are teaching tools.
 * A checkpoint confirms understanding before the lesson moves on.
 * If the student gets it wrong, the lesson re-teaches before continuing.
 *
 * Pure types + prompt fragment — no AI calls.
 */

export interface Checkpoint {
  afterConcept: string;   // which concept this checkpoint follows
  question:     string;   // the tiny question (answerable in ≤5 words)
  correctHint:  string;   // if wrong, reteach this (brief note)
}

export const CHECKPOINT_RULES_PROMPT = `
STUDENT CHECKPOINT RULES
━━━━━━━━━━━━━━━━━━━━━━━━
After every major concept, include a checkpoint.

A good checkpoint:
  ✓ Can be answered in one word, one number, or one short phrase
  ✓ Tests the CORE idea of the concept — not a trick
  ✓ Is phrased gently: "Quick check:", "Just to confirm:", "Before we move on:"
  ✓ Tells the student what to do if they're unsure: "If you're not sure, re-read the paragraph above."

A bad checkpoint:
  ✗ Requires a multi-step calculation
  ✗ Introduces new terminology not yet taught
  ✗ Feels like an exam question (creates anxiety)
  ✗ Could be skipped without affecting understanding of what follows

Examples of good checkpoints:
  After "rational number": "Quick check — is 0.5 a rational number? Why?"
  After "proof by contradiction": "Just to confirm: what did we assume at the very start?"
  After "squaring both sides": "Before we continue — what did squaring do to our equation?"

Tone: Warm, casual, encouraging. Never: "Test yourself:", "Prove that:", "Calculate:"
`.trim();
