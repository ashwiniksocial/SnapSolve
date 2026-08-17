// @frozen — Information Technology 402 Unit 2: Data Entry and Keyboarding Skills — 50 questions, validated 2026-08-17 (1 REVIEWER_UNCERTAINTY resolved: t3-q06 answer restructured to present four operations clearly)
import type { Question, ChapterMeta } from "./types";

export const CHAPTER_META: ChapterMeta = {
  id: "it402-unit2",
  name: "Data Entry and Keyboarding Skills",
  classNum: 9,
  subject: "Information Technology",
  canonicalChapterId: "402-IT-IX-unit2",
  curriculumStatus: "ACTIVE",
  topics: [
    { id: "t1", name: "Keyboard Basics",                    questionCount: 12 },
    { id: "t2", name: "Finger Placement and Touch Typing",  questionCount: 10 },
    { id: "t3", name: "Mouse Operations",                   questionCount: 8  },
    { id: "t4", name: "Typing Ergonomics",                  questionCount: 10 },
    { id: "t5", name: "Rapid Typing Tutor",                 questionCount: 10 },
  ],
};

export const QUESTIONS: Question[] = [

  // ── Topic 1: Keyboard Basics ─────────────────────────────────────────────────

  {
    id: "c9-it-unit2-t1-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "Which type of keys on a keyboard includes all the alphabets (A–Z) and numbers (0–9)? (a) Function keys  (b) Alphanumeric keys  (c) Punctuation keys  (d) Navigation keys",
    hint: "Think about what 'alpha' and 'numeric' mean — letters and numbers.",
    answer: "(b) Alphanumeric keys. The NCERT IT 402 textbook defines alphanumeric keys as all of the alphabet (A–Z) and numbers (0–9) on the keyboard.",
    steps: [
      { stepNumber: 1, title: "Recall textbook definition", explanation: "'Alphanumeric' combines 'alpha' (letters) and 'numeric' (numbers). The textbook explicitly states: 'Alphanumeric keys: All of the alphabet (A-Z) and numbers (0-9) on the keyboard.'" },
      { stepNumber: 2, title: "Eliminate other options", explanation: "Function keys are F1–F12. Punctuation keys are ,  .  ;  {}  etc. 'Navigation keys' is not a textbook category.", result: "Answer: (b) Alphanumeric keys." },
    ],
    keyConcepts: ["Types of keys", "Alphanumeric keys"],
  },

  {
    id: "c9-it-unit2-t1-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "What does the Backspace key do? (a) Deletes the character to the right of the cursor  (b) Deletes the character just to the left of the cursor and moves the cursor to that position  (c) Moves the cursor one line up  (d) Clears the entire line",
    hint: "Think about which direction Backspace goes — left or right?",
    answer: "(b) Deletes the character just to the left of the cursor and moves the cursor to that position.",
    steps: [
      { stepNumber: 1, title: "Recall Backspace function", explanation: "The NCERT textbook states: 'Backspace key: Deletes the character just to the left of the cursor (or insertion point) and moves the cursor to that position.'" },
      { stepNumber: 2, title: "Compare with Delete key", explanation: "Delete key removes the character at (or to the right of) the current cursor position but does NOT move the cursor. Backspace moves left and deletes.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Backspace key", "Deleting text"],
  },

  {
    id: "c9-it-unit2-t1-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "The Delete key on a keyboard: (a) Deletes the character to the left of the cursor  (b) Deletes the character at the current cursor position and moves the cursor one step right  (c) Deletes the character at the current cursor position (or to the right of the insertion point) without moving the cursor  (d) Clears the entire document",
    hint: "Unlike Backspace, Delete works in the other direction.",
    answer: "(c) Deletes the character at the current cursor position (or to the right of the insertion point) without moving the cursor. In graphics-based applications, it deletes the character to the right of the insertion point.",
    steps: [
      { stepNumber: 1, title: "Recall Delete key function", explanation: "The NCERT textbook states: 'Delete key: The Del key deletes the character at the current cursor position… but does not move the cursor. For graphics-based applications, the delete key deletes the character to the right of the insertion point.'" },
      { stepNumber: 2, title: "Key difference from Backspace", explanation: "Backspace: deletes LEFT of cursor and moves cursor there. Delete: deletes at/RIGHT of cursor, cursor stays in place.", result: "Answer: (c)." },
    ],
    keyConcepts: ["Delete key", "Deleting text"],
  },

  {
    id: "c9-it-unit2-t1-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What are 'home keys'? State the home keys for the left hand and the right hand.",
    hint: "Home keys are the keys where fingers rest naturally on the keyboard middle row.",
    answer: "Home keys are the keys on which the fingers are placed at rest (starting position) when typing. Left hand home keys: A, S, D, F. Right hand home keys: J, K, L, ; (semicolon). The fingers are trained to return to these home keys immediately after striking any other key.",
    steps: [
      { stepNumber: 1, title: "Define home keys", explanation: "Home keys are the resting/starting position for fingers on the keyboard. They are on the middle (home) row." },
      { stepNumber: 2, title: "Name each hand's home keys", explanation: "Left hand: A S D F (little finger on A, ring on S, middle on D, index on F). Right hand: J K L ; (index on J, middle on K, ring on L, little finger on ;).", result: "Left: ASDF. Right: JKL; (semicolon)." },
    ],
    keyConcepts: ["Home keys", "Finger placement", "Home row"],
  },

  {
    id: "c9-it-unit2-t1-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "What are 'guide keys'? Which keys serve as guide keys on a standard keyboard and why?",
    hint: "Guide keys help you find the home position without looking at the keyboard.",
    answer: "Guide keys are the keys 'F' and 'J' on the keyboard. They serve as guide keys for the left hand and right hand, respectively. Both F and J have a small raised tangible mark (a bump or ridge) on their surface. With the help of these marks, a touch typist can place the fingers correctly on the home keys (ASDF for left, JKL; for right) without looking at the keyboard.",
    steps: [
      { stepNumber: 1, title: "Define guide keys", explanation: "Guide keys are special keys that have a physical raised mark to help position fingers." },
      { stepNumber: 2, title: "Identify which keys", explanation: "F = guide key for left hand; J = guide key for right hand. Both have small raised marks.", result: "Guide keys: F (left hand) and J (right hand), both with raised tangible marks." },
    ],
    keyConcepts: ["Guide keys", "F and J keys", "Touch typing", "Raised marks"],
  },

  {
    id: "c9-it-unit2-t1-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "Where is the numeric keypad normally located on a computer keyboard? (a) Top of the keyboard  (b) Left-hand side  (c) Centre of the keyboard  (d) Right-hand side",
    hint: "Think about which side of the keyboard has the calculator-style number pad.",
    answer: "(d) Right-hand side. The NCERT IT 402 textbook states: 'It is normally located on the right-hand side of computer keyboard.'",
    steps: [
      { stepNumber: 1, title: "Recall numeric keypad location", explanation: "The numeric keypad is a separate cluster of number keys shaped like a calculator, placed on the right side of most full-size keyboards." },
      { stepNumber: 2, title: "Note the exception", explanation: "Some laptop keyboards do not have a numeric keypad due to space constraints.", result: "Answer: (d) Right-hand side." },
    ],
    keyConcepts: ["Numeric keypad", "Keyboard layout"],
  },

  {
    id: "c9-it-unit2-t1-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the dual mode of a numeric keypad? How do you switch between the two modes?",
    hint: "NumLock is the key that controls which mode the numeric keypad is in.",
    answer: "The numeric keypad works in two modes: (1) Number mode — the keys represent the numbers 0–9 and arithmetic symbols (+, –, *, /, .). (2) Navigation mode — the same keys act as arrow keys, Page Up, Page Down, Home, End, Insert, and Delete. You switch between the two modes by pressing the NumLock key. When NumLock is ON, the keypad inputs numbers; when NumLock is OFF, the keypad keys perform navigation functions.",
    steps: [
      { stepNumber: 1, title: "Identify the two modes", explanation: "Mode 1 (NumLock ON): numeric input — numbers and arithmetic operators. Mode 2 (NumLock OFF): navigation — arrow keys, page up/down, etc." },
      { stepNumber: 2, title: "How to switch", explanation: "Press the NumLock key to toggle between the two modes. NumLock ON = numbers; NumLock OFF = navigation.", result: "NumLock key switches between number mode and navigation mode." },
    ],
    keyConcepts: ["Numeric keypad", "NumLock", "Dual mode"],
  },

  {
    id: "c9-it-unit2-t1-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "The Caps Lock key is best described as: (a) A key that permanently capitalises all text  (b) A toggle key which, when activated, causes all alphabetic characters to be uppercase  (c) A key that works only with the Shift key  (d) A function key",
    hint: "Think about what 'toggle' means — it switches something on and off.",
    answer: "(b) A toggle key which, when activated, causes all alphabetic characters to be uppercase. The NCERT textbook states: 'Caps Lock key: It is a toggle key, which when activated, causes all alphabetic characters to be uppercase.'",
    steps: [
      { stepNumber: 1, title: "Understand 'toggle key'", explanation: "A toggle key switches between two states each time it is pressed: ON and OFF." },
      { stepNumber: 2, title: "Effect of Caps Lock", explanation: "When Caps Lock is ON: typing letters produces UPPERCASE. When OFF: typing letters produces lowercase. It does not affect numbers or symbols.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Caps Lock", "Toggle key"],
  },

  {
    id: "c9-it-unit2-t1-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Name any SIX types of keys found on a computer keyboard and briefly state the function of each.",
    hint: "The textbook lists types like alphanumeric, punctuation, Alt, Arrow, Backspace, Caps Lock, Ctrl, Delete, Enter, Esc, and Function keys.",
    answer: "Any six of the following (all from the NCERT IT 402 textbook): (1) Alphanumeric keys — letters A–Z and numbers 0–9. (2) Punctuation keys — comma, period, semicolon, brackets, and mathematical operators (+, –, =). (3) Alt key — like a second Ctrl key; used with other keys for commands. (4) Arrow keys — four keys to move the cursor up, down, left, right. (5) Backspace key — deletes the character to the left of the cursor. (6) Caps Lock key — toggle key that makes all alphabets uppercase. (7) Ctrl key — used with other keys to produce control commands. (8) Delete key — deletes the character at/right of the cursor. (9) Enter/Return key — enters commands or moves cursor to the next line. (10) Esc key — sends special codes or exits programs. (11) Function keys — special keys F1–F12 whose meaning depends on the program.",
    steps: [
      { stepNumber: 1, title: "List key categories from textbook", explanation: "The textbook identifies: Alphanumeric, Punctuation, Alt, Arrow, Backspace, Caps Lock, Ctrl, Delete, Enter/Return, Esc, and Function keys." },
      { stepNumber: 2, title: "Write function of each chosen key", explanation: "For each key chosen, state clearly what it does as per the textbook.", result: "Any six clearly stated key types with correct functions." },
    ],
    keyConcepts: ["Types of keys", "Keyboard functions"],
  },

  {
    id: "c9-it-unit2-t1-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Easy", questionType: "MCQ",
    question: "The Enter key (or Return key) is used to: (a) Delete the current line  (b) Enter commands or move the cursor to the beginning of the next line  (c) Save the current document  (d) Open a new file",
    hint: "Think about what pressing Enter does when you finish typing a sentence or command.",
    answer: "(b) Enter commands or move the cursor to the beginning of the next line. The NCERT textbook states: 'Enter key or Return key: It is used to enter commands or to move the cursor to the beginning of the next line.'",
    steps: [
      { stepNumber: 1, title: "Recall Enter key function", explanation: "Pressing Enter in a text document moves the cursor to a new line. In a command prompt or dialog box, it executes/confirms a command." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a) is wrong — Enter does not delete. (c) and (d) are incorrect; those are Ctrl+S and Ctrl+N/Ctrl+O.", result: "Answer: (b)." },
    ],
    keyConcepts: ["Enter key", "Return key"],
  },

  {
    id: "c9-it-unit2-t1-q11", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Explain the difference between the Backspace key and the Delete key. Give the function of each.",
    hint: "One deletes to the left, one deletes to the right — remember which is which.",
    answer: "Backspace key: Deletes the character just to the LEFT of the cursor (insertion point) and moves the cursor one step to the left to that position. Delete key: Deletes the character at the current cursor position. In graphics-based applications (like word processors), it deletes the character to the RIGHT of the insertion point. Unlike Backspace, the Delete key does NOT move the cursor.",
    steps: [
      { stepNumber: 1, title: "Backspace direction and movement", explanation: "Backspace = deletes LEFT, cursor moves left. Think of it as 'going back'." },
      { stepNumber: 2, title: "Delete direction and movement", explanation: "Delete = deletes at/RIGHT of cursor. The cursor stays in the same position.", result: "Backspace: deletes left and moves cursor. Delete: deletes right (at cursor) without moving cursor." },
    ],
    keyConcepts: ["Backspace key", "Delete key", "Comparison"],
  },

  {
    id: "c9-it-unit2-t1-q12", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t1", topicName: "Keyboard Basics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What are function keys? How many function keys are there on a standard keyboard? What determines their function?",
    hint: "Function keys are the F1 to F… keys at the top of the keyboard.",
    answer: "Function keys are special keys labelled F1 to F12 on a standard keyboard. There are 12 function keys in total. Their meaning (function) depends on which program is currently running. For example, F1 typically opens Help in many applications, but the same key may do something different in another program.",
    steps: [
      { stepNumber: 1, title: "Define function keys", explanation: "The NCERT textbook states: 'Function keys: Special keys labelled F1 to F12. These keys have different meaning depending on which program is running.'" },
      { stepNumber: 2, title: "Count and context-dependence", explanation: "12 function keys (F1–F12). Their action changes based on the active application.", result: "12 function keys (F1–F12); their function depends on the running program." },
    ],
    keyConcepts: ["Function keys", "F1–F12"],
  },

  // ── Topic 2: Finger Placement and Touch Typing ───────────────────────────────

  {
    id: "c9-it-unit2-t2-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Easy", questionType: "MCQ",
    question: "The Home Row Approach of typewriting is also known as: (a) Vertical Approach  (b) Diagonal Approach  (c) Horizontal Approach  (d) Sequential Approach",
    hint: "The home row runs horizontally across the middle of the keyboard.",
    answer: "(c) Horizontal Approach. The NCERT IT 402 textbook states: 'In the Home Row Approach, also called Horizontal Approach, all the fingers are placed on the home row keys.'",
    steps: [
      { stepNumber: 1, title: "Recall the textbook term", explanation: "The NCERT textbook explicitly names two terms for the same approach: Home Row Approach = Horizontal Approach." },
      { stepNumber: 2, title: "Why 'horizontal'?", explanation: "The home row keys (ASDF on the left, JKL; on the right) form a horizontal line across the middle of the keyboard.", result: "Answer: (c) Horizontal Approach." },
    ],
    keyConcepts: ["Home Row Approach", "Horizontal Approach", "Touch typing"],
  },

  {
    id: "c9-it-unit2-t2-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Easy", questionType: "MCQ",
    question: "A touch typist is someone who: (a) Types with one finger at high speed  (b) Types while looking at the keyboard  (c) Types without using the sense of sight to find the keys  (d) Types using a touchscreen keyboard only",
    hint: "The word 'touch' in touch typing refers to the sense of touch — feeling the keys rather than looking at them.",
    answer: "(c) Types without using the sense of sight to find the keys. The NCERT textbook states: 'The touch method of typewriting is a method of typing without using the sense of sight to find the keys.'",
    steps: [
      { stepNumber: 1, title: "Definition of touch typing", explanation: "Touch typing means locating and pressing keys using the sense of touch (muscle memory) rather than looking at the keyboard." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a) is one-finger typing, not touch typing. (b) is the opposite. (d) refers to touchscreen, not touch typing.", result: "Answer: (c)." },
    ],
    keyConcepts: ["Touch typing", "Muscle memory", "Sense of sight"],
  },

  {
    id: "c9-it-unit2-t2-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Describe the THREE stages of learning touch typing as given in the NCERT IT 402 textbook.",
    hint: "Touch typing is learned in stages — starting with the home row, then syllables, then real text.",
    answer: "Stage 1: Learn the Home Row of the keyboard (the row beginning with the Caps Lock key). Looking at the keyboard is strictly forbidden. Then gradually learn the lower and upper rows, the numbers row, uppercase letters, and special symbols. Stage 2: Memorise frequently used syllables and type words containing these syllables. Stage 3: Type actual text to perfect the skills acquired in stages 1 and 2.",
    steps: [
      { stepNumber: 1, title: "Stage 1 — Home Row and key rows", explanation: "Begin with home row (ASDF JKL;). Never look at the keyboard. Progress to other rows (lower, upper, numbers), then uppercase and symbols." },
      { stepNumber: 2, title: "Stage 2 — Syllables", explanation: "Memorise common syllables and type words built from them to build fluency." },
      { stepNumber: 3, title: "Stage 3 — Real text", explanation: "Practice typing actual passages and text to master the skills.", result: "Three stages: Home Row practice → Syllable memorisation → Real text typing." },
    ],
    keyConcepts: ["Touch typing stages", "Home Row", "Syllables"],
  },

  {
    id: "c9-it-unit2-t2-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Easy", questionType: "MCQ",
    question: "In touch typing, which finger (or hand) is used to press the Space key? (a) The right index finger always  (b) The left index finger always  (c) The thumb of whichever hand is more convenient  (d) The right little finger",
    hint: "The Space key is at the bottom of the keyboard — think about which part of the hand naturally reaches there.",
    answer: "(c) The thumb of whichever hand is more convenient. The NCERT textbook states: 'Use the thumb of whichever hand is more convenient for you to press the Space key.'",
    steps: [
      { stepNumber: 1, title: "Recall the touch typing rule for Space", explanation: "The Space key is wide and sits at the bottom centre of the keyboard. The thumbs naturally rest near it." },
      { stepNumber: 2, title: "Both thumbs are acceptable", explanation: "The textbook says 'whichever hand is more convenient' — either thumb is correct.", result: "Answer: (c) Thumb of whichever hand is more convenient." },
    ],
    keyConcepts: ["Space key", "Touch typing", "Thumb"],
  },

  {
    id: "c9-it-unit2-t2-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is 'muscle memory' in the context of touch typing? How does it help a typist?",
    hint: "Muscle memory is what allows you to ride a cycle without thinking about each movement.",
    answer: "Muscle memory in touch typing means that a typist's fingers know the location of every key through repeated practice, without needing to look at the keyboard. The NCERT textbook states: 'A touch typist knows the location on the keyboard through muscle memory.' This helps the typist keep their eyes on the text being typed (or the copy to be typed) rather than looking down at the keyboard, which increases speed and accuracy.",
    steps: [
      { stepNumber: 1, title: "Define muscle memory", explanation: "Muscle memory is the ability of muscles to perform an action automatically through repeated practice, without conscious thought." },
      { stepNumber: 2, title: "Benefit in typing", explanation: "A touch typist's fingers automatically go to the right keys. The typist can focus entirely on the text being typed, improving speed and reducing errors.", result: "Muscle memory = automatic key location without looking; leads to higher speed and accuracy." },
    ],
    keyConcepts: ["Muscle memory", "Touch typing", "Typing speed"],
  },

  {
    id: "c9-it-unit2-t2-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "In the colour-coded keyboard layout used for touch typing, what does the colour coding represent?",
    hint: "Each colour is assigned to a specific finger, not a specific row.",
    answer: "In the colour-coded keyboard layout for touch typing, colour coding shows which finger should press each key. For example, the NCERT IT 402 textbook states that 'the left index finger is reserved for all the red keys' and 'the right index finger is reserved for green keys, and so forth.' Each colour zone corresponds to a specific finger of a specific hand, making it clear which finger must travel to which region of the keyboard.",
    steps: [
      { stepNumber: 1, title: "Purpose of colour coding", explanation: "Colour coding is a visual guide that maps each key to the correct finger to use for striking it." },
      { stepNumber: 2, title: "Example from textbook", explanation: "Red keys = left index finger. Green keys = right index finger. Other fingers have their own colour zones.", result: "Colour coding = finger allocation map. Each colour zone belongs to one specific finger." },
    ],
    keyConcepts: ["Colour coding", "Finger allocation", "Touch typing"],
  },

  {
    id: "c9-it-unit2-t2-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the base position for the numeric keypad in touch typing?",
    hint: "The base position for the numeric keypad is similar to the home row for alphabetic keys.",
    answer: "The base position on the numeric keypad is: the number 5 key for the middle finger, the number 4 key for the index finger, and the number 6 key for the ring finger. The NCERT textbook notes that the numeric pad simplifies and speeds up numerical data input once the correct base position is learned.",
    steps: [
      { stepNumber: 1, title: "Recall numeric pad base position", explanation: "Just as ASDF/JKL; are the home keys for alphabetic typing, 4-5-6 are the base keys for numeric keypad typing." },
      { stepNumber: 2, title: "Finger assignment", explanation: "Index finger → 4, Middle finger → 5, Ring finger → 6.", result: "Numeric keypad base: 4 (index), 5 (middle), 6 (ring)." },
    ],
    keyConcepts: ["Numeric keypad", "Base position", "Touch typing"],
  },

  {
    id: "c9-it-unit2-t2-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "How are uppercase letters and symbols appearing on keys in the numbers row typed in the touch typing method?",
    hint: "Think about how you normally type a capital letter — which key do you hold?",
    answer: "To type uppercase letters or symbols on the numbers row, one hand presses the desired key while the little finger of the other hand holds down the Shift key. For example, to type the '@' symbol (which is on the '2' key), the right little finger holds Shift while a finger of the left hand presses '2' (or vice versa). This technique ensures all fingers remain in correct touch typing positions.",
    steps: [
      { stepNumber: 1, title: "The role of the Shift key", explanation: "The Shift key, when held, changes lowercase letters to uppercase and produces the upper symbol on dual-symbol keys (like !@#$%^&*)." },
      { stepNumber: 2, title: "Touch typing rule", explanation: "The NCERT textbook states: 'Uppercase letters and symbols appearing on keys in the numbers row are typed by one hand with the little finger of the other hand holding down the SHIFT key.'", result: "One hand presses the key; the other hand's little finger holds Shift." },
    ],
    keyConcepts: ["Shift key", "Uppercase", "Number row symbols", "Touch typing"],
  },

  {
    id: "c9-it-unit2-t2-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Easy", questionType: "MCQ",
    question: "What is a key touch typing rule regarding looking at the keyboard? (a) Look at the keyboard whenever you make a mistake  (b) Never look at the keyboard — locate keys using your fingers  (c) Look at the keyboard for number keys only  (d) Look at the keyboard when typing capital letters",
    hint: "'Touch' typing means using the sense of touch, not sight.",
    answer: "(b) Never look at the keyboard — locate keys using your fingers. The NCERT textbook states: 'Do not look at the keyboard. Try to locate the right key with your fingers.' A touch typist relies on muscle memory, not sight.",
    steps: [
      { stepNumber: 1, title: "Core rule of touch typing", explanation: "The most important rule is: never look at the keyboard. The typist keeps eyes on the source text or screen." },
      { stepNumber: 2, title: "How keys are located", explanation: "Through muscle memory and the raised guide marks on F and J keys, fingers find the correct position automatically.", result: "Answer: (b) Never look at the keyboard." },
    ],
    keyConcepts: ["Touch typing rules", "Not looking at keyboard"],
  },

  {
    id: "c9-it-unit2-t2-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t2", topicName: "Finger Placement and Touch Typing",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What typing speed (in WPM) can an efficient touch typist achieve according to the NCERT IT 402 textbook? What does WPM stand for?",
    hint: "Think about the measurement unit used for typing speed.",
    answer: "WPM stands for Words Per Minute. According to the NCERT IT 402 textbook, with practice, typing speed can increase gradually and speeds of 60 WPM (words per minute) or higher can be achieved. The rate of improvement varies between individuals.",
    steps: [
      { stepNumber: 1, title: "Full form of WPM", explanation: "WPM = Words Per Minute. It measures how many words a typist types in one minute." },
      { stepNumber: 2, title: "Target speed", explanation: "The NCERT textbook states: 'speeds of 60 WPM (words per minute) or higher can be achieved.' This is achievable through consistent practice.", result: "WPM = Words Per Minute. Target: 60 WPM or higher." },
    ],
    keyConcepts: ["WPM", "Words per minute", "Typing speed"],
  },

  // ── Topic 3: Mouse Operations ────────────────────────────────────────────────

  {
    id: "c9-it-unit2-t3-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Easy", questionType: "MCQ",
    question: "A mouse is best described as a: (a) Text input device  (b) Pointing device  (c) Storage device  (d) Processing device",
    hint: "A mouse is used to point at things on the screen.",
    answer: "(b) Pointing device. The NCERT IT 402 textbook states: 'Mouse is a pointing device used to point a particular place on the screen and select to perform one or more actions.'",
    steps: [
      { stepNumber: 1, title: "Recall the textbook definition", explanation: "The textbook explicitly calls the mouse a 'pointing device'." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "(a) Text input is the keyboard's primary role. (c) and (d) are unrelated functions.", result: "Answer: (b) Pointing device." },
    ],
    keyConcepts: ["Mouse", "Pointing device"],
  },

  {
    id: "c9-it-unit2-t3-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Name the THREE main parts of a mouse.",
    hint: "Think about what you press, what you hold, and what you scroll.",
    answer: "The three main parts of a mouse are: (1) Buttons — the left button and right button (used for clicking and selecting). (2) Handling area — the body of the mouse that is held by the hand. (3) Rolling object — the scroll wheel (used for scrolling up and down).",
    steps: [
      { stepNumber: 1, title: "Recall the three parts", explanation: "The NCERT textbook states: 'A mouse primarily comprises of three parts: the buttons, the handling area, and the rolling object.'" },
      { stepNumber: 2, title: "Identify each part", explanation: "Buttons = left and right click buttons. Handling area = the mouse body. Rolling object = scroll wheel.", result: "Three parts: Buttons, Handling area, Rolling object (scroll wheel)." },
    ],
    keyConcepts: ["Mouse parts", "Buttons", "Scroll wheel"],
  },

  {
    id: "c9-it-unit2-t3-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Easy", questionType: "MCQ",
    question: "By default, the mouse is configured to work for: (a) Left-handed persons  (b) Right-handed persons  (c) Both hands equally  (d) The dominant hand as detected automatically",
    hint: "Think about how a standard mouse is laid out at purchase.",
    answer: "(b) Right-handed persons. The NCERT textbook states: 'By default, the mouse is configured to work for the right hand. The left-handed persons can change the settings as per the needs.'",
    steps: [
      { stepNumber: 1, title: "Default mouse configuration", explanation: "Out of the box, a standard mouse places the left button (primary) under the right-hand index finger." },
      { stepNumber: 2, title: "Left-handed option", explanation: "Left-handed users can reverse the button configuration in the computer's settings.", result: "Answer: (b) Right-handed persons." },
    ],
    keyConcepts: ["Mouse configuration", "Right-handed", "Left-handed settings"],
  },

  {
    id: "c9-it-unit2-t3-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "When holding a mouse correctly with the right hand, which finger goes on the left button and which finger goes on the right button?",
    hint: "Think about the natural resting position of your index and middle finger on the mouse.",
    answer: "When holding the mouse with the right hand: the index finger (first finger) goes on the left button, and the middle finger (second finger) goes on the right button. The thumb and ring finger hold the mouse on its sides.",
    steps: [
      { stepNumber: 1, title: "Recall the textbook instruction", explanation: "The NCERT textbook states: 'Put the right hand on the mouse, the index finger goes on the left button, and the middle finger goes on the right button. Hold the mouse with thumb and ring finger.'" },
      { stepNumber: 2, title: "Summary", explanation: "Index finger → left button. Middle finger → right button. Thumb and ring finger → grip the sides.", result: "Index finger on left button; middle finger on right button." },
    ],
    keyConcepts: ["Mouse grip", "Index finger", "Middle finger", "Left button", "Right button"],
  },

  {
    id: "c9-it-unit2-t3-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Easy", questionType: "MCQ",
    question: "How do you correctly click the mouse? (a) Press the button firmly and hold it down for two seconds  (b) Press the button lightly and release it immediately  (c) Press the button and slowly drag the mouse  (d) Double-press the button quickly twice",
    hint: "A click is a quick action — it should be light and fast.",
    answer: "(b) Press the button lightly and release it immediately. The NCERT textbook states: 'To click, press a mouse button lightly and release it immediately.'",
    steps: [
      { stepNumber: 1, title: "Definition of a click", explanation: "A click = light press + immediate release. It is a single, quick action." },
      { stepNumber: 2, title: "Distinguish from other actions", explanation: "Holding the button down is used for dragging. Two quick presses = double-click. (d) describes a double-click, not a single click.", result: "Answer: (b) Press lightly and release immediately." },
    ],
    keyConcepts: ["Mouse click", "Click technique"],
  },

  {
    id: "c9-it-unit2-t3-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "List any FOUR operations that can be performed using a mouse.",
    hint: "Think about what you use the mouse for when working on a computer — clicking, selecting, scrolling...",
    answer: "Four mouse operations (any four from the list below are accepted): (1) Selecting menu commands — click on a menu item to choose a command. (2) Resizing windows — click and drag the window border to resize. (3) Selecting actions from screen icons — click on icons to open applications or folders. (4) Pointing — move the mouse pointer to a specific location on the screen. Other acceptable operations include: dragging (press and hold while moving), scrolling (using the scroll wheel), and right-clicking (opens a context menu). Write any four with a brief description of each.",
    steps: [
      { stepNumber: 1, title: "Recall mouse uses from textbook", explanation: "The NCERT textbook states the mouse can: 'select menu commands, resize windows, selecting actions from screen icons.' Additional operations (dragging, scrolling, right-clicking) are also standard." },
      { stepNumber: 2, title: "Write exactly four, clearly stated", explanation: "Choose any four from the list and write each with its action. Example answer: (1) Pointing — move pointer on screen; (2) Clicking — press and release a button; (3) Scrolling — use scroll wheel to move up/down; (4) Resizing windows — drag window border.", result: "Any four clearly stated mouse operations. Write only four for full marks." },
    ],
    keyConcepts: ["Mouse operations", "Click", "Drag", "Scroll"],
  },

  {
    id: "c9-it-unit2-t3-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Priya is left-handed and finds using the mouse uncomfortable with her right hand. What should she do to make the mouse more suitable for her?",
    hint: "The computer's settings allow the mouse to be reconfigured.",
    answer: "Priya should change the mouse settings in the computer's Control Panel or System Settings to configure it for left-hand use. The NCERT IT 402 textbook states: 'The left-handed persons can change the settings as per the needs.' This will swap the functions of the left and right mouse buttons so that the primary (left) button becomes the right button, making it easier for a left-handed user.",
    steps: [
      { stepNumber: 1, title: "Identify the solution", explanation: "The default mouse configuration is for right-handed users. Left-handed users can change this in settings." },
      { stepNumber: 2, title: "What changes", explanation: "After reconfiguring: the right button becomes the primary (main click) button, and the left button becomes the secondary (right-click) button.", result: "Change mouse settings to left-handed configuration in Control Panel/System Settings." },
    ],
    keyConcepts: ["Mouse settings", "Left-handed configuration"],
  },

  {
    id: "c9-it-unit2-t3-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t3", topicName: "Mouse Operations",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the function of the mouse pointer? How does its appearance change on the screen?",
    hint: "The mouse pointer changes shape to tell you what action is possible at that location.",
    answer: "The mouse pointer allows the user to point to a specific location on the screen. The NCERT IT 402 textbook states: 'The mouse pointer allows to point on the screen.' The appearance of the pointer changes depending on what the user is doing or where the pointer is positioned. For example: the standard arrow pointer appears during normal navigation and can also be used to move objects. The pointer changes shape in different contexts (e.g., an hourglass/spinning wheel when the computer is busy, a text cursor 'I-beam' over text, a resize arrow over window borders, etc.).",
    steps: [
      { stepNumber: 1, title: "Primary function of pointer", explanation: "The mouse pointer marks the current position on screen that is being pointed at." },
      { stepNumber: 2, title: "Changing appearance", explanation: "The textbook notes that the pointer changes shape as it moves around the screen. Different shapes indicate different possible actions.", result: "Mouse pointer = points to screen location; changes shape based on context." },
    ],
    keyConcepts: ["Mouse pointer", "Pointer shapes", "Pointing"],
  },

  // ── Topic 4: Typing Ergonomics ───────────────────────────────────────────────

  {
    id: "c9-it-unit2-t4-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Easy", questionType: "MCQ",
    question: "According to correct typing ergonomics, the upper border of the monitor screen should be positioned at: (a) Below eye level  (b) At eye level  (c) Above eye level  (d) At desk level",
    hint: "You should be able to look straight ahead — not up or down — to see the screen.",
    answer: "(b) At eye level. The NCERT IT 402 textbook states: 'Do not bend your neck while working on the monitor and keep the upper border of screen at eye level.'",
    steps: [
      { stepNumber: 1, title: "Recall monitor placement rule", explanation: "Bending the neck (up or down) causes strain. Keeping the upper border at eye level means the screen is in the natural line of sight." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a) Below — requires looking down, causing neck strain. (c) Above — requires looking up. (d) At desk level — far too low.", result: "Answer: (b) At eye level." },
    ],
    keyConcepts: ["Typing ergonomics", "Monitor placement", "Eye level"],
  },

  {
    id: "c9-it-unit2-t4-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Easy", questionType: "MCQ",
    question: "What is the recommended distance between a user's eyes and a 17-inch monitor screen? (a) 30–40 cm  (b) 40–50 cm  (c) 60–65 cm  (d) 80–100 cm",
    hint: "It's roughly the distance from your face to an outstretched arm.",
    answer: "(c) 60–65 cm. The NCERT IT 402 textbook states: 'Keep an approximate distance of about 60–65 cms for 17 inches screen.'",
    steps: [
      { stepNumber: 1, title: "Recall the textbook figure", explanation: "The textbook specifies 60–65 cm (approximately 60 cm) for a 17-inch screen. Note: the recommended distance may vary for different screen sizes." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "30–40 cm is too close (eye strain). 80–100 cm is too far for comfortable reading.", result: "Answer: (c) 60–65 cm." },
    ],
    keyConcepts: ["Monitor distance", "Ergonomics", "17-inch screen"],
  },

  {
    id: "c9-it-unit2-t4-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Easy", questionType: "MCQ",
    question: "According to correct keyboard ergonomics, the keyboard and mouse should be kept at an approximate distance of: (a) 5 cm from each other  (b) 10 cm from each other  (c) 20 cm from each other  (d) 40 cm from each other",
    hint: "Think about keeping them close enough so you can switch between them without straining.",
    answer: "(c) 20 cm from each other. The NCERT textbook states: 'Keep the keyboard and mouse together at an approximate distance of 20 cms, which will help in smooth and effortless operation of keyboard.'",
    steps: [
      { stepNumber: 1, title: "Recall the textbook specification", explanation: "20 cm between keyboard and mouse. Also, the textbook says: 'Same height of keyboard, mouse and elbows helps the users to work comfortably.'" },
      { stepNumber: 2, title: "Why 20 cm?", explanation: "This distance allows smooth switching between keyboard and mouse without awkward arm movement.", result: "Answer: (c) 20 cm." },
    ],
    keyConcepts: ["Keyboard-mouse distance", "Ergonomics", "20 cm"],
  },

  {
    id: "c9-it-unit2-t4-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the correct elbow angle when sitting at a computer? What ergonomic rule applies to the height of elbows, keyboard, and mouse?",
    hint: "Right angles are important for ergonomics — think about the elbow position.",
    answer: "The correct elbow angle when sitting at a computer is approximately 90 degrees. The NCERT textbook states: 'Bend at about a 90 degree angle.' Regarding height: the keyboard, mouse, and elbows should all be at the same height. The textbook states: 'Same height of keyboard, mouse and elbows helps the users to work comfortably.'",
    steps: [
      { stepNumber: 1, title: "Elbow angle", explanation: "Elbows should be bent at approximately 90 degrees. They should not press against the body (too close) or be stretched too far away." },
      { stepNumber: 2, title: "Height alignment rule", explanation: "Keyboard, mouse, and elbow height should all match to allow natural, relaxed arm movement.", result: "90-degree elbow angle; keyboard, mouse, and elbows at the same height." },
    ],
    keyConcepts: ["Elbow angle", "90 degrees", "Keyboard height", "Ergonomics"],
  },

  {
    id: "c9-it-unit2-t4-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Easy", questionType: "ShortAnswer",
    question: "Where should the document (matter to be typed) be placed according to correct typing ergonomics? What device is recommended for this?",
    hint: "There is a special holder designed for this purpose in typing ergonomics.",
    answer: "The document (matter to be typed) should be placed to the left or right side of the keyboard. A Copy Holder is recommended for this purpose. The NCERT textbook states: 'Place the matter for typing to the left or right side of the keyboard preferably on a Copy Holder which has a sloping surface.' The sloping surface of the copy holder makes it easier to read the text without straining the neck.",
    steps: [
      { stepNumber: 1, title: "Position of document", explanation: "Place the document to the left or right side of the keyboard — not directly behind the keyboard (which would require looking too far)." },
      { stepNumber: 2, title: "Copy Holder", explanation: "A Copy Holder is a stand with a sloping surface that holds the document at a comfortable reading angle.", result: "Document: left or right of keyboard; on a Copy Holder with a sloping surface." },
    ],
    keyConcepts: ["Copy Holder", "Document placement", "Ergonomics"],
  },

  {
    id: "c9-it-unit2-t4-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What are the ergonomic requirements for the computer chair and table?",
    hint: "The chair and table together create the correct working height and posture.",
    answer: "According to the NCERT IT 402 textbook: (1) The chair and table should be adjusted to an optimal height. (2) The computer chair must be supportive to the user's lower back. (3) The computer table should have sufficient space for the legs. (4) Keyboard and vibrating devices such as printers should be on separate tables. With the correct ergonomics, typewriting becomes a natural phenomenon without causing unnecessary fatigue.",
    steps: [
      { stepNumber: 1, title: "Chair requirements", explanation: "Chair must support the lower back and be at the correct height so elbows are at 90 degrees and feet are flat on the floor." },
      { stepNumber: 2, title: "Table requirements", explanation: "Table at correct height; sufficient leg space; printers/vibrating devices on a separate table.", result: "Chair: supportive lower back, optimal height. Table: correct height, leg space, printers separate." },
    ],
    keyConcepts: ["Chair ergonomics", "Table ergonomics", "Lower back support"],
  },

  {
    id: "c9-it-unit2-t4-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the benefit of following correct typing ergonomics? Why is it important for data entry operators?",
    hint: "Think about what happens to your body if you sit incorrectly for hours at a computer.",
    answer: "The NCERT IT 402 textbook states: 'With the correct ergonomics, typewriting becomes a natural phenomenon without causing unnecessary fatigue.' Correct ergonomics is important because data entry operators often sit at computers for long periods. Poor posture, incorrect monitor distance, or improper keyboard and chair height can lead to fatigue, muscle strain, back pain, and repetitive stress injuries. Good ergonomics prevents these problems and allows productive, comfortable, long-duration work.",
    steps: [
      { stepNumber: 1, title: "Direct textbook benefit", explanation: "Correct ergonomics = typewriting becomes natural without unnecessary fatigue." },
      { stepNumber: 2, title: "Importance for data entry operators", explanation: "Data entry requires long hours at the computer. Ergonomic setup prevents fatigue, back pain, wrist strain, and eye strain.", result: "Correct ergonomics prevents fatigue and injury during long-duration computer use." },
    ],
    keyConcepts: ["Ergonomics benefits", "Fatigue prevention", "Data entry"],
  },

  {
    id: "c9-it-unit2-t4-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Scenario: Rajan sits at his computer with his neck bent forward and downward to look at the screen. After one hour, he has neck pain. Identify the ergonomic mistake and state the correct practice.",
    hint: "Think about the correct position of the monitor and the upper border of the screen.",
    answer: "Ergonomic mistake: Rajan's monitor is placed too low, causing him to bend his neck forward and downward. This creates strain on the neck muscles. Correct practice: The NCERT textbook states: 'Do not bend your neck while working on the monitor and keep the upper border of screen at eye level.' Rajan should raise the monitor so that its upper border is at his eye level, and ensure a distance of approximately 60–65 cm from his eyes to the screen.",
    steps: [
      { stepNumber: 1, title: "Identify the mistake", explanation: "Bent neck = monitor too low. The user is looking down at the screen." },
      { stepNumber: 2, title: "Correct practice", explanation: "Raise the monitor until the upper border is at eye level. Maintain 60–65 cm distance (for a 17-inch screen).", result: "Raise the monitor so upper border is at eye level; maintain 60–65 cm distance." },
    ],
    keyConcepts: ["Monitor height", "Neck posture", "Eye level"],
  },

  {
    id: "c9-it-unit2-t4-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Easy", questionType: "MCQ",
    question: "Why should printers and vibrating devices be placed on a separate table from the computer keyboard? (a) To save electricity  (b) To prevent vibrations from disturbing keyboard and mouse operation  (c) Because they need more ventilation  (d) To keep the desk visually tidy",
    hint: "Vibration can affect nearby devices and make typing uncomfortable.",
    answer: "(b) To prevent vibrations from disturbing keyboard and mouse operation. The NCERT textbook states: 'Keyboard and vibrating devices, such as printers, should be on separate tables.'",
    steps: [
      { stepNumber: 1, title: "Recall the textbook reason", explanation: "Printers vibrate during operation. If placed on the same table as the keyboard, these vibrations can disturb the user's typing." },
      { stepNumber: 2, title: "Correct answer", explanation: "(b) is the ergonomic reason. Other options do not relate to the ergonomic justification given in the textbook.", result: "Answer: (b) Prevent vibrations from disturbing keyboard and mouse operation." },
    ],
    keyConcepts: ["Printer placement", "Vibrations", "Ergonomics"],
  },

  {
    id: "c9-it-unit2-t4-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t4", topicName: "Typing Ergonomics",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "List FIVE correct typing ergonomic practices that a data entry operator should follow.",
    hint: "Think about the monitor, keyboard, mouse, chair, and the document to be typed.",
    answer: "Any five correct ergonomic practices from the NCERT IT 402 textbook: (1) Keep the upper border of the screen at eye level. (2) Maintain a distance of about 60–65 cm from the eyes to a 17-inch screen. (3) Keep the keyboard and mouse together at a distance of approximately 20 cm. (4) Ensure the keyboard, mouse, and elbows are all at the same height. (5) Bend elbows at approximately 90 degrees — not pressed against the body or too far away. (6) The computer chair must be supportive to the lower back. (7) Adjust chair and table to an optimal height. (8) Place the matter to be typed on a Copy Holder to the left or right of the keyboard. (9) Keep printers and vibrating devices on a separate table.",
    steps: [
      { stepNumber: 1, title: "Recall ergonomic rules from textbook", explanation: "The NCERT textbook covers: monitor placement, screen distance, keyboard-mouse distance, height alignment, elbow angle, chair support, document placement, and printer separation." },
      { stepNumber: 2, title: "Select and state five clearly", explanation: "Choose five from the list and write each as a clear practice statement.", result: "Any five clearly stated ergonomic practices." },
    ],
    keyConcepts: ["Ergonomic practices", "Data entry operator", "Correct sitting posture"],
  },

  // ── Topic 5: Rapid Typing Tutor ──────────────────────────────────────────────

  {
    id: "c9-it-unit2-t5-q01", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Easy", questionType: "MCQ",
    question: "Rapid Typing Tutor is: (a) A paid proprietary typing software  (b) A Free and Open Source Software (FOSS) designed to learn typing skills  (c) An online-only web application  (d) A hardware typing trainer",
    hint: "Think about the licensing type — is it free or paid?",
    answer: "(b) A Free and Open Source Software (FOSS) designed to learn typing skills. The NCERT IT 402 textbook states: 'Rapid Typing Tutor is a Free and Open Source Software (FOSS) designed to learn typing skills on the computer. It is free to use and share with others for free, but only by using the original distribution package.'",
    steps: [
      { stepNumber: 1, title: "Recall FOSS definition", explanation: "FOSS = Free and Open Source Software. Users can use and share it for free. It is not paid and not proprietary." },
      { stepNumber: 2, title: "Eliminate other options", explanation: "(a) Paid proprietary — incorrect. (c) Online-only — it is a desktop application. (d) Hardware — it is software.", result: "Answer: (b) FOSS designed to learn typing skills." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "FOSS", "Free software"],
  },

  {
    id: "c9-it-unit2-t5-q02", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Name the main components/panels visible in the Rapid Typing Tutor main window.",
    hint: "Think about the different areas of the software screen — the keyboard, text area, buttons, and controls.",
    answer: "The main components of the Rapid Typing Tutor window are: (1) Taskbar — allows setting keyboard layout, level, lesson, and background. (2) Text Panel — displays the text to be typed. (3) Lesson Control Panel — controls to pause/resume the lesson, enable/disable sounds, and adjust volume. (4) Keyboard — a virtual on-screen keyboard that shows which key to press. (5) Three vertical buttons (top-left) — Lesson, Statistics, Lesson Editor — for switching between views. (6) Three horizontal buttons (top-right) — Options, About, Help.",
    steps: [
      { stepNumber: 1, title: "Recall the six components", explanation: "The NCERT textbook describes the Rapid Typing Tutor window as having: Taskbar, Text Panel, Lesson Control Panel, virtual Keyboard, three vertical buttons, and three horizontal buttons." },
      { stepNumber: 2, title: "Summarise each", explanation: "State the name and brief purpose of each component.", result: "Six components: Taskbar, Text Panel, Lesson Control Panel, virtual Keyboard, 3 vertical buttons, 3 horizontal buttons." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "User interface", "Main window components"],
  },

  {
    id: "c9-it-unit2-t5-q03", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Easy", questionType: "MCQ",
    question: "In Rapid Typing Tutor, the Taskbar is used to: (a) Display your typing errors  (b) Show completed lessons only  (c) Set or change basic options such as keyboard layout, level, lesson, and background  (d) Switch the virtual keyboard off",
    hint: "The Taskbar is the control area at the top of the Rapid Typing Tutor window.",
    answer: "(c) Set or change basic options such as keyboard layout, level, lesson, and background. The NCERT textbook states: 'Taskbar allows to set or change some basic options to start a lesson (keyboard layout, level, lesson, and background).'",
    steps: [
      { stepNumber: 1, title: "Recall Taskbar function", explanation: "The Taskbar in Rapid Typing Tutor is not the Windows taskbar — it is the control bar within the software for lesson setup." },
      { stepNumber: 2, title: "Confirm from textbook", explanation: "Setting: keyboard layout (e.g., EN), level (beginner/advanced), lesson category, and background image.", result: "Answer: (c) Set or change keyboard layout, level, lesson, background." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "Taskbar", "Lesson settings"],
  },

  {
    id: "c9-it-unit2-t5-q04", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the Lesson Editor in Rapid Typing Tutor? What is its purpose?",
    hint: "Think about how you would customise the text you practise typing.",
    answer: "The Lesson Editor is a feature in Rapid Typing Tutor accessible from the three vertical buttons on the top-left of the main window. It allows the user to edit the text displayed in the Text Panel. The NCERT textbook states: 'You can easily edit it [the text] in Lesson Editor, if necessary.' Its purpose is to let users customise the lesson content — for example, adding specific words, sentences, or numbers that the user wants to practise typing.",
    steps: [
      { stepNumber: 1, title: "How to access Lesson Editor", explanation: "Click the 'Lesson Editor' button from the three vertical buttons in the top-left corner of the Rapid Typing Tutor window." },
      { stepNumber: 2, title: "Purpose", explanation: "Allows editing the text shown in the Text Panel to create customised typing practice lessons.", result: "Lesson Editor = customise the typing practice text in the Text Panel." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "Lesson Editor", "Customisation"],
  },

  {
    id: "c9-it-unit2-t5-q05", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "In Rapid Typing Tutor, there are two progress bars — one green and one yellow. What does each one show?",
    hint: "Green usually means progress; yellow here is about timing.",
    answer: "Green progress bar (upper bar): Shows the percentage of completion for the current lesson. As the user types more of the lesson text, the green bar fills up. Yellow progress bar (lower bar): Reflects the acceptable time period for typing a single character. When the yellow bar runs out at least once, Rapid Typing Tutor records that the user has broken the typing rhythm at that character. The rhythm information helps the user understand where they are slowing down.",
    steps: [
      { stepNumber: 1, title: "Green progress bar", explanation: "The NCERT textbook states: 'The green progress bar (upper) shows the percentage of completion for the current lesson.'" },
      { stepNumber: 2, title: "Yellow progress bar", explanation: "The NCERT textbook states: 'the yellow progress bar (lower) reflects the acceptable time period for typing a single character. When the yellow progress bar runs out at least once, Typing Tutor records that you have broken the rhythm at this character.'", result: "Green = lesson completion %. Yellow = rhythm timer per character." },
    ],
    keyConcepts: ["Progress bars", "Green bar", "Yellow bar", "Typing rhythm"],
  },

  {
    id: "c9-it-unit2-t5-q06", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "Describe the step-by-step procedure to begin your first lesson in Rapid Typing Tutor.",
    hint: "You need to make selections from the Taskbar before the lesson starts.",
    answer: "To begin the first lesson in Rapid Typing Tutor: Step 1: Open Rapid Typing Tutor software on the computer. Step 2: The main window will appear after the configuration Wizard. Step 3: On the Taskbar (top area of the window), select the keyboard layout from the first dropdown list (e.g., choose 'EN' for English keyboard). Step 4: Select the level (e.g., beginner or advanced). Step 5: Select the lesson category from the dropdown. Step 6: Click to start the lesson. The text to be typed will appear in the Text Panel and the virtual keyboard will guide finger placement.",
    steps: [
      { stepNumber: 1, title: "Open the software", explanation: "Launch Rapid Typing Tutor from the computer." },
      { stepNumber: 2, title: "Use the Taskbar", explanation: "In the Taskbar, make four selections from left to right: keyboard layout → level → lesson category → background (optional). Then start the lesson.", result: "Open software → select layout, level, lesson → begin typing in the Text Panel." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "Starting a lesson", "Taskbar procedure"],
  },

  {
    id: "c9-it-unit2-t5-q07", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Easy", questionType: "MCQ",
    question: "After completing a lesson in Rapid Typing Tutor, the Results dialog window shows two tabs. These tabs are: (a) Speed and Accuracy  (b) Rating and Errors  (c) Score and Mistakes  (d) Time and Words",
    hint: "The textbook specifically names these two tabs in the Results dialog.",
    answer: "(b) Rating and Errors. The NCERT IT 402 textbook states: 'The Results dialog window consists of two tabs called Rating and Errors.'",
    steps: [
      { stepNumber: 1, title: "Recall the Results dialog tabs", explanation: "After each lesson, Rapid Typing Tutor shows the Results dialog. The two tabs are 'Rating' (showing typing performance metrics) and 'Errors' (showing which characters were mistyped)." },
      { stepNumber: 2, title: "Eliminate incorrect options", explanation: "(a), (c), and (d) are not mentioned in the NCERT textbook. Only 'Rating' and 'Errors' are the correct tab names.", result: "Answer: (b) Rating and Errors." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "Results dialog", "Rating tab", "Errors tab"],
  },

  {
    id: "c9-it-unit2-t5-q08", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is 'typing rhythm'? How does Rapid Typing Tutor track whether a student's typing rhythm has been broken?",
    hint: "Rhythm in typing means a consistent, steady speed — no sudden pauses.",
    answer: "Typing rhythm is the consistent and steady pace of pressing keys while typing. A good typing rhythm means no unnecessary pauses or sudden speed changes between keystrokes. Rapid Typing Tutor tracks rhythm using the yellow progress bar: it represents the acceptable time period for typing a single character. The NCERT textbook states: 'When the yellow progress bar runs out at least once, Typing Tutor records that you have broken the rhythm at this character.' The user can review these rhythm breaks in the Statistics view to identify characters where they slow down.",
    steps: [
      { stepNumber: 1, title: "Define typing rhythm", explanation: "Rhythm = consistent, even pace of keystrokes. No sudden stops or speed changes between characters." },
      { stepNumber: 2, title: "How Rapid Typing Tutor tracks it", explanation: "The yellow progress bar resets for each character. If it runs out before the character is typed, it marks a rhythm break at that character.", result: "Typing rhythm = consistent keystroke pace. Tracked by yellow progress bar; a broken rhythm is recorded when yellow bar runs out." },
    ],
    keyConcepts: ["Typing rhythm", "Yellow progress bar", "Rhythm break"],
  },

  {
    id: "c9-it-unit2-t5-q09", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Easy", questionType: "MCQ",
    question: "In Rapid Typing Tutor, the three vertical buttons on the top-left corner are used for: (a) Adjusting sound, background, and colour  (b) Switching between the current Lesson, Statistics, and Lesson Editor  (c) Selecting level, layout, and lesson  (d) Starting, pausing, and stopping the lesson",
    hint: "These buttons switch between the main sections of the software.",
    answer: "(b) Switching between the current Lesson, Statistics, and Lesson Editor. The NCERT textbook states: 'Three vertical buttons in the top-left corner (Lesson, Statistics and Lesson Editor) are used for switching between current lesson, User Statistics and Lesson Editor.'",
    steps: [
      { stepNumber: 1, title: "Recall the three vertical buttons", explanation: "The three vertical buttons on the left are named: Lesson (current practice), Statistics (results/history), and Lesson Editor (customise text)." },
      { stepNumber: 2, title: "Distinguish from horizontal buttons", explanation: "The three horizontal buttons in the top-right are Options, About, and Help — these are for software settings and information.", result: "Answer: (b) Switch between Lesson, Statistics, and Lesson Editor." },
    ],
    keyConcepts: ["Rapid Typing Tutor", "Vertical buttons", "Navigation"],
  },

  {
    id: "c9-it-unit2-t5-q10", classNum: 9, subject: "Information Technology",
    chapterId: "it402-unit2", chapterName: "Data Entry and Keyboarding Skills",
    topicId: "t5", topicName: "Rapid Typing Tutor",
    difficulty: "Medium", questionType: "ShortAnswer",
    question: "What is the virtual keyboard in Rapid Typing Tutor and how does it help a learner?",
    hint: "The virtual keyboard is on-screen — you do not physically type on it.",
    answer: "The virtual keyboard in Rapid Typing Tutor is an on-screen image of a keyboard displayed within the software. The NCERT textbook describes it as: 'Keyboard is the virtual keyboard that will help you to learn touch typing with all 10 fingers. You can customise its appearance in the 'Lesson' section.' It helps a learner by visually showing which key should be pressed next during a lesson, making it easier to learn correct finger placement and touch typing technique. The user can customise its appearance (e.g., the colour scheme) within the Lesson section.",
    steps: [
      { stepNumber: 1, title: "What the virtual keyboard is", explanation: "An on-screen graphical keyboard displayed in the software — not a physical keyboard." },
      { stepNumber: 2, title: "How it helps", explanation: "It shows which key to press during the lesson, guiding the learner to use all 10 fingers correctly. Colour coding on the virtual keyboard matches the colour zones used for touch typing.", result: "Virtual keyboard = on-screen guide showing which key to press; helps learn touch typing with all 10 fingers." },
    ],
    keyConcepts: ["Virtual keyboard", "Rapid Typing Tutor", "Touch typing guide"],
  },

];
