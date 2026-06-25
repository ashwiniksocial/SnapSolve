/**
 * Student Profile Engine — enriched learner identity.
 *
 * Extends the base studentProfile.ts with:
 *  - Academic context (class, board, target score, goal date)
 *  - Cognitive traits (attention span, processing speed, cognitive load tolerance)
 *  - Emotional resilience (frustration tolerance, bounce-back speed)
 *  - Learning goals (per-subject targets)
 *
 * Firestore path: students/{id}/enrichedProfile
 */

const KEY = "studyai-v1-enriched-profile";

export type Board  = "CBSE" | "ICSE" | "State Board" | "IB" | "Other";
export type Grade  = 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type LearnerArchetype =
  | "explorer"       // loves depth, opens every section
  | "sprinter"       // quick answers, minimal reading
  | "methodical"     // works through every step slowly
  | "anxious"        // re-reads many times, low confidence
  | "overconfident"  // skips steps, makes avoidable mistakes
  | "unknown";

export interface EnrichedProfile {
  // Academic context
  grade:             Grade | null;
  board:             Board | null;
  targetScore:       number;           // 0–100, self-declared target percentage
  examDate:          string | null;    // ISO date "YYYY-MM-DD"
  subjectGoals:      Record<string, number>; // subject → target %

  // Cognitive traits (derived from behaviour, updated incrementally)
  attentionSpanMinutes: number;        // estimated focus window (5–60)
  processingSpeed:      "fast" | "medium" | "slow";  // derived from avgTimePerQuestion
  cognitiveLoadTolerance: "high" | "medium" | "low"; // how much info they can handle per session

  // Emotional resilience
  frustrationEvents:    number;        // count of sessions < 30 s (rage-quits)
  bounceBackSpeed:      "fast" | "slow" | "unknown"; // how quickly they return after a rage-quit
  positiveStreakEffect: boolean;       // does their score improve when streak is active?

  // Derived archetype
  archetype:            LearnerArchetype;

  updatedAt: number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT: EnrichedProfile = {
  grade: null, board: null, targetScore: 75, examDate: null, subjectGoals: {},
  attentionSpanMinutes: 20, processingSpeed: "medium", cognitiveLoadTolerance: "medium",
  frustrationEvents: 0, bounceBackSpeed: "unknown", positiveStreakEffect: false,
  archetype: "unknown", updatedAt: Date.now(),
};

export function getEnrichedProfile(): EnrichedProfile {
  return lsRead<EnrichedProfile>(KEY, DEFAULT);
}

export function saveEnrichedProfile(patch: Partial<EnrichedProfile>): EnrichedProfile {
  const current = getEnrichedProfile();
  const updated  = { ...current, ...patch, updatedAt: Date.now() };
  lsWrite(updated);
  return updated;
}

/** Set student's academic context (call from an onboarding or settings screen). */
export function setAcademicContext(ctx: {
  grade?: Grade;
  board?: Board;
  targetScore?: number;
  examDate?: string;
}): void {
  saveEnrichedProfile(ctx);
}

/** Recompute derived fields from observed session data. Call after each session. */
export function recomputeTraits(sessionDurationMs: number, avgQTimeMs: number, sectionCount: number): void {
  const p = getEnrichedProfile();

  // Attention span: smoothed estimate of how long they can focus in one session
  const newSpan = Math.round(sessionDurationMs / 60_000);
  const smoothedSpan = Math.round(p.attentionSpanMinutes * 0.8 + Math.min(60, newSpan) * 0.2);

  // Processing speed
  let speed: EnrichedProfile["processingSpeed"] = "medium";
  if (avgQTimeMs < 180_000) speed = "fast";
  else if (avgQTimeMs > 480_000) speed = "slow";

  // Cognitive load: how many sections they engage with per session
  let load: EnrichedProfile["cognitiveLoadTolerance"] = "medium";
  if (sectionCount >= 6) load = "high";
  else if (sectionCount <= 2) load = "low";

  // Frustration: sessions < 30 s are likely rage-quits
  const rage = sessionDurationMs < 30_000 ? 1 : 0;

  // Archetype (rule-based, evolves over time)
  let archetype: LearnerArchetype = p.archetype;
  if (sectionCount >= 7 && speed === "slow") archetype = "methodical";
  else if (speed === "fast" && sectionCount <= 3) archetype = "sprinter";
  else if (rage > 0) archetype = "anxious";
  else if (speed === "fast" && p.frustrationEvents > 5) archetype = "overconfident";
  else if (sectionCount >= 5) archetype = "explorer";

  saveEnrichedProfile({
    attentionSpanMinutes: smoothedSpan,
    processingSpeed: speed,
    cognitiveLoadTolerance: load,
    frustrationEvents: p.frustrationEvents + rage,
    archetype,
  });
}

export function setSubjectGoal(subject: string, targetPercent: number): void {
  const p = getEnrichedProfile();
  saveEnrichedProfile({ subjectGoals: { ...p.subjectGoals, [subject]: targetPercent } });
}

/** Days until exam (null if no exam date set). */
export function daysUntilExam(): number | null {
  const { examDate } = getEnrichedProfile();
  if (!examDate) return null;
  const diff = new Date(examDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}
