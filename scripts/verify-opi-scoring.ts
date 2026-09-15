import assert from 'node:assert/strict';
import type { OpiStatement } from '../app/opi/content/model.ts';
import { describeAverage, scoreAnswer, scoreByDimension } from '../app/opi/scoring.ts';

assert.equal(scoreAnswer(1, 'direct'), 1);
assert.equal(scoreAnswer(2, 'direct'), 2);
assert.equal(scoreAnswer(3, 'direct'), 3);
assert.equal(scoreAnswer(4, 'direct'), 4);
assert.equal(scoreAnswer(5, 'direct'), 5);

assert.equal(scoreAnswer(1, 'reverse'), 5);
assert.equal(scoreAnswer(2, 'reverse'), 4);
assert.equal(scoreAnswer(3, 'reverse'), 3);
assert.equal(scoreAnswer(4, 'reverse'), 2);
assert.equal(scoreAnswer(5, 'reverse'), 1);

const statements: OpiStatement[] = [
  {
    id: 'opi-responsibility-001',
    text: 'Example direct statement.',
    dimension: 'responsibility',
    polarity: 'direct',
    context: 'Example',
    contentVersion: 'opi-practice-1.0.0',
  },
  {
    id: 'opi-responsibility-002',
    text: 'Example reverse statement.',
    dimension: 'responsibility',
    polarity: 'reverse',
    context: 'Example',
    contentVersion: 'opi-practice-1.0.0',
  },
  {
    id: 'opi-teamwork-001',
    text: 'Example teamwork statement.',
    dimension: 'teamwork',
    polarity: 'direct',
    context: 'Example',
    contentVersion: 'opi-practice-1.0.0',
  },
];

const results = scoreByDimension(statements, {
  'opi-responsibility-001': 4,
  'opi-responsibility-002': 2,
  'opi-teamwork-001': 3,
});

assert.deepEqual(results, [
  { dimension: 'responsibility', answered: 2, average: 4 },
  { dimension: 'teamwork', answered: 1, average: 3 },
]);
assert.equal(describeAverage(2.49), 'Less often reflected in these responses');
assert.equal(describeAverage(2.5), 'Mixed across these responses');
assert.equal(describeAverage(3.49), 'Mixed across these responses');
assert.equal(describeAverage(3.5), 'More often reflected in these responses');

console.log('OPI direct and reverse-key scoring checks passed.');
