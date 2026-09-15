import { completionSentences } from "@/app/picturestest/completionSentences";
import type {
  SentenceCompletionPrompt,
  VersionedContentPack,
} from "@/app/lib/psychological-tests/content";

export const sentenceCompletionContent: VersionedContentPack<SentenceCompletionPrompt> =
  {
    schemaVersion: 1,
    contentVersion: "legacy-sct-practice-v1",
    title: "Current sentence-completion practice set",
    readiness: "practice-pending-replacement",
    pendingNotice:
      "These existing prompts are practice-only and remain pending replacement with user-owned final content.",
    prompts: completionSentences.map((prompt) => ({
      id: `sct-${prompt.id}`,
      stem: prompt.prompt,
      category: prompt.category,
      provenance: "legacy-practice-pending-replacement",
    })),
  };
