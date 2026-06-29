/**
 * Academic Knowledge — Mathematics, Class 9
 * All 13 NCERT chapters. Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

// ─── Chapter 1: Number Systems ────────────────────────────────────────────────

export const NUMBER_SYSTEMS: ChapterKnowledge = {
  chapterId: "ch01", chapterName: "Number Systems", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Classify any given real number as rational or irrational using its decimal expansion", bloomsLevel: "understand", assessable: true },
    { statement: "Represent irrational numbers on the number line using geometric (Pythagorean) construction", bloomsLevel: "apply", assessable: true },
    { statement: "Simplify surd expressions using the four operations and standard identities", bloomsLevel: "apply", assessable: true },
    { statement: "Rationalise denominators of surd expressions using conjugate multiplication", bloomsLevel: "apply", assessable: true },
    { statement: "Apply laws of exponents to numbers with rational (fractional) exponents", bloomsLevel: "apply", assessable: true },
    { statement: "Prove irrationality of numbers like √2 and √3 using proof by contradiction", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Prove √2 irrational as a problem to be solved, not a fact to be memorised" },
    { ruleCode: "NEP-REFL", application: "Explain WHY irrational numbers were invented: what gap exists in ℚ that ℝ fills" },
    { ruleCode: "NEP-HOT", application: "Evaluate: Is the sum of two irrationals always irrational? Construct counterexamples" },
    { ruleCode: "NEP-REPR", application: "Represent √5 in five forms: verbal, decimal approximation, number line, radical, power" },
  ],

  cbseOutcomes: [
    "Student classifies and inter-relates rational, irrational, and real numbers using the number system hierarchy",
    "Student represents irrational numbers (√2, √3, √5) on the number line",
    "Student performs addition, subtraction, multiplication, and rationalisation on surds",
    "Student applies all laws of exponents to real numbers with rational exponents",
  ],

  icseOutcomes: [
    "ICSE additionally expects: convert recurring decimals to p/q form using algebraic elimination method",
    "ICSE expects proof by contradiction of √2 and √3 irrationality as standard bookwork",
  ],

  coreConcepts: [
    "The decimal expansion of a number determines its rationality: terminating or recurring ⟺ rational",
    "The real number line is complete — every point corresponds to exactly one real number",
    "Irrational numbers cannot be expressed as p/q where p, q are integers and q ≠ 0",
    "Surds are irrational roots of rational numbers; like surds can be added and subtracted",
    "The conjugate identity (a+√b)(a−√b) = a²−b eliminates surds from denominators",
    "Fractional exponents are roots: x^(m/n) = (ⁿ√x)^m",
  ],

  subtopics: [
    { id: "t1", name: "Rational Numbers and Decimal Expansions", coreConcept: "Terminating or recurring decimal ⟺ rational number", keyIdea: "Long division always produces a repeating pattern for rational numbers", estimatedPeriods: 2 },
    { id: "t2", name: "Irrational Numbers", coreConcept: "Non-terminating non-recurring decimal cannot be expressed as p/q", keyIdea: "√2 on number line via Pythagoras; irrationality proved by contradiction", estimatedPeriods: 3 },
    { id: "t3", name: "Real Numbers and the Number Line", coreConcept: "ℝ = ℚ ∪ (irrationals); the number line has no gaps", keyIdea: "Every point on the line is a real number — visualise density of both sets", estimatedPeriods: 1 },
    { id: "t4", name: "Operations on Real Numbers (Surds)", coreConcept: "Like surds combine; conjugates eliminate surds from denominators", keyIdea: "Rationalisation is the Pythagoras identity applied to algebra", estimatedPeriods: 3 },
    { id: "t5", name: "Laws of Exponents for Real Numbers", coreConcept: "x^(m/n) = (ⁿ√x)^m; all standard exponent laws extend to rational exponents", keyIdea: "Fractional exponent is just a compact notation for roots", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:8:ch01:rational-definition", to: "mth:9:ch01:real-number-hierarchy", relationship: "requires", explanation: "Students must have a working definition of rational number before building the full hierarchy" },
    { from: "mth:9:ch01:decimal-expansion-test", to: "mth:9:ch01:irrational-definition", relationship: "requires", explanation: "Irrationality is defined via the decimal expansion test" },
    { from: "mth:9:ch01:irrational-definition", to: "mth:9:ch01:proof-by-contradiction", relationship: "applies", explanation: "Proof by contradiction proves no p/q representation exists" },
    { from: "mth:6:ch03:pythagoras-intro", to: "mth:9:ch01:number-line-geometric-construction", relationship: "requires", explanation: "Placing √n on the number line uses a right triangle with legs 1 and n−1" },
    { from: "mth:9:ch01:conjugate-identity", to: "mth:9:ch01:rationalisation", relationship: "applies", explanation: "Rationalisation uses (a+√b)(a−√b)=a²−b to clear the denominator" },
    { from: "mth:7:ch13:exponent-laws", to: "mth:9:ch01:fractional-exponents", relationship: "generalises", explanation: "Laws for integer exponents extend to rational exponents" },
    { from: "mth:9:ch01:surd-simplification", to: "mth:9:ch01:rationalisation", relationship: "requires", explanation: "Students must simplify surds before they can rationalise multi-term denominators" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 8, chapterId: "ch01", chapterName: "Rational Numbers", requiredConcepts: ["mth:8:ch01:rational-definition", "mth:8:ch01:density-of-rationals"] },
      { subject: "Mathematics", classNum: 7, chapterId: "ch13", chapterName: "Exponents and Powers", requiredConcepts: ["mth:7:ch13:product-rule", "mth:7:ch13:quotient-rule", "mth:7:ch13:zero-exponent"] },
    ],
    concepts: ["mth:8:ch01:p-over-q-form", "mth:7:ch06:pythagoras-theorem"],
  },

  essentialDefinitions: [
    { term: "Rational Number", formalDefinition: "A number that can be expressed as p/q where p, q ∈ ℤ and q ≠ 0", informalExplanation: "Any number you can write as a fraction with integer numerator and non-zero integer denominator", example: "3/4, −7, 0, 0.333…", counterExample: "√2 cannot be expressed as p/q with integer p, q" },
    { term: "Irrational Number", formalDefinition: "A real number that cannot be expressed in the form p/q where p, q ∈ ℤ and q ≠ 0", informalExplanation: "Its decimal expansion never terminates and never settles into a repeating block", example: "√2 = 1.41421356…, π = 3.14159…, e", counterExample: "√4 = 2 is rational; not every square root is irrational" },
    { term: "Surd", formalDefinition: "An irrational number expressed as ⁿ√a where a is a positive rational and n is a positive integer", informalExplanation: "A root sign over a non-perfect-power number", example: "√3, ∛5, √(2/3)" },
    { term: "Rationalising Factor", formalDefinition: "A multiplier that, when multiplied with a surd expression, makes the result rational", informalExplanation: "The conjugate of a binomial surd; for 1/√a the factor is √a", example: "Rationalising factor of (√3+1) is (√3−1)" },
    { term: "Real Number", formalDefinition: "Any number that can be represented on the number line; ℝ = ℚ ∪ (irrationals)", informalExplanation: "Every possible measurement of a physical quantity is a real number", example: "All rationals and all irrationals" },
    { term: "Fractional Exponent", formalDefinition: "x^(m/n) = (ⁿ√x)^m = ⁿ√(x^m), for x > 0 and m, n ∈ ℤ, n > 0", informalExplanation: "The denominator of the exponent is the root; the numerator is the power", example: "8^(2/3) = (∛8)² = 2² = 4" },
  ],

  formulaInventory: [
    { name: "Conjugate Product", latex: "(a + \\sqrt{b})(a - \\sqrt{b}) = a^2 - b", plainText: "(a + √b)(a − √b) = a² − b", variables: [{ symbol: "a", meaning: "rational part" }, { symbol: "b", meaning: "radicand (non-negative rational)" }], applicableWhen: "Denominator is of the form a ± √b", doesNotApplyWhen: "Denominator involves cube roots or higher — different technique needed", examTip: "Always expand the denominator first; verify it becomes rational before writing the final answer" },
    { name: "Laws of Exponents (summary)", latex: "x^m \\cdot x^n = x^{m+n}; \\quad \\frac{x^m}{x^n} = x^{m-n}; \\quad (x^m)^n = x^{mn}; \\quad x^0 = 1; \\quad x^{-n} = \\frac{1}{x^n}", plainText: "xᵐ·xⁿ = xᵐ⁺ⁿ; xᵐ/xⁿ = xᵐ⁻ⁿ; (xᵐ)ⁿ = xᵐⁿ; x⁰=1; x⁻ⁿ=1/xⁿ", variables: [{ symbol: "x", meaning: "base (real, positive for fractional exponents)" }, { symbol: "m, n", meaning: "exponents (rational numbers)" }], applicableWhen: "Base is positive real; exponents are rational", doesNotApplyWhen: "Base is negative with fractional exponent — not defined in ℝ", examTip: "When combining exponents of the same base, identify the base carefully — aᵐ·bⁿ cannot be simplified as (ab)^(m+n)" },
  ],

  lawsAndTheorems: [
    { name: "Irrationality of √p (p prime)", type: "theorem", statement: "If p is a prime number, then √p is irrational", proofInsight: "Assume √p = a/b in lowest terms; squaring gives p·b² = a², so p|a; write a=pc; then p·b²=p²c² so p|b; but gcd(a,b)=1 — contradiction", discoveredBy: "Ancient Greek mathematics (Pythagoreans)", limitations: "Applies to prime radicands; √4=2 is rational because 4 is not prime", boardRelevance: "CBSE Board always asks proof for √2 or √3; ICSE sometimes asks √5 — this is 5-mark bookwork" },
    { name: "Decimal Expansion Theorem", type: "theorem", statement: "A real number is rational if and only if its decimal expansion is either terminating or eventually repeating", proofInsight: "Division algorithm produces a finite set of remainders; if remainder repeats, decimal repeats; if remainder reaches 0, decimal terminates", limitations: "Applies in base 10; the period of repetition may be very long (e.g. 1/97 has period 96)", boardRelevance: "Used to classify numbers in 1-mark questions; expected to be stated as justification" },
  ],

  commonMisconceptions: [
    { misconception: "√4 is irrational because it has a square root sign", correction: "√4 = 2, which is rational. The presence of √ does not imply irrationality — only non-perfect-square radicands give irrationals", whyItHappens: "Students associate √ with 'complicated' and assume all such numbers are irrational", revealingQuestion: "Is √9 rational or irrational? Justify." },
    { misconception: "22/7 = π", correction: "22/7 ≈ 3.1428… is rational and is only an approximation of π ≈ 3.14159…. π is irrational.", whyItHappens: "22/7 is widely used in calculations; students conflate the approximation with the actual value", revealingQuestion: "A student says π = 22/7. Is this correct? Explain the error." },
    { misconception: "The sum of two irrational numbers is always irrational", correction: "Counterexample: √2 + (−√2) = 0, which is rational", whyItHappens: "Intuitive generalisation: irrational + irrational 'should be' irrational", revealingQuestion: "Give an example of two irrational numbers whose sum is rational." },
    { misconception: "√a + √b = √(a+b)", correction: "√2 + √3 ≠ √5. Square roots cannot be added by adding radicands — this would require them to be like surds", whyItHappens: "Analogy with fraction addition where numerators add over a common denominator", revealingQuestion: "Simplify: √12 + √27 (to reveal whether the student applies this correctly)" },
    { misconception: "A non-terminating decimal is always irrational", correction: "0.333… = 1/3 is non-terminating but rational (recurring)", whyItHappens: "Students focus only on 'non-terminating' and miss the 'non-recurring' condition", revealingQuestion: "Is 0.142857142857… rational or irrational? Justify." },
  ],

  examinerTraps: [
    { trap: "Final answer with surd in the denominator", typicalScenario: "Student simplifies 1/(√3−1) correctly but forgets to multiply by conjugate; leaves rational/surd form", avoidanceStrategy: "Always check the final answer: if the denominator contains √, rationalise", marksAtRisk: "½ to 1 mark for incomplete simplification" },
    { trap: "Missing justification in irrationality proof", typicalScenario: "Student writes the proof steps but omits the contradiction statement at the end", avoidanceStrategy: "Every contradiction proof MUST end with 'This contradicts our assumption that p/q is in lowest terms (coprime). Hence [number] is irrational.'", marksAtRisk: "1 mark for missing conclusion" },
    { trap: "Forgetting the coprimality assumption in irrationality proof", typicalScenario: "Student assumes √2 = a/b without stating that gcd(a,b) = 1 (i.e., fraction is in lowest terms)", avoidanceStrategy: "The very first line must state 'Let √2 = a/b where a, b are integers with no common factor (coprime), b ≠ 0'", marksAtRisk: "1 mark for missing hypothesis" },
    { trap: "Using a = 2m instead of showing 2|a from 2|a²", typicalScenario: "Student jumps to writing a = 2m without proving that if 2|a² then 2|a", avoidanceStrategy: "State 'since 2 is prime and 2|a², by the prime divisibility lemma, 2|a'", marksAtRisk: "½ mark for unjustified step" },
  ],

  typicalMistakes: [
    { mistake: "√2 + √3 = √5", correction: "√2 + √3 cannot be simplified further — they are unlike surds", conceptualError: "Applying fraction-addition intuition to radical expressions" },
    { mistake: "2^(3/2) = 2^1.5 = 3", correction: "2^(3/2) = (√2)³ = 2√2 ≈ 2.828, not 3", conceptualError: "Confusing the exponent value with a multiplication factor" },
    { mistake: "Rationalising (1+√2) by multiplying by (1+√2)", correction: "Rationalising factor of (1+√2) is (1−√2), the conjugate, not itself", conceptualError: "Not understanding that rationalisation requires the sign to change" },
    { mistake: "Writing 0.999… as irrational", correction: "0.999… = 1 exactly (recurring decimal = rational)", conceptualError: "Non-terminating property mistaken for irrationality" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "remember", masteryLevel: "understand", targetLevels: ["remember", "understand", "apply"], hotsStarters: ["Explain why 1/7 must be a recurring decimal without doing the division", "If a decimal has period 6, what does that tell you about the fraction?"] },
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "analyse", "evaluate"], hotsStarters: ["Prove √3 is irrational", "Is the product of two irrationals always irrational? Justify with examples"] },
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "apply", targetLevels: ["apply", "analyse"], hotsStarters: ["If a + b√2 = 3 + 2√2, find a and b", "Rationalise and simplify: 1/(√3 + √2 + 1)"] },
    { subtopicId: "t5", entryLevel: "remember", masteryLevel: "apply", targetLevels: ["remember", "apply", "analyse"], hotsStarters: ["Simplify: (8^(1/3) × 16^(1/4)) / 2^(−1/2)", "Find n if 3^n × 81 = 3^7"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Review p/q form of rational numbers", tier: "foundational", teachingNote: "Warm-up: convert common fractions and mixed numbers to decimal to activate prior knowledge" },
    { step: 2, concept: "Decimal expansions: terminating vs recurring", tier: "easy", dependsOnStep: 1, teachingNote: "Do long division of 1/3, 1/7, 1/4 — students see the pattern themselves" },
    { step: 3, concept: "Definition of irrational number", tier: "easy", dependsOnStep: 2, teachingNote: "Introduce √2 as the diagonal of unit square; compute decimal — it never repeats" },
    { step: 4, concept: "Represent √2 on number line geometrically", tier: "medium", dependsOnStep: 3, teachingNote: "Draw right triangle with legs 1 and 1 inside unit square; arc to number line" },
    { step: 5, concept: "Like surds: addition and subtraction", tier: "easy", dependsOnStep: 3, teachingNote: "Analogy: 2√3 + 5√3 = 7√3 is like 2x + 5x = 7x" },
    { step: 6, concept: "Multiplication and division of surds", tier: "medium", dependsOnStep: 5, teachingNote: "√a × √b = √(ab) only when a, b ≥ 0; avoid negative radicand errors" },
    { step: 7, concept: "Rationalisation with monomial denominator", tier: "medium", dependsOnStep: 6, teachingNote: "Multiply 1/√3 by √3/√3; make the connection to making denominator perfect square" },
    { step: 8, concept: "Rationalisation with binomial denominator (conjugate)", tier: "hard", dependsOnStep: 7, teachingNote: "Why conjugate works: (a+b)(a−b) = a²−b² with b=√b eliminates the surd" },
    { step: 9, concept: "Fractional exponents and their laws", tier: "medium", dependsOnStep: 2, teachingNote: "Bridge: 8^(1/3) = ∛8 by definition; then extend all laws" },
    { step: 10, concept: "Proof of irrationality by contradiction", tier: "hard", dependsOnStep: 3, teachingNote: "This is students' first formal proof — teach proof structure (assume, derive, contradict) as a reusable method" },
  ],

  realLifeApplications: [
    { context: "Architecture: diagonal of a square room", conceptUsed: "Irrational numbers / Pythagoras", explanation: "A square room of side 1m has diagonal √2 m — this length cannot be expressed as an exact fraction, but exists physically", ageRelevance: "Students can measure this in their own classroom", crossSubject: "Physics: vectors and resultant displacement" },
    { context: "Circle calculations: area and circumference", conceptUsed: "π is irrational", explanation: "Area = πr² and Circumference = 2πr use an irrational number — yet give exact circle measurements", ageRelevance: "Students use π in formula problems from Class 7 onwards" },
    { context: "Music: frequency ratios", conceptUsed: "Irrational numbers", explanation: "The equal-tempered scale uses 2^(1/12) (irrational) for each semitone — this is a fractional exponent in real life", ageRelevance: "Every student who plays or listens to music encounters this" },
    { context: "Camera aperture and f-stops", conceptUsed: "Fractional exponents", explanation: "f-stop values follow the sequence √2, √2², √2³ — fractional powers of 2 control light exposure", ageRelevance: "Photography context resonates with modern students" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch02", chapterName: "Polynomials", linkType: "prerequisite-for", description: "Irrational roots of polynomials (e.g., roots of x²−2=0 are ±√2)" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "applies-here", description: "Pythagoras theorem produces surd lengths; irrationality of √2 is the reason lengths are often irrational" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch09", chapterName: "Circles", linkType: "applies-here", description: "π is irrational — relevant when proving circumference/area formulas are irrational for rational radius" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch01", chapterName: "Real Numbers (Class 10)", linkType: "prerequisite-for", description: "Euclid's division algorithm and HCF/LCM of irrational numbers extend this chapter" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Speed and velocity calculations", description: "Equations like v=√(2gh) or T=2π√(L/g) produce irrational values; students need surd fluency", strength: "strong" },
    { subject: "Chemistry", topic: "Scientific notation and Avogadro's number", description: "Very large numbers as powers of 10 use exponent laws from this chapter", strength: "moderate" },
    { subject: "Computer Science", topic: "Algorithms for approximating irrational numbers", description: "Newton's method for √n is a concrete algorithm application of the concept", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Warm-up: Express 1/3, 1/7, 3/8 as decimals by long division — notice the patterns", duration: "10 minutes", pedagogyNote: "NEP-IDC: let students discover the terminating/recurring pattern themselves before defining it", formativeCheckpoint: "Can every student identify which decimals repeat and which terminate?" },
    { step: 2, action: "Define rational vs irrational via decimal expansion; classify given numbers", duration: "15 minutes", pedagogyNote: "NEP-REPR: show the same number in fraction form, decimal form, and on a sketch of the number line simultaneously" },
    { step: 3, action: "Geometric construction: place √2 on number line using unit right triangle", duration: "20 minutes", pedagogyNote: "Use actual ruler and compass; connection to Pythagoras bridges geometry and number systems" },
    { step: 4, action: "Operations on surds: worked examples of addition, subtraction, multiplication, division", duration: "25 minutes", pedagogyNote: "Like-surds analogy to like terms in algebra; avoid the √a+√b=√(a+b) error explicitly" },
    { step: 5, action: "Rationalisation: monomial then binomial denominators with conjugates", duration: "20 minutes", pedagogyNote: "NEP-HOT: ask 'why does the conjugate work?' before showing the algebra — let students reason", formativeCheckpoint: "Does the student check the final denominator is rational?" },
    { step: 6, action: "Fractional exponents: define x^(1/n), then x^(m/n); apply all exponent laws", duration: "20 minutes", pedagogyNote: "Bridge from integer exponents — stress continuity of laws, not new rules" },
    { step: 7, action: "Proof by contradiction: prove √2 irrational; then √3 as student exercise", duration: "25 minutes", pedagogyNote: "NEP-PROB: teach proof structure as a general method; this is the student's first experience of proof by contradiction — honour its significance", formativeCheckpoint: "Can the student identify the contradiction in a given proof attempt?" },
    { step: 8, action: "HOTS and consolidation: counterexamples for misconceptions; board-level problems", duration: "20 minutes", pedagogyNote: "NEP-REFL: discuss why we need ℝ — what would be missing if only ℚ existed?" },
  ],
};

// ─── Chapter 2: Polynomials ───────────────────────────────────────────────────

export const POLYNOMIALS: ChapterKnowledge = {
  chapterId: "ch02", chapterName: "Polynomials", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Classify polynomials by degree and number of terms", bloomsLevel: "understand", assessable: true },
    { statement: "Evaluate polynomials and find the value of the polynomial at a given point", bloomsLevel: "apply", assessable: true },
    { statement: "Apply the Remainder Theorem to find remainders without full division", bloomsLevel: "apply", assessable: true },
    { statement: "Use the Factor Theorem to determine whether a linear expression is a factor", bloomsLevel: "apply", assessable: true },
    { statement: "Factorise polynomials using Factor Theorem and algebraic identities for cubes", bloomsLevel: "apply", assessable: true },
    { statement: "Derive and apply standard algebraic identities involving cubes", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Discover that f(a)=0 implies (x−a) is a factor by reasoning, not memorisation" },
    { ruleCode: "NEP-HOT", application: "Given factorisation, work backwards to find unknowns using Factor Theorem" },
    { ruleCode: "NEP-COMP", application: "Apply identities to mental arithmetic: 99³ = (100−1)³ using cube expansion" },
  ],

  cbseOutcomes: [
    "Student defines polynomials and classifies them by degree and number of terms",
    "Student states and applies the Remainder Theorem",
    "Student states and applies the Factor Theorem to factorise polynomials",
    "Student uses algebraic identities (including cube identities) for expansion and factorisation",
  ],

  icseOutcomes: [
    "ICSE expects: synthetic division and factor theorem combined for degree-3 polynomials",
    "ICSE additionally covers: remainder when dividing by (ax+b), not just (x−a)",
  ],

  coreConcepts: [
    "A polynomial is an expression with non-negative integer exponents only",
    "The degree of a polynomial is the highest power of the variable",
    "Remainder Theorem: p(x) ÷ (x−a) gives remainder p(a)",
    "Factor Theorem: (x−a) is a factor of p(x) ⟺ p(a) = 0",
    "Every polynomial has a unique factored form (up to order and constants)",
    "Cube identities are extensions of the square identities — they factor sum/difference of cubes",
  ],

  subtopics: [
    { id: "t1", name: "Polynomials and Their Classification", coreConcept: "Non-negative integer exponents define a polynomial", keyIdea: "√x, 1/x are NOT polynomials — the exponent test", estimatedPeriods: 2 },
    { id: "t2", name: "Zeros of a Polynomial", coreConcept: "Zero: value of variable that makes the polynomial equal to 0", keyIdea: "Geometric meaning: x-intercepts of the graph", estimatedPeriods: 2 },
    { id: "t3", name: "Remainder Theorem", coreConcept: "f(x) ÷ (x−a) leaves remainder f(a)", keyIdea: "Saves long polynomial division — substitute directly", estimatedPeriods: 2 },
    { id: "t4", name: "Factor Theorem", coreConcept: "(x−a) is a factor ⟺ f(a) = 0", keyIdea: "Remainder Theorem + zero = factor relationship", estimatedPeriods: 2 },
    { id: "t5", name: "Algebraic Identities (Cube Expansions)", coreConcept: "(a+b)³ = a³+3a²b+3ab²+b³ and related identities", keyIdea: "Proofs extend the square-identity technique; used to evaluate large powers", estimatedPeriods: 2 },
    { id: "t6", name: "Factorisation of Polynomials", coreConcept: "Use factor theorem to find one linear factor; divide to find remaining", keyIdea: "Systematic process: test rational roots, find one zero, factorise", estimatedPeriods: 3 },
  ],

  conceptGraph: [
    { from: "mth:8:ch08:polynomial-expression", to: "mth:9:ch02:polynomial-definition", relationship: "generalises", explanation: "Class 8 algebraic expressions are formalised as polynomials" },
    { from: "mth:9:ch02:polynomial-evaluation", to: "mth:9:ch02:remainder-theorem", relationship: "applies", explanation: "Remainder theorem is polynomial evaluation applied at a specific point" },
    { from: "mth:9:ch02:remainder-theorem", to: "mth:9:ch02:factor-theorem", relationship: "generalises", explanation: "Factor theorem is the special case of remainder theorem where remainder = 0" },
    { from: "mth:9:ch02:factor-theorem", to: "mth:9:ch02:factorisation-of-cubics", relationship: "applies", explanation: "Factor theorem finds linear factors of cubic polynomials" },
    { from: "mth:8:ch08:identity-a-plus-b-sq", to: "mth:9:ch02:cube-identities", relationship: "generalises", explanation: "Cube identities extend the pattern from squares; derived by multiplying square identity by (a+b)" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 8, chapterId: "ch08", chapterName: "Algebraic Expressions and Identities", requiredConcepts: ["mth:8:ch08:identity-a-plus-b-sq", "mth:8:ch08:monomial-polynomial-multiplication"] },
      { subject: "Mathematics", classNum: 8, chapterId: "ch13", chapterName: "Factorisation", requiredConcepts: ["mth:8:ch13:factorisation-by-identity", "mth:8:ch13:common-factor-method"] },
    ],
    concepts: ["mth:8:ch08:identity-a-plus-b-sq", "mth:8:ch08:identity-diff-of-sq"],
  },

  essentialDefinitions: [
    { term: "Polynomial", formalDefinition: "An expression of the form aₙxⁿ + aₙ₋₁xⁿ⁻¹ + … + a₁x + a₀ where n is a non-negative integer and coefficients are real numbers", informalExplanation: "A sum of terms where each term has a variable raised to a whole-number power", counterExample: "√x + 1 and x⁻¹ + 2 are NOT polynomials — the exponents are not whole numbers" },
    { term: "Degree of a Polynomial", formalDefinition: "The highest power of the variable in the polynomial (with non-zero coefficient)", informalExplanation: "Count the highest exponent — that is the degree", example: "Degree of 3x⁴ − 2x + 1 is 4" },
    { term: "Zero of a Polynomial", formalDefinition: "A value a such that p(a) = 0", informalExplanation: "The input that makes the polynomial output zero", example: "2 is a zero of x−2 because (2)−2=0" },
    { term: "Remainder Theorem", formalDefinition: "When polynomial p(x) is divided by (x−a), the remainder is p(a)", informalExplanation: "Substitute a into p(x) to find the remainder — no long division needed" },
    { term: "Factor Theorem", formalDefinition: "(x−a) is a factor of p(x) if and only if p(a) = 0", informalExplanation: "If substituting a gives zero, then (x−a) divides p(x) exactly" },
  ],

  formulaInventory: [
    { name: "Cube of Sum", latex: "(a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3", plainText: "(a+b)³ = a³ + 3a²b + 3ab² + b³", variables: [{ symbol: "a, b", meaning: "any real numbers or algebraic expressions" }], applicableWhen: "Expanding or factorising expressions of the form (a+b)³", doesNotApplyWhen: "Do not confuse with (a+b)² — the middle terms differ in both count and coefficients", examTip: "Memorise the pattern: 1, 3, 3, 1 matches Pascal's triangle row 3" },
    { name: "Cube of Difference", latex: "(a-b)^3 = a^3 - 3a^2b + 3ab^2 - b^3", plainText: "(a−b)³ = a³ − 3a²b + 3ab² − b³", variables: [{ symbol: "a, b", meaning: "any real numbers or algebraic expressions" }], applicableWhen: "Expanding or factorising (a−b)³", doesNotApplyWhen: "Signs alternate: +, −, +, −; do not use all positive signs", examTip: "Alternate the signs of the middle terms" },
    { name: "Sum of Cubes", latex: "a^3 + b^3 = (a+b)(a^2 - ab + b^2)", plainText: "a³ + b³ = (a+b)(a²−ab+b²)", variables: [{ symbol: "a, b", meaning: "any expressions" }], applicableWhen: "Factorising a sum of two perfect cubes", doesNotApplyWhen: "(a²−ab+b²) cannot be further factorised over reals", examTip: "The second factor always has a NEGATIVE middle term for sum of cubes" },
    { name: "Difference of Cubes", latex: "a^3 - b^3 = (a-b)(a^2 + ab + b^2)", plainText: "a³ − b³ = (a−b)(a²+ab+b²)", variables: [{ symbol: "a, b", meaning: "any expressions" }], applicableWhen: "Factorising a difference of two perfect cubes", doesNotApplyWhen: "(a²+ab+b²) cannot be further factorised over reals (discriminant < 0)", examTip: "Second factor has POSITIVE middle term for difference of cubes — opposite of sum" },
  ],

  lawsAndTheorems: [
    { name: "Remainder Theorem", type: "theorem", statement: "If p(x) is a polynomial of degree ≥ 1 and p(x) is divided by (x−a), then the remainder is p(a)", proofInsight: "By division algorithm: p(x) = (x−a)·q(x) + r; substituting x=a gives p(a) = 0·q(a) + r = r", boardRelevance: "Always tested in 2-mark and 3-mark questions; both direct application and reverse (find k given remainder)" },
    { name: "Factor Theorem", type: "theorem", statement: "(x−a) is a factor of p(x) if and only if p(a) = 0", proofInsight: "Forward: if p(a)=0, then remainder=0 by Remainder Theorem, so (x−a) divides p(x). Backward: if (x−a) is a factor, then p(x)=(x−a)q(x), so p(a)=0", boardRelevance: "5-mark factorisation questions; finding k such that (x−a) is a factor of p(x)" },
  ],

  commonMisconceptions: [
    { misconception: "√x is a polynomial because it looks like an algebraic expression", correction: "√x = x^(1/2) has a fractional exponent — not a non-negative integer — so it is NOT a polynomial", whyItHappens: "Students classify all algebraic expressions as polynomials without checking the exponent", revealingQuestion: "Is √x + 3 a polynomial? Justify your answer." },
    { misconception: "The degree of the constant polynomial 5 is 1", correction: "The degree of a non-zero constant is 0 (it is x⁰). The zero polynomial has no degree (undefined).", whyItHappens: "Students think a number without a variable has 'no exponent' which they call 1", revealingQuestion: "What is the degree of the polynomial 7?" },
    { misconception: "If p(2) = 0, then 2 is a factor of p(x)", correction: "p(2)=0 means (x−2) is a factor, not the number 2", whyItHappens: "Confusion between the zero of a polynomial and the factor of a polynomial", revealingQuestion: "p(3) = 0. Which of the following is a factor: (a) 3, (b) x−3, (c) x+3?" },
    { misconception: "(a+b)³ = a³ + b³", correction: "(a+b)³ = a³ + 3a²b + 3ab² + b³; the middle terms are critical", whyItHappens: "Over-generalisation from the distributive property; treating 'cube' as if it distributes", revealingQuestion: "Expand (x+1)³ and verify by substituting x=2" },
  ],

  examinerTraps: [
    { trap: "Using Factor Theorem without checking if the polynomial has degree ≥ 1", typicalScenario: "Applies Factor Theorem to a constant — which has no zeros", avoidanceStrategy: "Factor Theorem applies only to polynomials of degree ≥ 1", marksAtRisk: "½ mark" },
    { trap: "Finding k: divides by (x+a) instead of (x−a)", typicalScenario: "Question: 'p(x) is divisible by (x+2). Find k.' Student substitutes x=2 instead of x=−2", avoidanceStrategy: "Factor Theorem: (x−a) → substitute x=a. So (x+2) = (x−(−2)) → substitute x=−2", marksAtRisk: "Full 2–3 marks lost for wrong substitution" },
    { trap: "Missing the factored form of the quadratic after extracting one factor", typicalScenario: "Student uses Factor Theorem to get (x−a) as one factor, then writes the answer as (x−a)×(the remaining quotient) without factorising the quotient", avoidanceStrategy: "Always check if the remaining factor (usually quadratic) factorises further", marksAtRisk: "1 mark for incomplete factorisation" },
  ],

  typicalMistakes: [
    { mistake: "a³ + b³ = (a+b)(a+b)² = (a+b)³", correction: "a³+b³ = (a+b)(a²−ab+b²) — the second factor is NOT (a+b)", conceptualError: "Confusing sum of cubes with cube of sum" },
    { mistake: "Degree of 2x⁴ + 3x⁴ is 8 (adding degrees)", correction: "Like terms: 2x⁴+3x⁴ = 5x⁴, degree is 4", conceptualError: "Confusing multiplication of powers (adds exponents) with addition of like terms" },
    { mistake: "p(a) = 0 is the remainder when divided by (x+a)", correction: "p(a) is the remainder when divided by (x−a), not (x+a)", conceptualError: "Sign error in Remainder Theorem application" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "remember", masteryLevel: "understand", targetLevels: ["remember", "understand"], hotsStarters: ["Is √x + x² a polynomial? Classify the terms.", "Can a polynomial have fractional coefficients?"] },
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "apply", targetLevels: ["apply", "analyse"], hotsStarters: ["If the remainder is 5 when p(x) is divided by (x−1), find p(1) without long division", "For what value of k does x³ + kx + 2 have remainder 5 when divided by (x−1)?"] },
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["Find k if (x−2) is a factor of x³ − kx² + 3x − 6", "Factorise completely: x³ − 6x² + 11x − 6"] },
    { subtopicId: "t5", entryLevel: "remember", masteryLevel: "apply", targetLevels: ["remember", "apply", "analyse"], hotsStarters: ["Evaluate 101³ using (100+1)³ expansion", "Prove that a³ + b³ + c³ − 3abc = (a+b+c)(a²+b²+c²−ab−bc−ca)"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Identifying polynomials and non-polynomials", tier: "easy", teachingNote: "Focus on the exponent test: whole number and non-negative" },
    { step: 2, concept: "Degree, leading coefficient, constant term", tier: "easy", dependsOnStep: 1, teachingNote: "Use visual inspection; rearrange in standard form first" },
    { step: 3, concept: "Evaluating polynomials at a point", tier: "easy", dependsOnStep: 2, teachingNote: "Connect to 'substituting x' — they have done this since Class 6" },
    { step: 4, concept: "Zeros of a polynomial", tier: "medium", dependsOnStep: 3, teachingNote: "Geometric interpretation: zero is where the curve crosses the x-axis" },
    { step: 5, concept: "Remainder Theorem: direct application", tier: "medium", dependsOnStep: 3, teachingNote: "Build from polynomial evaluation; show it is faster than long division" },
    { step: 6, concept: "Remainder Theorem: find k given the remainder", tier: "medium", dependsOnStep: 5, teachingNote: "Sets up an equation; bridges remainder theorem with equation solving" },
    { step: 7, concept: "Factor Theorem: testing for factors", tier: "medium", dependsOnStep: 5, teachingNote: "Factor theorem is just remainder theorem with remainder = 0" },
    { step: 8, concept: "Factorisation of cubic polynomials using Factor Theorem", tier: "hard", dependsOnStep: 7, teachingNote: "Systematic: try x=1, −1, 2, −2, … until p(a)=0; then do polynomial division" },
    { step: 9, concept: "Cube identities: expansion and factorisation", tier: "medium", teachingNote: "Derive (a+b)³ by multiplying (a+b)² × (a+b); do not just state it" },
    { step: 10, concept: "Identity: a³+b³+c³−3abc when a+b+c=0", tier: "hard", dependsOnStep: 9, teachingNote: "This is a HOTS-level identity; prove it from the factored form" },
  ],

  realLifeApplications: [
    { context: "Engineering: design of curved surfaces (beams, arches)", conceptUsed: "Polynomial functions model the shape", explanation: "Cubic and quartic polynomials model natural curves in architecture and civil engineering", ageRelevance: "Connects mathematics to buildings students see every day" },
    { context: "Computer graphics: Bezier curves", conceptUsed: "Polynomials as shape functions", explanation: "Fonts, animations, and video game graphics use cubic polynomial curves (Bezier) to define smooth shapes", ageRelevance: "Students who play games or use design apps encounter this daily" },
    { context: "Mental arithmetic: expanding (99)³ using (100−1)³", conceptUsed: "Cube of difference identity", explanation: "(100−1)³ = 1000000 − 30000 + 300 − 1 = 970299 — calculated without a calculator", ageRelevance: "Directly useful for competitive exams" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch01", chapterName: "Number Systems", linkType: "builds-on", description: "Polynomial roots can be irrational — connects number systems to polynomial zeros" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch02", chapterName: "Polynomials (Class 10)", linkType: "prerequisite-for", description: "Class 10 covers relationship between zeros and coefficients, which builds directly on this" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Equations of motion (kinematic equations)", description: "Displacement as a polynomial in time: s = ut + ½at² is a degree-2 polynomial in t", strength: "strong" },
    { subject: "Computer Science", topic: "Algorithms for polynomial evaluation (Horner's method)", description: "Efficient computation of polynomial values is a fundamental CS algorithm problem", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Review algebraic expressions: terms, coefficients, degree of terms", duration: "10 minutes", pedagogyNote: "Activate prior knowledge from Class 8; identify which expressions are polynomials" },
    { step: 2, action: "Define polynomial formally: non-negative integer exponents; classify by degree and terms", duration: "15 minutes", pedagogyNote: "Common non-examples: √x, 1/x — the exponent test as a litmus test" },
    { step: 3, action: "Evaluate polynomials; define zeros geometrically and algebraically", duration: "15 minutes", pedagogyNote: "Sketch a polynomial graph; show zeros as x-intercepts; connect to equation solving" },
    { step: 4, action: "Derive Remainder Theorem from division algorithm; apply to 3 examples", duration: "20 minutes", pedagogyNote: "NEP-PROB: derive the theorem — do not just state it; students reason from p(x)=(x−a)q(x)+r" },
    { step: 5, action: "Factor Theorem: derive from Remainder Theorem; apply to find/verify factors", duration: "20 minutes", pedagogyNote: "Emphasise the biconditional: 'if and only if'. Both directions tested in exams" },
    { step: 6, action: "Factorise cubic polynomials: systematic root-testing + division", duration: "25 minutes", pedagogyNote: "Practice at least 3 examples; show the systematic approach to root testing" },
    { step: 7, action: "Derive and apply cube identities; use for arithmetic applications", duration: "25 minutes", pedagogyNote: "NEP-COMP: connect to mental arithmetic — 101³, 99³ as real applications" },
    { step: 8, action: "HOTS: reverse problems — find k given factor or remainder; identity proofs", duration: "20 minutes", pedagogyNote: "NEP-HOT: error-analysis style questions (find error in a given factorisation)" },
  ],
};

// ─── Chapter 3: Coordinate Geometry ──────────────────────────────────────────

export const COORDINATE_GEOMETRY: ChapterKnowledge = {
  chapterId: "ch03", chapterName: "Coordinate Geometry", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Locate points in the Cartesian plane using ordered pairs (x, y)", bloomsLevel: "apply", assessable: true },
    { statement: "Identify the quadrant or axis a given point lies on", bloomsLevel: "understand", assessable: true },
    { statement: "Plot points and read coordinates from a given graph", bloomsLevel: "apply", assessable: true },
    { statement: "Find the distance from axes given coordinates", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-REPR", application: "Represent the same point in four forms: ordered pair, sketch, verbal description, and table row" },
    { ruleCode: "NEP-IDC", application: "Read real maps/graphs to extract coordinate information — connect to map reading" },
  ],

  cbseOutcomes: [
    "Student correctly locates a point in the Cartesian plane given its coordinates",
    "Student names the quadrant or axis on which a given point lies",
    "Student plots points from a table of values and draws a line graph",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "Every point in the plane is uniquely identified by an ordered pair (x, y)",
    "The x-axis and y-axis divide the plane into four quadrants with specific sign patterns",
    "The origin (0, 0) lies at the intersection of the two axes",
    "The order in an ordered pair matters: (3, 5) ≠ (5, 3)",
  ],

  subtopics: [
    { id: "t1", name: "Cartesian System: Axes, Origin, Quadrants", coreConcept: "Two perpendicular axes create a coordinate framework", keyIdea: "Cartesian comes from Descartes — the story motivates the concept", estimatedPeriods: 2 },
    { id: "t2", name: "Plotting and Reading Points", coreConcept: "Ordered pair (x, y) gives unique location: x=horizontal, y=vertical", keyIdea: "Go along x first, then up/down for y — like a map grid", estimatedPeriods: 2 },
    { id: "t3", name: "Quadrant Identification", coreConcept: "Sign of (x, y) determines the quadrant: (+,+) I; (−,+) II; (−,−) III; (+,−) IV", keyIdea: "Memory device: quadrants go anti-clockwise from top-right", estimatedPeriods: 1 },
  ],

  conceptGraph: [
    { from: "mth:6:ch06:integer-on-number-line", to: "mth:9:ch03:x-axis-as-number-line", relationship: "generalises", explanation: "The x-axis is a number line extended to 2D" },
    { from: "mth:9:ch03:ordered-pair-notation", to: "mth:9:ch04:plotting-linear-equations", relationship: "requires", explanation: "Chapter 4 graphs require plotting multiple points from coordinate pairs" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch06", chapterName: "Integers", requiredConcepts: ["mth:6:ch06:integer-on-number-line"] }],
    concepts: ["mth:6:ch06:negative-number-motivation", "mth:7:ch01:integer-multiplication-sign-rules"],
  },

  essentialDefinitions: [
    { term: "Cartesian Plane", formalDefinition: "The plane formed by two mutually perpendicular number lines (axes) intersecting at their zeros", informalExplanation: "A grid made from two number lines — one horizontal, one vertical" },
    { term: "Ordered Pair", formalDefinition: "A pair of numbers (x, y) where order matters; x is the abscissa and y is the ordinate", informalExplanation: "Like a map reference: street first, then house number — order is fixed", counterExample: "(3, 5) and (5, 3) are different points" },
    { term: "Quadrant", formalDefinition: "One of the four regions into which the x-axis and y-axis divide the plane, numbered I–IV anti-clockwise from the positive x, positive y region", informalExplanation: "Four 'rooms' created by the cross of the two axes" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "(3, 5) and (5, 3) are the same point", correction: "The order matters: x comes first, then y. (3,5) is 3 right, 5 up; (5,3) is 5 right, 3 up — different locations", whyItHappens: "Students confuse ordered pair with a set {3, 5} where order doesn't matter", revealingQuestion: "Plot (2, 5) and (5, 2) on the same grid. Are they the same?" },
    { misconception: "A point on the x-axis has zero coordinates", correction: "A point on the x-axis has y = 0 (not both zero). Only the origin has both zero.", whyItHappens: "Students think 'on the axis means at the origin'", revealingQuestion: "What are the coordinates of a point on the y-axis that is 4 units above the origin?" },
    { misconception: "A negative x-coordinate means the point is below the x-axis", correction: "A negative x-coordinate means the point is to the LEFT of the y-axis. The y-coordinate determines up/down.", whyItHappens: "Conflating the signs of x and y coordinates", revealingQuestion: "In which quadrant does (−3, 4) lie?" },
  ],

  examinerTraps: [
    { trap: "Plotting (x, y) as (y, x)", typicalScenario: "Given (−3, 2), student goes up 2 on y-axis then left 3 — correct; but often reverses to go left 3 on x, then up 2 from x-axis position", avoidanceStrategy: "Always start at origin; move horizontally by x first, then vertically by y", marksAtRisk: "½ mark per incorrect point" },
    { trap: "Identifying the quadrant of a point on an axis", typicalScenario: "Point (0, 4) — student says 'Quadrant I' because both look positive", avoidanceStrategy: "A point on an axis does not lie in any quadrant; it lies on the axis itself", marksAtRisk: "1 mark" },
  ],

  typicalMistakes: [
    { mistake: "Plotting (−2, 3) by going right 2 then up 3", correction: "Negative x means LEFT: go left 2 from origin, then up 3", conceptualError: "Not applying the sign to direction" },
    { mistake: "Saying quadrant of (0, 5) is I", correction: "(0, 5) lies on the y-axis — it is not in any quadrant", conceptualError: "Axis points are not in quadrants" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "apply", targetLevels: ["apply", "analyse"], hotsStarters: ["What is the locus of all points with y = 3? Describe and draw.", "A point P is equidistant from both axes. Describe all such points."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Origin and axes: naming and drawing", tier: "foundational", teachingNote: "Draw on graph paper; label everything — make it physical before abstract" },
    { step: 2, concept: "Plotting in Quadrant I only (positive x, positive y)", tier: "easy", dependsOnStep: 1, teachingNote: "Use map coordinates analogy before introducing negatives" },
    { step: 3, concept: "Extending to all four quadrants: sign conventions", tier: "easy", dependsOnStep: 2, teachingNote: "Focus on direction: negative = opposite direction from positive" },
    { step: 4, concept: "Points on axes and at origin", tier: "medium", dependsOnStep: 3, teachingNote: "Emphasise the 'on the axis = one coordinate is zero' rule" },
    { step: 5, concept: "Quadrant identification from sign pattern", tier: "easy", dependsOnStep: 3, teachingNote: "Make a reference table: (sign of x, sign of y) → quadrant" },
  ],

  realLifeApplications: [
    { context: "Maps and GPS coordinates", conceptUsed: "Cartesian coordinate system", explanation: "Latitude and longitude are a coordinate system on the sphere; city maps use grid references that are exactly Cartesian", ageRelevance: "Students use Google Maps daily" },
    { context: "Video games and screen graphics", conceptUsed: "Pixel coordinates (x, y) on screen", explanation: "Every point on a screen has an (x, y) position; game programming uses Cartesian coordinates to position objects", ageRelevance: "Directly connects to gaming interest" },
    { context: "Data visualisation: scatter plots", conceptUsed: "Plotting ordered pairs as data points", explanation: "Every scatter plot in science, economics, and sports analytics is a set of Cartesian coordinate points", ageRelevance: "Students encounter graphs in every subject" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch04", chapterName: "Linear Equations in Two Variables", linkType: "prerequisite-for", description: "Graphing linear equations requires plotting coordinate points" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch07", chapterName: "Coordinate Geometry (Class 10)", linkType: "prerequisite-for", description: "Distance formula, section formula, and area of triangles use this chapter's foundations" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Motion graphs: displacement-time and velocity-time", description: "All motion graphs are Cartesian plots with time on x-axis and displacement/velocity on y-axis", strength: "strong" },
    { subject: "Economics", topic: "Demand and supply curves", description: "Supply/demand graphs are Cartesian plots — price on y-axis, quantity on x-axis", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Tell the Descartes story: fly on ceiling → idea of coordinates", duration: "5 minutes", pedagogyNote: "NEP-IDC: historical motivation; makes abstract concept human and memorable" },
    { step: 2, action: "Draw the Cartesian plane; label origin, axes, positive/negative directions", duration: "10 minutes", pedagogyNote: "Students draw on graph paper — every student has their own copy before proceeding" },
    { step: 3, action: "Plot 10 points across all quadrants; identify quadrant from point", duration: "20 minutes", pedagogyNote: "Include points on axes; explicitly address the 'on-axis' edge case", formativeCheckpoint: "Can students correctly plot all 10 points without error?" },
    { step: 4, action: "Real-data activity: plot city locations on a local map grid", duration: "20 minutes", pedagogyNote: "NEP-IDC: use a real city map; assign coordinate system; students give each location a coordinate" },
    { step: 5, action: "Quadrant identification rules: sign table + practice", duration: "15 minutes", pedagogyNote: "Derive the sign pattern rather than memorise it — reason from the definition of each quadrant" },
  ],
};

// ─── Chapter 4: Linear Equations in Two Variables ────────────────────────────

export const LINEAR_EQUATIONS_TWO_VARIABLES: ChapterKnowledge = {
  chapterId: "ch04", chapterName: "Linear Equations in Two Variables", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Write a linear equation in two variables from a given word problem", bloomsLevel: "apply", assessable: true },
    { statement: "Find multiple solutions of a linear equation by varying one variable", bloomsLevel: "apply", assessable: true },
    { statement: "Represent solutions of a linear equation as a straight line on the Cartesian plane", bloomsLevel: "apply", assessable: true },
    { statement: "Interpret the graph of a linear equation to find solutions", bloomsLevel: "analyse", assessable: true },
    { statement: "Explain why the graph of a linear equation in two variables is always a straight line", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Model a real situation as a linear equation and interpret the graph for decision-making" },
    { ruleCode: "NEP-REPR", application: "Express the same relationship in three forms: equation, table of values, graph" },
    { ruleCode: "NEP-HOT", application: "Evaluate: which points lie on the line y = 2x + 3 without plotting? Justify algebraically" },
  ],

  cbseOutcomes: [
    "Student writes a linear equation in two variables representing a real situation",
    "Student finds any number of solutions by choosing one variable freely",
    "Student draws the graph of a linear equation as a line through at least two plotted points",
    "Student identifies equations of lines parallel to the axes",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "A linear equation in two variables has infinitely many solutions — they form a line",
    "Any solution (x, y) is a point on the graph; any non-solution is off the graph",
    "The graph of ax + by + c = 0 is always a straight line",
    "x = a is a vertical line; y = b is a horizontal line",
    "Two points uniquely determine a straight line",
  ],

  subtopics: [
    { id: "t1", name: "Linear Equations: Form and Solutions", coreConcept: "ax + by + c = 0 has infinitely many (x, y) solutions", keyIdea: "Fix one variable, solve for the other — infinitely many choices", estimatedPeriods: 2 },
    { id: "t2", name: "Graphs of Linear Equations", coreConcept: "All solutions form a straight line on the Cartesian plane", keyIdea: "Plot two points (any two solutions), connect — get the full line", estimatedPeriods: 3 },
    { id: "t3", name: "Special Lines: x = a and y = b", coreConcept: "x = a is vertical; y = b is horizontal; x = 0 is y-axis", keyIdea: "These are degenerate cases where one coefficient is zero", estimatedPeriods: 1 },
  ],

  conceptGraph: [
    { from: "mth:9:ch03:ordered-pair-notation", to: "mth:9:ch04:plotting-solutions", relationship: "requires", explanation: "Plotting solutions of linear equations requires coordinate pair notation from Chapter 3" },
    { from: "mth:7:ch04:simple-equations", to: "mth:9:ch04:linear-equation-two-variables", relationship: "generalises", explanation: "Simple equations in one variable generalise to two variables — one extra degree of freedom" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 9, chapterId: "ch03", chapterName: "Coordinate Geometry", requiredConcepts: ["mth:9:ch03:ordered-pair-notation", "mth:9:ch03:cartesian-plane"] },
      { subject: "Mathematics", classNum: 7, chapterId: "ch04", chapterName: "Simple Equations", requiredConcepts: ["mth:7:ch04:transposition", "mth:7:ch04:equation-solution"] },
    ],
    concepts: ["mth:9:ch03:ordered-pair-notation", "mth:7:ch04:solution-verification"],
  },

  essentialDefinitions: [
    { term: "Linear Equation in Two Variables", formalDefinition: "An equation of the form ax + by + c = 0, where a, b, c are real numbers and a and b are not both zero", informalExplanation: "An equation with two unknowns where neither x nor y has a power greater than 1", example: "3x + 2y = 6, x = 5, y = 0", counterExample: "x² + y = 3 is NOT linear (x has degree 2)" },
    { term: "Solution of a Linear Equation", formalDefinition: "An ordered pair (x₀, y₀) such that ax₀ + by₀ + c = 0", informalExplanation: "A specific (x, y) pair that makes the equation true when substituted" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [
    { name: "Line Theorem for Linear Equations", type: "theorem", statement: "The graph of every linear equation in two variables is a straight line, and every point on the line is a solution of the equation", proofInsight: "Any three solutions of ax+by+c=0 are collinear — they satisfy the equation for any x and y on the line", boardRelevance: "Statement is tested in 1-mark short-answer questions" },
  ],

  commonMisconceptions: [
    { misconception: "A linear equation has only one solution", correction: "A linear equation in TWO variables has infinitely many solutions — each choice of x gives a unique y", whyItHappens: "Students carry over the 'one solution' expectation from Class 7/8 equations in one variable", revealingQuestion: "How many solutions does 2x + y = 5 have? Find three of them." },
    { misconception: "You need to find all solutions before drawing the graph", correction: "Two solutions (points) are sufficient to draw the line; additional points only verify", whyItHappens: "Students don't realise a line is determined by any two of its points", revealingQuestion: "What is the minimum number of points you need to plot to draw the graph of 3x − 2y = 6?" },
    { misconception: "x = 4 is not a linear equation in two variables", correction: "x = 4 can be written as x + 0·y = 4 — it is a linear equation in two variables with coefficient of y equal to 0; its graph is a vertical line", whyItHappens: "Students require both variables to appear explicitly", revealingQuestion: "Is x = 3 a linear equation in two variables? Draw its graph." },
  ],

  examinerTraps: [
    { trap: "Using only one point to draw the graph", typicalScenario: "Student plots only one solution and draws the line through that point and the origin — incorrect unless the line actually passes through origin", avoidanceStrategy: "Always plot at least two solution points; the line through those two points is uniquely determined", marksAtRisk: "1 mark for the graph; potentially more for wrong interpretation" },
    { trap: "Confusing x = a (vertical) with y = a (horizontal)", typicalScenario: "Student draws a horizontal line for x = 3", avoidanceStrategy: "x = 3 means 'x is always 3, y can be anything' → vertical line. y = 3 means 'y is always 3, x can be anything' → horizontal line", marksAtRisk: "1 mark for the wrong graph type" },
  ],

  typicalMistakes: [
    { mistake: "For 2x + 3y = 6, when x = 0, y = 6/2 = 3", correction: "When x = 0: 3y = 6, y = 2. The coefficient of y (which is 3) divides 6, not the coefficient of x", conceptualError: "Dividing by the wrong coefficient in substitution" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Without drawing, determine whether (2, 1) lies on the graph of 3x + 4y = 10", "A line passes through (1, 2) and (3, 4). Write its equation and confirm a third point"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Forming linear equations from word problems", tier: "easy", teachingNote: "Use familiar contexts: cost, age, distance" },
    { step: 2, concept: "Finding solutions by substitution", tier: "easy", dependsOnStep: 1, teachingNote: "Create a table of values; emphasise there are infinitely many" },
    { step: 3, concept: "Plotting solutions and drawing the line", tier: "medium", dependsOnStep: 2, teachingNote: "Bridge from Chapter 3 coordinate plotting" },
    { step: 4, concept: "Reading solutions from the graph", tier: "medium", dependsOnStep: 3, teachingNote: "Reading is the inverse of plotting — pick any point on the line" },
    { step: 5, concept: "Graphs of x = a and y = b", tier: "medium", dependsOnStep: 3, teachingNote: "Special case: one coefficient is zero — vertical or horizontal line results" },
  ],

  realLifeApplications: [
    { context: "Cost equation: total cost of items at different quantities", conceptUsed: "Linear equation in two variables", explanation: "If apples cost ₹20 and oranges cost ₹30, and total spent is ₹180: 20x + 30y = 180. Infinitely many combinations satisfy this.", ageRelevance: "Students make buying decisions daily" },
    { context: "Speed, distance, time relationships", conceptUsed: "Linear equation model", explanation: "At constant speed v, the relationship d = vt is a linear equation in d and t — its graph is a straight line through origin", ageRelevance: "Connects to Physics motion chapter" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch03", chapterName: "Coordinate Geometry", linkType: "builds-on", description: "Coordinate plotting from Chapter 3 is the tool for graphing in this chapter" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch03", chapterName: "Pair of Linear Equations", linkType: "prerequisite-for", description: "Solving pairs of equations by graphical method requires this chapter's graphing skill" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Distance-time and velocity-time graphs", description: "Both are linear equation graphs with physical interpretation of slope", strength: "strong" },
    { subject: "Economics", topic: "Demand and supply equations", description: "Demand curve Qd = a − bP is a linear equation in Q and P", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Word problem: apples and oranges cost ₹100. Write an equation for the combinations.", duration: "10 minutes", pedagogyNote: "NEP-PROB: model-first approach; equation emerges from the problem" },
    { step: 2, action: "Find 5 solutions by making a table; discuss how many solutions exist", duration: "15 minutes", pedagogyNote: "NEP-REFL: 'How many solutions does a one-variable equation have vs two-variable?' Let students articulate the difference" },
    { step: 3, action: "Plot the solutions on the Cartesian plane; observe they form a line", duration: "20 minutes", pedagogyNote: "Use graph paper; connect points and extend — the line represents ALL solutions" },
    { step: 4, action: "Practice: pick any point on/off the line and verify if it satisfies the equation", duration: "15 minutes", pedagogyNote: "NEP-HOT: students discover that on-line ⟺ solution, off-line ⟺ not solution" },
    { step: 5, action: "Equations of lines parallel to axes: x = a and y = b", duration: "15 minutes", pedagogyNote: "Special cases — derive from general form when one coefficient is zero" },
  ],
};

// ─── Chapter 5: Introduction to Euclid's Geometry ────────────────────────────

export const EUCLIDS_GEOMETRY: ChapterKnowledge = {
  chapterId: "ch05", chapterName: "Introduction to Euclid's Geometry", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Distinguish between axioms, postulates, and theorems", bloomsLevel: "understand", assessable: true },
    { statement: "State and explain Euclid's five postulates", bloomsLevel: "remember", assessable: true },
    { statement: "Derive simple theorems from axioms using logical reasoning", bloomsLevel: "apply", assessable: true },
    { statement: "Explain what equivalent versions of Euclid's fifth postulate mean", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-REFL", application: "Reflect on the nature of mathematical truth: why do we need axioms? What cannot be proved?" },
    { ruleCode: "NEP-HOT", application: "Evaluate the fifth postulate: why was it controversial? What happens if we reject it?" },
    { ruleCode: "NEP-PROB", application: "Given axioms, derive that two distinct lines can intersect at most at one point" },
  ],

  cbseOutcomes: [
    "Student explains the axiomatic approach to geometry",
    "Student states Euclid's five postulates and five common notions (axioms)",
    "Student uses axioms to justify simple geometric claims",
    "Student describes the controversy around the fifth postulate and its equivalent forms",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "An axiom (common notion) is assumed true without proof; it is self-evident",
    "A postulate is assumed true for a specific domain (geometry)",
    "A theorem is a statement proved using axioms, postulates, and previously proved theorems",
    "Undefined terms (point, line, plane) are the starting primitives of geometry",
    "The fifth postulate (parallel postulate) is the most controversial — rejecting it gives non-Euclidean geometry",
  ],

  subtopics: [
    { id: "t1", name: "Euclid's Definitions, Axioms, and Postulates", coreConcept: "Mathematical structure: start from undefined terms, then axioms, then prove everything else", keyIdea: "Euclid's Elements is the earliest example of an axiomatic system", estimatedPeriods: 2 },
    { id: "t2", name: "Euclid's Five Postulates", coreConcept: "Five postulates are the rules of the Euclidean geometry game", keyIdea: "The fifth postulate (parallel postulate) is uniquely complex and non-obvious", estimatedPeriods: 2 },
    { id: "t3", name: "Equivalent Versions of the Fifth Postulate", coreConcept: "Playfair's axiom is equivalent to the fifth postulate", keyIdea: "Through a point not on a line, exactly one parallel line exists (Playfair) = fifth postulate", estimatedPeriods: 1 },
  ],

  conceptGraph: [
    { from: "mth:9:ch05:axiom-definition", to: "mth:9:ch05:postulate-definition", relationship: "generalises", explanation: "Axioms are general truths; postulates are geometric-domain specific truths" },
    { from: "mth:9:ch05:postulate-5", to: "mth:9:ch06:parallel-lines-properties", relationship: "applies", explanation: "Properties of parallel lines in Chapter 6 rest on the fifth postulate" },
    { from: "mth:9:ch05:euclid-axiomatic-approach", to: "mth:9:ch07:triangle-congruence", relationship: "applies", explanation: "Congruence criteria are theorems proved from postulates" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch04", chapterName: "Basic Geometrical Ideas", requiredConcepts: ["mth:6:ch04:point-line-distinction", "mth:6:ch04:angle-types"] }],
    concepts: ["mth:6:ch04:point-line-distinction"],
  },

  essentialDefinitions: [
    { term: "Axiom (Common Notion)", formalDefinition: "A statement that is accepted as true without proof — self-evidently true in any context", informalExplanation: "A rule everyone agrees on without argument: 'things equal to the same thing are equal to each other'" },
    { term: "Postulate", formalDefinition: "A statement specific to a particular domain (geometry) that is accepted without proof", informalExplanation: "A geometry-specific rule: 'a straight line can be drawn from any point to any other point'" },
    { term: "Theorem", formalDefinition: "A statement that can be proved true using axioms, postulates, and previously proved theorems", informalExplanation: "A fact about geometry that we can prove — not assumed, but derived" },
    { term: "Corollary", formalDefinition: "A theorem that follows easily from a previously proved theorem", informalExplanation: "A bonus result: once you prove something big, a smaller consequence comes for free" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [
    { name: "Euclid's Five Postulates", type: "postulate", statement: "1. A straight line can be drawn from any point to any other point. 2. A terminated line can be extended indefinitely. 3. A circle can be drawn with any centre and any radius. 4. All right angles are equal. 5. If a line falling on two lines makes interior angles on one side less than two right angles, those two lines, extended indefinitely, meet on that side.", boardRelevance: "State the postulates as 1-mark fill-in-the-blank or 2-mark short-answer questions; the fifth postulate is often specially asked" },
    { name: "Playfair's Axiom (equivalent to 5th Postulate)", type: "axiom", statement: "For every line l and every point P not lying on l, there exists a unique line through P parallel to l", proofInsight: "Playfair's axiom and Euclid's fifth postulate are logically equivalent — each can be proved from the other (in the presence of the other four postulates)", limitations: "In non-Euclidean geometries, this axiom is replaced — giving hyperbolic or elliptic geometries", boardRelevance: "2-mark question: state Playfair's axiom; 3-mark: explain its equivalence to fifth postulate" },
  ],

  commonMisconceptions: [
    { misconception: "Axioms are guesses or assumptions that might be wrong", correction: "Axioms are the agreed-upon starting rules of a mathematical system. Within that system, they are definitionally true. If you change the axioms, you get a different (non-Euclidean) geometry — both are valid", whyItHappens: "Everyday use of 'assumption' suggests uncertainty; mathematical axioms are deliberate choices not uncertainties", revealingQuestion: "Why did mathematicians try for 2000 years to prove the fifth postulate from the other four?" },
    { misconception: "A theorem is an axiom that someone proved", correction: "Axioms are not proved — they are the starting points. Theorems are proved FROM axioms. This distinction is fundamental", whyItHappens: "Students see both as 'true statements' and don't appreciate the hierarchy", revealingQuestion: "What is the difference between an axiom and a theorem? Give one example of each." },
  ],

  examinerTraps: [
    { trap: "Confusing the numbering of Euclid's postulates", typicalScenario: "Students remember that there are 5 postulates but confuse which is the fifth (parallel postulate)", avoidanceStrategy: "The fifth postulate is the one that mentions making angles less than two right angles — the most complex phrasing", marksAtRisk: "1 mark for wrong postulate stated" },
  ],

  typicalMistakes: [
    { mistake: "Saying 'a line has a definite length' from Euclid's definitions", correction: "Euclid's line has no endpoints and extends infinitely; a line segment has definite length", conceptualError: "Confusing line with line segment" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "remember", masteryLevel: "understand", targetLevels: ["remember", "understand", "evaluate"], hotsStarters: ["Why was the fifth postulate controversial for 2000 years?", "What geometry results if we assume two parallel lines through a given external point exist?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Historical motivation: why Euclid needed axioms", tier: "foundational", teachingNote: "Story of Elements: 300 BCE, Euclid's project to prove all of geometry from 5 postulates" },
    { step: 2, concept: "Undefined terms: point, line, plane", tier: "easy", dependsOnStep: 1, teachingNote: "Acknowledge the circularity: point is defined using space, space using point — we must start somewhere" },
    { step: 3, concept: "Five common notions (axioms)", tier: "easy", dependsOnStep: 2, teachingNote: "State and illustrate each with concrete examples" },
    { step: 4, concept: "First four postulates — intuitive and geometric", tier: "easy", dependsOnStep: 3, teachingNote: "These are straightforward; build confidence before the fifth" },
    { step: 5, concept: "Fifth postulate — complexity and controversy", tier: "medium", dependsOnStep: 4, teachingNote: "Explain WHY this was controversial: it seems like it should be provable but isn't" },
    { step: 6, concept: "Playfair's axiom as equivalent form", tier: "medium", dependsOnStep: 5, teachingNote: "Show Playfair is simpler to state; explain what 'equivalent' means" },
  ],

  realLifeApplications: [
    { context: "GPS and non-Euclidean geometry on Earth", conceptUsed: "Fifth postulate / parallel lines", explanation: "On the Earth's surface (sphere), parallel lines eventually meet (at poles) — non-Euclidean geometry. GPS calculations use spherical geometry that violates Euclid's fifth postulate", ageRelevance: "Students use GPS every day" },
    { context: "Legal system: axioms as laws", conceptUsed: "Axiomatic systems", explanation: "A legal system starts with a constitution (axioms), derives laws (theorems) from it. Changing the constitution changes the entire legal system — like changing axioms changes the geometry", ageRelevance: "Connects mathematics to civic education" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch06", chapterName: "Lines and Angles", linkType: "prerequisite-for", description: "All theorems about lines and angles are proved from Euclid's postulates" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "prerequisite-for", description: "Congruence theorems are proved from Euclid's axioms and postulates" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Newton's laws as axioms of mechanics", description: "Newton's three laws play the same role as Euclid's postulates — they are the starting axioms from which all classical mechanics is derived", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Tell the story of Euclid's Elements: 2300 years old, most reprinted book after the Bible", duration: "10 minutes", pedagogyNote: "NEP-IDC: history of mathematics; inspires appreciation for the rigour of the subject" },
    { step: 2, action: "Define undefined terms, axioms, postulates, theorems with examples from everyday life", duration: "15 minutes", pedagogyNote: "Use legal analogy: constitution (axioms), laws derived (theorems)" },
    { step: 3, action: "State and discuss all five common notions with geometric illustrations", duration: "15 minutes", pedagogyNote: "Each common notion illustrated with a diagram — visual is essential here" },
    { step: 4, action: "State all five postulates; discuss first four intuitively", duration: "20 minutes", pedagogyNote: "First four: straightforward. Take time to unpack the language of each" },
    { step: 5, action: "Deep discussion of fifth postulate: WHY was it controversial for 2000 years?", duration: "15 minutes", pedagogyNote: "NEP-REFL: what makes a postulate 'feel' like it should be provable? The fifth is more complex than the others" },
    { step: 6, action: "Playfair's axiom: state, compare with Euclid's fifth, introduce non-Euclidean geometries briefly", duration: "10 minutes", pedagogyNote: "This opens mathematical curiosity beyond the syllabus — a worthwhile horizon" },
  ],
};

// ─── Chapter 6: Lines and Angles ─────────────────────────────────────────────

export const LINES_AND_ANGLES: ChapterKnowledge = {
  chapterId: "ch06", chapterName: "Lines and Angles", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Identify and classify pairs of angles (complementary, supplementary, vertically opposite, co-interior)", bloomsLevel: "understand", assessable: true },
    { statement: "Apply angle properties at a point and on a straight line to calculate unknown angles", bloomsLevel: "apply", assessable: true },
    { statement: "Use properties of parallel lines cut by a transversal to find angle relationships", bloomsLevel: "apply", assessable: true },
    { statement: "Prove theorems about lines and angles using Euclid's axiomatic approach", bloomsLevel: "evaluate", assessable: true },
    { statement: "Apply the angle sum property of a triangle", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Prove the vertically opposite angles theorem using axioms — not accept it as obvious" },
    { ruleCode: "NEP-HOT", application: "In a diagram with parallel lines and triangles, find all angles from minimal given information" },
    { ruleCode: "NEP-REPR", application: "Justify each angle step with the theorem name — not just state the answer" },
  ],

  cbseOutcomes: [
    "Student identifies and names angle pairs in geometric figures",
    "Student applies linear pair, vertically opposite angles, and corresponding/alternate/co-interior angle theorems",
    "Student proves selected theorems (vertically opposite, angle sum of triangle, exterior angle)",
    "Student uses the exterior angle theorem for triangles",
  ],

  icseOutcomes: [
    "ICSE additionally expects: proofs of corresponding angles, alternate angles, and co-interior angles as formal theorems (not just properties to apply)",
  ],

  coreConcepts: [
    "Angles on a straight line sum to 180°",
    "Angles at a point sum to 360°",
    "Vertically opposite angles are equal",
    "When a transversal cuts parallel lines: corresponding angles equal, alternate interior angles equal, co-interior angles supplementary",
    "The angle sum of any triangle is 180°",
    "An exterior angle of a triangle equals the sum of the two non-adjacent interior angles",
  ],

  subtopics: [
    { id: "t1", name: "Basic Angle Types and Pairs", coreConcept: "Pairs of angles have specific relationships based on position", keyIdea: "Adjacent, complementary, supplementary, linear pair — position defines the relationship", estimatedPeriods: 2 },
    { id: "t2", name: "Intersecting Lines: Vertically Opposite Angles", coreConcept: "Two intersecting lines form two pairs of vertically opposite angles; each pair is equal", keyIdea: "Both angles together with the same angle form a straight line — so they must be equal", estimatedPeriods: 2 },
    { id: "t3", name: "Parallel Lines and Transversal", coreConcept: "A transversal creates 8 angles; corresponding/alternate/co-interior angle relationships apply", keyIdea: "Corresponding angles are equal because they are in the same position relative to their respective intersection", estimatedPeriods: 3 },
    { id: "t4", name: "Angle Sum Property and Exterior Angle", coreConcept: "Triangle interior angles sum to 180°; exterior angle = sum of opposite interior angles", keyIdea: "Prove using parallel line through vertex — connects parallel lines to triangles", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:9:ch05:euclid-axiom-things-equal", to: "mth:9:ch06:vertically-opposite-proof", relationship: "applies", explanation: "Vertically opposite angle proof uses Euclid's axiom: equals subtracted from equals are equal" },
    { from: "mth:9:ch05:postulate-5", to: "mth:9:ch06:parallel-lines-properties", relationship: "requires", explanation: "The corresponding angle theorem for parallel lines requires the parallel postulate" },
    { from: "mth:9:ch06:parallel-lines-properties", to: "mth:9:ch06:angle-sum-triangle", relationship: "applies", explanation: "Angle sum of triangle is proved by drawing a line through a vertex parallel to the opposite side" },
    { from: "mth:9:ch06:angle-sum-triangle", to: "mth:9:ch07:exterior-angle-theorem", relationship: "applies", explanation: "Exterior angle theorem is derived from the angle sum property" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 9, chapterId: "ch05", chapterName: "Introduction to Euclid's Geometry", requiredConcepts: ["mth:9:ch05:postulate-5", "mth:9:ch05:euclid-axiom-things-equal"] },
      { subject: "Mathematics", classNum: 6, chapterId: "ch04", chapterName: "Basic Geometrical Ideas", requiredConcepts: ["mth:6:ch04:angle-types"] },
    ],
    concepts: ["mth:6:ch04:angle-types", "mth:6:ch05:angle-types-degrees"],
  },

  essentialDefinitions: [
    { term: "Linear Pair", formalDefinition: "Two adjacent angles whose non-common arms form a straight line, summing to 180°", informalExplanation: "Two angles sitting side by side on a straight line — they must add up to a half turn (180°)" },
    { term: "Vertically Opposite Angles", formalDefinition: "When two lines intersect, the pair of angles on opposite sides of the intersection are called vertically opposite angles", informalExplanation: "The X-shaped angles at a crossing — the ones 'across' from each other, not adjacent" },
    { term: "Transversal", formalDefinition: "A line that intersects two or more other lines at distinct points", informalExplanation: "A line that cuts across other lines — like a road crossing two parallel streets" },
    { term: "Corresponding Angles", formalDefinition: "Angles in the same position at each intersection when a transversal cuts two lines", informalExplanation: "Both angles are 'above the line and to the right of the transversal' — same position, different intersection" },
    { term: "Alternate Interior Angles", formalDefinition: "A pair of angles between the two lines, on opposite sides of the transversal", informalExplanation: "They look like a Z or N shape — they're inside, on alternate sides" },
    { term: "Co-interior Angles (Same-side Interior)", formalDefinition: "A pair of angles between the two lines, on the same side of the transversal; they sum to 180°", informalExplanation: "They look like a C shape — inside, on the same side, and supplementary for parallel lines" },
  ],

  formulaInventory: [
    { name: "Angle Sum of Triangle", latex: "\\angle A + \\angle B + \\angle C = 180°", plainText: "∠A + ∠B + ∠C = 180°", variables: [{ symbol: "∠A, ∠B, ∠C", meaning: "interior angles of the triangle" }], applicableWhen: "Any triangle in the Euclidean plane", doesNotApplyWhen: "On a sphere (spherical triangle angle sum > 180°)", examTip: "Use this to find the third angle; also used in proofs" },
    { name: "Exterior Angle Theorem", latex: "\\text{Exterior angle} = \\angle A + \\angle B", plainText: "Exterior angle = sum of two non-adjacent interior angles", variables: [{ symbol: "∠A, ∠B", meaning: "the two interior angles not adjacent to the exterior angle" }], applicableWhen: "Any exterior angle of a triangle (formed by extending one side)", doesNotApplyWhen: "Do not confuse the exterior angle with the adjacent interior angle", examTip: "The exterior angle is ALWAYS greater than either of the two non-adjacent interior angles" },
  ],

  lawsAndTheorems: [
    { name: "Vertically Opposite Angles Theorem", type: "theorem", statement: "If two lines intersect, the vertically opposite angles are equal", proofInsight: "Both vertically opposite angles are supplementary to the same angle (the one between them); hence they are equal to each other", boardRelevance: "Standard 2-mark proof question; also applied in larger proofs" },
    { name: "Corresponding Angles Theorem (Parallel Lines)", type: "theorem", statement: "If a transversal intersects two parallel lines, corresponding angles are equal", proofInsight: "Follows from Euclid's fifth postulate — the uniqueness of parallel lines", boardRelevance: "Applied in almost every lines-and-angles numerical; stated in proofs" },
    { name: "Angle Sum Property of Triangle", type: "theorem", statement: "The sum of the three interior angles of a triangle is 180°", proofInsight: "Draw line through one vertex parallel to the opposite side; create alternate angles; the three angles at the vertex now sum to a straight angle", boardRelevance: "Most frequently used theorem across all geometry chapters" },
  ],

  commonMisconceptions: [
    { misconception: "Vertically opposite angles are the angles that share a vertex", correction: "All four angles at an intersection share the same vertex. Vertically opposite angles are specifically the non-adjacent pair — the ones 'across' from each other", whyItHappens: "The word 'opposite' doesn't specify 'across' clearly enough", revealingQuestion: "In the figure of two intersecting lines, circle the two pairs of vertically opposite angles." },
    { misconception: "Co-interior angles are equal for parallel lines", correction: "Corresponding angles and alternate interior angles are equal; co-interior angles are supplementary (sum to 180°)", whyItHappens: "Students know parallel lines create equal angles and over-apply this to co-interior pairs", revealingQuestion: "Find the missing angle: lines are parallel, one co-interior angle is 70°." },
  ],

  examinerTraps: [
    { trap: "Not naming the theorem used for each angle step", typicalScenario: "Student writes '∠2 = 50°' without stating 'corresponding angles, PQ ∥ RS'", avoidanceStrategy: "Every angle deduction must cite: (1) the angle relationship, (2) the reason (theorem name), (3) the parallel lines or given condition", marksAtRisk: "½ mark per unjustified step in a proof question" },
    { trap: "Exterior angle confusion: using the adjacent angle instead of the exterior angle", typicalScenario: "Student identifies the wrong angle as the exterior angle (the supplementary interior angle instead)", avoidanceStrategy: "The exterior angle is formed by EXTENDING one side of the triangle beyond the vertex", marksAtRisk: "Full marks for wrong angle setup" },
  ],

  typicalMistakes: [
    { mistake: "∠1 and ∠2 are corresponding because they are equal", correction: "Corresponding angles are equal BECAUSE lines are parallel — not the other way around. For non-parallel lines, corresponding angles are not equal", conceptualError: "Circular reasoning: using the property as the definition" },
    { mistake: "Alternate interior angles are adjacent angles between the parallel lines", correction: "Alternate interior angles are on OPPOSITE sides of the transversal", conceptualError: "Misidentifying the 'alternate' (opposite-side) criterion" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["Prove that vertically opposite angles are equal using Euclid's axioms", "If one of four angles at an intersection is 50°, find all four angles with justification"] },
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["In a diagram with two parallel lines, a transversal, and a triangle, find all 10+ angles", "If one angle is given, how many other angles can you find? Which are determined and which are free?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Angle types: acute, obtuse, right, reflex, straight, complete", tier: "foundational", teachingNote: "Review from Class 6; ensure all terms are clear before proceeding" },
    { step: 2, concept: "Complementary and supplementary angle pairs", tier: "easy", dependsOnStep: 1, teachingNote: "Numerical practice: find the complement/supplement given one angle" },
    { step: 3, concept: "Linear pair: angles on a straight line", tier: "easy", dependsOnStep: 2, teachingNote: "Physically fold paper along a line — the two sides together form 180°" },
    { step: 4, concept: "Vertically opposite angles: discovery and proof", tier: "medium", dependsOnStep: 3, teachingNote: "Let students measure first; then prove algebraically" },
    { step: 5, concept: "Parallel lines: identify corresponding, alternate, co-interior", tier: "medium", dependsOnStep: 4, teachingNote: "Use the F, Z, C shape memory aids for identification" },
    { step: 6, concept: "Apply parallel line angle properties to calculate angles", tier: "medium", dependsOnStep: 5, teachingNote: "Multi-step calculations involving several pairs" },
    { step: 7, concept: "Angle sum of triangle: proof using parallel line", tier: "hard", dependsOnStep: 6, teachingNote: "This proof combines both parallel lines and the angle sum — a synthesis" },
    { step: 8, concept: "Exterior angle theorem and its applications", tier: "hard", dependsOnStep: 7, teachingNote: "Apply in more complex figures with multiple triangles" },
  ],

  realLifeApplications: [
    { context: "Railway tracks and road intersections", conceptUsed: "Parallel lines and transversal angles", explanation: "Railway lines are parallel; a crossing road is a transversal. The angle the road makes on both sides of each track are corresponding angles", ageRelevance: "Students see railway crossings; the equal angles ensure safety-crossing design" },
    { context: "Scissors and knitting needles", conceptUsed: "Vertically opposite angles", explanation: "When scissors open, the blade angle and handle angle are vertically opposite — both equal as scissors open or close", ageRelevance: "Physical object makes the abstraction concrete" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "prerequisite-for", description: "All triangle congruence proofs use angle properties from this chapter" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch08", chapterName: "Quadrilaterals", linkType: "prerequisite-for", description: "Quadrilateral angle-sum (360°) proved by dividing into two triangles using 180° sum" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Laws of reflection and refraction (ray diagrams)", description: "Angle of incidence and angle of reflection are angle pairs; normal is the transversal — alternate angles at point of reflection equal angle of incidence", strength: "strong" },
    { subject: "Computer Science", topic: "Computer graphics: angle calculations for rendering", description: "Rendering engines calculate angles for lighting, reflection, and shadow — all use the same angle relationships", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Review angle types and measurement; introduce linear pair with protractor activity", duration: "10 minutes", pedagogyNote: "Hands-on: measure angles at an intersection with a protractor; discover vertically opposite equality empirically" },
    { step: 2, action: "Prove vertically opposite angles theorem from axioms; state it formally", duration: "20 minutes", pedagogyNote: "NEP-PROB: proof-as-problem — students derive it from linear pair axiom before seeing the proof" },
    { step: 3, action: "Introduce parallel lines: draw two parallel lines and a transversal; identify the 8 angles", duration: "15 minutes", pedagogyNote: "Colour-code the pairs: corresponding (same colour), alternate (same colour), co-interior" },
    { step: 4, action: "Apply angle properties: numerical problems with parallel lines", duration: "25 minutes", pedagogyNote: "Always ask: 'How do you KNOW these lines are parallel?' — the given condition must be cited" },
    { step: 5, action: "Prove angle sum of triangle; apply exterior angle theorem", duration: "25 minutes", pedagogyNote: "NEP-HOT: after the proof, ask 'Can a triangle have two right angles? Two obtuse angles?' — test using the theorem" },
    { step: 6, action: "Board-level multi-step problems: find all angles in complex figures", duration: "25 minutes", pedagogyNote: "Build systematically: label every angle, work from what is given, cite theorems at each step" },
  ],
};

// ─── Chapter 7: Triangles ─────────────────────────────────────────────────────

export const TRIANGLES: ChapterKnowledge = {
  chapterId: "ch07", chapterName: "Triangles", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Apply the four congruence criteria (SSS, SAS, ASA/AAS, RHS) to establish congruence", bloomsLevel: "apply", assessable: true },
    { statement: "Prove properties of isosceles triangles using congruence", bloomsLevel: "evaluate", assessable: true },
    { statement: "Use the angle-side inequality to order angles and sides of a triangle", bloomsLevel: "analyse", assessable: true },
    { statement: "Prove that the sum of any two sides of a triangle exceeds the third side", bloomsLevel: "evaluate", assessable: true },
    { statement: "Write a formal geometric proof citing congruence criteria with correct format", bloomsLevel: "create", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Prove congruence from given information — choose the correct criterion without being told which" },
    { ruleCode: "NEP-HOT", application: "Determine whether given data is sufficient for congruence; identify which pairs of triangles are congruent in a figure without labelling" },
    { ruleCode: "NEP-REFL", application: "Explain why SSA is NOT a congruence criterion with a concrete counterexample" },
    { ruleCode: "NEP-REPR", application: "Write a geometric proof in formal two-column or paragraph format with every step cited" },
  ],

  cbseOutcomes: [
    "Student states the four congruence criteria (SSS, SAS, ASA, RHS) and explains why SSA is not a criterion",
    "Student proves triangles congruent using appropriate criteria, with corresponding parts cited correctly",
    "Student proves and applies properties of isosceles triangles",
    "Student applies the triangle inequality (sum of two sides > third side)",
    "Student applies the angle-side inequality (larger angle faces larger side)",
  ],

  icseOutcomes: [
    "ICSE expects: formal two-column proof format (Statement | Reason) for all triangle proofs",
    "ICSE additionally tests: proof of the midpoint theorem (connecting midpoints of two sides gives a line parallel to third side and half as long)",
  ],

  coreConcepts: [
    "Two triangles are congruent if they are identical in shape AND size — one fits exactly on the other",
    "Congruence criteria (SSS, SAS, ASA, AAS, RHS) specify minimum information needed to establish congruence",
    "Corresponding parts of congruent triangles are equal (CPCT/CPCTC)",
    "In an isosceles triangle, the angles opposite equal sides are equal (and conversely)",
    "The larger the angle, the longer the opposite side (angle-side inequality)",
    "Triangle inequality: sum of any two sides > third side",
  ],

  subtopics: [
    { id: "t1", name: "Congruence of Triangles: Criteria", coreConcept: "Minimum conditions for two triangles to be identical in shape and size", keyIdea: "Not all combinations of 3 equal measurements guarantee congruence (SSA fails)", estimatedPeriods: 4 },
    { id: "t2", name: "Properties of Isosceles Triangles", coreConcept: "Equal sides ↔ equal opposite angles", keyIdea: "Proved using congruence — the triangle is its own mirror image", estimatedPeriods: 2 },
    { id: "t3", name: "Inequalities in a Triangle", coreConcept: "Longer side faces larger angle; sum of two sides exceeds the third", keyIdea: "Geometry has an ordering structure, not just equalities", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:9:ch06:angle-sum-triangle", to: "mth:9:ch07:congruence-criteria-asa", relationship: "applies", explanation: "ASA criterion uses the angle-sum property to establish the third angle" },
    { from: "mth:9:ch07:congruence-criteria-sas", to: "mth:9:ch07:isosceles-angle-base-theorem", relationship: "applies", explanation: "Isosceles triangle theorem proved by showing the triangle is congruent to itself (reflected)" },
    { from: "mth:9:ch07:congruence-criteria-rhs", to: "mth:9:ch07:perpendicular-bisector-property", relationship: "applies", explanation: "Perpendicular from vertex to base of isosceles triangle creates two RHS-congruent triangles" },
    { from: "mth:9:ch07:congruence-criteria-sss", to: "mth:9:ch07:triangle-inequality", relationship: "requires", explanation: "Triangle inequality ensures that three given lengths can actually form a triangle" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 9, chapterId: "ch06", chapterName: "Lines and Angles", requiredConcepts: ["mth:9:ch06:angle-sum-triangle", "mth:9:ch06:vertically-opposite-proof", "mth:9:ch06:corresponding-angles"] },
      { subject: "Mathematics", classNum: 7, chapterId: "ch07", chapterName: "The Triangle and Its Properties", requiredConcepts: ["mth:7:ch06:angle-sum-triangle", "mth:7:ch06:exterior-angle-theorem", "mth:7:ch06:pythagoras-theorem"] },
    ],
    concepts: ["mth:9:ch06:vertically-opposite-proof", "mth:7:ch07:congruence-criteria-sas"],
  },

  essentialDefinitions: [
    { term: "Congruent Triangles", formalDefinition: "Two triangles are congruent if their corresponding sides and corresponding angles are all equal", informalExplanation: "One triangle fits exactly on the other — same shape and same size, possibly flipped or rotated", example: "△ABC ≅ △PQR means AB=PQ, BC=QR, CA=RP and ∠A=∠P, ∠B=∠Q, ∠C=∠R" },
    { term: "CPCT (CPCTC)", formalDefinition: "Corresponding Parts of Congruent Triangles are Congruent — once two triangles are proved congruent, all remaining corresponding parts are automatically equal", informalExplanation: "Once you prove two triangles match, you get all their measurements equal for free" },
    { term: "SSS Criterion", formalDefinition: "If three sides of one triangle are equal to three sides of another triangle, the triangles are congruent", informalExplanation: "If all sides match, everything matches — the triangles must be identical" },
    { term: "SAS Criterion", formalDefinition: "If two sides and the included angle of one triangle equal two sides and the included angle of another, the triangles are congruent", informalExplanation: "The angle must be BETWEEN the two sides — this is what 'included' means" },
    { term: "ASA / AAS Criterion", formalDefinition: "If two angles and the included side (ASA) or any two angles and a non-included side (AAS) are equal, the triangles are congruent", informalExplanation: "Knowing two angles determines the third; knowing the size sets the scale" },
    { term: "RHS Criterion", formalDefinition: "If the hypotenuse and one leg of a right triangle equal the hypotenuse and one leg of another right triangle, the triangles are congruent", informalExplanation: "For right triangles only: knowing the longest side and one other side is sufficient", counterExample: "RHS does NOT apply to non-right triangles (SSA is not a valid criterion)" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [
    { name: "Isosceles Triangle Theorem (Pons Asinorum)", type: "theorem", statement: "In an isosceles triangle, the angles opposite the equal sides are equal", proofInsight: "Draw the angle bisector of the apex angle; creates two SAS-congruent triangles; CPCT gives base angles equal", discoveredBy: "Euclid — the 'Bridge of Asses', first serious theorem in Elements", boardRelevance: "Proof is standard 3-mark question; apply in almost every triangle problem" },
    { name: "Converse of Isosceles Theorem", type: "theorem", statement: "If two angles of a triangle are equal, then the sides opposite them are equal", boardRelevance: "Used to prove a triangle is isosceles from angle information" },
    { name: "Triangle Inequality", type: "theorem", statement: "The sum of any two sides of a triangle is greater than the third side", proofInsight: "Proved by showing the straight-line path (third side) is shorter than the detour (sum of two other sides)", boardRelevance: "1-2 mark application: check if given lengths can form a triangle; comparison questions" },
    { name: "Angle-Side Inequality", type: "theorem", statement: "In a triangle, the greater angle is opposite the greater side (and conversely)", boardRelevance: "Order angles given side lengths, or order sides given angle measures" },
  ],

  commonMisconceptions: [
    { misconception: "SSA (Side-Side-Angle) is a valid congruence criterion", correction: "SSA is NOT a valid criterion — two non-congruent triangles can have two equal sides and an equal non-included angle. This is the 'ambiguous case'", whyItHappens: "Students see 3 measurements specified and think that's always enough", revealingQuestion: "Draw two non-congruent triangles with AB=PQ=4, BC=QR=6, ∠A=∠P=30°. Can you find two different triangles?" },
    { misconception: "CPCT can be used before proving congruence", correction: "CPCT is the CONCLUSION of a congruence proof — it cannot be used as a step before proving the triangles are congruent", whyItHappens: "Students use equal parts as the reason for congruence — circular reasoning", revealingQuestion: "In a proof, a student writes '∠A=∠P (CPCT)' at step 2. What is wrong with this?" },
    { misconception: "Two triangles with the same area are congruent", correction: "Congruence requires identical shape AND size. Equal area means same size but not necessarily same shape (a 3-4-5 triangle and a 2.5-6-6.5 triangle can have equal area)", whyItHappens: "Area measures size — students conflate 'same size' with congruence", revealingQuestion: "Are two triangles with equal area necessarily congruent? Justify." },
  ],

  examinerTraps: [
    { trap: "Citing SSA as the criterion when SAS applies", typicalScenario: "The included angle is given but student writes 'by SSA'", avoidanceStrategy: "When the angle is between the two given sides, it is SAS (included angle). Always verify 'included'", marksAtRisk: "Full criterion step mark lost" },
    { trap: "Incomplete correspondence: writing △ABC ≅ △DEF without verifying order", typicalScenario: "Student establishes congruence but in wrong vertex order, leading to wrong CPCT conclusions", avoidanceStrategy: "Write the congruence statement so corresponding vertices align: if A↔D, B↔E, C↔F then write △ABC≅△DEF", marksAtRisk: "1 mark for wrong CPCT deductions" },
    { trap: "Missing the 'common side' or 'common angle' in the proof setup", typicalScenario: "Two triangles share a diagonal; student doesn't cite the common side as given", avoidanceStrategy: "Always look for shared sides (diagonals, altitudes) and shared angles (vertically opposite) in the figure — these are 'free' equalities", marksAtRisk: "The proof may be incomplete without the common element" },
  ],

  typicalMistakes: [
    { mistake: "Proving △ABC ≅ △DEF then concluding AB = EF", correction: "In △ABC ≅ △DEF: A↔D, B↔E, C↔F, so AB corresponds to DE, BC to EF, CA to FD", conceptualError: "Not matching vertices correctly in the congruence statement" },
    { mistake: "Applying RHS to a non-right triangle", correction: "RHS is valid only for right triangles. For other triangles, SSA is not a valid criterion", conceptualError: "Using RHS as a 'shortcut' for any two-side-one-angle situation" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "apply", masteryLevel: "create", targetLevels: ["apply", "analyse", "evaluate", "create"], hotsStarters: ["Without being told which criterion to use, prove △AOB ≅ △COD from given information", "Is the given data sufficient to prove congruence? If not, what additional information is needed?"] },
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["In isosceles △ABC with AB=AC, prove that the median from A is also the perpendicular bisector of BC", "If two angles of a triangle are 50° and 70°, classify the triangle and find the third angle"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Definition of congruence: superimposition", tier: "foundational", teachingNote: "Cut out triangle shapes and physically superimpose — concrete before abstract" },
    { step: 2, concept: "Identifying corresponding vertices from a congruence statement", tier: "easy", dependsOnStep: 1, teachingNote: "△ABC ≅ △PQR: read off corresponding parts by position in the statement" },
    { step: 3, concept: "SSS and SAS criteria: when 3 measurements determine a triangle", tier: "easy", dependsOnStep: 2, teachingNote: "Construction activity: given three sides, can you build more than one triangle?" },
    { step: 4, concept: "ASA and AAS criteria", tier: "medium", dependsOnStep: 3, teachingNote: "Establish why knowing two angles determines the third; side sets the scale" },
    { step: 5, concept: "RHS criterion for right triangles", tier: "medium", dependsOnStep: 4, teachingNote: "Special case because the right angle gives the third angle-condition for free" },
    { step: 6, concept: "Why SSA fails: the ambiguous case", tier: "hard", dependsOnStep: 5, teachingNote: "Construction counterexample: draw two different triangles satisfying SSA" },
    { step: 7, concept: "Isosceles triangle proof using congruence", tier: "medium", dependsOnStep: 5, teachingNote: "Classic application of SAS: triangle reflects onto itself" },
    { step: 8, concept: "Triangle inequality and angle-side inequality", tier: "medium", dependsOnStep: 5, teachingNote: "Physical intuition: detour is longer than direct path" },
    { step: 9, concept: "Complex figures: multiple triangles, shared sides, vertically opposite angles", tier: "hard", dependsOnStep: 7, teachingNote: "Board-level problems: systematic approach — label everything, find shared elements first" },
  ],

  realLifeApplications: [
    { context: "Bridge and truss construction", conceptUsed: "Triangle rigidity (SSS congruence)", explanation: "Triangular trusses are used in bridges because a triangle with fixed side lengths has a fixed shape (SSS). This rigidity makes structures stable.", ageRelevance: "Students see truss bridges; the connection to SSS is direct" },
    { context: "Navigation and triangulation", conceptUsed: "Congruence and angle measurement", explanation: "GPS and surveying use triangulation: measuring angles from two known points to locate a third — the triangle is determined by ASA", ageRelevance: "GPS is used daily; shows mathematics in technology" },
    { context: "Isosceles roof structure", conceptUsed: "Isosceles triangle properties", explanation: "Most roof designs are isosceles — equal rafters on both sides; the ridge is the perpendicular bisector of the base, and both sides bear equal load", ageRelevance: "Every student lives under a roof" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch06", chapterName: "Lines and Angles", linkType: "builds-on", description: "Angle properties from Lines and Angles are used in every triangle proof" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch08", chapterName: "Quadrilaterals", linkType: "prerequisite-for", description: "Quadrilateral properties are proved by dividing into triangles and using congruence" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch09", chapterName: "Circles", linkType: "prerequisite-for", description: "Circle theorems use congruent triangles formed by equal radii" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Resolution of forces (vector triangles)", description: "Vectors obey triangle law of addition; congruent force triangles give equal resultants", strength: "moderate" },
    { subject: "Computer Science", topic: "Computer graphics: mesh triangulation", description: "3D objects are modelled as collections of triangles (meshes); congruence is used in rendering to check symmetry", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Hands-on: cut congruent triangles and superimpose — define congruence physically", duration: "10 minutes", pedagogyNote: "NEP-IDC: discovery before definition" },
    { step: 2, action: "Correspondence: read the congruence statement; extract corresponding sides and angles", duration: "15 minutes", pedagogyNote: "Drill: given △ABC ≅ △PQR, state all 6 equal pairs. Make this automatic.", formativeCheckpoint: "Can every student extract 6 equalities from a congruence statement?" },
    { step: 3, action: "Introduce SSS and SAS with construction investigations", duration: "20 minutes", pedagogyNote: "Students try to build a different triangle from 3 given sides — they cannot; SSS is rigid" },
    { step: 4, action: "ASA, AAS, RHS criteria — state, apply in examples", duration: "25 minutes", pedagogyNote: "Build a criteria checklist — students refer to it until it is automatic" },
    { step: 5, action: "Prove the SSA failure: draw counterexample on board", duration: "10 minutes", pedagogyNote: "NEP-REFL: why does SSA not work? The diagram reveals two possibilities" },
    { step: 6, action: "Isosceles triangle theorem: prove using SAS", duration: "20 minutes", pedagogyNote: "NEP-PROB: let students find the auxiliary construction themselves before showing it" },
    { step: 7, action: "Triangle inequality and angle-side inequality: prove and apply", duration: "20 minutes", pedagogyNote: "Build physical intuition first: draw a path directly vs. via a detour" },
    { step: 8, action: "Board-level complex-figure proofs: 2 or 3 triangles in one figure", duration: "30 minutes", pedagogyNote: "Step-by-step: label, identify shared elements, choose criterion, state CPCT conclusions formally" },
  ],
};

// ─── Chapter 8: Quadrilaterals ────────────────────────────────────────────────

export const QUADRILATERALS: ChapterKnowledge = {
  chapterId: "ch08", chapterName: "Quadrilaterals", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "State and apply properties of special quadrilaterals (parallelogram, rectangle, rhombus, square, trapezium)", bloomsLevel: "apply", assessable: true },
    { statement: "Prove properties of parallelograms using triangle congruence", bloomsLevel: "evaluate", assessable: true },
    { statement: "Prove and apply the mid-point theorem and its converse", bloomsLevel: "apply", assessable: true },
    { statement: "Classify quadrilaterals using properties and their relationships", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Classify quadrilaterals in hierarchy: square → rhombus → parallelogram — reason about which properties are general vs special" },
    { ruleCode: "NEP-PROB", application: "Prove a quadrilateral is a parallelogram from given measurements using congruence" },
  ],

  cbseOutcomes: [
    "Student states and proves properties of parallelograms (opposite sides/angles equal, diagonals bisect each other)",
    "Student proves the mid-point theorem and its converse",
    "Student applies properties to calculate missing measurements in quadrilaterals",
  ],

  icseOutcomes: [
    "ICSE expects: properties and proofs for all special quadrilaterals including trapezium",
    "ICSE additionally tests: intercept theorem (equal intercepts on parallel lines)",
  ],

  coreConcepts: [
    "A parallelogram has opposite sides parallel — this single property generates all others",
    "Diagonals of a parallelogram bisect each other (converse is also true)",
    "Special parallelograms (rectangle, rhombus, square) have additional diagonal properties",
    "Mid-point theorem: the line joining midpoints of two sides is parallel to and half the third side",
  ],

  subtopics: [
    { id: "t1", name: "Properties of Quadrilaterals", coreConcept: "Quadrilateral angle sum = 360°; special types have additional properties", keyIdea: "Parallelogram is defined by parallel opposite sides — all other properties follow", estimatedPeriods: 2 },
    { id: "t2", name: "Properties of Parallelogram: Proofs", coreConcept: "Opposite sides equal; opposite angles equal; diagonals bisect each other", keyIdea: "All three properties proved using congruent triangles formed by the diagonal", estimatedPeriods: 3 },
    { id: "t3", name: "Mid-point Theorem", coreConcept: "Line through midpoints of two sides ∥ third side and = half its length", keyIdea: "Proved by congruent triangles formed by extending the mid-point line", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:9:ch07:congruence-criteria-sas", to: "mth:9:ch08:parallelogram-diagonals-bisect", relationship: "applies", explanation: "Diagonals of parallelogram bisect proved by SAS congruence of the two triangles formed" },
    { from: "mth:9:ch06:angle-sum-triangle", to: "mth:9:ch08:quadrilateral-angle-sum", relationship: "applies", explanation: "Quadrilateral divided into two triangles: angle sum = 2×180° = 360°" },
    { from: "mth:9:ch08:parallelogram-properties", to: "mth:9:ch08:mid-point-theorem", relationship: "applies", explanation: "Mid-point theorem uses a constructed parallelogram in its proof" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", requiredConcepts: ["mth:9:ch07:congruence-criteria-sas", "mth:9:ch07:congruence-criteria-asa"] },
    ],
    concepts: ["mth:9:ch07:congruence-criteria-sas", "mth:9:ch06:parallel-lines-properties"],
  },

  essentialDefinitions: [
    { term: "Parallelogram", formalDefinition: "A quadrilateral in which both pairs of opposite sides are parallel", informalExplanation: "A four-sided shape where opposite sides never meet — like a leaning rectangle" },
    { term: "Rhombus", formalDefinition: "A parallelogram with all four sides equal", informalExplanation: "A diamond shape — all sides same length but angles need not be 90°" },
    { term: "Rectangle", formalDefinition: "A parallelogram with all four angles equal to 90°", informalExplanation: "All the 'right-angle' requirements — opposite sides are equal by the parallelogram property" },
    { term: "Square", formalDefinition: "A rectangle with all four sides equal (equivalently: a rhombus with all angles 90°)", informalExplanation: "The most symmetric quadrilateral — all sides equal AND all angles equal" },
  ],

  formulaInventory: [
    { name: "Angle Sum of Quadrilateral", latex: "\\angle A + \\angle B + \\angle C + \\angle D = 360°", plainText: "Sum of interior angles of any quadrilateral = 360°", variables: [{ symbol: "∠A, ∠B, ∠C, ∠D", meaning: "four interior angles" }], applicableWhen: "Any quadrilateral", doesNotApplyWhen: "Concave (non-convex) quadrilaterals — the formula still holds but an interior angle may be reflex", examTip: "Prove by dividing into two triangles (each 180°)" },
  ],

  lawsAndTheorems: [
    { name: "Mid-point Theorem", type: "theorem", statement: "The line segment joining the midpoints of two sides of a triangle is parallel to the third side and equal to half of it", boardRelevance: "3-5 mark proof; application in coordinate geometry Class 10" },
    { name: "Converse of Mid-point Theorem", type: "theorem", statement: "The line drawn through the mid-point of one side of a triangle, parallel to another side, bisects the third side", boardRelevance: "Applied in proof questions about quadrilaterals formed by connecting midpoints" },
  ],

  commonMisconceptions: [
    { misconception: "All rectangles are squares", correction: "A square is a rectangle with all sides equal. Not all rectangles have equal sides — only squares do", whyItHappens: "Students think 'special rectangle' and go straight to square without the additional condition", revealingQuestion: "Is every square a rectangle? Is every rectangle a square? Justify both." },
    { misconception: "Diagonals of all quadrilaterals bisect each other", correction: "Diagonals bisect each other only in parallelograms and their special cases. In a trapezium or general quadrilateral, diagonals do not bisect each other", whyItHappens: "Over-generalisation from parallelogram property", revealingQuestion: "Do the diagonals of a trapezium bisect each other? Justify." },
  ],

  examinerTraps: [
    { trap: "Proving quadrilateral is parallelogram using only one pair of opposite sides equal", typicalScenario: "Student shows AB=CD and concludes ABCD is a parallelogram", avoidanceStrategy: "One pair of equal sides is NOT sufficient. Need: both pairs parallel, OR both pairs equal, OR one pair both equal AND parallel, OR diagonals bisect each other", marksAtRisk: "Full proof marks may be lost for wrong conclusion" },
  ],

  typicalMistakes: [
    { mistake: "In rhombus, diagonals are equal", correction: "In a rectangle, diagonals are equal. In a rhombus, diagonals are perpendicular bisectors of each other but NOT equal (unless it's a square)", conceptualError: "Mixing up diagonal properties of rectangle and rhombus" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["If ABCD is a parallelogram with ∠A = 70°, find all four angles with justification", "Prove that the diagonals of a rectangle are equal — using congruent triangles"] },
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "evaluate"], hotsStarters: ["The quadrilateral formed by joining midpoints of sides of any quadrilateral is a parallelogram — prove"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Types of quadrilaterals and their hierarchy", tier: "easy", teachingNote: "Visual classification — Venn diagram showing hierarchy: square ⊂ rectangle ⊂ parallelogram etc." },
    { step: 2, concept: "Angle sum = 360°: proof from triangles", tier: "easy", dependsOnStep: 1, teachingNote: "Draw diagonal; use angle sum of each triangle" },
    { step: 3, concept: "Parallelogram properties: opposite sides equal, opposite angles equal", tier: "medium", dependsOnStep: 2, teachingNote: "Prove each property using congruent triangles formed by the diagonal" },
    { step: 4, concept: "Diagonals bisect each other; converse", tier: "medium", dependsOnStep: 3, teachingNote: "SAS congruence with vertically opposite angles; converse proves parallelogram from diagonals" },
    { step: 5, concept: "Special parallelograms: rectangle, rhombus, square — their additional diagonal properties", tier: "medium", dependsOnStep: 4, teachingNote: "Build from parallelogram: what extra condition makes diagonals equal? Perpendicular? Both?" },
    { step: 6, concept: "Mid-point theorem and converse", tier: "hard", dependsOnStep: 4, teachingNote: "Proof requires a clever construction: extend the mid-point segment to create a parallelogram" },
  ],

  realLifeApplications: [
    { context: "Parallel parking and road markings", conceptUsed: "Parallelogram properties", explanation: "Parking bays are parallelograms; the parallel sides keep cars aligned with the road", ageRelevance: "Urban environment observation" },
    { context: "Scissor jack (car lifting device)", conceptUsed: "Diagonals of rhombus bisect each other perpendicularly", explanation: "A scissor jack is a rhombus mechanism; pushing the ends together raises the midpoint vertically because diagonals of rhombus are perpendicular", ageRelevance: "Practical vehicle context" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "builds-on", description: "All parallelogram property proofs use triangle congruence from Chapter 7" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch09", chapterName: "Circles", linkType: "parallel-concept", description: "Cyclic quadrilateral properties have analogies with parallelogram properties" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Parallelogram law of vector addition", description: "The resultant of two forces is the diagonal of the parallelogram formed by the forces as adjacent sides", strength: "strong" },
    { subject: "Computer Science", topic: "Coordinate geometry in game development", description: "Quadrilateral collision detection uses properties of parallelograms and rectangles", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Classify quadrilaterals using a visual hierarchy chart; derive angle sum = 360°", duration: "15 minutes", pedagogyNote: "Venn diagram on board: square inside rectangle inside parallelogram" },
    { step: 2, action: "Prove opposite sides of parallelogram are equal using diagonal congruence", duration: "20 minutes", pedagogyNote: "NEP-PROB: students identify the congruent triangles and the criterion before seeing the proof" },
    { step: 3, action: "Prove diagonals bisect each other; state and prove the converse", duration: "20 minutes", pedagogyNote: "Two-column proof format: Statement | Reason. This is the standard ICSE format." },
    { step: 4, action: "Diagonal properties of rectangle, rhombus, square — prove from parallelogram base", duration: "20 minutes", pedagogyNote: "Students see how adding one constraint (all sides equal → rhombus) adds one diagonal property (perpendicular)" },
    { step: 5, action: "Mid-point theorem: guided discovery using coordinate geometry", duration: "20 minutes", pedagogyNote: "Place triangle in coordinate plane; compute midpoints; verify parallel and half-length — then prove geometrically" },
    { step: 6, action: "Application problems combining all properties", duration: "25 minutes", pedagogyNote: "Mixed problems requiring choosing which property to apply — NEP-COMP" },
  ],
};

// ─── Chapter 9: Circles ───────────────────────────────────────────────────────

export const CIRCLES: ChapterKnowledge = {
  chapterId: "ch09", chapterName: "Circles", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "State and apply chord properties (perpendicular from centre bisects chord; equal chords are equidistant)", bloomsLevel: "apply", assessable: true },
    { statement: "Prove and apply the theorem: angle at centre is twice the angle at circumference", bloomsLevel: "evaluate", assessable: true },
    { statement: "Apply the theorem: angles in the same segment are equal", bloomsLevel: "apply", assessable: true },
    { statement: "State the property of a cyclic quadrilateral: opposite angles are supplementary", bloomsLevel: "apply", assessable: true },
    { statement: "Prove selected circle theorems from congruent triangle arguments", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Without being told which theorem, find all angles in a circle figure from given data" },
    { ruleCode: "NEP-PROB", application: "Prove angle-at-centre theorem for all three cases (reflex/non-reflex/semicircle)" },
    { ruleCode: "NEP-REPR", application: "Represent the angle-in-semicircle theorem graphically and state Thales' theorem as its corollary" },
  ],

  cbseOutcomes: [
    "Student states and applies properties of chords (perpendicular bisector passes through centre; equal chords are equidistant)",
    "Student proves the angle subtended at centre is twice the angle at circumference",
    "Student applies: angles in same segment are equal; angle in semicircle is 90°",
    "Student applies cyclic quadrilateral property: opposite angles sum to 180°",
  ],

  icseOutcomes: [
    "ICSE expects: proofs of chord properties (perpendicular from centre) as formal bookwork",
    "ICSE additionally tests: tangent-related properties (tangent perpendicular to radius at point of contact) — not in CBSE Class 9",
  ],

  coreConcepts: [
    "All radii of a circle are equal — this is the single source of all circle properties",
    "The perpendicular from the centre to a chord bisects the chord (and vice versa)",
    "The angle at the centre is exactly double the angle at the circumference subtended by the same arc",
    "Angles in the same segment (subtended by same chord) are equal",
    "An angle in a semicircle is 90° (Thales' theorem — special case of angle at centre)",
    "Opposite angles of a cyclic quadrilateral sum to 180°",
  ],

  subtopics: [
    { id: "t1", name: "Chords and Their Properties", coreConcept: "Perpendicular from centre bisects chord; equal chords are equidistant from centre", keyIdea: "Both proved by congruent triangles using equal radii as the source", estimatedPeriods: 2 },
    { id: "t2", name: "Angle Subtended by a Chord", coreConcept: "Angle at centre = 2 × angle at circumference (same arc)", keyIdea: "Three cases: acute, obtuse, reflex central angle — same proof technique for all", estimatedPeriods: 3 },
    { id: "t3", name: "Angles in the Same Segment", coreConcept: "All angles subtended by the same arc on the same side are equal", keyIdea: "Corollary of the angle-at-centre theorem", estimatedPeriods: 1 },
    { id: "t4", name: "Cyclic Quadrilateral", coreConcept: "Opposite angles of a cyclic quadrilateral sum to 180°", keyIdea: "Both pairs of opposite angles subtend arcs that together make the full circle (360°)", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:9:ch07:congruence-criteria-sss", to: "mth:9:ch09:chord-perpendicular-bisector", relationship: "applies", explanation: "Chord perpendicular bisector proved using two congruent right triangles formed by the perpendicular" },
    { from: "mth:9:ch09:angle-at-centre", to: "mth:9:ch09:angles-same-segment", relationship: "generalises", explanation: "Since all angles in same segment subtend the same arc at the same centre angle, they are all equal to half that central angle" },
    { from: "mth:9:ch09:angle-at-centre", to: "mth:9:ch09:angle-in-semicircle", relationship: "applies", explanation: "Semicircle = 180° arc; centre angle = 180°; circumference angle = 90° (Thales)" },
    { from: "mth:9:ch09:angles-same-segment", to: "mth:9:ch09:cyclic-quadrilateral-property", relationship: "applies", explanation: "Opposite angles of cyclic quad subtend arcs summing to 360°; using angle-at-centre relationship gives their sum as 180°" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", requiredConcepts: ["mth:9:ch07:congruence-criteria-sas", "mth:9:ch07:isosceles-angle-base-theorem"] },
      { subject: "Mathematics", classNum: 6, chapterId: "ch04", chapterName: "Basic Geometrical Ideas", requiredConcepts: ["mth:6:ch04:circle-parts", "mth:6:ch04:radius-diameter-relationship"] },
    ],
    concepts: ["mth:9:ch07:isosceles-angle-base-theorem", "mth:9:ch06:angle-sum-triangle"],
  },

  essentialDefinitions: [
    { term: "Circle", formalDefinition: "The locus of all points in a plane equidistant from a fixed point (centre)", informalExplanation: "All points at exactly the same distance from the centre" },
    { term: "Chord", formalDefinition: "A line segment joining any two points on the circle", informalExplanation: "Any straight cut across the circle; the diameter is the longest chord" },
    { term: "Arc", formalDefinition: "A continuous piece of the circle between two points; minor arc is smaller, major arc is larger", informalExplanation: "A section of the circle boundary; minor arc < semicircle < major arc" },
    { term: "Subtend", formalDefinition: "An angle is subtended by a chord/arc if the chord/arc is the 'base' of the angle", informalExplanation: "The chord/arc 'creates' the angle — the angle opens up towards the arc" },
    { term: "Cyclic Quadrilateral", formalDefinition: "A quadrilateral whose all four vertices lie on a circle", informalExplanation: "A four-sided figure that fits exactly inside a circle with all corners touching the circle" },
    { term: "Concyclic Points", formalDefinition: "Points that all lie on the same circle", informalExplanation: "Points that share a circle passing through all of them" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [
    { name: "Perpendicular from Centre Bisects Chord", type: "theorem", statement: "The perpendicular from the centre of a circle to a chord bisects the chord; conversely, the perpendicular bisector of a chord passes through the centre", proofInsight: "The two halves of the chord are hypotenuses of two right triangles with equal radii — RHS congruence gives them equal", boardRelevance: "Standard 3-mark proof; applied in finding chord length or distance from centre" },
    { name: "Equal Chords, Equal Distance from Centre", type: "theorem", statement: "Equal chords of a circle are equidistant from the centre; conversely, chords equidistant from centre are equal", boardRelevance: "2-mark application; 3-mark proof" },
    { name: "Angle at Centre Theorem", type: "theorem", statement: "The angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circle", proofInsight: "Draw radius from circumference point to centre; isosceles triangles formed (equal radii); exterior angle theorem applied", limitations: "Three cases: (1) centre inside the angle, (2) centre on a side, (3) centre outside — all require separate proof", boardRelevance: "5-mark proof; most important theorem in this chapter" },
    { name: "Angles in the Same Segment", type: "theorem", statement: "Angles subtended by the same arc at points on the same side of the chord are equal", boardRelevance: "1-2 mark applications; derive from angle-at-centre theorem" },
    { name: "Angle in Semicircle (Thales' Theorem)", type: "theorem", statement: "The angle subtended by a diameter at any point on the circle is 90°", proofInsight: "Special case of angle-at-centre: centre angle = 180° (straight line); circumference = 90°", discoveredBy: "Thales of Miletus, 6th century BCE", boardRelevance: "Very frequently applied in 1-2 mark questions" },
    { name: "Cyclic Quadrilateral Property", type: "theorem", statement: "The sum of either pair of opposite angles of a cyclic quadrilateral is 180°", proofInsight: "Opposite arcs together form the full circle (360°); angle-at-centre halves this; so opposite angles at circumference = 360°/2 = 180°", boardRelevance: "3-mark application; 5-mark proof in board exams" },
  ],

  commonMisconceptions: [
    { misconception: "The angle in a semicircle is 90° only when the triangle is right-angled", correction: "The angle in a semicircle is ALWAYS 90° for any point on the circle — the 90° is the conclusion, not a condition", whyItHappens: "Students think they need to identify a right triangle before applying the theorem", revealingQuestion: "P is any point on a circle with diameter AB. What is ∠APB?" },
    { misconception: "Angles in the same segment are equal only if they are both at the same distance from the chord", correction: "Angles in the same segment are equal for ALL points in that segment — distance from chord is irrelevant", whyItHappens: "Students think distance to chord determines the angle size", revealingQuestion: "Three points P, Q, R lie on the major arc of chord AB. Are ∠APB, ∠AQB, and ∠ARB all equal?" },
    { misconception: "The angle at the centre is always twice the angle at the circumference for any point", correction: "The point on the circumference must be on the REMAINING arc — not on the arc being subtended. A point on the arc itself subtends a reflex angle", whyItHappens: "Students don't read 'remaining part of the circle' carefully", revealingQuestion: "Can a point on the minor arc see the same minor arc? What angle would it subtend?" },
  ],

  examinerTraps: [
    { trap: "Not considering all three cases in the angle-at-centre proof", typicalScenario: "Student proves only the case where the centre is inside the angle — examiner expects all three cases", avoidanceStrategy: "Standard answer: Case 1 (centre inside), Case 2 (centre on a side of the angle), Case 3 (centre outside) — at least mention all three even if only Case 1 is proved in detail", marksAtRisk: "1-2 marks for incomplete proof" },
    { trap: "Using cyclic quadrilateral property on a non-cyclic quadrilateral", typicalScenario: "Student applies 'opposite angles = 180°' to any quadrilateral in a figure", avoidanceStrategy: "Verify that all four vertices lie on the circle before applying the theorem", marksAtRisk: "Full marks for the problem" },
  ],

  typicalMistakes: [
    { mistake: "Angle at centre = angle at circumference", correction: "Angle at centre = 2 × angle at circumference (subtended by same arc)", conceptualError: "Forgetting the factor of 2 in the angle-at-centre theorem" },
    { mistake: "For cyclic quadrilateral: each angle = 90°", correction: "Opposite angles SUM to 180°, not each angle individually equals 90°", conceptualError: "Confusing 'supplementary' with 'right angle'" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["O is the centre of a circle. ∠AOB = 130°. Find ∠ACB where C is on the major arc.", "Prove the angle-at-centre theorem for the case where the centre lies outside the angle APB"] },
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "evaluate"], hotsStarters: ["ABCD is a cyclic quadrilateral with ∠A = 80°. Find all angles if it is also a parallelogram — is this possible?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Circle parts: radius, diameter, chord, arc, sector, segment — review", tier: "foundational", teachingNote: "Draw and label — every student's diagram must be clear before theorems begin" },
    { step: 2, concept: "Perpendicular from centre bisects chord — proof and application", tier: "medium", dependsOnStep: 1, teachingNote: "RHS congruence; find chord length given perpendicular distance and radius" },
    { step: 3, concept: "Angle at centre = 2 × angle at circumference — case 1 only", tier: "medium", dependsOnStep: 2, teachingNote: "Proof: draw OA radius; isosceles triangle; exterior angle theorem" },
    { step: 4, concept: "All three cases of angle-at-centre theorem", tier: "hard", dependsOnStep: 3, teachingNote: "Cases 2 and 3 use the same technique — same proof extended" },
    { step: 5, concept: "Thales' theorem: angle in semicircle = 90°", tier: "easy", dependsOnStep: 3, teachingNote: "Direct corollary: diameter → central angle = 180° → circumference angle = 90°" },
    { step: 6, concept: "Angles in the same segment are equal", tier: "medium", dependsOnStep: 3, teachingNote: "Corollary: both equal half the central angle for the same arc" },
    { step: 7, concept: "Cyclic quadrilateral: opposite angles sum to 180°", tier: "hard", dependsOnStep: 6, teachingNote: "Proof: opposite arcs → sum to full circle → half-angles (circumference) sum to 180°" },
    { step: 8, concept: "Mixed multi-theorem problems in complex figures", tier: "hard", dependsOnStep: 7, teachingNote: "Several theorems in one figure — systematic labelling essential" },
  ],

  realLifeApplications: [
    { context: "Wheel and gear design", conceptUsed: "Equal chords equidistant from centre; circle properties", explanation: "Gear teeth are equally spaced along the circle — equal arcs; the perpendicular bisector property ensures symmetric distribution", ageRelevance: "Bicycle gears, clock mechanisms — students see these daily" },
    { context: "Thales' theorem in finding the centre of a circle", conceptUsed: "Angle in semicircle = 90°", explanation: "To find the centre of a circular object, draw any two chords; their perpendicular bisectors meet at the centre. Thales' theorem verifies this works", ageRelevance: "Practical geometry application" },
    { context: "Camera lens and circular apertures", conceptUsed: "Circle geometry", explanation: "Lens elements are circular; the angle subtended by the field of view is a circle theorem application in optics design", ageRelevance: "Photography connects to Physics optics" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "builds-on", description: "All circle theorem proofs use triangle congruence (especially RHS and isosceles triangle theorem)" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch10", chapterName: "Circles (Class 10)", linkType: "prerequisite-for", description: "Tangent-chord and two-tangent theorems build directly on Class 9 circle chapter" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Circular motion and uniform circular motion", description: "Radius vector in circular motion relates to chord/radius properties; angle subtended at centre maps to the central angle in circular motion", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Review circle vocabulary; draw labelled diagram of all parts", duration: "10 minutes", pedagogyNote: "Every proof will reference these terms; ensure vocabulary is secure" },
    { step: 2, action: "Prove perpendicular from centre bisects chord; solve numerical", duration: "20 minutes", pedagogyNote: "Classic RHS proof; sets up the 'equal radii' technique used throughout this chapter" },
    { step: 3, action: "Angle at centre theorem: Case 1 — prove and apply", duration: "25 minutes", pedagogyNote: "NEP-PROB: students identify the isosceles triangles in the diagram before seeing the proof" },
    { step: 4, action: "Cases 2 and 3 of angle-at-centre; Thales' theorem as corollary", duration: "20 minutes", pedagogyNote: "Emphasise these are not new theorems — same method applied to different positions of the centre" },
    { step: 5, action: "Angles in same segment: derive from angle-at-centre; apply", duration: "15 minutes", pedagogyNote: "Both angles equal half the central angle — simple derivation, high application value" },
    { step: 6, action: "Cyclic quadrilateral property: proof and numericals", duration: "25 minutes", pedagogyNote: "Connect to opposite arcs summing to 360° — the arc-angle relationship makes this visual" },
    { step: 7, action: "Board-level complex figures: find all angles using multiple theorems", duration: "25 minutes", pedagogyNote: "Systematic: identify all angles, list known, apply theorems in sequence, cite each theorem" },
  ],
};

// ─── Chapter 10: Heron's Formula ─────────────────────────────────────────────

export const HERONS_FORMULA: ChapterKnowledge = {
  chapterId: "ch10", chapterName: "Heron's Formula", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Apply Heron's formula to find the area of any triangle given its three sides", bloomsLevel: "apply", assessable: true },
    { statement: "Find the area of quadrilaterals by dividing them into triangles", bloomsLevel: "apply", assessable: true },
    { statement: "Select the appropriate area formula (base×height vs Heron's) based on given information", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Determine when to use Heron's formula vs standard base×height — based on what is given" },
    { ruleCode: "NEP-COMP", application: "Use Heron's formula for real measurements: calculate area of a triangular garden given fence lengths" },
  ],

  cbseOutcomes: [
    "Student computes the area of a triangle using Heron's formula when height is not given",
    "Student divides quadrilaterals and irregular polygons into triangles to find total area",
    "Student solves word problems involving area of triangular and quadrilateral fields",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "Heron's formula allows area calculation from three sides alone — no height needed",
    "The semi-perimeter s = (a+b+c)/2 is the key intermediate quantity",
    "Any polygon can be divided into triangles; summing their areas gives the polygon's area",
  ],

  subtopics: [
    { id: "t1", name: "Area of Triangle Using Heron's Formula", coreConcept: "A = √[s(s−a)(s−b)(s−c)] where s is semi-perimeter", keyIdea: "Use when height is unknown but all three sides are given", estimatedPeriods: 3 },
    { id: "t2", name: "Area of Quadrilaterals Using Triangles", coreConcept: "Divide along a diagonal; compute each triangle's area separately", keyIdea: "Extension: any polygon is decomposable into triangles", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:6:ch10:area-rectangle", to: "mth:9:ch10:herons-formula-motivation", relationship: "contradicts-intuition", explanation: "Students know area = ½×base×height; they are surprised that height is unnecessary if all sides are known" },
    { from: "mth:9:ch10:herons-formula", to: "mth:9:ch11:surface-area-sphere", relationship: "applies", explanation: "Area formulas for triangular faces of pyramids use Heron's formula when slant heights must be computed from edges" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 8, chapterId: "ch10", chapterName: "Mensuration", requiredConcepts: ["mth:8:ch10:area-trapezium"] }],
    concepts: ["mth:6:ch10:area-rectangle", "mth:7:ch06:pythagoras-theorem"],
  },

  essentialDefinitions: [
    { term: "Semi-perimeter", formalDefinition: "s = (a + b + c) / 2, where a, b, c are the sides of the triangle", informalExplanation: "Half the total perimeter — computed first in every Heron's formula problem" },
  ],

  formulaInventory: [
    { name: "Heron's Formula", latex: "A = \\sqrt{s(s-a)(s-b)(s-c)}", plainText: "A = √[s(s−a)(s−b)(s−c)]", variables: [{ symbol: "s", meaning: "semi-perimeter = (a+b+c)/2" }, { symbol: "a, b, c", meaning: "lengths of the three sides" }], derivedFrom: "Can be derived from the standard area formula using Pythagoras theorem", applicableWhen: "Three sides of the triangle are known; height not given or needed", doesNotApplyWhen: "If the height is given, standard formula ½×base×height is simpler and should be preferred", examTip: "Always compute s first; label it clearly; then substitute in the formula step by step" },
  ],

  lawsAndTheorems: [
    { name: "Heron's Formula", type: "theorem", statement: "For a triangle with sides a, b, c and semi-perimeter s = (a+b+c)/2, the area A = √[s(s−a)(s−b)(s−c)]", discoveredBy: "Heron of Alexandria, 1st century CE (though possibly known earlier)", boardRelevance: "Direct 3-mark application; 5-mark problems involving quadrilateral field areas" },
  ],

  commonMisconceptions: [
    { misconception: "Always use Heron's formula for triangle area", correction: "Use Heron's formula ONLY when height is not given. When base and height are given, ½×base×height is simpler and faster", whyItHappens: "Students learn Heron's formula and over-apply it", revealingQuestion: "A triangle has base 8 cm and height 5 cm. Find its area. Which formula is appropriate?" },
    { misconception: "s is the perimeter", correction: "s is the SEMI-perimeter: s = (a+b+c)/2, not (a+b+c)", whyItHappens: "Students forget to halve when computing s", revealingQuestion: "For a triangle with sides 5, 6, 7: what is s?" },
  ],

  examinerTraps: [
    { trap: "Not showing s calculation as a separate step", typicalScenario: "Student writes the formula but substitutes without computing s first — examiner cannot award step marks", avoidanceStrategy: "Always write: 's = (a+b+c)/2 = ... = ...' as a separate step before substituting", marksAtRisk: "1 step mark" },
    { trap: "Wrong units for area", typicalScenario: "Sides given in metres, area given in metres (not m²)", avoidanceStrategy: "Area is always in square units; if sides are in cm, area is in cm²", marksAtRisk: "½ mark" },
  ],

  typicalMistakes: [
    { mistake: "A = √[s + (s−a) + (s−b) + (s−c)]", correction: "The four terms under the root are MULTIPLIED, not added: A = √[s × (s−a) × (s−b) × (s−c)]", conceptualError: "Confusing multiplication with addition under the radical" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A triangular garden has sides 50m, 60m, 70m. Find its area. If the cost of fencing is ₹20/m, what is the total cost?", "An equilateral triangle has area 16√3 cm². Find its side using Heron's formula."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Review: area of triangle = ½ × base × height; when is height given?", tier: "foundational", teachingNote: "Motivate Heron's: 'What if we only know the sides, not the height?'" },
    { step: 2, concept: "Define semi-perimeter; compute for given triangles", tier: "easy", dependsOnStep: 1, teachingNote: "Simple arithmetic — build confidence before the formula" },
    { step: 3, concept: "Apply Heron's formula for scalene triangles", tier: "medium", dependsOnStep: 2, teachingNote: "At least 3 practice examples with full step-by-step working" },
    { step: 4, concept: "Heron's formula for special triangles: equilateral, isosceles — verify against known formulas", tier: "medium", dependsOnStep: 3, teachingNote: "Cross-verification builds confidence and error-checking habit" },
    { step: 5, concept: "Area of quadrilateral by dividing along diagonal", tier: "medium", dependsOnStep: 3, teachingNote: "Draw the diagonal explicitly; compute each triangle separately; add" },
    { step: 6, concept: "Word problems: fields, roofing, tiling", tier: "hard", dependsOnStep: 5, teachingNote: "Real measurements; unit conversion; cost calculations as extensions" },
  ],

  realLifeApplications: [
    { context: "Surveying land: calculating area of irregular fields", conceptUsed: "Heron's formula for triangular plots", explanation: "Surveyors measure fence lengths (sides); Heron's formula gives area without needing to measure height", ageRelevance: "Land measurement is a familiar concept in Indian rural context" },
    { context: "Architecture: triangular roof panels", conceptUsed: "Area of triangle from side lengths", explanation: "Roof triangles are designed by specifying ridge and eave lengths — Heron's formula gives the area for material estimation", ageRelevance: "Every building has a roof; connects mathematics to construction" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch11", chapterName: "Surface Areas and Volumes", linkType: "prerequisite-for", description: "Lateral surface area of pyramids requires computing area of triangular faces using Heron's formula" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Centre of mass of triangular objects", description: "Computing centre of mass of a triangular lamina uses the triangle's area, which Heron's formula provides from physical measurements", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Pose problem: find area of triangle with sides 5, 6, 7 without measuring height", duration: "5 minutes", pedagogyNote: "NEP-PROB: the need for a new tool before introducing it" },
    { step: 2, action: "Introduce semi-perimeter; define and compute for several examples", duration: "10 minutes", pedagogyNote: "Emphasise s = (a+b+c)/2 — always half, never the full perimeter" },
    { step: 3, action: "State Heron's formula; apply to the motivating example", duration: "15 minutes", pedagogyNote: "Work the first example together very slowly — each step on a separate line" },
    { step: 4, action: "Practice: 3 independent examples at varying difficulty", duration: "25 minutes", pedagogyNote: "Include: scalene, isosceles (verify against ½bh), equilateral (verify against (√3/4)a²)" },
    { step: 5, action: "Extend to quadrilaterals: divide along diagonal and apply twice", duration: "20 minutes", pedagogyNote: "Draw the diagonal explicitly on the figure; label each triangle separately" },
    { step: 6, action: "Word problems: field area, cost calculation, roofing", duration: "20 minutes", pedagogyNote: "NEP-COMP: connect to real measurements; include unit conversion" },
  ],
};

// ─── Chapter 11: Surface Areas and Volumes ───────────────────────────────────

export const SURFACE_AREAS_AND_VOLUMES: ChapterKnowledge = {
  chapterId: "ch11", chapterName: "Surface Areas and Volumes", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Apply surface area and volume formulas for cuboid, cube, cylinder, cone, and sphere", bloomsLevel: "apply", assessable: true },
    { statement: "Distinguish between lateral surface area (LSA), total surface area (TSA), and volume", bloomsLevel: "understand", assessable: true },
    { statement: "Solve multi-step word problems involving conversion of units and real measurements", bloomsLevel: "apply", assessable: true },
    { statement: "Derive the formula for the curved surface area of a cylinder and cone", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Calculate material required to make a container: TSA gives the material, volume gives the capacity" },
    { ruleCode: "NEP-HOT", application: "Compare surface area and volume across shapes: which holds more? Which uses less material for the same volume?" },
    { ruleCode: "NEP-REPR", application: "Represent a 3D solid as its net (unfolded) to understand what surface area means" },
  ],

  cbseOutcomes: [
    "Student identifies and computes LSA, CSA, TSA, and volume for cuboid, cube, cylinder, cone, and sphere",
    "Student solves practical problems involving painting, packaging, and capacity",
    "Student converts between units (cm to m, litres to cm³) for volume and capacity problems",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "Surface area measures the total area of the outer surface — relevant for material cost",
    "Volume measures the space inside — relevant for capacity or weight",
    "CSA (curved/lateral surface area) excludes the flat bases; TSA includes them",
    "The cylinder CSA derives from unrolling: rectangle of height h and circumference 2πr",
    "The cone CSA derives from unrolling: sector of circle with radius l (slant height)",
  ],

  subtopics: [
    { id: "t1", name: "Cuboid and Cube", coreConcept: "Six rectangular faces for cuboid; six identical square faces for cube", keyIdea: "Unroll the box to see all six faces as rectangles", estimatedPeriods: 2 },
    { id: "t2", name: "Right Circular Cylinder", coreConcept: "CSA = 2πrh (rectangle when unrolled); TSA = 2πr(r+h)", keyIdea: "Unroll the cylinder: curved part becomes a rectangle", estimatedPeriods: 2 },
    { id: "t3", name: "Right Circular Cone", coreConcept: "CSA = πrl where l is slant height; l = √(r²+h²)", keyIdea: "Unroll the cone: curved part becomes a sector", estimatedPeriods: 3 },
    { id: "t4", name: "Sphere and Hemisphere", coreConcept: "Surface area of sphere = 4πr²; volume = (4/3)πr³", keyIdea: "Archimedes' discovery: sphere surface = 4 great circles", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "mth:6:ch10:area-rectangle", to: "mth:9:ch11:cylinder-csa-derivation", relationship: "applies", explanation: "Cylinder CSA = rectangle area = 2πr × h when unrolled" },
    { from: "mth:7:ch06:pythagoras-theorem", to: "mth:9:ch11:cone-slant-height", relationship: "applies", explanation: "Slant height l = √(r² + h²) via Pythagoras in the axial cross-section" },
    { from: "mth:9:ch01:fractional-exponents", to: "mth:9:ch11:cone-slant-height", relationship: "applies", explanation: "l = √(r²+h²) involves a square root — connects to number systems" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 8, chapterId: "ch10", chapterName: "Mensuration", requiredConcepts: ["mth:8:ch10:area-trapezium", "mth:8:ch10:surface-area-cuboid", "mth:8:ch10:volume-cuboid"] }],
    concepts: ["mth:8:ch10:volume-cuboid", "mth:7:ch06:pythagoras-theorem"],
  },

  essentialDefinitions: [
    { term: "Lateral Surface Area (LSA)", formalDefinition: "The total area of all faces of a solid excluding the top and bottom base(s)", informalExplanation: "The area of the 'walls' — what you'd paint if you didn't paint the floor or ceiling" },
    { term: "Total Surface Area (TSA)", formalDefinition: "The total area of all faces including the base(s)", informalExplanation: "The total area of the outside surface — what you'd paint including floor and ceiling" },
    { term: "Slant Height of Cone", formalDefinition: "The distance from the apex of the cone to any point on the base circle, measured along the curved surface", informalExplanation: "The 'slope' of the cone from tip to base rim; l = √(r² + h²) by Pythagoras" },
  ],

  formulaInventory: [
    { name: "Cuboid: LSA and Volume", latex: "\\text{LSA} = 2h(l+b); \\quad \\text{TSA} = 2(lb+bh+hl); \\quad V = lbh", plainText: "LSA = 2h(l+b); TSA = 2(lb+bh+hl); V = lbh", variables: [{ symbol: "l, b, h", meaning: "length, breadth, height" }], applicableWhen: "Rectangular box", doesNotApplyWhen: "Do not use for cube — use a² for each face" },
    { name: "Cylinder: CSA, TSA, Volume", latex: "\\text{CSA} = 2\\pi rh; \\quad \\text{TSA} = 2\\pi r(r+h); \\quad V = \\pi r^2 h", plainText: "CSA = 2πrh; TSA = 2πr(r+h); V = πr²h", variables: [{ symbol: "r", meaning: "radius of base" }, { symbol: "h", meaning: "height" }], applicableWhen: "Right circular cylinder", doesNotApplyWhen: "For hollow cylinder, subtract inner from outer CSA" },
    { name: "Cone: CSA, TSA, Volume", latex: "l = \\sqrt{r^2 + h^2}; \\quad \\text{CSA} = \\pi rl; \\quad \\text{TSA} = \\pi r(r+l); \\quad V = \\frac{1}{3}\\pi r^2 h", plainText: "l=√(r²+h²); CSA=πrl; TSA=πr(r+l); V=⅓πr²h", variables: [{ symbol: "r", meaning: "radius" }, { symbol: "h", meaning: "height" }, { symbol: "l", meaning: "slant height" }], applicableWhen: "Right circular cone", doesNotApplyWhen: "Must compute l first if not given; do not use h in place of l", examTip: "Always compute l = √(r²+h²) explicitly as Step 1 if not given" },
    { name: "Sphere and Hemisphere", latex: "\\text{Surface area of sphere} = 4\\pi r^2; \\quad V = \\frac{4}{3}\\pi r^3; \\quad \\text{CSA hemisphere} = 2\\pi r^2; \\quad \\text{TSA hemisphere} = 3\\pi r^2", plainText: "SA sphere = 4πr²; V sphere = (4/3)πr³; CSA hemisphere = 2πr²; TSA hemisphere = 3πr²", variables: [{ symbol: "r", meaning: "radius" }], applicableWhen: "Sphere: full ball. Hemisphere: half sphere (CSA = curved half, TSA includes flat circular base)", doesNotApplyWhen: "Don't use 4πr² for hemisphere CSA — that's the full sphere" },
  ],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Slant height l = height h of the cone", correction: "Slant height l is measured along the surface from apex to base rim; l = √(r²+h²) > h always", whyItHappens: "Students confuse the vertical height with the slant measurement", revealingQuestion: "A cone has radius 3 and height 4. Find its slant height." },
    { misconception: "TSA of cylinder = πr²h (volume formula mistaken for TSA)", correction: "V = πr²h; TSA = 2πr(r+h). These are completely different quantities", whyItHappens: "Both involve πr²; students mix up which formula is which", revealingQuestion: "What does TSA represent physically? What does volume represent?" },
    { misconception: "TSA of hemisphere = 2πr² (only curved surface)", correction: "TSA of hemisphere = 2πr² (curved) + πr² (flat base) = 3πr²", whyItHappens: "Students forget to add the base when calculating 'total' surface area", revealingQuestion: "A bowl is a hemisphere. What is its total outer surface area if its radius is 7 cm?" },
  ],

  examinerTraps: [
    { trap: "Using diameter instead of radius in formulas", typicalScenario: "Question gives diameter 14 cm; student uses 14 in formula instead of r = 7", avoidanceStrategy: "Always identify r vs d at the start; write 'r = d/2 = ...' as the first step", marksAtRisk: "Up to 3 marks for wrong substitution throughout" },
    { trap: "Not converting units before substitution", typicalScenario: "Height given in metres, radius in centimetres — student substitutes mixed units", avoidanceStrategy: "Convert all measurements to the same unit before writing any formula", marksAtRisk: "Answer wrong; full calculation marks may be lost" },
  ],

  typicalMistakes: [
    { mistake: "V = πr²h for cone", correction: "V = (1/3)πr²h for cone — the 1/3 factor is essential; πr²h is the cylinder volume", conceptualError: "Forgetting that a cone has 1/3 the volume of the cylinder with same base and height" },
    { mistake: "CSA of hemisphere = 4πr²", correction: "4πr² is the surface area of a FULL sphere. CSA of hemisphere = 2πr² (half the sphere's surface)", conceptualError: "Not halving the sphere formula for the hemisphere" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A cone and a cylinder have the same radius and height. Find the ratio of their volumes.", "The CSA of a cone is 550 cm² and its slant height is 25 cm. Find its radius."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Review cuboid and cube formulas; nets", tier: "foundational", teachingNote: "Draw the net; students identify each face — visual foundation for abstract formulas" },
    { step: 2, concept: "Cylinder: derive CSA by unrolling", tier: "medium", dependsOnStep: 1, teachingNote: "Physical activity: roll up a rectangular sheet into a cylinder" },
    { step: 3, concept: "Cylinder TSA and volume", tier: "medium", dependsOnStep: 2, teachingNote: "Add the two circular bases: CSA + 2πr²" },
    { step: 4, concept: "Cone slant height from Pythagoras", tier: "easy", dependsOnStep: 1, teachingNote: "This is just Pythagoras in the cross-section — immediate from Chapter 7" },
    { step: 5, concept: "Cone CSA (sector) and TSA", tier: "medium", dependsOnStep: 4, teachingNote: "Derive CSA by unrolling to a sector; formula πrl follows from sector area" },
    { step: 6, concept: "Sphere: surface area = 4πr² and volume", tier: "medium", dependsOnStep: 1, teachingNote: "Archimedes discovery: briefly narrate as an inspiration; formula is not derived at this level" },
    { step: 7, concept: "Hemisphere CSA and TSA", tier: "medium", dependsOnStep: 6, teachingNote: "Hemisphere TSA = curved half + base circle. Count both." },
    { step: 8, concept: "Multi-step word problems with unit conversion", tier: "hard", dependsOnStep: 7, teachingNote: "Real context: painting cost, packaging, filling tanks — connect to applications" },
  ],

  realLifeApplications: [
    { context: "Packaging design: minimum material for given volume", conceptUsed: "TSA minimisation for fixed volume", explanation: "Can manufacturers minimise surface area (material cost) for a fixed volume. A sphere has the minimum surface area for given volume — this motivates the study of both", ageRelevance: "Students see cylindrical cans and spherical balls daily" },
    { context: "Water tank capacity", conceptUsed: "Volume of cylinder or sphere", explanation: "Village water tanks are cylindrical or spherical — volume gives capacity in litres (1000 cm³ = 1 litre)", ageRelevance: "Relevant to water scarcity discussions; connects to Geography" },
    { context: "Ice-cream cone", conceptUsed: "Volume of cone and hemisphere", explanation: "A scoop of ice cream on a cone: hemisphere (scoop) + cone (holder). Total ice cream volume = (2/3)πr³ + (1/3)πr²h", ageRelevance: "Students find this immediately relatable and funny" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch10", chapterName: "Heron's Formula", linkType: "builds-on", description: "Triangular faces of pyramids use Heron's formula for area; extends into surface area of complex solids" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch13", chapterName: "Surface Areas and Volumes (Class 10)", linkType: "prerequisite-for", description: "Class 10 covers combinations of solids (cone on cylinder, frustum) — requires all Class 9 formulas" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Density and mass of objects", description: "Mass = density × volume; every volume formula here is used to compute mass of physical objects", strength: "strong" },
    { subject: "Chemistry", topic: "Molar volume of gases", description: "Volume concepts connect to the 22.4 litres molar volume at STP; litres to cm³ conversion is the same unit skill", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Motivate with a real question: how much metal is needed to make a can? What is its capacity?", duration: "5 minutes", pedagogyNote: "NEP-PROB: surface area (material) vs volume (capacity) distinction from the start" },
    { step: 2, action: "Cuboid and cube: review formulas; verify against drawn nets", duration: "15 minutes", pedagogyNote: "Draw net on graph paper; count squares to verify area formula" },
    { step: 3, action: "Cylinder: physical unrolling demonstration; derive CSA = 2πrh", duration: "20 minutes", pedagogyNote: "Use actual cylindrical object (tin can); unroll paper wrapper — see the rectangle" },
    { step: 4, action: "Cone: compute slant height; derive CSA; practice TSA and volume", duration: "25 minutes", pedagogyNote: "Draw the right-triangle cross-section first; l from Pythagoras; then CSA" },
    { step: 5, action: "Sphere: state surface area and volume formulas; hemisphere derived", duration: "15 minutes", pedagogyNote: "Archimedes story as motivation; formulae accepted (proof beyond Class 9)" },
    { step: 6, action: "Word problems: painting, capacity, packaging with unit conversion", duration: "30 minutes", pedagogyNote: "Every problem: Identify shape → list given → identify unknown → choose formula → substitute → check units" },
  ],
};

// ─── Chapter 12: Statistics ───────────────────────────────────────────────────

export const STATISTICS: ChapterKnowledge = {
  chapterId: "ch12", chapterName: "Statistics", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Construct frequency distribution tables for grouped data", bloomsLevel: "apply", assessable: true },
    { statement: "Draw and interpret histograms, frequency polygons, and ogives", bloomsLevel: "apply", assessable: true },
    { statement: "Calculate mean, median, and mode for grouped data", bloomsLevel: "apply", assessable: true },
    { statement: "Choose the appropriate measure of central tendency for different data contexts", bloomsLevel: "analyse", assessable: true },
    { statement: "Interpret statistical representations to extract conclusions", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Collect real classroom data (heights, scores) and compute all three averages — data-driven discovery" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Average salary is ₹50,000' — which measure is used? Is it the most appropriate? Why?" },
    { ruleCode: "NEP-ETH", application: "Discuss how statistics can mislead: cherry-picking data, misleading graphs, biased samples" },
    { ruleCode: "NEP-COMP", application: "Interpret a real government report or news article using statistical vocabulary from this chapter" },
  ],

  cbseOutcomes: [
    "Student organises raw data into frequency tables and grouped frequency distributions",
    "Student represents data as histogram, frequency polygon, and ogive",
    "Student computes mean (direct, assumed mean, step deviation methods), median, and mode for grouped data",
    "Student identifies which average is most meaningful for a given context",
  ],

  icseOutcomes: [
    "ICSE additionally expects: quartiles (Q1, Q3) and inter-quartile range",
    "ICSE additionally expects: mean deviation about mean",
  ],

  coreConcepts: [
    "Raw data becomes information only after organisation and representation",
    "Frequency distributions group data into classes; the class width is the interval",
    "Mean uses all data values; median uses only the middle; mode uses only the most frequent",
    "For grouped data, exact values are lost — we work with class midpoints for mean",
    "An ogive (cumulative frequency curve) is used to find median and quartiles graphically",
  ],

  subtopics: [
    { id: "t1", name: "Frequency Distribution Tables", coreConcept: "Group raw data into class intervals to reveal patterns", keyIdea: "Class interval width should be uniform; tally marks help organise", estimatedPeriods: 2 },
    { id: "t2", name: "Graphical Representations", coreConcept: "Histogram (frequency density vs class), frequency polygon, ogive", keyIdea: "Each graph reveals different aspects of the distribution; ogive is cumulative", estimatedPeriods: 3 },
    { id: "t3", name: "Measures of Central Tendency for Grouped Data", coreConcept: "Mean (three methods), median (using ogive or formula), mode (modal class)", keyIdea: "Mean uses midpoints; median uses position; mode uses frequency", estimatedPeriods: 4 },
  ],

  conceptGraph: [
    { from: "mth:6:ch09:frequency-table", to: "mth:9:ch12:grouped-frequency-distribution", relationship: "generalises", explanation: "Class 6 simple frequency tables extended to grouped class interval tables" },
    { from: "mth:9:ch12:cumulative-frequency", to: "mth:9:ch12:ogive", relationship: "applies", explanation: "An ogive is a graph of the cumulative frequency against the upper class boundary" },
    { from: "mth:9:ch12:class-midpoint", to: "mth:9:ch12:mean-grouped-data", relationship: "requires", explanation: "Since exact values are lost in grouping, the class midpoint represents all values in that class" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch09", chapterName: "Data Handling", requiredConcepts: ["mth:6:ch09:frequency-table", "mth:6:ch09:bar-graph-construction"] }],
    concepts: ["mth:6:ch09:frequency-table"],
  },

  essentialDefinitions: [
    { term: "Class Interval", formalDefinition: "A range of values [lower boundary, upper boundary) used to group data in a frequency distribution", informalExplanation: "A 'bin' that collects all data values within a range" },
    { term: "Class Width (Class Size)", formalDefinition: "Upper class boundary − lower class boundary", informalExplanation: "How wide each group is — should be uniform for a standard histogram" },
    { term: "Class Midpoint (Mid-value)", formalDefinition: "(Lower class boundary + upper class boundary) / 2", informalExplanation: "The representative value for all data in that class — used in mean calculation" },
    { term: "Cumulative Frequency", formalDefinition: "The running total of frequencies up to and including each class", informalExplanation: "'How many data values are at or below this point?' — builds up the ogive" },
    { term: "Ogive", formalDefinition: "A curve obtained by plotting cumulative frequency against the upper class boundaries", informalExplanation: "An S-shaped graph that helps find median, quartiles, and percentiles graphically" },
    { term: "Modal Class", formalDefinition: "The class interval with the highest frequency in a grouped frequency distribution", informalExplanation: "The most popular group — mode is estimated from this class using the mode formula" },
  ],

  formulaInventory: [
    { name: "Mean (Direct Method)", latex: "\\bar{x} = \\frac{\\sum f_i x_i}{\\sum f_i}", plainText: "x̄ = Σ(fᵢxᵢ) / Σfᵢ", variables: [{ symbol: "xᵢ", meaning: "class midpoint" }, { symbol: "fᵢ", meaning: "frequency of class i" }], applicableWhen: "Grouped data; direct method is clear but can involve large numbers", doesNotApplyWhen: "Do not use when assumed mean method is more efficient (large midpoints)", examTip: "Always add a column for fᵢxᵢ in your working table; sum carefully" },
    { name: "Mean (Assumed Mean Method)", latex: "\\bar{x} = a + \\frac{\\sum f_i d_i}{\\sum f_i}", plainText: "x̄ = a + Σ(fᵢdᵢ) / Σfᵢ where dᵢ = xᵢ − a", variables: [{ symbol: "a", meaning: "assumed mean (chosen as a convenient class midpoint)" }, { symbol: "dᵢ", meaning: "deviation of class midpoint from assumed mean" }], applicableWhen: "When class midpoints are large numbers; reduces arithmetic", doesNotApplyWhen: "Any assumed mean gives correct answer — choose the middle class midpoint for minimum error" },
    { name: "Mode for Grouped Data", latex: "\\text{Mode} = l + \\frac{f_1 - f_0}{2f_1 - f_0 - f_2} \\times h", plainText: "Mode = l + [(f₁−f₀)/(2f₁−f₀−f₂)] × h", variables: [{ symbol: "l", meaning: "lower boundary of modal class" }, { symbol: "f₁", meaning: "frequency of modal class" }, { symbol: "f₀", meaning: "frequency of class before modal class" }, { symbol: "f₂", meaning: "frequency of class after modal class" }, { symbol: "h", meaning: "class width" }], applicableWhen: "Grouped data with a single clear modal class", doesNotApplyWhen: "If there are two modal classes (bimodal data), this formula cannot be applied directly" },
    { name: "Median for Grouped Data", latex: "\\text{Median} = l + \\frac{\\frac{n}{2} - cf}{f} \\times h", plainText: "Median = l + [(n/2 − cf) / f] × h", variables: [{ symbol: "l", meaning: "lower boundary of median class" }, { symbol: "n", meaning: "total frequency" }, { symbol: "cf", meaning: "cumulative frequency before median class" }, { symbol: "f", meaning: "frequency of median class" }, { symbol: "h", meaning: "class width" }], applicableWhen: "Grouped data; find median class where cumulative frequency first exceeds n/2", doesNotApplyWhen: "Verify median class first: the class where cumulative frequency ≥ n/2 for the first time" },
  ],

  lawsAndTheorems: [
    { name: "Relationship: Mean, Median, Mode (empirical)", type: "principle", statement: "For moderately skewed distributions: Mode ≈ 3 × Median − 2 × Mean", limitations: "This is an empirical approximation, not a theorem. Works well for data that is not extremely skewed", boardRelevance: "Used to find one average when the other two are given in 2-mark questions" },
  ],

  commonMisconceptions: [
    { misconception: "The mode is the class with the highest cumulative frequency", correction: "Mode is in the class with the highest FREQUENCY (not cumulative frequency). Cumulative frequency is used for the median.", whyItHappens: "Confusion between frequency and cumulative frequency tables", revealingQuestion: "Identify the modal class and median class in a given frequency table." },
    { misconception: "Mean, median, and mode are always different", correction: "For a perfectly symmetric distribution, mean = median = mode. They are equal in the normal distribution.", whyItHappens: "In most practice examples, they are different — students assume this is always the case", revealingQuestion: "For what type of data distribution are mean, median, and mode all equal?" },
    { misconception: "The histogram can be drawn with bars of different widths", correction: "In a standard histogram for equal class widths, bars have equal widths and the height represents frequency. If class widths are unequal, the height must represent frequency density (frequency ÷ class width)", whyItHappens: "Students confuse histogram with bar graph; bar graph allows different widths but histogram requires equal width bars or frequency density adjustment", revealingQuestion: "When would you use frequency density instead of frequency on the y-axis of a histogram?" },
  ],

  examinerTraps: [
    { trap: "Identifying the wrong median class", typicalScenario: "Student takes the class with cf = n/2 exactly rather than the class where cf FIRST reaches or exceeds n/2", avoidanceStrategy: "The median class is the class in which the (n/2)th value falls — the class where the cumulative frequency first equals or exceeds n/2", marksAtRisk: "2–3 marks for wrong class → wrong formula values" },
    { trap: "Using total frequency n instead of n/2 for median", typicalScenario: "Student uses the full n in the median formula where n/2 is needed", avoidanceStrategy: "The median formula contains n/2 explicitly — always halve n before identifying the class", marksAtRisk: "1–2 marks" },
    { trap: "Not adding a 'total' row in the working table", typicalScenario: "Forgetting to sum the frequency column and fᵢxᵢ column — leading to wrong Σfᵢ or Σfᵢxᵢ", avoidanceStrategy: "Always write a 'TOTAL' row at the bottom of every statistical table", marksAtRisk: "½ mark for missing totals; full error if wrong total substituted" },
  ],

  typicalMistakes: [
    { mistake: "Using the class interval upper boundary instead of midpoint for xᵢ", correction: "In the mean formula, xᵢ is the CLASS MIDPOINT (lower + upper)/2, not just the upper boundary", conceptualError: "Not knowing what represents all values in a grouped class" },
    { mistake: "Mode = highest frequency (the frequency count, not the class)", correction: "The mode is the MODAL CLASS (a range) or the formula value; not the frequency count itself", conceptualError: "Confusing the mode with the frequency of the modal class" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["Given mean = 48 and mode = 36, find the median using the empirical relationship", "A company claims 'average salary is ₹80,000'. What type of average might they be using? What would be most appropriate?"] },
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse"], hotsStarters: ["Compare a histogram and an ogive of the same data — what does each tell you that the other doesn't?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Organise raw data into frequency distribution table", tier: "easy", teachingNote: "Use real classroom data — heights or test scores. Tally marks method." },
    { step: 2, concept: "Construct histogram from grouped frequency table", tier: "medium", dependsOnStep: 1, teachingNote: "On graph paper; bars touch each other (unlike bar graph)" },
    { step: 3, concept: "Frequency polygon: join midpoints of histogram tops", tier: "medium", dependsOnStep: 2, teachingNote: "Overlay on histogram; extends one class before and after" },
    { step: 4, concept: "Cumulative frequency table and ogive (less than type)", tier: "medium", dependsOnStep: 1, teachingNote: "Running total; plot against upper boundaries; smooth S-curve" },
    { step: 5, concept: "Find median from ogive", tier: "medium", dependsOnStep: 4, teachingNote: "Horizontal line from n/2 on y-axis; drop to x-axis for median" },
    { step: 6, concept: "Mean for grouped data: direct method", tier: "medium", dependsOnStep: 1, teachingNote: "Table: class, midpoint, frequency, f×midpoint. Sum last column ÷ sum of f" },
    { step: 7, concept: "Mean: assumed mean and step deviation methods", tier: "hard", dependsOnStep: 6, teachingNote: "Show they give the same answer; assumed mean reduces arithmetic" },
    { step: 8, concept: "Median and mode by formula for grouped data", tier: "hard", dependsOnStep: 5, teachingNote: "Identify median class and modal class first — that's the most common error" },
  ],

  realLifeApplications: [
    { context: "Census data: analysing population age distribution", conceptUsed: "Frequency distribution, histogram", explanation: "The census organises ages into 5-year groups; the histogram shows India's age pyramid — young base vs ageing base", ageRelevance: "Students have heard about census; connects to civics and economics" },
    { context: "Salary statistics in news reports", conceptUsed: "Choosing appropriate average", explanation: "News uses 'average salary' — but is it mean, median, or mode? For skewed salary data, median is most representative, but mean is often quoted (inflated by top earners)", ageRelevance: "Students will enter the job market; this matters for realistic expectations" },
    { context: "Weather data: temperature distribution over months", conceptUsed: "Frequency distributions, modal class", explanation: "Meteorologists group temperatures into ranges; modal class is the 'most common temperature'", ageRelevance: "Students track weather; climate change discussions" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch13", chapterName: "Probability", linkType: "prerequisite-for", description: "Experimental probability is built from frequency tables — same data organisation used" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch14", chapterName: "Statistics (Class 10)", linkType: "prerequisite-for", description: "Class 10 adds cumulative frequency more formally and introduces median/mode for grouped data with different methods" },
  ],

  crossSubjectLinks: [
    { subject: "Economics", topic: "Measures of central tendency in economic data", description: "Per capita income (mean), median income (for inequality analysis), modal occupation group — all economic statistics uses", strength: "strong" },
    { subject: "Biology", topic: "Biological variation and frequency distributions", description: "Heights, weights, and reaction times of living organisms follow frequency distributions; bell-curve is the normal distribution", strength: "moderate" },
    { subject: "Physics", topic: "Errors and significant figures", description: "Repeated measurements follow a distribution; mean measurement and spread are statistical concepts", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Collect real data: ask class for heights; write 30+ values on the board", duration: "10 minutes", pedagogyNote: "NEP-IDC: students are the data. Every subsequent step uses this real data." },
    { step: 2, action: "Organise into frequency table: choose class width, fill tally marks, compute frequency", duration: "15 minutes", pedagogyNote: "Discuss: why choose 5cm width? What if we used 1cm? What if 20cm? Effects on information lost/gained" },
    { step: 3, action: "Draw histogram on graph paper from the table", duration: "20 minutes", pedagogyNote: "Bars touch! No gaps. Y-axis: frequency, X-axis: class intervals. Accurate scale." },
    { step: 4, action: "Construct cumulative frequency table; draw ogive", duration: "20 minutes", pedagogyNote: "Running total; plot at upper boundary; connect with a smooth curve" },
    { step: 5, action: "Read off median from ogive; verify with formula", duration: "15 minutes", pedagogyNote: "NEP-REPR: graphical median vs. algebraic median — both methods, same answer" },
    { step: 6, action: "Compute mean (direct method) using the same class data", duration: "20 minutes", pedagogyNote: "Table: class, midpoint, f, f×midpoint. Sum. Divide. Discuss: is it close to the median?" },
    { step: 7, action: "Find mode using formula; compare all three averages", duration: "15 minutes", pedagogyNote: "NEP-HOT: which is the best average for the class height data? Discuss context-dependence" },
    { step: 8, action: "Media literacy activity: analyse a newspaper statistic using vocabulary from this chapter", duration: "15 minutes", pedagogyNote: "NEP-ETH: 'India's per capita income is ₹X' — is this meaningful? What is hidden?" },
  ],
};

// ─── Chapter 13: Probability ──────────────────────────────────────────────────

export const PROBABILITY: ChapterKnowledge = {
  chapterId: "ch13", chapterName: "Probability", classNum: 9, subject: "Mathematics", board: "Both",

  learningObjectives: [
    { statement: "Define probability as the ratio of favourable outcomes to total outcomes for an experiment", bloomsLevel: "understand", assessable: true },
    { statement: "Distinguish between experimental (empirical) and theoretical probability", bloomsLevel: "analyse", assessable: true },
    { statement: "Compute the probability of simple events using the classical definition", bloomsLevel: "apply", assessable: true },
    { statement: "Explain why experimental probability approaches theoretical probability as trials increase", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Coin/dice tossing experiment — collect class data and compute experimental probability before defining theoretical" },
    { ruleCode: "NEP-REFL", application: "Reflect: why can't we always predict the outcome? What is 'randomness'?" },
    { ruleCode: "NEP-HOT", application: "Evaluate claims of 'luck' or 'fortune' using probability concepts: if P(winning) = 0.001, how many attempts to expect one win?" },
    { ruleCode: "NEP-ETH", application: "Discuss the ethics of gambling and lottery using the mathematical fact that expected probability of winning is less than paying" },
  ],

  cbseOutcomes: [
    "Student performs a probability experiment (coin toss, die roll) and computes empirical probability",
    "Student defines an event, favourable outcomes, and total outcomes",
    "Student computes probability using the classical (theoretical) definition",
    "Student verifies that probability is always between 0 and 1 inclusive",
  ],

  icseOutcomes: [],

  coreConcepts: [
    "Probability measures likelihood on a scale from 0 (impossible) to 1 (certain)",
    "Experimental probability = (number of times event occurred) / (total trials)",
    "As the number of trials increases, experimental probability approaches theoretical probability (Law of Large Numbers)",
    "Theoretical probability requires equally likely outcomes: P(E) = n(E)/n(S)",
    "Complementary events: P(E) + P(E') = 1",
  ],

  subtopics: [
    { id: "t1", name: "Experimental Probability", coreConcept: "P(E) = frequency of event / total trials — computed from actual experiment data", keyIdea: "Probability starts from observation; the ratio stabilises as trials increase", estimatedPeriods: 2 },
    { id: "t2", name: "Theoretical Probability", coreConcept: "P(E) = n(favourable outcomes) / n(sample space) — computed by reasoning about equally likely outcomes", keyIdea: "Classical probability assumes all outcomes are equally likely", estimatedPeriods: 3 },
  ],

  conceptGraph: [
    { from: "mth:9:ch12:frequency-table", to: "mth:9:ch13:experimental-probability", relationship: "applies", explanation: "Experimental probability uses frequency data organised in the same way as statistics chapter" },
    { from: "mth:9:ch13:experimental-probability", to: "mth:9:ch13:theoretical-probability", relationship: "generalises", explanation: "Theoretical probability is the limiting value of experimental probability as trials → infinity" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 9, chapterId: "ch12", chapterName: "Statistics", requiredConcepts: ["mth:9:ch12:frequency-table"] }],
    concepts: ["mth:9:ch12:frequency-table"],
  },

  essentialDefinitions: [
    { term: "Random Experiment", formalDefinition: "An experiment that produces a definite outcome from several possible outcomes, where the actual outcome cannot be predicted with certainty", informalExplanation: "Any process where chance determines the result — tossing a coin, rolling a die" },
    { term: "Sample Space (S)", formalDefinition: "The set of all possible outcomes of a random experiment", informalExplanation: "The complete list of every possible result: for a coin, S = {Head, Tail}" },
    { term: "Event (E)", formalDefinition: "Any subset of the sample space — a collection of outcomes we are interested in", informalExplanation: "What we're looking for: 'getting an even number on a die' = {2, 4, 6}" },
    { term: "Probability of an Event", formalDefinition: "P(E) = n(E) / n(S) = number of favourable outcomes / total number of equally likely outcomes", informalExplanation: "Chances of the event happening, expressed as a fraction between 0 and 1" },
    { term: "Complementary Event", formalDefinition: "The event E' (or Ē) consisting of all outcomes in S that are NOT in E; P(E') = 1 − P(E)", informalExplanation: "The opposite event: P(not getting a 6) = 1 − P(getting a 6)" },
  ],

  formulaInventory: [
    { name: "Experimental Probability", latex: "P(E) = \\frac{\\text{Number of times event E occurred}}{\\text{Total number of trials}}", plainText: "P(E) = (number of times E occurred) / (total trials)", variables: [], applicableWhen: "Based on actual experiment data; no assumption of equal likelihood needed", doesNotApplyWhen: "Cannot predict future probability from a single trial — need many trials for stability" },
    { name: "Theoretical Probability", latex: "P(E) = \\frac{n(E)}{n(S)}", plainText: "P(E) = n(E) / n(S)", variables: [{ symbol: "n(E)", meaning: "number of favourable outcomes" }, { symbol: "n(S)", meaning: "total number of equally likely outcomes (sample space size)" }], applicableWhen: "When all outcomes in sample space are equally likely", doesNotApplyWhen: "A biased coin or loaded die does not have equally likely outcomes; classical formula fails", examTip: "Always list the sample space first, then count favourable outcomes" },
    { name: "Complementary Probability", latex: "P(E) + P(E') = 1", plainText: "P(E) + P(not E) = 1", variables: [{ symbol: "E'", meaning: "the complement of event E (not E)" }], applicableWhen: "Whenever finding P(not E) is easier than P(E)", doesNotApplyWhen: "Applies to all well-defined events" },
  ],

  lawsAndTheorems: [
    { name: "Law of Large Numbers (conceptual)", type: "principle", statement: "As the number of trials of a random experiment increases, the experimental probability approaches the theoretical probability", limitations: "This is the conceptual version; formal proof requires measure theory (beyond Class 9 scope)", boardRelevance: "1-mark conceptual questions: 'What happens to experimental probability as trials increase?'" },
  ],

  commonMisconceptions: [
    { misconception: "If a coin is tossed 10 times and gives all Heads, the next toss is more likely to give Tails", correction: "Each toss is independent; the coin has no memory. P(Tail) = 1/2 on every single toss regardless of history", whyItHappens: "Gambler's fallacy — intuitive belief in 'balancing out'", revealingQuestion: "A fair coin gives Heads 8 times in a row. What is the probability of Tails on the 9th toss?" },
    { misconception: "Probability can be greater than 1 (if there are many favourable outcomes)", correction: "Probability is always between 0 and 1 inclusive: 0 ≤ P(E) ≤ 1. If you get >1, you've miscounted", whyItHappens: "Students confuse probability with a frequency count", revealingQuestion: "A bag has 3 red and 5 blue balls. What is the probability of drawing a ball that is NOT yellow?" },
    { misconception: "Theoretical probability of getting any number on a die is 1/6, so rolling 60 times must give exactly 10 sixes", correction: "Probability gives expected long-run frequency, not a guarantee for any finite number of trials. Getting exactly 10 sixes in 60 rolls is ONE possibility, not a certainty", whyItHappens: "Confusing probability with a deterministic prediction", revealingQuestion: "If P(Head) = 1/2, how many Heads would you expect in 100 tosses? Why might you not get exactly 50?" },
  ],

  examinerTraps: [
    { trap: "Using a non-exhaustive sample space", typicalScenario: "When tossing two coins, student lists S = {HH, HT, TT} (3 outcomes) instead of {HH, HT, TH, TT} (4 outcomes)", avoidanceStrategy: "Always list EVERY possible outcome in S; for two coins, HT and TH are distinct outcomes", marksAtRisk: "Wrong S → wrong P(E) → full question marks" },
    { trap: "Probability of impossible event stated as -1 or 0/0", typicalScenario: "P(getting 7 on a standard die) — student writes 0/0", avoidanceStrategy: "Impossible event: n(E) = 0; P(E) = 0/6 = 0, not undefined", marksAtRisk: "½ mark" },
  ],

  typicalMistakes: [
    { mistake: "P(E) = 3/6 for 'rolling an even number' on a die where S = {1,2,3,4,5,6}", correction: "Even numbers are {2,4,6} — 3 favourable out of 6 total. P = 3/6 = 1/2. (This is actually correct — the mistake is when students reduce 3/6 to 1 and say probability is 1)", conceptualError: "Reducing fraction all the way to a whole number by cancelling denominator" },
    { mistake: "For a bag with 3 red and 2 blue balls: P(red) + P(blue) = 5 (student adds to 5, not 1)", correction: "P(red) = 3/5, P(blue) = 2/5; their sum = 5/5 = 1, not 5", conceptualError: "Not normalising by dividing by total outcomes" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["If you toss a coin 1000 times and get 480 Heads, what is P(Head) experimentally? How does it compare to theoretical?", "Design an experiment to estimate the probability that a thumbtack lands point-up. What factors affect this?"] },
    { subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A bag has R red and B blue balls. What is P(red) + P(blue)? Explain why this equals 1.", "A student says P(winning) = 3 because she can win in 3 ways. Explain the error."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Random experiments: recognise them vs deterministic events", tier: "foundational", teachingNote: "Toss a coin — you cannot predict. Sunrise tomorrow — you can. What makes the difference?" },
    { step: 2, concept: "Experimental probability from tossing experiment data", tier: "easy", dependsOnStep: 1, teachingNote: "Class experiment: 50 tosses each; compute P(Head); compile class results" },
    { step: 3, concept: "Sample space: list all outcomes for simple experiments", tier: "easy", dependsOnStep: 1, teachingNote: "Coin: {H,T}; Die: {1,2,3,4,5,6}; Two coins: {HH, HT, TH, TT}" },
    { step: 4, concept: "P(E) = n(E)/n(S): simple events", tier: "easy", dependsOnStep: 3, teachingNote: "At least 5 practice examples from different contexts" },
    { step: 5, concept: "Complementary event: P(E') = 1 − P(E)", tier: "medium", dependsOnStep: 4, teachingNote: "Useful when P(not E) is easier to compute than P(E)" },
    { step: 6, concept: "P = 0 (impossible) and P = 1 (certain) as extreme cases", tier: "easy", dependsOnStep: 4, teachingNote: "P(getting 7 on a die) = 0; P(getting a number ≤ 6 on a die) = 1" },
    { step: 7, concept: "Experimental vs theoretical: Law of Large Numbers — conceptual", tier: "medium", dependsOnStep: 2, teachingNote: "Compare class coin-toss results to theoretical 0.5; discuss why they differ and why they'll converge" },
  ],

  realLifeApplications: [
    { context: "Weather forecasting: '70% chance of rain'", conceptUsed: "Experimental probability from historical data", explanation: "Meteorologists use historical frequency of rain on similar days. '70% chance' means it rained on 70% of similar past days.", ageRelevance: "Students check weather apps; they've seen percentage probability of rain" },
    { context: "Insurance: calculating premiums from risk data", conceptUsed: "Probability of events (accidents, illness)", explanation: "Insurance companies use probability of events to price premiums. Higher P(accident) → higher premium", ageRelevance: "Age-appropriate introduction to how insurance works" },
    { context: "Gambling and lotteries: the house always wins", conceptUsed: "Expected value via probability", explanation: "Lottery P(winning) = 1/10,000,000 but ticket cost = ₹10. Expected loss per ticket shows that lotteries are mathematically unfavourable", ageRelevance: "NEP-ETH: critical thinking about gambling" },
  ],

  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch12", chapterName: "Statistics", linkType: "builds-on", description: "Experimental probability is computed from frequency data — same tools as Statistics chapter" },
    { subject: "Mathematics", classNum: 10, chapterId: "ch15", chapterName: "Probability (Class 10)", linkType: "prerequisite-for", description: "Class 10 extends to complementary events, impossible and certain events with more complex sample spaces" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Genetics: Mendelian inheritance ratios", description: "Dominant/recessive gene ratios (3:1) are probability ratios — Punnett square is a sample space", strength: "strong" },
    { subject: "Physics", topic: "Quantum mechanics: probabilistic nature of particles", description: "Heisenberg's uncertainty principle and wave function collapse are probability concepts — a distant but culturally important connection", strength: "weak" },
    { subject: "Economics", topic: "Risk and uncertainty in economic decisions", description: "Expected utility theory in economics uses probability to model decision-making under uncertainty", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Class experiment: 50 coin tosses — record results, compute P(Head) per student", duration: "15 minutes", pedagogyNote: "NEP-IDC: data before definition; every student generates data" },
    { step: 2, action: "Pool class results (1500+ tosses); observe P(Head) approaching 0.5", duration: "10 minutes", pedagogyNote: "Law of Large Numbers made visible; students are surprised by convergence" },
    { step: 3, action: "Define: random experiment, sample space, event, probability — build from experiment", duration: "15 minutes", pedagogyNote: "Every definition connected to the coin experiment just performed" },
    { step: 4, action: "Theoretical probability: list sample space for die, two coins, cards", duration: "20 minutes", pedagogyNote: "Careful listing — HT and TH are different. Use systematic listing or tree diagrams" },
    { step: 5, action: "Compute P(E) for multiple events; complementary events", duration: "20 minutes", pedagogyNote: "Practice with variety of sample spaces; emphasise checking P(E) ≤ 1" },
    { step: 6, action: "Gambler's fallacy discussion: is past history relevant?", duration: "10 minutes", pedagogyNote: "NEP-REFL: 'coins have no memory' — what does independence mean?" },
    { step: 7, action: "NEP-ETH: lottery probability — compute probability of winning national lottery", duration: "10 minutes", pedagogyNote: "Real numbers from a national lottery; P(win) is tiny. Expected value discussion." },
  ],
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const MATHEMATICS_CLASS9: ChapterKnowledge[] = [
  NUMBER_SYSTEMS,
  POLYNOMIALS,
  COORDINATE_GEOMETRY,
  LINEAR_EQUATIONS_TWO_VARIABLES,
  EUCLIDS_GEOMETRY,
  LINES_AND_ANGLES,
  TRIANGLES,
  QUADRILATERALS,
  CIRCLES,
  HERONS_FORMULA,
  SURFACE_AREAS_AND_VOLUMES,
  STATISTICS,
  PROBABILITY,
];
