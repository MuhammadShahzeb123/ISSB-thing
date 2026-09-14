import { sentenceCompletionContent } from "../../content/psychological-tests/sentence-completion";
import { storyWritingContent } from "../../content/psychological-tests/story-writing";
import { watContent } from "../../content/psychological-tests/wat";
import type { WritingPromptRegistry } from "./validation";

function promptMap(entries: ReadonlyArray<readonly [string, string]>) {
  return new Map(entries);
}

export const writingPromptRegistry: WritingPromptRegistry = {
  "word-association": promptMap(
    watContent.prompts.map((prompt) => [prompt.id, prompt.word]),
  ),
  "sentence-completion": promptMap(
    sentenceCompletionContent.prompts.map((prompt) => [
      prompt.id,
      prompt.stem,
    ]),
  ),
  "story-writing": promptMap(
    storyWritingContent.prompts.flatMap((prompt) =>
      prompt.kind === "sentence"
        ? [[prompt.id, prompt.openingSentence] as const]
        : [],
    ),
  ),
  "picture-association": promptMap(
    storyWritingContent.prompts.flatMap((prompt) =>
      prompt.kind === "picture"
        ? [[prompt.id, prompt.alt] as const]
        : [],
    ),
  ),
};
