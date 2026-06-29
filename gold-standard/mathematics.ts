/**
 * Gold Standard Lesson Library — Mathematics
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Mathematics.
 */

import type { GoldStandardLesson } from "./types";

const ALL_CMF_TRUE = {
  cmf1_whyBeforeWhat:            true,
  cmf2_problemFirst:             true,
  cmf3_intuitionBeforeFormalism: true,
  cmf4_sixQuestionsAnswered:     true,
  cmf5_confusionsPreEmpted:      true,
  cmf6_nextQuestionAnswered:     true,
  cmf7_noSkippedSteps:           true,
  cmf8_formulaDerivation:        true,
  cmf9_theoremWhyExplained:      true,
  cmf10_lawIntuitionFirst:       true,
  cmf11_biologyFlowingStory:     true, // N/A — marked true for non-Biology
  cmf12_csAlgorithmFirst:        true, // N/A — marked true for non-CS
  cmf13_economicsEverydayFirst:  true, // N/A — marked true for non-Economics
  cmf14_threeExplanations:       true,
  cmf15_youngerSiblingTest:      true,
};

export const MATHEMATICS_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "maths-linear-equations-one-variable-class8",
    concept: "Linear Equations in One Variable",
    class:   8,
    board:   "Both",
    subject: "Mathematics",

    whyGoldStandard: `
This lesson is gold standard because it builds the concept of an equation entirely
from the physical intuition of a balance scale before introducing any algebraic notation.
The student understands WHY "doing the same thing to both sides" is not a rule to memorise
but the only logical thing that preserves a balance. Every algebraic step is narrated as
a deliberate act with a clear justification, never as a symbol-pushing procedure.
The misconception that "moving a term to the other side changes its value randomly"
is explicitly named and corrected with a counter-example before the student can make the error.
    `.trim(),

    teachingTechniques: [
      "Balance scale analogy — each side of the scale is one side of the equation; every operation must be done to BOTH sides to keep the balance",
      "WHY-before-HOW sequencing — the concept of 'inverse operation' is introduced as 'undoing what was done', not as a rule",
      "Sign-change narration — every term movement across the equals sign is explained as subtraction/addition from both sides, never as a teleportation rule",
      "Misconception inoculation — 'transposing with sign change' is shown to be a shortcut for a full two-step operation, eliminating the mystery behind it",
      "Verification step — substituting the answer back into the original equation is taught as the only way to be certain, not optional",
      "Friendly-number worked example first — solve 2x + 3 = 11 before anything with fractions or negatives",
    ],

    expectedQualityCharacteristics: [
      "Opens with a real-world puzzle (e.g. 'a bag has some marbles; adding 3 more gives 11 total — how many were there?') before showing any algebraic notation",
      "Defines 'variable', 'equation', 'solution', and 'linear' in plain English before using the terms mathematically",
      "Shows the balance scale picture in words: 'imagine both sides sitting on a perfectly balanced scale'",
      "Narrates every algebraic step: 'We subtract 3 from both sides. Left side: 2x + 3 − 3 = 2x. Right side: 11 − 3 = 8. So 2x = 8.'",
      "Names the misconception: 'Students often write 2x + 3 = 11 and then somehow write 2x = 11 + 3 = 14. This is wrong. We do NOT add when we move to the other side.'",
      "Explains transposition as a two-step shortcut: 'Moving +3 to the other side as −3 is just a faster way of subtracting 3 from both sides at once'",
      "Includes a verification step: 'Let's check: 2(4) + 3 = 8 + 3 = 11. ✓ The equation holds.'",
      "Provides three explanations for the concept of inverse operations: visual (balance scale), logical (undoing the operation), real-life (unwrapping a parcel reverses the wrapping)",
    ],

    commonNonGoldFailures: [
      "Opens with 'An equation is a mathematical statement that two expressions are equal' — definition before WHY",
      "Shows '2x + 3 = 11 → 2x = 11 − 3 = 8' without explaining why the +3 becomes −3",
      "Uses the word 'transpose' without explaining what it means or why it works",
      "Skips the verification step as 'optional' or omits it entirely",
      "Does not name the sign-change misconception before the student makes it",
      "Combines 'subtract 3 and divide by 2' into one unexplained line",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — What problem does an equation solve?",
        mustContain: [
          "A concrete puzzle framed in plain English before any algebraic notation",
          "The idea that we want to find an unknown quantity — a number we don't know yet",
          "The intuition that an equation is a statement of balance between two things",
        ],
        typicalFailures: [
          "Opening with a formal definition",
          "Introducing x without first establishing what an unknown is",
        ],
      },
      {
        name: "Building Intuition — The Balance Scale",
        mustContain: [
          "The balance scale model described in words: equal weight on both sides",
          "The key insight: any operation that treats both sides equally keeps the balance",
          "The consequence: to isolate x, we must undo what was done to x",
        ],
        typicalFailures: [
          "Skipping the balance metaphor and going straight to 'rules for solving'",
          "Stating 'do the same to both sides' as a rule without explaining why",
        ],
      },
      {
        name: "First Worked Example — Small, Friendly Numbers",
        mustContain: [
          "Equation with small positive numbers (e.g. 2x + 3 = 11)",
          "Every algebraic step on its own line with narration",
          "Every arithmetic computation written out (8 ÷ 2 = 4, not skipped)",
          "Verification by substitution",
        ],
        typicalFailures: [
          "Combining subtraction and division into one step",
          "Omitting verification",
          "Using fractions or negatives in the first example",
        ],
      },
      {
        name: "Misconception Inoculation",
        mustContain: [
          "Naming the sign-change error explicitly: '+3 does NOT become +3 on the other side'",
          "Showing a wrong solution and explaining exactly where the error is",
          "Explaining transposition as a shorthand, not a magic rule",
        ],
        typicalFailures: [
          "Not naming the misconception at all",
          "Mentioning 'transpose' without grounding it in the two-step operation",
        ],
      },
      {
        name: "Second Example — Negative or Fractional Coefficients",
        mustContain: [
          "An example requiring division by a negative or fraction",
          "Explicit narration of every step including sign changes",
          "Re-verification by substitution",
        ],
        typicalFailures: [
          "Skipping verification on the second example",
          "Rushing through steps now that 'the student knows the method'",
        ],
      },
      {
        name: "Three Explanations for Inverse Operations",
        mustContain: [
          "Visual: balance scale — undoing the weight on one side requires matching on the other",
          "Logical: addition and subtraction are inverse operations; one undoes the other",
          "Real-life: unlocking a door reverses the locking; unwrapping a gift reverses the wrapping",
        ],
        typicalFailures: [
          "Providing only one type of explanation",
          "Leaving 'inverse operation' as an unexplained term",
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "maths-pythagoras-theorem-class8",
    concept: "Pythagoras' Theorem",
    class:   8,
    board:   "Both",
    subject: "Mathematics",

    whyGoldStandard: `
This lesson is gold standard because the theorem is never stated before the student
has seen WHY it should be true through a geometric area argument. The famous
'square on each side' proof is built visually — in words — so the student sees that
a² + b² = c² is not an arbitrary rule but an inevitable consequence of how squares
tile around a right triangle. The lesson pre-empts the three most common errors:
using the theorem on non-right triangles, confusing the hypotenuse with an ordinary side,
and forgetting to take the square root at the end. The Younger Sibling Test is embedded
naturally in the closing section.
    `.trim(),

    teachingTechniques: [
      "Area-based visual proof — the sum of areas of squares on the two shorter sides equals the area of the square on the hypotenuse",
      "Hypotenuse identification ritual — always identify and label all three sides before writing any equation",
      "Specific-numbers verification — show the theorem holds for (3, 4, 5) before using it generally",
      "Square-root narration — 'we take the square root of both sides because we want the side length, not the area'",
      "Non-right triangle counter-example — show the theorem fails for a 4-5-7 triangle to build conditional understanding",
      "Converse inoculation — distinguish 'theorem' from 'converse' early to prevent over-application",
    ],

    expectedQualityCharacteristics: [
      "Opens with the question: 'Is there a relationship between the sizes of squares drawn on the sides of a triangle?' — curiosity before answer",
      "Builds the geometric proof in words: 'Draw a square outward on each side. The area of the square on AB plus the area of the square on BC equals the area of the square on AC — but ONLY when the angle at B is exactly 90°.'",
      "Verifies with (3, 4, 5): '9 + 16 = 25. ✓ The theorem holds.'",
      "Explicitly labels which side is the hypotenuse before every worked example",
      "Names the three most common errors before the practice section",
      "Explains the square root step: 'c² = 25 means c = √25 = 5 — we square-root because we want the length, which is c, not the area, which is c²'",
      "Closes with: 'Can you explain to a younger sibling why a² + b² = c² and not, say, a + b = c?'",
    ],

    commonNonGoldFailures: [
      "Stating 'In a right-angled triangle, a² + b² = c²' as the opening line without any WHY",
      "Never explaining which side is the hypotenuse and why it must be c",
      "Skipping the square root step explanation: 'c² = 100, so c = 10' with no narration",
      "Not showing that the theorem fails for non-right triangles",
      "Omitting the area-based intuition for why the theorem is true",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — The Ancient Puzzle",
        mustContain: [
          "The historical question: surveyors and builders needed right angles — how did they check?",
          "The 3-4-5 rope trick as a physical observation that precedes the theorem",
          "The question: 'Is there a pattern between 3, 4, and 5 that always gives a right angle?'",
        ],
        typicalFailures: ["Opening with the theorem statement", "No historical or practical context"],
      },
      {
        name: "Building Intuition — The Square Areas",
        mustContain: [
          "Described geometric picture: squares drawn outward on all three sides of a right triangle",
          "The observation: area of small square + area of medium square = area of large square",
          "Verification with the 3-4-5 case: 9 + 16 = 25",
        ],
        typicalFailures: ["Skipping the geometric intuition", "Jumping to the formula without the area argument"],
      },
      {
        name: "Formal Statement",
        mustContain: [
          "Definition of hypotenuse: 'the longest side, always opposite the right angle'",
          "The theorem stated after the intuition is built: a² + b² = c²",
          "Clear notation: 'c is always the hypotenuse; a and b are the two shorter sides'",
        ],
        typicalFailures: ["Using the theorem before defining hypotenuse", "Ambiguous labelling of sides"],
      },
      {
        name: "Worked Examples",
        mustContain: [
          "Example 1: finding the hypotenuse (add the squares, then square-root)",
          "Example 2: finding a shorter side (subtract, then square-root)",
          "Every arithmetic step written out; every square root step narrated",
        ],
        typicalFailures: ["Combining squaring and adding into one unexplained step", "Omitting the square root narration"],
      },
      {
        name: "Misconception Inoculation",
        mustContain: [
          "Error 1: forgetting to take the square root — 'c² = 100 does NOT mean c = 100'",
          "Error 2: applying the theorem to a non-right triangle — show it fails",
          "Error 3: treating any side as the hypotenuse — 'only the side opposite the right angle is c'",
        ],
        typicalFailures: ["Not naming any of these errors before the practice section"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "maths-fractions-division-class6",
    concept: "Division of Fractions",
    class:   6,
    board:   "Both",
    subject: "Mathematics",

    whyGoldStandard: `
This lesson is gold standard because the deeply counterintuitive rule 'invert and multiply'
is never stated without first showing WHY it must be true through a concrete sharing story.
The student sees that dividing by a fraction is asking 'how many of this fraction fit into that amount?'
— a question with an obvious physical answer that the algorithm then formalises.
The lesson never uses the phrase 'Keep-Change-Flip' as a meaningless mnemonic; instead,
the reciprocal is introduced as 'the number that undoes the fraction', derived from the
definition of multiplication as the inverse of division.
    `.trim(),

    teachingTechniques: [
      "Concrete sharing story — 'You have 3 pizzas. Each portion is ¾ of a pizza. How many portions can you make?' leads directly to the algorithm",
      "Reciprocal as 'undoer' — the reciprocal of ¾ is 4/3 because ¾ × 4/3 = 1 (they undo each other)",
      "Measurement model of division — 'how many times does the divisor fit into the dividend?'",
      "Arrow diagram — show ÷(3/4) = ×(4/3) as a two-step derivation, not a rule",
      "Verification with whole-number division — 6 ÷ 2 = 3 and 6 × (1/2) = 3 confirms the pattern",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'If you have 3 pizzas and each serving is ¾ of a pizza, how many servings do you have? Think about it before reading on.'",
      "Counts physically: 'One serving of ¾. Two servings of ¾ (= 1½). Three servings of ¾ (= 2¼). Four servings of ¾ (= 3). Answer: 4 servings.'",
      "Derives the algorithm: '3 ÷ ¾ = 4. Also, 3 × 4/3 = 12/3 = 4. Interesting — dividing by ¾ gave the same answer as multiplying by 4/3.'",
      "Explains the reciprocal: '4/3 is the reciprocal of ¾ because ¾ × 4/3 = 12/12 = 1. Reciprocals multiply to 1 — they undo each other.'",
      "States the rule only after the derivation: 'So: a ÷ (b/c) = a × (c/b). We invert because the inverted fraction undoes the original.'",
      "Names the most common error: 'Never invert the FIRST fraction. Only invert the one you are dividing BY.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'To divide fractions, Keep-Change-Flip' — mnemonic before understanding",
      "Not explaining what a reciprocal is or why inverting works",
      "Not connecting division of fractions to a physical situation",
      "Never showing that the rule works for whole numbers too (6 ÷ 2 = 6 × ½)",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — A Sharing Problem",
        mustContain: [
          "A concrete scenario requiring division by a fraction (pizza, rope, water)",
          "Physical counting of how many fractional portions fit into the whole",
          "The numerical answer arrived at intuitively before any formula",
        ],
        typicalFailures: ["Jumping straight to the algorithm"],
      },
      {
        name: "The Pattern",
        mustContain: [
          "Noticing that dividing by ¾ gave the same answer as multiplying by 4/3",
          "Testing the pattern with one more example to confirm it isn't a coincidence",
          "Connecting to whole-number division: 6 ÷ 2 = 6 × ½",
        ],
        typicalFailures: ["Stating the rule without showing the pattern first"],
      },
      {
        name: "The Reciprocal",
        mustContain: [
          "Definition: two numbers are reciprocals if they multiply to 1",
          "Show ¾ × 4/3 = 12/12 = 1",
          "Explain: 'the reciprocal undoes the fraction — just as subtraction undoes addition'",
        ],
        typicalFailures: ["Using 'reciprocal' without defining it", "Not connecting it to the concept of undoing"],
      },
      {
        name: "The Rule — Stated Last",
        mustContain: [
          "The algorithm stated as the inevitable summary of what was just discovered",
          "Clear notation: invert the DIVISOR (the second fraction), not the dividend",
        ],
        typicalFailures: ["Stating the rule before the derivation", "Not specifying which fraction to invert"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "maths-quadratic-equations-class9",
    concept: "Solving Quadratic Equations by Factorisation",
    class:   9,
    board:   "Both",
    subject: "Mathematics",

    whyGoldStandard: `
This lesson is gold standard because it establishes WHY quadratic equations arise naturally
(area problems, projectile paths, number puzzles) before introducing the word 'quadratic'.
The zero-product property — the entire logical engine of factorisation — is proven from
first principles using a simple numerical argument ('if two numbers multiply to zero,
at least one must be zero') rather than stated as a rule. Every factorisation step is narrated
as a search for two numbers with a specific sum and product, turning the process from
mysterious symbol manipulation into a logical puzzle with a clear goal.
    `.trim(),

    teachingTechniques: [
      "Area problem origin — 'A rectangle's area is 12 and its length is 3 more than its width. Find the dimensions.' leads naturally to x(x+3) = 12",
      "Zero-product property proof — if a × b = 0, then a = 0 or b = 0, because any non-zero number times another non-zero number is non-zero",
      "Sum-product search narration — 'We need two numbers that add to [middle coefficient] and multiply to [product term]. Let's search systematically.'",
      "Both roots narration — 'Setting each factor to zero gives two separate equations, each with one solution. Both solutions are valid.'",
      "Verification of both roots — substitute each root back to confirm the original equation holds",
      "Geometric interpretation — x represents a length; both roots must be checked for physical validity (negative lengths rejected)",
    ],

    expectedQualityCharacteristics: [
      "Opens with an area or number puzzle that leads to an equation of the form x² + bx + c = 0",
      "Defines 'quadratic' etymologically: 'from the Latin quadratus, meaning square — because the highest power of x is 2, connected to area'",
      "Proves the zero-product property with a numerical argument before using it",
      "Narrates the sum-product search: 'We need two numbers that add to −5 and multiply to 6. Let's try: −2 and −3? −2 + −3 = −5 ✓, −2 × −3 = 6 ✓. Found them.'",
      "Writes (x − 2)(x − 3) = 0 and then explains: 'This product is zero. So either (x − 2) = 0 or (x − 3) = 0.'",
      "Names the most common error: 'Students write x² − 5x + 6 = 0 → x(x − 5) = −6 and then divide both sides by x. This is wrong — you cannot divide by a variable that might be zero.'",
      "Verifies BOTH roots by substitution into the original equation",
    ],

    commonNonGoldFailures: [
      "Stating 'To factorise x² + bx + c, find two numbers that add to b and multiply to c' without explaining why this works",
      "Not proving the zero-product property — just asserting 'if (x−a)(x−b)=0 then x=a or x=b'",
      "Finding one root and stopping without explaining that a quadratic has two roots",
      "Not verifying either root by substitution",
      "Not naming the 'divide by x' error which is extremely common",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — Where Do Quadratics Come From?",
        mustContain: [
          "A real-world scenario that produces an equation with x² naturally (area, projectile, number puzzle)",
          "The observation that linear equations cannot model this — we need something new",
          "The term 'quadratic' introduced with its meaning (related to square/area)",
        ],
        typicalFailures: ["Starting with the abstract form ax² + bx + c = 0 without motivation"],
      },
      {
        name: "The Zero-Product Property",
        mustContain: [
          "Proof by numerical argument: if 3 × ? = 0, then ? = 0; so if a × b = 0, a = 0 or b = 0",
          "Why this is the key: 'We will rewrite our equation so one side is zero and the other is a product'",
          "The strategy: 'move everything to one side, then factorise into two brackets'",
        ],
        typicalFailures: ["Stating the property without proving it", "Jumping to factorisation without establishing the strategic goal"],
      },
      {
        name: "Factorisation — The Sum-Product Search",
        mustContain: [
          "Explaining WHY we look for two numbers with a specific sum and product",
          "Systematic search narrated step by step",
          "The factorisation written and checked by expansion",
        ],
        typicalFailures: ["Giving the two numbers without showing the search process", "Not verifying by expanding back"],
      },
      {
        name: "Solving — Setting Each Factor to Zero",
        mustContain: [
          "Applying zero-product property: two separate equations",
          "Solving each to get two roots",
          "Verifying both roots by substitution",
        ],
        typicalFailures: ["Finding one root and stopping", "Omitting verification"],
      },
      {
        name: "Misconception Block",
        mustContain: [
          "The 'divide by x' error explained with a counter-example",
          "The 'move to right side instead of left' error: must equal zero",
          "The 'only one root' error: quadratics always have two (possibly equal) roots",
        ],
        typicalFailures: ["Not naming any of these errors"],
      },
    ],
  },
];
