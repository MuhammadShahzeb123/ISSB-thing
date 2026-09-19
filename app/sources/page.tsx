'use client';

import { useEffect, useState } from 'react';
import DimensionNav from '../components/DimensionNav';
import { sourcePhotos, sourceItemCount } from '../lib/contentBank';

const kinds = [...new Set(sourcePhotos.flatMap((photo) => photo.sections.map((section) => section.kind)))];
const searchablePhotos = sourcePhotos.map((photo) => ({ photo, text: JSON.stringify(photo).toLocaleLowerCase() }));

export default function SourcesPage() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');
  const visible = searchablePhotos.filter(({ photo, text }) => (kind === 'all' || photo.sections.some((section) => section.kind === kind)) && text.includes(query.trim().toLocaleLowerCase())).map(({ photo }) => photo);

  useEffect(() => {
    const openSource = () => {
      const id = window.location.hash.slice(1);
      const element = document.getElementById(id);
      if (element instanceof HTMLDetailsElement) element.open = true;
    };
    openSource();
    window.addEventListener('hashchange', openSource);
    return () => window.removeEventListener('hashchange', openSource);
  }, []);

  return (
    <div className="neo-page prep-page"><div className="prep-shell">
      <DimensionNav active="sources" />
      <header className="prep-header"><h1>Every photo, accounted for.</h1><p>A text-only index of the supplied study material. Open a source to see its extracted prompts, form fields and study answers.</p></header>
      <div className="prep-counts"><div><strong>{sourcePhotos.length} / 52</strong><span>photos reviewed</span></div><div><strong>{sourceItemCount}</strong><span>extracted items, including repeats</span></div><div><strong>0</strong><span>source photos displayed</span></div></div>
      <div className="prep-note">The notes are academy material, not an official test syllabus. English sentence stems and Urdu prompts retain their source wording where readable. Some Urdu general-knowledge pages are translated into English study cards. Clear factual errors are corrected and old statistics are labelled. Notes identify obscured text and differences between source versions. Repeated pages and prompts remain traceable; counts are not counts of unique questions.</div>
      <div className="prep-filters"><label className="prep-field">Search extracted text or filename<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Urdu text, percentage, biodata..." /></label><label className="prep-field">Material type<select value={kind} onChange={(event) => setKind(event.target.value)}><option value="all">All material</option>{kinds.map((value) => <option key={value} value={value}>{value.replace(/-/g, ' ')}</option>)}</select></label></div>
      <p className="prep-muted" role="status">{visible.length} sources match. All source identifiers below refer to local filenames, not image embeds.</p>
      {!visible.length && <div className="prep-panel"><h2>No matching text</h2><p>Try a shorter word, a different spelling or all material types.</p></div>}
      {visible.map((photo) => <details className="prep-details" key={photo.fileName} id={photo.fileName}>
        <summary>{photo.fileName} <span className="prep-muted">| {photo.sections.reduce((sum, section) => sum + section.items.length, 0)} items | {photo.issues.length ? 'Reviewed with notes' : 'Transcribed'}</span></summary>
        {photo.issues.length > 0 && <div className="prep-note"><strong>Source notes and corrections</strong><ul>{photo.issues.map((issue, index) => <li key={index}>{issue}</li>)}</ul></div>}
        {photo.sections.map((section) => <article key={section.id}>
          <h2 className="text-xl font-bold">{section.title}</h2><p className="prep-muted">{section.kind.replace(/-/g, ' ')} | page {section.sourcePage || 'not numbered'} | {section.language === 'ur' ? 'Urdu' : 'English'}{section.seconds ? ` | source timing: ${section.seconds / 60} minutes` : ''}</p>
          <ol lang={section.language} dir={section.language === 'ur' ? 'rtl' : 'ltr'}>{section.items.map((item, index) => <li key={`${section.id}-${index}`}><p>{item.prompt}</p>{item.answer && <p><strong>{section.language === 'ur' ? 'جواب: ' : 'Answer: '}</strong>{item.answer}</p>}{item.detail && <p className="prep-muted" dir="auto">{item.detail}</p>}</li>)}</ol>
        </article>)}
      </details>)}
    </div></div>
  );
}
