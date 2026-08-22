"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import {
  requireTenantPermission,
  requireTenantSession,
  writeAuditEvent,
  AuthorizationError,
} from "@lib/tenant-authorization";
import { calculateOrderPricing, PricingItemBreakdown } from "@lib/server/pricing-service";

// ─── STATE MACHINE DEFINITIONS ──────────────────────────────────────────────

const ORDER_TRANSITIONS: Record<string, string[]> = {
  received: ["processing", "cancelled"],
  processing: ["ready", "cancelled"],
  ready: ["completed"],
  completed: [],
  cancelled: [],
};

// ─── ORDERS ACTIONS ─────────────────────────────────────────────────────────

// Fetch all orders for current tenant (Optimized single batch query)
export async function getOrdersAction() {
  try {
    const { tenant } = await requireTenantPermission("orders:read", { expectedApp: "admin" });

    const dbOrders = await db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.tenantId, tenant.id))
      .orderBy(desc(schema.orders.createdAt));

    if (dbOrders.length === 0) {
      return { success: true, orders: [] };
    }

    const orderIds = dbOrders.map((o) => o.id);
    const allItems = await db
      .select()
      .from(schema.orderItems)
      .where(inArray(schema.orderItems.orderId, orderIds));

    // Group items by orderId in memory
    const itemsMap = new Map<string, typeof allItems>();
    for (const item of allItems) {
      const existing = itemsMap.get(item.orderId) || [];
      existing.push(item);
      itemsMap.set(item.orderId, existing);
    }

    const ordersWithItems = dbOrders.map((order) => {
      const dbItems = itemsMap.get(order.id) || [];
      const items = dbItems.map((item) => ({
        id: item.id,
        name: item.menuItemName,
        quantity: item.quantity,
        price: Number(item.unitPrice),
        variant: item.variantName || undefined,
      }));

      const calculatedFee = Number(order.totalPrice) - Number(order.subtotal);
      const deliveryFee = order.deliveryType === "delivery" ? Math.max(0, calculatedFee) : 0;

      return {
        id: order.id,
        orderCode: order.orderCode,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        deliveryType: (order.deliveryType || "pickup") as "dine_in" | "takeaway" | "pickup" | "delivery",
        deliveryAddress: order.deliveryAddress,
        deliveryDistance: null,
        deliveryFee,
        subtotal: Number(order.subtotal),
        discount: 0,
        couponCode: null,
        totalPrice: Number(order.totalPrice),
        status: order.status as any,
        paymentMethod: order.paymentMethod as "cod" | "transfer",
        paymentStatus: order.paymentStatus as any,
        paymentProofUrl: order.paymentProofUrl,
        notes: order.notes,
        cancellationReason: null,
        items,
        createdAt: order.createdAt.toISOString(),
      };
    });

    return { success: true, orders: ordersWithItems };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, orders: [] };
    }
    console.error("Error in getOrdersAction:", err);
    return { success: false, error: "Gagal memuat daftar pesanan", orders: [] };
  }
}

// Update order status with strict state machine and conditional SQL update
export async function updateOrderStatusAction(
  orderId: string,
  newStatus: string,
  cancellationReason?: string
) {
  try {
    const { tenant, user } = await requireTenantPermission("orders:update-status", {
      expectedApp: "admin",
    });

    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.id, orderId), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    const order = orderResult[0];
    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    // State machine transition validation
    const allowedTransitions = ORDER_TRANSITIONS[order.status] || [];
    if (!allowedTransitions.includes(newStatus)) {
      return {
        success: false,
        error: `Transisi status tidak valid: tidak dapat mengubah dari '${order.status}' ke '${newStatus}'.`,
      };
    }

    const shouldAutoPay = newStatus === "completed" && (order.paymentMethod === "cod" || order.paymentMethod === "cash");
    const paymentStatus = shouldAutoPay ? "paid" : order.paymentStatus;

    // Atomic conditional status update inside transaction (R2-009)
    await db.transaction(async (tx) => {
      const [updatedOrder] = await tx
        .update(schema.orders)
        .set({
          status: newStatus,
          paymentStatus,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(schema.orders.id, orderId),
            eq(schema.orders.tenantId, tenant.id),
            eq(schema.orders.status, order.status)
          )
        )
        .returning();

      if (!updatedOrder) {
        throw new Error("Status pesanan telah diubah oleh operator lain secara bersamaan.");
      }

      // If Cash completed, record payment transaction and shift log idempotently
      if (shouldAutoPay) {
        const existingTx = await tx
          .select()
          .from(schema.paymentTransactions)
          .where(
            and(
              eq(schema.paymentTransactions.orderId, order.id),
              eq(schema.paymentTransactions.tenantId, tenant.id),
              eq(schema.paymentTransactions.status, "paid")
            )
          )
          .limit(1);

        if (existingTx.length === 0) {
          await tx.insert(schema.paymentTransactions).values({
            tenantId: tenant.id,
            orderId: order.id,
            amount: order.totalPrice,
            paymentMethod: "cod",
            status: "paid",
            notes: `Auto-paid on order completed by staff: ${user.name || user.email}`,
            verifiedBy: user.id,
            verifiedAt: new Date(),
          });
        }

        const activeShifts = await tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.tenantId, tenant.id), eq(schema.shifts.status, "open")))
          .limit(1);

        const activeShift = activeShifts[0];
        if (activeShift) {
          // Check if cash log already written for this order
          const existingLogs = await tx
            .select()
            .from(schema.shiftLogs)
            .where(
              and(
                eq(schema.shiftLogs.shiftId, activeShift.id),
                eq(schema.shiftLogs.tenantId, tenant.id)
              )
            );

          const alreadyLogged = existingLogs.some(
            (l) => l.notes && l.notes.includes(order.orderCode)
          );

          if (!alreadyLogged) {
            await tx.insert(schema.shiftLogs).values({
              tenantId: tenant.id,
              shiftId: activeShift.id,
              action: "cash_in",
              amount: order.totalPrice,
              notes: `Pembayaran Cash pesanan ${order.orderCode}`,
            });
          }
        }
      }

      await tx.insert(schema.auditLogs).values({
        tenantId: tenant.id,
        userId: user.id,
        action: `order_status_${newStatus}`,
        entityType: "orders",
        entityId: orderId,
        details: {
          previousStatus: order.status,
          newStatus,
          cancellationReason: cancellationReason || null,
        },
      });

      // Insert outbox event for realtime subscribers
      await tx.insert(schema.outboxEvents).values({
        tenantId: tenant.id,
        aggregateType: "order",
        aggregateId: order.id,
        eventType:
          newStatus === "ready"
            ? "order.ready"
            : newStatus === "completed"
            ? "order.completed"
            : newStatus === "cancelled"
            ? "order.cancelled_by_staff"
            : "order.status_updated",
        payload: {
          orderId: order.id,
          orderCode: order.orderCode,
          status: newStatus,
          paymentStatus,
        },
        status: "pending",
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in updateOrderStatusAction:", err);
    return { success: false, error: "Gagal memperbarui status pesanan" };
  }
}

// Verify payment status
export async function verifyPaymentStatusAction(orderId: string, isPaid: boolean) {
  try {
    const { tenant, user } = await requireTenantPermission("orders:verify-payment", {
      expectedApp: "admin",
    });

    const orderResult = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.id, orderId), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    const order = orderResult[0];
    if (!order) {
      return { success: false, error: "Pesanan tidak ditemukan." };
    }

    const newPaymentStatus = isPaid ? "paid" : "failed";

    await db.transaction(async (tx) => {
      await tx
        .update(schema.orders)
        .set({
          paymentStatus: newPaymentStatus,
          updatedAt: new Date(),
        })
        .where(and(eq(schema.orders.id, orderId), eq(schema.orders.tenantId, tenant.id)));

      // Record immutable ledger entry idempotently (Point 10)
      if (isPaid) {
        const existingTx = await tx
          .select()
          .from(schema.paymentTransactions)
          .where(
            and(
              eq(schema.paymentTransactions.orderId, order.id),
              eq(schema.paymentTransactions.tenantId, tenant.id),
              eq(schema.paymentTransactions.status, "paid")
            )
          )
          .limit(1);

        if (existingTx.length === 0) {
          await tx.insert(schema.paymentTransactions).values({
            tenantId: tenant.id,
            orderId: order.id,
            amount: order.totalPrice,
            paymentMethod: order.paymentMethod,
            status: "paid",
            notes: `Payment verified by staff: ${user.name || user.email}`,
            verifiedBy: user.id,
            verifiedAt: new Date(),
          });
        }
      }

      await tx.insert(schema.auditLogs).values({
        tenantId: tenant.id,
        userId: user.id,
        action: `verify_payment_${newPaymentStatus}`,
        entityType: "orders",
        entityId: orderId,
        details: {
          previousPaymentStatus: order.paymentStatus,
          newPaymentStatus,
        },
      });
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in verifyPaymentStatusAction:", err);
    return { success: false, error: "Gagal memverifikasi pembayaran" };
  }
}

// ─── SHIFTS ACTIONS ─────────────────────────────────────────────────────────

// Get active shift for current tenant
export async function getActiveShiftAction() {
  try {
    const { tenant } = await requireTenantPermission("shifts:manage-own", {
      expectedApp: "admin",
    });

    const activeShifts = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.tenantId, tenant.id), eq(schema.shifts.status, "open")))
      .limit(1);

    const activeShift = activeShifts[0];
    if (!activeShift) {
      return { success: true, activeShift: null };
    }

    // Fetch shift logs to sum up cash_in and cash_out
    const logs = await db
      .select()
      .from(schema.shiftLogs)
      .where(and(eq(schema.shiftLogs.shiftId, activeShift.id), eq(schema.shiftLogs.tenantId, tenant.id)));

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
        status: activeShift.status as "open" | "closed",
      },
    };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, activeShift: null };
    }
    console.error("Error in getActiveShiftAction:", err);
    return { success: false, error: "Gagal memuat status shift aktif", activeShift: null };
  }
}

// Start/Open a new shift
export async function openShiftAction(startingCash: number, operatorName: string) {
  try {
    const { tenant, user } = await requireTenantPermission("shifts:manage-own", {
      expectedApp: "admin",
    });

    const parsedStartingCash = Math.max(0, Number(startingCash) || 0);

    // Check if there is already an open shift for this tenant
    const existing = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.tenantId, tenant.id), eq(schema.shifts.status, "open")))
      .limit(1);

    if (existing.length > 0) {
      return { success: false, error: "Masih ada shift yang aktif/belum ditutup." };
    }

    const [newShift] = await db
      .insert(schema.shifts)
      .values({
        tenantId: tenant.id,
        operatorId: user.id, // Enforce operator ownership (R2-008)
        operatorName: operatorName || user.name || user.email || "Kasir",
        startingCash: String(parsedStartingCash),
        status: "open",
        openedAt: new Date(),
      })
      .returning();

    await db.insert(schema.shiftLogs).values({
      tenantId: tenant.id,
      shiftId: newShift.id,
      action: "open",
      amount: String(parsedStartingCash),
      notes: `Shift dibuka oleh ${newShift.operatorName}`,
    });

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "shift_open",
      entityType: "shifts",
      entityId: newShift.id,
      details: { startingCash: parsedStartingCash },
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
        status: newShift.status as "open" | "closed",
      },
    };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in openShiftAction:", err);
    return { success: false, error: "Gagal membuka shift baru" };
  }
}

// Close active shift
export async function closeShiftAction(shiftId: string, actualCash: number) {
  try {
    const { tenant, user, profile } = await requireTenantPermission("shifts:manage-own", {
      expectedApp: "admin",
    });

    const shiftResult = await db
      .select()
      .from(schema.shifts)
      .where(and(eq(schema.shifts.id, shiftId), eq(schema.shifts.tenantId, tenant.id)))
      .limit(1);

    const shift = shiftResult[0];
    if (!shift || shift.status !== "open") {
      return { success: false, error: "Shift tidak ditemukan atau sudah ditutup." };
    }

    // Scoping enforcement: Kasir can only close their OWN shift (Point 9)
    if (profile.role === "kasir" && shift.operatorId && shift.operatorId !== user.id) {
      return { success: false, error: "Anda hanya diizinkan menutup shift milik Anda sendiri." };
    }

    // Calculate expected physical cash strictly from shiftLogs
    const logs = await db
      .select()
      .from(schema.shiftLogs)
      .where(and(eq(schema.shiftLogs.shiftId, shift.id), eq(schema.shiftLogs.tenantId, tenant.id)));

    const totalCashIn = logs
      .filter((l) => l.action === "cash_in")
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    const totalCashOut = logs
      .filter((l) => l.action === "cash_out")
      .reduce((sum, l) => sum + Number(l.amount || 0), 0);

    const expectedCash = Number(shift.startingCash) + totalCashIn - totalCashOut;
    const parsedActualCash = Number(actualCash) || 0;
    const drift = parsedActualCash - expectedCash;

    await db
      .update(schema.shifts)
      .set({
        status: "closed",
        closedAt: new Date(),
        actualCash: String(parsedActualCash),
        drift: String(drift),
      })
      .where(and(eq(schema.shifts.id, shiftId), eq(schema.shifts.tenantId, tenant.id)));

    await db.insert(schema.shiftLogs).values({
      tenantId: tenant.id,
      shiftId,
      action: "close",
      amount: String(parsedActualCash),
      notes: `Shift ditutup. Uang Fisik: Rp ${parsedActualCash}, Harapan: Rp ${expectedCash}, Selisih: Rp ${drift}`,
    });

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "shift_close",
      entityType: "shifts",
      entityId: shiftId,
      details: { actualCash: parsedActualCash, expectedCash, drift },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in closeShiftAction:", err);
    return { success: false, error: "Gagal menutup shift" };
  }
}

// ─── MENU & STORE OPERATIONS ────────────────────────────────────────────────

// Fetch menu items availability list
export async function getMenuItemsAction() {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "admin" });

    const dbItems = await db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.tenantId, tenant.id));

    const dbCategories = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.tenantId, tenant.id));

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
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, menuItems: [] };
    }
    console.error("Error in getMenuItemsAction:", err);
    return { success: false, error: "Gagal memuat menu", menuItems: [] };
  }
}

// Toggle menu item availability
export async function toggleMenuItemAvailabilityAction(itemId: string, isAvailable: boolean) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "admin" });

    await db
      .update(schema.menuItems)
      .set({ isAvailable })
      .where(and(eq(schema.menuItems.id, itemId), eq(schema.menuItems.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "toggle_menu_item",
      entityType: "menu_items",
      entityId: itemId,
      details: { isAvailable },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in toggleMenuItemAvailabilityAction:", err);
    return { success: false, error: "Gagal memperbarui ketersediaan menu" };
  }
}

// Fetch toppings availability list
export async function getToppingsAction() {
  try {
    const { tenant } = await requireTenantPermission("menu:read", { expectedApp: "admin" });

    const dbToppings = await db
      .select()
      .from(schema.toppings)
      .where(eq(schema.toppings.tenantId, tenant.id));

    const formatted = dbToppings.map((t) => ({
      id: t.id,
      name: t.name,
      isAvailable: t.isAvailable,
    }));

    return { success: true, toppings: formatted };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, toppings: [] };
    }
    console.error("Error in getToppingsAction:", err);
    return { success: false, error: "Gagal memuat toppings", toppings: [] };
  }
}

// Toggle topping availability
export async function toggleToppingAvailabilityAction(toppingId: string, isAvailable: boolean) {
  try {
    const { tenant, user } = await requireTenantPermission("menu:manage", { expectedApp: "admin" });

    await db
      .update(schema.toppings)
      .set({ isAvailable })
      .where(and(eq(schema.toppings.id, toppingId), eq(schema.toppings.tenantId, tenant.id)));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "toggle_topping",
      entityType: "toppings",
      entityId: toppingId,
      details: { isAvailable },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in toggleToppingAvailabilityAction:", err);
    return { success: false, error: "Gagal memperbarui ketersediaan topping" };
  }
}

// Fetch store logs
export async function getStoreLogsAction() {
  try {
    const { tenant } = await requireTenantPermission("shifts:manage-own", { expectedApp: "admin" });

    const dbShifts = await db
      .select()
      .from(schema.shifts)
      .where(eq(schema.shifts.tenantId, tenant.id))
      .orderBy(desc(schema.shifts.openedAt));

    const logs: any[] = [];
    dbShifts.forEach((s) => {
      logs.push({
        id: `open-${s.id}`,
        action: "open",
        operatorName: s.operatorName,
        operatorId: s.operatorId || null,
        selectedDate: s.openedAt.toISOString().slice(0, 10),
        loggedAt: s.openedAt.toISOString(),
        notes: `Shift dibuka oleh ${s.operatorName}`,
      });

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
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, storeLogs: [] };
    }
    console.error("Error in getStoreLogsAction:", err);
    return { success: false, error: "Gagal memuat log operasional", storeLogs: [] };
  }
}

// Toggle store operational open/close
export async function toggleStoreAction(isOpen: boolean) {
  try {
    const { tenant, user } = await requireTenantPermission("store:manage-operation", {
      expectedApp: "admin",
    });

    const currentBranding = tenant.branding || {};
    await db
      .update(schema.tenants)
      .set({
        branding: {
          ...currentBranding,
          storeOpen: isOpen,
        },
      })
      .where(eq(schema.tenants.id, tenant.id));

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "toggle_store_operation",
      entityType: "tenants",
      entityId: tenant.id,
      details: { storeOpen: isOpen },
    });

    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in toggleStoreAction:", err);
    return { success: false, error: "Gagal memperbarui status operasional toko" };
  }
}

// Get operational store settings
export async function getStoreSettingsAction() {
  try {
    const { tenant } = await requireTenantPermission("store:read-operation", {
      expectedApp: "admin",
    });

    const branding = tenant.branding || {};
    return {
      success: true,
      isOpen: branding.storeOpen ?? true,
      name: tenant.name,
      branding: tenant.branding,
    };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in getStoreSettingsAction:", err);
    return { success: false, error: "Gagal memuat pengaturan toko" };
  }
}

// Write Audit Log from client
export async function writeAuditLogAction(action: string, details: string, orderId?: string) {
  try {
    const { tenant, user } = await requireTenantSession({ expectedApp: "admin" });
    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: action.slice(0, 50),
      entityType: "general",
      entityId: orderId || undefined,
      details: { note: details.slice(0, 255) },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}

// ─── POS ORDERS ─────────────────────────────────────────────────────────────

// Create Offline POS Order in Database
export async function createOfflineOrderAction(data: {
  customerName: string;
  orderType: "dine_in" | "takeaway" | "pickup" | "delivery";
  tableNo?: string;
  items: { id: string; name: string; price: number; qty: number }[];
  totalPrice: number;
  paymentMethod: "cod" | "transfer";
  paymentProofUrl?: string | null;
  notes?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("orders:create-pos", {
      expectedApp: "admin",
    });

    // Server-Side Canonical Pricing Calculation (Point 8)
    const pricingResult = await calculateOrderPricing({
      tenantId: tenant.id,
      items: data.items.map((i) => ({
        menuItemId: i.id.length === 36 ? i.id : undefined,
        menuItemName: i.name,
        quantity: i.qty,
      })),
      deliveryType: data.orderType || "pickup",
    });

    const {
      subtotal,
      deliveryFee,
      discountAmount,
      taxAmount,
      serviceChargeAmount,
      totalPrice,
      itemsBreakdown,
      pricingSnapshot,
    } = pricingResult;

    const rand = crypto.randomBytes(3).toString("hex").toUpperCase();
    const orderCode = `POS-${rand}`;

    const createdOrder = await db.transaction(async (tx) => {
      const [newOrder] = await tx
        .insert(schema.orders)
        .values({
          tenantId: tenant.id,
          orderCode,
          customerName: data.customerName || "Pelanggan POS",
          customerPhone: data.tableNo
            ? `Meja ${data.tableNo}`
            : data.orderType === "dine_in"
            ? "Dine-In"
            : data.orderType === "takeaway"
            ? "Takeaway"
            : data.orderType === "delivery"
            ? "Delivery"
            : "Pickup",
          deliveryType: data.orderType,
          subtotal: subtotal.toString(),
          deliveryFee,
          discountAmount: discountAmount.toString(),
          taxAmount: taxAmount.toString(),
          serviceChargeAmount: serviceChargeAmount.toString(),
          totalPrice: totalPrice.toString(),
          status: "processing",
          paymentMethod: data.paymentMethod === "cod" ? "cod" : "transfer",
          paymentStatus: "paid",
          paymentProofUrl: data.paymentProofUrl || null,
          pricingSnapshot,
          notes:
            data.notes ||
            (data.orderType === "dine_in"
              ? `Dine-In${data.tableNo ? " Meja " + data.tableNo : ""}`
              : data.orderType.toUpperCase()),
        })
        .returning();

      if (newOrder && itemsBreakdown.length > 0) {
        await tx.insert(schema.orderItems).values(
          itemsBreakdown.map((item: PricingItemBreakdown) => ({
            orderId: newOrder.id,
            menuItemId: item.menuItemId,
            menuItemName: item.menuItemName,
            variantName: item.variantName || null,
            quantity: item.quantity,
            unitPrice: item.unitPrice.toString(),
            totalPrice: item.totalPrice.toString(),
            note: item.note || null,
          }))
        );
      }

      // Record immutable payment transaction
      await tx.insert(schema.paymentTransactions).values({
        tenantId: tenant.id,
        orderId: newOrder.id,
        amount: totalPrice.toString(),
        paymentMethod: data.paymentMethod === "cod" ? "cod" : "transfer",
        status: "paid",
        notes: `Pembayaran POS Kasir langsung lunas (${data.paymentMethod.toUpperCase()})`,
        verifiedBy: user.id,
        verifiedAt: new Date(),
      });

      // Log to active shift if cash/cod payment
      if (data.paymentMethod === "cod") {
        const activeShifts = await tx
          .select()
          .from(schema.shifts)
          .where(and(eq(schema.shifts.tenantId, tenant.id), eq(schema.shifts.status, "open")))
          .limit(1);

        const activeShift = activeShifts[0];
        if (activeShift) {
          await tx.insert(schema.shiftLogs).values({
            tenantId: tenant.id,
            shiftId: activeShift.id,
            action: "cash_in",
            amount: totalPrice.toString(),
            notes: `Pembayaran POS Kasir: ${orderCode}`,
          });
        }
      }

      await tx.insert(schema.auditLogs).values({
        tenantId: tenant.id,
        userId: user.id,
        action: "pos_order_created",
        entityType: "orders",
        entityId: newOrder.id,
        details: { orderCode, totalPrice },
      });

      return newOrder;
    });

    revalidatePath("/");
    return { success: true, orderCode, order: createdOrder };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in createOfflineOrderAction:", err);
    return { success: false, error: "Gagal membuat pesanan POS" };
  }
}

// ─── ORDER CANCELLATION & REFUND REVIEW (SEC-011, P2) ───────────────────────

export async function getCancellationRequestsAction() {
  try {
    const { tenant } = await requireTenantPermission("cancellations:review", {
      expectedApp: "admin",
    });

    const requests = await db
      .select({
        id: schema.orderCancellationRequests.id,
        orderId: schema.orderCancellationRequests.orderId,
        orderCode: schema.orders.orderCode,
        customerName: schema.orders.customerName,
        customerPhone: schema.orders.customerPhone,
        totalPrice: schema.orders.totalPrice,
        reason: schema.orderCancellationRequests.reason,
        bankName: schema.orderCancellationRequests.bankName,
        accountNumber: schema.orderCancellationRequests.accountNumber,
        accountHolder: schema.orderCancellationRequests.accountHolder,
        status: schema.orderCancellationRequests.status,
        reviewedBy: schema.orderCancellationRequests.reviewedBy,
        reviewedAt: schema.orderCancellationRequests.reviewedAt,
        rejectionReason: schema.orderCancellationRequests.rejectionReason,
        createdAt: schema.orderCancellationRequests.createdAt,
      })
      .from(schema.orderCancellationRequests)
      .innerJoin(
        schema.orders,
        and(
          eq(schema.orderCancellationRequests.orderId, schema.orders.id),
          eq(schema.orders.tenantId, tenant.id)
        )
      )
      .where(eq(schema.orderCancellationRequests.tenantId, tenant.id))
      .orderBy(desc(schema.orderCancellationRequests.createdAt));

    return { success: true, data: requests };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message, data: [] };
    }
    console.error("Error in getCancellationRequestsAction:", err);
    return { success: false, error: "Gagal memuat daftar pembatalan", data: [] };
  }
}

export async function reviewCancellationRequestAction(
  requestId: string,
  decision: "approved" | "rejected",
  rejectionReason?: string
) {
  try {
    const { tenant, user } = await requireTenantPermission("cancellations:review", {
      expectedApp: "admin",
    });

    const [reqRow] = await db
      .select()
      .from(schema.orderCancellationRequests)
      .where(
        and(
          eq(schema.orderCancellationRequests.id, requestId),
          eq(schema.orderCancellationRequests.tenantId, tenant.id)
        )
      )
      .limit(1);

    if (!reqRow || reqRow.status !== "pending") {
      return { success: false, error: "Permintaan pembatalan tidak ditemukan atau sudah diproses." };
    }

    const [order] = await db
      .select()
      .from(schema.orders)
      .where(and(eq(schema.orders.id, reqRow.orderId), eq(schema.orders.tenantId, tenant.id)))
      .limit(1);

    if (!order) {
      return { success: false, error: "Pesanan terkait tidak ditemukan." };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(schema.orderCancellationRequests)
        .set({
          status: decision,
          reviewedBy: user.id,
          reviewedAt: new Date(),
          rejectionReason: decision === "rejected" ? rejectionReason || "Ditolak oleh admin" : null,
        })
        .where(eq(schema.orderCancellationRequests.id, requestId));

      if (decision === "approved") {
        await tx
          .update(schema.orders)
          .set({
            status: "cancelled",
            paymentStatus: order.paymentStatus === "paid" ? "refunded" : "failed",
            updatedAt: new Date(),
          })
          .where(eq(schema.orders.id, order.id));

        if (order.paymentStatus === "paid") {
          await tx.insert(schema.paymentTransactions).values({
            tenantId: tenant.id,
            orderId: order.id,
            amount: order.totalPrice,
            paymentMethod: order.paymentMethod,
            status: "refunded",
            notes: `Refund approved: ${reqRow.reason}`,
            verifiedBy: user.id,
            verifiedAt: new Date(),
          });
        }

        await tx.insert(schema.outboxEvents).values({
          tenantId: tenant.id,
          aggregateType: "order",
          aggregateId: order.id,
          eventType: "order.cancellation_approved",
          payload: {
            orderId: order.id,
            orderCode: order.orderCode,
            refundAmount: order.totalPrice,
          },
          status: "pending",
        });
      }

      await tx.insert(schema.auditLogs).values({
        tenantId: tenant.id,
        userId: user.id,
        action: `cancellation_request_${decision}`,
        entityType: "order_cancellation_requests",
        entityId: requestId,
        details: { orderId: order.id, decision, rejectionReason },
      });
    });

    revalidatePath("/");
    return {
      success: true,
      message: decision === "approved" ? "Pembatalan & refund disetujui." : "Permintaan pembatalan ditolak.",
    };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in reviewCancellationRequestAction:", err);
    return { success: false, error: "Gagal memproses review pembatalan" };
  }
}

export async function createAdminApprovalAction(data: {
  type: "purchase_order" | "discount" | "refund" | "transfer";
  title: string;
  requestedBy: string;
  amount: number;
  priority?: "critical" | "high" | "medium" | "low";
  notes?: string;
}) {
  try {
    const { tenant, user } = await requireTenantPermission("orders:create-pos", { expectedApp: "admin" });

    const trimmedTitle = (data.title || "").trim();
    if (!trimmedTitle) {
      return { success: false, error: "Judul pengajuan tidak boleh kosong." };
    }

    const [newApproval] = await db
      .insert(schema.approvals)
      .values({
        tenantId: tenant.id,
        type: data.type,
        title: trimmedTitle,
        requestedBy: (data.requestedBy || user.name || "Operator Kasir").trim(),
        amount: String(Math.max(0, Number(data.amount) || 0)),
        priority: data.priority || "medium",
        status: "pending",
        notes: (data.notes || "").trim() || null,
      })
      .returning();

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "create_admin_approval",
      entityType: "approvals",
      entityId: newApproval.id,
      details: { title: trimmedTitle, amount: data.amount, type: data.type },
    });

    revalidatePath("/");
    return { success: true, data: newApproval };
  } catch (err: unknown) {
    if (err instanceof AuthorizationError) {
      return { success: false, error: err.message };
    }
    console.error("Error in createAdminApprovalAction:", err);
    return { success: false, error: "Gagal membuat pengajuan persetujuan" };
  }
}
