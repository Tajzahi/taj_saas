export type PageId =
  | "cockpit"
  | "cabang"
  | "menu"
  | "persediaan"
  | "keuangan"
  | "produksi"
  | "penjualan"
  | "sdm"
  | "persetujuan"
  | "ai"
  | "pengaturan";

export interface NavItem {
  id: PageId;
  label: string;
  emoji: string;
  badge?: string | number;
  badgeVariant?: "danger" | "warning" | "info";
}

export const navItems: NavItem[] = [
  { id: "cockpit", label: "Executive Cockpit", emoji: "🏠" },
  { id: "cabang", label: "Cabang", emoji: "🏪" },
  { id: "menu", label: "Menu & Resep", emoji: "📋" },
  { id: "persediaan", label: "Persediaan", emoji: "📦", badge: 3, badgeVariant: "danger" },
  { id: "keuangan", label: "Keuangan", emoji: "💰" },
  { id: "produksi", label: "Produksi", emoji: "⚙️" },
  { id: "penjualan", label: "Penjualan & Analitik", emoji: "📊" },
  { id: "sdm", label: "SDM & Shift", emoji: "👥", badge: 1, badgeVariant: "warning" },
  { id: "persetujuan", label: "Persetujuan", emoji: "✅", badge: 4, badgeVariant: "danger" },
  { id: "ai", label: "AI Insights", emoji: "🤖" },
  { id: "pengaturan", label: "Pengaturan", emoji: "🔧" },
];

export const pageTitles: Record<PageId, { title: string; subtitle: string }> = {
  cockpit: { title: "Executive Cockpit", subtitle: "Ringkasan performa bisnis secara real-time" },
  cabang: { title: "Cabang", subtitle: "Kelola dan pantau semua cabang" },
  menu: { title: "Menu & Resep", subtitle: "Master menu, BOM, dan engineering" },
  persediaan: { title: "Persediaan", subtitle: "Manajemen stok dan waste log" },
  keuangan: { title: "Keuangan", subtitle: "P&L, arus kas, dan rekonsiliasi" },
  produksi: { title: "Produksi", subtitle: "Rencana harian dan laporan yield" },
  penjualan: { title: "Penjualan & Analitik", subtitle: "Analisis penjualan mendalam" },
  sdm: { title: "SDM & Shift", subtitle: "Manajemen karyawan dan jadwal" },
  persetujuan: { title: "Persetujuan", subtitle: "PO, diskon, refund menunggu persetujuan" },
  ai: { title: "AI Insights", subtitle: "Prediksi cerdas dan rekomendasi AI" },
  pengaturan: { title: "Pengaturan", subtitle: "Konfigurasi tenant dan sistem" },
};
