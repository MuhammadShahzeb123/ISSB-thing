import { NextResponse } from "next/server";
import { ESSAY_COURSE_VERSION, findEssayCourseLesson } from "@/app/content/psychological-tests/essay-course";
import {
  checkEssayCourseAnswer,
  ESSAY_COURSE_MAX_ANSWER,
  ESSAY_COURSE_MIN_ANSWER,
} from "@/app/lib/essay-course/check";
import { ProviderError } from "@/app/lib/writing-assessment/provider";
import { RequestValidationError, validateRequestHeaders } from "@/app/lib/writing-assessment/validation";

export const dynamic = "force-dynamic";
// Leave room for the 100s Gemma budget (see ESSAY_COURSE_TIMEOUT_MS).
export const maxDuration = 120;

const MAX_BODY_BYTES = 16_384;
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

function parseBody(raw: string) {
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) fail("request_too_large", "Your answer is too long.", 413);
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    fail("invalid_json", "Request body must be valid JSON.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail("invalid_request", "Request must be a JSON object.");
  const body = value as Record<string, unknown>;
  const allowed = new Set(["version", "lessonId", "answer"]);
  if (Object.keys(body).some((key) => !allowed.has(key))) fail("invalid_request", "Unexpected field in request.");
  if (body.version !== ESSAY_COURSE_VERSION) fail("unsupported_version", "Please reload the page and try again.");
  if (typeof body.lessonId !== "string" || !/^[a-z0-9-]{1,60}$/u.test(body.lessonId)) fail("invalid_lesson", "Unknown lesson.");
  const lesson = findEssayCourseLesson(body.lessonId);
  if (!lesson || !lesson.task) fail("invalid_lesson", "This lesson has no task to check.", 404);
  if (typeof body.answer !== "string") fail("invalid_answer", "Write your answer first.");
  const answer = body.answer.replace(/\r\n?/gu, "\n").trim();
  if (answer.length < ESSAY_COURSE_MIN_ANSWER) fail("answer_too_short", "Write a little more before checking.");
  if (answer.length > ESSAY_COURSE_MAX_ANSWER) fail("answer_too_long", `Keep your answer under ${ESSAY_COURSE_MAX_ANSWER} characters.`, 413);
  if (CONTROL_CHARS.test(answer)) fail("invalid_answer", "Your answer has unsupported characters.");
  return { lesson, answer };
}

function providerErrorResponse(error: ProviderError): NextResponse {
  // The learner's answer is never logged.
  console.error("[essay-course] provider error", error.kind, error.detail ?? "");
  if (error.kind === "configuration") {
    return jsonResponse({ error: { code: "coach_unavailable", message: "Checking needs the server's GEMINI_API_KEY." } }, 503);
  }
  if (error.kind === "timeout") {
    return jsonResponse({ error: { code: "coach_timeout", message: "The check took too long. Please try again. Your answer is saved." } }, 504);
  }
  if (error.kind === "unavailable" && error.detail?.startsWith("HTTP 429")) {
    return jsonResponse({ error: { code: "coach_busy", message: "Too many checks right now. Wait a minute, then try again. Your answer is saved." } }, 429);
  }
  return jsonResponse({ error: { code: "coach_unavailable", message: "The coach is busy right now. Please try again. Your answer is saved." } }, 502);
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
    const { lesson, answer } = parseBody(await request.text());
    const result = await checkEssayCourseAnswer({
      apiKey: process.env.GEMINI_API_KEY?.trim() || process.env.Gemma_API,
      model: process.env.GEMMA_MODEL?.trim() || undefined,
      lesson,
      answer,
    });
    return jsonResponse(result, 200);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    if (error instanceof ProviderError) return providerErrorResponse(error);
    return jsonResponse({ error: { code: "internal_error", message: "The coach is temporarily unavailable." } }, 500);
  }
}
