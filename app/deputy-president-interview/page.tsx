import type { Metadata } from "next";
import Link from "next/link";
import DimensionProgress from "../components/DimensionProgress";
import PracticeDisclaimer from "../components/PracticeDisclaimer";
import DeputyPresidentPractice from "./DeputyPresidentPractice";

export const metadata: Metadata = {
  title: "Deputy President Interview - ISSB Prep",
  description: "Eight deputy president interview styles. Record your answers in the browser. Nothing is uploaded.",
};

const resources = [
  { label: "Bio data", href: "/biodata", description: "See every question on the civilian personal information form, plus the 24 events from item 15. A local draft only — nothing is sent to ISSB." },
  { label: "Interview preparation room", href: "/interview", description: "Introduction notes, quick maths, current affairs, and gallantry stories." },
  { label: "Nishan-e-Haider martyrs", href: "/nishan-e-haider", description: "Photo cards and compact stories for all eleven recipients." },
  { label: "World affairs cards", href: "/current-affairs", description: "Short card + popup briefings (India–Pakistan, defence pact, Middle East)." },
  { label: "General Knowledge cards", href: "/general-knowledge", description: "Pakistan geography, dams, CPEC, the Indus Waters Treaty, and the PAF." },
];

export default function DeputyPresidentInterviewOverviewPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">Core assessor dimension</p>
        <h1 className="mt-3 text-4xl font-black leading-tight sm:text-6xl">Deputy President Interview</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          Pick a style and answer out loud. Each question stays up until you move on. Recordings stay in this browser so you can hear yourself and try again.
        </p>

        <DeputyPresidentPractice />

        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Supporting material">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href} className="border-2 border-slate-950 bg-white p-5 text-slate-950 shadow-[5px_5px_0_#171717] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700">
              <h2 className="text-xl font-black">{resource.label}</h2>
              <p className="mt-2 leading-7 text-slate-700">{resource.description}</p>
            </Link>
          ))}
        </section>

        <section className="prep-panel mt-8" aria-labelledby="dpi-hssc">
          <h2 id="dpi-hssc">Keep the answers this short</h2>
          <div className="gk-tile-grid mt-4">
            <article className="gk-tile gk-tile--qa" style={{ cursor: "default" }}>
              <strong className="gk-tile-title">Know yourself</strong>
              <span className="gk-tile-teaser">Family, education, sports, hobbies, strengths and weaknesses. Honest biodata beats a memorised speech.</span>
            </article>
            <article className="gk-tile gk-tile--qa" style={{ cursor: "default" }}>
              <strong className="gk-tile-title">Pakistan, plainly</strong>
              <span className="gk-tile-teaser">Four provinces and capitals, neighbours, the Indus, Tarbela, Khyber Pass, CPEC and Gwadar.</span>
            </article>
            <article className="gk-tile gk-tile--qa" style={{ cursor: "default" }}>
              <strong className="gk-tile-title">When you do not know</strong>
              <span className="gk-tile-teaser">Say so. Then give the one fact you are sure of. Do not invent a treaty clause or a casualty number.</span>
            </article>
            <article className="gk-tile gk-tile--qa" style={{ cursor: "default" }}>
              <strong className="gk-tile-title">Hear yourself</strong>
              <span className="gk-tile-teaser">Play the take back. If it wanders, record it again. The file never leaves this browser.</span>
            </article>
          </div>
        </section>

        <section className="psych-random" aria-labelledby="dpi-random">
          <h2 id="dpi-random" className="text-xl font-black">Other interview practice</h2>
          <p className="mt-2 leading-7 text-slate-700">
            Maths, stories, and the photo question bank live in the preparation room. Random and revision are optional and sit below the interview styles.
          </p>
          <DimensionProgress dimension="deputy-president-interview" />
          <div className="dimension-start-actions">
            <Link href="/interview" className="cta-button">Interview preparation room</Link>
            <Link href="/practice/start?d=deputy-president-interview" className="cta-button cta-button--secondary">Take random test</Link>
            <Link href="/practice/revision?d=deputy-president-interview" className="cta-button cta-button--secondary">Revision mode</Link>
          </div>
        </section>

        <div className="mt-10 max-w-3xl"><PracticeDisclaimer /></div>
      </div>
    </div>
  );
}
