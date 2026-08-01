// Customer App — Sentry Client Config
// Dokumentasi: https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    // Tambahkan Sentry Tracing (performance monitoring)
    tracesSampleRate: 0.1,

    // Session Replay — rekam sesi user saat ada error
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    // Debug di development (matikan di production)
    debug: false,

    integrations: [
      Sentry.replayIntegration(),
    ],
  });
}

