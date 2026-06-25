interface Props {
  learningSummary: string[];
}

export default function LearningSummary({ learningSummary }: Props) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-sky-700 italic">
        Everything you have learned from this explanation — in six points.
      </p>
      <ul className="space-y-2">
        {learningSummary.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 bg-white border border-sky-100 rounded-xl px-3 py-2.5"
          >
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-200 flex items-center justify-center text-[9px] font-black text-sky-800 mt-0.5">
              {i + 1}
            </span>
            <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
