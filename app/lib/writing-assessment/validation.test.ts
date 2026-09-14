import assert from "node:assert/strict";
import test from "node:test";

// @ts-expect-error Node's type-stripping test runner requires an explicit extension.
import { RequestValidationError, validateRequestBody, validateRequestHeaders } from "./validation.ts";

test("accepts the exact versioned request shape", () => {
  assert.deepEqual(
    validateRequestBody({
      version: "1",
      assessmentType: "word-association",
      responses: [{ promptId: "word-1", text: "  We solve problems together.  " }],
    }),
    {
      version: "1",
      assessmentType: "word-association",
      responses: [{ promptId: "word-1", text: "We solve problems together." }],
    },
  );
});

test("rejects extra fields and duplicate prompt IDs", () => {
  assert.throws(
    () =>
      validateRequestBody({
        version: "1",
        assessmentType: "word-association",
        responses: [{ promptId: "word-1", text: "Act." }],
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
          { promptId: "word-1", text: "Act." },
          { promptId: "word-1", text: "Help." },
        ],
      }),
    /unique promptId/u,
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
