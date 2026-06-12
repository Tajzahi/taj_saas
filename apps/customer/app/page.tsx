"use client";
import Link from 'next/link';

import { Star, MapPin, Clock, CheckCircle, ArrowRight, ChevronRight, Award, Truck, Zap, Search, FileText, ShoppingBag, MessageSquare, BadgePercent } from 'lucide-react';
import { menuItems as staticMenuItems, popularMenuSlugs, MenuItem } from '@/data/menu';
import MenuCard from '@/components/MenuCard';
import { useEffect, useState } from 'react';
import { getStoreSettings, getMenuItems, DbStoreSettings } from '@/lib/db/menuService';

const testimonials = [
  { name: 'Budi S.', rating: 5, text: 'Udah langganan sejak 2010! Rasanya konsisten, martabak coklatnya paling enak se-Surabaya. Wajib coba!', location: 'Gubeng, Surabaya' },
  { name: 'Sari A.', rating: 5, text: 'Pesan online gampang banget, langsung dateng cepet. Terang bulannya lumer banget. Highly recommended!', location: 'Wonokromo, Surabaya' },
  { name: 'Rizky P.', rating: 5, text: 'Martabak telurnya juara! Isinya melimpah, tidak pelit. Harga juga sangat reasonable buat kualitas sebagus ini.', location: 'Rungkut, Surabaya' },
  { name: 'Dewi R.', rating: 5, text: 'Favoritku dari zaman kuliah sampai sekarang udah kerja. Tetap enak, tetap bersih, tetap ramah!', location: 'Kenjeran, Surabaya' },
];

const valuePropositions = [
  { icon: 'Award', title: '25 Tahun Pengalaman', desc: 'Sejak tahun 2000, kami konsisten menghadirkan rasa terbaik yang tidak pernah berubah.' },
  { icon: '/Halal logo.jfif', title: 'Bersertifikat Halal', desc: 'Semua bahan baku kami dipastikan halal dan berkualitas tinggi untuk ketenangan Anda.', isImg: true },
  { icon: 'BadgePercent', title: 'Tanpa Komisi Ojol', desc: 'Pesan langsung dari kami. Harga lebih hemat, kualitas tetap terjaga, layanan lebih personal.' },
  { icon: 'Zap', title: 'Proses Cepat', desc: 'Pickup siap dalam ~20 menit. Delivery langsung tanpa nunggu lama. Panas, segar, nikmat!' },
];

const orderSteps = [
  { step: '01', icon: 'Search', title: 'Pilih Menu', desc: 'Browse menu lengkap kami dan pilih favorit kamu' },
  { step: '02', icon: 'FileText', title: 'Isi Data & Checkout', desc: 'Masukkan nama dan nomor HP, pilih pickup atau delivery' },
  { step: '03', icon: 'ShoppingBag', title: 'Ambil / Diantar', desc: 'Pesanan siap dalam ~20 menit. Kami antar atau kamu pickup!' },
];

export default function Home() {
  const [settings, setSettings] = useState<DbStoreSettings>({
    id: '1',
    store_name: 'Martabak Terbul A6 Nyuss',
    is_open: true,
    whatsapp_number: '6287811123482',
    flat_delivery_fee: 10000,
    minimum_order_amount: 0,
    store_address: 'Jl. Demak No.253, Dupak, Kec. Krembangan, Surabaya, Jawa Timur 60179\nDepan Mess DITPOLARIUD POLDA JATIM SURABAYA.',
    google_maps_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
    opening_hours: 'Setiap Hari: 17:00 – 01:00'
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
        {/* Background - desktop */}
        <div
          className="absolute inset-0 hidden md:block bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/banner_red.png')` }}
        />
        {/* Background - mobile */}
        <div
          className="absolute inset-0 md:hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/banner_redm.png')` }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto pt-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
            Martabak &<br />
            <span className="text-[#E05009]">Terang Bulan</span>
            <br />A6 Nyuss
          </h1>

          <p className="text-white/90 text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed">
            Cita rasa otentik sejak 2000. Dibuat dengan bahan pilihan,
            disajikan dengan cinta dari Surabaya.
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
              Kenapa <span className="text-[#8E0E0E]">A6 Nyuss</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {valuePropositions.map((vp) => (
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
              Cara Order di A6 Nyuss
            </h2>
            <p className="text-white/80 max-w-md mx-auto">
              Hanya 3 langkah untuk menikmati martabak & terang bulan favorit kamu
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {orderSteps.map((step, index) => (
              <div key={step.step} className="text-center relative">
                {index < orderSteps.length - 1 && (
                  <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-white/30" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white mx-auto mb-4">
                  {step.icon === 'Search' && <Search className="w-8 h-8" />}
                  {step.icon === 'FileText' && <FileText className="w-8 h-8" />}
                  {step.icon === 'ShoppingBag' && <ShoppingBag className="w-8 h-8" />}
                </div>
                <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white/30 text-white text-xs font-bold mb-2">
                  {step.step}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-white/70 text-sm">{step.desc}</p>
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

      {/* ===== TESTIMONIALS ===== */}
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
            <p className="text-gray-500 text-sm">4.9/5 dari ratusan pelanggan setia</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {t.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION PREVIEW ===== */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-block text-[#E05009] font-semibold text-sm mb-2 tracking-wider uppercase">Temukan Kami</span>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4">
                Lokasi <span className="text-[#8E0E0E]">A6 Nyuss</span>
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
