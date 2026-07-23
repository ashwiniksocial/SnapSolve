#!/usr/bin/env node
/**
 * Academic Review — offline quality gate for question-bank TypeScript content.
 *
 * SEPARATE from curriculum-check (structural validation).
 * Reads existing question source files, reviews them via OpenAI, and stores
 * results in academic-review/results/. Skips questions whose content hash
 * has not changed since their last PASS result — no repeat API cost.
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
 *   --failed-only        Only review questions with a previous FAIL result
 *   --force              Re-review even if hash matches and previous result is PASS
 *   --cost-estimate      Print estimated API cost for pending questions and exit
 *
 * Review safety rule:
 *   If official curriculum context is MISSING for a question, the reviewer will
 *   NOT call OpenAI and will NOT record a PASS. Instead it records:
 *     overall: "REVIEW_BLOCKED_CONTEXT_MISSING"
 *   Context coverage must be fixed before those questions can be reviewed.
 *   Run --context-audit to see which chapters are missing context and why.
 */

import { createHash }                                                      from "crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, join }                                                    from "path";

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT              = resolve(import.meta.dirname, "../../");
const HH_DATA           = join(ROOT, "artifacts/homework-hero/src/data/questions");
const QB_ROOT           = join(ROOT, "question-bank/questions");
const RESULTS_DIR       = join(ROOT, "academic-review/results");
const CURRICULUM_IDX    = join(ROOT, "curriculum/generated/master-curriculum-index.json");
const CHAPTER_MAP_FILE  = join(ROOT, "academic-review/chapter-context-map.json");
const CONTEXT_AUDIT_OUT = join(ROOT, "academic-review/context-audit.json");

// ─── Model config ─────────────────────────────────────────────────────────────

const MODEL          = "gpt-4o-mini";
const PROMPT_VERSION = "1.1";
const OPENAI_URL     = "https://api.openai.com/v1/chat/completions";

// gpt-4o-mini pricing (per 1 M tokens)
const PRICE_IN_PER_M  = 0.15;
const PRICE_OUT_PER_M = 0.60;
// Conservative estimates per question review call
const EST_IN_TOKENS_PER_Q  = 700;
const EST_OUT_TOKENS_PER_Q = 400;

// ─── Types ────────────────────────────────────────────────────────────────────

interface SolutionStep {
  stepNumber:  number;
  title:       string;
  explanation: string;
  formula?:    string;
  result?:     string;
}

interface ReviewableQuestion {
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
  question:    string;
  answer:      string;
  steps:       SolutionStep[];
  hint:        string;
  hint2?:      string;
  hint3?:      string;
  examTip?:    string;
  keyConcepts: string[];
}

interface ReviewDimensions {
  curriculum:       "PASS" | "FAIL";
  question_quality: "PASS" | "FAIL";
  correctness:      "PASS" | "FAIL";
  steps_quality:    "PASS" | "FAIL";
  hint_quality:     "PASS" | "FAIL";
  exam_readiness:   "PASS" | "FAIL";
}

interface FieldCorrection {
  field:        string;
  issue:        string;
  required_fix: string;
}

type OverallStatus = "PASS" | "FAIL" | "REVIEW_BLOCKED_CONTEXT_MISSING";

interface ReviewRecord {
  questionId:          string;
  contentHash:         string;
  reviewedAt:          string;
  model:               string;
  promptVersion:       string;
  sourceContextStatus: "PRESENT" | "MISSING";
  overall:             OverallStatus;
  dimensions:          ReviewDimensions | null;
  reasons:             string[];
  fieldCorrections:    FieldCorrection[];
  tokenUsage?:         { inputTokens: number; outputTokens: number; estimatedCostUSD: number };
}

type ChapterCache = Record<string, ReviewRecord>;

// ─── Chapter context map ──────────────────────────────────────────────────────

interface ChapterMapEntry {
  classNum:       number;
  subject:        string;
  chapterId:      string;
  indexSubject:   string;
  curriculumTitle: string;
  confidence:     string;
  notes:          string;
}

interface ChapterContextMap {
  entries: ChapterMapEntry[];
}

let _chapterContextMap: ChapterMapEntry[] | null = null;

function loadChapterContextMap(): ChapterMapEntry[] {
  if (_chapterContextMap) return _chapterContextMap;
  if (!existsSync(CHAPTER_MAP_FILE)) { _chapterContextMap = []; return []; }
  try {
    const raw = JSON.parse(readFileSync(CHAPTER_MAP_FILE, "utf8")) as ChapterContextMap;
    _chapterContextMap = raw.entries ?? [];
    return _chapterContextMap;
  } catch { _chapterContextMap = []; return []; }
}

// ─── Curriculum index ─────────────────────────────────────────────────────────

interface CurriculumEntry {
  class:          number;
  subject:        string;
  chapter_title:  string;
  is_chapter?:    boolean;
  structure?: {
    sections?:  { number?: string; title: string }[];
    key_terms?: string[];
  };
}

let _curriculumEntries: CurriculumEntry[] | null = null;

function getCurriculumEntries(): CurriculumEntry[] {
  if (_curriculumEntries) return _curriculumEntries;
  if (!existsSync(CURRICULUM_IDX)) { _curriculumEntries = []; return []; }
  try {
    const raw = JSON.parse(readFileSync(CURRICULUM_IDX, "utf8")) as { entries?: CurriculumEntry[] };
    _curriculumEntries = (raw.entries ?? []) as CurriculumEntry[];
    return _curriculumEntries;
  } catch { _curriculumEntries = []; return []; }
}

/**
 * Normalise a title for comparison: lowercase, strip punctuation, collapse spaces.
 * Used for exact-normalised matching of Mathematics chapters (whose QB names
 * already match the index titles after normalisation).
 */
function normTitle(s: string): string {
  return s.toLowerCase()
    // Strip all apostrophe/quote variants before general punctuation removal.
    // U+0027 = ASCII apostrophe, U+2018/2019 = curly single quotes (used in the
    // NCERT curriculum index), U+02bc = modifier letter apostrophe, U+0060 = backtick.
    // Without this, U+2019 would become a space → "I'm" → "I m" (no match with "Im").
    .replace(/['\u2018\u2019\u02bc`]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")  // other punctuation → space
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Resolve official NCERT curriculum context for a question.
 *
 * Resolution order:
 * 1. Explicit chapter map lookup by (classNum, subject, chapterId).
 *    Uses the exact curriculumTitle from the map to find the index entry.
 *    This handles all Science chapters (Physics/Chemistry/Biology) where
 *    the old QB chapter names diverge from the new 2024-25 textbook names.
 *
 * 2. Normalised exact-title match for Mathematics.
 *    QB Mathematics chapter names already match the index titles after
 *    normalisation. Uses exact match (not prefix) to avoid false positives.
 *
 * Returns MISSING if no reliable match is found.
 * Questions with MISSING context are BLOCKED from review (no PASS recorded).
 */
function resolveSourceContext(q: ReviewableQuestion): {
  status:        "PRESENT" | "MISSING";
  text:          string;
  mappedTitle?:  string;
  missReason?:   string;
} {
  const entries    = getCurriculumEntries();
  const chapterMap = loadChapterContextMap();

  // ── Step 1: Explicit chapter map ──────────────────────────────────────────
  const mapEntry = chapterMap.find(
    e => e.classNum === q.classNum && e.subject === q.subject && e.chapterId === q.chapterId,
  );

  if (mapEntry) {
    // Use normalised comparison to handle apostrophe encoding differences
    // (e.g. Unicode U+2019 in index vs ASCII U+0027 in JSON map file).
    // The match is still anchored by (classNum, indexSubject, exact-normalised-title)
    // from the map — no false-positive risk.
    const normMapped = normTitle(mapEntry.curriculumTitle);
    const idxEntry = entries.find(
      e => e.class === q.classNum
        && e.subject === mapEntry.indexSubject
        && normTitle(e.chapter_title) === normMapped
        && e.is_chapter !== false,
    );
    if (idxEntry) {
      return { status: "PRESENT", text: formatEntry(idxEntry), mappedTitle: mapEntry.curriculumTitle };
    }
    // Map entry exists but the curriculum index doesn't have that title
    return {
      status:      "MISSING",
      text:        "",
      mappedTitle: mapEntry.curriculumTitle,
      missReason:  `chapter-context-map.json maps this to '${mapEntry.curriculumTitle}' but that title was not found in master-curriculum-index.json`,
    };
  }

  // ── Step 2: Exact normalised-title match (Mathematics only) ───────────────
  //    Only safe when subject matches directly (Mathematics → Mathematics).
  //    Science subjects (Physics/Chemistry/Biology) must use the explicit map —
  //    they cannot fall back here because the index uses "Science" for all three.
  if (q.subject === "Mathematics") {
    const qNorm = normTitle(q.chapterName);
    const idxEntry = entries.find(
      e => e.class === q.classNum
        && e.subject === "Mathematics"
        && normTitle(e.chapter_title) === qNorm
        && e.is_chapter !== false,
    );
    if (idxEntry) {
      return { status: "PRESENT", text: formatEntry(idxEntry), mappedTitle: idxEntry.chapter_title };
    }
    return {
      status:     "MISSING",
      text:       "",
      missReason: `normalised title '${qNorm}' not found in index under subject='Mathematics' class=${q.classNum}`,
    };
  }

  // ── Step 3: No match — chapter is not in the explicit map ─────────────────
  return {
    status:     "MISSING",
    text:       "",
    missReason: `chapterId '${q.chapterId}' for subject '${q.subject}' class ${q.classNum} has no entry in chapter-context-map.json`,
  };
}

function formatEntry(e: CurriculumEntry): string {
  const sections = (e.structure?.sections ?? [])
    .map(s => `  ${s.number ? s.number + ". " : ""}${s.title}`)
    .join("\n");
  const keyTerms = (e.structure?.key_terms ?? []).slice(0, 20).join(", ");
  let text = `Official NCERT chapter: "${e.chapter_title}"`;
  if (sections) text += `\nChapter sections:\n${sections}`;
  if (keyTerms) text += `\nKey terms: ${keyTerms}`;
  return text;
}

// ─── Context audit ────────────────────────────────────────────────────────────

interface ChapterAuditRecord {
  classNum:      number;
  subject:       string;
  chapterId:     string;
  chapterName:   string;
  total:         number;
  present:       number;
  missing:       number;
  mappedTitle?:  string;
  missReason?:   string;
}

interface ContextAuditReport {
  auditedAt:       string;
  chapterMapFile:  string;
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

    // Per-chapter record
    if (!byChapterMap.has(key)) {
      byChapterMap.set(key, {
        classNum:     q.classNum,
        subject:      q.subject,
        chapterId:    q.chapterId,
        chapterName:  q.chapterName,
        total:        0,
        present:      0,
        missing:      0,
        mappedTitle:  ctx.mappedTitle,
        missReason:   ctx.missReason,
      });
    }
    const rec = byChapterMap.get(key)!;
    rec.total++;

    if (ctx.status === "PRESENT") {
      rec.present++;
      totalPresent++;
    } else {
      rec.missing++;
      totalMissing++;
    }

    // By class
    byClass[clK] = byClass[clK] ?? { present: 0, missing: 0 };
    if (ctx.status === "PRESENT") byClass[clK].present++;
    else                          byClass[clK].missing++;

    // By subject
    bySubject[subK] = bySubject[subK] ?? { present: 0, missing: 0 };
    if (ctx.status === "PRESENT") bySubject[subK].present++;
    else                          bySubject[subK].missing++;
  }

  const total         = questions.length;
  const pct           = total === 0 ? "0.0" : ((totalPresent / total) * 100).toFixed(1);
  const byChapter     = [...byChapterMap.values()].sort(
    (a, b) => `${a.classNum}${a.subject}${a.chapterId}`.localeCompare(`${b.classNum}${b.subject}${b.chapterId}`),
  );
  const unmatchedChapters = byChapter
    .filter(r => r.missing > 0)
    .map(r => ({
      classNum:    r.classNum,
      subject:     r.subject,
      chapterId:   r.chapterId,
      chapterName: r.chapterName,
      questions:   r.total,
      reason:      r.missReason ?? "no entry in chapter-context-map.json",
    }));

  return {
    auditedAt:       new Date().toISOString(),
    chapterMapFile:  "academic-review/chapter-context-map.json",
    curriculumIndex: "curriculum/generated/master-curriculum-index.json",
    totalQuestions:  total,
    present:         totalPresent,
    missing:         totalMissing,
    coveragePercent: pct + "%",
    byClass,
    bySubject,
    byChapter,
    unmatchedChapters,
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

  console.log(`\n${hr}`);
  console.log("By Class");
  console.log(hr);
  for (const [cls, v] of Object.entries(report.byClass).sort()) {
    const t   = v.present + v.missing;
    const pct = ((v.present / t) * 100).toFixed(1);
    console.log(`  Class ${cls}   present: ${v.present}  missing: ${v.missing}  coverage: ${pct}%`);
  }

  console.log(`\n${hr}`);
  console.log("By Subject");
  console.log(hr);
  for (const [subj, v] of Object.entries(report.bySubject).sort()) {
    const t   = v.present + v.missing;
    const pct = ((v.present / t) * 100).toFixed(1);
    console.log(`  ${subj.padEnd(14)} present: ${v.present}  missing: ${v.missing}  coverage: ${pct}%`);
  }

  console.log(`\n${hr}`);
  console.log("By Chapter");
  console.log(hr);
  for (const r of report.byChapter) {
    const status = r.missing === 0 ? "✓ PRESENT" : "✗ MISSING";
    console.log(`  ${status}  Cl.${r.classNum} ${r.subject.padEnd(12)} ${r.chapterId.padEnd(10)} ${r.chapterName}`);
    if (r.mappedTitle && r.missing === 0) {
      console.log(`            → '${r.mappedTitle}'`);
    }
    if (r.missing > 0 && r.missReason) {
      console.log(`            Reason: ${r.missReason}`);
    }
  }

  if (report.unmatchedChapters.length > 0) {
    console.log(`\n${hr}`);
    console.log("Unmatched Chapters — Context MISSING");
    console.log("These chapters cannot be reviewed until context is established.");
    console.log(hr);
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

function computeContentHash(q: ReviewableQuestion): string {
  const stepsJson = JSON.stringify(q.steps.map(s => ({
    stepNumber:  s.stepNumber,
    title:       normField(s.title),
    explanation: normField(s.explanation),
    formula:     normField(s.formula),
    result:      normField(s.result),
  })));
  const parts = [
    String(q.classNum),
    q.subject,
    q.board,
    q.chapterId,
    q.topicId,
    q.difficulty,
    normField(q.question),
    normField(q.answer),
    stepsJson,
    normField(q.hint),
    normField(q.hint2),
    normField(q.hint3),
    normField(q.examTip),
  ];
  return createHash("sha256").update(parts.join("\x00")).digest("hex");
}

// ─── Cache I/O ────────────────────────────────────────────────────────────────

function cacheFilePath(chapterId: string): string {
  return join(RESULTS_DIR, `${chapterId}.json`);
}

function loadCache(chapterId: string): ChapterCache {
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
    question:    String(q["question"]    ?? ""),
    answer:      String(q["answer"]      ?? ""),
    steps:       Array.isArray(q["steps"])       ? q["steps"]       as SolutionStep[] : [],
    hint:        String(q["hint"]        ?? ""),
    keyConcepts: Array.isArray(q["keyConcepts"]) ? q["keyConcepts"] as string[]       : [],
  };
}

function normalizeV2(q: AnyObj): ReviewableQuestion {
  return {
    id:          String(q["id"]          ?? ""),
    schema:      "v2",
    classNum:    Number(q["classNum"]    ?? 0),
    subject:     String(q["subject"]     ?? ""),
    board:       String(q["board"]       ?? "Both"),
    chapterId:   String(q["chapterId"]   ?? ""),
    chapterName: String(q["chapterName"] ?? ""),
    topicId:     String(q["topicId"]     ?? ""),
    topicName:   String(q["topicName"]   ?? ""),
    difficulty:  String(q["difficulty"]  ?? ""),
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
  "types.ts", "index.ts", "v2adapter.ts", "class9-bundle.ts",
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

async function loadAllQuestions(): Promise<ReviewableQuestion[]> {
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

// ─── Filter + should-review logic ────────────────────────────────────────────

function applyFilters(questions: ReviewableQuestion[], args: Args): ReviewableQuestion[] {
  return questions.filter(q => {
    if (args.classNum && q.classNum !== args.classNum)                                  return false;
    if (args.subject  && !q.subject.toLowerCase().includes(args.subject.toLowerCase())) return false;
    if (args.chapter  && q.chapterId.toLowerCase() !== args.chapter.toLowerCase())      return false;
    if (args.question && q.id !== args.question)                                        return false;
    return true;
  });
}

/**
 * Decide whether a question needs a new review API call.
 * A question is skipped ONLY when its content hash matches a previous PASS result.
 * REVIEW_BLOCKED_CONTEXT_MISSING records are NEVER treated as a skip — they must
 * be re-attempted every run so that context fixes are picked up automatically.
 */
function shouldReview(
  q:     ReviewableQuestion,
  cache: ChapterCache,
  args:  Args,
): { skip: boolean; reason: string } {
  const existing = cache[q.id];

  // --failed-only: skip questions with no prior result, and those that previously passed
  if (args.failedOnly) {
    if (!existing)                                                        return { skip: true, reason: "no prior result (remove --failed-only to review)" };
    if (existing.overall === "PASS")                                      return { skip: true, reason: "previous PASS" };
    if (existing.overall === "REVIEW_BLOCKED_CONTEXT_MISSING")            return { skip: false, reason: "context was missing — re-attempting after context fix" };
  }

  if (!existing)                                                          return { skip: false, reason: "no prior result" };
  if (args.force)                                                         return { skip: false, reason: "--force flag" };

  // REVIEW_BLOCKED_CONTEXT_MISSING: always re-attempt — context may now be fixed
  if (existing.overall === "REVIEW_BLOCKED_CONTEXT_MISSING")              return { skip: false, reason: "context was missing — re-attempting" };

  const hash = computeContentHash(q);
  if (existing.contentHash !== hash)                                      return { skip: false, reason: "content changed since last review" };
  if (existing.overall === "FAIL")                                        return { skip: false, reason: "previous FAIL — re-reviewing" };

  // Hash matches + previous PASS → safe to skip
  return { skip: true, reason: `hash match · PASS on ${existing.reviewedAt.slice(0, 10)}` };
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

const REVIEWER_SYSTEM = `You are a Senior Academic Reviewer for NCERT/CBSE curriculum (Classes 6–12).
You are the FINAL quality gate before question-bank content is published to students.

FIELDS YOU ARE REVIEWING (these are the actual stored fields — no others exist):
  question  — the question text presented to the student
  answer    — the single complete answer string stored in the question bank
  steps     — the worked solution as an array of numbered steps
  hint      — the first hint given to the student (directional, not revealing)
  hint2     — second hint (if present, V2 questions only)
  hint3     — third hint (if present, V2 questions only)
  examTip   — examiner insight (if present, V2 questions only)

Return ONLY valid JSON matching this exact schema — no markdown, no extra keys:
{
  "overall":          "PASS|FAIL",
  "curriculum":       "PASS|FAIL",
  "question_quality": "PASS|FAIL",
  "correctness":      "PASS|FAIL",
  "steps_quality":    "PASS|FAIL",
  "hint_quality":     "PASS|FAIL",
  "exam_readiness":   "PASS|FAIL",
  "reasons":          ["<one concise reason per failure>"],
  "field_corrections": [
    { "field": "answer|steps|hint|hint2|hint3|examTip", "issue": "<what is wrong>", "required_fix": "<exact correction needed>" }
  ]
}

EVALUATION CRITERIA:

1. CURRICULUM
   Is the question in the correct class, subject, chapter, and topic?
   Is it aligned with the current NCERT/CBSE syllabus (2024-25 onwards)?
   SOURCE CONTEXT IS ALWAYS PRESENT when this prompt runs — use it to anchor your review.
   Any contradiction with the source context is an automatic FAIL.

2. QUESTION QUALITY
   Is the question clearly and unambiguously phrased?
   Does it test the stated concept at a difficulty level appropriate for the class?
   Would a student reading it know exactly what is being asked?

3. CORRECTNESS (most critical)
   Is the answer factually, mathematically, and logically correct?
   Are all formulas, calculations, units, and significant figures correct?
   Do all steps in the solution lead logically to the correct answer?

4. STEPS QUALITY
   Does the step sequence produce the correct answer through valid reasoning?
   Is every step clearly explained and logically necessary?
   Are there any skipped reasoning gaps or wrong intermediate values?

5. HINT QUALITY
   Does the hint guide the student toward the method without revealing the answer?
   Is it appropriately directional — neither too vague nor solution-giving?

6. EXAM READINESS
   Would the answer field, as written, receive FULL MARKS in a CBSE board examination?
   Does it use the correct CBSE terminology, structure, and level of detail?

AUTOMATIC FAIL — mark overall FAIL and correctness FAIL:
  • Wrong final answer value
  • Wrong formula or calculation error producing a wrong result
  • Factual or scientific error
  • Content from a deleted/rationalised chapter or wrong chapter
  • Hallucinated fact, formula, or definition

RULES:
  • overall = PASS only if ALL six criteria pass.
  • overall = FAIL if ANY criterion fails.
  • reasons must list every failure concisely (empty array on full PASS).
  • Do not add corrections for fields that passed.`;

function buildReviewerPrompt(q: ReviewableQuestion, ctx: { text: string }): string {
  const stepsText = q.steps.length === 0
    ? "(no steps provided)"
    : q.steps.map(s => {
        const lines = [`Step ${s.stepNumber}: ${s.title}`, `  ${s.explanation}`];
        if (s.formula) lines.push(`  Formula: ${s.formula}`);
        if (s.result)  lines.push(`  Result:  ${s.result}`);
        return lines.join("\n");
      }).join("\n\n");

  const hintLines: string[] = [`Hint 1: ${q.hint}`];
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
  parts.push("", "Review all fields above and return only the JSON result.");
  return parts.join("\n");
}

interface OpenAIUsage {
  prompt_tokens:     number;
  completion_tokens: number;
}

function normalizeReviewResult(raw: unknown): {
  overall:          "PASS" | "FAIL";
  dimensions:       ReviewDimensions;
  reasons:          string[];
  fieldCorrections: FieldCorrection[];
} {
  const r  = (raw ?? {}) as Record<string, unknown>;
  const pf = (v: unknown): "PASS" | "FAIL" => v === "PASS" ? "PASS" : "FAIL";
  return {
    overall: pf(r["overall"]),
    dimensions: {
      curriculum:       pf(r["curriculum"]),
      question_quality: pf(r["question_quality"]),
      correctness:      pf(r["correctness"]),
      steps_quality:    pf(r["steps_quality"]),
      hint_quality:     pf(r["hint_quality"]),
      exam_readiness:   pf(r["exam_readiness"]),
    },
    reasons:          Array.isArray(r["reasons"])           ? r["reasons"]           as string[]          : [],
    fieldCorrections: Array.isArray(r["field_corrections"]) ? r["field_corrections"] as FieldCorrection[] : [],
  };
}

async function callOpenAI(
  apiKey:    string,
  userText:  string,
  maxTokens: number,
): Promise<{ parsed: unknown; usage: OpenAIUsage }> {
  const body = JSON.stringify({
    model:           MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: REVIEWER_SYSTEM },
      { role: "user",   content: userText        },
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
    const raw   = json.choices?.[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response body");
    const usage = json.usage ?? { prompt_tokens: EST_IN_TOKENS_PER_Q, completion_tokens: EST_OUT_TOKENS_PER_Q };
    return { parsed: JSON.parse(raw), usage };
  }
  throw new Error("OpenAI rate limit exhausted after 3 retry attempts");
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
  console.log(`${pad("Model:")} ${MODEL}`);
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
  reviewed:       number;
  passed:         number;
  failed:         number;
  blocked:        number;   // REVIEW_BLOCKED_CONTEXT_MISSING
  skipped:        number;
  errors:         number;
  totalInputTok:  number;
  totalOutputTok: number;
}

function printSummary(
  summary:     RunSummary,
  corrections: { q: ReviewableQuestion; record: ReviewRecord }[],
): void {
  const HR = "═".repeat(66);
  const hr = "─".repeat(66);
  const inCost  = (summary.totalInputTok  / 1_000_000) * PRICE_IN_PER_M;
  const outCost = (summary.totalOutputTok / 1_000_000) * PRICE_OUT_PER_M;

  console.log(`\n${HR}`);
  console.log("ACADEMIC REVIEW — SUMMARY");
  console.log(hr);
  console.log(`  Reviewed   : ${summary.reviewed}`);
  console.log(`    PASS     : ${summary.passed}`);
  console.log(`    FAIL     : ${summary.failed}`);
  console.log(`    BLOCKED  : ${summary.blocked}  (context MISSING — no API call made)`);
  console.log(`  Skipped    : ${summary.skipped}  (unchanged hash + previous PASS)`);
  if (summary.errors) console.log(`  Errors     : ${summary.errors}  (API/load failures — re-run to retry)`);
  if (summary.reviewed > 0) {
    console.log(hr);
    console.log(`  Actual tokens used:`);
    console.log(`    Input    : ${summary.totalInputTok.toLocaleString()}`);
    console.log(`    Output   : ${summary.totalOutputTok.toLocaleString()}`);
    console.log(`    Cost est : $${(inCost + outCost).toFixed(4)}`);
  }

  if (summary.blocked > 0) {
    console.log(hr);
    console.log("  NOTE: BLOCKED questions have no official source context in the curriculum");
    console.log("  index. Run --context-audit to see which chapters are unmatched and why.");
    console.log("  Update academic-review/chapter-context-map.json to establish context.");
  }

  if (corrections.length > 0) {
    console.log(`\n${hr}`);
    console.log("FAILED QUESTIONS — Proposed Corrections");
    console.log("(Do NOT auto-apply — review and apply manually)");
    console.log(hr);

    for (const { q, record } of corrections) {
      const failed = record.dimensions
        ? Object.entries(record.dimensions).filter(([, v]) => v === "FAIL").map(([k]) => k).join(", ")
        : "—";

      console.log(`\nQ: ${q.id}`);
      console.log(`   ${q.subject} Cl.${q.classNum} · ${q.chapterName} · ${q.topicName}`);
      console.log(`   Context mapped to: ${record.tokenUsage !== undefined
        ? (record.sourceContextStatus === "PRESENT" ? "PRESENT" : "MISSING") : "—"}`);
      console.log(`   Failed:  ${failed}`);

      if (record.reasons.length) {
        console.log("   Reasons:");
        for (const r of record.reasons) console.log(`     • ${r}`);
      }
      if (record.fieldCorrections.length) {
        console.log("   Required corrections:");
        for (const c of record.fieldCorrections) {
          console.log(`     [${c.field}]`);
          console.log(`       Issue: ${c.issue}`);
          console.log(`       Fix:   ${c.required_fix}`);
        }
      }
    }
  }

  console.log(`\n${HR}`);
  if (summary.failed > 0) {
    console.log(`Full records: academic-review/results/<chapterId>.json`);
    console.log(`Exit code: 1  (${summary.failed} question(s) require correction)`);
    console.log(HR);
  } else if (summary.blocked > 0 && summary.reviewed === 0) {
    console.log("No questions were reviewed: all had MISSING context.");
    console.log("Exit code: 1  (context must be established before review can proceed)");
    console.log(HR);
  } else if (summary.reviewed > 0) {
    console.log("All reviewed questions PASSED academic review.");
    console.log(HR);
  }
}

// ─── Batch processor ─────────────────────────────────────────────────────────

async function runReviews(
  toReview: ReviewableQuestion[],
  cacheMap: Map<string, ChapterCache>,
  args:     Args,
  apiKey:   string,
): Promise<{ summary: RunSummary; corrections: { q: ReviewableQuestion; record: ReviewRecord }[] }> {
  const summary: RunSummary = {
    reviewed: 0, passed: 0, failed: 0, blocked: 0,
    skipped: 0, errors: 0, totalInputTok: 0, totalOutputTok: 0,
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
    if (ctx.mappedTitle) process.stdout.write(` → '${ctx.mappedTitle}'`);
    process.stdout.write("\n");

    // ── SAFETY RULE: block review when official context is missing ────────
    if (ctx.status === "MISSING") {
      const blockedRecord: ReviewRecord = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        reviewedAt:          new Date().toISOString(),
        model:               MODEL,
        promptVersion:       PROMPT_VERSION,
        sourceContextStatus: "MISSING",
        overall:             "REVIEW_BLOCKED_CONTEXT_MISSING",
        dimensions:          null,
        reasons:             [ctx.missReason ?? "no entry in chapter-context-map.json"],
        fieldCorrections:    [],
      };

      const cache = cacheMap.get(q.chapterId) ?? {};
      cache[q.id] = blockedRecord;
      cacheMap.set(q.chapterId, cache);
      saveCache(q.chapterId, cache);

      process.stdout.write(`  Result:  REVIEW_BLOCKED_CONTEXT_MISSING\n`);
      process.stdout.write(`  Reason:  ${blockedRecord.reasons[0]}\n`);
      summary.blocked++;
      summary.reviewed++;
      continue;
    }

    // ── Call OpenAI ────────────────────────────────────────────────────────
    let record: ReviewRecord;
    try {
      const prompt = buildReviewerPrompt(q, ctx);
      const { parsed, usage } = await callOpenAI(apiKey, prompt, 600);
      const { overall, dimensions, reasons, fieldCorrections } = normalizeReviewResult(parsed);

      const inTok  = usage.prompt_tokens;
      const outTok = usage.completion_tokens;
      const cost   = (inTok / 1_000_000) * PRICE_IN_PER_M + (outTok / 1_000_000) * PRICE_OUT_PER_M;

      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        reviewedAt:          new Date().toISOString(),
        model:               MODEL,
        promptVersion:       PROMPT_VERSION,
        sourceContextStatus: "PRESENT",
        overall,
        dimensions,
        reasons,
        fieldCorrections,
        tokenUsage:          { inputTokens: inTok, outputTokens: outTok, estimatedCostUSD: cost },
      };

      summary.totalInputTok  += inTok;
      summary.totalOutputTok += outTok;

      process.stdout.write(`  Result:  ${overall}`);
      if (overall === "FAIL") {
        const failedDims = Object.entries(dimensions)
          .filter(([, v]) => v === "FAIL")
          .map(([k]) => k);
        process.stdout.write(` [${failedDims.join(", ")}]`);
        corrections.push({ q, record });
        summary.failed++;
      } else {
        summary.passed++;
      }
      process.stdout.write(`  (tokens: ${inTok}+${outTok}  cost: $${cost.toFixed(5)})\n`);
      summary.reviewed++;

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`  [ERROR] ${msg}\n`);
      summary.errors++;
      // Save an error placeholder so the question stays queued for next run
      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        reviewedAt:          new Date().toISOString(),
        model:               MODEL,
        promptVersion:       PROMPT_VERSION,
        sourceContextStatus: "PRESENT",
        overall:             "FAIL",
        dimensions: {
          curriculum: "FAIL", question_quality: "FAIL", correctness: "FAIL",
          steps_quality: "FAIL", hint_quality: "FAIL", exam_readiness: "FAIL",
        },
        reasons:          [`Review call failed: ${msg}`],
        fieldCorrections: [],
      };
      summary.reviewed++;
      summary.failed++;
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
  console.log("ACADEMIC REVIEW — SnapSolve Question Bank");
  console.log(`Model: ${MODEL}  |  Prompt version: ${PROMPT_VERSION}`);
  console.log(HR);

  // ── Load chapter map and curriculum index at startup ──────────────────────
  const mapEntries  = loadChapterContextMap();
  const idxEntries  = getCurriculumEntries();
  console.log(`Loaded chapter-context-map.json  : ${mapEntries.length} explicit mappings`);
  console.log(`Loaded master-curriculum-index   : ${idxEntries.length} index entries`);

  if (!args.contextAudit && !args.dryRun && !args.costEstimate && !apiKey) {
    console.error("\nERROR: OPENAI_API_KEY is not set.");
    console.error("  Use --dry-run to preview the review queue without calling the API.");
    console.error("  Use --cost-estimate to see the estimated cost before running.");
    console.error("  Use --context-audit to check curriculum context coverage (no API needed).\n");
    process.exit(1);
  }

  // ── Load all questions ────────────────────────────────────────────────────
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

  // ── Context audit mode ────────────────────────────────────────────────────
  if (args.contextAudit) {
    const filtered = applyFilters(allQuestions, args);
    console.log(`\nRunning context audit on ${filtered.length} question(s)…`);
    const report = runContextAudit(filtered);
    writeFileSync(CONTEXT_AUDIT_OUT, JSON.stringify(report, null, 2), "utf8");
    printContextAudit(report);
    process.exit(report.missing > 0 ? 0 : 0); // audit is informational, always exit 0
    return;
  }

  // ── Apply filters ─────────────────────────────────────────────────────────
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

  // ── Load caches + determine review queue ──────────────────────────────────
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
  console.log(`  Skipped: ${skipped}  (unchanged hash + previous PASS)`);
  console.log(hr);

  if (args.costEstimate) {
    // Only count questions that will actually call OpenAI (i.e., have context)
    const reviewable = toReview.slice(0, queueSize).filter(q => {
      const ctx = resolveSourceContext(q);
      return ctx.status === "PRESENT";
    });
    printCostEstimate(reviewable.length, args.delayMs);
    process.exit(0);
  }

  if (args.dryRun) {
    console.log("\n[DRY RUN] No API calls made and no results written.");
    console.log("Remove --dry-run to execute the review.\n");
    process.exit(0);
  }

  if (queueSize === 0) {
    console.log("\nNothing to review — all questions in scope have a current PASS result.");
    console.log("Options:");
    console.log("  --force          re-review all (ignores hash match)");
    console.log("  --failed-only    review only previous FAILs");
    console.log("  --context-audit  check curriculum context coverage\n");
    process.exit(0);
  }

  console.log(`Starting review of ${queueSize} question(s)…`);
  console.log("Results are saved after each question (Ctrl+C safe).");
  console.log("Questions with MISSING context are BLOCKED — no API call, no PASS recorded.\n");

  const { summary, corrections } = await runReviews(toReview, cacheMap, args, apiKey!);
  summary.skipped = skipped;

  printSummary(summary, corrections);

  if (summary.failed > 0 || (summary.blocked > 0 && summary.passed === 0 && summary.failed === 0)) {
    process.exit(1);
  }
}

main().catch(err => {
  console.error("\nFatal error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
