import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@taj-saas/db";

if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET env var is required but not set. " +
    "Set a strong random 32+ character secret in your .env file."
  );
}

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
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
    ...(process.env.COOKIE_DOMAIN ? {
      crossSubDomainCookies: {
        enabled: true,
        domain: process.env.COOKIE_DOMAIN
      }
    } : {})
  }
});
