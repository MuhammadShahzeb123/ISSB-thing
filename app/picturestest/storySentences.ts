export interface StorySentence {
  id: number;
  sentence: string;
  category: 'general' | 'negative';
}

export const storySentences: StorySentence[] = [
  { id: 1, sentence: 'A boy was following her at night.', category: 'negative' },
  { id: 2, sentence: 'The last train had already left the station.', category: 'general' },
  { id: 3, sentence: 'Nobody noticed the small package under the bench.', category: 'negative' },
  { id: 4, sentence: 'She opened the letter and her hands began to tremble.', category: 'general' },
  { id: 5, sentence: 'The power went out across the entire city.', category: 'negative' },
  { id: 6, sentence: 'He found a strange note slipped under his door.', category: 'general' },
  { id: 7, sentence: 'The road ahead was blocked by fallen trees.', category: 'negative' },
  { id: 8, sentence: 'Two strangers shared the last bench at the bus stop.', category: 'general' },
  { id: 9, sentence: 'The phone rang at three in the morning.', category: 'negative' },
  { id: 10, sentence: 'She realized she had lost her identification card.', category: 'negative' },
  { id: 11, sentence: 'The old man sat alone staring at the sea.', category: 'general' },
  { id: 12, sentence: 'Someone had left the window open during the storm.', category: 'negative' },
  { id: 13, sentence: 'The children heard a loud noise from the basement.', category: 'general' },
  { id: 14, sentence: 'He was the last person to leave the building.', category: 'negative' },
  { id: 15, sentence: 'A stray dog followed him all the way home.', category: 'general' },
  { id: 16, sentence: 'The letter was addressed to someone who no longer lived there.', category: 'negative' },
  { id: 17, sentence: 'She had exactly ten minutes to make a decision.', category: 'general' },
  { id: 18, sentence: 'The car broke down in the middle of nowhere.', category: 'negative' },
  { id: 19, sentence: 'He pretended not to hear what they were saying.', category: 'general' },
  { id: 20, sentence: 'The mirror showed a reflection that was not his own.', category: 'negative' },
  { id: 21, sentence: 'A crowd gathered around the old monument.', category: 'general' },
  { id: 22, sentence: 'She kept reading the same paragraph over and over.', category: 'negative' },
  { id: 23, sentence: 'The rain had not stopped for seven days.', category: 'negative' },
  { id: 24, sentence: 'He woke up and found the house completely silent.', category: 'general' },
  { id: 25, sentence: 'Someone had written a warning on the wall.', category: 'negative' },
  { id: 26, sentence: 'The ship appeared on the horizon just before sunset.', category: 'general' },
  { id: 27, sentence: 'She walked into the room and everyone went quiet.', category: 'negative' },
  { id: 28, sentence: 'The passport in his hand belonged to another man.', category: 'general' },
  { id: 29, sentence: 'He could not remember how he got to this place.', category: 'negative' },
  { id: 30, sentence: 'The last entry in the diary was left unfinished.', category: 'general' },
];

export function shuffleStorySentences(sentences: StorySentence[]): StorySentence[] {
  const shuffled = [...sentences];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
