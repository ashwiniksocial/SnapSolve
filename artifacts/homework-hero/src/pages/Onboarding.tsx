import { useState } from "react";
import { useLocation } from "wouter";
import { useProfile } from "@/hooks/useProfile";

const BOARDS = ["CBSE", "ICSE", "State Board", "Other"] as const;
const CLASSES = [6, 7, 8, 9] as const;

export default function Onboarding() {
  const { profile, updateProfile } = useProfile();
  const [, navigate]  = useLocation();
  const [board, setBoard]      = useState<string | null>(profile.board);
  const [classLevel, setClass] = useState<number | null>(profile.classLevel);
  const [saving, setSaving]    = useState(false);

  async function handleSave() {
    if (!board || !classLevel) return;
    setSaving(true);
    try {
      await updateProfile({ board, classLevel });
      navigate("/");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">🎓</div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome to StudyAI</h1>
          <p className="text-sm text-slate-500 mt-2">Tell us about yourself so we can personalise your experience.</p>
        </div>

        {/* Board selection */}
        <div className="mb-6">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Your Board</p>
          <div className="grid grid-cols-2 gap-2">
            {BOARDS.map(b => (
              <button
                key={b}
                onClick={() => setBoard(b)}
                className={`py-3 px-4 rounded-2xl border-2 text-sm font-semibold transition-all ${
                  board === b
                    ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Class selection */}
        <div className="mb-8">
          <p className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3">Your Class</p>
          <div className="grid grid-cols-4 gap-2">
            {CLASSES.map(c => (
              <button
                key={c}
                onClick={() => setClass(c)}
                className={`py-3 rounded-2xl border-2 text-sm font-bold transition-all ${
                  classLevel === c
                    ? "border-indigo-600 bg-indigo-600 text-white"
                    : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={handleSave}
          disabled={!board || !classLevel || saving}
          className={`w-full py-4 rounded-2xl text-sm font-bold transition-all ${
            board && classLevel && !saving
              ? "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving…" : "Get Started →"}
        </button>

        <button
          onClick={() => navigate("/")}
          className="w-full mt-3 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
