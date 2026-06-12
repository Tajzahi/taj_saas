import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import ExecutiveCockpit from "../../_pages/ExecutiveCockpit";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let branchesList: any[] = [];
  if (tenantId) {
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));
  }

  return <ExecutiveCockpit initialBranches={branchesList} />;
}
