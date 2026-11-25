import type { Subject } from "@/data/subjects";
import type { SubjectStats } from "@/hooks/useProgress";
import type { ChapterCompletion } from "@/hooks/useChapterStats";

export interface ReportCardSubjectSource {
  subject: Subject;
  stats: SubjectStats;
  chapters: ChapterCompletion[];
}

export interface ReportCardTopic {
  subject: Subject;
  topic: string;
  gradedAnswers: number;
  accuracy: number;
}

export interface ReportCardMetrics {
  questionsPractised: number;
  activeQuestions: number;
  topicsCovered: number;
  activeTopics: number;
  gradedAnswers: number;
  gradedCorrect: number;
  gradedAccuracy: number | null;
  subjects: Array<{
    subject: Subject;
    questionsPractised: number;
    activeQuestions: number;
    topicsCovered: number;
    activeTopics: number;
    gradedAnswers: number;
    gradedCorrect: number;
    gradedAccuracy: number | null;
  }>;
  strengths: ReportCardTopic[];
  weakAreas: ReportCardTopic[];
}

export function deriveReportCardMetrics(sources: ReportCardSubjectSource[]): ReportCardMetrics {
  const subjects = sources.map(({ subject, stats, chapters }) => {
    const activeTopics = chapters.flatMap((chapter) =>
      chapter.topics.filter((topic) => topic.totalQuestions > 0),
    );
    const gradedAccuracy = stats.totalSolved > 0 ? stats.accuracy : null;
    return {
      subject,
      questionsPractised: chapters.reduce((sum, chapter) => sum + chapter.attempted, 0),
      activeQuestions: chapters.reduce((sum, chapter) => sum + chapter.totalQuestions, 0),
      topicsCovered: activeTopics.filter((topic) => topic.attempted > 0).length,
      activeTopics: activeTopics.length,
      gradedAnswers: stats.totalSolved,
      gradedCorrect: stats.totalCorrect,
      gradedAccuracy,
    };
  });

  const gradedTopics = sources.flatMap(({ subject, stats }) =>
    stats.topicStats
      .filter((topic) => topic.solved > 0)
      .map((topic) => ({ subject, topic })),
  );

  return {
    questionsPractised: subjects.reduce((sum, subject) => sum + subject.questionsPractised, 0),
    activeQuestions: subjects.reduce((sum, subject) => sum + subject.activeQuestions, 0),
    topicsCovered: subjects.reduce((sum, subject) => sum + subject.topicsCovered, 0),
    activeTopics: subjects.reduce((sum, subject) => sum + subject.activeTopics, 0),
    gradedAnswers: subjects.reduce((sum, subject) => sum + subject.gradedAnswers, 0),
    gradedCorrect: subjects.reduce((sum, subject) => sum + subject.gradedCorrect, 0),
    gradedAccuracy: subjects.some((subject) => subject.gradedAnswers > 0)
      ? Math.round(
          (subjects.reduce((sum, subject) => sum + subject.gradedCorrect, 0) /
            subjects.reduce((sum, subject) => sum + subject.gradedAnswers, 0)) *
            100,
        )
      : null,
    subjects,
    strengths: gradedTopics
      .filter(({ topic }) => topic.solved >= 3 && topic.accuracy >= 80)
      .map(({ subject, topic }) => ({
        subject,
        topic: topic.topic,
        gradedAnswers: topic.solved,
        accuracy: topic.accuracy,
      })),
    weakAreas: gradedTopics
      .filter(({ topic }) => topic.accuracy < 60)
      .map(({ subject, topic }) => ({
        subject,
        topic: topic.topic,
        gradedAnswers: topic.solved,
        accuracy: topic.accuracy,
      })),
  };
}
