/**
 * useDailyMission
 *
 * Generates a personalised 3-task daily mission from the student's real data:
 *   Task 1 — PRACTICE   : topic from adaptive cache / weak topics / subject default
 *   Task 2 — REVISION   : due spaced-repetition item or recent struggle topic
 *   Task 3 — CHALLENGE  : weakest topic by accuracy, or general weak-topic drill
 *
 * Mission is generated once per day and cached in `studyai-mission-v1`.
 * Completion (checklist) is also stored there and resets at midnight.
 *
 * Self-contained: reads localStorage directly. No hook composition needed.
 */

import { useState, useCallback } from "react";

// ─── Storage key ──────────────────────────────────────────────────────────────
const KEY = "studyai-mission-v1";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MissionTaskType = "practice" | "revision" | "challenge";

export interface MissionTask {
  id:           string;
  type:         MissionTaskType;
  title:        string;         // "Solve 5 Algebra questions"
  subtitle:     string;         // supporting detail / tip
  subject:      string;
  topic:        string;
  count:        number;         // target questions / items
  estimateMins: number;         // time estimate for this task
  icon:         string;
}

export interface DailyMission {
  date:     string;
  tasks:    MissionTask[];
  doneIds:  string[];
}

export interface UseDailyMissionReturn {
  tasks:        MissionTask[];
  doneIds:      string[];
  totalMins:    number;
  completedCount: number;
  allDone:      boolean;
  toggleDone:   (id: string) => void;
}

// ─── localStorage shapes (mirrors sibling hooks) ──────────────────────────────

interface ProgressRec { solved: number; correct: number }
type ProgressStore   = Record<string, Record<string, ProgressRec>>;
interface RevItem    { subject: string; topic: string; interval: number; dueDate?: string; mastered?: boolean }
type RevisionStore   = Record<string, RevItem>;
interface AdaptiveRec { subject: string; topic: string; chapter: string; recommendedDifficulty: string; reason: string }
interface AdaptiveCache { date: string; recommendations: AdaptiveRec[] }

// ─── Helpers ─────────────────────────────────────────────────────────────────

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function safeRead<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function makeid(prefix: string): string {
  return `${prefix}-${today()}`;
}

// ─── Mission builder ──────────────────────────────────────────────────────────

function buildTasks(): MissionTask[] {
  const progress = safeRead<ProgressStore>("studyai-progress-v2", {});
  const revision = safeRead<RevisionStore>("studyai-revision-v1", {});
  const adaptive = safeRead<AdaptiveCache | null>("studyai-adaptive-v1", null);
  const todayStr = today();

  // ── Flatten topic stats ──────────────────────────────────────────────────
  interface TS { subject: string; topic: string; accuracy: number; solved: number }
  const topicStats: TS[] = [];
  for (const [subj, topics] of Object.entries(progress)) {
    for (const [topic, rec] of Object.entries(topics)) {
      if (rec.solved > 0) {
        topicStats.push({
          subject: subj,
          topic,
          accuracy: Math.round((rec.correct / rec.solved) * 100),
          solved: rec.solved,
        });
      }
    }
  }

  const weakTopics = [...topicStats].sort((a, b) => a.accuracy - b.accuracy).filter(t => t.accuracy < 70);
  const dueRevItems = Object.values(revision).filter(r => {
    if (r.mastered) return false;
    if (r.dueDate) return r.dueDate <= todayStr;
    return r.interval <= 1;
  });

  // ── Task 1 — PRACTICE ────────────────────────────────────────────────────
  let practiceTask: MissionTask;
  const adaptRec   = adaptive?.recommendations?.[0];
  const practiceRef = adaptRec
    ? { subject: adaptRec.subject, topic: adaptRec.topic, tier: adaptRec.recommendedDifficulty }
    : weakTopics[0]
    ? { subject: weakTopics[0].subject, topic: weakTopics[0].topic, tier: "Medium" }
    : null;

  const practiceCount = practiceRef?.tier === "Easy" ? 3
    : practiceRef?.tier === "Hard" || practiceRef?.tier === "Challenge" ? 7
    : 5;

  if (practiceRef) {
    practiceTask = {
      id:           makeid("practice"),
      type:         "practice",
      title:        `Solve ${practiceCount} ${practiceRef.topic} questions`,
      subtitle:     adaptRec?.reason ?? `Build confidence in ${practiceRef.topic}`,
      subject:      practiceRef.subject,
      topic:        practiceRef.topic,
      count:        practiceCount,
      estimateMins: practiceCount * 2,
      icon:         "✎",
    };
  } else {
    practiceTask = {
      id:           makeid("practice"),
      type:         "practice",
      title:        "Solve 5 Algebra questions",
      subtitle:     "Build confidence in Number Systems",
      subject:      "Mathematics",
      topic:        "Algebra",
      count:        5,
      estimateMins: 10,
      icon:         "✎",
    };
  }

  // ── Task 2 — REVISION ────────────────────────────────────────────────────
  let revisionTask: MissionTask;
  const dueItem = dueRevItems[0];

  if (dueItem) {
    revisionTask = {
      id:           makeid("revision"),
      type:         "revision",
      title:        `Revise ${dueItem.topic}`,
      subtitle:     `Due for spaced repetition · ${dueItem.subject}`,
      subject:      dueItem.subject,
      topic:        dueItem.topic,
      count:        1,
      estimateMins: 5,
      icon:         "↺",
    };
  } else if (weakTopics[1]) {
    const t = weakTopics[1];
    revisionTask = {
      id:           makeid("revision"),
      type:         "revision",
      title:        `Revise ${t.topic}`,
      subtitle:     `Accuracy is ${t.accuracy}% — revisit key concepts`,
      subject:      t.subject,
      topic:        t.topic,
      count:        1,
      estimateMins: 5,
      icon:         "↺",
    };
  } else {
    revisionTask = {
      id:           makeid("revision"),
      type:         "revision",
      title:        "Revise Polynomials",
      subtitle:     "Reinforce your understanding with key formulae",
      subject:      "Mathematics",
      topic:        "Polynomials",
      count:        1,
      estimateMins: 5,
      icon:         "↺",
    };
  }

  // ── Task 3 — CHALLENGE (weakest topic) ──────────────────────────────────
  let challengeTask: MissionTask;
  const weakest    = weakTopics.find(t => t.topic !== practiceTask.topic && t.topic !== revisionTask.topic);
  const challengeRef = weakest ?? adaptRec ? null : null;

  if (weakest) {
    challengeTask = {
      id:           makeid("challenge"),
      type:         "challenge",
      title:        `Practice ${weakest.topic}`,
      subtitle:     `Only ${weakest.accuracy}% accuracy — your biggest gain area`,
      subject:      weakest.subject,
      topic:        weakest.topic,
      count:        3,
      estimateMins: 8,
      icon:         "⚡",
    };
  } else {
    challengeTask = {
      id:           makeid("challenge"),
      type:         "challenge",
      title:        "Practice weak topics",
      subtitle:     "Tackle your most challenging areas",
      subject:      "Mathematics",
      topic:        "General",
      count:        3,
      estimateMins: 8,
      icon:         "⚡",
    };
  }

  return [practiceTask, revisionTask, challengeTask];
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

function loadMission(): DailyMission {
  const stored = safeRead<DailyMission | null>(KEY, null);
  if (stored && stored.date === today()) return stored;

  // New day — generate fresh tasks
  const mission: DailyMission = { date: today(), tasks: buildTasks(), doneIds: [] };
  localStorage.setItem(KEY, JSON.stringify(mission));
  return mission;
}

function saveMission(m: DailyMission): void {
  localStorage.setItem(KEY, JSON.stringify(m));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDailyMission(): UseDailyMissionReturn {
  const [mission, setMission] = useState<DailyMission>(loadMission);

  const toggleDone = useCallback((id: string) => {
    setMission((prev) => {
      const already = prev.doneIds.includes(id);
      const next: DailyMission = {
        ...prev,
        doneIds: already
          ? prev.doneIds.filter((d) => d !== id)
          : [...prev.doneIds, id],
      };
      saveMission(next);
      return next;
    });
  }, []);

  const completedCount = mission.doneIds.length;
  const totalMins      = mission.tasks.reduce((s, t) => s + t.estimateMins, 0);
  const allDone        = completedCount >= mission.tasks.length;

  return {
    tasks:    mission.tasks,
    doneIds:  mission.doneIds,
    totalMins,
    completedCount,
    allDone,
    toggleDone,
  };
}
