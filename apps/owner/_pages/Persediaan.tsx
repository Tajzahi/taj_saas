"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { inventoryItems } from "@/data/mockData";
import { formatRupiah } from "@/utils/format";

const defaultWasteLog = [
  { date: "22 Des", item: "Adonan Martabak", qty: 2.3, unit: "kg", reason: "Tidak habis terjual", cost: 27600, cabang: "BSD" },
  { date: "22 Des", item: "Telur Ayam", qty: 12, unit: "butir", reason: "Pecah saat penyimpanan", cost: 26400, cabang: "Kemang" },
  { date: "21 Des", item: "Tepung Terigu", qty: 1.8, unit: "kg", reason: "Kadaluarsa", cost: 21600, cabang: "Depok" },
  { date: "21 Des", item: "Keju Kraft", qty: 5, unit: "pcs", reason: "Tidak habis / expired", cost: 42500, cabang: "Sudirman" },
  { date: "20 Des", item: "Minyak Goreng", qty: 3, unit: "liter", reason: "Kualitas menurun", cost: 54000, cabang: "Bekasi" },
];

const defaultWasteChart = [
  { date: "17 Des", waste: 125000 },
  { date: "18 Des", waste: 98000 },
  { date: "19 Des", waste: 145000 },
  { date: "20 Des", waste: 187000 },
  { date: "21 Des", waste: 112000 },
  { date: "22 Des", waste: 96500 },
];

function StockBadge({ stock, min }: { stock: number; min: number }) {
  const ratio = stock / min;
  if (ratio < 0.5) return <Badge variant="danger">Kritis</Badge>;
  if (ratio < 1) return <Badge variant="warning">Rendah</Badge>;
  return <Badge variant="success">Normal</Badge>;
}

export default function Persediaan({
  initialInventoryItems = [],
  initialWasteLog = [],
  initialWasteChart = [],
}: {
  initialInventoryItems?: any[];
  initialWasteLog?: any[];
  initialWasteChart?: any[];
}) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"stock" | "waste">("stock");

  const inventoryItems = initialInventoryItems.length > 0 ? initialInventoryItems : [
    { id: "inv1", name: "Tepung Terigu Cakra", category: "Bahan Baku", stock: 45, minStock: 50, unit: "kg", cost: 540000, supplier: "PT Bogasari" },
    { id: "inv2", name: "Keju Kraft Quick Melt", category: "Topping", stock: 12, minStock: 10, unit: "pcs", cost: 1020000, supplier: "PT Indofood" },
    { id: "inv3", name: "Telur Ayam", category: "Bahan Baku", stock: 80, minStock: 200, unit: "butir", cost: 176000, supplier: "Distributor Telur Lokal" },
    { id: "inv4", name: "Minyak Goreng Filma", category: "Bahan Baku", stock: 35, minStock: 20, unit: "liter", cost: 630000, supplier: "PT Filma" },
  ];

  const wasteLog = initialWasteLog.length > 0 ? initialWasteLog : defaultWasteLog;
  const wasteChart = initialWasteChart.length > 0 ? initialWasteChart : defaultWasteChart;

  const filtered = inventoryItems.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const ratio = item.stock / item.minStock;
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "critical" ? ratio < 0.5 :
      filterStatus === "low" ? ratio < 1 :
      ratio >= 1;
    return matchSearch && matchStatus;
  });

  const criticalCount = inventoryItems.filter(i => i.stock / i.minStock < 0.5).length;
  const lowCount = inventoryItems.filter(i => i.stock / i.minStock >= 0.5 && i.stock / i.minStock < 1).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persediaan (Inventory)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{criticalCount} kritis</span> Â· <span className="text-amber-600 font-semibold">{lowCount} rendah</span> Â· {inventoryItems.length} total item
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Buat PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Item", value: inventoryItems.length.toString(), icon: "ðŸ“¦", color: "blue" },
          { label: "Item Kritis", value: criticalCount.toString(), icon: "ðŸš¨", color: "red" },
          { label: "Item Rendah", value: lowCount.toString(), icon: "âš ï¸", color: "amber" },
          { label: "Total Waste Hari Ini", value: formatRupiah(wasteLog.filter(w => w.date === "22 Des").reduce((s, w) => s + w.cost, 0), true), icon: "ðŸ—‘ï¸", color: "slate" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.icon}</span>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
                <p className="text-xs text-slate-500">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(["stock", "waste"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab === "stock" ? "ðŸ“¦ Stok Bahan" : "ðŸ—‘ï¸ Waste Log"}
          </button>
        ))}
      </div>

      {activeTab === "stock" && (
        <>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Cari bahan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                }
              />
            </div>
            <div className="flex items-center gap-1">
              {[
                { key: "all", label: "Semua" },
                { key: "critical", label: "ðŸš¨ Kritis" },
                { key: "low", label: "âš ï¸ Rendah" },
                { key: "ok", label: "âœ… Normal" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === f.key
                      ? "bg-orange-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Bahan Baku", "Kategori", "Cabang", "Stok Saat Ini", "Min. Stok", "Status", "Harga/Unit", "Supplier", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((item) => {
                    const ratio = item.stock / item.minStock;
                    const isLow = ratio < 1;
                    return (
                      <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${ratio < 0.5 ? "bg-red-50/30 dark:bg-red-950/5" : ratio < 1 ? "bg-amber-50/30 dark:bg-amber-950/5" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {ratio < 0.5 && <span className="text-red-500 text-sm">ðŸš¨</span>}
                            {ratio >= 0.5 && ratio < 1 && <span className="text-amber-500 text-sm">âš ï¸</span>}
                            {ratio >= 1 && <span className="text-emerald-500 text-sm">âœ…</span>}
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge variant="neutral" size="sm">{item.category}</Badge></td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.cabang}</td>
                        <td className="px-4 py-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-bold ${isLow ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-200"}`}>
                                {item.stock} {item.unit}
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-24 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${ratio < 0.5 ? "bg-red-400" : ratio < 1 ? "bg-amber-400" : "bg-emerald-400"}`}
                                style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{item.minStock} {item.unit}</td>
                        <td className="px-4 py-3"><StockBadge stock={item.stock} min={item.minStock} /></td>
                        <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(item.cost)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{item.supplier}</td>
                        <td className="px-4 py-3">
                          <Button variant="outline" size="sm">Buat PO</Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "waste" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Log Waste Terbaru</h3>
                <Button variant="outline" size="sm">Export</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {["Tanggal", "Bahan", "Qty", "Penyebab", "Kerugian", "Cabang"].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-slate-400 px-3 py-2.5 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {wasteLog.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-3 py-2.5 text-xs text-slate-500">{log.date}</td>
                        <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">{log.item}</td>
                        <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{log.qty} {log.unit}</td>
                        <td className="px-3 py-2.5 text-xs text-slate-500">{log.reason}</td>
                        <td className="px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatRupiah(log.cost)}</td>
                        <td className="px-3 py-2.5"><Badge variant="neutral" size="sm">{log.cabang}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Tren Waste 7 Hari</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={wasteChart} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={52} />
                <Tooltip formatter={(v: any) => [formatRupiah(Number(v)), "Waste"]} />
                <Bar dataKey="waste" fill="#f87171" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/30">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Total Waste Minggu Ini</p>
              <p className="text-lg font-bold text-red-800 dark:text-red-300 mt-0.5">
                {formatRupiah(wasteChart.reduce((s, w) => s + w.waste, 0), true)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



