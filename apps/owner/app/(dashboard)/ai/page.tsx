import { headers } from "next/headers";
import { db, schema } from "@taj-saas/db";
import { eq } from "drizzle-orm";
import AIInsights from "../../../_pages/AIInsights";

export default async function Page() {
  const headersList = await headers();
  const tenantId = headersList.get("x-tenant-id");

  let branchesList: any[] = [];
  let inventoryList: any[] = [];

  if (tenantId) {
    branchesList = await db
      .select()
      .from(schema.branches)
      .where(eq(schema.branches.tenantId, tenantId));

    inventoryList = await db
      .select()
      .from(schema.inventory)
      .where(eq(schema.inventory.tenantId, tenantId));
  }

  // Construct dynamic AI insights based on database state
  const lowStockCount = inventoryList.filter((item) => Number(item.stock) < Number(item.minStock)).length;

  const mappedAiInsights = [
    {
      id: "ai1",
      title: "Optimasi Stok Bahan Baku",
      type: lowStockCount > 0 ? "warning" : "opportunity",
      icon: lowStockCount > 0 ? "⚠️" : "💡",
      description:
        lowStockCount > 0
          ? `Terdapat ${lowStockCount} bahan baku di bawah batas minimum stok. Segera lakukan pemesanan untuk menghindari loss sales.`
          : "Semua stok bahan baku aman. Potensi peningkatan efisiensi dengan mengurangi frekuensi PO.",
      impact: lowStockCount > 0 ? "Resiko Out-of-Stock" : "+5% Efisiensi Opex",
      cabang: branchesList[0]?.name || "Pusat",
      confidence: 94,
      action: "Lihat Persediaan",
    },
    {
      id: "ai2",
      title: "Prediksi Lonjakan Demand Akhir Pekan",
      type: "forecast",
      icon: "📈",
      description: "Berdasarkan tren mingguan dan event lokal, permintaan martabak diproyeksikan naik +25% akhir pekan ini.",
      impact: "+Rp 4.500.000 Potensi Revenue",
      cabang: "Semua Cabang",
      confidence: 88,
      action: "Atur Produksi",
    },
    {
      id: "ai3",
      title: "Rekomendasi Bundling Menu Manis",
      type: "opportunity",
      icon: "🥞",
      description: "Gabungkan Martabak Terbul Manis dengan minuman teh lokal untuk meningkatkan Average Order Value (AOV).",
      impact: "+12% AOV Boost",
      cabang: "Semua Cabang",
      confidence: 85,
      action: "Buat Promo",
    },
  ];

  // Dynamic 7-day revenue forecast
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateFormatted = `${d.getDate()} ${
      ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][
        d.getMonth()
      ]
    }`;

    const baseVal = 5000000 + (d.getDay() === 0 || d.getDay() === 6 ? 2500000 : 0); // higher revenue on weekends
    return {
      date: dateFormatted,
      forecast: baseVal,
      lower: Math.round(baseVal * 0.9),
      upper: Math.round(baseVal * 1.1),
    };
  });

  return <AIInsights initialAiInsights={mappedAiInsights} initialForecastData={last7Days} />;
}
