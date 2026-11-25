import { useState, useCallback, useMemo, useEffect } from "react";
import type { Subject } from "@/data/subjects";
import { makeAcademicContext, scopedStorageKey } from "@/data/questions/academicContext";
import { BETA_SCIENCE_DOMAINS } from "@/data/questions/studentFacingSubject";
import { useProfile } from "@/hooks/useProfile";

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

const KEY_PREFIX = "studyai-progress-v3";

function emptyProgress(): ProgressData {
  return { Science: {}, Physics: {}, Chemistry: {}, Mathematics: {}, Biology: {}, Economics: {}, "Computer Science": {}, "Information Technology": {} };
}

function load(key: string | null): ProgressData {
  if (!key) return emptyProgress();
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {}
  return emptyProgress();
}

function persist(key: string | null, data: ProgressData) {
  if (key) localStorage.setItem(key, JSON.stringify(data));
}

function sourceSubjectsFor(subject: Subject): Subject[] {
  return subject === "Science"
    ? ["Science", ...BETA_SCIENCE_DOMAINS]
    : [subject];
}

function mergedTopicRecord(
  progress: ProgressData,
  subject: Subject,
  topicName: string,
): TopicRecord | null {
  let merged: TopicRecord | null = null;
  for (const sourceSubject of sourceSubjectsFor(subject)) {
    const record = progress[sourceSubject]?.[topicName];
    if (!record) continue;
    const previous: TopicRecord = merged ?? { solved: 0, correct: 0, attempted: [] };
    const attempted: string[] = [...new Set([
      ...(previous.attempted ?? []),
      ...(record.attempted ?? []),
    ])];
    merged = {
      solved: previous.solved + (record.solved ?? 0),
      correct: previous.correct + (record.correct ?? 0),
      attempted,
    };
  }
  return merged;
}

export function getSubjectStatsFromProgress(
  progress: ProgressData,
  subject: Subject,
): SubjectStats {
  const topics = new Set<string>();
  for (const sourceSubject of sourceSubjectsFor(subject)) {
    for (const topic of Object.keys(progress[sourceSubject] ?? {})) topics.add(topic);
  }

  const topicStats: TopicStat[] = [...topics].map((topic) => {
    const record = mergedTopicRecord(progress, subject, topic) ?? {
      solved: 0,
      correct: 0,
      attempted: [],
    };
    const accuracy = record.solved > 0
      ? Math.round((record.correct / record.solved) * 100)
      : 0;
    return {
      topic,
      solved: record.solved,
      correct: record.correct,
      accuracy,
      masteryPct: accuracy,
      attempted: record.attempted ?? [],
    };
  });

  const totalSolved = topicStats.reduce((sum, topic) => sum + topic.solved, 0);
  const totalCorrect = topicStats.reduce((sum, topic) => sum + topic.correct, 0);
  const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
  const weakTopics = topicStats
    .filter((topic) => topic.solved > 0 && topic.accuracy < 60)
    .sort((left, right) => left.accuracy - right.accuracy)
    .map((topic) => topic.topic);
  const strongTopics = topicStats
    .filter((topic) => topic.solved >= 3 && topic.accuracy >= 80)
    .sort((left, right) => right.accuracy - left.accuracy)
    .map((topic) => topic.topic);
  const recommendations: Recommendation[] = weakTopics.map((topic) => {
    const stat = topicStats.find((candidate) => candidate.topic === topic)!;
    return {
      topic,
      message: stat.accuracy < 40
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
}

/** Pure unique-coverage transition used by the Practice outcome workflow. */
export function recordUniquePractice(
  previous: ProgressData,
  subject: Subject,
  topic: string,
  questionId: string,
): ProgressData {
  const subjectProgress = { ...(previous[subject] ?? {}) };
  const current = subjectProgress[topic] ?? { solved: 0, correct: 0, attempted: [] };
  const attempted = current.attempted ?? [];

  if (attempted.includes(questionId)) return previous;

  return {
    ...previous,
    [subject]: {
      ...subjectProgress,
      [topic]: {
        ...current,
        attempted: [...attempted, questionId],
      },
    },
  };
}

export function recordSolvedPractice(
  previous: ProgressData,
  subject: Subject,
  topic: string,
  correct: boolean,
  questionId?: string,
): ProgressData {
  const subjectProgress = { ...(previous[subject] ?? {}) };
  const current = subjectProgress[topic] ?? { solved: 0, correct: 0, attempted: [] };
  const attempted = current.attempted ?? [];
  const alreadyAttempted = questionId ? attempted.includes(questionId) : false;

  return {
    ...previous,
    [subject]: {
      ...subjectProgress,
      [topic]: {
        ...current,
        solved: current.solved + 1,
        correct: current.correct + (correct ? 1 : 0),
        attempted: questionId && !alreadyAttempted ? [...attempted, questionId] : attempted,
      },
    },
  };
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

export function useProgress(classNumOverride?: number) {
  const { profile } = useProfile();
  const context = makeAcademicContext(profile.board, classNumOverride ?? profile.classLevel);
  const scopeKey = scopedStorageKey(KEY_PREFIX, context);
  const [stored, setStored] = useState(() => ({ key: scopeKey, data: load(scopeKey) }));

  useEffect(() => {
    setStored({ key: scopeKey, data: load(scopeKey) });
  }, [scopeKey]);

  const progress = stored.key === scopeKey ? stored.data : emptyProgress();

  // Record a single question attempt
  const recordSolve = useCallback(
    (subject: Subject, topic: string, correct: boolean, questionId?: string) => {
      if (!scopeKey) return;
      setStored((storedPrev) => {
        const prev = storedPrev.key === scopeKey ? storedPrev.data : load(scopeKey);
        const next = recordSolvedPractice(prev, subject, topic, correct, questionId);
        persist(scopeKey, next);
        return { key: scopeKey, data: next };
      });
    },
    [scopeKey]
  );

  /**
   * Records a genuine practice outcome without treating a self-assessment as a
   * correct/incorrect answer. The question ID remains deduplicated within its
   * existing topic record, so coverage never increases on a repeat action.
   */
  const recordPractice = useCallback(
    (subject: Subject, topic: string, questionId: string) => {
      if (!scopeKey) return;
      setStored((storedPrev) => {
        const prev = storedPrev.key === scopeKey ? storedPrev.data : load(scopeKey);
        const next = recordUniquePractice(prev, subject, topic, questionId);
        if (next === prev) return storedPrev;
        persist(scopeKey, next);
        return { key: scopeKey, data: next };
      });
    },
    [scopeKey],
  );

  // Full stats for a subject
  const getSubjectStats = useCallback(
    (subject: Subject): SubjectStats => getSubjectStatsFromProgress(progress, subject),
    [progress]
  );

  // Per-topic quick lookup (single call, no full stats computation)
  const getTopicStat = useCallback(
    (subject: Subject, topic: string): TopicStat | null => {
      const rec = mergedTopicRecord(progress, subject, topic);
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
    if (!scopeKey) return;
    const empty = emptyProgress();
    persist(scopeKey, empty);
    setStored({ key: scopeKey, data: empty });
  }, [scopeKey]);

  return {
    progress,
    recordSolve,
    recordPractice,
    getSubjectStats,
    getTopicStat,
    totalSolved,
    resetProgress,
  };
}
