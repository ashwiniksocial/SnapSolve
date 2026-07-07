#!/usr/bin/env node
/**
 * QUESTION BANK AUDIT
 *
 * Run:  pnpm --filter @workspace/scripts run bank-audit
 *
 * Counts are read DIRECTLY from source TypeScript files — no hardcoded
 * numbers, no UI counts, no adapter counts.
 *
 * Method: count occurrences of /\bid:\s*["']/g in each chapter file.
 * This matches the "id:" field on every question object regardless of
 * whether the file uses V1 (Class 9) or V2 (Class 6-8) format.
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { resolve, join } from "path";

const ROOT = resolve(import.meta.dirname, "../../");
const HH   = join(ROOT, "artifacts/homework-hero/src");
const QB   = join(ROOT, "question-bank/questions/mathematics");
const HR   = "=".repeat(64);
const HR2  = "-".repeat(64);
const now  = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

function countIds(path: string): number {
  if (!existsSync(path)) return 0;
  return (readFileSync(path, "utf8").match(/\bid:\s*["']/g) ?? []).length;
}

function classStats(classNum: number): Array<{ chNum: string; name: string; count: number }> {
  const rows: Array<{ chNum: string; name: string; count: number }> = [];

  if (classNum <= 8) {
    const dir = join(QB, `class${classNum}`);
    if (!existsSync(dir)) return rows;
    const files = readdirSync(dir)
      .filter((f) => f.endsWith(".ts") && f.startsWith("ch"))
      .sort();
    for (const f of files) {
      const chNum = f.match(/^ch(\d+)/)?.[1] ?? "?";
      const name  = f.replace(/^ch\d+-/, "").replace(/\.ts$/, "").replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      rows.push({ chNum, name, count: countIds(join(dir, f)) });
    }
    return rows;
  }

  if (classNum === 9) {
    const dir = join(HH, "data/questions");
    if (!existsSync(dir)) return rows;
    const files = readdirSync(dir)
      .filter((f) => /^class9-maths-ch\d+\.ts$/.test(f))
      .sort((a, b) => {
        const na = parseInt(a.match(/ch(\d+)/)?.[1] ?? "0");
        const nb = parseInt(b.match(/ch(\d+)/)?.[1] ?? "0");
        return na - nb;
      });
    for (const f of files) {
      const path = join(dir, f);
      const content = readFileSync(path, "utf8");
      const chNum = f.match(/ch(\d+)/)?.[1] ?? "?";
      const name  = content.match(/chapterName:\s*["']([^"']+)["']/)?.[1] ?? `ch${chNum}`;
      rows.push({ chNum, name, count: countIds(path) });
    }
    return rows;
  }

  return rows;
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
console.log(`\n${HR}`);
console.log("  QUESTION BANK AUDIT — Mathematics");
console.log(`  Generated: ${now}`);
console.log(`  Source: direct file read (no hardcoded counts, no UI, no adapters)`);
console.log(HR);

const COL_CH  = 5;
const COL_NAME = 42;
const COL_Q   = 8;

let grandTotal = 0;
let grandChapters = 0;

for (const classNum of [6, 7, 8, 9]) {
  const rows = classStats(classNum);
  const classTotal = rows.reduce((s, r) => s + r.count, 0);
  grandTotal    += classTotal;
  grandChapters += rows.length;

  console.log(`\n${HR2}`);
  console.log(`  CLASS ${classNum} MATHEMATICS`);
  console.log(HR2);
  console.log(
    `  ${"Ch".padEnd(COL_CH)}  ${"Chapter Name".padEnd(COL_NAME)}  ${"Questions".padStart(COL_Q)}`
  );
  console.log(`  ${"-".repeat(COL_CH)}  ${"-".repeat(COL_NAME)}  ${"-".repeat(COL_Q)}`);

  for (const { chNum, name, count } of rows) {
    const flag = count === 0 ? "  ← EMPTY" : count < 20 ? "  ← SPARSE" : "";
    console.log(
      `  ${("Ch" + chNum).padEnd(COL_CH)}  ${name.padEnd(COL_NAME)}  ${String(count).padStart(COL_Q)}${flag}`
    );
  }

  console.log(`  ${" ".repeat(COL_CH)}  ${"TOTAL".padEnd(COL_NAME)}  ${String(classTotal).padStart(COL_Q)}`);
}

console.log(`\n${HR}`);
console.log(
  `  GRAND TOTAL — ${grandChapters} chapters  ·  ${grandTotal} questions`
);
console.log(HR + "\n");
