'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { guideBookCredit, type GuideNote } from '../lib/guideBookNotes';

function NoteModal({ note, onClose }: { note: GuideNote; onClose: () => void }) {
  const titleId = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [onClose]);
  return (
    <div className="gk-modal-root" role="presentation">
      <button type="button" className="gk-modal-backdrop" aria-label="Close dialog" onClick={onClose} />
      <div className="gk-modal" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <div className="gk-modal-header">
          <button ref={closeRef} type="button" className="gk-modal-close" onClick={onClose}>
            Close
          </button>
        </div>
        <article className="gk-modal-body">
          <p className="gk-tile-kicker">Guide book notes</p>
          <h2 id={titleId}>{note.title}</h2>
          <p>{note.teaser}</p>
          <ul>
            {note.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          {note.caution ? (
            <p className="prep-note">
              <strong>Note: </strong>
              {note.caution}
            </p>
          ) : null}
          <p className="prep-note">{guideBookCredit}</p>
        </article>
      </div>
    </div>
  );
}

export default function GuideNotes({ id, title, notes }: { id: string; title: string; notes: readonly GuideNote[] }) {
  const [open, setOpen] = useState<GuideNote | null>(null);
  return (
    <section className="prep-panel mt-8" aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      <p className="prep-note">Tap a card for the full notes.</p>
      <div className="gk-tile-grid mt-4">
        {notes.map((note) => (
          <button key={note.id} type="button" className="gk-tile gk-tile--qa" onClick={() => setOpen(note)}>
            <span className="gk-tile-kicker">Guide book</span>
            <strong className="gk-tile-title">{note.title}</strong>
            <span className="gk-tile-teaser">{note.teaser}</span>
            <span className="gk-tile-cta">Open notes →</span>
          </button>
        ))}
      </div>
      {open ? <NoteModal note={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
