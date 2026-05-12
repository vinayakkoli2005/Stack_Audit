import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress hydration warnings from browser extensions (e.g. Grammarly) injecting body attributes
  reactStrictMode: true,
  // Keep heavy server-only packages out of the client bundle
  serverExternalPackages: ["@react-pdf/renderer"],
};

export default nextConfig;
