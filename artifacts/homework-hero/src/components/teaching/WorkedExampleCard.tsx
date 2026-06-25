import { useState } from "react";

interface Props {
  problem:     string;
  solution:    string;
  borderColor: string;
}

export default function WorkedExampleCard({ problem, solution, borderColor }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="space-y-3">
      <p className="text-xs text-teal-700 italic">
        A different question, same idea — work through this one yourself first.
      </p>
      <div className="rounded-xl border p-3 bg-white" style={{ borderColor }}>
        <p className="text-sm text-slate-700 leading-relaxed">{problem}</p>
      </div>

      {!revealed && (
        <p className="text-xs text-slate-400 text-center italic">Try solving it yourself first.</p>
      )}

      {revealed ? (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1.5">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Solution</p>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{solution}</p>
          <button
            onClick={() => setRevealed(false)}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            Hide ↑
          </button>
        </div>
      ) : (
        <button
          onClick={() => setRevealed(true)}
          className="w-full py-2.5 rounded-xl border text-xs font-bold transition-all hover:brightness-95"
          style={{ borderColor, color: borderColor }}
        >
          Reveal Full Solution ↓
        </button>
      )}
    </div>
  );
}
