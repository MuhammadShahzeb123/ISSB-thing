import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The standalone Physical area was folded into GTO outdoor obstacles.
      { source: "/physical", destination: "/gto/outdoor", permanent: true },
    ];
  },
};

export default nextConfig;
