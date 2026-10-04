import type { Metadata } from "next";
import { Suspense } from "react";
import RandomDrawBanner from "./components/RandomDrawBanner";
import SiteNav from "./components/SiteNav";
import ThirdPartyScripts from "./components/ThirdPartyScripts";
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
        <SiteNav />
        <main className="site-main">
          <Suspense fallback={null}><RandomDrawBanner /></Suspense>
          {children}
        </main>
        <ThirdPartyScripts excludedPathPrefixes={["/biodata", "/opi"]} />
      </body>
    </html>
  );
}
