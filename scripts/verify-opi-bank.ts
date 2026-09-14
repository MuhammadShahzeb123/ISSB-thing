import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { OPI_BANK } from '../app/opi/content/bank.generated.ts';
import {
  DIMENSION_CONTENT,
  generateOpiBank,
  GENERATED_CONTENT_VERSION,
} from '../app/opi/content/generator.ts';
import {
  CONTENT_VERSION,
  LIKERT_OPTIONS,
  PRACTICE_DIMENSIONS,
} from '../app/opi/content/model.ts';
import { selectPracticeStatements, SESSION_SIZES } from '../app/opi/session.ts';

assert.equal(OPI_BANK.length, 1_000, 'the stable bank must contain exactly 1,000 statements');
assert.equal(new Set(OPI_BANK.map((statement) => statement.id)).size, 1_000, 'IDs must be unique');
assert.equal(
  new Set(OPI_BANK.map((statement) => statement.text)).size,
  1_000,
  'statement texts must be unique',
);
assert.equal(PRACTICE_DIMENSIONS.length, 10, 'exactly ten dimensions must be disclosed');
assert.equal(CONTENT_VERSION, GENERATED_CONTENT_VERSION, 'content versions must stay aligned');
assert.deepEqual(OPI_BANK, generateOpiBank(), 'checked-in bank must match deterministic generation');

const expectedDimensionIds = new Set(PRACTICE_DIMENSIONS.map((dimension) => dimension.id));
assert.deepEqual(
  new Set(DIMENSION_CONTENT.map((dimension) => dimension.id)),
  expectedDimensionIds,
  'runtime dimension metadata and authored content must cover the same dimensions',
);

for (const dimension of PRACTICE_DIMENSIONS) {
  const statements = OPI_BANK.filter((statement) => statement.dimension === dimension.id);
  const direct = statements.filter((statement) => statement.polarity === 'direct');
  const reverse = statements.filter((statement) => statement.polarity === 'reverse');

  assert.equal(statements.length, 100, `${dimension.id} must contain 100 statements`);
  assert.equal(direct.length, 50, `${dimension.id} must contain 50 direct-keyed statements`);
  assert.equal(reverse.length, 50, `${dimension.id} must contain 50 reverse-keyed statements`);
  assert.equal(
    new Set(statements.map((statement) => statement.context)).size,
    10,
    `${dimension.id} must use ten context variants`,
  );
}

for (const statement of OPI_BANK) {
  assert.match(statement.id, /^opi-[a-z]+-\d{3}$/);
  assert.ok(expectedDimensionIds.has(statement.dimension), `unknown dimension: ${statement.dimension}`);
  assert.ok(['direct', 'reverse'].includes(statement.polarity), `invalid polarity: ${statement.id}`);
  assert.equal(statement.contentVersion, CONTENT_VERSION);
  assert.equal(statement.text.trim(), statement.text);
  assert.match(statement.text, /\.$/);
}

assert.deepEqual(
  LIKERT_OPTIONS.map((option) => option.value),
  [1, 2, 3, 4, 5],
  'the response scale must contain the integers 1 through 5',
);
assert.equal(
  new Set(LIKERT_OPTIONS.map((option) => option.label)).size,
  LIKERT_OPTIONS.length,
  'response labels must be unique',
);

for (const size of SESSION_SIZES) {
  const sample = selectPracticeStatements(OPI_BANK, size, () => 0.314159);
  assert.equal(sample.length, size, `${size}-statement set must contain the requested size`);
  assert.equal(new Set(sample.map((statement) => statement.id)).size, size);
  for (const dimension of PRACTICE_DIMENSIONS) {
    assert.equal(
      sample.filter((statement) => statement.dimension === dimension.id).length,
      size / PRACTICE_DIMENSIONS.length,
      `${size}-statement set must cover ${dimension.id} evenly`,
    );
  }
  const directCount = sample.filter((statement) => statement.polarity === 'direct').length;
  assert.equal(directCount, size / 2, `${size}-statement set must balance polarity`);
}

const prohibitedBankTerms = [
  /\bpercentile\b/i,
  /\blie detector\b/i,
  /\bdiagnos(?:e|is|tic)\b/i,
  /\bemotional[- ]stability\b/i,
  /\bselection (?:chance|likelihood|probability)\b/i,
  /\b(?:best|ideal|recommended) (?:answer|response|branch|job)\b/i,
];

for (const statement of OPI_BANK) {
  for (const pattern of prohibitedBankTerms) {
    assert.doesNotMatch(statement.text, pattern, `${statement.id} contains prohibited framing`);
  }
}

const appRoot = fileURLToPath(new URL('../app/opi', import.meta.url));
const claimPatterns = [
  /\b(?:you|your) (?:pass|fail)(?:ed|s|ing)?\b/i,
  /\bpercentile\b/i,
  /\blie detector\b/i,
  /\bdiagnos(?:e|is|tic)\b/i,
  /\bemotional[- ]stability\b/i,
  /\bselection (?:chance|likelihood|probability)\b/i,
  /\b(?:best|ideal|recommended) (?:answer|response|branch|job)\b/i,
  /\bpredict(?:s|ed|ing)? selection\b/i,
];

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return ['.ts', '.tsx'].includes(extname(path)) ? [path] : [];
  });
}

function isNegated(line: string, matchIndex: number) {
  const prefix = line.slice(Math.max(0, matchIndex - 80), matchIndex).toLowerCase();
  return /\b(?:no|not|never|cannot|does not|do not|without)\b/.test(prefix);
}

for (const file of sourceFiles(appRoot)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    claimPatterns.forEach((pattern) => {
      const match = pattern.exec(line);
      if (match && !isNegated(line, match.index)) {
        assert.fail(`${file}:${index + 1} contains prohibited claim framing: ${match[0]}`);
      }
    });
  });
}

console.log('OPI bank, coverage, scale, claim-safety, and subset checks passed.');
