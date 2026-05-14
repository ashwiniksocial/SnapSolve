import { Link } from "wouter";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";

const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function Home() {
  const { session, update } = useSession();
  const { streak, isTodayCompleted } = useStreak();
  const { totalSolved } = useProgress();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">StudyAI</h1>
            <p className="text-sm text-slate-500 mt-0.5">Physics · Chemistry · Mathematics</p>
          </div>
          <div className="flex items-center gap-2">
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 rounded-full px-3 py-1.5">
                <span className="text-base">🔥</span>
                <span className="text-sm font-bold text-orange-600">{streak}</span>
              </div>
            )}
            <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
              S
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Day Streak", value: streak, unit: "🔥", color: "text-orange-600" },
            { label: "Problems", value: totalSolved, unit: "✓", color: "text-indigo-600" },
            { label: "Today", value: isTodayCompleted ? "Done" : "0/1", unit: "", color: "text-emerald-600" },
          ].map(({ label, value, unit, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
              <p className={`text-xl font-bold ${color}`}>{value}{unit}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Subject selector */}
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Select Subject</h2>
          <div className="space-y-3">
            {subjects.map((subj) => {
              const cfg = SUBJECTS[subj];
              const isActive = session.subject === subj;
              return (
                <button
                  key={subj}
                  onClick={() => update({ subject: subj })}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all
                    ${isActive
                      ? "border-current shadow-sm"
                      : "border-slate-200 bg-white hover:border-slate-300"}`}
                  style={isActive ? { borderColor: cfg.color, backgroundColor: cfg.light } : {}}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ backgroundColor: cfg.color + "20" }}
                  >
                    {cfg.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900">{subj}</p>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">
                      {cfg.topics.slice(0, 4).join(" · ")}
                    </p>
                  </div>
                  {isActive && (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: cfg.color }}
                    >
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Primary CTA */}
        <Link href="/scan">
          <button
            className="w-full py-4 rounded-2xl font-semibold text-white text-base shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
            style={{ background: `linear-gradient(135deg, ${SUBJECTS[session.subject].color}, ${SUBJECTS[session.subject].color}cc)` }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Scan a Question · {session.subject}
          </button>
        </Link>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/practice">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-indigo-200 transition-colors cursor-pointer shadow-sm">
              <div className="text-2xl mb-2">✎</div>
              <p className="font-semibold text-slate-800 text-sm">Practice</p>
              <p className="text-xs text-slate-500 mt-0.5">Topic-wise questions</p>
            </div>
          </Link>
          <Link href="/progress">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 hover:border-indigo-200 transition-colors cursor-pointer shadow-sm">
              <div className="text-2xl mb-2">◈</div>
              <p className="font-semibold text-slate-800 text-sm">Progress</p>
              <p className="text-xs text-slate-500 mt-0.5">Weakness analysis</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
