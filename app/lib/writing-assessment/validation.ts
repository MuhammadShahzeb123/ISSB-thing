import type {
  ResolvedWritingAssessmentRequest,
  WritingAssessmentType,
  WritingAssessmentRequest,
  WritingResponseRecord,
} from "./types";

export const MAX_REQUEST_BYTES = 32_768;
export const MAX_RESPONSES = 50;
export const MAX_TEXT_LENGTH = 2_000;
export const MAX_TOTAL_TEXT_LENGTH = 12_000;

const REQUEST_KEYS = ["assessmentType", "responses", "version"] as const;
const RESPONSE_KEYS = ["promptId", "text"] as const;
const PROMPT_ID_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9._:-]{0,126}[A-Za-z0-9])?$/;
const ASSESSMENT_TYPES = new Set<WritingAssessmentType>([
  "picture-association",
  "sentence-completion",
  "story-writing",
  "word-association",
]);

export type WritingPromptRegistry = Readonly<
  Record<WritingAssessmentType, ReadonlyMap<string, string>>
>;

export class RequestValidationError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(code: string, message: string, status = 400) {
    super(message);
    this.name = "RequestValidationError";
    this.code = code;
    this.status = status;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
): boolean {
  const keys = Object.keys(value).sort();
  return (
    keys.length === expected.length &&
    keys.every((key, index) => key === expected[index])
  );
}

function validateResponse(value: unknown, index: number): WritingResponseRecord {
  if (!isRecord(value) || !hasExactKeys(value, RESPONSE_KEYS)) {
    throw new RequestValidationError(
      "invalid_response",
      `Response ${index + 1} must contain only promptId and text.`,
    );
  }

  if (
    typeof value.promptId !== "string" ||
    !PROMPT_ID_PATTERN.test(value.promptId)
  ) {
    throw new RequestValidationError(
      "invalid_prompt_id",
      `Response ${index + 1} has an invalid promptId.`,
    );
  }

  if (typeof value.text !== "string") {
    throw new RequestValidationError(
      "invalid_text",
      `Response ${index + 1} text must be a string.`,
    );
  }

  const text = value.text.trim();
  if (text.length === 0 || text.length > MAX_TEXT_LENGTH || /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u.test(text)) {
    throw new RequestValidationError(
      "invalid_text",
      `Response ${index + 1} text is empty, too long, or contains unsupported control characters.`,
    );
  }

  return { promptId: value.promptId, text };
}

export function validateRequestBody(value: unknown): WritingAssessmentRequest {
  if (!isRecord(value) || !hasExactKeys(value, REQUEST_KEYS)) {
    throw new RequestValidationError(
      "invalid_request",
      "Request must contain only version, assessmentType, and responses.",
    );
  }

  if (value.version !== "1") {
    throw new RequestValidationError(
      "unsupported_version",
      "Unsupported request version.",
    );
  }

  if (
    typeof value.assessmentType !== "string" ||
    !ASSESSMENT_TYPES.has(value.assessmentType as WritingAssessmentType)
  ) {
    throw new RequestValidationError(
      "invalid_assessment_type",
      "assessmentType is not supported.",
    );
  }

  if (
    !Array.isArray(value.responses) ||
    value.responses.length === 0 ||
    value.responses.length > MAX_RESPONSES
  ) {
    throw new RequestValidationError(
      "invalid_responses",
      `responses must contain between 1 and ${MAX_RESPONSES} records.`,
    );
  }

  const responses = value.responses.map(validateResponse);
  const promptIds = new Set<string>();
  let totalTextLength = 0;

  for (const response of responses) {
    if (promptIds.has(response.promptId)) {
      throw new RequestValidationError(
        "duplicate_prompt_id",
        "Each response must have a unique promptId.",
      );
    }
    promptIds.add(response.promptId);
    totalTextLength += response.text.length;
  }

  if (totalTextLength > MAX_TOTAL_TEXT_LENGTH) {
    throw new RequestValidationError(
      "request_too_large",
      "The combined writing is too long.",
      413,
    );
  }

  return {
    version: "1",
    assessmentType: value.assessmentType as WritingAssessmentType,
    responses,
  };
}

export function resolveRequestPrompts(
  request: WritingAssessmentRequest,
  registry: WritingPromptRegistry,
): ResolvedWritingAssessmentRequest {
  const prompts = registry[request.assessmentType];

  return {
    ...request,
    responses: request.responses.map((response, index) => {
      const prompt = prompts.get(response.promptId);
      if (!prompt) {
        throw new RequestValidationError(
          "unknown_prompt_id",
          `Response ${index + 1} does not match a registered prompt for this assessment.`,
        );
      }
      return { ...response, prompt };
    }),
  };
}

export function validateRequestHeaders(input: {
  contentLength: string | null;
  contentType: string | null;
  fetchSite: string | null;
  origin: string | null;
  requestUrl: string;
}): void {
  const mediaType = input.contentType?.split(";", 1)[0]?.trim().toLowerCase();
  if (mediaType !== "application/json") {
    throw new RequestValidationError(
      "unsupported_media_type",
      "Content-Type must be application/json.",
      415,
    );
  }

  if (input.contentLength !== null) {
    if (!/^\d+$/u.test(input.contentLength)) {
      throw new RequestValidationError(
        "invalid_content_length",
        "Invalid Content-Length header.",
      );
    }
    if (Number(input.contentLength) > MAX_REQUEST_BYTES) {
      throw new RequestValidationError(
        "request_too_large",
        "Request body is too large.",
        413,
      );
    }
  }

  let expectedOrigin: string;
  let suppliedOrigin: string;
  try {
    expectedOrigin = new URL(input.requestUrl).origin;
    suppliedOrigin = input.origin ? new URL(input.origin).origin : "";
  } catch {
    throw new RequestValidationError(
      "invalid_origin",
      "Request origin is invalid.",
      403,
    );
  }

  if (!input.origin || input.origin !== suppliedOrigin || suppliedOrigin !== expectedOrigin) {
    throw new RequestValidationError(
      "cross_origin_request",
      "Cross-origin requests are not allowed.",
      403,
    );
  }

  if (input.fetchSite !== null && input.fetchSite !== "same-origin") {
    throw new RequestValidationError(
      "cross_origin_request",
      "Cross-origin requests are not allowed.",
      403,
    );
  }
}
