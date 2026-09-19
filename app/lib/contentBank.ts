import type { ExtractedPhoto } from './extractedPhotos';
import { extractedBatchA } from './extractedBatchA';
import { extractedBatchB } from './extractedBatchB';
import { pictureSentenceSets, pictureStoryPrompts, pictureWordPages, lifeEventPrompts, type SourcePromptSet } from '../picturestest/pictureSourceData';
import { biodataSections } from './biodata';
import { topicPages, sourcePlanningScenarios } from './gtoData';
import { knowledgePages, sourceRankEquivalency, sourceAwardTable } from './sourceKnowledge';
import { interviewSourcePages } from './interviewSource';
import { sourceMathPages } from './sourceMath';
import { getPhotoMathAnswer } from './sourceMathAnswers';

const photos = new Map<string, ExtractedPhoto>();
function addSection(fileName: string, section: ExtractedPhoto['sections'][number], note?: string) {
  const photo = photos.get(fileName) ?? { fileName, sections: [], issues: [] };
  photo.sections.push(section);
  if (note && !photo.issues.includes(note)) photo.issues.push(note);
  photos.set(fileName, photo);
}

for (const set of pictureSentenceSets) addSection(set.sourceImage, {
  id: set.id, kind: 'sentence-completion', title: set.title, language: set.language, sourcePage: set.sourcePage, seconds: set.seconds,
  items: set.prompts.map((prompt) => ({ prompt })),
}, set.note);
for (const page of pictureWordPages) addSection(page.sourceImage, {
  id: `wat-page-${page.sourcePage}`, kind: 'wat', title: `Word association, page ${page.sourcePage}`, language: 'en', sourcePage: page.sourcePage,
  items: page.words.map((prompt) => ({ prompt })),
});
addSection('IMG20260919120031.jpg', { id: 'story-pointers', kind: 'story', title: 'Story pointers', language: 'en', sourcePage: '21', items: pictureStoryPrompts.map(({ prompt }) => ({ prompt })) }, 'The source repeats pointer 16 at number 23. Both positions are preserved.');
addSection('IMG20260919120035.jpg', { id: 'life-events', kind: 'biodata', title: 'Personal life-event reflections', language: 'en', sourcePage: '22', items: lifeEventPrompts.map((prompt) => ({ prompt })) });
for (const section of biodataSections) addSection(section.sourceImage, {
  id: `biodata-${section.id}`, kind: 'biodata', title: section.title, language: 'en', sourcePage: section.sourcePage,
  items: section.fields?.map((prompt) => ({ prompt })) ?? (section.columns ?? []).map((prompt) => ({ prompt, detail: `Rows: ${(section.rows ?? []).join('; ')}.` })),
});
for (const [index, page] of topicPages.entries()) addSection(page.sourceImage, {
  id: `gto-topic-page-${index}`, kind: page.kind, title: `${page.kind === 'lecture' ? 'Lecture' : 'Discussion'} topics`, language: page.language, sourcePage: page.sourcePage,
  items: page.topics.map((prompt) => ({ prompt })),
}, page.note);
for (const scenario of sourcePlanningScenarios) {
  addSection(scenario.sourceImage, {
    id: `planning-${scenario.id}`, kind: 'planning', title: scenario.title, language: 'en', sourcePage: scenario.sourcePage,
    items: [{ prompt: scenario.brief }, ...scenario.facts.map((prompt) => ({ prompt })), ...scenario.prompts.map((prompt) => ({ prompt }))],
  }, scenario.caveats.join(' '));
  addSection(scenario.sourceImage, { id: `planning-${scenario.id}-ur`, kind: 'planning', title: 'Urdu scenario summary', language: 'ur', sourcePage: scenario.sourcePage, items: [{ prompt: scenario.sourceText }] });
}
for (const [index, page] of knowledgePages.entries()) addSection(page.sourceImage, {
  id: `knowledge-page-${index}`, kind: 'knowledge', title: `${page.category} study cards`, language: 'en', sourcePage: page.sourcePage,
  items: page.cards.map(([prompt, answer]) => ({ prompt, answer })),
}, page.note);
for (const [index, page] of interviewSourcePages.entries()) addSection(page.sourceImage, {
  id: `interview-page-${index}`, kind: 'guidance', title: 'Interview questions from the notes', language: page.language, sourcePage: page.sourcePage,
  items: page.prompts.map((prompt) => ({ prompt })),
}, page.note);
for (const page of sourceMathPages) addSection(page.sourceImage, {
  id: `math-page-${page.sourcePage.replace(/\W/g, '-')}`, kind: 'math', title: 'Mental maths with worked answers', language: 'en', sourcePage: page.sourcePage,
  items: page.questions.map((item) => ({ prompt: `${item.number}. ${item.prompt}`, answer: item.answer, detail: item.method })),
});
addSection('IMG20260919120145.jpg', { id: 'source-rank-comparison', kind: 'knowledge', title: 'Rank comparison in the source', language: 'en', sourcePage: '68', items: sourceRankEquivalency.map(([army, navy, air]) => ({ prompt: `Army: ${army}`, answer: `Navy: ${navy}. Air Force: ${air}.`, detail: 'Source comparison, not identical status across services. Midshipman is a training-stage rank.' })) });
addSection('IMG20260919120148.jpg', { id: 'source-award-table', kind: 'knowledge', title: 'Original ten-person award table', language: 'en', sourcePage: '70', items: sourceAwardTable.map(([name, unit, year, place]) => ({ prompt: name, answer: `Printed unit: ${unit}. Year: ${year}. Place: ${place}.`, detail: 'Historical source transcription. Use the researched 11-person collection for verified stories; the Rashid Minhas row has factual errors.' })) });

const additionalPhotos: ExtractedPhoto[] = [...extractedBatchA, ...extractedBatchB].map((photo) => ({
  ...photo,
  sections: photo.sections.map((section) => {
    if (photo.fileName === 'IMG20260919120345.jpg' || section.id.includes('120335-right-')) return { ...section, kind: 'guidance' as const };
    if (section.kind !== 'math') return section;
    return { ...section, items: section.items.map((item, index) => {
      const worked = getPhotoMathAnswer(section.id, index);
      return worked ? { ...item, answer: worked.answer, detail: [item.detail, worked.detail].filter(Boolean).join(' ') } : item;
    }) };
  }),
}));

export const sourcePhotos: ExtractedPhoto[] = [...photos.values(), ...additionalPhotos].sort((a, b) => a.fileName.localeCompare(b.fileName));

export const allSentenceSets: SourcePromptSet[] = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'sentence-completion' && section.items.length > 0).map((section) => ({
  id: section.id, title: section.title, language: section.language, sourceImage: photo.fileName, sourcePage: section.sourcePage,
  seconds: section.seconds ?? 360, prompts: section.items.map((item) => item.prompt), note: photo.issues.join(' ') || undefined,
})));

export const allTopics = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'lecture' || section.kind === 'discussion').flatMap((section) => section.items.map((item, index) => ({
  id: `${section.id}-${index + 1}`, title: item.prompt, kind: section.kind, language: section.language, sourceImage: photo.fileName, sourcePage: section.sourcePage, note: item.detail,
}))));

export const allPhotoWords = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'wat').flatMap((section) => section.items.map((item) => ({ word: item.prompt, sourceImage: photo.fileName }))));
export const allPhotoStories = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'story').flatMap((section) => section.items.map((item, index) => ({ id: `${section.id}-${index}`, prompt: item.prompt, language: section.language, sourceImage: photo.fileName }))));
export const sourceItemCount = sourcePhotos.reduce((count, photo) => count + photo.sections.reduce((sum, section) => sum + section.items.length, 0), 0);
