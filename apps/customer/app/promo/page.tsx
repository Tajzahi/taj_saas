"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Tag, AlertCircle, Gift, ShoppingBag, Sparkles, Moon, Award, Ticket } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import toast from 'react-hot-toast';
import { getStorePromos } from '@/lib/db/menuService';
import { formatPrice } from '@/data/menu';

const defaultStaticPromos = [
  {
    id: "1",
    icon: "🎁",
    title: 'Diskon Spesial Pengguna Baru',
    desc: 'Nikmati potongan harga spesial hingga 20% untuk seluruh pilihan menu favorit Anda.',
    period: 'Berlaku s.d akhir bulan',
    syarat: 'Berlaku untuk semua menu. Minimum order Rp 30.000.',
    badge: 'HOT',
    badgeCls: 'bg-orange-500',
    active: true,
    code: 'HEMAT20',
  },
  {
    id: "2",
    icon: "🛍️",
    title: 'Bundling Hemat Keluarga',
    desc: '2 Terang Bulan + 1 Martabak Telur hanya Rp 85.000! Hemat lebih dari 20% dari harga normal.',
    period: 'Berlaku setiap hari',
    syarat: 'Harga sudah termasuk varian regular. Berlaku untuk pickup dan delivery.',
    badge: 'NEW',
    badgeCls: 'bg-blue-500',
    active: true,
    code: 'BUNDLING',
  },
  {
    id: "3",
    icon: "✨",
    title: 'Promo Grand Opening Web App',
    desc: 'Rayakan peluncuran web app! Order via web dapat gratis bonus spesial untuk transaksi di atas Rp 40.000.',
    period: 'Edisi terbatas',
    syarat: 'Berlaku untuk transaksi via website. Minimum order Rp 40.000.',
    badge: 'SPECIAL',
    badgeCls: 'bg-purple-500',
    active: true,
    code: 'WEBAPPNEW',
  },
];

export default function Promo() {
  const router = useRouter();
  const [promos, setPromos] = useState<any[]>(defaultStaticPromos);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStorePromos().then(dbPromos => {
      if (dbPromos && dbPromos.length > 0) {
        const mapped = dbPromos.map(p => ({
          id: p.id,
          icon: p.type === 'percent' ? '🏷️' : '💰',
          title: `Diskon Promo ${p.code}`,
          desc: p.type === 'percent' 
            ? `Dapatkan potongan harga sebesar ${p.value}% untuk pesanan Anda!`
            : `Dapatkan potongan harga langsung sebesar ${formatPrice(p.value)}!`,
          period: p.expiresAt 
            ? `Berlaku s.d ${new Date(p.expiresAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
            : 'Berlaku setiap hari',
          syarat: Number(p.minOrder) > 0 
            ? `Minimal transaksi belanja ${formatPrice(p.minOrder)}.`
            : 'Tanpa minimum belanja.',
          badge: p.type === 'percent' ? `${p.value}% OFF` : 'POTONGAN RP',
          badgeCls: 'bg-orange-500',
          active: p.isActive,
          code: p.code,
        }));
        setPromos(mapped);
      }
      setLoading(false);
    });
  }, []);

  const activePromos = promos.filter(p => p.active);
  const inactivePromos = promos.filter(p => !p.active);

  const handleClaim = (promo: any) => {
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
            <Ticket className="w-8 h-8" /> Promo & Kupon Diskon
          </h1>
          <p className="text-white/80">Penawaran spesial dan potongan harga khusus untuk pelanggan setia</p>
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
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-orange-100"
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
                  <p className="text-gray-700 mb-3 leading-relaxed font-medium">{promo.desc}</p>
                  <div className="flex items-center gap-2 text-sm text-[#8E0E0E] mb-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">{promo.period}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 rounded-xl p-3">
                    <Tag className="w-4 h-4 flex-shrink-0 mt-0.5 text-orange-500" />
                    <span><strong>S&K:</strong> {promo.syarat}</span>
                  </div>
                  <button
                    onClick={() => handleClaim(promo)}
                    className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-semibold text-sm hover:from-[#9C1B0B] hover:to-[#D94708] transition-all cursor-pointer shadow-md shadow-orange-500/20"
                  >
                    Klaim Kupon: {promo.code}
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
        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl p-6 text-white text-center shadow-lg">
          <svg className="w-12 h-12 mx-auto mb-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          <h3 className="text-xl font-black mb-2">Ikuti Kami di Instagram</h3>
          <p className="text-white/80 text-sm mb-4">
            Jangan sampai ketinggalan promo terbaru! Follow akun resmi kami untuk update harian dan flash sale eksklusif.
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
