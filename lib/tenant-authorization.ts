import 'server-only';
import { headers } from 'next/headers';
import { db, schema } from '@taj-saas/db';
import { eq, and } from 'drizzle-orm';
import { auth } from './auth';

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

// ─── PERMISSION MATRIX ──────────────────────────────────────────────────────

export type Permission =
  | 'orders:read'
  | 'orders:update-status'
  | 'orders:verify-payment'
  | 'orders:create-pos'
  | 'shifts:manage-own'
  | 'shifts:manage-all'
  | 'store:read-operation'
  | 'store:manage-operation'
  | 'menu:read'
  | 'menu:manage'
  | 'inventory:read'
  | 'inventory:manage'
  | 'approvals:read'
  | 'approvals:manage'
  | 'production:read'
  | 'production:manage'
  | 'branches:read'
  | 'branches:manage'
  | 'finance:read'
  | 'payments:refund'
  | 'cancellations:review'
  | 'hr:manage'
  | 'settings:read'
  | 'settings:manage'
  | 'audit:read';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    'orders:read',
    'orders:update-status',
    'orders:verify-payment',
    'orders:create-pos',
    'shifts:manage-own',
    'shifts:manage-all',
    'store:read-operation',
    'store:manage-operation',
    'menu:read',
    'menu:manage',
    'inventory:read',
    'inventory:manage',
    'approvals:read',
    'approvals:manage',
    'production:read',
    'production:manage',
    'branches:read',
    'branches:manage',
    'finance:read',
    'payments:refund',
    'cancellations:review',
    'hr:manage',
    'settings:read',
    'settings:manage',
    'audit:read',
  ],
  manager: [
    'orders:read',
    'orders:update-status',
    'orders:verify-payment',
    'orders:create-pos',
    'shifts:manage-own',
    'shifts:manage-all',
    'store:read-operation',
    'store:manage-operation',
    'menu:read',
    'menu:manage',
    'inventory:read',
    'inventory:manage',
    'approvals:read',
    'approvals:manage',
    'production:read',
    'production:manage',
    'branches:read',
    'payments:refund',
    'cancellations:review',
    'settings:read',
    'audit:read',
  ],
  kasir: [
    'orders:read',
    'orders:update-status',
    'orders:verify-payment',
    'orders:create-pos',
    'shifts:manage-own',
    'store:read-operation',
    'menu:read',
  ],
};

// ─── PORT-AWARE REQUEST HOST RESOLUTION ─────────────────────────────────────

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

  const isLocal = hostname.endsWith('.localhost') || hostname === 'localhost' || hostname === '127.0.0.1';
  const isCloudPlatform = hostname.endsWith('.a.run.app') || hostname.endsWith('.run.app') || hostname.endsWith('.netlify.app') || hostname.endsWith('.vercel.app');

  if (isLocal) {
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      const appType = port === '3001' ? 'admin' : port === '3002' ? 'owner' : 'customer';
      const defaultSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
      return { rawHost: clean, hostname, port, appType, lookupType: 'slug', lookupValue: defaultSlug };
    }
    const parts = hostname.split('.'); // e.g. admin.martabak-pakde.localhost
    parts.pop(); // remove 'localhost'
    if (parts.length >= 2 && (parts[0] === 'admin' || parts[0] === 'owner')) {
      return { rawHost: clean, hostname, port, appType: parts[0] as 'admin' | 'owner', lookupType: 'slug', lookupValue: parts[1] };
    }
    return { rawHost: clean, hostname, port, appType: 'customer', lookupType: 'slug', lookupValue: parts[0] };
  }

  if (isCloudPlatform) {
    // Cloud Run / Staging environments (e.g. taj-customer-*.a.run.app, taj-admin-*.a.run.app, taj-owner-*.a.run.app)
    const defaultSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
    let appType: 'customer' | 'admin' | 'owner' = 'customer';

    if (hostname.startsWith('taj-admin') || hostname.startsWith('admin.') || hostname.includes('-admin-') || hostname.includes('-admin.')) {
      appType = 'admin';
    } else if (hostname.startsWith('taj-owner') || hostname.startsWith('owner.') || hostname.includes('-owner-') || hostname.includes('-owner.')) {
      appType = 'owner';
    } else {
      appType = 'customer';
    }

    return { rawHost: clean, hostname, port, appType, lookupType: 'slug', lookupValue: defaultSlug };
  }

  // Production Custom Domains (e.g. admin.martabakpakde.com or martabakpakde.com)
  const parts = hostname.split('.');
  if (parts.length >= 3 && (parts[0] === 'admin' || parts[0] === 'owner')) {
    const appType = parts[0] as 'admin' | 'owner';
    const baseDomain = parts.slice(1).join('.');
    return { rawHost: clean, hostname, port, appType, lookupType: 'domain', lookupValue: baseDomain };
  }

  return { rawHost: clean, hostname, port, appType: 'customer', lookupType: 'domain', lookupValue: hostname };
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

  // Fallback to slug if domain match returns empty
  if (tenantResult.length === 0 && norm.lookupType === 'domain') {
    tenantResult = await db
      .select()
      .from(schema.tenants)
      .where(eq(schema.tenants.slug, norm.lookupValue))
      .limit(1);
  }

  const tenant = tenantResult[0];

  if (!tenant || !tenant.isActive) {
    throw new AuthorizationError('TENANT_NOT_FOUND', 404, 'Tenant tidak ditemukan atau tidak aktif');
  }

  return tenant;
}

// ─── AUTHENTICATION & MEMBERSHIP GUARDS ──────────────────────────────────────

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
    // Single-domain staging fallback for owner/admin:
    // If exact tenantId match fails (e.g. staging Cloud Run where host resolves to default 'taj-saas' slug),
    // look up the user's primary profile directly to resolve their tenant.
    const userProfileResult = await db
      .select()
      .from(schema.profiles)
      .where(eq(schema.profiles.id, session.user.id))
      .limit(1);

    if (userProfileResult.length > 0) {
      profile = userProfileResult[0];
      if (profile.tenantId) {
        const actualTenantResult = await db
          .select()
          .from(schema.tenants)
          .where(eq(schema.tenants.id, profile.tenantId))
          .limit(1);

        if (actualTenantResult.length > 0) {
          return {
            tenant: actualTenantResult[0],
            user: session.user,
            profile,
          };
        }
      }
    }

    throw new AuthorizationError('FORBIDDEN', 403, 'Akses ke tenant ini ditolak');
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
