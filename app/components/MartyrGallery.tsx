'use client';

import Link from 'next/link';
import TitleWithAudio from './TitleWithAudio';
import { awardExplanation, militaryStories } from '../lib/militaryStories';
import { martyrNarration } from '../lib/narrationCatalog';

function Initials({ name }: { name: string }) {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return <span aria-hidden="true">{letters.toUpperCase()}</span>;
}

export default function MartyrGallery() {
  return (
    <>
      <section className="prep-panel mt-8" aria-labelledby="award-note">
        <h2 id="award-note">How to use this page</h2>
        <p>{awardExplanation}</p>
        <p className="mt-3">
          Every card shows a portrait of the person (face and uniform), not a monument or grave. Some images are
          free-licensed Commons/ISPR files; others are fair-use Wikipedia portraits hosted here for educational
          ISSB study with clear attribution under each card. Tap <strong>Play</strong> beside a name to hear the
          story aloud.
        </p>
        <p className="mt-4">
          <Link href="/interview?tab=stories">Open interview recall practice →</Link>
        </p>
      </section>

      <p className="prep-muted mt-6 mb-4" role="status">
        {militaryStories.length} recipients · scan the cards, play the audio, then open details if you need the six
        recall points
      </p>

      <div className="martyr-grid">
        {militaryStories.map((story) => {
          const narr = martyrNarration[story.id];
          return (
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
                <TitleWithAudio
                  as="h2"
                  script={narr?.script ?? story.spokenScript}
                  audioSrc={narr?.audio}
                  playLabel={`Play story of ${story.rank} ${story.name}`}
                >
                  {story.rank} {story.name}
                </TitleWithAudio>
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
          );
        })}
      </div>
    </>
  );
}
