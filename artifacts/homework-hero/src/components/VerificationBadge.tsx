/**
 * VerificationBadge
 *
 * Displays the Solution Verification Engine result as a compact badge that
 * expands to show per-dimension scores and any flagged inconsistencies.
 *
 * Status:
 *   verified    (score ≥ 75)  → green  "Verified ✓"
 *   needs_review (score < 75) → amber  "Needs Review ⚠"
 */

import { useState } from "react";
import type { VerificationResult } from "@/services/verificationEngine";

interface Props {
  result: VerificationResult;
}

// ─── Dimension labels ─────────────────────────────────────────────────────────

const DIMENSIONS: {
  key:   keyof VerificationResult["breakdown"];
  label: string;
  hint:  string;
}[] = [
  { key: "ocrAlignment",     label: "Scan Alignment",    hint: "Scanned text matches detected question" },
  { key: "topicConsistency", label: "Topic Match",       hint: "Solution topic aligns with detected topic" },
  { key: "answerCoherence",  label: "Answer Coherence",  hint: "Final answer is supported by the steps" },
  { key: "reasoningChain",   label: "Reasoning Chain",   hint: "Steps are sequential and complete" },
];

// ─── Score colour helper ──────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 75) return "#16a34a";  // green
  if (score >= 50) return "#d97706";  // amber
  return "#dc2626";                   // red
}

function scoreBarBg(score: number): string {
  if (score >= 75) return "#86efac";
  if (score >= 50) return "#fcd34d";
  return "#fca5a5";
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VerificationBadge({ result }: Props) {
  const [expanded, setExpanded] = useState(false);

  const isVerified = result.status === "verified";

  const badgeBg     = isVerified ? "#f0fdf4" : "#fffbeb";
  const badgeBorder = isVerified ? "#bbf7d0" : "#fde68a";
  const badgeColor  = isVerified ? "#16a34a" : "#d97706";
  const badgeIcon   = isVerified ? "✓"       : "⚠";
  const badgeLabel  = isVerified ? "Verified" : "Needs Review";

  const errorFlags = result.flags.filter((f) => f.severity === "error");
  const warnFlags  = result.flags.filter((f) => f.severity === "warn");

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: badgeBorder }}
    >
      {/* ── Badge header row ── */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        style={{ backgroundColor: badgeBg }}
        aria-expanded={expanded}
      >
        {/* Status icon */}
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2"
          style={{ color: badgeColor, borderColor: badgeBorder, backgroundColor: "white" }}
        >
          {badgeIcon}
        </div>

        {/* Label + score */}
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
            Solution Verification
          </p>
          <p className="text-sm font-bold leading-tight" style={{ color: badgeColor }}>
            {badgeLabel}
          </p>
        </div>

        {/* Score pill */}
        <div
          className="flex-shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl border-2 font-black"
          style={{ color: badgeColor, borderColor: badgeBorder, backgroundColor: "white" }}
        >
          <span className="text-base leading-none">{result.score}</span>
          <span className="text-[9px] font-bold text-slate-400 leading-none">/100</span>
        </div>

        {/* Expand chevron */}
        <span
          className="flex-shrink-0 text-slate-400 text-xs ml-1 transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div className="px-4 pb-4 pt-3 space-y-4 bg-white border-t" style={{ borderColor: `${badgeBorder}80` }}>

          {/* Dimension breakdown bars */}
          <div className="space-y-2.5">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Verification Breakdown
            </p>
            {DIMENSIONS.map(({ key, label, hint }) => {
              const value = result.breakdown[key];
              return (
                <div key={key}>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[11px] font-medium text-slate-600 w-32 flex-shrink-0 truncate">
                      {label}
                    </span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${value}%`, backgroundColor: scoreBarBg(value) }}
                      />
                    </div>
                    <span
                      className="text-[11px] font-bold w-7 text-right flex-shrink-0"
                      style={{ color: scoreColor(value) }}
                    >
                      {value}%
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 pl-[8.5rem] leading-tight">{hint}</p>
                </div>
              );
            })}
          </div>

          {/* Flags */}
          {result.flags.length === 0 && (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5">
              <span className="text-emerald-600 text-sm">✓</span>
              <p className="text-xs font-medium text-emerald-700">
                No inconsistencies detected — solution passed all checks.
              </p>
            </div>
          )}

          {errorFlags.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-red-500 uppercase tracking-wider">
                Errors
              </p>
              {errorFlags.map((flag) => (
                <div
                  key={flag.code}
                  className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5"
                >
                  <span className="text-red-500 text-sm flex-shrink-0 mt-0.5">✕</span>
                  <p className="text-xs text-red-800 leading-relaxed">{flag.message}</p>
                </div>
              ))}
            </div>
          )}

          {warnFlags.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider">
                Warnings
              </p>
              {warnFlags.map((flag) => (
                <div
                  key={flag.code}
                  className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5"
                >
                  <span className="text-amber-500 text-sm flex-shrink-0 mt-0.5">⚠</span>
                  <p className="text-xs text-amber-900 leading-relaxed">{flag.message}</p>
                </div>
              ))}
            </div>
          )}

          {/* Verification timestamp */}
          <p className="text-[10px] text-slate-400 text-right">
            Verified {new Date(result.verifiedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      )}
    </div>
  );
}
