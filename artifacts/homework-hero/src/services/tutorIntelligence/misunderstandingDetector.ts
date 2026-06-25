/**
 * Misunderstanding Detector — goes deeper than misconception classification.
 *
 * While misconceptionEngine.ts identifies the CATEGORY of a wrong answer
 * (sign_error, formula_mismatch…), this engine identifies the ROOT CAUSE
 * and DEPTH of the misunderstanding.
 *
 * Misunderstanding dimensions:
 *  - Nature:    conceptual | procedural | linguistic | notational | attentional
 *  - Depth:     surface (forgot a fact) | structural (wrong mental model) | foundational (missing prerequisite)
 *  - Stability: isolated (one-off) | recurring (pattern across sessions) | persistent (weeks unchanged)
 *  - Origin:    novice_error | interference (old knowledge blocks new) | overgeneralisation | vernacular_conflict
 *
 * Firestore path: students/{id}/misunderstandingProfiles/{topicKey}
 */

const KEY = "studyai-v1-misunderstanding-profiles";

export type MisunderstandingNature =
  | "conceptual"     // wrong mental model / understanding
  | "procedural"     // knows concept but applies incorrectly
  | "linguistic"     // misreads or misinterprets question language
  | "notational"     // confuses symbols, notation, or formatting
  | "attentional";   // careless error, not a knowledge gap

export type MisunderstandingDepth =
  | "surface"        // forgot a fact; easily corrected by reminder
  | "structural"     // wrong mental model; needs reteaching
  | "foundational";  // missing prerequisite; needs prerequisite recovery

export type MisunderstandingStability =
  | "isolated"       // happened once
  | "recurring"      // 2–3 times
  | "persistent";    // 4+ times across sessions

export type MisunderstandingOrigin =
  | "novice_error"          // expected for first exposure
  | "interference"          // prior knowledge blocking new knowledge
  | "overgeneralisation"    // applying a rule beyond its scope
  | "vernacular_conflict"   // everyday meaning conflicts with technical meaning
  | "unknown";

export interface MisunderstandingProfile {
  profileKey:    string;         // `${subject}::${topic}::${nature}`
  topic:         string;
  subject:       string;
  nature:        MisunderstandingNature;
  depth:         MisunderstandingDepth;
  stability:     MisunderstandingStability;
  origin:        MisunderstandingOrigin;

  description:   string;         // plain-English description of the root cause
  evidence:      string[];       // student answers that revealed this (last 5)
  occurrences:   number;
  firstSeen:     number;
  lastSeen:      number;
  resolved:      boolean;

  // Reteaching effectiveness
  reteachAttempts:   number;
  successfulReteach: boolean;    // did a reteach actually fix it?
  effectiveStrategy?: string;    // which teaching strategy resolved it
}

export interface MisunderstandingReport {
  profiles:            MisunderstandingProfile[];
  dominantNature:      MisunderstandingNature | null;
  dominantDepth:       MisunderstandingDepth | null;
  persistentCount:     number;
  structuralCount:     number;   // most serious — require reteaching
  topPriorityProfile:  MisunderstandingProfile | null;
  updatedAt:           number;
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

function getAll(): MisunderstandingProfile[] {
  return lsRead<MisunderstandingProfile[]>(KEY, []);
}

// ── Core API ──────────────────────────────────────────────────────────────────

/**
 * Record a new misunderstanding instance.
 * Call this after the AI assessment classifies an answer as incorrect.
 */
export function recordMisunderstanding(opts: {
  topic:       string;
  subject:     string;
  nature:      MisunderstandingNature;
  depth?:      MisunderstandingDepth;
  origin?:     MisunderstandingOrigin;
  description: string;
  evidence:    string;   // the student's actual wrong answer
}): MisunderstandingProfile {
  const all = getAll();
  const key = `${opts.subject}::${opts.topic}::${opts.nature}`;
  const existing = all.find((p) => p.profileKey === key);

  if (existing) {
    existing.occurrences++;
    existing.lastSeen  = Date.now();
    existing.evidence  = [...existing.evidence.slice(-4), opts.evidence];
    existing.stability = existing.occurrences >= 4 ? "persistent"
      : existing.occurrences >= 2 ? "recurring" : "isolated";
    if (opts.depth) existing.depth = opts.depth;
    lsWrite(all);
    return existing;
  }

  const profile: MisunderstandingProfile = {
    profileKey:  key,
    topic:       opts.topic,
    subject:     opts.subject,
    nature:      opts.nature,
    depth:       opts.depth ?? "surface",
    stability:   "isolated",
    origin:      opts.origin ?? "unknown",
    description: opts.description,
    evidence:    [opts.evidence],
    occurrences: 1,
    firstSeen:   Date.now(),
    lastSeen:    Date.now(),
    resolved:    false,
    reteachAttempts:   0,
    successfulReteach: false,
  };

  all.push(profile);
  if (all.length > 200) all.splice(0, all.length - 200);
  lsWrite(all);
  return profile;
}

/** Infer misunderstanding from answer text without AI — fast heuristic. */
export function inferNatureFromAnswer(answer: string, correctKeywords: string[]): MisunderstandingNature {
  const a   = answer.toLowerCase().trim();
  const len = a.split(/\s+/).length;

  if (len <= 2)                              return "attentional";  // too short = careless
  if (/don.t know|no idea|idk/i.test(a))    return "conceptual";
  if (/because|therefore|since/i.test(a))   return "conceptual";   // tries to reason = conceptual gap
  const keywordHit = correctKeywords.some((k) => a.includes(k.toLowerCase()));
  if (keywordHit)                            return "procedural";   // knows words, wrong application
  return "conceptual";
}

/** Mark a misunderstanding as successfully resolved. */
export function markResolved(profileKey: string, strategy?: string): void {
  const all = getAll();
  const p   = all.find((x) => x.profileKey === profileKey);
  if (p) {
    p.resolved          = true;
    p.successfulReteach = true;
    p.effectiveStrategy = strategy;
    lsWrite(all);
  }
}

export function recordReteachAttempt(profileKey: string): void {
  const all = getAll();
  const p   = all.find((x) => x.profileKey === profileKey);
  if (p) { p.reteachAttempts++; lsWrite(all); }
}

// ── Reports ───────────────────────────────────────────────────────────────────

export function getMisunderstandingReport(subject?: string): MisunderstandingReport {
  const profiles = getAll().filter((p) => !p.resolved && (!subject || p.subject === subject));

  const natureCounts: Partial<Record<MisunderstandingNature, number>> = {};
  const depthCounts:  Partial<Record<MisunderstandingDepth,  number>> = {};

  for (const p of profiles) {
    natureCounts[p.nature] = (natureCounts[p.nature] ?? 0) + p.occurrences;
    depthCounts[p.depth]   = (depthCounts[p.depth]   ?? 0) + p.occurrences;
  }

  const dominantNature = (Object.entries(natureCounts).sort(([, a], [, b]) => b - a)[0]?.[0] ?? null) as MisunderstandingNature | null;
  const dominantDepth  = (Object.entries(depthCounts).sort( ([, a], [, b]) => b - a)[0]?.[0] ?? null) as MisunderstandingDepth  | null;

  const persistentCount  = profiles.filter((p) => p.stability === "persistent").length;
  const structuralCount  = profiles.filter((p) => p.depth === "structural").length;

  // Priority: persistent > structural > recurring
  const topPriorityProfile = profiles.sort((a, b) => {
    const ps = { persistent: 3, recurring: 2, isolated: 1 };
    const ds = { foundational: 3, structural: 2, surface: 1 };
    return (ps[b.stability] + ds[b.depth]) - (ps[a.stability] + ds[a.depth]);
  })[0] ?? null;

  return { profiles, dominantNature, dominantDepth, persistentCount, structuralCount, topPriorityProfile, updatedAt: Date.now() };
}

export function getStructuralMisunderstandings(subject?: string): MisunderstandingProfile[] {
  return getAll().filter((p) => !p.resolved && p.depth === "structural" && (!subject || p.subject === subject));
}

export function getPersistentMisunderstandings(): MisunderstandingProfile[] {
  return getAll().filter((p) => !p.resolved && p.stability === "persistent");
}
