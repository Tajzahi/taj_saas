"use client";
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Mail, Phone, CheckCircle, Navigation } from 'lucide-react';
type DbStoreSettings = any;

interface BranchInfo {
  id: string;
  name: string;
  shortName: string;
  area: string;
  address: string;
  landmark: string;
  hours: string;
  whatsapp: string;
  mapsUrl: string;
  embedUrl: string;
}

export default function ContactClient() {
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);
  const [selectedBranchId, setSelectedBranchId] = useState<string>('');

  useEffect(() => {
    fetch('/api/settings').then(res => res.json()).then(res => setSettings(res)).catch(() => {});
  }, []);

  const branches: BranchInfo[] = (settings?.branches && settings.branches.length > 0)
    ? settings.branches.map((b: any) => ({
        id: b.id,
        name: `Cabang ${b.name}${b.is_primary || b.isPrimary ? ' (Pusat)' : ''}`,
        shortName: `Cabang ${b.name}`,
        area: b.address.includes('Krembangan') ? 'Kec. Krembangan' : b.address.includes('Sawahan') ? 'Kec. Sawahan' : b.city || 'Surabaya',
        address: b.address,
        landmark: `Patokan: ${b.address.split(',')[0]}`,
        hours: b.operational_hours || b.operationalHours || '16:00 - 23:00 WIB',
        whatsapp: b.phone || settings?.whatsapp_number || '082230306801',
        mapsUrl: b.google_maps_url || b.googleMapsUrl || `https://maps.google.com/?q=${b.outlet_lat || -7.2432537},${b.outlet_lng || 112.7206275}`,
        embedUrl: (b.name || '').toLowerCase().includes('tidar')
          ? 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d494.7322038148574!2d112.7272232!3d-7.2570394!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f938db8f863d%3A0x74d6c39870f095d9!2sMartabak%20dan%20Terang%20Bulan%20a6%20nyuss!5e0!3m2!1sid!2sid!4v1790923894315!5m2!1sid!2sid'
          : 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
      }))
    : [
        {
          id: 'demak',
          name: 'Cabang Demak (Pusat)',
          shortName: 'Cabang Demak',
          area: 'Kec. Krembangan',
          address: 'Depan Mess DITPOLARIUD POLDA JATIM SURABAYA, Jl. Demak No.253, Dupak, Kec. Krembangan, Kota Surabaya, Jawa Timur 60179',
          landmark: 'Patokan: Depan Mess DITPOLARIUD POLDA JATIM SURABAYA',
          hours: '16:00 - 23:00 WIB',
          whatsapp: '082230306801',
          mapsUrl: 'https://maps.app.goo.gl/x96PqX7NpC8SWVzR7',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.9787806389904!2d112.72062749999999!3d-7.243253699999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f96790ef97d9%3A0x4e9b27e564abc301!2sMartabak%20%26%20Terang%20Bulan%20A6%20Nyuss!5e0!3m2!1sid!2sid!4v1780307482136!5m2!1sid!2sid',
        },
        {
          id: 'tidar',
          name: 'Cabang Tidar (Sawahan)',
          shortName: 'Cabang Tidar',
          area: 'Kec. Sawahan',
          address: 'Jl. Tidar No.81, Sawahan, Kec. Sawahan, Kota Surabaya, Jawa Timur 60251',
          landmark: 'Patokan: Jl. Tidar No.81, Sawahan, Surabaya',
          hours: '16:00 - 23:00 WIB',
          whatsapp: '082230306801',
          mapsUrl: 'https://maps.app.goo.gl/2tti83qFw8aDaWibA',
          embedUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d494.7322038148574!2d112.7272232!3d-7.2570394!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7f938db8f863d%3A0x74d6c39870f095d9!2sMartabak%20dan%20Terang%20Bulan%20a6%20nyuss!5e0!3m2!1sid!2sid!4v1790923894315!5m2!1sid!2sid',
        },
      ];

  const activeBranch = branches.find(b => b.id === selectedBranchId) || branches[0];

  const getCurrentStatus = () => {
    if (settings && typeof settings.is_open === 'boolean') {
      return {
        open: settings.is_open,
        label: settings.is_open ? 'BUKA SEKARANG' : 'SEDANG TUTUP',
        info: settings.opening_hours || (settings.is_open ? 'Tutup jam 23:00' : 'Buka kembali pukul 16:00'),
      };
    }
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const time = hours * 60 + minutes;

    // Open from 16:00 to 23:00 WIB (960 to 1380 minutes)
    const isOpen = time >= 960 && time <= 1380;

    if (isOpen) {
      return { open: true, label: 'BUKA SEKARANG', info: 'Tutup jam 23:00' };
    }
    return { open: false, label: 'SEDANG TUTUP', info: 'Buka kembali pukul 16:00' };
  };

  const status = getCurrentStatus();
  const brandName = settings?.store_name || "Martabak & Terang Bulan A6 Nyuss";
  const email = settings?.email || settings?.store_email || "martabaka6nyusss@gmail.com";
  const instagramRaw = settings?.social_links?.instagram || settings?.instagram || 'a6nyuss';
  const instagramHandle = instagramRaw.startsWith('@') ? instagramRaw : `@${instagramRaw}`;
  const instagramLink = instagramRaw.startsWith('http') ? instagramRaw : `https://instagram.com/${instagramRaw.replace(/^@/, '')}`;

  const facebookValue = settings?.social_links?.facebook || settings?.facebook || "Martabak Nyuss";
  const facebookHandle = facebookValue.startsWith('http') ? (brandName || 'Martabak Nyuss') : facebookValue;
  const facebookLink = facebookValue.startsWith('http') ? facebookValue : `https://facebook.com/search/top?q=${encodeURIComponent(facebookValue)}`;

  const tiktokRaw = settings?.social_links?.tiktok || settings?.tiktok || 'a6nyuss';
  const tiktokHandle = tiktokRaw.startsWith('@') ? tiktokRaw : `@${tiktokRaw}`;
  const tiktokLink = tiktokRaw.startsWith('http') ? tiktokRaw : `https://tiktok.com/${tiktokHandle}`;

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#8E0E0E] to-[#E05009] py-12 px-4">
        <div className="max-w-4xl mx-auto text-center sm:text-left">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
            Hubungi Kami
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Lokasi Cabang & Kontak Resmi</h1>
          <p className="text-white/80 mt-2 text-sm sm:text-base max-w-2xl">
            Nikmati Martabak Telur Daging Sapi & Terang Bulan Spesial A6 Nyuss di 2 gerai resmi Surabaya: <strong>Cabang Demak</strong> & <strong>Cabang Tidar</strong>.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
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
                {status.label} (Kedua Cabang)
              </p>
              <p className="text-xs text-gray-500">{status.info}</p>
            </div>
          </div>
          <Clock className={`w-5 h-5 ${status.open ? 'text-green-600' : 'text-red-500'}`} />
        </div>

        {/* Pemilih Cabang (Tab Switcher) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#8E0E0E]" />
              Pilih Cabang Surabaya
            </h2>
            <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2.5 py-1 rounded-full">
              2 Gerai Aktif
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 p-1.5 bg-gray-200/70 rounded-2xl">
            {branches.map((b) => {
              const isSelected = b.id === selectedBranchId;
              return (
                <button
                  key={b.id}
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold transition-all text-center flex flex-col items-center justify-center gap-0.5 ${
                    isSelected
                      ? 'bg-white text-[#8E0E0E] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                >
                  <span>{b.shortName}</span>
                  <span className={`text-[11px] font-medium ${isSelected ? 'text-orange-600' : 'text-gray-400'}`}>
                    {b.area}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Detail Cabang Terpilih + Peta */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <span className="inline-block bg-orange-100 text-orange-800 text-xs font-bold px-2.5 py-0.5 rounded-full mb-1">
                {activeBranch.area}
              </span>
              <h3 className="text-xl font-black text-gray-900">{activeBranch.name}</h3>
              <p className="text-sm text-gray-600 mt-1 leading-relaxed">{activeBranch.address}</p>
            </div>

            <div className="flex flex-wrap sm:flex-col gap-2 flex-shrink-0">
              <a
                href={`https://wa.me/${activeBranch.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${brandName} (${activeBranch.shortName}), saya ingin memesan menu`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <Phone className="w-4 h-4" />
                Chat WhatsApp Gerai
              </a>
              <a
                href={activeBranch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#8E0E0E]" />
                Petunjuk Arah Maps
              </a>
            </div>
          </div>

          {/* Embed Peta */}
          <div>
            <div className="rounded-xl overflow-hidden border border-gray-200 aspect-video w-full mb-3 shadow-inner bg-gray-100">
              <iframe
                src={activeBranch.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Peta Lokasi ${activeBranch.name}`}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <p>{activeBranch.landmark}</p>
              <a
                href={activeBranch.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#8E0E0E] hover:underline"
              >
                Buka di Aplikasi Google Maps →
              </a>
            </div>
          </div>
        </div>

        {/* Ringkasan Kontak Cepat Kedua Gerai */}
        <div className="grid sm:grid-cols-2 gap-4">
          {branches.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900 text-base">{b.name}</h4>
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    Buka 16:00 - 23:00
                  </span>
                </div>
                <p className="text-gray-600 text-xs leading-relaxed mb-3">{b.address}</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-semibold uppercase">WhatsApp Langsung</p>
                  <p className="text-sm font-bold text-gray-800">{b.whatsapp}</p>
                </div>
                <a
                  href={`https://wa.me/${b.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${brandName} ${b.shortName}, saya ingin pesan`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors"
                >
                  Chat →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Info Tambahan & Sosial Media */}
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
          >
            <div className="w-10 h-10 rounded-xl bg-[#8E0E0E]/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-[#8E0E0E]" />
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Email Resmi</p>
              <p className="text-[#8E0E0E] font-medium text-sm">{email}</p>
            </div>
          </a>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5 text-[#E05009]" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">Jam Buka Setiap Hari</p>
                <p className="text-gray-600 text-xs">Pukul 16:00 – 23:00 WIB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="font-bold text-gray-900 mb-3 text-sm">Ikuti Media Sosial & Peta Resmi Martabak A6 Nyuss</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {[
              {
                platform: 'Instagram',
                handle: instagramHandle,
                icon: <img src="/instagram.svg" className="w-5 h-5 flex-shrink-0 object-contain" alt="Instagram" />,
                link: instagramLink,
              },
              {
                platform: 'Facebook',
                handle: facebookHandle,
                icon: (
                  <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                ),
                link: facebookLink,
              },
              {
                platform: 'TikTok',
                handle: tiktokHandle,
                icon: (
                  <svg className="w-5 h-5 text-black flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.74a4.85 4.85 0 01-1.01-.05z" />
                  </svg>
                ),
                link: tiktokLink,
              },
              {
                platform: 'Maps Demak',
                handle: 'Cabang Demak',
                icon: <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />,
                link: 'https://maps.app.goo.gl/x96PqX7NpC8SWVzR7',
              },
              {
                platform: 'Maps Tidar',
                handle: 'Cabang Tidar',
                icon: <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" />,
                link: 'https://maps.app.goo.gl/2tti83qFw8aDaWibA',
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

        {/* Halal Certification */}
        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
          <img src="/Halal logo.jfif" alt="Halal Certified" className="w-12 h-12 object-contain flex-shrink-0 rounded-lg" />
          <div>
            <p className="font-bold text-green-800">100% Bersertifikat Halal</p>
            <p className="text-green-700 text-sm">
              Seluruh bahan baku dan proses pembuatan Martabak & Terang Bulan A6 Nyuss telah dipastikan halal, higienis, dan berkualitas prima untuk keluarga Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
