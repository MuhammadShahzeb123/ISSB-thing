'use client';

import { useState, type Dispatch, type SetStateAction } from 'react';
import PracticeTimer from '../../components/PracticeTimer';
import SpeakButton from '../../components/SpeakButton';
import { downloadText } from '../../lib/practice';
import { sourcePlanningScenarios } from '../../lib/gtoData';
import {
  groupPlanningTasks,
  planningDifficulties,
  type PlanningDifficulty,
  type PlanningTask,
} from '../../lib/groupPlanningTasks';
import RealGtoModels from './RealGtoModels';

const planningFields = [
  'Problems and priority',
  'People, vehicles and supplies',
  'Routes and travel calculations',
  'Who does what, and when',
  'Risks and a backup',
  'One minute final group plan',
];

const filters = ['all', ...planningDifficulties] as const;

function difficultyLabel(value: PlanningDifficulty) {
  if (value === 'easy') return 'Easy';
  if (value === 'medium') return 'Medium';
  return 'Hard';
}

export default function GroupPlanning() {
  const [filter, setFilter] = useState<(typeof filters)[number]>('all');
  const [selectedId, setSelectedId] = useState(groupPlanningTasks[0].id);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const visible = groupPlanningTasks.filter((task) => filter === 'all' || task.difficulty === filter);
  const selected = visible.find((task) => task.id === selectedId) ?? visible[0];
  const photo = sourcePlanningScenarios[0];

  return (
    <div id="group-planning">
      <RealGtoModels />
      <section className="prep-panel">
        <h2>ISSB group planning</h2>
        <p>Ten original practice tasks. Each one is a full briefing with a sketch map, road types, distances and a worked plan. These are not past papers from the Inter Services Selection Board.</p>
        <p><strong>Planning time limit: 15 minutes</strong> on every task. The problem and the map stay open. The worked solution stays closed until you choose to reveal it.</p>
        <div className="gk-status-chips" role="group" aria-label="Filter by difficulty">
          {filters.map((value) => (
            <button key={value} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {value === 'all' ? `All (${groupPlanningTasks.length})` : `${difficultyLabel(value)} (${groupPlanningTasks.filter((task) => task.difficulty === value).length})`}
            </button>
          ))}
        </div>
        <div className="gk-tile-grid">
          {visible.map((task) => (
            <button
              key={task.id}
              type="button"
              className={`gk-tile${selected?.id === task.id ? ' gk-tile--topic' : ''}`}
              aria-pressed={selected?.id === task.id}
              onClick={() => {
                setSelectedId(task.id);
                document.getElementById('gp-task')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              <span className={`gp-badge gp-badge--${task.difficulty}`}>{difficultyLabel(task.difficulty)}</span>
              <strong className="gk-tile-title">{task.title}</strong>
              <span className="gk-tile-teaser">Starts {task.timeNow}. Plan for {task.planningMinutes} minutes. {task.groupSize} in the group.</span>
              <span className="gk-tile-cta">{selected?.id === task.id ? 'Open below' : 'Open task'}</span>
            </button>
          ))}
        </div>
      </section>
      {selected ? <TaskDetail key={selected.id} task={selected} notes={notes} setNotes={setNotes} /> : null}
      <details className="prep-details">
        <summary>Older photographed bridge problem (incomplete)</summary>
        <h3>{photo.title}</h3>
        <p>{photo.brief}</p>
        <ul>{photo.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
        <p lang="ur" dir="rtl">{photo.sourceText}</p>
        <div className="prep-note"><strong>This source problem is incomplete.</strong><ul>{photo.caveats.map((caveat) => <li key={caveat}>{caveat}</li>)}</ul></div>
        <a className="prep-source-link" href={`/sources#${photo.sourceImage}`}>Source page {photo.sourcePage}</a>
      </details>
    </div>
  );
}

function TaskDetail({
  task,
  notes,
  setNotes,
}: {
  task: PlanningTask;
  notes: Record<string, string>;
  setNotes: Dispatch<SetStateAction<Record<string, string>>>;
}) {
  const plannerKey = `${task.id}-`;
  return (
    <section className="prep-panel" id="gp-task">
      <p className="gk-tile-kicker">ISSB group planning · {difficultyLabel(task.difficulty)} · {task.setting}</p>
      <div className="gp-title-row">
        <h2>{task.title}</h2>
        <SpeakButton script={task.script} label={`Play ${task.title}`} />
      </div>
      <div className="prep-ask-block">
        <p className="prep-ask-label">Planning time limit</p>
        <p className="prep-ask">{task.planningMinutes} minutes. It is {task.timeNow} in the story.</p>
      </div>
      <img className="gp-map" src={task.map} alt={task.mapAlt} />
      <h3>Briefing</h3>
      <p>{task.narrative}</p>
      <h3>What must be achieved</h3>
      <ul>{task.mustAchieve.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Constraints</h3>
      <ul>{task.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
      <h3>Your group ({task.groupSize})</h3>
      <ul>{task.people.map((item) => <li key={item}>{item}</li>)}</ul>
      <div className="prep-table-wrap">
        <table className="prep-table">
          <thead><tr><th>Resource</th><th>Given data</th></tr></thead>
          <tbody>
            {task.resources.map((row) => (
              <tr key={row.name}><th scope="row">{row.name}</th><td>{row.detail}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="prep-table-wrap">
        <table className="prep-table">
          <thead><tr><th>Route or allowance</th><th>Given data</th></tr></thead>
          <tbody>
            {task.routes.map((row) => (
              <tr key={row.name}><th scope="row">{row.name}</th><td>{row.detail}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3>Your group plan</h3>
      <PracticeTimer seconds={task.planningMinutes * 60} label={`${task.planningMinutes} minute planning limit`} />
      {planningFields.map((field) => (
        <label key={field} className="prep-field">
          {field}
          <textarea
            dir="auto"
            value={notes[plannerKey + field] ?? ''}
            onChange={(event) => setNotes((previous) => ({ ...previous, [plannerKey + field]: event.target.value }))}
          />
        </label>
      ))}
      <button
        type="button"
        className="prep-button"
        onClick={() => downloadText(
          `issb-group-plan-${task.id}.txt`,
          `${task.title}\nPlanning time limit: ${task.planningMinutes} minutes\nStory time: ${task.timeNow}\n\n${planningFields.map((field) => `${field}\n${notes[plannerKey + field] ?? ''}`).join('\n\n')}`,
        )}
      >
        Download plan
      </button>
      <details className="prep-details">
        <summary>Reveal worked solution</summary>
        <div className="prep-answer">
          <h3>Problems</h3>
          <ul>{task.solution.problems.map((item) => <li key={item}>{item}</li>)}</ul>
          <h3>Priority</h3>
          <p>{task.solution.priority}</p>
          <h3>Worked plan</h3>
          <ol>{task.solution.steps.map((item) => <li key={item}>{item}</li>)}</ol>
          <h3>Regroup</h3>
          <p>{task.solution.regroup}</p>
          <p>These times use only the speeds and allowances in the briefing. A real emergency needs the local authority and a fresh look at the ground.</p>
        </div>
      </details>
    </section>
  );
}
