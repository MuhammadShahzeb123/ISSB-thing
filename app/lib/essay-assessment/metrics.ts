// Plain counts shared by the essay page (live counter) and the server (sent to
// Gemma as context). No model involved.

export type EssayMetrics = {
  words: number;
  paragraphs: number;
  sentences: number;
  averageWordsPerSentence: number;
  /** Sentences in each paragraph, in order. */
  sentencesPerParagraph: number[];
};

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n+/u)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

export function countWords(text: string): number {
  const matches = text.trim().match(/[\p{L}\p{N}][\p{L}\p{N}'’-]*/gu);
  return matches ? matches.length : 0;
}

export function countSentences(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const ends = trimmed.match(/[.!?]+(?=\s|$)/gu)?.length ?? 0;
  // A final sentence with no full stop still counts as one.
  return /[.!?]["'’”)]*$/u.test(trimmed) ? ends : ends + 1;
}

export function essayMetrics(text: string): EssayMetrics {
  const paragraphs = splitParagraphs(text);
  const sentencesPerParagraph = paragraphs.map(countSentences);
  const sentences = sentencesPerParagraph.reduce((total, n) => total + n, 0);
  const words = countWords(text);
  return {
    words,
    paragraphs: paragraphs.length,
    sentences,
    averageWordsPerSentence: sentences ? Math.round((words / sentences) * 10) / 10 : 0,
    sentencesPerParagraph,
  };
}
