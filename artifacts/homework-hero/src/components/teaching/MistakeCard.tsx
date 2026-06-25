interface Props {
  commonMistakes: string[];
  examTrap?:      string;
}

export default function MistakeCard({ commonMistakes, examTrap }: Props) {
  return (
    <div className="space-y-3">
      <ul className="space-y-2.5">
        {commonMistakes.map((m, i) => (
          <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
            <span className="flex-shrink-0 mt-0.5 text-red-500 font-bold leading-none">✗</span>
            <span className="leading-relaxed">{m}</span>
          </li>
        ))}
      </ul>

      {examTrap && (
        <div className="mt-3 bg-red-100 border border-red-200 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold text-red-700 uppercase tracking-wider mb-1">
            🪤 Common Exam Trap
          </p>
          <p className="text-xs text-red-900 leading-relaxed">{examTrap}</p>
        </div>
      )}
    </div>
  );
}
