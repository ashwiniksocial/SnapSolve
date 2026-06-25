/**
 * teacher_reviews — one row per teacher verdict on an AI-generated solution.
 *
 * A "solution" is identified by (solutionId, questionText, subject, topic).
 * solutionId is the ephemeral AIResponse.id from the frontend — not a FK.
 *
 * verdict values:
 *   correct           — teacher confirms the answer and reasoning are right
 *   partially_correct — answer is right but steps have errors or gaps
 *   incorrect         — answer or key reasoning is wrong
 *
 * Confidence influence:
 *   adjustedConfidence is set by the teacher during review to record what
 *   they believe the correct confidence score should be. The stats endpoint
 *   averages these to produce a topic-level confidence boost for future solves.
 */

import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema }                       from "drizzle-zod";
import { z }                                        from "zod/v4";

export const teacherReviewsTable = pgTable("teacher_reviews", {
  id: uuid("id").primaryKey().defaultRandom(),

  // ── Solution identity ─────────────────────────────────────────────────────
  /** Ephemeral AIResponse.id — e.g. "ai-1719000000000" or "scan-alg-quadratic" */
  solutionId:    text("solution_id").notNull(),
  questionText:  text("question_text").notNull(),
  subject:       text("subject").notNull(),        // Mathematics | Physics | Chemistry
  topic:         text("topic").notNull(),
  /** Source that generated the solution: bank | openai | fallback */
  solutionSource: text("solution_source"),

  // ── Teacher identity ──────────────────────────────────────────────────────
  /** Clerk user ID of the reviewer (required — only authenticated users can review) */
  reviewerClerkId: text("reviewer_clerk_id").notNull(),
  /** Display name cached from Clerk at time of review */
  reviewerName:    text("reviewer_name"),

  // ── Verdict ───────────────────────────────────────────────────────────────
  verdict: text("verdict").notNull(), // correct | partially_correct | incorrect

  /** Optional free-text comment from the teacher */
  comment: text("comment"),

  // ── Scores at time of review ──────────────────────────────────────────────
  /** Verification Engine composite score (0–100) at the time of solve */
  verificationScore: integer("verification_score"),
  /** Confidence Engine composite score (0–100) at the time of solve */
  confidenceScore:   integer("confidence_score"),
  /**
   * Teacher-adjusted confidence (0–100).
   * If the teacher marks "correct" this is typically set to ≥80.
   * If "incorrect", typically ≤30.
   * Used to compute topic-level confidence boosts for future solutions.
   */
  adjustedConfidence: integer("adjusted_confidence"),

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTeacherReviewSchema = createInsertSchema(teacherReviewsTable).omit({
  id: true, createdAt: true, updatedAt: true,
}).extend({
  verdict: z.enum(["correct", "partially_correct", "incorrect"]),
  verificationScore:  z.number().int().min(0).max(100).optional(),
  confidenceScore:    z.number().int().min(0).max(100).optional(),
  adjustedConfidence: z.number().int().min(0).max(100).optional(),
});

export type InsertTeacherReview = z.infer<typeof insertTeacherReviewSchema>;
export type TeacherReview       = typeof teacherReviewsTable.$inferSelect;
