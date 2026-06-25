import { useState } from "react";
import { useUser, useClerk } from "@clerk/react";
import { useLocation } from "wouter";
import { useProfile } from "@/hooks/useProfile";

const BOARDS   = ["CBSE", "ICSE", "State Board", "Other"] as const;
const CLASSES  = [6, 7, 8, 9, 10, 11, 12] as const;

export default function Profile() {
  const { user, isLoaded } = useUser();
  const { signOut }        = useClerk();
  const [, navigate]       = useLocation();
  const { profile, updateProfile, isSyncing } = useProfile();

  const [board, setBoard]      = useState<string | null>(profile.board);
  const [classLevel, setClass] = useState<number | null>(profile.classLevel);
  const [saving, setSaving]    = useState(false);
  const [saved, setSaved]      = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile({ board, classLevel });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const name    = user?.fullName ?? user?.firstName ?? "";
  const email   = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const initial = (name[0] ?? email[0] ?? "U").toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-lg mx-auto px-4 pt-6 pb-24">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/")} className="text-slate-400 hover:text-slate-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-slate-900">Student Profile</h1>
        </div>

        {/* User card */}
        {isLoaded && user && (
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {initial}
              </div>
              <div className="min-w-0">
                {name && <p className="font-bold text-slate-900 truncate">{name}</p>}
                <p className="text-sm text-slate-500 truncate">{email}</p>
                {isSyncing && (
                  <p className="text-xs text-indigo-500 mt-0.5">⟳ Syncing…</p>
                )}
                {!isSyncing && profile.board && profile.classLevel && (
                  <p className="text-xs text-emerald-600 font-medium mt-0.5">
                    ✓ {profile.board} · Class {profile.classLevel}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Academic profile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-4">
          <div className="px-4 py-3.5 border-b border-slate-100">
            <p className="text-sm font-bold text-slate-700">Academic Profile</p>
            <p className="text-xs text-slate-400 mt-0.5">Used to personalise your questions and progress</p>
          </div>

          <div className="p-4 space-y-5">
            {/* Board */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Board</p>
              <div className="grid grid-cols-2 gap-2">
                {BOARDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBoard(b)}
                    className={`py-2.5 px-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      board === b
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Class */}
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Class</p>
              <div className="grid grid-cols-4 gap-2">
                {CLASSES.map(c => (
                  <button
                    key={c}
                    onClick={() => setClass(c)}
                    className={`py-2.5 rounded-xl border-2 text-sm font-bold transition-all ${
                      classLevel === c
                        ? "border-indigo-600 bg-indigo-600 text-white"
                        : "border-slate-200 text-slate-700 hover:border-slate-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className={`w-full py-3 rounded-xl text-sm font-bold transition-all ${
                saved
                  ? "bg-emerald-500 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800"
              } disabled:opacity-60`}
            >
              {saving ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Cloud sync status */}
        {!user && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
            <p className="text-sm font-semibold text-indigo-800">📱 Progress saved locally</p>
            <p className="text-xs text-indigo-600 mt-1">Sign in to sync your progress across all your devices.</p>
            <button
              onClick={() => navigate("/sign-in")}
              className="mt-3 text-sm font-bold text-indigo-600 hover:text-indigo-700"
            >
              Sign In →
            </button>
          </div>
        )}

        {/* Sign out */}
        {user && (
          <button
            onClick={() => signOut({ redirectUrl: "/" })}
            className="w-full py-3.5 rounded-2xl border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        )}
      </div>
    </div>
  );
}
