'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { siteNavigation } from '../lib/siteNavigation';
import { useLiquidInk, type InkRect } from './motion/useLiquidInk';

const links = [
  { href: '/library', label: 'Practice library', className: 'site-nav-link site-nav-link--primary' },
  ...siteNavigation.map((area) => ({
    href: area.href,
    label: area.label,
    className: `site-nav-link${area.slug === 'general-knowledge' ? ' site-nav-link--separated' : ''}`,
  })),
];

// The bar sits in the container's bottom padding, just under the link.
function underline(element: HTMLElement): InkRect {
  return { left: element.offsetLeft, right: element.offsetLeft + element.offsetWidth, top: element.offsetTop + element.offsetHeight + 1, bottom: element.offsetTop + element.offsetHeight + 4 };
}

/** Primary navigation with one underline that slides to the page you are on and previews the link under the cursor. */
export default function SiteNav() {
  const pathname = usePathname() ?? '/';
  const active = links.filter((link) => pathname === link.href || pathname.startsWith(`${link.href}/`)).sort((a, b) => b.href.length - a.href.length)[0]?.href ?? null;
  const [hovered, setHovered] = useState<string | null>(null);
  const { container, ink } = useLiquidInk({ target: hovered ?? active, measure: underline });

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand">
          <span className="site-brand-mark">IP</span>
          <span>ISSB <strong>PREP</strong></span>
        </Link>
        <div ref={container} className="site-nav-links" onPointerLeave={() => setHovered(null)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHovered(null); }}>
          <span ref={ink} className="site-nav-ink" aria-hidden />
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={link.className}
              data-ink={link.href}
              aria-current={active === link.href ? 'page' : undefined}
              onPointerEnter={() => setHovered(link.href)}
              onFocus={() => setHovered(link.href)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
