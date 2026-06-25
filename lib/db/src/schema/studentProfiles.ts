/**
 * student_profiles — one row per authenticated user (Clerk user ID as key).
 * Board and class are optional until the user completes onboarding.
 * Firestore-ready: field names are camelCase and flat.
 */

import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentProfilesTable = pgTable("student_profiles", {
  id:          uuid("id").primaryKey().defaultRandom(),
  clerkUserId: text("clerk_user_id").notNull().unique(),

  // ── Academic identity (set during onboarding) ─────────────────────────────
  board:        text("board"),            // CBSE | ICSE | State | null
  classLevel:   integer("class_level"),  // 6–12 | null

  // ── Display ───────────────────────────────────────────────────────────────
  displayName:  text("display_name"),    // cached from Clerk, nullable

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertStudentProfileSchema = createInsertSchema(studentProfilesTable).omit({
  id: true, createdAt: true, updatedAt: true,
});

export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type StudentProfile       = typeof studentProfilesTable.$inferSelect;
