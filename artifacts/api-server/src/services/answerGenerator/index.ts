/**
 * Answer Generator — generates Compact, Standard, and Detailed answers
 * for a given question using three parallel OpenAI calls.
 *
 * Three formats:
 *   Compact  — brief revision aid (≤120 words, fast to read)
 *   Standard — full CBSE Board Examination model answer
 *   Detailed — complete teaching lesson with reasoning and misconceptions
 *
 * Regeneration uses reviewer corrections to target only the failed section,
 * leaving approved sections untouched.
 */

import { callOpenAI } from "../../lib/openai";
import type { Correction } from "../academicReviewer";

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface AnswerGeneratorInput {
  board:        string;
  classLevel:   number;
  subject:      string;
  chapter:      string;
  topic:        string;
  difficulty:   string;
  questionText: string;
}

export interface GeneratedAnswers {
  compact:  string;
  standard: string;
  detailed: string;
}

export type AnswerSection = "compact" | "standard" | "detailed";

// ─── System prompts ────────────────────────────────────────────────────────────

const COMPACT_SYSTEM = `You are a CBSE curriculum expert writing COMPACT revision answers for students.

Rules:
- Maximum 120 words total
- Include: the key formula or principle used, brief working, final answer with units
- No padding or unnecessary explanation
- Must be factually 100% correct
- Easy to scan in under 60 seconds

Return ONLY valid JSON: { "compact": "<answer text here>" }`;

const STANDARD_SYSTEM = `You are a CBSE Board Examiner writing STANDARD model answers.

Rules:
- This answer must score FULL MARKS in a CBSE Board Examination
- Include every step an examiner awards marks for
- Use correct CBSE terminology throughout
- Structured clearly: define knowns → state method → show working → state answer with units
- No padding — length matches the difficulty and marks weightage
- Appropriate for the specified class level

Return ONLY valid JSON: { "standard": "<answer text here>" }`;

const DETAILED_SYSTEM = `You are a Master Teacher writing DETAILED teaching answers for CBSE students.

Rules:
- Explain WHY before HOW for every concept
- Assume the student is confused — build understanding from first principles
- Define every technical term on first use, in plain English
- Show ALL calculations step by step with the reason for each step
- Address the most common misconception about this topic explicitly
- Include a key takeaway the student can reuse on similar questions
- Use simple, friendly English throughout — no unexplained jargon

Return ONLY valid JSON: { "detailed": "<answer text here>" }`;

// ─── Helpers ───────────────────────────────────────────────────────────────────

function metaHeader(i: AnswerGeneratorInput): string {
  return `Board: ${i.board} | Class: ${i.classLevel} | Subject: ${i.subject} | Chapter: ${i.chapter} | Topic: ${i.topic} | Difficulty: ${i.difficulty}`;
}

function buildUserPrompt(input: AnswerGeneratorInput, extraInstruction = ""): string {
  return [
    metaHeader(input),
    extraInstruction,
    "",
    "QUESTION:",
    input.questionText,
  ].filter(Boolean).join("\n");
}

const MAX_TOKENS: Record<AnswerSection, number> = {
  compact:  350,
  standard: 700,
  detailed: 1400,
};

// ─── Generation ────────────────────────────────────────────────────────────────

/**
 * Generate all three answer formats in parallel.
 * Three simultaneous OpenAI calls — total wall-clock time ≈ slowest call.
 */
export async function generateAnswers(
  input:  AnswerGeneratorInput,
  apiKey: string,
): Promise<GeneratedAnswers> {
  const userPrompt = buildUserPrompt(input);

  const [compactRaw, standardRaw, detailedRaw] = await Promise.all([
    callOpenAI<{ compact?:  string }>({ apiKey, system: COMPACT_SYSTEM,  user: userPrompt, maxTokens: MAX_TOKENS.compact,  label: "gen-compact"  }),
    callOpenAI<{ standard?: string }>({ apiKey, system: STANDARD_SYSTEM, user: userPrompt, maxTokens: MAX_TOKENS.standard, label: "gen-standard" }),
    callOpenAI<{ detailed?: string }>({ apiKey, system: DETAILED_SYSTEM, user: userPrompt, maxTokens: MAX_TOKENS.detailed, label: "gen-detailed" }),
  ]);

  return {
    compact:  compactRaw.compact   ?? "",
    standard: standardRaw.standard ?? "",
    detailed: detailedRaw.detailed ?? "",
  };
}

// ─── Regeneration ──────────────────────────────────────────────────────────────

const SYSTEM_MAP: Record<AnswerSection, string> = {
  compact:  COMPACT_SYSTEM,
  standard: STANDARD_SYSTEM,
  detailed: DETAILED_SYSTEM,
};

/**
 * Regenerate a single failed answer section using the reviewer's corrections.
 * Only the corrections relevant to this section are injected into the prompt.
 */
export async function regenerateSection(
  section:     AnswerSection,
  input:       AnswerGeneratorInput,
  corrections: Correction[],
  apiKey:      string,
): Promise<string> {
  const relevant = corrections
    .filter((c) => c.section.toLowerCase() === section)
    .map((c) => `• Issue: ${c.issue}\n  Required fix: ${c.required_fix}`)
    .join("\n\n");

  const extraInstruction = relevant
    ? `\nREVIEWER CORRECTIONS — you MUST address every point below:\n${relevant}`
    : "";

  const raw = await callOpenAI<Record<string, string>>({
    apiKey,
    system:    SYSTEM_MAP[section],
    user:      buildUserPrompt(input, extraInstruction),
    maxTokens: MAX_TOKENS[section],
    label:     `regen-${section}`,
  });

  return raw[section] ?? "";
}
