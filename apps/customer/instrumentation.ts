// instrumentation.ts — dijalankan Next.js saat startup
// Ini yang menghubungkan Sentry ke server-side Next.js

export async function register() {
  if (process.env.NODE_ENV !== "production") return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}

export const onRequestError = async (
  err: unknown,
  request: any,
  context: any
) => {
  if (process.env.NODE_ENV !== "production") return;

  const { captureRequestError } = await import("@sentry/nextjs");
  captureRequestError(err, request as any, context as any);
};
