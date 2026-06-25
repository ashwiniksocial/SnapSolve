/**
 * Mastery Assessment — validates demonstrated mastery through Q&A.
 *
 * Mastery is NEVER granted for reading alone.
 * It must be demonstrated through correct answers.
 *
 * Validation rules:
 *  - 3 consecutive conceptual answers correct, OR
 *  - 2 conceptual answers correct + 1 application answer correct
 *
 * Tracks per-session and lifetime assessment data.
 * Firestore path: students/{id}/masteryAssessments/{topicKey}
 */

const KEY = "studyai-v1-mastery-assessments";

export interface AnswerRecord {
  questionId:   string;
  questionType: "conceptual" | "application" | "challenge";
  isCorrect:    boolean;
  hintUsed:     boolean;
  masteryDelta: number;
  timestamp:    number;
}

export interface TopicAssessment {
  topicKey:            string;
  topic:               string;
  subject:             string;

  answers:             AnswerRecord[];
  consecutiveCorrect:  number;
  conceptualCorrect:   number;
  applicationCorrect:  number;

  masteryValidated:    boolean;
  validatedAt?:        number;
  validationMethod?:   "triple_correct" | "two_plus_one";

  // Lifetime stats
  totalAttempts:       number;
  totalCorrect:        number;
  avgMasteryDelta:     number;

  updatedAt:           number;
}

function lsRead<T>(key: string, fallback: T): T {
  try { return JSON.parse(localStorage.getItem(key) ?? "null") ?? fallback; } catch { return fallback; }
}
function lsWrite(val: unknown): void {
  try { localStorage.setItem(KEY, JSON.stringify(val)); } catch {}
}

export function getAllAssessments(): Record<string, TopicAssessment> {
  return lsRead<Record<string, TopicAssessment>>(KEY, {});
}

export function getTopicAssessment(topic: string, subject: string): TopicAssessment {
  const topicKey = `${subject}::${topic}`;
  const all      = getAllAssessments();
  return all[topicKey] ?? {
    topicKey, topic, subject,
    answers: [],
    consecutiveCorrect: 0, conceptualCorrect: 0, applicationCorrect: 0,
    masteryValidated: false,
    totalAttempts: 0, totalCorrect: 0, avgMasteryDelta: 0,
    updatedAt: Date.now(),
  };
}

/** Record a student's answer and check if mastery is now validated. */
export function recordAnswer(opts: {
  topic:        string;
  subject:      string;
  questionId:   string;
  questionType: AnswerRecord["questionType"];
  isCorrect:    boolean;
  hintUsed:     boolean;
  masteryDelta: number;
}): { assessment: TopicAssessment; masteryJustValidated: boolean } {
  const topicKey  = `${opts.subject}::${opts.topic}`;
  const all       = getAllAssessments();
  const current   = all[topicKey] ?? getTopicAssessment(opts.topic, opts.subject);

  const answer: AnswerRecord = {
    questionId:   opts.questionId,
    questionType: opts.questionType,
    isCorrect:    opts.isCorrect,
    hintUsed:     opts.hintUsed,
    masteryDelta: opts.masteryDelta,
    timestamp:    Date.now(),
  };

  current.answers = [...current.answers.slice(-19), answer]; // keep last 20

  // Update consecutive correct
  if (opts.isCorrect) {
    current.consecutiveCorrect++;
    if (opts.questionType === "conceptual")   current.conceptualCorrect++;
    if (opts.questionType === "application")  current.applicationCorrect++;
    current.totalCorrect++;
  } else {
    current.consecutiveCorrect = 0; // reset on wrong answer
  }

  current.totalAttempts++;
  current.avgMasteryDelta = Math.round(
    (current.avgMasteryDelta * (current.totalAttempts - 1) + opts.masteryDelta) / current.totalAttempts
  );
  current.updatedAt = Date.now();

  // Check mastery validation
  let masteryJustValidated = false;
  if (!current.masteryValidated) {
    if (current.consecutiveCorrect >= 3) {
      current.masteryValidated = true;
      current.validatedAt = Date.now();
      current.validationMethod = "triple_correct";
      masteryJustValidated = true;
    } else if (current.conceptualCorrect >= 2 && current.applicationCorrect >= 1) {
      current.masteryValidated = true;
      current.validatedAt = Date.now();
      current.validationMethod = "two_plus_one";
      masteryJustValidated = true;
    }
  }

  all[topicKey] = current;
  lsWrite(all);
  return { assessment: current, masteryJustValidated };
}

/** Reset mastery validation (e.g. after a failed review session). */
export function resetValidation(topic: string, subject: string): void {
  const topicKey = `${subject}::${topic}`;
  const all      = getAllAssessments();
  const current  = all[topicKey];
  if (current) {
    current.masteryValidated    = false;
    current.consecutiveCorrect  = 0;
    current.conceptualCorrect   = 0;
    current.applicationCorrect  = 0;
    current.validatedAt         = undefined;
    current.validationMethod    = undefined;
    current.updatedAt           = Date.now();
    lsWrite(all);
  }
}

/** Fraction progress toward mastery (0–1). */
export function getMasteryProgress(topic: string, subject: string): number {
  const a = getTopicAssessment(topic, subject);
  if (a.masteryValidated) return 1;
  // Triple-correct path
  const tripleProgress   = a.consecutiveCorrect / 3;
  // Two-plus-one path
  const twoPlusOneProgress = Math.min(1, (a.conceptualCorrect / 2) * 0.6 + (a.applicationCorrect / 1) * 0.4);
  return Math.min(1, Math.max(tripleProgress, twoPlusOneProgress));
}

/** Progress label for display. */
export function getMasteryProgressLabel(topic: string, subject: string): string {
  const a = getTopicAssessment(topic, subject);
  if (a.masteryValidated) return "Mastery demonstrated ✓";
  if (a.consecutiveCorrect === 2) return "One more correct answer to confirm mastery";
  if (a.consecutiveCorrect === 1) return "Good start — 2 more to go";
  if (a.conceptualCorrect >= 2 && a.applicationCorrect === 0) return "Concept clear — answer one application question";
  return "Answer questions correctly to demonstrate mastery";
}
