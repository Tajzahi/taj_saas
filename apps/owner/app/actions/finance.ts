/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTIONS KEUANGAN RESTORAN (FINANCE ACTIONS)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini mengelola operasi data backend untuk Laporan Keuangan Restoran (`/keuangan`).
 * Menghitung P&L (Profit & Loss) real-time dari pesanan lunas, mengalkulasi HPP (COGS),
 * mengelompokkan omzet per cabang, mengompilasi Arus Kas (Cashflow), dan mengaudit shift kasir.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. GET PNL (Baris 30-135)        : Query pesanan selesai/lunas (`schema.orders`), hitung HPP & OpEx, kelompokkan per cabang.
 * 2. GET CASHFLOW (Baris 140-230)  : Hitung Arus Masuk (Penjualan) & Arus Keluar (HPP + Approved PO + Gaji Staf).
 * 3. GET SHIFT HISTORY (235-290)   : Query register shift POS (`schema.shifts`), hubungkan nama kasir & selisih laci.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Halaman Client UI: `apps/owner/app/(dashboard)/keuangan/page.tsx`
 * - Skema Database  : `packages/db/schema.ts` (`schema.orders`, `schema.shifts`, `schema.approvals`, `schema.profiles`)
 * =========================================================================================
 */

"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, gte } from "drizzle-orm";
import { requireTenantPermission, AuthorizationError } from "@lib/tenant-authorization";

function getStartDateFromRange(dateRange?: string): Date | null {
  if (!dateRange || dateRange === "all") return null;
  const now = new Date();
  if (dateRange === "today") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (dateRange === "7d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 7);
    return start;
  }
  if (dateRange === "30d") {
    const start = new Date(now);
    start.setDate(start.getDate() - 30);
    return start;
  }
  if (dateRange === "month") {
    return new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return null;
}

export async function getPnLAction(dateRange?: string, branchId?: string) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });

    // Fetch branches for branch name mapping
    const branches = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenant.id));
    
    const branchMap: Record<string, string> = {};
    branches.forEach(b => {
      branchMap[b.id] = `${b.name}${b.city ? ` (${b.city})` : ""}`;
    });

    // Build conditions for order query
    const conditions = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid")
    ];
    if (branchId && branchId !== "all") {
      conditions.push(eq(schema.orders.branchId, branchId));
    }
    const startDate = getStartDateFromRange(dateRange);
    if (startDate) {
      conditions.push(gte(schema.orders.createdAt, startDate));
    }

    // Query completed and paid orders for recognized revenue
    const validOrders = await db
      .select({
        id: schema.orders.id,
        branchId: schema.orders.branchId,
        subtotal: schema.orders.subtotal,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(...conditions));

    // Fetch employee salaries for estimated labor OpEx
    const profileConditions = [eq(schema.profiles.tenantId, tenant.id)];
    if (branchId && branchId !== "all") {
      profileConditions.push(eq(schema.profiles.branchId, branchId));
    }

    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(and(...profileConditions));
    const monthlyLaborCost = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    // Calculate revenue by branch
    const branchRevenueMap: Record<string, { branchId: string; branchName: string; revenue: number }> = {};
    let totalAllOrdersRevenue = 0;

    for (const order of validOrders) {
      const bId = order.branchId || "utama";
      const bName = branchMap[bId] || (bId === "utama" ? "Pusat / Utama" : "Cabang Utama");
      const rev = parseFloat(order.totalPrice) || 0;
      totalAllOrdersRevenue += rev;

      if (!branchRevenueMap[bId]) {
        branchRevenueMap[bId] = { branchId: bId, branchName: bName, revenue: 0 };
      }
      branchRevenueMap[bId].revenue += rev;
    }

    const byBranch = Object.values(branchRevenueMap).map(b => ({
      ...b,
      percentage: totalAllOrdersRevenue > 0 ? Math.round((b.revenue / totalAllOrdersRevenue) * 100) : 0
    })).sort((a, b) => b.revenue - a.revenue);

    if (validOrders.length === 0) {
      return { success: true, data: [], byBranch: [] };
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const grouped: Record<
      string,
      { revenue: number; cogs: number; grossProfit: number; opex: number; netProfit: number; sortKey: number }
    > = {};

    const cogsRate = Number(tenant.branding?.cogsRate || 0.30);

    for (const order of validOrders) {
      const date = new Date(order.createdAt);
      const monthStr = months[date.getMonth()];
      const yearStr = date.getFullYear().toString().substring(2);
      const key = `${monthStr} ${yearStr}`;
      const rev = parseFloat(order.totalPrice) || 0;
      const subtotal = parseFloat(order.subtotal) || rev;

      const orderCogs = Math.round(subtotal * cogsRate);

      if (!grouped[key]) {
        grouped[key] = {
          revenue: 0,
          cogs: 0,
          grossProfit: 0,
          opex: monthlyLaborCost,
          netProfit: 0,
          sortKey: date.getTime(),
        };
      }
      grouped[key].revenue += rev;
      grouped[key].cogs += orderCogs;
    }

    const sortedData = Object.entries(grouped)
      .sort((a, b) => a[1].sortKey - b[1].sortKey)
      .map(([month, data]) => {
        const grossProfit = data.revenue - data.cogs;
        const opex = data.opex;
        const netProfit = grossProfit - opex;
        return {
          month,
          revenue: Math.round(data.revenue),
          cogs: data.cogs,
          grossProfit: Math.round(grossProfit),
          opex: Math.round(opex),
          netProfit: Math.round(netProfit),
        };
      });

    return { success: true, data: sortedData, byBranch };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [], byBranch: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [], byBranch: [] };
  }
}

export async function getCashflowAction(dateRange?: string, branchId?: string) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });

    const orderConditions = [
      eq(schema.orders.tenantId, tenant.id),
      eq(schema.orders.status, "completed"),
      eq(schema.orders.paymentStatus, "paid")
    ];
    if (branchId && branchId !== "all") {
      orderConditions.push(eq(schema.orders.branchId, branchId));
    }
    const startDate = getStartDateFromRange(dateRange);
    if (startDate) {
      orderConditions.push(gte(schema.orders.createdAt, startDate));
    }

    const validOrders = await db
      .select({
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(...orderConditions));

    const approvedPO = await db
      .select({
        amount: schema.approvals.amount,
        createdAt: schema.approvals.requestedAt,
      })
      .from(schema.approvals)
      .where(and(eq(schema.approvals.tenantId, tenant.id), eq(schema.approvals.status, "approved")));

    const profileConditions = [eq(schema.profiles.tenantId, tenant.id)];
    if (branchId && branchId !== "all") {
      profileConditions.push(eq(schema.profiles.branchId, branchId));
    }

    const profiles = await db
      .select()
      .from(schema.profiles)
      .where(and(...profileConditions));
    const monthlyLaborCost = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const grouped: Record<
      string,
      { month: string; masuk: number; keluar: number; net: number; sortKey: number }
    > = {};

    const cogsRate = Number(tenant.branding?.cogsRate || 0.30);

    validOrders.forEach((o) => {
      const d = new Date(o.createdAt);
      const m = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      if (!grouped[m]) {
        grouped[m] = { month: m, masuk: 0, keluar: monthlyLaborCost, net: 0, sortKey: d.getTime() };
      }
      const val = parseFloat(o.totalPrice) || 0;
      grouped[m].masuk += val;
      grouped[m].keluar += Math.round(val * cogsRate);
    });

    approvedPO.forEach((po) => {
      const d = new Date(po.createdAt);
      const m = `${months[d.getMonth()]} ${d.getFullYear().toString().substring(2)}`;
      if (grouped[m]) {
        grouped[m].keluar += parseFloat(po.amount) || 0;
      }
    });

    const result = Object.values(grouped)
      .sort((a, b) => a.sortKey - b.sortKey)
      .map((item) => ({
        month: item.month,
        masuk: Math.round(item.masuk),
        keluar: Math.round(item.keluar),
        net: Math.round(item.masuk - item.keluar),
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

function formatCashierName(rawName?: string | null, userName?: string | null): string {
  if (userName && userName.trim() && !userName.includes("@")) {
    return userName.trim();
  }
  if (!rawName) return "Staf Kasir";
  const trimmed = rawName.trim();
  if (trimmed.includes("@")) {
    const parts = trimmed.split("@");
    const namePart = parts[0];
    return namePart
      .replace(/[._-]/g, " ")
      .split(" ")
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  }
  return trimmed;
}

export async function getShiftHistoryAction(dateRange?: string, branchId?: string) {
  try {
    const { tenant } = await requireTenantPermission("finance:read", { expectedApp: "owner" });

    const conditions = [eq(schema.shifts.tenantId, tenant.id)];
    if (branchId && branchId !== "all") {
      conditions.push(eq(schema.shifts.branchId, branchId));
    }

    const list = await db
      .select({
        id: schema.shifts.id,
        branchId: schema.shifts.branchId,
        openedAt: schema.shifts.openedAt,
        closedAt: schema.shifts.closedAt,
        startingCash: schema.shifts.startingCash,
        actualCash: schema.shifts.actualCash,
        drift: schema.shifts.drift,
        status: schema.shifts.status,
        operatorName: schema.shifts.operatorName,
        branchName: schema.branches.name,
        userName: schema.user.name,
      })
      .from(schema.shifts)
      .leftJoin(
        schema.branches,
        and(eq(schema.shifts.branchId, schema.branches.id), eq(schema.branches.tenantId, tenant.id))
      )
      .leftJoin(
        schema.user,
        eq(schema.shifts.operatorId, schema.user.id)
      )
      .where(and(...conditions));

    const mappedList = list.map(item => {
      const displayName = (item.userName && item.userName.trim() && !item.userName.includes("@")) ? item.userName.trim() : formatCashierName(item.operatorName);
      return {
        ...item,
        kasirName: displayName,
      };
    });

    return { success: true, data: mappedList };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message, data: [] };
    }
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}
