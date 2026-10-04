'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useId, useState } from 'react';
import { siteNavigation } from '../lib/siteNavigation';

const extraLinks = [
  { href: '/practice/revision', label: 'Revision' },
] as const;

export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <nav className="site-nav" aria-label="Primary navigation">
      <div className="site-nav-inner">
        <Link href="/" className="site-brand" onClick={() => setOpen(false)}>
          <span className="site-brand-mark">IP</span>
          <span>
            ISSB <strong>PREP</strong>
          </span>
        </Link>

        <div className="site-nav-links" aria-hidden={open ? true : undefined}>
          {siteNavigation.map((area) => (
            <Link key={area.slug} href={area.href} className="site-nav-link">
              {area.shortLabel}
            </Link>
          ))}
          {extraLinks.map((link) => (
            <Link key={link.href} href={link.href} className="site-nav-link">
              {link.label}
            </Link>
          ))}
        </div>

        <Link href="/practice/start" className="site-nav-cta site-nav-cta--desktop">
          Random test
        </Link>

        <button
          type="button"
          className="site-nav-toggle"
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open ? (
        <div className="site-nav-drawer" id={menuId}>
          <div className="site-nav-drawer-links">
            {siteNavigation.map((area) => (
              <Link
                key={area.slug}
                href={area.href}
                className="site-nav-drawer-link"
                onClick={() => setOpen(false)}
              >
                {area.shortLabel}
              </Link>
            ))}
            {extraLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="site-nav-drawer-link"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/practice/start"
              className="site-nav-cta site-nav-cta--drawer"
              onClick={() => setOpen(false)}
            >
              Random test
            </Link>
          </div>
        </div>
      ) : null}
    </nav>
  );
}
