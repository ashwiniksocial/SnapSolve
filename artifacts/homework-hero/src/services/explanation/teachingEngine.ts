import type { AIResponse } from "@/data/solutionBank";
import type { ReadingLevel } from "./readingModeEngine";
import { getSectionVis, SECTION_ORDER, buildSectionNumbers } from "./difficultyEngine";
import type { SectionVisibility } from "./difficultyEngine";

export interface TeachingSection {
  key:           string;
  sectionNumber: number;
  vis:           SectionVisibility;
  defaultOpen:   boolean;
}

export function buildSections(level: ReadingLevel): Record<string, TeachingSection> {
  const nums = buildSectionNumbers(level);
  const result: Record<string, TeachingSection> = {};
  for (const key of SECTION_ORDER) {
    const vis = getSectionVis(key, level);
    result[key] = { key, sectionNumber: nums[key], vis, defaultOpen: vis === "open" };
  }
  return result;
}

/**
 * Checks whether a solution has enough content to render a given section.
 * Used by the legacy (bank/fallback) renderer only.
 * TeachingLesson responses use the lesson field and bypass this check.
 */
export function hasSectionContent(key: string, r: AIResponse): boolean {
  // If the solution has a lesson, all content is inside lesson — skip legacy checks
  if (r.lesson) return false;

  switch (key) {
    case "prereq":     return (r.prerequisites?.length ?? 0) > 0 || Boolean(r.conceptExplanation) || Boolean(r.questionUnderstanding);
    case "understand": return Boolean(r.questionUnderstanding);
    case "wordMath":   return Boolean(r.wordToMath?.trim());
    case "visual":     return Boolean(r.visualThinking?.trim());
    case "thinking":   return Boolean(r.thinkingProcess?.trim());
    case "steps":      return (r.steps?.length ?? 0) > 0;
    case "mistakes":   return (r.commonMistakes?.length ?? 0) > 0;
    case "verify":     return Boolean(r.verification?.trim());
    case "remember":   return (r.memoryShortcut?.length ?? 0) > 0 || Boolean(r.examTip) || Boolean(r.rememberThis);
    case "similar":    return Boolean(r.similarExample?.problem);
    case "practice":   return Boolean(r.checkUnderstanding?.question);
    case "conceptual": return (r.conceptualQuestions?.length ?? 0) > 0;
    case "summary":    return (r.learningSummary?.length ?? 0) > 0;
    case "mcq":        return Boolean(r.confidenceCheck?.question);
    case "deeper":     return Boolean(r.deeperExplanation?.trim());
    default:           return false;
  }
}
