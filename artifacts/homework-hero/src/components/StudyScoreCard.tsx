/**
 * StudyScoreCard
 *
 * Displays the composite 0-100 Study Score as an animated SVG ring gauge
 * with a grade label and a four-row breakdown of what drives the score.
 */

import { Link } from "wouter";
import { useStudyScore } from "@/hooks/useStudyScore";

// ─── SVG ring constants ───────────────────────────────────────────────────────
const R          = 46;
const CX         = 60;
const CIRC       = 2 * Math.PI * R; // ≈ 289.03

// ─── Sub-component: animated SVG ring ─────────────────────────────────────────
function ScoreRing({ score, color }: { score: number; color: string }) {
  const offset = CIRC * (1 - score / 100);
  return (
    <svg width={CX * 2} height={CX * 2} viewBox={`0 0 ${CX * 2} ${CX * 2}`}>
      {/* Track */}
      <circle
        cx={CX} cy={CX} r={R}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={9}
      />
      {/* Progress arc */}
      <circle
        cx={CX} cy={CX} r={R}
        fill="none"
        stroke={color}
        strokeWidth={9}
        strokeLinecap="round"
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        style={{
          transform: "rotate(-90deg)",
          transformOrigin: "50% 50%",
          transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </svg>
  );
}

// ─── Sub-component: breakdown row ────────────────────────────────────────────
const BREAKDOWN_ITEMS = [
  { key: "accuracy" as const, label: "Accuracy",  icon: "🎯", color: "#4f46e5" },
  { key: "practice" as const, label: "Practice",  icon: "✎",  color: "#0ea5e9" },
  { key: "revision" as const, label: "Revision",  icon: "↺",  color: "#10b981" },
  { key: "streak"   as const, label: "Streak",    icon: "🔥", color: "#f97316" },
];

function BreakdownRow({
  icon, label, value, color,
}: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="text-sm w-5 text-center flex-shrink-0">{icon}</span>
      <span className="text-xs text-slate-500 w-16 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold text-slate-600 w-8 text-right flex-shrink-0">
        {value}%
      </span>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function StudyScoreCard() {
  const { score, grade, emoji, color, breakdown, hasData } = useStudyScore();

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4">

        {/* Title row */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Study Score</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Accuracy · Practice · Revision · Streak</p>
          </div>
          <Link href="/improvement">
            <span className="text-[11px] text-indigo-500 font-semibold hover:text-indigo-700 transition-colors cursor-pointer">
              30-Day Trend →
            </span>
          </Link>
        </div>

        {/* Ring + grade */}
        <div className="flex items-center gap-5">
          <div className="relative flex-shrink-0">
            <ScoreRing score={score} color={color} />
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black leading-none" style={{ color }}>
                {score}
              </span>
              <span className="text-[9px] font-bold text-slate-400 mt-0.5 uppercase tracking-wide">
                / 100
              </span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-lg leading-none">{emoji}</span>
              <p className="text-base font-bold text-slate-800 leading-tight">{grade}</p>
            </div>
            {hasData ? (
              <p className="text-xs text-slate-500 leading-relaxed">
                {score >= 70
                  ? "You're performing above average. Keep up the great work!"
                  : score >= 50
                  ? "Good start! Focus on revision and daily practice to push higher."
                  : "Solve more questions and revise regularly to grow your score."}
              </p>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed">
                Answer questions in Practice to start earning your Study Score.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown bars */}
      <div className="border-t border-slate-100 px-5 py-4 space-y-2.5">
        {BREAKDOWN_ITEMS.map(({ key, label, icon, color: c }) => (
          <BreakdownRow
            key={key}
            icon={icon}
            label={label}
            value={breakdown[key]}
            color={c}
          />
        ))}
      </div>
    </div>
  );
}
