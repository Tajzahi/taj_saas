import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export async function middleware(request: NextRequest) {
  const result = await resolveTenantMiddleware(request as any, 'customer');

  if ('redirect' in result) {
    return result.redirect;
  }

  if ('error' in result) {
    if (result.status === 404) {
      const ownerRegisterUrl = new URL(request.url);
      ownerRegisterUrl.port = '3002';
      ownerRegisterUrl.pathname = '/register';
      return NextResponse.redirect(ownerRegisterUrl);
    }
    return new NextResponse(result.error, { status: result.status });
  }

  return result.next;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (handled by Better Auth directly)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (tenant image assets)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
