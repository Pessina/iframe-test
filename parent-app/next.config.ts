import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Content-Security-Policy",
            value: "frame-src https://iframe-do8t2bj4g-fspessinas-projects.vercel.app; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
