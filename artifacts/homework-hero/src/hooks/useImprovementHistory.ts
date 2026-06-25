/**
 * useImprovementHistory
 *
 * Manages a 30-day daily snapshot ring buffer stored in `studyai-history-v1`.
 * Reads cumulative progress/revision data from localStorage directly
 * (self-contained, no hook composition needed).
 *
 * On first load: seeds 30 days of plausible data so charts are immediately
 * meaningful; marks snapshots as `seeded: true` so the UI can show a notice.
 * On subsequent loads: records today's snapshot if not yet taken.
 *
 * Provides:
 *   snapshots        — 30 DailySnapshot points, chart-ready (with `label`)
 *   isSeeded         — true when using generated data
 *   topPrediction    — best-fit topic projection (linear regression)
 *   overallSlope     — % accuracy change per day over last 14 days
 */

import { useMemo } from "react";

// ─── Storage key ───────────────────────────────────────────────────────────────
const HISTORY_KEY = "studyai-history-v1";

// ─── Data shapes ───────────────────────────────────────────────────────────────

export interface DailySnapshot {
  date: string;         // YYYY-MM-DD (source of truth)
  label: string;        // "Jun 1" (chart axis label)
  accuracy: number;     // overall accuracy 0-100
  physicsAcc: number;
  chemAcc: number;
  mathAcc: number;
  solved: number;       // problems solved that day
  confidence: number;   // weighted confidence 0-100
  revisionRate: number; // revision completion % 0-100
}

export interface TopicPrediction {
  topic: string;
  subject: string;
  currentAccuracy: number;
  projectedAccuracy: number;
  change: number;       // positive = improving
}

export interface ImprovementData {
  snapshots: DailySnapshot[];
  isSeeded: boolean;
  topPrediction: TopicPrediction | null;
  overallSlope: number; // accuracy % per day
}

// ─── Raw localStorage shapes ───────────────────────────────────────────────────

interface TopicRecord { solved: number; correct: number; attempted: string[] }
type SubjectRecord   = Record<string, TopicRecord>;
interface ProgressData {
  Physics: SubjectRecord;
  Chemistry: SubjectRecord;
  Mathematics: SubjectRecord;
}
interface RevisionItem { interval: number; dueDate: string }

// ─── Utilities ────────────────────────────────────────────────────────────────

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clamp(v: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, v));
}

/** Deterministic pseudo-random in [min, max] for a given integer seed */
function det(seed: number, min: number, max: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return Math.round(min + (x - Math.floor(x)) * (max - min));
}

function toLabel(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

function subjectAccuracy(data: SubjectRecord): number {
  const entries = Object.values(data);
  const total   = entries.reduce((s, v) => s + v.solved, 0);
  const correct = entries.reduce((s, v) => s + v.correct, 0);
  return total > 0 ? Math.round((correct / total) * 100) : 65; // 65 default for empty
}

// ─── Linear regression ────────────────────────────────────────────────────────

interface Regression {
  slope: number;
  project: (daysAhead: number) => number;
}

function linReg(values: number[]): Regression {
  const n = values.length;
  if (n < 2) return { slope: 0, project: () => values[0] ?? 65 };

  const meanX = (n - 1) / 2;
  const meanY = values.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  values.forEach((y, i) => { num += (i - meanX) * (y - meanY); den += (i - meanX) ** 2; });

  const slope     = den === 0 ? 0 : num / den;
  const intercept = meanY - slope * meanX;
  return {
    slope,
    project: (daysAhead) => clamp(Math.round(intercept + slope * (n - 1 + daysAhead))),
  };
}

// ─── Seed generator ───────────────────────────────────────────────────────────

type StoredSnapshot = Omit<DailySnapshot, "label">;
interface StoredHistory { snapshots: StoredSnapshot[]; seeded: boolean }

function buildSeedData(): StoredSnapshot[] {
  const prog = safeRead<ProgressData>("studyai-progress-v2", {
    Physics: {}, Chemistry: {}, Mathematics: {},
  });

  const curPhys = subjectAccuracy(prog.Physics);
  const curChem = subjectAccuracy(prog.Chemistry);
  const curMath = subjectAccuracy(prog.Mathematics);
  const curAll  = Math.round((curPhys + curChem + curMath) / 3);

  const today   = new Date();
  const result: StoredSnapshot[] = [];

  for (let ago = 29; ago >= 0; ago--) {
    const d = new Date(today);
    d.setDate(d.getDate() - ago);
    const date = d.toISOString().slice(0, 10);
    const seed = d.getDate() * 31 + d.getMonth() * 7;
    const t    = (29 - ago) / 29; // 0 → 1 (older → newer)
    const off  = 16;              // starting accuracy offset below current

    const accuracy    = clamp(Math.round((curAll  - off) + off * t + det(seed,     -5, 5)));
    const physicsAcc  = clamp(Math.round((curPhys - off) + off * t + det(seed + 1, -4, 4)));
    const chemAcc     = clamp(Math.round((curChem - off) + off * t + det(seed + 2, -4, 4)));
    const mathAcc     = clamp(Math.round((curMath - off) + off * t + det(seed + 3, -5, 5)));
    const solved      = det(seed + 4, 0, ago > 25 ? 3 : 8);
    const confidence  = clamp(Math.round(accuracy * (0.35 + 0.65 * t)));
    const revisionRate = clamp(Math.round(25 + t * 65 + det(seed + 5, -10, 10)));

    result.push({ date, accuracy, physicsAcc, chemAcc, mathAcc, solved, confidence, revisionRate });
  }
  return result;
}

// ─── Today snapshot ───────────────────────────────────────────────────────────

function buildTodaySnapshot(): StoredSnapshot {
  const prog = safeRead<ProgressData>("studyai-progress-v2", {
    Physics: {}, Chemistry: {}, Mathematics: {},
  });
  const revData = safeRead<Record<string, RevisionItem>>("studyai-revision-v1", {});

  const physicsAcc = subjectAccuracy(prog.Physics);
  const chemAcc    = subjectAccuracy(prog.Chemistry);
  const mathAcc    = subjectAccuracy(prog.Mathematics);
  const accuracy   = Math.round((physicsAcc + chemAcc + mathAcc) / 3);

  const allSolved = [
    ...Object.values(prog.Physics),
    ...Object.values(prog.Chemistry),
    ...Object.values(prog.Mathematics),
  ].reduce((s, v) => s + v.solved, 0);

  const revItems  = Object.values(revData);
  const today     = new Date().toISOString().slice(0, 10);
  const overdue   = revItems.filter((r) => r.dueDate <= today).length;
  const revisionRate = revItems.length > 0
    ? clamp(Math.round(((revItems.length - overdue) / revItems.length) * 100))
    : 0;

  const confidence = clamp(Math.round(accuracy * Math.min(allSolved / 50, 1)));

  return {
    date: today,
    accuracy,
    physicsAcc,
    chemAcc,
    mathAcc,
    solved: 0,
    confidence,
    revisionRate,
  };
}

// ─── History loader ───────────────────────────────────────────────────────────

function loadHistory(): { snapshots: StoredSnapshot[]; seeded: boolean } {
  const stored = safeRead<StoredHistory | null>(HISTORY_KEY, null);
  const today  = new Date().toISOString().slice(0, 10);

  if (stored && stored.snapshots.length >= 3) {
    const alreadyDone = stored.snapshots.some((s) => s.date === today);
    if (!alreadyDone) {
      const updated: StoredHistory = {
        ...stored,
        snapshots: [...stored.snapshots.slice(-29), buildTodaySnapshot()],
      };
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    }
    return stored;
  }

  // First visit: seed plausible 30-day data
  const fresh: StoredHistory = { snapshots: buildSeedData(), seeded: true };
  localStorage.setItem(HISTORY_KEY, JSON.stringify(fresh));
  return fresh;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useImprovementHistory(): ImprovementData {
  return useMemo(() => {
    const { snapshots: raw, seeded } = loadHistory();

    const snapshots: DailySnapshot[] = raw.map((s) => ({ ...s, label: toLabel(s.date) }));

    // Overall trend from last 14 days
    const last14Acc = snapshots.slice(-14).map((s) => s.accuracy);
    const { slope, project } = linReg(last14Acc);

    // Find the topic with the best 30-day projection
    const prog = safeRead<ProgressData>("studyai-progress-v2", {
      Physics: {}, Chemistry: {}, Mathematics: {},
    });

    let topPrediction: TopicPrediction | null = null;
    let bestChange = -Infinity;

    const subjects = ["Physics", "Chemistry", "Mathematics"] as const;
    for (const subj of subjects) {
      for (const [topic, data] of Object.entries(prog[subj] ?? {})) {
        if (data.solved < 2) continue;
        const cur = Math.round((data.correct / data.solved) * 100);
        if (cur >= 95) continue;
        const intensity     = Math.min(data.solved / 10, 1);
        const scaledSlope   = slope * (0.5 + intensity * 0.5);
        const projected     = clamp(Math.round(cur + scaledSlope * 30));
        const change        = projected - cur;
        if (change > bestChange) {
          bestChange    = change;
          topPrediction = { topic, subject: subj, currentAccuracy: cur, projectedAccuracy: projected, change };
        }
      }
    }

    // Fallback demo prediction for new/seeded users
    if (!topPrediction) {
      const demo30 = project(30);
      const demoNow = snapshots[snapshots.length - 1]?.accuracy ?? 65;
      topPrediction = {
        topic: "Algebra",
        subject: "Mathematics",
        currentAccuracy: demoNow,
        projectedAccuracy: clamp(demoNow + 12),
        change: 12,
      };
    }

    return { snapshots, isSeeded: seeded, topPrediction, overallSlope: slope };
  }, []);
}
