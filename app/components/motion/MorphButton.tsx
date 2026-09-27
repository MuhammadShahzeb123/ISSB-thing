'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Swap } from './Swap';

export type MorphStatus = 'idle' | 'busy' | 'done';

function Spinner() {
  return (
    <svg className="morph-spinner" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" strokeDasharray="40 17" strokeLinecap="square" />
    </svg>
  );
}

function Check() {
  return (
    <svg className="morph-check" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter" />
    </svg>
  );
}

/**
 * One button that becomes a loader and then a check. The label swaps with a short blur while the button's
 * width springs to fit, so the three states read as the same element changing rather than three buttons.
 */
export function MorphButton({ status, children, busyLabel = 'Working…', doneLabel = 'Done', className = 'prep-button', ...rest }: {
  status: MorphStatus;
  busyLabel?: ReactNode;
  doneLabel?: ReactNode;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>) {
  return (
    <button type="button" className={className} aria-busy={status === 'busy'} {...rest}>
      <Swap id={status} morph="width" inline>
        <span className="morph-content">
          {status === 'busy' && <Spinner />}
          {status === 'done' && <Check />}
          <span>{status === 'busy' ? busyLabel : status === 'done' ? doneLabel : children}</span>
        </span>
      </Swap>
    </button>
  );
}
