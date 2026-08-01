import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";

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
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // Resolve tenant slug dynamically from env or default to 'taj-saas'
            const tenantSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
            let tenantResult = await db
              .select()
              .from(schema.tenants)
              .where(eq(schema.tenants.slug, tenantSlug))
              .limit(1);

            let tenant = tenantResult[0];

            if (!tenant) {
              // Auto-create initial tenant if none exists
              const [newTenant] = await db
                .insert(schema.tenants)
                .values({
                  name: 'Martabak Terbul A6 Nyuss',
                  slug: tenantSlug,
                  domain: `${tenantSlug}.com`,
                  adminSubdomain: 'admin',
                  ownerSubdomain: 'owner',
                  packageType: 'enterprise',
                  isActive: true,
                })
                .returning();
              tenant = newTenant;
            }

            const tenantId = tenant.id;

            // Query if there are any existing profiles for this tenant
            const existingProfiles = await db
              .select()
              .from(schema.profiles)
              .where(eq(schema.profiles.tenantId, tenantId))
              .limit(1);

            // First user gets 'owner' role, subsequent users default to 'kasir'
            const role = existingProfiles.length === 0 ? 'owner' : 'kasir';

            // Insert matching profile row
            await db.insert(schema.profiles).values({
              id: user.id,
              tenantId,
              email: user.email,
              role,
            });

            // Update role on user table so Better Auth session reflects the role
            await db.update(schema.user).set({ role }).where(eq(schema.user.id, user.id));
          } catch (err) {
            console.error('[Better Auth Hook] Unexpected error during profile creation:', err);
          }
        }
      }
    }
  },
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.COOKIE_DOMAIN || ".localhost"
    }
  }
});
