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

export default withSentryConfig(nextConfig, {
  // Sentry org & project (dari dashboard)
  org: "taj-saas",
  project: "taj-saas-customer",

  // Hanya upload source maps saat build production
  silent: !process.env.CI,

  // Upload source maps ke Sentry untuk stack trace yang readable
  widenClientFileUpload: true,

  // Aktifkan React component annotations untuk UI debugging
  reactComponentAnnotation: {
    enabled: true,
  },

  // Routing instrumentation otomatis
  tunnelRoute: "/monitoring",

  // Tree shaking Sentry di client bundle
  disableLogger: true,

  // Auto instrumentation untuk Vercel Cron Monitors
  automaticVercelMonitors: true,
});
