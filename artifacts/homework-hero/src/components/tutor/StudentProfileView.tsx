/**
 * StudentProfileView — "What your tutor knows about you"
 * A full-page view of the student model data.
 */

import { useMemo } from "react";
import { getTutorInsights, getOrCreateProfile } from "@/services/studentModel";
import MasteryMapView from "./MasteryMapView";

function StatBox({ value, label, color }: { value: string | number; label: string; color: string }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-3 text-center shadow-sm">
      <p className={`text-xl font-black ${color}`}>{value}</p>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function ScoreBar({ score, label, color }: { score: number; label: string; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs font-semibold text-slate-700">{label}</p>
        <p className={`text-xs font-bold ${color}`}>{score}/100</p>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all ${color.replace("text-", "bg-")}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

function InsightRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-base flex-shrink-0">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function StudentProfileView() {
  const insights = useMemo(() => getTutorInsights(), []);
  const profile  = useMemo(() => getOrCreateProfile(), []);

  const velocityLabel: Record<string, string> = {
    fast:   "Fast learner — grasps concepts quickly",
    medium: "Steady learner — consistent progress",
    slow:   "Thorough learner — prefers full detail",
  };

  const depthLabel: Record<string, string> = {
    basic:    "Basic — every tiny step explained",
    standard: "Standard — key content",
    advanced: "Advanced — concise, exam-focused",
  };

  return (
    <div className="space-y-5 pb-8">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-3xl p-5 text-white shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center text-2xl flex-shrink-0">
            🎓
          </div>
          <div>
            <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider">Your AI Tutor Profile</p>
            <p className="text-lg font-black mt-0.5 leading-tight">
              {profile.totalQuestionsAnswered === 0
                ? "Just Getting Started"
                : profile.motivationScore >= 70
                ? "Dedicated Student"
                : profile.motivationScore >= 40
                ? "Active Learner"
                : "Building Momentum"}
            </p>
            <p className="text-xs text-indigo-200 mt-1">
              {profile.totalQuestionsAnswered === 0
                ? "Solve your first question to begin building your profile."
                : `${insights.totalStudyHours}h studied · ${profile.totalQuestionsAnswered} questions solved`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-2">
        <StatBox value={`${profile.currentStreak}🔥`} label="Day Streak" color="text-orange-500" />
        <StatBox value={profile.totalQuestionsAnswered} label="Questions" color="text-indigo-600" />
        <StatBox value={`${insights.totalStudyHours}h`} label="Study Time" color="text-violet-600" />
      </div>

      {/* ── Motivation & Consistency ─────────────────────────────────────── */}
      {profile.totalQuestionsAnswered >= 3 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Student Health
          </p>
          <ScoreBar score={profile.motivationScore}  label="Motivation"   color="text-violet-600" />
          <ScoreBar score={profile.consistencyScore} label="Consistency"  color="text-blue-600" />
        </div>
      )}

      {/* ── What your tutor knows ────────────────────────────────────────── */}
      {profile.totalQuestionsAnswered >= 2 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-indigo-50 border-b border-indigo-100">
            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
              What Your Tutor Has Learned About You
            </p>
          </div>
          <div className="px-4">
            <InsightRow
              icon="⚡"
              label="Learning Speed"
              value={velocityLabel[insights.learningVelocity] ?? "Gathering data..."}
            />
            <InsightRow
              icon="📖"
              label="Preferred Depth"
              value={depthLabel[insights.preferredDepth] ?? "Basic"}
            />
            <InsightRow
              icon="🕐"
              label="Best Study Time"
              value={`You study best in the ${insights.bestStudyTime}`}
            />
            {insights.preferredSubject && (
              <InsightRow
                icon="⭐"
                label="Favourite Subject"
                value={insights.preferredSubject}
              />
            )}
            {insights.daysSinceLastStudy < 99 && (
              <InsightRow
                icon="📅"
                label="Last Studied"
                value={insights.daysSinceLastStudy === 0
                  ? "Today"
                  : insights.daysSinceLastStudy === 1
                  ? "Yesterday"
                  : `${insights.daysSinceLastStudy} days ago`}
              />
            )}
          </div>
        </div>
      )}

      {/* ── Persistent Mistakes ──────────────────────────────────────────── */}
      {insights.persistentMistakes.length > 0 && (
        <div className="bg-red-50 rounded-2xl border border-red-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider mb-3">
            Mistakes Your Tutor Is Watching
          </p>
          <ul className="space-y-2">
            {insights.persistentMistakes.slice(0, 4).map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-red-800">
                <span className="flex-shrink-0 font-bold text-red-400 mt-0.5">✗</span>
                <span className="leading-snug">{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Personalised Tips ────────────────────────────────────────────── */}
      {insights.personalizedTips.length > 0 && (
        <div className="bg-amber-50 rounded-2xl border border-amber-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-3">
            💡 Your Tutor Suggests
          </p>
          <ul className="space-y-2">
            {insights.personalizedTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                <span className="flex-shrink-0 font-bold text-amber-500 mt-0.5">→</span>
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Topics needing revision ──────────────────────────────────────── */}
      {insights.revisionDue.length > 0 && (
        <div className="bg-orange-50 rounded-2xl border border-orange-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-2">
            🔄 Due For Revision
          </p>
          <div className="flex flex-wrap gap-2">
            {insights.revisionDue.map((t, i) => (
              <span key={i} className="text-xs font-semibold bg-orange-100 border border-orange-300 text-orange-900 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Ready for advanced ───────────────────────────────────────────── */}
      {insights.readyForAdvanced.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-2">
            🚀 Ready to Go Deeper
          </p>
          <div className="flex flex-wrap gap-2">
            {insights.readyForAdvanced.map((t, i) => (
              <span key={i} className="text-xs font-semibold bg-emerald-100 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-full">
                {t}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── Mastery Map ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
          🗺️ Topic Mastery Map
        </p>
        <MasteryMapView />
      </div>

    </div>
  );
}
