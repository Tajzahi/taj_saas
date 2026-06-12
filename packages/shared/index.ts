export interface ParsedTenant {
  slug: string | null;
  appType: 'customer' | 'admin' | 'owner';
  isLocalhost: boolean;
}

/**
 * Parses tenant slug and application type from request hostname.
 * Supports localhost development formats and production custom domains.
 * 
 * Localhost formats:
 * - customer: [slug].localhost:3000 -> slug, 'customer'
 * - admin: admin.[slug].localhost:3001 -> slug, 'admin'
 * - owner: owner.[slug].localhost:3002 -> slug, 'owner'
 * 
 * Production formats:
 * - customer: [slug].com -> slug, 'customer'
 * - admin: admin.[slug].com -> slug, 'admin'
 * - owner: owner.[slug].com -> slug, 'owner'
 */
export function parseTenantFromHostname(hostname: string): ParsedTenant {
  // Strip port if present
  const host = hostname.split(':')[0].toLowerCase();
  const isLocalhost = host.endsWith('.localhost') || host === 'localhost' || host === '127.0.0.1';

  let slug: string | null = null;
  let appType: 'customer' | 'admin' | 'owner' = 'customer';

  if (isLocalhost) {
    if (host === 'localhost' || host === '127.0.0.1') {
      // Fallback if no subdomain is specified, read environment variable if available
      slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'a6-nyuss';
      appType = 'customer';
    } else {
      // e.g. admin.a6-nyuss.localhost or a6-nyuss.localhost
      const parts = host.split('.');
      // Remove 'localhost'
      parts.pop();

      if (parts.length === 2) {
        // admin.a6-nyuss or owner.a6-nyuss
        const sub = parts[0];
        slug = parts[1];
        if (sub === 'admin') appType = 'admin';
        else if (sub === 'owner') appType = 'owner';
      } else {
        // a6-nyuss
        slug = parts[0];
        appType = 'customer';
      }
    }
  } else {
    // Production custom domains
    // e.g. admin.martabakpakde.com or martabakpakde.com
    const parts = host.split('.');
    
    if (parts.length >= 3) {
      const sub = parts[0];
      if (sub === 'admin') {
        appType = 'admin';
        slug = parts.slice(1).join('.'); // e.g. martabakpakde.com
      } else if (sub === 'owner') {
        appType = 'owner';
        slug = parts.slice(1).join('.'); // e.g. martabakpakde.com
      } else {
        appType = 'customer';
        slug = host; // Entire domain is the tenant identifier
      }
    } else {
      appType = 'customer';
      slug = host; // Entire domain
    }
  }

  return { slug, appType, isLocalhost };
}

export * from './tenant';
export * from './tenant-context';
