"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Mail, Phone, CheckCircle } from 'lucide-react';
import { getStoreSettings, DbStoreSettings } from '@/lib/db/menuService';

export default function Contact() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  useEffect(() => {
    getStoreSettings().then(res => setSettings(res)).catch(() => {});
  }, []);

  const getCurrentStatus = () => {
    if (settings && typeof settings.is_open === 'boolean') {
      return {
        open: settings.is_open,
        label: settings.is_open ? 'BUKA SEKARANG' : 'SEDANG TUTUP',
        info: settings.opening_hours || (settings.is_open ? 'Tutup jam 01:00' : 'Buka kembali pukul 17:00'),
      };
    }
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes;

    // Open from 17:00 to 01:00
    const isOpen = time >= 1020 || time < 60;

    if (isOpen) {
      return { open: true, label: 'BUKA SEKARANG', info: 'Tutup jam 01:00' };
    }
    return { open: false, label: 'SEDANG TUTUP', info: 'Buka kembali pukul 17:00' };
  };

  const status = getCurrentStatus();

  const brandName = settings?.store_name || "Toko Kami";
  const address = settings?.store_address || "";
  const whatsapp = settings?.whatsapp_number || "";
  const hours = settings?.opening_hours || "";

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">Lokasi & Kontak</h1>
          <p className="text-white/80">Temukan kami atau hubungi langsung — kami selalu siap melayani!</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Status Banner */}
        <div className={`flex items-center gap-3 p-4 rounded-2xl mb-8 ${status.open ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`w-3 h-3 rounded-full flex-shrink-0 animate-pulse ${status.open ? 'bg-green-500' : 'bg-red-500'}`} />
          <div>
            <p className={`font-bold text-base ${status.open ? 'text-green-700' : 'text-red-700'}`}>
              {status.label}
            </p>
            <p className={`text-sm ${status.open ? 'text-green-600' : 'text-red-600'}`}>{status.info}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid"
              width="100%"
              height="320"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="p-4">
              <a
                href="https://maps.google.com/?q=Martabak+%26+Terang+Bulan+A6+Nyuss"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-[#8E0E0E] hover:bg-[#9C1B0B] text-white rounded-xl font-semibold text-sm transition-colors"
              >
                <MapPin className="w-4 h-4" /> Buka di Google Maps
              </a>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-5">
            {/* Address */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-[#8E0E0E]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 mb-1">Alamat</p>
                  <div className="text-gray-600 text-sm leading-relaxed">
                    <p>{address}</p>
                    <p className="text-gray-400 text-xs mt-0.5 font-medium">Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-[#8E0E0E]" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 mb-2">Jam Operasional</p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Jadwal Operasional</span>
                      <span className="font-semibold text-gray-900">{hours}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}?text=Halo%20${encodeURIComponent(brandName)}%2C%20saya%20ingin%20bertanya`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl p-4 hover:bg-green-100 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">WhatsApp Resmi</p>
                <p className="text-green-700 font-semibold">{whatsapp}</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Chat →</span>
            </a>

            {/* Email */}
            <a
              href="mailto:martabaka6nyusss@gmail.com"
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#8E0E0E]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Email</p>
                <p className="text-[#8E0E0E] font-medium text-sm">martabaka6nyusss@gmail.com</p>
              </div>
            </a>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-bold text-gray-900 mb-3">Ikuti Kami di Sosial Media</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { 
                    platform: 'Instagram', 
                    handle: '@a6nyuss', 
                    icon: <img src="/instagram.svg" className="w-5 h-5 flex-shrink-0 object-contain" alt="Instagram" />, 
                    link: 'https://www.instagram.com/a6nyusss' 
                  },
                  { 
                    platform: 'TikTok', 
                    handle: `@${brandName ? brandName.toLowerCase().replace(/\s+/g, '') : 'official'}`, 
                    icon: <svg className="w-5 h-5 text-black dark:text-white flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z"/></svg>, 
                    link: 'https://tiktok.com' 
                  },
                  { 
                    platform: 'Facebook', 
                    handle: brandName || 'Official Page', 
                    icon: <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, 
                    link: 'https://facebook.com' 
                  },
                  { 
                    platform: 'YouTube', 
                    handle: brandName || 'Official Channel', 
                    icon: <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>, 
                    link: 'https://youtube.com' 
                  },
                ].map((s) => (
                  <a
                    key={s.platform}
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 bg-gray-50 dark:bg-stone-850 rounded-xl hover:bg-[#8E0E0E]/5 transition-colors"
                  >
                    {s.icon}
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{s.platform}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{s.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Halal Certification */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <img src="/Halal logo.jfif" alt="Halal Certified" className="w-12 h-12 object-contain flex-shrink-0 rounded-lg" />
          <div>
            <p className="font-bold text-green-800">Bersertifikat Halal</p>
            <p className="text-green-700 text-sm">Seluruh bahan baku dan proses pembuatan produk {brandName} telah dipastikan halal dan higienis. Aman untuk seluruh keluarga.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
