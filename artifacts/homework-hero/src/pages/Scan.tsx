import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { SUBJECTS, type Subject } from "@/data/subjects";
import { useSession } from "@/hooks/useSession";

const subjects: Subject[] = ["Physics", "Chemistry", "Mathematics"];

export default function Scan() {
  const { session, update } = useSession();
  const [, navigate] = useLocation();
  const [tab, setTab] = useState<"type" | "photo">("type");
  const [question, setQuestion] = useState("");
  const [photoName, setPhotoName] = useState("");
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cfg = SUBJECTS[session.subject];

  const canSolve = tab === "type" ? question.trim().length > 10 : !!photoName;

  const handleSolve = () => {
    if (!canSolve) return;
    const finalQ = tab === "photo" && !question.trim()
      ? `[Photo uploaded: ${photoName}] Solve this ${session.subject} problem step by step.`
      : question;
    update({ question: finalQ });
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/solution");
    }, 1400);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto">
          <h1 className="text-xl font-bold text-slate-900">Scan Question</h1>
          <p className="text-sm text-slate-500 mt-0.5">Get an AI step-by-step solution instantly</p>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-5">

        {/* Subject pills */}
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject</p>
          <div className="flex gap-2">
            {subjects.map((s) => {
              const c = SUBJECTS[s];
              const active = session.subject === s;
              return (
                <button
                  key={s}
                  onClick={() => update({ subject: s })}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                    active ? "text-white border-transparent" : "bg-white text-slate-600 border-slate-200"
                  }`}
                  style={active ? { backgroundColor: c.color } : {}}
                >
                  <span>{c.icon}</span> {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input method tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="flex border-b border-slate-100">
            {(["type", "photo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  tab === t ? "text-indigo-600 border-b-2 border-indigo-600" : "text-slate-500"
                }`}
              >
                {t === "type" ? "✏️ Type Question" : "📷 Upload Photo"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {tab === "type" ? (
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={`Type your ${session.subject} question here…\n\ne.g. "A particle moves with initial velocity 5 m/s and acceleration 2 m/s². Find displacement after 4 seconds."`}
                className="w-full min-h-[160px] text-sm text-slate-800 placeholder-slate-400 resize-none outline-none leading-relaxed"
              />
            ) : (
              <div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhotoName(f.name);
                  }}
                />
                <button
                  onClick={() => fileRef.current?.click()}
                  className="w-full border-2 border-dashed border-slate-300 rounded-xl py-10 flex flex-col items-center gap-2 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  {photoName ? (
                    <>
                      <span className="text-4xl">✅</span>
                      <p className="text-sm font-semibold text-emerald-600">{photoName}</p>
                      <p className="text-xs text-slate-400">Tap to change</p>
                    </>
                  ) : (
                    <>
                      <span className="text-4xl">📷</span>
                      <p className="text-sm font-semibold text-slate-600">Tap to take photo or upload</p>
                      <p className="text-xs text-slate-400">JPG, PNG supported</p>
                    </>
                  )}
                </button>
                {photoName && (
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Add context about the question (optional)…"
                    className="mt-3 w-full min-h-[60px] text-sm text-slate-800 placeholder-slate-400 resize-none outline-none border border-slate-200 rounded-xl p-3"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Tips for best results</p>
          <ul className="space-y-1.5">
            {[
              "Include all given values and units",
              "Mention which quantity to find",
              "For photos, ensure good lighting and clarity",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-indigo-400 mt-0.5">•</span> {tip}
              </li>
            ))}
          </ul>
        </div>

        {/* Solve button */}
        <button
          onClick={handleSolve}
          disabled={!canSolve || loading}
          className={`w-full py-4 rounded-2xl font-semibold text-white text-base transition-all flex items-center justify-center gap-2 ${
            canSolve && !loading ? "active:scale-95 shadow-md" : "opacity-40 cursor-not-allowed"
          }`}
          style={{ backgroundColor: cfg.color }}
        >
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating solution…
            </>
          ) : (
            <>
              <span>✦</span> Get AI Solution
            </>
          )}
        </button>
      </div>
    </div>
  );
}
