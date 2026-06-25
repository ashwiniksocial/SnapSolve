import { useState } from "react";

interface Props {
  questions: string[];
  topic:     string;
}

export default function UnderstandingCheck({ questions }: Props) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const toggle = (i: number) =>
    setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));

  return (
    <div className="space-y-3">
      <p className="text-xs text-violet-700 italic">
        These are thinking questions — not calculations. There is no single correct answer.
        Reflect on each one. The goal is to deepen your understanding of WHY the method works.
      </p>

      {questions.map((q, i) => (
        <div key={i} className="rounded-xl border border-violet-200 overflow-hidden">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-start gap-3 px-4 py-3 text-left bg-violet-50 hover:bg-violet-100 transition-colors"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-violet-300 flex items-center justify-center text-[10px] font-black text-violet-900 mt-0.5">
              {i + 1}
            </span>
            <p className="text-sm font-semibold text-violet-900 leading-snug flex-1">{q}</p>
            <span className="text-[10px] text-violet-500 font-bold flex-shrink-0 mt-0.5">
              {expanded[i] ? "▲" : "Think →"}
            </span>
          </button>

          {expanded[i] && (
            <div className="px-4 py-3 bg-white border-t border-violet-100">
              <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-1.5">
                Reflection Prompt
              </p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Think back through the solution. What was the specific moment where this question mattered?
                Could you explain your reasoning to another student in one minute?
                If yes — you truly understand this concept.
              </p>
              <button
                onClick={() => toggle(i)}
                className="mt-2 text-xs text-violet-500 hover:underline"
              >
                Close ↑
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
