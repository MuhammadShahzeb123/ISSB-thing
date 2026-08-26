export interface CompletionSentence {
  id: number;
  prompt: string;
  category: 'paf' | 'army' | 'general-defense';
}

export const completionSentences: CompletionSentence[] = [
  { id: 1, prompt: 'When the cockpit warning light appears, ...', category: 'paf' },
  { id: 2, prompt: 'A soldier who ignores instructions ...', category: 'army' },
  { id: 3, prompt: 'When I am under pressure, ...', category: 'general-defense' },
  { id: 4, prompt: 'If the weather changes suddenly, ...', category: 'paf' },
  { id: 5, prompt: 'My biggest weakness is ...', category: 'general-defense' },
  { id: 6, prompt: 'When a teammate makes a mistake, ...', category: 'army' },
  { id: 7, prompt: 'I feel discouraged when ...', category: 'general-defense' },
  { id: 8, prompt: 'A pilot who loses focus ...', category: 'paf' },
  { id: 9, prompt: 'When people criticize me, ...', category: 'general-defense' },
  { id: 10, prompt: 'If the plan fails, ...', category: 'army' },
  { id: 11, prompt: 'A careless decision can ...', category: 'general-defense' },
  { id: 12, prompt: 'When communication breaks down, ...', category: 'paf' },
  { id: 13, prompt: 'I find it difficult to ...', category: 'general-defense' },
  { id: 14, prompt: 'An unexpected delay makes ...', category: 'paf' },
  { id: 15, prompt: 'When I am left alone, ...', category: 'general-defense' },
  { id: 16, prompt: 'A leader who avoids responsibility ...', category: 'army' },
  { id: 17, prompt: 'Failure usually teaches me ...', category: 'general-defense' },
  { id: 18, prompt: 'If the aircraft cannot land, ...', category: 'paf' },
  { id: 19, prompt: 'When I am exhausted, ...', category: 'army' },
  { id: 20, prompt: 'I become nervous when ...', category: 'general-defense' },
  { id: 21, prompt: 'When an order is unclear, ...', category: 'paf' },
  { id: 22, prompt: 'A weak team member ...', category: 'army' },
  { id: 23, prompt: 'If the equipment stops working, ...', category: 'paf' },
  { id: 24, prompt: 'I regret it when ...', category: 'general-defense' },
  { id: 25, prompt: 'When two teammates argue, ...', category: 'army' },
  { id: 26, prompt: 'A dangerous mistake in flight ...', category: 'paf' },
  { id: 27, prompt: 'If I disagree with a senior, ...', category: 'army' },
  { id: 28, prompt: 'During a rescue mission, ...', category: 'paf' },
  { id: 29, prompt: 'A person I cannot trust ...', category: 'general-defense' },
  { id: 30, prompt: 'When my efforts go unnoticed, ...', category: 'army' },
];

export function shuffleCompletionSentences(sentences: CompletionSentence[]): CompletionSentence[] {
  const shuffled = [...sentences];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
