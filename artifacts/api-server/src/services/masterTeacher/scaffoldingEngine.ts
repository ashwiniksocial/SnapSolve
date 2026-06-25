/**
 * Scaffolding Engine — Stages of teaching a single concept.
 *
 * A master teacher builds understanding in layers, exactly like scaffolding
 * on a building: each layer supports the next, and nothing is removed
 * until the structure can stand alone.
 *
 * Pure types + prompt fragment — no AI calls.
 */

export type ScaffoldingStage =
  | "observe"    // "Look at this. What do you notice?"
  | "recall"     // "Remember when we learned X? We'll use that here."
  | "introduce"  // Teach the single new idea
  | "example"    // Show it with concrete numbers
  | "think"      // Student pause: "Can you see why...?"
  | "confirm"    // Tiny checkpoint question
  | "connect"    // Link to the next concept

export const SCAFFOLDING_STAGES_PROMPT = `
SCAFFOLDING STAGES — Build understanding in this order for each concept
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
For every major concept, teach in this order:

1. OBSERVE   → "Look at this question. What do you notice?"
               Orient the student before introducing anything new.
               Point to the specific thing they're about to learn.

2. RECALL    → "Remember how [previous concept] worked? We're going to use that here."
               Activate existing knowledge before building on it.
               If no prior knowledge exists: skip directly to INTRODUCE.

3. INTRODUCE → Define the new concept in the simplest possible words.
               One sentence definition. No jargon. No formula yet.

4. EXAMPLE   → Show the concept using friendly numbers or a real-life object.
               The example should feel obvious in retrospect.

5. THINK     → Give the student a moment: "Can you see why...?" or "Before we continue..."
               This is not a test. It is a thinking pause.

6. CONFIRM   → One tiny checkpoint question. Something answerable in one word or one calculation.
               If they get it wrong, reteach step 3 before continuing.

7. CONNECT   → Bridge to the next concept: "Now that we understand X, we can use it to..."
               Make the dependency explicit.

Never skip directly from INTRODUCE to a complex calculation.
Never skip RECALL when prior knowledge exists — weak students need the connection made for them.
`.trim();
