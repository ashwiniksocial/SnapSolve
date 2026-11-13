/**
 * useDailyMission
 *
 * Generates a personalised 3-task daily mission from the student's real data:
 *   Task 1 — PRACTICE   : topic from adaptive cache / weak topics / subject default
 *   Task 2 — REVISION   : due spaced-repetition item or recent struggle topic
 *   Task 3 — CHALLENGE  : weakest topic by accuracy, or general weak-topic drill
 *
 * Mission is generated once per day and cached in a board/class-scoped store.
 * Completion (checklist) is also stored there and resets at midnight.
 *
 * Self-contained: reads localStorage directly. No hook composition needed.
 */

import { useState, useCallback, useEffect } from "react";
import { unwrapRevisionItems } from "@/services/revisionStorage";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import { useProfile } from "@/hooks/useProfile";

// ─── Storage key ──────────────────────────────────────────────────────────────
const MISSION_PREFIX = "studyai-mission-v2";
const PROGRESS_PREFIX = "studyai-progress-v3";
const REVISION_PREFIX = "studyai-revision-v2";
const ADAPTIVE_PREFIX = "studyai-adaptive-v2";

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

function safeRead<T>(key: string | null, fallback: T): T {
  if (!key) return fallback;
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

function buildTasks(progressKey: string | null, revisionKey: string | null, adaptiveKey: string | null): MissionTask[] {
  const progress = safeRead<ProgressStore>(progressKey, {});
  const revision = unwrapRevisionItems<RevItem>(
    safeRead<unknown>(revisionKey, {}),
  );
  const adaptive = safeRead<AdaptiveCache | null>(adaptiveKey, null);
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

function loadMission(
  missionKey: string | null,
  progressKey: string | null,
  revisionKey: string | null,
  adaptiveKey: string | null,
): DailyMission {
  const stored = safeRead<DailyMission | null>(missionKey, null);
  if (stored && stored.date === today()) return stored;

  // New day — generate fresh tasks
  const mission: DailyMission = {
    date: today(),
    tasks: buildTasks(progressKey, revisionKey, adaptiveKey),
    doneIds: [],
  };
  if (missionKey) localStorage.setItem(missionKey, JSON.stringify(mission));
  return mission;
}

function saveMission(missionKey: string | null, m: DailyMission): void {
  if (missionKey) localStorage.setItem(missionKey, JSON.stringify(m));
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDailyMission(): UseDailyMissionReturn {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, profile.classLevel);
  const missionKey = scopedStorageKey(MISSION_PREFIX, context);
  const progressKey = scopedStorageKey(PROGRESS_PREFIX, context);
  const revisionKey = scopedStorageKey(REVISION_PREFIX, context);
  const adaptiveKey = scopedStorageKey(ADAPTIVE_PREFIX, context);
  const load = () => loadMission(missionKey, progressKey, revisionKey, adaptiveKey);
  const [stored, setStored] = useState(() => ({ key: missionKey, mission: load() }));

  useEffect(() => {
    setStored({ key: missionKey, mission: load() });
  }, [missionKey, progressKey, revisionKey, adaptiveKey]);

  const mission = stored.key === missionKey ? stored.mission : load();

  const toggleDone = useCallback((id: string) => {
    setStored((prev) => {
      const current = prev.key === missionKey ? prev.mission : load();
      const already = current.doneIds.includes(id);
      const next: DailyMission = {
        ...current,
        doneIds: already
          ? current.doneIds.filter((d) => d !== id)
          : [...current.doneIds, id],
      };
      saveMission(missionKey, next);
      return { key: missionKey, mission: next };
    });
  }, [missionKey, progressKey, revisionKey, adaptiveKey]);

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
