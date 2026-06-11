"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cabangList, revenueByCabang } from "@/data/mockData";
import { formatRupiah, formatPercent } from "@/utils/format";

const METRIC_COLORS = ["#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];

function CompareTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{formatRupiah(entry.value, true)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Cabang() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = cabangList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Manajemen Cabang</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {cabangList.filter(c => c.status === "active").length} aktif Â· {cabangList.filter(c => c.status === "maintenance").length} maintenance dari {cabangList.length} cabang
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          }>Export</Button>
          <Button variant="primary" size="sm" onClick={() => setShowAdd(true)} icon={
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          }>Tambah Cabang</Button>
        </div>
      </div>

      {/* Search + View Toggle */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Cari cabang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg h-fit">
          <button
            onClick={() => setView("cards")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "cards" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"}`}
          >
            Kartu
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "table" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm" : "text-slate-500"}`}
          >
            Tabel
          </button>
        </div>
      </div>

      {/* Branch Cards */}
      {view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cabang) => (
            <div key={cabang.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-all group cursor-pointer">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-lg shadow-sm">
                    ðŸª
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.name}</p>
                    <p className="text-xs text-slate-500">{cabang.city}</p>
                  </div>
                </div>
                <Badge variant={cabang.status === "active" ? "success" : "warning"}>
                  {cabang.status === "active" ? "â— Aktif" : "âš  Maintenance"}
                </Badge>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Revenue</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatRupiah(cabang.revenue, true)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Orders</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.orders.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Food Cost</p>
                  <p className={`text-sm font-bold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatPercent(cabang.foodCost)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Rating</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">â­ {cabang.rating}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Food Cost</span>
                    <span className={`text-xs font-semibold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.foodCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.foodCost > 30 ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.foodCost / 40) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Labor Cost</span>
                    <span className={`text-xs font-semibold ${cabang.laborCost > 20 ? "text-amber-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.laborCost > 20 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.laborCost / 30) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">{cabang.kasir} kasir aktif Â· {cabang.lastSync}</span>
                <button className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline group-hover:text-orange-700">
                  Lihat Detail â†’
                </button>
              </div>
            </div>
          ))}

          {/* Add Branch Card */}
          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center gap-3 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-all group min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 group-hover:bg-orange-100 dark:group-hover:bg-orange-950/30 flex items-center justify-center transition-colors">
              <svg className="w-6 h-6 text-slate-400 group-hover:text-orange-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 group-hover:text-orange-600 transition-colors">Tambah Cabang Baru</p>
              <p className="text-xs text-slate-400 mt-1">Klik untuk mendaftarkan cabang baru</p>
            </div>
          </button>
        </div>
      )}

      {/* Table View */}
      {view === "table" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama Cabang", "Kota", "Status", "Revenue", "Orders", "AOV", "Food Cost", "Labor Cost", "Rating", "Last Sync", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((cabang) => (
                  <tr key={cabang.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">ðŸª</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{cabang.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cabang.city}</td>
                    <td className="px-4 py-3">
                      <Badge variant={cabang.status === "active" ? "success" : "warning"}>
                        {cabang.status === "active" ? "Aktif" : "Maintenance"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-200">{formatRupiah(cabang.revenue, true)}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cabang.orders.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{formatRupiah(cabang.avgOrder, true)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.foodCost)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold ${cabang.laborCost > 20 ? "text-amber-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">â­ {cabang.rating}</td>
                    <td className="px-4 py-3 text-xs text-slate-400">{cabang.lastSync}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Comparison Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Perbandingan Performa Cabang</h3>
            <p className="text-xs text-slate-500 mt-0.5">Revenue vs Target bulan ini</p>
          </div>
          <Badge variant="info" size="sm">Desember 2024</Badge>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={revenueByCabang} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={56} />
            <Tooltip content={<CompareTooltip />} />
            <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
            <Bar dataKey="revenue" name="Revenue" radius={[4, 4, 0, 0]} maxBarSize={36}>
              {revenueByCabang.map((_, index) => (
                <Cell key={index} fill={METRIC_COLORS[index % METRIC_COLORS.length]} />
              ))}
            </Bar>
            <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Add Branch Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Cabang Baru</h3>
              <button onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <Input label="Nama Cabang" placeholder="Cabang Menteng" />
              <Input label="Kota" placeholder="Jakarta" />
              <Input label="Alamat" placeholder="Jl. Menteng Raya No. 12..." />
              <Input label="No. Telepon" placeholder="+62 21 xxxx xxxx" />
              <Input label="Nama PIC" placeholder="Nama manajer cabang" />
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Batal</Button>
              <Button variant="primary" className="flex-1" onClick={() => setShowAdd(false)}>Simpan Cabang</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



