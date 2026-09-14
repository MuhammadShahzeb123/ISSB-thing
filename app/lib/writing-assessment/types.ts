export const WRITING_ASSESSMENT_VERSION = "1" as const;

export const WRITING_COACH_DISCLAIMER =
  "This is AI-generated writing coaching for practice only, not an official ISSB assessment or score.";

export type WritingResponseRecord = {
  promptId: string;
  text: string;
};

export type WritingAssessmentRequest = {
  version: typeof WRITING_ASSESSMENT_VERSION;
  assessmentType: string;
  responses: WritingResponseRecord[];
};

export type WritingCriterionId =
  | "effectiveWordUse"
  | "structureReadability"
  | "emotionalRange"
  | "constructiveHopefulOutcome"
  | "initiative"
  | "responsibility"
  | "teamwork"
  | "leadershipBehaviors";

export type WritingCriterionScore = {
  criterion: WritingCriterionId;
  score: number;
  evidence: string;
};

export type WritingMetrics = {
  responseCount: number;
  totalWordCount: number;
  uniqueWordCount: number;
  totalSentenceCount: number;
  averageWordsPerResponse: number;
  averageWordsPerSentence: number;
  responses: Array<{
    promptId: string;
    wordCount: number;
    sentenceCount: number;
  }>;
};

export type WritingImprovement = {
  focus: string;
  advice: string;
};

export type WritingAssessmentResult = {
  version: typeof WRITING_ASSESSMENT_VERSION;
  assessmentType: string;
  metrics: WritingMetrics;
  scores: WritingCriterionScore[];
  overallPracticeScore: number;
  summary: string;
  strengths: string[];
  improvements: WritingImprovement[];
  disclaimer: typeof WRITING_COACH_DISCLAIMER;
};
