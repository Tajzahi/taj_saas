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
    return NextResponse.json(
      { settings, categories, items, promos },
      {
        headers: {
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=30",
        },
      }
    );
  } catch (err) {
    console.error("[api/menu-data] Error fetching menu data:", err);
    return NextResponse.json(
      { settings: null, categories: [], items: [], promos: [] },
      { status: 500 }
    );
  }
}
