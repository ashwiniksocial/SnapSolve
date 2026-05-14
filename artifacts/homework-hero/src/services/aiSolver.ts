/**
 * AI Solver Service
 *
 * Currently uses the local mock engine (solutionBank + keyword matcher).
 * To integrate OpenAI / Gemini: implement `callLLM` below and toggle MOCK_MODE.
 *
 * The AIResponse interface is designed to be identical whether the data comes
 * from the mock engine or a live LLM, so the UI components never need changes.
 */

import { matchSolution, type AIResponse } from "@/data/solutionBank";
import type { Subject } from "@/data/subjects";

export type { AIResponse, SolutionStep, SimilarQuestion } from "@/data/solutionBank";

const MOCK_MODE = true; // Flip to false when a real LLM endpoint is ready

// ─── MOCK ENGINE ───────────────────────────────────────────────────────────────

function mockSolve(subject: Subject, question: string): AIResponse {
  const base = matchSolution(subject, question);
  return {
    ...base,
    detectedQuestion: question.trim() || base.detectedQuestion,
  };
}

// ─── FUTURE: REAL LLM INTEGRATION ─────────────────────────────────────────────
//
// async function callLLM(
//   subject: Subject,
//   question: string,
//   imageBase64?: string
// ): Promise<AIResponse> {
//   const messages = [
//     {
//       role: "system",
//       content: `You are an expert ${subject} tutor for Class 6–12 students.
//         Return a JSON object matching the AIResponse interface:
//         { id, subject, topic, difficulty, detectedQuestion, steps[], finalAnswer, keyConcepts[], similarQuestions[] }.
//         Each step: { stepNumber, title, explanation, formula?, result? }.
//         Each similarQuestion: { id, question, hint, answer, difficulty }.
//         Generate exactly 5 similarQuestions.`,
//     },
//     {
//       role: "user",
//       content: imageBase64
//         ? [
//             { type: "text",      text: `Subject: ${subject}\n${question}` },
//             { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
//           ]
//         : `Subject: ${subject}\n${question}`,
//     },
//   ];
//   const res = await fetch("/api/solve", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ messages }),
//   });
//   return res.json() as Promise<AIResponse>;
// }

// ─── PUBLIC API ────────────────────────────────────────────────────────────────

const LOADING_PHASES: string[] = [
  "Reading your question…",
  "Identifying topic & difficulty…",
  "Building step-by-step solution…",
  "Generating similar problems…",
  "Finalising answer…",
];

export function getLoadingPhases(): string[] {
  return LOADING_PHASES;
}

export async function solve(
  subject: Subject,
  question: string,
  _imageBase64?: string, // reserved for LLM integration
  onPhase?: (msg: string, index: number) => void
): Promise<AIResponse> {
  const totalMs = 2000 + Math.random() * 800;
  const phaseMs = totalMs / LOADING_PHASES.length;

  for (let i = 0; i < LOADING_PHASES.length; i++) {
    onPhase?.(LOADING_PHASES[i], i);
    await new Promise((r) => setTimeout(r, phaseMs));
  }

  if (MOCK_MODE) return mockSolve(subject, question);

  // Uncomment when real endpoint is ready:
  // return callLLM(subject, question, _imageBase64);
  return mockSolve(subject, question);
}
