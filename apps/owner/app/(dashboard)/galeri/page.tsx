"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getTenantSettingsAction, updateTenantBrandingAction } from "@/app/actions/settings";

interface GalleryPhoto {
  id: string;
  src: string;
  category: string;
  caption?: string;
}

export default function GaleriPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newSrc, setNewSrc] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newCaption, setNewCaption] = useState("");
  const [previewLightbox, setPreviewLightbox] = useState<GalleryPhoto | null>(null);

  // Load existing gallery from tenant branding
  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        const branding: any = res.data.branding || {};
        if (branding.gallery && Array.isArray(branding.gallery)) {
          setPhotos(branding.gallery);
        } else {
          // Default initial demo photos if empty
          setPhotos([
            { id: "1", src: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop", category: "Produk", caption: "Martabak Coklat Keju Premium" },
            { id: "2", src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop", category: "Suasana Toko", caption: "Gerai Pusat Surabaya" },
            { id: "3", src: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop", category: "Dapur & Tim", caption: "Proses Pembuatan Martabak Higienis" },
          ]);
        }
      }
      setLoading(false);
    });
  }, []);

  const categories = ["all", ...Array.from(new Set(photos.map(p => p.category.trim()).filter(Boolean)))];

  const handleAddPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSrc.trim()) {
      alert("Harap masukkan URL foto atau unggah gambar.");
      return;
    }
    const cat = newCategory.trim() || "Umum";
    const newPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      src: newSrc,
      category: cat,
      caption: newCaption.trim() || undefined,
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    setShowAddModal(false);
    setNewSrc("");
    setNewCategory("");
    setNewCaption("");

    // Auto save to database
    setSaving(true);
    await updateTenantBrandingAction({ gallery: updated });
    setSaving(false);
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri web customer?")) return;
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    setSaving(true);
    await updateTenantBrandingAction({ gallery: updated });
    setSaving(false);
  };

  const filteredPhotos = activeCategory === "all" ? photos : photos.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📸</span>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Galeri Foto Web Customer
            </h1>
            <Badge variant="success" size="sm">Tersinkronisasi ke Web</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Kelola foto promosi, suasana gerai, dapur, dan produk yang otomatis tampil di halaman <strong>/gallery</strong> pelanggan.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>+</span> Unggah Foto Baru
          </Button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory.toLowerCase() === cat.toLowerCase()
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {cat === "all" ? "🌟 Semua Foto" : `📁 ${cat}`}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400 text-xs">Memuat galeri foto...</div>
      ) : filteredPhotos.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center">
          <span className="text-4xl block mb-2">🖼️</span>
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-200">Belum Ada Foto di Kategori Ini</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">Klik tombol di bawah untuk menambahkan foto pertama Anda.</p>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            + Tambah Foto
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.map(photo => (
            <div
              key={photo.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div 
                className="relative aspect-square bg-slate-100 dark:bg-slate-800 overflow-hidden cursor-pointer"
                onClick={() => setPreviewLightbox(photo)}
              >
                <img
                  src={photo.src}
                  alt={photo.caption || "Galeri"}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {photo.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold">
                  🔍 Klik untuk Memperbesar
                </div>
              </div>
              <div className="p-3 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate flex-1" title={photo.caption}>
                  {photo.caption || "Tanpa Judul"}
                </p>
                <button
                  onClick={() => handleDeletePhoto(photo.id)}
                  className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-xs font-bold shrink-0"
                  title="Hapus Foto"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Photo Modal */}
      {showAddModal && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowAddModal(false)}
        >
          <form
            onSubmit={handleAddPhoto}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xl w-full max-w-md p-6 animate-slide-up"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Unggah Foto Galeri Baru</h3>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {/* Image Preview Box */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Foto yang Akan Ditampilkan
                </label>
                <div className="w-full h-44 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center justify-center overflow-hidden relative">
                  {newSrc ? (
                    <img src={newSrc} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-4">
                      <span className="text-3xl block mb-1">📷</span>
                      <p className="text-xs text-slate-500">Pilih file gambar atau masukkan URL di bawah</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Format didukung: <strong>PNG</strong>, <strong>WebP</strong>, <strong>JPG</strong> (Maks. 5 MB)</p>
                    </div>
                  )}
                </div>

                <div className="mt-2 flex items-center gap-2">
                  <label className="flex-1 cursor-pointer text-center text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 py-2 rounded-xl hover:bg-orange-100 transition-colors">
                    📁 Pilih Gambar (PNG, JPG, WebP)
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 5 * 1024 * 1024) {
                            alert("Ukuran file maksimal 5 MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (typeof reader.result === 'string') setNewSrc(reader.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* URL Input */}
              <Input
                label="Atau Masukkan URL Gambar Langsung"
                placeholder="https://... (link gambar online)"
                value={newSrc.startsWith("data:") ? "[File Gambar Lokal Terpilih]" : newSrc}
                onChange={e => setNewSrc(e.target.value)}
              />

              {/* Category Input / Datalist */}
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                  Kategori Foto (Bebas Ditentukan)
                </label>
                <input
                  type="text"
                  list="gallery-cat-options"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  placeholder="misal: Martabak Viral, Suasana Toko, Artis..."
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                  required
                />
                <datalist id="gallery-cat-options">
                  {categories.filter(c => c !== "all").map((cat, idx) => (
                    <option key={idx} value={cat}>{cat}</option>
                  ))}
                </datalist>
                <p className="text-[10px] text-slate-400 mt-1">
                  💡 Anda bebas mengetik nama kategori baru apa saja. Tab filter di web customer akan otomatis menyesuaikan!
                </p>
              </div>

              {/* Caption */}
              <Input
                label="Judul / Caption Foto"
                placeholder="misal: Momen hangat bersama keluarga di gerai Demak"
                value={newCaption}
                onChange={e => setNewCaption(e.target.value)}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowAddModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan Foto"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Lightbox Preview Modal */}
      {previewLightbox && (
        <div 
          className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewLightbox(null)}
        >
          <div 
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden max-w-2xl w-full border border-slate-700 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative aspect-video sm:aspect-[4/3] bg-black">
              <img 
                src={previewLightbox.src} 
                alt={previewLightbox.caption || "Galeri"} 
                className="w-full h-full object-contain"
              />
              <button 
                onClick={() => setPreviewLightbox(null)}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/80 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider block">
                  {previewLightbox.category}
                </span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {previewLightbox.caption || "Tanpa Judul"}
                </h4>
              </div>
              <Button variant="outline" size="sm" onClick={() => setPreviewLightbox(null)}>
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
