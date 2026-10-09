import { NextResponse } from "next/server";
import { findEssayTopic } from "@/app/content/psychological-tests/essay";
import { essayMetrics } from "@/app/lib/essay-assessment/metrics";
import { assessEssayWithGemma, overallFromSubscores } from "@/app/lib/essay-assessment/provider";
import {
  ESSAY_ASSESSMENT_VERSION,
  ESSAY_COACH_DISCLAIMER,
  ESSAY_MAX_CUSTOM_TOPIC_LENGTH,
  ESSAY_MAX_LENGTH,
  ESSAY_MAX_PLAN_LENGTH,
  ESSAY_MIN_WORDS,
  essayBand,
  type EssayAssessmentResult,
} from "@/app/lib/essay-assessment/types";
import { ProviderError } from "@/app/lib/writing-assessment/provider";
import {
  RequestValidationError,
  validateRequestHeaders,
} from "@/app/lib/writing-assessment/validation";

export const dynamic = "force-dynamic";
// Leave room for the 100s Gemma budget (see ESSAY_PROVIDER_TIMEOUT_MS).
export const maxDuration = 120;

const MAX_BODY_BYTES = 49_152;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u;

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
} as const;

function jsonResponse(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, { status, headers: NO_STORE_HEADERS });
}

function fail(code: string, message: string, status = 400): never {
  throw new RequestValidationError(code, message, status);
}

type ParsedBody = { topic: string; topicIsCustom: boolean; essay: string; plan: string };

function parseBody(raw: string): ParsedBody {
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) fail("request_too_large", "Your essay is too long.", 413);
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    fail("invalid_json", "Request body must be valid JSON.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail("invalid_request", "Request must be a JSON object.");
  const body = value as Record<string, unknown>;
  const allowed = new Set(["version", "topicId", "customTopic", "essay", "plan"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) fail("invalid_request", "Unexpected field in request.");
  if (body.version !== ESSAY_ASSESSMENT_VERSION) fail("unsupported_version", "Unsupported request version.");

  if (typeof body.topicId !== "string" || !/^[a-z0-9-]{1,60}$/u.test(body.topicId)) fail("invalid_topic", "Pick an essay topic first.");
  let topic: string;
  let topicIsCustom = false;
  if (body.topicId === "custom") {
    const custom = typeof body.customTopic === "string" ? body.customTopic.trim() : "";
    if (custom.length < 3) fail("invalid_topic", "Type your essay title first.");
    if (custom.length > ESSAY_MAX_CUSTOM_TOPIC_LENGTH || CONTROL_CHARS.test(custom)) fail("invalid_topic", `Keep your title under ${ESSAY_MAX_CUSTOM_TOPIC_LENGTH} characters.`);
    topic = custom;
    topicIsCustom = true;
  } else {
    // Look the title up on the server so the browser cannot rewrite it.
    const known = findEssayTopic(body.topicId);
    if (!known) fail("invalid_topic", "Unknown essay topic.", 404);
    topic = known.title;
  }

  if (typeof body.essay !== "string") fail("invalid_essay", "Write your essay first.");
  const essay = body.essay.replace(/\r\n?/gu, "\n").trim();
  if (essay.length > ESSAY_MAX_LENGTH) fail("essay_too_long", `Keep your essay under ${ESSAY_MAX_LENGTH} characters.`, 413);
  if (CONTROL_CHARS.test(essay)) fail("invalid_essay", "Your essay has unsupported characters.");

  const planRaw = body.plan === undefined ? "" : body.plan;
  if (typeof planRaw !== "string") fail("invalid_plan", "Plan must be text.");
  const plan = planRaw.replace(/\r\n?/gu, "\n").trim().slice(0, ESSAY_MAX_PLAN_LENGTH);
  if (CONTROL_CHARS.test(plan)) fail("invalid_plan", "Your plan has unsupported characters.");

  return { topic, topicIsCustom, essay, plan };
}

function providerErrorResponse(error: ProviderError): NextResponse {
  // Server-side only (Vercel function logs). The essay itself is never logged.
  console.error("[essay-assessment] provider error", error.kind, error.detail ?? "");
  if (error.kind === "configuration") {
    return jsonResponse({ error: { code: "coach_unavailable", message: "Essay checking needs the server's GEMINI_API_KEY." } }, 503);
  }
  if (error.kind === "timeout") {
    return jsonResponse({ error: { code: "coach_timeout", message: "The essay check took too long. Please try again. Your essay is saved." } }, 504);
  }
  if (error.kind === "unavailable" && error.detail?.startsWith("HTTP 429")) {
    return jsonResponse({ error: { code: "coach_busy", message: "Too many essay checks right now. Wait a minute, then press Check my essay again. Your essay is saved." } }, 429);
  }
  const upstream = /^HTTP (\d{3})/u.exec(error.detail ?? "")?.[1];
  return jsonResponse({ error: { code: error.kind === "invalid-response" ? "coach_invalid_response" : "coach_unavailable", message: "The essay checker is busy right now. Please try again. Your essay is saved.", ...(upstream ? { upstream: Number(upstream) } : {}) } }, 502);
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    validateRequestHeaders({
      contentLength: request.headers.get("content-length"),
      contentType: request.headers.get("content-type"),
      fetchSite: request.headers.get("sec-fetch-site"),
      origin: request.headers.get("origin"),
      requestUrl: request.url,
    });

    const { topic, topicIsCustom, essay, plan } = parseBody(await request.text());
    const metrics = essayMetrics(essay);
    if (metrics.words < ESSAY_MIN_WORDS) fail("essay_too_short", `Write at least ${ESSAY_MIN_WORDS} words first. The target is 300 to 400.`);

    const assessment = await assessEssayWithGemma({
      apiKey: process.env.GEMINI_API_KEY?.trim() || process.env.Gemma_API,
      model: process.env.GEMMA_MODEL?.trim() || undefined,
      topic,
      topicIsCustom,
      essay,
      plan,
      metrics,
    });

    const overall = overallFromSubscores(assessment.subscores);
    const result: EssayAssessmentResult = {
      version: ESSAY_ASSESSMENT_VERSION,
      topic,
      overall,
      band: essayBand(overall),
      ...assessment,
      metrics: {
        words: metrics.words,
        paragraphs: metrics.paragraphs,
        sentences: metrics.sentences,
        averageWordsPerSentence: metrics.averageWordsPerSentence,
      },
      disclaimer: ESSAY_COACH_DISCLAIMER,
    };
    return jsonResponse(result, 200);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    if (error instanceof ProviderError) return providerErrorResponse(error);
    return jsonResponse({ error: { code: "internal_error", message: "The essay checker is temporarily unavailable." } }, 500);
  }
}
