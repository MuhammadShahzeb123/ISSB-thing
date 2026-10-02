/** Turn study text into spoken narration: flowing prose, no dashes or colons. */
export function toSpokenProse(...parts: Array<string | undefined | null>): string {
  const joined = parts
    .filter((p): p is string => Boolean(p && String(p).trim()))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  let t = joined
    .replace(/\bRemember:\s*/gi, 'Remember ')
    .replace(/[–—−]/g, ' ')
    .replace(/:/g, ',')
    .replace(/\s-\s/g, ' ')
    .replace(/(\w)-(\w)/g, '$1 $2') // hyphenated words → spaced words
    .replace(/\//g, ' or ')
    .replace(/[•·▪︎]/g, ' ')
    .replace(/\([^)]*\)/g, (m) => ` ${m.slice(1, -1)} `)
    .replace(/[{}[\]]/g, ' ')
    .replace(/[;]/g, ',')
    .replace(/\s+,/g, ',')
    .replace(/,{2,}/g, ',')
    .replace(/,\s*\./g, '.')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+\./g, '.')
    .trim();

  // Final sweep for forbidden characters
  t = t.replace(/[:–—−]/g, ' ').replace(/(\w)-(\w)/g, '$1 $2').replace(/\s{2,}/g, ' ').trim();

  if (!t) return '';
  if (!/[.!?]$/.test(t)) t += '.';
  return t;
}

export function assertSpokenProse(script: string, label: string): void {
  if (/[:–—−]/.test(script) || /(?<![A-Za-z])-(?![A-Za-z])/.test(script) === false && script.includes('-')) {
    // allow none; any hyphen is banned in narration
  }
  if (/[:–—−-]/.test(script)) {
    throw new Error(`Spoken prose for ${label} still contains dash or colon: ${script.slice(0, 80)}`);
  }
}
