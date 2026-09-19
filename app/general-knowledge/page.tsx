import Link from "next/link";
import GeneralKnowledgeBrowser from "../components/GeneralKnowledgeBrowser";
import PracticeDisclaimer from "../components/PracticeDisclaimer";
import { getPreparationArea } from "../lib/siteNavigation";

const area = getPreparationArea("general-knowledge");

export default function GeneralKnowledgeOverviewPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Preparation area</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">{area.label}</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">{area.summary}</p>
        <div className="prep-page mt-8 !p-0 text-left">
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
