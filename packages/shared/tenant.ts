import { db, schema } from '@taj-saas/db';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { parseTenantFromHostname } from './index';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  adminSubdomain: string;
  ownerSubdomain: string;
  branding: {
    logoUrl?: string;
    primaryColor: string;
    secondaryColor: string;
    businessName: string;
    whatsappNumber?: string;
    flatDeliveryFee?: number;
    minimumOrderAmount?: number;
    storeAddress?: string;
    googleMapsUrl?: string;
    openingHours?: string;
  } | null;
  packageType: string;
  isActive: boolean | null;
  createdAt: Date;
}

export interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
}

// ─── In-memory cache untuk tenant lookup ────────────────────────────────────
// Menghindari query DB ke Neon di setiap request/navigasi halaman.
// Cache berlaku 60 detik. Setelah itu otomatis refresh dari DB.
const tenantCache = new Map<string, { tenant: any; expiry: number }>();
const CACHE_TTL_MS = 60_000; // 60 detik

function getCachedTenant(slug: string) {
  const entry = tenantCache.get(slug);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    tenantCache.delete(slug);
    return null;
  }
  return entry.tenant;
}

function setCachedTenant(slug: string, tenant: any) {
  tenantCache.set(slug, { tenant, expiry: Date.now() + CACHE_TTL_MS });
}
// ─────────────────────────────────────────────────────────────────────────────

// Helper to get current tenant from headers in server-side Next.js
export function getTenantFromHeaders(headersList: Headers | Record<string, string>): { id: string | null; slug: string | null } {
  if (typeof (headersList as any).get === 'function') {
    return {
      id: (headersList as Headers).get('x-tenant-id'),
      slug: (headersList as Headers).get('x-tenant-slug'),
    };
  } else {
    const record = headersList as Record<string, string>;
    return {
      id: record['x-tenant-id'] || null,
      slug: record['x-tenant-slug'] || null,
    };
  }
}

// Shared middleware helper
export async function resolveTenantMiddleware(
  request: NextRequest,
  currentApp: 'customer' | 'admin' | 'owner'
) {
  const hostname = request.headers.get('host') || '';
  const { slug, appType, isLocalhost } = parseTenantFromHostname(hostname);

  // Development redirects between ports
  if (isLocalhost) {
    if (appType !== currentApp) {
      const url = request.nextUrl.clone();
      if (appType === 'customer') url.port = '3000';
      if (appType === 'admin') url.port = '3001';
      if (appType === 'owner') url.port = '3002';
      return { redirect: NextResponse.redirect(url) };
    }
  }

  // If no slug resolved, block or return error
  if (!slug) {
    return { error: 'Tenant not resolved', status: 400 };
  }

  // ─── Cek cache dulu sebelum query DB ───────────────────────────────────
  const cachedTenant = getCachedTenant(slug);
  if (cachedTenant) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', cachedTenant.id);
    requestHeaders.set('x-tenant-slug', cachedTenant.slug);
    return {
      tenant: cachedTenant as Tenant,
      headers: requestHeaders,
      next: NextResponse.next({ request: { headers: requestHeaders } }),
    };
  }
  // ───────────────────────────────────────────────────────────────────────

  // Resolve tenant from database
  try {
    let tenantResult = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, slug))
      .limit(1);

    let tenant = tenantResult[0];

    // Fallback to default tenant if not found by specific slug
    if (!tenant) {
      const fallbackResult = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.slug, 'taj-saas'))
        .limit(1);
      tenant = fallbackResult[0];
    }

    if (!tenant) {
      return { error: 'Tenant not found', status: 404 };
    }

    if (!tenant.isActive) {
      return { error: 'Tenant is inactive', status: 403 };
    }

    // Simpan ke cache agar navigasi berikutnya tidak query DB lagi
    setCachedTenant(slug, tenant);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-tenant-id', tenant.id);
    requestHeaders.set('x-tenant-slug', tenant.slug);

    return {
      tenant: tenant as Tenant,
      headers: requestHeaders,
      next: NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      }),
    };
  } catch (err) {
    console.error('Database connection error in middleware:', err);
    // If DB is down, we still pass through using slug in development, or return a 500 error in production
    if (slug === 'taj-saas' || isLocalhost) {
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-tenant-id', process.env.NEXT_PUBLIC_TENANT_ID || '');
      requestHeaders.set('x-tenant-slug', 'taj-saas');
      return {
        tenant: null,
        headers: requestHeaders,
        next: NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        }),
      };
    }
    return { error: 'Internal Server Error', status: 500 };
  }
}
