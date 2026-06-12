import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import { TenantProvider } from "@taj-saas/shared";
import DashboardContainer from "./DashboardContainer";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const tenantSlug = headersList.get("x-tenant-slug") || "a6-nyuss";

  // Fetch tenant info
  const tenantResult = await db
    .select()
    .from(schema.tenants)
    .where(eq(schema.tenants.slug, tenantSlug))
    .limit(1);

  const tenant = tenantResult[0] || null;

  return (
    <TenantProvider initialTenant={tenant as any}>
      <DashboardContainer initialTenant={tenant as any}>
        {children}
      </DashboardContainer>
    </TenantProvider>
  );
}
