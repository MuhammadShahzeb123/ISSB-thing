import type {
  LikertValue,
  OpiStatement,
  Polarity,
} from './content/model';

export const SESSION_SIZES = [20, 50, 100] as const;
export type SessionSize = (typeof SESSION_SIZES)[number];
export type SessionStatus = 'active' | 'paused' | 'review' | 'complete';

export interface OpiSession {
  sessionId: string;
  contentVersion: string;
  statementIds: string[];
  answers: Record<string, LikertValue>;
  currentIndex: number;
  status: SessionStatus;
  createdAt: string;
  updatedAt: string;
}

export const STORAGE_KEY = 'issb-opi-self-reflection-session';

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function takeByPolarity(
  statements: readonly OpiStatement[],
  polarity: Polarity,
  count: number,
  random: () => number,
) {
  return shuffle(
    statements.filter((statement) => statement.polarity === polarity),
    random,
  ).slice(0, count);
}

export function selectPracticeStatements(
  bank: readonly OpiStatement[],
  size: SessionSize,
  random: () => number = Math.random,
) {
  const dimensions = [...new Set(bank.map((statement) => statement.dimension))];
  const perDimension = size / dimensions.length;

  const selected = dimensions.flatMap((dimension, dimensionIndex) => {
    const dimensionItems = bank.filter((statement) => statement.dimension === dimension);
    const directCount =
      perDimension % 2 === 0
        ? perDimension / 2
        : dimensionIndex % 2 === 0
          ? Math.ceil(perDimension / 2)
          : Math.floor(perDimension / 2);
    const reverseCount = perDimension - directCount;

    return [
      ...takeByPolarity(dimensionItems, 'direct', directCount, random),
      ...takeByPolarity(dimensionItems, 'reverse', reverseCount, random),
    ];
  });

  return shuffle(selected, random);
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `opi-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createSession(
  bank: readonly OpiStatement[],
  size: SessionSize,
): OpiSession {
  const now = new Date().toISOString();
  return {
    sessionId: createSessionId(),
    contentVersion: bank[0]?.contentVersion ?? 'unknown',
    statementIds: selectPracticeStatements(bank, size).map((statement) => statement.id),
    answers: {},
    currentIndex: 0,
    status: 'active',
    createdAt: now,
    updatedAt: now,
  };
}

export function isLikertValue(value: unknown): value is LikertValue {
  return Number.isInteger(value) && Number(value) >= 1 && Number(value) <= 5;
}

export function isStoredSession(value: unknown): value is OpiSession {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<OpiSession>;
  return (
    typeof session.sessionId === 'string' &&
    typeof session.contentVersion === 'string' &&
    Array.isArray(session.statementIds) &&
    session.statementIds.every((id) => typeof id === 'string') &&
    !!session.answers &&
    typeof session.answers === 'object' &&
    Object.keys(session.answers).every((id) => session.statementIds?.includes(id)) &&
    Object.values(session.answers).every(isLikertValue) &&
    Number.isInteger(session.currentIndex) &&
    typeof session.status === 'string' &&
    ['active', 'paused', 'review', 'complete'].includes(session.status)
  );
}

export function touchSession(
  session: OpiSession,
  update: Partial<Omit<OpiSession, 'sessionId' | 'contentVersion' | 'createdAt'>>,
): OpiSession {
  return {
    ...session,
    ...update,
    updatedAt: new Date().toISOString(),
  };
}
