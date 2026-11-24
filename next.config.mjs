// import type { NextConfig } from "next";
import { withSpatialReal } from "@spatialreal/web-sdk/next";

const nextConfig = {
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
  experimental: {
    proxyTimeout: 120_000,
  },
  async rewrites() {
    return [
      {
        source: "/tunnel/:path*",
        destination: "https://agui.indusnettechnologies.com/landing",
      },
      // {
      //   source: "/api/avatar/:path*",
      //   destination:
      //     "https://only4myrealme--musetalk-webrtc-server-serve.us-east.modal.run/:path*",
      // },
    ];
  },
};

// export default nextConfig;
export default async function config() {
  const { withSpatialReal } = await import("@spatialreal/web-sdk/next");
  return withSpatialReal(nextConfig);
}
