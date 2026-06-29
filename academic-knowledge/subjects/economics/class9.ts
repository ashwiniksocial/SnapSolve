/**
 * Academic Knowledge — Economics, Class 9
 * 4 NCERT chapters (Social Science — Economics). Board: Both (CBSE + ICSE).
 */
import type { ChapterKnowledge } from "../../types";

export const VILLAGE_PALAMPUR: ChapterKnowledge = {
  chapterId: "ch01", chapterName: "The Story of Village Palampur", classNum: 9, subject: "Economics", board: "Both",

  learningObjectives: [
    { statement: "Identify and explain the four factors of production using Palampur as a case study", bloomsLevel: "understand", assessable: true },
    { statement: "Distinguish between fixed and working capital with examples from farming", bloomsLevel: "understand", assessable: true },
    { statement: "Analyse how modern farming methods increased production but created new inequalities", bloomsLevel: "analyse", assessable: true },
    { statement: "Explain why non-farm activities are essential for rural economic development", bloomsLevel: "understand", assessable: true },
    { statement: "Evaluate the sustainability of farming practices in Palampur", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-IDC", application: "Visit or research a local village; compare its economic activities to Palampur — data-driven analysis" },
    { ruleCode: "NEP-HOT", application: "Analyse: why do small farmers earn less despite using the same land? Examine the role of capital and bargaining power" },
    { ruleCode: "NEP-ETH", application: "Examine the inequality created by the Green Revolution — who benefited and who was left behind?" },
    { ruleCode: "NEP-COMP", application: "Apply the Palampur model to understand agricultural production in the students' own state" },
  ],

  cbseOutcomes: [
    "Student explains production, factors of production, and their roles using the Palampur case study",
    "Student distinguishes fixed capital from working capital and identifies examples of each in farming",
    "Student explains how modern farming inputs (HYV seeds, chemical fertilisers, irrigation) increased output but also concentration of land",
    "Student identifies and classifies non-farm activities in Palampur (dairy, transport, small manufacturing, trade)",
  ],

  icseOutcomes: [
    "ICSE additionally expects: detailed explanation of the 'Green Revolution' and its specific outcomes for small vs large farmers",
    "ICSE tests: theoretical framework of factors of production (land, labour, capital, enterprise) with formal economic definitions",
  ],

  coreConcepts: [
    "Production requires land, labour, capital, and enterprise (the four factors of production)",
    "Land is fixed in supply — production increase must come from better methods, not more land",
    "Capital includes both fixed capital (tools, machines — used multiple times) and working capital (inputs used once per cycle like seeds, fertiliser)",
    "Human capital (education, health) determines the quality and productivity of labour",
    "Modern farming inputs greatly increase yield but require capital investment — widening the gap between large and small farmers",
    "Non-farm activities (dairy, transport, business) are essential diversifiers for rural income and employment",
  ],

  subtopics: [
    { id: "t1", name: "Organisation of Production and Factors", coreConcept: "Production requires combining all four factors; each factor earns a return (rent, wages, interest, profit)", keyIdea: "No single factor is sufficient — all four must work together", estimatedPeriods: 2 },
    { id: "t2", name: "Farming in Palampur: Land and Labour", coreConcept: "Land is unequally distributed; labour (mostly landless labourers) is hired by large farmers; wages are low", keyIdea: "80% of families own less than 40% of the land — illustrates rural inequality", estimatedPeriods: 2 },
    { id: "t3", name: "Capital Inputs: Fixed and Working", coreConcept: "Fixed capital (wells, tractors) vs working capital (seeds, fertilisers) — both essential but differently financed", keyIdea: "Small farmers often lack capital; must borrow at high interest — debt trap", estimatedPeriods: 2 },
    { id: "t4", name: "Modern Farming Methods and Green Revolution", coreConcept: "HYV seeds + irrigation + fertilisers = more food output; but water table falling, soil degrading", keyIdea: "Short-term gains (food security) vs long-term costs (environmental degradation)", estimatedPeriods: 2 },
    { id: "t5", name: "Non-Farm Activities in Palampur", coreConcept: "Dairy, small manufacturers, shopkeepers, transport workers — essential for diversified rural income", keyIdea: "Without non-farm income, rural households are entirely dependent on farming season", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "eco:9:ch01:factors-of-production", to: "eco:9:ch01:farming-organisation", relationship: "applies", explanation: "The four factors framework is applied to understand how farming in Palampur is organised" },
    { from: "eco:9:ch01:fixed-working-capital", to: "eco:9:ch01:debt-trap-small-farmers", relationship: "applies", explanation: "Small farmers lack fixed capital; must borrow working capital at high interest; debt trap prevents investment" },
    { from: "eco:9:ch01:modern-farming-methods", to: "eco:9:ch02:human-capital", relationship: "applies", explanation: "Modern farming requires educated farmers who understand new techniques — connects to People as Resource" },
    { from: "eco:9:ch01:non-farm-activities", to: "eco:9:ch02:employment-diversification", relationship: "applies", explanation: "Non-farm activities provide employment beyond seasonal farming — reduces vulnerability" },
  ],

  prerequisites: {
    chapters: [],
    concepts: [],
  },

  essentialDefinitions: [
    { term: "Production", formalDefinition: "The process of creating goods and services using inputs (factors of production) to satisfy human needs and wants", informalExplanation: "Any activity that creates value — farming produces wheat, dairy produces milk, shops provide access to goods" },
    { term: "Factors of Production", formalDefinition: "The four essential inputs for production: land (natural resources), labour (human effort), capital (produced means of production), and enterprise/entrepreneurship (organising the other three)", informalExplanation: "Land is where you produce; labour is who does the work; capital is the tools and money; enterprise is who coordinates everything" },
    { term: "Fixed Capital", formalDefinition: "Capital that can be used in production over many years without being consumed; tools, machinery, buildings, wells", informalExplanation: "Things that last many seasons — a tractor, a well, a barn. You invest once and use many times." },
    { term: "Working Capital", formalDefinition: "Capital that is used up during the production process and must be replaced each cycle; seeds, fertilisers, raw materials, money for wages", informalExplanation: "Things that are used up each season — seeds, fertilisers, fuel. Buy new every season." },
    { term: "High-Yielding Variety (HYV) Seeds", formalDefinition: "Improved seeds developed through scientific breeding that produce more output per acre than traditional varieties when given sufficient water and fertiliser", informalExplanation: "Modern seeds that give much more wheat per field — the core of the Green Revolution" },
    { term: "Green Revolution", formalDefinition: "The dramatic increase in agricultural production in India (1960s–70s) through HYV seeds, irrigation, and chemical fertilisers; first in Punjab, Haryana, and western UP", informalExplanation: "India went from food scarcity to food surplus in two decades — but mainly benefited farmers who already had land and capital" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "All farmers in Palampur benefited equally from the Green Revolution", correction: "Large farmers with access to capital and irrigation benefited greatly; small and marginal farmers with less than 2 hectares often couldn't afford HYV seeds and fertilisers — the inequality widened", whyItHappens: "The Green Revolution is taught as a success story; its distributional effects are less emphasised", revealingQuestion: "In Palampur, why might a small farmer not be able to benefit from HYV seeds even if he wanted to?" },
    { misconception: "Land alone determines agricultural output", correction: "Land, combined with all four factors (quality labour, capital inputs, and entrepreneurship), determines output. The same land produces very different yields depending on irrigation, seeds, and management.", whyItHappens: "Land is the most visible factor in farming", revealingQuestion: "Two farmers have equal-sized fields. One uses HYV seeds and irrigation; the other uses traditional methods. Whose output will be greater?" },
  ],

  examinerTraps: [
    { trap: "Confusing fixed capital with working capital using the wrong example", typicalScenario: "Student gives seeds as fixed capital because they are 'needed every year'", avoidanceStrategy: "Fixed capital = DURABLE, used for MANY cycles (tractor, well, tool). Working capital = CONSUMED in production, replaced each cycle (seeds, fertiliser, wages).", marksAtRisk: "1 mark per misclassified example" },
    { trap: "Not distinguishing 'farm' from 'non-farm' activities when giving examples", typicalScenario: "Student lists dairy or fishing as 'farm activities'", avoidanceStrategy: "Farm activities: crop cultivation only. Non-farm activities: everything else in the rural economy — dairy, trade, transport, small manufacturing, services.", marksAtRisk: "1 mark per wrong classification" },
  ],

  typicalMistakes: [
    { mistake: "Enterprise is not a factor of production — only land, labour, capital", correction: "Enterprise (entrepreneurship) is the fourth factor; the person who organises land, labour, and capital, takes the risk, and earns profit", conceptualError: "Students often list only three factors" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["A small farmer needs seeds, fertiliser, and wages for labourers. He has no savings. What options does he have? What are the risks of each?", "Why do you think large farmers benefit more from modern farming methods than small farmers?"] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["The Green Revolution increased food production but the groundwater table in Punjab is falling. Evaluate the Green Revolution — was it sustainable?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Palampur village: who lives there, what activities happen", tier: "foundational", teachingNote: "Map activity: draw Palampur from the textbook description — visualise before analysing" },
    { step: 2, concept: "Four factors of production: define each with Palampur examples", tier: "easy", dependsOnStep: 1, teachingNote: "Each factor has a concrete example from Palampur: land=farm, labour=worker, capital=tractor, enterprise=farmer-owner" },
    { step: 3, concept: "Fixed vs working capital: classification activity", tier: "easy", dependsOnStep: 2, teachingNote: "Give 10 items; students classify; justify using the 'durable vs consumed' criterion" },
    { step: 4, concept: "Land distribution inequality: 80/40 data analysis", tier: "medium", dependsOnStep: 2, teachingNote: "Use textbook data: what percentage of families own what percentage of land — Gini coefficient concept hinted" },
    { step: 5, concept: "Modern farming methods: HYV seeds, irrigation, fertiliser — effects", tier: "medium", dependsOnStep: 3, teachingNote: "Timeline: before and after Green Revolution yields. Who could access these inputs?" },
    { step: 6, concept: "Non-farm activities: classification and importance", tier: "medium", dependsOnStep: 1, teachingNote: "List Palampur's non-farm activities; why do they exist? What happens if only farming existed?" },
    { step: 7, concept: "Sustainability of Palampur's farming: environmental consequences", tier: "hard", dependsOnStep: 5, teachingNote: "Falling water table, soil degradation — the Green Revolution's environmental cost; NEP-ETH" },
  ],

  realLifeApplications: [
    { context: "Understanding the MSP (Minimum Support Price) debate", conceptUsed: "Factors of production, farming economics", explanation: "The government's MSP guarantees farmers a minimum price for crops — understanding cost of production (land, labour, capital inputs) is essential to evaluate whether MSP is adequate", ageRelevance: "Current farmer protest context in India; highly relevant" },
    { context: "Rural-to-urban migration", conceptUsed: "Non-farm activities, limited income from small landholding", explanation: "When farming income is insufficient, rural families send members to cities. Understanding Palampur's economic constraints explains why migration happens.", ageRelevance: "Students may have family members who migrated; very direct personal connection" },
  ],

  crossChapterLinks: [
    { subject: "Economics", classNum: 9, chapterId: "ch02", chapterName: "People as Resource", linkType: "prerequisite-for", description: "The role of human capital in improving agricultural productivity builds on Chapter 1's factors of production" },
    { subject: "Economics", classNum: 9, chapterId: "ch03", chapterName: "Poverty as a Challenge", linkType: "prerequisite-for", description: "Rural poverty in Chapter 3 is directly linked to the inequality in land and capital distribution seen in Palampur" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Soil health and sustainable agriculture", description: "Over-use of chemical fertilisers degrades soil microbiota; Chapter 1's environmental concerns connect to biological sustainability", strength: "moderate" },
    { subject: "Chemistry", topic: "Chemical fertilisers: composition and effects", description: "NPK fertilisers are chemical compounds; understanding their composition and environmental impact connects Chemistry to Economics", strength: "moderate" },
  ],

  teachingSequence: [
    { step: 1, action: "Draw a sketch map of Palampur from the textbook description; identify farming and non-farming areas", duration: "10 minutes", pedagogyNote: "Spatial visualisation makes the case study feel real, not abstract" },
    { step: 2, action: "Role play: assign students roles (large farmer, small farmer, labourer, shopkeeper) — discuss daily life and income sources", duration: "20 minutes", pedagogyNote: "NEP-IDC: experiential learning of economic roles and inequalities" },
    { step: 3, action: "Define four factors of production; identify each in Palampur with specific examples", duration: "15 minutes", pedagogyNote: "Concrete examples from the chapter for each factor — avoid abstract definitions first" },
    { step: 4, action: "Fixed vs working capital: classification game with 20 items", duration: "10 minutes", pedagogyNote: "Fast-paced classification; justify each choice. Build automaticity before exam." },
    { step: 5, action: "Analyse land distribution data; discuss implications for income inequality", duration: "15 minutes", pedagogyNote: "NEP-HOT: 'If 60% of families own less than 20% of land, what happens to their bargaining power?'" },
    { step: 6, action: "Green Revolution discussion: yield data, who benefited, environmental cost", duration: "20 minutes", pedagogyNote: "NEP-ETH: was the Green Revolution a success? Success for whom? At what cost?" },
    { step: 7, action: "Non-farm activities: why essential; what would happen without them?", duration: "15 minutes", pedagogyNote: "Connect to economic diversification — risk reduction; multiple income sources" },
  ],
};

export const PEOPLE_AS_RESOURCE: ChapterKnowledge = {
  chapterId: "ch02", chapterName: "People as Resource", classNum: 9, subject: "Economics", board: "Both",

  learningObjectives: [
    { statement: "Define human capital and distinguish it from physical capital", bloomsLevel: "understand", assessable: true },
    { statement: "Explain how investment in education and health improves human capital", bloomsLevel: "understand", assessable: true },
    { statement: "Classify types of unemployment prevalent in India; explain disguised unemployment", bloomsLevel: "understand", assessable: true },
    { statement: "Analyse gender disparities in economic participation and suggest reasons", bloomsLevel: "analyse", assessable: true },
    { statement: "Evaluate the relationship between quality of population and economic development", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-HOT", application: "Evaluate: 'A large population is a burden on the economy.' Is this always true? Under what conditions is it an advantage?" },
    { ruleCode: "NEP-ETH", application: "Discuss gender wage gap and lower female labour force participation — structural causes and policy responses" },
    { ruleCode: "NEP-IDC", application: "Collect data on education level and income in your own family/community — test the human capital hypothesis" },
  ],

  cbseOutcomes: [
    "Student defines human capital and explains its role in economic development",
    "Student explains how education and health investment enhances human capital quality",
    "Student defines unemployment; classifies types (seasonal, disguised, open) with Indian examples",
    "Student explains quality of population indicators and their relationship to development",
  ],

  icseOutcomes: [
    "ICSE additionally expects: Human Development Index (HDI) and India's ranking; its components (health, education, income)",
    "ICSE tests: labour force participation rate calculation and interpretation",
  ],

  coreConcepts: [
    "People are a resource — their knowledge, skills, and health create economic value",
    "Human capital = investment in people (education, health, training) that increases their productive capacity",
    "Unlike physical capital, human capital walks away with the person — it requires continuous development",
    "Disguised unemployment: more workers on a task than productively necessary — common in agriculture",
    "Seasonal unemployment: employment only during certain seasons — typical of agricultural workers",
    "Quality of population (literacy, health, skill level) determines economic productivity more than quantity",
  ],

  subtopics: [
    { id: "t1", name: "Human Capital: Definition and Formation", coreConcept: "Education, health, and training convert population into productive human capital", keyIdea: "Uneducated, unhealthy population is a liability; educated, healthy population is an asset", estimatedPeriods: 2 },
    { id: "t2", name: "Investment in Education and Health", coreConcept: "Education raises productivity and income; health reduces absenteeism and increases work capacity", keyIdea: "Primary education is the highest-return investment — every year of education raises earnings significantly", estimatedPeriods: 2 },
    { id: "t3", name: "Types of Unemployment in India", coreConcept: "Open unemployment (visible jobless); disguised unemployment (unproductive employment); seasonal unemployment", keyIdea: "Disguised unemployment is India's most distinctive form — agriculture has more workers than needed", estimatedPeriods: 2 },
    { id: "t4", name: "Quality of Population and Gender Dimension", coreConcept: "Literacy, health, and skills determine quality; gender disparities create under-utilisation of half the population", keyIdea: "India's female labour force participation is very low — structural and cultural barriers", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "eco:9:ch01:factors-of-production", to: "eco:9:ch02:human-capital-as-labour", relationship: "generalises", explanation: "Human capital is a refined view of the labour factor — not just the number of workers but their quality" },
    { from: "eco:9:ch02:investment-in-education", to: "eco:9:ch02:higher-productivity", relationship: "applies", explanation: "Education → skills → higher productivity → higher wages and output — the human capital chain" },
    { from: "eco:9:ch02:disguised-unemployment", to: "eco:9:ch01:farm-labour-surplus", relationship: "applies", explanation: "Disguised unemployment is the economic explanation for why agriculture in Palampur employs many workers with low marginal productivity" },
  ],

  prerequisites: {
    chapters: [{ subject: "Economics", classNum: 9, chapterId: "ch01", chapterName: "The Story of Village Palampur", requiredConcepts: ["eco:9:ch01:factors-of-production", "eco:9:ch01:labour-types"] }],
    concepts: ["eco:9:ch01:factors-of-production"],
  },

  essentialDefinitions: [
    { term: "Human Capital", formalDefinition: "The stock of skills, knowledge, and health embodied in the workforce, developed through investment in education, training, and healthcare", informalExplanation: "People's capacity to do productive work — more skilled and healthier workers are more productive" },
    { term: "Disguised Unemployment", formalDefinition: "A form of unemployment where more people are employed in a job than is necessary; their marginal productivity is zero — removing them would not reduce output", informalExplanation: "5 people doing a job that 2 could do equally well — the other 3 are 'disguisedly' unemployed; they appear employed but contribute nothing extra", example: "A farm needs 5 workers but 8 work there — 3 are disguisedly unemployed" },
    { term: "Seasonal Unemployment", formalDefinition: "Unemployment that occurs during certain seasons when demand for labour falls, particularly in agriculture", informalExplanation: "Farm workers busy at sowing and harvest; unemployed during the dry season between crops" },
    { term: "Open Unemployment", formalDefinition: "Unemployment where a person is willing and able to work but cannot find a job; the most visible form of unemployment", informalExplanation: "The person is jobless and actively looking for work — what we typically picture as 'unemployment'" },
    { term: "Labour Force Participation Rate (LFPR)", formalDefinition: "The percentage of the working-age population (15–64 years) that is either employed or actively seeking employment", informalExplanation: "Of all people who COULD work, what fraction is actually working or looking for work?" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "A large population always burdens the economy", correction: "Population is a burden only if it lacks skills, education, and health. A large, skilled, healthy population is a resource — China and India's growth has been partly powered by their demographic dividend.", whyItHappens: "Population is often discussed as a 'problem' in schools; the positive potential is underemphasised", revealingQuestion: "Why is India's young population called a 'demographic dividend' rather than a burden?" },
    { misconception: "Disguised unemployment means the person is secretly lazy", correction: "Disguised unemployment is a structural economic condition — too many workers share a task because there are no other employment opportunities. It is NOT about individual effort or motivation.", whyItHappens: "The word 'disguised' sounds suspicious", revealingQuestion: "In Palampur, 8 workers are employed on a farm that only needs 5. This is disguised unemployment. Is it the fault of the extra 3 workers?" },
  ],

  examinerTraps: [
    { trap: "Confusing disguised unemployment with seasonal unemployment", typicalScenario: "Student says 'Farm workers who have no work in summer are disguisedly unemployed'", avoidanceStrategy: "Seasonal unemployment = periodic joblessness due to seasonal demand. Disguised = employed but zero marginal productivity. A farm worker in the off-season is seasonally unemployed, not disguisedly unemployed.", marksAtRisk: "1 mark per confused definition" },
  ],

  typicalMistakes: [
    { mistake: "Human capital includes physical tools and machinery", correction: "Human capital is embedded IN people (skills, health, knowledge). Physical capital (machines, buildings) is separate. The distinction is that human capital cannot be separated from the person.", conceptualError: "Confusing human capital with physical capital" },
  ],

  bloomsMap: [
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["In a village, 10 farmers work a field that only needs 4 workers. Identify the type of unemployment and explain its consequences for rural development.", "How could disguised unemployment in agriculture be reduced? What would happen to those workers?"] },
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["India's female labour force participation rate is about 20%. What structural reasons explain this? Suggest two policy interventions."] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Human capital: definition and comparison to physical capital", tier: "easy", teachingNote: "Analogy: a machine (physical capital) vs a skilled worker (human capital). Both increase output; but human capital walks with the person." },
    { step: 2, concept: "Investment in education: link between education and productivity", tier: "easy", dependsOnStep: 1, teachingNote: "Data: earnings by education level; discuss why the relationship exists" },
    { step: 3, concept: "Investment in health: link between health and economic productivity", tier: "easy", dependsOnStep: 1, teachingNote: "Sick workers miss work; malnourished children cannot learn — health is productive investment" },
    { step: 4, concept: "Types of unemployment: open, disguised, seasonal", tier: "medium", dependsOnStep: 1, teachingNote: "Use concrete rural examples for each; the disguised unemployment definition is the most important and tested concept" },
    { step: 5, concept: "Disguised unemployment: why marginal productivity = 0", tier: "hard", dependsOnStep: 4, teachingNote: "If removing 3 of 8 workers doesn't reduce output, those 3 have zero marginal contribution — that is disguised unemployment" },
    { step: 6, concept: "Gender disparities: LFPR, wage gaps, barriers", tier: "medium", dependsOnStep: 1, teachingNote: "NEP-ETH: discuss structural barriers — cultural norms, safety, unpaid care work — not just individual 'choice'" },
    { step: 7, concept: "Quality of population vs quantity: development implications", tier: "hard", dependsOnStep: 2, teachingNote: "India's demographic dividend: young population as an asset IF educated and employed; as a burden IF not" },
  ],

  realLifeApplications: [
    { context: "MNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)", conceptUsed: "Unemployment and human capital formation", explanation: "MNREGA guarantees 100 days of employment to rural households. It addresses open unemployment while building infrastructure (roads, ponds) — productive employment", ageRelevance: "Students have heard of MNREGA; direct policy connection" },
    { context: "Beti Bachao Beti Padhao scheme", conceptUsed: "Gender disparity and human capital investment", explanation: "India invests in girls' education through this scheme — addressing the gender gap in human capital. Connects directly to the chapter's gender discussion.", ageRelevance: "Government scheme they've likely heard of" },
  ],

  crossChapterLinks: [
    { subject: "Economics", classNum: 9, chapterId: "ch01", chapterName: "The Story of Village Palampur", linkType: "builds-on", description: "Labour as a factor of production in Chapter 1 is now analysed as human capital" },
    { subject: "Economics", classNum: 9, chapterId: "ch03", chapterName: "Poverty as a Challenge", linkType: "prerequisite-for", description: "Low human capital (illiteracy, poor health) is a cause of poverty — the connection bridges Chapter 2 and Chapter 3" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Health, nutrition, and human development", description: "Malnutrition's effect on cognitive development connects biology to economics of human capital", strength: "strong" },
  ],

  teachingSequence: [
    { step: 1, action: "Debate: 'India's large population is a burden.' Discuss both sides before introducing the human capital concept", duration: "10 minutes", pedagogyNote: "NEP-HOT: cognitive dissonance first; then the chapter provides the resolution" },
    { step: 2, action: "Human capital formation: define and give examples from education, health, training", duration: "15 minutes", pedagogyNote: "Contrast with physical capital: a tractor rusts; a skill must be maintained but is more flexible" },
    { step: 3, action: "Types of unemployment: case studies for each type", duration: "20 minutes", pedagogyNote: "Three different people; students classify: open unemployed (engineer seeking job), disguisedly unemployed (extra farm workers), seasonally unemployed (construction worker in monsoon)" },
    { step: 4, action: "Disguised unemployment: quantitative illustration — farm with 8 workers, only 5 needed", duration: "15 minutes", pedagogyNote: "Show mathematically why removing 3 doesn't reduce output — reinforces the concept" },
    { step: 5, action: "Gender data: female LFPR, literacy rates, wage comparison — discuss causes", duration: "20 minutes", pedagogyNote: "NEP-ETH: avoid blaming — focus on structural causes; unpaid care work, safety, social norms" },
    { step: 6, action: "Demographic dividend: India's opportunity and conditions for realising it", duration: "15 minutes", pedagogyNote: "Current affairs: India overtook China in population (2023) — opportunity or burden? Depends on education and employment." },
  ],
};

export const POVERTY_AS_A_CHALLENGE: ChapterKnowledge = {
  chapterId: "ch03", chapterName: "Poverty as a Challenge", classNum: 9, subject: "Economics", board: "Both",

  learningObjectives: [
    { statement: "Define poverty and explain various ways of understanding it beyond income alone", bloomsLevel: "understand", assessable: true },
    { statement: "Explain how the poverty line is measured in India", bloomsLevel: "understand", assessable: true },
    { statement: "Analyse the causes of poverty in India at structural and individual levels", bloomsLevel: "analyse", assessable: true },
    { statement: "Identify the most poverty-vulnerable groups in India", bloomsLevel: "understand", assessable: true },
    { statement: "Evaluate the effectiveness of major anti-poverty programmes in India", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-ETH", application: "Examine poverty through the lens of human dignity — poverty is not just low income but deprivation of capabilities and choice" },
    { ruleCode: "NEP-HOT", application: "Evaluate: Is the Indian poverty line adequate? What are its limitations as a measure of poverty?" },
    { ruleCode: "NEP-IDC", application: "Collect data on poverty indicators in your district/state using NFHS or Census data; compare to national average" },
  ],

  cbseOutcomes: [
    "Student defines poverty and explains the poverty line concept as used in India",
    "Student identifies the most poverty-vulnerable social groups in India",
    "Student explains the causes of poverty (low economic growth, inequality, low literacy, rapid population growth)",
    "Student evaluates key anti-poverty programmes (MNREGA, PMAY, NFBS) and their impact",
  ],

  icseOutcomes: [
    "ICSE additionally expects: global poverty comparisons; World Bank poverty line ($1.90/day) vs India's national line",
    "ICSE tests: multidimensional poverty index (MPI) components",
  ],

  coreConcepts: [
    "Poverty is multidimensional: income, nutrition, health, education, social exclusion — not just money",
    "The poverty line in India is based on a minimum caloric requirement (food adequacy) + non-food essential expenditure",
    "Poverty rates vary sharply by state, caste, religion, and gender in India — structural discrimination causes poverty",
    "Causes of poverty are interconnected: low income → poor nutrition → poor health → low productivity → low income (cycle)",
    "Anti-poverty programmes must address multiple dimensions simultaneously to break the poverty cycle",
  ],

  subtopics: [
    { id: "t1", name: "Understanding Poverty: Definitions and Dimensions", coreConcept: "Poverty = inability to meet basic needs; includes income, social exclusion, and capability deprivation", keyIdea: "Amartya Sen's capability approach: poverty is the lack of freedom to live a dignified life", estimatedPeriods: 2 },
    { id: "t2", name: "Poverty Line in India", coreConcept: "Monthly per capita expenditure threshold below which a person is poor; based on caloric norms", keyIdea: "The poverty line is controversial — critics say it is too low to capture actual deprivation", estimatedPeriods: 2 },
    { id: "t3", name: "Poverty-Vulnerable Groups", coreConcept: "Scheduled Castes/Tribes, agricultural labourers, casual urban workers, female-headed households are most at risk", keyIdea: "Poverty is not random — it follows historical patterns of exclusion and discrimination", estimatedPeriods: 2 },
    { id: "t4", name: "Causes and Consequences of Poverty", coreConcept: "Low growth, inequality, illiteracy, high population, casteism, British colonial legacy — causes are structural", keyIdea: "The poverty trap: poverty causes the conditions that perpetuate poverty", estimatedPeriods: 2 },
    { id: "t5", name: "Anti-Poverty Programmes in India", coreConcept: "MNREGA (employment guarantee), PDS (food subsidy), PMAY (housing) — government schemes target multiple dimensions", keyIdea: "No single programme is sufficient; poverty requires comprehensive, multi-sector intervention", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "eco:9:ch02:human-capital", to: "eco:9:ch03:poverty-trap", relationship: "applies", explanation: "Low human capital (poor education, poor health) keeps people in poverty; poverty prevents investment in human capital — the poverty trap" },
    { from: "eco:9:ch01:land-inequality", to: "eco:9:ch03:rural-poverty", relationship: "applies", explanation: "Unequal land distribution in Chapter 1 directly contributes to rural poverty — landless labourers are the most poverty-vulnerable" },
    { from: "eco:9:ch03:poverty-line", to: "eco:9:ch04:food-security-beneficiaries", relationship: "applies", explanation: "BPL (Below Poverty Line) families are the primary beneficiaries of food security schemes in Chapter 4" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Economics", classNum: 9, chapterId: "ch02", chapterName: "People as Resource", requiredConcepts: ["eco:9:ch02:human-capital-definition", "eco:9:ch02:disguised-unemployment"] },
    ],
    concepts: ["eco:9:ch02:human-capital-definition"],
  },

  essentialDefinitions: [
    { term: "Poverty Line", formalDefinition: "The minimum level of consumption or income below which a person is classified as poor; in India, determined by caloric intake norms (2,400 kcal/day rural; 2,100 kcal/day urban) plus non-food essential expenditure", informalExplanation: "The minimum monthly spending needed for basic survival — if a household earns less than this per person per month, they are classified as poor" },
    { term: "Absolute Poverty", formalDefinition: "Poverty measured against an absolute minimum standard (poverty line) regardless of the general standard of living; focused on physical survival", informalExplanation: "Cannot afford the minimum food and necessities for survival" },
    { term: "Relative Poverty", formalDefinition: "Poverty measured relative to the average standard of living in a society; a person is poor if they have significantly less than the median income", informalExplanation: "Poor compared to others around you — a useful measure for developed countries; in India, absolute poverty is the primary focus" },
    { term: "Capability Deprivation (Amartya Sen)", formalDefinition: "Poverty as the deprivation of basic capabilities — the inability to live a minimally decent life with adequate nutrition, literacy, freedom from disease, and political participation", informalExplanation: "Being poor isn't just about money — it's about lacking the freedom to live a life you have reason to value" },
    { term: "Below Poverty Line (BPL)", formalDefinition: "Classification for households with per capita monthly expenditure below the official poverty line; used to target welfare programmes", informalExplanation: "The government's list of who counts as poor for programme eligibility — BPL card holders receive subsidised food" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "Poverty is the poor person's fault — they are lazy or irresponsible", correction: "Poverty has structural causes: historical discrimination, unequal asset distribution, limited access to education and healthcare, geographic disadvantage. Most poor people work very hard — in physically demanding, low-wage occupations.", whyItHappens: "Media narratives often focus on individual stories rather than structural causes", revealingQuestion: "Why are Scheduled Tribe communities disproportionately poor in India? Is this an individual or structural phenomenon?" },
    { misconception: "The poverty line accurately measures who is poor in India", correction: "The poverty line is widely criticised as too low. It measures bare minimum caloric survival, not a dignified life. Many people above the poverty line still cannot afford healthcare, education, or housing.", whyItHappens: "Students take the official government measure as the complete truth", revealingQuestion: "A family earns ₹1000/month per person — just above the poverty line. Can they afford school fees, medicines, and three meals? Does this mean they are not poor?" },
  ],

  examinerTraps: [
    { trap: "Listing causes of poverty without explaining the interconnections (poverty trap)", typicalScenario: "Student lists: low income, low education, poor health as three separate causes", avoidanceStrategy: "Show how these causes reinforce each other: poverty → poor nutrition → poor health → low productivity → low income → poverty again. The cycle is what makes poverty persistent.", marksAtRisk: "Analysis marks (3-mark questions) require explanation of interconnections" },
  ],

  typicalMistakes: [
    { mistake: "Equating the poverty line with the minimum wage", correction: "Poverty line is a consumption threshold (spending benchmark). Minimum wage is an employment regulation (minimum pay). They are related but distinct.", conceptualError: "Confusing income measure with expenditure measure" },
  ],

  bloomsMap: [
    { subtopicId: "t4", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["Explain how the poverty trap works — why is it difficult for poor households to escape poverty on their own?", "Evaluate: Can economic growth alone eliminate poverty? What else is needed?"] },
    { subtopicId: "t5", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "apply", "evaluate"], hotsStarters: ["Compare MNREGA and PDS as anti-poverty programmes. Which addresses productive capacity; which addresses immediate need?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "What is poverty? Multiple definitions — income, capabilities, social exclusion", tier: "easy", teachingNote: "Start with a story: two families with the same income — different access to education and healthcare. Is poverty just income?" },
    { step: 2, concept: "Poverty line in India: how it is calculated", tier: "medium", dependsOnStep: 1, teachingNote: "Caloric norms → minimum food expenditure → add non-food essentials → poverty line. Discuss whether this is adequate." },
    { step: 3, concept: "Poverty-vulnerable groups: SC/ST, agricultural labourers, female-headed households", tier: "easy", dependsOnStep: 2, teachingNote: "Data: which social groups have highest poverty rates and why — connect to historical discrimination and exclusion" },
    { step: 4, concept: "Causes of poverty: structural interconnections", tier: "hard", dependsOnStep: 2, teachingNote: "Diagram the poverty trap: poverty → each cause → more poverty. Students must explain each connection." },
    { step: 5, concept: "Anti-poverty programmes: MNREGA, PDS, PMAY — objectives and limitations", tier: "medium", dependsOnStep: 4, teachingNote: "Each programme addresses one dimension; evaluate: has the poverty rate declined? What remains?" },
    { step: 6, concept: "Global context: India's poverty compared to other countries", tier: "medium", dependsOnStep: 2, teachingNote: "India's poverty reduction since 1991 is impressive; but absolute numbers still large; compare with China, Bangladesh" },
  ],

  realLifeApplications: [
    { context: "PDS (Public Distribution System): ration shop in your neighbourhood", conceptUsed: "BPL classification; food security; anti-poverty programme", explanation: "The ration shop (PDS) provides subsidised food grains to BPL families. This directly applies the poverty line concept — who qualifies for the ration card?", ageRelevance: "Many students' families use the PDS; highly personal and real" },
    { context: "PM-Kisan scheme: direct income transfer to farmers", conceptUsed: "Targeted poverty alleviation; farm household income", explanation: "₹6,000/year transferred directly to small farmers' bank accounts — addresses one cause of farm poverty (insufficient income). Does it address all causes?", ageRelevance: "Current government scheme; in the news" },
  ],

  crossChapterLinks: [
    { subject: "Economics", classNum: 9, chapterId: "ch04", chapterName: "Food Security in India", linkType: "prerequisite-for", description: "BPL households are the primary beneficiaries of food security programmes — poverty classification drives Chapter 4" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Malnutrition and its health effects", description: "Poverty causes malnutrition → stunted growth, cognitive impairment — the biology of poverty's consequences", strength: "strong" },
    { subject: "Computer Science", topic: "Data analysis: poverty data from NFHS or Census", description: "Students can analyse real poverty data sets using basic data skills — connecting CS data analysis to Economics", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Case study: Two stories — poor rural farmer and urban informal worker. Identify poverty dimensions beyond income.", duration: "15 minutes", pedagogyNote: "NEP-ETH: poverty as a human experience — not just a number. Empathy before analysis." },
    { step: 2, action: "Poverty line calculation exercise: compute caloric need → food cost → poverty line", duration: "20 minutes", pedagogyNote: "Use current prices; ask: 'Is ₹X/month per person sufficient?' This creates productive controversy" },
    { step: 3, action: "Map poverty-vulnerable groups using NSSO/Census data: who is poorest and why?", duration: "15 minutes", pedagogyNote: "Bar chart of poverty rates by social group; discussion: is this inequality acceptable?" },
    { step: 4, action: "Poverty trap diagram: map all causes and consequences as interconnected arrows", duration: "20 minutes", pedagogyNote: "Students draw their own diagram; explain each arrow. The interconnections are the key learning." },
    { step: 5, action: "Anti-poverty programmes: brief each programme; evaluate strengths and gaps", duration: "25 minutes", pedagogyNote: "MNREGA: employment and asset creation. PDS: food security. PMAY: housing. Together they address income, food, and shelter." },
    { step: 6, action: "Discussion: Has poverty declined in India since 1991? What accounts for the decline?", duration: "15 minutes", pedagogyNote: "Economic growth since 1991 + targeted programmes. But inequality has also grown — can growth alone eliminate poverty?" },
  ],
};

export const FOOD_SECURITY_IN_INDIA: ChapterKnowledge = {
  chapterId: "ch04", chapterName: "Food Security in India", classNum: 9, subject: "Economics", board: "Both",

  learningObjectives: [
    { statement: "Define food security and explain its three dimensions: availability, access, and absorption", bloomsLevel: "understand", assessable: true },
    { statement: "Explain how the Green Revolution contributed to food availability but not necessarily food access", bloomsLevel: "analyse", assessable: true },
    { statement: "Describe the role of the buffer stock and Public Distribution System in ensuring food security", bloomsLevel: "understand", assessable: true },
    { statement: "Identify the most food-insecure groups in India and explain why", bloomsLevel: "understand", assessable: true },
    { statement: "Evaluate the effectiveness of India's food security system and its challenges", bloomsLevel: "evaluate", assessable: true },
  ],

  nepCompetencyMap: [
    { ruleCode: "NEP-ETH", application: "Discuss food wastage in India vs food insecurity — the ethical contradiction and policy responses" },
    { ruleCode: "NEP-HOT", application: "Evaluate: India produces enough food but some people go hungry. How can this happen? Is it a production problem or a distribution problem?" },
    { ruleCode: "NEP-IDC", application: "Visit or research a local PDS shop; check what is available, who can access it, what is the price — real data collection on food security" },
  ],

  cbseOutcomes: [
    "Student defines food security and explains its three pillars: availability, access, and utilisation (absorption)",
    "Student explains what buffer stock is and how FCI manages it",
    "Student describes the PDS: what it provides, who benefits, how it is distributed",
    "Student identifies food-insecure groups; explains vulnerability of natural disaster-hit and conflict areas",
  ],

  icseOutcomes: [
    "ICSE additionally expects: Amartya Sen's 'entitlement approach' to famine — famines occur from distribution failure, not production failure",
    "ICSE tests: comparison of food security across countries (India, Brazil, China)",
  ],

  coreConcepts: [
    "Food security = availability (enough production) + access (people can afford it) + absorption (nutrients actually reach the body)",
    "Availability is necessary but NOT sufficient — people must also be able to afford food (access)",
    "Buffer stock: FCI purchases surplus from farmers and stores it to stabilise prices and ensure supply during lean periods",
    "PDS distributes food from buffer stock to BPL families through ration shops at subsidised prices",
    "Food insecurity is concentrated among landless rural labourers, urban poor, remote tribal communities, and disaster-affected populations",
  ],

  subtopics: [
    { id: "t1", name: "Food Security: Three Dimensions", coreConcept: "Security requires availability AND access AND absorption — all three must be present simultaneously", keyIdea: "A country can produce enough food and still have widespread hunger — if the poor cannot afford it", estimatedPeriods: 2 },
    { id: "t2", name: "Food Insecurity in India: Who and Why", coreConcept: "Landless labourers, seasonal workers, urban poor, ST communities are most food insecure", keyIdea: "Income seasonality, low wages, and geographic remoteness are key drivers of food insecurity", estimatedPeriods: 2 },
    { id: "t3", name: "Buffer Stock and the PDS", coreConcept: "FCI maintains buffer stock by buying from farmers; distributes through PDS to BPL households at subsidised prices", keyIdea: "Buffer stock stabilises prices for everyone; PDS specifically targets the poor", estimatedPeriods: 2 },
    { id: "t4", name: "Food Security Programmes", coreConcept: "Mid-Day Meal: nutrition + school attendance. Antyodaya Anna Yojana: poorest of poor. NFSA 2013: legal right to food", keyIdea: "Each programme targets a specific gap; together they form a food safety net", estimatedPeriods: 2 },
  ],

  conceptGraph: [
    { from: "eco:9:ch01:green-revolution", to: "eco:9:ch04:food-availability", relationship: "applies", explanation: "The Green Revolution dramatically increased India's food availability — production is no longer the main constraint" },
    { from: "eco:9:ch03:poverty-line-bpl", to: "eco:9:ch04:pds-beneficiaries", relationship: "applies", explanation: "BPL classification from Chapter 3 determines who qualifies for PDS benefits in Chapter 4" },
    { from: "eco:9:ch04:food-access-problem", to: "eco:9:ch03:poverty-trap", relationship: "applies", explanation: "Hunger → poor health → low productivity → low income → cannot afford food → hunger: food insecurity is part of the poverty trap" },
  ],

  prerequisites: {
    chapters: [
      { subject: "Economics", classNum: 9, chapterId: "ch03", chapterName: "Poverty as a Challenge", requiredConcepts: ["eco:9:ch03:poverty-line", "eco:9:ch03:bpl-classification"] },
    ],
    concepts: ["eco:9:ch03:poverty-line", "eco:9:ch01:green-revolution"],
  },

  essentialDefinitions: [
    { term: "Food Security", formalDefinition: "A condition in which all people, at all times, have physical and economic access to sufficient, safe, and nutritious food to meet their dietary needs for an active and healthy life", informalExplanation: "Not just having food in the country, but every person being able to eat enough nutritious food every day" },
    { term: "Food Availability", formalDefinition: "The physical presence of food in a country or region through domestic production, imports, or food stocks", informalExplanation: "Is there enough food in the country? India's Green Revolution solved this — India now exports food" },
    { term: "Food Access", formalDefinition: "The ability of individuals and households to acquire adequate food, through purchase, own production, barter, or food assistance", informalExplanation: "Can people actually get the food? A poor person may starve even if the market is full of food — if they cannot afford it" },
    { term: "Buffer Stock", formalDefinition: "The stock of food grains (wheat and rice) procured by the government (through FCI) above the minimum buffer norm; used to stabilise prices and ensure supply", informalExplanation: "The government's food reserve — bought when harvest is good; released when supply is scarce or prices rise" },
    { term: "Public Distribution System (PDS)", formalDefinition: "The government system for distributing essential food items at subsidised prices to targeted BPL populations through a network of Fair Price Shops (ration shops)", informalExplanation: "The ration shop system — BPL families can buy subsidised wheat, rice, and other essentials here" },
    { term: "Food Corporation of India (FCI)", formalDefinition: "A statutory body established in 1965 to procure food grains from farmers, maintain buffer stocks, and distribute food through PDS", informalExplanation: "The government agency that buys surplus food from farmers, stores it, and supplies it to ration shops" },
    { term: "Minimum Support Price (MSP)", formalDefinition: "The price at which the government (through FCI) guarantees to purchase food grains from farmers; prevents prices from falling below a minimum", informalExplanation: "A price floor for farmers — the government promises to buy at this price, so farmers are not at the mercy of low market prices" },
  ],

  formulaInventory: [],

  lawsAndTheorems: [],

  commonMisconceptions: [
    { misconception: "India is food secure because it produces enough food", correction: "Production (availability) is only one dimension of food security. If people cannot afford food (access) or if food lacks nutrition (absorption), food insecurity remains. India produces surplus food but 200+ million people are undernourished.", whyItHappens: "Food production is the most visible dimension; access and absorption are less obvious", revealingQuestion: "India exports wheat but millions go hungry. Is India food secure? Explain using the three dimensions of food security." },
    { misconception: "PDS and buffer stock are the same thing", correction: "Buffer stock is the government's RESERVE of food grains (stored by FCI). PDS is the DISTRIBUTION SYSTEM that uses food from the buffer stock to deliver to BPL families through ration shops. Buffer stock is what is stored; PDS is how it is distributed.", whyItHappens: "Both relate to government food management; students don't distinguish storage from distribution", revealingQuestion: "What happens if the PDS functions well but buffer stock is at a minimum? What if buffer stock is full but PDS is inefficient?" },
  ],

  examinerTraps: [
    { trap: "Confusing Minimum Support Price (MSP) with Issue Price", typicalScenario: "Student says 'FCI buys grain at Issue Price and sells at MSP'", avoidanceStrategy: "MSP = price at which government BUYS from farmers (procurement price, protects farmers). Issue Price = price at which PDS SELLS to beneficiaries (subsidised, protects poor consumers). Two different price levels for two different purposes.", marksAtRisk: "1 mark for each confused price concept" },
  ],

  typicalMistakes: [
    { mistake: "Writing that the Mid-Day Meal Scheme provides food to BPL families", correction: "Mid-Day Meal provides cooked food to school children — NOT to BPL families generally. It targets school attendance and child nutrition simultaneously.", conceptualError: "Confusing different food security programmes' target beneficiaries" },
  ],

  bloomsMap: [
    { subtopicId: "t1", entryLevel: "understand", masteryLevel: "evaluate", targetLevels: ["understand", "analyse", "evaluate"], hotsStarters: ["India is the world's largest exporter of rice. Yet 200 million Indians are undernourished. Explain this paradox using the three dimensions of food security.", "Evaluate the three dimensions of food security: which is India's weakest? What policy would address it?"] },
    { subtopicId: "t3", entryLevel: "understand", masteryLevel: "analyse", targetLevels: ["understand", "apply", "analyse"], hotsStarters: ["What would happen to food prices in India if the buffer stock were eliminated? Explain your reasoning.", "Compare PDS with direct cash transfer: which is more effective at ensuring food security for the poor?"] },
  ],

  difficultyProgression: [
    { step: 1, concept: "Food security: three dimensions with examples", tier: "easy", teachingNote: "Three-column table: dimension, definition, Indian example. Students fill each cell." },
    { step: 2, concept: "Food insecurity in India: who is most vulnerable and why", tier: "easy", dependsOnStep: 1, teachingNote: "Connect to poverty-vulnerable groups from Chapter 3 — the same groups are food insecure" },
    { step: 3, concept: "How FCI works: procurement at MSP, storage, management of buffer stock", tier: "medium", dependsOnStep: 1, teachingNote: "Flow diagram: farmer → FCI → warehouse → ration shop → beneficiary" },
    { step: 4, concept: "PDS: fair price shops, ration cards, what is distributed, who benefits", tier: "medium", dependsOnStep: 3, teachingNote: "Real-life connection: students may have a ration card at home; what does it entitle them to?" },
    { step: 5, concept: "Food security programmes: Mid-Day Meal, Antyodaya Anna Yojana, NFSA", tier: "medium", dependsOnStep: 4, teachingNote: "Each programme targets a different gap; together they form a safety net" },
    { step: 6, concept: "Challenges to India's food security system: corruption in PDS, quality of food, reaching remote areas", tier: "hard", dependsOnStep: 5, teachingNote: "Critical evaluation — what works and what doesn't; evidence from states like Chhattisgarh (reformed PDS) vs others" },
  ],

  realLifeApplications: [
    { context: "National Food Security Act 2013 (NFSA): Right to Food", conceptUsed: "Food security as a legal right", explanation: "NFSA made food security a legal entitlement — 67% of India's population has a legal right to subsidised food grains. This is the culmination of decades of PDS evolution.", ageRelevance: "Students have legal rights they may not know about; this is directly about them" },
    { context: "COVID-19 and food security: Pradhan Mantri Garib Kalyan Yojana (PMGKY)", conceptUsed: "Buffer stock and PDS during crisis", explanation: "During the COVID-19 pandemic, India distributed free food grains to 800 million people using the buffer stock and PDS infrastructure. Without this system, the crisis would have caused widespread starvation.", ageRelevance: "Students lived through the COVID-19 pandemic; this is their lived experience" },
    { context: "Mid-Day Meal: school attendance and nutrition", conceptUsed: "Food access → human capital (nutrition for learning)", explanation: "Providing cooked mid-day meals in schools increased enrolment (especially girls) and improved nutritional status of children — food security directly enabling education", ageRelevance: "Students may have eaten mid-day meals; direct personal experience" },
  ],

  crossChapterLinks: [
    { subject: "Economics", classNum: 9, chapterId: "ch03", chapterName: "Poverty as a Challenge", linkType: "builds-on", description: "BPL classification from Chapter 3 is the entry criterion for PDS and food security programmes in Chapter 4" },
    { subject: "Economics", classNum: 9, chapterId: "ch01", chapterName: "The Story of Village Palampur", linkType: "builds-on", description: "Green Revolution in Chapter 1 solved the food availability problem; Chapter 4 focuses on the remaining access and absorption gaps" },
  ],

  crossSubjectLinks: [
    { subject: "Biology", topic: "Nutrition and malnutrition: effects on development", description: "Nutritional deficiencies (protein, iron, vitamin A) studied in Biology are the 'absorption' dimension of food security", strength: "strong" },
    { subject: "Chemistry", topic: "Food preservation and safety", description: "Chemical methods of food preservation (salt, vinegar, cooling) relate to ensuring food availability without spoilage", strength: "weak" },
  ],

  teachingSequence: [
    { step: 1, action: "Paradox discussion: 'India exports rice but millions go hungry.' Allow debate before introducing the three dimensions.", duration: "10 minutes", pedagogyNote: "NEP-HOT: cognitive conflict first. Students propose explanations; chapter provides the framework." },
    { step: 2, action: "Define three dimensions of food security with Indian examples for each", duration: "15 minutes", pedagogyNote: "Concretise each dimension: availability (how much India produces), access (can the poor afford it?), absorption (are they actually getting nutrients?)" },
    { step: 3, action: "FCI and buffer stock: flow diagram from farm to ration shop", duration: "20 minutes", pedagogyNote: "Draw the complete chain: farmer → MSP procurement → FCI storage → issue price → PDS fair price shop → BPL household" },
    { step: 4, action: "Visit or call a local ration shop (or invite someone who uses PDS): real-world data collection", duration: "20 minutes", pedagogyNote: "NEP-IDC: data from reality is more powerful than text. What is available? What is the price? Is quality good? Who comes?" },
    { step: 5, action: "Food security programmes: tabulate scheme, target group, benefit for each", duration: "15 minutes", pedagogyNote: "Table: NFSA, Mid-Day Meal, Antyodaya. Students summarise — builds exam readiness" },
    { step: 6, action: "Critical evaluation: what are the failures of India's PDS? What reforms have worked?", duration: "15 minutes", pedagogyNote: "NEP-ETH: leakages, ghost beneficiaries, poor quality. But also successes: Chhattisgarh PDS reform. Balance the critique." },
    { step: 7, action: "COVID-19 case study: how buffer stock and PDS protected 800 million people", duration: "10 minutes", pedagogyNote: "Students lived through this — connect abstract systems to lived experience during the pandemic" },
  ],
};

export const ECONOMICS_CLASS9: ChapterKnowledge[] = [
  VILLAGE_PALAMPUR,
  PEOPLE_AS_RESOURCE,
  POVERTY_AS_A_CHALLENGE,
  FOOD_SECURITY_IN_INDIA,
];
