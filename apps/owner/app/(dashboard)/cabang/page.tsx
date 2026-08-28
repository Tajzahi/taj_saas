/**
 * =========================================================================================
 * 🏗️ BLUEPRINT KONSTRUKSI FITUR: HALAMAN MANAJEMEN CABANG / BRANCHES (PAGE CLIENT UI)
 * =========================================================================================
 * 
 * 📌 FUNGSI UTAMA FILE:
 * Antarmuka Client UI untuk mengelola Multi-Outlets / Cabang Fisik Toko (`/cabang`).
 * Mendaftarkan cabang baru, mengedit alamat/telepon/koordinat, memantau omzet real per cabang,
 * mengubah status (*Active / Maintenance*), serta membandingkan omzet via grafik Recharts BarChart.
 * 
 * 🔄 ALUR KERJA (WORKFLOW KONSTRUKSI):
 * 1. FETCH DATA (Baris 75-105)    : Polling data cabang & omzet real via `getBranchesAction`.
 * 2. SEARCH & VIEWS (Baris 180-210): Pencarian cabang real-time & toggle mode Kartu (Grid) / Tabel (List).
 * 3. HANDLER AKSI (Baris 110-150)  : Eksekusi `handleAddBranch` & `handleToggleStatus` dengan `toast` feedback.
 * 4. GRAFIK (Baris 450-520)        : Visualisasi Recharts BarChart perbandingan Omzet vs Target Cabang.
 * 
 * 🔗 KETERIKATAN ALUR FILE LAIN:
 * - Server Actions : `apps/owner/app/actions/branches.ts`
 * - State Store    : `apps/owner/store/ownerStore.ts` (`setSelectedBranchId`)
 * =========================================================================================
 */

"use client";

import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah, formatPercent } from "@/utils/format";
import { getBranchesAction, createBranchAction, updateBranchAction, deleteBranchAction, toggleBranchStatusAction } from "@/app/actions/branches";
import { ExportDropdown } from "@/components/ui/ExportDropdown";
import { useRouter } from "next/navigation";
import { useOwnerStore } from "@/store/ownerStore";
import toast from "react-hot-toast";

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
  const [branches, setBranches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDetailBranch, setSelectedDetailBranch] = useState<any>(null);
  
  const router = useRouter();
  const { setSelectedBranchId } = useOwnerStore();

  // Form states for creating a branch
  const [newName, setNewName] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newGmapsUrl, setNewGmapsUrl] = useState("");
  const [newOperationalHours, setNewOperationalHours] = useState("08:00 - 22:00");
  const [newOrderingMethods, setNewOrderingMethods] = useState<string[]>(["dine_in", "takeaway", "delivery", "pickup"]);
  const [newPaymentMethods, setNewPaymentMethods] = useState<string[]>(["cod", "qris"]);

  // Form states for editing a branch
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState("");
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGmapsUrl, setEditGmapsUrl] = useState("");
  const [editOperationalHours, setEditOperationalHours] = useState("08:00 - 22:00");
  const [editOrderingMethods, setEditOrderingMethods] = useState<string[]>(["dine_in", "takeaway", "delivery", "pickup"]);
  const [editPaymentMethods, setEditPaymentMethods] = useState<string[]>(["cod", "qris"]);
  const [editStatus, setEditStatus] = useState<"active" | "maintenance">("active");

  const handleOpenEdit = (cabang: any) => {
    setEditId(cabang.id);
    setEditName(cabang.name);
    setEditCity(cabang.city);
    setEditAddress(cabang.address || "");
    setEditPhone(cabang.phone === "-" ? "" : cabang.phone);
    setEditGmapsUrl(cabang.googleMapsUrl || "");
    setEditOperationalHours(cabang.operationalHours || "08:00 - 22:00");
    setEditOrderingMethods(cabang.orderingMethods || ["dine_in", "takeaway", "delivery", "pickup"]);
    setEditPaymentMethods(cabang.paymentMethods || ["cod", "qris"]);
    setEditStatus(cabang.status);
    setSelectedDetailBranch(null);
    setShowEdit(true);
  };

  const loadBranches = () => {
    setLoading(true);
    getBranchesAction().then(res => {
      if (res.success && res.data) {
        const merged = res.data.map((dbBranch: any) => ({
          id: dbBranch.id,
          name: dbBranch.name,
          city: dbBranch.city,
          address: dbBranch.address,
          phone: dbBranch.phone || "-",
          googleMapsUrl: dbBranch.googleMapsUrl || "",
          operationalHours: dbBranch.operationalHours || "08:00 - 22:00",
          orderingMethods: dbBranch.orderingMethods || ["dine_in", "takeaway", "delivery", "pickup"],
          paymentMethods: dbBranch.paymentMethods || ["cod", "qris"],
          manager: dbBranch.picName || "Belum Ditugaskan",
          status: dbBranch.status,
          revenue: dbBranch.revenue || 0,
          target: dbBranch.target || 0,
          orders: dbBranch.orders || 0,
          growth: dbBranch.growth || 0,
          foodCost: dbBranch.foodCost || 0,
          laborCost: dbBranch.laborCost || 0,
          rating: dbBranch.rating || 5.0,
        }));
        setBranches(merged);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    loadBranches();
  }, []);

  const handleAddBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCity) {
      toast.error("Nama dan Kota wajib diisi.");
      return;
    }
    const res = await createBranchAction({
      name: newName,
      city: newCity,
      address: newAddress,
      phone: newPhone,
      googleMapsUrl: newGmapsUrl,
      operationalHours: newOperationalHours,
      orderingMethods: newOrderingMethods,
      paymentMethods: newPaymentMethods,
    });

    if (res.success) {
      setShowAdd(false);
      setNewName("");
      setNewCity("");
      setNewAddress("");
      setNewPhone("");
      setNewGmapsUrl("");
      setNewOperationalHours("08:00 - 22:00");
      setNewOrderingMethods(["dine_in", "takeaway", "delivery", "pickup"]);
      setNewPaymentMethods(["cod", "qris"]);
      toast.success("Cabang baru berhasil ditambahkan!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("branch-updated"));
      }
      loadBranches();
    } else {
      toast.error("Gagal menambahkan cabang: " + res.error);
    }
  };

  const handleEditBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editCity) {
      toast.error("Nama dan Kota wajib diisi.");
      return;
    }
    const res = await updateBranchAction(editId, {
      name: editName,
      city: editCity,
      address: editAddress,
      phone: editPhone,
      googleMapsUrl: editGmapsUrl,
      operationalHours: editOperationalHours,
      orderingMethods: editOrderingMethods,
      paymentMethods: editPaymentMethods,
      status: editStatus,
    });

    if (res.success) {
      setShowEdit(false);
      toast.success("Data cabang berhasil diperbarui!");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("branch-updated"));
      }
      loadBranches();
    } else {
      toast.error("Gagal memperbarui cabang: " + res.error);
    }
  };

  const handleDeleteBranch = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus cabang "${name}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    const res = await deleteBranchAction(id);
    if (res.success) {
      setShowEdit(false);
      setSelectedDetailBranch(null);
      toast.success(`Cabang "${name}" berhasil dihapus.`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("branch-updated"));
      }
      loadBranches();
    } else {
      toast.error("Gagal menghapus cabang: " + res.error);
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: "active" | "maintenance") => {
    const targetStatus = currentStatus === "active" ? "maintenance" : "active";
    const res = await toggleBranchStatusAction(id, targetStatus);
    if (res.success) {
      toast.success(`Status cabang berhasil diperbarui menjadi ${targetStatus === "active" ? "Aktif" : "Maintenance"}.`);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("branch-updated"));
      }
      loadBranches();
    } else {
      toast.error("Gagal mengubah status cabang: " + res.error);
    }
  };

  const filtered = branches.filter(c =>
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
            {branches.filter(c => c.status === "active").length} aktif · {branches.filter(c => c.status === "maintenance").length} maintenance dari {branches.length} cabang
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportDropdown 
            data={branches}
            columns={["Nama Cabang", "Kota", "Status", "No. Telepon"]}
            filename="data_cabang"
            title="Daftar Cabang"
            pdfDataMapper={(item) => [item.name, item.city, item.status, item.phone]}
            label="Unduh"
          />
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
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "cards" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm animate-fade-in" : "text-slate-500"}`}
          >
            Kartu
          </button>
          <button
            onClick={() => setView("table")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${view === "table" ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm animate-fade-in" : "text-slate-500"}`}
          >
            Tabel
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="relative w-8 h-8">
            <div className="absolute inset-0 rounded-full border-2 border-orange-200 dark:border-orange-950" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
          </div>
        </div>
      )}

      {/* Branch Cards */}
      {!loading && view === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((cabang) => (
            <div key={cabang.id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 hover:shadow-md transition-all group">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-lg shadow-sm">
                    🏪
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.name}</p>
                    <p className="text-xs text-slate-500">{cabang.city}</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{cabang.operationalHours}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleStatus(cabang.id, cabang.status)}
                  title={`Klik untuk mengubah status cabang ke ${cabang.status === "active" ? "Maintenance (Tutup)" : "Aktif (Buka)"}`}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border hover:scale-105 active:scale-95 ${
                    cabang.status === "active"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                      : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full animate-pulse ${cabang.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                  <span>{cabang.status === "active" ? "Aktif" : "Maintenance"}</span>
                  <span className="text-[10px] opacity-70 ml-0.5">⇄</span>
                </button>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">omzet</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatRupiah(cabang.revenue, true)}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">pesanan</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{cabang.orders.toLocaleString("id-ID")}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Modal Bahan Baku</p>
                  <p className={`text-sm font-bold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>
                    {formatPercent(cabang.foodCost)}
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Rating</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">⭐ {cabang.rating}</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Modal Bahan Baku</span>
                    <span className={`text-xs font-semibold ${cabang.foodCost > 30 ? "text-red-600" : "text-emerald-600"}`}>{formatPercent(cabang.foodCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.foodCost > 30 ? "bg-red-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.foodCost / 40) * 100}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-500">Gaji Pegawai</span>
                    <span className={`text-xs font-semibold ${cabang.laborCost > 20 ? "text-amber-600" : "text-emerald-600"}`}>{formatPercent(cabang.laborCost)}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${cabang.laborCost > 20 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${(cabang.laborCost / 30) * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs text-slate-400">{cabang.kasir} kasir aktif · {cabang.phone}</span>
                <button
                  onClick={() => setSelectedDetailBranch(cabang)}
                  className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline"
                >
                  Detail →
                </button>
              </div>
            </div>
          ))}

          {/* Add Branch Card */}
          <button
            onClick={() => setShowAdd(true)}
            className="bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 p-5 flex flex-col items-center justify-center gap-3 hover:border-orange-300 dark:hover:border-orange-700 hover:bg-orange-50/50 dark:hover:bg-orange-950/10 transition-all group min-h-[200px] cursor-pointer"
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
      {!loading && view === "table" && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-800/50">
                <tr>
                  {["Nama Cabang", "Kota", "Status", "omzet", "pesanan", "AOV", "Modal Bahan Baku", "Gaji Pegawai", "Rating", "No. Telepon", ""].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 dark:text-slate-400 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((cabang) => (
                  <tr key={cabang.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🏪</span>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">{cabang.name}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{cabang.city}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleToggleStatus(cabang.id, cabang.status)}
                        title={`Klik untuk mengubah status cabang ke ${cabang.status === "active" ? "Maintenance (Tutup)" : "Aktif (Buka)"}`}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border hover:scale-105 active:scale-95 ${
                          cabang.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/50"
                            : "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-900/50"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${cabang.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                        <span>{cabang.status === "active" ? "Aktif" : "Maintenance"}</span>
                        <span className="text-[9px] opacity-70 ml-0.5">⇄</span>
                      </button>
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
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">⭐ {cabang.rating}</td>
                    <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">{cabang.phone}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleToggleStatus(cabang.id, cabang.status)} title="Ubah Status">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
            <p className="text-xs text-slate-500 mt-0.5">Omzet vs Target bulan ini</p>
          </div>
          <Badge variant="info" size="sm">Bulan ini</Badge>
        </div>
        {branches.length > 0 ? (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={branches} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} tickLine={false} axisLine={false} tickFormatter={(v) => formatRupiah(v, true)} width={56} />
              <Tooltip content={<CompareTooltip />} />
              <Legend wrapperStyle={{ fontSize: "11px" }} iconType="circle" iconSize={8} />
              <Bar dataKey="revenue" name="Omzet" radius={[4, 4, 0, 0]} maxBarSize={36}>
                {branches.map((_, index) => (
                  <Cell key={index} fill={METRIC_COLORS[index % METRIC_COLORS.length]} />
                ))}
              </Bar>
              <Bar dataKey="target" name="Target" radius={[4, 4, 0, 0]} maxBarSize={36} fill="#e2e8f0" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[240px] flex items-center justify-center text-xs text-slate-400 font-medium">
            Belum ada data cabang terdaftar di database
          </div>
        )}
      </div>

      {/* Add Branch Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowAdd(false)}>
          <form
            onSubmit={handleAddBranch}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Tambah Cabang Baru</h3>
              <button type="button" onClick={() => setShowAdd(false)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Nama Cabang"
                  placeholder="misal: Cabang Utama / Cabang Kemang"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                />
                <Input
                  label="Kota"
                  placeholder="misal: Surabaya / Jakarta"
                  value={newCity}
                  onChange={e => setNewCity(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Alamat Lengkap"
                placeholder="misal: Jl. Raya No. 123..."
                value={newAddress}
                onChange={e => setNewAddress(e.target.value)}
              />
              <Input
                label="No. Telepon / WhatsApp"
                placeholder="misal: 081234567890"
                value={newPhone}
                onChange={e => setNewPhone(e.target.value)}
              />
              
              {/* Link Google Maps Input (Sinkron Otomatis ke Customer App) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  📍 Link Google Maps (Sinkron Otomatis ke App Customer)
                </label>
                <Input
                  placeholder="https://maps.google.com/?q=-7.2432,112.7176"
                  value={newGmapsUrl}
                  onChange={e => setNewGmapsUrl(e.target.value)}
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Link ini akan otomatis ditampilkan di halaman checkout & tracking pada aplikasi pelanggan.
                </p>
              </div>

              {/* Jam Operasional Cabang */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Jam Operasional Cabang (Buka - Tutup)
                </label>
                <Input
                  placeholder="08:00 - 22:00"
                  value={newOperationalHours}
                  onChange={e => setNewOperationalHours(e.target.value)}
                />
              </div>

              {/* Metode Pemesanan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  🛒 Metode Pemesanan yang Diterapkan
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: "dine_in", label: "Dine-in (Makan di tempat)" },
                    { id: "takeaway", label: "Takeaway (Bungkus)" },
                    { id: "delivery", label: "Delivery (Pesan Antar)" },
                    { id: "pickup", label: "Pickup (Kasir Direct)" },
                  ].map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newOrderingMethods.includes(m.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewOrderingMethods(prev => [...prev, m.id]);
                          } else {
                            setNewOrderingMethods(prev => prev.filter(x => x !== m.id));
                          }
                        }}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  💳 Metode Pembayaran yang Diterapkan
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: "cod", label: "Tunai (Cash / COD)" },
                    { id: "qris", label: "QRIS / Transfer Bank" },
                  ].map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPaymentMethods.includes(p.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setNewPaymentMethods(prev => [...prev, p.id]);
                          } else {
                            setNewPaymentMethods(prev => prev.filter(x => x !== p.id));
                          }
                        }}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAdd(false)}>Batal</Button>
              <Button type="submit" variant="primary" className="flex-1">Simpan Cabang</Button>
            </div>
          </form>
        </div>
      )}

      {/* Detail Branch Modal */}
      {selectedDetailBranch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setSelectedDetailBranch(null)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-5 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white text-xl shadow-sm">
                  🏪
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-tight">{selectedDetailBranch.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedDetailBranch.city}</p>
                </div>
              </div>
              <button onClick={() => setSelectedDetailBranch(null)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                  <p className="text-xs text-slate-500 mb-1.5">Status Operasional</p>
                  <div className="w-fit">
                    <Badge variant={selectedDetailBranch.status === "active" ? "success" : "warning"}>
                      {selectedDetailBranch.status === "active" ? "Aktif (Buka)" : "Maintenance (Tutup)"}
                    </Badge>
                  </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                  <p className="text-xs text-slate-500 mb-1">Jam Operasional</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 font-mono">{selectedDetailBranch.operationalHours || "08:00 - 22:00"}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center">
                  <p className="text-xs text-slate-500 mb-1">Telepon</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{selectedDetailBranch.phone}</p>
                </div>
              </div>
              
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Alamat Lengkap</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{selectedDetailBranch.address || "Jl. Contoh Alamat No. 123, " + selectedDetailBranch.city}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Metrik Utama Hari Ini</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Omzet</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{formatRupiah(selectedDetailBranch.revenue, true)}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Total Pesanan</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDetailBranch.orders.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Kasir Aktif</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{selectedDetailBranch.kasir} Orang</span>
                  </div>
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 py-2">
                    <span className="text-sm text-slate-600 dark:text-slate-400">Rating</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">⭐ {selectedDetailBranch.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-stretch justify-between gap-3">
              <Button type="button" variant="outline" className="flex-1 order-2 sm:order-1" onClick={() => handleOpenEdit(selectedDetailBranch)}>✏️ Edit Cabang Ini</Button>
              <Button 
                type="button" 
                variant="primary" 
                className="flex-1 order-1 sm:order-2" 
                onClick={() => {
                  setSelectedBranchId(selectedDetailBranch.id);
                  router.push("/");
                }}
              >
                Analisis Dashboard Khusus
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Branch Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setShowEdit(false)}>
          <div
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-lg p-5 sm:p-6 animate-slide-up max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">✏️ Edit Informasi Cabang</h3>
              <button onClick={() => setShowEdit(false)} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">✕</button>
            </div>
            <form onSubmit={handleEditBranch} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nama Cabang</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kota</label>
                  <input
                    type="text"
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">No. Telepon</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Link Google Maps URL</label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={editGmapsUrl}
                  onChange={(e) => setEditGmapsUrl(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jam Operasional Cabang (Buka - Tutup)</label>
                <input
                  type="text"
                  placeholder="08:00 - 22:00"
                  value={editOperationalHours}
                  onChange={(e) => setEditOperationalHours(e.target.value)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                />
              </div>

              {/* Metode Pemesanan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  🍽️ Metode Pemesanan yang Diterapkan
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: "dine_in", label: "Makan di Tempat (Dine-in)" },
                    { id: "takeaway", label: "Bungkus (Takeaway)" },
                    { id: "delivery", label: "Pengiriman (Delivery)" },
                    { id: "pickup", label: "Ambil Mandiri (Pickup)" },
                  ].map(m => (
                    <label key={m.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editOrderingMethods.includes(m.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setEditOrderingMethods(prev => [...prev, m.id]);
                          } else {
                            setEditOrderingMethods(prev => prev.filter(x => x !== m.id));
                          }
                        }}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  💳 Metode Pembayaran yang Diterapkan
                </label>
                <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                  {[
                    { id: "cod", label: "Tunai (Cash / COD)" },
                    { id: "qris", label: "QRIS / Transfer Bank" },
                  ].map(p => (
                    <label key={p.id} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editPaymentMethods.includes(p.id)}
                        onChange={e => {
                          if (e.target.checked) {
                            setEditPaymentMethods(prev => [...prev, p.id]);
                          } else {
                            setEditPaymentMethods(prev => prev.filter(x => x !== p.id));
                          }
                        }}
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500"
                      />
                      <span>{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Status Operasional</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as any)}
                  className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-2.5"
                >
                  <option value="active">● Aktif (Buka Operasional)</option>
                  <option value="maintenance">⚠ Maintenance (Tutup Sementara)</option>
                </select>
              </div>
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 mt-4">
                <Button
                  type="button"
                  variant="danger"
                  onClick={() => handleDeleteBranch(editId, editName)}
                >
                  Hapus Cabang
                </Button>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>Batal</Button>
                  <Button type="submit" variant="primary">Simpan Perubahan</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
