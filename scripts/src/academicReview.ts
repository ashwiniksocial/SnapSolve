#!/usr/bin/env node
/**
 * Academic Review — offline Gold Standard quality gate for question-bank content.
 *
 * SEPARATE from curriculum-check (structural validation).
 * Reads existing question source files, reviews them via OpenAI, and stores
 * results in academic-review/results/. Skips questions whose content hash
 * has not changed since their last GOLD_STANDARD_PASS — no repeat API cost.
 *
 * Run:
 *   pnpm --filter @workspace/scripts run academic-review [options]
 *
 * Options:
 *   --context-audit      Report curriculum-context coverage for all questions (no API calls)
 *   --subject <name>     Filter by subject (partial, case-insensitive)
 *   --class <n>          Filter by classNum
 *   --chapter <id>       Filter by chapterId
 *   --question <id>      Review exactly one question by ID
 *   --batch-size <n>     Questions per progress-save batch (default: 5)
 *   --max-questions <n>  Stop after N questions are reviewed this run
 *   --delay-ms <n>       Milliseconds to wait between questions (default: 500)
 *   --dry-run            Show what would be reviewed — no API calls, no writes
 *   --failed-only        Only review questions with a previous non-PASS result
 *   --force              Re-review even if hash matches and previous result is GOLD_STANDARD_PASS
 *   --cost-estimate      Print estimated API cost for pending questions and exit
 *
 * Review safety rule:
 *   If official curriculum context is MISSING for a question, the reviewer will
 *   NOT call OpenAI and will NOT record a GOLD_STANDARD_PASS. Instead it records:
 *     overall: "REVIEW_BLOCKED_CONTEXT_MISSING"
 *   Context coverage must be fixed before those questions can be reviewed.
 *   Run --context-audit to see which chapters are missing context and why.
 */

import { createHash }                                                      from "crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, join }                                                    from "path";
import { getCanonicalChapter, formatChapterContext }                       from "./canonicalCurriculum.js";

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT              = resolve(import.meta.dirname, "../../");
const HH_DATA           = join(ROOT, "artifacts/homework-hero/src/data/questions");
const QB_ROOT           = join(ROOT, "question-bank/questions");
const RESULTS_DIR       = join(ROOT, "academic-review/results");
const CONTEXT_AUDIT_OUT = join(ROOT, "academic-review/context-audit.json");

// ─── Configuration ────────────────────────────────────────────────────────────
//
// ALL tunable parameters live here. The review engine reads these constants.
// No review value may be hardcoded in review logic below.
// Bump CHECKLIST_VERSION whenever criteria definitions or the reviewer prompt
// change — this invalidates all cached records and triggers a full re-review.

export const GS_CONFIG = {
  /** Bumped whenever criteria or the reviewer prompt change. Invalidates all cached records. */
  CHECKLIST_VERSION:           "2.0",
  /** Primary review model — used for first review and automatic second verification. */
  REVIEWER_MODEL:              "gpt-4o-mini",
  /** Escalation model — used only for persistent REVIEWER_UNCERTAINTY, never by default. */
  ESCALATION_MODEL:            "gpt-4o",
  /** Stored as metadata on each record. Does NOT gate any outcome decision. */
  REVIEW_CONFIDENCE_THRESHOLD: 0.85,
  /** Max automatic REVIEWER_UNCERTAINTY retries with REVIEWER_MODEL before ESCALATION_MODEL. */
  MAX_UNCERTAINTY_RETRIES:     2,
  /** Checklist version of legacy cache records — treat as stale, requires re-review. */
  LEGACY_VERSION:              "1.1",
} as const;

// gpt-4o-mini pricing (per 1 M tokens) — used for cost estimates only
const PRICE_IN_PER_M  = 0.15;
const PRICE_OUT_PER_M = 0.60;
// Conservative estimates per question review call
const EST_IN_TOKENS_PER_Q  = 800;
const EST_OUT_TOKENS_PER_Q = 500;

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

// ─── Checklist Definition ─────────────────────────────────────────────────────
//
// The engine ITERATES over this array — it does not hardcode criterion keys
// in decision logic. Adding or removing a criterion requires only updating
// this array and bumping GS_CONFIG.CHECKLIST_VERSION.

export interface CriterionDef {
  id:   string;
  name: string;
}

export const CHECKLIST: CriterionDef[] = [
  { id: "curriculum_alignment",        name: "Curriculum Alignment"             },
  { id: "question_clarity",            name: "Question Clarity"                 },
  { id: "correctness",                 name: "Factual and Mathematical Correctness" },
  { id: "steps_validity",              name: "Solution Steps Validity"          },
  { id: "marking_completeness",        name: "Marking Completeness"             },
  { id: "examination_worthiness",      name: "Examination Worthiness"           },
  { id: "curriculum_importance",       name: "Curriculum Importance"            },
  { id: "appropriate_depth",           name: "Appropriate Depth"                },
  { id: "weak_student_accessibility",  name: "Weak Student Accessibility"       },
  { id: "hint_quality",                name: "Hint Quality"                     },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SolutionStep {
  stepNumber:  number;
  title:       string;
  explanation: string;
  formula?:    string;
  result?:     string;
}

export interface ReviewableQuestion {
  id:          string;
  schema:      "v1" | "v2";
  classNum:    number;
  subject:     string;
  board:       string;
  chapterId:   string;
  chapterName: string;
  topicId:     string;
  topicName:   string;
  difficulty:  string;
  questionType?: string;
  question:    string;
  answer:      string;
  steps:       SolutionStep[];
  hint:        string;
  hint2?:      string;
  hint3?:      string;
  examTip?:    string;
  keyConcepts: string[];
}

export type GoldStandardOutcome =
  | "GOLD_STANDARD_PASS"
  | "CONFIRMED_DEFECT"
  | "POSSIBLE_DEFECT_REQUIRES_VERIFICATION"
  | "REVIEWER_UNCERTAINTY"
  | "REVIEW_BLOCKED_CONTEXT_MISSING";

/**
 * Evidence required for any FAIL criterion.
 * All four content fields must be non-empty for the failure to proceed to
 * POSSIBLE_DEFECT_REQUIRES_VERIFICATION. Missing or empty fields → REVIEWER_UNCERTAINTY.
 *
 * reviewer_confidence is metadata only — it is stored for analysis and reporting
 * but does NOT independently gate any outcome decision.
 */
export interface DefectEvidence {
  criterion_id:         string;
  exact_defective_text: string;  // verbatim text from the Q&A that is wrong
  reason:               string;  // why it fails this criterion
  expected_correction:  string;  // the specific fix required
  supporting_evidence:  string;  // source citation or shown calculation
  reviewer_confidence:  number;  // metadata only — does not gate outcomes
}

export interface ReviewRecord {
  questionId:          string;
  contentHash:         string;
  checklistVersion?:   string;   // present in v2.0+ records; use recordVersion() helper for legacy
  reviewedAt:          string;
  model:               string;
  sourceContextStatus: "PRESENT" | "MISSING";
  overall:             GoldStandardOutcome | "PASS" | "FAIL"; // PASS/FAIL for legacy records
  dimensions:          Record<string, "PASS" | "FAIL"> | null;
  failEvidence:        DefectEvidence[];
  failConfidences:     Record<string, number>;  // metadata only — does not gate outcomes
  reasons:             string[];                // display-friendly summary, derived from failEvidence
  tokenUsage?:         { inputTokens: number; outputTokens: number; estimatedCostUSD: number };
  // Legacy field — present in old cache records, ignored by new logic
  promptVersion?:      string;
}

type ChapterCache = Record<string, ReviewRecord>;

// ─── Curriculum context resolution via canonical academic contract ────────────

function resolveSourceContext(q: ReviewableQuestion): {
  status:                "PRESENT" | "MISSING";
  text:                  string;
  canonicalChapterId:    string | null;
  missReason?:           string;
} {
  const canonical = getCanonicalChapter(q.chapterId);

  if (!canonical) {
    return {
      status:             "MISSING",
      text:               "",
      canonicalChapterId: null,
      missReason:         `chapterId "${q.chapterId}" is not registered in the canonical academic contract`,
    };
  }

  if (canonical.status === "SOURCE_UNRESOLVED") {
    return {
      status:             "MISSING",
      text:               "",
      canonicalChapterId: null,
      missReason:         `SOURCE_UNRESOLVED: chapter "${q.chapterId}" has no confirmed 2026-27 canonical source`,
    };
  }

  if (canonical.status === "SOURCE_PENDING") {
    return {
      status:             "MISSING",
      text:               "",
      canonicalChapterId: null,
      missReason:         `SOURCE_PENDING: official source not yet released for chapter "${q.chapterId}"`,
    };
  }

  return {
    status:             "PRESENT",
    text:               formatChapterContext(canonical),
    canonicalChapterId: canonical.bookId,
  };
}

// ─── Context audit ────────────────────────────────────────────────────────────

interface ChapterAuditRecord {
  classNum:            number;
  subject:             string;
  chapterId:           string;
  chapterName:         string;
  total:               number;
  present:             number;
  missing:             number;
  canonicalChapterId:  string | null;
  missReason?:         string;
}

interface ContextAuditReport {
  auditedAt:       string;
  curriculumIndex: string;
  totalQuestions:  number;
  present:         number;
  missing:         number;
  coveragePercent: string;
  byClass:         Record<string, { present: number; missing: number }>;
  bySubject:       Record<string, { present: number; missing: number }>;
  byChapter:       ChapterAuditRecord[];
  unmatchedChapters: {
    classNum:    number;
    subject:     string;
    chapterId:   string;
    chapterName: string;
    questions:   number;
    reason:      string;
  }[];
}

function runContextAudit(questions: ReviewableQuestion[]): ContextAuditReport {
  const byChapterMap = new Map<string, ChapterAuditRecord>();
  let totalPresent = 0;
  let totalMissing = 0;
  const byClass:   Record<string, { present: number; missing: number }> = {};
  const bySubject: Record<string, { present: number; missing: number }> = {};

  for (const q of questions) {
    const ctx  = resolveSourceContext(q);
    const key  = `${q.classNum}|${q.subject}|${q.chapterId}`;
    const clK  = String(q.classNum);
    const subK = q.subject;

    if (!byChapterMap.has(key)) {
      byChapterMap.set(key, {
        classNum: q.classNum, subject: q.subject, chapterId: q.chapterId,
        chapterName: q.chapterName, total: 0, present: 0, missing: 0,
        canonicalChapterId: ctx.canonicalChapterId, missReason: ctx.missReason,
      });
    }
    const rec = byChapterMap.get(key)!;
    rec.total++;
    if (ctx.status === "PRESENT") { rec.present++; totalPresent++; }
    else                          { rec.missing++; totalMissing++; }

    byClass[clK]   = byClass[clK]   ?? { present: 0, missing: 0 };
    bySubject[subK] = bySubject[subK] ?? { present: 0, missing: 0 };
    if (ctx.status === "PRESENT") { byClass[clK].present++; bySubject[subK].present++; }
    else                          { byClass[clK].missing++; bySubject[subK].missing++; }
  }

  const total     = questions.length;
  const pct       = total === 0 ? "0.0" : ((totalPresent / total) * 100).toFixed(1);
  const byChapter = [...byChapterMap.values()].sort(
    (a, b) => `${a.classNum}${a.subject}${a.chapterId}`.localeCompare(`${b.classNum}${b.subject}${b.chapterId}`),
  );
  const unmatchedChapters = byChapter
    .filter(r => r.missing > 0)
    .map(r => ({
      classNum: r.classNum, subject: r.subject, chapterId: r.chapterId,
      chapterName: r.chapterName, questions: r.total,
      reason: r.missReason ?? "chapter not found in curriculum index",
    }));

  return {
    auditedAt: new Date().toISOString(),
    curriculumIndex: "curriculum/generated/master-curriculum-index.json",
    totalQuestions: total, present: totalPresent, missing: totalMissing,
    coveragePercent: pct + "%", byClass, bySubject, byChapter, unmatchedChapters,
  };
}

function printContextAudit(report: ContextAuditReport): void {
  const HR = "═".repeat(66);
  const hr = "─".repeat(66);
  console.log(`\n${HR}`);
  console.log("CONTEXT AUDIT — Curriculum Source Coverage");
  console.log(`Audited at: ${report.auditedAt}`);
  console.log(HR);
  console.log(`Total questions  : ${report.totalQuestions}`);
  console.log(`Context PRESENT  : ${report.present}  (${report.coveragePercent})`);
  console.log(`Context MISSING  : ${report.missing}`);

  console.log(`\n${hr}\nBy Class\n${hr}`);
  for (const [cls, v] of Object.entries(report.byClass).sort()) {
    const t = v.present + v.missing;
    console.log(`  Class ${cls}   present: ${v.present}  missing: ${v.missing}  coverage: ${((v.present / t) * 100).toFixed(1)}%`);
  }

  console.log(`\n${hr}\nBy Subject\n${hr}`);
  for (const [subj, v] of Object.entries(report.bySubject).sort()) {
    const t = v.present + v.missing;
    console.log(`  ${subj.padEnd(14)} present: ${v.present}  missing: ${v.missing}  coverage: ${((v.present / t) * 100).toFixed(1)}%`);
  }

  console.log(`\n${hr}\nBy Chapter\n${hr}`);
  for (const r of report.byChapter) {
    const status = r.missing === 0 ? "✓ PRESENT" : "✗ MISSING";
    console.log(`  ${status}  Cl.${r.classNum} ${r.subject.padEnd(12)} ${r.chapterId.padEnd(10)} ${r.chapterName}`);
    if (r.canonicalChapterId && r.missing === 0) console.log(`            → '${r.canonicalChapterId}'`);
    if (r.missing > 0 && r.missReason)           console.log(`            Reason: ${r.missReason}`);
  }

  if (report.unmatchedChapters.length > 0) {
    console.log(`\n${hr}\nUnmatched Chapters — Context MISSING\n${hr}`);
    for (const u of report.unmatchedChapters) {
      console.log(`  Cl.${u.classNum} ${u.subject} / ${u.chapterId} — '${u.chapterName}' (${u.questions} questions)`);
      console.log(`    Reason: ${u.reason}`);
    }
  }

  console.log(`\n${HR}`);
  console.log(`Report saved to: academic-review/context-audit.json`);
  console.log(`${HR}\n`);
}

// ─── CLI args ─────────────────────────────────────────────────────────────────

interface Args {
  contextAudit:  boolean;
  subject?:      string;
  classNum?:     number;
  chapter?:      string;
  question?:     string;
  batchSize:     number;
  maxQuestions?: number;
  delayMs:       number;
  dryRun:        boolean;
  failedOnly:    boolean;
  force:         boolean;
  costEstimate:  boolean;
}

function parseArgs(): Args {
  const argv = process.argv.slice(2);
  const get  = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i !== -1 && argv[i + 1] ? argv[i + 1] : undefined;
  };
  const has = (flag: string): boolean => argv.includes(flag);
  return {
    contextAudit:  has("--context-audit"),
    subject:       get("--subject"),
    classNum:      get("--class")         ? parseInt(get("--class")!,         10) : undefined,
    chapter:       get("--chapter"),
    question:      get("--question"),
    batchSize:     parseInt(get("--batch-size")    ?? "5",   10),
    maxQuestions:  get("--max-questions") ? parseInt(get("--max-questions")!, 10) : undefined,
    delayMs:       parseInt(get("--delay-ms")      ?? "500", 10),
    dryRun:        has("--dry-run"),
    failedOnly:    has("--failed-only"),
    force:         has("--force"),
    costEstimate:  has("--cost-estimate"),
  };
}

// ─── Content hash ─────────────────────────────────────────────────────────────

function normField(s: string | undefined): string {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

export function computeContentHash(q: ReviewableQuestion): string {
  const stepsJson = JSON.stringify(q.steps.map(s => ({
    stepNumber:  s.stepNumber,
    title:       normField(s.title),
    explanation: normField(s.explanation),
    formula:     normField(s.formula),
    result:      normField(s.result),
  })));
  const parts = [
    String(q.classNum), q.subject, q.board, q.chapterId, q.topicId,
    q.difficulty, normField(q.question), normField(q.answer), stepsJson,
    normField(q.hint), normField(q.hint2), normField(q.hint3), normField(q.examTip),
  ];
  return createHash("sha256").update(parts.join("\x00")).digest("hex");
}

// ─── Cache I/O ────────────────────────────────────────────────────────────────

function cacheFilePath(chapterId: string): string {
  return join(RESULTS_DIR, `${chapterId}.json`);
}

export function loadCache(chapterId: string): ChapterCache {
  const p = cacheFilePath(chapterId);
  if (!existsSync(p)) return {};
  try { return JSON.parse(readFileSync(p, "utf8")) as ChapterCache; }
  catch { return {}; }
}

function saveCache(chapterId: string, cache: ChapterCache): void {
  mkdirSync(RESULTS_DIR, { recursive: true });
  writeFileSync(cacheFilePath(chapterId), JSON.stringify(cache, null, 2), "utf8");
}

// ─── Question loading ─────────────────────────────────────────────────────────

type AnyObj = Record<string, unknown>;

function normalizeV1(q: AnyObj): ReviewableQuestion {
  return {
    id:          String(q["id"]          ?? ""),
    schema:      "v1",
    classNum:    Number(q["classNum"]    ?? 0),
    subject:     String(q["subject"]     ?? ""),
    board:       "CBSE",
    chapterId:   String(q["chapterId"]   ?? ""),
    chapterName: String(q["chapterName"] ?? ""),
    topicId:     String(q["topicId"]     ?? ""),
    topicName:   String(q["topicName"]   ?? ""),
    difficulty:  String(q["difficulty"]  ?? ""),
    questionType: q["questionType"] !== undefined ? String(q["questionType"]) : undefined,
    question:    String(q["question"]    ?? ""),
    answer:      String(q["answer"]      ?? ""),
    steps:       Array.isArray(q["steps"])       ? q["steps"]       as SolutionStep[] : [],
    hint:        String(q["hint"]        ?? ""),
    keyConcepts: Array.isArray(q["keyConcepts"]) ? q["keyConcepts"] as string[]       : [],
  };
}

function prefixChapterId(subject: string, raw: string): string {
  if (subject === "Chemistry") return `chem-${raw}`;
  if (subject === "Biology")   return `bio-${raw}`;
  return raw;
}

/** Keep generator-side V2 metadata identical to the browser's v2adapter. */
function mapV2QuestionType(questionType: unknown, questionFormat: unknown): string {
  const type = String(questionType ?? "");
  const format = String(questionFormat ?? "");
  if (type === "hots") return "HOTS";
  if (type === "previous-year") return "PYQ";
  if (type === "assertion-reason" || format === "AssertionReason") return "MCQ";
  if (format === "MCQ" || format === "TrueOrFalse") return "MCQ";
  if (format === "LongAnswer" || format === "Proof" || format === "CaseStudy") return "LongAnswer";
  return "ShortAnswer";
}

function normalizeV2(q: AnyObj): ReviewableQuestion {
  const subject   = String(q["subject"]   ?? "");
  const chapterId = prefixChapterId(subject, String(q["chapterId"] ?? ""));
  return {
    id:          String(q["id"]          ?? ""),
    schema:      "v2",
    classNum:    Number(q["classNum"]    ?? 0),
    subject,
    board:       String(q["board"]       ?? "Both"),
    chapterId,
    chapterName: String(q["chapterName"] ?? ""),
    topicId:     String(q["topicId"]     ?? ""),
    topicName:   String(q["topicName"]   ?? ""),
    difficulty:  String(q["difficulty"]  ?? ""),
    questionType: mapV2QuestionType(q["questionType"], q["questionFormat"]),
    question:    String(q["question"]    ?? ""),
    answer:      String(q["answer"]      ?? ""),
    steps:       Array.isArray(q["steps"])       ? q["steps"]       as SolutionStep[] : [],
    hint:        String(q["hint"]        ?? ""),
    hint2:       q["hint2"]   !== undefined ? String(q["hint2"])   : undefined,
    hint3:       q["hint3"]   !== undefined ? String(q["hint3"])   : undefined,
    examTip:     q["examTip"] !== undefined ? String(q["examTip"]) : undefined,
    keyConcepts: Array.isArray(q["keyConcepts"]) ? q["keyConcepts"] as string[]       : [],
  };
}

async function loadV1File(filePath: string): Promise<ReviewableQuestion[]> {
  try {
    const mod = await import(filePath) as Record<string, unknown>;
    if (!Array.isArray(mod["QUESTIONS"])) return [];
    return (mod["QUESTIONS"] as AnyObj[])
      .filter(q => q && typeof q === "object" && q["id"] && q["question"])
      .map(normalizeV1);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`  [LOAD-ERROR] ${filePath.split("/").slice(-3).join("/")}: ${msg}\n`);
    return [];
  }
}

async function loadV2File(filePath: string): Promise<ReviewableQuestion[]> {
  try {
    const mod = await import(filePath) as Record<string, unknown>;
    const arr = Object.values(mod).find(v => Array.isArray(v) && (v as unknown[]).length > 0);
    if (!Array.isArray(arr)) return [];
    return (arr as AnyObj[])
      .filter(q => q && typeof q === "object" && q["id"] && q["schemaVersion"] === 2)
      .map(normalizeV2);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    process.stderr.write(`  [LOAD-ERROR] ${filePath.split("/").slice(-4).join("/")}: ${msg}\n`);
    return [];
  }
}

const V1_EXCLUDED = new Set([
  "types.ts", "index.ts", "v2adapter.ts", "canonicalChapterRegistry.gen.ts",
  "class9-chemistry.ts", "class9-biology.ts", "class9-science-placeholders.ts",
]);

function collectFilesRecursive(dir: string, ext: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...collectFilesRecursive(full, ext));
    else if (entry.name.endsWith(ext)) results.push(full);
  }
  return results;
}

export async function loadAllQuestions(): Promise<ReviewableQuestion[]> {
  const all: ReviewableQuestion[] = [];

  if (existsSync(HH_DATA)) {
    const v1Files = readdirSync(HH_DATA)
      .filter(f => f.endsWith(".ts") && !V1_EXCLUDED.has(f) && /^class\d/.test(f))
      .map(f => join(HH_DATA, f));
    for (const fp of v1Files) all.push(...await loadV1File(fp));
  }

  for (const fp of collectFilesRecursive(QB_ROOT, ".ts")) {
    all.push(...await loadV2File(fp));
  }

  return all.filter(q => q.id && q.question.trim() && q.answer.trim());
}

/**
 * Generator-safe discovery for data derived from student-visible bank content.
 *
 * V1 chapter visibility comes from the same ChapterMeta objects used by the
 * frontend. V2 content is accepted only when the canonical curriculum gateway
 * marks its adapted chapter ID ACTIVE. This loader never changes or becomes a
 * second source of question content; it only filters the existing bank.
 */
export async function loadStudentVisibleQuestions(): Promise<ReviewableQuestion[]> {
  const activeV1QuestionIds = new Set<string>();

  if (existsSync(HH_DATA)) {
    const v1Files = readdirSync(HH_DATA)
      .filter(f => f.endsWith(".ts") && !V1_EXCLUDED.has(f) && /^class\d/.test(f))
      .map(f => join(HH_DATA, f));

    for (const filePath of v1Files) {
      try {
        const mod = await import(filePath) as Record<string, unknown>;
        const chapter = mod["CHAPTER_META"] as AnyObj | undefined;
        const questions = mod["QUESTIONS"];
        if (
          chapter?.["curriculumStatus"] !== "ACTIVE" ||
          chapter?.["cbseDeleted"] === true ||
          !Array.isArray(questions)
        ) continue;
        for (const question of questions as AnyObj[]) {
          if (question && typeof question["id"] === "string") {
            activeV1QuestionIds.add(question["id"]);
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        process.stderr.write(`  [LOAD-ERROR] ${filePath.split("/").slice(-3).join("/")}: ${msg}\n`);
      }
    }
  }

  const all = await loadAllQuestions();
  return all.filter((question) => {
    if (question.schema === "v1") return activeV1QuestionIds.has(question.id);
    return getCanonicalChapter(question.chapterId)?.status === "ACTIVE";
  });
}

// ─── Filter + should-review logic ────────────────────────────────────────────

export function applyFilters(questions: ReviewableQuestion[], args: Args): ReviewableQuestion[] {
  return questions.filter(q => {
    if (args.classNum && q.classNum !== args.classNum)                                  return false;
    if (args.subject  && !q.subject.toLowerCase().includes(args.subject.toLowerCase())) return false;
    if (args.chapter  && q.chapterId.toLowerCase() !== args.chapter.toLowerCase())      return false;
    if (args.question && q.id !== args.question)                                        return false;
    return true;
  });
}

/**
 * Return the effective checklist version from a cache record, handling both
 * new records (checklistVersion) and legacy records (promptVersion).
 */
function recordVersion(rec: ReviewRecord): string {
  return rec.checklistVersion ?? rec.promptVersion ?? "0.0";
}

/**
 * Decide whether a question needs a new review API call.
 * Skip ONLY when: overall === GOLD_STANDARD_PASS AND hash matches AND checklistVersion matches.
 * Every other state — including legacy PASS under old promptVersion — is re-reviewed.
 */
export function shouldReview(
  q:     ReviewableQuestion,
  cache: ChapterCache,
  args:  Args,
): { skip: boolean; reason: string } {
  const existing = cache[q.id];

  if (args.failedOnly) {
    if (!existing) return { skip: true, reason: "no prior result (remove --failed-only to review)" };
    const isCurrentPass =
      existing.overall === "GOLD_STANDARD_PASS" &&
      recordVersion(existing) === GS_CONFIG.CHECKLIST_VERSION;
    if (isCurrentPass)                                               return { skip: true, reason: "previous GOLD_STANDARD_PASS" };
    if (existing.overall === "REVIEW_BLOCKED_CONTEXT_MISSING")       return { skip: false, reason: "context was missing — re-attempting after context fix" };
    // Legacy PASS records need re-review under new checklist
    return { skip: false, reason: "previous non-GOLD_STANDARD_PASS — re-reviewing" };
  }

  if (!existing)                                                     return { skip: false, reason: "no prior result" };
  if (args.force)                                                    return { skip: false, reason: "--force flag" };
  if (existing.overall === "REVIEW_BLOCKED_CONTEXT_MISSING")         return { skip: false, reason: "context was missing — re-attempting" };

  // Checklist version changed → stale record
  if (recordVersion(existing) !== GS_CONFIG.CHECKLIST_VERSION)
    return { skip: false, reason: `checklist version changed (${recordVersion(existing)} → ${GS_CONFIG.CHECKLIST_VERSION})` };

  const hash = computeContentHash(q);
  if (existing.contentHash !== hash)                                 return { skip: false, reason: "content changed since last review" };

  // Any non-PASS outcome → re-review
  if (existing.overall !== "GOLD_STANDARD_PASS")
    return { skip: false, reason: `previous ${existing.overall} — re-reviewing` };

  return { skip: true, reason: `hash match · GOLD_STANDARD_PASS on ${existing.reviewedAt.slice(0, 10)}` };
}

// ─── Gold Standard Reviewer Prompt ────────────────────────────────────────────

const CRITERIA_PROMPT_LIST = CHECKLIST.map((c, i) =>
  `${i + 1}. ${c.name.toUpperCase()} [${c.id}]`
).join("\n");

const REVIEWER_SYSTEM = `You are a Senior Academic Reviewer for NCERT/CBSE curriculum (Classes 6–12).
You are the FINAL Gold Standard quality gate before question-bank content is published to students.

GENERATION INTENT: Every Q&A was authored to be "important, relevant and examination-worthy;
suitable for use by an experienced CBSE teacher; acceptable to an experienced CBSE examiner;
fully accurate; complete in marking points; sufficiently deep; and understandable by a weak student."
Your job is to verify that this intent was realised.

FIELDS YOU ARE REVIEWING:
  question  — the question text presented to the student
  answer    — the single complete answer string stored in the question bank
  steps     — the worked solution as an array of numbered steps
  hint      — the first hint given to the student (directional, not revealing)
  hint2     — second hint (if present)
  hint3     — third hint (if present)
  examTip   — examiner insight (if present)

CRITERIA TO EVALUATE (iterate over each in order):
${CRITERIA_PROMPT_LIST}

CRITERION DEFINITIONS:
1. CURRICULUM ALIGNMENT — Using only the SOURCE CONTEXT provided, confirm the concept tested appears in this chapter. Cite the section or theorem name. FAIL if not found.
2. QUESTION CLARITY — A student seeing this for the first time interprets it in exactly one way. All data needed to answer is present. No grammatical error changes meaning.
3. FACTUAL AND MATHEMATICAL CORRECTNESS — Verify every numerical calculation independently (show your working in supporting_evidence). FAIL only if you can demonstrate the specific error. Never assert a FAIL without showing the calculation.
4. SOLUTION STEPS VALIDITY — Each step follows logically from the previous. No assumption is introduced without justification. Final step produces the answer value.
5. MARKING COMPLETENESS — As a CBSE examiner, list every mark-worthy point. Confirm each is present and explicit in the answer field.
6. EXAMINATION WORTHINESS — Would this question appear in a CBSE school or board exam for this class? State why or why not.
7. CURRICULUM IMPORTANCE — The concept tested appears in chapter summary, chapter-end exercises, or is prerequisite for a later concept.
8. APPROPRIATE DEPTH — The question requires application or reasoning, not verbatim recall of one sentence. Check: would copying one sentence from the source context answer it?
9. WEAK STUDENT ACCESSIBILITY — Every term in the steps is defined or universally standard for this class. No step says "obviously" or jumps without justification.
10. HINT QUALITY — Hints guide toward method without stating the answer or any key intermediate result. Naming a theorem is acceptable; stating its result is not.

EVIDENCE REQUIREMENTS:
For every criterion that FAILS, you MUST provide all four fields:
  exact_defective_text  — verbatim text from the Q&A that is wrong (must be non-empty)
  reason                — why it fails this criterion (must be non-empty)
  expected_correction   — the specific fix required (must be non-empty)
  supporting_evidence   — your own calculation, source citation, or logical contradiction (must be non-empty)

If you cannot provide all four fields for a FAIL, do NOT mark it as FAIL.

FALSE-POSITIVE RULES (mandatory):
  • For correctness: if your expected_correction contains the same numerical value or formula
    as the existing answer, your correction is self-contradicting — do NOT mark it as FAIL.
  • Do not reference "Option (A/B/C/D)" for questions that are not MCQ format.
  • Do not FAIL curriculum_alignment or correctness without citing specific evidence.

RETURN FORMAT — valid JSON only, no markdown, no extra keys:
{
  "dimensions": {
    "curriculum_alignment":       "PASS|FAIL",
    "question_clarity":           "PASS|FAIL",
    "correctness":                "PASS|FAIL",
    "steps_validity":             "PASS|FAIL",
    "marking_completeness":       "PASS|FAIL",
    "examination_worthiness":     "PASS|FAIL",
    "curriculum_importance":      "PASS|FAIL",
    "appropriate_depth":          "PASS|FAIL",
    "weak_student_accessibility": "PASS|FAIL",
    "hint_quality":               "PASS|FAIL"
  },
  "fail_evidence": [
    {
      "criterion_id":         "<id of the failed criterion>",
      "exact_defective_text": "<verbatim wrong text>",
      "reason":               "<why it fails>",
      "expected_correction":  "<specific fix>",
      "supporting_evidence":  "<calculation or source citation>",
      "reviewer_confidence":  0.0
    }
  ]
}

RULES:
  • Do NOT set an "overall" field — that is determined by the review engine, not by you.
  • Every FAIL dimension must have a corresponding entry in fail_evidence.
  • fail_evidence must be an empty array [] when all dimensions PASS.
  • reviewer_confidence is a float 0.0–1.0 reflecting your certainty about that specific FAIL.`;

const SECOND_VERIFIER_SYSTEM = `You are an independent Senior Academic Reviewer for NCERT/CBSE curriculum.
A previous reviewer has flagged alleged defects in a question-bank entry.
Your task is to independently confirm or reject each allegation.

You will be given:
  1. The original Q&A content with source context
  2. The previous reviewer's specific allegations (exact_defective_text, reason, expected_correction, supporting_evidence)

For EACH allegation:
  - Independently verify the claim using the source context and your own reasoning
  - If you AGREE the defect exists, provide your own complete evidence
  - If you DISAGREE or find the allegation incorrect, do NOT mark that criterion as FAIL

Return the same JSON format as the primary review:
{
  "dimensions": { "<criterion_id>": "PASS|FAIL", ... },
  "fail_evidence": [ { same structure as primary review } ]
}

CRITICAL: Only confirm a defect if YOU can independently verify it with your own calculation or source citation.
Do NOT simply defer to the previous reviewer's conclusion.
Do NOT set an "overall" field.`;

function buildReviewerPrompt(q: ReviewableQuestion, ctx: { text: string }): string {
  const stepsText = q.steps.length === 0
    ? "(no steps provided)"
    : q.steps.map(s => {
        const lines = [`Step ${s.stepNumber}: ${s.title}`, `  ${s.explanation}`];
        if (s.formula) lines.push(`  Formula: ${s.formula}`);
        if (s.result)  lines.push(`  Result:  ${s.result}`);
        return lines.join("\n");
      }).join("\n\n");

  const hintLines = [`Hint 1: ${q.hint}`];
  if (q.hint2) hintLines.push(`Hint 2: ${q.hint2}`);
  if (q.hint3) hintLines.push(`Hint 3: ${q.hint3}`);

  const parts: string[] = [
    `SOURCE CONTEXT:\n${ctx.text}`,
    "---",
    `BOARD:      ${q.board}`,
    `CLASS:      ${q.classNum}`,
    `SUBJECT:    ${q.subject}`,
    `CHAPTER:    ${q.chapterName} (${q.chapterId})`,
    `TOPIC:      ${q.topicName} (${q.topicId})`,
    `DIFFICULTY: ${q.difficulty}`,
    "",
    "QUESTION:",
    q.question,
    "",
    "ANSWER:",
    q.answer,
    "",
    "STEPS:",
    stepsText,
    "",
    `HINT${hintLines.length > 1 ? "S" : ""}:`,
    ...hintLines,
  ];
  if (q.examTip) parts.push("", `EXAM TIP: ${q.examTip}`);
  parts.push("", "Evaluate all criteria and return only the JSON result.");
  return parts.join("\n");
}

function buildSecondVerificationPrompt(
  q:           ReviewableQuestion,
  ctx:         { text: string },
  allegations: DefectEvidence[],
): string {
  const basePrompt = buildReviewerPrompt(q, ctx);
  const allegationText = allegations.map((ev, i) => [
    `\nAllegation ${i + 1} — Criterion: ${ev.criterion_id}`,
    `  Defective text: ${ev.exact_defective_text}`,
    `  Reason:         ${ev.reason}`,
    `  Expected fix:   ${ev.expected_correction}`,
    `  Evidence:       ${ev.supporting_evidence}`,
  ].join("\n")).join("\n");

  return [
    basePrompt,
    "",
    "═".repeat(60),
    "PREVIOUS REVIEWER ALLEGATIONS — confirm or reject each independently:",
    allegationText,
    "",
    "Return the full dimensions object (all criteria, not just the alleged failures).",
    "Only mark a criterion FAIL if YOU can independently verify it.",
  ].join("\n");
}

// ─── Evidence helpers ─────────────────────────────────────────────────────────

/**
 * An evidence entry is complete only when all four content fields are non-empty.
 * reviewer_confidence is metadata — it does not affect completeness.
 */
export function isEvidenceComplete(ev: DefectEvidence): boolean {
  return (
    typeof ev.criterion_id === "string"         && ev.criterion_id.trim().length > 0        &&
    typeof ev.exact_defective_text === "string" && ev.exact_defective_text.trim().length > 0 &&
    typeof ev.reason === "string"               && ev.reason.trim().length > 0               &&
    typeof ev.expected_correction === "string"  && ev.expected_correction.trim().length > 0  &&
    typeof ev.supporting_evidence === "string"  && ev.supporting_evidence.trim().length > 0
  );
}

// ─── False-Positive Guards ────────────────────────────────────────────────────

/**
 * Normalise text for semantic comparison — strip whitespace and punctuation
 * to catch cases where the reviewer restates the same value with different formatting.
 */
function normaliseForComparison(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9.]/g, "").trim();
}

/** True if the Q&A question text contains explicit MCQ option markers. */
function questionHasMcqOptions(q: ReviewableQuestion): boolean {
  return /\(\s*[A-D]\s*\)/.test(q.question) || /^[A-D][.)]/m.test(q.question);
}

/**
 * Apply all false-positive guards to the raw reviewer output.
 * Demoted FAIL dimensions are promoted to PASS; their evidence entries are removed.
 * Returns cleaned dimensions and evidence.
 *
 * Guards applied:
 *  G1 — proposed correction for "correctness" is semantically identical to the existing answer
 *  G2 — ShortAnswer/non-MCQ review references MCQ option letters
 *  G3 — correctness or curriculum_alignment FAIL without specific supporting evidence
 *  G4 — any criterion FAIL where the reviewer claims "not found" but exact_defective_text is empty
 */
export function applyFalsePositiveGuards(
  q:           ReviewableQuestion,
  dimensions:  Record<string, "PASS" | "FAIL">,
  failEvidence: DefectEvidence[],
): { dimensions: Record<string, "PASS" | "FAIL">; failEvidence: DefectEvidence[] } {
  const dims = { ...dimensions };
  const demotedCriteria = new Set<string>();

  for (const ev of failEvidence) {
    if (dims[ev.criterion_id] !== "FAIL") continue;

    // G1: proposed correction for correctness is semantically identical to the answer
    if (ev.criterion_id === "correctness") {
      const ansNorm = normaliseForComparison(q.answer);
      const fixNorm = normaliseForComparison(ev.expected_correction);
      if (ansNorm.length > 0 && fixNorm.length > 0 && ansNorm === fixNorm) {
        demotedCriteria.add(ev.criterion_id);
        continue;
      }
      // Also check if expected_correction contains the same numbers as the answer
      const ansNumbers = q.answer.match(/\d+\.?\d*/g) ?? [];
      const fixNumbers = (ev.expected_correction.match(/\d+\.?\d*/g) ?? []);
      if (ansNumbers.length > 0 && ansNumbers.length === fixNumbers.length &&
          ansNumbers.every((n, i) => n === fixNumbers[i])) {
        demotedCriteria.add(ev.criterion_id);
        continue;
      }
    }

    // G2: non-MCQ question review references MCQ option letters
    if (!questionHasMcqOptions(q)) {
      const optionPattern = /\bOption\s*\([A-D]\)|\boption\s*[A-D]\b/i;
      if (optionPattern.test(ev.reason) || optionPattern.test(ev.expected_correction)) {
        demotedCriteria.add(ev.criterion_id);
        continue;
      }
    }

    // G3: correctness or curriculum_alignment FAIL without supporting evidence
    if (ev.criterion_id === "correctness" || ev.criterion_id === "curriculum_alignment") {
      if (!ev.supporting_evidence || ev.supporting_evidence.trim().length < 5) {
        demotedCriteria.add(ev.criterion_id);
        continue;
      }
    }

    // G4: FAIL where exact_defective_text is empty
    if (!ev.exact_defective_text || ev.exact_defective_text.trim().length === 0) {
      demotedCriteria.add(ev.criterion_id);
    }
  }

  for (const cid of demotedCriteria) dims[cid] = "PASS";
  const cleanedEvidence = failEvidence.filter(ev => !demotedCriteria.has(ev.criterion_id));

  return { dimensions: dims, failEvidence: cleanedEvidence };
}

// ─── Outcome determination ────────────────────────────────────────────────────

/**
 * Determine the Gold Standard outcome from dimensions and evidence.
 * The reviewer does NOT set overall — this function determines it.
 *
 * Rules:
 *  - All criteria PASS → GOLD_STANDARD_PASS
 *  - Any criterion FAIL with complete evidence for every FAIL → POSSIBLE_DEFECT_REQUIRES_VERIFICATION
 *  - Any criterion FAIL without complete evidence for any FAIL → REVIEWER_UNCERTAINTY
 *  - Malformed dimensions → REVIEWER_UNCERTAINTY (handled by caller)
 */
export function determineOutcome(
  dimensions:   Record<string, "PASS" | "FAIL">,
  failEvidence: DefectEvidence[],
): "GOLD_STANDARD_PASS" | "POSSIBLE_DEFECT_REQUIRES_VERIFICATION" | "REVIEWER_UNCERTAINTY" {
  const failedCriteria = CHECKLIST
    .map(c => c.id)
    .filter(id => dimensions[id] === "FAIL");

  if (failedCriteria.length === 0) return "GOLD_STANDARD_PASS";

  // Every failed criterion must have complete evidence
  for (const criterionId of failedCriteria) {
    const ev = failEvidence.find(e => e.criterion_id === criterionId);
    if (!ev || !isEvidenceComplete(ev)) return "REVIEWER_UNCERTAINTY";
  }

  return "POSSIBLE_DEFECT_REQUIRES_VERIFICATION";
}

// ─── normalizeReviewResult ────────────────────────────────────────────────────

/**
 * Parse raw reviewer JSON, apply false-positive guards, and determine the outcome.
 * Never trusts the reviewer's own "overall" field.
 * Returns REVIEWER_UNCERTAINTY on malformed or contradictory input.
 */
export function normalizeReviewResult(
  raw: unknown,
  q:   ReviewableQuestion,
): {
  outcome:      "GOLD_STANDARD_PASS" | "POSSIBLE_DEFECT_REQUIRES_VERIFICATION" | "REVIEWER_UNCERTAINTY";
  dimensions:   Record<string, "PASS" | "FAIL">;
  failEvidence: DefectEvidence[];
  failConfidences: Record<string, number>;
  reasons:      string[];
} {
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  // Parse dimensions — iterate over the authoritative checklist
  const rawDims = (typeof r["dimensions"] === "object" && r["dimensions"] !== null
    ? r["dimensions"]
    : {}) as Record<string, unknown>;

  const dimensions: Record<string, "PASS" | "FAIL"> = {};
  for (const c of CHECKLIST) {
    dimensions[c.id] = rawDims[c.id] === "FAIL" ? "FAIL" : "PASS";
  }

  // If all dimension values in the raw response are missing → malformed
  const allMissing = CHECKLIST.every(c => rawDims[c.id] === undefined);
  if (allMissing) {
    return {
      outcome: "REVIEWER_UNCERTAINTY",
      dimensions,
      failEvidence: [],
      failConfidences: {},
      reasons: ["Reviewer returned malformed or missing dimensions object"],
    };
  }

  // Parse fail_evidence
  const rawEvidence = Array.isArray(r["fail_evidence"]) ? r["fail_evidence"] : [];
  const failEvidence: DefectEvidence[] = rawEvidence
    .filter((e): e is Record<string, unknown> => typeof e === "object" && e !== null)
    .map(e => ({
      criterion_id:         String(e["criterion_id"]         ?? ""),
      exact_defective_text: String(e["exact_defective_text"] ?? ""),
      reason:               String(e["reason"]               ?? ""),
      expected_correction:  String(e["expected_correction"]  ?? ""),
      supporting_evidence:  String(e["supporting_evidence"]  ?? ""),
      reviewer_confidence:  typeof e["reviewer_confidence"] === "number" ? e["reviewer_confidence"] : 0,
    }));

  // Apply false-positive guards
  const { dimensions: guardedDims, failEvidence: guardedEvidence } =
    applyFalsePositiveGuards(q, dimensions, failEvidence);

  // Determine outcome — code determines this, not the reviewer
  const outcome = determineOutcome(guardedDims, guardedEvidence);

  // Build metadata
  const failConfidences: Record<string, number> = {};
  for (const ev of guardedEvidence) {
    if (ev.reviewer_confidence > 0) failConfidences[ev.criterion_id] = ev.reviewer_confidence;
  }

  const reasons = guardedEvidence.map(ev => `[${ev.criterion_id}] ${ev.reason}`);

  return { outcome, dimensions: guardedDims, failEvidence: guardedEvidence, failConfidences, reasons };
}

// ─── OpenAI calls ─────────────────────────────────────────────────────────────

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

interface OpenAIUsage {
  prompt_tokens:     number;
  completion_tokens: number;
}

async function callOpenAI(
  apiKey:     string,
  systemMsg:  string,
  userText:   string,
  model:      string,
  maxTokens:  number,
): Promise<{ parsed: unknown; usage: OpenAIUsage }> {
  const body = JSON.stringify({
    model,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemMsg },
      { role: "user",   content: userText  },
    ],
    max_tokens: maxTokens,
  });

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(OPENAI_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body,
    });

    if (res.status === 429) {
      const ra   = res.headers.get("Retry-After") ?? res.headers.get("x-ratelimit-reset-requests");
      const wait = ra ? Math.min(Math.round(parseFloat(ra) * 1000), 10_000) : 2_000 * (attempt + 1);
      process.stderr.write(`  [RATE-LIMIT] Waiting ${wait}ms before retry ${attempt + 1}/3\n`);
      await sleep(wait);
      continue;
    }
    if (res.status === 401) throw new Error("OPENAI_API_KEY is invalid or has expired (HTTP 401)");
    if (!res.ok)            throw new Error(`OpenAI returned HTTP ${res.status}`);

    const json = await res.json() as {
      choices?: { message?: { content?: string } }[];
      usage?:   OpenAIUsage;
    };
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response body");
    const usage = json.usage ?? { prompt_tokens: EST_IN_TOKENS_PER_Q, completion_tokens: EST_OUT_TOKENS_PER_Q };
    return { parsed: JSON.parse(raw), usage };
  }
  throw new Error("OpenAI rate limit exhausted after 3 retry attempts");
}

// ─── Single-question review orchestration ────────────────────────────────────

interface QuestionReviewResult {
  outcome:       GoldStandardOutcome;
  dimensions:    Record<string, "PASS" | "FAIL">;
  failEvidence:  DefectEvidence[];
  failConfidences: Record<string, number>;
  reasons:       string[];
  model:         string;
  totalInputTok: number;
  totalOutputTok: number;
}

/**
 * Run the Gold Standard review for one question, including:
 *  - Automatic REVIEWER_UNCERTAINTY retries (up to MAX_UNCERTAINTY_RETRIES with REVIEWER_MODEL)
 *  - Escalation to ESCALATION_MODEL after retries are exhausted
 *  - Automatic second verification for POSSIBLE_DEFECT_REQUIRES_VERIFICATION
 *
 * Returns the final outcome record.
 */
async function reviewOneQuestion(
  q:      ReviewableQuestion,
  ctx:    { text: string },
  apiKey: string,
): Promise<QuestionReviewResult> {
  let uncertaintyRetries = 0;
  let currentModel: string = GS_CONFIG.REVIEWER_MODEL;
  let escalated          = false;
  let totalInputTok      = 0;
  let totalOutputTok     = 0;
  const prompt           = buildReviewerPrompt(q, ctx);

  // First-review loop (with uncertainty retries and one escalation)
  while (true) {
    const { parsed, usage } = await callOpenAI(apiKey, REVIEWER_SYSTEM, prompt, currentModel, 700);
    totalInputTok  += usage.prompt_tokens;
    totalOutputTok += usage.completion_tokens;

    const { outcome, dimensions, failEvidence, failConfidences, reasons } =
      normalizeReviewResult(parsed, q);

    if (outcome === "GOLD_STANDARD_PASS") {
      return { outcome, dimensions, failEvidence, failConfidences, reasons,
               model: currentModel, totalInputTok, totalOutputTok };
    }

    if (outcome === "REVIEWER_UNCERTAINTY") {
      if (!escalated && uncertaintyRetries < GS_CONFIG.MAX_UNCERTAINTY_RETRIES) {
        uncertaintyRetries++;
        process.stdout.write(`  [RETRY ${uncertaintyRetries}/${GS_CONFIG.MAX_UNCERTAINTY_RETRIES}] REVIEWER_UNCERTAINTY — retrying with ${currentModel}\n`);
        continue;
      }
      if (!escalated) {
        escalated    = true;
        currentModel = GS_CONFIG.ESCALATION_MODEL;
        uncertaintyRetries = 0;
        process.stdout.write(`  [ESCALATE] Persistent uncertainty — retrying with ${currentModel}\n`);
        continue;
      }
      // Exhausted all retries and escalation — return uncertainty
      return { outcome: "REVIEWER_UNCERTAINTY", dimensions, failEvidence, failConfidences, reasons,
               model: currentModel, totalInputTok, totalOutputTok };
    }

    // POSSIBLE_DEFECT_REQUIRES_VERIFICATION → second verification
    process.stdout.write(`  [VERIFY] Running second verification for ${failEvidence.length} allegation(s)…\n`);
    const secondPrompt = buildSecondVerificationPrompt(q, ctx, failEvidence);
    const { parsed: parsed2, usage: usage2 } =
      await callOpenAI(apiKey, SECOND_VERIFIER_SYSTEM, secondPrompt, GS_CONFIG.REVIEWER_MODEL, 700);
    totalInputTok  += usage2.prompt_tokens;
    totalOutputTok += usage2.completion_tokens;

    const { outcome: outcome2, dimensions: dims2, failEvidence: ev2, failConfidences: fc2, reasons: r2 } =
      normalizeReviewResult(parsed2, q);

    // Second reviewer must independently confirm the SAME criteria with complete evidence
    if (outcome2 === "POSSIBLE_DEFECT_REQUIRES_VERIFICATION") {
      // Check that the second reviewer agrees on at least one of the original allegations
      const firstFailedIds  = new Set(failEvidence.map(e => e.criterion_id));
      const secondConfirmed = ev2.filter(e => firstFailedIds.has(e.criterion_id));

      if (secondConfirmed.length > 0) {
        return { outcome: "CONFIRMED_DEFECT", dimensions: dims2, failEvidence: secondConfirmed,
                 failConfidences: fc2, reasons: r2,
                 model: GS_CONFIG.REVIEWER_MODEL, totalInputTok, totalOutputTok };
      }
    }

    // Second reviewer disagrees or is uncertain
    return { outcome: "REVIEWER_UNCERTAINTY", dimensions, failEvidence, failConfidences, reasons,
             model: `${GS_CONFIG.REVIEWER_MODEL}→verify`, totalInputTok, totalOutputTok };
  }
}

// ─── Cost estimate ────────────────────────────────────────────────────────────

function printCostEstimate(count: number, delayMs: number): void {
  const inTok   = count * EST_IN_TOKENS_PER_Q;
  const outTok  = count * EST_OUT_TOKENS_PER_Q;
  const inCost  = (inTok  / 1_000_000) * PRICE_IN_PER_M;
  const outCost = (outTok / 1_000_000) * PRICE_OUT_PER_M;
  const total   = inCost + outCost;
  const wallSec = Math.round((count * (delayMs + 3_500)) / 1_000);
  const min     = Math.floor(wallSec / 60);
  const sec     = wallSec % 60;
  const pad     = (s: string, w = 22): string => s.padEnd(w);
  console.log(`\nACADEMIC REVIEW — Cost Estimate`);
  console.log("═".repeat(44));
  console.log(`${pad("Questions to review:")} ${count.toLocaleString()}`);
  console.log(`${pad("Model:")} ${GS_CONFIG.REVIEWER_MODEL}`);
  console.log(`${pad("Est. input tokens:")} ${inTok.toLocaleString()}  (~${EST_IN_TOKENS_PER_Q}/q)`);
  console.log(`${pad("Est. output tokens:")} ${outTok.toLocaleString()}  (~${EST_OUT_TOKENS_PER_Q}/q)`);
  console.log(`${pad("Est. input cost:")} $${inCost.toFixed(4)}  ($${PRICE_IN_PER_M}/1M)`);
  console.log(`${pad("Est. output cost:")} $${outCost.toFixed(4)}  ($${PRICE_OUT_PER_M}/1M)`);
  console.log(`${pad("Est. total cost:")} $${total.toFixed(4)}`);
  console.log(`${pad("Est. wall-clock:")} ~${min}m ${sec}s  (${delayMs}ms delay + ~3.5s API/q)`);
  console.log("─".repeat(44));
  console.log("Remove --cost-estimate to execute the review.\n");
}

// ─── Summary report ───────────────────────────────────────────────────────────

interface RunSummary {
  goldStandardPassed:  number;
  confirmedDefects:    number;
  possibleDefects:     number;
  reviewerUncertainty: number;
  blocked:             number;
  skipped:             number;
  errors:              number;
  totalInputTok:       number;
  totalOutputTok:      number;
}

function printSummary(
  summary:     RunSummary,
  corrections: { q: ReviewableQuestion; record: ReviewRecord }[],
): void {
  const HR = "═".repeat(66);
  const hr = "─".repeat(66);
  const reviewed = summary.goldStandardPassed + summary.confirmedDefects +
                   summary.possibleDefects + summary.reviewerUncertainty + summary.blocked;
  const inCost  = (summary.totalInputTok  / 1_000_000) * PRICE_IN_PER_M;
  const outCost = (summary.totalOutputTok / 1_000_000) * PRICE_OUT_PER_M;

  console.log(`\n${HR}`);
  console.log("ACADEMIC REVIEW — SUMMARY  (Gold Standard v" + GS_CONFIG.CHECKLIST_VERSION + ")");
  console.log(hr);
  console.log(`  Reviewed        : ${reviewed}`);
  console.log(`    GOLD_STANDARD_PASS             : ${summary.goldStandardPassed}`);
  console.log(`    CONFIRMED_DEFECT               : ${summary.confirmedDefects}`);
  console.log(`    POSSIBLE_DEFECT_REQ_VERIFY     : ${summary.possibleDefects}`);
  console.log(`    REVIEWER_UNCERTAINTY           : ${summary.reviewerUncertainty}`);
  console.log(`    REVIEW_BLOCKED_CONTEXT_MISSING : ${summary.blocked}`);
  console.log(`  Skipped         : ${summary.skipped}  (unchanged hash + GOLD_STANDARD_PASS)`);
  if (summary.errors) console.log(`  Errors          : ${summary.errors}  (API/load failures — re-run to retry)`);
  if (reviewed > 0) {
    console.log(hr);
    console.log(`  Actual tokens used:`);
    console.log(`    Input    : ${summary.totalInputTok.toLocaleString()}`);
    console.log(`    Output   : ${summary.totalOutputTok.toLocaleString()}`);
    console.log(`    Cost est : $${(inCost + outCost).toFixed(4)}`);
  }

  if (summary.blocked > 0) {
    console.log(hr);
    console.log("  NOTE: BLOCKED questions have no match in the canonical curriculum index.");
    console.log("  Run --context-audit to see which chapters are unmatched and why.");
  }

  if (corrections.length > 0) {
    console.log(`\n${hr}`);
    console.log("CONFIRMED DEFECTS — Proposed Corrections");
    console.log("(Do NOT auto-apply — review and apply manually)");
    console.log(hr);

    for (const { q, record } of corrections) {
      const failedIds = record.dimensions
        ? Object.entries(record.dimensions).filter(([, v]) => v === "FAIL").map(([k]) => k).join(", ")
        : "—";

      console.log(`\nQ: ${q.id}`);
      console.log(`   ${q.subject} Cl.${q.classNum} · ${q.chapterName} · ${q.topicName}`);
      console.log(`   Failed criteria: ${failedIds}`);

      for (const ev of record.failEvidence) {
        console.log(`\n   [${ev.criterion_id}]`);
        console.log(`     Defective text: ${ev.exact_defective_text}`);
        console.log(`     Reason:         ${ev.reason}`);
        console.log(`     Fix required:   ${ev.expected_correction}`);
        console.log(`     Evidence:       ${ev.supporting_evidence}`);
      }
    }
  }

  console.log(`\n${HR}`);
  const failures = summary.confirmedDefects + summary.possibleDefects + summary.reviewerUncertainty;
  if (failures > 0) {
    console.log(`Full records: academic-review/results/<chapterId>.json`);
    console.log(`Exit code: 1  (${failures} question(s) require attention)`);
  } else if (summary.blocked > 0 && reviewed === summary.blocked) {
    console.log("No questions were reviewed: all had MISSING context.");
    console.log("Exit code: 1  (context must be established before review can proceed)");
  } else if (reviewed > 0) {
    console.log("All reviewed questions achieved GOLD_STANDARD_PASS.");
  }
  console.log(HR);
}

// ─── Batch processor ─────────────────────────────────────────────────────────

async function runReviews(
  toReview: ReviewableQuestion[],
  cacheMap: Map<string, ChapterCache>,
  args:     Args,
  apiKey:   string,
): Promise<{ summary: RunSummary; corrections: { q: ReviewableQuestion; record: ReviewRecord }[] }> {
  const summary: RunSummary = {
    goldStandardPassed: 0, confirmedDefects: 0, possibleDefects: 0,
    reviewerUncertainty: 0, blocked: 0, skipped: 0, errors: 0,
    totalInputTok: 0, totalOutputTok: 0,
  };
  const corrections: { q: ReviewableQuestion; record: ReviewRecord }[] = [];

  const cap   = args.maxQuestions !== undefined ? args.maxQuestions : Infinity;
  let   done  = 0;
  const total = Math.min(toReview.length, Number.isFinite(cap) ? cap : toReview.length);

  for (const q of toReview) {
    if (done >= cap) break;
    done++;

    const ctx = resolveSourceContext(q);
    process.stdout.write(`\n[${done}/${total}] ${q.id}\n`);
    process.stdout.write(`  ${q.subject} Cl.${q.classNum} · ${q.chapterId} · ${q.topicName}\n`);
    process.stdout.write(`  Context: ${ctx.status}`);
    if (ctx.canonicalChapterId) process.stdout.write(` → '${ctx.canonicalChapterId}'`);
    process.stdout.write("\n");

    // SAFETY RULE: block review when official context is missing
    if (ctx.status === "MISSING") {
      const blockedRecord: ReviewRecord = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        checklistVersion:    GS_CONFIG.CHECKLIST_VERSION,
        reviewedAt:          new Date().toISOString(),
        model:               GS_CONFIG.REVIEWER_MODEL,
        sourceContextStatus: "MISSING",
        overall:             "REVIEW_BLOCKED_CONTEXT_MISSING",
        dimensions:          null,
        failEvidence:        [],
        failConfidences:     {},
        reasons:             [ctx.missReason ?? "chapter not found in curriculum index"],
      };
      const cache = cacheMap.get(q.chapterId) ?? {};
      cache[q.id] = blockedRecord;
      cacheMap.set(q.chapterId, cache);
      saveCache(q.chapterId, cache);
      process.stdout.write(`  Result:  REVIEW_BLOCKED_CONTEXT_MISSING\n`);
      process.stdout.write(`  Reason:  ${blockedRecord.reasons[0]}\n`);
      summary.blocked++;
      continue;
    }

    // Run Gold Standard review with retries and second verification
    let record: ReviewRecord;
    try {
      const result = await reviewOneQuestion(q, ctx, apiKey);
      summary.totalInputTok  += result.totalInputTok;
      summary.totalOutputTok += result.totalOutputTok;

      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        checklistVersion:    GS_CONFIG.CHECKLIST_VERSION,
        reviewedAt:          new Date().toISOString(),
        model:               result.model,
        sourceContextStatus: "PRESENT",
        overall:             result.outcome,
        dimensions:          result.dimensions,
        failEvidence:        result.failEvidence,
        failConfidences:     result.failConfidences,
        reasons:             result.reasons,
        tokenUsage: {
          inputTokens:      result.totalInputTok,
          outputTokens:     result.totalOutputTok,
          estimatedCostUSD: (result.totalInputTok  / 1_000_000) * PRICE_IN_PER_M +
                            (result.totalOutputTok / 1_000_000) * PRICE_OUT_PER_M,
        },
      };

      process.stdout.write(`  Result:  ${result.outcome}`);
      if (result.outcome === "GOLD_STANDARD_PASS") {
        summary.goldStandardPassed++;
      } else {
        const failedDims = Object.entries(result.dimensions)
          .filter(([, v]) => v === "FAIL").map(([k]) => k);
        if (failedDims.length) process.stdout.write(` [${failedDims.join(", ")}]`);
        if (result.outcome === "CONFIRMED_DEFECT")                    { summary.confirmedDefects++;    corrections.push({ q, record }); }
        else if (result.outcome === "POSSIBLE_DEFECT_REQUIRES_VERIFICATION") summary.possibleDefects++;
        else                                                            summary.reviewerUncertainty++;
      }
      process.stdout.write(`  (tokens: ${result.totalInputTok}+${result.totalOutputTok}  cost: $${record.tokenUsage!.estimatedCostUSD.toFixed(5)})\n`);

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`  [ERROR] ${msg}\n`);
      summary.errors++;
      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        checklistVersion:    GS_CONFIG.CHECKLIST_VERSION,
        reviewedAt:          new Date().toISOString(),
        model:               GS_CONFIG.REVIEWER_MODEL,
        sourceContextStatus: "PRESENT",
        overall:             "REVIEWER_UNCERTAINTY",
        dimensions:          Object.fromEntries(CHECKLIST.map(c => [c.id, "FAIL" as const])),
        failEvidence:        [],
        failConfidences:     {},
        reasons:             [`Review call failed: ${msg}`],
      };
      summary.reviewerUncertainty++;
    }

    const cache = cacheMap.get(q.chapterId) ?? {};
    cache[q.id] = record;
    cacheMap.set(q.chapterId, cache);
    saveCache(q.chapterId, cache);

    if (done < total && args.delayMs > 0) await sleep(args.delayMs);
  }

  return { summary, corrections };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args   = parseArgs();
  const apiKey = process.env.OPENAI_API_KEY;

  const HR = "═".repeat(66);
  const hr = "─".repeat(66);
  console.log(`\n${HR}`);
  console.log("ACADEMIC REVIEW — SnapSolve Question Bank  (Gold Standard)");
  console.log(`Checklist version: ${GS_CONFIG.CHECKLIST_VERSION}  |  Model: ${GS_CONFIG.REVIEWER_MODEL}`);
  console.log(`Criteria: ${CHECKLIST.length} (${CHECKLIST.map(c => c.id).join(", ")})`);
  console.log(HR);

  console.log("Canonical contract: loaded (scripts/src/canonicalCurriculum.ts)");

  if (!args.contextAudit && !args.dryRun && !args.costEstimate && !apiKey) {
    console.error("\nERROR: OPENAI_API_KEY is not set.");
    console.error("  Use --dry-run to preview the review queue without calling the API.");
    console.error("  Use --cost-estimate to see the estimated cost before running.");
    console.error("  Use --context-audit to check curriculum context coverage (no API needed).\n");
    process.exit(1);
  }

  process.stdout.write("Loading question sources…\n");
  const allQuestions = await loadAllQuestions();

  const byGroup = new Map<string, number>();
  for (const q of allQuestions) {
    const k = `Cl.${q.classNum} ${q.subject}`;
    byGroup.set(k, (byGroup.get(k) ?? 0) + 1);
  }
  console.log(`Loaded ${allQuestions.length} questions from ${byGroup.size} subject group(s):`);
  for (const [k, n] of [...byGroup.entries()].sort()) {
    console.log(`  ${n.toString().padStart(4, " ")}  ${k}`);
  }

  if (args.contextAudit) {
    const filtered = applyFilters(allQuestions, args);
    console.log(`\nRunning context audit on ${filtered.length} question(s)…`);
    const report = runContextAudit(filtered);
    writeFileSync(CONTEXT_AUDIT_OUT, JSON.stringify(report, null, 2), "utf8");
    printContextAudit(report);
    process.exit(0);
    return;
  }

  const filtered = applyFilters(allQuestions, args);
  if (filtered.length !== allQuestions.length) {
    console.log(`\nFilters applied → ${filtered.length} question(s) in scope.`);
    if (args.subject)  console.log(`  --subject : ${args.subject}`);
    if (args.classNum) console.log(`  --class   : ${args.classNum}`);
    if (args.chapter)  console.log(`  --chapter : ${args.chapter}`);
    if (args.question) console.log(`  --question: ${args.question}`);
  }

  if (filtered.length === 0) {
    console.log("\nNo questions matched the given filters. Check spelling.");
    process.exit(0);
  }

  const cacheMap  = new Map<string, ChapterCache>();
  const toReview: ReviewableQuestion[] = [];
  let   skipped = 0;

  for (const q of filtered) {
    if (!cacheMap.has(q.chapterId)) cacheMap.set(q.chapterId, loadCache(q.chapterId));
    const cache = cacheMap.get(q.chapterId)!;
    const { skip, reason } = shouldReview(q, cache, args);

    if (skip) {
      skipped++;
    } else {
      toReview.push(q);
      if (args.dryRun || args.question) console.log(`  QUEUE  ${q.id}  —  ${reason}`);
    }
    if (args.dryRun && skip && args.chapter) {
      console.log(`  SKIP   ${q.id}  —  ${reason}`);
    }
  }

  const queueSize = args.maxQuestions !== undefined
    ? Math.min(toReview.length, args.maxQuestions)
    : toReview.length;

  console.log(hr);
  console.log(`  Queue  : ${queueSize} question(s) will be processed`);
  console.log(`  Skipped: ${skipped}  (unchanged hash + GOLD_STANDARD_PASS)`);
  console.log(hr);

  if (args.costEstimate) {
    const reviewable = toReview.slice(0, queueSize).filter(q => resolveSourceContext(q).status === "PRESENT");
    printCostEstimate(reviewable.length, args.delayMs);
    process.exit(0);
  }

  if (args.dryRun) {
    console.log("\n[DRY RUN] No API calls made and no results written.");
    console.log("Remove --dry-run to execute the review.\n");
    process.exit(0);
  }

  if (queueSize === 0) {
    console.log("\nNothing to review — all questions in scope have a current GOLD_STANDARD_PASS result.");
    console.log("Options:");
    console.log("  --force          re-review all (ignores hash match)");
    console.log("  --failed-only    review only previous non-PASS outcomes");
    console.log("  --context-audit  check curriculum context coverage\n");
    process.exit(0);
  }

  console.log(`Starting review of ${queueSize} question(s)…`);
  console.log("Results are saved after each question (Ctrl+C safe).");
  console.log("Questions with MISSING context are BLOCKED — no API call, no PASS recorded.\n");

  const { summary, corrections } = await runReviews(toReview, cacheMap, args, apiKey!);
  summary.skipped = skipped;

  printSummary(summary, corrections);

  const failures = summary.confirmedDefects + summary.possibleDefects + summary.reviewerUncertainty;
  if (failures > 0 || (summary.blocked > 0 && summary.goldStandardPassed === 0 && failures === 0)) {
    process.exit(1);
  }
}

// Guard: only run main() when this file is executed directly, not when imported by tests.
if (import.meta.url === new URL(process.argv[1], "file://").href) {
  main().catch(err => {
    console.error("\nFatal error:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
}
