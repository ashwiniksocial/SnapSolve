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
 *   --subject <name>     Filter by subject (partial, case-insensitive)
 *   --class <n>          Filter by classNum
 *   --chapter <id>       Filter by chapterId (e.g. phy-ch1, ch01)
 *   --question <id>      Review exactly one question by ID
 *   --batch-size <n>     Questions per progress-save batch (default: 5)
 *   --max-questions <n>  Stop after N questions are reviewed this run
 *   --delay-ms <n>       Milliseconds to wait between questions (default: 500)
 *   --dry-run            Show what would be reviewed — no API calls, no writes
 *   --failed-only        Only review questions with a previous FAIL result
 *   --force              Re-review even if hash matches and previous result is PASS
 *   --cost-estimate      Print estimated API cost for pending questions and exit
 *
 * Freeze gate (Step 8):
 *   pnpm --filter @workspace/scripts run freeze
 *   — runs curriculum-check then academic-review on all new/changed questions.
 *   — exit 1 if either check fails; no frozen chapter may bypass both gates.
 */

import { createHash }                                                         from "crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync }    from "fs";
import { resolve, join }                                                       from "path";

// ─── Paths ────────────────────────────────────────────────────────────────────

const ROOT           = resolve(import.meta.dirname, "../../");
const HH_DATA        = join(ROOT, "artifacts/homework-hero/src/data/questions");
const QB_ROOT        = join(ROOT, "question-bank/questions");
const RESULTS_DIR    = join(ROOT, "academic-review/results");
const CURRICULUM_IDX = join(ROOT, "curriculum/generated/master-curriculum-index.json");

// ─── Model config ─────────────────────────────────────────────────────────────

const MODEL          = "gpt-4o-mini";
const PROMPT_VERSION = "1.0";
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

/**
 * Unified internal representation derived from either V1 (Question) or
 * V2 (QuestionV2) source objects. Only fields that genuinely exist in the
 * stored TypeScript files are included here.
 *
 * V1 fields (Question):
 *   id, classNum, subject, chapterId, chapterName, topicId, topicName,
 *   difficulty, question, answer, steps, hint, keyConcepts
 *   (no board — V1 is always CBSE)
 *
 * V2 fields (QuestionV2) — superset of V1:
 *   all V1 fields + board, hint2?, hint3?, examTip?, and richer taxonomy.
 *   NOTE: Compact / Standard / Detailed answer formats do NOT exist in
 *   either schema. There is exactly one answer field per question.
 */
interface ReviewableQuestion {
  id:          string;
  schema:      "v1" | "v2";
  classNum:    number;
  subject:     string;
  board:       string;    // V1 default: "CBSE"
  chapterId:   string;
  chapterName: string;
  topicId:     string;
  topicName:   string;
  difficulty:  string;
  question:    string;
  answer:      string;    // Single answer field — the complete correct answer
  steps:       SolutionStep[];
  hint:        string;
  hint2?:      string;    // V2 only
  hint3?:      string;    // V2 only
  examTip?:    string;    // V2 only
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
  field:        string;  // "answer" | "steps" | "hint" | "examTip"
  issue:        string;
  required_fix: string;
}

interface ReviewRecord {
  questionId:          string;
  contentHash:         string;
  reviewedAt:          string;   // ISO-8601
  model:               string;
  promptVersion:       string;
  sourceContextStatus: "PRESENT" | "MISSING";
  overall:             "PASS" | "FAIL";
  dimensions:          ReviewDimensions;
  reasons:             string[];
  fieldCorrections:    FieldCorrection[];
}

type ChapterCache = Record<string, ReviewRecord>;

// ─── CLI args ─────────────────────────────────────────────────────────────────

interface Args {
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
    subject:      get("--subject"),
    classNum:     get("--class")         ? parseInt(get("--class")!,         10) : undefined,
    chapter:      get("--chapter"),
    question:     get("--question"),
    batchSize:    parseInt(get("--batch-size")    ?? "5",   10),
    maxQuestions: get("--max-questions") ? parseInt(get("--max-questions")!, 10) : undefined,
    delayMs:      parseInt(get("--delay-ms")      ?? "500", 10),
    dryRun:       has("--dry-run"),
    failedOnly:   has("--failed-only"),
    force:        has("--force"),
    costEstimate: has("--cost-estimate"),
  };
}

// ─── Content hash ─────────────────────────────────────────────────────────────

function norm(s: string | undefined): string {
  return (s ?? "").trim().replace(/\s+/g, " ");
}

/**
 * Stable SHA-256 hash of all academically relevant fields.
 * When ANY of these change, the question requires a fresh review.
 */
function computeContentHash(q: ReviewableQuestion): string {
  const stepsJson = JSON.stringify(q.steps.map(s => ({
    stepNumber:  s.stepNumber,
    title:       norm(s.title),
    explanation: norm(s.explanation),
    formula:     norm(s.formula),
    result:      norm(s.result),
  })));
  const parts = [
    String(q.classNum),
    q.subject,
    q.board,
    q.chapterId,
    q.topicId,
    q.difficulty,
    norm(q.question),
    norm(q.answer),
    stepsJson,
    norm(q.hint),
    norm(q.hint2),
    norm(q.hint3),
    norm(q.examTip),
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

// ─── Official source context ──────────────────────────────────────────────────

interface CurriculumEntry {
  class:         number;
  subject:       string;
  chapter_title: string;
  is_chapter?:   boolean;
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
    const raw  = JSON.parse(readFileSync(CURRICULUM_IDX, "utf8")) as { entries?: CurriculumEntry[] };
    _curriculumEntries = (raw.entries ?? []) as CurriculumEntry[];
    return _curriculumEntries;
  } catch { _curriculumEntries = []; return []; }
}

/**
 * Resolve official NCERT chapter context for a question.
 * Used to ground the reviewer — prevents purely model-knowledge-based review.
 * Returns MISSING if no reliable match is found; reviewer is still run but
 * must note the absence explicitly.
 */
function resolveSourceContext(q: ReviewableQuestion): { status: "PRESENT" | "MISSING"; text: string } {
  // Some PDFs are filed under "Science" for physics/chemistry/biology subjects
  const subjectVariants: Record<string, string[]> = {
    Mathematics: ["Mathematics"],
    Physics:     ["Physics", "Science"],
    Chemistry:   ["Chemistry", "Science"],
    Biology:     ["Biology", "Science", "Life Science"],
  };
  const accepted = subjectVariants[q.subject] ?? [q.subject];

  const entries = getCurriculumEntries();
  const chNorm  = q.chapterName.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

  const match = entries.find(e => {
    if (e.class !== q.classNum) return false;
    if (!accepted.some(a => (e.subject ?? "").includes(a))) return false;
    const eName = (e.chapter_title ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
    // Accept if the first 12 characters of one title appear in the other
    const short = Math.min(chNorm.length, eName.length, 12);
    return short > 4 && (eName.startsWith(chNorm.slice(0, short)) || chNorm.startsWith(eName.slice(0, short)));
  });

  if (!match) return { status: "MISSING", text: "" };

  const sections = (match.structure?.sections ?? [])
    .map(s => `  ${s.number ? s.number + ". " : ""}${s.title}`)
    .join("\n");
  const keyTerms = (match.structure?.key_terms ?? []).slice(0, 20).join(", ");

  let text = `Official NCERT chapter: "${match.chapter_title}"`;
  if (sections) text += `\nChapter sections:\n${sections}`;
  if (keyTerms) text += `\nKey terms: ${keyTerms}`;
  return { status: "PRESENT", text };
}

// ─── OpenAI call ─────────────────────────────────────────────────────────────

const sleep = (ms: number): Promise<void> => new Promise(r => setTimeout(r, ms));

/**
 * The reviewer system prompt.
 *
 * Evaluates the actual stored fields in V1/V2 questions:
 *   question, answer (single field), steps[], hint, hint2?, hint3?, examTip?
 *
 * There are NO Compact / Standard / Detailed answer fields in this codebase.
 * The reviewer does NOT invent or evaluate non-existent fields.
 */
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
   Is any content deleted, rationalised out-of-syllabus, or from the wrong chapter?
   If SOURCE CONTEXT is PRESENT: any contradiction with it is an automatic FAIL.
   If SOURCE CONTEXT is MISSING: evaluate using your NCERT/CBSE curriculum knowledge
   and add "Source context unavailable — reviewed from model knowledge" to reasons.

2. QUESTION QUALITY
   Is the question clearly and unambiguously phrased?
   Does it test the stated concept at a difficulty level appropriate for the class?
   Would a student reading it know exactly what is being asked?

3. CORRECTNESS (most critical)
   Is the answer factually, mathematically, and logically correct?
   Are all formulas, calculations, units, and significant figures correct?
   Do all steps in the solution lead logically to the correct answer?
   Are there any scientific errors, wrong definitions, or hallucinations?

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
  • Question is unanswerable due to ambiguity

RULES:
  • overall = PASS only if ALL six criteria pass.
  • overall = FAIL if ANY criterion fails.
  • Add one field_corrections entry per field that needs fixing.
  • reasons must list every failure concisely (empty array on full PASS).
  • Do not add corrections for fields that passed.`;

function buildReviewerPrompt(q: ReviewableQuestion, ctx: { status: string; text: string }): string {
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
    ctx.status === "MISSING"
      ? "SOURCE CONTEXT: MISSING — evaluate using general NCERT/CBSE curriculum knowledge"
      : `SOURCE CONTEXT: PRESENT\n${ctx.text}`,
    "",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    reasons:          Array.isArray(r["reasons"])          ? r["reasons"]          as string[]          : [],
    fieldCorrections: Array.isArray(r["field_corrections"]) ? r["field_corrections"] as FieldCorrection[] : [],
  };
}

async function callOpenAI(
  apiKey:      string,
  systemText:  string,
  userText:    string,
  maxTokens:   number,
): Promise<unknown> {
  const body = JSON.stringify({
    model:           MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemText },
      { role: "user",   content: userText   },
    ],
    max_tokens: maxTokens,
  });

  for (let attempt = 0; attempt < 3; attempt++) {
    const res = await fetch(OPENAI_URL, {
      method:  "POST",
      headers: {
        "Content-Type":  "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
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

    const json = await res.json() as { choices?: { message?: { content?: string } }[] };
    const raw  = json.choices?.[0]?.message?.content;
    if (!raw) throw new Error("OpenAI returned an empty response body");
    return JSON.parse(raw);
  }

  throw new Error("OpenAI rate limit exhausted after 3 retry attempts");
}

// ─── Question loading ─────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyObj = Record<string, any>;

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
    // All V2 chapter files export exactly one array constant
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

// Files in HH_DATA that are NOT question-source files
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

  // ── V1: direct-authored files in homework-hero/src/data/questions ─────────
  if (existsSync(HH_DATA)) {
    const v1Files = readdirSync(HH_DATA)
      .filter(f => f.endsWith(".ts") && !V1_EXCLUDED.has(f) && /^class\d/.test(f))
      .map(f => join(HH_DATA, f));
    for (const fp of v1Files) {
      all.push(...await loadV1File(fp));
    }
  }

  // ── V2: question-bank/questions (chemistry, biology, future subjects) ──────
  for (const fp of collectFilesRecursive(QB_ROOT, ".ts")) {
    all.push(...await loadV2File(fp));
  }

  // Remove any entries with missing required fields
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

function shouldReview(
  q:     ReviewableQuestion,
  cache: ChapterCache,
  args:  Args,
): { skip: boolean; reason: string } {
  const existing = cache[q.id];

  // --failed-only: only questions that previously failed
  if (args.failedOnly) {
    if (!existing)                   return { skip: true, reason: "no prior result (remove --failed-only to review)" };
    if (existing.overall === "PASS") return { skip: true, reason: "previous PASS" };
  }

  if (!existing)   return { skip: false, reason: "no prior result" };
  if (args.force)  return { skip: false, reason: "--force flag" };

  const hash = computeContentHash(q);
  if (existing.contentHash !== hash) return { skip: false, reason: "content changed since last review" };
  if (existing.overall === "FAIL")   return { skip: false, reason: "previous FAIL — re-reviewing" };

  // Hash matches + previous PASS → safe to skip, no API cost
  return { skip: true, reason: `hash match · PASS on ${existing.reviewedAt.slice(0, 10)}` };
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

  const pad = (s: string, w = 22): string => s.padEnd(w);
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

// ─── Summary and correction report ───────────────────────────────────────────

interface RunSummary {
  reviewed: number;
  passed:   number;
  failed:   number;
  skipped:  number;
  errors:   number;
}

function printSummary(
  summary:     RunSummary,
  corrections: { q: ReviewableQuestion; record: ReviewRecord }[],
): void {
  const HR = "═".repeat(62);
  const hr = "─".repeat(62);
  console.log(`\n${HR}`);
  console.log("ACADEMIC REVIEW — SUMMARY");
  console.log(hr);
  console.log(`  Reviewed : ${summary.reviewed}`);
  console.log(`    PASS   : ${summary.passed}`);
  console.log(`    FAIL   : ${summary.failed}`);
  console.log(`  Skipped  : ${summary.skipped}  (unchanged hash + previous PASS)`);
  if (summary.errors) console.log(`  Errors   : ${summary.errors}  (API/load failures — re-run to retry)`);

  if (corrections.length > 0) {
    console.log(`\n${hr}`);
    console.log("FAILED QUESTIONS — Proposed Corrections");
    console.log("(Results saved to academic-review/results/<chapterId>.json)");
    console.log(hr);

    for (const { q, record } of corrections) {
      const failed = Object.entries(record.dimensions)
        .filter(([, v]) => v === "FAIL")
        .map(([k]) => k)
        .join(", ");

      console.log(`\nQ: ${q.id}`);
      console.log(`   ${q.subject} Cl.${q.classNum} · ${q.chapterName} · ${q.topicName}`);
      console.log(`   Context: ${record.sourceContextStatus}`);
      console.log(`   Failed:  ${failed || "overall"}`);

      if (record.reasons.length) {
        console.log("   Reasons:");
        for (const r of record.reasons) console.log(`     • ${r}`);
      }

      if (record.fieldCorrections.length) {
        console.log("   Required corrections (do NOT auto-apply — review and apply manually):");
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
  } else if (summary.reviewed > 0) {
    console.log("All reviewed questions PASSED academic review.");
    console.log(HR);
  }
}

// ─── Batch processor ─────────────────────────────────────────────────────────

async function runReviews(
  toReview:  ReviewableQuestion[],
  cacheMap:  Map<string, ChapterCache>,
  args:      Args,
  apiKey:    string,
): Promise<{ summary: RunSummary; corrections: { q: ReviewableQuestion; record: ReviewRecord }[] }> {
  const summary: RunSummary = { reviewed: 0, passed: 0, failed: 0, skipped: 0, errors: 0 };
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
    process.stdout.write(`  Context: ${ctx.status}\n`);

    let record: ReviewRecord;

    try {
      const rawResult = await callOpenAI(apiKey, REVIEWER_SYSTEM, buildReviewerPrompt(q, ctx), 600);
      const { overall, dimensions, reasons, fieldCorrections } = normalizeReviewResult(rawResult);

      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        reviewedAt:          new Date().toISOString(),
        model:               MODEL,
        promptVersion:       PROMPT_VERSION,
        sourceContextStatus: ctx.status,
        overall,
        dimensions,
        reasons,
        fieldCorrections,
      };

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
      process.stdout.write("\n");
      summary.reviewed++;

    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      process.stderr.write(`  [ERROR] ${msg}\n`);
      summary.errors++;

      // Save an error placeholder so the question stays in the queue for next run
      record = {
        questionId:          q.id,
        contentHash:         computeContentHash(q),
        reviewedAt:          new Date().toISOString(),
        model:               MODEL,
        promptVersion:       PROMPT_VERSION,
        sourceContextStatus: ctx.status,
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

    // ── Save immediately after each question (interrupt safety) ───────────
    const cache = cacheMap.get(q.chapterId) ?? {};
    cache[q.id] = record;
    cacheMap.set(q.chapterId, cache);
    saveCache(q.chapterId, cache);

    // ── Rate-limit courtesy delay ─────────────────────────────────────────
    if (done < total && args.delayMs > 0) {
      await sleep(args.delayMs);
    }
  }

  return { summary, corrections };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const args   = parseArgs();
  const apiKey = process.env.OPENAI_API_KEY;

  const HR = "═".repeat(62);
  const hr = "─".repeat(62);
  console.log(`\n${HR}`);
  console.log("ACADEMIC REVIEW — SnapSolve Question Bank");
  console.log(`Model: ${MODEL}  |  Prompt version: ${PROMPT_VERSION}`);
  console.log(HR);

  if (!args.dryRun && !args.costEstimate && !apiKey) {
    console.error("\nERROR: OPENAI_API_KEY is not set.");
    console.error("  Use --dry-run to preview the review queue without calling the API.");
    console.error("  Use --cost-estimate to see the estimated cost before running.\n");
    process.exit(1);
  }

  // ── Load all question files ────────────────────────────────────────────────
  process.stdout.write("Loading question sources…\n");
  const allQuestions = await loadAllQuestions();

  // Group by (classNum, subject) for a readable summary
  const byGroup = new Map<string, number>();
  for (const q of allQuestions) {
    const k = `Cl.${q.classNum} ${q.subject}`;
    byGroup.set(k, (byGroup.get(k) ?? 0) + 1);
  }
  console.log(`Loaded ${allQuestions.length} questions from ${byGroup.size} subject group(s):`);
  for (const [k, n] of [...byGroup.entries()].sort()) {
    console.log(`  ${n.toString().padStart(4, " ")}  ${k}`);
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
    if (!cacheMap.has(q.chapterId)) {
      cacheMap.set(q.chapterId, loadCache(q.chapterId));
    }
    const cache = cacheMap.get(q.chapterId)!;
    const { skip, reason } = shouldReview(q, cache, args);

    if (skip) {
      skipped++;
    } else {
      toReview.push(q);
      if (args.dryRun || args.question) {
        console.log(`  QUEUE  ${q.id}  —  ${reason}`);
      }
    }

    if (args.dryRun && skip && args.chapter) {
      // Show skip rationale per question in chapter dry-run mode
      console.log(`  SKIP   ${q.id}  —  ${reason}`);
    }
  }

  const queueSize = args.maxQuestions !== undefined
    ? Math.min(toReview.length, args.maxQuestions)
    : toReview.length;

  console.log(hr);
  console.log(`  Queue  : ${queueSize} question(s) will be reviewed`);
  console.log(`  Skipped: ${skipped}  (unchanged hash + previous PASS)`);
  console.log(hr);

  // ── Cost estimate ─────────────────────────────────────────────────────────
  if (args.costEstimate) {
    printCostEstimate(queueSize, args.delayMs);
    process.exit(0);
  }

  // ── Dry-run exit ──────────────────────────────────────────────────────────
  if (args.dryRun) {
    console.log("\n[DRY RUN] No API calls made and no results written.");
    console.log("Remove --dry-run to execute the review.\n");
    process.exit(0);
  }

  // ── Nothing to do ─────────────────────────────────────────────────────────
  if (queueSize === 0) {
    console.log("\nNothing to review — all questions in scope have a current PASS result.");
    console.log("Options:");
    console.log("  --force          re-review all (ignores hash match)");
    console.log("  --failed-only    review only previous FAILs");
    console.log("  --chapter <id>   narrow scope to one chapter\n");
    process.exit(0);
  }

  // ── Run reviews ───────────────────────────────────────────────────────────
  console.log(`Starting review of ${queueSize} question(s)…`);
  console.log("Results are saved after each question (Ctrl+C safe).\n");

  const { summary, corrections } = await runReviews(
    toReview,
    cacheMap,
    args,
    apiKey!,
  );
  summary.skipped = skipped;

  // ── Final report ──────────────────────────────────────────────────────────
  printSummary(summary, corrections);

  if (summary.failed > 0) process.exit(1);
}

main().catch(err => {
  console.error("\nFatal error:", err instanceof Error ? err.message : String(err));
  process.exit(1);
});
