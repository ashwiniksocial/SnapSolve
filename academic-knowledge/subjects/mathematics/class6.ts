/**
 * Academic Knowledge — Mathematics, Class 6 (14 chapters)
 * All 20 metadata fields present per chapter.
 * Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

function ch(chapterId: string, chapterName: string, data: Omit<ChapterKnowledge, "chapterId"|"chapterName"|"classNum"|"subject"|"board">): ChapterKnowledge {
  return { chapterId, chapterName, classNum: 6, subject: "Mathematics", board: "Both", ...data };
}

export const KNOWING_OUR_NUMBERS = ch("ch01", "Knowing Our Numbers", {
  learningObjectives: [
    { statement: "Compare and order large numbers up to crores and billions using place value", bloomsLevel: "apply", assessable: true },
    { statement: "Distinguish between the Indian and International number systems", bloomsLevel: "understand", assessable: true },
    { statement: "Estimate sums and products using rounding to the nearest ten, hundred, or thousand", bloomsLevel: "apply", assessable: true },
    { statement: "Read and write Roman numerals up to 3999", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Read India's GDP or population figures in both Indian and international number systems from real news articles" },
    { ruleCode: "NEP-HOT", application: "Evaluate: when is estimation better than exact calculation? Give two real scenarios." },
  ],
  cbseOutcomes: ["Student reads and writes numbers up to 1 crore and 1 billion", "Student compares numbers using place value", "Student estimates sums, differences, and products by rounding"],
  icseOutcomes: [],
  coreConcepts: ["Place value determines the value of each digit based on its position", "The Indian system uses lakhs and crores; the International system uses millions and billions", "Estimation gives an approximate answer quickly — useful when exact answer is not needed"],
  subtopics: [
    { id: "t1", name: "Comparing and Ordering Numbers", coreConcept: "Digits at higher place values determine which number is larger", keyIdea: "Compare from left (highest place value) rightward — first digit that differs determines the order", estimatedPeriods: 2 },
    { id: "t2", name: "Large Numbers in Practice", coreConcept: "Indian (lakh, crore) vs International (million, billion) grouping conventions", keyIdea: "1 crore = 10 million; 1 lakh = 100 thousand", estimatedPeriods: 2 },
    { id: "t3", name: "Estimation and Rounding", coreConcept: "Rounding to the nearest ten/hundred/thousand gives a useful approximation", keyIdea: "Decide the rounding unit, look at the next digit: ≥5 round up, <5 round down", estimatedPeriods: 2 },
    { id: "t4", name: "Roman Numerals", coreConcept: "Seven symbols; additive and subtractive notation; no zero", keyIdea: "I, V, X, L, C, D, M. Smaller before larger = subtract; smaller after larger = add", estimatedPeriods: 1 },
  ],
  conceptGraph: [
    { from: "mth:6:ch01:place-value", to: "mth:6:ch01:comparing-large-numbers", relationship: "requires", explanation: "Comparison uses place value from the highest position down" },
    { from: "mth:6:ch01:rounding", to: "mth:6:ch01:estimation-in-context", relationship: "applies", explanation: "Estimation applies rounding to produce useful approximations for real decisions" },
  ],
  prerequisites: { chapters: [], concepts: [] },
  essentialDefinitions: [
    { term: "Place Value", formalDefinition: "The numerical value of a digit based on its position in a number", informalExplanation: "The '4' in 4,000 has value 4000; the '4' in 40 has value 40 — position changes value" },
    { term: "Estimation", formalDefinition: "Finding an approximate value of a calculation using rounded numbers", informalExplanation: "Getting a 'good enough' answer quickly without exact calculation" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "1 lakh = 1 million", correction: "1 lakh = 100,000 = 0.1 million. 10 lakhs = 1 million.", whyItHappens: "Students confuse the two number system groupings", revealingQuestion: "How many lakhs make 1 million?" },
    { misconception: "Any large number rounded to the nearest hundred gives a multiple of 1000", correction: "3,451 rounded to nearest hundred is 3,500 — not a multiple of 1000.", whyItHappens: "Confusion about what 'nearest hundred' means", revealingQuestion: "Round 4,756 to the nearest hundred." },
  ],
  examinerTraps: [
    { trap: "Placing commas incorrectly when writing large numbers in Indian system", typicalScenario: "Student writes 1234567 as 12,34,567 (ICSE) vs 1,234,567 (International) — mixing systems", avoidanceStrategy: "Indian: after 3 from right, then every 2. International: every 3 from right.", marksAtRisk: "½ mark" },
  ],
  typicalMistakes: [
    { mistake: "IX = 11 (adding instead of subtracting in Roman numerals)", correction: "IX = 10 − 1 = 9. Smaller symbol before larger means SUBTRACT.", conceptualError: "Not applying the subtraction rule for Roman numerals" },
  ],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["When is estimation more useful than an exact answer? Give two real examples."] }],
  difficultyProgression: [
    { step: 1, concept: "Place value up to 7 digits", tier: "easy", teachingNote: "Expand a number into sum of place values" },
    { step: 2, concept: "Comparing and ordering large numbers", tier: "easy", dependsOnStep: 1, teachingNote: "Left-to-right comparison strategy" },
    { step: 3, concept: "Indian vs International number system", tier: "medium", dependsOnStep: 1, teachingNote: "Convert using 1 lakh = 100 thousand; 1 crore = 10 million" },
    { step: 4, concept: "Rounding and estimation", tier: "medium", dependsOnStep: 2, teachingNote: "Practical context: estimate the cost of 19 items at ₹48 each" },
    { step: 5, concept: "Roman numerals", tier: "easy", teachingNote: "Seven symbols; additive and subtractive notation" },
  ],
  realLifeApplications: [
    { context: "Reading India's GDP (₹236 lakh crore) in news articles", conceptUsed: "Indian number system", explanation: "Students encounter large numbers in news; reading them correctly requires the Indian system", ageRelevance: "Economic news is part of current affairs" },
    { context: "Estimation in shopping: can I afford 6 items at ₹49 each with ₹300?", conceptUsed: "Estimation by rounding", explanation: "Round ₹49 to ₹50; 6×50=300 — yes, approximately enough. Exact: 6×49=294.", ageRelevance: "Daily shopping decisions" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 6, chapterId: "ch07", chapterName: "Fractions", linkType: "prerequisite-for", description: "Place value understanding extends to decimal place values in fractions and decimals" },
  ],
  crossSubjectLinks: [
    { subject: "Economics", topic: "Reading government budget figures", description: "Union Budget uses crores and lakhs — same place value system", strength: "moderate" },
  ],
  teachingSequence: [
    { step: 1, action: "Read India's population (1.4 billion) and GDP from a newspaper — motivate place value", duration: "10 minutes", pedagogyNote: "Real context first" },
    { step: 2, action: "Place value up to crores; Indian system commas", duration: "15 minutes", pedagogyNote: "Expand numbers; compare" },
    { step: 3, action: "International system; convert between systems", duration: "15 minutes", pedagogyNote: "1 crore = 10 million — concrete conversion" },
    { step: 4, action: "Rounding and estimation: shopping context", duration: "20 minutes", pedagogyNote: "NEP-COMP: real price estimation" },
    { step: 5, action: "Roman numerals: seven symbols, notation rules, decode dates", duration: "15 minutes", pedagogyNote: "Historical context: year on monuments in Roman numerals" },
  ],
});

export const WHOLE_NUMBERS = ch("ch02", "Whole Numbers", {
  learningObjectives: [
    { statement: "Represent whole numbers on a number line", bloomsLevel: "apply", assessable: true },
    { statement: "Apply properties of whole numbers (closure, commutativity, associativity, distributivity) to simplify calculations", bloomsLevel: "apply", assessable: true },
    { statement: "Identify arithmetic patterns in sequences of whole numbers", bloomsLevel: "analyse", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: Is there a largest whole number? What would happen if whole numbers ended? Discuss infinity." },
    { ruleCode: "NEP-REFL", application: "Reflect on why 0 was a revolutionary discovery in mathematics — what was impossible without it?" },
  ],
  cbseOutcomes: ["Student represents whole numbers on a number line", "Student applies properties to mental calculations", "Student identifies patterns in triangular, square numbers"],
  icseOutcomes: [],
  coreConcepts: ["Whole numbers = natural numbers + 0; no negatives, no fractions", "Number line: numbers increase left to right; whole numbers are equally spaced", "Four properties (closure, commutativity, associativity, distributivity) make mental arithmetic possible", "Patterns in whole numbers (square, triangular, cubes) reveal mathematical structure"],
  subtopics: [
    { id: "t1", name: "The Number Line", coreConcept: "Visual model: numbers as points, operations as movements", keyIdea: "Every whole number has exactly one point on the line; addition moves right, subtraction moves left", estimatedPeriods: 1 },
    { id: "t2", name: "Properties of Whole Numbers", coreConcept: "Four algebraic properties that hold for all whole numbers under addition and multiplication", keyIdea: "Distributivity is the most powerful: a×(b+c) = a×b + a×c — enables mental multiplication", estimatedPeriods: 3 },
    { id: "t3", name: "Patterns in Whole Numbers", coreConcept: "Arithmetic patterns (consecutive sums, square numbers, triangular numbers) reveal hidden structures", keyIdea: "1+3=4, 1+3+5=9, 1+3+5+7=16 — sum of first n odd numbers = n²", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch02:number-line", to: "mth:6:ch06:integer-on-number-line", relationship: "generalises", explanation: "Integer number line extends whole number line to include negatives" },
    { from: "mth:6:ch02:distributivity", to: "mth:7:ch01:integer-multiplication-sign-rules", relationship: "applies", explanation: "Distributivity is used in integer multiplication proofs" },
  ],
  prerequisites: { chapters: [], concepts: [] },
  essentialDefinitions: [
    { term: "Whole Numbers", formalDefinition: "The set of non-negative integers: {0, 1, 2, 3, ...}; includes 0 but not negative numbers or fractions", informalExplanation: "Counting numbers plus zero — you use them to count objects and represent 'nothing'" },
    { term: "Distributivity", formalDefinition: "a × (b + c) = (a × b) + (a × c); multiplication distributes over addition", informalExplanation: "Split the sum, multiply each part, add back — makes mental arithmetic possible: 7×18 = 7×(20−2) = 140−14 = 126" },
    { term: "Closure Property", formalDefinition: "When an operation is performed on any two numbers in a set, the result is also in the same set", informalExplanation: "Whole numbers + whole numbers = whole number (never escapes the set). Division doesn't have closure: 7÷3 is not a whole number" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Whole numbers and natural numbers are the same", correction: "Natural numbers start from 1; whole numbers include 0. Whole numbers = {0,1,2,3,...}; Natural numbers = {1,2,3,...}", whyItHappens: "Both are positive integers; students miss the 0 distinction", revealingQuestion: "Is 0 a natural number? Is it a whole number?" },
    { misconception: "Division is commutative: 8÷4 = 4÷8", correction: "Division is NOT commutative. 8÷4=2 but 4÷8=0.5. Commutativity holds for addition and multiplication only.", whyItHappens: "Students assume all operations are commutative", revealingQuestion: "Does 12÷3 = 3÷12? Check and explain." },
  ],
  examinerTraps: [
    { trap: "Applying commutativity to subtraction: 7−5 = 5−7", typicalScenario: "Student writes 5−7 = 7−5 = 2", avoidanceStrategy: "Subtraction is NOT commutative. 7−5=2 but 5−7=−2 (not even a whole number)", marksAtRisk: "1 mark" },
  ],
  typicalMistakes: [
    { mistake: "0 is not a whole number", correction: "0 IS a whole number — the first one. Natural numbers start from 1; whole numbers start from 0.", conceptualError: "Treating counting numbers and whole numbers as identical" },
  ],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "analyse"], hotsStarters: ["Find the pattern: 1=1², 1+3=4=2², 1+3+5=9=3². What is 1+3+5+...+(2n−1)?"] }],
  difficultyProgression: [
    { step: 1, concept: "Whole numbers and predecessor/successor", tier: "foundational", teachingNote: "Every whole number has a successor; 0 has no predecessor in whole numbers" },
    { step: 2, concept: "Number line representation", tier: "easy", dependsOnStep: 1, teachingNote: "Draw and mark; perform additions/subtractions as movements" },
    { step: 3, concept: "Four properties with examples", tier: "medium", dependsOnStep: 2, teachingNote: "Distributivity as the 'killer app' for mental math" },
    { step: 4, concept: "Patterns in sequences", tier: "medium", dependsOnStep: 2, teachingNote: "Square numbers, triangular numbers — discover by drawing dot patterns" },
  ],
  realLifeApplications: [
    { context: "Mental multiplication using distributivity", conceptUsed: "Distributivity: a×(b+c) = a×b + a×c", explanation: "26×7 = (20+6)×7 = 140+42 = 182. Mental arithmetic trick every student can use.", ageRelevance: "Useful in everyday calculations; builds number sense" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 6, chapterId: "ch06", chapterName: "Integers", linkType: "prerequisite-for", description: "Integer number line extends the whole number line to negatives" },
    { subject: "Mathematics", classNum: 6, chapterId: "ch11", chapterName: "Algebra", linkType: "prerequisite-for", description: "Properties of whole numbers (distributivity) are the algebraic laws used in algebra" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Counting and numbering physical quantities", description: "Whole number arithmetic is used in counting particles, forces, objects", strength: "weak" }],
  teachingSequence: [
    { step: 1, action: "Number line activity: mark first 20 whole numbers; perform additions as 'jumps right'", duration: "15 minutes", pedagogyNote: "Visual kinesthetic — students physically mark points and draw arrows" },
    { step: 2, action: "Properties: discover by testing examples, then state formally", duration: "20 minutes", pedagogyNote: "NEP-IDC: test 5 examples of each property before stating it" },
    { step: 3, action: "Patterns: dot patterns for triangular and square numbers", duration: "15 minutes", pedagogyNote: "Draw dot arrays; spot the pattern visually before algebraically" },
  ],
});

export const PLAYING_WITH_NUMBERS = ch("ch03", "Playing with Numbers", {
  learningObjectives: [
    { statement: "Identify factors and multiples of a given number", bloomsLevel: "understand", assessable: true },
    { statement: "Apply divisibility tests for 2, 3, 4, 5, 8, 9, 10, 11", bloomsLevel: "apply", assessable: true },
    { statement: "Find HCF and LCM using prime factorisation", bloomsLevel: "apply", assessable: true },
    { statement: "Apply HCF and LCM to solve word problems", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Use LCM to find when two buses with different schedules next depart at the same time — real scheduling problem" },
    { ruleCode: "NEP-HOT", application: "Prove that there are infinitely many prime numbers (Euclid's proof — enrichment)" },
  ],
  cbseOutcomes: ["Student identifies factors and multiples; classifies numbers as prime or composite", "Student applies divisibility tests to classify 2-digit and 3-digit numbers", "Student finds HCF and LCM by prime factorisation; applies HCF-LCM product relationship"],
  icseOutcomes: ["ICSE additionally expects: Euclid's division algorithm for HCF"],
  coreConcepts: ["A factor of n divides n exactly (no remainder); a multiple of n is n multiplied by a whole number", "Prime: exactly two factors (1 and itself). Composite: more than two factors. 1 is neither prime nor composite.", "Prime factorisation is unique (Fundamental Theorem of Arithmetic) — every composite number has exactly one prime factorisation", "HCF × LCM = Product of the two numbers (for any two positive integers)"],
  subtopics: [
    { id: "t1", name: "Factors and Multiples", coreConcept: "Factor: divides the number exactly. Multiple: the number divides it exactly.", keyIdea: "Every number is both a factor and a multiple of itself; 1 is a factor of every number", estimatedPeriods: 2 },
    { id: "t2", name: "Prime and Composite Numbers", coreConcept: "Primes have exactly 2 factors; composites have more than 2", keyIdea: "Sieve of Eratosthenes eliminates composites — all remaining numbers are prime", estimatedPeriods: 2 },
    { id: "t3", name: "Tests of Divisibility", coreConcept: "Quick tests determine divisibility without full division — based on digit patterns", keyIdea: "Divisibility by 3: sum of digits divisible by 3. By 9: sum of digits divisible by 9. By 11: alternating sum.", estimatedPeriods: 2 },
    { id: "t4", name: "HCF and LCM", coreConcept: "HCF: largest factor common to both. LCM: smallest multiple common to both.", keyIdea: "Prime factorisation: HCF uses minimum powers; LCM uses maximum powers of all prime factors", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch03:prime-definition", to: "mth:6:ch03:prime-factorisation", relationship: "applies", explanation: "Prime factorisation breaks any composite into its prime building blocks" },
    { from: "mth:6:ch03:hcf-prime-factorisation", to: "mth:6:ch03:hcf-lcm-relationship", relationship: "applies", explanation: "HCF × LCM = product of two numbers — proved using prime factorisation" },
    { from: "mth:6:ch03:divisibility-3", to: "mth:6:ch03:divisibility-9", relationship: "generalises", explanation: "Divisibility by 9 uses same digit-sum rule but requires sum divisible by 9" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch02", chapterName: "Whole Numbers", requiredConcepts: ["mth:6:ch02:number-line"] }], concepts: ["mth:6:ch02:closure"] },
  essentialDefinitions: [
    { term: "Factor", formalDefinition: "A whole number that divides another number exactly, leaving no remainder", informalExplanation: "A number that fits into another number exactly — 4 is a factor of 12 because 12÷4=3 exactly" },
    { term: "Prime Number", formalDefinition: "A whole number greater than 1 that has exactly two factors: 1 and itself", informalExplanation: "A number with no divisors except 1 and itself — cannot be broken down into smaller whole-number products", example: "2, 3, 5, 7, 11, 13, 17, 19, 23...", counterExample: "1 is NOT prime (only one factor); 4 is NOT prime (factors: 1, 2, 4)" },
    { term: "HCF (GCD)", formalDefinition: "The largest positive integer that divides each of two or more numbers without remainder", informalExplanation: "The biggest number that fits evenly into all the given numbers" },
    { term: "LCM", formalDefinition: "The smallest positive integer that is divisible by each of two or more numbers", informalExplanation: "The smallest number that all the given numbers divide into evenly" },
  ],
  formulaInventory: [
    { name: "HCF–LCM Relationship", latex: "\\text{HCF}(a,b) \\times \\text{LCM}(a,b) = a \\times b", plainText: "HCF(a,b) × LCM(a,b) = a × b", variables: [], applicableWhen: "Any two positive integers a and b", doesNotApplyWhen: "Does not extend directly to three numbers without modification", examTip: "Use to find LCM when HCF is known, or vice versa — saves computation" },
  ],
  lawsAndTheorems: [
    { name: "Fundamental Theorem of Arithmetic", type: "theorem", statement: "Every integer greater than 1 can be expressed as a product of prime numbers in exactly one way (up to order)", boardRelevance: "Not explicitly named at Class 6; the uniqueness of prime factorisation is used without naming the theorem" },
  ],
  commonMisconceptions: [
    { misconception: "1 is a prime number", correction: "1 is NEITHER prime NOR composite. Primes must have exactly 2 factors; 1 has only one factor (itself). Composites must have more than 2 factors.", whyItHappens: "1 is not composite, so students assume it must be prime", revealingQuestion: "How many factors does 1 have? Why does this make it neither prime nor composite?" },
    { misconception: "The HCF is always smaller than either number", correction: "HCF(a,a) = a — the HCF of a number with itself is the number. HCF is always ≤ the smaller of the two numbers.", whyItHappens: "Students often see HCF < both numbers; miss the edge case", revealingQuestion: "What is HCF(7, 7)?" },
  ],
  examinerTraps: [
    { trap: "Divisibility test for 4: testing by 2 twice instead of last two digits", typicalScenario: "Student tests 236 as divisible by 4 by checking 2|236 (yes) and 2|(236÷2=118) (yes) — this works but the rule is: last two digits (36) divisible by 4", avoidanceStrategy: "Divisibility by 4: last TWO digits form a number divisible by 4. 36÷4=9 → yes", marksAtRisk: "Gets right answer but wrong method" },
  ],
  typicalMistakes: [
    { mistake: "LCM of 12 and 18 = 12×18/6 = 36; HCF is 6 — correct but student uses the formula blindly without understanding", correction: "Always verify: does 12 divide 36? Yes. Does 18 divide 36? Yes. Is there a smaller such number? No.", conceptualError: "Using formula without verification" },
  ],
  bloomsMap: [{ subtopicId: "t4", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Two bells ring every 12 minutes and 18 minutes. After how many minutes do they ring together? Use LCM.", "Find all numbers less than 100 that have exactly 3 factors. What do these numbers have in common?"] }],
  difficultyProgression: [
    { step: 1, concept: "Factors and multiples: definition and listing", tier: "easy", teachingNote: "List all factors of 24 — systematic: 1×24, 2×12, 3×8, 4×6. Stop when factors repeat." },
    { step: 2, concept: "Prime and composite: classification and Sieve of Eratosthenes", tier: "easy", dependsOnStep: 1, teachingNote: "Build the sieve on a 1–100 grid; circle primes, cross out composites" },
    { step: 3, concept: "Divisibility tests for 2, 3, 5, 9, 10, 11", tier: "medium", dependsOnStep: 1, teachingNote: "Each test and its digit pattern; practice with 3-digit numbers" },
    { step: 4, concept: "Prime factorisation: factor tree method", tier: "medium", dependsOnStep: 2, teachingNote: "Build factor tree to prime factors; verify using multiplication" },
    { step: 5, concept: "HCF and LCM from prime factorisation", tier: "hard", dependsOnStep: 4, teachingNote: "HCF: minimum powers; LCM: maximum powers. Verify using product relationship." },
    { step: 6, concept: "Word problems: when to use HCF vs LCM", tier: "hard", dependsOnStep: 5, teachingNote: "HCF: sharing equally (tiling, dividing). LCM: finding common occurrences (timing, schedules)" },
  ],
  realLifeApplications: [
    { context: "Tiling: largest tile size for a room 12m × 18m", conceptUsed: "HCF gives largest square tile with no cutting", explanation: "HCF(12,18)=6 — largest tile is 6m × 6m. Applications of HCF in construction and tiling.", ageRelevance: "Home renovation is familiar; connects maths to practical construction" },
    { context: "Bus schedules: when do two buses next coincide?", conceptUsed: "LCM gives next common departure time", explanation: "Bus A every 12 min, Bus B every 18 min → LCM(12,18)=36 min. They coincide every 36 minutes.", ageRelevance: "Students wait for buses; this is a daily scenario" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 6, chapterId: "ch07", chapterName: "Fractions", linkType: "prerequisite-for", description: "HCF used to simplify fractions; LCM used to find common denominator for fraction addition" },
  ],
  crossSubjectLinks: [{ subject: "Computer Science", topic: "Algorithms: finding GCD using Euclidean algorithm", description: "HCF is computed in computer programs using the Euclidean algorithm — one of the oldest algorithms", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Factor exploration: list all factor pairs of 24 systematically", duration: "10 minutes", pedagogyNote: "Physical tiles or grid paper — concrete before abstract" },
    { step: 2, action: "Sieve of Eratosthenes on 1–100 grid: find all primes", duration: "20 minutes", pedagogyNote: "NEP-IDC: students build the sieve themselves" },
    { step: 3, action: "Divisibility tests: derive and apply to 3-digit numbers", duration: "20 minutes", pedagogyNote: "Derive divisibility-by-3 rule: explain WHY sum of digits works" },
    { step: 4, action: "Factor trees: find prime factorisation; HCF and LCM from factorisation", duration: "25 minutes", pedagogyNote: "Visual factor tree; emphasise minimum/maximum exponent rules" },
    { step: 5, action: "Word problems: tiling and bus scheduling", duration: "20 minutes", pedagogyNote: "Decision: HCF (split evenly) or LCM (common occurrence)?" },
  ],
});

export const BASIC_GEOMETRICAL_IDEAS = ch("ch04", "Basic Geometrical Ideas", {
  learningObjectives: [
    { statement: "Identify and name points, line segments, lines, rays, and angles", bloomsLevel: "remember", assessable: true },
    { statement: "Classify angles as acute, obtuse, right, reflex, and complete", bloomsLevel: "understand", assessable: true },
    { statement: "Identify and classify triangles and quadrilaterals by their properties", bloomsLevel: "understand", assessable: true },
    { statement: "Identify parts of a circle: centre, radius, diameter, chord, arc, sector, segment", bloomsLevel: "remember", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Find real examples of each geometric shape in the classroom or school — observation activity" },
    { ruleCode: "NEP-REPR", application: "Represent the same angle in three ways: diagram, degree measurement, and verbal description" },
  ],
  cbseOutcomes: ["Student names and defines geometric primitives (point, line, ray, line segment)", "Student classifies angles by degree range", "Student identifies parts of a circle"],
  icseOutcomes: [],
  coreConcepts: ["A point has no size — it represents location only", "A line has no endpoints and extends infinitely; a line segment has two endpoints", "An angle is formed by two rays sharing a common endpoint (vertex)", "A circle is the set of all points equidistant from a fixed point (centre)"],
  subtopics: [
    { id: "t1", name: "Points, Lines, Rays, Line Segments", coreConcept: "The primitive building blocks of all geometry", keyIdea: "Line extends infinitely both ways; ray has one endpoint; segment has two", estimatedPeriods: 2 },
    { id: "t2", name: "Angles and Their Types", coreConcept: "Angle = opening between two rays sharing a vertex; measured in degrees", keyIdea: "Acute: <90°; Right: 90°; Obtuse: 90°–180°; Straight: 180°; Reflex: 180°–360°; Complete: 360°", estimatedPeriods: 2 },
    { id: "t3", name: "Triangles and Quadrilaterals", coreConcept: "Closed figures made of line segments; classified by side lengths and angle types", keyIdea: "Triangle: 3 sides, 3 vertices, 3 angles. Quadrilateral: 4 sides, 4 vertices, 4 angles, 2 diagonals", estimatedPeriods: 2 },
    { id: "t4", name: "Circles and Their Parts", coreConcept: "All points equidistant from centre; parts: radius, diameter, chord, arc, sector, segment", keyIdea: "Diameter = 2 × radius; diameter is the longest chord", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch04:angle-types", to: "mth:6:ch05:angle-types-degrees", relationship: "applies", explanation: "Chapter 5 measures angles precisely in degrees; Chapter 4 provides the type classification" },
    { from: "mth:6:ch04:circle-parts", to: "mth:9:ch09:circles", relationship: "requires", explanation: "Class 9 circle theorems require fluent knowledge of all circle part definitions" },
  ],
  prerequisites: { chapters: [], concepts: [] },
  essentialDefinitions: [
    { term: "Line Segment", formalDefinition: "A part of a line that has two endpoints; it has a definite, measurable length", informalExplanation: "A line with a start and end point — like a straight section of road between two cities" },
    { term: "Angle", formalDefinition: "The figure formed by two rays (arms) having the same starting point (vertex)", informalExplanation: "The 'opening' between two rays — measured in degrees from 0° (closed) to 360° (full turn)" },
    { term: "Chord", formalDefinition: "A line segment joining any two points on a circle", informalExplanation: "Any straight cut across the circle. The diameter is the longest chord." },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "A ray has a definite length", correction: "A ray starts at one endpoint but extends infinitely in one direction — it has no definite length", whyItHappens: "Students confuse ray with line segment", revealingQuestion: "What is the length of a ray? Explain." },
    { misconception: "The diameter is always horizontal across the circle", correction: "A diameter can be in any orientation; any chord passing through the centre is a diameter", whyItHappens: "Textbook diagrams typically show horizontal diameters", revealingQuestion: "Can a diameter be vertical? Can it be diagonal? Explain." },
  ],
  examinerTraps: [
    { trap: "Calling a line segment 'a line'", typicalScenario: "In a diagram, a segment AB is drawn with two endpoints — student says 'line AB'", avoidanceStrategy: "Line: no endpoints, extends both ways (symbolised ↔). Line segment: two endpoints (symbolised by bar over AB). Ray: one endpoint (symbolised by arrow one way).", marksAtRisk: "½ mark for wrong terminology" },
  ],
  typicalMistakes: [
    { mistake: "An angle of 0° between two coinciding rays is 'no angle'", correction: "Two coinciding rays form a zero angle (0°). An angle of 0° exists — it just has no opening.", conceptualError: "Equating 'no visible opening' with 'no angle'" },
  ],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "understand", masteryLevel: "apply", targetLevels: ["understand", "apply"], hotsStarters: ["A clock shows 3:00. What type of angle do the hands form? At 4:00? At 6:00?"] }],
  difficultyProgression: [
    { step: 1, concept: "Points, lines, rays, segments — definitions and notation", tier: "foundational", teachingNote: "Use physical examples: a dot (point), a taut string (line segment), a flashlight beam (ray)" },
    { step: 2, concept: "Angle types: classify by degree range", tier: "easy", dependsOnStep: 1, teachingNote: "Protractor activity: measure 10 given angles and classify each" },
    { step: 3, concept: "Triangles and quadrilaterals: parts and classification", tier: "easy", dependsOnStep: 1, teachingNote: "Draw 5 triangles; classify each by sides (equilateral/isosceles/scalene) AND by angles" },
    { step: 4, concept: "Circle parts: label a diagram", tier: "easy", dependsOnStep: 1, teachingNote: "Draw circle; label all 7 parts. Focus on chord vs diameter distinction." },
  ],
  realLifeApplications: [
    { context: "Architecture: angles in building design", conceptUsed: "Angle types in structures", explanation: "Right angles in corners; acute angles in roof slopes; obtuse angles in modern architecture. Geometry is everywhere in buildings.", ageRelevance: "Students live and study in buildings" },
    { context: "Satellite dishes and radar: circular design", conceptUsed: "Circle properties (equal distance from centre)", explanation: "Satellite dishes are circular because the signal must be focused equally from all directions — equidistance from centre is the key property", ageRelevance: "Modern technology context" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 6, chapterId: "ch05", chapterName: "Understanding Elementary Shapes", linkType: "prerequisite-for", description: "Chapter 5 measures angles using protractors; Chapter 4 defines what angles are" },
    { subject: "Mathematics", classNum: 6, chapterId: "ch14", chapterName: "Practical Geometry", linkType: "prerequisite-for", description: "Constructions in Chapter 14 require understanding of line segments, angles, and circles" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Reflection and refraction: angle of incidence", description: "Light rays and angles of incidence/reflection are geometric angles — same definition as this chapter", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Real-world observation: find a point, line segment, ray, angle in the classroom", duration: "10 minutes", pedagogyNote: "NEP-IDC: observation before definition" },
    { step: 2, action: "Draw and label: points, lines, rays, segments — use correct notation", duration: "15 minutes", pedagogyNote: "Notation matters: overline for segment, arrows for line/ray" },
    { step: 3, action: "Protractor activity: measure and classify 10 drawn angles", duration: "20 minutes", pedagogyNote: "Hands-on; classify each measured angle by type" },
    { step: 4, action: "Circle diagram: draw a circle; label all 7 parts", duration: "15 minutes", pedagogyNote: "Draw in pencil; label clearly; check diameter passes through centre" },
  ],
});

export const INTEGERS = ch("ch06", "Integers", {
  learningObjectives: [
    { statement: "Represent integers on a number line including negative numbers", bloomsLevel: "apply", assessable: true },
    { statement: "Add and subtract integers using the number line model", bloomsLevel: "apply", assessable: true },
    { statement: "Compare and order integers; identify the absolute value", bloomsLevel: "understand", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-REFL", application: "Reflect on why negative numbers were 'forbidden' for centuries — what human need led to their invention?" },
    { ruleCode: "NEP-IDC", application: "Collect temperature data from a city below 0°C; plot on a number line; compare" },
  ],
  cbseOutcomes: ["Student represents integers on a number line", "Student adds and subtracts integers", "Student compares integers using > and < signs"],
  icseOutcomes: [],
  coreConcepts: ["Integers = {...−3, −2, −1, 0, 1, 2, 3,...}; include positive, negative, and zero", "The number line shows integers extending in both directions from 0", "Adding a negative is the same as subtracting its positive; subtracting a negative is the same as adding its positive", "Absolute value |n| is the distance from 0 on the number line — always non-negative"],
  subtopics: [
    { id: "t1", name: "Introduction to Integers", coreConcept: "Negative numbers represent quantities below a reference (0°C, floors below ground, debt)", keyIdea: "Negative numbers extend the number line to the left; −5 is 5 steps left of 0", estimatedPeriods: 2 },
    { id: "t2", name: "Addition and Subtraction of Integers", coreConcept: "Use number line: addition moves right, subtraction moves left; subtracting a negative reverses direction", keyIdea: "5+(−3) = 5−3 = 2 (subtraction); (−4)+(−2) = −6 (both negative, add magnitudes)", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch02:number-line", to: "mth:6:ch06:integer-on-number-line", relationship: "generalises", explanation: "The integer number line extends the whole number line to include negative integers" },
    { from: "mth:6:ch06:integer-addition-rules", to: "mth:7:ch01:integer-multiplication-sign-rules", relationship: "requires", explanation: "Understanding integer addition is prerequisite for integer multiplication in Class 7" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch02", chapterName: "Whole Numbers", requiredConcepts: ["mth:6:ch02:number-line"] }], concepts: ["mth:6:ch02:number-line"] },
  essentialDefinitions: [
    { term: "Integer", formalDefinition: "Any member of the set {..., −3, −2, −1, 0, 1, 2, 3, ...}; positive integers, negative integers, and zero", informalExplanation: "All whole numbers plus their negatives — no fractions or decimals" },
    { term: "Absolute Value", formalDefinition: "|n| is the distance of n from 0 on the number line; |n| ≥ 0 for all integers", informalExplanation: "How far a number is from 0, ignoring direction: |−5| = 5; |5| = 5; both are 5 steps from 0" },
    { term: "Opposite of an Integer", formalDefinition: "For any integer n, its opposite is −n; n + (−n) = 0", informalExplanation: "The mirror image across 0 on the number line; +7 and −7 are opposites" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "−7 is greater than −3 because 7 > 3", correction: "−7 < −3 because −7 is further left on the number line. Larger negative number = smaller value.", whyItHappens: "Students focus on the digit magnitude, forgetting the negative sign reverses order", revealingQuestion: "In winter, which is colder: −7°C or −3°C? How does this compare the integers?" },
    { misconception: "Subtracting a negative: 5−(−3) = 5−3 = 2", correction: "Subtracting a negative is adding the positive: 5−(−3) = 5+3 = 8. The double negative makes a positive.", whyItHappens: "Students apply subtraction mechanically without recognising the sign change", revealingQuestion: "What is 10 − (−4)? Explain using the number line." },
  ],
  examinerTraps: [
    { trap: "Forgetting absolute value is always non-negative", typicalScenario: "Student writes |−5| = −5", avoidanceStrategy: "Absolute value is DISTANCE from 0 — always ≥ 0. |−5| = 5, not −5.", marksAtRisk: "½ mark" },
  ],
  typicalMistakes: [
    { mistake: "(−4) + (−3) = 1 (subtracting magnitudes)", correction: "Both negative → add magnitudes and keep negative sign: (−4)+(−3) = −7", conceptualError: "Not recognising that two negatives add up, not cancel" },
  ],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["At 8am it is −5°C. By noon it warms up 12°C. By evening it cools 8°C. What is the evening temperature?"] }],
  difficultyProgression: [
    { step: 1, concept: "Integers: motivation (temperature, floors, debt)", tier: "foundational", teachingNote: "Real contexts: lift floors below ground; temperature in Shimla in winter" },
    { step: 2, concept: "Integer number line: place and compare", tier: "easy", dependsOnStep: 1, teachingNote: "Mark −10 to +10; compare using the line" },
    { step: 3, concept: "Addition on the number line: jumps right (positive) or left (negative)", tier: "medium", dependsOnStep: 2, teachingNote: "Animate jumps: 5 + (−3) = start at 5, jump 3 left = 2" },
    { step: 4, concept: "Subtraction: change to addition of opposite", tier: "hard", dependsOnStep: 3, teachingNote: "5 − (−3) = 5 + 3 = 8. Double negative = positive." },
  ],
  realLifeApplications: [
    { context: "Bank account: credit and debit", conceptUsed: "Positive integers (credit) and negative integers (debit)", explanation: "Bank balance can go negative (overdraft). Adding to balance = positive integer; debit = negative integer.", ageRelevance: "Students or their parents use bank accounts" },
    { context: "Temperature below freezing", conceptUsed: "Negative integers on the number line", explanation: "Shimla in winter: −8°C. Leh: −20°C. Compare using number line: −20°C < −8°C (colder).", ageRelevance: "India has regions with sub-zero temperatures; weather context is familiar" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 7, chapterId: "ch01", chapterName: "Integers (Class 7)", linkType: "prerequisite-for", description: "Class 7 extends to multiplication and division of integers; Class 6 covers addition and subtraction" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Temperature scales and negative temperatures", description: "Celsius temperature can be negative — same integer concept applied to a physical quantity", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Motivation: lift floors (B2, B1, Ground, 1, 2, 3...); temperature in hill stations in winter", duration: "10 minutes", pedagogyNote: "Real contexts make negative numbers necessary, not arbitrary" },
    { step: 2, action: "Integer number line: mark −10 to +10; compare pairs of integers", duration: "15 minutes", pedagogyNote: "Physical number line on the classroom floor — students stand on integers, compare" },
    { step: 3, action: "Addition: number line jumps; 10 examples across all cases", duration: "20 minutes", pedagogyNote: "Four cases: (+)+(+), (+)+(−), (−)+(+), (−)+(−). Practice all four." },
    { step: 4, action: "Subtraction as adding the opposite; double negative = positive", duration: "20 minutes", pedagogyNote: "Derive: a − b = a + (−b). Verify on number line." },
  ],
});

export const FRACTIONS = ch("ch07", "Fractions", {
  learningObjectives: [
    { statement: "Identify, classify, and convert between proper, improper, and mixed fractions", bloomsLevel: "understand", assessable: true },
    { statement: "Compare fractions with like and unlike denominators using equivalent fractions", bloomsLevel: "apply", assessable: true },
    { statement: "Add and subtract fractions including unlike fractions", bloomsLevel: "apply", assessable: true },
    { statement: "Simplify fractions to their lowest terms using HCF", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Use fractions to solve a cooking recipe scaling problem — double a recipe that requires ¾ cup of flour" },
    { ruleCode: "NEP-HOT", application: "Evaluate: Is ½ always equal to ¼ + ¼? Demonstrate using a fraction bar model." },
  ],
  cbseOutcomes: ["Student classifies and converts between fraction forms", "Student uses LCM to find common denominator for addition/subtraction of unlike fractions", "Student simplifies fractions using HCF"],
  icseOutcomes: [],
  coreConcepts: ["A fraction p/q represents p equal parts of q equal parts of a whole", "Equivalent fractions represent the same quantity: 2/4 = 1/2 = 3/6", "To compare unlike fractions, convert to common denominators (use LCM of denominators)", "Addition/subtraction of fractions requires like denominators; multiply each fraction by the LCD"],
  subtopics: [
    { id: "t1", name: "Types and Representations of Fractions", coreConcept: "Proper (p<q), improper (p≥q), mixed (whole + proper fraction)", keyIdea: "All three represent the same values — convert between them as needed", estimatedPeriods: 2 },
    { id: "t2", name: "Equivalent Fractions and Simplification", coreConcept: "Multiplying/dividing numerator and denominator by same non-zero number preserves value", keyIdea: "Simplest form: HCF of numerator and denominator is 1", estimatedPeriods: 2 },
    { id: "t3", name: "Comparing Fractions", coreConcept: "Convert to common denominator, then compare numerators", keyIdea: "LCM of denominators gives the least common denominator (LCD)", estimatedPeriods: 2 },
    { id: "t4", name: "Addition and Subtraction of Fractions", coreConcept: "Like denominators: add/subtract numerators only. Unlike: find LCD first.", keyIdea: "Always convert to LCD before operating; simplify the result", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch03:hcf-prime-factorisation", to: "mth:6:ch07:simplest-form", relationship: "applies", explanation: "HCF of numerator and denominator divides both to give simplest form" },
    { from: "mth:6:ch03:lcm-prime-factorisation", to: "mth:6:ch07:fraction-addition", relationship: "applies", explanation: "LCM of denominators gives the LCD needed for fraction addition" },
    { from: "mth:6:ch07:equivalent-fractions", to: "mth:7:ch02:fraction-multiplication", relationship: "requires", explanation: "Multiplication of fractions requires understanding equivalent fractions for simplification" },
  ],
  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch03", chapterName: "Playing with Numbers", requiredConcepts: ["mth:6:ch03:hcf-prime-factorisation", "mth:6:ch03:lcm-prime-factorisation"] }],
    concepts: ["mth:6:ch03:hcf-prime-factorisation", "mth:6:ch03:lcm-prime-factorisation"],
  },
  essentialDefinitions: [
    { term: "Fraction", formalDefinition: "A number of the form p/q where p (numerator) and q (denominator) are integers and q ≠ 0", informalExplanation: "Part of a whole: if you cut a pie into q equal slices and take p of them, you have p/q of the pie" },
    { term: "Equivalent Fractions", formalDefinition: "Fractions that represent the same amount; obtained by multiplying or dividing numerator and denominator by the same non-zero integer", informalExplanation: "Different ways to write the same value: 1/2 = 2/4 = 3/6. Different labels for the same point." },
    { term: "Simplest Form (Lowest Terms)", formalDefinition: "A fraction where HCF(numerator, denominator) = 1; no further simplification is possible", informalExplanation: "The fraction stripped of all common factors: 6/8 → divide both by 2 → 3/4 (simplest form)" },
  ],
  formulaInventory: [
    { name: "Adding Unlike Fractions", latex: "\\frac{a}{b} + \\frac{c}{d} = \\frac{a\\cdot d + c\\cdot b}{b\\cdot d}", plainText: "a/b + c/d = (ad + cb) / (bd)", variables: [], applicableWhen: "When no common denominator is available; always simplify the result", doesNotApplyWhen: "For like fractions, just add numerators. For unlike with a known LCD, use LCD instead of bd to get smaller numbers.", examTip: "Always simplify the final fraction using HCF" },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "1/2 + 1/3 = 2/5 (add numerators and denominators)", correction: "NEVER add denominators. 1/2 + 1/3 = 3/6 + 2/6 = 5/6. Find common denominator first.", whyItHappens: "The simplest (wrong) thing to do is add both numerator and denominator separately", revealingQuestion: "If you eat 1/2 of a pizza and then 1/3 of the same pizza, what fraction did you eat? Is 2/5 more or less than 1/2?" },
    { misconception: "A larger denominator means a larger fraction: 3/7 > 3/5", correction: "For same numerator, LARGER denominator means SMALLER fraction: 3/7 < 3/5. Each slice is smaller when the pie is cut into more pieces.", whyItHappens: "Students focus on the denominator digit size without thinking about what it means", revealingQuestion: "Which is more: 1/3 of a pizza or 1/8 of the same pizza? Explain." },
  ],
  examinerTraps: [
    { trap: "Not simplifying the final answer", typicalScenario: "Student adds fractions correctly to get 8/12 and stops", avoidanceStrategy: "Always simplify: 8/12 = 2/3 (divide by HCF=4). Final answer must be in simplest form unless specified otherwise.", marksAtRisk: "½ mark for unsimplified answer" },
  ],
  typicalMistakes: [
    { mistake: "Converting 2⅓ to improper fraction as 23/3", correction: "2⅓ = (2×3+1)/3 = 7/3. Multiply whole number by denominator, ADD numerator, keep same denominator.", conceptualError: "Not multiplying whole number by denominator before adding numerator" },
  ],
  bloomsMap: [{ subtopicId: "t4", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A recipe needs 3/4 cup of sugar for 12 cookies. How much sugar for 8 cookies? Show your working."] }],
  difficultyProgression: [
    { step: 1, concept: "Fraction as part of whole; numerator/denominator meaning", tier: "foundational", teachingNote: "Fraction circles or strips; physically manipulate concrete models" },
    { step: 2, concept: "Types: proper, improper, mixed; conversion between them", tier: "easy", dependsOnStep: 1, teachingNote: "Convert 5/3 to mixed: 5÷3=1 remainder 2 → 1⅔" },
    { step: 3, concept: "Equivalent fractions: multiply/divide both by same number", tier: "easy", dependsOnStep: 2, teachingNote: "Visual: fold paper — 1/2 = 2/4 = 4/8" },
    { step: 4, concept: "Simplification: divide by HCF", tier: "medium", dependsOnStep: 3, teachingNote: "Find HCF first; then divide both terms" },
    { step: 5, concept: "Comparing unlike fractions using LCD", tier: "medium", dependsOnStep: 4, teachingNote: "Find LCM of denominators; convert; compare numerators" },
    { step: 6, concept: "Addition and subtraction of unlike fractions", tier: "hard", dependsOnStep: 5, teachingNote: "Step 1: find LCD. Step 2: convert. Step 3: add/subtract numerators. Step 4: simplify." },
  ],
  realLifeApplications: [
    { context: "Recipe scaling: doubling or halving ingredients", conceptUsed: "Multiplication and division of fractions", explanation: "Double a recipe: ¾ cup flour → 1½ cups. Halve: ¾ cup → 3/8 cup. Practical fraction arithmetic.", ageRelevance: "Cooking is a universal family activity" },
    { context: "Cricket batting average", conceptUsed: "Fractions and comparison", explanation: "Batting average is runs/matches — a fraction. Comparing two players requires comparing fractions.", ageRelevance: "Cricket is India's most popular sport" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 6, chapterId: "ch08", chapterName: "Decimals", linkType: "prerequisite-for", description: "Decimals are fractions with denominator as a power of 10; fraction operations underpin decimal operations" },
    { subject: "Mathematics", classNum: 7, chapterId: "ch02", chapterName: "Fractions and Decimals (Class 7)", linkType: "prerequisite-for", description: "Class 7 extends to multiplication and division of fractions" },
  ],
  crossSubjectLinks: [{ subject: "Chemistry", topic: "Concentrations as fractions (parts per hundred = percent)", description: "Chemical concentration (10% solution = 10/100 fraction) is a fraction application", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Fraction circles: physically show 1/2, 1/3, 1/4; compare sizes", duration: "10 minutes", pedagogyNote: "Concrete before symbolic — handle the circles before writing fractions" },
    { step: 2, action: "Types of fractions: classify 20 fractions; convert mixed ↔ improper", duration: "15 minutes", pedagogyNote: "Fluency drill: rapid conversion" },
    { step: 3, action: "Equivalent fractions: paper folding; then numerical pattern", duration: "15 minutes", pedagogyNote: "Fold paper to show 1/2 = 2/4 = 4/8 physically" },
    { step: 4, action: "Comparison and addition: use LCM; 6 worked examples across difficulty levels", duration: "25 minutes", pedagogyNote: "Always: LCD first, then convert, then operate, then simplify" },
    { step: 5, action: "Word problems: sharing, recipe, time — apply fraction operations", duration: "20 minutes", pedagogyNote: "NEP-COMP: real fraction problems from daily life" },
  ],
});

export const ALGEBRA = ch("ch11", "Algebra", {
  learningObjectives: [
    { statement: "Use variables to represent unknown quantities in patterns and relationships", bloomsLevel: "understand", assessable: true },
    { statement: "Write algebraic expressions for verbal descriptions", bloomsLevel: "apply", assessable: true },
    { statement: "Evaluate algebraic expressions by substituting values", bloomsLevel: "apply", assessable: true },
    { statement: "Solve simple equations of the form x+a=b and ax=b", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Model: 'Three consecutive integers sum to 24. Find them' — translate to algebra and solve" },
    { ruleCode: "NEP-REFL", application: "Reflect: why do we use letters for unknowns? What would mathematics look like without variables?" },
  ],
  cbseOutcomes: ["Student explains the concept of a variable and uses it to write expressions", "Student evaluates expressions for given values of variables", "Student uses equations to model and solve word problems"],
  icseOutcomes: [],
  coreConcepts: ["A variable is a symbol representing an unknown or varying quantity", "An expression is a combination of variables, numbers, and operations — no equals sign", "An equation states that two expressions are equal — has a unique solution for one variable", "Solving an equation means finding the value of the variable that makes the equation true"],
  subtopics: [
    { id: "t1", name: "Introduction to Variables", coreConcept: "Variables generalise number patterns; they represent unknown quantities or general rules", keyIdea: "Matchstick pattern: n triangles need 3n matchsticks — n is the variable", estimatedPeriods: 2 },
    { id: "t2", name: "Expressions and Equations", coreConcept: "Expression: no = sign. Equation: has = sign and a solution.", keyIdea: "2x+3 is an expression; 2x+3=7 is an equation — can be solved", estimatedPeriods: 2 },
    { id: "t3", name: "Using Algebra in Geometry", coreConcept: "Perimeter and area formulas are algebraic expressions with geometric variables", keyIdea: "P = 4a (square) is an algebraic expression relating perimeter to side length", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch11:variable-definition", to: "mth:7:ch04:simple-equations", relationship: "requires", explanation: "Solving equations in Class 7 requires the variable concept introduced here" },
    { from: "mth:6:ch11:expression-vs-equation", to: "mth:9:ch02:polynomial-definition", relationship: "generalises", explanation: "Polynomials are algebraic expressions — Class 6 expressions are the simplest case" },
  ],
  prerequisites: { chapters: [], concepts: ["mth:6:ch02:closure"] },
  essentialDefinitions: [
    { term: "Variable", formalDefinition: "A symbol (usually a letter) that represents a number that can change or is unknown", informalExplanation: "A placeholder for a number we don't know yet, or a quantity that can take different values" },
    { term: "Algebraic Expression", formalDefinition: "A combination of variables, numbers, and mathematical operations (+, −, ×, ÷) that represents a quantity", informalExplanation: "A mathematical phrase — it has value but no definite answer until the variable is specified: 3x+2" },
    { term: "Equation", formalDefinition: "A mathematical statement asserting that two expressions are equal; contains an equals sign and typically has a specific solution", informalExplanation: "A mathematical sentence: says two things are equal. Solving means finding the variable value that makes it true." },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "An expression and an equation are the same", correction: "Expression: no equals sign; represents a quantity. Equation: has equals sign; can be solved. 3x+2 is an expression; 3x+2=8 is an equation.", whyItHappens: "Both involve variables and operations — students miss the equals sign distinction", revealingQuestion: "Which of these can be solved? 5x+3. 5x+3=18. Explain the difference." },
    { misconception: "'x' always means a specific number", correction: "x is a variable — it can represent different values in different contexts. In a pattern, x varies; in an equation, x is a specific unknown.", whyItHappens: "When students solve equations, x has one value — they think x is always one value", revealingQuestion: "In 2x, what happens as x changes from 1 to 2 to 3?" },
  ],
  examinerTraps: [
    { trap: "Writing the expression instead of the equation", typicalScenario: "Question asks: 'Write an equation for: a number doubled and increased by 5 is 17.' Student writes 2x+5.", avoidanceStrategy: "An equation MUST have an equals sign and the result. 2x+5=17 is the equation.", marksAtRisk: "½ mark for missing the '=17' part" },
  ],
  typicalMistakes: [
    { mistake: "Substituting: 3x² when x=2 gives 36 (computing (3×2)² = 6² = 36 instead of 3×4 = 12)", correction: "Order of operations: x² = x×x = 4 first; then 3×4 = 12. Squaring x is not the same as squaring 3x.", conceptualError: "Incorrect order of operations with variables" },
  ],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Write an equation for: 'I think of a number, multiply by 3 and subtract 5 to get 22. Find the number.'", "A rectangle has perimeter 36 cm. If length = 2 × breadth, find the dimensions."] }],
  difficultyProgression: [
    { step: 1, concept: "Variables from patterns: matchstick, sequence", tier: "foundational", teachingNote: "Draw pattern; count; find the rule; express using n" },
    { step: 2, concept: "Expression from word description: 5 more than x → x+5", tier: "easy", dependsOnStep: 1, teachingNote: "10 word-to-algebra translations" },
    { step: 3, concept: "Evaluate expressions: substitute and compute", tier: "easy", dependsOnStep: 2, teachingNote: "Always substitute in brackets: (2)(3)+4, not 2×3+4" },
    { step: 4, concept: "Simple equations: trial and error first, then balancing method", tier: "medium", dependsOnStep: 3, teachingNote: "Start with trial; show that balancing (same operation both sides) always works" },
  ],
  realLifeApplications: [
    { context: "Mobile plan: cost = 100 + 0.5n for n minutes", conceptUsed: "Algebraic expression for a real relationship", explanation: "A mobile plan with a base charge and per-minute rate is an algebraic expression. Finding total cost for 200 minutes: substitute n=200.", ageRelevance: "Students or families use mobile plans" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 7, chapterId: "ch04", chapterName: "Simple Equations", linkType: "prerequisite-for", description: "Class 7 formalises equation solving with the transposition method; Class 6 introduces the concept" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Formula substitution in equations of motion", description: "Physics formulas like v=u+at are algebraic expressions — substituting known values gives unknowns", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Matchstick pattern: draw 1, 2, 3 triangles; count sticks; find the formula 3n", duration: "15 minutes", pedagogyNote: "NEP-IDC: pattern discovery before formula" },
    { step: 2, action: "Expressions: translate 10 word descriptions to algebra", duration: "15 minutes", pedagogyNote: "Vocabulary: 'more than' = +, 'product of' = ×, 'quotient' = ÷" },
    { step: 3, action: "Evaluate expressions by substitution: 10 examples", duration: "15 minutes", pedagogyNote: "Use brackets when substituting negative values" },
    { step: 4, action: "Simple equations: guess, then balance; model with a scale diagram", duration: "20 minutes", pedagogyNote: "Physical balance metaphor: what you do to one side, do to the other" },
    { step: 5, action: "Word problems → equations → solve: 5 contextual problems", duration: "20 minutes", pedagogyNote: "NEP-PROB: translate, write equation, solve, interpret" },
  ],
});

export const RATIO_AND_PROPORTION = ch("ch12", "Ratio and Proportion", {
  learningObjectives: [
    { statement: "Define ratio and express it in simplest form", bloomsLevel: "understand", assessable: true },
    { statement: "Determine whether two ratios form a proportion; use cross-multiplication to verify", bloomsLevel: "apply", assessable: true },
    { statement: "Solve problems using unitary method", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Use proportion to scale up a recipe: if 3 cups makes 12 pancakes, how many cups for 20 pancakes?" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'All ratios are fractions, but not all fractions are ratios.' Is this true?" },
  ],
  cbseOutcomes: ["Student defines ratio and writes it in simplest form", "Student identifies proportions and verifies using cross products", "Student applies unitary method to solve direct proportion problems"],
  icseOutcomes: [],
  coreConcepts: ["Ratio compares two quantities of the same kind; 3:4 means for every 3 of one, there are 4 of the other", "Equivalent ratios: same as equivalent fractions — multiply/divide both terms by same number", "Proportion: two ratios are equal (a:b = c:d iff ad = bc)", "Unitary method: find value for 1 unit first, then scale to required units"],
  subtopics: [
    { id: "t1", name: "Ratio", coreConcept: "Comparison of two quantities of the same type by division", keyIdea: "Ratio 3:4 means 3/4 — the first quantity is 3/4 of the second", estimatedPeriods: 2 },
    { id: "t2", name: "Proportion", coreConcept: "Two ratios are equal (a:b :: c:d iff ad=bc)", keyIdea: "Cross-product check: product of extremes = product of means", estimatedPeriods: 2 },
    { id: "t3", name: "Unitary Method", coreConcept: "Find value for one unit; multiply for required units", keyIdea: "Find cost of 1 item first; then cost of n items", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch07:simplest-form", to: "mth:6:ch12:ratio-in-simplest-form", relationship: "applies", explanation: "Ratio in simplest form uses the same HCF simplification as fractions" },
    { from: "mth:6:ch12:proportion-definition", to: "mth:7:ch08:percentage-application", relationship: "applies", explanation: "Percentage is a proportion with second term = 100" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch07", chapterName: "Fractions", requiredConcepts: ["mth:6:ch07:simplest-form"] }], concepts: ["mth:6:ch07:equivalent-fractions"] },
  essentialDefinitions: [
    { term: "Ratio", formalDefinition: "The comparison of two quantities of the same kind by division; ratio of a to b is a:b = a/b", informalExplanation: "How many times one quantity fits into another — 3:4 means the first is ¾ of the second" },
    { term: "Proportion", formalDefinition: "An equation stating that two ratios are equal: a:b = c:d iff ad = bc (products of means and extremes are equal)", informalExplanation: "Two ratios that are equivalent — like 1:2 = 3:6 (both equal ½)" },
    { term: "Unitary Method", formalDefinition: "A method of solving problems by first finding the value of one unit and then the value of the required number of units", informalExplanation: "Find cost of 1, then cost of n. Or find quantity for 1 day, then for n days." },
  ],
  formulaInventory: [
    { name: "Cross Multiplication (Proportion Check)", latex: "\\frac{a}{b} = \\frac{c}{d} \\iff a \\times d = b \\times c", plainText: "a/b = c/d if and only if ad = bc", variables: [], applicableWhen: "Verifying if two ratios form a proportion or finding an unknown in a proportion", doesNotApplyWhen: "Not applicable when the ratios are not meant to be equal", examTip: "Extremes × means: ad = bc. The cross products must be equal for a proportion." },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Ratio 2:3 means 2 parts + 3 parts = 5 parts total, so first quantity is 2/5 of total", correction: "This is correct for dividing a total into parts — but the ratio itself just means for every 2 of one, there are 3 of the other. The fraction interpretation depends on context.", whyItHappens: "Students confuse the 'ratio as fraction of total' interpretation with 'ratio as comparison' interpretation", revealingQuestion: "Girls:Boys = 2:3 in a class of 30. How many girls? How many boys?" },
  ],
  examinerTraps: [
    { trap: "Expressing ratio with different units", typicalScenario: "Ratio of 1 km to 500 m: student writes 1:500 without converting", avoidanceStrategy: "Always convert to same units first: 1 km = 1000 m, so ratio = 1000:500 = 2:1", marksAtRisk: "Full marks" },
  ],
  typicalMistakes: [
    { mistake: "Cross multiplying to verify proportion: student writes 2×6 = 3×4 → 12=12 correct, but then writes the proportion as 2:3 = 4:6 (reversed second ratio)", correction: "If 2:3 = 4:6, verify: 2×6 = 12 and 3×4 = 12. ✓ Order matters: extremes are the first and last terms.", conceptualError: "Not keeping track of which terms are 'means' and 'extremes'" },
  ],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A car travels 240 km in 4 hours. At the same speed, how far will it travel in 7 hours?", "In a school, ratio of students to teachers is 25:1. If there are 750 students, how many teachers?"] }],
  difficultyProgression: [
    { step: 1, concept: "Ratio: definition, expression, simplest form", tier: "easy", teachingNote: "Concrete: ratio of boys to girls in class; ratio of ingredients in a recipe" },
    { step: 2, concept: "Equivalent ratios: scale up and down", tier: "easy", dependsOnStep: 1, teachingNote: "Same as equivalent fractions — multiply/divide both terms by same number" },
    { step: 3, concept: "Proportion: cross-product verification", tier: "medium", dependsOnStep: 2, teachingNote: "Check: if 2:3 = 4:6, then 2×6 = 3×4 → 12=12 ✓" },
    { step: 4, concept: "Unitary method: find-1-first approach", tier: "medium", dependsOnStep: 3, teachingNote: "Always write: 'If X costs ₹Y, then 1 costs ₹Y/X, then n costs ₹nY/X'" },
  ],
  realLifeApplications: [
    { context: "Map reading: 1 cm on map = 5 km in reality", conceptUsed: "Ratio as scale factor", explanation: "Maps use proportional scaling. 1:500,000 means 1 cm on map = 500,000 cm = 5 km on ground.", ageRelevance: "Maps, atlases, Google Maps use this concept" },
    { context: "Currency exchange rates", conceptUsed: "Proportion and unitary method", explanation: "If 1 USD = ₹83, then 15 USD = ₹15×83 = ₹1245. Unitary method applied to currency.", ageRelevance: "Exchange rates are in daily news; travel context" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 7, chapterId: "ch08", chapterName: "Comparing Quantities", linkType: "prerequisite-for", description: "Percentage is proportion with second term 100; Class 7 formalises this connection" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Speed, distance, time ratios", description: "Speed = distance/time is a ratio; proportionality between distance and time at constant speed", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Ratio discovery: mix juice — 1 cup juice : 2 cups water, then 2:4 — same taste? Why?", duration: "10 minutes", pedagogyNote: "Concrete experience of equivalent ratios before definition" },
    { step: 2, action: "Write and simplify ratios; express in 1:n form", duration: "15 minutes", pedagogyNote: "Simplify to lowest terms using HCF" },
    { step: 3, action: "Proportion: cross multiplication; find the missing term", duration: "20 minutes", pedagogyNote: "Practice: given three of the four terms, find the fourth" },
    { step: 4, action: "Unitary method: 5 word problems at increasing difficulty", duration: "25 minutes", pedagogyNote: "Always write the unit step explicitly as a separate line" },
  ],
});

export const MENSURATION_CLASS6 = ch("ch10", "Mensuration", {
  learningObjectives: [
    { statement: "Calculate the perimeter of rectangle, square, and irregular rectilinear figures", bloomsLevel: "apply", assessable: true },
    { statement: "Calculate the area of rectangle and square by counting unit squares and by formula", bloomsLevel: "apply", assessable: true },
    { statement: "Distinguish between perimeter and area; explain when each is relevant", bloomsLevel: "understand", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Calculate the cost of fencing a garden (perimeter) and cost of carpet (area) — different real problems" },
    { ruleCode: "NEP-HOT", application: "Evaluate: two rectangles with the same perimeter can have different areas. Give an example and explain why." },
  ],
  cbseOutcomes: ["Student computes perimeter of rectilinear figures", "Student computes area of rectangles and squares using formula", "Student identifies which measurement (area or perimeter) is required for different real contexts"],
  icseOutcomes: [],
  coreConcepts: ["Perimeter = total boundary length; measured in linear units (cm, m)", "Area = space enclosed within the boundary; measured in square units (cm², m²)", "Rectangle: Perimeter = 2(l+b), Area = l×b. Square: Perimeter = 4a, Area = a²", "Area can be found by counting unit squares — connects to the formula"],
  subtopics: [
    { id: "t1", name: "Perimeter", coreConcept: "Total length of all sides; walking around the boundary", keyIdea: "Perimeter = sum of all sides; for rectangles, use 2(l+b)", estimatedPeriods: 2 },
    { id: "t2", name: "Area", coreConcept: "Amount of surface enclosed; count unit squares or use formula", keyIdea: "Area = l×b for rectangle; this is why we multiply — filling rows and columns of unit squares", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch10:area-rectangle", to: "mth:9:ch10:herons-formula-motivation", relationship: "requires", explanation: "Heron's formula addresses the case where height is unknown; students must first know the standard formula" },
  ],
  prerequisites: { chapters: [], concepts: ["mth:6:ch02:closure"] },
  essentialDefinitions: [
    { term: "Perimeter", formalDefinition: "The total length of the boundary of a closed figure; the sum of all side lengths", informalExplanation: "If you walked all the way around the shape, how far did you go?" },
    { term: "Area", formalDefinition: "The amount of surface enclosed within the boundary of a plane figure; measured in square units", informalExplanation: "How much space the shape covers — how many unit tiles fit inside it" },
  ],
  formulaInventory: [
    { name: "Rectangle Perimeter and Area", latex: "P = 2(l+b); \\quad A = l \\times b", plainText: "P = 2(l+b); A = l×b", variables: [{ symbol: "l", meaning: "length" }, { symbol: "b", meaning: "breadth" }], applicableWhen: "Any rectangle", doesNotApplyWhen: "Non-rectangular shapes need different formulas" },
    { name: "Square Perimeter and Area", latex: "P = 4a; \\quad A = a^2", plainText: "P = 4a; A = a²", variables: [{ symbol: "a", meaning: "side length" }], applicableWhen: "Any square", doesNotApplyWhen: "Only for squares — all sides equal" },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "A shape with larger perimeter always has larger area", correction: "A 1×10 rectangle (P=22, A=10) vs a 5×5 square (P=20, A=25) — square has SMALLER perimeter but LARGER area", whyItHappens: "Perimeter and area feel like they should track together", revealingQuestion: "Draw two rectangles with the same perimeter (say 20 cm). Can they have different areas?" },
    { misconception: "Area is in cm, not cm²", correction: "Area is always in SQUARE units. Length is cm; area is cm². A 3cm × 4cm rectangle has area 12 cm², not 12 cm.", whyItHappens: "Students forget the square in the unit", revealingQuestion: "What unit should you use when measuring area? Why is it a 'square' unit?" },
  ],
  examinerTraps: [
    { trap: "Computing perimeter when area is asked, or vice versa", typicalScenario: "Question asks 'how much carpet needed?' (area), student computes perimeter", avoidanceStrategy: "Fencing/framing/border = perimeter. Carpet/paint/field = area. Always identify which is needed before computing.", marksAtRisk: "Full marks for right calculation of wrong quantity" },
  ],
  typicalMistakes: [
    { mistake: "P = l + b (missing factor of 2)", correction: "A rectangle has 4 sides: two lengths and two breadths. P = l + b + l + b = 2(l+b). Never forget to account for both pairs.", conceptualError: "Not counting all four sides" },
  ],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A room is 6m × 4m. Cost of carpeting: ₹120/m². Cost of border tiles: ₹50/m. Find total cost."] }],
  difficultyProgression: [
    { step: 1, concept: "Perimeter: sum of all sides for rectilinear figures", tier: "easy", teachingNote: "Walk around the classroom and measure — physical experience of perimeter" },
    { step: 2, concept: "Area: counting unit squares, then formula", tier: "easy", dependsOnStep: 1, teachingNote: "Draw a rectangle on graph paper; count squares; verify with formula" },
    { step: 3, concept: "Same perimeter, different area / vice versa", tier: "hard", dependsOnStep: 2, teachingNote: "NEP-HOT: this is counterintuitive — demonstrate with graph paper examples" },
    { step: 4, concept: "Word problems: fencing vs carpet context", tier: "medium", dependsOnStep: 2, teachingNote: "Decision making: which formula? What units?" },
  ],
  realLifeApplications: [
    { context: "Fencing a garden", conceptUsed: "Perimeter", explanation: "Cost of fencing depends on total boundary length (perimeter). More meters of fence needed = higher cost.", ageRelevance: "Many students have gardens at home" },
    { context: "Carpeting a room", conceptUsed: "Area", explanation: "Amount of carpet needed depends on floor area (l×b). Cost per square metre × total area = total cost.", ageRelevance: "Home furnishing context; direct relevance" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch10", chapterName: "Heron's Formula", linkType: "prerequisite-for", description: "Heron's formula extends area calculation to triangles without height; Class 6 is the foundation" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Surface area in heat and fluid contexts", description: "Heat loss is proportional to surface area; the same area concept from mensuration applies in physics", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Walk classroom perimeter; measure with tape; compute by sum of sides", duration: "15 minutes", pedagogyNote: "Physical measurement activity — real experience of perimeter" },
    { step: 2, action: "Area on graph paper: count squares; derive formula from patterns", duration: "20 minutes", pedagogyNote: "Discovery: for a 3×4 rectangle, there are 3 rows of 4 squares = 12 squares = l×b" },
    { step: 3, action: "Same perimeter, different area investigation", duration: "20 minutes", pedagogyNote: "NEP-HOT: students investigate on graph paper; record findings" },
    { step: 4, action: "Word problems: fencing, painting, carpeting", duration: "20 minutes", pedagogyNote: "Always identify: is this a perimeter or area problem? Why?" },
  ],
});

export const MATHEMATICS_CLASS6: ChapterKnowledge[] = [
  KNOWING_OUR_NUMBERS,
  WHOLE_NUMBERS,
  PLAYING_WITH_NUMBERS,
  BASIC_GEOMETRICAL_IDEAS,
  INTEGERS,
  FRACTIONS,
  ALGEBRA,
  RATIO_AND_PROPORTION,
  MENSURATION_CLASS6,
];
