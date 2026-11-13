import assert from "node:assert/strict";
import test from "node:test";

import {
  isBoardApplicable,
  makeAcademicContext,
  makeChapterContextKey,
  matchesAcademicContentContext,
  normalizeBoardId,
  scopedStorageKey,
} from "./academicContext";

test("board normalization never maps generic or unknown boards", () => {
  assert.equal(normalizeBoardId("CBSE"), "CBSE");
  assert.equal(normalizeBoardId("ICSE"), "ICSE");
  assert.equal(normalizeBoardId("WBBSE"), "WBBSE");
  assert.equal(normalizeBoardId("West Bengal Board"), "WBBSE");
  assert.equal(normalizeBoardId("State Board"), null);
  assert.equal(normalizeBoardId("Other"), null);
  assert.equal(normalizeBoardId("unknown"), null);
});

test("shared content requires an explicit verified-board list", () => {
  assert.equal(isBoardApplicable("Both", undefined, "ICSE"), false);
  assert.equal(isBoardApplicable("Both", ["CBSE"], "ICSE"), false);
  assert.equal(isBoardApplicable("Both", ["ICSE"], "ICSE"), true);
  assert.equal(isBoardApplicable("CBSE", undefined, "ICSE"), false);
});

test("chapter and saved-record keys include board and class identity", () => {
  const chapterKey = makeChapterContextKey({
    boardId: "CBSE", classNum: 9, subject: "Mathematics",
    chapterId: "ch1", canonicalChapterId: "canonical-1", academicSession: "2026-27",
  });
  assert.notEqual(chapterKey, makeChapterContextKey({
    boardId: "ICSE", classNum: 9, subject: "Mathematics",
    chapterId: "ch1", canonicalChapterId: "canonical-1", academicSession: "2026-27",
  }));
  assert.notEqual(chapterKey, makeChapterContextKey({
    boardId: "CBSE", classNum: 8, subject: "Mathematics",
    chapterId: "ch1", canonicalChapterId: "canonical-1", academicSession: "2026-27",
  }));

  const context = makeAcademicContext("CBSE", 9);
  const cbseKey = scopedStorageKey("studyai-progress-v3", context);
  const icseKey = scopedStorageKey("studyai-progress-v3", makeAcademicContext("ICSE", 9));
  const classEightKey = scopedStorageKey("studyai-progress-v3", makeAcademicContext("CBSE", 8));
  assert.ok(cbseKey);
  assert.notEqual(cbseKey, icseKey);
  assert.notEqual(cbseKey, classEightKey);
  assert.notEqual(cbseKey, "studyai-progress-v2");
});

test("content matching isolates board, class, and subject", () => {
  const cbseQuestion = {
    boardApplicability: "CBSE" as const,
    classNum: 9,
    subject: "Mathematics",
  };
  assert.equal(matchesAcademicContentContext(cbseQuestion, {
    ...makeAcademicContext("CBSE", 9)!,
    subject: "Mathematics",
  }), true);
  assert.equal(matchesAcademicContentContext(cbseQuestion, {
    ...makeAcademicContext("ICSE", 9)!,
    subject: "Mathematics",
  }), false);
  assert.equal(matchesAcademicContentContext(cbseQuestion, {
    ...makeAcademicContext("CBSE", 8)!,
    subject: "Mathematics",
  }), false);
  assert.equal(matchesAcademicContentContext(cbseQuestion, {
    ...makeAcademicContext("CBSE", 9)!,
    subject: "Science",
  }), false);

  const shared = { ...cbseQuestion, boardApplicability: "Both" as const, verifiedBoards: ["ICSE" as const] };
  assert.equal(matchesAcademicContentContext(shared, {
    ...makeAcademicContext("ICSE", 9)!,
    subject: "Mathematics",
  }), true);
  assert.equal(matchesAcademicContentContext(shared, {
    ...makeAcademicContext("WBBSE", 9)!,
    subject: "Mathematics",
  }), false);
});
