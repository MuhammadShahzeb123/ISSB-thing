export const CONTENT_VERSION = 'opi-practice-1.0.0';

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neither agree nor disagree' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
] as const;

export type LikertValue = (typeof LIKERT_OPTIONS)[number]['value'];

export type DimensionId =
  | 'responsibility'
  | 'initiative'
  | 'teamwork'
  | 'composure'
  | 'adaptability'
  | 'planning'
  | 'communication'
  | 'persistence'
  | 'integrity'
  | 'judgment';

export type Polarity = 'direct' | 'reverse';

export interface PracticeDimension {
  id: DimensionId;
  label: string;
  description: string;
}

export interface DimensionContent extends PracticeDimension {
  direct: readonly string[];
  reverse: readonly string[];
}

export interface OpiStatement {
  id: string;
  text: string;
  dimension: DimensionId;
  polarity: Polarity;
  context: string;
  contentVersion: typeof CONTENT_VERSION;
}

export const PRACTICE_DIMENSIONS: readonly PracticeDimension[] = [
  {
    id: 'responsibility',
    label: 'Responsibility',
    description: 'Ownership, follow-through, and attention to commitments.',
  },
  {
    id: 'initiative',
    label: 'Initiative',
    description: 'Getting started, noticing useful work, and acting within sensible limits.',
  },
  {
    id: 'teamwork',
    label: 'Teamwork',
    description: 'Contributing, coordinating, and sharing space with other people.',
  },
  {
    id: 'composure',
    label: 'Composure under pressure',
    description: 'Regulating your pace and attention when demands increase.',
  },
  {
    id: 'adaptability',
    label: 'Adaptability',
    description: 'Learning, adjusting, and continuing when conditions change.',
  },
  {
    id: 'planning',
    label: 'Planning',
    description: 'Priorities, sequencing, resources, and preparation.',
  },
  {
    id: 'communication',
    label: 'Communication',
    description: 'Listening, clarity, questions, and timely information-sharing.',
  },
  {
    id: 'persistence',
    label: 'Persistence',
    description: 'Sustained effort, recovery, and knowing when to change tactics.',
  },
  {
    id: 'integrity',
    label: 'Integrity',
    description: 'Honesty, consistency, credit, and handling competing interests.',
  },
  {
    id: 'judgment',
    label: 'Practical judgment',
    description: 'Weighing evidence, consequences, trade-offs, and escalation.',
  },
] as const;
