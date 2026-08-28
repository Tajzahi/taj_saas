"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Mail, Phone, CheckCircle } from 'lucide-react';
type DbStoreSettings = any;

export default function ContactClient() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(res => setSettings(res)).catch(() => {});
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
  const email = settings?.email || settings?.store_email || "kontak@restoran.com";
  const instagramHandle = settings?.instagram ? (settings.instagram.startsWith('@') ? settings.instagram : `@${settings.instagram}`) : (brandName ? `@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}` : '@official');
  const instagramLink = settings?.instagram ? (settings.instagram.startsWith('http') ? settings.instagram : `https://instagram.com/${settings.instagram.replace(/^@/, '')}`) : 'https://instagram.com/';

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Lokasi & Kontak</h1>
          <p className="text-white/80 mt-1 text-sm">
            Temukan kami atau hubungi langsung — kami selalu siap melayani!
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* Status Toko Live */}
        <div className={`rounded-2xl p-5 border flex items-center justify-between shadow-sm ${
          status.open ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-center gap-3">
            <span className={`w-3 h-3 rounded-full animate-pulse ${
              status.open ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <div>
              <p className={`font-black text-sm ${status.open ? 'text-green-800' : 'text-red-800'}`}>
                {status.label}
              </p>
              <p className="text-xs text-gray-500">{status.info}</p>
            </div>
          </div>
          <Clock className={`w-5 h-5 ${status.open ? 'text-green-600' : 'text-red-500'}`} />
        </div>

        {/* Peta Lokasi */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-[#8E0E0E]" />
            <h2 className="text-lg font-black text-gray-900">Peta Lokasi</h2>
          </div>

          <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full mb-4">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Lokasi ${brandName}`}
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-gray-500">
              Patokan: Depan Mess DITPOLARIUD POLDA JATIM SURABAYA.
            </p>
            <a
              href="https://maps.google.com/?q=Martabak+%26+Terang+Bulan+A6+Nyuss"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-[#8E0E0E] hover:underline"
            >
              Buka di Google Maps →
            </a>
          </div>
        </div>

        {/* Info Kontak & Jam Buka */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-[#8E0E0E]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Alamat</p>
                <p className="text-gray-600 text-sm mt-0.5 leading-relaxed">
                  {address || "Depan Mess DITPOLARIUD POLDA JATIM SURABAYA."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#E05009]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Jam Operasional</p>
                <p className="text-gray-600 text-sm mt-0.5">
                  {hours || "Jadwal Operasional Resmi"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${brandName}, saya ingin bertanya`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between bg-green-50 border border-green-200 rounded-2xl p-4 hover:bg-green-100 transition-colors"
            >
              <div>
                <p className="font-bold text-gray-900 text-sm">WhatsApp Resmi</p>
                <p className="text-green-700 font-semibold">{whatsapp || "Hubungi WhatsApp"}</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Chat →</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#8E0E0E]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Email</p>
                <p className="text-[#8E0E0E] font-medium text-sm">{email}</p>
              </div>
            </a>

            {/* Social Media */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <p className="font-bold text-gray-900 mb-3">Ikuti Kami di Sosial Media</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { 
                    platform: 'Instagram', 
                    handle: instagramHandle, 
                    icon: <img src="/instagram.svg" className="w-5 h-5 flex-shrink-0 object-contain" alt="Instagram" />, 
                    link: instagramLink 
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
                    platform: 'G-Maps', 
                    handle: brandName || 'Rating & Ulasan', 
                    icon: <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />, 
                    link: 'https://maps.google.com' 
                  },
                ].map((item) => (
                  <a
                    key={item.platform}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors text-xs font-semibold text-gray-700"
                  >
                    {item.icon}
                    <div className="min-w-0">
                      <p className="text-[10px] text-gray-400 font-normal uppercase">{item.platform}</p>
                      <p className="truncate font-bold text-gray-800">{item.handle}</p>
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
