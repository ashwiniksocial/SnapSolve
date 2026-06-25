/**
 * TeacherDashboard — /teacher
 *
 * Review management dashboard for teachers:
 *  - Summary stats (total reviews, % correct/partial/incorrect)
 *  - Subject & verdict filters
 *  - Review list with verdict badge, topic, comment, reviewer
 *  - Per-topic confidence boost indicators
 *  - Delete own reviews
 */

import { useState, useEffect, useCallback } from "react";
import { Link }                              from "wouter";
import {
  fetchReviews,
  fetchReviewStats,
  deleteReview,
  type TeacherReviewRecord,
  type ReviewStats,
  type Verdict,
} from "@/hooks/useTeacherReview";

// ─── Verdict display ──────────────────────────────────────────────────────────

const VERDICT_STYLE: Record<Verdict, { label: string; icon: string; color: string; bg: string; border: string }> = {
  correct:           { label: "Correct",           icon: "✓", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0" },
  partially_correct: { label: "Partially Correct", icon: "◑", color: "#d97706", bg: "#fffbeb", border: "#fde68a" },
  incorrect:         { label: "Incorrect",         icon: "✕", color: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
};

const SUBJECTS = ["Mathematics", "Physics", "Chemistry"];
const VERDICTS: { value: string; label: string }[] = [
  { value: "",                  label: "All Verdicts"        },
  { value: "correct",           label: "Correct"             },
  { value: "partially_correct", label: "Partially Correct"   },
  { value: "incorrect",         label: "Incorrect"           },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label, value, color, bg, border,
}: { label: string; value: string | number; color: string; bg: string; border: string }) {
  return (
    <div className="rounded-2xl border p-4" style={{ backgroundColor: bg, borderColor: border }}>
      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
    </div>
  );
}

function BoostBadge({ boost }: { boost: number }) {
  if (boost === 0) return null;
  const positive = boost > 0;
  return (
    <span
      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full border ml-1"
      style={{
        color:           positive ? "#16a34a" : "#dc2626",
        backgroundColor: positive ? "#f0fdf4" : "#fef2f2",
        borderColor:     positive ? "#bbf7d0" : "#fecaca",
      }}
    >
      {positive ? "+" : ""}{boost}% boost
    </span>
  );
}

function ReviewCard({
  review,
  onDelete,
}: { review: TeacherReviewRecord; onDelete: (id: string) => void }) {
  const [deleting, setDeleting] = useState(false);
  const vs = VERDICT_STYLE[review.verdict];

  const handleDelete = async () => {
    if (!confirm("Delete this review?")) return;
    setDeleting(true);
    try { await deleteReview(review.id); onDelete(review.id); }
    catch (e) { alert((e instanceof Error ? e.message : "Delete failed.")); setDeleting(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-black border-2 mt-0.5"
          style={{ color: vs.color, borderColor: vs.border, backgroundColor: vs.bg }}
        >
          {vs.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: vs.color }}>{vs.label}</span>
            <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
              {review.subject}
            </span>
            <span className="text-[10px] text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-full">
              {review.topic}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            by {review.reviewerName ?? "Anonymous"} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "short", year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex-shrink-0 text-[10px] text-slate-400 hover:text-red-500 border border-slate-200 hover:border-red-200 px-2 py-1 rounded-lg transition-colors disabled:opacity-50"
        >
          {deleting ? "…" : "Delete"}
        </button>
      </div>

      {/* Question */}
      {review.questionText && (
        <p className="text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 leading-relaxed line-clamp-3">
          Q: {review.questionText}
        </p>
      )}

      {/* Comment */}
      {review.comment && (
        <div className="border-l-2 pl-3" style={{ borderColor: vs.border }}>
          <p className="text-xs text-slate-700 leading-relaxed italic">"{review.comment}"</p>
        </div>
      )}

      {/* Score pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {review.confidenceScore != null && (
          <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Confidence: {review.confidenceScore}/100
          </span>
        )}
        {review.verificationScore != null && (
          <span className="text-[10px] text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">
            Verification: {review.verificationScore}/100
          </span>
        )}
        {review.adjustedConfidence != null && (
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
            style={{ color: vs.color, backgroundColor: vs.bg, borderColor: vs.border }}
          >
            Adjusted: {review.adjustedConfidence}/100
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TeacherDashboard() {
  const [reviews,     setReviews]     = useState<TeacherReviewRecord[]>([]);
  const [stats,       setStats]       = useState<ReviewStats[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState("");
  const [subject,     setSubject]     = useState("");
  const [verdict,     setVerdict]     = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [rv, st] = await Promise.all([
        fetchReviews({ subject: subject || undefined, verdict: verdict || undefined, limit: 100 }),
        fetchReviewStats({ subject: subject || undefined }),
      ]);
      setReviews(rv);
      setStats(st);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load reviews.");
    } finally {
      setLoading(false);
    }
  }, [subject, verdict]);

  useEffect(() => { void load(); }, [load]);

  const handleDelete = (id: string) => setReviews((prev) => prev.filter((r) => r.id !== id));

  // ── Aggregate counts ──────────────────────────────────────────────────────
  const total    = reviews.length;
  const correct  = reviews.filter((r) => r.verdict === "correct").length;
  const partial  = reviews.filter((r) => r.verdict === "partially_correct").length;
  const wrong    = reviews.filter((r) => r.verdict === "incorrect").length;

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-5 pt-10 pb-5">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Teacher Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Review solutions · Track quality</p>
          </div>
          <Link
            href="/"
            className="text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all"
          >
            ← Home
          </Link>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-5 py-6 space-y-6">

        {/* ── Summary stat cards ── */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total"    value={total}   color="#6366f1" bg="#f5f3ff" border="#ddd6fe" />
          <StatCard label="Correct"  value={correct}  color="#16a34a" bg="#f0fdf4" border="#bbf7d0" />
          <StatCard label="Partial"  value={partial}  color="#d97706" bg="#fffbeb" border="#fde68a" />
          <StatCard label="Wrong"    value={wrong}    color="#dc2626" bg="#fef2f2" border="#fecaca" />
        </div>

        {/* ── Confidence boost by topic ── */}
        {stats.filter((s) => s.confidenceBoost !== 0).length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Confidence Adjustments by Topic
            </p>
            <div className="space-y-2">
              {stats
                .filter((s) => s.confidenceBoost !== 0)
                .sort((a, b) => Math.abs(b.confidenceBoost) - Math.abs(a.confidenceBoost))
                .slice(0, 8)
                .map((s) => (
                  <div key={`${s.subject}-${s.topic}`} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 flex-1 min-w-0 truncate">{s.topic}</span>
                    <span className="text-[10px] text-slate-400">{s.totalReviews}r</span>
                    <BoostBadge boost={s.confidenceBoost} />
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── Filters ── */}
        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="flex-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-300"
          >
            <option value="">All Subjects</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={verdict}
            onChange={(e) => setVerdict(e.target.value)}
            className="flex-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-300"
          >
            {VERDICTS.map((v) => <option key={v.value} value={v.value}>{v.label}</option>)}
          </select>
          <button
            onClick={load}
            className="text-xs font-semibold text-slate-500 border border-slate-200 bg-white rounded-xl px-3 py-2 hover:bg-slate-50 active:scale-95 transition-all"
          >
            ↻
          </button>
        </div>

        {/* ── Review list ── */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}

        {!loading && error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-red-500">✕</span>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-4xl">📝</span>
            <p className="text-sm font-semibold text-slate-600">No reviews yet</p>
            <p className="text-xs text-slate-400 max-w-[240px] leading-relaxed">
              Open a solution and tap "Teacher Review" to mark it correct, partially correct, or incorrect.
            </p>
            <Link
              href="/scan"
              className="mt-2 text-xs font-bold text-indigo-600 border border-indigo-200 bg-indigo-50 px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors"
            >
              Go to Scan & Solve
            </Link>
          </div>
        )}

        {!loading && !error && reviews.length > 0 && (
          <div className="space-y-3">
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </p>
            {reviews.map((r) => (
              <ReviewCard key={r.id} review={r} onDelete={handleDelete} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
