/**
 * Behavior Engine — reads student micro-signals from every interaction.
 *
 * Tracks:
 *  - Section engagement (which sections opened, how many times)
 *  - Hesitation signals (long time before first section open = confused)
 *  - Re-read signals (same section opened multiple times in one session)
 *  - Abandonment events (solution viewed < 10 s)
 *  - Depth switching (changed level mid-session = level mismatch)
 *
 * All data is Firestore-ready and stored incrementally.
 * Firestore path: students/{id}/behaviorSignals
 */

const KEY = "studyai-v1-behavior";

export interface SectionSignal {
  sectionKey:  string;
  totalOpens:  number;
  reopens:     number;    // opened more than once in the same session
  avgDwellMs:  number;    // average time spent with section visible (estimated)
}

export interface BehaviorSignals {
  // Aggregated section engagement across all sessions
  sectionSignals:   Record<string, SectionSignal>;

  // Hesitation: time between solution load and first section open (ms)
  avgHesitationMs:  number;
  hesitationCount:  number;

  // Depth switches: how often the student changes explanation depth mid-session
  depthSwitches:    number;
  depthSwitchTopics: string[];   // topics where they switched — signals level mismatch

  // Abandonment: sessions < 10 s
  abandonmentCount: number;
  abandonmentTopics: string[];

  // Learning signals
  practiceAttemptRate: number;   // fraction of sessions where practice section opened
  summaryReadRate:     number;   // fraction of sessions where learningSummary opened
  memoryReadRate:      number;   // fraction of sessions where rememberThis opened

  totalSessionsTracked: number;
  updatedAt: number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT_SIGNALS: BehaviorSignals = {
  sectionSignals: {},
  avgHesitationMs: 0, hesitationCount: 0,
  depthSwitches: 0, depthSwitchTopics: [],
  abandonmentCount: 0, abandonmentTopics: [],
  practiceAttemptRate: 0, summaryReadRate: 0, memoryReadRate: 0,
  totalSessionsTracked: 0, updatedAt: Date.now(),
};

export function getBehaviorSignals(): BehaviorSignals {
  return lsRead<BehaviorSignals>(KEY, DEFAULT_SIGNALS);
}

/** Called at the end of each solution session. */
export function recordSessionBehavior(opts: {
  topic:          string;
  durationMs:     number;
  sectionsOpened: string[];
  depthSwitched:  boolean;
  hesitationMs:   number;    // ms from solution load to first interaction
}): void {
  const b = getBehaviorSignals();
  const n = b.totalSessionsTracked;

  // Abandonment
  if (opts.durationMs < 10_000) {
    b.abandonmentCount++;
    if (!b.abandonmentTopics.includes(opts.topic)) {
      b.abandonmentTopics = [...b.abandonmentTopics.slice(-19), opts.topic];
    }
  }

  // Hesitation
  if (opts.hesitationMs > 0) {
    b.avgHesitationMs = Math.round((b.avgHesitationMs * b.hesitationCount + opts.hesitationMs) / (b.hesitationCount + 1));
    b.hesitationCount++;
  }

  // Depth switching
  if (opts.depthSwitched) {
    b.depthSwitches++;
    if (!b.depthSwitchTopics.includes(opts.topic)) {
      b.depthSwitchTopics = [...b.depthSwitchTopics.slice(-19), opts.topic];
    }
  }

  // Section signals
  for (const section of opts.sectionsOpened) {
    const prev = b.sectionSignals[section] ?? { sectionKey: section, totalOpens: 0, reopens: 0, avgDwellMs: 0 };
    const isReopen = opts.sectionsOpened.filter((s) => s === section).length > 1;
    b.sectionSignals[section] = {
      sectionKey:  section,
      totalOpens:  prev.totalOpens + 1,
      reopens:     prev.reopens + (isReopen ? 1 : 0),
      avgDwellMs:  prev.avgDwellMs, // dwell tracking is a future enhancement
    };
  }

  // Engagement rates (rolling average)
  const practiceOpened = opts.sectionsOpened.some((s) => s.includes("practice") || s.includes("understanding"));
  const summaryOpened  = opts.sectionsOpened.some((s) => s.includes("summary") || s.includes("learning"));
  const memoryOpened   = opts.sectionsOpened.some((s) => s.includes("memory") || s.includes("remember"));

  b.practiceAttemptRate = (b.practiceAttemptRate * n + (practiceOpened ? 1 : 0)) / (n + 1);
  b.summaryReadRate     = (b.summaryReadRate     * n + (summaryOpened  ? 1 : 0)) / (n + 1);
  b.memoryReadRate      = (b.memoryReadRate      * n + (memoryOpened   ? 1 : 0)) / (n + 1);

  b.totalSessionsTracked = n + 1;
  b.updatedAt = Date.now();
  lsWrite(b);
}

/** Sections the student consistently skips (never opened across 5+ sessions). */
export function getSkippedSections(minSessions = 5): string[] {
  const b = getBehaviorSignals();
  if (b.totalSessionsTracked < minSessions) return [];
  const ALL_SECTIONS = [
    "concept", "thinking", "visual", "steps", "mistakes",
    "examTip", "memory", "example", "practice", "summary",
  ];
  return ALL_SECTIONS.filter((s) => {
    const sig = b.sectionSignals[s];
    return !sig || sig.totalOpens === 0;
  });
}

/** Topics where the student switched depth levels — signals level mismatch. */
export function getLevelMismatchTopics(): string[] {
  return getBehaviorSignals().depthSwitchTopics;
}

/** Whether this student is a "practice opener" — a strong predictor of improvement. */
export function isPracticeOriented(): boolean {
  return getBehaviorSignals().practiceAttemptRate >= 0.5;
}
