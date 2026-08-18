export { z } from "zod";

export interface ParsedTenant {
  slug: string | null;
  appType: 'customer' | 'admin' | 'owner';
  isLocalhost: boolean;
}

/**
 * Parses tenant slug and application type from request hostname.
 * Supports localhost development formats, cloud staging platforms (Cloud Run, Netlify, Vercel),
 * and production custom domains.
 */
export function parseTenantFromHostname(hostname: string): ParsedTenant {
  const parts = hostname.split(':');
  const host = parts[0].toLowerCase().replace(/\.$/, '');
  const port = parts[1] || '';
  
  const isLocalhost = host.endsWith('.localhost') || host === 'localhost' || host === '127.0.0.1';
  const isCloudPlatform = host.endsWith('.a.run.app') || host.endsWith('.run.app') || host.endsWith('.netlify.app') || host.endsWith('.vercel.app');

  let slug: string | null = null;
  let appType: 'customer' | 'admin' | 'owner' = 'customer';

  if (isLocalhost) {
    if (host === 'localhost' || host === '127.0.0.1') {
      slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';
      if (port === '3001') {
        appType = 'admin';
      } else if (port === '3002') {
        appType = 'owner';
      } else {
        appType = 'customer';
      }
    } else {
      const subParts = host.split('.');
      subParts.pop(); // remove 'localhost'

      if (subParts.length >= 2 && (subParts[0] === 'admin' || subParts[0] === 'owner')) {
        appType = subParts[0] as 'admin' | 'owner';
        slug = subParts[1];
      } else {
        slug = subParts[0];
        appType = 'customer';
      }
    }
  } else if (isCloudPlatform) {
    // Cloud Run / Staging platforms (e.g. taj-customer-*.a.run.app, taj-admin-*.a.run.app, taj-owner-*.a.run.app)
    slug = process.env.NEXT_PUBLIC_TENANT_SLUG || 'taj-saas';

    if (host.startsWith('taj-admin') || host.startsWith('admin.') || host.includes('-admin-') || host.includes('-admin.')) {
      appType = 'admin';
    } else if (host.startsWith('taj-owner') || host.startsWith('owner.') || host.includes('-owner-') || host.includes('-owner.')) {
      appType = 'owner';
    } else {
      appType = 'customer';
    }
  } else {
    // Production custom domains (e.g. martabakpakde.com or admin.martabakpakde.com)
    const subParts = host.split('.');
    if (subParts.length >= 3 && (subParts[0] === 'admin' || subParts[0] === 'owner')) {
      appType = subParts[0] as 'admin' | 'owner';
      slug = subParts.slice(1).join('.'); // Base custom domain
    } else {
      appType = 'customer';
      slug = host; // Full domain
    }
  }

  return { slug, appType, isLocalhost: isLocalhost || isCloudPlatform };
}

export * from './tenant';
export * from './tenant-context';
