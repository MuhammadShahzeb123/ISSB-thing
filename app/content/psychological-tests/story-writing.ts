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
  contentVersion: "story-writing-practice-v2",
  title: "Four pictures followed by two opening sentences",
  readiness: "practice-ready",
  pendingNotice:
    "The four pictures are original practice illustrations drawn for this site, not official ISSB stimuli. Like the real test, they are deliberately ambiguous and slightly sombre, so you decide what happened and how it ends.",
  prompts: [
    {
      id: "story-picture-1",
      kind: "picture",
      sequence: 1,
      imageUrl: "/story-pictures/picture-1-bench.svg",
      alt: "A grey evening in a park. An older man sits on a bench, leaning forward with his hands clasped and his eyes lowered. A younger man beside him has turned towards him. A bare tree and a street lamp stand nearby.",
      provenance: "original-practice-illustration",
    },
    {
      id: "story-picture-2",
      kind: "picture",
      sequence: 2,
      imageUrl: "/story-pictures/picture-2-window.svg",
      alt: "A young woman in a shalwar kameez and dupatta stands at a window, one hand on the frame, looking out at the rain. A packed bag rests on the floor and an envelope lies on a small table behind her.",
      provenance: "original-practice-illustration",
    },
    {
      id: "story-picture-3",
      kind: "picture",
      sequence: 3,
      imageUrl: "/story-pictures/picture-3-steps.svg",
      alt: "A young man sits on the steps of a building, leaning over a letter held in both hands. An older man stands in the open doorway behind him, looking down at him. A bicycle leans against a pillar.",
      provenance: "original-practice-illustration",
    },
    {
      id: "story-picture-4",
      kind: "picture",
      sequence: 4,
      imageUrl: "/story-pictures/picture-4-field.svg",
      alt: "At the edge of a dry, cracked field, an older farmer in a turban leans on a spade beside his teenage son. Heavy clouds gather over a distant village. The boy looks up at the sky; the father looks across the field.",
      provenance: "original-practice-illustration",
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
