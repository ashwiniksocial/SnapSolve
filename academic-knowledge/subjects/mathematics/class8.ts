/**
 * Academic Knowledge — Mathematics, Class 8 (key chapters)
 * All 20 metadata fields per chapter.
 * Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

function ch(chapterId: string, chapterName: string, data: Omit<ChapterKnowledge, "chapterId"|"chapterName"|"classNum"|"subject"|"board">): ChapterKnowledge {
  return { chapterId, chapterName, classNum: 8, subject: "Mathematics", board: "Both", ...data };
}

export const RATIONAL_NUMBERS_CLASS8 = ch("ch01", "Rational Numbers", {
  learningObjectives: [
    { statement: "Apply properties of rational numbers (closure, commutativity, associativity, distributivity) to calculations", bloomsLevel: "apply", assessable: true },
    { statement: "Represent rational numbers on the number line", bloomsLevel: "apply", assessable: true },
    { statement: "Find rational numbers between any two rational numbers", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: between any two distinct rational numbers there are infinitely many rational numbers. Prove this using the mean method." },
    { ruleCode: "NEP-REFL", application: "Reflect: do rational numbers 'fill' the number line? What gaps remain? (Preview of irrationals for Class 9)" },
  ],
  cbseOutcomes: ["Student applies all four properties to rational number operations", "Student represents rationals on number line", "Student finds rational numbers between two given rationals"],
  icseOutcomes: [],
  coreConcepts: ["Rational numbers = p/q where p, q ∈ ℤ and q ≠ 0; includes all integers, fractions, and terminating/recurring decimals", "All four algebraic properties hold for rational numbers under addition and multiplication", "The rational number line is dense: between any two rationals, infinitely many rationals exist", "Additive inverse of p/q is −p/q; multiplicative inverse is q/p (p ≠ 0)"],
  subtopics: [
    { id: "t1", name: "Properties of Rational Numbers", coreConcept: "Rational numbers extend the property system from integers; all four properties hold under addition and multiplication", keyIdea: "Key extension: every non-zero rational has a multiplicative inverse (unlike integers, where only ±1 have inverses)", estimatedPeriods: 3 },
    { id: "t2", name: "Rational Numbers on Number Line", coreConcept: "Every rational number corresponds to exactly one point on the number line; the line is densely populated", keyIdea: "To place p/q: divide the unit segment into q equal parts, count p from 0", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:7:ch09:rational-addition", to: "mth:8:ch01:rational-commutativity", relationship: "generalises", explanation: "Class 7 introduced rational operations; Class 8 establishes the property structure" },
    { from: "mth:8:ch01:density-of-rationals", to: "mth:9:ch01:irrational-definition", relationship: "contradicts-intuition", explanation: "Despite density, the rational line has gaps (irrationals) — surprising to students who think density means completeness" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 7, chapterId: "ch09", chapterName: "Rational Numbers", requiredConcepts: ["mth:7:ch09:rational-addition"] }], concepts: ["mth:7:ch09:rational-on-number-line"] },
  essentialDefinitions: [
    { term: "Rational Number", formalDefinition: "A number of the form p/q where p and q are integers and q ≠ 0", informalExplanation: "Any number expressible as a fraction with integer numerator and non-zero integer denominator" },
    { term: "Additive Inverse", formalDefinition: "For rational number p/q, its additive inverse is −p/q; their sum = 0", informalExplanation: "The number you add to get zero — the negative version: additive inverse of 3/4 is −3/4" },
    { term: "Multiplicative Inverse (Reciprocal)", formalDefinition: "For non-zero rational p/q, its multiplicative inverse is q/p; their product = 1", informalExplanation: "The number you multiply by to get 1 — flip the fraction: multiplicative inverse of 2/3 is 3/2" },
    { term: "Density Property", formalDefinition: "Between any two distinct rational numbers, there exists at least one (and infinitely many) rational numbers", informalExplanation: "No two rational numbers are 'neighbours' — there's always another rational between them" },
  ],
  formulaInventory: [{ name: "Mean of Two Rationals", latex: "\\frac{p_1/q_1 + p_2/q_2}{2}", plainText: "(r₁ + r₂)/2", variables: [], applicableWhen: "Finding a rational number between r₁ and r₂; the mean is always between them", doesNotApplyWhen: "Only gives one rational; repeat to find more" }],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "There are no numbers between 1/3 and 1/2", correction: "Between any two rationals there are infinitely many. Example: (1/3 + 1/2)/2 = 5/12 is between 1/3 and 1/2.", whyItHappens: "Students think fractions are 'separated' like integers", revealingQuestion: "Find three rational numbers between 1/4 and 1/3." },
  ],
  examinerTraps: [{ trap: "Dividing by rational: multiplying by the number rather than the reciprocal", typicalScenario: "Divide 3/4 by 2/3: student writes 3/4 × 2/3 = 1/2 (wrong) instead of 3/4 × 3/2 = 9/8", avoidanceStrategy: "Division by p/q: multiply by its RECIPROCAL q/p. Flip the divisor.", marksAtRisk: "Full marks" }],
  typicalMistakes: [{ mistake: "Stating rational numbers are closed under subtraction but not division", correction: "Rationals are closed under subtraction (always rational). NOT closed under division (dividing by 0 is undefined, so closure fails).", conceptualError: "Not considering the zero denominator exception for division" }],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "evaluate"], hotsStarters: ["Prove that between any two distinct rational numbers there are infinitely many rationals."] }],
  difficultyProgression: [
    { step: 1, concept: "Review: rational number definition, operations from Class 7", tier: "foundational", teachingNote: "Quick review — focus on what is new at Class 8" },
    { step: 2, concept: "All four properties under addition and multiplication — verify and state", tier: "medium", dependsOnStep: 1, teachingNote: "Contrast with integers: integers have no multiplicative inverse for most numbers" },
    { step: 3, concept: "Rational numbers on number line: systematic placement", tier: "medium", dependsOnStep: 1, teachingNote: "Place 3/7 on number line: divide unit into 7 parts, mark 3rd" },
    { step: 4, concept: "Density: find rationals between two given rationals", tier: "hard", dependsOnStep: 3, teachingNote: "Mean method: average of the two gives a number between them. Repeat for more." },
  ],
  realLifeApplications: [{ context: "Precision in measurement: between 2.3 cm and 2.4 cm", conceptUsed: "Density of rational numbers", explanation: "A measurement of 2.35 cm is between 2.3 and 2.4 — density shows that any interval contains more precise measurements", ageRelevance: "Scientific and engineering precision" }],
  crossChapterLinks: [{ subject: "Mathematics", classNum: 9, chapterId: "ch01", chapterName: "Number Systems", linkType: "prerequisite-for", description: "Class 9 extends to irrationals; Class 8 rational number density is the contrast point" }],
  crossSubjectLinks: [{ subject: "Chemistry", topic: "Molar ratios in chemical formulae", description: "Ratios in chemical formulas are rational numbers; the same p/q structure applies", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Properties: construct examples to test each property; fill in a table", duration: "15 minutes", pedagogyNote: "Test before stating — inductive approach" },
    { step: 2, action: "Number line: place 5 rational numbers; estimate position before computing", duration: "15 minutes", pedagogyNote: "Estimation before exact placement — builds intuition" },
    { step: 3, action: "Density: find 3 rationals between 1/2 and 2/3 using different methods", duration: "20 minutes", pedagogyNote: "Multiple methods: mean, equivalent fractions with large denominators" },
  ],
});

export const LINEAR_EQUATIONS_CLASS8 = ch("ch02", "Linear Equations in One Variable", {
  learningObjectives: [
    { statement: "Solve linear equations with the variable on both sides", bloomsLevel: "apply", assessable: true },
    { statement: "Solve equations involving fractions; clear fractions using LCM", bloomsLevel: "apply", assessable: true },
    { statement: "Model and solve problems from geometry and arithmetic sequences using equations", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Two trains leave opposite stations. Equation models when they meet — apply without being told which variable to use" },
    { ruleCode: "NEP-HOT", application: "If 3x + 5 = 5x − 3, what does a graph of y = 3x+5 and y = 5x−3 tell us about the solution?" },
  ],
  cbseOutcomes: ["Student solves equations with variables on both sides", "Student clears fractions by multiplying through by LCM", "Student models word problems from geometry, number, and age categories using equations"],
  icseOutcomes: [],
  coreConcepts: ["When the variable appears on both sides, collect all variable terms on one side and constants on the other", "Equations with fractions: multiply every term by LCM of all denominators to clear fractions first", "The solution of a linear equation is always unique (one value of x)", "Many word problem categories reduce to linear equations: number problems, age problems, distance problems"],
  subtopics: [
    { id: "t1", name: "Equations with Variable on Both Sides", coreConcept: "Move all variable terms to one side, all constants to the other, then solve", keyIdea: "3x+5 = x+9 → 3x−x = 9−5 → 2x = 4 → x = 2", estimatedPeriods: 2 },
    { id: "t2", name: "Equations with Fractions", coreConcept: "Multiply through by LCM to clear all denominators, then solve", keyIdea: "x/2 + x/3 = 5 → multiply by 6: 3x + 2x = 30 → 5x = 30 → x = 6", estimatedPeriods: 3 },
    { id: "t3", name: "Word Problems", coreConcept: "Translate the real situation to an equation; solve; interpret the solution in context", keyIdea: "Let x = the unknown; write two expressions that must be equal; solve", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:7:ch04:transposition", to: "mth:8:ch02:variable-both-sides", relationship: "applies", explanation: "Variable-on-both-sides equations use transposition to collect variable terms on one side" },
    { from: "mth:8:ch02:linear-equations", to: "mth:9:ch04:linear-equations-two-variables", relationship: "generalises", explanation: "Two-variable linear equations extend the single-variable case" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 7, chapterId: "ch04", chapterName: "Simple Equations", requiredConcepts: ["mth:7:ch04:transposition"] }], concepts: ["mth:7:ch04:equation-solution"] },
  essentialDefinitions: [
    { term: "Linear Equation in One Variable", formalDefinition: "An equation of the form ax + b = 0 (or equivalent), where a ≠ 0 and x is the variable; has a unique solution", informalExplanation: "An equation with one unknown and no x² or higher — always has exactly one solution" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Multiplying by LCM can change the sign of a fraction", correction: "Multiplying through by LCM clears the denominator but preserves sign. (x/2) × 6 = 3x, not −3x. Each term is multiplied by the positive LCM.", whyItHappens: "Students confuse LCM multiplication with transposing fractions", revealingQuestion: "Clear fractions in: x/3 − x/4 = 1 by multiplying by 12. What does each term become?" },
  ],
  examinerTraps: [{ trap: "Collecting constant terms but not all variable terms on one side", typicalScenario: "2x+5=x+9: student writes 2x=x+4 (collects constant but not x) → gets 2x−x=4 in next step anyway but loses a step mark", avoidanceStrategy: "Collect ALL variable terms on LEFT and ALL constants on RIGHT in a single step: (2x−x) = (9−5) → x = 4", marksAtRisk: "½ mark for incomplete collection in one step" }],
  typicalMistakes: [{ mistake: "For equations with fractional coefficients: x/2 + x/3 = 5 → (x+x)/(2+3) = 5 → 2x/5 = 5", correction: "Never add fractions by adding denominators. Multiply through by LCM(2,3)=6 first: 3x+2x=30 → 5x=30 → x=6.", conceptualError: "Adding fractions incorrectly (same error as Class 6 fraction misconception)" }],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["The sum of the digits of a 2-digit number is 7. When the digits are reversed, the new number is 27 more. Find the original number."] }],
  difficultyProgression: [
    { step: 1, concept: "Variable on both sides: collect; solve", tier: "medium", teachingNote: "Start with integer coefficients; verify solution by substitution" },
    { step: 2, concept: "Fractional equations: clear with LCM first", tier: "hard", dependsOnStep: 1, teachingNote: "Find LCM of all denominators; multiply every term; then solve" },
    { step: 3, concept: "Word problems: number, age, geometry", tier: "hard", dependsOnStep: 1, teachingNote: "Classification: what is unknown? Write the equation. Solve. Check in context." },
  ],
  realLifeApplications: [{ context: "Age problems: finding ages from relationships", conceptUsed: "Linear equation with variable on both sides", explanation: "Priya's age is 3 more than twice Ravi's. Sum of ages is 27. → 2x+3+x=27 → x=8. Ravi: 8, Priya: 19.", ageRelevance: "Age puzzles are familiar and engaging" }],
  crossChapterLinks: [{ subject: "Mathematics", classNum: 9, chapterId: "ch04", chapterName: "Linear Equations in Two Variables", linkType: "prerequisite-for", description: "Two-variable equations require solving the single-variable case as a subproblem" }],
  crossSubjectLinks: [{ subject: "Physics", topic: "Finding unknowns in kinematic equations", description: "v=u+at with three knowns becomes a linear equation in one variable (the fourth)", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Equations with variable on both sides: 5 examples with verification", duration: "20 minutes", pedagogyNote: "Always verify: substitute back and check LHS = RHS" },
    { step: 2, action: "Fractional equations: LCM multiplication; 5 examples", duration: "20 minutes", pedagogyNote: "Write LCM first, then multiply every term by it" },
    { step: 3, action: "Word problems: number, age, geometry — 6 problems in increasing difficulty", duration: "25 minutes", pedagogyNote: "Template: Let x = ___. Write the equation. Solve. Interpret." },
  ],
});

export const SQUARES_AND_SQUARE_ROOTS = ch("ch05", "Squares and Square Roots", {
  learningObjectives: [
    { statement: "Identify perfect squares and their properties (patterns in units digits, etc.)", bloomsLevel: "understand", assessable: true },
    { statement: "Find the square root of perfect squares using prime factorisation", bloomsLevel: "apply", assessable: true },
    { statement: "Find the square root of imperfect squares using the long division method", bloomsLevel: "apply", assessable: true },
    { statement: "Estimate and apply square roots in geometry (diagonal, Pythagoras)", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Estimate √50 without a calculator to within 0.1 by squeezing between 7² and 8²" },
    { ruleCode: "NEP-COMP", application: "Use square root to find the side of a square field with area 2500 m² — land measurement context" },
  ],
  cbseOutcomes: ["Student identifies patterns in perfect squares", "Student finds square roots using prime factorisation", "Student uses long division method for square roots of imperfect squares", "Student applies square root to find sides of square figures"],
  icseOutcomes: [],
  coreConcepts: ["A perfect square is a number whose square root is an integer: 1, 4, 9, 16, 25, ...", "Square root of n = the number m such that m² = n", "Prime factorisation method: group prime factors in pairs; one factor from each pair gives the square root", "Long division method gives square root to any required decimal places", "Units digit of a perfect square can only be 0, 1, 4, 5, 6, or 9 — never 2, 3, 7, or 8"],
  subtopics: [
    { id: "t1", name: "Properties of Perfect Squares", coreConcept: "Patterns in perfect squares: units digits, number of non-perfect-squares between consecutive perfect squares", keyIdea: "Between n² and (n+1)² there are exactly 2n non-perfect-square numbers", estimatedPeriods: 2 },
    { id: "t2", name: "Finding Square Roots: Prime Factorisation", coreConcept: "Group prime factors in pairs; each pair contributes one factor to the square root", keyIdea: "If any prime appears an odd number of times → NOT a perfect square", estimatedPeriods: 2 },
    { id: "t3", name: "Long Division Method", coreConcept: "Systematic digit-by-digit computation of square root", keyIdea: "Group digits in pairs from right; find largest square ≤ each group; bring down next pair", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch03:prime-factorisation", to: "mth:8:ch05:prime-factorisation-square-root", relationship: "applies", explanation: "Prime factorisation from Class 6 is directly used to find square roots" },
    { from: "mth:8:ch05:square-root-estimation", to: "mth:9:ch01:proof-irrationality-sqrt2", relationship: "applies", explanation: "Estimating √2 as between 1 and 2 sets up the argument that it is irrational" },
    { from: "mth:7:ch06:pythagoras-theorem", to: "mth:8:ch05:pythagorean-application", relationship: "applies", explanation: "Pythagoras produces square roots; square root methods from this chapter are used to evaluate them" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch03", chapterName: "Playing with Numbers", requiredConcepts: ["mth:6:ch03:hcf-prime-factorisation"] }], concepts: ["mth:6:ch03:prime-definition"] },
  essentialDefinitions: [
    { term: "Perfect Square", formalDefinition: "A positive integer that is the square of an integer; equivalently, a number whose prime factorisation has all prime factors appearing an even number of times", informalExplanation: "A number you can express as n² for some integer n — like 25 = 5², 49 = 7²" },
    { term: "Square Root", formalDefinition: "The square root of a non-negative number n is the non-negative number m such that m² = n; denoted √n", informalExplanation: "The side length of a square with area n — √n tells you the side given the area" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Every number with units digit 1, 4, 5, 6, 9, 0 is a perfect square", correction: "These are necessary conditions but not sufficient: 21 ends in 1 but is not a perfect square. The condition only rules out: any number ending in 2, 3, 7, or 8 is definitely NOT a perfect square.", whyItHappens: "Students invert the implication", revealingQuestion: "Does a number ending in 4 have to be a perfect square? Is 14 a perfect square?" },
    { misconception: "√(a+b) = √a + √b", correction: "√9 + √16 = 3 + 4 = 7, but √(9+16) = √25 = 5. Square roots do NOT distribute over addition.", whyItHappens: "Over-generalisation from multiplication: √(ab) = √a × √b (which IS true)", revealingQuestion: "Compute √9 + √16. Then compute √(9+16). Are they equal?" },
  ],
  examinerTraps: [{ trap: "Long division: not grouping digits from RIGHT to LEFT", typicalScenario: "For √625: student groups as 6|25 instead of 6|25 (from right) — same here, but for √1225 grouping is 12|25, not 1|225", avoidanceStrategy: "Always group from the RIGHTMOST digit, in pairs of two. For decimals, group from decimal point outward.", marksAtRisk: "Wrong square root from incorrect grouping" }],
  typicalMistakes: [{ mistake: "√(25×16) = √25 × √16 = 5×4 = 20 but student writes √41 = √(25+16)", correction: "√(a×b) = √a × √b. But √(a+b) ≠ √a + √b. The first identity is valid; the second is not.", conceptualError: "Confusing multiplication and addition rules for square roots" }],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Is 360 a perfect square? Find the smallest integer by which 360 must be multiplied to make it a perfect square."] }],
  difficultyProgression: [
    { step: 1, concept: "Perfect squares: list first 20; properties (units digits)", tier: "easy", teachingNote: "Pattern table: n, n², units digit of n², last digit of n²" },
    { step: 2, concept: "Square root by prime factorisation: group in pairs", tier: "medium", dependsOnStep: 1, teachingNote: "√900 = √(2²×3²×5²) = 2×3×5 = 30" },
    { step: 3, concept: "Find smallest multiplier to make a number a perfect square", tier: "hard", dependsOnStep: 2, teachingNote: "Find primes appearing odd number of times; multiply by those primes" },
    { step: 4, concept: "Long division method: step-by-step", tier: "hard", dependsOnStep: 2, teachingNote: "4-step procedure: group, find, subtract, bring down. Practice 3 examples." },
    { step: 5, concept: "Application: find side of square from area; Pythagoras", tier: "medium", dependsOnStep: 2, teachingNote: "Geometry context: square field area 2025 m² → side = √2025 = 45m" },
  ],
  realLifeApplications: [
    { context: "Finding the side of a square field from its area", conceptUsed: "Square root from prime factorisation", explanation: "A farmer knows his square field is 2916 m². What is the side? √2916 = √(2²×3⁶) = 2×3³ = 54m", ageRelevance: "Land measurement is practically important in India" },
    { context: "Diagonal of a square room: √2 × side", conceptUsed: "Square root and Pythagoras", explanation: "Room 7m × 7m: diagonal = √(49+49) = 7√2 ≈ 9.9m. Long division method gives approximate value.", ageRelevance: "Moving furniture; finding if something fits diagonally" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch01", chapterName: "Number Systems", linkType: "prerequisite-for", description: "Square roots of non-perfect-squares are irrational — Class 9 proves this formally" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "RMS velocity in kinetic theory", description: "Root mean square velocity uses the same square root concept: v_rms = √(3RT/M)", strength: "weak" }],
  teachingSequence: [
    { step: 1, action: "List perfect squares 1–400; find patterns in units digits", duration: "10 minutes", pedagogyNote: "Pattern discovery: units digits 0,1,4,5,6,9 only" },
    { step: 2, action: "Prime factorisation square root: 3 examples, increasing difficulty", duration: "20 minutes", pedagogyNote: "Group in pairs; one factor from each pair" },
    { step: 3, action: "Long division method: teach step-by-step; 2 class examples + 2 individual", duration: "30 minutes", pedagogyNote: "Take it slow — this algorithm requires practice" },
    { step: 4, action: "Applications: square field, diagonal problems", duration: "15 minutes", pedagogyNote: "Always interpret the answer in context: 'the side is X metres'" },
  ],
});

export const ALGEBRAIC_EXPRESSIONS_CLASS8 = ch("ch08", "Algebraic Expressions and Identities", {
  learningObjectives: [
    { statement: "Multiply monomials, monomials with polynomials, and two binomials", bloomsLevel: "apply", assessable: true },
    { statement: "State and apply the four standard algebraic identities: (a±b)², (a+b)(a−b), (x+a)(x+b)", bloomsLevel: "apply", assessable: true },
    { statement: "Use identities to evaluate numerical expressions like 101² or 99² mentally", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Evaluate 103 × 97 mentally using the difference of squares identity (a+b)(a−b) = a²−b²" },
    { ruleCode: "NEP-HOT", application: "Prove (a+b)² ≠ a² + b² by geometry: draw a square of side (a+b) and partition it" },
  ],
  cbseOutcomes: ["Student multiplies algebraic expressions correctly", "Student states and applies all four standard identities", "Student uses identities for mental arithmetic and numerical evaluations"],
  icseOutcomes: ["ICSE additionally expects: (a+b+c)² identity"],
  coreConcepts: ["Multiplication: every term of one expression multiplies every term of the other (distributivity applied)", "(a+b)² = a²+2ab+b²: the middle term 2ab is always missed by students who compute a²+b²", "(a−b)² = a²−2ab+b²: the middle term is negative — be careful with sign", "(a+b)(a−b) = a²−b²: the middle terms cancel; used for quick multiplication of conjugate pairs", "Identities are equations TRUE for ALL values of the variables — not specific equations to solve"],
  subtopics: [
    { id: "t1", name: "Multiplying Algebraic Expressions", coreConcept: "Distribute: each term of first expression × each term of second; collect like terms", keyIdea: "FOIL for two binomials: First, Outer, Inner, Last; collect like terms after", estimatedPeriods: 2 },
    { id: "t2", name: "Standard Algebraic Identities", coreConcept: "Four identities are true for ALL values of variables — they are tools, not equations to solve", keyIdea: "Geometric proof: (a+b)² is the area of a square of side (a+b) — partition to see a²+2ab+b²", estimatedPeriods: 3 },
    { id: "t3", name: "Applications of Identities", coreConcept: "Express numerical calculations as algebraic forms; apply identity; evaluate", keyIdea: "101² = (100+1)² = 10000+200+1 = 10201. No calculator needed.", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:8:ch08:identity-a-plus-b-sq", to: "mth:9:ch02:cube-identities", relationship: "generalises", explanation: "Cube identities extend the square-identity technique to degree 3" },
    { from: "mth:8:ch08:identity-diff-of-sq", to: "mth:9:ch01:conjugate-identity", relationship: "applies", explanation: "Rationalisation uses (a+√b)(a−√b) = a²−b — the difference of squares identity with surds" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 7, chapterId: "ch12", chapterName: "Algebraic Expressions", requiredConcepts: ["mth:7:ch12:like-unlike-terms"] }], concepts: ["mth:7:ch12:expression-addition"] },
  essentialDefinitions: [
    { term: "Algebraic Identity", formalDefinition: "An equation that is satisfied by every value of the variables appearing in it", informalExplanation: "Not a problem to solve — a fact that is always true: (a+b)² = a²+2ab+b² works for a=3,b=5 OR a=−2, b=100 OR any values" },
    { term: "Polynomial Multiplication", formalDefinition: "The product of two polynomials: distribute each term of one polynomial across all terms of the other", informalExplanation: "Every term in the first expression multiplies every term in the second — keep track using a table or FOIL" },
  ],
  formulaInventory: [
    { name: "(a+b)² Identity", latex: "(a+b)^2 = a^2 + 2ab + b^2", plainText: "(a+b)² = a² + 2ab + b²", variables: [], applicableWhen: "Squaring any binomial sum", doesNotApplyWhen: "Do not 'square each term separately' — the 2ab term is always present", examTip: "The most commonly missed term: 2ab. (a+b)² ≠ a²+b²" },
    { name: "(a−b)² Identity", latex: "(a-b)^2 = a^2 - 2ab + b^2", plainText: "(a−b)² = a² − 2ab + b²", variables: [], applicableWhen: "Squaring any binomial difference", doesNotApplyWhen: "Middle term is NEGATIVE: −2ab, not +2ab", examTip: "Students often write +2ab — the sign is NEGATIVE for difference" },
    { name: "Difference of Squares", latex: "(a+b)(a-b) = a^2 - b^2", plainText: "(a+b)(a−b) = a² − b²", variables: [], applicableWhen: "Multiplying conjugate pairs", doesNotApplyWhen: "Only for conjugates (same terms, opposite signs)", examTip: "Use for: 103×97 = (100+3)(100−3) = 10000−9 = 9991. Very powerful for mental maths." },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "(a+b)² = a² + b²", correction: "(a+b)² = a²+2ab+b². The 2ab term is always present. (3+4)² = 49, not 9+16=25.", whyItHappens: "Students 'distribute' the square as if it were a linear operation", revealingQuestion: "Compute (3+4)² two ways: by squaring (7)² and by applying the wrong formula a²+b²=9+16. They're different — why?" },
  ],
  examinerTraps: [{ trap: "Applying (a−b)² with a positive middle term", typicalScenario: "Student writes (x−3)² = x²+6x+9 instead of x²−6x+9", avoidanceStrategy: "For (a−b)²: the middle term is −2ab. Write −2×a×b = −2×x×3 = −6x. Never +6x.", marksAtRisk: "2 marks typically" }],
  typicalMistakes: [{ mistake: "102 × 98 = (100+2)(100+2) instead of (100+2)(100−2)", correction: "102 = 100+2, but 98 = 100−2 (not 100+2). This is a CONJUGATE pair: (100+2)(100−2) = 100²−4 = 9996.", conceptualError: "Not recognising that 98 is 100−2, not 100+2" }],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Evaluate 998² without a calculator using an identity.", "Prove that (a+b)² − (a−b)² = 4ab."] }],
  difficultyProgression: [
    { step: 1, concept: "Multiplying a monomial by a polynomial", tier: "easy", teachingNote: "Distributivity: each term of the polynomial multiplied by the monomial" },
    { step: 2, concept: "Multiplying two binomials using FOIL", tier: "medium", dependsOnStep: 1, teachingNote: "Four products; collect like terms" },
    { step: 3, concept: "(a+b)² and (a−b)² identities: derive geometrically", tier: "medium", dependsOnStep: 2, teachingNote: "Geometric proof: square of side (a+b) partitioned into four regions" },
    { step: 4, concept: "(a+b)(a−b) = a²−b²: why middle terms cancel", tier: "medium", dependsOnStep: 2, teachingNote: "Expand by FOIL; show the ±ab terms cancel" },
    { step: 5, concept: "Numerical applications: 101², 99², 103×97", tier: "medium", dependsOnStep: 3, teachingNote: "Express as (100±something)²; apply identity" },
  ],
  realLifeApplications: [
    { context: "Mental multiplication: 105 × 95 = (100+5)(100−5) = 10000−25 = 9975", conceptUsed: "Difference of squares identity", explanation: "Conjugate multiplication is a mental maths superpower: any two numbers equidistant from a round number can be multiplied this way.", ageRelevance: "Competitive exam preparation; NTSE and Olympiad contexts" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch02", chapterName: "Polynomials", linkType: "prerequisite-for", description: "Cube identities in Class 9 extend the square identities; factorisation uses these identities" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Quadratic equations in kinematics", description: "s = ut + ½at² is a polynomial in t; expanding and collecting like terms uses the same algebra", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Multiplication of expressions: FOIL demonstration with concrete numbers first", duration: "15 minutes", pedagogyNote: "Check: (x+2)(x+3) using FOIL; verify by substituting x=4" },
    { step: 2, action: "Derive (a+b)² geometrically: draw the square, partition, find areas", duration: "20 minutes", pedagogyNote: "NEP-HOT: 'Why is (a+b)² NOT a²+b²?' The diagram answers this." },
    { step: 3, action: "All four identities: state, verify numerically, apply", duration: "20 minutes", pedagogyNote: "Quick verification: check each identity with a=3, b=4" },
    { step: 4, action: "Mental maths applications: 5 examples", duration: "15 minutes", pedagogyNote: "NEP-COMP: show that knowing identities is a practical superpower" },
  ],
});

export const FACTORISATION_CLASS8 = ch("ch13", "Factorisation", {
  learningObjectives: [
    { statement: "Factorise expressions using common factor method and grouping", bloomsLevel: "apply", assessable: true },
    { statement: "Factorise using standard algebraic identities (a²−b², (a±b)²)", bloomsLevel: "apply", assessable: true },
    { statement: "Divide a polynomial by a monomial and by a polynomial", bloomsLevel: "apply", assessable: true },
    { statement: "Find and correct errors in polynomial factorisation", bloomsLevel: "evaluate", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Error analysis: a student factorised 4x² − 16 as 4(x−2)(x+4). Find and correct the error." },
    { ruleCode: "NEP-COMP", application: "Simplify a rational algebraic expression by factorising numerator and denominator, then cancelling common factors" },
  ],
  cbseOutcomes: ["Student factorises using common factor, grouping, and identity methods", "Student performs polynomial division", "Student identifies and corrects errors in given factorisations"],
  icseOutcomes: [],
  coreConcepts: ["Factorisation is the reverse of expansion — every expansion can be factorised", "Common factor: find HCF of all terms; divide each term by HCF; write as product", "Grouping: when no common factor for all terms, split into groups with common factors", "Identity-based factorisation: recognise the pattern (a²−b², perfect square trinomial); apply the reverse identity"],
  subtopics: [
    { id: "t1", name: "Factorisation by Common Factor", coreConcept: "Find the HCF of all terms; express as HCF × (remaining expression)", keyIdea: "12x²y + 18xy² = 6xy(2x + 3y). HCF of 12x²y and 18xy² is 6xy.", estimatedPeriods: 2 },
    { id: "t2", name: "Factorisation by Grouping", coreConcept: "Group terms in pairs; find common factor for each group; extract common binomial", keyIdea: "a(x+y) + b(x+y) = (x+y)(a+b) — the common binomial is the factor", estimatedPeriods: 2 },
    { id: "t3", name: "Factorisation Using Identities", coreConcept: "Recognise a²−b² → (a+b)(a−b); perfect square → (a±b)²; apply identity in reverse", keyIdea: "Pattern recognition: the key skill. 25x²−16 = (5x)²−4² → (5x+4)(5x−4)", estimatedPeriods: 2 },
    { id: "t4", name: "Division of Polynomials", coreConcept: "Polynomial ÷ monomial: divide each term separately. Polynomial ÷ polynomial: factorise and cancel.", keyIdea: "(6x²+3x) ÷ 3x = 2x+1. The division should leave no remainder if done correctly.", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:8:ch08:identity-diff-of-sq", to: "mth:8:ch13:factorisation-by-identity", relationship: "applies", explanation: "Identities from Chapter 8 are applied in reverse for factorisation in Chapter 13" },
    { from: "mth:8:ch13:common-factor-method", to: "mth:9:ch02:factorisation-by-factor-theorem", relationship: "applies", explanation: "Class 9 factorisation uses Factor Theorem to find linear factors, then divides — extends the Class 8 approach" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 8, chapterId: "ch08", chapterName: "Algebraic Expressions and Identities", requiredConcepts: ["mth:8:ch08:identity-diff-of-sq", "mth:8:ch08:identity-a-plus-b-sq"] }], concepts: ["mth:8:ch08:monomial-polynomial-multiplication"] },
  essentialDefinitions: [
    { term: "Factorisation", formalDefinition: "The process of expressing a polynomial as a product of its factors; the reverse of expansion", informalExplanation: "Breaking apart an expression into simpler pieces that multiply to give the original: 12 = 3×4, or x²−9 = (x+3)(x−3)" },
    { term: "HCF of a Polynomial", formalDefinition: "The highest common factor of all the terms of a polynomial; the largest expression that divides all terms exactly", informalExplanation: "For 12x²y + 18xy²: HCF = 6xy (divides both 12x²y and 18xy² exactly)" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "a² − b² = (a−b)²", correction: "a²−b² = (a+b)(a−b) — the difference of squares. (a−b)² = a²−2ab+b² — the square of a difference. These are completely different.", whyItHappens: "Both involve a² and b² with a minus; students apply the wrong identity", revealingQuestion: "Factorise: x²−25. Now expand (x−5)². Are they the same?" },
  ],
  examinerTraps: [{ trap: "Incomplete factorisation: stopping before all factors are prime/irreducible", typicalScenario: "4x²−16 = 4(x²−4) — student stops here without factorising x²−4 further", avoidanceStrategy: "Always check: can any factor be factorised further? x²−4 = (x+2)(x−2). Full answer: 4(x+2)(x−2).", marksAtRisk: "1 mark for incomplete factorisation" }],
  typicalMistakes: [{ mistake: "x² + 5x + 6 grouped as x(x+5) + 6 — wrong grouping", correction: "For trinomials: find two numbers that multiply to 6 and add to 5 (they are 2 and 3). Then x²+2x+3x+6 = x(x+2)+3(x+2) = (x+2)(x+3).", conceptualError: "Random grouping without finding the correct split of the middle term" }],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["A student factorised 9x²+12x+4 as (3x+4)². Find the error and correct it.", "Factorise 2x³−8x using two different methods."] }],
  difficultyProgression: [
    { step: 1, concept: "Common factor method: HCF of terms", tier: "easy", teachingNote: "Always start by checking for a common factor before trying any other method" },
    { step: 2, concept: "Factorisation by grouping: 4-term expressions", tier: "medium", dependsOnStep: 1, teachingNote: "Group in pairs; find common factor for each pair; extract common binomial" },
    { step: 3, concept: "Identity-based: difference of squares, perfect square", tier: "medium", dependsOnStep: 1, teachingNote: "Pattern recognition: is this a²−b² or (a±b)²? Write a and b explicitly first." },
    { step: 4, concept: "Division of polynomials by factorisation and cancellation", tier: "hard", dependsOnStep: 3, teachingNote: "Factorise numerator and denominator; cancel common factors" },
    { step: 5, concept: "Error analysis: find and fix errors in factorisations", tier: "hard", dependsOnStep: 3, teachingNote: "NEP-HOT: given a wrong factorisation, verify by expanding, identify the error, correct it" },
  ],
  realLifeApplications: [
    { context: "Simplifying algebraic fractions in physics formulas", conceptUsed: "Polynomial factorisation and cancellation", explanation: "Physical formulas often simplify when common factors cancel — the same algebra as polynomial division", ageRelevance: "Physics and Chemistry formulae manipulation" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch02", chapterName: "Polynomials", linkType: "prerequisite-for", description: "Class 9 uses Factor Theorem to find factors; the factorisation technique from this chapter is extended" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Algebraic manipulation in kinematics", description: "Rearranging physics formulas requires the same algebraic manipulation (common factoring) as this chapter", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Common factor: 5 examples from simple to complex", duration: "15 minutes", pedagogyNote: "Always check for common factor FIRST — it makes everything else easier" },
    { step: 2, action: "Grouping: demonstrate the strategy; 4 practice examples", duration: "20 minutes", pedagogyNote: "Show that different groupings work — as long as you extract the common binomial" },
    { step: 3, action: "Identity-based: recognise pattern → identify a and b → apply identity", duration: "20 minutes", pedagogyNote: "Pattern chart: look for (perfect square)−(perfect square) or (perfect square)±2(product)+(perfect square)" },
    { step: 4, action: "Division by factorisation; error analysis activity", duration: "20 minutes", pedagogyNote: "NEP-HOT: students grade each other's factorisation attempts" },
  ],
});

export const COMPARING_QUANTITIES_CLASS8 = ch("ch07", "Comparing Quantities", {
  learningObjectives: [
    { statement: "Calculate percentage increase and decrease on original value", bloomsLevel: "apply", assessable: true },
    { statement: "Apply compound interest formula to find amount and CI after n years", bloomsLevel: "apply", assessable: true },
    { statement: "Compare compound and simple interest for the same principal and rate", bloomsLevel: "analyse", assessable: true },
    { statement: "Solve problems involving discount, tax (GST), and profit/loss in real contexts", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Compound interest is always greater than simple interest' — is this always true? For what conditions?" },
    { ruleCode: "NEP-COMP", application: "Calculate EMI concept: borrow ₹1 lakh at 10% p.a. compound for 3 years — what is the total repayment?" },
    { ruleCode: "NEP-ETH", application: "Examine predatory lending: credit card interest at 36% per annum compounded — calculate how quickly debt spirals" },
  ],
  cbseOutcomes: ["Student calculates percentage increase/decrease on original value", "Student applies CI formula for annual, half-yearly, and quarterly compounding", "Student compares SI and CI; solves tax, discount, and GST problems"],
  icseOutcomes: [],
  coreConcepts: ["Percentage increase/decrease: always on the ORIGINAL value", "Compound interest: interest is added to principal each period; next period's interest is on the new (larger) principal", "CI formula: A = P(1+R/100)ⁿ; CI = A−P", "For half-yearly compounding: rate becomes R/2; time becomes 2n", "CI > SI for same P, R, T (when T > 1 year); equal when T = 1 year"],
  subtopics: [
    { id: "t1", name: "Percentage Increase and Decrease", coreConcept: "Change ÷ Original × 100 — the original is always the denominator", keyIdea: "A population grew from 5000 to 6000: increase = 1000; % increase = (1000/5000)×100 = 20%", estimatedPeriods: 2 },
    { id: "t2", name: "Discount, Tax, and GST", coreConcept: "Discount = MP − SP; Tax (GST) is added to the selling price", keyIdea: "SP after discount = MP × (1 − discount%/100). Amount paid = SP × (1 + tax%/100)", estimatedPeriods: 2 },
    { id: "t3", name: "Compound Interest", coreConcept: "Interest compounds: each year's interest is added to principal for the next year", keyIdea: "A = P(1+R/100)ⁿ; for half-yearly: A = P(1+R/200)^(2n)", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:7:ch08:simple-interest-formula", to: "mth:8:ch07:compound-interest-formula", relationship: "generalises", explanation: "Compound interest is simple interest applied repeatedly to a growing principal" },
    { from: "mth:7:ch08:profit-percent", to: "mth:8:ch07:percentage-increase", relationship: "applies", explanation: "Profit% is a specific type of percentage increase; the formula generalises to any percentage change" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 7, chapterId: "ch08", chapterName: "Comparing Quantities", requiredConcepts: ["mth:7:ch08:simple-interest-formula"] }], concepts: ["mth:7:ch08:profit-loss-definition"] },
  essentialDefinitions: [
    { term: "Compound Interest", formalDefinition: "Interest calculated on the principal plus the accumulated interest from previous periods; CI = A − P where A = P(1+R/100)ⁿ", informalExplanation: "'Interest on interest' — each period's earned interest becomes part of the principal for the next period" },
    { term: "Half-yearly Compounding", formalDefinition: "Compounding where interest is calculated and added every 6 months; effective rate = R/2% per half-year; effective periods = 2n", informalExplanation: "Instead of compounding once a year, compound twice — use half the rate and double the time period" },
  ],
  formulaInventory: [
    { name: "Compound Interest Formula", latex: "A = P\\left(1 + \\frac{R}{100}\\right)^n", plainText: "A = P(1 + R/100)ⁿ", variables: [{ symbol: "A", meaning: "Final amount (Principal + CI)" }, { symbol: "P", meaning: "Principal (original investment)" }, { symbol: "R", meaning: "Rate per annum (%)" }, { symbol: "n", meaning: "Time in years" }], applicableWhen: "Annual compounding; for half-yearly: replace R with R/2 and n with 2n", doesNotApplyWhen: "SI is different: SI = PRT/100. CI formula cannot be used for SI.", examTip: "CI = A − P. A is the total amount; CI is just the interest earned. Many students report A as CI." },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Compound Interest = P(1+R/100)^n", correction: "P(1+R/100)^n is the AMOUNT (A), not the CI. CI = A − P = P[(1+R/100)^n − 1].", whyItHappens: "Students confuse total amount with interest earned", revealingQuestion: "₹1000 at 10% CI for 2 years. What is the Amount? What is the CI?" },
    { misconception: "CI formula can be used for Simple Interest too", correction: "SI = PRT/100 (linear growth). CI = P(1+R/100)^n (exponential growth). They are fundamentally different.", whyItHappens: "Both involve P, R, T; students use the more complex formula for both", revealingQuestion: "Calculate SI and CI for P=1000, R=10%, T=2 years. Are they the same? Why not?" },
  ],
  examinerTraps: [{ trap: "Using annual rate and annual time for half-yearly compounding without adjusting", typicalScenario: "Half-yearly compounding at 10% for 2 years: student uses A = 1000(1+10/100)² instead of A = 1000(1+5/100)⁴", avoidanceStrategy: "Half-yearly: R becomes R/2 = 5%; n becomes 2n = 4 periods. Always adjust both.", marksAtRisk: "Full numerical marks" }],
  typicalMistakes: [{ mistake: "Percentage increase: 5000 to 6000 → increase% = (6000−5000)/6000 × 100 = 16.67% (dividing by new value)", correction: "Percentage change is ALWAYS on the ORIGINAL value: (1000/5000)×100 = 20%.", conceptualError: "Dividing by final value instead of original value" }],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["For the same P, R, T: prove algebraically that CI > SI (hint: expand (1+R/100)² and compare to simple interest formula)", "A sum doubles itself in 5 years at CI. In how many years will it become 4 times?"] }],
  difficultyProgression: [
    { step: 1, concept: "Percentage increase/decrease: formula and direction", tier: "easy", teachingNote: "Always: change = new − old; percentage = (change/original)×100" },
    { step: 2, concept: "Discount, marked price, selling price relationships", tier: "medium", dependsOnStep: 1, teachingNote: "MP → deduct discount% → SP. SP → add tax% → final price paid" },
    { step: 3, concept: "Compound interest: year-by-year calculation first", tier: "medium", dependsOnStep: 1, teachingNote: "Calculate P, interest, new P for year 1, year 2, year 3 in a table before using the formula" },
    { step: 4, concept: "CI formula: A = P(1+R/100)ⁿ; half-yearly adjustment", tier: "hard", dependsOnStep: 3, teachingNote: "Verify the formula gives same answer as the year-by-year table (builds trust in the formula)" },
    { step: 5, concept: "Comparison: CI vs SI for same P, R, T", tier: "hard", dependsOnStep: 3, teachingNote: "Calculate both; observe CI > SI for T>1 year; equal for T=1 year" },
  ],
  realLifeApplications: [
    { context: "Fixed Deposit returns vs savings account", conceptUsed: "Compound interest; comparing rates", explanation: "A bank FD at 7% compounded quarterly vs savings account at 4% simple interest — calculate which gives more return on ₹10,000 over 3 years.", ageRelevance: "Financial literacy; parents use FDs; this is a real family decision" },
    { context: "Demonetisation and price increases: inflation as compound % change", conceptUsed: "Compound percentage growth", explanation: "If prices rise 5% per year (inflation), in 10 years they have grown by (1.05)¹⁰ ≈ 1.63 — 63% increase total, not 50%.", ageRelevance: "Students have heard about inflation; this is the maths behind it" },
  ],
  crossChapterLinks: [{ subject: "Mathematics", classNum: 9, chapterId: "ch13", chapterName: "Probability", linkType: "parallel-concept", description: "Both CI and probability involve exponential growth/decay patterns" }],
  crossSubjectLinks: [{ subject: "Economics", topic: "Interest rates and banking", description: "Banks use compound interest; understanding CI is essential for basic financial literacy in economics", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Year-by-year CI calculation: table with P, interest, new P for 3 years", duration: "15 minutes", pedagogyNote: "Build intuition before formula — students see how CI grows faster than SI" },
    { step: 2, action: "Derive CI formula from the pattern in the table", duration: "15 minutes", pedagogyNote: "Year 1: P(1+R/100); Year 2: P(1+R/100)²; Year n: P(1+R/100)ⁿ" },
    { step: 3, action: "Half-yearly and quarterly compounding problems", duration: "20 minutes", pedagogyNote: "Always adjust R and n simultaneously. Practice 3 problems." },
    { step: 4, action: "Comparison: SI vs CI for same P,R,T — numerical and algebraic", duration: "15 minutes", pedagogyNote: "NEP-HOT: prove algebraically for T=2 years that CI > SI" },
    { step: 5, action: "GST and discount word problems from real bills", duration: "15 minutes", pedagogyNote: "NEP-COMP: bring actual bills; compute GST paid" },
  ],
});

export const MATHEMATICS_CLASS8: ChapterKnowledge[] = [
  RATIONAL_NUMBERS_CLASS8,
  LINEAR_EQUATIONS_CLASS8,
  SQUARES_AND_SQUARE_ROOTS,
  ALGEBRAIC_EXPRESSIONS_CLASS8,
  FACTORISATION_CLASS8,
  COMPARING_QUANTITIES_CLASS8,
];
