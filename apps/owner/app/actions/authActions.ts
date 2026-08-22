/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: SERVER ACTION PENDAFTARAN OWNER BARU (REGISTER OWNER ACTION)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini adalah "Server Action / Mesin Pendaftaran Toko Baru" yang dieksekusi saat Owner mendaftar bisnis baru.
 * Otomatis membuatkan Tenant Toko baru, Cabang Utama, Akun User Better Auth, dan Profil Pemilik (Owner Profile) dalam 1 alur terintegrasi.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT (Baris 35-45)    : Form Pendaftaran (Nama Owner, Nama Bisnis, Email, Password).
 * 2. CEK DUPLIKAT (Baris 48-58): Cek apakah email sudah terdaftar di database `schema.user`.
 * 3. ANGKAT SLUG (Baris 60-80) : Membuat slug URL unik (misal: "kopi-kenangan" -> `kopi-kenangan.com`).
 * 4. ISIAN TENANT & CABANG (Baris 82-110): Memasukkan record baru ke `schema.tenants` & `schema.branches`.
 * 5. SELESAI AUTH & PROFIL (Baris 112-135): Daftarkan User via Better Auth (`signUpEmail`) & set `schema.profiles.role = 'owner'`.
 * 6. COMPENSATING ROLLBACK (Baris 140-155): Jika step 5 gagal, hapus tenant & cabang yang sempat dibuat agar database tidak kotor.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Dikerjakan oleh Form UI: `apps/owner/app/(auth)/register/page.tsx`
 * - Membaca Skema Database: `packages/db` (`schema.tenants`, `schema.branches`, `schema.profiles`, `schema.user`)
 * - Terhubung ke Autentikasi: `lib/auth.ts` (`auth.api.signUpEmail`)
 * 
 * 🛠️ PETUNJUK PEMECAHAN MASALAH (TROUBLESHOOTING):
 * - Jika Pendaftaran Gagal "Email Sudah Terdaftar" -> Cek Baris 48-58.
 * - Jika Tenant Pemilik Tidak Terhubung ke Dashboard -> Cek Baris 125-135 (`schema.profiles` insert).
 * - Jika Terjadi Gagal Tengah Jalan (Partial Insert) -> Cek Baris 140-155 (Rollback logic).
 * =========================================================================================
 */

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

  // [BARIS 35-45]: TAHAP 1 - VALIDASI FORMULIR AWAL
  if (!name || !businessName || !email || !password) {
    return { success: false, error: "Harap isi semua kolom pendaftaran." };
  }

  if (password.length < 8) {
    return { success: false, error: "Password minimal 8 karakter." };
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    // [BARIS 48-58]: TAHAP 2 - PREFLIGHT CHECK (CEK EMAIL DUPLIKAT)
    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau login." };
    }

    // [BARIS 60-80]: TAHAP 3 - GENERATE SLUG UNIK DARI NAMA BISNIS
    // Mengubah "Warung Kopi" -> "warung-kopi". Jika sudah ada, menambahkan nomor (-1, -2)
    let baseSlug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!baseSlug) baseSlug = "bisnis-baru";

    let slug = baseSlug;
    let count = 1;

    while (count <= 20) {
      const existing = await db
        .select({ id: schema.tenants.id })
        .from(schema.tenants)
        .where(eq(schema.tenants.slug, slug))
        .limit(1);

      if (existing.length === 0) break;
      slug = `${baseSlug}-${count++}`;
    }

    // [BARIS 82-100]: TAHAP 4 - INJEKSI TENANT BARU KE DATABASE
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
      // [BARIS 103-110]: TAHAP 5 - MEMBUAT CABANG UTAMA DEFAULT UNTUK TENANT
      await db.insert(schema.branches).values({
        tenantId: newTenant.id,
        name: "Cabang Utama",
        city: "Pusat",
        status: "active",
      });

      // [BARIS 112-124]: TAHAP 6 - PENDAFTARAN AKUN USER DI ENGINE BETTER AUTH
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

      // [BARIS 125-136]: TAHAP 7 - ASSIGN ROLE 'OWNER' & PROFIL TENANT PERMANEN
      await db.update(schema.user).set({ role: "owner" }).where(eq(schema.user.id, createdUserId));

      await db.insert(schema.profiles).values({
        id: createdUserId,
        tenantId: newTenant.id,
        email: normalizedEmail,
        role: "owner",
        salary: "0",
      });

      // [BARIS 137-148]: TAHAP 7.5 - SEED INITIAL MENU CATEGORIES & ITEMS
      try {
        const [catMartabak] = await db.insert(schema.categories).values({
          tenantId: newTenant.id,
          name: 'Martabak Telur',
          slug: 'martabak-telur',
          sortOrder: 1,
        }).returning();

        const [catTerbul] = await db.insert(schema.categories).values({
          tenantId: newTenant.id,
          name: 'Terang Bulan',
          slug: 'terang-bulan',
          sortOrder: 2,
        }).returning();

        await db.insert(schema.menuItems).values([
          {
            tenantId: newTenant.id,
            categoryId: catMartabak.id,
            name: 'Martabak Telur Ayam - 1 Telur (Rp 20.000)',
            slug: 'martabak-telur-ayam-1-telur-20k',
            price: '20000',
            description: 'Martabak gurih dengan isian daging ayam cincang dan 1 butir telur ayam.',
            isAvailable: true,
          },
          {
            tenantId: newTenant.id,
            categoryId: catMartabak.id,
            name: 'Martabak Telur Bebek - 1 Telur (Rp 20.000)',
            slug: 'martabak-telur-bebek-1-telur-20k',
            price: '20000',
            description: 'Martabak gurih dengan isian daging bebek spesial dan 1 butir telur bebek.',
            isAvailable: true,
          },
          {
            tenantId: newTenant.id,
            categoryId: catTerbul.id,
            name: 'Terang Bulan 2 Variant Topping',
            slug: 'terang-bulan-2-variant-topping',
            price: '20000',
            description: 'Terang bulan lembut khas dengan kombinasi 2 pilihan topping.',
            isAvailable: true,
          },
        ]);
      } catch (seedMenuErr) {
        console.warn("[registerOwnerAction] Menu seeding warning:", seedMenuErr);
      }

      return {
        success: true,
        tenant: newTenant,
        user: userRes.user,
      };
    } catch (innerError) {
      // [BARIS 140-155]: TAHAP 8 - ROLLBACK OTOMATIS JIKA TERJADI EROR DI TENGAH JALAN
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
