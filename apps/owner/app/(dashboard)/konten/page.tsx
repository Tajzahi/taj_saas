"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getTenantSettingsAction, updateTenantBrandingAction } from "@/app/actions/settings";

type TabId = "homepage" | "about" | "faq" | "catering";

export default function KontenWebCMSPage() {
  const [activeTab, setActiveTab] = useState<TabId>("homepage");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 1. Homepage & Testimoni States
  const [heroTitle, setHeroTitle] = useState("Martabak & Terang Bulan Spesial");
  const [heroSubtitle, setHeroSubtitle] = useState("Cita rasa otentik khas Surabaya sejak tahun 2000. Dibuat dengan bahan pilihan dan resep turun-temurun.");
  const [heroBadgeText, setHeroBadgeText] = useState("Authentic Indonesian Taste Since 2000");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");
  const [testimonials, setTestimonials] = useState<any[]>([
    { id: "1", name: "Budi Santoso", rating: 5, text: "Martabaknya tebal, dagingnya melimpah, dan kuah cukonya pas banget!", location: "Surabaya Barat" },
    { id: "2", name: "Siti Rahma", rating: 5, text: "Terang bulannya super lumer dan kejunya melimpah sampai tumpah-tumpah!", location: "Surabaya Pusat" },
  ]);

  // 2. Tentang Kami States
  const [aboutTitle, setAboutTitle] = useState("Cerita di Balik A6 Nyuss");
  const [aboutStory, setAboutStory] = useState("Berdiri sejak tahun 2000 di kota Surabaya, kami berkomitmen menyajikan martabak telur dan terang bulan berkualitas premium dengan resep keluarga turun-temurun.");
  const [aboutHighlights, setAboutHighlights] = useState<string[]>([
    "100% Halal Certified",
    "Bahan Baku Fresh Setiap Hari",
    "Resep Asli Turun-Temurun 25 Tahun",
    "Pelayanan Ramah & Higienis",
  ]);
  const [newHighlight, setNewHighlight] = useState("");

  // 3. FAQ States
  const [faqs, setFaqs] = useState<any[]>([
    { id: "1", question: "Apakah produk A6 Nyuss dijamin 100% Halal?", answer: "Ya, seluruh bahan baku dan proses pengolahan kami telah tersertifikasi 100% Halal." },
    { id: "2", question: "Berapa lama estimasi waktu pembuatan pesanan?", answer: "Rata-rata waktu pembuatan adalah 10-20 menit tergantung antrean gerai." },
    { id: "3", question: "Apakah melayani pengiriman delivery ke rumah?", answer: "Ya, kami melayani delivery hingga radius 10 km dengan perhitungan ongkir otomatis." },
  ]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // 4. Catering States
  const [cateringPackages, setCateringPackages] = useState<any[]>([
    { id: "1", name: "Paket Syukuran Keluarga", minPortion: 10, pricePerPortion: 25000, description: "Kombinasi 5 Martabak Telur Spesial + 5 Terang Bulan Aneka Topping" },
    { id: "2", name: "Paket Kantor / Gathering", minPortion: 30, pricePerPortion: 22000, description: "Porsi hemat untuk acara kantor, ulang tahun, dan arisan keluarga." },
  ]);
  const [newCatName, setNewCatName] = useState("");
  const [newCatMin, setNewCatMin] = useState(10);
  const [newCatPrice, setNewCatPrice] = useState(25000);
  const [newCatDesc, setNewCatDesc] = useState("");

  // Load existing settings
  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        const branding: any = res.data.branding || {};
        if (branding.heroTitle) setHeroTitle(branding.heroTitle);
        if (branding.heroSubtitle) setHeroSubtitle(branding.heroSubtitle);
        if (branding.heroBadgeText) setHeroBadgeText(branding.heroBadgeText);
        if (branding.heroBannerUrl) setHeroBannerUrl(branding.heroBannerUrl);
        if (branding.testimonials && Array.isArray(branding.testimonials)) setTestimonials(branding.testimonials);
        if (branding.aboutTitle) setAboutTitle(branding.aboutTitle);
        if (branding.aboutStory) setAboutStory(branding.aboutStory);
        if (branding.aboutHighlights && Array.isArray(branding.aboutHighlights)) setAboutHighlights(branding.aboutHighlights);
        if (branding.faqs && Array.isArray(branding.faqs)) setFaqs(branding.faqs);
        if (branding.cateringPackages && Array.isArray(branding.cateringPackages)) setCateringPackages(branding.cateringPackages);
      }
      setLoading(false);
    });
  }, []);

  const handleSaveCMS = async () => {
    setSaving(true);
    const res = await updateTenantBrandingAction({
      heroTitle,
      heroSubtitle,
      heroBadgeText,
      heroBannerUrl,
      testimonials,
      aboutTitle,
      aboutStory,
      aboutHighlights,
      faqs,
      cateringPackages,
    });
    setSaving(false);

    if (res.success) {
      alert("Konten web berhasil disimpan! Halaman web customer otomatis diperbarui.");
    } else {
      alert("Gagal menyimpan: " + (res.error || "Terjadi kesalahan"));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌐</span>
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Manajemen Konten Web (CMS)
            </h1>
            <Badge variant="success" size="sm">100% Kontrol Mandiri</Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ubah teks banner, cerita tentang kami, tanya jawab FAQ, ulasan pelanggan, dan paket katering tanpa bantuan developer.
          </p>
        </div>
        <div>
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveCMS}
            disabled={saving}
            className="flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <span>💾</span> {saving ? "Menyimpan..." : "Simpan Semua Konten"}
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("homepage")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "homepage"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          🏠 Homepage & Testimoni
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "about"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          📖 Tentang Kami (/about)
        </button>
        <button
          onClick={() => setActiveTab("faq")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "faq"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          ❓ Tanya Jawab (/faq)
        </button>
        <button
          onClick={() => setActiveTab("catering")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "catering"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          🍱 Paket Katering (/catering)
        </button>
      </div>

      {/* TAB 1: HOMEPAGE */}
      {activeTab === "homepage" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>🎯</span> Banner Utama (Hero Section)
            </h3>
            <Input
              label="Judul Utama Banner"
              value={heroTitle}
              onChange={e => setHeroTitle(e.target.value)}
              placeholder="misal: Martabak & Terang Bulan Spesial"
            />
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                Subjudul / Deskripsi Banner
              </label>
              <textarea
                value={heroSubtitle}
                onChange={e => setHeroSubtitle(e.target.value)}
                rows={3}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <Input
              label="Badge Teks Kecil di Atas Judul"
              value={heroBadgeText}
              onChange={e => setHeroBadgeText(e.target.value)}
              placeholder="misal: Authentic Indonesian Taste Since 2000"
            />

            {/* Banner Background Image Uploader */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block">
                Foto Background Banner Utama (Hero Background)
              </label>

              {heroBannerUrl && (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img src={heroBannerUrl} alt="Banner Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setHeroBannerUrl("")}
                    className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md"
                  >
                    Hapus Banner
                  </button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={heroBannerUrl}
                  onChange={e => setHeroBannerUrl(e.target.value)}
                  placeholder="https://... / link foto banner"
                  className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                />
                <label className="cursor-pointer inline-flex items-center justify-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/40 px-3.5 py-2 rounded-xl hover:bg-orange-100 transition-colors whitespace-nowrap">
                  📁 Unggah File Banner (PNG, JPG, WebP)
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("Ukuran banner maksimal 5 MB.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () => {
                          if (typeof reader.result === 'string') setHeroBannerUrl(reader.result);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-slate-400">
                Format didukung: <strong>PNG</strong>, <strong>JPG</strong>, <strong>WebP</strong> (Rekomendasi: 1920x1080 px atau 1200x630 px, maks. 5 MB)
              </p>
            </div>
          </div>

          {/* Testimonials List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>⭐</span> Ulasan & Testimoni Pelanggan
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {testimonials.map((t, idx) => (
                <div key={t.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.name}</span>
                    <span className="text-xs text-amber-500 font-bold">{"★".repeat(t.rating)}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{t.text}"</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                    <span className="text-[10px] text-slate-400">{t.location || "Pelanggan Terverifikasi"}</span>
                    <button
                      onClick={() => setTestimonials(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 text-[11px] font-bold hover:underline"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT US */}
      {activeTab === "about" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>📖</span> Halaman Cerita Toko (/about)
          </h3>
          <Input
            label="Judul Kisah Toko"
            value={aboutTitle}
            onChange={e => setAboutTitle(e.target.value)}
            placeholder="misal: Cerita di Balik Martabak A6 Nyuss"
          />
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
              Cerita Lengkap & Sejarah Resep
            </label>
            <textarea
              value={aboutStory}
              onChange={e => setAboutStory(e.target.value)}
              rows={5}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Highlights */}
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
              Poin-Poin Keunggulan Toko
            </label>
            <div className="space-y-2 mb-3">
              {aboutHighlights.map((hl, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <span>✨ {hl}</span>
                  <button
                    onClick={() => setAboutHighlights(prev => prev.filter((_, i) => i !== idx))}
                    className="text-red-500 text-[11px] font-bold hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newHighlight}
                onChange={e => setNewHighlight(e.target.value)}
                placeholder="Tambah poin keunggulan baru..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  if (newHighlight.trim()) {
                    setAboutHighlights(prev => [...prev, newHighlight.trim()]);
                    setNewHighlight("");
                  }
                }}
              >
                + Tambah Poin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FAQ */}
      {activeTab === "faq" && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>❓</span> Daftar Pertanyaan & Jawaban FAQ (/faq)
          </h3>
          <div className="space-y-3 mb-4">
            {faqs.map((f, idx) => (
              <div key={f.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-slate-100">Q: {f.question}</span>
                  <button
                    onClick={() => setFaqs(prev => prev.filter((_, i) => i !== idx))}
                    className="text-red-500 text-[11px] font-bold hover:underline"
                  >
                    Hapus
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">A: {f.answer}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 space-y-3">
            <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">+ Tambah Tanya Jawab Baru</h4>
            <Input
              label="Pertanyaan"
              placeholder="misal: Apakah bisa request kematangan martabak?"
              value={newFaqQ}
              onChange={e => setNewFaqQ(e.target.value)}
            />
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                Jawaban
              </label>
              <textarea
                value={newFaqA}
                onChange={e => setNewFaqA(e.target.value)}
                placeholder="misal: Tentu bisa, tuliskan di catatan pesanan saat checkout."
                rows={2}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                if (newFaqQ.trim() && newFaqA.trim()) {
                  setFaqs(prev => [...prev, { id: Date.now().toString(), question: newFaqQ.trim(), answer: newFaqA.trim() }]);
                  setNewFaqQ("");
                  setNewFaqA("");
                }
              }}
            >
              + Tambahkan ke Daftar FAQ
            </Button>
          </div>
        </div>
      )}

      {/* TAB 4: CATERING */}
      {activeTab === "catering" && (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <span className="text-4xl block">🍱</span>
          <h3 className="text-base font-black text-slate-900 dark:text-slate-100">
            Manajemen Paket Katering Kini Memiliki Menu Khusus!
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Untuk memudahkan Anda, manajemen paket katering kini dapat diakses langsung melalui menu <strong>Paket Katering (/katering)</strong> di sidebar.
          </p>
          <div>
            <a
              href="/katering"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
            >
              Buka Halaman Paket Katering →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
