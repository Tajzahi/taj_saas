"use client";

import React, { useState, useEffect } from 'react';
import { CheckCircle, Send, Package, Truck, DollarSign, MessageSquare, Star } from 'lucide-react';
import toast from 'react-hot-toast';
type DbStoreSettings = any;
import { formatPrice } from '@/data/menu';

const defaultPackages = [
  {
    name: 'Paket Acara Kecil',
    quantity: '10–15 Porsi',
    price: 'Rp 450.000',
    priceNote: 'Rp 30.000/porsi',
    items: ['Pilihan Menu Signature Pilihan', 'Termasuk Packaging Rapi & Higienis', 'Free Kartu Ucapan / Label Acara'],
    highlight: false,
  },
  {
    name: 'Paket Gathering Kantor',
    quantity: '20–30 Porsi',
    price: 'Rp 850.000',
    priceNote: 'Rp 28.000/porsi',
    items: ['Aneka Pilihan Menu Utama & Minuman', 'Packaging Premium Khusus Rapat / Event', 'Pengiriman Tepat Waktu ke Lokasi'],
    highlight: true,
  },
  {
    name: 'Paket Pesta & Syukuran',
    quantity: '50+ Porsi',
    price: 'Rp 1.500.000',
    priceNote: 'Rp 25.000/porsi',
    items: ['Kustomisasi Menu Penuh Sesuai Permintaan', 'Penyajian & Perlengkapan Lengkap', 'Diskon Khusus Volume Besar'],
    highlight: false,
  },
];

export default function CateringClient() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);
  const [form, setForm] = useState({
    name: '',
    company: '',
    phone: '',
    quantity: '',
    date: '',
    event: '',
    note: '',
  });

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(() => {});
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.quantity || !form.date) {
      toast.error('Mohon lengkapi data yang diperlukan!');
      return;
    }
    const msg = `Halo Admin! Saya ingin inquiry pesanan katering:%0A%0A` +
      `Nama: ${form.name}%0A` +
      `Perusahaan/Instansi: ${form.company || '-'}%0A` +
      `No. HP: ${form.phone}%0A` +
      `Jumlah Box: ${form.quantity}%0A` +
      `Tanggal Acara: ${form.date}%0A` +
      `Jenis Acara: ${form.event || '-'}%0A` +
      `Catatan: ${form.note || '-'}`;

    const waNum = settings?.whatsapp_number || '6287811123482';
    window.open(`https://wa.me/${waNum}?text=${msg}`, '_blank');
    toast.success('Membuka WhatsApp untuk konfirmasi pesanan katering...');
  };

  // Custom packages from CMS or fallback
  const customPkgs = settings?.catering_packages && settings.catering_packages.length > 0 
    ? settings.catering_packages.map((cp: any, idx: number) => ({
        name: cp.name,
        quantity: `Min. ${cp.minPortion} Porsi`,
        price: formatPrice(cp.pricePerPortion * cp.minPortion),
        priceNote: `${formatPrice(cp.pricePerPortion)}/porsi`,
        items: [cp.description],
        highlight: idx === 0,
      }))
    : defaultPackages;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <Package className="w-8 h-8" /> Paket Katering & Pesanan Besar
          </h1>
          <p className="text-white/80">Solusi lezat dan hemat untuk acara keluarga, kantor, arisan, dan pesta</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {customPkgs.map((pkg: any, idx: number) => (
            <div
              key={idx}
              className={`bg-white rounded-2xl p-6 shadow-sm border flex flex-col justify-between transition-all hover:shadow-md ${
                pkg.highlight ? 'border-orange-500 ring-2 ring-orange-500/20' : 'border-gray-200'
              }`}
            >
              <div>
                {pkg.highlight && (
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-orange-500 text-white rounded-full inline-block mb-2">
                    PALING POPULER
                  </span>
                )}
                <h3 className="text-lg font-bold text-gray-900 mb-1">{pkg.name}</h3>
                <p className="text-xs text-gray-500 mb-3">{pkg.quantity}</p>
                <div className="mb-4">
                  <span className="text-2xl font-black text-[#8E0E0E]">{pkg.price}</span>
                  <span className="text-xs text-gray-400 block">{pkg.priceNote}</span>
                </div>
                <ul className="space-y-2 text-xs text-gray-600 mb-6">
                  {pkg.items.map((item: any, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setForm(prev => ({ ...prev, quantity: pkg.quantity, note: `Pilihan Paket: ${pkg.name}` }));
                  const formEl = document.getElementById('catering-form');
                  if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold rounded-xl text-xs transition-colors cursor-pointer text-center"
              >
                Pilih Paket Ini
              </button>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div id="catering-form" className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Form Pemesanan Katering</h2>
          <p className="text-xs text-gray-500 mb-6">Isi formulir di bawah ini dan kami akan segera menghubungi Anda untuk kalkulasi dan konfirmasi jadwal.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Nama pemesan"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Nomor WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => handleChange('phone', e.target.value)}
                  placeholder="08123456789"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Perusahaan / Acara</label>
                <input
                  type="text"
                  value={form.company}
                  onChange={e => handleChange('company', e.target.value)}
                  placeholder="misal: Ulang Tahun / Rapat"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Jumlah Porsi / Box *</label>
                <input
                  type="text"
                  required
                  value={form.quantity}
                  onChange={e => handleChange('quantity', e.target.value)}
                  placeholder="misal: 30 Box"
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Tanggal Acara *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={e => handleChange('date', e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Catatan Tambahan</label>
              <textarea
                rows={3}
                value={form.note}
                onChange={e => handleChange('note', e.target.value)}
                placeholder="Preferensi menu khusus, jam pengiriman, alamat acara..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Kirim Permintaan Katering via WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
