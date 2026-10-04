'use client';

import Link from 'next/link';
import { useEffect, useId, useRef, useState } from 'react';
import TitleWithAudio from './TitleWithAudio';
import { awardExplanation, militaryStories, type MilitaryStory } from '../lib/militaryStories';
import { martyrNarration } from '../lib/narrationCatalog';

function Initials({ name }: { name: string }) {
  const parts = name.split(/\s+/).filter(Boolean);
  const letters = (parts[0]?.[0] ?? '') + (parts.at(-1)?.[0] ?? '');
  return <span aria-hidden="true">{letters.toUpperCase()}</span>;
}

function StoryMeta({ story }: { story: MilitaryStory }) {
  return (
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
  );
}

function MartyrModal({ story, onClose }: { story: MilitaryStory; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const narr = martyrNarration[story.id];

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="martyr-card-award">{story.award}</p>
          <TitleWithAudio
            as="h2"
            className="gk-modal-title-row"
            script={narr?.script ?? story.spokenScript}
            audioSrc={narr?.audio}
            playLabel={`Play story of ${story.rank} ${story.name}`}
          >
            <span id={titleId}>
              {story.rank} {story.name}
            </span>
          </TitleWithAudio>
          <StoryMeta story={story} />
          <div className="martyr-story-body">
            {story.story.split(/\n\n+/).map((para, index) => (
              <p key={index}>{para}</p>
            ))}
          </div>
          {story.caution && <p className="prep-muted">{story.caution}</p>}
          {story.imageCredit && <p className="martyr-card-credit">Image: {story.imageCredit}</p>}
          <h3>Sources</h3>
          <ul className="gk-modal-sources martyr-card-sources">
            {story.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

export default function MartyrGallery() {
  const [openStory, setOpenStory] = useState<MilitaryStory | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const match = militaryStories.find((story) => story.id === hash);
    if (match) setOpenStory(match);
  }, []);

  return (
    <>
      <section className="prep-panel mt-8" aria-labelledby="award-note">
        <h2 id="award-note">How to use this page</h2>
        <p>{awardExplanation}</p>
        <p className="mt-3">
          Every card shows a portrait of the person (face and uniform), not a monument or grave. Some images are
          free-licensed Commons/ISPR files; others are fair-use Wikipedia portraits hosted here for educational
          ISSB study with clear attribution in the story popup. Tap a card to open the full spoken-style story.
          Tap <strong>Play</strong> beside the name in the popup to hear it aloud.
        </p>
        <p className="mt-4">
          <Link href="/interview?tab=stories">Open interview recall practice →</Link>
        </p>
      </section>

      <p className="prep-muted mt-6 mb-4" role="status">
        {militaryStories.length} recipients · read the hook, open the story popup, play the audio
      </p>

      <div className="martyr-grid">
        {militaryStories.map((story) => (
          <article key={story.id} className="martyr-card" id={story.id}>
            <button
              type="button"
              className="martyr-card-open"
              onClick={() => setOpenStory(story)}
              aria-haspopup="dialog"
              aria-label={`Open story of ${story.rank} ${story.name}`}
            >
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
                <h2 className="martyr-card-title">
                  {story.rank} {story.name}
                </h2>
                <StoryMeta story={story} />
                <p className="martyr-card-summary">{story.summary}</p>
                <span className="martyr-card-cta">Open story →</span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {openStory ? <MartyrModal story={openStory} onClose={() => setOpenStory(null)} /> : null}
    </>
  );
}
