import { useState } from "react";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";
import { useProgress } from "@/hooks/useProgress";
import { SOLUTION_BANK } from "@/data/solutionBank";
import SimilarQuestions from "@/components/SimilarQuestions";

const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function Practice() {
  const { session, update } = useSession();
  const { getSubjectStats } = useProgress();
  const cfg = SUBJECTS[session.subject];

  const subjectEntries = SOLUTION_BANK.filter((e) => e.subject === session.subject);
  const [selectedId, setSelectedId] = useState<string>(subjectEntries[0]?.id ?? "");

  const activeSolution = subjectEntries.find((e) => e.id === selectedId) ?? subjectEntries[0];
  const stats = getSubjectStats(session.subject);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-slate-900">Practice</h1>
          <p className="text-sm text-slate-500 mt-0.5">Topic-wise questions with analytics</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* Subject tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {subjects.map((s) => {
            const c = SUBJECTS[s];
            const active = session.subject === s;
            return (
              <button
                key={s}
                onClick={() => {
                  const firstEntry = SOLUTION_BANK.find((e) => e.subject === s);
                  update({ subject: s });
                  setSelectedId(firstEntry?.id ?? "");
                }}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  active ? "text-white border-transparent shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
                style={active ? { backgroundColor: c.color } : {}}
              >
                {c.icon} {s}
              </button>
            );
          })}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Solved",   value: stats.totalSolved },
            { label: "Accuracy", value: stats.totalSolved > 0 ? `${stats.accuracy}%` : "—" },
            { label: "Weak",     value: stats.weakTopics.length },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-3 text-center shadow-sm">
              <p className="text-lg font-bold" style={{ color: cfg.color }}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
            </div>
          ))}
        </div>

        {/* Weak topic alert */}
        {stats.weakTopics.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-start gap-2">
            <span className="text-lg mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Focus areas</p>
              <p className="text-xs text-red-600 mt-0.5">{stats.weakTopics.join(" · ")}</p>
            </div>
          </div>
        )}

        {/* Topic picker */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Choose Topic</p>
          <div className="flex flex-wrap gap-2">
            {subjectEntries.map((entry) => {
              const isWeak = stats.weakTopics.includes(entry.topic);
              const isActive = selectedId === entry.id;
              return (
                <button
                  key={entry.id}
                  onClick={() => setSelectedId(entry.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "text-white border-transparent shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                  style={isActive ? { backgroundColor: cfg.color } : {}}
                >
                  {entry.topic}
                  {isWeak && !isActive && <span className="text-red-400">⚠</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Practice question set */}
        {activeSolution && (
          <div
            key={activeSolution.id}
            className="slide-in"
          >
            <SimilarQuestions
              questions={activeSolution.similarQuestions}
              topic={activeSolution.topic}
              subject={session.subject}
            />
          </div>
        )}

      </div>
    </div>
  );
}
