/**
 * Misconception Engine — identifies and tracks specific misunderstandings.
 *
 * When a student gives a wrong answer, we don't just say "try again".
 * We identify the EXACT nature of the misconception and reteach only that gap.
 *
 * Misconception categories (subject-agnostic):
 *  - sign_error            — used wrong sign (negative/positive)
 *  - formula_mismatch      — used the wrong formula for this problem type
 *  - unit_confusion        — mixed up units or forgot to convert
 *  - definitional_gap      — doesn't know what the term means
 *  - scope_confusion       — confused similar-sounding concepts
 *  - step_skipped          — knows the method but skips a critical step
 *  - partial_application   — applies the concept but incompletely
 *  - causal_reversal       — reverses cause and effect
 *  - overgeneralisation    — applies a rule in a context where it doesn't hold
 *  - computational_error   — correct method, arithmetic error
 *  - unknown               — could not be classified
 *
 * Firestore path: students/{id}/misconceptions
 */

const KEY = "studyai-v1-misconceptions";

export type MisconceptionCategory =
  | "sign_error" | "formula_mismatch" | "unit_confusion" | "definitional_gap"
  | "scope_confusion" | "step_skipped" | "partial_application" | "causal_reversal"
  | "overgeneralisation" | "computational_error" | "unknown";

export interface MisconceptionRecord {
  id:           string;
  topic:        string;
  subject:      string;
  category:     MisconceptionCategory;
  description:  string;       // specific description from AI
  occurrences:  number;
  lastSeen:     number;
  resolved:     boolean;
  reteachCount: number;       // how many times we reteaught this
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getAllMisconceptions(): MisconceptionRecord[] {
  return lsRead<MisconceptionRecord[]>(KEY, []);
}

export function recordMisconception(opts: {
  topic:       string;
  subject:     string;
  description: string;
  category?:   MisconceptionCategory;
}): MisconceptionRecord {
  const all = getAllMisconceptions();
  const category = opts.category ?? classifyMisconception(opts.description);

  // Deduplicate: same topic + same category
  const existing = all.find(
    (m) => m.topic === opts.topic && m.subject === opts.subject && m.category === category
  );

  if (existing) {
    existing.occurrences++;
    existing.lastSeen    = Date.now();
    existing.description = opts.description; // update with latest description
    lsWrite(all);
    return existing;
  }

  const record: MisconceptionRecord = {
    id:           `mc-${Date.now().toString(36)}`,
    topic:        opts.topic,
    subject:      opts.subject,
    category,
    description:  opts.description,
    occurrences:  1,
    lastSeen:     Date.now(),
    resolved:     false,
    reteachCount: 0,
  };
  all.push(record);
  if (all.length > 100) all.splice(0, all.length - 100); // keep last 100
  lsWrite(all);
  return record;
}

export function markReteaught(id: string): void {
  const all = getAllMisconceptions();
  const m   = all.find((x) => x.id === id);
  if (m) { m.reteachCount++; lsWrite(all); }
}

export function markResolved(id: string): void {
  const all = getAllMisconceptions();
  const m   = all.find((x) => x.id === id);
  if (m) { m.resolved = true; lsWrite(all); }
}

/** Pattern-match description text to category (fast, no AI). */
function classifyMisconception(description: string): MisconceptionCategory {
  const d = description.toLowerCase();
  if (d.includes("sign") || d.includes("negative") || d.includes("positive"))     return "sign_error";
  if (d.includes("formula") || d.includes("equation") || d.includes("wrong rule")) return "formula_mismatch";
  if (d.includes("unit") || d.includes("convert") || d.includes("dimension"))      return "unit_confusion";
  if (d.includes("definit") || d.includes("meaning") || d.includes("what is"))     return "definitional_gap";
  if (d.includes("confused") || d.includes("similar") || d.includes("versus"))     return "scope_confusion";
  if (d.includes("skip") || d.includes("forgot") || d.includes("missed step"))     return "step_skipped";
  if (d.includes("partial") || d.includes("incomplete") || d.includes("almost"))   return "partial_application";
  if (d.includes("cause") || d.includes("effect") || d.includes("reverse"))        return "causal_reversal";
  if (d.includes("always") || d.includes("all case") || d.includes("every time"))  return "overgeneralisation";
  if (d.includes("arithmetic") || d.includes("calculation") || d.includes("maths error")) return "computational_error";
  return "unknown";
}

export function getActiveMisconceptions(subject?: string): MisconceptionRecord[] {
  return getAllMisconceptions().filter(
    (m) => !m.resolved && (!subject || m.subject === subject)
  );
}

export function getPersistentMisconceptions(minOccurrences = 2): MisconceptionRecord[] {
  return getActiveMisconceptions().filter((m) => m.occurrences >= minOccurrences);
}

/** Plain English reteaching prompt for a given misconception category. */
export function getReteachingHint(category: MisconceptionCategory): string {
  const hints: Record<MisconceptionCategory, string> = {
    sign_error:          "Let's revisit the sign rules here. When do we use a negative, and when do we use a positive?",
    formula_mismatch:    "Before we apply any formula, let's identify what type of problem this is. What are the known quantities, and what are we finding?",
    unit_confusion:      "Units are the language of measurement — let's check what units we're working with and whether they need to be converted first.",
    definitional_gap:    "Let's go back to basics. What does this term actually mean in its simplest form?",
    scope_confusion:     "These two concepts sound similar but are different in a key way. Let's compare them side by side.",
    step_skipped:        "You're on the right track, but there's one critical step that bridges the gap. Can you spot where the reasoning needs to be completed?",
    partial_application: "You've applied part of the concept correctly. What happens next — what does the rest of the method require?",
    causal_reversal:     "Let's think about what causes what here. Which thing happens first, and which is the result?",
    overgeneralisation:  "This rule works in most cases, but not this one. What condition or assumption is missing here?",
    computational_error: "Your method is right! Let's carefully redo the arithmetic step by step.",
    unknown:             "Let's approach this differently. Can you walk me through your thinking from the very beginning?",
  };
  return hints[category];
}
