import { photoWatWords, watWords } from "@/app/words";
import type {
  VersionedContentPack,
  WatPrompt,
} from "@/app/lib/psychological-tests/content";

export const watContent: VersionedContentPack<WatPrompt> = {
  schemaVersion: 1,
  contentVersion: "wat-practice-v2-photo-bank",
  title: "WAT practice bank: legacy words plus photo transcriptions",
  readiness: "legacy-practice",
  pendingNotice:
    "Combines the original practice bank with words transcribed from the supplied study photos. Photo words are deduplicated; repeated source entries remain traceable in source coverage.",
  prompts: watWords.map((word) => ({
    id: `wat-${word.id}`,
    word: word.word,
    category: word.category,
    provenance: "legacy-original-practice",
  })),
};

export const photoWatContent: VersionedContentPack<WatPrompt> = {
  schemaVersion: 1,
  contentVersion: "wat-photo-bank-v1",
  title: "Photo-transcribed WAT words",
  readiness: "legacy-practice",
  pendingNotice:
    "Words transcribed from the supplied study photos only, deduplicated across pages.",
  prompts: photoWatWords.map((word) => ({
    id: `wat-${word.id}`,
    word: word.word,
    category: word.category,
    provenance: "legacy-original-practice",
  })),
};
