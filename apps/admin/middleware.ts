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
      // Redirect to owner register page on port 3002
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
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
