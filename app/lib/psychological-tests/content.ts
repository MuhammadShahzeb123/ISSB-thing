export type ContentReadiness =
  | "legacy-practice"
  | "practice-pending-replacement"
  | "asset-pending"
  | "practice-ready";

export type VersionedContentPack<TPrompt> = {
  schemaVersion: 1;
  contentVersion: string;
  title: string;
  readiness: ContentReadiness;
  pendingNotice: string;
  prompts: readonly TPrompt[];
};

export type WatPrompt = {
  id: `wat-${string}`;
  word: string;
  category: "positive" | "negative" | "neutral";
  provenance: "legacy-original-practice";
};

export type StoryPicturePrompt = {
  id: `story-picture-${number}`;
  kind: "picture";
  sequence: number;
  imageUrl: string | null;
  alt: string;
  provenance: "user-asset-pending" | "original-practice-illustration";
};

export type StorySentencePrompt = {
  id: `story-sentence-${number}`;
  kind: "sentence";
  sequence: number;
  openingSentence: string;
  provenance: "original-practice-only";
};

export type StoryPrompt = StoryPicturePrompt | StorySentencePrompt;

export type SentenceCompletionPrompt = {
  id: `sct-${string}`;
  stem: string;
  category: "paf" | "army" | "general-defense";
  provenance: "legacy-practice-pending-replacement";
};

export const OFFICIAL_SELECTION_SYSTEM_URL =
  "https://issb.gov.pk/index.php/selection-system/";
