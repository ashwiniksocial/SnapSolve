#!/usr/bin/env node
/**
 * CURRICULUM QUALITY GATEWAY
 *
 * Run:  pnpm --filter @workspace/scripts run curriculum-check
 *
 * Validates every registered chapter against the canonical academic contract
 * (scripts/src/canonicalCurriculum.ts → master-curriculum-index.json).
 * Exits 1 on any FAIL condition.
 *
 * ── FAIL conditions (exit 1) ─────────────────────────────────────────────────
 * F1  Duplicate chapter IDs within the same class+subject
 * F2  Duplicate chapter names within the same class+subject
 * F3  Zero-question chapters
 * F4  Chapter imported in index.ts / adapter whose source file is missing on disk
 * F5  Source file exists on disk but is not imported in index.ts / adapter
 * F6  CHAPTER_META.name in a V1 file does not match the canonical title
 * F7  Canonical-contract chapter has no corresponding source file
 * F8  V1 CHAPTER_META is missing canonicalId field
 * F9  V1 CHAPTER_META.id is not registered in canonicalCurriculum.ts
 * F10 Independent curriculum registry detected (duplicate of canonical contract)
 * F11 canonicalChapterRegistry.gen.ts is stale (out of sync with canonicalCurriculum.ts)
 *
 * ── WARNING conditions (report only, no exit) ────────────────────────────────
 * W1  Question count below minimum target for the subject
 * W2  Difficulty imbalance — Easy >60 % or Hard >40 % of chapter questions
 * W3  Chapter question count is >3× the smallest chapter in the same class+subject
 * W4  SOURCE_UNRESOLVED or SOURCE_PENDING chapter — mapping deferred
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";
import {
  getClass9Chapters,
  getCanonicalChapter,
  getKnownInternalIds,
  getRawRegistryEntries,
  type CanonicalChapter,
} from "./canonicalCurriculum.js";
import { createHash } from "crypto";

const ROOT    = resolve(import.meta.dirname, "../../");
const HH_DATA = join(ROOT, "artifacts/homework-hero/src/data/questions");
const QB_CHEM = join(ROOT, "question-bank/questions/chemistry");
const QB_BIO  = join(ROOT, "question-bank/questions/biology");

// ─── Output helpers ───────────────────────────────────────────────────────────
const HR   = "═".repeat(62);
const HR2  = "─".repeat(62);
const now  = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

const R = "\x1b[31m"; const Y = "\x1b[33m"; const G = "\x1b[32m";
const B = "\x1b[1m";  const D = "\x1b[2m";  const X = "\x1b[0m";

const SFX = { FAIL: `${R}${B}[FAIL]${X}`, WARN: `${Y}[WARN]${X}`, PASS: `${G}[PASS]${X}` };

// ─── No independent chapter list here ────────────────────────────────────────
// All Class 9 chapter identity is derived from canonicalCurriculum.ts.
// To add, remove, or correct a chapter, edit canonicalCurriculum.ts — not this file.
// ─────────────────────────────────────────────────────────────────────────────

// Minimum question count before W1 fires
const MIN_Q: Record<string, number> = {
  "9-Mathematics": 20, "9-Economics": 15, "9-Physics": 15,
  "9-Chemistry":   15, "9-Biology":   15,
};

// ─── Chapter record produced by inspection ────────────────────────────────────
interface ChapterRecord {
  key: string;       // "classNum-subject"
  classNum: number;
  subject: string;
  id: string;        // chapterId ("ch1", "ch01", "phy-ch1", etc.)
  name: string;      // chapter name
  filePath: string;  // absolute path to source file
  questions: number;
  easy: number;
  medium: number;
  hard: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function read(p: string): string {
  return existsSync(p) ? readFileSync(p, "utf8") : "";
}

/** Count questions in a V1 file (Class 9 format: CHAPTER_META + QUESTIONS array). */
function countV1Questions(src: string): number {
  const after = src.split(/export\s+const\s+QUESTIONS/)[1] ?? "";
  return (after.match(/\bid:\s*["']/g) ?? []).length;
}

/** Count questions in a V2 file (question-bank flat array format). */
function countV2Questions(src: string): number {
  return (src.match(/\bid:\s*["']/g) ?? []).length;
}

function countDiff(src: string, label: "Easy" | "Medium" | "Hard"): number {
  return (src.match(new RegExp(`difficulty:\\s*["']${label}["']`, "g")) ?? []).length;
}

/** Read CHAPTER_META fields from a V1 file.
 *
 *  Strategy: extract the text from the opening { of CHAPTER_META up to (but
 *  not including) the first nested { in the value, which is always the opening
 *  brace of the first topics entry.  This keeps the extracted block to the
 *  chapter-level scalar fields (id, name, classNum, subject, canonicalChapterId,
 *  curriculumStatus) and avoids accidentally capturing topic-level values.
 */
function parseV1Meta(src: string): {
  id: string; name: string; classNum: number; subject: string;
  hasCanonicalChapterId: boolean;   // true if the field is present (string or null)
  canonicalChapterId?: string;      // set only when the value is a string literal
} | null {
  // Capture everything between "CHAPTER_META ... {" and the next nested "{"
  const headMatch = src.match(/CHAPTER_META[^=]*=\s*\{([^{]*)/s);
  const block = headMatch?.[1] ?? "";
  // Use [^"]+ (double-quote boundary only) so names like "Euclid's Geometry"
  // and "Heron's Formula" are captured correctly — [^"'] would stop at the apostrophe.
  const id      = block.match(/\bid:\s*"([^"]+)"/)?.[1];
  const name    = block.match(/\bname:\s*"([^"]+)"/)?.[1];
  const cls     = block.match(/\bclassNum:\s*(\d+)/)?.[1];
  const subject = block.match(/\bsubject:\s*"([^"]+)"/)?.[1];
  // Field may be: canonicalChapterId: "iemh101"  OR  canonicalChapterId: null
  const hasCanonicalChapterId = /\bcanonicalChapterId\s*:/.test(block);
  const canonicalChapterId    = block.match(/\bcanonicalChapterId:\s*"([^"]+)"/)?.[1];
  if (!id || !name || !cls || !subject) return null;
  return { id, name, classNum: parseInt(cls, 10), subject, hasCanonicalChapterId, canonicalChapterId };
}

/** Collect Class 9 V1 chapter files for a given subject prefix (e.g. "maths", "economics", "physics"). */
function collectClass9V1(prefix: string, subject: string): ChapterRecord[] {
  const records: ChapterRecord[] = [];
  if (!existsSync(HH_DATA)) return records;
  // Mathematics also has iemh-prefixed files (e.g. class9-maths-iemh102.ts)
  const pattern = prefix === "maths"
    ? new RegExp(`^class9-${prefix}-(ch\\d+|iemh\\d+)\\.ts$`)
    : new RegExp(`^class9-${prefix}-ch\\d+\\.ts$`);
  const files = readdirSync(HH_DATA)
    .filter(f => pattern.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/ch(\d+)/)?.[1] ?? "0");
      const nb = parseInt(b.match(/ch(\d+)/)?.[1] ?? "0");
      return na - nb;
    });
  for (const f of files) {
    const filePath = join(HH_DATA, f);
    const src = read(filePath);
    const meta = parseV1Meta(src);
    if (!meta) continue;
    records.push({
      key: `9-${subject}`, classNum: 9, subject,
      id: meta.id, name: meta.name, filePath,
      questions: countV1Questions(src),
      easy: countDiff(src, "Easy"), medium: countDiff(src, "Medium"), hard: countDiff(src, "Hard"),
    });
  }
  return records;
}

// ─── Registration checks: what does index.ts import? ─────────────────────────

/** Return all relative import paths from index.ts that match the given pattern. */
function indexImports(pattern: RegExp): string[] {
  const src = read(join(HH_DATA, "index.ts"));
  const imports: string[] = [];
  const re = /from\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (pattern.test(m[1])) imports.push(m[1]);
  }
  return imports;
}

// ─── Check engine ─────────────────────────────────────────────────────────────

interface Finding { level: "FAIL" | "WARN"; code: string; message: string }

function runChecks(chapters: ChapterRecord[]): Finding[] {
  const findings: Finding[] = [];
  const fail = (code: string, message: string) => findings.push({ level: "FAIL", code, message });
  const warn = (code: string, message: string) => findings.push({ level: "WARN", code, message });

  // Group by class+subject key
  const byKey = new Map<string, ChapterRecord[]>();
  for (const ch of chapters) {
    const list = byKey.get(ch.key) ?? [];
    list.push(ch);
    byKey.set(ch.key, list);
  }

  for (const [key, group] of byKey) {
    // F1: Duplicate chapter IDs
    const seenIds = new Set<string>();
    for (const ch of group) {
      if (seenIds.has(ch.id)) {
        fail("F1", `Duplicate chapter ID "${ch.id}" in ${key} (file: ${ch.filePath.split("/").pop()})`);
      }
      seenIds.add(ch.id);
    }

    // F2: Duplicate chapter names
    const seenNames = new Set<string>();
    for (const ch of group) {
      const n = ch.name.toLowerCase().trim();
      if (seenNames.has(n)) {
        fail("F2", `Duplicate chapter name "${ch.name}" in ${key}`);
      }
      seenNames.add(n);
    }

    // F3: Zero-question chapters
    for (const ch of group) {
      if (ch.questions === 0) {
        fail("F3", `Zero questions in "${ch.name}" (${key}) — file: ${ch.filePath.split("/").pop()}`);
      }
    }

    // W1: Below minimum question target
    const minQ = MIN_Q[key] ?? 20;
    for (const ch of group) {
      if (ch.questions > 0 && ch.questions < minQ) {
        warn("W1", `"${ch.name}" (${key}): ${ch.questions} questions (min target: ${minQ})`);
      }
    }

    // W2: Difficulty imbalance
    for (const ch of group) {
      if (ch.questions === 0) continue;
      const easyPct  = (ch.easy   / ch.questions) * 100;
      const hardPct  = (ch.hard   / ch.questions) * 100;
      if (easyPct > 60) {
        warn("W2", `"${ch.name}" (${key}): ${easyPct.toFixed(0)}% Easy (threshold: 60%)`);
      }
      if (hardPct > 40) {
        warn("W2", `"${ch.name}" (${key}): ${hardPct.toFixed(0)}% Hard (threshold: 40%)`);
      }
    }

    // W3: Chapter size disparity
    const withQ = group.filter(ch => ch.questions > 0);
    if (withQ.length > 1) {
      const minCount = Math.min(...withQ.map(ch => ch.questions));
      const maxCount = Math.max(...withQ.map(ch => ch.questions));
      if (maxCount > 3 * minCount) {
        const big = withQ.find(ch => ch.questions === maxCount)!;
        const sml = withQ.find(ch => ch.questions === minCount)!;
        warn("W3", `${key}: largest chapter "${big.name}" (${maxCount}q) is ${(maxCount / minCount).toFixed(1)}× smallest "${sml.name}" (${minCount}q)`);
      }
    }
  }

  return findings;
}

// ─── Registration checks ──────────────────────────────────────────────────────

function checkRegistration(): Finding[] {
  const findings: Finding[] = [];
  const fail = (code: string, message: string) => findings.push({ level: "FAIL", code, message });

  // ── Class 9: direct index.ts import checks ───────────────────────────────────
  const class9Pattern = /class9-/;
  const class9Imports = indexImports(class9Pattern);

  // F4: imported path resolves to non-existent file
  for (const imp of class9Imports) {
    const filename = imp.split("/").pop()!;
    const filePath = join(HH_DATA, filename + ".ts");
    if (!existsSync(filePath)) {
      fail("F4", `index.ts imports "${filename}" but file is missing: ${filePath}`);
    }
  }

  // F5: class9-*.ts files exist but aren't imported in index.ts
  if (existsSync(HH_DATA)) {
    const class9Files = readdirSync(HH_DATA).filter(f => /^class9-.*\.ts$/.test(f) && f !== "index.ts");
    for (const f of class9Files) {
      const stem = f.replace(/\.ts$/, "");
      const isImported = class9Imports.some(imp => imp.includes(stem) || imp.endsWith(`/${stem}`));
      if (!isImported) {
        fail("F5", `${f} exists in HH_DATA but is not imported in index.ts`);
      }
    }
  }

  return findings;
}

// ─── F6: Chapter name mismatch (V1 files vs curriculum definition) ────────────

// ─── F6: V1 CHAPTER_META.name must match the canonical title ─────────────────
// For SOURCE_UNRESOLVED chapters there is no canonical title to match — skip F6.
// For ACTIVE chapters the name must match the exact canonical chapterTitle.

function checkNameMatch(chapters: ChapterRecord[]): Finding[] {
  const findings: Finding[] = [];
  const class9Chapters = chapters.filter(ch => ch.classNum === 9);

  for (const ch of class9Chapters) {
    const canonical = getCanonicalChapter(ch.id);
    if (!canonical) {
      // Unknown internal ID — not registered in the canonical contract
      findings.push({
        level: "FAIL",
        code:  "F9",
        message: `Chapter id "${ch.id}" (subject: ${ch.key}) is not registered in canonicalCurriculum.ts. File: ${ch.filePath.split("/").pop()}`,
      });
      continue;
    }
    if (canonical.status === "SOURCE_UNRESOLVED" || canonical.status === "SOURCE_PENDING") {
      // No confirmed canonical title — skip name-match for this entry
      continue;
    }
    if (ch.name !== canonical.chapterTitle) {
      findings.push({
        level: "FAIL",
        code:  "F6",
        message: `"${ch.name}" (${ch.id}) does not match canonical title "${canonical.chapterTitle}" [${canonical.bookId}]. File: ${ch.filePath.split("/").pop()}`,
      });
    }
  }
  return findings;
}

// ─── F7 / W4: Canonical-contract chapter has no source file ──────────────────
// Iterates the canonical academic contract rather than a hardcoded list.
// SOURCE_UNRESOLVED / SOURCE_PENDING → W4 instead of F7.

function checkMissingExpected(): Finding[] {
  const findings: Finding[] = [];
  const canonical9 = getClass9Chapters();

  for (const ch of canonical9) {
    if (ch.status === "SOURCE_UNRESOLVED") {
      findings.push({
        level: "WARN",
        code:  "W4",
        message: `Source unresolved: "${ch.internalId}" (9-${ch.subjectId}) — no matching 2026-27 canonical chapter; questions retained, mapping blocked`,
      });
      continue;
    }
    if (ch.status === "SOURCE_PENDING") {
      findings.push({
        level: "WARN",
        code:  "W4",
        message: `Source pending: "${ch.internalId}" (9-${ch.subjectId}) — official source not yet released; build deferred`,
      });
      continue;
    }

    let found = false;
    const { subjectId, internalId, chapterTitle } = ch;

    if (subjectId === "Chemistry") {
      const dir = join(QB_CHEM, "class9");
      if (existsSync(dir)) {
        found = readdirSync(dir).filter(f => f.endsWith(".ts")).some(f => {
          const src = read(join(dir, f));
          return src.includes(`chapterName: "${chapterTitle}"`) || src.includes(`chapterName: '${chapterTitle}'`);
        });
      }
    } else if (subjectId === "Biology") {
      const dir = join(QB_BIO, "class9");
      if (existsSync(dir)) {
        found = readdirSync(dir).filter(f => f.endsWith(".ts")).some(f => {
          const src = read(join(dir, f));
          return src.includes(`chapterName: "${chapterTitle}"`) || src.includes(`chapterName: '${chapterTitle}'`);
        });
      }
      // Biology placeholders also checked
      if (!found) {
        const ph = join(HH_DATA, "class9-science-placeholders.ts");
        if (existsSync(ph)) found = read(ph).includes(`id: "${internalId}"`);
      }
    } else if (subjectId === "Earth Science") {
      const ph = join(HH_DATA, "class9-science-placeholders.ts");
      if (existsSync(ph)) found = read(ph).includes(`id: "${internalId}"`);
    } else {
      // Mathematics, Physics, Economics: V1 format
      const prefixMap: Record<string, string> = { Mathematics: "maths", Physics: "physics", Economics: "economics" };
      const prefix = prefixMap[subjectId] ?? subjectId.toLowerCase();
      if (existsSync(HH_DATA)) {
        const pattern = prefix === "maths"
          ? new RegExp(`^class9-${prefix}-(ch\\d+|iemh\\d+)\\.ts$`)
          : new RegExp(`^class9-${prefix}-ch\\d+\\.ts$`);
        found = readdirSync(HH_DATA).filter(f => pattern.test(f)).some(f => {
          const src = read(join(HH_DATA, f));
          const meta = parseV1Meta(src);
          return meta?.id === internalId;
        });
      }
    }

    if (!found) {
      findings.push({
        level: "FAIL",
        code:  "F7",
        message: `Missing: "${chapterTitle}" [${ch.bookId}] (9-${subjectId}, internalId: ${internalId})`,
      });
    }
  }

  // NOTE: Economics is not yet in the canonical contract — no F7 check.
  // Add Economics chapters to canonicalCurriculum.ts when question files are created.

  return findings;
}

// ─── F8: V1 CHAPTER_META missing canonicalChapterId field ────────────────────
// Every active V1 chapter must declare its canonical chapter ID field.
// Value is a bookId string (e.g. "iemh101") or null for SOURCE_UNRESOLVED.
// STATUS STRINGS (e.g. "SOURCE_UNRESOLVED") must never be used as ID values.

function checkCanonicalIds(): Finding[] {
  const findings: Finding[] = [];
  if (!existsSync(HH_DATA)) return findings;
  const knownIds = getKnownInternalIds();
  const v1Files  = readdirSync(HH_DATA).filter(f =>
    /^class9-(maths|physics)-(ch\d+|iemh\d+)\.ts$/.test(f),
  );
  for (const f of v1Files) {
    const src = read(join(HH_DATA, f));
    const meta = parseV1Meta(src);
    if (!meta) continue;
    if (!meta.hasCanonicalChapterId) {
      findings.push({
        level: "FAIL",
        code:  "F8",
        message: `${f}: CHAPTER_META is missing canonicalChapterId field (string bookId or null for SOURCE_UNRESOLVED)`,
      });
    }
    // Detect old pattern: canonicalChapterId set to a status string instead of null
    if (meta.canonicalChapterId &&
        ["SOURCE_UNRESOLVED", "SOURCE_PENDING", "OFFICIALLY_DELETED"].includes(meta.canonicalChapterId)) {
      findings.push({
        level: "FAIL",
        code:  "F8",
        message: `${f}: canonicalChapterId must be null (not the status string "${meta.canonicalChapterId}") for unresolved chapters`,
      });
    }
    if (meta.id && !knownIds.has(meta.id)) {
      findings.push({
        level: "FAIL",
        code:  "F9",
        message: `${f}: CHAPTER_META.id "${meta.id}" is not registered in canonicalCurriculum.ts`,
      });
    }
  }
  return findings;
}

// ─── F11: Generated canonical registry out of sync ────────────────────────────
// canonicalChapterRegistry.gen.ts must be in sync with canonicalCurriculum.ts.
// If these diverge, the frontend uses stale canonical IDs.

function checkGeneratedRegistrySync(): Finding[] {
  const findings: Finding[] = [];
  const CHECKSUM_PATH = join(ROOT, "curriculum/generated/canonical-registry-checksum.json");
  if (!existsSync(CHECKSUM_PATH)) {
    findings.push({
      level: "FAIL",
      code:  "F11",
      message: "curriculum/generated/canonical-registry-checksum.json not found — run: pnpm --filter @workspace/scripts run generate-canonical-registry",
    });
    return findings;
  }

  let stored: { checksum?: string; entryCount?: number } = {};
  try {
    stored = JSON.parse(readFileSync(CHECKSUM_PATH, "utf8")) as typeof stored;
  } catch {
    findings.push({ level: "FAIL", code: "F11", message: "canonical-registry-checksum.json is malformed" });
    return findings;
  }

  // Recompute from current canonical contract
  const entries = getRawRegistryEntries()
    .map(e => ({ internalId: e.internalId, canonicalChapterId: e.canonicalChapterId, status: e.status }))
    .sort((a, b) => a.internalId.localeCompare(b.internalId));
  const currentChecksum = createHash("sha256").update(JSON.stringify(entries)).digest("hex").slice(0, 16);

  if (currentChecksum !== stored.checksum) {
    findings.push({
      level: "FAIL",
      code:  "F11",
      message: `canonicalChapterRegistry.gen.ts is STALE (checksum mismatch: stored=${stored.checksum ?? "?"}, current=${currentChecksum}). Regenerate: pnpm --filter @workspace/scripts run generate-canonical-registry`,
    });
  }
  return findings;
}

// ─── F10: Independent curriculum registry guard ───────────────────────────────
// Prevents re-introduction of hardcoded title lists that duplicate the contract.

function checkNoDuplicateRegistry(): Finding[] {
  const findings: Finding[] = [];
  const gatewaySrc = read(join(ROOT, "scripts/src/curriculumGateway.ts"));
  if (/^const EXPECTED\s*=\s*\{/m.test(gatewaySrc)) {
    findings.push({ level: "FAIL", code: "F10", message: "curriculumGateway.ts has an independent EXPECTED curriculum table — remove it; use canonicalCurriculum.ts" });
  }
  const valSrc = read(join(ROOT, "scripts/src/validateCurriculum.ts"));
  if (/const MATHS_CONTENT_RECORDS\s*=/m.test(valSrc)) {
    findings.push({ level: "FAIL", code: "F10", message: "validateCurriculum.ts still has MATHS_CONTENT_RECORDS — remove and use canonicalCurriculum.ts" });
  }
  if (/const SCIENCE_CONTENT_RECORDS\s*=/m.test(valSrc)) {
    findings.push({ level: "FAIL", code: "F10", message: "validateCurriculum.ts still has SCIENCE_CONTENT_RECORDS — remove and use canonicalCurriculum.ts" });
  }
  return findings;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const chapters: ChapterRecord[] = [
  ...collectClass9V1("maths",     "Mathematics"),
  ...collectClass9V1("economics", "Economics"),
  ...collectClass9V1("physics",   "Physics"),
];

const allFindings: Finding[] = [
  ...runChecks(chapters),
  ...checkRegistration(),
  ...checkNameMatch(chapters),
  ...checkMissingExpected(),
  ...checkCanonicalIds(),
  ...checkNoDuplicateRegistry(),
  ...checkGeneratedRegistrySync(),
];

const failures = allFindings.filter(f => f.level === "FAIL");
const warnings = allFindings.filter(f => f.level === "WARN");

// ─── Render report ────────────────────────────────────────────────────────────

console.log(`\n${HR}`);
console.log(`${B}  CURRICULUM QUALITY REPORT${X}`);
console.log(`  Generated: ${now}`);
console.log(HR);

// Scope summary
const byKey = new Map<string, ChapterRecord[]>();
for (const ch of chapters) {
  const list = byKey.get(ch.key) ?? [];
  list.push(ch);
  byKey.set(ch.key, list);
}
const scope = [...byKey.keys()].sort();
const totalQ = chapters.reduce((s, ch) => s + ch.questions, 0);

console.log(`\n${HR2}`);
console.log("  SCOPE");
console.log(HR2);
console.log(`  Classes audited:  ${[...new Set(scope.map(k => k.split("-")[0]))].join(", ")}`);
console.log(`  Subjects audited: ${[...new Set(scope.map(k => k.split("-").slice(1).join("-")))].join(", ")}`);
console.log(`  Chapters audited: ${chapters.length}`);
console.log(`  Total questions:  ${totalQ}`);
console.log(`\n  ${"Class/Subject".padEnd(22)} ${"Chapters".padStart(8)} ${"Questions".padStart(10)}`);
console.log(`  ${"-".repeat(22)} ${"-".repeat(8)} ${"-".repeat(10)}`);
for (const key of scope) {
  const group = byKey.get(key)!;
  const q = group.reduce((s, ch) => s + ch.questions, 0);
  console.log(`  ${key.padEnd(22)} ${String(group.length).padStart(8)} ${String(q).padStart(10)}`);
}

// Failures
console.log(`\n${HR2}`);
console.log(`  FAILURES  (${failures.length})`);
console.log(HR2);
if (failures.length === 0) {
  console.log(`  ${SFX.PASS} No failures detected.`);
} else {
  for (const f of failures) {
    console.log(`  ${SFX.FAIL} [${f.code}] ${f.message}`);
  }
}

// Warnings
console.log(`\n${HR2}`);
console.log(`  WARNINGS  (${warnings.length})`);
console.log(HR2);
if (warnings.length === 0) {
  console.log(`  ${SFX.PASS} No warnings.`);
} else {
  for (const w of warnings) {
    console.log(`  ${SFX.WARN} [${w.code}] ${w.message}`);
  }
}

// Summary
console.log(`\n${HR2}`);
console.log("  SUMMARY");
console.log(HR2);

// Per-group detail
for (const key of scope) {
  const group = byKey.get(key)!;
  const groupFails = failures.filter(f => f.message.includes(key));
  const groupWarns = warnings.filter(f => f.message.includes(key));
  const status = groupFails.length > 0 ? SFX.FAIL : (groupWarns.length > 0 ? SFX.WARN : SFX.PASS);
  const detail = groupFails.length > 0
    ? `${groupFails.length} failure(s)`
    : groupWarns.length > 0 ? `${groupWarns.length} warning(s)` : "clean";
  console.log(`  ${status} ${key.padEnd(24)} ${String(group.length).padStart(2)} chapters · ${detail}`);
}

console.log();
const overallStatus = failures.length === 0
  ? `${SFX.PASS} ${G}${B}CURRICULUM GATEWAY: PASS${X} — ${warnings.length} warning(s), 0 failures`
  : `${SFX.FAIL} ${R}${B}CURRICULUM GATEWAY: FAIL${X} — ${failures.length} failure(s), ${warnings.length} warning(s)`;
console.log(`  ${overallStatus}`);
console.log(`\n${HR}\n`);

// Exit non-zero if any failures
if (failures.length > 0) process.exit(1);
