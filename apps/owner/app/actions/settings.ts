"use server";

import { db, schema } from "@taj-saas/db";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getTenantSettingsAction() {
  try {
    const { tenant } = await requireTenantPermission("settings:read", { expectedApp: "owner" });
    const [tenantData] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, tenant.id))
      .limit(1);
    return { success: true, data: tenantData };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateTenantBrandingAction(brandingData: Record<string, unknown>) {
  try {
    const { tenant, user } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });

    // Safe merge with existing branding to avoid overwriting unedited keys (BUG-003)
    const [currentTenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, tenant.id))
      .limit(1);

    const mergedBranding = {
      ...(currentTenant?.branding || {}),
      ...brandingData,
    };

    const [updated] = await db
      .update(schema.tenants)
      .set({ branding: mergedBranding })
      .where(eq(schema.tenants.id, tenant.id))
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_tenant_branding",
      entityType: "tenants",
      entityId: tenant.id,
      details: { keysUpdated: Object.keys(brandingData) },
    });

    revalidatePath("/pengaturan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getAuditLogsAction() {
  try {
    const { tenant } = await requireTenantPermission("audit:read", { expectedApp: "owner" });
    const logs = await db
      .select()
      .from(schema.auditLogs)
      .where(eq(schema.auditLogs.tenantId, tenant.id))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(50);
    return { success: true, data: logs };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}
