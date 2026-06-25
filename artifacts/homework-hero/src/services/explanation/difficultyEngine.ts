import type { ReadingLevel } from "./readingModeEngine";

export type SectionVisibility = "open" | "closed" | "hidden";

const VISIBILITY: Record<string, Record<ReadingLevel, SectionVisibility>> = {
  prereq:     { basic: "open",   standard: "closed", advanced: "closed" },
  understand: { basic: "open",   standard: "open",   advanced: "hidden" },
  wordMath:   { basic: "open",   standard: "closed", advanced: "hidden" },
  visual:     { basic: "open",   standard: "closed", advanced: "hidden" },
  thinking:   { basic: "open",   standard: "closed", advanced: "hidden" },
  steps:      { basic: "open",   standard: "open",   advanced: "open"   },
  mistakes:   { basic: "closed", standard: "closed", advanced: "closed" },
  verify:     { basic: "closed", standard: "closed", advanced: "hidden" },
  remember:   { basic: "closed", standard: "closed", advanced: "closed" },
  similar:    { basic: "closed", standard: "closed", advanced: "hidden" },
  practice:   { basic: "closed", standard: "closed", advanced: "closed" },
  conceptual: { basic: "closed", standard: "closed", advanced: "closed" },
  summary:    { basic: "closed", standard: "closed", advanced: "closed" },
  mcq:        { basic: "closed", standard: "closed", advanced: "hidden" },
  deeper:     { basic: "hidden", standard: "closed", advanced: "open"   },
};

export const SECTION_ORDER = [
  "prereq", "understand", "wordMath", "visual", "thinking",
  "steps", "mistakes", "verify", "remember", "similar",
  "practice", "conceptual", "summary", "mcq", "deeper",
] as const;

export type SectionKey = (typeof SECTION_ORDER)[number];

export function getSectionVis(key: string, level: ReadingLevel): SectionVisibility {
  return VISIBILITY[key]?.[level] ?? "closed";
}

export function buildSectionNumbers(level: ReadingLevel): Record<string, number> {
  const nums: Record<string, number> = {};
  let n = 0;
  for (const key of SECTION_ORDER) {
    if (getSectionVis(key, level) !== "hidden") n++;
    nums[key] = n;
  }
  return nums;
}
