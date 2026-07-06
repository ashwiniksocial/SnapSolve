/**
 * Master Teacher Engine — Orchestrator
 *
 * Builds a complete TeachingBlueprint for a question and formats it
 * into two strings ready for injection into the lesson generation prompt:
 *
 *   systemSuffix  — universal master teacher rules, appended to the system prompt
 *   userPrefix    — question-specific teaching plan, prepended to the user message
 *
 * If the planning call fails for any reason (timeout, API error, parse error),
 * this function degrades gracefully and returns empty strings — lesson generation
 * continues without the blueprint rather than failing the entire request.
 */

import type { TeachingBlueprint } from "./lessonPlanner";
import { buildBlueprintFromAssets }              from "./deterministicPlanner";
import { SNAPSOLVE_TEACHING_STANDARDS }              from "../teachingStandards";
import { CONCEPT_MASTERY_FRAMEWORK }                 from "../conceptMasteryFramework";
import { EDUCATION_POLICY_STANDARDS }               from "../educationPolicyStandards";
import { getSubjectExpertPrompt }                    from "../subjectExpertBrain";
import { TEACHER_MINDSET_PROMPT }                    from "./teacherMindset";
import { MICRO_TEACHING_RULES }                      from "./microTeachingEngine";
import { SCAFFOLDING_STAGES_PROMPT }                 from "./scaffoldingEngine";
import { CHECKPOINT_RULES_PROMPT }                   from "./studentCheckpointEngine";
import { DIALOGUE_RULES_PROMPT }                     from "./teacherDialogueEngine";
import { STANDARD_CORE_RULES }                       from "./standardSystemSuffix";

export interface BlueprintInjection {
  systemSuffix:  string;   // append to system prompt
  userPrefix:    string;   // prepend to user message
  conceptCount:  number;   // for logging
  planningUsed:  boolean;  // false if planning call failed/skipped
}

// ─── System suffixes ──────────────────────────────────────────────────────────
//
// UNIVERSAL_SYSTEM_SUFFIX — used by Detailed mode (mode === "basic" → full depth).
// STANDARD_SYSTEM_SUFFIX  — used by Standard mode (mode === "basic" in route, but
//   passed as "standard" here). Replaces the three large files with a lean distillation
//   (~4 k chars vs ~72 k chars) while keeping the five small engine files intact.

const UNIVERSAL_SYSTEM_SUFFIX = `

${SNAPSOLVE_TEACHING_STANDARDS}

${CONCEPT_MASTERY_FRAMEWORK}

${EDUCATION_POLICY_STANDARDS}

${TEACHER_MINDSET_PROMPT}

${MICRO_TEACHING_RULES}

${SCAFFOLDING_STAGES_PROMPT}

${CHECKPOINT_RULES_PROMPT}

${DIALOGUE_RULES_PROMPT}

══════════════════════════════════════════════════════════
LESSON QUALITY CHECKLIST — Run before writing each paragraph
══════════════════════════════════════════════════════════
□ Does this paragraph introduce only ONE new idea?
□ Is every term in this paragraph already defined?
□ Is the WHY for this step explicit?
□ Is the tone conversational, not textbook?
□ Would a student scoring 20/100 understand this sentence?

The lesson should end with a clear "I can now..." statement embedded in the
confidenceBuilder — something the student can say with genuine pride.`.trim();

// Lean suffix for Standard mode: STANDARD_CORE_RULES replaces the three large
// files but the five small engines (mindset, micro, scaffold, checkpoint, dialogue)
// are retained — they are compact and directly shape the JSON output fields.
const STANDARD_SYSTEM_SUFFIX = `

${STANDARD_CORE_RULES}

${TEACHER_MINDSET_PROMPT}

${MICRO_TEACHING_RULES}

${SCAFFOLDING_STAGES_PROMPT}

${CHECKPOINT_RULES_PROMPT}

${DIALOGUE_RULES_PROMPT}`.trim();

// ─── Blueprint formatter ──────────────────────────────────────────────────────

function formatBlueprint(blueprint: TeachingBlueprint): string {
  if (blueprint.conceptOrder.length === 0) return "";

  const lines: string[] = [];

  lines.push("══════════════════════════════════════════════════════════════════");
  lines.push("LESSON BLUEPRINT — Read every word before writing. Follow it exactly.");
  lines.push("══════════════════════════════════════════════════════════════════");
  lines.push("");

  if (blueprint.teachingApproach) {
    lines.push("OVERALL TEACHING APPROACH:");
    lines.push(blueprint.teachingApproach);
    lines.push("");
  }

  lines.push("CONCEPT ORDER — Teach in this exact dependency sequence:");
  lines.push("(Never introduce a concept before its dependencies are fully understood)");
  lines.push("");

  blueprint.conceptOrder.forEach((c, i) => {
    const loadIcon = c.cognitiveLoad === "high" ? "⚠️ HIGH LOAD" :
                     c.cognitiveLoad === "medium" ? "◆ MEDIUM" : "◇ low";
    lines.push(`CONCEPT ${i + 1}: ${c.concept.toUpperCase()} [${loadIcon}]`);

    if (c.teachingNote) {
      lines.push(`  How to introduce: ${c.teachingNote}`);
    }

    if (c.analogy) {
      lines.push(`  Analogy to use: ${c.analogy}`);
    }

    if (c.confusions.length > 0) {
      lines.push(`  Confusions to pre-empt (answer these BEFORE the student reaches them):`);
      c.confusions.forEach(confusion => {
        lines.push(`    → "${confusion}"`);
      });
    }

    if (c.checkpoint) {
      lines.push(`  Checkpoint question (after this concept): "${c.checkpoint}"`);
    }

    if (c.cognitiveLoad === "high") {
      lines.push(`  ⚠️  SLOW DOWN HERE. This is the hardest concept. Give it extra space.`);
      lines.push(`      Split it if needed. Add a breathing moment before the next concept.`);
    }

    lines.push("");
  });

  if (blueprint.pacingNotes.length > 0) {
    lines.push("PACING NOTES:");
    blueprint.pacingNotes.forEach(note => lines.push(`  • ${note}`));
    lines.push("");
  }

  if (blueprint.dialogueTips.length > 0) {
    lines.push("DIALOGUE TIPS FOR THIS QUESTION:");
    blueprint.dialogueTips.forEach(tip => lines.push(`  • ${tip}`));
    lines.push("");
  }

  lines.push("══════════════════════════════════════════════════════════════════");
  lines.push("NOW WRITE THE LESSON. Follow the blueprint above. Every concept.");
  lines.push("Every confusion answered. Every checkpoint included.");
  lines.push("══════════════════════════════════════════════════════════════════");

  return lines.join("\n");
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function buildTeachingBlueprint(
  subject:  string,
  question: string,
  apiKey:   string,
  mode?:    string,
): Promise<BlueprintInjection> {
  // Subject Expert Brain — selected automatically by subject, injected first
  const subjectExpert = getSubjectExpertPrompt(subject);
  const expertBlock   = subjectExpert ? "\n\n" + subjectExpert : "";

  // Standard mode uses a lean suffix (~14 k chars) instead of the full universal
  // suffix (~69 k chars) to reduce input-token count and improve response latency.
  const suffixBody  = mode === "standard" ? STANDARD_SYSTEM_SUFFIX : UNIVERSAL_SYSTEM_SUFFIX;
  const systemSuffix = expertBlock + "\n\n" + suffixBody;

  // Build the blueprint deterministically from the academic knowledge registry.
  // Zero LLM calls — replaces the previous callPlannerOpenAI round-trip.
  const blueprint: TeachingBlueprint | null = buildBlueprintFromAssets(subject, question);

  if (!blueprint || blueprint.conceptOrder.length === 0) {
    return {
      systemSuffix,
      userPrefix:   "",
      conceptCount: 0,
      planningUsed: false,
    };
  }

  const userPrefix = formatBlueprint(blueprint) + "\n\n";

  return {
    systemSuffix,
    userPrefix,
    conceptCount: blueprint.conceptOrder.length,
    planningUsed: true,
  };
}
