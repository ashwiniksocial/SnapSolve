/**
 * Academic Knowledge — Biology, Class 9
 * 6 NCERT chapters. Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

export const FUNDAMENTAL_UNIT_OF_LIFE: ChapterKnowledge = {
  chapterId: "ch01", chapterName: "Cell — The Fundamental Unit of Life", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "State the cell theory and name the scientists who contributed to its formulation", bloomsLevel: "remember", assessable: true },
    { statement: "Distinguish between prokaryotic and eukaryotic cells with examples", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the structure and function of the cell membrane, cell wall, and nucleus", bloomsLevel: "understand", assessable: true },
    { statement: "Explain the functions of major cell organelles (mitochondria, chloroplast, ER, Golgi, ribosome, lysosome)", bloomsLevel: "understand", assessable: true },
    { statement: "Explain osmosis and diffusion with examples; predict direction of water movement", bloomsLevel: "apply", assessable: true },
    { statement: "Compare plant and animal cells; explain the functional significance of differences", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Prepare wet mount of onion peel/cheek cells; observe under microscope and draw labelled diagram" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Mitochondria is the powerhouse of the cell' — what would happen to the cell if mitochondria were absent?" },
    { ruleCode: "NEP-REPR", application: "Represent a plant cell in five ways: verbal description, labelled diagram, table of organelles, Venn diagram vs animal cell, electron micrograph description" },
    { ruleCode: "NEP-ETH", application: "Discuss stem cell research — cells as the fundamental unit raises questions about the beginning of life" },
  ],

  cbseOutcomes: [
    "Student states cell theory and its significance as the foundation of biology",
    "Student distinguishes prokaryotic from eukaryotic cells using structural criteria",
    "Student describes structure and function of cell membrane, cell wall, nucleus, and major organelles",
    "Student explains osmosis using a model (potato/raisin activity) and predicts water movement based on concentration",
    "Student compares plant and animal cells identifying structural differences and their functional reasons",
  ],

  icseOutcomes: [
    "ICSE expects: detailed knowledge of nuclear membrane, nucleolus, and chromatin",
    "ICSE tests: types of plastids (chloroplasts, chromoplasts, leucoplasts) with functions",
    "ICSE additionally covers: cell inclusions (oil droplets, starch grains, crystals)",
  ],

  coreConcepts: [
    "The cell is the basic structural and functional unit of all living organisms",
    "Cell theory: all living things are made of cells; all cells come from pre-existing cells",
    "Cell membrane is selectively permeable — controls what enters and exits using phospholipid bilayer",
    "Nucleus is the control centre — contains DNA that codes for proteins and directs all cellular activities",
    "Organelles are specialised structures within cells, each with a specific function enabling the cell to work",
    "Osmosis is movement of water from a region of higher water potential to lower water potential across a semi-permeable membrane",
  ],

  subtopics: [
    { id: "t1", name: "Cell Theory and Discovery of Cells", coreConcept: "All living things are made of cells; cells arise from pre-existing cells", keyIdea: "Hooke (1665) saw dead cork cells; Leeuwenhoek saw living cells; Schleiden, Schwann, and Virchow formalised cell theory", estimatedPeriods: 1 },
    { id: "t2", name: "Prokaryotic vs Eukaryotic Cells", coreConcept: "Prokaryotes: no membrane-bound nucleus; simple structure. Eukaryotes: membrane-bound nucleus; complex with organelles.", keyIdea: "Bacteria are prokaryotes; plants, animals, fungi, and protists are eukaryotes", estimatedPeriods: 2 },
    { id: "t3", name: "Cell Membrane and Cell Wall", coreConcept: "Cell membrane: fluid mosaic of phospholipids + proteins; selectively permeable. Cell wall: rigid, outermost layer in plants (cellulose), fungi (chitin), and bacteria", keyIdea: "Membrane controls entry and exit; wall gives structural support", estimatedPeriods: 2 },
    { id: "t4", name: "Nucleus and its Components", coreConcept: "Nuclear membrane (double), nucleoplasm, nucleolus, chromatin — the control centre storing genetic information", keyIdea: "DNA → RNA → protein: all starts in the nucleus", estimatedPeriods: 2 },
    { id: "t5", name: "Cell Organelles and Their Functions", coreConcept: "Each organelle is a specialised compartment: ER (transport), Golgi (packaging), mitochondria (energy), chloroplast (photosynthesis), ribosome (protein synthesis), lysosome (digestion)", keyIdea: "The cell is a city: each organelle has a specific job; the nucleus is the city hall", estimatedPeriods: 3 },
    { id: "t6", name: "Osmosis, Diffusion, and Transport", coreConcept: "Diffusion: movement from high to low concentration. Osmosis: diffusion of water across semi-permeable membrane.", keyIdea: "Osmosis explains plant wilting (flaccidity), crispness (turgidity), and swelling of raisins in water", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "bio:9:ch01:cell-theory", to: "bio:9:ch01:cell-as-unit-of-life", relationship: "applies", explanation: "Cell theory establishes the cell as the basic unit; all subsequent biology builds on this" },
    { from: "bio:9:ch01:cell-membrane-structure", to: "bio:9:ch01:osmosis", relationship: "requires", explanation: "Osmosis occurs across the semi-permeable cell membrane; understanding the membrane is prerequisite" },
    { from: "bio:9:ch01:nucleus-function", to: "bio:9:ch01:organelle-functions", relationship: "applies", explanation: "Nucleus encodes the information for building all organelles and directing all cellular activities" },
    { from: "bio:9:ch01:cell-organelles", to: "bio:9:ch02:tissue-formation", relationship: "applies", explanation: "Tissues are groups of similar cells; the cell's organelles determine what type of tissue function is possible" },
  ],

  prerequisites: {
    chapters: [{ subject: "Biology", classNum: 8, chapterId: "ch01", chapterName: "Cell: Structure and Function", requiredConcepts: ["bio:8:ch01:cell-theory", "bio:8:ch01:cell-membrane", "bio:8:ch01:plant-animal-cell-difference"] }],
    concepts: ["bio:8:ch01:cell-theory", "bio:8:ch01:nucleus"],
  },

  essentialDefinitions: [
    { term: "Cell", formalDefinition: "The smallest structural and functional unit of all living organisms that is capable of performing all basic life processes independently", informalExplanation: "The building block of life — every living thing is made of one or more cells" },
    { term: "Cell Theory", formalDefinition: "The unified theory of biology stating: (1) all living organisms are composed of cells; (2) the cell is the basic unit of life; (3) all cells arise from pre-existing cells (Virchow, 1855)", informalExplanation: "Three big ideas: everything is made of cells; cells are the basic unit; new cells come only from old cells" },
    { term: "Prokaryote", formalDefinition: "An organism whose cells lack a membrane-bound nucleus; DNA is in the cytoplasm in a region called the nucleoid; no membrane-bound organelles", informalExplanation: "Simple cells without a proper nucleus — bacteria and archaea. 'Pro' = before; 'karyon' = nucleus." },
    { term: "Eukaryote", formalDefinition: "An organism whose cells contain a membrane-bound nucleus and membrane-bound organelles", informalExplanation: "Complex cells with a proper nucleus — all plants, animals, fungi, and protists. 'Eu' = true; 'karyon' = nucleus." },
    { term: "Cell Membrane (Plasma Membrane)", formalDefinition: "The selectively permeable phospholipid bilayer with embedded proteins that bounds every cell and regulates the entry and exit of materials", informalExplanation: "The cell's security gate — lets some things in and out but not others; alive and fluid, not rigid" },
    { term: "Osmosis", formalDefinition: "The movement of water molecules from a region of higher water concentration (hypotonic solution) to a region of lower water concentration (hypertonic solution) through a selectively permeable membrane", informalExplanation: "Water moves from dilute solution to concentrated solution — like flowing 'downhill' in concentration" },
    { term: "Turgidity", formalDefinition: "The state of a plant cell in which the vacuole is full of water and the cell membrane presses against the cell wall, making the cell rigid and firm", informalExplanation: "A cell 'blown up' with water — this is why plants are firm and crunchy when well-watered" },
    { term: "Plasmolysis", formalDefinition: "The shrinkage of the cell contents away from the cell wall when water leaves by osmosis (when the cell is placed in hypertonic solution)", informalExplanation: "The cell shrinks inside its wall — like a deflated balloon inside a box" },
    { term: "Lysosome", formalDefinition: "A membrane-bound organelle containing digestive enzymes; responsible for intracellular digestion and recycling of cellular components", informalExplanation: "The cell's stomach — breaks down old organelles, food particles, and bacteria. Called 'suicide bags' because they can rupture and digest the entire cell" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [
    { name: "Cell Theory", type: "principle", statement: "All living organisms are composed of cells; the cell is the basic unit of structure and function; all cells arise from pre-existing cells", discoveredBy: "Matthias Schleiden (1838), Theodor Schwann (1839), Rudolf Virchow (1855)", limitations: "Viruses challenge cell theory — they are not made of cells but are considered living by some definitions", boardRelevance: "State cell theory (2 marks); scientists who formulated it (1 mark each)" },
  ],

  commonMisconceptions: [
    { misconception: "All cells have a cell wall", correction: "Only plant cells, fungal cells, and bacterial cells have cell walls. Animal cells have NO cell wall — only a flexible cell membrane. This is why animals can change shape.", whyItHappens: "Cell wall is taught prominently; students overgeneralise", revealingQuestion: "Do red blood cells have a cell wall? How do you know?" },
    { misconception: "Osmosis is the same as diffusion", correction: "Diffusion is movement of any substance from high to low concentration. Osmosis specifically refers to movement of WATER through a semi-permeable membrane. Osmosis is a special type of diffusion.", whyItHappens: "Both involve movement from high to low; students don't isolate the specific features of osmosis", revealingQuestion: "What two features make osmosis different from simple diffusion?" },
    { misconception: "Mitochondria produce energy", correction: "Mitochondria CONVERT energy — from chemical energy in glucose to ATP (adenosine triphosphate). Energy is not produced from nothing; it is transformed from food energy to a usable cellular form.", whyItHappens: "'Powerhouse of the cell' implies creation, not conversion", revealingQuestion: "Mitochondria require oxygen and glucose to function. What happens when you deprive a cell of oxygen?" },
    { misconception: "All organelles are found in all cells", correction: "Chloroplasts are found only in plant cells (and algae). Red blood cells have no nucleus or most organelles. Nerve cells have extensive ER. Cells are specialised — organelle content varies.", whyItHappens: "Textbook diagrams show a 'generic' cell with all organelles", revealingQuestion: "Do red blood cells contain mitochondria? Chloroplasts? Nucleus? Explain what this means for their function." },
  ],

  examinerTraps: [
    { trap: "Identifying cell wall as part of both plant and animal cells", typicalScenario: "Student draws a diagram with cell wall in an animal cell", avoidanceStrategy: "Cell wall: plants, fungi, bacteria ONLY. Animal cells: cell membrane only. No exceptions in CBSE/ICSE Class 9 context.", marksAtRisk: "½ mark per incorrect labelling" },
    { trap: "Confusing nuclear membrane with cell membrane", typicalScenario: "Student says 'nucleus is covered by cell membrane' — cell membrane surrounds the whole cell; nuclear membrane surrounds the nucleus", avoidanceStrategy: "Two distinct membranes: cell membrane (bounds the whole cell) and nuclear membrane (bounds only the nucleus; it is double-layered)", marksAtRisk: "1 mark for wrong identification" },
    { trap: "Writing 'Golgi apparatus stores energy'", typicalScenario: "Student writes wrong function for Golgi — it processes and packages proteins for secretion", avoidanceStrategy: "Golgi: 'the post office of the cell' — receives proteins from ER, processes them, packs them, and ships them to destination (secretion or lysosomes)", marksAtRisk: "1 mark for wrong function" },
  ],

  typicalMistakes: [
    { mistake: "Osmosis: water moves from concentrated solution to dilute solution", correction: "Osmosis: water moves from DILUTE (more water, less solute) to CONCENTRATED (less water, more solute). Think of it as water moving down its own concentration gradient — from high water concentration to low water concentration.", conceptualError: "Confusing solute concentration with water concentration — they are inversely related" },
    { mistake: "Lysosome is the 'powerhouse' of the cell", correction: "Mitochondria is the powerhouse. Lysosome is the 'suicide bag' — it digests waste and old organelles.", conceptualError: "Mixing up organelle nicknames" },
  ],

  bloomsMap: [
    { subtopicId: "t5", entryLevel: "remember", masteryLevel: "analyse", targetLevels: ["remember", "understand", "apply", "analyse"], hotsStarters: ["A cell is placed in 50% sugar solution. What will happen to the cell? Explain using the concept of osmosis.", "Why would a cell with non-functional mitochondria eventually die? What cellular processes would fail?"] },
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["Why don't animal cells burst when placed in pure water, even though they have no cell wall?", "How does the selective permeability of the cell membrane protect the cell from toxins?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Discovery of cells: Hooke, Leeuwenhoek, cell theory", tier: "foundational", teachingNote: "Historical narrative; microscope observation activity (if available); cell theory as science's foundation for biology" },
    { step: 2, concept: "Prokaryote vs eukaryote: structural differences", tier: "easy", dependsOnStep: 1, teachingNote: "Table comparison: nucleus present/absent, membrane-bound organelles, examples. Bacteria = prokaryote; amoeba = eukaryote." },
    { step: 3, concept: "Cell membrane: structure, function, selective permeability", tier: "medium", dependsOnStep: 2, teachingNote: "Fluid mosaic model; selectively permeable; controls what goes in and out" },
    { step: 4, concept: "Cell wall: composition, function, which cells have it", tier: "easy", dependsOnStep: 3, teachingNote: "Plant (cellulose), fungi (chitin), bacteria — animal cells have NO wall; reason: flexibility needed for shape change" },
    { step: 5, concept: "Nucleus: components and function", tier: "medium", dependsOnStep: 2, teachingNote: "Nuclear membrane (double), nucleolus (ribosome assembly), chromatin (DNA + protein) — the control centre" },
    { step: 6, concept: "Organelles: each one, its location, its function", tier: "medium", dependsOnStep: 5, teachingNote: "City analogy: nucleus = city hall; mitochondria = power plant; Golgi = post office; lysosome = waste management" },
    { step: 7, concept: "Osmosis and diffusion: definitions and experiments", tier: "medium", dependsOnStep: 3, teachingNote: "Hands-on: raisin in water swells; potato in salt water shrinks. Predict before observing." },
    { step: 8, concept: "Plant vs animal cell: compare and explain differences", tier: "medium", dependsOnStep: 6, teachingNote: "Venn diagram; explain WHY each difference exists functionally (e.g., plants need chloroplasts for photosynthesis)" },
  ],

  realLifeApplications: [
    { context: "Food preservation: osmosis in pickling", conceptUsed: "Osmosis in concentrated salt/sugar solutions", explanation: "Placing food in concentrated salt or sugar solutions (pickling) causes bacteria to lose water by osmosis — dehydrating and killing them. This preserves food.", ageRelevance: "Every Indian household pickles vegetables; this is the chemistry behind preservation" },
    { context: "IV saline drip in hospitals", conceptUsed: "Isotonic solution and osmosis", explanation: "IV saline (0.9% NaCl) matches blood's concentration — no osmosis occurs, and blood cells maintain their shape. A stronger or weaker solution would cause cells to burst or shrink.", ageRelevance: "Students have seen IV drips in hospitals; understanding why it is a specific concentration is empowering" },
    { context: "Why plants wilt when not watered", conceptUsed: "Loss of turgidity (osmosis)", explanation: "Wilted plant: cells lose water by osmosis when the soil is dry; vacuoles shrink; cells become flaccid; plant droops. Water the plant → turgor pressure returns → plant becomes firm.", ageRelevance: "Students have seen wilted plants; this connects a visible phenomenon to the cellular level" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch02", chapterName: "Tissues", linkType: "prerequisite-for", description: "Tissues are groups of similar cells; understanding the cell (Chapter 1) is essential before studying tissues" },
    { subject: "Biology", classNum: 8, chapterId: "ch01", chapterName: "Cell: Structure and Function (Class 8)", linkType: "builds-on", description: "Class 8 introduced the cell; Class 9 goes deeper into organelle function and osmosis" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Solutions and concentration", description: "Osmosis depends on concentration difference between solutions — the same concentration concept as Chemistry Chapter 2 (Is Matter Around Us Pure?)", strength: "strong" },
    { subject: "Physics", topic: "Diffusion as a physical process", description: "Diffusion is a physical process of particle movement — the same physical process applies in cells (CO₂ exchange in respiration)", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Microscope activity: observe onion peel cells (plant) and cheek cells (animal) — draw and compare", duration: "20 minutes", pedagogyNote: "NEP-IDC: observation before description. Students see the cell before they define it." },
    { step: 2, action: "Cell theory: the three statements; scientists; historical significance", duration: "10 minutes", pedagogyNote: "Cell theory is to biology what Newton's laws are to physics — the unifying framework" },
    { step: 3, action: "Prokaryote vs Eukaryote: comparison table with diagrams", duration: "15 minutes", pedagogyNote: "Concrete examples: E. coli (prokaryote) vs. onion cell (eukaryote). What structural features distinguish them?" },
    { step: 4, action: "Cell membrane and cell wall: structure, function, which cells have each", duration: "20 minutes", pedagogyNote: "Model: zip-lock bag (cell membrane) inside a cardboard box (cell wall) — flexible inside rigid" },
    { step: 5, action: "Nucleus and organelles: function story for each using the 'city' analogy", duration: "25 minutes", pedagogyNote: "Build the analogy deliberately: assign students to organelle roles in a city, act out the function" },
    { step: 6, action: "Osmosis experiments: raisin, potato, egg in different solutions — predict, observe, explain", duration: "25 minutes", pedagogyNote: "NEP-IDC: prediction before observation; explain using osmosis after observing" },
    { step: 7, action: "Plant vs animal cell: Venn diagram; explain WHY each difference exists", duration: "15 minutes", pedagogyNote: "Functional reasoning: why do plant cells have chloroplasts? Why do animal cells not have cell walls? The 'why' deepens understanding" },
  ],
};

export const TISSUES: ChapterKnowledge = {
  chapterId: "ch02", chapterName: "Tissues", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Define a tissue and explain why multicellular organisms need tissues", bloomsLevel: "understand", assessable: true },
    { statement: "Classify and describe the types of plant tissues (meristematic and permanent)", bloomsLevel: "understand", assessable: true },
    { statement: "Classify and describe the four types of animal tissues and their functions", bloomsLevel: "understand", assessable: true },
    { statement: "Identify tissues from diagrams and relate structure to function", bloomsLevel: "analyse", assessable: true },
    { statement: "Compare plant and animal tissues; explain why plants have more dead tissues", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Observe prepared slides of tissues; identify and draw from microscope observation" },
    { ruleCode: "NEP-HOT", application: "Evaluate: why do plants need more dead cells than animals? Connect to lifestyle differences" },
    { ruleCode: "NEP-REPR", application: "Represent each tissue type in three ways: diagram, function description, and location in the body/plant" },
  ],

  cbseOutcomes: [
    "Student defines tissue and explains its advantage in multicellular organisms",
    "Student classifies plant tissues into meristematic (apical, lateral, intercalary) and permanent tissues (simple and complex)",
    "Student classifies and describes the four animal tissue types: epithelial, connective, muscular, nervous",
    "Student identifies tissue types from diagrams and explains the relationship between structure and function",
  ],

  icseOutcomes: [
    "ICSE expects: detailed classification of epithelial tissues (squamous, cuboidal, columnar, ciliated, glandular)",
    "ICSE additionally tests: types of muscle tissue (striated, unstriated, cardiac) with structural differences",
    "ICSE expects: types of connective tissue (areolar, adipose, bone, cartilage, blood, lymph)",
  ],

  coreConcepts: [
    "A tissue is a group of similar cells that work together to perform a specific function",
    "Division of labour: specialised tissues perform specific functions more efficiently than individual cells",
    "Meristematic tissue contains actively dividing cells — the source of all plant growth",
    "Permanent tissues are fully differentiated — dead or living but no longer divide; provide structure and function",
    "Animal tissues are distinguished by their matrix material: epithelial (no matrix), connective (matrix-rich), muscular (contractile protein), nervous (impulse transmission)",
    "Plant tissues contain more dead cells than animal tissues because plants need rigid dead cells for support (xylem vessels) — animals use bones/cartilage instead",
  ],

  subtopics: [
    { id: "t1", name: "Plant Tissues: Meristematic", coreConcept: "Meristematic cells divide to produce all other cells; located at growth points (apex, lateral, intercalary)", keyIdea: "Apical meristem: tip growth. Lateral meristem (cambium): girth growth. Intercalary: between nodes (grass growth).", estimatedPeriods: 2 },
    { id: "t2", name: "Plant Tissues: Permanent (Simple and Complex)", coreConcept: "Simple: parenchyma (packing, storage), collenchyma (flexible support), sclerenchyma (rigid support — dead). Complex: xylem (water transport) and phloem (food transport)", keyIdea: "Xylem vessels are dead; phloem sieve tubes are living — transport in opposite directions", estimatedPeriods: 3 },
    { id: "t3", name: "Animal Tissues: Epithelial", coreConcept: "Line body surfaces, organs, and cavities; protection, absorption, secretion; tightly packed with little matrix", keyIdea: "Skin, intestinal lining, lung lining — all epithelial but with different structures for different functions", estimatedPeriods: 2 },
    { id: "t4", name: "Animal Tissues: Connective", coreConcept: "Connect and support other tissues; characterised by a large extracellular matrix with cells dispersed within it", keyIdea: "Blood, bone, cartilage, areolar — all connective despite seeming very different, because all have matrix", estimatedPeriods: 2 },
    { id: "t5", name: "Animal Tissues: Muscular and Nervous", coreConcept: "Muscle: striated (voluntary, fast), smooth (involuntary, slow), cardiac (involuntary, untiring). Nervous: neurons transmit electrical signals.", keyIdea: "Cardiac muscle is unique — involuntary but rhythmically striated; cannot fatigue", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "bio:9:ch01:cell-as-unit-of-life", to: "bio:9:ch02:tissue-as-group-of-cells", relationship: "generalises", explanation: "A tissue is the next level of organisation above the cell; understanding cells is prerequisite" },
    { from: "bio:9:ch02:meristematic-tissue", to: "bio:9:ch02:permanent-tissue", relationship: "applies", explanation: "Permanent tissues are derived from meristematic tissue through differentiation" },
    { from: "bio:9:ch02:xylem-structure", to: "bio:9:ch02:water-transport-function", relationship: "applies", explanation: "Xylem vessels are dead cells with thick walls — their hollow, dead structure enables efficient water transport under tension" },
    { from: "bio:9:ch02:nerve-tissue", to: "bio:9:ch04:disease-response", relationship: "applies", explanation: "The nervous system (nervous tissue) coordinates the immune response through neuroendocrine signalling" },
  ],

  prerequisites: {
    chapters: [{ subject: "Biology", classNum: 9, chapterId: "ch01", chapterName: "The Fundamental Unit of Life", requiredConcepts: ["bio:9:ch01:cell-theory", "bio:9:ch01:organelle-functions"] }],
    concepts: ["bio:9:ch01:cell-as-unit-of-life", "bio:9:ch01:nucleus-function"],
  },

  essentialDefinitions: [
    { term: "Tissue", formalDefinition: "A group of cells that are similar in structure and work together to perform a specific function", informalExplanation: "Cells that team up for a common task — like workers with the same job in a factory" },
    { term: "Meristematic Tissue", formalDefinition: "Plant tissue consisting of actively dividing cells with large nuclei, dense cytoplasm, and thin cell walls; responsible for growth", informalExplanation: "The plant's growth department — these cells divide constantly to produce new cells for all other tissues" },
    { term: "Parenchyma", formalDefinition: "Simple permanent plant tissue consisting of living, thin-walled cells with large vacuoles; involved in photosynthesis, storage, and secretion", informalExplanation: "The 'basic' plant tissue — forms the bulk of leaves (where photosynthesis occurs) and storage organs" },
    { term: "Sclerenchyma", formalDefinition: "Simple permanent plant tissue consisting of dead cells with very thick, lignified cell walls; provides rigidity and strength", informalExplanation: "The plant's skeleton — dead cells whose walls are so thick they give permanent support; found in coconut husk, seeds, and stems" },
    { term: "Xylem", formalDefinition: "Complex permanent plant tissue that conducts water and dissolved minerals from roots to leaves; consists of tracheids, vessels, xylem fibres, and xylem parenchyma", informalExplanation: "The plant's 'water pipe' — dead hollow tubes through which water moves upward by capillary action and transpiration pull" },
    { term: "Phloem", formalDefinition: "Complex permanent plant tissue that conducts food (photosynthates) from leaves to other parts; consists of sieve tubes, companion cells, phloem fibres, and phloem parenchyma", informalExplanation: "The plant's 'food pipeline' — moves dissolved sugars from leaves to growing roots, fruits, and seeds" },
    { term: "Epithelial Tissue", formalDefinition: "Animal tissue that covers body surfaces and lines cavities; cells closely packed with little intercellular matrix; functions in protection, absorption, secretion", informalExplanation: "The body's covering tissue — like tiles covering a floor; the skin, the lining of the digestive system, the lining of lungs" },
    { term: "Connective Tissue", formalDefinition: "Animal tissue that connects, supports, and anchors other tissues; characterised by a large extracellular matrix with cells scattered within it", informalExplanation: "The body's glue and scaffolding — includes bone (hard matrix), cartilage (firm matrix), blood (liquid matrix), and areolar (loose matrix)" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Blood is a liquid, not a tissue", correction: "Blood IS a connective tissue. It has a liquid matrix (plasma) with cells (RBC, WBC, platelets) dispersed in it. The key feature of connective tissue is the matrix — not the consistency. Blood's matrix (plasma) is liquid.", whyItHappens: "Students think tissue must be solid", revealingQuestion: "What defines connective tissue? Does blood have that defining feature?" },
    { misconception: "Permanent tissues do not function — they just provide support", correction: "Permanent tissues have diverse functions: parenchyma performs photosynthesis and storage; phloem transports food; epithelial tissue absorbs food and secretes hormones. 'Permanent' means non-dividing, not non-functional.", whyItHappens: "Focus on meristematic tissue as the 'active' one leads to underestimating permanent tissues", revealingQuestion: "Give an example of a permanent tissue that performs active biochemistry, not just structural support." },
    { misconception: "Smooth muscle is in the heart", correction: "The heart is made of CARDIAC muscle — a special type that is striated like skeletal muscle but involuntary like smooth muscle. Smooth muscle is found in the walls of blood vessels, intestines, and the uterus.", whyItHappens: "Students know the heart is involuntary and smooth muscle is involuntary — they conclude the heart has smooth muscle", revealingQuestion: "What makes cardiac muscle unique compared to both skeletal and smooth muscle?" },
  ],

  examinerTraps: [
    { trap: "Confusing types of muscle tissue in diagrams", typicalScenario: "Student labels striated muscle as cardiac or vice versa from a diagram", avoidanceStrategy: "Striated skeletal: long, cylindrical, multi-nucleate, VOLUNTARY. Cardiac: branching, intercalated discs, INVOLUNTARY. Smooth: spindle-shaped, single nucleus, INVOLUNTARY.", marksAtRisk: "1 mark per wrong identification" },
    { trap: "Stating xylem is living tissue", typicalScenario: "Student writes 'xylem is a living complex tissue'", avoidanceStrategy: "Xylem vessels and tracheids are DEAD cells — they must die for their walls to thicken with lignin and their contents to clear for water flow. Xylem parenchyma is living, but the conducting elements are dead.", marksAtRisk: "1 mark for wrong 'living/dead' classification" },
  ],

  typicalMistakes: [
    { mistake: "Collenchyma is dead tissue that provides support", correction: "Collenchyma is LIVING tissue providing flexible support (flexible because cells are alive; walls are thickened but not lignified). Sclerenchyma is the DEAD support tissue (lignified, rigid).", conceptualError: "Confusing the two 'support' simple permanent tissues" },
    { mistake: "Phloem transports water and xylem transports food", correction: "XYLEM transports water (and dissolved minerals) upward from root to leaf. PHLOEM transports food (sugars from photosynthesis) downward from leaf to rest of plant.", conceptualError: "Reversing xylem and phloem functions — the most common tissue mistake" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "remember", masteryLevel: "evaluate", targetLevels: ["remember", "understand", "apply", "evaluate"], hotsStarters: ["Why is it advantageous for xylem vessels to be dead? Would living cells work as well for water transport?", "A gardener cuts a ring of bark completely around a tree trunk. Predict what will happen. Explain using xylem and phloem."] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["Why is blood classified as connective tissue even though it is liquid?", "Compare bone and cartilage: what is different about their matrix and what does this tell you about their function?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "What is a tissue? Why do multicellular organisms need them?", tier: "foundational", teachingNote: "Division of labour analogy: a factory with specialised workers is more efficient than workers doing everything" },
    { step: 2, concept: "Plant tissues: meristematic types (apical, lateral, intercalary)", tier: "easy", dependsOnStep: 1, teachingNote: "Each type grows a different dimension: apical = length; lateral = width; intercalary = elongation of internodes" },
    { step: 3, concept: "Simple permanent plant tissues: parenchyma, collenchyma, sclerenchyma", tier: "medium", dependsOnStep: 2, teachingNote: "Compare along two axes: living/dead AND flexibility/rigidity. Table format helps." },
    { step: 4, concept: "Complex permanent plant tissues: xylem and phloem", tier: "hard", dependsOnStep: 3, teachingNote: "Xylem = dead = water up. Phloem = living = food down. Key distinction: xylem vessels are dead; phloem sieve tubes are alive." },
    { step: 5, concept: "Epithelial tissue: types and functions", tier: "medium", dependsOnStep: 1, teachingNote: "Function determines shape: squamous (protection/diffusion), cuboidal (secretion), columnar (absorption), ciliated (movement)" },
    { step: 6, concept: "Connective tissue: matrix concept; types", tier: "medium", dependsOnStep: 5, teachingNote: "Emphasise matrix: bone (hard mineral matrix), blood (liquid matrix), areolar (loose fibre matrix)" },
    { step: 7, concept: "Muscular tissue: three types with location and properties", tier: "medium", dependsOnStep: 5, teachingNote: "Table: striated vs smooth vs cardiac — location, voluntary/involuntary, striations, nuclei" },
    { step: 8, concept: "Nervous tissue: neuron structure and impulse transmission", tier: "medium", dependsOnStep: 5, teachingNote: "Dendrites (receive) → cell body → axon → axon terminals (send). Longest cell in the body." },
  ],

  realLifeApplications: [
    { context: "Bone fracture healing: the role of tissues", conceptUsed: "Connective tissue (bone, cartilage) and meristematic-like stem cells", explanation: "When a bone breaks, specialised cells form a callus (cartilage), which is slowly replaced by bone. This is tissue regeneration — the same cells that form tissues can, in some cases, repair them.", ageRelevance: "Students have experienced or know someone with a broken bone" },
    { context: "Why grass grows back after cutting", conceptUsed: "Intercalary meristem", explanation: "Grass has intercalary meristem at the base of each leaf — cutting the top doesn't remove the growth zone, so grass grows back. Trees with only apical meristems don't regrow as readily when topped.", ageRelevance: "Students see this every time a lawn is mowed" },
    { context: "Cardiac muscle and heart attack", conceptUsed: "Cardiac muscle tissue properties", explanation: "Cardiac muscle cannot fatigue (it has abundant mitochondria and continuous blood supply). But if blood supply is blocked (heart attack), cardiac cells die — unlike other muscle cells, heart muscle cells cannot be replaced.", ageRelevance: "Heart disease is India's leading cause of death; this context is important" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch01", chapterName: "The Fundamental Unit of Life", linkType: "builds-on", description: "Chapter 1's cell structure explains why tissues function the way they do — organelles determine tissue function" },
    { subject: "Biology", classNum: 9, chapterId: "ch03", chapterName: "Diversity in Living Organisms", linkType: "prerequisite-for", description: "Classification of organisms is partly based on tissue organisation — animals vs plants have different tissue types" },
  ],

  crossSubjectLinks: [
    { subject: "Physics", topic: "Pressure and fluid flow in blood vessels", description: "Blood pressure and flow through blood vessels (connective tissue) involves the same physics as fluid mechanics", strength: "moderate" },
    { subject: "Chemistry", topic: "Cellulose and lignin: chemical basis of plant cell walls", description: "Parenchyma walls are cellulose; sclerenchyma walls are lignified (lignin polymer) — chemistry of plant structure", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Observe prepared slides: parenchyma, xylem, smooth muscle — draw and describe what you see", duration: "20 minutes", pedagogyNote: "NEP-IDC: observation before classification. Students describe structure; then learn the names." },
    { step: 2, action: "Plant tissue classification: meristematic vs permanent — table format with examples", duration: "15 minutes", pedagogyNote: "Classification tree: plant tissue → meristematic or permanent → types. Students build the tree." },
    { step: 3, action: "Simple permanent tissues: parenchyma, collenchyma, sclerenchyma — structure-function relationship", duration: "20 minutes", pedagogyNote: "For each: draw, function, location. Emphasise that sclerenchyma is dead — and WHY that helps its function." },
    { step: 4, action: "Complex tissues: xylem and phloem — transport functions and components", duration: "25 minutes", pedagogyNote: "Xylem story: water rises from soil through dead hollow vessels. Phloem story: sugar moves from leaves in living sieve tubes." },
    { step: 5, action: "Animal tissues: epithelial — types and body locations", duration: "15 minutes", pedagogyNote: "Function drives form: where you need protection (skin) vs absorption (intestine) vs secretion (glands) → different epithelial types" },
    { step: 6, action: "Connective tissue: matrix emphasis; classify blood, bone, cartilage, areolar", duration: "20 minutes", pedagogyNote: "Surprising fact: blood is connective tissue! The matrix criterion is what makes it so." },
    { step: 7, action: "Muscle types and nervous tissue: compare all three muscles; draw a neuron", duration: "20 minutes", pedagogyNote: "Table: location, voluntary?, striations, nuclei count. Cardiac is uniquely involuntary but striated." },
  ],
};

export const DIVERSITY_IN_LIVING_ORGANISMS: ChapterKnowledge = {
  chapterId: "ch03", chapterName: "Diversity in Living Organisms", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Explain the need for classification and Whittaker's five-kingdom system", bloomsLevel: "understand", assessable: true },
    { statement: "Classify and characterise the five kingdoms: Monera, Protista, Fungi, Plantae, Animalia", bloomsLevel: "understand", assessable: true },
    { statement: "Identify the major divisions/phyla within the plant and animal kingdoms with examples", bloomsLevel: "understand", assessable: true },
    { statement: "Distinguish between closely related groups using observable features", bloomsLevel: "analyse", assessable: true },
    { statement: "Explain the hierarchical classification system (Kingdom → Species)", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: why did scientists move from 2-kingdom to 5-kingdom classification? What new evidence necessitated the change?" },
    { ruleCode: "NEP-IDC", application: "Collect and classify 10 specimens from the school garden into major groups; observe and record characteristics" },
    { ruleCode: "NEP-REFL", application: "Reflect on why classification matters beyond just organising — it reveals evolutionary relationships" },
  ],

  cbseOutcomes: [
    "Student explains the need for classification and the basis of Whittaker's five-kingdom system",
    "Student characterises each of the five kingdoms with examples",
    "Student names and characterises major divisions of the plant kingdom (thallophyta through angiosperms) with examples",
    "Student names and characterises major phyla of the animal kingdom from Porifera to Mammalia",
  ],

  icseOutcomes: [
    "ICSE expects: detailed study of phyla with more examples and distinguishing features",
    "ICSE additionally tests: binomial nomenclature rules (Carolus Linnaeus; genus+species in italics)",
  ],

  coreConcepts: [
    "Classification organises the 8.7 million known species into manageable groups sharing common features",
    "Aristotle (first classification) → Linnaeus (binomial nomenclature) → Whittaker (5 kingdoms) — classification evolves as knowledge grows",
    "Five kingdoms: Monera (prokaryotes), Protista (unicellular eukaryotes), Fungi (heterotrophic with chitinous wall), Plantae (autotrophic, multicellular), Animalia (heterotrophic, no cell wall)",
    "Plant kingdom: thallophyta → bryophyta → pteridophyta → gymnosperms → angiosperms — increasing complexity and adaptation to land",
    "Animal kingdom: Porifera → Coelenterata → Platyhelminthes → Nematoda → Annelida → Arthropoda → Mollusca → Echinodermata → Protochordata → Vertebrata",
    "Vertebrates are sub-classified by: presence of scales/hair/feathers, warm/cold-blooded, mode of reproduction (egg/live birth)",
  ],

  subtopics: [
    { id: "t1", name: "Need for Classification and Hierarchy", coreConcept: "Classification reveals evolutionary relationships; hierarchy: Kingdom > Phylum > Class > Order > Family > Genus > Species", keyIdea: "Closely related organisms share more features — classification is a prediction tool", estimatedPeriods: 2 },
    { id: "t2", name: "Five Kingdoms: Monera, Protista, Fungi", coreConcept: "Monera: prokaryotes (bacteria, cyanobacteria). Protista: unicellular eukaryotes (amoeba, euglena, paramecium). Fungi: heterotrophic, cell wall of chitin, absorptive nutrition (mushrooms, yeast, moulds)", keyIdea: "The five-kingdom system separates organisms by cell type, nutrition, and body organisation", estimatedPeriods: 3 },
    { id: "t3", name: "Plant Kingdom: Divisions", coreConcept: "Thallophyta (algae, no distinct body parts) → Bryophyta (amphibians of plants) → Pteridophyta (ferns, first vascular plants) → Gymnosperms (naked seeds) → Angiosperms (seeds in fruit)", keyIdea: "Progression in plant complexity: from water-dependent (algae) to fully land-adapted (flowering plants)", estimatedPeriods: 3 },
    { id: "t4", name: "Animal Kingdom: Phyla and Vertebrates", coreConcept: "9 invertebrate phyla + 1 phylum Chordata (vertebrates: fish, amphibia, reptiles, birds, mammals)", keyIdea: "Each phylum has a defining body-plan feature: Porifera=pores; Coelenterata=hollow gut; Platyhelminthes=flat body; Annelida=segmented rings; Arthropoda=jointed legs", estimatedPeriods: 3 },
  ],

  conceptGraph: [
    { from: "bio:9:ch01:prokaryote-eukaryote", to: "bio:9:ch03:monera-vs-other-kingdoms", relationship: "applies", explanation: "The prokaryote/eukaryote distinction from Chapter 1 is the most fundamental split in classification — Monera (prokaryotes) vs all other kingdoms (eukaryotes)" },
    { from: "bio:9:ch02:xylem-phloem", to: "bio:9:ch03:vascular-plants-classification", relationship: "applies", explanation: "Presence or absence of vascular tissue (xylem/phloem) distinguishes major plant divisions: bryophytes (no vascular) vs pteridophytes and above (vascular)" },
  ],

  prerequisites: {
    chapters: [{ subject: "Biology", classNum: 9, chapterId: "ch01", chapterName: "The Fundamental Unit of Life", requiredConcepts: ["bio:9:ch01:prokaryote-eukaryote"] }],
    concepts: ["bio:9:ch01:prokaryote-eukaryote", "bio:9:ch02:tissue-as-group-of-cells"],
  },

  essentialDefinitions: [
    { term: "Classification", formalDefinition: "The systematic grouping of organisms into hierarchical categories based on shared characteristics and evolutionary relationships", informalExplanation: "Sorting living things into categories — like organising a library by genre, author, and title" },
    { term: "Binomial Nomenclature", formalDefinition: "The system introduced by Carolus Linnaeus for naming organisms using two Latin words: the first (capitalised) is the genus name; the second (lowercase) is the species epithet; both written in italics", informalExplanation: "Scientific naming with two words: humans are Homo sapiens; house cat is Felis catus" },
    { term: "Species", formalDefinition: "The basic unit of classification; a group of organisms that can interbreed to produce fertile offspring and share common ancestry", informalExplanation: "Organisms that can mate with each other and produce fertile young — dogs and cats cannot; they are different species" },
    { term: "Gymnosperm", formalDefinition: "A plant whose seeds are 'naked' — not enclosed within a fruit; typically found in cones", informalExplanation: "'Naked seed' plants — pine, spruce, fir. Seeds develop in cones, not in fruits", example: "Pine (Pinus), spruce (Picea), cycad (Cycas)" },
    { term: "Angiosperm", formalDefinition: "A plant whose seeds are enclosed within a fruit (developed from the ovary); the most diverse group of plants", informalExplanation: "'Hidden seed' plants — the seeds are inside a fruit. All flowering plants are angiosperms.", example: "Rice, wheat, mango, rose — all flowering plants" },
    { term: "Warm-blooded (Endothermic)", formalDefinition: "An animal that maintains a constant internal body temperature regardless of environmental temperature; requires high metabolic rate", informalExplanation: "Their body temperature stays constant whether it is hot or cold outside — birds and mammals" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Fungi are plants because they don't move", correction: "Fungi are in a separate kingdom. Unlike plants: (1) they have no chlorophyll and cannot photosynthesise; (2) their cell wall is chitin (not cellulose); (3) they absorb nutrients from dead matter. Fungi are more closely related to animals than to plants.", whyItHappens: "Fungi look like they grow from soil like plants; mushrooms appear plant-like", revealingQuestion: "What mode of nutrition do fungi use? How is this different from plants? Use these to explain why they are in a separate kingdom." },
    { misconception: "Whales are fish because they live in water", correction: "Whales are mammals: they breathe air (lungs), nurse their young with milk, are warm-blooded, give birth to live young, and have hair (vestigial). Living in water does not make an animal a fish.", whyItHappens: "Habitat is confused with classification — but classification is based on body features and evolutionary history, not habitat", revealingQuestion: "Give three features that prove whales are mammals, not fish." },
    { misconception: "Viruses belong to Monera (the bacteria kingdom)", correction: "Viruses are not included in any of the five kingdoms — they are not considered cellular life. They have no cells, no metabolism, and can only replicate inside a host cell. They are classified separately.", whyItHappens: "Viruses are discussed along with bacteria in disease contexts", revealingQuestion: "Why don't viruses fit into any of the five kingdoms?" },
  ],

  examinerTraps: [
    { trap: "Confusing gymnosperms and angiosperms", typicalScenario: "Student says 'gymnosperms have seeds in fruits'", avoidanceStrategy: "Gymno = naked → gymnosperms have naked seeds (in cones). Angio = enclosed → angiosperms have seeds enclosed in fruit. The words tell you the answer.", marksAtRisk: "1 mark for wrong definition" },
    { trap: "Not specifying the kingdom name when giving examples", typicalScenario: "Question asks for a feature of Kingdom Fungi; student describes algae", avoidanceStrategy: "Always check: which kingdom, which division, which phylum is the question asking about? Answer exactly that.", marksAtRisk: "Full marks for answering the wrong kingdom" },
  ],

  typicalMistakes: [
    { mistake: "Bryophytes are the first vascular plants", correction: "Bryophytes (mosses, liverworts) are NON-vascular — they have no xylem or phloem. Pteridophytes (ferns) are the FIRST vascular plants.", conceptualError: "Confusing the order of plant evolution — bryophytes come before pteridophytes" },
    { mistake: "Protista are bacteria", correction: "Protista are unicellular EUKARYOTES (have a membrane-bound nucleus). Bacteria are prokaryotes (no nucleus) in kingdom Monera.", conceptualError: "Confusing unicellular with prokaryotic" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "remember", masteryLevel: "analyse", targetLevels: ["remember", "understand", "apply", "analyse"], hotsStarters: ["Arrange these plant groups in order of increasing complexity and explain each step: angiosperms, pteridophytes, gymnosperms, bryophytes, thallophytes.", "Why are bryophytes called the 'amphibians of the plant kingdom'?"] },
    { subtopicId: "t4", entryLevel: "remember", masteryLevel: "evaluate", targetLevels: ["remember", "understand", "evaluate"], hotsStarters: ["Is a whale a mammal or a fish? Give three pieces of evidence to support your answer.", "Explain why the five-kingdom system is better than the two-kingdom system (plants and animals)."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Why classify? Hierarchy: Kingdom → Species", tier: "foundational", teachingNote: "Start with a familiar classification: types of vehicles (car, bus, truck, bicycle). Then extend to biological classification." },
    { step: 2, concept: "Two-kingdom vs five-kingdom classification; basis for Whittaker's system", tier: "medium", dependsOnStep: 1, teachingNote: "The problem with 2 kingdoms: where do fungi and protists go? Whittaker solved this by adding 3 more kingdoms." },
    { step: 3, concept: "Monera, Protista, Fungi: features, examples", tier: "medium", dependsOnStep: 2, teachingNote: "Monera: no nucleus. Protista: unicellular eukaryote. Fungi: chitin wall, absorptive. Clear examples for each." },
    { step: 4, concept: "Plant kingdom divisions: from thallophyta to angiosperm — evolution story", tier: "medium", dependsOnStep: 3, teachingNote: "Tell the evolution story: plants conquered land — each division is one step further from water dependence" },
    { step: 5, concept: "Animal kingdom: invertebrate phyla — features, body plan, examples", tier: "medium", dependsOnStep: 3, teachingNote: "Focus on the distinguishing feature of each phylum — students need a clear, memorable one feature per group" },
    { step: 6, concept: "Vertebrates: five classes (fish, amphibia, reptiles, birds, mammals) — compare", tier: "medium", dependsOnStep: 5, teachingNote: "Table with: class, warm/cold-blooded, covering (scales/feathers/hair), reproduction (eggs/live), example" },
  ],

  realLifeApplications: [
    { context: "Antibiotic resistance and bacterial classification", conceptUsed: "Monera kingdom; bacterial diversity", explanation: "Different classes of bacteria respond differently to antibiotics. Knowing whether bacteria are gram-positive or gram-negative (classification) determines which antibiotic to prescribe.", ageRelevance: "Antibiotics are prescribed to all students at some point; this context makes classification relevant" },
    { context: "Agriculture: monocots vs dicots", conceptUsed: "Angiosperm classification within plant kingdom", explanation: "Wheat, rice, maize (monocots) vs. dal, tomato, cotton (dicots) require different agricultural techniques. Classification determines farming practice.", ageRelevance: "India's agricultural economy; students eat monocots and dicots daily" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch04", chapterName: "Why Do We Fall Ill?", linkType: "parallel-concept", description: "Disease-causing organisms (bacteria, viruses, fungi, protists) are classified in the same systems studied here" },
  ],

  crossSubjectLinks: [
    { subject: "Economics", topic: "Biodiversity and ecosystem services", description: "Biodiversity (the diversity studied in this chapter) underpins agriculture, medicine, and all ecosystem services that the economy depends on", strength: "moderate" },
    { subject: "Chemistry", topic: "Cellulose, chitin, and lignin as structural polymers", description: "The cell wall chemistry distinguishes kingdoms — cellulose (plants), chitin (fungi), peptidoglycan (bacteria) are different chemical polymers", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Sort activity: give students 20 organism picture cards; sort into groups; discuss criteria used", duration: "15 minutes", pedagogyNote: "NEP-IDC: students discover the need for clear criteria before they are told the criteria" },
    { step: 2, action: "Introduce Whittaker's five kingdoms: the criteria and how they improve on two-kingdom", duration: "15 minutes", pedagogyNote: "Historical progression: 2 → 4 → 5 kingdoms as more was discovered. Science advances by revising classifications." },
    { step: 3, action: "Monera, Protista, Fungi: features and 2 examples each; clear comparison", duration: "20 minutes", pedagogyNote: "Flash card activity: feature → kingdom. Build recognition speed." },
    { step: 4, action: "Plant kingdom: tell the 'plants colonise land' evolution story — one division per chapter of the story", duration: "25 minutes", pedagogyNote: "Narrative approach: algae (water-bound) → mosses (need water for reproduction) → ferns (vascular but spores) → gymnosperms (seeds!) → angiosperms (seeds in fruit = protection)" },
    { step: 5, action: "Animal kingdom: phyla in order — feature + example for each", duration: "25 minutes", pedagogyNote: "Memory aid: use a funny sentence or visual for each phylum's defining feature" },
    { step: 6, action: "Vertebrate comparison table: all five classes with features", duration: "20 minutes", pedagogyNote: "Students complete the table; then apply: 'Platypus: lays eggs but is warm-blooded with hair — which class?'" },
  ],
};

/**
 * ⚠️  NON-EXAM 2026-27: "Why Do We Fall Ill?" is NOT in the 2026-27 CBSE Class 9 Science exam syllabus.
 * Retained for curriculum completeness and enrichment only.
 * Authority: CLASS9_CURRICULUM_BASELINE.md §2-C, CLASS9_STRUCTURE_ALIGNMENT.md CHANGE-019.
 */
export const WHY_DO_WE_FALL_ILL: ChapterKnowledge = {
  chapterId: "ch04", chapterName: "Why Do We Fall Ill?", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Define health and distinguish it from 'absence of disease'", bloomsLevel: "understand", assessable: true },
    { statement: "Classify diseases as infectious/non-infectious and acute/chronic", bloomsLevel: "understand", assessable: true },
    { statement: "Explain how infectious diseases are caused, transmitted, and how the body responds", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the principles of treatment and prevention of infectious diseases", bloomsLevel: "apply", assessable: true },
    { statement: "Explain how vaccines work and why immunisation is important", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-ETH", application: "Discuss vaccine hesitancy — why do some people resist vaccines despite evidence of safety and efficacy?" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'A person with no visible symptoms is healthy' — is this definition adequate? What dimensions of health are missing?" },
    { ruleCode: "NEP-IDC", application: "Collect data on disease prevalence in your neighbourhood; identify patterns (age, season, location) and hypothesise causes" },
    { ruleCode: "NEP-COMP", application: "Design a personal health improvement plan based on WHO's definition of health and the chapter's prevention principles" },
  ],

  cbseOutcomes: [
    "Student distinguishes health from mere absence of disease using WHO's multidimensional definition",
    "Student classifies diseases as acute/chronic, infectious/non-infectious with examples",
    "Student explains modes of transmission of infectious diseases and the role of vectors",
    "Student explains principles of treatment (specific and symptomatic) and prevention (vaccination, vector control, sanitation)",
  ],

  icseOutcomes: [
    "ICSE expects: detailed study of specific diseases — tuberculosis, cholera, malaria — their causative organisms, transmission, and control",
    "ICSE additionally tests: the immune system response — primary and secondary immune response (conceptual)",
  ],

  coreConcepts: [
    "Health is a state of complete physical, mental, and social well-being — not merely absence of disease (WHO)",
    "Disease = dysfunction of organ or body system — may or may not have visible symptoms",
    "Infectious diseases are caused by biological agents (bacteria, viruses, fungi, protists, worms) that can be transmitted",
    "Transmission routes: airborne (TB, cold), waterborne (cholera, typhoid), vector-borne (malaria, dengue), sexual contact (HIV)",
    "Immunity: the body's ability to resist specific diseases; vaccines stimulate immunity without causing the disease",
    "Prevention is better than cure: sanitation, immunisation, vector control, and healthy lifestyle prevent most infectious diseases",
  ],

  subtopics: [
    { id: "t1", name: "Health and Its Dimensions", coreConcept: "Health encompasses physical, mental, and social well-being — not just absence of disease", keyIdea: "A person can be disease-free but unhealthy (depression, social isolation, malnutrition)", estimatedPeriods: 1 },
    { id: "t2", name: "Disease: Classification and Causes", coreConcept: "Infectious (communicable, caused by pathogens) vs non-infectious; acute (short) vs chronic (long duration)", keyIdea: "Infectious diseases have a specific biological cause that can be transmitted between individuals", estimatedPeriods: 2 },
    { id: "t3", name: "Infectious Agents and Transmission", coreConcept: "Bacteria (TB, cholera), viruses (flu, dengue, HIV), fungi (ringworm), protists (malaria), worms (elephantiasis); transmission routes: air, water, contact, vector", keyIdea: "Match the pathogen type to the disease; transmission route determines prevention strategy", estimatedPeriods: 3 },
    { id: "t4", name: "Treatment and Prevention", coreConcept: "Treatment: kill pathogen (antibiotic, antiviral) AND manage symptoms. Prevention: immunisation, sanitation, vector control, lifestyle", keyIdea: "Vaccines train the immune system to recognise a pathogen before real infection", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "bio:9:ch03:monera-kingdom", to: "bio:9:ch04:bacterial-diseases", relationship: "applies", explanation: "Bacteria from Kingdom Monera cause diseases like TB, cholera, typhoid" },
    { from: "bio:9:ch03:protista-kingdom", to: "bio:9:ch04:malaria-causative-agent", relationship: "applies", explanation: "Plasmodium (protist) causes malaria — classification knowledge explains what kind of pathogen causes what kind of disease" },
    { from: "bio:9:ch02:epithelial-tissue", to: "bio:9:ch04:skin-as-first-defense", relationship: "applies", explanation: "Intact epithelial tissue (skin, mucous membranes) is the first line of defence against pathogen entry" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Biology", classNum: 9, chapterId: "ch03", chapterName: "Diversity in Living Organisms", requiredConcepts: ["bio:9:ch03:five-kingdoms"] },
    ],
    concepts: ["bio:9:ch03:monera-kingdom", "bio:9:ch03:protista-kingdom"],
  },

  essentialDefinitions: [
    { term: "Health", formalDefinition: "A state of complete physical, mental, and social well-being, not merely the absence of disease or infirmity (World Health Organisation, 1948)", informalExplanation: "Being truly healthy means feeling good physically (no pain, disease), mentally (happy, calm, not depressed), and socially (connected to community, able to function in society)" },
    { term: "Disease", formalDefinition: "A condition in which the normal functioning of an organ or body part is impaired due to infection, genetic abnormality, environmental factor, or nutritional deficiency", informalExplanation: "Something going wrong with the body — could be caused by germs, lifestyle, genes, or environment" },
    { term: "Pathogen", formalDefinition: "An organism or biological agent that causes disease in a host organism", informalExplanation: "Disease-causing germs — bacteria, viruses, fungi, parasites" },
    { term: "Infectious Disease", formalDefinition: "A disease caused by a pathogenic organism that can be transmitted from one person to another directly or through a vector or contaminated medium", informalExplanation: "A disease that can spread from person to person — cold, flu, TB, malaria" },
    { term: "Vector", formalDefinition: "An organism (usually an arthropod) that transmits a pathogen from one host to another without itself being harmed", informalExplanation: "The carrier that delivers the pathogen — mosquito carries malaria parasite; sandfly carries Leishmaniasis" },
    { term: "Immunity", formalDefinition: "The ability of an organism to resist a specific infectious disease, typically through specific antibodies or sensitised white blood cells", informalExplanation: "The body's memory against a pathogen — once exposed (by infection or vaccine), the body recognises and destroys the pathogen faster if it attacks again" },
    { term: "Antibiotic", formalDefinition: "A substance produced by microorganisms or made synthetically that kills or inhibits the growth of bacteria", informalExplanation: "Bacteria-killing drugs — important: they work on bacteria ONLY, not on viruses; taking antibiotics for a cold is useless and harmful", counterExample: "Antibiotics DO NOT work against viral infections (cold, flu, COVID-19)" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Antibiotics cure all infections", correction: "Antibiotics kill BACTERIA only. They have NO effect on viruses. Taking antibiotics for a viral cold is useless and contributes to antibiotic resistance — a major global health crisis.", whyItHappens: "Doctors prescribe antibiotics; students assume antibiotics cure all diseases", revealingQuestion: "A person has influenza (caused by a virus). Should they take antibiotics? Why or why not?" },
    { misconception: "A healthy-looking person has no disease", correction: "Many diseases are asymptomatic for years: HIV, tuberculosis, hepatitis, hypertension, type 2 diabetes. 'Looking healthy' is not the same as being disease-free.", whyItHappens: "We judge health by visible symptoms", revealingQuestion: "Can a person be infected with HIV but appear completely healthy? Explain." },
    { misconception: "Vaccines cause the disease they protect against", correction: "Vaccines contain weakened, killed, or partial forms of the pathogen (or mRNA that codes for a surface protein). They cannot cause the full disease — the immune system responds and builds memory without suffering the disease.", whyItHappens: "Fear that 'putting the germ in' will cause the disease — this misunderstands what is actually injected", revealingQuestion: "A child receives a polio vaccine. Explain how the vaccine protects against polio without causing polio." },
  ],

  examinerTraps: [
    { trap: "Stating that Plasmodium (malaria) is a bacterium", typicalScenario: "Student writes 'malaria is caused by a bacterium'", avoidanceStrategy: "Malaria is caused by Plasmodium — a PROTIST (unicellular eukaryote from kingdom Protista). The female Anopheles mosquito is the vector.", marksAtRisk: "1 mark for wrong kingdom/classification" },
    { trap: "Confusing vectors and reservoirs", typicalScenario: "Student calls the reservoir host (like a bat for rabies) the vector", avoidanceStrategy: "Vector: transmits pathogen between hosts (mosquito for malaria). Reservoir: the natural host where the pathogen lives without causing major disease (birds for bird flu).", marksAtRisk: "½ mark for wrong terminology" },
  ],

  typicalMistakes: [
    { mistake: "Dengue is caused by the Aedes mosquito", correction: "Dengue is caused by the dengue VIRUS. The Aedes mosquito is the VECTOR (transmitter) — it carries the virus but does not cause the disease itself.", conceptualError: "Confusing the pathogen with the vector" },
    { mistake: "Prevention and treatment mean the same thing", correction: "Prevention stops the disease from occurring (vaccine, sanitation). Treatment manages the disease after it has occurred (antibiotics, antivirals, symptomatic relief). Prevention is before; treatment is after.", conceptualError: "Not distinguishing pre-exposure from post-exposure interventions" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["A new disease outbreak occurs in a village. What information would you need to determine if it is infectious? Describe your investigation.", "Explain how washing hands before meals and using mosquito nets are each an example of disease prevention — which transmission route does each target?"] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["Evaluate: is treatment or prevention more important for malaria in India? Give reasons using epidemiological reasoning."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Health: WHO's multidimensional definition vs absence of disease", tier: "easy", teachingNote: "Ask: 'Are you healthy right now?' Then probe: physically, mentally, socially? The answer is complex." },
    { step: 2, concept: "Disease classification: infectious/non-infectious; acute/chronic", tier: "easy", dependsOnStep: 1, teachingNote: "Four-quadrant table: infectious-acute (malaria), infectious-chronic (HIV), non-infectious-acute (bone fracture), non-infectious-chronic (diabetes)" },
    { step: 3, concept: "Pathogens: types, diseases caused, examples", tier: "medium", dependsOnStep: 2, teachingNote: "Table: pathogen type, example pathogen, example disease. Use diseases familiar in India (malaria, TB, typhoid)" },
    { step: 4, concept: "Transmission routes: airborne, waterborne, sexual, vector-borne, direct contact", tier: "medium", dependsOnStep: 3, teachingNote: "For each route: what kinds of pathogens travel this way? What prevention strategy addresses this route?" },
    { step: 5, concept: "Treatment: specific (kill pathogen) + symptomatic (manage symptoms)", tier: "medium", dependsOnStep: 3, teachingNote: "Why two types? Specific kills the cause; symptomatic reduces suffering while the body fights" },
    { step: 6, concept: "Prevention: immunisation, sanitation, vector control — each mechanism", tier: "medium", dependsOnStep: 4, teachingNote: "For each: which transmission route does it address? Why does each work?" },
    { step: 7, concept: "How vaccines work: memory cells, secondary immune response", tier: "hard", dependsOnStep: 6, teachingNote: "Story: first exposure (vaccine) → immune system makes antibodies + memory cells → second exposure (real infection) → fast, large response → you don't get sick" },
  ],

  realLifeApplications: [
    { context: "COVID-19 pandemic: disease, transmission, and prevention", conceptUsed: "Infectious disease transmission, vaccination, public health measures", explanation: "COVID-19 (caused by SARS-CoV-2 virus) spread via airborne droplets; prevented by masks (barrier), hand washing (contact route), and vaccines (immunity). Every chapter concept was applied globally in 2020–21.", ageRelevance: "Students lived through the pandemic; deeply personal context" },
    { context: "Clean India Mission (Swachh Bharat): sanitation and disease prevention", conceptUsed: "Waterborne disease prevention through sanitation", explanation: "Open defecation contaminates water sources → cholera, typhoid spread. Toilets break the transmission chain. Swachh Bharat directly applies the waterborne transmission prevention concept.", ageRelevance: "Government scheme students know; connects health science to civic education" },
    { context: "Dengue season in India (monsoon)", conceptUsed: "Vector-borne disease; vector control", explanation: "Aedes mosquitoes breed in stagnant water after monsoon rains. Dengue outbreaks peak at this time. Vector control (removing stagnant water, mosquito nets) directly prevents the disease.", ageRelevance: "Students have experienced dengue season in India; personally relevant" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch03", chapterName: "Diversity in Living Organisms", linkType: "builds-on", description: "Disease-causing organisms belong to the kingdoms studied in Chapter 3 — bacteria (Monera), viruses (outside kingdoms), fungi, protists (Plasmodium)" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Antiseptics, disinfectants, and drugs", description: "Antibiotics and antiseptics are chemicals; understanding how they work connects to organic chemistry and molecular biology", strength: "moderate" },
    { subject: "Economics", topic: "Healthcare expenditure and economic impact of disease", description: "Disease reduces productivity and economic output; India's healthcare burden (TB, malaria, dengue) has direct economic consequences", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Discussion: 'Are you healthy right now?' — probe all three WHO dimensions", duration: "10 minutes", pedagogyNote: "NEP-REFL: students reflect on their own health status before defining health" },
    { step: 2, action: "Classify 20 diseases as infectious/non-infectious and acute/chronic in a group activity", duration: "15 minutes", pedagogyNote: "Group work; discuss borderline cases (e.g., cancer — non-infectious but why?)" },
    { step: 3, action: "Pathogens and their diseases: table construction — bacteria, virus, fungi, protist, worm", duration: "20 minutes", pedagogyNote: "Students recall diseases from Chapter 3 classification — they already know the kingdoms" },
    { step: 4, action: "Transmission routes: match each disease to its transmission mechanism", duration: "20 minutes", pedagogyNote: "Arrow diagram: pathogen → transmission route → host. Mosquito as vector for malaria." },
    { step: 5, action: "Prevention strategies: connect each to the transmission route it blocks", duration: "15 minutes", pedagogyNote: "Logical chain: airborne transmission → mask prevents it. Waterborne → clean water prevents it. Vector-borne → mosquito net prevents it." },
    { step: 6, action: "How vaccines work: story-based explanation of immune memory", duration: "20 minutes", pedagogyNote: "NEP-HOT: 'Why must children be vaccinated against diseases that no longer exist in India (like polio)?' Discuss herd immunity." },
    { step: 7, action: "COVID-19 case study: apply all chapter concepts to a real pandemic", duration: "15 minutes", pedagogyNote: "NEP-ETH: vaccine hesitancy, lockdowns, mask mandates — science, ethics, and social behaviour intertwine" },
  ],
};

/**
 * ⚠️  NON-EXAM 2026-27: "Natural Resources" is NOT in the 2026-27 CBSE Class 9 Science exam syllabus.
 * Retained for curriculum completeness and enrichment only.
 * Authority: CLASS9_CURRICULUM_BASELINE.md §2-C, CLASS9_STRUCTURE_ALIGNMENT.md CHANGE-019.
 */
export const NATURAL_RESOURCES: ChapterKnowledge = {
  chapterId: "ch05", chapterName: "Natural Resources", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Explain the role of biotic and abiotic components in maintaining life on Earth", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the nitrogen, carbon, oxygen, and water cycles; explain the role of organisms in each", bloomsLevel: "understand", assessable: true },
    { statement: "Explain the causes and consequences of air, water, and soil pollution", bloomsLevel: "analyse", assessable: true },
    { statement: "Evaluate the impact of human activities on natural resource depletion", bloomsLevel: "evaluate", assessable: true },
    { statement: "Explain the greenhouse effect and its role in global warming", bloomsLevel: "understand", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-ETH", application: "Examine India's role in global carbon emissions and the justice dimension: who emits most, who suffers most from climate change?" },
    { ruleCode: "NEP-IDC", application: "Measure air quality near school using a pollution monitor or visual assessment; compare urban vs rural readings" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Trees are the lungs of the Earth' — is this metaphor accurate? What do trees do for the biosphere?" },
  ],

  cbseOutcomes: [
    "Student explains the role of biosphere, atmosphere, hydrosphere, and lithosphere in supporting life",
    "Student describes the biogeochemical cycles: nitrogen, carbon, oxygen, and water cycle",
    "Student explains the causes and effects of air, water, and soil pollution and their consequences",
    "Student explains the greenhouse effect and global warming",
  ],

  icseOutcomes: [
    "ICSE additionally expects: quantitative understanding of carbon dioxide levels and their historical change",
    "ICSE tests: specific pollutants (SO₂, NO₂, CO, particulates) and their health effects",
  ],

  coreConcepts: [
    "Earth's four spheres (atmosphere, hydrosphere, lithosphere, biosphere) interact to support life",
    "Biogeochemical cycles: elements cycle through biotic and abiotic components — never depleted, just transformed",
    "Nitrogen cycle: N₂ is fixed by bacteria (Rhizobium), nitrified, used by plants, denitrified back to N₂ by other bacteria",
    "Carbon cycle: photosynthesis (CO₂→organic) and respiration/decomposition (organic→CO₂); human burning of fossil fuels is disrupting this",
    "Pollution disrupts natural cycles and harms health — air, water, and soil each have specific pollutants and effects",
    "Greenhouse effect: CO₂, methane, and water vapour trap heat in the atmosphere — natural process amplified by human activity causing global warming",
  ],

  subtopics: [
    { id: "t1", name: "Life-Support Systems: The Four Spheres", coreConcept: "Atmosphere, hydrosphere, lithosphere, and biosphere are interconnected — disrupting one affects all", keyIdea: "The biosphere is a thin film of life on Earth; it depends on all three abiotic spheres", estimatedPeriods: 2 },
    { id: "t2", name: "Biogeochemical Cycles", coreConcept: "Nitrogen, carbon, oxygen, and water cycle through ecosystems — microorganisms play crucial roles", keyIdea: "Nothing is truly 'used up' in nature — elements cycle. Human activities can disrupt these cycles.", estimatedPeriods: 4 },
    { id: "t3", name: "Pollution: Air, Water, Soil", coreConcept: "Pollutants disrupt the natural environment and harm living organisms; each medium has specific pollutants and effects", keyIdea: "Pollution is a resource in the wrong place at the wrong time", estimatedPeriods: 3 },
    { id: "t4", name: "Greenhouse Effect and Ozone Layer", coreConcept: "Greenhouse gases trap heat (global warming); ozone layer blocks UV radiation (ozone depletion)", keyIdea: "Both are natural protective processes being disrupted by human activity", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "bio:9:ch05:photosynthesis", to: "bio:9:ch05:carbon-cycle", relationship: "applies", explanation: "Photosynthesis is the key step that moves carbon from atmosphere (CO₂) into organic form in the carbon cycle" },
    { from: "bio:9:ch05:nitrogen-fixation", to: "bio:9:ch05:nitrogen-cycle", relationship: "applies", explanation: "Nitrogen fixation by Rhizobium and other bacteria is the entry point for nitrogen into the biotic cycle" },
    { from: "bio:9:ch05:greenhouse-effect", to: "bio:9:ch05:climate-change", relationship: "applies", explanation: "Enhanced greenhouse effect from human CO₂ emissions drives global warming and climate change" },
  ],

  prerequisites: {
    chapters: [{ subject: "Biology", classNum: 7, chapterId: "ch01", chapterName: "Nutrition in Plants", requiredConcepts: ["bio:7:ch01:photosynthesis-equation"] }],
    concepts: ["bio:7:ch01:photosynthesis-equation", "bio:9:ch01:cell-organelles"],
  },

  essentialDefinitions: [
    { term: "Biosphere", formalDefinition: "The region of Earth where living organisms exist; includes the lower atmosphere, hydrosphere, and upper lithosphere", informalExplanation: "The 'life zone' of Earth — the thin layer where life is possible" },
    { term: "Nitrogen Fixation", formalDefinition: "The conversion of atmospheric nitrogen (N₂) into compounds usable by plants (ammonia, nitrates) by nitrogen-fixing bacteria", informalExplanation: "Making atmospheric nitrogen 'available' to plants — atmospheric N₂ is too stable to use directly" },
    { term: "Nitrification", formalDefinition: "The conversion of ammonia (NH₃) to nitrites (NO₂⁻) and then nitrates (NO₃⁻) by nitrifying bacteria in the soil", informalExplanation: "Bacteria in soil convert ammonia from dead organisms into nitrates that plant roots can absorb" },
    { term: "Denitrification", formalDefinition: "The conversion of nitrates in the soil back to atmospheric nitrogen (N₂) by denitrifying bacteria; completes the nitrogen cycle", informalExplanation: "Bacteria release nitrogen back to the atmosphere — completing the cycle" },
    { term: "Greenhouse Effect", formalDefinition: "The warming of Earth's surface caused by greenhouse gases (CO₂, methane, water vapour) trapping heat radiation from Earth's surface in the atmosphere", informalExplanation: "Like a glass greenhouse that lets sunlight in but slows heat escaping — Earth stays warm enough for life. But too much warming is harmful." },
    { term: "Eutrophication", formalDefinition: "The enrichment of a water body with excess nutrients (especially nitrogen and phosphorus) causing excessive algal growth that depletes oxygen, killing aquatic life", informalExplanation: "When fertiliser runoff makes algae grow wildly in lakes and rivers — the algae use all the oxygen and fish die" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Ozone depletion and global warming are the same problem", correction: "They are two separate issues. Ozone depletion (caused by CFCs) is the thinning of the ozone layer in the stratosphere that blocks UV radiation. Global warming (caused by CO₂, methane) is the increase in surface temperature due to enhanced greenhouse effect. They have different causes and different consequences.", whyItHappens: "Both are 'pollution causing environmental problems' — students conflate the two", revealingQuestion: "Which problem is caused by CFCs? Which is caused by CO₂? What is different about their effects?" },
    { misconception: "Plants do not respire — only animals do", correction: "All living organisms, including plants, respire. Plants both photosynthesise AND respire. During the day, photosynthesis exceeds respiration (net CO₂ absorption). At night, only respiration occurs (CO₂ release).", whyItHappens: "Photosynthesis produces O₂; students think plants always produce oxygen and never consume it", revealingQuestion: "Do plants release CO₂ at night? Explain using your knowledge of respiration and photosynthesis." },
  ],

  examinerTraps: [
    { trap: "Confusing eutrophication with biomagnification", typicalScenario: "Student describes eutrophication as 'chemicals building up in animals'", avoidanceStrategy: "Eutrophication: nutrient excess in water → algal bloom → O₂ depletion → aquatic death. Biomagnification: non-biodegradable chemicals (pesticides) increasing in concentration at each trophic level.", marksAtRisk: "1 mark for wrong definition" },
  ],

  typicalMistakes: [
    { mistake: "Plants only take in CO₂ (never release it)", correction: "Plants take in CO₂ during photosynthesis but release CO₂ during respiration. The net balance determines whether a plant is a carbon sink (growing plant: net CO₂ intake) or source.", conceptualError: "Oversimplifying photosynthesis to 'plants only absorb CO₂'" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["What would happen to the nitrogen cycle if all nitrogen-fixing bacteria were destroyed?", "Trace a single nitrogen atom from the atmosphere to a protein in your body — describe every transformation it undergoes."] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["The greenhouse effect is necessary for life on Earth, yet it is causing climate change. Explain this apparent contradiction."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Four spheres of Earth; biosphere as life zone", tier: "foundational", teachingNote: "Diagram: Earth's layers; biosphere overlapping all three abiotic spheres" },
    { step: 2, concept: "Water cycle: evaporation, condensation, precipitation", tier: "easy", dependsOnStep: 1, teachingNote: "Most familiar cycle; use it to establish the concept before more complex cycles" },
    { step: 3, concept: "Carbon cycle: photosynthesis, respiration, decomposition, combustion", tier: "medium", dependsOnStep: 2, teachingNote: "Diagram with arrows; emphasise that human combustion adds carbon that was previously locked underground" },
    { step: 4, concept: "Nitrogen cycle: five steps (fixation, nitrification, assimilation, ammonification, denitrification)", tier: "hard", dependsOnStep: 2, teachingNote: "The most complex cycle; role of bacteria at each step. Use a story: N₂ gas → soil bacteria → plant → animal → decomposer → soil → N₂ again" },
    { step: 5, concept: "Air pollution: sources (vehicles, industries) and effects (respiratory, acid rain, smog)", tier: "medium", dependsOnStep: 1, teachingNote: "Local data: AQI in your city. Students connect to personal experience of pollution." },
    { step: 6, concept: "Water pollution: sources (sewage, fertilisers) and eutrophication", tier: "medium", dependsOnStep: 1, teachingNote: "Eutrophication explained step by step; river/lake near school as case study" },
    { step: 7, concept: "Greenhouse effect: natural vs enhanced; global warming consequences", tier: "medium", dependsOnStep: 3, teachingNote: "Natural greenhouse effect is essential; human enhancement is the problem — distinguish clearly" },
    { step: 8, concept: "Ozone depletion: CFCs and UV radiation", tier: "medium", dependsOnStep: 7, teachingNote: "Separate from greenhouse effect: different gases, different mechanism, different consequence (UV not heat)" },
  ],

  realLifeApplications: [
    { context: "Delhi's winter air pollution and AQI", conceptUsed: "Air pollution: sources, pollutants, health effects", explanation: "Delhi's 'toxic winter' (AQI 400-500) results from crop burning, vehicular emissions, and cold air trapping pollutants. Particulate matter (PM 2.5) penetrates deep into lungs.", ageRelevance: "Delhi students experience this directly; all students have seen news about it" },
    { context: "India's Namami Gange programme", conceptUsed: "Water pollution and remediation", explanation: "The Ganga is heavily polluted by industrial effluent, sewage, and religious offerings. The programme addresses sources, treatment plants, and restored flow — direct application of water pollution chapter concepts.", ageRelevance: "National programme; culturally significant river" },
    { context: "Carbon credits and climate negotiations (COP)", conceptUsed: "Carbon cycle; greenhouse effect; global responsibility", explanation: "Countries trade 'carbon credits' — the right to emit CO₂. This is an economic instrument based on the carbon cycle and greenhouse effect. India's role in COP negotiations depends on understanding these cycles.", ageRelevance: "Climate change is the defining issue for the students' generation" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 7, chapterId: "ch01", chapterName: "Nutrition in Plants (Class 7)", linkType: "builds-on", description: "Photosynthesis from Class 7 is now placed in the context of the carbon cycle and atmospheric CO₂ balance" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Acid rain: chemistry of SO₂ and NOₓ in atmosphere", description: "SO₂ + H₂O → H₂SO₃ (sulphurous acid); acid rain chemistry directly connects to air pollution biology", strength: "strong" },
    { subject: "Economics", topic: "Environmental economics and externalities", description: "Pollution is an externality — a cost not paid by the polluter. Carbon tax, green GDP, and environmental regulations are economic responses to biological problems", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "AQI check: look up today's air quality in your city on SAFAR or AQI India app", duration: "5 minutes", pedagogyNote: "NEP-IDC: real data from today. Is the air quality good or bad? What causes this?" },
    { step: 2, action: "Draw the water cycle from memory; then refine with correct terminology", duration: "15 minutes", pedagogyNote: "Start from what students know; build the formal vocabulary on top" },
    { step: 3, action: "Carbon cycle: diagram with all four arrows (photosynthesis, respiration, decomposition, combustion)", duration: "20 minutes", pedagogyNote: "Key insight: fossil fuels are carbon that was locked away for millions of years; burning releases it suddenly" },
    { step: 4, action: "Nitrogen cycle: story-based narration of a nitrogen atom's journey", duration: "25 minutes", pedagogyNote: "Tell the nitrogen atom's story: 'I am N₂ in the atmosphere... Rhizobium bacteria absorb me...'" },
    { step: 5, action: "Pollution types: case study of Delhi air, Ganga water, degraded soil", duration: "20 minutes", pedagogyNote: "Real Indian examples; AQI data; Ganga pollution photographs" },
    { step: 6, action: "Greenhouse effect and ozone depletion: compare and contrast carefully", duration: "20 minutes", pedagogyNote: "Side-by-side diagram: different gases, different mechanisms, different effects. This comparison is essential to avoid the common misconception of conflating them." },
  ],
};

/**
 * ⚠️  NON-EXAM 2026-27: "Improvement in Food Resources" is NOT in the 2026-27 CBSE Class 9 Science exam syllabus.
 * Retained for curriculum completeness and enrichment only.
 * Authority: CLASS9_CURRICULUM_BASELINE.md §2-C, CLASS9_STRUCTURE_ALIGNMENT.md CHANGE-019.
 */
export const IMPROVEMENT_IN_FOOD_RESOURCES: ChapterKnowledge = {
  chapterId: "ch06", chapterName: "Improvement in Food Resources", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Explain the need for improved food production to meet India's growing population needs", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the methods used to improve crop variety, crop production, and crop protection", bloomsLevel: "understand", assessable: true },
    { statement: "Explain sustainable practices in agriculture: crop rotation, mixed cropping, inter-cropping", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the major types of animal husbandry: cattle, poultry, and fish farming", bloomsLevel: "understand", assessable: true },
    { statement: "Evaluate sustainable vs unsustainable agricultural practices using environmental criteria", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Visit a local farm or agricultural centre; observe and document farming practices; compare with textbook methods" },
    { ruleCode: "NEP-ETH", application: "Evaluate the ethics of intensive animal farming — animal welfare vs food security for a growing population" },
    { ruleCode: "NEP-HOT", application: "Analyse: mixed cropping reduces risk. How? Which principle of risk management does this use?" },
    { ruleCode: "NEP-COMP", application: "Calculate the land area needed to feed India's 1.4 billion people — connect to food security and population arithmetic" },
  ],

  cbseOutcomes: [
    "Student explains the need for improving food production — population growth and land scarcity",
    "Student describes methods of improving crop varieties (hybridisation), crop production (irrigation, nutrients, HYV seeds), and crop protection (pesticides, biological control)",
    "Student explains mixed cropping, inter-cropping, and crop rotation and their benefits",
    "Student describes cattle, poultry, and fish farming practices; explains how they contribute to food security",
  ],

  icseOutcomes: [
    "ICSE expects: detailed knowledge of plant diseases (viral, bacterial, fungal) and their control measures",
    "ICSE additionally tests: types of irrigation (canal, well, drip, sprinkler) with advantages and disadvantages of each",
  ],

  coreConcepts: [
    "Food security requires improving productivity per unit of land — India cannot expand farmland indefinitely",
    "Crop variety improvement: high-yielding, disease-resistant, drought-tolerant, quality-improved varieties through selective breeding and hybridisation",
    "Crop production management: proper irrigation, nutrient supply (macro and micro nutrients), and crop protection (from pests, diseases, weeds)",
    "Sustainable practices: mixed cropping (risk reduction), inter-cropping (efficient land use), crop rotation (soil health), organic farming (reduced chemicals)",
    "Animal husbandry provides protein, milk, eggs — nutrition beyond staple grains; requires scientific management for productivity",
  ],

  subtopics: [
    { id: "t1", name: "Improvement of Crop Varieties", coreConcept: "Hybridisation, genetic improvement — develop seeds that yield more, resist disease, tolerate drought", keyIdea: "Green Revolution used HYV seeds; genetic modification is the next step (GMO crops)", estimatedPeriods: 2 },
    { id: "t2", name: "Crop Production Management: Nutrients, Irrigation, and Protection", coreConcept: "Plants need 16 essential nutrients; water must be supplied systematically; pests and diseases must be controlled", keyIdea: "Integrated Pest Management (IPM): use multiple strategies — biological, chemical, cultural — to minimise pesticide use", estimatedPeriods: 3 },
    { id: "t3", name: "Sustainable Cropping Practices", coreConcept: "Mixed cropping, inter-cropping, and crop rotation improve yield, reduce risk, and maintain soil health", keyIdea: "Monoculture (growing only one crop) depletes soil and increases disease risk — traditional mixed farming was more sustainable", estimatedPeriods: 2 },
    { id: "t4", name: "Animal Husbandry: Cattle, Poultry, Fish", coreConcept: "Scientific management of animal breeds, feed, disease prevention, and housing improves productivity", keyIdea: "India has the largest cattle population but low productivity per animal — improved breeds and management are key", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "eco:9:ch01:green-revolution", to: "bio:9:ch06:hYV-seeds", relationship: "applies", explanation: "The Green Revolution's HYV seeds are a direct application of crop variety improvement" },
    { from: "bio:9:ch05:soil-health", to: "bio:9:ch06:crop-rotation", relationship: "applies", explanation: "Crop rotation maintains soil health — connects natural resources to agricultural practice" },
    { from: "eco:9:ch04:food-security-availability", to: "bio:9:ch06:food-production-improvement", relationship: "applies", explanation: "Improving food production addresses the 'availability' dimension of food security" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Economics", classNum: 9, chapterId: "ch04", chapterName: "Food Security in India", requiredConcepts: ["eco:9:ch04:food-availability"] },
      { subject: "Biology", classNum: 9, chapterId: "ch05", chapterName: "Natural Resources", requiredConcepts: ["bio:9:ch05:soil-degradation"] },
    ],
    concepts: ["bio:9:ch05:biogeochemical-cycles", "eco:9:ch01:green-revolution"],
  },

  essentialDefinitions: [
    { term: "Hybridisation", formalDefinition: "The crossing of two genetically different plants or animals to produce offspring (hybrids) that combine desirable traits from both parents", informalExplanation: "Cross-breeding: take disease resistance from one variety and high yield from another — create a hybrid with both" },
    { term: "Mixed Cropping", formalDefinition: "Growing two or more crops simultaneously on the same piece of land, with seeds mixed and sown together", informalExplanation: "Sowing multiple crops in the same field at the same time — if one fails, others survive; risk is spread" },
    { term: "Inter-cropping", formalDefinition: "Growing two or more crops simultaneously in a definite row pattern; crops are spatially separated to avoid competition but maximise land use", informalExplanation: "Planting different crops in alternating rows — each uses different soil nutrients and heights, reducing competition" },
    { term: "Crop Rotation", formalDefinition: "The practice of growing different crops in succession on the same land in different seasons or years to maintain soil fertility and control pests", informalExplanation: "Growing different crops in turn: one season wheat, next season legumes — legumes fix nitrogen, restoring what wheat consumed" },
    { term: "Integrated Pest Management (IPM)", formalDefinition: "A pest control strategy that uses a combination of biological, cultural, physical, and chemical methods to minimise economic, health, and environmental damage from pests", informalExplanation: "Using natural predators, crop rotation, resistant varieties, AND carefully-targeted pesticides — not just blanket chemical spraying" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Mixed cropping and inter-cropping are the same practice", correction: "Mixed cropping: seeds mixed, no definite pattern, random distribution. Inter-cropping: definite row pattern, spatial separation. The key difference is organisation. In inter-cropping, you can harvest each crop separately.", whyItHappens: "Both involve growing multiple crops together — students overlook the organisational difference", revealingQuestion: "What is the main advantage of inter-cropping over mixed cropping in terms of harvest?" },
    { misconception: "Organic farming means no use of any chemicals", correction: "Organic farming avoids synthetic chemicals (pesticides, fertilisers). It uses natural inputs: compost, manure, biological pest control, and crop rotation. Some 'natural chemicals' are allowed in organic farming.", whyItHappens: "Students interpret 'organic' as 'no chemicals at all'", revealingQuestion: "Can organic farmers use any inputs to prevent pest damage? What kinds?" },
  ],

  examinerTraps: [
    { trap: "Confusing mixed cropping with inter-cropping", typicalScenario: "Student says 'in mixed cropping, crops are sown in definite rows'", avoidanceStrategy: "Mixed cropping: seeds MIXED together, no definite pattern. Inter-cropping: DEFINITE ROW PATTERN, crops separated. This distinction is tested every year.", marksAtRisk: "1 mark" },
    { trap: "Listing only one benefit of crop rotation", typicalScenario: "Student says only 'improves soil fertility' — misses weed and pest control", avoidanceStrategy: "Crop rotation benefits: (1) nitrogen fixing when legumes are grown, (2) breaks pest/disease cycle specific to one crop, (3) controls weeds that grow with a specific crop, (4) maintains soil structure.", marksAtRisk: "½ mark per missed benefit in a 2-3 mark question" },
  ],

  typicalMistakes: [
    { mistake: "Crop rotation is growing two crops in the same season", correction: "Crop rotation is growing different crops in DIFFERENT SEASONS on the same land. Mixed cropping and inter-cropping are the same-season practices.", conceptualError: "Confusing temporal (rotation) with spatial (mixed/inter) cropping strategies" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["A farmer grows only rice every year on the same field. What problems will arise after 5 years? What would you recommend?", "Compare mixed cropping and crop rotation: when would you recommend each, and why?"] },
    { subtopicId: "t1", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "analyse"], hotsStarters: ["What are the potential advantages and risks of genetically modified crops for food security in India?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Why do we need to improve food production?", tier: "foundational", teachingNote: "Population arithmetic: India's population vs arable land — productivity must increase" },
    { step: 2, concept: "Crop variety improvement: hybridisation, HYV seeds", tier: "easy", dependsOnStep: 1, teachingNote: "Connect to Green Revolution; extend to modern GMO debate" },
    { step: 3, concept: "Crop production: nutrients (macro/micro), irrigation, crop protection", tier: "medium", dependsOnStep: 2, teachingNote: "Plants need 16 elements; most come from soil; N, P, K are most commonly supplemented" },
    { step: 4, concept: "Sustainable practices: mixed cropping, inter-cropping, crop rotation — compare", tier: "medium", dependsOnStep: 3, teachingNote: "Clear comparison table for exam; the distinction between mixed and inter-cropping is consistently tested" },
    { step: 5, concept: "Animal husbandry: cattle, poultry, fish — breeds, feed, care", tier: "medium", dependsOnStep: 1, teachingNote: "India has highest cattle numbers but low milk yield per cow — exotic breeds vs indigenous breeds tradeoff" },
    { step: 6, concept: "Sustainable food systems: organic farming, reducing food waste", tier: "hard", dependsOnStep: 3, teachingNote: "NEP-ETH: sustainability as a moral responsibility to future generations" },
  ],

  realLifeApplications: [
    { context: "Bt cotton in India: GMO crop controversy", conceptUsed: "Genetic improvement of crops; hybridisation extended to genetic modification", explanation: "Bt cotton has a Bacillus thuringiensis gene that makes it resistant to the bollworm pest. India adopted Bt cotton — yields increased, pesticide use fell. But concerns about biodiversity, corporate control, and second-generation seeds remain.", ageRelevance: "India's major GMO crop controversy; farmer suicides in cotton belt context" },
    { context: "Operation Flood: India's White Revolution", conceptUsed: "Scientific animal husbandry; dairy farming", explanation: "Dr Verghese Kurien built India's cooperative dairy system (Amul) — transformed India from dairy-importing to dairy self-sufficient. Used cross-breeding, cooperative management, and cold storage technology.", ageRelevance: "Every student has used Amul products; India is now world's largest milk producer" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch05", chapterName: "Natural Resources", linkType: "builds-on", description: "Sustainable agriculture practices in Chapter 6 directly address soil degradation and water cycle disruption from Chapter 5" },
    { subject: "Economics", classNum: 9, chapterId: "ch04", chapterName: "Food Security in India", linkType: "parallel-concept", description: "Chapter 4 (Economics) identified the need for food availability; Chapter 6 (Biology) explains the biological methods to achieve it" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Fertilisers: NPK and their chemistry", description: "Nitrogen (N), Phosphorus (P), and Potassium (K) fertilisers are chemical compounds; understanding their chemistry improves their agricultural application", strength: "strong" },
    { subject: "Economics", topic: "Agricultural economics: MSP, subsidies, farmer income", description: "The economic context of agriculture (MSP, input subsidies, credit access) directly determines whether improved techniques are affordable to small farmers", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Data discussion: India has 1.4 billion people and X million hectares of farmland. How much food per hectare do we need?", duration: "10 minutes", pedagogyNote: "NEP-IDC: arithmetic makes the challenge concrete" },
    { step: 2, action: "Crop variety improvement: hybridisation concept — demonstrate by crossing two trait combinations on paper", duration: "15 minutes", pedagogyNote: "Simple Punnett square analogy: high yield × disease resistance → hybrid with both" },
    { step: 3, action: "Nutrients: which 16 elements do plants need? Why are N, P, K most important?", duration: "15 minutes", pedagogyNote: "Nitrogen for proteins (growth), phosphorus for energy (ATP), potassium for regulation" },
    { step: 4, action: "Sustainable practices: compare mixed, inter-cropping, and rotation — distinguish clearly", duration: "20 minutes", pedagogyNote: "Diagram each practice; the mixed vs inter-cropping distinction must be crystal clear" },
    { step: 5, action: "Animal husbandry: Amul story; cross-breeding; poultry and fish farming", duration: "20 minutes", pedagogyNote: "Amul's White Revolution as a case study; Dr Verghese Kurien and cooperative model" },
    { step: 6, action: "NEP-ETH debate: 'Should India adopt more GMO crops?' — pro and con", duration: "15 minutes", pedagogyNote: "Balanced debate: food security need vs biosafety, corporate control, farmer autonomy concerns" },
  ],
};

/** CHANGE-020: New 2026-27 exam chapter — chapterId ch11 in the integrated NCERT Science syllabus. */
export const REPRODUCTION: ChapterKnowledge = {
  chapterId: "ch11", chapterName: "Reproduction", classNum: 9, subject: "Biology", board: "Both",

  learningObjectives: [
    { statement: "Define reproduction and explain its importance for species survival", bloomsLevel: "understand", assessable: true },
    { statement: "Distinguish between asexual and sexual reproduction with examples from plants and animals", bloomsLevel: "understand", assessable: true },
    { statement: "Describe the methods of asexual reproduction: fission, budding, fragmentation, spore formation, vegetative propagation", bloomsLevel: "understand", assessable: true },
    { statement: "Explain the events of sexual reproduction in flowering plants: pollination, fertilisation, seed and fruit formation", bloomsLevel: "understand", assessable: true },
    { statement: "Compare modes of reproduction in animals; explain significance of oviparous vs viviparous strategies", bloomsLevel: "analyse", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Observe bread mould under a microscope; identify spore formation and sporangiophores; classify as asexual reproduction" },
    { ruleCode: "NEP-HOT", application: "Evaluate: 'Asexual reproduction produces identical copies; sexual reproduction produces variety.' Why might genetic variety be advantageous for species survival?" },
    { ruleCode: "NEP-REPR", application: "Draw and label the life cycle showing alternation between asexual and sexual phases; identify which stage is diploid and which haploid" },
    { ruleCode: "NEP-ETH", application: "Discuss cloning — is asexual reproduction of complex organisms ethical? What risks does genetic uniformity pose (e.g. crop monocultures)?" },
  ],

  cbseOutcomes: [
    "Student explains why reproduction is necessary for the continuity of a species",
    "Student distinguishes asexual from sexual reproduction with examples of each type",
    "Student describes the process of pollination, fertilisation, and seed/fruit formation in flowering plants",
    "Student compares oviparous and viviparous animals; explains internal and external fertilisation",
  ],

  icseOutcomes: [
    "ICSE expects: detailed study of vegetative propagation methods (artificial: cutting, grafting, layering) with labelled diagrams",
    "ICSE additionally tests: the role of each floral part (petal, sepal, anther, stigma, style, ovary, ovule) in sexual reproduction",
  ],

  coreConcepts: [
    "Reproduction is the biological process by which organisms produce offspring, ensuring species continuity",
    "Asexual reproduction: single parent, no gametes, genetically identical offspring — fast and efficient, no variation",
    "Sexual reproduction: two parents, gametes formed, genetically varied offspring — creates diversity that drives adaptation",
    "Vegetative propagation: asexual reproduction in plants using roots, stems, or leaves (natural + artificial methods)",
    "Pollination: transfer of pollen from anther to stigma; may be self- or cross-pollination via wind, insects, or other agents",
    "Fertilisation in plants: pollen tube grows to ovule; male gamete fuses with egg → zygote → seed; ovary → fruit",
  ],

  subtopics: [
    { id: "t1", name: "Introduction to Reproduction", coreConcept: "Reproduction ensures species survival; two broad types: asexual and sexual", keyIdea: "Without reproduction, species become extinct — it is as fundamental as nutrition and respiration", estimatedPeriods: 1 },
    { id: "t2", name: "Asexual Reproduction", coreConcept: "One parent, no gametes, offspring are clones: fission (Amoeba, Paramecium), budding (Hydra, yeast), spore formation (Rhizopus), fragmentation (Spirogyra)", keyIdea: "Asexual reproduction is fast and efficient — ideal when conditions are stable and favourable", estimatedPeriods: 3 },
    { id: "t3", name: "Vegetative Propagation", coreConcept: "Asexual reproduction in plants via vegetative parts: runners (strawberry), rhizomes (ginger), bulbs (onion), tubers (potato), leaf buds (Bryophyllum)", keyIdea: "Natural vegetative propagation + artificial methods (cutting, layering, grafting) — horticulturally and agriculturally significant", estimatedPeriods: 2 },
    { id: "t4", name: "Sexual Reproduction in Plants", coreConcept: "Flower is the reproductive organ: pollination → pollen tube growth → fertilisation → seed → fruit. Double fertilisation is unique to angiosperms.", keyIdea: "The pollen tube bridges the gap from stigma to ovule, delivering the male gamete to the egg", estimatedPeriods: 3 },
    { id: "t5", name: "Reproduction in Animals", coreConcept: "Oviparous (egg-laying) vs viviparous (live birth); external vs internal fertilisation; budding in Hydra; regeneration in starfish", keyIdea: "Viviparous animals protect the embryo inside the mother's body; oviparous provide nutrition inside the egg", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "bio:9:ch01:cell-division", to: "bio:9:ch11:asexual-reproduction", relationship: "applies", explanation: "Asexual reproduction fundamentally relies on mitosis — the cell divides and each part develops into a new organism" },
    { from: "bio:9:ch11:gamete-formation", to: "bio:9:ch11:fertilisation", relationship: "enables", explanation: "Gametes must fuse in fertilisation to restore the diploid chromosome number; formation precedes fusion" },
    { from: "bio:9:ch03:diversity-angiosperms", to: "bio:9:ch11:sexual-reproduction-plants", relationship: "applies", explanation: "Angiosperms (flowering plants) reproduce sexually via flowers — diversity of Chapter 3 connects to the mechanism in Chapter 11" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Biology", classNum: 9, chapterId: "ch01", chapterName: "Cell — The Fundamental Unit of Life", requiredConcepts: ["bio:9:ch01:cell-division-basic", "bio:9:ch01:nucleus-dna"] },
    ],
    concepts: ["bio:9:ch01:nucleus-dna", "bio:9:ch01:cell-membrane"],
  },

  essentialDefinitions: [
    { term: "Reproduction", formalDefinition: "The biological process by which an organism produces new individuals similar to itself, ensuring the continuity of the species", informalExplanation: "Making copies of yourself so the species doesn't die out" },
    { term: "Gamete", formalDefinition: "A mature haploid reproductive cell (sperm or egg) that unites with another gamete during sexual reproduction to form a diploid zygote", informalExplanation: "The sex cells — sperm from the father, egg from the mother; each has half the normal number of chromosomes" },
    { term: "Pollination", formalDefinition: "The transfer of pollen grains from the anther of a flower to the stigma of the same or another flower of the same species", informalExplanation: "Pollen reaching the sticky stigma of a flower — carried by wind, insects, water, or animals" },
    { term: "Fertilisation", formalDefinition: "The fusion of the male gamete with the female gamete to form a diploid zygote", informalExplanation: "When sperm meets egg — the two half-sets of chromosomes combine to form a complete new cell that grows into a new organism" },
    { term: "Vegetative Propagation", formalDefinition: "A form of asexual reproduction in plants where new plants develop from vegetative parts (roots, stems, or leaves) without seeds or spores", informalExplanation: "Growing a new plant from a cutting, tuber, or runner — no seeds, no flowers needed" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Only animals reproduce sexually; plants only reproduce asexually", correction: "Most flowering plants reproduce sexually via flowers. Many also reproduce asexually via vegetative propagation. The distinction is single parent (asexual) vs two parents with gametes (sexual), not which kingdom.", whyItHappens: "Animal mating is visible; plant sexual reproduction (pollination, fertilisation) is less obvious", revealingQuestion: "A rose cutting grows into a new rose plant. A rose flower produces seeds after pollination. Which is sexual? Which is asexual? Explain." },
    { misconception: "Pollination and fertilisation are the same event", correction: "Pollination = transfer of pollen to the stigma (before fertilisation). Fertilisation = actual fusion of nuclei inside the ovule. Sequence: pollination → pollen tube growth → fertilisation. They are separate, sequential events.", whyItHappens: "Students conflate pollen reaching the flower with fertilisation occurring", revealingQuestion: "A bee carries pollen from one flower to another. Has fertilisation occurred? What must happen next?" },
  ],

  examinerTraps: [
    { trap: "Stating that pollen fuses with the egg during pollination", typicalScenario: "Student writes 'during pollination, the pollen fuses with the egg to form a zygote'", avoidanceStrategy: "Pollination = pollen transfer to stigma only. Fertilisation (pollen tube grows to ovule; male nucleus fuses with egg) is a separate subsequent event.", marksAtRisk: "1 mark for confusing pollination with fertilisation" },
    { trap: "Stating that all bacteria reproduce sexually", typicalScenario: "Student writes 'bacteria reproduce both sexually and asexually via binary fission'", avoidanceStrategy: "Bacteria (Monera) reproduce asexually by binary fission — no gametes, no fusion. Binary fission is a form of asexual reproduction.", marksAtRisk: "1 mark for wrong reproduction type for bacteria" },
  ],

  typicalMistakes: [
    { mistake: "Spores are seeds", correction: "Spores are single cells produced asexually — no fertilisation needed; they germinate directly into new organisms. Seeds form after fertilisation and contain a plant embryo with a food store.", conceptualError: "Confusing asexual (spore) and sexual (seed) reproductive units" },
    { mistake: "Grafting produces a plant genetically identical to the rootstock", correction: "The scion (top part, grafted) retains its own genetics and produces its characteristic fruit. The rootstock provides roots and support. The resulting plant has TWO genotypes — it is a chimera, not genetically identical to either parent.", conceptualError: "Not understanding that grafting is a mechanical union, not a genetic fusion" },
  ],

  bloomsMap: [
    { subtopicId: "t2", entryLevel: "remember", masteryLevel: "apply", targetLevels: ["remember", "understand", "apply"], hotsStarters: ["An organism reproduces by splitting into two equal halves. Identify the type of reproduction. Why would asexual reproduction be advantageous in a stable, resource-rich environment?", "What would happen to a population of organisms that could only reproduce asexually if their environment suddenly changed?"] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["Trace the journey of a pollen grain from the anther to fertilisation in a flower.", "Why is cross-pollination generally considered advantageous over self-pollination? What are the disadvantages?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Definition of reproduction; why it is necessary; asexual vs sexual distinction", tier: "foundational", teachingNote: "Start with why — 'What would happen if no organism reproduced?' establishes the need before the mechanism" },
    { step: 2, concept: "Types of asexual reproduction: fission, budding, spore formation, fragmentation", tier: "easy", dependsOnStep: 1, teachingNote: "One diagram per type; connect to organism examples. Amoeba (fission), Hydra (budding), Rhizopus (spores), Spirogyra (fragmentation)" },
    { step: 3, concept: "Vegetative propagation: natural methods (runner, rhizome, bulb, tuber, leaf bud) and artificial (cutting, layering, grafting)", tier: "medium", dependsOnStep: 2, teachingNote: "Bring in actual plant material: potato 'eye', Bryophyllum leaf, ginger rhizome — students observe and classify" },
    { step: 4, concept: "Flower structure → pollination → pollen tube growth → fertilisation → seed and fruit formation", tier: "hard", dependsOnStep: 1, teachingNote: "Key sequence must be mastered step-by-step. Diagram of flower cross-section; trace pollen from anther to ovule. This is the #1 exam topic in this chapter." },
    { step: 5, concept: "Animal reproduction: oviparous vs viviparous; internal vs external fertilisation", tier: "medium", dependsOnStep: 1, teachingNote: "Comparison table: fish (external, oviparous) → frog (external, oviparous) → bird (internal, oviparous) → mammal (internal, viviparous)" },
  ],

  realLifeApplications: [
    { context: "Grafting in orchards (mango, apple, citrus)", conceptUsed: "Artificial vegetative propagation — grafting", explanation: "Farmers graft shoots of high-yielding varieties (scion) onto hardy rootstocks — combining disease resistance with quality fruit. The resulting plant produces fruit with the scion's genetics, ready to bear fruit sooner than a seedling.", ageRelevance: "Students from agricultural families will have seen this; connects to food production and India's horticulture industry" },
    { context: "Bee pollination and food security", conceptUsed: "Cross-pollination and the role of pollinators", explanation: "Bees transfer pollen between flowers while collecting nectar. Without bees, most crop plants cannot set fruit. Colony collapse disorder threatens global food security — directly linking pollination biology to global agriculture.", ageRelevance: "Climate change and pollinator loss are the defining issues for this generation; connects biology to current events" },
    { context: "Seedless fruit varieties (bananas, grapes, watermelons)", conceptUsed: "Vegetative propagation; reproductive biology", explanation: "Seedless fruits cannot reproduce sexually (no viable seeds). They are propagated entirely by vegetative means. This is a deliberate agricultural manipulation of the plant's reproductive biology.", ageRelevance: "Students eat bananas daily — learning they are sterile clones propagated vegetatively is genuinely surprising and memorable" },
  ],

  crossChapterLinks: [
    { subject: "Biology", classNum: 9, chapterId: "ch01", chapterName: "Cell — The Fundamental Unit of Life", linkType: "builds-on", description: "Cell division (mitosis and meiosis) underlies both asexual and sexual reproduction; organelle knowledge from Chapter 1 explains why cells divide" },
    { subject: "Biology", classNum: 9, chapterId: "ch03", chapterName: "Diversity in Living Organisms", linkType: "parallel-concept", description: "Classification of organisms in Chapter 3 reflects their mode of reproduction — kingdoms are partly defined by reproductive strategies" },
  ],

  crossSubjectLinks: [
    { subject: "Chemistry", topic: "Plant hormones (auxins, gibberellins) that regulate flowering and germination", description: "Plant hormones are chemical compounds that control the timing of reproduction — chemistry determines when a plant flowers and when seeds germinate", strength: "medium" },
  ],

  teachingSequence: [
    { step: 1, action: "Open question: 'What would happen if no living thing could reproduce?' — class discussion; establish necessity", duration: "10 minutes", pedagogyNote: "NEP-HOT: the question reveals that reproduction is a fundamental property of life, not just an additional feature" },
    { step: 2, action: "Asexual reproduction: show images of Amoeba binary fission, Hydra budding, Rhizopus spore case, Spirogyra fragmentation", duration: "20 minutes", pedagogyNote: "One diagram per type; student labels and names each. Check: 'In all four cases, how many parents are involved?'" },
    { step: 3, action: "Vegetative propagation: show actual samples (potato with 'eyes', Bryophyllum leaf with buds, ginger rhizome, strawberry runner)", duration: "15 minutes", pedagogyNote: "NEP-IDC: hands-on identification. Students observe and ask: 'Where is the new plant going to come from?'" },
    { step: 4, action: "Flower dissection (or detailed diagram): identify reproductive organs; explain the pollination-to-fertilisation sequence step by step", duration: "25 minutes", pedagogyNote: "Key sequence: anther releases pollen → pollen lands on stigma → pollen tube grows through style → male nucleus reaches ovule → fertilisation → zygote → embryo → seed; ovary → fruit" },
    { step: 5, action: "Animal reproduction comparison table: fish, frog, bird, human — fertilisation type and reproduction type", duration: "15 minutes", pedagogyNote: "Students fill in the table; teacher corrects. Common error: students say frog has internal fertilisation — it does NOT." },
    { step: 6, action: "Consolidation: 'Why does sexual reproduction create variety?' — brief introduction to chromosomes from each parent", duration: "10 minutes", pedagogyNote: "Plants the seed for Class 10 genetics — this chapter is the biological bridge between cell biology and genetics" },
  ],
};

export const BIOLOGY_CLASS9: ChapterKnowledge[] = [
  FUNDAMENTAL_UNIT_OF_LIFE,
  TISSUES,
  DIVERSITY_IN_LIVING_ORGANISMS,
  REPRODUCTION,
  WHY_DO_WE_FALL_ILL,
  NATURAL_RESOURCES,
  IMPROVEMENT_IN_FOOD_RESOURCES,
];
