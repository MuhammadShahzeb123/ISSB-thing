import type {
  WritingMetrics,
  WritingResponseRecord,
} from "./types";

const WORD_PATTERN = /[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu;
const SENTENCE_PATTERN = /[^.!?]+(?:[.!?]+|$)/gu;

function words(text: string): string[] {
  return text.match(WORD_PATTERN) ?? [];
}

function sentenceCount(text: string): number {
  return (text.match(SENTENCE_PATTERN) ?? []).filter(
    (sentence) => words(sentence).length > 0,
  ).length;
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

export function calculateWritingMetrics(
  responses: readonly WritingResponseRecord[],
): WritingMetrics {
  const uniqueWords = new Set<string>();
  let totalWordCount = 0;
  let totalSentenceCount = 0;

  const responseMetrics = responses.map((response) => {
    const responseWords = words(response.text);
    const responseSentenceCount = sentenceCount(response.text);

    for (const word of responseWords) {
      uniqueWords.add(word.toLocaleLowerCase("en-US"));
    }

    totalWordCount += responseWords.length;
    totalSentenceCount += responseSentenceCount;

    return {
      promptId: response.promptId,
      wordCount: responseWords.length,
      sentenceCount: responseSentenceCount,
    };
  });

  return {
    responseCount: responses.length,
    totalWordCount,
    uniqueWordCount: uniqueWords.size,
    totalSentenceCount,
    averageWordsPerResponse:
      responses.length === 0 ? 0 : round(totalWordCount / responses.length),
    averageWordsPerSentence:
      totalSentenceCount === 0 ? 0 : round(totalWordCount / totalSentenceCount),
    responses: responseMetrics,
  };
}
