import type { NextConfig } from "next";

function getAemImageRemotePatterns() {
  const urls = [
    process.env.AEM_PUBLISH_URL?.trim(),
    process.env.AEM_AUTHOR_URL?.trim(),
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
    unoptimized: true, // Cloudflare doesn't run Next's image optimizer
  },
  async rewrites() {
    const publishUrl = process.env.AEM_PUBLISH_URL?.trim();
    if (!publishUrl) return [];
    return [
      {
        source: "/dm/:path*",
        destination: `${publishUrl}/adobe/dynamicmedia/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/adventures", permanent: true },
      { source: "/shop/:path*", destination: "/adventures", permanent: true },
    ];
  },
};

export default nextConfig;