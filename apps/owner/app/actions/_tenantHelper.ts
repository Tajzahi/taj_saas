"use server";

import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import { requireTenantSession, requireTenantPermission, Permission } from "@lib/tenant-authorization";

/**
 * Resolves the authenticated tenant session for the Owner App.
 * Throws AuthorizationError if unauthorized or forbidden.
 */
export async function getTenantContext(requiredPermission?: Permission) {
  if (requiredPermission) {
    return await requireTenantPermission(requiredPermission, { expectedApp: "owner" });
  }
  return await requireTenantSession({ expectedApp: "owner" });
}

/**
 * Resolves the current tenant ID safely using the authenticated session.
 */
export async function getTenantId(): Promise<string> {
  const { tenant } = await getTenantContext();
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
