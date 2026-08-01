// ============================================================
// MOCK DATA — TajDigital F&B SaaS Dashboard
// ============================================================

export const tenantData = {
  id: "tenant-001",
  name: "Martabak Mas Bambang",
  brandName: "Mas Bambang Group",
  logo: "🥘",
  primaryColor: "#f97316",
  secondaryColor: "#eab308",
  since: "2019",
  plan: "Enterprise",
  totalCabang: 5,
};

// ============================================================
// CABANG DATA
// ============================================================
export const cabangList = [
  { id: "c1", name: "Cabang Demak", city: "Surabaya", status: "active", kasir: 1, revenue: 0, orders: 0, avgOrder: 0, foodCost: 28.4, laborCost: 18.2, rating: 4.8, lastSync: "1 menit lalu" },
  { id: "c2", name: "Cabang Pasar Kembang", city: "Surabaya", status: "active", kasir: 1, revenue: 0, orders: 0, avgOrder: 0, foodCost: 29.1, laborCost: 19.5, rating: 4.7, lastSync: "3 menit lalu" },
];

// ============================================================
// REVENUE TREND DATA
// ============================================================
export const revenueTrend7d = [
  { date: "Sen 16 Des", revenue: 8240000, orders: 228, target: 8000000 },
  { date: "Sel 17 Des", revenue: 9150000, orders: 251, target: 8000000 },
  { date: "Rab 18 Des", revenue: 7820000, orders: 215, target: 8000000 },
  { date: "Kam 19 Des", revenue: 10200000, orders: 280, target: 8000000 },
  { date: "Jum 20 Des", revenue: 12400000, orders: 340, target: 8000000 },
  { date: "Sab 21 Des", revenue: 15600000, orders: 428, target: 8000000 },
  { date: "Min 22 Des", revenue: 13800000, orders: 398, target: 8000000 },
];

export const revenueTrend30d = Array.from({ length: 30 }, (_, i) => {
  const base = 8000000 + Math.sin(i * 0.4) * 2000000;
  const weekend = (i % 7 === 5 || i % 7 === 6) ? 1.4 : 1;
  const revenue = Math.round(base * weekend * (0.9 + Math.random() * 0.25));
  return {
    date: `${i + 1} Nov`,
    revenue,
    orders: Math.round(revenue / 36000),
    target: 8000000,
  };
});

export const revenueTrend90d = Array.from({ length: 90 }, (_, i) => {
  const base = 8000000 + (i / 90) * 2000000;
  const weekend = (i % 7 === 5 || i % 7 === 6) ? 1.4 : 1;
  const revenue = Math.round(base * weekend * (0.85 + Math.random() * 0.3));
  return {
    date: `${i + 1}`,
    revenue,
    orders: Math.round(revenue / 36000),
    target: 8000000,
  };
});

// ============================================================
// MENU DATA
// ============================================================
export const menuList = [
  { id: "m1", name: "Martabak Telur Spesial", category: "Martabak", price: 45000, cost: 14200, margin: 68.4, soldToday: 142, revenue: 6390000, status: "star", stock: "ok" },
  { id: "m2", name: "Terang Bulan Keju Meses", category: "Terang Bulan", price: 38000, cost: 11400, margin: 70.0, soldToday: 128, revenue: 4864000, status: "star", stock: "ok" },
  { id: "m3", name: "Martabak Keju Susu", category: "Martabak", price: 52000, cost: 17000, margin: 67.3, soldToday: 98, revenue: 5096000, status: "star", stock: "ok" },
  { id: "m4", name: "Gorengan Mix (10 pcs)", category: "Gorengan", price: 25000, cost: 9500, margin: 62.0, soldToday: 215, revenue: 5375000, status: "plow-horse", stock: "ok" },
  { id: "m5", name: "Terang Bulan Kacang", category: "Terang Bulan", price: 35000, cost: 11200, margin: 68.0, soldToday: 89, revenue: 3115000, status: "star", stock: "ok" },
  { id: "m6", name: "Martabak Mini Assorted", category: "Martabak", price: 30000, cost: 10800, margin: 64.0, soldToday: 76, revenue: 2280000, status: "puzzle", stock: "low" },
  { id: "m7", name: "Es Teh Manis", category: "Minuman", price: 8000, cost: 2100, margin: 73.8, soldToday: 310, revenue: 2480000, status: "plow-horse", stock: "ok" },
  { id: "m8", name: "Es Jeruk Peras", category: "Minuman", price: 12000, cost: 3500, margin: 70.8, soldToday: 185, revenue: 2220000, status: "plow-horse", stock: "ok" },
  { id: "m9", name: "Martabak Telur Biasa", category: "Martabak", price: 35000, cost: 12800, margin: 63.4, soldToday: 68, revenue: 2380000, status: "dog", stock: "ok" },
  { id: "m10", name: "Terang Bulan Coklat", category: "Terang Bulan", price: 40000, cost: 13500, margin: 66.3, soldToday: 55, revenue: 2200000, status: "dog", stock: "ok" },
];

// ============================================================
// REVENUE BY CABANG
// ============================================================
export const revenueByCabang = [
  { name: "Demak", revenue: 0, target: 50000000, orders: 0 },
  { name: "Pasar Kembang", revenue: 0, target: 45000000, orders: 0 },
];

// ============================================================
// HOURLY SALES HEATMAP
// ============================================================
export const hourlyHeatmap = [
  { day: "Sen", h10: 12, h11: 18, h12: 45, h13: 38, h14: 22, h15: 15, h16: 20, h17: 35, h18: 68, h19: 82, h20: 75, h21: 55, h22: 32 },
  { day: "Sel", h10: 10, h11: 22, h12: 48, h13: 42, h14: 25, h15: 18, h16: 22, h17: 38, h18: 72, h19: 88, h20: 78, h21: 58, h22: 35 },
  { day: "Rab", h10: 8, h11: 16, h12: 42, h13: 35, h14: 20, h15: 12, h16: 18, h17: 32, h18: 65, h19: 78, h20: 70, h21: 52, h22: 28 },
  { day: "Kam", h10: 15, h11: 25, h12: 52, h13: 45, h14: 28, h15: 20, h16: 25, h17: 42, h18: 75, h19: 92, h20: 85, h21: 62, h22: 38 },
  { day: "Jum", h10: 18, h11: 30, h12: 58, h13: 52, h14: 32, h15: 25, h16: 30, h17: 55, h18: 88, h19: 105, h20: 98, h21: 72, h22: 48 },
  { day: "Sab", h10: 25, h11: 42, h12: 75, h13: 68, h14: 45, h15: 38, h16: 48, h17: 78, h18: 115, h19: 132, h20: 125, h21: 95, h22: 65 },
  { day: "Min", h10: 28, h11: 48, h12: 82, h13: 72, h14: 50, h15: 42, h16: 52, h17: 82, h18: 118, h19: 128, h20: 118, h21: 88, h22: 58 },
];

// ============================================================
// AI INSIGHTS
// ============================================================
export const aiInsights = [
  {
    id: "ai1",
    type: "opportunity",
    icon: "📈",
    title: "Peluang Upsell Topping Keju",
    description: "78% pelanggan Martabak Telur Spesial tidak menambah topping. Tambahkan prompt topping di kasir bisa meningkatkan AOV hingga Rp 12.000.",
    impact: "+Rp 1.7M/bulan",
    confidence: 87,
    cabang: "Semua Cabang",
    action: "Lihat Detail",
  },
  {
    id: "ai2",
    type: "warning",
    icon: "⚠️",
    title: "Food Cost Cabang Bekasi Tinggi",
    description: "Food cost Cabang Bekasi 31.5% — 3.7% di atas rata-rata. Kemungkinan penyebab: porsi tidak konsisten atau waste tinggi di adonan.",
    impact: "-Rp 890K waste/hari",
    confidence: 92,
    cabang: "Cabang Bekasi",
    action: "Audit Sekarang",
  },
  {
    id: "ai3",
    type: "forecast",
    icon: "🔮",
    title: "Prediksi Ramai Akhir Pekan",
    description: "Model AI memprediksi penjualan Sabtu-Minggu ini 15-20% di atas rata-rata karena libur Natal. Siapkan stok 20% lebih banyak.",
    impact: "+Rp 4.2M weekend",
    confidence: 81,
    cabang: "BSD & Sudirman",
    action: "Buat Produksi",
  },
  {
    id: "ai4",
    type: "alert",
    icon: "🚨",
    title: "Stok Keju Kraft Kritis",
    description: "Keju Kraft di Cabang Kemang & Depok hanya cukup untuk 2 hari lagi berdasarkan rata-rata penjualan. Segera lakukan pemesanan.",
    impact: "Potensi stockout 2 hari",
    confidence: 96,
    cabang: "Kemang & Depok",
    action: "Buat PO",
  },
  {
    id: "ai5",
    type: "opportunity",
    icon: "💡",
    title: "Jam Sepi 14.00-17.00",
    description: "Slot 14.00-17.00 rata-rata hanya 22 order. Pertimbangkan promo happy hour atau paket sore untuk meningkatkan utilisasi dapur.",
    impact: "+35% slot sepi",
    confidence: 74,
    cabang: "Semua Cabang",
    action: "Buat Promo",
  },
];

// ============================================================
// CRITICAL ALERTS
// ============================================================
export const criticalAlerts = [
  { id: "a1", severity: "critical", title: "Stok Minyak Goreng Habis", cabang: "Cabang Depok", time: "10 menit lalu", type: "inventory" },
  { id: "a2", severity: "warning", title: "3 Persetujuan PO Menunggu", cabang: "Head Office", time: "25 menit lalu", type: "approval" },
  { id: "a3", severity: "warning", title: "Shift Malam Belum Ada Kasir", cabang: "Cabang Kemang", time: "1 jam lalu", type: "sdm" },
  { id: "a4", severity: "info", title: "Rekonsiliasi Shift Siang Selesai", cabang: "Cabang BSD", time: "2 jam lalu", type: "finance" },
];

// ============================================================
// INVENTORY DATA
// ============================================================
export const inventoryItems = [
  { id: "i1", name: "Tepung Terigu Cakra", unit: "kg", stock: 85, minStock: 50, reorderPoint: 60, cost: 12000, supplier: "PT. Bogasari", category: "Bahan Baku", cabang: "BSD" },
  { id: "i2", name: "Telur Ayam", unit: "butir", stock: 240, minStock: 200, reorderPoint: 250, cost: 2200, supplier: "Peternakan Pak Hadi", category: "Bahan Baku", cabang: "BSD" },
  { id: "i3", name: "Keju Kraft Slice", unit: "pcs", stock: 45, minStock: 100, reorderPoint: 120, cost: 8500, supplier: "PT. Kraft Heinz", category: "Topping", cabang: "Kemang" },
  { id: "i4", name: "Minyak Goreng Bimoli", unit: "liter", stock: 8, minStock: 20, reorderPoint: 25, cost: 18000, supplier: "PT. Salim Ivomas", category: "Bahan Baku", cabang: "Depok" },
  { id: "i5", name: "Gula Pasir", unit: "kg", stock: 32, minStock: 20, reorderPoint: 25, cost: 14000, supplier: "PT. Gulaku", category: "Bahan Baku", cabang: "Sudirman" },
  { id: "i6", name: "Meses Coklat", unit: "kg", stock: 12, minStock: 10, reorderPoint: 12, cost: 45000, supplier: "PT. Ceres", category: "Topping", cabang: "Semua" },
  { id: "i7", name: "Susu Kental Manis", unit: "kaleng", stock: 68, minStock: 40, reorderPoint: 50, cost: 12500, supplier: "PT. Frisian Flag", category: "Topping", cabang: "Semua" },
  { id: "i8", name: "Kacang Tanah", unit: "kg", stock: 18, minStock: 15, reorderPoint: 18, cost: 22000, supplier: "Supplier Lokal", category: "Topping", cabang: "Semua" },
];

// ============================================================
// FINANCE DATA
// ============================================================
export const pnlData = [
  { month: "Jul", revenue: 162000000, cogs: 48600000, grossProfit: 113400000, opex: 45360000, netProfit: 68040000 },
  { month: "Agu", revenue: 175000000, cogs: 51625000, grossProfit: 123375000, opex: 47250000, netProfit: 76125000 },
  { month: "Sep", revenue: 168000000, cogs: 49728000, grossProfit: 118272000, opex: 46200000, netProfit: 72072000 },
  { month: "Okt", revenue: 182000000, cogs: 54236000, grossProfit: 127764000, opex: 48580000, netProfit: 79184000 },
  { month: "Nov", revenue: 195000000, cogs: 57915000, grossProfit: 137085000, opex: 51480000, netProfit: 85605000 },
  { month: "Des", revenue: 185200000, cogs: 54834000, grossProfit: 130366000, opex: 49000000, netProfit: 81366000 },
];

// ============================================================
// APPROVALS
// ============================================================
export const approvalsList = [
  { id: "ap1", type: "purchase_order", title: "PO Tepung Terigu 200kg", requestedBy: "Ahmad Sudirman", cabang: "Cabang BSD", amount: 2400000, requestedAt: "2024-12-22 09:15", status: "pending", priority: "high" },
  { id: "ap2", type: "discount", title: "Diskon Event Natal 20%", requestedBy: "Sari Kemang", cabang: "Cabang Kemang", amount: 450000, requestedAt: "2024-12-22 08:30", status: "pending", priority: "medium" },
  { id: "ap3", type: "purchase_order", title: "PO Keju Kraft 50 pcs", requestedBy: "Budi Depok", cabang: "Cabang Depok", amount: 425000, requestedAt: "2024-12-21 16:45", status: "pending", priority: "critical" },
  { id: "ap4", type: "refund", title: "Refund Order #1842", requestedBy: "Kasir Bekasi", cabang: "Cabang Bekasi", amount: 52000, requestedAt: "2024-12-21 14:20", status: "pending", priority: "low" },
  { id: "ap5", type: "purchase_order", title: "PO Minyak Goreng 50L", requestedBy: "Kasir Sudirman", cabang: "Cabang Sudirman", amount: 900000, requestedAt: "2024-12-21 11:00", status: "approved", priority: "high" },
];

// ============================================================
// PRODUCTION DATA
// ============================================================
export const productionPlan = [
  { id: "p1", menu: "Martabak Telur Spesial", targetQty: 180, producedQty: 165, yield: 91.7, variance: -8.3, status: "on-track", aiSuggested: 180, cabang: "Cabang BSD" },
  { id: "p2", menu: "Terang Bulan Keju Meses", targetQty: 150, producedQty: 148, yield: 98.7, variance: -1.3, status: "on-track", aiSuggested: 150, cabang: "Cabang Kemang" },
  { id: "p3", menu: "Gorengan Mix", targetQty: 250, producedQty: 212, yield: 84.8, variance: -15.2, status: "behind", aiSuggested: 280, cabang: "Cabang Depok" },
  { id: "p4", menu: "Martabak Keju Susu", targetQty: 120, producedQty: 125, yield: 104.2, variance: 4.2, status: "ahead", aiSuggested: 120, cabang: "Cabang Sudirman" },
  { id: "p5", menu: "Es Teh Manis (per batch)", targetQty: 400, producedQty: 398, yield: 99.5, variance: -0.5, status: "on-track", aiSuggested: 420, cabang: "Cabang BSD" },
];

// ============================================================
// SDM / SHIFT DATA
// ============================================================
export const shiftData = [
  { id: "s1", cabang: "Cabang BSD", shift: "Pagi (07:00-15:00)", staff: ["Andi", "Budi", "Cici"], kasir: "Andi", status: "active", sales: 18200000 },
  { id: "s2", cabang: "Cabang BSD", shift: "Sore (15:00-23:00)", staff: ["Dedi", "Eva", "Fajar", "Gita"], kasir: "Dedi", status: "upcoming", sales: 0 },
  { id: "s3", cabang: "Cabang Sudirman", shift: "Pagi (07:00-15:00)", staff: ["Hana", "Ivan"], kasir: "Hana", status: "active", sales: 14500000 },
  { id: "s4", cabang: "Cabang Kemang", shift: "Pagi (07:00-15:00)", staff: ["Joko", "Lia"], kasir: "Joko", status: "active", sales: 12300000 },
  { id: "s5", cabang: "Cabang Depok", shift: "Pagi (07:00-15:00)", staff: ["Mira"], kasir: "Mira", status: "warning", sales: 9800000 },
  { id: "s6", cabang: "Cabang Bekasi", shift: "Pagi (07:00-15:00)", staff: [], kasir: "-", status: "vacant", sales: 0 },
];

// ============================================================
// SALES ANALYTICS DATA
// ============================================================
export const salesByChannel = [
  { channel: "Dine-in", value: 42, revenue: 77784000 },
  { channel: "GrabFood", value: 28, revenue: 51856000 },
  { channel: "GoFood", value: 18, revenue: 33336000 },
  { channel: "ShopeeFood", value: 8, revenue: 14816000 },
  { channel: "WhatsApp Order", value: 4, revenue: 7408000 },
];

export const salesByTime = [
  { time: "10-12", orders: 180 },
  { time: "12-14", orders: 420 },
  { time: "14-16", orders: 185 },
  { time: "16-18", orders: 320 },
  { time: "18-20", orders: 680 },
  { time: "20-22", orders: 740 },
  { time: "22-24", orders: 380 },
];

// ============================================================
// FORECAST DATA
// ============================================================
export const forecastData = [
  { date: "23 Des", actual: null, forecast: 14200000, lower: 12800000, upper: 15600000 },
  { date: "24 Des", actual: null, forecast: 16800000, lower: 15100000, upper: 18500000 },
  { date: "25 Des", actual: null, forecast: 22400000, lower: 20200000, upper: 24600000 },
  { date: "26 Des", actual: null, forecast: 18900000, lower: 17000000, upper: 20800000 },
  { date: "27 Des", actual: null, forecast: 15600000, lower: 14000000, upper: 17200000 },
  { date: "28 Des", actual: null, forecast: 20100000, lower: 18100000, upper: 22100000 },
  { date: "29 Des", actual: null, forecast: 24500000, lower: 22000000, upper: 27000000 },
];

// ============================================================
// KPI SUMMARY
// ============================================================
export const kpiSummary = {
  totalRevenue: { value: 185200000, change: 8.4, label: "Total Pendapatan", period: "bulan ini" },
  grossMargin: { value: 70.4, change: 1.2, label: "persentase laba kotor", period: "bulan ini" },
  foodCost: { value: 29.6, change: -0.8, label: "Modal Bahan Baku", period: "bulan ini" },
  laborCost: { value: 19.2, change: -0.3, label: "Gaji Pegawai", period: "bulan ini" },
  wastePercent: { value: 3.8, change: -0.5, label: "Bahan Terbuang", period: "bulan ini" },
  totalOrders: { value: 5140, change: 12.3, label: "total pesanan", period: "bulan ini" },
  aov: { value: 36040, change: 3.2, label: "Rata-rata Belanja Pelanggan", period: "bulan ini" },
  activeCabang: { value: 4, change: 0, label: "Cabang Aktif", period: "dari 5 cabang" },
};
