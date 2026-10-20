import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // The E2E instant() helper needs the testing API. Previews only: never in a user-facing production build.
    exposeTestingApiInProductionBuild: process.env.VERCEL_ENV === 'preview' || process.env.EXPOSE_TESTING_API === '1',
  },
  cacheComponents: true,
  images: {
    remotePatterns: [new URL('https://cdn.dummyjson.com/product-images/**')],
  },
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
