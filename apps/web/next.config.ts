import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@harmony/notation-engine",
    "@harmony/renderer",
    "@harmony/audio",
    "@harmony/musicxml",
    "@harmony/shared-types"
  ]
};

export default nextConfig;
