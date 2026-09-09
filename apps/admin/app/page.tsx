import { headers } from "next/headers";
import { auth } from "@lib/auth";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import AdminClientPage from "./AdminClientPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const headersList = await headers();
  let tenantId = headersList.get("x-tenant-id");
  let tenantSlug = headersList.get("x-tenant-slug");

  // Fetch session on server side for SEO and speed
  const session = await auth.api.getSession({
    headers: headersList,
  });

  // Jika user sudah login dan tenantId belum ada di header (misal diakses via Cloud Run portal bersama),
  // ambil tenantId dari profile user
  if (session?.user?.id && (!tenantId || !tenantSlug)) {
    try {
      const [profile] = await db
        .select({ tenantId: schema.profiles.tenantId })
        .from(schema.profiles)
        .where(eq(schema.profiles.id, session.user.id))
        .limit(1);

      if (profile?.tenantId) {
        tenantId = profile.tenantId;
        const [tenantRecord] = await db
          .select({ slug: schema.tenants.slug })
          .from(schema.tenants)
          .where(eq(schema.tenants.id, profile.tenantId))
          .limit(1);
        if (tenantRecord) tenantSlug = tenantRecord.slug;
      }
    } catch (err) {
      console.warn("Could not load profile tenant in Admin Page:", err);
    }
  }

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
