/**
 * TutorDashboard — live session stats panel and historical tutor summary.
 * Used in the Progress page under the "Tutor" tab.
 */
import { useMemo } from "react";
import { getTutorStats, getRecentSocraticSessions } from "@/services/socratic/dialogueEngine";
import { getActiveMisconceptions } from "@/services/socratic/misconceptionEngine";
import { getMasteryProgress, getMasteryProgressLabel } from "@/services/socratic/masteryAssessment";

const CAT_LABELS: Record<string, string> = {
  sign_error:         "Sign Error",
  formula_mismatch:   "Wrong Formula",
  unit_confusion:     "Unit Confusion",
  definitional_gap:   "Definition Gap",
  scope_confusion:    "Concept Confusion",
  step_skipped:       "Skipped Step",
  partial_application: "Incomplete Method",
  causal_reversal:    "Cause/Effect Mix-up",
  overgeneralisation: "Overgeneralisation",
  computational_error:"Arithmetic Error",
  unknown:            "Other",
};

function StatCard({ label, value, color = "text-indigo-600" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 text-center shadow-sm">
      <p className={`text-xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-slate-500 mt-1 font-medium leading-tight">{label}</p>
    </div>
  );
}

export default function TutorDashboard() {
  const stats   = useMemo(() => getTutorStats(), []);
  const recent  = useMemo(() => getRecentSocraticSessions(5), []);
  const miscons = useMemo(() => getActiveMisconceptions().slice(0, 6), []);

  const hasData = stats.totalSessions > 0;

  if (!hasData) {
    return (
      <div className="space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-sm">
          <p className="text-4xl mb-3">🎓</p>
          <p className="font-bold text-slate-700 text-base">No tutor sessions yet</p>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Open any AI solution and tap <strong>Talk to Tutor</strong> to begin your first Socratic tutoring session.
          </p>
        </div>

        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2">How it works</p>
          <div className="space-y-2">
            {[
              { icon: "✦", text: "After seeing a solution, tap \"Talk to Tutor\"" },
              { icon: "❓", text: "Your AI tutor asks conceptual questions — not just \"what is the answer?\"" },
              { icon: "🔍", text: "Wrong answers are analysed for specific misconceptions, not just marked wrong" },
              { icon: "💡", text: "Request hints (5 levels) that guide rather than reveal" },
              { icon: "🏆", text: "Mastery is confirmed only when you demonstrate understanding" },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-sm">{icon}</span>
                <p className="text-xs text-indigo-800 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Overall stats */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tutor Session Stats</p>
        <div className="grid grid-cols-3 gap-2">
          <StatCard label="Sessions" value={stats.totalSessions} />
          <StatCard label="Questions" value={stats.totalQuestions} />
          <StatCard label="Accuracy" value={`${stats.avgAccuracy}%`}
            color={stats.avgAccuracy >= 70 ? "text-emerald-600" : stats.avgAccuracy >= 50 ? "text-amber-600" : "text-red-600"}
          />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <StatCard label="Hints Used" value={stats.totalHints} color="text-amber-600" />
          <StatCard label="Misconceptions Fixed" value={stats.misconceptionsFixed} color="text-violet-600" />
        </div>
      </div>

      {/* Recent sessions */}
      {recent.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Recent Sessions</p>
          <div className="space-y-2">
            {recent.map((s) => {
              const acc = s.questionsAsked > 0
                ? Math.round((s.correctAnswers / s.questionsAsked) * 100)
                : 0;
              const mins = Math.round((s.endTime ?? s.startTime + 60_000) - s.startTime) / 60_000;
              const progress = getMasteryProgress(s.topic, s.subject);
              return (
                <div key={s.sessionId} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">{s.topic}</p>
                      <p className="text-xs text-slate-500">{s.subject} · {Math.round(mins)} min</p>
                    </div>
                    <div className="text-right">
                      {s.completed ? (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                          In Progress
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                    <span>✓ {s.correctAnswers}/{s.questionsAsked} correct</span>
                    <span>💡 {s.hintsUsed} hints</span>
                    <span className={acc >= 70 ? "text-emerald-600 font-bold" : acc >= 50 ? "text-amber-600 font-bold" : "text-red-500 font-bold"}>
                      {acc}%
                    </span>
                  </div>
                  {/* Mastery bar */}
                  <div className="mt-2.5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-400">
                        {getMasteryProgressLabel(s.topic, s.subject)}
                      </span>
                      <span className="text-[10px] font-semibold text-indigo-600">
                        {Math.round(progress * 100)}%
                      </span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${progress * 100}%`,
                          backgroundColor: progress >= 1 ? "#10b981" : "#4f46e5",
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active misconceptions */}
      {miscons.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Misconceptions to Fix</p>
          <div className="space-y-2">
            {miscons.map((m) => (
              <div key={m.id} className="bg-white rounded-2xl border border-orange-100 p-3 shadow-sm flex items-start gap-3">
                <div className="w-7 h-7 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0 text-sm">
                  ↩
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">{m.topic} · {m.subject}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{CAT_LABELS[m.category] ?? m.category}</p>
                  <p className="text-xs text-orange-700 mt-1 leading-relaxed line-clamp-2">{m.description}</p>
                </div>
                <span className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full flex-shrink-0">
                  ×{m.occurrences}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics studied */}
      {stats.topicsStudied.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Topics Tutored</p>
          <div className="flex flex-wrap gap-1.5">
            {stats.topicsStudied.map((topic) => (
              <span key={topic} className="text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                {topic}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
