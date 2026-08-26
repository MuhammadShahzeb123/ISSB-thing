import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISSB Prep - WAT, Maps & Memory Practice",
  description: "Prepare for ISSB with WAT practice, interactive capitals, rank recall, and general knowledge review.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4572327196330612"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.fumblemap.com/fumblemap.min.js"
        data-site-id="71b991d5-5862-4cfe-af3a-e9e8d7363c99"
        data-write-token="5ee21b1da7884128c95329ba88aece6cbaa104f04687c58512d57f1ba80dd847"
        data-url="https://ingest.fumblemap.com/events"
        strategy="afterInteractive"
      />
      <body className="neo-body">
        <nav className="site-nav">
          <div className="site-nav-inner">
            <Link href="/" className="site-brand">
              <span className="site-brand-mark">IP</span>
              <span>ISSB <strong>PREP</strong></span>
            </Link>
            <div className="site-nav-links" aria-label="Primary navigation">
              <Link href="/" className="site-nav-link">WAT</Link>
              <Link href="/picturestest" className="site-nav-link">Psych Tests</Link>
              <Link href="/countries" className="site-nav-link">Countries</Link>
              <Link href="/study" className="site-nav-link">Memory Lab</Link>
              <Link href="/quiz" className="site-nav-link">Capitals Quiz</Link>
              <Link href="/ministers" className="site-nav-link">Ministers</Link>
              <Link href="/ranks/army" className="site-nav-link">Army Ranks</Link>
              <Link href="/ranks/airforce" className="site-nav-link">Air Force Ranks</Link>
              <Link href="/ranks/navy" className="site-nav-link">Navy Ranks</Link>
            </div>
          </div>
        </nav>
        <main className="site-main">{children}</main>
        <Analytics />
      </body>
    </html>
  );
}
