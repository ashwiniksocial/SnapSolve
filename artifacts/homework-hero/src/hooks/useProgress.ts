import { useState, useCallback } from "react";
import type { Subject } from "@/data/subjects";

interface TopicRecord {
  solved: number;
  correct: number;
}

type SubjectRecord = Record<string, TopicRecord>;
type ProgressData = Record<Subject, SubjectRecord>;

const KEY = "studyai-progress";

function load(): ProgressData {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressData;
  } catch {}
  return {
    Physics: {},
    Chemistry: {},
    Mathematics: {},
  };
}

function save(data: ProgressData) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressData>(load);

  const recordSolve = useCallback((subject: Subject, topic: string, correct = true) => {
    setProgress((prev) => {
      const subj = { ...(prev[subject] || {}) };
      const current = subj[topic] || { solved: 0, correct: 0 };
      subj[topic] = { solved: current.solved + 1, correct: current.correct + (correct ? 1 : 0) };
      const next = { ...prev, [subject]: subj };
      save(next);
      return next;
    });
  }, []);

  const getSubjectStats = useCallback(
    (subject: Subject) => {
      const data = progress[subject] || {};
      const topics = Object.entries(data);
      const totalSolved = topics.reduce((s, [, v]) => s + v.solved, 0);
      const totalCorrect = topics.reduce((s, [, v]) => s + v.correct, 0);
      const accuracy = totalSolved > 0 ? Math.round((totalCorrect / totalSolved) * 100) : 0;
      const weakTopics = topics
        .filter(([, v]) => v.solved > 0 && v.correct / v.solved < 0.6)
        .map(([topic]) => topic);
      return { totalSolved, accuracy, weakTopics, topics };
    },
    [progress]
  );

  const totalSolved = Object.values(progress).reduce((s, subj) => {
    return s + Object.values(subj).reduce((ss, v) => ss + v.solved, 0);
  }, 0);

  return { progress, recordSolve, getSubjectStats, totalSolved };
}
