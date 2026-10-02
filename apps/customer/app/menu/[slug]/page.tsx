export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import MenuDetailClient from "./MenuDetailClient";
import { getMenuItems } from "@/lib/db/menuService";
import { getMenuBySlug, getRelatedMenus } from "@/data/menu";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let item = null;
  try {
    const allItems = await getMenuItems();
    item = allItems.find((i) => i.slug === slug) ?? getMenuBySlug(slug) ?? null;
  } catch {
    item = getMenuBySlug(slug) ?? null;
  }

  if (!item) {
    return {
      title: "Menu Pilihan | Martabak & Terang Bulan A6 Nyuss",
    };
  }

  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price);

  const title = `${item.name} - Menu Lezat Spesial`;
  const description = `${item.description || item.name} harga mulai ${priceFormatted}. Pesan hangat fresh langsung dari Martabak & Terang Bulan A6 Nyuss Surabaya (Cabang Demak & Tidar).`;

  return {
    title,
    description,
    openGraph: {
      title: `${item.name} | Martabak & Terang Bulan A6 Nyuss Surabaya`,
      description,
      url: `https://a6nyusss.com/menu/${slug}`,
      images: item.image ? [{ url: item.image, alt: item.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.name} | Martabak & Terang Bulan A6 Nyuss Surabaya`,
      description,
      images: item.image ? [item.image] : undefined,
    },
    alternates: {
      canonical: `https://a6nyusss.com/menu/${slug}`,
    },
  };
}

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch semua item di server (di-cache 60s di menuService)
  let initialItem = null;
  let initialRelated: any[] = [];

  try {
    const allItems = await getMenuItems();
    const found = allItems.find((i) => i.slug === slug);
    initialItem = found ?? getMenuBySlug(slug) ?? null;

    if (initialItem) {
      const relatedSlugs = initialItem.relatedSlugs || [];
      const dbRelated = allItems.filter((i) => relatedSlugs.includes(i.slug));
      initialRelated = dbRelated.length > 0 ? dbRelated : getRelatedMenus(relatedSlugs);
    }
  } catch {
    // Fallback ke static data jika DB gagal
    initialItem = getMenuBySlug(slug) ?? null;
    if (initialItem) {
      initialRelated = getRelatedMenus(initialItem.relatedSlugs || []);
    }
  }

  return (
    <MenuDetailClient
      slug={slug}
      initialItem={initialItem}
      initialRelated={initialRelated}
    />
  );
}
