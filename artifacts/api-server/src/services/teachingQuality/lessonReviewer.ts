/**
 * Lesson Reviewer
 *
 * Makes ONE OpenAI call that simultaneously:
 *   1. Scores the lesson across all 9 teaching dimensions (0–100 each)
 *   2. Runs the weak student simulator to surface confusions
 *   3. Identifies specific critical issues (lessonCritic functionality)
 *   4. Returns a pass/fail verdict based on the PASS_THRESHOLD
 *
 * Combining these into one call keeps latency acceptable while giving the
 * reviewer full context to assess all dimensions together.
 */

import type { LessonResponse }  from "../../lib/lessonTypes";
import type { CriticalIssue }   from "./lessonCritic";
import type { DimensionScores } from "./qualityScoreEngine";
import { parseDimensionScores } from "./qualityScoreEngine";
import { PASS_THRESHOLD }       from "./teachingRubric";
import { WEAK_STUDENT_PERSONA } from "./weakStudentSimulator";

export interface ReviewReport {
  scores:         DimensionScores;
  confusions:     string[];          // weak-student confusions found
  criticalIssues: CriticalIssue[];   // specific actionable problems
  passed:         boolean;
  rubricLabel:    string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";
const MODEL          = "gpt-4o-mini";
const REVIEW_TIMEOUT = 25_000;

// ─── Review Prompt ────────────────────────────────────────────────────────────

const REVIEW_SYSTEM = `You are a ruthless Teaching Quality Inspector for CBSE/ICSE student lessons.

Your only job is to determine whether a lesson is good enough for a weak student — one who currently scores 20 out of 100.

You are NOT a teacher. You are NOT here to praise. You are here to find every gap.

══════════════════════════════════════════════════════════
SCORING INSTRUCTIONS — Score each dimension 0 to 100
══════════════════════════════════════════════════════════

vocabulary (0–100)
  100 = every unfamiliar word, symbol, and phrase is defined in plain language before it is used
   75 = most words defined; 1–2 symbols or terms left unexplained
   50 = multiple words assumed known; symbols used without definition
    0 = assumes vocabulary knowledge throughout

conceptTeaching (0–100)
  100 = every concept explained from scratch before use; zero assumed prior knowledge; formula chosen with full justification
   75 = most concepts explained; 1–2 assumptions
   50 = jumps to formulas without building understanding
    0 = formula used without any explanation

reasoning (0–100)
  100 = every single step has an explicit WHY; no logical jump anywhere; analogy used to build intuition
   75 = most steps justified; 1–2 hidden jumps
   50 = WHAT shown but WHY often missing
    0 = no reasoning given — just calculations

stepExplanation (0–100)
  100 = every algebra step on its own line; every arithmetic shown explicitly (e.g. 18+22=40)
   75 = most steps shown; 1–2 combined
   50 = some steps merged; student must fill gaps
    0 = steps skipped frequently

examples (0–100)
  100 = simpler worked example included with full solution; confusion predicted and answered proactively
   75 = example present but partial; confusions not fully addressed
   50 = example present but thin; confusions ignored
    0 = no example; no confusion prediction

memory (0–100)
  100 = crisp memory bullets; exam intent clearly explained
   75 = partial; missing some key takeaways
   50 = generic summary; misses the point
    0 = no memory aid

practice (0–100)
  100 = meaningful practice question; exactly 3 progressive hints that guide without solving; full solution
   75 = practice question present; hints weak
   50 = practice question present; hints solve the problem
    0 = no practice question

confidenceBuilding (0–100)
  100 = student feels genuinely capable, not patronised; language warm and specific
   75 = some encouragement but generic
   50 = minimal encouragement
    0 = cold or discouraging

weakStudentUnderstanding (0–100)
  THIS IS THE MOST IMPORTANT SCORE.
  After running the weak student simulation below:
  100 = zero confusions; student can independently solve a similar problem after one read
   75 = 1–2 minor confusions that don't block understanding
   50 = multiple confusions; student cannot solve independently
    0 = student cannot follow at all

══════════════════════════════════════════════════════════
${WEAK_STUDENT_PERSONA}
══════════════════════════════════════════════════════════

CRITICAL ISSUES
━━━━━━━━━━━━━━
For every problem you find, write an issue with:
  section:      name of the lesson section (e.g. "guidedReasoning", "vocabulary", "intuition")
  problem:      exactly what is wrong — be specific, quote the text if needed
  reason:       why this specific gap harms a 20/100 student
  suggestedFix: the exact replacement text or specific addition needed
  priority:     "critical" (blocks understanding) | "high" (major gap) | "medium" (improvement)

PASS THRESHOLD: ${PASS_THRESHOLD}
A lesson passes ONLY if ALL nine dimension scores are ${PASS_THRESHOLD} or above.
If even ONE score is below ${PASS_THRESHOLD}, set passed = false.

══════════════════════════════════════════════════════════
RESPONSE FORMAT — Return ONLY valid JSON. No other text.
══════════════════════════════════════════════════════════
{
  "scores": {
    "vocabulary":               number,
    "conceptTeaching":          number,
    "reasoning":                number,
    "stepExplanation":          number,
    "examples":                 number,
    "memory":                   number,
    "practice":                 number,
    "confidenceBuilding":       number,
    "weakStudentUnderstanding": number
  },
  "confusions": string[],
  "criticalIssues": [
    {
      "section":      string,
      "problem":      string,
      "reason":       string,
      "suggestedFix": string,
      "priority":     "critical" | "high" | "medium"
    }
  ],
  "passed": boolean
}`.trim();

// ─── OpenAI call ─────────────────────────────────────────────────────────────

export async function reviewLesson(
  lesson:  LessonResponse,
  apiKey:  string,
): Promise<ReviewReport> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), REVIEW_TIMEOUT);

  const lessonText = JSON.stringify(lesson, null, 2);

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
        temperature:     0.1,  // low temperature — we want consistent, precise scoring
        max_tokens:      3000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: REVIEW_SYSTEM },
          {
            role: "user",
            content: `Please review this lesson:\n\n${lessonText}`,
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`review_openai_${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body    = (await res.json()) as any;
  const content = body?.choices?.[0]?.message?.content ?? "{}";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = JSON.parse(content) as any;

  const scores  = parseDimensionScores(p?.scores ?? {});
  const passed  = scores.vocabulary               >= PASS_THRESHOLD &&
                  scores.conceptTeaching           >= PASS_THRESHOLD &&
                  scores.reasoning                 >= PASS_THRESHOLD &&
                  scores.stepExplanation           >= PASS_THRESHOLD &&
                  scores.examples                  >= PASS_THRESHOLD &&
                  scores.memory                    >= PASS_THRESHOLD &&
                  scores.practice                  >= PASS_THRESHOLD &&
                  scores.confidenceBuilding        >= PASS_THRESHOLD &&
                  scores.weakStudentUnderstanding  >= PASS_THRESHOLD;

  const confusions: string[] = Array.isArray(p?.confusions)
    ? p.confusions.filter((c: unknown) => typeof c === "string")
    : [];

  const criticalIssues: CriticalIssue[] = Array.isArray(p?.criticalIssues)
    ? p.criticalIssues
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((i: any) => i && typeof i.section === "string")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((i: any) => ({
          section:      String(i.section ?? ""),
          problem:      String(i.problem ?? ""),
          reason:       String(i.reason  ?? ""),
          suggestedFix: String(i.suggestedFix ?? ""),
          priority:     ["critical","high","medium"].includes(i.priority)
            ? i.priority as CriticalIssue["priority"]
            : "medium",
        }))
    : [];

  const { getRubricLabel } = await import("./teachingRubric");

  return {
    scores,
    confusions,
    criticalIssues,
    passed,
    rubricLabel: getRubricLabel(scores.overall),
  };
}
