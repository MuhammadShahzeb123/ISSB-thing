import type { ExtractedPhoto } from './extractedPhotos';
import { sourcePhotos } from './contentBank';

/**
 * The practice library regroups every photo-transcribed section by what a
 * candidate wants to do (sit a timed test or revise a subject) instead of by
 * the photo it came from. Every section in `sourcePhotos` lands in exactly one
 * set; the source photo and page stay attached for traceability.
 */

export type LibraryMode = 'sentence' | 'wat' | 'story' | 'topic' | 'planning' | 'flashcards' | 'questions' | 'reference';
export type LibraryGroup = 'practice' | 'study';

export type CollectionSlug =
  | 'sentence-english' | 'sentence-urdu' | 'wat' | 'stories' | 'gto' | 'maths' | 'interview'
  | 'science' | 'abbreviations' | 'pakistan' | 'world' | 'islamiat' | 'forces' | 'issb-guide';

export interface LibraryCollection {
  slug: CollectionSlug;
  group: LibraryGroup;
  title: string;
  short: string;
  blurb: string;
  /** Theme token used for the card accent. */
  accent: 'yellow' | 'blue' | 'pink' | 'lime' | 'red' | 'purple';
  mark: string;
  howTo: string;
}

export interface LibraryItem {
  prompt: string;
  answer?: string;
  detail?: string;
  /** Sub-heading used when several source sections are merged into one set. */
  group?: string;
}

export interface LibrarySet {
  id: string;
  collection: CollectionSlug;
  mode: LibraryMode;
  title: string;
  subtitle?: string;
  language: 'en' | 'ur';
  sourcePage: string;
  sourceImage: string;
  seconds?: number;
  items: LibraryItem[];
  notes: string[];
}

export const collections: LibraryCollection[] = [
  { slug: 'sentence-english', group: 'practice', title: 'Sentence completion: English', short: 'SCT English', accent: 'yellow', mark: 'SC', blurb: 'Nine 26-stem sets, 6 minutes each, as printed in the notes.', howTo: 'Write the first natural ending that comes to mind. Press Enter to move on. The clock runs for the whole set, as it does on test day.' },
  { slug: 'sentence-urdu', group: 'practice', title: 'Sentence completion: Urdu', short: 'SCT Urdu', accent: 'yellow', mark: 'اردو', blurb: 'Nine Urdu 26-stem sets, 6 minutes each.', howTo: 'جملہ اپنے پہلے فطری خیال سے مکمل کریں۔ Enter دبا کر اگلے جملے پر جائیں۔' },
  { slug: 'wat', group: 'practice', title: 'Word association test', short: 'WAT', accent: 'blue', mark: 'W', blurb: 'Five pages of source words. One word at a time, with an automatic countdown.', howTo: 'Each word shows for a fixed time. Type one short, positive, natural sentence before it moves on. Pause any time.' },
  { slug: 'stories', group: 'practice', title: 'Pointer stories & life events', short: 'Stories', accent: 'pink', mark: 'ST', blurb: '25 pointer-story openings and 24 life-event topics from the biodata column.', howTo: 'Pick a prompt or press Random. The 4-minute clock matches the pointer-story and event timings in the schedule.' },
  { slug: 'gto', group: 'practice', title: 'GTO: discussion, lecture & planning', short: 'GTO indoor', accent: 'lime', mark: 'GT', blurb: 'Group discussion motions in English and Urdu, and the bridge-repair planning exercise.', howTo: 'Choose a topic, then a format: a 2-minute lecture or a 15-minute discussion. Write quick notes while the clock runs.' },
  { slug: 'maths', group: 'practice', title: 'Mental maths', short: 'Maths', accent: 'red', mark: '±', blurb: 'Percentages, ratios, zakat, speed, eggs, poles and more, with worked answers where they exist.', howTo: 'Type your answer. Numbers are checked instantly. For other answers, reveal the worked answer and mark yourself.' },
  { slug: 'interview', group: 'practice', title: 'Interview questions', short: 'Interview', accent: 'purple', mark: 'DP', blurb: 'Personal and awareness questions from the interview notes.', howTo: 'Read the question, answer out loud, then move on. Use the 60-second timer to keep your answers short.' },
  { slug: 'science', group: 'study', title: 'Everyday science', short: 'Science', accent: 'blue', mark: 'Sc', blurb: 'Laws, definitions and "why does it happen" questions.', howTo: 'Try to recall the answer, then reveal it. Mark each card so the deck can repeat the ones you missed.' },
  { slug: 'abbreviations', group: 'study', title: 'Abbreviations', short: 'Abbreviations', accent: 'yellow', mark: 'A–Z', blurb: 'The 133-entry abbreviation list, from ABC to Z.C.', howTo: 'Say the full form before revealing it. Search the list view to find one quickly.' },
  { slug: 'pakistan', group: 'study', title: 'Pakistan general knowledge', short: 'Pakistan GK', accent: 'lime', mark: 'PK', blurb: 'History, geography, dams, firsts and national facts.', howTo: 'Recall, reveal, mark. Old statistics are labelled in the notes under each answer.' },
  { slug: 'world', group: 'study', title: 'World general knowledge', short: 'World GK', accent: 'pink', mark: 'WD', blurb: 'Capitals, seas, organisations, regions and world facts.', howTo: 'Recall, reveal, mark. The list view is useful for quick revision before the interview.' },
  { slug: 'islamiat', group: 'study', title: 'Islamiat', short: 'Islamiat', accent: 'purple', mark: 'اسلام', blurb: 'Quran, seerah, battles, caliphs, worship and mosques, in Urdu.', howTo: 'سوال پڑھیں، جواب یاد کریں، پھر جواب دیکھیں اور نشان لگائیں۔' },
  { slug: 'forces', group: 'study', title: 'Armed forces, ranks & awards', short: 'Forces', accent: 'red', mark: '★', blurb: 'Rank equivalence, Nishan-e-Haider, arms and services.', howTo: 'Recall, reveal, mark. Historical tables are kept as printed, with corrections noted.' },
  { slug: 'issb-guide', group: 'study', title: 'ISSB schedule & biodata form', short: 'ISSB guide', accent: 'blue', mark: 'i', blurb: 'Day-by-day test schedule and every field of the biodata form.', howTo: 'Read the schedule so nothing surprises you. Prepare biodata answers in the private biodata practice page.' },
];

const collectionBySlug = new Map(collections.map((collection) => [collection.slug, collection]));

export function getCollection(slug: string): LibraryCollection | undefined {
  return collectionBySlug.get(slug as CollectionSlug);
}

type Section = ExtractedPhoto['sections'][number];

const urduNumbers: Record<string, number> = { ایک: 1, دو: 2, تین: 3, چار: 4, پانچ: 5, چھ: 6, سات: 7, آٹھ: 8, نو: 9, دس: 10 };

function classify(section: Section): { collection: CollectionSlug; mode: LibraryMode } {
  const title = section.title;
  switch (section.kind) {
    case 'sentence-completion':
      return { collection: section.language === 'ur' ? 'sentence-urdu' : 'sentence-english', mode: 'sentence' };
    case 'wat':
      return { collection: 'wat', mode: 'wat' };
    case 'story':
      return { collection: 'stories', mode: 'story' };
    case 'lecture':
    case 'discussion':
      return { collection: 'gto', mode: 'topic' };
    case 'planning':
      return { collection: 'gto', mode: 'planning' };
    case 'math':
      return { collection: 'maths', mode: 'flashcards' };
    case 'biodata':
      return section.id === 'life-events' ? { collection: 'stories', mode: 'story' } : { collection: 'issb-guide', mode: 'reference' };
    case 'guidance':
      if (section.id.startsWith('interview-page')) return { collection: 'interview', mode: 'questions' };
      if (section.language === 'ur') return { collection: 'islamiat', mode: 'reference' };
      return { collection: 'issb-guide', mode: 'reference' };
    case 'knowledge':
    default: {
      const hasAnswers = section.items.some((item) => item.answer);
      const mode: LibraryMode = hasAnswers ? 'flashcards' : 'reference';
      if (section.language === 'ur') return { collection: 'islamiat', mode };
      if (title.startsWith('Science')) return { collection: 'science', mode };
      if (title.startsWith('Pakistan')) return { collection: 'pakistan', mode };
      if (title.startsWith('World')) return { collection: 'world', mode };
      if (title.startsWith('Service knowledge') && ['61', '62, 63', '64, 65'].includes(section.sourcePage)) return { collection: 'abbreviations', mode };
      return { collection: 'forces', mode };
    }
  }
}

function friendlyTitle(section: Section, collection: CollectionSlug): { title: string; subtitle?: string } {
  const page = section.sourcePage;
  const shortPage = /^[\d ,and-]+$/.test(page) ? `page ${page.replace(/ and /g, ', ')}` : undefined;
  if (collection === 'sentence-urdu') {
    const word = Object.keys(urduNumbers).find((key) => section.title.endsWith(key));
    return { title: word ? `Urdu set ${urduNumbers[word]}` : section.title, subtitle: section.title };
  }
  if (collection === 'sentence-english') return { title: section.title.replace('English set', 'English set') };
  if (collection === 'wat') return { title: `Word list, page ${page}` };
  if (section.id === 'life-events') return { title: 'Life events (biodata column 15)', subtitle: 'Also used for the 4-minute event writing on reporting day' };
  if (section.id === 'story-pointers') return { title: 'Pointer story openings' };
  if (collection === 'gto' && section.kind === 'discussion') return { title: section.language === 'ur' ? 'Discussion topics in Urdu' : 'Discussion topics in English', subtitle: shortPage };
  if (collection === 'gto' && section.kind === 'planning') return { title: section.language === 'ur' ? 'Bridge repair: Urdu original' : 'Group planning: repair the broken bridge' };
  if (collection === 'maths') {
    const cleaned = section.title.replace(/Questi?n?o?n?s /i, 'Questions ').replace('Questinos', 'Questions').replace('Mathematics Questions: ', '');
    return { title: section.language === 'ur' ? `${cleaned} (Urdu)` : `Worked answers, ${shortPage ?? 'mixed'}`, subtitle: section.language === 'ur' ? `page ${page}` : undefined };
  }
  if (collection === 'interview') return { title: `Interview notes, page ${page.replace(/\D+.*/, '') || page}` };
  if (collection === 'issb-guide') return { title: section.title.replace(/^ISSB TEST SCHEDULE: /, '').replace(/^REPORTING DAY: /, 'Reporting day: '), subtitle: section.kind === 'biodata' ? `Biodata form, ${page}` : undefined };
  if (collection === 'islamiat') return { title: section.title, subtitle: shortPage };
  if (section.id === 'knowledge-page-9') return { title: 'Nishan-e-Haider, weapons & equipment', subtitle: 'page 68' };
  if (section.id === 'knowledge-page-8') return { title: 'Army arms, services & chiefs', subtitle: 'page 70' };
  if (section.id === 'knowledge-page-10') return { title: 'Facts from the interview notes', subtitle: 'page 66' };
  if (collection === 'abbreviations') return { title: `Abbreviations, ${shortPage}`, subtitle: section.items.length ? `${section.items[0].prompt} to ${section.items[section.items.length - 1].prompt}` : undefined };
  if (/study cards$/.test(section.title)) return { title: shortPage ? `Cards from ${shortPage}` : section.title.replace(' study cards', ''), subtitle: shortPage ? undefined : page };
  return { title: section.title, subtitle: shortPage };
}

function cleanItem(item: LibraryItem, collection: CollectionSlug): LibraryItem {
  if (collection !== 'maths') return item;
  // Worked-answer prompts carry internal ids such as "percentage-11-1." — keep the question only.
  return { ...item, prompt: item.prompt.replace(/^[a-z]+(?:-[a-z0-9]+)+\.\s*/i, '') };
}

function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const sets: LibrarySet[] = [];
const usedIds = new Set<string>();
for (const photo of sourcePhotos) {
  for (const section of photo.sections) {
    if (!section.items.length) continue;
    const { collection, mode } = classify(section);
    const { title, subtitle } = friendlyTitle(section, collection);
    let id = slugify(section.id) || slugify(`${photo.fileName}-${title}`);
    while (usedIds.has(id)) id = `${id}-x`;
    usedIds.add(id);
    sets.push({
      id, collection, mode, title, subtitle,
      language: section.language,
      sourcePage: section.sourcePage,
      sourceImage: photo.fileName,
      seconds: section.seconds,
      items: section.items.map((item) => cleanItem(item, collection)),
      notes: photo.issues,
    });
  }
}

/** Merge many small source fragments into one set, keeping each fragment's title as a sub-heading. */
function merge(match: (set: LibrarySet) => boolean, into: Omit<LibrarySet, 'items' | 'notes' | 'sourcePage' | 'sourceImage' | 'collection' | 'language'>, order?: (a: LibrarySet, b: LibrarySet) => number) {
  const parts = sets.filter(match);
  if (parts.length < 2) return;
  if (order) parts.sort(order);
  const first = sets.indexOf(parts[0]);
  const merged: LibrarySet = {
    ...into,
    collection: parts[0].collection,
    language: parts[0].language,
    sourcePage: [...new Set(parts.map((part) => part.sourcePage))].join('; '),
    sourceImage: [...new Set(parts.map((part) => part.sourceImage))].join(', '),
    items: parts.flatMap((part) => part.items.map((item) => ({ ...item, group: item.group ?? part.title }))),
    notes: [...new Set(parts.flatMap((part) => part.notes))],
  };
  for (const part of parts) sets.splice(sets.indexOf(part), 1);
  sets.splice(Math.min(first, sets.length), 0, merged);
}

const isSchedule = (set: LibrarySet) => set.collection === 'issb-guide' && !set.id.startsWith('biodata');
const scheduleRank = (set: LibrarySet) => (/reporting/i.test(set.title) ? 0 : /1st/.test(set.title) ? 1 : /2nd/.test(set.title) ? 2 : /3rd/.test(set.title) ? 3 : 4);
merge(isSchedule, { id: 'issb-schedule', mode: 'reference', title: 'ISSB test schedule, day by day', subtitle: 'Reporting day to 4th day, with timings' }, (a, b) => scheduleRank(a) - scheduleRank(b));
merge((set) => set.collection === 'issb-guide' && set.id.startsWith('biodata'), { id: 'biodata-form', mode: 'reference', title: 'Biodata form: every field', subtitle: 'All 7 pages of the printed form' });
merge((set) => set.collection === 'gto' && set.mode === 'topic' && set.language === 'en', { id: 'discussion-english', mode: 'topic', title: 'Discussion topics in English' });
merge((set) => set.collection === 'gto' && set.mode === 'topic' && set.language === 'ur', { id: 'discussion-urdu', mode: 'topic', title: 'Discussion topics in Urdu' });

function setOrder(set: LibrarySet): number {
  const number = Number(/(\d+)/.exec(set.title)?.[1] ?? 0);
  if (set.collection === 'sentence-english' || set.collection === 'sentence-urdu') return number;
  if (set.collection === 'maths') return set.language === 'en' ? 0 : 1;
  if (set.collection === 'gto') return set.mode === 'planning' ? 10 : set.language === 'ur' ? 5 : 0;
  if (set.collection === 'stories') return set.id === 'story-pointers' ? 0 : 1;
  if (set.collection === 'issb-guide') return set.id === 'issb-schedule' ? 0 : 1;
  return 0;
}

export const librarySets: LibrarySet[] = sets
  .map((set, index) => ({ set, index }))
  .sort((a, b) => a.set.collection.localeCompare(b.set.collection) || setOrder(a.set) - setOrder(b.set) || a.index - b.index)
  .map(({ set }) => set);

export function getSets(collection: CollectionSlug): LibrarySet[] {
  return librarySets.filter((set) => set.collection === collection);
}

/** A study collection's flashcard sets merged into one deck, so revision is one click. */
export function getAllCardsSet(collection: CollectionSlug): LibrarySet | undefined {
  const cardSets = getSets(collection).filter((set) => set.mode === 'flashcards');
  if (cardSets.length < 2) return undefined;
  const meta = getCollection(collection)!;
  return {
    id: 'all',
    collection,
    mode: 'flashcards',
    title: `All ${meta.short} cards`,
    subtitle: `${cardSets.length} source pages combined`,
    language: cardSets[0].language,
    sourcePage: cardSets.map((set) => set.sourcePage).join('; '),
    sourceImage: [...new Set(cardSets.map((set) => set.sourceImage))].join(', '),
    items: cardSets.flatMap((set) => set.items),
    notes: [...new Set(cardSets.flatMap((set) => set.notes))],
  };
}

export function getSet(collection: string, id: string): LibrarySet | undefined {
  if (id === 'all') return getAllCardsSet(collection as CollectionSlug);
  return librarySets.find((set) => set.collection === collection && set.id === id);
}

export function collectionStats(collection: CollectionSlug) {
  const collectionSets = getSets(collection);
  return { sets: collectionSets.length, items: collectionSets.reduce((sum, set) => sum + set.items.length, 0) };
}

export const libraryItemCount = librarySets.reduce((sum, set) => sum + set.items.length, 0);

export const modeLabels: Record<LibraryMode, string> = {
  sentence: 'Timed writing',
  wat: 'Timed words',
  story: 'Timed story',
  topic: 'Speak & plan',
  planning: 'Planning task',
  flashcards: 'Flashcards',
  questions: 'Answer aloud',
  reference: 'Read & revise',
};

export function itemsLabel(set: LibrarySet): string {
  const count = set.items.length;
  switch (set.mode) {
    case 'sentence': return `${count} stems`;
    case 'wat': return `${count} words`;
    case 'story': return `${count} prompts`;
    case 'topic': return `${count} topics`;
    case 'planning': return 'Scenario';
    case 'flashcards': return `${count} cards`;
    case 'questions': return `${count} questions`;
    default: return `${count} entries`;
  }
}
