/**
 * Confusion Predictor — Types and prompt fragment for per-concept confusion prediction.
 *
 * For every concept being taught, the planner predicts every question
 * a student scoring 20/100 would ask. These are resolved proactively
 * in the lesson before the student reaches that point.
 *
 * Pure types + prompt fragment — no AI calls.
 */

export interface ConceptConfusion {
  concept:    string;    // the concept being taught
  confusions: string[];  // questions a 20/100 student will ask here
}

/**
 * Prompt fragment injected into the planning call.
 * Instructs the planner how to generate confusions.
 */
export const CONFUSION_PREDICTOR_PROMPT = `
CONFUSION PREDICTION RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━
For each concept, generate 2–4 specific questions a student scoring 20/100 would ask.
Think like the weakest student in the class:
  - They forget definitions immediately
  - They don't know what variables stand for
  - They don't understand why we do any particular step
  - They stop when they see an unfamiliar word
  - They don't know what a proof is, or why it matters

Types of confusions to predict:
  → Vocabulary confusion:   "What does [term] mean?"
  → Variable confusion:     "What is [variable]? Where did it come from?"
  → Step confusion:         "Why did we suddenly do [operation]?"
  → Logic confusion:        "How does [A] lead to [B]?"
  → Formula confusion:      "Where did this formula come from?"
  → Motivation confusion:   "Why are we doing this at all?"

Be exhaustive. If in doubt, include the confusion.
A lesson that pre-empts 10 confusions is always better than one that pre-empts 3.
`.trim();
