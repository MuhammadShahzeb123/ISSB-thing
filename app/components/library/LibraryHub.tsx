'use client';

import Link from 'next/link';
import { useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { collections, collectionStats, getCollection, librarySets, libraryItemCount, type LibraryCollection } from '../../lib/library';
import { completion, useLibraryProgress, type ProgressMap } from '../../lib/libraryProgress';
import { RollingNumber } from '../motion/RollingNumber';
import { Swap } from '../motion/Swap';
import { stagger } from '../motion/stagger';
import { Highlight, ProgressBar, isTyping } from './shared';

const searchIndex = librarySets.flatMap((set) => set.items.map((item, index) => ({
  set, index, item,
  text: `${item.prompt} ${item.answer ?? ''} ${item.group ?? ''}`.toLocaleLowerCase(),
})));

const MAX_RESULTS = 40;

function collectionProgress(slug: LibraryCollection['slug'], progress: ProgressMap) {
  const sets = librarySets.filter((set) => set.collection === slug);
  const total = sets.reduce((sum, set) => sum + set.items.length, 0);
  const done = sets.reduce((sum, set) => sum + completion(progress[`${slug}/${set.id}`], set.items.length) * set.items.length, 0);
  return total ? done / total : 0;
}

function CollectionCard({ collection, progress, index }: { collection: LibraryCollection; progress: ProgressMap; index: number }) {
  const stats = collectionStats(collection.slug);
  const value = collectionProgress(collection.slug, progress);
  return (
    <Link href={`/library/${collection.slug}`} className={`lib-card lib-accent-${collection.accent}`} style={stagger(index)}>
      <div className="lib-card-top">
        <span className="lib-mark" aria-hidden>{collection.mark}</span>
        {value > 0 && <span className={`lib-chip${value >= 1 ? ' lib-chip--done' : ''}`}>{value >= 1 ? 'Complete' : `${Math.round(value * 100)}% done`}</span>}
      </div>
      <h3>{collection.title}</h3>
      <p>{collection.blurb}</p>
      <div className="lib-meta">
        <span className="lib-chip lib-chip--accent">{stats.sets} {stats.sets === 1 ? 'set' : 'sets'}</span>
        <span className="lib-chip">{stats.items} items</span>
      </div>
      <ProgressBar value={value} label={`${collection.title} progress`} />
    </Link>
  );
}

export default function LibraryHub() {
  const { progress, loaded } = useLibraryProgress();
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === '/' && !isTyping(event)) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const results = useMemo(() => {
    const needle = deferred.trim().toLocaleLowerCase();
    if (needle.length < 2) return null;
    const matches = searchIndex.filter((entry) => entry.text.includes(needle) || entry.set.title.toLocaleLowerCase().includes(needle));
    return { total: matches.length, sets: new Set(matches.map((entry) => entry.set)).size, shown: matches.slice(0, MAX_RESULTS) };
  }, [deferred]);

  const last = useMemo(() => {
    // Prefer a set the learner actually started and has not finished; fall back to the last one opened.
    const started = (entry: ProgressMap[string]) => entry.done.length > 0 && new Set(entry.done).size < entry.total;
    const entries = Object.entries(progress).sort((a, b) => Number(started(b[1])) - Number(started(a[1])) || b[1].visitedAt - a[1].visitedAt);
    for (const [key, entry] of entries) {
      const [slug, id] = key.split('/');
      const set = id === 'all' ? { id, title: `All ${getCollection(slug)?.short ?? ''} cards`, items: { length: entry.total } } : librarySets.find((item) => item.collection === slug && item.id === id);
      const collection = getCollection(slug);
      if (set && collection) return { href: `/library/${slug}/${id}`, title: set.title, collection, value: completion(entry, set.items.length), entry };
    }
    return null;
  }, [progress]);

  const practice = collections.filter((collection) => collection.group === 'practice');
  const study = collections.filter((collection) => collection.group === 'study');

  return (
    <div className="neo-page prep-page"><div className="prep-shell">
      <section className="lib-hero" aria-labelledby="library-title">
        <div>
          <p className="lib-kicker">All 52 study photos, sorted</p>
          <h1 id="library-title">Practice library</h1>
          <p>Every test and note from the photographed study book, sorted by what you want to do. Pick a timed test to practise, or a subject to revise. Your progress is saved in this browser.</p>
        </div>
        <div>
          <label htmlFor="library-search" className="lib-kicker" style={{ display: 'block', marginBottom: '0.5rem' }}>Search {libraryItemCount.toLocaleString()} items</label>
          <div className="lib-search">
            <input ref={input} id="library-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try: Newton, NATO, K-2, غزوہ بدر, courage…" autoComplete="off" />
            {!query && <kbd aria-hidden>/</kbd>}
          </div>
        </div>
      </section>

      {/* Typing swaps the whole hub for results inside one morphing container, and back again when the search clears. */}
      <Swap id={results ? 'results' : 'home'}>
      {results ? (
        <section aria-labelledby="search-results">
          <div className="lib-section-head">
            <h2 id="search-results">Search results</h2>
            <p role="status">{results.total ? <><RollingNumber value={String(results.total)} /> matches in {results.sets} {results.sets === 1 ? 'set' : 'sets'}{results.total > MAX_RESULTS ? `, showing the first ${MAX_RESULTS}` : ''}</> : 'No matches'}</p>
          </div>
          {results.total === 0 && <div className="lib-empty">Nothing matches “{deferred}”. Try a shorter word or a different spelling.</div>}
          <div className="lib-results stagger">
            {results.shown.map(({ set, index, item }, position) => {
              const collection = getCollection(set.collection)!;
              return (
                <article key={`${set.collection}-${set.id}-${index}`} className={`lib-result lib-accent-${collection.accent}`} style={stagger(position)}>
                  <div>
                    <p lang={set.language} dir={set.language === 'ur' ? 'rtl' : undefined}><strong><Highlight text={item.prompt} query={deferred} /></strong></p>
                    {item.answer && <p className="lib-result-answer" lang={set.language} dir={set.language === 'ur' ? 'rtl' : undefined}><Highlight text={item.answer} query={deferred} /></p>}
                    <div className="lib-meta"><span className="lib-chip lib-chip--accent">{collection.short}</span><span className="lib-chip">{set.title}</span></div>
                  </div>
                  <Link href={`/library/${set.collection}/${set.id}`}>Open set →</Link>
                </article>
              );
            })}
          </div>
        </section>
      ) : (
        <>
          {loaded && last && (
            <Link href={last.href} className={`lib-continue lib-accent-${last.collection.accent}`}>
              <span><span className="lib-kicker" style={{ color: 'inherit' }}>Continue where you left off</span><br /><strong>{last.title}</strong> · {last.collection.short}</span>
              <span style={{ minWidth: '10rem' }}>
                <ProgressBar value={last.value} label="Progress in this set" />
                <span className="lib-bar-label"><span>{Math.round(last.value * 100)}% done</span><span>Resume →</span></span>
              </span>
            </Link>
          )}

          <section aria-labelledby="practice-heading">
            <div className="lib-section-head">
              <h2 id="practice-heading">Take a timed test</h2>
              <p>Real timings from the ISSB schedule. Instant review at the end.</p>
            </div>
            <div className="lib-grid stagger">{practice.map((collection, index) => <CollectionCard key={collection.slug} collection={collection} progress={progress} index={index} />)}</div>
          </section>

          <section aria-labelledby="study-heading">
            <div className="lib-section-head">
              <h2 id="study-heading">Study & revise</h2>
              <p>Flashcards that remember what you missed, plus quick-read lists.</p>
            </div>
            <div className="lib-grid stagger">{study.map((collection, index) => <CollectionCard key={collection.slug} collection={collection} progress={progress} index={index + 2} />)}</div>
          </section>

          <p className="lib-source">Everything here is transcribed from the photographed Noor Forces Academies study notes. It is academy material, not an official syllabus. Clear factual errors are corrected and old figures are labelled, with the correction shown under the answer. For each photo&apos;s full transcription, see <Link href="/sources" className="prep-source-link">source coverage</Link>.</p>
        </>
      )}
      </Swap>
    </div></div>
  );
}
