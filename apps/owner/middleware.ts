import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHostname } from '@taj-saas/shared';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { slug, appType, isLocalhost } = parseTenantFromHostname(hostname);

  // Development helpers: redirect to correct ports if subdomains hit owner app
  if (isLocalhost) {
    if (appType === 'customer') {
      const url = request.nextUrl.clone();
      url.port = '3000';
      return NextResponse.redirect(url);
    }
    if (appType === 'admin') {
      const url = request.nextUrl.clone();
      url.port = '3001';
      return NextResponse.redirect(url);
    }
  }

  // Clone headers and set tenant context
  const requestHeaders = new Headers(request.headers);
  if (slug) {
    requestHeaders.set('x-tenant-slug', slug);
  }

  // Continue request with injected header
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Only run on standard page/api routes, ignore static files
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).*)',
  ],
};
