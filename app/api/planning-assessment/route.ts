import { NextResponse } from "next/server";
import { findRealGtoModel } from "@/app/lib/realGtoModels";
import { assessPlanWithGemma } from "@/app/lib/planning-assessment/provider";
import {
  PLANNING_ASSESSMENT_VERSION,
  PLANNING_COACH_DISCLAIMER,
  PLANNING_MAX_PLAN_LENGTH,
  PLANNING_MIN_PLAN_LENGTH,
  type PlanningAssessmentResult,
} from "@/app/lib/planning-assessment/types";
import { ProviderError } from "@/app/lib/writing-assessment/provider";
import {
  RequestValidationError,
  validateRequestHeaders,
} from "@/app/lib/writing-assessment/validation";

export const dynamic = "force-dynamic";
// Leave room for the 55s Gemma call (see PROVIDER_TIMEOUT_MS).
export const maxDuration = 60;

const MAX_BODY_BYTES = 32_768;

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

function parseBody(raw: string): { taskId: string; plan: string } {
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) fail("request_too_large", "Your plan is too long.", 413);
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    fail("invalid_json", "Request body must be valid JSON.");
  }
  if (typeof value !== "object" || value === null || Array.isArray(value)) fail("invalid_request", "Request must be a JSON object.");
  const body = value as Record<string, unknown>;
  const keys = Object.keys(body).sort().join(",");
  if (keys !== "plan,taskId,version") fail("invalid_request", "Request must contain only version, taskId and plan.");
  if (body.version !== PLANNING_ASSESSMENT_VERSION) fail("unsupported_version", "Unsupported request version.");
  if (typeof body.taskId !== "string" || !/^[a-z0-9-]{1,60}$/u.test(body.taskId)) fail("invalid_task", "Unknown planning task.");
  if (typeof body.plan !== "string") fail("invalid_plan", "Write your plan first.");
  const plan = body.plan.trim();
  if (plan.length < PLANNING_MIN_PLAN_LENGTH) fail("plan_too_short", "Write a little more of your plan first (who, what, which route, what time).");
  if (plan.length > PLANNING_MAX_PLAN_LENGTH) fail("plan_too_long", `Keep your plan under ${PLANNING_MAX_PLAN_LENGTH} characters.`, 413);
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(plan)) fail("invalid_plan", "Your plan has unsupported characters.");
  return { taskId: body.taskId, plan };
}

function providerErrorResponse(error: ProviderError): NextResponse {
  // Server-side only (Vercel function logs). The plan itself is never logged.
  console.error("[planning-assessment] provider error", error.kind, error.detail ?? "");
  if (error.kind === "configuration") {
    return jsonResponse({ error: { code: "coach_unavailable", message: "Plan checking needs the server's GEMINI_API_KEY." } }, 503);
  }
  if (error.kind === "timeout") {
    return jsonResponse({ error: { code: "coach_timeout", message: "The plan check took too long. Please try again." } }, 504);
  }
  return jsonResponse({ error: { code: error.kind === "invalid-response" ? "coach_invalid_response" : "coach_unavailable", message: "The plan checker is busy right now. Please try again." } }, 502);
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

    const { taskId, plan } = parseBody(await request.text());
    // Look the problem up on the server so the browser cannot rewrite it.
    const task = findRealGtoModel(taskId);
    if (!task) fail("invalid_task", "Unknown planning task.", 404);

    const assessment = await assessPlanWithGemma({
      apiKey: process.env.GEMINI_API_KEY?.trim() || process.env.Gemma_API,
      model: process.env.GEMMA_MODEL?.trim() || undefined,
      task,
      plan,
    });

    const result: PlanningAssessmentResult = {
      version: PLANNING_ASSESSMENT_VERSION,
      taskId: task.id,
      ...assessment,
      disclaimer: PLANNING_COACH_DISCLAIMER,
    };
    return jsonResponse(result, 200);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse({ error: { code: error.code, message: error.message } }, error.status);
    }
    if (error instanceof ProviderError) return providerErrorResponse(error);
    return jsonResponse({ error: { code: "internal_error", message: "The plan checker is temporarily unavailable." } }, 500);
  }
}
