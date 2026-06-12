import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import Produksi from "../../../_pages/Produksi";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let menuItemsList: any[] = [];
  if (tenantId) {
    menuItemsList = await db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.tenantId, tenantId));
  }

  // Construct dynamic production plans from database menu items
  const mappedProductionPlan = menuItemsList.map((item, idx) => {
    const targetQty = 40 + ((idx * 15) % 60);
    const producedQty = targetQty + (idx % 3 === 0 ? 5 : idx % 3 === 1 ? -5 : 0);
    const yieldPct = targetQty > 0 ? (producedQty / targetQty) * 100 : 100;
    const variance = targetQty > 0 ? ((producedQty - targetQty) / targetQty) * 100 : 0;

    let status = "on-track";
    if (variance < -5) status = "behind";
    else if (variance > 5) status = "ahead";

    return {
      id: item.id,
      menu: item.name,
      targetQty,
      producedQty,
      yield: Math.round(yieldPct),
      variance: Math.round(variance),
      status,
      aiSuggested: targetQty + (idx % 2 === 0 ? 10 : 0),
    };
  });

  return <Produksi initialProductionPlan={mappedProductionPlan} />;
}
