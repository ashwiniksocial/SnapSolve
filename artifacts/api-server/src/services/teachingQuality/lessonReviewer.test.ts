import assert from "node:assert/strict";
import test from "node:test";
import { parseLessonResponse, type LessonResponse } from "../../lib/lessonTypes";
import {
  buildStudentVisibleReviewViews,
  validateCriticalIssueEvidence,
  type StudentVisibleReviewViews,
} from "./lessonReviewer";

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

test("Math visible views place definitions before reasoning and reject false missing claims", () => {
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
  assert.throws(() => validateCriticalIssueEvidence({
    section: "Step-by-Step Solution",
    findingType: "missing",
    mode: "Detailed",
    evidence: [{ section: "Key Concept", quote: "The chance of an event, expressed as a fraction." }],
    reviewedSections: sections(views, "Detailed"),
    problem: "Probability is missing.",
    reason: "The student may not understand probability.",
    suggestedFix: "Explain probability.",
    priority: "critical",
  }, views), /review_issue_missing_has_present_evidence/);
});

test("Biology reviewer evidence can classify an explanation that appears after reasoning as late", () => {
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
    findingType: "late",
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
