'use client';

import { useTabParam } from '../lib/useTabParam';
import DimensionNav from '../components/DimensionNav';
import IntroductionPractice from '../components/IntroductionPractice';
import MentalMath from '../components/MentalMath';
import { CurrentAffairsStudy, KnowledgeStudy, MilitaryStoriesStudy, SourceQuestionStudy } from '../components/InterviewStudy';
import { mathQuestions } from '../lib/mentalMath';
import { currentAffairs } from '../lib/currentAffairs';

const TABS = ['introduction', 'maths', 'affairs', 'stories', 'knowledge', 'source'] as const;

export default function InterviewPractice() {
  const [tab, setTab] = useTabParam(TABS, 'introduction');
  return (
    <div className="neo-page neo-page--leadership prep-page"><div className="prep-shell">
      <DimensionNav active="interview" />
      <header className="prep-header"><h1>Deputy President interview</h1><p>Know your own life. Answer a quick calculation. Explain what is happening in Pakistan and the wider world.</p></header>
      <div className="prep-counts"><div><strong>{mathQuestions.length}</strong><span>quick mental-math questions</span></div><div><strong>{currentAffairs.length}</strong><span>sourced current-affairs briefs</span></div><div><strong>11</strong><span>short gallantry-award stories</span></div></div>
      <p className="prep-muted">The official title is Deputy President. This section covers what you called the DPT / DIPT interview. These tools support preparation, not a prediction of questions or selection.</p>
      <div className="prep-tabs" aria-label="Interview preparation areas">{[['introduction', 'Your introduction'], ['maths', 'Quick maths'], ['affairs', 'Current affairs'], ['stories', '11 gallantry stories'], ['knowledge', 'General knowledge'], ['source', 'Photo question bank']].map(([id, label]) => <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id as (typeof TABS)[number])}>{label}</button>)}</div>
      {tab === 'introduction' && <IntroductionPractice />}
      {tab === 'maths' && <MentalMath />}
      {tab === 'affairs' && <CurrentAffairsStudy />}
      {tab === 'stories' && <MilitaryStoriesStudy />}
      {tab === 'knowledge' && <KnowledgeStudy />}
      {tab === 'source' && <SourceQuestionStudy />}
    </div></div>
  );
}
