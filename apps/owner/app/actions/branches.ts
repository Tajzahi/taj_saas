/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTIONS MANAJEMEN CABANG (BRANCHES ACTIONS)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini mengelola operasi data backend untuk Manajemen Cabang Toko (`/cabang`).
 * Membaca daftar cabang ter-enrich dengan omzet real, mendaftarkan cabang baru, mengedit data,
 * mengaktifkan/non-aktifkan status cabang (*Active / Maintenance*), serta menghapus cabang.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. GET BRANCHES (Baris 30-75)   : Ambil daftar cabang + aggregasi omzet real dari `schema.orders`.
 * 2. CREATE BRANCH (Baris 80-150)  : Mendaftarkan cabang baru & set status `active` di `schema.branches`.
 * 3. UPDATE / TOGGLE (155-255)    : Update profil cabang atau ubah status ke `maintenance` + audit log.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Halaman Client UI: `apps/owner/app/(dashboard)/cabang/page.tsx`
 * - Skema Database  : `packages/db/schema.ts` (`schema.branches`, `schema.orders`, `schema.auditLogs`)
 * =========================================================================================
 */

"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getBranchesAction() {
  try {
    const { tenant } = await requireTenantPermission("branches:read", { expectedApp: "owner" });

    const branches = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenant.id));

    // Fetch completed and paid orders for branch revenue aggregations
    const orders = await db
      .select({
        branchId: schema.orders.branchId,
        totalPrice: schema.orders.totalPrice,
      })
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenant.id),
          eq(schema.orders.status, "completed"),
          eq(schema.orders.paymentStatus, "paid")
        )
      );

    // Fetch employee profiles for actual labor costs
    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.tenantId, tenant.id));
    const totalLaborSalaries = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    const agg: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach((o) => {
      if (o.branchId) {
        if (!agg[o.branchId]) agg[o.branchId] = { revenue: 0, orders: 0 };
        agg[o.branchId].revenue += parseFloat(o.totalPrice) || 0;
        agg[o.branchId].orders += 1;
      }
    });

    const enriched = branches.map((b) => {
      const bAgg = agg[b.id] || { revenue: 0, orders: 0 };
      const avgOrder = bAgg.orders > 0 ? Math.round(bAgg.revenue / bAgg.orders) : 0;

      const cogsRate = Number(tenant.branding?.cogsRate || 0);
      const estimatedCogs = Math.round(bAgg.revenue * cogsRate);
      const foodCostPct = bAgg.revenue > 0 ? Number(((estimatedCogs / bAgg.revenue) * 100).toFixed(1)) : 0;
      const branchLaborShare = branches.length > 0 ? totalLaborSalaries / branches.length : 0;
      const laborCostPct = bAgg.revenue > 0 ? Number(((branchLaborShare / bAgg.revenue) * 100).toFixed(1)) : 0;

      return {
        ...b,
        revenue: Math.round(bAgg.revenue),
        orders: bAgg.orders,
        avgOrder,
        foodCost: foodCostPct,
        laborCost: laborCostPct,
      };
    });

    return { success: true, data: enriched };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createBranchAction(data: {
  name: string;
  city: string;
  address: string;
  phone: string;
  googleMapsUrl?: string;
  operationalHours?: string;
  outletLat?: number;
  outletLng?: number;
  isPrimary?: boolean;
  acceptsOnlineOrders?: boolean;
  deliveryZones?: { maxDistanceKm: number; baseFee: number; perKmFee: number }[];
  orderingMethods?: string[];
  paymentMethods?: string[];
  managerId?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("branches:manage", { expectedApp: "owner" });

    const trimmedName = data.name.trim();
    if (!trimmedName) {
      return { success: false, error: "Nama cabang tidak boleh kosong." };
    }

    const branch = await db.transaction(async (tx) => {
      if (data.isPrimary) {
        await tx
          .update(schema.branches)
          .set({ isPrimary: false })
          .where(eq(schema.branches.tenantId, tenant.id));
      }

      const [newBranch] = await tx
        .insert(schema.branches)
        .values({
          tenantId: tenant.id,
          name: trimmedName,
          city: data.city.trim(),
          address: data.address.trim(),
          phone: data.phone.trim(),
          googleMapsUrl: data.googleMapsUrl || null,
          operationalHours: data.operationalHours || "08:00 - 22:00",
          outletLat: data.outletLat ? String(data.outletLat) : null,
          outletLng: data.outletLng ? String(data.outletLng) : null,
          isPrimary: data.isPrimary ?? false,
          acceptsOnlineOrders: data.acceptsOnlineOrders ?? true,
          deliveryZones: data.deliveryZones || null,
          orderingMethods: data.orderingMethods || ["dine_in", "takeaway", "delivery", "pickup"],
          paymentMethods: data.paymentMethods || ["cod", "qris"],
          status: "active",
        })
        .returning();

      return newBranch;
    });

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_branch",
      entityType: "branches",
      entityId: branch.id,
      details: { name: trimmedName, city: data.city, isPrimary: data.isPrimary },
    });

    revalidatePath("/cabang");
    return { success: true, data: branch };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateBranchAction(
  id: string,
  data: {
    name?: string;
    city?: string;
    address?: string;
    phone?: string;
    googleMapsUrl?: string;
    operationalHours?: string;
    outletLat?: number;
    outletLng?: number;
    isPrimary?: boolean;
    acceptsOnlineOrders?: boolean;
    deliveryZones?: { maxDistanceKm: number; baseFee: number; perKmFee: number }[];
    orderingMethods?: string[];
    paymentMethods?: string[];
    status?: "active" | "maintenance";
  }
) {
  try {
    const { tenant, user } = await requireTenantPermission("branches:manage", { expectedApp: "owner" });

    const branch = await db.transaction(async (tx) => {
      if (data.isPrimary) {
        await tx
          .update(schema.branches)
          .set({ isPrimary: false })
          .where(eq(schema.branches.tenantId, tenant.id));
      }

      const [updatedBranch] = await tx
        .update(schema.branches)
        .set({
          ...(data.name ? { name: data.name.trim() } : {}),
          ...(data.city ? { city: data.city.trim() } : {}),
          ...(data.address ? { address: data.address.trim() } : {}),
          ...(data.phone ? { phone: data.phone.trim() } : {}),
          ...(data.googleMapsUrl !== undefined ? { googleMapsUrl: data.googleMapsUrl } : {}),
          ...(data.operationalHours !== undefined ? { operationalHours: data.operationalHours } : {}),
          ...(data.outletLat !== undefined ? { outletLat: data.outletLat ? String(data.outletLat) : null } : {}),
          ...(data.outletLng !== undefined ? { outletLng: data.outletLng ? String(data.outletLng) : null } : {}),
          ...(data.isPrimary !== undefined ? { isPrimary: data.isPrimary } : {}),
          ...(data.acceptsOnlineOrders !== undefined ? { acceptsOnlineOrders: data.acceptsOnlineOrders } : {}),
          ...(data.deliveryZones !== undefined ? { deliveryZones: data.deliveryZones } : {}),
          ...(data.orderingMethods !== undefined ? { orderingMethods: data.orderingMethods } : {}),
          ...(data.paymentMethods !== undefined ? { paymentMethods: data.paymentMethods } : {}),
          ...(data.status ? { status: data.status } : {}),
          updatedAt: new Date(),
        })
        .where(and(eq(schema.branches.id, id), eq(schema.branches.tenantId, tenant.id)))
        .returning();

      return updatedBranch;
    });

    if (!branch) {
      return { success: false, error: "Cabang tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_branch",
      entityType: "branches",
      entityId: id,
      details: data,
    });

    revalidatePath("/cabang");
    return { success: true, data: branch };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteBranchAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("branches:manage", { expectedApp: "owner" });

    await db
      .delete(schema.branches)
      .where(and(eq(schema.branches.id, id), eq(schema.branches.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_branch",
      entityType: "branches",
      entityId: id,
    });

    revalidatePath("/cabang");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function toggleBranchStatusAction(id: string, status: "active" | "maintenance") {
  return await updateBranchAction(id, { status });
}
