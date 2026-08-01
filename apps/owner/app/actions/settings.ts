"use server";

import { db, schema } from "@taj-saas/db";
import { eq, desc } from "drizzle-orm";
import { getTenantId } from "./_tenantHelper";

export async function getTenantSettingsAction() {
  try {
    const tenantId = await getTenantId();
    const [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).limit(1);
    return { success: true, data: tenant };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateTenantBrandingAction(brandingData: Record<string, unknown>) {
  try {
    const tenantId = await getTenantId();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tenant] = await db.update(schema.tenants).set({ branding: brandingData as any }).where(eq(schema.tenants.id, tenantId)).returning();
    return { success: true, data: tenant };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getAuditLogsAction() {
  try {
    const tenantId = await getTenantId();
    const logs = await db.select().from(schema.auditLogs).where(eq(schema.auditLogs.tenantId, tenantId)).orderBy(desc(schema.auditLogs.createdAt)).limit(50);
    return { success: true, data: logs };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

