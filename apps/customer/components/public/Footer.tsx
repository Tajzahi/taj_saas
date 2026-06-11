"use client";
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { StoreSettings } from '@/types/database.types';

interface FooterProps {
  settings: StoreSettings | null;
}

export function Footer({ settings }: FooterProps) {
  const storeName = settings?.store_name || 'Martabak Terbul A6 Nyuss';
  const whatsappNumber = settings?.whatsapp_number || '6287811123482';
  const storeAddress = settings?.store_address || 'Jl. Kebon Jeruk No. A6, Jakarta Barat';
  const openingHours = settings?.opening_hours || 'Setiap Hari: 16:00 - 23:00 WIB';

  return (
    <footer className="border-t border-border bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-primary font-bold text-sm shadow-sm">
                A6
              </span>
              <span className="text-lg font-bold tracking-tight">
                {storeName}
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Menghadirkan martabak manis & asin premium sejak tahun 2000. Dibuat dengan adonan lembut rahasia dan mentega premium.
            </p>
          </div>

          {/* Contact and Operational Hours */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Informasi Toko & Medsos
            </h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Image src="/clock.svg" width={16} height={16} alt="Clock" className="mt-0.5 h-4 w-4 shrink-0 object-contain" />
                <span>{openingHours}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Image src="/whatsapp.svg" width={16} height={16} alt="WhatsApp" className="mt-0.5 h-4 w-4 shrink-0 object-contain" />
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition"
                >
                  +{whatsappNumber} (WhatsApp)
                </a>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="pt-2 flex flex-col gap-2.5 text-xs text-muted-foreground">
              <a href="https://instagram.com/a6nyusss" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition flex items-center gap-2">
                <Image src="/instagram.svg" width={16} height={16} alt="Instagram" className="h-4 w-4 object-contain" />
                <span>Instagram: @a6nyusss</span>
              </a>
              <a href="https://facebook.com/MartabakNyuss" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition flex items-center gap-2">
                <Image src="/facebook.svg" width={16} height={16} alt="Facebook" className="h-4 w-4 object-contain" />
                <span>Facebook: Martabak Nyuss</span>
              </a>
              <a href="https://www.tiktok.com/@a6nyuss" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition flex items-center gap-2">
                <Image src="/tiktok.svg" width={16} height={16} alt="TikTok" className="h-4 w-4 object-contain" />
                <span>TikTok: @a6nyuss</span>
              </a>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4" id="location">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Lokasi Outlet
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-muted-foreground">
              <Image src="/google-maps.svg" width={16} height={16} alt="Map" className="mt-0.5 h-4 w-4 shrink-0 object-contain" />
              <span>{storeAddress}</span>
            </div>
            {settings?.google_maps_url && (
              <a
                href={settings.google_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs font-semibold text-primary hover:underline"
              >
                Buka di Google Maps &rarr;
              </a>
            )}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>&copy; {new Date().getFullYear()} {storeName}. Hak Cipta Dilindungi.</p>
          <p className="flex items-center gap-1">
            Dibuat dengan <Heart className="h-3 w-3 text-red-500 fill-red-500" /> untuk pecinta kuliner martabak.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
