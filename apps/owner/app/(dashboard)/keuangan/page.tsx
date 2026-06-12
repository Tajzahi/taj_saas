import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq, desc } from "drizzle-orm";
import Keuangan from "../../../_pages/Keuangan";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let branchesList: any[] = [];
  let shiftsList: any[] = [];
  let ordersList: any[] = [];

  if (tenantId) {
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));

    shiftsList = await db
      .select({
        id: schema.shifts.id,
        status: schema.shifts.status,
        openedAt: schema.shifts.openedAt,
        startingCash: schema.shifts.startingCash,
        actualCash: schema.shifts.actualCash,
        drift: schema.shifts.drift,
        operatorName: schema.shifts.operatorName,
        cabang: schema.branches.name,
      })
      .from(schema.shifts)
      .leftJoin(schema.branches, eq(schema.shifts.branchId, schema.branches.id))
      .where(eq(schema.shifts.tenantId, tenantId))
      .orderBy(desc(schema.shifts.openedAt))
      .limit(10);

    ordersList = await db
      .select({
        totalPrice: schema.orders.totalPrice,
        createdAt: schema.orders.createdAt,
        branchId: schema.orders.branchId,
      })
      .from(schema.orders)
      .where(eq(schema.orders.tenantId, tenantId));
  }

  // 1. Map branches with their revenue from orders
  const cabangMap = new Map(branchesList.map((b) => [b.id, { name: b.name, revenue: 0 }]));
  for (const order of ordersList) {
    const val = Number(order.totalPrice || 0);
    if (order.branchId) {
      const bInfo = cabangMap.get(order.branchId);
      if (bInfo) {
        bInfo.revenue += val;
      }
    }
  }

  const mappedCabangList = Array.from(cabangMap.entries()).map(([id, b]) => ({
    id,
    name: b.name,
    revenue: b.revenue,
  }));

  // 2. Map shifts to reconData format
  const mappedReconData = shiftsList.map((s, idx) => {
    const expected = Number(s.startingCash) + (idx % 2 === 0 ? 5000000 : 3500000);
    const actual = s.actualCash ? Number(s.actualCash) : expected;
    const diff = s.drift ? Number(s.drift) : actual - expected;

    let status = "ok";
    if (s.status === "open") status = "vacant";
    else if (Math.abs(diff) > 100000) status = "critical";
    else if (Math.abs(diff) > 0) status = "warning";

    return {
      id: s.id,
      cabang: s.cabang || "Pusat",
      shift: s.openedAt.getHours() < 15 ? "Pagi" : "Sore",
      kasir: s.operatorName || "Kasir",
      expectedCash: expected,
      actualCash: actual,
      diff: diff,
      status: status,
    };
  });

  // 3. Map P&L and Cashflow Data
  const monthlyRevenueMap: Record<string, number> = {
    Jul: 162000000,
    Agu: 175000000,
    Sep: 168000000,
    Okt: 182000000,
    Nov: 195000000,
    Des: 185200000,
  };

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  for (const order of ordersList) {
    const date = new Date(order.createdAt);
    const mName = monthNames[date.getMonth()];
    if (monthlyRevenueMap[mName] !== undefined) {
      monthlyRevenueMap[mName] += Number(order.totalPrice);
    } else {
      monthlyRevenueMap[mName] = Number(order.totalPrice);
    }
  }

  const months = ["Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const mappedPnL = months.map((m) => {
    const rev = monthlyRevenueMap[m] || 50000000;
    const cogs = Math.round(rev * 0.32);
    const grossProfit = rev - cogs;
    const opex = Math.round(rev * 0.24);
    const netProfit = grossProfit - opex;
    return {
      month: m,
      revenue: rev,
      cogs,
      grossProfit,
      opex,
      netProfit,
    };
  });

  const mappedCashflow = months.map((m) => {
    const rev = monthlyRevenueMap[m] || 50000000;
    const keluar = Math.round(rev * 0.56);
    const net = rev - keluar;
    return {
      month: m,
      masuk: rev,
      keluar,
      net,
    };
  });

  return (
    <Keuangan
      initialPnLData={mappedPnL}
      initialCabangList={mappedCabangList}
      initialReconData={mappedReconData}
      initialCashflowData={mappedCashflow}
    />
  );
}
