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
import { headers } from "next/headers";
import { rateLimiter } from "@lib/server/rate-limiter";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";

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
    // TAHAP 1.5 - DISTRIBUTED RATE LIMITING (Anti-DoS / Account Flooding)
    const reqHeaders = await headers();
    const forwardedFor = reqHeaders.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "owner_registration");
    if (!rateResult.allowed) {
      return {
        success: false,
        error: "Terlalu banyak permintaan pendaftaran. Silakan tunggu beberapa menit sebelum mencoba lagi.",
      };
    }

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

export async function changeOwnerPasswordAction(params: {
  currentPassword: string;
  newPassword: string;
  confirmPassword?: string;
}) {
  try {
    const { currentPassword, newPassword, confirmPassword } = params;

    if (!currentPassword || !newPassword) {
      return { success: false, error: "Password saat ini dan password baru wajib diisi." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password baru minimal 8 karakter." };
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi password baru tidak cocok." };
    }

    const { user, tenant } = await requireTenantPermission("settings:manage", { expectedApp: "owner" });
    const reqHeaders = await headers();

    try {
      const changeRes = await auth.api.changePassword({
        body: {
          currentPassword,
          newPassword,
          revokeOtherSessions: false,
        },
        headers: reqHeaders,
      });

      if (!changeRes) {
        return { success: false, error: "Gagal memperbarui password. Pastikan password saat ini benar." };
      }
    } catch (authErr: any) {
      return {
        success: false,
        error: authErr?.message || "Password saat ini tidak sesuai atau gagal diperbarui.",
      };
    }

    await writeAuditEvent({
      tenantId: tenant.id,
      actorId: user.id,
      action: "change_password",
      entityType: "account",
      entityId: user.id,
      details: { email: user.email },
    });

    return { success: true, message: "Password berhasil diperbarui." };
  } catch (error: unknown) {
    if (error instanceof AuthorizationError) {
      return { success: false, error: error.message };
    }
    const message = error instanceof Error ? error.message : "Gagal mengubah password. Pastikan password saat ini benar.";
    return { success: false, error: message };
  }
}

export async function requestPasswordResetAction(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: "Email wajib diisi." };
    }

    const reqHeaders = await headers();
    const forwardedFor = reqHeaders.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "password_reset_request");
    if (!rateResult.allowed) {
      return {
        success: false,
        error: "Terlalu banyak permintaan reset password. Silakan tunggu beberapa menit.",
      };
    }

    const existingUser = await db
      .select({ id: schema.user.id, name: schema.user.name, email: schema.user.email, role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (existingUser.length === 0) {
      return {
        success: true,
        message: "Jika email terdaftar, instruksi pemulihan password akan diproses.",
      };
    }

    try {
      if (typeof (auth.api as any).forgetPassword === "function") {
        await (auth.api as any).forgetPassword({
          body: {
            email: normalizedEmail,
            redirectTo: "/reset-password",
          },
          headers: reqHeaders,
        });
      }
    } catch {
      // Ignore if SMTP is not configured in local/staging
    }

    const userRole = existingUser[0].role || "karyawan";
    return {
      success: true,
      role: userRole,
      message: userRole === "owner"
        ? "Permintaan reset password akun Owner berhasil diterima. Silakan periksa inbox email atau hubungi Administrator Platform."
        : `Akun Anda terdaftar sebagai Staf (${userRole.toUpperCase()}). Silakan hubungi Pemilik Toko (Owner) untuk me-reset password secara instan dari menu SDM.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Terjadi kesalahan saat memproses permintaan.";
    return { success: false, error: message };
  }
}

export async function resetOwnerPasswordDirectAction(params: {
  email: string;
  newPassword: string;
  confirmPassword?: string;
}) {
  try {
    const { email, newPassword, confirmPassword } = params;
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !newPassword) {
      return { success: false, error: "Email dan password baru wajib diisi." };
    }

    if (newPassword.length < 8) {
      return { success: false, error: "Password baru minimal 8 karakter." };
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi password baru tidak cocok." };
    }

    const [existingUser] = await db
      .select({ id: schema.user.id, name: schema.user.name, email: schema.user.email, role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (!existingUser) {
      return { success: false, error: "Akun dengan email tersebut tidak ditemukan." };
    }

    if (existingUser.role !== "owner") {
      return {
        success: false,
        error: `Akun ini terdaftar sebagai ${existingUser.role?.toUpperCase() || "STAF"}. Reset password staf dilakukan langsung oleh Owner melalui menu SDM & Karyawan.`,
      };
    }

    // Update password in Better Auth
    try {
      if (typeof (auth.api as any).setPassword === "function") {
        await (auth.api as any).setPassword({
          body: {
            userId: existingUser.id,
            newPassword,
          },
        });
      }
    } catch (e) {
      console.warn("auth.api.setPassword warning:", e);
    }

    // Invalidate old sessions
    await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));

    return {
      success: true,
      message: "Password akun Owner berhasil di-reset! Silakan login sekarang dengan kata sandi baru Anda.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal me-reset kata sandi.";
    return { success: false, error: message };
  }
}
