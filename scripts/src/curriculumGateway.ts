#!/usr/bin/env node
/**
 * CURRICULUM QUALITY GATEWAY
 *
 * Run:  pnpm --filter @workspace/scripts run curriculum-check
 *
 * Validates every registered chapter against the authoritative NCERT/CBSE
 * curriculum definition. Exits 1 on any FAIL condition.
 *
 * ── FAIL conditions (exit 1) ─────────────────────────────────────────────────
 * F1  Duplicate chapter IDs within the same class+subject
 * F2  Duplicate chapter names within the same class+subject
 * F3  Zero-question chapters
 * F4  Chapter imported in index.ts / adapter whose source file is missing on disk
 * F5  Source file exists on disk but is not imported in index.ts / adapter
 * F6  CHAPTER_META.name in a V1 file does not match the curriculum definition
 * F7  Curriculum-expected chapter has no corresponding source file
 *
 * ── WARNING conditions (report only, no exit) ────────────────────────────────
 * W1  Question count below minimum target for the subject
 * W2  Difficulty imbalance — Easy >60 % or Hard >40 % of chapter questions
 * W3  Chapter question count is >3× the smallest chapter in the same class+subject
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";

const ROOT    = resolve(import.meta.dirname, "../../");
const HH_DATA = join(ROOT, "artifacts/homework-hero/src/data/questions");
const QB_MATH = join(ROOT, "question-bank/questions/mathematics");

// ─── Output helpers ───────────────────────────────────────────────────────────
const HR   = "═".repeat(62);
const HR2  = "─".repeat(62);
const now  = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

const R = "\x1b[31m"; const Y = "\x1b[33m"; const G = "\x1b[32m";
const B = "\x1b[1m";  const D = "\x1b[2m";  const X = "\x1b[0m";

const SFX = { FAIL: `${R}${B}[FAIL]${X}`, WARN: `${Y}[WARN]${X}`, PASS: `${G}[PASS]${X}` };

// ─── Authoritative NCERT/CBSE expected chapters ──────────────────────────────
// Ground truth for FAIL 7 (missing expected chapter) and FAIL 6 (name mismatch).
// Class 8: 14 CBSE-active chapters (Ch4 Practical Geometry + Ch16 Playing with Numbers deleted).
// cbseDeleted: present in NCERT textbook but excluded from CBSE board exam since 2022-23.

interface ExpectedChapter { name: string; slug: string; cbseDeleted?: true }

const EXPECTED: Record<string, ExpectedChapter[]> = {
  "6-Mathematics": [
    { name: "Knowing Our Numbers",              slug: "knowing-our-numbers" },
    { name: "Whole Numbers",                    slug: "whole-numbers" },
    { name: "Playing with Numbers",             slug: "playing-with-numbers" },
    { name: "Basic Geometrical Ideas",          slug: "basic-geometrical-ideas" },
    { name: "Understanding Elementary Shapes",  slug: "understanding-elementary-shapes" },
    { name: "Integers",                         slug: "integers" },
    { name: "Fractions",                        slug: "fractions" },
    { name: "Decimals",                         slug: "decimals" },
    { name: "Data Handling",                    slug: "data-handling" },
    { name: "Mensuration",                      slug: "mensuration" },
    { name: "Algebra",                          slug: "algebra" },
    { name: "Ratio and Proportion",             slug: "ratio-and-proportion" },
    { name: "Symmetry",                         slug: "symmetry" },
    { name: "Practical Geometry",               slug: "practical-geometry" },
  ],
  "7-Mathematics": [
    { name: "Integers",                         slug: "integers" },
    { name: "Fractions and Decimals",           slug: "fractions-and-decimals" },
    { name: "Data Handling",                    slug: "data-handling" },
    { name: "Simple Equations",                 slug: "simple-equations" },
    { name: "Lines and Angles",                 slug: "lines-and-angles" },
    { name: "The Triangle and Its Properties",  slug: "triangle-and-its-properties" },
    { name: "Congruence of Triangles",          slug: "congruence-of-triangles" },
    { name: "Comparing Quantities",             slug: "comparing-quantities" },
    { name: "Rational Numbers",                 slug: "rational-numbers" },
    { name: "Practical Geometry",               slug: "practical-geometry" },
    { name: "Perimeter and Area",               slug: "perimeter-and-area" },
    { name: "Algebraic Expressions",            slug: "algebraic-expressions" },
    { name: "Exponents and Powers",             slug: "exponents-and-powers" },
    { name: "Symmetry",                         slug: "symmetry" },
    { name: "Visualising Solid Shapes",         slug: "visualising-solid-shapes" },
  ],
  "8-Mathematics": [
    { name: "Rational Numbers",                         slug: "rational-numbers" },
    { name: "Linear Equations in One Variable",         slug: "linear-equations" },
    { name: "Understanding Quadrilaterals",             slug: "understanding-quadrilaterals" },
    { name: "Data Handling",                            slug: "data-handling" },
    { name: "Squares and Square Roots",                 slug: "squares-and-square-roots" },
    { name: "Cubes and Cube Roots",                     slug: "cubes-and-cube-roots" },
    { name: "Comparing Quantities",                     slug: "comparing-quantities" },
    { name: "Algebraic Expressions and Identities",     slug: "algebraic-expressions-and-identities" },
    { name: "Mensuration",                              slug: "mensuration" },
    { name: "Visualising Solid Shapes",                 slug: "visualising-solid-shapes" },
    { name: "Exponents and Powers",                     slug: "exponents-and-powers" },
    { name: "Direct and Inverse Proportions",           slug: "direct-and-inverse-proportions" },
    { name: "Factorisation",                            slug: "factorisation" },
    { name: "Introduction to Graphs",                   slug: "introduction-to-graphs" },
  ],
  "9-Mathematics": [
    { name: "Number Systems",                           slug: "number-systems" },
    { name: "Polynomials",                              slug: "polynomials" },
    { name: "Coordinate Geometry",                      slug: "coordinate-geometry" },
    { name: "Linear Equations in Two Variables",        slug: "linear-equations-in-two-variables" },
    { name: "Introduction to Euclid's Geometry",        slug: "euclids-geometry", cbseDeleted: true },
    { name: "Lines and Angles",                         slug: "lines-and-angles" },
    { name: "Triangles",                                slug: "triangles" },
    { name: "Quadrilaterals",                           slug: "quadrilaterals" },
    { name: "Areas of Parallelograms and Triangles",    slug: "areas-of-parallelograms" },
    { name: "Circles",                                  slug: "circles" },
    { name: "Constructions",                            slug: "constructions", cbseDeleted: true },
    { name: "Heron's Formula",                          slug: "herons-formula" },
    { name: "Surface Areas and Volumes",                slug: "surface-areas-and-volumes" },
    { name: "Statistics",                               slug: "statistics" },
    { name: "Probability",                              slug: "probability" },
  ],
  "9-Economics": [
    { name: "The Story of Village Palampur",  slug: "palampur" },
    { name: "People as Resource",             slug: "people-as-resource" },
    { name: "Poverty as a Challenge",         slug: "poverty" },
    { name: "Food Security in India",         slug: "food-security" },
  ],
  "9-Physics": [
    { name: "Motion",                   slug: "motion" },
    { name: "Force and Laws of Motion", slug: "force" },
    { name: "Gravitation",              slug: "gravitation" },
    { name: "Work and Energy",          slug: "work" },
    { name: "Sound",                    slug: "sound" },
  ],
};

// Minimum question count before W1 fires
const MIN_Q: Record<string, number> = {
  "6-Mathematics": 50, "7-Mathematics": 50, "8-Mathematics": 50,
  "9-Mathematics": 20, "9-Economics": 15,   "9-Physics": 15,
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

/** Convert a chapter name to a filename slug for Class 6-8 lookup. */
function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Read CHAPTER_META fields from a V1 file.
 *
 *  Strategy: extract the text from the opening { of CHAPTER_META up to (but
 *  not including) the first nested { in the value, which is always the opening
 *  brace of the first topics entry.  This keeps the extracted block to the
 *  chapter-level scalar fields (id, name, classNum, subject) and avoids
 *  accidentally capturing topic-level id/name values.
 */
function parseV1Meta(src: string): { id: string; name: string; classNum: number; subject: string } | null {
  // Capture everything between "CHAPTER_META ... {" and the next nested "{"
  const headMatch = src.match(/CHAPTER_META[^=]*=\s*\{([^{]*)/s);
  const block = headMatch?.[1] ?? "";
  // Use [^"]+ (double-quote boundary only) so names like "Euclid's Geometry"
  // and "Heron's Formula" are captured correctly — [^"'] would stop at the apostrophe.
  const id      = block.match(/\bid:\s*"([^"]+)"/)?.[1];
  const name    = block.match(/\bname:\s*"([^"]+)"/)?.[1];
  const cls     = block.match(/\bclassNum:\s*(\d+)/)?.[1];
  const subject = block.match(/\bsubject:\s*"([^"]+)"/)?.[1];
  if (!id || !name || !cls || !subject) return null;
  return { id, name, classNum: parseInt(cls, 10), subject };
}

// ─── Collect all chapters: Class 6-8 (V2) ─────────────────────────────────────
function collectClass678(): ChapterRecord[] {
  const records: ChapterRecord[] = [];
  for (const cls of [6, 7, 8]) {
    const dir = join(QB_MATH, `class${cls}`);
    if (!existsSync(dir)) continue;
    const files = readdirSync(dir).filter(f => f.endsWith(".ts") && /^ch\d+/.test(f)).sort();
    for (const f of files) {
      const filePath = join(dir, f);
      const src = read(filePath);
      const chId = f.match(/^(ch\d+)/)?.[1] ?? f;
      const rawName = f.replace(/^ch\d+-/, "").replace(/\.ts$/, "").replace(/-/g, " ");
      const name = rawName.replace(/\b\w/g, c => c.toUpperCase());
      records.push({
        key: `${cls}-Mathematics`, classNum: cls, subject: "Mathematics",
        id: chId, name, filePath,
        questions: countV2Questions(src),
        easy: countDiff(src, "Easy"), medium: countDiff(src, "Medium"), hard: countDiff(src, "Hard"),
      });
    }
  }
  return records;
}

/** Collect Class 9 V1 chapter files for a given subject prefix (e.g. "maths", "economics", "physics"). */
function collectClass9V1(prefix: string, subject: string): ChapterRecord[] {
  const records: ChapterRecord[] = [];
  if (!existsSync(HH_DATA)) return records;
  const pattern = new RegExp(`^class9-${prefix}-ch\\d+\\.ts$`);
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

/** Return all relative import paths inside a class{N}-maths.ts adapter. */
function adapterImports(classNum: number): string[] {
  const src = read(join(HH_DATA, `class${classNum}-maths.ts`));
  const imports: string[] = [];
  const re = /from\s+["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src)) !== null) {
    if (m[1].includes(`class${classNum}/ch`)) imports.push(m[1]);
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

  // ── Class 6, 7, 8: adapter-level checks ─────────────────────────────────────
  for (const cls of [6, 7, 8]) {
    const adapterFile = join(HH_DATA, `class${cls}-maths.ts`);
    const adapterImported = indexImports(/class\d+-maths/).some(p => p.includes(`class${cls}-maths`));

    // F4: adapter exists in index.ts but adapter file missing
    if (adapterImported && !existsSync(adapterFile)) {
      fail("F4", `index.ts imports class${cls}-maths but file is missing: ${adapterFile}`);
    }

    // F5: adapter file exists but not imported in index.ts
    if (existsSync(adapterFile) && !adapterImported) {
      fail("F5", `class${cls}-maths.ts exists but is not imported in index.ts`);
    }

    if (!existsSync(adapterFile)) continue;

    // F4 (adapter level): adapter imports a chapter file that doesn't exist
    const imports = adapterImports(cls);
    for (const imp of imports) {
      // imp looks like "../../../../../question-bank/questions/mathematics/class6/ch01-knowing-our-numbers"
      const filename = imp.split("/").pop()!;
      const srcPath = join(QB_MATH, `class${cls}`, filename + ".ts");
      if (!existsSync(srcPath)) {
        fail("F4", `class${cls}-maths.ts imports "${filename}" but file is missing: ${srcPath}`);
      }
    }

    // F5 (chapter level): a chapter file exists in question-bank but adapter doesn't import it
    const dir = join(QB_MATH, `class${cls}`);
    if (existsSync(dir)) {
      const chFiles = readdirSync(dir).filter(f => f.endsWith(".ts") && /^ch\d+/.test(f));
      for (const f of chFiles) {
        const stem = f.replace(/\.ts$/, "");
        const isImported = imports.some(imp => imp.includes(stem));
        if (!isImported) {
          fail("F5", `question-bank class${cls}/${f} exists but is not imported in class${cls}-maths.ts`);
        }
      }
    }
  }

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

function checkNameMatch(chapters: ChapterRecord[]): Finding[] {
  const findings: Finding[] = [];
  const class9Chapters = chapters.filter(ch => ch.classNum === 9);

  for (const ch of class9Chapters) {
    const expected = EXPECTED[ch.key];
    if (!expected) continue;
    // Check if file's chapter name appears anywhere in the expected list (case-insensitive)
    const match = expected.some(e => e.name.toLowerCase() === ch.name.toLowerCase());
    if (!match) {
      findings.push({
        level: "FAIL",
        code: "F6",
        message: `"${ch.name}" (${ch.key}) is not in the curriculum definition. ` +
                 `File: ${ch.filePath.split("/").pop()}`,
      });
    }
  }
  return findings;
}

// ─── F7: Expected chapter has no source file ──────────────────────────────────

function checkMissingExpected(): Finding[] {
  const findings: Finding[] = [];

  for (const [key, expected] of Object.entries(EXPECTED)) {
    const [clsStr, subject] = key.split("-", 2) as [string, string];
    const cls = parseInt(clsStr, 10);

    for (const exp of expected) {
      let found = false;

      if (cls <= 8 && subject === "Mathematics") {
        const dir = join(QB_MATH, `class${cls}`);
        if (existsSync(dir)) {
          const files = readdirSync(dir);
          // Match by slug — any file whose name contains the slug
          found = files.some(f => f.includes(exp.slug));
        }
      } else if (cls === 9) {
        // For Class 9, scan CHAPTER_META.name in all matching prefix files
        let prefix = "maths";
        if (subject === "Economics") prefix = "economics";
        if (subject === "Physics")   prefix = "physics";

        if (existsSync(HH_DATA)) {
          const pattern = new RegExp(`^class9-${prefix}-ch\\d+\\.ts$`);
          const files = readdirSync(HH_DATA).filter(f => pattern.test(f));
          found = files.some(f => {
            const src = read(join(HH_DATA, f));
            const meta = parseV1Meta(src);
            return meta?.name.toLowerCase() === exp.name.toLowerCase();
          });
        }
      }

      if (!found) {
        const cbseNote = exp.cbseDeleted ? " [deleted from CBSE exam — may still be needed for NCERT completeness]" : "";
        findings.push({
          level: "FAIL",
          code:  "F7",
          message: `Missing: "${exp.name}" (${key})${cbseNote}`,
        });
      }
    }
  }

  return findings;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────

const chapters: ChapterRecord[] = [
  ...collectClass678(),
  ...collectClass9V1("maths",     "Mathematics"),
  ...collectClass9V1("economics", "Economics"),
  ...collectClass9V1("physics",   "Physics"),
];

const allFindings: Finding[] = [
  ...runChecks(chapters),
  ...checkRegistration(),
  ...checkNameMatch(chapters),
  ...checkMissingExpected(),
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
