import {
  DEFAULT_GEMMA_MODEL,
  extractProviderText,
  MODEL_PATTERN,
  ProviderError,
} from "@/app/lib/writing-assessment/provider";

/**
 * Ordered text-model chain for every JSON coaching feature (WAT, story writing,
 * GTO planning, essay assessment, essay course). Fast free-tier Flash-Lite and
 * Flash models first, Gemma 4 last because it is slow and often busy.
 * Override with GEMINI_TEXT_MODELS="model-a,model-b,..." (no env change needed).
 */
export const DEFAULT_TEXT_MODELS = [
  // Live tests (13 Oct 2026): 3.1 Flash-Lite answered in about 3 to 7 s. 3.5 Flash-Lite kept
  // running out its 15 s cap on this key, so it sits near the end as an extra fallback.
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-3.6-flash",
  "gemini-2.5-flash",
  "gemini-3.5-flash-lite",
  DEFAULT_GEMMA_MODEL,
] as const;

/** Per-model time cap. Gemma, the last resort, gets whatever time is left. */
function modelCapMs(model: string): number {
  if (model.startsWith("gemma")) return Number.POSITIVE_INFINITY;
  if (model.includes("flash-lite")) return 12_000;
  return 25_000;
}

export function resolveTextModels(legacyModel?: string): string[] {
  const fromEnv = (process.env.GEMINI_TEXT_MODELS ?? "")
    .split(",")
    .map((m) => m.trim())
    .filter((m) => m && MODEL_PATTERN.test(m));
  const chain = fromEnv.length ? fromEnv : [...DEFAULT_TEXT_MODELS];
  // An older GEMMA_MODEL setting is kept as an extra last resort, never as the first choice.
  const legacy = legacyModel?.trim();
  if (legacy && MODEL_PATTERN.test(legacy) && !chain.includes(legacy)) chain.push(legacy);
  return chain;
}

function generationConfig(model: string, withThinking: boolean) {
  const config: Record<string, unknown> = { temperature: 0, responseMimeType: "application/json" };
  if (!withThinking) return config;
  if (model.startsWith("gemini-2.5")) config.thinkingConfig = { thinkingBudget: 0 };
  else config.thinkingConfig = { thinkingLevel: "minimal" };
  return config;
}

async function callModel(apiKey: string, model: string, prompt: string, timeoutMs: number, withThinking: boolean) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: generationConfig(model, withThinking),
        }),
        cache: "no-store",
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      let upstream = "";
      try {
        upstream = (await response.text()).slice(0, 300);
      } catch {
        // ignore
      }
      return { ok: false as const, status: response.status, error: new ProviderError("unavailable", `HTTP ${response.status} ${upstream}`) };
    }
    const payload: unknown = await response.json();
    return { ok: true as const, text: extractProviderText(payload) };
  } catch (error) {
    if (controller.signal.aborted) return { ok: false as const, status: 0, error: new ProviderError("timeout") };
    if (error instanceof ProviderError) return { ok: false as const, status: 0, error };
    return { ok: false as const, status: 0, error: new ProviderError("unavailable", "network") };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Runs the prompt down the model chain. Moves to the next model on 429, 5xx,
 * 400/404 (model missing or config unsupported), timeout, empty text or a
 * reply that `parse` rejects. Gives up when `timeoutMs` overall is spent.
 */
export async function generateJsonWithFallback<T>(input: {
  apiKey: string | undefined;
  model?: string | undefined;
  prompt: string;
  timeoutMs: number;
  logTag: string;
  parse: (text: string) => T;
  onModel?: (model: string) => void;
}): Promise<T> {
  const apiKey = input.apiKey?.trim();
  if (!apiKey) throw new ProviderError("configuration");
  const chain = resolveTextModels(input.model);
  const started = Date.now();
  let lastError: ProviderError = new ProviderError("unavailable");

  for (const model of chain) {
    const remaining = input.timeoutMs - (Date.now() - started);
    if (remaining < 2_000) break;
    const budget = Math.min(modelCapMs(model), remaining);
    const t0 = Date.now();
    let result = await callModel(apiKey, model, input.prompt, budget, true);
    // Some models reject a thinking setting. Try once more without it.
    if (!result.ok && result.status === 400 && /thinking/i.test(result.error.detail ?? "")) {
      result = await callModel(apiKey, model, input.prompt, Math.max(1_000, budget - (Date.now() - t0)), false);
    }
    if (result.ok) {
      try {
        const value = input.parse(result.text);
        console.info(`[${input.logTag}] answered by ${model} in ${Date.now() - t0}ms (total ${Date.now() - started}ms)`);
        input.onModel?.(model);
        return value;
      } catch (error) {
        lastError = error instanceof ProviderError ? error : new ProviderError("invalid-response", "parse failed");
        console.warn(`[${input.logTag}] ${model} gave an unusable reply, trying next`, lastError.detail ?? "");
        continue;
      }
    }
    lastError = result.error;
    console.warn(`[${input.logTag}] ${model} failed after ${Date.now() - t0}ms, trying next`, result.error.kind, result.error.detail ?? "");
  }
  throw lastError;
}

/** Back-compat wrapper: returns the raw JSON text from the first model that answers with valid JSON. */
export async function generateGemmaJson(input: {
  apiKey: string | undefined;
  model?: string | undefined;
  prompt: string;
  timeoutMs: number;
  retryWindowMs?: number;
  logTag: string;
}): Promise<string> {
  return generateJsonWithFallback({ ...input, parse: (text) => (JSON.parse(text), text) });
}
