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

export interface UncoveredReportCardTopic {
  subject: Subject;
  topic: string;
  activeQuestions: number;
}

export interface ImprovementStep {
  id: string;
  title: string;
  evidence: string;
  action: string;
  href: "/practice" | "/revision";
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
  improvementTopics: ReportCardTopic[];
  uncoveredTopics: UncoveredReportCardTopic[];
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
  const improvementTopics = gradedTopics
    .filter(({ topic }) => topic.accuracy < 80)
    .map(({ subject, topic }) => ({
      subject,
      topic: topic.topic,
      gradedAnswers: topic.solved,
      accuracy: topic.accuracy,
    }))
    .sort((left, right) => left.accuracy - right.accuracy || right.gradedAnswers - left.gradedAnswers);
  const uncoveredTopics = sources.flatMap(({ subject, chapters }) =>
    chapters.flatMap((chapter) =>
      chapter.topics
        .filter((topic) => topic.totalQuestions > 0 && topic.attempted === 0)
        .map((topic) => ({
          subject,
          topic: topic.topicName,
          activeQuestions: topic.totalQuestions,
        })),
    ),
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
    improvementTopics,
    uncoveredTopics,
  };
}

export function deriveImprovementSteps(
  metrics: ReportCardMetrics,
  dueReviews: number,
  upcomingReviews: number,
  trackedStudyTimeMs = 0,
): ImprovementStep[] {
  const hasLearningEvidence =
    metrics.questionsPractised > 0 ||
    metrics.gradedAnswers > 0 ||
    dueReviews > 0 ||
    upcomingReviews > 0 ||
    trackedStudyTimeMs > 0;
  if (!hasLearningEvidence) return [];

  const steps: ImprovementStep[] = [];
  const addedTopics = new Set<string>();

  for (const topic of metrics.improvementTopics) {
    const topicKey = `${topic.subject}:${topic.topic}`;
    if (addedTopics.has(topicKey)) continue;
    addedTopics.add(topicKey);
    steps.push({
      id: `graded-${topicKey}`,
      title: `Practise ${topic.topic} again`,
      evidence: `${topic.accuracy}% across ${topic.gradedAnswers} graded ${topic.gradedAnswers === 1 ? "answer" : "answers"}.`,
      action: "Open Practice",
      href: "/practice",
    });
    if (steps.length === 2) break;
  }

  if (dueReviews > 0 || upcomingReviews > 0) {
    steps.push({
      id: "scheduled-reviews",
      title: dueReviews > 0 ? "Complete due reviews" : "Prepare for scheduled reviews",
      evidence: [
        dueReviews > 0 ? `${dueReviews} due now` : "",
        upcomingReviews > 0 ? `${upcomingReviews} scheduled in the next 7 days` : "",
      ].filter(Boolean).join(" · "),
      action: "Open Revision",
      href: "/revision",
    });
  }

  for (const nextTopic of metrics.uncoveredTopics) {
    if (steps.length >= 3) break;
    const topicKey = `${nextTopic.subject}:${nextTopic.topic}`;
    if (addedTopics.has(topicKey)) continue;
    addedTopics.add(topicKey);
    steps.push({
      id: `uncovered-${topicKey}`,
      title: `Try ${nextTopic.topic}`,
      evidence: `No practice is recorded yet; ${nextTopic.activeQuestions} active bank ${nextTopic.activeQuestions === 1 ? "question" : "questions"} are available.`,
      action: "Open Practice",
      href: "/practice",
    });
  }

  return steps.slice(0, 3);
}

export function formatTrackedStudyTime(durationMs: number): string {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return "No time logged";
  const totalMinutes = Math.floor(durationMs / 60_000);
  if (totalMinutes === 0) return "Under 1 min";
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes > 0 ? `${hours} hr ${minutes} min` : `${hours} hr`;
}
