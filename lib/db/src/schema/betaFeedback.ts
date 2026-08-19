/**
 * beta_feedback — lightweight qualitative input from controlled-beta testers.
 *
 * The Clerk user ID is retained for founder follow-up, while the submitted
 * feedback remains intentionally small and does not duplicate user profiles.
 */

import { pgTable, text, integer, timestamp, uuid, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const betaFeedbackTable = pgTable("beta_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull(),
  testerType: text("tester_type").notNull(), // student | parent
  experienceRating: integer("experience_rating").notNull(), // 1–5
  issueText: text("issue_text"),
  likedText: text("liked_text"),
  contextReference: text("context_reference"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("beta_feedback_created_at_idx").on(table.createdAt),
  index("beta_feedback_clerk_user_id_idx").on(table.clerkUserId),
]);

export const insertBetaFeedbackSchema = createInsertSchema(betaFeedbackTable).omit({
  id: true, clerkUserId: true, createdAt: true,
}).extend({
  testerType: z.enum(["student", "parent"]),
  experienceRating: z.number().int().min(1).max(5),
  issueText: z.string().trim().max(2000).optional().nullable(),
  likedText: z.string().trim().max(2000).optional().nullable(),
  contextReference: z.string().trim().max(300).optional().nullable(),
});

export type InsertBetaFeedback = z.infer<typeof insertBetaFeedbackSchema>;
export type BetaFeedback = typeof betaFeedbackTable.$inferSelect;