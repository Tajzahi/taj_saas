import { headers } from "next/headers";
import { auth } from "../../../lib/auth";
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

  return (
    <AdminClientPage
      tenantId={tenantId}
      tenantSlug={tenantSlug}
      initialSession={session}
    />
  );
}
