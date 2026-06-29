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

const REVIEW_SYSTEM = `You are a ruthless Teaching Quality Inspector for CBSE/ICSE student lessons (Classes 6–9).

Your only job is to determine whether a lesson is good enough for a weak student — one who currently scores 20 out of 100.

You are NOT a teacher. You are NOT here to praise. You are here to find every gap.

The lesson was generated against two permanent frameworks:
  (A) Teaching Standards — vocabulary control, scaffolding, dialogue, micro-teaching
  (B) Concept Mastery Framework — 15 rules including WHY before WHAT, intuition before formalism,
      no skipped steps, formula derivation, misconceptions named, real-life connections,
      three-route explanations for difficult concepts, and the Younger Sibling Test.

Your scores must reflect compliance with BOTH frameworks. A lesson that violates any rule
from either framework cannot score above 75 in the relevant dimension.

══════════════════════════════════════════════════════════
SCORING INSTRUCTIONS — Score each dimension 0 to 100
══════════════════════════════════════════════════════════

vocabulary (0–100)
  100 = every unfamiliar word, symbol, notation, and unit defined in plain language the moment it first appears;
        no term is ever used before it is introduced; student never has to guess what a symbol means
   75 = most terms defined; 1–2 symbols or words left unexplained
   50 = multiple terms assumed known; symbols used without definition
    0 = vocabulary assumed throughout

  DEDUCT TO 50 OR BELOW if:
  □ Any symbol appears without being defined
  □ Any subject-specific term is introduced without a plain-English explanation
  □ The word "obviously", "clearly", or "it follows that" appears anywhere

conceptTeaching (0–100)
  100 = every concept opens with WHY it had to exist (the problem it solves) before naming it;
        intuition is fully built before any formal definition or formula is stated;
        every formula is derived or its origin explained — never simply stated;
        every theorem has its WHY explained, not just its HOW;
        every scientific law is introduced with physical intuition before its equation;
        zero assumed prior knowledge; zero jumps to formalism without preparation
   75 = most concepts explained from WHY; 1–2 concepts start with definition instead of purpose;
        most formulas justified; 1–2 stated without derivation
   50 = concepts often start with definition; formulas stated without explanation of why they work
    0 = textbook definitions used throughout; formulas stated with no justification

  DEDUCT TO 50 OR BELOW if ANY of these are present:
  □ A concept is introduced with its textbook definition before WHY it exists
  □ A formula is used without explaining why it works or where it comes from
  □ A theorem is stated and applied without explaining why it is true
  □ A scientific law is stated as an equation without first building physical or intuitive understanding
  □ Intuition is absent — the lesson goes straight to formal notation
  □ The lesson reads like a textbook chapter rather than a conversation with a teacher

reasoning (0–100)
  100 = every step has an explicit WHY; no logical jump anywhere in the lesson;
        misconceptions that students typically have at this concept are named and resolved
        before the student reaches them; the next question a student would ask is answered
        before they can ask it; analogies used to build intuition at every abstract step;
        no use of "obviously", "clearly", "it follows that", or any implicit skip
   75 = most steps justified; 1–2 hidden jumps; some but not all misconceptions addressed
   50 = WHAT is shown but WHY is frequently absent; confusions ignored
    0 = no reasoning — only calculations or statements

  DEDUCT TO 50 OR BELOW if ANY of these are present:
  □ A step is taken without explaining why it is valid
  □ Common student misconceptions for this topic are not named and pre-empted
  □ The lesson does not answer the next likely student question before they ask it
  □ "Obviously", "clearly", or any implicit skip appears in the lesson
  □ An analogy or intuitive model is absent for an abstract concept

stepExplanation (0–100)
  100 = every algebraic transformation on its own line with narration;
        every arithmetic calculation written out in full (e.g. 6 × 7 = 42 written, not assumed);
        every sign change explained ("we subtract 3 from both sides because...");
        every cancellation justified ("we can divide by 4 here because 4 ≠ 0");
        every substitution shown explicitly (formula written, then values substituted, then computed);
        no two operations are combined into one unexplained line
   75 = most steps shown; 1–2 steps merged without explanation
   50 = some steps combined; student must fill gaps to follow
    0 = steps skipped frequently; student cannot follow the algebra

  DEDUCT TO 50 OR BELOW if ANY of these are present:
  □ Any arithmetic computation is skipped rather than written out
  □ Any algebraic step is combined with another without narration
  □ A sign change occurs without explanation
  □ A cancellation occurs without justification
  □ A substitution is not shown explicitly step by step

examples (0–100)
  100 = lesson contains at least one fully worked simpler example using small friendly numbers;
        for every difficult or abstract concept, three distinct explanations are given:
        (1) visual — a described picture, diagram, or graph,
        (2) logical — a first-principles argument,
        (3) real-life — a relatable everyday situation;
        student confusions are predicted and resolved before they arise;
        real-world connections made for every major concept
   75 = examples present; some confusions addressed; real-life connections present but thin;
        difficult concepts have 2 of the 3 explanation types
   50 = example present but shallow; confusions ignored; real-life connections absent or vague
    0 = no example; no confusion prediction; no real-world connection

  DEDUCT TO 50 OR BELOW if ANY of these are present:
  □ A difficult or abstract concept lacks at least two of the three explanation types
    (visual / logical / real-life)
  □ No real-world connection is made for any concept in the lesson
  □ Student confusions are not predicted and pre-empted

memory (0–100)
  100 = memory section contains crisp, precise bullets capturing the key ideas
        (not the calculation steps, but the understanding and insight);
        exam technique and examiner expectations explicitly noted;
        student knows what to remember and WHY it matters, not just WHAT to memorise
   75 = memory bullets present; exam intent noted; some takeaways missing
   50 = generic summary; misses the core insight; no exam technique guidance
    0 = no memory section or no useful content

practice (0–100)
  100 = practice question tests genuine understanding, not just formula recall;
        exactly 3 hints provided that are strictly progressive — each hint gets closer
        without solving the problem; hints reveal thinking, not answers;
        full worked solution provided after hints; question cannot be answered by
        plugging into a formula without understanding
   75 = practice question present; hints present but not strictly progressive
   50 = hints give away too much; question is trivial formula-plug-in
    0 = no practice question

  DEDUCT TO 75 OR BELOW if:
  □ Hints solve the problem rather than guiding towards the solution
  □ The practice question can be answered correctly by a student who only memorised the formula
    without understanding (retrieval must require understanding, not recall)

confidenceBuilding (0–100)
  100 = student finishes the lesson feeling genuinely capable and specific about what they can now do;
        language is warm, encouraging, and precise — not generic;
        the "I can now..." statement names the specific skill, not just the topic;
        no condescension; no phrases like "this is easy" or "don't worry, it's simple"
   75 = some encouragement present; language warm but generic
   50 = minimal encouragement; closing is abrupt or mechanical
    0 = cold, discouraging, or absent

  DEDUCT TO 50 OR BELOW if:
  □ The closing says "this is easy" or trivialises the concept
  □ The "I can now..." statement is vague (e.g. "I can now do maths") rather than specific
  □ The lesson ends without the student knowing what they have genuinely achieved

weakStudentUnderstanding (0–100)
  THIS IS THE MOST IMPORTANT SCORE.
  After running the weak student simulation below, and after applying the Younger Sibling Test:

  THE YOUNGER SIBLING TEST: Could this student, having read the lesson once, explain
  this concept clearly to a younger sibling who has never seen it?
  If the answer is NO — this score cannot exceed 60.

  100 = zero confusions; student can independently solve a similar problem after one read;
        passes the Younger Sibling Test; lesson feels like a great teacher talking, not a textbook
   75 = 1–2 minor confusions that don't block understanding; mostly passes the Younger Sibling Test
   50 = multiple confusions; student cannot solve independently; fails the Younger Sibling Test
    0 = student cannot follow at all

  DEDUCT TO 50 OR BELOW if:
  □ The lesson reads like a textbook — formal, impersonal, definition-first
  □ A student who only memorised the formula (without understanding) could complete the lesson
  □ The Younger Sibling Test fails for any major concept

══════════════════════════════════════════════════════════
${WEAK_STUDENT_PERSONA}
══════════════════════════════════════════════════════════

CONCEPT MASTERY COMPLIANCE CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before writing criticalIssues, check the lesson against every item below.
Any item that FAILS must appear as a criticalIssue with priority "critical" or "high".

□ CMF-1  WHY before WHAT: Does every concept open with WHY it exists before naming or defining it?
□ CMF-2  Problem first: Is the historical or practical problem the concept solves stated?
□ CMF-3  Intuition before formalism: Is intuition fully built before formal definition or notation appears?
□ CMF-4  Six questions answered: Is WHAT / WHY / HOW / WHEN / WHERE / WHY NOT covered for key concepts?
□ CMF-5  Confusions pre-empted: Are typical student misconceptions named and resolved before the student reaches them?
□ CMF-6  Next question answered: Does the lesson answer the next likely question before it is asked?
□ CMF-7  No skipped steps: Are "obviously", "clearly", "it follows that" absent? Is every step narrated?
□ CMF-8  Formula derivation: Is every formula's origin explained before it is used?
□ CMF-9  Theorem WHY: Is every theorem's truth explained (not just its application)?
□ CMF-10 Law intuition: Is physical/intuitive understanding built before any scientific law's equation?
□ CMF-11 Biology story: (Biology only) Is every process taught as a flowing cause-and-effect story?
□ CMF-12 CS algorithm-first: (CS only) Is the algorithm explained in plain English before any code?
□ CMF-13 Economics everyday-first: (Economics only) Is every concept introduced through a real situation before terminology?
□ CMF-14 Three explanations: For any difficult concept — are visual, logical, AND real-life explanations all present?
□ CMF-15 Younger Sibling Test: Could the student explain this to a younger sibling after one read?

CRITICAL ISSUES
━━━━━━━━━━━━━━
For every problem found — including every failed CMF check above — write an issue with:
  section:      name of the lesson section (e.g. "guidedReasoning", "intuition", "conceptIntro")
  problem:      exactly what is wrong — be specific, quote the lesson text if possible
  reason:       why this specific gap harms a 20/100 student
  suggestedFix: the exact replacement text or the specific addition needed to fix it
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
