import type { Metadata } from "next";
import Link from "next/link";
import ThirdPartyScripts from "./components/ThirdPartyScripts";
import { siteNavigation } from "./lib/siteNavigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "ISSB Preparation",
  description: "Prepare across physical, psychological, GTO, interview, and general-knowledge areas.",
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
                <Link
                  key={area.slug}
                  href={area.href}
                  className={`site-nav-link${area.slug === "general-knowledge" ? " site-nav-link--separated" : ""}`}
                >
                  {area.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>
        <main className="site-main">{children}</main>
        <ThirdPartyScripts />
      </body>
    </html>
  );
}
