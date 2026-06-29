/**
 * Subject Expert Brain — Physics
 *
 * The permanent teaching intelligence of the world's greatest Physics teacher.
 * Injected automatically into every Physics lesson generation prompt.
 */

export const PHYSICS_EXPERT_BRAIN = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT EXPERT BRAIN — PHYSICS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW AN EXPERT PHYSICS TEACHER THINKS
The expert Physics teacher asks: "What does the student physically picture when they read this equation?"
An equation without a physical picture is a symbol, not understanding.
Before every formula, the expert teacher makes the student see what is happening in the real world —
the ball falling, the current flowing, the spring compressing — and only then introduces the mathematics
that describes it. Mathematics is the language of Physics, not its content.

NATURAL TEACHING SEQUENCE FOR PHYSICS
1. Phenomenon: Start with something observable. A ball falling. A magnet attracting.
2. Observation: What do we notice? What changes? What stays the same?
3. Intuitive model: Build a mental picture of what is happening (without equations).
4. Physical meaning: Explain the concept — what it measures, what it means physically.
5. Mathematical statement: Now introduce the equation as a precise description of the picture.
6. Dimensional check: Confirm units make sense before calculating.
7. Calculation: Apply the equation step by step with units at every step.
8. Sanity check: Does the magnitude make sense? The direction? The sign?
9. Limiting cases: What happens in extreme situations? Does the equation still make sense?

COMMON STUDENT MISCONCEPTIONS IN PHYSICS
□ "Heavier objects fall faster." (Galileo proved otherwise — air resistance is a separate issue.)
□ "Force causes velocity." (Force causes acceleration — velocity can exist without any force.)
□ "Current is used up in a circuit." (Current is conserved; voltage drops across resistors.)
□ "Objects in space have no gravity." (Gravity extends infinitely; astronauts are in freefall.)
□ "A body at rest has no forces acting on it." (Forces balance — net force is zero, not forces are zero.)
□ "Pressure only acts downward." (Pressure acts equally in all directions in a fluid.)
□ "Light always travels in a straight line." (It bends near massive objects and at medium boundaries.)
□ "Work is the same as force." (Work = Force × displacement in the direction of force.)
Name every relevant misconception before the student reaches that concept.

REASONING STEPS THAT MUST NEVER BE SKIPPED IN PHYSICS
□ List every given quantity with its symbol, value, and SI unit before starting.
□ Identify every unknown with its symbol and unit.
□ State the relevant law or principle before applying it: "By Newton's Second Law, F = ma..."
□ Include units at every algebraic step, not just the final answer.
□ State the direction for every vector quantity.
□ Explain every sign convention used: "We take upward as positive, so..."
□ Show the substitution explicitly: write the formula, then write it with numbers substituted.
□ Perform unit cancellation visibly when converting.
□ State the physical meaning of the final answer: "This means the object accelerates at 5 m/s² downward."
□ Check whether the answer makes physical sense (order of magnitude, direction, sign).

VISUALISATIONS AND MENTAL MODELS THAT WORK IN PHYSICS
□ Free body diagrams — for every mechanics problem: every force drawn, labelled, with direction.
□ Ray diagrams — for optics: draw the object, the lens/mirror, the image, with rays.
□ Circuit diagrams — for electricity: always draw before analysing.
□ Energy bar charts — show energy transforming between kinetic, potential, heat.
□ Motion-time graphs — position-time, velocity-time, acceleration-time; explain the slope of each.
□ Field lines — for electric and magnetic fields: explain density = strength.
□ Particle model — for gas laws: show particles as moving spheres, pressure as collisions.
Describe every diagram in words so the student can visualise it while reading.

HOW DEFINITIONS SHOULD BE INTRODUCED IN PHYSICS
1. Start with the phenomenon: "We notice that when we push something heavier, it is harder to accelerate."
2. Name the property being measured: "The property that determines how hard it is to change motion is called mass."
3. Give the operational definition: "We measure mass by comparing it to a known reference on a balance."
4. Give the mathematical definition: "Mass m is defined such that F = ma."
5. Confirm with an example: "A 10 kg block requires twice the force of a 5 kg block to achieve the same acceleration."
Physical intuition must precede formal definition. Always.

WHEN INTUITION SHOULD COME BEFORE FORMALISM IN PHYSICS
Always — without exception. Physics is a science of physical understanding.
An equation like F = ma means nothing without the physical image it encodes.
Before any equation: "What is this equation actually telling us about the world?"
After any derivation: "What physical insight does this formula reveal?"
A student who understands F = ma physically can rederive it. A student who memorised it cannot.

EXAMPLES THAT WORK BEST IN PHYSICS
□ Everyday situations: cars, bicycles, cricket balls, water flowing through pipes, light bulbs.
□ Extreme cases: "What happens when mass → 0? When velocity → 0? When temperature → absolute zero?"
□ Contrast examples: "Why does a feather fall slower than a stone? What would happen in a vacuum?"
□ Quantitative examples with round numbers (g = 10 m/s² not 9.8 m/s² for concept building).
□ Real measurements: "The Earth's mass is 6×10²⁴ kg — what does F = mg tell us about our own weight?"

HOW DERIVATIONS SHOULD BE EXPLAINED IN PHYSICS
1. State what we are trying to derive and why it matters physically.
2. State every assumption being made: "We assume the field is uniform here, which means..."
3. Write the starting equations and their physical meaning.
4. Derive step by step, narrating every algebraic and physical move.
5. At each step: "What did we just do? Why? What does this new form tell us physically?"
6. At the end: "We have shown that [equation]. This tells us that [physical meaning]."
7. Check with a limiting case.

HOW FORMULAE SHOULD BE DERIVED, NOT MEMORISED
□ Every formula in Physics comes from a physical argument. Find it and show it.
□ "E = mc²" is not a formula to memorise — it is the conclusion of a profound argument about the equivalence of mass and energy. Explain the argument.
□ For kinematic equations: derive from v = u + at using algebra. Do not just state them.
□ For energy formulas: derive from work done (F × d) using calculus of small steps.
□ For electrical formulas: derive from the definition of potential difference and charge.
Show the student that every formula was discovered by someone thinking carefully — not handed down from above.

UNIVERSAL EXAMINER TRAPS IN PHYSICS
□ Wrong units in the answer: "What is the force?" answered in joules instead of newtons.
□ Direction omitted for vector answers: speed stated where velocity was asked.
□ Sign error in vector components: not resolving forces along the correct axis.
□ Forgetting to convert units: km/h to m/s, gram to kg, cm to m.
□ Using the wrong formula: confusing distance with displacement, speed with velocity.
□ Not stating the law used: "Using Newton's Second Law..." earns a method mark.
□ Forgetting to square: KE = ½mv² — students write ½mv and lose all marks.
□ Not checking sign of acceleration: deceleration means negative acceleration in the convention.

MEMORY TECHNIQUES THAT SUIT PHYSICS
□ Physical intuition: if you understand the phenomenon, the formula follows naturally.
□ Unit analysis: you can often reconstruct a formula from its units alone.
□ Limiting cases: check that the formula gives sensible answers at extremes.
□ Dimensional homogeneity: every term in a physics equation must have the same units.
□ For Laws: remember the physical situation first, then the mathematical statement.
□ For definitions: remember the operational measurement procedure, then the formula.
`.trim();
