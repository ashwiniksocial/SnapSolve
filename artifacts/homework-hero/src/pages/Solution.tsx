import { useMemo, useEffect } from "react";
import { Link } from "wouter";
import { SUBJECTS } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useStreak } from "@/hooks/useStreak";
import { useProgress } from "@/hooks/useProgress";
import { getSolution } from "@/data/mockSolutions";
import { useCelebration } from "@/hooks/useCelebration";
import StarBurst from "@/components/StarBurst";
import { useState } from "react";

export default function Solution() {
  const { session, update } = useSession();
  const { completeToday, isTodayCompleted } = useStreak();
  const { recordSolve } = useProgress();
  const celebrate = useCelebration();
  const [burst, setBurst] = useState(false);
  const [marked, setMarked] = useState(false);

  const cfg = SUBJECTS[session.subject];
  const sol = useMemo(
    () => getSolution(session.subject, session.question),
    [session.subject, session.question]
  );

  useEffect(() => {
    recordSolve(session.subject, sol.topic);
  }, []);

  const handleMark = () => {
    completeToday();
    setMarked(true);
    celebrate();
    setBurst(true);
    setTimeout(() => setBurst(false), 2500);
  };

  const diffColor: Record<string, string> = {
    Easy: "text-emerald-600 bg-emerald-50 border-emerald-200",
    Medium: "text-amber-600 bg-amber-50 border-amber-200",
    Hard: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <StarBurst active={burst} />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full border"
              style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
            >
              {cfg.icon} {session.subject}
            </span>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diffColor[sol.difficulty]}`}>
              {sol.difficulty}
            </span>
            <span className="text-xs text-slate-400 ml-auto">{sol.topic}</span>
          </div>
          <h1 className="text-xl font-bold text-slate-900 mt-2">AI Solution</h1>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* Question box */}
        {session.question && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Question</p>
            <p className="text-sm text-slate-700 leading-relaxed">{session.question}</p>
          </div>
        )}

        {/* Solution steps */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Step-by-Step Solution</p>
          <div className="space-y-3">
            {sol.steps.map((step, i) => (
              <div
                key={i}
                className="step-card bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: cfg.color }}
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.content}</p>
                    {step.formula && (
                      <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
                        <p className="text-xs font-mono text-slate-700 leading-relaxed">{step.formula}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Answer */}
        <div
          className="rounded-2xl border p-4 shadow-sm"
          style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
        >
          <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: cfg.color }}>
            ✦ Final Answer
          </p>
          <p className="text-sm font-semibold text-slate-800 leading-relaxed">{sol.answer}</p>
        </div>

        {/* Key concepts */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Concepts</p>
          <div className="flex flex-wrap gap-2">
            {sol.keyConcepts.map((c) => (
              <span key={c} className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200">
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/practice" onClick={() => update({ practiceTopic: sol.topic })}>
            <button className="w-full py-3.5 rounded-2xl border-2 border-slate-200 text-slate-700 font-semibold text-sm hover:border-indigo-200 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
              <span>✎</span> Practice Similar
            </button>
          </Link>
          <button
            onClick={handleMark}
            disabled={isTodayCompleted || marked}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              isTodayCompleted || marked
                ? "bg-emerald-50 text-emerald-600 border-2 border-emerald-200"
                : "text-white active:scale-95 shadow-sm"
            }`}
            style={!(isTodayCompleted || marked) ? { backgroundColor: cfg.color } : {}}
          >
            {isTodayCompleted || marked ? "✓ Marked Done" : "✓ Mark Solved"}
          </button>
        </div>
      </div>
    </div>
  );
}
