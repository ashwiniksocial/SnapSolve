import type { SolutionStep } from "@/data/solutionBank";
import type { ReadingLevel } from "@/services/explanation/readingModeEngine";

interface Props {
  steps:       SolutionStep[];
  finalAnswer: string;
  color:       string;
  light:       string;
  border:      string;
  level:       ReadingLevel;
}

function SingleStep({ step, color, light, border, level }: {
  step:   SolutionStep;
  color:  string;
  light:  string;
  border: string;
  level:  ReadingLevel;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
          style={{ backgroundColor: color }}
        >
          {step.stepNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug">{step.title}</p>
          <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{step.explanation}</p>

          {level !== "advanced" && step.whyThisStep && (
            <div className="mt-2.5 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-2">
              <span className="text-[10px] font-black text-indigo-500 flex-shrink-0 mt-0.5 tracking-widest">WHY</span>
              <p className="text-xs text-indigo-700 leading-relaxed">{step.whyThisStep}</p>
            </div>
          )}

          {step.formula && (
            <div className="mt-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
              <p className="text-xs font-mono text-slate-700 leading-relaxed whitespace-pre-wrap">
                {step.formula}
              </p>
            </div>
          )}

          {step.result && (
            <div
              className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold rounded-lg px-2.5 py-1.5"
              style={{ backgroundColor: light, color, borderColor: border }}
            >
              <span>→</span>
              <span>{step.result}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function StepReasoningCard({ steps, finalAnswer, color, light, border, level }: Props) {
  return (
    <div className="space-y-3">
      {steps.map((step) => (
        <SingleStep key={step.stepNumber} step={step} color={color} light={light} border={border} level={level} />
      ))}
      <div
        className="mt-1 rounded-2xl border p-4"
        style={{ backgroundColor: light, borderColor: border }}
      >
        <p className="text-[10px] font-black uppercase tracking-wider mb-1.5" style={{ color }}>
          ✦ Final Answer
        </p>
        <p className="text-[15px] font-bold text-slate-900 leading-relaxed">{finalAnswer}</p>
      </div>
    </div>
  );
}
