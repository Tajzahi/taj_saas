"use client";
import Link from 'next/link';
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image, ShoppingBag, Store, Search, Users } from 'lucide-react';


type GalleryFilter = 'semua' | 'produk' | 'toko' | 'behind-scene' | 'pelanggan';

const galleryItems = [
  { id: 1, src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Coklat Keju Premium' },
  { id: 2, src: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Telur Sapi Spesial' },
  { id: 3, src: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Kacang Coklat' },
  { id: 4, src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=600&fit=crop', category: 'toko', caption: 'Suasana Toko A6 Nyuss' },
  { id: 5, src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=600&fit=crop', category: 'produk', caption: 'Paket Bundling Hemat' },
  { id: 6, src: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=600&fit=crop', category: 'produk', caption: 'Terang Bulan Coklat Lumer' },
  { id: 7, src: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=600&fit=crop', category: 'behind-scene', caption: 'Proses Pembuatan Martabak' },
  { id: 8, src: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Telur Ayam' },
  { id: 9, src: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=600&fit=crop', category: 'produk', caption: 'Martabak Keju Full' },
  { id: 10, src: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&h=600&fit=crop&sat=-100', category: 'behind-scene', caption: 'Dapur Bersih A6 Nyuss' },
  { id: 11, src: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop', category: 'pelanggan', caption: 'Pelanggan Setia A6 Nyuss' },
  { id: 12, src: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=600&h=600&fit=crop', category: 'pelanggan', caption: 'Keluarga Bahagia Menikmati A6 Nyuss' },
];

const filters: { id: GalleryFilter; label: string; icon: React.ReactNode }[] = [
  { id: 'semua', label: 'Semua', icon: <Image className="w-4 h-4" /> },
  { id: 'produk', label: 'Produk', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'toko', label: 'Toko', icon: <Store className="w-4 h-4" /> },
  { id: 'behind-scene', label: 'Behind the Scene', icon: <Search className="w-4 h-4" /> },
  { id: 'pelanggan', label: 'Pelanggan', icon: <Users className="w-4 h-4" /> },
];

export default function Gallery() {
  const [activeFilter, setActiveFilter] = useState<GalleryFilter>('semua');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filtered = activeFilter === 'semua' ? galleryItems : galleryItems.filter(i => i.category === activeFilter);

  const prev = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx - 1 + filtered.length) % filtered.length);
  };
  const next = () => {
    if (lightboxIdx === null) return;
    setLightboxIdx((lightboxIdx + 1) % filtered.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <Image className="w-8 h-8" /> Gallery
          </h1>
          <p className="text-white/80">Lihat lebih dekat keistimewaan A6 Nyuss</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === f.id
                  ? 'bg-[#8E0E0E] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{f.icon}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {filtered.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setLightboxIdx(idx)}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer"
            >
              <img
                src={item.src}
                alt={item.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                <p className="text-white text-xs font-medium p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  {item.caption}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 bg-gradient-to-br from-[#8E0E0E]/10 to-[#E05009]/5 rounded-2xl p-8">
          <h3 className="text-2xl font-black text-gray-900 mb-2">Mau Coba?</h3>
          <p className="text-gray-600 mb-5">Pesan sekarang dan buat momen spesial bersama keluarga!</p>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all hover:scale-105 shadow-lg"
          >
            <ShoppingBag className="w-5 h-5" /> Pesan Sekarang
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-2xl max-h-[80vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].caption}
              className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center mt-3 font-medium">{filtered[lightboxIdx].caption}</p>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {lightboxIdx + 1} / {filtered.length}
          </p>
        </div>
      )}
    </div>
  );
}
