"use server";

import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

/**
 * Resolves the current tenant ID from the x-tenant-slug request header.
 * This header is set by the middleware after resolving the tenant from the hostname.
 * Throws an error if the tenant cannot be found (prevents cross-tenant data leakage).
 */
export async function getTenantId(): Promise<string> {
  const reqHeaders = await headers();
  const slug = reqHeaders.get("x-tenant-slug") || "taj-saas";
  const [tenant] = await db
    .select({ id: schema.tenants.id })
    .from(schema.tenants)
    .where(eq(schema.tenants.slug, slug))
    .limit(1);
  if (!tenant?.id) {
    throw new Error(`Tenant tidak ditemukan untuk slug: ${slug}`);
  }
  return tenant.id;
}

/**
 * Reads cogsRate from tenant branding JSON.
 * Falls back to 0.30 (30%) if not configured.
 */
export async function getCogsRate(tenantId: string): Promise<number> {
  const [tenant] = await db
    .select({ branding: schema.tenants.branding })
    .from(schema.tenants)
    .where(eq(schema.tenants.id, tenantId))
    .limit(1);
  const branding = tenant?.branding;
  const rate = typeof branding?.cogsRate === "number" ? branding.cogsRate : 0.30;
  return Math.min(Math.max(rate, 0.01), 0.99); // clamp between 1%–99%
}
