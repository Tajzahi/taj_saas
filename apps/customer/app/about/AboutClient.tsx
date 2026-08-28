"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Award, Sprout, Heart, Handshake } from 'lucide-react';
type DbStoreSettings = any;

const defaultValues = [
  { icon: Award, title: 'Kualitas Rasa', desc: 'Konsistensi rasa dan standar penyajian terbaik yang selalu kami jaga untuk setiap pelanggan.' },
  { icon: Sprout, title: 'Bahan Pilihan', desc: 'Kami hanya menggunakan bahan-bahan segar berkualitas tinggi demi kepuasan Anda.' },
  { icon: Heart, title: 'Penuh Dedikasi', desc: 'Setiap sajian disiapkan dengan dedikasi dan standar kebersihan yang ketat.' },
  { icon: Handshake, title: 'Pelayanan Ramah', desc: 'Kami selalu siap melayani dengan ramah untuk memberikan pengalaman terbaik bagi Anda.' },
];

export default function AboutClient() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(() => {});
  }, []);

  const title = settings?.about_title || (settings?.store_name ? `Tentang ${settings.store_name}` : "Tentang Kami");
  const story = settings?.about_story || "Komitmen kami adalah menyajikan produk dan hidangan kuliner terbaik dengan bahan baku pilihan berkualitas dan pelayanan yang ramah untuk seluruh pelanggan.";
  const highlights = settings?.about_highlights && settings.about_highlights.length > 0 
    ? settings.about_highlights 
    : ["100% Halal Certified", "Bahan Baku Fresh Berkualitas", "Pelayanan Ramah & Higienis", "Higienis & Terpercaya"];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-[#8E0E0E] via-[#A9240E] to-[#E05009] py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 border-4 border-white rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 border-4 border-white rounded-full" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium mb-6">
            <Award className="w-4 h-4" /> Kualitas & Cita Rasa Terbaik
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 whitespace-pre-line">
            {title}
          </h1>
          <p className="text-white/80 text-lg leading-relaxed">
            Perjalanan penuh dedikasi menyajikan sajian kuliner terbaik untuk Anda.
          </p>
        </div>
      </div>

      {/* Brand Story */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-12">
            <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Kisah Kami</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1 mb-4">{title}</h2>
            <div className="text-gray-600 leading-relaxed text-base space-y-4 whitespace-pre-line">
              <p>{story}</p>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-gray-100">
            {highlights.map((hl: string, i: number) => (
              <div key={i} className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
                <span className="text-2xl block mb-1">✨</span>
                <p className="text-xs font-bold text-gray-800">{hl}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Nilai-Nilai Kami</span>
            <h2 className="text-3xl font-black text-gray-900 mt-1">Yang Kami Percayai</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {defaultValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2">{val.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{val.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline (Dynamic if provided by Owner) */}
      {settings?.timeline && settings.timeline.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-[#E05009] font-semibold text-sm uppercase tracking-wider">Perjalanan Kami</span>
              <h2 className="text-3xl font-black text-gray-900 mt-1">Milestone Sejarah</h2>
            </div>
            <div className="space-y-6">
              {settings.timeline.map((item: any, idx: number) => (
                <div key={idx} className="flex gap-4 items-start">
                  <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] text-white font-black text-sm px-3 py-1.5 rounded-xl flex-shrink-0">
                    {item.year}
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 flex-1 border border-gray-100">
                    <h4 className="font-bold text-gray-900 text-sm mb-1">{item.event}</h4>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="py-12 bg-white text-center">
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-2xl font-bold shadow-lg shadow-orange-500/20 hover:scale-105 transition-all"
        >
          Lihat Menu & Pesan Sekarang <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
