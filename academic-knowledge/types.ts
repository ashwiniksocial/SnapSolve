/**
 * Academic Knowledge Architecture — Type System
 *
 * Developer-only. NEVER imported by any runtime service.
 *
 * Defines the full schema for chapter-level pedagogical metadata.
 * Every chapter across Classes 6–9, both boards, all six subjects
 * must have a record conforming to ChapterKnowledge.
 *
 * ── Relationship to question-bank/ ───────────────────────────────────────────
 * question-bank/   = WHAT to ask   (question types, quotas, blueprints)
 * academic-knowledge/ = WHAT TO KNOW (concepts, dependencies, misconceptions)
 *
 * Both reference the same chapter IDs from question-bank/chapterRegistry.ts.
 * question-bank/ consumes this file for concept-level tagging.
 * Lesson generation (AI pipeline) consumes this file for context injection.
 * Quality evaluation consumes this file to check alignment.
 */

// ─── Shared primitives ────────────────────────────────────────────────────────

export type SupportedClass   = 6 | 7 | 8 | 9;
export type SupportedSubject = "Mathematics" | "Physics" | "Chemistry" | "Biology" | "Computer Science" | "Economics";
export type BoardApplicability = "CBSE" | "ICSE" | "Both";
export type BloomsLevel      = "remember" | "understand" | "apply" | "analyse" | "evaluate" | "create";
export type DifficultyTier   = "foundational" | "easy" | "medium" | "hard" | "olympiad";

// ─── 1. Learning objectives ───────────────────────────────────────────────────

/**
 * A single, measurable learning objective.
 * Written as "Student can [verb] [concept] [condition/context]"
 * using Bloom's verbs appropriate to the level.
 */
export interface LearningObjective {
  statement:   string;       // "Student can [verb] [concept]"
  bloomsLevel: BloomsLevel;
  assessable:  boolean;      // Can this be directly tested by an exam question?
}

// ─── 2. NEP 2020 competency mapping ──────────────────────────────────────────

/**
 * Maps chapter content to the NEP 2020 / NCF 2023 rules defined in
 * artifacts/api-server/src/services/educationPolicyStandards.ts
 */
export interface NepCompetencyMap {
  ruleCode:    string;  // "NEP-PROB" | "NEP-FORM" | "NEP-REFL" | "NEP-COMP" | "NEP-HOT" | "NEP-REPR" | "NEP-IDC" | "NEP-ETH"
  application: string;  // How this rule specifically applies to this chapter's content
}

// ─── 3–4. Board learning outcomes ────────────────────────────────────────────

// Stored as string arrays directly in ChapterKnowledge (simple enough)

// ─── 5. Core concepts ─────────────────────────────────────────────────────────

// Stored as string[] in ChapterKnowledge — the fundamental ideas the chapter builds around

// ─── 6. Subtopics ─────────────────────────────────────────────────────────────

export interface SubtopicDetail {
  id:               string;   // "t1", "t2", ... — must match chapterRegistry.ts
  name:             string;
  coreConcept:      string;   // The ONE idea this subtopic ultimately teaches
  keyIdea:          string;   // The insight that makes this subtopic click
  estimatedPeriods: number;   // Approximate class periods needed (40-min period)
}

// ─── 7. Concept dependency graph ─────────────────────────────────────────────

export type DependencyRelationship =
  | "requires"             // Target concept cannot be understood without source concept
  | "generalises"          // Source concept is a special case of target
  | "applies"              // Source concept is applied to produce target result
  | "contradicts-intuition"; // This concept surprises students; prior intuition is wrong

export interface ConceptDependencyEdge {
  from:         string;               // Concept node ID (e.g. "mth:9:ch01:rational-definition")
  to:           string;               // Concept node ID
  relationship: DependencyRelationship;
  explanation:  string;               // Why this dependency exists — used in lesson generation
}

// ─── 8. Prerequisites ─────────────────────────────────────────────────────────

export interface ChapterRef {
  subject:          SupportedSubject;
  classNum:         SupportedClass;
  chapterId:        string;
  chapterName:      string;
  requiredConcepts: string[];  // The specific concepts from that chapter that must be known
}

// ─── 9. Essential definitions ─────────────────────────────────────────────────

export interface Definition {
  term:                string;
  formalDefinition:    string;  // Precise, board-exam-safe definition
  informalExplanation: string;  // Student-friendly explanation using everyday language
  example?:            string;
  counterExample?:     string;  // Critical for distinguishing from near-miss definitions
  boardNote?:          string;  // CBSE vs ICSE definition differences if any
}

// ─── 10. Formula inventory ────────────────────────────────────────────────────

export interface VariableSpec {
  symbol:  string;
  meaning: string;
  unit?:   string;   // SI unit string, e.g. "m/s²"; omit for pure mathematics
}

export interface Formula {
  name:             string;
  latex:            string;   // LaTeX representation for rendering
  plainText:        string;   // ASCII-safe version for text contexts
  variables:        VariableSpec[];
  derivedFrom?:     string;   // Parent formula or law this is derived from
  applicableWhen:   string;   // The precise conditions under which this formula applies
  doesNotApplyWhen: string;   // Common misapplication — when students use it wrong
  examTip?:         string;   // Exam-specific usage note
}

// ─── 11. Laws, theorems, principles ──────────────────────────────────────────

export interface LawOrTheorem {
  name:          string;
  type:          "law" | "theorem" | "principle" | "postulate" | "axiom" | "corollary";
  statement:     string;
  proofInsight?: string;      // Key insight of the proof (not full proof text)
  discoveredBy?: string;
  limitations?:  string;      // Scope — when this law/theorem does NOT hold
  boardRelevance: string;     // How this appears in CBSE/ICSE exams specifically
}

// ─── 12. Common misconceptions ────────────────────────────────────────────────

export interface Misconception {
  misconception:   string;   // The wrong belief, written as a student would state it
  correction:      string;   // The correct understanding
  whyItHappens:    string;   // Cognitive/educational root cause
  revealingQuestion: string; // A question that exposes this misconception in a student
}

// ─── 13. Examiner traps ───────────────────────────────────────────────────────

export interface ExaminerTrap {
  trap:               string;   // What examiners specifically look for (and students miss)
  typicalScenario:    string;   // A specific marking context where this costs marks
  avoidanceStrategy:  string;   // What a student must remember to do
  marksAtRisk:        string;   // e.g. "½ mark for missing unit", "1 mark for missing step"
}

// ─── 14. Typical student mistakes ─────────────────────────────────────────────

export interface StudentMistake {
  mistake:        string;   // Written as the student's incorrect work would appear
  correction:     string;   // What correct work looks like
  conceptualError: string;  // The underlying misunderstanding driving the error
}

// ─── 15. Bloom's taxonomy mapping ─────────────────────────────────────────────

export interface BloomsMap {
  subtopicId:    string;
  entryLevel:    BloomsLevel;   // Bloom's level typically used to introduce this subtopic
  masteryLevel:  BloomsLevel;   // Bloom's level representing mastery
  targetLevels:  BloomsLevel[]; // All levels that should be assessed for this subtopic
  hotsStarters:  string[];      // 2–3 question starters for the highest target level
}

// ─── 16. Difficulty progression ───────────────────────────────────────────────

export interface DifficultyStep {
  step:            number;
  concept:         string;
  tier:            DifficultyTier;
  dependsOnStep?:  number;      // Which prior step must be secure before this one
  teachingNote:    string;      // What makes this step hard — and how to bridge it
}

// ─── 17. Real-life applications ───────────────────────────────────────────────

export interface RealLifeApplication {
  context:           string;   // The real-world situation
  conceptUsed:       string;   // Which chapter concept appears here
  explanation:       string;   // How the concept appears in this context
  ageRelevance:      string;   // Why a Class 6–9 student finds this compelling
  crossSubject?:     string;   // Other subject where this exact application appears
}

// ─── 18. Cross-chapter links ─────────────────────────────────────────────────

export type ChapterLinkType =
  | "prerequisite-for"   // Current chapter is required for the linked chapter
  | "builds-on"          // Current chapter builds on the linked chapter
  | "parallel-concept"   // Same concept appears in different form
  | "applies-here";      // Current chapter's concept is applied in the linked chapter

export interface CrossChapterLink {
  subject:     SupportedSubject;
  classNum:    SupportedClass;
  chapterId:   string;
  chapterName: string;
  linkType:    ChapterLinkType;
  description: string;
}

// ─── 19. Cross-subject links ─────────────────────────────────────────────────

export interface CrossSubjectLink {
  subject:     SupportedSubject;
  topic:       string;         // The specific topic in the other subject
  description: string;         // How the connection works
  strength:    "strong" | "moderate" | "weak";
}

// ─── 20. Teaching sequence ────────────────────────────────────────────────────

export interface TeachingStep {
  step:                number;
  action:              string;   // What the teacher/lesson does
  duration:            string;   // e.g. "15 minutes", "1 period"
  pedagogyNote:        string;   // CMF/NEP alignment note for this step
  formativeCheckpoint?: string;  // NEP-FORM: what to check at end of this step
}

// ─── Master entity ────────────────────────────────────────────────────────────

/**
 * ChapterKnowledge — the complete pedagogical record for one chapter.
 *
 * One instance per chapter. Every field is required.
 * Empty arrays are allowed where a field has no applicable entries
 * (e.g. formulaInventory for History chapters).
 * Use an empty string only where explicitly noted as allowed.
 */
export interface ChapterKnowledge {
  // ── Canonical identity ────────────────────────────────────────────────────
  chapterId:    string;           // Matches ChapterRecord.chapterId in question-bank/chapterRegistry.ts
  chapterName:  string;
  classNum:     SupportedClass;
  subject:      SupportedSubject;
  board:        BoardApplicability;

  // ── 1. Learning objectives ─────────────────────────────────────────────────
  learningObjectives: LearningObjective[];

  // ── 2. NEP 2020 competency mapping ────────────────────────────────────────
  nepCompetencyMap: NepCompetencyMap[];

  // ── 3. CBSE learning outcomes ─────────────────────────────────────────────
  cbseOutcomes: string[];

  // ── 4. ICSE learning outcomes ─────────────────────────────────────────────
  // Use empty array if ICSE outcomes are identical to CBSE.
  // List only the DIFFERENCES from CBSE (additions or modifications).
  icseOutcomes: string[];

  // ── 5. Core concepts ──────────────────────────────────────────────────────
  // The 4–8 foundational ideas the chapter exists to teach.
  // All subtopics, definitions, and examples serve one of these.
  coreConcepts: string[];

  // ── 6. Subtopics ──────────────────────────────────────────────────────────
  subtopics: SubtopicDetail[];

  // ── 7. Concept dependency graph ───────────────────────────────────────────
  conceptGraph: ConceptDependencyEdge[];

  // ── 8. Prerequisites ──────────────────────────────────────────────────────
  prerequisites: {
    chapters: ChapterRef[];
    concepts: string[];          // Concept node IDs from prior chapters
  };

  // ── 9. Essential definitions ──────────────────────────────────────────────
  essentialDefinitions: Definition[];

  // ── 10. Formula inventory ─────────────────────────────────────────────────
  formulaInventory: Formula[];   // Empty array for non-quantitative chapters

  // ── 11. Laws, theorems, principles ───────────────────────────────────────
  lawsAndTheorems: LawOrTheorem[];

  // ── 12. Common misconceptions ─────────────────────────────────────────────
  commonMisconceptions: Misconception[];

  // ── 13. Examiner traps ────────────────────────────────────────────────────
  examinerTraps: ExaminerTrap[];

  // ── 14. Typical student mistakes ──────────────────────────────────────────
  typicalMistakes: StudentMistake[];

  // ── 15. Bloom's taxonomy mapping ──────────────────────────────────────────
  bloomsMap: BloomsMap[];

  // ── 16. Difficulty progression ────────────────────────────────────────────
  difficultyProgression: DifficultyStep[];

  // ── 17. Real-life applications ────────────────────────────────────────────
  realLifeApplications: RealLifeApplication[];

  // ── 18. Cross-chapter links ───────────────────────────────────────────────
  crossChapterLinks: CrossChapterLink[];

  // ── 19. Cross-subject links ───────────────────────────────────────────────
  crossSubjectLinks: CrossSubjectLink[];

  // ── 20. Teaching sequence ─────────────────────────────────────────────────
  teachingSequence: TeachingStep[];
}
