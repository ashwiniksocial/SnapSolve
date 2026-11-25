import assert from "node:assert/strict";
import test from "node:test";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";
import {
  isCompleteDetailedLessonResponse,
  parseLessonResponse,
} from "../../artifacts/api-server/src/lib/lessonTypes.ts";
import {
  PILOT_QUESTION_COUNT,
  PILOT_QUESTION_IDS,
} from "./preGeneratedLessonPilot.ts";

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)));
const chunksDirectory = resolve(
  repoRoot,
  "artifacts/homework-hero/src/data/generatedLessonChunks",
);

function decodeChunkSource(source: string, file: string): {
  lessons: Record<string, { lesson: unknown }>;
} {
  const singleString = source.match(/^export default "([A-Za-z0-9+/=]+)";?\s*$/);
  const joinedStrings = source.match(/^export default \[\s*([\s\S]*?)\s*\]\.join\(""\);\s*$/);
  let encoded = singleString?.[1];
  if (!encoded && joinedStrings) {
    const body = joinedStrings[1];
    const segments = [...body.matchAll(/"([A-Za-z0-9+/=]+)"/g)];
    const remainder = body.replace(/"([A-Za-z0-9+/=]+)"/g, "").replace(/[\s,]/g, "");
    if (segments.length > 0 && remainder.length === 0) {
      encoded = segments.map((segment) => segment[1]).join("");
    }
  }
  assert.ok(encoded, `${file} has a recognized compressed chunk format`);
  return JSON.parse(gunzipSync(Buffer.from(encoded, "base64")).toString("utf8"));
}

test("all 26 frozen lessons pass API completeness without vocabulary or rememberThese", async () => {
  assert.equal(PILOT_QUESTION_IDS.length, PILOT_QUESTION_COUNT);
  const storedLessons = new Map<string, unknown>();
  const chunkFiles = (await readdir(chunksDirectory))
    .filter((file) => file.endsWith(".ts"))
    .sort();

  for (const file of chunkFiles) {
    const chunk = decodeChunkSource(
      await readFile(resolve(chunksDirectory, file), "utf8"),
      file,
    );
    for (const id of PILOT_QUESTION_IDS) {
      if (chunk.lessons[id]) storedLessons.set(id, chunk.lessons[id].lesson);
    }
  }

  assert.equal(storedLessons.size, PILOT_QUESTION_COUNT);
  for (const id of PILOT_QUESTION_IDS) {
    const stored = storedLessons.get(id);
    assert.ok(stored, `${id} remains in the frozen lesson assets`);
    const lesson = parseLessonResponse(stored);
    assert.equal(lesson.vocabulary.length, 0, `${id} retains the frozen empty vocabulary`);
    assert.deepEqual(lesson.rememberThese, [], `${id} retains the frozen empty memory takeaways`);
    assert.equal(
      isCompleteDetailedLessonResponse(lesson),
      true,
      `${id} passes the restored API structural completeness contract`,
    );
  }
});
