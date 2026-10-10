import { MetadataRoute } from "next";
import { getMenuItems } from "@/lib/db/menuService";
import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Tenant ditentukan dari host request (bukan hardcode), sehingga setiap brand
  // dengan custom domain otomatis mendapat sitemap miliknya sendiri.
  const context = await resolveSeoTenant();
  if (!context) return [];

  const { tenant, baseUrl } = context;

  // lastModified sengaja tidak diisi: nilai `new Date()` tiap request adalah sinyal palsu
  // dan membuat Google mengabaikan lastmod. Isi hanya jika ada tanggal ubah yang nyata.
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/menu`, changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/contact`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/promo`, changeFrequency: "daily", priority: 0.8 },
    { url: `${baseUrl}/catering`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/gallery`, changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const items = await getMenuItems(tenant.slug);
    const productPages: MetadataRoute.Sitemap = (items || []).map((item) => ({
      url: `${baseUrl}/menu/${item.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [...staticPages, ...productPages];
  } catch (err) {
    console.error("Error generating dynamic sitemap:", err);
    return staticPages;
  }
}
