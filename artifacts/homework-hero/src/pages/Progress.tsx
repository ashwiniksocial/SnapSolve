import { useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  ChartNoAxesColumnIncreasing,
  Check,
  CircleAlert,
  GraduationCap,
  RotateCcw,
  Sparkles,
  Target,
} from "lucide-react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { useStudyScore } from "@/hooks/useStudyScore";
import StudentProfileView from "@/components/tutor/StudentProfileView";
import TutorDashboard from "@/components/socratic/TutorDashboard";

const subjects: Subject[] = ["Mathematics", "Science", "Information Technology"];
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

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
type Tab = "report" | "analytics" | "tutor" | "socratic";

export default function Progress() {
  const { streak, completedDates } = useStreak();
  const { getSubjectStats, totalSolved } = useProgress();
  const { score, color: scoreColor, grade } = useStudyScore();
  const last7 = getLast7Days();
  const [activeTab, setActiveTab] = useState<Tab>("report");

  const subjectData = subjects.map((subject) => ({
    subject,
    stats: getSubjectStats(subject),
  }));
  const reportSolved = subjectData.reduce((sum, item) => sum + item.stats.totalSolved, 0);
  const reportCorrect = subjectData.reduce((sum, item) => sum + item.stats.totalCorrect, 0);
  const reportAccuracy = reportSolved > 0 ? Math.round((reportCorrect / reportSolved) * 100) : 0;
  const practiceDays = last7.filter((date) => completedDates.includes(date)).length;
  const allWeakTopics = subjectData.flatMap(({ subject, stats }) =>
    stats.weakTopics.map((topic) => ({ topic, subject }))
  );

  const tabs: { id: Tab; label: string; icon: typeof ChartNoAxesColumnIncreasing }[] = [
    { id: "report", label: "Report Card", icon: GraduationCap },
    { id: "analytics", label: "Analytics", icon: ChartNoAxesColumnIncreasing },
    { id: "tutor", label: "AI Profile", icon: Sparkles },
    { id: "socratic", label: "Tutor Sessions", icon: BookOpenCheck },
  ];

  return (
    <main className="min-h-[100dvh] bg-[#f5f4ef] pb-24 text-[#26362e]">
      <header className="border-b border-[#e3e4dc] bg-[#f9f8f3] px-5 pb-0 pt-8">
        <div className="mx-auto max-w-lg">
          <Link href="/" data-testid="link-progress-home" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#718074] hover:text-[#344b40]">
            SnapSolve <span aria-hidden="true">/</span> Learning record
          </Link>
          <div className="mb-4 mt-3 flex items-end justify-between">
            <div>
              <h1 className="font-serif text-[30px] font-semibold leading-none tracking-[-0.04em]">Your progress</h1>
              <p className="mt-2 text-xs text-[#718074]">A clear look at what you know and what to revisit.</p>
            </div>
            <CalendarDays aria-hidden="true" className="mb-1 h-5 w-5 text-[#738578]" strokeWidth={1.7} />
          </div>

          <nav aria-label="Progress views" className="flex gap-1 overflow-x-auto rounded-t-xl bg-[#eceee7] p-1">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                data-testid={`tab-progress-${id}`}
                aria-current={activeTab === id ? "page" : undefined}
                onClick={() => setActiveTab(id)}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664] ${
                  activeTab === id
                    ? "bg-[#fbfaf6] text-[#365544] shadow-sm"
                    : "text-[#7c887e] hover:text-[#465b4d]"
                }`}
              >
                <Icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-lg space-y-5 px-5 py-6">
        {activeTab === "socratic" ? (
          <TutorDashboard />
        ) : activeTab === "tutor" ? (
          <StudentProfileView />
        ) : activeTab === "report" ? (
          <>
            <section
              aria-labelledby="report-overview-heading"
              data-testid="card-report-overview"
              className="overflow-hidden rounded-[24px] border border-[#dce2d8] bg-[#e9eee6] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#718174]">Class 9 · Snapshot</p>
                  <h2 id="report-overview-heading" className="mt-1 font-serif text-[23px] font-semibold tracking-[-0.03em]">Your report card</h2>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-[14px] bg-[#d8e3d7] text-[#42634f]">
                  <GraduationCap aria-hidden="true" className="h-5 w-5" strokeWidth={1.7} />
                </span>
              </div>
              <div className="mt-5 flex items-end justify-between rounded-2xl bg-[#fbfaf6] px-4 py-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#7d897e]">Overall accuracy</p>
                  <p data-testid="metric-report-accuracy" className="mt-1 font-serif text-[42px] font-semibold leading-none tracking-[-0.05em] text-[#365544]">
                    {reportSolved > 0 ? <>{reportAccuracy}<span className="ml-0.5 text-xl">%</span></> : "—"}
                  </p>
                  <p className="mt-2 text-[11px] text-[#7b877d]">Across your three subjects</p>
                </div>
                <div className="text-right">
                  <p data-testid="metric-report-solved" className="font-mono text-xl font-semibold tabular-nums text-[#39483f]">{reportSolved}</p>
                  <p className="mt-1 text-[10px] text-[#7b877d]">questions solved</p>
                </div>
              </div>
              {reportSolved === 0 && (
                <div data-testid="status-report-no-activity" className="mt-3 rounded-xl border border-dashed border-[#c7d2c6] bg-[#f5f6f1] px-4 py-3">
                  <p className="text-xs font-semibold text-[#39483f]">Your report card starts with your first question.</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#78857a]">Solve a question in any subject and your accuracy will appear here.</p>
                </div>
              )}
            </section>

            <section aria-labelledby="report-subjects-heading">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79857a]">By subject</p>
                  <h2 id="report-subjects-heading" className="mt-1 font-serif text-[22px] font-semibold tracking-[-0.03em]">The details</h2>
                </div>
                <span className="text-[10px] text-[#879087]">Live from your practice</span>
              </div>
              <div className="space-y-2.5">
                {subjectData.map(({ subject, stats }) => {
                  const config = SUBJECTS[subject];
                  return (
                    <article
                      key={subject}
                      data-testid={`card-report-subject-${subject.toLowerCase().replaceAll(" ", "-")}`}
                      className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="grid h-10 min-w-10 place-items-center rounded-[13px] px-1.5 font-mono text-[10px] font-bold"
                          style={{ color: config.color, backgroundColor: config.light }}
                        >
                          {subjectMarks[subject]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-sm font-bold text-[#334238]">{subject}</h3>
                          <p className="mt-0.5 text-[10px] text-[#818c82]">{stats.totalSolved} questions · {stats.totalCorrect} correct</p>
                        </div>
                        <div className="text-right">
                          <p
                            data-testid={`metric-report-accuracy-${subject.toLowerCase().replaceAll(" ", "-")}`}
                            className="font-mono text-lg font-semibold tabular-nums"
                            style={{ color: stats.totalSolved ? config.color : "#9aa197" }}
                          >
                            {stats.totalSolved > 0 ? `${stats.accuracy}%` : "—"}
                          </p>
                          <p className="text-[9px] text-[#8b948b]">{stats.totalSolved ? "accuracy" : "no activity"}</p>
                        </div>
                      </div>
                      <div
                        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[#eceee8]"
                        role="progressbar"
                        aria-label={`${subject} accuracy`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={stats.totalSolved ? stats.accuracy : 0}
                        data-testid={`progress-report-subject-${subject.toLowerCase().replaceAll(" ", "-")}`}
                      >
                        <div
                          className="h-full rounded-full transition-[width] duration-500"
                          style={{ width: `${stats.totalSolved ? stats.accuracy : 0}%`, backgroundColor: config.color }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section
              aria-labelledby="report-practice-days-heading"
              data-testid="card-report-practice-days"
              className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#79857a]">Your rhythm</p>
                  <h2 id="report-practice-days-heading" className="mt-1 font-serif text-[21px] font-semibold tracking-[-0.03em]">Practice days</h2>
                </div>
                <div className="text-right">
                  <p data-testid="metric-report-practice-days" className="font-mono text-2xl font-semibold tabular-nums text-[#365544]">{practiceDays}<span className="text-sm text-[#879087]"> / 7</span></p>
                  <p className="text-[10px] text-[#879087]">last 7 days</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-7 gap-2">
                {last7.map((dateStr, i) => {
                  const done = completedDates.includes(dateStr);
                  const dayLabel = DAY_LABELS[new Date(`${dateStr}T12:00:00`).getDay()];
                  return (
                    <div key={dateStr} className="flex flex-col items-center gap-2" data-testid={`day-report-practice-${dateStr}`}>
                      <div
                        role="img"
                        aria-label={`${dateStr}: ${done ? "practice completed" : "no practice recorded"}`}
                        className={`grid aspect-square w-full place-items-center rounded-xl border ${done ? "border-[#557664] bg-[#557664] text-white" : "border-[#e5e7df] bg-[#f3f3ed] text-[#c2c8be]"}`}
                      >
                        {done && <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2.5} />}
                      </div>
                      <span className="text-[10px] font-semibold text-[#879087]">{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
              {practiceDays === 0 && (
                <p data-testid="status-report-no-practice-days" className="mt-3 text-center text-[11px] text-[#818c82]">No practice days recorded this week yet.</p>
              )}
            </section>

            <section aria-labelledby="report-weak-heading" className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#f2eadb] text-[#8d6736]">
                  <Target aria-hidden="true" className="h-[18px] w-[18px]" strokeWidth={1.8} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79857a]">Your next focus</p>
                  <h2 id="report-weak-heading" className="mt-1 font-serif text-[21px] font-semibold tracking-[-0.03em]">Weak areas</h2>
                  <p className="mt-1 text-[11px] text-[#818c82]">Topics below 60% accuracy from your solved questions.</p>
                </div>
              </div>
              {allWeakTopics.length === 0 ? (
                <div data-testid="status-report-no-weak-areas" className="mt-4 rounded-xl bg-[#f1f3ed] px-4 py-4">
                  <p className="text-xs font-semibold text-[#536657]">{reportSolved === 0 ? "No weak areas to show yet." : "No weak areas detected."}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#7b877d]">
                    {reportSolved === 0 ? "Once you practise, topics to revisit will be listed here." : "Keep practising to build a clearer picture across your subjects."}
                  </p>
                </div>
              ) : (
                <div className="mt-4 space-y-2">
                  {allWeakTopics.map(({ topic, subject }) => {
                    const config = SUBJECTS[subject];
                    return (
                      <div
                        key={`${subject}-${topic}`}
                        data-testid={`weak-area-${subject.toLowerCase().replaceAll(" ", "-")}-${topic.toLowerCase().replaceAll(" ", "-")}`}
                        className="flex items-center gap-3 rounded-xl border border-[#eadfd7] bg-[#f7f0e9] p-3"
                      >
                        <CircleAlert aria-hidden="true" className="h-4 w-4 shrink-0 text-[#a16d47]" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-semibold text-[#39483f]">{topic}</p>
                          <p className="mt-0.5 text-[10px]" style={{ color: config.color }}>{subject}</p>
                        </div>
                        <span className="rounded-full bg-[#efe1d5] px-2 py-1 text-[9px] font-bold text-[#946744]">Revisit</span>
                      </div>
                    );
                  })}
                </div>
              )}
              <Link
                href="/revision"
                data-testid="link-report-revision"
                aria-label="Go to revision and practise weak areas"
                className="mt-4 flex items-center justify-between rounded-xl bg-[#365544] px-4 py-3 text-xs font-semibold text-[#fbfaf6] transition-colors hover:bg-[#294536] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#557664] focus-visible:ring-offset-2"
              >
                <span className="flex items-center gap-2">
                  <RotateCcw aria-hidden="true" className="h-4 w-4" />
                  Go to revision
                </span>
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </section>
          </>
        ) : activeTab === "analytics" ? (
          <>
            <section aria-label="Learning analytics" className="grid grid-cols-3 gap-2.5">
              <Link
                href="/improvement"
                data-testid="link-analytics-study-score"
                aria-label={`Open improvement dashboard. Study score ${score}, ${grade}`}
                className="rounded-2xl border-2 bg-[#fbfaf6] p-3 text-center transition-shadow hover:shadow-md"
                style={{ borderColor: scoreColor }}
              >
                <p data-testid="metric-analytics-study-score" className="font-mono text-xl font-black" style={{ color: scoreColor }}>{score}</p>
                <p className="mt-1 text-[10px] font-semibold leading-tight text-[#778379]">{grade}</p>
              </Link>
              <div data-testid="metric-analytics-problems" className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-3 text-center">
                <p className="font-mono text-xl font-bold text-[#42634f]">{totalSolved}</p>
                <p className="mt-1 text-[10px] font-medium text-[#778379]">Problems</p>
              </div>
              <div data-testid="metric-analytics-streak" className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-3 text-center">
                <p className="font-mono text-xl font-bold text-[#9a6a32]">{streak}</p>
                <p className="mt-1 text-[10px] font-medium text-[#778379]">Day streak</p>
              </div>
            </section>

            <section data-testid="card-analytics-activity" className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79857a]">7-day activity</p>
              <div className="mt-4 flex justify-between gap-2">
                {last7.map((dateStr) => {
                  const done = completedDates.includes(dateStr);
                  const dayLabel = DAY_LABELS[new Date(`${dateStr}T12:00:00`).getDay()];
                  return (
                    <div key={dateStr} className="flex flex-1 flex-col items-center gap-2" data-testid={`day-analytics-${dateStr}`}>
                      <div
                        role="img"
                        aria-label={`${dateStr}: ${done ? "practice completed" : "no practice recorded"}`}
                        className={`grid aspect-square w-full place-items-center rounded-lg text-xs font-bold ${done ? "bg-[#557664] text-white" : "bg-[#f0f1eb] text-[#b7beb4]"}`}
                      >
                        {done ? <Check aria-hidden="true" className="h-3.5 w-3.5" /> : ""}
                      </div>
                      <span className="text-[10px] font-medium text-[#879087]">{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </section>

            <section aria-labelledby="analytics-subject-heading">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[#79857a]">Subject progress</p>
              <h2 id="analytics-subject-heading" className="sr-only">Subject progress details</h2>
              <div className="space-y-2.5">
                {subjectData.map(({ subject, stats }) => {
                  const config = SUBJECTS[subject];
                  return (
                    <article key={subject} data-testid={`card-analytics-subject-${subject.toLowerCase().replaceAll(" ", "-")}`} className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <span className="grid h-9 min-w-9 place-items-center rounded-xl px-1 font-mono text-[10px] font-bold" style={{ backgroundColor: config.light, color: config.color }}>
                            {subjectMarks[subject]}
                          </span>
                          <div>
                            <p className="text-xs font-semibold text-[#39483f]">{subject}</p>
                            <p className="text-[10px] text-[#818c82]">{stats.totalSolved} solved</p>
                          </div>
                        </div>
                        <p className="font-mono text-sm font-bold" style={{ color: config.color }}>
                          {stats.totalSolved > 0 ? `${stats.accuracy}%` : "—"}
                        </p>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#eceee8]">
                        <div className="h-full rounded-full transition-[width] duration-500" style={{ width: `${stats.totalSolved ? stats.accuracy : 0}%`, backgroundColor: config.color }} />
                      </div>
                      {stats.totalSolved > 0 ? (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {stats.topicStats.slice(0, 4).map((topic) => (
                            <span key={topic.topic} data-testid={`topic-analytics-${subject.toLowerCase().replaceAll(" ", "-")}-${topic.topic.toLowerCase().replaceAll(" ", "-")}`} className="rounded-full px-2.5 py-1 text-[10px] font-medium" style={{ backgroundColor: config.light, color: config.color }}>
                              {topic.topic} · {topic.solved}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p data-testid={`status-analytics-no-activity-${subject.toLowerCase().replaceAll(" ", "-")}`} className="mt-2 text-[11px] text-[#8a938a]">No activity yet — start solving to see your subject progress.</p>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section data-testid="card-analytics-weakness" className="rounded-2xl border border-[#e1e3db] bg-[#fbfaf6] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79857a]">Weakness analysis</p>
              <p className="mb-4 mt-1 text-[11px] text-[#818c82]">Topics where accuracy is below 60%.</p>
              {allWeakTopics.length === 0 ? (
                <div data-testid="status-analytics-no-weakness" className="py-5 text-center">
                  <p className="text-xs font-semibold text-[#536657]">No weak topics detected yet</p>
                  <p className="mt-1 text-[11px] text-[#8a938a]">Solve more questions to see your analysis.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allWeakTopics.map(({ topic, subject }) => {
                    const config = SUBJECTS[subject];
                    return (
                      <div key={`${subject}-${topic}`} data-testid={`analytics-weak-topic-${subject.toLowerCase().replaceAll(" ", "-")}-${topic.toLowerCase().replaceAll(" ", "-")}`} className="flex items-center gap-3 rounded-xl border border-[#eadfd7] bg-[#f7f0e9] p-3">
                        <span className="grid h-7 min-w-7 place-items-center rounded-lg px-1 font-mono text-[9px] font-bold" style={{ backgroundColor: config.light, color: config.color }}>
                          {subjectMarks[subject]}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-[#39483f]">{topic}</p>
                          <p className="text-[10px] text-[#818c82]">{subject}</p>
                        </div>
                        <span className="rounded-full bg-[#efe1d5] px-2 py-1 text-[9px] font-bold text-[#946744]">Needs work</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            <Link
              href="/improvement"
              data-testid="link-improvement-dashboard"
              className="flex items-center justify-between rounded-2xl bg-[#365544] p-5 transition-colors hover:bg-[#294536]"
            >
              <span>
                <span className="block text-sm font-bold text-[#fbfaf6]">30-day improvement dashboard</span>
                <span className="mt-1 block text-[11px] text-[#cfddcf]">Explore your learning trends and topic predictions.</span>
              </span>
              <ArrowRight aria-hidden="true" className="h-5 w-5 text-[#e3ece2]" />
            </Link>
            {streak > 0 && (
              <div data-testid="status-analytics-streak-note" className="rounded-2xl border border-[#dfdfcf] bg-[#f1f0e5] p-4 text-center">
                <p className="text-sm font-bold text-[#536657]">{streak}-day study streak</p>
                <p className="mt-1 text-[11px] text-[#758076]">{streak < 7 ? `${7 - streak} more days to a 1-week streak` : "Keep going with your regular practice."}</p>
              </div>
            )}
          </>
        ) : null}
      </div>
    </main>
  );
}
