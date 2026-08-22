"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getProductionPlanAction(branchId?: string, dateStr?: string) {
  try {
    const { tenant } = await requireTenantPermission("production:read", { expectedApp: "owner" });
    const todayStr = dateStr || new Date().toISOString().split("T")[0];

    const planConditions = [
      eq(schema.productionPlans.tenantId, tenant.id),
      eq(schema.productionPlans.planDate, todayStr),
    ];
    if (branchId && branchId.trim() && branchId !== "all") {
      planConditions.push(eq(schema.productionPlans.branchId, branchId.trim()));
    }

    // 1. Fetch existing production plan parent for this date
    const existingPlans = await db
      .select({
        id: schema.productionPlans.id,
        tenantId: schema.productionPlans.tenantId,
        branchId: schema.productionPlans.branchId,
        planDate: schema.productionPlans.planDate,
        status: schema.productionPlans.status,
        notes: schema.productionPlans.notes,
        branchName: schema.branches.name,
      })
      .from(schema.productionPlans)
      .leftJoin(
        schema.branches,
        and(
          eq(schema.productionPlans.branchId, schema.branches.id),
          eq(schema.branches.tenantId, tenant.id)
        )
      )
      .where(and(...planConditions))
      .limit(1);

    let plan = existingPlans[0];

    // 2. If no plan exists for today, auto-seed with tenant's menu items
    if (!plan) {
      const menus = await db
        .select()
        .from(schema.menuItems)
        .where(eq(schema.menuItems.tenantId, tenant.id))
        .limit(10);

      const branchVal = branchId && branchId !== "all" ? branchId : null;
      const [newPlan] = await db
        .insert(schema.productionPlans)
        .values({
          tenantId: tenant.id,
          branchId: branchVal,
          planDate: todayStr,
          status: "in_progress",
          notes: `Rencana Produksi Dapur Harian - ${todayStr}`,
        })
        .returning();

      plan = {
        ...newPlan,
        branchName: "Cabang Utama",
      };

      if (menus.length > 0) {
        const itemValues = menus.map(m => ({
          planId: newPlan.id,
          menuItemId: m.id,
          targetQuantity: 30,
          actualQuantity: 0,
          status: "pending",
        }));
        await db.insert(schema.productionPlanItems).values(itemValues);
      }
    }

    // 3. Fetch production plan items joined with menuItems
    const items = await db
      .select({
        id: schema.productionPlanItems.id,
        planId: schema.productionPlanItems.planId,
        menuItemId: schema.productionPlanItems.menuItemId,
        targetQuantity: schema.productionPlanItems.targetQuantity,
        actualQuantity: schema.productionPlanItems.actualQuantity,
        itemStatus: schema.productionPlanItems.status,
        menuName: schema.menuItems.name,
        menuPrice: schema.menuItems.price,
      })
      .from(schema.productionPlanItems)
      .leftJoin(
        schema.menuItems,
        and(
          eq(schema.productionPlanItems.menuItemId, schema.menuItems.id),
          eq(schema.menuItems.tenantId, tenant.id)
        )
      )
      .where(eq(schema.productionPlanItems.planId, plan.id));

    const formatted = items.map(item => {
      const targetQty = item.targetQuantity || 0;
      const producedQty = item.actualQuantity || 0;
      const yieldPct = targetQty > 0 ? Number(((producedQty / targetQty) * 100).toFixed(1)) : (producedQty > 0 ? 100 : 0);
      const variance = Number((yieldPct - 100).toFixed(1));

      let autoStatus = "on-track";
      if (targetQty === 0 && producedQty === 0) autoStatus = "on-track";
      else if (yieldPct < 85) autoStatus = "behind";
      else if (yieldPct > 102) autoStatus = "ahead";

      return {
        id: item.id,
        planId: item.planId,
        menuItemId: item.menuItemId,
        menu: item.menuName || "Menu Masakan",
        targetQty,
        producedQty,
        yield: yieldPct,
        variance,
        status: autoStatus,
        aiSuggested: Math.round(targetQty * 1.1) || 35,
        cabang: plan.branchName || "Cabang Utama",
        branchId: plan.branchId,
        notes: plan.notes || "",
      };
    });

    return { success: true, data: formatted };
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
  branchId?: string;
  date?: string;
  notes?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("production:manage", { expectedApp: "owner" });

    const trimmedName = data.menuName.trim();
    if (!trimmedName) {
      return { success: false, error: "Nama menu rencana produksi tidak boleh kosong." };
    }

    const todayStr = data.date || new Date().toISOString().split("T")[0];

    // 1. Get or create parent plan
    const planConditions = [
      eq(schema.productionPlans.tenantId, tenant.id),
      eq(schema.productionPlans.planDate, todayStr),
    ];
    if (data.branchId && data.branchId !== "all") {
      planConditions.push(eq(schema.productionPlans.branchId, data.branchId));
    }

    let [plan] = await db
      .select()
      .from(schema.productionPlans)
      .where(and(...planConditions))
      .limit(1);

    if (!plan) {
      const [newPlan] = await db
        .insert(schema.productionPlans)
        .values({
          tenantId: tenant.id,
          branchId: data.branchId && data.branchId !== "all" ? data.branchId : null,
          planDate: todayStr,
          status: "in_progress",
          notes: data.notes || `Rencana Produksi Dapur Harian - ${todayStr}`,
        })
        .returning();
      plan = newPlan;
    }

    // 2. Get or create menu item
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

    // 3. Insert plan item
    const targetQuantity = Math.max(1, Number(data.targetQty) || 1);
    const actualQuantity = Math.max(0, Number(data.producedQty) || 0);

    const [newItem] = await db
      .insert(schema.productionPlanItems)
      .values({
        planId: plan.id,
        menuItemId: menu.id,
        targetQuantity,
        actualQuantity,
        status: actualQuantity >= targetQuantity ? "completed" : "pending",
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_production_plan_item",
      entityType: "production_plan_items",
      entityId: newItem.id,
      details: { menuName: trimmedName, targetQuantity, actualQuantity },
    });

    revalidatePath("/produksi");
    return { success: true, data: newItem };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateProductionPlanItemAction(
  id: string,
  data: {
    targetQty: number;
    producedQty: number;
    notes?: string;
  }
) {
  try {
    const { tenant, user } = await requireTenantPermission("production:manage", { expectedApp: "owner" });

    const targetQuantity = Math.max(1, Number(data.targetQty) || 1);
    const actualQuantity = Math.max(0, Number(data.producedQty) || 0);

    const [updated] = await db
      .update(schema.productionPlanItems)
      .set({
        targetQuantity,
        actualQuantity,
        status: actualQuantity >= targetQuantity ? "completed" : "pending",
      })
      .where(eq(schema.productionPlanItems.id, id))
      .returning();

    if (!updated) {
      return { success: false, error: "Item rencana produksi tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_production_plan_item",
      entityType: "production_plan_items",
      entityId: id,
      details: { targetQuantity, actualQuantity },
    });

    revalidatePath("/produksi");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteProductionPlanItemAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("production:manage", { expectedApp: "owner" });

    await db
      .delete(schema.productionPlanItems)
      .where(eq(schema.productionPlanItems.id, id));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_production_plan_item",
      entityType: "production_plan_items",
      entityId: id,
    });

    revalidatePath("/produksi");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function executeProductionDeductionAction(planItemId: string) {
  try {
    const { tenant, user } = await requireTenantPermission("production:manage", { expectedApp: "owner" });

    // 1. Fetch the production plan item
    const [item] = await db
      .select({
        id: schema.productionPlanItems.id,
        planId: schema.productionPlanItems.planId,
        menuItemId: schema.productionPlanItems.menuItemId,
        targetQuantity: schema.productionPlanItems.targetQuantity,
        actualQuantity: schema.productionPlanItems.actualQuantity,
        menuName: schema.menuItems.name,
        branchId: schema.productionPlans.branchId,
      })
      .from(schema.productionPlanItems)
      .innerJoin(schema.productionPlans, eq(schema.productionPlanItems.planId, schema.productionPlans.id))
      .leftJoin(schema.menuItems, eq(schema.productionPlanItems.menuItemId, schema.menuItems.id))
      .where(
        and(
          eq(schema.productionPlanItems.id, planItemId),
          eq(schema.productionPlans.tenantId, tenant.id)
        )
      )
      .limit(1);

    if (!item) {
      return { success: false, error: "Item rencana produksi tidak ditemukan." };
    }

    if (item.actualQuantity <= 0) {
      return { success: false, error: "Jumlah aktual diproduksi masih 0 pcs. Masukkan jumlah produksi sebelum potong stok." };
    }

    // 2. Find Recipe (BOM)
    let recipeIngredientsList: any[] = [];
    if (item.menuItemId) {
      const [recipe] = await db
        .select()
        .from(schema.recipes)
        .where(and(eq(schema.recipes.menuItemId, item.menuItemId), eq(schema.recipes.tenantId, tenant.id)))
        .limit(1);

      if (recipe) {
        recipeIngredientsList = await db
          .select()
          .from(schema.recipeIngredients)
          .where(eq(schema.recipeIngredients.recipeId, recipe.id));
      }
    }

    if (recipeIngredientsList.length === 0) {
      return { 
        success: false, 
        error: `Menu "${item.menuName || "Item"}" belum memiliki Resep (BOM). Silakan atur resep terlebih dahulu di halaman Menu.` 
      };
    }

    // 3. Deduct each ingredient from inventory
    const deductedItems: Array<{ name: string; deductQty: number; unit: string; newStock: number }> = [];

    for (const ing of recipeIngredientsList) {
      const totalDeduct = parseFloat(ing.quantity) * item.actualQuantity;

      // Find inventory item by ingredient name (case-insensitive)
      const invItems = await db
        .select()
        .from(schema.inventory)
        .where(
          and(
            eq(schema.inventory.tenantId, tenant.id),
            sql`LOWER(${schema.inventory.name}) = LOWER(${ing.ingredientName})`
          )
        )
        .limit(1);

      const inv = invItems[0];
      if (inv) {
        const currentStock = parseFloat(inv.stock);
        const newStock = Math.max(0, currentStock - totalDeduct);

        await db
          .update(schema.inventory)
          .set({
            stock: newStock.toString(),
            updatedAt: new Date(),
          })
          .where(and(eq(schema.inventory.id, inv.id), eq(schema.inventory.tenantId, tenant.id)));

        // Record inventory transaction
        await db.insert(schema.inventoryTransactions).values({
          tenantId: tenant.id,
          inventoryId: inv.id,
          branchId: item.branchId || null,
          type: "production",
          quantity: totalDeduct.toString(),
          cost: (parseFloat(inv.cost) * totalDeduct).toString(),
          reason: `Batch Produksi: ${item.menuName} (${item.actualQuantity} pcs)`,
          operatorName: user.name || "Dapur",
        });

        deductedItems.push({
          name: inv.name,
          deductQty: totalDeduct,
          unit: inv.unit,
          newStock,
        });
      }
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "execute_production_deduction",
      entityType: "production_plan_items",
      entityId: item.id,
      details: { menuName: item.menuName, actualQuantity: item.actualQuantity, deductedCount: deductedItems.length },
    });

    revalidatePath("/produksi");
    revalidatePath("/persediaan");
    return { 
      success: true, 
      data: { 
        menuName: item.menuName, 
        producedQty: item.actualQuantity, 
        deductedItems 
      } 
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
