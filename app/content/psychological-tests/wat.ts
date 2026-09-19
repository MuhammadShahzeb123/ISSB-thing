import { photoWatWords } from "@/app/words";
import type {
  VersionedContentPack,
  WatPrompt,
} from "@/app/lib/psychological-tests/content";

export const watContent: VersionedContentPack<WatPrompt> = {
  schemaVersion: 1,
  contentVersion: "wat-photo-bank-v1",
  title: "Photo-transcribed WAT words",
  readiness: "legacy-practice",
  pendingNotice:
    "Words transcribed from the supplied study photos only, deduplicated across pages. Repeated source entries remain traceable in source coverage.",
  prompts: photoWatWords.map((word) => ({
    id: `wat-${word.id}`,
    word: word.word,
    category: word.category,
    provenance: "legacy-original-practice",
  })),
};
