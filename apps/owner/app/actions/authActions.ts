"use server";

import { db, schema } from "@taj-saas/db";
import { auth } from "@lib/auth";
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

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // 1. Preflight check: prevent duplicate user registration before creating tenant
    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau login." };
    }

    // 2. Generate unique slug from business name
    let baseSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) baseSlug = "bisnis-baru";

    let slug = baseSlug;
    let count = 1;

    // Check for existing slug collisions (limit 20 iterations)
    while (count <= 20) {
      const existing = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(eq(schema.tenants.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      slug = `${baseSlug}-${count++}`;
    }

    // 3. Insert new Tenant for this business owner
    const [newTenant] = await db
      .insert(schema.tenants)
      .values({
        name: businessName.trim(),
        slug: slug,
        domain: `${slug}.com`,
        adminSubdomain: "admin",
        ownerSubdomain: "owner",
        branding: {
          businessName: businessName.trim(),
          primaryColor: "#D94708",
          secondaryColor: "#E05009",
        },
        packageType: "enterprise",
        isActive: true,
      })
      .returning();

    let createdUserId: string | null = null;

    try {
      // 4. Create default branch for this new tenant
      await db.insert(schema.branches).values({
        tenantId: newTenant.id,
        name: "Cabang Utama",
        city: "Pusat",
        status: "active",
      });

      // 5. Create User via Better Auth API
      const userRes = await auth.api.signUpEmail({
        body: {
          email: normalizedEmail,
          password,
          name: name.trim(),
        },
      });

      if (!userRes || !userRes.user) {
        throw new Error("Gagal membuat akun user melalui authentication service.");
      }

      createdUserId = userRes.user.id;

      // 6. Update user role and insert profile row explicitly for this tenant
      await db.update(schema.user).set({ role: "owner" }).where(eq(schema.user.id, createdUserId));

      await db.insert(schema.profiles).values({
        id: createdUserId,
        tenantId: newTenant.id,
        email: normalizedEmail,
        role: "owner",
        salary: "0",
      });

      return {
        success: true,
        tenant: newTenant,
        user: userRes.user,
      };
    } catch (innerError) {
      // Compensating rollback cleanup on user creation failure
      console.error("[registerOwnerAction] Inner failure, rolling back tenant:", innerError);
      if (createdUserId) {
        await db.delete(schema.profiles).where(eq(schema.profiles.id, createdUserId));
        await db.delete(schema.user).where(eq(schema.user.id, createdUserId));
      }
      await db.delete(schema.branches).where(eq(schema.branches.tenantId, newTenant.id));
      await db.delete(schema.tenants).where(eq(schema.tenants.id, newTenant.id));
      throw innerError;
    }
  } catch (error: unknown) {
    console.error("[registerOwnerAction] Registration error:", error);
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat pendaftaran.";
    return { success: false, error: message };
  }
}
