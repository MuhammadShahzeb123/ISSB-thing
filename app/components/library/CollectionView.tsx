'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { LibraryCollection, LibraryMode } from '../../lib/library';
import { completion, progressKey, useLibraryProgress } from '../../lib/libraryProgress';
import { Swap } from '../motion/Swap';
import { stagger } from '../motion/stagger';
import { ProgressBar } from './shared';

export interface SetSummary {
  id: string;
  title: string;
  subtitle?: string;
  mode: LibraryMode;
  modeLabel: string;
  itemsLabel: string;
  count: number;
  language: 'en' | 'ur';
  featured?: boolean;
}

export default function CollectionView({ collection, sets }: { collection: LibraryCollection; sets: SetSummary[] }) {
  const { progress } = useLibraryProgress();
  const [filter, setFilter] = useState('');
  const visible = useMemo(() => {
    const needle = filter.trim().toLocaleLowerCase();
    return needle ? sets.filter((set) => `${set.title} ${set.subtitle ?? ''}`.toLocaleLowerCase().includes(needle)) : sets;
  }, [filter, sets]);

  const regular = sets.filter((set) => !set.featured);
  const doneCount = regular.filter((set) => completion(progress[progressKey(collection.slug, set.id)], set.count) >= 1).length;
  const nextUp = regular.find((set) => completion(progress[progressKey(collection.slug, set.id)], set.count) < 1);

  return (
    <div className={`neo-page prep-page lib-accent-${collection.accent}`}><div className="prep-shell">
      <nav className="lib-crumbs" aria-label="Breadcrumb"><Link href="/library">Practice library</Link><span aria-hidden>/</span><span>{collection.short}</span></nav>
      <header className="lib-hero">
        <div>
          <p className="lib-kicker">{collection.group === 'practice' ? 'Timed test' : 'Study & revise'}</p>
          <h1>{collection.title}</h1>
          <p>{collection.blurb}</p>
        </div>
        <div className="lib-score" aria-label="Your progress">
          <div><strong>{doneCount}/{regular.length}</strong><span>sets finished</span></div>
          <div><strong>{regular.reduce((sum, set) => sum + set.count, 0)}</strong><span>items in total</span></div>
        </div>
      </header>

      <div className="lib-howto"><strong>How it works</strong><span lang={collection.slug === 'islamiat' || collection.slug === 'sentence-urdu' ? 'ur' : undefined}>{collection.howTo}</span></div>

      {nextUp && (
        <Link href={`/library/${collection.slug}/${nextUp.id}`} className="lib-continue">
          <span><span className="lib-kicker" style={{ color: 'inherit' }}>{doneCount ? 'Up next' : 'Start here'}</span><br /><strong lang={nextUp.language}>{nextUp.title}</strong> · {nextUp.itemsLabel}</span>
          <span className="lib-set-go">Start →</span>
        </Link>
      )}

      {sets.length > 8 && (
        <div className="prep-field" style={{ maxWidth: '28rem' }}>
          <label htmlFor="set-filter">Filter sets</label>
          <input id="set-filter" type="search" value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Type part of a title…" />
        </div>
      )}

      {/* Keyed on the visible ids: the list swaps only when the filter actually changes what is shown, not on every keystroke. */}
      <Swap id={visible.map((set) => set.id).join('|')}>
      <div className="lib-set-list stagger">
        {visible.map((set, index) => {
          const entry = progress[progressKey(collection.slug, set.id)];
          const value = completion(entry, set.count);
          return (
            <Link key={set.id} href={`/library/${collection.slug}/${set.id}`} className={`lib-set${set.featured ? ' lib-set--featured' : ''}`} style={stagger(index)}>
              <span className={`lib-set-num${value >= 1 ? ' is-done' : ''}`} aria-hidden>{value >= 1 ? '✓' : set.featured ? '★' : index + (sets[0]?.featured ? 0 : 1)}</span>
              <div style={{ minWidth: 0 }}>
                <h3 lang={set.language} dir={set.language === 'ur' && /[؀-ۿ]/.test(set.title) ? 'rtl' : undefined}>{set.title}</h3>
                {set.subtitle && <p className="prep-muted" lang={/[؀-ۿ]/.test(set.subtitle) ? 'ur' : undefined}>{set.subtitle}</p>}
                <div className="lib-meta">
                  <span className="lib-chip lib-chip--accent">{set.modeLabel}</span>
                  <span className="lib-chip">{set.itemsLabel}</span>
                  {entry?.lastResult && <span className="lib-chip lib-chip--done">Last: {entry.lastResult}</span>}
                </div>
                {value > 0 && <ProgressBar value={value} label={`${set.title} progress`} />}
              </div>
              <span className="lib-set-go">{value >= 1 ? 'Again' : value > 0 ? 'Resume' : 'Start'} →</span>
            </Link>
          );
        })}
        {!visible.length && <div className="lib-empty">No set title matches “{filter}”.</div>}
      </div>
      </Swap>
    </div></div>
  );
}
