"use server";

import { db, schema } from "@taj-saas/db";
import { eq, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "@taj-saas/shared";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

// Strict Zod Allowlist for Tenant Branding / Settings (Point 14)
const TenantBrandingSchema = z.object({
  businessName: z.string().max(100).optional(),
  brandName: z.string().max(100).optional(),
  tagline: z.string().max(200).optional(),
  logoUrl: z.string().max(500).optional(),
  logo: z.string().max(500).optional(),
  primaryColor: z.string().max(50).optional(),
  secondaryColor: z.string().max(50).optional(),
  storeAddress: z.string().max(300).optional(),
  whatsappNumber: z.string().max(30).optional(),
  openingHours: z.string().max(100).optional(),
  taxRateBps: z.number().min(0).max(5000).optional(),
  serviceChargeRateBps: z.number().min(0).max(5000).optional(),
  flatDeliveryFee: z.number().min(0).max(1000000).optional(),
  cogsRate: z.number().min(0).max(1).optional(),
  receiptHeader: z.string().max(100).optional(),
  receiptFooter: z.string().max(200).optional(),
  storeOpen: z.boolean().optional(),
  qrisImageUrl: z.string().max(500).optional(),
  bankInfo: z.string().max(200).optional(),
  enableQris: z.boolean().optional(),
  enableBankTransfer: z.boolean().optional(),
  enableCash: z.boolean().optional(),
}).strict();

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

export async function updateTenantBrandingAction(
  brandingData: Record<string, unknown>,
  expectedVersion?: number
) {
  try {
    const { tenant, user } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });

    // Validate branding with strict allowlist (Point 14)
    const validatedData = TenantBrandingSchema.parse(brandingData);

    const [currentTenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, tenant.id))
      .limit(1);

    if (!currentTenant) {
      return { success: false, error: "Tenant tidak ditemukan." };
    }

    // Optimistic Concurrency Control with settingsVersion (Point 14)
    if (expectedVersion !== undefined && currentTenant.settingsVersion !== expectedVersion) {
      return {
        success: false,
        error: "Pengaturan telah diperbarui oleh pengguna lain. Silakan muat ulang halaman.",
      };
    }

    const mergedBranding = {
      ...(currentTenant.branding || {}),
      ...validatedData,
    };

    const nextVersion = (currentTenant.settingsVersion || 1) + 1;

    const [updated] = await db
      .update(schema.tenants)
      .set({
        branding: mergedBranding,
        settingsVersion: nextVersion,
      })
      .where(
        and(
          eq(schema.tenants.id, tenant.id),
          eq(schema.tenants.settingsVersion, currentTenant.settingsVersion)
        )
      )
      .returning();

    if (!updated) {
      return {
        success: false,
        error: "Konflik pembaruan pengaturan terdeteksi. Silakan coba lagi.",
      };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_tenant_branding",
      entityType: "tenants",
      entityId: tenant.id,
      details: { keysUpdated: Object.keys(validatedData), newVersion: nextVersion },
    });

    revalidatePath("/pengaturan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const issue = error.issues[0]?.message || "Format data pengaturan tidak valid.";
      return { success: false, error: issue };
    }
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
