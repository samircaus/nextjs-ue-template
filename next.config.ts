import type { NextConfig } from "next";

function getAemImageRemotePatterns() {
  const url = process.env.AEM_PUBLISH_URL?.trim();
  if (!url) return [];
  try {
    const hostname = new URL(url).hostname;
    return [
      {
        protocol: "https" as const,
        hostname,
        pathname: "/**",
      },
    ];
  } catch {
    return [];
  }
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
