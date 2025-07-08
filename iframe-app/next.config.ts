import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove X-Frame-Options to allow iframe embedding
  // In production, you'd want to restrict this to specific domains
};

export default nextConfig;
