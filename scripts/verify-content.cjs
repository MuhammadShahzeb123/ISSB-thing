const loadModule = process.getBuiltinModule('module').createRequire(__filename);
const assert = loadModule('node:assert/strict');
const fs = loadModule('node:fs');
const path = loadModule('node:path');
const ts = loadModule('typescript');

loadModule.extensions['.ts'] = (module, fileName) => {
  const source = fs.readFileSync(fileName, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } });
  module._compile(output.outputText, fileName);
};

const root = path.resolve(__dirname, '..');
const { mathQuestions, parseNumericAnswer, isCorrectAnswer } = loadModule('../app/lib/mentalMath.ts');
assert.ok(mathQuestions.length >= 180, 'Provide a substantial mental-math bank.');
assert.equal(new Set(mathQuestions.map((item) => item.id)).size, mathQuestions.length);
assert.ok(mathQuestions.every((item) => Number.isFinite(item.answer) && item.explanation && item.prompt));
assert.equal(mathQuestions.find((item) => item.id === 'eggs-user-example').answer, 2.25);
assert.equal(mathQuestions.find((item) => item.id === 'percent-20-5').answer, 1);
assert.equal(parseNumericAnswer(' 2.25 '), 2.25);
assert.equal(parseNumericAnswer('1/4'), 0.25);
assert.equal(parseNumericAnswer('1 1/4'), 1.25);
assert.equal(parseNumericAnswer('-1 1/4'), -1.25);
assert.equal(parseNumericAnswer('0'), 0);
for (const invalid of ['', ' ', '1/0', 'abc', '2abc', 'Infinity', 'NaN', '0x10', '1,2', '--2']) {
  assert.equal(parseNumericAnswer(invalid), null, `Reject invalid input: ${invalid}`);
}
assert.ok(isCorrectAnswer('0.33', 1 / 3));
assert.ok(!isCorrectAnswer('0.3', 1 / 3));
assert.ok(!isCorrectAnswer('', 0));
assert.ok(!isCorrectAnswer('2.3', 2.25));
console.log(`Mental maths: ${mathQuestions.length} questions and answer-parser checks passed.`);

const { sourcePhotos, allSentenceSets } = loadModule('../app/lib/contentBank.ts');
const files = fs.readdirSync(path.join(root, 'Pictures')).filter((name) => /\.(jpg|jpeg|png|webp)$/i.test(name)).sort();
assert.equal(files.length, 52);
assert.deepEqual(sourcePhotos.map((photo) => photo.fileName).sort(), files, 'Every supplied photo must be represented once.');
assert.ok(sourcePhotos.every((photo) => photo.sections.length > 0));
const sectionIds = sourcePhotos.flatMap((photo) => photo.sections.map((section) => section.id));
assert.equal(new Set(sectionIds).size, sectionIds.length, 'Source section IDs must be unique.');
assert.ok(sourcePhotos.every((photo) => photo.sections.every((section) => section.items.every((item) => item.prompt.trim()))));
const emptySections = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => !section.items.length).map((section) => ({ id: section.id, issues: photo.issues })));
assert.deepEqual(emptySections.map((section) => section.id), ['batch-b-120330-p121-urdu-set-2-cropped']);
assert.ok(emptySections.every((section) => section.issues.length > 0), 'Unreadable material must be explicitly documented.');
assert.ok(allSentenceSets.every((set) => set.prompts.length > 0 && !set.id.includes('schedule')), 'Empty or timetable-only sections must not appear as drills.');
assert.ok(allSentenceSets.some((set) => set.language === 'ur'));
assert.ok(allSentenceSets.some((set) => set.language === 'en'));
assert.ok(allSentenceSets.reduce((sum, set) => sum + set.prompts.length, 0) >= 450);
for (const set of allSentenceSets.filter((set) => /^english-(?:[2-9]|10)$/.test(set.id))) assert.equal(set.prompts.length, 26);
console.log(`Photo coverage: ${sourcePhotos.length}/${files.length}; ${sectionIds.length} sections; ${allSentenceSets.length} sentence sets.`);

const { militaryStories } = loadModule('../app/lib/militaryStories.ts');
assert.equal(militaryStories.length, 11);
assert.equal(new Set(militaryStories.map((story) => story.id)).size, 11);
assert.equal(militaryStories.filter((story) => story.award === 'Nishan-e-Haider').length, 11);
assert.ok(militaryStories.every((story) => story.what && story.how && story.result && story.death && story.deathDate && story.memory && story.sources.length));
const { affairsStories, affairsAsOf, affairsSections } = loadModule('../app/lib/affairsStories.ts');
const { regionPrimer } = loadModule('../app/lib/currentAffairs.ts');
assert.ok(affairsStories.length >= 30, 'Keep a substantial current-affairs story bank.');
assert.equal(new Set(affairsStories.map((story) => story.id)).size, affairsStories.length);
for (const section of Object.keys(affairsSections)) {
  assert.ok(affairsStories.filter((story) => story.section === section).length >= 8, `Section ${section} needs stories.`);
}
assert.ok(regionPrimer.length >= 16);
for (const story of affairsStories) {
  assert.ok(story.title && story.hook && story.story && story.question && story.keyFacts.length && story.sources.length, story.id);
  assert.ok(story.story.split(/\n\n+/).length >= 8, `${story.id} should read as a story in short paragraphs.`);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(story.date) && story.date <= affairsAsOf, story.id);
  for (const source of story.sources) {
    assert.ok(/^https?:\/\//.test(source.url), `${story.id}: ${source.url}`);
    assert.ok(source.publishedAt && source.publishedAt <= affairsAsOf, `${story.id}: ${source.publishedAt}`);
  }
}
for (const text of [JSON.stringify(sourcePhotos), JSON.stringify(militaryStories), JSON.stringify(affairsStories)]) {
  assert.ok(!/[\u2013\u2014]/.test(text), 'Study content must not contain en or em dashes.');
  assert.ok(!/<img\b|data:image\//i.test(text), 'Photo content must be text, not embedded images.');
}
console.log(`Interview content: ${militaryStories.length} sourced stories, ${affairsStories.length} current-affairs stories and ${regionPrimer.length} regional primers passed.`);
