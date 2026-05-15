/**
 * Topic Matcher — Pattern-based subject & topic detection from raw text.
 *
 * This is the "mock AI" layer that bridges OCR output to the question bank.
 * Replace the scoring logic with an LLM call when integrating OpenAI/Gemini.
 */

import type { Subject } from "@/data/subjects";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopicMatch {
  subject: Subject;
  topic: string;
  confidence: number; // 0–1
}

// ─── Pattern tables ───────────────────────────────────────────────────────────

const MATH_TOPICS: [string, RegExp[]][] = [
  ["Number Systems", [
    /irrational/i, /rational\s+number/i, /real\s+number/i,
    /√\d/, /square\s+root/i, /number\s+line/i,
    /terminating/i, /recurring/i, /decimal\s+expansion/i,
    /surds?/i, /rationaliz/i,
  ]],
  ["Polynomials", [
    /polynomial/i, /factor\s+theorem/i, /remainder\s+theorem/i,
    /zer[oe]es?\s+of/i, /degree\s+of/i, /coefficient/i,
    /\bp\(x\)/i, /factoris[ea]/i, /cubic/i, /quadratic\s+polynomial/i,
    /algebraic\s+identity/i, /\(a\+b\)/i, /\(x[\+\-]\d\)/i,
  ]],
  ["Algebraic Identities", [
    /identity/i, /\(a\s*\+\s*b\)\s*[²2³3]/i, /expand/i,
    /\(x\s*\+\s*\d+\)\s*[²2]/i, /difference\s+of\s+squares?/i,
    /sum\s+of\s+cubes?/i, /\ba\^?3\s*\+\s*b\^?3/i,
  ]],
  ["Zeroes of a Polynomial", [
    /zer[oe]es?\s+of/i, /roots?\s+of\s+polynomial/i,
    /zero\s+of\s+p\(x\)/i, /zeroes?\s+are/i, /sum\s+of\s+zer/i,
  ]],
  ["Linear Equations", [
    /linear\s+equation/i, /solve\s+for\s+[xy]/i,
    /\b[23]x\s*[\+\-]/i, /find\s+[xy]\s+when/i, /value\s+of\s+[xy]/i,
    /two\s+variable/i, /solution\s+of.*equation/i,
  ]],
  ["Quadratic Equations", [
    /quadratic/i, /discriminant/i, /\bax\s*[²2]/i,
    /roots?\s+of.*equation/i, /nature\s+of\s+roots?/i,
    /by\s+factori/i, /quadratic\s+formula/i, /\bx\s*[²2]\s*[\+\-]/i,
  ]],
  ["Kinematics", [
    /velocity/i, /acceleration/i, /displacement/i,
    /initial\s+speed/i, /m\/s/i, /time\s+of\s+flight/i,
    /equations?\s+of\s+motion/i, /uniform\s+motion/i, /retardation/i,
  ]],
  ["Laws of Exponents", [
    /exponent/i, /\ba\^?m\s*[×·]\s*a\^?n/i, /power\s+of\s+a\s+power/i,
    /simplify.*\d+\^\d+/i, /\d+\s*\^\s*[-\d]/i, /index.*law/i,
  ]],
];

const PHYSICS_TOPICS: [string, RegExp[]][] = [
  ["Kinematics", [
    /velocity/i, /acceleration/i, /displacement/i,
    /initial\s+(velocity|speed)/i, /m\/s/i, /time.*seconds/i,
    /equations?\s+of\s+motion/i, /distance.*time/i, /\bv\s*=\s*u/i,
    /free\s+fall/i, /projectile/i, /uniform\s+acceleration/i,
  ]],
  ["Newton's Laws of Motion", [
    /force/i, /newton/i, /\bF\s*=\s*ma\b/i, /friction/i,
    /tension/i, /normal\s+force/i, /net\s+force/i, /inertia/i,
    /free\s+body\s+diagram/i, /newton'?s\s+(first|second|third)/i,
    /action.*reaction/i, /applied\s+force/i,
  ]],
  ["Work, Power & Energy", [
    /\bwork\b/i, /\bpower\b/i, /kinetic\s+energy/i, /potential\s+energy/i,
    /joule/i, /watt/i, /conservation\s+of\s+energy/i, /\bKE\b/i,
    /\bPE\b/i, /\bW\s*=\s*F/i, /horsepower/i, /mechanical\s+energy/i,
  ]],
  ["Gravitation", [
    /gravit/i, /\bg\s*=\s*9\.8/i, /orbital/i, /planet/i,
    /satellite/i, /weight\s+on\s+(moon|planet)/i, /escape\s+velocity/i,
  ]],
];

const CHEMISTRY_TOPICS: [string, RegExp[]][] = [
  ["Balancing Chemical Equations", [
    /balanc/i, /chemical\s+equation/i, /reactant/i, /product/i,
    /\+\s*O2/i, /combustion/i, /conservation\s+of\s+mass/i,
    /atoms?\s+on\s+(left|right)/i, /coefficient/i,
  ]],
  ["Stoichiometry & Mole Concept", [
    /mole/i, /molar\s+mass/i, /stoichiometr/i, /avogadro/i,
    /6\.022/i, /limiting\s+reagent/i, /percentage\s+yield/i,
    /\bg\/mol\b/i, /gram\s+formula/i, /empirical\s+formula/i,
  ]],
  ["Atomic Structure", [
    /electron/i, /proton/i, /neutron/i, /atomic\s+number/i,
    /isotope/i, /shell/i, /orbit/i, /nucleus/i, /bohr/i, /energy\s+level/i,
  ]],
  ["Periodic Table", [
    /periodic/i, /element/i, /group\s+\d/i, /period\s+\d/i,
    /valenc/i, /electronegativity/i, /ionization\s+energy/i,
    /atomic\s+radius/i,
  ]],
];

// ─── Scoring ──────────────────────────────────────────────────────────────────

function score(text: string, patterns: RegExp[]): number {
  return patterns.filter((p) => p.test(text)).length / patterns.length;
}

function bestMatch(
  text: string,
  subject: Subject,
  table: [string, RegExp[]][]
): TopicMatch | null {
  let best: TopicMatch | null = null;
  for (const [topic, patterns] of table) {
    const confidence = score(text, patterns);
    if (!best || confidence > best.confidence) {
      best = { subject, topic, confidence };
    }
  }
  return best;
}

// ─── Subject-level detection ──────────────────────────────────────────────────

const SUBJECT_HINTS: Record<Subject, RegExp[]> = {
  Mathematics: [
    /\b(equation|solve|factoris|polynomial|integer|fraction|angle|geometry|algebra|calculus)\b/i,
    /\b(x|y|z)\s*=/, /\d+x/, /√/, /\b(sum|product|difference|ratio)\b/i,
  ],
  Physics: [
    /\b(force|velocity|acceleration|energy|power|mass|gravity|charge|current|voltage)\b/i,
    /\b(m\/s|m\/s²|N|J|W|kg|ms)\b/i, /newton/i, /joule/i,
  ],
  Chemistry: [
    /\b(atom|molecule|element|compound|reaction|acid|base|bond|ion|electron|mole)\b/i,
    /\b[A-Z][a-z]?\d*\s*\+\s*[A-Z]/, /→|➜/, /\bpH\b/i,
  ],
};

function detectSubject(text: string): Subject {
  let best: Subject = "Mathematics";
  let bestScore = -1;

  for (const [subj, patterns] of Object.entries(SUBJECT_HINTS) as [Subject, RegExp[]][]) {
    const s = score(text, patterns);
    if (s > bestScore) {
      bestScore = s;
      best = subj;
    }
  }
  return best;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Given raw OCR text, detect the most likely subject + topic.
 * Returns an array sorted by confidence (highest first).
 */
export function detectTopics(text: string, hintSubject?: Subject): TopicMatch[] {
  if (!text.trim()) return [];

  const subject = hintSubject ?? detectSubject(text);

  const table =
    subject === "Mathematics" ? MATH_TOPICS :
    subject === "Physics"     ? PHYSICS_TOPICS :
                                CHEMISTRY_TOPICS;

  const results: TopicMatch[] = [];
  for (const [topic, patterns] of table) {
    const confidence = score(text, patterns);
    results.push({ subject, topic, confidence });
  }

  results.sort((a, b) => b.confidence - a.confidence);
  return results;
}

/** Returns only the single best match (or null if nothing detected). */
export function detectBestTopic(text: string, hintSubject?: Subject): TopicMatch | null {
  const results = detectTopics(text, hintSubject);
  return results[0] ?? null;
}

/** Clean up raw OCR output — remove noise, normalise whitespace. */
export function cleanOcrText(raw: string): string {
  return raw
    .replace(/[|]{2,}/g, " ")         // Tesseract pipe artefacts
    .replace(/\f/g, "\n")              // form feeds
    .replace(/[^\S\n]+/g, " ")         // collapse spaces
    .replace(/\n{3,}/g, "\n\n")        // collapse blank lines
    .replace(/^[\s\W]+|[\s\W]+$/g, "") // trim leading/trailing noise
    .trim();
}
