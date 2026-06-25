/**
 * useTeacherReview — submit and fetch teacher reviews.
 *
 * Abstracts all /api/reviews calls so components stay lean.
 */

import { useState, useCallback } from "react";
import type { AIResponse }       from "@/services/aiSolver";

// ─── Types (mirrors DB shape) ─────────────────────────────────────────────────

export type Verdict = "correct" | "partially_correct" | "incorrect";

export interface TeacherReviewRecord {
  id:                  string;
  solutionId:          string;
  questionText:        string;
  subject:             string;
  topic:               string;
  solutionSource:      string | null;
  reviewerClerkId:     string;
  reviewerName:        string | null;
  verdict:             Verdict;
  comment:             string | null;
  verificationScore:   number | null;
  confidenceScore:     number | null;
  adjustedConfidence:  number | null;
  createdAt:           string;
  updatedAt:           string;
}

export interface ReviewStats {
  topic:                 string;
  subject:               string;
  totalReviews:          number;
  correctPct:            number;
  partialPct:            number;
  incorrectPct:          number;
  avgAdjustedConfidence: number;
  /** -15 to +15 — applied to the composite confidence score */
  confidenceBoost:       number;
}

export interface SubmitPayload {
  verdict:            Verdict;
  comment?:           string;
  adjustedConfidence?: number;
  reviewerName?:      string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export type SubmitState = "idle" | "submitting" | "success" | "error";

export function useTeacherReview(solution: AIResponse) {
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const [submitted,   setSubmitted]   = useState<TeacherReviewRecord | null>(null);

  const submit = useCallback(async (payload: SubmitPayload) => {
    setSubmitState("submitting");
    setSubmitError("");
    try {
      const body = {
        solutionId:         solution.id,
        questionText:       solution.detectedQuestion || "Unknown question",
        subject:            solution.subject,
        topic:              solution.topic,
        solutionSource:     solution.source,
        verdict:            payload.verdict,
        comment:            payload.comment?.trim() || undefined,
        adjustedConfidence: payload.adjustedConfidence,
        reviewerName:       payload.reviewerName,
        verificationScore:  solution.verificationResult?.score,
        confidenceScore:    solution.confidenceBreakdown?.composite,
      };

      const res = await fetch("/api/reviews", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });

      if (!res.ok) {
        if (res.status === 401) throw new Error("Please sign in to submit a review.");
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { message?: string }).message ?? `Error ${res.status}`);
      }

      const record: TeacherReviewRecord = await res.json();
      setSubmitted(record);
      setSubmitState("success");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to submit review.");
      setSubmitState("error");
    }
  }, [solution]);

  const reset = useCallback(() => {
    setSubmitState("idle");
    setSubmitError("");
    setSubmitted(null);
  }, []);

  return { submitState, submitError, submitted, submit, reset };
}

// ─── Dashboard helpers (standalone, no React state) ──────────────────────────

export async function fetchReviews(params?: {
  subject?: string;
  topic?:   string;
  verdict?: string;
  limit?:   number;
  offset?:  number;
}): Promise<TeacherReviewRecord[]> {
  const qs = new URLSearchParams();
  if (params?.subject) qs.set("subject", params.subject);
  if (params?.topic)   qs.set("topic",   params.topic);
  if (params?.verdict) qs.set("verdict", params.verdict);
  if (params?.limit)   qs.set("limit",   String(params.limit));
  if (params?.offset)  qs.set("offset",  String(params.offset));

  const res = await fetch(`/api/reviews?${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
  return res.json();
}

export async function fetchReviewStats(params?: {
  subject?: string;
  topic?:   string;
}): Promise<ReviewStats[]> {
  const qs = new URLSearchParams();
  if (params?.subject) qs.set("subject", params.subject);
  if (params?.topic)   qs.set("topic",   params.topic);

  const res = await fetch(`/api/reviews/stats?${qs}`);
  if (!res.ok) throw new Error(`Failed to fetch review stats: ${res.status}`);
  return res.json();
}

export async function deleteReview(id: string): Promise<void> {
  const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `Error ${res.status}`);
  }
}
