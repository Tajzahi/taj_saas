import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq, or } from "drizzle-orm";

/**
 * Resolusi tenant + base URL untuk route SEO (sitemap.xml, robots.txt, dll).
 *
 * KENAPA TIDAK MEMAKAI HEADER `x-tenant-slug`:
 * Middleware customer mengecualikan path yang mengandung titik (".*\\..*"),
 * sehingga /sitemap.xml dan /robots.txt TIDAK melewati middleware dan header
 * tenant tidak ada. Maka tenant harus ditentukan langsung dari host request.
 */

export type SeoTenant = typeof schema.tenants.$inferSelect;

export interface SeoTenantContext {
  tenant: SeoTenant;
  /** Origin kanonis tanpa trailing slash, mis. "https://a6nyusss.com" */
  baseUrl: string;
}

const CACHE_TTL_MS = 60_000;
const _cache = new Map<string, { value: SeoTenantContext | null; expiresAt: number }>();

export function normalizeHost(raw: string): string {
  return (raw || "")
    .split(",")[0]
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/^www\./, "");
}

export function isSharedDevHost(rawHost: string): boolean {
  const host = (rawHost || "").toLowerCase();
  return (
    host.includes("localhost") ||
    host.includes("127.0.0.1") ||
    host.includes(".run.app")
  );
}

async function getRawHost(): Promise<string> {
  try {
    const h = await headers();
    return h.get("x-forwarded-host") || h.get("host") || "";
  } catch {
    return "";
  }
}

/**
 * Mengembalikan tenant + baseUrl untuk host request saat ini.
 * - Domain produksi: harus cocok dengan `tenants.domain`. Jika tidak cocok -> null
 *   (TIDAK ada fallback ke tenant lain).
 * - Cloud Run / localhost: fallback ke tenant aktif pertama agar staging & dev tetap jalan.
 */
export async function resolveSeoTenant(): Promise<SeoTenantContext | null> {
  const rawHost = await getRawHost();
  const host = normalizeHost(rawHost);
  if (!host) return null;

  const cached = _cache.get(host);
  if (cached && Date.now() < cached.expiresAt) return cached.value;

  let context: SeoTenantContext | null = null;

  try {
    const shared = isSharedDevHost(rawHost);

    if (!shared) {
      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(or(eq(schema.tenants.domain, host), eq(schema.tenants.domain, `www.${host}`)))
        .limit(1);

      if (tenant && tenant.isActive && tenant.domain) {
        context = { tenant, baseUrl: `https://${normalizeHost(tenant.domain)}` };
      }
    } else {
      const [tenant] = await db
        .select()
        .from(schema.tenants)
        .where(eq(schema.tenants.isActive, true))
        .limit(1);

      if (tenant) {
        const protocol = rawHost.includes("localhost") || rawHost.includes("127.0.0.1") ? "http" : "https";
        context = { tenant, baseUrl: `${protocol}://${rawHost.split(",")[0].trim()}` };
      }
    }
  } catch (err) {
    console.error("[seo] resolveSeoTenant error:", err);
    return null;
  }

  _cache.set(host, { value: context, expiresAt: Date.now() + CACHE_TTL_MS });
  return context;
}
