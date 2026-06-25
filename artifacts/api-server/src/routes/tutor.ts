/**
 * POST /api/tutor
 *
 * Socratic Tutor AI backend.
 * All OpenAI calls stay server-side — key never exposed to browser.
 *
 * Actions:
 *  generateQuestion  — conceptual question for topic at given mastery level
 *  assessAnswer      — classify and respond to a student's answer
 *  generateHint      — next hint level (1–5) for a topic/question
 *  generateReflection — end-of-session summary
 */

import { Router } from "express";

const router = Router();

// ── Rate limiting (shared 30 req/hr for tutor — more lenient, shorter sessions) ──

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT     = 30;
interface RateEntry { count: number; resetAt: number; }
const rateLimitStore = new Map<string, RateEntry>();
function checkRate(ip: string): boolean {
  const now = Date.now();
  const e   = rateLimitStore.get(ip);
  if (!e || now >= e.resetAt) { rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS }); return true; }
  if (e.count >= RATE_LIMIT) return false;
  e.count++; return true;
}

// ── Types ──────────────────────────────────────────────────────────────────────

type TutorAction = "generateQuestion" | "assessAnswer" | "generateHint" | "generateReflection";

interface TutorRequest {
  action:       TutorAction;
  subject:      string;
  topic:        string;
  masteryScore: number;         // 0–100
  question?:    string;         // for assessAnswer / generateHint
  studentAnswer?: string;       // for assessAnswer
  hintLevel?:   number;         // 1–5, for generateHint
  sessionSummary?: {            // for generateReflection
    questionsAnswered: number;
    correctAnswers:    number;
    hintsUsed:         number;
    misconceptionsFixed: number;
    topicsCovered:     string[];
  };
  studentContext?: string;      // from studentModel.buildRichStudentContext()
}

interface TutorResponse {
  action:        TutorAction;
  content:       string;        // the tutor's response text
  classification?: string;      // for assessAnswer: correct/partial/misconception/guess/no_response
  misconception?: string;       // for assessAnswer: identified misconception
  isCorrect?:    boolean;
  masteryDelta?: number;        // estimated mastery change (+/-)
}

// ── Question templates (fallback when OpenAI is unavailable) ──────────────────

const QUESTION_TEMPLATES: Record<string, string[]> = {
  low: [
    "In your own words, what does {topic} mean?",
    "What is the key idea behind {topic}?",
    "Can you explain what {topic} is trying to achieve?",
  ],
  mid: [
    "How would you apply the concept of {topic} to a new problem?",
    "What is the first step you would take when solving a {topic} question?",
    "Why is {topic} useful? Give an example from daily life.",
  ],
  high: [
    "Why does the method we use for {topic} work? What assumption does it depend on?",
    "What would happen if one of the conditions in {topic} changed?",
    "What mistake do students most commonly make with {topic}, and how would you avoid it?",
  ],
  challenge: [
    "Can you create your own example problem that uses {topic}?",
    "Compare {topic} with a related concept — when would you use one over the other?",
    "Explain {topic} as if you were teaching it to a younger student.",
  ],
};

function fallbackQuestion(topic: string, mastery: number): string {
  let bank: string[];
  if (mastery < 40)       bank = QUESTION_TEMPLATES.low;
  else if (mastery < 70)  bank = QUESTION_TEMPLATES.mid;
  else if (mastery < 90)  bank = QUESTION_TEMPLATES.high;
  else                    bank = QUESTION_TEMPLATES.challenge;
  const t = bank[Math.floor(Math.random() * bank.length)];
  return t.replace(/{topic}/g, topic);
}

// ── OpenAI call helper ────────────────────────────────────────────────────────

async function callOpenAI(systemPrompt: string, userContent: string, maxTokens = 300): Promise<string | null> {
  const key = process.env["OPENAI_API_KEY"];
  if (!key) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: maxTokens,
        temperature: 0.7,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userContent },
        ],
      }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const json = await res.json() as { choices?: Array<{ message?: { content?: string } }> };
    return json.choices?.[0]?.message?.content?.trim() ?? null;
  } catch {
    clearTimeout(timer);
    return null;
  }
}

// ── Action handlers ───────────────────────────────────────────────────────────

async function handleGenerateQuestion(req: TutorRequest): Promise<TutorResponse> {
  const { topic, subject, masteryScore, studentContext } = req;

  let level: string;
  if (masteryScore < 40)       level = "Remember / Understand — very simple conceptual questions about definitions and basic ideas";
  else if (masteryScore < 70)  level = "Apply — basic application questions: solve a simple problem or explain how to use the concept";
  else if (masteryScore < 90)  level = "Analyse — mixed questions: WHY does this work? What would change if...?";
  else                         level = "Evaluate / Create — challenge questions: design a problem, compare approaches, teach back";

  const systemPrompt = `You are an expert ${subject} tutor following the Socratic method.
Your job is to ask ONE conceptual question that tests deep understanding, not memory.
NEVER ask "What is the answer to X?" — ask WHY, HOW, WHAT HAPPENS IF, EXPLAIN THIS AS IF.
The question must be single, clear, and answerable in 1–3 sentences.
Bloom's level required: ${level}.
Do not number the question. Do not add preamble. Return ONLY the question itself.
${studentContext ? `Student context:\n${studentContext}` : ""}`;

  const userContent = `Generate one Socratic question about "${topic}" in ${subject} at mastery level ${masteryScore}/100.`;

  const ai = await callOpenAI(systemPrompt, userContent, 120);
  return {
    action: "generateQuestion",
    content: ai ?? fallbackQuestion(topic, masteryScore),
  };
}

async function handleAssessAnswer(req: TutorRequest): Promise<TutorResponse> {
  const { topic, subject, question = "", studentAnswer = "", masteryScore } = req;

  if (!studentAnswer.trim()) {
    return {
      action: "assessAnswer",
      classification: "no_response",
      isCorrect: false,
      masteryDelta: 0,
      content: "Take your time — there's no rush. What's the first thing that comes to mind about this?",
    };
  }

  const systemPrompt = `You are an expert ${subject} tutor assessing a student's answer using the Socratic method.
Analyse the student's response and return a JSON object with these exact keys:
{
  "classification": "correct" | "partial" | "misconception" | "guess" | "copied",
  "isCorrect": true | false,
  "misconception": "exact description of the misconception, or null",
  "masteryDelta": number between -5 and +15,
  "response": "your tutor response (2-4 sentences). If correct: praise + ask a harder follow-up or confirm mastery. If partial: acknowledge what's right, scaffold toward the gap. If misconception: DO NOT reveal the answer — identify the specific misunderstanding and guide with a question. If guess: ask them to explain their reasoning."
}
Return ONLY valid JSON. No markdown fences.`;

  const userContent = `Topic: ${topic} (${subject}), mastery score: ${masteryScore}/100.
Question asked: "${question}"
Student's answer: "${studentAnswer}"`;

  const raw = await callOpenAI(systemPrompt, userContent, 280);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as {
        classification: string;
        isCorrect: boolean;
        misconception: string | null;
        masteryDelta: number;
        response: string;
      };
      return {
        action: "assessAnswer",
        content: parsed.response,
        classification: parsed.classification,
        misconception: parsed.misconception ?? undefined,
        isCorrect: parsed.isCorrect,
        masteryDelta: Math.max(-10, Math.min(20, parsed.masteryDelta)),
      };
    } catch { /* fall through to fallback */ }
  }

  // Fallback: simple keyword heuristic
  const answer = studentAnswer.toLowerCase();
  const isLong = answer.split(" ").length >= 5;
  const classification = isLong ? "partial" : "guess";
  return {
    action: "assessAnswer",
    classification,
    isCorrect: false,
    masteryDelta: 0,
    content: "Interesting! Can you expand on that and explain the reasoning behind it?",
  };
}

async function handleGenerateHint(req: TutorRequest): Promise<TutorResponse> {
  const { topic, subject, question = "", hintLevel = 1 } = req;

  const hintDescriptions: Record<number, string> = {
    1: "A very small clue — just nudge their thinking without giving anything away",
    2: "Direct their attention to a specific aspect of the problem",
    3: "Show the next logical step without solving it",
    4: "Reveal the key reasoning, stop just before the final answer",
    5: "Fully explain the solution — this is the final reveal",
  };

  const systemPrompt = `You are an expert ${subject} tutor giving a hint.
Hint level ${hintLevel}/5: ${hintDescriptions[hintLevel] ?? hintDescriptions[1]}.
Keep the hint focused on "${topic}".
Start hint level 1-2 with "Think about..." or "Consider...". 
Start hint level 3-4 with "Here's a key step:..." or "Notice that...".
Start hint level 5 with "Let me walk you through this:".
Return ONLY the hint text. No preamble.`;

  const userContent = `Give hint level ${hintLevel} for: "${question}" (topic: ${topic}, ${subject})`;

  const ai = await callOpenAI(systemPrompt, userContent, 150);

  const fallbacks: Record<number, string> = {
    1: `Think carefully about the core definition of ${topic}. What does it really mean?`,
    2: `Consider what information the question is giving you. Which formula or rule connects these pieces?`,
    3: `Here's a key step: identify what type of problem this is first, then recall the standard approach for ${topic}.`,
    4: `Notice that this problem directly applies the main rule in ${topic}. Start by writing down what you know, then apply the rule step by step.`,
    5: `Let me walk you through this: the answer follows directly from applying the core formula/rule of ${topic} to the given values. Work from first principles: state the rule, substitute the values, simplify.`,
  };

  return {
    action: "generateHint",
    content: ai ?? fallbacks[hintLevel] ?? fallbacks[1],
  };
}

async function handleGenerateReflection(req: TutorRequest): Promise<TutorResponse> {
  const { topic, subject, sessionSummary, masteryScore } = req;
  const s = sessionSummary;

  const systemPrompt = `You are a warm, encouraging ${subject} tutor writing a brief end-of-session reflection.
Format the reflection as 5 short lines with these exact labels:
✦ Today you understood: [what the student demonstrated understanding of]
✦ Today you struggled with: [honest, constructive — what needs more work]
✦ One thing to revise tomorrow: [specific revision action]
✦ Estimated mastery improvement: [X → Y out of 100]
✦ [One personalised encouraging message — reference the student's effort, not just outcome]
Be warm but honest. Do not be generic. Keep each line to 1 sentence.`;

  const userContent = `Session summary for ${topic} (${subject}):
- Questions answered: ${s?.questionsAnswered ?? 0}
- Correct answers: ${s?.correctAnswers ?? 0}
- Hints used: ${s?.hintsUsed ?? 0}
- Misconceptions corrected: ${s?.misconceptionsFixed ?? 0}
- Current mastery: ${masteryScore}/100`;

  const ai = await callOpenAI(systemPrompt, userContent, 220);

  const fallback = [
    `✦ Today you understood: The core concepts of ${topic}`,
    `✦ Today you struggled with: Applying the concept without hints`,
    `✦ One thing to revise tomorrow: Re-solve one question on ${topic} without looking at notes`,
    `✦ Estimated mastery improvement: ${Math.max(0, masteryScore - 10)} → ${masteryScore} out of 100`,
    `✦ Great effort today — every session moves you closer to mastery.`,
  ].join("\n");

  return {
    action: "generateReflection",
    content: ai ?? fallback,
  };
}

// ── Route ─────────────────────────────────────────────────────────────────────

router.post("/api/tutor", async (req, res) => {
  const ip = (req.headers["x-forwarded-for"] as string ?? req.socket.remoteAddress ?? "unknown").split(",")[0].trim();
  if (!checkRate(ip)) {
    res.status(429).json({ error: "rate_limit", retryAfter: 3600 });
    return;
  }

  const body = req.body as TutorRequest;
  const { action, subject, topic } = body;

  if (!action || !subject || !topic) {
    res.status(400).json({ error: "missing_fields", required: ["action", "subject", "topic"] });
    return;
  }

  try {
    let result: TutorResponse;
    switch (action) {
      case "generateQuestion":  result = await handleGenerateQuestion(body);  break;
      case "assessAnswer":      result = await handleAssessAnswer(body);       break;
      case "generateHint":      result = await handleGenerateHint(body);       break;
      case "generateReflection": result = await handleGenerateReflection(body); break;
      default:
        res.status(400).json({ error: "unknown_action" });
        return;
    }
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Tutor route error");
    res.status(500).json({ error: "internal_error" });
  }
});

export default router;
