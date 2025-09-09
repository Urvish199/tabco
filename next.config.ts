import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",   // 👈 allows ALL https domains
      },
      {
        protocol: "http",
        hostname: "**",   // 👈 allows ALL https domains
      },
    ],
  },

};

export default nextConfig;
