import type { Metadata } from "next";
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
      <body className="antialiased">
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-white">ISSB Prep</Link>
            <div className="flex gap-2 overflow-x-auto">
              <Link href="/" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">WAT</Link>
              <Link href="/picturestest" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Picture Test</Link>
              <Link href="/countries" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Countries</Link>
              <Link href="/study" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Memory Lab</Link>
              <Link href="/quiz" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Capitals Quiz</Link>
              <Link href="/ministers" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Ministers</Link>
              <Link href="/ranks/army" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Army Ranks</Link>
              <Link href="/ranks/airforce" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Air Force Ranks</Link>
              <Link href="/ranks/navy" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Navy Ranks</Link>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
