'use client';

import type { ReactNode } from 'react';
import { useLiquidInk } from './useLiquidInk';

export interface SegmentedOption<T extends string | number> {
  value: T;
  label: ReactNode;
  lang?: string;
}

/**
 * A group of exclusive options with one ink block that slides between them. The block's leading edge arrives
 * before its trailing edge, so it stretches towards the option you picked and settles under it.
 */
export function Segmented<T extends string | number>({ options, value, onChange, label, className }: {
  options: readonly SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}) {
  const { container, ink } = useLiquidInk({ target: String(value) });
  return (
    <div ref={container} className={className ? `seg ${className}` : 'seg'} role="group" aria-label={label}>
      <span ref={ink} className="seg-ink" aria-hidden />
      {options.map((option) => (
        <button key={String(option.value)} type="button" data-ink={String(option.value)} aria-pressed={option.value === value} lang={option.lang} onClick={() => onChange(option.value)}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
