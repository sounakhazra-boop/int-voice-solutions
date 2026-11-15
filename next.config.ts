import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  // Reverse proxy to bypass Cloudflare iframe/cookie restrictions
  async rewrites() {
    return [
      {
        source: "/tunnel/:path*",
        destination: "https://agui.indusnettechnologies.com/landing",
      },
    ];
  },
};

export default nextConfig;
