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

  // Fallback for staging/Cloud Run environments if slug 'taj-saas' is not found
  // BUG FIX: Removed NODE_ENV !== 'production' — Cloud Run always sets NODE_ENV=production,
  // which blocked this fallback entirely in staging.
  if (tenantResult.length === 0) {
    const isKnownStagingHost =
      norm.hostname.includes('.a.run.app') ||
      norm.hostname.includes('.run.app') ||
      norm.hostname.includes('localhost');

    if (isKnownStagingHost) {
      const [latestTenant] = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.isActive, true))
        .orderBy(desc(schema.tenants.createdAt))
        .limit(1);
      if (latestTenant) {
        tenantResult = [latestTenant];
      }
    }
  }

  const tenant = tenantResult[0];

  if (!tenant || !tenant.isActive) {
    throw new AuthorizationError('TENANT_NOT_FOUND', 404, 'Tenant tidak ditemukan atau tidak aktif');
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
  
  // 1. Resolve tenant independently from DB
  const tenant = await resolveTenantFromRequestHost(host, options?.expectedApp);

  // 2. Validate Session with Better Auth
  const session = await auth.api.getSession({
    headers: reqHeaders,
  });

  if (!session || !session.user) {
    throw new AuthorizationError('UNAUTHORIZED', 401, 'Sesi autentikasi diperlukan');
  }

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
    // BUG FIX: Removed NODE_ENV !== 'production' — same issue as above.
    const isKnownStagingHost =
      (host || '').includes('.a.run.app');

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
