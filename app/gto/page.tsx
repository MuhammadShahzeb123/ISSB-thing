import PracticeDisclaimer from "../components/PracticeDisclaimer";
import { getPreparationArea } from "../lib/siteNavigation";

const area = getPreparationArea("gto");

export default function GtoOverviewPage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Core assessor dimension</p>
        <h1 className="mt-3 text-4xl font-black sm:text-6xl">{area.label}</h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-slate-700">{area.summary}</p>
        <section className="mt-10 border-2 border-slate-950 bg-white p-6 shadow-[6px_6px_0_#171717] sm:p-8">
          <h2 className="text-2xl font-black">Prepare to contribute</h2>
          <p className="mt-3 leading-7 text-slate-700">
            Practise listening, concise communication, practical planning, teamwork, and calm leadership
            rather than rehearsing a fixed persona.
          </p>
        </section>
        <div className="mt-8">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
