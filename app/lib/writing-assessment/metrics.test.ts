import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { calculateWritingMetrics } from "./metrics.ts";

test("calculates deterministic word and sentence metrics", () => {
  assert.deepEqual(
    calculateWritingMetrics([
      { promptId: "one", text: "Leaders listen. Leaders act together!" },
      { promptId: "two", text: "Hope isn't passive; teams rebuild." },
    ]),
    {
      responseCount: 2,
      totalWordCount: 10,
      uniqueWordCount: 9,
      totalSentenceCount: 3,
      averageWordsPerResponse: 5,
      averageWordsPerSentence: 3.3,
      responses: [
        { promptId: "one", wordCount: 5, sentenceCount: 2 },
        { promptId: "two", wordCount: 5, sentenceCount: 1 },
      ],
    },
  );
});

test("returns zero averages for an empty collection", () => {
  assert.deepEqual(calculateWritingMetrics([]), {
    responseCount: 0,
    totalWordCount: 0,
    uniqueWordCount: 0,
    totalSentenceCount: 0,
    averageWordsPerResponse: 0,
    averageWordsPerSentence: 0,
    responses: [],
  });
});
