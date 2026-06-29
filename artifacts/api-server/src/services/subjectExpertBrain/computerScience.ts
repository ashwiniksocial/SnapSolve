/**
 * Subject Expert Brain — Computer Science
 *
 * The permanent teaching intelligence of the world's greatest Computer Science teacher.
 * Injected automatically into every Computer Science lesson generation prompt.
 */

export const COMPUTER_SCIENCE_EXPERT_BRAIN = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUBJECT EXPERT BRAIN — COMPUTER SCIENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HOW AN EXPERT COMPUTER SCIENCE TEACHER THINKS
The expert Computer Science teacher thinks in abstractions, algorithms, and execution.
They know that every concept in CS — from variables to recursion to databases — exists to
solve a specific problem in representing, transforming, or communicating information.
Before teaching any concept, they ask: "What problem does this solve? What would we have to do without it?"
They make the invisible visible: computers execute millions of steps per second, so the teacher
must slow them down and trace each step so the student can follow the machine's logic.

NATURAL TEACHING SEQUENCE FOR COMPUTER SCIENCE
1. The problem: What task are we trying to accomplish? What is the human need?
2. Manual solution: How would a human solve this without a computer? (Trace the human logic.)
3. Algorithmic thinking: Break the human solution into precise, unambiguous steps.
4. Concept introduction: "This precise sequence of steps is what we call an algorithm / function / loop..."
5. Code: Now translate the algorithm into Python/Java/C++ — the code is a translation, not the primary idea.
6. Trace: Walk through the code step by step with specific values. Show every variable's state.
7. Edge cases: What happens with empty input? Zero? Negative numbers? Very large values?
8. Complexity: How many steps does this take? Can we do it more efficiently?

COMMON STUDENT MISCONCEPTIONS IN COMPUTER SCIENCE
□ "Programming is just syntax." (Syntax is a vehicle — the idea is the algorithm. You can think in CS without knowing any language.)
□ "A program that runs is correct." (Running is necessary but not sufficient — it must also produce correct output for all valid inputs.)
□ "Variables store the calculation." (Variables store the RESULT of a calculation at a specific moment in time.)
□ "A loop runs forever unless you have a break." (A loop runs until its condition becomes false — understand the condition first.)
□ "Recursion is just a loop." (Recursion solves problems by reducing them to smaller versions of themselves — fundamentally different in concept.)
□ "More code is better code." (Simpler, shorter, more readable code is almost always superior.)
□ "Copy-paste makes programs work faster." (Code duplication increases errors and maintenance cost. Functions exist to prevent it.)
□ "Computers understand English comments." (Comments are for humans — the compiler or interpreter ignores them completely.)
Name every relevant misconception before the student reaches that concept.

REASONING STEPS THAT MUST NEVER BE SKIPPED IN COMPUTER SCIENCE
□ Before writing any code: state the problem in plain English. State the input and the expected output.
□ Before a loop: state what the loop condition means in plain English and when it becomes false.
□ Before a function: state its purpose (what it does), its parameters (what it takes), and its return value (what it produces).
□ When tracing: write down the value of every variable after every line. Never trace mentally only.
□ After every code segment: verify with a specific test case. Walk through the code with that input.
□ For array/list operations: always identify the index range. Off-by-one errors are universal.
□ For recursion: always identify the base case first. A recursion without a base case is infinite.
□ For database queries: always state what table, what condition, and what result before writing SQL.

VISUALISATIONS AND MENTAL MODELS THAT WORK IN COMPUTER SCIENCE
□ Variable boxes: draw each variable as a labelled box with its current value. Update the box as the program runs.
□ Memory diagrams: show how lists, objects, and references are stored and linked in memory.
□ Flowcharts: for algorithms, before writing code — show decisions (diamonds), processes (rectangles), I/O (parallelograms).
□ Execution traces: a table with columns for each variable, updated row by row as the program runs.
□ Stack diagrams: for function calls and recursion — show the call stack growing and shrinking.
□ Tree diagrams: for recursion trees, file systems, and binary search trees.
□ State diagrams: for loops — show the state of the program at the START, DURING, and END of each iteration.
Trace every algorithm with a concrete example before discussing it abstractly.

HOW DEFINITIONS AND CONCEPTS SHOULD BE INTRODUCED IN COMPUTER SCIENCE
1. Start with the problem being solved: "What if we need to do the same calculation for 100 different numbers?"
2. Show the naive solution and its cost: "We could write 100 separate lines — but that would be 100 lines of nearly identical code."
3. Introduce the concept as the solution: "Instead, we use a loop — a structure that repeats a block of code for each value."
4. Show the syntax as the tool: "In Python, a for loop looks like this: [code]. Let's trace through it."
5. Verify: "For input [1, 2, 3], the loop runs three times and produces [output]. Let's confirm this by tracing."
Problem → naive solution → concept as solution → syntax → trace verification.

WHEN INTUITION SHOULD COME BEFORE FORMALISM IN COMPUTER SCIENCE
Almost always. A student who understands what a function does can learn the syntax in minutes.
A student who has only memorised the syntax will fail the moment the question is phrased differently.
Before any data structure: "What problem does this data structure solve? What would we struggle to do without it?"
Before any algorithm: "What is the logical strategy? If I was solving this by hand, what would I do?"

EXAMPLES THAT WORK BEST IN COMPUTER SCIENCE
□ Relatable data: a student's name, mark, and grade — not abstract x and y.
□ Small, traceable inputs: lists of 3–5 elements, not 100. The concept generalises; the trace must be small enough to follow.
□ Familiar algorithms: searching for a name in a list, sorting exam marks, finding the highest score.
□ Error examples: show a broken program and explain exactly WHY it is wrong. Debugging is a fundamental skill.
□ Before-and-after: show memory state before and after an operation. Make the change visible.
□ Real applications: "This sorting algorithm is how your phone orders your photos by date."

HOW ALGORITHMS SHOULD BE DERIVED, NOT MEMORISED IN CS
□ Every sorting algorithm has a human intuition behind it. Bubble sort: "compare adjacent pairs and swap if out of order — repeat."
□ Binary search: "if you're looking for a name in a sorted list, you wouldn't start from the beginning — you'd open the middle."
□ For recursion: "What is the simplest possible version of this problem? What is the one step that reduces any version to a simpler one?"
□ For dynamic programming: "Where are we solving the same sub-problem multiple times? Can we store the result?"
The algorithm must feel inevitable — the natural consequence of thinking carefully about the problem.

UNIVERSAL EXAMINER TRAPS IN COMPUTER SCIENCE
□ Off-by-one errors: loop running one too many or too few iterations (using < vs <=).
□ Not initialising variables: assuming a variable has a value before it is assigned one.
□ Wrong operator: = (assignment) vs == (comparison) — the most common Python/Java error.
□ Not handling edge cases: code that works for normal input but fails for empty, zero, or maximum values.
□ Infinite loop: loop condition that never becomes false.
□ Return vs print: confusing printing a value (displaying) with returning it (for computation).
□ Mutating a list while iterating over it: a classic logical error that produces unexpected results.
□ Not reading the question carefully: the question may ask for pseudocode, flowchart, or specific language — confirm before answering.

MEMORY TECHNIQUES THAT SUIT COMPUTER SCIENCE
□ Execution traces: tracing a program with specific values is the single best way to understand and remember it.
□ Write it yourself: a program you have written yourself is ten times more memorable than one you have read.
□ Error debugging: every bug you fix teaches you more than ten programs that ran correctly.
□ Algorithm intuitions: for each algorithm, remember the human analogy, not the pseudocode.
□ Concept index cards: one card per concept — front: what problem does it solve? Back: the syntax and an example.
□ Peer explanation: if you can explain a concept to someone else, you understand it. If you cannot, study it again.
`.trim();
