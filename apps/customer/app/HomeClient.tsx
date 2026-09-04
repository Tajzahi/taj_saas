"use client";
import Link from 'next/link';
import Image from 'next/image';

import { Star, MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Award, Truck, Zap, Search, FileText, ShoppingBag, MessageSquare, BadgePercent, UtensilsCrossed } from 'lucide-react';
import { menuItems as staticMenuItems, popularMenuSlugs, MenuItem } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
type DbStoreSettings = any;

const defaultValuePropositions = [
  { icon: 'Award', title: 'Bahan Baku Pilihan', desc: 'Kami hanya menggunakan bahan-bahan segar berkualitas terbaik untuk cita rasa maksimal.' },
  { icon: '/Halal logo.jfif', title: 'Bersertifikat Halal', desc: 'Seluruh bahan dan proses pengolahan dipastikan halal dan higienis untuk ketenangan Anda.', isImg: true },
  { icon: 'BadgePercent', title: 'Harga Terbaik', desc: 'Pesan langsung dari gerai resmi kami dengan jaminan mutu dan harga paling hemat.' },
  { icon: 'Zap', title: 'Pelayanan Cepat', desc: 'Pesanan diproses secara instan di dapur agar siap dinikmati dalam kondisi segar.' },
];

const defaultOrderSteps = [
  { step: '01', icon: 'Search', title: 'Pilih Menu', desc: 'Pilih menu makanan atau minuman favorit dari daftar menu kami' },
  { step: '02', icon: 'FileText', title: 'Isi Data & Pesan', desc: 'Tentukan opsi pengambilan atau antar serta metode pembayaran' },
  { step: '03', icon: 'ShoppingBag', title: 'Siap Dinikmati', desc: 'Pesanan diproses dapur dan siap disajikan untuk Anda' },
];

interface HomeClientProps {
  initialSettings: DbStoreSettings;
  initialItems: MenuItem[];
}

export default function HomeClient({ initialSettings, initialItems }: HomeClientProps) {
  // Data sudah dikirim dari server (SSR), tidak perlu useEffect waterfall
  const settings = initialSettings;
  const items = initialItems;



  const isStoreOpen = () => {
    return settings.is_open;
  };

  const terlarisItems = items.filter((item) => item.badge === 'terlaris');
  const popularMenus = terlarisItems.length > 0
    ? terlarisItems.slice(0, 6)
    : items.slice(0, 6);

  const vis = (settings as any)?.sections_visibility || (settings as any)?.sectionsVisibility || {};
  const showBadgeStrip = vis.showBadgeStrip !== false;
  const showPopularMenu = vis.showPopularMenu !== false;
  const showValueProps = vis.showValueProps !== false;
  const showOrderSteps = vis.showOrderSteps !== false;
  const showTestimonials = vis.showTestimonials !== false;
  const showLocation = vis.showLocation !== false;
  const showCtaFooter = vis.showCtaFooter !== false;

  const primaryColor = (settings as any)?.primary_color || (settings as any)?.primaryColor || "#8E0E0E";
  const secondaryColor = (settings as any)?.secondary_color || (settings as any)?.secondaryColor || "#E05009";
  const heroHighlightTitle = (settings as any)?.hero_highlight_title || (settings as any)?.heroHighlightTitle || settings.store_name || "Kualitas Rasa Juara";

  const heroTitleSizeKey = (settings as any)?.hero_title_size || (settings as any)?.heroTitleSize || "md";
  const heroTitleSizeClasses: Record<string, string> = {
    sm: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
    md: "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
    lg: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl",
    xl: "text-5xl sm:text-6xl md:text-7xl lg:text-8xl",
  };
  const heroTitleClass = heroTitleSizeClasses[heroTitleSizeKey] || heroTitleSizeClasses.md;

  const heroSubtitleSizeKey = (settings as any)?.hero_subtitle_size || (settings as any)?.heroSubtitleSize || "md";
  const heroSubtitleSizeClasses: Record<string, string> = {
    sm: "text-sm sm:text-base",
    md: "text-base sm:text-lg md:text-xl",
    lg: "text-lg sm:text-xl md:text-2xl",
  };
  const heroSubtitleClass = heroSubtitleSizeClasses[heroSubtitleSizeKey] || heroSubtitleSizeClasses.md;

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a0303] via-[#4d0909] to-[#8E0E0E]">
        {/* Background - desktop & mobile with high priority Image and smooth transition */}
        {settings.hero_banner_url ? (
          <div className="absolute inset-0">
            <img
              src={settings.hero_banner_url}
              alt={settings.store_name || "Hero Banner"}
              className="w-full h-full object-cover object-center transition-opacity duration-700"
              fetchPriority="high"
            />
          </div>
        ) : (
          <>
            {/* Background - desktop default */}
            <div className="absolute inset-0 hidden md:block">
              <Image
                src="/assets/banner_red.png"
                alt={settings.store_name || "Hero Banner"}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center transition-opacity duration-700"
              />
            </div>
            {/* Background - mobile default */}
            <div className="absolute inset-0 md:hidden">
              <Image
                src="/assets/banner_redm.png"
                alt={settings.store_name || "Hero Banner"}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center transition-opacity duration-700"
              />
            </div>
          </>
        )}
        {/* Overlay gradient - warm dark tone that blends perfectly with brand palette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/35 to-[#1a0303]/90 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20 pb-16">
          {settings.hero_badge_text && (
            <span className="inline-block bg-white/20 backdrop-blur-md text-white font-bold text-xs sm:text-sm px-4 py-1.5 rounded-full mb-4 border border-white/30 tracking-wider uppercase shadow-lg">
              {settings.hero_badge_text}
            </span>
          )}
          <h1 className={`${heroTitleClass} font-black text-white leading-tight mb-4 whitespace-pre-line`}>
            {settings.hero_title ? (
              <>
                {settings.hero_title}<br />
                <span style={{ color: secondaryColor }}>{heroHighlightTitle}</span>
              </>
            ) : (
              <>
                Selamat Datang di<br />
                <span style={{ color: secondaryColor }}>{heroHighlightTitle}</span>
              </>
            )}
          </h1>
          <p className={`text-white/90 ${heroSubtitleClass} mb-8 max-w-2xl mx-auto leading-relaxed`}>
            {settings.hero_subtitle || "Cita rasa otentik dan sajian berkualitas tinggi. Dibuat dengan bahan pilihan dan disajikan dengan dedikasi terbaik untuk Anda."}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/menu"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-white font-bold text-base rounded-2xl hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-xl"
              style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
            >
              Pesan Sekarang <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Halo ${settings.store_name}, saya ingin bertanya tentang menu.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold text-base rounded-2xl hover:bg-white/20 transition-all duration-200 border border-white/30 shadow-xl"
            >
              <MessageSquare className="w-5 h-5" /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== BADGES / FEATURES STRIP (Pure text badges for max flexibility) ===== */}
      {showBadgeStrip && (
        <section className="py-4 text-white" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
              {(settings?.badge_strip_items && Array.isArray(settings.badge_strip_items) && settings.badge_strip_items.length > 0
                ? settings.badge_strip_items
                : ["Kualitas Premium", "Halal Certified", "4.9 Rating", "Delivery & Pickup", "Gerai Resmi"]
              ).map((badgeText: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-white text-sm font-semibold">
                  <span>{badgeText}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== MENU HIGHLIGHT ===== */}
      {showPopularMenu && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block font-semibold text-sm mb-2 tracking-wider uppercase" style={{ color: secondaryColor }}>Menu Favorit</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Menu <span style={{ color: primaryColor }}>Terlaris</span>
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-base">
                {(settings as any)?.popular_menu_subtitle || "Pilihan favorit pelanggan setia kami. Dibuat fresh setiap hari dengan bahan berkualitas."}
              </p>
            </div>

            {popularMenus && popularMenus.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {popularMenus.map((item) => (
                  <MenuCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto border border-gray-100 shadow-sm flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 bg-gray-100/80 shadow-inner">
                  <UtensilsCrossed className="w-8 h-8" style={{ color: secondaryColor }} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Menu sedang dipersiapkan</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 max-w-md">
                  Daftar menu lezat kami sedang diperbarui oleh tim dapur gerai. Silakan cek kembali dalam waktu dekat atau pesan langsung via WhatsApp!
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">✨ Fresh Everyday</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">🍲 Bahan Pilihan</span>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">👨‍🍳 Chef Dedikasi</span>
                </div>
              </div>
            )}

            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-8 py-4 text-white font-bold text-base rounded-2xl hover:opacity-90 transition-all duration-200 hover:scale-105 shadow-lg"
                style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}
              >
                Lihat Semua Menu <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== VALUE PROPOSITIONS ===== */}
      {showValueProps && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block font-semibold text-sm mb-2 tracking-wider uppercase" style={{ color: secondaryColor }}>Keunggulan Kami</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Kenapa Memilih <span style={{ color: primaryColor }}>{settings.store_name}</span>?
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {(settings.value_props && settings.value_props.length > 0 ? settings.value_props : defaultValuePropositions).map((vp: any, index: number) => (
                <div
                  key={index}
                  className="p-6 rounded-3xl border border-gray-100 hover:border-gray-200 transition-all duration-300 hover:shadow-lg flex flex-col items-center text-center group bg-white"
                >
                  <div className="w-14 h-14 rounded-2xl text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
                    {vp.isImg || (typeof vp.icon === 'string' && vp.icon.includes('/')) ? (
                      <img src={vp.icon} alt={vp.title} className="w-8 h-8 object-contain" onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }} />
                    ) : vp.icon === 'BadgePercent' ? (
                      <BadgePercent className="w-7 h-7" />
                    ) : vp.icon === 'Zap' ? (
                      <Zap className="w-7 h-7" />
                    ) : (
                      <Award className="w-7 h-7" />
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{vp.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{vp.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CARA ORDER (Format 1 Baris Rapi) ===== */}
      {showOrderSteps && (
        <section className="py-16 sm:py-20 text-white" style={{ background: `linear-gradient(to bottom right, ${primaryColor}, ${secondaryColor})` }}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-white/70 font-semibold text-sm mb-2 tracking-wider uppercase">Simple & Mudah</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Cara Order di {settings.store_name}
              </h2>
              <p className="text-white/90 text-base max-w-xl mx-auto whitespace-normal sm:whitespace-nowrap">
                Hanya 3 langkah mudah untuk menikmati menu favorit pilihan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
              {(settings.order_steps && settings.order_steps.length > 0 ? settings.order_steps : defaultOrderSteps).map((step: any, index: number) => (
                <div
                  key={step.step || index}
                  className="text-center relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-black text-xl mb-4 shadow-lg" style={{ color: primaryColor }}>
                    {step.step || `0${index + 1}`}
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                  <p className="text-white/80 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl"
                style={{ color: primaryColor }}
              >
                Mulai Pesan Sekarang
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== TESTIMONIALS (Dynamic) ===== */}
      {showTestimonials && settings.testimonials && settings.testimonials.length > 0 && (
        <section className="py-16 sm:py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Review Pelanggan</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
                Kata <span className="text-[#8E0E0E]">Mereka</span>
              </h2>
              <div className="flex items-center justify-center gap-1 text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <p className="text-gray-500 text-sm">Ulasan dari pelanggan setia kami</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {settings.testimonials.map((t: any, idx: number) => (
                <div key={(t as any).id || t.name || idx} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                    {t.location && (
                      <p className="text-gray-400 text-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {t.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== LOCATION PREVIEW ===== */}
      {showLocation && (
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Temukan Kami</span>
                <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                  Lokasi <span className="text-[#8E0E0E]">{settings.store_name}</span>
                </h2>
                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-[#8E0E0E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Alamat</p>
                      <p className="text-gray-500 text-sm whitespace-pre-line">{settings.store_address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#8E0E0E]" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Jam Operasional</p>
                      <p className="text-gray-500 text-sm">{settings.opening_hours}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Status Hari Ini</p>
                      {isStoreOpen() ? (
                        <p className="text-green-600 font-semibold text-sm">BUKA SEKARANG</p>
                      ) : (
                        <p className="text-red-600 font-semibold text-sm">SEDANG TUTUP</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/contact"
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-semibold rounded-xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all"
                  >
                    <MapPin className="w-4 h-4" /> Lihat Peta
                  </Link>
                  <a
                    href={`https://wa.me/${settings.whatsapp_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-all"
                  >
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl h-80 bg-gray-100">
                <iframe
                  src={settings.google_maps_url || `https://maps.google.com/maps?q=${encodeURIComponent(settings.store_address || settings.store_name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none rounded-2xl" />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===== CTA FOOTER ===== */}
      {showCtaFooter && (
        <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1a0a0a] to-[#2d0505]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {(settings as any)?.cta_title || "Siap Pesan Sekarang?"}
            </h2>
            <p className="text-gray-300 mb-8 text-lg whitespace-pre-line">
              {(settings as any)?.cta_subtitle || "Sajikan menu favorit pilihan Anda hangat dan diantar langsung ke tempat Anda.\nPesan sekarang!"}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold text-lg rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all duration-200 hover:scale-105 shadow-xl"
              >
                <ShoppingBag className="w-5 h-5" /> Lihat Menu
              </Link>
              <a
                href={`https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(`Halo ${settings.store_name}, saya ingin memesan menu.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl"
              >
                <MessageSquare className="w-5 h-5" /> Order via WhatsApp
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
