/**
 * Lesson Improver
 *
 * Given a lesson that failed the quality review, rewrites the weak sections
 * and returns a COMPLETE improved LessonResponse in the same JSON schema.
 *
 * Rules:
 *   - Never shorten any explanation
 *   - Fix every critical issue from the review report
 *   - Address every weak-student confusion found
 *   - Return the FULL lesson (not just the changed sections)
 *   - The weakest student (20/100) must understand after the rewrite
 */

import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";
import type { ReviewReport }                         from "./lessonReviewer";

// ─── Constants ────────────────────────────────────────────────────────────────

const OPENAI_URL      = "https://api.openai.com/v1/chat/completions";
const MODEL           = "gpt-4o-mini";
const IMPROVE_TIMEOUT = 70_000;

// ─── Minimal JSON structure hint for the improver ────────────────────────────
// Full field instructions are not repeated — the model improves based on the
// concrete issues found, not from scratch.

const LESSON_JSON_STRUCTURE = `{
  "topic": string,
  "difficulty": "Easy" | "Medium" | "Hard",
  "keyConcepts": string[],
  "aiConfidence": number,
  "beforeWeStart": { "motivator": string, "anxietyReducer": string, "preview": string },
  "prerequisites": string[],
  "vocabulary": [{ "term": string, "meaning": string }],
  "intuition": { "story": string, "visual": string, "everyday": string },
  "questionTranslation": { "plainEnglish": string, "whatWeKnow": string, "whatWeFind": string, "wordToMath": string },
  "teacherThinking": { "firstNotice": string, "whyThisMethod": string, "clues": string },
  "guidedReasoning": [{ "what": string, "why": string, "math": string, "result": string, "pause": string }],
  "confusionPoints": string[],
  "commonMistakes": [{ "mistake": string, "whyItHappens": string, "howToAvoid": string }],
  "examinerThinking": { "whyAsked": string, "conceptTested": string, "topperInsight": string, "examTip": string, "examTrap": string },
  "finalAnswer": { "answer": string, "whyCorrect": string, "verification": string },
  "simplerExample": { "problem": string, "solution": string },
  "practiceQuestion": { "question": string, "hints": [string, string, string], "solution": string },
  "confidenceCheck": { "question": string, "options": [string, string, string, string], "correctIndex": number, "explanation": string },
  "retrievalPractice": string[],
  "rememberThese": string[],
  "confidenceBuilder": string
}`;

// ─── Build the improve system prompt ─────────────────────────────────────────

function buildImproveSystem(report: ReviewReport): string {
  const failingDims = Object.entries(report.scores)
    .filter(([key, score]) => key !== "overall" && score < 95)
    .map(([key, score]) => `  ${key}: ${score}/100`)
    .join("\n");

  const criticalIssuesList = report.criticalIssues
    .filter(i => i.priority === "critical" || i.priority === "high")
    .map((i, idx) =>
      `ISSUE ${idx + 1} [${i.priority.toUpperCase()}] — Section: ${i.section}\n` +
      `  Problem:  ${i.problem}\n` +
      `  Why it fails weak students: ${i.reason}\n` +
      `  Fix:      ${i.suggestedFix}`
    )
    .join("\n\n");

  const confusionList = report.confusions.length > 0
    ? report.confusions.map((c, i) => `  ${i + 1}. ${c}`).join("\n")
    : "  (none listed — focus on the failing dimensions above)";

  return `You are a Master Teaching Improver for CBSE/ICSE student lessons.

A lesson has FAILED its teaching quality review. Your job is to rewrite it so it passes.

TARGET STUDENT: A student who scores 20/100. Forget all prerequisite knowledge. Gets anxious at formulas. Stops reading when confused.

══════════════════════════════════════════════════════════
FAILING DIMENSIONS (all must reach 95/100 to pass)
══════════════════════════════════════════════════════════
${failingDims || "  (close — focus on student confusions below)"}

══════════════════════════════════════════════════════════
SPECIFIC ISSUES TO FIX
══════════════════════════════════════════════════════════
${criticalIssuesList || "  (no specific issues logged — expand weak sections generally)"}

══════════════════════════════════════════════════════════
STUDENT CONFUSIONS TO RESOLVE
══════════════════════════════════════════════════════════
Every confusion listed below MUST be proactively answered inside the lesson:
${confusionList}

══════════════════════════════════════════════════════════
IMPROVEMENT RULES — Follow every rule without exception
══════════════════════════════════════════════════════════
□ NEVER shorten any section. Only expand.
□ FIX every issue listed above. Do not leave any unresolved.
□ ANSWER every student confusion proactively in the appropriate section.
□ vocabulary — define EVERY term, symbol, and phrase before it appears. No exceptions.
□ guidedReasoning — add explicit WHY for every step. Show every algebra and arithmetic line.
□ confusionPoints — rewrite to directly address the confusions listed above.
□ simplerExample — use even simpler numbers. Show every single step.
□ practiceQuestion — hints must guide WITHOUT solving. Three separate ideas, each one step closer.
□ Read the result as a student scoring 20/100. If they would be confused anywhere — fix it.
□ Short sentences. Everyday words. Active voice. Warm, encouraging tone.
□ NEVER write "clearly", "obviously", "trivially", "it follows", "simply", or "just".

══════════════════════════════════════════════════════════
RESPONSE FORMAT — Return ONLY the improved lesson as valid JSON. No extra text.
══════════════════════════════════════════════════════════
${LESSON_JSON_STRUCTURE}`.trim();
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

export async function improveLesson(
  lesson:  LessonResponse,
  report:  ReviewReport,
  apiKey:  string,
): Promise<LessonResponse> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), IMPROVE_TIMEOUT);

  const lessonText = JSON.stringify(lesson, null, 2);
  const system     = buildImproveSystem(report);

  let res: Response;
  try {
    res = await fetch(OPENAI_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model:           MODEL,
        temperature:     0.4,
        max_tokens:      5000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: `Here is the lesson that needs improvement:\n\n${lessonText}`,
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`improve_openai_${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body    = (await res.json()) as any;
  const content = body?.choices?.[0]?.message?.content ?? "{}";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = JSON.parse(content) as any;
  return parseLessonResponse(p);
}
