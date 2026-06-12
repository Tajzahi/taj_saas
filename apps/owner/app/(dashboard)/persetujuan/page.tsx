import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import Persetujuan from "../../../_pages/Persetujuan";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let branchesList: any[] = [];
  let inventoryList: any[] = [];

  if (tenantId) {
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));

    inventoryList = await db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.tenantId, tenantId));
  }

  // Construct dynamic approvals based on low stock inventory items
  const lowStockItems = inventoryList.filter((item) => Number(item.stock) < Number(item.minStock));
  const mappedApprovals = lowStockItems.map((item, idx) => {
    const branch = branchesList.find((b) => b.id === item.branchId) || branchesList[0];
    const amount = Math.round(Number(item.cost) * 20); // purchasing 20 units
    return {
      id: item.id,
      title: `Restock ${item.name}`,
      type: "purchase_order",
      amount,
      requestedBy: branch?.picName || "System Auto-PO",
      cabang: branch?.name || "Pusat",
      requestedAt: `${idx + 1} jam lalu`,
      priority: Number(item.stock) / Number(item.minStock) < 0.5 ? "critical" : "high",
      status: "pending",
    };
  });

  return <Persetujuan initialApprovalsList={mappedApprovals} />;
}
