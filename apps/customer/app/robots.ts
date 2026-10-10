import { MetadataRoute } from "next";
import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const context = await resolveSeoTenant();

  // Host tidak dikenal (belum terdaftar sebagai domain tenant): jangan izinkan crawling.
  if (!context) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/checkout/"],
      },
    ],
    sitemap: `${context.baseUrl}/sitemap.xml`,
    host: context.baseUrl,
  };
}
