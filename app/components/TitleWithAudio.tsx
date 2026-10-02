'use client';

import type { ReactNode } from 'react';
import SpeakButton from './SpeakButton';

/** Heading row with an adjacent one-tap play control (mobile-friendly). */
export default function TitleWithAudio({
  as: Tag = 'h2',
  children,
  script,
  audioSrc,
  className = '',
  playLabel = 'Play audio for this section',
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  children: ReactNode;
  script?: string;
  audioSrc?: string;
  className?: string;
  playLabel?: string;
}) {
  return (
    <div className={`title-with-audio ${className}`.trim()}>
      <Tag className="title-with-audio-heading">{children}</Tag>
      {script || audioSrc ? (
        <SpeakButton script={script ?? ''} audioSrc={audioSrc} label={playLabel} />
      ) : null}
    </div>
  );
}
