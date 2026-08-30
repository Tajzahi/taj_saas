"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon, ShoppingBag, Store, Search, Users, Sparkles } from 'lucide-react';

interface GalleryItem {
  id: string | number;
  src: string;
  category: string;
  caption?: string;
}

export default function GalleryClient() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('semua');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [brandName, setBrandName] = useState<string>('');

  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(settings => {
      if (settings) {
        setSettings(settings);
        if (settings.store_name) setBrandName(settings.store_name);
        if (settings.gallery && Array.isArray(settings.gallery)) {
          setItems(settings.gallery);
        }
      }
    }).catch(err => {
      console.error("Error loading store gallery:", err);
    });
  }, []);

  // Compute unique categories dynamically
  const uniqueCategories = Array.from(new Set(items.map(i => i.category.trim()).filter(Boolean)));
  const filters = [
    { id: 'semua', label: 'Semua' },
    ...uniqueCategories.map(cat => ({ id: cat.toLowerCase(), label: cat }))
  ];

  const filtered = activeFilter === 'semua' 
    ? items 
    : items.filter(i => i.category.toLowerCase() === activeFilter.toLowerCase());

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
      <div className="py-14 px-4 text-white" style={{ background: 'linear-gradient(to bottom right, var(--primary-color, #8E0E0E), var(--secondary-color, #E05009))' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <ImageIcon className="w-8 h-8" /> Gallery
          </h1>
          <p className="text-white/90">
            {settings?.gallery_subtitle || `Lihat lebih dekat keistimewaan & kelezatan ${brandName}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filter Buttons */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f.id
                  ? 'bg-[#8E0E0E] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span>{f.id === 'semua' ? '🌟' : '📁'}</span>
              <span>{f.label}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm max-w-lg mx-auto my-8">
            <span className="text-5xl block mb-3">📸</span>
            <h3 className="text-lg font-bold text-gray-800">Galeri Foto Sedang Dipersiapkan</h3>
            <p className="text-xs text-gray-500 mt-1">Pengelola toko sedang mempersiapkan dokumentasi foto menu dan suasana gerai terbaik untuk Anda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((item: any, idx: number) => (
              <button
                key={item.id}
                onClick={() => setLightboxIdx(idx)}
                className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer border border-gray-100 shadow-sm"
              >
                <img
                  src={item.src}
                  alt={item.caption || "Galeri"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute top-2 left-2">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-end">
                  <p className="text-white text-xs font-medium p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {item.caption || brandName}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

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

      {/* Lightbox Modal */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <div
          className="fixed inset-0 z-[80] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightboxIdx(null)}
        >
          <button
            onClick={() => setLightboxIdx(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 rounded-full bg-black/40"
          >
            <X className="w-6 h-6" />
          </button>
          
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 rounded-full bg-black/40"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 rounded-full bg-black/40"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="max-w-3xl max-h-[80vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightboxIdx].src}
              alt={filtered[lightboxIdx].caption || "Preview"}
              className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center mt-3">
              <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider block">
                {filtered[lightboxIdx].category}
              </span>
              <p className="text-white text-sm font-semibold">
                {filtered[lightboxIdx].caption || brandName}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
