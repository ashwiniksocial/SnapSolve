/**
 * Deterministic Lesson Planner
 *
 * Builds a TeachingBlueprint from the curated academic-knowledge registry
 * without any OpenAI call. Replaces the planning LLM call for Standard and
 * Detailed modes, eliminating the 10–12 s planning round-trip.
 *
 * Data source: academic-knowledge/subjects/ (extracted offline, curated subset).
 * Coverage: Mathematics Class 9 (13 chapters), Physics Class 9 (5 chapters),
 *           Chemistry Class 9 (4 chapters).
 *
 * Zero network calls. Runs in < 1 ms.
 */

import type { TeachingBlueprint, ConceptBlueprint } from "./lessonPlanner";

// ─── Inline registry types ────────────────────────────────────────────────────

interface St { name: string; keyIdea: string; periods: number; }
interface Mc { m: string; w: string; rq: string; }
interface Df { term: string; ie: string; }
interface Chapter {
  subject: string;
  id:      string;
  name:    string;
  cc:      string[];  // coreConcepts (up to 3)
  st:      St[];      // subtopics
  mc:      Mc[];      // misconceptions (up to 4)
  df:      Df[];      // definitions (up to 3)
}

// ─── Academic knowledge registry ─────────────────────────────────────────────
// Curated subset extracted from academic-knowledge/subjects/.
// Fields: chapter identifiers, subtopics with key ideas, misconceptions, and
// definition informal-explanations used as analogies.

const REGISTRY: Chapter[] = [

  // ══ Mathematics Class 9 ══════════════════════════════════════════════════

  {
    subject: "Mathematics", id: "ch01", name: "Number Systems",
    cc: [
      "decimal expansion determines rationality: terminating or recurring means rational",
      "irrational numbers cannot be expressed as p/q where p and q are integers and q is non-zero",
      "fractional exponents are roots: x to the power m/n equals the nth root of x to the m",
    ],
    st: [
      { name: "Rational Numbers and Decimal Expansions", keyIdea: "Long division always produces a repeating pattern for rational numbers", periods: 2 },
      { name: "Irrational Numbers", keyIdea: "Irrationality of root 2 proved by contradiction: assume it equals p/q, derive a contradiction with gcd", periods: 3 },
      { name: "Real Numbers and the Number Line", keyIdea: "Every point on the number line is a real number — visualise density of both rational and irrational sets", periods: 1 },
      { name: "Operations on Real Numbers and Surds", keyIdea: "Rationalisation uses the conjugate identity to eliminate surds from denominators", periods: 3 },
      { name: "Laws of Exponents for Real Numbers", keyIdea: "Fractional exponent is compact notation for roots: x^(1/2) = root x", periods: 2 },
    ],
    mc: [
      { m: "root 4 is irrational because it has a square root sign", w: "Students associate the square root symbol with irrational numbers regardless of value", rq: "Is root 9 rational or irrational? Justify." },
      { m: "22/7 equals pi", w: "22/7 is widely used in calculations so students conflate the approximation with the actual value of pi", rq: "A student says pi = 22/7. Is this correct? Explain the error." },
      { m: "the sum of two irrational numbers is always irrational", w: "Students generalise: irrational plus irrational should always be irrational", rq: "Give an example of two irrational numbers whose sum is rational." },
      { m: "root a plus root b equals root of (a + b)", w: "Over-generalisation from fraction addition where numerators add over a common denominator", rq: "Does root 12 + root 27 = root 39? Simplify to check." },
    ],
    df: [
      { term: "Rational Number", ie: "Any number you can write as a fraction with integer numerator and non-zero integer denominator" },
      { term: "Irrational Number", ie: "Its decimal expansion never terminates and never settles into a repeating block" },
      { term: "Surd", ie: "A root sign over a non-perfect-power number — like root 3 or root 5" },
    ],
  },

  {
    subject: "Mathematics", id: "ch02", name: "Polynomials",
    cc: [
      "a polynomial has non-negative integer exponents only — root x and 1/x are not polynomials",
      "Remainder Theorem: dividing p(x) by (x minus a) gives remainder p(a) — no long division needed",
      "Factor Theorem: (x minus a) is a factor of p(x) if and only if p(a) equals zero",
    ],
    st: [
      { name: "Polynomials and Classification", keyIdea: "The exponent test: root x and 1/x fail because their exponents are not non-negative integers", periods: 2 },
      { name: "Zeros of a Polynomial", keyIdea: "Geometric meaning: the zeros are where the graph of the polynomial crosses the x-axis", periods: 2 },
      { name: "Remainder Theorem", keyIdea: "Substitute the value directly instead of long division to find the remainder instantly", periods: 2 },
      { name: "Factor Theorem", keyIdea: "If p(a) = 0 then (x minus a) is a factor — this links zeros of a polynomial to its factorisation", periods: 2 },
      { name: "Algebraic Identities and Cube Expansions", keyIdea: "Cube identities extend the square-identity technique and help evaluate large powers quickly", periods: 2 },
      { name: "Factorisation of Polynomials", keyIdea: "Test rational roots, find one zero, then divide and factorise the quotient", periods: 3 },
    ],
    mc: [
      { m: "root x is a polynomial because it looks like an algebraic expression", w: "Students classify all algebraic expressions as polynomials without checking that exponents are non-negative integers", rq: "Is root x + 3 a polynomial? Justify your answer." },
      { m: "the degree of the constant polynomial 5 is 1", w: "Students think a number without a variable has no exponent which they silently assume is 1", rq: "What is the degree of the polynomial 7?" },
      { m: "if p(2) = 0 then 2 is a factor of p(x)", w: "Confusion between the zero of a polynomial (a number) and the factor of a polynomial (an expression)", rq: "p(3) = 0. Which of these is a factor: (a) 3, (b) x minus 3, (c) x plus 3?" },
      { m: "(a+b) cubed equals a cubed plus b cubed", w: "Over-generalisation from the distributive property — treating cube as if it distributes over addition", rq: "Expand (x + 1) cubed and verify by substituting x = 2." },
    ],
    df: [
      { term: "Polynomial", ie: "A sum of terms where each term has a variable raised to a whole-number power — no roots or fractions in the exponent" },
      { term: "Degree of a Polynomial", ie: "The highest exponent in the polynomial — count the biggest power" },
      { term: "Zero of a Polynomial", ie: "The input that makes the polynomial equal zero — where the graph crosses the x-axis" },
    ],
  },

  {
    subject: "Mathematics", id: "ch03", name: "Coordinate Geometry",
    cc: [
      "every point in the plane is uniquely identified by an ordered pair (x, y)",
      "the x-axis and y-axis divide the plane into four quadrants with specific sign patterns",
      "the order in an ordered pair matters: (3, 5) is not the same point as (5, 3)",
    ],
    st: [
      { name: "Cartesian System: Axes, Origin, and Quadrants", keyIdea: "Cartesian comes from Descartes — the story of discovering coordinates motivates why the system exists", periods: 2 },
      { name: "Plotting and Reading Points", keyIdea: "Move along the x-axis first, then up or down for y — exactly like reading a map grid reference", periods: 2 },
      { name: "Quadrant Identification", keyIdea: "Quadrants are numbered anti-clockwise starting from top-right: I (+,+), II (-,+), III (-,-), IV (+,-)", periods: 1 },
    ],
    mc: [
      { m: "(3, 5) and (5, 3) are the same point", w: "Students confuse an ordered pair with a set where order does not matter", rq: "Plot (2, 5) and (5, 2) on the same grid. Are they the same point?" },
      { m: "a point on the x-axis has zero coordinates", w: "Students think being on an axis means being at the origin", rq: "What are the coordinates of a point on the y-axis that is 4 units above the origin?" },
      { m: "a negative x-coordinate means the point is below the x-axis", w: "Conflating the sign of the x-coordinate with the y-coordinate", rq: "In which quadrant does the point (minus 3, 4) lie?" },
    ],
    df: [
      { term: "Cartesian Plane", ie: "A grid made from two number lines — one horizontal (x) and one vertical (y)" },
      { term: "Ordered Pair", ie: "Like a map reference: street number first, then house number — the order is fixed and cannot be swapped" },
      { term: "Quadrant", ie: "One of four rooms created by the cross of the two axes" },
    ],
  },

  {
    subject: "Mathematics", id: "ch04", name: "Linear Equations in Two Variables",
    cc: [
      "a linear equation in two variables has infinitely many solutions — they form a straight line",
      "any solution (x, y) is a point on the graph; any non-solution is off the line",
      "x = a gives a vertical line; y = b gives a horizontal line",
    ],
    st: [
      { name: "Linear Equations: Form and Solutions", keyIdea: "Fix one variable, solve for the other — infinitely many choices give infinitely many solutions", periods: 2 },
      { name: "Graphs of Linear Equations", keyIdea: "Plot any two solutions, connect them — you get the full infinite line", periods: 3 },
      { name: "Special Lines: x = a and y = b", keyIdea: "Degenerate cases where one coefficient is zero — still valid linear equations in two variables", periods: 1 },
    ],
    mc: [
      { m: "a linear equation in two variables has only one solution", w: "Students carry over the one-solution expectation from equations in one variable", rq: "How many solutions does 2x + y = 5 have? Find three different ones." },
      { m: "you need to find all solutions before drawing the graph", w: "Students do not realise a straight line is completely determined by just two of its points", rq: "What is the minimum number of points needed to plot the graph of 3x minus 2y = 6?" },
      { m: "x = 4 is not a linear equation in two variables", w: "Students require both variables to appear explicitly in the equation", rq: "Is x = 3 a linear equation in two variables? Draw its graph and explain." },
    ],
    df: [
      { term: "Linear Equation in Two Variables", ie: "An equation with two unknowns where neither x nor y has a power greater than 1" },
      { term: "Solution of a Linear Equation", ie: "A specific (x, y) pair that makes the equation true when substituted into it" },
    ],
  },

  {
    subject: "Mathematics", id: "ch05", name: "Introduction to Euclid's Geometry",
    cc: [
      "an axiom is assumed true without proof — it is self-evident and not derived from anything else",
      "a theorem is proved using axioms, postulates, and previously proved theorems",
      "the fifth postulate (parallel postulate) is the most controversial and leads to non-Euclidean geometries",
    ],
    st: [
      { name: "Euclid Definitions, Axioms, and Postulates", keyIdea: "Euclid's Elements is the first example of a complete axiomatic mathematical system", periods: 2 },
      { name: "Euclid's Five Postulates", keyIdea: "The fifth postulate is uniquely complex compared to the other four — mathematicians tried to prove it for 2000 years", periods: 2 },
      { name: "Equivalent Versions of the Fifth Postulate", keyIdea: "Through a point not on a line, exactly one parallel line can be drawn — this is Playfair's equivalent version", periods: 1 },
    ],
    mc: [
      { m: "axioms are guesses or assumptions that might be wrong", w: "Everyday use of assumption implies uncertainty; mathematical axioms are deliberate choices, not uncertain guesses", rq: "Why did mathematicians try for 2000 years to prove the fifth postulate from the other four?" },
      { m: "a theorem is just an axiom that someone proved", w: "Students see both as true statements and do not appreciate the logical hierarchy between them", rq: "What is the difference between an axiom and a theorem? Give one example of each." },
    ],
    df: [
      { term: "Axiom (Common Notion)", ie: "A rule everyone agrees on without needing a proof: things equal to the same thing are equal to each other" },
      { term: "Postulate", ie: "A geometry-specific rule assumed without proof: a straight line can be drawn between any two points" },
      { term: "Theorem", ie: "A statement about geometry we can prove — not assumed, but derived step by step from axioms" },
    ],
  },

  {
    subject: "Mathematics", id: "ch06", name: "Lines and Angles",
    cc: [
      "angles on a straight line sum to 180 degrees",
      "vertically opposite angles are equal whenever two lines intersect",
      "when a transversal cuts parallel lines: corresponding angles are equal, alternate interior angles are equal, co-interior angles sum to 180 degrees",
    ],
    st: [
      { name: "Basic Angle Types and Pairs", keyIdea: "Adjacent, complementary, supplementary, linear pair — the relationship name is determined by position and sum", periods: 2 },
      { name: "Intersecting Lines and Vertically Opposite Angles", keyIdea: "Both vertically opposite angles together with the same angle form a straight line — so they must be equal", periods: 2 },
      { name: "Parallel Lines and Transversal", keyIdea: "Corresponding angles are equal because they are in identical positions at their respective intersections", periods: 3 },
      { name: "Angle Sum Property and Exterior Angle Theorem", keyIdea: "Prove the triangle angle sum using a parallel line through the vertex — connects parallel lines to triangles", periods: 2 },
    ],
    mc: [
      { m: "vertically opposite angles are any angles that share a vertex", w: "The word opposite does not specify across the intersection clearly enough for students", rq: "In the figure of two intersecting lines, circle the two pairs of vertically opposite angles." },
      { m: "co-interior angles are equal for parallel lines", w: "Students know parallel lines create equal angles and over-apply this rule to co-interior (same-side) pairs", rq: "Find the missing angle: lines are parallel, one co-interior angle is 70 degrees." },
    ],
    df: [
      { term: "Linear Pair", ie: "Two angles sitting side by side on a straight line — they must add up to 180 degrees, always" },
      { term: "Vertically Opposite Angles", ie: "The angles across from each other at an X-shaped crossing — not the adjacent ones, the opposite ones" },
      { term: "Transversal", ie: "A line that crosses two or more other lines — like a diagonal road crossing two parallel streets" },
    ],
  },

  {
    subject: "Mathematics", id: "ch07", name: "Triangles",
    cc: [
      "two triangles are congruent if they are identical in shape AND size — one fits exactly onto the other",
      "congruence criteria (SSS, SAS, ASA, AAS, RHS) give the minimum information needed to establish congruence",
      "corresponding parts of congruent triangles are equal — CPCT is the reason used after proving congruence",
    ],
    st: [
      { name: "Congruence of Triangles and Criteria", keyIdea: "Not all combinations of 3 equal measurements guarantee congruence — SSA fails, which is why RHS is a separate criterion", periods: 4 },
      { name: "Properties of Isosceles Triangles", keyIdea: "Proved using congruence — the triangle is its own mirror image along the altitude from the apex", periods: 2 },
      { name: "Inequalities in a Triangle", keyIdea: "Larger angle faces longer side; triangle inequality: sum of any two sides is greater than the third", periods: 2 },
    ],
    mc: [
      { m: "SSA (Side-Side-Angle) is a valid congruence criterion", w: "Students see 3 measurements specified and assume that is always sufficient for congruence", rq: "Draw two non-congruent triangles with sides 4, 6 and included angle 30 degrees to show SSA can fail." },
      { m: "CPCT can be used before proving congruence", w: "Students use equal parts as the reason for congruence — this is circular reasoning", rq: "A student writes angle A = angle P (by CPCT) at step 2 before proving the triangles congruent. What is wrong?" },
      { m: "two triangles with the same area are congruent", w: "Area measures size so students conflate same size with the geometric definition of congruence", rq: "Are two triangles with equal area necessarily congruent? Give an example or counterexample." },
    ],
    df: [
      { term: "Congruent Triangles", ie: "One triangle fits exactly on top of the other — same shape and same size, possibly flipped or rotated" },
      { term: "CPCT", ie: "Once you have proved two triangles match, all their corresponding parts — sides and angles — are automatically equal" },
      { term: "SSS Criterion", ie: "If all three pairs of sides are equal the triangles must be identical — no other information needed" },
    ],
  },

  {
    subject: "Mathematics", id: "ch08", name: "Quadrilaterals",
    cc: [
      "a parallelogram has opposite sides parallel — this single definition generates all other properties",
      "diagonals of a parallelogram bisect each other, and conversely a quadrilateral whose diagonals bisect each other is a parallelogram",
      "mid-point theorem: the segment joining midpoints of two sides of a triangle is parallel to the third side and half as long",
    ],
    st: [
      { name: "Properties of Quadrilaterals", keyIdea: "Parallelogram is defined by parallel opposite sides — all other angle and side properties follow from this", periods: 2 },
      { name: "Properties of Parallelogram: Proofs", keyIdea: "All three main properties proved by forming congruent triangles using the diagonal", periods: 3 },
      { name: "Mid-point Theorem", keyIdea: "Proved by extending the mid-point segment to form congruent triangles with the original", periods: 2 },
    ],
    mc: [
      { m: "all rectangles are squares", w: "Students jump from special rectangle to square without noting that a square requires all sides equal", rq: "Is every square a rectangle? Is every rectangle a square? Justify both answers." },
      { m: "diagonals of all quadrilaterals bisect each other", w: "Students over-generalise the parallelogram property to all four-sided figures", rq: "Do the diagonals of a trapezium bisect each other? Justify with a sketch." },
    ],
    df: [
      { term: "Parallelogram", ie: "A four-sided shape where opposite sides never meet — like a leaning rectangle" },
      { term: "Rhombus", ie: "A diamond shape — all four sides equal length but the angles need not be 90 degrees" },
      { term: "Rectangle", ie: "A parallelogram with all right angles — opposite sides are equal but all sides need not be equal" },
    ],
  },

  {
    subject: "Mathematics", id: "ch09", name: "Circles",
    cc: [
      "all radii of a circle are equal — this single fact is the source of every circle property",
      "the perpendicular from the centre to a chord bisects it, and conversely",
      "the angle subtended by an arc at the centre is exactly double the angle at the circumference on the remaining arc",
    ],
    st: [
      { name: "Chords and Their Properties", keyIdea: "Both chord properties proved by forming congruent triangles using equal radii", periods: 2 },
      { name: "Angle Subtended by a Chord at the Centre", keyIdea: "Three cases — acute, obtuse, reflex central angle — all use the same proof technique", periods: 3 },
      { name: "Angles in the Same Segment", keyIdea: "Corollary of the angle-at-centre theorem: all angles in the same segment are equal", periods: 1 },
      { name: "Cyclic Quadrilateral", keyIdea: "Opposite angles of a cyclic quadrilateral sum to 180 degrees because they subtend arcs that together complete the circle", periods: 2 },
    ],
    mc: [
      { m: "the angle in a semicircle is 90 degrees only when the triangle looks right-angled", w: "Students think they need to identify a right triangle first, rather than applying the theorem directly", rq: "P is any point on a circle with diameter AB. What is angle APB always equal to?" },
      { m: "angles in the same segment are equal only if both points are the same distance from the chord", w: "Students think distance from the chord determines the angle size", rq: "Three points P, Q, R lie on the major arc of chord AB. Are angles APB, AQB, and ARB all equal?" },
      { m: "the angle at centre is always twice the angle at circumference for any point anywhere on the circle", w: "Students do not carefully read the condition that the point must be on the remaining arc", rq: "Can a point on the minor arc see the same minor arc? What angle would it subtend?" },
    ],
    df: [
      { term: "Circle", ie: "The set of all points at exactly the same distance from a fixed centre point" },
      { term: "Chord", ie: "Any straight line segment with both ends on the circle — the diameter is the longest chord" },
      { term: "Arc", ie: "A portion of the circle boundary — minor arc is less than semicircle, major arc is more" },
    ],
  },

  {
    subject: "Mathematics", id: "ch10", name: "Heron's Formula",
    cc: [
      "Heron's formula calculates triangle area from the three sides alone — no height required",
      "the semi-perimeter s = (a+b+c)/2 is computed first and used as the key intermediate value",
      "any polygon can be divided into triangles; summing their individual areas gives the total polygon area",
    ],
    st: [
      { name: "Area of Triangle Using Heron's Formula", keyIdea: "Use Heron's formula when height is unknown but all three sides are given", periods: 3 },
      { name: "Area of Quadrilaterals by Triangulation", keyIdea: "Draw a diagonal to split the quadrilateral into two triangles, then add their areas", periods: 2 },
    ],
    mc: [
      { m: "always use Heron's formula for triangle area", w: "Students learn Heron's formula and over-apply it even when base and height are directly given", rq: "A triangle has base 8 cm and height 5 cm. Find its area — which formula is simpler here?" },
      { m: "s is the perimeter", w: "Students forget to halve when computing the semi-perimeter s", rq: "For a triangle with sides 5, 6, and 7: what is the value of s?" },
    ],
    df: [
      { term: "Semi-perimeter (s)", ie: "Half the total perimeter — this is computed first in every Heron's formula problem" },
    ],
  },

  {
    subject: "Mathematics", id: "ch11", name: "Surface Areas and Volumes",
    cc: [
      "surface area measures the total outer area — relevant for material cost and painting",
      "volume measures the space inside — relevant for capacity and weight",
      "CSA or lateral surface area excludes flat bases; TSA includes every face",
    ],
    st: [
      { name: "Cuboid and Cube", keyIdea: "Unroll the box into its net to see all six rectangular faces — the formula follows directly", periods: 2 },
      { name: "Right Circular Cylinder", keyIdea: "Unroll the cylinder: the curved surface becomes a rectangle with width equal to the circumference 2 pi r", periods: 2 },
      { name: "Right Circular Cone", keyIdea: "Slant height l = root of (r squared + h squared) by Pythagoras; curved surface unrolls to a sector", periods: 3 },
      { name: "Sphere and Hemisphere", keyIdea: "Sphere TSA = 4 pi r squared; hemisphere TSA = 3 pi r squared (curved 2 pi r squared plus flat base pi r squared)", periods: 2 },
    ],
    mc: [
      { m: "slant height l equals the vertical height h of the cone", w: "Students confuse the slant distance along the side with the perpendicular height inside", rq: "A cone has radius 3 cm and vertical height 4 cm. Find its slant height." },
      { m: "TSA of cylinder equals pi r squared times h (that is the volume formula)", w: "Both formulas involve pi r squared so students confuse TSA with volume", rq: "What does TSA represent physically? What does volume represent?" },
      { m: "TSA of a hemisphere equals 2 pi r squared (only the curved part)", w: "Students forget to include the flat circular base when calculating total surface area", rq: "A bowl is a hemisphere of radius 7 cm. What is its total outer surface area?" },
    ],
    df: [
      { term: "Lateral (Curved) Surface Area", ie: "The area of the walls only — what you would paint without painting the floor or ceiling" },
      { term: "Total Surface Area (TSA)", ie: "The complete outer area including all faces, flat bases, and curved sides" },
      { term: "Slant Height of a Cone", ie: "The sloped distance from the tip to the rim of the base — longer than the vertical height; found using Pythagoras" },
    ],
  },

  {
    subject: "Mathematics", id: "ch12", name: "Statistics",
    cc: [
      "raw data becomes useful information only after organisation and representation",
      "frequency distributions group data into class intervals; class width should be uniform",
      "mean uses every data value; median uses only the middle position; mode uses only the most frequent class",
    ],
    st: [
      { name: "Frequency Distribution Tables", keyIdea: "Class interval width should be uniform; tally marks organise continuous data into manageable groups", periods: 2 },
      { name: "Graphical Representations of Data", keyIdea: "Each graph reveals a different feature — histogram shows distribution, ogive shows cumulative frequency", periods: 3 },
      { name: "Measures of Central Tendency for Grouped Data", keyIdea: "Mean uses class midpoints; median uses cumulative frequency; mode uses the highest frequency class", periods: 4 },
    ],
    mc: [
      { m: "the mode is the class with the highest cumulative frequency", w: "Students confuse frequency (count per class) with cumulative frequency (running total)", rq: "Identify the modal class and the median class from a given frequency table — explain how you chose each." },
      { m: "mean, median, and mode are always different from each other", w: "In most practice problems they differ so students assume this is always the case", rq: "For what type of distribution are mean, median, and mode all equal?" },
      { m: "histogram bars can have different widths", w: "Students confuse histogram with bar chart — histograms require equal-width bars or frequency-density adjustment", rq: "When would you use frequency density instead of frequency on the y-axis of a histogram?" },
    ],
    df: [
      { term: "Class Interval", ie: "A bin that collects all data values within a defined range — like grouping ages 10-20, 20-30, and so on" },
      { term: "Class Width", ie: "How wide each group is — should be the same for all classes in a standard frequency distribution" },
      { term: "Class Midpoint", ie: "The middle value of a class interval — used to represent all data in that class when computing the mean" },
    ],
  },

  {
    subject: "Mathematics", id: "ch13", name: "Probability",
    cc: [
      "probability measures likelihood on a scale from 0 (impossible) to 1 (certain)",
      "experimental probability = number of favourable outcomes divided by total trials conducted",
      "as the number of trials increases, experimental probability approaches theoretical probability",
    ],
    st: [
      { name: "Experimental Probability", keyIdea: "Probability starts from observation; the ratio stabilises as the number of trials grows large", periods: 2 },
      { name: "Theoretical Probability", keyIdea: "Classical probability assumes all outcomes are equally likely — valid for fair coins, unbiased dice, and identical balls", periods: 3 },
    ],
    mc: [
      { m: "after 8 heads in a row the next toss is more likely to give tails", w: "Gambler's fallacy: intuitive belief that outcomes must balance out soon", rq: "A fair coin gives heads 8 times in a row. What is the probability of tails on the 9th toss? Explain." },
      { m: "probability can be greater than 1 if many outcomes are favourable", w: "Students confuse probability (a ratio) with a count of favourable outcomes", rq: "A bag has 3 red and 5 blue balls. What is P(not yellow)?" },
      { m: "rolling a die 60 times must give exactly 10 sixes because P(6) = 1/6", w: "Confusing probability (a long-run tendency) with a deterministic prediction for a specific number of trials", rq: "If P(Head) = 1/2, how many heads would you expect in 100 tosses? Why might you not get exactly 50?" },
    ],
    df: [
      { term: "Random Experiment", ie: "Any process where chance determines the outcome — tossing a coin, rolling a die, drawing a card" },
      { term: "Sample Space (S)", ie: "The complete list of all possible outcomes: for a coin, S = {Head, Tail}" },
      { term: "Event (E)", ie: "The outcome or group of outcomes we are interested in: getting an even number on a die = {2, 4, 6}" },
    ],
  },

  // ══ Physics Class 9 ══════════════════════════════════════════════════════

  {
    subject: "Physics", id: "ch01", name: "Motion",
    cc: [
      "motion is relative — always described with respect to a chosen reference point",
      "distance is total path length (scalar); displacement is the straight-line gap with direction (vector)",
      "speed is magnitude of velocity; velocity includes direction — they differ when direction changes",
    ],
    st: [
      { name: "Distance, Displacement, Speed, and Velocity", keyIdea: "Walking in a circle and returning to start: displacement = 0, distance > 0 — shows the difference sharply", periods: 2 },
      { name: "Acceleration", keyIdea: "A braking car has negative acceleration; a car turning at constant speed has centripetal acceleration — acceleration includes change in direction", periods: 2 },
      { name: "Equations of Uniformly Accelerated Motion", keyIdea: "Three kinematic equations solve any uniform acceleration problem — identify given and unknown quantities first", periods: 3 },
      { name: "Graphical Analysis of Motion", keyIdea: "Slope of distance-time graph = speed; slope of velocity-time graph = acceleration; area under velocity-time graph = displacement", periods: 3 },
    ],
    mc: [
      { m: "speed and velocity are the same quantity", w: "Everyday language uses speed and velocity interchangeably but in physics direction makes them different", rq: "A car travels around a circular track at constant 60 km/h. Is its velocity constant? Explain." },
      { m: "an object with zero velocity must have zero acceleration", w: "Conflating not moving at that instant with having no force or acceleration", rq: "A ball is thrown straight up. At the highest point: what is its velocity? What is its acceleration?" },
      { m: "negative acceleration always means slowing down", w: "Students associate negative with less rather than opposite direction", rq: "A car moving in reverse speeds up. Is its acceleration positive or negative? Is it decelerating?" },
      { m: "the area under a distance-time graph gives velocity", w: "Students confuse the graph relationships between the two common motion graphs", rq: "What physical quantity does the area under a velocity-time graph represent?" },
    ],
    df: [
      { term: "Distance", ie: "The total length of the path you actually travelled — every turn and detour counted" },
      { term: "Displacement", ie: "The straight-line gap from your starting point to your ending point, with a direction arrow" },
      { term: "Uniform Velocity", ie: "Constant speed AND constant direction — circular motion at steady speed is NOT uniform velocity" },
    ],
  },

  {
    subject: "Physics", id: "ch02", name: "Force and Laws of Motion",
    cc: [
      "inertia is the resistance of objects to any change in their state of motion — mass is the measure of inertia",
      "Newton's Second Law: F = ma where F is the NET force and a is the acceleration it causes",
      "action and reaction forces are equal and opposite but act on different bodies — they cannot cancel",
    ],
    st: [
      { name: "Newton's First Law and Inertia", keyIdea: "Before Newton the natural state was rest; Newton showed the natural state is constant velocity (no net force needed)", periods: 2 },
      { name: "Newton's Second Law: F = ma", keyIdea: "The F in F = ma is the NET (total) force; direction of acceleration is always the direction of net force", periods: 3 },
      { name: "Newton's Third Law: Action and Reaction", keyIdea: "Action and reaction always act on different bodies — that is why they never cancel each other", periods: 2 },
      { name: "Conservation of Momentum", keyIdea: "Before = after: m1 u1 + m2 u2 = m1 v1 + m2 v2; momentum is conserved in all collisions if net external force is zero", periods: 2 },
    ],
    mc: [
      { m: "action and reaction forces cancel each other out", w: "Students see equal and opposite and think of equilibrium, but cancellation requires both forces on the same object", rq: "A horse pulls a cart forward with 500 N; the cart pulls the horse back with 500 N. Why does the system still accelerate?" },
      { m: "a heavier object falls faster than a lighter one", w: "Aristotle's intuition is reinforced by daily experience where air resistance makes heavy objects fall faster", rq: "A 1 kg and a 10 kg ball are dropped from the same height (no air resistance). Which hits the ground first?" },
      { m: "if an object is moving there must be a net force acting on it", w: "Pre-Newtonian intuition: motion needs a cause; students think force is needed to maintain motion not just to change it", rq: "A hockey puck slides on frictionless ice at constant velocity. What is the net force on it?" },
    ],
    df: [
      { term: "Inertia", ie: "The stubbornness of objects — they resist starting, stopping, or changing direction on their own" },
      { term: "Momentum", ie: "A combined measure of mass and velocity: a heavy fast object has large momentum" },
      { term: "Net Force", ie: "The single resultant force after all individual forces are added as vectors — determines the actual acceleration" },
    ],
  },

  {
    subject: "Physics", id: "ch03", name: "Gravitation",
    cc: [
      "every mass in the universe attracts every other mass — gravitational force is truly universal",
      "gravitational force is proportional to the product of the two masses and inversely proportional to the square of the distance between them",
      "g = GM/R squared links the local gravitational acceleration to Earth mass and radius — g varies by location",
    ],
    st: [
      { name: "Universal Law of Gravitation", keyIdea: "The same force that makes apples fall keeps the Moon in orbit — Newton unified terrestrial and celestial mechanics", periods: 2 },
      { name: "Free Fall and Acceleration due to Gravity", keyIdea: "In F = ma for gravity, mass cancels on both sides — so all objects fall at the same rate regardless of mass", periods: 2 },
      { name: "Mass and Weight", keyIdea: "Mass is fixed regardless of location; weight W = mg depends on where you are — less on Moon, zero in free fall", periods: 2 },
      { name: "Archimedes Principle and Buoyancy", keyIdea: "A ship floats because the weight of water displaced equals the ship weight — buoyant force balances gravity", periods: 2 },
    ],
    mc: [
      { m: "gravity only pulls objects toward Earth", w: "Students experience only Earth gravity directly and overgeneralise to thinking gravity is Earth-specific", rq: "You attract the Earth gravitationally. Why does the Earth not visibly accelerate toward you?" },
      { m: "mass and weight are the same quantity", w: "Everyday language such as I weigh 60 kg conflates mass and weight", rq: "An astronaut has mass 70 kg on Earth. What is her mass on the Moon? What is her weight on the Moon (g Moon = 1.6 m/s squared)?" },
      { m: "a floating object has no weight", w: "Students confuse floating (net force = 0) with weightlessness", rq: "A ship of mass 50000 kg floats. What is its weight? What must the buoyant force equal?" },
    ],
    df: [
      { term: "Gravitational Force", ie: "The invisible pull between every pair of objects — noticeable only when at least one object is very massive" },
      { term: "Universal Gravitational Constant G", ie: "A fixed number that sets the strength of gravity everywhere in the universe" },
      { term: "Acceleration due to Gravity (g)", ie: "How quickly gravity speeds up a falling object — approximately 9.8 metres per second per second on Earth's surface" },
    ],
  },

  {
    subject: "Physics", id: "ch04", name: "Work and Energy",
    cc: [
      "scientific work W = Fs cos(theta): force, displacement, AND the angle between them all matter",
      "zero work is done when force and displacement are perpendicular (theta = 90) or when displacement is zero",
      "kinetic energy KE = half mv squared; work-energy theorem: net work done equals change in KE",
    ],
    st: [
      { name: "Work: Scientific Definition", keyIdea: "A waiter holding a tray horizontally does zero work on it because force (upward) and displacement (forward) are perpendicular", periods: 2 },
      { name: "Kinetic Energy", keyIdea: "Derive KE = half mv squared from the work-energy theorem: work done on an object equals its change in kinetic energy", periods: 2 },
      { name: "Potential Energy", keyIdea: "Gravitational PE = mgh: the work done against gravity to lift the object to height h is stored as potential energy", periods: 2 },
      { name: "Conservation of Energy", keyIdea: "At every point during a fall KE + PE = constant — energy changes form but the total never changes", periods: 2 },
      { name: "Power", keyIdea: "Power = work divided by time; two machines doing the same work in different times have different power", periods: 1 },
    ],
    mc: [
      { m: "a person holding a heavy box without moving does work on the box", w: "Everyday effort (muscles working) is confused with physics work (force times displacement)", rq: "A person holds a 20 kg box at shoulder height for 1 minute without moving. How much physics work is done on the box?" },
      { m: "energy can be created by natural processes such as hydroelectric dams", w: "The phrase generate electricity obscures the fact that energy is converted, not created", rq: "A hydroelectric dam generates electricity. Where does the energy come from originally?" },
      { m: "potential energy is always gravitational", w: "The chapter introduces PE only through height; elastic and other forms appear later", rq: "Where is energy stored in a compressed spring? What kind of PE is this?" },
    ],
    df: [
      { term: "Work (Physics)", ie: "Only the part of force that acts in the direction of motion does work — pushing sideways on a moving object does no work" },
      { term: "Energy", ie: "The capacity to do work — how much work an object could potentially perform" },
      { term: "Kinetic Energy", ie: "Energy due to motion — a moving object can push or lift things because of its speed" },
    ],
  },

  {
    subject: "Physics", id: "ch05", name: "Sound",
    cc: [
      "sound is a mechanical longitudinal wave requiring a material medium — it cannot travel through vacuum",
      "longitudinal wave: particles vibrate parallel to the direction of wave propagation, creating compressions and rarefactions",
      "speed of sound is greatest in solids, intermediate in liquids, and slowest in gases; it increases with temperature",
    ],
    st: [
      { name: "Production and Propagation of Sound", keyIdea: "Sound cannot travel in vacuum — demonstrated by the bell-in-vacuum jar experiment", periods: 2 },
      { name: "Characteristics of Sound Waves", keyIdea: "Pitch corresponds to frequency; loudness corresponds to amplitude; quality (timbre) corresponds to waveform", periods: 2 },
      { name: "Reflection of Sound and Echo", keyIdea: "Distance to reflector = (speed of sound times time) divided by 2, since the sound travels there and back", periods: 2 },
      { name: "Range of Hearing and Ultrasound Applications", keyIdea: "SONAR and medical ultrasound both exploit the echo principle: time the reflected pulse to find distance", periods: 2 },
    ],
    mc: [
      { m: "sound travels faster in air than in water", w: "Students intuitively think a denser medium is harder to push through, so sound must be slower", rq: "Arrange air, water, and steel in order of increasing speed of sound. Explain your reasoning." },
      { m: "a higher frequency sound is a louder sound", w: "Students confuse pitch (frequency) with loudness (amplitude) — two independent properties", rq: "A bat emits high-frequency ultrasound that is barely detectable. Is ultrasound loud? Explain." },
      { m: "sound can travel through vacuum just like light", w: "Both are called waves so students generalise light's properties to sound", rq: "Why is there no sound in outer space but there is still light?" },
    ],
    df: [
      { term: "Longitudinal Wave", ie: "Like pushing and pulling a stretched spring — the compression travels in the same direction as the push" },
      { term: "Compression", ie: "The dense region of a sound wave where particles are bunched together" },
      { term: "Rarefaction", ie: "The sparse region of a sound wave where particles have spread apart" },
    ],
  },

  // ══ Chemistry Class 9 ════════════════════════════════════════════════════

  {
    subject: "Chemistry", id: "ch01", name: "Matter in Our Surroundings",
    cc: [
      "all matter is made of tiny constantly-moving particles — this is the kinetic theory",
      "the state of matter depends on the relative strength of interparticle forces versus particle kinetic energy",
      "temperature is the measure of the average kinetic energy of the particles",
    ],
    st: [
      { name: "States of Matter: Properties and Particle Explanation", keyIdea: "Differences between solid, liquid, and gas explained by interparticle distance and force — not by the substance type", periods: 2 },
      { name: "Interconversion of States and Latent Heat", keyIdea: "Temperature is constant during a phase change — all heat energy goes to breaking interparticle bonds, not raising temperature", periods: 3 },
      { name: "Evaporation", keyIdea: "Evaporation is surface-only, produces no bubbles, and occurs at any temperature — different from boiling", periods: 2 },
      { name: "Plasma: Fourth State of Matter", keyIdea: "Stars and lightning are plasma; matter has four states, not three", periods: 1 },
    ],
    mc: [
      { m: "temperature rises continuously when you heat a substance", w: "Students expect temperature to always climb with heat input; the flat plateau on a heating curve surprises them", rq: "Sketch the temperature-time graph when ice at minus 10 degrees is heated until it becomes steam." },
      { m: "evaporation and boiling are the same process", w: "Both convert liquid to vapour so students treat them as identical", rq: "Water evaporates from a puddle on a hot day at 30 degrees, well below 100. How is this possible?" },
      { m: "gases have no mass because they float upward", w: "Gases are invisible so students confuse invisibility with having no mass", rq: "Inflate a balloon and weigh it. Does it weigh more when inflated? Why?" },
    ],
    df: [
      { term: "Matter", ie: "Everything made of physical stuff that occupies space and has mass — not energy, not information" },
      { term: "Solid", ie: "Fixed shape and fixed volume — particles are tightly packed and vibrate in place" },
      { term: "Liquid", ie: "Takes the shape of its container but has a fixed volume — particles are close but can slide past each other" },
    ],
  },

  {
    subject: "Chemistry", id: "ch02", name: "Is Matter Around Us Pure?",
    cc: [
      "pure substance: fixed composition, sharp melting and boiling points, single substance throughout",
      "mixture: variable composition, no sharp melting point, properties depend on the proportions of components",
      "homogeneous mixture (solution): uniform composition throughout; cannot be separated by simple filtration",
    ],
    st: [
      { name: "Pure Substances and Mixtures", keyIdea: "Salt water melts at below 0 degrees and boils above 100 — impurities shift the melting and boiling points", periods: 2 },
      { name: "Types of Mixtures: Homogeneous and Heterogeneous", keyIdea: "Seawater is homogeneous; soil is heterogeneous; colloids and suspensions sit in between", periods: 2 },
      { name: "Separation Techniques", keyIdea: "Match the technique to the property difference: evaporation for dissolved solids, distillation for different boiling points", periods: 3 },
      { name: "Elements and Compounds", keyIdea: "Water is a compound not a mixture: fixed composition 2:1 hydrogen to oxygen, formed with an energy change", periods: 2 },
    ],
    mc: [
      { m: "air is a pure substance because it looks uniform", w: "Air looks transparent and uniform but its composition varies — it is a mixture of nitrogen, oxygen, and other gases", rq: "Why is air classified as a mixture even though it looks perfectly uniform throughout?" },
      { m: "compounds and mixtures are the same because both contain more than one substance", w: "Students see multiple substances and assume compounds and mixtures are equivalent categories", rq: "Iron and sulfur mixed together versus iron sulfide (a compound) — list three differences between them." },
      { m: "all homogeneous substances are solutions", w: "Students equate homogeneous with solution, ignoring pure substances that are also homogeneous", rq: "Is a piece of pure copper (a single metal) homogeneous? Is it a solution? Explain." },
    ],
    df: [
      { term: "Solution", ie: "A solute dissolved completely in a solvent — salt in water is uniform throughout and cannot be filtered" },
      { term: "Concentration", ie: "The strength of a solution — more dissolved substance per litre means a higher concentration" },
      { term: "Saturated Solution", ie: "A solution holding the maximum amount of dissolved substance at a given temperature — adding more does not dissolve" },
    ],
  },

  {
    subject: "Chemistry", id: "ch03", name: "Atoms and Molecules",
    cc: [
      "laws of chemical combination led to atomic theory: atoms combine in simple fixed whole-number ratios",
      "Dalton's Atomic Theory: atoms of the same element are identical; different elements have different atoms",
      "the mole is the chemist's counting unit: 1 mole = 6.022 times 10 to the 23 entities (Avogadro's number)",
    ],
    st: [
      { name: "Laws of Chemical Combination", keyIdea: "Lavoisier proved mass is conserved; Proust proved fixed composition — Dalton's atoms explained both at once", periods: 2 },
      { name: "Dalton's Atomic Theory and Its Revisions", keyIdea: "The original postulates explain both laws; later science revised them — atoms are divisible and isotopes exist", periods: 2 },
      { name: "Atomic Mass and Symbols", keyIdea: "Atomic mass is relative to carbon-12 = 12 amu — a consistent scale that makes calculations manageable", periods: 2 },
      { name: "Molecules and Chemical Formulae", keyIdea: "Valency is the combining capacity; cross-multiply valencies to write the correct formula for ionic compounds", periods: 2 },
      { name: "Mole Concept and Avogadro's Number", keyIdea: "The mole bridges the invisible world of atoms and the measurable laboratory world of grams and litres", periods: 3 },
    ],
    mc: [
      { m: "one mole always contains 6.022 times 10 to the 23 atoms", w: "Students learn mole = Avogadro number without specifying of which entity — atoms, molecules, ions", rq: "How many atoms are in 1 mole of H2 gas?" },
      { m: "the atomic mass of every element is a whole number", w: "Students see whole numbers for common elements like H=1, O=16 and assume this is always the case", rq: "Why is the atomic mass of chlorine 35.5 and not a whole number?" },
      { m: "valency is always a fixed unchanging number for every element", w: "The introductory treatment gives one valency per element; students do not know some elements have variable valency", rq: "Write the formula for iron(II) oxide and iron(III) oxide. What is the valency of iron in each?" },
    ],
    df: [
      { term: "Atom", ie: "The smallest building block of an element — too small to see, but determines all chemical behaviour" },
      { term: "Molecule", ie: "Two or more atoms bonded together — H2O means two hydrogen atoms and one oxygen atom bonded" },
      { term: "Atomic Mass Unit (amu)", ie: "The tiny standard unit for measuring atomic mass — carbon-12 is defined as exactly 12 amu" },
    ],
  },

  {
    subject: "Chemistry", id: "ch04", name: "Structure of the Atom",
    cc: [
      "the atom has a tiny dense positively charged nucleus surrounded by electrons in energy shells",
      "the number of protons (atomic number Z) determines which element the atom is; neutrons add mass without charge",
      "electrons fill shells in order: 2, 8, 8, 2 (for the first 20 elements) following the 2n squared maximum capacity rule",
    ],
    st: [
      { name: "Thomson's Model and Rutherford's Experiment", keyIdea: "Thomson pictured electrons in a positive dough; Rutherford's gold foil showed most of the atom is empty space with a tiny nucleus", periods: 2 },
      { name: "Bohr's Model: Shells and Energy Levels", keyIdea: "Electrons occupy fixed energy shells; Bohr's model explains why hydrogen emits specific colours of light", periods: 2 },
      { name: "Atomic Number, Mass Number, Isotopes, and Isobars", keyIdea: "Cl-35 and Cl-37 are isotopes — same element, different neutrons — which explains the average atomic mass of 35.5", periods: 2 },
      { name: "Electronic Configuration and Valency", keyIdea: "The number of electrons in the outermost shell determines valency and all chemical behaviour — the basis of the periodic table", periods: 2 },
      { name: "Valence Electrons and Chemical Reactivity", keyIdea: "Elements with full outer shells (noble gases) are unreactive; others react to complete their outer shells", periods: 2 },
    ],
    mc: [
      { m: "electrons orbit the nucleus in fixed circular paths like planets around the Sun", w: "Visual diagrams of atomic models show neat circular orbits; Bohr's model itself uses circular orbits", rq: "Why is Bohr's model called a model? In what ways is it known to be inaccurate?" },
      { m: "an atom with more protons must have more neutrons", w: "Students assume protons and neutrons always pair up in equal numbers", rq: "How many neutrons does Na-23 have? How many does Na-24 have? What makes them different atoms?" },
      { m: "atomic mass is always a whole number", w: "Mass number (protons + neutrons) is always a whole number, but atomic mass is an average across isotopes", rq: "Chlorine exists as Cl-35 (75%) and Cl-37 (25%). Calculate the average atomic mass of chlorine." },
    ],
    df: [
      { term: "Proton", ie: "The positively charged particle inside the nucleus — the count of protons identifies which element it is" },
      { term: "Neutron", ie: "Adds mass to the nucleus without adding charge — different isotopes of an element differ in neutron count" },
      { term: "Electron", ie: "Tiny negatively charged particles that surround the nucleus — they control all chemical bonding and reactions" },
    ],
  },

];

// ─── Chapter matching ─────────────────────────────────────────────────────────

function tokenise(text: string): Set<string> {
  return new Set(
    text.toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(t => t.length >= 3),
  );
}

/** Score a chapter against the question. Higher score = better topical match. */
function scoreChapter(ch: Chapter, qTokens: Set<string>): number {
  let score = 0;
  for (const tok of tokenise(ch.name))          { if (qTokens.has(tok)) score += 4; }
  for (const cc of ch.cc)
    for (const tok of tokenise(cc))             { if (qTokens.has(tok)) score += 1; }
  for (const st of ch.st)
    for (const tok of tokenise(st.name))        { if (qTokens.has(tok)) score += 2; }
  for (const st of ch.st)
    for (const tok of tokenise(st.keyIdea))     { if (qTokens.has(tok)) score += 1; }
  return score;
}

function matchChapter(subject: string, question: string): Chapter | null {
  const qTokens = tokenise(question);
  let best: Chapter | null = null;
  let bestScore = 2; // minimum threshold — score 1 from coincidental words is noise

  for (const ch of REGISTRY) {
    if (ch.subject !== subject) continue;
    const score = scoreChapter(ch, qTokens);
    if (score > bestScore) { bestScore = score; best = ch; }
  }
  return best;
}

// ─── Blueprint construction ───────────────────────────────────────────────────

function cogLoad(periods: number): "low" | "medium" | "high" {
  return periods >= 3 ? "high" : periods >= 2 ? "medium" : "low";
}

function buildConcept(
  st:    St,
  mc:    Mc[],
  df:    Df[],
  stIdx: number,
): ConceptBlueprint {
  const misconception  = mc[stIdx % Math.max(mc.length, 1)];
  const misconception2 = mc[(stIdx + 1) % Math.max(mc.length, 1)];
  const def = df[stIdx % Math.max(df.length, 1)];

  const analogy = def
    ? `Think of "${def.term}" like this: ${def.ie}.`
    : "";

  const confusions: string[] = [];
  if (misconception) {
    confusions.push(
      `A student might think: "${misconception.m}" — the reason this happens is: ${misconception.w}.`,
    );
  }
  if (misconception2 && misconception2.m !== misconception?.m) {
    confusions.push(
      `Another common confusion: "${misconception2.m}" — ${misconception2.w}.`,
    );
  }

  return {
    concept:       st.name,
    cognitiveLoad: cogLoad(st.periods),
    confusions,
    analogy,
    checkpoint:    misconception?.rq ?? "",
    teachingNote:  `Start by explaining: ${st.keyIdea}`,
  };
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Build a TeachingBlueprint deterministically from the academic knowledge registry.
 * Returns null when no chapter matches (caller treats this as empty blueprint).
 */
export function buildBlueprintFromAssets(
  subject:  string,
  question: string,
): TeachingBlueprint | null {
  const ch = matchChapter(subject, question);
  if (!ch) return null;

  const qTokens = tokenise(question);

  // Prefer subtopics whose name tokens appear in the question; fall back to first 4.
  const relevant = ch.st.filter(st =>
    [...tokenise(st.name)].some(tok => qTokens.has(tok)),
  );
  const selected = relevant.length > 0
    ? relevant.slice(0, 4)
    : ch.st.slice(0, Math.min(4, ch.st.length));

  const conceptOrder: ConceptBlueprint[] = selected.map((st, i) =>
    buildConcept(st, ch.mc, ch.df, i),
  );

  const teachingApproach = ch.cc.slice(0, 2).join(" Furthermore, ");

  const highLoad = selected.filter(st => st.periods >= 3);
  const pacingNotes: string[] = highLoad.map(st =>
    `"${st.name}" is high cognitive load (${st.periods} teaching periods). Slow down here — add a breathing moment before moving to the next concept.`,
  );

  const dialogueTips: string[] = ch.mc.slice(0, 2).map(mc =>
    `When students reach: "${mc.m}" — explain: ${mc.w}. Confirm understanding by asking: "${mc.rq}"`,
  );

  return { conceptOrder, teachingApproach, pacingNotes, dialogueTips };
}
