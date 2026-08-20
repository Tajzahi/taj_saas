/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTIONS ANALITIK & DASHBOARD (ANALYTICS ACTIONS)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini mengelola kalkulasi analitik bisnis untuk Dashboard Utama Overview (`/`).
 * Menghitung Total Pendapatan, Laba Kotor, Modal Bahan (COGS), Gaji Pegawai, Bahan Terbuang (Waste),
 * Tren Omzet Harian, Matriks Jam Ramai (Heatmap), dan Top 10 Menu Terlaris secara real-time dari database.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. REVENUE OVERVIEW (Baris 50-135) : Hitung total omzet, AOV, Gross Profit, COGS %, Labor %, & Waste %.
 * 2. HOURLY HEATMAP (Baris 140-235)  : Petakan jam operasional kasir & jumlah transaksi per jam x hari.
 * 3. TOP MENUS (Baris 360-410)        : Aggregasi tabel `orderItems` untuk 10 produk terbanyak terjual.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Halaman Client UI: `apps/owner/app/(dashboard)/page.tsx`
 * - Skema Database  : `packages/db/schema.ts` (`schema.orders`, `schema.orderItems`, `schema.shifts`, `schema.profiles`, `schema.inventoryTransactions`)
 * =========================================================================================
 */

"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, gte, lte, SQL } from "drizzle-orm";
import { requireTenantPermission, AuthorizationError } from "@lib/tenant-authorization";

// Resolve date filter in Asia/Jakarta timezone (UTC+7)
function resolveDateFilter(
  dateRange?: string,
  customStart?: string,
  customEnd?: string
): { start: Date; end: Date } | null {
  const now = new Date();
  // Jakarta offset: UTC + 7 hours
  const jakartaOffsetMs = 7 * 60 * 60 * 1000;
  const nowWib = new Date(now.getTime() + jakartaOffsetMs);

  if (dateRange === "today") {
    // Start of day in WIB
    const startWib = new Date(Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), nowWib.getUTCDate(), 0, 0, 0));
    const startUtc = new Date(startWib.getTime() - jakartaOffsetMs);
    return { start: startUtc, end: now };
  }
  if (dateRange === "week") {
    const startUtc = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return { start: startUtc, end: now };
  }
  if (dateRange === "month") {
    const startWib = new Date(Date.UTC(nowWib.getUTCFullYear(), nowWib.getUTCMonth(), 1, 0, 0, 0));
    const startUtc = new Date(startWib.getTime() - jakartaOffsetMs);
    return { start: startUtc, end: now };
  }
  if (dateRange === "custom" && customStart && customEnd) {
    const start = new Date(customStart);
    const end = new Date(customEnd);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      return { start, end };
    }
  }
  return null;
}

export async function getRevenueOverviewAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const conditions: SQL[] = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const orders = await db
      .select({
        subtotal: schema.orders.subtotal,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(...conditions));

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const totalSubtotal = orders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
    const orderCount = orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

    const cogsRate = Number(tenant.branding?.cogsRate || 0);
    const totalCogs = totalSubtotal * cogsRate;
    const grossProfit = totalRevenue - totalCogs;
    const grossProfitMargin = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;
    const cogsPercentage = totalRevenue > 0 ? Number(((totalCogs / totalRevenue) * 100).toFixed(1)) : (cogsRate > 0 ? Number((cogsRate * 100).toFixed(1)) : 0);

    // Calculate labor percentage from employee profiles
    const profiles = await db
      .select({ salary: schema.profiles.salary })
      .from(schema.profiles)
      .where(eq(schema.profiles.tenantId, tenant.id));
    const totalLaborSalaries = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);
    const laborPercentage = totalRevenue > 0 ? Number(((totalLaborSalaries / totalRevenue) * 100).toFixed(1)) : 0;

    // Calculate waste percentage from inventory transactions (if any waste logged)
    const wasteLogs = await db
      .select({ quantity: schema.inventoryTransactions.quantity, cost: schema.inventoryTransactions.cost })
      .from(schema.inventoryTransactions)
      .where(and(eq(schema.inventoryTransactions.tenantId, tenant.id), eq(schema.inventoryTransactions.type, "waste")));
    const totalWasteCost = wasteLogs.reduce((sum, w) => sum + (Number(w.cost) || 0), 0);
    const wastePercentage = totalRevenue > 0 ? Number(((totalWasteCost / totalRevenue) * 100).toFixed(1)) : 0;

    // Group orders by day of week
    const dayMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      if (dayMap[day] !== undefined) {
        dayMap[day] += Number(o.totalPrice) || 0;
      }
    });

    const avgRevenue = totalRevenue / 7;
    const targetBase = avgRevenue > 0 ? avgRevenue * 1.15 : 0;
    const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => {
      const rev = Math.round(dayMap[d] || 0);
      return {
        date: d,
        revenue: rev,
        target: rev > 0 ? Math.round(rev * 1.15) : Math.round(targetBase),
      };
    });

    return {
      success: true,
      data: {
        totalRevenue: Math.round(totalRevenue),
        orderCount,
        aov: Math.round(aov),
        grossProfitMargin,
        cogsPercentage,
        laborPercentage,
        wastePercentage,
        trend,
      },
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getHourlyHeatmapAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const shifts = await db
      .select({
        openedAt: schema.shifts.openedAt,
        closedAt: schema.shifts.closedAt,
      })
      .from(schema.shifts)
      .where(eq(schema.shifts.tenantId, tenant.id));

    const openHourSet = new Set<number>();

    if (shifts.length > 0) {
      shifts.forEach((s) => {
        const openH = new Date(s.openedAt).getHours();
        const closeH = s.closedAt ? new Date(s.closedAt).getHours() : (openH + 8) % 24;

        if (openH <= closeH) {
          for (let h = openH; h <= closeH; h++) openHourSet.add(h);
        } else {
          for (let h = openH; h < 24; h++) openHourSet.add(h);
          for (let h = 0; h <= closeH; h++) openHourSet.add(h);
        }
      });
    }

    if (openHourSet.size === 0) {
      [16, 17, 18, 19, 20, 21, 22, 23, 0, 1].forEach((h) => openHourSet.add(h));
    }

    const hoursArr = Array.from(openHourSet);
    hoursArr.sort((a, b) => {
      const valA = a < 6 ? a + 24 : a;
      const valB = b < 6 ? b + 24 : b;
      return valA - valB;
    });

    const operatingHours = hoursArr.map((h) => String(h).padStart(2, "0"));

    const conditions: SQL[] = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const orders = await db
      .select({ createdAt: schema.orders.createdAt })
      .from(schema.orders)
      .where(and(...conditions));

    const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const matrix: Record<string, Record<string, number>> = {};

    days.forEach((d) => {
      matrix[d] = {};
      operatingHours.forEach((hStr) => {
        matrix[d][hStr] = 0;
      });
    });

    orders.forEach((o) => {
      const date = new Date(o.createdAt);
      const dayName = days[date.getDay()];
      const hourStr = String(date.getHours()).padStart(2, "0");
      if (matrix[dayName] && matrix[dayName][hourStr] !== undefined) {
        matrix[dayName][hourStr] += 1;
      }
    });

    return {
      success: true,
      data: {
        matrix,
        operatingHours,
        isShiftRecorded: shifts.length > 0,
      },
    };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: { matrix: {}, operatingHours: [], isShiftRecorded: false } };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: { matrix: {}, operatingHours: [], isShiftRecorded: false } };
  }
}

export async function getSalesByTimeAnalyticsAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const conditions: SQL[] = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const orders = await db
      .select({ createdAt: schema.orders.createdAt })
      .from(schema.orders)
      .where(and(...conditions));

    const slots = ["16.00", "17.00", "18.00", "19.00", "20.00", "21.00", "22.00", "23.00", "00.00"];
    const counts: Record<string, number> = {};
    slots.forEach((s) => (counts[s] = 0));

    orders.forEach((o) => {
      const h = new Date(o.createdAt).getHours();
      const slotStr = `${String(h).padStart(2, "0")}.00`;
      if (counts[slotStr] !== undefined) {
        counts[slotStr] += 1;
      }
    });

    const result = slots.map((time) => ({ time, orders: counts[time] }));
    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getSalesChannelAnalyticsAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const conditions: SQL[] = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const orders = await db
      .select({ deliveryType: schema.orders.deliveryType, totalPrice: schema.orders.totalPrice })
      .from(schema.orders)
      .where(and(...conditions));

    const totalRev = orders.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0);

    const channelMap: Record<string, { label: string; count: number; rev: number }> = {
      pickup: { label: "Pickup / Kasir Direct", count: 0, rev: 0 },
      takeaway: { label: "Takeaway", count: 0, rev: 0 },
      delivery: { label: "Delivery App", count: 0, rev: 0 },
      dine_in: { label: "Dine-in", count: 0, rev: 0 },
    };

    orders.forEach((o) => {
      const type = o.deliveryType || "pickup";
      if (!channelMap[type]) channelMap[type] = { label: type, count: 0, rev: 0 };
      channelMap[type].count += 1;
      channelMap[type].rev += Number(o.totalPrice) || 0;
    });

    const result = Object.values(channelMap).map((c) => ({
      channel: c.label,
      value: totalRev > 0 ? Number(((c.rev / totalRev) * 100).toFixed(1)) : 0,
      revenue: Math.round(c.rev),
      orders: c.count,
    }));

    return { success: true, data: result };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getTopMenusAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const conditions: SQL[] = [
      eq(schema.orderItems.orderId, schema.orders.id),
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const items = await db
      .select({
        menuItemName: schema.orderItems.menuItemName,
        quantity: schema.orderItems.quantity,
        totalPrice: schema.orderItems.totalPrice,
      })
      .from(schema.orderItems)
      .innerJoin(schema.orders, and(...conditions));

    const cogsRate = Number(tenant.branding?.cogsRate || 0.30);
    const marginPercent = Number(((1 - cogsRate) * 100).toFixed(1));

    const aggregated: Record<string, { name: string; totalQty: number; totalRevenue: number; marginPercent: number }> = {};
    for (const item of items) {
      if (!aggregated[item.menuItemName]) {
        aggregated[item.menuItemName] = { name: item.menuItemName, totalQty: 0, totalRevenue: 0, marginPercent };
      }
      aggregated[item.menuItemName].totalQty += item.quantity;
      aggregated[item.menuItemName].totalRevenue += Number(item.totalPrice) || 0;
    }

    const sorted = Object.values(aggregated)
      .sort((a, b) => b.totalQty - a.totalQty)
      .slice(0, 10);
    return { success: true, data: sorted };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getMenuEngineeringAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const res = await getTopMenusAction(dateRange, customStart, customEnd, branchId);
    if (!res.success || !res.data || res.data.length === 0) return { success: true, data: [] };

    const items = res.data;
    const avgQty = items.reduce((sum, item) => sum + item.totalQty, 0) / items.length;

    const matrix = items.map((item) => {
      const marginPerItem = item.totalQty > 0 ? (item.totalRevenue / item.totalQty) * 0.65 : 0;
      const isHighVolume = item.totalQty >= avgQty;
      const isHighMargin = marginPerItem >= 15000;

      let category = "Stars";
      if (isHighVolume && isHighMargin) category = "Stars";
      else if (isHighVolume && !isHighMargin) category = "Plowhorses";
      else if (!isHighVolume && isHighMargin) category = "Puzzles";
      else category = "Dogs";

      return {
        ...item,
        marginPerItem: Math.round(marginPerItem),
        category,
        margin: isHighMargin ? "High" : "Low",
      };
    });

    return { success: true, data: matrix };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getTopCustomersAction(
  dateRange?: string,
  customStart?: string,
  customEnd?: string,
  branchId?: string
) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });
    const dateFilter = resolveDateFilter(dateRange, customStart, customEnd);

    const conditions: SQL[] = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid"),
    ];

    if (branchId && branchId.trim()) {
      conditions.push(eq(schema.orders.branchId, branchId.trim()));
    }

    if (dateFilter) {
      conditions.push(gte(schema.orders.createdAt, dateFilter.start));
      conditions.push(lte(schema.orders.createdAt, dateFilter.end));
    }

    const orders = await db
      .select({
        customerName: schema.orders.customerName,
        customerPhone: schema.orders.customerPhone,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(...conditions));

    const customerMap: Record<string, { name: string; orders: number; spend: number; lastVisit: Date }> = {};
    for (const o of orders) {
      const key = o.customerPhone;
      if (!key) continue;
      if (!customerMap[key]) {
        customerMap[key] = { name: o.customerName, orders: 0, spend: 0, lastVisit: new Date(o.createdAt) };
      }
      customerMap[key].orders += 1;
      customerMap[key].spend += Number(o.totalPrice) || 0;
      const orderDate = new Date(o.createdAt);
      if (orderDate > customerMap[key].lastVisit) {
        customerMap[key].lastVisit = orderDate;
      }
    }

    const now = new Date();
    const sorted = Object.values(customerMap)
      .sort((a, b) => b.spend - a.spend)
      .slice(0, 10)
      .map((c, i) => {
        const diffDays = Math.floor((now.getTime() - c.lastVisit.getTime()) / (1000 * 60 * 60 * 24));
        const lastVisitLabel = diffDays === 0 ? "Hari ini" : diffDays === 1 ? "Kemarin" : `${diffDays} hari lalu`;
        return {
          rank: i + 1,
          name: c.name,
          orders: c.orders,
          spend: Math.round(c.spend),
          lastVisit: lastVisitLabel,
        };
      });

    return { success: true, data: sorted };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}
