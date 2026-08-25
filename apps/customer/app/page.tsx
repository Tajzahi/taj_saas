"use client";
import Link from 'next/link';

import { Star, MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Award, Truck, Zap, Search, FileText, ShoppingBag, MessageSquare, BadgePercent } from 'lucide-react';
import { menuItems as staticMenuItems, popularMenuSlugs, MenuItem } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { useEffect, useState } from 'react';
import { getStoreSettings, getMenuItems, DbStoreSettings } from '@/lib/db/menuService';

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

export default function Home() {
  const [settings, setSettings] = useState<DbStoreSettings>({
    id: '1',
    store_name: '',
    is_open: true,
    whatsapp_number: '',
    flat_delivery_fee: 10000,
    minimum_order_amount: 0,
    store_address: '',
    google_maps_url: '',
    opening_hours: '',
    qris_image_url: '/qris.png',
    bank_info: '',
    hero_banner_url: '',
    outlet_lat: -7.2432537,
    outlet_lng: 112.7206275,
  });
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [fetchedSettings, fetchedItems] = await Promise.all([
          getStoreSettings(),
          getMenuItems()
        ]);
        setSettings(fetchedSettings);
        setItems(fetchedItems);
      } catch (err) {
        console.error('Gagal mengambil data dari database, menggunakan statis:', err);
      }
    }
    loadData();
  }, []);

  const isStoreOpen = () => {
    return settings.is_open;
  };

  const popularMenus = items.length > 0
    ? items.filter((item) => item.badge === 'terlaris').slice(0, 6)
    : popularMenuSlugs.map((slug) => staticMenuItems.find((i) => i.slug === slug)).filter(Boolean) as MenuItem[];

  return (
    <div className="min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background - desktop & mobile with dynamic fallback */}
        {settings.hero_banner_url ? (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
            style={{ backgroundImage: `url('${settings.hero_banner_url}')` }}
          />
        ) : (
          <>
            {/* Background - desktop default */}
            <div
              className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('/assets/banner_red.png')` }}
            />
            {/* Background - mobile default */}
            <div
              className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url('/assets/banner_redm.png')` }}
            />
          </>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 whitespace-pre-line">
            {settings.hero_title || (
              settings.store_name ? (
                <>
                  Selamat Datang di<br />
                  <span className="text-[#E05009]">{settings.store_name}</span>
                </>
              ) : (
                <>
                  Pilihan Menu Terbaik<br />
                  <span className="text-[#E05009]">Kualitas Rasa Juara</span>
                </>
              )
            )}
          </h1>

          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            {settings.hero_subtitle || 'Cita rasa otentik berkualitas tinggi. Dibuat dengan bahan pilihan dan disajikan dengan dedikasi terbaik.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/menu"
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] hover:from-[#9C1B0B] hover:to-[#D94708] text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-200 hover:scale-105"
            >
              Pesan Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=Halo%20A6%20Nyuss%2C%20saya%20ingin%20tanya%20menu`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 bg-white/20 backdrop-blur-sm border-2 border-white/40 text-white font-bold text-lg rounded-2xl hover:bg-white/30 transition-all duration-200"
            >
              <MessageSquare className="w-5 h-5" /> Chat WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ===== BRAND BADGE STRIP ===== */}
      <section className="bg-gradient-to-r from-[#8E0E0E] via-[#B72A0A] to-[#E05009] py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            {[
              { icon: 'Award', text: 'Sejak 2000' },
              { icon: '/Halal logo.jfif', text: 'Halal Certified', isImg: true },
              { icon: 'Star', text: '4.9 Rating' },
              { icon: 'Truck', text: 'Delivery & Pickup' },
              { icon: 'MapPin', text: 'Surabaya' },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-white text-sm font-semibold">
                {item.isImg ? (
                  <img src={item.icon} alt={item.text} className="w-5 h-5 object-contain rounded bg-white p-0.5" />
                ) : (
                  <span className="flex items-center">
                    {item.icon === 'Award' && <Award className="w-4 h-4" />}
                    {item.icon === 'Star' && <Star className="w-4 h-4 fill-white text-white" />}
                    {item.icon === 'Truck' && <Truck className="w-4 h-4" />}
                    {item.icon === 'MapPin' && <MapPin className="w-4 h-4" />}
                  </span>
                )}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MENU HIGHLIGHT ===== */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Menu Favorit</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-3">
              Menu <span className="text-[#8E0E0E]">Terlaris</span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Pilihan favorit pelanggan setia kami. Dibuat fresh setiap hari dengan bahan berkualitas.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {popularMenus.slice(0, 6).map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all duration-200 hover:scale-105 shadow-lg"
            >
              Lihat Semua Menu
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== WHY A6 NYUSS ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Keunggulan Kami</span>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
              Kenapa <span className="text-[#8E0E0E]">{settings.store_name}</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(settings.value_props && settings.value_props.length > 0 ? settings.value_props : defaultValuePropositions).map((vp) => (
              <div
                key={vp.title}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-[#8E0E0E]/5 to-transparent border border-[#8E0E0E]/10 hover:border-[#8E0E0E]/30 transition-all duration-200 hover:-translate-y-1 flex flex-col items-center"
              >
                <div className="flex justify-center mb-4">
                  {vp.isImg ? (
                    <img src={vp.icon} alt={vp.title} className="w-12 h-12 object-contain rounded-lg bg-white p-1" />
                  ) : (
                    <div className="text-[#E05009] p-3 bg-[#E05009]/10 rounded-2xl">
                      {vp.icon === 'Award' && <Award className="w-8 h-8" />}
                      {vp.icon === 'BadgePercent' && <BadgePercent className="w-8 h-8" />}
                      {vp.icon === 'Zap' && <Zap className="w-8 h-8" />}
                      {(!vp.icon || (vp.icon !== 'Award' && vp.icon !== 'BadgePercent' && vp.icon !== 'Zap')) && <Award className="w-8 h-8" />}
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{vp.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{vp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW TO ORDER ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="inline-block text-white/70 font-semibold text-sm mb-2 tracking-wider uppercase">Simple & Mudah</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Cara Order di {settings.store_name}
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Hanya 3 langkah mudah untuk menikmati menu favorit pilihan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {(settings.order_steps && settings.order_steps.length > 0 ? settings.order_steps : defaultOrderSteps).map((step, index) => (
              <div
                key={step.step || index}
                className="text-center relative z-10 flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white text-[#8E0E0E] flex items-center justify-center font-black text-xl mb-4 shadow-lg">
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
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#8E0E0E] font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all duration-200 hover:scale-105 shadow-xl"
            >
              Mulai Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS (Dynamic) ===== */}
      {settings.testimonials && settings.testimonials.length > 0 && (
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
              {settings.testimonials.map((t, idx) => (
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
                src={settings.google_maps_url || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid'}
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

      {/* ===== CTA FOOTER ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#1a0a0a] to-[#2d0505]">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            Siap Pesan <span className="text-[#E05009]">Sekarang</span>?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Martabak & terang bulan otentik siap dikirim atau diambil. Pesan sekarang, siap ~20 menit!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white font-bold text-lg rounded-2xl hover:from-[#9C1B0B] hover:to-[#D94708] transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" /> Lihat Menu
            </Link>
            <a
              href={`https://wa.me/${settings.whatsapp_number}?text=Halo%20A6%20Nyuss%2C%20saya%20mau%20pesan`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-10 py-4 bg-green-500 hover:bg-green-600 text-white font-bold text-lg rounded-2xl transition-all duration-200 hover:scale-105 shadow-xl"
            >
              <MessageSquare className="w-5 h-5" /> Order via WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
