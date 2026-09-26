'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import type { LibraryCollection, LibrarySet } from '../../lib/library';
import { useLibraryProgress } from '../../lib/libraryProgress';
import { PlanningRunner, QuestionRunner, StoryRunner, TopicRunner } from './PromptRunners';
import { FlashcardRunner, ReferenceView } from './StudyRunners';
import { SentenceRunner, WatRunner, type RunnerProps } from './WritingRunners';

const runners: Record<LibrarySet['mode'], (props: RunnerProps) => React.ReactNode> = {
  sentence: SentenceRunner,
  wat: WatRunner,
  story: StoryRunner,
  topic: TopicRunner,
  planning: PlanningRunner,
  flashcards: FlashcardRunner,
  questions: QuestionRunner,
  reference: ReferenceView,
};

export default function SetRunner({ set, collection, modeLabel, itemsLabel, next, previous }: {
  set: LibrarySet;
  collection: LibraryCollection;
  modeLabel: string;
  itemsLabel: string;
  next?: { href: string; title: string };
  previous?: { href: string; title: string };
}) {
  const pKey = `${collection.slug}/${set.id}`;
  const { update } = useLibraryProgress();
  const Runner = runners[set.mode];
  const urduTitle = /[؀-ۿ]/.test(set.title);

  // Opening a set counts as a visit, so the library can offer "continue where you left off".
  useEffect(() => { update(pKey, set.items.length, () => ({})); }, [pKey, set.items.length, update]);

  return (
    <div className={`neo-page prep-page lib-accent-${collection.accent}`}><div className="prep-shell">
      <nav className="lib-crumbs" aria-label="Breadcrumb">
        <Link href="/library">Practice library</Link><span aria-hidden>/</span>
        <Link href={`/library/${collection.slug}`}>{collection.short}</Link><span aria-hidden>/</span>
        <span lang={urduTitle ? 'ur' : undefined}>{set.title}</span>
      </nav>
      <header style={{ margin: '1rem 0 1.25rem' }}>
        <h1 lang={urduTitle ? 'ur' : undefined} dir={urduTitle ? 'rtl' : undefined} style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3rem)', lineHeight: urduTitle ? 1.9 : 1.1 }}>{set.title}</h1>
        {set.subtitle && <p className="prep-muted" lang={/[؀-ۿ]/.test(set.subtitle) ? 'ur' : undefined}>{set.subtitle}</p>}
        <div className="lib-meta" style={{ marginTop: '0.6rem' }}>
          <span className="lib-chip lib-chip--accent">{modeLabel}</span>
          <span className="lib-chip">{itemsLabel}</span>
          <span className="lib-chip">{set.language === 'ur' ? 'Urdu' : 'English'}</span>
        </div>
      </header>

      <Runner key={pKey} set={set} pKey={pKey} next={next} />

      <nav className="prep-actions" aria-label="Other sets" style={{ justifyContent: 'space-between', marginTop: '1.5rem' }}>
        {previous ? <Link href={previous.href} className="prep-button prep-button-secondary">← {previous.title}</Link> : <span />}
        {next && <Link href={next.href} className="prep-button prep-button-secondary">{next.title} →</Link>}
      </nav>

      <details className="lib-source">
        <summary>Where this comes from</summary>
        <p>Photo{set.sourceImage.includes(',') ? 's' : ''}: {set.sourceImage}. Printed page{set.sourcePage.includes(',') || set.sourcePage.includes(';') ? 's' : ''}: {set.sourcePage}.</p>
        {set.notes.length > 0 && <><p><strong>Notes and corrections from transcription</strong></p><ul>{set.notes.map((note, i) => <li key={i} dir="auto">{note}</li>)}</ul></>}
        <p>Full transcription by photo: <Link href={`/sources#${set.sourceImage.split(',')[0].trim()}`} className="prep-source-link">source coverage</Link>.</p>
      </details>
    </div></div>
  );
}
