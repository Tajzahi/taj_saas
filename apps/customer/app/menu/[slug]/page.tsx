export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import MenuDetailClient from "./MenuDetailClient";
import { getMenuItems } from "@/lib/db/menuService";
import { getMenuBySlug, getRelatedMenus } from "@/data/menu";
import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const context = await resolveSeoTenant();
  const baseUrl = context?.baseUrl || "https://a6nyusss.com";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";
  const cleanSlug = slug.replace(/-+$/, "");

  let item = null;
  try {
    const allItems = await getMenuItems(context?.tenant?.slug);
    item =
      allItems.find((i) => i.slug === slug || i.slug.replace(/-+$/, "") === cleanSlug) ??
      (context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss" ? (getMenuBySlug(slug) || getMenuBySlug(cleanSlug)) : null);
  } catch {
    item = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss" ? (getMenuBySlug(slug) || getMenuBySlug(cleanSlug)) : null;
  }

  if (!item) {
    return {
      title: `Menu Pilihan | ${storeName}`,
    };
  }

  const priceFormatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(item.price);

  const title = `${item.name} - Menu Lezat Spesial`;
  const description = `${item.description || item.name} harga mulai ${priceFormatted}. Pesan hangat fresh langsung dari gerai resmi ${storeName}.`;

  const imageUrl = item.image
    ? (item.image.startsWith("http") ? item.image : `${baseUrl}${item.image}`)
    : `${baseUrl}/logo.png`;

  return {
    title,
    description,
    openGraph: {
      title: `${item.name} | ${storeName}`,
      description,
      url: `${baseUrl}/menu/${cleanSlug}`,
      images: [{ url: imageUrl, alt: item.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.name} | ${storeName}`,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: `${baseUrl}/menu/${cleanSlug}`,
    },
  };
}

export default async function MenuDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const context = await resolveSeoTenant();
  const baseUrl = context?.baseUrl || "https://a6nyusss.com";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";
  const cleanSlug = slug.replace(/-+$/, "");

  let initialItem = null;
  let initialRelated: any[] = [];

  try {
    const allItems = await getMenuItems(context?.tenant?.slug);
    const found =
      allItems.find((i) => i.slug === slug || i.slug.replace(/-+$/, "") === cleanSlug) ??
      (context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss" ? (getMenuBySlug(slug) || getMenuBySlug(cleanSlug)) : null);
    initialItem = found;

    if (initialItem) {
      const relatedSlugs = initialItem.relatedSlugs || [];
      const dbRelated = allItems.filter((i) => relatedSlugs.includes(i.slug));
      initialRelated = dbRelated.length > 0 ? dbRelated : getRelatedMenus(relatedSlugs);
    }
  } catch {
    initialItem = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss" ? (getMenuBySlug(slug) || getMenuBySlug(cleanSlug)) : null;
    if (initialItem) {
      initialRelated = getRelatedMenus(initialItem.relatedSlugs || []);
    }
  }

  const imageUrl = initialItem?.image
    ? (initialItem.image.startsWith("http") ? initialItem.image : `${baseUrl}${initialItem.image}`)
    : `${baseUrl}/logo.png`;

  return (
    <>
      {initialItem && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Product",
                  "@id": `${baseUrl}/menu/${cleanSlug}#product`,
                  "name": initialItem.name,
                  "image": imageUrl,
                  "description":
                    initialItem.description ||
                    `Nikmati hidangan istimewa ${initialItem.name} dari ${storeName}. Dibuat hangat dan segar dengan bahan berkualitas.`,
                  "brand": {
                    "@type": "Brand",
                    "name": storeName,
                  },
                  "offers": {
                    "@type": "Offer",
                    "priceCurrency": "IDR",
                    "price": initialItem.price,
                    "availability":
                      initialItem.badge === "habis"
                        ? "https://schema.org/OutOfStock"
                        : "https://schema.org/InStock",
                    "url": `${baseUrl}/menu/${cleanSlug}`,
                    "seller": {
                      "@type": "Organization",
                      "name": storeName,
                    },
                  },
                },
                {
                  "@type": "BreadcrumbList",
                  "@id": `${baseUrl}/menu/${cleanSlug}#breadcrumb`,
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Beranda",
                      "item": baseUrl,
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Daftar Menu",
                      "item": `${baseUrl}/menu`,
                    },
                    {
                      "@type": "ListItem",
                      "position": 3,
                      "name": initialItem.name,
                      "item": `${baseUrl}/menu/${cleanSlug}`,
                    },
                  ],
                },
              ],
            }),
          }}
        />
      )}
      <MenuDetailClient
        slug={slug}
        initialItem={initialItem ?? null}
        initialRelated={initialRelated}
      />
    </>
  );
}
