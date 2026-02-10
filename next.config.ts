import type { NextConfig } from "next";

const WKND_PUBLISH_URL = "https://publish-p125048-e1847106.adobeaemcloud.com";

const nextConfig: NextConfig = {
  images: {
    // Fetch WKND images directly from Adobe publish (full URLs from getImageUrl)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "publish-p125048-e1847106.adobeaemcloud.com",
        pathname: "/adobe/dynamicmedia/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/shop", destination: "/adventures", permanent: true },
      { source: "/shop/:path*", destination: "/adventures", permanent: true },
    ];
  },
};

export default nextConfig;
