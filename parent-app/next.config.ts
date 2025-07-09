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
            value:
              "frame-src https://iframe-app-phi.vercel.app http://localhost:3000; frame-ancestors 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
