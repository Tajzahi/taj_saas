import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { resolveTenantMiddleware } from '@taj-saas/shared';

export async function middleware(request: NextRequest) {
  const result = await resolveTenantMiddleware(request as any, 'admin');

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
