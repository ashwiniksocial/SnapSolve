interface Props {
  prerequisites?:     string[];
  conceptExplanation?: string;
  questionUnderstanding?: string;
}

export default function ConceptCard({ prerequisites, conceptExplanation, questionUnderstanding }: Props) {
  return (
    <div className="space-y-4">
      {questionUnderstanding && (
        <div>
          <p className="text-xs text-sky-700 mb-2 italic">
            Assume you've forgotten the chapter — here's what this question is really asking.
          </p>
          <div className="bg-white border border-sky-200 rounded-xl px-4 py-3">
            <p className="text-sm text-slate-700 leading-relaxed">{questionUnderstanding}</p>
          </div>
        </div>
      )}

      {conceptExplanation && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2.5">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-1">The Concept</p>
          <p className="text-sm text-slate-700 leading-relaxed">{conceptExplanation}</p>
        </div>
      )}

      {(prerequisites?.length ?? 0) > 0 && (
        <div>
          <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-2">
            Before we solve — make sure you know these:
          </p>
          <ul className="space-y-2">
            {prerequisites!.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-sky-200 border border-sky-300 flex items-center justify-center text-[9px] font-bold text-sky-800 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700 leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
