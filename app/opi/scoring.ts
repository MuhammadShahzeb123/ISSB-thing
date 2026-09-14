import type { DimensionId, LikertValue, OpiStatement } from './content/model';

export type AnswerMap = Record<string, LikertValue>;

export interface DimensionResult {
  dimension: DimensionId;
  answered: number;
  average: number;
}

export function scoreAnswer(answer: LikertValue, polarity: OpiStatement['polarity']) {
  return polarity === 'reverse' ? 6 - answer : answer;
}

export function scoreByDimension(
  statements: readonly OpiStatement[],
  answers: AnswerMap,
): DimensionResult[] {
  const grouped = new Map<DimensionId, number[]>();

  statements.forEach((statement) => {
    const answer = answers[statement.id];
    if (answer === undefined) return;

    const scores = grouped.get(statement.dimension) ?? [];
    scores.push(scoreAnswer(answer, statement.polarity));
    grouped.set(statement.dimension, scores);
  });

  return [...grouped.entries()].map(([dimension, scores]) => ({
    dimension,
    answered: scores.length,
    average: scores.reduce((total, score) => total + score, 0) / scores.length,
  }));
}

export function describeAverage(average: number) {
  if (average < 2.5) return 'Less often reflected in these responses';
  if (average < 3.5) return 'Mixed across these responses';
  return 'More often reflected in these responses';
}
