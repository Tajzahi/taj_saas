import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export async function middleware(request: NextRequest) {
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
      return NextResponse.redirect(new URL('https://tajsaas.netlify.app/register'));
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
