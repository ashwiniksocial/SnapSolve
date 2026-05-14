import type { AIResponse } from "@/services/aiSolver";
import type { Subject } from "@/data/subjects";
import { SUBJECTS } from "@/data/subjects";

interface Props {
  solution: AIResponse;
}

const diffBadge: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50   text-amber-700   border-amber-200",
  Hard:   "bg-red-50     text-red-700     border-red-200",
};

export default function SolutionCard({ solution }: Props) {
  const cfg = SUBJECTS[solution.subject as Subject];

  return (
    <div className="space-y-5">

      {/* Topic + difficulty header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full border"
          style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
        >
          {cfg.icon} {solution.topic}
        </span>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${diffBadge[solution.difficulty]}`}>
          {solution.difficulty}
        </span>
      </div>

      {/* Detected question */}
      {solution.detectedQuestion && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Question Detected
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{solution.detectedQuestion}</p>
        </div>
      )}

      {/* Steps */}
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Step-by-Step Solution
        </p>
        <div className="space-y-3">
          {solution.steps.map((step) => (
            <div
              key={step.stepNumber}
              className="step-card bg-white rounded-2xl border border-slate-200 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: cfg.color }}
                >
                  {step.stepNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm">{step.title}</p>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">{step.explanation}</p>

                  {step.formula && (
                    <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
                      <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {step.formula}
                      </p>
                    </div>
                  )}

                  {step.result && (
                    <div
                      className="mt-2 flex items-center gap-1.5 text-xs font-semibold rounded-lg px-2.5 py-1.5"
                      style={{ backgroundColor: cfg.light, color: cfg.color }}
                    >
                      <span>→</span>
                      <span>{step.result}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final answer */}
      <div
        className="rounded-2xl border p-4 shadow-sm"
        style={{ backgroundColor: cfg.light, borderColor: cfg.border }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: cfg.color }}
        >
          ✦ Final Answer
        </p>
        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
          {solution.finalAnswer}
        </p>
      </div>

      {/* Key concepts */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Key Concepts
        </p>
        <div className="flex flex-wrap gap-2">
          {solution.keyConcepts.map((c) => (
            <span
              key={c}
              className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full border border-slate-200"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
