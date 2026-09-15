import Link from 'next/link';
import {
  CONTENT_VERSION,
  LIKERT_OPTIONS,
  PRACTICE_DIMENSIONS,
} from '../content/model';

const safeguards = [
  'No overall suitability judgment or selection prediction',
  'No comparison with other people or reference population',
  'No health or clinical interpretation',
  'No preferred-response coaching',
  'No server storage or account profile',
] as const;

export default function OpiMethodologyPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <article className="mx-auto max-w-5xl">
        <header className="border-2 border-slate-950 bg-blue-100 p-6 shadow-[7px_7px_0_#171717] sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">
            Methodology · source · provenance
          </p>
          <h1 className="mt-4 text-5xl font-black leading-none sm:text-7xl">
            Transparent by design.
          </h1>
          <p className="mt-6 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
            This is an unvalidated work-behavior self-reflection exercise. It is not an official
            ISSB instrument, and its statements are not official ISSB items.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <section className="border-2 border-slate-950 bg-white p-6 shadow-[5px_5px_0_#171717]">
            <h2 className="text-3xl font-black">Content provenance</h2>
            <p className="mt-4 font-semibold leading-7 text-slate-700">
              The statement bank was authored for this project from broad, everyday work-behavior
              concepts. It was not copied or adapted from a proprietary personality inventory.
            </p>
            <p className="mt-4 font-semibold leading-7 text-slate-700">
              A checked-in deterministic generator combines ten authored contexts with ten
              dimension-specific behavior clauses. Each dimension contains 100 unique statements:
              50 direct-keyed and 50 reverse-keyed. The resulting 1,000-statement export is committed
              with the application, so no generative service runs during practice.
            </p>
            <dl className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border-2 border-slate-950 bg-amber-100 p-3">
                <dt className="text-xs font-black uppercase tracking-wide">Content version</dt>
                <dd className="mt-1 font-mono font-black">{CONTENT_VERSION}</dd>
              </div>
              <div className="border-2 border-slate-950 bg-lime-100 p-3">
                <dt className="text-xs font-black uppercase tracking-wide">Bank size</dt>
                <dd className="mt-1 font-black">1,000 statements</dd>
              </div>
            </dl>
          </section>

          <section className="border-2 border-slate-950 bg-amber-100 p-6 shadow-[5px_5px_0_#171717]">
            <h2 className="text-3xl font-black">How summaries work</h2>
            <p className="mt-4 font-semibold leading-7 text-slate-700">
              Responses use a five-point agreement scale from {LIKERT_OPTIONS[0].label.toLowerCase()}{' '}
              to {LIKERT_OPTIONS[4].label.toLowerCase()}. Reverse-keyed wording is scored in the
              opposite direction before the responses in each dimension are averaged.
            </p>
            <p className="mt-4 font-semibold leading-7 text-slate-700">
              The summary uses neutral bands such as “mixed across these responses.” It does not
              combine dimensions into one result. A different day, context, or statement sample may
              produce a different reflection.
            </p>
          </section>
        </div>

        <section className="mt-8">
          <h2 className="text-3xl font-black">Dimensions included</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {PRACTICE_DIMENSIONS.map((dimension, index) => (
              <div
                key={dimension.id}
                className={`border-2 border-slate-950 p-4 shadow-[4px_4px_0_#171717] ${
                  index % 2 === 0 ? 'bg-pink-100' : 'bg-blue-100'
                }`}
              >
                <h3 className="text-xl font-black">{dimension.label}</h3>
                <p className="mt-1 font-semibold leading-6 text-slate-700">{dimension.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 border-2 border-slate-950 bg-white p-6 shadow-[5px_5px_0_#171717]">
          <h2 className="text-3xl font-black">Interpretation safeguards</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {safeguards.map((safeguard) => (
              <li key={safeguard} className="border-2 border-slate-950 bg-lime-100 p-3 font-black">
                {safeguard}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-8 border-2 border-slate-950 bg-blue-100 p-6 shadow-[5px_5px_0_#171717]">
          <h2 className="text-3xl font-black">Data handling</h2>
          <p className="mt-4 font-semibold leading-7 text-slate-700">
            The current session is stored only in this browser’s local storage so it can be paused
            and resumed. The module has no application endpoint for response upload. You can download
            a JSON copy or delete the saved session from the practice page.
          </p>
        </section>

        <Link
          href="/opi"
          className="mt-9 inline-block border-2 border-slate-950 bg-blue-300 px-6 py-4 text-lg font-black shadow-[5px_5px_0_#171717] transition hover:-translate-y-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-blue-700"
        >
          Return to self-reflection
        </Link>
      </article>
    </div>
  );
}
