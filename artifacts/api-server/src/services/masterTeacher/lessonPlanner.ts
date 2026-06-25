/**
 * Lesson Planner — The single OpenAI call that builds a TeachingBlueprint.
 *
 * Before a single word of the lesson is written, the planner analyses
 * the question and produces a complete teaching plan:
 *   - Every concept that must be understood, in dependency order
 *   - Every confusion a weak student will have, per concept
 *   - A real-life analogy for each abstract concept
 *   - A checkpoint question after each major concept
 *   - Pacing notes for high-load sections
 *   - Dialogue tips for the hardest explanations
 *
 * This blueprint is injected into the lesson generation prompt so the
 * AI writes with intention — following a plan — not improvising.
 */

import { CONFUSION_PREDICTOR_PROMPT } from "./confusionPredictor";
import { ANALOGY_RULES_PROMPT }       from "./analogySelector";
import { PACING_RULES_PROMPT }        from "./lessonPacingEngine";

// ─── Blueprint types ──────────────────────────────────────────────────────────

export interface ConceptBlueprint {
  concept:       string;                     // name of the concept (e.g. "rational number")
  cognitiveLoad: "low" | "medium" | "high";  // how hard this is for a weak student
  confusions:    string[];                   // 2–4 questions the weak student will ask here
  analogy:       string;                     // real-life analogy, or "" if none
  checkpoint:    string;                     // one tiny comprehension question
  teachingNote:  string;                     // how to introduce this concept conversationally
}

export interface TeachingBlueprint {
  conceptOrder:     ConceptBlueprint[];  // concepts in dependency order (teach in this sequence)
  teachingApproach: string;              // overall strategy for this specific question
  pacingNotes:      string[];            // where to slow down, where to split
  dialogueTips:     string[];            // specific conversational phrasing for hard parts
}

// ─── Constants ────────────────────────────────────────────────────────────────

const OPENAI_URL      = "https://api.openai.com/v1/chat/completions";
const MODEL           = "gpt-4o-mini";
const PLANNER_TIMEOUT = 20_000;

// ─── Planning prompt ──────────────────────────────────────────────────────────

const PLANNER_SYSTEM = `You are the Master Lesson Planner for CBSE/ICSE student lessons.

You are NOT writing the lesson yet.
You are PLANNING it.

Your student scores 20 out of 100. They have forgotten everything. They get anxious at formulas.

A master teacher never starts writing immediately.
A master teacher first asks:
  "What does this child need to understand — and in what order?"
  "Where will they get confused?"
  "What can I say that will make it click?"

Your job: build a complete teaching blueprint for this question.

STEP 1 — Identify every concept that must be understood to solve this problem.
STEP 2 — Order them by dependency: prerequisites first, derived concepts after.
STEP 3 — For each concept, predict every confusion a 20/100 student will have.
STEP 4 — For each abstract concept, find the best real-life analogy.
STEP 5 — Write one tiny checkpoint question that confirms understanding.
STEP 6 — Write a specific note on HOW to introduce this concept conversationally.
STEP 7 — Flag which concepts have high cognitive load and need extra pacing.

${CONFUSION_PREDICTOR_PROMPT}

${ANALOGY_RULES_PROMPT}

${PACING_RULES_PROMPT}

══════════════════════════════════════════════════════════
RESPONSE FORMAT — Return ONLY valid JSON. No other text.
══════════════════════════════════════════════════════════
{
  "conceptOrder": [
    {
      "concept": string,
      "cognitiveLoad": "low" | "medium" | "high",
      "confusions": string[],
      "analogy": string,
      "checkpoint": string,
      "teachingNote": string
    }
  ],
  "teachingApproach": string,
  "pacingNotes": string[],
  "dialogueTips": string[]
}

Rules:
- conceptOrder must be in dependency order (A before B if B requires A)
- Every concept that appears in the solution must be in conceptOrder
- confusions must be questions a 20/100 student genuinely asks — be specific
- analogy must be real-life, not mathematical — or empty string if none fits
- checkpoint must be answerable in 1–5 words or one simple calculation
- teachingNote must be conversational: "Start by asking...", "Say something like..."
- pacingNotes: flag every concept with cognitiveLoad "high" for slow treatment
- dialogueTips: specific phrases that work for this question's hardest moments`.trim();

// ─── OpenAI call ─────────────────────────────────────────────────────────────

export async function callPlannerOpenAI(
  subject:  string,
  question: string,
  apiKey:   string,
): Promise<TeachingBlueprint> {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), PLANNER_TIMEOUT);

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
        temperature:     0.2,   // low temperature — we want consistent, precise planning
        max_tokens:      2000,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: PLANNER_SYSTEM },
          {
            role: "user",
            content: `Subject: ${subject}\n\nQuestion to teach:\n${question.trim()}`,
          },
        ],
      }),
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) throw new Error(`planner_openai_${res.status}`);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const body    = (await res.json()) as any;
  const content = body?.choices?.[0]?.message?.content ?? "{}";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const p = JSON.parse(content) as any;

  // Parse and validate concept order
  const conceptOrder: ConceptBlueprint[] = Array.isArray(p?.conceptOrder)
    ? p.conceptOrder
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((c: any) => c && typeof c.concept === "string")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((c: any): ConceptBlueprint => ({
          concept:       String(c.concept ?? "").trim(),
          cognitiveLoad: ["low","medium","high"].includes(c.cognitiveLoad)
            ? c.cognitiveLoad
            : "medium",
          confusions:    Array.isArray(c.confusions)
            ? c.confusions.filter((x: unknown) => typeof x === "string")
            : [],
          analogy:       typeof c.analogy === "string" ? c.analogy.trim() : "",
          checkpoint:    typeof c.checkpoint === "string" ? c.checkpoint.trim() : "",
          teachingNote:  typeof c.teachingNote === "string" ? c.teachingNote.trim() : "",
        }))
    : [];

  return {
    conceptOrder,
    teachingApproach: typeof p?.teachingApproach === "string"
      ? p.teachingApproach.trim()
      : "",
    pacingNotes: Array.isArray(p?.pacingNotes)
      ? p.pacingNotes.filter((x: unknown) => typeof x === "string")
      : [],
    dialogueTips: Array.isArray(p?.dialogueTips)
      ? p.dialogueTips.filter((x: unknown) => typeof x === "string")
      : [],
  };
}
