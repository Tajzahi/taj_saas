import type { Metadata } from "next";
import MenuClient from "./MenuClient";
import { getStoreSettings, getMenuItems, getCategories } from "@/lib/db/menuService";
import { categories as staticCategories } from "@/data/menu";

import { resolveSeoTenant } from "@/lib/seo/tenant-host";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const context = await resolveSeoTenant();
  const isA6 = context?.tenant?.slug === "martabak-terang-bulan-a6-nyusss";
  const storeName = context?.tenant?.name || "Martabak & Terang Bulan A6 Nyuss";

  return {
    title: isA6 ? "Daftar Menu Martabak Telur & Terang Bulan" : `Daftar Menu Pilihan | ${storeName}`,
    description: isA6
      ? "Lihat daftar lengkap menu Martabak Telur Daging Sapi gurih dan Terang Bulan aneka rasa istimewa di Martabak A6 Nyuss Surabaya. Pesan online langsung siap diantar!"
      : `Lihat daftar lengkap aneka menu lezat dan hidangan spesial dari ${storeName}. Pesan online hangat langsung diantar!`,
    alternates: {
      canonical: "/menu",
    },
  };
}

export default async function MenuPage() {
  // Fetch paralel dengan fallback individual — jika salah satu gagal, page tetap tampil
  const [settingsResult, itemsResult, categoriesResult] = await Promise.allSettled([
    getStoreSettings(),
    getMenuItems(),
    getCategories(),
  ]);

  const settings = settingsResult.status === 'fulfilled' ? settingsResult.value : null;
  const items = itemsResult.status === 'fulfilled' ? itemsResult.value : [];
  const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : staticCategories;

  return (
    <MenuClient
      initialItems={items}
      initialCategories={categories}
      menuSubtitle={settings?.menu_subtitle}
    />
  );
}
