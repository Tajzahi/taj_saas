/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: MIDDLEWARE GERBANG KEAMANAN OWNER (OWNER GATEKEEPER)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * File ini bertindak sebagai "Satpam/Gerbang Keamanan Utama" untuk seluruh permintaan HTTP di aplikasi Owner.
 * Menyeleksi apakah permintaan datang ke halaman login/register, memvalidasi tenant domain,
 * dan memastikan hanya pengguna yang sudah terautentikasi (Owner/Manager) yang bisa masuk ke Dashboard.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. INPUT (Baris 30-34)   : Menerima request URL & header cookie dari browser pengguna.
 * 2. PROSES TENANT (Baris 36-50): Memeriksa domain/slug toko via `resolveTenantMiddleware`.
 * 3. PROSES AUTENTIKASI (Baris 52-73): Memeriksa sesi cookie pengguna via `auth.api.getSession`.
 * 4. OUTPUT / REDIRECT (Baris 75-87): 
 *    - Jika belum login & akses Dashboard -> Redirect ke `/login`.
 *    - Jika sudah login & akses `/login` -> Redirect ke Dashboard `/`.
 *    - Jika Role = 'kasir' -> Redirect ke `/unauthorized`.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Terhubung ke Engine Multi-Tenant : `packages/shared/tenant.ts` (`resolveTenantMiddleware`)
 * - Terhubung ke Server Authentication: `lib/auth.ts` (`auth.api.getSession`)
 * - Terhubung ke Halaman Login/Register: `apps/owner/app/(auth)/login/page.tsx` & `register/page.tsx`
 * 
 * 🛠️ PETUNJUK PEMECAHAN MASALAH (TROUBLESHOOTING):
 * - Jika Terjadi Infinite Login Loop     -> Periksa Baris 52-73 (Pemeriksaan HTTPS & Header Cookie `x-forwarded-proto`).
 * - Jika Tenant 404 pada Domain Baru     -> Periksa Baris 36-50 (Resolusi Slug Tenant).
 * =========================================================================================
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export const middleware = async (request: NextRequest) => {
  // [BARIS 30-34]: Identifikasi Jalur Halaman (Pathname)
  const { pathname } = request.nextUrl;
  const isRegisterPage = pathname === '/register';
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/unauthorized';

  // [BARIS 36-50]: TAHAP 1 - VALIDASI TENANT / DOMAIN TOKO
  // Memastikan domain request cocok dengan database toko (misal: owner.taj-saas.com atau taj-owner-*.a.run.app)
  const result = await resolveTenantMiddleware(request as any, 'owner');

  if ('redirect' in result) {
    return result.redirect;
  }

  if ('error' in result) {
    if (result.status === 404 && !isRegisterPage) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    if (isRegisterPage) {
      return NextResponse.next();
    }
    return new NextResponse(result.error, { status: result.status });
  }

  // [BARIS 52-87]: TAHAP 2 - PROTEKSI HALAMAN DASHBOARD
  // Jika pengguna belum login (tidak ada cookie sesi) dan mencoba mengakses route non-auth -> Arahkan ke /login
  const hasSessionCookie = Boolean(
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value
  );

  if (!isAuthRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return result.next;
}

// [BARIS 91-96]: Konfigurasi pencocokan rute yang dilewati middleware (Aset statis & API Auth dilewati)
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
