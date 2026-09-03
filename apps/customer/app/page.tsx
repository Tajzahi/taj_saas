import HomeClient from "./HomeClient";
import { getStoreSettings, getMenuItems } from "@/lib/db/menuService";

// Render setiap request (data real-time), namun dengan in-memory cache 60s di menuService.
export const dynamic = "force-dynamic";

export default async function Home() {
  // Fetch paralel — tidak menunggu satu per satu
  const [settings, items] = await Promise.all([
    getStoreSettings(),
    getMenuItems(),
  ]);

  return <HomeClient initialSettings={settings} initialItems={items} />;
}
