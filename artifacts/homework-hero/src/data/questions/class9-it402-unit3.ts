// @frozen — Information Technology 402 Unit 3: Digital Documentation — 50 questions, validated 2026-08-17 (50/50 GOLD_STANDARD_PASS on first run, 0 defects)
import type { Question, ChapterMeta } from "./types";

export const CHAPTER_META: ChapterMeta = {
  id: "it402-unit3",
  name: "Digital Documentation",
  classNum: 9,
  subject: "Information Technology",
  canonicalChapterId: "402-IT-IX-unit3",
  curriculumStatus: "ACTIVE",
  topics: [
    { id: "t1", name: "Introduction to LibreOffice Writer",    questionCount: 10 },
    { id: "t2", name: "Editing a Document",                    questionCount: 10 },
    { id: "t3", name: "Formatting Text and Paragraphs",        questionCount: 12 },
    { id: "t4", name: "Tables in LibreOffice Writer",          questionCount: 10 },
    { id: "t5", name: "Mail Merge",                            questionCount:  8 },
  ],
};

export const QUESTIONS: Question[] = [

  // ── Topic 1: Introduction to LibreOffice Writer ──────────────────────────────

  {
    id: "c9-it-unit3-t1-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which of the following best describes a word processor? (a) Software used to manage databases (b) Software used to create, edit, format and print text documents (c) Software used to perform mathematical calculations (d) Software used to draw diagrams",
    hint: "A word processor handles text — typing, editing, formatting and printing.",
    answer: "(b) Software used to create, edit, format and print text documents. A word processor is an application that helps the user create, edit, format, save and print text-based documents.",
    steps: [
      { stepNumber: 1, title: "Recall the NCERT definition", explanation: "The NCERT IT 402 textbook defines a word processor as: 'software used to create, edit, format, and print text documents.'" },
      { stepNumber: 2, title: "Eliminate distractors", explanation: "(a) is a database application, (c) is a spreadsheet, (d) is a drawing/graphics tool. Only (b) matches the definition.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Word processor", "LibreOffice Writer"],
  },

  {
    id: "c9-it-unit3-t1-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "LibreOffice Writer is a: (a) Proprietary word processor developed by Microsoft (b) Free and open-source word processor that is part of the LibreOffice suite (c) Spreadsheet application (d) Presentation software",
    hint: "LibreOffice is a well-known free and open-source office suite.",
    answer: "(b) Free and open-source word processor that is part of the LibreOffice suite. LibreOffice is a free, open-source office productivity suite, and Writer is its word processing component.",
    steps: [
      { stepNumber: 1, title: "Identify LibreOffice", explanation: "LibreOffice is a free and open-source alternative to Microsoft Office. It includes Writer (word processor), Calc (spreadsheet), and Impress (presentation)." },
      { stepNumber: 2, title: "Identify the component", explanation: "Writer is the word-processing component — for text documents. Calc is the spreadsheet; Impress is the presentation tool.", result: "Answer: (b)." },
    ],
    keyConcepts: ["LibreOffice", "Free and open-source", "Writer"],
  },

  {
    id: "c9-it-unit3-t1-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Name any four components of the LibreOffice Writer window and state their purpose.",
    hint: "Think about the bars and areas you see when you open LibreOffice Writer.",
    answer: "Four components of the LibreOffice Writer window: (1) Title Bar — displays the name of the current document and the application name. (2) Menu Bar — contains menus (File, Edit, View, Insert, etc.) through which all commands are accessed. (3) Standard Toolbar — contains icons for common operations such as New, Open, Save, Print, and Undo. (4) Formatting Toolbar — contains icons for text formatting options such as font name, font size, bold, italic, underline, and alignment. (Other acceptable answers: Ruler, Status Bar, Workspace/Document Area, Scroll Bars, Navigator.)",
    steps: [
      { stepNumber: 1, title: "Recall the Writer interface components", explanation: "The NCERT textbook describes: Title Bar (document name), Menu Bar (commands), Standard Toolbar (file operations), Formatting Toolbar (text formatting), Ruler (indents/margins), Status Bar (page/word info), Workspace (editing area)." },
      { stepNumber: 2, title: "Write any four with their purpose", explanation: "Choose four from the list above. State each name and what it does.", result: "Any four correctly named and described components earn full marks." },
    ],
    keyConcepts: ["Writer window", "Title bar", "Menu bar", "Toolbar"],
  },

  {
    id: "c9-it-unit3-t1-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "What information does the Title Bar of LibreOffice Writer display? (a) Font name and font size only (b) The name of the current document and the application name (c) The current page number and total pages (d) The list of recently opened files",
    hint: "Look at the very top strip of the application window.",
    answer: "(b) The name of the current document and the application name. The Title Bar shows the document name followed by '— LibreOffice Writer', so the user always knows which document is open.",
    steps: [
      { stepNumber: 1, title: "Identify the Title Bar", explanation: "The Title Bar is the topmost bar of any application window. In Writer it shows: [Document Name] — LibreOffice Writer." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "(a) is in the Formatting Toolbar; (c) is in the Status Bar; (d) is under File → Recent Documents.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Title bar", "Writer interface"],
  },

  {
    id: "c9-it-unit3-t1-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "The default file format used by LibreOffice Writer to save documents is: (a) .docx  (b) .txt  (c) .odt  (d) .pdf",
    hint: "LibreOffice uses its own open document format by default.",
    answer: "(c) .odt (Open Document Text). LibreOffice Writer saves documents in ODF (Open Document Format) with the extension .odt by default. It can also save in .docx and export to .pdf.",
    steps: [
      { stepNumber: 1, title: "Recall LibreOffice's native format", explanation: "LibreOffice uses ODF — Open Document Format. The word-processor format is ODF Text (.odt). This is an ISO-standardised open format." },
      { stepNumber: 2, title: "Distinguish from Microsoft Word format", explanation: ".docx is Microsoft Word's format. LibreOffice can open and save .docx, but it is not the default.", result: "Answer: (c) .odt." },
    ],
    keyConcepts: ["ODF", ".odt", "File format"],
  },

  {
    id: "c9-it-unit3-t1-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What is the difference between 'Save' and 'Save As' in LibreOffice Writer?",
    hint: "Save As always asks you something that Save doesn't.",
    answer: "Save (Ctrl+S): Saves the document with its current name and in its current location. If the document has never been saved before, it opens the Save As dialog. Save As (Ctrl+Shift+S): Always opens a dialog box where the user can specify a new file name, choose a different folder/location, or select a different file format. Save As is used to save a copy of the document under a different name or in a different format.",
    steps: [
      { stepNumber: 1, title: "Explain Save", explanation: "Save quickly saves all changes to the same file without asking anything (unless it is a brand-new unsaved document)." },
      { stepNumber: 2, title: "Explain Save As", explanation: "Save As always opens a dialog. Used to: rename a file; change location; change format (e.g. save as .docx or .pdf). Original file is not overwritten.", result: "Save = quick update same file; Save As = choose new name/location/format." },
    ],
    keyConcepts: ["Save", "Save As", "File operations"],
  },

  {
    id: "c9-it-unit3-t1-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "The keyboard shortcut to create a new document in LibreOffice Writer is: (a) Ctrl+N  (b) Ctrl+O  (c) Ctrl+S  (d) Ctrl+W",
    hint: "N stands for 'New'.",
    answer: "(a) Ctrl+N. Pressing Ctrl+N opens a new blank document in LibreOffice Writer. Ctrl+O opens an existing document; Ctrl+S saves; Ctrl+W closes the current document.",
    steps: [
      { stepNumber: 1, title: "Recall standard shortcuts", explanation: "Standard shortcuts: Ctrl+N = New, Ctrl+O = Open, Ctrl+S = Save, Ctrl+P = Print, Ctrl+W = Close." },
      { stepNumber: 2, title: "Apply to the question", explanation: "The question asks for New document — that is Ctrl+N.", result: "Answer: (a) Ctrl+N." },
    ],
    keyConcepts: ["Keyboard shortcut", "New document"],
  },

  {
    id: "c9-it-unit3-t1-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is 'word wrap' in a word processor? Why is it useful?",
    hint: "Think about what happens when text reaches the end of a line — you don't press Enter.",
    answer: "Word wrap is a feature of word processors that automatically moves a word to the next line when it reaches the right margin, without the user having to press the Enter (Return) key. The user only presses Enter to start a new paragraph. Word wrap is useful because: (1) It allows the user to type continuously without worrying about line endings. (2) When text is edited, lines are automatically re-wrapped to fit the margins. (3) It keeps the document neat and within the defined page width.",
    steps: [
      { stepNumber: 1, title: "Define word wrap", explanation: "Word wrap = automatic movement of a word to the next line when the current line is full. No manual Enter needed between lines." },
      { stepNumber: 2, title: "State why it is useful", explanation: "Saves effort (no manual line breaks). Text re-adjusts automatically when you insert or delete words — the document always fits within margins.", result: "Word wrap makes continuous typing easy and text automatically re-flows when edited." },
    ],
    keyConcepts: ["Word wrap", "Automatic line break"],
  },

  {
    id: "c9-it-unit3-t1-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Medium", questionType: "MCQ",
    question: "The Status Bar at the bottom of LibreOffice Writer displays which of the following information? (a) Font name and size (b) Page number, word count, and zoom level (c) List of open documents (d) Paragraph alignment setting",
    hint: "The Status Bar gives you a quick summary of where you are in the document.",
    answer: "(b) Page number, word count, and zoom level. The Status Bar at the bottom of the Writer window shows current page / total pages, cursor position, word count, language, and zoom level.",
    steps: [
      { stepNumber: 1, title: "Recall Status Bar location and content", explanation: "The Status Bar is the bar at the very bottom of the Writer window. It shows: page number (e.g. Page 2 of 5), word count, zoom %, and language." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "(a) Font info is in the Formatting Toolbar; (c) open documents are in the Window menu or taskbar; (d) alignment icons are in the Formatting Toolbar.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Status bar", "Writer interface"],
  },

  {
    id: "c9-it-unit3-t1-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t1", topicName: "Introduction to LibreOffice Writer",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "List any three advantages of using a word processor like LibreOffice Writer over a typewriter.",
    hint: "Think about editing, correcting mistakes, and formatting options — none of which a typewriter can do easily.",
    answer: "Three advantages of a word processor over a typewriter: (1) Easy editing — text can be inserted, deleted, moved or copied without retyping the whole document. (2) Automatic spell check — the word processor detects spelling and grammar errors and suggests corrections. (3) Formatting options — the user can change fonts, sizes, colours, alignment, and add tables or images — impossible on a typewriter. (Other acceptable advantages: Save and retrieve documents digitally; Print multiple copies easily; Undo mistakes instantly.)",
    steps: [
      { stepNumber: 1, title: "Identify limitations of a typewriter", explanation: "A typewriter: cannot undo errors (must use correction fluid); cannot reformat text; cannot save digitally; cannot copy-paste; cannot spell-check." },
      { stepNumber: 2, title: "State three advantages of a word processor", explanation: "Pick any three from: editing, spell check, formatting, saving, multiple copies, undo.", result: "Any three clearly stated advantages earn full marks." },
    ],
    keyConcepts: ["Advantages of word processor", "Editing", "Spell check"],
  },

  // ── Topic 2: Editing a Document ──────────────────────────────────────────────

  {
    id: "c9-it-unit3-t2-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which keyboard shortcut is used to Cut selected text in LibreOffice Writer? (a) Ctrl+C  (b) Ctrl+X  (c) Ctrl+V  (d) Ctrl+Z",
    hint: "X looks like scissors — it cuts.",
    answer: "(b) Ctrl+X. Ctrl+X cuts the selected text (removes it from the current position and places it on the clipboard). Ctrl+C copies, Ctrl+V pastes, Ctrl+Z undoes.",
    steps: [
      { stepNumber: 1, title: "Recall the Cut/Copy/Paste shortcuts", explanation: "Standard editing shortcuts: Ctrl+X = Cut, Ctrl+C = Copy, Ctrl+V = Paste. These are universal across most applications." },
      { stepNumber: 2, title: "Apply to the question", explanation: "Cut removes the selected text and places it on the clipboard. Shortcut = Ctrl+X.", result: "Answer: (b) Ctrl+X." },
    ],
    keyConcepts: ["Cut", "Ctrl+X", "Clipboard"],
  },

  {
    id: "c9-it-unit3-t2-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What is the difference between Cut and Copy in LibreOffice Writer?",
    hint: "One removes text from the original location; the other keeps it there.",
    answer: "Cut (Ctrl+X): Removes the selected text from its current position and places it on the clipboard. The original text is deleted. Copy (Ctrl+C): Makes a duplicate of the selected text and places it on the clipboard. The original text remains in place. In both cases, the text can then be pasted (Ctrl+V) at a new location. Cut is used to MOVE text; Copy is used to DUPLICATE text.",
    steps: [
      { stepNumber: 1, title: "Explain Cut", explanation: "Cut = remove from source + place on clipboard. Original text disappears from its location." },
      { stepNumber: 2, title: "Explain Copy", explanation: "Copy = duplicate to clipboard. Original text stays. Then paste at destination.", result: "Cut moves text; Copy duplicates text. Both use the clipboard." },
    ],
    keyConcepts: ["Cut", "Copy", "Clipboard", "Move vs duplicate"],
  },

  {
    id: "c9-it-unit3-t2-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "MCQ",
    question: "The keyboard shortcut to Undo the last action in LibreOffice Writer is: (a) Ctrl+Y  (b) Ctrl+Z  (c) Ctrl+U  (d) Ctrl+R",
    hint: "Z is the last letter of the alphabet — Undo is your 'last resort'.",
    answer: "(b) Ctrl+Z. Ctrl+Z undoes the most recent action. Pressing it multiple times undoes multiple actions. Ctrl+Y redoes an undone action.",
    steps: [
      { stepNumber: 1, title: "Recall Undo shortcut", explanation: "Undo = Ctrl+Z. Redo (reverse an Undo) = Ctrl+Y. Both are universal shortcuts." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "Ctrl+U = Underline formatting; Ctrl+R = Align Right. These are formatting shortcuts, not Undo.", result: "Answer: (b) Ctrl+Z." },
    ],
    keyConcepts: ["Undo", "Ctrl+Z", "Redo"],
  },

  {
    id: "c9-it-unit3-t2-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "MCQ",
    question: "The keyboard shortcut to open the Find & Replace dialog in LibreOffice Writer is: (a) Ctrl+F  (b) Ctrl+H  (c) Ctrl+G  (d) Ctrl+R",
    hint: "H is for 'replace Here' — Find & Replace uses H.",
    answer: "(b) Ctrl+H. Ctrl+H opens the Find & Replace dialog, which allows searching for a specific word and replacing it with another. Ctrl+F opens the Find toolbar (search only, no replace).",
    steps: [
      { stepNumber: 1, title: "Distinguish Find from Find & Replace", explanation: "Ctrl+F = Find toolbar (searches but does not replace). Ctrl+H = Find & Replace dialog (both find and replace)." },
      { stepNumber: 2, title: "Apply", explanation: "The question asks for Find & Replace = Ctrl+H.", result: "Answer: (b) Ctrl+H." },
    ],
    keyConcepts: ["Find and Replace", "Ctrl+H", "Search"],
  },

  {
    id: "c9-it-unit3-t2-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "How do you select all the text in a document in LibreOffice Writer? State two methods.",
    hint: "There is a keyboard shortcut and a menu option for selecting everything.",
    answer: "Two methods to select all text in LibreOffice Writer: (1) Keyboard shortcut: Press Ctrl+A — this selects all text and objects in the document instantly. (2) Menu method: Click Edit menu → Select All. Both methods highlight all the text, allowing the user to copy, delete, or format the entire document at once.",
    steps: [
      { stepNumber: 1, title: "State method 1 (keyboard)", explanation: "Ctrl+A is the universal 'Select All' shortcut — works in Writer, web browsers, and most applications." },
      { stepNumber: 2, title: "State method 2 (menu)", explanation: "Edit menu → Select All performs the same action through the graphical menu.", result: "Ctrl+A or Edit → Select All." },
    ],
    keyConcepts: ["Select all", "Ctrl+A", "Text selection"],
  },

  {
    id: "c9-it-unit3-t2-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Explain the Find & Replace feature in LibreOffice Writer with one practical example.",
    hint: "Think about a situation where you need to change the same word throughout a long document.",
    answer: "Find & Replace (Ctrl+H) searches for a specific word or phrase anywhere in the document and replaces it with another word or phrase — either one occurrence at a time or all occurrences at once. Practical example: You have typed 'colour' throughout a 10-page report but the editor wants 'color'. Instead of manually finding and changing each instance, you open Find & Replace, type 'colour' in the 'Search For' box, type 'color' in the 'Replace With' box, and click 'Replace All'. Writer replaces every occurrence automatically, saving time and avoiding errors.",
    steps: [
      { stepNumber: 1, title: "Define Find & Replace", explanation: "Find & Replace locates a specified word/phrase and substitutes it with another. It can replace one at a time (Replace) or all at once (Replace All)." },
      { stepNumber: 2, title: "Give a practical example", explanation: "Example: change 'colour' → 'color' throughout a document, or update a company name after rebranding. Click Replace All to do all instances in one step.", result: "A time-saving tool for bulk word changes across long documents." },
    ],
    keyConcepts: ["Find and Replace", "Replace All", "Editing efficiency"],
  },

  {
    id: "c9-it-unit3-t2-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Medium", questionType: "MCQ",
    question: "To select a single word quickly in LibreOffice Writer, you should: (a) Click once at the beginning of the word (b) Double-click on the word (c) Triple-click on the word (d) Click and drag from first to last letter",
    hint: "One specific click method selects exactly a word.",
    answer: "(b) Double-click on the word. Double-clicking on any word in Writer selects that entire word instantly. Triple-click selects the entire paragraph. Single click just moves the cursor.",
    steps: [
      { stepNumber: 1, title: "Recall mouse-click text selection shortcuts", explanation: "Single click = moves cursor only. Double-click = selects one word. Triple-click = selects entire paragraph/line. Click+drag = selects exactly what you drag over." },
      { stepNumber: 2, title: "Apply to the question", explanation: "To select one word quickly: double-click on it.", result: "Answer: (b) Double-click on the word." },
    ],
    keyConcepts: ["Text selection", "Double-click", "Mouse operations"],
  },

  {
    id: "c9-it-unit3-t2-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is AutoCorrect in LibreOffice Writer? Give two examples of what it corrects automatically.",
    hint: "AutoCorrect watches your typing and fixes common errors without you asking.",
    answer: "AutoCorrect is a feature in LibreOffice Writer that automatically detects and corrects common typing errors, spelling mistakes, and certain formatting conventions as the user types. Two examples: (1) Capitalising the first letter of a sentence — if the user types 'the computer is on.', Writer automatically capitalises 'the' to 'The' after a full stop. (2) Correcting common misspellings — for example, if the user types 'teh', AutoCorrect automatically changes it to 'the'. (Other examples: replacing two hyphens with an em dash; correcting accidental use of Caps Lock.)",
    steps: [
      { stepNumber: 1, title: "Define AutoCorrect", explanation: "AutoCorrect runs in the background as you type. It uses a list of known error → correction pairs and applies fixes immediately after you type the error." },
      { stepNumber: 2, title: "Give two examples", explanation: "(1) 'teh' → 'the' (spelling correction). (2) First letter of sentence capitalised automatically. Both are built-in defaults that can be customised.", result: "AutoCorrect = automatic on-the-fly error correction while typing." },
    ],
    keyConcepts: ["AutoCorrect", "Spell check", "Automatic correction"],
  },

  {
    id: "c9-it-unit3-t2-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Medium", questionType: "MCQ",
    question: "Arjun accidentally deleted three paragraphs of his essay. Which action should he take to recover them? (a) Close and reopen the file (b) Use Edit → Undo (Ctrl+Z) multiple times (c) Use Find & Replace (d) Save the document immediately",
    hint: "There is a feature specifically designed to reverse mistakes.",
    answer: "(b) Use Edit → Undo (Ctrl+Z) multiple times. Undo reverses the most recent action. Pressing Ctrl+Z repeatedly will step back through previous actions, recovering the deleted paragraphs, provided the document has not been closed since the deletion.",
    steps: [
      { stepNumber: 1, title: "Identify the correct recovery method", explanation: "Undo (Ctrl+Z) reverses actions in reverse order. Deleting three paragraphs = multiple actions, so multiple Ctrl+Z presses recover them one step at a time." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a) Reopening without saving may lose recent changes. (c) Find & Replace does not restore deleted text. (d) Saving immediately makes the deletion permanent.", result: "Answer: (b) Ctrl+Z multiple times." },
    ],
    keyConcepts: ["Undo", "Recovery", "Editing"],
  },

  {
    id: "c9-it-unit3-t2-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t2", topicName: "Editing a Document",
    difficulty: "Easy", questionType: "MCQ",
    question: "In LibreOffice Writer, the Spell Check feature is used to: (a) Check grammar rules only (b) Detect and highlight words that are not in the dictionary (c) Format the document automatically (d) Convert text to uppercase",
    hint: "Spell Check looks at individual words against a word list.",
    answer: "(b) Detect and highlight words that are not in the dictionary. The Spell Check tool scans the document and underlines (in red) any word not found in its dictionary, suggesting possible correct spellings. It can also check grammar, but its primary function is spell detection.",
    steps: [
      { stepNumber: 1, title: "Recall spell check function", explanation: "Spell Check compares each word against the built-in dictionary. Unrecognised words are underlined in red wavy lines. The user can accept a suggestion, ignore, or add the word to the dictionary." },
      { stepNumber: 2, title: "Identify the correct answer", explanation: "(b) is correct — spell check finds words not in the dictionary. Grammar checking is a separate (though related) function.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Spell check", "Dictionary", "Error detection"],
  },

  // ── Topic 3: Formatting Text and Paragraphs ───────────────────────────────────

  {
    id: "c9-it-unit3-t3-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "MCQ",
    question: "The keyboard shortcut to apply Bold formatting to selected text in LibreOffice Writer is: (a) Ctrl+B  (b) Ctrl+I  (c) Ctrl+U  (d) Ctrl+T",
    hint: "B is for Bold.",
    answer: "(a) Ctrl+B. Ctrl+B applies or removes bold formatting on selected text. Ctrl+I = Italic; Ctrl+U = Underline.",
    steps: [
      { stepNumber: 1, title: "Recall text formatting shortcuts", explanation: "Bold = Ctrl+B. Italic = Ctrl+I. Underline = Ctrl+U. These are the three primary character formatting shortcuts." },
      { stepNumber: 2, title: "Apply to the question", explanation: "Bold is asked — that is Ctrl+B.", result: "Answer: (a) Ctrl+B." },
    ],
    keyConcepts: ["Bold", "Ctrl+B", "Character formatting"],
  },

  {
    id: "c9-it-unit3-t3-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which paragraph alignment option spreads text evenly between both the left and right margins, creating a straight edge on both sides? (a) Left Align  (b) Right Align  (c) Centre Align  (d) Justify",
    hint: "Newspapers and books commonly use this alignment to make columns look neat on both sides.",
    answer: "(d) Justify (also called Full Justify). Justify alignment spreads words across the full line width so that both the left and right edges are straight. Left Align creates a ragged right edge; Right Align creates a ragged left edge; Centre Align centres each line.",
    steps: [
      { stepNumber: 1, title: "Recall the four alignment types", explanation: "Left: text starts at left margin, ragged right. Right: text ends at right margin, ragged left. Centre: text is centred, both margins ragged. Justify: text stretched to fill full width, both margins straight." },
      { stepNumber: 2, title: "Identify Justify", explanation: "Both margins straight = Justify. This is used in newspapers, books, and formal documents.", result: "Answer: (d) Justify." },
    ],
    keyConcepts: ["Paragraph alignment", "Justify", "Formatting"],
  },

  {
    id: "c9-it-unit3-t3-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Name and briefly describe the four types of paragraph alignment available in LibreOffice Writer.",
    hint: "Think about which edge of the page each type aligns to.",
    answer: "The four paragraph alignment types in LibreOffice Writer are: (1) Left Align (Ctrl+L) — text is aligned to the left margin; the right edge is ragged (uneven). (2) Right Align (Ctrl+R) — text is aligned to the right margin; the left edge is ragged. (3) Centre Align (Ctrl+E) — each line of text is centred between the left and right margins. (4) Justify (Ctrl+J) — text is spread to align with both the left and right margins; extra spaces are added between words to fill each line completely.",
    steps: [
      { stepNumber: 1, title: "List all four alignment types with shortcuts", explanation: "Left = Ctrl+L, Right = Ctrl+R, Centre = Ctrl+E, Justify = Ctrl+J. All four are available in the Formatting Toolbar and Format → Paragraph menu." },
      { stepNumber: 2, title: "Describe each briefly", explanation: "Each type controls how text lines up against the page margins. Describe which margin(s) each type aligns to and whether edges are straight or ragged.", result: "All four types named and described = full marks." },
    ],
    keyConcepts: ["Alignment", "Left", "Right", "Centre", "Justify"],
  },

  {
    id: "c9-it-unit3-t3-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "MCQ",
    question: "Font size in LibreOffice Writer is measured in: (a) Pixels  (b) Centimetres  (c) Points  (d) Inches",
    hint: "Typography uses a unit smaller than a millimetre.",
    answer: "(c) Points (pt). Font size is measured in typographic points. One point is approximately 1/72 of an inch. Common sizes are 10pt, 11pt, 12pt (body text) and 14–36pt (headings).",
    steps: [
      { stepNumber: 1, title: "Recall the unit of font size", explanation: "Font size is measured in points (pt), a typographic unit. 72 points = 1 inch. A 12pt font is standard for body text." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "Pixels are screen display units (not for print typography). Centimetres and inches are used for page/margin sizes, not font sizes.", result: "Answer: (c) Points." },
    ],
    keyConcepts: ["Font size", "Points", "Typography"],
  },

  {
    id: "c9-it-unit3-t3-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is indentation in LibreOffice Writer? Name and explain any two types of indentation.",
    hint: "Indentation moves text inward from one or both margins.",
    answer: "Indentation is the space added between the paragraph text and the left or right margin of the page. It is used to visually separate paragraphs or create structured layouts. Two types of indentation: (1) First-line indent — only the first line of the paragraph is indented (moved to the right), while the remaining lines start at the left margin. Used to mark the start of a new paragraph. (2) Hanging indent — the first line starts at the left margin, while all subsequent lines of the paragraph are indented. Commonly used in bibliographies and bullet lists. (Other types: Left indent — all lines moved away from the left margin; Right indent — all lines moved away from the right margin.)",
    steps: [
      { stepNumber: 1, title: "Define indentation", explanation: "Indentation = distance between the paragraph edge and the page margin. Controlled via Format → Paragraph or the Ruler." },
      { stepNumber: 2, title: "Describe two types", explanation: "First-line indent: only line 1 is indented inward. Hanging indent: line 1 at left, rest indented. Both are set in Format → Paragraph → Indents & Spacing.", result: "Any two correctly named and described types earn full marks." },
    ],
    keyConcepts: ["Indentation", "First-line indent", "Hanging indent"],
  },

  {
    id: "c9-it-unit3-t3-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Medium", questionType: "MCQ",
    question: "In LibreOffice Writer, 'Line Spacing' refers to: (a) The space between individual characters in a word (b) The vertical space between lines of text within a paragraph (c) The horizontal distance between the left and right margins (d) The distance between the top of the page and the first line of text",
    hint: "Line spacing controls how 'crowded' or 'airy' the lines of a paragraph look.",
    answer: "(b) The vertical space between lines of text within a paragraph. Line spacing (e.g. Single, 1.5 Lines, Double) controls the vertical gap between consecutive lines in a paragraph. It is set via Format → Paragraph → Indents & Spacing.",
    steps: [
      { stepNumber: 1, title: "Define line spacing", explanation: "Line spacing = vertical gap between lines in a paragraph. Single spacing (1.0) is the default. Double spacing (2.0) is often required for academic assignments." },
      { stepNumber: 2, title: "Eliminate distractors", explanation: "(a) is character/letter spacing; (c) is text width/column width; (d) is the top margin setting.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Line spacing", "Paragraph formatting"],
  },

  {
    id: "c9-it-unit3-t3-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the difference between character formatting and paragraph formatting in LibreOffice Writer? Give one example of each.",
    hint: "One affects individual characters; the other affects the entire paragraph.",
    answer: "Character formatting applies to individual characters or selected words/phrases and changes their appearance. Example: making a single word Bold, changing its font to 'Arial', or changing its colour to red. Paragraph formatting applies to an entire paragraph and controls its layout and spacing. Example: setting the paragraph alignment to 'Justify', adding a first-line indent, or setting line spacing to 1.5 Lines. Key distinction: character formatting can be applied to even one letter without affecting the rest of the paragraph; paragraph formatting applies to the entire paragraph, even if only the cursor is placed inside it (no need to select text).",
    steps: [
      { stepNumber: 1, title: "Define character formatting", explanation: "Character (text) formatting: changes appearance of selected characters. Options: font, size, bold, italic, underline, colour, highlight. Can apply to a single character." },
      { stepNumber: 2, title: "Define paragraph formatting", explanation: "Paragraph formatting: affects the whole paragraph block. Options: alignment, indentation, line spacing, bullets/numbering, borders. Applies when cursor is anywhere in the paragraph.", result: "Character = individual text appearance; Paragraph = block layout and spacing." },
    ],
    keyConcepts: ["Character formatting", "Paragraph formatting", "Formatting types"],
  },

  {
    id: "c9-it-unit3-t3-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Medium", questionType: "MCQ",
    question: "To change the page margins in LibreOffice Writer, you go to: (a) Insert → Margins  (b) Format → Page Style  (c) View → Ruler  (d) Tools → Options → Margins",
    hint: "Page-level settings are under the Format menu.",
    answer: "(b) Format → Page Style. In LibreOffice Writer, page margins, page size, and page orientation are all set through Format → Page Style → Page tab. You can set top, bottom, left, and right margins there.",
    steps: [
      { stepNumber: 1, title: "Identify where page settings are", explanation: "Page-level settings (margins, size, orientation) are under Format → Page Style in LibreOffice Writer. The Page tab shows margin controls." },
      { stepNumber: 2, title: "Eliminate distractors", explanation: "(a) Insert has headers/footers/page breaks but not margins. (c) View → Ruler shows/hides the ruler. (d) Tools → Options is for application preferences, not document margins.", result: "Answer: (b) Format → Page Style." },
    ],
    keyConcepts: ["Page margins", "Format → Page Style", "Page formatting"],
  },

  {
    id: "c9-it-unit3-t3-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What is a Header and a Footer in LibreOffice Writer? State one use of each.",
    hint: "They appear at the top and bottom of every page.",
    answer: "Header: A region at the top of every page (above the main body text) where the same content is printed on all pages automatically. Example use: Adding the document title or chapter name at the top of every page. Footer: A region at the bottom of every page (below the main body text) where the same content appears on all pages automatically. Example use: Adding page numbers at the bottom of every page. Headers and footers are inserted via Insert → Header and Footer menu in LibreOffice Writer.",
    steps: [
      { stepNumber: 1, title: "Define Header", explanation: "Header = top section of every page. Content typed here repeats on all pages. Common uses: document title, author name, chapter heading." },
      { stepNumber: 2, title: "Define Footer", explanation: "Footer = bottom section of every page. Common uses: page numbers, date, copyright notice.", result: "Header = top of every page; Footer = bottom of every page. Both repeat automatically." },
    ],
    keyConcepts: ["Header", "Footer", "Page formatting"],
  },

  {
    id: "c9-it-unit3-t3-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "MCQ",
    question: "Landscape orientation of a page means: (a) The page is taller than it is wide (b) The page is wider than it is tall (c) The page is square (d) The page is rotated by 45 degrees",
    hint: "Landscape is how a painting of mountains/fields is usually framed — wide.",
    answer: "(b) The page is wider than it is tall. Landscape orientation has the longer dimension horizontal (width > height). Portrait orientation (default) has the longer dimension vertical (height > width). Landscape is useful for wide tables, charts, or timelines.",
    steps: [
      { stepNumber: 1, title: "Recall orientation types", explanation: "Portrait: vertical (taller than wide) — default for letters and essays. Landscape: horizontal (wider than tall) — used for tables, spreadsheets, certificates." },
      { stepNumber: 2, title: "Apply to the question", explanation: "Landscape = wider than tall. The word 'landscape' itself comes from wide-format landscape paintings.", result: "Answer: (b) The page is wider than it is tall." },
    ],
    keyConcepts: ["Landscape", "Portrait", "Page orientation"],
  },

  {
    id: "c9-it-unit3-t3-q11", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "How do you add a bulleted list to a paragraph in LibreOffice Writer? Describe the steps.",
    hint: "There is a toolbar button and a menu option.",
    answer: "To add a bulleted list in LibreOffice Writer: (1) Type the list items (or select existing text you want to convert into a list). (2) Select all the lines you want to make into a bulleted list. (3) Click the 'Toggle Unordered List' (bullet) button in the Formatting Toolbar (it looks like three lines with dots), OR go to Format → Bullets and Numbering → Unordered Lists tab and choose a bullet style. (4) Each selected line becomes a bulleted list item. To remove bullets, select the list and click the same toolbar button again (it is a toggle).",
    steps: [
      { stepNumber: 1, title: "Select the text", explanation: "Select all lines to be bulleted, or position cursor on one line for a single bullet." },
      { stepNumber: 2, title: "Apply the bullet", explanation: "Click the bullet icon in the Formatting Toolbar (quickest), OR use Format → Bullets and Numbering for more style options.", result: "Selected text is converted into a bulleted list. Click again to remove bullets." },
    ],
    keyConcepts: ["Bullets", "Unordered list", "Formatting Toolbar"],
  },

  {
    id: "c9-it-unit3-t3-q12", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t3", topicName: "Formatting Text and Paragraphs",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which toolbar in LibreOffice Writer contains the Bold, Italic, Underline buttons and the font name/size selectors? (a) Standard Toolbar  (b) Drawing Toolbar  (c) Formatting Toolbar  (d) Navigator Toolbar",
    hint: "The toolbar name describes what it does — it formats text.",
    answer: "(c) Formatting Toolbar. The Formatting Toolbar contains text formatting controls: font name, font size, Bold, Italic, Underline, font colour, alignment buttons, and list buttons. The Standard Toolbar contains file operations (New, Open, Save, Print, etc.).",
    steps: [
      { stepNumber: 1, title: "Distinguish Standard from Formatting Toolbar", explanation: "Standard Toolbar = file-level operations (New, Open, Save, Cut, Copy, Paste, Undo). Formatting Toolbar = text appearance (font, size, bold, italic, underline, alignment)." },
      { stepNumber: 2, title: "Apply to the question", explanation: "Bold/Italic/Underline and font controls = Formatting Toolbar.", result: "Answer: (c) Formatting Toolbar." },
    ],
    keyConcepts: ["Formatting Toolbar", "Standard Toolbar", "Writer interface"],
  },

  // ── Topic 4: Tables in LibreOffice Writer ─────────────────────────────────────

  {
    id: "c9-it-unit3-t4-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which menu option is used to insert a table in LibreOffice Writer? (a) Format → Table  (b) Insert → Table  (c) Tools → Table  (d) View → Table",
    hint: "Inserting new content goes through the Insert menu.",
    answer: "(b) Insert → Table. To insert a table, go to Insert menu → Table, specify the number of rows and columns, and click Insert/OK. The keyboard shortcut is also Ctrl+F12 in some versions.",
    steps: [
      { stepNumber: 1, title: "Recall the Insert menu purpose", explanation: "The Insert menu is used to add new elements to a document: tables, images, headers/footers, page breaks, special characters, etc." },
      { stepNumber: 2, title: "Identify the correct path", explanation: "Insert → Table opens a dialog to set rows and columns. Format menu is for styling existing content, not inserting new objects.", result: "Answer: (b) Insert → Table." },
    ],
    keyConcepts: ["Insert table", "Table creation"],
  },

  {
    id: "c9-it-unit3-t4-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "How do you move from one cell to the next cell in a table in LibreOffice Writer? Name two ways.",
    hint: "One uses a special key; the other uses arrow keys.",
    answer: "Two ways to move between cells in a LibreOffice Writer table: (1) Tab key — pressing Tab moves the cursor to the next cell to the right. When the cursor is in the last cell of a row, Tab moves it to the first cell of the next row. Pressing Tab in the last cell of the table automatically adds a new row. (2) Arrow keys — pressing the Right arrow key moves to the next cell; Left arrow to the previous cell; Down arrow to the cell below; Up arrow to the cell above.",
    steps: [
      { stepNumber: 1, title: "State Tab key method", explanation: "Tab = move to next cell (right, then down to next row). Shift+Tab = move to previous cell. Tab in last cell = adds a new row automatically." },
      { stepNumber: 2, title: "State arrow key method", explanation: "Arrow keys navigate cell by cell in any direction (up, down, left, right).", result: "Tab key and Arrow keys are the two main navigation methods in a table." },
    ],
    keyConcepts: ["Table navigation", "Tab key", "Arrow keys"],
  },

  {
    id: "c9-it-unit3-t4-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "MCQ",
    question: "What does 'merging cells' in a table mean? (a) Splitting one cell into two cells (b) Combining two or more adjacent cells into a single larger cell (c) Deleting a row from the table (d) Adding a new column to the table",
    hint: "Merging brings multiple cells together to form one.",
    answer: "(b) Combining two or more adjacent cells into a single larger cell. Merging removes the boundaries between selected adjacent cells, creating one larger cell that spans multiple columns or rows. It is commonly used for a heading row that spans all columns.",
    steps: [
      { stepNumber: 1, title: "Define merging cells", explanation: "Select two or more adjacent cells → right-click → Merge Cells (or Table menu → Merge Cells). The selected cells become one cell. Content of all cells is combined." },
      { stepNumber: 2, title: "State its common use", explanation: "Merging is used to create a header cell that spans the full width of the table (e.g., a title row). It is the opposite of splitting.", result: "Answer: (b) Combining adjacent cells into a single larger cell." },
    ],
    keyConcepts: ["Merge cells", "Table formatting"],
  },

  {
    id: "c9-it-unit3-t4-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Priya is creating a timetable in LibreOffice Writer. She wants the heading 'Class Timetable' to span all 6 columns of the first row. What feature should she use and how?",
    hint: "This feature combines multiple cells into one wider cell.",
    answer: "Priya should use the Merge Cells feature. Steps: (1) In the first row of the table, select all 6 cells across the row by clicking the first cell and dragging to the last cell in that row. (2) Right-click on the selection and choose 'Merge Cells', OR go to Table menu → Merge Cells. (3) The 6 cells in the first row become one single wide cell spanning all columns. (4) Type 'Class Timetable' in the merged cell and centre it using Ctrl+E or the Centre Align button.",
    steps: [
      { stepNumber: 1, title: "Identify the feature", explanation: "A cell spanning multiple columns = merged cell. Select the cells you want to merge first." },
      { stepNumber: 2, title: "State the steps", explanation: "(1) Select the 6 cells in row 1. (2) Right-click → Merge Cells or Table menu → Merge Cells. (3) Type the heading in the merged cell. (4) Centre-align the heading text.", result: "Merge Cells + Centre Align gives a professional table heading that spans all columns." },
    ],
    keyConcepts: ["Merge cells", "Table heading", "Practical application"],
  },

  {
    id: "c9-it-unit3-t4-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Easy", questionType: "MCQ",
    question: "When the cursor is in the last cell of a table and you press the Tab key in LibreOffice Writer, what happens? (a) The cursor moves to the first cell of the table (b) A new row is automatically added at the bottom of the table (c) The table is closed (d) Nothing happens",
    hint: "Tab is designed to make adding new rows quick and convenient.",
    answer: "(b) A new row is automatically added at the bottom of the table. Pressing Tab when the cursor is in the last cell (bottom-right cell) of a table creates a new empty row below and moves the cursor to its first cell. This is the easiest way to extend a table row by row.",
    steps: [
      { stepNumber: 1, title: "Recall Tab behaviour in tables", explanation: "Tab in any cell except the last = moves to next cell. Tab in the LAST cell of the table = adds a new row at the bottom automatically." },
      { stepNumber: 2, title: "Apply to the question", explanation: "The question states the cursor is in the last cell. Pressing Tab here creates a new row.", result: "Answer: (b) A new row is automatically added at the bottom." },
    ],
    keyConcepts: ["Table navigation", "Tab key", "Adding rows"],
  },

  {
    id: "c9-it-unit3-t4-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "How do you insert a new row above the current row in a table in LibreOffice Writer?",
    hint: "Right-clicking in a table gives you row and column options.",
    answer: "To insert a new row above the current row in a LibreOffice Writer table: (1) Click inside the row above which you want to insert a new row (so the cursor is positioned in that row). (2) Right-click to open the context menu, then choose Rows → Insert Above. OR go to the Table menu → Insert → Rows Above. (3) A new empty row is inserted above the current row, and all existing rows shift down. (Alternative shortcut: In some versions, the Table menu provides Insert Rows Above directly.)",
    steps: [
      { stepNumber: 1, title: "Position the cursor", explanation: "Click any cell in the row above which the new row should appear." },
      { stepNumber: 2, title: "Insert the row", explanation: "Right-click → Rows → Insert Above (context menu). OR Table menu → Insert → Rows Above.", result: "A new blank row is added immediately above the current row." },
    ],
    keyConcepts: ["Insert row", "Table editing", "Context menu"],
  },

  {
    id: "c9-it-unit3-t4-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "MCQ",
    question: "Splitting a cell in a table means: (a) Merging it with the cell next to it (b) Dividing one cell into two or more smaller cells (c) Deleting the cell and its content (d) Moving the cell to a different location in the table",
    hint: "Split = divide into parts.",
    answer: "(b) Dividing one cell into two or more smaller cells. The Split Cells feature divides a selected cell into multiple rows or columns within the same cell space. It is the opposite of Merge Cells and is done via Table → Split Cells or right-click → Split Cells.",
    steps: [
      { stepNumber: 1, title: "Define Split Cells", explanation: "Split Cells divides a cell into smaller cells. A dialog asks how many rows or columns to split into." },
      { stepNumber: 2, title: "Distinguish from Merge", explanation: "Merge = combine multiple cells → one. Split = divide one cell → multiple. They are opposite operations.", result: "Answer: (b) Dividing one cell into two or more smaller cells." },
    ],
    keyConcepts: ["Split cells", "Table editing"],
  },

  {
    id: "c9-it-unit3-t4-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Explain how you can change the border style of a table in LibreOffice Writer.",
    hint: "Table borders are controlled through the Table Properties dialog.",
    answer: "To change the border style of a table in LibreOffice Writer: (1) Click anywhere inside the table. (2) Go to Table menu → Table Properties (or right-click → Table Properties). (3) Click the 'Borders' tab in the Table Properties dialog. (4) Here, you can: choose which borders to show (all borders, outer border only, none, etc.); select the line style (solid, dashed, dotted, etc.); choose the line width/thickness; pick a border colour. (5) Click OK to apply the changes. (Alternative: select all cells and use the Borders button in the Formatting Toolbar for quick border options.)",
    steps: [
      { stepNumber: 1, title: "Open Table Properties", explanation: "Right-click inside the table → Table Properties (or Table menu → Table Properties). The Borders tab controls all border settings." },
      { stepNumber: 2, title: "Set border style", explanation: "Choose line style, width, colour, and which borders to show. Apply to all cells or selected cells.", result: "Table Properties → Borders tab → choose style, width, colour → OK." },
    ],
    keyConcepts: ["Table borders", "Table Properties", "Table formatting"],
  },

  {
    id: "c9-it-unit3-t4-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "MCQ",
    question: "To delete an entire table in LibreOffice Writer, you should: (a) Select the table and press the Delete key (b) Select the table, then go to Table → Delete → Table (c) Right-click a cell and choose 'Delete Cell' (d) Press Ctrl+Delete",
    hint: "The Delete key on its own does not delete a table — you need the Table menu.",
    answer: "(b) Select the table, then go to Table → Delete → Table. Pressing the Delete key only clears the content of selected cells without removing the table structure. To delete the entire table including its structure, use the Table menu → Delete → Table.",
    steps: [
      { stepNumber: 1, title: "Explain why Delete key alone is insufficient", explanation: "The Delete key deletes the content inside cells but leaves the empty table structure in the document." },
      { stepNumber: 2, title: "State the correct method", explanation: "Click inside the table → Table menu → Delete → Table. This removes the entire table (structure + content) from the document.", result: "Answer: (b) Table → Delete → Table." },
    ],
    keyConcepts: ["Delete table", "Table menu", "Table operations"],
  },

  {
    id: "c9-it-unit3-t4-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t4", topicName: "Tables in LibreOffice Writer",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the AutoFormat feature for tables in LibreOffice Writer? How does it help a student?",
    hint: "AutoFormat applies a ready-made professional design to a table instantly.",
    answer: "AutoFormat for tables is a feature in LibreOffice Writer that applies a pre-designed set of formatting (colours, borders, fonts, shading) to a table in a single step, instead of manually setting each property. How to use: Click inside the table → Table menu → AutoFormat Styles → choose a style from the gallery → click OK. How it helps a student: (1) Saves time — instead of setting borders, colours, and fonts one by one, a professional design is applied instantly. (2) Ensures consistency — all cells are formatted uniformly. (3) Makes documents look neat and presentable without advanced formatting knowledge.",
    steps: [
      { stepNumber: 1, title: "Define AutoFormat", explanation: "AutoFormat = pre-built table formatting templates. Each style includes border, shading, font formatting for header rows, data rows, etc." },
      { stepNumber: 2, title: "State the benefit", explanation: "Saves time, looks professional, requires no manual cell-by-cell formatting. Ideal for quickly producing neat tables in assignments.", result: "AutoFormat = one-click professional table styling." },
    ],
    keyConcepts: ["AutoFormat", "Table formatting", "Table styles"],
  },

  // ── Topic 5: Mail Merge ───────────────────────────────────────────────────────

  {
    id: "c9-it-unit3-t5-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Easy", questionType: "MCQ",
    question: "Mail Merge is a feature in LibreOffice Writer that is used to: (a) Send emails directly from Writer (b) Create multiple personalised copies of a standard document by combining it with a data source (c) Merge two separate document files into one (d) Convert a document into a PDF automatically",
    hint: "Think about sending the same letter to 100 different people with each person's name printed correctly.",
    answer: "(b) Create multiple personalised copies of a standard document by combining it with a data source. Mail Merge combines a main document (template) with a data source (e.g. a list of names and addresses) to produce many copies of the document, each personalised with data from one record in the list.",
    steps: [
      { stepNumber: 1, title: "Define Mail Merge", explanation: "Mail Merge = a main document (with placeholders called merge fields) + a data source (list of records). Writer combines them to produce one personalised document per record." },
      { stepNumber: 2, title: "Identify the correct option", explanation: "(b) matches exactly — personalised copies from a template + data source. The other options describe unrelated features.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Mail Merge", "Personalised documents", "Data source"],
  },

  {
    id: "c9-it-unit3-t5-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What are the two main components required to perform a Mail Merge in LibreOffice Writer?",
    hint: "One is the template document; the other is the list of data.",
    answer: "The two main components of Mail Merge are: (1) Main Document (also called the Form Letter or Template) — the standard document that contains the fixed text (the same for all recipients) and placeholders called Merge Fields (e.g. «Name», «Address») where personalised data will be inserted. (2) Data Source (also called the Data File or Address Book) — a file (such as a spreadsheet or database table) that contains the list of records with the actual data values (e.g. names, addresses, phone numbers) to be inserted into the merge fields. During mail merge, Writer pairs each record from the data source with the main document and creates one personalised copy per record.",
    steps: [
      { stepNumber: 1, title: "Name and describe the Main Document", explanation: "Main Document = fixed template text + merge field placeholders. Created in Writer. Used as the letter/form that is repeated for each recipient." },
      { stepNumber: 2, title: "Name and describe the Data Source", explanation: "Data Source = table/spreadsheet with one row per recipient. Columns = Name, Address, etc. Writer reads one row at a time and fills in the merge fields.", result: "Main Document (template with merge fields) + Data Source (list of records) = Mail Merge." },
    ],
    keyConcepts: ["Main document", "Data source", "Mail Merge components"],
  },

  {
    id: "c9-it-unit3-t5-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Easy", questionType: "MCQ",
    question: "In a Mail Merge data source, each row of data represents: (a) A merge field name (b) A column heading (c) One record (e.g. information about one person) (d) One page of the final merged document",
    hint: "Think of the data source as a table — each row is one person's details.",
    answer: "(c) One record (e.g. information about one person). In the data source file, each row after the heading row represents one complete record — all the information about one recipient. The column headings (first row) become the field names used in the merge fields of the main document.",
    steps: [
      { stepNumber: 1, title: "Recall the structure of a data source", explanation: "Data source is like a table: Row 1 = column headings (field names: Name, Address, City...). Row 2 onwards = one record per row (one person's data per row)." },
      { stepNumber: 2, title: "Apply to the question", explanation: "Each row (after the heading row) = one record = one person's information. Writer produces one merged document per row.", result: "Answer: (c) One record." },
    ],
    keyConcepts: ["Data source", "Record", "Mail Merge"],
  },

  {
    id: "c9-it-unit3-t5-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What are merge fields in Mail Merge? Give two examples of merge fields that might be used in a school invitation letter.",
    hint: "Merge fields are placeholders that get replaced by real data when the merge is done.",
    answer: "Merge fields are placeholders inserted into the main document at the locations where personalised data should appear. They are usually shown in double angle brackets (e.g. «StudentName», «Class»). When the mail merge is executed, Writer replaces each merge field with the actual data from the corresponding column of the data source for that record. Two examples of merge fields in a school invitation letter: (1) «StudentName» — replaced by the actual student's name (e.g. 'Priya Sharma') in each printed copy. (2) «Class» — replaced by the student's class (e.g. 'Class 9A') in each copy. Other examples: «ParentName», «RollNumber», «Date».",
    steps: [
      { stepNumber: 1, title: "Define merge fields", explanation: "Merge fields = placeholders in the main document that mark where personalised data will go. Each field name matches a column header in the data source." },
      { stepNumber: 2, title: "Give two examples in context", explanation: "For a school invitation: «StudentName» and «Class» are sensible fields — every letter will be identical except these values, which come from the data source.", result: "Merge fields = personalised placeholders; examples: «StudentName», «Class»." },
    ],
    keyConcepts: ["Merge fields", "Placeholders", "Mail Merge"],
  },

  {
    id: "c9-it-unit3-t5-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Easy", questionType: "MCQ",
    question: "A school wants to send the same Annual Day invitation letter to 200 students, with each letter addressed to a different student. The most efficient way to do this in LibreOffice Writer is: (a) Type each letter separately 200 times (b) Use Copy and Paste 200 times and change names manually (c) Use the Mail Merge feature (d) Use the Track Changes feature",
    hint: "One feature is specifically designed for sending the same document to many people with personalised details.",
    answer: "(c) Use the Mail Merge feature. Mail Merge creates 200 personalised letters automatically by combining one template letter with a data file containing 200 student names and addresses. It eliminates manual repetition and errors.",
    steps: [
      { stepNumber: 1, title: "Identify the scenario", explanation: "Same letter, 200 recipients, personalised name in each = classic mail merge scenario." },
      { stepNumber: 2, title: "Eliminate wrong options", explanation: "(a) and (b) are manual and time-consuming — 200 repetitions with manual changes. (d) Track Changes is for editing/reviewing a document collaboratively, not for personalised copies.", result: "Answer: (c) Mail Merge." },
    ],
    keyConcepts: ["Mail Merge", "Practical application", "Efficiency"],
  },

  {
    id: "c9-it-unit3-t5-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "List the main steps to perform a Mail Merge in LibreOffice Writer.",
    hint: "The steps go from creating the template, connecting the data, inserting fields, to merging.",
    answer: "Main steps to perform Mail Merge in LibreOffice Writer: (1) Create the Main Document — type the standard letter in LibreOffice Writer, leaving spaces where personalised data will go. (2) Connect a Data Source — go to Tools → Mail Merge Wizard or View → Data Sources and connect/register a data source (e.g. a Calc spreadsheet or Writer data file) containing the recipient records. (3) Insert Merge Fields — place the cursor where personalised data should appear, then insert merge fields (Insert → Field → More Fields, or using the Mail Merge Toolbar) corresponding to the data source columns (e.g. «Name», «Address»). (4) Preview the Merge — use the Mail Merge Wizard or toolbar to preview how the document looks with actual data from each record. (5) Complete the Merge — merge to a new document (creates individual documents) or directly to the printer to print all copies. (6) Save/Print — save the merged document or send to printer.",
    steps: [
      { stepNumber: 1, title: "Steps 1–3: Prepare and connect", explanation: "(1) Create main document. (2) Connect data source (spreadsheet/table with recipient data). (3) Insert merge fields at personalised locations." },
      { stepNumber: 2, title: "Steps 4–6: Preview and finish", explanation: "(4) Preview merged result. (5) Execute the merge — to new document or directly to printer. (6) Save or print final output.", result: "Six key steps: create → connect → insert fields → preview → merge → save/print." },
    ],
    keyConcepts: ["Mail Merge steps", "Merge Wizard", "Data source", "Merge fields"],
  },

  {
    id: "c9-it-unit3-t5-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Medium", questionType: "MCQ",
    question: "After performing a Mail Merge in LibreOffice Writer and choosing 'Merge to New Document', the result is: (a) One document with all merged letters combined, one after another, each on a new page (b) A separate file saved for each individual recipient (c) The data source file updated with new entries (d) A PDF automatically emailed to each recipient",
    hint: "Merge to New Document creates a single file you can review before printing.",
    answer: "(a) One document with all merged letters combined, one after another, each on a new page. 'Merge to New Document' creates a single new Writer document containing all personalised copies — one per page (or separated by page breaks). This lets the user review all copies before printing. Each copy has the personalised data filled in where the merge fields were.",
    steps: [
      { stepNumber: 1, title: "Recall 'Merge to New Document' outcome", explanation: "This option creates one large document where all individual personalised letters appear consecutively, separated by page breaks. The user can scroll through and edit any specific copy before printing." },
      { stepNumber: 2, title: "Distinguish from 'Merge to Printer'", explanation: "'Merge to Printer' sends all merged copies directly to the printer without creating a document file first.", result: "Answer: (a) One combined document with all letters, each on a new page." },
    ],
    keyConcepts: ["Mail Merge", "Merge to new document", "Merge output"],
  },

  {
    id: "c9-it-unit3-t5-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit3", chapterName: "Digital Documentation",
    topicId: "t5", topicName: "Mail Merge",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Give two practical real-life uses of Mail Merge, other than sending invitation letters.",
    hint: "Think of situations where many people receive the same document with their own details filled in.",
    answer: "Two practical real-life uses of Mail Merge (other than invitation letters): (1) Mark sheets / Report cards — a school uses Mail Merge to create individual progress report cards for each student. The main document is the report template; the data source contains each student's marks and grades. Each student's report is automatically generated with their name and scores filled in. (2) Certificates — after a competition or training programme, organisers use Mail Merge to generate participation or achievement certificates for each participant, personalised with the participant's name and the event details. (Other valid examples: payslips for employees, admit cards for examinations, personalised notices to parents.)",
    steps: [
      { stepNumber: 1, title: "Think of scenarios with same document + different names/data", explanation: "Mail Merge suits any situation where the same layout is needed for many recipients with different personalised details." },
      { stepNumber: 2, title: "State two examples clearly", explanation: "(1) Mark sheets / report cards with student-specific marks. (2) Certificates with participant names. Both require the same template filled differently per person.", result: "Any two valid real-life uses of mail merge accepted." },
    ],
    keyConcepts: ["Mail Merge applications", "Practical uses", "Real-life scenarios"],
  },

];
