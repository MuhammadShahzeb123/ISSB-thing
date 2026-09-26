import Link from "next/link";
import PracticeDisclaimer from "./components/PracticeDisclaimer";
import { siteNavigation } from "./lib/siteNavigation";
import { collections, libraryItemCount } from "./lib/library";
import "./library.css";

export default function HomePage() {
  return (
    <div className="neo-page px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">
            ISSB preparation
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
            Prepare with a clear map.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
            Official ISSB material describes Psychological, GTO, and Deputy
            President/interview as the core assessor dimensions. Physical and
            General Knowledge are included here as preparation areas, not
            additional official dimensions.
          </p>
        </header>

        <section className="mt-10 border-[3px] border-slate-950 bg-amber-100 p-6 shadow-[6px_6px_0_#171717] sm:p-8" aria-labelledby="library-cta">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">New · start here</p>
              <h2 id="library-cta" className="mt-2 text-3xl font-black sm:text-4xl">Practice library</h2>
              <p className="mt-3 text-lg font-semibold leading-8 text-slate-700">
                All {libraryItemCount.toLocaleString()} tests and notes from the 52 study photos, sorted into timed tests and revision decks. Pick one and start in a single click.
              </p>
            </div>
            <Link href="/library" className="prep-button">Open the library →</Link>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {collections.map((collection) => (
              <Link key={collection.slug} href={`/library/${collection.slug}`} className={`lib-chip lib-chip--accent lib-accent-${collection.accent}`} style={{ fontSize: "0.85rem", padding: "0.35rem 0.7rem", textDecoration: "none", color: "var(--ink)" }}>
                {collection.short}
              </Link>
            ))}
          </div>
        </section>

        <h2 className="mt-12 text-2xl font-black">Preparation areas</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {siteNavigation.map((area) => (
            <Link
              key={area.slug}
              href={area.href}
              className={`border-2 border-slate-950 p-6 text-slate-950 shadow-[6px_6px_0_#171717] transition hover:-translate-y-1 focus-visible:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700 ${
                area.slug === "general-knowledge" ? "bg-amber-100" : "bg-white"
              }`}
            >
              <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-800">
                {area.classification === "core-assessor-dimension"
                  ? "Core assessor dimension"
                  : "Preparation area"}
              </p>
              <h2 className="mt-3 text-2xl font-black">{area.label}</h2>
              <p className="mt-3 leading-7 text-slate-700">{area.summary}</p>
              <span className="mt-6 inline-block font-black uppercase tracking-wide text-blue-800">
                Explore area →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
