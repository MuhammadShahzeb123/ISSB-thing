import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { RequestValidationError, resolveRequestPrompts, validateRequestBody, validateRequestHeaders } from "./validation.ts";

test("accepts the exact versioned request shape", () => {
  assert.deepEqual(
    validateRequestBody({
      version: "1",
      assessmentType: "word-association",
      responses: [{ promptId: "wat-1", text: "  We solve problems together.  " }],
    }),
    {
      version: "1",
      assessmentType: "word-association",
      responses: [{ promptId: "wat-1", text: "We solve problems together." }],
    },
  );
});

test("rejects extra fields and duplicate prompt IDs", () => {
  assert.throws(
    () =>
      validateRequestBody({
        version: "1",
        assessmentType: "word-association",
        responses: [{ promptId: "wat-1", text: "Act." }],
        userId: "not-allowed",
      }),
    RequestValidationError,
  );

  assert.throws(
    () =>
      validateRequestBody({
        version: "1",
        assessmentType: "word-association",
        responses: [
          { promptId: "wat-1", text: "Act." },
          { promptId: "wat-1", text: "Help." },
        ],
      }),
    /unique promptId/u,
  );
});

test("rejects unsupported assessment types and unregistered prompt IDs", () => {
  assert.throws(
    () =>
      validateRequestBody({
        version: "1",
        assessmentType: "custom-rubric",
        responses: [{ promptId: "wat-1", text: "Act." }],
      }),
    /not supported/u,
  );

  const request = validateRequestBody({
    version: "1",
    assessmentType: "word-association",
    responses: [{ promptId: "wat-999", text: "Act." }],
  });
  const empty = new Map<string, string>();
  assert.throws(
    () =>
      resolveRequestPrompts(request, {
        "picture-association": empty,
        "sentence-completion": empty,
        "story-writing": empty,
        "word-association": new Map([["wat-1", "AGREE"]]),
      }),
    /registered prompt/u,
  );
});

test("enforces JSON and same-origin headers", () => {
  assert.doesNotThrow(() =>
    validateRequestHeaders({
      contentLength: "100",
      contentType: "application/json; charset=utf-8",
      fetchSite: "same-origin",
      origin: "https://practice.example",
      requestUrl: "https://practice.example/api/writing-assessment",
    }),
  );

  assert.throws(
    () =>
      validateRequestHeaders({
        contentLength: null,
        contentType: "text/plain",
        fetchSite: "cross-site",
        origin: "https://attacker.example",
        requestUrl: "https://practice.example/api/writing-assessment",
      }),
    RequestValidationError,
  );
});
