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

  // Jika user belum login dan mengakses halaman dashboard terproteksi, redirect ke /login
  if (!isAuthRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Jika user sudah login dan mengakses halaman auth (/login atau /register), langsung lempar ke dashboard /
  if (isAuthRoute && hasSessionCookie && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const result = await resolveTenantMiddleware(request as any, 'owner');

  if ('redirect' in result) {
    return result.redirect;
  }

  if ('error' in result) {
    // Pada Cloud Run / Staging / shared URL (*.a.run.app / *.run.app / localhost),
    // tenant dapat di-resolve langsung dari user profile session di DashboardLayout.
    const isCloudPlatform =
      request.nextUrl.hostname.includes('.a.run.app') ||
      request.nextUrl.hostname.includes('.run.app') ||
      request.nextUrl.hostname.includes('localhost') ||
      request.nextUrl.hostname.includes('127.0.0.1');

    if (isAuthRoute || (isCloudPlatform && hasSessionCookie)) {
      return NextResponse.next();
    }
    return new NextResponse(result.error, { status: result.status });
  }

  return result.next;
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
