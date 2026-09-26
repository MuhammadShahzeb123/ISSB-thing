'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { formatClock } from '../../lib/practice';

export function ProgressBar({ value, label, variant, className = '' }: { value: number; label?: string; variant?: 'time' | 'danger'; className?: string }) {
  const percent = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className={className}>
      <div className={`lib-bar${variant === 'time' ? ' lib-bar--time' : ''}${variant === 'danger' ? ' lib-bar--time lib-bar--danger' : ''}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent} aria-label={label ?? 'Progress'}>
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export function Clock({ left, total, label = 'Time left' }: { left: number; total: number; label?: string }) {
  const low = left <= Math.min(30, total * 0.15);
  return (
    <div style={{ minWidth: '9rem' }}>
      <p className={`lib-clock${low ? ' is-low' : ''}`} role="timer" aria-label={`${label}: ${formatClock(left)}`}>{formatClock(left)}</p>
      <ProgressBar value={total ? left / total : 0} variant={low ? 'danger' : 'time'} label={label} className="mt-1" />
    </div>
  );
}

/** Short-lived confirmation message, announced to screen readers. */
export function useToast() {
  const [message, setMessage] = useState('');
  const timer = useRef<number | undefined>(undefined);
  const show = useCallback((text: string) => {
    setMessage(text);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setMessage(''), 2200);
  }, []);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const toast = <div aria-live="polite" role="status">{message && <div className="lib-toast">{message}</div>}</div>;
  return { show, toast };
}

export function Highlight({ text, query }: { text: string; query: string }): ReactNode {
  const needle = query.trim().toLocaleLowerCase();
  if (!needle) return text;
  const lower = text.toLocaleLowerCase();
  const parts: ReactNode[] = [];
  let from = 0;
  let at = lower.indexOf(needle);
  while (at !== -1 && parts.length < 20) {
    parts.push(<Fragment key={`t${from}`}>{text.slice(from, at)}</Fragment>);
    parts.push(<mark key={`m${at}`}>{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
    at = lower.indexOf(needle, from);
  }
  parts.push(<Fragment key="end">{text.slice(from)}</Fragment>);
  return parts;
}

/** True when a key event came from a text field, so single-key shortcuts should be ignored. */
export function isTyping(event: KeyboardEvent): boolean {
  const target = event.target as HTMLElement | null;
  return !!target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT' || target.isContentEditable);
}

export function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

export function dirFor(language: 'en' | 'ur') {
  return language === 'ur' ? 'rtl' : 'ltr';
}
