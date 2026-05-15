/**
 * Solution Engine — Generates an AIResponse from a detected topic + raw text.
 *
 * Strategy:
 *  1. Search question bank for questions matching the detected topic.
 *  2. Among those, find the one whose text is closest to the scanned question.
 *  3. If a good match exists (similarity > threshold): use its solution,
 *     replacing detectedQuestion with the actual scanned text.
 *  4. If no good match: delegate to the existing mockSolve / solutionBank fallback.
 *
 * Firebase/LLM migration path:
 *  Replace the body of `generateSolution` with an API call.
 *  The return type (AIResponse) stays identical.
 */

import { matchSolution, type AIResponse } from "@/data/solutionBank";
import { getQuestions }                    from "@/services/questionService";
import type { Subject }                    from "@/data/subjects";
import type { TopicMatch }                 from "./topicMatcher";

// ─── Text similarity ──────────────────────────────────────────────────────────

function wordSet(text: string): Set<string> {
  return new Set(
    (text.toLowerCase().match(/[a-z0-9]+/g) ?? ([] as string[])).filter((w) => w.length > 2)
  );
}

function jaccard(a: string, b: string): number {
  const sa = wordSet(a);
  const sb = wordSet(b);
  let intersection = 0;
  for (const w of sa) if (sb.has(w)) intersection++;
  const union = sa.size + sb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

// ─── Fallback solution structure ──────────────────────────────────────────────

function buildFallback(
  subject: Subject,
  topic: string,
  detectedText: string,
  confidence: number
): AIResponse {
  const difficulty =
    confidence > 0.5 ? "Medium" :
    confidence > 0.2 ? "Easy"   : "Medium";

  const confLabel =
    confidence > 0.5 ? "high"   :
    confidence > 0.2 ? "medium" : "low";

  return {
    id:               `scan-fallback-${Date.now()}`,
    subject,
    topic,
    difficulty,
    detectedQuestion: detectedText,
    steps: [
      {
        stepNumber:  1,
        title:       "Identify the problem type",
        explanation: `This question appears to be from the topic "${topic}" in ${subject}. Read the question carefully and identify all given values and what you need to find.`,
      },
      {
        stepNumber:  2,
        title:       "Recall relevant concepts",
        explanation: `For ${topic}, recall the key formulas and theorems. Write down all given data before proceeding.`,
        formula:     "Write: Given: …  Find: …",
      },
      {
        stepNumber:  3,
        title:       "Apply the method",
        explanation: "Apply the relevant formula or theorem step by step. Show all working clearly.",
      },
      {
        stepNumber:  4,
        title:       "Verify and state the answer",
        explanation: "Check your answer by substituting back, or by checking units. State the final answer clearly with units if applicable.",
      },
    ],
    finalAnswer:      `Solution generated with ${confLabel} topic confidence. For an exact solution, verify the question matches "${topic}" and check the question bank.`,
    keyConcepts:      [topic, subject, "Step-by-step method", "Verification"],
    similarQuestions: [],
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Generate a full AIResponse for a scanned question.
 *
 * @param detectedText  Cleaned OCR text (the student's question)
 * @param match         Best topic match from topicMatcher
 */
export function generateSolution(
  detectedText: string,
  match: TopicMatch
): AIResponse {
  const { subject, topic, confidence } = match;

  // 1. Get all questions for this topic from the bank
  const bankQuestions = getQuestions({ subject, topicName: topic });

  // 2. Find the closest matching question by Jaccard similarity
  let bestQ = bankQuestions[0];
  let bestSim = bestQ ? jaccard(detectedText, bestQ.question) : 0;

  for (const q of bankQuestions.slice(1)) {
    const sim = jaccard(detectedText, q.question);
    if (sim > bestSim) { bestSim = sim; bestQ = q; }
  }

  // 3. If we have a reasonable match, build an AIResponse from the bank question
  if (bestQ && (bestSim > 0.08 || confidence > 0.15)) {
    return {
      id:               `scan-${bestQ.id}`,
      subject,
      topic,
      difficulty:       bestQ.difficulty,
      detectedQuestion: detectedText || bestQ.question,
      steps:            bestQ.steps,
      finalAnswer:      bestQ.answer,
      keyConcepts:      bestQ.keyConcepts,
      similarQuestions: [],
    };
  }

  // 4. Try the solutionBank's fuzzy matcher (it covers subjects without bank entries)
  if (confidence > 0.1) {
    const base = matchSolution(subject, detectedText);
    return {
      ...base,
      detectedQuestion: detectedText || base.detectedQuestion,
      topic:            topic || base.topic,
    };
  }

  // 5. Full fallback — structured explanation without a specific answer
  return buildFallback(subject, topic, detectedText, confidence);
}

/** Convenience: delegate to existing mock solver for typed questions. */
export function generateSolutionFromText(
  subject: Subject,
  question: string
): AIResponse {
  return matchSolution(subject, question);
}
