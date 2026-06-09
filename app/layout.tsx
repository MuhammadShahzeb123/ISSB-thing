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
        src="http://13.140.156.53:3001/fumblemap.min.js"
        data-site-id="fbff682e-0c9e-4a16-ba68-6232886d9aa5"
        data-url="http://13.140.156.53:3001/events"
        strategy="afterInteractive"
      />
      <body className="antialiased">
        <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-sm border-b border-slate-800 z-50">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white">ISSB Prep</a>
            <div className="flex gap-4">
              <a href="/" className="px-4 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">WAT</a>
              <a href="/picturestest" className="px-4 py-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800">Picture Test</a>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}