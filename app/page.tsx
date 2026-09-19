import Link from "next/link";
import PracticeDisclaimer from "./components/PracticeDisclaimer";
import { dimensionLabels, practiceModules, type CoreDimension } from "./lib/practiceModules";
import { siteNavigation } from "./lib/siteNavigation";

const coreAreas = siteNavigation.filter((area) => area.classification === "core-assessor-dimension");
const generalKnowledge = siteNavigation.find((area) => area.slug === "general-knowledge");

export default function HomePage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="home-hero" aria-labelledby="home-heading">
          <div className="min-w-0">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">ISSB preparation</p>
            <h1 id="home-heading" className="mt-4 text-5xl font-black leading-none sm:text-7xl">
              Start practising in one click.
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-slate-700">
              Official ISSB material describes Psychological, GTO and Deputy President interview as
              the core assessor dimensions. A random test draws from all three so you practise
              without choosing the easy ones.
            </p>
          </div>
          <div className="home-hero-actions">
            <Link href="/practice/start" className="cta-button cta-button--large">Take random test</Link>
            <Link href="/practice/revision" className="cta-button cta-button--secondary">Revision mode</Link>
          </div>
        </section>

        <h2 className="mt-14 text-2xl font-black">Or pick a dimension</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {coreAreas.map((area) => {
            const dimension = area.slug as CoreDimension;
            const count = practiceModules.filter((item) => item.dimension === dimension).length;
            return (
              <article key={area.slug} className="home-dimension">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">{count} tests</p>
                <h3 className="mt-2 text-2xl font-black">{dimensionLabels[dimension]}</h3>
                <p className="mt-3 flex-1 leading-7 text-slate-700">{area.summary}</p>
                <div className="home-dimension-actions">
                  <Link href={`/practice/start?d=${dimension}`} className="cta-button">Random test</Link>
                  <Link href={area.href} className="home-dimension-link">Overview →</Link>
                </div>
              </article>
            );
          })}
        </div>

        {generalKnowledge && (
          <section className="mt-8 border-2 border-slate-950 bg-amber-100 p-6 shadow-[6px_6px_0_#171717]" aria-labelledby="gk-heading">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">Preparation area</p>
            <h2 id="gk-heading" className="mt-2 text-2xl font-black">{generalKnowledge.label}</h2>
            <p className="mt-3 max-w-3xl leading-7 text-slate-700">{generalKnowledge.summary}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link href="/general-knowledge" className="cta-button cta-button--secondary">Browse by category</Link>
              <Link href="/study" className="home-dimension-link">Spaced-repetition deck →</Link>
            </div>
          </section>
        )}

        <div className="mt-10 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
