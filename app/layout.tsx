import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import RandomDrawBanner from "./components/RandomDrawBanner";
import ThirdPartyScripts from "./components/ThirdPartyScripts";
import { siteNavigation } from "./lib/siteNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISSB Prep - Psychological, GTO & Interview Practice",
  description:
    "ISSB practice across the psychological, GTO (indoor and outdoor) and Deputy President dimensions, with Urdu and English prompts, mental maths, sourced current affairs and gallantry stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="neo-body">
        <nav className="site-nav" aria-label="Primary navigation">
          <div className="site-nav-inner">
            <Link href="/" className="site-brand">
              <span className="site-brand-mark">IP</span>
              <span>ISSB <strong>PREP</strong></span>
            </Link>
            <div className="site-nav-links">
              {siteNavigation.map((area) => (
                <Link key={area.slug} href={area.href} className="site-nav-link">
                  {area.shortLabel}
                </Link>
              ))}
              <Link href="/practice/revision" className="site-nav-link">Revision</Link>
            </div>
            <Link href="/practice/start" className="site-nav-cta">Random test</Link>
          </div>
        </nav>
        <main className="site-main">
          <Suspense fallback={null}><RandomDrawBanner /></Suspense>
          {children}
        </main>
        <ThirdPartyScripts excludedPathPrefixes={["/biodata", "/opi"]} />
      </body>
    </html>
  );
}
