import { sourcePhotos } from './contentBank';
import { currentAffairs, researchAsOf } from './currentAffairs';
import { englishCardFactChecks, knowledgeFactChecks, type FactCheckStatus } from './knowledgeFactCheck';
import { knowledgePages } from './sourceKnowledge';

// One organised list of every general-knowledge card: the English study
// cards, the fact-checked Urdu Islamic-studies notes and the dated
// current-affairs briefings, each in exactly one category.

export const gkCategories = {
  pakistan: { label: 'Pakistan history & affairs', description: 'Founding, constitution, leaders, provinces, dams and borders.' },
  military: { label: 'Military & defence', description: 'Gallantry awards, ranks, arms and services, and strategic programmes.' },
  geography: { label: 'World geography', description: 'Capitals, seas, straits, regions and landforms.' },
  world: { label: 'World affairs & history', description: 'International organisations, treaties and world history.' },
  science: { label: 'Science & technology', description: 'Physics, earth science and everyday science questions.' },
  islamic: { label: 'Islamic studies', description: 'Seerah, Quran, worship and early Islamic history (Urdu notes, fact-checked).' },
  abbreviations: { label: 'Abbreviations', description: 'Acronyms common in interviews and service life.' },
  general: { label: 'Sports & general', description: 'Cricket, word origins and miscellaneous questions.' },
  current: { label: 'Current affairs', description: `Dated briefings, research cut-off ${researchAsOf}.` },
} as const;

export type GkCategory = keyof typeof gkCategories;
export type GkStatus = FactCheckStatus | 'reviewed' | 'dated';

export type GkCard = {
  id: string;
  category: GkCategory;
  language: 'en' | 'ur';
  prompt: string;
  answer?: string;
  detail?: string;
  status: GkStatus;
  /** Correction, dispute or context from the fact-check. */
  factCheck?: string;
  sourceHref: string;
  sourceLabel: string;
};

export const gkStatusLabels: Record<GkStatus, string> = {
  verified: 'Verified',
  reviewed: 'Reviewed',
  context: 'Verified + context',
  corrected: 'Corrected',
  disputed: 'Disputed',
  dated: 'Dated briefing',
};

// Per-card categories for the English study pages, in page order. A single
// letter covers a whole page; a longer string gives one letter per card.
// P Pakistan, M military, G geography, W world affairs, S science,
// I Islamic studies, A abbreviations, X sports & general.
const LETTERS: Record<string, GkCategory> = { P: 'pakistan', M: 'military', G: 'geography', W: 'world', S: 'science', I: 'islamic', A: 'abbreviations', X: 'general' };
const englishPageCategories = [
  'PPPWWMWGGGGPGG',
  'MXXMPSWWXPGPPMGPGMMGPSGGMPPPMMWPWMSM',
  'MGGGGGGPPGMMSMMMMSPAPSGGPIWGAGGPMPP',
  'WGXGXPPGWXWPWPWPPMSGGGGWXPPWMPWGWPPWP',
  'PWPPPWWPPPPPPPWWPWPPGPPPPPGGSPPWPPPPGGPSPW',
  'G',
  'GGGGPWGPPPPPPPPGGGGGGGG',
  'G',
  'M',
  'M',
  'X',
  'A',
  'A',
  'S',
  'A',
  'S',
  'S',
  'S',
  'S',
  'S',
];

function englishCategory(pageIndex: number, cardIndex: number, cardCount: number): GkCategory {
  const letters = englishPageCategories[pageIndex] ?? 'W';
  if (letters.length === 1) return LETTERS[letters];
  if (letters.length !== cardCount) throw new Error(`General knowledge page ${pageIndex}: ${letters.length} categories for ${cardCount} cards`);
  return LETTERS[letters[cardIndex]];
}

const englishCards: GkCard[] = knowledgePages.flatMap((page, pageIndex) => page.cards.map(([prompt, answer], cardIndex) => {
  const check = englishCardFactChecks[`knowledge-page-${pageIndex}:${cardIndex}`];
  return {
    id: `en-${pageIndex}-${cardIndex}`,
    category: englishCategory(pageIndex, cardIndex, page.cards.length),
    language: 'en' as const,
    prompt,
    answer,
    status: check?.status ?? 'reviewed',
    factCheck: check?.note ?? page.note,
    sourceHref: `/sources#${page.sourceImage}`,
    sourceLabel: `Source page ${page.sourcePage}`,
  };
}));

const urduCards: GkCard[] = sourcePhotos.flatMap((photo) => photo.sections
  .filter((section) => section.kind === 'knowledge' && section.language === 'ur')
  .flatMap((section) => section.items.map((item, index) => {
    const check = knowledgeFactChecks[`${section.id}:${index}`];
    return {
      id: `ur-${section.id}-${index}`,
      category: 'islamic' as const,
      language: 'ur' as const,
      prompt: item.prompt,
      answer: item.answer,
      detail: item.detail,
      status: check?.status ?? 'verified',
      factCheck: check?.note,
      sourceHref: `/sources#${photo.fileName}`,
      sourceLabel: `Source page ${section.sourcePage}`,
    };
  })));

const currentCards: GkCard[] = currentAffairs.map((brief) => ({
  id: `affairs-${brief.id}`,
  category: 'current',
  language: 'en',
  prompt: brief.title,
  answer: `${brief.summary}\n\nWhy it matters to Pakistan: ${brief.whyPakistan}`,
  status: 'dated',
  factCheck: `Latest cited publication ${brief.date}. Recheck before an interview: ${brief.watch.join(' ')}`,
  sourceHref: brief.sources[0]?.url ?? '/interview?tab=affairs',
  sourceLabel: brief.sources[0] ? `${brief.sources[0].title} (${brief.sources[0].publishedAt})` : 'Current-affairs briefing',
}));

export const generalKnowledgeCards: readonly GkCard[] = [...englishCards, ...urduCards, ...currentCards];

export const gkCategoryCounts = Object.fromEntries(
  (Object.keys(gkCategories) as GkCategory[]).map((category) => [category, generalKnowledgeCards.filter((card) => card.category === category).length]),
) as Record<GkCategory, number>;
