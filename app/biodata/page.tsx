'use client';

import { useState } from 'react';
import DimensionNav from '../components/DimensionNav';
import PracticeTimer from '../components/PracticeTimer';
import { biodataSections } from '../lib/biodata';
import { lifeEventPrompts } from '../picturestest/pictureSourceData';
import { downloadText } from '../lib/practice';

const storageKey = 'issb-biodata-draft-v1';
const sectionOrder = ['identity', 'appearances', 'education', 'social', 'sports', 'background', 'health', 'siblings', 'unemployment', 'employment', 'service', 'appointments', 'courses', 'reflection', 'personal-summary', 'summary-education', 'summary-appearances', 'travel', 'relations'];
const sections = [...biodataSections].sort((a, b) => sectionOrder.indexOf(a.id) - sectionOrder.indexOf(b.id));
const fieldKeys = new Set(sections.flatMap((section) => section.fields?.map((_, index) => `${section.id}-${index}`) ?? (section.rows ?? []).flatMap((_, row) => (section.columns ?? []).map((_, col) => `${section.id}-${row}-${col}`))).concat(lifeEventPrompts.map((_, index) => `life-${index}`)));

export default function BiodataPage() {
  const [tab, setTab] = useState('form');
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');
  const [eventIndex, setEventIndex] = useState(0);
  const filled = Object.values(values).filter((value) => value.trim()).length;
  const visibleSections = sections.filter((section) => tab === 'family' ? section.id === 'relations' : tab === 'questionnaire' ? section.id.startsWith('summary-') || section.id === 'personal-summary' || section.id === 'travel' : !section.id.startsWith('summary-') && !['personal-summary', 'travel', 'relations'].includes(section.id));

  const update = (key: string, value: string) => { setValues((previous) => ({ ...previous, [key]: value })); setStatus('Unsaved changes in this tab.'); };
  function save() {
    try { localStorage.setItem(storageKey, JSON.stringify(values)); setStatus('Draft saved on this device. Anyone using this browser profile can access it.'); }
    catch { setStatus('This browser could not save the draft. You can download your notes instead.'); }
  }
  function load() {
    try {
      const text = localStorage.getItem(storageKey);
      if (!text) { setStatus('No saved draft was found on this device.'); return; }
      const parsed: unknown = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid draft');
      if (filled && !window.confirm('Replace the notes currently in this tab with your saved draft?')) return;
      setValues(Object.fromEntries(Object.entries(parsed).filter(([key, value]) => fieldKeys.has(key) && typeof value === 'string').map(([key, value]) => [key, (value as string).slice(0, 6000)])));
      setStatus('Saved draft loaded.');
    } catch { setStatus('The saved draft could not be read. Your current notes have not been changed.'); }
  }
  function exportDraft() {
    const text = sections.map((section) => [section.title,
      ...(section.fields?.map((label, index) => `${label}: ${values[`${section.id}-${index}`] ?? ''}`) ?? (section.rows ?? []).map((rowLabel, row) => `${rowLabel}: ${(section.columns ?? []).map((colLabel, col) => `${colLabel}: ${values[`${section.id}-${row}-${col}`] ?? ''}`).join(' | ')}`)),
    ].join('\n')).join('\n\n');
    downloadText('issb-biodata-practice.txt', `${text}\n\nLife-event reflections\n${lifeEventPrompts.map((prompt, index) => `${prompt}\n${values[`life-${index}`] ?? ''}`).join('\n\n')}`);
  }

  return (
    <div className="neo-page neo-page--psych prep-page"><div className="prep-shell">
      <DimensionNav active="psychological" />
      <header className="prep-header"><h1>Biodata and self-reflection</h1><p>Practise the seven photographed form pages with your own truthful, consistent answers. This is not an official ISSB submission.</p></header>
      <div className="prep-note"><strong>Use practice details.</strong> The site includes third-party analytics. Do not enter real identity numbers, exact addresses, contact details or private medical information. This form has no submission endpoint and does not autosave. Saving is optional and unencrypted on this device.</div>
      <div className="prep-tabs prep-no-print" aria-label="Biodata sections">{[['form', 'Biodata form'], ['questionnaire', 'Questionnaire A / B'], ['family', 'Service relatives'], ['reflections', 'Life events']].map(([id, label]) => <button type="button" key={id} aria-pressed={tab === id} onClick={() => setTab(id)}>{label}</button>)}</div>
      <div className="prep-panel prep-no-print"><div className="prep-status"><p>{filled} fields filled in this tab</p><span className="prep-muted">Only save on a device you trust.</span></div><div className="prep-actions"><button className="prep-button" type="button" onClick={save}>Save on device</button><button className="prep-button prep-button-secondary" type="button" onClick={load}>Load saved draft</button><button className="prep-button prep-button-secondary" type="button" onClick={exportDraft}>Download notes</button><button className="prep-button prep-button-secondary" type="button" onClick={() => window.print()}>Print this section</button><button className="prep-button prep-button-secondary" type="button" onClick={() => {
        if (!window.confirm('Clear this tab and delete the saved biodata draft from this device?')) return;
        setValues({});
        try { localStorage.removeItem(storageKey); setStatus('This tab and its saved draft are cleared.'); } catch { setStatus('The tab is cleared, but browser storage could not be accessed. The saved copy may still exist.'); }
      }}>Clear draft</button></div><p className="prep-muted mt-4" role="status">{status}</p></div>
      {tab === 'reflections' ? <section className="prep-panel"><h2>Recall a real experience</h2><p>{lifeEventPrompts.length} prompts from page 22. Explain what happened, what you did, the outcome and what you learned. You do not need to invent an impressive event.</p><label className="prep-field mt-5">Life-event prompt<select value={eventIndex} onChange={(event) => setEventIndex(Number(event.target.value))}>{lifeEventPrompts.map((prompt, index) => <option key={prompt} value={index}>{index + 1}. {prompt}</option>)}</select></label><PracticeTimer key={eventIndex} seconds={180} label="Optional 3-minute reflection" /><label className="prep-field">{lifeEventPrompts[eventIndex]}<textarea dir="auto" maxLength={6000} value={values[`life-${eventIndex}`] ?? ''} onChange={(event) => update(`life-${eventIndex}`, event.target.value)} /></label><a className="prep-source-link" href="/sources#IMG20260919120035.jpg">Source: page 22</a></section> : visibleSections.map((section, index) => (
        <details className="prep-details" key={section.id} open={index === 0}>
          <summary>{section.title}</summary><p className="prep-muted mb-4">Source page {section.sourcePage}. Leave anything that does not apply blank.</p>
          {section.fields ? <div className="prep-grid">{section.fields.map((label, fieldIndex) => { const key = `${section.id}-${fieldIndex}`; return <label className="prep-field" key={key} htmlFor={key}>{label}<input id={key} type="text" autoComplete="off" dir="auto" maxLength={6000} value={values[key] ?? ''} onChange={(event) => update(key, event.target.value)} /></label>; })}</div> : <div className="prep-table-wrap" tabIndex={0} role="region" aria-label={`${section.title} table, scroll horizontally on small screens`}><table className="prep-table"><thead><tr><th scope="col">Entry</th>{section.columns?.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead><tbody>{section.rows?.map((rowLabel, row) => <tr key={rowLabel}><th scope="row">{rowLabel}</th>{section.columns?.map((column, col) => { const key = `${section.id}-${row}-${col}`; return <td key={key}><textarea id={key} aria-label={`${section.title}, ${rowLabel}, ${column}`} dir="auto" autoComplete="off" maxLength={6000} value={values[key] ?? ''} onChange={(event) => update(key, event.target.value)} /></td>; })}</tr>)}</tbody></table></div>}
          <a className="prep-source-link" href={`/sources#${section.sourceImage}`}>View the transcribed source</a>
        </details>
      ))}
    </div></div>
  );
}
