/**
 * Confidence Recovery — helps students recover from learned helplessness.
 *
 * Confidence loss patterns detected:
 *  - Rapid hint escalation (requests hint level 3+ within 30 s)
 *  - Giving up repeatedly ("I don't know", blank submissions)
 *  - Abandonment pattern (leaves solution in < 10 s)
 *  - Negative self-talk markers ("I'm bad at this", "I can't do this")
 *  - Avoidance: skips hard topics, only attempts easy ones
 *
 * Recovery strategies:
 *  - Success retrieval: remind the student of past successes on similar topics
 *  - Micro-wins: give an easier version of the problem they can definitely solve
 *  - Reframing: reframe the difficulty ("this is hard — it's supposed to feel hard at first")
 *  - Encouragement calibration: match encouragement to the struggle level
 *  - Progress revelation: show the student how far they've actually come
 *
 * Confidence trajectory is tracked over time.
 * Firestore path: students/{id}/confidenceProfile
 */

import { getAllMasteryEntries }  from "../studentModel/topicMastery";
import { getMilestones }         from "../studentModel/reflectionEngine";

const KEY = "studyai-v1-confidence-profile";

export type ConfidenceLevel = "high" | "good" | "shaky" | "low" | "helpless";

export type ConfidenceEvent =
  | "hint_escalation"     // jumped to hint 3+ quickly
  | "give_up"             // submitted blank or "I don't know"
  | "abandonment"         // left session early
  | "negative_self_talk"  // detected discouraging language
  | "avoidance"           // skipped a recommended topic
  | "win"                 // answered correctly without hints
  | "streak_win"          // multiple correct in a row
  | "milestone"           // achieved a mastery milestone
  | "improved_from_low";  // got one right after several wrong

export interface ConfidenceSnapshot {
  timestamp:  number;
  level:      ConfidenceLevel;
  score:      number;        // 0–100
  event:      ConfidenceEvent;
  topic:      string;
  subject:    string;
}

export interface ConfidenceProfile {
  currentScore:      number;      // 0–100
  currentLevel:      ConfidenceLevel;
  trajectory:        "rising" | "stable" | "falling";
  recentSnapshots:   ConfidenceSnapshot[];   // last 20

  // Risk signals
  giveUpCount:       number;
  abandonmentCount:  number;
  hintEscalations:   number;

  // Recovery resources
  successTopics:     string[];    // topics where student has proven mastery
  recentWins:        string[];    // last 3 "win" events as topic names
  longestWinStreak:  number;

  updatedAt: number;
}

// ── LIWC-lite: negative self-talk markers ──────────────────────────────────────
const NEGATIVE_MARKERS = [
  "i can't", "i can not", "i don't understand", "i'm bad", "i am bad",
  "i'm stupid", "i am stupid", "i'll never", "i will never", "too hard",
  "impossible", "i give up", "don't know", "no idea", "hopeless",
];

export function detectNegativeSelfTalk(text: string): boolean {
  const lower = text.toLowerCase();
  return NEGATIVE_MARKERS.some((m) => lower.includes(m));
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT: ConfidenceProfile = {
  currentScore: 60, currentLevel: "good",
  trajectory: "stable",
  recentSnapshots: [],
  giveUpCount: 0, abandonmentCount: 0, hintEscalations: 0,
  successTopics: [], recentWins: [],
  longestWinStreak: 0,
  updatedAt: Date.now(),
};

export function getConfidenceProfile(): ConfidenceProfile {
  return lsRead<ConfidenceProfile>(KEY, DEFAULT);
}

function scoreToLevel(score: number): ConfidenceLevel {
  if (score >= 80) return "high";
  if (score >= 60) return "good";
  if (score >= 40) return "shaky";
  if (score >= 20) return "low";
  return "helpless";
}

/** Record a confidence event and update the profile. */
export function recordConfidenceEvent(opts: {
  event:   ConfidenceEvent;
  topic:   string;
  subject: string;
}): ConfidenceProfile {
  const p = getConfidenceProfile();

  // Delta per event type
  const deltas: Record<ConfidenceEvent, number> = {
    hint_escalation:    -5,
    give_up:           -10,
    abandonment:        -8,
    negative_self_talk: -7,
    avoidance:          -3,
    win:               +8,
    streak_win:        +15,
    milestone:         +20,
    improved_from_low: +12,
  };

  p.currentScore = Math.min(100, Math.max(0, p.currentScore + (deltas[opts.event] ?? 0)));
  p.currentLevel = scoreToLevel(p.currentScore);

  const snap: ConfidenceSnapshot = {
    timestamp: Date.now(), level: p.currentLevel,
    score: p.currentScore, event: opts.event,
    topic: opts.topic, subject: opts.subject,
  };
  p.recentSnapshots = [...p.recentSnapshots.slice(-19), snap];

  // Update risk counters
  if (opts.event === "give_up")            p.giveUpCount++;
  if (opts.event === "abandonment")        p.abandonmentCount++;
  if (opts.event === "hint_escalation")    p.hintEscalations++;

  // Track wins
  if (opts.event === "win" || opts.event === "streak_win" || opts.event === "milestone") {
    p.recentWins = [...p.recentWins.slice(-2), opts.topic];
    if (!p.successTopics.includes(opts.topic)) p.successTopics = [...p.successTopics.slice(-9), opts.topic];
  }

  // Trajectory from last 5 snapshots
  if (p.recentSnapshots.length >= 5) {
    const last5 = p.recentSnapshots.slice(-5).map((s) => s.score);
    const delta  = last5[4] - last5[0];
    p.trajectory = delta >= 8 ? "rising" : delta <= -8 ? "falling" : "stable";
  }

  p.updatedAt = Date.now();
  lsWrite(p);
  return p;
}

// ── Recovery strategies ───────────────────────────────────────────────────────

export interface RecoveryMessage {
  type:    "reframe" | "success_retrieval" | "micro_win" | "progress_reveal" | "encouragement";
  message: string;
  action?: string;   // optional follow-up action for the tutor
}

/** Generate a confidence recovery message based on current profile. */
export function getRecoveryMessage(profile: ConfidenceProfile, currentTopic: string): RecoveryMessage {
  const level = profile.currentLevel;

  // Helpless: success retrieval + reframe
  if (level === "helpless" || level === "low") {
    const successTopic = profile.successTopics[profile.successTopics.length - 1];
    if (successTopic) {
      return {
        type: "success_retrieval",
        message: `Remember — you already mastered ${successTopic}. ${currentTopic} uses similar thinking. You've proven you can do this.`,
        action: "Show the student their past wins before asking the next question.",
      };
    }
    return {
      type: "reframe",
      message: `Struggling with ${currentTopic} right now is completely normal — even for students who end up doing really well in it. Difficulty is a sign you're working at the right level, not that you can't do it.`,
      action: "Lower the difficulty to the simplest possible entry point.",
    };
  }

  // Shaky: progress reveal
  if (level === "shaky") {
    const masteryEntries = getAllMasteryEntries().filter((e) => e.masteryScore >= 60);
    if (masteryEntries.length > 0) {
      return {
        type: "progress_reveal",
        message: `You've already built solid understanding in ${masteryEntries.length} topic${masteryEntries.length !== 1 ? "s" : ""}. ${currentTopic} is one more — and you've earned every point of mastery you have so far.`,
        action: "Before the next question, show the student their mastery progress chart.",
      };
    }
  }

  // Milestone just achieved
  const lastMilestone = getMilestones().slice(-1)[0];
  if (lastMilestone && Date.now() - lastMilestone.achievedAt < 5 * 60_000) {
    return {
      type: "encouragement",
      message: `You just hit a milestone: "${lastMilestone.description}". That took real effort. Carry that confidence into this next challenge.`,
    };
  }

  // Default encouragement
  return {
    type: "encouragement",
    message: `Every expert was once a beginner who struggled with exactly this. The fact that you're still here means you're building something real.`,
  };
}

/** Whether the student currently needs confidence intervention. */
export function needsConfidenceIntervention(): boolean {
  const p = getConfidenceProfile();
  return p.currentLevel === "helpless" || p.currentLevel === "low"
    || (p.giveUpCount >= 3 && p.trajectory === "falling");
}

/** Motivating "What you've achieved" summary for the UI. */
export function getMotivationSummary(): string {
  const p        = getConfidenceProfile();
  const mastered = getAllMasteryEntries().filter((e) => e.masteryScore >= 70).length;
  if (mastered === 0) return "Your journey is just beginning — every expert started where you are.";
  if (p.currentLevel === "high") return `You've mastered ${mastered} topic${mastered !== 1 ? "s" : ""} and your confidence is strong. Keep building.`;
  return `You've mastered ${mastered} topic${mastered !== 1 ? "s" : ""}. That took real work — trust the process.`;
}
