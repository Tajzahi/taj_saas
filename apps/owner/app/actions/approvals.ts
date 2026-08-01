"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTenantId } from "./_tenantHelper";

export async function getApprovalsAction() {
  try {
    const tenantId = await getTenantId();
    const list = await db.select().from(schema.approvals).where(eq(schema.approvals.tenantId, tenantId));
    return { success: true, data: list };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function approveRequestAction(id: string) {
  try {
    const tenantId = await getTenantId();
    const [updated] = await db.update(schema.approvals).set({
      status: "approved"
    }).where(and(eq(schema.approvals.id, id), eq(schema.approvals.tenantId, tenantId))).returning();
    revalidatePath("/persetujuan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function rejectRequestAction(id: string) {
  try {
    const tenantId = await getTenantId();
    const [updated] = await db.update(schema.approvals).set({
      status: "rejected"
    }).where(and(eq(schema.approvals.id, id), eq(schema.approvals.tenantId, tenantId))).returning();
    revalidatePath("/persetujuan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
