/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: AUTENTIKASI UTAMA SERVER (SERVER-SIDE BETTER AUTH)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Berkas ini adalah "Mesin Autentikasi Induk" yang mengelola pembuatan akun, validasi kata sandi,
 * pembuatan token sesi (session token), dan keamanan cookie untuk seluruh aplikasi (Customer, Owner, Admin).
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT (Baris 18-28)   : Menerima kredensial (email & password) dari formulir login/register.
 * 2. PROSES (Baris 38-42)  : Mencocokkan hash password ke database PostgreSQL (`packages/db`).
 * 3. OUTPUT (Baris 62-70)  : Mengeluarkan cookie sesi aman (`__Secure-better-auth.session_token`).
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Terhubung ke API client: `lib/auth-client.ts` & `apps/owner/lib/authClient.ts`
 * - Terhubung ke Otorisasi: `lib/tenant-authorization.ts` (Validasi Sesi Halaman)
 * - Terhubung ke Server Action: `apps/owner/app/actions/authActions.ts` (Pendaftaran Owner Baru)
 * 
 * 🛠️ PETUNJUK PEMECAHAN MASALAH (TROUBLESHOOTING):
 * - Jika Login Gagal di Cloud Run / HTTPS  -> Periksa Baris 25-36 (Resolusi Protocol HTTPS & Cookie Domain).
 * - Jika CORS Error dari Domain Lain       -> Periksa Baris 43-52 (Trusted Origins).
 * =========================================================================================
 */

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, schema } from "@taj-saas/db";

// [BARIS 25-28]: Validasi kunci rahasia server (Wajib diset di .env atau GCP Secret Manager)
if (!process.env.BETTER_AUTH_SECRET) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET env var is required but not set. " +
    "Set a strong random 32+ character secret in your .env file."
  );
}

// [BARIS 31-36]: FITUR RESOLUSI PROTOKOL HTTPS AUTOMATIS
// Mengubah http:// menjadi https:// di lingkungan produksi (Cloud Run) agar cookie secure diterima browser.
const rawBaseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000";
const baseURL = (process.env.NODE_ENV === "production" && !rawBaseUrl.includes("localhost"))
  ? rawBaseUrl.replace(/^http:\/\//i, "https://")
  : rawBaseUrl;

// [BARIS 39-44]: FITUR PENCEGAHAN DOMAIN MISMATCH RFC 6265
// BUG FIX: Dihapus kondisi !(K_SERVICE || CLOUD_RUN_JOB) karena Cloud Run selalu
// men-set K_SERVICE, sehingga crossSubDomainCookies tidak pernah aktif.
// Sekarang cukup: cookieDomain harus ada dan bukan localhost.
const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
const shouldEnableCrossDomain = Boolean(
  cookieDomain &&
  !cookieDomain.includes("localhost")
);

// [BARIS 47-80]: KONFIGURASI ENGINE AUTENTIKASI UTAMA
export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: { enabled: true },
  
  // [BARIS 53-62]: Domain terpercaya yang diizinkan melakukan request API Auth
  trustedOrigins: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "https://*.a.run.app",
    "https://*.run.app",
    "https://*.netlify.app",
    "https://*.vercel.app",
  ],
  
  // [BARIS 64-73]: Atribut tambahan pada tabel user (Menyimpan Role: owner/manager/kasir)
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "kasir",
        input: false,
      },
    },
  },
  
  // [BARIS 75-84]: Pengaturan keamanan cookie produksi
  advanced: {
    generateId: () => crypto.randomUUID(),
    useSecureCookies: process.env.NODE_ENV === "production",
    ...(shouldEnableCrossDomain ? {
      crossSubDomainCookies: {
        enabled: true,
        domain: cookieDomain
      }
    } : {})
  }
});
