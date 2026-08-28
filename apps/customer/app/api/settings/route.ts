import { NextResponse } from "next/server";
import { getStoreSettings } from "@/lib/db/menuService";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("[api/settings] Error fetching store settings:", err);
    return NextResponse.json({
      id: "default-id",
      store_name: "",
      is_open: true,
      whatsapp_number: "",
      flat_delivery_fee: 10000,
      minimum_order_amount: 0,
      store_address: "",
      google_maps_url: null,
      opening_hours: "",
      qris_image_url: "/qris.png",
      bank_info: "",
      hero_banner_url: "",
      outlet_lat: -7.2432537,
      outlet_lng: 112.7206275,
    });
  }
}
