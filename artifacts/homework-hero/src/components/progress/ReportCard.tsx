import { Link } from "wouter";
import { ArrowRight, BookOpenCheck, Clock3, MessageCircle } from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { formatTrackedStudyTime, type ImprovementStep, type ReportCardMetrics } from "@/services/reportCardMetrics";
import type { TutorActivityStats } from "@/services/socratic/dialogueEngine";

interface Props {
  bankReady: boolean;
  metrics: ReportCardMetrics;
  trackedStudyTimeMs: number;
  tutorActivity: TutorActivityStats;
  improvementSteps: ImprovementStep[];
  hasLearningEvidence: boolean;
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

function EvidenceTopicList({
  title,
  empty,
  topics,
  kind,
}: {
  title: string;
  empty: string;
  topics: ReportCardMetrics["strengths"];
  kind: "strength" | "weak";
}) {
  const isStrength = kind === "strength";
  return (
    <section
      className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
      data-testid={`section-report-${kind === "strength" ? "strengths" : "weak-concepts"}`}
    >
      <h2 className="font-serif text-lg font-semibold text-[#334238]">{title}</h2>
      {topics.length === 0 ? (
        <p className="mt-2 text-[11px] leading-relaxed text-[#818c82]" data-testid={`status-report-no-${kind}-evidence`}>
          {empty}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {topics.slice(0, 3).map((topic) => {
            const colors = SUBJECTS[topic.subject];
            return (
              <li
                key={`${topic.subject}-${topic.topic}`}
                className={`flex items-center gap-3 rounded-xl border p-3 ${
                  isStrength ? "border-[#d8e6d9] bg-[#edf3eb]" : "border-[#eadfd7] bg-[#f7f0e9]"
                }`}
                data-testid={`report-${kind}-${topic.subject.toLowerCase().replaceAll(" ", "-")}-${topic.topic.toLowerCase().replaceAll(" ", "-")}`}
              >
                <span
                  aria-hidden="true"
                  className="grid h-7 min-w-7 place-items-center rounded-lg px-1 font-mono text-[9px] font-bold"
                  style={{ backgroundColor: colors.light, color: colors.color }}
                >
                  {subjectMarks[topic.subject]}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-semibold text-[#39483f]">{topic.topic}</span>
                  <span className="mt-0.5 block text-[10px] text-[#818c82]">
                    {topic.subject} · {topic.gradedAnswers} graded {topic.gradedAnswers === 1 ? "answer" : "answers"}
                  </span>
                </span>
                <span className="shrink-0 font-mono text-xs font-bold text-[#536657]">{topic.accuracy}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function ReportCard({
  bankReady,
  metrics,
  trackedStudyTimeMs,
  tutorActivity,
  improvementSteps,
  hasLearningEvidence,
}: Props) {
  return (
    <div className="space-y-4">
      <section aria-label="Learning summary" className="grid grid-cols-2 gap-2.5">
        <div
          className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
          data-testid="metric-report-learning-time"
        >
          <div className="flex items-center gap-2 text-[#718074]">
            <Clock3 aria-hidden="true" className="h-4 w-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Learning time</p>
          </div>
          <p className="mt-3 font-mono text-xl font-semibold tabular-nums text-[#365544]">
            {formatTrackedStudyTime(trackedStudyTimeMs)}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-[#818c82]">
            Measured while a TeachingLesson is open; attention itself is not tracked.
          </p>
        </div>
        <div
          className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
          data-testid="metric-report-practised"
        >
          <div className="flex items-center gap-2 text-[#718074]">
            <BookOpenCheck aria-hidden="true" className="h-4 w-4" />
            <p className="text-[10px] font-bold uppercase tracking-[0.12em]">Questions practised</p>
          </div>
          <p className="mt-3 font-mono text-xl font-semibold tabular-nums text-[#365544]">
            {bankReady ? metrics.questionsPractised : "…"}
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-[#818c82]">
            {bankReady ? "Unique active-bank questions with a saved practice record." : "Loading active question records."}
          </p>
        </div>
      </section>

      <p
        className="rounded-xl border border-[#dce2d8] bg-[#eef2ea] px-4 py-3 text-[11px] leading-relaxed text-[#526554]"
        data-testid="note-report-record-types"
      >
        Confidence check-ins count as practice, not correct answers. Tutor assessments are shown separately and never change Practice coverage or accuracy.
      </p>

      <section
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="section-report-tutor-activity"
        aria-labelledby="report-tutor-activity-heading"
      >
        <div className="flex items-center gap-2 text-[#718074]">
          <MessageCircle aria-hidden="true" className="h-4 w-4" />
          <h2 id="report-tutor-activity-heading" className="font-serif text-lg font-semibold text-[#334238]">
            Tutor activity
          </h2>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {[
            { label: "Sessions started", value: tutorActivity.totalSessions },
            { label: "Tutor questions", value: tutorActivity.totalQuestions },
            { label: "Answers graded", value: tutorActivity.totalAnswered },
            { label: "Hints used", value: tutorActivity.totalHints },
            {
              label: "Tutor accuracy",
              value: tutorActivity.avgAccuracy === null ? "—" : `${tutorActivity.avgAccuracy}%`,
              detail: tutorActivity.totalAnswered > 0
                ? `${tutorActivity.totalCorrect} of ${tutorActivity.totalAnswered} graded correct`
                : "No graded answers yet",
            },
          ].map(({ label, value, detail }) => (
            <div
              key={label}
              className="rounded-xl border border-[#e5e7df] bg-white px-3 py-2.5"
              data-testid={`metric-report-tutor-${label.toLowerCase().replaceAll(" ", "-")}`}
            >
              <p className="font-mono text-lg font-semibold tabular-nums text-[#365544]">{value}</p>
              <p className="mt-1 text-[10px] font-medium text-[#818c82]">{label}</p>
              {detail && <p className="mt-1 text-[9px] leading-relaxed text-[#818c82]">{detail}</p>}
            </div>
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-[#818c82]">
          Unanswered tutor prompts are excluded from accuracy. This is saved tutor history on this device, separate from class-scoped Practice totals.
        </p>
      </section>

      <div className="grid gap-3 sm:grid-cols-2">
        <EvidenceTopicList
          title="Demonstrated strengths"
          empty="No topic has enough graded results to confirm a strength yet."
          topics={metrics.strengths}
          kind="strength"
        />
        <EvidenceTopicList
          title="Weak concepts"
          empty="No weak concepts are supported by graded results yet."
          topics={metrics.weakAreas}
          kind="weak"
        />
      </div>

      <section
        className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
        data-testid="section-report-improvement-steps"
        aria-labelledby="report-improvement-heading"
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#79857a]">Based on saved activity</p>
          <h2 id="report-improvement-heading" className="mt-1 font-serif text-lg font-semibold text-[#334238]">
            Next steps
          </h2>
        </div>
        {improvementSteps.length === 0 ? (
          <p className="mt-3 rounded-xl bg-[#f1f3ed] px-3 py-3 text-xs leading-relaxed text-[#667569]" data-testid="status-report-no-next-steps">
            {hasLearningEvidence
              ? "No specific improvement priority is supported by the current records."
              : "There is not enough saved learning activity to recommend a next step yet."}
          </p>
        ) : (
          <ol className="mt-3 space-y-2">
            {improvementSteps.map((step, index) => (
              <li
                key={step.id}
                className="flex items-start gap-3 rounded-xl border border-[#e5e7df] bg-white p-3"
                data-testid={`report-improvement-step-${index + 1}`}
              >
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#edf1e9] font-mono text-[10px] font-bold text-[#557664]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-[#39483f]">{step.title}</p>
                  <p className="mt-1 text-[10px] leading-relaxed text-[#818c82]" data-testid={`report-step-evidence-${index + 1}`}>
                    Evidence: {step.evidence}
                  </p>
                  <Link
                    href={step.href}
                    data-testid={`link-report-step-${index + 1}`}
                    className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-[#42634f] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664]"
                  >
                    {step.action}
                    <ArrowRight aria-hidden="true" className="h-3 w-3" />
                  </Link>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
