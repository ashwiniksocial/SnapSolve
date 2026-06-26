import { useState, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { SOLUTION_BANK, type AIResponse } from "@/data/solutionBank";
import { useProgress } from "@/hooks/useProgress";
import { useStreak } from "@/hooks/useStreak";
import { useSession } from "@/hooks/useSession";

// ─── Save for Revision ─────────────────────────────────────────────────────────
const SAVED_KEY = "studyai-saved-topics";
function loadSaved(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]")); } catch { return new Set(); }
}
function persistSaved(s: Set<string>) {
  localStorage.setItem(SAVED_KEY, JSON.stringify([...s]));
}

// ─── Main page ─────────────────────────────────────────────────────────────────
const SUBJECTS_LIST: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function QuestionWorkspace() {
  const { getSubjectStats, recordSolve, progress } = useProgress();
  const { streak } = useStreak();
  const { update } = useSession();
  const [, navigate] = useLocation();

  const [subject, setSubject]       = useState<Subject>("Mathematics");
  const [entryIdx, setEntryIdx]     = useState(0);
  const [understood, setUnderstood] = useState<Set<string>>(new Set());
  const [saved, setSaved]           = useState<Set<string>>(loadSaved);
  const [justUnderstood, setJustUnderstood] = useState(false);

  const cfg         = SUBJECTS[subject];
  const bankEntries = SOLUTION_BANK.filter((e) => e.subject === subject);
  const entry: AIResponse = bankEntries[entryIdx % bankEntries.length] ?? SOLUTION_BANK[0];

  // Per-topic mastery from progress
  const subjectData = progress[subject] ?? {};
  const topicRecord = subjectData[entry.topic];
  const masteryPct  = topicRecord
    ? Math.round((topicRecord.correct / topicRecord.solved) * 100)
    : null;

  const topicKey   = `${subject}::${entry.topic}`;
  const isUnderstood = understood.has(topicKey);
  const isSaved      = saved.has(topicKey);

  const handleSubjectChange = (s: Subject) => {
    setSubject(s);
    setEntryIdx(0);
    setJustUnderstood(false);
  };

  const handleTryAnother = () => {
    setEntryIdx((i) => i + 1);
    setJustUnderstood(false);
  };

  const handleMarkUnderstood = () => {
    if (isUnderstood) return;
    recordSolve(subject, entry.topic, true);
    setUnderstood((s) => new Set(s).add(topicKey));
    setJustUnderstood(true);
  };

  const handleSave = () => {
    setSaved((prev) => {
      const next = new Set(prev);
      isSaved ? next.delete(topicKey) : next.add(topicKey);
      persistSaved(next);
      return next;
    });
  };

  const handleGetLesson = useCallback(() => {
    update({ question: entry.detectedQuestion, practiceTopic: entry.topic });
    navigate("/solution?practiceMode=1");
  }, [entry.detectedQuestion, entry.topic, update, navigate]);

  const stats = getSubjectStats(subject);

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Question Workspace</h1>
              <p className="text-sm text-slate-500 mt-0.5">Deep-dive academic study</p>
            </div>
            {streak > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <span className="text-sm">🔥</span>
                <span className="text-xs font-semibold text-amber-700">{streak} day streak</span>
              </div>
            )}
          </div>

          {/* Subject tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUBJECTS_LIST.map((s) => {
              const c = SUBJECTS[s];
              const active = s === subject;
              return (
                <button
                  key={s}
                  onClick={() => handleSubjectChange(s)}
                  className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    active ? "text-white border-transparent shadow-sm" : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={active ? { backgroundColor: c.color } : {}}
                >
                  {c.icon} {s}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-5 space-y-4">

        {/* ── Question card ── */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="h-1" style={{ backgroundColor: cfg.color }} />
          <div className="p-5">

            {/* Chapter + difficulty row */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
              >
                {cfg.icon} {entry.topic}
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                entry.difficulty === "Easy"   ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                entry.difficulty === "Medium" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                "bg-red-50 text-red-700 border-red-200"
              }`}>
                {entry.difficulty}
              </span>
              <span className="text-xs text-slate-400 font-medium ml-auto">{subject}</span>
            </div>

            {/* Question text */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Question</p>
              <p className="text-sm font-semibold text-slate-800 leading-relaxed">{entry.detectedQuestion}</p>
            </div>

            {/* Topic mastery bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs text-slate-500 font-medium">Topic Mastery: {entry.topic}</p>
                <p className="text-xs font-bold" style={{ color: cfg.color }}>
                  {masteryPct !== null ? `${masteryPct}%` : "Not attempted"}
                </p>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${masteryPct ?? 0}%`, backgroundColor: cfg.color }}
                />
              </div>
              {stats.totalSolved > 0 && (
                <p className="text-xs text-slate-400 mt-1.5">
                  {stats.totalSolved} solved this subject · {stats.accuracy}% accuracy overall
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Key Concepts ── */}
        {entry.keyConcepts.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Key Concepts</p>
            <div className="flex flex-wrap gap-2">
              {entry.keyConcepts.map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full border"
                  style={{ backgroundColor: cfg.light, color: cfg.color, borderColor: cfg.border }}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── Primary CTA: Get AI Lesson ── */}
        <button
          onClick={handleGetLesson}
          className="w-full py-4 rounded-2xl font-semibold text-sm text-white shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
          style={{ backgroundColor: cfg.color }}
        >
          <span>✦</span>
          Get Full AI Lesson for This Question
          <span className="opacity-75">→</span>
        </button>

        {/* ── Mark as Understood ── */}
        <button
          onClick={handleMarkUnderstood}
          disabled={isUnderstood}
          className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all active:scale-95 flex items-center justify-center gap-2 ${
            isUnderstood
              ? "bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
              : "bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300"
          }`}
        >
          {isUnderstood ? (
            <><span>✓</span> Marked as Understood{justUnderstood ? " — well done!" : ""}</>
          ) : (
            <><span>✓</span> Mark as Understood</>
          )}
        </button>

        {/* ── Secondary buttons ── */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/practice">
            <button className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-95 transition-all text-center">
              ✎ Practice Similar
            </button>
          </Link>
          <button
            onClick={handleTryAnother}
            className="w-full py-3.5 rounded-2xl font-semibold text-sm border-2 border-slate-200 bg-white text-slate-700 hover:border-slate-300 active:scale-95 transition-all"
          >
            ↻ Try Another
          </button>
        </div>

        {/* ── Save for Revision ── */}
        <div className="pb-4">
          <button
            onClick={handleSave}
            className={`w-full py-3.5 rounded-2xl font-semibold text-sm border-2 transition-all active:scale-95 flex items-center justify-center gap-2 ${
              isSaved
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
            }`}
          >
            <span>{isSaved ? "★" : "☆"}</span>
            {isSaved ? "Saved for Revision" : "Save for Revision"}
          </button>
        </div>

      </div>
    </div>
  );
}
