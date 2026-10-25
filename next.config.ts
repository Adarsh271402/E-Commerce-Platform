import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.NETLIFY ? ".next-netlify" : ".next",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
