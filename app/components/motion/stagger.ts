import type { CSSProperties } from 'react';

/** Inline style for the n-th child of a `.stagger` container, so entrances land ~45ms apart. */
export function stagger(index: number, style?: CSSProperties): CSSProperties {
  return { ...style, '--i': Math.min(index, 14) } as CSSProperties;
}
