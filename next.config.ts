import type { NextConfig } from "next";

function getAemImageRemotePatterns() {
  const urls = [
    process.env.AEM_PUBLISH_URL?.trim(),
    process.env.AEM_PREVIEW_URL?.trim(),
  ].filter(Boolean) as string[];
  const patterns: { protocol: "https"; hostname: string; pathname: string }[] = [];
  for (const url of urls) {
    try {
      patterns.push({
        protocol: "https",
        hostname: new URL(url).hostname,
        pathname: "/**",
      });
    } catch {
      // skip invalid URL
    }
  }
  return patterns;
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getAemImageRemotePatterns(),
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/adventures", permanent: true },
      { source: "/shop/:path*", destination: "/adventures", permanent: true },
    ];
  },
};

export default nextConfig;
