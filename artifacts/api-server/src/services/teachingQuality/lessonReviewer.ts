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
import type {
  CriticalIssue,
  FindingType,
  ReviewEvidence,
  StudentLessonMode,
} from "./lessonCritic";
import type { DimensionScores } from "./qualityScoreEngine";
import { parseDimensionScores } from "./qualityScoreEngine";
import { PASS_THRESHOLD }       from "./teachingRubric";
import { WEAK_STUDENT_PERSONA } from "./weakStudentSimulator";
import { retryFetch }            from "../../lib/retryFetch";
import { extractUsage, type UsageSnapshot } from "../../lib/aiCost";

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
const REVIEW_TIMEOUT = 55_000;

export interface StudentVisibleReviewSection {
  section: string;
  content: Record<string, unknown>;
}

export type StudentVisibleReviewViews = Record<StudentLessonMode, StudentVisibleReviewSection[]>;

const MODE_SECTION_ORDER: Record<StudentLessonMode, string[]> = {
  Detailed: [
    "Key Concept",
    "Build Intuition",
    "Understand the Question",
    "Step-by-Step Solution",
    "Common Mistakes",
    "Final Answer",
    "One Similar Example",
    "Practice Question",
    "Remember This",
  ],
  Standard: [
    "Key Concept",
    "Understand the Question",
    "Step-by-Step Solution",
    "Final Answer",
    "Practice Question",
  ],
  Compact: [
    "Step-by-Step Solution",
    "Final Answer",
    "Remember This",
  ],
};

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function textLeaves(value: unknown): string[] {
  if (typeof value === "string") return hasText(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(textLeaves);
  if (value && typeof value === "object") {
    return Object.values(value).flatMap(textLeaves);
  }
  return [];
}

/**
 * Mirrors LessonRenderer's student-visible section order and mode visibility.
 * Keep this aligned with artifacts/homework-hero/src/components/teaching/TeachingLayout.tsx.
 */
export function buildStudentVisibleReviewViews(
  lesson: LessonResponse,
): StudentVisibleReviewViews {
  const keyConcepts = lesson.keyConcepts.filter(hasText);
  const vocabulary = keyConcepts.length > 0
    ? lesson.vocabulary.filter((item) => hasText(item.term) && hasText(item.meaning))
    : [];
  const intuitionContent = {
    story: lesson.intuition.story,
    visual: lesson.intuition.visual,
    everyday: lesson.intuition.everyday,
  };
  const translationContent = Object.fromEntries(
    Object.entries(lesson.questionTranslation).filter(([, value]) => hasText(value)),
  );
  const prerequisites = lesson.prerequisites.filter(hasText);
  const guidedReasoning = lesson.guidedReasoning.filter((step) =>
    [step.what, step.why, step.math, step.result, step.pause].some(hasText),
  );
  const mistakeContent = lesson.commonMistakes
    .filter((mistake) => hasText(mistake.mistake))
    .map((mistake) => ({
      mistake: mistake.mistake,
      whyItHappens: mistake.whyItHappens,
      howToAvoid: mistake.howToAvoid,
    }));
  const similarContent = lesson.simplerExample;
  const hasSimilarExample = hasText(similarContent.problem) && hasText(similarContent.solution);
  const practiceContent = lesson.practiceQuestion;
  const rememberContent = lesson.rememberThese.filter(hasText);

  const detailed: StudentVisibleReviewSection[] = [];
  const standard: StudentVisibleReviewSection[] = [];
  const compact: StudentVisibleReviewSection[] = [];
  const add = (
    targets: StudentVisibleReviewSection[][],
    section: string,
    content: Record<string, unknown>,
  ) => {
    const entry = { section, content };
    for (const target of targets) target.push(entry);
  };

  if (keyConcepts.length > 0) {
    const content = { keyConcepts, vocabulary };
    add([detailed, standard], "Key Concept", content);
  }
  if ([intuitionContent.story, intuitionContent.visual, intuitionContent.everyday].some(hasText)) {
    add([detailed], "Build Intuition", intuitionContent);
  }
  if (Object.keys(translationContent).length > 0) {
    add([detailed, standard], "Understand the Question", translationContent);
  }
  if (guidedReasoning.length > 0) {
    const content = { prerequisites, guidedReasoning };
    add([detailed, standard, compact], "Step-by-Step Solution", content);
  }
  if (mistakeContent.length > 0) {
    add([detailed], "Common Mistakes", { commonMistakes: mistakeContent });
  }
  if (hasText(lesson.finalAnswer.answer)) {
    add([detailed, standard], "Final Answer", {
      answer: lesson.finalAnswer.answer,
      whyCorrect: lesson.finalAnswer.whyCorrect,
    });
    add([compact], "Final Answer", { answer: lesson.finalAnswer.answer });
  }
  if (hasSimilarExample) {
    add([detailed], "One Similar Example", {
      problem: similarContent.problem,
      solution: similarContent.solution,
    });
  }
  if (hasText(practiceContent.question)) {
    const content = {
      question: practiceContent.question,
      hints: practiceContent.hints.filter(hasText),
      solution: practiceContent.solution,
    };
    add([detailed, standard], "Practice Question", content);
  }
  if (rememberContent.length > 0) {
    add([detailed, compact], "Remember This", { rememberThese: rememberContent });
  }

  return { Detailed: detailed, Standard: standard, Compact: compact };
}

function isFindingType(value: unknown): value is FindingType {
  return value === "missing" || value === "late" || value === "unclear" || value === "incorrect";
}

function isStudentLessonMode(value: unknown): value is StudentLessonMode {
  return value === "Detailed" || value === "Standard" || value === "Compact";
}

/**
 * Enforces traceable reviewer output. A non-missing finding must quote visible text;
 * a missing finding must document a complete scan of the selected mode.
 */
export function validateCriticalIssueEvidence(
  raw: unknown,
  views: StudentVisibleReviewViews,
): CriticalIssue {
  if (!raw || typeof raw !== "object") throw new Error("review_issue_not_object");
  const item = raw as Record<string, unknown>;
  if (!isStudentLessonMode(item.mode)) throw new Error("review_issue_invalid_mode");
  if (!isFindingType(item.findingType)) throw new Error("review_issue_invalid_finding_type");

  const mode = item.mode;
  const actualSections = views[mode].map((section) => section.section);
  const allowedSections = MODE_SECTION_ORDER[mode];
  const section = typeof item.section === "string" ? item.section.trim() : "";
  if (!section || !allowedSections.includes(section)) throw new Error("review_issue_invalid_section");

  if (!Array.isArray(item.reviewedSections) ||
      JSON.stringify(item.reviewedSections) !== JSON.stringify(actualSections)) {
    throw new Error("review_issue_incomplete_section_audit");
  }

  const evidence: ReviewEvidence[] = Array.isArray(item.evidence)
    ? item.evidence.map((entry) => {
        if (!entry || typeof entry !== "object") throw new Error("review_issue_invalid_evidence");
        const candidate = entry as Record<string, unknown>;
        const evidenceSection = typeof candidate.section === "string" ? candidate.section : "";
        const quote = typeof candidate.quote === "string" ? candidate.quote : "";
        const displayed = views[mode].find((visible) => visible.section === evidenceSection);
        if (!displayed || !hasText(quote) ||
            !textLeaves(displayed.content).some((text) => text.includes(quote))) {
          throw new Error("review_issue_evidence_not_in_student_view");
        }
        return { section: evidenceSection, quote };
      })
    : [];

  if (item.findingType === "missing" && evidence.length > 0) {
    throw new Error("review_issue_missing_has_present_evidence");
  }
  if (item.findingType !== "missing" && evidence.length === 0) {
    throw new Error("review_issue_requires_visible_evidence");
  }
  if (item.findingType === "late") {
    const targetIndex = allowedSections.indexOf(section);
    if (!evidence.some((entry) => allowedSections.indexOf(entry.section) > targetIndex)) {
      throw new Error("review_issue_late_evidence_not_later");
    }
  }

  const priority = ["critical", "high", "medium"].includes(String(item.priority))
    ? item.priority as CriticalIssue["priority"]
    : "critical";

  return {
    section,
    findingType: item.findingType,
    mode,
    evidence,
    reviewedSections: actualSections,
    problem: String(item.problem ?? ""),
    reason: String(item.reason ?? ""),
    suggestedFix: String(item.suggestedFix ?? ""),
    priority,
  };
}

// ─── Review Prompt ────────────────────────────────────────────────────────────

const REVIEW_SYSTEM = `You are a rigorous Teaching Quality Inspector for SnapSolve student lessons across supported curricula, classes, and subjects.

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

STUDENT-VISIBLE LESSON ORDER AND EVIDENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The user message contains only the actual content rendered by TeachingLayout, grouped in
the exact student-visible order for Detailed, Standard, and Compact modes. The original
16-section TeachingLesson object and all app modes are unchanged.

Detailed order: Key Concept → Build Intuition → Understand the Question →
Step-by-Step Solution → Common Mistakes → Final Answer → One Similar Example →
Practice Question → Remember This.
Standard order: Key Concept → Understand the Question → Step-by-Step Solution →
Final Answer → Practice Question.
Compact order: Step-by-Step Solution → Final Answer → Remember This.
Some sections are omitted when their source fields have no usable text. Standard and
Compact intentionally hide sections; do not mark an intentionally hidden section missing.

Assess the visible sequence, not raw schema field order. Before calling teaching missing,
scan every rendered section in that mode and check whether equivalent instruction appears
earlier, within the expected section, or later. A term or keyword by itself is NOT adequate
teaching: judge whether the explanation is accurate, clear, and sufficient for a weak student.
Use:
- missing: no adequate explanation exists anywhere in that mode's visible sequence;
- late: adequate explanation exists, but only after the student needs it; cite the later
  section and identify the earlier section where it was needed;
- unclear: relevant text is visible but materially ambiguous, incomplete, or unexplained;
- incorrect: visible text is materially inaccurate or misleading.
Do not label visible-but-late, unclear, or incorrect teaching as missing. Do not treat
text in fields absent from these rendered views as student-facing evidence.

CONCEPT MASTERY COMPLIANCE CHECK
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before writing criticalIssues, check the lesson against every item below and the complete
student-visible sequence for the relevant mode.
Record each failed item as an issue, using the severity calibration below. A checklist
failure is not automatically critical or high when the lesson remains correct and understandable.

QUANTITATIVE AND MODEL ACCURACY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ Keep units attached to numerical values through substitution; explain unit cancellation and the meaning of a unitless result.
□ Explain why the selected method and formula fit the given question before applying them.
□ Give a reusable method so the student can solve a similar question independently.
□ Where relevant, identify a genuine exam trap and check that the lesson explains how to avoid it; do not require artificial traps.
□ Use analogies only when they accurately match the concept; do not imply an unspecified device or mechanism is part of the question.
□ State assumptions such as ideal or frictionless before using them, and distinguish model results from real-world friction or losses.
□ For MCQs, explain why distractors fail without announcing the correct option before finalAnswer.

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
For every problem found, write an issue with:
  section:      exact student-visible section where teaching is missing or needs improvement
  findingType:  "missing" | "late" | "unclear" | "incorrect"
  mode:         "Detailed" | "Standard" | "Compact"
  evidence:     [{ "section": exact visible section name, "quote": exact text copied from it }]
                Required for late/unclear/incorrect; use [] for missing.
  reviewedSections: the complete rendered section names for that mode, in their displayed order;
                include every rendered section to support a missing claim.
  problem:      exactly what is wrong — be specific, quote the lesson text if possible
  reason:       why this specific gap harms a 20/100 student
  suggestedFix: the exact replacement text or the specific addition needed to fix it
  priority:     "critical" (blocks understanding) | "high" (major gap) | "medium" (improvement)

Every non-missing issue must have at least one verbatim, section-specific quote from the
student-visible view. A missing issue must have no evidence quote and must list all rendered
sections in that mode in reviewedSections. For late, quote where the explanation appears
later and set section to where the student needed it. Never infer adequacy from keyword
presence alone. Keep the existing severity standards; these evidence requirements do not
lower the bar for materially incorrect, misleading, or comprehension-blocking teaching.

SEVERITY CALIBRATION
━━━━━━━━━━━━━━━━━━━
Use "critical" or "high" ONLY when the lesson is materially incorrect, misleading,
contradicts the approved answer or curriculum, omits a necessary concept or reasoning
step, or is so confusing that a weak student is unlikely to understand or solve a
similar problem. These priorities block saving.

Use "medium" for a correct and understandable lesson with a noncritical teaching
weakness, such as an example that could be clearer, an optional connection that is
missing, or a small vocabulary/scaffolding improvement. These issues should become
improvement flags, not a block. Do not promote a checklist imperfection to high/critical
unless it causes material misunderstanding. A listed suggestion is not automatically
a blocker.

PASS THRESHOLD: ${PASS_THRESHOLD}
A lesson passes ONLY if ALL nine dimension scores are ${PASS_THRESHOLD} or above.
If even ONE score is below ${PASS_THRESHOLD}, set passed = false. Scores below that
threshold may still be classified by the separate deterministic delivery policy; do
not inflate scores or mislabel a medium issue to force a pass.

══════════════════════════════════════════════════════════
RESPONSE FORMAT — Return ONLY valid JSON. No other text.
Keep confusions concise. Keep each critical issue actionable and concise:
do not repeat full lesson sections inside problem, reason, or suggestedFix.
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
      "section": string,
      "findingType": "missing" | "late" | "unclear" | "incorrect",
      "mode": "Detailed" | "Standard" | "Compact",
      "evidence": [{"section": string, "quote": string}],
      "reviewedSections": string[],
      "problem": string,
      "reason": string,
      "suggestedFix": string,
      "priority": "critical" | "high" | "medium"
    }
  ],
  "passed": boolean
}`.trim();

// ─── OpenAI call ─────────────────────────────────────────────────────────────

export async function reviewLesson(
  lesson:  LessonResponse,
  apiKey:  string,
): Promise<{ report: ReviewReport; usage: UsageSnapshot; latencyMs: number }> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), REVIEW_TIMEOUT);
  const callStart  = Date.now();

  const studentVisibleModes = buildStudentVisibleReviewViews(lesson);
  // Review the rendered evidence in display order. Hidden schema fields remain untouched
  // on LessonResponse but cannot be cited as teaching the student.
  const lessonText = JSON.stringify({
    topic: lesson.topic,
    difficulty: lesson.difficulty,
    studentVisibleModes,
  });

  let res: Response;
  try {
    res = await retryFetch(OPENAI_URL, {
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
    }, "review");
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`review_openai_${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body    = (await res.json()) as any;
  const usage   = extractUsage(body, MODEL);
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
    ? p.criticalIssues.map((issue: unknown) =>
        validateCriticalIssueEvidence(issue, studentVisibleModes),
      )
    : [];

  const { getRubricLabel } = await import("./teachingRubric");

  return {
    report: {
      scores,
      confusions,
      criticalIssues,
      passed,
      rubricLabel: getRubricLabel(scores.overall),
    },
    usage,
    latencyMs: Date.now() - callStart,
  };
}
