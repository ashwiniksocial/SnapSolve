/**
 * Question Bank — Chapter Registry
 *
 * Developer-only. Never imported by any runtime service.
 *
 * The canonical list of every chapter across all subjects, classes, and boards.
 * Every question file must reference a chapter registered here.
 *
 * ── Coverage ─────────────────────────────────────────────────────────────────
 * Mathematics:    Class 6 (14 ch), Class 7 (15 ch), Class 8 (15 ch), Class 9 (13 ch)
 * Physics:        Class 6–8 (Science chapters), Class 9 (5 ch)
 * Chemistry:      Class 6–8 (Science chapters), Class 9 (4 ch)
 * Biology:        Class 6–8 (Science chapters), Class 9 (6 ch)
 * Computer Sci:   Class 6 (5 ch), Class 7 (5 ch), Class 8 (5 ch), Class 9 (5 ch)
 * Economics:      Class 9 (4 ch)
 *
 * ── Board notes ──────────────────────────────────────────────────────────────
 * Most chapters are tagged "Both" — the concept is common to CBSE and ICSE.
 * Where ICSE has a significantly different chapter scope, the chapter is tagged
 * "ICSE" or "CBSE" and a boardSpecificNotes field explains the difference.
 * ICSE Mathematics for Classes 6–8 follows Selina Concise / Frank texts which
 * cover some additional topics (sets, profit & loss detail, interest) not in NCERT.
 * These are included as additional chapters at the end of each class section.
 */

import type { ChapterRecord } from "./types";

// ─── MATHEMATICS ───────────────────────────────────────────────────────────────

const MATHEMATICS_CHAPTERS: ChapterRecord[] = [

  // ── Class 6 ─────────────────────────────────────────────────────────────────
  {
    chapterId: "ch01", name: "Knowing Our Numbers",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 1,
    category: "standard",
    topics: [
      { id: "t1", name: "Comparing and Ordering Numbers",     minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch01:place-value", "mth:6:ch01:comparing-large-numbers"] },
      { id: "t2", name: "Large Numbers in Practice",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch01:indian-number-system", "mth:6:ch01:international-number-system"] },
      { id: "t3", name: "Estimation and Rounding",            minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch01:rounding", "mth:6:ch01:estimation-in-context"] },
      { id: "t4", name: "Roman Numerals",                     minQuestions: 3, targetQuestions: 5,  conceptNodes: ["mth:6:ch01:roman-numeral-rules"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  {
    chapterId: "ch02", name: "Whole Numbers",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 2,
    category: "standard",
    topics: [
      { id: "t1", name: "The Number Line",                    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch02:number-line", "mth:6:ch02:predecessor-successor"] },
      { id: "t2", name: "Properties of Whole Numbers",        minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch02:closure", "mth:6:ch02:commutativity", "mth:6:ch02:associativity", "mth:6:ch02:distributivity"] },
      { id: "t3", name: "Patterns in Whole Numbers",          minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch02:arithmetic-patterns"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch03", name: "Playing with Numbers",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 3,
    category: "major",
    topics: [
      { id: "t1", name: "Factors and Multiples",              minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch03:factor-definition", "mth:6:ch03:multiple-definition"] },
      { id: "t2", name: "Prime and Composite Numbers",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch03:prime-definition", "mth:6:ch03:sieve-of-eratosthenes"] },
      { id: "t3", name: "Tests of Divisibility",              minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch03:divisibility-2", "mth:6:ch03:divisibility-3", "mth:6:ch03:divisibility-9", "mth:6:ch03:divisibility-11"] },
      { id: "t4", name: "HCF and LCM",                        minQuestions: 8, targetQuestions: 12, conceptNodes: ["mth:6:ch03:hcf-prime-factorisation", "mth:6:ch03:lcm-prime-factorisation", "mth:6:ch03:hcf-lcm-relationship"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch04", name: "Basic Geometrical Ideas",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 4,
    category: "standard",
    topics: [
      { id: "t1", name: "Points, Lines, Line Segments, and Rays", minQuestions: 4, targetQuestions: 6, conceptNodes: ["mth:6:ch04:point-line-distinction", "mth:6:ch04:ray-definition"] },
      { id: "t2", name: "Curves, Polygons, and Angles",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch04:angle-types", "mth:6:ch04:polygon-classification"] },
      { id: "t3", name: "Triangles and Quadrilaterals",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch04:triangle-types", "mth:6:ch04:quadrilateral-types"] },
      { id: "t4", name: "Circles",                             minQuestions: 4, targetQuestions: 6,  conceptNodes: ["mth:6:ch04:circle-parts", "mth:6:ch04:radius-diameter-relationship"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  {
    chapterId: "ch05", name: "Understanding Elementary Shapes",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 5,
    category: "standard",
    topics: [
      { id: "t1", name: "Measuring Line Segments",            minQuestions: 4, targetQuestions: 6,  conceptNodes: ["mth:6:ch05:measurement-of-segments"] },
      { id: "t2", name: "Angles and Their Measurement",       minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch05:protractor-use", "mth:6:ch05:angle-types-degrees"] },
      { id: "t3", name: "3D Shapes",                          minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch05:3d-shape-properties", "mth:6:ch05:faces-edges-vertices"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  {
    chapterId: "ch06", name: "Integers",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 6,
    category: "standard",
    topics: [
      { id: "t1", name: "Introduction to Integers",           minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch06:negative-number-motivation", "mth:6:ch06:integer-on-number-line"] },
      { id: "t2", name: "Addition and Subtraction of Integers", minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch06:integer-addition-rules", "mth:6:ch06:integer-subtraction"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch07", name: "Fractions",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 7,
    category: "major",
    topics: [
      { id: "t1", name: "Types of Fractions",                 minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch07:proper-improper-mixed"] },
      { id: "t2", name: "Equivalent Fractions and Simplification", minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch07:equivalent-fractions", "mth:6:ch07:simplest-form"] },
      { id: "t3", name: "Comparing Fractions",                minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch07:comparing-like-unlike-fractions"] },
      { id: "t4", name: "Addition and Subtraction of Fractions", minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch07:fraction-addition", "mth:6:ch07:fraction-subtraction-unlike"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch08", name: "Decimals",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 8,
    category: "standard",
    topics: [
      { id: "t1", name: "Decimals and Place Value",           minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch08:decimal-place-value"] },
      { id: "t2", name: "Comparing Decimals",                 minQuestions: 4, targetQuestions: 6,  conceptNodes: ["mth:6:ch08:comparing-decimals"] },
      { id: "t3", name: "Addition and Subtraction of Decimals", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:6:ch08:decimal-addition-subtraction"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  {
    chapterId: "ch09", name: "Data Handling",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 9,
    category: "minor",
    topics: [
      { id: "t1", name: "Collecting and Organising Data",     minQuestions: 4, targetQuestions: 6,  conceptNodes: ["mth:6:ch09:tally-marks", "mth:6:ch09:frequency-table"] },
      { id: "t2", name: "Pictographs and Bar Graphs",         minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch09:pictograph-reading", "mth:6:ch09:bar-graph-construction"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "case-study", "previous-year"],
  },
  {
    chapterId: "ch10", name: "Mensuration",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 10,
    category: "standard",
    topics: [
      { id: "t1", name: "Perimeter of Rectilinear Figures",   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch10:perimeter-rectangle", "mth:6:ch10:perimeter-irregular"] },
      { id: "t2", name: "Area of Rectangle and Square",       minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch10:area-rectangle", "mth:6:ch10:area-by-counting-squares"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch11", name: "Algebra",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 11,
    category: "major",
    topics: [
      { id: "t1", name: "Introduction to Variables",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch11:variable-definition", "mth:6:ch11:expression-vs-equation"] },
      { id: "t2", name: "Expressions and Equations",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:6:ch11:algebraic-expression", "mth:6:ch11:equation-solution"] },
      { id: "t3", name: "Using Algebra in Geometry",          minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch11:formula-for-area-perimeter"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch12", name: "Ratio and Proportion",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 12,
    category: "standard",
    topics: [
      { id: "t1", name: "Ratio",                              minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch12:ratio-definition", "mth:6:ch12:ratio-in-simplest-form"] },
      { id: "t2", name: "Proportion",                         minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:6:ch12:proportion-definition", "mth:6:ch12:unitary-method"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch13", name: "Symmetry",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 13,
    category: "minor",
    topics: [
      { id: "t1", name: "Lines of Symmetry",                  minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:6:ch13:line-of-symmetry", "mth:6:ch13:symmetry-in-figures"] },
      { id: "t2", name: "Rotational Symmetry",                minQuestions: 3, targetQuestions: 5,  conceptNodes: ["mth:6:ch13:rotational-symmetry-order"] },
    ],
    applicableTypes: ["concept", "ncert", "previous-year"],
  },
  {
    chapterId: "ch14", name: "Practical Geometry",
    classNum: 6, subject: "Mathematics", board: "Both", chapterNumber: 14,
    category: "brief",
    topics: [
      { id: "t1", name: "Constructions with Ruler and Compass", minQuestions: 4, targetQuestions: 6, conceptNodes: ["mth:6:ch14:perpendicular-bisector", "mth:6:ch14:angle-bisector"] },
    ],
    applicableTypes: ["concept", "ncert", "previous-year"],
  },

  // ── Class 7 ─────────────────────────────────────────────────────────────────
  {
    chapterId: "ch01", name: "Integers",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 1,
    category: "major",
    topics: [
      { id: "t1", name: "Multiplication and Division of Integers", minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch01:integer-multiplication-sign-rules", "mth:7:ch01:integer-division"] },
      { id: "t2", name: "Properties of Integers",            minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch01:closure-integers", "mth:7:ch01:distributivity-integers"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch02", name: "Fractions and Decimals",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 2,
    category: "major",
    topics: [
      { id: "t1", name: "Multiplication of Fractions",       minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch02:fraction-multiplication", "mth:7:ch02:of-as-multiplication"] },
      { id: "t2", name: "Division of Fractions",             minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch02:reciprocal", "mth:7:ch02:division-as-multiply-reciprocal"] },
      { id: "t3", name: "Multiplication and Division of Decimals", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:7:ch02:decimal-multiplication", "mth:7:ch02:decimal-division"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch04", name: "Simple Equations",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 4,
    category: "major",
    topics: [
      { id: "t1", name: "Setting Up an Equation",            minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch04:variable-vs-constant", "mth:7:ch04:equation-from-statement"] },
      { id: "t2", name: "Solving Simple Equations",          minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:7:ch04:balance-method", "mth:7:ch04:transposition", "mth:7:ch04:verification"] },
      { id: "t3", name: "Word Problems Using Equations",     minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch04:word-problem-to-equation"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch06", name: "The Triangle and Its Properties",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 6,
    category: "major",
    topics: [
      { id: "t1", name: "Medians and Altitudes",             minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:7:ch06:median-definition", "mth:7:ch06:altitude-definition"] },
      { id: "t2", name: "Exterior Angle Property",           minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch06:exterior-angle-theorem"] },
      { id: "t3", name: "Angle Sum Property",                minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch06:angle-sum-triangle"] },
      { id: "t4", name: "Pythagoras Theorem",                minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch06:pythagoras-theorem", "mth:7:ch06:pythagorean-triplets"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch08", name: "Comparing Quantities",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 8,
    category: "major",
    topics: [
      { id: "t1", name: "Percentage",                        minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch08:percentage-fraction-conversion", "mth:7:ch08:percentage-application"] },
      { id: "t2", name: "Profit and Loss",                   minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch08:profit-loss-definition", "mth:7:ch08:profit-percent", "mth:7:ch08:selling-price-formula"] },
      { id: "t3", name: "Simple Interest",                   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch08:simple-interest-formula", "mth:7:ch08:principal-rate-time"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "case-study", "previous-year"],
  },
  {
    chapterId: "ch09", name: "Rational Numbers",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 9,
    category: "standard",
    topics: [
      { id: "t1", name: "What Are Rational Numbers?",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:7:ch09:rational-number-definition", "mth:7:ch09:negative-rational"] },
      { id: "t2", name: "Rational Numbers on Number Line",   minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:7:ch09:rational-on-number-line"] },
      { id: "t3", name: "Operations on Rational Numbers",    minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch09:rational-addition", "mth:7:ch09:rational-multiplication"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch12", name: "Algebraic Expressions",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 12,
    category: "standard",
    topics: [
      { id: "t1", name: "Terms, Coefficients, and Like Terms", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:7:ch12:term-coefficient-factor", "mth:7:ch12:like-unlike-terms"] },
      { id: "t2", name: "Addition and Subtraction of Expressions", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:7:ch12:expression-addition", "mth:7:ch12:expression-subtraction"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "previous-year"],
  },
  {
    chapterId: "ch13", name: "Exponents and Powers",
    classNum: 7, subject: "Mathematics", board: "Both", chapterNumber: 13,
    category: "standard",
    topics: [
      { id: "t1", name: "Laws of Exponents",                 minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:7:ch13:product-rule", "mth:7:ch13:quotient-rule", "mth:7:ch13:power-rule", "mth:7:ch13:zero-exponent"] },
      { id: "t2", name: "Standard Form",                     minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:7:ch13:scientific-notation"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },

  // ── Class 8 ─────────────────────────────────────────────────────────────────
  {
    chapterId: "ch01", name: "Rational Numbers",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 1,
    category: "standard",
    topics: [
      { id: "t1", name: "Properties of Rational Numbers",    minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch01:rational-closure", "mth:8:ch01:rational-commutativity", "mth:8:ch01:rational-associativity", "mth:8:ch01:rational-distributivity"] },
      { id: "t2", name: "Rational Numbers on Number Line",   minQuestions: 4, targetQuestions: 7,  conceptNodes: ["mth:8:ch01:density-of-rationals"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  {
    chapterId: "ch02", name: "Linear Equations in One Variable",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 2,
    category: "major",
    topics: [
      { id: "t1", name: "Solving Linear Equations",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch02:balance-method", "mth:8:ch02:transposition", "mth:8:ch02:equations-with-fractions"] },
      { id: "t2", name: "Equations with Variable on Both Sides", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:8:ch02:variable-both-sides"] },
      { id: "t3", name: "Word Problems",                     minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch02:age-problems", "mth:8:ch02:number-problems", "mth:8:ch02:geometry-equations"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },
  {
    chapterId: "ch05", name: "Squares and Square Roots",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 5,
    category: "major",
    topics: [
      { id: "t1", name: "Properties of Perfect Squares",     minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch05:perfect-square-properties", "mth:8:ch05:square-patterns"] },
      { id: "t2", name: "Finding Square Roots",              minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch05:prime-factorisation-square-root", "mth:8:ch05:long-division-square-root"] },
      { id: "t3", name: "Estimating and Applying Square Roots", minQuestions: 5, targetQuestions: 8, conceptNodes: ["mth:8:ch05:square-root-estimation", "mth:8:ch05:pythagorean-application"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch07", name: "Comparing Quantities",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 7,
    category: "major",
    topics: [
      { id: "t1", name: "Percentage Increase and Decrease",  minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch07:percentage-increase", "mth:8:ch07:percentage-decrease"] },
      { id: "t2", name: "Discount, Tax, and Simple Interest", minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch07:discount", "mth:8:ch07:tax-calculation", "mth:8:ch07:simple-interest"] },
      { id: "t3", name: "Compound Interest",                 minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch07:compound-interest-formula", "mth:8:ch07:ci-vs-si-comparison", "mth:8:ch07:half-yearly-quarterly"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "case-study", "previous-year"],
  },
  {
    chapterId: "ch08", name: "Algebraic Expressions and Identities",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 8,
    category: "major",
    topics: [
      { id: "t1", name: "Multiplying Algebraic Expressions", minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch08:monomial-polynomial-multiplication"] },
      { id: "t2", name: "Standard Identities",               minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:8:ch08:identity-a-plus-b-sq", "mth:8:ch08:identity-a-minus-b-sq", "mth:8:ch08:identity-diff-of-sq", "mth:8:ch08:identity-a-plus-b-plus-c-sq"] },
      { id: "t3", name: "Applying Identities",               minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch08:identity-application-arithmetic"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch13", name: "Factorisation",
    classNum: 8, subject: "Mathematics", board: "Both", chapterNumber: 13,
    category: "major",
    topics: [
      { id: "t1", name: "Factorisation by Common Factor",    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch13:common-factor-method"] },
      { id: "t2", name: "Factorisation by Grouping",         minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch13:grouping-method"] },
      { id: "t3", name: "Factorisation Using Identities",    minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:8:ch13:factorisation-by-identity"] },
      { id: "t4", name: "Division of Polynomials",           minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:8:ch13:polynomial-division", "mth:8:ch13:error-finding-in-division"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "previous-year"],
  },

  // ── Class 9 ─────────────────────────────────────────────────────────────────
  {
    chapterId: "ch01", name: "Number Systems",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 1,
    category: "major",
    topics: [
      { id: "t1", name: "Real Numbers and Their Types",      minQuestions: 8, targetQuestions: 14, conceptNodes: ["mth:9:ch01:rational-definition", "mth:9:ch01:irrational-definition", "mth:9:ch01:real-number-hierarchy"] },
      { id: "t2", name: "Irrational Numbers",                minQuestions: 8, targetQuestions: 14, conceptNodes: ["mth:9:ch01:irrational-number-examples", "mth:9:ch01:proof-irrationality-sqrt2"] },
      { id: "t3", name: "Laws of Exponents",                 minQuestions: 8, targetQuestions: 12, conceptNodes: ["mth:9:ch01:fractional-exponents", "mth:9:ch01:exponent-laws"] },
      { id: "t4", name: "Real Numbers on Number Line",       minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:9:ch01:number-line-representation", "mth:9:ch01:successive-magnification"] },
      { id: "t5", name: "Operations on Real Numbers",        minQuestions: 8, targetQuestions: 14, conceptNodes: ["mth:9:ch01:rationalisation", "mth:9:ch01:surd-simplification"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch02", name: "Polynomials",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 2,
    category: "major",
    topics: [
      { id: "t1", name: "Polynomials and Their Degrees",     minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:9:ch02:polynomial-definition", "mth:9:ch02:degree-coefficient"] },
      { id: "t2", name: "Remainder and Factor Theorems",     minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:9:ch02:remainder-theorem", "mth:9:ch02:factor-theorem"] },
      { id: "t3", name: "Algebraic Identities",              minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:9:ch02:identity-cubes", "mth:9:ch02:identity-sum-of-cubes"] },
      { id: "t4", name: "Factorisation of Polynomials",      minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:9:ch02:factorisation-by-factor-theorem", "mth:9:ch02:factorisation-trinomials"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch07", name: "Triangles",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 7,
    category: "major",
    topics: [
      { id: "t1", name: "Congruence of Triangles",           minQuestions: 7, targetQuestions: 12, conceptNodes: ["mth:9:ch07:congruence-criteria-sas", "mth:9:ch07:congruence-criteria-asa", "mth:9:ch07:congruence-criteria-sss", "mth:9:ch07:congruence-criteria-rhs"] },
      { id: "t2", name: "Properties of Isosceles Triangles", minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch07:isosceles-angle-base-theorem"] },
      { id: "t3", name: "Inequalities in Triangles",         minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch07:side-angle-inequality"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  {
    chapterId: "ch09", name: "Circles",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 9,
    category: "major",
    topics: [
      { id: "t1", name: "Chords and Their Properties",       minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:9:ch09:perpendicular-from-centre", "mth:9:ch09:equal-chords"] },
      { id: "t2", name: "Angle Subtended by a Chord",        minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:9:ch09:angle-at-centre-vs-circumference", "mth:9:ch09:angles-same-segment"] },
      { id: "t3", name: "Cyclic Quadrilateral",              minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch09:cyclic-quadrilateral-opposite-angles"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year", "olympiad"],
  },
  {
    chapterId: "ch12", name: "Statistics",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 12,
    category: "standard",
    topics: [
      { id: "t1", name: "Frequency Distribution",            minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch12:frequency-table", "mth:9:ch12:class-interval"] },
      { id: "t2", name: "Graphical Representation",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch12:histogram", "mth:9:ch12:frequency-polygon", "mth:9:ch12:ogive"] },
      { id: "t3", name: "Measures of Central Tendency",      minQuestions: 6, targetQuestions: 10, conceptNodes: ["mth:9:ch12:mean-grouped", "mth:9:ch12:median-grouped", "mth:9:ch12:mode-grouped"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "case-study", "previous-year"],
  },
  {
    chapterId: "ch13", name: "Probability",
    classNum: 9, subject: "Mathematics", board: "Both", chapterNumber: 13,
    category: "standard",
    topics: [
      { id: "t1", name: "Experimental Probability",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch13:experimental-probability-definition", "mth:9:ch13:frequency-ratio"] },
      { id: "t2", name: "Theoretical Probability",           minQuestions: 5, targetQuestions: 8,  conceptNodes: ["mth:9:ch13:sample-space", "mth:9:ch13:event-probability"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "previous-year"],
  },
];

// ─── PHYSICS ───────────────────────────────────────────────────────────────────
// Classes 6–8: Physics topics from NCERT Science (mixed with Chemistry and Biology)
// Class 9: Standalone Physics chapters

const PHYSICS_CHAPTERS: ChapterRecord[] = [

  // ── Class 6 (from NCERT Science) ────────────────────────────────────────────
  { chapterId: "ch01", name: "Motion and Measurement of Distances", classNum: 6, subject: "Physics", board: "Both", chapterNumber: 1, category: "standard",
    topics: [
      { id: "t1", name: "Types of Motion",                   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:6:ch01:rectilinear-motion", "phy:6:ch01:circular-motion", "phy:6:ch01:periodic-motion"] },
      { id: "t2", name: "Standard Units of Measurement",     minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:6:ch01:si-units", "phy:6:ch01:length-measurement"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  { chapterId: "ch02", name: "Light, Shadows and Reflections", classNum: 6, subject: "Physics", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Sources of Light and Shadows",      minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:6:ch02:luminous-non-luminous", "phy:6:ch02:shadow-formation"] },
      { id: "t2", name: "Reflection",                        minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:6:ch02:reflection-laws", "phy:6:ch02:lateral-inversion"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch03", name: "Electricity and Circuits", classNum: 6, subject: "Physics", board: "Both", chapterNumber: 3, category: "standard",
    topics: [
      { id: "t1", name: "Electric Cell and Circuit",         minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:6:ch03:electric-cell", "phy:6:ch03:open-closed-circuit"] },
      { id: "t2", name: "Conductors and Insulators",         minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:6:ch03:conductor-insulator-distinction"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },

  // ── Class 7 (from NCERT Science) ────────────────────────────────────────────
  { chapterId: "ch01", name: "Heat", classNum: 7, subject: "Physics", board: "Both", chapterNumber: 1, category: "standard",
    topics: [
      { id: "t1", name: "Temperature and Its Measurement",   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:7:ch01:temperature-definition", "phy:7:ch01:clinical-thermometer"] },
      { id: "t2", name: "Conduction, Convection, Radiation", minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:7:ch01:conduction", "phy:7:ch01:convection", "phy:7:ch01:radiation", "phy:7:ch01:modes-comparison"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch02", name: "Motion and Time", classNum: 7, subject: "Physics", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Speed and Uniform Motion",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:7:ch02:speed-definition", "phy:7:ch02:uniform-motion", "phy:7:ch02:non-uniform-motion"] },
      { id: "t2", name: "Measuring Speed",                   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:7:ch02:speed-formula", "phy:7:ch02:distance-time-graph"] },
      { id: "t3", name: "Time and Its Measurement",          minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:7:ch02:si-unit-time", "phy:7:ch02:simple-pendulum"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "previous-year"],
  },
  { chapterId: "ch03", name: "Electric Current and Its Effects", classNum: 7, subject: "Physics", board: "Both", chapterNumber: 3, category: "standard",
    topics: [
      { id: "t1", name: "Heating Effect of Electric Current", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:7:ch03:heating-effect", "phy:7:ch03:electric-fuse"] },
      { id: "t2", name: "Magnetic Effect of Electric Current", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:7:ch03:electromagnet", "phy:7:ch03:magnetic-effect-applications"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch04", name: "Light", classNum: 7, subject: "Physics", board: "Both", chapterNumber: 4, category: "major",
    topics: [
      { id: "t1", name: "Reflection of Light",               minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:7:ch04:laws-of-reflection", "phy:7:ch04:image-in-plane-mirror"] },
      { id: "t2", name: "Lenses",                            minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:7:ch04:convex-lens-action", "phy:7:ch04:concave-lens-action"] },
      { id: "t3", name: "Dispersion and Spectrum",           minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:7:ch04:dispersion-of-white-light", "phy:7:ch04:rainbow-formation"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },

  // ── Class 8 (from NCERT Science) ────────────────────────────────────────────
  { chapterId: "ch01", name: "Force and Pressure", classNum: 8, subject: "Physics", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Force: Types and Effects",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:8:ch01:contact-non-contact-force", "phy:8:ch01:force-effects"] },
      { id: "t2", name: "Pressure",                          minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:8:ch01:pressure-formula", "phy:8:ch01:pressure-in-liquids", "phy:8:ch01:atmospheric-pressure"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "case-study", "previous-year"],
  },
  { chapterId: "ch02", name: "Friction", classNum: 8, subject: "Physics", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Types of Friction",                 minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:8:ch02:static-kinetic-rolling-friction", "phy:8:ch02:friction-factors"] },
      { id: "t2", name: "Friction: Friend or Foe",           minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:8:ch02:friction-applications", "phy:8:ch02:reducing-friction"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch03", name: "Sound", classNum: 8, subject: "Physics", board: "Both", chapterNumber: 3, category: "standard",
    topics: [
      { id: "t1", name: "Production and Propagation of Sound", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:8:ch03:vibration-produces-sound", "phy:8:ch03:medium-required"] },
      { id: "t2", name: "Characteristics of Sound",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:8:ch03:amplitude-loudness", "phy:8:ch03:frequency-pitch", "phy:8:ch03:speed-of-sound"] },
      { id: "t3", name: "Reflection of Sound and Echo",      minQuestions: 4, targetQuestions: 7,  conceptNodes: ["phy:8:ch03:echo-condition", "phy:8:ch03:reverberation"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },

  // ── Class 9 (standalone Physics) ────────────────────────────────────────────
  { chapterId: "ch01", name: "Motion", classNum: 9, subject: "Physics", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Describing Motion: Distance and Displacement", minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch01:distance-vs-displacement", "phy:9:ch01:scalar-vector"] },
      { id: "t2", name: "Velocity and Acceleration",         minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch01:speed-vs-velocity", "phy:9:ch01:acceleration-definition"] },
      { id: "t3", name: "Equations of Uniformly Accelerated Motion", minQuestions: 7, targetQuestions: 12, conceptNodes: ["phy:9:ch01:first-equation-motion", "phy:9:ch01:second-equation-motion", "phy:9:ch01:third-equation-motion"] },
      { id: "t4", name: "Graphical Analysis of Motion",      minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:9:ch01:distance-time-graph", "phy:9:ch01:velocity-time-graph", "phy:9:ch01:area-under-vt-graph"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "case-study", "previous-year", "olympiad"],
  },
  { chapterId: "ch02", name: "Force and Laws of Motion", classNum: 9, subject: "Physics", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Newton's First Law — Inertia",      minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch02:inertia-definition", "phy:9:ch02:first-law-statement", "phy:9:ch02:galileo-experiment"] },
      { id: "t2", name: "Newton's Second Law — F = ma",      minQuestions: 7, targetQuestions: 12, conceptNodes: ["phy:9:ch02:second-law-statement", "phy:9:ch02:momentum-definition", "phy:9:ch02:newton-derived"] },
      { id: "t3", name: "Newton's Third Law — Action-Reaction", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:9:ch02:action-reaction-pairs", "phy:9:ch02:third-law-applications"] },
      { id: "t4", name: "Conservation of Momentum",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch02:momentum-conservation-derivation", "phy:9:ch02:collision-problems"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "case-study", "previous-year", "olympiad"],
  },
  { chapterId: "ch03", name: "Gravitation", classNum: 9, subject: "Physics", board: "Both", chapterNumber: 3, category: "major",
    topics: [
      { id: "t1", name: "Universal Law of Gravitation",      minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch03:gravitational-force-formula", "phy:9:ch03:universal-gravitational-constant"] },
      { id: "t2", name: "Free Fall and Acceleration due to Gravity", minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch03:free-fall-definition", "phy:9:ch03:g-value", "phy:9:ch03:g-vs-G"] },
      { id: "t3", name: "Mass, Weight, and Thrust",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:9:ch03:mass-vs-weight", "phy:9:ch03:weight-formula", "phy:9:ch03:buoyancy"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch04", name: "Work and Energy", classNum: 9, subject: "Physics", board: "Both", chapterNumber: 4, category: "major",
    topics: [
      { id: "t1", name: "Work and Its Scientific Meaning",   minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch04:work-definition", "phy:9:ch04:work-formula", "phy:9:ch04:zero-work-conditions"] },
      { id: "t2", name: "Kinetic and Potential Energy",      minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch04:kinetic-energy-formula", "phy:9:ch04:gravitational-pe-formula", "phy:9:ch04:pe-ke-examples"] },
      { id: "t3", name: "Conservation of Energy and Power",  minQuestions: 6, targetQuestions: 10, conceptNodes: ["phy:9:ch04:energy-conservation-law", "phy:9:ch04:power-definition", "phy:9:ch04:power-formula"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "case-study", "previous-year", "olympiad"],
  },
  { chapterId: "ch05", name: "Sound", classNum: 9, subject: "Physics", board: "Both", chapterNumber: 5, category: "standard",
    topics: [
      { id: "t1", name: "Production and Propagation of Sound", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:9:ch05:longitudinal-wave", "phy:9:ch05:compression-rarefaction"] },
      { id: "t2", name: "Characteristics and Speed of Sound", minQuestions: 5, targetQuestions: 8, conceptNodes: ["phy:9:ch05:speed-of-sound-factors", "phy:9:ch05:frequency-wavelength-speed"] },
      { id: "t3", name: "Reflection and Applications",       minQuestions: 5, targetQuestions: 8,  conceptNodes: ["phy:9:ch05:echo-sonar", "phy:9:ch05:ultrasound-applications"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
];

// ─── CHEMISTRY ────────────────────────────────────────────────────────────────

const CHEMISTRY_CHAPTERS: ChapterRecord[] = [
  // ── Classes 6–8 (from NCERT Science) ────────────────────────────────────────
  { chapterId: "ch01", name: "Sorting Materials Into Groups", classNum: 6, subject: "Chemistry", board: "Both", chapterNumber: 1, category: "minor",
    topics: [
      { id: "t1", name: "Properties of Materials",           minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:6:ch01:material-properties", "chm:6:ch01:classification-criteria"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  { chapterId: "ch02", name: "Separation of Substances", classNum: 6, subject: "Chemistry", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Methods of Separation",             minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:6:ch02:handpicking-threshing", "chm:6:ch02:sieving", "chm:6:ch02:sedimentation-decantation", "chm:6:ch02:filtration", "chm:6:ch02:evaporation"] },
      { id: "t2", name: "Pure Substances vs Mixtures",       minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:6:ch02:mixture-definition", "chm:6:ch02:pure-substance"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  { chapterId: "ch01", name: "Acids, Bases and Salts", classNum: 7, subject: "Chemistry", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Acids: Properties and Examples",    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:7:ch01:acid-properties", "chm:7:ch01:acid-examples"] },
      { id: "t2", name: "Bases: Properties and Examples",    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:7:ch01:base-properties", "chm:7:ch01:base-examples"] },
      { id: "t3", name: "Neutralisation",                   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:7:ch01:neutralisation-definition", "chm:7:ch01:salt-formation"] },
      { id: "t4", name: "Indicators",                        minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:7:ch01:litmus", "chm:7:ch01:natural-indicators"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch02", name: "Physical and Chemical Changes", classNum: 7, subject: "Chemistry", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Physical Changes",                  minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:7:ch02:physical-change-definition", "chm:7:ch02:reversible-changes"] },
      { id: "t2", name: "Chemical Changes",                  minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:7:ch02:chemical-change-definition", "chm:7:ch02:indicators-of-chemical-change"] },
      { id: "t3", name: "Rusting and Crystallisation",       minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:7:ch02:rusting-conditions", "chm:7:ch02:crystallisation"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch01", name: "Combustion and Flame", classNum: 8, subject: "Chemistry", board: "Both", chapterNumber: 1, category: "standard",
    topics: [
      { id: "t1", name: "Combustion and Its Conditions",     minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:8:ch01:combustion-conditions", "chm:8:ch01:ignition-temperature"] },
      { id: "t2", name: "Types of Combustion",               minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:8:ch01:rapid-slow-spontaneous-combustion"] },
      { id: "t3", name: "Flame and Fuels",                   minQuestions: 4, targetQuestions: 7,  conceptNodes: ["chm:8:ch01:flame-zones", "chm:8:ch01:calorific-value"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },

  // ── Class 9 (standalone Chemistry) ──────────────────────────────────────────
  { chapterId: "ch01", name: "Matter in Our Surroundings", classNum: 9, subject: "Chemistry", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "States of Matter and Their Properties", minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch01:solid-liquid-gas-properties", "chm:9:ch01:interparticle-space"] },
      { id: "t2", name: "Interconversion of States",         minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch01:melting-boiling-evaporation", "chm:9:ch01:latent-heat", "chm:9:ch01:sublimation"] },
      { id: "t3", name: "Effect of Temperature and Pressure", minQuestions: 5, targetQuestions: 8, conceptNodes: ["chm:9:ch01:temperature-state-change", "chm:9:ch01:pressure-effect-on-gases"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch02", name: "Is Matter Around Us Pure?", classNum: 9, subject: "Chemistry", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Pure Substances and Mixtures",      minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:9:ch02:mixture-vs-compound", "chm:9:ch02:homogeneous-heterogeneous"] },
      { id: "t2", name: "Solutions and Concentration",       minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch02:solution-definition", "chm:9:ch02:concentration-formula", "chm:9:ch02:solubility"] },
      { id: "t3", name: "Separation Techniques",             minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch02:centrifugation", "chm:9:ch02:chromatography", "chm:9:ch02:distillation", "chm:9:ch02:fractional-distillation"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch03", name: "Atoms and Molecules", classNum: 9, subject: "Chemistry", board: "Both", chapterNumber: 3, category: "major",
    topics: [
      { id: "t1", name: "Laws of Chemical Combination",      minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:9:ch03:law-conservation-mass", "chm:9:ch03:law-constant-proportions"] },
      { id: "t2", name: "Dalton's Atomic Theory and Atoms", minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:9:ch03:dalton-theory", "chm:9:ch03:atomic-mass"] },
      { id: "t3", name: "Molecules and Chemical Formulae",  minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:9:ch03:molecule-definition", "chm:9:ch03:chemical-formula-writing", "chm:9:ch03:valency"] },
      { id: "t4", name: "Mole Concept",                     minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch03:mole-definition", "chm:9:ch03:avogadro-constant", "chm:9:ch03:molar-mass"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year", "olympiad"],
  },
  { chapterId: "ch04", name: "Structure of the Atom", classNum: 9, subject: "Chemistry", board: "Both", chapterNumber: 4, category: "major",
    topics: [
      { id: "t1", name: "Thomson and Rutherford Models",     minQuestions: 5, targetQuestions: 8,  conceptNodes: ["chm:9:ch04:thomson-model", "chm:9:ch04:rutherford-gold-foil", "chm:9:ch04:nuclear-model"] },
      { id: "t2", name: "Bohr Model and Electron Shells",   minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch04:bohr-model", "chm:9:ch04:electron-shell-capacity", "chm:9:ch04:electronic-configuration"] },
      { id: "t3", name: "Atomic Number, Mass Number, Isotopes", minQuestions: 6, targetQuestions: 10, conceptNodes: ["chm:9:ch04:atomic-number", "chm:9:ch04:mass-number", "chm:9:ch04:isotopes", "chm:9:ch04:isobars"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
];

// ─── BIOLOGY ──────────────────────────────────────────────────────────────────

const BIOLOGY_CHAPTERS: ChapterRecord[] = [
  // ── Classes 6–8 ─────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "Nutrition in Plants", classNum: 7, subject: "Biology", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Photosynthesis",                    minQuestions: 7, targetQuestions: 12, conceptNodes: ["bio:7:ch01:photosynthesis-equation", "bio:7:ch01:chlorophyll-role", "bio:7:ch01:stomata-function"] },
      { id: "t2", name: "Modes of Nutrition",                minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:7:ch01:autotroph-heterotroph", "bio:7:ch01:parasitic-nutrition", "bio:7:ch01:saprotrophic-nutrition"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "case-study", "previous-year"],
  },
  { chapterId: "ch02", name: "Nutrition in Animals", classNum: 7, subject: "Biology", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Digestion in Humans",               minQuestions: 6, targetQuestions: 10, conceptNodes: ["bio:7:ch02:digestive-system-parts", "bio:7:ch02:digestion-process-flow", "bio:7:ch02:enzyme-functions"] },
      { id: "t2", name: "Digestion in Other Animals",        minQuestions: 4, targetQuestions: 7,  conceptNodes: ["bio:7:ch02:amoeba-digestion", "bio:7:ch02:grass-eating-animals"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch01", name: "Cell: Structure and Function", classNum: 8, subject: "Biology", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Discovering the Cell",              minQuestions: 4, targetQuestions: 7,  conceptNodes: ["bio:8:ch01:cell-theory", "bio:8:ch01:hooke-discovery"] },
      { id: "t2", name: "Cell Structure",                    minQuestions: 7, targetQuestions: 12, conceptNodes: ["bio:8:ch01:cell-membrane", "bio:8:ch01:cell-wall", "bio:8:ch01:nucleus", "bio:8:ch01:cytoplasm", "bio:8:ch01:organelles"] },
      { id: "t3", name: "Plant vs Animal Cell",              minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:8:ch01:plant-animal-cell-difference", "bio:8:ch01:chloroplast", "bio:8:ch01:vacuole"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "previous-year"],
  },

  // ── Class 9 ─────────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "The Fundamental Unit of Life", classNum: 9, subject: "Biology", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Cell Theory and Cell Discovery",    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch01:cell-theory-postulates", "bio:9:ch01:prokaryote-eukaryote"] },
      { id: "t2", name: "Cell Membrane and Cell Wall",       minQuestions: 6, targetQuestions: 10, conceptNodes: ["bio:9:ch01:cell-membrane-structure", "bio:9:ch01:cell-wall-composition", "bio:9:ch01:osmosis-diffusion"] },
      { id: "t3", name: "Cell Organelles",                   minQuestions: 7, targetQuestions: 12, conceptNodes: ["bio:9:ch01:nucleus-function", "bio:9:ch01:mitochondria-function", "bio:9:ch01:er-golgi", "bio:9:ch01:ribosome-lysosome-plastid"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "case-study", "previous-year"],
  },
  { chapterId: "ch02", name: "Tissues", classNum: 9, subject: "Biology", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Plant Tissues",                     minQuestions: 6, targetQuestions: 10, conceptNodes: ["bio:9:ch02:meristematic-tissue", "bio:9:ch02:permanent-tissue-types", "bio:9:ch02:vascular-tissue"] },
      { id: "t2", name: "Animal Tissues",                    minQuestions: 7, targetQuestions: 12, conceptNodes: ["bio:9:ch02:epithelial-tissue", "bio:9:ch02:connective-tissue", "bio:9:ch02:muscular-tissue", "bio:9:ch02:nervous-tissue"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch03", name: "Diversity in Living Organisms", classNum: 9, subject: "Biology", board: "Both", chapterNumber: 3, category: "standard",
    topics: [
      { id: "t1", name: "Basis of Classification",           minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch03:classification-criteria", "bio:9:ch03:whittaker-five-kingdoms"] },
      { id: "t2", name: "Plant Kingdom",                     minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch03:thallophyta-bryophyta-pteridophyta", "bio:9:ch03:gymnosperms-angiosperms"] },
      { id: "t3", name: "Animal Kingdom",                    minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch03:porifera-coelenterata-platyhelminthes", "bio:9:ch03:vertebrate-classes"] },
    ],
    applicableTypes: ["concept", "ncert", "icse", "competency", "hots", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch04", name: "Why Do We Fall Ill?", classNum: 9, subject: "Biology", board: "Both", chapterNumber: 4, category: "standard",
    topics: [
      { id: "t1", name: "Health and Disease",                minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch04:health-definition", "bio:9:ch04:disease-classification"] },
      { id: "t2", name: "Causes of Disease",                 minQuestions: 5, targetQuestions: 8,  conceptNodes: ["bio:9:ch04:infectious-agents", "bio:9:ch04:disease-transmission"] },
      { id: "t3", name: "Prevention and Treatment",          minQuestions: 4, targetQuestions: 7,  conceptNodes: ["bio:9:ch04:immunisation", "bio:9:ch04:antibiotic-mechanism"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "assertion-reason", "case-study", "previous-year"],
  },
];

// ─── COMPUTER SCIENCE ─────────────────────────────────────────────────────────

const CS_CHAPTERS: ChapterRecord[] = [
  // ── Class 6 ─────────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "Introduction to Computers", classNum: 6, subject: "Computer Science", board: "Both", chapterNumber: 1, category: "minor",
    topics: [
      { id: "t1", name: "What Is a Computer?",               minQuestions: 4, targetQuestions: 6,  conceptNodes: ["csc:6:ch01:computer-definition", "csc:6:ch01:ipm-cycle"] },
      { id: "t2", name: "Types of Computers",                minQuestions: 3, targetQuestions: 5,  conceptNodes: ["csc:6:ch01:supercomputer-mainframe-desktop-laptop"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },
  { chapterId: "ch02", name: "Hardware and Software", classNum: 6, subject: "Computer Science", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Input and Output Devices",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:6:ch02:input-devices", "csc:6:ch02:output-devices"] },
      { id: "t2", name: "Storage Devices",                   minQuestions: 4, targetQuestions: 6,  conceptNodes: ["csc:6:ch02:primary-secondary-storage", "csc:6:ch02:storage-capacity"] },
      { id: "t3", name: "Software: System and Application",  minQuestions: 4, targetQuestions: 7,  conceptNodes: ["csc:6:ch02:system-software", "csc:6:ch02:application-software", "csc:6:ch02:os-role"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "previous-year"],
  },

  // ── Class 7 ─────────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "Introduction to Programming Concepts", classNum: 7, subject: "Computer Science", board: "Both", chapterNumber: 1, category: "standard",
    topics: [
      { id: "t1", name: "Algorithms and Flowcharts",         minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:7:ch01:algorithm-definition", "csc:7:ch01:flowchart-symbols"] },
      { id: "t2", name: "Problem Solving Steps",             minQuestions: 4, targetQuestions: 7,  conceptNodes: ["csc:7:ch01:problem-analysis", "csc:7:ch01:pseudocode"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },

  // ── Class 8 ─────────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "Python Basics", classNum: 8, subject: "Computer Science", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Variables and Data Types",          minQuestions: 6, targetQuestions: 10, conceptNodes: ["csc:8:ch01:variable-definition", "csc:8:ch01:data-types-int-float-str-bool", "csc:8:ch01:type-conversion"] },
      { id: "t2", name: "Operators",                         minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:8:ch01:arithmetic-operators", "csc:8:ch01:comparison-operators", "csc:8:ch01:logical-operators"] },
      { id: "t3", name: "Input and Output",                  minQuestions: 4, targetQuestions: 7,  conceptNodes: ["csc:8:ch01:print-function", "csc:8:ch01:input-function", "csc:8:ch01:string-formatting"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  { chapterId: "ch02", name: "Control Flow: Conditions and Loops", classNum: 8, subject: "Computer Science", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Conditional Statements (if/elif/else)", minQuestions: 6, targetQuestions: 10, conceptNodes: ["csc:8:ch02:if-statement", "csc:8:ch02:elif-else", "csc:8:ch02:nested-if"] },
      { id: "t2", name: "For Loop",                          minQuestions: 6, targetQuestions: 10, conceptNodes: ["csc:8:ch02:for-loop-syntax", "csc:8:ch02:range-function", "csc:8:ch02:loop-variable-use"] },
      { id: "t3", name: "While Loop",                        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:8:ch02:while-loop-syntax", "csc:8:ch02:infinite-loop-risk", "csc:8:ch02:break-continue"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },

  // ── Class 9 ─────────────────────────────────────────────────────────────────
  { chapterId: "ch01", name: "Python: Functions and Modules", classNum: 9, subject: "Computer Science", board: "Both", chapterNumber: 1, category: "major",
    topics: [
      { id: "t1", name: "Defining and Calling Functions",    minQuestions: 6, targetQuestions: 10, conceptNodes: ["csc:9:ch01:function-definition", "csc:9:ch01:function-call", "csc:9:ch01:return-statement"] },
      { id: "t2", name: "Parameters and Arguments",          minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:9:ch01:parameter-vs-argument", "csc:9:ch01:default-parameter", "csc:9:ch01:local-global-scope"] },
      { id: "t3", name: "Built-in Functions and Modules",   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:9:ch01:math-module", "csc:9:ch01:built-in-functions"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
  { chapterId: "ch02", name: "Lists, Tuples, and Strings", classNum: 9, subject: "Computer Science", board: "Both", chapterNumber: 2, category: "major",
    topics: [
      { id: "t1", name: "Lists: Operations and Methods",     minQuestions: 6, targetQuestions: 10, conceptNodes: ["csc:9:ch02:list-definition", "csc:9:ch02:list-indexing-slicing", "csc:9:ch02:list-methods"] },
      { id: "t2", name: "Tuples",                            minQuestions: 4, targetQuestions: 7,  conceptNodes: ["csc:9:ch02:tuple-immutability", "csc:9:ch02:tuple-vs-list"] },
      { id: "t3", name: "Strings and String Methods",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["csc:9:ch02:string-indexing", "csc:9:ch02:string-methods", "csc:9:ch02:string-slicing"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "previous-year"],
  },
];

// ─── ECONOMICS ────────────────────────────────────────────────────────────────

const ECONOMICS_CHAPTERS: ChapterRecord[] = [
  { chapterId: "ch01", name: "The Story of Village Palampur", classNum: 9, subject: "Economics", board: "Both", chapterNumber: 1, category: "standard",
    topics: [
      { id: "t1", name: "Production and Its Factors",        minQuestions: 5, targetQuestions: 8,  conceptNodes: ["eco:9:ch01:factors-of-production", "eco:9:ch01:land-labour-capital-enterprise"] },
      { id: "t2", name: "Farming and Non-Farm Activities",   minQuestions: 5, targetQuestions: 8,  conceptNodes: ["eco:9:ch01:farming-activity-palampur", "eco:9:ch01:non-farm-activities"] },
      { id: "t3", name: "Labour and Capital in Agriculture", minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch01:fixed-working-capital", "eco:9:ch01:labour-types"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "previous-year"],
    boardSpecificNotes: "ICSE covers additional content on rural economy and cooperative farming.",
  },
  { chapterId: "ch02", name: "People as Resource", classNum: 9, subject: "Economics", board: "Both", chapterNumber: 2, category: "standard",
    topics: [
      { id: "t1", name: "Human Capital and Education",       minQuestions: 5, targetQuestions: 8,  conceptNodes: ["eco:9:ch02:human-capital-definition", "eco:9:ch02:investment-in-education"] },
      { id: "t2", name: "Employment and Unemployment",       minQuestions: 5, targetQuestions: 8,  conceptNodes: ["eco:9:ch02:types-of-unemployment", "eco:9:ch02:disguised-unemployment"] },
      { id: "t3", name: "Quality of Population",             minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch02:literacy-health-skill", "eco:9:ch02:quality-indicators"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch03", name: "Poverty as a Challenge", classNum: 9, subject: "Economics", board: "Both", chapterNumber: 3, category: "standard",
    topics: [
      { id: "t1", name: "Understanding Poverty",             minQuestions: 5, targetQuestions: 8,  conceptNodes: ["eco:9:ch03:poverty-line-definition", "eco:9:ch03:absolute-relative-poverty"] },
      { id: "t2", name: "Causes and Vulnerable Groups",      minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch03:causes-of-poverty", "eco:9:ch03:vulnerable-groups"] },
      { id: "t3", name: "Anti-Poverty Measures",             minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch03:anti-poverty-schemes", "eco:9:ch03:mnrega-nfsa"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "assertion-reason", "previous-year"],
  },
  { chapterId: "ch04", name: "Food Security in India", classNum: 9, subject: "Economics", board: "Both", chapterNumber: 4, category: "standard",
    topics: [
      { id: "t1", name: "Food Security: Dimensions and Need", minQuestions: 5, targetQuestions: 8, conceptNodes: ["eco:9:ch04:food-security-definition", "eco:9:ch04:availability-access-absorption"] },
      { id: "t2", name: "Buffer Stock and PDS",               minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch04:buffer-stock", "eco:9:ch04:public-distribution-system"] },
      { id: "t3", name: "Food Security Programmes",           minQuestions: 4, targetQuestions: 7,  conceptNodes: ["eco:9:ch04:midday-meal", "eco:9:ch04:antyodaya-anna-yojana"] },
    ],
    applicableTypes: ["concept", "ncert", "competency", "hots", "case-study", "assertion-reason", "previous-year"],
  },
];

// ─── Combined export ──────────────────────────────────────────────────────────

export const ALL_CHAPTERS: ChapterRecord[] = [
  ...MATHEMATICS_CHAPTERS,
  ...PHYSICS_CHAPTERS,
  ...CHEMISTRY_CHAPTERS,
  ...BIOLOGY_CHAPTERS,
  ...CS_CHAPTERS,
  ...ECONOMICS_CHAPTERS,
];

export {
  MATHEMATICS_CHAPTERS,
  PHYSICS_CHAPTERS,
  CHEMISTRY_CHAPTERS,
  BIOLOGY_CHAPTERS,
  CS_CHAPTERS,
  ECONOMICS_CHAPTERS,
};

/** Look up a chapter by its canonical coordinates */
export function findChapter(
  subject: string,
  classNum: number,
  chapterId: string,
): ChapterRecord | undefined {
  return ALL_CHAPTERS.find(
    ch => ch.subject === subject && ch.classNum === classNum && ch.chapterId === chapterId,
  );
}
