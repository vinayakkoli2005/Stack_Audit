import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration warnings from browser extensions (e.g. Grammarly) injecting body attributes
  reactStrictMode: true,
};

export default nextConfig;
