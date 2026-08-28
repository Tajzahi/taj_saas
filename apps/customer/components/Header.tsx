"use client";
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
type DbStoreSettings = any;

export default function Header() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [eventOpen, setEventOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState<DbStoreSettings | null>(null);

  const totalItems = useCartStore((s) => s.getTotalItems());
  const location = usePathname();

  // Mark as mounted after first client render to avoid SSR/localStorage hydration mismatch
  useEffect(() => { 
    setMounted(true); 
    fetch('/api/settings').then(res => res.json()).then(setSettings).catch(console.error);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setEventOpen(false);
    setAboutOpen(false);
  }, [location]);

  const isHome = location === '/';
  const isWhiteHeader = !isHome || scrolled;
  const storeName = settings?.store_name || "";
  const tagline = (settings as any)?.tagline || "";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isWhiteHeader
            ? 'bg-white shadow-md border-b border-gray-100'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center text-white font-black text-lg shadow-sm overflow-hidden">
                {settings?.logo_url ? (
                  <img src={settings.logo_url} alt={storeName || 'Logo'} className="w-full h-full object-cover" />
                ) : (
                  <span>{storeName ? storeName.charAt(0).toUpperCase() : '🏪'}</span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className={`font-black text-base sm:text-lg tracking-wider leading-none uppercase ${isWhiteHeader ? 'text-[#8E0E0E]' : 'text-white'}`}>{storeName}</p>
                {tagline && <p className={`text-[8px] sm:text-[9px] tracking-widest leading-none font-black uppercase mt-1 ${isWhiteHeader ? 'text-gray-500' : 'text-white/80'}`}>{tagline}</p>}
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Home
              </Link>
              
              <Link
                href="/menu"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/menu'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Menu
              </Link>

              {/* Event Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setEventOpen(true)}
                onMouseLeave={() => setEventOpen(false)}
              >
                <button
                  onClick={() => setEventOpen(!eventOpen)}
                  className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] cursor-pointer ${
                    ['/promo', '/catering'].includes(location)
                      ? 'text-[#E05009]'
                      : isWhiteHeader
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}
                >
                  Event
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {eventOpen && (
                  <div className="absolute left-0 top-full pt-2 w-48 z-50">
                    <div className="rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 py-2">
                      <Link
                        href="/promo"
                        onClick={() => setEventOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/promo' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Promo
                      </Link>
                      <Link
                        href="/catering"
                        onClick={() => setEventOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/catering' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Catering
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <Link
                href="/gallery"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/gallery'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Gallery
              </Link>

              <Link
                href="/tracking"
                className={`text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] ${
                  location === '/tracking'
                    ? 'text-[#E05009]'
                    : isWhiteHeader
                    ? 'text-gray-700'
                    : 'text-white'
                }`}
              >
                Lacak Pesanan
              </Link>

              {/* Tentang Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setAboutOpen(true)}
                onMouseLeave={() => setAboutOpen(false)}
              >
                <button
                  onClick={() => setAboutOpen(!aboutOpen)}
                  className={`flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors hover:text-[#E05009] cursor-pointer ${
                    ['/about', '/contact', '/faq'].includes(location)
                      ? 'text-[#E05009]'
                      : isWhiteHeader
                      ? 'text-gray-700'
                      : 'text-white'
                  }`}
                >
                  Tentang
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {aboutOpen && (
                  <div className="absolute right-0 top-full pt-2 w-48 z-50">
                    <div className="rounded-xl bg-white text-gray-800 shadow-xl border border-gray-100 py-2">
                      <Link
                        href="/about"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/about' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Tentang Kami
                      </Link>
                      <Link
                        href="/contact"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/contact' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        Lokasi & Kontak
                      </Link>
                      <Link
                        href="/faq"
                        onClick={() => setAboutOpen(false)}
                        className={`block px-4 py-2 text-[11px] font-black uppercase tracking-wider hover:bg-[#8E0E0E]/5 hover:text-[#8E0E0E] transition-colors ${
                          location === '/faq' ? 'text-[#E05009]' : 'text-gray-700'
                        }`}
                      >
                        FAQ
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Cart + Mobile Menu */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  if (location === '/cart') {
                    router.back();
                  } else {
                    router.push('/cart');
                  }
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#E05009] hover:bg-[#D13E08] transition-colors cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 text-[#8E0E0E] text-xs font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              <button
                onClick={() => setMobileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-full"
              >
                <Menu className={`w-6 h-6 ${isWhiteHeader ? 'text-gray-700' : 'text-white'}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div
            className="flex-1 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8E0E0E] to-[#E05009] flex items-center justify-center text-white font-black text-base shadow-sm overflow-hidden flex-shrink-0">
                  {settings?.logo_url ? (
                    <img src={settings.logo_url} alt={storeName || 'Logo'} className="w-full h-full object-cover" />
                  ) : (
                    <span>{storeName ? storeName.charAt(0).toUpperCase() : '🏪'}</span>
                  )}
                </div>
                <div>
                  <p className="font-black text-sm tracking-wider leading-none text-[#8E0E0E] uppercase">{storeName}</p>
                  {tagline && <p className="text-[8px] tracking-widest leading-none font-black uppercase text-gray-500 mt-1">{tagline}</p>}
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <Link
                href="/"
                className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                  location === '/'
                    ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
              <Link
                href="/menu"
                className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                  location === '/menu'
                    ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Menu
              </Link>

              {/* Event Section */}
              <div className="pt-2">
                <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Event</p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/promo"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/promo'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Promo
                  </Link>
                  <Link
                    href="/catering"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/catering'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Catering
                  </Link>
                </div>
              </div>

              {/* Direct Features */}
              <div className="pt-2 space-y-1">
                <Link
                  href="/gallery"
                  className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                    location === '/gallery'
                      ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Gallery
                </Link>
                <Link
                  href="/tracking"
                  className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                    location === '/tracking'
                      ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Lacak Pesanan
                </Link>
              </div>

              {/* Tentang Section */}
              <div className="pt-2">
                <p className="px-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">Tentang</p>
                <div className="mt-1 space-y-1">
                  <Link
                    href="/about"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/about'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Tentang Kami
                  </Link>
                  <Link
                    href="/contact"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/contact'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    Lokasi & Kontak
                  </Link>
                  <Link
                    href="/faq"
                    className={`flex items-center px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-colors ${
                      location === '/faq'
                        ? 'bg-[#8E0E0E]/10 text-[#8E0E0E]'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    FAQ
                  </Link>
                </div>
              </div>
            </nav>
 
            <div className="p-4 border-t">
              <Link
                href="/menu"
                className="block w-full text-center py-3 bg-gradient-to-r from-[#8E0E0E] to-[#E05009] text-white rounded-xl font-semibold"
              >
                Pesan Sekarang
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
