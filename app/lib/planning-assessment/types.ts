export const PLANNING_ASSESSMENT_VERSION = "1";

export const PLANNING_MAX_PLAN_LENGTH = 6_000;
export const PLANNING_MIN_PLAN_LENGTH = 20;

export type PlanningVerdict = "correct" | "partly-correct" | "incorrect";

export type PlanningCalculationCheck = {
  item: string;
  problem: string;
  corrected: string;
};

export type PlanningAssessmentResult = {
  version: typeof PLANNING_ASSESSMENT_VERSION;
  taskId: string;
  verdict: PlanningVerdict;
  score: number;
  summary: string;
  priorities: { right: boolean; comment: string };
  calculations: PlanningCalculationCheck[];
  resources: string[];
  feasibility: string;
  fixes: string[];
  strengths: string[];
  modelAnswer: string;
  disclaimer: string;
};

export const PLANNING_COACH_DISCLAIMER =
  "AI practice feedback from Gemma, not an ISSB assessment. It can make mistakes, so check its maths against the slide facts. Your plan is sent for this check only and is not stored by this site.";
