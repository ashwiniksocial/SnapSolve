import { useState } from "react";
import { Link } from "wouter";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useStreak }      from "@/hooks/useStreak";
import { useProgress }    from "@/hooks/useProgress";
import { useStudyScore }  from "@/hooks/useStudyScore";
import StudentProfileView from "@/components/tutor/StudentProfileView";
import TutorDashboard    from "@/components/socratic/TutorDashboard";

const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

function getLast7Days(): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
}
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type Tab = "analytics" | "tutor" | "socratic";

export default function Progress() {
  const { streak, completedDates } = useStreak();
  const { getSubjectStats, totalSolved } = useProgress();
  const { score, color: scoreColor, grade } = useStudyScore();
  const last7 = getLast7Days();
  const [activeTab, setActiveTab] = useState<Tab>("analytics");

  const allWeakTopics = subjects.flatMap((s) => {
    const stats = getSubjectStats(s);
    return stats.weakTopics.map((t) => ({ topic: t, subject: s }));
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-0">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-slate-900">Progress</h1>
          <p className="text-sm text-slate-500 mt-0.5 mb-4">Track your learning across all subjects</p>

          {/* ── Tab switcher ──────────────────────────────────────────────── */}
          <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
            {([
              ["analytics", "📊 Analytics"],
              ["tutor",     "🎓 AI Profile"],
              ["socratic",  "✦ Tutor Sessions"],
            ] as [Tab, string][]).map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all leading-tight ${
                  activeTab === tab
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">

        {activeTab === "socratic" ? (
          <TutorDashboard />
        ) : activeTab === "tutor" ? (
          <StudentProfileView />
        ) : (
          <>
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {/* Study Score */}
              <Link href="/improvement">
                <div className="bg-white rounded-2xl border-2 p-4 text-center shadow-sm col-span-1 cursor-pointer transition-all hover:shadow-md"
                  style={{ borderColor: scoreColor }}>
                  <p className="text-xl font-black" style={{ color: scoreColor }}>{score}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 font-semibold leading-tight">{grade}</p>
                </div>
              </Link>
              {/* Problems */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-xl font-bold text-indigo-600">{totalSolved}</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Problems</p>
              </div>
              {/* Streak */}
              <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
                <p className="text-xl font-bold text-orange-600">{streak}🔥</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">Day Streak</p>
              </div>
            </div>

            {/* Activity streak calendar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">7-Day Activity</p>
              <div className="flex justify-between gap-1">
                {last7.map((dateStr, i) => {
                  const done = completedDates.includes(dateStr);
                  const dayLabel = DAY_LABELS[new Date(dateStr + "T12:00:00").getDay()];
                  return (
                    <div key={dateStr} className="flex flex-col items-center gap-2 flex-1">
                      <div
                        className={`w-full aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                          done ? "text-white shadow-sm" : "bg-slate-100 text-slate-400"
                        }`}
                        style={done ? { backgroundColor: "#4f46e5" } : {}}
                      >
                        {done ? "✓" : ""}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">{dayLabel}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subject-wise progress */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Subject Progress</p>
              <div className="space-y-3">
                {subjects.map((subj) => {
                  const cfg = SUBJECTS[subj];
                  const stats = getSubjectStats(subj);
                  const pct = stats.accuracy;
                  return (
                    <div key={subj} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
                            style={{ backgroundColor: cfg.light }}
                          >
                            {cfg.icon}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">{subj}</p>
                            <p className="text-xs text-slate-500">{stats.totalSolved} solved</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold" style={{ color: cfg.color }}>
                          {stats.totalSolved > 0 ? `${pct}%` : "—"}
                        </p>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: cfg.color,
                          }}
                        />
                      </div>
                      {stats.totalSolved > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {stats.topicStats.slice(0, 4).map((t) => (
                            <span
                              key={t.topic}
                              className="text-xs px-2.5 py-1 rounded-full font-medium"
                              style={{ backgroundColor: cfg.light, color: cfg.color }}
                            >
                              {t.topic} · {t.solved}
                            </span>
                          ))}
                        </div>
                      )}
                      {stats.totalSolved === 0 && (
                        <p className="text-xs text-slate-400 mt-1">No activity yet — start solving!</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weakness analysis */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Weakness Analysis</p>
              <p className="text-xs text-slate-400 mb-4">Topics where accuracy is below 60%</p>
              {allWeakTopics.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-3xl mb-2">✦</p>
                  <p className="text-sm font-semibold text-slate-600">No weak topics detected yet</p>
                  <p className="text-xs text-slate-400 mt-1">Solve more questions to see your analysis</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allWeakTopics.map(({ topic, subject }) => {
                    const cfg = SUBJECTS[subject];
                    return (
                      <div key={`${subject}-${topic}`} className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-100">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                          style={{ backgroundColor: cfg.light }}
                        >
                          {cfg.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800">{topic}</p>
                          <p className="text-xs text-slate-500">{subject}</p>
                        </div>
                        <span className="text-xs font-bold text-red-500 bg-red-100 px-2 py-1 rounded-full">
                          Needs Work
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 30-Day Dashboard CTA */}
            <Link href="/improvement">
              <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-5 shadow-md cursor-pointer hover:opacity-95 transition-opacity">
                <div>
                  <p className="font-bold text-white text-sm">30-Day Improvement Dashboard</p>
                  <p className="text-indigo-200 text-xs mt-0.5">AI trend charts · topic predictions · confidence</p>
                </div>
                <div className="text-white text-xl">✦</div>
              </div>
            </Link>

            {/* Streak motivator */}
            {streak > 0 && (
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50 p-5 text-center">
                <p className="text-3xl mb-2">🔥</p>
                <p className="font-bold text-indigo-800 text-base">{streak}-day study streak!</p>
                <p className="text-sm text-indigo-600 mt-1">
                  {streak < 7 ? `${7 - streak} more days to a 1-week streak` : "You're on a great roll — keep it up!"}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
