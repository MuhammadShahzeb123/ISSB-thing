import type { Metadata } from "next";
import SiteNav from "./components/SiteNav";
import ThirdPartyScripts from "./components/ThirdPartyScripts";
import "./globals.css";
import "./motion.css";

export const metadata: Metadata = {
  title: "ISSB Prep - Psychological, GTO & Interview Practice",
  description:
    "ISSB practice across the psychological, indoor GTO and Deputy President dimensions, with Urdu and English prompts, mental maths, sourced current affairs and gallantry stories.",
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
        <main className="site-main">{children}</main>
        <ThirdPartyScripts excludedPathPrefixes={["/biodata", "/opi"]} />
      </body>
    </html>
  );
}
