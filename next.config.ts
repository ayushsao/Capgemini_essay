import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['recharts', 'natural', 'compromise']
  },
  // Ensure proper handling of client-side authentication
  output: 'standalone',
  // Handle potential static generation issues
  trailingSlash: false,
  // Optimize for production deployment
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error']
    } : false
  }
};

export default nextConfig;
