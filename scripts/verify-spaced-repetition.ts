import assert from 'node:assert/strict';
import { scheduleReview, buildSession, type CardState } from '../app/lib/spacedRepetition';

const now = 1_700_000_000_000;

// New card rated Easy: first success is always a fixed 1-day step.
const afterFirstEasy = scheduleReview(undefined, 'easy', now);
assert.equal(afterFirstEasy.repetitions, 1);
assert.equal(afterFirstEasy.intervalDays, 1);
assert.equal(afterFirstEasy.easeFactor, 2.65);
assert.equal(afterFirstEasy.dueAt, now + 24 * 60 * 60 * 1000);

// Second success is always a fixed 6-day step.
const afterSecondEasy = scheduleReview(afterFirstEasy, 'easy', now);
assert.equal(afterSecondEasy.repetitions, 2);
assert.equal(afterSecondEasy.intervalDays, 6);
assert.equal(afterSecondEasy.easeFactor, 2.8);

// Third success compounds: round(previousInterval * easeFactor).
const afterThirdEasy = scheduleReview(afterSecondEasy, 'easy', now);
assert.equal(afterThirdEasy.repetitions, 3);
assert.equal(afterThirdEasy.easeFactor, 2.95);
assert.equal(afterThirdEasy.intervalDays, 18); // round(6 * 2.95) = round(17.7)

// A fresh card rated Hard still gets the fixed 1-day first step, but a lower ease factor.
const afterFirstHard = scheduleReview(undefined, 'hard', now);
assert.equal(afterFirstHard.repetitions, 1);
assert.equal(afterFirstHard.intervalDays, 1);
assert.equal(afterFirstHard.easeFactor, 2.35);

// Again is a lapse: resets repetitions/interval, drops ease factor, reschedules ~10 minutes out.
const afterLapse = scheduleReview(afterThirdEasy, 'again', now);
assert.equal(afterLapse.repetitions, 0);
assert.equal(afterLapse.intervalDays, 0);
assert.equal(afterLapse.easeFactor, 2.75); // 2.95 - 0.2
assert.equal(afterLapse.dueAt, now + 10 * 60 * 1000);

// Ease factor never drops below the 1.3 floor, even after repeated lapses.
const lowEaseState: CardState = { easeFactor: 1.35, intervalDays: 0, repetitions: 0, dueAt: now };
const afterFlooredLapse = scheduleReview(lowEaseState, 'again', now);
assert.equal(afterFlooredLapse.easeFactor, 1.3);

// buildSession puts due cards first (shuffled) and not-due cards after (shuffled), covering every item once.
const items = ['a', 'b', 'c', 'd'];
const progress = {
  a: { easeFactor: 2.5, intervalDays: 5, repetitions: 1, dueAt: now + 100_000 }, // not due
  b: { easeFactor: 2.5, intervalDays: 5, repetitions: 1, dueAt: now - 100_000 }, // due
};
const session = buildSession(items, progress, (item) => item, now);
assert.equal(session.length, 4);
assert.deepEqual([...session].sort(), ['a', 'b', 'c', 'd']);
const notDueIndex = session.indexOf('a');
const dueIndexB = session.indexOf('b');
assert.ok(dueIndexB < notDueIndex, 'due cards should be scheduled before not-due cards');

console.log('All spaced-repetition scheduling checks passed.');
