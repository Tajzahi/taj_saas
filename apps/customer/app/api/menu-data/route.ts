import { NextResponse } from "next/server";
import { getStoreSettings, getCategories, getMenuItems, getStorePromos } from "@/lib/db/menuService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [settings, categories, items, promos] = await Promise.all([
      getStoreSettings(),
      getCategories(),
      getMenuItems(),
      getStorePromos(),
    ]);
    return NextResponse.json({ settings, categories, items, promos });
  } catch (err) {
    console.error("[api/menu-data] Error fetching menu data:", err);
    return NextResponse.json({ settings: null, categories: [], items: [], promos: [] });
  }
}
