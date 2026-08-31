/**
 * Architecture C — deterministic structural gate.
 *
 * Diagnostic-only. This gate deliberately inspects the raw JSON before relying
 * on parseLessonResponse, because that parser fills safe defaults for student
 * requests. A parser default is useful for graceful production rendering, but
 * it is not evidence that the generator produced a complete lesson.
 */

import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";

export interface StructuralIssue {
  code:    string;
  path:    string;
  message: string;
}

export interface StructuralGateResult {
  passed:          boolean;
  issues:          StructuralIssue[];
  defaultedPaths:  string[];
  normalizedLesson: LessonResponse;
  latencyMs:       number;
}

const REQUIRED_OBJECTS = [
  "beforeWeStart",
  "intuition",
  "questionTranslation",
  "teacherThinking",
  "examinerThinking",
  "finalAnswer",
  "simplerExample",
  "practiceQuestion",
  "confidenceCheck",
] as const;

const REQUIRED_ARRAYS = [
  "keyConcepts",
  "prerequisites",
  "vocabulary",
  "guidedReasoning",
  "confusionPoints",
  "commonMistakes",
  "retrievalPractice",
  "rememberThese",
] as const;

const REQUIRED_STRINGS = [
  "topic",
  "beforeWeStart.motivator",
  "beforeWeStart.anxietyReducer",
  "beforeWeStart.preview",
  "intuition.story",
  "intuition.everyday",
  "questionTranslation.plainEnglish",
  "questionTranslation.whatWeKnow",
  "questionTranslation.whatWeFind",
  "questionTranslation.wordToMath",
  "teacherThinking.firstNotice",
  "teacherThinking.whyThisMethod",
  "teacherThinking.clues",
  "examinerThinking.whyAsked",
  "examinerThinking.conceptTested",
  "examinerThinking.topperInsight",
  "examinerThinking.examTip",
  "examinerThinking.examTrap",
  "finalAnswer.answer",
  "finalAnswer.whyCorrect",
  "finalAnswer.verification",
  "simplerExample.problem",
  "simplerExample.solution",
  "practiceQuestion.question",
  "practiceQuestion.solution",
  "confidenceCheck.question",
  "confidenceCheck.explanation",
  "confidenceBuilder",
] as const;

const REQUIRED_ARRAY_ITEM_STRINGS = [
  "keyConcepts",
  "prerequisites",
  "confusionPoints",
  "retrievalPractice",
  "rememberThese",
  "practiceQuestion.hints",
  "confidenceCheck.options",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getAt(root: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    return isRecord(value) ? value[key] : undefined;
  }, root);
}

function hasAt(root: unknown, path: string): boolean {
  const segments = path.split(".");
  let current: unknown = root;
  for (const segment of segments) {
    if (!isRecord(current) || !Object.prototype.hasOwnProperty.call(current, segment)) return false;
    current = current[segment];
  }
  return true;
}

function addIssue(issues: StructuralIssue[], code: string, path: string, message: string): void {
  issues.push({ code, path, message });
}

function requireObject(root: unknown, path: string, issues: StructuralIssue[], defaults: string[]): void {
  if (!hasAt(root, path)) {
    defaults.push(path);
    addIssue(issues, "missing_field", path, `Required object "${path}" is missing from raw output.`);
    return;
  }
  if (!isRecord(getAt(root, path))) {
    addIssue(issues, "invalid_type", path, `Expected "${path}" to be an object in raw output.`);
  }
}

function requireArray(root: unknown, path: string, issues: StructuralIssue[], defaults: string[]): void {
  if (!hasAt(root, path)) {
    defaults.push(path);
    addIssue(issues, "missing_field", path, `Required array "${path}" is missing from raw output.`);
    return;
  }
  if (!Array.isArray(getAt(root, path))) {
    addIssue(issues, "invalid_type", path, `Expected "${path}" to be an array in raw output.`);
  }
}

function requireString(
  root: unknown,
  path: string,
  issues: StructuralIssue[],
  defaults: string[],
  allowEmpty = false,
): void {
  if (!hasAt(root, path)) {
    defaults.push(path);
    addIssue(issues, "missing_field", path, `Required string "${path}" is missing from raw output.`);
    return;
  }
  const value = getAt(root, path);
  if (typeof value !== "string") {
    addIssue(issues, "invalid_type", path, `Expected "${path}" to be a string in raw output.`);
  } else if (!allowEmpty && value.trim().length === 0) {
    addIssue(issues, "empty_field", path, `Required string "${path}" is empty in raw output.`);
  }
}

function checkStringArray(
  root: unknown,
  path: string,
  issues: StructuralIssue[],
  defaults: string[],
): void {
  requireArray(root, path, issues, defaults);
  const value = getAt(root, path);
  if (!Array.isArray(value)) return;
  value.forEach((item, index) => {
    if (typeof item !== "string") {
      addIssue(
        issues,
        "invalid_item_type",
        `${path}[${index}]`,
        `Expected "${path}[${index}]" to be a string in raw output.`,
      );
    } else if (item.trim().length === 0) {
      addIssue(
        issues,
        "empty_item",
        `${path}[${index}]`,
        `Expected "${path}[${index}]" to contain text.`,
      );
    }
  });
}

function checkObjectArray(
  root: unknown,
  path: string,
  fields: readonly string[],
  issues: StructuralIssue[],
  defaults: string[],
  allowEmptyFields: readonly string[] = [],
): void {
  requireArray(root, path, issues, defaults);
  const value = getAt(root, path);
  if (!Array.isArray(value)) return;

  value.forEach((item, index) => {
    const itemPath = `${path}[${index}]`;
    if (!isRecord(item)) {
      addIssue(issues, "invalid_item_type", itemPath, `Expected "${itemPath}" to be an object.`);
      return;
    }
    for (const field of fields) {
      requireString(
        item,
        field,
        issues,
        defaults,
        allowEmptyFields.includes(field),
      );
      const lastIssue = issues[issues.length - 1];
      if (lastIssue?.path === field) lastIssue.path = `${itemPath}.${field}`;
      const defaultIndex = defaults.lastIndexOf(field);
      if (defaultIndex >= 0 && defaults[defaultIndex] === field) defaults[defaultIndex] = `${itemPath}.${field}`;
    }
  });
}

function checkCardinality(
  root: unknown,
  path: string,
  expected: string,
  predicate: (length: number) => boolean,
  issues: StructuralIssue[],
): void {
  const value = getAt(root, path);
  if (!Array.isArray(value) || predicate(value.length)) return;
  addIssue(issues, "invalid_cardinality", path, `Expected "${path}" to contain ${expected}; received ${value.length}.`);
}

/**
 * Validate raw Detailed output. No network calls and no side effects.
 */
export function validateRawDetailedLesson(raw: unknown): StructuralGateResult {
  const startedAt = Date.now();
  const issues: StructuralIssue[] = [];
  const defaultedPaths: string[] = [];

  if (!isRecord(raw)) {
    const normalizedLesson = parseLessonResponse({});
    return {
      passed: false,
      issues: [{
        code: "invalid_root",
        path: "$",
        message: "Raw lesson output must be a JSON object.",
      }],
      defaultedPaths: ["$"],
      normalizedLesson,
      latencyMs: Date.now() - startedAt,
    };
  }

  for (const path of REQUIRED_OBJECTS) requireObject(raw, path, issues, defaultedPaths);
  for (const path of REQUIRED_ARRAYS) requireArray(raw, path, issues, defaultedPaths);
  for (const path of REQUIRED_STRINGS) {
    // An empty visual, math, result, or pause is permitted by the lesson contract;
    // those fields are intentionally not in REQUIRED_STRINGS.
    requireString(raw, path, issues, defaultedPaths);
  }
  requireString(raw, "intuition.visual", issues, defaultedPaths, true);

  for (const path of REQUIRED_ARRAY_ITEM_STRINGS) {
    checkStringArray(raw, path, issues, defaultedPaths);
  }

  checkObjectArray(raw, "vocabulary", ["term", "meaning"], issues, defaultedPaths);
  checkObjectArray(
    raw,
    "guidedReasoning",
    ["what", "why", "math", "result", "pause"],
    issues,
    defaultedPaths,
    ["math", "result", "pause"],
  );
  checkObjectArray(
    raw,
    "commonMistakes",
    ["mistake", "whyItHappens", "howToAvoid"],
    issues,
    defaultedPaths,
  );

  const difficulty = getAt(raw, "difficulty");
  if (!hasAt(raw, "difficulty")) {
    defaultedPaths.push("difficulty");
    addIssue(issues, "missing_field", "difficulty", 'Required field "difficulty" is missing from raw output.');
  } else if (!["Easy", "Medium", "Hard"].includes(String(difficulty))) {
    addIssue(issues, "invalid_enum", "difficulty", 'Difficulty must be "Easy", "Medium", or "Hard".');
  }

  const aiConfidence = getAt(raw, "aiConfidence");
  if (!hasAt(raw, "aiConfidence")) {
    defaultedPaths.push("aiConfidence");
    addIssue(issues, "missing_field", "aiConfidence", 'Required field "aiConfidence" is missing from raw output.');
  } else if (
    typeof aiConfidence !== "number" ||
    !Number.isFinite(aiConfidence) ||
    aiConfidence < 0 ||
    aiConfidence > 1
  ) {
    addIssue(issues, "invalid_value", "aiConfidence", "aiConfidence must be a finite number between 0 and 1.");
  }

  const confidenceCheck = getAt(raw, "confidenceCheck");
  if (isRecord(confidenceCheck)) {
    const index = confidenceCheck.correctIndex;
    if (typeof index !== "number" || !Number.isInteger(index)) {
      addIssue(issues, "invalid_value", "confidenceCheck.correctIndex", "correctIndex must be an integer.");
    } else if (Array.isArray(confidenceCheck.options) && (index < 0 || index >= confidenceCheck.options.length)) {
      addIssue(issues, "invalid_value", "confidenceCheck.correctIndex", "correctIndex must point to an existing option.");
    }
  } else if (hasAt(raw, "confidenceCheck")) {
    addIssue(issues, "invalid_type", "confidenceCheck", "confidenceCheck must be an object.");
  }

  checkCardinality(raw, "keyConcepts", "at least one item", length => length > 0, issues);
  checkCardinality(raw, "guidedReasoning", "4–8 steps", length => length >= 4 && length <= 8, issues);
  checkCardinality(raw, "commonMistakes", "exactly 3 items", length => length === 3, issues);
  checkCardinality(raw, "practiceQuestion.hints", "exactly 3 items", length => length === 3, issues);
  checkCardinality(raw, "confidenceCheck.options", "exactly 4 items", length => length === 4, issues);

  const normalizedLesson = parseLessonResponse(raw);
  return {
    passed: issues.length === 0,
    issues,
    defaultedPaths: [...new Set(defaultedPaths)],
    normalizedLesson,
    latencyMs: Date.now() - startedAt,
  };
}