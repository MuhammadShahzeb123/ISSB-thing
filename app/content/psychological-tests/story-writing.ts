import type {
  StoryPrompt,
  VersionedContentPack,
} from "@/app/lib/psychological-tests/content";

export const storyPracticeTiming = {
  id: "unified-observe-30-write-210",
  label: "Unified practice timing: 30s observe · 210s write",
  observationSeconds: 30,
  writingSeconds: 210,
  methodology:
    "A configurable practice choice applied to all six prompts in this simulator.",
} as const;

export const storyWritingContent: VersionedContentPack<StoryPrompt> = {
  schemaVersion: 1,
  contentVersion: "story-writing-practice-v1",
  title: "Four pictures followed by two opening sentences",
  readiness: "asset-pending",
  pendingNotice:
    "The four final user-owned picture assets are pending. No substitute stock or claimed official pictures are included.",
  prompts: [
    {
      id: "story-picture-1",
      kind: "picture",
      sequence: 1,
      imageUrl: null,
      alt: "Picture prompt 1 pending user-owned asset",
      provenance: "user-asset-pending",
    },
    {
      id: "story-picture-2",
      kind: "picture",
      sequence: 2,
      imageUrl: null,
      alt: "Picture prompt 2 pending user-owned asset",
      provenance: "user-asset-pending",
    },
    {
      id: "story-picture-3",
      kind: "picture",
      sequence: 3,
      imageUrl: null,
      alt: "Picture prompt 3 pending user-owned asset",
      provenance: "user-asset-pending",
    },
    {
      id: "story-picture-4",
      kind: "picture",
      sequence: 4,
      imageUrl: null,
      alt: "Picture prompt 4 pending user-owned asset",
      provenance: "user-asset-pending",
    },
    {
      id: "story-sentence-1",
      kind: "sentence",
      sequence: 5,
      openingSentence: "At first light, the bridge to the village was gone.",
      provenance: "original-practice-only",
    },
    {
      id: "story-sentence-2",
      kind: "sentence",
      sequence: 6,
      openingSentence: "The team paused when the radio fell silent.",
      provenance: "original-practice-only",
    },
  ],
};
