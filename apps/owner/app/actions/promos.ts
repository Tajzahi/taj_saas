"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getPromosAction() {
  try {
    const { tenant } = await requireTenantPermission("settings:read", { expectedApp: "owner" });

    const promoList = await db
      .select()
      .from(schema.promos)
      .where(eq(schema.promos.tenantId, tenant.id))
      .orderBy(desc(schema.promos.createdAt));

    return { success: true, data: promoList };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createPromoAction(data: {
  code: string;
  type: "percent" | "fixed";
  value: number;
  minOrder?: number;
  targetCategory?: string;
  expiresAt?: string | null;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });

    const cleanCode = data.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");
    if (!cleanCode) {
      return { success: false, error: "Kode promo tidak boleh kosong." };
    }

    if (data.value <= 0) {
      return { success: false, error: "Nilai potongan diskon harus lebih dari 0." };
    }

    if (data.type === "percent" && data.value > 100) {
      return { success: false, error: "Diskon persentase tidak boleh lebih dari 100%." };
    }

    // Check duplicate code within tenant
    const existing = await db
      .select()
      .from(schema.promos)
      .where(and(eq(schema.promos.tenantId, tenant.id), eq(schema.promos.code, cleanCode)))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: `Kode promo '${cleanCode}' sudah ada. Gunakan kode lain.` };
    }

    const [inserted] = await db
      .insert(schema.promos)
      .values({
        tenantId: tenant.id,
        code: cleanCode,
        type: data.type,
        value: String(data.value),
        minOrder: String(Math.max(0, Number(data.minOrder) || 0)),
        targetCategory: data.targetCategory || "all",
        isActive: true,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_promo",
      entityType: "promos",
      entityId: inserted.id,
      details: { code: cleanCode, type: data.type, value: data.value },
    });

    revalidatePath("/promo");
    return { success: true, data: inserted };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function togglePromoStatusAction(id: string, isActive: boolean) {
  try {
    const { tenant, user } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });

    const [updated] = await db
      .update(schema.promos)
      .set({ isActive })
      .where(and(eq(schema.promos.id, id), eq(schema.promos.tenantId, tenant.id)))
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "toggle_promo_status",
      entityType: "promos",
      entityId: id,
      details: { isActive },
    });

    revalidatePath("/promo");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deletePromoAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });

    await db
      .delete(schema.promos)
      .where(and(eq(schema.promos.id, id), eq(schema.promos.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_promo",
      entityType: "promos",
      entityId: id,
      details: { deleted: true },
    });

    revalidatePath("/promo");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
