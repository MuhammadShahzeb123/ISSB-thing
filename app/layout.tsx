import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISSB Practice - WAT & Picture Test",
  description: "Prepare for your ISSB Word Association Test and Picture Association Test",
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
        data-site-id="c1fa2b3e-06c1-4b8c-87f8-3db02a56cb72"
        data-write-token=""
        data-url="https://ingest.fumblemap.com/events"
        strategy="afterInteractive"
      />
      <body className="antialiased">
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white">ISSB Prep</a>
            <div className="flex gap-2 overflow-x-auto">
              <a href="/" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">WAT</a>
              <a href="/picturestest" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Picture Test</a>
              <a href="/countries" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Countries</a>
              <a href="/quiz" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Capitals Quiz</a>
              <a href="/ministers" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Ministers</a>
              <a href="/ranks/army" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Army Ranks</a>
              <a href="/ranks/airforce" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Air Force Ranks</a>
              <a href="/ranks/navy" className="px-3 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800 text-sm whitespace-nowrap">Navy Ranks</a>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}