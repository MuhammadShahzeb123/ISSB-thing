import {
  DEFAULT_GEMMA_MODEL,
  extractProviderText,
  MODEL_PATTERN,
  ProviderError,
} from "@/app/lib/writing-assessment/provider";

/**
 * One Gemma generateContent call that asks for JSON, with the same budget and
 * retry rules as the GTO plan checker: retry brief 429/5xx answers while
 * there is time left, and give up at `timeoutMs` overall.
 */
export async function generateGemmaJson(input: {
  apiKey: string | undefined;
  model?: string | undefined;
  prompt: string;
  timeoutMs: number;
  retryWindowMs: number;
  logTag: string;
}): Promise<string> {
  const apiKey = input.apiKey?.trim();
  if (!apiKey) throw new ProviderError("configuration");
  const model = input.model || DEFAULT_GEMMA_MODEL;
  if (!MODEL_PATTERN.test(model)) throw new ProviderError("configuration");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs);
  const started = Date.now();
  const body = JSON.stringify({
    contents: [{ role: "user", parts: [{ text: input.prompt }] }],
    generationConfig: {
      temperature: 0,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingLevel: "minimal" },
    },
  });

  try {
    for (let attempt = 1; ; attempt += 1) {
      let response: Response | null = null;
      let failure: ProviderError;
      try {
        response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
            body,
            cache: "no-store",
            signal: controller.signal,
          },
        );
      } catch {
        if (controller.signal.aborted) throw new ProviderError("timeout");
        response = null;
      }

      if (response?.ok) {
        let payload: unknown;
        try {
          payload = await response.json();
        } catch {
          if (controller.signal.aborted) throw new ProviderError("timeout");
          throw new ProviderError("invalid-response", "body not JSON");
        }
        return extractProviderText(payload);
      }

      let retryable = true;
      if (response) {
        let upstream = "";
        try {
          upstream = (await response.text()).slice(0, 300);
        } catch {
          // ignore
        }
        retryable = response.status === 429 || response.status >= 500;
        failure = new ProviderError("unavailable", `HTTP ${response.status} ${upstream}`);
      } else {
        failure = new ProviderError("unavailable", "network");
      }

      const waitMs = response?.status === 429 ? 4000 * attempt : 1500 * attempt;
      if (!retryable || attempt >= 3 || Date.now() - started + waitMs > input.retryWindowMs) throw failure;
      console.warn(`[${input.logTag}] retrying Gemma`, attempt, failure.detail ?? "");
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  } catch (error) {
    if (controller.signal.aborted) throw new ProviderError("timeout");
    if (error instanceof ProviderError) throw error;
    throw new ProviderError("unavailable");
  } finally {
    clearTimeout(timeout);
  }
}
