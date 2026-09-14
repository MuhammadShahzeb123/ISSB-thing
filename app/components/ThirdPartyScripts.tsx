"use client";

import { Analytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
import Script from "next/script";

type ThirdPartyScriptsProps = {
  excludedPathPrefixes?: readonly string[];
};

export default function ThirdPartyScripts({
  excludedPathPrefixes = [],
}: ThirdPartyScriptsProps) {
  const pathname = usePathname();
  const isExcluded = excludedPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isExcluded) {
    return null;
  }

  return (
    <>
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
      <Analytics />
    </>
  );
}
