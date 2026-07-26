export interface CompletionSentence {
  id: number;
  prompt: string;
  category: 'paf' | 'army' | 'general-defense';
}

export const completionSentences: CompletionSentence[] = [
  { id: 1, prompt: 'The pilot kept his composure as the enemy aircraft approached, and ...', category: 'paf' },
  { id: 2, prompt: 'When the flood waters rose above the roofs, the army engineers ...', category: 'army' },
  { id: 3, prompt: 'Despite the heavy snowfall on the northern border, the soldiers ...', category: 'army' },
  { id: 4, prompt: 'The radar station detected an unidentified object, so the command center ...', category: 'paf' },
  { id: 5, prompt: 'After months of rigorous training, the cadet finally earned ...', category: 'general-defense' },
  { id: 6, prompt: 'The helicopter hovered above the trapped villagers, and the crew ...', category: 'paf' },
  { id: 7, prompt: 'When the ceasefire was announced, the officers in the trenches ...', category: 'army' },
  { id: 8, prompt: 'The young lieutenant had never faced combat before, but when the time came ...', category: 'army' },
  { id: 9, prompt: 'The jet squadron flew in perfect formation over the ceremony, and the crowd ...', category: 'paf' },
  { id: 10, prompt: 'When the earthquake struck at dawn, the nearest military base ...', category: 'general-defense' },
  { id: 11, prompt: 'The supply convoy was ambacked on the mountain road, yet the convoy commander ...', category: 'army' },
  { id: 12, prompt: 'As the fighter jet touched down on the damaged runway, the ground crew ...', category: 'paf' },
  { id: 13, prompt: 'The border post had been without reinforcements for three days, but the soldiers ...', category: 'army' },
  { id: 14, prompt: 'During the joint exercise with allied forces, the Pakistan Air Force demonstrated ...', category: 'paf' },
  { id: 15, prompt: 'The intelligence officer had been tracking the suspect for weeks, and finally ...', category: 'general-defense' },
  { id: 16, prompt: 'When the base came under artillery fire, the commanding officer ...', category: 'army' },
  { id: 17, prompt: 'The cadets marching across the parade ground in scorching heat showed that ...', category: 'general-defense' },
  { id: 18, prompt: 'The transport aircraft was carrying emergency supplies to the cut-off region, and when the weather worsened ...', category: 'paf' },
  { id: 19, prompt: 'The soldier who had been on night patrol for six hours finally noticed ...', category: 'army' },
  { id: 20, prompt: 'When the national flag was raised at the ceremony, every officer present ...', category: 'general-defense' },
  { id: 21, prompt: 'The squadron leader had trained his team for this exact scenario, so when the alarm sounded ...', category: 'paf' },
  { id: 22, prompt: 'After the disaster relief operation ended, the local community ...', category: 'army' },
  { id: 23, prompt: 'The air traffic controller spotted the malfunctioning aircraft on radar, and immediately ...', category: 'paf' },
  { id: 24, prompt: 'The recruit who had struggled through the first week of training eventually ...', category: 'general-defense' },
  { id: 25, prompt: 'When the convoy reached the narrow valley, the advance scout ...', category: 'army' },
  { id: 26, prompt: 'The test pilot pushed the aircraft to its limits, and the data revealed ...', category: 'paf' },
  { id: 27, prompt: 'The regiment that had defended the post for forty-eight hours was finally relieved when ...', category: 'army' },
  { id: 28, prompt: 'During the search and rescue mission over the sea, the aircrew ...', category: 'paf' },
  { id: 29, prompt: 'The veteran officer who had served three decades looked at the young cadets and ...', category: 'general-defense' },
  { id: 30, prompt: 'When the call for volunteers went out, every single soldier in the unit ...', category: 'army' },
];

export function shuffleCompletionSentences(sentences: CompletionSentence[]): CompletionSentence[] {
  const shuffled = [...sentences];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
