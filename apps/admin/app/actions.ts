"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, desc } from "drizzle-orm";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Helper to get tenant context from headers
async function getTenantContext() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantSlug = headersList.get("x-tenant-slug");
  if (!tenantId) {
    throw new Error("Tenant ID tidak ditemukan di headers.");
  }
  return { tenantId, tenantSlug };
}

// Fetch all orders for current tenant
export async function getOrdersAction() {
  try {
    const { tenantId } = await getTenantContext();

    const dbOrders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.tenantId, tenantId))
      .orderBy(desc(schema.orders.createdAt));

    const ordersWithItems = await Promise.all(
      dbOrders.map(async (order) => {
        const dbItems = await db
          .select()
          .from(schema.orderItems)
          .where(eq(schema.orderItems.orderId, order.id));

        const items = dbItems.map((item) => ({
          id: item.id,
          name: item.menuItemName,
          quantity: item.quantity,
          price: Number(item.unitPrice),
          variant: item.variantName || undefined,
        }));

        return {
          id: order.id,
          orderCode: order.orderCode,
          customerName: order.customerName,
          customerPhone: order.customerPhone,
          deliveryType: order.deliveryType as "pickup" | "delivery",
          deliveryAddress: order.deliveryAddress,
          deliveryDistance: null,
          deliveryFee: Number(order.totalPrice) - Number(order.subtotal), // derived
          subtotal: Number(order.subtotal),
          discount: 0,
          couponCode: null,
          totalPrice: Number(order.totalPrice),
          status: order.status as any,
          paymentMethod: order.paymentMethod as "cod" | "transfer",
          paymentStatus: order.paymentStatus as any,
          paymentProofUrl: order.paymentProofUrl,
          notes: order.notes,
          cancellationReason: null, // can be extracted from audit logs if needed
          items,
          createdAt: order.createdAt.toISOString(),
        };
      })
    );

    return { success: true, orders: ordersWithItems };
  } catch (err: any) {
    console.error("Error in getOrdersAction:", err);
    return { success: false, error: err.message, orders: [] };
  }
}

// Update order status and log audit trail
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string,
  cancellationReason?: string
) {
  try {
    const { tenantId } = await getTenantContext();

    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    const order = orderResult[0];
    if (!order || order.tenantId !== tenantId) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    const shouldAutoPay = newStatus === "completed" && order.paymentMethod === "cod";
    const paymentStatus = shouldAutoPay ? "paid" : order.paymentStatus;

    await db.transaction(async (tx) => {
      await tx
        .update(schema.orders)
        .set({
          status: newStatus,
          paymentStatus,
        })
        .where(eq(schema.orders.id, orderId));

      await tx.insert(schema.auditLogs).values({
        tenantId,
        action: `update_status_${newStatus}`,
        entityType: "orders",
        entityId: orderId,
        details: {
          previousStatus: order.status,
          cancellationReason: cancellationReason || null,
        },
      });

      // If COD completed, log this transaction into the shift
      if (shouldAutoPay) {
        const activeShifts = await tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.tenantId, tenantId), eq(schema.shifts.status, "open")))
          .limit(1);

        const activeShift = activeShifts[0];
        if (activeShift) {
          // Log inside shiftLogs
          await tx.insert(schema.shiftLogs).values({
            tenantId,
            shiftId: activeShift.id,
            action: "cash_in",
            amount: order.totalPrice,
            notes: `Pembayaran COD pesanan ${order.orderCode}`,
          });
        }
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in updateOrderStatusAction:", err);
    return { success: false, error: err.message };
  }
}

// Verify payment status
export async function verifyPaymentStatusAction(orderId: string, isPaid: boolean) {
  try {
    const { tenantId } = await getTenantContext();

    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1);

    const order = orderResult[0];
    if (!order || order.tenantId !== tenantId) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    const newPaymentStatus = isPaid ? "paid" : "failed";

    await db.transaction(async (tx) => {
      await tx
        .update(schema.orders)
        .set({
          paymentStatus: newPaymentStatus,
        })
        .where(eq(schema.orders.id, orderId));

      await tx.insert(schema.auditLogs).values({
        tenantId,
        action: `verify_payment_${newPaymentStatus}`,
        entityType: "orders",
        entityId: orderId,
        details: {
          previousPaymentStatus: order.paymentStatus,
        },
      });

      // If payment is verified (paid), log as transfer cash-in (for shift calculations if relevant)
      if (isPaid) {
        const activeShifts = await tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.tenantId, tenantId), eq(schema.shifts.status, "open")))
          .limit(1);

        const activeShift = activeShifts[0];
        if (activeShift) {
          await tx.insert(schema.shiftLogs).values({
            tenantId,
            shiftId: activeShift.id,
            action: "cash_in",
            amount: order.totalPrice,
            notes: `Pembayaran QRIS pesanan ${order.orderCode} terverifikasi`,
          });
        }
      }
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in verifyPaymentStatusAction:", err);
    return { success: false, error: err.message };
  }
}

// Get the active shift (open status)
export async function getActiveShiftAction() {
  try {
    const { tenantId } = await getTenantContext();

    const activeShifts = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.tenantId, tenantId), eq(schema.shifts.status, "open")))
      .limit(1);

    const activeShift = activeShifts[0];
    if (!activeShift) {
      return { success: true, activeShift: null };
    }

    // Fetch shift logs to sum up cash_in and cash_out
    const logs = await db
      .select()
      .from(schema.shiftLogs)
      .where(eq(schema.shiftLogs.shiftId, activeShift.id));

    const totalCashIn = logs
      .filter((l) => l.action === "cash_in")
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    const totalCashOut = logs
      .filter((l) => l.action === "cash_out")
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    const expectedCash = Number(activeShift.startingCash) + totalCashIn - totalCashOut;

    return {
      success: true,
      activeShift: {
        id: activeShift.id,
        operatorId: activeShift.operatorId || null,
        operatorName: activeShift.operatorName,
        openedAt: activeShift.openedAt.toISOString(),
        closedAt: activeShift.closedAt ? activeShift.closedAt.toISOString() : null,
        startingCash: Number(activeShift.startingCash),
        expectedCash,
        actualCash: activeShift.actualCash ? Number(activeShift.actualCash) : null,
        drift: activeShift.drift ? Number(activeShift.drift) : null,
        status: activeShift.status as 'open' | 'closed',
      },
    };
  } catch (err: any) {
    console.error("Error in getActiveShiftAction:", err);
    return { success: false, error: err.message, activeShift: null };
  }
}

// Start/Open a new shift
export async function openShiftAction(startingCash: number, operatorName: string) {
  try {
    const { tenantId } = await getTenantContext();

    // Check if there is already an open shift
    const existing = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.tenantId, tenantId), eq(schema.shifts.status, "open")))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Masih ada shift yang aktif/belum ditutup." };
    }

    const [newShift] = await db
      .insert(schema.shifts)
      .values({
        tenantId,
        operatorName,
        startingCash: String(startingCash),
        status: "open",
        openedAt: new Date(),
      })
      .returning();

    // Log the open action
    await db.insert(schema.shiftLogs).values({
      tenantId,
      shiftId: newShift.id,
      action: "open",
      amount: String(startingCash),
      notes: `Shift dibuka oleh ${operatorName}`,
    });

    revalidatePath("/");
    return {
      success: true,
      shift: {
        id: newShift.id,
        operatorId: newShift.operatorId || null,
        operatorName: newShift.operatorName,
        openedAt: newShift.openedAt.toISOString(),
        closedAt: null,
        startingCash: Number(newShift.startingCash),
        expectedCash: Number(newShift.startingCash),
        actualCash: null,
        drift: null,
        status: newShift.status as 'open' | 'closed',
      },
    };
  } catch (err: any) {
    console.error("Error in openShiftAction:", err);
    return { success: false, error: err.message };
  }
}

// Close active shift
export async function closeShiftAction(shiftId: string, actualCash: number, expectedCash: number) {
  try {
    const { tenantId } = await getTenantContext();
    const drift = actualCash - expectedCash;

    await db.transaction(async (tx) => {
      await tx
        .update(schema.shifts)
        .set({
          status: "closed",
          closedAt: new Date(),
          actualCash: String(actualCash),
          drift: String(drift),
        })
        .where(eq(schema.shifts.id, shiftId));

      await tx.insert(schema.shiftLogs).values({
        tenantId,
        shiftId,
        action: "close",
        amount: String(actualCash),
        notes: `Shift ditutup. Uang Fisik: Rp ${actualCash}, Harapan: Rp ${expectedCash}, Selisih: Rp ${drift}`,
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in closeShiftAction:", err);
    return { success: false, error: err.message };
  }
}

// Fetch menu items availability list
export async function getMenuItemsAction() {
  try {
    const { tenantId } = await getTenantContext();

    const dbItems = await db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.tenantId, tenantId));

    const dbCategories = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.tenantId, tenantId));

    const categoryLabelMap = new Map(dbCategories.map((c) => [c.id, c.name]));

    const formatted = dbItems.map((item) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      isAvailable: item.isAvailable,
      price: Number(item.price),
      categoryId: item.categoryId || "lainnya",
      categoryName: item.categoryId ? categoryLabelMap.get(item.categoryId) || "Lainnya" : "Lainnya",
    }));

    return { success: true, menuItems: formatted };
  } catch (err: any) {
    console.error("Error in getMenuItemsAction:", err);
    return { success: false, error: err.message, menuItems: [] };
  }
}

// Toggle menu item availability
export async function toggleMenuItemAvailabilityAction(itemId: string, isAvailable: boolean) {
  try {
    const { tenantId } = await getTenantContext();

    await db
      .update(schema.menuItems)
      .set({ isAvailable })
      .where(and(eq(schema.menuItems.id, itemId), eq(schema.menuItems.tenantId, tenantId)));

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in toggleMenuItemAvailabilityAction:", err);
    return { success: false, error: err.message };
  }
}

// Fetch toppings availability list
export async function getToppingsAction() {
  try {
    const { tenantId } = await getTenantContext();

    const dbToppings = await db
      .select()
      .from(schema.toppings)
      .where(eq(schema.toppings.tenantId, tenantId));

    const formatted = dbToppings.map((t) => ({
      id: t.id,
      name: t.name,
      isAvailable: t.isAvailable,
    }));

    return { success: true, toppings: formatted };
  } catch (err: any) {
    console.error("Error in getToppingsAction:", err);
    return { success: false, error: err.message, toppings: [] };
  }
}

// Toggle topping availability
export async function toggleToppingAvailabilityAction(toppingId: string, isAvailable: boolean) {
  try {
    const { tenantId } = await getTenantContext();

    await db
      .update(schema.toppings)
      .set({ isAvailable })
      .where(and(eq(schema.toppings.id, toppingId), eq(schema.toppings.tenantId, tenantId)));

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in toggleToppingAvailabilityAction:", err);
    return { success: false, error: err.message };
  }
}

// Fetch store logs (opened/closed logs from audit logs or shifts)
export async function getStoreLogsAction() {
  try {
    const { tenantId } = await getTenantContext();

    // Map logs from shifts opened/closed events
    const dbShifts = await db
      .select()
      .from(schema.shifts)
      .where(eq(schema.shifts.tenantId, tenantId))
      .orderBy(desc(schema.shifts.openedAt));

    const logs: any[] = [];
    dbShifts.forEach((s) => {
      // Open Log
      logs.push({
        id: `open-${s.id}`,
        action: "open",
        operatorName: s.operatorName,
        operatorId: s.operatorId || null,
        selectedDate: s.openedAt.toISOString().slice(0, 10),
        loggedAt: s.openedAt.toISOString(),
        notes: `Shift dibuka oleh ${s.operatorName}`,
      });

      // Close Log if closed
      if (s.closedAt) {
        logs.push({
          id: `close-${s.id}`,
          action: "closed",
          operatorName: s.operatorName,
          operatorId: s.operatorId || null,
          selectedDate: s.closedAt.toISOString().slice(0, 10),
          loggedAt: s.closedAt.toISOString(),
          notes: `Shift ditutup oleh ${s.operatorName}. Uang Fisik: Rp ${Number(s.actualCash || 0)}, Harapan: Rp ${Number(s.startingCash || 0)}, Selisih: Rp ${Number(s.drift || 0)}`,
        });
      }
    });

    return { success: true, storeLogs: logs };
  } catch (err: any) {
    console.error("Error in getStoreLogsAction:", err);
    return { success: false, error: err.message, storeLogs: [] };
  }
}

// Toggle store open status
export async function toggleStoreAction(isOpen: boolean) {
  try {
    const { tenantId } = await getTenantContext();

    await db
      .update(schema.tenants)
      .set({ isActive: isOpen })
      .where(eq(schema.tenants.id, tenantId));

    revalidatePath("/");
    return { success: true };
  } catch (err: any) {
    console.error("Error in toggleStoreAction:", err);
    return { success: false, error: err.message };
  }
}

// Get store settings
export async function getStoreSettingsAction() {
  try {
    const { tenantId } = await getTenantContext();

    const tenantResult = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, tenantId))
      .limit(1);

    const tenant = tenantResult[0];
    if (!tenant) {
      return { success: false, error: "Tenant tidak ditemukan." };
    }

    return {
      success: true,
      isOpen: tenant.isActive ?? true,
      name: tenant.name,
      branding: tenant.branding,
    };
  } catch (err: any) {
    console.error("Error in getStoreSettingsAction:", err);
    return { success: false, error: err.message };
  }
}

// Write Audit Log
export async function writeAuditLogAction(action: string, details: string, orderId?: string) {
  try {
    const { tenantId } = await getTenantContext();

    await db.insert(schema.auditLogs).values({
      tenantId,
      action,
      entityType: "general",
      entityId: orderId || null,
      details: { info: details },
    });

    return { success: true };
  } catch (err: any) {
    console.error("Error in writeAuditLogAction:", err);
    return { success: false, error: err.message };
  }
}
