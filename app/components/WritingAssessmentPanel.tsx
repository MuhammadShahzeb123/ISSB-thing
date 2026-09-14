"use client";

import { useState } from "react";
import type {
  WritingAssessmentResult,
  WritingResponseRecord,
} from "@/app/lib/writing-assessment/types";

type WritingAssessmentPanelProps = {
  assessmentType: string;
  responses: readonly WritingResponseRecord[];
  title?: string;
};

const CRITERION_LABELS: Record<
  WritingAssessmentResult["scores"][number]["criterion"],
  string
> = {
  effectiveWordUse: "Effective word use",
  structureReadability: "Structure & readability",
  emotionalRange: "Emotional range",
  constructiveHopefulOutcome: "Constructive outcome",
  initiative: "Initiative",
  responsibility: "Responsibility",
  teamwork: "Teamwork",
  leadershipBehaviors: "Leadership behaviors",
};

function errorMessage(value: unknown): string {
  if (
    typeof value === "object" &&
    value !== null &&
    "error" in value &&
    typeof value.error === "object" &&
    value.error !== null &&
    "message" in value.error &&
    typeof value.error.message === "string"
  ) {
    return value.error.message;
  }
  return "Writing coaching is temporarily unavailable. Please retry.";
}

export default function WritingAssessmentPanel({
  assessmentType,
  responses,
  title = "AI writing coach",
}: WritingAssessmentPanelProps) {
  const [result, setResult] = useState<WritingAssessmentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const assessWriting = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/writing-assessment", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: "1",
          assessmentType,
          responses,
        }),
      });
      const payload: unknown = await response.json().catch(() => null);
      if (!response.ok) throw new Error(errorMessage(payload));
      setResult(payload as WritingAssessmentResult);
    } catch (assessmentError) {
      setResult(null);
      setError(
        assessmentError instanceof Error
          ? assessmentError.message
          : "Writing coaching is temporarily unavailable. Please retry.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section
      aria-busy={isLoading}
      className="border-2 border-slate-950 bg-white p-5 text-slate-950 shadow-[6px_6px_0_#171717] sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
            Unofficial practice feedback
          </p>
          <h2 className="mt-2 text-2xl font-black">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">
            Submit when you are ready. Only your prompt IDs and written
            responses are sent for coaching.
          </p>
        </div>
        <button
          type="button"
          onClick={assessWriting}
          disabled={isLoading || responses.length === 0}
          className="border-2 border-slate-950 bg-blue-700 px-4 py-3 text-sm font-black uppercase tracking-wide text-white shadow-[3px_3px_0_#171717] transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading
            ? "Reviewing…"
            : error
              ? "Retry coaching"
              : result
                ? "Review again"
                : "Get writing feedback"}
        </button>
      </div>

      {error ? (
        <p
          className="mt-5 border-2 border-red-900 bg-red-50 p-4 text-sm font-semibold text-red-900"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {result ? (
        <div className="mt-6 space-y-6" aria-live="polite">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border-2 border-slate-950 bg-amber-100 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-600">
                Practice score
              </p>
              <p className="mt-1 text-4xl font-black">
                {result.overallPracticeScore}
                <span className="text-base">/100</span>
              </p>
            </div>
            <div className="border-2 border-slate-950 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-600">
                Words reviewed
              </p>
              <p className="mt-1 text-3xl font-black">
                {result.metrics.totalWordCount}
              </p>
            </div>
            <div className="border-2 border-slate-950 p-4">
              <p className="text-xs font-black uppercase tracking-wide text-slate-600">
                Responses reviewed
              </p>
              <p className="mt-1 text-3xl font-black">
                {result.metrics.responseCount}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-black">Coaching summary</h3>
            <p className="mt-2 leading-7 text-slate-700">{result.summary}</p>
          </div>

          <div>
            <h3 className="text-lg font-black">Transparent sub-scores</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {result.scores.map((item) => (
                <div
                  key={item.criterion}
                  className="border border-slate-300 bg-slate-50 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="font-black">
                      {CRITERION_LABELS[item.criterion]}
                    </h4>
                    <span className="font-black">{item.score}/10</span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-700">
                    {item.evidence}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-black">Strengths to keep</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-700">
                {result.strengths.map((strength) => (
                  <li key={strength}>{strength}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-black">Specific improvements</h3>
              <ul className="mt-2 space-y-3">
                {result.improvements.map((improvement) => (
                  <li key={`${improvement.focus}:${improvement.advice}`}>
                    <p className="text-sm font-black">{improvement.focus}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {improvement.advice}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="border-t-2 border-slate-950 pt-4 text-xs font-semibold leading-5 text-slate-600">
            {result.disclaimer}
          </p>
        </div>
      ) : null}
    </section>
  );
}
