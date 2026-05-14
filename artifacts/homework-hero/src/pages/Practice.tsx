import { useState } from "react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { getSolution } from "@/data/mockSolutions";
import { useProgress } from "@/hooks/useProgress";

const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function Practice() {
  const { session, update } = useSession();
  const { recordSolve } = useProgress();
  const cfg = SUBJECTS[session.subject];
  const sol = getSolution(session.subject, session.practiceTopic || "");
  const [expanded, setExpanded] = useState<number | null>(null);
  const [solved, setSolved] = useState<Set<number>>(new Set());

  const handleSolve = (i: number) => {
    if (solved.has(i)) return;
    setSolved((prev) => new Set(prev).add(i));
    recordSolve(session.subject, sol.topic);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-slate-900">Practice</h1>
          <p className="text-sm text-slate-500 mt-0.5">Topic-wise questions with solutions</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* Subject tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {subjects.map((s) => {
            const c = SUBJECTS[s];
            const active = session.subject === s;
            return (
              <button
                key={s}
                onClick={() => update({ subject: s, practiceTopic: "" })}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                }`}
                style={active ? { backgroundColor: c.color } : {}}
              >
                {c.icon} {s}
              </button>
            );
          })}
        </div>

        {/* Topic info */}
        <div
          className="rounded-2xl border p-4"
          style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: cfg.color }}>
                Current Topic
              </p>
              <p className="font-bold text-slate-900 mt-0.5">{sol.topic}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Solved</p>
              <p className="font-bold text-slate-900">{solved.size}/{sol.practiceQuestions.length}</p>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-white rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(solved.size / sol.practiceQuestions.length) * 100}%`,
                backgroundColor: cfg.color,
              }}
            />
          </div>
        </div>

        {/* Questions */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Practice Questions
          </p>
          <div className="space-y-3">
            {sol.practiceQuestions.map((q, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  className="w-full text-left p-4"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 transition-all ${
                        solved.has(i) ? "text-white" : "text-slate-500 bg-slate-100"
                      }`}
                      style={solved.has(i) ? { backgroundColor: cfg.color } : {}}
                    >
                      {solved.has(i) ? "✓" : i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800 font-medium leading-relaxed">{q.question}</p>
                    </div>
                    <svg
                      className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 transition-transform ${expanded === i ? "rotate-180" : ""}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {expanded === i && (
                  <div className="px-4 pb-4 border-t border-slate-100">
                    <div className="pt-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Solution</p>
                      <div
                        className="rounded-xl border p-3 text-sm font-medium"
                        style={{ backgroundColor: cfg.light, borderColor: cfg.border, color: cfg.color }}
                      >
                        {q.answer}
                      </div>
                      {!solved.has(i) && (
                        <button
                          onClick={() => handleSolve(i)}
                          className="mt-3 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
                          style={{ backgroundColor: cfg.color }}
                        >
                          Mark as Solved · +10 XP
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Key concepts recap */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Topic Concepts</p>
          <div className="flex flex-wrap gap-2">
            {sol.keyConcepts.map((c) => (
              <span
                key={c}
                className="text-xs font-semibold px-3 py-1.5 rounded-full border"
                style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
