import { neighbourStories } from './affairs/neighbours';
import { pakistanStories } from './affairs/pakistan';
import { worldStories } from './affairs/world';

export type AffairsSection = 'pakistan' | 'neighbours' | 'world';

export interface AffairsStorySource {
  title: string;
  url: string;
  publishedAt: string;
}

export interface AffairsStory {
  id: string;
  section: AffairsSection;
  title: string;
  /** One-line card hook. */
  hook: string;
  /** Date of the latest development the story covers (YYYY-MM-DD). */
  date: string;
  /** Spoken-style story. Paragraphs are separated by a blank line. */
  story: string;
  keyFacts: readonly string[];
  question: string;
  sources: readonly AffairsStorySource[];
}

export const affairsAsOf = '2026-10-04';

export const affairsSections: Record<AffairsSection, { label: string; description: string }> = {
  pakistan: { label: 'Inside Pakistan', description: 'Politics, economy, security, climate and people at home.' },
  neighbours: { label: 'Pakistan and the world', description: 'India, Afghanistan, Iran, China, the US, the Gulf and the UN.' },
  world: { label: 'World affairs', description: 'The big international stories that touch Pakistan.' },
};

export const affairsStories: readonly AffairsStory[] = [...pakistanStories, ...neighbourStories, ...worldStories];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** 2026-10-04 → 4 October 2026 */
export function formatAffairsDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}
