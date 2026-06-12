import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import Persediaan from "../../../_pages/Persediaan";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let inventoryList: any[] = [];
  let wasteList: any[] = [];

  if (tenantId) {
    // 1. Fetch inventory items
    inventoryList = await db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.tenantId, tenantId));

    // 2. Fetch waste transactions
    wasteList = await db
      .select({
        id: schema.inventoryTransactions.id,
        date: schema.inventoryTransactions.createdAt,
        item: schema.inventory.name,
        qty: schema.inventoryTransactions.quantity,
        unit: schema.inventory.unit,
        reason: schema.inventoryTransactions.reason,
        cost: schema.inventoryTransactions.cost,
        cabang: schema.branches.name,
      })
      .from(schema.inventoryTransactions)
      .innerJoin(schema.inventory, eq(schema.inventoryTransactions.inventoryId, schema.inventory.id))
      .leftJoin(schema.branches, eq(schema.inventoryTransactions.branchId, schema.branches.id))
      .where(eq(schema.inventoryTransactions.tenantId, tenantId));
  }

  // Map inventory list items to props format
  const mappedInventory = inventoryList.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    stock: Number(item.stock),
    minStock: Number(item.minStock),
    unit: item.unit,
    cost: Number(item.cost),
    supplier: item.supplier || "Supplier Umum",
  }));

  // Format wasteLog
  const mappedWasteLog = wasteList.map((w) => {
    const d = new Date(w.date);
    const dateFormatted = `${d.getDate()} ${
      ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][
        d.getMonth()
      ]
    }`;
    return {
      date: dateFormatted,
      item: w.item,
      qty: Number(w.qty),
      unit: w.unit,
      reason: w.reason || "Waste",
      cost: Math.round(Number(w.cost)),
      cabang: w.cabang || "Pusat",
    };
  });

  // Construct a simple chart from recent waste costs grouped by day
  const last6Days = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateFormatted = `${d.getDate()} ${
      ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][
        d.getMonth()
      ]
    }`;
    return dateFormatted;
  }).reverse();

  const mappedWasteChart = last6Days.map((dayStr) => {
    const daysLogs = mappedWasteLog.filter((w) => w.date === dayStr);
    const totalWasteCost = daysLogs.reduce((sum, log) => sum + log.cost, 0);
    return {
      date: dayStr,
      waste: totalWasteCost || 0,
    };
  });

  return (
    <Persediaan
      initialInventoryItems={mappedInventory}
      initialWasteLog={mappedWasteLog}
      initialWasteChart={mappedWasteChart}
    />
  );
}
