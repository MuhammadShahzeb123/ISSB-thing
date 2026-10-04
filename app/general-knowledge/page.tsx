import type { Metadata } from "next";
import Link from "next/link";
import CurrentAffairsBrowser from "../components/CurrentAffairsBrowser";
import GeneralKnowledgeBrowser from "../components/GeneralKnowledgeBrowser";
import PracticeDisclaimer from "../components/PracticeDisclaimer";
import { getPreparationArea } from "../lib/siteNavigation";

const area = getPreparationArea("general-knowledge");

export const metadata: Metadata = {
  title: "General Knowledge - ISSB Prep",
  description:
    "Current affairs stories with audio, then card-based ISSB general knowledge: Indus Waters Treaty, PAF aircraft, air defence, geography, CPEC and a sourced Q&A bank.",
};

export default function GeneralKnowledgeOverviewPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Preparation area</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">{area.label}</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">{area.summary}</p>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
          Start with this year&apos;s current affairs, then the core topics below. Tap any card to read it, press Play to
          listen, and mark it done when you know it.
        </p>
        <div className="prep-page mt-8 !p-0 text-left">
          <CurrentAffairsBrowser />
        </div>
        <h2 className="mt-14 text-3xl font-black sm:text-4xl">Core general knowledge</h2>
        <p className="mt-3 max-w-2xl text-base font-semibold leading-7 text-slate-600">
          The Indus Waters Treaty, borders and passes, CPEC, PAF aircraft, air defence and the full question bank.
        </p>
        <div className="prep-page mt-6 !p-0 text-left">
          <GeneralKnowledgeBrowser />
        </div>
        <h2 className="mt-12 text-2xl font-black">More study tools</h2>
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {area.resources.map((resource) => (
            <Link
              key={resource.href}
              href={resource.href}
              className="border-2 border-slate-950 bg-white p-6 text-slate-950 shadow-[6px_6px_0_#171717] transition hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
            >
              <h2 className="text-xl font-black">{resource.label}</h2>
              <p className="mt-3 leading-7 text-slate-700">{resource.description}</p>
              <span className="mt-5 inline-block font-black uppercase tracking-wide text-blue-800">Open resource →</span>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
