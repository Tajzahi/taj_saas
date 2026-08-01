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
  const parts = hostname.split(':');
  const host = parts[0].toLowerCase();
  const port = parts[1] || '';
  
  const isLocalhost = host.endsWith('.localhost') || host === 'localhost' || host === '127.0.0.1';

  let slug: string | null = null;
  let appType: 'customer' | 'admin' | 'owner' = 'customer';

  if (isLocalhost) {
    if (host === 'localhost' || host === '127.0.0.1') {
      // Fallback if no subdomain is specified, read environment variable if available
      slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
      // Detect app type based on port in development
      if (port === '3001') {
        appType = 'admin';
      } else if (port === '3002') {
        appType = 'owner';
      } else {
        appType = 'customer';
      }
    } else {
      // e.g. admin.a6-nyuss.localhost or a6-nyuss.localhost
      const subParts = host.split('.');
      // Remove 'localhost'
      subParts.pop();

      if (subParts.length === 2) {
        // admin.a6-nyuss or owner.a6-nyuss
        const sub = subParts[0];
        slug = subParts[1];
        if (sub === 'admin') appType = 'admin';
        else if (sub === 'owner') appType = 'owner';
      } else {
        // a6-nyuss
        slug = subParts[0];
        appType = 'customer';
      }
    }
  } else if (host.endsWith('.netlify.app')) {
    slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
    if (host.includes('admin')) {
      appType = 'admin';
    } else if (host.includes('owner') || host.includes('tajsaas')) {
      appType = 'owner';
    } else {
      appType = 'customer';
    }
  } else {
    // Production custom domains
    // e.g. admin.martabakpakde.com or martabakpakde.com
    const subParts = host.split('.');
    
    if (subParts.length >= 3) {
      const sub = subParts[0];
      if (sub === 'admin') {
        appType = 'admin';
        slug = subParts.slice(1).join('.'); // e.g. martabakpakde.com
      } else if (sub === 'owner') {
        appType = 'owner';
        slug = subParts.slice(1).join('.'); // e.g. martabakpakde.com
      } else {
        appType = 'customer';
        slug = host; // Entire domain is the tenant identifier
      }
    } else {
      appType = 'customer';
      slug = host; // Entire domain
    }
  }

  // Ensure slug uses our new default if it resolved to the old a6-nyuss
  if (slug === 'a6-nyuss') {
    slug = 'taj-saas';
  }

  return { slug, appType, isLocalhost };
}

export * from './tenant';
export * from './tenant-context';
