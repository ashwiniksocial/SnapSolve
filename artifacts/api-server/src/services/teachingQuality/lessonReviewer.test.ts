import assert from "node:assert/strict";
import test from "node:test";
import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";
import {
  buildStudentVisibleReviewViews,
  validateCriticalIssueEvidence,
  type StudentVisibleReviewViews,
} from "./lessonReviewer";
import { classifyTeachingQuality, mayDeliverTeachingQualityStatus } from "./index";

function lesson(
  topic: string,
  overrides: Record<string, unknown> = {},
): LessonResponse {
  return parseLessonResponse({
    topic,
    difficulty: "Medium",
    keyConcepts: ["Core idea"],
    intuition: { story: "", visual: "", everyday: "" },
    questionTranslation: {
      plainEnglish: "",
      whatWeKnow: "",
      whatWeFind: "",
      wordToMath: "",
    },
    guidedReasoning: [{
      what: "Apply the idea.",
      why: "This works because the relevant quantities have the same relationship.",
      math: "",
      result: "The result follows.",
      pause: "",
    }],
    finalAnswer: {
      answer: "Verified result.",
      whyCorrect: "The stated relationship supports this result.",
      verification: "The result checks.",
    },
    ...overrides,
  });
}

function sections(views: StudentVisibleReviewViews, mode: keyof StudentVisibleReviewViews) {
  return views[mode].map((entry) => entry.section);
}

test("Math visible views resolve cited presence to unclear without treating it as adequate", () => {
  const math = lesson("Experimental Probability", {
    keyConcepts: ["Probability"],
    vocabulary: [{
      term: "Probability",
      meaning: "The chance of an event, expressed as a fraction.",
    }, {
      term: "Numerator",
      meaning: "The top number, counting favorable outcomes.",
    }],
    guidedReasoning: [{
      what: "Find the probability.",
      why: "Divide the favorable outcomes by all possible outcomes.",
      math: "24/60 = 2/5",
      result: "2/5",
      pause: "",
    }],
  });
  const views = buildStudentVisibleReviewViews(math);
  const detailed = views.Detailed;

  assert.ok(sections(views, "Detailed").indexOf("Key Concept") <
    sections(views, "Detailed").indexOf("Step-by-Step Solution"));
  assert.equal(
    (detailed[0]?.content.vocabulary as Array<{ meaning: string }>)[0]?.meaning,
    "The chance of an event, expressed as a fraction.",
  );
  const issue = validateCriticalIssueEvidence({
    section: "Step-by-Step Solution",
    findingType: "missing",
    mode: "Detailed",
    evidence: [{ section: "Key Concept", quote: "The chance of an event, expressed as a fraction." }],
    reviewedSections: sections(views, "Detailed"),
    problem: "Probability is missing.",
    reason: "The student may not understand probability.",
    suggestedFix: "Explain probability.",
    priority: "critical",
  }, views);

  assert.equal(issue.findingType, "unclear");
  assert.equal(issue.priority, "critical");
  assert.ok(issue.reason.includes("explanation quality remains under review"));
  const decision = classifyTeachingQuality({
    scores: {
      vocabulary: 90,
      conceptTeaching: 90,
      reasoning: 90,
      stepExplanation: 90,
      examples: 90,
      memory: 90,
      practice: 90,
      confidenceBuilding: 90,
      weakStudentUnderstanding: 90,
      overall: 90,
    },
    confusions: [],
    criticalIssues: [issue],
    passed: true,
    rubricLabel: "Excellent private tutor",
  });
  assert.equal(decision.status, "REVIEW_REQUIRED");
  assert.equal(mayDeliverTeachingQualityStatus(decision.status), false);
});

test("a missing label with later Biology evidence resolves to a sequencing concern", () => {
  const biology = lesson("Osmosis", {
    keyConcepts: ["Osmosis"],
    guidedReasoning: [{
      what: "Water moves across a membrane.",
      why: "Water moves toward the side with more dissolved particles.",
      math: "",
      result: "Water movement changes cell volume.",
      pause: "",
    }],
    commonMistakes: [{
      mistake: "Do not confuse osmosis with solute movement.",
      whyItHappens: "The two processes are easy to mix up.",
      howToAvoid: "Track which particles can cross the membrane.",
    }],
  });
  const views = buildStudentVisibleReviewViews(biology);

  const issue = validateCriticalIssueEvidence({
    section: "Step-by-Step Solution",
    findingType: "missing",
    mode: "Detailed",
    evidence: [{
      section: "Common Mistakes",
      quote: "Do not confuse osmosis with solute movement.",
    }],
    reviewedSections: sections(views, "Detailed"),
    problem: "The distinction is introduced after the reasoning that needs it.",
    reason: "A learner may apply the wrong direction of movement.",
    suggestedFix: "Pre-empt the distinction in the relevant reasoning step.",
    priority: "high",
  }, views);

  assert.equal(issue.findingType, "late");
  assert.equal(issue.evidence[0]?.section, "Common Mistakes");
});

test("preserved Probability Q4 findings resolve contradictory absence claims without approving the lesson", () => {
  const probability = lesson("Probability", {
    keyConcepts: ["Probability"],
    intuition: {
      story: "A class survey gives counts for students who like Mathematics.",
      visual: "A group of 60 students includes 24 who like Mathematics.",
      everyday: "A survey count can describe a chance in a group.",
    },
    vocabulary: [
      { term: "Probability", meaning: "The chance of something happening, expressed as a fraction." },
      { term: "Numerator", meaning: "The top number in a fraction, indicating how many parts we have." },
      { term: "Denominator", meaning: "The bottom number in a fraction, indicating how many equal parts the whole is divided into." },
    ],
    questionTranslation: {
      plainEnglish: "Find the chance that a randomly selected student likes Mathematics.",
      whatWeKnow: "There are 60 students; 24 like Mathematics.",
      whatWeFind: "The probability of selecting one who likes Mathematics.",
      wordToMath: "favourable count / total count",
    },
    guidedReasoning: [
      {
        what: "Find the probability that a randomly chosen student likes Mathematics.",
        why: "Probability is calculated by taking the number of favorable outcomes (students who like Mathematics) and dividing it by the total number of outcomes (total students). This gives us a fraction that represents the chance of selecting a student who likes Mathematics.",
        math: "",
        result: "",
        pause: "",
      },
      {
        what: "Identify the number of students who like Mathematics.",
        why: "This is our numerator because it tells us how many students are favorable to our event of interest, which is liking Mathematics.",
        math: "",
        result: "",
        pause: "",
      },
      {
        what: "Identify the total number of students.",
        why: "This is our denominator because it represents the total possible outcomes when we pick any student from the class.",
        math: "",
        result: "",
        pause: "",
      },
      {
        what: "Form the ratio.",
        why: "Probability is the favourable count divided by the total count.",
        math: "P = 24/60",
        result: "",
        pause: "",
      },
      {
        what: "Simplify the fraction.",
        why: "Simplifying a fraction means dividing both the numerator and the denominator by the same number. This preserves the ratio and makes it easier to understand. Here, we can divide both by 12.",
        math: "24 ÷ 12 = 2 and 60 ÷ 12 = 5",
        result: "P = 2/5",
        pause: "",
      },
      {
        what: "Interpret the result.",
        why: "This final fraction, 2/5, tells us that out of every 5 students chosen at random, 2 of them are likely to like Mathematics.",
        math: "",
        result: "P = 2/5",
        pause: "",
      },
    ],
    commonMistakes: [{
      mistake: "Confusing the numerator and denominator.",
      whyItHappens: "Students might mix up which number goes on top and which goes on the bottom.",
      howToAvoid: "Remember that the numerator is the part of the whole that we are interested in, while the denominator is the total amount.",
    }],
    simplerExample: {
      problem: "Four of ten fruits are apples. Find the chance of picking an apple.",
      solution: "4/10 simplifies to 2/5.",
    },
    practiceQuestion: {
      question: "32 of 80 students like English. Find the probability.",
      hints: ["Use favourable outcomes over total outcomes."],
      solution: "32/80 simplifies to 2/5.",
    },
    rememberThese: ["Probability compares favourable outcomes with all outcomes."],
  });
  const views = buildStudentVisibleReviewViews(probability);
  const visible = (section: string, quote: string) => ({
    section,
    quote,
  });
  const rawFindings = [
    {
      section: "Step-by-Step Solution",
      findingType: "missing",
      evidence: [visible(
        "Key Concept",
        "The chance of something happening, expressed as a fraction.",
      )],
      problem: "The lesson does not explain probability.",
      reason: "A weak student may not understand the term.",
      suggestedFix: "Explain the concept.",
      priority: "critical",
    },
    {
      section: "Step-by-Step Solution",
      findingType: "missing",
      evidence: [
        visible(
          "Step-by-Step Solution",
          "This is our numerator because it tells us how many students are favorable to our event of interest, which is liking Mathematics.",
        ),
        visible(
          "Step-by-Step Solution",
          "This is our denominator because it represents the total possible outcomes when we pick any student from the class.",
        ),
      ],
      problem: "The lesson does not explain numerator and denominator.",
      reason: "A weak student may not know the fraction roles.",
      suggestedFix: "Define the terms.",
      priority: "critical",
    },
    {
      section: "Step-by-Step Solution",
      findingType: "missing",
      evidence: [visible(
        "Common Mistakes",
        "Confusing the numerator and denominator.",
      )],
      problem: "The lesson does not address common misconceptions.",
      reason: "A learner may mix up the two counts.",
      suggestedFix: "Address the misconception.",
      priority: "high",
    },
    {
      section: "Step-by-Step Solution",
      findingType: "missing",
      evidence: [visible(
        "Step-by-Step Solution",
        "Simplifying a fraction means dividing both the numerator and the denominator by the same number. This preserves the ratio and makes it easier to understand.",
      )],
      problem: "The lesson does not explain why simplification helps.",
      reason: "A learner may not see its purpose.",
      suggestedFix: "Explain why.",
      priority: "high",
    },
    {
      section: "Step-by-Step Solution",
      findingType: "missing",
      evidence: [visible(
        "Step-by-Step Solution",
        "This final fraction, 2/5, tells us that out of every 5 students chosen at random, 2 of them are likely to like Mathematics.",
      )],
      problem: "The lesson does not interpret the probability in context.",
      reason: "A learner may not understand the result.",
      suggestedFix: "Connect it to the class.",
      priority: "high",
    },
  ];
  const issues = rawFindings.map((finding) => validateCriticalIssueEvidence({
    ...finding,
    mode: "Detailed",
    reviewedSections: sections(views, "Detailed"),
  }, views));

  assert.deepEqual(issues.map((issue) => issue.findingType), [
    "unclear",
    "unclear",
    "late",
    "unclear",
    "unclear",
  ]);
  assert.ok(issues.every((issue) => issue.priority === "high" || issue.priority === "critical"));
  assert.ok(issues.filter((issue) => issue.findingType === "unclear").every((issue) =>
    issue.reason.includes("explanation quality remains under review"),
  ));
  assert.ok(issues[2]?.reason.includes("sequencing concern"));

  const decision = classifyTeachingQuality({
    scores: {
      vocabulary: 75,
      conceptTeaching: 75,
      reasoning: 75,
      stepExplanation: 75,
      examples: 75,
      memory: 75,
      practice: 75,
      confidenceBuilding: 75,
      weakStudentUnderstanding: 50,
      overall: 71,
    },
    confusions: ["What does probability mean?", "What does 2/5 mean in context?"],
    criticalIssues: issues,
    passed: false,
    rubricLabel: "Good school teacher",
  });

  assert.equal(decision.status, "REVIEW_REQUIRED");
  assert.ok(decision.blockReasons.some((reason) =>
    reason.includes("review_required:unclear:Step-by-Step Solution"),
  ));
  assert.ok(decision.blockReasons.every((reason) =>
    !reason.includes("weakStudentUnderstanding=50"),
  ));
  assert.equal(decision.resolution, "manual_review_once");
  assert.equal(mayDeliverTeachingQualityStatus(decision.status), false);
});

test("Science reviewer evidence requires an exact visible quote for unclear or incorrect claims", () => {
  const science = lesson("Force and Motion", {
    keyConcepts: ["Force"],
    guidedReasoning: [{
      what: "A force changes motion.",
      why: "A net force changes an object's velocity.",
      math: "",
      result: "The object's motion changes.",
      pause: "",
    }],
  });
  const views = buildStudentVisibleReviewViews(science);
  const finding = {
    section: "Step-by-Step Solution",
    findingType: "incorrect",
    mode: "Detailed",
    evidence: [{
      section: "Step-by-Step Solution",
      quote: "A net force changes an object's velocity.",
    }],
    reviewedSections: sections(views, "Detailed"),
    problem: "The stated relationship is inaccurate.",
    reason: "It could teach a false physical rule.",
    suggestedFix: "Correct the relationship.",
    priority: "critical",
  };

  assert.equal(validateCriticalIssueEvidence(finding, views).findingType, "incorrect");
  assert.throws(() => validateCriticalIssueEvidence({
    ...finding,
    evidence: [{ section: "Step-by-Step Solution", quote: "A fabricated statement." }],
  }, views), /review_issue_evidence_not_in_student_view/);
});

test("IT reviewer may report genuinely missing visible teaching only after checking all displayed sections", () => {
  const it = lesson("Algorithmic Thinking", {
    keyConcepts: ["Algorithm"],
    guidedReasoning: [{
      what: "Run the program.",
      why: "",
      math: "",
      result: "The program finishes.",
      pause: "",
    }],
  });
  const views = buildStudentVisibleReviewViews(it);
  const issue = validateCriticalIssueEvidence({
    section: "Step-by-Step Solution",
    findingType: "missing",
    mode: "Detailed",
    evidence: [],
    reviewedSections: sections(views, "Detailed"),
    problem: "No visible step explains how to form the algorithm.",
    reason: "A weak learner cannot reproduce the procedure.",
    suggestedFix: "Explain the algorithm before executing it.",
    priority: "high",
  }, views);

  assert.equal(issue.findingType, "missing");
  assert.throws(() => validateCriticalIssueEvidence({
    ...issue,
    reviewedSections: ["Step-by-Step Solution"],
  }, views), /review_issue_incomplete_section_audit/);
});

test("all three modes expose only their actual sections in the renderer's order", () => {
  const complete = lesson("General", {
    keyConcepts: ["Concept"],
    vocabulary: [{ term: "Term", meaning: "Meaning." }],
    intuition: { story: "Story.", visual: "Picture.", everyday: "Example." },
    questionTranslation: {
      plainEnglish: "Plain.",
      whatWeKnow: "Known.",
      whatWeFind: "Find.",
      wordToMath: "Translate.",
    },
    prerequisites: ["Prerequisite."],
    commonMistakes: [{
      mistake: "Mistake.",
      whyItHappens: "Reason.",
      howToAvoid: "Avoid it.",
    }],
    simplerExample: { problem: "Small question.", solution: "Worked answer." },
    practiceQuestion: { question: "Try this.", hints: ["Hint."], solution: "Solution." },
    rememberThese: ["Takeaway."],
    confidenceBuilder: "Not shown by TeachingLayout.",
  });
  const views = buildStudentVisibleReviewViews(complete);

  assert.deepEqual(sections(views, "Detailed"), [
    "Key Concept",
    "Build Intuition",
    "Understand the Question",
    "Step-by-Step Solution",
    "Common Mistakes",
    "Final Answer",
    "One Similar Example",
    "Practice Question",
    "Remember This",
  ]);
  assert.deepEqual(sections(views, "Standard"), [
    "Key Concept",
    "Understand the Question",
    "Step-by-Step Solution",
    "Final Answer",
    "Practice Question",
  ]);
  assert.deepEqual(sections(views, "Compact"), [
    "Step-by-Step Solution",
    "Final Answer",
    "Remember This",
  ]);
  assert.ok(!JSON.stringify(views).includes("Not shown by TeachingLayout."));
});
