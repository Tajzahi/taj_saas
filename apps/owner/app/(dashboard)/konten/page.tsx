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
  const [heroTitle, setHeroTitle] = useState("Sajian Kuliner Terbaik & Praktis");
  const [heroSubtitle, setHeroSubtitle] = useState("Pesan menu favorit pilihan Anda secara praktis, cepat, dan higienis langsung dari gerai resmi kami.");
  const [heroBadgeText, setHeroBadgeText] = useState("Pilihan Menu Spesial & Berkualitas");
  const [heroBannerUrl, setHeroBannerUrl] = useState("");
  
  // 4 Keunggulan Toko (Value Props)
  const [valueProps, setValueProps] = useState<any[]>([
    { icon: 'Award', title: 'Bahan Baku Pilihan', desc: 'Kami hanya menggunakan bahan-bahan segar berkualitas terbaik untuk cita rasa maksimal.' },
    { icon: '/Halal logo.jfif', title: 'Bersertifikat Halal', desc: 'Seluruh bahan dan proses pengolahan dipastikan halal dan higienis untuk ketenangan Anda.', isImg: true },
    { icon: 'BadgePercent', title: 'Harga Terbaik', desc: 'Pesan langsung dari gerai resmi kami dengan jaminan mutu dan harga paling hemat.' },
    { icon: 'Zap', title: 'Pelayanan Cepat', desc: 'Pesanan diproses secara instan di dapur agar siap dinikmati dalam kondisi segar.' },
  ]);

  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [newTestiName, setNewTestiName] = useState("");
  const [newTestiRating, setNewTestiRating] = useState(5);
  const [newTestiText, setNewTestiText] = useState("");
  const [newTestiLocation, setNewTestiLocation] = useState("");

  // 2. Tentang Kami States
  const [aboutTitle, setAboutTitle] = useState("Tentang Toko & Komitmen Kami");
  const [aboutStory, setAboutStory] = useState("Kami berdedikasi menyajikan sajian terbaik dengan bahan baku berkualitas dan pelayanan yang ramah untuk seluruh pelanggan setia kami.");
  const [aboutHighlights, setAboutHighlights] = useState<string[]>([
    "Bahan Baku Fresh Setiap Hari",
    "100% Halal & Higienis",
    "Pelayanan Ramah & Cepat",
    "Jaminan Kualitas Rasa",
  ]);
  const [newHighlight, setNewHighlight] = useState("");

  // Timeline Sejarah Toko
  const [timeline, setTimeline] = useState<any[]>([]);
  const [newTimeYear, setNewTimeYear] = useState("");
  const [newTimeEvent, setNewTimeEvent] = useState("");
  const [newTimeDesc, setNewTimeDesc] = useState("");

  // 3. FAQ States
  const [faqs, setFaqs] = useState<any[]>([]);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Load existing settings
  useEffect(() => {
    getTenantSettingsAction().then(res => {
      if (res.success && res.data) {
        const branding: any = res.data.branding || {};
        if (branding.heroTitle) setHeroTitle(branding.heroTitle);
        if (branding.heroSubtitle) setHeroSubtitle(branding.heroSubtitle);
        if (branding.heroBadgeText) setHeroBadgeText(branding.heroBadgeText);
        if (branding.heroBannerUrl) setHeroBannerUrl(branding.heroBannerUrl);
        if (branding.valueProps && Array.isArray(branding.valueProps) && branding.valueProps.length > 0) {
          setValueProps(branding.valueProps);
        }
        if (branding.testimonials && Array.isArray(branding.testimonials)) setTestimonials(branding.testimonials);
        if (branding.aboutTitle) setAboutTitle(branding.aboutTitle);
        if (branding.aboutStory) setAboutStory(branding.aboutStory);
        if (branding.aboutHighlights && Array.isArray(branding.aboutHighlights)) setAboutHighlights(branding.aboutHighlights);
        if (branding.timeline && Array.isArray(branding.timeline)) setTimeline(branding.timeline);
        if (branding.faqs && Array.isArray(branding.faqs)) setFaqs(branding.faqs);
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
      valueProps,
      testimonials,
      aboutTitle,
      aboutStory,
      aboutHighlights,
      timeline,
      faqs,
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
            Ubah banner, keunggulan toko, cerita tentang kami, milestone sejarah, ulasan pelanggan, dan tanya jawab FAQ langsung dari sini.
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
          🏠 Homepage & Keunggulan
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "about"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
          }`}
        >
          📖 Tentang Kami & Milestone
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
          🍱 Paket Katering (/katering)
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
              placeholder="misal: Sajian Kuliner Terbaik & Praktis"
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
              placeholder="misal: Pilihan Menu Spesial & Berkualitas"
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
            </div>
          </div>

          {/* 4 Keunggulan Toko (Value Propositions) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>✨</span> 4 Keunggulan Toko (Kenapa Memilih Kami)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {valueProps.map((vp, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-600">Kartu #{idx + 1}</span>
                  </div>
                  <Input
                    label="Judul Keunggulan"
                    value={vp.title}
                    onChange={e => {
                      const updated = [...valueProps];
                      updated[idx].title = e.target.value;
                      setValueProps(updated);
                    }}
                    placeholder="misal: Bahan Baku Pilihan"
                  />
                  <div>
                    <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                      Deskripsi
                    </label>
                    <textarea
                      value={vp.desc}
                      onChange={e => {
                        const updated = [...valueProps];
                        updated[idx].desc = e.target.value;
                        setValueProps(updated);
                      }}
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials List */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>⭐</span> Ulasan & Testimoni Pelanggan
            </h3>
            {testimonials.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {testimonials.map((t, idx) => (
                  <div key={t.id || idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 relative group">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">{t.name}</span>
                      <span className="text-xs text-amber-500 font-bold">{"★".repeat(t.rating || 5)}</span>
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
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada ulasan yang ditambahkan.</p>
            )}

            {/* Form Tambah Testimoni */}
            <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 space-y-3">
              <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">+ Tambah Ulasan Pelanggan Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  label="Nama Pelanggan"
                  placeholder="misal: Budi S."
                  value={newTestiName}
                  onChange={e => setNewTestiName(e.target.value)}
                />
                <Input
                  label="Lokasi / Asal"
                  placeholder="misal: Jakarta"
                  value={newTestiLocation}
                  onChange={e => setNewTestiLocation(e.target.value)}
                />
                <div>
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Rating</label>
                  <select
                    value={newTestiRating}
                    onChange={e => setNewTestiRating(Number(e.target.value))}
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value={5}>★★★★★ (5 Bintang)</option>
                    <option value={4}>★★★★☆ (4 Bintang)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Isi Ulasan</label>
                <textarea
                  value={newTestiText}
                  onChange={e => setNewTestiText(e.target.value)}
                  placeholder="misal: Rasa kopinya enak dan rotinya empuk banget!"
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (newTestiName.trim() && newTestiText.trim()) {
                    setTestimonials(prev => [
                      ...prev,
                      {
                        id: Date.now().toString(),
                        name: newTestiName.trim(),
                        location: newTestiLocation.trim() || undefined,
                        rating: newTestiRating,
                        text: newTestiText.trim(),
                      }
                    ]);
                    setNewTestiName("");
                    setNewTestiLocation("");
                    setNewTestiText("");
                  }
                }}
              >
                + Tambah Ulasan
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ABOUT US */}
      {activeTab === "about" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>📖</span> Halaman Cerita Toko (/about)
            </h3>
            <Input
              label="Judul Kisah Toko"
              value={aboutTitle}
              onChange={e => setAboutTitle(e.target.value)}
              placeholder="misal: Tentang Kisah Toko Kami"
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

          {/* Timeline Sejarah Toko */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>⏳</span> Milestone / Perjalanan Sejarah Toko
            </h3>
            {timeline.length > 0 ? (
              <div className="space-y-2 mb-3">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <div>
                      <span className="font-black text-orange-600 mr-2">[{item.year}]</span>
                      <strong className="text-slate-800 dark:text-slate-200">{item.event}</strong>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setTimeline(prev => prev.filter((_, i) => i !== idx))}
                      className="text-red-500 text-[11px] font-bold hover:underline ml-2 flex-shrink-0"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">Belum ada milestone perjalanan toko yang ditambahkan.</p>
            )}

            {/* Form Tambah Milestone */}
            <div className="p-4 rounded-2xl border border-orange-200 dark:border-orange-900/40 bg-orange-50/50 dark:bg-orange-950/20 space-y-3">
              <h4 className="text-xs font-bold text-orange-600 dark:text-orange-400">+ Tambah Milestone Sejarah Baru</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input
                  label="Tahun"
                  placeholder="misal: 2024"
                  value={newTimeYear}
                  onChange={e => setNewTimeYear(e.target.value)}
                />
                <div className="sm:col-span-2">
                  <Input
                    label="Judul Peristiwa"
                    placeholder="misal: Pembukaan Gerai Pertama"
                    value={newTimeEvent}
                    onChange={e => setNewTimeEvent(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-200 block mb-1">Deskripsi Peristiwa</label>
                <textarea
                  value={newTimeDesc}
                  onChange={e => setNewTimeDesc(e.target.value)}
                  placeholder="misal: Membuka cabang pertama dengan konsep modern dan menu signature."
                  rows={2}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  if (newTimeYear.trim() && newTimeEvent.trim()) {
                    setTimeline(prev => [
                      ...prev,
                      {
                        year: newTimeYear.trim(),
                        event: newTimeEvent.trim(),
                        desc: newTimeDesc.trim(),
                      }
                    ]);
                    setNewTimeYear("");
                    setNewTimeEvent("");
                    setNewTimeDesc("");
                  }
                }}
              >
                + Tambah Milestone
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
              <div key={f.id || idx} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-1">
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
              placeholder="misal: Apakah melayani pesanan katering?"
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
                placeholder="misal: Ya, kami melayani pemesanan untuk acara dan katering."
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
