import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export const middleware = async (request: NextRequest) => {
  // Bypass middleware during Next.js static build phase / internal prerender requests
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }


  const { pathname } = request.nextUrl;
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/accept-invite');

  const hasSessionCookie = Boolean(
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value
  );

  // Jika di halaman auth (login/register/dll), persilakan lanjut agar form selalu bisa diakses
  // JANGAN lakukan blind redirect ke '/' dari '/login' berbasis cookie semata karena jika sesi di DB
  // expired atau sudah terhapus, akan tercipta infinite redirect loop (ERR_TOO_MANY_REDIRECTS).
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Jika user belum login dan mengakses halaman dashboard terproteksi, redirect ke /login
  if (!hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Periksa apakah request berada di shared SaaS platform (Cloud Run, localhost, staging)
  const host = (
    request.headers.get('x-forwarded-host') ||
    request.headers.get('host') ||
    request.nextUrl.hostname ||
    ''
  ).toLowerCase();

  const isSharedPlatform =
    host.includes('.a.run.app') ||
    host.includes('.run.app') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.startsWith('taj-owner');

  // Pada Cloud Run / shared portal mall, URL ini dipakai bersama oleh semua owner.
  // Tenant di-resolve langsung dari sesi profil user yang login di DashboardLayout / Server Action.
  // Jangan jalankan resolveTenantMiddleware karena URL bersama tidak memiliki slug khusus di database.
  if (isSharedPlatform) {
    return NextResponse.next();
  }

  // Jika menggunakan custom domain pribadi (misal: owner.namatoko.com), resolve tenant dari database
  const result = await resolveTenantMiddleware(request as any, 'owner');

  if ('redirect' in result) {
    return result.redirect;
  }

  if ('error' in result) {
    return new NextResponse(result.error, { status: result.status });
  }

  return result.next;
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
