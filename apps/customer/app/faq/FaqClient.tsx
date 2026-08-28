"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, MessageSquare } from 'lucide-react';
type DbStoreSettings = any;

const defaultFaqData = [
  {
    label: 'Umum & Toko',
    items: [
      { q: 'Bagaimana jam operasional layanan?', a: 'Kami melayani pesanan sesuai jam operasional gerai yang tertera. Kami siap melayani makan di tempat (dine-in), bawa pulang (takeaway), dan pesan antar (delivery).' },
      { q: 'Apakah produk dijamin Halal dan Bersih?', a: 'Ya! Seluruh bahan baku dan proses pengolahan kami dipastikan 100% Halal, higienis, dan aman dikonsumsi seluruh keluarga.' },
      { q: 'Apakah bisa memesan untuk jumlah besar / acara?', a: 'Tentu bisa! Kami menyediakan layanan katering dan pemesanan jumlah banyak untuk acara kantor, rapat, pesta, maupun syukuran.' },
    ],
  },
  {
    label: 'Order & Pembayaran',
    items: [
      { q: 'Bagaimana cara pesan online di web?', a: 'Pilih menu favorit Anda → Tambah ke keranjang → Isi nama & nomor WhatsApp → Pilih metode bayar → Pesan Sekarang. Anda akan mendapatkan kode order untuk pelacakan real-time.' },
      { q: 'Apakah harus daftar akun terlebih dahulu?', a: 'Tidak perlu! Cukup isi nama dan nomor WhatsApp saja saat checkout. Cepat dan praktis tanpa ribet.' },
      { q: 'Metode pembayaran apa saja yang diterima?', a: 'Kami menerima QRIS (BCA, GoPay, OVO, ShopeePay, DANA), Transfer Bank, dan Tunai di Tempat (COD).' },
      { q: 'Bagaimana cara melacak status pesanan?', a: 'Kunjungi menu Lacak Pesanan dan masukkan kode order Anda untuk melihat perkembangan pesanan dari dapur hingga siap diambil.' },
    ],
  },
  {
    label: 'Pengiriman Delivery',
    items: [
      { q: 'Area mana saja yang dijangkau pengiriman?', a: 'Kami melayani delivery hingga radius 10 km dengan perhitungan ongkir otomatis sesuai zona jarak GPS.' },
      { q: 'Bisa pesan lewat WhatsApp langsung?', a: 'Tentu bisa! Klik tombol WhatsApp di pojok kanan bawah atau hubungi nomor resmi kami.' },
    ],
  },
];

export default function FaqClient() {
  const [openItems, setOpenItems] = useState<{ [key: string]: boolean }>({ '0-0': true });
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(() => {});
  }, []);

  const toggleItem = (key: string) => {
    setOpenItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // If owner added custom FAQs in CMS
  const customFaqs = settings?.faqs && settings.faqs.length > 0 ? settings.faqs : null;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
            <MessageSquare className="w-8 h-8" /> Tanya Jawab (FAQ)
          </h1>
          <p className="text-white/80">Jawaban cepat untuk pertanyaan yang sering diajukan pelanggan</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {customFaqs ? (
          <div className="space-y-4 mb-10">
            {customFaqs.map((faq: any, idx: number) => {
              const key = `custom-${idx}`;
              const isOpen = !!openItems[key];
              return (
                <div
                  key={faq.id || idx}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all"
                >
                  <button
                    onClick={() => toggleItem(key)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-bold text-gray-900 text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8 mb-10">
            {defaultFaqData.map((category: any, catIdx: number) => (
              <div key={catIdx}>
                <h3 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500" />
                  {category.label}
                </h3>
                <div className="space-y-3">
                  {category.items.map((item: any, itemIdx: number) => {
                    const key = `${catIdx}-${itemIdx}`;
                    const isOpen = !!openItems[key];
                    return (
                      <div
                        key={itemIdx}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 transition-all"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                        >
                          <span className="font-bold text-gray-900 text-sm sm:text-base">{item.q}</span>
                          <ChevronDown className={`w-5 h-5 text-orange-500 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isOpen && (
                          <div className="px-6 pb-4 pt-1 text-gray-600 text-sm leading-relaxed border-t border-gray-50">
                            {item.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* WhatsApp Support CTA */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white text-center shadow-lg">
          <h3 className="text-xl font-black mb-2">Punya Pertanyaan Lain?</h3>
          <p className="text-white/80 text-sm mb-4">
            Tim kami siap membantu menjawab pertanyaan Anda secara langsung via WhatsApp.
          </p>
          <a
            href={`https://wa.me/${settings?.whatsapp_number || '6287811123482'}?text=Halo%20Admin%2C%20saya%20ingin%20bertanya`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-700 font-bold rounded-xl hover:bg-gray-100 transition-colors shadow-md"
          >
            Chat Customer Service
          </a>
        </div>
      </div>
    </div>
  );
}
