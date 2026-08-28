import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export const middleware = async (request: NextRequest) => {
  // Bypass middleware during Next.js static build phase / internal prerender requests
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return NextResponse.next();
  }

  // Bypass if header indicates internal Next.js build worker
  const ua = request.headers.get('user-agent') || '';
  if (ua.includes('Next.js') || request.headers.get('x-next-prerender')) {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const isRegisterPage = pathname === '/register';
  const isAuthRoute = pathname === '/login' || pathname === '/register' || pathname === '/unauthorized';

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

  const hasSessionCookie = Boolean(
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value
  );

  if (!isAuthRoute && !hasSessionCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return result.next;
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
