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
import { eq, and, gt } from "drizzle-orm";
import { headers } from "next/headers";
import { rateLimiter } from "@lib/server/rate-limiter";
import { requireTenantPermission, writeAuditEvent, AuthorizationError } from "@lib/tenant-authorization";
import crypto from "crypto";

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

export async function requestPasswordResetOtpAction(email: string) {
  try {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { success: false, error: "Alamat email wajib diisi." };
    }

    const reqHeaders = await headers();
    const forwardedFor = reqHeaders.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "password_reset_otp_request");
    if (!rateResult.allowed) {
      return {
        success: false,
        error: "Terlalu banyak permintaan OTP. Demi keamanan, silakan tunggu 2 menit sebelum mencoba kembali.",
      };
    }

    const [existingUser] = await db
      .select({ id: schema.user.id, name: schema.user.name, email: schema.user.email, role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (!existingUser) {
      return {
        success: false,
        error: "Akun dengan email tersebut tidak ditemukan dalam sistem.",
      };
    }

    if (existingUser.role !== "owner") {
      return {
        success: false,
        error: `Akun ini terdaftar sebagai ${existingUser.role?.toUpperCase() || "STAF"}. Reset password staf dilakukan langsung oleh Owner melalui menu SDM & Karyawan.`,
      };
    }

    // 1. Generate Cryptographically Secure 6-Digit OTP
    // Range 100000 - 999999 (CSPRNG via crypto.randomInt)
    const otp = crypto.randomInt(100000, 1000000).toString();

    // 2. Hash the OTP before saving to database (SHA-256 + Email Salt)
    const salt = normalizedEmail;
    const otpHash = crypto.createHash("sha256").update(`${otp}:${salt}`).digest("hex");
    const identifier = `reset_otp:${normalizedEmail}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 Minutes expiry

    // 3. Clean up prior OTP tokens for this identifier and insert new token
    await db.delete(schema.verification).where(eq(schema.verification.identifier, identifier));

    await db.insert(schema.verification).values({
      id: crypto.randomUUID(),
      identifier,
      value: otpHash,
      expiresAt,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(`[AUTH SECURITY] 🛡️ Secure OTP generated for ${normalizedEmail} (Expires in 15 mins). OTP: [${otp}]`);

    // 4. Try sending email via Better Auth / SMTP if configured
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
    } catch (mailErr) {
      console.warn("[requestPasswordResetOtpAction] Email service notice:", mailErr);
    }

    return {
      success: true,
      email: normalizedEmail,
      message: "Kode OTP verifikasi (6 digit) telah diterbitkan. Masukkan kode OTP tersebut untuk mengonfirmasi kepemilikan akun.",
      // Provide preview hint in development/staging environment for testing
      debugOtpHint: process.env.NODE_ENV !== "production" ? otp : undefined,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memproses permintaan kode OTP.";
    return { success: false, error: message };
  }
}

export async function verifyOtpAndResetPasswordAction(params: {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword?: string;
}) {
  try {
    const { email, otp, newPassword, confirmPassword } = params;
    const normalizedEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim().replace(/[^0-9]/g, "");

    if (!normalizedEmail || !cleanOtp) {
      return { success: false, error: "Email dan Kode OTP 6-digit wajib diisi." };
    }

    if (cleanOtp.length !== 6) {
      return { success: false, error: "Kode OTP harus berupa 6 digit angka." };
    }

    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password baru minimal 8 karakter." };
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      return { success: false, error: "Konfirmasi password baru tidak cocok." };
    }

    const reqHeaders = await headers();
    const forwardedFor = reqHeaders.get("x-forwarded-for") || "";
    const clientIp = forwardedFor.split(",")[0]?.trim() || "127.0.0.1";

    const rateResult = await rateLimiter.check(clientIp, "password_reset_otp_verify");
    if (!rateResult.allowed) {
      return {
        success: false,
        error: "Terlalu banyak percobaan verifikasi yang salah. Silakan coba lagi setelah 5 menit.",
      };
    }

    const identifier = `reset_otp:${normalizedEmail}`;
    const targetHash = crypto.createHash("sha256").update(`${cleanOtp}:${normalizedEmail}`).digest("hex");

    // Check valid non-expired OTP matching the cryptographically secure hash
    const [validToken] = await db
      .select()
      .from(schema.verification)
      .where(
        and(
          eq(schema.verification.identifier, identifier),
          eq(schema.verification.value, targetHash),
          gt(schema.verification.expiresAt, new Date())
        )
      )
      .limit(1);

    if (!validToken) {
      return {
        success: false,
        error: "Kode OTP tidak valid atau sudah kedaluwarsa (masa berlaku 15 menit). Silakan periksa kembali atau minta OTP baru.",
      };
    }

    const [existingUser] = await db
      .select({ id: schema.user.id, name: schema.user.name, email: schema.user.email, role: schema.user.role })
      .from(schema.user)
      .where(eq(schema.user.email, normalizedEmail))
      .limit(1);

    if (!existingUser) {
      return { success: false, error: "Akun pemilik tidak ditemukan." };
    }

    // 1. Hash password with Better Auth's standard scrypt crypto engine
    const { hashPassword } = await import("better-auth/crypto");
    const hashedPassword = await hashPassword(newPassword);

    const [existingAccount] = await db
      .select()
      .from(schema.account)
      .where(and(eq(schema.account.userId, existingUser.id), eq(schema.account.providerId, "credential")))
      .limit(1);

    if (existingAccount) {
      await db
        .update(schema.account)
        .set({ password: hashedPassword, updatedAt: new Date() })
        .where(eq(schema.account.id, existingAccount.id));
    } else {
      await db.insert(schema.account).values({
        id: crypto.randomUUID(),
        accountId: existingUser.id,
        providerId: "credential",
        userId: existingUser.id,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // 2. Single-use: Immediately delete the consumed OTP token
    await db.delete(schema.verification).where(eq(schema.verification.identifier, identifier));

    // 3. Security: Invalidate all existing sessions on all devices
    await db.delete(schema.session).where(eq(schema.session.userId, existingUser.id));

    // 4. Audit Log
    const [profile] = await db
      .select({ tenantId: schema.profiles.tenantId })
      .from(schema.profiles)
      .where(eq(schema.profiles.id, existingUser.id))
      .limit(1);

    if (profile?.tenantId) {
      await writeAuditEvent({
        tenantId: profile.tenantId,
        actorId: existingUser.id,
        action: "reset_password_via_otp",
        entityType: "account",
        entityId: existingUser.id,
        details: { email: existingUser.email, method: "otp_verification_verified" },
      });
    }

    return {
      success: true,
      message: "Kata sandi akun Owner berhasil diperbarui dengan aman! Silakan login dengan kata sandi baru Anda.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Gagal memverifikasi OTP dan me-reset kata sandi.";
    return { success: false, error: message };
  }
}
