"use client";

import React, { useState } from "react";
import {
  X,
  Monitor,
  Tablet,
  Smartphone,
  Award,
  BadgePercent,
  Zap,
  Star,
  MapPin,
  Clock,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  ShoppingBag,
  MessageSquare,
  ShoppingCart,
  Menu as MenuIcon,
  ChevronDown,
  Instagram,
  Facebook,
  Ticket,
  Package,
  Image as ImageIcon,
  Tag,
  Calendar,
  Send,
  Search,
  Filter,
  UtensilsCrossed,
  Sprout,
  Heart,
  Handshake,
  AlertCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Flame,
  UserCheck
} from "lucide-react";

type DeviceMode = "desktop" | "tablet" | "mobile";
type PageTab = "homepage" | "menu" | "promo" | "catering" | "gallery" | "about" | "faq";

interface WebsitePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cmsData: {
    heroTitle: string;
    heroHighlightTitle?: string;
    heroSubtitle: string;
    heroBadgeText?: string;
    heroBannerUrl: string;
    primaryColor?: string;
    secondaryColor?: string;
    valueProps: any[];
    testimonials: any[];
    aboutTitle: string;
    aboutStory: string;
    aboutHighlights: string[];
    timeline: any[];
    faqs: any[];
    storeName?: string;
    storeAddress?: string;
    openingHours?: string;
    whatsappNumber?: string;
    logoUrl?: string;
    badgeStripItems?: string[];
    popularMenuSubtitle?: string;
    ctaTitle?: string;
    ctaSubtitle?: string;
    sectionsVisibility?: Record<string, boolean>;
    menuSubtitle?: string;
    promoSubtitle?: string;
    cateringSubtitle?: string;
    gallerySubtitle?: string;
    aboutSubtitle?: string;
  };
}

const mockPopularMenus = [
  {
    id: "1",
    name: "Nasi Goreng Spesial",
    price: 28000,
    badge: "terlaris",
    rating: 4.9,
    category: "Makanan Utama",
    desc: "Nasi goreng racikan bumbu rahasia dapur dilengkapi telur dadar dan ayam suwir gurih.",
    image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "2",
    name: "Ayam Goreng Juara",
    price: 32000,
    badge: "terlaris",
    rating: 4.9,
    category: "Makanan Utama",
    desc: "Ayam ungkep rempah pilihan yang digoreng garing di luar, lembut dan juicy di dalam.",
    image: "https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "3",
    name: "Es Teh Manis Segar",
    price: 8000,
    badge: "favorit",
    rating: 4.8,
    category: "Minuman Segar",
    desc: "Seduhan daun teh melati murni dengan manis pas alami yang menyegarkan dahaga.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "4",
    name: "Kopi Susu Aren Signature",
    price: 18000,
    badge: "rekomendasi",
    rating: 4.9,
    category: "Minuman Segar",
    desc: "Espresso espresso lembut berpadu susu kental manis dan gula aren alami.",
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "5",
    name: "Kentang Goreng Krispi",
    price: 15000,
    badge: "snack",
    rating: 4.7,
    category: "Cemilan & Snack",
    desc: "Potongan kentang pilihan yang digoreng garing ditaburi bumbu saus spesial.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=60"
  },
  {
    id: "6",
    name: "Paket Hemat Berdua",
    price: 55000,
    badge: "paket hemat",
    rating: 5.0,
    category: "Paket Hemat",
    desc: "Kombinasi 2 Nasi Goreng Spesial + 2 Es Teh Manis hemat hingga 20%.",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60"
  }
];

const mockPromos = [
  {
    id: "1",
    icon: "🎁",
    title: "Diskon Spesial Pengguna Baru",
    desc: "Nikmati potongan harga spesial hingga 20% untuk seluruh pilihan menu favorit Anda.",
    period: "Berlaku s.d akhir bulan",
    syarat: "Berlaku untuk semua menu. Minimum order Rp 30.000.",
    badge: "20% OFF",
    code: "HEMAT20",
  },
  {
    id: "2",
    icon: "🛍️",
    title: "Bundling Hemat Spesial",
    desc: "Paket kombinasi menu makanan dan minuman hemat hingga 20% dari harga normal.",
    period: "Berlaku setiap hari",
    syarat: "Harga sudah termasuk paket pilihan. Berlaku untuk pickup dan delivery.",
    badge: "POTONGAN RP",
    code: "BUNDLING",
  },
  {
    id: "3",
    icon: "✨",
    title: "Promo Grand Opening Web App",
    desc: "Rayakan peluncuran web app! Order via web dapat gratis bonus spesial untuk transaksi di atas Rp 40.000.",
    period: "Edisi terbatas",
    syarat: "Berlaku untuk transaksi via website. Minimum order Rp 40.000.",
    badge: "SPECIAL",
    code: "WEBAPPNEW",
  }
];

const defaultCateringPackages = [
  {
    name: "Paket Acara Kecil",
    quantity: "10–15 Porsi",
    price: "Rp 450.000",
    priceNote: "Rp 30.000/porsi",
    items: ["Pilihan Menu Signature Pilihan", "Termasuk Packaging Rapi & Higienis", "Free Kartu Ucapan / Label Acara"],
    highlight: false,
  },
  {
    name: "Paket Gathering Kantor",
    quantity: "20–30 Porsi",
    price: "Rp 850.000",
    priceNote: "Rp 28.000/porsi",
    items: ["Aneka Pilihan Menu Utama & Minuman", "Packaging Premium Khusus Rapat / Event", "Pengiriman Tepat Waktu ke Lokasi"],
    highlight: true,
  },
  {
    name: "Paket Pesta & Syukuran",
    quantity: "50+ Porsi",
    price: "Rp 1.500.000",
    priceNote: "Rp 25.000/porsi",
    items: ["Kustomisasi Menu Penuh Sesuai Permintaan", "Penyajian & Perlengkapan Lengkap", "Diskon Khusus Volume Besar"],
    highlight: false,
  }
];

const mockGallery = [
  { id: 1, category: "Suasana Gerai", caption: "Suasana nyaman gerai kami", src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500&auto=format&fit=crop&q=60" },
  { id: 2, category: "Menu Favorit", caption: "Hidangan lezat siap disajikan", src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop&q=60" },
  { id: 3, category: "Menu Favorit", caption: "Bahan segar racikan dapur", src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60" },
  { id: 4, category: "Event", caption: "Momen kebersamaan pelanggan", src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60" }
];

const defaultFaqData = [
  {
    label: "Umum & Toko",
    items: [
      { q: "Bagaimana jam operasional layanan?", a: "Kami melayani pesanan sesuai jam operasional gerai yang tertera. Kami siap melayani makan di tempat (dine-in), bawa pulang (takeaway), dan pesan antar (delivery)." },
      { q: "Apakah produk dijamin Halal dan Bersih?", a: "Ya! Seluruh bahan baku dan proses pengolahan kami dipastikan 100% Halal, higienis, dan aman dikonsumsi seluruh keluarga." },
      { q: "Apakah bisa memesan untuk jumlah besar / acara?", a: "Tentu bisa! Kami menyediakan layanan katering dan pemesanan jumlah banyak untuk acara kantor, rapat, pesta, maupun syukuran." }
    ]
  },
  {
    label: "Order & Pembayaran",
    items: [
      { q: "Bagaimana cara pesan online di web?", a: "Pilih menu favorit Anda → Tambah ke keranjang → Isi nama & nomor WhatsApp → Pilih metode bayar → Pesan Sekarang. Anda akan mendapatkan kode order untuk pelacakan real-time." },
      { q: "Apakah harus daftar akun terlebih dahulu?", a: "Tidak perlu! Cukup isi nama dan nomor WhatsApp saja saat checkout. Cepat dan praktis tanpa ribet." },
      { q: "Metode pembayaran apa saja yang diterima?", a: "Kami menerima QRIS (BCA, GoPay, OVO, ShopeePay, DANA), Transfer Bank, dan Tunai di Tempat (COD)." }
    ]
  }
];

const defaultAboutValues = [
  { icon: Award, title: "Kualitas Rasa", desc: "Konsistensi rasa dan standar penyajian terbaik yang selalu kami jaga untuk setiap pelanggan." },
  { icon: Sprout, title: "Bahan Pilihan", desc: "Kami hanya menggunakan bahan-bahan segar berkualitas tinggi demi kepuasan Anda." },
  { icon: Heart, title: "Penuh Dedikasi", desc: "Setiap sajian disiapkan dengan dedikasi dan standar kebersihan yang ketat." },
  { icon: Handshake, title: "Pelayanan Ramah", desc: "Kami selalu siap melayani dengan ramah untuk memberikan pengalaman terbaik bagi Anda." }
];

export default function WebsitePreviewModal({
  isOpen,
  onClose,
  cmsData
}: WebsitePreviewModalProps) {
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [activeTab, setActiveTab] = useState<PageTab>("homepage");
  const [activeFaq, setActiveFaq] = useState<string | null>("0-0");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sub-page states simulation
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGalleryFilter, setActiveGalleryFilter] = useState("semua");

  if (!isOpen) return null;

  const storeName = cmsData.storeName || "TAJ SAAS RESTO";
  const storeAddress = cmsData.storeAddress || "Jl. Raya Utama No. 123, Surabaya";
  const openingHours = cmsData.openingHours || "Senin - Minggu: 09.00 - 22.00 WIB";

  // Dynamic Theme Colors
  const primaryColor = cmsData.primaryColor || "#8E0E0E";
  const secondaryColor = cmsData.secondaryColor || "#E05009";

  // Section visibility flags
  const vis = cmsData.sectionsVisibility || {};
  const showBadgeStrip = vis.showBadgeStrip !== false;
  const showPopularMenu = vis.showPopularMenu !== false;

  // Dynamic device responsive classes (evaluating container mode instead of window breakpoints)
  const getDeviceWidthClass = () => {
    switch (device) {
      case "mobile":
        return "w-[375px] max-w-full";
      case "tablet":
        return "w-[768px] max-w-full";
      case "desktop":
      default:
        return "w-[1100px] max-w-full";
    }
  };

  const getPopularMenuGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 gap-3 max-w-sm mx-auto";
    if (device === "tablet") return "grid grid-cols-2 gap-4 max-w-2xl mx-auto";
    return "grid grid-cols-3 gap-4 max-w-4xl mx-auto";
  };

  const getMenuPageGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 sm:grid-cols-2 gap-3";
    if (device === "tablet") return "grid grid-cols-3 gap-3";
    return "grid grid-cols-4 gap-4";
  };

  const getCateringGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 gap-4";
    if (device === "tablet") return "grid grid-cols-2 gap-4";
    return "grid grid-cols-3 gap-4";
  };

  const getInquiryFormGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 gap-3 text-xs";
    return "grid grid-cols-2 gap-3 text-xs";
  };

  const getGalleryGridClass = () => {
    if (device === "mobile") return "grid grid-cols-2 gap-2";
    if (device === "tablet") return "grid grid-cols-3 gap-3";
    return "grid grid-cols-4 gap-3";
  };

  const getAboutHighlightsGridClass = () => {
    if (device === "mobile") return "grid grid-cols-2 gap-2";
    return "grid grid-cols-4 gap-3";
  };

  const getAboutValuesGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 gap-3";
    return "grid grid-cols-2 gap-3";
  };

  const getFooterGridClass = () => {
    if (device === "mobile") return "grid grid-cols-1 gap-6 mb-8";
    if (device === "tablet") return "grid grid-cols-2 gap-6 mb-8";
    return "grid grid-cols-4 gap-8 mb-10";
  };

  const getHeaderTitleClass = () => {
    if (device === "mobile") return "text-xl font-black mb-1 flex items-center justify-center gap-1.5 leading-tight";
    if (device === "tablet") return "text-2xl font-black mb-1.5 flex items-center justify-center gap-2";
    return "text-3xl font-black mb-2 flex items-center justify-center gap-2";
  };

  const getHeaderSubtitleClass = () => {
    if (device === "mobile") return "text-white/90 text-[11px] max-w-xs mx-auto leading-snug";
    return "text-white/90 text-xs sm:text-sm max-w-xl mx-auto";
  };

  const defaultBadges = ["Kualitas Premium", "Halal Certified", "4.9 Rating", "Delivery & Pickup", "Gerai Resmi"];
  const displayBadges = (cmsData.badgeStripItems && cmsData.badgeStripItems.length > 0)
    ? cmsData.badgeStripItems
    : defaultBadges;

  // Filtered menu simulation
  const filteredMenus = mockPopularMenus.filter(m => {
    const matchCat = selectedCategory === "semua" || m.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchSearch = !searchQuery || m.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const customFaqs = cmsData.faqs && cmsData.faqs.length > 0 ? cmsData.faqs : null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/80 backdrop-blur-sm animate-fadeIn">
      {/* Top Controls Bar */}
      <div className="bg-gray-900 border-b border-gray-800 text-white px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-white px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm" style={{ backgroundColor: primaryColor }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Live Preview
          </div>
          <span className="text-gray-300 text-sm font-medium hidden lg:inline">
            Tampilan Website Customer (100% Persis Presisi)
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-gray-800 p-1 rounded-xl border border-gray-700">
          <button
            onClick={() => setDevice("desktop")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "desktop" ? "text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
            style={device === "desktop" ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` } : {}}
          >
            <Monitor className="w-4 h-4" />
            <span className="hidden md:inline">Desktop</span>
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "tablet" ? "text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
            style={device === "tablet" ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` } : {}}
          >
            <Tablet className="w-4 h-4" />
            <span className="hidden md:inline">Tablet</span>
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              device === "mobile" ? "text-white shadow-md" : "text-gray-400 hover:text-white"
            }`}
            style={device === "mobile" ? { background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` } : {}}
          >
            <Smartphone className="w-4 h-4" />
            <span className="hidden md:inline">Mobile</span>
          </button>
        </div>

        {/* Page Switcher Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-800 p-1 rounded-xl border border-gray-700 overflow-x-auto max-w-[420px] scrollbar-hide">
            <button
              onClick={() => setActiveTab("homepage")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "homepage" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Beranda
            </button>
            <button
              onClick={() => setActiveTab("menu")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "menu" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab("promo")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "promo" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Promo
            </button>
            <button
              onClick={() => setActiveTab("catering")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "catering" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Katering
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "gallery" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Galeri
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "about" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              Tentang
            </button>
            <button
              onClick={() => setActiveTab("faq")}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === "faq" ? "bg-white/20 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              FAQ
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 text-gray-400 hover:text-white rounded-xl transition-all"
            title="Tutup Preview"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Preview Container */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex justify-center items-start bg-gray-950">
        <div
          className={`${getDeviceWidthClass()} bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-700 transition-all duration-300 max-h-[calc(100vh-100px)] flex flex-col my-auto`}
        >
          {/* Mock Browser Address Bar */}
          <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-3 flex-shrink-0">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white border border-gray-300 rounded-lg px-3 py-1 text-xs text-gray-500 font-mono flex items-center justify-between overflow-hidden">
              <span className="truncate max-w-[220px]">https://customer.web.app/{activeTab === "homepage" ? "" : activeTab}</span>
              <span className="text-[10px] text-green-600 font-semibold uppercase bg-green-50 px-1.5 py-0.5 rounded flex-shrink-0">🔒 SECURE</span>
            </div>
          </div>

          {/* Preview Body Content */}
          <div className="overflow-y-auto overflow-x-hidden text-gray-900 font-sans flex-1">
            {/* 100% ACCURATE CUSTOMER HEADER */}
            <header className="bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-100 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                {/* Logo & Store Name */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab("homepage")}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-xs shadow-sm overflow-hidden flex-shrink-0" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                    {cmsData.logoUrl ? (
                      <img src={cmsData.logoUrl} alt={storeName} className="w-full h-full object-cover" />
                    ) : (
                      <span>{storeName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <p className="font-black text-xs tracking-wider leading-none uppercase" style={{ color: primaryColor }}>{storeName}</p>
                    <p className="text-[8px] tracking-widest leading-none font-bold uppercase text-gray-400 mt-0.5">GERAI RESMI</p>
                  </div>
                </div>

                {/* Desktop/Tablet Nav Links */}
                {device !== "mobile" && (
                  <nav className="flex items-center gap-3 lg:gap-5 text-[11px] font-black uppercase tracking-wider text-gray-700">
                    <span onClick={() => setActiveTab("homepage")} className="cursor-pointer hover:opacity-80" style={activeTab === "homepage" ? { color: secondaryColor } : {}}>Home</span>
                    <span onClick={() => setActiveTab("menu")} className="cursor-pointer hover:opacity-80" style={activeTab === "menu" ? { color: secondaryColor } : {}}>Menu</span>
                    <span onClick={() => setActiveTab("promo")} className="cursor-pointer hover:opacity-80" style={activeTab === "promo" ? { color: secondaryColor } : {}}>Promo</span>
                    <span onClick={() => setActiveTab("catering")} className="cursor-pointer hover:opacity-80" style={activeTab === "catering" ? { color: secondaryColor } : {}}>Katering</span>
                    <span onClick={() => setActiveTab("gallery")} className="cursor-pointer hover:opacity-80" style={activeTab === "gallery" ? { color: secondaryColor } : {}}>Gallery</span>
                    <span onClick={() => setActiveTab("about")} className="cursor-pointer hover:opacity-80" style={activeTab === "about" ? { color: secondaryColor } : {}}>Tentang</span>
                    <span onClick={() => setActiveTab("faq")} className="cursor-pointer hover:opacity-80" style={activeTab === "faq" ? { color: secondaryColor } : {}}>FAQ</span>
                  </nav>
                )}

                {/* Cart & Mobile Hamburger */}
                <div className="flex items-center gap-2">
                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full text-white shadow-sm cursor-pointer" style={{ backgroundColor: secondaryColor }}>
                    <ShoppingCart className="w-4 h-4" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 text-black text-[9px] font-extrabold rounded-full flex items-center justify-center">
                      2
                    </span>
                  </div>
                  {device === "mobile" && (
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="p-1.5 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                      <MenuIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile Drawer Menu Simulation */}
              {device === "mobile" && mobileMenuOpen && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-2 text-xs font-bold uppercase tracking-wider text-gray-700 animate-fadeIn">
                  <div onClick={() => { setActiveTab("homepage"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "homepage" ? primaryColor : "inherit" }}>Home</div>
                  <div onClick={() => { setActiveTab("menu"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "menu" ? primaryColor : "inherit" }}>Menu</div>
                  <div onClick={() => { setActiveTab("promo"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "promo" ? primaryColor : "inherit" }}>Promo & Kupon</div>
                  <div onClick={() => { setActiveTab("catering"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "catering" ? primaryColor : "inherit" }}>Paket Katering</div>
                  <div onClick={() => { setActiveTab("gallery"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "gallery" ? primaryColor : "inherit" }}>Gallery Foto</div>
                  <div onClick={() => { setActiveTab("about"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "about" ? primaryColor : "inherit" }}>Tentang Kami</div>
                  <div onClick={() => { setActiveTab("faq"); setMobileMenuOpen(false); }} className="py-1.5 px-2 hover:bg-gray-50" style={{ color: activeTab === "faq" ? primaryColor : "inherit" }}>FAQ</div>
                </div>
              )}
            </header>

            {/* TAB 1: HOMEPAGE */}
            {activeTab === "homepage" && (
              <div className="animate-fadeIn">
                <section className="relative min-h-[340px] flex items-center justify-center p-6 text-center overflow-hidden">
                  {cmsData.heroBannerUrl ? (
                    <div className="absolute inset-0 bg-cover bg-center transition-all duration-300" style={{ backgroundImage: `url('${cmsData.heroBannerUrl}')` }} />
                  ) : (
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }} />
                  )}
                  <div className="absolute inset-0 bg-black/60" />
                  <div className="relative z-10 max-w-xl mx-auto text-white">
                    {cmsData.heroBadgeText && (
                      <span className="inline-block bg-white/20 backdrop-blur-md text-white font-semibold text-xs px-3 py-1 rounded-full mb-3 border border-white/30">{cmsData.heroBadgeText}</span>
                    )}
                    <h1 className={`${device === "mobile" ? "text-xl" : "text-3xl sm:text-4xl"} font-black mb-3 leading-tight whitespace-pre-line`}>
                      {cmsData.heroTitle ? <>{cmsData.heroTitle}<br /><span style={{ color: secondaryColor }}>{cmsData.heroHighlightTitle || storeName}</span></> : <>{storeName}</>}
                    </h1>
                    <p className="text-white/90 text-xs sm:text-base mb-6 leading-relaxed">
                      {cmsData.heroSubtitle || "Cita rasa otentik berkualitas tinggi."}
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <span onClick={() => setActiveTab("menu")} className="px-6 py-3 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-1.5 cursor-pointer" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                        Pesan Sekarang <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </section>

                {showBadgeStrip && (
                  <section className="py-3 text-white text-xs font-semibold" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                    <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-8 px-4 text-[11px] sm:text-xs">
                      {displayBadges.map((badgeText, idx) => <span key={idx} className="flex items-center gap-1">{badgeText}</span>)}
                    </div>
                  </section>
                )}

                {showPopularMenu && (
                  <section className="py-8 sm:py-12 px-4 bg-gray-50 border-b border-gray-100">
                    <div className="max-w-4xl mx-auto text-center mb-6">
                      <span className="font-bold text-xs tracking-wider uppercase" style={{ color: secondaryColor }}>Menu Favorit</span>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">Menu <span style={{ color: primaryColor }}>Terlaris</span></h2>
                    </div>
                    <div className={getPopularMenuGridClass()}>
                      {mockPopularMenus.slice(0, 3).map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col">
                          <div className="relative h-32 bg-gray-200 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase" style={{ backgroundColor: primaryColor }}>{item.badge}</span>
                          </div>
                          <div className="p-3 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-xs">{item.name}</h3>
                              <p className="text-[10px] text-gray-500 line-clamp-2 mt-1">{item.desc}</p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <span className="font-extrabold text-xs" style={{ color: primaryColor }}>Rp {item.price.toLocaleString("id-ID")}</span>
                              <span className="px-2 py-1 text-white text-[10px] font-bold rounded-lg" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>+ Tambah</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-5">
                      <span onClick={() => setActiveTab("menu")} className="inline-flex items-center gap-1.5 px-5 py-2 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Lihat Semua Menu <ChevronRight className="w-4 h-4" /></span>
                    </div>
                  </section>
                )}
              </div>
            )}

            {/* TAB 2: MENU PAGE */}
            {activeTab === "menu" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-10 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <h1 className={getHeaderTitleClass()}>Menu Kami</h1>
                  <p className={getHeaderSubtitleClass()}>
                    {cmsData.menuSubtitle || "Pilihan menu lezat dan terbaik untuk Anda. Dibuat fresh setiap hari!"}
                  </p>
                </div>
                <div className="p-4 max-w-4xl mx-auto">
                  {/* Search Bar */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Cari menu favorit Anda..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex gap-1.5 overflow-x-auto pb-3 mb-5 scrollbar-hide">
                    {["semua", "Makanan Utama", "Minuman Segar", "Cemilan & Snack", "Paket Hemat"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap capitalize ${
                          selectedCategory === cat ? "text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        style={selectedCategory === cat ? { backgroundColor: primaryColor } : {}}
                      >
                        {cat === "semua" ? "🍽️ Semua" : cat}
                      </button>
                    ))}
                  </div>

                  {/* Menu Cards Grid */}
                  <div className={getMenuPageGridClass()}>
                    {filteredMenus.map((item) => (
                      <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-all">
                        <div className="relative h-28 sm:h-32 bg-gray-200 overflow-hidden">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          <span className="absolute top-2 left-2 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md uppercase" style={{ backgroundColor: primaryColor }}>{item.badge}</span>
                          <span className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-yellow-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                            <Star className="w-2.5 h-2.5 fill-yellow-400" /> {item.rating}
                          </span>
                        </div>
                        <div className="p-2.5 flex-1 flex flex-col justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 text-xs">{item.name}</h3>
                            <p className="text-[10px] text-gray-500 line-clamp-2 mt-0.5">{item.desc}</p>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between">
                            <span className="font-extrabold text-xs" style={{ color: primaryColor }}>Rp {item.price.toLocaleString("id-ID")}</span>
                            <button className="px-2 py-1 text-white text-[10px] font-bold rounded-lg shadow-sm" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>+ Tambah</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROMO PAGE */}
            {activeTab === "promo" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-10 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <h1 className={getHeaderTitleClass()}>
                    <Ticket className="w-5 h-5 sm:w-6 sm:h-6" /> Promo & Kupon Diskon
                  </h1>
                  <p className={getHeaderSubtitleClass()}>
                    {cmsData.promoSubtitle || "Penawaran spesial dan potongan harga khusus untuk pelanggan setia"}
                  </p>
                </div>
                <div className="p-4 max-w-2xl mx-auto space-y-4">
                  {mockPromos.map((p) => (
                    <div key={p.id} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all">
                      <div className="p-3.5 text-white flex items-center justify-between" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.icon}</span>
                          <h3 className="font-extrabold text-xs sm:text-sm">{p.title}</h3>
                        </div>
                        <span className="bg-white/20 backdrop-blur border border-white/30 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">{p.badge}</span>
                      </div>
                      <div className="p-3.5 space-y-2.5">
                        <p className="text-xs text-gray-600 leading-relaxed">{p.desc}</p>
                        <div className="flex items-center gap-4 text-[11px] text-gray-500">
                          <span className="flex items-center gap-1 font-semibold text-gray-700"><Calendar className="w-3.5 h-3.5" style={{ color: primaryColor }} /> {p.period}</span>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2 text-[11px] text-gray-600 border border-gray-100 flex items-center justify-between">
                          <span className="font-mono font-bold text-gray-800">Kode: {p.code}</span>
                          <button className="px-2.5 py-1 text-white text-[10px] font-bold rounded-lg" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Klaim Promo</button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Instagram Banner CTA */}
                  <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-5 text-white text-center space-y-2 shadow-sm">
                    <Instagram className="w-7 h-7 mx-auto opacity-90" />
                    <h3 className="font-extrabold text-xs sm:text-sm">Ikuti Kami di Instagram</h3>
                    <p className="text-[11px] opacity-90">Dapatkan update promo mendadak & kuis berhadiah menarik setiap minggunya!</p>
                    <button className="mt-1.5 bg-white text-purple-700 px-4 py-1 rounded-xl text-xs font-bold shadow-md hover:bg-gray-100">@gerai_resmi</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: CATERING PAGE */}
            {activeTab === "catering" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-10 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <h1 className={getHeaderTitleClass()}>
                    <Package className="w-5 h-5 sm:w-6 sm:h-6" /> Paket Katering & Pesanan Besar
                  </h1>
                  <p className={getHeaderSubtitleClass()}>
                    {cmsData.cateringSubtitle || "Solusi lezat dan hemat untuk acara keluarga, kantor, arisan, dan pesta"}
                  </p>
                </div>

                <div className="p-4 max-w-4xl mx-auto space-y-6">
                  {/* Packages Grid */}
                  <div className={getCateringGridClass()}>
                    {defaultCateringPackages.map((pkg, i) => (
                      <div key={i} className={`bg-white rounded-2xl p-4 border flex flex-col justify-between shadow-sm relative ${pkg.highlight ? "border-orange-500 ring-2 ring-orange-500/20" : "border-gray-200"}`}>
                        {pkg.highlight && (
                          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm whitespace-nowrap">Paling Populer</span>
                        )}
                        <div className="space-y-2">
                          <h3 className="font-extrabold text-xs sm:text-sm text-gray-900">{pkg.name}</h3>
                          <span className="inline-block text-[10px] font-bold bg-orange-50 text-orange-700 px-2 py-0.5 rounded-md">{pkg.quantity}</span>
                          <div>
                            <p className="text-lg sm:text-xl font-black" style={{ color: primaryColor }}>{pkg.price}</p>
                            <p className="text-[10px] text-gray-400 font-semibold">{pkg.priceNote}</p>
                          </div>
                          <ul className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-2.5">
                            {pkg.items.map((item, idx) => (
                              <li key={idx} className="flex items-center gap-1.5">
                                <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                <span className="text-[11px]">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <button className="w-full mt-3 py-1.5 text-white font-bold text-xs rounded-xl shadow-sm" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Pilih Paket Ini</button>
                      </div>
                    ))}
                  </div>

                  {/* Inquiry Form */}
                  <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm space-y-3 max-w-2xl mx-auto">
                    <h3 className="font-extrabold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                      <Send className="w-4 h-4 text-orange-500" /> Formulir Pemesanan Katering
                    </h3>
                    <div className={getInquiryFormGridClass()}>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Nama Lengkap *</label>
                        <input type="text" placeholder="Contoh: Ibu Rina" className="w-full p-2 border rounded-xl bg-gray-50" disabled />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Nomor WhatsApp *</label>
                        <input type="text" placeholder="081234567890" className="w-full p-2 border rounded-xl bg-gray-50" disabled />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Jumlah Porsi *</label>
                        <input type="number" placeholder="25" className="w-full p-2 border rounded-xl bg-gray-50" disabled />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Tanggal Acara *</label>
                        <input type="date" className="w-full p-2 border rounded-xl bg-gray-50" disabled />
                      </div>
                    </div>
                    <button className="w-full py-2.5 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
                      <Send className="w-3.5 h-3.5" /> Kirim Permintaan Katering via WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: GALLERY PAGE */}
            {activeTab === "gallery" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-10 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <h1 className={getHeaderTitleClass()}>
                    <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6" /> Galeri Foto & Dokumentasi
                  </h1>
                  <p className={getHeaderSubtitleClass()}>
                    {cmsData.gallerySubtitle || `Lihat lebih dekat keistimewaan & kelezatan ${storeName}`}
                  </p>
                </div>
                <div className="p-4 max-w-4xl mx-auto space-y-5">
                  {/* Category Filter */}
                  <div className="flex gap-1.5 justify-center flex-wrap">
                    {["semua", "Suasana Gerai", "Menu Favorit", "Event"].map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveGalleryFilter(f)}
                        className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                          activeGalleryFilter === f ? "text-white" : "bg-gray-100 text-gray-600"
                        }`}
                        style={activeGalleryFilter === f ? { backgroundColor: primaryColor } : {}}
                      >
                        {f === "semua" ? "🌟 Semua" : f}
                      </button>
                    ))}
                  </div>

                  {/* Images Grid */}
                  <div className={getGalleryGridClass()}>
                    {mockGallery.map((item) => (
                      <div key={item.id} className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-gray-100">
                        <img src={item.src} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                        <span className="absolute top-2 left-2 bg-black/60 backdrop-blur text-white text-[9px] font-bold px-2 py-0.5 rounded-md">{item.category}</span>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-end p-2 text-white">
                          <p className="text-[10px] font-medium">{item.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Box */}
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 text-center space-y-1.5">
                    <p className="text-xs font-extrabold text-orange-900">Mau Coba Langsung?</p>
                    <p className="text-[11px] text-orange-700">Pesan sekarang dan buat momen spesial bersama keluarga!</p>
                    <button onClick={() => setActiveTab("menu")} className="px-4 py-1.5 text-white text-xs font-bold rounded-xl shadow-sm" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>Pesan Sekarang</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: ABOUT PAGE */}
            {activeTab === "about" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-12 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold mb-2.5 border border-white/30">
                    <Award className="w-3.5 h-3.5" /> Kualitas & Cita Rasa Terbaik
                  </span>
                  <h1 className={getHeaderTitleClass()}>{cmsData.aboutTitle || `Tentang ${storeName}`}</h1>
                  <p className={getHeaderSubtitleClass()}>
                    {cmsData.aboutSubtitle || "Perjalanan penuh dedikasi menyajikan sajian kuliner terbaik untuk Anda."}
                  </p>
                </div>

                <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-6">
                  {/* Story Section */}
                  <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-2.5">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-600">Kisah Kami</span>
                    <h2 className="text-base sm:text-lg font-black text-gray-900">Komitmen Kami dalam Menyajikan Kelezatan</h2>
                    <p className="text-xs leading-relaxed text-gray-600">
                      {cmsData.aboutStory || `${storeName} berdedikasi menghadirkan hidangan berkualitas dengan cita rasa pilihan. Kami percaya bahwa makanan yang lezat dibuat dengan bahan baku terbaik, higienis, dan kasih sayang.`}
                    </p>

                    {/* Highlights Cards */}
                    <div className={getAboutHighlightsGridClass()}>
                      {(cmsData.aboutHighlights && cmsData.aboutHighlights.length > 0
                        ? cmsData.aboutHighlights
                        : ["100% Halal & Higienis", "Bahan Fresh Setiap Hari", "Resep Otentik Khas Dapur", "Layanan Ramah & Cepat"]
                      ).map((hl, idx) => (
                        <div key={idx} className="bg-orange-50/50 rounded-xl p-2 text-center border border-orange-100">
                          <p className="text-[11px] font-bold text-gray-800">✨ {hl}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Values Cards */}
                  <div className="space-y-3">
                    <h3 className="text-center font-extrabold text-xs sm:text-sm text-gray-900">Nilai-Nilai Utama Kami</h3>
                    <div className={getAboutValuesGridClass()}>
                      {defaultAboutValues.map((val, idx) => (
                        <div key={idx} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm space-y-1">
                          <val.icon className="w-4 h-4 text-orange-500" />
                          <h4 className="font-bold text-xs text-gray-900">{val.title}</h4>
                          <p className="text-[10px] text-gray-500 leading-tight">{val.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: FAQ PAGE */}
            {activeTab === "faq" && (
              <div className="animate-fadeIn">
                <div className="py-8 sm:py-10 px-4 text-white text-center" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                  <h1 className={getHeaderTitleClass()}>
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" /> Tanya Jawab (FAQ)
                  </h1>
                  <p className={getHeaderSubtitleClass()}>
                    Jawaban cepat untuk pertanyaan yang sering diajukan pelanggan
                  </p>
                </div>

                <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-5">
                  {/* Custom or Default FAQs Accordion */}
                  <div className="space-y-2.5">
                    {customFaqs ? (
                      customFaqs.map((f, i) => {
                        const key = `custom-${i}`;
                        const isOpenFaq = activeFaq === key;
                        return (
                          <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                            <button
                              onClick={() => setActiveFaq(isOpenFaq ? null : key)}
                              className="w-full p-3.5 font-bold text-xs text-left text-gray-900 flex items-center justify-between gap-3"
                            >
                              <span>{f.q || f.question}</span>
                              <ChevronDown className={`w-4 h-4 text-orange-500 flex-shrink-0 transition-transform ${isOpenFaq ? "rotate-180" : ""}`} />
                            </button>
                            {isOpenFaq && (
                              <div className="p-3.5 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-gray-50/50">
                                {f.a || f.answer}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      defaultFaqData.map((cat, catIdx) => (
                        <div key={catIdx} className="space-y-2">
                          <h3 className="font-extrabold text-[11px] uppercase tracking-wider text-orange-600 px-1">{cat.label}</h3>
                          {cat.items.map((item, itemIdx) => {
                            const key = `${catIdx}-${itemIdx}`;
                            const isOpenFaq = activeFaq === key;
                            return (
                              <div key={itemIdx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                                <button
                                  onClick={() => setActiveFaq(isOpenFaq ? null : key)}
                                  className="w-full p-3.5 font-bold text-xs text-left text-gray-900 flex items-center justify-between gap-3"
                                >
                                  <span>{item.q}</span>
                                  <ChevronDown className={`w-4 h-4 text-orange-500 flex-shrink-0 transition-transform ${isOpenFaq ? "rotate-180" : ""}`} />
                                </button>
                                {isOpenFaq && (
                                  <div className="p-3.5 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-gray-50/50">
                                    {item.a}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Customer Service WhatsApp Card */}
                  <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-4 text-white text-center space-y-1.5 shadow-sm">
                    <Phone className="w-5 h-5 mx-auto opacity-90" />
                    <h3 className="font-extrabold text-xs sm:text-sm">Punya Pertanyaan Lain?</h3>
                    <p className="text-[11px] opacity-90">Tim Customer Service kami siap membantu Anda via WhatsApp setiap hari.</p>
                    <button className="mt-1 bg-white text-emerald-800 px-4 py-1 rounded-xl text-xs font-bold shadow-md hover:bg-gray-100">
                      Chat Customer Service
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ACCURATE CUSTOMER FOOTER */}
            <footer className="bg-[#1a0a0a] text-white pt-8 pb-6 px-6 border-t border-gray-800 mt-8">
              <div className="max-w-4xl mx-auto">
                <div className={getFooterGridClass()}>
                  <div>
                    <p className="font-bold text-xs sm:text-sm mb-2" style={{ color: secondaryColor }}>{storeName}</p>
                    <p className="text-[11px] text-gray-400 leading-relaxed">{storeAddress}</p>
                    <p className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-orange-500" /> {openingHours}</p>
                  </div>
                  <div>
                    <p className="font-bold text-[11px] mb-2 uppercase tracking-wider text-gray-200">Menu & Layanan</p>
                    <ul className="space-y-1 text-[11px] text-gray-400">
                      <li onClick={() => setActiveTab("menu")} className="cursor-pointer hover:text-white transition-all">Daftar Menu</li>
                      <li onClick={() => setActiveTab("catering")} className="cursor-pointer hover:text-white transition-all">Paket Katering</li>
                      <li onClick={() => setActiveTab("promo")} className="cursor-pointer hover:text-white transition-all">Promo & Kupon</li>
                      <li onClick={() => setActiveTab("gallery")} className="cursor-pointer hover:text-white transition-all">Galeri Foto</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-[11px] mb-2 uppercase tracking-wider text-gray-200">Informasi</p>
                    <ul className="space-y-1 text-[11px] text-gray-400">
                      <li onClick={() => setActiveTab("about")} className="cursor-pointer hover:text-white transition-all">Tentang Kami</li>
                      <li onClick={() => setActiveTab("faq")} className="cursor-pointer hover:text-white transition-all">Tanya Jawab (FAQ)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-bold text-[11px] mb-2 uppercase tracking-wider text-gray-200">Hubungi Kami</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp CS</p>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-4 text-center text-[10px] text-gray-500">
                  © {new Date().getFullYear()} {storeName}. All rights reserved. Powered by Taj SaaS.
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
