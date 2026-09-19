import Link from 'next/link';

export default function DimensionNav({ active }: { active: 'psychological' | 'gto' | 'interview' | 'sources' }) {
  return (
    <nav className="prep-dimensions" aria-label="ISSB assessment dimensions">
      {[
        ['psychological', '/picturestest', 'Psychological'],
        ['gto', '/gto', 'GTO indoor'],
        ['interview', '/interview', 'Deputy President'],
        ['sources', '/sources', 'Source coverage'],
      ].map(([key, href, label]) => (
        <Link key={key} href={href} className={active === key ? 'prep-dimension is-active' : 'prep-dimension'} aria-current={active === key ? 'page' : undefined}>{label}</Link>
      ))}
    </nav>
  );
}
