'use client';

import TitleWithAudio from '../TitleWithAudio';
import { psychNarration } from '../../lib/narrationCatalog';

export default function PsychAudioHeader({
  narrationId,
  kicker,
  title,
  summary,
}: {
  narrationId: string;
  kicker: string;
  title: string;
  summary: string;
}) {
  const narr = psychNarration[narrationId];
  return (
    <header className="mb-6 max-w-3xl">
      <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-800">{kicker}</p>
      <TitleWithAudio
        as="h1"
        className="mt-3"
        script={narr?.script}
        audioSrc={narr?.audio}
        playLabel={`Play audio for ${title}`}
      >
        <span className="text-4xl font-black leading-none sm:text-5xl">{title}</span>
      </TitleWithAudio>
      <p className="mt-4 text-lg font-semibold leading-8 text-slate-700">{summary}</p>
    </header>
  );
}
