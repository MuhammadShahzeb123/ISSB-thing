'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import SpeakButton from './SpeakButton';
import TitleWithAudio from './TitleWithAudio';
import { regionPrimer } from '../lib/currentAffairs';
import {
  affairsAsOf,
  affairsSections,
  affairsStories,
  formatAffairsDate,
  type AffairsSection,
  type AffairsStory,
} from '../lib/affairsStories';
import { affairsNarration } from '../lib/narrationCatalog';

const DONE_STORAGE_KEY = 'issb-affairs-done-v1';

type Primer = (typeof regionPrimer)[number];

function useModalChrome(onClose: () => void) {
  const closeRef = useRef<HTMLButtonElement>(null);
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
  return closeRef;
}

function StoryModal({
  story,
  done,
  onClose,
  onToggleDone,
  onAudioEnded,
}: {
  story: AffairsStory;
  done: boolean;
  onClose: () => void;
  onToggleDone: (id: string) => void;
  onAudioEnded: () => string | void;
}) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useModalChrome(onClose);
  const narration = affairsNarration[story.id];

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
          <button type="button" className="gk-mark-btn" onClick={() => onToggleDone(story.id)}>
            {done ? 'Mark remaining' : 'Mark done'}
          </button>
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="gk-tile-kicker">
            {affairsSections[story.section].label} · <time dateTime={story.date}>{formatAffairsDate(story.date)}</time>
          </p>
          <TitleWithAudio
            as="h2"
            className="gk-modal-title-row"
            script={narration?.script ?? `${story.title}. ${story.story}`}
            audioSrc={narration?.audio}
            playLabel={`Play the story: ${story.title}`}
            onEnded={onAudioEnded}
          >
            <span id={titleId}>{story.title}</span>
          </TitleWithAudio>
          <div className="martyr-story-body affairs-story-body">
            {story.story.split(/\n\n+/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <h3>Points to remember</h3>
          <ul>
            {story.keyFacts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          <p className="prep-note">
            <strong>Think about it: </strong>
            {story.question}
          </p>
          <h3>Sources</h3>
          <ul className="gk-modal-sources">
            {story.sources.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.title}
                </a>{' '}
                <time dateTime={source.publishedAt}>({formatAffairsDate(source.publishedAt)})</time>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  );
}

function PrimerModal({ country, onClose }: { country: Primer; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useModalChrome(onClose);
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
          <p className="gk-tile-kicker">Country primer</p>
          <h2 id={titleId}>{country.country}</h2>
          <p>
            <strong>Capital: </strong>
            {country.capital}
          </p>
          <p className="gk-modal-summary">{country.whyItMatters}</p>
          <a href={country.source} target="_blank" rel="noopener noreferrer">
            Background source
          </a>
        </article>
      </div>
    </div>
  );
}

type SectionFilter = AffairsSection | 'all';

/** Current-affairs story cards. Each opens a spoken-style story with audio; finished stories open the next one. */
export default function CurrentAffairsBrowser({
  showPrimers = false,
  showDownload = false,
  onDownload,
}: {
  showPrimers?: boolean;
  showDownload?: boolean;
  onDownload?: () => void;
}) {
  const [section, setSection] = useState<SectionFilter>('all');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<AffairsStory | null>(null);
  const [primer, setPrimer] = useState<Primer | null>(null);
  const [doneIds, setDoneIds] = useState<Record<string, true>>({});
  const hydrated = useRef(false);

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
    const hash = window.location.hash.replace(/^#/, '');
    const match = hash ? affairsStories.find((story) => story.id === hash) : undefined;
    // Deep link only; reading location.hash during render would mismatch the server HTML.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hash open
    if (match) setOpen(match);
  }, []);

  const stories = useMemo(() => {
    const needle = query.trim().toLocaleLowerCase();
    return affairsStories.filter(
      (story) =>
        (section === 'all' || story.section === section) &&
        (!needle || `${story.title} ${story.hook} ${story.story} ${story.keyFacts.join(' ')}`.toLocaleLowerCase().includes(needle)),
    );
  }, [section, query]);

  const storiesRef = useRef(stories);
  const openRef = useRef(open);
  useEffect(() => {
    storiesRef.current = stories;
    openRef.current = open;
  }, [stories, open]);

  const toggleDone = (id: string) =>
    setDoneIds((current) => {
      const next = { ...current };
      if (next[id]) delete next[id];
      else next[id] = true;
      return next;
    });

  const closeStory = useCallback(() => setOpen(null), []);
  const closePrimer = useCallback(() => setPrimer(null), []);

  const onStoryEnded = useCallback((): string | void => {
    const current = openRef.current;
    if (!current) return;
    const list = storiesRef.current;
    const index = list.findIndex((story) => story.id === current.id);
    const next = index >= 0 ? list[index + 1] : undefined;
    setDoneIds((previous) => (previous[current.id] ? previous : { ...previous, [current.id]: true }));
    if (!next) return;
    setOpen(next);
    return affairsNarration[next.id]?.audio;
  }, []);

  const doneCount = affairsStories.filter((story) => doneIds[story.id]).length;
  const countFor = (key: SectionFilter) => (key === 'all' ? affairsStories.length : affairsStories.filter((story) => story.section === key).length);

  return (
    <>
      <section className="prep-panel affairs-intro">
        <p className="live-kicker">Updated {formatAffairsDate(affairsAsOf)}</p>
        <h2>Current affairs, told as stories</h2>
        <p>
          {affairsStories.length} stories about Pakistan and the world, written in simple English. Tap a card to read the full
          story, or press <strong>Play</strong> to listen. When a story finishes, it is marked done and the next one opens.
        </p>
        <p className="prep-muted">
          Progress: {doneCount}/{affairsStories.length} done on this device. News changes fast, so check the sources before you
          quote a number.
        </p>
        {showDownload && onDownload ? (
          <button type="button" className="prep-button prep-button-secondary mt-2" onClick={onDownload}>
            Download all stories
          </button>
        ) : null}
      </section>

      <div className="gk-categories" role="group" aria-label="Current affairs sections">
        {(['all', ...(Object.keys(affairsSections) as AffairsSection[])] as SectionFilter[]).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={section === key}
            onClick={() => setSection(key)}
            title={key === 'all' ? undefined : affairsSections[key].description}
          >
            <strong>{key === 'all' ? 'All stories' : affairsSections[key].label}</strong>
            <span>{countFor(key)} stories</span>
          </button>
        ))}
      </div>

      <div className="prep-filters">
        <label className="prep-field">
          Search
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="IMF, Indus, Iran, Kohat, Makkah pact…"
          />
        </label>
      </div>

      <p className="prep-muted mb-4" role="status">
        {stories.length} stories · play one and the next opens when it ends
      </p>
      {!stories.length && <p className="prep-panel">No story matches. Clear the search or pick another section.</p>}

      <div className="gk-tile-grid">
        {stories.map((story) => {
          const done = Boolean(doneIds[story.id]);
          const narration = affairsNarration[story.id];
          return (
            <div key={story.id} id={story.id} className={`gk-tile gk-tile--topic${done ? ' gk-tile--done' : ''}`}>
              <button type="button" className="gk-tile-open" onClick={() => setOpen(story)} aria-haspopup="dialog">
                <span className="gk-tile-meta">
                  <span className="gk-tile-kicker">{affairsSections[story.section].label}</span>
                  <span className="gk-badge gk-badge--source">
                    <time dateTime={story.date}>{formatAffairsDate(story.date)}</time>
                  </span>
                </span>
                <strong className="gk-tile-title">{story.title}</strong>
                <span className="gk-tile-teaser">{story.hook}</span>
                <span className="gk-tile-cta">Read the story →</span>
              </button>
              <div className="gk-tile-toolbar">
                {narration ? (
                  <SpeakButton script={narration.script} audioSrc={narration.audio} label={`Play the story: ${story.title}`} />
                ) : null}
                <button type="button" className="gk-mark-btn" onClick={() => toggleDone(story.id)}>
                  {done ? 'Mark remaining' : 'Mark done'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showPrimers && (
        <section className="prep-panel mt-10" aria-labelledby="primers">
          <h2 id="primers">Country primers</h2>
          <p>Background geography only: a capital and why the country matters to Pakistan.</p>
          <div className="gk-tile-grid mt-5">
            {regionPrimer.map((country) => (
              <button key={country.country} type="button" className="gk-tile gk-tile--qa" onClick={() => setPrimer(country)}>
                <span className="gk-tile-meta">
                  <span className="gk-badge gk-badge--source">Primer</span>
                </span>
                <strong className="gk-tile-title">{country.country}</strong>
                <span className="gk-tile-teaser">Capital: {country.capital}</span>
                <span className="gk-tile-cta">Open primer →</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {open ? (
        <StoryModal story={open} done={Boolean(doneIds[open.id])} onClose={closeStory} onToggleDone={toggleDone} onAudioEnded={onStoryEnded} />
      ) : null}
      {primer ? <PrimerModal country={primer} onClose={closePrimer} /> : null}
    </>
  );
}
