'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Local tab state seeded from `?tab=`. A later client navigation that changes
 * the query (for example a second random draw) switches the tab again, while
 * clicking tabs on the page stays local.
 */
export function useTabParam<T extends string>(tabs: readonly T[], fallback: T) {
  const requested = useSearchParams().get('tab');
  const valid = (value: string | null): T | null => (value && (tabs as readonly string[]).includes(value) ? value as T : null);
  const [state, setState] = useState({ requested, tab: valid(requested) ?? fallback });
  if (state.requested !== requested) {
    setState({ requested, tab: valid(requested) ?? state.tab });
  }
  return [state.tab, (tab: T) => setState((previous) => ({ ...previous, tab }))] as const;
}
