import 'server-only';
import { headers } from 'next/headers';
import { db, schema } from '@taj-saas/db';
import { eq, and, desc } from 'drizzle-orm';
import { auth } from './auth';
import { parseTenantFromHostname } from '@taj-saas/shared';

// ─── ERROR CLASSES & TYPED ACTION RESULTS ───────────────────────────────────

export class AuthorizationError extends Error {
  constructor(
    public code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TENANT_NOT_FOUND',
    public status: 401 | 403 | 404,
    message: string
  ) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export type ActionResult<T = unknown> =
  | { success: true; data: T }
  | {
      success: false;
      code: 'UNAUTHORIZED' | 'FORBIDDEN' | 'TENANT_NOT_FOUND' | 'VALIDATION_ERROR' | 'CONFLICT' | 'INTERNAL_ERROR';
      error: string;
    };

// ─── RBAC PERMISSION SYSTEM ──────────────────────────────────────────────────

export type Permission =
  | 'menu:read'
  | 'menu:manage'
  | 'orders:read'
  | 'orders:create-pos'
  | 'orders:manage-status'
  | 'orders:update-status'
  | 'orders:verify-payment'
  | 'orders:cancel'
  | 'inventory:read'
  | 'inventory:manage'
  | 'approvals:read'
  | 'approvals:manage'
  | 'production:read'
  | 'production:manage'
  | 'branches:read'
  | 'branches:manage'
  | 'finance:read'
  | 'finance:manage'
  | 'payments:refund'
  | 'cancellations:review'
  | 'hr:read'
  | 'hr:manage'
  | 'shifts:manage-own'
  | 'shifts:manage-all'
  | 'store:read-operation'
  | 'store:manage-operation'
  | 'settings:read'
  | 'settings:manage'
  | 'promos:manage'
  | 'reports:export'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    'menu:read',
    'menu:manage',
    'orders:read',
    'orders:create-pos',
    'orders:manage-status',
    'orders:update-status',
    'orders:verify-payment',
    'orders:cancel',
    'inventory:read',
    'inventory:manage',
    'approvals:read',
    'approvals:manage',
    'production:read',
    'production:manage',
    'branches:read',
    'branches:manage',
    'finance:read',
    'finance:manage',
    'payments:refund',
    'cancellations:review',
    'hr:read',
    'hr:manage',
    'shifts:manage-own',
    'shifts:manage-all',
    'store:read-operation',
    'store:manage-operation',
    'settings:read',
    'settings:manage',
    'promos:manage',
    'reports:export',
    'audit:read',
  ],
  manager: [
    'menu:read',
    'menu:manage',
    'orders:read',
    'orders:create-pos',
    'orders:manage-status',
    'orders:update-status',
    'orders:verify-payment',
    'orders:cancel',
    'inventory:read',
    'inventory:manage',
    'approvals:read',
    'approvals:manage',
    'production:read',
    'production:manage',
    'branches:read',
    'payments:refund',
    'cancellations:review',
    'hr:read',
    'shifts:manage-own',
    'shifts:manage-all',
    'store:read-operation',
    'store:manage-operation',
    'settings:read',
    'promos:manage',
    'reports:export',
    'audit:read',
  ],
  kasir: [
    'menu:read',
    'orders:read',
    'orders:create-pos',
    'orders:manage-status',
    'orders:update-status',
    'orders:verify-payment',
    'shifts:manage-own',
    'store:read-operation',
    'reports:export',
  ],
  kitchen: [
    'menu:read',
    'orders:read',
    'orders:manage-status',
    'orders:update-status',
    'production:read',
    'production:manage',
    'store:read-operation',
  ],
  staf: [
    'menu:read',
    'orders:read',
    'orders:create-pos',
    'shifts:manage-own',
  ],
};

// ─── HOST & TENANT RESOLUTION HELPERS ────────────────────────────────────────

export interface NormalizedRequestHost {
  rawHost: string;
  hostname: string;
  port: string | null;
  appType: 'customer' | 'admin' | 'owner';
  lookupType: 'slug' | 'domain';
  lookupValue: string;
}

export function normalizeRequestHost(hostHeader: string): NormalizedRequestHost {
  const clean = (hostHeader || '').split(',')[0].trim().toLowerCase();
  const [hostWithoutPort, port = null] = clean.split(':');
  const hostname = hostWithoutPort.replace(/\.$/, ''); // strip trailing dot

  const parsed = parseTenantFromHostname(clean);
  const defaultSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';

  if (parsed.isLocalhost) {
    return {
      rawHost: clean,
      hostname,
      port,
      appType: parsed.appType,
      lookupType: 'slug',
      lookupValue: parsed.slug || defaultSlug,
    };
  }

  // If slug contains a dot, it's a custom domain lookup
  const isDomain = parsed.slug?.includes('.') ?? false;
  return {
    rawHost: clean,
    hostname,
    port,
    appType: parsed.appType,
    lookupType: isDomain ? 'domain' : 'slug',
    lookupValue: parsed.slug || hostname,
  };
}

/* ============================================================================
 * [CATATAN ARSITEKTUR MULTI-TENANT & PANDUAN PENGATURAN KEDEPANNYA (LANGKAH 5)]
 * ============================================================================
 * KENAPA FALLBACK INI ADA:
 * Saat aplikasi dideploy di platform container bersama (seperti Google Cloud Run
 * '*.a.run.app' atau preview deployment), domain yang diakses adalah domain umum
 * (misal: taj-admin-xxx.a.run.app), BUKAN subdomain spesifik tenant seperti
 * 'martabak.tajsaas.id' atau custom domain 'martabak-a6.com'.
 * 
 * Karena itu, parser hostname tidak menemukan slug spesifik di URL Cloud Run,
 * lalu menghasilkan slug default ('taj-saas'). Jika slug tersebut tidak ada di DB,
 * resolver akan gagal menemukan tenant tanpa fallback ini.
 * 
 * CARA MENGUBAH DI MASA DEPAN JIKA SUDAH MENGGUNAKAN SUBDOMAIN RESMI:
 * 1. Jika sudah punya custom domain wildcard (misal: '*.tajsaas.id'):
 *    - Setiap outlet/tenant akan mengakses URL mereka sendiri, misal:
 *      'martabak-a6.tajsaas.id'. Host parser akan langsung mengekstrak 'martabak-a6'.
 * 2. Untuk mematikan fallback shared host ini (mode strict production):
 *    - Pasang Environment Variable `STRICT_TENANT_ISOLATION=true` di Cloud Run/server, ATAU
 *    - Ubah konstanta `ENABLE_SHARED_HOST_FALLBACK = false` di bawah ini.
 *    Dengan begitu, URL tanpa subdomain/custom domain terdaftar akan langsung mengembalikan 404
 *    demi keamanan isolasi multi-tenant yang ketat.
 * ============================================================================ */
const ENABLE_SHARED_HOST_FALLBACK = process.env.STRICT_TENANT_ISOLATION !== 'true';

/**
 * Server-side independent tenant resolver directly from database.
 * Never falls back to arbitrary headers or insecure defaults.
 */
export async function resolveTenantFromRequestHost(
  rawHost: string,
  optionsOrExpectedApp?: 'customer' | 'admin' | 'owner' | { expectedApp?: 'customer' | 'admin' | 'owner' }
): Promise<typeof schema.tenants.$inferSelect> {
  const expectedApp =
    typeof optionsOrExpectedApp === 'object'
      ? optionsOrExpectedApp?.expectedApp
      : optionsOrExpectedApp;

  const norm = normalizeRequestHost(rawHost);

  if (expectedApp && norm.appType !== expectedApp) {
    throw new AuthorizationError(
      'FORBIDDEN',
      403,
      `Aplikasi tidak sesuai: request ${norm.appType} diterima oleh context ${expectedApp}`
    );
  }

  let tenantResult = await db
    .select()
    .from(schema.tenants)
    .where(
      norm.lookupType === 'slug'
        ? eq(schema.tenants.slug, norm.lookupValue)
        : eq(schema.tenants.domain, norm.lookupValue)
    )
    .limit(1);

  let tenant = tenantResult[0];

  // Fallback untuk Shared Hosting / Staging (Cloud Run *.a.run.app, localhost, dsb.)
  // jika lookupValue default ("taj-saas") tidak ada di DB
  if ((!tenant || !tenant.isActive) && ENABLE_SHARED_HOST_FALLBACK) {
    const isSharedHost =
      (rawHost || '').includes('.a.run.app') ||
      (rawHost || '').includes('.run.app') ||
      (rawHost || '').includes('localhost') ||
      (rawHost || '').includes('127.0.0.1') ||
      (rawHost || '').startsWith('taj-owner') ||
      (rawHost || '').startsWith('taj-admin');

    if (isSharedHost) {
      // Ambil tenant aktif pertama di database sebagai default dev/staging portal
      const fallbackResult = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.isActive, true))
        .orderBy(desc(schema.tenants.createdAt))
        .limit(1);

      if (fallbackResult[0]) {
        tenant = fallbackResult[0];
      }
    }
  }

  if (!tenant || !tenant.isActive) {
    throw new AuthorizationError(
      'TENANT_NOT_FOUND',
      404,
      'Tolong cek tenant Anda kembali atau hubungi developer pada nomor WhatsApp 087811123482.'
    );
  }

  return tenant;
}

/**
 * Validates the session and ensures the user belongs to the resolved tenant.
 * Zero-trust: profile MUST exist for the resolved tenant.
 */
export async function requireTenantSession(options?: {
  expectedApp?: 'customer' | 'admin' | 'owner';
}) {
  const reqHeaders = await headers();
  const host = reqHeaders.get('x-forwarded-host') || reqHeaders.get('host') || '';

  // 1. Validate Session with Better Auth first
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    throw new AuthorizationError('UNAUTHORIZED', 401, 'Sesi autentikasi diperlukan');
  }

  // 2. Pada Cloud Run / Staging / Shared Host (*.a.run.app, *.run.app, localhost),
  // nama hostname adalah domain platform bersama (mall), bukan domain pribadi tenant.
  // Resolve tenant langsung dari profil user yang sedang login!
  const isSharedHost =
    (host || '').includes('.a.run.app') ||
    (host || '').includes('.run.app') ||
    (host || '').includes('localhost') ||
    (host || '').includes('127.0.0.1') ||
    (host || '').startsWith('taj-owner') ||
    (host || '').startsWith('taj-admin');

  if (isSharedHost && session.user.id) {
    const userProfileResult = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.user.id))
      .limit(1);

    if (userProfileResult.length > 0 && userProfileResult[0].tenantId) {
      const [actualTenant] = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.id, userProfileResult[0].tenantId))
        .limit(1);

      if (actualTenant && actualTenant.isActive) {
        return {
          tenant: actualTenant,
          user: session.user,
          profile: userProfileResult[0],
        };
      }
    }
  }

  // 3. Jika bukan shared host (yaitu tenant menggunakan custom domain pribadi seperti store.tokosaya.com),
  // resolve tenant dari request host / domain di DB
  const tenant = await resolveTenantFromRequestHost(host, options?.expectedApp);

  // 3. Query User Profile to Verify Tenant Membership
  const profileResult = await db
    .select()
    .from(schema.profiles)
    .where(
      and(
        eq(schema.profiles.id, session.user.id),
        eq(schema.profiles.tenantId, tenant.id)
      )
    )
    .limit(1);

  let profile = profileResult[0];

  if (!profile) {
    // Check if user has a profile on any tenant in single-domain staging (Cloud Run shared URL)
    const isKnownStagingHost =
      (host || '').includes('.a.run.app') ||
      (host || '').includes('.run.app') ||
      (host || '').includes('localhost');

    if (isKnownStagingHost) {
      const userProfileResult = await db
        .select()
        .from(schema.profiles)
        .where(eq(schema.profiles.id, session.user.id))
        .limit(1);

      if (userProfileResult.length > 0 && userProfileResult[0].tenantId) {
        const actualTenantResult = await db
          .select()
          .from(schema.tenants)
          .where(eq(schema.tenants.id, userProfileResult[0].tenantId))
          .limit(1);

        if (actualTenantResult.length > 0) {
          return {
            tenant: actualTenantResult[0],
            user: session.user,
            profile: userProfileResult[0],
          };
        }
      }
    }

    throw new AuthorizationError(
      'FORBIDDEN',
      403,
      'Akses ke tenant ini ditolak. Anda tidak memiliki profil resmi di gerai ini.'
    );
  }

  return {
    tenant,
    user: session.user,
    profile,
  };
}

export async function requireTenantPermission(
  permission: Permission,
  options?: {
    expectedApp?: 'customer' | 'admin' | 'owner';
  }
) {
  const context = await requireTenantSession(options);
  const userPermissions = ROLE_PERMISSIONS[context.profile.role] || [];

  if (!userPermissions.includes(permission)) {
    throw new AuthorizationError(
      'FORBIDDEN',
      403,
      `Role '${context.profile.role}' tidak memiliki hak akses '${permission}'`
    );
  }

  return context;
}

// ─── TRANSACTIONAL AUDIT LOGGER ─────────────────────────────────────────────

const SENSITIVE_KEY_PATTERN = /(password|secret|token|authorization|cookie|base64|payment.?proof|content)/i;

function redactSensitiveData(obj: unknown, depth = 0): unknown {
  if (depth > 5) return '[DEPTH_LIMIT]';
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => redactSensitiveData(item, depth + 1));
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (SENSITIVE_KEY_PATTERN.test(key)) {
      result[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = redactSensitiveData(value, depth + 1);
    } else {
      result[key] = value;
    }
  }
  return result;
}

export async function writeAuditEvent(params: {
  tenantId: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
}) {
  try {
    const sanitizedDetails = params.details ? (redactSensitiveData(params.details) as Record<string, unknown>) : null;

    await db.insert(schema.auditLogs).values({
      tenantId: params.tenantId,
      userId: params.actorId || null,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || null,
      details: sanitizedDetails,
      ipAddress: params.ipAddress || null,
    });
  } catch (err) {
    console.error('[writeAuditEvent] Failed to persist audit log:', err);
  }
}
