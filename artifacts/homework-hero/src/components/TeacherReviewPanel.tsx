/**
 * TeacherReviewPanel
 *
 * Collapsible panel at the bottom of a SolutionCard that lets any
 * authenticated user (acting as a teacher) submit a verdict on the solution.
 *
 * Verdict options:
 *   ✓  Correct
 *   ◑  Partially Correct
 *   ✕  Incorrect
 *
 * Also captures an optional comment and auto-derives adjustedConfidence
 * from the verdict so the stats endpoint can compute topic-level boosts.
 */

import { useState }                          from "react";
import { useUser }                           from "@clerk/react";
import type { AIResponse }                   from "@/services/aiSolver";
import { useTeacherReview, type Verdict }    from "@/hooks/useTeacherReview";

interface Props {
  solution: AIResponse;
}

// ─── Verdict config ───────────────────────────────────────────────────────────

interface VerdictOption {
  value:       Verdict;
  label:       string;
  icon:        string;
  description: string;
  color:       string;
  bg:          string;
  border:      string;
  activeBg:    string;
  adjusted:    number;   // default adjustedConfidence for this verdict
}

const VERDICT_OPTIONS: VerdictOption[] = [
  {
    value:       "correct",
    label:       "Correct",
    icon:        "✓",
    description: "Answer and reasoning are right",
    color:       "#16a34a",
    bg:          "#f0fdf4",
    border:      "#bbf7d0",
    activeBg:    "#dcfce7",
    adjusted:    88,
  },
  {
    value:       "partially_correct",
    label:       "Partially Correct",
    icon:        "◑",
    description: "Answer right, steps have gaps",
    color:       "#d97706",
    bg:          "#fffbeb",
    border:      "#fde68a",
    activeBg:    "#fef9c3",
    adjusted:    55,
  },
  {
    value:       "incorrect",
    label:       "Incorrect",
    icon:        "✕",
    description: "Answer or key reasoning is wrong",
    color:       "#dc2626",
    bg:          "#fef2f2",
    border:      "#fecaca",
    activeBg:    "#fee2e2",
    adjusted:    20,
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TeacherReviewPanel({ solution }: Props) {
  const { isSignedIn, user } = useUser();
  const { submitState, submitError, submitted, submit, reset } =
    useTeacherReview(solution);

  const [open,     setOpen]     = useState(false);
  const [verdict,  setVerdict]  = useState<Verdict | null>(null);
  const [comment,  setComment]  = useState("");

  // ── Collapsed header ──────────────────────────────────────────────────────

  const headerBg     = submitted
    ? (submitted.verdict === "correct"           ? "#f0fdf4" :
       submitted.verdict === "partially_correct" ? "#fffbeb" : "#fef2f2")
    : "#f8fafc";
  const headerBorder = submitted
    ? (submitted.verdict === "correct"           ? "#bbf7d0" :
       submitted.verdict === "partially_correct" ? "#fde68a" : "#fecaca")
    : "#e2e8f0";
  const headerIcon   = submitted
    ? (submitted.verdict === "correct"           ? "✓" :
       submitted.verdict === "partially_correct" ? "◑" : "✕")
    : "📝";
  const headerColor  = submitted
    ? (submitted.verdict === "correct"           ? "#16a34a" :
       submitted.verdict === "partially_correct" ? "#d97706" : "#dc2626")
    : "#64748b";

  const handleSubmit = async () => {
    if (!verdict) return;
    const opt = VERDICT_OPTIONS.find((o) => o.value === verdict)!;
    await submit({
      verdict,
      comment:            comment.trim() || undefined,
      adjustedConfidence: opt.adjusted,
      reviewerName:       user?.fullName ?? user?.primaryEmailAddress?.emailAddress,
    });
  };

  return (
    <div
      className="rounded-2xl border shadow-sm overflow-hidden"
      style={{ borderColor: headerBorder }}
    >
      {/* ── Collapsed trigger ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors"
        style={{ backgroundColor: headerBg }}
        aria-expanded={open}
      >
        <span
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border"
          style={{ color: headerColor, borderColor: headerBorder, backgroundColor: "white" }}
        >
          {headerIcon}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
            Teacher Review
          </p>
          <p className="text-sm font-semibold leading-tight" style={{ color: headerColor }}>
            {submitted
              ? `Marked as ${VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.label}`
              : "Add your review"}
          </p>
        </div>
        <span
          className="flex-shrink-0 text-slate-400 text-xs ml-1 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          ▾
        </span>
      </button>

      {/* ── Expanded panel ── */}
      {open && (
        <div className="bg-white border-t px-4 py-4 space-y-4" style={{ borderColor: `${headerBorder}80` }}>

          {/* Not signed in */}
          {!isSignedIn && (
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-3">
              <span className="text-slate-400 text-base">🔒</span>
              <p className="text-sm text-slate-600">
                <a href="/sign-in" className="font-semibold text-indigo-600 underline">Sign in</a>
                {" "}to submit a teacher review.
              </p>
            </div>
          )}

          {/* Already submitted — show summary */}
          {submitted && (
            <div className="space-y-3">
              <div
                className="rounded-xl border p-3"
                style={{
                  backgroundColor: VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.bg,
                  borderColor:     VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.border,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm" style={{ color: VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.color }}>
                    {VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.icon}{" "}
                    {VERDICT_OPTIONS.find((o) => o.value === submitted.verdict)?.label}
                  </span>
                </div>
                {submitted.comment && (
                  <p className="text-xs text-slate-700 leading-relaxed mt-1">
                    "{submitted.comment}"
                  </p>
                )}
                <p className="text-[10px] text-slate-400 mt-1.5">
                  Adjusted confidence: {submitted.adjustedConfidence}/100
                </p>
              </div>
              <button
                onClick={reset}
                className="text-xs text-slate-400 hover:text-slate-600 underline"
              >
                Submit another review
              </button>
            </div>
          )}

          {/* Review form */}
          {isSignedIn && !submitted && (
            <>
              {/* Verdict selector */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Verdict
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {VERDICT_OPTIONS.map((opt) => {
                    const active = verdict === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setVerdict(opt.value)}
                        className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border text-center transition-all"
                        style={{
                          borderColor:     active ? opt.border : "#e2e8f0",
                          backgroundColor: active ? opt.activeBg : "#f8fafc",
                          color:           active ? opt.color : "#94a3b8",
                        }}
                      >
                        <span className="text-lg font-black">{opt.icon}</span>
                        <span className="text-[10px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[9px] leading-tight ${active ? "opacity-70" : "opacity-50"}`}>
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Comment */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Comment (optional)
                </p>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What's correct, what's missing, what needs fixing…"
                  rows={3}
                  maxLength={2000}
                  className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 placeholder:text-slate-400"
                />
                <p className="text-[10px] text-slate-400 text-right mt-0.5">{comment.length}/2000</p>
              </div>

              {/* Solution context pills */}
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
                  {solution.subject}
                </span>
                <span className="text-[10px] font-medium text-slate-500 bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
                  {solution.topic}
                </span>
                {solution.verificationResult && (
                  <span className={`text-[10px] font-medium px-2 py-1 rounded-full border ${
                    solution.verificationResult.status === "verified"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                      : "text-amber-700 bg-amber-50 border-amber-200"
                  }`}>
                    {solution.verificationResult.status === "verified" ? "Verified ✓" : "Needs Review ⚠"}
                    {" "}({solution.verificationResult.score})
                  </span>
                )}
              </div>

              {/* Error */}
              {submitState === "error" && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  <span className="text-red-500 text-sm flex-shrink-0">✕</span>
                  <p className="text-xs text-red-700">{submitError}</p>
                </div>
              )}

              {/* Submit button */}
              <button
                onClick={handleSubmit}
                disabled={!verdict || submitState === "submitting"}
                className="w-full py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: verdict
                    ? (VERDICT_OPTIONS.find((o) => o.value === verdict)?.color ?? "#6366f1")
                    : "#e2e8f0",
                  color: verdict ? "white" : "#94a3b8",
                }}
              >
                {submitState === "submitting" ? "Submitting…" : "Submit Review"}
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
