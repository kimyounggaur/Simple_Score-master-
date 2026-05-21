import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const isGitHubPages = process.env.GITHUB_ACTIONS === "true" && Boolean(repositoryName);
const basePath = isGitHubPages ? `/${repositoryName}` : undefined;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGitHubPages ? "export" : undefined,
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true
  },
  transpilePackages: [
    "@harmony/notation-engine",
    "@harmony/renderer",
    "@harmony/audio",
    "@harmony/musicxml",
    "@harmony/shared-types"
  ]
};

export default nextConfig;
