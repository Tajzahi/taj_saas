"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and, sql } from "drizzle-orm";
// headers imported via _tenantHelper

import { getTenantId, getCogsRate } from "./_tenantHelper";

export async function getRevenueOverviewAction(dateRange: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    
    const orders = await db
      .select({
        subtotal: schema.orders.subtotal,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenantId), eq(schema.orders.status, "completed")));
    
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalPrice) || 0), 0);
    const totalSubtotal = orders.reduce((sum, o) => sum + (Number(o.subtotal) || 0), 0);
    const orderCount = orders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

    // Calculate actual Gross Profit Margin based on product subtotal & estimated COGS from tenant settings
    const cogsRate = await getCogsRate(tenantId);
    const totalCogs = totalSubtotal * cogsRate;
    const grossProfit = totalRevenue - totalCogs;
    const grossProfitMargin = totalRevenue > 0 ? Number(((grossProfit / totalRevenue) * 100).toFixed(1)) : 0;
    
    // Group orders by day of week
    const dayMap: Record<string, number> = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    orders.forEach((o) => {
      const day = new Date(o.createdAt).toLocaleDateString("en-US", { weekday: "short" });
      if (dayMap[day] !== undefined) {
        dayMap[day] += Number(o.totalPrice) || 0;
      }
    });

    const trend = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
      date: d,
      revenue: Math.round(dayMap[d] || 0),
    }));

    return { 
      success: true, 
      data: {
        totalRevenue: Math.round(totalRevenue),
        orderCount,
        aov: Math.round(aov),
        grossProfitMargin,
        trend,
      } 
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function getHourlyHeatmapAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: true, data: { matrix: {}, operatingHours: [], isShiftRecorded: false } };

    // Fetch shift open/close logs from database to calculate actual operational hours
    const shifts = await db
      .select({
        openedAt: schema.shifts.openedAt,
        closedAt: schema.shifts.closedAt,
      })
      .from(schema.shifts)
      .where(eq(schema.shifts.tenantId, tenantId));

    let openHourSet = new Set<number>();
    
    if (shifts.length > 0) {
      shifts.forEach(s => {
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

    // Default operational hours if no shifts recorded yet: 16.00 to 01.00 (Jam Toko Buka)
    if (openHourSet.size === 0) {
      [16, 17, 18, 19, 20, 21, 22, 23, 0, 1].forEach(h => openHourSet.add(h));
    }

    const hoursArr = Array.from(openHourSet);
    hoursArr.sort((a, b) => {
      const valA = a < 6 ? a + 24 : a;
      const valB = b < 6 ? b + 24 : b;
      return valA - valB;
    });

    const operatingHours = hoursArr.map(h => String(h).padStart(2, "0"));

    const orders = await db
      .select({ createdAt: schema.orders.createdAt })
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenantId), eq(schema.orders.status, "completed")));

    const days = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const matrix: Record<string, Record<string, number>> = {};

    days.forEach(d => {
      matrix[d] = {};
      operatingHours.forEach(hStr => {
        matrix[d][hStr] = 0;
      });
    });

    orders.forEach(o => {
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
      } 
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: { matrix: {}, operatingHours: [], isShiftRecorded: false } };
  }
}

export async function getSalesByTimeAnalyticsAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: true, data: [] };

    const orders = await db
      .select({ createdAt: schema.orders.createdAt })
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenantId), eq(schema.orders.status, "completed")));

    const slots = ["16.00", "17.00", "18.00", "19.00", "20.00", "21.00", "22.00", "23.00", "00.00"];
    const counts: Record<string, number> = {};
    slots.forEach(s => (counts[s] = 0));

    orders.forEach(o => {
      const h = new Date(o.createdAt).getHours();
      const slotStr = `${String(h).padStart(2, "0")}.00`;
      if (counts[slotStr] !== undefined) {
        counts[slotStr] += 1;
      }
    });

    const result = slots.map(time => ({ time, orders: counts[time] }));
    return { success: true, data: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getSalesChannelAnalyticsAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: true, data: [] };

    const orders = await db
      .select({ deliveryType: schema.orders.deliveryType, totalPrice: schema.orders.totalPrice })
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenantId), eq(schema.orders.status, "completed")));

    const totalRev = orders.reduce((s, o) => s + (Number(o.totalPrice) || 0), 0);

    const channelMap: Record<string, { label: string; count: number; rev: number }> = {
      pickup: { label: "Pickup / Kasir Direct", count: 0, rev: 0 },
      takeaway: { label: "Takeaway", count: 0, rev: 0 },
      delivery: { label: "Delivery App", count: 0, rev: 0 },
      dine_in: { label: "Dine-in", count: 0, rev: 0 },
    };

    orders.forEach(o => {
      const type = o.deliveryType || "pickup";
      if (!channelMap[type]) channelMap[type] = { label: type, count: 0, rev: 0 };
      channelMap[type].count += 1;
      channelMap[type].rev += Number(o.totalPrice) || 0;
    });

    const result = Object.values(channelMap).map(c => ({
      channel: c.label,
      value: totalRev > 0 ? Number(((c.rev / totalRev) * 100).toFixed(1)) : 0,
      revenue: Math.round(c.rev),
      orders: c.count,
    }));

    return { success: true, data: result };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getTopMenusAction() {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) return { success: true, data: [] };

    const items = await db
      .select({
        menuItemName: schema.orderItems.menuItemName,
        quantity: schema.orderItems.quantity,
        totalPrice: schema.orderItems.totalPrice,
      })
      .from(schema.orderItems)
      .innerJoin(schema.orders, eq(schema.orderItems.orderId, schema.orders.id))
      .where(eq(schema.orders.tenantId, tenantId));

    const aggregated: Record<string, { name: string; totalQty: number; totalRevenue: number }> = {};
    for (const item of items) {
      if (!aggregated[item.menuItemName]) {
        aggregated[item.menuItemName] = { name: item.menuItemName, totalQty: 0, totalRevenue: 0 };
      }
      aggregated[item.menuItemName].totalQty += item.quantity;
      aggregated[item.menuItemName].totalRevenue += Number(item.totalPrice) || 0;
    }

    const sorted = Object.values(aggregated).sort((a, b) => b.totalQty - a.totalQty).slice(0, 10);
    return { success: true, data: sorted };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getMenuEngineeringAction() {
  try {
    const res = await getTopMenusAction();
    if (!res.success || res.data.length === 0) return { success: true, data: [] };

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
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}

export async function getTopCustomersAction() {
  try {
    const tenantId = await getTenantId();
    const orders = await db
      .select({
        customerName: schema.orders.customerName,
        customerPhone: schema.orders.customerPhone,
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(and(eq(schema.orders.tenantId, tenantId), eq(schema.orders.status, "completed")));

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
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message, data: [] };
  }
}
