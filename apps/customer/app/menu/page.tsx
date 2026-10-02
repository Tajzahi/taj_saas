import type { Metadata } from "next";
import MenuClient from "./MenuClient";
import { getStoreSettings, getMenuItems, getCategories } from "@/lib/db/menuService";
import { categories as staticCategories } from "@/data/menu";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Daftar Menu Martabak Telur & Terang Bulan",
  description:
    "Lihat daftar lengkap menu Martabak Telur Daging Sapi gurih dan Terang Bulan aneka rasa istimewa di Martabak A6 Nyuss Surabaya. Pesan online langsung siap diantar!",
  alternates: {
    canonical: "https://a6nyusss.com/menu",
  },
};

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
