/**
 * Architecture C — compact material-safety validator.
 *
 * Diagnostic-only. This call classifies material defects and never rewrites,
 * repairs, scores, or routes a lesson. Optional polish is explicitly excluded
 * from the fail decision.
 */

import type { LessonResponse } from "../../lib/lessonTypes";
import { extractUsage, zeroUsage, type UsageSnapshot } from "../../lib/aiCost";
import { retryFetch } from "../../lib/retryFetch";

export const MATERIAL_CATEGORIES = [
  "correctness",
  "reasoning",
  "curriculum_fit",
  "weak_student_sufficiency",
  "hallucination",
  "prerequisites",
  "contradiction",
  "completeness",
] as const;

export type MaterialCategory = (typeof MATERIAL_CATEGORIES)[number];
export type MaterialValidationStatus = "MATERIAL_PASS" | "MATERIAL_FAIL" | "VALIDATOR_ERROR";

export interface MaterialIssue {
  category:    MaterialCategory;
  section:     string;
  evidence:    string;
  explanation: string;
}

export interface MaterialValidationResult {
  status:        MaterialValidationStatus;
  issues:        MaterialIssue[];
  optionalPolish: string[];
  confidence:    number;
  usage:         UsageSnapshot;
  latencyMs:     number;
  error?:        string;
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";
const VALIDATOR_TIMEOUT = 35_000;

const VALIDATOR_SYSTEM = `You are a narrow material-safety validator for a CBSE/ICSE student lesson.

Your task is classification only. Do not rewrite the lesson and do not grade style.
Return MATERIAL_FAIL only when the lesson has a material defect that could make a
student learn something false, use invalid reasoning, fail to answer the asked
question, be misled by a hallucinated claim, lack a prerequisite needed to follow
the reasoning, encounter a contradiction, or lack a required TeachingLesson section.

Check only these categories:
1. correctness — wrong answer, equation, fact, unit, or calculation
2. reasoning — a logical gap that makes the conclusion unsupported or unusable
3. curriculum_fit — answer does not address the asked curriculum question or teaches a different concept
4. weak_student_sufficiency — a missing explanation blocks a weak student from following the central solution
5. hallucination — invented source, observation, rule, result, or unsupported factual claim
6. prerequisites — a required prior idea is used without being stated or explained
7. contradiction — two parts of the lesson materially disagree
8. completeness — a required lesson section or required content is absent

Do not fail for optional polish: tone, verbosity, analogy quality, extra examples,
wording preferences, a weak but harmless pause question, or a reviewer score below
its teaching-quality threshold. A lesson can be MATERIAL_PASS while needing polish.
If the lesson is safe, return an empty issues array and list polish opportunities
separately. Each material issue must cite concise evidence from the lesson.

MATHEMATICAL EQUIVALENCE:
- Evaluate the complete ordered reasoning chain, not isolated lines.
- Before declaring an intermediate expression incorrect, inspect the preceding step,
  the current step, and the immediately following relevant step.
- Unsimplified and simplified fractions may both be correct (for example, 90/200 = 9/20).
- Decimal, fraction, percentage, reordered commutative, and algebraically transformed forms
  are not contradictions when the transformation preserves the same value.
- If an adjacent step explicitly performs a correct trivial simplification or transformation,
  do not report the earlier unsimplified form as a correctness, reasoning, completeness, or
  weak-student-sufficiency issue.
- A correct trivial transformation does not need an elaborate explanation to be materially
  safe. Any desire for more explanation belongs in optionalPolish.
- Verify the transformation itself. Do not assume two forms are equivalent merely because
  a later final answer is correct.
- A genuinely invalid transformation remains a material defect (for example, 90/200 ≠ 9/10).

Return only this JSON shape:
{
  "materialSafe": boolean,
  "issues": [
    {
      "category": "correctness|reasoning|curriculum_fit|weak_student_sufficiency|hallucination|prerequisites|contradiction|completeness",
      "section": string,
      "evidence": string,
      "explanation": string
    }
  ],
  "optionalPolish": string[],
  "confidence": number
}`.trim();

function minimalLessonPayload(lesson: LessonResponse): Record<string, unknown> {
  // Keep all content that can establish safety, while omitting transport-only
  // metadata such as `cached`.
  return {
    topic: lesson.topic,
    difficulty: lesson.difficulty,
    keyConcepts: lesson.keyConcepts,
    beforeWeStart: lesson.beforeWeStart,
    prerequisites: lesson.prerequisites,
    vocabulary: lesson.vocabulary,
    intuition: lesson.intuition,
    questionTranslation: lesson.questionTranslation,
    teacherThinking: lesson.teacherThinking,
    guidedReasoning: lesson.guidedReasoning,
    confusionPoints: lesson.confusionPoints,
    commonMistakes: lesson.commonMistakes,
    examinerThinking: lesson.examinerThinking,
    finalAnswer: lesson.finalAnswer,
    simplerExample: lesson.simplerExample,
    practiceQuestion: lesson.practiceQuestion,
    confidenceCheck: lesson.confidenceCheck,
    retrievalPractice: lesson.retrievalPractice,
    rememberThese: lesson.rememberThese,
    confidenceBuilder: lesson.confidenceBuilder,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseIssue(value: unknown): MaterialIssue | null {
  if (!isRecord(value)) return null;
  const category = value.category;
  if (
    typeof category !== "string" ||
    !(MATERIAL_CATEGORIES as readonly string[]).includes(category)
  ) return null;
  if (typeof value.section !== "string" || typeof value.evidence !== "string" || typeof value.explanation !== "string") {
    return null;
  }
  return {
    category: category as MaterialCategory,
    section: value.section.trim(),
    evidence: value.evidence.trim(),
    explanation: value.explanation.trim(),
  };
}

export async function validateMaterialSafety(
  lesson: LessonResponse,
  subject: string,
  question: string,
  apiKey: string,
  timeoutMs: number = VALIDATOR_TIMEOUT,
): Promise<MaterialValidationResult> {
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(
    () => controller.abort(),
    Math.max(1, Math.min(timeoutMs, VALIDATOR_TIMEOUT)),
  );
  let usage = zeroUsage(MODEL);

  try {
    const response = await retryFetch(
      OPENAI_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: MODEL,
          temperature: 0,
          max_tokens: 900,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: VALIDATOR_SYSTEM },
            {
              role: "user",
              content: JSON.stringify({
                subject,
                question,
                lesson: minimalLessonPayload(lesson),
              }),
            },
          ],
        }),
      },
      "architecture-c-validator",
    );

    const body = (await response.json()) as unknown;
    usage = extractUsage(body, MODEL);
    if (!response.ok) {
      return {
        status: "VALIDATOR_ERROR",
        issues: [],
        optionalPolish: [],
        confidence: 0,
        usage,
        latencyMs: Date.now() - startedAt,
        error: `validator_openai_${response.status}`,
      };
    }

    const content = isRecord(body) &&
      Array.isArray(body.choices) &&
      isRecord(body.choices[0]) &&
      isRecord(body.choices[0].message) &&
      typeof body.choices[0].message.content === "string"
      ? body.choices[0].message.content
      : "{}";
    const parsed = JSON.parse(content) as unknown;
    if (!isRecord(parsed) || typeof parsed.materialSafe !== "boolean") {
      return {
        status: "VALIDATOR_ERROR",
        issues: [],
        optionalPolish: [],
        confidence: 0,
        usage,
        latencyMs: Date.now() - startedAt,
        error: "validator_invalid_shape",
      };
    }

    const issues = Array.isArray(parsed.issues)
      ? parsed.issues.map(parseIssue).filter((issue): issue is MaterialIssue => issue !== null)
      : [];
    const optionalPolish = Array.isArray(parsed.optionalPolish)
      ? parsed.optionalPolish.filter((item): item is string => typeof item === "string").slice(0, 10)
      : [];
    const confidence = typeof parsed.confidence === "number" && Number.isFinite(parsed.confidence)
      ? Math.max(0, Math.min(1, parsed.confidence))
      : 0;

    // A valid material issue is authoritative even if the model's boolean is
    // inconsistent. Conversely, an unsafe boolean without an approved,
    // actionable issue is not promoted to a material failure.
    const status: MaterialValidationStatus = issues.length > 0
      ? "MATERIAL_FAIL"
      : parsed.materialSafe
        ? "MATERIAL_PASS"
        : "VALIDATOR_ERROR";

    return {
      status,
      issues,
      optionalPolish,
      confidence,
      usage,
      latencyMs: Date.now() - startedAt,
      ...(status === "VALIDATOR_ERROR" ? { error: "validator_unsafe_without_approved_issue" } : {}),
    };
  } catch (error) {
    return {
      status: "VALIDATOR_ERROR",
      issues: [],
      optionalPolish: [],
      confidence: 0,
      usage,
      latencyMs: Date.now() - startedAt,
      error: String(error),
    };
  } finally {
    clearTimeout(timer);
  }
}