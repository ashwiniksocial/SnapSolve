#!/usr/bin/env node
/**
 * AI LATENCY AUDIT
 *
 * Run:  pnpm --filter @workspace/scripts run latency-audit
 *
 * Sends 10 real questions to POST /api/solveQuestion and measures:
 *   - Round-trip latency (ms)
 *   - HTTP status
 *   - Source (openai | bank | fallback)
 *   - Lesson field presence
 *
 * Token counts are not returned in the response body — they would
 * require a backend log inspection (pino log level: trace).
 *
 * Requires: API server running on port 8080 (via localhost:80 proxy).
 */

import { execSync } from "child_process";

const BASE = "http://localhost:80";

type LessonMode = "standard" | "detailed";

interface Question {
  question: string;
  classNum: number;
  subject:  string;
  mode:     LessonMode;
}

const QUESTIONS: Question[] = [
  { question: "What is a rational number? Give two examples.", classNum: 9, subject: "Mathematics", mode: "standard" },
  { question: "Find the remainder when x³ + 3x² + 3x + 1 is divided by x + 1.", classNum: 9, subject: "Mathematics", mode: "standard" },
  { question: "Find the distance between the points (0,0) and (3,4).", classNum: 9, subject: "Mathematics", mode: "standard" },
  { question: "Solve for x: 2x + 3 = 11.", classNum: 9, subject: "Mathematics", mode: "standard" },
  { question: "State and explain Euclid's fifth postulate.", classNum: 9, subject: "Mathematics", mode: "standard" },
  { question: "If two lines are parallel, prove alternate interior angles are equal.", classNum: 9, subject: "Mathematics", mode: "detailed" },
  { question: "Prove that the sum of angles of a triangle is 180°.", classNum: 9, subject: "Mathematics", mode: "detailed" },
  { question: "Find the area of a triangle with base 6 cm and height 4 cm using Heron's formula.", classNum: 9, subject: "Mathematics", mode: "detailed" },
  { question: "Find HCF of 36 and 48 using prime factorisation.", classNum: 6, subject: "Mathematics", mode: "standard" },
  { question: "Simplify: (2x + 3)(x - 1) using the distributive property.", classNum: 8, subject: "Mathematics", mode: "detailed" },
];

async function callBackend(q: Question): Promise<{
  latencyMs: number;
  status: number;
  ok: boolean;
  source: string;
  hasLesson: boolean;
  topicField: string;
  error?: string;
}> {
  const t0 = Date.now();
  try {
    const res = await fetch(`${BASE}/api/solveQuestion`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        question:      q.question,
        subject:       q.subject,
        classNum:      q.classNum,
        lessonMode:    q.mode,
        requireLesson: false,
        skipBank:      false,
      }),
    });
    const ms   = Date.now() - t0;
    const data = await res.json() as Record<string, unknown>;
    return {
      latencyMs: ms,
      status:    res.status,
      ok:        res.ok,
      source:    String(data.source ?? (data.topic ? "openai" : "unknown")),
      hasLesson: typeof data.topic === "string",
      topicField: String(data.topic ?? "—").slice(0, 40),
      error:     res.ok ? undefined : String((data as any).error ?? res.status),
    };
  } catch (err) {
    return {
      latencyMs: Date.now() - t0,
      status:    0,
      ok:        false,
      source:    "—",
      hasLesson: false,
      topicField: "—",
      error:     String(err),
    };
  }
}

const HR  = "=".repeat(90);
const HR2 = "-".repeat(90);
const now = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

console.log(`\n${HR}`);
console.log("  AI LATENCY AUDIT");
console.log(`  Generated: ${now}`);
console.log(`  Endpoint: POST ${BASE}/api/solveQuestion`);
console.log(`  Note: Token counts not returned in response body — measure from server logs.`);
console.log(HR);

const results: Array<ReturnType<typeof callBackend> extends Promise<infer T> ? T & { n: number; q: Question } : never> = [];

for (const [i, q] of QUESTIONS.entries()) {
  process.stdout.write(`  Q${String(i + 1).padStart(2, "0")} [Class ${q.classNum} / ${q.mode.padEnd(8)}] sending… `);
  const r = await callBackend(q);
  (results as any[]).push({ n: i + 1, q, ...r });
  if (r.ok) {
    process.stdout.write(`${(r.latencyMs / 1000).toFixed(1)}s  src=${r.source.padEnd(7)}  topic="${r.topicField}"\n`);
  } else {
    process.stdout.write(`FAIL ${r.error}\n`);
  }
  await new Promise((res) => setTimeout(res, 300));
}

// ── Summary ─────────────────────────────────────────────────────────────────
const ok       = results.filter((r) => r.ok);
const failed   = results.filter((r) => !r.ok);
const standard = ok.filter((r) => r.q.mode === "standard");
const detailed  = ok.filter((r) => r.q.mode === "detailed");
const avg      = (arr: typeof ok) =>
  arr.length ? (arr.reduce((s, r) => s + r.latencyMs, 0) / arr.length / 1000).toFixed(1) + "s" : "n/a";
const min      = (arr: typeof ok) =>
  arr.length ? (Math.min(...arr.map((r) => r.latencyMs)) / 1000).toFixed(1) + "s" : "n/a";
const max      = (arr: typeof ok) =>
  arr.length ? (Math.max(...arr.map((r) => r.latencyMs)) / 1000).toFixed(1) + "s" : "n/a";

console.log(`\n${HR2}`);
console.log("  SUMMARY");
console.log(HR2);
console.log(`  Total:    ${results.length}  Success: ${ok.length}  Failures: ${failed.length}`);
console.log(`\n  Standard mode (${standard.length} calls)`);
console.log(`    Avg: ${avg(standard)}  Min: ${min(standard)}  Max: ${max(standard)}`);
console.log(`\n  Detailed mode (${detailed.length} calls)`);
console.log(`    Avg: ${avg(detailed)}  Min: ${min(detailed)}  Max: ${max(detailed)}`);

if (failed.length) {
  console.log(`\n  FAILURES:`);
  for (const r of failed) {
    console.log(`    Q${r.n}: ${r.error}`);
  }
}

console.log(`\n  Token counts: not in response body.`);
console.log(`  To measure: inspect pino logs at trace level on the API server.`);
console.log(`${HR}\n`);
