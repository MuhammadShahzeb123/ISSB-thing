import { completionSentences } from "@/app/picturestest/completionSentences";
import { allSentenceSets } from "@/app/lib/contentBank";
import type {
  SentenceCompletionPrompt,
  VersionedContentPack,
} from "@/app/lib/psychological-tests/content";

export const sentenceCompletionContent: VersionedContentPack<SentenceCompletionPrompt> =
  {
    schemaVersion: 1,
    contentVersion: "sct-practice-v2-photo-sets",
    title: "Sentence completion: photo sets plus original practice",
    readiness: "practice-pending-replacement",
    pendingNotice:
      "Combines the sentence stems transcribed from the supplied study photos with the original practice set. Photo wording is preserved where readable.",
    prompts: [
      ...allSentenceSets.flatMap((set) =>
        set.prompts.map(
          (stem, index): SentenceCompletionPrompt => ({
            id: `sct-photo-${set.id}-${index + 1}`,
            stem,
            category: "general-defense",
            provenance: "legacy-practice-pending-replacement",
          }),
        ),
      ),
      ...completionSentences.map(
        (prompt): SentenceCompletionPrompt => ({
          id: `sct-${prompt.id}`,
          stem: prompt.prompt,
          category: prompt.category,
          provenance: "legacy-practice-pending-replacement",
        }),
      ),
    ],
  };
