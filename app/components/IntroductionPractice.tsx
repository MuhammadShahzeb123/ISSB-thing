'use client';

import { useState } from 'react';
import Link from 'next/link';
import PracticeTimer from './PracticeTimer';
import { introductionOutline, personalInterviewPrompts } from '../lib/interviewPractice';
import { downloadText } from '../lib/practice';

export default function IntroductionPractice() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const current = personalInterviewPrompts[index];
  return (
    <div className="prep-split">
      <section className="prep-panel"><h2>Start with your own life</h2><p>{personalInterviewPrompts.length} additional practice prompts. Speak first, then note what you want to improve. These are not guaranteed interview questions.</p>
        <label className="prep-field mt-5">Choose a question<select value={index} onChange={(event) => setIndex(Number(event.target.value))}>{personalInterviewPrompts.map((item, itemIndex) => <option value={itemIndex} key={item.prompt}>{itemIndex + 1}. {item.group}: {item.prompt}</option>)}</select></label>
        <p className="prep-muted">{current.group}</p><h3 className="prep-question">{current.prompt}</h3>
        <PracticeTimer key={index} seconds={90} label="Optional 90-second answer practice" />
        <label className="prep-field">Your notes, in English or Urdu<textarea dir="auto" maxLength={5000} value={answers[index] ?? ''} onChange={(event) => setAnswers((previous) => ({ ...previous, [index]: event.target.value }))} placeholder="What happened? What did I do? What was the result?" /></label>
        <div className="prep-actions"><button className="prep-button" type="button" onClick={() => setIndex((previous) => (previous + 1) % personalInterviewPrompts.length)}>Next question</button><button className="prep-button prep-button-secondary" type="button" onClick={() => downloadText('issb-interview-notes.txt', personalInterviewPrompts.map((item, itemIndex) => `${item.prompt}\n${answers[itemIndex] ?? ''}`).join('\n\n'))}>Download notes</button></div>
        <p className="prep-muted mt-5">Notes are not autosaved. Use practice details, not real identity numbers or private medical information.</p>
      </section>
      <aside className="prep-panel"><h2>A simple introduction</h2><ol>{introductionOutline.map(([title, body]) => <li key={title}><strong>{title}.</strong> {body}</li>)}</ol><h3>Prepare for follow-ups</h3><p>If you name a hobby, know its basics. If you name an achievement, explain your contribution. Keep dates and marks consistent with your biodata.</p><div className="prep-note">Do not invent experiences or rehearse a fake personality. Say when you do not know and explain what you do understand.</div><Link className="prep-button prep-button-secondary" href="/biodata">Practise your biodata</Link><p className="prep-muted mt-5"><a href="https://issb.gov.pk/index.php/guideline/" target="_blank" rel="noreferrer">Official ISSB guidance</a> recommends honest, straightforward answers and communication in both Urdu and English.</p></aside>
    </div>
  );
}
