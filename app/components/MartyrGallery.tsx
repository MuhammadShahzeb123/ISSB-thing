'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useRef, useState } from 'react';
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

const DONE_STORAGE_KEY = 'issb-nh-stories-done-v1';

function MartyrModal({
  story,
  done,
  onClose,
  onAudioEnded,
}: {
  story: MilitaryStory;
  done: boolean;
  onClose: () => void;
  onAudioEnded: () => string | void;
}) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.scrollTop = 0;
    dialog.querySelector<HTMLElement>('.gk-modal-body')?.scrollTo(0, 0);
  }, [story.id]);

  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div ref={dialogRef} className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          {done ? <span className="gk-badge gk-done-badge gk-modal-done">Done</span> : null}
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
            onEnded={onAudioEnded}
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
  const [doneIds, setDoneIds] = useState<Record<string, true>>({});
  const hydrated = useRef(false);
  const openStoryRef = useRef(openStory);
  useEffect(() => {
    openStoryRef.current = openStory;
  }, [openStory]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(DONE_STORAGE_KEY);
      // Load after mount so the server render matches an empty client first paint.
      // eslint-disable-next-line react-hooks/set-state-in-effect -- persisted device state
      if (raw) setDoneIds(JSON.parse(raw) as Record<string, true>);
    } catch {
      // private browsing / blocked storage
    } finally {
      hydrated.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(DONE_STORAGE_KEY, JSON.stringify(doneIds));
    } catch {
      // ignore
    }
  }, [doneIds]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const match = militaryStories.find((story) => story.id === hash);
    // Deep link only; reading location.hash during render would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hash open
    if (match) setOpenStory(match);
  }, []);

  const closeStory = useCallback(() => setOpenStory(null), []);

  const onStoryAudioEnded = useCallback((): string | void => {
    const current = openStoryRef.current;
    if (!current) return;
    const index = militaryStories.findIndex((story) => story.id === current.id);
    const next = index >= 0 ? militaryStories[index + 1] : undefined;
    setDoneIds((prev) => (prev[current.id] ? prev : { ...prev, [current.id]: true }));
    if (!next) return;
    setOpenStory(next);
    return martyrNarration[next.id]?.audio;
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
          Tap <strong>Play</strong> beside the name in the popup to hear it aloud. When that
          story finishes, it is marked done and the next story opens on its own.
        </p>
        <p className="mt-4">
          <Link href="/interview?tab=stories">Open interview recall practice →</Link>
        </p>
      </section>

      <p className="prep-muted mt-6 mb-4" role="status">
        {militaryStories.length} recipients · {Object.keys(doneIds).length} done · play a story and the next opens when the audio ends
      </p>

      <div className="martyr-grid">
        {militaryStories.map((story) => (
          <article key={story.id} className={`martyr-card${doneIds[story.id] ? ' martyr-card--done' : ''}`} id={story.id}>
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
                <p className="martyr-award-row">
                  <span className="martyr-card-award">{story.award}</span>
                  {doneIds[story.id] ? <span className="gk-badge gk-done-badge">Done</span> : null}
                </p>
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

      {openStory ? (
        <MartyrModal
          story={openStory}
          done={Boolean(doneIds[openStory.id])}
          onClose={closeStory}
          onAudioEnded={onStoryAudioEnded}
        />
      ) : null}
    </>
  );
}
