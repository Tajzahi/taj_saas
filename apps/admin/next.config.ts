import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  transpilePackages: ["@taj-saas/db", "@taj-saas/shared", "@taj-saas/ui"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default process.env.NODE_ENV === "production"
  ? withSentryConfig(nextConfig, {
      org: "taj-saas",
      project: "taj-saas-admin",
      silent: !process.env.CI,
      widenClientFileUpload: true,
      tunnelRoute: "/monitoring",
    })
  : nextConfig;
