import { useState, useCallback, useMemo } from "react";
import type { Subject } from "@/data/subjects";

// ─── Data shapes ──────────────────────────────────────────────────────────────

interface TopicRecord {
  solved: number;
  correct: number;
  /** ids of questions already attempted, to avoid infinite re-queuing */
  attempted: string[];
}

type SubjectRecord = Record<string, TopicRecord>;
type ProgressData  = Record<Subject, SubjectRecord>;

// ─── localStorage ─────────────────────────────────────────────────────────────

const KEY = "studyai-progress-v2";

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {}
  return { Physics: {}, Chemistry: {}, Mathematics: {} };
}

function persist(data: ProgressData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

// ─── Derived statistics types ─────────────────────────────────────────────────

export interface TopicStat {
  topic: string;
  solved: number;
  correct: number;
  accuracy: number;        // 0–100
  masteryPct: number;      // same as accuracy; alias for UI
  attempted: string[];
}

export interface Recommendation {
  topic: string;
  message: string;
  priority: "high" | "medium";
}

export interface SubjectStats {
  totalSolved: number;
  totalCorrect: number;
  accuracy: number;             // 0–100
  topicStats: TopicStat[];
  weakTopics: string[];          // accuracy < 60 %
  strongTopics: string[];        // accuracy ≥ 80 %, solved ≥ 3
  recommendations: Recommendation[];
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(load);

  // Record a single question attempt
  const recordSolve = useCallback(
    (subject: Subject, topic: string, correct: boolean, questionId?: string) => {
      setProgress((prev) => {
        const subj    = { ...(prev[subject] ?? {}) };
        const current = subj[topic] ?? { solved: 0, correct: 0, attempted: [] };

        const alreadyAttempted = questionId
          ? current.attempted.includes(questionId)
          : false;

        subj[topic] = {
          solved:    current.solved + 1,
          correct:   current.correct + (correct ? 1 : 0),
          attempted: questionId && !alreadyAttempted
            ? [...current.attempted, questionId]
            : current.attempted,
        };

        const next = { ...prev, [subject]: subj };
        persist(next);
        return next;
      });
    },
    []
  );

  // Full stats for a subject
  const getSubjectStats = useCallback(
    (subject: Subject): SubjectStats => {
      const data   = progress[subject] ?? {};
      const entries = Object.entries(data);

      const topicStats: TopicStat[] = entries.map(([topic, rec]) => {
        const accuracy = rec.solved > 0
          ? Math.round((rec.correct / rec.solved) * 100)
          : 0;
        return {
          topic,
          solved:     rec.solved,
          correct:    rec.correct,
          accuracy,
          masteryPct: accuracy,
          attempted:  rec.attempted ?? [],
        };
      });

      const totalSolved  = entries.reduce((s, [, v]) => s + v.solved,  0);
      const totalCorrect = entries.reduce((s, [, v]) => s + v.correct, 0);
      const accuracy     = totalSolved > 0
        ? Math.round((totalCorrect / totalSolved) * 100)
        : 0;

      // Weak = solved at least once AND accuracy < 60 %
      const weakTopics = topicStats
        .filter((t) => t.solved > 0 && t.accuracy < 60)
        .sort((a, b) => a.accuracy - b.accuracy)
        .map((t) => t.topic);

      // Strong = solved ≥ 3 AND accuracy ≥ 80 %
      const strongTopics = topicStats
        .filter((t) => t.solved >= 3 && t.accuracy >= 80)
        .sort((a, b) => b.accuracy - a.accuracy)
        .map((t) => t.topic);

      // Recommendations: one per weak topic + a general one if nothing solved
      const recommendations: Recommendation[] = weakTopics.map((topic) => {
        const stat = topicStats.find((t) => t.topic === topic)!;
        return {
          topic,
          message:
            stat.accuracy < 40
              ? `Your accuracy in "${topic}" is ${stat.accuracy}%. Revisit the theory and work through more examples.`
              : `Practice more questions from "${topic}" to push above 60%.`,
          priority: stat.accuracy < 40 ? "high" : "medium",
        };
      });

      return {
        totalSolved,
        totalCorrect,
        accuracy,
        topicStats,
        weakTopics,
        strongTopics,
        recommendations,
      };
    },
    [progress]
  );

  // Per-topic quick lookup (single call, no full stats computation)
  const getTopicStat = useCallback(
    (subject: Subject, topic: string): TopicStat | null => {
      const rec = progress[subject]?.[topic];
      if (!rec || rec.solved === 0) return null;
      const accuracy = Math.round((rec.correct / rec.solved) * 100);
      return {
        topic,
        solved:     rec.solved,
        correct:    rec.correct,
        accuracy,
        masteryPct: accuracy,
        attempted:  rec.attempted ?? [],
      };
    },
    [progress]
  );

  // Grand total across all subjects (for dashboard display)
  const totalSolved = useMemo(
    () =>
      Object.values(progress).reduce(
        (s, subj) => s + Object.values(subj).reduce((ss, v) => ss + v.solved, 0),
        0
      ),
    [progress]
  );

  // Reset all data (settings / debug)
  const resetProgress = useCallback(() => {
    const empty: ProgressData = { Physics: {}, Chemistry: {}, Mathematics: {} };
    persist(empty);
    setProgress(empty);
  }, []);

  return {
    progress,
    recordSolve,
    getSubjectStats,
    getTopicStat,
    totalSolved,
    resetProgress,
  };
}
