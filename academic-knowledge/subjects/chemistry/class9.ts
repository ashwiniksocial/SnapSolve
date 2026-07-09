/**
 * Academic Knowledge — Chemistry, Class 9
 * 4 NCERT chapters. Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

export const MATTER_IN_OUR_SURROUNDINGS: ChapterKnowledge = {
  chapterId: "ch01", chapterName: "Matter in Our Surroundings", classNum: 9, subject: "Chemistry", board: "Both",

  learningObjectives: [
    { statement: "Classify matter into three states based on physical properties", bloomsLevel: "understand", assessable: true },
    { statement: "Explain physical properties of each state in terms of particle arrangement and motion", bloomsLevel: "understand", assessable: true },
    { statement: "Explain interconversion of states using particle theory and the effect of temperature and pressure", bloomsLevel: "apply", assessable: true },
    { statement: "Define and distinguish evaporation from boiling; explain factors affecting evaporation", bloomsLevel: "understand", assessable: true },
    { statement: "Apply the particle model to explain latent heat, sublimation, and plasma", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Observe melting of ice — measure temperature; discover it stays at 0°C during melting (latent heat concept)" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Evaporation cools the surroundings' — explain using particle model and the concept of latent heat" },
    { ruleCode: "NEP-REPR", application: "Represent a substance's state changes on a heating curve (temperature vs time); label all phase transitions" },
  ],

  cbseOutcomes: [
    "Student defines matter and classifies its three states based on particle arrangement and properties",
    "Student explains interconversion of states using temperature and pressure effects",
    "Student distinguishes evaporation from boiling; explains factors affecting evaporation rate",
    "Student defines latent heat, sublimation, and explains plasma as the fourth state",
  ],

  icseOutcomes: [
    "ICSE additionally expects: calculations involving latent heat (Q = mL; L_fusion and L_vaporisation values)",
    "ICSE tests: kinetic theory basis for gas laws (conceptual level)",
  ],

  coreConcepts: [
    "All matter is made of tiny, constantly moving particles — kinetic theory",
    "The state of matter depends on the relative strength of interparticle forces and particle kinetic energy",
    "Temperature is the measure of average kinetic energy of particles",
    "At the melting/boiling point, added heat increases potential energy (breaks bonds) not kinetic energy — hence temperature stays constant (latent heat)",
    "Evaporation: surface phenomenon; only fastest particles escape at any temperature",
    "Pressure affects boiling point; temperature affects melting point (pressure affects it minimally for liquids)",
  ],

  subtopics: [
    { id: "t1", name: "States of Matter: Properties and Particle Explanation", coreConcept: "Solid: fixed shape/volume; Liquid: fixed volume, no fixed shape; Gas: no fixed shape/volume", keyIdea: "Property differences explained by interparticle distance and forces — not by the nature of the substance", estimatedPeriods: 2 },
    { id: "t2", name: "Interconversion of States", coreConcept: "Adding/removing energy changes particle motion; enough energy overcomes interparticle forces → state change", keyIdea: "Heating curve: temperature stays constant during phase change (latent heat)", estimatedPeriods: 3 },
    { id: "t3", name: "Evaporation", coreConcept: "Surface phenomenon: fastest molecules escape from liquid surface at any temperature; cools the liquid", keyIdea: "Distinguishing from boiling: evaporation is surface-only, no bubbles, occurs at any T", estimatedPeriods: 2 },
    { id: "t4", name: "Plasma: Fourth State", coreConcept: "Plasma: ionised gas at extremely high temperature; most matter in the universe is plasma", keyIdea: "Stars and lightning are plasma; not a Class 9 exam topic but conceptually important for NEP enrichment", estimatedPeriods: 1 },
  ],

  conceptGraph: [
    { from: "chm:9:ch01:particle-model", to: "chm:9:ch01:state-properties", relationship: "applies", explanation: "The arrangement and motion of particles directly explains the properties of each state" },
    { from: "chm:9:ch01:temperature-kinetic-energy", to: "chm:9:ch01:melting-boiling", relationship: "applies", explanation: "At melting/boiling point, temperature = constant → kinetic energy = constant → extra heat goes to potential energy (latent heat)" },
    { from: "chm:9:ch01:evaporation", to: "chm:9:ch01:cooling-effect", relationship: "applies", explanation: "When fast particles escape, average KE of remaining liquid decreases → temperature decreases → cooling effect" },
    { from: "chm:9:ch01:melting-boiling", to: "chm:9:ch02:pure-substance-vs-mixture", relationship: "applies", explanation: "Pure substances have sharp melting/boiling points; mixtures melt/boil over a range — used for identification" },
  ],

  prerequisites: {
    chapters: [{ subject: "Chemistry", classNum: 6, chapterId: "ch01", chapterName: "Sorting Materials Into Groups", requiredConcepts: ["chm:6:ch01:material-properties"] }],
    concepts: ["chm:6:ch01:material-properties", "chm:6:ch01:classification-criteria"],
  },

  essentialDefinitions: [
    { term: "Matter", formalDefinition: "Anything that has mass and occupies space", informalExplanation: "Everything you can touch, smell, or see that is 'stuff' — not energy, not ideas" },
    { term: "Solid", formalDefinition: "State of matter with definite shape and definite volume; particles closely packed with strong interparticle forces; vibrate in fixed positions", informalExplanation: "Fixed shape and size — a stone, ice cube" },
    { term: "Liquid", formalDefinition: "State of matter with definite volume but no definite shape; particles close together but can slide past each other; weaker intermolecular forces than solid", informalExplanation: "Takes the shape of the container; fixed volume — water, mercury" },
    { term: "Gas", formalDefinition: "State of matter with neither definite shape nor definite volume; particles far apart with negligible interparticle forces; move randomly at high speeds", informalExplanation: "Fills the entire container; compressible — air, steam" },
    { term: "Melting Point", formalDefinition: "The temperature at which a solid changes to a liquid at atmospheric pressure; characteristic of the substance", informalExplanation: "0°C for ice (water). At this temperature, added heat breaks bonds, not increases temperature." },
    { term: "Boiling Point", formalDefinition: "The temperature at which a liquid converts to vapour throughout the liquid at atmospheric pressure", informalExplanation: "100°C for water at 1 atm. At higher pressure (pressure cooker), boiling point is higher." },
    { term: "Latent Heat", formalDefinition: "The heat absorbed or released during a state change at constant temperature", informalExplanation: "Hidden heat — the temperature doesn't change during melting/boiling even though heat is being added" },
    { term: "Sublimation", formalDefinition: "The direct conversion of a solid to vapour without passing through the liquid state", informalExplanation: "Dry ice (solid CO₂) → CO₂ gas directly; also naphthalene (camphor) sublimes" },
    { term: "Evaporation", formalDefinition: "The conversion of liquid to vapour at the surface of the liquid at any temperature below boiling point", informalExplanation: "Water in a glass slowly disappears — evaporation. Not the same as boiling." },
  ],

  formulaInventory: [
    { name: "Latent Heat", latex: "Q = mL", plainText: "Q = mL", variables: [{ symbol: "Q", meaning: "heat absorbed/released (J)" }, { symbol: "m", meaning: "mass of substance (kg or g)" }, { symbol: "L", meaning: "specific latent heat (J/kg or J/g); L_fusion for melting; L_vaporisation for boiling" }], applicableWhen: "Phase transition at constant temperature", doesNotApplyWhen: "Temperature change requires Q = mcΔT (sensible heat, not latent)" },
  ],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Temperature rises continuously when heating a substance", correction: "During a phase change (melting or boiling), temperature remains constant because added heat goes into overcoming interparticle forces (latent heat), not into increasing kinetic energy", whyItHappens: "Students expect temperature to always increase with heat; the plateau on a heating curve surprises them", revealingQuestion: "You heat ice at −10°C until it becomes steam at 110°C. Sketch a temperature-time graph." },
    { misconception: "Evaporation and boiling are the same process", correction: "Evaporation: surface phenomenon, occurs at any temperature, causes cooling. Boiling: bulk phenomenon, occurs only at boiling point, produces bubbles throughout the liquid.", whyItHappens: "Both produce vapour from liquid — students see them as identical", revealingQuestion: "On a hot day, water evaporates from a puddle at 30°C, well below 100°C. How is this possible?" },
    { misconception: "Gases have no mass because they 'float'", correction: "Gases have mass — air has density ≈ 1.2 kg/m³. The reason gases seem to 'float' is that their buoyancy (from the surrounding air) often counteracts their weight in small amounts", whyItHappens: "Gases are invisible; students confuse invisibility with masslessness", revealingQuestion: "Inflate a balloon and weigh it. Does a balloon weigh more when inflated? Why?" },
  ],

  examinerTraps: [
    { trap: "Stating melting point varies with pressure", typicalScenario: "Student says 'ice melts at higher temperature with more pressure' — actually opposite for water (ice melts at slightly LOWER T under pressure)", avoidanceStrategy: "For CBSE/ICSE Class 9: focus on boiling point variation with pressure (higher pressure → higher boiling point). Ice melting point under pressure decreases, but this detail is not required.", marksAtRisk: "½–1 mark for wrong pressure-melting point relationship" },
    { trap: "Confusing latent heat of fusion and vaporisation values", typicalScenario: "Student uses L_fusion for a boiling calculation or vice versa", avoidanceStrategy: "L_fusion (melting/freezing) is much less than L_vaporisation (boiling/condensing). For water: L_fusion = 334 J/g; L_vaporisation = 2260 J/g. Learn both values.", marksAtRisk: "Full marks wrong for using wrong L value" },
  ],

  typicalMistakes: [
    { mistake: "Liquids have 'no interparticle forces'", correction: "Liquids have weaker interparticle forces than solids but not zero. If they had none, the liquid would immediately become a gas.", conceptualError: "Thinking only gases have weak forces and all condensed matter (solid/liquid) is binary in this regard" },
    { mistake: "Sublimation means liquid → gas", correction: "Sublimation is SOLID → GAS directly, skipping the liquid state. Liquid → gas at boiling is called vaporisation or evaporation.", conceptualError: "Confusing sublimation with vaporisation" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["Explain why your wet clothes dry faster on a windy day even when temperature is low.", "Draw and explain the heating curve for water from −10°C to 120°C."] },
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["Why does putting alcohol on skin feel cold? Use particle model to explain.", "Compare rates of evaporation: hot day vs cold day; dry day vs humid day. Explain each factor."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Three states of matter: observable properties", tier: "foundational", teachingNote: "Show ice, water, steam — same substance, three states. List observable differences." },
    { step: 2, concept: "Particle model: explain properties from particle arrangement", tier: "easy", dependsOnStep: 1, teachingNote: "Draw particle diagrams for solid, liquid, gas — spacing and arrangement" },
    { step: 3, concept: "Interconversion: effect of temperature on state", tier: "medium", dependsOnStep: 2, teachingNote: "Heat ice → liquid → gas; remove heat → reverse. Energy changes interparticle forces." },
    { step: 4, concept: "Latent heat: why temperature stays constant during phase change", tier: "hard", dependsOnStep: 3, teachingNote: "This is counterintuitive — heating but not warming. Graph the heating curve." },
    { step: 5, concept: "Effect of pressure on boiling point", tier: "medium", dependsOnStep: 3, teachingNote: "Pressure cooker: higher pressure → higher boiling point → faster cooking" },
    { step: 6, concept: "Evaporation vs boiling: differences and factors", tier: "medium", dependsOnStep: 3, teachingNote: "Factor analysis: temperature, surface area, humidity, wind speed — each increases evaporation" },
    { step: 7, concept: "Sublimation: direct solid → gas; examples", tier: "easy", dependsOnStep: 3, teachingNote: "Camphor balls shrinking; dry ice; iodine — familiar examples" },
  ],

  realLifeApplications: [
    { context: "Pressure cooker cooks food faster", conceptUsed: "Boiling point increases with pressure", explanation: "Inside a pressure cooker, pressure is above atmospheric. Higher pressure raises boiling point (>100°C), so food cooks faster at higher temperature.", ageRelevance: "Every Indian household uses a pressure cooker" },
    { context: "Sweating and body temperature regulation", conceptUsed: "Evaporation cools the surface (latent heat of vaporisation)", explanation: "When sweat evaporates, it takes latent heat from the skin — the skin cools down. More sweat evaporation → more cooling.", ageRelevance: "Personal biology; hot Indian summers" },
    { context: "Refrigerator and air conditioner", conceptUsed: "Evaporation absorbs heat; condensation releases heat", explanation: "Refrigerant liquid evaporates inside the fridge (absorbs heat from food); condenses outside (releases heat to room). This cycle continuously removes heat from food.", ageRelevance: "Common household appliance; connects to Chemistry and Physics" },
  ],

  crossChapterLinks: [
    { subject: "Chemistry", classNum: 9, chapterId: "ch02", chapterName: "Is Matter Around Us Pure?", linkType: "prerequisite-for", description: "Sharp melting/boiling points identify pure substances; mixtures melt/boil over a range — established in this chapter" },
    { subject: "Physics", classNum: 9, chapterId: "ch04", chapterName: "Work and Energy", linkType: "parallel-concept", description: "Latent heat is potential energy stored in bonds; kinetic energy determines temperature — physics energy concepts applied to chemistry" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Thermal energy and heat transfer", description: "Heat flows from high to low temperature; melting/boiling are heat absorption processes studied as thermal energy in physics", strength: "strong" },
    { subject: "Biology", topic: "Evaporation in transpiration and sweating", description: "Plants lose water through transpiration (evaporation through leaves); animals regulate temperature through sweat evaporation — same physical process", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Show ice, water, steam from the same source — observe differences in shape, volume, compressibility", duration: "10 minutes", pedagogyNote: "Start with observation; classification comes second" },
    { step: 2, action: "Introduce particle model; draw three-state diagrams; explain each property from particle arrangement", duration: "20 minutes", pedagogyNote: "Animated video of particle motion in each state greatly helps — use it if available" },
    { step: 3, action: "Heating experiment: heat ice and record temperature every minute — observe plateau at 0°C and 100°C", duration: "25 minutes", pedagogyNote: "NEP-IDC: students discover latent heat from data before the concept is explained" },
    { step: 4, action: "Explain latent heat: why temperature stays constant; derive Q = mL concept", duration: "20 minutes", pedagogyNote: "The extra energy goes into breaking bonds — potential energy increases, kinetic energy stays the same" },
    { step: 5, action: "Evaporation vs boiling: compare and contrast; list factors affecting evaporation rate", duration: "15 minutes", pedagogyNote: "Real examples: clothes drying, alcohol cooling, wet hair in wind" },
    { step: 6, action: "Pressure effects: pressure cooker, high altitude cooking — connect to daily life", duration: "10 minutes", pedagogyNote: "NEP-COMP: calculate the boiling point at high altitude — qualitative at this level" },
    { step: 7, action: "Plasma discussion and NEP enrichment: where is plasma found in nature and technology?", duration: "10 minutes", pedagogyNote: "Beyond syllabus but wonderful for curiosity: stars, lightning, neon signs, fusion reactors" },
  ],
};

/** CHANGE-023: Official 2026-27 chapter name is "Exploring Mixtures" (was "Is Matter Around Us Pure?" in pre-2026-27 NCERT). */
export const IS_MATTER_AROUND_US_PURE: ChapterKnowledge = {
  chapterId: "ch02", chapterName: "Exploring Mixtures", classNum: 9, subject: "Chemistry", board: "Both",

  learningObjectives: [
    { statement: "Distinguish between pure substances and mixtures using physical properties", bloomsLevel: "understand", assessable: true },
    { statement: "Classify mixtures as homogeneous or heterogeneous with examples", bloomsLevel: "understand", assessable: true },
    { statement: "Select and apply appropriate separation techniques for given mixtures", bloomsLevel: "apply", assessable: true },
    { statement: "Distinguish between elements and compounds; explain why water is a compound not a mixture", bloomsLevel: "analyse", assessable: true },
    { statement: "Explain physical and chemical properties of solutions including concentration", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Given a mixture of substances, identify the appropriate separation technique — without being told which to use" },
    { ruleCode: "NEP-HOT", application: "Evaluate: is milk a pure substance? Is blood a pure substance? Justify using the definition of mixture" },
    { ruleCode: "NEP-IDC", application: "Prepare a solution of salt in water; vary concentration; measure properties — discover what concentration means" },
  ],

  cbseOutcomes: [
    "Student distinguishes pure substances from mixtures based on properties (sharp MP/BP, constant composition)",
    "Student identifies appropriate separation technique for a given mixture",
    "Student defines solution, solvent, solute, concentration, and solubility",
    "Student distinguishes elements from compounds; gives examples of each",
  ],

  icseOutcomes: [
    "ICSE expects: numerical calculations involving concentration (mass/mass%, molarity at introductory level)",
    "ICSE additionally covers: types of solutions (saturated, unsaturated, supersaturated)",
  ],

  coreConcepts: [
    "Pure substance: fixed composition; sharp melting/boiling point; single substance",
    "Mixture: variable composition; no sharp melting/boiling point; properties depend on composition",
    "Homogeneous mixture (solution): uniform composition throughout; cannot be separated by filtration",
    "Heterogeneous mixture: non-uniform composition; visibly separable phases",
    "Elements: simplest pure substances; cannot be chemically decomposed",
    "Compounds: two or more elements chemically combined in fixed proportion; properties differ from constituent elements",
  ],

  subtopics: [
    { id: "t1", name: "Pure Substances and Mixtures", coreConcept: "Pure substance: fixed, reproducible properties. Mixture: properties vary with composition.", keyIdea: "Salt water: melting point not 0°C; boiling point not 100°C — the mixture test", estimatedPeriods: 2 },
    { id: "t2", name: "Types of Mixtures: Homogeneous and Heterogeneous", coreConcept: "Homogeneous: same properties throughout (solutions). Heterogeneous: different properties in different parts.", keyIdea: "Seawater is homogeneous; soil is heterogeneous; colloids and suspensions are in between", estimatedPeriods: 2 },
    { id: "t3", name: "Separation Techniques", coreConcept: "Separation exploits differences in physical properties: boiling point (distillation), density (centrifugation), solubility (chromatography)", keyIdea: "Match the technique to the property difference between components", estimatedPeriods: 3 },
    { id: "t4", name: "Elements and Compounds", coreConcept: "Elements: cannot be decomposed; compounds: can be decomposed chemically; properties differ from components", keyIdea: "Water is compound (not mixture): fixed composition, different properties from H₂ and O₂, formed with energy change", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "chm:9:ch01:melting-boiling", to: "chm:9:ch02:pure-substance-vs-mixture", relationship: "applies", explanation: "Pure substances have sharp melting/boiling points; mixtures have a range — the property from Chapter 1 enables classification" },
    { from: "chm:9:ch02:solubility", to: "chm:9:ch03:atoms-and-molecules", relationship: "applies", explanation: "Solubility depends on the nature of the solute and solvent — ultimately on atomic/molecular structure" },
    { from: "chm:9:ch02:separation-techniques", to: "chm:9:ch03:law-constant-proportions", relationship: "applies", explanation: "Separation techniques cannot change the composition of a compound — compounds have fixed proportions regardless of separation" },
  ],

  prerequisites: {
    chapters: [{ subject: "Chemistry", classNum: 6, chapterId: "ch02", chapterName: "Separation of Substances", requiredConcepts: ["chm:6:ch02:filtration", "chm:6:ch02:evaporation"] }],
    concepts: ["chm:6:ch02:mixture-definition", "chm:6:ch02:sedimentation-decantation"],
  },

  essentialDefinitions: [
    { term: "Solution", formalDefinition: "A homogeneous mixture of two or more substances; the minor component is the solute, the major component is the solvent", informalExplanation: "Salt water: salt (solute) dissolves completely in water (solvent) — uniform throughout" },
    { term: "Concentration", formalDefinition: "The amount of solute present in a given amount of solution; expressed as mass/mass%, mass/volume%, or molarity", informalExplanation: "How 'strong' the solution is — more salt per litre = higher concentration" },
    { term: "Saturated Solution", formalDefinition: "A solution in which no more solute can be dissolved at that temperature", informalExplanation: "Maximum salt in water at a given temperature — adding more salt doesn't dissolve" },
    { term: "Colloid", formalDefinition: "A heterogeneous mixture where solute particles (1–100 nm) are dispersed throughout the solvent and do not settle out; shows the Tyndall effect", informalExplanation: "Milk, fog, starch solution — particles too small to see but big enough to scatter light" },
    { term: "Suspension", formalDefinition: "A heterogeneous mixture where large particles (>100 nm) are dispersed and eventually settle on standing", informalExplanation: "Muddy water — particles visible, settles after standing" },
    { term: "Element", formalDefinition: "A pure substance that cannot be decomposed into simpler substances by chemical means; consists of one kind of atom", informalExplanation: "Gold, oxygen, carbon — the building blocks that cannot be broken down further by chemistry" },
    { term: "Compound", formalDefinition: "A pure substance formed by chemical combination of two or more elements in a fixed mass ratio; has properties distinct from those of its constituent elements", informalExplanation: "Water (H₂O): made from hydrogen and oxygen, but is neither a gas like oxygen nor explosive like hydrogen" },
  ],

  formulaInventory: [
    { name: "Mass Percentage Concentration", latex: "\\text{Concentration (mass\\%)} = \\frac{\\text{mass of solute}}{\\text{mass of solution}} \\times 100", plainText: "Conc (mass%) = (mass of solute / mass of solution) × 100", variables: [], applicableWhen: "When both solute and solution are measured by mass", doesNotApplyWhen: "For volume measurements, use mass/volume% or molarity" },
  ],

  lawsAndTheorems: [
    { name: "Law of Constant Proportions (as applied to compounds)", type: "law", statement: "A compound always contains the same elements combined in the same mass ratio, regardless of how it is prepared or its source", boardRelevance: "Stated in Chapter 3 formally; the concept is introduced here to distinguish compound from mixture", discoveredBy: "Joseph Proust, 1799" },
  ],

  commonMisconceptions: [
    { misconception: "Air is a pure substance because it looks uniform", correction: "Air is a mixture (mainly N₂ and O₂ plus other gases). Its composition varies (more CO₂ in cities, more humidity near ocean). A pure substance has fixed, invariable composition.", whyItHappens: "Air looks transparent and homogeneous", revealingQuestion: "Why is air classified as a mixture even though it looks perfectly uniform?" },
    { misconception: "Compounds and mixtures are the same — both contain more than one substance", correction: "Key differences: (1) Compounds have fixed proportions; mixtures have variable proportions. (2) Compound formation involves energy change; mixing does not. (3) Compound has different properties from its elements; mixture retains properties of its components.", whyItHappens: "Both involve multiple substances", revealingQuestion: "Iron and sulfur mixed together vs iron sulfide (compound) — list three differences." },
    { misconception: "All homogeneous mixtures are solutions", correction: "All solutions are homogeneous, but all homogeneous substances are not solutions. Gaseous mixtures (air), and alloys (solid solutions) are all solutions. A pure substance is also homogeneous but not a solution.", whyItHappens: "Students think homogeneous = solution", revealingQuestion: "Is a piece of copper (pure metal) homogeneous? Is it a solution?" },
  ],

  examinerTraps: [
    { trap: "Confusing distillation and fractional distillation", typicalScenario: "Student uses 'distillation' for the separation of a mixture of liquids with similar boiling points (e.g., acetone and water)", avoidanceStrategy: "Distillation: one volatile liquid in non-volatile solvent. Fractional distillation: two or more miscible liquids with CLOSE boiling points (e.g., ethanol/water; crude oil refining)", marksAtRisk: "1 mark for wrong technique named" },
    { trap: "Tyndall effect definition confused with filtration", typicalScenario: "Student says 'colloids can be separated by filtration; solutions cannot'", avoidanceStrategy: "Neither solutions nor colloids can be separated by ordinary filtration. Colloids are identified by the Tyndall effect (scattering of light); separated by centrifugation or special membranes.", marksAtRisk: "1 mark for wrong property" },
  ],

  typicalMistakes: [
    { mistake: "Water is a mixture of hydrogen and oxygen", correction: "Water is a COMPOUND, not a mixture. Hydrogen and oxygen are combined in a fixed 1:8 mass ratio with energy release. The resulting substance has completely different properties from the two elements.", conceptualError: "Not knowing the compound-mixture distinction" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["How would you separate a mixture of salt, sand, and iron filings? Give the sequence of steps.", "Justify why paper chromatography separates ink colours."] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["Prove that copper sulphate is a compound, not a mixture, using three different criteria."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Pure substance vs mixture: definition and examples", tier: "easy", teachingNote: "Use salt in water vs pure water; show melting point comparison" },
    { step: 2, concept: "Homogeneous vs heterogeneous mixtures", tier: "easy", dependsOnStep: 1, teachingNote: "Solution vs soil — see through vs visible particles" },
    { step: 3, concept: "Solution components: solute, solvent, concentration", tier: "medium", dependsOnStep: 2, teachingNote: "Hands-on: dissolve different amounts of sugar in fixed water; taste the difference = concentration" },
    { step: 4, concept: "Colloids and suspensions: Tyndall effect, settling", tier: "medium", dependsOnStep: 2, teachingNote: "Shine torch through milk (Tyndall visible) vs salt solution (Tyndall not visible)" },
    { step: 5, concept: "Separation techniques: match property → technique", tier: "medium", dependsOnStep: 3, teachingNote: "Table: technique, property exploited, example mixture" },
    { step: 6, concept: "Element vs compound: definition, example, properties", tier: "medium", dependsOnStep: 1, teachingNote: "Iron vs iron oxide; hydrogen + oxygen vs water — dramatic difference in properties" },
    { step: 7, concept: "Compound vs mixture: three criteria", tier: "hard", dependsOnStep: 6, teachingNote: "The three tests: fixed proportion, energy change on formation, different properties — apply all three to classify" },
  ],

  realLifeApplications: [
    { context: "Fractional distillation of crude oil", conceptUsed: "Separation of liquids with different boiling points", explanation: "Crude oil is fractionally distilled to obtain petrol, diesel, kerosene, LPG. Different fractions condense at different temperatures in the distillation column.", ageRelevance: "India is a major oil consumer; energy independence context" },
    { context: "Paper chromatography in forensic science", conceptUsed: "Chromatography: different solubility of components in a solvent", explanation: "Ink from a suspected forgery can be separated by chromatography; the pattern of colours uniquely identifies the pen manufacturer", ageRelevance: "Crime science; engaging context" },
    { context: "Sewage treatment: separation of water from waste", conceptUsed: "Sedimentation, centrifugation, filtration", explanation: "Water treatment uses multiple separation steps to purify water before it re-enters the supply — real application of chapter techniques", ageRelevance: "Water scarcity and sanitation are critical Indian issues" },
  ],

  crossChapterLinks: [
    { subject: "Chemistry", classNum: 9, chapterId: "ch03", chapterName: "Atoms and Molecules", linkType: "prerequisite-for", description: "Compounds must contain atoms of different elements in fixed ratio — Dalton's atomic theory explains Chapter 2 observations" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Blood and its components", description: "Blood is a colloid/suspension containing plasma (solution), red/white blood cells (suspended particles) — applying mixture concepts to biology", strength: "strong" },
    { subject: "Economics", topic: "Oil refining and petroleum economics", description: "Fractional distillation is the basis of the petroleum industry; the economic value of different fractions drives pricing", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Salt-in-water activity: observe dissolution, taste at different concentrations", duration: "10 minutes", pedagogyNote: "NEP-IDC: hands-on solution preparation" },
    { step: 2, action: "Classify 10 everyday substances as pure/mixture, homogeneous/heterogeneous", duration: "15 minutes", pedagogyNote: "Students classify from prior knowledge; discuss disagreements — builds metacognition" },
    { step: 3, action: "Tyndall effect demonstration: torch through milk, starch, salt solution", duration: "10 minutes", pedagogyNote: "Three liquids look similar; but colloid scatters light, solution does not" },
    { step: 4, action: "Separation techniques: demonstrate at least 2 (e.g., distillation, chromatography) or use video", duration: "25 minutes", pedagogyNote: "Connect each step of the technique to the physical property being exploited" },
    { step: 5, action: "Element vs compound: heating copper in air forms copper oxide (compound); properties comparison", duration: "20 minutes", pedagogyNote: "If demonstration not possible, show photos/video of dramatic reactions forming compounds" },
    { step: 6, action: "Compound vs mixture: apply three criteria to classify given examples", duration: "15 minutes", pedagogyNote: "NEP-HOT: is air a compound? Is salt water a compound? Use the criteria systematically" },
  ],
};

export const ATOMS_AND_MOLECULES: ChapterKnowledge = {
  chapterId: "ch03", chapterName: "Atoms and Molecules", classNum: 9, subject: "Chemistry", board: "Both",

  learningObjectives: [
    { statement: "State the Laws of Chemical Combination and explain what they imply for atomic theory", bloomsLevel: "understand", assessable: true },
    { statement: "State Dalton's Atomic Theory and identify which postulates are still valid", bloomsLevel: "understand", assessable: true },
    { statement: "Define atomic mass, molecular mass, and the mole; relate them", bloomsLevel: "understand", assessable: true },
    { statement: "Write chemical formulae of compounds using valency rules", bloomsLevel: "apply", assessable: true },
    { statement: "Calculate molar mass, number of moles, and number of particles using N_A", bloomsLevel: "apply", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-PROB", application: "Calculate how many molecules of CO₂ are in 44g — choose the mole concept approach without prompting" },
    { ruleCode: "NEP-HOT", application: "Evaluate Dalton's postulate that atoms cannot be created or destroyed — is this still valid? What modifications were needed?" },
    { ruleCode: "NEP-COMP", application: "Calculate the number of particles of water in a glass (250 mL) — connect abstract mole to tangible quantity" },
  ],

  cbseOutcomes: [
    "Student states the Law of Conservation of Mass and Law of Constant Proportions with examples",
    "Student states Dalton's Atomic Theory and its postulates",
    "Student defines atomic mass, molecular mass using carbon-12 reference",
    "Student writes correct formulae of ionic and covalent compounds using valencies",
    "Student performs calculations using the mole concept (moles, mass, number of particles)",
  ],

  icseOutcomes: [
    "ICSE expects: derivation and application of the Law of Multiple Proportions",
    "ICSE additionally tests: gram atomic mass, gram molecular mass, molar volume of gases at STP",
  ],

  coreConcepts: [
    "Laws of chemical combination emerged from careful experiment and led to the need for atomic theory",
    "Dalton's Atomic Theory: matter is made of indivisible atoms; atoms of same element are identical; atoms combine in simple whole-number ratios",
    "The mole is the chemist's counting unit: 1 mole = 6.022 × 10²³ particles (Avogadro's number)",
    "Molar mass of a substance (in grams) numerically equals the relative atomic/molecular mass in amu",
    "Chemical formulae encode the ratio of atoms; valency determines combining capacity",
  ],

  subtopics: [
    { id: "t1", name: "Laws of Chemical Combination", coreConcept: "Conservation of mass; constant proportions — empirical laws that demanded an explanation", keyIdea: "Lavoisier's experiments showed mass is conserved; Proust showed fixed composition — Dalton explained both with atoms", estimatedPeriods: 2 },
    { id: "t2", name: "Dalton's Atomic Theory", coreConcept: "Atoms are the smallest unit of matter that participates in chemical reactions; combine in fixed ratios", keyIdea: "Postulates explain both laws; some postulates later revised (atoms divisible, isotopes exist)", estimatedPeriods: 2 },
    { id: "t3", name: "Atoms: Mass, Symbol, Relative Mass", coreConcept: "Atomic mass is relative to carbon-12 = 12 amu; atomic symbols are universal", keyIdea: "Atomic mass is relative, not absolute — the amu scale makes calculations manageable", estimatedPeriods: 2 },
    { id: "t4", name: "Molecules and Chemical Formulae", coreConcept: "Molecular formula shows number and types of atoms; written using valency rules", keyIdea: "Valency is the combining capacity; cross-multiply rule for ionic compounds", estimatedPeriods: 2 },
    { id: "t5", name: "Mole Concept", coreConcept: "1 mole = 6.022×10²³ entities = molar mass in grams; connects microscopic atoms to macroscopic measurements", keyIdea: "The mole bridges the undetectable atom world and the measurable laboratory world", estimatedPeriods: 3 },
  ],

  conceptGraph: [
    { from: "chm:9:ch03:law-conservation-mass", to: "chm:9:ch03:dalton-theory", relationship: "applies", explanation: "Dalton's postulate that atoms are not created or destroyed explains mass conservation" },
    { from: "chm:9:ch03:law-constant-proportions", to: "chm:9:ch03:dalton-theory", relationship: "applies", explanation: "Fixed composition of compounds follows from atoms combining in fixed whole-number ratios" },
    { from: "chm:9:ch03:atomic-mass", to: "chm:9:ch03:molar-mass", relationship: "applies", explanation: "Molar mass (g/mol) = relative atomic/molecular mass in amu numerically" },
    { from: "chm:9:ch03:mole-definition", to: "chm:9:ch03:stoichiometry", relationship: "applies", explanation: "Mole ratios in a chemical equation enable mass calculations" },
    { from: "chm:9:ch03:valency", to: "chm:9:ch03:chemical-formula-writing", relationship: "applies", explanation: "Valency (combining capacity) determines the subscripts in a chemical formula" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Chemistry", classNum: 9, chapterId: "ch02", chapterName: "Is Matter Around Us Pure?", requiredConcepts: ["chm:9:ch02:element-definition", "chm:9:ch02:compound-definition"] },
    ],
    concepts: ["chm:9:ch02:element-definition", "chm:9:ch02:compound-vs-mixture"],
  },

  essentialDefinitions: [
    { term: "Atom", formalDefinition: "The smallest particle of an element that retains the chemical properties of the element and can participate in chemical reactions", informalExplanation: "The building block of elements — too small to see, but determines all chemical behaviour" },
    { term: "Molecule", formalDefinition: "The smallest particle of a substance that can exist independently with all the chemical properties of the substance; consists of two or more atoms (same or different element)", informalExplanation: "Atoms bonded together: H₂O has two H atoms and one O atom bonded" },
    { term: "Atomic Mass Unit (amu)", formalDefinition: "1 amu = 1/12 the mass of a carbon-12 atom = 1.66 × 10⁻²⁷ kg", informalExplanation: "The unit for measuring mass of atoms — tiny but consistent; carbon-12 = 12 amu by definition" },
    { term: "Valency", formalDefinition: "The combining capacity of an element; the number of electrons lost, gained, or shared by an atom to form bonds", informalExplanation: "How many bonds an atom can make — oxygen has valency 2, hydrogen has valency 1" },
    { term: "Mole", formalDefinition: "The amount of substance containing as many elementary entities as there are atoms in exactly 12g of carbon-12; 1 mole = 6.022 × 10²³ entities", informalExplanation: "A chemist's 'dozen' — but an enormously large dozen: 602,200,000,000,000,000,000,000 particles" },
    { term: "Avogadro's Number (N_A)", formalDefinition: "N_A = 6.022 × 10²³ mol⁻¹; the number of particles in one mole of any substance", informalExplanation: "Named after Amedeo Avogadro; this number bridges the atomic world and the laboratory world" },
    { term: "Molar Mass", formalDefinition: "The mass of one mole of a substance in grams per mole; numerically equal to the relative atomic or molecular mass in amu", informalExplanation: "The molar mass of water (H₂O) is 18 g/mol because one mole of water has mass 18 grams" },
  ],

  formulaInventory: [
    { name: "Number of Moles", latex: "n = \\frac{m}{M}", plainText: "n = m/M", variables: [{ symbol: "n", meaning: "number of moles (mol)" }, { symbol: "m", meaning: "mass of substance (g)" }, { symbol: "M", meaning: "molar mass (g/mol)" }], applicableWhen: "Converting between mass and moles", doesNotApplyWhen: "For gases at STP, can also use n = V/22.4 (volume/molar volume)" },
    { name: "Number of Particles", latex: "N = n \\times N_A", plainText: "N = n × 6.022×10²³", variables: [{ symbol: "N", meaning: "number of particles (atoms/molecules/ions)" }, { symbol: "n", meaning: "number of moles" }, { symbol: "N_A", meaning: "Avogadro's number = 6.022×10²³ mol⁻¹" }], applicableWhen: "Converting between moles and number of particles", doesNotApplyWhen: "Always applicable for any substance" },
    { name: "Molecular Mass", latex: "M_{molecule} = \\sum (\\text{atomic masses of all atoms in formula})", plainText: "M_molecule = sum of all atomic masses in one molecule", variables: [], applicableWhen: "Calculate from chemical formula; multiply each element's atomic mass by its subscript in the formula", doesNotApplyWhen: "For empirical formula, need additional information to find molecular formula" },
  ],

  lawsAndTheorems: [
    { name: "Law of Conservation of Mass", type: "law", statement: "In any chemical reaction, the total mass of reactants equals the total mass of products; mass is neither created nor destroyed", discoveredBy: "Antoine Lavoisier, 1774", boardRelevance: "State and verify with a balanced equation (2 marks); application in mass calculations" },
    { name: "Law of Constant Proportions (Definite Proportions)", type: "law", statement: "A chemical compound always contains the same elements in the same mass ratio, regardless of the source or method of preparation", discoveredBy: "Joseph Proust, 1799", boardRelevance: "State and give example (2 marks); distinguish compound from mixture" },
  ],

  commonMisconceptions: [
    { misconception: "One mole contains 6.022×10²³ atoms always", correction: "One mole contains 6.022×10²³ ENTITIES — which could be atoms, molecules, ions, formula units, or electrons depending on the substance. 1 mole of H₂ has 6.022×10²³ molecules but 12.044×10²³ atoms.", whyItHappens: "Students learn 'mole = Avogadro's number' without specifying 'of what entity'", revealingQuestion: "How many atoms are in 1 mole of H₂ gas?" },
    { misconception: "Atomic mass of an element is always a whole number", correction: "Atomic masses are averages of the masses of all isotopes of an element weighted by their natural abundance. Chlorine = 35.5 amu (mixture of Cl-35 and Cl-37)", whyItHappens: "Students see whole numbers for common elements (H=1, O=16, N=14) and generalise", revealingQuestion: "Why is the atomic mass of chlorine 35.5 and not a whole number?" },
    { misconception: "Valency is always a fixed number for an element", correction: "Some elements have variable valency: iron (Fe) has valencies 2 and 3; copper has valencies 1 and 2. The valency changes depending on the compound formed.", whyItHappens: "Introductory treatment gives only one valency per element", revealingQuestion: "Write the formula for iron(II) oxide and iron(III) oxide. What are the valencies of iron in each?" },
  ],

  examinerTraps: [
    { trap: "Writing formulae with valency switched (not crossed-over correctly)", typicalScenario: "Al₂O₃: student writes Al₃O₂ by not crossing valencies correctly", avoidanceStrategy: "Cross-valency rule: Al has valency 3, O has valency 2. Write subscript of second as valency of first: Al₂O₃. Always verify: sum of charges must be zero", marksAtRisk: "1 mark per wrong formula" },
    { trap: "Confusing molecular mass calculation for hydrated salts", typicalScenario: "Finding molar mass of CuSO₄·5H₂O without including the 5 water molecules", avoidanceStrategy: "For hydrated salts: M = M(anhydrous salt) + n × M(water). CuSO₄·5H₂O = 160 + 5×18 = 250 g/mol", marksAtRisk: "Full calculation marks" },
  ],

  typicalMistakes: [
    { mistake: "Number of moles = molar mass / mass (inverted formula)", correction: "n = mass/molar mass. Mass is the numerator — 'how many moles in this mass?'", conceptualError: "Inverting the formula for moles" },
    { mistake: "MgO formula written as MgO₂ (treating Mg valency as 2 means 2 oxygens)", correction: "Mg has valency 2, O has valency 2. Cross gives Mg₂O₂ → simplify to MgO (by dividing both subscripts by 2)", conceptualError: "Not simplifying the formula after cross-multiplying equal valencies" },
  ],

  bloomsMap: [
    { subtopicId: "t5", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["Calculate how many atoms of oxygen are in 36g of water.", "If you had 1 mole of sand grains, how many times could you cover the surface of Earth? (Area Earth = 5×10¹⁴ m²; 1 grain ≈ 1mm²)"] },
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "evaluate"], hotsStarters: ["Evaluate Dalton's postulate that 'atoms are indivisible'. Is this still considered true?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Law of Conservation of Mass: verify with a reaction", tier: "easy", teachingNote: "Weigh reactants; react; weigh products — mass is conserved" },
    { step: 2, concept: "Law of Constant Proportions: water is always 1:8 H:O by mass", tier: "easy", dependsOnStep: 1, teachingNote: "Show water from different sources always has same composition — this is surprising and powerful" },
    { step: 3, concept: "Dalton's Atomic Theory: postulates and their connection to the two laws", tier: "medium", dependsOnStep: 2, teachingNote: "Each postulate explains one observation — make the connection explicit" },
    { step: 4, concept: "Atomic mass and symbols; molecular mass calculation", tier: "medium", dependsOnStep: 3, teachingNote: "Use the periodic table; molecular mass = sum of atomic masses × subscripts" },
    { step: 5, concept: "Valency and formula writing: cross-valency rule", tier: "medium", dependsOnStep: 4, teachingNote: "Start with simple compounds (NaCl, MgO) before complex ones (Al₂(SO₄)₃)" },
    { step: 6, concept: "Mole concept: definition, Avogadro's number", tier: "medium", dependsOnStep: 4, teachingNote: "Analogy: a dozen = 12; a mole = 6.022×10²³. Why such a large number? Because atoms are tiny." },
    { step: 7, concept: "Mole calculations: n = m/M; N = n × N_A", tier: "hard", dependsOnStep: 6, teachingNote: "Practice all three versions: find moles from mass, find mass from moles, find particles from moles" },
  ],

  realLifeApplications: [
    { context: "Pharmaceutical dosage: 1 tablet = X mg = Y moles = Z molecules", conceptUsed: "Mole concept", explanation: "An aspirin tablet (500 mg) contains 500/180 ≈ 2.78 millimoles of aspirin = 1.67×10²¹ molecules. The effective dose is calculated by chemists using the mole concept.", ageRelevance: "Medicine; personal health" },
    { context: "Nutrition labels: iron 18mg vs iron 18mg as Fe₂O₃", conceptUsed: "Molar mass; percentage composition", explanation: "18 mg of iron vs 18 mg of Fe₂O₃ contain very different amounts of iron — molar mass calculation tells us exactly how much actual iron the body receives", ageRelevance: "Food and nutrition context; NEP-ETH: informed consumer" },
  ],

  crossChapterLinks: [
    { subject: "Chemistry", classNum: 9, chapterId: "ch04", chapterName: "Structure of the Atom", linkType: "prerequisite-for", description: "Atomic structure explains why atoms have the valency they do and why isotopes exist" },
    { subject: "Chemistry", classNum: 9, chapterId: "ch02", chapterName: "Is Matter Around Us Pure?", linkType: "builds-on", description: "Chapter 2 distinguished element from compound; Chapter 3 explains this at the atomic level" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Units and measurement; significant figures", description: "Molar mass calculations require significant figures and unit conversions — same skills as Physics numericals", strength: "moderate" },
    { subject: "Mathematics", topic: "Scientific notation and large numbers", description: "Avogadro's number (6.022×10²³) and atom sizes (10⁻¹⁰ m) require scientific notation from Mathematics", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Burning magnesium: weigh before and after; show mass is conserved", duration: "15 minutes", pedagogyNote: "NEP-IDC: Law of Conservation of Mass from an experiment" },
    { step: 2, action: "Show that water from rain, rivers, and distilled sources is always 88.9% O, 11.1% H — Law of Constant Proportions", duration: "10 minutes", pedagogyNote: "Data from multiple sources; discuss why this is powerful evidence for atomic structure" },
    { step: 3, action: "Dalton's Atomic Theory: postulates, limitations, and corrections", duration: "15 minutes", pedagogyNote: "NEP-HOT: which postulates are still valid? Atoms are divisible (subatomic particles); isotopes exist (atoms of same element not always identical)" },
    { step: 4, action: "Atomic mass, symbols; write molecular formulae using valency", duration: "25 minutes", pedagogyNote: "Cross-valency rule practice: 10 formulae of increasing complexity" },
    { step: 5, action: "Introduce the mole concept: why chemists need it; Avogadro's number", duration: "20 minutes", pedagogyNote: "Analogy chain: pair → dozen → gross → mole. The mole is simply a very large counting number." },
    { step: 6, action: "Mole calculations: mass ↔ moles ↔ particles: 6 practice problems", duration: "30 minutes", pedagogyNote: "Always show: n = m/M; N = n × 6.022×10²³. Build the two-step chain." },
  ],
};

export const STRUCTURE_OF_THE_ATOM: ChapterKnowledge = {
  chapterId: "ch04", chapterName: "Structure of the Atom", classNum: 9, subject: "Chemistry", board: "Both",

  learningObjectives: [
    { statement: "Describe Thomson's plum pudding model and its limitations", bloomsLevel: "understand", assessable: true },
    { statement: "Explain Rutherford's gold foil experiment and the nuclear model it established", bloomsLevel: "evaluate", assessable: true },
    { statement: "Describe Bohr's model and explain how it improves on Rutherford's model", bloomsLevel: "understand", assessable: true },
    { statement: "Calculate maximum electrons in each shell using the 2n² formula", bloomsLevel: "apply", assessable: true },
    { statement: "Write electronic configurations of elements 1–20", bloomsLevel: "apply", assessable: true },
    { statement: "Define atomic number, mass number, and distinguish isotopes from isobars", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate Thomson's model: what evidence led to its rejection? Was Rutherford's experiment designed to test Thomson's model or to discover something else?" },
    { ruleCode: "NEP-REFL", application: "Reflect: models in science are revised — Bohr's model is also incomplete (quantum mechanics replaces it). Why do we still teach Bohr's model?" },
    { ruleCode: "NEP-REPR", application: "Represent an atom of any given element in five ways: symbol, atomic number/mass number, particle table, shell diagram, electronic configuration" },
  ],

  cbseOutcomes: [
    "Student describes Thomson's, Rutherford's, and Bohr's atomic models with their experimental basis and limitations",
    "Student explains the nucleus, protons, neutrons, and electrons; states their properties",
    "Student writes electronic configuration of elements 1–20 using shell filling order",
    "Student defines atomic number, mass number, valency (from electronic configuration), isotopes, and isobars",
  ],

  icseOutcomes: [
    "ICSE expects: Rutherford's experiment described in more detail; scattering angle interpretation",
    "ICSE additionally tests: Bohr's quantum postulates (quantised orbits, energy levels, emission of quanta when electron jumps)",
  ],

  coreConcepts: [
    "The atom has a tiny, dense, positively charged nucleus surrounded by electrons in shells",
    "Protons determine element identity (atomic number Z); neutrons add mass with no charge",
    "Electrons fill shells in order: 2, 8, 8, 2 (up to element 20) following the 2n² capacity rule",
    "Valency = electrons in outermost shell (for elements with ≤4 outer electrons) or 8 − outer electrons (for ≥4)",
    "Isotopes: same Z, different mass number (different neutrons); isobars: different Z, same mass number",
    "Rutherford's experiment: most alpha particles passed through → atom is mostly empty space with tiny dense nucleus",
  ],

  subtopics: [
    { id: "t1", name: "Thomson's Model and Its Limitations", coreConcept: "Electrons embedded in a positively charged sphere — disproved by Rutherford's experiment", keyIdea: "Like a plum pudding: electrons (plums) in positive dough", estimatedPeriods: 1 },
    { id: "t2", name: "Rutherford's Gold Foil Experiment and Nuclear Model", coreConcept: "Most particles pass through (atom mostly empty); some deflect (nucleus is charged and dense); few bounce back (nucleus is small)", keyIdea: "Three observations → three conclusions about atomic structure", estimatedPeriods: 2 },
    { id: "t3", name: "Bohr's Model — Shells and Energy Levels", coreConcept: "Electrons in fixed circular orbits (shells); energy is quantised; electrons in same shell have the same energy", keyIdea: "Bohr's model explains hydrogen spectrum; shell capacity = 2n²", estimatedPeriods: 2 },
    { id: "t4", name: "Atomic Number, Mass Number, Isotopes, Isobars", coreConcept: "Z = protons; A = protons + neutrons; isotopes have same Z but different A; isobars have same A but different Z", keyIdea: "Chlorine-35 and Chlorine-37 are isotopes — explains average atomic mass of 35.5", estimatedPeriods: 2 },
    { id: "t5", name: "Electronic Configuration and Valency", coreConcept: "Fill shells in order: 2, 8, 8, 2; valency from outermost shell electron count", keyIdea: "Electronic configuration of the outermost shell determines chemical behaviour — basis of the periodic table", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "chm:9:ch04:thomson-model", to: "chm:9:ch04:rutherford-experiment", relationship: "contradicts-intuition", explanation: "Thomson's model predicted alpha particles would slow down uniformly; Rutherford found most passed straight through — demolishing the plum-pudding model" },
    { from: "chm:9:ch04:rutherford-model", to: "chm:9:ch04:bohr-model", relationship: "generalises", explanation: "Rutherford's nuclear model couldn't explain why orbiting electrons don't spiral into nucleus; Bohr introduced quantised orbits" },
    { from: "chm:9:ch04:electron-shells", to: "chm:9:ch04:electronic-configuration", relationship: "applies", explanation: "Electronic configuration is the specific assignment of electrons to shells following 2n² capacity and filling rules" },
    { from: "chm:9:ch04:electronic-configuration", to: "chm:9:ch03:valency", relationship: "applies", explanation: "Valency of an element is determined by its outermost shell electron count — direct link from structure to bonding" },
    { from: "chm:9:ch04:isotopes", to: "chm:9:ch03:average-atomic-mass", relationship: "applies", explanation: "Average atomic mass accounts for the natural abundance of isotopes — explains non-integer atomic masses like Cl=35.5" },
  ],

  prerequisites: {
    chapters: [{ subject: "Chemistry", classNum: 9, chapterId: "ch03", chapterName: "Atoms and Molecules", requiredConcepts: ["chm:9:ch03:atom-definition", "chm:9:ch03:valency"] }],
    concepts: ["chm:9:ch03:atom-definition", "chm:9:ch03:atomic-mass"],
  },

  essentialDefinitions: [
    { term: "Proton", formalDefinition: "A positively charged particle found in the nucleus of an atom; charge = +1.6×10⁻¹⁹ C; mass = 1 amu; number of protons = atomic number Z", informalExplanation: "The positively charged particle in the nucleus — the number of protons determines which element it is" },
    { term: "Neutron", formalDefinition: "An electrically neutral particle found in the nucleus; mass = 1 amu; discovered by Chadwick (1932)", informalExplanation: "Adds mass without adding charge — makes the nucleus stable and heavier" },
    { term: "Electron", formalDefinition: "A negatively charged particle orbiting the nucleus in shells; charge = −1.6×10⁻¹⁹ C; mass = 9.1×10⁻³¹ kg ≈ 1/1836 amu", informalExplanation: "Tiny, fast-moving particles around the nucleus — responsible for all chemical behaviour and bonding" },
    { term: "Atomic Number (Z)", formalDefinition: "The number of protons in the nucleus of an atom; unique for each element; also equals the number of electrons in a neutral atom", informalExplanation: "Z identifies the element — if Z=6, it's carbon. If Z=8, it's oxygen. No two elements have the same Z." },
    { term: "Mass Number (A)", formalDefinition: "A = Z + N; the total number of protons (Z) and neutrons (N) in the nucleus", informalExplanation: "The 'weight' of the nucleus in amu — approximately the atomic mass for most purposes" },
    { term: "Isotopes", formalDefinition: "Atoms of the same element with the same atomic number Z but different mass numbers A (different number of neutrons)", informalExplanation: "Same element, different masses. Carbon-12 and Carbon-14 are both carbon (Z=6) but different masses.", example: "¹²₆C (6 protons, 6 neutrons) and ¹⁴₆C (6 protons, 8 neutrons)" },
    { term: "Isobars", formalDefinition: "Atoms of different elements with the same mass number A but different atomic numbers Z", informalExplanation: "Same mass number, different elements. Ca-40 and Ar-40 are isobars — both have mass number 40 but different atomic numbers (20 and 18)", counterExample: "Isobars are different elements; isotopes are the same element" },
  ],

  formulaInventory: [
    { name: "Shell Capacity", latex: "N_{max} = 2n^2", plainText: "Maximum electrons in shell n = 2n²", variables: [{ symbol: "n", meaning: "shell number (1 for K shell, 2 for L shell, etc.)" }, { symbol: "N_max", meaning: "maximum number of electrons that shell n can hold" }], applicableWhen: "For determining the electron capacity of each shell; K: 2, L: 8, M: 18, N: 32", doesNotApplyWhen: "The 2n² rule gives maximum capacity; actual filling may be less (outer shells often don't fill to capacity before the next element in the periodic table)", examTip: "For Class 9, use practical filling order: 2, 8, 8, 2 for elements up to Z=20" },
    { name: "Number of Neutrons", latex: "N = A - Z", plainText: "Neutrons = Mass number − Atomic number", variables: [{ symbol: "N", meaning: "number of neutrons" }, { symbol: "A", meaning: "mass number" }, { symbol: "Z", meaning: "atomic number" }], applicableWhen: "Always", doesNotApplyWhen: "Mass number and atomic number must both be given" },
  ],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Electrons orbit the nucleus like planets orbit the Sun in fixed paths", correction: "Bohr's model shows fixed orbits for simplicity, but quantum mechanics (beyond Class 9) shows electrons exist in probability clouds. We say 'shell' or 'orbit' as a simplified model.", whyItHappens: "Visual representations show neat circular orbits; Bohr's model itself uses circular orbits", revealingQuestion: "Why is Bohr's model called a model? What does the word 'model' mean in science?" },
    { misconception: "An atom with more protons always has more neutrons too", correction: "Not necessarily. Light elements often have equal protons and neutrons; heavier elements tend to have more neutrons than protons, but the ratio varies. Isotopes of the same element have same protons but different neutrons.", whyItHappens: "Students think protons and neutrons always come in pairs", revealingQuestion: "How many neutrons does Na-23 have? How many does Na-24 have? What is different about these two?" },
    { misconception: "Atomic mass is always a whole number", correction: "Atomic mass is a weighted average of all isotopes — not always a whole number (Cl = 35.5, Br = 80). Mass number (not atomic mass) is always a whole number.", whyItHappens: "Mass number is a whole number; students confuse atomic mass with mass number", revealingQuestion: "Chlorine has two isotopes: Cl-35 (75%) and Cl-37 (25%). Calculate the average atomic mass." },
  ],

  examinerTraps: [
    { trap: "Confusing atomic number and mass number in ₂₃₁₁Na notation", typicalScenario: "Student says Z=23 and A=11 — reading subscript and superscript in reverse", avoidanceStrategy: "Convention: ᴬ_Z X where A (superscript) = mass number; Z (subscript) = atomic number. For ²³₁₁Na: A=23, Z=11", marksAtRisk: "All derived quantities (neutrons, electrons) will be wrong" },
    { trap: "Stating Rutherford's model limitation as 'cannot explain stability' without explaining why", typicalScenario: "Student says model has a limitation but doesn't explain the classical physics argument", avoidanceStrategy: "A charged particle undergoing centripetal acceleration should radiate energy and spiral inward (classical EM prediction). Rutherford's model couldn't explain why electrons don't spiral into nucleus — Bohr's fixed orbits solved this.", marksAtRisk: "½–1 mark for incomplete explanation" },
  ],

  typicalMistakes: [
    { mistake: "Electronic configuration of sodium (Z=11): 2,8,1 written as 2,9 (putting all in two shells)", correction: "Shell filling: K=2 (max), L=8 (max), M=1 (remaining). So Na: 2,8,1", conceptualError: "Not knowing that L shell maximum is 8 (even though 2n²=18 for n=2 in theory, in practice stops at 8 before next period)" },
    { mistake: "Saying Rutherford's α particles were positively charged electrons", correction: "Alpha particles are helium-4 nuclei: 2 protons + 2 neutrons; charge +2. Not electrons (which are negatively charged and much lighter).", conceptualError: "Confusing types of radioactive particles" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["What would Rutherford have concluded if ALL alpha particles passed through without deflection? What if ALL bounced back?", "Compare Rutherford's and Thomson's models: what does each predict for the gold foil experiment?"] },
    { subtopicId: "t5", entryLevel: "apply", masteryLevel: "analyse", targetLevels: ["apply", "analyse"], hotsStarters: ["An element has electronic configuration 2,8,7. Identify it, give its valency, and predict whether it will gain or lose electrons in bonding.", "Element X has valency 2 and mass number 40. Write its electronic configuration."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Discovery of electrons and protons: cathode ray tube and canal rays", tier: "easy", teachingNote: "Thomson found electrons (negative, light); Goldstein found protons (positive, heavy)" },
    { step: 2, concept: "Thomson's plum pudding model: what it proposed", tier: "easy", dependsOnStep: 1, teachingNote: "The first complete atomic model; positively charged dough + electron raisins" },
    { step: 3, concept: "Rutherford's gold foil experiment: three observations, three conclusions", tier: "medium", dependsOnStep: 2, teachingNote: "One-to-one: each observation → one conclusion about nucleus" },
    { step: 4, concept: "Rutherford's nuclear model and its limitation", tier: "medium", dependsOnStep: 3, teachingNote: "Limitation: classical physics predicts electrons should spiral in — Rutherford couldn't explain atomic stability" },
    { step: 5, concept: "Bohr's model: fixed orbits, 2n² rule, energy levels", tier: "medium", dependsOnStep: 4, teachingNote: "Bohr's solution: electrons only in fixed-energy orbits; can't radiate energy if they don't change orbit" },
    { step: 6, concept: "Atomic number, mass number, neutrons: notation and calculation", tier: "easy", dependsOnStep: 5, teachingNote: "Read ᴬ_ZX notation fluently; compute N = A − Z" },
    { step: 7, concept: "Electronic configuration of elements 1–20", tier: "medium", dependsOnStep: 5, teachingNote: "Fill systematically: K=2, L=8, M=8, N=2. Practice all 20 elements." },
    { step: 8, concept: "Valency from electronic configuration", tier: "medium", dependsOnStep: 7, teachingNote: "Valency = outermost electrons (if ≤4) or 8 − outermost electrons (if >4). Noble gases: valency 0." },
    { step: 9, concept: "Isotopes and isobars: definition, examples, significance", tier: "medium", dependsOnStep: 6, teachingNote: "Isotopes: same Z, different A; isobars: different Z, same A. Carbon dating uses C-14 isotope." },
  ],

  realLifeApplications: [
    { context: "Carbon-14 dating in archaeology", conceptUsed: "Isotopes — C-12 and C-14 are isotopes of carbon", explanation: "All living organisms have a fixed ratio of C-14 (radioactive) to C-12. After death, C-14 decays at a known rate. Measuring the remaining C-14 gives the age of the sample.", ageRelevance: "Dating ancient civilisations; India's archaeological heritage (Harappa, Mohenjo-daro)" },
    { context: "MRI and PET scans in medicine", conceptUsed: "Isotopes used as tracers", explanation: "Radioactive isotopes are injected and tracked through the body by medical scanners (PET scan). The isotope emits radiation that shows blood flow or metabolic activity.", ageRelevance: "Medical technology; healthcare context" },
    { context: "Nuclear energy and power plants", conceptUsed: "Isotopes of uranium; nuclear structure", explanation: "Uranium-235 (not U-238) undergoes fission to release energy. Nuclear power plants split U-235 nuclei — this is why isotopes matter in energy production.", ageRelevance: "India's nuclear energy program; energy independence" },
  ],

  crossChapterLinks: [
    { subject: "Chemistry", classNum: 9, chapterId: "ch03", chapterName: "Atoms and Molecules", linkType: "builds-on", description: "Chapter 3 introduced atoms; Chapter 4 reveals their internal structure — the natural extension" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Nuclear physics and radioactivity", description: "Radioactive decay, nuclear stability, and half-life all involve the same atomic structure from this chapter", strength: "strong" },
    { subject: "Mathematics", topic: "Exponents and scientific notation", description: "Atomic dimensions (10⁻¹⁰ m), electron mass (9.1×10⁻³¹ kg), and Avogadro's number (6×10²³) all require scientific notation", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Historical narrative: how did scientists discover the atom has internal structure?", duration: "10 minutes", pedagogyNote: "Timeline: Thomson 1897 → Rutherford 1911 → Bohr 1913. Science as a human story" },
    { step: 2, action: "Thomson's experiment and model: what was proposed and why it seemed reasonable", duration: "15 minutes", pedagogyNote: "Fair to Thomson — his model was the best available evidence could support in 1897" },
    { step: 3, action: "Rutherford's experiment: detailed description of setup, observations, and conclusions", duration: "25 minutes", pedagogyNote: "NEP-HOT: what would you have concluded? Three scenarios: all pass through / some deflect / few bounce back" },
    { step: 4, action: "Rutherford's limitation and Bohr's solution: quantised orbits", duration: "15 minutes", pedagogyNote: "Why orbiting electrons should spiral in (classical physics) → why Bohr fixed this with quantised shells" },
    { step: 5, action: "Electronic configurations of all elements 1–20: practice and verify", duration: "25 minutes", pedagogyNote: "Each student writes configurations; class checks. K=2, L=8, M=8, N=2 is the practical rule for Z≤20" },
    { step: 6, action: "Atomic number, mass number, isotopes, isobars: notation practice", duration: "20 minutes", pedagogyNote: "Read ᴬ_ZX notation; find number of each particle; distinguish isotope pairs from isobar pairs" },
    { step: 7, action: "Carbon dating and nuclear medicine: real applications of isotope knowledge", duration: "15 minutes", pedagogyNote: "NEP-COMP: calculate approximate age from C-14 remaining — conceptual level only" },
  ],
};

export const CHEMISTRY_CLASS9: ChapterKnowledge[] = [
  MATTER_IN_OUR_SURROUNDINGS,
  IS_MATTER_AROUND_US_PURE,
  ATOMS_AND_MOLECULES,
  STRUCTURE_OF_THE_ATOM,
];
