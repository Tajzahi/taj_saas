import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@taj-saas/db";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET env var is required but not set. " +
    "Set a strong random 32+ character secret in your .env file."
  );
}

const rawBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const baseURL = (process.env.NODE_ENV === "production" && !rawBaseUrl.includes("localhost"))
  ? rawBaseUrl.replace(/^http:\/\//i, "https://")
  : rawBaseUrl;

const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
// Do NOT set custom cookie domain on Cloud Run staging (*.a.run.app) as browser rejects mismatching Domain attribute
const shouldEnableCrossDomain = Boolean(
  cookieDomain &&
  !cookieDomain.includes("localhost") &&
  !(process.env.K_SERVICE || process.env.CLOUD_RUN_JOB)
);

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://*.a.run.app",
    "https://*.run.app",
    "https://*.netlify.app",
    "https://*.vercel.app",
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "kasir",
        input: false,
      },
    },
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === "production",
    ...(shouldEnableCrossDomain ? {
      crossSubDomainCookies: {
        enabled: true,
        domain: cookieDomain
      }
    } : {})
  }
});
