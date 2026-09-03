export const dynamic = "force-dynamic";

import MenuDetailClient from "./MenuDetailClient";
import { getMenuItems } from "@/lib/db/menuService";
import { getMenuBySlug, getRelatedMenus } from "@/data/menu";

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
