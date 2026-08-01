"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah } from "@/utils/format";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { getInventoryAction, getInventoryTransactionsAction, createWasteLogAction, getWasteLogsAction } from "@/app/actions/inventory";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { useOwnerStore } from "@/store/ownerStore";

const wasteLog = [
  { date: "22 Des", item: "Adonan Martabak", qty: 0, unit: "kg", reason: "Tidak habis terjual", cost: 0, cabang: "Demak" },
  { date: "22 Des", item: "Telur Ayam", qty: 0, unit: "butir", reason: "Pecah saat penyimpanan", cost: 0, cabang: "Pasar Kembang" },
];

const wasteChart = [
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

export default function Persediaan() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [activeTab, setActiveTab] = useState<"stock" | "waste">("stock");
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [wasteLogs, setWasteLogs] = useState<any[]>([]);
  const { selectedBranchId } = useOwnerStore();

  // Add Waste form states
  const [showAddWaste, setShowAddWaste] = useState(false);
  const [wasteItemId, setWasteItemId] = useState("");
  const [wasteQty, setWasteQty] = useState(0);
  const [wasteReason, setWasteReason] = useState("");
  const [wasteOperator, setWasteOperator] = useState("");

  useEffect(() => {
    Promise.all([getInventoryAction(), getWasteLogsAction()]).then(([invRes, wasteRes]) => {
      if (invRes.success && invRes.data) {
        const invs = invRes.data.map((dbInv: any) => ({
          id: dbInv.id,
          branchId: dbInv.branchId,
          name: dbInv.name,
          category: dbInv.category || "Lainnya",
          stock: Number(dbInv.stock) || 0,
          minStock: Number(dbInv.minStock) || 10,
          unit: dbInv.unit || "unit",
          cost: Number(dbInv.cost) || 0,
          supplier: dbInv.supplier || "-",
          cabang: "Demak",
        }));
        setInventory(invs);
      }
      if (wasteRes.success && wasteRes.data) {
        setWasteLogs(wasteRes.data);
      } else {
        setWasteLogs([]);
      }
      setLoading(false);
    });
  }, []);

  const handleAddWasteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wasteItemId || wasteQty <= 0) return;
    setLoading(true);

    const itemObj = inventory.find(i => i.id === wasteItemId);
    if (!itemObj) {
      setLoading(false);
      return;
    }

    const calculatedCost = itemObj.cost * wasteQty;
    const res = await createWasteLogAction({
      inventoryId: wasteItemId,
      branchId: itemObj.branchId || selectedBranchId || "all",
      quantity: wasteQty,
      cost: calculatedCost,
      reason: wasteReason,
      operatorName: wasteOperator,
    });
    setLoading(false);
    if (res.success) {
      setInventory(prev => prev.map(i => i.id === wasteItemId ? { ...i, stock: Math.max(0, i.stock - wasteQty) } : i));
      
      const formattedDate = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short" });
      const newLog = {
        date: formattedDate,
        item: itemObj.name,
        qty: wasteQty,
        unit: itemObj.unit,
        reason: wasteReason,
        cost: calculatedCost,
        cabang: itemObj.cabang,
      };
      setWasteLogs(prev => [newLog, ...prev]);
      setShowAddWaste(false);
      setWasteItemId("");
      setWasteQty(0);
      setWasteReason("");
      setWasteOperator("");
    } else {
      alert("Gagal menyimpan waste log: " + res.error);
    }
  };

  let branchName = "Semua Cabang";
  if (selectedBranchId && selectedBranchId !== "all") {
    branchName = selectedBranchId; // filter langsung berdasarkan branchId di inventory item
  }

  const filteredInventory = inventory.filter(item => {
    if (!selectedBranchId || selectedBranchId === "all") return true;
    return item.branchId === selectedBranchId;
  });

  const filteredWasteLog = wasteLogs.filter(w => {
    if (!selectedBranchId || selectedBranchId === "all") return true;
    return w.branchId === selectedBranchId || true; // wasteLogs grouped by tenant
  });

  const filtered = filteredInventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const ratio = item.stock / item.minStock;
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "critical" ? ratio < 0.5 :
      filterStatus === "low" ? ratio < 1 :
      ratio >= 1;
    return matchSearch && matchStatus;
  });

  const criticalCount = filteredInventory.filter(i => i.stock / i.minStock < 0.5).length;
  const lowCount = filteredInventory.filter(i => i.stock / i.minStock >= 0.5 && i.stock / i.minStock < 1).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persediaan (Inventory) {selectedBranchId && selectedBranchId !== "all" && `- ${branchName}`}</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{criticalCount} kritis</span> · <span className="text-amber-600 font-semibold">{lowCount} rendah</span> · {filteredInventory.length} total item
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown 
            data={filtered}
            columns={["Barang", "Gudang", "Stok", "Min Stok", "Satuan"]}
            filename="data_persediaan"
            title="Data Persediaan"
            pdfDataMapper={(item) => [item.name, item.warehouse, item.stock, item.minStock, item.unit]}
          />
          <Button variant="primary" size="sm">Buat PO</Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Item", value: filteredInventory.length.toString() },
          { label: "Item Kritis", value: criticalCount.toString() },
          { label: "Item Rendah", value: lowCount.toString() },
          { label: "Total Waste Hari Ini", value: formatRupiah(filteredWasteLog.reduce((s, w) => s + w.cost, 0), true) },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
              <p className="text-xs text-slate-500">{card.label}</p>
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
            {tab === "stock" ? "Stok Bahan" : "Waste Log"}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-950" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      {!loading && activeTab === "stock" && (
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
                { key: "critical", label: "Kritis" },
                { key: "low", label: "Rendah" },
                { key: "ok", label: "Normal" },
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

      {!loading && activeTab === "waste" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Log Waste Terbaru</h3>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">Export</Button>
                  <Button variant="primary" size="sm" onClick={() => setShowAddWaste(true)}>Input Waste</Button>
                </div>
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
                    {filteredWasteLog.length > 0 ? (
                      filteredWasteLog.map((log, i) => (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                          <td className="px-3 py-2.5 text-xs text-slate-500">{log.date}</td>
                          <td className="px-3 py-2.5 text-sm font-medium text-slate-800 dark:text-slate-200">{log.item}</td>
                          <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400">{log.qty} {log.unit}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-500">{log.reason}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatRupiah(log.cost)}</td>
                          <td className="px-3 py-2.5"><Badge variant="neutral" size="sm">{log.cabang}</Badge></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-xs text-slate-400">
                          Belum ada pencatatan waste / bahan terbuang saat ini
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Tren Waste 7 Hari</h3>
            <div className="h-[200px] flex items-center justify-center text-xs text-slate-400 font-medium">
              Belum ada data kerugian waste
            </div>
            <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/40 rounded-lg border border-slate-200 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-500">Total Waste Minggu Ini</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                Rp 0
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Add Waste Modal */}
      {showAddWaste && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddWaste(false)}>
          <form
            onSubmit={handleAddWasteSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Input Waste Log</h3>
              <button type="button" onClick={() => setShowAddWaste(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-350 block mb-1">Pilih Barang</label>
                <CustomSelect
                  value={wasteItemId}
                  onChange={setWasteItemId}
                  placeholder="-- Pilih Bahan Baku --"
                  options={filteredInventory.map(item => ({
                    value: item.id,
                    label: `${item.name} (${item.cabang}) - Sisa: ${item.stock} ${item.unit}`
                  }))}
                />
              </div>
              <Input
                label="Jumlah (Qty)"
                type="number"
                step="any"
                value={wasteQty || ""}
                onChange={e => setWasteQty(Number(e.target.value))}
                placeholder="misal: 2.5"
                required
              />
              <Input
                label="Penyebab Waste"
                value={wasteReason}
                onChange={e => setWasteReason(e.target.value)}
                placeholder="misal: Tidak habis terjual / Pecah"
                required
              />
              <Input
                label="Operator / Penanggung Jawab"
                value={wasteOperator}
                onChange={e => setWasteOperator(e.target.value)}
                placeholder="Nama Operator"
                required
              />
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddWaste(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
