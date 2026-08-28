"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatRupiah } from "@/utils/format";
import { getTenantSettingsAction, updateTenantBrandingAction } from "@/app/actions/settings";

export default function KateringManagementPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cateringPackages, setCateringPackages] = useState<any[]>([]);

  // Form states for new package
  const [newCatName, setNewCatName] = useState("");
  const [newCatMin, setNewCatMin] = useState(15);
  const [newCatPrice, setNewCatPrice] = useState(25000);
  const [newCatDesc, setNewCatDesc] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        const branding: any = res.data.branding || {};
        if (branding.cateringPackages && Array.isArray(branding.cateringPackages)) {
          setCateringPackages(branding.cateringPackages);
        } else {
          setCateringPackages([]);
        }
      }
      setLoading(false);
    });
  }, []);

  const handleSavePackages = async (updatedPackages: any[]) => {
    setSaving(true);
    const res = await updateTenantBrandingAction({
      cateringPackages: updatedPackages,
    });
    setSaving(false);
    if (!res.success) {
      alert("Gagal menyimpan perubahan: " + (res.error || "Terjadi kesalahan"));
    }
  };

  const handleAddPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newPkg = {
      id: Date.now().toString(),
      name: newCatName.trim(),
      minPortion: Math.max(1, Number(newCatMin) || 1),
      pricePerPortion: Math.max(0, Number(newCatPrice) || 0),
      description: newCatDesc.trim() || "Paket katering hemat porsi besar.",
    };

    const updated = [...cateringPackages, newPkg];
    setCateringPackages(updated);
    setShowAddModal(false);
    setNewCatName("");
    setNewCatMin(15);
    setNewCatPrice(25000);
    setNewCatDesc("");

    await handleSavePackages(updated);
  };

  const handleDeletePackage = async (id: string, name: string) => {
    if (!confirm(`Hapus paket katering '${name}'?`)) return;
    const updated = cateringPackages.filter(p => p.id !== id);
    setCateringPackages(updated);
    await handleSavePackages(updated);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🍱</span>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Paket Katering & Pesanan Besar
            </h1>
            <Badge variant="brand" size="sm">Tersinkron ke /catering Customer</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola paket pesanan porsi besar untuk acara syukuran, kantor, arisan, dan pesta pelanggan.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>+</span> Buat Paket Katering Baru
          </Button>
        </div>
      </div>

      {/* Package Cards Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Memuat paket katering...</div>
      ) : cateringPackages.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <span className="text-4xl block mb-2">🍱</span>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum Ada Paket Katering</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Buat paket katering pertama Anda untuk menerima pesanan jumlah besar.</p>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            + Buat Paket Sekarang
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {cateringPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">{pkg.name}</h3>
                  <Badge variant="warning" size="sm">Min. {pkg.minPortion} Porsi</Badge>
                </div>

                <div className="my-3 space-y-1">
                  <p className="text-xl font-black text-orange-600 dark:text-orange-400">
                    {formatRupiah(pkg.pricePerPortion)} <span className="text-xs font-normal text-slate-400">/ porsi</span>
                  </p>
                  <p className="text-xs text-slate-500 font-medium">
                    Estimasi Total: <strong>{formatRupiah(pkg.pricePerPortion * pkg.minPortion)}</strong> ({pkg.minPortion} box)
                  </p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  {pkg.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  onClick={() => handleDeletePackage(pkg.id, pkg.name)}
                  className="text-red-500 hover:text-red-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  Hapus Paket
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleAddPackage}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Buat Paket Katering Baru</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Nama Paket Katering"
                placeholder="misal: Paket Ulang Tahun 20 Porsi"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Minimal Pesanan (Porsi)"
                  type="number"
                  placeholder="15"
                  value={newCatMin}
                  onChange={e => setNewCatMin(Number(e.target.value))}
                  required
                />
                <Input
                  label="Harga per Porsi (Rp)"
                  type="number"
                  placeholder="25000"
                  value={newCatPrice}
                  onChange={e => setNewCatPrice(Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Deskripsi & Isi Menu Paket
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={e => setNewCatDesc(e.target.value)}
                  placeholder="misal: 20 Porsi Paket Menu Utama Lengkap + Minuman Segar & Pelengkap..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Paket"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
