/**
 * Lesson Pacing Engine — Cognitive load estimation and split rules.
 *
 * If too many new concepts appear together, a weak student shuts down.
 * The pacing engine enforces breathing room: after every heavy concept,
 * a lighter moment (example, analogy, checkpoint) before the next one.
 *
 * Pure types + prompt fragment — no AI calls.
 */

export type CognitiveLoad = "low" | "medium" | "high";

export interface PacingNote {
  location:    string;         // which section or concept
  note:        string;         // specific pacing instruction
  reason:      string;         // why this matters for a weak student
}

/**
 * Rules for pacing — injected into the planning call so the planner
 * can flag high-load concepts and suggest breathing moments.
 */
export const PACING_RULES_PROMPT = `
LESSON PACING RULES
━━━━━━━━━━━━━━━━━━━
Cognitive load is the number of new things a student must hold in their head at once.
A student scoring 20/100 can hold at most ONE new thing at a time.

Rate each concept as: low / medium / high cognitive load.
  low    = familiar idea, minor extension of something they know
  medium = new idea, but builds directly on something just taught
  high   = completely new, abstract, requires multiple sub-concepts

PACING RULES:
□ After a HIGH load concept: always insert a low-load moment before the next concept.
  Low-load moments: real-life example, familiar analogy, simple checkpoint question.
□ Never place two HIGH concepts consecutively without a break.
□ If a single concept has 3+ sub-ideas, split it into 3 concepts.
□ If explaining a step requires more than 4 sentences, something is missing — add more detail, do not compress.
□ Paragraphs over 5 sentences are a red flag: split them.

SIGNS A STUDENT IS OVERLOADED:
  → Multiple new terms appear in the same sentence
  → A calculation uses a formula that was just introduced in the same step
  → The student needs to remember 3+ facts to follow the current step

When you detect high cognitive load, add a "breathing moment":
  "Let's pause here for a second..."
  "Before we use this, let's make sure we really understand it."
  "Don't worry if this feels like a lot — we'll go through it piece by piece."
`.trim();
