"use client";

import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { formatPercent } from "@/utils/format";
import { useOwnerStore } from "@/store/ownerStore";
import { getProductionPlanAction, createProductionPlanItemAction } from "@/app/actions/production";

const statusConfig = {
  "on-track": { label: "On Track", variant: "success" as const, icon: "✅" },
  "behind": { label: "Terlambat", variant: "danger" as const, icon: "🔴" },
  "ahead": { label: "Lebih", variant: "info" as const, icon: "🔵" },
};

function ProdTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-3 shadow-xl">
        <p className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-200">{label}</p>
        {payload.map((entry: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-500">{entry.name}:</span>
            <span className="font-semibold">{entry.value} {entry.name === "Yield" ? "%" : "pcs"}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export default function Produksi() {
  const [date] = useState("Hari ini");
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranchId } = useOwnerStore();

  // Add Item Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMenuName, setAddMenuName] = useState("");
  const [addTargetQty, setAddTargetQty] = useState(30);
  const [addProducedQty, setAddProducedQty] = useState(0);

  // Edit Item Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editTargetQty, setEditTargetQty] = useState(0);
  const [editProducedQty, setEditProducedQty] = useState(0);

  useEffect(() => {
    getProductionPlanAction().then(res => {
      if (res.success && res.data) {
        setPlans(res.data);
      }
      setLoading(false);
    });
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addMenuName.trim() || addTargetQty <= 0) return;
    setLoading(true);

    const res = await createProductionPlanItemAction({
      menuName: addMenuName,
      targetQty: addTargetQty,
      producedQty: addProducedQty,
    });

    setLoading(false);
    if (res.success && res.data) {
      setPlans(prev => [res.data, ...prev]);
      setShowAddModal(false);
      setAddMenuName("");
      setAddTargetQty(30);
      setAddProducedQty(0);
    } else {
      alert("Gagal menambahkan item produksi: " + (res.error || ""));
    }
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setEditTargetQty(item.targetQty);
    setEditProducedQty(item.producedQty);
    setShowEditModal(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || editTargetQty <= 0) return;

    const yieldPct = editTargetQty > 0 ? Number(((editProducedQty / editTargetQty) * 100).toFixed(1)) : 100;
    const variance = Number((yieldPct - 100).toFixed(1));
    let status = "on-track";
    if (yieldPct < 85) status = "behind";
    else if (yieldPct > 102) status = "ahead";

    setPlans(prev => prev.map(p => p.id === editingItem.id ? {
      ...p,
      targetQty: editTargetQty,
      producedQty: editProducedQty,
      yield: yieldPct,
      variance,
      status,
    } : p));

    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus item rencana produksi ini?")) {
      setPlans(prev => prev.filter(p => p.id !== id));
    }
  };

  let branchName = "Semua Cabang";
  if (selectedBranchId && selectedBranchId !== "all") {
    branchName = "Cabang Terpilih";
  }

  const filteredPlan = plans;
  const yieldChart = plans.map(p => ({ name: p.menu.split(" ")[0], target: p.targetQty, produced: p.producedQty, yield: p.yield }));

  const onTrack = filteredPlan.filter(p => p.status === "on-track").length;
  const behind = filteredPlan.filter(p => p.status === "behind").length;
  const ahead = filteredPlan.filter(p => p.status === "ahead").length;
  const avgYield = filteredPlan.length > 0
    ? filteredPlan.reduce((sum, p) => sum + p.yield, 0) / filteredPlan.length
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Produksi {selectedBranchId && selectedBranchId !== "all" && `- ${branchName}`}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Rencana harian & laporan yield — {date}</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "On Track", value: onTrack.toString(), icon: "✅", desc: "item sesuai target" },
          { label: "Terlambat", value: behind.toString(), icon: "🔴", desc: "item di bawah target" },
          { label: "Lebih Produksi", value: ahead.toString(), icon: "🔵", desc: "item di atas target" },
          { label: "Rata-rata Yield", value: `${formatPercent(avgYield)}`, icon: "📊", desc: "dari semua item" },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{card.icon}</span>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{card.label}</p>
            <p className="text-xs text-slate-400">{card.desc}</p>
          </div>
        ))}
      </div>

      {/* Production Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Rencana Produksi Harian</h3>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ExportDropdown 
              data={filteredPlan}
              columns={["Item", "Kategori", "Cabang", "Target", "Aktual", "Yield", "Status"]}
              filename="rencana_produksi"
              title="Rencana Produksi"
              pdfDataMapper={(item) => [item.menu, item.category || "Dapur", item.cabang, item.targetQty, item.producedQty, item.yield, item.status]}
            />
            <Button 
              variant="primary" 
              size="sm" 
              className="flex-1 sm:flex-initial"
              onClick={() => setShowAddModal(true)}
            >
              + Tambah Item
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-800/50">
              <tr>
                {["Menu", "Target", "Diproduksi", "Yield %", "Variance", "Status", "Aksi"].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPlan.length > 0 ? (
                filteredPlan.map((item) => {
                  const cfg = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["on-track"];
                  return (
                    <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.menu}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.targetQty} pcs</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.producedQty} pcs</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-bold text-emerald-600">{formatPercent(item.yield)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-semibold text-emerald-600">{formatPercent(item.variance)}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={cfg.variant}>{cfg.icon} {cfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                          >
                            Edit
                          </Button>
                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                            title="Hapus Rencana Produksi"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-xs text-slate-400">
                    Belum ada rencana produksi harian yang dibuat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Yield Chart */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Target vs Produksi Aktual</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={yieldChart} margin={{ top: 0, right: 4, left: 0, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} tickLine={false} axisLine={false} angle={-15} textAnchor="end" height={50} />
            <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
            <Tooltip content={<ProdTooltip />} />
            <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="produced" name="Produksi" radius={[4, 4, 0, 0]} maxBarSize={28}>
              {yieldChart.map((item, i) => (
                <Cell
                  key={i}
                  fill={item.produced >= item.target ? "#22c55e" : item.produced >= item.target * 0.9 ? "#f97316" : "#ef4444"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Modal Tambah Item Produksi */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Item Produksi Dapur</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Menu / Adonan</label>
                <Input 
                  placeholder="Contoh: Martabak Daging Sapi Porsi Jumbo" 
                  value={addMenuName} 
                  onChange={e => setAddMenuName(e.target.value)} 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Produksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={1}
                    value={addTargetQty} 
                    onChange={e => setAddTargetQty(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aktual Diproduksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={0}
                    value={addProducedQty} 
                    onChange={e => setAddProducedQty(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" size="sm">Simpan Rencana</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Item Produksi */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Edit Rencana Produksi</h3>
                <p className="text-xs text-slate-500">{editingItem.menu}</p>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                ✕
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Produksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={1}
                    value={editTargetQty} 
                    onChange={e => setEditTargetQty(Number(e.target.value))} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Aktual Diproduksi (pcs)</label>
                  <Input 
                    type="number" 
                    min={0}
                    value={editProducedQty} 
                    onChange={e => setEditProducedQty(Number(e.target.value))} 
                    required 
                  />
                </div>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>Batal</Button>
                <Button type="submit" variant="primary" size="sm">Update Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
