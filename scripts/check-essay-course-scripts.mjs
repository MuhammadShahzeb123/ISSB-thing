#!/usr/bin/env node
/**
 * Checks the essay course narration scripts (public/audio/essay-course/*.txt,
 * or a folder passed as the first argument) before they are read aloud in
 * Google AI Studio. Rules: plain UTF-8, 220 to 450 words, numbers spelled
 * out, and none of these characters: - – — : ; ( ) [ ] { } / \ * • · & # or digits.
 * Does not call any TTS service.
 */
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve(process.argv[2] ?? 'public/audio/essay-course');
const FORBIDDEN = [
  ['-', 'hyphen'], ['\u2010', 'hyphen'], ['\u2011', 'hyphen'], ['\u2012', 'dash'], ['\u2013', 'en dash'],
  ['\u2014', 'em dash'], ['\u2015', 'dash'], ['\u2212', 'minus'], [':', 'colon'], [';', 'semicolon'],
  ['(', 'bracket'], [')', 'bracket'], ['[', 'bracket'], [']', 'bracket'], ['{', 'bracket'], ['}', 'bracket'],
  ['/', 'slash'], ['\\', 'backslash'], ['*', 'asterisk'], ['\u2022', 'bullet'], ['\u00b7', 'middle dot'],
  ['&', 'ampersand'], ['#', 'hash'], ['\u2026', 'ellipsis'],
];
const MIN_WORDS = 220;
const MAX_WORDS = 450;

const files = fs.readdirSync(dir).filter((name) => name.endsWith('.txt')).sort();
if (files.length === 0) {
  console.error(`No .txt scripts in ${dir}`);
  process.exit(1);
}

let failures = 0;
for (const name of files) {
  const buffer = fs.readFileSync(path.join(dir, name));
  const problems = [];
  const text = new TextDecoder('utf-8', { fatal: false }).decode(buffer);
  if (Buffer.from(text, 'utf8').compare(buffer) !== 0) problems.push('not valid UTF-8');
  if (text.charCodeAt(0) === 0xfeff) problems.push('has a byte order mark');
  text.split('\n').forEach((line, index) => {
    for (const [char, label] of FORBIDDEN) {
      const at = line.indexOf(char);
      if (at >= 0) problems.push(`line ${index + 1}: ${label} near "${line.slice(Math.max(0, at - 20), at + 20)}"`);
    }
    const digit = /\d/u.exec(line);
    if (digit) problems.push(`line ${index + 1}: digit near "${line.slice(Math.max(0, digit.index - 20), digit.index + 20)}"`);
    if (/^\s*[-*+•]/u.test(line)) problems.push(`line ${index + 1}: bullet`);
    if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(line)) problems.push(`line ${index + 1}: control character`);
  });
  const words = text.trim().split(/\s+/u).filter(Boolean).length;
  if (words < MIN_WORDS || words > MAX_WORDS) problems.push(`${words} words, want ${MIN_WORDS} to ${MAX_WORDS}`);
  if (problems.length) {
    failures += 1;
    console.log(`FAIL ${name} (${words} words)`);
    for (const problem of problems) console.log(`  ${problem}`);
  } else {
    console.log(`ok   ${name} (${words} words)`);
  }
}

console.log(failures ? `\n${failures} of ${files.length} scripts failed.` : `\nAll ${files.length} scripts passed.`);
process.exit(failures ? 1 : 0);
