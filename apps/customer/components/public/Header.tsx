"use client";
'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, PhoneCall, MapPin } from 'lucide-react';
import useCart from '@/hooks/useCart';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const getCartTotalCount = useCart((state) => state.getCartTotalCount);
  const cartItemCount = getCartTotalCount();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <Image
            src="/logo_icon.svg"
            alt="Logo A6 Nyuss"
            width={40}
            height={40}
            className="h-10 w-10 object-contain shadow-sm"
          />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold leading-none tracking-tight text-foreground sm:text-xl">
              Martabak Terbul <span className="text-primary font-extrabold">A6 Nyuss</span>
            </h1>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">
              Est. 2000 • Premium Quality
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <a
            href="#location"
            className="hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
          >
            <Image src="/google-maps.svg" width={14} height={14} alt="Map" className="h-3.5 w-3.5 object-contain" />
            Lokasi Kami
          </a>
          <a
            href="https://wa.me/6287811123482"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground md:flex"
          >
            <Image src="/whatsapp.svg" width={14} height={14} alt="WA" className="h-3.5 w-3.5 object-contain" />
            Hubungi Kami
          </a>

          {/* Cart Trigger */}
          <button
            onClick={onCartClick}
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-muted text-foreground transition-all hover:bg-primary hover:text-primary-foreground focus:outline-none"
            aria-label="Keranjang Belanja"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground text-[10px] font-bold shadow-md animate-pulse">
                {cartItemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
