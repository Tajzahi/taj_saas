"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getProductionPlanAction() {
  try {
    const { tenant } = await requireTenantPermission("production:read", { expectedApp: "owner" });

    // Fetch menu items from database master
    const menus = await db.select().from(schema.menuItems).where(eq(schema.menuItems.tenantId, tenant.id));
    if (menus.length === 0) return { success: true, data: [] };

    // Fetch actual completed & paid order items
    const orderItems = await db
      .select({
        menuItemId: schema.orderItems.menuItemId,
        quantity: schema.orderItems.quantity,
      })
      .from(schema.orderItems)
      .innerJoin(
        schema.orders,
        and(
          eq(schema.orderItems.orderId, schema.orders.id),
          eq(schema.orders.tenantId, tenant.id),
          eq(schema.orders.status, "completed"),
          eq(schema.orders.paymentStatus, "paid")
        )
      );

    const qtyMap: Record<string, number> = {};
    orderItems.forEach((item) => {
      if (item.menuItemId) {
        qtyMap[item.menuItemId] = (qtyMap[item.menuItemId] || 0) + item.quantity;
      }
    });

    const result = menus
      .map((m) => {
        const producedQty = qtyMap[m.id] || 0;
        const targetQty = producedQty > 0 ? Math.round(producedQty * 1.15) : 0;
        const yieldPct = targetQty > 0 ? Number(((producedQty / targetQty) * 100).toFixed(1)) : 0;
        const variance = Number((yieldPct - 100).toFixed(1));
        let status = "on-track";
        if (targetQty === 0 && producedQty === 0) status = "on-track";
        else if (yieldPct < 85) status = "behind";
        else if (yieldPct > 102) status = "ahead";

        return {
          id: m.id,
          menu: m.name,
          targetQty,
          producedQty,
          yield: yieldPct,
          variance,
          status,
          aiSuggested: Math.round(targetQty * 1.1),
          cabang: "Semua Cabang",
        };
      })
      .filter((item) => item.producedQty > 0 || item.targetQty > 0);

    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function createProductionPlanItemAction(data: {
  menuName: string;
  targetQty: number;
  producedQty: number;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("production:manage", { expectedApp: "owner" });

    const trimmedName = data.menuName.trim();
    let [menu] = await db
      .select()
      .from(schema.menuItems)
      .where(and(eq(schema.menuItems.tenantId, tenant.id), eq(schema.menuItems.name, trimmedName)))
      .limit(1);

    if (!menu) {
      const slug = trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      [menu] = await db
        .insert(schema.menuItems)
        .values({
          tenantId: tenant.id,
          name: trimmedName,
          slug,
          price: "15000",
        })
        .returning();
    }

    const yieldPct = data.targetQty > 0 ? Number(((data.producedQty / data.targetQty) * 100).toFixed(1)) : 100;
    const variance = Number((yieldPct - 100).toFixed(1));
    let status = "on-track";
    if (yieldPct < 85) status = "behind";
    else if (yieldPct > 102) status = "ahead";

    const newItem = {
      id: menu.id,
      menu: menu.name,
      targetQty: data.targetQty,
      producedQty: data.producedQty,
      yield: yieldPct,
      variance,
      status,
      aiSuggested: Math.round(data.targetQty * 1.1),
      cabang: "Cabang Utama",
    };

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_production_plan_item",
      entityType: "production",
      entityId: menu.id,
      details: { menuName: trimmedName, targetQty: data.targetQty, producedQty: data.producedQty },
    });

    return { success: true, data: newItem };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
