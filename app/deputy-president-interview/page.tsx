import Link from "next/link";
import PracticeDisclaimer from "../components/PracticeDisclaimer";
import { getPreparationArea } from "../lib/siteNavigation";

const area = getPreparationArea("deputy-president-interview");

export default function DeputyPresidentInterviewOverviewPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Core assessor dimension</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">{area.label}</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">{area.summary}</p>
        <section className="mt-10 border-2 border-slate-950 bg-white p-6 shadow-[6px_6px_0_#171717] sm:p-8">
          <h2 className="text-2xl font-black">Know your own record</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Review your education, family background, interests, responsibilities, service motivation, and
            current awareness so you can answer honestly and directly.
          </p>
        </section>
        <div className="mt-8 grid gap-5">
          {area.resources.map((resource) => (
            <Link
              className="border-2 border-slate-950 bg-white p-6 text-slate-950 shadow-[6px_6px_0_#171717] transition hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
              href={resource.href}
              key={resource.href}
            >
              <h2 className="text-xl font-black">{resource.label}</h2>
              <p className="mt-3 leading-7 text-slate-700">{resource.description}</p>
              <span className="mt-5 inline-block font-black uppercase tracking-wide text-blue-800">
                Open resource →
              </span>
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
