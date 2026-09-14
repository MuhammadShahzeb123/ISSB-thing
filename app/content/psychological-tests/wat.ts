import { watWords } from "@/app/words";
import type {
  VersionedContentPack,
  WatPrompt,
} from "@/app/lib/psychological-tests/content";

export const watContent: VersionedContentPack<WatPrompt> = {
  schemaVersion: 1,
  contentVersion: "legacy-wat-practice-v1",
  title: "Legacy original WAT practice bank",
  readiness: "legacy-practice",
  pendingNotice:
    "This preserves the existing original practice bank. User-owned replacement words are still pending.",
  prompts: watWords.map((word) => ({
    id: `wat-${word.id}`,
    word: word.word,
    category: word.category,
    provenance: "legacy-original-practice",
  })),
};
