'use client';

import { useState } from 'react';
import SpacedRepetitionDeck from './SpacedRepetitionDeck';
import TitleWithAudio from './TitleWithAudio';
import CurrentAffairsBrowser from './CurrentAffairsBrowser';
import { currentAffairs, researchAsOf, researchCaveat } from '../lib/currentAffairs';
import { awardExplanation, militaryStories, type MilitaryStory } from '../lib/militaryStories';
import { sourcePhotos } from '../lib/contentBank';
import { interviewSourcePages } from '../lib/interviewSource';
import { downloadText } from '../lib/practice';
import { martyrNarration } from '../lib/narrationCatalog';

const getStoryId = (story: MilitaryStory) => story.id;

export function CurrentAffairsStudy() {
  return (
    <CurrentAffairsBrowser
      showDownload
      onDownload={() =>
        downloadText(
          `issb-current-affairs-${researchAsOf}.txt`,
          [
            researchCaveat,
            ...currentAffairs.map(
              (brief) =>
                `${brief.title}\nUpdated source date: ${brief.date}\n${brief.summary}\n\nWhy Pakistan: ${brief.whyPakistan}\nInterview: ${brief.question}\n${brief.answerPoints.join('\n')}\nWatch next:\n${brief.watch.join('\n')}\nSources:\n${brief.sources.map((source) => `${source.title} (${source.publishedAt})\n${source.url}`).join('\n')}`,
            ),
          ].join('\n\n'),
        )
      }
    />
  );
}

function StoryDetail({ story }: { story: MilitaryStory }) {
  return (
    <>
      <p className="prep-muted mb-2">
        {story.service} · {story.unit} · {story.conflict}
      </p>
      <p>{story.summary}</p>
      <p className="prep-note">
        <strong>Remember:</strong> {story.memory}
      </p>
      <details className="prep-details">
        <summary>Full story and six details to recall</summary>
        <p>{story.story}</p>
        <dl>
          {(
            [
              ['Name', `${story.rank} ${story.name}`],
              ['What he did', story.what],
              ['How he did it', story.how],
              ['Local benefit', story.result],
              ['How he died', story.death],
              ['When he died', story.deathDate],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="mb-3">
              <dt className="font-bold">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
        {story.caution && <p className="prep-muted">{story.caution}</p>}
      </details>
      <ul className="prep-muted">
        {story.sources.map((source) => (
          <li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title}
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}

export function MilitaryStoriesStudy() {
  const [mode, setMode] = useState('read');
  const [query, setQuery] = useState('');
  const filtered = militaryStories.filter((story) =>
    `${story.rank} ${story.name} ${story.place} ${story.unit} ${story.memory}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  return (
    <>
      <section className="prep-panel">
        <h2>11 people. Remember the action.</h2>
        <p>{awardExplanation}</p>
        <p className="mt-4">
          Learn the person, place and action first. Tell the story in your own words, then recall how and when he died.
          Birth dates and long career timelines are deliberately left out.
        </p>
        <p className="mt-3">
          <a href="/nishan-e-haider">Open the photo card gallery →</a>
        </p>
      </section>
      <div className="prep-tabs">
        <button type="button" aria-pressed={mode === 'read'} onClick={() => setMode('read')}>
          Read stories
        </button>
        <button type="button" aria-pressed={mode === 'recall'} onClick={() => setMode('recall')}>
          Practise recall
        </button>
      </div>
      {mode === 'recall' ? (
        <SpacedRepetitionDeck
          storageKey="issb-gallantry-stories-v3"
          items={militaryStories}
          getId={getStoryId}
          accentColor="amber"
          renderFront={(story) => (
            <div>
              <p className="text-sm mb-4">Tell the story: action, method, benefit and sacrifice.</p>
              <p>
                {story.rank} {story.name}
              </p>
            </div>
          )}
          renderBack={(story) => <StoryDetail story={story} />}
        />
      ) : (
        <>
          <label className="prep-field">
            Find a person or action
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sarwar, canal, aircraft..."
            />
          </label>
          <p className="prep-muted mb-5" role="status">
            {filtered.length} of {militaryStories.length} stories
          </p>
          {!filtered.length && <p className="prep-panel">No matching story. Try a name or place.</p>}
          {filtered.map((story) => {
            const narr = martyrNarration[story.id];
            return (
              <article className="prep-panel martyr-inline" key={story.id}>
                <div className="martyr-inline-media">
                  {story.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={story.image}
                      alt={`Portrait of ${story.rank} ${story.name}`}
                      loading="lazy"
                      width={120}
                      height={120}
                    />
                  ) : (
                    <div className="martyr-card-placeholder martyr-card-placeholder--small" aria-hidden="true">
                      {story.name
                        .split(/\s+/)
                        .filter(Boolean)
                        .map((p, i, a) => (i === 0 || i === a.length - 1 ? p[0] : ''))
                        .join('')
                        .toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="prep-muted mb-2">
                    {story.award} | {story.place} | {story.deathDate}
                  </p>
                  <TitleWithAudio
                    as="h2"
                    script={narr?.script ?? story.spokenScript}
                    audioSrc={narr?.audio}
                    playLabel={`Play story of ${story.rank} ${story.name}`}
                  >
                    {story.rank} {story.name}
                  </TitleWithAudio>
                  <StoryDetail story={story} />
                </div>
              </article>
            );
          })}
        </>
      )}
    </>
  );
}

export { default as KnowledgeStudy } from './GeneralKnowledgeBrowser';

export function SourceQuestionStudy() {
  const [query, setQuery] = useState('');
  const mathSections = sourcePhotos.flatMap((photo) =>
    photo.sections
      .filter((section) => section.kind === 'math')
      .map((section) => ({ ...section, fileName: photo.fileName, issues: photo.issues })),
  );
  return (
    <>
      <section className="prep-panel">
        <h2>Original interview question bank</h2>
        <p>
          The photographed questions, including Urdu personal prompts, officeholder checklists and arithmetic worksheets.
          Blank or obsolete source answers are not silently filled with guesses.
        </p>
        <label className="prep-field mt-5">
          Search source questions
          <input type="search" dir="auto" value={query} onChange={(event) => setQuery(event.target.value)} />
        </label>
      </section>
      {interviewSourcePages.map((page) => {
        const prompts = page.prompts.filter((prompt) => prompt.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        return prompts.length ? (
          <section className="prep-panel" key={page.sourceImage}>
            <h2>Interview notes, page {page.sourcePage}</h2>
            <div className="prep-note">{page.note}</div>
            <ol lang={page.language} dir={page.language === 'ur' ? 'rtl' : 'ltr'}>
              {prompts.map((prompt, index) => (
                <li key={index} className="mb-3">
                  <div className="prep-ask-block">
                    <p className="prep-ask-label">Question {index + 1}</p>
                    <p className="prep-ask">{prompt}</p>
                  </div>
                </li>
              ))}
            </ol>
            <a className="prep-source-link" href={`/sources#${page.sourceImage}`}>
              Source transcription
            </a>
          </section>
        ) : null;
      })}
      {mathSections.map((section) => {
        const items = section.items.filter((item) => item.prompt.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        return items.length ? (
          <section className="prep-panel" key={section.id}>
            <h2>{section.title}</h2>
            <p className="prep-muted">
              Page {section.sourcePage} | {items.length} matching entries
            </p>
            {section.issues.length > 0 && <div className="prep-note">{section.issues.join(' ')}</div>}
            {items.map((item, index) => (
              <article key={index} className="mb-4">
                <div className="prep-ask-block">
                  <p className="prep-ask-label">Question</p>
                  <h3 className="prep-ask" lang={section.language} dir={section.language === 'ur' ? 'rtl' : 'ltr'}>
                    {item.prompt}
                  </h3>
                </div>
                <details className="prep-details">
                  <summary>Show answer</summary>
                  <p dir="auto">
                    {item.answer ??
                      'No answer is printed in this source. Work it out using the given facts; do not assume unclear units.'}
                  </p>
                  {item.detail && (
                    <p className="prep-muted" dir="auto">
                      {item.detail}
                    </p>
                  )}
                </details>
              </article>
            ))}
            <a className="prep-source-link" href={`/sources#${section.fileName}`}>
              Source transcription
            </a>
          </section>
        ) : null;
      })}
    </>
  );
}
