import type { Metadata } from 'next';
import Link from 'next/link';
import PracticeDisclaimer from '../components/PracticeDisclaimer';
import { awardExplanation, militaryStories } from '../lib/militaryStories';

export const metadata: Metadata = {
  title: 'Nishan-e-Haider Martyrs - ISSB Prep',
  description:
    'Compact profiles of all ten Nishan-e-Haider recipients: rank, unit, place, date, and short stories for interview preparation.',
};

function Initials({ name }: { name: string }) {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return <span aria-hidden="true">{letters.toUpperCase()}</span>;
}

export default function NishanEHaiderPage() {
  return (
    <div className="neo-page px-4 py-10 sm:px-6 sm:py-14">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-black uppercase tracking-[0.22em] text-blue-800">Gallantry award</p>
        <h1 className="mt-3 text-4xl font-black leading-none sm:text-6xl">Nishan-e-Haider</h1>
        <p className="mt-5 max-w-3xl text-lg font-semibold leading-8 text-slate-700">
          Pakistan&apos;s highest military gallantry award. Ten men have received it (nine Army, one Air Force).
          Use these compact cards to remember rank, place, action, and date — then tell each story in your own words.
        </p>

        <section className="prep-panel mt-8" aria-labelledby="award-note">
          <h2 id="award-note">How to use this page</h2>
          <p>{awardExplanation}</p>
          <p className="mt-3">
            Every card shows a portrait of the person (face and uniform), not a monument or grave. Some images are
            free-licensed Commons/ISPR files; others are fair-use Wikipedia portraits hosted here for educational
            ISSB study with clear attribution under each card.
          </p>
          <p className="mt-4">
            <Link href="/interview?tab=stories">Open interview recall practice →</Link>
          </p>
        </section>

        <p className="prep-muted mt-6 mb-4" role="status">
          {militaryStories.length} recipients · scan the cards, then open details if you need the six recall points
        </p>

        <div className="martyr-grid">
          {militaryStories.map((story) => (
            <article key={story.id} className="martyr-card" id={story.id}>
              <div className="martyr-card-media">
                {story.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={story.image}
                    alt={`Portrait of ${story.rank} ${story.name}`}
                    loading="lazy"
                    width={360}
                    height={360}
                  />
                ) : (
                  <div className="martyr-card-placeholder" role="img" aria-label={`No free portrait for ${story.name}`}>
                    <Initials name={story.name} />
                  </div>
                )}
                {!story.image && <span className="martyr-card-badge">Photo unavailable</span>}
              </div>

              <div className="martyr-card-body">
                <p className="martyr-card-award">{story.award}</p>
                <h2>
                  {story.rank} {story.name}
                </h2>
                <dl className="martyr-card-meta">
                  <div>
                    <dt>Service</dt>
                    <dd>{story.service}</dd>
                  </div>
                  <div>
                    <dt>Unit</dt>
                    <dd>{story.unit}</dd>
                  </div>
                  <div>
                    <dt>Conflict</dt>
                    <dd>{story.conflict}</dd>
                  </div>
                  <div>
                    <dt>Place</dt>
                    <dd>{story.place}</dd>
                  </div>
                  <div>
                    <dt>Martyrdom</dt>
                    <dd>
                      <time>{story.deathDate}</time>
                    </dd>
                  </div>
                </dl>
                <p className="martyr-card-summary">{story.summary}</p>
                <p className="prep-note">
                  <strong>Remember:</strong> {story.memory}
                </p>
                <details className="prep-details">
                  <summary>Six details to recall</summary>
                  <dl>
                    {(
                      [
                        ['Name', `${story.rank} ${story.name}`],
                        ['What he did', story.what],
                        ['How he did it', story.how],
                        ['Local benefit', story.result],
                        ['How he died', story.death],
                        ['When he died', story.deathDate],
                      ] as const
                    ).map(([label, value]) => (
                      <div key={label} className="mb-3">
                        <dt className="font-bold">{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                  {story.caution && <p className="prep-muted">{story.caution}</p>}
                </details>
                {story.imageCredit && <p className="martyr-card-credit">Image: {story.imageCredit}</p>}
                <ul className="prep-muted martyr-card-sources">
                  {story.sources.map((source) => (
                    <li key={source.url}>
                      <a href={source.url} target="_blank" rel="noopener noreferrer">
                        {source.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <section className="prep-panel mt-8" aria-labelledby="image-notes">
          <h2 id="image-notes">Image notes</h2>
          <p>
            All ten cards use person portraits only. See{' '}
            <code>public/images/martyrs/ATTRIBUTION.json</code> for source pages and licence notes. Fair-use
            Wikipedia/ISPR likenesses are included for educational interview prep; do not reuse them commercially
            without checking the original licence.
          </p>
        </section>

        <div className="mt-8 max-w-3xl">
          <PracticeDisclaimer />
        </div>
      </div>
    </div>
  );
}
