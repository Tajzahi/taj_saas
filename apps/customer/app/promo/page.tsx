"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, Tag, AlertCircle, Gift, ShoppingBag, Sparkles, Moon, Award, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';

const promos = [
  {
    id: 1,
    icon: <Gift className="w-5 h-5 text-white" />,
    title: 'Anniversary A6 Nyuss!',
    desc: 'Rayakan 25 tahun A6 Nyuss! Dapatkan diskon 25% untuk semua menu Terang Bulan setiap hari Jumat selama bulan ini.',
    period: '1 – 31 Januari 2026',
    syarat: 'Berlaku untuk semua menu Terang Bulan. Minimum order Rp 50.000. Tidak berlaku bersamaan dengan promo lain.',
    badge: 'HOT',
    badgeCls: 'bg-orange-500',
    active: true,
    code: 'ANNIV25',
  },
  {
    id: 2,
    icon: <ShoppingBag className="w-5 h-5 text-white" />,
    title: 'Bundling Hemat Keluarga',
    desc: '2 Terang Bulan (pilihan) + 1 Martabak Telur (Ayam/Bebek) hanya Rp 85.000! Hemat lebih dari 20% dari harga normal.',
    period: 'Berlaku setiap hari',
    syarat: 'Harga sudah termasuk semua varian regular. Berlaku untuk pickup dan delivery.',
    badge: 'NEW',
    badgeCls: 'bg-blue-500',
    active: true,
    code: 'BUNDLING',
  },
  {
    id: 3,
    icon: <Sparkles className="w-5 h-5 text-white" />,
    title: 'Promo Grand Opening Web App',
    desc: 'Rayakan peluncuran web app A6 Nyuss! Order pertama via web dapat gratis 1 Es Teh Manis untuk setiap transaksi di atas Rp 40.000.',
    period: 'Edisi terbatas — sampai kuota habis',
    syarat: 'Berlaku untuk transaksi pertama via website. Minimum order Rp 40.000.',
    badge: 'SPECIAL',
    badgeCls: 'bg-purple-500',
    active: true,
    code: 'WEBAPPNEW',
  },
  {
    id: 4,
    icon: <Moon className="w-5 h-5 text-white" />,
    title: 'Promo Malam Mingguan',
    desc: 'Setiap Sabtu malam mulai jam 19:00, dapatkan diskon 15% untuk semua Terang Bulan. Cocok untuk nongkrong seru!',
    period: 'Setiap Sabtu, 19:00 – tutup',
    syarat: 'Berlaku untuk semua varian Terang Bulan. Tidak berlaku bersamaan dengan promo lain.',
    badge: 'MINGGUAN',
    badgeCls: 'bg-indigo-500',
    active: true,
    code: 'SATURDAY15',
  },
  {
    id: 5,
    icon: <Award className="w-5 h-5 text-white" />,
    title: 'Diskon Pelajar & Mahasiswa',
    desc: 'Tunjukkan kartu pelajar/mahasiswa dan dapatkan diskon 10% untuk semua menu. Berlaku setiap hari Senin–Jumat.',
    period: 'Senin–Jumat, jam operasional',
    syarat: 'Wajib menunjukkan kartu pelajar/mahasiswa yang masih aktif. Hanya untuk pickup.',
    badge: 'PELAJAR',
    badgeCls: 'bg-green-500',
    active: false,
    code: 'MATEB10',
  },
];

export default function Promo() {
  const router = useRouter();
  const activePromos = promos.filter(p => p.active);
  const inactivePromos = promos.filter(p => !p.active);

  const handleClaim = (promo: typeof promos[0]) => {
    if (promo.code === 'BUNDLING') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('menu_category_filter', 'paket-bundling');
      }
      toast.success('Silakan pilih paket bundling hemat kami! Harga sudah didiskon langsung.');
      router.push('/menu');
      return;
    }

    useCartStore.setState({ promoCode: promo.code });
    toast.success(`Kupon ${promo.code} berhasil diklaim!`);
    router.push('/menu');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <Ticket className="w-8 h-8" /> Promo & Special Offer
          </h1>
          <p className="text-white/80">Penawaran spesial hanya untuk pelanggan setia A6 Nyuss</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Active Promos */}
        <div className="mb-8">
          <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Promo Aktif
          </h2>
          <div className="space-y-4">
            {activePromos.map((promo) => (
              <div
                key={promo.id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="bg-gradient-to-r from-[#8E0E0E] to-[#E05009] px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{promo.icon}</span>
                    <h3 className="text-white font-bold text-base">{promo.title}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full text-white ${promo.badgeCls}`}>
                    {promo.badge}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-gray-700 mb-3 leading-relaxed">{promo.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[#8E0E0E] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{promo.period}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                    <Tag className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>S&K:</strong> {promo.syarat}</span>
                  </div>
                  <button
                    onClick={() => handleClaim(promo)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-semibold text-sm hover:from-[#9C1B0B] hover:to-[#D94708] transition-all cursor-pointer"
                  >
                    Klaim Promo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inactive / Coming Soon */}
        {inactivePromos.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-5 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-gray-400" />
              Promo Akan Datang
            </h2>
            <div className="space-y-3">
              {inactivePromos.map((promo) => (
                <div key={promo.id} className="bg-gray-100 rounded-2xl p-5 opacity-70">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl grayscale">{promo.icon}</span>
                    <h3 className="font-bold text-gray-600">{promo.title}</h3>
                    <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded-full ml-auto">Segera Hadir</span>
                  </div>
                  <p className="text-gray-500 text-sm">{promo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instagram CTA */}
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          <h3 className="text-xl font-black mb-2">Ikuti Kami di Instagram</h3>
          <p className="text-white/80 text-sm mb-4">
            Jangan sampai ketinggalan promo terbaru! Follow <strong>@a6nyuss</strong> untuk update harian dan flash sale eksklusif.
          </p>
          <a
            href="https://www.instagram.com/a6nyusss"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Follow @a6nyuss
          </a>
        </div>
      </div>
    </div>
  );
}
