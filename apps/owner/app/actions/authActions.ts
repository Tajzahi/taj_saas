"use server";

import { db, schema } from "@taj-saas/db";
import { auth } from "@/../../lib/auth";
import { eq } from "drizzle-orm";

interface RegisterParams {
  name: string;
  businessName: string;
  email: string;
  password: string;
}

export async function registerOwnerAction(params: RegisterParams) {
  const { name, businessName, email, password } = params;

  if (!name || !businessName || !email || !password) {
    return { success: false, error: "Harap isi semua kolom pendaftaran." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password minimal 8 karakter." };
  }

  try {
    // 1. Generate unique slug from business name
    let baseSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    
    if (!baseSlug) baseSlug = "bisnis-baru";

    let slug = baseSlug;
    let count = 1;

    // Check for existing slug collisions
    while (true) {
      const existing = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      slug = `${baseSlug}-${count++}`;
    }

    // 2. Insert new Tenant for this business owner
    const [newTenant] = await db
      .insert(schema.tenants)
      .values({
        name: businessName,
        slug: slug,
        domain: `${slug}.com`,
        adminSubdomain: "admin",
        ownerSubdomain: "owner",
        branding: {
          businessName: businessName,
          primaryColor: "#D94708",
          secondaryColor: "#E05009",
        },
        packageType: "enterprise",
        isActive: true,
      })
      .returning();

    // 3. Create default branch for this new tenant
    await db.insert(schema.branches).values({
      tenantId: newTenant.id,
      name: "Cabang Utama",
      city: "Pusat",
      status: "active",
    });

    // 4. Create User via Better Auth API
    const userRes = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    if (!userRes || !userRes.user) {
      return { success: false, error: "Gagal membuat akun user." };
    }

    const userId = userRes.user.id;

    // 5. Update user role to 'owner' and linked profile tenant
    await db.update(schema.user).set({ role: "owner" }).where(eq(schema.user.id, userId));

    await db.update(schema.profiles).set({
      tenantId: newTenant.id,
      role: "owner",
    }).where(eq(schema.profiles.id, userId));

    return {
      success: true,
      data: {
        tenantId: newTenant.id,
        tenantSlug: newTenant.slug,
        tenantName: newTenant.name,
      },
    };
  } catch (err: any) {
    console.error("[registerOwnerAction] Error:", err);
    return {
      success: false,
      error: err.message || "Terjadi kesalahan saat membuat toko dan akun.",
    };
  }
}
