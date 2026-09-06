import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Food `image_url` values are admin-entered and can point to any host
    // (backend uploads, a CDN, etc.) until a single image host is settled on.
    // Narrow this to the real host(s) once one is finalized, for tighter
    // security than a wildcard allows.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
