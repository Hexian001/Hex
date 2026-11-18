import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The dev server allows localhost. Also allow the same machine via 127.0.0.1
  // so client scripts are not rejected when the site is opened on that host.
  allowedDevOrigins: ["127.0.0.1"],
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
};

export default nextConfig;
