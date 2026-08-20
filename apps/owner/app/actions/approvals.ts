/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTIONS PERSETUJUAN / APPROVALS
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini mengelola fungsi eksekusi backend untuk fitur Persetujuan Otorisasi Owner (`/persetujuan`).
 * Membaca daftar pengajuan, menyetujui (`approved`), menolak (`rejected`), dan menyetujui massal PO.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. GET APPROVALS (Baris 30-45)    : Ambil data pengajuan dari `schema.approvals` terfilter tenant.
 * 2. APPROVE / REJECT (Baris 47-110): Update status pengajuan di DB & catat log audit di `schema.auditLogs`.
 * 3. MASS APPROVE PO (Baris 112-140) : Update status semua PO pending milik tenant sekaligus.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Dikerjakan oleh Halaman UI: `apps/owner/app/(dashboard)/persetujuan/page.tsx`
 * - Skema Database          : `packages/db/schema.ts` (`schema.approvals`, `schema.auditLogs`)
 * =========================================================================================
 */

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

export async function approveAllPOAction() {
  try {
    const { tenant, user } = await requireTenantPermission("approvals:manage", { expectedApp: "owner" });

    const updatedList = await db
      .update(schema.approvals)
      .set({ status: "approved" })
      .where(
        and(
          eq(schema.approvals.tenantId, tenant.id),
          eq(schema.approvals.type, "purchase_order"),
          eq(schema.approvals.status, "pending")
        )
      )
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "approve_all_po",
      entityType: "approvals",
      entityId: tenant.id,
      details: { count: updatedList.length },
    });

    revalidatePath("/persetujuan");
    return { success: true, count: updatedList.length };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createApprovalAction(data: {
  type: "purchase_order" | "discount" | "refund" | "transfer";
  title: string;
  requestedBy: string;
  amount: number;
  priority?: "critical" | "high" | "medium" | "low";
  branchId?: string;
  notes?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("approvals:manage", { expectedApp: "owner" });

    const [newApproval] = await db
      .insert(schema.approvals)
      .values({
        tenantId: tenant.id,
        branchId: data.branchId || null,
        type: data.type,
        title: data.title.trim(),
        requestedBy: data.requestedBy.trim(),
        amount: String(data.amount),
        priority: data.priority || "medium",
        status: "pending",
        notes: data.notes?.trim() || null,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_approval",
      entityType: "approvals",
      entityId: newApproval.id,
      details: { title: data.title, amount: data.amount },
    });

    revalidatePath("/persetujuan");
    return { success: true, data: newApproval };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
