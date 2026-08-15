import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export const middleware = async (request: NextRequest) => {
  const result = await resolveTenantMiddleware(request as any, 'admin');

  if ('redirect' in result) {
    return result.redirect;
  }

  if ('error' in result) {
    if (result.status === 404) {
      const isLocalhost = request.nextUrl.hostname.includes('localhost') || request.nextUrl.hostname.includes('127.0.0.1');
      if (isLocalhost) {
        const ownerRegisterUrl = new URL(request.url);
        ownerRegisterUrl.port = '3002';
        ownerRegisterUrl.pathname = '/register';
        return NextResponse.redirect(ownerRegisterUrl);
      }
      const ownerAppUrl = process.env.OWNER_APP_URL;

      if (!ownerAppUrl) {
        console.error('[tenant] OWNER_APP_URL is not configured.');
        return new NextResponse('Owner app URL is not configured.', { status: 500 });
      }

      try {
        return NextResponse.redirect(new URL('/register', ownerAppUrl));
      } catch {
        console.error('[tenant] OWNER_APP_URL is invalid.');
        return new NextResponse('Owner app URL is invalid.', { status: 500 });
      }
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
