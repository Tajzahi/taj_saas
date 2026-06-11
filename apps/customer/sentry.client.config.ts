// Customer App — Sentry Client Config
// Dokumentasi: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Tambahkan Sentry Tracing (performance monitoring)
  tracesSampleRate: 1.0,

  // Session Replay — rekam sesi user saat ada error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Debug di development (matikan di production)
  debug: process.env.NODE_ENV === "development",

  integrations: [
    Sentry.replayIntegration(),
  ],
});
