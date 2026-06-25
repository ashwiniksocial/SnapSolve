/**
 * Analogy Engine — generates and tracks subject-specific analogies.
 *
 * A well-chosen analogy can unlock understanding in seconds.
 * This engine:
 *  1. Maintains a curated analogy bank per topic/subject
 *  2. Tracks which analogies "clicked" for this student
 *  3. Generates new custom analogies via the AI backend (POST /api/tutor)
 *  4. Detects where analogies break down (boundary conditions)
 *  5. Avoids repeating analogies that didn't help
 *
 * Analogy sources:
 *  - Static bank: high-quality curated analogies per topic
 *  - AI-generated: custom analogies based on student's interests/background
 *
 * Firestore path: students/{id}/analogyHistory
 */

const BASE_URL = import.meta.env.BASE_URL as string ?? "/";
const KEY      = "studyai-v1-analogy-history";

export interface Analogy {
  id:            string;
  topic:         string;
  subject:       string;
  sourceDomain:  string;   // the familiar domain ("a recipe", "a traffic jam")
  targetConcept: string;   // the abstract concept being explained
  analogyText:   string;   // the full analogy explanation
  breakdown:     string;   // where the analogy breaks down (boundary)
  source:        "curated" | "ai";
}

export interface AnalogyRecord {
  analogy:     Analogy;
  shownAt:     number;
  clicked:     boolean;    // student engaged with it
  helpful:     boolean | null;   // null = unknown, true/false = rated
}

export interface AnalogyHistory {
  records:         AnalogyRecord[];
  helpfulIds:      string[];   // analogy IDs that were rated helpful
  unhelpfulIds:    string[];
  totalShown:      number;
  helpfulRate:     number;   // 0–1
  updatedAt:       number;
}

// ── Curated analogy bank ──────────────────────────────────────────────────────

const CURATED_ANALOGIES: Analogy[] = [
  // ── Mathematics ──────────────────────────────────────────────────────────
  {
    id: "c-fractions-pizza", topic: "Fractions", subject: "Mathematics",
    sourceDomain: "a pizza", targetConcept: "numerator and denominator",
    analogyText: "Think of a fraction like slices of a pizza. The denominator (bottom number) is how many equal slices the pizza is cut into. The numerator (top number) is how many slices you're taking. So 3/8 means the pizza is cut into 8 equal slices, and you're taking 3 of them.",
    breakdown: "This analogy breaks down for improper fractions like 9/8 — you can't take more slices than exist in one pizza, but mathematically you can.", source: "curated",
  },
  {
    id: "c-variables-boxes", topic: "Algebra", subject: "Mathematics",
    sourceDomain: "labelled boxes", targetConcept: "variables",
    analogyText: "A variable like 'x' is like a labelled box. The box can hold any number — you just don't know which one yet. When you 'solve for x', you're figuring out what number is inside the box.",
    breakdown: "This breaks down for multi-valued variables or vectors — a box holds exactly one thing.", source: "curated",
  },
  {
    id: "c-pythagoras-ladders", topic: "Pythagoras' Theorem", subject: "Mathematics",
    sourceDomain: "a ladder against a wall", targetConcept: "right triangle sides",
    analogyText: "Imagine leaning a ladder against a wall. The ground is the base, the wall is the height, and the ladder is the hypotenuse. Pythagoras' theorem tells you: if you know any two of these, you can always find the third.",
    breakdown: "Only works for right-angled triangles — the wall and ground must meet at exactly 90°.", source: "curated",
  },
  {
    id: "c-probability-bags", topic: "Probability", subject: "Mathematics",
    sourceDomain: "a bag of coloured balls", targetConcept: "probability as a fraction",
    analogyText: "Picture a bag with 3 red and 7 blue balls. Probability is just: how many ways can the event happen ÷ total possibilities. P(red) = 3/10 because there are 3 red balls out of 10 total.",
    breakdown: "Breaks down for continuous probability — you can't count infinite real-number outcomes like balls in a bag.", source: "curated",
  },
  {
    id: "c-logs-undoing", topic: "Logarithms", subject: "Mathematics",
    sourceDomain: "undoing an operation", targetConcept: "logarithm as inverse of exponent",
    analogyText: "If exponents are like 'supercharging' a number (2³ = 8), logarithms are the way to 'undo' that supercharge. log₂(8) = 3 asks: '2 to WHAT power gives 8?' — the answer is 3.",
    breakdown: "The analogy weakens for fractional or negative exponents where the 'undoing' isn't as obvious.", source: "curated",
  },

  // ── Physics ───────────────────────────────────────────────────────────────
  {
    id: "c-current-water", topic: "Electric Current", subject: "Physics",
    sourceDomain: "water flowing in a pipe", targetConcept: "current, voltage, resistance",
    analogyText: "Electric current is like water flowing through a pipe. Voltage is the water pressure — higher pressure pushes more water. Current is how much water flows per second. Resistance is how narrow or blocked the pipe is — a narrow pipe lets less water through.",
    breakdown: "Water is incompressible; electricity isn't. The analogy breaks at high frequencies and AC circuits.", source: "curated",
  },
  {
    id: "c-force-push", topic: "Newton's Laws", subject: "Physics",
    sourceDomain: "pushing a shopping trolley", targetConcept: "force, mass, acceleration",
    analogyText: "F = ma is just like pushing a shopping trolley. Push harder (more force) → it accelerates faster. A heavy, full trolley (more mass) → it accelerates slower for the same push. The empty trolley (less mass) → shoots off easily.",
    breakdown: "Breaks down at near-light speeds where Newton's laws no longer hold and relativity takes over.", source: "curated",
  },
  {
    id: "c-waves-crowd", topic: "Wave Motion", subject: "Physics",
    sourceDomain: "a crowd doing a Mexican wave", targetConcept: "wave propagation vs particle motion",
    analogyText: "A Mexican wave in a stadium is perfect for understanding waves: the wave travels around the stadium, but each person only moves up and down — they don't travel with the wave. In a sound wave, the air molecules vibrate back and forth but don't travel with the sound.",
    breakdown: "Doesn't cover transverse vs longitudinal distinction well, and doesn't explain amplitude or frequency intuitively.", source: "curated",
  },

  // ── Chemistry ─────────────────────────────────────────────────────────────
  {
    id: "c-atoms-lego", topic: "Atomic Structure", subject: "Chemistry",
    sourceDomain: "LEGO bricks", targetConcept: "atoms and molecules",
    analogyText: "Atoms are like LEGO bricks — each type of brick (element) has its own shape and connection points (valence). You can snap bricks together to build molecules, just like atoms bond to form compounds. The number of connection points each brick has determines what it can attach to.",
    breakdown: "LEGO bricks are rigid; real atoms form bonds with flexible angles and aren't as distinctly coloured or shaped.", source: "curated",
  },
  {
    id: "c-ph-scale", topic: "pH and Acids", subject: "Chemistry",
    sourceDomain: "a ruler", targetConcept: "the pH scale",
    analogyText: "The pH scale is like a ruler from 0 to 14. One end (0–6) is acids — the closer to 0, the more acidic (like battery acid). The other end (8–14) is bases — the closer to 14, the more basic (like bleach). 7 in the middle is perfectly neutral, like pure water.",
    breakdown: "The logarithmic nature isn't captured — pH 3 is 10× more acidic than pH 4, not just 'a bit more'.", source: "curated",
  },
];

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getAnalogyHistory(): AnalogyHistory {
  return lsRead<AnalogyHistory>(KEY, {
    records: [], helpfulIds: [], unhelpfulIds: [], totalShown: 0, helpfulRate: 0, updatedAt: Date.now(),
  });
}

// ── Core API ──────────────────────────────────────────────────────────────────

/** Get the best analogy for a topic — curated first, then AI-generated. */
export async function getBestAnalogy(opts: {
  topic:   string;
  subject: string;
  tryAI?:  boolean;
}): Promise<Analogy | null> {
  const history = getAnalogyHistory();
  const usedIds = new Set(history.records.map((r) => r.analogy.id));
  const unhelpful = new Set(history.unhelpfulIds);

  // Find unused curated analogy for this topic
  const curated = CURATED_ANALOGIES.filter(
    (a) =>
      a.topic.toLowerCase().includes(opts.topic.toLowerCase()) ||
      opts.topic.toLowerCase().includes(a.topic.toLowerCase())
  );
  const unused = curated.filter((a) => !usedIds.has(a.id) && !unhelpful.has(a.id));
  if (unused.length > 0) {
    const analogy = unused[Math.floor(Math.random() * unused.length)];
    _recordShown(analogy);
    return analogy;
  }

  // Fallback: AI-generated analogy
  if (opts.tryAI !== false) {
    const analogy = await _generateAIAnalogy(opts.topic, opts.subject);
    if (analogy) { _recordShown(analogy); return analogy; }
  }

  // Last resort: return the least-used curated one even if seen before
  if (curated.length > 0) {
    const analogy = curated.sort((a, b) => {
      const aRec = history.records.filter((r) => r.analogy.id === a.id).length;
      const bRec = history.records.filter((r) => r.analogy.id === b.id).length;
      return aRec - bRec;
    })[0];
    _recordShown(analogy);
    return analogy;
  }

  return null;
}

async function _generateAIAnalogy(topic: string, subject: string): Promise<Analogy | null> {
  try {
    const apiBase = BASE_URL.replace(/\/$/, "");
    const res = await fetch(`${apiBase}/api/tutor`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "generateQuestion",
        topic, subject, masteryScore: 0,
        studentContext: `Generate an analogy for "${topic}" in ${subject}. Return: {"sourceDomain":"...","analogyText":"...","breakdown":"..."}. Return valid JSON only.`,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json() as { content: string };
    try {
      const parsed = JSON.parse(data.content) as { sourceDomain: string; analogyText: string; breakdown: string };
      return {
        id: `ai-${Date.now().toString(36)}`,
        topic, subject,
        sourceDomain:  parsed.sourceDomain,
        targetConcept: topic,
        analogyText:   parsed.analogyText,
        breakdown:     parsed.breakdown,
        source:        "ai",
      };
    } catch { return null; }
  } catch { return null; }
}

function _recordShown(analogy: Analogy): void {
  const h = getAnalogyHistory();
  h.records = [...h.records.slice(-49), { analogy, shownAt: Date.now(), clicked: false, helpful: null }];
  h.totalShown++;
  h.updatedAt = Date.now();
  lsWrite(h);
}

export function rateAnalogy(analogyId: string, helpful: boolean): void {
  const h = getAnalogyHistory();
  const rec = h.records.find((r) => r.analogy.id === analogyId);
  if (rec) {
    rec.helpful = helpful;
    rec.clicked = true;
    if (helpful)  h.helpfulIds    = [...h.helpfulIds,    analogyId];
    else          h.unhelpfulIds  = [...h.unhelpfulIds,  analogyId];
    const rated = h.records.filter((r) => r.helpful !== null);
    h.helpfulRate = rated.length > 0
      ? rated.filter((r) => r.helpful).length / rated.length
      : 0;
    h.updatedAt = Date.now();
    lsWrite(h);
  }
}

/** List of topics that have curated analogies available. */
export function getTopicsWithAnalogies(): string[] {
  return [...new Set(CURATED_ANALOGIES.map((a) => a.topic))];
}
