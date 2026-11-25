import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { normalizeBoardId } from "@/data/questions/academicContext";
import { useChapterStats } from "@/hooks/useChapterStats";
import { useProgress } from "@/hooks/useProgress";
import { useProfile } from "@/hooks/useProfile";
import { useRevisionPlanner } from "@/hooks/useRevisionPlanner";
import { readProfile } from "@/services/studentModel/syncManager";
import { deriveImprovementSteps, deriveReportCardMetrics } from "@/services/reportCardMetrics";
import ReportCard from "@/components/progress/ReportCard";
import { preloadQBank } from "@/services/questionService";

function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function Progress() {
  const { profile } = useProfile();
  const classNum = profile.classLevel ?? 9;
  const boardId = normalizeBoardId(profile.board);
  const [bankReady, setBankReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    setBankReady(false);
    preloadQBank(classNum)
      .then(() => {
        if (mounted) setBankReady(true);
      })
      .catch(() => {
        if (mounted) setBankReady(false);
      });
    return () => {
      mounted = false;
    };
  }, [classNum]);

  const { getSubjectStats } = useProgress(classNum);
  const mathChapters = useChapterStats("Mathematics", classNum, bankReady, boardId ?? undefined);
  const scienceChapters = useChapterStats("Science", classNum, bankReady, boardId ?? undefined);
  const itChapters = useChapterStats("Information Technology", classNum, bankReady, boardId ?? undefined);
  const subjectSources = [
    { subject: "Mathematics" as const, stats: getSubjectStats("Mathematics"), chapters: mathChapters },
    { subject: "Science" as const, stats: getSubjectStats("Science"), chapters: scienceChapters },
    { subject: "Information Technology" as const, stats: getSubjectStats("Information Technology"), chapters: itChapters },
  ];
  const metrics = useMemo(
    () => deriveReportCardMetrics(subjectSources),
    [getSubjectStats, mathChapters, scienceChapters, itChapters],
  );

  const { getDueItems, getUpcomingSchedule } = useRevisionPlanner(classNum);
  const revisionDue = getDueItems();
  const today = toDateKey(new Date());
  const nextWeek = new Date(`${today}T12:00:00`);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const upcomingRevisions = getUpcomingSchedule()
    .filter(({ date }) => date > today && date <= toDateKey(nextWeek));
  const upcomingCount = upcomingRevisions.reduce((sum, day) => sum + day.items.length, 0);
  const trackedStudyTimeMs = useMemo(() => {
    const duration = readProfile()?.totalStudyTimeMs;
    return typeof duration === "number" && Number.isFinite(duration) ? Math.max(0, duration) : 0;
  }, []);
  const improvementSteps = deriveImprovementSteps(
    metrics,
    revisionDue.length,
    upcomingCount,
    trackedStudyTimeMs,
  );
  const hasLearningEvidence =
    metrics.questionsPractised > 0 ||
    metrics.gradedAnswers > 0 ||
    revisionDue.length > 0 ||
    upcomingCount > 0 ||
    trackedStudyTimeMs > 0;

  return (
    <main className="min-h-[100dvh] bg-[#f5f4ef] pb-24 text-[#26362e]">
      <header className="border-b border-[#e3e4dc] bg-[#f9f8f3] px-5 pb-5 pt-8">
        <div className="mx-auto max-w-lg">
          <Link
            href="/"
            data-testid="link-progress-home"
            className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#718074] hover:text-[#344b40]"
          >
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            Home
          </Link>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718174]">
                Class {classNum} · Learning record
              </p>
              <h1 className="mt-1 font-serif text-[30px] font-semibold leading-tight tracking-[-0.04em]">
                Your Report Card
              </h1>
              <p className="mt-1 text-xs leading-relaxed text-[#718074]">
                A clear summary and next steps from saved learning activity.
              </p>
            </div>
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-[#d8e3d7] text-[#42634f]">
              <GraduationCap aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-4 py-5 sm:px-5 sm:py-6">
        <ReportCard
          bankReady={bankReady}
          metrics={metrics}
          trackedStudyTimeMs={trackedStudyTimeMs}
          improvementSteps={improvementSteps}
          hasLearningEvidence={hasLearningEvidence}
        />
      </div>
    </main>
  );
}
