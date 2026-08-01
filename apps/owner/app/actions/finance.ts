"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, or, inArray } from "drizzle-orm";
import { getTenantId, getCogsRate } from "./_tenantHelper";

export async function getPnLAction(dateRange: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    // Query completed/paid orders from database
    const validOrders = await db
      .select({
        id: schema.orders.id,
        subtotal: schema.orders.subtotal,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenantId),
          or(eq(schema.orders.status, "completed"), eq(schema.orders.paymentStatus, "paid"))
        )
      );

    // Fetch employee salaries for actual labor OpEx
    const profiles = await db.select().from(schema.profiles).where(eq(schema.profiles.tenantId, tenantId));
    const monthlyLaborCost = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    if (validOrders.length === 0) {
      return { success: true, data: [] };
    }

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const grouped: Record<string, { revenue: number; cogs: number; grossProfit: number; opex: number; netProfit: number; sortKey: number }> = {};

    // Fetch COGS rate once outside loop
    const cogsRate = await getCogsRate(tenantId);

    for (const order of validOrders) {
      const date = new Date(order.createdAt);
      const monthStr = months[date.getMonth()];
      const yearStr = date.getFullYear().toString().substring(2);
      const key = `${monthStr} ${yearStr}`;
      const rev = parseFloat(order.totalPrice) || 0;
      const subtotal = parseFloat(order.subtotal) || rev;

      // COGS from tenant settings
      const orderCogs = Math.round(subtotal * cogsRate);

      if (!grouped[key]) {
        grouped[key] = { revenue: 0, cogs: 0, grossProfit: 0, opex: monthlyLaborCost, netProfit: 0, sortKey: date.getTime() };
      }
      grouped[key].revenue += rev;
      grouped[key].cogs += orderCogs;
    }

    const sortedData = Object.entries(grouped)
      .sort((a, b) => a[1].sortKey - b[1].sortKey)
      .map(([month, data]) => {
        const grossProfit = data.revenue - data.cogs;
        const opex = data.opex; // Actual total labor salaries from DB
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

    return { success: true, data: sortedData };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getCashflowAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: true, data: [] };

    const validOrders = await db
      .select({
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(
        and(
          eq(schema.orders.tenantId, tenantId),
          or(eq(schema.orders.status, "completed"), eq(schema.orders.paymentStatus, "paid"))
        )
      );

    const approvedPO = await db
      .select({
        amount: schema.approvals.amount,
        createdAt: schema.approvals.requestedAt,
      })
      .from(schema.approvals)
      .where(and(eq(schema.approvals.tenantId, tenantId), eq(schema.approvals.status, "approved")));

    // Fetch employee salaries for monthly cash outflow
    const profiles = await db.select().from(schema.profiles).where(eq(schema.profiles.tenantId, tenantId));
    const monthlyLaborCost = profiles.reduce((sum, p) => sum + (parseFloat(p.salary || "0") || 0), 0);

    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const grouped: Record<string, { month: string; masuk: number; keluar: number; net: number; sortKey: number }> = {};

    validOrders.forEach(o => {
      const d = new Date(o.createdAt);
      const m = months[d.getMonth()];
      if (!grouped[m]) {
        grouped[m] = { month: m, masuk: 0, keluar: monthlyLaborCost, net: 0, sortKey: d.getTime() };
      }
      const val = parseFloat(o.totalPrice) || 0;
      grouped[m].masuk += val;
      grouped[m].keluar += Math.round(val * 0.30); // COGS
    });

    approvedPO.forEach(po => {
      const d = new Date(po.createdAt);
      const m = months[d.getMonth()];
      if (grouped[m]) {
        grouped[m].keluar += parseFloat(po.amount) || 0;
      }
    });

    const result = Object.values(grouped).map(item => ({
      month: item.month,
      masuk: Math.round(item.masuk),
      keluar: Math.round(item.keluar),
      net: Math.round(item.masuk - item.keluar),
    }));

    return { success: true, data: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getShiftHistoryAction(dateRange: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

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
      })
      .from(schema.shifts)
      .leftJoin(schema.branches, eq(schema.shifts.branchId, schema.branches.id))
      .where(eq(schema.shifts.tenantId, tenantId));
      
    return { success: true, data: list };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
