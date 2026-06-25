/**
 * Knowledge Gap Engine — identifies what the student is MISSING.
 *
 * A gap = a prerequisite or foundational concept that the student
 * has NOT mastered (mastery < 50) but is needed to understand what
 * they're currently studying.
 *
 * Gap types:
 *  - PREREQUISITE GAP: explicit prerequisite listed by AI but not mastered
 *  - FOUNDATIONAL GAP: topic with mastery < 40 that has been visited 3+ times
 *  - CROSS-SUBJECT GAP: Math gap affecting Physics/Chemistry performance
 *
 * Firestore path: students/{id}/knowledgeGaps
 */

import { readAllMastery }      from "./syncManager";
import { readAllMistakes }     from "./syncManager";

const KEY = "studyai-v1-knowledge-gaps";

export interface KnowledgeGap {
  gapId:          string;
  topic:          string;
  subject:        string;
  gapType:        "prerequisite" | "foundational" | "cross-subject";
  severity:       "critical" | "moderate" | "minor";  // critical blocks progress
  affectedTopics: string[];  // topics that cannot be understood until this is fixed
  masteryScore:   number;    // current mastery at this gap
  firstDetected:  number;
  lastSeen:       number;
  resolved:       boolean;
}

export interface KnowledgeGapReport {
  gaps:              KnowledgeGap[];
  criticalGapCount:  number;
  mostUrgentGap:     KnowledgeGap | null;
  estimatedGapDays:  number;  // rough estimate of study time to close all gaps
  updatedAt:         number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

const DEFAULT: KnowledgeGapReport = {
  gaps: [], criticalGapCount: 0, mostUrgentGap: null, estimatedGapDays: 0, updatedAt: 0,
};

export function getKnowledgeGapReport(): KnowledgeGapReport {
  return lsRead<KnowledgeGapReport>(KEY, DEFAULT);
}

/**
 * Record a prerequisite gap.
 * Called when AI response lists a prerequisite that the student has low mastery on.
 */
export function recordPrerequisiteGap(opts: {
  prerequisite:    string;
  subject:         string;
  currentTopic:    string;
  masteryScore:    number;
}): void {
  if (opts.masteryScore >= 60) return; // not a gap

  const report = getKnowledgeGapReport();
  const existing = report.gaps.find(
    (g) => g.topic === opts.prerequisite && g.subject === opts.subject
  );

  if (existing) {
    existing.lastSeen = Date.now();
    if (!existing.affectedTopics.includes(opts.currentTopic)) {
      existing.affectedTopics = [...existing.affectedTopics, opts.currentTopic];
    }
    existing.masteryScore = opts.masteryScore;
    existing.severity = opts.masteryScore < 25 ? "critical" : opts.masteryScore < 45 ? "moderate" : "minor";
  } else {
    report.gaps.push({
      gapId:          `gap-${Date.now().toString(36)}`,
      topic:          opts.prerequisite,
      subject:        opts.subject,
      gapType:        "prerequisite",
      severity:       opts.masteryScore < 25 ? "critical" : opts.masteryScore < 45 ? "moderate" : "minor",
      affectedTopics: [opts.currentTopic],
      masteryScore:   opts.masteryScore,
      firstDetected:  Date.now(),
      lastSeen:       Date.now(),
      resolved:       false,
    });
  }

  _updateSummary(report);
}

/** Recompute foundational gaps from all mastery data. Call periodically. */
export function recomputeFoundationalGaps(): void {
  const all     = readAllMastery();
  const entries = Object.values(all);
  const report  = getKnowledgeGapReport();

  // Mark foundational gaps: visited 3+ times, mastery still < 40
  for (const entry of entries) {
    if (entry.attempts < 3 || entry.masteryScore >= 40) continue;

    const key = `${entry.subject}::${entry.topic}`;
    const existing = report.gaps.find((g) => g.topic === entry.topic && g.subject === entry.subject);
    if (!existing) {
      report.gaps.push({
        gapId:          `gap-f-${key.replace(/\s+/g, "_")}`,
        topic:          entry.topic,
        subject:        entry.subject,
        gapType:        "foundational",
        severity:       entry.masteryScore < 20 ? "critical" : "moderate",
        affectedTopics: [],
        masteryScore:   entry.masteryScore,
        firstDetected:  entry.firstSeen,
        lastSeen:       entry.lastPracticed,
        resolved:       false,
      });
    } else {
      existing.masteryScore = entry.masteryScore;
      existing.resolved     = entry.masteryScore >= 60;
    }
  }

  // Auto-resolve gaps where mastery has improved
  for (const gap of report.gaps) {
    const masteryEntry = entries.find((e) => e.topic === gap.topic && e.subject === gap.subject);
    if (masteryEntry && masteryEntry.masteryScore >= 60) gap.resolved = true;
  }

  // Cross-subject: low Maths mastery → flag for Physics/Chemistry
  const mathEntries = entries.filter((e) => e.subject === "Mathematics" && e.masteryScore < 50);
  for (const mathEntry of mathEntries) {
    const crossKey = `cross::${mathEntry.topic}`;
    const existing = report.gaps.find((g) => g.gapId === crossKey);
    if (!existing) {
      report.gaps.push({
        gapId:          crossKey,
        topic:          mathEntry.topic,
        subject:        "Mathematics",
        gapType:        "cross-subject",
        severity:       "moderate",
        affectedTopics: ["Physics", "Chemistry"],
        masteryScore:   mathEntry.masteryScore,
        firstDetected:  Date.now(),
        lastSeen:       Date.now(),
        resolved:       false,
      });
    }
  }

  _updateSummary(report);
}

function _updateSummary(report: KnowledgeGapReport): void {
  const active = report.gaps.filter((g) => !g.resolved);
  report.criticalGapCount = active.filter((g) => g.severity === "critical").length;
  report.mostUrgentGap    = active.sort((a, b) => {
    const s = { critical: 3, moderate: 2, minor: 1 };
    return s[b.severity] - s[a.severity];
  })[0] ?? null;
  report.estimatedGapDays = Math.ceil(active.length * 1.5); // rough: 1.5 days per gap
  report.updatedAt = Date.now();
  lsWrite(report);
}

export function getActiveGaps(): KnowledgeGap[] {
  return getKnowledgeGapReport().gaps.filter((g) => !g.resolved);
}

export function getCriticalGaps(): KnowledgeGap[] {
  return getActiveGaps().filter((g) => g.severity === "critical");
}

/** Mark a gap as resolved when mastery improves. */
export function resolveGap(topic: string, subject: string): void {
  const report = getKnowledgeGapReport();
  const gap = report.gaps.find((g) => g.topic === topic && g.subject === subject);
  if (gap) { gap.resolved = true; _updateSummary(report); }
}

// Re-export readAllMistakes for use in gap analysis
export { readAllMistakes };
