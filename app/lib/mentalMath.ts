export type MathCategory = 'Unit prices' | 'Percentages' | 'Fractions' | 'Rates and time' | 'Averages and ratios' | 'Arithmetic';

export interface MathQuestion {
  id: string;
  category: MathCategory;
  prompt: string;
  answer: number;
  unit?: string;
  explanation: string;
  level: 'warm-up' | 'standard';
}

const show = (value: number) => Number(value.toFixed(4)).toString();

export const mathQuestions: MathQuestion[] = [
  { id: 'eggs-user-example', category: 'Unit prices', prompt: 'A dozen eggs cost ₹9. How much do 3 eggs cost?', answer: 2.25, unit: 'rupees', explanation: '3 eggs are one-quarter of a dozen. 9 / 4 = 2.25.', level: 'warm-up' },
  ...[20, 40, 60, 80, 120, 160, 200, 250, 360, 480].flatMap((base) => [5, 10, 12.5, 15, 20, 25, 35].map((rate): MathQuestion => ({
    id: `percent-${base}-${rate}`, category: 'Percentages', prompt: `What is ${rate}% of ${base}?`, answer: base * rate / 100,
    explanation: `1% is ${show(base / 100)}. Multiply by ${rate} to get ${show(base * rate / 100)}.`, level: rate === 5 || rate === 10 ? 'warm-up' : 'standard',
  }))),
  ...[9, 12, 18, 24, 30, 36, 42, 48].flatMap((price) => [3, 4, 6, 8, 9].map((quantity): MathQuestion => ({
    id: `eggs-${price}-${quantity}`, category: 'Unit prices', prompt: `12 eggs cost Rs ${price}. What do ${quantity} eggs cost?`, answer: price * quantity / 12, unit: 'rupees',
    explanation: `Each egg costs ${show(price / 12)} rupees. Multiply by ${quantity}.`, level: quantity === 6 ? 'warm-up' : 'standard',
  }))),
  ...[[3, 45], [4, 60], [5, 125], [8, 96]].flatMap(([count, price]) => [2, 5, 7, 10].map((quantity): MathQuestion => ({
    id: `pens-${count}-${price}-${quantity}`, category: 'Unit prices', prompt: `${count} pens cost Rs ${price}. What do ${quantity} pens cost?`, answer: price / count * quantity, unit: 'rupees',
    explanation: `One pen costs ${price / count} rupees. Multiply by ${quantity}.`, level: 'standard',
  }))),
  ...[24, 36, 48, 60, 72, 96].flatMap((base) => [[1, 2], [1, 3], [3, 4], [2, 3], [5, 8]].map(([numerator, denominator]): MathQuestion => ({
    id: `fraction-${base}-${numerator}-${denominator}`, category: 'Fractions', prompt: `What is ${numerator}/${denominator} of ${base}?`, answer: base * numerator / denominator,
    explanation: `${base} / ${denominator} × ${numerator} = ${show(base * numerator / denominator)}.`, level: numerator === 1 ? 'warm-up' : 'standard',
  }))),
  ...[200, 400, 800, 1200].flatMap((price) => [5, 10, 15, 20, 25].map((rate): MathQuestion => ({
    id: `discount-${price}-${rate}`, category: 'Percentages', prompt: `A Rs ${price} item has a ${rate}% discount. What is the sale price?`, answer: price * (100 - rate) / 100, unit: 'rupees',
    explanation: `Discount = Rs ${price * rate / 100}. Subtract it from Rs ${price}.`, level: 'standard',
  }))),
  ...[40, 50, 60, 72, 80, 90].flatMap((speed) => [15, 30, 45].map((minutes): MathQuestion => ({
    id: `distance-${speed}-${minutes}`, category: 'Rates and time', prompt: `At ${speed} km/h, how far do you travel in ${minutes} minutes?`, answer: speed * minutes / 60, unit: 'km',
    explanation: `${minutes} minutes is ${minutes}/60 of an hour. Distance = speed × time.`, level: minutes === 30 ? 'warm-up' : 'standard',
  }))),
  ...[36, 48, 60, 72].flatMap((total) => [4, 8, 12].map((difference): MathQuestion => ({
    id: `class-${total}-${difference}`, category: 'Averages and ratios', prompt: `A class has ${total} students, with ${difference} more boys than girls. How many boys?`, answer: (total + difference) / 2, unit: 'boys',
    explanation: `Boys = (${total} + ${difference}) / 2. Girls = ${(total - difference) / 2}. Check that the sum is ${total}.`, level: 'standard',
  }))),
  ...[7, 8, 10, 12, 15, 18, 20, 25].map((mean): MathQuestion => ({
    id: `mean-${mean}`, category: 'Averages and ratios', prompt: `Two numbers average ${mean}. One is ${mean - 3}. What is the other?`, answer: mean + 3,
    explanation: `Their total is 2 × ${mean} = ${mean * 2}. Subtract ${mean - 3}.`, level: 'standard',
  })),
  ...[5, 6, 9, 10, 25, 40].flatMap((spacing) => [8, 11, 21].map((count): MathQuestion => ({
    id: `pole-${spacing}-${count}`, category: 'Arithmetic', prompt: `${count} poles stand ${spacing} metres apart in a straight line. How far is the first from the last?`, answer: (count - 1) * spacing, unit: 'metres',
    explanation: `${count} poles make ${count - 1} gaps. (${count} - 1) × ${spacing} = ${(count - 1) * spacing}.`, level: 'standard',
  }))),
  ...[800, 1100, 1200, 1500, 2400, 3500].flatMap((monthly) => [6, 12].map((months): MathQuestion => ({
    id: `income-${monthly}-${months}`, category: 'Rates and time', prompt: `You save Rs ${monthly} each month. How much after ${months} months?`, answer: monthly * months, unit: 'rupees',
    explanation: `${monthly} × ${months} = ${monthly * months}. No interest is included.`, level: 'standard',
  }))),
  ...[200, 400, 600, 800, 1000].flatMap((base) => [5, 10, 15, 20].map((rate): MathQuestion => ({
    id: `reverse-${base}-${rate}`, category: 'Percentages', prompt: `${show(base * rate / 100)} is ${rate}% of which number?`, answer: base,
    explanation: `${show(base * rate / 100)} × 100 / ${rate} = ${base}.`, level: 'standard',
  }))),
  ...[500, 1700, 1800, 2000, 8000, 10000, 50000, 70000].map((amount): MathQuestion => ({
    id: `two-and-half-${amount}`, category: 'Percentages', prompt: `For an arithmetic exercise, calculate 2.5% of Rs ${amount}.`, answer: amount / 40, unit: 'rupees',
    explanation: `2.5% is 1/40, so divide ${amount} by 40. This is a rate calculation, not a decision about religious liability.`, level: 'standard',
  })),
  ...[60, 100, 120, 200, 230, 300].map((total): MathQuestion => ({
    id: `ratio-${total}`, category: 'Averages and ratios', prompt: `Share Rs ${total} in the ratio 2:3:5. What is the largest share?`, answer: total / 2, unit: 'rupees',
    explanation: `There are 10 parts. The largest share is 5/10 of ${total}. The other shares are ${total / 5} and ${show(total * 3 / 10)}.`, level: 'standard',
  })),
  { id: 'fraction-add-sixths', category: 'Fractions', prompt: 'What is 1/3 + 1/2?', answer: 5 / 6, explanation: 'Use sixths: 2/6 + 3/6 = 5/6. A fraction or 0.83 is accepted.', level: 'standard' },
  { id: 'fraction-add-twelfths', category: 'Fractions', prompt: 'What is 3/4 + 2/3?', answer: 17 / 12, explanation: '9/12 + 8/12 = 17/12, or 1 5/12.', level: 'standard' },
  { id: 'decimal-product', category: 'Arithmetic', prompt: 'What is 0.6 × 0.5?', answer: 0.3, explanation: 'Half of 0.6 is 0.3.', level: 'warm-up' },
  { id: 'order-operations', category: 'Arithmetic', prompt: 'What is 2 + 2 × 2?', answer: 6, explanation: 'Multiply first: 2 + 4 = 6.', level: 'warm-up' },
  { id: 'negative-subtraction', category: 'Arithmetic', prompt: 'What is 5 - (-1)?', answer: 6, explanation: 'Subtracting a negative means adding: 5 + 1 = 6.', level: 'warm-up' },
];

export function parseNumericAnswer(input: string): number | null {
  const value = input.trim().replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0)).replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660));
  if (!value || value.length > 80) return null;
  const mixed = value.match(/^([+-]?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const denominator = Number(mixed[3]);
    if (!denominator) return null;
    const result = (Math.abs(Number(mixed[1])) + Number(mixed[2]) / denominator) * (mixed[1].startsWith('-') ? -1 : 1);
    return Number.isFinite(result) ? result : null;
  }
  const fraction = value.match(/^([+-]?\d+)\s*\/\s*(\d+)$/);
  if (fraction) {
    const denominator = Number(fraction[2]);
    const result = Number(fraction[1]) / denominator;
    return denominator && Number.isFinite(result) ? result : null;
  }
  if (!/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value)) return null;
  const result = Number(value);
  return Number.isFinite(result) ? result : null;
}

export function isCorrectAnswer(input: string, expected: number): boolean {
  const actual = parseNumericAnswer(input);
  return actual !== null && Math.abs(actual - expected) <= 0.005000001;
}
