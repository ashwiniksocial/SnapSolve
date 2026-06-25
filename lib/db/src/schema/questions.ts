/**
 * questions — structured question bank for StudyAI.
 *
 * Firestore-ready: field names map 1:1 to Firestore document fields.
 * Export via GET /api/admin/export/firestore for Firestore import JSON.
 *
 * Deduplication: content_hash is SHA-256 of normalised question_text.
 * INSERT … ON CONFLICT (content_hash) DO NOTHING skips duplicates.
 */

import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const questionsTable = pgTable("questions", {
  id: uuid("id").primaryKey().defaultRandom(),

  // ── Required schema fields ────────────────────────────────────────────────
  board:         text("board").notNull(),          // CBSE | ICSE | State
  classLevel:    integer("class_level").notNull(), // 6–12
  subject:       text("subject").notNull(),        // Mathematics | Physics | Chemistry
  chapter:       text("chapter").notNull(),
  chapterNumber: integer("chapter_number"),        // nullable
  topic:         text("topic").notNull(),
  difficulty:    text("difficulty").notNull(),     // Easy | Medium | Hard
  questionText:  text("question_text").notNull(),

  // ── Optional fields ───────────────────────────────────────────────────────
  answer:        text("answer"),
  source:        text("source"),                   // NCERT | Past Paper | Custom
  tags:          text("tags").array(),             // string[] | null

  // ── Deduplication key ─────────────────────────────────────────────────────
  /** SHA-256 of trim().toLowerCase().replace(/\s+/g," ") on question_text */
  contentHash:   text("content_hash").notNull().unique(),

  // ── Timestamps ────────────────────────────────────────────────────────────
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertQuestionSchema = createInsertSchema(questionsTable).omit({
  id: true, contentHash: true, createdAt: true, updatedAt: true,
});

export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
export type Question       = typeof questionsTable.$inferSelect;
