import { NextResponse } from "next/server";
import { calculateWritingMetrics } from "@/app/lib/writing-assessment/metrics";
import {
  assessWritingWithGemma,
  ProviderError,
} from "@/app/lib/writing-assessment/provider";
import {
  MAX_REQUEST_BYTES,
  RequestValidationError,
  validateRequestBody,
  validateRequestHeaders,
} from "@/app/lib/writing-assessment/validation";
import {
  WRITING_ASSESSMENT_VERSION,
  WRITING_COACH_DISCLAIMER,
  type WritingAssessmentResult,
} from "@/app/lib/writing-assessment/types";

export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
  Pragma: "no-cache",
  "X-Content-Type-Options": "nosniff",
} as const;

function jsonResponse(body: unknown, status: number): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

async function readBoundedBody(request: Request): Promise<string> {
  if (!request.body) return "";

  const reader = request.body.getReader();
  const decoder = new TextDecoder("utf-8", { fatal: true });
  let byteCount = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      byteCount += value.byteLength;
      if (byteCount > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new RequestValidationError(
          "request_too_large",
          "Request body is too large.",
          413,
        );
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return text;
  } catch (error) {
    if (error instanceof RequestValidationError) throw error;
    throw new RequestValidationError(
      "invalid_encoding",
      "Request body must be valid UTF-8.",
    );
  } finally {
    reader.releaseLock();
  }
}

function providerErrorResponse(error: ProviderError): NextResponse {
  if (error.kind === "configuration") {
    return jsonResponse(
      {
        error: {
          code: "coach_unavailable",
          message: "Writing coaching is not configured.",
        },
      },
      503,
    );
  }

  if (error.kind === "timeout") {
    return jsonResponse(
      {
        error: {
          code: "coach_timeout",
          message: "Writing coaching timed out. Please retry.",
        },
      },
      504,
    );
  }

  return jsonResponse(
    {
      error: {
        code: "coach_unavailable",
        message: "Writing coaching is temporarily unavailable. Please retry.",
      },
    },
    502,
  );
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

    const rawBody = await readBoundedBody(request);
    let parsedBody: unknown;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      throw new RequestValidationError(
        "invalid_json",
        "Request body must be valid JSON.",
      );
    }

    const assessmentRequest = validateRequestBody(parsedBody);
    const metrics = calculateWritingMetrics(assessmentRequest.responses);
    const coaching = await assessWritingWithGemma({
      apiKey: process.env.Gemma_API,
      model: process.env.GEMMA_MODEL,
      request: assessmentRequest,
      metrics,
    });
    const overallPracticeScore = Math.round(
      (coaching.scores.reduce((total, item) => total + item.score, 0) /
        coaching.scores.length) *
        10,
    );

    const result: WritingAssessmentResult = {
      version: WRITING_ASSESSMENT_VERSION,
      assessmentType: assessmentRequest.assessmentType,
      metrics,
      scores: coaching.scores,
      overallPracticeScore,
      summary: coaching.summary,
      strengths: coaching.strengths,
      improvements: coaching.improvements,
      disclaimer: WRITING_COACH_DISCLAIMER,
    };

    return jsonResponse(result, 200);
  } catch (error) {
    if (error instanceof RequestValidationError) {
      return jsonResponse(
        {
          error: {
            code: error.code,
            message: error.message,
          },
        },
        error.status,
      );
    }
    if (error instanceof ProviderError) {
      return providerErrorResponse(error);
    }
    return jsonResponse(
      {
        error: {
          code: "internal_error",
          message: "Writing coaching is temporarily unavailable.",
        },
      },
      500,
    );
  }
}
