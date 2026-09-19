'use client';

import { useEffect, useMemo, useState } from 'react';
import SpacedRepetitionDeck from './SpacedRepetitionDeck';
import { currentAffairs, regionPrimer, researchAsOf, researchCaveat } from '../lib/currentAffairs';
import { awardExplanation, militaryStories, type MilitaryStory } from '../lib/militaryStories';
import { sourcePhotos } from '../lib/contentBank';
import { interviewSourcePages } from '../lib/interviewSource';
import { downloadText } from '../lib/practice';

const getStoryId = (story: MilitaryStory) => story.id;
const knowledgeCards = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'knowledge' && !['source-award-table', 'source-rank-comparison'].includes(section.id)).flatMap((section) => section.items.map((item, index) => ({
  id: `${section.id}-${index}`, ...item, language: section.language, title: section.title, sourceImage: photo.fileName, sourcePage: section.sourcePage, notes: photo.issues,
}))));

export function CurrentAffairsStudy() {
  const [region, setRegion] = useState('All');
  const [query, setQuery] = useState('');
  const [stale, setStale] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setStale(Date.now() - Date.parse(`${researchAsOf}T00:00:00Z`) > 7 * 86400000), 0);
    return () => window.clearTimeout(timer);
  }, []);
  const briefs = currentAffairs.filter((brief) => (region === 'All' || brief.region === region) && `${brief.title} ${brief.summary}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <>
    <section className="prep-panel"><h2>Current-affairs briefing</h2><p><strong>Research cutoff: {researchAsOf}.</strong> {currentAffairs.length} briefings and {regionPrimer.length} country primers. This is a dated report, not a live feed.</p><div className="prep-note">{stale ? 'This snapshot is more than a week old. Check fresh reporting before relying on it in an interview.' : 'Conflicts and government positions change quickly. Recheck each briefing’s watch list before an interview.'}</div><details className="prep-details"><summary>How to read the evidence</summary><p>{researchCaveat}</p></details><button type="button" className="prep-button prep-button-secondary" onClick={() => downloadText(`issb-current-affairs-${researchAsOf}.txt`, [researchCaveat, ...currentAffairs.map((brief) => `${brief.title}\nUpdated source date: ${brief.date}\n${brief.summary}\n\nWhy Pakistan: ${brief.whyPakistan}\nInterview: ${brief.question}\n${brief.answerPoints.join('\n')}\nWatch next:\n${brief.watch.join('\n')}\nSources:\n${brief.sources.map((source) => `${source.title} (${source.publishedAt})\n${source.url}`).join('\n')}`)].join('\n\n'))}>Download report</button></section>
    <div className="prep-filters"><label className="prep-field">Region<select value={region} onChange={(event) => setRegion(event.target.value)}>{['All', 'Pakistan', 'Middle East', 'Russia and Ukraine'].map((value) => <option key={value}>{value}</option>)}</select></label><label className="prep-field">Search the briefing<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Iran, energy, civilians..." /></label></div>
    <p className="prep-muted mb-4" role="status">{briefs.length} matching briefings</p>
    {!briefs.length && <div className="prep-panel">No briefing matches. Try a broader search.</div>}
    {briefs.map((brief) => <article className="prep-panel" key={brief.id}><div className="prep-status"><span className="prep-muted">{brief.region}</span><time className="prep-muted" dateTime={brief.date}>Latest cited publication: {brief.date}</time></div><h2>{brief.title}</h2><p>{brief.summary}</p><h3>Why it matters to Pakistan</h3><p>{brief.whyPakistan}</p><details className="prep-details"><summary>Interview question: {brief.question}</summary><ul>{brief.answerPoints.map((point) => <li key={point}>{point}</li>)}</ul><h3>Check before your interview</h3><ul>{brief.watch.map((point) => <li key={point}>{point}</li>)}</ul></details><div className="prep-muted"><strong>Sources</strong><ul>{brief.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a> <time dateTime={source.publishedAt}>({source.publishedAt})</time></li>)}</ul></div></article>)}
    <section className="prep-panel"><h2>Know the region before discussing the news</h2><p>These country notes are background, not claims that every country is involved in a war.</p><div className="prep-grid mt-5">{regionPrimer.map((country) => <details className="prep-details" key={country.country}><summary>{country.country}</summary><p><strong>Capital:</strong> {country.capital}</p><p>{country.whyItMatters}</p><a href={country.source} target="_blank" rel="noopener noreferrer">Background source</a></details>)}</div></section>
  </>;
}

function StoryDetail({ story }: { story: MilitaryStory }) {
  return <><p>{story.story}</p><p className="prep-note"><strong>Remember:</strong> {story.memory}</p><details className="prep-details"><summary>The six details to recall</summary><dl>{[['Name', `${story.rank} ${story.name}`], ['What he did', story.what], ['How he did it', story.how], ['Local benefit', story.result], ['How he died', story.death], ['When he died', story.deathDate]].map(([label, value]) => <div key={label} className="mb-3"><dt className="font-bold">{label}</dt><dd>{value}</dd></div>)}</dl>{story.caution && <p className="prep-muted">{story.caution}</p>}</details><ul className="prep-muted">{story.sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a></li>)}</ul></>;
}

export function MilitaryStoriesStudy() {
  const [mode, setMode] = useState('read');
  const [query, setQuery] = useState('');
  const filtered = militaryStories.filter((story) => `${story.rank} ${story.name} ${story.place} ${story.memory}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  return <>
    <section className="prep-panel"><h2>11 people. Remember the action.</h2><p>{awardExplanation}</p><p className="mt-4">Learn the person, place and action first. Tell the story in your own words, then recall how and when he died. Birth dates and long career timelines are deliberately left out.</p></section>
    <div className="prep-tabs"><button type="button" aria-pressed={mode === 'read'} onClick={() => setMode('read')}>Read stories</button><button type="button" aria-pressed={mode === 'recall'} onClick={() => setMode('recall')}>Practise recall</button></div>
    {mode === 'recall' ? <SpacedRepetitionDeck storageKey="issb-gallantry-stories-v1" items={militaryStories} getId={getStoryId} accentColor="amber" renderFront={(story) => <div><p className="text-sm mb-4">Tell the story: action, method, benefit and sacrifice.</p><p>{story.rank} {story.name}</p></div>} renderBack={(story) => <StoryDetail story={story} />} /> : <><label className="prep-field">Find a person or action<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Sarwar, canal, aircraft..." /></label><p className="prep-muted mb-5" role="status">{filtered.length} of {militaryStories.length} stories</p>{!filtered.length && <p className="prep-panel">No matching story. Try a name or place.</p>}{filtered.map((story) => <article className="prep-panel" key={story.id}><p className="prep-muted mb-2">{story.award} | {story.place}</p><h2>{story.rank} {story.name}</h2><StoryDetail story={story} /></article>)}</>}
  </>;
}

export function KnowledgeStudy() {
  const [language, setLanguage] = useState('en');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(0);
  const [topic, setTopic] = useState('All');
  const topics = [...new Set(knowledgeCards.filter((card) => card.language === language).map((card) => card.title))];
  const cards = useMemo(() => knowledgeCards.filter((card) => card.language === language && (topic === 'All' || card.title === topic) && `${card.prompt} ${card.answer ?? ''}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())), [language, query, topic]);
  const pages = Math.max(1, Math.ceil(cards.length / 20));
  const safePage = Math.min(page, pages - 1);
  return <>
    <section className="prep-panel"><h2>General knowledge from the photos</h2><p>Science, geography, service terms, Pakistan Studies and Urdu religious notes. Reveal each answer after trying to recall it.</p><div className="prep-note">English study cards identify corrections and outdated claims. Urdu religious/history answers are <strong>source transcriptions, not an independently verified answer key</strong>. Some contain errors or reflect a particular interpretation. Read the attached caution before studying a claim; confirm disputed religious details with a reliable reference.</div></section>
    <div className="prep-filters"><label className="prep-field">Collection<select value={language} onChange={(event) => { setLanguage(event.target.value); setTopic('All'); setPage(0); }}><option value="en">English study cards</option><option value="ur">Urdu source notes</option></select></label><label className="prep-field">Topic<select value={topic} onChange={(event) => { setTopic(event.target.value); setPage(0); }}><option>All</option>{topics.map((value) => <option key={value}>{value}</option>)}</select></label><label className="prep-field">Search<input type="search" dir="auto" value={query} onChange={(event) => { setQuery(event.target.value); setPage(0); }} /></label></div>
    <p className="prep-muted mb-5" role="status">{cards.length} cards | page {safePage + 1} of {pages}</p>
    {!cards.length && <p className="prep-panel">No matching questions. Clear the search or change the topic.</p>}
    {cards.slice(safePage * 20, (safePage + 1) * 20).map((card) => <details className="prep-details" key={card.id}><summary lang={card.language} dir={card.language === 'ur' ? 'rtl' : 'ltr'}>{card.prompt}</summary><p className="prep-muted">{card.language === 'ur' ? 'Printed source answer, not independently verified' : 'Study answer'}</p><p lang={card.language} dir={card.language === 'ur' ? 'rtl' : 'ltr'} className="whitespace-pre-line">{card.answer ?? (card.language === 'ur' ? 'اس مد میں الگ جواب درج نہیں ہے۔' : 'This item is a statement in the source; no separate answer is printed.')}</p>{card.detail && <p className="prep-note" dir="auto">{card.detail}</p>}{card.notes.length > 0 && <details className="prep-details"><summary>Page notes and corrections</summary><ul>{card.notes.map((note) => <li key={note} dir="auto">{note}</li>)}</ul></details>}<a className="prep-source-link" href={`/sources#${card.sourceImage}`}>Source page {card.sourcePage}</a></details>)}
    <div className="prep-actions mt-5"><button type="button" className="prep-button prep-button-secondary" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>Previous page</button><button type="button" className="prep-button" disabled={safePage + 1 >= pages} onClick={() => setPage(safePage + 1)}>Next page</button><a href="/study" className="prep-button prep-button-secondary">Spaced memory practice</a></div>
  </>;
}

export function SourceQuestionStudy() {
  const [query, setQuery] = useState('');
  const mathSections = sourcePhotos.flatMap((photo) => photo.sections.filter((section) => section.kind === 'math').map((section) => ({ ...section, fileName: photo.fileName, issues: photo.issues })));
  return <>
    <section className="prep-panel"><h2>Original interview question bank</h2><p>The photographed questions, including Urdu personal prompts, officeholder checklists and arithmetic worksheets. Blank or obsolete source answers are not silently filled with guesses.</p><label className="prep-field mt-5">Search source questions<input type="search" dir="auto" value={query} onChange={(event) => setQuery(event.target.value)} /></label></section>
    {interviewSourcePages.map((page) => { const prompts = page.prompts.filter((prompt) => prompt.toLocaleLowerCase().includes(query.toLocaleLowerCase())); return prompts.length ? <section className="prep-panel" key={page.sourceImage}><h2>Interview notes, page {page.sourcePage}</h2><div className="prep-note">{page.note}</div><ol lang={page.language} dir={page.language === 'ur' ? 'rtl' : 'ltr'}>{prompts.map((prompt, index) => <li key={index}>{prompt}</li>)}</ol><a className="prep-source-link" href={`/sources#${page.sourceImage}`}>Source transcription</a></section> : null; })}
    {mathSections.map((section) => { const items = section.items.filter((item) => item.prompt.toLocaleLowerCase().includes(query.toLocaleLowerCase())); return items.length ? <section className="prep-panel" key={section.id}><h2>{section.title}</h2><p className="prep-muted">Page {section.sourcePage} | {items.length} matching entries</p>{section.issues.length > 0 && <div className="prep-note">{section.issues.join(' ')}</div>}{items.map((item, index) => <details className="prep-details" key={index}><summary lang={section.language} dir={section.language === 'ur' ? 'rtl' : 'ltr'}>{item.prompt}</summary><p dir="auto">{item.answer ?? 'No answer is printed in this source. Work it out using the given facts; do not assume unclear units.'}</p>{item.detail && <p className="prep-muted" dir="auto">{item.detail}</p>}</details>)}<a className="prep-source-link" href={`/sources#${section.fileName}`}>Source transcription</a></section> : null; })}
  </>;
}
