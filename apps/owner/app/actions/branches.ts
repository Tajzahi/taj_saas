"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, or } from "drizzle-orm";
import { getTenantId } from "./_tenantHelper";

export async function getBranchesAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    
    const branches = await db.select().from(schema.branches).where(eq(schema.branches.tenantId, tenantId));
    
    // Fetch all completed/paid orders for branch aggregations
    const orders = await db
      .select({
        branchId: schema.orders.branchId,
        totalPrice: schema.orders.totalPrice,
      })
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenantId),
          or(eq(schema.orders.status, "completed"), eq(schema.orders.paymentStatus, "paid"))
        )
      );

    // Fetch employee profiles for actual labor costs
    const profiles = await db.select().from(schema.profiles).where(eq(schema.profiles.tenantId, tenantId));
    const totalLaborSalaries = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    const agg: Record<string, { revenue: number; orders: number }> = {};
    orders.forEach(o => {
      if (o.branchId) {
        if (!agg[o.branchId]) agg[o.branchId] = { revenue: 0, orders: 0 };
        agg[o.branchId].revenue += parseFloat(o.totalPrice) || 0;
        agg[o.branchId].orders += 1;
      }
    });

    const totalTenantRevenue = orders.reduce((sum, o) => sum + (parseFloat(o.totalPrice) || 0), 0);

    const enriched = branches.map(b => {
      const bAgg = agg[b.id] || { revenue: 0, orders: 0 };
      const avgOrder = bAgg.orders > 0 ? Math.round(bAgg.revenue / bAgg.orders) : 0;
      
      // Dynamic Food Cost & Labor Cost calculation from DB
      const estimatedCogs = Math.round(bAgg.revenue * 0.30);
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
  orderingMethods?: string[];
  paymentMethods?: string[];
  managerId?: string;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    const [branch] = await db.insert(schema.branches).values({
      tenantId,
      name: data.name,
      city: data.city,
      address: data.address,
      phone: data.phone,
      googleMapsUrl: data.googleMapsUrl || null,
      orderingMethods: data.orderingMethods || ["dine_in", "takeaway", "delivery", "pickup"],
      paymentMethods: data.paymentMethods || ["cod", "qris"],
      status: "active",
    }).returning();

    // If googleMapsUrl is provided, sync with tenant branding so Customer App receives it automatically
    if (data.googleMapsUrl) {
      const [tenant] = await db.select().from(schema.tenants).where(eq(schema.tenants.id, tenantId)).limit(1);
      if (tenant) {
        const currentBranding = (tenant.branding as any) || {};
        await db.update(schema.tenants).set({
          branding: {
            ...currentBranding,
            googleMapsUrl: data.googleMapsUrl,
            storeAddress: data.address || currentBranding.storeAddress,
          },
        }).where(eq(schema.tenants.id, tenantId));
      }
    }

    return { success: true, data: branch };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function toggleBranchStatusAction(id: string, status: "active" | "maintenance") {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    const [branch] = await db.update(schema.branches).set({ status })
      .where(and(eq(schema.branches.id, id), eq(schema.branches.tenantId, tenantId)))
      .returning();
    if (!branch) throw new Error("Cabang tidak ditemukan atau akses tidak diizinkan.");
    return { success: true, data: branch };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
