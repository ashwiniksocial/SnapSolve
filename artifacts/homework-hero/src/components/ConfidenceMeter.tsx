/**
 * ConfidenceMeter
 *
 * Displays a composite answer-confidence score with:
 *  - An SVG circular gauge (ring) showing the composite 0–100 score
 *  - A tier label: High confidence / Medium confidence / Verify answer
 *  - Four signal-breakdown bars: Scan Quality, Topic Match, Question Bank, Answer Quality
 *
 * Usage:
 *   <ConfidenceMeter breakdown={solution.confidenceBreakdown} />
 *   <ConfidenceMeter breakdown={...} compact />   ← gauge + label only, no bars
 */

import type { ConfidenceBreakdown } from "@/data/solutionBank";
import { getConfidenceTier }         from "@/services/confidenceEngine";

interface Props {
  breakdown: ConfidenceBreakdown;
  /** When true, renders only the ring + label without the breakdown bars */
  compact?: boolean;
}

// SVG ring geometry
const R    = 28;
const SW   = 6;
const CIRC = 2 * Math.PI * R; // ≈ 175.93

const SIGNALS: { key: keyof Omit<ConfidenceBreakdown, "composite">; label: string }[] = [
  { key: "ocr",          label: "Scan Quality"   },
  { key: "topic",        label: "Topic Match"    },
  { key: "bankMatch",    label: "Question Bank"  },
  { key: "ai",           label: "Answer Quality" },
  { key: "verification", label: "Verification"   },
];

function SignalBar({ value, accentColor }: { value: number; accentColor: string }) {
  const barColor =
    value >= 70 ? accentColor :
    value >= 40 ? "#f59e0b" :
                  "#ef4444";

  return (
    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${value}%`, backgroundColor: barColor }}
      />
    </div>
  );
}

export default function ConfidenceMeter({ breakdown, compact = false }: Props) {
  const tier     = getConfidenceTier(breakdown.composite);
  const progress = (breakdown.composite / 100) * CIRC;

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: tier.border }}
    >
      {/* ── Ring + tier label row ── */}
      <div
        className="flex items-center gap-4 px-4 py-4"
        style={{ backgroundColor: tier.bg }}
      >
        {/* Circular gauge */}
        <div className="flex-shrink-0 relative" style={{ width: 64, height: 64 }}>
          <svg width="64" height="64" style={{ transform: "rotate(-90deg)" }}>
            {/* Track ring */}
            <circle
              cx="32" cy="32" r={R}
              fill="none"
              stroke={tier.ring}
              strokeWidth={SW}
            />
            {/* Progress arc */}
            <circle
              cx="32" cy="32" r={R}
              fill="none"
              stroke={tier.color}
              strokeWidth={SW}
              strokeLinecap="round"
              strokeDasharray={`${progress} ${CIRC - progress}`}
            />
          </svg>
          {/* Score label (centred, un-rotated by using absolute positioning) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-[15px] font-black leading-none"
              style={{ color: tier.color }}
            >
              {breakdown.composite}
            </span>
            <span className="text-[9px] font-bold text-slate-400 leading-none mt-0.5">
              / 100
            </span>
          </div>
        </div>

        {/* Tier info */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">
            Answer Confidence
          </p>
          <p className="text-sm font-bold leading-tight" style={{ color: tier.color }}>
            {tier.emoji} {tier.label}
          </p>
          <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
            {tier.description}
          </p>
        </div>
      </div>

      {/* ── Signal breakdown bars ── */}
      {!compact && (
        <div
          className="px-4 py-3 space-y-2.5 border-t"
          style={{ borderColor: `${tier.border}80` }}
        >
          {SIGNALS.map(({ key, label }) => {
            const value = breakdown[key];
            return (
              <div key={key} className="flex items-center gap-3">
                <span className="text-[11px] font-medium text-slate-500 flex-shrink-0 w-28 truncate">
                  {label}
                </span>
                <SignalBar value={value} accentColor={tier.color} />
                <span className="text-[11px] font-bold text-slate-500 w-7 text-right flex-shrink-0">
                  {value}%
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
