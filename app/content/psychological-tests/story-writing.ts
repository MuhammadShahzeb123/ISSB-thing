import type {
  StoryPrompt,
  VersionedContentPack,
} from "@/app/lib/psychological-tests/content";
import { PICTURES_PER_SESSION, storyPictures } from "./story-pictures";

export const storyPracticeTiming = {
  id: "unified-observe-30-write-210",
  label: "Unified practice timing: 30s observe · 210s write",
  observationSeconds: 30,
  writingSeconds: 210,
  methodology:
    "A configurable practice choice applied to all six prompts in each session.",
} as const;

export const storyWritingContent: VersionedContentPack<StoryPrompt> = {
  schemaVersion: 1,
  contentVersion: "story-writing-practice-v4",
  title: "Four pictures followed by two opening sentences",
  readiness: "practice-ready",
  pendingNotice:
    "Each session draws four pictures at random from a pool of hazy pencil and charcoal sketches, the kind used in picture story tests (some from a practice set, some AI-generated in the same style). They are practice pictures, not official ISSB stimuli. They are deliberately unclear, so you decide what happened and how it ends.",
  prompts: [
    ...storyPictures.map(
      (picture, index): StoryPrompt => ({
        id: picture.id,
        kind: "picture",
        sequence: index + 1,
        imageUrl: picture.src,
        alt: picture.description,
        width: picture.width,
        height: picture.height,
        provenance: picture.source,
      }),
    ),
    {
      id: "story-sentence-1",
      kind: "sentence",
      sequence: storyPictures.length + 1,
      openingSentence: "At first light, the bridge to the village was gone.",
      provenance: "original-practice-only",
    },
    {
      id: "story-sentence-2",
      kind: "sentence",
      sequence: storyPictures.length + 2,
      openingSentence: "The team paused when the radio fell silent.",
      provenance: "original-practice-only",
    },
  ],
};

/** Picture ids drawn at random for one session, then the two sentence prompts. */
export function drawStorySession(random: () => number = Math.random): string[] {
  const pictures = storyWritingContent.prompts.filter((prompt) => prompt.kind === "picture").map((prompt) => prompt.id);
  for (let index = pictures.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [pictures[index], pictures[target]] = [pictures[target], pictures[index]];
  }
  const sentences = storyWritingContent.prompts.filter((prompt) => prompt.kind === "sentence").map((prompt) => prompt.id);
  return [...pictures.slice(0, PICTURES_PER_SESSION), ...sentences];
}
