/**
 * Lesson Evaluation Framework — Dimension scorers.
 *
 * Each exported function takes a LessonResponse and returns a DimensionScore.
 * All logic is purely deterministic — no AI calls, no I/O, no side-effects.
 * Rule thresholds are derived from the SnapSolve Teaching Standards.
 */

import type { LessonResponse } from "../../lib/lessonTypes";
import type { Deduction, DimensionScore } from "./types";

// ─── Internal helpers ─────────────────────────────────────────────────────────

/** Trimmed character count. */
function len(s: string): number { return s.trim().length; }

/** Build a DimensionScore: starts at 10, subtract deduction points, clamp to [0, 10]. */
function dim(name: string, deductions: Deduction[]): DimensionScore {
  const loss  = deductions.reduce((sum, d) => sum + d.points, 0);
  const score = Math.max(0, 10 - loss);
  return { name, score, maxScore: 10, deductions };
}

/** Construct a Deduction object. */
function deduct(
  section:    string,
  issue:      string,
  suggestion: string,
  severity:   Deduction["severity"],
  points:     number,
): Deduction {
  return { section, issue, suggestion, severity, points };
}

/**
 * Simplified syllable counter used by jargon detection.
 * Counts vowel runs as a proxy for syllable count.
 */
function syllableCount(word: string): number {
  return (word.toLowerCase().match(/[aeiou]+/g) ?? []).length || 1;
}

/** A word is "jargon" if it has ≥ 4 syllable groups and ≥ 8 characters. */
function isJargon(word: string): boolean {
  return syllableCount(word) >= 4 && word.length >= 8;
}

// ─── 1. Concept Clarity ──────────────────────────────────────────────────────
//
// Checks: keyConcepts, vocabulary, questionTranslation
// Standard: Every concept introduced must be named, defined in plain language,
//           and mapped from words to mathematical notation.

export function scoreConceptClarity(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 1.1 — Key concepts count
  if (lesson.keyConcepts.length < 2) {
    deductions.push(deduct(
      "lesson.keyConcepts",
      `Only ${lesson.keyConcepts.length} key concept(s) listed — minimum 2 required to define the lesson scope.`,
      "List at least 3 concrete, distinct concepts the student will learn, e.g. ['Discriminant and its sign rules', 'Factoring method for quadratics', 'Verification by substitution']. Avoid broad labels like 'Algebra' or 'Equations' — name the specific sub-skill.",
      lesson.keyConcepts.length === 0 ? "critical" : "major",
      lesson.keyConcepts.length === 0 ? 3 : 2,
    ));
  }

  // 1.2 — Vocabulary count
  if (lesson.vocabulary.length < 3) {
    deductions.push(deduct(
      "lesson.vocabulary",
      `Only ${lesson.vocabulary.length} vocabulary term(s) — minimum 3 required so students are never blocked by unknown words.`,
      "Add an entry for every technical or subject-specific word used in the lesson body. Each meaning must use plain English only, e.g. { term: 'Coefficient', meaning: 'The number in front of a variable; in 3x, the coefficient is 3.' }",
      lesson.vocabulary.length < 2 ? "major" : "minor",
      lesson.vocabulary.length < 2 ? 2 : 1,
    ));
  }

  // 1.3 — Short vocabulary meanings
  const shortMeanings = lesson.vocabulary.filter(v => len(v.meaning) < 20);
  shortMeanings.slice(0, 2).forEach((v) => {
    const idx = lesson.vocabulary.indexOf(v);
    deductions.push(deduct(
      `lesson.vocabulary[${idx}].meaning`,
      `Meaning for '${v.term}' is only ${len(v.meaning)} chars — too brief to clarify the term for a new learner.`,
      `Expand to ≥ 20 chars, written as a sentence: what IS '${v.term}', what does it LOOK LIKE in practice, and add a mini-example. Avoid restating the term itself in the definition.`,
      "minor",
      1,
    ));
  });

  // 1.4 — Plain-English restatement
  if (len(lesson.questionTranslation.plainEnglish) < 30) {
    deductions.push(deduct(
      "lesson.questionTranslation.plainEnglish",
      `Plain-English restatement is only ${len(lesson.questionTranslation.plainEnglish)} chars — too brief to be useful.`,
      "Restate the question as a natural sentence a student would say to a friend: 'The question is asking us to find the two values of x that make the left side equal zero.' Avoid formal language. This is the student's first mental anchor.",
      "major",
      2,
    ));
  }

  // 1.5 — Word-to-math mapping
  if (len(lesson.questionTranslation.wordToMath) < 20) {
    deductions.push(deduct(
      "lesson.questionTranslation.wordToMath",
      `wordToMath is ${len(lesson.questionTranslation.wordToMath) === 0 ? "empty" : "too brief at " + len(lesson.questionTranslation.wordToMath) + " chars"} — students cannot bridge English phrasing to algebraic notation.`,
      "Map every key phrase to its mathematical meaning. Use arrows: '\"is equal to\" → =', '\"the sum of x and y\" → x + y', '\"find x\" → solve for the unknown'. This is especially critical for word problems where language encodes the equation.",
      len(lesson.questionTranslation.wordToMath) === 0 ? "critical" : "major",
      len(lesson.questionTranslation.wordToMath) === 0 ? 3 : 2,
    ));
  }

  return dim("Concept Clarity", deductions);
}

// ─── 2. Reasoning Completeness ────────────────────────────────────────────────
//
// Checks: guidedReasoning (step count, why depth, math notation), finalAnswer
// Standard: Every logical move must be shown, justified, and verified.

export function scoreReasoningCompleteness(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];
  const steps = lesson.guidedReasoning;

  // 2.1 — Minimum steps
  if (steps.length < 3) {
    deductions.push(deduct(
      "lesson.guidedReasoning",
      `Only ${steps.length} reasoning step(s) — a minimum of 3 is required to scaffold any real problem.`,
      "Expand to at least 4 steps. Each step should encode exactly one logical move: (1) identify the structure, (2) choose and apply the method, (3) execute the calculation, (4) verify. Never combine two conceptual actions in one step.",
      "critical",
      4,
    ));
  }

  // 2.2 — Thin 'why' fields (justification missing)
  const thinWhy = steps.filter(s => len(s.why) < 20);
  if (thinWhy.length > 0) {
    const idx = steps.indexOf(thinWhy[0]);
    deductions.push(deduct(
      `lesson.guidedReasoning[${idx}].why`,
      `${thinWhy.length} step(s) have 'why' < 20 chars — justification is too thin to build mathematical reasoning.`,
      "The 'why' must name the principle or rule being applied, not restate the action. Instead of 'We divide both sides', write: 'We divide both sides by 2 because dividing by the coefficient of x isolates it — and we can do this to both sides simultaneously without changing the equation.'",
      "major",
      2,
    ));
  }

  // 2.3 — Empty 'math' fields
  const emptyMath = steps.filter(s => len(s.math) === 0);
  if (emptyMath.length > 0) {
    const idx = steps.indexOf(emptyMath[0]);
    deductions.push(deduct(
      `lesson.guidedReasoning[${idx}].math`,
      `${emptyMath.length} step(s) have an empty 'math' field — students cannot see the notation being applied.`,
      "Show the exact mathematical transformation. Use → to chain sub-steps: '2x + 6 = 14  →  2x = 14 − 6  →  2x = 8  →  x = 4'. Every step's math field should look like exam working, not prose.",
      "minor",
      1,
    ));
  }

  // 2.4 — Thin finalAnswer.whyCorrect
  if (len(lesson.finalAnswer.whyCorrect) < 30) {
    deductions.push(deduct(
      "lesson.finalAnswer.whyCorrect",
      `finalAnswer.whyCorrect is only ${len(lesson.finalAnswer.whyCorrect)} chars — needs a real justification, not just the answer.`,
      "Explain why the answer is correct in terms of the original question. E.g., 'x = 4 is correct because substituting back gives 2(4) + 6 = 14, which matches both sides exactly. An answer is only valid if it satisfies the original equation.'",
      "major",
      2,
    ));
  }

  // 2.5 — Missing verification
  if (len(lesson.finalAnswer.verification) < 20) {
    deductions.push(deduct(
      "lesson.finalAnswer.verification",
      `finalAnswer.verification is ${len(lesson.finalAnswer.verification) === 0 ? "empty" : "too brief at " + len(lesson.finalAnswer.verification) + " chars"}.`,
      "Show the self-check step explicitly: substitute the answer back into the original equation and confirm both sides are equal. Write it out in full: 'Check: substitute x=4 → 2(4)+6=8+6=14 ✓'. Verification is the most important study habit this section can model.",
      "minor",
      1,
    ));
  }

  return dim("Reasoning Completeness", deductions);
}

// ─── 3. Step-by-step Continuity ──────────────────────────────────────────────
//
// Checks: guidedReasoning (pause prompts, result fields, 'what' descriptions)
// Standard: Steps must chain without gaps; each step's output seeds the next.

export function scoreStepContinuity(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];
  const steps = lesson.guidedReasoning;

  // 3.1 — Cannot assess continuity with < 3 steps
  if (steps.length < 3) {
    deductions.push(deduct(
      "lesson.guidedReasoning",
      `Only ${steps.length} step(s) — continuity cannot be assessed without at least 3 steps.`,
      "Add steps until the chain is complete. Each step's 'result' field should become the starting point of the next step's 'what'. A student should be able to follow the thread from step 1 to the final answer without any gaps.",
      "critical",
      4,
    ));
    return dim("Step-by-step Continuity", deductions);
  }

  // 3.2 — Missing pause prompts
  const missingPause = steps.filter(s => len(s.pause) < 15);
  if (missingPause.length / steps.length > 0.4) {
    deductions.push(deduct(
      "lesson.guidedReasoning[*].pause",
      `${missingPause.length} of ${steps.length} steps are missing 'pause' prompts — students proceed without checking understanding.`,
      "Every step should end with a question that forces active engagement before moving on. Use prediction ('What do you think the next step will look like?'), reflection ('Why did we do it this way and not another?'), or error-check ('Could this value ever be negative? Why not?'). Pause prompts are the single most powerful active-learning lever in the lesson.",
      "major",
      2,
    ));
  }

  // 3.3 — Missing result fields
  const missingResult = steps.filter(s => len(s.result) < 10);
  if (missingResult.length / steps.length > 0.3) {
    deductions.push(deduct(
      "lesson.guidedReasoning[*].result",
      `${missingResult.length} of ${steps.length} steps have a thin or missing 'result' field — no clear checkpoint.`,
      "The 'result' field should state what the student now knows or has computed. E.g., 'We now know that x = 4.' or 'The equation is now in the form ax² + bx + c = 0 with a=1, b=−5, c=6.' This creates a concrete checkpoint before the next step begins.",
      "major",
      2,
    ));
  }

  // 3.4 — Thin 'what' descriptions
  const thinWhat = steps.filter(s => len(s.what) < 20);
  if (thinWhat.length >= 2) {
    const idx = steps.indexOf(thinWhat[0]);
    deductions.push(deduct(
      `lesson.guidedReasoning[${idx}].what`,
      `${thinWhat.length} step(s) have a 'what' description under 20 chars — too thin to orient the student.`,
      "The 'what' field should fully name the action being taken. Not 'Solve for x' but: 'Divide both sides of the equation by the coefficient of x to isolate x on the left-hand side.' Students should be able to understand what is happening from 'what' alone.",
      "minor",
      1,
    ));
  }

  return dim("Step-by-step Continuity", deductions);
}

// ─── 4. Weak Student Comprehension ───────────────────────────────────────────
//
// Checks: confusionPoints, commonMistakes, simplerExample, teacherThinking
// Standard: Every friction point a struggling student hits must be explicitly anticipated.

export function scoreWeakStudentComprehension(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 4.1 — Confusion points count
  if (lesson.confusionPoints.length < 2) {
    deductions.push(deduct(
      "lesson.confusionPoints",
      `Only ${lesson.confusionPoints.length} confusion point(s) — a struggling student needs at least 2 of their predictable sticking points named explicitly.`,
      "Write confusion points as the actual thought a confused student has, not an abstract description. E.g., 'Students often think you can only move a term to the other side if its coefficient is 1.' or 'Students forget that squaring a negative number gives a positive result, so (−3)² = 9, not −9.'",
      lesson.confusionPoints.length === 0 ? "critical" : "major",
      lesson.confusionPoints.length === 0 ? 3 : 2,
    ));
  }

  // 4.2 — Common mistakes count
  if (lesson.commonMistakes.length < 2) {
    deductions.push(deduct(
      "lesson.commonMistakes",
      `Only ${lesson.commonMistakes.length} common mistake(s) documented — students need concrete mistake patterns they can recognise in their own work.`,
      "Add at least 2 mistakes written exactly as they appear in student working. E.g., mistake: 'Writing x = +5 and forgetting x = −5 as the second solution of a quadratic', whyItHappens: 'Students learn to take the positive root first and forget the ± applies to both cases', howToAvoid: 'Always write ± explicitly in the quadratic formula step and track both branches.'",
      "major",
      2,
    ));
  }

  // 4.3 — Thin howToAvoid
  const thinAvoid = lesson.commonMistakes.filter(m => len(m.howToAvoid) < 25);
  thinAvoid.slice(0, 2).forEach((m) => {
    const idx = lesson.commonMistakes.indexOf(m);
    deductions.push(deduct(
      `lesson.commonMistakes[${idx}].howToAvoid`,
      `howToAvoid for '${m.mistake.slice(0, 40)}' is only ${len(m.howToAvoid)} chars — avoidance strategy is too vague to be actionable.`,
      "Give a specific, repeatable mental check. E.g., 'Before writing the final answer, always ask: does my answer satisfy the original equation? Substitute back and confirm both sides match. If they don't, the mistake is in one of the preceding steps.'",
      "minor",
      1,
    ));
  });

  // 4.4 — Simpler example
  if (len(lesson.simplerExample.problem) < 20) {
    deductions.push(deduct(
      "lesson.simplerExample.problem",
      `simplerExample.problem is ${len(lesson.simplerExample.problem) === 0 ? "empty" : "only " + len(lesson.simplerExample.problem) + " chars"} — this is the primary scaffold for weak students.`,
      "Create a version of the same problem type that is one difficulty level simpler. If the lesson is about quadratics, use a linear equation as the simpler example. If it's systems of equations, use a single equation. Write the full worked solution — this is what a struggling student reads when the main steps lose them.",
      len(lesson.simplerExample.problem) === 0 ? "critical" : "major",
      len(lesson.simplerExample.problem) === 0 ? 3 : 2,
    ));
  }

  // 4.5 — Teacher thinking (firstNotice)
  if (len(lesson.teacherThinking.firstNotice) < 25) {
    deductions.push(deduct(
      "lesson.teacherThinking.firstNotice",
      `teacherThinking.firstNotice is too brief (${len(lesson.teacherThinking.firstNotice)} chars) — expert pattern recognition must be made explicit.`,
      "Describe the exact structural cue an expert notices first, and why it matters. E.g., 'The first thing I notice is that the right-hand side is zero — that's the key feature of a quadratic in standard form. It tells me immediately which solving methods are available.' Make the invisible visible.",
      "minor",
      1,
    ));
  }

  return dim("Weak Student Comprehension", deductions);
}

// ─── 5. Vocabulary Simplicity ─────────────────────────────────────────────────
//
// Checks: vocabulary (meanings), guidedReasoning (step length)
// Standard: Definitions must use language simpler than the term being defined.

export function scoreVocabularySimplicity(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 5.1 — Vocabulary too sparse
  if (lesson.vocabulary.length < 2) {
    deductions.push(deduct(
      "lesson.vocabulary",
      `Only ${lesson.vocabulary.length} vocabulary term(s) — students silently hit unknown words and stop comprehending.`,
      "Every technical term used anywhere in the lesson must have a vocabulary entry. Scan guidedReasoning, teacherThinking, intuition, and commonMistakes for specialist words. Aim for 3–5 terms. Definitions must be readable by a student who has never seen the word before.",
      lesson.vocabulary.length === 0 ? "critical" : "major",
      lesson.vocabulary.length === 0 ? 4 : 3,
    ));
  }

  // 5.2 — Jargon in meanings
  const jargonMeanings = lesson.vocabulary.filter(v => {
    const words = v.meaning.split(/\s+/);
    return words.some(w => isJargon(w));
  });
  if (jargonMeanings.length > 0) {
    const v = jargonMeanings[0];
    const idx = lesson.vocabulary.indexOf(v);
    deductions.push(deduct(
      `lesson.vocabulary[${idx}].meaning`,
      `Meaning for '${v.term}' uses complex multi-syllable words — vocabulary definitions must use simpler language than the term being defined.`,
      "Test every word in the definition: 'If a student doesn't know the term I'm defining, will they know THIS word?' Strip out words with 4+ syllables unless they are themselves defined. Aim for Flesch-Kincaid Grade 6 readability in all meanings.",
      "major",
      2,
    ));
  }

  // 5.3 — Short meanings
  const thinMeanings = lesson.vocabulary.filter(v => len(v.meaning) < 20 && len(v.meaning) > 0);
  if (thinMeanings.length > 0) {
    const idx = lesson.vocabulary.indexOf(thinMeanings[0]);
    deductions.push(deduct(
      `lesson.vocabulary[${idx}].meaning`,
      `${thinMeanings.length} meaning(s) are under 20 chars — too brief to define the term.`,
      "A good vocabulary meaning has three parts: (a) what the term IS, (b) what it LOOKS LIKE in a real expression, and (c) a mini-example. Aim for at least one full sentence per entry.",
      "minor",
      1,
    ));
  }

  // 5.4 — Overly verbose steps
  const verboseSteps = lesson.guidedReasoning.filter(s => len(s.what) > 200);
  if (verboseSteps.length > 0) {
    deductions.push(deduct(
      "lesson.guidedReasoning[*].what",
      `${verboseSteps.length} step(s) have 'what' > 200 chars — over-long step descriptions bury the key action and increase cognitive load.`,
      "If 'what' exceeds 200 chars, split into two separate steps. Each step must describe exactly one action. If you find yourself writing 'first... then...', that is a splitting signal. Shorter steps with more steps is almost always better for a struggling student.",
      "minor",
      1,
    ));
  }

  return dim("Vocabulary Simplicity", deductions);
}

// ─── 6. Analogy Quality ───────────────────────────────────────────────────────
//
// Checks: intuition (story, everyday, visual)
// Standard: Analogies must be specific, concrete, and long enough to build a mental model.

export function scoreAnalogyQuality(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];
  const { story, everyday, visual } = lesson.intuition;

  // 6.1 — Story too short
  if (len(story) < 60) {
    deductions.push(deduct(
      "lesson.intuition.story",
      `Story analogy is only ${len(story)} chars — too short to build genuine intuition.`,
      "Write at least 5 sentences following this arc: (1) Set the scene (character + situation). (2) Introduce their problem. (3) Show their intuitive solution (no math). (4) Show why it works. (5) Bridge back: 'This is exactly what [topic] formalises.' The story should make a student say 'Oh! That's what it means.' E.g. for linear equations: a shopkeeper balancing scales.",
      len(story) < 20 ? "critical" : "major",
      len(story) < 20 ? 3 : 2,
    ));
  }

  // 6.2 — Everyday connection too thin
  if (len(everyday) < 40) {
    deductions.push(deduct(
      "lesson.intuition.everyday",
      `Everyday connection is only ${len(everyday)} chars — too thin to anchor the concept in the student's own experience.`,
      "Reference a specific situation from student life. Name the exact context: 'When you and 3 friends split a restaurant bill equally, you're dividing by 4 — that's the same operation we use to isolate x when its coefficient is 4.' Avoid generic phrases like 'we use this in real life' or 'you do this without knowing it'.",
      "major",
      2,
    ));
  }

  // 6.3 — Visual too thin
  if (len(visual) < 30) {
    deductions.push(deduct(
      "lesson.intuition.visual",
      `Visual description is only ${len(visual)} chars — not enough to form a mental image.`,
      "Describe a specific diagram or spatial picture: layout, movement, or transformation. E.g., 'Imagine a balance scale: each side holds the same total weight. When we add a weight to one side, we must add the same weight to the other — that's what adding to both sides of an equation does.' Use directional and spatial language.",
      "minor",
      1,
    ));
  }

  // 6.4 — Lazy analogy pattern
  const lazyPhrases = [story, everyday].filter(s => {
    const n = s.toLowerCase();
    return (n.includes("similar to") || n.includes("just like")) && len(s) < 100;
  });
  if (lazyPhrases.length > 0) {
    deductions.push(deduct(
      "lesson.intuition",
      "Analogy uses 'similar to' or 'just like' without enough content to complete the comparison.",
      "A lazy analogy names the comparison but doesn't paint the picture. Replace 'This is just like baking' with: 'Imagine you're doubling a cookie recipe. Every ingredient must be doubled — if the original uses 2 cups of flour, you need 4. That fixed proportional relationship is exactly what a linear equation captures.' Complete the picture.",
      "minor",
      1,
    ));
  }

  return dim("Analogy Quality", deductions);
}

// ─── 7. Misconception Prevention ─────────────────────────────────────────────
//
// Checks: commonMistakes, confusionPoints, examinerThinking.examTrap
// Standard: Every predictable student error must be named, its root cause explained, and a prevention strategy given.

export function scoreMisconceptionPrevention(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 7.1 — Common mistakes count
  if (lesson.commonMistakes.length < 2) {
    deductions.push(deduct(
      "lesson.commonMistakes",
      `Only ${lesson.commonMistakes.length} common mistake(s) — students enter practice blind to the errors they are most likely to make.`,
      "Research the most frequent errors for this topic in student cohorts. Document each mistake exactly as it appears in student writing, explain the cognitive root (not just 'they didn't pay attention'), and give a specific detection + correction habit. Minimum 2 entries, ideal 3.",
      lesson.commonMistakes.length === 0 ? "critical" : "major",
      lesson.commonMistakes.length === 0 ? 3 : 2,
    ));
  }

  // 7.2 — Thin howToAvoid fields
  const thinAvoid = lesson.commonMistakes.filter(m => len(m.howToAvoid) < 25);
  thinAvoid.slice(0, 2).forEach(m => {
    const idx = lesson.commonMistakes.indexOf(m);
    deductions.push(deduct(
      `lesson.commonMistakes[${idx}].howToAvoid`,
      `howToAvoid for '${m.mistake.slice(0, 50)}' is only ${len(m.howToAvoid)} chars.`,
      "Give a specific, repeatable mental check: 'Before finalising the answer, always substitute it back into the original equation. If the two sides are equal, the answer is correct. If not, trace back to find the first step where the mistake occurred.'",
      "minor",
      1,
    ));
  });

  // 7.3 — Exam trap too vague
  if (len(lesson.examinerThinking.examTrap) < 25) {
    deductions.push(deduct(
      "lesson.examinerThinking.examTrap",
      `examTrap is ${len(lesson.examinerThinking.examTrap) === 0 ? "empty" : "too brief at " + len(lesson.examinerThinking.examTrap) + " chars"} — students face exam traps without knowing they exist.`,
      "Describe the exact misleading element an examiner would insert. E.g., 'Examiners often write the equation with a negative leading coefficient (e.g., −x² + 5x − 6 = 0) to force students to multiply through by −1 before applying the formula. Students who skip this step get the wrong discriminant sign and lose all marks.' Be specific about the trap mechanism.",
      len(lesson.examinerThinking.examTrap) === 0 ? "critical" : "major",
      len(lesson.examinerThinking.examTrap) === 0 ? 3 : 2,
    ));
  }

  // 7.4 — Confusion points count
  if (lesson.confusionPoints.length < 2) {
    deductions.push(deduct(
      "lesson.confusionPoints",
      `Only ${lesson.confusionPoints.length} confusion point(s) — under-documents the misconception landscape.`,
      "Write confusion points as the literal internal question a confused student has: 'Why do I have to do the same thing to both sides?' or 'How do I know which root is the right one?' — not abstract descriptions. A student reading these should think 'Yes, that's exactly what I was wondering.'",
      "minor",
      1,
    ));
  }

  return dim("Misconception Prevention", deductions);
}

// ─── 8. Cognitive Load ────────────────────────────────────────────────────────
//
// Checks: guidedReasoning (count + pause distribution), retrievalPractice, rememberThese
// Standard: Chunking, pause points, and spaced retrieval must be balanced for working memory.

export function scoreCognitiveLoad(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];
  const steps = lesson.guidedReasoning;

  // 8.1 — Too many steps
  if (steps.length > 9) {
    deductions.push(deduct(
      "lesson.guidedReasoning",
      `${steps.length} guided reasoning steps exceeds 9 — working memory is overwhelmed.`,
      "Consolidate steps that encode the same logical move. Sub-steps of one operation (e.g., expanding brackets) can be grouped under one parent step with sub-bullets in the math field. The optimal range for secondary-school problems is 4–7 steps. More steps is NOT more thorough — it is more overwhelming.",
      "major",
      2,
    ));
  }

  // 8.2 — Too few steps (under-developed)
  if (steps.length > 0 && steps.length < 3) {
    deductions.push(deduct(
      "lesson.guidedReasoning",
      `Only ${steps.length} step(s) — lesson is under-developed; cognitive scaffolding is absent.`,
      "Expand to 4–7 steps. Break the solution into the smallest chunks a struggling student can follow without losing track. Even a 'simple' linear equation should have: (1) identify knowns and unknowns, (2) choose method, (3) execute operation, (4) state result, (5) verify.",
      "critical",
      3,
    ));
  }

  // 8.3 — Retrieval practice
  if (lesson.retrievalPractice.length < 2) {
    deductions.push(deduct(
      "lesson.retrievalPractice",
      `Only ${lesson.retrievalPractice.length} retrieval practice item(s) — spaced retrieval is the most evidence-backed technique for long-term retention.`,
      "Add 3 retrieval prompts that can be answered from memory after the lesson. Write them as timed or closed-book challenges: 'Without looking at your notes, write down the quadratic formula in 30 seconds.', 'List the three conditions that determine how many real solutions a quadratic has.', 'Close your eyes and trace the solution steps for this problem type.'",
      "major",
      2,
    ));
  }

  // 8.4 — rememberThese
  if (lesson.rememberThese.length < 2) {
    deductions.push(deduct(
      "lesson.rememberThese",
      `Only ${lesson.rememberThese.length} 'rememberThese' item(s) — key takeaways are not consolidated for the student.`,
      "List 3–4 short, memorable rules as imperative sentences the student can use as a checklist: 'Always verify by substitution.', 'The discriminant tells you how many solutions exist before you solve.', 'A quadratic always has exactly 0, 1, or 2 real solutions — never 3.' These should be the student's mental model summary.",
      "minor",
      1,
    ));
  }

  // 8.5 — Pause prompt distribution (already checked in continuity, but cognitive-load perspective)
  const noPause = steps.filter(s => len(s.pause) < 15);
  if (steps.length > 0 && noPause.length / steps.length > 0.6) {
    deductions.push(deduct(
      "lesson.guidedReasoning[*].pause",
      `${noPause.length} of ${steps.length} steps lack pause prompts — cognitive load is not being regulated at the step level.`,
      "Every step needs a pause prompt that makes the student process what just happened before moving forward. Without pauses, students read passively and retain nothing. Prompts can be predictive ('What do you think comes next?'), reflective ('Why did we choose this method?'), or confirmatory ('Can you see why this must be positive?').",
      "major",
      2,
    ));
  }

  return dim("Cognitive Load", deductions);
}

// ─── 9. Practice Quality ──────────────────────────────────────────────────────
//
// Checks: practiceQuestion (question, hints, solution), confidenceCheck, simplerExample
// Standard: Practice must be complete, scaffolded, and diagnostic.

export function scorePracticeQuality(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 9.1 — Practice question too short
  if (len(lesson.practiceQuestion.question) < 20) {
    deductions.push(deduct(
      "lesson.practiceQuestion.question",
      `Practice question is ${len(lesson.practiceQuestion.question) === 0 ? "empty" : "only " + len(lesson.practiceQuestion.question) + " chars"} — students have no problem to attempt.`,
      "Write a complete, well-formed question that tests the same skill as the lesson example but changes the numbers, context, or direction of the question. Include all information needed to solve it. The question should be 'exam-quality' — the same format a student would encounter in their actual exam.",
      len(lesson.practiceQuestion.question) === 0 ? "critical" : "major",
      len(lesson.practiceQuestion.question) === 0 ? 3 : 2,
    ));
  }

  // 9.2 — Too few hints
  if (lesson.practiceQuestion.hints.length < 2) {
    deductions.push(deduct(
      "lesson.practiceQuestion.hints",
      `Only ${lesson.practiceQuestion.hints.length} hint(s) — insufficient scaffolding for students who get stuck.`,
      "Provide exactly 3 hints of increasing specificity: Hint 1 — identify the problem type ('This is a quadratic — which form is it in?'). Hint 2 — name the first step ('Start by moving all terms to the left side'). Hint 3 — give the first calculation ('After collecting, you should have: 2x² − 7x + 3 = 0'). A student who reads all 3 hints should be able to complete the solution.",
      "major",
      2,
    ));
  }

  // 9.3 — Thin solution
  if (len(lesson.practiceQuestion.solution) < 30) {
    deductions.push(deduct(
      "lesson.practiceQuestion.solution",
      `Practice question solution is only ${len(lesson.practiceQuestion.solution)} chars — too brief to serve as a model answer.`,
      "Write a complete worked solution exactly as a student should present it in an exam. Show all working, intermediate steps, and the final verification. This is what the student checks against after attempting — it must be detailed enough to pinpoint exactly where they went wrong.",
      "major",
      2,
    ));
  }

  // 9.4 — Confidence check options count
  if (lesson.confidenceCheck.options.length < 4) {
    deductions.push(deduct(
      "lesson.confidenceCheck.options",
      `Confidence check MCQ has only ${lesson.confidenceCheck.options.length} option(s) — needs 4 choices with diagnostic distractors.`,
      "Write 4 options where each wrong answer results from a specific common mistake. E.g., if the correct answer is x = 3 and x = 5: (A) x=3, x=5 [correct]; (B) x=3 only [forgot negative root]; (C) x=−3, x=−5 [sign error in formula]; (D) x=8, x=0 [added instead of multiplied]. Each distractor should diagnose a specific misconception.",
      "minor",
      1,
    ));
  }

  // 9.5 — Thin confidence check explanation
  if (len(lesson.confidenceCheck.explanation) < 30) {
    deductions.push(deduct(
      "lesson.confidenceCheck.explanation",
      `Confidence check explanation is only ${len(lesson.confidenceCheck.explanation)} chars.`,
      "The explanation should (a) confirm why the correct answer is right, and (b) identify which mistake leads to each wrong answer. A student who chose option C should be able to read this explanation and pinpoint exactly where their reasoning went wrong.",
      "minor",
      1,
    ));
  }

  return dim("Practice Quality", deductions);
}

// ─── 10. Confidence Building ──────────────────────────────────────────────────
//
// Checks: beforeWeStart (motivator, anxietyReducer), confidenceBuilder, examinerThinking.topperInsight
// Standard: Lesson must open and close with specific, genuine confidence scaffolding — not generic praise.

export function scoreConfidenceBuilding(lesson: LessonResponse): DimensionScore {
  const deductions: Deduction[] = [];

  // 10.1 — Motivator
  if (len(lesson.beforeWeStart.motivator) < 30) {
    deductions.push(deduct(
      "lesson.beforeWeStart.motivator",
      `beforeWeStart.motivator is only ${len(lesson.beforeWeStart.motivator)} chars — too brief to genuinely motivate an anxious student.`,
      "Write 2–3 sentences that make the student feel capable before they start. Acknowledge the difficulty honestly, then reframe: 'This is the type of question that separates B-grade and A-grade answers — and after this lesson, you'll handle it confidently. The trick that toppers know is that this always reduces to a 3-step process.' Avoid: 'This is easy!', 'You've got this!', or any empty affirmation.",
      "major",
      2,
    ));
  }

  // 10.2 — Anxiety reducer
  if (len(lesson.beforeWeStart.anxietyReducer) < 25) {
    deductions.push(deduct(
      "lesson.beforeWeStart.anxietyReducer",
      `anxietyReducer is too brief (${len(lesson.beforeWeStart.anxietyReducer)} chars) — math anxiety requires a specific, named reframe.`,
      "Name the exact anxiety ('Many students freeze when they see two unknowns in one equation') and immediately give a cognitive reframe ('but notice that we always have at least as many equations as unknowns — that's the lock-and-key structure that makes these solvable'). Make the confusion feel like a normal part of the process, not a sign of failure.",
      "minor",
      1,
    ));
  }

  // 10.3 — Confidence builder (closing)
  if (len(lesson.confidenceBuilder) < 30) {
    deductions.push(deduct(
      "lesson.confidenceBuilder",
      `confidenceBuilder is only ${len(lesson.confidenceBuilder)} chars — closing confidence message is too thin to land.`,
      "Write 3–4 sentences that reference something specific the student just solved. E.g., 'You just worked through a quadratic that has two real solutions — that requires understanding the discriminant, factoring, and verification, all in one problem. That's genuinely impressive. The next time you see this structure, you'll recognise it instantly.' Never end with generic praise like 'Great work!' or 'Well done!'",
      "major",
      2,
    ));
  }

  // 10.4 — Topper insight
  if (len(lesson.examinerThinking.topperInsight) < 25) {
    deductions.push(deduct(
      "lesson.examinerThinking.topperInsight",
      `topperInsight is only ${len(lesson.examinerThinking.topperInsight)} chars — too brief to convey the insider advantage that builds real confidence.`,
      "A topper insight reveals a non-obvious pattern or shortcut that gives the student an insider edge. E.g., 'Toppers always check the discriminant first — it costs 5 seconds and immediately tells them whether to expect one, two, or no real solutions, which shapes the entire solution path.' It should feel like privileged information.",
      "minor",
      1,
    ));
  }

  // 10.5 — Retrieval practice for confidence
  if (lesson.retrievalPractice.length < 2) {
    deductions.push(deduct(
      "lesson.retrievalPractice",
      `Only ${lesson.retrievalPractice.length} retrieval item(s) — confidence grows from successful recall, not passive reading.`,
      "Add 3 retrieval prompts that students can attempt 24 hours later to confirm retention: 'Without notes, write down the three steps for solving a quadratic by factoring.', 'What does a negative discriminant tell you?', 'Can you draw the parabola for y = x² − 5x + 6 from memory?'",
      "minor",
      1,
    ));
  }

  return dim("Confidence Building", deductions);
}
