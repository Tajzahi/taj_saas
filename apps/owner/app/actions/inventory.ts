"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

export async function getInventoryAction(branchId?: string) {
  try {
    const { tenant } = await requireTenantPermission("inventory:read", { expectedApp: "owner" });
    const conditions = [eq(schema.inventory.tenantId, tenant.id)];
    if (branchId && branchId.trim() && branchId !== "all") {
      conditions.push(eq(schema.inventory.branchId, branchId.trim()));
    }

    const items = await db
      .select({
        id: schema.inventory.id,
        tenantId: schema.inventory.tenantId,
        branchId: schema.inventory.branchId,
        name: schema.inventory.name,
        category: schema.inventory.category,
        stock: schema.inventory.stock,
        minStock: schema.inventory.minStock,
        unit: schema.inventory.unit,
        cost: schema.inventory.cost,
        supplier: schema.inventory.supplier,
        expiryDate: schema.inventory.expiryDate,
        createdAt: schema.inventory.createdAt,
        updatedAt: schema.inventory.updatedAt,
        branchName: schema.branches.name,
      })
      .from(schema.inventory)
      .leftJoin(
        schema.branches,
        and(
          eq(schema.inventory.branchId, schema.branches.id),
          eq(schema.branches.tenantId, tenant.id)
        )
      )
      .where(and(...conditions));
    return { success: true, data: items };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getInventoryTransactionsAction() {
  try {
    const { tenant } = await requireTenantPermission("inventory:read", { expectedApp: "owner" });
    const transactions = await db
      .select()
      .from(schema.inventoryTransactions)
      .where(eq(schema.inventoryTransactions.tenantId, tenant.id));
    return { success: true, data: transactions };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getWasteLogsAction(branchId?: string) {
  try {
    const { tenant } = await requireTenantPermission("inventory:read", { expectedApp: "owner" });
    const conditions = [
      eq(schema.inventoryTransactions.tenantId, tenant.id),
      eq(schema.inventoryTransactions.type, "waste")
    ];
    if (branchId && branchId.trim() && branchId !== "all") {
      conditions.push(eq(schema.inventoryTransactions.branchId, branchId.trim()));
    }

    const logs = await db
      .select({
        id: schema.inventoryTransactions.id,
        branchId: schema.inventoryTransactions.branchId,
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
      .leftJoin(
        schema.inventory,
        and(
          eq(schema.inventoryTransactions.inventoryId, schema.inventory.id),
          eq(schema.inventory.tenantId, tenant.id)
        )
      )
      .leftJoin(
        schema.branches,
        and(
          eq(schema.inventoryTransactions.branchId, schema.branches.id),
          eq(schema.branches.tenantId, tenant.id)
        )
      )
      .where(and(...conditions));

    const formatted = logs.map((l) => ({
      id: l.id,
      branchId: l.branchId,
      date: new Date(l.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" }),
      item: l.inventoryName || "Bahan Terbuang",
      qty: Number(l.quantity) || 0,
      unit: l.inventoryUnit || "kg",
      reason: l.reason || "Waste / Expired",
      cost: Number(l.cost) || 0,
      cabang: l.branchName || "Cabang Utama",
    }));

    return { success: true, data: formatted };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function createInventoryItemAction(data: {
  name: string;
  category?: string;
  unit: string;
  stock: number;
  minStock?: number;
  cost?: number;
  costPerUnit?: number;
  supplier?: string;
  expiryDate?: string | Date | null;
  branchId?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("inventory:manage", { expectedApp: "owner" });

    const trimmedName = (data.name || "").trim();
    if (!trimmedName) {
      return { success: false, error: "Nama barang inventaris tidak boleh kosong." };
    }

    const expDate = data.expiryDate ? new Date(data.expiryDate) : null;

    const [item] = await db
      .insert(schema.inventory)
      .values({
        tenantId: tenant.id,
        branchId: data.branchId || null,
        name: trimmedName,
        category: data.category || "Bahan Baku",
        unit: (data.unit || "pcs").trim(),
        stock: String(Math.max(0, Number(data.stock) || 0)),
        minStock: String(Math.max(0, Number(data.minStock) || 0)),
        cost: String(Math.max(0, Number(data.cost ?? data.costPerUnit) || 0)),
        supplier: data.supplier || null,
        expiryDate: expDate && !isNaN(expDate.getTime()) ? expDate : null,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_inventory_item",
      entityType: "inventory",
      entityId: item.id,
      details: { name: trimmedName, stock: data.stock },
    });

    revalidatePath("/persediaan");
    return { success: true, data: item };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateInventoryItemAction(
  id: string,
  data: {
    name: string;
    category?: string;
    unit: string;
    stock: number;
    minStock?: number;
    cost?: number;
    supplier?: string;
    expiryDate?: string | Date | null;
    branchId?: string;
  }
) {
  try {
    const { tenant, user } = await requireTenantPermission("inventory:manage", { expectedApp: "owner" });

    const trimmedName = (data.name || "").trim();
    if (!trimmedName) {
      return { success: false, error: "Nama barang inventaris tidak boleh kosong." };
    }

    const expDate = data.expiryDate ? new Date(data.expiryDate) : null;

    const [updated] = await db
      .update(schema.inventory)
      .set({
        branchId: data.branchId || null,
        name: trimmedName,
        category: data.category || "Bahan Baku",
        unit: (data.unit || "pcs").trim(),
        stock: String(Math.max(0, Number(data.stock) || 0)),
        minStock: String(Math.max(0, Number(data.minStock) || 0)),
        cost: String(Math.max(0, Number(data.cost) || 0)),
        supplier: data.supplier || null,
        expiryDate: expDate && !isNaN(expDate.getTime()) ? expDate : null,
        updatedAt: new Date(),
      })
      .where(and(eq(schema.inventory.id, id), eq(schema.inventory.tenantId, tenant.id)))
      .returning();

    if (!updated) {
      return { success: false, error: "Barang inventaris tidak ditemukan." };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "update_inventory_item",
      entityType: "inventory",
      entityId: id,
      details: { name: trimmedName, stock: data.stock },
    });

    revalidatePath("/persediaan");
    return { success: true, data: updated };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteInventoryItemAction(id: string) {
  try {
    const { tenant, user } = await requireTenantPermission("inventory:manage", { expectedApp: "owner" });

    await db
      .delete(schema.inventory)
      .where(and(eq(schema.inventory.id, id), eq(schema.inventory.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "delete_inventory_item",
      entityType: "inventory",
      entityId: id,
    });

    revalidatePath("/persediaan");
    return { success: true };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createWasteLogAction(data: {
  inventoryId: string;
  branchId?: string;
  quantity: number;
  cost: number;
  reason: string;
  operatorName?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("inventory:manage", { expectedApp: "owner" });

    const qty = Math.max(0, Number(data.quantity) || 0);
    const cost = Math.max(0, Number(data.cost) || 0);

    if (qty <= 0) {
      return { success: false, error: "Jumlah barang terbuang (waste) harus lebih dari 0." };
    }

    // 1. Verify inventory item belongs to tenant
    const invResults = await db
      .select()
      .from(schema.inventory)
      .where(and(eq(schema.inventory.id, data.inventoryId), eq(schema.inventory.tenantId, tenant.id)))
      .limit(1);

    const invItem = invResults[0];
    if (!invItem) {
      return { success: false, error: "Barang inventaris tidak ditemukan pada outlet ini." };
    }

    // 2. Verify branch belongs to tenant if provided
    let verifiedBranchId: string | null = null;
    if (data.branchId) {
      const branchResults = await db
        .select()
        .from(schema.branches)
        .where(and(eq(schema.branches.id, data.branchId), eq(schema.branches.tenantId, tenant.id)))
        .limit(1);

      if (branchResults[0]) {
        verifiedBranchId = branchResults[0].id;
      }
    }

    // 3. Insert transaction
    const [tx] = await db
      .insert(schema.inventoryTransactions)
      .values({
        tenantId: tenant.id,
        inventoryId: data.inventoryId,
        branchId: verifiedBranchId,
        type: "waste",
        quantity: qty.toString(),
        cost: cost.toString(),
        reason: data.reason.trim() || "Waste / Expired",
        operatorName: data.operatorName || user.name || "Manager",
      })
      .returning();

    // 4. Deduct stock safely with tenantId filter
    const currentStock = parseFloat(invItem.stock);
    const newStock = Math.max(0, currentStock - qty);

    await db
      .update(schema.inventory)
      .set({
        stock: newStock.toString(),
      })
      .where(and(eq(schema.inventory.id, data.inventoryId), eq(schema.inventory.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_waste_log",
      entityType: "inventory_transactions",
      entityId: tx.id,
      details: {
        inventoryId: data.inventoryId,
        inventoryName: invItem.name,
        quantity: qty,
        cost,
        reason: data.reason,
      },
    });

    revalidatePath("/persediaan");
    return { success: true, data: tx };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createPurchaseOrderAction(data: {
  inventoryId: string;
  branchId?: string;
  quantity: number;
  totalAmount: number;
  supplierName?: string;
  notes?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("inventory:manage", { expectedApp: "owner" });

    // 1. Verify inventory item
    const invResults = await db
      .select()
      .from(schema.inventory)
      .where(and(eq(schema.inventory.id, data.inventoryId), eq(schema.inventory.tenantId, tenant.id)))
      .limit(1);

    const invItem = invResults[0];
    const itemName = invItem ? invItem.name : "Bahan Baku";

    // 2. Automatically create a pending Approval Request in schema.approvals
    const [approval] = await db
      .insert(schema.approvals)
      .values({
        tenantId: tenant.id,
        branchId: data.branchId || null,
        type: "purchase_order",
        title: `PO: ${itemName} (${data.quantity} ${invItem?.unit || "unit"})`,
        requestedBy: user.name || "Staf Gudang",
        amount: String(data.totalAmount),
        priority: "medium",
        status: "pending",
        notes: data.notes || `Pengajuan Purchase Order untuk supplier ${data.supplierName || "Default Supplier"}`,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_po_approval",
      entityType: "approvals",
      entityId: approval.id,
      details: { itemName, quantity: data.quantity, totalAmount: data.totalAmount },
    });

    revalidatePath("/persetujuan");
    revalidatePath("/persediaan");
    return { success: true, data: approval };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
