"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTenantId } from "./_tenantHelper";

export async function getInventoryAction() {
  try {
    const tenantId = await getTenantId();
    const items = await db.select().from(schema.inventory).where(eq(schema.inventory.tenantId, tenantId));
    return { success: true, data: items };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getInventoryTransactionsAction() {
  try {
    const tenantId = await getTenantId();
    const transactions = await db.select().from(schema.inventoryTransactions).where(eq(schema.inventoryTransactions.tenantId, tenantId));
    return { success: true, data: transactions };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getWasteLogsAction() {
  try {
    const tenantId = await getTenantId();
    const logs = await db
      .select({
        id: schema.inventoryTransactions.id,
        quantity: schema.inventoryTransactions.quantity,
        cost: schema.inventoryTransactions.cost,
        reason: schema.inventoryTransactions.reason,
        createdAt: schema.inventoryTransactions.createdAt,
        operatorName: schema.inventoryTransactions.operatorName,
        inventoryName: schema.inventory.name,
        inventoryUnit: schema.inventory.unit,
        branchName: schema.branches.name,
      })
      .from(schema.inventoryTransactions)
      .leftJoin(schema.inventory, eq(schema.inventoryTransactions.inventoryId, schema.inventory.id))
      .leftJoin(schema.branches, eq(schema.inventoryTransactions.branchId, schema.branches.id))
      .where(
        and(
          eq(schema.inventoryTransactions.tenantId, tenantId),
          eq(schema.inventoryTransactions.type, "waste")
        )
      );

    const formatted = logs.map(l => ({
      id: l.id,
      date: new Date(l.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      item: l.inventoryName || "Bahan Terbuang",
      qty: Number(l.quantity) || 0,
      unit: l.inventoryUnit || "kg",
      reason: l.reason || "Waste / Expired",
      cost: Number(l.cost) || 0,
      cabang: l.branchName || "Cabang Demak",
    }));

    return { success: true, data: formatted };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function createInventoryItemAction(data: any) {
  try {
    const tenantId = await getTenantId();
    const [item] = await db.insert(schema.inventory).values({ tenantId, ...data }).returning();
    revalidatePath("/persediaan");
    return { success: true, data: item };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createWasteLogAction(data: {
  inventoryId: string;
  branchId: string;
  quantity: number;
  cost: number;
  reason: string;
  operatorName: string;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    const [tx] = await db.insert(schema.inventoryTransactions).values({
      tenantId,
      inventoryId: data.inventoryId,
      branchId: data.branchId,
      type: "waste",
      quantity: data.quantity.toString(),
      cost: data.cost.toString(),
      reason: data.reason,
      operatorName: data.operatorName,
    }).returning();

    // Deduct stock from main inventory item
    const [invItem] = await db.select().from(schema.inventory).where(eq(schema.inventory.id, data.inventoryId)).limit(1);
    if (invItem) {
      const currentStock = parseFloat(invItem.stock);
      const newStock = Math.max(0, currentStock - data.quantity);
      await db.update(schema.inventory).set({
        stock: newStock.toString()
      }).where(eq(schema.inventory.id, data.inventoryId));
    }

    revalidatePath("/persediaan");
    return { success: true, data: tx };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
