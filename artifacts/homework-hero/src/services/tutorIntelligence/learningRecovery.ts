/**
 * Learning Recovery — master recovery orchestrator.
 *
 * When multiple engines signal that the student is struggling,
 * this engine coordinates a complete recovery plan:
 *
 * Recovery types:
 *  TOPIC_BREAKDOWN    — topic is too large; split into micro-concepts
 *  STRATEGY_SWITCH    — current teaching approach isn't working; try a different one
 *  PACING_ADJUSTMENT  — moving too fast; slow down and consolidate
 *  DIFFICULTY_RESET   — drop to the simplest entry point for this topic
 *  PREREQUISITE_FIRST — prerequisite gap blocking progress; fix that first
 *  CONFIDENCE_RESTORE — student is in learned helplessness; restore confidence first
 *  BREAK_RECOMMENDED  — cognitive overload; recommend stepping away temporarily
 *
 * Trigger conditions (checked after every wrong answer or hint request):
 *  - 3+ consecutive wrong answers → DIFFICULTY_RESET or STRATEGY_SWITCH
 *  - hint level 4+ reached        → TOPIC_BREAKDOWN or PREREQUISITE_FIRST
 *  - confidence level "helpless"  → CONFIDENCE_RESTORE
 *  - cognitive load "overloaded"  → BREAK_RECOMMENDED or PACING_ADJUSTMENT
 *  - 3 sessions same topic, mastery not improving → STRATEGY_SWITCH
 *
 * Firestore path: students/{id}/recoveryLog
 */

import { getCognitiveLoadProfile, isOverloaded }   from "./cognitiveLoadEngine";
import { getConfidenceProfile, needsConfidenceIntervention, getRecoveryMessage } from "./confidenceRecovery";
import { getMissingPrerequisites, createRecoveryPlan, getActiveRecoveryPlan }    from "./prerequisiteRecovery";
import { selectStrategy, recordStrategyEffectiveness, STRATEGY_LABELS }          from "./teachingStrategyEngine";
import { getMisunderstandingReport }                from "./misunderstandingDetector";
import { getMasteryEntry }                          from "../studentModel/topicMastery";

const KEY = "studyai-v1-recovery-log";

export type RecoveryType =
  | "topic_breakdown"
  | "strategy_switch"
  | "pacing_adjustment"
  | "difficulty_reset"
  | "prerequisite_first"
  | "confidence_restore"
  | "break_recommended";

export type RecoveryStatus = "active" | "completed" | "abandoned";

export interface RecoveryEvent {
  eventId:      string;
  type:         RecoveryType;
  topic:        string;
  subject:      string;
  triggerReason: string;
  actionTaken:  string;
  status:       RecoveryStatus;
  startedAt:    number;
  resolvedAt?:  number;
  masteryBefore: number;
  masteryAfter?: number;
  worked:        boolean | null;
}

export interface RecoveryLog {
  events:             RecoveryEvent[];
  activeRecoveryType: RecoveryType | null;
  totalRecoveries:    number;
  successfulCount:    number;
  updatedAt:          number;
}

// ── Storage ───────────────────────────────────────────────────────────────────

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getRecoveryLog(): RecoveryLog {
  return lsRead<RecoveryLog>(KEY, {
    events: [], activeRecoveryType: null, totalRecoveries: 0, successfulCount: 0, updatedAt: Date.now(),
  });
}

// ── Trigger assessment ────────────────────────────────────────────────────────

export interface RecoveryAssessment {
  needsRecovery:      boolean;
  recoveryType:       RecoveryType | null;
  urgency:            "critical" | "high" | "medium" | "low" | "none";
  triggerReason:      string;
  recommendedAction:  string;
  aiInstruction:      string;    // text to inject into AI prompt
}

/**
 * Assess whether recovery is needed after each wrong answer or hint request.
 * Call this after every student response or hint request.
 */
export function assessRecoveryNeed(opts: {
  topic:              string;
  subject:            string;
  wrongAnswersInRow:  number;
  hintLevelReached:   number;
  sessionDurationMs:  number;
  totalSessions:      number;   // how many times student has tried this topic
}): RecoveryAssessment {
  const load       = getCognitiveLoadProfile();
  const confidence = getConfidenceProfile();
  const mastery    = getMasteryEntry(opts.topic, opts.subject);
  const masteryScore = mastery?.masteryScore ?? 30;

  // ── Critical: student is completely overwhelmed ───────────────────────────
  if (load.currentLevel === "overloaded" && confidence.currentLevel === "helpless") {
    return _assessment("break_recommended", "critical",
      "Student is both cognitively overloaded and in learned helplessness simultaneously.",
      "Pause the session and recommend a 10-minute break before continuing.",
      "CRITICAL: Do not ask another question. Tell the student: 'You've been working hard. Let's take a short pause — even 5 minutes away will help your brain consolidate what we've covered.' Then end the exchange warmly.",
    );
  }

  // ── Confidence helpless ────────────────────────────────────────────────────
  if (needsConfidenceIntervention()) {
    const msg = getRecoveryMessage(confidence, opts.topic);
    return _assessment("confidence_restore", "critical",
      "Student is in learned helplessness — confidence has collapsed.",
      msg.action ?? "Restore confidence before asking another question.",
      `CONFIDENCE RECOVERY REQUIRED. ${msg.message} After delivering this message, drop to the simplest possible entry point for ${opts.topic}. Do not continue with the current difficulty.`,
    );
  }

  // ── Cognitive overload ────────────────────────────────────────────────────
  if (isOverloaded()) {
    return _assessment("break_recommended", "high",
      "Cognitive load is at maximum — student cannot effectively process more information.",
      "Recommend a short break or significantly simplify the current explanation.",
      `COGNITIVE OVERLOAD DETECTED. Reduce all explanation to the bare minimum — one sentence, one idea. Ask only: 'What is the one thing you do remember about ${opts.topic}?' Build from there.`,
    );
  }

  // ── Prerequisite gap ──────────────────────────────────────────────────────
  if (opts.hintLevelReached >= 4 && opts.wrongAnswersInRow >= 2) {
    const missingPrereqs = getMissingPrerequisites(opts.topic, opts.subject);
    if (missingPrereqs.length > 0) {
      const prereq = missingPrereqs[0];
      createRecoveryPlan({
        prerequisiteTopic: prereq.topic, prerequisiteSubject: prereq.subject,
        blockedTopic: opts.topic, masteryAtStart: masteryScore,
      });
      return _assessment("prerequisite_first", "high",
        `Student has reached hint level ${opts.hintLevelReached} — likely blocked by missing prerequisite "${prereq.topic}".`,
        `Pause ${opts.topic} and run a mini-recovery session on "${prereq.topic}" first.`,
        `PREREQUISITE GAP DETECTED. Tell the student: "Before we go further with ${opts.topic}, let's make sure ${prereq.topic} is solid — that's what we actually need here." Then teach ${prereq.topic} from scratch using simple examples.`,
      );
    }
  }

  // ── 3 consecutive wrong answers ───────────────────────────────────────────
  if (opts.wrongAnswersInRow >= 3) {
    if (masteryScore < 40) {
      return _assessment("difficulty_reset", "high",
        "3+ consecutive wrong answers with low mastery — difficulty level too high.",
        "Drop to the simplest possible version of this question.",
        `DIFFICULTY RESET. The student has answered 3 questions incorrectly in a row. Do NOT continue with the same level. Instead: 'Let me try a simpler version of this.' Ask the most basic possible question about ${opts.topic} — something a student who just heard the term for the first time could answer.`,
      );
    }

    // Strategy isn't working → switch
    const rec = selectStrategy({ topic: opts.topic, subject: opts.subject, mastery: masteryScore });
    recordStrategyEffectiveness(rec.strategy, opts.topic, 20); // rate current as low effectiveness
    const alt = rec.alternates[0];
    return _assessment("strategy_switch", "high",
      `3+ wrong answers — current teaching strategy isn't working for this student on ${opts.topic}.`,
      `Switch to: ${STRATEGY_LABELS[alt ?? rec.strategy]}`,
      `STRATEGY SWITCH. Current approach is not landing. Switch now to: "${STRATEGY_LABELS[alt ?? rec.strategy]}". ${rec.aiInstruction}`,
    );
  }

  // ── Multiple sessions, no mastery improvement ─────────────────────────────
  if (opts.totalSessions >= 3 && masteryScore < 40) {
    const report = getMisunderstandingReport(opts.subject);
    const topProfile = report.topPriorityProfile;
    if (topProfile?.topic === opts.topic) {
      return _assessment("topic_breakdown", "medium",
        `Student has tried ${opts.topic} ${opts.totalSessions} times with mastery still at ${masteryScore}%. A persistent structural misunderstanding is blocking progress.`,
        "Break the topic into micro-concepts and address each individually.",
        `TOPIC BREAKDOWN REQUIRED. Persistent misunderstanding detected: "${topProfile.description}". Do not explain ${opts.topic} as a whole. Identify the ONE smallest sub-concept the student is missing and teach ONLY that. Stop there.`,
      );
    }
  }

  // ── Pacing: session too long ───────────────────────────────────────────────
  if (opts.sessionDurationMs > 25 * 60_000) {
    return _assessment("pacing_adjustment", "medium",
      "Session has exceeded 25 minutes — consolidation time is needed.",
      "Summarise what was covered, praise effort, and suggest ending or taking a short break.",
      `PACING NOTE: This session has been long. Before asking another question, give a brief summary: 'Here's what we've covered so far...' Then ask if they want to continue or take a break.`,
    );
  }

  return { needsRecovery: false, recoveryType: null, urgency: "none", triggerReason: "", recommendedAction: "", aiInstruction: "" };
}

function _assessment(
  type: RecoveryType, urgency: RecoveryAssessment["urgency"],
  triggerReason: string, recommendedAction: string, aiInstruction: string,
): RecoveryAssessment {
  return { needsRecovery: true, recoveryType: type, urgency, triggerReason, recommendedAction, aiInstruction };
}

/** Log a recovery event to history. */
export function logRecovery(opts: {
  type:          RecoveryType;
  topic:         string;
  subject:       string;
  triggerReason: string;
  actionTaken:   string;
  masteryBefore: number;
}): RecoveryEvent {
  const log = getRecoveryLog();
  const event: RecoveryEvent = {
    eventId:      `re-${Date.now().toString(36)}`,
    type:         opts.type,
    topic:        opts.topic,
    subject:      opts.subject,
    triggerReason: opts.triggerReason,
    actionTaken:   opts.actionTaken,
    status:        "active",
    startedAt:     Date.now(),
    masteryBefore: opts.masteryBefore,
    worked:        null,
  };
  log.events = [...log.events.slice(-49), event];
  log.activeRecoveryType = opts.type;
  log.totalRecoveries++;
  log.updatedAt = Date.now();
  lsWrite(log);
  return event;
}

/** Mark the most recent recovery as complete and record whether it worked. */
export function completeRecovery(eventId: string, worked: boolean, masteryAfter: number): void {
  const log = getRecoveryLog();
  const event = log.events.find((e) => e.eventId === eventId);
  if (event) {
    event.status     = "completed";
    event.resolvedAt = Date.now();
    event.masteryAfter = masteryAfter;
    event.worked     = worked;
    if (worked) log.successfulCount++;
    log.activeRecoveryType = null;
    log.updatedAt = Date.now();
    lsWrite(log);
  }
}

/** Urgency label for display. */
export const URGENCY_LABELS: Record<string, string> = {
  critical: "🔴 Critical",
  high:     "🟠 High",
  medium:   "🟡 Medium",
  low:      "🟢 Low",
  none:     "✓ On Track",
};

/** Recovery type label for display. */
export const RECOVERY_LABELS: Record<RecoveryType, string> = {
  topic_breakdown:    "Breaking topic into smaller parts",
  strategy_switch:    "Switching teaching approach",
  pacing_adjustment:  "Slowing the pace",
  difficulty_reset:   "Resetting to simpler level",
  prerequisite_first: "Recovering prerequisite first",
  confidence_restore: "Rebuilding confidence",
  break_recommended:  "Rest recommended",
};
