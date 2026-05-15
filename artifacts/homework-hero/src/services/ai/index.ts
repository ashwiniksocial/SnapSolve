/**
 * StudyAI — AI Service Layer
 *
 * Public surface area for the scan-to-solution pipeline.
 *
 * Migration notes:
 *  - OCR:      replace `safeRecognize` with a Vision API call
 *  - Matching: replace `generateSolution` with an LLM call
 *  - Types:    AIResponse / TopicMatch stay identical; UI never changes
 */

export { safeRecognize, recognizeImage } from "./ocrService";
export type { OcrProgress }              from "./ocrService";

export { detectBestTopic, detectTopics, cleanOcrText } from "./topicMatcher";
export type { TopicMatch }                              from "./topicMatcher";

export { generateSolution, generateSolutionFromText } from "./solutionEngine";
