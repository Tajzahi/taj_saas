import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@taj-saas/db";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET || "e5f839f607d3ed02943930dbc2b0c850",
  emailAndPassword: { enabled: true },
  plugins: [
    dash(),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN || ".localhost"
    }
  }
});
