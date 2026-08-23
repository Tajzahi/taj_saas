import { headers } from "next/headers";
import { auth } from "@lib/auth";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import AdminClientPage from "./AdminClientPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");
  const tenantSlug = headersList.get("x-tenant-slug");

  // Fetch session on server side for SEO and speed
  const session = await auth.api.getSession({
    headers: headersList,
  });

  let tenantInfo: { name: string; branding: any } | null = null;
  if (tenantId) {
    try {
      const [t] = await db
        .select({ name: schema.tenants.name, branding: schema.tenants.branding })
        .from(schema.tenants)
        .where(eq(schema.tenants.id, tenantId))
        .limit(1);
      if (t) tenantInfo = t;
    } catch (err) {
      console.warn("Could not load tenant branding in Admin Page:", err);
    }
  }

  return (
    <AdminClientPage
      tenantId={tenantId}
      tenantSlug={tenantSlug}
      initialSession={session}
      tenantName={tenantInfo?.name || null}
      tenantBranding={tenantInfo?.branding || null}
    />
  );
}
