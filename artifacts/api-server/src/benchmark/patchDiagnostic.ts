/**
 * Diagnostic: manually patch M4's Step 1–2 to correct intuition-first content,
 * then re-run the reviewer to confirm whether fixing Step 1 raises conceptTeaching.
 */
import { reviewLesson }        from '../services/teachingQuality/lessonReviewer';
import { parseLessonResponse } from '../lib/lessonTypes';
import * as fs from 'fs';

async function main() {
  const raw    = JSON.parse(fs.readFileSync('./benchmark_results_detailed_after.json', 'utf8'));
  const m4Raw  = raw.raw.baseline.find((r: any) => r.questionId === 'M4');
  const lessonObj = JSON.parse(m4Raw.rawOutput);

  console.log('ORIGINAL Step 1 what:', lessonObj.guidedReasoning[0].what);
  console.log('ORIGINAL Step 1 math:', lessonObj.guidedReasoning[0].math);
  console.log('ORIGINAL Step 2 what:', lessonObj.guidedReasoning[1].what);
  console.log('---');

  // Patch Step 1 and Step 2 with correct intuition-first content
  lessonObj.guidedReasoning[0] = {
    what:   'We are going to use a proof technique called proof by contradiction. Instead of directly proving that √2 is irrational, we temporarily PRETEND the opposite — that √2 IS rational — and then show this pretension leads to a logical impossibility. When pretending leads to an impossible conclusion, the pretension must be false.',
    why:    'Proof by contradiction is useful when a direct proof is hard. We cannot check every rational number, but we CAN derive a logical contradiction from the assumption — that is much easier.',
    math:   '',
    result: '',
    pause:  'Before we start — what do you think it means for a number to be rational? What would √2 look like if it were a fraction?',
  };
  lessonObj.guidedReasoning[1] = {
    what:   'Here is why the contradiction strategy works: if √2 = p/q in its simplest form, we can show that BOTH p and q must be even. But a fraction in its simplest form cannot have both numerator and denominator even — that is the impossibility we will reach.',
    why:    'Think of a detective proving a suspect is lying by showing their story leads to an impossible conclusion. Our story is that √2 is rational — the impossible conclusion is hiding inside that story.',
    math:   '',
    result: '',
    pause:  'Can you think of any fraction where both numerator and denominator are even but the fraction is already in simplest form?',
  };

  const apiKey = process.env.OPENAI_API_KEY ?? '';
  const lesson = parseLessonResponse(lessonObj);

  console.log('\nRunning review on PATCHED lesson…');
  const { report } = await reviewLesson(lesson, apiKey);

  console.log('\nPATCHED REVIEW RESULTS:');
  console.log('passed:                   ', report.passed);
  console.log('conceptTeaching:          ', report.scores.conceptTeaching);
  console.log('reasoning:                ', report.scores.reasoning);
  console.log('stepExplanation:          ', report.scores.stepExplanation);
  console.log('weakStudentUnderstanding: ', report.scores.weakStudentUnderstanding);
  const vals = Object.values(report.scores) as number[];
  const avg  = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  console.log('overall avg:              ', avg);
  console.log('all scores:', JSON.stringify(report.scores, null, 2));
}

main().catch(console.error);
