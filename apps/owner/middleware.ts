import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';
import { auth } from '@lib/auth';

export const middleware = async (request: NextRequest) => {
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

  // Auth check
  let session: any = null;
  try {
    session = await auth.api.getSession({
      headers: request.headers,
    });
  } catch (err) {
    try {
      const res = await fetch(`${request.nextUrl.origin}/api/auth/get-session`, {
        headers: new Headers(request.headers),
      });
      if (res.ok) {
        session = await res.json();
      }
    } catch (fetchErr) {
      console.error("Middleware session fetch failed:", fetchErr);
    }
  }

  if (!isAuthRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    // Verify role via session user object or header claims
    const userRole = session?.user?.role || session?.user?.userRole;
    if (userRole === 'kasir') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  } else if ((pathname === '/login' || pathname === '/register') && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return result.next;
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
