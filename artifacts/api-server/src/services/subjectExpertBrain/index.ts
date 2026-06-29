/**
 * Subject Expert Brain — Index
 *
 * Single entry point for the Subject Expert Brain layer.
 * Returns the subject-specific teaching prompt for any supported subject.
 * Returns an empty string for unknown subjects so lesson generation never breaks.
 *
 * To add a new subject:
 *   1. Create artifacts/api-server/src/services/subjectExpertBrain/<subject>.ts
 *   2. Export a SUBJECT_EXPERT_BRAIN constant
 *   3. Add an entry to the map below
 *   4. Add the subject to SUBJECTS in routes/solveQuestion.ts
 *
 * No AI calls. No I/O. Pure string lookup.
 */

import { MATHEMATICS_EXPERT_BRAIN }      from "./mathematics";
import { PHYSICS_EXPERT_BRAIN }          from "./physics";
import { CHEMISTRY_EXPERT_BRAIN }        from "./chemistry";
import { BIOLOGY_EXPERT_BRAIN }          from "./biology";
import { ENGLISH_EXPERT_BRAIN }          from "./english";
import { HISTORY_EXPERT_BRAIN }          from "./history";
import { GEOGRAPHY_EXPERT_BRAIN }        from "./geography";
import { ECONOMICS_EXPERT_BRAIN }        from "./economics";
import { POLITICAL_SCIENCE_EXPERT_BRAIN } from "./politicalScience";
import { COMPUTER_SCIENCE_EXPERT_BRAIN } from "./computerScience";

const EXPERT_BRAINS: Record<string, string> = {
  Mathematics:       MATHEMATICS_EXPERT_BRAIN,
  Physics:           PHYSICS_EXPERT_BRAIN,
  Chemistry:         CHEMISTRY_EXPERT_BRAIN,
  Biology:           BIOLOGY_EXPERT_BRAIN,
  English:           ENGLISH_EXPERT_BRAIN,
  History:           HISTORY_EXPERT_BRAIN,
  Geography:         GEOGRAPHY_EXPERT_BRAIN,
  Economics:         ECONOMICS_EXPERT_BRAIN,
  "Political Science": POLITICAL_SCIENCE_EXPERT_BRAIN,
  "Computer Science":  COMPUTER_SCIENCE_EXPERT_BRAIN,
};

/**
 * Returns the Subject Expert Brain prompt for the given subject.
 * Returns an empty string if the subject is not recognised — lesson generation
 * continues with the universal teaching standards and master teacher rules.
 */
export function getSubjectExpertPrompt(subject: string): string {
  return EXPERT_BRAINS[subject] ?? "";
}
