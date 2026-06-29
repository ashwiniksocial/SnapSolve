/**
 * Academic Knowledge — Mathematics, Class 7 (key chapters)
 * All 20 metadata fields per chapter.
 * Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

function ch(chapterId: string, chapterName: string, data: Omit<ChapterKnowledge, "chapterId"|"chapterName"|"classNum"|"subject"|"board">): ChapterKnowledge {
  return { chapterId, chapterName, classNum: 7, subject: "Mathematics", board: "Both", ...data };
}

export const INTEGERS_CLASS7 = ch("ch01", "Integers", {
  learningObjectives: [
    { statement: "Multiply and divide integers applying sign rules correctly", bloomsLevel: "apply", assessable: true },
    { statement: "Apply distributivity and other properties of integers under multiplication", bloomsLevel: "apply", assessable: true },
    { statement: "Solve word problems requiring integer multiplication and division", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: (−1) × (−1) = 1. Prove this from the properties of integers without just stating the rule." },
    { ruleCode: "NEP-COMP", application: "Calculate a bank balance after withdrawals and deposits over a week using integer operations" },
  ],
  cbseOutcomes: ["Student multiplies and divides integers using sign rules", "Student applies properties of integers under multiplication (closure, commutativity, associativity, distributivity)", "Student solves word problems involving integer operations"],
  icseOutcomes: [],
  coreConcepts: ["Multiplication sign rules: same signs → positive; different signs → negative", "Division follows the same sign rules as multiplication", "All four properties (closure, commutativity, associativity, distributivity) hold for integer multiplication", "The product of two negative integers is positive — this is a consequence of consistency with the distributive law"],
  subtopics: [
    { id: "t1", name: "Multiplication of Integers", coreConcept: "Sign rules: (+×+ = +), (−×− = +), (+×− = −), (−×+ = −)", keyIdea: "The double negative rule (+) is not arbitrary — it follows from maintaining distributivity", estimatedPeriods: 3 },
    { id: "t2", name: "Properties of Integer Multiplication", coreConcept: "Closure, commutativity, associativity, distributivity — all hold for integers", keyIdea: "Distributivity enables mental calculation: (−4)×(8+3) = (−4)×8 + (−4)×3", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch06:integer-addition-rules", to: "mth:7:ch01:integer-multiplication-sign-rules", relationship: "requires", explanation: "Sign rules for multiplication derive from maintaining consistency with addition rules" },
    { from: "mth:7:ch01:integer-multiplication-sign-rules", to: "mth:8:ch01:rational-multiplication", relationship: "generalises", explanation: "Rational number multiplication uses the same sign rules extended to fractions" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch06", chapterName: "Integers", requiredConcepts: ["mth:6:ch06:integer-addition-rules"] }], concepts: ["mth:6:ch06:integer-on-number-line"] },
  essentialDefinitions: [
    { term: "Integer Multiplication Sign Rule", formalDefinition: "The product of two integers has the same sign if both have the same sign; the product has a negative sign if the integers have different signs", informalExplanation: "Positive × Positive = Positive; Negative × Negative = Positive; Positive × Negative = Negative" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "(−3) × (−4) = −12 (applying minus to the answer)", correction: "(−3) × (−4) = +12. Negative × Negative = Positive. The two negatives cancel each other's sign.", whyItHappens: "Students see two negatives and think the result must be negative", revealingQuestion: "What is (−5) × (−6)? How do you know the sign?" },
  ],
  examinerTraps: [{ trap: "Sign of (−2)³: treating as −(2³) = −8 vs (−2)×(−2)×(−2) = −8 (both happen to be the same but for wrong reason for odd powers)", typicalScenario: "For even powers: (−2)⁴ = 16 but student may write −16", avoidanceStrategy: "(−2)⁴ = (−2)×(−2)×(−2)×(−2) = (+4)×(+4) = 16. Even powers of negative = positive. Odd powers = negative.", marksAtRisk: "1 mark" }],
  typicalMistakes: [{ mistake: "0 × (−7) = −7 (treating zero as negative)", correction: "0 × anything = 0. The multiplication by zero property supersedes the sign rule.", conceptualError: "Not applying zero multiplication property first" }],
  bloomsMap: [{ subtopicId: "t1", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "evaluate"], hotsStarters: ["Prove that (−1) × (−1) = 1 using the distributive property and the fact that (−1) × 1 = −1."] }],
  difficultyProgression: [
    { step: 1, concept: "Multiplication of integers: sign rules with examples", tier: "easy", teachingNote: "Number pattern approach: 3×2=6, 3×1=3, 3×0=0, 3×(−1)=? Pattern continues" },
    { step: 2, concept: "Division of integers: same sign rules as multiplication", tier: "easy", dependsOnStep: 1, teachingNote: "Division is inverse of multiplication — sign rules follow automatically" },
    { step: 3, concept: "Properties: apply distributivity for mental calculation", tier: "medium", dependsOnStep: 1, teachingNote: "(−7) × 49 = (−7)×50 − (−7)×1 = −350 + 7 = −343" },
  ],
  realLifeApplications: [{ context: "Temperature drop over multiple days", conceptUsed: "Integer multiplication", explanation: "Temperature drops 3°C per day for 5 days: change = (−3) × 5 = −15°C. Negative = drop.", ageRelevance: "Weather forecasting context" }],
  crossChapterLinks: [{ subject: "Mathematics", classNum: 8, chapterId: "ch01", chapterName: "Rational Numbers", linkType: "prerequisite-for", description: "Rational number multiplication uses the same sign rules" }],
  crossSubjectLinks: [{ subject: "Physics", topic: "Negative displacement and velocity", description: "Negative values in physics (moving backward, below reference) use integer sign rules", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Pattern discovery: multiply positive number by decreasing integers; observe sign change", duration: "15 minutes", pedagogyNote: "3×3=9, 3×2=6, 3×1=3, 3×0=0, 3×(−1)=−3, 3×(−2)=−6 — pattern continues" },
    { step: 2, action: "Double negative: same approach for negative × negative", duration: "15 minutes", pedagogyNote: "(−3)×3=−9, (−3)×2=−6, (−3)×1=−3, (−3)×0=0, (−3)×(−1)=+3" },
    { step: 3, action: "Properties and word problems", duration: "25 minutes", pedagogyNote: "Distributivity as mental arithmetic tool; word problems with consistent sign convention" },
  ],
});

export const FRACTIONS_AND_DECIMALS = ch("ch02", "Fractions and Decimals", {
  learningObjectives: [
    { statement: "Multiply and divide fractions including mixed fractions", bloomsLevel: "apply", assessable: true },
    { statement: "Multiply and divide decimals up to three decimal places", bloomsLevel: "apply", assessable: true },
    { statement: "Apply fraction and decimal operations to solve real-world problems", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Calculate the cost of 2.5 kg of vegetables at ₹37.50 per kg using decimal multiplication" },
    { ruleCode: "NEP-HOT", application: "Is dividing by ½ the same as multiplying by 2? Explain with a real-world example." },
  ],
  cbseOutcomes: ["Student multiplies fractions (including mixed) correctly using reciprocal for division", "Student multiplies and divides decimals; places decimal point correctly", "Student applies operations to solve word problems"],
  icseOutcomes: [],
  coreConcepts: ["To multiply fractions: multiply numerators and denominators separately, then simplify", "To divide fractions: multiply by the reciprocal of the divisor", "For decimals: multiply ignoring decimal; then count total decimal places and insert point from right", "Division by a decimal: convert to equivalent division by whole number by shifting decimal"],
  subtopics: [
    { id: "t1", name: "Multiplication of Fractions", coreConcept: "'Of' means multiply: ½ of ¾ = ½ × ¾ = 3/8", keyIdea: "Simplify before multiplying (cross-cancel) to keep numbers small", estimatedPeriods: 3 },
    { id: "t2", name: "Division of Fractions", coreConcept: "Dividing by p/q is the same as multiplying by q/p (the reciprocal)", keyIdea: "Why reciprocal works: a ÷ (p/q) = a × (q/p) — dividing by a fraction makes the result larger, not smaller", estimatedPeriods: 2 },
    { id: "t3", name: "Multiplication and Division of Decimals", coreConcept: "Decimal point placement: count total decimal digits in both factors; place from right in product", keyIdea: "3.2 × 1.5 = (32 × 15)/100 = 480/100 = 4.80 — the factor of 100 gives two decimal places", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:6:ch07:fraction-addition", to: "mth:7:ch02:fraction-multiplication", relationship: "generalises", explanation: "Multiplication of fractions is a natural extension of Class 6 operations" },
    { from: "mth:7:ch02:reciprocal", to: "mth:8:ch01:rational-multiplication", relationship: "applies", explanation: "Reciprocal concept applies to rational number division" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch07", chapterName: "Fractions", requiredConcepts: ["mth:6:ch07:simplest-form", "mth:6:ch07:fraction-addition"] }], concepts: ["mth:6:ch07:equivalent-fractions"] },
  essentialDefinitions: [
    { term: "Reciprocal", formalDefinition: "The reciprocal of p/q is q/p; the product of a number and its reciprocal is always 1", informalExplanation: "Flip the fraction upside down: reciprocal of 3/4 is 4/3. Any fraction × its reciprocal = 1." },
  ],
  formulaInventory: [
    { name: "Fraction Division", latex: "\\frac{a}{b} \\div \\frac{p}{q} = \\frac{a}{b} \\times \\frac{q}{p}", plainText: "a/b ÷ p/q = a/b × q/p", variables: [], applicableWhen: "Dividing any fraction by another fraction", doesNotApplyWhen: "Does not apply if divisor is zero", examTip: "KCF: Keep the first fraction, Change ÷ to ×, Flip the second fraction" },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "3/4 ÷ 1/2 = 3/8 (dividing numerators and denominators separately)", correction: "Division by a fraction: keep first, flip second, multiply: ¾ ÷ ½ = ¾ × 2 = 3/2 = 1½", whyItHappens: "Students extend the wrong rule from multiplication (where you do multiply across)", revealingQuestion: "Divide 3/4 by 1/2. Think: how many halves are in three-quarters?" },
    { misconception: "Dividing by a fraction always makes the result smaller", correction: "Dividing by a fraction < 1 makes the result LARGER: 4 ÷ (1/2) = 8. Dividing by something small gives a big result.", whyItHappens: "Dividing by whole numbers always decreases the value; students generalise to all division", revealingQuestion: "Is 6 ÷ (1/3) larger or smaller than 6? Compute and explain." },
  ],
  examinerTraps: [{ trap: "Decimal multiplication: wrong placement of decimal point", typicalScenario: "1.2 × 1.5: student computes 12×15=180 but writes 18.0 (only 1 decimal place) instead of 1.80", avoidanceStrategy: "Count decimal places in both factors: 1 (in 1.2) + 1 (in 1.5) = 2 total. Place decimal 2 from right: 1.80.", marksAtRisk: "½–1 mark" }],
  typicalMistakes: [{ mistake: "2⅓ × 1½: computing 2×1=2, ⅓×½=⅙, giving 2⅙ (treating whole and fraction parts separately)", correction: "Convert to improper fractions first: 7/3 × 3/2 = 21/6 = 7/2 = 3½", conceptualError: "Not converting mixed fractions before multiplying" }],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A recipe uses ¾ cup of flour per batch. How many batches can you make with 4½ cups of flour?"] }],
  difficultyProgression: [
    { step: 1, concept: "Multiplication of proper fractions", tier: "easy", teachingNote: "Visualise: ½ of ¾ means take ½ of a ¾-shaded shape" },
    { step: 2, concept: "Cross-cancellation before multiplying", tier: "medium", dependsOnStep: 1, teachingNote: "Simplify before multiplying: (4/9)×(3/8) → (1/3)×(1/2) = 1/6" },
    { step: 3, concept: "Mixed fraction multiplication: convert first", tier: "medium", dependsOnStep: 2, teachingNote: "Always convert mixed → improper before any operation" },
    { step: 4, concept: "Division: flip and multiply", tier: "medium", dependsOnStep: 2, teachingNote: "KCF: Keep, Change, Flip" },
    { step: 5, concept: "Decimal multiplication: count decimal places", tier: "medium", teachingNote: "Work with integers first; then insert decimal point" },
    { step: 6, concept: "Decimal division: shift decimal to make whole number", tier: "hard", dependsOnStep: 5, teachingNote: "0.6 ÷ 0.3 = 6 ÷ 3 = 2 (shift both decimals by same amount)" },
  ],
  realLifeApplications: [
    { context: "Buying fabric: 2.5 metres at ₹85.50/metre", conceptUsed: "Decimal multiplication", explanation: "2.5 × 85.50 = 213.75. Decimal multiplication for pricing.", ageRelevance: "Shopping for fabric, groceries — daily life" },
  ],
  crossChapterLinks: [{ subject: "Mathematics", classNum: 8, chapterId: "ch07", chapterName: "Comparing Quantities", linkType: "prerequisite-for", description: "Percentage calculations require fraction and decimal multiplication" }],
  crossSubjectLinks: [{ subject: "Chemistry", topic: "Concentration calculations: mass fraction", description: "Mass fraction of a solution = mass of solute/mass of solution — fraction division/multiplication", strength: "moderate" }],
  teachingSequence: [
    { step: 1, action: "Fraction multiplication: 'of' as multiplication; visual models", duration: "15 minutes", pedagogyNote: "½ of ¾ pizza — shade ¾, take ½ of that → 3/8" },
    { step: 2, action: "Division: 'how many halves in ¾?' Build reciprocal concept", duration: "20 minutes", pedagogyNote: "Concrete before abstract: how many ½s in 3/4? Count on number line" },
    { step: 3, action: "Decimal multiplication: example with explicit decimal-count method", duration: "20 minutes", pedagogyNote: "Step by step: ignore decimal → multiply → count → place" },
    { step: 4, action: "Word problems mixing fractions and decimals", duration: "20 minutes", pedagogyNote: "Real measurement, cooking, shopping contexts" },
  ],
});

export const SIMPLE_EQUATIONS = ch("ch04", "Simple Equations", {
  learningObjectives: [
    { statement: "Set up equations from word problems using variables", bloomsLevel: "apply", assessable: true },
    { statement: "Solve linear equations in one variable using balancing and transposition methods", bloomsLevel: "apply", assessable: true },
    { statement: "Verify solutions by substituting back into the original equation", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Model: 'The sum of three consecutive numbers is 48. Find them.' — set up and solve without being told the variable" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Transposing a term changes its sign.' Why? Derive this from the balancing method." },
  ],
  cbseOutcomes: ["Student sets up linear equations from given information", "Student solves equations using transposition method", "Student verifies solutions by checking in original equation"],
  icseOutcomes: ["ICSE expects: equations with variable on both sides"],
  coreConcepts: ["An equation is balanced — both sides are equal, like a scale", "Legal operations: adding/subtracting/multiplying/dividing the same quantity on both sides preserves equality", "Transposition: moving a term across = changes its sign (the quick version of balancing)", "Solution: the value that makes both sides equal when substituted"],
  subtopics: [
    { id: "t1", name: "Setting Up Equations", coreConcept: "Translate word problems into algebraic equations using a variable for the unknown", keyIdea: "'Three more than a number is 10' → x+3=10", estimatedPeriods: 2 },
    { id: "t2", name: "Solving Equations: Balancing and Transposition", coreConcept: "Isolate the variable by performing inverse operations on both sides", keyIdea: "Transposition is the fast version: move to other side and change sign", estimatedPeriods: 3 },
    { id: "t3", name: "Word Problems Using Equations", coreConcept: "The equation is the model; solve to find the real-world answer", keyIdea: "Always interpret the solution: 'x = 7 means the number is 7, so the three consecutive numbers are 7, 8, 9'", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch11:expression-vs-equation", to: "mth:7:ch04:simple-equations", relationship: "requires", explanation: "Understanding expressions from Class 6 is prerequisite for forming and solving equations" },
    { from: "mth:7:ch04:transposition", to: "mth:8:ch02:linear-equations", relationship: "generalises", explanation: "Class 8 extends to two-step equations and equations with fractions" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch11", chapterName: "Algebra", requiredConcepts: ["mth:6:ch11:variable-definition", "mth:6:ch11:expression-vs-equation"] }], concepts: ["mth:6:ch11:variable-definition"] },
  essentialDefinitions: [
    { term: "Linear Equation", formalDefinition: "An equation of the form ax + b = c where the variable x appears with degree 1", informalExplanation: "An equation where x is not squared or cubed — just x, maybe multiplied by a constant" },
    { term: "Transposition", formalDefinition: "Moving a term from one side of an equation to the other, changing its sign in the process", informalExplanation: "The shortcut: x + 3 = 10 → x = 10 − 3. Moved the +3 to the right, it becomes −3." },
    { term: "Solution", formalDefinition: "The value of the variable that satisfies the equation — makes both sides equal", informalExplanation: "The number that makes the equation true when substituted" },
  ],
  formulaInventory: [],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Transposition: when moving a multiplied term, just remove it (not divide)", correction: "If 3x = 12, dividing both sides by 3 gives x = 4. NOT: 'remove the 3 and x = 12'.", whyItHappens: "Students understand transposition of addition/subtraction but apply wrong inverse for multiplication", revealingQuestion: "Solve 5x = 35 using the balancing method step by step." },
  ],
  examinerTraps: [{ trap: "Not verifying the solution in the original equation", typicalScenario: "Student finds x = 5 but doesn't check: LHS = 3(5)+2 = 17 = RHS? Verification reveals errors.", avoidanceStrategy: "Always write 'Verification: LHS = [substitute] = RHS = ✓' as the last step", marksAtRisk: "½ mark for missing verification in some exam formats" }],
  typicalMistakes: [{ mistake: "x/3 + 2 = 5 → x = (5−2)/3 = 1 (dividing instead of multiplying after transposition)", correction: "x/3 + 2 = 5 → x/3 = 3 → x = 3×3 = 9. When x is divided by 3, solving requires multiplying by 3.", conceptualError: "Not using the correct inverse operation" }],
  bloomsMap: [{ subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Ravi's age is twice Priya's age. Five years later, the sum of their ages will be 40. Find their current ages."] }],
  difficultyProgression: [
    { step: 1, concept: "Setting up equations from word statements", tier: "easy", teachingNote: "One-variable word problems; key vocabulary translation" },
    { step: 2, concept: "Balancing method: perform same operation on both sides", tier: "easy", dependsOnStep: 1, teachingNote: "Scale model: adding weight to one pan requires adding same to other" },
    { step: 3, concept: "Transposition as a shortcut; verify the solution", tier: "medium", dependsOnStep: 2, teachingNote: "Derive transposition from balancing — it's the same thing done faster" },
    { step: 4, concept: "Equations with fractions and multiple operations", tier: "hard", dependsOnStep: 3, teachingNote: "Clear fractions first by multiplying by LCM of denominators" },
  ],
  realLifeApplications: [{ context: "Unknown number of items: 'I bought n books at ₹25 each and spent ₹175'", conceptUsed: "Equation setup and solution: 25n = 175 → n = 7", explanation: "Equations model the relationship; solving finds the unknown", ageRelevance: "Shopping and counting in daily life" }],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 8, chapterId: "ch02", chapterName: "Linear Equations in One Variable", linkType: "prerequisite-for", description: "Class 8 extends to equations with variables on both sides and fractional equations" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch04", chapterName: "Linear Equations in Two Variables", linkType: "prerequisite-for", description: "Class 9 extends to equations in two variables" },
  ],
  crossSubjectLinks: [{ subject: "Physics", topic: "Finding unknowns in physics formulas", description: "F=ma → solving for m or a; v=u+at → solving for t. All are simple equations.", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Balance scale model: objects on both sides; maintain balance", duration: "10 minutes", pedagogyNote: "Physical or drawn scale — intuitive model for equation" },
    { step: 2, action: "Translate 10 word statements to equations; solve by balancing", duration: "20 minutes", pedagogyNote: "Pair activity: one writes equation, other solves" },
    { step: 3, action: "Transposition shortcut: derive from balancing", duration: "15 minutes", pedagogyNote: "Show they give the same answer — transposition is just faster" },
    { step: 4, action: "Word problems: consecutive numbers, age problems, sharing problems", duration: "25 minutes", pedagogyNote: "Equation → solve → interpret. Always check: does the answer make sense?" },
  ],
});

export const COMPARING_QUANTITIES = ch("ch08", "Comparing Quantities", {
  learningObjectives: [
    { statement: "Calculate percentage from fractions and decimals; convert between them", bloomsLevel: "apply", assessable: true },
    { statement: "Compute profit and loss percentage from given data", bloomsLevel: "apply", assessable: true },
    { statement: "Calculate simple interest for given principal, rate, and time", bloomsLevel: "apply", assessable: true },
    { statement: "Solve word problems involving percentage, profit/loss, and simple interest", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-COMP", application: "Calculate: if a shirt is sold at 20% discount, what is the selling price? Use actual shop prices from a newspaper advertisement." },
    { ruleCode: "NEP-ETH", application: "Examine: why do banks charge higher interest rates on credit cards (36%/year) than savings accounts (4%/year)? Is this fair?" },
    { ruleCode: "NEP-HOT", application: "Evaluate: if a price increases by 20% and then decreases by 20%, is the final price the same as the original? Prove algebraically." },
  ],
  cbseOutcomes: ["Student converts between fractions, decimals, and percentages", "Student computes profit/loss and profit/loss percentage", "Student calculates simple interest using SI = (P×R×T)/100"],
  icseOutcomes: [],
  coreConcepts: ["Percentage is a ratio with denominator 100; x% = x/100", "Profit = SP − CP (when SP > CP); Loss = CP − SP (when CP > SP)", "Profit%=(Profit/CP)×100; Loss%=(Loss/CP)×100 — always on Cost Price", "Simple Interest = (Principal × Rate × Time)/100; Amount = P + SI"],
  subtopics: [
    { id: "t1", name: "Percentage", coreConcept: "Per cent means 'per hundred'; percentage is a standardised way to compare parts of different wholes", keyIdea: "Convert to percentage: multiply fraction by 100. Convert from percentage: divide by 100.", estimatedPeriods: 2 },
    { id: "t2", name: "Profit and Loss", coreConcept: "Profit when selling price > cost price; loss when selling price < cost price", keyIdea: "Profit/loss percentage is ALWAYS calculated on Cost Price — never on Selling Price", estimatedPeriods: 3 },
    { id: "t3", name: "Simple Interest", coreConcept: "Interest earned = (P × R × T)/100; rate R is per cent per annum; T is in years", keyIdea: "Simple interest: same interest every year (unlike compound, which is not covered at this level)", estimatedPeriods: 2 },
  ],
  conceptGraph: [
    { from: "mth:6:ch12:proportion-definition", to: "mth:7:ch08:percentage-fraction-conversion", relationship: "applies", explanation: "Percentage is a proportion with second term 100 — equivalent ratio with 100 as denominator" },
    { from: "mth:7:ch08:profit-loss-definition", to: "mth:8:ch07:percentage-increase", relationship: "applies", explanation: "Profit and loss percentage are specific applications of percentage increase/decrease" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch12", chapterName: "Ratio and Proportion", requiredConcepts: ["mth:6:ch12:proportion-definition"] }], concepts: ["mth:6:ch12:ratio-in-simplest-form"] },
  essentialDefinitions: [
    { term: "Percentage", formalDefinition: "A rate, number, or amount expressed as parts per hundred; x% means x parts in every 100 parts", informalExplanation: "A fraction with 100 in the denominator — a universal way to compare proportions" },
    { term: "Cost Price (CP)", formalDefinition: "The price at which a goods is purchased", informalExplanation: "What you paid to buy something — your cost" },
    { term: "Selling Price (SP)", formalDefinition: "The price at which goods are sold", informalExplanation: "What you charge a customer — your selling price" },
    { term: "Simple Interest", formalDefinition: "Interest calculated as a fixed percentage of the original principal for each period; SI = PRT/100", informalExplanation: "The same amount of interest is earned/paid each year, regardless of accumulated interest" },
  ],
  formulaInventory: [
    { name: "Simple Interest", latex: "SI = \\frac{P \\times R \\times T}{100}", plainText: "SI = (P × R × T) / 100", variables: [{ symbol: "P", meaning: "Principal (original amount)" }, { symbol: "R", meaning: "Rate of interest per annum (%)" }, { symbol: "T", meaning: "Time (in years)" }], applicableWhen: "Simple (not compound) interest; T must be in years", doesNotApplyWhen: "When interest is compounded; convert T to years if given in months (months/12)", examTip: "Amount A = P + SI. Common error: forgetting to add P to get the total amount" },
    { name: "Profit/Loss Percentage", latex: "\\text{Profit\\%} = \\frac{\\text{Profit}}{CP} \\times 100", plainText: "Profit% = (Profit/CP) × 100", variables: [{ symbol: "Profit", meaning: "SP − CP" }, { symbol: "CP", meaning: "Cost Price" }], applicableWhen: "Always calculate percentage on Cost Price", doesNotApplyWhen: "Never divide by SP for profit/loss percentage — only CP is the base", examTip: "CP is ALWAYS the denominator for profit/loss percentage" },
  ],
  lawsAndTheorems: [],
  commonMisconceptions: [
    { misconception: "Profit% = (Profit/SP) × 100", correction: "Profit% = (Profit/CP) × 100. The base is always COST PRICE. SP is what you got; CP is what you invested.", whyItHappens: "SP is the recent number; students compute profit as a percentage of SP", revealingQuestion: "A toy bought for ₹80 is sold for ₹100. What is the profit percentage?" },
    { misconception: "20% increase followed by 20% decrease = no change (back to original)", correction: "100 → +20% → 120 → −20% → 96. Net loss of 4%. The percentages apply to different bases.", whyItHappens: "Students add and subtract percentages as if they apply to the same base", revealingQuestion: "A price increases by 10% then decreases by 10%. What is the net change?" },
  ],
  examinerTraps: [{ trap: "Using months as T without converting to years", typicalScenario: "Loan for 6 months at 8% per annum: student uses T=6 instead of T=6/12=0.5", avoidanceStrategy: "SI formula requires T in YEARS. 6 months = 6/12 = 0.5 years. Always convert.", marksAtRisk: "Full numerical marks" }],
  typicalMistakes: [{ mistake: "Amount = SI (forgetting to add principal)", correction: "Amount = P + SI. SI is just the interest earned — the total repayment is Amount = Principal + Interest.", conceptualError: "Confusing SI (interest only) with Amount (principal + interest)" }],
  bloomsMap: [{ subtopicId: "t2", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A shopkeeper marks a price 25% above cost price, then gives a 10% discount. What is the actual profit percentage?"] }],
  difficultyProgression: [
    { step: 1, concept: "Percentage: conversion from/to fractions and decimals", tier: "easy", teachingNote: "Fraction × 100 = percentage. Percentage/100 = fraction. Decimal × 100 = percentage." },
    { step: 2, concept: "Percentage of a quantity; finding what percentage one is of another", tier: "medium", dependsOnStep: 1, teachingNote: "40 out of 80 is what percent? → (40/80)×100 = 50%" },
    { step: 3, concept: "Profit and loss: definitions, formulas, on CP always", tier: "medium", dependsOnStep: 2, teachingNote: "Concrete: buy for ₹80, sell for ₹100 → profit ₹20 → profit% = 25%" },
    { step: 4, concept: "Discount and marked price", tier: "medium", dependsOnStep: 3, teachingNote: "Discount is on Marked Price; SP = MP − Discount" },
    { step: 5, concept: "Simple interest: formula and application", tier: "medium", dependsOnStep: 2, teachingNote: "Three variables: P, R, T — given any two, find the third" },
  ],
  realLifeApplications: [
    { context: "Sale discounts in a shopping mall", conceptUsed: "Percentage and discount", explanation: "30% off ₹1500 dress: discount = ₹450; you pay ₹1050. Daily shopping application.", ageRelevance: "Students accompany parents to shops; see sale signs constantly" },
    { context: "Bank savings account interest", conceptUsed: "Simple interest", explanation: "₹10,000 at 6% per annum for 2 years: SI = 10000×6×2/100 = ₹1,200. Total = ₹11,200.", ageRelevance: "Financial literacy — understanding savings and interest" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 8, chapterId: "ch07", chapterName: "Comparing Quantities", linkType: "prerequisite-for", description: "Class 8 extends to compound interest and discount/tax problems" },
  ],
  crossSubjectLinks: [{ subject: "Economics", topic: "Profit, loss, and interest in economic context", description: "Business profits and bank interest are the same mathematical concepts at a larger economic scale", strength: "strong" }],
  teachingSequence: [
    { step: 1, action: "Percentage conversion drill: 10 fractions to percentage and back", duration: "10 minutes", pedagogyNote: "Speed practice — builds automaticity" },
    { step: 2, action: "Profit/loss: shopkeeper scenario with real items and prices", duration: "20 minutes", pedagogyNote: "Role play: student is shopkeeper; class buys at cost; sells at marked price" },
    { step: 3, action: "Simple interest: bank account simulation over 3 years", duration: "20 minutes", pedagogyNote: "Build a table: year, opening balance, interest earned, closing balance" },
    { step: 4, action: "Word problems mixing all three topics", duration: "25 minutes", pedagogyNote: "Identify: percentage, profit/loss, or SI? Then apply correct formula." },
  ],
});

export const TRIANGLE_PROPERTIES = ch("ch06", "The Triangle and Its Properties", {
  learningObjectives: [
    { statement: "Identify and draw medians and altitudes of a triangle", bloomsLevel: "apply", assessable: true },
    { statement: "Apply the exterior angle property: exterior angle = sum of two non-adjacent interior angles", bloomsLevel: "apply", assessable: true },
    { statement: "Apply the angle sum property: sum of angles in a triangle = 180°", bloomsLevel: "apply", assessable: true },
    { statement: "Apply the Pythagoras theorem to find sides of right triangles", bloomsLevel: "apply", assessable: true },
    { statement: "Verify the Pythagorean triplet property for given sets of numbers", bloomsLevel: "apply", assessable: true },
  ],
  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Measure all angles of several triangles with a protractor; verify that they sum to 180°" },
    { ruleCode: "NEP-HOT", application: "Prove the angle sum property of a triangle by drawing a line through one vertex parallel to the opposite side" },
  ],
  cbseOutcomes: ["Student draws and identifies medians and altitudes", "Student applies angle sum property and exterior angle theorem", "Student applies Pythagoras theorem and identifies Pythagorean triplets"],
  icseOutcomes: ["ICSE additionally expects formal proof of the exterior angle theorem"],
  coreConcepts: ["A triangle has 3 medians (vertex to midpoint of opposite side); they meet at the centroid", "A triangle has 3 altitudes (vertex to perpendicular foot on opposite side); they meet at the orthocentre", "Angle sum of any triangle = 180° (proved using parallel lines)", "Exterior angle = sum of two remote interior angles", "Pythagoras: in a right triangle, hypotenuse² = sum of squares of other two sides"],
  subtopics: [
    { id: "t1", name: "Medians and Altitudes", coreConcept: "Six special lines in a triangle: 3 medians, 3 altitudes; each has a specific geometric meaning", keyIdea: "Median bisects the opposite side; altitude is perpendicular to the opposite side", estimatedPeriods: 2 },
    { id: "t2", name: "Exterior Angle Property", coreConcept: "An exterior angle of a triangle = sum of two interior opposite angles", keyIdea: "Exterior angle is always greater than each of the two non-adjacent interior angles", estimatedPeriods: 2 },
    { id: "t3", name: "Angle Sum Property", coreConcept: "All three interior angles of a triangle sum to 180°", keyIdea: "Proof: draw line through vertex parallel to opposite side; alternating angles create the 180° sum", estimatedPeriods: 2 },
    { id: "t4", name: "Pythagoras Theorem", coreConcept: "In a right triangle: hypotenuse² = leg₁² + leg₂²; converse is also true", keyIdea: "Pythagorean triplets: (3,4,5), (5,12,13), (8,15,17) — multiples also work", estimatedPeriods: 3 },
  ],
  conceptGraph: [
    { from: "mth:7:ch06:angle-sum-triangle", to: "mth:9:ch06:angle-sum-triangle", relationship: "applies", explanation: "Class 9 proves this formally; Class 7 verifies and applies it" },
    { from: "mth:7:ch06:pythagoras-theorem", to: "mth:9:ch01:number-line-geometric-construction", relationship: "applies", explanation: "√2 is placed on number line using a right triangle with legs 1 and 1 — Pythagoras applied" },
  ],
  prerequisites: { chapters: [{ subject: "Mathematics", classNum: 6, chapterId: "ch04", chapterName: "Basic Geometrical Ideas", requiredConcepts: ["mth:6:ch04:angle-types"] }], concepts: ["mth:6:ch04:angle-types"] },
  essentialDefinitions: [
    { term: "Median", formalDefinition: "A line segment from a vertex of a triangle to the midpoint of the opposite side", informalExplanation: "Connects a corner to the middle of the opposite side — cuts that side exactly in half" },
    { term: "Altitude", formalDefinition: "A perpendicular line segment from a vertex to the line containing the opposite side", informalExplanation: "The height of the triangle — measured perpendicularly from a vertex to the opposite side" },
    { term: "Hypotenuse", formalDefinition: "The side opposite the right angle in a right triangle; always the longest side", informalExplanation: "The slanted side of a right triangle; the side that does NOT form the right angle" },
    { term: "Pythagorean Triplet", formalDefinition: "A set of three positive integers (a, b, c) that satisfy a² + b² = c²", informalExplanation: "Three whole numbers that can be sides of a right triangle: (3,4,5), (5,12,13), (8,15,17)" },
  ],
  formulaInventory: [
    { name: "Pythagoras Theorem", latex: "c^2 = a^2 + b^2", plainText: "hypotenuse² = leg₁² + leg₂²", variables: [{ symbol: "c", meaning: "hypotenuse (side opposite right angle)" }, { symbol: "a, b", meaning: "legs (other two sides)" }], applicableWhen: "In a RIGHT-ANGLED triangle only", doesNotApplyWhen: "Non-right triangles — use other triangle properties", examTip: "Always identify the hypotenuse first: it is opposite the 90° angle, and it is the longest side" },
  ],
  lawsAndTheorems: [
    { name: "Angle Sum Property of Triangle", type: "theorem", statement: "The sum of all interior angles of a triangle = 180°", boardRelevance: "Applied in every geometry problem; proof asked at Class 9 level" },
    { name: "Exterior Angle Theorem", type: "theorem", statement: "An exterior angle of a triangle is equal to the sum of the two non-adjacent interior angles", boardRelevance: "2-mark application questions; 3-mark proof at Class 9 level" },
    { name: "Pythagoras Theorem", type: "theorem", statement: "In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides", discoveredBy: "Pythagoras of Samos; known independently in India (Baudhayana Sulba Sutra, ~800 BCE)", boardRelevance: "Most important geometry theorem across Classes 7–10; 3-5 mark applications" },
  ],
  commonMisconceptions: [
    { misconception: "The hypotenuse can be any side of a right triangle", correction: "The hypotenuse is specifically the side OPPOSITE the right angle. It is always the longest side.", whyItHappens: "Students forget the 'opposite the right angle' criterion", revealingQuestion: "Draw a right triangle. Mark the right angle. Which side is the hypotenuse?" },
    { misconception: "Pythagoras theorem: c² = a² − b² for some right triangles", correction: "Always c² = a² + b² where c is the HYPOTENUSE. Both a² and b² are ADDED, never subtracted.", whyItHappens: "Students try to find a shorter side and get confused about which formula to use", revealingQuestion: "In a right triangle with hypotenuse 13 and one leg 5, find the other leg. What formula do you use?" },
  ],
  examinerTraps: [{ trap: "Identifying the hypotenuse incorrectly in a tilted right triangle", typicalScenario: "Right triangle drawn at an angle — student identifies the longest-looking side in the drawing as hypotenuse but it's actually a leg", avoidanceStrategy: "Always find the right angle first (look for the little square). The hypotenuse is the side directly across from the right angle, not the longest-looking line in the diagram.", marksAtRisk: "Full Pythagoras calculation gives wrong answer" }],
  typicalMistakes: [{ mistake: "Checking if (6, 8, 11) is a Pythagorean triplet: 6+8=14≠11 (adding, not squaring)", correction: "Check: 6²+8²=36+64=100=10². But 11²=121≠100. So (6,8,10) IS a triplet; (6,8,11) is NOT.", conceptualError: "Adding sides instead of squaring them to check the triplet" }],
  bloomsMap: [{ subtopicId: "t4", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A ladder 13m long leans against a wall. Its base is 5m from the wall. How high does it reach?", "Prove that (7, 24, 25) is a Pythagorean triplet."] }],
  difficultyProgression: [
    { step: 1, concept: "Medians and altitudes: draw and identify", tier: "foundational", teachingNote: "Ruler and compass construction — physical drawing before formal definition" },
    { step: 2, concept: "Angle sum property: measure → verify → state", tier: "easy", dependsOnStep: 1, teachingNote: "Tear off triangle corners and arrange on a line — forms 180°" },
    { step: 3, concept: "Exterior angle theorem: discover then apply", tier: "medium", dependsOnStep: 2, teachingNote: "Measure exterior and two non-adjacent interior — observe equality" },
    { step: 4, concept: "Pythagoras theorem: state, verify for (3,4,5), apply", tier: "medium", dependsOnStep: 1, teachingNote: "Draw squares on each side; count squares — visual proof" },
    { step: 5, concept: "Finding missing side using Pythagoras", tier: "medium", dependsOnStep: 4, teachingNote: "Square both known sides, add/subtract, take square root" },
    { step: 6, concept: "Pythagorean triplets: verify and generate", tier: "hard", dependsOnStep: 5, teachingNote: "Generate from (3,4,5): double it → (6,8,10). Verify any multiple works." },
  ],
  realLifeApplications: [
    { context: "Diagonal of a room/screen: finding if it fits through a doorway", conceptUsed: "Pythagoras theorem", explanation: "A 3m × 4m room has diagonal = √(9+16) = 5m. A piece of furniture 5.5m long cannot be moved diagonally.", ageRelevance: "Furniture and screen sizes — students' families deal with this" },
    { context: "Setting out a right angle in construction", conceptUsed: "Pythagorean triplet (3,4,5)", explanation: "Builders create perfect right angles by measuring 3,4,5 units along the two sides — if the diagonal is exactly 5 units, the angle is 90°", ageRelevance: "Construction is visible everywhere; this is how foundations are set" },
  ],
  crossChapterLinks: [
    { subject: "Mathematics", classNum: 9, chapterId: "ch07", chapterName: "Triangles", linkType: "prerequisite-for", description: "Congruence theorems in Class 9 use angle sum property and Pythagoras (RHS criterion)" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch01", chapterName: "Number Systems", linkType: "applies-here", description: "√2 placed on number line using a right isosceles triangle with legs 1 — Pythagoras used directly" },
  ],
  crossSubjectLinks: [
    { subject: "Physics", topic: "Resolution of vectors: Pythagoras for resultant", description: "Resultant of two perpendicular forces = √(F₁² + F₂²) — Pythagoras theorem applied in Physics", strength: "strong" },
  ],
  teachingSequence: [
    { step: 1, action: "Draw medians and altitudes of several triangles; observe they meet at different points", duration: "15 minutes", pedagogyNote: "Ruler and compass; discover centroid and orthocentre" },
    { step: 2, action: "Angle sum: tear triangle corners; arrange on line → 180°", duration: "10 minutes", pedagogyNote: "Physical experiment before formal statement" },
    { step: 3, action: "Exterior angle: measure and verify the theorem for 5 triangles", duration: "15 minutes", pedagogyNote: "Discovery by measurement; state the pattern found" },
    { step: 4, action: "Pythagoras: squares on sides of (3,4,5) triangle — count squares", duration: "20 minutes", pedagogyNote: "Visual proof on graph paper; then generalise to the formula" },
    { step: 5, action: "Application problems: ladder, diagonal, height of building", duration: "25 minutes", pedagogyNote: "Identify right angle, label sides, apply formula" },
  ],
});

export const MATHEMATICS_CLASS7: ChapterKnowledge[] = [
  INTEGERS_CLASS7,
  FRACTIONS_AND_DECIMALS,
  SIMPLE_EQUATIONS,
  TRIANGLE_PROPERTIES,
  COMPARING_QUANTITIES,
];
