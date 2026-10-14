import assert from 'node:assert/strict';
import test from 'node:test';
import { generateQuestion, isCorrect, parseAnswer, QUICK_TOPICS, TEMPLATES, type QuickQuestion } from './generators';

// Independent solvers: recompute every answer from the numbers shown in the question.
const solvers: Record<string, (p: Record<string, number>) => number> = {
  'dozen-eggs': (p) => (p.dozen / 12) * p.n,
  'proportion-items': (p) => (p.total / p.k) * p.m,
  'percent-of': (p) => (p.p / 100) * p.y,
  'percent-increase': (p) => ((p.b - p.a) / p.a) * 100,
  'percent-decrease': (p) => ((p.a - p.b) / p.a) * 100,
  discount: (p) => p.mp * (1 - p.d / 100),
  'profit-percent': (p) => ((p.sell - p.cost) / p.cost) * 100,
  'ages-times': (p) => {
    // Brute force: find the son's age s with k*s + n === m*(s + n).
    for (let s = 1; s < 100; s += 1) if (p.k * s + p.n === p.m * (s + p.n)) return s;
    return NaN;
  },
  'ages-sum': (p) => (p.sum - p.d) / 2,
  'ages-future': (p) => p.k * p.son + p.n,
  multiply: (p) => p.a * p.b,
  'multiply-trick': (p) => p.a * p.b,
  square: (p) => p.n ** 2,
  division: (p) => p.a / p.b,
  'share-equally': (p) => p.total / p.people,
  'fraction-of': (p) => (p.y * p.n) / p.d,
  'fraction-add': (p) => p.a / p.b + p.c / p.d,
  speed: (p) => p.d / p.t,
  'distance-minutes': (p) => p.v * (p.mins / 60),
  'time-minutes': (p) => (p.d / p.v) * 60,
  'work-together': (p) => 1 / (1 / p.a + 1 / p.b),
  'work-people': (p) => (p.m1 * p.d1) / p.m2,
  average: (p) => Object.values(p).reduce((s, x) => s + x, 0) / Object.values(p).length,
  'average-missing': (p) => p.avg * 4 - p.a - p.b - p.c,
  'simple-interest': (p) => (p.p * p.r * p.t) / 100,
  'ratio-share': (p) => (p.total / (p.a + p.b)) * Math.max(p.a, p.b),
  'ratio-boys-girls': (p) => (p.boys / p.a) * p.b,
  'clock-angle': (p) => {
    const hour = (p.h % 12) * 30 + p.m * 0.5;
    const minute = p.m * 6;
    const d = Math.abs(hour - minute);
    return Math.min(d, 360 - d);
  },
  'minutes-between': (p) => p.end - p.start,
  'calendar-date': (p) => {
    let count = 0;
    for (let date = 1; date <= 31; date += 1) {
      if ((p.first + date - 1) % 7 === p.target) {
        count += 1;
        if (count === p.nth) return date;
      }
    }
    return NaN;
  },
};

function isClean(n: number) {
  // Whole number, or a decimal with at most 2 places.
  return Number.isFinite(n) && Math.abs(n * 100 - Math.round(n * 100)) < 1e-9;
}

test('there are at least 20 templates covering every topic', () => {
  assert.ok(TEMPLATES.length >= 20, `only ${TEMPLATES.length} templates`);
  for (const topic of QUICK_TOPICS) assert.ok(TEMPLATES.some((t) => t.topic === topic.id), `no template for ${topic.id}`);
  for (const t of TEMPLATES) assert.ok(solvers[t.id], `no independent solver for ${t.id}`);
});

for (const template of TEMPLATES) {
  test(`${template.id}: 1000 questions are correct and clean`, () => {
    let seed = 12345 + template.id.length;
    const rng = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
    for (let i = 0; i < 1000; i += 1) {
      const question: QuickQuestion = template.make(i % 2 ? rng : Math.random);
      const expected = solvers[template.id](question.params);
      assert.ok(Math.abs(expected - question.answer) < 1e-9, `${question.text} gave ${question.answer}, expected ${expected}`);
      assert.ok(isClean(question.answer), `not clean: ${question.text} = ${question.answer}`);
      assert.ok(question.answer >= 0 && question.answer < 100000, `out of range: ${question.text}`);
      assert.ok(question.text.length > 5 && question.method.length > 5);
      assert.ok(!/NaN|undefined|Infinity/.test(question.text + question.method), `bad text: ${question.text} ${question.method}`);
      assert.ok(isCorrect(question, String(question.answer)));
    }
  });
}

test('topic filter only returns that topic', () => {
  for (let i = 0; i < 200; i += 1) assert.equal(generateQuestion(['ages']).topic, 'ages');
});

test('parseAnswer accepts commas, spaces and units', () => {
  assert.equal(parseAnswer(' 1,200 '), 1200);
  assert.equal(parseAnswer('.5'), 0.5);
  assert.equal(parseAnswer('45 km'), 45);
  assert.equal(parseAnswer(''), null);
});
