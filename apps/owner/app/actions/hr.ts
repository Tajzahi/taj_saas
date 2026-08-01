"use server";

import { db, schema } from "@taj-saas/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getTenantId } from "./_tenantHelper";

export async function getProfilesAction() {
  try {
    const tenantId = await getTenantId();
    const profilesWithUsers = await db
      .select({
        id: schema.profiles.id,
        email: schema.profiles.email,
        role: schema.profiles.role,
        salary: schema.profiles.salary,
        createdAt: schema.profiles.createdAt,
        name: schema.user.name,
      })
      .from(schema.profiles)
      .leftJoin(schema.user, eq(schema.profiles.id, schema.user.id))
      .where(eq(schema.profiles.tenantId, tenantId));
      
    return { success: true, data: profilesWithUsers };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function createEmployeeAction(data: {
  name: string;
  email: string;
  role: string;
  salary?: number;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    const userId = "u-" + Math.random().toString(36).substring(2, 15);

    // 1. Insert user
    await db.insert(schema.user).values({
      id: userId,
      name: data.name,
      email: data.email,
      emailVerified: true,
    });

    // 2. Insert profile
    const [profile] = await db.insert(schema.profiles).values({
      id: userId,
      tenantId,
      email: data.email,
      role: data.role,
      salary: String(data.salary || 0),
    }).returning();

    revalidatePath("/sdm");
    return { 
      success: true, 
      data: { ...profile, name: data.name },
      message: "Karyawan berhasil ditambahkan. Minta karyawan menggunakan fitur 'Lupa Password' untuk membuat password pertama kali.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateEmployeeAction(data: {
  id: string;
  name: string;
  role: string;
  salary: number;
}) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    // 1. Update user name
    await db.update(schema.user).set({ name: data.name }).where(eq(schema.user.id, data.id));

    // 2. Update profile role and salary
    const [profile] = await db
      .update(schema.profiles)
      .set({
        role: data.role,
        salary: String(data.salary || 0),
      })
      .where(and(eq(schema.profiles.id, data.id), eq(schema.profiles.tenantId, tenantId)))
      .returning();

    revalidatePath("/sdm");
    return { success: true, data: { ...profile, name: data.name } };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function deleteEmployeeAction(id: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");

    await db.delete(schema.profiles).where(and(eq(schema.profiles.id, id), eq(schema.profiles.tenantId, tenantId)));
    await db.delete(schema.account).where(eq(schema.account.userId, id));
    await db.delete(schema.user).where(eq(schema.user.id, id));

    revalidatePath("/sdm");
    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}

export async function updateStaffRoleAction(profileId: string, role: string) {
  try {
    const tenantId = await getTenantId();
    if (!tenantId) throw new Error("Tenant not found");
    const [profile] = await db.update(schema.profiles).set({ role })
      .where(and(eq(schema.profiles.id, profileId), eq(schema.profiles.tenantId, tenantId)))
      .returning();
    if (!profile) throw new Error("Profile tidak ditemukan atau akses tidak diizinkan.");
    revalidatePath("/sdm");
    return { success: true, data: profile };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan sistem";
    return { success: false, error: message };
  }
}
