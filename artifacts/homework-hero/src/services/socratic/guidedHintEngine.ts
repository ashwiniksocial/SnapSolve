/**
 * Guided Hint Engine — 5-level progressive hint system.
 *
 * Hints grow from subtle nudge → full explanation.
 * The engine NEVER reveals the answer at level 1–3.
 * It tracks hint behaviour to understand student persistence.
 *
 * Hint ladder:
 *  Level 1 — tiny clue, redirects thinking
 *  Level 2 — directs attention to a specific aspect
 *  Level 3 — shows the next logical step
 *  Level 4 — reveals the reasoning (stops before final answer)
 *  Level 5 — full explanation of the solution path
 *
 * Firestore path: students/{id}/hintHistory
 */

const BASE_URL = import.meta.env.BASE_URL as string ?? "/";
const KEY      = "studyai-v1-hint-history";

export interface HintRecord {
  sessionId:       string;
  topic:           string;
  subject:         string;
  question:        string;
  hintLevel:       number;          // 1–5
  content:         string;
  timeBeforeHint:  number;          // ms since question was shown
  generatedAt:     number;
}

export interface HintHistory {
  records:          HintRecord[];
  avgLevelUsed:     number;
  avgTimeBeforeHint: number;
  maxLevelCount:    number;         // how often they needed hint 5 (full reveal)
  totalHints:       number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getHintHistory(): HintHistory {
  return lsRead<HintHistory>(KEY, {
    records: [], avgLevelUsed: 0, avgTimeBeforeHint: 0, maxLevelCount: 0, totalHints: 0,
  });
}

/** Fetch the next hint from the AI backend. */
export async function requestHint(opts: {
  sessionId:     string;
  topic:         string;
  subject:       string;
  question:      string;
  currentLevel:  number;           // the level to generate (1–5)
  timeElapsedMs: number;           // time student spent before asking
  masteryScore:  number;
}): Promise<{ content: string; level: number }> {
  const level = Math.min(5, Math.max(1, opts.currentLevel));

  let content: string;
  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action:       "generateHint",
        topic:        opts.topic,
        subject:      opts.subject,
        question:     opts.question,
        hintLevel:    level,
        masteryScore: opts.masteryScore,
      }),
    });
    if (res.ok) {
      const data = await res.json() as { content: string };
      content = data.content;
    } else {
      content = getLocalHint(opts.topic, level);
    }
  } catch {
    content = getLocalHint(opts.topic, level);
  }

  // Record in history
  const history = getHintHistory();
  const record: HintRecord = {
    sessionId:      opts.sessionId,
    topic:          opts.topic,
    subject:        opts.subject,
    question:       opts.question,
    hintLevel:      level,
    content,
    timeBeforeHint: opts.timeElapsedMs,
    generatedAt:    Date.now(),
  };
  history.records = [...history.records.slice(-49), record];
  const n = history.totalHints;
  history.avgLevelUsed      = (history.avgLevelUsed * n + level) / (n + 1);
  history.avgTimeBeforeHint = (history.avgTimeBeforeHint * n + opts.timeElapsedMs) / (n + 1);
  if (level === 5) history.maxLevelCount++;
  history.totalHints++;
  lsWrite(history);

  return { content, level };
}

function getLocalHint(topic: string, level: number): string {
  const hints: Record<number, string[]> = {
    1: [
      `Think carefully — what do you already know about ${topic}?`,
      `Consider: what is the question actually asking you to find?`,
      `Read the question again slowly. What's the key piece of information?`,
    ],
    2: [
      `Focus on the relationship between the quantities given in the problem.`,
      `Ask yourself: what type of problem is this? What category does it fall into?`,
      `Look at the units. They often tell you which formula to use.`,
    ],
    3: [
      `Here's a key step: start by identifying what you know and what you need to find.`,
      `The first move is to write out the relevant formula or rule for ${topic}.`,
      `Begin by organising your information — list known values and unknowns.`,
    ],
    4: [
      `Notice that this problem requires you to apply the core rule of ${topic} directly. Substitute your known values into the formula and simplify.`,
      `The key insight: once you write down the correct formula for ${topic}, the substitution becomes straightforward. Be careful with your arithmetic.`,
    ],
    5: [
      `Let me walk you through this: for ${topic}, start with the fundamental relationship, substitute your given values, and work step by step through the algebra. Each step must be justified.`,
      `Here's the full approach: identify the type of ${topic} problem → write the governing formula → substitute known values → solve systematically. Don't skip any steps.`,
    ],
  };
  const bank = hints[level] ?? hints[1];
  return bank[Math.floor(Math.random() * bank.length)];
}

/** Human-readable label for a hint level. */
export function hintLevelLabel(level: number): string {
  const labels = ["", "Tiny Clue", "Focus", "Next Step", "Key Reasoning", "Full Explanation"];
  return labels[level] ?? "Hint";
}

/** Cost description shown to student before they request next level. */
export function hintLevelWarning(level: number): string {
  const warnings: Record<number, string> = {
    1: "",
    2: "This hint will narrow things down for you.",
    3: "This hint shows you the next step.",
    4: "This hint reveals most of the reasoning — try to fill in the rest yourself.",
    5: "This shows the full solution. Try to understand each step as you read.",
  };
  return warnings[level] ?? "";
}

/** Whether the student typically needs high-level hints (a signal of struggle). */
export function isHighHintUser(): boolean {
  return getHintHistory().avgLevelUsed >= 3.5;
}
