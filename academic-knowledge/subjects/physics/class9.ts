/**
 * Academic Knowledge — Physics, Class 9
 * 5 NCERT chapters. Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

export const MOTION: ChapterKnowledge = {
  chapterId: "ch01", chapterName: "Motion", classNum: 9, subject: "Physics", board: "Both",

  learningObjectives: [
    { statement: "Distinguish between distance and displacement with examples", bloomsLevel: "understand", assessable: true },
    { statement: "Calculate speed, velocity, and acceleration from given data", bloomsLevel: "apply", assessable: true },
    { statement: "Apply the three equations of motion for uniform acceleration", bloomsLevel: "apply", assessable: true },
    { statement: "Interpret distance-time and velocity-time graphs to extract physical information", bloomsLevel: "analyse", assessable: true },
    { statement: "Derive the equations of motion graphically from a velocity-time graph", bloomsLevel: "evaluate", assessable: true },
    { statement: "Calculate displacement from the area under a velocity-time graph", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Calculate how long a car takes to stop from a given speed with given deceleration — student must identify which equation applies" },
    { ruleCode: "NEP-REPR", application: "Represent the same motion in three forms: verbal description, data table, and velocity-time graph" },
    { ruleCode: "NEP-HOT", application: "Interpret an unusual v-t graph (acceleration changes sign) and describe the journey it represents" },
    { ruleCode: "NEP-IDC", application: "Record motion of a marble on an incline; compute acceleration from distance-time data" },
  ],

  cbseOutcomes: [
    "Student correctly defines and distinguishes distance, displacement, speed, velocity, and acceleration",
    "Student applies equations v=u+at, s=ut+½at², v²=u²+2as to solve numerical problems",
    "Student draws and interprets distance-time and velocity-time graphs",
    "Student derives the equations of motion graphically",
    "Student computes the area under a v-t graph to find displacement",
  ],

  icseOutcomes: [
    "ICSE expects: derivation of all three equations of motion algebraically (not just graphically)",
    "ICSE tests: relative velocity and its application to problems of boats in rivers, aircraft in wind",
  ],

  coreConcepts: [
    "Motion is relative — always described with respect to a reference point",
    "Distance is path length (scalar); displacement is shortest distance with direction (vector)",
    "Speed is magnitude of velocity; velocity includes direction — they are different quantities",
    "Acceleration is rate of change of velocity; it can be negative (deceleration/retardation)",
    "Uniform acceleration: constant rate of change of velocity — the three equations apply only here",
    "Area under v-t graph = displacement; slope of v-t graph = acceleration; slope of d-t graph = velocity",
  ],

  subtopics: [
    { id: "t1", name: "Distance, Displacement, Speed, and Velocity", coreConcept: "Distance and speed are scalars; displacement and velocity are vectors", keyIdea: "A person walking in a circle returns to start: displacement=0, distance>0", estimatedPeriods: 2 },
    { id: "t2", name: "Acceleration", coreConcept: "Acceleration = change in velocity / time; can be positive, negative, or zero", keyIdea: "Braking car has negative acceleration (deceleration); circular motion has centripetal acceleration", estimatedPeriods: 2 },
    { id: "t3", name: "Equations of Uniformly Accelerated Motion", coreConcept: "Three equations: v=u+at; s=ut+½at²; v²=u²+2as — valid only for constant acceleration", keyIdea: "These three equations can solve any uniform acceleration problem; identify which two unknowns to eliminate", estimatedPeriods: 3 },
    { id: "t4", name: "Graphical Analysis of Motion", coreConcept: "d-t graph: slope = velocity; v-t graph: slope = acceleration, area = displacement", keyIdea: "Graphs carry more information than numbers — shape encodes type of motion", estimatedPeriods: 3 },
  ],

  conceptGraph: [
    { from: "phy:9:ch01:distance-vs-displacement", to: "phy:9:ch01:speed-vs-velocity", relationship: "generalises", explanation: "Velocity is displacement per time; speed is distance per time — the distinction mirrors distance vs displacement" },
    { from: "phy:9:ch01:velocity-definition", to: "phy:9:ch01:acceleration-definition", relationship: "requires", explanation: "Acceleration is defined as change in velocity; student must be clear on velocity first" },
    { from: "phy:9:ch01:acceleration-definition", to: "phy:9:ch01:equations-of-motion", relationship: "applies", explanation: "The three equations are derived by integrating constant acceleration — graphically via the v-t graph" },
    { from: "phy:9:ch01:velocity-time-graph", to: "phy:9:ch01:equations-of-motion-graphical-derivation", relationship: "applies", explanation: "Each equation is a geometric relationship in the v-t graph" },
    { from: "phy:9:ch01:area-under-vt-graph", to: "phy:9:ch02:impulse-momentum", relationship: "generalises", explanation: "Area under F-t graph = impulse = change in momentum — same technique extends to Chapter 2" },
  ],

  prerequisites: {
    chapters: [{ subject: "Mathematics", classNum: 9, chapterId: "ch03", chapterName: "Coordinate Geometry", requiredConcepts: ["mth:9:ch03:cartesian-plane"] }],
    concepts: ["mth:7:ch02:speed-formula", "mth:9:ch03:ordered-pair-notation"],
  },

  essentialDefinitions: [
    { term: "Distance", formalDefinition: "The total path length covered by an object during its motion; a scalar quantity", informalExplanation: "How far you actually walked — following every turn of the path", counterExample: "If you walk around a 400m track once, distance = 400m but displacement = 0m" },
    { term: "Displacement", formalDefinition: "The shortest distance between the initial and final positions, with direction; a vector quantity", informalExplanation: "The straight-line gap between where you started and where you ended up, with a direction arrow" },
    { term: "Uniform Velocity", formalDefinition: "Motion with constant speed in a fixed direction; both magnitude and direction of velocity remain unchanged", informalExplanation: "Constant velocity requires both constant speed AND constant direction — circular motion at constant speed is NOT uniform velocity", counterExample: "A car moving at 60 km/h on a curved road has constant speed but changing direction — not uniform velocity" },
    { term: "Acceleration", formalDefinition: "The rate of change of velocity with time; a = (v − u) / t; SI unit: m/s²", informalExplanation: "How quickly velocity is changing — can be speeding up, slowing down, or changing direction" },
    { term: "Uniform Acceleration", formalDefinition: "Motion in which velocity changes by equal amounts in equal intervals of time", informalExplanation: "The speedometer reading changes at a constant rate — like a freely falling body near Earth's surface" },
    { term: "Retardation (Deceleration)", formalDefinition: "Negative acceleration — when the magnitude of velocity decreases over time", informalExplanation: "Slowing down; acceleration is in the opposite direction to velocity" },
  ],

  formulaInventory: [
    { name: "First Equation of Motion", latex: "v = u + at", plainText: "v = u + at", variables: [{ symbol: "u", meaning: "initial velocity (m/s)" }, { symbol: "v", meaning: "final velocity (m/s)" }, { symbol: "a", meaning: "acceleration (m/s²)" }, { symbol: "t", meaning: "time (s)" }], derivedFrom: "Definition of acceleration: a = (v−u)/t rearranged", applicableWhen: "Uniform (constant) acceleration only", doesNotApplyWhen: "Non-uniform acceleration; do not use when acceleration changes with time", examTip: "Use when s (displacement) is not required and t is given or needed" },
    { name: "Second Equation of Motion", latex: "s = ut + \\frac{1}{2}at^2", plainText: "s = ut + ½at²", variables: [{ symbol: "s", meaning: "displacement (m)" }, { symbol: "u", meaning: "initial velocity (m/s)" }, { symbol: "t", meaning: "time (s)" }, { symbol: "a", meaning: "acceleration (m/s²)" }], derivedFrom: "Area under v-t graph (trapezium/rectangle + triangle decomposition)", applicableWhen: "Uniform acceleration; when v is not required", doesNotApplyWhen: "The ½ disappears if u = 0; do not forget the ½ otherwise", examTip: "Use when final velocity v is unknown or not needed; take care with sign of a for deceleration" },
    { name: "Third Equation of Motion", latex: "v^2 = u^2 + 2as", plainText: "v² = u² + 2as", variables: [{ symbol: "v", meaning: "final velocity (m/s)" }, { symbol: "u", meaning: "initial velocity (m/s)" }, { symbol: "a", meaning: "acceleration (m/s²)" }, { symbol: "s", meaning: "displacement (m)" }], derivedFrom: "Eliminate t from the first two equations", applicableWhen: "Uniform acceleration; when t is not given and not needed", doesNotApplyWhen: "If t is given, use first or second equation instead", examTip: "Most useful when time is neither given nor asked; stopping distance problems" },
    { name: "Average Velocity (uniform acceleration)", latex: "\\bar{v} = \\frac{u + v}{2}", plainText: "Average velocity = (u + v)/2", variables: [], applicableWhen: "ONLY for uniform acceleration — not for general average velocity", doesNotApplyWhen: "Average velocity in general = total displacement / total time, which is NOT (u+v)/2 for non-uniform acceleration", examTip: "This formula is only valid for constant acceleration; the general formula uses displacement/time" },
  ],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Speed and velocity are the same thing", correction: "Speed is a scalar (magnitude only); velocity is a vector (magnitude + direction). A car going around a bend at constant speed has changing velocity.", whyItHappens: "Everyday language uses 'speed' and 'velocity' interchangeably", revealingQuestion: "A car travels around a circular track at 60 km/h. Is its velocity constant? Explain." },
    { misconception: "An object with zero velocity must have zero acceleration", correction: "A ball thrown upward has zero velocity at the peak but acceleration = g = 10 m/s² (downward) throughout", whyItHappens: "Conflating 'not moving' with 'no force'", revealingQuestion: "A ball is thrown straight up. What is its velocity at the highest point? What is its acceleration at the highest point?" },
    { misconception: "Negative acceleration always means slowing down", correction: "Negative acceleration means acceleration is in the negative direction. If the object is also moving in the negative direction, it is speeding up.", whyItHappens: "Students associate negative with 'less of' rather than 'opposite direction'", revealingQuestion: "A car moving in reverse speeds up. Is its acceleration positive or negative? Is it decelerating?" },
    { misconception: "The area under a distance-time graph gives velocity", correction: "The SLOPE of a d-t graph gives velocity. The AREA under a v-t graph gives displacement.", whyItHappens: "Confusing graph relationships between the two graph types", revealingQuestion: "What does the area under a velocity-time graph represent?" },
  ],

  examinerTraps: [
    { trap: "Not converting units before substituting", typicalScenario: "Speed given in km/h; substituting into v=u+at where u should be in m/s", avoidanceStrategy: "First step in every numerical: identify units and convert all to SI (m, s, m/s, m/s²). Write the conversion explicitly.", marksAtRisk: "Full numerical marks" },
    { trap: "Using v = u + at when s is given and t is not needed — third equation is faster", typicalScenario: "Student solves a 3-step problem instead of 1-step because they always use first equation", avoidanceStrategy: "Check what is given and what is asked before choosing equation. Third equation directly gives v² if s and a are known.", marksAtRisk: "No marks lost, but extra steps increase chance of arithmetic error" },
    { trap: "Taking deceleration as positive", typicalScenario: "'A car decelerates at 5 m/s²' — student substitutes a = +5 instead of a = −5", avoidanceStrategy: "Deceleration means acceleration opposite to motion. Take motion direction as positive; a = −5 m/s² for deceleration.", marksAtRisk: "Completely wrong answer from this sign error" },
    { trap: "Confusing distance and displacement in graph reading", typicalScenario: "Reading area under d-t graph as displacement instead of using area under v-t graph", avoidanceStrategy: "Area under v-t graph = displacement. Slope of d-t graph = velocity. Memorise these precisely.", marksAtRisk: "1–2 marks for wrong graph interpretation" },
  ],

  typicalMistakes: [
    { mistake: "s = v²/2a instead of v² = u² + 2as (when u = 0)", correction: "If u = 0: v² = 2as → s = v²/(2a). The formula is v² = u² + 2as; set u=0 correctly", conceptualError: "Misremembering the third equation when initial velocity is zero" },
    { mistake: "Using average speed = (total distance)/(total time) incorrectly with (v+u)/2", correction: "(v+u)/2 gives average velocity ONLY for uniform acceleration; general average uses distance/time", conceptualError: "Applying the uniform acceleration average to non-uniform motion" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["A car starts from rest and travels 100m in 10s. Find its final velocity and acceleration.", "Derive the third equation of motion from the first two by eliminating t."] },
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["A v-t graph shows a line from (0, 20) to (5, 0). Describe the motion and find the stopping distance.", "Sketch the d-t graph for a uniformly decelerating object that stops and reverses direction."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Distance vs displacement with examples", tier: "foundational", teachingNote: "Use a map: walk from home to school via different routes — same displacement, different distances" },
    { step: 2, concept: "Speed vs velocity: scalar vs vector distinction", tier: "easy", dependsOnStep: 1, teachingNote: "Speedometer gives speed; GPS gives velocity (speed + direction)" },
    { step: 3, concept: "Acceleration: definition, unit, direction", tier: "easy", dependsOnStep: 2, teachingNote: "Concrete examples: a car speeding up (+a), braking (−a), turning (changing direction)" },
    { step: 4, concept: "Equations of motion: first equation", tier: "medium", dependsOnStep: 3, teachingNote: "Derive from definition of acceleration; then practice direct application" },
    { step: 5, concept: "Second and third equations of motion", tier: "medium", dependsOnStep: 4, teachingNote: "Derive second from area under v-t graph; derive third by eliminating t from first two" },
    { step: 6, concept: "Choosing the right equation for a given problem", tier: "medium", dependsOnStep: 5, teachingNote: "Identify: what is given? What is unknown? Which equation has exactly those variables?" },
    { step: 7, concept: "Drawing and interpreting d-t graphs", tier: "medium", dependsOnStep: 2, teachingNote: "Slope = velocity; horizontal line = rest; steeper = faster" },
    { step: 8, concept: "Drawing and interpreting v-t graphs: slope, area", tier: "hard", dependsOnStep: 6, teachingNote: "Slope = acceleration; area = displacement; connect to equations of motion graphically" },
    { step: 9, concept: "Complex motion: object changes direction; interpreting unusual graphs", tier: "hard", dependsOnStep: 8, teachingNote: "Object goes forward, stops, reverses — d-t graph has a peak; v-t graph crosses x-axis" },
  ],

  realLifeApplications: [
    { context: "Braking distance of a car", conceptUsed: "Third equation of motion: v² = u² + 2as", explanation: "When brakes are applied, final velocity = 0. s = −u²/(2a) gives stopping distance. Doubling speed quadruples stopping distance.", ageRelevance: "Road safety; directly relevant to learner drivers" },
    { context: "Freely falling objects (dropped phone)", conceptUsed: "Uniform acceleration under gravity: a = g ≈ 10 m/s²", explanation: "A dropped phone accelerates at 10 m/s². The three equations compute time to hit the ground and impact speed.", ageRelevance: "Relatable — students have dropped phones" },
    { context: "Train deceleration approaching a station", conceptUsed: "Deceleration; first and third equations of motion", explanation: "Train driver must begin braking far enough in advance. The stopping distance depends on speed and deceleration rate.", ageRelevance: "Every student has been on a bus or train" },
  ],

  crossChapterLinks: [
    { subject: "Physics", classNum: 9, chapterId: "ch02", chapterName: "Force and Laws of Motion", linkType: "prerequisite-for", description: "Newton's Second Law F=ma connects force to the acceleration studied here" },
    { subject: "Mathematics", classNum: 9, chapterId: "ch12", chapterName: "Statistics", linkType: "parallel-concept", description: "Velocity-time graphs use the same Cartesian plotting technique as statistics graphs" },
  ],

  crossSubjectLinks: [
    { subject: "Mathematics", topic: "Linear equations and graphs", description: "Equations of motion are linear in v or s; v-t graphs are straight lines for uniform acceleration", strength: "strong" },
    { subject: "Computer Science", topic: "Game physics engines", description: "All motion in games uses the same equations: position += velocity × dt; velocity += acceleration × dt", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Activity: walk from one end of the room to the other via different paths — measure distance and displacement", duration: "10 minutes", pedagogyNote: "NEP-IDC: physical activity makes distance/displacement distinction concrete" },
    { step: 2, action: "Define speed and velocity; introduce the scalar/vector distinction formally", duration: "15 minutes", pedagogyNote: "Speedometer vs compass — speed without direction, then speed with direction" },
    { step: 3, action: "Derive first equation from definition of acceleration; practice 3 examples", duration: "20 minutes", pedagogyNote: "Write: a = (v−u)/t → v = u + at. This is algebra, not a magic formula." },
    { step: 4, action: "Draw a v-t graph for uniform acceleration; derive second equation from area (trapezium)", duration: "25 minutes", pedagogyNote: "NEP-PROB: given the v-t graph, what is the area of the trapezium? Students derive s = ut + ½at² themselves" },
    { step: 5, action: "Derive third equation algebraically; practice choosing equations for given scenarios", duration: "20 minutes", pedagogyNote: "Decision tree: what is given? What is unknown? → which equation?" },
    { step: 6, action: "Draw and interpret various d-t and v-t graphs: static, uniform, accelerating, decelerating", duration: "25 minutes", pedagogyNote: "NEP-HOT: give a complex v-t graph; students describe the journey in words — not just compute numbers" },
    { step: 7, action: "Board numericals: braking distance, projectile motion (horizontal only), train stopping", duration: "30 minutes", pedagogyNote: "Always: identify given, unknown, equation; substitute; compute; check units" },
  ],
};

export const FORCE_AND_LAWS_OF_MOTION: ChapterKnowledge = {
  chapterId: "ch02", chapterName: "Force and Laws of Motion", classNum: 9, subject: "Physics", board: "Both",

  learningObjectives: [
    { statement: "State and explain Newton's three laws of motion with examples", bloomsLevel: "understand", assessable: true },
    { statement: "Define momentum and calculate it for given mass and velocity", bloomsLevel: "apply", assessable: true },
    { statement: "Apply Newton's Second Law F=ma to calculate force, mass, or acceleration", bloomsLevel: "apply", assessable: true },
    { statement: "State and apply the law of conservation of momentum", bloomsLevel: "apply", assessable: true },
    { statement: "Prove conservation of momentum from Newton's Third Law", bloomsLevel: "evaluate", assessable: true },
    { statement: "Analyse action-reaction force pairs in everyday situations", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Given a collision scenario, find an unknown velocity using momentum conservation — choose the law without being told" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'A horse cannot pull a cart because the cart pulls the horse equally' — why is this wrong?" },
    { ruleCode: "NEP-REFL", application: "Reflect on what 'natural state of motion' meant before Newton vs. after Newton" },
    { ruleCode: "NEP-ETH", application: "Seatbelts and airbags: discuss how Newton's first law explains why they save lives" },
  ],

  cbseOutcomes: [
    "Student states Newton's three laws and gives real-life examples for each",
    "Student defines momentum and calculates it; relates momentum change to force and time",
    "Student applies F=ma to solve numerical problems with correct units (N = kg·m/s²)",
    "Student states conservation of momentum and applies it to collision problems",
    "Student derives conservation of momentum from Newton's Third Law",
  ],

  icseOutcomes: [
    "ICSE additionally expects: proof that F=ma is consistent with Newton's second law formulation as rate of change of momentum",
    "ICSE tests: problems on rocket propulsion and gun recoil using momentum conservation",
  ],

  coreConcepts: [
    "Inertia is the tendency of objects to resist change in their state of motion — mass measures inertia",
    "Force causes acceleration: F = ma (Newton's Second Law in the simplest form)",
    "Momentum p = mv measures 'quantity of motion'; it is a vector",
    "Newton's Third Law: every force has an equal and opposite reaction force — always on different objects",
    "In an isolated system, total momentum is conserved — Newton's Third Law implies this",
    "Newton's First Law is a special case of the Second Law (when F = 0, a = 0 so v = constant)",
  ],

  subtopics: [
    { id: "t1", name: "Newton's First Law — Inertia", coreConcept: "Objects resist change in motion; inertia is the measure of this resistance", keyIdea: "Galileo discovered this; Newton formalised it. Before Newton, the 'natural state' was rest.", estimatedPeriods: 2 },
    { id: "t2", name: "Newton's Second Law — F = ma", coreConcept: "Net force produces acceleration; F = rate of change of momentum = ma for constant mass", keyIdea: "The force is the NET force; direction of acceleration matches direction of net force", estimatedPeriods: 3 },
    { id: "t3", name: "Newton's Third Law — Action and Reaction", coreConcept: "Every action has an equal, opposite reaction — always acting on DIFFERENT objects", keyIdea: "Action and reaction never cancel — they act on different bodies so cannot cancel", estimatedPeriods: 2 },
    { id: "t4", name: "Law of Conservation of Momentum", coreConcept: "Total momentum of an isolated system is conserved; proved from Newton's Third Law", keyIdea: "Before collision: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂ after collision", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "phy:9:ch01:acceleration-definition", to: "phy:9:ch02:newton-second-law", relationship: "applies", explanation: "Newton's Second Law: F = ma directly uses acceleration from Chapter 1" },
    { from: "phy:9:ch02:inertia-definition", to: "phy:9:ch02:momentum-definition", relationship: "applies", explanation: "Momentum p = mv; mass m is the measure of inertia; higher mass = greater resistance to velocity change" },
    { from: "phy:9:ch02:action-reaction-pairs", to: "phy:9:ch02:momentum-conservation-derivation", relationship: "applies", explanation: "Third Law gives F₁₂ = −F₂₁; applied over same time interval, Δp₁ = −Δp₂, proving conservation" },
    { from: "phy:9:ch02:momentum-conservation-derivation", to: "phy:9:ch03:rocket-propulsion-analogy", relationship: "applies", explanation: "Rocket expels gas backward (reaction); moves forward (action) — momentum conservation explains thrust" },
  ],

  prerequisites: {
    chapters: [{ subject: "Physics", classNum: 9, chapterId: "ch01", chapterName: "Motion", requiredConcepts: ["phy:9:ch01:acceleration-definition", "phy:9:ch01:velocity-definition"] }],
    concepts: ["phy:9:ch01:acceleration-definition", "phy:9:ch01:speed-vs-velocity"],
  },

  essentialDefinitions: [
    { term: "Inertia", formalDefinition: "The property of an object by which it resists any change in its state of rest or uniform motion", informalExplanation: "The 'laziness' of objects — they don't want to start, stop, or change direction on their own" },
    { term: "Momentum", formalDefinition: "The product of mass and velocity of an object; p = mv; SI unit: kg·m/s; a vector quantity", informalExplanation: "A measure of 'how much motion' an object has — heavy AND fast = large momentum" },
    { term: "Net Force", formalDefinition: "The vector sum of all forces acting on an object", informalExplanation: "The combined push or pull that actually determines motion — multiple forces may cancel, giving zero net force" },
    { term: "Newton (N)", formalDefinition: "The SI unit of force; 1 N is the force that gives a 1 kg mass an acceleration of 1 m/s²", informalExplanation: "1 Newton is roughly the force of gravity on a 100g apple" },
    { term: "Impulse", formalDefinition: "The product of force and the time interval for which it acts; Impulse = F × t = change in momentum", informalExplanation: "A large force for a short time or a small force for a long time — the product is the same impulse" },
    { term: "Isolated System", formalDefinition: "A system on which no net external force acts", informalExplanation: "The objects in the system interact with each other but not with anything outside — momentum is conserved" },
  ],

  formulaInventory: [
    { name: "Momentum", latex: "p = mv", plainText: "p = mv", variables: [{ symbol: "p", meaning: "momentum (kg·m/s)" }, { symbol: "m", meaning: "mass (kg)" }, { symbol: "v", meaning: "velocity (m/s)" }], applicableWhen: "Any moving object with mass m and velocity v", doesNotApplyWhen: "Relativistic objects (near speed of light) need relativistic momentum formula" },
    { name: "Newton's Second Law", latex: "F = ma = \\frac{\\Delta p}{\\Delta t} = \\frac{m(v-u)}{t}", plainText: "F = ma = Δp/Δt", variables: [{ symbol: "F", meaning: "net force (N)" }, { symbol: "m", meaning: "mass (kg)" }, { symbol: "a", meaning: "acceleration (m/s²)" }], applicableWhen: "Constant mass; net force determines acceleration", doesNotApplyWhen: "Variable mass systems (rocket losing fuel) require the full F = dp/dt form", examTip: "1 N = 1 kg·m/s². Always check if F is the NET force, not just one of the forces." },
    { name: "Conservation of Momentum", latex: "m_1 u_1 + m_2 u_2 = m_1 v_1 + m_2 v_2", plainText: "m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂", variables: [{ symbol: "m₁, m₂", meaning: "masses of two objects" }, { symbol: "u₁, u₂", meaning: "initial velocities" }, { symbol: "v₁, v₂", meaning: "final velocities" }], applicableWhen: "No external force acts on the system (isolated)", doesNotApplyWhen: "If friction or an external force acts, momentum is NOT conserved", examTip: "Always assign a direction as positive and maintain sign convention consistently" },
  ],

  lawsAndTheorems: [
    { name: "Newton's First Law (Law of Inertia)", type: "law", statement: "An object remains in its state of rest or uniform motion in a straight line unless acted upon by an external net force", discoveredBy: "Isaac Newton, 1687 (Principia Mathematica)", boardRelevance: "State and give examples in 2-mark questions; applied in 3-mark analysis questions" },
    { name: "Newton's Second Law", type: "law", statement: "The net force acting on an object is equal to the rate of change of its momentum: F = dp/dt = ma (for constant mass)", boardRelevance: "Most frequently tested law in numerical problems; 3-5 mark questions" },
    { name: "Newton's Third Law", type: "law", statement: "For every action there is an equal and opposite reaction; forces always occur in pairs on different objects", boardRelevance: "Conceptual questions (2 marks); proof of momentum conservation (5 marks)" },
    { name: "Law of Conservation of Momentum", type: "law", statement: "In an isolated system, the total momentum remains constant before, during, and after any interaction", proofInsight: "By Newton's Third Law: F₁₂ = −F₂₁; over the same time Δt, Δp₁ = −Δp₂; so total change = 0", boardRelevance: "Standard proof question (5 marks); application to collision problems (3 marks)" },
  ],

  commonMisconceptions: [
    { misconception: "Action and reaction forces cancel each other", correction: "Action and reaction act on DIFFERENT objects. Two forces cancel only when they act on the SAME object. Action-reaction pairs never cancel.", whyItHappens: "Students see equal and opposite and think of force balance — but force balance requires same object", revealingQuestion: "A horse pulls a cart forward with 500N. The cart pulls the horse backward with 500N. Why does the system still move?" },
    { misconception: "A heavier object falls faster than a lighter one", correction: "In free fall (no air resistance), all objects have the same acceleration g. Galileo demonstrated this; Newton's laws explain why (F = mg → a = g, independent of mass).", whyItHappens: "Aristotle's view; also, air resistance makes heavy objects fall faster in reality, reinforcing the misconception", revealingQuestion: "A 1kg and a 10kg ball are dropped from the same height. Which hits the ground first (ignoring air resistance)?" },
    { misconception: "If an object is moving, there must be a net force on it", correction: "An object can move at constant velocity with ZERO net force (Newton's First Law). Force is needed only to CHANGE velocity (accelerate).", whyItHappens: "Pre-Newtonian intuition: motion needs a cause. Students think force maintains motion.", revealingQuestion: "A hockey puck slides on frictionless ice at constant velocity. What is the net force on it?" },
  ],

  examinerTraps: [
    { trap: "Not identifying that 'net force' is required in F = ma", typicalScenario: "Problem gives applied force and friction; student substitutes applied force alone into F=ma", avoidanceStrategy: "Draw a free body diagram; F = Fnet = Fapplied − Ffriction (if in same line). Use net force only.", marksAtRisk: "Full numerical marks" },
    { trap: "Confusion between mass and weight in F = ma", typicalScenario: "Question gives weight 60N; student substitutes 60 kg as mass in F=ma", avoidanceStrategy: "Weight W = mg, so mass m = W/g = 60/10 = 6 kg. Always convert weight to mass first.", marksAtRisk: "Wrong answer throughout the numerical" },
  ],

  typicalMistakes: [
    { mistake: "p = mv where v is in km/h", correction: "For SI unit momentum (kg·m/s), velocity must be in m/s. Convert: 1 km/h = 1000/3600 m/s ≈ 5/18 m/s", conceptualError: "Not converting to SI units before substituting" },
    { mistake: "Proving conservation: student writes m₁v₁ + m₂v₂ = m₁u₁ + m₂u₂ (swapped sides) and claims proved", correction: "The proof must start from Newton's Third Law and derive the conservation; not state the result and claim it proved", conceptualError: "Stating what is to be proved as the starting point" },
  ],

  bloomsMap: [
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["A gun of mass 3kg fires a bullet of mass 0.02kg at 300m/s. Find the recoil velocity of the gun.", "Derive conservation of momentum from Newton's Third Law."] },
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["A horse cannot pull a cart because the cart pulls the horse equally — is this reasoning correct? Explain.", "When you jump off a boat, the boat moves backward. Explain using Newton's Third Law."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Inertia: what it is, examples, relationship to mass", tier: "easy", teachingNote: "Coin-on-cardboard experiment; passengers lurching forward when bus brakes" },
    { step: 2, concept: "Newton's First Law: formal statement and Galileo's contribution", tier: "easy", dependsOnStep: 1, teachingNote: "Historical context: before Newton, motion needed a cause; Newton showed rest and uniform motion are equivalent" },
    { step: 3, concept: "Momentum: definition, units, calculation", tier: "easy", dependsOnStep: 2, teachingNote: "Compare: a tennis ball vs a truck at the same speed — truck has more momentum" },
    { step: 4, concept: "Newton's Second Law: F = ma; derive from F = Δp/Δt", tier: "medium", dependsOnStep: 3, teachingNote: "Derive: F = (mv − mu)/t = m(v−u)/t = ma for constant mass" },
    { step: 5, concept: "Numerical problems: F=ma with net force", tier: "medium", dependsOnStep: 4, teachingNote: "Free body diagram first! Net force = vector sum of all forces" },
    { step: 6, concept: "Newton's Third Law: action-reaction pairs on different bodies", tier: "medium", dependsOnStep: 4, teachingNote: "Cannot cancel because on different bodies; gives motion not stalemate" },
    { step: 7, concept: "Derive conservation of momentum from Third Law", tier: "hard", dependsOnStep: 6, teachingNote: "Standard 5-mark proof; step by step: Third Law → equal opposite impulse → momentum change cancels" },
    { step: 8, concept: "Collision problems using conservation of momentum", tier: "hard", dependsOnStep: 7, teachingNote: "Elastic vs inelastic (at this level, just apply formula; elastic concept optional)" },
  ],

  realLifeApplications: [
    { context: "Seatbelts and airbags", conceptUsed: "Newton's First Law — inertia in collisions", explanation: "In a crash, the car decelerates but the passenger's inertia keeps them moving forward. Seatbelt applies a backward force to stop them; airbag increases stopping time (impulse = Δp = F×t → smaller F for larger t)", ageRelevance: "Life-safety context; powerful motivation for Newton's First Law" },
    { context: "Rocket propulsion", conceptUsed: "Newton's Third Law + conservation of momentum", explanation: "Fuel burns and is expelled backward at high speed; by conservation of momentum and Third Law, rocket moves forward", ageRelevance: "Space exploration; students have seen rocket launches" },
    { context: "Cricket: batting a fast ball", conceptUsed: "Impulse = change in momentum; F × t = Δp", explanation: "A batsman hitting a fast ball reverses its momentum. The bat exerts a large force over a short time. Increasing contact time ('following through') reduces force for same momentum change", ageRelevance: "Cricket is India's most popular sport" },
  ],

  crossChapterLinks: [
    { subject: "Physics", classNum: 9, chapterId: "ch01", chapterName: "Motion", linkType: "builds-on", description: "Acceleration from Chapter 1 is directly used in F=ma" },
    { subject: "Physics", classNum: 9, chapterId: "ch03", chapterName: "Gravitation", linkType: "prerequisite-for", description: "Newton's Law of Gravitation gives the gravitational force; F=ma gives g from that force" },
  ],

  crossSubjectLinks: [
    { subject: "Mathematics", topic: "Vectors and their addition", description: "Force, velocity, and momentum are vectors; adding forces requires vector addition not scalar addition", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Coin-on-cardboard demo: pull card quickly, coin stays — inertia of rest", duration: "10 minutes", pedagogyNote: "Demonstration-first; students predict, observe, explain" },
    { step: 2, action: "Define Newton's First Law; discuss Galileo's thought experiment", duration: "15 minutes", pedagogyNote: "Historical context: Galileo imagined frictionless surface; ball rolls indefinitely" },
    { step: 3, action: "Define momentum; compute for several objects", duration: "10 minutes", pedagogyNote: "Why does a slow truck cause more damage than a fast tennis ball? Momentum answers this" },
    { step: 4, action: "Derive F = ma from F = Δp/Δt; practice 3 numericals", duration: "25 minutes", pedagogyNote: "Clear derivation: F = m(v−u)/t = ma. Unit: 1N = 1 kg·m/s²" },
    { step: 5, action: "Newton's Third Law: action-reaction pairs, why they don't cancel", duration: "20 minutes", pedagogyNote: "NEP-HOT: the horse-cart paradox — discuss carefully. Action and reaction are on DIFFERENT objects." },
    { step: 6, action: "Derive conservation of momentum; apply to collision and recoil problems", duration: "30 minutes", pedagogyNote: "NEP-PROB: standard 5-mark proof first, then numerical application" },
    { step: 7, action: "Seatbelt and rocket discussions: NEP-ETH and NEP-COMP", duration: "15 minutes", pedagogyNote: "Connect to real-world safety and technology" },
  ],
};

export const GRAVITATION: ChapterKnowledge = {
  chapterId: "ch03", chapterName: "Gravitation", classNum: 9, subject: "Physics", board: "Both",

  learningObjectives: [
    { statement: "State Newton's Universal Law of Gravitation and identify the variables in the formula", bloomsLevel: "understand", assessable: true },
    { statement: "Calculate gravitational force between two bodies using F = Gm₁m₂/r²", bloomsLevel: "apply", assessable: true },
    { statement: "Derive the value of g from Newton's gravitational law", bloomsLevel: "evaluate", assessable: true },
    { statement: "Distinguish between mass and weight and calculate weight from mass", bloomsLevel: "understand", assessable: true },
    { statement: "Explain Archimedes' Principle and calculate buoyant force", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Given mass and height above Earth, find gravitational force — select formula without being told" },
    { ruleCode: "NEP-HOT", application: "Evaluate: why is g slightly higher at poles than at equator? (Earth is flatter at poles, r is smaller)" },
    { ruleCode: "NEP-REPR", application: "Represent mass and weight as two different quantities with different units and different contexts" },
  ],

  cbseOutcomes: [
    "Student states Newton's Universal Law of Gravitation with the formula",
    "Student derives the value of g (acceleration due to gravity) from gravitational law",
    "Student distinguishes mass (constant) from weight (varies with location)",
    "Student applies Archimedes' Principle and the concept of buoyancy to find upthrust and conditions for floating",
  ],

  icseOutcomes: [
    "ICSE expects: calculation of g on the Moon and other planets from their mass and radius",
    "ICSE additionally tests: variation of g with altitude (approximate formula g' = g(1 − 2h/R) for h << R)",
  ],

  coreConcepts: [
    "Every mass in the universe attracts every other mass — gravitational force is universal",
    "Gravitational force is proportional to the product of masses and inversely proportional to the square of distance (inverse square law)",
    "g = GM/R² relates local acceleration due to gravity to Earth's mass and radius — it varies by location",
    "Mass is a scalar measure of matter (constant everywhere); weight = mg is a force (varies with g)",
    "Archimedes' Principle: buoyant force = weight of fluid displaced",
  ],

  subtopics: [
    { id: "t1", name: "Universal Law of Gravitation", coreConcept: "F = Gm₁m₂/r² — the force that holds the solar system together", keyIdea: "Same force that makes apples fall governs planetary orbits — Newton's unification", estimatedPeriods: 2 },
    { id: "t2", name: "Free Fall and Acceleration due to Gravity", coreConcept: "g = GM_Earth/R² ≈ 9.8 m/s² near Earth's surface; all objects fall with the same g", keyIdea: "The mass cancels in F=ma when only gravity acts — hence all objects fall equally", estimatedPeriods: 2 },
    { id: "t3", name: "Mass and Weight", coreConcept: "Mass = quantity of matter (kg); Weight = gravitational force on object (N = mg)", keyIdea: "Mass is constant; weight varies by location (less on Moon, zero in free fall)", estimatedPeriods: 2 },
    { id: "t4", name: "Archimedes' Principle and Buoyancy", coreConcept: "Upthrust = weight of fluid displaced; object floats when upthrust ≥ weight", keyIdea: "A ship floats because it displaces water whose weight equals the ship's weight", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "phy:9:ch02:newton-second-law", to: "phy:9:ch03:g-derivation", relationship: "applies", explanation: "g is derived by applying F=ma to the gravitational force: Mg = GMm/R² → g = GM/R²" },
    { from: "phy:9:ch03:gravitational-force-formula", to: "phy:9:ch03:weight-formula", relationship: "applies", explanation: "Weight = gravitational force on an object at Earth's surface = mg" },
    { from: "phy:9:ch03:buoyancy", to: "phy:9:ch03:archimedes-principle", relationship: "applies", explanation: "Buoyant force equals the weight of displaced fluid — Archimedes discovered this for any submerged object" },
  ],

  prerequisites: {
    chapters: [{ subject: "Physics", classNum: 9, chapterId: "ch02", chapterName: "Force and Laws of Motion", requiredConcepts: ["phy:9:ch02:newton-second-law"] }],
    concepts: ["phy:9:ch02:newton-second-law", "phy:8:ch01:pressure-formula"],
  },

  essentialDefinitions: [
    { term: "Gravitational Force", formalDefinition: "The attractive force between any two bodies with mass, given by F = Gm₁m₂/r²", informalExplanation: "The invisible pull between every pair of objects in the universe — usually only noticeable when at least one is very massive" },
    { term: "Universal Gravitational Constant (G)", formalDefinition: "G = 6.674 × 10⁻¹¹ N·m²/kg²; the constant of proportionality in Newton's law of gravitation", informalExplanation: "A fundamental constant of nature — G tells us how strong gravity is" },
    { term: "Acceleration due to Gravity (g)", formalDefinition: "The acceleration experienced by a freely falling body near Earth's surface; g = GM_Earth/R² ≈ 9.8 m/s² ≈ 10 m/s² (approx)", informalExplanation: "How fast gravity speeds up a falling object per second" },
    { term: "Weight", formalDefinition: "The gravitational force on an object due to Earth; W = mg; measured in Newtons; a vector", informalExplanation: "Weight is a force — what a spring balance measures. Mass is what a beam balance measures." },
    { term: "Buoyant Force (Upthrust)", formalDefinition: "The upward force exerted by a fluid on a fully or partially submerged object, equal to the weight of fluid displaced", informalExplanation: "The water 'pushes back' when you push something into it — the more volume submerged, the greater the push" },
    { term: "Relative Density", formalDefinition: "The ratio of the density of a substance to the density of water at 4°C; dimensionless", informalExplanation: "How much denser the substance is compared to water; >1 means it sinks in water, <1 means it floats" },
  ],

  formulaInventory: [
    { name: "Universal Law of Gravitation", latex: "F = \\frac{Gm_1 m_2}{r^2}", plainText: "F = Gm₁m₂/r²", variables: [{ symbol: "G", meaning: "Universal gravitational constant = 6.674×10⁻¹¹ N·m²/kg²" }, { symbol: "m₁, m₂", meaning: "masses of two objects (kg)" }, { symbol: "r", meaning: "distance between their centres (m)" }], applicableWhen: "Point masses or spherically symmetric bodies", doesNotApplyWhen: "For extended or irregularly shaped objects, integration is needed; at this level, treat all objects as point masses", examTip: "r is centre-to-centre distance, NOT surface-to-surface" },
    { name: "Acceleration due to Gravity", latex: "g = \\frac{GM}{R^2}", plainText: "g = GM/R²", variables: [{ symbol: "M", meaning: "mass of Earth (5.97×10²⁴ kg)" }, { symbol: "R", meaning: "radius of Earth (6.4×10⁶ m)" }], derivedFrom: "Newton's Second Law applied to gravitational force: mg = GMm/R²; cancel m; get g = GM/R²", applicableWhen: "Near the surface of a planet; g varies as you move away from surface", doesNotApplyWhen: "At high altitudes, use g' = GM/(R+h)²", examTip: "The mass of the falling object cancels — that is WHY all objects fall with the same g" },
    { name: "Weight", latex: "W = mg", plainText: "W = mg", variables: [{ symbol: "W", meaning: "weight (N)" }, { symbol: "m", meaning: "mass (kg)" }, { symbol: "g", meaning: "acceleration due to gravity (m/s²)" }], applicableWhen: "Near a planet's surface", doesNotApplyWhen: "In deep space far from any planet, weight ≈ 0 (weightlessness)" },
    { name: "Archimedes' Principle", latex: "F_b = \\rho_{fluid} \\cdot V_{displaced} \\cdot g", plainText: "Fb = ρ_fluid × V_displaced × g", variables: [{ symbol: "Fb", meaning: "buoyant force (N)" }, { symbol: "ρ_fluid", meaning: "density of fluid (kg/m³)" }, { symbol: "V_displaced", meaning: "volume of fluid displaced (m³)" }], applicableWhen: "Any object fully or partially submerged in a fluid", doesNotApplyWhen: "Fluid must be in equilibrium; not applicable to objects in accelerating fluids at this level" },
  ],

  lawsAndTheorems: [
    { name: "Newton's Universal Law of Gravitation", type: "law", statement: "Every body in the universe attracts every other body with a force directly proportional to the product of their masses and inversely proportional to the square of the distance between them", boardRelevance: "State the law precisely: 5-mark derivation of g from this law; 2-mark statement of law" },
    { name: "Archimedes' Principle", type: "law", statement: "When a body is immersed fully or partially in a fluid, it experiences an upward force (buoyant force) equal to the weight of the fluid displaced", discoveredBy: "Archimedes of Syracuse, 3rd century BCE", boardRelevance: "State and apply: 2-3 mark questions on floating/sinking; relative density calculations" },
  ],

  commonMisconceptions: [
    { misconception: "Gravity only pulls objects toward Earth", correction: "Gravity is a universal attractive force between ALL masses — the Sun and Moon attract each other; you attract the Earth with the same force the Earth attracts you", whyItHappens: "Students only experience Earth's gravity directly", revealingQuestion: "You attract the Earth. Why does the Earth not visibly move toward you?" },
    { misconception: "Mass and weight are the same thing", correction: "Mass is the amount of matter (constant anywhere, measured in kg). Weight is the gravitational force on that mass (W=mg, varies with g, measured in N)", whyItHappens: "Everyday language: 'I weigh 60 kg' confuses mass and weight", revealingQuestion: "An astronaut has mass 70 kg on Earth. What is her mass on the Moon? What is her weight on the Moon (g_Moon = 1.6 m/s²)?" },
    { misconception: "A floating object has no weight", correction: "A floating object has weight (downward). It floats because the buoyant force equals its weight. Weight is not zero — the forces are balanced.", whyItHappens: "Students confuse 'floating' with 'weightless'", revealingQuestion: "A ship of mass 50,000 kg floats. What is its weight? What is the buoyant force on it?" },
  ],

  examinerTraps: [
    { trap: "Confusing r with diameter or surface distance in F = Gm₁m₂/r²", typicalScenario: "Problem gives radius of Earth; student uses diameter in formula", avoidanceStrategy: "r is the distance between the CENTRES of the two masses. For Earth-Moon: r = distance between centres (not surface-to-surface)", marksAtRisk: "Full numerical marks wrong by factor of 4" },
    { trap: "Using mass in kilograms for weight formula but giving weight in kg", typicalScenario: "Student writes 'W = 70 × 10 = 700 kg' instead of '700 N'", avoidanceStrategy: "Weight is a FORCE measured in Newtons. Never write weight in kg.", marksAtRisk: "½ mark for wrong unit" },
  ],

  typicalMistakes: [
    { mistake: "g = 9.8 always, even on Moon", correction: "g varies by planet: g_Moon = 1.6 m/s², g_Mars ≈ 3.7 m/s². Only g_Earth ≈ 9.8 m/s²", conceptualError: "Treating g as a universal constant rather than dependent on planet mass and radius" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["Why does doubling the distance between two masses reduce gravity to one-quarter? Explain using the formula.", "Calculate the gravitational force between Earth and Moon; compare to force between you and Earth."] },
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["An iron block sinks in water but floats in mercury. Explain using Archimedes' Principle.", "A steel ship floats but a solid steel ball sinks. Why?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Gravitational force: universal, mutual, always attractive", tier: "easy", teachingNote: "Apple story; but the apple also attracts Earth — just can't feel Earth move" },
    { step: 2, concept: "Newton's Law formula: F = Gm₁m₂/r²; identify each variable", tier: "medium", dependsOnStep: 1, teachingNote: "Proportion-based reasoning: double mass → double F; double distance → ¼ F" },
    { step: 3, concept: "Derive g from Newton's Law; understand why mass cancels", tier: "hard", dependsOnStep: 2, teachingNote: "This is the key insight: mg = GMm/R² → m cancels → all objects have same g" },
    { step: 4, concept: "Mass vs weight: definitions, units, variation with location", tier: "easy", dependsOnStep: 3, teachingNote: "Beam balance measures mass (independent of g); spring balance measures weight (dependent on g)" },
    { step: 5, concept: "Buoyancy: why objects float or sink", tier: "medium", dependsOnStep: 1, teachingNote: "Observe: ball of clay sinks; reshape into a bowl — floats. Same mass, different displaced volume." },
    { step: 6, concept: "Archimedes' Principle: formula and applications", tier: "medium", dependsOnStep: 5, teachingNote: "Floating condition: buoyant force = weight; derivation of floating condition from densities" },
  ],

  realLifeApplications: [
    { context: "Tidal forces: Moon and ocean tides", conceptUsed: "Universal gravitation — Moon's gravity pulls different parts of Earth differently", explanation: "The Moon's gravitational pull is stronger on the near side of Earth, causing ocean tides. Tidal force = gradient of gravitational force.", ageRelevance: "Tides are observable; fishermen time their work by tides" },
    { context: "Ships and icebergs", conceptUsed: "Archimedes' Principle and relative density", explanation: "Ships float because their average density (ship + air inside) < water density. Icebergs float with 1/9 above water (ice density = 0.9×water density)", ageRelevance: "Titanic story; iceberg context" },
    { context: "Spring balance vs beam balance on Moon", conceptUsed: "Mass vs weight distinction", explanation: "A spring balance on the Moon reads 1/6 of Earth value (measures weight = mg; g_Moon = g_Earth/6). A beam balance reads the same (compares masses; g cancels)", ageRelevance: "Astronaut scenarios in ISRO context" },
  ],

  crossChapterLinks: [
    { subject: "Physics", classNum: 9, chapterId: "ch02", chapterName: "Force and Laws of Motion", linkType: "builds-on", description: "F=ma from Chapter 2 is used to derive g and derive weight from gravitational force" },
    { subject: "Physics", classNum: 9, chapterId: "ch04", chapterName: "Work and Energy", linkType: "prerequisite-for", description: "Gravitational potential energy depends on g from this chapter" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Density and relative density of substances", description: "Archimedes' Principle uses density; the same concepts (density, volume, mass) appear in Chemistry Chapter 2 (matter classification)", strength: "strong" },
    { subject: "Economics", topic: "Agricultural significance of tides and seasons", description: "Tidal forces affecting coastal fishing communities; gravitational effects on seasons (oblique connection via Earth-Sun distance)", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Apple story: why does the apple fall toward Earth? Does Earth move toward apple? Why can't we feel it?", duration: "10 minutes", pedagogyNote: "Newton's insight: same force, different effect (M_Earth >> m_apple)" },
    { step: 2, action: "State gravitational law; derive proportionality and inverse-square relationship from physical reasoning", duration: "20 minutes", pedagogyNote: "Proportion questions: halve the distance → force multiplied by ___?" },
    { step: 3, action: "Derive g = GM/R²; compute g for Moon from its mass and radius", duration: "25 minutes", pedagogyNote: "NEP-HOT: if Earth were smaller but same mass, would g be larger or smaller?" },
    { step: 4, action: "Mass vs weight: beam balance vs spring balance on Moon activity", duration: "15 minutes", pedagogyNote: "Thought experiment: take both balances to Moon — which gives same reading?" },
    { step: 5, action: "Clay ball vs clay bowl activity: same mass, different floating", duration: "10 minutes", pedagogyNote: "Physical activity before Archimedes' Principle — discovery learning" },
    { step: 6, action: "Archimedes' Principle: state, derive floating condition, solve numericals", duration: "25 minutes", pedagogyNote: "Connect to ships, submarines, hydrometers" },
  ],
};

export const WORK_AND_ENERGY: ChapterKnowledge = {
  chapterId: "ch04", chapterName: "Work and Energy", classNum: 9, subject: "Physics", board: "Both",

  learningObjectives: [
    { statement: "Define work in the scientific sense and calculate it using W = Fs cosθ", bloomsLevel: "apply", assessable: true },
    { statement: "Define kinetic and potential energy and derive formulas for each", bloomsLevel: "evaluate", assessable: true },
    { statement: "Apply the work-energy theorem to relate work done to change in kinetic energy", bloomsLevel: "apply", assessable: true },
    { statement: "State and apply the law of conservation of energy to mechanical systems", bloomsLevel: "apply", assessable: true },
    { statement: "Define power and calculate it for given force and velocity", bloomsLevel: "apply", assessable: true },
    { statement: "Distinguish between conservative and non-conservative forces", bloomsLevel: "understand", assessable: false },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "At a given height on a roller coaster, find the speed at the bottom — choose energy conservation without being told" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'A person carrying a heavy bag on a flat surface does no work on the bag' — is this scientifically correct?" },
    { ruleCode: "NEP-ETH", application: "Discuss renewable energy: why energy is conserved but 'usable energy' decreases — entropy concept introduced" },
  ],

  cbseOutcomes: [
    "Student defines work done in physics and identifies zero-work situations",
    "Student calculates kinetic energy and derives the formula from first principles",
    "Student applies the law of conservation of energy (PE + KE = constant for mechanical systems without friction)",
    "Student defines and calculates power and the commercial unit of energy (kWh)",
  ],

  icseOutcomes: [
    "ICSE expects: derivation of kinetic energy formula using equations of motion (v²=u²+2as → KE=½mv²)",
    "ICSE tests: transformation of energy in pendulum, spring, roller coaster with full calculations",
  ],

  coreConcepts: [
    "Scientific work: W = Fs cosθ — force, displacement, AND angle all matter",
    "Zero work: force perpendicular to displacement (θ=90°, cosθ=0); or displacement=0",
    "Kinetic energy = energy of motion: KE = ½mv²",
    "Gravitational potential energy = energy of position: PE = mgh",
    "Conservation of energy: KE + PE = constant (no friction); energy transforms but total is constant",
    "Power = rate of doing work; P = W/t = Fv",
  ],

  subtopics: [
    { id: "t1", name: "Work: Scientific Definition", coreConcept: "W = Fs cosθ; work done depends on the component of force in the direction of displacement", keyIdea: "A waiter carrying a tray horizontally does zero work on the tray (perpendicular force)", estimatedPeriods: 2 },
    { id: "t2", name: "Kinetic Energy", coreConcept: "KE = ½mv² — energy due to motion; derived from work done by net force", keyIdea: "Derive: work done = ΔKE (work-energy theorem)", estimatedPeriods: 2 },
    { id: "t3", name: "Potential Energy", coreConcept: "PE = mgh for gravitational PE; stored energy that can be released as KE", keyIdea: "PE stored = work done against gravity to reach the height", estimatedPeriods: 2 },
    { id: "t4", name: "Conservation of Energy", coreConcept: "Total mechanical energy (KE + PE) is constant in absence of non-conservative forces", keyIdea: "At every point in the fall: KE + PE = constant (= PE at the top = KE at bottom)", estimatedPeriods: 2 },
    { id: "t5", name: "Power", coreConcept: "Power = rate of doing work; P = W/t; commercial unit: kilowatt-hour (kWh)", keyIdea: "Two machines can do the same work in different times — power distinguishes them", estimatedPeriods: 1 },
  ],

  conceptGraph: [
    { from: "phy:9:ch02:newton-second-law", to: "phy:9:ch04:kinetic-energy-derivation", relationship: "applies", explanation: "KE formula derived by applying work = F×s = ma×s = m×(v²−u²)/2 using third equation of motion" },
    { from: "phy:9:ch04:kinetic-energy-formula", to: "phy:9:ch04:work-energy-theorem", relationship: "applies", explanation: "Work done by net force = change in KE — this is the work-energy theorem" },
    { from: "phy:9:ch04:potential-energy-formula", to: "phy:9:ch04:conservation-of-energy", relationship: "applies", explanation: "Conservation: at any height h, KE + mgh = constant; KE gained = PE lost" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Physics", classNum: 9, chapterId: "ch01", chapterName: "Motion", requiredConcepts: ["phy:9:ch01:equations-of-motion"] },
      { subject: "Physics", classNum: 9, chapterId: "ch02", chapterName: "Force and Laws of Motion", requiredConcepts: ["phy:9:ch02:newton-second-law"] },
    ],
    concepts: ["phy:9:ch01:third-equation-motion", "phy:9:ch02:newton-second-law"],
  },

  essentialDefinitions: [
    { term: "Work (Physics)", formalDefinition: "Work done by a force F on an object is W = Fs cosθ, where s is the displacement and θ is the angle between force and displacement", informalExplanation: "Only the component of force in the direction of motion does work — pushing sideways while walking forward does no work", example: "Lifting a box: force (up) and displacement (up) are parallel; θ=0; W = Fs (maximum work)" },
    { term: "Energy", formalDefinition: "The capacity of a body to do work; scalar quantity; SI unit: Joule (J)", informalExplanation: "How much work an object could potentially do if allowed" },
    { term: "Kinetic Energy", formalDefinition: "The energy possessed by an object due to its motion; KE = ½mv²; SI unit: Joule", informalExplanation: "A moving object can do work (push things) because of its motion" },
    { term: "Gravitational Potential Energy", formalDefinition: "The energy stored in an object due to its position above a reference level; PE = mgh", informalExplanation: "Energy stored by height — water behind a dam, a raised hammer" },
    { term: "Power", formalDefinition: "The rate of doing work or transferring energy; P = W/t; SI unit: Watt (W) = Joule/second", informalExplanation: "How quickly work is done — two people can climb the same stairs, but the faster one has higher power" },
    { term: "Kilowatt-hour (kWh)", formalDefinition: "The commercial unit of energy; 1 kWh = 1 kW × 1 hour = 3.6 × 10⁶ J", informalExplanation: "The unit on your electricity bill — '1 unit' = 1 kWh" },
  ],

  formulaInventory: [
    { name: "Work Done", latex: "W = Fs\\cos\\theta", plainText: "W = Fs cosθ", variables: [{ symbol: "F", meaning: "force (N)" }, { symbol: "s", meaning: "displacement (m)" }, { symbol: "θ", meaning: "angle between force and displacement" }], applicableWhen: "Constant force; linear displacement", doesNotApplyWhen: "Variable force (integration needed); θ=90° gives W=0", examTip: "Zero work situations: θ=90° (perpendicular), s=0 (no motion), F=0 (no force)" },
    { name: "Kinetic Energy", latex: "KE = \\frac{1}{2}mv^2", plainText: "KE = ½mv²", variables: [{ symbol: "m", meaning: "mass (kg)" }, { symbol: "v", meaning: "velocity (m/s)" }], derivedFrom: "Work done by net force = Fs = mas = m(v²−u²)/2 using v²=u²+2as", applicableWhen: "Any moving object", doesNotApplyWhen: "Relativistic speeds; at this level, use for all practical purposes", examTip: "KE depends on v²; doubling v quadruples KE. This explains why road accidents at higher speeds are so much more severe." },
    { name: "Gravitational Potential Energy", latex: "PE = mgh", plainText: "PE = mgh", variables: [{ symbol: "m", meaning: "mass (kg)" }, { symbol: "g", meaning: "9.8 m/s² (use 10 m/s² unless specified)" }, { symbol: "h", meaning: "height above reference level (m)" }], applicableWhen: "Near Earth's surface; h << R_Earth", doesNotApplyWhen: "Very large heights — g varies significantly; use PE = −GMm/r for large heights", examTip: "Reference level is arbitrary; always specify where h=0 is taken" },
    { name: "Power", latex: "P = \\frac{W}{t} = Fv", plainText: "P = W/t = Fv", variables: [{ symbol: "P", meaning: "power (W = Watt)" }, { symbol: "W", meaning: "work done (J)" }, { symbol: "t", meaning: "time (s)" }, { symbol: "v", meaning: "velocity (m/s) — for constant force and velocity" }], applicableWhen: "Average power uses total work/total time; instantaneous power = Fv for constant force", doesNotApplyWhen: "For variable force and velocity, integration needed; P = Fv applies only for constant values" },
  ],

  lawsAndTheorems: [
    { name: "Law of Conservation of Energy", type: "law", statement: "Energy can neither be created nor destroyed; it can only be transformed from one form to another. The total energy of an isolated system remains constant.", limitations: "In mechanical systems with friction, mechanical energy decreases (converted to heat/sound); total energy is still conserved", boardRelevance: "State the law (1 mark); apply to falling body, pendulum, roller coaster (3-5 marks)" },
    { name: "Work-Energy Theorem", type: "theorem", statement: "The net work done on an object equals its change in kinetic energy: W_net = ΔKE = ½mv² − ½mu²", proofInsight: "From Newton's Second Law and the third equation of motion: W = Fs = mas = m(v²−u²)/2 = ΔKE", boardRelevance: "Derivation 3-5 marks; application to find velocity after work done" },
  ],

  commonMisconceptions: [
    { misconception: "A person holding a heavy box stationary does work on it", correction: "In physics, work requires displacement. If the box doesn't move, W = F × 0 = 0. The person does metabolic work but zero mechanical work on the box.", whyItHappens: "Everyday 'effort' is conflated with physics 'work'", revealingQuestion: "A person holds a 20 kg box at shoulder height for 1 minute without moving. How much work has she done on the box?" },
    { misconception: "Energy can be created by some natural processes", correction: "Energy is always conserved — it transforms. A river creates electricity by converting PE of water to electrical energy. Nuclear reactions convert mass energy (E=mc²) to other forms. Energy is never created from nothing.", whyItHappens: "Loose language: 'generate electricity'", revealingQuestion: "A hydroelectric dam 'generates' electricity. Where does the energy come from?" },
    { misconception: "Potential energy is always gravitational", correction: "Potential energy exists for any conservative force: gravitational, elastic (spring), electrical, chemical. The chapter focuses on gravitational PE, but PE is a general concept.", whyItHappens: "The chapter introduces PE through height (gravitational); other types appear later in the curriculum", revealingQuestion: "Where is energy stored in a compressed spring? What kind of PE is this?" },
  ],

  examinerTraps: [
    { trap: "Not including the ½ in the KE formula", typicalScenario: "Student writes KE = mv² instead of KE = ½mv²", avoidanceStrategy: "The ½ comes from the derivation: W = m(v²−u²)/2. It is fundamental, not optional.", marksAtRisk: "Wrong answer by factor of 2; full numerical marks" },
    { trap: "Using g = 9.8 when the question expects g = 10 m/s²", typicalScenario: "Using g = 9.8 in calculations where the answer is expected to be a round number with g = 10", avoidanceStrategy: "If the question or its example answer uses round numbers, use g = 10 m/s² unless explicitly stated otherwise", marksAtRisk: "Slightly wrong answer; generally not penalised if method is correct" },
  ],

  typicalMistakes: [
    { mistake: "W = F × s regardless of angle", correction: "W = Fs cosθ. If force is perpendicular to displacement (θ=90°, cosθ=0), W=0 even if F and s are both non-zero", conceptualError: "Forgetting the angle factor in the work formula" },
    { mistake: "PE = mgh using h as the initial height from the ground when h should be the height fallen", correction: "In conservation problems: ΔPE = mg(h₁ − h₂); ΔKE = −ΔPE. Be careful about which height is h.", conceptualError: "Mixing up reference level and height change" },
  ],

  bloomsMap: [
    { subtopicId: "t4", entryLevel: "apply", masteryLevel: "evaluate", targetLevels: ["apply", "analyse", "evaluate"], hotsStarters: ["A ball is dropped from 20m. At what height is its KE equal to its PE?", "A pendulum swings. Describe the energy transformation at 5 different points in one full swing."] },
    { subtopicId: "t5", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Two cars of different masses cover the same distance in the same time. Which requires more power if they have the same engine force?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Scientific work: W = Fs for parallel force and displacement", tier: "easy", teachingNote: "Multiple examples of everyday 'work' vs physics 'work'" },
    { step: 2, concept: "Zero work situations: perpendicular force, no displacement, no force", tier: "medium", dependsOnStep: 1, teachingNote: "Counterintuitive: a waiter carrying a tray does zero work on the tray. Friction does negative work." },
    { step: 3, concept: "Work done against gravity = mgh", tier: "easy", dependsOnStep: 1, teachingNote: "Lifting a mass by height h: all force (upward) aligned with displacement (upward)" },
    { step: 4, concept: "Kinetic energy: derive KE = ½mv² from W = ma × s", tier: "hard", dependsOnStep: 1, teachingNote: "This is the standard CBSE/ICSE derivation — every step must be shown" },
    { step: 5, concept: "Gravitational PE = mgh: concept and formula", tier: "medium", dependsOnStep: 3, teachingNote: "PE is stored work done against gravity — 'ready to be released'" },
    { step: 6, concept: "Conservation of energy: falling body example", tier: "medium", dependsOnStep: 4, teachingNote: "At every point: KE + PE = E_total. Tabulate values at ground, midpoint, top." },
    { step: 7, concept: "Power: P = W/t = Fv; commercial unit kWh", tier: "easy", dependsOnStep: 1, teachingNote: "Electricity bill example: power × time = energy = kWh" },
    { step: 8, concept: "Conservation problems: pendulum, roller coaster, spring", tier: "hard", dependsOnStep: 6, teachingNote: "Students apply conservation to find speed at various heights — real-world contexts" },
  ],

  realLifeApplications: [
    { context: "Roller coaster: speed at the bottom", conceptUsed: "Conservation of energy: PE at top = KE at bottom", explanation: "At the top of the loop (height h, speed v₁): KE₁+PE₁ = KE₂+PE₂ at bottom (h=0). Speed at bottom = √(v₁² + 2gh)", ageRelevance: "Theme park rides — directly exciting context" },
    { context: "Car crash severity vs speed", conceptUsed: "KE = ½mv²; doubling speed quadruples KE", explanation: "A crash at 60 km/h has 4× more kinetic energy than at 30 km/h. Road speed limits are set partly based on this quadratic relationship.", ageRelevance: "Road safety; personally relevant" },
    { context: "Electricity bill calculation", conceptUsed: "Power, time, commercial unit kWh", explanation: "A 100W bulb for 10 hours uses 1 kWh = 1 'unit'. Monthly electricity cost = (power in kW × hours used × rate per kWh)", ageRelevance: "Students can now read their home electricity meter" },
  ],

  crossChapterLinks: [
    { subject: "Physics", classNum: 9, chapterId: "ch01", chapterName: "Motion", linkType: "builds-on", description: "Equations of motion (v²=u²+2as) are used to derive the kinetic energy formula" },
    { subject: "Physics", classNum: 9, chapterId: "ch03", chapterName: "Gravitation", linkType: "builds-on", description: "Gravitational PE = mgh uses g from Chapter 3; weight W=mg" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Chemical energy in bonds and reactions", description: "Chemical PE stored in bonds is released as heat and light in exothermic reactions — energy conservation across chemistry and physics", strength: "strong" },
    { subject: "Economics", topic: "Renewable energy and economic cost", description: "Energy conservation and efficiency relate to economic cost of energy; renewable vs non-renewable in economic context", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Discuss everyday 'work' vs scientific 'work'; identify 3 zero-work examples", duration: "10 minutes", pedagogyNote: "Cognitive conflict: 'Am I doing work when I hold my schoolbag?' — scientifically, no" },
    { step: 2, action: "Derive KE = ½mv² from W = Fs = mas using v²=u²+2as", duration: "20 minutes", pedagogyNote: "Step-by-step derivation on board: every student writes it. NEP-PROB: prove from principles." },
    { step: 3, action: "Define PE = mgh from work done against gravity; tabulate for different heights", duration: "15 minutes", pedagogyNote: "PE is 'stored work' — build intuition with familiar examples" },
    { step: 4, action: "Conservation of energy: falling ball example — compute KE and PE at every metre", duration: "25 minutes", pedagogyNote: "Table: height, PE, KE, total E. Students observe total E stays constant." },
    { step: 5, action: "Power: definition, formula, commercial unit kWh — electricity bill calculation", duration: "15 minutes", pedagogyNote: "NEP-COMP: calculate monthly electricity cost for appliances in the classroom" },
    { step: 6, action: "Application problems: roller coaster, pendulum, spring — conservation approach", duration: "25 minutes", pedagogyNote: "Decision: which quantity is conserved? How to set up the equation?" },
  ],
};

export const SOUND: ChapterKnowledge = {
  chapterId: "ch05", chapterName: "Sound", classNum: 9, subject: "Physics", board: "Both",

  learningObjectives: [
    { statement: "Explain the production and propagation of sound as a mechanical wave", bloomsLevel: "understand", assessable: true },
    { statement: "Distinguish between longitudinal and transverse waves; classify sound correctly", bloomsLevel: "understand", assessable: true },
    { statement: "Define frequency, wavelength, amplitude, and relate them via v = fλ", bloomsLevel: "apply", assessable: true },
    { statement: "Explain how pitch, loudness, and quality depend on wave properties", bloomsLevel: "understand", assessable: true },
    { statement: "Apply the echo formula and calculate distances using speed of sound", bloomsLevel: "apply", assessable: true },
    { statement: "Explain the applications of ultrasound in medicine and SONAR", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Experiment: tap a desk and feel the vibration through it; discuss propagation through solids vs air" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Sound travels faster in solids than in gases' — explain why using particle model" },
    { ruleCode: "NEP-COMP", application: "Calculate the minimum distance from a cliff to hear an echo — connect physics to engineering of concert hall design" },
  ],

  cbseOutcomes: [
    "Student explains sound as a longitudinal mechanical wave requiring a medium for propagation",
    "Student defines frequency, wavelength, amplitude, and relates them via v = fλ",
    "Student explains the dependence of pitch and loudness on wave properties",
    "Student applies the echo formula (d = vt/2) to calculate distances",
    "Student explains the principle and application of SONAR and ultrasound",
  ],

  icseOutcomes: [
    "ICSE additionally expects: musical scale and its relationship to frequency ratios",
    "ICSE tests: refraction of sound and Doppler effect (conceptual level)",
  ],

  coreConcepts: [
    "Sound is a mechanical, longitudinal wave requiring a material medium — cannot travel through vacuum",
    "Longitudinal wave: particles vibrate parallel to the direction of wave propagation — alternating compressions and rarefactions",
    "Speed of sound depends on medium (fastest in solids, slower in liquids, slowest in gases) and temperature",
    "Frequency determines pitch; amplitude determines loudness; waveform determines quality (timbre)",
    "Echo: reflected sound heard separately; minimum distance for echo = v_sound × 0.1s / 2 = 17m",
    "Ultrasound (>20000 Hz) penetrates tissues and reflects at boundaries — used in medical imaging",
  ],

  subtopics: [
    { id: "t1", name: "Production and Propagation of Sound", coreConcept: "Sound is caused by vibration; propagates as compressions and rarefactions through a medium", keyIdea: "Sound cannot travel in vacuum — proven by bell-in-vacuum experiment", estimatedPeriods: 2 },
    { id: "t2", name: "Characteristics of Sound Waves", coreConcept: "Frequency (Hz), wavelength (m), amplitude, velocity: v = fλ", keyIdea: "Pitch ↔ frequency; loudness ↔ amplitude; quality ↔ waveform", estimatedPeriods: 2 },
    { id: "t3", name: "Reflection of Sound and Echo", coreConcept: "Sound reflects off hard surfaces; echo heard when reflected sound arrives ≥0.1s after direct sound", keyIdea: "d = v × t/2 (total path = 2 × distance to reflector)", estimatedPeriods: 2 },
    { id: "t4", name: "Range of Hearing and Ultrasound Applications", coreConcept: "Human hearing: 20 Hz – 20,000 Hz; ultrasound >20,000 Hz penetrates and scans", keyIdea: "SONAR uses echo timing to measure ocean depth; medical ultrasound images organs", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "phy:9:ch04:kinetic-energy-formula", to: "phy:9:ch05:sound-energy-vibration", relationship: "applies", explanation: "Sound propagation transfers energy through vibration — longitudinal KE of molecules" },
    { from: "phy:9:ch05:compression-rarefaction", to: "phy:9:ch05:speed-of-sound-factors", relationship: "requires", explanation: "Speed of sound in a medium depends on how quickly compressions are transmitted — tighter particle arrangement → faster" },
    { from: "phy:9:ch05:echo-formula", to: "phy:9:ch05:sonar-principle", relationship: "applies", explanation: "SONAR uses the echo principle: d = v × t/2 but with sound underwater" },
  ],

  prerequisites: {
    chapters: [{ subject: "Physics", classNum: 8, chapterId: "ch03", chapterName: "Sound", requiredConcepts: ["phy:8:ch03:vibration-produces-sound", "phy:8:ch03:echo-condition"] }],
    concepts: ["phy:8:ch03:vibration-produces-sound", "phy:8:ch03:amplitude-loudness"],
  },

  essentialDefinitions: [
    { term: "Longitudinal Wave", formalDefinition: "A wave in which the particles of the medium vibrate parallel to the direction of propagation of the wave", informalExplanation: "Like pushing and pulling a slinky — compressions travel in the same direction as the push", counterExample: "Transverse waves (light, water surface waves): particles move perpendicular to propagation" },
    { term: "Compression", formalDefinition: "A region in a longitudinal wave where the particles are closer together than normal (higher pressure)", informalExplanation: "The 'dense' part of a sound wave — where the sound wave bunches particles together" },
    { term: "Rarefaction", formalDefinition: "A region in a longitudinal wave where the particles are further apart than normal (lower pressure)", informalExplanation: "The 'sparse' part of a sound wave — where particles spread out" },
    { term: "Frequency", formalDefinition: "The number of complete vibrations (cycles) per second; SI unit: Hertz (Hz) = s⁻¹", informalExplanation: "How fast something vibrates — faster vibration → higher pitch" },
    { term: "Wavelength (λ)", formalDefinition: "The distance between two consecutive points that are in the same phase of vibration (e.g., two compressions)", informalExplanation: "Distance of one complete cycle of the wave" },
    { term: "Amplitude", formalDefinition: "The maximum displacement of a particle from its equilibrium position", informalExplanation: "How far each particle swings from rest — bigger amplitude → louder sound" },
    { term: "Echo", formalDefinition: "The reflection of sound from a hard surface that is heard distinctly after the original sound; requires the reflected sound to arrive at least 0.1 s after the direct sound", informalExplanation: "Your voice bounced back from a mountain — heard separately because the gap is ≥ 0.1 s" },
  ],

  formulaInventory: [
    { name: "Wave Speed Formula", latex: "v = f\\lambda", plainText: "v = fλ", variables: [{ symbol: "v", meaning: "speed of wave (m/s)" }, { symbol: "f", meaning: "frequency (Hz)" }, { symbol: "λ", meaning: "wavelength (m)" }], applicableWhen: "Any wave (sound, light, water)", doesNotApplyWhen: "When the medium is changing (speed changes but frequency stays constant)", examTip: "v = fλ → f and λ are inversely proportional for a given medium (same v). Higher frequency → shorter wavelength." },
    { name: "Echo Distance Formula", latex: "d = \\frac{v \\times t}{2}", plainText: "d = v × t / 2", variables: [{ symbol: "d", meaning: "distance to reflecting surface (m)" }, { symbol: "v", meaning: "speed of sound in air ≈ 344 m/s at room temperature" }, { symbol: "t", meaning: "time between original sound and echo (s)" }], derivedFrom: "Total path = v × t = 2 × distance to reflector; therefore d = vt/2", applicableWhen: "Object is stationary; echo returns on the same side as the source", examTip: "The factor of 2 is essential — sound travels TO the reflector AND BACK" },
    { name: "Minimum Distance for Echo", latex: "d_{min} = \\frac{v \\times 0.1}{2} = \\frac{344 \\times 0.1}{2} \\approx 17\\text{ m}", plainText: "Minimum distance ≈ 17 m (for v ≈ 344 m/s)", variables: [], applicableWhen: "Human ear persistence of sound = 0.1 s; minimum time between direct and reflected sound", doesNotApplyWhen: "Not a formula to derive — it's a specific calculation for the echo condition" },
  ],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Sound travels faster in air than in water", correction: "Sound travels FASTER in denser media. Speed in air ≈ 344 m/s; in water ≈ 1480 m/s; in steel ≈ 5100 m/s. Air is the slowest.", whyItHappens: "Students intuitively think 'thicker = harder to move through = slower'", revealingQuestion: "Arrange air, water, steel in order of increasing speed of sound. Explain your reasoning." },
    { misconception: "Higher frequency sound is louder", correction: "Loudness depends on AMPLITUDE; pitch (high or low sound) depends on FREQUENCY. High frequency = high pitch, but not necessarily loud.", whyItHappens: "Students confuse the two properties of sound", revealingQuestion: "A bat emits high-frequency ultrasound. Is the sound loud? Explain why frequency and loudness are different." },
    { misconception: "Sound can travel through vacuum — it is like light", correction: "Sound is a MECHANICAL wave requiring matter to propagate. Light is an electromagnetic wave and can travel through vacuum. This is why space is silent.", whyItHappens: "Both light and sound are 'waves'; students generalise properties of light to sound", revealingQuestion: "Why is there no sound in space? Why is there still light?" },
  ],

  examinerTraps: [
    { trap: "Forgetting to divide by 2 in echo distance formula", typicalScenario: "Student uses d = v × t (without dividing by 2); gets distance twice as large", avoidanceStrategy: "Sound travels TO the reflector AND back — total path is 2d. Therefore d = vt/2.", marksAtRisk: "Full numerical marks" },
    { trap: "Giving speed of sound as 3×10⁸ m/s (speed of light)", typicalScenario: "Student confuses speed of sound with speed of light in a hurried exam", avoidanceStrategy: "Speed of sound in air ≈ 344 m/s at room temperature, or ≈ 330 m/s as a round number. Speed of light = 3×10⁸ m/s. These are enormously different.", marksAtRisk: "Full numerical marks wrong" },
  ],

  typicalMistakes: [
    { mistake: "Using v = fλ but putting v = 3×10⁸ (speed of light) for a sound wave problem", correction: "Sound speed in air ≈ 344 m/s. v = fλ is correct; the v value must be for sound.", conceptualError: "Confusing electromagnetic and mechanical wave speeds" },
    { mistake: "Saying sound is a transverse wave", correction: "Sound is longitudinal — particles vibrate parallel to the direction of propagation", conceptualError: "Not recalling the classification of sound as longitudinal" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["A person claps near a hill 680m away. After how many seconds will the echo be heard? (v_sound = 340 m/s)", "Why must a concert hall have sound-absorbing material on walls? What would happen without it?"] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["Why can bats navigate in total darkness using ultrasound but not humans?", "How does a doctor use ultrasound to detect a kidney stone? Explain the physics."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Sound from vibration: sources and the medium requirement", tier: "foundational", teachingNote: "Bell-in-vacuum demo (video); vibrating tuning fork in water; feeling vibration of a speaker" },
    { step: 2, concept: "Longitudinal wave: compressions and rarefactions", tier: "easy", dependsOnStep: 1, teachingNote: "Slinky demonstration: push end → compression travels; pull → rarefaction travels" },
    { step: 3, concept: "Wave properties: frequency, wavelength, amplitude, speed", tier: "medium", dependsOnStep: 2, teachingNote: "Relate each property to the experience of sound: pitch, loudness, quality" },
    { step: 4, concept: "v = fλ: calculation and proportional reasoning", tier: "medium", dependsOnStep: 3, teachingNote: "If frequency doubles, wavelength halves (same speed in same medium)" },
    { step: 5, concept: "Speed of sound: medium dependence and temperature dependence", tier: "medium", dependsOnStep: 2, teachingNote: "Table: speed in air, water, steel; reason from particle density" },
    { step: 6, concept: "Reflection of sound and echo: condition and formula", tier: "medium", dependsOnStep: 5, teachingNote: "Echo condition: 0.1 s gap; minimum distance 17m. Derive from formula." },
    { step: 7, concept: "Range of hearing; infrasound and ultrasound", tier: "easy", dependsOnStep: 3, teachingNote: "Human: 20–20000 Hz. Ultrasound >20000 Hz. Animals: bats, dogs, dolphins" },
    { step: 8, concept: "Applications: SONAR, medical ultrasound, echocardiography", tier: "medium", dependsOnStep: 6, teachingNote: "Apply echo formula to SONAR depth finding; connect to medical imaging" },
  ],

  realLifeApplications: [
    { context: "SONAR and ocean mapping", conceptUsed: "Echo: d = vt/2 with v = speed of sound in water ≈ 1480 m/s", explanation: "Ships send ultrasound pulses down; measure time for echo; d = vt/2 gives ocean depth. Used to map the ocean floor and detect submarines.", ageRelevance: "Indian Navy uses SONAR; connects to national security context" },
    { context: "Medical ultrasound (pregnancy scan)", conceptUsed: "Ultrasound reflection at tissue boundaries", explanation: "Ultrasound (1–18 MHz) bounces off organs with different densities; reflected signals create an image. Safe at these frequencies (unlike X-rays).", ageRelevance: "Students may have seen ultrasound machines; very direct medical relevance" },
    { context: "Concert hall acoustics", conceptUsed: "Reverberation time; sound absorption", explanation: "Too many echoes (reverberation) make speech unintelligible. Concert halls use absorbing materials and curved ceilings to control echo and reflection for ideal acoustics.", ageRelevance: "Music and architecture; connects sound physics to design" },
  ],

  crossChapterLinks: [
    { subject: "Physics", classNum: 8, chapterId: "ch03", chapterName: "Sound (Class 8)", linkType: "builds-on", description: "Class 9 formalises and extends Class 8 Sound with wave properties, v=fλ, and applications" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Hearing mechanism in the ear", description: "The ear converts sound waves (compression/rarefaction) to nerve signals — physics of waves → biology of hearing", strength: "strong" },
    { subject: "Computer Science", topic: "Digital audio: sampling and frequency", description: "Digital sound is captured at 44,100 Hz (CD quality) — frequency concept directly applied in digital audio", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Activity: touch a vibrating tuning fork, feel vibration; pluck guitar string, observe vibration", duration: "10 minutes", pedagogyNote: "NEP-IDC: all sounds come from vibration — students feel and see it" },
    { step: 2, action: "Bell-in-vacuum video/demo: sound disappears as air is removed — medium is essential", duration: "10 minutes", pedagogyNote: "Key contrast with light: light passes through vacuum; sound cannot" },
    { step: 3, action: "Model longitudinal wave with students: stand in a line, push/pull to create compressions and rarefactions", duration: "15 minutes", pedagogyNote: "Kinesthetic learning; students ARE the wave particles" },
    { step: 4, action: "Define frequency, wavelength, amplitude; apply v = fλ with 3 examples", duration: "20 minutes", pedagogyNote: "Connect each property to experienced sound: low pitch piano vs high pitch whistle" },
    { step: 5, action: "Speed in different media: tabulate; explain from particle interaction model", duration: "15 minutes", pedagogyNote: "NEP-HOT: why does sound travel faster in steel than air? Interparticle force and density" },
    { step: 6, action: "Echo and reverberation: condition, formula, applications (SONAR, sonar numericals)", duration: "25 minutes", pedagogyNote: "Numerical practice: distance to mountain, ocean depth. Include minimum-distance-for-echo derivation." },
    { step: 7, action: "Ultrasound applications: medical imaging, SONAR, echolocation — discuss ethically (medical access)", duration: "15 minutes", pedagogyNote: "NEP-ETH: ultrasound imaging vs X-ray — safety implications; access in rural India" },
  ],
};

export const PHYSICS_CLASS9: ChapterKnowledge[] = [
  MOTION,
  FORCE_AND_LAWS_OF_MOTION,
  GRAVITATION,
  WORK_AND_ENERGY,
  SOUND,
];
