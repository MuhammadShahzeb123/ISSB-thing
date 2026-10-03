'use client';

import { useState } from 'react';
import { useTabParam } from '../../lib/useTabParam';
import DimensionNav from '../../components/DimensionNav';
import PracticeTimer from '../../components/PracticeTimer';
import { allTopics } from '../../lib/contentBank';
import { downloadText } from '../../lib/practice';
import GroupPlanning from './GroupPlanning';
import TitleWithAudio from '../../components/TitleWithAudio';
import { gtoNarration } from '../../lib/narrationCatalog';

const TABS = ['lecture', 'discussion', 'planning'] as const;

export default function IndoorGto() {
  const [tab, setTab] = useTabParam(TABS, 'lecture');
  const [language, setLanguage] = useState<'en' | 'ur'>('en');
  const [query, setQuery] = useState('');
  const [topicId, setTopicId] = useState('');
  const [phase, setPhase] = useState('prepare');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const topics = allTopics.filter((topic) => topic.language === language && topic.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
  const selected = topics.find((topic) => topic.id === topicId) ?? topics[0];

  return (
    <div className="neo-page neo-page--leadership prep-page"><div className="prep-shell">
      <DimensionNav active="gto" />
      <header className="prep-header"><TitleWithAudio as="h1" script={gtoNarration['indoor-overview']?.script} audioSrc={gtoNarration['indoor-overview']?.audio} playLabel="Play indoor GTO overview">Think clearly. Work as a group.</TitleWithAudio><p>Indoor GTO practice: give a short lecture, discuss a topic and explain a workable group plan.</p></header>
      <div className="prep-note">Outdoor obstacles have their own animated walkthroughs: <a href="/gto/outdoor">open outdoor obstacles</a>. The photographed timetable is academy guidance, not a guaranteed ISSB schedule. The official board says activities can change. <a href="https://issb.gov.pk/selection-system" target="_blank" rel="noreferrer">Read the official selection system.</a></div>
      <div className="prep-tabs" aria-label="Indoor GTO activities">{[['lecture', 'Lecture practice'], ['discussion', 'Group discussion'], ['planning', 'Group planning']].map(([id, label]) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => { setTab(id as (typeof TABS)[number]); setPhase('prepare'); }}>{label}</button>)}</div>
      {tab !== 'planning' ? <>
        <div className="prep-filters"><label className="prep-field">Topic language<select value={language} onChange={(event) => { setLanguage(event.target.value as 'en' | 'ur'); setTopicId(''); setPhase('prepare'); }}><option value="en">English</option><option value="ur">اردو</option></select></label><label className="prep-field">Search topics<input type="search" value={query} dir="auto" onChange={(event) => { setQuery(event.target.value); setTopicId(''); setPhase('prepare'); }} placeholder="Education, Pakistan, تعلیم..." /></label></div>
        <p className="prep-muted mb-5">{topics.length} matching topic entries. The photos label these as discussion topics; the same motions are also available here for a short lecture.</p>
        {selected ? <div className="prep-split"><section className="prep-panel">
          <label className="prep-field">Choose a topic<select value={selected.id} dir={language === 'ur' ? 'rtl' : 'ltr'} lang={language} onChange={(event) => { setTopicId(event.target.value); setPhase('prepare'); }}>{topics.map((topic) => <option key={topic.id} value={topic.id}>{topic.title}</option>)}</select></label>
          <div className="prep-ask-block"><p className="prep-ask-label">{tab === 'lecture' ? 'Lecture topic' : 'Discussion motion'}</p><h2 className="prep-ask" lang={selected.language} dir={selected.language === 'ur' ? 'rtl' : 'ltr'}>{selected.title}</h2></div>
          <a className="prep-source-link" href={`/sources#${selected.sourceImage}`}>Source page {selected.sourcePage}</a>
          <div className="prep-note">A debate motion is not an established fact or this site’s view. You may challenge its premise. Support your own position with reasons and a concrete example.</div>
          <PracticeTimer key={`${tab}-${selected.id}-${phase}`} seconds={tab === 'discussion' ? 900 : 120} label={tab === 'discussion' ? 'Optional 15-minute discussion' : phase === 'prepare' ? '2-minute preparation practice' : '2-minute lecture, as in the source schedule'} />
          {tab === 'lecture' && <div className="prep-actions mb-5"><button type="button" className="prep-button" onClick={() => setPhase(phase === 'prepare' ? 'speak' : 'prepare')}>{phase === 'prepare' ? 'Move to speaking' : 'Prepare again'}</button><span className="prep-muted">Start the timer when ready.</span></div>}
          <label className="prep-field">Your {tab === 'lecture' ? 'speech outline' : 'discussion notes'}<textarea lang={language} dir={language === 'ur' ? 'rtl' : 'ltr'} value={notes[`${tab}-${selected.id}`] ?? ''} onChange={(event) => setNotes((previous) => ({ ...previous, [`${tab}-${selected.id}`]: event.target.value }))} placeholder={language === 'ur' ? 'اپنی رائے، دلیل، مثال اور نتیجہ لکھیں۔' : 'Position, reason, example, a fair objection, conclusion.'} /></label>
          <button type="button" className="prep-button prep-button-secondary" onClick={() => downloadText(`gto-${tab}.txt`, `${selected.title}\n\n${notes[`${tab}-${selected.id}`] ?? ''}`)}>Download outline</button>
        </section><aside className="prep-panel"><h2>{tab === 'lecture' ? 'Make one clear argument' : 'Build the discussion'}</h2>{tab === 'lecture' ? <ol><li>State your view in one sentence.</li><li>Give two reasons you can explain.</li><li>Use a real example, not an invented statistic.</li><li>Acknowledge a fair opposing point.</li><li>End with a practical recommendation.</li></ol> : <ol><li>Listen before adding a point.</li><li>Give a short reason rather than repeating a slogan.</li><li>Disagree with the argument, not the person.</li><li>Invite a quieter member to contribute.</li><li>Summarise agreement and unresolved points.</li></ol>}<h3>Self-review</h3><div className="prep-checklist" key={`${tab}-${selected.id}`}>{['I answered the actual topic.', 'My example supported my point.', 'I separated facts from opinions.', 'I stayed within the time.', 'I spoke clearly without rushing.'].map((line) => <label key={line}><input type="checkbox" />{line}</label>)}</div><p className="prep-muted">This is a reflection checklist, not an ISSB mark or recommendation prediction. Notes are kept only while this page remains open unless downloaded.</p></aside></div> : <div className="prep-panel"><h2>No matching topics</h2><p>Clear the search or choose another language.</p></div>}
      </> : <GroupPlanning />}
    </div></div>
  );
}
