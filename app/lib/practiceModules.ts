// Registry of every practice module, grouped by the three core assessor
// dimensions. Random draws, revision mode and progress tracking all read from
// here, so a module moves between dimensions by editing this file only.

export type CoreDimension = 'psychological' | 'gto' | 'deputy-president-interview';

export type PracticeModuleId = string;

export type PracticeModule = {
  id: PracticeModuleId;
  dimension: CoreDimension;
  title: string;
  description: string;
  href: string;
  /** Minutes a typical session takes, shown so candidates can plan. */
  minutes: number;
};

export const dimensionLabels: Record<CoreDimension, string> = {
  psychological: 'Psychological',
  gto: 'GTO',
  'deputy-president-interview': 'Deputy President Interview',
};

export const coreDimensions = Object.keys(dimensionLabels) as CoreDimension[];

export const outdoorObstacleIds = ['long-jump', 'high-jump', 'rope-climb', 'double-rope', 'plank', 'tyre', 'tarzan-swing', 'zig-zag', 'boxing-ring'] as const;

export const practiceModules: readonly PracticeModule[] = [
  { id: 'psych-wat', dimension: 'psychological', title: 'Word Association Test', description: 'Timed word responses from the legacy bank and photo-transcribed words.', href: '/psychological/wat', minutes: 15 },
  { id: 'psych-story-writing', dimension: 'psychological', title: 'Picture Story Writing', description: 'Four picture prompts and two opening sentences, observe then write.', href: '/psychological/story-writing', minutes: 25 },
  { id: 'psych-sentence-completion', dimension: 'psychological', title: 'Sentence Completion', description: 'Timed completions from the photo-transcribed sets.', href: '/psychological/sentence-completion', minutes: 10 },
  { id: 'psych-opi', dimension: 'psychological', title: 'OPI self-reflection', description: 'Local-only, non-diagnostic work-behaviour reflection.', href: '/opi', minutes: 20 },
  { id: 'psych-mechanical', dimension: 'psychological', title: 'Mechanical Aptitude', description: '50 questions in 15 minutes, in the published format.', href: '/mechanical-aptitude', minutes: 15 },

  { id: 'gto-lecture', dimension: 'gto', title: 'Lecture', description: 'Prepare and give a two-minute talk on a drawn topic.', href: '/gto/indoor?tab=lecture', minutes: 5 },
  { id: 'gto-discussion', dimension: 'gto', title: 'Group discussion', description: 'Build discussion notes on a debate motion.', href: '/gto/indoor?tab=discussion', minutes: 15 },
  { id: 'gto-planning', dimension: 'gto', title: 'Group planning exercise', description: 'Work through a timed planning problem with constraints.', href: '/gto/indoor?tab=planning', minutes: 15 },
  { id: 'gto-outdoor', dimension: 'gto', title: 'Outdoor obstacles', description: 'Animated technique walkthroughs for the nine individual obstacles.', href: '/gto/outdoor', minutes: 10 },

  { id: 'interview-introduction', dimension: 'deputy-president-interview', title: 'Your introduction', description: 'Rehearse a clear, honest introduction.', href: '/interview?tab=introduction', minutes: 10 },
  { id: 'interview-maths', dimension: 'deputy-president-interview', title: 'Quick mental maths', description: 'Short calculations of the kind asked in the interview.', href: '/interview?tab=maths', minutes: 5 },
  { id: 'interview-affairs', dimension: 'deputy-president-interview', title: 'Current affairs', description: 'Sourced briefings and likely interview questions.', href: '/interview?tab=affairs', minutes: 15 },
  { id: 'interview-stories', dimension: 'deputy-president-interview', title: 'Gallantry stories', description: 'Recall the 11 Nishan-e-Haider stories.', href: '/interview?tab=stories', minutes: 10 },
  { id: 'interview-knowledge', dimension: 'deputy-president-interview', title: 'General knowledge', description: 'Categorised, fact-checked knowledge cards.', href: '/interview?tab=knowledge', minutes: 10 },
  { id: 'interview-source', dimension: 'deputy-president-interview', title: 'Photo question bank', description: 'The original photographed interview questions.', href: '/interview?tab=source', minutes: 10 },
];

export function moduleById(id: PracticeModuleId) {
  return practiceModules.find((item) => item.id === id);
}

export const obstacleModuleId = (obstacleId: string): PracticeModuleId => `gto-outdoor:${obstacleId}`;

/**
 * Picks a module at random, skipping anything drawn recently when possible so
 * repeated draws rotate through the whole dimension.
 */
export function drawRandomModule(dimension: CoreDimension | 'all', recentDraws: readonly PracticeModuleId[], random: () => number = Math.random) {
  const pool = practiceModules.filter((item) => dimension === 'all' || item.dimension === dimension);
  // Avoid roughly the last half of the pool; never exclude everything.
  const avoid = new Set(recentDraws.slice(0, Math.floor(pool.length / 2)));
  const fresh = pool.filter((item) => !avoid.has(item.id));
  const candidates = fresh.length ? fresh : pool;
  const chosen = candidates[Math.floor(random() * candidates.length)];
  const href = chosen.id === 'gto-outdoor'
    ? `/gto/outdoor?obstacle=${outdoorObstacleIds[Math.floor(random() * outdoorObstacleIds.length)]}`
    : chosen.href;
  return { module: chosen, href };
}

export function isCoreDimension(value: string | null | undefined): value is CoreDimension {
  return !!value && value in dimensionLabels;
}
