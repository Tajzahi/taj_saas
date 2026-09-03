import MenuClient from "./MenuClient";
import { getStoreSettings, getMenuItems, getCategories } from "@/lib/db/menuService";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  const [settings, items, categories] = await Promise.all([
    getStoreSettings(),
    getMenuItems(),
    getCategories(),
  ]);

  return (
    <MenuClient
      initialItems={items}
      initialCategories={categories}
      menuSubtitle={settings.menu_subtitle}
    />
  );
}
