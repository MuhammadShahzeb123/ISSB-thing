type WorkedAnswer = { answer: string; detail: string };
const result = (answer: string, method: string): WorkedAnswer => ({ answer, detail: `Calculated practice answer, not printed in the source. ${method}` });
const money = (value: number) => `Rs ${Number(value.toFixed(4))}`;

const ratioInputs = [
  { total: 60, parts: [2, 3, 5] }, { total: 60, parts: [4, 8] },
  { total: 20, parts: [] }, { total: 230, parts: [2, 3, 5] },
  { total: 20, parts: [1, 3] }, { total: 200, parts: [5, 7, 8] },
  { total: 110, parts: [2, 3, 5] }, { total: 20, parts: [2, 4, 5] },
  { total: 100, parts: [2, 5, 20] },
];
const ratioAnswers = ratioInputs.map(({ total, parts }) => {
  if (!parts.length) return result('Rs 12.50 and Rs 7.50', 'For a total of 20 and difference of 5: (20 + 5)/2 and (20 - 5)/2.');
  const sum = parts.reduce((value, part) => value + part, 0);
  return result(parts.map((part) => money(total * part / sum)).join(', '), `Total ratio parts = ${sum}. One part = ${total}/${sum}; multiply by each ratio part. Recurring decimals are rounded here to four places.`);
});
const zakatAmounts = [70000, 50000, 975, 4200, 10000, 11700, 2750, 3400, 300, 1800, 1750, 1950, 2000, 11900, 11000, 2500];
const zakatNote = 'This arithmetic exercise assumes a 2.5% rate. Actual religious liability also depends on eligibility, thresholds, asset type and holding period.';
const zakatAnswers = [
  result('Rs 12.50', `500 / 40. ${zakatNote}`), result('Rs 42.50', `1700 / 40. ${zakatNote}`),
  result('Rs 200', `8000 / 40. ${zakatNote}`), result('Rs 10,000', `250 × 40. ${zakatNote}`),
  result('Rs 80,000', `2000 × 40. ${zakatNote}`), result('Rs 45', `1800 / 40. ${zakatNote}`),
  result(zakatAmounts.map((amount) => `${amount}: ${money(amount / 40)}`).join('; '), `Divide each amount by 40. ${zakatNote}`),
];
const speedAnswers = [
  result('7 km', '120 × 3.5 / 60.'), result('20 km', '30 × 40 / 60.'), result('36 km', '360 × 6 / 60.'),
  result('465 km', '1800 × 15.5 / 60.'), result('2.25 km', '30 × 4.5 / 60.'), result('50 km', '75 × 40 / 60.'),
  result('Ambiguous: 180 km if 45 km is the distance covered in 15 minutes; 45 km if 45 km/h is the actual speed.', 'The printed question mixes distance with a speed unit. Ask for clarification.'),
  result('Ambiguous: 540 km if 180 km is covered in 2 minutes; 18 km if the speed is 180 km/h for 6 minutes.', 'The printed question mixes distance with a speed unit. Ask for clarification.'),
  result('13 minutes 20 seconds', '40 / 180 hours = 2/9 hour. Multiply by 60 to get 13⅓ minutes.'),
  result('2 minutes', '30 / 900 hours × 60.'), result('3.5 hours', '840 / 240.'), result('63 km', '315 × 12 / 60.'),
];
const eggAnswers = [
  result('Rs 55', '22 × 30/12.'), result('Rs 4.25', '17 × 3/12.'), result('Rs 11.25', '9 × 15/12.'),
  result('Rs 75', '30 × 2.5 dozen.'), result('Rs 27', '9 × 3 dozen.'), result('Rs 31.50', '27 × 14/12.'),
  result('Rs 4', '40 × 6/60.'), result('2 eggs', 'One egg costs 30/12 = Rs 2.50; 5 / 2.5 = 2.'),
  ...[
    { price: 17, quantities: [9, 7, 6, 4, 5, 3, 8] }, { price: 22, quantities: [4, 3, 8, 6, 9, 11, 24, 30] },
    { price: 9, quantities: [11, 3, 4, 8, 24, 30, 42] }, { price: 21, quantities: [3, 4, 6, 8, 9, 1, 24, 30, 42] },
    { price: 20, quantities: [3, 4, 6, 8, 9, 24, 30, 42, 36] },
  ].map(({ price, quantities }) => result(quantities.map((quantity) => `${quantity} eggs: ${money(price * quantity / 12)}`).join('; '), `Price = quantity × ${price}/12. Recurring decimals are shown to four places. Any unclear quantity in the source still needs confirmation.`)),
];

const worked: Record<string, WorkedAnswer[]> = {
  'batch-a-p88-ratio': ratioAnswers,
  'batch-a-p88-zakat': zakatAnswers,
  'batch-a-p89-speed': speedAnswers,
  'batch-a-p89-eggs': eggAnswers,
};

export function getPhotoMathAnswer(sectionId: string, index: number): WorkedAnswer | undefined {
  return worked[sectionId]?.[index];
}
