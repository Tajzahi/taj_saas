import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import SDM from "../../../_pages/SDM";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let branchesList: any[] = [];
  let profilesList: any[] = [];
  let shiftsList: any[] = [];

  if (tenantId) {
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));

    profilesList = await db
      .select({
        id: schema.profiles.id,
        email: schema.profiles.email,
        role: schema.profiles.role,
        createdAt: schema.profiles.createdAt,
      })
      .from(schema.profiles)
      .where(eq(schema.profiles.tenantId, tenantId));

    shiftsList = await db
      .select({
        id: schema.shifts.id,
        openedAt: schema.shifts.openedAt,
        operatorName: schema.shifts.operatorName,
        status: schema.shifts.status,
        cabang: schema.branches.name,
      })
      .from(schema.shifts)
      .leftJoin(schema.branches, eq(schema.shifts.branchId, schema.branches.id))
      .where(eq(schema.shifts.tenantId, tenantId));
  }

  // 1. Map profiles to employees list
  const mappedEmployees = profilesList.map((p, idx) => ({
    id: p.id,
    name: p.email.split("@")[0].replace(".", " "), // pretty name from email
    role: p.role === "owner" ? "Owner" : p.role === "manager" ? "Manager" : "Kasir",
    cabang: branchesList[idx % (branchesList.length || 1)]?.name || "Pusat",
    shift: idx % 2 === 0 ? "Pagi" : "Sore",
    salary: p.role === "owner" ? 10000000 : p.role === "manager" ? 5000000 : 3200000,
    hours: 8,
    status: "active",
  }));

  // 2. Map shifts to shiftData format
  const mappedShiftData = shiftsList.map((s) => ({
    id: s.id,
    cabang: s.cabang || "Pusat",
    shift: s.openedAt.getHours() < 15 ? "Pagi" : "Sore",
    staff: [s.operatorName || "Kasir"],
    kasir: s.operatorName || "Kasir",
    status: s.status === "open" ? "active" : "vacant",
    sales: s.status === "open" ? 4500000 : 0,
  }));

  // 3. Map branches to cabangList format
  const mappedCabangList = branchesList.map((b, idx) => ({
    id: b.id,
    name: b.name,
    revenue: 30000000 + idx * 5000000,
    laborCost: 14.5 + (idx % 3) * 1.5,
  }));

  return (
    <SDM
      initialEmployees={mappedEmployees}
      initialShiftData={mappedShiftData}
      initialCabangList={mappedCabangList}
    />
  );
}
