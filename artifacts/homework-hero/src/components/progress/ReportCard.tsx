import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, CalendarDays, Check, RotateCcw } from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import type { RevisionItem } from "@/hooks/useRevisionPlanner";
import TutorDashboard from "@/components/socratic/TutorDashboard";
import type { ReportCardMetrics } from "@/services/reportCardMetrics";

export interface ReportCardDay {
  date: string;
  label: string;
  completed: boolean;
}

export interface TutorProfileSummary {
  studyHours: number;
  learningVelocity: "fast" | "medium" | "slow";
  preferredDepth: "basic" | "standard" | "advanced";
  bestStudyTime: string;
  preferredSubject: string | null;
}

export interface TutorActivitySummary {
  sessions: number;
  questionsAsked: number;
}

interface Props {
  classNum: number;
  bankReady: boolean;
  metrics: ReportCardMetrics;
  practiceDays: ReportCardDay[];
  tutorProfile: TutorProfileSummary;
  tutorActivity: TutorActivitySummary;
  revisionDue: RevisionItem[];
  upcomingRevisions: Array<{ date: string; items: RevisionItem[] }>;
  upcomingCount: number;
}

const subjectMarks: Record<Subject, string> = {
  Mathematics: "M",
  Science: "S",
  Physics: "P",
  Chemistry: "C",
  Biology: "B",
  Economics: "E",
  "Computer Science": "CS",
  "Information Technology": "IT",
};

function Metric({
  label,
  value,
  detail,
  testId,
}: {
  label: string;
  value: string;
  detail: string;
  testId: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4" data-testid={testId}>
      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#79857a]">{label}</p>
      <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#365544]">{value}</p>
      <p className="mt-1 text-[10px] leading-relaxed text-[#818c82]">{detail}</p>
    </div>
  );
}

function TopicList({
  title,
  empty,
  items,
  tone,
  testId,
}: {
  title: string;
  empty: string;
  items: ReportCardMetrics["strengths"];
  tone: "positive" | "attention";
  testId: string;
}) {
  const palette = tone === "positive"
    ? "border-[#d8e6d9] bg-[#edf3eb] text-[#41664e]"
    : "border-[#eadfd7] bg-[#f7f0e9] text-[#946744]";

  return (
    <section className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4" data-testid={testId}>
      <h3 className="text-sm font-bold text-[#39483f]">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-2 text-[11px] leading-relaxed text-[#818c82]">{empty}</p>
      ) : (
        <ul className="mt-3 space-y-2">
          {items.slice(0, 4).map((item) => {
            const config = SUBJECTS[item.subject];
            return (
              <li
                key={`${item.subject}-${item.topic}`}
                className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2.5 ${palette}`}
                data-testid={`${testId}-${item.subject.toLowerCase().replaceAll(" ", "-")}-${item.topic.toLowerCase().replaceAll(" ", "-")}`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{item.topic}</span>
                  <span className="mt-0.5 block text-[10px]" style={{ color: config.color }}>
                    {item.subject} · {item.gradedAnswers} graded answers
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs font-bold">{item.accuracy}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function ReportCard({
  classNum,
  bankReady,
  metrics,
  practiceDays,
  tutorProfile,
  tutorActivity,
  revisionDue,
  upcomingRevisions,
  upcomingCount,
}: Props) {
  const strengths = tutorProfile.learningVelocity === "fast"
    ? "Fast"
    : tutorProfile.learningVelocity === "slow"
      ? "Thorough"
      : "Steady";
  const depth = {
    basic: "Detailed",
    standard: "Standard",
    advanced: "Concise",
  }[tutorProfile.preferredDepth];
  const nextReviews = [
    ...revisionDue.map((item) => ({ item, label: "Due now" })),
    ...upcomingRevisions.flatMap(({ date, items }) =>
      items.map((item) => ({ item, label: date })),
    ),
  ].slice(0, 4);

  return (
    <div className="space-y-5">
      <section
        aria-label="Learning record summary"
        className="grid grid-cols-2 gap-2.5"
      >
        <Metric
          label="Questions practised"
          value={bankReady ? String(metrics.questionsPractised) : "…"}
          detail={bankReady
            ? `Unique active bank questions · ${metrics.activeQuestions} available`
            : "Loading active question coverage"}
          testId="metric-report-practised"
        />
        <Metric
          label="Graded accuracy"
          value={metrics.gradedAccuracy === null ? "—" : `${metrics.gradedAccuracy}%`}
          detail={`${metrics.gradedCorrect} correct / ${metrics.gradedAnswers} graded answers`}
          testId="metric-report-graded-accuracy"
        />
        <Metric
          label="Topic coverage"
          value={bankReady ? `${metrics.topicsCovered}/${metrics.activeTopics}` : "…"}
          detail="Active topics with at least one practised question"
          testId="metric-report-topic-coverage"
        />
        <Metric
          label="Practice days"
          value={`${practiceDays.filter((day) => day.completed).length}/7`}
          detail="Days with a saved confidence check-in or revision result"
          testId="metric-report-practice-days"
        />
      </section>

      <p
        className="rounded-xl border border-[#dce2d8] bg-[#eef2ea] px-4 py-3 text-[11px] leading-relaxed text-[#526554]"
        data-testid="note-report-record-types"
      >
        Confidence check-ins count as practice and can schedule Revision. They do not change graded accuracy; tutor activity is shown separately below.
      </p>

      <section
        aria-labelledby="report-subject-coverage-heading"
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="section-report-subject-coverage"
      >
        <div className="mb-3 flex items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#79857a]">Active bank</p>
            <h2 id="report-subject-coverage-heading" className="mt-1 font-serif text-lg font-semibold text-[#334238]">
              Coverage by subject
            </h2>
          </div>
          <span className="text-[10px] text-[#818c82]">{classNum === 9 ? "Class 9" : `Class ${classNum}`}</span>
        </div>
        {!bankReady ? (
          <p className="py-3 text-xs text-[#818c82]" role="status">Loading active topics…</p>
        ) : (
          <div className="space-y-4">
            {metrics.subjects.map((subject) => {
              const config = SUBJECTS[subject.subject];
              const percent = subject.activeTopics > 0
                ? Math.round((subject.topicsCovered / subject.activeTopics) * 100)
                : 0;
              return (
                <div key={subject.subject} data-testid={`coverage-subject-${subject.subject.toLowerCase().replaceAll(" ", "-")}`}>
                  <div className="mb-1.5 flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span
                        aria-hidden="true"
                        className="grid h-7 min-w-7 place-items-center rounded-lg px-1 font-mono text-[9px] font-bold"
                        style={{ color: config.color, backgroundColor: config.light }}
                      >
                        {subjectMarks[subject.subject]}
                      </span>
                      <span className="truncate text-xs font-semibold text-[#39483f]">{subject.subject}</span>
                    </div>
                    <span className="shrink-0 font-mono text-[11px] font-semibold text-[#536657]">
                      {subject.topicsCovered}/{subject.activeTopics} topics
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${subject.subject} topic coverage`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                    className="h-1.5 overflow-hidden rounded-full bg-[#eceee8]"
                  >
                    <div
                      className="h-full rounded-full transition-[width] duration-500"
                      style={{ width: `${percent}%`, backgroundColor: config.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <TopicList
          title="Strengths"
          empty="No confirmed strengths yet. A topic needs at least three graded answers at 80% accuracy or higher."
          items={metrics.strengths}
          tone="positive"
          testId="section-report-strengths"
        />
        <TopicList
          title="Weak areas"
          empty="No weak areas from graded answers yet. Confidence check-ins do not create a weak-area score."
          items={metrics.weakAreas}
          tone="attention"
          testId="section-report-weak-areas"
        />
      </div>

      <section
        aria-labelledby="report-week-heading"
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="section-report-week"
      >
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="h-4 w-4 text-[#557664]" />
            <h2 id="report-week-heading" className="font-serif text-lg font-semibold text-[#334238]">Practice days</h2>
          </div>
          <span className="text-[10px] text-[#818c82]">Last 7 days</span>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-2">
          {practiceDays.map((day) => (
            <div key={day.date} className="flex min-w-0 flex-col items-center gap-1.5" data-testid={`report-day-${day.date}`}>
              <div
                role="img"
                aria-label={`${day.date}: ${day.completed ? "practice completed" : "no practice recorded"}`}
                className={`grid aspect-square w-full place-items-center rounded-lg border ${
                  day.completed
                    ? "border-[#557664] bg-[#557664] text-white"
                    : "border-[#e5e7df] bg-[#f3f3ed] text-[#c2c8be]"
                }`}
              >
                {day.completed && <Check aria-hidden="true" className="h-3.5 w-3.5" />}
              </div>
              <span className="text-[9px] font-semibold text-[#879087]">{day.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="report-revision-heading"
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="section-report-revision"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-[#edf1e9] text-[#557664]">
              <RotateCcw aria-hidden="true" className="h-4 w-4" />
            </span>
            <div>
              <h2 id="report-revision-heading" className="font-serif text-lg font-semibold text-[#334238]">Revision needs</h2>
              <p className="mt-0.5 text-[10px] text-[#818c82]">Confidence check-ins and graded reviews stay distinct.</p>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm font-bold text-[#365544]" data-testid="metric-report-revision-due">
              {revisionDue.length} due
            </p>
            <p className="font-mono text-[10px] text-[#818c82]" data-testid="metric-report-revision-upcoming">
              {upcomingCount} upcoming
            </p>
          </div>
        </div>
        {nextReviews.length > 0 ? (
          <ul className="mt-3 space-y-2">
            {nextReviews.map(({ item, label }) => (
              <li key={item.questionId} className="flex items-center justify-between gap-3 rounded-xl bg-[#f1f3ed] px-3 py-2.5">
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold text-[#39483f]">{item.topic}</span>
                  <span className="mt-0.5 block truncate text-[10px] text-[#818c82]">{item.subject} · {item.questionId}</span>
                </span>
                <span className="shrink-0 text-[10px] font-semibold text-[#557664]">{label}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl bg-[#f1f3ed] px-3 py-3 text-xs text-[#667569]" data-testid="status-report-no-revision">
            No questions are scheduled for review right now.
          </p>
        )}
        <Link
          href="/revision"
          data-testid="link-report-revision"
          className="mt-3 flex items-center justify-between rounded-xl bg-[#365544] px-4 py-3 text-xs font-semibold text-[#fbfaf6] transition-colors hover:bg-[#294536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664] focus-visible:ring-offset-2"
        >
          <span className="flex items-center gap-2"><RotateCcw aria-hidden="true" className="h-4 w-4" /> Open Revision</span>
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>

      <section
        aria-labelledby="report-tutor-profile-heading"
        className="rounded-2xl border border-[#dedfed] bg-[#f5f4fa] p-4"
        data-testid="section-report-tutor-profile"
      >
        <div className="flex items-center gap-2">
          <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#7063a2]" />
          <h2 id="report-tutor-profile-heading" className="font-serif text-lg font-semibold text-[#3f3a59]">AI tutor profile</h2>
        </div>
        <p className="mt-1 text-[10px] leading-relaxed text-[#77728c]">
          Historical lesson activity and learning preferences, separate from graded answers.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-white/80 p-3">
            <p className="font-mono text-lg font-semibold text-[#554b7c]" data-testid="metric-report-tutor-hours">
              {tutorProfile.studyHours}h
            </p>
            <p className="text-[10px] text-[#77728c]">lesson activity logged</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="text-sm font-semibold capitalize text-[#554b7c]" data-testid="text-report-tutor-depth">
              {depth} · {strengths.toLowerCase()} pace
            </p>
            <p className="text-[10px] text-[#77728c]">saved tutor preferences</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="font-mono text-lg font-semibold text-[#554b7c]" data-testid="metric-report-tutor-sessions">
              {tutorActivity.sessions}
            </p>
            <p className="text-[10px] text-[#77728c]">saved Socratic sessions</p>
          </div>
          <div className="rounded-xl bg-white/80 p-3">
            <p className="font-mono text-lg font-semibold text-[#554b7c]" data-testid="metric-report-tutor-questions">
              {tutorActivity.questionsAsked}
            </p>
            <p className="text-[10px] text-[#77728c]">tutor questions asked</p>
          </div>
        </div>
        <p className="mt-2 text-[10px] text-[#77728c]">
          Best study time: {tutorProfile.bestStudyTime}
          {tutorProfile.preferredSubject ? ` · Often studies ${tutorProfile.preferredSubject}` : ""}
        </p>
        <p className="mt-2 text-[10px] leading-relaxed text-[#77728c]">
          Tutor-session history and study-time estimates are not student answer attempts or graded accuracy.
        </p>
      </section>

      <details
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="details-report-tutor-sessions"
      >
        <summary
          className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-[#39483f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664]"
          data-testid="summary-report-tutor-sessions"
        >
          <span className="flex items-center gap-2">
            <BookOpenCheck aria-hidden="true" className="h-4 w-4 text-[#557664]" />
            Tutor Sessions
          </span>
          <span className="text-[10px] text-[#818c82]">Open saved session history</span>
        </summary>
        <div className="mt-4 border-t border-[#e6e7df] pt-4" data-testid="content-report-tutor-sessions">
          <TutorDashboard showOverview={false} />
        </div>
      </details>

      <Link
        href="/improvement"
        data-testid="link-report-detailed-trends"
        className="flex items-center justify-between rounded-2xl border border-[#dce2d8] bg-[#eef2ea] px-4 py-3 text-xs font-semibold text-[#43604c] transition-colors hover:bg-[#e5ece2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664]"
      >
        <span>Open detailed learning trends</span>
        <ArrowRight aria-hidden="true" className="h-4 w-4" />
      </Link>
    </div>
  );
}
