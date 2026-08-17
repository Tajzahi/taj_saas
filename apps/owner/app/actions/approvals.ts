"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getApprovalsAction() {
  try {
    const { tenant } = await requireTenantPermission("approvals:read", { expectedApp: "owner" });
    const list = await db.select().from(schema.approvals).where(eq(schema.approvals.tenantId, tenant.id));
    return { success: true, data: list };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function approveRequestAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("approvals:manage", { expectedApp: "owner" });

    const [updated] = await db
      .update(schema.approvals)
      .set({ status: "approved" })
      .where(and(eq(schema.approvals.id, id), eq(schema.approvals.tenantId, tenant.id)))
      .returning();

    if (!updated) {
      return { success: false, error: "Permintaan persetujuan tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "approve_request",
      entityType: "approvals",
      entityId: id,
    });

    revalidatePath("/persetujuan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function rejectRequestAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("approvals:manage", { expectedApp: "owner" });

    const [updated] = await db
      .update(schema.approvals)
      .set({ status: "rejected" })
      .where(and(eq(schema.approvals.id, id), eq(schema.approvals.tenantId, tenant.id)))
      .returning();

    if (!updated) {
      return { success: false, error: "Permintaan persetujuan tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "reject_request",
      entityType: "approvals",
      entityId: id,
    });

    revalidatePath("/persetujuan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
