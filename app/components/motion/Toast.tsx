'use client';

import { useState } from 'react';
import { Swap } from './Swap';

/**
 * A single bottom toast. It springs in, swaps its text in place when a new message arrives while it is up,
 * and blurs out when the message clears instead of vanishing.
 */
export function Toast({ message }: { message: string }) {
  const [shown, setShown] = useState(message);
  if (message && message !== shown) setShown(message);
  return (
    <div aria-live="polite" role="status">
      {shown && (
        <div className={`lib-toast${message ? '' : ' is-out'}`}>
          <Swap id={shown} morph="width" inline>{shown}</Swap>
        </div>
      )}
    </div>
  );
}
