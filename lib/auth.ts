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

// [BARIS 31-36]: FITUR RESOLUSI PROTOKOL HTTPS AUTOMATIS & SERVICE-AWARE BASE URL
// Memastikan baseURL sesuai dengan service Cloud Run yang sedang berjalan (owner/admin/customer)
const resolveBaseURL = () => {
  if (process.env.K_SERVICE === 'taj-owner' && process.env.OWNER_APP_URL) {
    return process.env.OWNER_APP_URL.replace(/^http:\/\//i, "https://");
  }
  if (process.env.K_SERVICE === 'taj-admin' && process.env.ADMIN_APP_URL) {
    return process.env.ADMIN_APP_URL.replace(/^http:\/\//i, "https://");
  }
  const raw = process.env.BETTER_AUTH_URL || "http://localhost:3000";
  return (process.env.NODE_ENV === "production" && !raw.includes("localhost"))
    ? raw.replace(/^http:\/\//i, "https://")
    : raw;
};
const baseURL = resolveBaseURL();

// [BARIS 39-44]: FITUR PENCEGAHAN DOMAIN MISMATCH RFC 6265 & PUBLIC SUFFIX LIST
// Browser akan menolak (drop) cookie jika domain diset ke Public Suffix (*.a.run.app, *.run.app).
// Cross-subdomain cookie hanya diaktifkan jika domain kustom asli (misal .martabakpakde.com).
const cookieDomain = process.env.COOKIE_DOMAIN?.trim();
const isPublicSuffix = Boolean(
  cookieDomain && (
    cookieDomain.endsWith('.a.run.app') ||
    cookieDomain.endsWith('.run.app') ||
    cookieDomain.includes('localhost')
  )
);
const shouldEnableCrossDomain = Boolean(
  cookieDomain &&
  !isPublicSuffix
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
    ...(process.env.TRUSTED_ORIGINS ? process.env.TRUSTED_ORIGINS.split(',').map(s => s.trim()) : []),
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
