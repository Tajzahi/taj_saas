import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq, desc } from "drizzle-orm";
import Pengaturan from "../../../_pages/Pengaturan";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let tenantDataObj: any = null;
  let auditLogsList: any[] = [];
  let profilesList: any[] = [];
  let branchesList: any[] = [];

  if (tenantId) {
    // 1. Fetch current tenant details
    const [tenant] = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.id, tenantId));

    if (tenant) {
      tenantDataObj = {
        id: tenant.id,
        name: tenant.name,
        brandName: tenant.branding?.businessName || tenant.name,
        primaryColor: tenant.branding?.primaryColor || "#f97316",
        secondaryColor: tenant.branding?.secondaryColor || "#ef4444",
        logo: tenant.branding?.logoUrl || "🥞",
      };
    }

    // 2. Fetch audit logs
    auditLogsList = await db
      .select()
      .from(schema.auditLogs)
      .where(eq(schema.auditLogs.tenantId, tenantId))
      .orderBy(desc(schema.auditLogs.createdAt))
      .limit(20);

    // 3. Fetch branches
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));

    // 4. Fetch profiles
    profilesList = await db
      .select({
        id: schema.profiles.id,
        email: schema.profiles.email,
        role: schema.profiles.role,
      })
      .from(schema.profiles)
      .where(eq(schema.profiles.tenantId, tenantId));
  }

  // Map users list
  const mappedUsers = profilesList.map((p, idx) => ({
    id: p.id,
    name: p.email.split("@")[0].replace(".", " "),
    email: p.email,
    role: p.role === "owner" ? "Owner" : p.role === "manager" ? "Manajer Cabang" : "Kasir",
    cabang: branchesList[idx % (branchesList.length || 1)]?.name || "Semua",
    status: "active",
  }));

  // Map audit logs
  const mappedAuditLogs = auditLogsList.map((log) => {
    const d = new Date(log.createdAt);
    const timeStr = `${d.getDate()} ${
      ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][
        d.getMonth()
      ]
    } ${d.getFullYear()}, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes()
      .toString()
      .padStart(2, "0")}`;
    return {
      id: log.id,
      user: log.operatorName || "System",
      action: log.action,
      module: log.module || "Sistem",
      timestamp: timeStr,
      ip: log.ipAddress || "127.0.0.1",
    };
  });

  return (
    <Pengaturan
      initialTenantData={tenantDataObj}
      initialAuditLog={mappedAuditLogs}
      initialUsers={mappedUsers}
    />
  );
}
