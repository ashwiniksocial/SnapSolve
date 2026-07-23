/**
 * Academic Reviewer — final quality gate for generated Q&A content.
 *
 * One reusable prompt evaluates eight dimensions in a single LLM call:
 *   1. Curriculum alignment
 *   2. Question quality
 *   3. Answer correctness
 *   4. Teaching quality
 *   5. Exam readiness
 *   6. Compact answer
 *   7. Standard answer
 *   8. Detailed answer
 *
 * Supports partial re-review: when sectionsToReview is provided, the model
 * evaluates only those sections and marks all others PASS automatically.
 * This avoids re-spending tokens on already-approved content.
 */

import { callOpenAI } from "../../lib/openai";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface ReviewInput {
  board:        string;
  classLevel:   number;
  subject:      string;
  chapter:      string;
  topic:        string;
  difficulty:   string;
  questionText: string;
  compact:      string;
  standard:     string;
  detailed:     string;
  /**
   * If provided, only these answer sections are evaluated.
   * All other sections are automatically marked PASS.
   * Used for the second-pass re-review after partial regeneration.
   */
  sectionsToReview?: ("compact" | "standard" | "detailed")[];
}

export interface Correction {
  section:      "Compact" | "Standard" | "Detailed";
  issue:        string;
  required_fix: string;
}

export interface ReviewResult {
  overall:     "PASS" | "FAIL";
  curriculum:  "PASS" | "FAIL";
  question:    "PASS" | "FAIL";
  correctness: "PASS" | "FAIL";
  teaching:    "PASS" | "FAIL";
  exam:        "PASS" | "FAIL";
  compact:     "PASS" | "FAIL";
  standard:    "PASS" | "FAIL";
  detailed:    "PASS" | "FAIL";
  reasons:     string[];
  corrections: Correction[];
}

// ─── System prompt ─────────────────────────────────────────────────────────────

const REVIEWER_SYSTEM = `You are a Senior Academic Reviewer for NCERT/CBSE curriculum content (Classes 6–12).
Your role is the FINAL quality gate before generated Q&A is published to students.

Return ONLY valid JSON matching this exact schema — no extra keys, no markdown:
{
  "overall":     "PASS|FAIL",
  "curriculum":  "PASS|FAIL",
  "question":    "PASS|FAIL",
  "correctness": "PASS|FAIL",
  "teaching":    "PASS|FAIL",
  "exam":        "PASS|FAIL",
  "compact":     "PASS|FAIL",
  "standard":    "PASS|FAIL",
  "detailed":    "PASS|FAIL",
  "reasons":     ["<string>"],
  "corrections": [
    {
      "section":      "Compact|Standard|Detailed",
      "issue":        "<string>",
      "required_fix": "<string>"
    }
  ]
}

EVALUATION CRITERIA

1. CURRICULUM
   Verify: matches latest official NCERT/CBSE curriculum; correct chapter and topic;
   correct terminology and learning outcomes; no deleted or out-of-syllabus content.

2. QUESTION QUALITY
   Verify: tests the correct concept; appropriate difficulty; clear and unambiguous;
   tests the intended learning objective; matches current CBSE examination style.

3. ANSWER CORRECTNESS
   Verify: final answer value; all formulae and calculations; units and significant
   figures; scientific facts; definitions; mathematical logic; grammar; internal
   consistency; no contradictions; no hallucinations.

4. TEACHING QUALITY
   Determine whether an average or weak student will genuinely understand the topic.
   Verify: WHY before HOW; every reasoning step explained; no skipped logic;
   simple English; difficult terms explained on first use; important concepts
   highlighted; common mistakes addressed; key takeaway present; student can
   solve a similar question afterwards.

5. EXAM READINESS
   Determine whether the Standard Answer would receive FULL MARKS in the current
   CBSE Board Examination. Verify: correct terminology; all marking points covered;
   appropriate structure and detail; nothing unnecessary included.

6. COMPACT ANSWER
   Verify: suitable for quick revision; complete; concise; readable in under 60 seconds.

7. STANDARD ANSWER
   Verify: ideal Board Examination model answer; balanced explanation; examiner-
   friendly; full-mark worthy.

8. DETAILED ANSWER
   Verify: complete teaching lesson; builds intuition; explains reasoning fully;
   addresses misconceptions; delivers deep conceptual understanding.

RULES
- overall = PASS only when ALL eight criteria pass AND all three answer sections pass.
- overall = FAIL if ANY criterion or answer section fails.
- Add one correction entry for every failed answer section.
- reasons must list every failure clearly (empty array is allowed on full PASS).
- If partial re-review is requested, follow the instruction in the user prompt.`;

// ─── User prompt ───────────────────────────────────────────────────────────────

function buildUserPrompt(input: ReviewInput): string {
  const partialNote = input.sectionsToReview?.length
    ? `\nPARTIAL RE-REVIEW: Evaluate ONLY these sections: ${input.sectionsToReview.join(", ")}.\n` +
      `Mark all other answer sections (and criteria already approved) as PASS automatically.\n`
    : "";

  return `${partialNote}
BOARD: ${input.board}
CLASS: ${input.classLevel}
SUBJECT: ${input.subject}
CHAPTER: ${input.chapter}
TOPIC: ${input.topic}
DIFFICULTY: ${input.difficulty}

QUESTION:
${input.questionText}

--- COMPACT ANSWER ---
${input.compact}

--- STANDARD ANSWER ---
${input.standard}

--- DETAILED ANSWER ---
${input.detailed}

Evaluate the Q&A above. Return only the JSON result.`.trimStart();
}

// ─── Safe-parse raw LLM output ─────────────────────────────────────────────────

function normalise(raw: unknown): ReviewResult {
  const r = (raw ?? {}) as Partial<ReviewResult>;
  const pf = (v: unknown): "PASS" | "FAIL" => v === "PASS" ? "PASS" : "FAIL";
  return {
    overall:     pf(r.overall),
    curriculum:  pf(r.curriculum),
    question:    pf(r.question),
    correctness: pf(r.correctness),
    teaching:    pf(r.teaching),
    exam:        pf(r.exam),
    compact:     pf(r.compact),
    standard:    pf(r.standard),
    detailed:    pf(r.detailed),
    reasons:     Array.isArray(r.reasons)     ? (r.reasons     as string[]) : [],
    corrections: Array.isArray(r.corrections) ? (r.corrections as Correction[]) : [],
  };
}

// ─── Public API ────────────────────────────────────────────────────────────────

/**
 * Review all three answer sections (or a subset for partial re-review).
 * Uses a single OpenAI call regardless of how many sections are evaluated.
 */
export async function reviewAnswers(
  input:  ReviewInput,
  apiKey: string,
): Promise<ReviewResult> {
  const raw = await callOpenAI<unknown>({
    apiKey,
    system:    REVIEWER_SYSTEM,
    user:      buildUserPrompt(input),
    maxTokens: 1000,
    label:     "academic-reviewer",
  });
  return normalise(raw);
}
