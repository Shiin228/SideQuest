import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // Proof uploads are capped at 10 MB in the action itself; leave headroom for form overhead.
      bodySizeLimit: "12mb",
    },
  },
};

export default nextConfig;
