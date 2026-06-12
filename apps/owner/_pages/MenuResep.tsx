"use client";

import { useState } from "react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { menuList } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const defaultBom: Record<string, { ingredient: string; qty: number; unit: string; cost: number }[]> = {
  "m1": [
    { ingredient: "Tepung Terigu Cakra", qty: 150, unit: "gr", cost: 1800 },
    { ingredient: "Telur Ayam", qty: 3, unit: "butir", cost: 6600 },
    { ingredient: "Minyak Goreng", qty: 50, unit: "ml", cost: 900 },
    { ingredient: "Daun Bawang", qty: 20, unit: "gr", cost: 400 },
    { ingredient: "Garam & Bumbu", qty: 10, unit: "gr", cost: 500 },
  ],
  "m2": [
    { ingredient: "Tepung Terigu Segitiga", qty: 200, unit: "gr", cost: 2400 },
    { ingredient: "Keju Kraft Slice", qty: 3, unit: "pcs", cost: 25500 },
    { ingredient: "Meses Coklat", qty: 30, unit: "gr", cost: 1350 },
    { ingredient: "Margarin Blue Band", qty: 40, unit: "gr", cost: 1200 },
    { ingredient: "Gula Pasir", qty: 50, unit: "gr", cost: 700 },
    { ingredient: "Susu Kental Manis", qty: 30, unit: "ml", cost: 750 },
  ],
};

const statusColors: Record<string, string> = {
  star: "#22c55e",
  "plow-horse": "#3b82f6",
  puzzle: "#f59e0b",
  dog: "#ef4444",
};

function EngineeringTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl max-w-[200px]">
        <p className="text-xs font-bold text-slate-800 dark:text-slate-100 mb-1">{d.name}</p>
        <p className="text-xs text-slate-500">Terjual: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.x} pcs</span></p>
        <p className="text-xs text-slate-500">Margin: <span className="font-semibold text-slate-700 dark:text-slate-200">{d.y.toFixed(1)}%</span></p>
        <p className="text-xs text-slate-500">Revenue: <span className="font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(d.revenue, true)}</span></p>
      </div>
    );
  }
  return null;
}

export default function MenuResep({
  initialMenuItems = [],
  initialCategories = [],
  initialBom = {}
}: {
  initialMenuItems?: any[];
  initialCategories?: string[];
  initialBom?: Record<string, any[]>;
}) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"list" | "engineering">("list");

  const activeMenuItems = initialMenuItems.length > 0 ? initialMenuItems : menuList.map(m => ({
    id: m.id,
    name: m.name,
    category: m.category,
    price: m.price,
    cost: m.cost,
    margin: m.margin,
    soldToday: m.soldToday,
    status: m.status,
    stock: m.stock,
  }));

  const bom = Object.keys(initialBom).length > 0 ? initialBom : defaultBom;

  const engineeringData = activeMenuItems.map(m => ({
    name: m.name,
    x: m.soldToday,
    y: m.margin,
    revenue: m.soldToday * m.price,
    status: m.status,
    category: m.category,
  }));

  const avgSold = engineeringData.length > 0
    ? engineeringData.reduce((sum, m) => sum + m.x, 0) / engineeringData.length
    : 0;
  const avgMargin = engineeringData.length > 0
    ? engineeringData.reduce((sum, m) => sum + m.y, 0) / engineeringData.length
    : 0;

  const categories = ["all", ...(initialCategories.length > 0 ? initialCategories : Array.from(new Set(menuList.map(m => m.category))))];

  const filtered = activeMenuItems.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = categoryFilter === "all" || m.category === categoryFilter;
    return matchSearch && matchCat;
  });

  const selectedItem = activeMenuItems.find(m => m.id === selectedMenu);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Menu & Resep (BOM)</h2>
          <p className="text-sm text-slate-500 mt-0.5">{menuList.length} menu aktif Â· Bill of Materials</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">Export Menu</Button>
          <Button variant="primary" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Menu</Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg w-fit">
        {(["list", "engineering"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeTab === tab ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"
            }`}
          >
            {tab === "list" ? "ðŸ“‹ Daftar Menu" : "ðŸ“Š Menu Engineering"}
          </button>
        ))}
      </div>

      {activeTab === "list" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Menu List */}
          <div className="lg:col-span-2 space-y-3">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Cari menu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  icon={
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                      categoryFilter === cat
                        ? "bg-orange-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
                    }`}
                  >
                    {cat === "all" ? "Semua" : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Menu Table */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    {["Menu", "Kategori", "Harga", "HPP", "Margin", "Terjual", "Status", ""].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.map((menu) => (
                    <tr
                      key={menu.id}
                      onClick={() => setSelectedMenu(menu.id === selectedMenu ? null : menu.id)}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer ${selectedMenu === menu.id ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}
                    >
                      <td className="px-4 py-3">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{menu.name}</p>
                        <p className="text-xs text-slate-400">{menu.stock === "low" ? "âš  Stok rendah" : ""}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="neutral" size="sm">{menu.category}</Badge>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{formatRupiah(menu.price)}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(menu.cost)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm font-bold ${menu.margin >= 68 ? "text-emerald-600" : menu.margin >= 62 ? "text-amber-600" : "text-red-500"}`}>
                          {formatPercent(menu.margin)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{menu.soldToday}</td>
                      <td className="px-4 py-3">
                        <Badge variant={menu.status === "star" ? "success" : menu.status === "plow-horse" ? "info" : menu.status === "puzzle" ? "warning" : "neutral"}>
                          {menu.status === "star" ? "â­ Star" : menu.status === "plow-horse" ? "ðŸ´ Plough" : menu.status === "puzzle" ? "ðŸ§© Puzzle" : "ðŸ• Dog"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button className="text-orange-500 hover:text-orange-600">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recipe Detail Panel */}
          <div className="space-y-4">
            {selectedItem ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
                    <Badge variant="neutral" size="sm" className="mt-1">{selectedItem.category}</Badge>
                  </div>
                  <button onClick={() => setSelectedMenu(null)} className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                    <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Cost Summary */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-slate-500 mb-0.5">Harga Jual</p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-100">{formatRupiah(selectedItem.price)}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/20 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-amber-600 mb-0.5">HPP</p>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{formatRupiah(selectedItem.cost)}</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-2.5 text-center">
                    <p className="text-xs text-emerald-600 mb-0.5">Margin</p>
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{formatPercent(selectedItem.margin)}</p>
                  </div>
                </div>

                {/* BOM Tree */}
                <h4 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-3">ðŸŒ³ Bill of Materials</h4>
                {bom[selectedItem.id] ? (
                  <div className="space-y-2">
                    {bom[selectedItem.id].map((ing, i) => (
                      <div key={i} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">{ing.ingredient}</p>
                          <p className="text-xs text-slate-400">{ing.qty} {ing.unit}</p>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex-shrink-0">{formatRupiah(ing.cost)}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Total HPP</span>
                      <span className="text-sm font-bold text-orange-600">{formatRupiah(bom[selectedItem.id].reduce((sum, i) => sum + i.cost, 0))}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-400">
                    <p className="text-xs">Resep belum diinput</p>
                    <Button variant="outline" size="sm" className="mt-3">+ Tambah Resep</Button>
                  </div>
                )}

                <Button variant="outline" size="sm" className="w-full mt-4">âœï¸ Edit Resep</Button>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-8 text-center">
                <div className="text-3xl mb-3">ðŸ“‹</div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Pilih menu untuk melihat resep</p>
                <p className="text-xs text-slate-400 mt-1">Klik baris menu di sebelah kiri</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "engineering" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Menu Engineering Matrix</h3>
            <p className="text-xs text-slate-500 mt-0.5">Volume penjualan (X) vs Margin (Y) â€” klik titik untuk detail</p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            {[
              { label: "â­ Star (margin tinggi, laku)", color: "#22c55e" },
              { label: "ðŸ´ Plow-horse (margin rendah, laku)", color: "#3b82f6" },
              { label: "ðŸ§© Puzzle (margin tinggi, tidak laku)", color: "#f59e0b" },
              { label: "ðŸ• Dog (margin rendah, tidak laku)", color: "#ef4444" },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-slate-500">{item.label}</span>
              </div>
            ))}
          </div>

          <ResponsiveContainer width="100%" height={340}>
            <ScatterChart margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                type="number"
                dataKey="x"
                name="Volume"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                label={{ value: "Volume Terjual (pcs/hari)", position: "insideBottom", offset: -5, fontSize: 11, fill: "#94a3b8" }}
              />
              <YAxis
                type="number"
                dataKey="y"
                name="Margin"
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `${v}%`}
                label={{ value: "Gross Margin (%)", angle: -90, position: "insideLeft", fontSize: 11, fill: "#94a3b8" }}
              />
              <Tooltip content={<EngineeringTooltip />} />
              <ReferenceLine x={avgSold} stroke="#cbd5e1" strokeDasharray="4 4" label={{ value: "Avg", position: "insideTopRight", fontSize: 10, fill: "#94a3b8" }} />
              <ReferenceLine y={avgMargin} stroke="#cbd5e1" strokeDasharray="4 4" label={{ value: "Avg", position: "insideTopLeft", fontSize: 10, fill: "#94a3b8" }} />
              <Scatter
                data={engineeringData}
                fill="#f97316"
                shape={(props: any) => {
                  const { cx, cy, payload } = props;
                  const color = statusColors[payload.status] || "#f97316";
                  return (
                    <circle cx={cx} cy={cy} r={8} fill={color} fillOpacity={0.85} stroke="white" strokeWidth={2} />
                  );
                }}
              />
            </ScatterChart>
          </ResponsiveContainer>

          {/* Quadrant Labels */}
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { label: "â­ Stars", desc: "Margin tinggi, laku â€” pertahankan & promosikan", color: "emerald", count: engineeringData.filter(m => m.status === "star").length },
              { label: "ðŸ§© Puzzles", desc: "Margin tinggi, kurang laku â€” perlu promosi lebih", color: "amber", count: engineeringData.filter(m => m.status === "puzzle").length },
              { label: "ðŸ´ Plow-horses", desc: "Laku tapi margin tipis â€” optimalkan HPP", color: "blue", count: engineeringData.filter(m => m.status === "plow-horse").length },
              { label: "ðŸ• Dogs", desc: "Tidak laku & margin rendah â€” pertimbangkan hapus", color: "red", count: engineeringData.filter(m => m.status === "dog").length },
            ].map(q => (
              <div key={q.label} className={`bg-${q.color}-50 dark:bg-${q.color}-950/10 border border-${q.color}-200 dark:border-${q.color}-900/30 rounded-lg p-3`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{q.label}</span>
                  <Badge variant={q.color === "emerald" ? "success" : q.color === "amber" ? "warning" : q.color === "blue" ? "info" : "danger"} size="sm">{q.count} menu</Badge>
                </div>
                <p className="text-xs text-slate-500">{q.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



