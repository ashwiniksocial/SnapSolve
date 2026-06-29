/**
 * Gold Standard Lesson Library — Computer Science
 *
 * Developer-only reference. Never imported by any runtime service.
 * These lessons represent the teaching quality benchmark for Computer Science.
 */

import type { GoldStandardLesson } from "./types";

const ALL_CMF_TRUE = {
  cmf1_whyBeforeWhat:            true,
  cmf2_problemFirst:             true,
  cmf3_intuitionBeforeFormalism: true,
  cmf4_sixQuestionsAnswered:     true,
  cmf5_confusionsPreEmpted:      true,
  cmf6_nextQuestionAnswered:     true,
  cmf7_noSkippedSteps:           true,
  cmf8_formulaDerivation:        true,
  cmf9_theoremWhyExplained:      true,
  cmf10_lawIntuitionFirst:       true,
  cmf11_biologyFlowingStory:     true, // N/A
  cmf12_csAlgorithmFirst:        true,
  cmf13_economicsEverydayFirst:  true, // N/A
  cmf14_threeExplanations:       true,
  cmf15_youngerSiblingTest:      true,
};

export const COMPUTER_SCIENCE_GOLD_STANDARDS: GoldStandardLesson[] = [

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "cs-loops-for-loop-class8",
    concept: "Loops — The For Loop",
    class:   8,
    board:   "Both",
    subject: "Computer Science",

    whyGoldStandard: `
This lesson is gold standard because it establishes why loops exist before showing what they are.
The student writes the same instruction five times and feels the absurdity of it —
that feeling IS the motivation for loops. The for loop is then introduced as
'a way to say the same thing once and specify how many times to repeat it.'
Every component of the for loop syntax is explained as the answer to a question the student
already has after understanding the concept: 'How do I say how many times?' → the range.
'How do I refer to which repetition I'm on?' → the loop variable.
The lesson traces through the loop three times with specific values before generalising.
    `.trim(),

    teachingTechniques: [
      "Repetition absurdity — write 'print hello' five times manually, feel the problem, then solve it with a loop",
      "Plain-English algorithm first — 'say hello five times' written as human instructions before any code",
      "Syntax as translation — each part of the for statement shown to be the code translation of one English phrase",
      "Execution trace table — columns for iteration number, loop variable value, and what is printed, filled in row by row",
      "Off-by-one pre-emption — range(5) gives 0,1,2,3,4 (not 1,2,3,4,5); traced explicitly before the student assumes otherwise",
      "Loop variable use — show that the loop variable can be used inside the loop body, not just counted",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'Imagine your teacher asks you to write 'I will not talk in class' 100 times. You could write it 100 times. But what if there were a smarter way?'",
      "Shows the painful version first: print('hello') written five separate times",
      "Introduces the loop in plain English: 'Repeat the following five times: print hello'",
      "Shows the Python code with each part labelled: 'for i in range(5): — the for keyword says we are starting a loop. i is the loop variable (it counts which repetition we are on). range(5) says we repeat five times.'",
      "Traces the execution: 'First time: i = 0. We print hello. Second time: i = 1. We print hello. ... Fifth time: i = 4. We print hello. After that, the loop ends because range(5) only gives us values 0 to 4.'",
      "Addresses the off-by-one immediately: 'You might expect i to go from 1 to 5. But Python starts counting from 0. range(5) gives: 0, 1, 2, 3, 4. That's 5 values total. This is standard in most programming languages.'",
      "Shows loop variable use: 'We can use i inside the loop body. print(i * 2) would print: 0, 2, 4, 6, 8.'",
      "Algorithm check: 'Before we wrote the code, we said: repeat five times. After we wrote the code, trace it: does it repeat exactly five times? Yes. The algorithm and the code match.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'A for loop is a control structure that repeats a block of code'",
      "Showing the syntax without explaining what each part means",
      "Not tracing through the loop with specific values",
      "Not addressing the off-by-one (range(5) gives 0–4, not 1–5)",
      "Not showing the problem (repetition without a loop) before the solution (loop)",
      "Not connecting the code syntax back to the plain-English algorithm",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The WHY — The Repetition Problem",
        mustContain: [
          "A concrete task that requires repetition (print something N times, sum N numbers)",
          "The painful solution: write the instruction N times manually",
          "The observation: this is absurd for large N, and any change requires N edits",
          "The question: 'Is there a way to say this once and specify the repetition count separately?'",
        ],
        typicalFailures: ["Introducing loops as a 'feature' rather than a solution to a problem"],
      },
      {
        name: "Plain-English Algorithm",
        mustContain: [
          "The task expressed as a human instruction: 'Repeat X, Y times'",
          "Identification of what repeats (the loop body) and what controls the repetition (the count)",
          "The loop variable introduced: 'Which repetition am I on?'",
        ],
        typicalFailures: ["Jumping directly to code without the English algorithm"],
      },
      {
        name: "Syntax as Translation",
        mustContain: [
          "Each component of 'for i in range(5):' labelled and explained",
          "'for' = starting a loop",
          "'i' = the loop variable (which repetition)",
          "'range(5)' = 'five times' in code",
          "The colon and indentation explained: 'everything indented below runs each time'",
        ],
        typicalFailures: ["Showing the syntax without connecting each part to its English meaning"],
      },
      {
        name: "Execution Trace",
        mustContain: [
          "A table: iteration | i value | what happens",
          "Every row filled in explicitly, starting from i = 0",
          "Explicit statement that the loop ends when range is exhausted",
        ],
        typicalFailures: ["Not tracing the first few iterations with specific values"],
      },
      {
        name: "Misconception Block",
        mustContain: [
          "Off-by-one: range(5) gives 0,1,2,3,4 — not 1,2,3,4,5",
          "Loop variable i is updated automatically — the student does not write i = i + 1",
          "Indentation is structural — unindented code after the loop runs after the loop ends, not inside it",
        ],
        typicalFailures: ["Not addressing the 0-index issue before the student assumes 1-indexed"],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────
  {
    id:      "cs-functions-class9",
    concept: "Functions — Defining and Calling",
    class:   9,
    board:   "Both",
    subject: "Computer Science",

    whyGoldStandard: `
This lesson is gold standard because functions are introduced as the solution to two
specific, concrete problems: code duplication (writing the same block multiple times)
and manageability (a 500-line program with no structure is unreadable).
The student writes duplicate code first, feels the problem, then sees functions as
the solution. Every component of a function definition (def, name, parameters, body, return)
is introduced as the answer to a question the student already has.
The difference between parameters and arguments is shown with a physical analogy
(a recipe vs. a specific cooking instance) before any code.
Return values are traced explicitly to show where the value 'goes' after the function ends.
    `.trim(),

    teachingTechniques: [
      "Duplication problem first — write the same block of code twice, then show the maintenance nightmare",
      "Recipe analogy — function definition as a recipe (parameters = ingredient slots); function call as cooking one instance",
      "Component-by-component syntax explanation — def, name, parameters, body, return each introduced as an answer to a specific question",
      "Return value trace — 'when the function returns X, that value travels back to the point where the function was called'",
      "Parameter vs argument distinction — formal parameter in the definition vs actual argument in the call",
      "Function call stack described — 'the program pauses, runs the function, and when it returns, continues from where it left off'",
    ],

    expectedQualityCharacteristics: [
      "Opens with: 'You are writing a program to calculate the area of rectangles. You need to do this calculation in three different places in your code. You write it three times. Now your teacher says to add a check for negative lengths. How many places do you need to fix?'",
      "States the two problems: code duplication and code organisation — before introducing functions",
      "Introduces the recipe analogy: 'A function is like a recipe. The recipe tells you the steps. But it doesn't make anything by itself. You need to follow it — call it — to actually bake a cake.'",
      "Introduces the function definition one component at a time: 'def says we are defining a function. calculate_area is the name — we choose this. length and width are the parameters — the ingredients our function needs.'",
      "Explains return: 'Inside the function, we compute the area. We use return to send the result back to whoever called the function. Without return, the function does the work but throws the answer away.'",
      "Traces the call: 'When we write result = calculate_area(5, 3), the program pauses at this line, enters the function with length=5 and width=3, computes 5×3=15, returns 15, and the program resumes with result holding 15.'",
      "Parameter vs argument: 'length and width in the definition are parameters — they are placeholders. 5 and 3 in the call are arguments — the actual values we pass in.'",
    ],

    commonNonGoldFailures: [
      "Opening with 'A function is a reusable block of code'",
      "Not showing duplicated code before introducing functions",
      "Introducing the full syntax at once without explaining each component separately",
      "Not tracing where the return value goes",
      "Not distinguishing parameters from arguments",
      "Not explaining what happens if return is omitted",
    ],

    cmfCompliance: ALL_CMF_TRUE,

    lessonOutline: [
      {
        name: "The Problem — Code Duplication",
        mustContain: [
          "A concrete scenario requiring the same calculation in multiple places",
          "The duplication shown explicitly (the same block written twice or three times)",
          "The maintenance nightmare: 'if you need to change the calculation, you must change it everywhere'",
          "The question: 'Is there a way to write it once and use it multiple times?'",
        ],
        typicalFailures: ["Jumping to 'functions are useful for reuse' without showing the problem"],
      },
      {
        name: "The Recipe Analogy",
        mustContain: [
          "Recipe = function definition (a set of instructions)",
          "Parameters = ingredient slots in the recipe (placeholders)",
          "Function call = one instance of following the recipe (with specific ingredients)",
          "The analogy bounded: 'unlike a recipe, a function can return a value to you'",
        ],
        typicalFailures: ["No analogy — jumping straight to syntax"],
      },
      {
        name: "Function Definition — Component by Component",
        mustContain: [
          "'def' keyword: 'this word tells Python: I am defining a function, not running it yet'",
          "Function name: chosen by the programmer, describes what the function does",
          "Parameters: 'the information the function needs to do its job — like blanks to fill in'",
          "Function body: 'the indented block that runs every time the function is called'",
          "Return statement: 'sends a value back to the caller; without it, None is returned'",
        ],
        typicalFailures: ["Showing the complete syntax without explaining each part"],
      },
      {
        name: "Execution Trace — Function Call",
        mustContain: [
          "Call traced step by step: program reaches call → pauses → enters function → executes body → returns value → resumes",
          "Variables inside the function shown as local (they do not exist outside)",
          "The returned value shown arriving at the calling site",
        ],
        typicalFailures: ["Not tracing the flow of execution through the function call"],
      },
      {
        name: "Misconception Block",
        mustContain: [
          "Defining vs calling: 'def calculate_area() only creates the function. It does not run it.'",
          "Return vs print: 'return sends the value back; print only displays it. If the caller needs the value, you must return it.'",
          "Local variables: 'variables created inside a function do not exist outside it'",
        ],
        typicalFailures: ["Not addressing the define-vs-call confusion or the return-vs-print confusion"],
      },
    ],
  },
];
