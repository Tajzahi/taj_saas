/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN PERSEDIAAN & STOK (INVENTORY CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Mengelola Master Bahan Baku Persediaan, Monitoring Minimum Stock & Kedaluwarsa,
 * Pencatatan Waste/Kerugian, serta Integrasi HPP Otomatis dengan Halaman Menu & Resep.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. TAMBAH/EDIT BAHAN BAKU: Modal UI untuk memasukkan nama, stok, minStock, expiryDate, & harga.
 * 2. MONITORING STOK KRITIS & KEDALUWARSA: Auto-badge (Kritis, Rendah, Normal, Expired Soon ⚠️).
 * 3. LOG WASTE: Pencatatan bahan terbuang/basi & akumulasi total kerugian real-time.
 * 4. ISOLASI TENANT & CABANG: Penyaringan data presisi berdasarkan `selectedBranchId`.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/inventory.ts`
 * - Database Schema: `packages/db/schema.ts` (`inventory`, `inventoryTransactions`)
 * =========================================================================================
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah } from "@/utils/format";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { 
  getInventoryAction, 
  createWasteLogAction, 
  getWasteLogsAction,
  createInventoryItemAction,
  updateInventoryItemAction,
  deleteInventoryItemAction,
  createPurchaseOrderAction
} from "@/app/actions/inventory";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { useOwnerStore } from "@/store/ownerStore";

function parseCostNumber(val: any): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const str = String(val).trim();
  const cleaned = str.replace(/\./g, "").replace(/,/g, ".");
  return Number(cleaned) || 0;
}

function UnitInputCustom({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const presets = [
    { value: "gr", label: "Gram" },
    { value: "kg", label: "Kilogram" },
    { value: "ml", label: "Mililiter" },
    { value: "l", label: "Liter" },
    { value: "pcs", label: "Pieces" },
    { value: "butir", label: "Butir" },
    { value: "sdm", label: "Sendok Makan" },
    { value: "sdt", label: "Sendok Teh" },
    { value: "slice", label: "Irisan" },
    { value: "pack", label: "Kemasan" },
    { value: "botol", label: "Botol" },
    { value: "kaleng", label: "Kaleng" },
    { value: "ikat", label: "Ikat" },
    { value: "porsi", label: "Porsi" },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filtered = presets.filter(
    p => p.value.toLowerCase().includes((value || "").toLowerCase()) || p.label.toLowerCase().includes((value || "").toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="gr/ml"
          className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
          required
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={() => setOpen(!open)}
          className="absolute right-2 text-[9px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        >
          ▼
        </button>
      </div>

      {open && (
        <div
          onWheel={(e) => e.stopPropagation()}
          className="absolute left-full top-0 ml-1.5 z-50 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl max-h-[128px] overflow-y-auto overscroll-contain divide-y divide-slate-100 dark:divide-slate-800 animate-fade-in"
        >
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <button
                key={item.value}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(item.value);
                  setOpen(false);
                }}
                className="w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/40 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
              >
                <span className="font-bold text-slate-800 dark:text-slate-100">{item.value}</span>
                <span className="text-[10px] text-slate-400 font-normal">{item.label}</span>
              </button>
            ))
          ) : (
            <div className="px-2.5 py-1.5 text-[11px] text-slate-400">
              Gunakan kustom: <span className="font-semibold text-slate-700 dark:text-slate-200">"{value}"</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StockBadge({ stock, min, expiryDate }: { stock: number; min: number; expiryDate?: string | Date | null }) {
  const ratio = min > 0 ? stock / min : 1;
  const now = new Date();
  
  if (expiryDate) {
    const exp = new Date(expiryDate);
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return <Badge variant="danger">Kedaluwarsa 🚨</Badge>;
    if (diffDays <= 7) return <Badge variant="danger">Exp Soon ⚠️</Badge>;
  }

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

  // Add / Edit Inventory form states
  const [showAddInventory, setShowAddInventory] = useState(false);
  const [showEditInventory, setShowEditInventory] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [invName, setInvName] = useState("");
  const [invCategory, setInvCategory] = useState("Bahan Baku");
  const [invStock, setInvStock] = useState(0);
  const [invMinStock, setInvMinStock] = useState(10);
  const [invUnit, setInvUnit] = useState("kg");
  const [invCost, setInvCost] = useState(0);
  const [invSupplier, setInvSupplier] = useState("");
  const [invExpiryDate, setInvExpiryDate] = useState("");
  const [submittingInv, setSubmittingInv] = useState(false);

  // Add Waste form states
  const [showAddWaste, setShowAddWaste] = useState(false);
  const [wasteItemId, setWasteItemId] = useState("");
  const [wasteQty, setWasteQty] = useState(0);
  const [wasteReason, setWasteReason] = useState("");
  const [wasteOperator, setWasteOperator] = useState("");

  const fetchData = async () => {
    setLoading(true);
    const activeBranchId = selectedBranchId || undefined;
    const [invRes, wasteRes] = await Promise.all([
      getInventoryAction(activeBranchId),
      getWasteLogsAction(activeBranchId),
    ]);

    if (invRes.success && invRes.data) {
      const invs = invRes.data.map((dbInv: any) => ({
        id: dbInv.id,
        branchId: dbInv.branchId,
        name: dbInv.name,
        category: dbInv.category || "Bahan Baku",
        stock: Number(dbInv.stock) || 0,
        minStock: Number(dbInv.minStock) || 10,
        unit: dbInv.unit || "pcs",
        cost: Number(dbInv.cost) || 0,
        supplier: dbInv.supplier || "-",
        expiryDate: dbInv.expiryDate ? new Date(dbInv.expiryDate).toISOString().split("T")[0] : "",
        cabang: dbInv.branchName || "Cabang Utama",
      }));
      setInventory(invs);
    }
    if (wasteRes.success && wasteRes.data) {
      setWasteLogs(wasteRes.data);
    } else {
      setWasteLogs([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedBranchId]);

  const handleOpenAddInventory = () => {
    setInvName("");
    setInvCategory("Bahan Baku");
    setInvStock(0);
    setInvMinStock(10);
    setInvUnit("kg");
    setInvCost(0);
    setInvSupplier("");
    setInvExpiryDate("");
    setShowAddInventory(true);
  };

  const handleOpenEditInventory = (item: any) => {
    setEditingItem(item);
    setInvName(item.name);
    setInvCategory(item.category || "Bahan Baku");
    setInvStock(item.stock);
    setInvMinStock(item.minStock);
    setInvUnit(item.unit);
    setInvCost(item.cost);
    setInvSupplier(item.supplier === "-" ? "" : item.supplier);
    setInvExpiryDate(item.expiryDate || "");
    setShowEditInventory(true);
  };

  const handleAddInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invName.trim()) return;
    setSubmittingInv(true);

    const activeBranchId = (selectedBranchId && selectedBranchId !== "all") ? selectedBranchId : undefined;
    const res = await createInventoryItemAction({
      name: invName,
      category: invCategory,
      stock: Number(invStock) || 0,
      minStock: Number(invMinStock) || 0,
      unit: invUnit,
      cost: parseCostNumber(invCost),
      supplier: invSupplier,
      expiryDate: invExpiryDate || null,
      branchId: activeBranchId,
    });
    setSubmittingInv(false);

    if (res.success) {
      setShowAddInventory(false);
      fetchData();
    } else {
      alert("Gagal menambah bahan baku: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleEditInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !invName.trim()) return;
    setSubmittingInv(true);

    const activeBranchId = editingItem.branchId || ((selectedBranchId && selectedBranchId !== "all") ? selectedBranchId : undefined);
    const res = await updateInventoryItemAction(editingItem.id, {
      name: invName,
      category: invCategory,
      stock: Number(invStock) || 0,
      minStock: Number(invMinStock) || 0,
      unit: invUnit,
      cost: parseCostNumber(invCost),
      supplier: invSupplier,
      expiryDate: invExpiryDate || null,
      branchId: activeBranchId,
    });
    setSubmittingInv(false);

    if (res.success) {
      setShowEditInventory(false);
      fetchData();
    } else {
      alert("Gagal mengupdate bahan baku: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleDeleteInventory = async (item: any) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus bahan baku "${item.name}"?`)) return;
    const res = await deleteInventoryItemAction(item.id);
    if (res.success) {
      fetchData();
    } else {
      alert("Gagal menghapus bahan baku: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleCreatePO = async (item: any) => {
    const qtyStr = prompt(`Masukkan jumlah PO untuk ${item.name} (${item.unit}):`, String(item.minStock * 2 || 20));
    if (!qtyStr) return;
    const qty = Number(qtyStr);
    if (isNaN(qty) || qty <= 0) return;

    const activeBranchId = item.branchId || ((selectedBranchId && selectedBranchId !== "all") ? selectedBranchId : undefined);
    const totalAmount = qty * item.cost;
    const res = await createPurchaseOrderAction({
      inventoryId: item.id,
      branchId: activeBranchId,
      quantity: qty,
      totalAmount,
      supplierName: item.supplier !== "-" ? item.supplier : "Supplier Utama",
      notes: `Reorder otomatis dari alert persediaan (${item.stock} ${item.unit} tersisa).`,
    });

    if (res.success) {
      alert(`Pengajuan PO untuk ${item.name} berhasil dibuat! Menunggu persetujuan di menu Persetujuan.`);
    } else {
      alert("Gagal membuat pengajuan PO: " + (res.error || "Terjadi kesalahan"));
    }
  };

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
      branchId: itemObj.branchId || (selectedBranchId !== "all" ? selectedBranchId : undefined),
      quantity: wasteQty,
      cost: calculatedCost,
      reason: wasteReason,
      operatorName: wasteOperator,
    });
    setLoading(false);
    if (res.success) {
      fetchData();
      setShowAddWaste(false);
      setWasteItemId("");
      setWasteQty(0);
      setWasteReason("");
      setWasteOperator("");
    } else {
      alert("Gagal menyimpan waste log: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const filteredInventory = inventory.filter(item => {
    if (!selectedBranchId || selectedBranchId === "all") return true;
    return item.branchId === selectedBranchId;
  });

  const filteredWasteLog = wasteLogs.filter(w => {
    if (!selectedBranchId || selectedBranchId === "all") return true;
    return w.branchId === selectedBranchId;
  });

  const filtered = filteredInventory.filter(item => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const ratio = item.minStock > 0 ? item.stock / item.minStock : 1;
    let isExpiredOrSoon = false;
    if (item.expiryDate) {
      const exp = new Date(item.expiryDate);
      const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays <= 7) isExpiredOrSoon = true;
    }

    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "critical" ? ratio < 0.5 :
      filterStatus === "low" ? ratio < 1 :
      filterStatus === "expired" ? isExpiredOrSoon :
      ratio >= 1;
    return matchSearch && matchStatus;
  });

  const criticalCount = filteredInventory.filter(i => i.minStock > 0 && i.stock / i.minStock < 0.5).length;
  const lowCount = filteredInventory.filter(i => i.minStock > 0 && i.stock / i.minStock >= 0.5 && i.stock / i.minStock < 1).length;
  const totalValuation = filteredInventory.reduce((sum, i) => sum + (i.stock * i.cost), 0);
  const expiredSoonCount = filteredInventory.filter(i => {
    if (!i.expiryDate) return false;
    const exp = new Date(i.expiryDate);
    const diffDays = Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays >= 0;
  }).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Persediaan & Stok (Inventory)</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            <span className="text-red-600 font-semibold">{criticalCount} kritis</span> · <span className="text-amber-600 font-semibold">{lowCount} rendah</span> · <span className="text-purple-600 font-semibold">{expiredSoonCount} exp soon</span> · {filteredInventory.length} total bahan
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown 
            data={filtered}
            columns={["Bahan Baku", "Kategori", "Stok", "Min Stok", "Satuan", "Harga/Unit"]}
            filename="data_persediaan"
            title="Data Persediaan & Stok"
            pdfDataMapper={(item) => [item.name, item.category, item.stock, item.minStock, item.unit, formatRupiah(item.cost)]}
          />
          <Button variant="primary" size="sm" onClick={handleOpenAddInventory}>
            + Tambah Bahan
          </Button>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Total Jenis Bahan", value: `${filteredInventory.length} Item` },
          { label: "Total Valuasi Stok", value: formatRupiah(totalValuation, true) },
          { label: "Stok Kritis / Rendah", value: `${criticalCount + lowCount} Item` },
          { label: "Total Waste Hari Ini", value: formatRupiah(filteredWasteLog.reduce((s, w) => s + w.cost, 0), true) },
        ].map(card => (
          <div key={card.label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-4">
            <div>
              <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{card.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
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
            {tab === "stock" ? "📦 Stok Bahan Baku" : "🗑️ Waste Log (Bahan Terbuang)"}
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
                placeholder="Cari bahan baku..."
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
                { key: "expired", label: "Exp Soon ⚠️" },
                { key: "ok", label: "Normal" },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setFilterStatus(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filterStatus === f.key
                      ? "bg-orange-500 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700"
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
                    {["Bahan Baku", "Kategori", "Stok Saat Ini", "Min. Stok", "Status", "Harga/Unit", "Kedaluwarsa", "Supplier", "Aksi"].map(h => (
                      <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-xs text-slate-400">
                        Belum ada data bahan baku persediaan. Klik tombol <strong>+ Tambah Bahan</strong> di atas.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((item) => {
                      const ratio = item.minStock > 0 ? item.stock / item.minStock : 1;
                      const isLow = ratio < 1;
                      return (
                        <tr key={item.id} className={`hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${ratio < 0.5 ? "bg-red-50/30 dark:bg-red-950/5" : ratio < 1 ? "bg-amber-50/30 dark:bg-amber-950/5" : ""}`}>
                          <td className="px-4 py-3">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                          </td>
                          <td className="px-4 py-3"><Badge variant="neutral" size="sm">{item.category}</Badge></td>
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
                          <td className="px-4 py-3">
                            <StockBadge stock={item.stock} min={item.minStock} expiryDate={item.expiryDate} />
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-slate-800 dark:text-slate-200">{formatRupiah(item.cost)}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">
                            {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">{item.supplier}</td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <Button variant="outline" size="sm" onClick={() => handleOpenEditInventory(item)}>
                                Ubah
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleCreatePO(item)}>
                                PO
                              </Button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInventory(item)}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                                title="Hapus bahan baku"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
                  <Button variant="primary" size="sm" onClick={() => setShowAddWaste(true)}>+ Input Waste Log</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      {["Tanggal", "Bahan Baku", "Qty Terbuang", "Penyebab Waste", "Kerugian Nominal", "Cabang"].map(h => (
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
                          <td className="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 font-bold">{log.qty} {log.unit}</td>
                          <td className="px-3 py-2.5 text-xs text-slate-500">{log.reason}</td>
                          <td className="px-3 py-2.5 text-sm font-semibold text-red-600 dark:text-red-400">{formatRupiah(log.cost)}</td>
                          <td className="px-3 py-2.5"><Badge variant="neutral" size="sm">{log.cabang}</Badge></td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-3 py-8 text-center text-xs text-slate-400">
                          Belum ada pencatatan waste / bahan terbuang saat ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Ringkasan Kerugian Waste</h3>
            <div className="p-4 bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 rounded-xl space-y-1">
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Total Kerugian Waste Hari Ini</p>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatRupiah(filteredWasteLog.reduce((s, w) => s + w.cost, 0))}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Dicatat dari {filteredWasteLog.length} kejadian bahan terbuang/basi.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Inventory Modal */}
      {showAddInventory && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddInventory(false)}>
          <form
            onSubmit={handleAddInventorySubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Bahan Baku Baru</h3>
              <button type="button" onClick={() => setShowAddInventory(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Input
              label="Nama Bahan Baku"
              value={invName}
              onChange={e => setInvName(e.target.value)}
              placeholder="misal: Telur Ayam"
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Kategori Bahan</label>
              <input
                type="text"
                list="inv-cat-presets"
                value={invCategory}
                onChange={e => setInvCategory(e.target.value)}
                placeholder="misal: Bahan Basah / Dry Food / Bumbu"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                required
              />
              <datalist id="inv-cat-presets">
                <option value="Bahan Basah">Bahan Basah (Daging/Telur/Sayur)</option>
                <option value="Dry Food">Dry Food (Tepung/Gula/Beras)</option>
                <option value="Bumbu & Minyak">Bumbu & Minyak</option>
                <option value="Kemasan">Kemasan & Packaging</option>
                <option value="Minuman">Bahan Minuman</option>
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Stok Awal"
                type="number"
                step="any"
                value={invStock}
                onChange={e => setInvStock(Number(e.target.value))}
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Satuan Stok</label>
                <UnitInputCustom
                  value={invUnit}
                  onChange={setInvUnit}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Minimum Stock (Min. Stok)"
                type="number"
                step="any"
                value={invMinStock}
                onChange={e => setInvMinStock(Number(e.target.value))}
                placeholder="Batas peringatan kritis"
                required
              />
              <Input
                label="Harga Beli / Unit (Rp)"
                type="text"
                value={invCost}
                onChange={e => setInvCost(parseCostNumber(e.target.value))}
                placeholder="10.000"
                required
              />
            </div>

            <Input
              label="Tanggal Kedaluwarsa (Opsional)"
              type="date"
              value={invExpiryDate}
              onChange={e => setInvExpiryDate(e.target.value)}
            />

            <Input
              label="Supplier Utama (Opsional)"
              value={invSupplier}
              onChange={e => setInvSupplier(e.target.value)}
              placeholder="misal: PT Sumber Makmur"
            />

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddInventory(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submittingInv}>
                {submittingInv ? "Menyimpan..." : "Simpan Bahan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Inventory Modal */}
      {showEditInventory && editingItem && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEditInventory(false)}>
          <form
            onSubmit={handleEditInventorySubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up space-y-4 max-h-[90vh] overflow-y-auto overscroll-contain"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Ubah Bahan Baku</h3>
              <button type="button" onClick={() => setShowEditInventory(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <Input
              label="Nama Bahan Baku"
              value={invName}
              onChange={e => setInvName(e.target.value)}
              required
            />

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Kategori Bahan</label>
              <input
                type="text"
                list="inv-cat-presets-edit"
                value={invCategory}
                onChange={e => setInvCategory(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                required
              />
              <datalist id="inv-cat-presets-edit">
                <option value="Bahan Basah">Bahan Basah (Daging/Telur/Sayur)</option>
                <option value="Dry Food">Dry Food (Tepung/Gula/Beras)</option>
                <option value="Bumbu & Minyak">Bumbu & Minyak</option>
                <option value="Kemasan">Kemasan & Packaging</option>
                <option value="Minuman">Bahan Minuman</option>
              </datalist>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Stok Saat Ini"
                type="number"
                step="any"
                value={invStock}
                onChange={e => setInvStock(Number(e.target.value))}
                required
              />
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Satuan Stok</label>
                <UnitInputCustom
                  value={invUnit}
                  onChange={setInvUnit}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Minimum Stock (Min. Stok)"
                type="number"
                step="any"
                value={invMinStock}
                onChange={e => setInvMinStock(Number(e.target.value))}
                required
              />
              <Input
                label="Harga Beli / Unit (Rp)"
                type="text"
                value={invCost}
                onChange={e => setInvCost(parseCostNumber(e.target.value))}
                required
              />
            </div>

            <Input
              label="Tanggal Kedaluwarsa"
              type="date"
              value={invExpiryDate}
              onChange={e => setInvExpiryDate(e.target.value)}
            />

            <Input
              label="Supplier Utama"
              value={invSupplier}
              onChange={e => setInvSupplier(e.target.value)}
            />

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowEditInventory(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={submittingInv}>
                {submittingInv ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Add Waste Modal */}
      {showAddWaste && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAddWaste(false)}>
          <form
            onSubmit={handleAddWasteSubmit}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Input Waste Log (Bahan Terbuang)</h3>
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
                placeholder="misal: Kadaluarsa / Basi / Busuk / Pecah"
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
                {loading ? "Menyimpan..." : "Simpan Waste"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
