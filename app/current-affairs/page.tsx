import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeDisclaimer from '../components/PracticeDisclaimer';
import {
  currentAffairs,
  regionPrimer,
  researchAsOf,
  researchCaveat,
} from '../lib/currentAffairs';

export const metadata: Metadata = {
  title: 'World Affairs & Wars - ISSB Prep',
  description:
    'Compact, sourced current-affairs briefings for ISSB interviews: Middle East conflicts, Asia, Saudi-Türkiye-Pakistan defence ties, India-Pakistan, and Afghanistan.',
};

const regionOrder = ['Asia', 'Pakistan', 'Middle East', 'Russia and Ukraine'] as const;

function formatDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return `${d} ${months[m - 1]} ${y}`;
}

export default function CurrentAffairsPage() {
  const grouped = regionOrder.map((region) => ({
    region,
    items: currentAffairs
      .filter((brief) => brief.region === region)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date)),
  }));

  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Current affairs</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">World affairs &amp; wars</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          Compact, factual briefings for ISSB general knowledge and the Deputy President interview. Focus areas:
          Middle East conflicts, Asia, the Saudi Arabia–Türkiye–Pakistan defence relationship, India–Pakistan, and
          Afghanistan. This is a dated study snapshot, not a live news ticker.
        </p>

        <section className="prep-panel mt-8" aria-labelledby="how-to-use">
          <h2 id="how-to-use">How to use this page</h2>
          <p>
            <strong>Research cutoff: {formatDate(researchAsOf)}.</strong> Read the short summary first, then the
            interview answer points. Always name your source and say when you do not know.
          </p>
          <details className="prep-details mt-3">
            <summary>Evidence rules</summary>
            <p>{researchCaveat}</p>
          </details>
          <p className="mt-4">
            <Link href="/interview?tab=affairs">Open interactive interview practice →</Link>
          </p>
        </section>

        <p className="prep-muted mt-6 mb-4" role="status">
          {currentAffairs.length} briefings · {regionPrimer.length} country primers
        </p>

        {grouped.map(({ region, items }) =>
          items.length ? (
            <section key={region} className="mt-8" aria-labelledby={`region-${region.replace(/\s+/g, '-')}`}>
              <h2 id={`region-${region.replace(/\s+/g, '-')}`} className="text-2xl font-black">
                {region}
              </h2>
              <div className="mt-4 space-y-4">
                {items.map((brief) => (
                  <article key={brief.id} className="prep-panel" id={brief.id}>
                    <p className="prep-muted mb-2">
                      <time dateTime={brief.date}>{formatDate(brief.date)}</time> · {brief.region}
                    </p>
                    <div className="prep-ask-block mt-2">
                      <p className="prep-ask-label">Interview question</p>
                      <h3 className="prep-ask">{brief.question}</h3>
                    </div>
                    <p className="prep-muted mt-3">Context · {brief.title}</p>
                    <p className="mt-2">{brief.summary}</p>
                    <p className="mt-3">
                      <strong>Why Pakistan:</strong> {brief.whyPakistan}
                    </p>
                    <details className="prep-details mt-3">
                      <summary>Answer points</summary>
                      <ul className="mt-2 list-disc space-y-2 pl-5">
                        {brief.answerPoints.map((point) => (
                          <li key={point}>{point}</li>
                        ))}
                      </ul>
                    </details>
                    <details className="prep-details mt-2">
                      <summary>Watch next</summary>
                      <ul className="mt-2 list-disc space-y-2 pl-5">
                        {brief.watch.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </details>
                    <ul className="prep-muted mt-3 space-y-1 text-sm">
                      {brief.sources.map((source) => (
                        <li key={source.url}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer">
                            {source.title}
                          </a>{' '}
                          <time dateTime={source.publishedAt}>({source.publishedAt})</time>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </section>
          ) : null,
        )}

        <section className="prep-panel mt-10" aria-labelledby="primers">
          <h2 id="primers">Country primers</h2>
          <p>Background geography only. Inclusion does not mean a country is at war.</p>
          <div className="prep-grid mt-5">
            {regionPrimer.map((country) => (
              <details className="prep-details" key={country.country}>
                <summary>{country.country}</summary>
                <p>
                  <strong>Capital:</strong> {country.capital}
                </p>
                <p>{country.whyItMatters}</p>
                <a href={country.source} target="_blank" rel="noopener noreferrer">
                  Background source
                </a>
              </details>
            ))}
          </div>
        </section>

        <div className="mt-8 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
