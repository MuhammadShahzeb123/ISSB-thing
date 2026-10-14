// Quick maths question generators for the deputy president interview drill.
// Every template picks numbers so the answer is a whole number or a short decimal.
// app/lib/quick-maths/generators.test.ts checks 1000 questions per template.

export type QuickTopic =
  | 'unit-price'
  | 'percentages'
  | 'ages'
  | 'multiplication'
  | 'division'
  | 'fractions'
  | 'speed'
  | 'work'
  | 'averages'
  | 'interest'
  | 'ratios'
  | 'clock-calendar';

export const QUICK_TOPICS: { id: QuickTopic; label: string }[] = [
  { id: 'unit-price', label: 'Unit price' },
  { id: 'percentages', label: 'Percentages' },
  { id: 'ages', label: 'Ages' },
  { id: 'multiplication', label: 'Multiply & squares' },
  { id: 'division', label: 'Division' },
  { id: 'fractions', label: 'Fractions' },
  { id: 'speed', label: 'Speed, distance, time' },
  { id: 'work', label: 'Work & time' },
  { id: 'averages', label: 'Averages' },
  { id: 'interest', label: 'Simple interest' },
  { id: 'ratios', label: 'Ratios' },
  { id: 'clock-calendar', label: 'Clock & calendar' },
];

export type QuickQuestion = {
  templateId: string;
  topic: QuickTopic;
  text: string;
  answer: number;
  unit?: string;
  method: string;
  params: Record<string, number>;
};

export type Rng = () => number;

const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));
const pick = <T,>(rng: Rng, items: readonly T[]): T => items[Math.floor(rng() * items.length)];
const fmt = (n: number) => (Number.isInteger(n) ? n.toLocaleString('en-US') : String(n));
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

type Template = { id: string; topic: QuickTopic; make: (rng: Rng) => QuickQuestion };

function q(
  id: string,
  topic: QuickTopic,
  text: string,
  answer: number,
  method: string,
  params: Record<string, number>,
  unit?: string,
): QuickQuestion {
  return { templateId: id, topic, text, answer, method, params, unit };
}

export const TEMPLATES: Template[] = [
  {
    id: 'dozen-eggs',
    topic: 'unit-price',
    make: (rng) => {
      const each = int(rng, 10, 40);
      const n = pick(rng, [5, 6, 8, 9, 15, 16, 18, 20, 30]);
      return q('dozen-eggs', 'unit-price', `A dozen eggs cost Rs ${fmt(each * 12)}. What do ${n} eggs cost?`, each * n,
        `Rs ${fmt(each * 12)} ÷ 12 = Rs ${each} each, × ${n} = Rs ${fmt(each * n)}.`, { dozen: each * 12, n }, 'Rs');
    },
  },
  {
    id: 'proportion-items',
    topic: 'unit-price',
    make: (rng) => {
      const each = pick(rng, [15, 20, 25, 30, 35, 40, 45, 50, 60, 75]);
      const k = int(rng, 3, 9);
      let m = int(rng, 2, 15);
      if (m === k) m += 1;
      return q('proportion-items', 'unit-price', `${k} pens cost Rs ${fmt(each * k)}. How much do ${m} pens cost?`, each * m,
        `One pen is Rs ${fmt(each * k)} ÷ ${k} = Rs ${each}. ${m} × ${each} = Rs ${fmt(each * m)}.`, { k, total: each * k, m }, 'Rs');
    },
  },
  {
    id: 'percent-of',
    topic: 'percentages',
    make: (rng) => {
      const p = pick(rng, [5, 10, 15, 20, 25, 30, 40, 50, 60, 75]);
      const y = 20 * int(rng, 2, 50);
      const ans = (p * y) / 100;
      return q('percent-of', 'percentages', `What is ${p}% of ${fmt(y)}?`, ans, `${p}/100 × ${fmt(y)} = ${fmt(ans)}.`, { p, y });
    },
  },
  {
    id: 'percent-increase',
    topic: 'percentages',
    make: (rng) => {
      const a = pick(rng, [20, 40, 50, 80, 100, 200, 250, 400, 500, 800]);
      const p = pick(rng, [5, 10, 20, 25, 50]);
      const b = a + (a * p) / 100;
      return q('percent-increase', 'percentages', `A price rises from Rs ${fmt(a)} to Rs ${fmt(b)}. What is the percentage increase?`, p,
        `Rise ${fmt(b - a)} ÷ old ${fmt(a)} × 100 = ${p}%.`, { a, b }, '%');
    },
  },
  {
    id: 'percent-decrease',
    topic: 'percentages',
    make: (rng) => {
      const a = pick(rng, [40, 50, 80, 100, 200, 250, 400, 500, 1000]);
      const p = pick(rng, [10, 20, 25, 40, 50]);
      const b = a - (a * p) / 100;
      return q('percent-decrease', 'percentages', `A town's population falls from ${fmt(a * 100)} to ${fmt(b * 100)}. What is the percentage decrease?`, p,
        `Fall ${fmt((a - b) * 100)} ÷ old ${fmt(a * 100)} × 100 = ${p}%.`, { a: a * 100, b: b * 100 }, '%');
    },
  },
  {
    id: 'discount',
    topic: 'percentages',
    make: (rng) => {
      const mp = 100 * int(rng, 2, 60);
      const d = pick(rng, [10, 15, 20, 25, 30, 40, 50]);
      const sale = mp - (mp * d) / 100;
      return q('discount', 'percentages', `A shirt marked Rs ${fmt(mp)} is sold at ${d}% off. What is the sale price?`, sale,
        `${d}% of ${fmt(mp)} is ${fmt(mp - sale)}. ${fmt(mp)} − ${fmt(mp - sale)} = Rs ${fmt(sale)}.`, { mp, d }, 'Rs');
    },
  },
  {
    id: 'profit-percent',
    topic: 'percentages',
    make: (rng) => {
      const cost = 100 * int(rng, 1, 40);
      const p = pick(rng, [5, 10, 20, 25, 30, 40, 50]);
      const sell = cost + (cost * p) / 100;
      return q('profit-percent', 'percentages', `A shopkeeper buys a watch for Rs ${fmt(cost)} and sells it for Rs ${fmt(sell)}. What is his profit percentage?`, p,
        `Profit ${fmt(sell - cost)} ÷ cost ${fmt(cost)} × 100 = ${p}%.`, { cost, sell }, '%');
    },
  },
  {
    id: 'ages-times',
    topic: 'ages',
    make: (rng) => {
      // Father is k times the son now; in n years he will be m times the son. Find the son's age.
      for (;;) {
        const s = int(rng, 4, 20);
        const k = int(rng, 3, 6);
        const n = int(rng, 2, 20);
        const fNum = k * s + n;
        const sNum = s + n;
        if (fNum % sNum !== 0) continue;
        const m = fNum / sNum;
        if (m < 2 || m >= k || k * s > 70) continue;
        return q('ages-times', 'ages', `A father is ${k} times as old as his son. In ${n} years he will be ${m} times as old. How old is the son now?`, s,
          `${k}s + ${n} = ${m}(s + ${n}), so ${k - m}s = ${(m - 1) * n}, s = ${s}.`, { k, n, m }, 'years');
      }
    },
  },
  {
    id: 'ages-sum',
    topic: 'ages',
    make: (rng) => {
      const b = int(rng, 5, 30);
      const d = int(rng, 2, 12);
      const sum = 2 * b + d;
      return q('ages-sum', 'ages', `Ali is ${d} years older than Bilal. Their ages add up to ${sum}. How old is Bilal?`, b,
        `(${sum} − ${d}) ÷ 2 = ${b}.`, { d, sum }, 'years');
    },
  },
  {
    id: 'ages-future',
    topic: 'ages',
    make: (rng) => {
      const son = int(rng, 4, 16);
      const k = int(rng, 2, 4);
      const n = int(rng, 3, 15);
      return q('ages-future', 'ages', `A mother is ${k} times as old as her ${son} year old daughter. How old will the mother be in ${n} years?`, k * son + n,
        `${k} × ${son} = ${k * son} now, + ${n} = ${k * son + n}.`, { k, son, n }, 'years');
    },
  },
  {
    id: 'multiply',
    topic: 'multiplication',
    make: (rng) => {
      const a = int(rng, 12, 99);
      const b = int(rng, 3, 9);
      return q('multiply', 'multiplication', `${a} × ${b} = ?`, a * b,
        `${Math.floor(a / 10) * 10} × ${b} = ${Math.floor(a / 10) * 10 * b}, plus ${a % 10} × ${b} = ${(a % 10) * b}.`, { a, b });
    },
  },
  {
    id: 'multiply-trick',
    topic: 'multiplication',
    make: (rng) => {
      const a = pick(rng, [25, 50, 125, 11, 15]);
      const b = a === 125 ? 8 * int(rng, 1, 9) : a === 11 ? int(rng, 12, 99) : 4 * int(rng, 3, 30);
      return q('multiply-trick', 'multiplication', `${a} × ${b} = ?`, a * b,
        a === 25 ? `× 25 is × 100 ÷ 4: ${b * 100} ÷ 4 = ${a * b}.` : a === 50 ? `× 50 is × 100 ÷ 2: ${b * 100} ÷ 2 = ${a * b}.`
          : a === 125 ? `× 125 is × 1000 ÷ 8: ${b * 1000} ÷ 8 = ${a * b}.` : `${a} × ${b} = ${a * b}.`, { a, b });
    },
  },
  {
    id: 'square',
    topic: 'multiplication',
    make: (rng) => {
      const n = int(rng, 11, 30);
      return q('square', 'multiplication', `What is ${n} squared?`, n * n, `${n} × ${n} = ${n * n}.`, { n });
    },
  },
  {
    id: 'division',
    topic: 'division',
    make: (rng) => {
      const b = int(rng, 3, 15);
      const ans = int(rng, 6, 60);
      return q('division', 'division', `${fmt(b * ans)} ÷ ${b} = ?`, ans, `${b} × ${ans} = ${fmt(b * ans)}.`, { a: b * ans, b });
    },
  },
  {
    id: 'share-equally',
    topic: 'division',
    make: (rng) => {
      const people = int(rng, 3, 12);
      const each = 50 * int(rng, 2, 40);
      return q('share-equally', 'division', `Rs ${fmt(people * each)} is shared equally among ${people} friends. How much does each get?`, each,
        `${fmt(people * each)} ÷ ${people} = Rs ${fmt(each)}.`, { total: people * each, people }, 'Rs');
    },
  },
  {
    id: 'fraction-of',
    topic: 'fractions',
    make: (rng) => {
      const [n, d] = pick(rng, [[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [1, 8], [3, 8], [5, 6]] as const);
      const y = d * int(rng, 3, 40);
      return q('fraction-of', 'fractions', `What is ${n}/${d} of ${fmt(y)}?`, (n * y) / d, `${fmt(y)} ÷ ${d} = ${y / d}, × ${n} = ${(n * y) / d}.`, { n, d, y });
    },
  },
  {
    id: 'fraction-add',
    topic: 'fractions',
    make: (rng) => {
      const [a, b, c, d] = pick(rng, [[1, 2, 1, 4], [1, 4, 1, 4], [3, 4, 1, 2], [1, 5, 1, 2], [2, 5, 1, 4], [1, 2, 1, 5], [3, 4, 1, 5], [1, 4, 3, 5], [1, 2, 3, 4]] as const);
      const ans = Math.round((a / b + c / d) * 100) / 100;
      return q('fraction-add', 'fractions', `${a}/${b} + ${c}/${d} = ? (as a decimal)`, ans, `${a / b} + ${c / d} = ${ans}.`, { a, b, c, d });
    },
  },
  {
    id: 'speed',
    topic: 'speed',
    make: (rng) => {
      const v = 5 * int(rng, 6, 24);
      const t = pick(rng, [2, 3, 4, 5, 6]);
      return q('speed', 'speed', `A bus covers ${v * t} km in ${t} hours. What is its average speed?`, v, `${v * t} ÷ ${t} = ${v} km/h.`, { d: v * t, t }, 'km/h');
    },
  },
  {
    id: 'distance-minutes',
    topic: 'speed',
    make: (rng) => {
      for (;;) {
        const v = pick(rng, [30, 40, 45, 48, 60, 72, 80, 90, 120]);
        const mins = pick(rng, [15, 20, 30, 40, 45, 90]);
        const ans = (v * mins) / 60;
        if (!Number.isInteger(ans)) continue;
        return q('distance-minutes', 'speed', `A car drives at ${v} km/h for ${mins} minutes. How far does it go?`, ans,
          `${v} km/h × ${mins}/60 h = ${ans} km.`, { v, mins }, 'km');
      }
    },
  },
  {
    id: 'time-minutes',
    topic: 'speed',
    make: (rng) => {
      for (;;) {
        const v = pick(rng, [30, 40, 45, 60, 80, 90, 120]);
        const mins = pick(rng, [20, 30, 40, 45, 60, 80, 90, 120]);
        const d = (v * mins) / 60;
        if (!Number.isInteger(d)) continue;
        return q('time-minutes', 'speed', `How many minutes does it take to travel ${d} km at ${v} km/h?`, mins,
          `${d} km ÷ ${v} km/h = ${d / v} h, × 60 = ${mins} minutes.`, { d, v }, 'min');
      }
    },
  },
  {
    id: 'work-together',
    topic: 'work',
    make: (rng) => {
      const [a, b] = pick(rng, [[3, 6], [4, 12], [6, 12], [10, 15], [12, 24], [20, 30], [6, 3], [12, 4], [5, 20], [8, 24], [15, 30], [9, 18]] as const);
      const ans = (a * b) / (a + b);
      return q('work-together', 'work', `Ahmed can paint a wall in ${a} hours and Usman in ${b} hours. Working together, how many hours will it take?`, ans,
        `Together: ${a} × ${b} ÷ (${a} + ${b}) = ${ans} hours.`, { a, b }, 'hours');
    },
  },
  {
    id: 'work-people',
    topic: 'work',
    make: (rng) => {
      const total = pick(rng, [24, 36, 48, 60, 72, 120]);
      const divisors = [2, 3, 4, 6, 8, 12].filter((x) => total % x === 0);
      const m1 = pick(rng, divisors);
      let m2 = pick(rng, divisors);
      if (m2 === m1) m2 = divisors[(divisors.indexOf(m1) + 1) % divisors.length];
      return q('work-people', 'work', `${m1} workers build a wall in ${total / m1} days. How many days will ${m2} workers take?`, total / m2,
        `${m1} × ${total / m1} = ${total} worker days. ${total} ÷ ${m2} = ${total / m2} days.`, { m1, d1: total / m1, m2 }, 'days');
    },
  },
  {
    id: 'average',
    topic: 'averages',
    make: (rng) => {
      const n = pick(rng, [3, 4, 5]);
      const avg = int(rng, 20, 90);
      const nums: number[] = [];
      for (let i = 0; i < n - 1; i += 1) nums.push(avg + int(rng, -15, 15));
      nums.push(avg * n - nums.reduce((s, x) => s + x, 0));
      return q('average', 'averages', `What is the average of ${nums.join(', ')}?`, avg,
        `Sum ${avg * n} ÷ ${n} = ${avg}.`, Object.fromEntries(nums.map((x, i) => [`x${i}`, x])));
    },
  },
  {
    id: 'average-missing',
    topic: 'averages',
    make: (rng) => {
      const avg = int(rng, 50, 90);
      const a = avg + int(rng, -12, 12);
      const b = avg + int(rng, -12, 12);
      const c = avg + int(rng, -12, 12);
      const d = 4 * avg - a - b - c;
      return q('average-missing', 'averages', `The average of 4 test marks is ${avg}. Three of them are ${a}, ${b} and ${c}. What is the fourth?`, d,
        `${avg} × 4 = ${4 * avg}. ${4 * avg} − ${a + b + c} = ${d}.`, { avg, a, b, c });
    },
  },
  {
    id: 'simple-interest',
    topic: 'interest',
    make: (rng) => {
      const p = 1000 * int(rng, 1, 20);
      const r = pick(rng, [2, 4, 5, 6, 8, 10, 12, 15]);
      const t = int(rng, 1, 5);
      const si = (p * r * t) / 100;
      return q('simple-interest', 'interest', `What is the simple interest on Rs ${fmt(p)} at ${r}% a year for ${t} year${t > 1 ? 's' : ''}?`, si,
        `${fmt(p)} × ${r} × ${t} ÷ 100 = Rs ${fmt(si)}.`, { p, r, t }, 'Rs');
    },
  },
  {
    id: 'ratio-share',
    topic: 'ratios',
    make: (rng) => {
      const [a, b] = pick(rng, [[1, 2], [2, 3], [3, 4], [3, 5], [2, 5], [4, 5], [1, 3], [5, 7]] as const);
      const unit = 10 * int(rng, 2, 50);
      const total = (a + b) * unit;
      return q('ratio-share', 'ratios', `Rs ${fmt(total)} is divided in the ratio ${a} : ${b}. What is the larger share?`, b * unit,
        `${fmt(total)} ÷ ${a + b} parts = ${unit} per part. ${b} × ${unit} = Rs ${fmt(b * unit)}.`, { total, a, b }, 'Rs');
    },
  },
  {
    id: 'ratio-boys-girls',
    topic: 'ratios',
    make: (rng) => {
      const [a, b] = pick(rng, [[2, 3], [3, 2], [3, 4], [4, 3], [5, 3], [1, 2]] as const);
      const unit = int(rng, 3, 12);
      return q('ratio-boys-girls', 'ratios', `In a class the ratio of boys to girls is ${a} : ${b}. There are ${a * unit} boys. How many girls are there?`, b * unit,
        `${a * unit} ÷ ${a} = ${unit} per part. ${b} × ${unit} = ${b * unit}.`, { a, b, boys: a * unit });
    },
  },
  {
    id: 'clock-angle',
    topic: 'clock-calendar',
    make: (rng) => {
      const h = int(rng, 1, 12);
      const m = pick(rng, [0, 30]);
      const raw = Math.abs(30 * (h % 12) - 5.5 * m);
      const ans = Math.min(raw, 360 - raw);
      return q('clock-angle', 'clock-calendar', `What is the smaller angle between the clock hands at ${h}:${m === 0 ? '00' : '30'}?`, ans,
        `Hour hand ${30 * (h % 12) + m / 2}°, minute hand ${6 * m}°. The gap is ${ans}°.`, { h, m }, '°');
    },
  },
  {
    id: 'minutes-between',
    topic: 'clock-calendar',
    make: (rng) => {
      const start = int(rng, 6 * 12, 16 * 12) * 5;
      const len = 5 * int(rng, 7, 40);
      const show = (t: number) => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
      return q('minutes-between', 'clock-calendar', `How many minutes are there from ${show(start)} to ${show(start + len)}?`, len,
        `Count to the next hour, then add the rest: ${len} minutes.`, { start, end: start + len }, 'min');
    },
  },
  {
    id: 'calendar-date',
    topic: 'clock-calendar',
    make: (rng) => {
      const first = int(rng, 0, 6);
      const target = int(rng, 0, 6);
      const nth = int(rng, 1, 4);
      const firstOccurrence = 1 + ((target - first + 7) % 7);
      const ans = firstOccurrence + 7 * (nth - 1);
      const ord = ['first', 'second', 'third', 'fourth'][nth - 1];
      return q('calendar-date', 'clock-calendar', `If the 1st of a month is a ${DAYS[first]}, on what date is the ${ord} ${DAYS[target]}?`, ans,
        `The first ${DAYS[target]} is on date ${firstOccurrence}. Add ${7 * (nth - 1)} days: ${ans}.`, { first, target, nth });
    },
  },
];

export function generateQuestion(topics: readonly QuickTopic[] | null, rng: Rng = Math.random): QuickQuestion {
  const pool = topics && topics.length ? TEMPLATES.filter((t) => topics.includes(t.topic)) : TEMPLATES;
  return pick(rng, pool.length ? pool : TEMPLATES).make(rng);
}

/** Accepts small typing differences: commas, spaces, a trailing unit, 0.5 vs .5. */
export function parseAnswer(raw: string): number | null {
  const cleaned = raw.replace(/[,\s]/g, '').replace(/[^0-9.\-]/g, '');
  if (!cleaned || cleaned === '.' || cleaned === '-') return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function isCorrect(question: QuickQuestion, raw: string): boolean {
  const n = parseAnswer(raw);
  return n !== null && Math.abs(n - question.answer) < 1e-9;
}
