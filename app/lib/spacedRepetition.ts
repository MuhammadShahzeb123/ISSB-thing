export type Rating = 'again' | 'hard' | 'easy';

export interface CardState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: number;
}

export type DeckProgress = Record<string, CardState>;

export const NEW_CARD_STATE: CardState = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  dueAt: 0,
};

const MIN_EASE_FACTOR = 1.3;
const LAPSE_INTERVAL_MS = 10 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

// Ease factor is rounded to 2 decimal places on every update so repeated
// +/-0.15 adjustments don't accumulate IEEE-754 floating point noise
// (e.g. 2.8 + 0.15 is 2.9499999999999997, not 2.95).
function roundEase(value: number): number {
  return Math.round(value * 100) / 100;
}

export function scheduleReview(previous: CardState | undefined, rating: Rating, now: number): CardState {
  const state = previous ?? NEW_CARD_STATE;

  if (rating === 'again') {
    const easeFactor = Math.max(MIN_EASE_FACTOR, roundEase(state.easeFactor - 0.2));
    return { easeFactor, intervalDays: 0, repetitions: 0, dueAt: now + LAPSE_INTERVAL_MS };
  }

  const easeDelta = rating === 'hard' ? -0.15 : 0.15;
  const easeFactor = Math.max(MIN_EASE_FACTOR, roundEase(state.easeFactor + easeDelta));
  const repetitions = state.repetitions + 1;

  let intervalDays: number;
  if (repetitions === 1) {
    intervalDays = 1;
  } else if (repetitions === 2) {
    intervalDays = 6;
  } else {
    const growth = rating === 'hard' ? Math.max(1.2, easeFactor - 0.3) : easeFactor;
    intervalDays = Math.max(1, Math.round(state.intervalDays * growth));
  }

  return { easeFactor, intervalDays, repetitions, dueAt: now + intervalDays * DAY_MS };
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function buildSession<T>(
  items: T[],
  progress: DeckProgress,
  getId: (item: T) => string,
  now: number,
): T[] {
  const due = items.filter((item) => {
    const state = progress[getId(item)];
    return !state || state.dueAt <= now;
  });
  const notDue = items.filter((item) => {
    const state = progress[getId(item)];
    return state && state.dueAt > now;
  });
  return [...shuffle(due), ...shuffle(notDue)];
}
