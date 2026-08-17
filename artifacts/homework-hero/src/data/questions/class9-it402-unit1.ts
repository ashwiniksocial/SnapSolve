// @frozen — Information Technology 402 Unit 1: Introduction to IT-ITeS Industry — 50 questions, validated 2026-08-17 (2 REVIEWER_UNCERTAINTY items resolved: t1-q05 answer clarity improved; t3-q02 MCQ stem and answer strengthened)
import type { Question, ChapterMeta } from "./types";

export const CHAPTER_META: ChapterMeta = {
  id: "it402-unit1",
  name: "Introduction to IT-ITeS Industry",
  classNum: 9,
  subject: "Information Technology",
  canonicalChapterId: "402-IT-IX-unit1",
  curriculumStatus: "ACTIVE",
  topics: [
    { id: "t1", name: "Introduction to IT and ITeS",          questionCount: 12 },
    { id: "t2", name: "BPO Services and BPM Industry",        questionCount: 12 },
    { id: "t3", name: "Structure of the IT-BPM Industry",     questionCount: 8  },
    { id: "t4", name: "Applications of IT",                   questionCount: 12 },
    { id: "t5", name: "Work Area, Health and Safety",         questionCount: 6  },
  ],
};

export const QUESTIONS: Question[] = [

  // ── Topic 1: Introduction to IT and ITeS ────────────────────────────────────

  {
    id: "c9-it-unit1-t1-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "MCQ",
    question: "Information Technology (IT) means: (a) Creating and managing information only  (b) Creating, managing, storing and exchanging information  (c) Storing and deleting information  (d) Exchanging hardware between computers",
    hint: "IT is about handling information through technology — think about what you do with information throughout its life.",
    answer: "(b) Creating, managing, storing and exchanging information",
    steps: [
      { stepNumber: 1, title: "Recall the textbook definition", explanation: "The NCERT IT 402 textbook defines IT as: 'Information Technology (IT) means creating, managing, storing and exchanging information.'" },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a) is incomplete — IT is not limited to creating and managing. (c) includes deletion which is not part of the definition. (d) describes hardware transfer which is unrelated.", result: "Answer: (b)" },
    ],
    keyConcepts: ["IT definition", "Information management", "Data exchange"],
  },

  {
    id: "c9-it-unit1-t1-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which of the following correctly describes 'data'? (a) Processed results drawn from raw material  (b) Conclusions based on analysis  (c) Raw facts or material that are processed to get information  (d) Output of a computer program",
    hint: "Data comes BEFORE information — think about which one is raw and which one is the result.",
    answer: "(c) Raw facts or material that are processed to get information",
    steps: [
      { stepNumber: 1, title: "Distinguish data from information", explanation: "Data refers to the facts or raw material. It is unprocessed. For example, the number of boys and girls in a class is data." },
      { stepNumber: 2, title: "Identify information", explanation: "Information is the result of processing data — it is the conclusion or meaning drawn from data. Options (a) and (b) describe information, not data.", result: "Answer: (c)" },
    ],
    keyConcepts: ["Data", "Information", "Data processing"],
  },

  {
    id: "c9-it-unit1-t1-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What does 'ITeS' stand for? How is it different from IT?",
    hint: "Think about what the extra word 'enabled' and 'Services' add to 'IT'.",
    answer: "ITeS stands for Information Technology enabled Services. IT refers to the technology itself (hardware, software, systems used to create, manage, store, and exchange information), whereas ITeS refers to the services that are delivered with the help of IT — such as data entry, customer relationship management, medical transcription, and software development. In short, IT is the tool; ITeS is the service delivered using that tool.",
    steps: [
      { stepNumber: 1, title: "Expand the abbreviation", explanation: "ITeS = Information Technology enabled Services. The 'e' is lowercase in ITeS by convention." },
      { stepNumber: 2, title: "Distinguish IT from ITeS", explanation: "IT includes all types of technology used to deal with information — computer hardware and software. ITeS takes IT further: it means delivering services to end users (businesses or individuals) using IT as the delivery mechanism. Example ITeS services: Customer Relationship Management, Data Entry, Medical Transcription, ERP.", result: "ITeS = IT-enabled Services; IT = the technology; ITeS = the services built on top of IT" },
    ],
    keyConcepts: ["ITeS full form", "IT vs ITeS distinction"],
  },

  {
    id: "c9-it-unit1-t1-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "List any FOUR services provided under ITeS.",
    hint: "The textbook lists several services: medical, customer, data, software, storage, help desk, ERP, and telecom.",
    answer: "Four ITeS services (any four from the following): (1) Medical Transcription, (2) Customer Relationship Management (CRM), (3) Data Entry and Data Processing, (4) Software Development, (5) Data Warehousing, (6) IT Help Desk Services, (7) Enterprise Resource Planning (ERP), (8) Telecommunication Services.",
    steps: [
      { stepNumber: 1, title: "Recall ITeS service categories", explanation: "The NCERT textbook lists specific ITeS services that are integrated in a single delivery mechanism to end users." },
      { stepNumber: 2, title: "List four", explanation: "Medical Transcription, CRM, Data Entry and Data Processing, Software Development are four commonly cited examples.", result: "Any four of the eight services listed in the textbook are acceptable." },
    ],
    keyConcepts: ["ITeS services", "Medical transcription", "CRM", "Data warehousing"],
  },

  {
    id: "c9-it-unit1-t1-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "State any FOUR benefits of Information Technology for a business.",
    hint: "Think about how IT helps a business reach customers, cut costs, and improve service.",
    answer: "Any FOUR of the following benefits (all ten are listed in the NCERT IT 402 textbook; choose any four for full marks): (1) Helps in reaching more potential customers; (2) Develops business relationships with potential customers; (3) Streamlines operations; (4) Reduces costs; (5) Improves efficiency; (6) Maximises profit; (7) Minimises waste; (8) Provides better service to customers; (9) Supports better relationships with key partners; (10) Allows customers to better guide the business. A strong four-benefit answer: IT reduces costs, improves efficiency, helps reach more potential customers, and provides better service to customers.",
    steps: [
      { stepNumber: 1, title: "Recall benefits listed in textbook", explanation: "The NCERT IT 402 textbook explicitly lists ten benefits of IT for businesses. Any four of these are accepted for full marks." },
      { stepNumber: 2, title: "Write four clearly", explanation: "Example answer: (1) Reduces costs; (2) Improves efficiency; (3) Helps in reaching more potential customers; (4) Provides better service to customers.", result: "Any four of the ten textbook-listed benefits, clearly stated. The student does not need to list all ten." },
    ],
    keyConcepts: ["IT benefits", "Business efficiency", "Cost reduction"],
  },

  {
    id: "c9-it-unit1-t1-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "MCQ",
    question: "What does ICT stand for? (a) International Computer Technology  (b) Information and Communication Technology  (c) Integrated Circuit Technology  (d) Internet Control Technology",
    hint: "ICT is broader than IT alone — it combines information technology with communication.",
    answer: "(b) Information and Communication Technology",
    steps: [
      { stepNumber: 1, title: "Expand ICT", explanation: "ICT = Information and Communication Technology. It has become one of the basic requirements of modern society as stated in the NCERT IT 402 textbook." },
      { stepNumber: 2, title: "Eliminate distractors", explanation: "The other options do not match the standard CBSE/NCERT definition of ICT.", result: "Answer: (b)" },
    ],
    keyConcepts: ["ICT full form", "Communication technology"],
  },

  {
    id: "c9-it-unit1-t1-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Explain the relationship between data and information with an example.",
    hint: "Data is the input; information is the meaningful output derived from it.",
    answer: "Data and information are closely related but distinct: Data refers to raw facts or figures that have not yet been processed. Information is the result of processing data — it is meaningful and useful for decision-making. Example: The marks obtained by each student in a class (e.g., Riya: 85, Aman: 72, Priya: 91) are DATA. When these marks are processed to calculate the class average (e.g., Average = 82.7) or to rank students, the result is INFORMATION. Decisions (e.g., awarding prizes) are taken on the basis of information.",
    steps: [
      { stepNumber: 1, title: "Define data", explanation: "Data = raw facts or material. Example: individual marks of students." },
      { stepNumber: 2, title: "Define information", explanation: "Information = result of processing data. Example: class average calculated from individual marks." },
      { stepNumber: 3, title: "Link to decisions", explanation: "The textbook states: 'The decisions are taken on the basis of data and information.'", result: "Data is raw; information is processed and meaningful." },
    ],
    keyConcepts: ["Data", "Information", "Processing", "Decision-making"],
  },

  {
    id: "c9-it-unit1-t1-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "MCQ",
    question: "Information Technology is described as which of the following in the NCERT IT 402 textbook? (a) One of the world's slowest growing economic activities  (b) One of the world's fastest growing economic activities  (c) A government programme for digital payments  (d) A branch of natural sciences",
    hint: "Think about how quickly the IT sector is growing globally.",
    answer: "(b) One of the world's fastest growing economic activities",
    steps: [
      { stepNumber: 1, title: "Recall textbook phrasing", explanation: "The NCERT IT 402 textbook states: 'Information Technology (IT) is one of the world's fastest growing economic activities, which envisages easier flow of information at various levels in the desired pattern.'" },
      { stepNumber: 2, title: "Confirm answer", explanation: "Option (b) matches the exact textbook description.", result: "Answer: (b)" },
    ],
    keyConcepts: ["IT as economic activity", "Growth of IT sector"],
  },

  {
    id: "c9-it-unit1-t1-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Medium", questionType: "LongAnswer",
    question: "Define Information Technology (IT). Explain its importance in today's digital society.",
    hint: "Include the definition, what IT encompasses, and how it impacts everyday life and business.",
    answer: "Information Technology (IT) means creating, managing, storing and exchanging information. It includes all types of technology used to deal with information — such as computer hardware and software technology used for creating, storing, and transferring information. Importance in today's digital society: (1) IT has become one of the world's fastest growing economic activities. (2) ICT (Information and Communication Technology) has become one of the basic requirements of modern society. (3) In today's digital era, mobile devices perform the tasks of our daily life — it is difficult to think of any event without digital devices. (4) IT is a tightly integrated part of business — computers and information systems are an essential part of every business today, just like accounting or legal functions. (5) IT benefits businesses by: reaching more potential customers, reducing costs, improving efficiency, maximising profit, providing better customer service, and allowing customers to guide the business. (6) The ITeS sector has not only changed how the world views India but has also made significant contributions to the Indian economy.",
    steps: [
      { stepNumber: 1, title: "Give the definition", explanation: "IT = creating, managing, storing and exchanging information; includes hardware and software technology." },
      { stepNumber: 2, title: "Discuss everyday importance", explanation: "Everyday life now depends on digital devices; ICT is a basic necessity." },
      { stepNumber: 3, title: "Discuss business importance", explanation: "IT is an integral part of business — helps reduce costs, improve efficiency, reach customers, maximise profit." },
      { stepNumber: 4, title: "Discuss economic importance", explanation: "IT is the world's fastest growing economic activity; ITeS sector contributes significantly to India's GDP.", result: "Well-rounded answer covering definition + social + business + economic importance." },
    ],
    keyConcepts: ["IT definition", "Digital society", "ICT", "IT in business", "ITeS sector"],
  },

  {
    id: "c9-it-unit1-t1-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Name any THREE IT enabled services that can be provided to end users through ITeS.",
    hint: "Look at the services that are delivered using the IT network — medical, customer support, data handling, etc.",
    answer: "Any three of: (1) Medical Transcription, (2) Customer Relationship Management (CRM), (3) Data Entry and Data Processing, (4) Software Development, (5) Data Warehousing, (6) IT Help Desk Services, (7) Enterprise Resource Planning (ERP), (8) Telecommunication Services.",
    steps: [
      { stepNumber: 1, title: "Recall ITeS services from textbook", explanation: "The textbook lists services integrated in a single delivery mechanism: Medical Transcription, CRM, Data Entry, Software development, Data Warehousing, IT Help Desk, ERP, and Telecommunication Services." },
      { stepNumber: 2, title: "Select any three", explanation: "Any three from the list above earn full marks.", result: "Three correctly named ITeS services." },
    ],
    keyConcepts: ["ITeS services", "End users", "IT delivery"],
  },

  {
    id: "c9-it-unit1-t1-q11", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the purpose of the IT 402 course (Information Technology) for Class IX students? What job role does it prepare them for?",
    hint: "Think about the CBSE skill education framework — IT 402 is linked to the IT-ITeS industry sector.",
    answer: "The IT 402 course (Information Technology, Code 402) is a CBSE skill subject designed to develop vocational competencies in students of Class IX. It prepares students for the job role of Domestic Data Entry Operator (Qualification Pack: SSC/Q2212) in the Information Technology and Information Technology enabled Services (IT-ITeS) sector. The course trains students in data entry, digital documentation, electronic spreadsheets, digital presentations, and IT industry awareness, equipping them with practical skills to enter the IT-ITeS workforce.",
    steps: [
      { stepNumber: 1, title: "Identify course purpose", explanation: "IT 402 is a CBSE skill subject that develops employability and vocational competencies." },
      { stepNumber: 2, title: "State the job role", explanation: "Job role: Domestic Data Entry Operator. Sector: IT-ITeS. Qualification Pack: SSC/Q2212." },
      { stepNumber: 3, title: "Mention key skills", explanation: "Data entry, keyboarding, digital documentation, spreadsheets, presentations.", result: "Purpose = vocational training; Job role = Domestic Data Entry Operator in IT-ITeS." },
    ],
    keyConcepts: ["IT 402 purpose", "Job role", "IT-ITeS sector", "Domestic Data Entry Operator"],
  },

  {
    id: "c9-it-unit1-t1-q12", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t1", topicName: "Introduction to IT and ITeS",
    difficulty: "Hard", questionType: "ShortAnswer",
    question: "A student says: 'IT and ITeS are the same thing.' Do you agree? Justify your answer with examples.",
    hint: "One is the technology itself; the other is what you deliver using the technology.",
    answer: "No, IT and ITeS are NOT the same thing, though they are closely related. IT (Information Technology) refers to the technology itself — the hardware, software, and systems used to create, manage, store, and exchange information. ITeS (Information Technology enabled Services) refers to services that are delivered using IT as the platform or delivery mechanism. Example: A computer system, database software, and a high-speed internet connection are examples of IT. Using that IT infrastructure to provide Customer Relationship Management for a bank, or to process medical records for a hospital (Medical Transcription), are examples of ITeS. In summary: IT is the tool; ITeS is the service built on top of that tool. The ITeS sector has changed how the world views India and has contributed significantly to the Indian economy, precisely because India has leveraged its IT infrastructure to deliver services globally.",
    steps: [
      { stepNumber: 1, title: "State disagreement clearly", explanation: "IT and ITeS are related but not the same." },
      { stepNumber: 2, title: "Define IT with example", explanation: "IT = hardware, software, systems. Example: computer hardware and network infrastructure." },
      { stepNumber: 3, title: "Define ITeS with example", explanation: "ITeS = services enabled by IT. Example: Medical Transcription, CRM, Data Entry." },
      { stepNumber: 4, title: "Justify with analogy", explanation: "IT is the tool; ITeS is what you accomplish using the tool — they are related but conceptually distinct.", result: "Disagree. IT is the technology; ITeS is the service built upon it." },
    ],
    keyConcepts: ["IT vs ITeS distinction", "Critical thinking", "Application"],
  },

  // ── Topic 2: BPO Services and BPM Industry ───────────────────────────────────

  {
    id: "c9-it-unit1-t2-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "BPO stands for: (a) Business Product Outsourcing  (b) Business Process Outsourcing  (c) Basic Process Operations  (d) Business Process Operations",
    hint: "The key word is 'Process' — and the function being given to an external provider.",
    answer: "(b) Business Process Outsourcing",
    steps: [
      { stepNumber: 1, title: "Recall BPO full form", explanation: "BPO = Business Process Outsourcing. It means performing business operations through an outside service provider." },
      { stepNumber: 2, title: "Eliminate options", explanation: "(a) 'Product' is wrong — BPO involves processes, not products. (c) 'Basic' is wrong. (d) 'Operations' instead of 'Outsourcing' is wrong.", result: "Answer: (b)" },
    ],
    keyConcepts: ["BPO full form", "Outsourcing"],
  },

  {
    id: "c9-it-unit1-t2-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What is Business Process Outsourcing (BPO)? How is IT involved in BPO?",
    hint: "BPO involves hiring an external company to handle certain business tasks — IT is essential to this delivery.",
    answer: "Business Process Outsourcing (BPO) means performing business operations through an outside (external) service provider rather than handling them in-house. IT plays a very useful role in BPO by: (1) Enabling data to be processed and shared digitally across locations; (2) Supporting communication between the outsourcing company and the service provider; (3) Allowing delivery of services like customer support, data entry, and accounting through the internet and digital tools. The BPO industry is highly organised, and India has developed expertise in reducing costs while maintaining quality of service.",
    steps: [
      { stepNumber: 1, title: "Define BPO", explanation: "BPO = performing business operations through an outside service provider." },
      { stepNumber: 2, title: "Explain IT's role", explanation: "IT enables BPO: data sharing, digital communication, internet-based delivery." },
      { stepNumber: 3, title: "India's BPO advantage", explanation: "India has expertise in reducing costs with firm quality control.", result: "BPO uses external providers; IT is the backbone that makes delivery possible." },
    ],
    keyConcepts: ["BPO definition", "IT in BPO", "Outsourcing"],
  },

  {
    id: "c9-it-unit1-t2-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which of the following is NOT listed as a BPO service in the NCERT IT 402 textbook? (a) Financial and Accounting Services  (b) Taxation and Insurance Services  (c) Agricultural Crop Management  (d) Legal Services and Content Writing",
    hint: "BPO services are those that can be performed remotely using computers and the internet.",
    answer: "(c) Agricultural Crop Management",
    steps: [
      { stepNumber: 1, title: "Recall BPO services from textbook", explanation: "The NCERT textbook lists: Financial and Accounting, Taxation and Insurance, E-Publishing and Web Promotion, Legal Services and Content Writing, Multimedia and Design, Document Management, Software Testing, Health Care Services." },
      { stepNumber: 2, title: "Identify the non-listed option", explanation: "Agricultural Crop Management is NOT an IT-based BPO service and is not listed in the textbook.", result: "Answer: (c)" },
    ],
    keyConcepts: ["BPO services list", "IT-based services"],
  },

  {
    id: "c9-it-unit1-t2-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "List ALL eight categories of BPO services mentioned in the NCERT IT 402 textbook.",
    hint: "The textbook gives a lettered list (a) through (h). Start from Financial and end with Health Care.",
    answer: "The eight BPO service categories listed in the NCERT IT 402 textbook are: (a) Financial and Accounting Services; (b) Taxation and Insurance Services; (c) E-Publishing and Web Promotion; (d) Legal Services and Content Writing; (e) Multimedia and Design Services; (f) Document Management Services; (g) Software Testing Services; (h) Health Care Services.",
    steps: [
      { stepNumber: 1, title: "Recall the textbook list", explanation: "The NCERT textbook provides a lettered list of eight BPO service types under the heading 'BPO services'." },
      { stepNumber: 2, title: "Write all eight in order", explanation: "Financial & Accounting → Taxation & Insurance → E-Publishing → Legal → Multimedia → Document Management → Software Testing → Health Care.", result: "All eight categories correctly listed." },
    ],
    keyConcepts: ["BPO service categories", "Eight BPO types"],
  },

  {
    id: "c9-it-unit1-t2-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What does BPM stand for? How has the IT-BPM industry contributed to India's economy?",
    hint: "BPM is the industry that manages entire business processes — it has created jobs and boosted India's GDP.",
    answer: "BPM stands for Business Process Management. The IT-BPM industry has contributed to India's economy in multiple important ways: (1) It has fueled India's growth and contributed significantly to the country's Gross Domestic Product (GDP) and exports. (2) It has provided economic and social benefits, including creating employment and raising income levels. (3) It has promoted exports, placing India on the world map as a technologically advanced and knowledge-based economy. (4) The sector attracts significant investment by venture capitalists. (5) It has enabled entrepreneurial ventures. The IT-BPM industry has almost doubled in terms of revenue and contribution to India's GDP over the decade 2008–18.",
    steps: [
      { stepNumber: 1, title: "Expand BPM", explanation: "BPM = Business Process Management." },
      { stepNumber: 2, title: "List economic contributions", explanation: "GDP and export growth; employment creation; income raise; venture capital attraction; entrepreneurship enablement." },
      { stepNumber: 3, title: "Cite the doubling", explanation: "IT-BPM industry revenue and GDP contribution doubled over 2008–18.", result: "BPM = Business Process Management; major contributor to GDP, employment, and exports." },
    ],
    keyConcepts: ["BPM full form", "GDP contribution", "IT-BPM industry", "Employment creation"],
  },

  {
    id: "c9-it-unit1-t2-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "MCQ",
    question: "Why is the BPO Service Industry doing exceptionally well in India? Choose the INCORRECT statement: (a) BPO service providers in India invest in hi-tech hardware and software  (b) Government of India provides necessary infrastructure and logistical support  (c) India does not allow foreign companies to set up BPO operations  (d) India is capable of delivering numerous BPO service types in exceptional quality",
    hint: "The textbook gives three specific reasons for BPO success. Think about which option goes against these reasons.",
    answer: "(c) India does not allow foreign companies to set up BPO operations",
    steps: [
      { stepNumber: 1, title: "Recall the three reasons from textbook", explanation: "The NCERT textbook lists three reasons BPO is successful in India: (a) Hi-tech investment and quality checks; (b) Government infrastructure and logistical support; (c) Capability to deliver numerous service types in exceptional quality." },
      { stepNumber: 2, title: "Identify the incorrect statement", explanation: "India actively welcomes foreign BPO companies. It does NOT restrict them. In fact, MNCs operate in India precisely because the government is encouraging the BPO industry.", result: "Answer: (c) — this is false; India encourages, not restricts, foreign BPO operations." },
    ],
    keyConcepts: ["BPO success factors", "Government support", "Critical reading"],
  },

  {
    id: "c9-it-unit1-t2-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "State THREE reasons why the BPO industry is successful in India.",
    hint: "The textbook lists exactly three reasons — they relate to technology investment, government support, and service capability.",
    answer: "The three reasons why BPO is successful in India (as stated in NCERT IT 402 textbook): (1) BPO service providers in India invest in hi-tech hardware and software to deliver the best services, and follow quality checks to ensure error-free and exceptional service. (2) The Government of India is encouraging the BPO industry by providing necessary infrastructure and logistical support. (3) India's BPO industry is highly developed and capable of delivering numerous types of BPO services in exceptional quality.",
    steps: [
      { stepNumber: 1, title: "Recall textbook section", explanation: "The textbook gives three lettered points under 'Why BPO Service Industry is doing exceptionally well in India.'" },
      { stepNumber: 2, title: "Write all three", explanation: "1. Hi-tech investment + quality checks. 2. Government support. 3. High development and capability.", result: "Three reasons accurately stated from the textbook." },
    ],
    keyConcepts: ["BPO success factors", "Government support", "Quality service"],
  },

  {
    id: "c9-it-unit1-t2-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Hard", questionType: "LongAnswer",
    question: "Write a detailed note on the IT-BPM (Business Process Management) industry in India, covering its growth, economic contributions, and why India is a preferred destination.",
    hint: "Cover: what IT-BPM is, how it has grown (the decade figure), what economic and social benefits it has brought, and the reasons for India's BPO success.",
    answer: "The IT-BPM (Information Technology — Business Process Management) industry in India: The IT-BPM industry has been fuelling India's growth for the past several decades. Growth: The IT-BPM industry has almost doubled in terms of revenue and contribution to India's GDP over the decade 2008–18. Economic contributions: (1) GDP and exports: The industry contributes significantly to India's Gross Domestic Product and export earnings. (2) Employment: It has created a wide range of employment opportunities and raised income levels across the country. (3) Entrepreneurship: The sector has enabled entrepreneurial ventures and attracted venture capital investment. (4) Global image: It has placed India on the world map as a technologically advanced and knowledge-based economy. Why India is preferred: (a) Hi-tech investment: BPO providers invest in advanced hardware and software with rigorous quality checks. (b) Government support: The Government of India supports the BPO industry through infrastructure, logistics, and Digital India initiatives. (c) Service capability: India's BPO industry is highly developed, capable of delivering diverse services in exceptional quality. India has the expertise to reduce costs while maintaining quality control, making it a top global destination for outsourced business processes.",
    steps: [
      { stepNumber: 1, title: "Define IT-BPM", explanation: "IT-BPM = Information Technology — Business Process Management; the industry that manages entire business processes using IT." },
      { stepNumber: 2, title: "Describe growth", explanation: "Revenue and GDP contribution doubled over 2008–18." },
      { stepNumber: 3, title: "List economic contributions", explanation: "GDP, exports, employment, income, entrepreneurship, venture capital, global image." },
      { stepNumber: 4, title: "Explain why India is preferred", explanation: "Three reasons: hi-tech investment + quality, government support, high capability.", result: "Comprehensive answer covering definition, growth, economic impact, and India's competitive advantage." },
    ],
    keyConcepts: ["IT-BPM industry", "GDP contribution", "Employment", "India as BPO hub"],
  },

  {
    id: "c9-it-unit1-t2-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "A hospital in the USA wants to outsource the work of converting doctors' spoken notes into written medical records. Which BPO service category covers this, and under which broader service type does it fall?",
    hint: "Spoken → written records for a medical facility... Think about the specific BPO category for health-related document work.",
    answer: "Converting doctors' spoken notes into written medical records is called Medical Transcription. This falls under the Health Care Services category of BPO. Medical Transcription is also classified as an ITeS (Information Technology enabled Service), because it is delivered using IT infrastructure (computers, audio processing software, the internet) by an external service provider to the hospital.",
    steps: [
      { stepNumber: 1, title: "Identify the process", explanation: "Converting spoken medical notes to text is Medical Transcription." },
      { stepNumber: 2, title: "Map to BPO category", explanation: "Medical Transcription falls under Health Care Services, one of the eight BPO service categories." },
      { stepNumber: 3, title: "Connect to ITeS", explanation: "Medical Transcription is also an ITeS — delivered using IT to end users (hospitals).", result: "Medical Transcription → Health Care Services BPO → also an ITeS." },
    ],
    keyConcepts: ["Medical transcription", "Health Care BPO", "ITeS application"],
  },

  {
    id: "c9-it-unit1-t2-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "The IT-BPM industry in India has almost doubled in revenue and GDP contribution over which period? (a) 1998–2008  (b) 2000–2010  (c) 2008–2018  (d) 2010–2020",
    hint: "This figure is directly stated in the NCERT textbook. Think about the decade mentioned.",
    answer: "(c) 2008–2018",
    steps: [
      { stepNumber: 1, title: "Recall textbook statement", explanation: "The NCERT IT 402 textbook states: 'The IT-BPM industry has almost doubled in terms of revenue and contribution to India's GDP over the last decade (2008–18).'" },
      { stepNumber: 2, title: "Select correct option", explanation: "Option (c) matches the stated decade exactly.", result: "Answer: (c) 2008–2018" },
    ],
    keyConcepts: ["IT-BPM growth", "GDP doubling", "Decade 2008-18"],
  },

  {
    id: "c9-it-unit1-t2-q11", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Distinguish between BPO and BPM.",
    hint: "BPO is about giving work to an external company; BPM is about the broader industry that manages entire business processes.",
    answer: "BPO (Business Process Outsourcing) refers to the practice of hiring an external service provider to perform specific business processes (e.g., payroll, data entry, customer support). The key characteristic is that work is given OUTSIDE the company. BPM (Business Process Management) is the broader industry and discipline that covers the design, execution, monitoring, and optimisation of business processes, often using IT. The IT-BPM industry in India is the combined industry that includes both BPO and all IT-related business management services. BPM is a wider term — BPO is one type of activity within the BPM ecosystem.",
    steps: [
      { stepNumber: 1, title: "Define BPO", explanation: "BPO = outsourcing specific business processes to an external provider." },
      { stepNumber: 2, title: "Define BPM", explanation: "BPM = the broader industry managing end-to-end business processes using IT." },
      { stepNumber: 3, title: "Relationship", explanation: "BPO is a subset/component of the IT-BPM industry. IT-BPM is the industry umbrella term.", result: "BPO = outsourcing work externally; BPM = broader industry managing business processes with IT." },
    ],
    keyConcepts: ["BPO vs BPM", "Outsourcing", "IT-BPM industry"],
  },

  {
    id: "c9-it-unit1-t2-q12", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t2", topicName: "BPO Services and BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "A publishing company wants to get its books converted into digital e-books and also wants help with promoting its website. Which BPO service category should it use, and what would that service typically involve?",
    hint: "Look at BPO category (c) — it specifically involves digital publishing and web-based promotion.",
    answer: "The company should use the E-Publishing and Web Promotion category of BPO services. This category of BPO would typically involve: (1) Converting physical books, documents, or other content into digital (electronic) formats; (2) Formatting and publishing e-books; (3) Web content creation and management; (4) Search engine optimisation (SEO) and digital marketing to promote the company's website; (5) Online advertising campaigns. By outsourcing these activities to a BPO service provider in India, the company can reduce costs while leveraging IT-based expertise.",
    steps: [
      { stepNumber: 1, title: "Identify the category", explanation: "E-Publishing and Web Promotion is BPO category (c) in the NCERT textbook." },
      { stepNumber: 2, title: "Describe what the service involves", explanation: "Converting to digital formats, e-book creation, web promotion, digital marketing." },
      { stepNumber: 3, title: "Connect to outsourcing", explanation: "The company outsources this to an external BPO provider, reducing costs.", result: "E-Publishing and Web Promotion BPO covers digital publishing and website promotion." },
    ],
    keyConcepts: ["E-Publishing BPO", "Web promotion", "Outsourcing application"],
  },

  // ── Topic 3: Structure of the IT-BPM Industry ────────────────────────────────

  {
    id: "c9-it-unit1-t3-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "MNC in the context of the IT-BPM industry stands for: (a) Modern Network Company  (b) Multinational Corporation  (c) Multi-National Computing  (d) Managed Network Centre",
    hint: "MNC is a company whose head office is in one country but it operates in many countries worldwide.",
    answer: "(b) Multinational Corporation",
    steps: [
      { stepNumber: 1, title: "Recall MNC definition", explanation: "MNC = Multinational Corporation (also referred to as Multinational Company in the textbook). MNCs have their headquarters outside India but operate in multiple locations worldwide including India." },
      { stepNumber: 2, title: "Confirm correct expansion", explanation: "Option (b) is the correct full form.", result: "Answer: (b)" },
    ],
    keyConcepts: ["MNC full form", "Multinational Corporation"],
  },

  {
    id: "c9-it-unit1-t3-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "On what parameters are organisations within the IT-BPM industry categorised? Choose the option that is NOT listed as a categorisation parameter in the NCERT IT 402 textbook. (a) Sector the organisation is serving  (b) Type and range of offerings  (c) Geographic spread of operations  (d) Number of computers owned",
    hint: "The NCERT textbook lists exactly four specific parameters. Check which of these four options does NOT appear in that list.",
    answer: "(d) Number of computers owned. The NCERT IT 402 textbook explicitly lists exactly four categorisation parameters for IT-BPM organisations: (1) Sector the organisation is serving; (2) Type as well as range of offerings the organisation provides; (3) Geographic spread of operations; (4) Revenues and size of operations. Options (a), (b), and (c) each match one of the four listed parameters exactly. Option (d) — 'Number of computers owned' — does not appear anywhere in the textbook's list of categorisation parameters.",
    steps: [
      { stepNumber: 1, title: "Recall the four textbook parameters", explanation: "The NCERT IT 402 textbook (Structure of IT-BPM Industry section) lists exactly four parameters: (1) Sector served; (2) Type and range of offerings; (3) Geographic spread; (4) Revenues and size." },
      { stepNumber: 2, title: "Check each option against the list", explanation: "(a) Sector = parameter 1 ✓. (b) Type/range of offerings = parameter 2 ✓. (c) Geographic spread = parameter 3 ✓. (d) Number of computers owned = NOT in the textbook list." },
      { stepNumber: 3, title: "Select the non-listed option", explanation: "'Number of computers owned' is definitively NOT one of the four parameters listed in the textbook.", result: "Answer: (d) Number of computers owned." },
    ],
    keyConcepts: ["IT-BPM categorisation parameters", "Industry structure"],
  },

  {
    id: "c9-it-unit1-t3-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is an Indian Service Provider (ISP) in the context of the IT-BPM industry? How is it different from an MNC?",
    hint: "ISPs started in India and are mainly headquartered here — the opposite of MNCs whose headquarters are abroad.",
    answer: "An Indian Service Provider (ISP) in the IT-BPM industry context refers to an IT or BPO company that started its operations in India. Key features: (1) Most ISPs have their headquarters in India; (2) They have offices in many international locations; (3) While most serve both global and domestic clients, some focus exclusively on Indian clients. Difference from MNCs: MNCs have their headquarters OUTSIDE India but operate globally including in India. ISPs are Indian-headquartered companies that expanded internationally. Example contrast: A company headquartered in the USA with Indian offices = MNC. A company started in India (like Infosys, Wipro, TCS) with global offices = ISP.",
    steps: [
      { stepNumber: 1, title: "Define ISP (IT-BPM context)", explanation: "ISP = Indian-origin company; headquarters in India; offices in many international locations." },
      { stepNumber: 2, title: "Compare with MNC", explanation: "MNC = headquarters outside India, operating globally. ISP = headquarters in India, operating globally." },
      { stepNumber: 3, title: "Note client base", explanation: "ISPs serve both global and domestic clients; some focus only on domestic.", result: "ISP = India-headquartered; MNC = non-India-headquartered. Both operate globally." },
    ],
    keyConcepts: ["ISP definition", "MNC vs ISP", "Indian IT companies"],
  },

  {
    id: "c9-it-unit1-t3-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is a Global In-house Center (GIC) in the IT-BPM industry? Give ONE example of how a GIC operates.",
    hint: "A GIC is a company's own internal IT centre set up in another country — it is NOT an external service provider.",
    answer: "A Global In-house Center (GIC) is a captive unit or internal centre set up by a large company (usually an MNC) in another country (often India) to handle IT and business process work for the parent company. Unlike BPO (where work is given to an EXTERNAL provider), a GIC is the company's own internal operation — it works exclusively for its parent organisation. Example: A large US bank sets up its own IT and data processing center in Bengaluru, India. This center employs Indian professionals to develop software and process banking data for the parent bank — working only for that bank, not for external clients. Key difference from BPO: A GIC is in-house (captive); BPO involves an external service provider.",
    steps: [
      { stepNumber: 1, title: "Define GIC", explanation: "GIC = a company's own internal IT center set up in India or another country." },
      { stepNumber: 2, title: "Distinguish from BPO", explanation: "BPO = external provider. GIC = internal/captive unit of the parent company." },
      { stepNumber: 3, title: "Give an example", explanation: "A US bank's own IT center in India handling the bank's data = a GIC.", result: "GIC = captive internal center; works only for the parent company, not external clients." },
    ],
    keyConcepts: ["GIC definition", "Captive unit", "In-house vs outsourcing"],
  },

  {
    id: "c9-it-unit1-t3-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which type of IT-BPM organisation has its headquarters outside India and operates in multiple locations worldwide including India? (a) ISP (Indian Service Provider)  (b) MNC (Multinational Corporation)  (c) GIC (Global In-house Center)  (d) BPO service centre",
    hint: "The headquarters is the key clue — which type is based OUTSIDE India but operates here?",
    answer: "(b) MNC (Multinational Corporation)",
    steps: [
      { stepNumber: 1, title: "Identify the defining feature", explanation: "The question describes headquarters outside India + operations worldwide including India." },
      { stepNumber: 2, title: "Match to textbook definition", explanation: "MNCs have their headquarters outside India but operate in multiple locations worldwide including India. They cater to external clients (both domestic and/or global).", result: "Answer: (b)" },
    ],
    keyConcepts: ["MNC definition", "Headquarters location"],
  },

  {
    id: "c9-it-unit1-t3-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Medium", questionType: "LongAnswer",
    question: "Explain the structure of the IT-BPM industry by describing the three types of organisations and the four parameters used to categorise them.",
    hint: "Cover the four categorisation parameters first, then describe MNCs, ISPs, and GICs with their key features.",
    answer: "The IT-BPM industry is structured and categorised along four parameters: (1) Sector the organisation is serving; (2) Type and range of offerings; (3) Geographic spread of operations; (4) Revenues and size of operations. Based on these parameters, organisations fall into three types: (a) Multinational Companies (MNCs): MNCs have their headquarters outside India but operate in multiple locations worldwide, including India. They cater to external clients — both domestic (Indian) and global. Examples include large US/European IT companies with development centres in India. (b) Indian Service Providers (ISPs): These companies started operations in India and mostly have their headquarters in India, while having offices in many international locations. Most ISPs serve both global and domestic clients; some serve only Indian clients. Examples include India's top IT companies. (c) Global In-house Centers (GICs): GICs are captive units set up by large global corporations in India (or elsewhere) to handle IT and BPM work exclusively for the parent company. Unlike BPO, GICs are NOT external providers — they are in-house operations serving only their parent company.",
    steps: [
      { stepNumber: 1, title: "State the four parameters", explanation: "Sector served, type/range of offerings, geographic spread, revenues and size." },
      { stepNumber: 2, title: "Describe MNCs", explanation: "Headquarters outside India; global operations; serve domestic and global clients." },
      { stepNumber: 3, title: "Describe ISPs", explanation: "Started in India; India-headquartered; global offices; serve mixed client base." },
      { stepNumber: 4, title: "Describe GICs", explanation: "Captive internal units of parent companies; serve only the parent, not external clients.", result: "Complete answer: 4 parameters + 3 organisation types clearly described." },
    ],
    keyConcepts: ["IT-BPM structure", "MNC", "ISP", "GIC", "Categorisation parameters"],
  },

  {
    id: "c9-it-unit1-t3-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Hard", questionType: "ShortAnswer",
    question: "A technology company was founded in Pune, India. It has its head office in Pune, development centers in New York and London, and serves clients across the USA, UK, and within India. Which type of IT-BPM organisation is this? Justify your answer.",
    hint: "The headquarters is in India — that eliminates one type. It serves external clients — that eliminates another.",
    answer: "This company is an Indian Service Provider (ISP). Justification: (1) It started its operations in India and has its headquarters in India (Pune) — this matches the ISP definition. (2) It has offices in many international locations (New York, London) — also consistent with ISPs. (3) It serves both global (USA, UK) and domestic (India) clients — exactly as described for ISPs in the textbook. It is NOT an MNC (because MNCs have headquarters OUTSIDE India). It is NOT a GIC (because GICs are captive internal units serving only the parent company, whereas this company serves external clients in multiple countries).",
    steps: [
      { stepNumber: 1, title: "Check headquarters location", explanation: "Headquarters in Pune, India → eliminates MNC (headquarters outside India)." },
      { stepNumber: 2, title: "Check if it serves external clients", explanation: "Serves clients in USA, UK, India → eliminates GIC (GIC serves only parent company, not external clients)." },
      { stepNumber: 3, title: "Match to ISP", explanation: "India-headquartered, global offices, mixed client base (domestic + international) = ISP.", result: "This company is an ISP (Indian Service Provider)." },
    ],
    keyConcepts: ["ISP identification", "Application of organisational types", "Reasoning"],
  },

  {
    id: "c9-it-unit1-t3-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t3", topicName: "Structure of the IT-BPM Industry",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the key difference between a BPO and a GIC? If a company decides to set up a GIC instead of using a BPO, what is the main reason it might do this?",
    hint: "Think about control — who owns the unit and who it works for.",
    answer: "Key difference: A BPO (Business Process Outsourcing) involves hiring an EXTERNAL service provider to handle certain business processes. The BPO company works for multiple clients. A GIC (Global In-house Center) is a CAPTIVE UNIT — it is wholly owned and operated by the parent company itself. The GIC works exclusively for the parent company, not for external clients. Why a company might choose a GIC over a BPO: The main reason is CONTROL. By setting up a GIC, the company maintains full control over: (1) Confidential data and intellectual property; (2) Quality and standards of work; (3) Processes and workflows; (4) Dedicated workforce exclusively focused on its needs. BPO may be cheaper but offers less control; a GIC offers more control but requires more investment to set up and manage.",
    steps: [
      { stepNumber: 1, title: "Distinguish BPO and GIC", explanation: "BPO = external company; GIC = internal/captive unit of the parent." },
      { stepNumber: 2, title: "Identify the main reason for choosing GIC", explanation: "Control over data, quality, processes, and dedicated workforce." },
      { stepNumber: 3, title: "Trade-off", explanation: "GIC = more control + more investment; BPO = less control + typically cheaper.", result: "GIC = captive internal; BPO = external provider. Companies choose GIC for control over sensitive operations." },
    ],
    keyConcepts: ["BPO vs GIC", "Captive unit", "Data control", "In-house operations"],
  },

  // ── Topic 4: Applications of IT ──────────────────────────────────────────────

  {
    id: "c9-it-unit1-t4-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which of the following is an example of IT used in the field of EDUCATION? (a) Using ATM machines for cash withdrawal  (b) Using computers to provide online courses and digital learning material  (c) Using computers for diagnosis with an MRI machine  (d) Using a word processor for legal document preparation",
    hint: "Education = learning, teaching, online courses, digital libraries.",
    answer: "(b) Using computers to provide online courses and digital learning material",
    steps: [
      { stepNumber: 1, title: "Identify which example matches Education", explanation: "(a) = Banking. (c) = Health care. (d) = Legal/workplace. (b) correctly relates to the use of computers in the field of education — online courses and digital learning." },
      { stepNumber: 2, title: "Confirm", explanation: "IT in education includes e-learning, digital textbooks, computer-based teaching, and online assessments.", result: "Answer: (b)" },
    ],
    keyConcepts: ["IT in education", "e-learning", "Digital learning"],
  },

  {
    id: "c9-it-unit1-t4-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is e-governance? Name the initiative of the Government of India that promotes e-governance.",
    hint: "e-governance = government services delivered electronically. What is India's major digital initiative?",
    answer: "E-governance is the use of Information and Communication Technology (ICT) applications by the government, non-governmental organisations (NGOs), and international government agencies to communicate and provide various services to citizens online. Through e-governance, people can access government services via the internet — without visiting a government office. Examples of e-governance services in India: (1) Online filing of income tax returns; (2) Online payment of electricity bills; (3) Electronic voting (EVMs); (4) Online voter registration through State Election Commission portals; (5) Preparation of PAN cards and voter lists. Initiative: Digital India — this is the Government of India's initiative that encourages e-governance practices and digital services for citizens.",
    steps: [
      { stepNumber: 1, title: "Define e-governance", explanation: "E-governance = use of ICT by government to communicate and provide services to people." },
      { stepNumber: 2, title: "Give examples", explanation: "Online tax filing, electricity bill payment, EVMs, PAN cards, voter registration." },
      { stepNumber: 3, title: "Name the initiative", explanation: "Digital India — the Government of India's major initiative promoting e-governance.", result: "E-governance = digital government services; Digital India = India's key e-governance initiative." },
    ],
    keyConcepts: ["E-governance", "Digital India", "Online government services"],
  },

  {
    id: "c9-it-unit1-t4-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Easy", questionType: "MCQ",
    question: "What does MRI stand for in the context of IT in health care? (a) Medical Research Initiative  (b) Magnetic Resonance Imaging  (c) Medically Reviewed Information  (d) Modern Radiological Instrument",
    hint: "MRI is a machine that uses magnetic fields and radio waves to produce detailed images of internal organs.",
    answer: "(b) Magnetic Resonance Imaging",
    steps: [
      { stepNumber: 1, title: "Recall from textbook", explanation: "The NCERT IT 402 textbook states: 'MRI (Magnetic Resonance Imaging Machine): MRI machines are used to give the digital impression of internal organs of the body by using strong magnetic fields and radio waves.'" },
      { stepNumber: 2, title: "Confirm", explanation: "Option (b) is the correct expansion.", result: "Answer: (b)" },
    ],
    keyConcepts: ["MRI full form", "IT in health care", "Medical imaging"],
  },

  {
    id: "c9-it-unit1-t4-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "List any FOUR applications of IT in the field of health care as described in the NCERT IT 402 textbook.",
    hint: "Think about machines for imaging/diagnosis, expert systems, and ICT-based medical tools.",
    answer: "Four applications of IT in health care (from the NCERT IT 402 textbook): (1) CAT (Computerised Axial Tomography): Produces three-dimensional images of body parts for disease diagnosis. (2) MRI (Magnetic Resonance Imaging): Uses magnetic fields and radio waves to produce digital images of internal organs for detection and treatment planning. (3) Expert Systems: Used for early diagnosis of diseases and treatment planning — diseases can be diagnosed at early stages using expert system software. (4) ICT-based monitoring during surgery: Measuring instruments and surgical equipment use computers to monitor patients' conditions during complex surgery. Additional examples: ECG, EEG, Ultrasound, CT Scan machines; Blood Sugar Testing Machine; Blood Pressure Measuring Machine; computers in laboratories and dispensaries.",
    steps: [
      { stepNumber: 1, title: "Recall healthcare IT section", explanation: "The textbook covers ICT use in diagnosis and treatment under 'IT in health care'." },
      { stepNumber: 2, title: "List four specific examples", explanation: "CAT scan, MRI, Expert Systems, and monitoring equipment during surgery are four clear examples.", result: "Four valid health care IT applications from the textbook." },
    ],
    keyConcepts: ["IT in health care", "CAT scan", "MRI", "Expert system", "ICT in diagnosis"],
  },

  {
    id: "c9-it-unit1-t4-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "How is IT used in banking and insurance?",
    hint: "Think about online banking, ATMs, electronic transactions, and how insurance companies manage data.",
    answer: "IT is extensively used in banking and insurance in the following ways: (1) Online banking: Customers can check balances, transfer funds, and pay bills online through internet banking portals and mobile banking apps. (2) ATM (Automated Teller Machine): ATMs allow customers to withdraw cash and perform transactions 24 hours a day without visiting a branch. (3) E-commerce and online transactions: Internet enables financial transactions (e-commerce) to happen digitally, replacing physical cash transactions. (4) Data management: Banks and insurance companies use IT to store, process, and manage massive volumes of customer data securely. (5) Online bill payment: Electricity bills, insurance premiums, and other payments can now be paid online. (6) Insurance processing: ICT helps insurance companies manage claims, policies, and customer records efficiently.",
    steps: [
      { stepNumber: 1, title: "Recall banking applications", explanation: "Online banking, ATMs, mobile banking, fund transfers, online payments." },
      { stepNumber: 2, title: "Add insurance applications", explanation: "Claims management, policy data storage, digital records." },
      { stepNumber: 3, title: "Include e-commerce link", explanation: "The textbook connects internet-based transactions (e-commerce) to banking.", result: "IT in banking: ATMs, online banking, e-payments; in insurance: digital claims and data management." },
    ],
    keyConcepts: ["IT in banking", "Online banking", "ATM", "E-commerce", "Insurance IT"],
  },

  {
    id: "c9-it-unit1-t4-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Easy", questionType: "MCQ",
    question: "The CAT machine used in health care stands for: (a) Computer Aided Treatment  (b) Computerised Axial Tomography  (c) Computer Assisted Therapeutics  (d) Centralised Automatic Technology",
    hint: "CAT is a scanning machine that uses computers to produce three-dimensional images of body parts.",
    answer: "(b) Computerised Axial Tomography",
    steps: [
      { stepNumber: 1, title: "Recall textbook expansion", explanation: "The NCERT IT 402 textbook states: 'CAT (Computerised Axial Tomography Machine): Using this machine three-dimensional (3D) images of different parts of the body can be made.'" },
      { stepNumber: 2, title: "Select option (b)", explanation: "(b) matches the full form exactly.", result: "Answer: (b)" },
    ],
    keyConcepts: ["CAT full form", "Medical imaging", "IT in health care"],
  },

  {
    id: "c9-it-unit1-t4-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Explain any THREE applications of IT in everyday life and home computing.",
    hint: "Think about how people use technology at home — mobile devices, internet, entertainment, home appliances.",
    answer: "Three applications of IT in everyday life and home computing: (1) Communication: IT enables people to communicate instantly through email, instant messaging, video calls (such as Zoom or Google Meet), and social media platforms. Communication has become faster and cheaper because of IT. (2) Entertainment: IT is used for streaming movies, music, and online gaming. Digital platforms and home computers provide entertainment 24/7. (3) Home computing and internet access: People use computers and smartphones at home for a variety of tasks — shopping online (e-commerce), accessing information, online banking, booking tickets, and managing personal schedules. Digital devices have become an essential part of modern home life.",
    steps: [
      { stepNumber: 1, title: "Identify three everyday uses", explanation: "Communication, entertainment, and home computing are three key categories from the CBSE syllabus." },
      { stepNumber: 2, title: "Describe each", explanation: "Give specific examples for each: email/video calling for communication; streaming for entertainment; online shopping/banking for home computing." },
      { stepNumber: 3, title: "Tie to the textbook", explanation: "The textbook states: 'In today's digital era, we use mobile devices to perform the tasks of our daily life. It is difficult to think of any event without the use of digital devices.'", result: "Three everyday IT applications clearly described with examples." },
    ],
    keyConcepts: ["IT in everyday life", "Home computing", "Communication", "Entertainment"],
  },

  {
    id: "c9-it-unit1-t4-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Hard", questionType: "LongAnswer",
    question: "Describe any FIVE application areas of Information Technology from different sectors. Provide at least one specific example for each area.",
    hint: "Choose five from: home computing, everyday life, education, workplace, library, entertainment, communication, business, science, banking, health care, government.",
    answer: "Five application areas of IT (any five from the list below): (1) Education: IT is used for e-learning, online courses, digital textbooks, and computer-based assessments. Students can access educational resources from anywhere using the internet. Example: Online video lectures and interactive learning platforms. (2) Health care: IT enables advanced diagnosis and treatment. Example: MRI machines use computers to generate detailed images of internal organs; Expert systems help diagnose diseases early. (3) Banking and Insurance: IT powers online banking, ATMs, and e-transactions. Example: Customers use internet banking to transfer funds without visiting a branch. (4) Government and Public Service (e-governance): The government uses IT to deliver public services digitally. Example: Citizens can file income tax returns online; Electoral rolls are prepared using computers; Digital India promotes e-governance. (5) Science and Engineering: IT supports complex simulations, data analysis, design, and research. Example: Engineers use Computer Aided Design (CAD) software to design mechanical parts; scientists use IT to analyse experimental data. (6) Business and Marketing: IT helps businesses reach customers, manage inventory, and market products digitally. Example: E-commerce platforms allow businesses to sell products online; digital marketing uses social media to reach customers.",
    steps: [
      { stepNumber: 1, title: "Select five distinct sectors", explanation: "Choose from: education, health care, banking, government, science, business, communication, entertainment, etc." },
      { stepNumber: 2, title: "Describe each with a specific example", explanation: "Each sector should have a clear description of HOW IT is used and at least one example." },
      { stepNumber: 3, title: "Ensure variety", explanation: "Do not repeat sectors — choose five genuinely different areas.", result: "Five sectors each with clear description and specific example." },
    ],
    keyConcepts: ["IT applications", "Multiple sectors", "Education IT", "Health care IT", "E-governance", "Banking IT"],
  },

  {
    id: "c9-it-unit1-t4-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "How does IT contribute to the field of communication?",
    hint: "Think about how messages and information travel between people today versus before computers.",
    answer: "IT has revolutionised communication in the following ways: (1) Email: IT enables instant electronic messaging across the world, replacing traditional postal mail. (2) Internet-based communication: Video calls, instant messaging, and social media platforms allow people to communicate in real time regardless of distance. (3) Internet as a major source of information and entertainment: People access news, educational content, and stay connected globally through the internet. (4) Web-based training (WBT): Organisations use the internet to train employees online — removing the need for travel. The internet service provider (ISP) provides B2B e-commerce solutions that further enhance business communication. IT has made communication faster, cheaper, and more accessible to everyone.",
    steps: [
      { stepNumber: 1, title: "Identify communication tools enabled by IT", explanation: "Email, video calls, social media, instant messaging, WBT." },
      { stepNumber: 2, title: "Explain the impact", explanation: "Faster, cheaper, and global communication; real-time connectivity." },
      { stepNumber: 3, title: "Link to textbook", explanation: "The textbook mentions internet as a major communication enabler and source of information.", result: "IT in communication = email, internet, video calls, WBT, social media." },
    ],
    keyConcepts: ["IT in communication", "Email", "Internet", "Web-based training"],
  },

  {
    id: "c9-it-unit1-t4-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "MCQ",
    question: "A doctor is performing complex surgery and uses computers to monitor the patient's heart rate, blood pressure, and oxygen levels in real time. This is an example of IT used in: (a) Communication  (b) Education  (c) Health care  (d) Government and public service",
    hint: "The question describes monitoring a patient during surgery — which sector does this belong to?",
    answer: "(c) Health care",
    steps: [
      { stepNumber: 1, title: "Identify the context", explanation: "Monitoring a patient during surgery using computers is a medical application." },
      { stepNumber: 2, title: "Match to sector", explanation: "The NCERT textbook mentions: 'The variety of measuring instruments and surgical equipment are used to monitor patients' conditions during complex surgery.' This is IT in health care.", result: "Answer: (c) Health care" },
    ],
    keyConcepts: ["IT in health care", "Patient monitoring", "Surgical IT"],
  },

  {
    id: "c9-it-unit1-t4-q11", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is e-commerce? How has the internet changed the way businesses operate?",
    hint: "E-commerce = electronic buying and selling. Think about how businesses reach customers online.",
    answer: "E-commerce (Electronic Commerce) refers to buying and selling of goods and services over the internet. It involves financial transactions happening through the internet instead of physical stores or offices. How the internet has changed businesses: (1) Wider reach: Businesses can now reach customers globally — not just locally. (2) 24/7 availability: Online stores are open all day, every day. (3) Cost reduction: Businesses reduce overhead costs (no physical store needed). (4) Customer convenience: Customers can browse, compare, and buy products from home. (5) Internet service providers (ISPs) aim to provide B2B e-commerce solutions that reduce costs and improve service standards. (6) E-enabled services radically reduce costs and improve service quality. IT has allowed businesses to streamline operations, maximise profit, and provide better customer service through digital platforms.",
    steps: [
      { stepNumber: 1, title: "Define e-commerce", explanation: "E-commerce = electronic buying and selling over the internet." },
      { stepNumber: 2, title: "Explain changes to businesses", explanation: "Wider reach, 24/7 sales, cost reduction, direct customer access." },
      { stepNumber: 3, title: "Link to textbook", explanation: "'E-enabled services radically reduce costs and improve service standards' — textbook statement.", result: "E-commerce = online buying/selling; Internet gives businesses global reach and reduces costs." },
    ],
    keyConcepts: ["E-commerce definition", "IT in business", "Internet-enabled business"],
  },

  {
    id: "c9-it-unit1-t4-q12", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t4", topicName: "Applications of IT",
    difficulty: "Hard", questionType: "ShortAnswer",
    question: "IT in libraries has transformed how people access information. Explain how IT is used in a modern library.",
    hint: "Think about digital catalogues, e-books, online access to resources, and database searches.",
    answer: "IT has transformed libraries in multiple ways: (1) Digital catalogues: Traditional card catalogues have been replaced by computerised Library Management Systems (LMS), allowing users to search for books and resources by title, author, subject, or keyword instantly. (2) E-books and digital resources: Libraries now provide access to electronic books (e-books), online journals, research databases, and multimedia resources. (3) Online access: Library members can access digital resources remotely from home using the internet — no need to physically visit. (4) Barcode/RFID systems: Books are tracked using barcodes or RFID (Radio Frequency Identification) technology, making issue and return processes faster and more accurate. (5) Internet access: Many libraries provide computers with internet access to help users research and access global information. (6) Data management: Library records (members, books, transactions) are all maintained digitally, replacing manual registers. IT in libraries improves efficiency, expands access to information, and supports lifelong learning.",
    steps: [
      { stepNumber: 1, title: "Identify library IT applications", explanation: "Digital catalogues, e-books, online databases, RFID systems, internet access." },
      { stepNumber: 2, title: "Describe transformation", explanation: "Manual card catalogues → LMS; physical books → e-books; in-person access → remote access." },
      { stepNumber: 3, title: "Connect to broader benefits", explanation: "IT in libraries expands knowledge access and improves efficiency.", result: "IT in libraries: digital catalogues, e-books, RFID, online access, internet terminals." },
    ],
    keyConcepts: ["IT in library", "Digital catalogue", "e-books", "Library management system"],
  },

  // ── Topic 5: Work Area, Health and Safety ────────────────────────────────────

  {
    id: "c9-it-unit1-t5-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which National Occupational Standard (NOS) relates to maintaining a healthy, safe and secure working environment in the IT 402 course? (a) SSC/N3022  (b) SSC/N9001  (c) SSC/N9003  (d) SSC/Q2212",
    hint: "SSC/N9003 specifically covers the safety and health aspect — the '9003' code is the key.",
    answer: "(c) SSC/N9003",
    steps: [
      { stepNumber: 1, title: "Recall the NOS codes from IT 402 textbook", explanation: "The NCERT IT 402 textbook lists three NOS covered: SSC/N3022 (data entry services), SSC/N9001 (managing work requirements), SSC/N9003 (maintaining a healthy, safe and secure working environment)." },
      { stepNumber: 2, title: "Match to health and safety", explanation: "SSC/N9003 explicitly covers 'maintaining a healthy, safe and secure working environment'.", result: "Answer: (c) SSC/N9003" },
    ],
    keyConcepts: ["NOS codes", "SSC/N9003", "Health and safety NOS"],
  },

  {
    id: "c9-it-unit1-t5-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Why is it important to maintain a clean, tidy, and safe work area in an IT workplace? List any FOUR safety or health measures an IT worker should follow.",
    hint: "A cluttered, unsafe workspace can cause accidents, health issues, and reduce productivity — what can you do to prevent these?",
    answer: "Importance of a clean and safe IT work area: A well-maintained work area prevents accidents, reduces health risks, improves productivity, and ensures the safety of both the worker and the equipment. In IT workplaces, cables, electrical equipment, and long hours of screen time create specific hazards. Four safety/health measures an IT worker should follow: (1) Cable management: Keep cables properly tied and out of walkways to prevent tripping accidents and short circuits. (2) Ergonomic posture: Sit with back straight, feet flat on the floor, and monitor at eye level to prevent back pain and eye strain. (3) Adequate lighting: Ensure sufficient, glare-free lighting to reduce eye strain during long hours of computer work. (4) Regular breaks: Take short breaks every 30–60 minutes to reduce eye fatigue, prevent repetitive strain injuries (RSI), and maintain focus. Additional measures: Fire safety (know emergency exits, have fire extinguishers); Electrical safety (do not use damaged cables or overloaded power strips); Keep food and liquids away from computer equipment.",
    steps: [
      { stepNumber: 1, title: "State why it is important", explanation: "Prevents accidents, health problems; improves productivity and equipment life." },
      { stepNumber: 2, title: "List four specific measures", explanation: "Cable management, ergonomic posture, adequate lighting, regular breaks." },
      { stepNumber: 3, title: "Connect to textbook NOS", explanation: "SSC/N9003 covers this — maintaining a healthy, safe, secure working environment.", result: "Clean workspace = safer, healthier, more productive. Four measures: cables, posture, lighting, breaks." },
    ],
    keyConcepts: ["Work area safety", "Ergonomics", "Cable management", "Health measures"],
  },

  {
    id: "c9-it-unit1-t5-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Easy", questionType: "MCQ",
    question: "What is 'ergonomics' in the context of an IT workplace? (a) The study of how to increase computer processing speed  (b) The study of how to design workplaces to fit the physical needs of workers  (c) The study of electronic circuits in computers  (d) The study of network configurations",
    hint: "Ergonomics is about comfort and fitting the work environment to the human body to prevent injury.",
    answer: "(b) The study of how to design workplaces to fit the physical needs of workers",
    steps: [
      { stepNumber: 1, title: "Define ergonomics", explanation: "Ergonomics is the science of designing the workplace, equipment, and work tasks to fit the physical and cognitive capabilities of workers. In IT, this includes monitor height, chair adjustments, keyboard placement, and lighting." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "(a) relates to computer speed, (c) to electronics, (d) to networking — none relate to worker physical comfort.", result: "Answer: (b)" },
    ],
    keyConcepts: ["Ergonomics definition", "Workplace design", "Worker health"],
  },

  {
    id: "c9-it-unit1-t5-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "A data entry operator works 8 hours a day at a computer. What health risks might they face, and how can they reduce these risks?",
    hint: "Long hours at a computer can affect eyes, back, wrists, and general health. Think prevention.",
    answer: "A data entry operator working 8 hours daily at a computer may face the following health risks: (1) Eye strain (Computer Vision Syndrome): Staring at a screen for long periods causes eye fatigue, dryness, headaches, and blurred vision. Prevention: Take a 20-second break every 20 minutes (look 20 feet away); ensure proper lighting; reduce screen glare. (2) Back and neck pain: Sitting in a poorly adjusted chair or hunched posture for hours causes musculoskeletal pain. Prevention: Use an ergonomic chair; maintain correct sitting posture — back straight, feet flat on floor, monitor at eye level; take short standing breaks. (3) Repetitive Strain Injury (RSI): Continuous typing can cause wrist and hand pain (e.g., Carpal Tunnel Syndrome). Prevention: Use proper keyboard technique; wrist rest supports; take frequent breaks. (4) General fatigue: Long sedentary work causes tiredness. Prevention: Drink water, take regular short breaks, do light stretching exercises. (5) Poor air quality: IT rooms can accumulate heat and reduce fresh air. Prevention: Ensure proper ventilation in the workspace.",
    steps: [
      { stepNumber: 1, title: "Identify the main health risks", explanation: "Eye strain, back/neck pain, RSI, fatigue, poor air quality." },
      { stepNumber: 2, title: "Give prevention for each", explanation: "20-20-20 rule for eyes; ergonomic posture for back; proper typing technique for RSI; breaks for fatigue." },
      { stepNumber: 3, title: "Connect to ergonomics", explanation: "Most prevention strategies involve ergonomic design of the workspace and work habits.", result: "Main risks: eye strain, back pain, RSI, fatigue. Prevention: ergonomics, breaks, proper lighting." },
    ],
    keyConcepts: ["Data entry health risks", "Eye strain", "RSI", "Ergonomics", "Work breaks"],
  },

  {
    id: "c9-it-unit1-t5-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "List THREE National Occupational Standards (NOS) covered by the IT 402 (Information Technology) course for Class IX.",
    hint: "The IT 402 textbook's foreword lists exactly three NOS codes — they relate to data entry, work management, and health/safety.",
    answer: "The three National Occupational Standards (NOS) covered by the IT 402 course: (1) SSC/N3022 – Undertaking data entry services; (2) SSC/N9001 – Managing work to meet requirements; (3) SSC/N9003 – Maintaining a healthy, safe and secure working environment.",
    steps: [
      { stepNumber: 1, title: "Recall from IT 402 textbook foreword", explanation: "The NCERT IT 402 textbook explicitly lists three NOS codes in its foreword/preface." },
      { stepNumber: 2, title: "Write all three with their titles", explanation: "SSC/N3022 = data entry; SSC/N9001 = managing work; SSC/N9003 = health, safety, and security.", result: "Three NOS: SSC/N3022, SSC/N9001, SSC/N9003 — each with their full title." },
    ],
    keyConcepts: ["NOS codes", "IT 402 curriculum", "Occupational standards"],
  },

  {
    id: "c9-it-unit1-t5-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit1", chapterName: "Introduction to IT-ITeS Industry",
    topicId: "t5", topicName: "Work Area, Health and Safety",
    difficulty: "Hard", questionType: "LongAnswer",
    question: "As an IT professional, you are responsible for setting up a safe and healthy computer workstation for a new data entry employee. Describe the key ergonomic and safety considerations you would ensure are in place.",
    hint: "Cover physical setup (chair, monitor, keyboard), environmental factors (lighting, ventilation), electrical safety, and health habits.",
    answer: "Setting up a safe and healthy IT workstation involves the following considerations: A. Ergonomic physical setup: (1) Chair: Adjustable chair with lumbar (lower back) support. Employee's feet should be flat on the floor; knees at 90°. (2) Monitor: Position at arm's length, with the top of the screen at or slightly below eye level to prevent neck strain. Use anti-glare screens or screen filters. (3) Keyboard and mouse: Place at elbow height; wrists should be straight while typing, not bent up or down. Wrist rest supports reduce strain. B. Environmental factors: (4) Lighting: Adequate, non-glare lighting. Avoid placing the monitor facing a bright window (causes glare). Natural light from the side is ideal. (5) Ventilation: Ensure the room is well-ventilated; computer equipment generates heat. (6) Cleanliness: Keep the workspace clean and dust-free; cables neatly tied and out of walkways to prevent tripping. C. Electrical safety: (7) Check all cables for damage before use; do not overload power strips; switch off equipment when not in use. (8) Ensure emergency exits are clearly visible and not blocked. D. Health habits: (9) Encourage taking a 5–10 minute break every hour; light stretching exercises help prevent RSI and fatigue. (10) Drink water regularly; avoid placing food or drinks near computer equipment to prevent spills.",
    steps: [
      { stepNumber: 1, title: "Cover ergonomic setup", explanation: "Chair adjustment, monitor height, keyboard/wrist position." },
      { stepNumber: 2, title: "Cover environmental factors", explanation: "Lighting, ventilation, cleanliness, cable management." },
      { stepNumber: 3, title: "Cover electrical safety", explanation: "Cable condition, power management, fire exits." },
      { stepNumber: 4, title: "Cover health habits", explanation: "Regular breaks, stretching, hydration, no food near equipment.", result: "Complete workstation safety guide: ergonomics + environment + electrical safety + health habits." },
    ],
    keyConcepts: ["Workstation setup", "Ergonomics", "Electrical safety", "Health habits", "Lighting", "Cable management"],
  },

];
