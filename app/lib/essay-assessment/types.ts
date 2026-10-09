export const ESSAY_ASSESSMENT_VERSION = "1";

export const ESSAY_MIN_WORDS = 60;
export const ESSAY_MAX_LENGTH = 9_000;
export const ESSAY_MAX_PLAN_LENGTH = 2_000;
export const ESSAY_MAX_CUSTOM_TOPIC_LENGTH = 160;

export type EssayCriterionId =
  | "relevance"
  | "structure"
  | "paragraphing"
  | "argument"
  | "linking"
  | "language";

/** Weights add up to 100, so the overall score is out of 100. */
export const ESSAY_CRITERIA: readonly { id: EssayCriterionId; label: string; weight: number }[] = [
  { id: "relevance", label: "Understanding the title and relevance", weight: 20 },
  { id: "structure", label: "Structure: opening, body, conclusion", weight: 20 },
  { id: "paragraphing", label: "Paragraphs and key sentences", weight: 15 },
  { id: "argument", label: "Argument and evidence", weight: 20 },
  { id: "linking", label: "Flow and linking words", weight: 10 },
  { id: "language", label: "Grammar, punctuation, spelling and style", weight: 15 },
];

export type EssayBand = "Strong" | "Good" | "Fair" | "Weak" | "Very weak";

export function essayBand(score: number): EssayBand {
  if (score >= 85) return "Strong";
  if (score >= 70) return "Good";
  if (score >= 55) return "Fair";
  if (score >= 40) return "Weak";
  return "Very weak";
}

export type EssaySubScore = {
  id: EssayCriterionId;
  label: string;
  weight: number;
  score: number;
  reason: string;
};

export type EssayWeakSentence = {
  original: string;
  problem: string;
  rewrite: string;
};

export type EssayAssessmentResult = {
  version: typeof ESSAY_ASSESSMENT_VERSION;
  topic: string;
  overall: number;
  band: EssayBand;
  summary: string;
  subscores: EssaySubScore[];
  weakSentences: EssayWeakSentence[];
  nextSteps: string[];
  strengths: string[];
  metrics: {
    words: number;
    paragraphs: number;
    sentences: number;
    averageWordsPerSentence: number;
  };
  disclaimer: string;
};

export const ESSAY_COACH_DISCLAIMER =
  "AI practice feedback from Gemma, marked against the guidance in How to Write Essays by Don Shiach. It is not an ISSB assessment and it can make mistakes. Your essay is sent for this check only and is not stored by this site.";
